from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    secret_key: str
    field_encryption_key: str
    access_token_expire_minutes: int = 1440
    frontend_origin: str = "http://localhost:3000"
    environment: str = "development"
    jwt_algorithm: str = "HS256"
    auth_cookie_name: str = "hackway_token"


@lru_cache
def get_settings() -> Settings:
    return Settings()
