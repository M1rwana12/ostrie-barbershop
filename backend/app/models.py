"""ORM-моделі: послуги, майстри, записи."""
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


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
    created_at: Mapped[str] = mapped_column(
        String(40), default=lambda: datetime.now(timezone.utc).isoformat()
    )
