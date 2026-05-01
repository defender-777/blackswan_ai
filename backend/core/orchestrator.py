from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio
from .base_agent import BaseAgent, AgentContext, AgentResponse
import logging

logger = logging.getLogger(__name__)

class OrchestrationStrategy:
    """Base orchestration strategy"""
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"

class AgentOrchestrator:
    """Orchestrates multiple agents with different execution strategies"""
    
    def __init__(self, max_concurrent: int = 5):
        self.agents: Dict[str, BaseAgent] = {}
        self.max_concurrent = max_concurrent
        self.logger = logging.getLogger(f"{__name__}.orchestrator")
    
    def register_agent(self, agent: BaseAgent) -> None:
        """Register an agent with the orchestrator"""
        self.agents[agent.name] = agent
        self.logger.info(f"Agent registered: {agent.name}")
    
    async def execute_sequential(
        self,
        agent_names: List[str],
        context: AgentContext,
        **kwargs
    ) -> List[AgentResponse]:
        """Execute agents sequentially"""
        responses = []
        self.logger.info(f"Sequential execution starting with {len(agent_names)} agents")
        
        for agent_name in agent_names:
            if agent_name not in self.agents:
                self.logger.warning(f"Agent not found: {agent_name}")
                continue
            
            self.logger.info(f"Executing agent: {agent_name}")
            agent = self.agents[agent_name]
            
            try:
                response = await agent.execute(context, **kwargs)
                responses.append(response)
                self.logger.info(f"Agent {agent_name} completed: status={response.status}")
                
                # Pass previous results to next agent
                kwargs["previous_results"] = responses
            except Exception as e:
                self.logger.error(f"Agent {agent_name} failed: {str(e)}")
                # Create error response
                error_response = await agent.handle_error(context, e)
                responses.append(error_response)
        
        self.logger.info(f"Sequential execution completed with {len(responses)} responses")
        return responses
    
    async def execute_parallel(
        self,
        agent_names: List[str],
        context: AgentContext,
        **kwargs
    ) -> List[AgentResponse]:
        """Execute agents in parallel"""
        self.logger.info(f"Parallel execution starting with {len(agent_names)} agents")
        
        tasks = []
        valid_agent_names = []
        
        for agent_name in agent_names:
            if agent_name not in self.agents:
                self.logger.warning(f"Agent not found: {agent_name}")
                continue
            
            agent = self.agents[agent_name]
            tasks.append(agent.execute(context, **kwargs))
            valid_agent_names.append(agent_name)
        
        if not tasks:
            self.logger.warning("No valid agents to execute")
            return []
        
        # Execute with concurrency limit
        semaphore = asyncio.Semaphore(self.max_concurrent)
        
        async def bounded_execute(task):
            async with semaphore:
                return await task
        
        responses = await asyncio.gather(
            *[bounded_execute(task) for task in tasks],
            return_exceptions=True
        )
        
        # Handle exceptions
        processed_responses = []
        for i, response in enumerate(responses):
            agent_name = valid_agent_names[i] if i < len(valid_agent_names) else "unknown"
            
            if isinstance(response, Exception):
                self.logger.error(f"Agent {agent_name} failed: {str(response)}")
                processed_responses.append(
                    AgentResponse(
                        agent_name=agent_name,
                        status="error",
                        data={},
                        confidence=0.0,
                        execution_time=0.0,
                        error=str(response)
                    )
                )
            elif isinstance(response, AgentResponse):
                self.logger.info(f"Agent {agent_name} completed: status={response.status}")
                processed_responses.append(response)
        
        self.logger.info(f"Parallel execution completed with {len(processed_responses)} responses")
        return processed_responses
    
    async def execute_conditional(
        self,
        workflow: Dict[str, Any],
        context: AgentContext,
        **kwargs
    ) -> List[AgentResponse]:
        """Execute agents based on conditional logic"""
        responses = []
        current_step = workflow.get("start")
        
        while current_step:
            agent_name = current_step.get("agent")
            if agent_name not in self.agents:
                break
            
            agent = self.agents[agent_name]
            response = await agent.execute(context, **kwargs)
            responses.append(response)
            
            # Determine next step based on response
            if response.status == "success":
                current_step = current_step.get("on_success")
            else:
                current_step = current_step.get("on_failure")
        
        return responses
    
    async def orchestrate(
        self,
        strategy: str,
        context: AgentContext,
        agent_names: Optional[List[str]] = None,
        workflow: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Main orchestration method"""
        start_time = datetime.utcnow()
        
        self.logger.info(f"Orchestration started: strategy={strategy}, request_id={context.request_id}")
        
        if strategy == OrchestrationStrategy.SEQUENTIAL:
            if agent_names is None:
                raise ValueError("agent_names required for sequential strategy")
            responses = await self.execute_sequential(agent_names, context, **kwargs)
        elif strategy == OrchestrationStrategy.PARALLEL:
            if agent_names is None:
                raise ValueError("agent_names required for parallel strategy")
            responses = await self.execute_parallel(agent_names, context, **kwargs)
        elif strategy == OrchestrationStrategy.CONDITIONAL:
            if workflow is None:
                raise ValueError("workflow required for conditional strategy")
            responses = await self.execute_conditional(workflow, context, **kwargs)
        else:
            raise ValueError(f"Unknown strategy: {strategy}")
        
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        return {
            "request_id": context.request_id,
            "strategy": strategy,
            "responses": [r.model_dump() for r in responses],
            "total_execution_time": execution_time,
            "success_count": sum(1 for r in responses if r.status == "success"),
            "error_count": sum(1 for r in responses if r.status == "error")
        }

# Made with Bob
