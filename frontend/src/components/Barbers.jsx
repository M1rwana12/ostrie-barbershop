const expWord = (n) => {
  const last = n % 10
  const tens = n % 100
  if (tens >= 11 && tens <= 14) return 'років'
  if (last === 1) return 'рік'
  if (last >= 2 && last <= 4) return 'роки'
  return 'років'
}

export default function Barbers({ barbers, loading, error }) {
  return (
    <section className="section-pad" id="masters" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">02 — Команда</span>
            <h2 className="display" data-reveal>Майстри</h2>
            <p data-reveal data-delay="1">
              Барбери з характером. Кожен — зі своїм почерком і роками практики за кріслом.
            </p>
          </div>
          <span className="sec-no" aria-hidden="true">/02</span>
        </div>

        {loading && <p className="state-note">Завантажуємо команду…</p>}
        {error && <p className="state-note error">Не вдалося завантажити майстрів.</p>}

        {!loading && !error && (
          <div className="masters-grid">
            {barbers.map((b, i) => (
              <article className="master" data-reveal data-delay={String((i % 4) + 1)} key={b.id}>
                <div className="master-photo">
                  <span className="ph">ФОТО МАЙСТРА<br />портрет, ч/б,<br />3:4</span>
                </div>
                <div className="master-body">
                  <span className="role">{b.role}</span>
                  <h3>{b.name}</h3>
                  <span className="exp">{b.experience} {expWord(b.experience)} за кріслом</span>
                  <div className="master-tags">
                    {b.specialty.split('·').map((t) => (
                      <span key={t}>{t.trim()}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
