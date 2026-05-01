# BlackSwan AI - IBM watsonx.ai Integration Guide

## 🎯 Overview

BlackSwan AI now integrates with IBM watsonx.ai to provide real AI-powered enterprise intelligence through the ExecutiveAgent.

## ✅ What Was Implemented

### 1. WatsonxClient Service (`backend/services/watsonx_client.py`)
Reusable client for IBM watsonx.ai API integration:
- **Credential management** - Loads from environment variables
- **Graceful fallback** - Works without credentials (mock responses)
- **Executive intelligence generation** - AI-powered strategic insights
- **Response parsing** - Structures AI output into actionable format
- **Error handling** - Robust error management with fallbacks

### 2. ExecutiveAgent Integration (`backend/agents/executive_agent.py`)
Updated to use watsonx.ai for real-time AI generation:
- Calls `WatsonxClient.generate_executive_intelligence()`
- Passes user query and business context
- Returns AI-generated insights, recommendations, risks, opportunities
- Maintains existing API structure

### 3. Configuration Updates
- **backend/config.py** - Added watsonx.ai settings
- **backend/.env** - Added credential placeholders
- **backend/.env.example** - Added setup instructions
- **backend/requirements.txt** - Added ibm-watsonx-ai package (commented)

## 🚀 Setup Instructions

### Step 1: Get IBM watsonx.ai Credentials

1. **Create IBM Cloud Account**
   - Visit: https://cloud.ibm.com/
   - Sign up or log in

2. **Create watsonx.ai Project**
   - Navigate to watsonx.ai service
   - Create a new project
   - Note your **Project ID** from project settings

3. **Get API Key**
   - Go to IBM Cloud IAM (Identity and Access Management)
   - Create API key
   - Copy your **API Key**

### Step 2: Install IBM watsonx.ai SDK

```bash
cd backend
pip install ibm-watsonx-ai ibm-cloud-sdk-core
```

Or uncomment in `requirements.txt`:
```bash
# Uncomment these lines:
ibm-watsonx-ai>=0.2.0
ibm-cloud-sdk-core>=3.16.0

# Then run:
pip install -r requirements.txt
```

### Step 3: Configure Credentials

Edit `backend/.env`:
```bash
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

### Step 4: Restart Backend

```bash
python backend/run.py
```

## 🔄 How It Works

### Request Flow

```
User Query
    ↓
Frontend → POST /api/v1/orchestration/sequential
    ↓
Orchestrator → ExecutiveAgent.execute()
    ↓
WatsonxClient.generate_executive_intelligence()
    ↓
IBM watsonx.ai API (if credentials configured)
    ↓
AI-Generated Response
    ↓
Structured Intelligence (insights, recommendations, risks, opportunities)
    ↓
Frontend Dashboard Updates
```

### Prompt Engineering

The system sends this prompt to watsonx.ai:

```
You are an executive AI advisor for enterprise intelligence. 
Analyze the following query and provide strategic insights.

Query: {user_query}
Business Context: {context}

Provide a comprehensive executive intelligence briefing with:
1. Strategic Insights (3-4 key insights)
2. Recommendations (3-4 actionable recommendations)
3. Risk Factors (3-4 potential risks)
4. Opportunities (3-4 strategic opportunities)

Format your response clearly with these sections.
```

### Response Structure

```json
{
  "insights": [
    "AI-generated strategic insight 1",
    "AI-generated strategic insight 2",
    "AI-generated strategic insight 3"
  ],
  "recommendations": [
    "AI-generated recommendation 1",
    "AI-generated recommendation 2",
    "AI-generated recommendation 3"
  ],
  "risks": [
    "AI-identified risk 1",
    "AI-identified risk 2",
    "AI-identified risk 3"
  ],
  "opportunities": [
    "AI-identified opportunity 1",
    "AI-identified opportunity 2",
    "AI-identified opportunity 3"
  ],
  "confidence": 0.85,
  "ai_generated": true,
  "model": "ibm/granite-13b-chat-v2"
}
```

## 🛡️ Graceful Fallback

### Without Credentials
If watsonx.ai credentials are not configured:
- System logs warning message
- Falls back to intelligent mock responses
- Application continues to work normally
- No crashes or errors

### Fallback Response Example
```json
{
  "insights": [
    "Analysis of 'query' indicates strategic considerations required",
    "Market positioning and competitive analysis recommended",
    "Operational efficiency and resource optimization needed"
  ],
  "recommendations": [
    "Conduct comprehensive market analysis",
    "Develop risk mitigation strategies",
    "Prioritize strategic initiatives"
  ],
  "risks": [
    "Market volatility and economic uncertainty",
    "Regulatory and compliance challenges",
    "Technology disruption risks"
  ],
  "opportunities": [
    "Digital transformation initiatives",
    "Market expansion possibilities",
    "Innovation and product development"
  ],
  "confidence": 0.75,
  "ai_generated": false,
  "model": "fallback"
}
```

## 🧪 Testing

### Test Without Credentials (Fallback Mode)
```bash
# Start backend
python backend/run.py

# Test via API
curl -X POST http://127.0.0.1:8007/api/v1/agents/executive \
  -H "Content-Type: application/json" \
  -d '{"query": "Analyze market expansion strategy"}'
```

Expected: Fallback response with `"ai_generated": false`

### Test With Credentials (AI Mode)
```bash
# Configure credentials in .env first
# Then start backend
python backend/run.py

# Test via API
curl -X POST http://127.0.0.1:8007/api/v1/agents/executive \
  -H "Content-Type: application/json" \
  -d '{"query": "Analyze semiconductor supply chain risks"}'
```

Expected: AI-generated response with `"ai_generated": true`

### Test via Frontend
1. Start backend: `python backend/run.py`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Enter query: "Analyze enterprise cloud migration strategy"
5. Click "Analyze"
6. View AI-generated insights in Executive Intelligence Briefing

## 📊 Available Models

### IBM Granite Models
- `ibm/granite-13b-chat-v2` (default) - Balanced performance
- `ibm/granite-20b-multilingual` - Multilingual support
- `ibm/granite-34b-code-instruct` - Code-focused

### Meta Llama Models
- `meta-llama/llama-2-70b-chat`
- `meta-llama/llama-3-70b-instruct`

### Change Model
Edit `backend/.env`:
```bash
WATSONX_MODEL_ID=meta-llama/llama-3-70b-instruct
```

## 🔧 Advanced Configuration

### Adjust Generation Parameters

Edit `backend/services/watsonx_client.py`:
```python
response = self.model.generate(
    prompt=prompt,
    params={
        "max_new_tokens": 800,      # Increase for longer responses
        "temperature": 0.7,          # 0.0-1.0 (higher = more creative)
        "top_p": 0.9,               # Nucleus sampling
        "top_k": 50,                # Top-k sampling
    }
)
```

### Custom Prompt Templates

Modify `_build_executive_prompt()` in `watsonx_client.py`:
```python
def _build_executive_prompt(self, query: str, business_context):
    prompt = f"""Custom prompt template here...
    
Query: {query}
Context: {business_context}

Your custom instructions..."""
    return prompt
```

## 🏗️ Architecture Integration

### Current Architecture
```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      FastAPI Backend                    │
│  ┌────────────────────────────────┐     │
│  │   Orchestrator                 │     │
│  │  ┌──────────┐  ┌──────────┐   │     │
│  │  │DataAgent │  │RiskAgent │   │     │
│  │  └──────────┘  └──────────┘   │     │
│  │  ┌──────────┐  ┌──────────┐   │     │
│  │  │Strategy  │  │Executive │───┼─────┼──→ watsonx.ai
│  │  │Agent     │  │Agent     │   │     │
│  │  └──────────┘  └──────────┘   │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### watsonx.ai Integration Point
- **ExecutiveAgent** is the primary integration point
- Other agents can be upgraded similarly
- Maintains existing orchestration architecture
- No breaking changes to API structure

## 🔮 watsonx Orchestrate Integration (Conceptual)

### What is watsonx Orchestrate?
IBM watsonx Orchestrate is an AI automation platform that:
- Orchestrates complex business workflows
- Integrates multiple AI models and services
- Provides pre-built automation templates
- Manages agent coordination at enterprise scale

### Conceptual Integration Approach

#### 1. Workflow Definition
```yaml
# watsonx_orchestrate_workflow.yaml
name: "BlackSwan Enterprise Intelligence"
description: "Multi-agent intelligence workflow"

workflow:
  - step: data_collection
    agent: DataAgent
    output: data_insights
    
  - step: risk_assessment
    agent: RiskAgent
    input: data_insights
    output: risk_analysis
    
  - step: strategy_development
    agent: StrategyAgent
    input: [data_insights, risk_analysis]
    output: strategic_plan
    
  - step: executive_briefing
    agent: ExecutiveAgent
    input: [data_insights, risk_analysis, strategic_plan]
    output: executive_intelligence
    watsonx_ai: true
```

#### 2. Integration Architecture
```
┌─────────────────────────────────────────────────────┐
│         watsonx Orchestrate Platform                │
│  ┌──────────────────────────────────────────────┐   │
│  │  Workflow Engine                             │   │
│  │  • Task scheduling                           │   │
│  │  • Agent coordination                        │   │
│  │  • Error handling                            │   │
│  │  • Monitoring & logging                      │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│         BlackSwan AI Backend                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  AgentOrchestrator (Current)                 │   │
│  │  • Sequential execution                      │   │
│  │  • Parallel execution                        │   │
│  │  • Conditional workflows                     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Agents (DataAgent, RiskAgent, etc.)         │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 3. Implementation Steps (Future)

**Phase 1: API Integration**
```python
# backend/services/orchestrate_client.py
from ibm_watsonx_orchestrate import OrchestrationClient

class OrchestrateBridge:
    def __init__(self):
        self.client = OrchestrationClient(api_key=...)
    
    async def execute_workflow(self, workflow_id, inputs):
        # Trigger watsonx Orchestrate workflow
        result = await self.client.run_workflow(
            workflow_id=workflow_id,
            inputs=inputs
        )
        return result
```

**Phase 2: Hybrid Orchestration**
```python
# Use watsonx Orchestrate for complex workflows
# Use local orchestrator for simple workflows

if workflow_complexity > threshold:
    result = await orchestrate_client.execute_workflow(...)
else:
    result = await local_orchestrator.orchestrate(...)
```

**Phase 3: Enterprise Features**
- Workflow versioning
- A/B testing of agent strategies
- Performance analytics
- Compliance tracking
- Audit logging

### Benefits of watsonx Orchestrate Integration
1. **Enterprise-grade orchestration** - Production-ready workflow management
2. **Pre-built templates** - Accelerate development
3. **Advanced monitoring** - Real-time workflow visibility
4. **Scalability** - Handle complex multi-step workflows
5. **Integration hub** - Connect to enterprise systems

### Current vs. Future State

**Current (Local Orchestrator)**
- ✅ Fast development
- ✅ Full control
- ✅ Simple workflows
- ⚠️ Limited scalability
- ⚠️ Manual monitoring

**Future (watsonx Orchestrate)**
- ✅ Enterprise scalability
- ✅ Advanced monitoring
- ✅ Pre-built integrations
- ✅ Workflow versioning
- ⚠️ Additional complexity

## 📝 Best Practices

### 1. Credential Security
- Never commit credentials to git
- Use environment variables
- Rotate API keys regularly
- Use IBM Cloud IAM for access control

### 2. Error Handling
- Always implement fallback responses
- Log errors for debugging
- Monitor API usage and quotas
- Handle rate limiting gracefully

### 3. Prompt Engineering
- Be specific in prompts
- Provide clear structure
- Include relevant context
- Test with various queries

### 4. Performance Optimization
- Cache frequent queries (future enhancement)
- Use appropriate model for task
- Adjust token limits based on needs
- Monitor response times

## 🐛 Troubleshooting

### Issue: "watsonx.ai credentials not configured"
**Solution**: Add credentials to `backend/.env`

### Issue: "ibm-watsonx-ai package not installed"
**Solution**: `pip install ibm-watsonx-ai ibm-cloud-sdk-core`

### Issue: "Authentication failed"
**Solution**: Verify API key and project ID are correct

### Issue: "Model not found"
**Solution**: Check model ID is valid for your region

### Issue: "Rate limit exceeded"
**Solution**: Implement request throttling or upgrade plan

## 📈 Monitoring

### Check watsonx.ai Status
```python
watsonx_client = get_watsonx_client()
print(f"watsonx.ai available: {watsonx_client.available}")
print(f"Model: {watsonx_client.model_id}")
```

### Log Analysis
```bash
# Check logs for watsonx.ai activity
grep "watsonx" backend.log

# Check for fallback usage
grep "fallback" backend.log
```

## 🎉 Success Criteria

✅ WatsonxClient service created
✅ ExecutiveAgent integrated with watsonx.ai
✅ Graceful fallback implemented
✅ Configuration added to .env
✅ Documentation complete
✅ System works with and without credentials
✅ No breaking changes to existing API
✅ Production-ready architecture

## 🔮 Future Enhancements

1. **Extend to Other Agents**
   - Integrate RiskAgent with watsonx.ai
   - Integrate StrategyAgent with watsonx.ai
   - Integrate DataAgent with watsonx.ai

2. **Advanced Features**
   - Response caching
   - Query history
   - A/B testing of prompts
   - Multi-model comparison

3. **watsonx Orchestrate**
   - Full workflow integration
   - Enterprise orchestration
   - Advanced monitoring
   - Compliance tracking

---

**Status**: ✅ IBM watsonx.ai Integration Complete
**Demo Ready**: Yes (with fallback mode)
**Production Ready**: Yes (with credentials)