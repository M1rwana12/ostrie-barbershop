"""OSTRIE API — FastAPI застосунок: послуги, майстри, онлайн-запис, адмінка."""
from collections import defaultdict

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import audit, models, schemas
from .auth import (
    consume_backup_code,
    create_access_token,
    generate_backup_codes,
    hash_backup_codes,
    hash_password,
    make_totp_secret,
    qr_svg,
    require_role,
    totp_uri,
    verify_password,
    verify_totp,
)
from .config import settings
from .database import Base, engine, get_db
from .migrate import run_migrations
from .models import ROLE_ADMIN, ROLE_SUPER, STATUS_DONE
from .ratelimit import client_ip, is_rate_limited
from .seed import seed
from .telegram import notify_new_appointment

# Анти-спам POST /appointments: не більше N записів з одного IP за вікно
RATE_LIMIT = 5
RATE_WINDOW_SECONDS = 600  # 10 хвилин

# Анти-брутфорс /auth/login: не більше N спроб з одного IP за вікно
LOGIN_RATE_LIMIT = 10
LOGIN_WINDOW_SECONDS = 300  # 5 хвилин

# Створюємо таблиці, доганяємо схему й наповнюємо seed-даними при старті
Base.metadata.create_all(bind=engine)
run_migrations()
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
    db: Session = Depends(get_db),
    _user: models.User = Depends(require_role(*models.ROLES)),
):
    return (
        db.query(models.Appointment)
        .order_by(models.Appointment.id.desc())
        .all()
    )


@app.patch(
    "/appointments/{appt_id}/status",
    response_model=schemas.AppointmentOut,
    tags=["admin"],
)
def update_status(
    appt_id: int,
    payload: schemas.StatusUpdate,
    request: Request,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(ROLE_SUPER, ROLE_ADMIN)),
):
    appt = db.get(models.Appointment, appt_id)
    if appt is None:
        raise HTTPException(status_code=404, detail="Запис не знайдено")
    appt.status = payload.status
    db.commit()
    db.refresh(appt)
    audit.record(db, "appointment_status_changed", request=request, email=user.email,
                 detail=f"#{appt_id} → {payload.status}")
    return appt


# ─────────────  Авторизація  ─────────────
@app.post("/auth/login", response_model=schemas.TokenOut, tags=["auth"])
def login(payload: schemas.LoginIn, request: Request, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    # Анти-брутфорс за IP
    if is_rate_limited(f"login:{client_ip(request)}", LOGIN_RATE_LIMIT, LOGIN_WINDOW_SECONDS):
        audit.record(db, "login_ratelimited", request=request, email=email, success=False)
        raise HTTPException(
            status_code=429,
            detail="Забагато спроб входу. Зачекайте кілька хвилин.",
        )

    user = db.query(models.User).filter_by(email=email).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        audit.record(db, "login_failed", request=request, email=email, success=False,
                     detail="невірний пароль або email")
        raise HTTPException(status_code=401, detail="Невірний email або пароль")

    # Другий фактор, якщо увімкнений у користувача
    if user.totp_enabled:
        if not payload.totp_code:
            # сигнал фронту показати поле коду (детальом, не текстом помилки)
            raise HTTPException(status_code=401, detail="2fa_required")
        code_ok = verify_totp(user.totp_secret or "", payload.totp_code) or consume_backup_code(
            user, payload.totp_code, db
        )
        if not code_ok:
            audit.record(db, "login_failed", request=request, email=email, success=False,
                         detail="невірний код 2FA")
            raise HTTPException(status_code=401, detail="Невірний код підтвердження")

    audit.record(db, "login_success", request=request, email=user.email)
    return schemas.TokenOut(
        access_token=create_access_token(user), email=user.email, role=user.role
    )


@app.get("/auth/me", response_model=schemas.UserOut, tags=["auth"])
def me(user: models.User = Depends(require_role(*models.ROLES))):
    return user


@app.post("/auth/change-password", tags=["auth"])
def change_password(
    payload: schemas.ChangePassword,
    request: Request,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(*models.ROLES)),
) -> dict:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Невірний поточний пароль")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    audit.record(db, "password_changed", request=request, email=user.email)
    return {"ok": True}


# ── Двофакторна автентифікація (TOTP) ──
@app.post("/auth/2fa/setup", tags=["auth"])
def twofa_setup(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(*models.ROLES)),
) -> dict:
    """Генерує секрет (поки не активуючи 2FA) і повертає QR + otpauth-URI."""
    secret = make_totp_secret()
    user.totp_secret = secret
    user.totp_enabled = False
    db.commit()
    uri = totp_uri(secret, user.email)
    return {"secret": secret, "otpauth_uri": uri, "qr_svg": qr_svg(uri)}


@app.post("/auth/2fa/enable", tags=["auth"])
def twofa_enable(
    payload: schemas.TwoFACode,
    request: Request,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(*models.ROLES)),
) -> dict:
    if not user.totp_secret:
        raise HTTPException(status_code=400, detail="Спочатку згенеруйте секрет (setup)")
    if not verify_totp(user.totp_secret, payload.code):
        raise HTTPException(status_code=400, detail="Невірний код підтвердження")
    user.totp_enabled = True
    # Генеруємо backup-коди — повертаємо ОДИН раз (зберігаємо лише хеші)
    codes = generate_backup_codes()
    user.backup_codes = hash_backup_codes(codes)
    db.commit()
    audit.record(db, "2fa_enabled", request=request, email=user.email)
    return {"ok": True, "totp_enabled": True, "backup_codes": codes}


@app.post("/auth/2fa/disable", tags=["auth"])
def twofa_disable(
    payload: schemas.TwoFACode,
    request: Request,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(*models.ROLES)),
) -> dict:
    if user.totp_enabled and not (
        verify_totp(user.totp_secret or "", payload.code)
        or consume_backup_code(user, payload.code, db)
    ):
        raise HTTPException(status_code=400, detail="Невірний код підтвердження")
    user.totp_enabled = False
    user.totp_secret = None
    user.backup_codes = None
    db.commit()
    audit.record(db, "2fa_disabled", request=request, email=user.email)
    return {"ok": True, "totp_enabled": False}


@app.post("/auth/2fa/backup-codes", tags=["auth"])
def twofa_regenerate_backup(
    payload: schemas.TwoFACode,
    request: Request,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_role(*models.ROLES)),
) -> dict:
    """Перегенерувати backup-коди (старі стають недійсними). Потрібен актуальний TOTP-код."""
    if not user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA не увімкнено")
    if not verify_totp(user.totp_secret or "", payload.code):
        raise HTTPException(status_code=400, detail="Невірний код підтвердження")
    codes = generate_backup_codes()
    user.backup_codes = hash_backup_codes(codes)
    db.commit()
    audit.record(db, "2fa_backup_regenerated", request=request, email=user.email)
    return {"backup_codes": codes}


# ─────────────  Користувачі (тільки super_admin)  ─────────────
@app.get("/users", response_model=list[schemas.UserOut], tags=["admin"])
def list_users(
    db: Session = Depends(get_db),
    _user: models.User = Depends(require_role(ROLE_SUPER)),
):
    return db.query(models.User).order_by(models.User.id).all()


@app.post("/users", response_model=schemas.UserOut, status_code=201, tags=["admin"])
def create_user(
    payload: schemas.UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    current: models.User = Depends(require_role(ROLE_SUPER)),
):
    if db.query(models.User).filter_by(email=payload.email).first() is not None:
        raise HTTPException(status_code=409, detail="Користувач з таким email уже існує")
    user = models.User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    audit.record(db, "user_created", request=request, email=current.email,
                 detail=f"{user.email} ({user.role})")
    return user


@app.delete("/users/{user_id}", status_code=204, tags=["admin"])
def delete_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current: models.User = Depends(require_role(ROLE_SUPER)),
):
    if user_id == current.id:
        raise HTTPException(status_code=400, detail="Не можна видалити власний акаунт")
    user = db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
    deleted_email = user.email
    db.delete(user)
    db.commit()
    audit.record(db, "user_deleted", request=request, email=current.email, detail=deleted_email)


# ─────────────  Журнал аудиту (тільки super_admin)  ─────────────
@app.get("/audit", response_model=list[schemas.AuditOut], tags=["admin"])
def list_audit(
    action: str | None = None,
    limit: int = 200,
    db: Session = Depends(get_db),
    _user: models.User = Depends(require_role(ROLE_SUPER)),
):
    q = db.query(models.AuditLog)
    if action:
        q = q.filter(models.AuditLog.action == action)
    return q.order_by(models.AuditLog.id.desc()).limit(min(max(limit, 1), 500)).all()


# ─────────────  Аналітика (тільки super_admin)  ─────────────
@app.get("/analytics/summary", tags=["analytics"])
def analytics_summary(
    date_from: str | None = None,
    date_to: str | None = None,
    db: Session = Depends(get_db),
    _user: models.User = Depends(require_role(ROLE_SUPER)),
) -> dict:
    """Зведення для супер-адміна. Виручка рахується ТІЛЬКИ за статусом done.

    Дати порівнюються лексикографічно (формат YYYY-MM-DD це коректно).
    """
    q = db.query(models.Appointment)
    if date_from:
        q = q.filter(models.Appointment.date >= date_from)
    if date_to:
        q = q.filter(models.Appointment.date <= date_to)
    appts = q.all()

    prices = {s.id: s.price for s in db.query(models.Service).all()}
    service_names = {s.id: s.name for s in db.query(models.Service).all()}
    barber_names = {b.id: b.name for b in db.query(models.Barber).all()}

    counts = {"new": 0, "done": 0, "cancelled": 0, "total": len(appts)}
    revenue = 0
    by_service: dict[int, dict] = defaultdict(lambda: {"count": 0, "revenue": 0})
    by_barber: dict[str, dict] = defaultdict(lambda: {"count": 0, "revenue": 0})
    by_day: dict[str, dict] = defaultdict(lambda: {"count": 0, "revenue": 0})

    for a in appts:
        counts[a.status] = counts.get(a.status, 0) + 1
        if a.status != STATUS_DONE:
            continue
        price = prices.get(a.service_id, 0)
        revenue += price
        bs = by_service[a.service_id]
        bs["count"] += 1
        bs["revenue"] += price
        bkey = barber_names.get(a.barber_id, "Будь-який") if a.barber_id else "Будь-який"
        bb = by_barber[bkey]
        bb["count"] += 1
        bb["revenue"] += price
        bd = by_day[a.date]
        bd["count"] += 1
        bd["revenue"] += price

    done = counts["done"]
    return {
        "range": {"from": date_from, "to": date_to},
        "revenue": revenue,
        "avg_check": round(revenue / done, 2) if done else 0,
        "counts": counts,
        "by_service": sorted(
            [{"name": service_names.get(sid, f"#{sid}"), **v} for sid, v in by_service.items()],
            key=lambda x: x["revenue"], reverse=True,
        ),
        "by_barber": sorted(
            [{"name": name, **v} for name, v in by_barber.items()],
            key=lambda x: x["revenue"], reverse=True,
        ),
        "by_day": sorted(
            [{"date": d, **v} for d, v in by_day.items()],
            key=lambda x: x["date"],
        ),
    }
