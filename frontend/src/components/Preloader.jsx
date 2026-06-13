import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'

export default function Preloader() {
  const { t } = useI18n()
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minHold = reduce ? 0 : 1500
    const start = Date.now()
    let toFinish
    let toGone

    const finish = () => {
      setDone(true)
      toGone = setTimeout(() => setGone(true), 900)
    }
    const onLoad = () => {
      toFinish = setTimeout(finish, Math.max(0, minHold - (Date.now() - start)))
    }

    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad)
    const safety = setTimeout(finish, 4500)

    return () => {
      clearTimeout(toFinish)
      clearTimeout(toGone)
      clearTimeout(safety)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  if (gone) return null

  return (
    <div className={`preloader${done ? ' done' : ''}`} role="presentation" aria-hidden="true">
      <div className="pl-inner">
        <span className="pl-line" />
        <div className="pl-word">
          <span>O</span><span>S</span><span className="ac">T</span><span>R</span><span>I</span><span>E</span>
        </div>
        <div className="pl-sub">{t('preloader.sub')}</div>
      </div>
    </div>
  )
}
