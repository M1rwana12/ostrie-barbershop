import { useEffect, useMemo, useState } from 'react'
import { createAppointment, getAvailability } from '../lib/api'
import { useI18n } from '../lib/i18n'

const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
const todayISO = () => new Date().toISOString().split('T')[0]

export default function Booking({ services, barbers }) {
  const { t } = useI18n()

  const fmtTime = (m) => {
    const h = Math.floor(m / 60)
    const mm = m % 60
    return `${h ? `${h} ${t('booking.unitH')} ` : ''}${mm ? `${mm} ${t('booking.unitMin')}` : ''}`.trim() || `0 ${t('booking.unitMin')}`
  }

  const [picked, setPicked] = useState(() => new Set())
  const [form, setForm] = useState({ name: '', phone: '', service_id: '', barber_id: '', date: '', time: '', website: '' })
  const [errors, setErrors] = useState({})
  const [topError, setTopError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [taken, setTaken] = useState([])

  // Підтягуємо зайняті слоти, коли обрано конкретного майстра + дату
  useEffect(() => {
    if (!form.barber_id || !form.date) {
      setTaken([])
      return
    }
    let alive = true
    getAvailability(form.barber_id, form.date)
      .then((d) => alive && setTaken(d.taken || []))
      .catch(() => alive && setTaken([]))
    return () => {
      alive = false
    }
  }, [form.barber_id, form.date])

  // Якщо вже обраний час став зайнятим — скидаємо його
  useEffect(() => {
    if (form.time && taken.includes(form.time)) {
      setForm((f) => ({ ...f, time: '' }))
    }
  }, [taken, form.time])

  // первинне заповнення конструктора: позначаємо першу послугу
  useEffect(() => {
    if (services.length) setPicked((prev) => (prev.size === 0 ? new Set([services[0].id]) : prev))
  }, [services])

  const totals = useMemo(() => {
    let price = 0
    let time = 0
    services.forEach((s) => {
      if (picked.has(s.id)) {
        price += s.price
        time += s.duration
      }
    })
    return { price, time }
  }, [picked, services])

  const toggle = (id) => {
    setPicked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const applyLook = () => {
    if (picked.size === 0) return
    const chosen = services.filter((s) => picked.has(s.id))
    const combo = chosen.find((s) => /комплекс/i.test(s.name))
    const target = chosen.length === 1 ? chosen[0] : combo || chosen[0]
    setForm((f) => ({ ...f, service_id: String(target.id) }))
    setErrors((e) => ({ ...e, service_id: '' }))
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => document.getElementById('name')?.focus(), 600)
  }

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = t('booking.errName')
    if (form.phone.replace(/\D/g, '').length < 9) e.phone = t('booking.errPhone')
    if (!form.service_id) e.service_id = t('booking.errService')
    if (!form.date) e.date = t('booking.errDate')
    else if (form.date < todayISO()) e.date = t('booking.errDateFuture')
    if (!form.time) e.time = t('booking.errTime')
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setTopError('')
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setSubmitting(true)
    try {
      await createAppointment({
        name: form.name.trim(),
        phone: form.phone.trim(),
        service_id: Number(form.service_id),
        barber_id: form.barber_id ? Number(form.barber_id) : null,
        date: form.date,
        time: form.time,
        website: form.website, // honeypot — справжні користувачі лишають порожнім
      })
      setSuccess(true)
    } catch (err) {
      setTopError(
        err.status === 409 || err.status === 429
          ? err.message
          : t('booking.errSend', { msg: err.message }),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-pad" id="booking" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        {/* Конструктор образу */}
        <div className="constructor" data-reveal>
          <div className="constructor-head">
            <div>
              <h3>{t('booking.cxTitle')}</h3>
              <p>{t('booking.cxSub')}</p>
            </div>
            <span className="kicker" style={{ margin: 0 }}>{t('booking.cxBadge')}</span>
          </div>
          <div className="cx-grid">
            {services.map((s) => (
              <label className="cx-item" key={s.id}>
                <input type="checkbox" checked={picked.has(s.id)} onChange={() => toggle(s.id)} />
                <span className="cx-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span className="cx-info"><b>{s.name}</b><small>{fmtTime(s.duration)}</small></span>
                <span className="cx-price">{s.price}₴</span>
              </label>
            ))}
          </div>
          <div className="cx-total">
            <div className="cx-sums">
              <div className="cx-sum"><div className="k">{t('booking.total')}</div><div className="v">{totals.price}<small> {t('booking.currency')}</small></div></div>
              <div className="cx-sum time"><div className="k">{t('booking.duration')}</div><div className="v">{fmtTime(totals.time)}</div></div>
            </div>
            <button type="button" className="btn" data-cursor disabled={picked.size === 0} onClick={applyLook}>
              {t('booking.cxApply')} <span className="arrow">↗</span>
            </button>
          </div>
        </div>

        <div className="booking">
          <div className="booking-aside">
            <span className="kicker">{t('booking.kicker')}</span>
            <h2 className="display" data-reveal>{t('booking.title')[0]}<br />{t('booking.title')[1]}</h2>
            <p data-reveal data-delay="1">
              {t('booking.lead')}
            </p>

            <div className="booking-contacts" data-reveal data-delay="2">
              <a href="tel:+380441234567">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                <span><span className="lbl">{t('booking.cPhone')}</span>+38 (044) 123-45-67</span>
              </a>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span><span className="lbl">{t('booking.cAddress')}</span>{t('booking.cAddressVal')}</span>
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                <span><span className="lbl">{t('booking.cSchedule')}</span>{t('booking.cScheduleVal')}</span>
              </div>
            </div>
          </div>

          <div data-reveal data-delay="1">
            {success ? (
              <div className="form" >
                <div className="form-success" role="status" aria-live="polite">
                  <div className="check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h3>{t('booking.successTitle')}</h3>
                  <p>{t('booking.successText')}</p>
                </div>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                {/* Honeypot: приховане поле-пастка для ботів. Реальні люди його не бачать. */}
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="website">Не заповнюйте це поле</label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setField('website', e.target.value)}
                  />
                </div>

                {topError && <div className="form-error-top" role="alert">{topError}</div>}

                <div className="form-row">
                  <div className={`field${errors.name ? ' error' : ''}`}>
                    <label htmlFor="name">{t('booking.fName')} <span className="req">*</span></label>
                    <input id="name" type="text" placeholder={t('booking.fNamePh')} autoComplete="name"
                      value={form.name} onChange={(e) => setField('name', e.target.value)} />
                    <span className="msg">{errors.name}</span>
                  </div>
                  <div className={`field${errors.phone ? ' error' : ''}`}>
                    <label htmlFor="phone">{t('booking.fPhone')} <span className="req">*</span></label>
                    <input id="phone" type="tel" placeholder={t('booking.fPhonePh')} autoComplete="tel"
                      value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                    <span className="msg">{errors.phone}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`field${errors.service_id ? ' error' : ''}`}>
                    <label htmlFor="service">{t('booking.fService')} <span className="req">*</span></label>
                    <select id="service" value={form.service_id} onChange={(e) => setField('service_id', e.target.value)}>
                      <option value="" disabled>{t('booking.fServicePh')}</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.price} {t('booking.currency')}</option>
                      ))}
                    </select>
                    <span className="msg">{errors.service_id}</span>
                  </div>
                  <div className="field">
                    <label htmlFor="barber">{t('booking.fBarber')}</label>
                    <select id="barber" value={form.barber_id} onChange={(e) => setField('barber_id', e.target.value)}>
                      <option value="">{t('booking.fBarberAny')}</option>
                      {barbers.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <span className="msg" />
                  </div>
                </div>

                <div className="form-row">
                  <div className={`field${errors.date ? ' error' : ''}`}>
                    <label htmlFor="date">{t('booking.fDate')} <span className="req">*</span></label>
                    <input id="date" type="date" min={todayISO()}
                      value={form.date} onChange={(e) => setField('date', e.target.value)} />
                    <span className="msg">{errors.date}</span>
                  </div>
                  <div className={`field${errors.time ? ' error' : ''}`}>
                    <label htmlFor="time">{t('booking.fTime')} <span className="req">*</span></label>
                    <select id="time" value={form.time} onChange={(e) => setField('time', e.target.value)}>
                      <option value="" disabled>{t('booking.fTimePh')}</option>
                      {TIMES.map((slot) => {
                        const busy = taken.includes(slot)
                        return (
                          <option key={slot} value={slot} disabled={busy}>
                            {slot}{busy ? t('booking.taken') : ''}
                          </option>
                        )
                      })}
                    </select>
                    <span className="msg">{errors.time}</span>
                  </div>
                </div>

                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? t('booking.submitting') : t('booking.submit')} <span className="arrow">↗</span>
                </button>
                <p className="form-note">{t('booking.note')}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
