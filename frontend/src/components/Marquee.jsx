const WORDS = ['Стрижка', 'Борода', 'Королівське гоління', 'Камуфляж сивини', 'Дитяча стрижка', 'Стайлінг']

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}
