import { useI18n } from '../lib/i18n'

export default function Reviews() {
  const { t } = useI18n()
  const title = t('reviews.title')
  const items = t('reviews.items')

  return (
    <section className="section-pad" id="reviews">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="display" data-reveal>
              {title.map((line, i) => (
                <span key={i}>{line}{i < title.length - 1 && <br />}</span>
              ))}
            </h2>
          </div>
          <span className="sec-no" aria-hidden="true">/05</span>
        </div>

        <div className="reviews-grid">
          {items.map((r, i) => (
            <article className="review" data-reveal data-delay={String((i % 4) + 1)} key={r.name}>
              <span className="mark" aria-hidden="true">“</span>
              <span className="stars" aria-label={t('reviews.starsLabel')}>★★★★★</span>
              <p>{r.text}</p>
              <div className="who">
                <span className="ava" aria-hidden="true">{r.name.charAt(0)}</span>
                <div><b>{r.name}</b><small>{r.src}</small></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
