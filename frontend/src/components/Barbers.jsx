import { MASTERS } from '../lib/images'
import { useI18n } from '../lib/i18n'

const expWordUk = (n) => {
  const last = n % 10
  const tens = n % 100
  if (tens >= 11 && tens <= 14) return 'років'
  if (last === 1) return 'рік'
  if (last >= 2 && last <= 4) return 'роки'
  return 'років'
}

export default function Barbers({ barbers, loading, error }) {
  const { t, lang } = useI18n()
  const expWord = (n) => (lang === 'uk' ? expWordUk(n) : n === 1 ? 'year' : 'years')
  const title = t('barbers.title')

  return (
    <section className="section-pad" id="masters" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="titles">
            <span className="kicker">{t('barbers.kicker')}</span>
            <h2 className="display" data-reveal>
              {title.map((line, i) => (
                <span key={i}>{line}{i < title.length - 1 && <br />}</span>
              ))}
            </h2>
            <p data-reveal data-delay="1">
              {t('barbers.intro')}
            </p>
          </div>
          <span className="sec-no" aria-hidden="true">/02</span>
        </div>

        {loading && <p className="state-note">{t('barbers.loading')}</p>}
        {error && <p className="state-note error">{t('barbers.error')}</p>}

        {!loading && !error && (
          <div className="masters-grid">
            {barbers.map((b, i) => (
              <article className="master" data-reveal data-delay={String((i % 4) + 1)} key={b.id}>
                <div className="master-photo">
                  <img className="master-portrait" src={MASTERS[i % MASTERS.length]} alt={`${t('barbers.photoAlt')} ${b.name}`} loading="lazy" />
                </div>
                <div className="master-body">
                  <span className="role">{b.role}</span>
                  <h3>{b.name}</h3>
                  <span className="exp">{b.experience} {expWord(b.experience)} {t('barbers.expSuffix')}</span>
                  <div className="master-tags">
                    {b.specialty.split('·').map((tag) => (
                      <span key={tag}>{tag.trim()}</span>
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
