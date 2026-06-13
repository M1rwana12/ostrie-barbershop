// DOM-вузли для прогрес-бару та кастомного курсора-лезо.
// Логіка руху — у useSignatureEffects.
export default function Cursor() {
  return (
    <>
      <div className="progress" id="progress" aria-hidden="true" />
      <div className="blade-cursor" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20L20 4M20 4v6M20 4h-6" />
        </svg>
      </div>
      <div className="blade-dot" aria-hidden="true" />
    </>
  )
}
