"""
Automatic Model Retraining Script
UPLINK 5.0 Platform

This script fetches real classified data from the database,
retrains the XGBoost model, and saves a new version with metrics.
"""

import os
import sys
import json
import pickle
import requests
from datetime import datetime
from pathlib import Path
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import xgboost as xgb

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
MODEL_DIR = Path(__file__).parent
MODELS_HISTORY_DIR = MODEL_DIR / "models_history"
MODELS_HISTORY_DIR.mkdir(exist_ok=True)

def fetch_training_data():
    """Fetch classified idea outcomes from the API"""
    print("📥 Fetching training data from API...")
    
    try:
        # Note: In production, you need to pass authentication token
        response = requests.get(f"{API_BASE_URL}/api/trpc/ideaOutcomes.getTrainingData")
        response.raise_for_status()
        
        data = response.json()
        if not data or 'result' not in data:
            print("❌ No data returned from API")
            return None
            
        training_data = data['result']['data']
        
        if not training_data or len(training_data) < 10:
            print(f"⚠️ Insufficient data: {len(training_data) if training_data else 0} samples (minimum 10 required)")
            return None
            
        print(f"✅ Fetched {len(training_data)} training samples")
        return training_data
        
    except Exception as e:
        print(f"❌ Error fetching training data: {e}")
        return None

def prepare_data(training_data):
    """Prepare features and labels from training data"""
    print("🔧 Preparing training data...")
    
    features = []
    labels = []
    
    for sample in training_data:
        feature_vector = [
            sample.get('budget', 0),
            sample.get('team_size', 0),
            sample.get('timeline_months', 0),
            sample.get('market_demand', 0),
            sample.get('technical_feasibility', 0),
            sample.get('competitive_advantage', 0),
            sample.get('user_engagement', 0),
            sample.get('tags_count', 0),
            sample.get('hypothesis_validation_rate', 0),
            sample.get('rat_completion_rate', 0),
            sample.get('title_length', 0),
            sample.get('description_length', 0),
        ]
        features.append(feature_vector)
        labels.append(sample.get('success', 0))
    
    X = np.array(features)
    y = np.array(labels)
    
    print(f"✅ Prepared {len(X)} samples with {X.shape[1]} features")
    print(f"   Success: {sum(y)} ({sum(y)/len(y)*100:.1f}%)")
    print(f"   Failure: {len(y)-sum(y)} ({(len(y)-sum(y))/len(y)*100:.1f}%)")
    
    return X, y

def train_model(X, y):
    """Train XGBoost model with cross-validation"""
    print("🤖 Training XGBoost model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"   Training set: {len(X_train)} samples")
    print(f"   Test set: {len(X_test)} samples")
    
    # Train model
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1_score': f1_score(y_test, y_pred, zero_division=0),
        'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
    }
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=min(5, len(X)//2), scoring='accuracy')
    metrics['cv_mean'] = cv_scores.mean()
    metrics['cv_std'] = cv_scores.std()
    
    print(f"✅ Model trained successfully!")
    print(f"   Accuracy: {metrics['accuracy']:.4f}")
    print(f"   Precision: {metrics['precision']:.4f}")
    print(f"   Recall: {metrics['recall']:.4f}")
    print(f"   F1 Score: {metrics['f1_score']:.4f}")
    print(f"   CV Score: {metrics['cv_mean']:.4f} (+/- {metrics['cv_std']:.4f})")
    
    return model, metrics

def save_model(model, metrics, training_data_count):
    """Save model and metrics with versioning"""
    print("💾 Saving model...")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    version_id = f"v{training_data_count}_{timestamp}"
    
    # Save current model (overwrite)
    model_path = MODEL_DIR / "success_model.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"   ✅ Saved current model: {model_path}")
    
    # Save historical version
    history_model_path = MODELS_HISTORY_DIR / f"success_model_{version_id}.pkl"
    with open(history_model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"   ✅ Saved historical model: {history_model_path}")
    
    # Save metrics
    metrics_data = {
        'version_id': version_id,
        'timestamp': timestamp,
        'training_samples': training_data_count,
        'metrics': metrics,
        'feature_names': [
            'budget', 'team_size', 'timeline_months', 'market_demand',
            'technical_feasibility', 'competitive_advantage', 'user_engagement',
            'tags_count', 'hypothesis_validation_rate', 'rat_completion_rate',
            'title_length', 'description_length'
        ]
    }
    
    # Update current metrics
    metrics_path = MODEL_DIR / "model_metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"   ✅ Saved current metrics: {metrics_path}")
    
    # Save historical metrics
    history_metrics_path = MODELS_HISTORY_DIR / f"metrics_{version_id}.json"
    with open(history_metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"   ✅ Saved historical metrics: {history_metrics_path}")
    
    # Update training report
    update_training_report(metrics_data)
    
    return version_id

def update_training_report(metrics_data):
    """Update training report with new version"""
    report_path = MODEL_DIR / "training_report.md"
    
    report_content = f"""# نموذج التنبؤ بنجاح الأفكار - تقرير التدريب

## 📊 النسخة الحالية: {metrics_data['version_id']}

**تاريخ التدريب:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**عدد العينات:** {metrics_data['training_samples']}

---

## 🎯 مقاييس الأداء

| المقياس | القيمة |
|---------|--------|
| **Accuracy** | {metrics_data['metrics']['accuracy']:.4f} |
| **Precision** | {metrics_data['metrics']['precision']:.4f} |
| **Recall** | {metrics_data['metrics']['recall']:.4f} |
| **F1 Score** | {metrics_data['metrics']['f1_score']:.4f} |
| **CV Mean** | {metrics_data['metrics']['cv_mean']:.4f} |
| **CV Std** | {metrics_data['metrics']['cv_std']:.4f} |

---

## 📈 Confusion Matrix

```
{metrics_data['metrics']['confusion_matrix']}
```

---

## 🔧 الميزات المستخدمة

{chr(10).join([f"{i+1}. {name}" for i, name in enumerate(metrics_data['feature_names'])])}

---

## 📝 ملاحظات

- تم تدريب النموذج على **{metrics_data['training_samples']} فكرة حقيقية** مصنفة من قبل المشرفين
- النموذج يستخدم **XGBoost** مع 100 شجرة قرار
- تم حفظ نسخة تاريخية من النموذج في `models_history/`

---

## 🚀 الخطوات التالية

1. جمع المزيد من البيانات الحقيقية (الهدف: 1000+ فكرة)
2. تحليل Feature Importance لتحديد أهم العوامل
3. تجربة نماذج أخرى (Random Forest, Neural Networks)
4. تطبيق Hyperparameter Tuning لتحسين الأداء
"""
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)
    
    print(f"   ✅ Updated training report: {report_path}")

def main():
    """Main retraining workflow"""
    print("=" * 80)
    print("🔄 UPLINK 5.0 - Automatic Model Retraining")
    print("=" * 80)
    print()
    
    # Step 1: Fetch training data
    training_data = fetch_training_data()
    if not training_data:
        print("❌ Retraining aborted: No training data available")
        sys.exit(1)
    
    # Step 2: Prepare data
    X, y = prepare_data(training_data)
    
    # Step 3: Train model
    model, metrics = train_model(X, y)
    
    # Step 4: Save model
    version_id = save_model(model, metrics, len(training_data))
    
    print()
    print("=" * 80)
    print(f"✅ Retraining completed successfully!")
    print(f"   Version: {version_id}")
    print(f"   Accuracy: {metrics['accuracy']:.4f}")
    print("=" * 80)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
