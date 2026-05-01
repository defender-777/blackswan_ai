"""
Test orchestration endpoint to verify responses are collected
Run: python test_orchestration.py
"""
import asyncio
import sys

async def test_orchestration():
    """Test orchestration directly"""
    print("=" * 60)
    print("Testing BlackSwan AI Orchestration")
    print("=" * 60)
    
    try:
        # Import after path setup
        from backend.api.dependencies import get_orchestrator, create_agent_context
        
        print("\n1. Getting orchestrator...")
        orchestrator = get_orchestrator()
        print(f"   ✓ Orchestrator created with {len(orchestrator.agents)} agents:")
        for agent_name in orchestrator.agents:
            print(f"     - {agent_name}")
        
        print("\n2. Creating context...")
        context = create_agent_context()
        print(f"   ✓ Context created: {context.request_id}")
        
        print("\n3. Testing sequential orchestration...")
        agent_names = ["ExecutiveAgent", "StrategyAgent", "RiskAgent", "DataAgent"]
        
        result = await orchestrator.orchestrate(
            strategy="sequential",
            context=context,
            agent_names=agent_names,
            query="Test market analysis"
        )
        
        print(f"\n4. Results:")
        print(f"   - Request ID: {result['request_id']}")
        print(f"   - Strategy: {result['strategy']}")
        print(f"   - Total execution time: {result['total_execution_time']:.2f}s")
        print(f"   - Success count: {result['success_count']}")
        print(f"   - Error count: {result['error_count']}")
        print(f"   - Responses collected: {len(result['responses'])}")
        
        if result['responses']:
            print("\n5. Agent Responses:")
            for i, response in enumerate(result['responses'], 1):
                print(f"\n   Agent {i}: {response['agent_name']}")
                print(f"   - Status: {response['status']}")
                print(f"   - Confidence: {response['confidence']}")
                print(f"   - Execution time: {response['execution_time']:.2f}s")
                if response.get('error'):
                    print(f"   - Error: {response['error']}")
                else:
                    print(f"   - Data keys: {list(response['data'].keys())}")
        else:
            print("\n   ✗ NO RESPONSES COLLECTED!")
            return False
        
        print("\n" + "=" * 60)
        if len(result['responses']) == len(agent_names):
            print("✓ ORCHESTRATION TEST PASSED")
            print(f"  All {len(agent_names)} agents executed successfully")
            return True
        else:
            print("✗ ORCHESTRATION TEST FAILED")
            print(f"  Expected {len(agent_names)} responses, got {len(result['responses'])}")
            return False
            
    except Exception as e:
        print(f"\n✗ TEST FAILED WITH ERROR:")
        print(f"  {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_orchestration())
    sys.exit(0 if success else 1)

# Made with Bob
