"""
Success Prediction Microservice for UPLINK 5.0
Uses XGBoost for idea success prediction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="UPLINK Success Prediction API",
    description="ML-based idea success prediction",
    version="1.0.0"
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
MODEL_PATH = "/tmp/success_prediction_model.pkl"

@app.on_event("startup")
async def load_model():
    """Load or create the prediction model on startup"""
    global prediction_model
    try:
        if os.path.exists(MODEL_PATH):
            logger.info(f"Loading existing model from {MODEL_PATH}...")
            prediction_model = joblib.load(MODEL_PATH)
            logger.info("✅ Model loaded successfully")
        else:
            logger.info("No existing model found, creating mock model...")
            # Create a simple mock model for demonstration
            # In production, this would be trained on real data
            prediction_model = RandomForestClassifier(n_estimators=100, random_state=42)
            # Mock training data (features: title_length, description_length, budget, sector_encoded)
            X_mock = np.random.rand(100, 4)
            y_mock = np.random.choice([0, 1], 100)  # 0=fail, 1=success
            prediction_model.fit(X_mock, y_mock)
            joblib.dump(prediction_model, MODEL_PATH)
            logger.info("✅ Mock model created and saved")
    except Exception as e:
        logger.error(f"❌ Failed to load/create model: {e}")
        raise

# Request/Response models
class IdeaInput(BaseModel):
    title: str
    description: str
    keywords: Optional[List[str]] = []
    sector: str
    budget: float
    team_size: Optional[int] = 1

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
    """Extract features from idea input"""
    # Simple feature extraction for demonstration
    features = [
        len(idea.title),  # Title length
        len(idea.description),  # Description length
        idea.budget,  # Budget
        hash(idea.sector) % 10,  # Sector encoded (mock)
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
    elif probability < 0.7:
        recommendations.append("✅ احتمالية نجاح متوسطة - هناك إمكانات جيدة")
        recommendations.append("📊 قم بإجراء المزيد من أبحاث السوق")
        recommendations.append("🎯 حدد أهدافاً واضحة وقابلة للقياس")
    else:
        recommendations.append("🎉 احتمالية نجاح عالية - فكرة واعدة!")
        recommendations.append("🚀 ابدأ بالتخطيط للتنفيذ")
        recommendations.append("📈 حدد مؤشرات الأداء الرئيسية (KPIs)")
    
    # Budget-based recommendations
    if idea.budget < 10000:
        recommendations.append("💰 الميزانية محدودة - ركز على MVP (الحد الأدنى من المنتج القابل للتطبيق)")
    
    return recommendations

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "UPLINK Success Prediction",
        "status": "running",
        "model": "RandomForest (Mock)"
    }

@app.post("/predict", response_model=SuccessPredictionResponse)
async def predict_success(idea: IdeaInput):
    """
    Predict success probability for a new idea
    
    Args:
        idea: IdeaInput containing idea details
        
    Returns:
        SuccessPredictionResponse with prediction and recommendations
    """
    try:
        # Extract features
        features = extract_features(idea)
        
        # Predict
        probability = prediction_model.predict_proba(features)[0][1]  # Probability of success
        
        # Calculate risk level
        risk_level = calculate_risk_level(probability)
        
        # Generate key factors (mock - in production, use SHAP values)
        key_factors = [
            {"factor": "الوصف التفصيلي", "impact": "عالي", "score": 0.85},
            {"factor": "الميزانية المناسبة", "impact": "متوسط", "score": 0.65},
            {"factor": "القطاع الواعد", "impact": "متوسط", "score": 0.70},
        ]
        
        # Generate recommendations
        recommendations = generate_recommendations(probability, idea)
        
        return SuccessPredictionResponse(
            success_probability=float(probability),
            risk_level=risk_level,
            confidence=0.75,  # Mock confidence
            key_factors=key_factors,
            recommendations=recommendations
        )
    except Exception as e:
        logger.error(f"Error predicting success: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/insights/{idea_id}", response_model=IdeaInsightsResponse)
async def get_idea_insights(idea_id: int):
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
async def retrain_model(training_data: Optional[Dict] = None):
    """
    Retrain the model with new data
    
    Args:
        training_data: Optional training data
        
    Returns:
        Status of retraining
    """
    try:
        # In production, this would retrain with real data from database
        logger.info("Retraining model with new data...")
        
        # Mock retraining
        global prediction_model
        X_new = np.random.rand(50, 4)
        y_new = np.random.choice([0, 1], 50)
        prediction_model.fit(X_new, y_new)
        
        # Save updated model
        joblib.dump(prediction_model, MODEL_PATH)
        
        logger.info("✅ Model retrained successfully")
        return {
            "status": "success",
            "message": "Model retrained and saved",
            "timestamp": "2026-01-29T15:00:00Z"
        }
    except Exception as e:
        logger.error(f"Error retraining model: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
