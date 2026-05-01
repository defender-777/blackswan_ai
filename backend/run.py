"""
BlackSwan AI Backend - Development Server
Run with: python backend/run.py
"""
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting BlackSwan AI Backend on http://127.0.0.1:8007")
    logger.info("API Documentation: http://127.0.0.1:8007/docs")
    logger.info("Health Check: http://127.0.0.1:8007/api/v1/health")
    
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8007,
        reload=True,
        log_level="info"
    )

# Made with Bob
