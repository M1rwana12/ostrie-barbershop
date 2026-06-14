import { useEffect, useState } from 'react'
import { getAnalytics } from '../lib/api'
import { useI18n } from '../lib/i18n'
import { fmtMoney, fmtNum } from '../lib/format'
import { SkelCards } from './Skeleton'

function BarList({ rows, currency, lang }) {
  const max = Math.max(1, ...rows.map((r) => r.revenue))
  return (
    <div className="an-bars">
      {rows.map((r) => (
        <div className="an-bar-row" key={r.name || r.date}>
          <span className="an-bar-label">{r.name || r.date}</span>
          <span className="an-bar-track">
            <span className="an-bar-fill" style={{ width: `${(r.revenue / max) * 100}%` }} />
          </span>
          <span className="an-bar-val">{fmtMoney(r.revenue, lang, currency)} · {r.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics({ onUnauthorized }) {
  const { t, lang } = useI18n()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cur = t('admin.currency')

  const load = async (range = {}) => {
    setLoading(true)
    setError('')
    try {
      setData(await getAnalytics(range))
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(t('admin.errLoad', { msg: err.message }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  const apply = (e) => { e.preventDefault(); load({ from, to }) }
  const reset = () => { setFrom(''); setTo(''); load() }

  const c = data?.counts || {}

  return (
    <>
      <div className="admin-head">
        <span className="kicker">{t('admin.panel')}</span>
        <h1 className="display">{t('admin.anTitle')}</h1>
        <p className="an-note">{t('admin.anNote')}</p>
      </div>

      <form className="an-filter" onSubmit={apply}>
        <div className="field">
          <label htmlFor="an-from">{t('admin.from')}</label>
          <input id="an-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="an-to">{t('admin.to')}</label>
          <input id="an-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button type="submit" className="btn" disabled={loading}>{t('admin.apply')}</button>
        <button type="button" className="btn btn--ghost" onClick={reset} disabled={loading}>{t('admin.reset')}</button>
      </form>

      {error && <div className="form-error-top" role="alert">{error}</div>}

      {loading && <SkelCards count={6} />}

      {data && !loading && (
        <>
          <div className="an-cards">
            <div className="an-card accent">
              <div className="an-k">{t('admin.mRevenue')}</div>
              <div className="an-v">{fmtNum(data.revenue, lang)}<small> {cur}</small></div>
            </div>
            <div className="an-card">
              <div className="an-k">{t('admin.mAvg')}</div>
              <div className="an-v">{fmtNum(data.avg_check, lang)}<small> {cur}</small></div>
            </div>
            <div className="an-card">
              <div className="an-k">{t('admin.mDone')}</div>
              <div className="an-v">{fmtNum(c.done || 0, lang)}</div>
            </div>
            <div className="an-card">
              <div className="an-k">{t('admin.mNew')}</div>
              <div className="an-v">{fmtNum(c.new || 0, lang)}</div>
            </div>
            <div className="an-card">
              <div className="an-k">{t('admin.mCancelled')}</div>
              <div className="an-v">{fmtNum(c.cancelled || 0, lang)}</div>
            </div>
            <div className="an-card">
              <div className="an-k">{t('admin.mTotal')}</div>
              <div className="an-v">{fmtNum(c.total || 0, lang)}</div>
            </div>
          </div>

          {data.revenue === 0 ? (
            <p className="admin-empty">{t('admin.noData')}</p>
          ) : (
            <div className="an-sections">
              <section>
                <h3 className="an-h">{t('admin.byService')}</h3>
                <BarList rows={data.by_service} currency={cur} lang={lang} />
              </section>
              <section>
                <h3 className="an-h">{t('admin.byBarber')}</h3>
                <BarList rows={data.by_barber} currency={cur} lang={lang} />
              </section>
              <section>
                <h3 className="an-h">{t('admin.byDay')}</h3>
                <BarList rows={data.by_day} currency={cur} lang={lang} />
              </section>
            </div>
          )}
        </>
      )}
    </>
  )
}
