from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from whatif_simulator import WhatIfSimulator

app = FastAPI()

class WhatIfRequest(BaseModel):
    baseline_features: Dict[str, Any]
    modifications: Dict[str, Any]

@app.post("/whatif")
async def simulate_whatif(request: WhatIfRequest):
    """What-If Scenario Simulation endpoint"""
    try:
        simulator = WhatIfSimulator()
        
        result = simulator.simulate_scenario(
            baseline_features=request.baseline_features,
            modifications=request.modifications
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "whatif-simulator"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
