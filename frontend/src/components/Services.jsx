import { useI18n } from '../lib/i18n'

export default function Services({ services, loading, error }) {
  const { t } = useI18n()

  const fmtDur = (m) => {
    const h = Math.floor(m / 60)
    const mm = m % 60
    return `⏱ ${h ? `${h} ${t('booking.unitH')} ` : ''}${mm ? `${mm} ${t('booking.unitMin')}` : ''}`.trim()
  }

  const title = t('services.title')

  return (
    <section className="section-pad" id="services">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">{t('services.kicker')}</span>
            <h2 className="display" data-reveal>
              {title.map((line, i) => (
                <span key={i}>{line}{i < title.length - 1 && <br />}</span>
              ))}
            </h2>
            <p data-reveal data-delay="1">
              {t('services.intro')}
            </p>
          </div>
          <span className="sec-no" aria-hidden="true">/01</span>
        </div>

        {loading && <p className="state-note">{t('services.loading')}</p>}
        {error && <p className="state-note error">{t('services.error')}</p>}

        {!loading && !error && (
          <div className="services-list">
            {services.map((s, i) => (
              <article className="service" data-reveal key={s.id}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <div className="info">
                  <h3>{s.name}</h3>
                  {s.description && <p>{s.description}</p>}
                </div>
                <span className="dur">{fmtDur(s.duration)}</span>
                <span className="price">{s.price}<small> {t('services.currency')}</small></span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
