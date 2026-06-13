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
async function request(path, options = {}, attempt = 0) {
  const method = options.method || 'GET'
  const canRetry = method === 'GET' && attempt < 4

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  } catch (networkErr) {
    // мережева помилка (інстанс ще прокидається) — ретраїмо GET
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
export const createAppointment = (payload) =>
  request('/appointments', { method: 'POST', body: JSON.stringify(payload) })
