import { useEffect, useState } from 'react'

const LINKS = [
  ['#services', 'Послуги', '01'],
  ['#masters', 'Майстри', '02'],
  ['#gallery', 'Роботи', '03'],
  ['#about', 'Про нас', '04'],
  ['#reviews', 'Відгуки', '05'],
  ['#booking', 'Запис', '06'],
  ['#contacts', 'Контакти', '07'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav">
          <a href="#top" className="brand" aria-label="OSTRIE — на головну">
            OSTRIE<span className="dot">.</span>
          </a>
          <nav className="nav-links" aria-label="Головна навігація">
            {LINKS.slice(0, 6).map(([href, label]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <a href="#booking" className="btn">Записатись</a>
          </div>
          <button
            className={`burger${open ? ' open' : ''}`}
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav id="mobileMenu" className={`mobile-menu${open ? ' open' : ''}`} aria-label="Мобільна навігація">
        {LINKS.map(([href, label, num]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label} <span>{num}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
