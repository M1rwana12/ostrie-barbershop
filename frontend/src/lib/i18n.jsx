import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ostrie_lang'
export const LANGS = ['uk', 'en']

// ─────────────  Словники  ─────────────
// Примітка: контент із бекенду (назви/описи послуг, імена та спеціалізації майстрів)
// приходить лише українською — i18n охоплює статичний UI. Імена людей не перекладаємо.
const dict = {
  uk: {
    nav: {
      services: 'Послуги', masters: 'Майстри', gallery: 'Роботи', about: 'Про нас',
      reviews: 'Відгуки', booking: 'Запис', contacts: 'Контакти',
      cta: 'Записатись', openMenu: 'Відкрити меню', closeMenu: 'Закрити меню',
      langLabel: 'Мова', toHome: 'OSTRIE — на головну',
    },
    hero: {
      badge: 'Барбершоп №1', address: 'вул. Січових Стрільців, 14', city: 'Київ',
      hours: 'Пн–Нд · 10:00—21:00', online: 'Запис онлайн 24/7',
      taglinePre: 'На ', taglineEm: 'вістрі', taglinePost: ' стилю',
      sub: 'Преміальний міський барбершоп для чоловіків, які цінують точність і характер. Кожен різ — впевнений.',
      ctaBook: 'Записатись', ctaServices: 'Послуги та ціни', scroll: 'Гортай',
    },
    marquee: ['Стрижка', 'Борода', 'Королівське гоління', 'Камуфляж сивини', 'Дитяча стрижка', 'Стайлінг'],
    services: {
      kicker: '01 — Прайс', title: ['Послуги', 'та ціни'],
      intro: 'Чесний прайс без прихованих доплат. Кожна процедура — з консультацією, гарячим рушником та напоєм за рахунок закладу.',
      loading: 'Завантажуємо прайс…', error: 'Не вдалося завантажити послуги. Перевірте, що бекенд запущено.',
      currency: 'грн',
    },
    barbers: {
      kicker: '02 — Команда', title: ['Майстри'],
      intro: 'Барбери з характером. Кожен — зі своїм почерком і роками практики за кріслом.',
      loading: 'Завантажуємо команду…', error: 'Не вдалося завантажити майстрів.',
      expSuffix: 'за кріслом', photoAlt: 'Майстер',
    },
    gallery: {
      kicker: '03 — Портфоліо', title: ['Наші', 'роботи'],
      intro: 'Реальні клієнти, реальні трансформації. До та після — без фотошопу.',
      baLabel: 'Трансформація — потягни лезо', after: 'Після', before: 'До',
      sliderLabel: 'Повзунок до/після', hint: '← перетягни →',
      captions: ['Фейд + борода', 'Класика', 'До / Після', 'Текстурний кроп', 'Гоління', 'Андеркат', 'Борода', 'Помпадур', 'Камуфляж сивини'],
    },
    about: {
      kicker: '04 — Маніфест', title: ['Не салон.', 'Майстерня', 'характеру.'],
      manifesto: 'OSTRIE — це місце, де чоловік виходить іншим, ніж зайшов. Ми не женемося за трендами заради трендів. Ми працюємо лезом, як скульптор різцем: точно, впевнено, без зайвого. Тут немає метушні — є ритуал. Гаряча кава, важка музика, тверда рука майстра і дзеркало, у яке хочеться дивитись.',
      signName: 'Артем Гострий', signRole: 'Засновник OSTRIE',
      features: [
        { title: 'Тільки преміум-косметика', text: 'Працюємо на професійних брендах догляду. Жодних компромісів зі складом.' },
        { title: 'Стерильність інструменту', text: 'Кожен інструмент проходить сухожарову стерилізацію. Безпека — без винятків.' },
        { title: 'Гарантія на результат', text: 'Щось не так? Безкоштовно доопрацюємо протягом 7 днів після візиту.' },
      ],
      stats: [
        ['12K+', 'задоволених клієнтів'], ['9', 'років на ринку'],
        ['4.9', 'рейтинг Google'], ['5', 'майстрів у команді'],
      ],
    },
    reviews: {
      kicker: '05 — Відгуки', title: ['Що кажуть', 'клієнти'], starsLabel: '5 з 5',
      items: [
        { text: 'Ходжу два роки й жодного разу не пошкодував. Артем робить фейд так, що відростає рівно — це магія. Атмосфера окрема тема.', name: 'Олег Кравченко', src: 'Постійний клієнт' },
        { text: 'Королівське гоління — це не просто послуга, це ритуал. Гарячі рушники, бритва, тиша. Виходиш як новий. Рекомендую кожному.', name: 'Дмитро Шевчук', src: 'Google review' },
        { text: 'Привів сина на першу дитячу стрижку — боявся, що буде істерика. Майстер знайшов підхід за хвилину. Тепер ходимо разом.', name: 'Віталій Бондар', src: 'Instagram' },
        { text: 'Найкращий барбершоп у місті, без перебільшення. Запис зручний, ніколи не чекаю. Денис розуміє з пів слова, що мені треба.', name: 'Андрій Мельник', src: 'Постійний клієнт' },
      ],
    },
    booking: {
      cxTitle: 'Збери свій образ', cxSub: 'Познач послуги — ціна й час оновляться миттєво.',
      cxBadge: 'Калькулятор', total: 'Разом', currency: 'грн', duration: 'Триватиме',
      cxApply: 'Записатись з цим образом',
      kicker: '06 — Запис', title: ['Зайняти', 'крісло'],
      lead: 'Залиш заявку — і ми передзвонимо протягом 15 хвилин, щоб підтвердити час. Або одразу обери все самостійно у формі.',
      cPhone: 'Телефон', cAddress: 'Адреса', cAddressVal: 'вул. Січових Стрільців, 14, Київ',
      cSchedule: 'Графік', cScheduleVal: 'Щодня 10:00 — 21:00',
      successTitle: 'Запис прийнято!', successText: 'Дякуємо. Ми передзвонимо протягом 15 хвилин, щоб підтвердити деталі. До зустрічі в OSTRIE.',
      fName: "Ім'я", fNamePh: 'Як до вас звертатись', fPhone: 'Телефон', fPhonePh: '+380 __ ___ __ __',
      fService: 'Послуга', fServicePh: 'Оберіть послугу', fBarber: 'Майстер', fBarberAny: 'Будь-який майстер',
      fDate: 'Дата', fTime: 'Час', fTimePh: 'Оберіть час', taken: ' — зайнято',
      submit: 'Підтвердити запис', submitting: 'Надсилаємо…',
      note: 'Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних',
      errName: "Вкажіть, будь ласка, ім'я", errPhone: 'Схоже на некоректний номер',
      errService: 'Оберіть послугу', errDate: 'Оберіть дату', errDateFuture: 'Оберіть майбутню дату', errTime: 'Оберіть час',
      errSend: 'Не вдалося надіслати запис: {msg}. Спробуйте ще раз або зателефонуйте нам.',
      unitH: 'год', unitMin: 'хв',
    },
    footer: {
      mapTitle: 'Мапа розташування барбершопу OSTRIE',
      desc: 'Преміальний міський барбершоп. Точність, характер і повага до часу кожного клієнта. На вістрі стилю з 2017 року.',
      navTitle: 'Навігація', linkServices: 'Послуги та ціни', linkMasters: 'Майстри', linkGallery: 'Наші роботи',
      linkAbout: 'Про нас', linkReviews: 'Відгуки', linkBooking: 'Онлайн-запис',
      contactsTitle: 'Контакти', address: 'вул. Січових Стрільців, 14, Київ',
      scheduleTitle: 'Графік роботи', weekdays: 'Пн — Пт', weekend: 'Сб — Нд',
      rights: '© 2017—2026 OSTRIE. Усі права захищено.', madeBy: 'Зроблено на вістрі', toTop: 'Догори ↑',
    },
    preloader: { sub: 'На вістрі стилю' },
    admin: {
      brand: 'OSTRIE · Адмін', refresh: 'Оновити', refreshing: 'Оновлюю…', logout: 'Вийти',
      panel: 'Панель адміністратора', loginTitle: 'Вхід',
      loginHint: 'Увійдіть, щоб керувати записами. Сесія зберігається лише в цій вкладці.',
      emailLabel: 'Email', passwordLabel: 'Пароль', enter: 'Увійти', checking: 'Перевіряю…',
      errCreds: 'Невірний email або пароль.',
      tabBookings: 'Записи', tabAnalytics: 'Аналітика', tabUsers: 'Користувачі',
      title: 'Записи', empty: 'Поки що записів немає.',
      colDate: 'Дата · Час', colClient: 'Клієнт', colPhone: 'Телефон', colService: 'Послуга',
      colBarber: 'Майстер', colStatus: 'Статус', colCreated: 'Створено', anyBarber: 'будь-який',
      statusNew: 'Новий', statusDone: 'Виконано', statusCancelled: 'Скасовано',
      anTitle: 'Аналітика', from: 'Від', to: 'До', apply: 'Застосувати', reset: 'Скинути',
      mRevenue: 'Виручка', mAvg: 'Середній чек', mDone: 'Виконано', mNew: 'Нові', mCancelled: 'Скасовано', mTotal: 'Усього',
      byService: 'За послугами', byBarber: 'За майстрами', byDay: 'За днями',
      count: 'к-сть', noData: 'Немає даних для виручки. Позначте записи як «Виконано».',
      anNote: 'Виручка рахується лише за виконаними записами (статус «Виконано»).',
      usersTitle: 'Користувачі', addUser: 'Додати користувача',
      uEmail: 'Email', uPassword: 'Пароль', uRole: 'Роль',
      roleSuper: 'Супер-адмін', roleAdmin: 'Адмін', roleBarber: 'Майстер',
      create: 'Створити', creating: 'Створюю…', del: 'Видалити', you: 'це ви',
      confirmDelete: 'Видалити користувача {email}?',
      errLoad: 'Не вдалося завантажити дані: {msg}', currency: 'грн', locale: 'uk-UA',
      tabSecurity: 'Безпека',
      secPwdTitle: 'Зміна пароля', curPwd: 'Поточний пароль', newPwd: 'Новий пароль',
      changeBtn: 'Змінити пароль', changing: 'Зберігаю…', pwdChanged: 'Пароль оновлено ✓',
      sec2faTitle: 'Двофакторна автентифікація', sec2faStateOn: 'Увімкнено', sec2faStateOff: 'Вимкнено',
      sec2faIntro: 'Додатковий код із застосунку (Google Authenticator, Authy тощо) при кожному вході.',
      enable2fa: 'Увімкнути 2FA', disable2fa: 'Вимкнути 2FA',
      scanQr: 'Відскануйте QR у застосунку-автентифікаторі або введіть ключ вручну:',
      enterCode: 'Введіть 6-значний код із застосунку', confirm: 'Підтвердити',
      twofaOn: '2FA увімкнено ✓', twofaOff: '2FA вимкнено ✓',
      login2faHint: 'Введіть код із застосунку-автентифікатора', loginCode: 'Код 2FA',
      loginCodeHint: 'або один із backup-кодів',
      backupTitle: 'Резервні коди', backupRemaining: 'Залишилось кодів: {n}',
      backupSaveHint: 'Збережіть ці коди в надійному місці. Кожен працює один раз і замінює код 2FA, якщо ви втратите телефон. Більше вони не покажуться.',
      backupCopy: 'Скопіювати', backupCopied: 'Скопійовано ✓', backupDone: 'Я зберіг коди',
      backupRegen: 'Перегенерувати коди', backupRegenHint: 'Введіть поточний код 2FA, щоб згенерувати нові (старі перестануть діяти).',
      tabAudit: 'Журнал', auditTitle: 'Журнал подій',
      auColTime: 'Час', auColAction: 'Подія', auColActor: 'Користувач', auColIp: 'IP',
      auColResult: 'Результат', auColDetail: 'Деталі', auAll: 'Усі події',
      auOk: 'OK', auFail: 'Збій',
      tabDashboard: 'Огляд', dashTitle: 'Огляд',
      dashRevenue30: 'Виручка (30 днів)', dashRevenueChart: 'Виручка за днями',
      dashToday: 'Записи на сьогодні', dashNoToday: 'На сьогодні записів немає.',
      dashActivity: 'Останні події', dashMax: 'макс', noChart: 'Замало даних для графіка.',
      searchPh: 'Пошук: імʼя, телефон, послуга…',
      toastStatus: 'Статус оновлено', toastUserCreated: 'Користувача створено', toastUserDeleted: 'Користувача видалено',
      auditActions: {
        login_success: 'Вхід', login_failed: 'Невдалий вхід', login_ratelimited: 'Заблоковано (брутфорс)',
        password_changed: 'Зміна пароля', '2fa_enabled': '2FA увімкнено', '2fa_disabled': '2FA вимкнено',
        '2fa_backup_regenerated': 'Backup-коди оновлено', appointment_status_changed: 'Статус запису',
        user_created: 'Користувача створено', user_deleted: 'Користувача видалено',
      },
    },
  },

  en: {
    nav: {
      services: 'Services', masters: 'Barbers', gallery: 'Work', about: 'About',
      reviews: 'Reviews', booking: 'Booking', contacts: 'Contacts',
      cta: 'Book now', openMenu: 'Open menu', closeMenu: 'Close menu',
      langLabel: 'Language', toHome: 'OSTRIE — home',
    },
    hero: {
      badge: 'Barbershop №1', address: '14 Sichovykh Striltsiv St.', city: 'Kyiv',
      hours: 'Mon–Sun · 10:00—21:00', online: 'Online booking 24/7',
      taglinePre: 'On the ', taglineEm: 'edge', taglinePost: ' of style',
      sub: 'A premium city barbershop for men who value precision and character. Every cut — confident.',
      ctaBook: 'Book now', ctaServices: 'Services & prices', scroll: 'Scroll',
    },
    marquee: ['Haircut', 'Beard', 'Royal shave', 'Grey camouflage', "Kids' haircut", 'Styling'],
    services: {
      kicker: '01 — Pricing', title: ['Services', '& prices'],
      intro: 'Honest pricing with no hidden fees. Every service includes a consultation, a hot towel and a drink on the house.',
      loading: 'Loading prices…', error: 'Could not load services. Make sure the backend is running.',
      currency: 'UAH',
    },
    barbers: {
      kicker: '02 — Team', title: ['Barbers'],
      intro: 'Barbers with character. Each with their own signature and years of practice behind the chair.',
      loading: 'Loading the team…', error: 'Could not load barbers.',
      expSuffix: 'behind the chair', photoAlt: 'Barber',
    },
    gallery: {
      kicker: '03 — Portfolio', title: ['Our', 'work'],
      intro: 'Real clients, real transformations. Before and after — no Photoshop.',
      baLabel: 'Transformation — drag the blade', after: 'After', before: 'Before',
      sliderLabel: 'Before/after slider', hint: '← drag →',
      captions: ['Fade + beard', 'Classic', 'Before / After', 'Textured crop', 'Shave', 'Undercut', 'Beard', 'Pompadour', 'Grey camouflage'],
    },
    about: {
      kicker: '04 — Manifesto', title: ['Not a salon.', 'A workshop', 'of character.'],
      manifesto: 'OSTRIE is a place where a man leaves different from how he walked in. We do not chase trends for the sake of trends. We work with the blade like a sculptor with a chisel: precise, confident, nothing excess. No fuss here — only ritual. Hot coffee, heavy music, a steady hand and a mirror you want to look into.',
      signName: 'Artem Hostry', signRole: 'Founder of OSTRIE',
      features: [
        { title: 'Premium products only', text: 'We work with professional grooming brands. No compromise on ingredients.' },
        { title: 'Sterile tools', text: 'Every tool goes through dry-heat sterilization. Safety — without exceptions.' },
        { title: 'Results guaranteed', text: 'Something off? We will fix it free within 7 days of your visit.' },
      ],
      stats: [
        ['12K+', 'happy clients'], ['9', 'years in business'],
        ['4.9', 'Google rating'], ['5', 'barbers on the team'],
      ],
    },
    reviews: {
      kicker: '05 — Reviews', title: ['What clients', 'say'], starsLabel: '5 of 5',
      items: [
        { text: "I've been coming for two years and never regretted it once. Artem does a fade that grows out perfectly — pure magic. The atmosphere is a whole separate story.", name: 'Oleh Kravchenko', src: 'Regular client' },
        { text: 'The royal shave is not just a service, it is a ritual. Hot towels, the razor, silence. You walk out brand new. I recommend it to everyone.', name: 'Dmytro Shevchuk', src: 'Google review' },
        { text: "I brought my son for his first kids' haircut — afraid he'd throw a tantrum. The barber found an approach in a minute. Now we come together.", name: 'Vitalii Bondar', src: 'Instagram' },
        { text: 'The best barbershop in town, no exaggeration. Booking is easy, I never wait. Denys gets what I need from half a word.', name: 'Andrii Melnyk', src: 'Regular client' },
      ],
    },
    booking: {
      cxTitle: 'Build your look', cxSub: 'Tick the services — price and time update instantly.',
      cxBadge: 'Calculator', total: 'Total', currency: 'UAH', duration: 'Takes',
      cxApply: 'Book this look',
      kicker: '06 — Booking', title: ['Claim', 'the chair'],
      lead: 'Leave a request — we will call you back within 15 minutes to confirm the time. Or pick everything yourself in the form.',
      cPhone: 'Phone', cAddress: 'Address', cAddressVal: '14 Sichovykh Striltsiv St., Kyiv',
      cSchedule: 'Hours', cScheduleVal: 'Daily 10:00 — 21:00',
      successTitle: 'Booking received!', successText: 'Thank you. We will call you back within 15 minutes to confirm the details. See you at OSTRIE.',
      fName: 'Name', fNamePh: 'How should we address you', fPhone: 'Phone', fPhonePh: '+380 __ ___ __ __',
      fService: 'Service', fServicePh: 'Choose a service', fBarber: 'Barber', fBarberAny: 'Any barber',
      fDate: 'Date', fTime: 'Time', fTimePh: 'Choose a time', taken: ' — taken',
      submit: 'Confirm booking', submitting: 'Sending…',
      note: 'By clicking the button you agree to the processing of personal data',
      errName: 'Please enter your name', errPhone: 'That looks like an invalid number',
      errService: 'Choose a service', errDate: 'Choose a date', errDateFuture: 'Choose a future date', errTime: 'Choose a time',
      errSend: 'Could not send the booking: {msg}. Please try again or give us a call.',
      unitH: 'h', unitMin: 'min',
    },
    footer: {
      mapTitle: 'Map of OSTRIE barbershop location',
      desc: 'A premium city barbershop. Precision, character and respect for every client’s time. On the edge of style since 2017.',
      navTitle: 'Navigation', linkServices: 'Services & prices', linkMasters: 'Barbers', linkGallery: 'Our work',
      linkAbout: 'About', linkReviews: 'Reviews', linkBooking: 'Online booking',
      contactsTitle: 'Contacts', address: '14 Sichovykh Striltsiv St., Kyiv',
      scheduleTitle: 'Working hours', weekdays: 'Mon — Fri', weekend: 'Sat — Sun',
      rights: '© 2017—2026 OSTRIE. All rights reserved.', madeBy: 'Made on the edge', toTop: 'To top ↑',
    },
    preloader: { sub: 'On the edge of style' },
    admin: {
      brand: 'OSTRIE · Admin', refresh: 'Refresh', refreshing: 'Refreshing…', logout: 'Log out',
      panel: 'Admin panel', loginTitle: 'Sign in',
      loginHint: 'Sign in to manage bookings. The session is stored only in this tab.',
      emailLabel: 'Email', passwordLabel: 'Password', enter: 'Sign in', checking: 'Checking…',
      errCreds: 'Invalid email or password.',
      tabBookings: 'Bookings', tabAnalytics: 'Analytics', tabUsers: 'Users',
      title: 'Bookings', empty: 'No bookings yet.',
      colDate: 'Date · Time', colClient: 'Client', colPhone: 'Phone', colService: 'Service',
      colBarber: 'Barber', colStatus: 'Status', colCreated: 'Created', anyBarber: 'any',
      statusNew: 'New', statusDone: 'Done', statusCancelled: 'Cancelled',
      anTitle: 'Analytics', from: 'From', to: 'To', apply: 'Apply', reset: 'Reset',
      mRevenue: 'Revenue', mAvg: 'Average check', mDone: 'Done', mNew: 'New', mCancelled: 'Cancelled', mTotal: 'Total',
      byService: 'By service', byBarber: 'By barber', byDay: 'By day',
      count: 'count', noData: 'No revenue data. Mark bookings as “Done”.',
      anNote: 'Revenue counts only completed bookings (status “Done”).',
      usersTitle: 'Users', addUser: 'Add user',
      uEmail: 'Email', uPassword: 'Password', uRole: 'Role',
      roleSuper: 'Super admin', roleAdmin: 'Admin', roleBarber: 'Barber',
      create: 'Create', creating: 'Creating…', del: 'Delete', you: 'you',
      confirmDelete: 'Delete user {email}?',
      errLoad: 'Could not load data: {msg}', currency: 'UAH', locale: 'en-GB',
      tabSecurity: 'Security',
      secPwdTitle: 'Change password', curPwd: 'Current password', newPwd: 'New password',
      changeBtn: 'Change password', changing: 'Saving…', pwdChanged: 'Password updated ✓',
      sec2faTitle: 'Two-factor authentication', sec2faStateOn: 'Enabled', sec2faStateOff: 'Disabled',
      sec2faIntro: 'An extra code from an app (Google Authenticator, Authy, etc.) on every sign-in.',
      enable2fa: 'Enable 2FA', disable2fa: 'Disable 2FA',
      scanQr: 'Scan the QR in an authenticator app or enter the key manually:',
      enterCode: 'Enter the 6-digit code from the app', confirm: 'Confirm',
      twofaOn: '2FA enabled ✓', twofaOff: '2FA disabled ✓',
      login2faHint: 'Enter the code from your authenticator app', loginCode: '2FA code',
      loginCodeHint: 'or one of your backup codes',
      backupTitle: 'Backup codes', backupRemaining: 'Codes left: {n}',
      backupSaveHint: 'Store these codes somewhere safe. Each works once and replaces your 2FA code if you lose your phone. They won’t be shown again.',
      backupCopy: 'Copy', backupCopied: 'Copied ✓', backupDone: 'I saved the codes',
      backupRegen: 'Regenerate codes', backupRegenHint: 'Enter your current 2FA code to generate new ones (old ones stop working).',
      tabAudit: 'Audit', auditTitle: 'Event log',
      auColTime: 'Time', auColAction: 'Event', auColActor: 'User', auColIp: 'IP',
      auColResult: 'Result', auColDetail: 'Details', auAll: 'All events',
      auOk: 'OK', auFail: 'Fail',
      tabDashboard: 'Overview', dashTitle: 'Overview',
      dashRevenue30: 'Revenue (30 days)', dashRevenueChart: 'Revenue by day',
      dashToday: "Today's bookings", dashNoToday: 'No bookings for today.',
      dashActivity: 'Recent activity', dashMax: 'max', noChart: 'Not enough data for a chart.',
      searchPh: 'Search: name, phone, service…',
      toastStatus: 'Status updated', toastUserCreated: 'User created', toastUserDeleted: 'User deleted',
      auditActions: {
        login_success: 'Sign in', login_failed: 'Failed sign in', login_ratelimited: 'Blocked (brute force)',
        password_changed: 'Password changed', '2fa_enabled': '2FA enabled', '2fa_disabled': '2FA disabled',
        '2fa_backup_regenerated': 'Backup codes regenerated', appointment_status_changed: 'Booking status',
        user_created: 'User created', user_deleted: 'User deleted',
      },
    },
  },
}

// ─────────────  Контекст / провайдер  ─────────────
const I18nContext = createContext(null)

function detectInitial() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && LANGS.includes(saved)) return saved
  return 'uk'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial)

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value = useMemo(() => {
    const setLang = (l) => LANGS.includes(l) && setLangState(l)
    // t(path) — дістає значення за ключем виду 'booking.fName'.
    // Якщо передати vars → підставляє {плейсхолдери}.
    const t = (path, vars) => {
      const parts = path.split('.')
      let node = dict[lang]
      for (const p of parts) {
        node = node?.[p]
        if (node === undefined) break
      }
      if (node === undefined) node = path // фолбек — повертаємо ключ
      if (typeof node === 'string' && vars) {
        return node.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`))
      }
      return node
    }
    return { lang, setLang, t }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
