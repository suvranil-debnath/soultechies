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

const SERVICES = [
  '3D Web Experiences',
  'Full-Stack Web App',
  'AI & Automation',
  'UI/UX & Branding',
  'Custom Architecture',
]

export default function WorkedWithSection({ isPreloaderDone }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const splineAppRef = useRef(null)
  const modelWrapperRef = useRef(null)
  const marqueeWrapperRef = useRef(null)
  const titleWrapperRef = useRef(null)
  const formWrapperRef = useRef(null)
  const formCardRef = useRef(null)

  const [splineLoaded, setSplineLoaded] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    selectedServices: ['3D Web Experiences'],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mouse tracking state for 3D model look-at
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  // Toggle Service Selection
  const toggleService = (service) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(service)
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== service)
          : [...prev.selectedServices, service],
      }
    })
  }

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1200)
  }

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

      // Forward pointer events to Spline canvas for responsive 3D interactive head motion
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

      // Smooth damped lerp toward cursor
      curr.x += (target.x - curr.x) * 0.08
      curr.y += (target.y - curr.y) * 0.08

      // Feed coordinates to the Spline scene's variable bindings
      if (splineAppRef.current) {
        try {
          splineAppRef.current.setVariable?.('mouseX', curr.x)
          splineAppRef.current.setVariable?.('mouseY', curr.y)
        } catch (e) {
          // variable not defined in this scene, ignore
        }
      }

      // Synchronize form tilt and angle precisely with the robot's 3D head roll, yaw, and pitch
      if (formCardRef.current) {
        const rotZ = (curr.x * 0.9).toFixed(2)    // Head roll (matches subtle bezel tilt)
        const rotY = (curr.x * 1.4).toFixed(2)    // Subtle yaw
        const rotX = (curr.y * 1.0).toFixed(2)    // Vertical pitch
        const transX = (curr.x * 3.5).toFixed(1)  // Parallax horizontal micro-shift
        const transY = (-curr.y * 2.5).toFixed(1) // Parallax vertical micro-shift

        formCardRef.current.style.transform = `perspective(1800px) translate3d(${transX}px, ${transY}px, 0px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) rotateX(${rotX}deg)`
      }

      rafRef.current = requestAnimationFrame(animateLookAt)
    }

    rafRef.current = requestAnimationFrame(animateLookAt)

    return () => {
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
  //  p: 0.88 → 0.94  — Phase A: Marquee + typography exit upward
  //  p: 0.94 → 1.00  — Phase B: Robot screen zooms in & Contact Form reveals on robot's face
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
        const formWrapper = formWrapperRef.current

        // ─── PHASE 0: Completely offscreen ─────────────────────────────────
        if (p < 0.73) {
          stage.style.transform = 'translateY(100%)'
          stage.style.opacity = '0'
          stage.style.visibility = 'hidden'
          stage.style.pointerEvents = 'none'

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
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
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
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }

        // ─── PHASE 2: Stage pinned — interactive 3D robot + marquee ────────
        } else if (p <= 0.88) {
          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'

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
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }

        // ─── PHASE A: UI Dismissal (Marquee + Title exit up) ──────────────
        } else if (p <= 0.91) {
          const t = (p - 0.86) / 0.05
          const hermite = t * t * (3 - 2 * t)  // smooth hermite ease

          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'

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

          if (modelWrapper) {
            modelWrapper.style.transform = 'scale(0.84) translateY(15%)'
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
          }
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }

        // ─── PHASE B: Robot Screen Zoom & Contact Form Reveal on Face ───────
        } else {
          const rawT = (p - 0.91) / 0.04
          const t = Math.min(1.0, Math.max(0, rawT))
          const zoomEase = t * (2 - t)  // smooth ease-out

          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'

          // Marquee and title stay hidden
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(-110px)'
            marqueeWrapper.style.opacity = '0'
          }
          if (titleWrapper) {
            titleWrapper.style.opacity = '0'
          }

          // Robot face zoom: scale 0.84 → 3.88
          const scale = (0.84 + zoomEase * 3.04).toFixed(3)
          const ty = (15.0 - zoomEase * 6.5).toFixed(2)
          const tx = (-zoomEase * 1.1).toFixed(2)

          if (modelWrapper) {
            modelWrapper.style.transform = `scale(${scale}) translateX(${tx}vw) translateY(${ty}%)`
            modelWrapper.style.transformOrigin = '50% 33.5%'
            modelWrapper.style.opacity = '1'
          }

          // Contact Form on Robot Screen: fades and scales in as zoom completes
          if (formWrapper) {
            const formT = Math.max(0, (t - 0.15) / 0.85)
            const formEase = formT * (2 - formT)
            const formOp = Math.min(1.0, formEase * 1.25).toFixed(3)
            const formY = (24 * (1 - formEase)).toFixed(1)
            const formScale = (0.94 + formEase * 0.06).toFixed(3)

            formWrapper.style.opacity = formOp
            formWrapper.style.transform = `translate(calc(-50% + ${tx}vw), calc(-50% + ${formY}px)) scale(${formScale})`
            formWrapper.style.pointerEvents = formEase > 0.5 ? 'auto' : 'none'
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
          background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(168, 85, 247, 0.08) 0%, rgba(3, 7, 18, 0.95) 75%, #030712 100%)',
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
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.04) 50%, transparent 80%)',
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
            textShadow: '0 0 80px rgba(168, 85, 247, 0.25)',
          }}
        >
          WORKED <span style={{ color: 'rgba(168, 85, 247, 0.35)', textShadow: '0 0 100px rgba(168, 85, 247, 0.6)' }}>WITH</span>
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
              color: 'rgba(168, 85, 247, 0.8)',
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid rgba(168, 85, 247, 0.2)',
                borderTopColor: '#a855f7',
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
                      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.05) 55%, transparent 75%)',
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
                      ? 'brightness(0) invert(1) opacity(1) drop-shadow(0 0 12px rgba(168, 85, 247, 0.9))'
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

      {/* ========================================================================= */}
      {/* LAYER 4: ROBOT MONITOR SCREEN DISPLAY — INTERACTIVE CONTACT US FORM       */}
      {/* ========================================================================= */}
      <div
        ref={formWrapperRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 25,
          width: 'clamp(340px, 92vw, 840px)',
          maxHeight: '86vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          willChange: 'transform, opacity',
        }}
      >
        {/* The Robot's Screen Monitor Card (100% Solid Opaque Backdrop) */}
        <div
          ref={formCardRef}
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#07071c',
            background: 'radial-gradient(135% 100% at 50% 0%, #1c113e 0%, #0d0a27 45%, #060618 100%)',
            border: '1px solid rgba(168, 85, 247, 0.42)',
            borderRadius: 'clamp(24px, 3.5vw, 40px)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            padding: 'clamp(22px, 3.4vh, 38px) clamp(22px, 3.8vw, 46px)',
            overflowY: 'auto',
            maxHeight: '82vh',
            boxSizing: 'border-box',
            willChange: 'transform',
          }}
        >
          {/* Subtle Cyber CRT Scanlines Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(168, 85, 247, 0.04) 50%)',
              backgroundSize: '100% 4px',
              zIndex: 0,
            }}
          />

          {/* Top Status Header */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(168, 85, 247, 0.22)',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'rgba(192, 132, 252, 0.9)',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#a855f7',
                  boxShadow: '0 0 10px #a855f7, 0 0 20px #ec4899',
                  animation: 'pulseGlow 2s infinite',
                }}
              />
              NEURAL INTERFACE // READY
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '10px' }}>
              SYS.LOC: KOLKATA [22.57° N]
            </div>
          </div>

          {/* Screen Title & Subtitle */}
          <div style={{ position: 'relative', marginBottom: '20px', zIndex: 1 }}>
            <h3
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                margin: '0 0 6px 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              INITIALIZE TRANSMISSION
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(12px, 1.2vw, 14px)',
                color: 'rgba(255, 255, 255, 0.65)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Have a visionary project? Transmit your directive directly to our core.
            </p>
          </div>

          {isSubmitted ? (
            /* Success Feedback State */
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '36px 16px',
                textAlign: 'center',
                gap: '14px',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: '#130d2d',
                  border: '1px solid rgba(168, 85, 247, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                TRANSMISSION ENCRYPTED & RECEIVED
              </h4>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.65)',
                  maxWidth: '380px',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Your transmission has been linked to our neural network. Our architects will contact you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ name: '', email: '', message: '', selectedServices: ['3D Web Experiences'] })
                }}
                style={{
                  marginTop: '10px',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  background: '#150f33',
                  color: '#d8b4fe',
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#21164e'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#150f33'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                TRANSMIT ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
              {/* Row 1: Name & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {/* Identifier / Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontFamily: "'Space Grotesk', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.16em',
                      color: 'rgba(192, 132, 252, 0.9)',
                      textTransform: 'uppercase',
                    }}
                  >
                    IDENTIFIER / NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    style={{
                      padding: '13px 16px',
                      borderRadius: '12px',
                      background: '#0a081e',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#ffffff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#a855f7'
                      e.target.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.35)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Comms / Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    style={{
                      fontFamily: "'Space Grotesk', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.16em',
                      color: 'rgba(192, 132, 252, 0.9)',
                      textTransform: 'uppercase',
                    }}
                  >
                    COMMS / EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.com"
                    style={{
                      padding: '13px 16px',
                      borderRadius: '12px',
                      background: '#0a081e',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#ffffff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#a855f7'
                      e.target.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.35)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Service Selection Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: 'rgba(192, 132, 252, 0.9)',
                    textTransform: 'uppercase',
                  }}
                >
                  TARGET SCOPE / EXPERTISE
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SERVICES.map((service) => {
                    const isSelected = formData.selectedServices.includes(service)
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '999px',
                          border: isSelected
                            ? '1px solid #c084fc'
                            : '1px solid rgba(168, 85, 247, 0.26)',
                          background: isSelected
                            ? 'linear-gradient(135deg, #581c87 0%, #831843 100%)'
                            : '#0c0a22',
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          boxShadow: isSelected ? '0 0 16px rgba(168, 85, 247, 0.35)' : 'none',
                        }}
                      >
                        {isSelected && <span style={{ marginRight: '5px', color: '#d8b4fe' }}>✓</span>}
                        {service}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Row 3: Message / Payload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: 'rgba(192, 132, 252, 0.9)',
                    textTransform: 'uppercase',
                  }}
                >
                  TRANSMISSION PAYLOAD / MESSAGE
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline your vision, timeline, questions or project requirements..."
                  style={{
                    padding: '13px 16px',
                    borderRadius: '12px',
                    background: '#0a081e',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#ffffff',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '13px',
                    lineHeight: 1.4,
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a855f7'
                    e.target.style.boxShadow = '0 0 16px rgba(168, 85, 247, 0.35)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Row 4: Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '6px',
                  padding: '15px 32px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #00f0ff 100%)',
                  color: '#ffffff',
                  fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.55), 0 0 20px rgba(0, 240, 255, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: isSubmitting ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 42px rgba(124, 58, 237, 0.75), 0 0 30px rgba(0, 240, 255, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(124, 58, 237, 0.55), 0 0 20px rgba(0, 240, 255, 0.3)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    TRANSMITTING PAYLOAD...
                  </>
                ) : (
                  <>
                    TRANSMIT DIRECTIVE
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Marquee, Pulsing and Spinner Keyframes */}
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
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
      `}</style>
    </section>
  )
}
