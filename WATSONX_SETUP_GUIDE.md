# IBM watsonx.ai Setup Guide for BlackSwan AI

## Current Status

The ExecutiveAgent is currently using **fallback responses** because IBM watsonx.ai credentials are not configured. This guide explains how to enable real AI-powered intelligence generation.

---

## Problem Diagnosis

### Why Fallback Responses Are Being Used

1. **Missing Credentials**: `WATSONX_API_KEY` and `WATSONX_PROJECT_ID` not set in `backend/.env`
2. **Package Not Installed**: `ibm-watsonx-ai` Python package may not be installed
3. **Initialization Failure**: watsonx.ai client fails to initialize

### How to Verify Current Status

Check the backend logs when starting the server:

```bash
cd backend
python run.py
```

Look for these log messages:

**If using fallback**:
```
❌ watsonx.ai credentials NOT configured
⚠️  Using FALLBACK mode - responses will be template-based
```

**If properly configured**:
```
✓ watsonx.ai credentials found
✓ watsonx.ai client initialized successfully
✓ Using model: ibm/granite-13b-chat-v2
```

---

## Solution: Enable Real watsonx.ai Integration

### Step 1: Get IBM watsonx.ai Credentials

1. **Sign up for IBM Cloud**:
   - Go to https://cloud.ibm.com
   - Create a free account or log in

2. **Create watsonx.ai Instance**:
   - Navigate to Catalog → AI / Machine Learning
   - Select "watsonx.ai"
   - Create a new instance (free tier available)

3. **Get API Key**:
   - Go to IBM Cloud Dashboard
   - Click on "Manage" → "Access (IAM)"
   - Click "API keys" → "Create"
   - Copy the API key (save it securely)

4. **Get Project ID**:
   - Open your watsonx.ai instance
   - Create a new project or select existing
   - Copy the Project ID from project settings

### Step 2: Install Required Package

```bash
cd backend
pip install ibm-watsonx-ai
```

### Step 3: Configure Environment Variables

Edit `backend/.env` file:

```bash
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

**Important**: Replace `your_actual_api_key_here` and `your_actual_project_id_here` with your real credentials.

### Step 4: Restart Backend Server

```bash
cd backend
python run.py
```

### Step 5: Verify Real AI is Active

Check logs for:
```
✓ watsonx.ai client initialized successfully
✓ Using model: ibm/granite-13b-chat-v2
```

Test with different queries:

**Query 1**: "Analyze Middle East oil crisis"
**Query 2**: "Analyze Taiwan semiconductor disruption"

Responses should be **dramatically different** and specific to each scenario.

---

## Enhanced Logging

The system now includes comprehensive logging to help diagnose issues:

### Initialization Logs
```
============================================================
WatsonxClient Initialization
API Key configured: True/False
Project ID configured: True/False
URL: https://us-south.ml.cloud.ibm.com
Model ID: ibm/granite-13b-chat-v2
============================================================
```

### Generation Logs
```
============================================================
Executive Intelligence Generation Request
Query: [user query]
watsonx.ai available: True/False
Generated prompt length: XXX characters
Calling watsonx.ai model.generate()...
✓ watsonx.ai response received
Generated text length: XXX characters
✓ Response parsed successfully
Insights: X
Recommendations: X
============================================================
```

### Fallback Logs
```
⚠️  Using FALLBACK response (watsonx.ai not available)
Crisis detection - Energy: True, Supply Chain: False, Cyber: False
Using ENERGY CRISIS fallback template
```

---

## Improved Fallback System

Even without watsonx.ai, the system now provides **query-aware intelligent responses**:

### Crisis Type Detection

The fallback system detects:
- **Energy Crises**: oil, gas, LNG, Middle East conflicts
- **Supply Chain**: semiconductors, logistics, Taiwan
- **Cybersecurity**: hacks, ransomware, breaches
- **Financial**: banking, SWIFT, market disruptions
- **Geopolitical**: wars, sanctions, trade conflicts

### Query-Specific Responses

**Example 1 - Energy Crisis**:
```
Query: "Middle East oil war impact"
Response: Discusses crude oil, LNG, Strait of Hormuz, energy inflation
```

**Example 2 - Cyber Attack**:
```
Query: "European bank cyberattack"
Response: Discusses SWIFT, payment systems, ransomware, financial continuity
```

**Example 3 - Supply Chain**:
```
Query: "Taiwan semiconductor crisis"
Response: Discusses APAC, chip exports, procurement delays
```

---

## Enterprise Prompt Engineering

The system uses sophisticated prompts for watsonx.ai:

```
You are a Fortune 500 enterprise crisis intelligence AI system providing 
executive-level operational intelligence.

Your role is to analyze geopolitical disruptions, supply-chain instability, 
cybersecurity threats, energy crises, logistics failures, and black swan 
operational risks.

CRISIS SCENARIO:
[user query]

REQUIRED OUTPUT:
1. STRATEGIC INSIGHTS (3-4 critical observations)
   - Focus on operational impact, business continuity
   - Use specific metrics, timeframes, business impact
   - Avoid generic statements

2. STRATEGIC MITIGATION ACTIONS (3-4 actionable recommendations)
   - Provide concrete, time-bound actions
   - Include resource requirements
   - Prioritize by urgency

3. OPERATIONAL RISK EXPOSURE (3-4 specific risks)
   - Quantify financial exposure
   - Include probability and severity
   - Identify cascading failures

4. STRATEGIC OPPORTUNITIES (3-4 competitive advantages)
   - Turn crisis into advantage
   - Focus on market positioning
   - Include innovation opportunities
```

---

## Testing Real AI vs Fallback

### Test 1: Energy Crisis
```bash
curl -X POST http://localhost:8000/agents/executive \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Analyze cascading operational risks from Middle East conflict impacting crude oil exports and LNG shipping"
  }'
```

**Expected with watsonx.ai**: Dynamic response about oil, LNG, shipping, energy markets
**Expected with fallback**: Template response about energy crisis

### Test 2: Cyber Attack
```bash
curl -X POST http://localhost:8000/agents/executive \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Assess enterprise impact of coordinated cyberattack on European banking infrastructure"
  }'
```

**Expected with watsonx.ai**: Dynamic response about banking, SWIFT, payments
**Expected with fallback**: Template response about cyber threats

---

## Troubleshooting

### Issue: "ibm-watsonx-ai package not installed"

**Solution**:
```bash
pip install ibm-watsonx-ai
```

### Issue: "Failed to initialize watsonx.ai client"

**Check**:
1. API key is correct
2. Project ID is correct
3. Network connectivity to IBM Cloud
4. API key has proper permissions

**View full error**:
```bash
# Check backend logs for full traceback
python run.py
```

### Issue: Still getting fallback responses

**Verify**:
1. `.env` file is in `backend/` directory
2. Environment variables are loaded
3. No typos in variable names
4. Server was restarted after adding credentials

**Debug**:
```python
# Add to backend/main.py temporarily
import os
print(f"API Key: {os.getenv('WATSONX_API_KEY')[:10]}...")
print(f"Project ID: {os.getenv('WATSONX_PROJECT_ID')}")
```

---

## Cost Considerations

### IBM watsonx.ai Pricing

- **Free Tier**: Limited tokens per month
- **Pay-as-you-go**: Based on token usage
- **Enterprise**: Custom pricing

### Token Usage

Each executive intelligence request uses approximately:
- **Prompt**: ~300-400 tokens
- **Response**: ~400-600 tokens
- **Total**: ~700-1000 tokens per request

### Cost Optimization

1. Use fallback for development/testing
2. Enable watsonx.ai for production/demos
3. Cache responses for repeated queries
4. Monitor token usage in IBM Cloud dashboard

---

## Production Deployment

### Environment Variables

Set in production environment:

```bash
export WATSONX_API_KEY="your_production_api_key"
export WATSONX_PROJECT_ID="your_production_project_id"
export WATSONX_URL="https://us-south.ml.cloud.ibm.com"
export WATSONX_MODEL_ID="ibm/granite-13b-chat-v2"
```

### Docker Deployment

```dockerfile
ENV WATSONX_API_KEY=${WATSONX_API_KEY}
ENV WATSONX_PROJECT_ID=${WATSONX_PROJECT_ID}
```

### Kubernetes Deployment

```yaml
env:
  - name: WATSONX_API_KEY
    valueFrom:
      secretKeyRef:
        name: watsonx-credentials
        key: api-key
  - name: WATSONX_PROJECT_ID
    valueFrom:
      secretKeyRef:
        name: watsonx-credentials
        key: project-id
```

---

## Success Criteria

### Real AI is Active When:

1. ✅ Logs show "watsonx.ai client initialized successfully"
2. ✅ Different queries produce dramatically different responses
3. ✅ Responses are contextual to the specific scenario
4. ✅ No "fallback" mentions in logs
5. ✅ Response includes "ai_generated": true

### Fallback is Active When:

1. ⚠️ Logs show "Using FALLBACK mode"
2. ⚠️ Similar queries produce similar template responses
3. ⚠️ Responses use predefined crisis templates
4. ⚠️ Response includes "ai_generated": false
5. ⚠️ Model shows "fallback-*" in response

---

## Next Steps

1. **Get IBM watsonx.ai credentials** (if not already done)
2. **Install ibm-watsonx-ai package**
3. **Configure backend/.env with real credentials**
4. **Restart backend server**
5. **Test with diverse queries**
6. **Verify responses are dynamic and contextual**

---

## Support

- **IBM watsonx.ai Docs**: https://www.ibm.com/docs/en/watsonx-as-a-service
- **IBM Cloud Support**: https://cloud.ibm.com/docs
- **BlackSwan AI Issues**: Check backend logs for detailed error messages

---

**Status**: Fallback system is working correctly. To enable real AI, follow steps above to configure IBM watsonx.ai credentials.