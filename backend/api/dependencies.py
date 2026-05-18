from functools import lru_cache
import uuid
from typing import Optional
from config import get_settings, Settings
from core.orchestrator import AgentOrchestrator
from core.base_agent import AgentContext
from agents.executive_agent import ExecutiveAgent
from agents.strategy_agent import StrategyAgent
from agents.risk_agent import RiskAgent
from agents.data_agent import DataAgent

@lru_cache()
def get_orchestrator() -> AgentOrchestrator:
    """Get or create agent orchestrator singleton"""
    settings = get_settings()
    orchestrator = AgentOrchestrator(max_concurrent=settings.MAX_CONCURRENT_AGENTS)
    
    # Register all agents
    orchestrator.register_agent(ExecutiveAgent())
    orchestrator.register_agent(StrategyAgent())
    orchestrator.register_agent(RiskAgent())
    orchestrator.register_agent(DataAgent())
    
    return orchestrator

def get_settings_dependency() -> Settings:
    """Dependency for settings"""
    return get_settings()

def create_agent_context(
    user_id: Optional[str] = None,
    session_id: Optional[str] = None
) -> AgentContext:
    """Create agent context for request"""
    return AgentContext(
        request_id=str(uuid.uuid4()),
        user_id=user_id,
        session_id=session_id
    )

# Made with Bob
