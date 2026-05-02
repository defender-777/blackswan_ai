# BlackSwan AI - AI Reasoning Stream Debugging Guide

## 🎯 Issue

The AI Reasoning Stream shows empty state after analysis completes, indicating the dynamic event generator is not extracting events from the orchestration response.

---

## 🔍 Diagnostic Logging Added

### Console Output Structure

When you run a query, you should now see:

```
╔════════════════════════════════════════════════════════════╗
║     DYNAMIC ORCHESTRATION EVENT GENERATION - DEBUG        ║
╚════════════════════════════════════════════════════════════╝
📦 FULL ORCHESTRATION RESPONSE:
{
  "responses": [...],
  "execution_time": 2.5,
  "strategy": "sequential"
}

✓ Found responses at: orchestrationData.responses
📊 Found 4 agent responses
Agent responses: [...]

🤖 Processing Agent 1/4
Response structure: {
  "agent_name": "DataAgent",
  "status": "success",
  "data": {...}
}
Agent: DataAgent
Has data: true
Data keys: data_sources, summary, analysis_complete

🤖 Processing Agent 2/4
Response structure: {
  "agent_name": "RiskAgent",
  "status": "success",
  "data": {...}
}
Agent: RiskAgent
Has data: true
Data keys: risk_profile, risk_factors, summary

🤖 Processing Agent 3/4
Response structure: {
  "agent_name": "StrategyAgent",
  "status": "success",
  "data": {...}
}
Agent: StrategyAgent
Has data: true
Data keys: strategies, summary, recommendations

🤖 Processing Agent 4/4
Response structure: {
  "agent_name": "ExecutiveAgent",
  "status": "success",
  "data": {...}
}
Agent: ExecutiveAgent
Has data: true
Data keys: strategic_insights, recommendations, risk_factors, opportunities

╔════════════════════════════════════════════════════════════╗
║              EVENT GENERATION RESULTS                      ║
╚════════════════════════════════════════════════════════════╝
✅ Generated 10 dynamic orchestration events:
  1. [info] DataAgent: 3 data sources analyzed
  2. [critical] RiskAgent: Risk exposure elevated to 87% probability
  3. [critical] RiskAgent: Taiwan semiconductor dependency: $2.4B revenue...
  4. [info] StrategyAgent: Activate alternative supplier network...
  5. [info] ExecutiveAgent: Critical supply chain concentration risk...
  6. [critical] ExecutiveAgent: Taiwan semiconductor dependency...
  7. [success] ExecutiveAgent: Executive intelligence synthesis complete
  8. [success] Orchestrator: Cross-agent intelligence consensus achieved
╚════════════════════════════════════════════════════════════╝
```

---

## 🚨 Error Scenarios

### Scenario 1: No Orchestration Data

```
╔════════════════════════════════════════════════════════════╗
║     DYNAMIC ORCHESTRATION EVENT GENERATION - DEBUG        ║
╚════════════════════════════════════════════════════════════╝
📦 FULL ORCHESTRATION RESPONSE:
null

❌ NO ORCHESTRATION DATA PROVIDED
```

**Cause**: `orchestrationData` is null/undefined
**Solution**: Check if API call succeeded, verify `setOrchestrationData(result)` is called

### Scenario 2: Wrong Response Structure

```
📦 FULL ORCHESTRATION RESPONSE:
{
  "agent_results": [...],
  "execution_time": 2.5
}

❌ COULD NOT FIND AGENT RESPONSES IN ORCHESTRATION DATA
Available keys: agent_results, execution_time, strategy
```

**Cause**: Response structure doesn't match expected paths
**Solution**: The code now checks multiple paths:
- `orchestrationData.responses`
- `orchestrationData.agent_results`
- `orchestrationData.data.responses`
- `orchestrationData.results`

If none match, add the correct path to the code.

### Scenario 3: No Events Generated

```
✓ Found responses at: orchestrationData.responses
📊 Found 4 agent responses

🤖 Processing Agent 1/4
Agent: DataAgent
Has data: false

🤖 Processing Agent 2/4
Agent: RiskAgent
Has data: false

╔════════════════════════════════════════════════════════════╗
║              EVENT GENERATION RESULTS                      ║
╚════════════════════════════════════════════════════════════╝
❌ NO ORCHESTRATION EVENTS GENERATED
This means event extraction failed.
Check agent data structures above for issues.
```

**Cause**: Agent responses have no `data` field or data is empty
**Solution**: Check backend agent responses, verify they return data

---

## 🔧 Troubleshooting Steps

### Step 1: Check Full Orchestration Response

Look for:
```
📦 FULL ORCHESTRATION RESPONSE:
{...}
```

**Verify**:
- Response is not null
- Response has agent data
- Response structure matches expectations

### Step 2: Check Response Path Detection

Look for:
```
✓ Found responses at: orchestrationData.responses
```

**If you see**:
```
❌ COULD NOT FIND AGENT RESPONSES IN ORCHESTRATION DATA
Available keys: [...]
```

**Action**: Note the available keys and add the correct path to the code

### Step 3: Check Agent Processing

For each agent, verify:
```
🤖 Processing Agent 1/4
Agent: DataAgent
Has data: true
Data keys: data_sources, summary, analysis_complete
```

**If "Has data: false"**:
- Backend agent is not returning data
- Check backend logs
- Verify agent execution succeeded

**If "Data keys" are wrong**:
- Event extractor expects specific keys
- Update event extraction logic to match actual keys

### Step 4: Check Event Generation Results

Look for:
```
✅ Generated 10 dynamic orchestration events:
```

**If you see**:
```
❌ NO ORCHESTRATION EVENTS GENERATED
```

**Possible causes**:
1. Agent data fields don't match expected structure
2. Event extraction logic needs updating
3. All agents returned empty data

---

## 🛠️ Fixing Common Issues

### Issue 1: Response at Different Path

**Symptom**:
```
❌ COULD NOT FIND AGENT RESPONSES IN ORCHESTRATION DATA
Available keys: agent_results, execution_time
```

**Fix**: Add the correct path in `generateOrchestrationEvents()`:

```javascript
if (orchestrationData.responses) {
  responses = orchestrationData.responses;
} else if (orchestrationData.agent_results) {  // ← Add this
  responses = orchestrationData.agent_results;
} else if (orchestrationData.data?.responses) {
  responses = orchestrationData.data.responses;
}
```

### Issue 2: Agent Data Keys Don't Match

**Symptom**:
```
Agent: ExecutiveAgent
Has data: true
Data keys: insights, recommendations, risks, opportunities
```

But code expects: `strategic_insights`, `risk_factors`

**Fix**: Update event extraction to match actual keys:

```javascript
if (agentName === "ExecutiveAgent" && agentData) {
  // OLD: agentData.strategic_insights
  // NEW: agentData.insights
  if (agentData.insights) {  // ← Update key name
    agentData.insights.slice(0, 2).forEach(insight => {
      // ...
    });
  }
}
```

### Issue 3: No Data in Agent Responses

**Symptom**:
```
Agent: DataAgent
Has data: false
```

**Fix**: Check backend agent implementation:
- Verify agent returns data in response
- Check backend logs for agent execution errors
- Ensure agent's `execute()` method returns proper structure

---

## 📊 Expected Data Structures

### DataAgent
```javascript
{
  agent_name: "DataAgent",
  status: "success",
  data: {
    data_sources: ["source1", "source2"],
    summary: "Analysis summary text...",
    analysis_complete: true
  }
}
```

### RiskAgent
```javascript
{
  agent_name: "RiskAgent",
  status: "success",
  data: {
    risk_profile: {
      risk_score: 0.87,
      risk_factors: [
        "Risk factor 1...",
        "Risk factor 2..."
      ]
    },
    summary: "Risk summary..."
  }
}
```

### StrategyAgent
```javascript
{
  agent_name: "StrategyAgent",
  status: "success",
  data: {
    strategies: [
      "Strategy 1...",
      "Strategy 2..."
    ],
    summary: "Strategy summary..."
  }
}
```

### ExecutiveAgent
```javascript
{
  agent_name: "ExecutiveAgent",
  status: "success",
  data: {
    strategic_insights: [
      "Insight 1...",
      "Insight 2..."
    ],
    recommendations: [
      "Recommendation 1...",
      "Recommendation 2..."
    ],
    risk_factors: [
      "Risk 1...",
      "Risk 2..."
    ],
    opportunities: [
      "Opportunity 1...",
      "Opportunity 2..."
    ]
  }
}
```

---

## ✅ Success Indicators

When working correctly, you should see:

1. **Full response logged**:
   ```
   📦 FULL ORCHESTRATION RESPONSE:
   {complete JSON structure}
   ```

2. **Response path found**:
   ```
   ✓ Found responses at: orchestrationData.responses
   📊 Found 4 agent responses
   ```

3. **All agents processed**:
   ```
   🤖 Processing Agent 1/4
   Agent: DataAgent
   Has data: true
   Data keys: data_sources, summary
   ```

4. **Events generated**:
   ```
   ✅ Generated 10 dynamic orchestration events:
   1. [info] DataAgent: ...
   2. [critical] RiskAgent: ...
   ...
   ```

5. **Events appear in UI**:
   - AI Reasoning Stream shows progressive events
   - Events have severity-based styling
   - Timestamps are current
   - Content matches query context

---

## 🎯 Testing Procedure

### Step 1: Open Browser Console (F12)

### Step 2: Execute Query
```
Query: "Analyze Taiwan semiconductor crisis"
```

### Step 3: Check Console Output

**Look for**:
- Full orchestration response JSON
- Response path detection
- Agent processing logs
- Event generation results

### Step 4: Verify UI

**Check**:
- AI Reasoning Stream has events
- Events appear progressively (800ms intervals)
- Events have correct severity styling
- Content is query-specific

### Step 5: Test Different Queries

**Try**:
- Taiwan semiconductor
- Middle East energy
- European cyber attack

**Verify**:
- Different queries produce different events
- NO hardcoded semiconductor events for energy queries
- Event content matches query context

---

## 📝 Quick Checklist

- [ ] Console shows "FULL ORCHESTRATION RESPONSE"
- [ ] Console shows "Found responses at: ..."
- [ ] Console shows "Found X agent responses"
- [ ] Console shows "Processing Agent 1/4" through "4/4"
- [ ] Each agent shows "Has data: true"
- [ ] Console shows "Generated X dynamic orchestration events"
- [ ] Console lists all generated events
- [ ] UI shows events in AI Reasoning Stream
- [ ] Events appear progressively
- [ ] Events have severity styling
- [ ] Different queries produce different events

---

## 🚀 Next Steps

1. **Run query and check console**
2. **Copy full console output**
3. **Identify which step fails**:
   - No orchestration data?
   - Wrong response path?
   - No agent data?
   - No events generated?
4. **Apply appropriate fix from this guide**
5. **Test again**

---

**Status**: ✅ **COMPREHENSIVE DEBUGGING ENABLED**

The system now provides complete visibility into the event generation process, making it easy to identify and fix any data structure mismatches.