import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { Application } from '@splinetool/runtime'

gsap.registerPlugin(ScrollTrigger)

// Auto-discover all client logo SVGs from /public/logos/ dynamically without hardcoding names
const logoFiles = import.meta.glob('/public/logos/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Extract clean brand names & URLs
const CLIENT_LOGOS = Object.entries(logoFiles).map(([path, url]) => {
  const filename = path.split('/').pop().replace('.svg', '')
  // Clean up filename (e.g. "airbnb-2-logo-svgrepo-com" -> "AIRBNB")
  const brandName = filename
    .replace(/-logo|-svgrepo|-com|-[0-9]+/g, '')
    .replace(/-icon/g, '')
    .toUpperCase()
  return {
    id: path,
    name: brandName || 'CLIENT',
    url: url || path.replace('/public', ''),
  }
})

// Fallback in case globbing returned empty array
const FALLBACK_LOGOS = [
  { id: '1', name: 'AIRBNB', url: '/logos/airbnb-2-logo-svgrepo-com.svg' },
  { id: '2', name: 'AMAZON', url: '/logos/amazon-icon-logo-svgrepo-com.svg' },
  { id: '3', name: 'APPLE', url: '/logos/apple-logo-svgrepo-com.svg' },
  { id: '4', name: 'ETHEREUM', url: '/logos/ethereum-logo-svgrepo-com.svg' },
  { id: '5', name: 'FACEBOOK', url: '/logos/facebook-icon-logo-svgrepo-com.svg' },
  { id: '6', name: 'GOOGLE', url: '/logos/google-icon-logo-svgrepo-com.svg' },
  { id: '7', name: 'NETFLIX', url: '/logos/netflix-2-logo-svgrepo-com.svg' },
  { id: '8', name: 'TINDER', url: '/logos/tinder-1-logo-svgrepo-com.svg' },
  { id: '9', name: 'YOUTUBE', url: '/logos/youtube-icon-logo-svgrepo-com.svg' },
]

const LOGOS_LIST = CLIENT_LOGOS.length > 0 ? CLIENT_LOGOS : FALLBACK_LOGOS

// Duplicate list for seamless unbroken horizontal loop
const MARQUEE_LOGOS = [...LOGOS_LIST, ...LOGOS_LIST, ...LOGOS_LIST]

export default function WorkedWithSection({ isPreloaderDone }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const splineAppRef = useRef(null)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)

  // Mouse tracking state for 3D model look-at
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  // Initialize Spline 3D Application
  useEffect(() => {
    if (!canvasRef.current || splineAppRef.current) return

    const canvas = canvasRef.current
    const app = new Application(canvas)
    splineAppRef.current = app

    // Load local splinecode first, fall back to remote URL if needed
    app
      .load('/models/scene.splinecode')
      .then(() => {
        console.log('[Spline 3D] Local scene.splinecode loaded successfully')
        setSplineLoaded(true)
      })
      .catch((err) => {
        console.warn('[Spline 3D] Local file load failed, attempting remote Spline URL...', err)
        app
          .load('https://prod.spline.design/ZqSzx3r6ehx5gmPD/scene.splinecode')
          .then(() => {
            console.log('[Spline 3D] Remote Spline scene loaded successfully')
            setSplineLoaded(true)
          })
          .catch((remoteErr) => {
            console.error('[Spline 3D] Failed to load Spline scene:', remoteErr)
          })
      })

    return () => {
      if (splineAppRef.current) {
        try {
          splineAppRef.current.dispose?.()
        } catch (e) {
          // ignore cleanup errors
        }
        splineAppRef.current = null
      }
    }
  }, [])

  // Real-time smooth cursor tracking with lerping / damping
  useEffect(() => {
    const handlePointerMove = (e) => {
      // Normalize mouse to [-1, 1] relative to viewport
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseTargetRef.current = { x, y }

      // Also forward real pointer events directly to the Spline canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const syntheticEvent = new PointerEvent(e.type, e)
          canvasRef.current.dispatchEvent(syntheticEvent)
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // Damped animation loop for natural organic look-at motion
    const animateLookAt = () => {
      const target = mouseTargetRef.current
      const curr = mouseCurrentRef.current

      // Lerp with 0.08 damping factor
      curr.x += (target.x - curr.x) * 0.08
      curr.y += (target.y - curr.y) * 0.08

      // If the Spline app has variables or look-at objects, update them
      if (splineAppRef.current) {
        try {
          splineAppRef.current.setVariable?.('mouseX', curr.x)
          splineAppRef.current.setVariable?.('mouseY', curr.y)
        } catch (e) {
          // variable not defined in this scene, ignore
        }
      }

      rafRef.current = requestAnimationFrame(animateLookAt)
    }

    rafRef.current = requestAnimationFrame(animateLookAt)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Scroll Trigger Choreography:
  //   - p < 0.85: Completely offscreen at Y = 100%
  //   - p 0.85 -> 0.94: Stage slides straight up (Y: 100% -> 0%) over pinned Project Showcase
  //   - p >= 0.94: Stage locked in full view with interactive 3D robot & active marquee
  useEffect(() => {
    if (!isPreloaderDone || !stageRef.current) return

    const stage = stageRef.current

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress

        if (p < 0.85) {
          stage.style.transform = 'translateY(100%)'
          stage.style.opacity = '0'
          stage.style.visibility = 'hidden'
          stage.style.pointerEvents = 'none'
        } else if (p <= 0.94) {
          const t = (p - 0.85) / 0.09
          // Smooth cubic ease-out
          const eased = 1 - Math.pow(1 - t, 2.5)
          const translateY = (100 * (1 - eased)).toFixed(2)

          stage.style.transform = `translateY(${translateY}%)`
          stage.style.opacity = '1' // 100% fully opaque solid cover at all times!
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = t > 0.4 ? 'auto' : 'none'
        } else {
          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'
        }
      },
    })

    return () => st.kill()
  }, [isPreloaderDone])

  return (
    <section
      ref={stageRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 30, // Sits on top of ProjectShowcase (z-index 20)
        backgroundColor: '#030712',
        color: '#ffffff',
        transform: 'translateY(100%)',
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        boxSizing: 'border-box',
        boxShadow: '0 -24px 80px rgba(0, 0, 0, 1)',
      }}
    >
      {/* ========================================================================= */}
      {/* LAYER 0: Background Ambient Glow Accents                                  */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(0, 240, 255, 0.07) 0%, rgba(3, 7, 18, 0.95) 75%, #030712 100%)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '75vw',
          height: '50vh',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.10) 0%, rgba(56, 189, 248, 0.03) 50%, transparent 80%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 1: GIANT "WORKED WITH" TYPOGRAPHY BEHIND THE 3D ROBOT              */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          textAlign: 'center',
          zIndex: 1, // Sits BEHIND the Spline 3D canvas (z-index 2)
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <h2
          style={{
            fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
            fontSize: 'clamp(64px, 12.5vw, 210px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            margin: 0,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: 'rgba(255, 255, 255, 0.12)',
            textShadow: '0 0 80px rgba(0, 240, 255, 0.25)',
          }}
        >
          WORKED <span style={{ color: 'rgba(0, 240, 255, 0.35)', textShadow: '0 0 100px rgba(0, 240, 255, 0.6)' }}>WITH</span>
        </h2>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: INTERACTIVE SPLINE 3D ROBOT CANVAS (Sits in front of text)       */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 2, // Sits IN FRONT of the WORKED WITH text
          transform: 'scale(0.94) translateY(20%)',
          transformOrigin: 'center center',
        }}
      >
        {/* Loading Spinner / Skeleton before 3D loads */}
        {!splineLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: 'rgba(0, 240, 255, 0.7)',
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 240, 255, 0.2)',
                borderTopColor: '#00f0ff',
                animation: 'spin 1s linear infinite',
              }}
            />
            INITIALIZING 3D NEURAL ROBOT...
          </div>
        )}

        {/* Spline 3D WebGL Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            outline: 'none',
            opacity: splineLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
            cursor: 'grab',
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: TOP UPPER AREA - SLEEK CONTINUOUS BRAND MARQUEE RIBBON           */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          width: '100%',
          paddingTop: 'clamp(32px, 4.5vh, 56px)',
          paddingBottom: '36px',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div
          className="logo-marquee-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(68px, 8.5vw, 130px)',
            width: 'max-content',
            animation: 'marqueeScroll 28s linear infinite',
          }}
        >
          {MARQUEE_LOGOS.map((logo, idx) => {
            const isHovered = hoveredLogo === `${logo.id}-${idx}`
            return (
              <div
                key={`${logo.id}-${idx}`}
                onMouseEnter={() => setHoveredLogo(`${logo.id}-${idx}`)}
                onMouseLeave={() => setHoveredLogo(null)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'scale(1.15)' : 'scale(1.0)',
                }}
              >
                {/* Soft ambient radial glow underlay on hover (zero hard clipping) */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-10px -20px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(0, 240, 255, 0.05) 55%, transparent 75%)',
                      filter: 'blur(16px)',
                      pointerEvents: 'none',
                      zIndex: -1,
                    }}
                  />
                )}
                <img
                  src={logo.url}
                  alt={logo.name}
                  loading="eager"
                  style={{
                    height: 'clamp(60px, 7.5vh, 84px)',
                    maxWidth: '220px',
                    objectFit: 'contain',
                    filter: isHovered
                      ? 'brightness(0) invert(1) opacity(1) drop-shadow(0 0 12px rgba(0, 240, 255, 0.9))'
                      : 'brightness(0) invert(1) opacity(0.55)',
                    transition: 'filter 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Marquee and Spinner Keyframes */}
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .logo-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
