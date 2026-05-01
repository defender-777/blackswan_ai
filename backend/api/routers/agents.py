from fastapi import APIRouter, Depends, HTTPException
from backend.api.schemas import (
    ExecutiveQueryRequest,
    StrategyQueryRequest,
    RiskAssessmentRequest,
    DataQueryRequest,
    AgentResponseSchema
)
from backend.api.dependencies import get_orchestrator, create_agent_context
from backend.core.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/executive", response_model=AgentResponseSchema)
async def query_executive_agent(
    request: ExecutiveQueryRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Query the Executive Agent for C-suite level insights"""
    try:
        context = create_agent_context()
        agent = orchestrator.agents.get("ExecutiveAgent")
        
        if not agent:
            raise HTTPException(status_code=500, detail="ExecutiveAgent not available")
        
        response = await agent.execute(
            context,
            query=request.query,
            business_context=request.business_context
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/strategy", response_model=AgentResponseSchema)
async def query_strategy_agent(
    request: StrategyQueryRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Query the Strategy Agent for strategic planning"""
    try:
        context = create_agent_context()
        agent = orchestrator.agents.get("StrategyAgent")
        
        if not agent:
            raise HTTPException(status_code=500, detail="StrategyAgent not available")
        
        response = await agent.execute(
            context,
            objective=request.objective,
            timeframe=request.timeframe,
            constraints=request.constraints
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/risk", response_model=AgentResponseSchema)
async def assess_risk(
    request: RiskAssessmentRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Assess risks using the Risk Agent"""
    try:
        context = create_agent_context()
        agent = orchestrator.agents.get("RiskAgent")
        
        if not agent:
            raise HTTPException(status_code=500, detail="RiskAgent not available")
        
        response = await agent.execute(
            context,
            scenario=request.scenario,
            categories=request.categories
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/data", response_model=AgentResponseSchema)
async def query_data_agent(
    request: DataQueryRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Query the Data Agent for data analysis"""
    try:
        context = create_agent_context()
        agent = orchestrator.agents.get("DataAgent")
        
        if not agent:
            raise HTTPException(status_code=500, detail="DataAgent not available")
        
        response = await agent.execute(
            context,
            query_type=request.query_type,
            parameters=request.parameters,
            data_sources=request.data_sources
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Made with Bob
