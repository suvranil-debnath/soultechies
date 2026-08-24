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
  const modelWrapperRef = useRef(null)
  const marqueeWrapperRef = useRef(null)
  const titleWrapperRef = useRef(null)
  const blockerRef = useRef(null)

  const [splineLoaded, setSplineLoaded] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)

  // Mouse tracking state for 3D model look-at
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  // When isDivingRef = true, cursor tracking is disengaged and robot lerps to neutral (0, 0)
  const isDivingRef = useRef(false)
  const rafRef = useRef(null)

  const splineObjectsRef = useRef([])

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
        try {
          splineObjectsRef.current = app.getAllObjects ? app.getAllObjects() : []
        } catch (e) {}
      })
      .catch((err) => {
        console.warn('[Spline 3D] Local file load failed, attempting remote Spline URL...', err)
        app
          .load('https://prod.spline.design/ZqSzx3r6ehx5gmPD/scene.splinecode')
          .then(() => {
            console.log('[Spline 3D] Remote Spline scene loaded successfully')
            setSplineLoaded(true)
            try {
              splineObjectsRef.current = app.getAllObjects ? app.getAllObjects() : []
            } catch (e) {}
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

  // Real-time smooth cursor tracking with lerping / damping + Capturing Blocker when diving
  useEffect(() => {
    // Capturing-phase blocker: when diving, intercepts and terminates all pointer/mouse events
    // before they can ever reach Spline's canvas or runtime event listeners
    const handleCapturePointer = (e) => {
      if (isDivingRef.current) {
        if (!e.__isSyntheticReset) {
          e.stopImmediatePropagation()
          e.stopPropagation()
        }
      }
    }

    window.addEventListener('pointermove', handleCapturePointer, true)
    window.addEventListener('mousemove', handleCapturePointer, true)
    document.addEventListener('pointermove', handleCapturePointer, true)
    document.addEventListener('mousemove', handleCapturePointer, true)

    const handlePointerMove = (e) => {
      // If diving/zoomed in, ignore all cursor movement — robot remains completely still
      if (isDivingRef.current) return

      // Normalize mouse to [-1, 1] relative to viewport
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseTargetRef.current = { x, y }

      // Forward real pointer events directly to the Spline canvas when interactive
      if (canvasRef.current && !isDivingRef.current) {
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
      const isDiving = isDivingRef.current
      const target = isDiving ? { x: 0, y: 0 } : mouseTargetRef.current
      const curr = mouseCurrentRef.current

      // When diving: instantly lock to exact dead-center (0, 0) — zero movement
      if (isDiving) {
        curr.x = 0
        curr.y = 0
        mouseTargetRef.current = { x: 0, y: 0 }
      } else {
        curr.x += (target.x - curr.x) * 0.08
        curr.y += (target.y - curr.y) * 0.08
      }

      // Feed coordinates to the Spline scene's variable bindings
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
      window.removeEventListener('pointermove', handleCapturePointer, true)
      window.removeEventListener('mousemove', handleCapturePointer, true)
      document.removeEventListener('pointermove', handleCapturePointer, true)
      document.removeEventListener('mousemove', handleCapturePointer, true)
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // =========================================================================
  // MASTER SCROLL TRIGGER CHOREOGRAPHY (960vh timeline):
  //
  //  p: 0.00 → 0.73  — Offscreen (behind Project Showcase)
  //  p: 0.73 → 0.78  — Stage slides up (Y: 100% → 0%) as 100% opaque cover
  //  p: 0.78 → 0.88  — WORKED WITH stage fully pinned; interactive 3D robot + marquee active
  //  p: 0.88 → 0.94  — Phase A: Marquee + typography exit upward; cursor disengaged; robot lerps to neutral
  //  p: 0.94 → 1.00  — Phase B: Aggressive camera zoom, robot face fills 100% viewport
  // =========================================================================
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

        const modelWrapper = modelWrapperRef.current
        const marqueeWrapper = marqueeWrapperRef.current
        const titleWrapper = titleWrapperRef.current
        const blocker = blockerRef.current

        // ─── PHASE 0: Completely offscreen ─────────────────────────────────
        if (p < 0.73) {
          stage.style.transform = 'translateY(100%)'
          stage.style.opacity = '0'
          stage.style.visibility = 'hidden'
          stage.style.pointerEvents = 'none'
          isDivingRef.current = false
          if (blocker) blocker.style.pointerEvents = 'none'

          // Reset all sub-layers to their resting state
          if (modelWrapper) {
            modelWrapper.style.transform = 'scale(0.84) translateY(15%)'
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
          }
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(0px)'
            marqueeWrapper.style.opacity = '1'
          }
          if (titleWrapper) {
            titleWrapper.style.transform = 'translate(-50%, -50%)'
            titleWrapper.style.opacity = '1'
          }

        // ─── PHASE 1: Slide-up curtain over Project Showcase ───────────────
        } else if (p <= 0.78) {
          const t = (p - 0.73) / 0.05
          const eased = 1 - Math.pow(1 - t, 2.5)
          const translateY = (100 * (1 - eased)).toFixed(2)

          stage.style.transform = `translateY(${translateY}%)`
          stage.style.opacity = '1'       // Fully opaque — no see-through at any point!
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = t > 0.5 ? 'auto' : 'none'
          isDivingRef.current = false
          if (blocker) blocker.style.pointerEvents = 'none'

          if (modelWrapper) {
            modelWrapper.style.transform = 'scale(0.84) translateY(15%)'
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
          }
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(0px)'
            marqueeWrapper.style.opacity = '1'
          }
          if (titleWrapper) {
            titleWrapper.style.transform = 'translate(-50%, -50%)'
            titleWrapper.style.opacity = '1'
          }

        // ─── PHASE 2: Stage pinned — interactive 3D robot + marquee ────────
        } else if (p <= 0.88) {
          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'
          isDivingRef.current = false
          if (blocker) blocker.style.pointerEvents = 'none'

          if (canvasRef.current) {
            canvasRef.current.style.pointerEvents = 'auto'
          }
          if (modelWrapper) {
            modelWrapper.style.transform = 'scale(0.84) translateY(15%)'
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
            modelWrapper.style.pointerEvents = 'auto'
          }
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(0px)'
            marqueeWrapper.style.opacity = '1'
          }
          if (titleWrapper) {
            titleWrapper.style.transform = 'translate(-50%, -50%)'
            titleWrapper.style.opacity = '1'
          }

        // ─── PHASE A: UI Dismissal + Cursor Disengage + Robot Re-Center ────
        // Marquee ribbon + typography slide upward off-screen and fade out.
        // Cursor tracking locks to neutral dead-center (robot faces forward).
        } else if (p <= 0.94) {
          const t = (p - 0.88) / 0.06
          const hermite = t * t * (3 - 2 * t)  // smooth hermite ease

          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'

          // Engage dive mode — cursor tracking disengages, robot freezes still
          isDivingRef.current = true
          if (blocker) blocker.style.pointerEvents = 'all'

          if (canvasRef.current) {
            canvasRef.current.style.pointerEvents = 'none'
          }

          // Marquee slides upward off-screen and fades out
          const marqueeExitY = -(hermite * 110).toFixed(1)
          const marqueeOp = Math.max(0, 1 - hermite * 2).toFixed(3)
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = `translateY(${marqueeExitY}px)`
            marqueeWrapper.style.opacity = marqueeOp
          }

          // Typography also exits upward
          const titleExitY = -(hermite * 80).toFixed(1)
          const titleOp = Math.max(0, 1 - hermite * 2.5).toFixed(3)
          if (titleWrapper) {
            titleWrapper.style.transform = `translate(-50%, calc(-50% + ${titleExitY}px))`
            titleWrapper.style.opacity = titleOp
          }

          // Robot holds resting position — neutral locked
          if (modelWrapper) {
            modelWrapper.style.transform = 'scale(0.84) translateY(15%)'
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
            modelWrapper.style.pointerEvents = 'none'
          }

        // ─── PHASE B: Robot Face Screen Zoom — Fills Viewport & Stays Still ───
        // The robot's face monitor screen scales up smoothly to fill the screen.
        // It stays perfectly centered, completely still, and never disappears.
        } else {
          const t = (p - 0.94) / 0.06
          const zoomEase = t * (2 - t)  // smooth ease-out

          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'
          isDivingRef.current = true
          if (blocker) blocker.style.pointerEvents = 'all'

          if (canvasRef.current) {
            canvasRef.current.style.pointerEvents = 'none'
          }

          // Marquee and title stay hidden
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(-110px)'
            marqueeWrapper.style.opacity = '0'
          }
          if (titleWrapper) {
            titleWrapper.style.opacity = '0'
          }

          // Robot face zoom: scale 0.84 → 3.88 (a bit bigger to fill screen)
          // translateY shifts upward from 15% to 8.5%, translateX adjusted slightly right to -1.1vw
          const scale = (0.84 + zoomEase * 3.04).toFixed(3)
          const ty = (15.0 - zoomEase * 6.5).toFixed(2)
          const tx = (-zoomEase * 1.1).toFixed(2)

          if (modelWrapper) {
            modelWrapper.style.transform = `scale(${scale}) translateX(${tx}vw) translateY(${ty}%)`
            modelWrapper.style.transformOrigin = '50% 33.5%'  // Center of the robot face screen
            modelWrapper.style.opacity = '1' // DO NOT disappear — stays 100% visible!
            modelWrapper.style.pointerEvents = 'none'
          }
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
        ref={titleWrapperRef}
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
          willChange: 'transform, opacity',
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
        ref={modelWrapperRef}
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
          transform: 'scale(0.84) translateY(15%)',
          transformOrigin: '50% 33.5%',
          willChange: 'transform, opacity',
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

        {/* Invisible blocker shield: absorbs and intercepts all pointer events when diving */}
        <div
          ref={blockerRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
          }}
          onPointerMove={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: TOP UPPER AREA - SLEEK CONTINUOUS BRAND MARQUEE RIBBON           */}
      {/* ========================================================================= */}
      <div
        ref={marqueeWrapperRef}
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
          willChange: 'transform, opacity',
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
