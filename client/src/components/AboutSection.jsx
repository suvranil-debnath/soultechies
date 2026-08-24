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

    const container = containerRef.current
    const leftCol = leftColRef.current
    const rightCol = rightColRef.current

    // Synchronized Scroll Control (matches Scene.jsx):
    //   p < 0.12: Hidden during Hero & Black Hole (guarantees clean refresh at top)
    //   0.12 <= p <= 0.24: Initial staging — Earth in lower-third, metadata fades in
    //   0.24 < p <= 0.36: Text split — leftCol drifts left, rightCol drifts right, fades to 0
    //   p > 0.36: Completely hidden
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        if (!container || !leftCol || !rightCol) return

        if (p < 0.12) {
          // 100% hidden on hero screen / refresh
          container.style.opacity = '0'
          container.style.pointerEvents = 'none'
          leftCol.style.opacity = '0'
          leftCol.style.transform = 'translateY(24px)'
          rightCol.style.opacity = '0'
          rightCol.style.transform = 'translateY(24px)'
        } else if (p <= 0.24) {
          // Stage 1: Fade in with initial Earth staging (12% -> 24%)
          const t = (p - 0.12) / 0.12
          const eased = t * (2 - t) // ease-out
          const opacity = Math.min(1, eased * 1.2)
          const y = (1 - eased) * 24

          container.style.opacity = opacity.toFixed(4)
          container.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'

          leftCol.style.opacity = opacity.toFixed(4)
          leftCol.style.transform = `translateY(${y.toFixed(1)}px)`

          rightCol.style.opacity = opacity.toFixed(4)
          rightCol.style.transform = `translateY(${y.toFixed(1)}px)`
        } else if (p <= 0.36) {
          // Stage 2: Disappear in sync with "ABOUT" & "US" split (24% -> 36%)
          const t = (p - 0.24) / 0.12
          const easeT = t * t
          const opacity = Math.max(0, 1.0 - t * 1.6)

          container.style.opacity = opacity.toFixed(4)
          container.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'

          leftCol.style.opacity = opacity.toFixed(4)
          leftCol.style.transform = `translate(${(-easeT * 50).toFixed(1)}px, ${(-easeT * 20).toFixed(1)}px)`

          rightCol.style.opacity = opacity.toFixed(4)
          rightCol.style.transform = `translate(${(easeT * 50).toFixed(1)}px, ${(-easeT * 20).toFixed(1)}px)`
        } else {
          // Fully gone after 36%
          container.style.opacity = '0'
          container.style.pointerEvents = 'none'
          leftCol.style.opacity = '0'
          rightCol.style.opacity = '0'
        }
      },
    })

    return () => {
      st.kill()
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
