#!/usr/bin/env python3
"""
Train XGBoost model for idea success prediction
"""
import json
import pickle
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from xgboost import XGBClassifier

def load_data(file_path):
    """Load training data from JSON"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def extract_features(ideas):
    """Extract numerical features from ideas"""
    features = []
    labels = []
    
    for idea in ideas:
        # Feature engineering
        feature_vector = [
            idea['budget'] / 100000,  # Normalize budget
            idea['team_size'],
            idea['timeline_months'],
            idea['market_demand'] / 100,
            idea['tech_feasibility'] / 100,
            idea['competitive_advantage'] / 100,
            idea['user_engagement'] / 100,
            idea['tags_count'],
            idea['hypothesis_validation_rate'],
            idea['rat_completion_rate'],
            len(idea['title']),  # Title length
            len(idea['description']),  # Description length
        ]
        
        features.append(feature_vector)
        labels.append(idea['success'])
    
    return np.array(features), np.array(labels)

def train_model(X_train, y_train):
    """Train XGBoost classifier"""
    model = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance"""
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'confusion_matrix': cm.tolist()
    }

def main():
    """Main training pipeline"""
    print("🔄 Loading training data...")
    ideas = load_data("/home/ubuntu/uplink-platform/ai-services/prediction/training_data.json")
    
    print(f"📊 Loaded {len(ideas)} ideas")
    
    print("🔄 Extracting features...")
    X, y = extract_features(ideas)
    
    print(f"✅ Features shape: {X.shape}")
    print(f"✅ Labels shape: {y.shape}")
    print(f"✅ Success rate: {y.mean():.2%}")
    
    # Split data
    print("🔄 Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"✅ Train set: {len(X_train)} samples")
    print(f"✅ Test set: {len(X_test)} samples")
    
    # Train model
    print("🔄 Training XGBoost model...")
    model = train_model(X_train, y_train)
    
    print("✅ Model trained successfully!")
    
    # Evaluate
    print("🔄 Evaluating model...")
    metrics = evaluate_model(model, X_test, y_test)
    
    print("\n📊 Model Performance:")
    print(f"   - Accuracy:  {metrics['accuracy']:.2%}")
    print(f"   - Precision: {metrics['precision']:.2%}")
    print(f"   - Recall:    {metrics['recall']:.2%}")
    print(f"   - F1 Score:  {metrics['f1_score']:.2%}")
    print(f"\n   Confusion Matrix:")
    print(f"   {metrics['confusion_matrix']}")
    
    # Save model
    model_path = "/home/ubuntu/uplink-platform/ai-services/prediction/success_model.pkl"
    print(f"\n🔄 Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print("✅ Model saved successfully!")
    
    # Save metrics
    metrics_path = "/home/ubuntu/uplink-platform/ai-services/prediction/model_metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✅ Metrics saved to {metrics_path}")
    
    # Feature importance
    feature_names = [
        'budget', 'team_size', 'timeline', 'market_demand', 'tech_feasibility',
        'competitive_advantage', 'user_engagement', 'tags_count',
        'hypothesis_rate', 'rat_rate', 'title_length', 'description_length'
    ]
    
    importance = model.feature_importances_
    print("\n📊 Feature Importance:")
    for name, imp in sorted(zip(feature_names, importance), key=lambda x: x[1], reverse=True):
        print(f"   - {name}: {imp:.4f}")

if __name__ == "__main__":
    main()
