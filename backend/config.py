from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")
    
    # Application
    APP_NAME: str = "BlackSwan AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # OpenAI (optional for local development)
    OPENAI_API_KEY: str = "sk-placeholder-key-for-local-dev"
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # IBM watsonx.ai Configuration
    WATSONX_API_KEY: str = ""
    WATSONX_PROJECT_ID: str = ""
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"
    WATSONX_MODEL_ID: str = "ibm/granite-13b-chat-v2"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/blackswan"
    
    # Agent Configuration
    MAX_AGENT_RETRIES: int = 3
    AGENT_TIMEOUT: int = 300
    MAX_CONCURRENT_AGENTS: int = 5

@lru_cache()
def get_settings() -> Settings:
    return Settings()

# Made with Bob
