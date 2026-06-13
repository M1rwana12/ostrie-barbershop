const fmtDur = (m) => {
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `⏱ ${h ? `${h} год ` : ''}${mm ? `${mm} хв` : ''}`.trim()
}

export default function Services({ services, loading, error }) {
  return (
    <section className="section-pad" id="services">
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">01 — Прайс</span>
            <h2 className="display" data-reveal>Послуги<br />та ціни</h2>
            <p data-reveal data-delay="1">
              Чесний прайс без прихованих доплат. Кожна процедура — з консультацією, гарячим рушником та напоєм за рахунок закладу.
            </p>
          </div>
          <span className="sec-no" aria-hidden="true">/01</span>
        </div>

        {loading && <p className="state-note">Завантажуємо прайс…</p>}
        {error && <p className="state-note error">Не вдалося завантажити послуги. Перевірте, що бекенд запущено.</p>}

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
                <span className="price">{s.price}<small> грн</small></span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
