import { useEffect, useRef, useState } from 'react'
import { login, getMe, setToken, clearToken, getToken } from '../lib/api'
import { useI18n, LANGS } from '../lib/i18n'
import { ToastProvider } from '../lib/toast'
import Logo from './Logo'
import {
  IcoDashboard, IcoBookings, IcoAnalytics, IcoUsers, IcoLog, IcoShield, IcoLogout, IcoMenu, IcoClose,
} from './icons'
import AdminDashboard from './AdminDashboard'
import AdminBookings from './AdminBookings'
import AdminAnalytics from './AdminAnalytics'
import AdminUsers from './AdminUsers'
import AdminAudit from './AdminAudit'
import AdminSecurity from './AdminSecurity'

const NAV = [
  { key: 'dashboard', label: 'admin.tabDashboard', Icon: IcoDashboard },
  { key: 'bookings', label: 'admin.tabBookings', Icon: IcoBookings },
  { key: 'analytics', label: 'admin.tabAnalytics', Icon: IcoAnalytics, super: true },
  { key: 'users', label: 'admin.tabUsers', Icon: IcoUsers, super: true },
  { key: 'audit', label: 'admin.tabAudit', Icon: IcoLog, super: true },
  { key: 'security', label: 'admin.tabSecurity', Icon: IcoShield },
]

function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="lang-toggle" role="group" aria-label="language">
      {LANGS.map((l) => (
        <button key={l} type="button" className={l === lang ? 'active' : ''}
          aria-pressed={l === lang} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

export default function Admin() {
  return (
    <ToastProvider>
      <AdminInner />
    </ToastProvider>
  )
}

function AdminInner() {
  const { t } = useI18n()
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(Boolean(getToken()))
  const [view, setView] = useState('dashboard')
  const [navOpen, setNavOpen] = useState(false) // мобільний drawer
  const [menuOpen, setMenuOpen] = useState(false) // меню користувача
  const menuRef = useRef(null)

  // login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [need2fa, setNeed2fa] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isSuper = user?.role === 'super_admin'
  const canEdit = isSuper || user?.role === 'admin'

  useEffect(() => {
    if (!getToken()) return
    getMe().then(setUser).catch(() => clearToken()).finally(() => setBooting(false))
  }, [])

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const onLogin = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const res = await login(email.trim().toLowerCase(), password, need2fa ? totpCode : undefined)
      setToken(res.access_token)
      setUser({ email: res.email, role: res.role })
      setPassword(''); setTotpCode(''); setNeed2fa(''); setView('dashboard')
    } catch (err) {
      if (err.message === '2fa_required') { setNeed2fa(true); setError('') }
      else setError(err.status === 401 ? t('admin.errCreds') : err.message)
    } finally { setBusy(false) }
  }

  const logout = () => {
    clearToken(); setUser(null); setEmail(''); setNeed2fa(false); setTotpCode('')
    setView('dashboard'); setMenuOpen(false)
  }

  const roleLabel = (r) =>
    r === 'super_admin' ? t('admin.roleSuper') : r === 'admin' ? t('admin.roleAdmin') : t('admin.roleBarber')

  const items = NAV.filter((n) => !n.super || isSuper)
  const go = (k) => { setView(k); setNavOpen(false) }

  if (booting) {
    return (
      <main className="admin-auth">
        <div className="admin-login"><span className="skel" style={{ height: 20, width: '60%' }} /></div>
      </main>
    )
  }

  // ── Екран входу ──
  if (!user) {
    return (
      <main className="admin-auth">
        <form className="form admin-login" onSubmit={onLogin} noValidate>
          <a className="admin-brand login-brand" href="./"><Logo /><span>OSTRIE</span></a>
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
      </main>
    )
  }

  const activeLabel = t(items.find((n) => n.key === view)?.label || 'admin.tabDashboard')

  // ── Каркас із сайдбаром ──
  return (
    <div className={`admin-shell${navOpen ? ' nav-open' : ''}`}>
      <aside className="admin-side">
        <a className="admin-brand" href="./" aria-label={t('nav.toHome')}>
          <Logo /><span>OSTRIE</span>
        </a>
        <nav className="side-nav">
          {items.map(({ key, label, Icon }) => (
            <button key={key} className={`side-link${view === key ? ' active' : ''}`} onClick={() => go(key)}>
              <Icon /><span>{t(label)}</span>
            </button>
          ))}
        </nav>
        <button className="side-link side-logout" onClick={logout}>
          <IcoLogout /><span>{t('admin.logout')}</span>
        </button>
      </aside>

      {navOpen && <div className="admin-overlay" onClick={() => setNavOpen(false)} />}

      <div className="admin-main">
        <header className="admin-top">
          <button className="icon-btn only-mobile" aria-label="menu" onClick={() => setNavOpen((v) => !v)}>
            {navOpen ? <IcoClose /> : <IcoMenu />}
          </button>
          <h1 className="top-title">{activeLabel}</h1>
          <div className="top-right">
            <LangSwitch />
            <div className="user-menu" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenuOpen((v) => !v)} aria-haspopup="true" aria-expanded={menuOpen}>
                <span className="avatar">{(user.email[0] || '?').toUpperCase()}</span>
                <span className="user-meta only-desktop"><b>{user.email}</b><small>{roleLabel(user.role)}</small></span>
              </button>
              {menuOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="ud-head"><b>{user.email}</b><small>{roleLabel(user.role)}</small></div>
                  <button role="menuitem" onClick={() => { go('security'); setMenuOpen(false) }}><IcoShield /> {t('admin.tabSecurity')}</button>
                  <button role="menuitem" className="ud-danger" onClick={logout}><IcoLogout /> {t('admin.logout')}</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content">
          {view === 'dashboard' && <AdminDashboard isSuper={isSuper} onNavigate={go} onUnauthorized={logout} />}
          {view === 'bookings' && <AdminBookings canEdit={canEdit} onUnauthorized={logout} />}
          {view === 'analytics' && isSuper && <AdminAnalytics onUnauthorized={logout} />}
          {view === 'users' && isSuper && <AdminUsers currentEmail={user.email} onUnauthorized={logout} />}
          {view === 'audit' && isSuper && <AdminAudit onUnauthorized={logout} />}
          {view === 'security' && <AdminSecurity onUnauthorized={logout} />}
        </div>
      </div>
    </div>
  )
}
