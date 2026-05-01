# BlackSwan AI - API Testing Guide

## Test Orchestration Locally

### 1. Test with Python Script
```bash
python test_orchestration.py
```

### 2. Start the Server
```bash
python backend/run.py
```

## API Endpoint Tests

### Health Check
```bash
curl http://127.0.0.1:8007/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-05-01T...",
  "agents": {
    "ExecutiveAgent": "healthy",
    "StrategyAgent": "healthy",
    "RiskAgent": "healthy",
    "DataAgent": "healthy"
  },
  "uptime": 123.45
}
```

### List Available Agents
```bash
curl http://127.0.0.1:8007/api/v1/orchestration/agents
```

Expected response:
```json
{
  "agents": [
    {
      "name": "ExecutiveAgent",
      "description": "Provides C-suite level strategic insights and decision support"
    },
    {
      "name": "StrategyAgent",
      "description": "Develops strategic plans and analyzes business strategies"
    },
    {
      "name": "RiskAgent",
      "description": "Identifies, assesses, and provides mitigation strategies for risks"
    },
    {
      "name": "DataAgent",
      "description": "Analyzes data and provides actionable insights"
    }
  ]
}
```

### Test Individual Agents

#### Executive Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/agents/executive \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are our strategic priorities for Q2 2026?",
    "business_context": {
      "industry": "technology",
      "market": "enterprise"
    }
  }'
```

#### Strategy Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/agents/strategy \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Expand into APAC markets",
    "timeframe": "quarterly",
    "constraints": ["budget", "resources"]
  }'
```

#### Risk Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/agents/risk \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "Market expansion into new regions",
    "categories": ["operational", "financial", "strategic"]
  }'
```

#### Data Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/agents/data \
  -H "Content-Type: application/json" \
  -d '{
    "query_type": "revenue_analysis",
    "parameters": {
      "period": "Q1-2026",
      "segment": "enterprise"
    }
  }'
```

### Test Orchestration

#### Sequential Execution
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/sequential \
  -H "Content-Type: application/json" \
  -d '{
    "agent_names": ["DataAgent", "RiskAgent", "StrategyAgent", "ExecutiveAgent"],
    "parameters": {
      "query": "Market expansion analysis"
    }
  }'
```

Expected response structure:
```json
{
  "request_id": "uuid-here",
  "strategy": "sequential",
  "responses": [
    {
      "agent_name": "DataAgent",
      "status": "success",
      "data": { ... },
      "confidence": 0.90,
      "execution_time": 0.05
    },
    {
      "agent_name": "RiskAgent",
      "status": "success",
      "data": { ... },
      "confidence": 0.88,
      "execution_time": 0.04
    },
    {
      "agent_name": "StrategyAgent",
      "status": "success",
      "data": { ... },
      "confidence": 0.82,
      "execution_time": 0.03
    },
    {
      "agent_name": "ExecutiveAgent",
      "status": "success",
      "data": { ... },
      "confidence": 0.85,
      "execution_time": 0.04
    }
  ],
  "total_execution_time": 0.16,
  "success_count": 4,
  "error_count": 0
}
```

#### Parallel Execution
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/parallel \
  -H "Content-Type: application/json" \
  -d '{
    "agent_names": ["ExecutiveAgent", "RiskAgent", "DataAgent"],
    "parameters": {
      "query": "Comprehensive business analysis"
    }
  }'
```

#### Generic Orchestration Endpoint
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/execute \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "sequential",
    "agent_names": ["ExecutiveAgent", "StrategyAgent"],
    "parameters": {
      "query": "Strategic planning for Q2"
    }
  }'
```

## Testing with Python

### Using requests library
```python
import requests

# Test sequential orchestration
response = requests.post(
    "http://127.0.0.1:8007/api/v1/orchestration/sequential",
    json={
        "agent_names": ["ExecutiveAgent", "RiskAgent", "DataAgent"],
        "parameters": {
            "query": "Market analysis"
        }
    }
)

print(f"Status: {response.status_code}")
result = response.json()
print(f"Responses collected: {len(result['responses'])}")
for r in result['responses']:
    print(f"  - {r['agent_name']}: {r['status']}")
```

### Using httpx (async)
```python
import httpx
import asyncio

async def test_orchestration():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:8007/api/v1/orchestration/parallel",
            json={
                "agent_names": ["ExecutiveAgent", "StrategyAgent", "RiskAgent", "DataAgent"],
                "parameters": {
                    "query": "Complete business intelligence"
                }
            }
        )
        return response.json()

result = asyncio.run(test_orchestration())
print(f"Success count: {result['success_count']}")
```

## Expected Behavior

### ✅ Successful Response
- Status code: 200
- `responses` array contains all agent outputs
- Each response has:
  - `agent_name`: Name of the agent
  - `status`: "success" or "error"
  - `data`: Agent-specific output
  - `confidence`: 0.0 to 1.0
  - `execution_time`: Time in seconds
  - `error`: null (or error message if failed)

### ❌ Error Scenarios

#### Invalid Strategy
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/execute \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "invalid_strategy",
    "agent_names": ["ExecutiveAgent"]
  }'
```
Response: 400 Bad Request

#### Missing Agent Names
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/sequential \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {"query": "test"}
  }'
```
Response: 422 Unprocessable Entity

#### Non-existent Agent
```bash
curl -X POST http://127.0.0.1:8007/api/v1/orchestration/sequential \
  -H "Content-Type: application/json" \
  -d '{
    "agent_names": ["NonExistentAgent"],
    "parameters": {"query": "test"}
  }'
```
Response: 200 OK (but responses array will be empty with warning in logs)

## Troubleshooting

### Empty Responses Array
**Problem**: Orchestration returns 200 but `responses` is empty

**Causes**:
1. Agents not registered properly
2. Agent validation failing
3. Agent execution throwing exceptions

**Solutions**:
1. Check server logs for warnings
2. Run `python test_orchestration.py` to test locally
3. Verify agents are registered: `GET /api/v1/orchestration/agents`
4. Ensure parameters match agent requirements

### Agent-Specific Parameters
Each agent has preferred parameters:
- **ExecutiveAgent**: `query`, `business_context`
- **StrategyAgent**: `objective`, `timeframe`, `constraints`
- **RiskAgent**: `scenario`, `categories`
- **DataAgent**: `query_type`, `parameters`, `data_sources`

**Fallback**: All agents now accept generic `query` parameter as fallback

## Performance Benchmarks

### Sequential Execution
- 4 agents: ~0.15-0.20 seconds
- Each agent: ~0.03-0.05 seconds

### Parallel Execution
- 4 agents: ~0.05-0.08 seconds (concurrent)
- Limited by `MAX_CONCURRENT_AGENTS=5`

## Next Steps

1. ✅ Verify all agents return responses
2. ✅ Test sequential orchestration
3. ✅ Test parallel orchestration
4. ✅ Check execution times
5. ✅ Validate response structure
6. 🔄 Integrate with IBM watsonx.ai
7. 🔄 Add authentication
8. 🔄 Deploy to IBM Cloud