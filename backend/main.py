from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from backend.config import get_settings
from backend.api.routers import agents, orchestration, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Application startup: BlackSwan AI")
    yield
    logger.info("Application shutdown")

# Initialize FastAPI application
app = FastAPI(
    title="BlackSwan AI",
    description="Multi-Agent Enterprise Intelligence System",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS with production-ready settings
settings = get_settings()
cors_origins = settings.get_cors_origins()

logger.info(f"Configuring CORS with origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(agents.router, prefix=settings.API_V1_PREFIX)
app.include_router(orchestration.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "BlackSwan AI",
        "version": "1.0.0",
        "description": "Multi-Agent Enterprise Intelligence System",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Production-ready uvicorn configuration
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug",
        access_log=True
    )

# Made with Bob
