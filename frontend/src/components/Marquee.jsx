import { useI18n } from '../lib/i18n'

export default function Marquee() {
  const { t } = useI18n()
  const words = t('marquee')
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...words, ...words].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}
