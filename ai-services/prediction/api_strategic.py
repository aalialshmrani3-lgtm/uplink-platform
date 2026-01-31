"""
FastAPI Endpoint for Strategic Analysis
UPLINK 5.0 Platform
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from strategic_bridge_protocol import StrategicBridgeProtocol
import uvicorn

app = FastAPI(title="UPLINK Strategic Analysis API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Strategic Bridge Protocol
strategic_bridge = StrategicBridgeProtocol()

class ProjectInput(BaseModel):
    title: str
    description: str
    budget: str
    team_size: str
    timeline_months: str
    market_demand: str
    technical_feasibility: str
    user_engagement: str
    hypothesis_validation_rate: str
    rat_completion_rate: str
    user_count: str
    revenue_growth: str

@app.post("/analyze")
async def analyze_project(project: ProjectInput):
    """
    Analyze project using Strategic Bridge Protocol
    """
    try:
        # Convert input to features dict
        features = {
            'title': project.title,
            'description': project.description,
            'budget': project.budget,
            'team_size': project.team_size,
            'timeline_months': project.timeline_months,
            'market_demand': project.market_demand,
            'technical_feasibility': project.technical_feasibility,
            'user_engagement': project.user_engagement,
            'hypothesis_validation_rate': project.hypothesis_validation_rate,
            'rat_completion_rate': project.rat_completion_rate,
            'user_count': project.user_count,
            'revenue_growth': project.revenue_growth
        }
        
        # Analyze using Strategic Bridge Protocol
        result = strategic_bridge.analyze_project(features)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "strategic-analysis"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
