from fastapi import APIRouter, Depends, HTTPException
from backend.api.schemas import OrchestrationRequest, OrchestrationResponse
from backend.api.dependencies import get_orchestrator, create_agent_context
from backend.core.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/orchestration", tags=["orchestration"])

@router.post("/execute", response_model=OrchestrationResponse)
async def execute_orchestration(
    request: OrchestrationRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """
    Execute multi-agent orchestration with different strategies:
    - sequential: Execute agents one after another
    - parallel: Execute agents concurrently
    - conditional: Execute based on workflow logic
    """
    try:
        context = create_agent_context()
        
        result = await orchestrator.orchestrate(
            strategy=request.strategy,
            context=context,
            agent_names=request.agent_names,
            workflow=request.workflow,
            **request.parameters
        )
        
        return OrchestrationResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents")
async def list_available_agents(
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """List all registered agents"""
    return {
        "agents": [
            {
                "name": agent.name,
                "description": agent.description
            }
            for agent in orchestrator.agents.values()
        ]
    }

@router.post("/sequential")
async def execute_sequential(
    agent_names: list[str],
    parameters: dict = {},
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Execute agents sequentially"""
    context = create_agent_context()
    result = await orchestrator.orchestrate(
        strategy="sequential",
        context=context,
        agent_names=agent_names,
        **parameters
    )
    return result

@router.post("/parallel")
async def execute_parallel(
    agent_names: list[str],
    parameters: dict = {},
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Execute agents in parallel"""
    context = create_agent_context()
    result = await orchestrator.orchestrate(
        strategy="parallel",
        context=context,
        agent_names=agent_names,
        **parameters
    )
    return result

# Made with Bob
