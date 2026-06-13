"""ORM-моделі: послуги, майстри, записи, користувачі."""
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base

# Ролі користувачів адмінки
ROLE_SUPER = "super_admin"
ROLE_ADMIN = "admin"
ROLE_BARBER = "barber"
ROLES = (ROLE_SUPER, ROLE_ADMIN, ROLE_BARBER)

# Статуси запису
STATUS_NEW = "new"
STATUS_DONE = "done"
STATUS_CANCELLED = "cancelled"
STATUSES = (STATUS_NEW, STATUS_DONE, STATUS_CANCELLED)


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    price: Mapped[int]  # грн
    duration: Mapped[int]  # хвилини
    description: Mapped[str] = mapped_column(String(300), default="")


class Barber(Base):
    __tablename__ = "barbers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    specialty: Mapped[str] = mapped_column(String(160), default="")
    experience: Mapped[int] = mapped_column(default=0)  # роки
    role: Mapped[str] = mapped_column(String(80), default="")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    phone: Mapped[str] = mapped_column(String(30))
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"))
    barber_id: Mapped[int | None] = mapped_column(ForeignKey("barbers.id"), nullable=True)
    date: Mapped[str] = mapped_column(String(10))   # YYYY-MM-DD
    time: Mapped[str] = mapped_column(String(5))    # HH:MM
    status: Mapped[str] = mapped_column(String(12), default=STATUS_NEW)  # new/done/cancelled
    created_at: Mapped[str] = mapped_column(
        String(40), default=lambda: datetime.now(timezone.utc).isoformat()
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(20), default=ROLE_ADMIN)  # super_admin/admin/barber
    created_at: Mapped[str] = mapped_column(
        String(40), default=lambda: datetime.now(timezone.utc).isoformat()
    )
