/**
 * BlackSwan AI - API Service Layer
 * Handles all backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8007';

/**
 * Execute multi-agent orchestration
 */
export async function executeOrchestration(query, strategy = 'sequential') {
  const response = await fetch(`${API_BASE_URL}/api/v1/orchestration/${strategy}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_names: ['DataAgent', 'RiskAgent', 'StrategyAgent', 'ExecutiveAgent'],
      parameters: {
        query: query,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Check backend health
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`);
  
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }

  return await response.json();
}

/**
 * Get available agents
 */
export async function getAgents() {
  const response = await fetch(`${API_BASE_URL}/api/v1/orchestration/agents`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }

  return await response.json();
}

// Made with Bob
