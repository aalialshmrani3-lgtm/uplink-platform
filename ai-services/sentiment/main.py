"""
Sentiment Analysis Microservice for UPLINK 5.0
Uses AraBERT for Arabic sentiment analysis
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from transformers import pipeline
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="UPLINK Sentiment Analysis API",
    description="Arabic sentiment analysis using AraBERT",
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

# Global sentiment analyzer (loaded once at startup)
sentiment_analyzer = None

@app.on_event("startup")
async def load_model():
    """Load the sentiment analysis model on startup"""
    global sentiment_analyzer
    try:
        logger.info("Loading AraBERT sentiment model...")
        # Using a multilingual model that supports Arabic
        # For production, use: "CAMeL-Lab/bert-base-arabic-camelbert-msa-sentiment"
        sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="nlptown/bert-base-multilingual-uncased-sentiment",
            device=-1  # CPU, use 0 for GPU
        )
        logger.info("✅ Model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise

# Request/Response models
class TextInput(BaseModel):
    text: str

class BatchTextInput(BaseModel):
    texts: List[str]

class SentimentResponse(BaseModel):
    text: str
    sentiment: str  # Positive, Negative, Neutral
    confidence: float
    emoji: str

class BatchSentimentResponse(BaseModel):
    results: List[SentimentResponse]

class IdeaSentimentSummary(BaseModel):
    idea_id: int
    total_comments: int
    positive_count: int
    negative_count: int
    neutral_count: int
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    overall_sentiment: str

# Helper function to map model output to our format
def map_sentiment(label: str, score: float) -> tuple:
    """Map model output to Positive/Negative/Neutral"""
    # For nlptown model: 1-2 stars = Negative, 3 stars = Neutral, 4-5 stars = Positive
    if "1 star" in label or "2 stars" in label:
        return "Negative", score, "😞"
    elif "3 stars" in label:
        return "Neutral", score, "😐"
    else:  # 4-5 stars
        return "Positive", score, "😊"

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "UPLINK Sentiment Analysis",
        "status": "running",
        "model": "bert-base-multilingual-uncased-sentiment"
    }

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(input_data: TextInput):
    """
    Analyze sentiment of a single text
    
    Args:
        input_data: TextInput containing the text to analyze
        
    Returns:
        SentimentResponse with sentiment, confidence, and emoji
    """
    try:
        if not input_data.text or len(input_data.text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Analyze sentiment
        result = sentiment_analyzer(input_data.text[:512])[0]  # Limit to 512 chars
        
        # Map to our format
        sentiment, confidence, emoji = map_sentiment(result['label'], result['score'])
        
        return SentimentResponse(
            text=input_data.text,
            sentiment=sentiment,
            confidence=confidence,
            emoji=emoji
        )
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-batch", response_model=BatchSentimentResponse)
async def analyze_batch(input_data: BatchTextInput):
    """
    Analyze sentiment of multiple texts in batch
    
    Args:
        input_data: BatchTextInput containing list of texts
        
    Returns:
        BatchSentimentResponse with results for all texts
    """
    try:
        if not input_data.texts or len(input_data.texts) == 0:
            raise HTTPException(status_code=400, detail="Texts list cannot be empty")
        
        # Limit each text to 512 chars
        texts = [t[:512] for t in input_data.texts]
        
        # Batch analyze
        results = sentiment_analyzer(texts)
        
        # Map results
        mapped_results = []
        for text, result in zip(input_data.texts, results):
            sentiment, confidence, emoji = map_sentiment(result['label'], result['score'])
            mapped_results.append(SentimentResponse(
                text=text,
                sentiment=sentiment,
                confidence=confidence,
                emoji=emoji
            ))
        
        return BatchSentimentResponse(results=mapped_results)
    except Exception as e:
        logger.error(f"Error in batch analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/idea-sentiment/{idea_id}", response_model=IdeaSentimentSummary)
async def get_idea_sentiment_summary(idea_id: int, comments: Optional[str] = None):
    """
    Get sentiment summary for an idea's comments
    
    Args:
        idea_id: ID of the idea
        comments: JSON string of comments (for testing)
        
    Returns:
        IdeaSentimentSummary with aggregated sentiment statistics
    """
    try:
        # In production, fetch comments from database
        # For now, we'll use provided comments or return mock data
        if not comments:
            # Mock data for demonstration
            return IdeaSentimentSummary(
                idea_id=idea_id,
                total_comments=10,
                positive_count=7,
                negative_count=2,
                neutral_count=1,
                positive_percentage=70.0,
                negative_percentage=20.0,
                neutral_percentage=10.0,
                overall_sentiment="Positive"
            )
        
        # Parse and analyze comments
        import json
        comment_list = json.loads(comments)
        
        # Analyze all comments
        results = sentiment_analyzer([c[:512] for c in comment_list])
        
        # Count sentiments
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        
        for result in results:
            sentiment, _, _ = map_sentiment(result['label'], result['score'])
            if sentiment == "Positive":
                positive_count += 1
            elif sentiment == "Negative":
                negative_count += 1
            else:
                neutral_count += 1
        
        total = len(results)
        
        # Determine overall sentiment
        if positive_count > negative_count and positive_count > neutral_count:
            overall = "Positive"
        elif negative_count > positive_count and negative_count > neutral_count:
            overall = "Negative"
        else:
            overall = "Neutral"
        
        return IdeaSentimentSummary(
            idea_id=idea_id,
            total_comments=total,
            positive_count=positive_count,
            negative_count=negative_count,
            neutral_count=neutral_count,
            positive_percentage=(positive_count / total * 100) if total > 0 else 0,
            negative_percentage=(negative_count / total * 100) if total > 0 else 0,
            neutral_percentage=(neutral_count / total * 100) if total > 0 else 0,
            overall_sentiment=overall
        )
    except Exception as e:
        logger.error(f"Error getting idea sentiment summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
