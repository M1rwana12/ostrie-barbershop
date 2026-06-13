import { useEffect } from 'react'

/**
 * DOM-ефекти бренду OSTRIE: scroll-reveal, прогрес-скролу, кастомний курсор-лезо,
 * магнітні кнопки, слайдери «до/після». Викликається один раз у App після монтування.
 * Усе поважає prefers-reduced-motion та тач-пристрої.
 */
export function useSignatureEffects(ready) {
  useEffect(() => {
    if (!ready) return
    const cleanups = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    /* ---- Scroll reveal ---- */
    const reveals = document.querySelectorAll('[data-reveal]')
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              io.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      reveals.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    } else {
      reveals.forEach((el) => el.classList.add('in'))
    }

    /* ---- Scroll progress blade ---- */
    const prog = document.getElementById('progress')
    if (prog) {
      const updProg = () => {
        const d = document.documentElement
        const max = d.scrollHeight - d.clientHeight
        prog.style.transform = `scaleX(${max > 0 ? Math.min(1, d.scrollTop / max) : 0})`
      }
      window.addEventListener('scroll', updProg, { passive: true })
      updProg()
      cleanups.push(() => window.removeEventListener('scroll', updProg))
    }

    /* ---- Custom blade cursor (fine pointers only) ---- */
    if (finePointer) {
      const bcur = document.querySelector('.blade-cursor')
      const bdot = document.querySelector('.blade-dot')
      if (bcur && bdot) {
        document.body.classList.add('cursor-on')
        let tx = window.innerWidth / 2
        let ty = window.innerHeight / 2
        let cx = tx
        let cy = ty
        let raf
        const onMove = (e) => {
          tx = e.clientX
          ty = e.clientY
          bdot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`
        }
        const trail = () => {
          cx += (tx - cx) * 0.2
          cy += (ty - cy) * 0.2
          bcur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`
          raf = requestAnimationFrame(trail)
        }
        const growSel = 'a, button, .ba-handle, .cx-item, [data-cursor]'
        const textSel = 'input, select, textarea'
        const onOver = (e) => {
          if (e.target.closest(textSel)) document.body.classList.add('cursor-text')
          else if (e.target.closest(growSel)) document.body.classList.add('cursor-hover')
        }
        const onOut = (e) => {
          if (e.target.closest(textSel)) document.body.classList.remove('cursor-text')
          if (e.target.closest(growSel)) document.body.classList.remove('cursor-hover')
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseover', onOver)
        document.addEventListener('mouseout', onOut)
        trail()
        cleanups.push(() => {
          cancelAnimationFrame(raf)
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('mouseover', onOver)
          document.removeEventListener('mouseout', onOut)
          document.body.classList.remove('cursor-on', 'cursor-hover', 'cursor-text')
        })
      }
    }

    /* ---- Magnetic buttons ---- */
    if (finePointer && !reduceMotion) {
      document.querySelectorAll('.btn').forEach((btn) => {
        const onMove = (e) => {
          const r = btn.getBoundingClientRect()
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${
            (e.clientY - r.top - r.height / 2) * 0.4
          }px)`
        }
        const onLeave = () => {
          btn.style.transform = ''
        }
        btn.addEventListener('mousemove', onMove)
        btn.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          btn.removeEventListener('mousemove', onMove)
          btn.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    /* ---- Before / after blade sliders ---- */
    document.querySelectorAll('.ba').forEach((ba) => {
      const handle = ba.querySelector('.ba-handle')
      let pos = 50
      let dragging = false
      const apply = () => {
        ba.style.setProperty('--pos', `${pos}%`)
        if (handle) handle.setAttribute('aria-valuenow', Math.round(pos))
      }
      const set = (p) => {
        pos = Math.max(0, Math.min(100, p))
        apply()
      }
      const fromX = (x) => {
        const r = ba.getBoundingClientRect()
        set(((x - r.left) / r.width) * 100)
      }
      const onDown = (e) => {
        dragging = true
        try {
          ba.setPointerCapture(e.pointerId)
        } catch {
          /* noop */
        }
        fromX(e.clientX)
      }
      const onMove = (e) => dragging && fromX(e.clientX)
      const onUp = () => {
        dragging = false
      }
      const onKey = (e) => {
        if (e.key === 'ArrowLeft') {
          set(pos - 4)
          e.preventDefault()
        } else if (e.key === 'ArrowRight') {
          set(pos + 4)
          e.preventDefault()
        } else if (e.key === 'Home') {
          set(0)
          e.preventDefault()
        } else if (e.key === 'End') {
          set(100)
          e.preventDefault()
        }
      }
      ba.addEventListener('pointerdown', onDown)
      ba.addEventListener('pointermove', onMove)
      ba.addEventListener('pointerup', onUp)
      ba.addEventListener('pointercancel', onUp)
      if (handle) handle.addEventListener('keydown', onKey)
      apply()
    })

    return () => cleanups.forEach((fn) => fn())
  }, [ready])
}
