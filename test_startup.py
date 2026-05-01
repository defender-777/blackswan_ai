"""
Test script to verify backend can start without errors
Run: python test_startup.py
"""
import sys
import importlib.util

def test_imports():
    """Test all critical imports"""
    print("Testing imports...")
    
    modules = [
        "backend.config",
        "backend.core.base_agent",
        "backend.core.orchestrator",
        "backend.agents.executive_agent",
        "backend.agents.strategy_agent",
        "backend.agents.risk_agent",
        "backend.agents.data_agent",
        "backend.api.dependencies",
        "backend.api.schemas",
        "backend.main"
    ]
    
    failed = []
    for module in modules:
        try:
            __import__(module)
            print(f"✓ {module}")
        except Exception as e:
            print(f"✗ {module}: {e}")
            failed.append((module, str(e)))
    
    return failed

def test_orchestrator():
    """Test orchestrator initialization"""
    print("\nTesting orchestrator...")
    try:
        from backend.api.dependencies import get_orchestrator
        orchestrator = get_orchestrator()
        print(f"✓ Orchestrator created with {len(orchestrator.agents)} agents")
        for agent_name in orchestrator.agents:
            print(f"  - {agent_name}")
        return True
    except Exception as e:
        print(f"✗ Orchestrator failed: {e}")
        return False

def test_app():
    """Test FastAPI app creation"""
    print("\nTesting FastAPI app...")
    try:
        from backend.main import app
        print(f"✓ FastAPI app created: {app.title}")
        print(f"  Routes: {len(app.routes)}")
        return True
    except Exception as e:
        print(f"✗ App creation failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("BlackSwan AI Backend - Startup Test")
    print("=" * 60)
    
    failed_imports = test_imports()
    orchestrator_ok = test_orchestrator()
    app_ok = test_app()
    
    print("\n" + "=" * 60)
    if not failed_imports and orchestrator_ok and app_ok:
        print("✓ ALL TESTS PASSED - Backend is ready to start!")
        print("\nStart the server with:")
        print("  python backend/run.py")
        print("\nOr:")
        print("  uvicorn backend.main:app --host 127.0.0.1 --port 8007 --reload")
        sys.exit(0)
    else:
        print("✗ TESTS FAILED - Fix errors above")
        if failed_imports:
            print(f"\nFailed imports: {len(failed_imports)}")
            for module, error in failed_imports:
                print(f"  - {module}: {error}")
        sys.exit(1)

# Made with Bob
