"""
A/B Testing Script for ML Models
UPLINK 5.0 Platform

Compare performance of multiple models (XGBoost, Random Forest, Neural Network)
and automatically select the best one.
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
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
import xgboost as xgb

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
MODEL_DIR = Path(__file__).parent
AB_RESULTS_DIR = MODEL_DIR / "ab_testing_results"
AB_RESULTS_DIR.mkdir(exist_ok=True)

def fetch_training_data():
    """Fetch classified idea outcomes from the API"""
    print("📥 Fetching training data from API...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/trpc/ideaOutcomes.getTrainingData")
        response.raise_for_status()
        
        data = response.json()
        if not data or 'result' not in data:
            print("❌ No data returned from API")
            return None
            
        training_data = data['result']['data']
        
        if not training_data or len(training_data) < 20:
            print(f"⚠️ Insufficient data: {len(training_data) if training_data else 0} samples (minimum 20 required for A/B testing)")
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
    return X, y

def train_and_evaluate_model(model, model_name, X_train, X_test, y_train, y_test, X, y):
    """Train and evaluate a single model"""
    print(f"\n🤖 Training {model_name}...")
    
    # Train
    model.fit(X_train, y_train)
    
    # Predict
    y_pred = model.predict(X_test)
    
    # Evaluate
    metrics = {
        'model_name': model_name,
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1_score': f1_score(y_test, y_pred, zero_division=0),
        'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
    }
    
    # Cross-validation
    try:
        cv_scores = cross_val_score(model, X, y, cv=min(5, len(X)//2), scoring='accuracy')
        metrics['cv_mean'] = cv_scores.mean()
        metrics['cv_std'] = cv_scores.std()
    except Exception as e:
        print(f"   ⚠️ Cross-validation failed: {e}")
        metrics['cv_mean'] = metrics['accuracy']
        metrics['cv_std'] = 0.0
    
    print(f"   ✅ {model_name} Results:")
    print(f"      Accuracy: {metrics['accuracy']:.4f}")
    print(f"      Precision: {metrics['precision']:.4f}")
    print(f"      Recall: {metrics['recall']:.4f}")
    print(f"      F1 Score: {metrics['f1_score']:.4f}")
    print(f"      CV Score: {metrics['cv_mean']:.4f} (+/- {metrics['cv_std']:.4f})")
    
    return model, metrics

def run_ab_testing(X, y):
    """Run A/B testing on multiple models"""
    print("\n" + "="*80)
    print("🔬 Starting A/B Testing")
    print("="*80)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Define models
    models = {
        'XGBoost': xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
            eval_metric='logloss'
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        ),
        'Neural Network': MLPClassifier(
            hidden_layer_sizes=(64, 32),
            max_iter=500,
            random_state=42,
            early_stopping=True
        )
    }
    
    # Train and evaluate each model
    results = {}
    trained_models = {}
    
    for model_name, model in models.items():
        try:
            trained_model, metrics = train_and_evaluate_model(
                model, model_name, X_train, X_test, y_train, y_test, X, y
            )
            results[model_name] = metrics
            trained_models[model_name] = trained_model
        except Exception as e:
            print(f"   ❌ Error training {model_name}: {e}")
            results[model_name] = {
                'model_name': model_name,
                'accuracy': 0.0,
                'error': str(e)
            }
    
    return trained_models, results

def select_best_model(results):
    """Select the best model based on F1 score"""
    print("\n" + "="*80)
    print("🏆 Selecting Best Model")
    print("="*80)
    
    # Sort by F1 score
    sorted_models = sorted(
        [(name, metrics.get('f1_score', 0)) for name, metrics in results.items()],
        key=lambda x: x[1],
        reverse=True
    )
    
    print("\n📊 Model Rankings (by F1 Score):")
    for rank, (name, f1) in enumerate(sorted_models, 1):
        print(f"   {rank}. {name}: {f1:.4f}")
    
    best_model_name = sorted_models[0][0]
    best_f1 = sorted_models[0][1]
    
    print(f"\n✅ Winner: {best_model_name} (F1 Score: {best_f1:.4f})")
    
    return best_model_name

def save_results(trained_models, results, best_model_name, training_samples):
    """Save A/B testing results and best model"""
    print("\n💾 Saving results...")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save comparison results
    comparison_data = {
        'timestamp': timestamp,
        'training_samples': training_samples,
        'best_model': best_model_name,
        'results': results
    }
    
    results_path = AB_RESULTS_DIR / f"ab_test_{timestamp}.json"
    with open(results_path, 'w') as f:
        json.dump(comparison_data, f, indent=2)
    print(f"   ✅ Saved comparison results: {results_path}")
    
    # Save best model
    best_model = trained_models[best_model_name]
    model_path = MODEL_DIR / "success_model.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
    print(f"   ✅ Saved best model ({best_model_name}): {model_path}")
    
    # Save metrics
    metrics_data = {
        'version_id': f'ab_{timestamp}',
        'timestamp': timestamp,
        'training_samples': training_samples,
        'model_type': best_model_name,
        'metrics': results[best_model_name],
        'ab_testing': True,
        'all_results': results
    }
    
    metrics_path = MODEL_DIR / "model_metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"   ✅ Saved metrics: {metrics_path}")
    
    # Update training report
    update_training_report(metrics_data)
    
    return timestamp

def update_training_report(metrics_data):
    """Update training report with A/B testing results"""
    report_path = MODEL_DIR / "training_report.md"
    
    best_metrics = metrics_data['metrics']
    all_results = metrics_data.get('all_results', {})
    
    report_content = f"""# نموذج التنبؤ بنجاح الأفكار - تقرير A/B Testing

## 📊 النسخة الحالية: {metrics_data['version_id']}

**تاريخ التدريب:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**عدد العينات:** {metrics_data['training_samples']}  
**النموذج المختار:** **{metrics_data['model_type']}** 🏆

---

## 🔬 نتائج A/B Testing

تم اختبار 3 نماذج مختلفة واختيار الأفضل بناءً على F1 Score:

| النموذج | Accuracy | Precision | Recall | F1 Score | CV Mean |
|---------|----------|-----------|--------|----------|---------|
"""
    
    for model_name, metrics in all_results.items():
        is_winner = "🏆 " if model_name == metrics_data['model_type'] else ""
        report_content += f"| {is_winner}{model_name} | {metrics.get('accuracy', 0):.4f} | {metrics.get('precision', 0):.4f} | {metrics.get('recall', 0):.4f} | {metrics.get('f1_score', 0):.4f} | {metrics.get('cv_mean', 0):.4f} |\n"
    
    report_content += f"""
---

## 🎯 مقاييس النموذج الفائز ({metrics_data['model_type']})

| المقياس | القيمة |
|---------|--------|
| **Accuracy** | {best_metrics.get('accuracy', 0):.4f} |
| **Precision** | {best_metrics.get('precision', 0):.4f} |
| **Recall** | {best_metrics.get('recall', 0):.4f} |
| **F1 Score** | {best_metrics.get('f1_score', 0):.4f} |
| **CV Mean** | {best_metrics.get('cv_mean', 0):.4f} |
| **CV Std** | {best_metrics.get('cv_std', 0):.4f} |

---

## 📈 Confusion Matrix

```
{best_metrics.get('confusion_matrix', [])}
```

---

## 📝 ملاحظات

- تم اختبار **3 نماذج** مختلفة: XGBoost, Random Forest, Neural Network
- تم اختيار **{metrics_data['model_type']}** كأفضل نموذج بناءً على F1 Score
- تم التدريب على **{metrics_data['training_samples']} فكرة حقيقية** مصنفة
- نتائج A/B Testing محفوظة في `ab_testing_results/`

---

## 🚀 الخطوات التالية

1. جمع المزيد من البيانات الحقيقية (الهدف: 1000+ فكرة)
2. إعادة A/B Testing دوريًا مع تحديث البيانات
3. تجربة hyperparameter tuning للنموذج الفائز
4. مراقبة أداء النموذج على البيانات الحقيقية
"""
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)
    
    print(f"   ✅ Updated training report: {report_path}")

def main():
    """Main A/B testing workflow"""
    print("=" * 80)
    print("🔬 UPLINK 5.0 - A/B Testing for ML Models")
    print("=" * 80)
    print()
    
    # Step 1: Fetch training data
    training_data = fetch_training_data()
    if not training_data:
        print("❌ A/B Testing aborted: No training data available")
        sys.exit(1)
    
    # Step 2: Prepare data
    X, y = prepare_data(training_data)
    
    # Step 3: Run A/B testing
    trained_models, results = run_ab_testing(X, y)
    
    # Step 4: Select best model
    best_model_name = select_best_model(results)
    
    # Step 5: Save results
    timestamp = save_results(trained_models, results, best_model_name, len(training_data))
    
    print()
    print("=" * 80)
    print(f"✅ A/B Testing completed successfully!")
    print(f"   Winner: {best_model_name}")
    print(f"   F1 Score: {results[best_model_name]['f1_score']:.4f}")
    print(f"   Results saved: ab_test_{timestamp}.json")
    print("=" * 80)
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
