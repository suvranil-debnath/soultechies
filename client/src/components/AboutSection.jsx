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
    //   p < 0.09: Hidden during Hero & Black Hole (guarantees clean refresh at top)
    //   0.09 <= p <= 0.18: Initial staging — Earth in lower-third, metadata fades in
    //   0.18 < p <= 0.25: Text split — leftCol drifts left, rightCol drifts right, fades to 0
    //   p > 0.25: Completely hidden
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        if (!container || !leftCol || !rightCol) return

        if (p < 0.09) {
          // 100% hidden on hero screen / refresh
          container.style.opacity = '0'
          container.style.pointerEvents = 'none'
          leftCol.style.opacity = '0'
          leftCol.style.transform = 'translateY(24px)'
          rightCol.style.opacity = '0'
          rightCol.style.transform = 'translateY(24px)'
        } else if (p <= 0.18) {
          // Stage 1: Fade in with initial Earth staging (9% -> 18%)
          const t = (p - 0.09) / 0.09
          const eased = t * (2 - t) // ease-out
          const opacity = Math.min(1, eased * 1.2)
          const y = (1 - eased) * 24

          container.style.opacity = opacity.toFixed(4)
          container.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'

          leftCol.style.opacity = opacity.toFixed(4)
          leftCol.style.transform = `translateY(${y.toFixed(1)}px)`

          rightCol.style.opacity = opacity.toFixed(4)
          rightCol.style.transform = `translateY(${y.toFixed(1)}px)`
        } else if (p <= 0.25) {
          // Stage 2: Disappear in sync with "ABOUT" & "US" split (18% -> 25%)
          const t = (p - 0.18) / 0.07
          const easeT = t * t
          const opacity = Math.max(0, 1.0 - t * 1.6)

          container.style.opacity = opacity.toFixed(4)
          container.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'

          leftCol.style.opacity = opacity.toFixed(4)
          leftCol.style.transform = `translate(${(-easeT * 50).toFixed(1)}px, ${(-easeT * 20).toFixed(1)}px)`

          rightCol.style.opacity = opacity.toFixed(4)
          rightCol.style.transform = `translate(${(easeT * 50).toFixed(1)}px, ${(-easeT * 20).toFixed(1)}px)`
        } else {
          // Fully gone after 25%
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(24px, 4.5vw, 64px)',
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto',
          paddingTop: 'clamp(10px, 2vh, 28px)',
        }}
      >
        {/* Left Column: 01 / OUR APPROACH */}
        <div ref={leftColRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              fontSize: 'clamp(18px, 1.45vw, 24px)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#00f0ff',
              fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '2px',
            }}
          >
            01 / OUR APPROACH
          </div>
          <p
            style={{
              fontSize: 'clamp(13px, 0.94vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.78)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            We believe great digital experiences start with a great idea. We take your vision, understand what makes your business different, and turn it into something people can see, feel, and connect with.
          </p>
          <p
            style={{
              fontSize: 'clamp(13px, 0.94vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.78)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            From design and technology to the little details that make an experience memorable, we bring everything together to create digital experiences that don't just look good—they have a purpose.
          </p>
          <p
            style={{
              fontSize: 'clamp(13.5px, 0.98vw, 15.5px)',
              fontWeight: 600,
              color: '#ffffff',
              margin: '2px 0 0 0',
              maxWidth: '520px',
              lineHeight: 1.5,
            }}
          >
            You bring the idea. We help bring it to life.
          </p>
        </div>

        {/* Right Column: 02 / OUR VISION */}
        <div ref={rightColRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              fontSize: 'clamp(18px, 1.45vw, 24px)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '2px',
            }}
          >
            02 / OUR VISION
          </div>
          <p
            style={{
              fontSize: 'clamp(13px, 0.94vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.78)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Every business has a story worth sharing. We want to help you tell that story in a way that feels authentic, reaches the right people, and leaves a lasting impression.
          </p>
          <p
            style={{
              fontSize: 'clamp(13px, 0.94vw, 15px)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.78)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            Whether you're just starting out or ready to take things to the next level, we're here to help you build something you're proud of—something that connects with people and grows with your business.
          </p>
          <p
            style={{
              fontSize: 'clamp(13.5px, 0.98vw, 15.5px)',
              fontWeight: 600,
              color: '#ffffff',
              margin: '2px 0 0 0',
              maxWidth: '520px',
              lineHeight: 1.5,
            }}
          >
            Think bigger. Reach further. Build something people remember.
          </p>
        </div>
      </div>
    </div>
  )
}
