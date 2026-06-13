import { useI18n } from '../lib/i18n'

// Іконки фіч (порядок збігається з about.features у словнику)
const ICONS = [
  { path: 'M3 6l9 5 9-5M3 6v12l9 5 9-5V6M3 6l9-3 9 3' },
  { path: 'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3', circle: true },
  { path: 'M12 2l2.4 6.9H22l-6 4.3 2.3 7L12 16.9 5.7 20.2 8 13.2l-6-4.3h7.6z' },
]

export default function About() {
  const { t } = useI18n()
  const title = t('about.title')
  const features = t('about.features')
  const stats = t('about.stats')

  return (
    <section className="section-pad" id="about" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <span className="sec-no" aria-hidden="true" style={{ display: 'block', marginBottom: '1.5rem' }}>/04</span>
        <div className="about">
          <div className="about-manifesto" data-reveal>
            <span className="kicker">{t('about.kicker')}</span>
            <h2 className="display">
              {title.map((line, i) => (
                <span key={i}>{i === 1 ? <em>{line}</em> : line}{i < title.length - 1 && <br />}</span>
              ))}
            </h2>
            <p>{t('about.manifesto')}</p>
            <p className="about-sign">{t('about.signName')}<span>{t('about.signRole')}</span></p>
          </div>

          <div className="features" data-reveal data-delay="1">
            {features.map((f, i) => (
              <div className="feature" key={f.title}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={ICONS[i].path} />
                    {ICONS[i].circle && <circle cx="12" cy="12" r="3" />}
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
          {stats.map(([n, l]) => (
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
