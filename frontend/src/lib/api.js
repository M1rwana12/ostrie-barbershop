// Тонкий клієнт REST API бекенду OSTRIE.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

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
