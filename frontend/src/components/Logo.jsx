// Логотип OSTRIE — кільце «O», крізь яке проходить лезо (брас).
export default function Logo({ className = 'logo-mark' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8.5 23.5 L23.5 8.5" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="23.5" cy="8.5" r="1.6" fill="var(--accent)" />
    </svg>
  )
}
