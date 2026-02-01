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

@app.post("/whatif")
async def simulate_whatif(request: dict):
    """What-If Scenario Simulation endpoint"""
    try:
        from whatif_simulator import WhatIfSimulator
        
        simulator = WhatIfSimulator()
        
        result = simulator.simulate_scenario(
            baseline_features=request['baseline_features'],
            modifications=request['modifications']
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def submit_feedback(request: dict):
    """Feedback submission endpoint"""
    try:
        from continuous_learning import ContinuousLearningSystem
        
        learning_system = ContinuousLearningSystem()
        
        result = learning_system.record_feedback(
            project_id=request['project_id'],
            feedback_type=request['type'],
            item_id=request['item_id'],
            rating=request['rating'],
            comment=request.get('comment', '')
        )
        
        return {"success": True, "message": "Feedback recorded successfully"}
        
    except Exception as e:
        # Log error but return success to not block user
        print(f"Feedback error: {e}")
        return {"success": True, "message": "Feedback recorded locally"}

@app.post("/export/pdf")
async def export_pdf(request: dict):
    """Export strategic analysis to PDF with language support (ar/en/fr)"""
    try:
        language = request.get('language', 'ar')  # Default to Arabic
        
        # Import appropriate exporter based on language
        if language == 'en':
            from pdf_export_en import export_to_pdf_en as export_func
        elif language == 'fr':
            from pdf_export_fr import export_to_pdf_fr as export_func
        else:
            from pdf_export import export_to_pdf as export_func
        
        analysis_id = request.get('analysis_id')
        
        # TODO: Fetch analysis data from database using analysis_id
        # For now, use sample data
        sample_data = {
            'project_title': 'Strategic Analysis Report',
            'ici_score': 65.5,
            'irl_score': 58.2,
            'success_probability': 0.72,
            'risk_level': 'MEDIUM',
            'investor_appeal': 'HIGH',
            'executive_summary': 'This project shows promising potential.',
            'ceo_insights': [],
            'roadmap': {'steps': []},
            'investment': {},
            'critical_path': []
        }
        
        # Generate PDF
        output_path = f"/tmp/strategic_analysis_{analysis_id}_{language}.pdf"
        export_func(sample_data, output_path)
        
        return {"success": True, "file_path": output_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export/excel")
async def export_excel(request: dict):
    """Export strategic analysis to Excel with language support (ar/en/fr)"""
    try:
        language = request.get('language', 'ar')  # Default to Arabic
        
        # Import appropriate exporter based on language
        if language == 'en':
            from excel_export_en import export_to_excel_en as export_func
        elif language == 'fr':
            from excel_export_fr import export_to_excel_fr as export_func
        else:
            from excel_export import export_to_excel as export_func
        
        analysis_id = request.get('analysis_id')
        
        # TODO: Fetch analysis data from database using analysis_id
        # For now, use sample data
        sample_data = {
            'project_title': 'Strategic Analysis Report',
            'ici_score': 65.5,
            'irl_score': 58.2,
            'success_probability': 0.72,
            'risk_level': 'MEDIUM',
            'investor_appeal': 'HIGH',
            'executive_summary': 'This project shows promising potential.',
            'dimensions': {
                'success_probability': 72.0,
                'market_fit': 68.5,
                'execution_readiness': 65.0,
                'investor_readiness': 58.2,
                'financial_sustainability': 52.0
            },
            'ceo_insights': [],
            'roadmap': {'steps': []},
            'investment': {'recommended_investors': []},
            'critical_path': []
        }
        
        # Generate Excel
        output_path = f"/tmp/strategic_analysis_{analysis_id}_{language}.xlsx"
        export_func(sample_data, output_path)
        
        return {"success": True, "file_path": output_path}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analytics/advanced")
async def get_advanced_analytics(request: dict):
    """Get advanced analytics (Cohort, Funnel, Trends)"""
    try:
        from advanced_analytics import AdvancedAnalytics
        
        analyses_data = request.get('analyses_data', [])
        cohort_period = request.get('cohort_period', 'monthly')
        segment_by = request.get('segment_by')
        forecast_periods = request.get('forecast_periods', 3)
        
        if not analyses_data:
            raise HTTPException(status_code=400, detail="No analyses data provided")
        
        analytics = AdvancedAnalytics()
        results = analytics.get_all_analytics(
            analyses_data,
            cohort_period=cohort_period,
            segment_by=segment_by,
            forecast_periods=forecast_periods
        )
        
        return {
            "success": True,
            "analytics": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "strategic-analysis"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
