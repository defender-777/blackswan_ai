# 🦢 BlackSwan AI - Multi-Agent Enterprise Intelligence System

> **IBM Bob Hackathon 2026**: Turn idea into impact faster with autonomous enterprise intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

BlackSwan AI is an autonomous enterprise intelligence platform that leverages multi-agent orchestration to provide C-suite level insights, strategic planning, risk assessment, and data analysis. Built for the IBM Bob Hackathon with enterprise-grade architecture and IBM Cloud deployment readiness.

## ✨ Key Features

- 🤖 **Multi-Agent Architecture**: 4 specialized AI agents (Executive, Strategy, Risk, Data)
- 🔄 **Smart Orchestration**: Sequential, parallel, and conditional agent workflows
- 🚀 **FastAPI Backend**: High-performance async REST API with auto-generated docs
- 🏗️ **Enterprise Patterns**: Dependency injection, structured logging, error handling
- 📊 **Real-time Insights**: Instant strategic analysis and recommendations
- 🔌 **IBM Ready**: Structured for watsonx.ai and IBM Cloud integration
- 🐳 **Containerized**: Docker and Kubernetes ready

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd blackswan_ai

# 2. Install dependencies
cd backend
pip install -r requirements.txt

# 3. Start the server
python backend/run.py
```

### Access the Application

- **API Documentation**: http://127.0.0.1:8007/docs
- **Health Check**: http://127.0.0.1:8007/api/v1/health
- **Root Endpoint**: http://127.0.0.1:8007/

## 📡 API Endpoints

### Individual Agents

```bash
# Executive Agent - C-suite strategic insights
POST /api/v1/agents/executive
{
  "query": "What are our strategic priorities for Q2?",
  "business_context": {"industry": "technology"}
}

# Strategy Agent - Strategic planning
POST /api/v1/agents/strategy
{
  "objective": "Expand into new markets",
  "timeframe": "quarterly"
}

# Risk Agent - Risk assessment
POST /api/v1/agents/risk
{
  "scenario": "Market expansion into APAC",
  "categories": ["operational", "financial"]
}

# Data Agent - Data analysis
POST /api/v1/agents/data
{
  "query_type": "revenue_analysis",
  "parameters": {"period": "Q1-2026"}
}
```

### Multi-Agent Orchestration

```bash
# Parallel execution - Run multiple agents simultaneously
POST /api/v1/orchestration/parallel
{
  "agent_names": ["ExecutiveAgent", "RiskAgent", "DataAgent"],
  "parameters": {
    "query": "Market expansion analysis"
  }
}

# Sequential execution - Chain agents together
POST /api/v1/orchestration/sequential
{
  "agent_names": ["DataAgent", "RiskAgent", "StrategyAgent"],
  "parameters": {
    "query": "New product launch"
  }
}
```

## 🏗️ Architecture

```
blackswan_ai/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration management
│   ├── run.py                 # Development server
│   ├── core/                  # Core framework
│   │   ├── base_agent.py     # Abstract agent base
│   │   └── orchestrator.py   # Multi-agent orchestration
│   ├── agents/               # Agent implementations
│   │   ├── executive_agent.py
│   │   ├── strategy_agent.py
│   │   ├── risk_agent.py
│   │   └── data_agent.py
│   └── api/                  # REST API layer
│       ├── schemas.py        # Pydantic models
│       ├── dependencies.py   # Dependency injection
│       └── routers/          # API endpoints
├── frontend/                 # React + Tailwind UI
├── docs/                     # Documentation
└── architecture/             # Architecture diagrams
```

### Agent Architecture

```
┌─────────────────────────────────────────┐
│         API Layer (FastAPI)             │
│  ┌──────────┐  ┌──────────┐            │
│  │ Agents   │  │Orchestrate│            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Orchestration Layer                │
│  • Sequential  • Parallel  • Conditional│
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Agent Layer                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Exec  │ │Strat │ │Risk  │ │Data  │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
└─────────────────────────────────────────┘
```

## 🤖 Agents

### ExecutiveAgent
**Purpose**: C-suite level strategic insights and decision support
- Strategic insights and recommendations
- Risk factor identification
- Opportunity analysis
- Business alignment assessment

### StrategyAgent
**Purpose**: Strategic planning and execution roadmaps
- Strategic plan development
- Milestone definition
- KPI tracking
- Resource allocation

### RiskAgent
**Purpose**: Comprehensive risk assessment and mitigation
- Risk identification and scoring
- Impact analysis
- Mitigation strategy recommendations
- Risk trend monitoring

### DataAgent
**Purpose**: Data analysis and actionable insights
- Data aggregation and analysis
- Trend identification
- Visualization recommendations
- Data quality assessment

## 🔄 Orchestration Strategies

### Sequential
Execute agents one after another, passing results forward
```python
DataAgent → RiskAgent → StrategyAgent → ExecutiveAgent
```

### Parallel
Execute multiple agents simultaneously for faster results
```python
[ExecutiveAgent, RiskAgent, DataAgent] → Aggregate Results
```

### Conditional
Dynamic workflow based on agent responses
```python
DataAgent → (if high_risk) → RiskAgent → (else) → StrategyAgent
```

## 🧪 Testing

```bash
# Run startup validation
python test_startup.py

# Test health endpoint
curl http://127.0.0.1:8007/api/v1/health

# Test agent endpoint
curl -X POST http://127.0.0.1:8007/api/v1/agents/executive \
  -H "Content-Type: application/json" \
  -d '{"query": "Strategic priorities", "business_context": {}}'
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access services
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

## ☁️ IBM Cloud Deployment

### Prerequisites
- IBM Cloud account
- IBM Cloud CLI installed
- watsonx.ai credentials (optional)

### Deployment Steps

```bash
# 1. Login to IBM Cloud
ibmcloud login

# 2. Target Cloud Foundry
ibmcloud target --cf

# 3. Deploy application
ibmcloud cf push blackswan-ai

# 4. Configure watsonx.ai (optional)
# Add credentials to environment variables
```

## 🔧 Configuration

Edit `backend/.env`:

```bash
# Application
DEBUG=True
API_V1_PREFIX=/api/v1

# IBM watsonx.ai (when ready)
# WATSONX_API_KEY=your_key_here
# WATSONX_PROJECT_ID=your_project_id

# Agent Configuration
MAX_CONCURRENT_AGENTS=5
AGENT_TIMEOUT=300
```

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Architecture Documentation](ARCHITECTURE.md)** - Detailed system design
- **[Backend README](backend/README.md)** - Backend-specific docs
- **[Fixes Applied](FIXES_APPLIED.md)** - Recent improvements

## 🎯 Hackathon Alignment

### IBM Bob Theme: "Turn idea into impact faster"

BlackSwan AI accelerates enterprise decision-making by:
- ⚡ **Instant Insights**: Multi-agent analysis in seconds
- 🎯 **Focused Intelligence**: Specialized agents for specific domains
- 🔄 **Automated Workflows**: Orchestrated multi-step analysis
- 📊 **Actionable Results**: Clear recommendations and next steps

### IBM Technology Integration

- **watsonx.ai Ready**: Structured for IBM's AI platform
- **IBM Cloud Native**: Containerized and cloud-ready
- **Enterprise Grade**: Production patterns and scalability
- **watsonx Orchestrate**: Multi-agent workflow alignment

## 🏆 Key Differentiators

1. **Multi-Agent Intelligence**: 4 specialized agents vs single AI
2. **Smart Orchestration**: Sequential, parallel, and conditional workflows
3. **Enterprise Architecture**: Clean, scalable, maintainable
4. **Production Ready**: Error handling, logging, monitoring
5. **IBM Aligned**: Built for watsonx.ai and IBM Cloud

## 🛠️ Technology Stack

- **Backend**: FastAPI, Python 3.11+, Pydantic
- **Frontend**: React, Tailwind CSS, Vite
- **AI/ML**: Ready for IBM watsonx.ai integration
- **Deployment**: Docker, Kubernetes, IBM Cloud
- **Monitoring**: Health checks, structured logging

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] Multi-agent architecture
- [x] Orchestration engine
- [x] REST API
- [x] Documentation

### Phase 2: IBM Integration 🚧
- [ ] watsonx.ai integration
- [ ] watsonx Orchestrate workflows
- [ ] IBM Cloud deployment
- [ ] Advanced analytics

### Phase 3: Enterprise Features 📋
- [ ] User authentication
- [ ] Role-based access
- [ ] Audit logging
- [ ] Advanced visualizations

## 🤝 Contributing

This is a hackathon project. For questions or suggestions, please open an issue.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for IBM Bob Hackathon 2026
- Powered by FastAPI and Python
- Designed for IBM watsonx.ai and IBM Cloud

---

**Made with ❤️ for the IBM Bob Hackathon**

*Turning enterprise intelligence ideas into impact faster*