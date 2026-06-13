"""Мінімальні ідемпотентні міграції схеми.

`Base.metadata.create_all` створює нові таблиці, але НЕ додає колонки до вже
існуючих. Тут — точкові `ALTER TABLE` для апгрейду старих БД (SQLite/Postgres).
"""
from sqlalchemy import inspect, text

from .database import engine


def _has_column(table: str, column: str) -> bool:
    insp = inspect(engine)
    if table not in insp.get_table_names():
        return True  # таблиці ще немає → create_all створить з потрібними колонками
    return column in {c["name"] for c in insp.get_columns(table)}


def run_migrations() -> None:
    # appointments.status — додано разом з аналітикою/статусами
    if not _has_column("appointments", "status"):
        with engine.begin() as conn:
            conn.execute(text(
                "ALTER TABLE appointments ADD COLUMN status VARCHAR(12) DEFAULT 'new'"
            ))
            conn.execute(text(
                "UPDATE appointments SET status = 'new' WHERE status IS NULL"
            ))

    # users.totp_* — додано разом з двофакторною автентифікацією
    if not _has_column("users", "totp_secret"):
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN totp_secret VARCHAR(64)"))
    if not _has_column("users", "totp_enabled"):
        default = "FALSE" if engine.dialect.name == "postgresql" else "0"
        with engine.begin() as conn:
            conn.execute(text(
                f"ALTER TABLE users ADD COLUMN totp_enabled BOOLEAN DEFAULT {default}"
            ))
    if not _has_column("users", "backup_codes"):
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN backup_codes TEXT"))
