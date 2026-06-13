import { useEffect, useState } from 'react'
import Logo from './Logo'
import { useI18n, LANGS } from '../lib/i18n'

const LINK_KEYS = [
  ['#services', 'nav.services', '01'],
  ['#masters', 'nav.masters', '02'],
  ['#gallery', 'nav.gallery', '03'],
  ['#about', 'nav.about', '04'],
  ['#reviews', 'nav.reviews', '05'],
  ['#booking', 'nav.booking', '06'],
  ['#contacts', 'nav.contacts', '07'],
]

function LangToggle({ className = '' }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={`lang-toggle ${className}`} role="group" aria-label={t('nav.langLabel')}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={l === lang ? 'active' : ''}
          aria-pressed={l === lang}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const { t } = useI18n()
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
          <a href="#top" className="brand" aria-label={t('nav.toHome')}>
            <Logo />OSTRIE<span className="dot">.</span>
          </a>
          <nav className="nav-links" aria-label="Головна навігація">
            {LINK_KEYS.slice(0, 6).map(([href, key]) => (
              <a key={href} href={href}>{t(key)}</a>
            ))}
          </nav>
          <div className="nav-cta">
            <LangToggle />
            <a href="#booking" className="btn">{t('nav.cta')}</a>
          </div>
          <button
            className={`burger${open ? ' open' : ''}`}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav id="mobileMenu" className={`mobile-menu${open ? ' open' : ''}`} aria-label="Мобільна навігація">
        {LINK_KEYS.map(([href, key, num]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {t(key)} <span>{num}</span>
          </a>
        ))}
        <LangToggle className="lang-toggle--mobile" />
      </nav>
    </>
  )
}
