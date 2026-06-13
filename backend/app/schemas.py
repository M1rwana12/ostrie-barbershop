"""Pydantic-схеми для валідації та серіалізації."""
import re
from datetime import date as date_type

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    price: int
    duration: int
    description: str = ""


class BarberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    specialty: str = ""
    experience: int = 0
    role: str = ""


class AppointmentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=5, max_length=30)
    service_id: int
    barber_id: int | None = None
    date: str
    time: str
    # Honeypot: справжні користувачі це поле не бачать і лишають порожнім.
    # Якщо заповнене — запит від бота (обробляється в main.py).
    website: str = ""

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Вкажіть, будь ласка, ім'я")
        return v

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        if len(re.sub(r"\D", "", v)) < 9:
            raise ValueError("Некоректний номер телефону")
        return v.strip()

    @field_validator("date")
    @classmethod
    def _date(cls, v: str) -> str:
        try:
            d = date_type.fromisoformat(v)
        except ValueError:
            raise ValueError("Дата має бути у форматі YYYY-MM-DD")
        if d < date_type.today():
            raise ValueError("Оберіть майбутню дату")
        return v

    @field_validator("time")
    @classmethod
    def _time(cls, v: str) -> str:
        if not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("Час має бути у форматі HH:MM")
        return v


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone: str
    service_id: int
    barber_id: int | None = None
    date: str
    time: str
    created_at: str | None = None
