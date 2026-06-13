import { useState } from 'react'
import { HERO, HERO_VIDEO } from '../lib/images'
import { useI18n } from '../lib/i18n'

export default function Hero() {
  const { t } = useI18n()
  // Для prefers-reduced-motion відео не вантажимо — показуємо лише фото.
  const [useVideo] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  return (
    <section className="hero" aria-label="OSTRIE барбершоп" id="top">
      <div className="hero-media" aria-hidden="true">
        {useVideo ? (
          <video
            className="hero-video"
            poster={HERO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img className="hero-photo" src={HERO} alt="" fetchpriority="high" />
        )}
        <div className="hero-scrim" />
      </div>
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="wrap hero-inner">
        <div className="hero-top">
          <p className="hero-meta">{t('hero.badge')}<br />{t('hero.address')}<br />{t('hero.city')}</p>
          <p className="hero-meta" style={{ textAlign: 'right' }}>{t('hero.hours')}<br />{t('hero.online')}</p>
        </div>

        <h1 className="display hero-title" data-reveal>OS<span className="blade">T</span>RIE</h1>

        <div className="hero-tagline">
          <p className="lead" data-reveal data-delay="1">{t('hero.taglinePre')}<em>{t('hero.taglineEm')}</em>{t('hero.taglinePost')}</p>
          <p className="sub" data-reveal data-delay="2">
            {t('hero.sub')}
          </p>
          <div className="hero-actions" data-reveal data-delay="3">
            <a href="#booking" className="btn">{t('hero.ctaBook')} <span className="arrow">↗</span></a>
            <a href="#services" className="btn btn--ghost">{t('hero.ctaServices')}</a>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">{t('hero.scroll')}<span className="line" /></div>
      </div>
    </section>
  )
}
