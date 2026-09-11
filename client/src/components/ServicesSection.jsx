import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

const SERVICES_DATA = [
  {
    id: '01',
    number: '01',
    category: 'AI-POWERED WEBSITES',
    description: 'Modern, fast and conversion-focused.',
    badge: 'Intelligent Web',
    features: ['Ultra-fast Next.js Architecture', 'Sub-second Load Latency', 'Generative AI Pipelines'],
    accent: '#ffe135',
  },
  {
    id: '02',
    number: '02',
    category: 'WEB APPS',
    description: 'Custom applications built for your workflow.',
    badge: 'Enterprise Scalable',
    features: ['Real-time State Synchronization', 'Reactive Component Engines', 'Hardened Role Auth Systems'],
    accent: '#ffd000',
  },
  {
    id: '03',
    number: '03',
    category: 'MOBILE APPS',
    description: 'Mobile experiences customers love to use.',
    badge: 'iOS & Android Native',
    features: ['Silky 120Hz Gesture UX', 'Offline-first Local Caching', 'Seamless Cross-Platform'],
    accent: '#facc15',
  },
  {
    id: '04',
    number: '04',
    category: 'E-COMMERCE',
    description: 'Stores designed to turn visits into sales.',
    badge: 'High-Conversion Growth',
    features: ['Headless Fast Storefronts', 'Frictionless 1-Click Checkout', 'Global Edge CDN Delivery'],
    accent: '#fbbf24',
  },
]

export default function ServicesSection({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const leftLabelRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const cardRefs = useRef([])

  const [activeStep, setActiveStep] = useState(0)

  // Timeline Milestones:
  // p: 0.25 -> 0.39 (~175vh total travel, snappy ~45vh scroll distance per card transition)
  const START_P = 0.25
  const END_P   = 0.39

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Ensure any previously running instance from HMR is cleanly killed
    ScrollTrigger.getById('services-scroll')?.kill()

    const container = containerRef.current
    const leftLabel = leftLabelRef.current
    const cards = cardRefs.current

    const updateSection = (p) => {
      if (!container) return

      if (p < START_P) {
        container.style.opacity = '0'
        container.style.visibility = 'hidden'
        container.style.pointerEvents = 'none'
        return
      }

      if (p > END_P) {
        container.style.opacity = '0'
        container.style.visibility = 'hidden'
        container.style.pointerEvents = 'none'
        return
      }

      // Inside Services section window (0.25 <= p <= 0.39)
      const t = (p - START_P) / (END_P - START_P) // 0.0 -> 1.0

      // Container fade in & out at boundary edges
      let sectionOpacity = 1.0
      if (t < 0.08) {
        sectionOpacity = t / 0.08
      } else if (t > 0.92) {
        sectionOpacity = (1.0 - t) / 0.08
      }

      container.style.opacity = sectionOpacity.toFixed(4)
      container.style.visibility = 'visible'
      container.style.pointerEvents = sectionOpacity > 0.2 ? 'auto' : 'none'

      // Convert normalized scroll progress t (0.0 -> 1.0) into stepped card progress (0.0 -> 3.0)
      // Each card gets a generous resting plateau so it sits stationary and readable in center.
      // Transition between cards is smooth, crisp, and completely prevents overlapping.
      const rawProgress = t * 3.0
      const segment = Math.min(2, Math.floor(rawProgress))
      const subT = rawProgress - segment

      // Rest plateau: first 28% of each segment rests rock-solid in center
      // Remaining 72% transitions smoothly to next card with hermite easing
      let cardProgress = 0
      if (rawProgress >= 3.0) {
        cardProgress = 3.0
      } else if (subT < 0.28) {
        cardProgress = segment
      } else {
        const transitionP = (subT - 0.28) / 0.72
        const hermite = transitionP * transitionP * (3 - 2 * transitionP)
        cardProgress = segment + hermite
      }

      const currentIdx = Math.min(3, Math.max(0, Math.round(cardProgress)))
      setActiveStep(currentIdx)

      // Generous physical clearance travel distance (580px ensures cards are never close or overlapping)
      const cardTravelDistance = 580

      // Dynamically grab live card DOM elements to prevent any stale refs
      const cardElements = cardsContainerRef.current
        ? Array.from(cardsContainerRef.current.children)
        : (cards || [])

      // Update each card position, scale, opacity, and blur
      cardElements.forEach((cardEl, idx) => {
        if (!cardEl) return

        const delta = idx - cardProgress // delta = 0 when card is in focal center
        const absDelta = Math.abs(delta)
        const yOffset = delta * cardTravelDistance

        // Card scale: 1.0 in center, subtle elegant 0.94 scale for exiting/entering
        const scale = Math.max(0.92, 1.0 - absDelta * 0.08)

        // Strict display and opacity culling: ONLY active and immediately transitioning cards exist
        let opacity = 0
        if (absDelta < 0.65) {
          cardEl.style.display = 'block'
          cardEl.style.visibility = 'visible'
          // Smooth cosine curve for natural luxury fade: 1.0 at center, 0 at 0.65
          const normD = absDelta / 0.65
          opacity = Math.cos(normD * (Math.PI / 2))
        } else {
          cardEl.style.display = 'none'
          cardEl.style.visibility = 'hidden'
          opacity = 0
        }

        // Card blur: crisp in center, subtle soft optical focus during transition
        const blur = Math.min(4, absDelta * 3.0)

        cardEl.style.transform = `translateY(${yOffset.toFixed(1)}px) scale(${scale.toFixed(3)})`
        cardEl.style.opacity = opacity.toFixed(4)
        cardEl.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none'
        cardEl.style.zIndex = Math.round(20 - absDelta * 5)
        cardEl.style.pointerEvents = opacity > 0.7 ? 'auto' : 'none'
      })

      // Vertical "SERVICES" label travels smoothly with the flow
      if (leftLabel) {
        const labelY = (0.5 - t) * 70
        leftLabel.style.transform = `translateY(${labelY.toFixed(1)}px)`
      }
    }

    const st = ScrollTrigger.create({
      id: 'services-scroll',
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => updateSection(self.progress),
    })

    // Immediately run update with current scroll position so changes take effect without waiting for scroll
    const totalH = document.documentElement.scrollHeight - window.innerHeight
    const currentProgress = totalH > 0 ? window.scrollY / totalH : 0
    updateSection(currentProgress)

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
        zIndex: 14,
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* ========================================================================= */}
      {/* LEFT SIDE: COMMANDING "SERVICES" DISPLAY & LARGE COUNTER BESIDE IT         */}
      {/* ========================================================================= */}
      <div
        ref={leftLabelRef}
        style={{
          position: 'absolute',
          left: 'clamp(20px, 3.8vw, 72px)',
          top: 0,
          bottom: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 2.2vw, 36px)',
          willChange: 'transform',
        }}
      >
        {/* 1. Large Vertical "SERVICES" Display (rotated 180deg to left) */}
        <h2
          style={{
            margin: 0,
            padding: 0,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
            fontSize: 'clamp(72px, 9.8vh, 120px)',
            fontWeight: 900,
            letterSpacing: 'clamp(0.08em, 0.12em, 0.16em)',
            textTransform: 'uppercase',
            color: '#ffffff',
            lineHeight: 1,
            textShadow: '0 0 40px rgba(255, 255, 255, 0.35), 0 0 80px rgba(0, 240, 255, 0.15)',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          SERVICES
        </h2>

        {/* 2. Massive Active Step Counter Beside the Text Towards the Center */}
        <div
          style={{
            fontFamily: "'Space Grotesk', monospace",
            fontSize: 'clamp(180px, 24vh, 320px)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            color: 'rgba(255, 255, 255, 0.16)',
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: '0 0 50px rgba(255, 255, 255, 0.08)',
            transition: 'color 0.35s ease',
          }}
        >
          0{activeStep + 1}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: SCROLL-DRIVEN INFINITE FLOW APPLE LIQUID GLASS SERVICE CARDS   */}
      {/* ========================================================================= */}
      <div
        ref={cardsContainerRef}
        style={{
          position: 'absolute',
          right: 'clamp(24px, 5.2vw, 96px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(380px, 31vw, 490px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {SERVICES_DATA.map((service, idx) => (
          <div
            key={service.id}
            ref={(el) => { cardRefs.current[idx] = el }}
            style={{
              position: 'absolute',
              width: '100%',
              display: idx === 0 ? 'block' : 'none',
              opacity: idx === 0 ? 1 : 0,
              transform: idx === 0 ? 'translateY(0px) scale(1)' : `translateY(${idx * 580}px) scale(0.92)`,
              borderRadius: 'clamp(28px, 2.8vw, 36px)',
              // Apple Liquid Glass - Pure frosted obsidian smoked crystal
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.03) 22%, rgba(14, 18, 28, 0.88) 55%, rgba(6, 8, 14, 0.96) 100%)',
              backdropFilter: 'blur(45px) saturate(190%)',
              WebkitBackdropFilter: 'blur(45px) saturate(190%)',
              padding: 'clamp(30px, 3.4vh, 40px) clamp(28px, 2.6vw, 38px)',
              boxSizing: 'border-box',
              color: '#ffffff',
              // True physical meniscus depth: top specular rim, deep ambient shadow, subtle inner reflection
              boxShadow: '0 35px 75px -15px rgba(0, 0, 0, 0.90), 0 16px 36px -16px rgba(0, 0, 0, 0.80), inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.5), inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.12), -6px 0 35px -10px rgba(0, 240, 255, 0.10)',
              willChange: 'transform, opacity, filter',
              border: '1px solid rgba(255, 255, 255, 0.13)',
              borderTop: '1.5px solid rgba(255, 255, 255, 0.38)', // Specular ceiling catch
              borderLeft: '1.2px solid rgba(255, 255, 255, 0.22)',
              overflow: 'hidden',
            }}
          >
            {/* Apple Liquid Glass Gloss Reflection Curve (Top Specular Sheen) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '48%',
                background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 45%, transparent 100%)',
                pointerEvents: 'none',
                borderRadius: 'clamp(28px, 2.8vw, 36px) clamp(28px, 2.8vw, 36px) 0 0',
              }}
            />

            {/* Hairline Prism Light on Top Rim */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75) 50%, transparent)',
                pointerEvents: 'none',
                filter: 'blur(0.4px)',
              }}
            />

            {/* Card Header: Apple Glass Pill Badge & Frosted Circular Action Button */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'clamp(16px, 2.0vh, 22px)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: 'inset 0 1px 0.5px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.35)',
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                }}
              >
                <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700 }}>{service.number}</span>
                <span style={{ opacity: 0.35 }}>/</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.08em' }}>{service.badge}</span>
              </div>

              {/* Decorative Apple-style Liquid Glass Disc Button */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.95 }}>
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>

            {/* Service Title */}
            <h3
              style={{
                position: 'relative',
                zIndex: 1,
                margin: '0 0 clamp(10px, 1.4vh, 14px) 0',
                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                fontSize: 'clamp(21px, 1.7vw, 26px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.24,
                color: '#ffffff',
              }}
            >
              {service.category}
            </h3>

            {/* Service Description */}
            <p
              style={{
                position: 'relative',
                zIndex: 1,
                margin: '0 0 clamp(18px, 2.2vh, 26px) 0',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(13.5px, 0.96vw, 15px)',
                fontWeight: 400,
                lineHeight: 1.62,
                color: 'rgba(255, 255, 255, 0.72)',
                letterSpacing: '-0.01em',
              }}
            >
              {service.description}
            </p>

            {/* Feature Mini Chips in Apple Frosted Glass Capsules */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {service.features.map((feat) => (
                <span
                  key={feat}
                  style={{
                    display: 'inline-block',
                    padding: '5px 13px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 2px 6px rgba(0, 0, 0, 0.25)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.88)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
