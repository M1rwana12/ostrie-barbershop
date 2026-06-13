# PROGRESS — OSTRIE Barbershop

Спільна пам'ять проєкту. Читати на початку кожної сесії.

> **РІШЕННЯ ЗМІНЕНО: 2026-06-13** — перехід від single-file сайту до **full-stack**
> архітектури: `/frontend` (React + Vite + Tailwind, компонентна структура) +
> `/backend` (FastAPI + SQLite + SQLAlchemy) з REST API та Telegram-сповіщеннями.
> Причина: потрібна робоча система онлайн-запису (динамічні дані, валідація на сервері,
> перевірка зайнятості слота, сповіщення майстру). Дизайн/палітра/шрифти/бренд — збережено.
> Старий single-file `index.html` видалено з кореня (історія лишилась у git).

---

## КЛЮЧОВІ РІШЕННЯ

### Стек
- **Чистий HTML + CSS + JS, single-file (`index.html`).**
  Причина: обсяг — односторінковий лендинг. React/збірка дали б зайву вагу й крок білду без реальної користі. Один файл = миттєвий деплой, нульові залежності, максимальна швидкість (важливо, бо основний трафік — Instagram/TikTok з мобільних).

### Візуальний напрям (dark editorial / modern brutalism, premium)
- **Палітра:**
  - фон — глибокий вугільний `#0c0c0d` (+ відтінки `#111113`, `#17171a`)
  - текст — off-white `#ece7df`, приглушений `#9b958c`
  - акцент — **burnt brass / amber `#c9742d`** (теплий латунний)
  - РІШЕННЯ по акценту: обрано латунь/burnt-orange, а НЕ кров'яний red.
    Причина: червоний у барбершопах — кліше (барбер-стовп). Латунь на вугільному читається як «премʼюм-вишукано», тепло, дорого, не глянцево.
- **Типографіка:**
  - Display — **Anton** (брутальний condensed, UPPERCASE, щільний). Гігантські заголовки, hero, номери.
  - Body — **Manrope** (чистий гротеск, добра читабельність).
  - Причина: Anton дає брутальний «лезовий» характер; Manrope тримає текст вишуканим і легким. Свідомо уникнув Inter/Roboto/Space Grotesk (AI-кліше).
- **Сітка:** асиметрична, з повітрям; великі outline-номери секцій (/01.. /07); грубі hairline-роздільники.
- **Атмосфера:** SVG film-grain overlay, radial-glow латунню, repeating-line текстури у плейсхолдерах, вертикальний scroll-cue, marquee-стрічка.

### Тег-лайн
Варіанти: 1) «Точність. Характер. Лезо.» 2) «Кожен різ — впевнений.» 3) «На вістрі стилю».
**Обрано головним: «НА ВІСТРІ СТИЛЮ»** — обіграє назву (ostrie=вістря), коротко, звучно, премʼюм.

---

## ЗРОБЛЕНО
- [x] Базова структура, design-tokens (CSS variables), reset, grain overlay.
- [x] Sticky-навігація з якорями + мобільне повноекранне меню (burger).
- [x] Hero — гігантський OSTRIE, тег-лайн, 2 CTA, атмосферний фон-плейсхолдер, scroll-cue.
- [x] Marquee-стрічка послуг.
- [x] Секція Послуги + ціни (5 послуг: стрижка, борода, комплекс, гоління, дитяча) — ціна + тривалість, hover-ефект.
- [x] Майстри (4 картки: фото-плейсхолдер, ім'я, роль, досвід, теги).
- [x] Галерея робіт — masonry (CSS columns), hover-figcaption, до/після.
- [x] Про нас — маніфест + 3 переваги (іконки SVG) + рядок статистики.
- [x] Відгуки — grid із 4 карток, hover-lift.
- [x] Запис — форма (ім'я, телефон, послуга, майстер, дата, час) з JS-валідацією + екран успіху.
- [x] Контакти/футер — мапа-плейсхолдер, адреса, графік, соцмережі, телефон, навігація.
- [x] Scroll-reveal через IntersectionObserver, smooth-scroll, hover-мікроанімації.
- [x] Адаптив mobile-first, доступність (focus-стани, aria, alt/role, prefers-reduced-motion, контраст).
- [x] `.gitignore`, `PROGRESS.md`, `README.md`.

## В ПРОЦЕСІ
- [x] Git ініціалізовано (`main`), user.name=m1rwana12, user.email=senja3209@icloud.com.
- [x] Перші коміти: `chore: initialize…`, `feat: build OSTRIE…` (sole author, без co-author).
- [x] **Push виконано** → https://github.com/M1rwana12/ostrie-barbershop (main).
  Репо створено через GitHub API (токен з Git Credential Manager).
- [x] **GitHub Pages увімкнено** (branch main, root). Сайт live:
  https://m1rwana12.github.io/ostrie-barbershop/ (build: built, HTTP 200).

## СИГНАТУРНІ ФІШКИ (індивідуальність) — 2026-06-13
Реалізовано 4 фішки, що тримають концепцію «лезо/вістря» від завантаження до запису:
- [x] **Слайдер «До / Після» з лезвом** у галереї — drag (pointer) + клавіатура (←/→/Home/End),
  role="slider", ручка-бритва, підпис «потягни лезо».
- [x] **Кастомний курсор-лезво + slice** (тільки fine-pointer): лезо з інерцією слідує за мишею,
  росте над інтерактивом, ховається над полями вводу; «slice»-блиск на ховері карток галереї.
- [x] **Кінематографічний прелоадер** (лінія-лезо → літери OSTRIE піднімаються → завіса) +
  **магнітні CTA-кнопки** + **прогрес-скролу як лезо** (тонка лінія зверху).
- [x] **Конструктор образу** в секції запису: чекбокси послуг → живий перерахунок ціни/часу →
  кнопка «Записатись з цим образом» підставляє вибір у `<select>` форми й скролить до неї.
Всі ефекти поважають `prefers-reduced-motion` та вимикаються на тач-пристроях, де доречно.

## FULL-STACK (React + FastAPI) — 2026-06-13
### Backend `/backend` (FastAPI + SQLAlchemy 2 + SQLite)
- [x] Структура: `app/{config,database,models,schemas,seed,telegram,main}.py`.
- [x] Моделі: Service, Barber, Appointment. Seed послуг і майстрів при старті.
- [x] Ендпоінти: `GET /services`, `GET /barbers`, `POST /appointments`, `GET /appointments`
  (адмін, заголовок `X-Admin-Token`).
- [x] Pydantic-валідація (ім'я, телефон, дата у майбутньому, формат часу).
- [x] Перевірка зайнятості слота (майстер+дата+час) → 409 Conflict.
- [x] Async Telegram-сповіщення майстру (httpx), токен/chat_id з `.env`; не валить запит при збої.
- [x] CORS з `.env` (dev: localhost:5173). `.env.example` наданий.

### Frontend `/frontend` (React + Vite + Tailwind)
- [x] Токени бренду в `tailwind.config.js` + повна дизайн-система в `src/index.css`.
- [x] Компоненти: Nav, Hero, Marquee, Services, Barbers, Gallery, About, Reviews, Booking, Footer,
  Preloader, Cursor. Хук `useSignatureEffects` (reveal, прогрес, курсор, магніт, до/після).
- [x] Services/Barbers тягнуться з API (стани loading/error).
- [x] Booking: конструктор образу + форма з валідацією → `POST /appointments`,
  обробка 409, екран успіху.
- [x] `src/lib/api.js` — клієнт REST (VITE_API_URL з `.env`).
- [x] README з інструкціями запуску обох частин і налаштування Telegram.

## ДЕПЛОЙ — 2026-06-13
- [x] **Frontend → GitHub Pages** (автоматично через GitHub Actions).
  Workflow `.github/workflows/deploy-frontend.yml`: build Vite → deploy Pages.
  Live: https://m1rwana12.github.io/ostrie-barbershop/ (HTTP 200).
  `vite.config` base=`/ostrie-barbershop/`. URL бекенду — repo variable `VITE_API_URL`.
- [x] **Backend → Render** (Blueprint `render.yaml`, free plan) — ЗАДЕПЛОЄНО.
  URL: https://ostrie-barbershop-api.onrender.com (= `VITE_API_URL`, збіглося).
  Перевірено end-to-end: GET /services (5), /barbers (4), POST → 201, дубль → 409,
  CORS дозволяє https://m1rwana12.github.io. Live-бандл фронту звертається на цей URL.
  Нюанс free: cold start — перший запит після сну може дати 404 (`x-render-routing: no-server`),
  поки інстанс прокидається. Пом'якшено: GET у `api.js` ретраїться кілька разів.
  Ефемерний диск → SQLite скидається при редеплої (для прод — Postgres).

## КОНТЕНТ (фото / карта / соцмережі) — 2026-06-13
- [x] Реальні стокові фото (Unsplash, безкоштовна ліцензія) — централізовано у `src/lib/images.js`.
  Hero, майстри, галерея, слайдер до/після. Фото ілюстративні (я не бачу вміст) — легко замінити.
- [x] Hero — **анімоване фото** (Ken Burns zoom/pan, CSS) + scrim для читабельності тексту.
- [x] Ефекти: майстри/галерея — grayscale→color на hover; до/після — реальні фото у шторці-лезі.
- [x] Карта — живий **Google Maps embed** (`output=embed`, темна тема через CSS-фільтр).
- [x] Соцмережі — реальні URL (Instagram/TikTok/Facebook/Telegram), target=_blank rel=noopener.

## АКТУАЛЬНІСТЬ / БРЕНД / SEO — 2026-06-13
- [x] **Hero-відео** (Mixkit, безкоштовна ліцензія, 720p ~1.9MB) — muted/loop/playsinline,
  постер = фото, для prefers-reduced-motion показуємо лише фото. Структура `.hero-media`.
- [x] **Логотип** — SVG-марка (кільце «O» + лезо), компонент `Logo.jsx`, у nav і футері
  (hover-обертання). **Favicon** — `public/favicon.svg` (та сама марка на темному тлі).
- [x] **SEO** — Open Graph + Twitter meta, JSON-LD `HairSalon` (адреса, графік, телефон, соцмережі),
  favicon через `%BASE_URL%`.
- [x] **Жива доступність слотів** — backend `GET /availability?barber_id&date` → зайняті часи;
  форма підтягує й вимикає зайняті слоти в реальному часі. Перевірено на проді (end-to-end).

## ЗАПЛАНОВАНО / TODO
- [ ] Підтвердити/замінити стокові фото та hero-відео на власні (сюжет ↔ підпис).
- [ ] Звірити реальні соц-акаунти, телефон, адресу, координати карти.
- [ ] Адмін-панель (перегляд записів через `GET /appointments` + токен) — окремий роут.
- [ ] i18n UA/EN перемикач.
- [ ] PWA (manifest + service worker), офлайн-кеш статичних ассетів.
- [ ] Postgres на Render (постійні дані замість ефемерної SQLite).
- [ ] Тости/нотифікації замість inline-повідомлень; skeleton-loaders.
- [ ] Rate-limit на POST /appointments (анти-спам), honeypot у формі.
- [ ] Адмін-панель для перегляду записів (зараз лише `GET /appointments` з токеном).
- [ ] Postgres на Render для постійних даних; власний домен у CORS.
- [ ] (Опц.) контроль доступних слотів по майстру/даті на фронті (підсвічувати зайняте).

---

## ЛОГ РІШЕНЬ
- 2026-06-13 — Старт. Обрано стек (vanilla single-file), стиль (dark brutalism premium),
  палітру (charcoal + burnt brass), шрифти (Anton + Manrope), тег-лайн («На вістрі стилю»).
- 2026-06-13 — РІШЕННЯ ЗМІНЕНО: single-file → full-stack (React+Vite+Tailwind / FastAPI+SQLite).
  Бренд і візуальна мова збережені; додано робочий онлайн-запис + Telegram-сповіщення.
