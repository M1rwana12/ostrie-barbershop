// Тонкий клієнт REST API бекенду OSTRIE.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * @param {string} path
 * @param {RequestInit} options
 * @param {number} attempt — внутрішній лічильник ретраїв
 *
 * GET-запити повторюються кілька разів: безкоштовний Render «засинає», і перший
 * запит після простою може повернути 404/5xx, поки інстанс прокидається. POST не
 * ретраїмо, щоб не створити дубль запису.
 */
// Ідемпотентні методи можна безпечно повторювати при холодному старті Render.
// POST НЕ ретраїмо, щоб не створити дубль запису.
const IDEMPOTENT = new Set(['GET', 'PATCH', 'PUT', 'DELETE'])

async function request(path, options = {}, attempt = 0) {
  const method = (options.method || 'GET').toUpperCase()
  const canRetry = IDEMPOTENT.has(method) && attempt < 4

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  } catch (networkErr) {
    // мережева помилка (інстанс ще прокидається) — ретраїмо ідемпотентні
    if (canRetry) {
      await sleep(2500)
      return request(path, options, attempt + 1)
    }
    throw networkErr
  }

  // холодний старт Render: 404 від роутера або 5xx → почекати й повторити
  if (!res.ok && canRetry && (res.status === 404 || res.status >= 500)) {
    await sleep(2500)
    return request(path, options, attempt + 1)
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* порожня відповідь — гаразд */
  }

  if (!res.ok) {
    const detail = data?.detail
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg).join(', ')
      : detail || `Помилка ${res.status}`
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return data
}

export const getServices = () => request('/services')
export const getBarbers = () => request('/barbers')
export const getAvailability = (barberId, date) =>
  request(`/availability?barber_id=${encodeURIComponent(barberId)}&date=${encodeURIComponent(date)}`)
export const createAppointment = (payload) =>
  request('/appointments', { method: 'POST', body: JSON.stringify(payload) })

// ── Авторизація (JWT) ──
const TOKEN_KEY = 'ostrie_jwt'
export const getToken = () => sessionStorage.getItem(TOKEN_KEY) || ''
export const setToken = (t) => sessionStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY)

const authHeaders = () => {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const auth = (path, options = {}) =>
  request(path, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } })

export const login = (email, password, totpCode) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...(totpCode ? { totp_code: totpCode } : {}) }),
  })
export const getMe = () => auth('/auth/me')

// ── Безпека: пароль і 2FA ──
export const changePassword = (current_password, new_password) =>
  auth('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) })
export const twofaSetup = () => auth('/auth/2fa/setup', { method: 'POST' })
export const twofaEnable = (code) =>
  auth('/auth/2fa/enable', { method: 'POST', body: JSON.stringify({ code }) })
export const twofaDisable = (code) =>
  auth('/auth/2fa/disable', { method: 'POST', body: JSON.stringify({ code }) })
export const twofaRegenBackup = (code) =>
  auth('/auth/2fa/backup-codes', { method: 'POST', body: JSON.stringify({ code }) })

// ── Адмін: записи ──
export const getAppointments = () => auth('/appointments')
export const updateAppointmentStatus = (id, status) =>
  auth(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// ── Аналітика (super_admin) ──
export const getAnalytics = ({ from, to } = {}) => {
  const qs = new URLSearchParams()
  if (from) qs.set('date_from', from)
  if (to) qs.set('date_to', to)
  const q = qs.toString()
  return auth(`/analytics/summary${q ? `?${q}` : ''}`)
}

// ── Журнал аудиту (super_admin) ──
export const getAudit = ({ action, limit = 200 } = {}) => {
  const qs = new URLSearchParams()
  if (action) qs.set('action', action)
  if (limit) qs.set('limit', String(limit))
  const q = qs.toString()
  return auth(`/audit${q ? `?${q}` : ''}`)
}

// ── Користувачі (super_admin) ──
export const getUsers = () => auth('/users')
export const createUser = (payload) =>
  auth('/users', { method: 'POST', body: JSON.stringify(payload) })
export const deleteUser = (id) => auth(`/users/${id}`, { method: 'DELETE' })
