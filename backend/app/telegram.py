"""Асинхронна відправка сповіщень майстру в Telegram."""
import httpx

from .config import settings


async def notify_new_appointment(text: str) -> None:
    """Надсилає повідомлення в Telegram. Не валить запит, якщо бот не налаштований/недоступний."""
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        return  # бот не налаштований — мовчки пропускаємо

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(url, json=payload)
    except Exception:
        # сповіщення — не критичне; запис уже збережено в БД
        pass
