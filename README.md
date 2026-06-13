# OSTRIE — full-stack сайт барбершопу

Преміальний міський барбершоп **OSTRIE** (вістря / лезо) з робочою системою онлайн-запису.
Брутальна, але вишукана темна естетика. Тег-лайн: **«На вістрі стилю»**.

```
.
├── frontend/   # React + Vite + Tailwind (компонентна структура)
├── backend/    # FastAPI + SQLite (SQLAlchemy), Telegram-сповіщення
├── README.md
├── PROGRESS.md # спільна пам'ять проєкту
└── .gitignore
```

## Стек і дизайн
- **Frontend:** React 18 + Vite + Tailwind CSS. REST через `fetch`.
- **Backend:** FastAPI + SQLAlchemy 2 + SQLite (легко мігрувати на Postgres).
- **Сповіщення:** при новому записі бекенд async-надсилає повідомлення майстру в Telegram.
- **Стиль:** dark editorial / modern brutalism, premium.
  Палітра — вугільний `#0c0c0d` + латунний `#c9742d` + off-white `#ece7df`.
  Шрифти — **Anton** (display, UPPERCASE) + **Manrope** (body).

---

## 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env          # Windows: copy .env.example .env
# відредагуй .env (Telegram-токен, admin-токен) — див. нижче

uvicorn app.main:app --reload --port 8000
```

- API: <http://localhost:8000>
- Swagger-документація: <http://localhost:8000/docs>
- При першому старті БД `ostrie.db` створюється й наповнюється seed-даними (послуги, майстри).

### Ендпоінти
| Метод | Шлях             | Опис                                                   |
|-------|------------------|--------------------------------------------------------|
| GET   | `/services`      | Список послуг (id, назва, ціна, тривалість, опис)       |
| GET   | `/barbers`       | Список майстрів (id, ім'я, спеціалізація, досвід, роль) |
| POST  | `/appointments`  | Створити запис. 409, якщо слот зайнятий                 |
| GET   | `/appointments`  | Список записів (адмін; заголовок `X-Admin-Token`)       |

### Telegram-бот (сповіщення майстру)
1. У Telegram напиши **@BotFather** → `/newbot` → отримай **TOKEN**.
2. Напиши своєму боту будь-що, потім відкрий
   `https://api.telegram.org/bot<TOKEN>/getUpdates` і знайди `chat.id`.
3. Впиши у `backend/.env`:
   ```env
   TELEGRAM_BOT_TOKEN=123456:ABC...
   TELEGRAM_CHAT_ID=987654321
   ADMIN_TOKEN=придумай-свій-секрет
   ```
Якщо токен не заданий — запис усе одно зберігається, сповіщення просто пропускається.

---

## 2. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env          # Windows: copy .env.example .env
# VITE_API_URL=http://localhost:8000  (за замовчуванням)

npm run dev
```

- Додаток: <http://localhost:5173>
- Збірка продакшену: `npm run build` → каталог `dist/` (попередній перегляд: `npm run preview`).

Запускай **обидві** частини одночасно (бекенд на 8000, фронт на 5173).
Секції «Послуги» та «Майстри» тягнуть дані з бекенду; форма запису робить `POST /appointments`.

---

## Деплой

### Frontend → GitHub Pages (автоматично)
Push у `main`, що зачіпає `frontend/**`, запускає workflow
`.github/workflows/deploy-frontend.yml`: збірка Vite → публікація на Pages.
- Live: <https://m1rwana12.github.io/ostrie-barbershop/>
- URL бекенду задається repository variable **`VITE_API_URL`**
  (Settings → Secrets and variables → Actions → Variables). Після зміни — перезапусти workflow.
- `vite.config.js` має `base: '/ostrie-barbershop/'` (project pages).

### Backend → Render (через Blueprint)
1. <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Під'єднай репозиторій `M1rwana12/ostrie-barbershop` — Render прочитає `render.yaml`.
3. **Apply** → створиться web-сервіс `ostrie-barbershop-api` (free plan).
4. У вкладці сервісу → **Environment** впиши `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID` (за бажанням).
5. Після деплою отримаєш URL виду `https://ostrie-barbershop-api.onrender.com`.
   Якщо він **інший** — онови repository variable `VITE_API_URL` на фронті й перезапусти Pages-workflow.

> ⚠️ Free-план Render «засинає» після ~15 хв без трафіку (перший запит ~30 с) і має
> ефемерну файлову систему — SQLite скидається при редеплої. Для постійних даних
> підключи Render Postgres і встанови `DATABASE_URL` (код уже це підтримує).

## Що замінити перед продакшеном
Деталі — у [`PROGRESS.md`](./PROGRESS.md) → TODO: реальні фото, Google Maps iframe,
домен у CORS, перехід на Postgres, реальні соц-посилання, favicon/OG.
