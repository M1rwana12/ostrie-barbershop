import { GALLERY, BEFORE, AFTER } from '../lib/images'
import { useI18n } from '../lib/i18n'

const CLASSES = ['g-tall', 'g-sq', 'g-wide', 'g-sq', 'g-tall', 'g-wide', 'g-sq', 'g-tall', 'g-wide']

export default function Gallery() {
  const { t } = useI18n()
  const captions = t('gallery.captions')
  const title = t('gallery.title')

  return (
    <section className="section-pad" id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">{t('gallery.kicker')}</span>
            <h2 className="display" data-reveal>
              {title.map((line, i) => (
                <span key={i}>{line}{i < title.length - 1 && <br />}</span>
              ))}
            </h2>
            <p data-reveal data-delay="1">{t('gallery.intro')}</p>
          </div>
          <span className="sec-no" aria-hidden="true">/03</span>
        </div>

        {/* Сигнатурний слайдер «До / Після» з лезвом */}
        <div className="ba-wrap" data-reveal>
          <span className="ba-label">{t('gallery.baLabel')}</span>
          <div className="ba">
            <div className="ba-layer ba-after" style={{ backgroundImage: `url(${AFTER})` }}>
              <span className="ba-tag">{t('gallery.after')}</span>
            </div>
            <div className="ba-layer ba-before" style={{ backgroundImage: `url(${BEFORE})` }}>
              <span className="ba-tag">{t('gallery.before')}</span>
            </div>
            <div
              className="ba-handle"
              role="slider"
              tabIndex={0}
              aria-label={t('gallery.sliderLabel')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
            >
              <span className="ba-grip" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" />
                </svg>
              </span>
            </div>
            <span className="ba-hint" aria-hidden="true">{t('gallery.hint')}</span>
          </div>
        </div>

        <div className="gallery" data-reveal>
          {GALLERY.map((src, i) => (
            <figure className={CLASSES[i]} key={i}>
              <img src={src} alt={captions[i]} loading="lazy" />
              <figcaption>{captions[i]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
