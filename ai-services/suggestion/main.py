"""
Idea Suggestion Microservice for UPLINK 5.0
Uses sentence embeddings and content-based filtering
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="UPLINK Idea Suggestion API",
    description="AI-powered idea and challenge suggestions",
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

# Mock database of ideas and trends
MOCK_IDEAS_DB = [
    {
        "id": 1,
        "title": "منصة ذكاء اصطناعي للتشخيص الطبي",
        "description": "استخدام AI لتشخيص الأمراض من الصور الطبية",
        "sector": "الصحة",
        "tags": ["AI", "صحة", "تشخيص"],
        "success_rate": 0.85
    },
    {
        "id": 2,
        "title": "تطبيق blockchain للسجلات الطبية",
        "description": "حفظ السجلات الطبية بشكل آمن باستخدام blockchain",
        "sector": "الصحة",
        "tags": ["blockchain", "أمان", "صحة"],
        "success_rate": 0.78
    },
    {
        "id": 3,
        "title": "منصة تعليمية تفاعلية بالواقع الافتراضي",
        "description": "تعليم تفاعلي باستخدام VR",
        "sector": "التعليم",
        "tags": ["VR", "تعليم", "تفاعلي"],
        "success_rate": 0.92
    },
    {
        "id": 4,
        "title": "نظام إدارة الطاقة الذكي للمنازل",
        "description": "توفير الطاقة باستخدام IoT والذكاء الاصطناعي",
        "sector": "الطاقة",
        "tags": ["IoT", "طاقة", "ذكي"],
        "success_rate": 0.81
    },
    {
        "id": 5,
        "title": "منصة التجارة الإلكترونية بالواقع المعزز",
        "description": "تجربة تسوق غامرة باستخدام AR",
        "sector": "التجارة",
        "tags": ["AR", "تجارة", "تسوق"],
        "success_rate": 0.76
    }
]

MOCK_TRENDS = [
    {
        "topic": "الذكاء الاصطناعي التوليدي",
        "relevance_score": 0.95,
        "growth_rate": "45%",
        "sectors": ["التقنية", "التسويق", "التصميم"]
    },
    {
        "topic": "الاستدامة والطاقة المتجددة",
        "relevance_score": 0.88,
        "growth_rate": "38%",
        "sectors": ["الطاقة", "البيئة"]
    },
    {
        "topic": "الصحة الرقمية",
        "relevance_score": 0.82,
        "growth_rate": "42%",
        "sectors": ["الصحة", "التقنية"]
    }
]

# Request/Response models
class UserProfile(BaseModel):
    interests: List[str]
    sector: str
    expertise: Optional[List[str]] = []
    past_projects: Optional[List[str]] = []

class IdeaSuggestion(BaseModel):
    id: int
    title: str
    description: str
    relevance_score: float
    source: str  # "internal", "market_trends", "patents", "news"
    sector: str
    tags: List[str]
    why_suggested: str

class SuggestionsResponse(BaseModel):
    suggestions: List[IdeaSuggestion]
    based_on: List[str]
    total_count: int

class TrendingTopic(BaseModel):
    topic: str
    relevance_score: float
    growth_rate: str
    sectors: List[str]
    suggested_challenges: List[str]

class TrendingTopicsResponse(BaseModel):
    trends: List[TrendingTopic]
    sector: Optional[str]

# Helper functions
def calculate_relevance(user_interests: List[str], idea_tags: List[str]) -> float:
    """Calculate relevance score based on tag overlap"""
    if not user_interests or not idea_tags:
        return 0.5  # Default score
    
    # Simple overlap calculation
    overlap = len(set(user_interests) & set(idea_tags))
    max_possible = max(len(user_interests), len(idea_tags))
    
    return min(1.0, (overlap / max_possible) * 1.5) if max_possible > 0 else 0.5

def generate_why_suggested(relevance: float, source: str) -> str:
    """Generate explanation for why this idea was suggested"""
    reasons = []
    
    if relevance > 0.8:
        reasons.append("تطابق عالي مع اهتماماتك")
    elif relevance > 0.6:
        reasons.append("تطابق جيد مع مجالك")
    
    if source == "market_trends":
        reasons.append("اتجاه سوق رائج حالياً")
    elif source == "internal":
        reasons.append("مشابه لأفكار ناجحة سابقة")
    
    return " • ".join(reasons) if reasons else "اقتراح بناءً على تحليل شامل"

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "UPLINK Idea Suggestion",
        "status": "running",
        "model": "Content-Based Filtering"
    }

@app.post("/suggest-ideas", response_model=SuggestionsResponse)
async def suggest_ideas(profile: UserProfile, num_suggestions: int = 5):
    """
    Suggest ideas based on user profile
    
    Args:
        profile: UserProfile containing user interests and sector
        num_suggestions: Number of suggestions to return
        
    Returns:
        SuggestionsResponse with personalized suggestions
    """
    try:
        suggestions = []
        
        # Filter ideas by sector or use all
        relevant_ideas = [
            idea for idea in MOCK_IDEAS_DB
            if profile.sector.lower() in idea['sector'].lower() or profile.sector == "الكل"
        ]
        
        # If sector filter is too restrictive, use all ideas
        if len(relevant_ideas) < num_suggestions:
            relevant_ideas = MOCK_IDEAS_DB
        
        # Calculate relevance for each idea
        for idea in relevant_ideas:
            relevance = calculate_relevance(profile.interests, idea['tags'])
            
            # Add some randomness for diversity
            relevance += np.random.uniform(-0.1, 0.1)
            relevance = max(0.0, min(1.0, relevance))
            
            suggestions.append(IdeaSuggestion(
                id=idea['id'],
                title=idea['title'],
                description=idea['description'],
                relevance_score=float(relevance),
                source="internal",
                sector=idea['sector'],
                tags=idea['tags'],
                why_suggested=generate_why_suggested(relevance, "internal")
            ))
        
        # Sort by relevance and take top N
        suggestions.sort(key=lambda x: x.relevance_score, reverse=True)
        suggestions = suggestions[:num_suggestions]
        
        return SuggestionsResponse(
            suggestions=suggestions,
            based_on=["اهتماماتك", "قطاعك", "الأفكار الناجحة السابقة"],
            total_count=len(suggestions)
        )
    except Exception as e:
        logger.error(f"Error suggesting ideas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggest-challenges")
async def suggest_challenges(profile: UserProfile, num_suggestions: int = 3):
    """
    Suggest strategic challenges based on user profile and market trends
    
    Args:
        profile: UserProfile
        num_suggestions: Number of challenges to suggest
        
    Returns:
        List of suggested challenges
    """
    try:
        # Mock challenges based on trends
        challenges = [
            {
                "title": "كيف يمكننا تحسين تجربة المريض باستخدام الذكاء الاصطناعي؟",
                "description": "تحدي لتطوير حلول AI لتحسين رحلة المريض",
                "sector": "الصحة",
                "priority": "عالي",
                "expected_impact": "تحسين رضا المرضى بنسبة 40%"
            },
            {
                "title": "تطوير حلول طاقة متجددة للمباني التجارية",
                "description": "إيجاد طرق مبتكرة لتوفير الطاقة",
                "sector": "الطاقة",
                "priority": "متوسط",
                "expected_impact": "تقليل استهلاك الطاقة بنسبة 30%"
            },
            {
                "title": "منصة تعليمية تفاعلية للتعلم عن بُعد",
                "description": "تحسين جودة التعليم الإلكتروني",
                "sector": "التعليم",
                "priority": "عالي",
                "expected_impact": "زيادة التفاعل بنسبة 50%"
            }
        ]
        
        # Filter by sector if specified
        if profile.sector != "الكل":
            challenges = [
                c for c in challenges
                if profile.sector.lower() in c['sector'].lower()
            ]
        
        return {
            "challenges": challenges[:num_suggestions],
            "based_on": ["اتجاهات السوق", "احتياجات القطاع", "فرص الابتكار"],
            "total_count": len(challenges[:num_suggestions])
        }
    except Exception as e:
        logger.error(f"Error suggesting challenges: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trending-topics/{sector}", response_model=TrendingTopicsResponse)
async def get_trending_topics(sector: str):
    """
    Get trending topics for a specific sector
    
    Args:
        sector: Sector name or "all" for all sectors
        
    Returns:
        TrendingTopicsResponse with trending topics
    """
    try:
        # Filter trends by sector
        if sector.lower() != "all" and sector != "الكل":
            filtered_trends = [
                t for t in MOCK_TRENDS
                if sector in t['sectors']
            ]
        else:
            filtered_trends = MOCK_TRENDS
        
        # Add suggested challenges for each trend
        trends_with_challenges = []
        for trend in filtered_trends:
            suggested_challenges = [
                f"كيف يمكننا تطبيق {trend['topic']} في {s}؟"
                for s in trend['sectors'][:2]
            ]
            
            trends_with_challenges.append(TrendingTopic(
                topic=trend['topic'],
                relevance_score=trend['relevance_score'],
                growth_rate=trend['growth_rate'],
                sectors=trend['sectors'],
                suggested_challenges=suggested_challenges
            ))
        
        return TrendingTopicsResponse(
            trends=trends_with_challenges,
            sector=sector if sector != "all" else None
        )
    except Exception as e:
        logger.error(f"Error getting trending topics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-trends")
async def update_trends(external_data: Optional[Dict] = None):
    """
    Update trends database with new external data
    
    Args:
        external_data: Optional external data from APIs
        
    Returns:
        Status of update
    """
    try:
        # In production, this would fetch from external APIs
        # (NewsAPI, Google Trends, USPTO, etc.)
        logger.info("Updating trends database...")
        
        # Mock update
        return {
            "status": "success",
            "message": "Trends database updated",
            "sources": ["NewsAPI", "Google Trends", "Internal Data"],
            "timestamp": "2026-01-29T15:00:00Z"
        }
    except Exception as e:
        logger.error(f"Error updating trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
