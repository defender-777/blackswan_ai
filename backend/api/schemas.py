from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

# Request Schemas
class AgentQueryRequest(BaseModel):
    """Base request for agent queries"""
    query: str = Field(..., min_length=1, description="Query text")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ExecutiveQueryRequest(AgentQueryRequest):
    """Executive agent query request"""
    business_context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class StrategyQueryRequest(BaseModel):
    """Strategy agent query request"""
    objective: str = Field(..., min_length=1)
    timeframe: str = Field(default="quarterly")
    constraints: List[str] = Field(default_factory=list)
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class RiskAssessmentRequest(BaseModel):
    """Risk agent assessment request"""
    scenario: str = Field(..., min_length=1)
    categories: List[str] = Field(default=["operational", "financial", "strategic"])
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class DataQueryRequest(BaseModel):
    """Data agent query request"""
    query_type: str = Field(..., description="Type of data query")
    parameters: Dict[str, Any] = Field(default_factory=dict)
    data_sources: List[str] = Field(default=["primary"])
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

class OrchestrationRequest(BaseModel):
    """Multi-agent orchestration request"""
    strategy: str = Field(..., description="sequential, parallel, or conditional")
    agent_names: Optional[List[str]] = None
    workflow: Optional[Dict[str, Any]] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)

# Response Schemas
class AgentResponseSchema(BaseModel):
    """Agent response schema"""
    agent_name: str
    status: str
    data: Dict[str, Any]
    confidence: float
    execution_time: float
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class OrchestrationResponse(BaseModel):
    """Orchestration response schema"""
    request_id: str
    strategy: str
    responses: List[AgentResponseSchema]
    total_execution_time: float
    success_count: int
    error_count: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    timestamp: datetime
    agents: Dict[str, str]
    uptime: float

class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    request_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Made with Bob
