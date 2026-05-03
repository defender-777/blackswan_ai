from dotenv import load_dotenv
load_dotenv()

import os
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Production-safe environment variable logging
if os.getenv("DEBUG", "false").lower() == "true":
    logger.info("========== ENV DEBUG ==========")
    logger.info(f"WATSONX_API_KEY: {'***' if os.getenv('WATSONX_API_KEY') else 'NOT SET'}")
    logger.info(f"WATSONX_PROJECT_ID: {os.getenv('WATSONX_PROJECT_ID', 'NOT SET')}")
    logger.info("================================")

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

    # Application
    APP_NAME: str = "BlackSwan AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    # Production-ready CORS - supports multiple origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080"
    ]
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # OpenAI (optional for local development)
    OPENAI_API_KEY: str = "sk-placeholder-key-for-local-dev"
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # IBM watsonx.ai Configuration
    WATSONX_API_KEY: str = ""
    WATSONX_PROJECT_ID: str = ""
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"
    WATSONX_MODEL_ID: str = "meta-llama/llama-3-3-70b-instruct"
    
    # Redis (optional)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # Database (optional)
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/blackswan"
    
    # Agent Configuration
    MAX_AGENT_RETRIES: int = 3
    AGENT_TIMEOUT: int = 300
    MAX_CONCURRENT_AGENTS: int = 5
    
    def get_cors_origins(self) -> List[str]:
        """
        Parse CORS origins from environment variable or use defaults
        Supports comma-separated string or JSON array
        """
        cors_env = os.getenv("CORS_ORIGINS")
        if cors_env:
            try:
                # Try parsing as JSON array
                import json
                return json.loads(cors_env)
            except:
                # Fall back to comma-separated string
                return [origin.strip() for origin in cors_env.split(",")]
        return self.CORS_ORIGINS

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    
    # Validate critical production settings
    if settings.ENVIRONMENT == "production":
        if not settings.WATSONX_API_KEY:
            logger.warning("WATSONX_API_KEY not set - AI features will be limited")
        if not settings.WATSONX_PROJECT_ID:
            logger.warning("WATSONX_PROJECT_ID not set - AI features will be limited")
    
    return settings

# Made with Bob
