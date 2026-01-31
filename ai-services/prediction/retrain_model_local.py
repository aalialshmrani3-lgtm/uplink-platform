"""
Local Model Retraining Script
UPLINK 5.0 Platform

This script trains the XGBoost model using local JSON data.
"""

import os
import json
import pickle
from datetime import datetime
from pathlib import Path
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import xgboost as xgb

# Configuration
MODEL_DIR = Path(__file__).parent
MODELS_HISTORY_DIR = MODEL_DIR / "models_history"
MODELS_HISTORY_DIR.mkdir(exist_ok=True)
DATA_FILE = MODEL_DIR / "ideas_outcomes_seed_data.json"

def extract_features(sample):
    """Extract features from a single sample"""
    features = []
    
    # Numerical features (10 features)
    features.append(float(sample.get('budget', 0)))
    features.append(float(sample.get('team_size', 0)))
    features.append(float(sample.get('timeline_months', 0)))
    features.append(float(sample.get('market_demand', 50)))
    features.append(float(sample.get('technical_feasibility', 50)))
    features.append(float(sample.get('user_engagement', 50)))
    features.append(float(sample.get('hypothesis_validation_rate', 0.5)))
    features.append(float(sample.get('rat_completion_rate', 0.5)))
    features.append(float(sample.get('user_count', 0)))
    
    # Convert percentage strings to floats
    revenue_growth = sample.get('revenue_growth', 0)
    if isinstance(revenue_growth, str) and '%' in revenue_growth:
        revenue_growth = float(revenue_growth.replace('%', '')) / 100
    features.append(float(revenue_growth))
    
    # Text features (simple: title + description length)
    title = sample.get('title', '')
    description = sample.get('description', '')
    features.append(float(len(title)))
    features.append(float(len(description)))
    
    return features

def load_training_data():
    """Load training data from JSON file"""
    print(f"📥 Loading training data from {DATA_FILE}...")
    
    if not DATA_FILE.exists():
        print(f"❌ Data file not found: {DATA_FILE}")
        return None
    
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if not data or len(data) < 10:
        print(f"⚠️ Insufficient data: {len(data)} samples (minimum 10 required)")
        return None
    
    print(f"✅ Loaded {len(data)} training samples")
    return data

def prepare_training_data(training_data):
    """Prepare features and labels for training"""
    print("🔧 Preparing training data...")
    
    X = []
    y = []
    
    for sample in training_data:
        try:
            features = extract_features(sample)
            X.append(features)
            
            # Label: 1 for success, 0 for failure
            outcome = sample.get('outcome', 'failure')
            if isinstance(outcome, str):
                success = outcome.lower() == 'success'
            else:
                success = bool(outcome)
            y.append(1 if success else 0)
            
        except Exception as e:
            print(f"⚠️ Skipping sample due to error: {e}")
            continue
    
    X = np.array(X)
    y = np.array(y)
    
    print(f"✅ Prepared {len(X)} samples")
    print(f"   Features shape: {X.shape}")
    print(f"   Success rate: {np.mean(y):.2%}")
    
    return X, y

def train_model(X, y):
    """Train XGBoost model"""
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
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print(f"\n📊 Model Performance:")
    print(f"   Accuracy:  {accuracy:.4f}")
    print(f"   Precision: {precision:.4f}")
    print(f"   Recall:    {recall:.4f}")
    print(f"   F1 Score:  {f1:.4f}")
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"\n   Confusion Matrix:")
    print(f"   TN: {cm[0][0]}, FP: {cm[0][1]}")
    print(f"   FN: {cm[1][0]}, TP: {cm[1][1]}")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    print(f"\n   Cross-validation scores: {cv_scores}")
    print(f"   Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
    metrics = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'cv_mean': float(cv_scores.mean()),
        'cv_std': float(cv_scores.std()),
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'success_rate': float(np.mean(y))
    }
    
    return model, metrics

def save_model(model, metrics):
    """Save model and metrics"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save current model
    model_path = MODEL_DIR / "model.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"✅ Saved model to {model_path}")
    
    # Save to history
    history_model_path = MODELS_HISTORY_DIR / f"model_{timestamp}.pkl"
    with open(history_model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"✅ Saved model history to {history_model_path}")
    
    # Save metrics
    metrics['timestamp'] = timestamp
    metrics['trained_at'] = datetime.now().isoformat()
    
    metrics_path = MODEL_DIR / "model_metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"✅ Saved metrics to {metrics_path}")
    
    # Save metrics history
    history_metrics_path = MODELS_HISTORY_DIR / f"metrics_{timestamp}.json"
    with open(history_metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    print(f"✅ Saved metrics history to {history_metrics_path}")

def main():
    print("=" * 80)
    print("🔄 UPLINK 5.0 - Local Model Retraining")
    print("=" * 80)
    
    # Load data
    training_data = load_training_data()
    if training_data is None:
        print("❌ Retraining aborted: No training data available")
        return
    
    # Prepare data
    X, y = prepare_training_data(training_data)
    if len(X) < 10:
        print("❌ Retraining aborted: Insufficient prepared data")
        return
    
    # Train model
    model, metrics = train_model(X, y)
    
    # Save model
    save_model(model, metrics)
    
    print("\n" + "=" * 80)
    print("✅ Model retraining completed successfully!")
    print("=" * 80)

if __name__ == "__main__":
    main()
