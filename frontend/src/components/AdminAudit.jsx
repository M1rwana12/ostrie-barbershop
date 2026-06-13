import { useEffect, useState } from 'react'
import { getAudit } from '../lib/api'
import { useI18n } from '../lib/i18n'

const ACTIONS = [
  'login_success', 'login_failed', 'login_ratelimited', 'password_changed',
  '2fa_enabled', '2fa_disabled', '2fa_backup_regenerated',
  'appointment_status_changed', 'user_created', 'user_deleted',
]

const fmtTs = (iso, locale) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function AdminAudit({ onUnauthorized }) {
  const { t } = useI18n()
  const [rows, setRows] = useState([])
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const labels = t('admin.auditActions')
  const actionLabel = (a) => (labels && labels[a]) || a

  const load = async (act = action) => {
    setLoading(true)
    setError('')
    try {
      setRows(await getAudit({ action: act || undefined }))
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(t('admin.errLoad', { msg: err.message }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  const onFilter = (e) => { const v = e.target.value; setAction(v); load(v) }

  return (
    <>
      <div className="admin-head">
        <span className="kicker">{t('admin.panel')}</span>
        <h1 className="display">{t('admin.auditTitle')} <small className="admin-count">{rows.length}</small></h1>
      </div>

      <div className="an-filter">
        <div className="field">
          <label htmlFor="au-action">{t('admin.auColAction')}</label>
          <select id="au-action" value={action} onChange={onFilter}>
            <option value="">{t('admin.auAll')}</option>
            {ACTIONS.map((a) => <option key={a} value={a}>{actionLabel(a)}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => load()} disabled={loading}>
          {loading ? t('admin.refreshing') : t('admin.refresh')}
        </button>
      </div>

      {error && <div className="form-error-top" role="alert">{error}</div>}

      {rows.length === 0 && !loading ? (
        <p className="admin-empty">{t('admin.empty')}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.auColTime')}</th>
                <th>{t('admin.auColAction')}</th>
                <th>{t('admin.auColActor')}</th>
                <th>{t('admin.auColIp')}</th>
                <th>{t('admin.auColResult')}</th>
                <th>{t('admin.auColDetail')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={r.success ? '' : 'st-cancelled'}>
                  <td className="nowrap muted" data-label={t('admin.auColTime')}>{fmtTs(r.ts, t('admin.locale'))}</td>
                  <td data-label={t('admin.auColAction')}>{actionLabel(r.action)}</td>
                  <td data-label={t('admin.auColActor')}>{r.actor_email || '—'}</td>
                  <td className="nowrap muted" data-label={t('admin.auColIp')}>{r.ip || '—'}</td>
                  <td data-label={t('admin.auColResult')}>
                    <span className={`status-badge ${r.success ? 'st-done' : 'st-cancelled'}`}>
                      {r.success ? t('admin.auOk') : t('admin.auFail')}
                    </span>
                  </td>
                  <td className="muted" data-label={t('admin.auColDetail')}>{r.detail || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
