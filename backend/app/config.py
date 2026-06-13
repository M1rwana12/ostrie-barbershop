"""Налаштування застосунку — читаються з оточення / .env."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # Telegram
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Адмін-токен для GET /appointments
    admin_token: str = "change-me"

    # БД (SQLite за замовчуванням, легко мігрувати на Postgres)
    database_url: str = "sqlite:///./ostrie.db"

    # CORS (через кому)
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
