import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((message, type = 'info', ttl = 3500) => {
    const id = ++idSeq
    setToasts((list) => [...list, { id, message, type }])
    timers.current[id] = setTimeout(() => remove(id), ttl)
    return id
  }, [remove])

  const api = {
    toast: push,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 5000),
    info: (m) => push(m, 'info'),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} onClick={() => remove(t.id)} role="status">
            <span className="toast-dot" aria-hidden="true" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  // Безпечний фолбек, якщо провайдера немає (наприклад, поза адмінкою)
  return ctx || { toast() {}, success() {}, error() {}, info() {} }
}
