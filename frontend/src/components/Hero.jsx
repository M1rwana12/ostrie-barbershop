import { HERO } from '../lib/images'

export default function Hero() {
  return (
    <section className="hero" aria-label="OSTRIE барбершоп" id="top">
      <div className="hero-media" aria-hidden="true">
        <img className="hero-photo" src={HERO} alt="" fetchpriority="high" />
        <div className="hero-scrim" />
      </div>
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="wrap hero-inner">
        <div className="hero-top">
          <p className="hero-meta">Барбершоп №1<br />вул. Січових Стрільців, 14<br />Київ</p>
          <p className="hero-meta" style={{ textAlign: 'right' }}>Пн–Нд · 10:00—21:00<br />Запис онлайн 24/7</p>
        </div>

        <h1 className="display hero-title" data-reveal>OS<span className="blade">T</span>RIE</h1>

        <div className="hero-tagline">
          <p className="lead" data-reveal data-delay="1">На <em>вістрі</em> стилю</p>
          <p className="sub" data-reveal data-delay="2">
            Преміальний міський барбершоп для чоловіків, які цінують точність і характер. Кожен різ — впевнений.
          </p>
          <div className="hero-actions" data-reveal data-delay="3">
            <a href="#booking" className="btn">Записатись <span className="arrow">↗</span></a>
            <a href="#services" className="btn btn--ghost">Послуги та ціни</a>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">Гортай<span className="line" /></div>
      </div>
    </section>
  )
}
