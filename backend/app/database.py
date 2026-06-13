"""SQLAlchemy engine, session та базовий клас моделей."""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

DB_URL = settings.db_url

connect_args = (
    {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
)

# pool_pre_ping — відсіює «протухлі» зʼєднання (актуально для Postgres на Render,
# де інстанс/БД можуть засинати на free-плані).
engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    pool_pre_ping=not DB_URL.startswith("sqlite"),
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
