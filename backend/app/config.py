"""Налаштування застосунку — читаються з оточення / .env."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # Telegram
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Адмін-токен (легасі) — більше не використовується ендпоінтами, лишено для сумісності
    admin_token: str = "change-me"

    # JWT-автентифікація
    jwt_secret: str = "dev-insecure-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 720  # 12 годин

    # Початковий супер-адмін (створюється при старті, якщо ще немає).
    super_admin_email: str = "senja3209@icloud.com"
    # Пароль можна задати або відкритим текстом (super_admin_password, для локалки),
    # або готовим bcrypt-хешем (super_admin_password_hash — безпечно тримати в репо/проді).
    # Якщо заданий хеш — він має пріоритет.
    super_admin_password: str = "ostrie-admin"
    super_admin_password_hash: str = (
        "$2b$12$kKhPgLrrdWficsNzFPwCnODCikP32bQtJ7ibEw7kJIPs.uGeI5Ud2"
    )

    # БД (SQLite за замовчуванням, легко мігрувати на Postgres)
    database_url: str = "sqlite:///./ostrie.db"

    # CORS (через кому)
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def db_url(self) -> str:
        """Нормалізує URL БД під драйвер psycopg3.

        Render віддає DATABASE_URL як `postgres://` або `postgresql://`
        (без драйвера → SQLAlchemy узяв би psycopg2). Приводимо до
        `postgresql+psycopg://`, щоб працював встановлений psycopg3.
        SQLite лишаємо як є.
        """
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://"):]
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url[len("postgresql://"):]
        return url


settings = Settings()
