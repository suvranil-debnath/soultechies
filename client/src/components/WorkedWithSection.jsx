import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { Application } from '@splinetool/runtime'

gsap.registerPlugin(ScrollTrigger)

// Client logo SVGs served directly from public directory (/logos/...)
const CLIENT_LOGOS = [
  { id: 'airbnb', name: 'AIRBNB', url: '/logos/airbnb-2-logo-svgrepo-com.svg' },
  { id: 'amazon', name: 'AMAZON', url: '/logos/amazon-icon-logo-svgrepo-com.svg' },
  { id: 'apple', name: 'APPLE', url: '/logos/apple-logo-svgrepo-com.svg' },
  { id: 'ethereum', name: 'ETHEREUM', url: '/logos/ethereum-logo-svgrepo-com.svg' },
  { id: 'facebook', name: 'FACEBOOK', url: '/logos/facebook-icon-logo-svgrepo-com.svg' },
  { id: 'google', name: 'GOOGLE', url: '/logos/google-icon-logo-svgrepo-com.svg' },
  { id: 'netflix', name: 'NETFLIX', url: '/logos/netflix-2-logo-svgrepo-com.svg' },
  { id: 'tinder', name: 'TINDER', url: '/logos/tinder-1-logo-svgrepo-com.svg' },
  { id: 'youtube', name: 'YOUTUBE', url: '/logos/youtube-icon-logo-svgrepo-com.svg' },
]

// Duplicate list for seamless unbroken horizontal loop
const MARQUEE_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS]

const SERVICES = [
  '3D Web Experiences',
  'Full-Stack Web App',
  'AI & Automation',
  'UI/UX & Branding',
  'Custom Architecture',
]

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'DISCOVER',
    description: 'We understand your business, goals and audience to find the right opportunities.',
    accent: '#a855f7',
    lookAt: { x: -0.85, y: 0.1 },
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16" y2="16" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'DESIGN',
    description: 'We create user-focused designs that communicate your value and engage users.',
    accent: '#c084fc',
    lookAt: { x: -0.45, y: 0.1 },
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Bézier vector curve with anchor nodes matching reference */}
        <path d="M4 16C4 8 20 8 20 16" stroke="#ffffff" strokeWidth="2" />
        <circle cx="4" cy="16" r="2.5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="20" cy="16" r="2.5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="12" cy="8" r="2.5" fill="#c084fc" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M12 10.5v6.5" stroke="#ffffff" strokeWidth="2" />
        <path d="M10 17l2 3 2-3h-4z" fill="#c084fc" stroke="#ffffff" strokeWidth="1" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'BUILD',
    description: 'We bring the design to life with clean, scalable code and powerful functionality.',
    accent: '#e879f9',
    lookAt: { x: 0.45, y: 0.1 },
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" stroke="#c084fc" strokeWidth="2" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'LAUNCH',
    description: 'We test, optimize and launch your digital product for real-world impact.',
    accent: '#38bdf8',
    lookAt: { x: 0.85, y: 0.1 },
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="rgba(192, 132, 252, 0.4)" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <circle cx="15" cy="9" r="1.5" fill="#c084fc" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
]

// Horizontal flow connector with glowing neon violet bead and arrowhead matching reference
function ProcessConnector() {
  return (
    <div
      className="process-connector-arrow"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 'clamp(18px, 1.8vw, 30px)',
        height: '24px',
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: '6px',
          height: '1.5px',
          background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.4) 0%, rgba(192, 132, 252, 0.9) 50%, rgba(168, 85, 247, 0.7) 100%)',
          boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#c084fc',
          boxShadow: '0 0 10px #c084fc, 0 0 18px #a855f7',
        }}
      />
      <svg
        width="7"
        height="11"
        viewBox="0 0 7 11"
        fill="none"
        style={{
          position: 'absolute',
          right: '1px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <path d="M1.5 1.5L5.5 5.5L1.5 9.5" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ProcessCard({ step, isHovered, onHover, onLeave }) {
  return (
    <div
      className="process-card-item"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        width: 'clamp(170px, 11.8vw, 215px)',
        minHeight: 'clamp(235px, 28vh, 275px)',
        borderRadius: 'clamp(18px, 1.4vw, 22px)',
        // Deep Obsidian Glass matching reference
        background: isHovered
          ? 'linear-gradient(155deg, rgba(255, 255, 255, 0.09) 0%, rgba(168, 85, 247, 0.14) 28%, rgba(18, 12, 40, 0.90) 70%, rgba(7, 7, 22, 0.98) 100%)'
          : 'linear-gradient(155deg, rgba(255, 255, 255, 0.05) 0%, rgba(168, 85, 247, 0.05) 28%, rgba(12, 9, 30, 0.82) 70%, rgba(6, 6, 18, 0.94) 100%)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        padding: 'clamp(18px, 2.2vh, 24px) clamp(12px, 1vw, 18px)',
        boxSizing: 'border-box',
        color: '#ffffff',
        border: isHovered ? '1.5px solid rgba(192, 132, 252, 0.75)' : '1px solid rgba(168, 85, 247, 0.28)',
        borderTop: isHovered ? '1.5px solid rgba(255, 255, 255, 0.65)' : '1px solid rgba(255, 255, 255, 0.32)',
        boxShadow: isHovered
          ? '0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 32px rgba(168, 85, 247, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.45)'
          : '0 14px 38px -10px rgba(0, 0, 0, 0.85), 0 0 16px -4px rgba(168, 85, 247, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.22)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0px) scale(1.0)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      {/* Specular gloss top curve */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          pointerEvents: 'none',
          borderRadius: 'clamp(18px, 1.4vw, 22px) clamp(18px, 1.4vw, 22px) 0 0',
        }}
      />

      {/* Top Left Step Number matching reference */}
      <div
        style={{
          alignSelf: 'flex-start',
          fontFamily: "'Space Grotesk', monospace",
          fontSize: 'clamp(15px, 1.1vw, 18px)',
          fontWeight: 800,
          color: '#c084fc',
          letterSpacing: '0.04em',
          marginBottom: 'clamp(8px, 1vh, 12px)',
          textShadow: isHovered ? '0 0 14px rgba(192, 132, 252, 0.8)' : '0 0 8px rgba(192, 132, 252, 0.35)',
          transition: 'text-shadow 0.3s ease',
        }}
      >
        {step.step}
      </div>

      {/* Center Circular Glowing Icon Ring matching reference! */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(56px, 4vw, 66px)',
          height: 'clamp(56px, 4vw, 66px)',
          borderRadius: '50%',
          border: isHovered ? '2px solid #c084fc' : '2px solid rgba(192, 132, 252, 0.65)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(18, 12, 40, 0.9) 75%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(12, 9, 30, 0.85) 75%)',
          boxShadow: isHovered
            ? '0 0 32px rgba(192, 132, 252, 0.75), inset 0 0 16px rgba(192, 132, 252, 0.45)'
            : '0 0 18px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(168, 85, 247, 0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'clamp(12px, 1.5vh, 16px)',
          transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {step.icon}
      </div>

      {/* Step Title */}
      <h3
        style={{
          margin: '0 0 clamp(6px, 0.8vh, 8px) 0',
          fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
          fontSize: 'clamp(15px, 1.1vw, 18px)',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#ffffff',
          textShadow: isHovered ? '0 0 18px rgba(192, 132, 252, 0.7)' : '0 2px 10px rgba(0, 0, 0, 0.6)',
          transition: 'text-shadow 0.3s ease',
        }}
      >
        {step.title}
      </h3>

      {/* Step Description */}
      <p
        style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(11px, 0.76vw, 12.5px)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'rgba(230, 230, 255, 0.72)',
          letterSpacing: '-0.01em',
        }}
      >
        {step.description}
      </p>

      {/* Laser edge glow line at bottom on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '12%',
          right: '12%',
          height: '1.5px',
          background: isHovered
            ? 'linear-gradient(90deg, transparent, #c084fc, #e879f9, transparent)'
            : 'transparent',
          boxShadow: isHovered ? '0 0 14px #c084fc' : 'none',
          transition: 'all 0.35s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function WorkedWithSection({ isPreloaderDone }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const splineAppRef = useRef(null)
  const modelWrapperRef = useRef(null)
  const marqueeWrapperRef = useRef(null)
  const formWrapperRef = useRef(null)
  const formCardRef = useRef(null)
  const processLeftRef = useRef(null)
  const processRightRef = useRef(null)
  const processBridgeRef = useRef(null)
  const hoveredProcessStepRef = useRef(null)

  const [splineLoaded, setSplineLoaded] = useState(false)
  const [hoveredLogo, setHoveredLogo] = useState(null)
  const [activeHoveredStep, setActiveHoveredStep] = useState(null)

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
      // Robot focuses on the hovered process card, or follows cursor smoothly
      const target = hoveredProcessStepRef.current || mouseTargetRef.current
      const curr = mouseCurrentRef.current

      // Smooth damped lerp toward target
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
  // MASTER SCROLL TRIGGER CHOREOGRAPHY (1260vh timeline):
  //
  //  p: 0.00 → 0.80  — Offscreen (behind Project Showcase)
  //  p: 0.80 → 0.84  — Stage slides up (Y: 100% → 0%) as 100% opaque cover
  //  p: 0.84 → 0.91  — WORKED WITH stage fully pinned; interactive 3D robot + marquee active
  //  p: 0.91 → 0.94  — Phase A: Marquee + typography exit upward
  //  p: 0.94 → 0.97  — Phase B: Robot screen zooms in & Contact Form reveals on robot's face
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
        const formWrapper = formWrapperRef.current
        const processLeft = processLeftRef.current
        const processRight = processRightRef.current
        const processBridge = processBridgeRef.current

        // ─── PHASE 0: Completely offscreen ─────────────────────────────────
        if (p < 0.80) {
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
          if (processBridge) {
            processBridge.style.opacity = '0'
          }
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }
          if (processLeft) {
            processLeft.style.opacity = '0'
            processLeft.style.transform = 'translateY(calc(-50% + 40px))'
            processLeft.style.pointerEvents = 'none'
          }
          if (processRight) {
            processRight.style.opacity = '0'
            processRight.style.transform = 'translateY(calc(-50% + 40px))'
            processRight.style.pointerEvents = 'none'
          }

        // ─── PHASE 1: Slide-up curtain over Project Showcase ───────────────
        } else if (p <= 0.84) {
          const t = (p - 0.80) / 0.04
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
          if (processBridge) {
            processBridge.style.opacity = eased.toFixed(3)
          }
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }
          if (processLeft) {
            processLeft.style.opacity = eased.toFixed(3)
            processLeft.style.transform = `translateY(calc(-50% + ${(40 * (1 - eased)).toFixed(1)}px))`
            processLeft.style.pointerEvents = t > 0.5 ? 'auto' : 'none'
          }
          if (processRight) {
            processRight.style.opacity = eased.toFixed(3)
            processRight.style.transform = `translateY(calc(-50% + ${(40 * (1 - eased)).toFixed(1)}px))`
            processRight.style.pointerEvents = t > 0.5 ? 'auto' : 'none'
          }

        // ─── PHASE 2: Stage pinned — interactive 3D robot + marquee + process ──
        } else if (p <= 0.91) {
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
          if (processBridge) {
            processBridge.style.opacity = '1'
          }
          if (formWrapper) {
            formWrapper.style.opacity = '0'
            formWrapper.style.transform = 'translate(-50%, calc(-50% + 30px)) scale(0.92)'
            formWrapper.style.pointerEvents = 'none'
          }
          if (processLeft) {
            processLeft.style.opacity = '1'
            processLeft.style.transform = 'translateY(-50%)'
            processLeft.style.pointerEvents = 'auto'
          }
          if (processRight) {
            processRight.style.opacity = '1'
            processRight.style.transform = 'translateY(-50%)'
            processRight.style.pointerEvents = 'auto'
          }

        // ─── PHASE A: UI Dismissal (Marquee + Title + Process exit) ───────────
        } else if (p <= 0.94) {
          const t = (p - 0.91) / 0.03
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

          // Process cards slide outward and fade smoothly
          const procExitX = (hermite * 120).toFixed(1)
          const procOp = Math.max(0, 1 - hermite * 2.2).toFixed(3)
          if (processLeft) {
            processLeft.style.transform = `translate(-${procExitX}px, -50%)`
            processLeft.style.opacity = procOp
            processLeft.style.pointerEvents = 'none'
          }
          if (processRight) {
            processRight.style.transform = `translate(${procExitX}px, -50%)`
            processRight.style.opacity = procOp
            processRight.style.pointerEvents = 'none'
          }
          if (processBridge) {
            processBridge.style.opacity = procOp
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
          const rawT = (p - 0.94) / 0.03
          const t = Math.min(1.0, Math.max(0, rawT))
          const zoomEase = t * (2 - t)  // smooth ease-out

          stage.style.transform = 'translateY(0%)'
          stage.style.opacity = '1'
          stage.style.visibility = 'visible'
          stage.style.pointerEvents = 'auto'

          // Marquee and bridge stay hidden
          if (marqueeWrapper) {
            marqueeWrapper.style.transform = 'translateY(-110px)'
            marqueeWrapper.style.opacity = '0'
          }
          if (processBridge) {
            processBridge.style.opacity = '0'
          }
          if (processLeft) {
            processLeft.style.opacity = '0'
            processLeft.style.pointerEvents = 'none'
          }
          if (processRight) {
            processRight.style.opacity = '0'
            processRight.style.pointerEvents = 'none'
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
      {/* LAYER 3.5: 4-STAGE PROCESS FRAMEWORK (Sides & Behind the 3D Robot)        */}
      {/* ========================================================================= */}
      {/* CENTRAL DATA CONDUIT BEHIND 3D ROBOT (Connects Step 02 to Step 03) */}
      <div
        ref={processBridgeRef}
        className="process-bridge-conduit"
        style={{
          position: 'absolute',
          left: 'calc(50% - clamp(140px, 11.5vw, 185px))',
          right: 'calc(50% - clamp(140px, 11.5vw, 185px))',
          top: '52%',
          transform: 'translateY(-50%)',
          height: '24px',
          zIndex: 1, // Sits directly BEHIND the Spline 3D canvas (z-index 2)
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          willChange: 'opacity',
        }}
      >
        {/* Glowing conduit line */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '1.5px',
            background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.45) 0%, rgba(192, 132, 252, 0.85) 50%, rgba(168, 85, 247, 0.5) 100%)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.45), 0 0 20px rgba(192, 132, 252, 0.25)',
          }}
        >
          {/* Animated traveling energy pulse */}
          <div
            className="conduit-traveling-pulse"
            style={{
              position: 'absolute',
              top: '-3px',
              left: '0%',
              width: '32px',
              height: '7px',
              borderRadius: '7px',
              background: 'radial-gradient(ellipse at center, #ffffff 0%, #c084fc 60%, transparent 100%)',
              boxShadow: '0 0 14px #c084fc, 0 0 24px #a855f7',
              animation: 'conduitTravel 3.2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Arrowhead pointing into Step 03 */}
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          style={{
            position: 'absolute',
            right: '-2px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <path d="M1.5 2L5.5 6L1.5 10" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* LEFT PROCESS GROUP: 01 DISCOVER -> 02 DESIGN */}
      <div
        ref={processLeftRef}
        className="process-side-group process-side-group-left"
        style={{
          position: 'absolute',
          right: 'calc(50% + clamp(140px, 11.5vw, 185px))',
          top: '52%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1vw, 14px)',
          zIndex: 15,
          pointerEvents: 'auto',
          willChange: 'transform, opacity',
        }}
      >
        <ProcessCard
          step={PROCESS_STEPS[0]}
          isHovered={activeHoveredStep === '01'}
          onHover={() => {
            setActiveHoveredStep('01')
            hoveredProcessStepRef.current = PROCESS_STEPS[0].lookAt
          }}
          onLeave={() => {
            setActiveHoveredStep(null)
            hoveredProcessStepRef.current = null
          }}
        />
        <ProcessConnector />
        <ProcessCard
          step={PROCESS_STEPS[1]}
          isHovered={activeHoveredStep === '02'}
          onHover={() => {
            setActiveHoveredStep('02')
            hoveredProcessStepRef.current = PROCESS_STEPS[1].lookAt
          }}
          onLeave={() => {
            setActiveHoveredStep(null)
            hoveredProcessStepRef.current = null
          }}
        />
      </div>

      {/* RIGHT PROCESS GROUP: 03 BUILD -> 04 LAUNCH */}
      <div
        ref={processRightRef}
        className="process-side-group process-side-group-right"
        style={{
          position: 'absolute',
          left: 'calc(50% + clamp(140px, 11.5vw, 185px))',
          top: '52%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(6px, 1vw, 14px)',
          zIndex: 15,
          pointerEvents: 'auto',
          willChange: 'transform, opacity',
        }}
      >
        <ProcessCard
          step={PROCESS_STEPS[2]}
          isHovered={activeHoveredStep === '03'}
          onHover={() => {
            setActiveHoveredStep('03')
            hoveredProcessStepRef.current = PROCESS_STEPS[2].lookAt
          }}
          onLeave={() => {
            setActiveHoveredStep(null)
            hoveredProcessStepRef.current = null
          }}
        />
        <ProcessConnector />
        <ProcessCard
          step={PROCESS_STEPS[3]}
          isHovered={activeHoveredStep === '04'}
          onHover={() => {
            setActiveHoveredStep('04')
            hoveredProcessStepRef.current = PROCESS_STEPS[3].lookAt
          }}
          onLeave={() => {
            setActiveHoveredStep(null)
            hoveredProcessStepRef.current = null
          }}
        />
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

      {/* Marquee, Pulsing and Responsive Keyframes */}
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
        @keyframes conduitTravel {
          0% {
            left: 0%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: calc(100% - 32px);
            opacity: 0;
          }
        }
        @media (max-width: 1280px) {
          .process-card-item {
            width: clamp(150px, 11vw, 175px) !important;
            min-height: 220px !important;
            padding: 14px 10px !important;
          }
        }
        @media (max-width: 980px) {
          .process-bridge-conduit {
            display: none !important;
          }
          .process-side-group {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .process-side-group-left {
            right: calc(50% + clamp(110px, 16vw, 150px)) !important;
          }
          .process-side-group-right {
            left: calc(50% + clamp(110px, 16vw, 150px)) !important;
          }
          .process-connector-arrow {
            transform: rotate(90deg) !important;
            height: 16px !important;
          }
          .process-card-item {
            width: 170px !important;
            min-height: auto !important;
            padding: 14px 10px !important;
          }
        }
        @media (max-width: 720px) {
          .process-side-group {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
