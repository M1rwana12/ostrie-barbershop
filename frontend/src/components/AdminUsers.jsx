import { useEffect, useState } from 'react'
import { getUsers, createUser, deleteUser } from '../lib/api'
import { useI18n } from '../lib/i18n'

const ROLES = ['admin', 'barber', 'super_admin']

export default function AdminUsers({ currentEmail, onUnauthorized }) {
  const { t } = useI18n()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('barber')
  const [busy, setBusy] = useState(false)

  const roleLabel = (r) =>
    r === 'super_admin' ? t('admin.roleSuper') : r === 'admin' ? t('admin.roleAdmin') : t('admin.roleBarber')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setUsers(await getUsers())
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(t('admin.errLoad', { msg: err.message }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await createUser({ email: email.trim().toLowerCase(), password, role })
      setEmail(''); setPassword(''); setRole('barber')
      await load()
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (u) => {
    if (!window.confirm(t('admin.confirmDelete', { email: u.email }))) return
    try {
      await deleteUser(u.id)
      await load()
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(err.message)
    }
  }

  return (
    <>
      <div className="admin-head">
        <span className="kicker">{t('admin.panel')}</span>
        <h1 className="display">{t('admin.usersTitle')} <small className="admin-count">{users.length}</small></h1>
      </div>

      {error && <div className="form-error-top" role="alert">{error}</div>}

      <form className="form user-form" onSubmit={onCreate}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="u-email">{t('admin.uEmail')}</label>
            <input id="u-email" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="u-pass">{t('admin.uPassword')}</label>
            <input id="u-pass" type="text" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="u-role">{t('admin.uRole')}</label>
            <select id="u-role" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn" disabled={busy || !email.trim() || password.length < 6}>
          {busy ? t('admin.creating') : t('admin.create')} <span className="arrow">↗</span>
        </button>
      </form>

      {users.length > 0 && (
        <div className="admin-table-wrap" style={{ marginTop: '2rem' }}>
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>{t('admin.uEmail')}</th><th>{t('admin.uRole')}</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="#">{u.id}</td>
                  <td data-label={t('admin.uEmail')}>{u.email}{u.email === currentEmail && <span className="muted"> · {t('admin.you')}</span>}</td>
                  <td data-label={t('admin.uRole')}>{roleLabel(u.role)}</td>
                  <td className="nowrap" data-label="">
                    {u.email !== currentEmail && (
                      <button type="button" className="link-danger" onClick={() => onDelete(u)}>{t('admin.del')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {loading && <p className="admin-empty">…</p>}
    </>
  )
}
