from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import logging

# Use standard logging instead of structlog for simplicity
logger = logging.getLogger(__name__)

class AgentContext(BaseModel):
    """Context passed to agents during execution"""
    request_id: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AgentResponse(BaseModel):
    """Standardized agent response"""
    agent_name: str
    status: str  # success, error, partial
    data: Dict[str, Any]
    confidence: float = Field(ge=0.0, le=1.0)
    execution_time: float
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class BaseAgent(ABC):
    """Abstract base class for all agents"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.logger = logging.getLogger(f"{__name__}.{name}")
    
    @abstractmethod
    async def execute(self, context: AgentContext, **kwargs) -> AgentResponse:
        """Execute agent logic"""
        pass
    
    @abstractmethod
    async def validate_input(self, **kwargs) -> bool:
        """Validate input parameters"""
        pass
    
    async def pre_execute(self, context: AgentContext) -> None:
        """Hook before execution"""
        self.logger.info(f"Agent pre-execute: {context.request_id}")
    
    async def post_execute(self, context: AgentContext, response: AgentResponse) -> None:
        """Hook after execution"""
        self.logger.info(
            f"Agent post-execute: {context.request_id}, "
            f"status={response.status}, time={response.execution_time}s"
        )
    
    async def handle_error(self, context: AgentContext, error: Exception) -> AgentResponse:
        """Handle execution errors"""
        self.logger.error(f"Agent error: {context.request_id}, error={str(error)}")
        return AgentResponse(
            agent_name=self.name,
            status="error",
            data={},
            confidence=0.0,
            execution_time=0.0,
            error=str(error)
        )

# Made with Bob
