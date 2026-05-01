# BlackSwan AI - Quick Start Guide

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- pip

### Installation Steps

#### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Start the Backend
```bash
# Option 1: Using the run script (recommended)
python backend/run.py

# Option 2: Using uvicorn directly
uvicorn backend.main:app --host 127.0.0.1 --port 8007 --reload
```

#### 3. Access the Application
- **API Documentation (Swagger)**: http://127.0.0.1:8007/docs
- **Health Check**: http://127.0.0.1:8007/api/v1/health
- **Root Endpoint**: http://127.0.0.1:8007/

## 📡 API Endpoints

### Health & Status
```bash
GET  /api/v1/health          # System health check
GET  /api/v1/health/ready    # Readiness probe
GET  /api/v1/health/live     # Liveness probe
```

### Individual Agents
```bash
POST /api/v1/agents/executive    # C-suite strategic insights
POST /api/v1/agents/strategy     # Strategic planning
POST /api/v1/agents/risk         # Risk assessment
POST /api/v1/agents/data         # Data analysis
```

### Multi-Agent Orchestration
```bash
POST /api/v1/orchestration/execute      # Generic orchestration
POST /api/v1/orchestration/sequential   # Sequential execution
POST /api/v1/orchestration/parallel     # Parallel execution
GET  /api/v1/orchestration/agents       # List available agents
```

## 🧪 Testing the API

### Test Health Endpoint
```bash
curl http://127.0.0.1:8007/api/v1/health
```

### Test Executive Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/agents/executive \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are our strategic priorities for Q2?",
    "business_context": {
      "industry": "technology",
      "market": "enterprise"
    }
  }'
```

### Test Parallel Orchestration
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/parallel \
  -H "Content-Type: application/json" \
  -d '{
    "agent_names": ["ExecutiveAgent", "RiskAgent", "DataAgent"],
    "parameters": {
      "query": "Market analysis",
      "scenario": "Market expansion",
      "query_type": "revenue_analysis"
    }
  }'
```

## 🏗️ Architecture Overview

```
backend/
├── main.py                    # FastAPI application entry
├── config.py                  # Configuration management
├── run.py                     # Development server script
├── core/                      # Core framework
│   ├── base_agent.py         # Abstract agent base class
│   └── orchestrator.py       # Multi-agent orchestration
├── agents/                    # Agent implementations
│   ├── executive_agent.py    # Executive insights
│   ├── strategy_agent.py     # Strategic planning
│   ├── risk_agent.py         # Risk assessment
│   └── data_agent.py         # Data analysis
└── api/                       # REST API layer
    ├── schemas.py            # Pydantic models
    ├── dependencies.py       # Dependency injection
    └── routers/              # API endpoints
        ├── agents.py         # Individual agents
        ├── orchestration.py  # Multi-agent workflows
        └── health.py         # Health checks
```

## 🔧 Configuration

Edit `backend/.env` to customize:
- `DEBUG=True` - Enable debug mode
- `API_V1_PREFIX=/api/v1` - API prefix
- `MAX_CONCURRENT_AGENTS=5` - Parallel execution limit

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/run.py or use:
uvicorn backend.main:app --port 8008 --reload
```

### Import Errors
```bash
# Ensure you're in the project root and reinstall:
pip install -r backend/requirements.txt
```

### Module Not Found
```bash
# Run from project root directory:
cd /path/to/blackswan_ai
python backend/run.py
```

## 📝 Next Steps

1. **Add IBM watsonx.ai Integration**
   - Uncomment AI/ML dependencies in `requirements.txt`
   - Add watsonx.ai credentials to `.env`
   - Update agents to use watsonx.ai models

2. **Add Database Support**
   - Uncomment database dependencies
   - Configure DATABASE_URL in `.env`
   - Add database models and migrations

3. **Deploy to IBM Cloud**
   - Use provided Dockerfile
   - Configure IBM Cloud credentials
   - Deploy using Cloud Foundry or Kubernetes

## 🎯 Demo Ready Features

✅ FastAPI backend running on port 8007
✅ Swagger documentation at /docs
✅ 4 specialized agents (Executive, Strategy, Risk, Data)
✅ Multi-agent orchestration (Sequential, Parallel, Conditional)
✅ Health check endpoints
✅ Clean enterprise architecture
✅ Production-ready structure

## 📚 Additional Resources

- **Full Architecture**: See `ARCHITECTURE.md`
- **Backend README**: See `backend/README.md`
- **API Documentation**: http://127.0.0.1:8007/docs (when running)