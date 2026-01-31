from functools import lru_cache

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Centralized application configuration loaded from environment variables."""

    app_name: str = Field(default="AI Action Agent", env="APP_NAME")
    api_prefix: str = Field(default="/api", env="API_PREFIX")
    database_url: str = Field(default="sqlite:///./action_agent.db", env="DATABASE_URL")
    ai_base_url: str | None = Field(default=None, env="AI_BASE_URL")
    ai_api_key: str | None = Field(default=None, env="AI_API_KEY")
    environment: str = Field(default="development", env="ENVIRONMENT")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cache settings so FastAPI dependencies can access them efficiently."""

    return Settings()
