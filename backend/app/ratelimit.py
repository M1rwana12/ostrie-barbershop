"""Простий in-memory rate-limit за IP (sliding window).

Достатньо для free-плану Render (один інстанс, один процес). Стан тримається в
памʼяті й скидається при рестарті — це ок для анти-спаму форми запису.
Для кількох інстансів/процесів потрібен спільний бекенд (Redis тощо).
"""
import time
from collections import defaultdict, deque
from threading import Lock

# IP → черга таймстемпів запитів у межах вікна
_hits: dict[str, deque[float]] = defaultdict(deque)
_lock = Lock()


def is_rate_limited(key: str, limit: int, window_seconds: int) -> bool:
    """True, якщо для `key` перевищено `limit` запитів за `window_seconds`."""
    now = time.monotonic()
    cutoff = now - window_seconds
    with _lock:
        q = _hits[key]
        while q and q[0] < cutoff:
            q.popleft()
        if len(q) >= limit:
            return True
        q.append(now)
        # легке прибирання порожніх ключів, щоб словник не ріс безмежно
        if len(_hits) > 10_000:
            for k in [k for k, v in _hits.items() if not v]:
                _hits.pop(k, None)
        return False


def client_ip(request) -> str:
    """IP клієнта з урахуванням проксі Render (X-Forwarded-For — перший хоп)."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
