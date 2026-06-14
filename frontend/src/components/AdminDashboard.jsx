import { useEffect, useMemo, useState } from 'react'
import { getAppointments, getServices, getBarbers, getAnalytics, getAudit } from '../lib/api'
import { useI18n } from '../lib/i18n'
import { fmtMoney, fmtNum, fmtRelative } from '../lib/format'
import { SkelCards } from './Skeleton'
import { IcoRevenue, IcoBookings, IcoClock, IcoCheck } from './icons'

const todayISO = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
const daysAgoISO = (n) => {
  const d = new Date(); d.setDate(d.getDate() - n)
  return d.toLocaleDateString('en-CA')
}

// Площинний SVG-графік виручки за днями (без сторонніх ліб)
function AreaChart({ data, lang, currency }) {
  const { t } = useI18n()
  if (!data || data.length < 2) return <p className="an-note">{t('admin.noChart')}</p>
  const W = 720, H = 180, P = 8
  const max = Math.max(...data.map((d) => d.revenue), 1)
  const stepX = (W - P * 2) / (data.length - 1)
  const x = (i) => P + i * stepX
  const y = (v) => H - P - (v / max) * (H - P * 2)
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.revenue).toFixed(1)}`).join(' ')
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${H - P} L${x(0).toFixed(1)} ${H - P} Z`
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart" role="img"
        aria-label={t('admin.dashRevenueChart')}>
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ag)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => <circle key={d.date} cx={x(i)} cy={y(d.revenue)} r="2.5" fill="var(--accent-hi)" />)}
      </svg>
      <div className="chart-x">
        <span>{data[0].date.slice(5)}</span>
        <span className="muted">{t('admin.dashMax')}: {fmtMoney(max, lang, currency)}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  )
}

export default function AdminDashboard({ isSuper, onNavigate, onUnauthorized }) {
  const { t, lang } = useI18n()
  const cur = t('admin.currency')
  const [appts, setAppts] = useState([])
  const [svc, setSvc] = useState([])
  const [brb, setBrb] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const svcName = useMemo(() => Object.fromEntries(svc.map((s) => [s.id, s.name])), [svc])
  const barbName = useMemo(() => Object.fromEntries(brb.map((b) => [b.id, b.name])), [brb])
  const auditLabels = t('admin.auditActions')

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true); setError('')
      try {
        const base = [getAppointments(), getServices(), getBarbers()]
        const extra = isSuper
          ? [getAnalytics({ from: daysAgoISO(29), to: todayISO() }), getAudit({ limit: 6 })]
          : [Promise.resolve(null), Promise.resolve([])]
        const [a, s, b, an, au] = await Promise.all([...base, ...extra])
        if (!alive) return
        setAppts(a); setSvc(s); setBrb(b); setAnalytics(an); setActivity(au || [])
      } catch (err) {
        if (err.status === 401) return onUnauthorized()
        if (alive) setError(t('admin.errLoad', { msg: err.message }))
      } finally { if (alive) setLoading(false) }
    }
    run()
    return () => { alive = false }
    // eslint-disable-next-line
  }, [])

  const counts = useMemo(() => {
    const c = { total: appts.length, new: 0, done: 0, cancelled: 0 }
    appts.forEach((a) => { c[a.status] = (c[a.status] || 0) + 1 })
    return c
  }, [appts])

  const today = todayISO()
  const todays = useMemo(
    () => appts.filter((a) => a.date === today).sort((x, y) => x.time.localeCompare(y.time)),
    [appts, today],
  )

  if (loading) {
    return (
      <>
        <div className="admin-head"><h2 className="page-h">{t('admin.dashTitle')}</h2></div>
        <SkelCards count={4} />
      </>
    )
  }

  return (
    <>
      <div className="admin-head"><h2 className="page-h">{t('admin.dashTitle')}</h2></div>
      {error && <div className="form-error-top" role="alert">{error}</div>}

      <div className="kpi-row">
        {isSuper && (
          <button className="kpi kpi--accent" onClick={() => onNavigate('analytics')}>
            <span className="kpi-ico"><IcoRevenue /></span>
            <span className="kpi-k">{t('admin.dashRevenue30')}</span>
            <span className="kpi-v">{fmtMoney(analytics?.revenue || 0, lang, cur)}</span>
          </button>
        )}
        <button className="kpi" onClick={() => onNavigate('bookings')}>
          <span className="kpi-ico"><IcoBookings /></span>
          <span className="kpi-k">{t('admin.mTotal')}</span>
          <span className="kpi-v">{fmtNum(counts.total, lang)}</span>
        </button>
        <button className="kpi" onClick={() => onNavigate('bookings')}>
          <span className="kpi-ico"><IcoClock /></span>
          <span className="kpi-k">{t('admin.mNew')}</span>
          <span className="kpi-v">{fmtNum(counts.new, lang)}</span>
        </button>
        <button className="kpi" onClick={() => onNavigate('bookings')}>
          <span className="kpi-ico"><IcoCheck /></span>
          <span className="kpi-k">{t('admin.mDone')}</span>
          <span className="kpi-v">{fmtNum(counts.done, lang)}</span>
        </button>
      </div>

      {isSuper && (
        <section className="dash-card">
          <h3 className="an-h">{t('admin.dashRevenueChart')}</h3>
          <AreaChart data={analytics?.by_day || []} lang={lang} currency={cur} />
        </section>
      )}

      <div className="dash-grid">
        <section className="dash-card">
          <h3 className="an-h">{t('admin.dashToday')} <small className="admin-count">{todays.length}</small></h3>
          {todays.length === 0 ? (
            <p className="admin-empty" style={{ padding: '1.5rem 0' }}>{t('admin.dashNoToday')}</p>
          ) : (
            <ul className="dash-list">
              {todays.map((a) => (
                <li key={a.id}>
                  <span className="dl-time">{a.time}</span>
                  <span className="dl-main"><b>{a.name}</b><small>{svcName[a.service_id] || ''}{a.barber_id ? ` · ${barbName[a.barber_id] || ''}` : ''}</small></span>
                  <span className={`status-badge st-${a.status}`}>{t(`admin.status${a.status[0].toUpperCase()}${a.status.slice(1)}`)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isSuper && (
          <section className="dash-card">
            <h3 className="an-h">{t('admin.dashActivity')}</h3>
            {activity.length === 0 ? (
              <p className="admin-empty" style={{ padding: '1.5rem 0' }}>{t('admin.empty')}</p>
            ) : (
              <ul className="dash-list">
                {activity.map((r) => (
                  <li key={r.id}>
                    <span className={`act-dot ${r.success ? 'ok' : 'fail'}`} aria-hidden="true" />
                    <span className="dl-main"><b>{(auditLabels && auditLabels[r.action]) || r.action}</b><small>{r.actor_email || '—'}</small></span>
                    <span className="muted dl-time">{fmtRelative(r.ts, lang)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </>
  )
}
