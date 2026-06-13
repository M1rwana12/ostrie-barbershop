export default function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="map-strip" role="img" aria-label="Мапа розташування барбершопу OSTRIE (плейсхолдер — вставити Google Maps iframe)">
        <span className="pin" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
          </svg>
        </span>
        <span className="ph">МАПА — сюди вставити інтерактивний Google Maps iframe<br />вул. Січових Стрільців, 14, Київ</span>
      </div>

      <div className="wrap footer-top">
        <div className="footer-brand">
          <div className="brand">OSTRIE<span className="dot">.</span></div>
          <p>Преміальний міський барбершоп. Точність, характер і повага до часу кожного клієнта. На вістрі стилю з 2017 року.</p>
          <div className="socials">
            <a href="#" aria-label="Instagram OSTRIE">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" aria-label="TikTok OSTRIE">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.3 1.7 3.9 4 4.2v3c-1.5 0-2.9-.5-4-1.3v6.4A6.3 6.3 0 1 1 9.7 9v3.2A3.2 3.2 0 1 0 13 15V3z" /></svg>
            </a>
            <a href="#" aria-label="Facebook OSTRIE">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" /></svg>
            </a>
            <a href="#" aria-label="Telegram OSTRIE">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3l-3.3 15.6c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6 13.8l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.3 1.4z" /></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Навігація</h4>
          <ul>
            <li><a href="#services">Послуги та ціни</a></li>
            <li><a href="#masters">Майстри</a></li>
            <li><a href="#gallery">Наші роботи</a></li>
            <li><a href="#about">Про нас</a></li>
            <li><a href="#reviews">Відгуки</a></li>
            <li><a href="#booking">Онлайн-запис</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Контакти</h4>
          <ul>
            <li><a href="tel:+380441234567">+38 (044) 123-45-67</a></li>
            <li><a href="mailto:hello@ostrie.com">hello@ostrie.com</a></li>
            <li>вул. Січових Стрільців, 14, Київ</li>
          </ul>
          <h4 style={{ marginTop: '1.8rem' }}>Графік роботи</h4>
          <ul>
            <li className="hours-row"><span>Пн — Пт</span><span>10:00 — 21:00</span></li>
            <li className="hours-row"><span>Сб — Нд</span><span>10:00 — 20:00</span></li>
          </ul>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© 2017—2026 OSTRIE. Усі права захищено.</span>
        <span>Зроблено на вістрі · <a href="#top">Догори ↑</a></span>
      </div>
    </footer>
  )
}
