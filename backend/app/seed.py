"""Початкові дані для послуг, майстрів та супер-адміна."""
from .auth import hash_password
from .config import settings
from .database import SessionLocal
from .models import ROLE_SUPER, Barber, Service, User

SERVICES = [
    {"name": "Чоловіча стрижка", "price": 600, "duration": 45,
     "description": "Стрижка машинкою та ножицями, миття, укладка під ваш тип волосся."},
    {"name": "Оформлення бороди", "price": 450, "duration": 30,
     "description": "Моделювання форми, окантовка бритвою, олії та гарячий компрес."},
    {"name": "Комплекс «OSTRIE»", "price": 950, "duration": 75,
     "description": "Стрижка + борода + стайлінг. Повний образ за один візит."},
    {"name": "Королівське гоління", "price": 550, "duration": 40,
     "description": "Гоління небезпечною бритвою, гарячі рушники, чотири етапи догляду."},
    {"name": "Дитяча стрижка", "price": 400, "duration": 30,
     "description": "Для джентльменів до 12 років. Спокійно, акуратно, з мультиком."},
]

BARBERS = [
    {"name": "Артем Гострий", "specialty": "Класика · Фейд · Борода",
     "experience": 12, "role": "Founder · Top Barber"},
    {"name": "Денис Лезо", "specialty": "Андеркат · Текстура · Стайлінг",
     "experience": 8, "role": "Senior Barber"},
    {"name": "Макс Бритва", "specialty": "Гоління · Hot Towel · Догляд",
     "experience": 6, "role": "Barber · Shave Expert"},
    {"name": "Іван Сталь", "specialty": "Молодіжні · Візерунки · Дитячі",
     "experience": 4, "role": "Junior Barber"},
]


def seed() -> None:
    """Наповнює БД початковими даними один раз (якщо таблиці порожні)."""
    db = SessionLocal()
    try:
        if db.query(Service).count() == 0:
            db.add_all(Service(**s) for s in SERVICES)
        if db.query(Barber).count() == 0:
            db.add_all(Barber(**b) for b in BARBERS)

        # Супер-адмін: створюємо, якщо такого email ще немає.
        # Пріоритет — готовий bcrypt-хеш (super_admin_password_hash), інакше хешуємо пароль.
        email = settings.super_admin_email.strip().lower()
        if email and db.query(User).filter_by(email=email).first() is None:
            pwd_hash = settings.super_admin_password_hash.strip() or hash_password(
                settings.super_admin_password
            )
            db.add(User(email=email, password_hash=pwd_hash, role=ROLE_SUPER))
        db.commit()
    finally:
        db.close()
