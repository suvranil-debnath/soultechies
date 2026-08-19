import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection({ isPreloaderDone, onGapMeasured }) {
  const sectionRef = useRef(null)
  const sRef = useRef(null)
  const ultechiesRef = useRef(null)
  const gapRef = useRef(null) // ← the invisible 'O' spacer div
  const entryDoneRef = useRef(false)

  useEffect(() => {
    if (!isPreloaderDone || entryDoneRef.current) return
    entryDoneRef.current = true

    const s = sRef.current
    const ultechies = ultechiesRef.current

    // Initial state: both words scaled down & blurred, tucked behind black hole
    gsap.set(s, { x: '8vw', scale: 0.3, opacity: 0, filter: 'blur(12px)' })
    gsap.set(ultechies, { x: '-8vw', scale: 0.3, opacity: 0, filter: 'blur(12px)' })

    // Entry: S and ULTECHIES emerge outward from behind the black hole
    const entryTl = gsap.timeline({ delay: 0.2 })

    entryTl.to(s, {
      x: '0vw', scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.4, ease: 'power3.out',
    })

    entryTl.to(ultechies, {
      x: '0vw', scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.4, ease: 'power3.out',
    }, '-=1.4')

    // After entry animation: measure where the 'O' gap ACTUALLY is
    // = midpoint between S's right edge and ULTECHIES's left edge
    entryTl.call(() => {
      if (!sRef.current || !ultechiesRef.current || !onGapMeasured) return
      const sRect = sRef.current.getBoundingClientRect()
      const uRect = ultechiesRef.current.getBoundingClientRect()
      const gapCenterX = (sRect.right + uRect.left) / 2
      const viewportCenterX = window.innerWidth / 2
      const offsetFromCenter = gapCenterX - viewportCenterX
      console.log('[HeroSection] gap at', gapCenterX.toFixed(1), 'px, offset from center:', offsetFromCenter.toFixed(1), 'px')
      onGapMeasured(offsetFromCenter)
    })

    // Scroll-driven Horizontal Wordmark Exit: S drifts strictly LEFT, ULTECHIES drifts strictly RIGHT
    // Completes early (by 25% scroll) so text is 100% off-screen before black hole zoom & dissolution!
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '25% top',
        scrub: 1.0,
      },
    })

    scrollTl.to(s, {
      x: '-75vw',
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'power2.in',
    }, 0)

    scrollTl.to(ultechies, {
      x: '75vw',
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'power2.in',
    }, 0)

    return () => {
      entryTl.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isPreloaderDone, onGapMeasured])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '350vh',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Pinned Fixed Container — guarantees zero vertical movement when scrolling! */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* S */}
          <div
            ref={sRef}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              WebkitFontSmoothing: 'antialiased',
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: '#ffffff',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              marginRight: 'clamp(60px, 10vw, 140px)',
            }}
          >
            S
          </div>

          {/* 'O' gap — measured after entry animation; black hole snaps here */}
          <div
            ref={gapRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(120px, 20vw, 280px)',
              height: 'clamp(120px, 20vw, 280px)',
              pointerEvents: 'none',
            }}
          />

          {/* ULTECHIES */}
          <div
            ref={ultechiesRef}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              WebkitFontSmoothing: 'antialiased',
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: '#ffffff',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              marginLeft: 'clamp(60px, 10vw, 140px)',
            }}
          >
            ULTECHIES
          </div>
        </div>
      </div>
    </section>
  )
}
