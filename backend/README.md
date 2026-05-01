# BlackSwan AI Backend

Enterprise-grade FastAPI backend for multi-agent intelligence system.

## Architecture Overview

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration management
├── requirements.txt       # Python dependencies
├── core/                  # Core framework components
│   ├── base_agent.py     # Abstract agent base class
│   └── orchestrator.py   # Multi-agent orchestration engine
├── agents/               # Agent implementations
│   ├── executive_agent.py    # C-suite strategic insights
│   ├── strategy_agent.py     # Strategic planning
│   ├── risk_agent.py         # Risk assessment
│   └── data_agent.py         # Data analysis
└── api/                  # REST API layer
    ├── schemas.py        # Pydantic models
    ├── dependencies.py   # Dependency injection
    └── routers/          # API endpoints
        ├── agents.py         # Individual agent endpoints
        ├── orchestration.py  # Multi-agent workflows
        └── health.py         # Health checks
```

## Key Features

### 🎯 Modular Agent Architecture
- **BaseAgent**: Abstract class for all agents with lifecycle hooks
- **AgentContext**: Request context with tracing
- **AgentResponse**: Standardized response format

### 🔄 Orchestration Layer
- **Sequential**: Execute agents one after another
- **Parallel**: Concurrent execution with semaphore control
- **Conditional**: Workflow-based execution logic

### 🚀 REST API
- Individual agent endpoints
- Multi-agent orchestration
- Health checks (ready/live)
- OpenAPI documentation

### 🏗️ Enterprise Patterns
- Dependency injection
- Structured logging
- Error handling
- Configuration management
- CORS support

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Server
```bash
# Development
uvicorn backend.main:app --reload --port 8000

# Production
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 4. Access API
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

## API Endpoints

### Individual Agents
```bash
POST /api/v1/agents/executive
POST /api/v1/agents/strategy
POST /api/v1/agents/risk
POST /api/v1/agents/data
```

### Orchestration
```bash
POST /api/v1/orchestration/execute
POST /api/v1/orchestration/sequential
POST /api/v1/orchestration/parallel
GET  /api/v1/orchestration/agents
```

### Health
```bash
GET /api/v1/health
GET /api/v1/health/ready
GET /api/v1/health/live
```

## Example Usage

### Query Executive Agent
```python
import httpx

response = httpx.post(
    "http://localhost:8000/api/v1/agents/executive",
    json={
        "query": "What are our strategic priorities for Q2?",
        "business_context": {
            "industry": "technology",
            "market": "enterprise"
        }
    }
)
print(response.json())
```

### Parallel Orchestration
```python
response = httpx.post(
    "http://localhost:8000/api/v1/orchestration/parallel",
    json={
        "agent_names": ["ExecutiveAgent", "RiskAgent", "DataAgent"],
        "parameters": {
            "query": "Market analysis",
            "scenario": "Market expansion",
            "query_type": "revenue_analysis"
        }
    }
)
```

## Agent Development

### Create New Agent
```python
from backend.core.base_agent import BaseAgent, AgentContext, AgentResponse

class CustomAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CustomAgent",
            description="Custom agent description"
        )
    
    async def validate_input(self, **kwargs) -> bool:
        # Validation logic
        return True
    
    async def execute(self, context: AgentContext, **kwargs) -> AgentResponse:
        # Agent logic
        return AgentResponse(
            agent_name=self.name,
            status="success",
            data={"result": "data"},
            confidence=0.9,
            execution_time=0.5
        )
```

### Register Agent
```python
# In backend/api/dependencies.py
orchestrator.register_agent(CustomAgent())
```

## Configuration

Key settings in `config.py`:
- `OPENAI_API_KEY`: OpenAI API key
- `MAX_CONCURRENT_AGENTS`: Parallel execution limit
- `AGENT_TIMEOUT`: Agent execution timeout
- `CORS_ORIGINS`: Allowed origins

## Monitoring

- Structured JSON logging via `structlog`
- Request tracing with `request_id`
- Agent execution metrics
- Health check endpoints

## Production Deployment

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes
- Use `/api/v1/health/ready` for readiness probe
- Use `/api/v1/health/live` for liveness probe
- Set resource limits based on agent workload

## Testing

```bash
# Unit tests
pytest tests/

# Integration tests
pytest tests/integration/

# Load testing
locust -f tests/load/locustfile.py
```

## License

MIT