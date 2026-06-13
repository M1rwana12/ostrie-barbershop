import { GALLERY, BEFORE, AFTER } from '../lib/images'

const CLASSES = ['g-tall', 'g-sq', 'g-wide', 'g-sq', 'g-tall', 'g-wide', 'g-sq', 'g-tall', 'g-wide']
const CAPTIONS = ['Фейд + борода', 'Класика', 'До / Після', 'Текстурний кроп', 'Гоління', 'Андеркат', 'Борода', 'Помпадур', 'Камуфляж сивини']

export default function Gallery() {
  return (
    <section className="section-pad" id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">03 — Портфоліо</span>
            <h2 className="display" data-reveal>Наші<br />роботи</h2>
            <p data-reveal data-delay="1">Реальні клієнти, реальні трансформації. До та після — без фотошопу.</p>
          </div>
          <span className="sec-no" aria-hidden="true">/03</span>
        </div>

        {/* Сигнатурний слайдер «До / Після» з лезвом */}
        <div className="ba-wrap" data-reveal>
          <span className="ba-label">Трансформація — потягни лезо</span>
          <div className="ba">
            <div className="ba-layer ba-after" style={{ backgroundImage: `url(${AFTER})` }}>
              <span className="ba-tag">Після</span>
            </div>
            <div className="ba-layer ba-before" style={{ backgroundImage: `url(${BEFORE})` }}>
              <span className="ba-tag">До</span>
            </div>
            <div
              className="ba-handle"
              role="slider"
              tabIndex={0}
              aria-label="Повзунок до/після"
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
            <span className="ba-hint" aria-hidden="true">← перетягни →</span>
          </div>
        </div>

        <div className="gallery" data-reveal>
          {GALLERY.map((src, i) => (
            <figure className={CLASSES[i]} key={i}>
              <img src={src} alt={CAPTIONS[i]} loading="lazy" />
              <figcaption>{CAPTIONS[i]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
