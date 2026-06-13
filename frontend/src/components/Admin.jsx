import { useEffect, useMemo, useState } from 'react'
import { getAppointments, getServices, getBarbers } from '../lib/api'
import Logo from './Logo'
import { useI18n } from '../lib/i18n'

const TOKEN_KEY = 'ostrie_admin_token'

const fmtCreated = (iso, locale) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Admin() {
  const { t } = useI18n()
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [input, setInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [items, setItems] = useState([])
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const svcName = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.name])), [services])
  const barbName = useMemo(() => Object.fromEntries(barbers.map((b) => [b.id, b.name])), [barbers])

  const load = async (tok) => {
    setLoading(true)
    setError('')
    try {
      const [appts, svc, brb] = await Promise.all([
        getAppointments(tok),
        getServices(),
        getBarbers(),
      ])
      setItems(appts)
      setServices(svc)
      setBarbers(brb)
      setAuthed(true)
      sessionStorage.setItem(TOKEN_KEY, tok)
      setToken(tok)
    } catch (err) {
      if (err.status === 401) {
        setError(t('admin.errToken'))
        sessionStorage.removeItem(TOKEN_KEY)
        setAuthed(false)
      } else {
        setError(t('admin.errLoad', { msg: err.message }))
      }
    } finally {
      setLoading(false)
    }
  }

  // Якщо токен уже збережений у сесії — авто-вхід
  useEffect(() => {
    if (token) load(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const tok = input.trim()
    if (tok) load(tok)
  }

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setInput('')
    setAuthed(false)
    setItems([])
  }

  return (
    <main className="admin">
      <header className="admin-bar">
        <a className="admin-brand" href="./" aria-label={t('nav.toHome')}>
          <Logo />
          <span>{t('admin.brand')}</span>
        </a>
        {authed && (
          <div className="admin-actions">
            <button type="button" className="btn btn--ghost" onClick={() => load(token)} disabled={loading}>
              {loading ? t('admin.refreshing') : t('admin.refresh')}
            </button>
            <button type="button" className="btn btn--ghost" onClick={logout}>{t('admin.logout')}</button>
          </div>
        )}
      </header>

      <div className="wrap admin-body">
        {!authed ? (
          <form className="form admin-login" onSubmit={onSubmit} noValidate>
            <span className="kicker">{t('admin.panel')}</span>
            <h1 className="display">{t('admin.loginTitle')}</h1>
            <p>{t('admin.loginHint')}</p>
            {error && <div className="form-error-top" role="alert">{error}</div>}
            <div className="field">
              <label htmlFor="admin-token">{t('admin.tokenLabel')} <span className="req">*</span></label>
              <input
                id="admin-token"
                type="password"
                autoComplete="off"
                placeholder="X-Admin-Token"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn" disabled={loading || !input.trim()}>
              {loading ? t('admin.checking') : t('admin.enter')} <span className="arrow">↗</span>
            </button>
          </form>
        ) : (
          <>
            <div className="admin-head">
              <span className="kicker">{t('admin.panel')}</span>
              <h1 className="display">{t('admin.title')} <small className="admin-count">{items.length}</small></h1>
            </div>

            {error && <div className="form-error-top" role="alert">{error}</div>}

            {items.length === 0 && !loading ? (
              <p className="admin-empty">{t('admin.empty')}</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t('admin.colDate')}</th>
                      <th>{t('admin.colClient')}</th>
                      <th>{t('admin.colPhone')}</th>
                      <th>{t('admin.colService')}</th>
                      <th>{t('admin.colBarber')}</th>
                      <th>{t('admin.colCreated')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td className="nowrap"><b>{a.date}</b> · {a.time}</td>
                        <td>{a.name}</td>
                        <td className="nowrap"><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                        <td>{svcName[a.service_id] || `#${a.service_id}`}</td>
                        <td>{a.barber_id ? (barbName[a.barber_id] || `#${a.barber_id}`) : t('admin.anyBarber')}</td>
                        <td className="nowrap muted">{fmtCreated(a.created_at, t('admin.locale'))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
