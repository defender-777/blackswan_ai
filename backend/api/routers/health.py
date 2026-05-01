from fastapi import APIRouter, Depends
from datetime import datetime
import time
from backend.api.schemas import HealthCheckResponse
from backend.api.dependencies import get_orchestrator, get_settings_dependency
from backend.core.orchestrator import AgentOrchestrator
from backend.config import Settings

router = APIRouter(prefix="/health", tags=["health"])

# Track application start time
_start_time = time.time()

@router.get("", response_model=HealthCheckResponse)
async def health_check(
    orchestrator: AgentOrchestrator = Depends(get_orchestrator),
    settings: Settings = Depends(get_settings_dependency)
):
    """Health check endpoint"""
    agent_status = {
        agent.name: "healthy"
        for agent in orchestrator.agents.values()
    }
    
    return HealthCheckResponse(
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow(),
        agents=agent_status,
        uptime=time.time() - _start_time
    )

@router.get("/ready")
async def readiness_check(
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    """Readiness check for Kubernetes/container orchestration"""
    return {
        "ready": True,
        "agents_registered": len(orchestrator.agents),
        "timestamp": datetime.utcnow()
    }

@router.get("/live")
async def liveness_check():
    """Liveness check for Kubernetes/container orchestration"""
    return {
        "alive": True,
        "timestamp": datetime.utcnow()
    }

# Made with Bob
