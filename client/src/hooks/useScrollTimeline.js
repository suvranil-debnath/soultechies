import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollTimeline(isPreloaderDone = true, enabled = true) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    // Disable browser scroll restoration so refresh always starts at top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Use GSAP ticker to drive Lenis RAF
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(500, 33)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const lenis = lenisRef.current
    if (!lenis) return

    if (!isPreloaderDone) {
      lenis.stop()
      lenis.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    } else {
      lenis.start()
      lenis.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)
    }
  }, [isPreloaderDone])

  return lenisRef
}
