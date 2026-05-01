# BlackSwan AI - Enterprise Crisis Intelligence Architecture

## Executive Overview

BlackSwan AI is a premium enterprise-grade multi-agent AI system designed for executive-level crisis intelligence, operational risk assessment, and strategic decision support. The platform orchestrates autonomous intelligence units to provide real-time threat analysis, strategic mitigation planning, and operational continuity recommendations.

---

## System Architecture

### 1. Core Architecture Principles

- **Modular Agent Design**: Each agent is an autonomous intelligence unit with specialized domain expertise
- **Orchestration Layer**: Centralized coordination of multi-agent workflows with sequential, parallel, and conditional execution strategies
- **Enterprise-Grade API**: FastAPI-based REST architecture with async operations, structured logging, and comprehensive error handling
- **Scalable Infrastructure**: Clean separation of concerns with dependency injection and configuration management
- **AI-Powered Intelligence**: IBM watsonx.ai integration for advanced reasoning with intelligent fallback systems

### 2. Technology Stack

**Backend Framework**:
- FastAPI 0.115.0 (async REST API)
- Python 3.11+ (type hints, async/await)
- Pydantic v2 (data validation and settings)
- Uvicorn (ASGI server)

**AI Integration**:
- IBM watsonx.ai (granite-3.1-8b-instruct model)
- Intelligent fallback system for offline operation

**Frontend**:
- React 18.3.1
- Tailwind CSS (enterprise UI)
- Vite (build tooling)

**Development Tools**:
- Python logging (structured logging)
- Environment-based configuration
- CORS middleware for frontend integration

---

## Backend Architecture

### Directory Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── run.py                  # Development server launcher
├── config.py               # Pydantic settings and environment configuration
├── .env                    # Environment variables (credentials, API keys)
│
├── core/                   # Core framework components
│   ├── __init__.py
│   ├── base_agent.py       # Abstract BaseAgent class
│   └── orchestrator.py     # AgentOrchestrator for multi-agent coordination
│
├── agents/                 # Specialized intelligence agents
│   ├── __init__.py
│   ├── executive_agent.py  # Executive-level strategic intelligence
│   ├── strategy_agent.py   # Crisis mitigation and strategic planning
│   ├── risk_agent.py       # Operational risk and threat assessment
│   └── data_agent.py       # Operational intelligence and data analysis
│
├── services/               # External service integrations
│   ├── __init__.py
│   └── watsonx_client.py   # IBM watsonx.ai client with fallback
│
└── api/                    # REST API layer
    ├── __init__.py
    ├── dependencies.py     # Dependency injection
    ├── schemas.py          # Pydantic request/response models
    └── routers/
        ├── __init__.py
        ├── agents.py       # Individual agent endpoints
        └── orchestration.py # Multi-agent orchestration endpoints
```

### Core Components

#### 1. BaseAgent (Abstract Class)

**Location**: `backend/core/base_agent.py`

**Purpose**: Foundation for all specialized agents with standardized lifecycle and error handling.

**Key Methods**:
- `execute(context: AgentContext) -> AgentResponse`: Main execution method (abstract)
- `validate_input(context: AgentContext) -> bool`: Input validation
- `pre_execute(context: AgentContext)`: Pre-execution hook
- `post_execute(response: AgentResponse)`: Post-execution hook
- `handle_error(error: Exception) -> AgentResponse`: Error handling

**Data Models**:
```python
class AgentContext:
    query: str
    parameters: Dict[str, Any]
    metadata: Dict[str, Any]

class AgentResponse:
    agent_name: str
    status: str  # "success" | "error"
    data: Dict[str, Any]
    metadata: Dict[str, Any]
    error: Optional[str]
```

#### 2. AgentOrchestrator

**Location**: `backend/core/orchestrator.py`

**Purpose**: Coordinate multi-agent workflows with different execution strategies.

**Execution Strategies**:

1. **Sequential Execution**: Agents execute one after another, each receiving previous results
   ```python
   async def execute_sequential(
       self, 
       agent_names: List[str], 
       context: AgentContext
   ) -> List[AgentResponse]
   ```

2. **Parallel Execution**: Agents execute concurrently for faster results
   ```python
   async def execute_parallel(
       self, 
       agent_names: List[str], 
       context: AgentContext
   ) -> List[AgentResponse]
   ```

3. **Conditional Execution**: Workflow-based execution with decision logic
   ```python
   async def execute_conditional(
       self, 
       workflow: Dict[str, Any], 
       context: AgentContext
   ) -> List[AgentResponse]
   ```

**Features**:
- Agent registration and discovery
- Comprehensive error handling
- Structured logging for debugging
- Result aggregation and metadata tracking

#### 3. Specialized Agents

##### ExecutiveAgent
**Purpose**: Generate executive-level strategic intelligence and crisis briefings

**Key Features**:
- IBM watsonx.ai integration for AI-powered insights
- Structured output: insights, recommendations, risks, opportunities
- Graceful fallback when AI unavailable
- Crisis-focused intelligence generation

**Output Structure**:
```python
{
    "insights": List[str],           # Strategic observations
    "recommendations": List[str],    # Actionable guidance
    "risks": List[str],              # Threat assessment
    "opportunities": List[str],      # Strategic advantages
    "confidence": float,             # 0.0-1.0 confidence score
    "ai_generated": bool,            # True if watsonx.ai used
    "model": str                     # Model identifier
}
```

##### StrategyAgent
**Purpose**: Develop crisis mitigation strategies and operational resilience plans

**Key Features**:
- Phased strategic planning (emergency, tactical, strategic)
- Resource allocation and dependency mapping
- KPI definition and milestone tracking
- Crisis-specific strategy generation

**Output Structure**:
```python
{
    "strategy_type": str,
    "phases": [
        {
            "phase": str,
            "timeline": str,
            "actions": List[str],
            "milestones": List[str],
            "kpis": List[str],
            "dependencies": List[str],
            "resources": List[str]
        }
    ],
    "critical_success_factors": List[str],
    "risk_mitigation": List[str]
}
```

##### RiskAgent
**Purpose**: Assess operational risks and generate threat intelligence

**Key Features**:
- Multi-domain risk analysis (supply chain, cyber, financial, operational)
- Severity scoring and business impact assessment
- Mitigation strategy recommendations
- Realistic crisis scenario generation

**Output Structure**:
```python
{
    "risk_profile": {
        "overall_severity": str,      # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
        "risk_score": float,          # 0.0-10.0
        "primary_threats": List[str],
        "business_impact": str,
        "time_sensitivity": str
    },
    "detailed_risks": List[Dict],
    "mitigation_strategies": List[str],
    "monitoring_recommendations": List[str]
}
```

##### DataAgent
**Purpose**: Provide operational intelligence and data-driven insights

**Key Features**:
- Supply chain intelligence analysis
- Operational metrics and trend analysis
- Market intelligence and competitive positioning
- Data visualization recommendations

**Output Structure**:
```python
{
    "intelligence_type": str,
    "critical_findings": List[str],
    "data_points": List[Dict],
    "trends": List[str],
    "visualizations": List[Dict],
    "recommendations": List[str]
}
```

#### 4. IBM watsonx.ai Integration

**Location**: `backend/services/watsonx_client.py`

**Purpose**: Integrate IBM watsonx.ai for advanced AI-powered intelligence generation.

**Key Features**:
- Async API client with connection pooling
- Prompt engineering for crisis intelligence
- Response parsing and structured output
- Intelligent fallback system with crisis-specific responses
- Configuration via environment variables

**Configuration**:
```python
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-1-8b-instruct
```

**Fallback Intelligence**:
When watsonx.ai is unavailable, the system provides realistic crisis intelligence based on query analysis:
- Supply chain crisis scenarios
- Cybersecurity threat intelligence
- General enterprise risk assessment

### API Layer

#### REST Endpoints

**Individual Agent Endpoints**:
```
POST /agents/executive    # Executive intelligence
POST /agents/strategy     # Strategic planning
POST /agents/risk         # Risk assessment
POST /agents/data         # Data intelligence
```

**Orchestration Endpoints**:
```
POST /orchestration/execute      # Custom orchestration
POST /orchestration/sequential   # Sequential execution
POST /orchestration/parallel     # Parallel execution
GET  /orchestration/agents       # List available agents
```

**System Endpoints**:
```
GET  /health                     # Health check
GET  /                           # API info
```

#### Request/Response Models

**Agent Query Request**:
```python
{
    "query": str,                    # Required: User query
    "parameters": Dict[str, Any],    # Optional: Agent parameters
    "metadata": Dict[str, Any]       # Optional: Additional context
}
```

**Orchestration Request**:
```python
{
    "query": str,                    # Required: User query
    "agents": List[str],             # Required: Agent names
    "strategy": str,                 # Optional: "sequential" | "parallel"
    "parameters": Dict[str, Any],    # Optional: Agent parameters
    "metadata": Dict[str, Any]       # Optional: Additional context
}
```

**Agent Response**:
```python
{
    "agent_name": str,
    "status": str,                   # "success" | "error"
    "data": Dict[str, Any],          # Agent-specific output
    "metadata": {
        "execution_time": float,
        "timestamp": str
    },
    "error": Optional[str]
}
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
│
├── public/                 # Static assets
│   ├── logo.png
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main application component
    ├── index.css           # Global styles
    │
    ├── services/           # API integration
    │   └── api.js          # Backend API client
    │
    └── assets/             # Images and media
        └── hero.png
```

### Key Components

#### App.jsx - Main Application

**Features**:
- Enterprise crisis intelligence dashboard
- Real-time orchestration execution
- Dynamic state management
- Loading states and error handling
- Premium enterprise UI with Tailwind CSS

**State Management**:
```javascript
const [query, setQuery] = useState('')
const [analyzing, setAnalyzing] = useState(false)
const [orchestrationData, setOrchestrationData] = useState(null)
const [error, setError] = useState(null)
```

**UI Sections**:
1. **Hero Section**: Premium branding and value proposition
2. **Query Input**: Enterprise-grade search interface
3. **Risk Score Card**: Visual threat level indicator
4. **Executive Briefing**: AI-generated strategic intelligence
5. **Live System Feed**: Real-time agent activity monitoring

#### API Service (api.js)

**Purpose**: Centralized backend communication layer

**Key Functions**:
```javascript
executeOrchestration(query)  // Execute multi-agent analysis
checkHealth()                // Backend health check
getAgents()                  // List available agents
```

**Error Handling**:
- Network error detection
- Timeout handling
- User-friendly error messages

---

## Deployment Architecture

### Development Environment

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### Production Considerations

1. **Backend Deployment**:
   - Use Gunicorn/Uvicorn with multiple workers
   - Configure environment variables securely
   - Enable HTTPS/TLS
   - Implement rate limiting
   - Add authentication/authorization

2. **Frontend Deployment**:
   - Build optimized production bundle: `npm run build`
   - Serve via CDN or static hosting
   - Configure CORS properly
   - Enable caching strategies

3. **IBM watsonx.ai**:
   - Secure API key management
   - Monitor usage and quotas
   - Implement retry logic
   - Cache responses when appropriate

4. **Monitoring & Logging**:
   - Structured logging with correlation IDs
   - Performance metrics tracking
   - Error rate monitoring
   - Agent execution analytics

---

## Security Considerations

1. **API Security**:
   - Input validation with Pydantic
   - SQL injection prevention (if database added)
   - XSS protection
   - CSRF tokens for state-changing operations

2. **Credential Management**:
   - Environment variables for secrets
   - Never commit `.env` files
   - Rotate API keys regularly
   - Use secret management services in production

3. **CORS Configuration**:
   - Restrict allowed origins in production
   - Validate request headers
   - Implement proper preflight handling

---

## Scalability & Performance

### Current Capabilities

- **Async Operations**: Non-blocking I/O for concurrent requests
- **Parallel Agent Execution**: Multiple agents run simultaneously
- **Efficient Resource Usage**: Minimal memory footprint per request

### Future Enhancements

1. **Caching Layer**: Redis for response caching
2. **Message Queue**: RabbitMQ/Kafka for async processing
3. **Database Integration**: PostgreSQL for persistence
4. **Horizontal Scaling**: Load balancer + multiple backend instances
5. **Agent Pool**: Pre-initialized agent instances
6. **WebSocket Support**: Real-time updates to frontend

---

## Testing Strategy

### Unit Tests
- Individual agent logic
- Orchestrator strategies
- API endpoint validation
- Pydantic model validation

### Integration Tests
- Multi-agent workflows
- API endpoint integration
- watsonx.ai integration
- Frontend-backend communication

### End-to-End Tests
- Complete user workflows
- Error handling scenarios
- Performance benchmarks

---

## Development Workflow

### Adding New Agents

1. Create agent class inheriting from `BaseAgent`
2. Implement `execute()` method
3. Register in `backend/api/dependencies.py`
4. Add endpoint in `backend/api/routers/agents.py`
5. Update frontend if needed

### Modifying Orchestration

1. Update `AgentOrchestrator` in `backend/core/orchestrator.py`
2. Add new strategy methods if needed
3. Update API schemas in `backend/api/schemas.py`
4. Test with existing agents

### Frontend Updates

1. Modify `App.jsx` for UI changes
2. Update `api.js` for new endpoints
3. Test with backend running
4. Build and deploy

---

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure virtual environment activated and dependencies installed
2. **CORS Errors**: Check `main.py` CORS configuration matches frontend URL
3. **watsonx.ai Errors**: Verify credentials in `.env` file
4. **Port Conflicts**: Change port in `run.py` or `vite.config.js`

### Debug Mode

Enable detailed logging:
```python
# backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## Roadmap

### Phase 1 (Current)
- ✅ Core multi-agent architecture
- ✅ FastAPI backend with orchestration
- ✅ React frontend with enterprise UI
- ✅ IBM watsonx.ai integration
- ✅ Crisis intelligence generation

### Phase 2 (Next)
- [ ] Database integration (PostgreSQL)
- [ ] User authentication and authorization
- [ ] Historical analysis and trend tracking
- [ ] Advanced visualization components
- [ ] WebSocket real-time updates

### Phase 3 (Future)
- [ ] Machine learning model training
- [ ] Predictive analytics
- [ ] Custom agent creation UI
- [ ] Multi-tenant support
- [ ] Enterprise SSO integration

---

## Contributing

### Code Standards

- Follow PEP 8 for Python code
- Use type hints throughout
- Write docstrings for all classes/methods
- Maintain test coverage >80%
- Use meaningful variable names

### Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly
4. Submit pull request with description
5. Address review feedback

---

## License & Credits

**BlackSwan AI** - Enterprise Crisis Intelligence Platform
Built for IBM Bob Hackathon 2026

**Technologies**:
- FastAPI (Sebastián Ramírez)
- React (Meta)
- IBM watsonx.ai (IBM)
- Tailwind CSS (Tailwind Labs)

---

## Contact & Support

For questions, issues, or contributions, please refer to the project repository.

**Documentation**: See individual README files in `backend/` and `frontend/` directories
**API Documentation**: Available at `http://localhost:8000/docs` when backend running