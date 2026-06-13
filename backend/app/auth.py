"""Автентифікація: bcrypt-паролі, JWT-токени, TOTP-2FA та залежності ролей."""
import io
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
import pyotp
import qrcode
import qrcode.image.svg
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from . import models
from .config import settings
from .database import get_db

_bearer = HTTPBearer(auto_error=False)

ISSUER = "OSTRIE"


# ── Паролі ──
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except ValueError:
        return False


# ── JWT ──
def create_access_token(user: "models.User") -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "iat": now,
        "exp": now + timedelta(minutes=settings.jwt_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _decode(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


# ── TOTP (двофакторна автентифікація) ──
def make_totp_secret() -> str:
    return pyotp.random_base32()


def totp_uri(secret: str, email: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=email, issuer_name=ISSUER)


def verify_totp(secret: str, code: str) -> bool:
    if not secret or not code:
        return False
    # valid_window=1 — приймаємо сусідні 30-секундні вікна (компенсація розсинхрону годинника)
    return pyotp.TOTP(secret).verify(code.strip().replace(" ", ""), valid_window=1)


def qr_svg(uri: str) -> str:
    """SVG-QR без PIL (SvgPathImage не потребує Pillow)."""
    img = qrcode.make(uri, image_factory=qrcode.image.svg.SvgPathImage)
    buf = io.BytesIO()
    img.save(buf)
    return buf.getvalue().decode()


# ── Залежності ──
def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> models.User:
    if creds is None:
        raise HTTPException(status_code=401, detail="Потрібна авторизація")
    try:
        payload = _decode(creds.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Сесія закінчилась. Увійдіть знову.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Невірний токен")

    user = db.get(models.User, int(payload.get("sub", 0)))
    if user is None:
        raise HTTPException(status_code=401, detail="Користувача не знайдено")
    return user


def require_role(*roles: str):
    """Залежність, що пропускає лише користувачів із дозволеною роллю."""
    def checker(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Недостатньо прав")
        return user
    return checker
