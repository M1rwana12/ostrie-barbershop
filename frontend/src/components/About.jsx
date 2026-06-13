const FEATURES = [
  {
    title: 'Тільки преміум-косметика',
    text: 'Працюємо на професійних брендах догляду. Жодних компромісів зі складом.',
    path: 'M3 6l9 5 9-5M3 6v12l9 5 9-5V6M3 6l9-3 9 3',
  },
  {
    title: 'Стерильність інструменту',
    text: 'Кожен інструмент проходить сухожарову стерилізацію. Безпека — без винятків.',
    path: 'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3',
    circle: true,
  },
  {
    title: 'Гарантія на результат',
    text: 'Щось не так? Безкоштовно доопрацюємо протягом 7 днів після візиту.',
    path: 'M12 2l2.4 6.9H22l-6 4.3 2.3 7L12 16.9 5.7 20.2 8 13.2l-6-4.3h7.6z',
  },
]

const STATS = [
  ['12K+', 'задоволених клієнтів'],
  ['9', 'років на ринку'],
  ['4.9', 'рейтинг Google'],
  ['5', 'майстрів у команді'],
]

export default function About() {
  return (
    <section className="section-pad" id="about" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <span className="sec-no" aria-hidden="true" style={{ display: 'block', marginBottom: '1.5rem' }}>/04</span>
        <div className="about">
          <div className="about-manifesto" data-reveal>
            <span className="kicker">04 — Маніфест</span>
            <h2 className="display">Не салон.<br /><em>Майстерня</em><br />характеру.</h2>
            <p>
              OSTRIE — це місце, де чоловік виходить іншим, ніж зайшов. Ми не женемося за трендами заради трендів.
              Ми працюємо лезом, як скульптор різцем: точно, впевнено, без зайвого. Тут немає метушні — є ритуал.
              Гаряча кава, важка музика, тверда рука майстра і дзеркало, у яке хочеться дивитись.
            </p>
            <p className="about-sign">Артем Гострий<span>Засновник OSTRIE</span></p>
          </div>

          <div className="features" data-reveal data-delay="1">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={f.path} />
                    {f.circle && <circle cx="12" cy="12" r="3" />}
                  </svg>
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats" data-reveal>
          {STATS.map(([n, l]) => (
            <div className="stat" key={l}>
              <div className="n">{n}</div>
              <div className="l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
