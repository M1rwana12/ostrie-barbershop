import { useEffect, useMemo, useState } from 'react'
import { getAppointments, getServices, getBarbers, updateAppointmentStatus } from '../lib/api'
import { useI18n } from '../lib/i18n'

const STATUSES = ['new', 'done', 'cancelled']

const fmtCreated = (iso, locale) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminBookings({ canEdit, onUnauthorized }) {
  const { t } = useI18n()
  const [items, setItems] = useState([])
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const svcName = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s.name])), [services])
  const barbName = useMemo(() => Object.fromEntries(barbers.map((b) => [b.id, b.name])), [barbers])

  const statusLabel = (s) =>
    s === 'done' ? t('admin.statusDone') : s === 'cancelled' ? t('admin.statusCancelled') : t('admin.statusNew')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [appts, svc, brb] = await Promise.all([getAppointments(), getServices(), getBarbers()])
      setItems(appts)
      setServices(svc)
      setBarbers(brb)
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setError(t('admin.errLoad', { msg: err.message }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [])

  const changeStatus = async (id, status) => {
    const prev = items
    setItems((list) => list.map((a) => (a.id === id ? { ...a, status } : a)))
    try {
      await updateAppointmentStatus(id, status)
    } catch (err) {
      if (err.status === 401) return onUnauthorized()
      setItems(prev) // відкат при помилці
      setError(t('admin.errLoad', { msg: err.message }))
    }
  }

  return (
    <>
      <div className="admin-head">
        <span className="kicker">{t('admin.panel')}</span>
        <h1 className="display">{t('admin.title')} <small className="admin-count">{items.length}</small></h1>
      </div>
      <div className="admin-toolbar">
        <button type="button" className="btn btn--ghost" onClick={load} disabled={loading}>
          {loading ? t('admin.refreshing') : t('admin.refresh')}
        </button>
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
                <th>{t('admin.colStatus')}</th>
                <th>{t('admin.colCreated')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className={`st-${a.status}`}>
                  <td>{a.id}</td>
                  <td className="nowrap"><b>{a.date}</b> · {a.time}</td>
                  <td>{a.name}</td>
                  <td className="nowrap"><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                  <td>{svcName[a.service_id] || `#${a.service_id}`}</td>
                  <td>{a.barber_id ? (barbName[a.barber_id] || `#${a.barber_id}`) : t('admin.anyBarber')}</td>
                  <td>
                    {canEdit ? (
                      <select className={`status-sel st-${a.status}`} value={a.status}
                        onChange={(e) => changeStatus(a.id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                      </select>
                    ) : (
                      <span className={`status-badge st-${a.status}`}>{statusLabel(a.status)}</span>
                    )}
                  </td>
                  <td className="nowrap muted">{fmtCreated(a.created_at, t('admin.locale'))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
