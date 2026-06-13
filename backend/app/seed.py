"""Початкові дані для послуг та майстрів."""
from .database import SessionLocal
from .models import Barber, Service

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
        db.commit()
    finally:
        db.close()
