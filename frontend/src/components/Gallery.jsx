const ITEMS = [
  ['g-tall', 'фейд + борода', '3:4', 'Фейд + борода'],
  ['g-sq', 'класична стрижка', '1:1', 'Класика'],
  ['g-wide', 'ДО / ПІСЛЯ — трансформація', '4:3', 'До / Після'],
  ['g-sq', 'текстурний кроп', '1:1', 'Текстурний кроп'],
  ['g-tall', 'королівське гоління', '3:4', 'Гоління'],
  ['g-wide', 'андеркат', '4:3', 'Андеркат'],
  ['g-sq', 'оформлення бороди', '1:1', 'Борода'],
  ['g-tall', 'помпадур', '3:4', 'Помпадур'],
  ['g-wide', 'ДО / ПІСЛЯ — камуфляж сивини', '4:3', 'Камуфляж сивини'],
]

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
            <div className="ba-layer ba-after">
              <span className="ba-tag">Після</span>
              <span className="ba-ph">ФОТО «ПІСЛЯ»<br />чистий фейд + оформлена борода<br />16:10</span>
            </div>
            <div className="ba-layer ba-before">
              <span className="ba-tag">До</span>
              <span className="ba-ph">ФОТО «ДО»<br />відрослий образ<br />16:10</span>
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
          {ITEMS.map(([cls, ph, ratio, cap], i) => (
            <figure className={cls} key={i}>
              <div className="ph">ФОТО РОБОТИ<br />{ph}<br />{ratio}</div>
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
