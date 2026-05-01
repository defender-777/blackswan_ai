# BlackSwan AI Backend - Enterprise Crisis Intelligence API

Production-grade FastAPI backend for multi-agent enterprise intelligence orchestration.

## Quick Start

```bash
# Setup environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your IBM watsonx.ai credentials

# Run development server
python run.py
```

API available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

## Architecture Overview

### Core Components

```
backend/
├── main.py              # FastAPI application
├── run.py               # Development server
├── config.py            # Configuration management
├── core/                # Framework components
│   ├── base_agent.py    # Abstract agent class
│   └── orchestrator.py  # Multi-agent coordination
├── agents/              # Specialized intelligence agents
│   ├── executive_agent.py
│   ├── strategy_agent.py
│   ├── risk_agent.py
│   └── data_agent.py
├── services/            # External integrations
│   └── watsonx_client.py
└── api/                 # REST API layer
    ├── dependencies.py
    ├── schemas.py
    └── routers/
```

### Agent Architecture

All agents inherit from `BaseAgent` with standardized lifecycle:

```python
class BaseAgent(ABC):
    @abstractmethod
    async def execute(self, context: AgentContext) -> AgentResponse:
        """Main execution logic"""
        pass
    
    def validate_input(self, context: AgentContext) -> bool:
        """Input validation"""
        pass
    
    def handle_error(self, error: Exception) -> AgentResponse:
        """Error handling"""
        pass
```

---

## API Endpoints

### Individual Agents

**Executive Intelligence**
```http
POST /agents/executive
Content-Type: application/json

{
  "query": "Analyze Taiwan semiconductor supply chain risks",
  "parameters": {},
  "metadata": {}
}
```

**Strategic Planning**
```http
POST /agents/strategy
Content-Type: application/json

{
  "query": "Develop supply chain diversification strategy",
  "parameters": {},
  "metadata": {}
}
```

**Risk Assessment**
```http
POST /agents/risk
Content-Type: application/json

{
  "query": "Assess operational continuity threats",
  "parameters": {},
  "metadata": {}
}
```

**Data Intelligence**
```http
POST /agents/data
Content-Type: application/json

{
  "query": "Analyze logistics network performance",
  "parameters": {},
  "metadata": {}
}
```

### Multi-Agent Orchestration

**Sequential Execution**
```http
POST /orchestration/sequential
Content-Type: application/json

{
  "query": "Complete crisis intelligence analysis",
  "agents": ["data", "risk", "strategy", "executive"],
  "parameters": {},
  "metadata": {}
}
```

**Parallel Execution**
```http
POST /orchestration/parallel
Content-Type: application/json

{
  "query": "Rapid threat assessment",
  "agents": ["risk", "data"],
  "parameters": {},
  "metadata": {}
}
```

**Custom Orchestration**
```http
POST /orchestration/execute
Content-Type: application/json

{
  "query": "Custom workflow",
  "agents": ["executive", "strategy"],
  "strategy": "sequential",
  "parameters": {},
  "metadata": {}
}
```

**List Available Agents**
```http
GET /orchestration/agents
```

### System Endpoints

**Health Check**
```http
GET /health
```

**API Information**
```http
GET /
```

---

## Agent Capabilities

### ExecutiveAgent
**Purpose**: Executive-level strategic intelligence and crisis briefings

**Output Structure**:
```json
{
  "insights": [
    "Critical supply chain concentration risk detected...",
    "Geopolitical instability creating operational threats..."
  ],
  "recommendations": [
    "Activate alternative supplier network within 14 days",
    "Establish 90-day strategic inventory reserves"
  ],
  "risks": [
    "Taiwan semiconductor dependency: $2.4B revenue exposure",
    "Logistics capacity constraints: 21-day delay scenario"
  ],
  "opportunities": [
    "Strategic nearshoring partnerships",
    "Vertical integration opportunities"
  ],
  "confidence": 0.85,
  "ai_generated": true,
  "model": "ibm/granite-3-1-8b-instruct"
}
```

### StrategyAgent
**Purpose**: Crisis mitigation strategies and operational resilience planning

**Output Structure**:
```json
{
  "strategy_type": "Supply Chain Diversification",
  "phases": [
    {
      "phase": "Emergency Stabilization",
      "timeline": "0-30 days",
      "actions": ["Activate emergency procurement protocols"],
      "milestones": ["Alternative suppliers identified"],
      "kpis": ["Procurement lead time reduction"],
      "dependencies": ["Vendor qualification process"],
      "resources": ["Procurement team expansion"]
    }
  ],
  "critical_success_factors": [
    "Executive sponsorship and resource allocation"
  ],
  "risk_mitigation": [
    "Phased implementation reduces operational disruption"
  ]
}
```

### RiskAgent
**Purpose**: Operational risk assessment and threat intelligence

**Output Structure**:
```json
{
  "risk_profile": {
    "overall_severity": "CRITICAL",
    "risk_score": 8.7,
    "primary_threats": [
      "Supply chain concentration in APAC region"
    ],
    "business_impact": "$2.4B revenue exposure across Q2-Q3",
    "time_sensitivity": "Immediate action required within 14 days"
  },
  "detailed_risks": [
    {
      "category": "Supply Chain",
      "severity": "CRITICAL",
      "description": "Taiwan semiconductor dependency",
      "impact": "Complete production halt scenario",
      "probability": "Medium-High",
      "mitigation": "Diversify supplier base"
    }
  ],
  "mitigation_strategies": [
    "Establish alternative supplier relationships"
  ],
  "monitoring_recommendations": [
    "Real-time supply chain visibility platform"
  ]
}
```

### DataAgent
**Purpose**: Operational intelligence and data-driven insights

**Output Structure**:
```json
{
  "intelligence_type": "Supply Chain Intelligence",
  "critical_findings": [
    "147 single-source components identified",
    "Procurement lead times increased 40% above baseline"
  ],
  "data_points": [
    {
      "metric": "Supplier Concentration",
      "value": "73%",
      "trend": "increasing",
      "benchmark": "45% industry average"
    }
  ],
  "trends": [
    "APAC logistics capacity declining 15% quarter-over-quarter"
  ],
  "visualizations": [
    {
      "type": "heatmap",
      "title": "Geographic Supply Chain Risk",
      "data_source": "supplier_locations"
    }
  ],
  "recommendations": [
    "Implement predictive supply chain analytics"
  ]
}
```

---

## Configuration

### Environment Variables

Create `.env` file in backend directory:

```bash
# Application Settings
APP_NAME=BlackSwan AI Backend
APP_VERSION=1.0.0
DEBUG=true
LOG_LEVEL=INFO

# Server Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=true

# CORS Settings
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-1-8b-instruct
```

### IBM watsonx.ai Setup

1. **Get API Credentials**:
   - Sign up at [IBM Cloud](https://cloud.ibm.com)
   - Create watsonx.ai instance
   - Generate API key and project ID

2. **Configure Environment**:
   ```bash
   WATSONX_API_KEY=your_actual_api_key
   WATSONX_PROJECT_ID=your_actual_project_id
   ```

3. **Verify Connection**:
   ```bash
   curl http://localhost:8000/agents/executive \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"query": "Test query"}'
   ```

**Note**: System includes intelligent fallback when watsonx.ai unavailable.

---

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html
```

### Code Quality

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

### Adding New Agents

1. **Create Agent Class**:
```python
# agents/my_agent.py
from core.base_agent import BaseAgent, AgentContext, AgentResponse

class MyAgent(BaseAgent):
    def __init__(self):
        super().__init__("my_agent")
    
    async def execute(self, context: AgentContext) -> AgentResponse:
        # Implementation
        return AgentResponse(
            agent_name=self.name,
            status="success",
            data={"result": "data"},
            metadata={}
        )
```

2. **Register Agent**:
```python
# api/dependencies.py
from agents.my_agent import MyAgent

def get_orchestrator():
    orchestrator = AgentOrchestrator()
    orchestrator.register_agent(MyAgent())
    return orchestrator
```

3. **Add Endpoint**:
```python
# api/routers/agents.py
@router.post("/my_agent")
async def execute_my_agent(
    request: AgentQueryRequest,
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
):
    # Implementation
    pass
```

---

## Deployment

### Production Setup

1. **Install Production Dependencies**:
```bash
pip install gunicorn uvicorn[standard]
```

2. **Configure Production Settings**:
```bash
# .env.production
DEBUG=false
LOG_LEVEL=WARNING
RELOAD=false
```

3. **Run with Gunicorn**:
```bash
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

Build and run:
```bash
docker build -t blackswan-backend .
docker run -p 8000:8000 --env-file .env blackswan-backend
```

### Cloud Deployment

**AWS Elastic Beanstalk**:
```bash
eb init -p python-3.11 blackswan-backend
eb create blackswan-prod
eb deploy
```

**Google Cloud Run**:
```bash
gcloud run deploy blackswan-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Azure App Service**:
```bash
az webapp up \
  --name blackswan-backend \
  --runtime "PYTHON:3.11" \
  --sku B1
```

---

## Monitoring & Logging

### Structured Logging

All agents use Python's standard logging:

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Agent execution started", extra={
    "agent": "executive",
    "query": query,
    "timestamp": datetime.utcnow().isoformat()
})
```

### Performance Monitoring

Track execution times:
```python
import time

start_time = time.time()
# Agent execution
execution_time = time.time() - start_time

logger.info(f"Agent completed in {execution_time:.2f}s")
```

### Error Tracking

Comprehensive error handling:
```python
try:
    result = await agent.execute(context)
except Exception as e:
    logger.error(f"Agent execution failed: {str(e)}", exc_info=True)
    return AgentResponse(
        agent_name=agent.name,
        status="error",
        data={},
        metadata={},
        error=str(e)
    )
```

---

## Troubleshooting

### Common Issues

**1. Import Errors**
```bash
# Ensure virtual environment activated
source venv/bin/activate  # Windows: venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**2. CORS Errors**
```python
# Check CORS configuration in main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**3. watsonx.ai Connection Issues**
```bash
# Verify credentials
echo $WATSONX_API_KEY
echo $WATSONX_PROJECT_ID

# Test connection
curl -X POST http://localhost:8000/agents/executive \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

**4. Port Already in Use**
```bash
# Change port in run.py or use environment variable
PORT=8001 python run.py
```

### Debug Mode

Enable detailed logging:
```python
# main.py
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## Performance Optimization

### Async Operations

All agents use async/await for non-blocking I/O:
```python
async def execute(self, context: AgentContext) -> AgentResponse:
    # Async operations
    result = await self.async_operation()
    return result
```

### Parallel Execution

Execute multiple agents concurrently:
```python
responses = await orchestrator.execute_parallel(
    agent_names=["risk", "data", "strategy"],
    context=context
)
```

### Caching (Future Enhancement)

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_cached_result(query: str):
    # Expensive operation
    return result
```

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Input Validation**: All inputs validated with Pydantic
3. **Error Messages**: Don't expose internal details in production
4. **Rate Limiting**: Implement in production (e.g., slowapi)
5. **Authentication**: Add JWT/OAuth for production use

---

## API Documentation

Interactive API documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes with tests
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/my-feature`
6. Submit pull request

---

## License

BlackSwan AI Backend - Enterprise Crisis Intelligence API  
Built for IBM Bob Hackathon 2026

---

## Support

For issues, questions, or contributions:
- Check existing documentation
- Review API docs at `/docs`
- Examine agent implementations in `agents/`
- Test with provided examples

**Architecture Documentation**: See `../ARCHITECTURE.md`  
**Frontend Integration**: See `../FRONTEND_BACKEND_INTEGRATION.md`