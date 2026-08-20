import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Scroll-driven Reveal & Exit: Fades in with ABOUT US staging (20% -> 36%)
    // and disappears in perfect sync when ABOUT and US split & exit (38% -> 56%)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: '20% top',
        end: '56% top',
        scrub: 1.0,
      },
    })

    // 1. Fade in during initial staging (20% -> 36%)
    scrollTl.fromTo(
      containerRef.current,
      { opacity: 0, pointerEvents: 'none' },
      { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' },
      0
    )

    scrollTl.fromTo(
      [leftColRef.current, rightColRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      0
    )

    // 2. Disappear in perfect sync with "ABOUT" & "US" split (38% -> 56%)
    scrollTl.to(
      leftColRef.current,
      { x: -50, y: -20, opacity: 0, duration: 0.45, ease: 'power2.in' },
      0.55
    )

    scrollTl.to(
      rightColRef.current,
      { x: 50, y: -20, opacity: 0, duration: 0.45, ease: 'power2.in' },
      0.55
    )

    scrollTl.to(
      containerRef.current,
      { opacity: 0, pointerEvents: 'none', duration: 0.45, ease: 'power2.in' },
      0.55
    )

    return () => {
      scrollTl.kill()
    }
  }, [isPreloaderDone])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 12,
        pointerEvents: 'none',
        opacity: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(24px, 4vw, 48px) clamp(24px, 6vw, 80px)',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Top 2-Column Info / Metadata */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(20px, 4vw, 60px)',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: 'clamp(10px, 2vh, 30px)',
        }}
      >
        {/* Left Column */}
        <div ref={leftColRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#00f0ff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            01 / DIGITAL FRONTIERS
          </div>
          <p
            style={{
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0,
              maxWidth: '420px',
            }}
          >
            Engineering hyper-dimensional web architectures and relativistic real-time visual computing pipelines.
          </p>
        </div>

        {/* Right Column */}
        <div ref={rightColRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            02 / SPATIAL IMMERSION
          </div>
          <p
            style={{
              fontSize: 'clamp(13px, 1.1vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0,
              maxWidth: '420px',
            }}
          >
            Transcending conventional digital interfaces through holographic 3D spatial simulations and dynamic interaction.
          </p>
        </div>
      </div>
    </div>
  )
}
