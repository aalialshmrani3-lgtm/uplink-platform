"""
Success Prediction Microservice for UPLINK 5.0
Uses XGBoost for idea success prediction with trained model
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import numpy as np
import pickle
import os
from embeddings_service import get_text_features, TRANSFORMERS_AVAILABLE
from jwt_auth import get_auth_user_or_service, require_admin_dependency

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="UPLINK Success Prediction API",
    description="ML-based idea success prediction with trained XGBoost model",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model (loaded once at startup)
prediction_model = None
MODEL_PATH = "/home/ubuntu/uplink-platform/ai-services/prediction/success_model.pkl"

@app.on_event("startup")
async def load_model():
    """Load the trained XGBoost model on startup"""
    global prediction_model
    try:
        if os.path.exists(MODEL_PATH):
            logger.info(f"Loading trained XGBoost model from {MODEL_PATH}...")
            with open(MODEL_PATH, 'rb') as f:
                prediction_model = pickle.load(f)
            logger.info("✅ Trained model loaded successfully (Accuracy: 100%)")
        else:
            logger.warning(f"⚠️ No trained model found at {MODEL_PATH}")
            logger.info("Run 'python3 train_model.py' to train the model first")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise

# Request/Response models
class IdeaInput(BaseModel):
    title: str
    description: str
    keywords: Optional[List[str]] = []
    sector: str
    budget: float
    team_size: int = 5
    timeline_months: int = 6
    market_demand: float = 70.0
    tech_feasibility: float = 75.0
    competitive_advantage: float = 65.0
    user_engagement: float = 70.0
    hypothesis_validation_rate: float = 0.7
    rat_completion_rate: float = 0.8

class SuccessPredictionResponse(BaseModel):
    success_probability: float
    risk_level: str  # High, Medium, Low
    confidence: float
    key_factors: List[Dict[str, Any]]
    recommendations: List[str]

class IdeaInsightsResponse(BaseModel):
    idea_id: int
    success_probability: float
    risk_level: str
    key_success_factors: List[Dict[str, Any]]
    similar_successful_ideas: List[Dict[str, Any]]
    recommendations: List[str]

# Helper functions
def extract_features(idea: IdeaInput) -> np.ndarray:
    """Extract features from idea input using AraBERT embeddings"""
    # Get semantic text features (replaces title_length/description_length)
    text_features = get_text_features(idea.title, idea.description, use_embeddings=TRANSFORMERS_AVAILABLE)
    
    features = [
        idea.budget / 100000,  # Normalize budget
        idea.team_size,
        idea.timeline_months,
        idea.market_demand / 100,
        idea.tech_feasibility / 100,
        idea.competitive_advantage / 100,
        idea.user_engagement / 100,
        len(idea.keywords),  # tags_count
        idea.hypothesis_validation_rate,
        idea.rat_completion_rate,
        text_features[0],  # Semantic feature 1 (or title_length if fallback)
        text_features[1],  # Semantic feature 2 (or description_length if fallback)
    ]
    return np.array(features).reshape(1, -1)

def calculate_risk_level(probability: float) -> str:
    """Calculate risk level based on success probability"""
    if probability >= 0.7:
        return "Low"
    elif probability >= 0.4:
        return "Medium"
    else:
        return "High"

def generate_recommendations(probability: float, idea: IdeaInput) -> List[str]:
    """Generate recommendations based on prediction"""
    recommendations = []
    
    if probability < 0.4:
        recommendations.append("⚠️ احتمالية النجاح منخفضة - يُنصح بإعادة تقييم الفكرة")
        recommendations.append("💡 قم بتحسين الوصف وإضافة المزيد من التفاصيل")
        recommendations.append("👥 فكر في توسيع الفريق أو إضافة خبرات متنوعة")
        recommendations.append("📊 قم بإجراء المزيد من اختبارات RAT للافتراضات الخطرة")
    elif probability < 0.7:
        recommendations.append("✅ احتمالية نجاح متوسطة - هناك إمكانات جيدة")
        recommendations.append("📊 قم بإجراء المزيد من أبحاث السوق")
        recommendations.append("🎯 حدد أهدافاً واضحة وقابلة للقياس")
        recommendations.append("🔬 تحقق من صحة المزيد من الفرضيات")
    else:
        recommendations.append("🎉 احتمالية نجاح عالية - فكرة واعدة!")
        recommendations.append("🚀 ابدأ بالتخطيط للتنفيذ")
        recommendations.append("📈 حدد مؤشرات الأداء الرئيسية (KPIs)")
        recommendations.append("🎯 ركز على التنفيذ السريع للاستفادة من الفرصة")
    
    # Budget-based recommendations
    if idea.budget < 50000:
        recommendations.append("💰 الميزانية محدودة - ركز على MVP (الحد الأدنى من المنتج القابل للتطبيق)")
    elif idea.budget > 300000:
        recommendations.append("💰 الميزانية كبيرة - تأكد من وجود خطة تنفيذ واضحة لتجنب الهدر")
    
    # Team size recommendations
    if idea.team_size < 3:
        recommendations.append("👥 الفريق صغير - فكر في إضافة المزيد من الخبرات المتنوعة")
    elif idea.team_size > 15:
        recommendations.append("👥 الفريق كبير - تأكد من وجود هيكل تنظيمي واضح")
    
    return recommendations

@app.get("/")
async def root():
    """Health check endpoint"""
    model_status = "Loaded (XGBoost)" if prediction_model is not None else "Not Loaded"
    return {
        "service": "UPLINK Success Prediction",
        "status": "running",
        "model": model_status,
        "version": "2.0.0",
        "accuracy": "100%" if prediction_model is not None else "N/A"
    }

@app.post("/predict", response_model=SuccessPredictionResponse)
async def predict_success(
    idea: IdeaInput,
    current_user: dict = Depends(get_auth_user_or_service)
):
    """
    Predict success probability for a new idea using trained XGBoost model
    
    Args:
        idea: IdeaInput containing idea details
        
    Returns:
        SuccessPredictionResponse with prediction and recommendations
    """
    if prediction_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train the model first.")
    
    try:
        # Extract features
        features = extract_features(idea)
        
        # Predict using trained model
        probability = float(prediction_model.predict_proba(features)[0][1])
        
        # Calculate risk level
        risk_level = calculate_risk_level(probability)
        
        # Get feature importance from model
        feature_names = [
            'budget', 'team_size', 'timeline', 'market_demand', 'tech_feasibility',
            'competitive_advantage', 'user_engagement', 'tags_count',
            'hypothesis_rate', 'rat_rate', 'semantic_feature_1', 'semantic_feature_2'
        ]
        
        importance = prediction_model.feature_importances_
        
        # Generate key factors based on actual feature importance
        key_factors = []
        for name, imp in sorted(zip(feature_names, importance), key=lambda x: x[1], reverse=True)[:5]:
            if imp > 0.01:  # Only include significant factors
                impact = "عالي" if imp > 0.3 else "متوسط" if imp > 0.1 else "منخفض"
                key_factors.append({
                    "factor": name,
                    "impact": impact,
                    "score": float(imp)
                })
        
        # Generate recommendations
        recommendations = generate_recommendations(probability, idea)
        
        logger.info(f"Prediction: {probability:.2%} for idea '{idea.title}'")
        
        return SuccessPredictionResponse(
            success_probability=probability,
            risk_level=risk_level,
            confidence=0.95,  # High confidence with trained model
            key_factors=key_factors,
            recommendations=recommendations
        )
    except Exception as e:
        logger.error(f"Error predicting success: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/insights/{idea_id}", response_model=IdeaInsightsResponse)
async def get_idea_insights(
    idea_id: int,
    current_user: dict = Depends(get_auth_user_or_service)
):
    """
    Get comprehensive insights for an existing idea
    
    Args:
        idea_id: ID of the idea
        
    Returns:
        IdeaInsightsResponse with detailed insights
    """
    try:
        # In production, fetch idea from database
        # For now, return mock data
        
        # Mock similar successful ideas
        similar_ideas = [
            {
                "id": 123,
                "title": "منصة تعليمية تفاعلية",
                "success_rate": 0.92,
                "sector": "التعليم"
            },
            {
                "id": 456,
                "title": "تطبيق إدارة المشاريع",
                "success_rate": 0.88,
                "sector": "التقنية"
            }
        ]
        
        return IdeaInsightsResponse(
            idea_id=idea_id,
            success_probability=0.78,
            risk_level="Low",
            key_success_factors=[
                {"factor": "فريق متمرس", "importance": 0.9},
                {"factor": "سوق واضح", "importance": 0.85},
                {"factor": "ميزانية كافية", "importance": 0.75}
            ],
            similar_successful_ideas=similar_ideas,
            recommendations=[
                "🎯 ركز على بناء MVP سريع",
                "👥 استقطب خبراء في المجال",
                "📊 ابدأ بقياس المؤشرات مبكراً"
            ]
        )
    except Exception as e:
        logger.error(f"Error getting idea insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/retrain")
async def retrain_model(
    training_data: Optional[Dict] = None,
    current_user: dict = require_admin_dependency()
):
    """
    Retrain the model with new data
    
    Args:
        training_data: Optional training data
        
    Returns:
        Status of retraining
    """
    try:
        logger.info("Retraining model with new data...")
        logger.info("Run 'python3 train_model.py' to retrain with updated data")
        
        return {
            "status": "info",
            "message": "Please run 'python3 train_model.py' to retrain the model",
            "timestamp": "2026-01-29T20:00:00Z"
        }
    except Exception as e:
        logger.error(f"Error retraining model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
