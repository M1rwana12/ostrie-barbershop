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

## БД: POSTGRES НА RENDER — 2026-06-14
- [x] Драйвер `psycopg[binary]>=3.2` у `requirements.txt`.
- [x] Нормалізація URL у `config.py` (`settings.db_url`): `postgres://` / `postgresql://`
  → `postgresql+psycopg://`. SQLite лишається дефолтом для локалки.
- [x] `database.py` бере `settings.db_url` + `pool_pre_ping` для не-SQLite (відсіює
  «протухлі» зʼєднання на free-Render). `create_all`+`seed` ідемпотентні → таблиці й
  початкові дані піднімуться на чистій Postgres автоматично.
- [x] `render.yaml`: блок `databases:` (free Postgres `ostrie-db`) + env `DATABASE_URL`
  через `fromDatabase`. Локально перевірено: нормалізація + старт на SQLite (5 послуг, 4 майстри).
- ⚠️ Free-Postgres на Render видаляється через ~30 днів. Деплой: Render підхопить нову
  версію render.yaml (Blueprint sync) і створить БД; перший старт наповнить seed-даними.

## АДМІН-ПАНЕЛЬ — 2026-06-14
- [x] Роут `#/admin` (hash-роутинг у `App.jsx`, хук `useHashRoute` — без react-router,
  працює на GitHub Pages без 404-фолбеку). Лендинг винесено у `Landing()`.
- [x] `Admin.jsx`: вхід за адмін-токеном (зберігається в `sessionStorage`, авто-вхід),
  таблиця записів (id, дата·час, клієнт, телефон-tel, послуга, майстер, створено).
  Імена послуг/майстрів мапляться з `/services`+`/barbers`; кнопки Оновити/Вийти.
  Обробка 401 (невірний токен) і станів loading/error/empty.
- [x] `getAppointments(token)` у `api.js` (заголовок `X-Admin-Token`).
- [x] Стилі `.admin*` в `index.css` у тон бренду. Білд проходить (vite build OK).
- Доступ: відкрити `…/ostrie-barbershop/#/admin`, ввести `ADMIN_TOKEN` (значення з Render → Environment).

## I18N UA/EN — 2026-06-14
- [x] Легка i18n без залежностей: `src/lib/i18n.jsx` — `LanguageProvider` (Context),
  хук `useI18n()` → `{ lang, setLang, t }`. `t('booking.fName')` (dot-path), підстановка
  `{msg}` через vars, фолбек на ключ. Мова персиститься в `localStorage` (`ostrie_lang`,
  дефолт `uk`); виставляє `document.documentElement.lang`. Обгортка в `main.jsx`.
- [x] Повний словник uk/en для всіх секцій (nav, hero, marquee, services, barbers,
  gallery, about, reviews, booking, footer, preloader, admin). Заголовки з `<br/>` —
  масивами рядків; плюралізація «рік/роки/років» (uk) та year/years (en).
- [x] Перемикач **UA/EN** у Nav (desktop `.nav-cta` + мобільне меню), стилі `.lang-toggle`.
  Фікс: `.nav-cta { display:flex }` поставлено ДО mobile media-query, щоб та лишилась чинною.
- [x] Усі 12 компонентів читають `t()`. Білд проходить (vite build OK, 49 модулів).
- Обмеження: контент із БД (назви/описи послуг, імена/спеціалізації майстрів) — лише
  українською (бекенд без i18n). Статичні meta/JSON-LD в `index.html` теж не перекладаються.

## АНТИ-СПАМ (honeypot + rate-limit) — 2026-06-14
- [x] **Honeypot**: приховане поле `website` у схемі `AppointmentCreate` (default "").
  Фронт: off-screen `.hp-field` (не `display:none`), `tabIndex=-1`, `autoComplete=off`.
  Бекенд: якщо заповнене → імітуємо успіх (201, id=0) БЕЗ збереження й Telegram.
  `website` виключається з даних запису (`model_dump(exclude={"website"})`).
- [x] **Rate-limit** `app/ratelimit.py`: in-memory sliding window за IP (5 запитів / 600с),
  `client_ip()` враховує `X-Forwarded-For` (проксі Render). Перевищення → 429.
  Стан у памʼяті процесу (ок для free single-instance; для кількох інстансів — Redis).
- [x] Фронт обробляє 429 (показує повідомлення бекенду, як і 409). Білд OK.
- [x] Перевірено локально: honeypot→201 без збереження; 5×201 далі 429; stored=5.

## АДМІНКА 2.0: АВТОРИЗАЦІЯ + РОЛІ + АНАЛІТИКА — 2026-06-14
Рішення (узгоджено з користувачем): повноцінна авторизація (акаунти+JWT, ролі), аналітика
по виручці (ціни послуг, без собівартості), статуси записів new/done/cancelled.
### Backend
- [x] Залежності: `bcrypt`, `PyJWT`. Конфіг: `JWT_SECRET`, `JWT_EXPIRE_MINUTES`,
  `SUPER_ADMIN_EMAIL/PASSWORD`.
- [x] Модель `User` (email unique, password_hash bcrypt, role). Ролі: `super_admin/admin/barber`.
  `Appointment.status` (new/done/cancelled, default new).
- [x] `auth.py`: bcrypt-хеш/перевірка, JWT create/decode, залежності `get_current_user`,
  `require_role(*roles)`. `HTTPBearer`.
- [x] `migrate.py`: ідемпотентний `ALTER TABLE appointments ADD COLUMN status` (бо create_all
  не додає колонки до існуючих таблиць). Запускається при старті після create_all.
- [x] `seed.py`: створює супер-адміна з env при першому старті (лише якщо email ще немає —
  ⚠️ зміна пароля пізніше не оновить існуючого користувача).
- [x] Ендпоінти: `POST /auth/login` (→JWT), `GET /auth/me`, `PATCH /appointments/{id}/status`
  (admin+super), `GET/POST/DELETE /users` (тільки super, не можна видалити себе),
  `GET /analytics/summary?date_from&date_to` (тільки super). `GET /appointments` → тепер JWT.
  X-Admin-Token прибрано з ендпоінтів (ADMIN_TOKEN лишився легасі-env).
- [x] Аналітика: виручка ТІЛЬКИ за status=done; counts по статусах, avg_check, розбивки
  by_service/by_barber/by_day. Дати фільтруються лексикографічно (YYYY-MM-DD).
- [x] Перевірено локально end-to-end: 401/логін/me/статус(422 на невалідний)/аналітика
  (revenue=600, avg=600)/users(409 на дубль). Ролі: admin→403 на analytics/users, 200 на
  appointments; super delete self→400.
### Frontend
- [x] `api.js`: JWT у sessionStorage (`ostrie_jwt`), `Bearer`-обгортка `auth()`, функції
  login/getMe/getAppointments/updateAppointmentStatus/getAnalytics/users CRUD.
- [x] `Admin.jsx` переписано: логін email+пароль, авто-вхід за JWT, бейдж ролі, вкладки
  **Записи / Аналітика / Користувачі** (останні дві — лише super_admin).
- [x] `AdminBookings.jsx`: таблиця + зміна статусу селектом (optimistic + відкат), кольори статусів.
- [x] `AdminAnalytics.jsx`: фільтр дат, картки (виручка/середній чек/лічильники), CSS-бари
  by_service/by_barber/by_day (без сторонніх чарт-ліб).
- [x] `AdminUsers.jsx`: список, створення (email/пароль/роль), видалення з підтвердженням.
- [x] i18n uk/en для всієї адмінки. Стилі `.admin-tabs/.an-*/.status-*`. Білд OK (52 модулі).
- [x] `render.yaml`: `JWT_SECRET` (generateValue), `SUPER_ADMIN_EMAIL/PASSWORD` (sync:false).
- Вхід: `…/#/admin` → email+пароль супер-адміна (з Render env).

## БЕЗПЕКА: ЗМІНА ПАРОЛЯ + 2FA (TOTP) — 2026-06-14
- [x] **Супер-адмін сидиться з зашитих даних**: email `senja3209@icloud.com`, пароль —
  зберігається як bcrypt-ХЕШ у `config.super_admin_password_hash` (плейн лише у юзера).
  Сид бере хеш, якщо заданий. Перевірено: логін на проді 200 (super_admin).
- [x] **Зміна пароля**: `POST /auth/change-password` (поточний+новий, будь-яка роль).
  Фронт — вкладка «Безпека» (доступна всім ролям), форма + тост успіху.
- [x] **2FA (TOTP)**: `pyotp`+`qrcode` (SVG без PIL). User-колонки `totp_secret`,
  `totp_enabled` (+міграція ALTER, dialect-aware boolean). Ендпоінти `2fa/setup`
  (секрет+QR+otpauth), `2fa/enable` (код), `2fa/disable` (код). Логін: якщо `totp_enabled`
  і немає коду → 401 `detail="2fa_required"` (фронт показує поле коду), невірний код → 401.
  `UserOut.totp_enabled`. Фронт `AdminSecurity.jsx`: setup з QR (dangerouslySetInnerHTML),
  ввід коду, увімк/вимк. Логін `Admin.jsx` обробляє `2fa_required`.
- [x] Перевірено локально end-to-end: зміна пароля (400/200, старий не діє), 2FA setup→enable
  (400 на невірний код)→login(2fa_required→bad→ok)→disable→login без коду. Усе ок.
- [x] **Дизайн адмінки покращено**: картка логіна (рамка/градієнт/тінь), вкладки, картки
  безпеки `.sec-card`, QR-блок на білому, бейдж стану 2FA, `.form-ok` тост. Білд OK (53 модулі).
- ⚠️ **Postgres ще не під'єднано** → зміна пароля та 2FA-секрет зберігаються лише до
  наступного редеплою (ефемерна SQLite пересідиться). ПОТРІБЕН Blueprint Sync у Render.

## БЕЗПЕКА 2: RATE-LIMIT ЛОГІНА + BACKUP-КОДИ + МОБ.ТАБЛИЦІ — 2026-06-14
- [x] **Rate-limit `/auth/login`**: переюзано `is_rate_limited`/`client_ip` (ключ `login:{ip}`),
  10 спроб / 5 хв → 429. Перевірено: 10×401 далі 429.
- [x] **Backup-коди 2FA**: `User.backup_codes` (JSON bcrypt-хешів) + міграція. При `enable`
  генеруються 8 кодів (виду `a1b2-c3d4`), повертаються ОДИН раз. На логіні поле `totp_code`
  приймає або TOTP, або backup-код (`consume_backup_code` — одноразовий, видаляється).
  `POST /auth/2fa/backup-codes` — регенерація (потрібен актуальний TOTP). `disable` чистить коди.
  `UserOut.backup_codes_remaining`. Перевірено: вхід кодом, повторне використання→401,
  лічильник 8→7, регенерація інвалідовує старі.
- [x] Фронт: `AdminSecurity` показує свіжі коди (panel + copy), лічильник, регенерацію.
  Логін приймає backup-код у тому ж полі.
- [x] **Мобільні таблиці**: `data-label` на td + media (max-640) → рядки стають картками
  (thead схований, label через `::before`). Стосується Записів і Користувачів. Білд OK (53 модулі).

## АУДИТ-ЛОГ (міні-SOC) — 2026-06-14
- [x] Модель `AuditLog` (ts, action, actor_email, ip, success, detail) + `audit.py` (record()
  пише подію окремим commit, не валить основну операцію; `_prune` тримає ~5000 останніх).
- [x] Логуються: login_success/failed/ratelimited, password_changed, 2fa_enabled/disabled/
  backup_regenerated, appointment_status_changed, user_created/deleted. IP з X-Forwarded-For.
- [x] `GET /audit?action=&limit=` (тільки super_admin, ліміт ≤500). `AuditOut`.
- [x] Фронт: вкладка «Журнал» (super), `AdminAudit.jsx` — фільтр за подією, таблиця
  (час/подія/користувач/IP/результат/деталі), бейдж OK/Збій, мобільні картки, i18n uk/en.
- [x] Перевірено локально: події пишуться (login fail/success, user create/delete, pwd change),
  фільтр працює, admin→403. Білд OK.

## ЗАПЛАНОВАНО / TODO
- [ ] **Postgres Blueprint Sync у Render** (ручний крок користувача) — блокує персистентність
  пароля/2FA/записів/аудиту. render.yaml готовий (databases: ostrie-db).
- [ ] Підтвердити/замінити стокові фото та hero-відео на власні (сюжет ↔ підпис).
- [ ] Звірити реальні соц-акаунти, телефон, адресу, координати карти.
- [ ] PWA (manifest + service worker), офлайн-кеш статичних ассетів.
- [ ] Тости/нотифікації замість inline-повідомлень; skeleton-loaders.
- [ ] Аудит-лог дій (міні-SOC) — наступний крок безпеки.
- [ ] Backup-коди для 2FA; rate-limit на /auth/login.
- [ ] (Опц.) i18n контенту з БД та meta/JSON-LD.
- [ ] PWA (manifest + service worker), офлайн-кеш статичних ассетів.
- [ ] Тости/нотифікації замість inline-повідомлень; skeleton-loaders.
- [ ] Rate-limit на POST /appointments (анти-спам), honeypot у формі.
- [ ] Власний домен у CORS.
- [ ] (Опц.) контроль доступних слотів по майстру/даті на фронті (підсвічувати зайняте).

---

## ЛОГ РІШЕНЬ
- 2026-06-13 — Старт. Обрано стек (vanilla single-file), стиль (dark brutalism premium),
  палітру (charcoal + burnt brass), шрифти (Anton + Manrope), тег-лайн («На вістрі стилю»).
- 2026-06-13 — РІШЕННЯ ЗМІНЕНО: single-file → full-stack (React+Vite+Tailwind / FastAPI+SQLite).
  Бренд і візуальна мова збережені; додано робочий онлайн-запис + Telegram-сповіщення.
