import { useEffect, useState } from 'react'
import { login, getMe, setToken, clearToken, getToken } from '../lib/api'
import { useI18n } from '../lib/i18n'
import Logo from './Logo'
import AdminBookings from './AdminBookings'
import AdminAnalytics from './AdminAnalytics'
import AdminUsers from './AdminUsers'
import AdminSecurity from './AdminSecurity'

export default function Admin() {
  const { t } = useI18n()
  const [user, setUser] = useState(null) // { email, role }
  const [booting, setBooting] = useState(Boolean(getToken()))
  const [tab, setTab] = useState('bookings')

  // login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [need2fa, setNeed2fa] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isSuper = user?.role === 'super_admin'

  // Авто-вхід за збереженим JWT
  useEffect(() => {
    if (!getToken()) return
    getMe()
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setBooting(false))
  }, [])

  const onLogin = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await login(email.trim().toLowerCase(), password, need2fa ? totpCode : undefined)
      setToken(res.access_token)
      setUser({ email: res.email, role: res.role })
      setPassword(''); setTotpCode(''); setNeed2fa(false)
    } catch (err) {
      if (err.message === '2fa_required') {
        // правильні логін+пароль, але потрібен код 2FA
        setNeed2fa(true)
        setError('')
      } else if (err.status === 401 && need2fa) {
        setError(t('admin.errCreds')) // невірний код
      } else {
        setError(err.status === 401 ? t('admin.errCreds') : err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  const logout = () => {
    clearToken()
    setUser(null)
    setEmail('')
    setNeed2fa(false)
    setTotpCode('')
    setTab('bookings')
  }

  const roleLabel = (r) =>
    r === 'super_admin' ? t('admin.roleSuper') : r === 'admin' ? t('admin.roleAdmin') : t('admin.roleBarber')

  if (booting) {
    return (
      <main className="admin">
        <div className="wrap admin-body"><p className="admin-empty">…</p></div>
      </main>
    )
  }

  return (
    <main className="admin">
      <header className="admin-bar">
        <a className="admin-brand" href="./" aria-label={t('nav.toHome')}>
          <Logo />
          <span>{t('admin.brand')}</span>
        </a>
        {user && (
          <div className="admin-actions">
            <span className="admin-who">{user.email} · <b>{roleLabel(user.role)}</b></span>
            <button type="button" className="btn btn--ghost" onClick={logout}>{t('admin.logout')}</button>
          </div>
        )}
      </header>

      <div className="wrap admin-body">
        {!user ? (
          <form className="form admin-login" onSubmit={onLogin} noValidate>
            <span className="kicker">{t('admin.panel')}</span>
            <h1 className="display">{t('admin.loginTitle')}</h1>
            <p>{t('admin.loginHint')}</p>
            {error && <div className="form-error-top" role="alert">{error}</div>}
            <div className="field">
              <label htmlFor="admin-email">{t('admin.emailLabel')}</label>
              <input id="admin-email" type="email" autoComplete="username"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="admin-pass">{t('admin.passwordLabel')}</label>
              <input id="admin-pass" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {need2fa && (
              <div className="field">
                <label htmlFor="admin-2fa">{t('admin.loginCode')}</label>
                <input id="admin-2fa" type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus
                  placeholder="000000" value={totpCode} onChange={(e) => setTotpCode(e.target.value)} />
                <span className="msg" style={{ color: 'var(--ink-dim)' }}>{t('admin.login2faHint')} · {t('admin.loginCodeHint')}</span>
              </div>
            )}
            <button type="submit" className="btn" disabled={busy || !email.trim() || !password || (need2fa && totpCode.length < 6)}>
              {busy ? t('admin.checking') : t('admin.enter')} <span className="arrow">↗</span>
            </button>
          </form>
        ) : (
          <>
            <nav className="admin-tabs" aria-label="admin">
              <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
                {t('admin.tabBookings')}
              </button>
              {isSuper && (
                <button className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}>
                  {t('admin.tabAnalytics')}
                </button>
              )}
              {isSuper && (
                <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
                  {t('admin.tabUsers')}
                </button>
              )}
              <button className={tab === 'security' ? 'active' : ''} onClick={() => setTab('security')}>
                {t('admin.tabSecurity')}
              </button>
            </nav>

            {tab === 'bookings' && <AdminBookings canEdit={isSuper || user.role === 'admin'} onUnauthorized={logout} />}
            {tab === 'analytics' && isSuper && <AdminAnalytics onUnauthorized={logout} />}
            {tab === 'users' && isSuper && <AdminUsers currentEmail={user.email} onUnauthorized={logout} />}
            {tab === 'security' && <AdminSecurity onUnauthorized={logout} />}
          </>
        )}
      </div>
    </main>
  )
}
