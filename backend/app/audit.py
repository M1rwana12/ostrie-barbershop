"""Запис подій у журнал аудиту (міні-SOC).

Коди дій (action):
  login_success, login_failed, login_ratelimited,
  password_changed, 2fa_enabled, 2fa_disabled, 2fa_backup_regenerated,
  appointment_status_changed, user_created, user_deleted
"""
from sqlalchemy.orm import Session

from .models import AuditLog
from .ratelimit import client_ip

# Скільки записів журналу тримати (старіші підрізаємо)
KEEP_ROWS = 5000


def record(
    db: Session,
    action: str,
    *,
    request=None,
    email: str | None = None,
    detail: str = "",
    success: bool = True,
) -> None:
    """Додає запис у журнал. Безпечний: не валить основну операцію при збої."""
    try:
        db.add(AuditLog(
            action=action,
            actor_email=(email or None),
            ip=client_ip(request) if request is not None else None,
            success=success,
            detail=detail[:300],
        ))
        db.commit()
        _prune(db)
    except Exception:
        db.rollback()


def _prune(db: Session) -> None:
    """Зрідка підрізаємо старі записи, щоб журнал не ріс безмежно."""
    try:
        last = db.query(AuditLog.id).order_by(AuditLog.id.desc()).first()
        if last and last[0] % 200 == 0:  # перевіряємо приблизно раз на 200 подій
            cutoff = last[0] - KEEP_ROWS
            if cutoff > 0:
                db.query(AuditLog).filter(AuditLog.id < cutoff).delete()
                db.commit()
    except Exception:
        db.rollback()
