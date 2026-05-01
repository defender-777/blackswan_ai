# BlackSwan AI - Architecture Documentation

## System Overview

BlackSwan AI is a multi-agent enterprise intelligence system built with FastAPI, featuring modular agents, sophisticated orchestration, and clean enterprise architecture.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (FastAPI)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Agents     │  │ Orchestration│  │    Health    │      │
│  │   Router     │  │    Router    │  │    Router    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Orchestration Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           AgentOrchestrator                          │   │
│  │  • Sequential Execution                              │   │
│  │  • Parallel Execution (with semaphore)               │   │
│  │  • Conditional Workflows                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Agent Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Executive   │  │  Strategy    │  │     Risk     │      │
│  │    Agent     │  │    Agent     │  │    Agent     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │     Data     │         All extend BaseAgent              │
│  │    Agent     │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Core Framework                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  BaseAgent (Abstract)                                │   │
│  │  • execute()                                         │   │
│  │  • validate_input()                                  │   │
│  │  • pre_execute() / post_execute()                    │   │
│  │  • handle_error()                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. BaseAgent (Abstract Class)
**Location**: `backend/core/base_agent.py`

**Purpose**: Foundation for all agents with standardized lifecycle

**Key Features**:
- Abstract `execute()` method for agent logic
- Input validation via `validate_input()`
- Lifecycle hooks: `pre_execute()`, `post_execute()`
- Centralized error handling
- Structured logging integration

**Models**:
- `AgentContext`: Request context with tracing
- `AgentResponse`: Standardized response format

### 2. AgentOrchestrator
**Location**: `backend/core/orchestrator.py`

**Purpose**: Coordinate multiple agents with different execution strategies

**Execution Strategies**:

#### Sequential
- Agents execute one after another
- Results passed to subsequent agents
- Use case: Dependent workflows

#### Parallel
- Concurrent execution with semaphore control
- Configurable concurrency limit
- Use case: Independent analyses

#### Conditional
- Workflow-based execution
- Dynamic routing based on results
- Use case: Decision trees

**Features**:
- Agent registration and discovery
- Concurrency control
- Exception handling
- Execution metrics

### 3. Agent Implementations

#### ExecutiveAgent
**Purpose**: C-suite strategic insights
**Input**: Business query + context
**Output**: Strategic insights, recommendations, risks, opportunities

#### StrategyAgent
**Purpose**: Strategic planning and analysis
**Input**: Objective, timeframe, constraints
**Output**: Strategic plan, milestones, KPIs, dependencies

#### RiskAgent
**Purpose**: Risk assessment and mitigation
**Input**: Scenario, risk categories
**Output**: Risk profile, identified risks, mitigation strategies

#### DataAgent
**Purpose**: Data analysis and insights
**Input**: Query type, parameters, data sources
**Output**: Analysis results, insights, visualizations

## API Design

### REST Endpoints

```
/api/v1/
├── agents/
│   ├── POST /executive      # Query executive agent
│   ├── POST /strategy       # Query strategy agent
│   ├── POST /risk          # Assess risks
│   └── POST /data          # Query data
├── orchestration/
│   ├── POST /execute       # Generic orchestration
│   ├── POST /sequential    # Sequential execution
│   ├── POST /parallel      # Parallel execution
│   └── GET  /agents        # List agents
└── health/
    ├── GET  /              # Health check
    ├── GET  /ready         # Readiness probe
    └── GET  /live          # Liveness probe
```

### Request/Response Flow

```
Client Request
    ↓
FastAPI Router
    ↓
Dependency Injection (get_orchestrator)
    ↓
Create AgentContext (request_id, user_id, metadata)
    ↓
Agent/Orchestrator Execution
    ↓
AgentResponse (status, data, confidence, execution_time)
    ↓
JSON Response to Client
```

## Design Patterns

### 1. Dependency Injection
- Singleton orchestrator via `@lru_cache()`
- Settings injection
- Agent context creation

### 2. Template Method Pattern
- BaseAgent defines algorithm structure
- Subclasses implement specific steps
- Lifecycle hooks for customization

### 3. Strategy Pattern
- Orchestration strategies (sequential, parallel, conditional)
- Runtime strategy selection
- Extensible for new strategies

### 4. Factory Pattern
- Agent registration and retrieval
- Dynamic agent instantiation
- Centralized agent management

## Data Flow

### Single Agent Request
```
1. Client → POST /api/v1/agents/executive
2. Router validates request (Pydantic)
3. Create AgentContext with request_id
4. Get agent from orchestrator
5. Agent.execute(context, **params)
6. Return AgentResponse
```

### Orchestrated Request
```
1. Client → POST /api/v1/orchestration/execute
2. Router validates OrchestrationRequest
3. Create AgentContext
4. Orchestrator.orchestrate(strategy, context, agents, params)
5. Execute agents per strategy
6. Aggregate responses
7. Return OrchestrationResponse
```

## Configuration Management

**File**: `backend/config.py`

**Pattern**: Pydantic Settings with environment variables

**Key Settings**:
- Application config (name, version, debug)
- API config (prefix, CORS)
- OpenAI config (API key, model)
- Redis/Database config
- Agent config (retries, timeout, concurrency)

## Error Handling

### Levels
1. **Agent Level**: `handle_error()` in BaseAgent
2. **Orchestrator Level**: Exception catching in orchestration
3. **API Level**: HTTPException with status codes
4. **Global Level**: FastAPI exception handlers

### Error Response Format
```json
{
  "error": "Error type",
  "detail": "Detailed message",
  "request_id": "uuid",
  "timestamp": "ISO 8601"
}
```

## Logging Strategy

**Library**: structlog (structured JSON logging)

**Log Levels**:
- INFO: Agent execution, orchestration events
- WARNING: Agent not found, validation failures
- ERROR: Execution errors, exceptions

**Log Context**:
- request_id: Request tracing
- agent: Agent name
- execution_time: Performance metrics
- status: Success/error status

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Shared orchestrator via dependency injection
- External state (Redis, Database)

### Concurrency Control
- Semaphore for parallel execution
- Configurable `MAX_CONCURRENT_AGENTS`
- Async/await throughout

### Performance Optimization
- LRU cache for settings and orchestrator
- Parallel agent execution
- Efficient error handling

### Resource Management
- Agent timeout configuration
- Retry logic with exponential backoff
- Connection pooling (database, Redis)

## Security Considerations

### API Security
- CORS configuration
- API key authentication (future)
- Rate limiting (future)

### Data Security
- Environment variable for secrets
- No sensitive data in logs
- Input validation via Pydantic

## Monitoring & Observability

### Metrics
- Agent execution time
- Success/error rates
- Concurrent agent count
- Request throughput

### Health Checks
- `/health`: Overall system health
- `/health/ready`: Kubernetes readiness
- `/health/live`: Kubernetes liveness

### Tracing
- request_id for distributed tracing
- Structured logs for analysis
- Agent execution flow tracking

## Extension Points

### Adding New Agents
1. Extend `BaseAgent`
2. Implement `execute()` and `validate_input()`
3. Register in `dependencies.py`
4. Add router endpoint (optional)

### Adding Orchestration Strategies
1. Add method to `AgentOrchestrator`
2. Update `OrchestrationStrategy` enum
3. Add router endpoint

### Adding Middleware
1. Create middleware class
2. Add to FastAPI app in `main.py`
3. Configure in settings

## Testing Strategy

### Unit Tests
- Agent logic
- Orchestration strategies
- Input validation

### Integration Tests
- API endpoints
- Agent orchestration
- Error handling

### Load Tests
- Concurrent requests
- Agent performance
- Resource utilization

## Deployment Architecture

### Development
```
uvicorn backend.main:app --reload --port 8000
```

### Production
```
Docker Container
├── Python 3.11
├── FastAPI + Uvicorn
├── Multiple workers
└── Health checks
```

### Kubernetes
```yaml
Deployment:
  - Replicas: 3+
  - Resources: CPU/Memory limits
  - Probes: readiness, liveness
  - ConfigMap: Environment variables
  - Secrets: API keys
```

## Future Enhancements

1. **Authentication & Authorization**
   - JWT tokens
   - Role-based access control
   - API key management

2. **Advanced Orchestration**
   - DAG-based workflows
   - Event-driven execution
   - Workflow persistence

3. **Agent Improvements**
   - LLM integration (OpenAI, Anthropic)
   - Memory/context management
   - Agent collaboration protocols

4. **Observability**
   - Prometheus metrics
   - Distributed tracing (Jaeger)
   - APM integration

5. **Data Layer**
   - PostgreSQL integration
   - Redis caching
   - Vector database for embeddings

## Conclusion

BlackSwan AI provides a robust, scalable foundation for multi-agent enterprise intelligence systems with:
- Clean separation of concerns
- Enterprise-grade patterns
- Production-ready architecture
- Extensible design
- Comprehensive monitoring