"""OSTRIE API — FastAPI застосунок: послуги, майстри, онлайн-запис."""
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .config import settings
from .database import Base, engine, get_db
from .ratelimit import client_ip, is_rate_limited
from .seed import seed
from .telegram import notify_new_appointment

# Анти-спам POST /appointments: не більше N записів з одного IP за вікно
RATE_LIMIT = 5
RATE_WINDOW_SECONDS = 600  # 10 хвилин

# Створюємо таблиці та наповнюємо seed-даними при старті
Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="OSTRIE API", version="1.0.0", description="API барбершопу OSTRIE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root() -> dict:
    return {"name": "OSTRIE API", "status": "ok"}


@app.get("/services", response_model=list[schemas.ServiceOut], tags=["catalog"])
def list_services(db: Session = Depends(get_db)):
    return db.query(models.Service).order_by(models.Service.id).all()


@app.get("/barbers", response_model=list[schemas.BarberOut], tags=["catalog"])
def list_barbers(db: Session = Depends(get_db)):
    return db.query(models.Barber).order_by(models.Barber.id).all()


@app.get("/availability", tags=["booking"])
def availability(barber_id: int, date: str, db: Session = Depends(get_db)) -> dict:
    """Зайняті слоти конкретного майстра на дату — щоб фронт підсвічував недоступний час."""
    rows = (
        db.query(models.Appointment.time)
        .filter_by(barber_id=barber_id, date=date)
        .all()
    )
    return {"barber_id": barber_id, "date": date, "taken": sorted(r[0] for r in rows)}


@app.post(
    "/appointments",
    response_model=schemas.AppointmentOut,
    status_code=201,
    tags=["booking"],
)
async def create_appointment(
    payload: schemas.AppointmentCreate, request: Request, db: Session = Depends(get_db)
):
    # Honeypot: бот заповнив приховане поле — імітуємо успіх, нічого не зберігаємо.
    if payload.website.strip():
        return models.Appointment(
            id=0, name=payload.name, phone=payload.phone,
            service_id=payload.service_id, barber_id=payload.barber_id,
            date=payload.date, time=payload.time,
        )

    # Rate-limit за IP (анти-спам/анти-флуд)
    if is_rate_limited(client_ip(request), RATE_LIMIT, RATE_WINDOW_SECONDS):
        raise HTTPException(
            status_code=429,
            detail="Забагато спроб. Зачекайте кілька хвилин і спробуйте ще раз.",
        )

    service = db.get(models.Service, payload.service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Послугу не знайдено")

    barber = None
    if payload.barber_id is not None:
        barber = db.get(models.Barber, payload.barber_id)
        if barber is None:
            raise HTTPException(status_code=404, detail="Майстра не знайдено")

        # Перевірка вільності слота (майстер + дата + час)
        clash = (
            db.query(models.Appointment)
            .filter_by(
                barber_id=payload.barber_id,
                date=payload.date,
                time=payload.time,
            )
            .first()
        )
        if clash is not None:
            raise HTTPException(
                status_code=409,
                detail="Цей час уже зайнятий. Оберіть, будь ласка, інший слот.",
            )

    appt = models.Appointment(**payload.model_dump(exclude={"website"}))
    db.add(appt)
    db.commit()
    db.refresh(appt)

    # Сповіщення майстру в Telegram (async, не валить запит при помилці)
    text = (
        "<b>✂️ Новий запис — OSTRIE</b>\n\n"
        f"<b>Клієнт:</b> {appt.name}\n"
        f"<b>Телефон:</b> {appt.phone}\n"
        f"<b>Послуга:</b> {service.name} ({service.price} грн)\n"
        f"<b>Майстер:</b> {barber.name if barber else 'будь-який'}\n"
        f"<b>Дата й час:</b> {appt.date} о {appt.time}"
    )
    await notify_new_appointment(text)

    return appt


@app.get("/appointments", response_model=list[schemas.AppointmentOut], tags=["admin"])
def list_appointments(
    x_admin_token: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if x_admin_token != settings.admin_token:
        raise HTTPException(status_code=401, detail="Невірний або відсутній адмін-токен")
    return (
        db.query(models.Appointment)
        .order_by(models.Appointment.id.desc())
        .all()
    )
