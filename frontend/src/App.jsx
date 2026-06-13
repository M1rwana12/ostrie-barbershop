import { useEffect, useState } from 'react'
import { getServices, getBarbers } from './lib/api'
import { useSignatureEffects } from './hooks/useSignatureEffects'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Barbers from './components/Barbers'
import Gallery from './components/Gallery'
import About from './components/About'
import Reviews from './components/Reviews'
import Booking from './components/Booking'
import Footer from './components/Footer'
import Admin from './components/Admin'

// Простий hash-роутинг (#/admin) — працює на GitHub Pages без 404-фолбеку
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const route = useHashRoute()
  if (route.startsWith('#/admin')) return <Admin />
  return <Landing />
}

function Landing() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([getServices(), getBarbers()])
      .then(([s, b]) => {
        if (!alive) return
        setServices(s)
        setBarbers(b)
      })
      .catch(() => alive && setError(true))
      .finally(() => {
        if (!alive) return
        setLoading(false)
        setReady(true)
      })
    return () => {
      alive = false
    }
  }, [])

  // Сигнатурні DOM-ефекти запускаємо, коли контент відрендерено
  useSignatureEffects(ready)

  return (
    <>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services services={services} loading={loading} error={error} />
        <Barbers barbers={barbers} loading={loading} error={error} />
        <Gallery />
        <About />
        <Reviews />
        <Booking services={services} barbers={barbers} />
      </main>
      <Footer />
    </>
  )
}
