import { useEffect, useState } from 'react'
import { getAvailability } from '../lib/api'
import { useI18n } from '../lib/i18n'

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
const todayISO = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD (local)

/**
 * «Завантаженість сьогодні» — жива шкала по годинах: скільки майстрів зайнято.
 * Агрегує `GET /availability` по всіх майстрах на сьогодні (публічний ендпоінт).
 */
export default function TodayLoad({ barbers }) {
  const { t } = useI18n()
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    if (!barbers || barbers.length === 0) return
    let alive = true
    const today = todayISO()
    Promise.all(
      barbers.map((b) => getAvailability(b.id, today).catch(() => ({ taken: [] }))),
    ).then((res) => {
      if (!alive) return
      const c = Object.fromEntries(TIMES.map((s) => [s, 0]))
      res.forEach((r) => (r.taken || []).forEach((s) => { if (s in c) c[s] += 1 }))
      setCounts(c)
    })
    return () => { alive = false }
  }, [barbers])

  if (!counts || !barbers?.length) return null

  const cap = barbers.length
  const freeTotal = TIMES.reduce((a, s) => a + Math.max(0, cap - counts[s]), 0)
  const cls = (taken) => {
    const free = cap - taken
    if (free <= 0) return 'full'
    if (free <= Math.ceil(cap / 2)) return 'busy'
    return 'free'
  }

  return (
    <div className="today-load" data-reveal data-delay="3">
      <div className="tl-head">
        <span className="kicker" style={{ margin: 0 }}>{t('booking.loadTitle')}</span>
        <span className="tl-left">{t('booking.loadLeft', { n: freeTotal })}</span>
      </div>
      <div className="tl-grid" role="img" aria-label={t('booking.loadTitle')}>
        {TIMES.map((s) => (
          <div key={s} className={`tl-cell ${cls(counts[s])}`} title={`${s} · ${Math.max(0, cap - counts[s])}/${cap}`}>
            <span className="tl-h">{s.slice(0, 2)}</span>
          </div>
        ))}
      </div>
      <div className="tl-legend">
        <span><i className="free" />{t('booking.loadFree')}</span>
        <span><i className="busy" />{t('booking.loadBusy')}</span>
        <span><i className="full" />{t('booking.loadFull')}</span>
      </div>
    </div>
  )
}
