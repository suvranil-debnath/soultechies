import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Navbar from '../Navbar'
import {
  ArrowRight,
  ArrowUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Smartphone,
  Globe,
  Cpu,
  ShieldCheck,
  Zap,
  MapPin,
  Play,
  Pause,
} from 'lucide-react'
import { projectsData } from '../ProjectShowcase'
import { SERVICES_DATA } from '../ServicesSection'
import { CLIENT_LOGOS, PROCESS_STEPS } from '../WorkedWithSection'

const MOBILE_PROCESS_STEPS = [
  {
    step: '01',
    title: 'DISCOVER',
    tagline: 'Strategic Analysis & Architecture',
    description: 'We dissect your product vision, analyze market opportunities, and architect the technological blueprint before writing a single line of code.',
    deliverables: ['Tech Architecture', 'User Insights', 'Product Roadmap'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.5" y2="16.5" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'DESIGN',
    tagline: 'Spatial UI & Interactive Prototypes',
    description: 'We create user-focused designs that communicate your value and engage users through fluid motion, clean aesthetics, and high-fidelity prototypes.',
    deliverables: ['Interactive UI/UX', 'Design Systems', '3D Visuals'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'BUILD',
    tagline: 'Clean Code & Full-Stack Engine',
    description: 'We bring the design to life with clean, scalable code, robust microservices, high-speed APIs, and high-performance WebGL/React functionality.',
    deliverables: ['Clean Codebase', 'High-Speed APIs', 'Cloud Backend'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'LAUNCH',
    tagline: 'Audits, Deployment & Scale',
    description: 'We test, optimize, and launch your digital product with end-to-end reliability, zero downtime, and deep telemetry for continuous growth.',
    deliverables: ['QA Audits', 'CI/CD Deploy', 'Telemetry & Scale'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <circle cx="15" cy="9" r="1.5" />
      </svg>
    ),
  },
]

export default function MobileView() {
  // Mobile Project Carousel State
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0)
  const [isProjectAutoPlay, setIsProjectAutoPlay] = useState(true)
  const isProjectPausedRef = useRef(false)
  const projectPauseTimeoutRef = useRef(null)
  const touchStartXRef = useRef(null)

  // Mobile Process Step Active State
  const [activeProcessStep, setActiveProcessStep] = useState('01')

  // Mobile Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web Application',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentProject = useMemo(() => {
    return projectsData[currentProjectIdx] || projectsData[0]
  }, [currentProjectIdx])

  const handleUserInteractProject = useCallback(() => {
    isProjectPausedRef.current = true
    if (projectPauseTimeoutRef.current) {
      clearTimeout(projectPauseTimeoutRef.current)
    }
    // Resume auto-play after 4.5 seconds of user inactivity
    projectPauseTimeoutRef.current = setTimeout(() => {
      isProjectPausedRef.current = false
    }, 4500)
  }, [])

  const nextProject = useCallback(() => {
    handleUserInteractProject()
    setCurrentProjectIdx((prev) => (prev + 1) % projectsData.length)
  }, [handleUserInteractProject])

  const prevProject = useCallback(() => {
    handleUserInteractProject()
    setCurrentProjectIdx((prev) => (prev - 1 + projectsData.length) % projectsData.length)
  }, [handleUserInteractProject])

  // Autoplay effect for Mobile Project Showcase (rotates every 3.5 seconds)
  useEffect(() => {
    if (!isProjectAutoPlay) return

    const timer = setInterval(() => {
      if (!isProjectPausedRef.current) {
        setCurrentProjectIdx((prev) => (prev + 1) % projectsData.length)
      }
    }, 3500)

    return () => {
      clearInterval(timer)
      if (projectPauseTimeoutRef.current) clearTimeout(projectPauseTimeoutRef.current)
    }
  }, [isProjectAutoPlay])

  const handleTouchStart = (e) => {
    handleUserInteractProject()
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchStartXRef.current - touchEndX

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> next
        nextProject()
      } else {
        // Swiped right -> prev
        prevProject()
      }
    }
    touchStartXRef.current = null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
      setFormData({ name: '', email: '', projectType: 'Web Application', message: '' })
    }, 1200)
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient background glows (pure CSS static blurs, 0% CPU) */}
      <div
        style={{
          position: 'fixed',
          top: '-10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          height: '45vh',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.09) 0%, rgba(168, 85, 247, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '5vh',
          right: '-15vw',
          width: '80vw',
          height: '40vh',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ========================================================================= */}
      {/* 1. NAVBAR                                                                 */}
      {/* ========================================================================= */}
      <Navbar isPreloaderDone={true} />

      {/* Main Content Area */}
      <main style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        {/* ========================================================================= */}
        {/* 2. HERO SECTION — Creative Editorial Redesign                             */}
        {/* ========================================================================= */}
        <section
          id="mobile-hero"
          style={{
            position: 'relative',
            padding: '0',
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Architectural grid lines (static SVG, 0 CPU) ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Radial vignette mask over grid ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #000000 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── Subtle top glow ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70vw',
              height: '35vh',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── CONTENT LAYER ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: 'clamp(72px, 9.5vh, 92px) 20px 96px',
              justifyContent: 'flex-start',
            }}
          >
            {/* ── WORDMARK — 2-row stacked: SOUL / TECHIES ── */}
            <div style={{ position: 'relative', marginBottom: '34px' }}>

              {/* Row 1: S ⊙ UL */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0px',
                  lineHeight: 0.88,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(76px, 23vw, 116px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.04em',
                    color: '#ffffff',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  S
                </span>

                {/* O — razor-thin concentric ring */}
                <div
                  style={{
                    width: 'clamp(63px, 19.5vw, 96px)',
                    height: 'clamp(63px, 19.5vw, 96px)',
                    borderRadius: '50%',
                    border: '2.5px solid rgba(255,255,255,0.9)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    marginLeft: '-1px',
                    marginRight: '-1px',
                  }}
                >
                  <div
                    style={{
                      width: '52%',
                      height: '52%',
                      borderRadius: '50%',
                      border: '1.5px solid rgba(255,255,255,0.32)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#ffffff',
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(76px, 23vw, 116px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.04em',
                    color: '#ffffff',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  UL
                </span>
              </div>

              {/* Row 2: TECHIES */}
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(76px, 23vw, 116px)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  color: '#ffffff',
                  WebkitFontSmoothing: 'antialiased',
                  marginTop: '6px',
                }}
              >
                TECHIES
              </div>

            </div>

            {/* ── Tagline ── */}
            <p
              style={{
                fontSize: 'clamp(13.5px, 3.6vw, 16px)',
                lineHeight: 1.62,
                color: 'rgba(255,255,255,0.58)',
                maxWidth: '340px',
                margin: '0 0 34px',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              We engineer high-performance web products, mobile platforms, and AI-powered software that scale from zero to enterprise.
            </p>

            {/* ── CTA Row ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '10px',
                marginBottom: '34px',
              }}
            >
              <button
                onClick={() => scrollToSection('mobile-projects')}
                style={{
                  flex: '1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px 18px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                View Projects
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => scrollToSection('mobile-contact')}
                style={{
                  flex: '1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '13px 18px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                }}
              >
                Let's Talk
              </button>
            </div>

            {/* ── SIGNATURE OBSIDIAN BENTO CARDS (Mobile translation of Desktop Hero) ── */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '32px',
              }}
            >
              {/* Card 1: 100K+ Lines of Code */}
              <div
                style={{
                  flex: '1',
                  background: '#080910',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '14px 12px',
                  boxShadow: '0 14px 32px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '160px',
                  userSelect: 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: 'rgba(255, 255, 255, 0.4)',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}
                  >
                    Code Scale
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      marginBottom: '4px',
                    }}
                  >
                    100K+ Lines
                  </div>
                  <div
                    style={{
                      fontSize: '10.5px',
                      lineHeight: 1.35,
                      color: 'rgba(255, 255, 255, 0.48)',
                      fontWeight: 400,
                    }}
                  >
                    Clean, scalable & performance-first.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '28px',
                      padding: '0 8px',
                      borderRadius: '8px',
                      background: '#0e0f18',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)',
                      fontFamily: "'Space Grotesk', monospace",
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    &lt;/&gt;
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '28px',
                      padding: '0 9px',
                      borderRadius: '8px',
                      background: '#0e0f18',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    100K+
                  </div>
                </div>
              </div>

              {/* Card 2: 24/7 Smartwatch Reliability */}
              <div
                style={{
                  flex: '1',
                  background: '#080910',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '12px 10px',
                  boxShadow: '0 14px 32px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '160px',
                  userSelect: 'none',
                }}
              >
                {/* Watch container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {/* Watch Top Strap */}
                  <div
                    style={{
                      width: '28px',
                      height: '3.5px',
                      background: 'linear-gradient(to top, #161824, #0a0b12)',
                      borderRadius: '3px 3px 0 0',
                      opacity: 0.55,
                    }}
                  />

                  {/* Watch Outer Case */}
                  <div
                    style={{
                      position: 'relative',
                      width: '68px',
                      height: '72px',
                      borderRadius: '16px',
                      background: 'linear-gradient(145deg, #242738 0%, #10111a 100%)',
                      padding: '2px',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    {/* Watch Crown Button */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-3px',
                        top: '14px',
                        width: '2.5px',
                        height: '10px',
                        borderRadius: '2px',
                        background: 'linear-gradient(to bottom, #555868, #181924)',
                      }}
                    />

                    {/* Watch OLED Screen */}
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '14px',
                        background: '#07080e',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3px 2px',
                        textAlign: 'center',
                        boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.95)',
                      }}
                    >
                      {/* Top Live Pill Tag */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '1px 5px',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          marginBottom: '2px',
                        }}
                      >
                        <span style={{ color: '#38bdf8', fontSize: '7px', lineHeight: 1 }}>◷</span>
                        <span
                          style={{
                            fontSize: '6.5px',
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                            color: 'rgba(255, 255, 255, 0.8)',
                            textTransform: 'uppercase',
                          }}
                        >
                          Focus
                        </span>
                      </div>

                      {/* 24/7 Digital Clock Readout */}
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '15px',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                          color: '#ffffff',
                          marginBottom: '2px',
                        }}
                      >
                        24/7
                      </div>

                      {/* Dot + Reliability Status */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2.5px',
                          fontSize: '6.5px',
                          fontWeight: 500,
                          color: '#38bdf8',
                          letterSpacing: '0.02em',
                        }}
                      >
                        <span
                          style={{
                            width: '2px',
                            height: '2px',
                            borderRadius: '50%',
                            background: '#38bdf8',
                            boxShadow: '0 0 3px #38bdf8',
                          }}
                        />
                        <span>Reliability</span>
                      </div>
                    </div>
                  </div>

                  {/* Watch Bottom Strap */}
                  <div
                    style={{
                      width: '28px',
                      height: '3.5px',
                      background: 'linear-gradient(to bottom, #161824, #0a0b12)',
                      borderRadius: '0 0 3px 3px',
                      opacity: 0.55,
                    }}
                  />
                </div>

                {/* Bottom Text */}
                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.92)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Support & Uptime
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: 'rgba(255, 255, 255, 0.45)',
                      marginTop: '1px',
                    }}
                  >
                    Always Available
                  </div>
                </div>
              </div>
            </div>

            {/* ── STATS ROW (Integrated cleanly above bottom safe area) ── */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '24px',
                paddingBottom: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {[
                { value: '32+', label: 'Projects' },
                { value: '99.8%', label: 'Satisfaction' },
                { value: '4+', label: 'Yrs Experience' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    padding: '0 4px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 'clamp(17px, 5vw, 22px)',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      marginBottom: '3px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.42)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* 3. SERVICES SECTION — Obsidian Liquid Glass Bento                         */}
        {/* ========================================================================= */}
        <section
          id="mobile-services"
          style={{
            position: 'relative',
            padding: '64px 20px clamp(56px, 9vh, 84px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#000000',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '600px',
              height: '350px',
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 255, 255, 0.035) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Editorial Kicker Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                01 // WHAT WE BUILD
              </span>
            </div>

            {/* Section Headline */}
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(28px, 7.5vw, 38px)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                color: '#ffffff',
                margin: '0 0 12px 0',
              }}
            >
              Specialized Digital Capabilities
            </h2>

            {/* Section Subhead */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.55)',
                maxWidth: '460px',
                margin: '0 0 32px 0',
                letterSpacing: '-0.01em',
              }}
            >
              From autonomous AI pipelines to sub-second architectures, we engineer digital products built for scale, performance, and durability.
            </p>

            {/* Services Cards Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SERVICES_DATA.map((srv) => {
                const serviceIcon =
                  srv.id === '01' ? (
                    <Sparkles size={16} strokeWidth={2} />
                  ) : srv.id === '02' ? (
                    <Cpu size={16} strokeWidth={2} />
                  ) : srv.id === '03' ? (
                    <Smartphone size={16} strokeWidth={2} />
                  ) : (
                    <Zap size={16} strokeWidth={2} />
                  )

                return (
                  <div
                    key={srv.id}
                    style={{
                      position: 'relative',
                      borderRadius: '24px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 28%, rgba(10, 12, 20, 0.94) 60%, rgba(5, 6, 12, 0.98) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderTop: '1.5px solid rgba(255, 255, 255, 0.28)',
                      padding: '24px 20px 22px',
                      boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                      overflow: 'hidden',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Top Specular Sheen Layer */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '45%',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '24px 24px 0 0',
                      }}
                    />

                    {/* Top Hairline Light Prism */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '12%',
                        right: '12%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5) 50%, transparent)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Header Row: Number / Badge Capsule & Action Disc Button */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: 'inset 0 1px 0.5px rgba(255, 255, 255, 0.25)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', monospace",
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#ffffff',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {srv.number}
                        </span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '11px' }}>/</span>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'rgba(255, 255, 255, 0.82)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {srv.badge}
                        </span>
                      </div>

                      {/* Frosted Action Disc with Diagonal Arrow */}
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255, 255, 255, 0.85)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>

                    {/* Service Title with Distinctive Category Icon */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                        }}
                      >
                        {serviceIcon}
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
                          fontSize: '19px',
                          fontWeight: 700,
                          color: '#ffffff',
                          letterSpacing: '-0.025em',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {srv.category}
                      </h3>
                    </div>

                    {/* Service Description */}
                    <p
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '13.5px',
                        color: 'rgba(255, 255, 255, 0.62)',
                        lineHeight: 1.55,
                        margin: '0 0 16px 0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {srv.description}
                    </p>

                    {/* Frosted Feature Pills */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '7px',
                      }}
                    >
                      {srv.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 11px',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.035)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '11.5px',
                            fontWeight: 500,
                            color: 'rgba(255, 255, 255, 0.82)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            letterSpacing: '-0.005em',
                          }}
                        >
                          <span
                            style={{
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              opacity: 0.55,
                              flexShrink: 0,
                            }}
                          />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FEATURED PROJECTS SHOWCASE — Obsidian Cinematic Carousel               */}
        {/* ========================================================================= */}
        <section
          id="mobile-projects"
          style={{
            position: 'relative',
            padding: '64px 20px clamp(80px, 12vh, 110px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#000000',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '600px',
              height: '350px',
              background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 255, 255, 0.035) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Header Row: Kicker & Monospace Slide Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.75)',
                  }}
                >
                  02 // FEATURED WORK
                </span>
              </div>

              {/* Monospace Counter */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.8)',
                  letterSpacing: '0.04em',
                }}
              >
                <span>0{currentProjectIdx + 1}</span>
                <span style={{ opacity: 0.35 }}>/</span>
                <span style={{ opacity: 0.6 }}>0{projectsData.length}</span>
              </div>
            </div>

            {/* Section Headline */}
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(28px, 7.5vw, 38px)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                color: '#ffffff',
                margin: '0 0 12px 0',
              }}
            >
              Selected Client Projects
            </h2>

            {/* Section Subhead */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.55)',
                maxWidth: '460px',
                margin: '0 0 30px 0',
                letterSpacing: '-0.01em',
              }}
            >
              A curation of production systems, bespoke digital platforms, and mobile products engineered with precision.
            </p>

            {/* Cinematic Project Card */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => { isProjectPausedRef.current = true }}
              onMouseLeave={() => { isProjectPausedRef.current = false }}
              style={{
                position: 'relative',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 28%, rgba(10, 12, 20, 0.94) 60%, rgba(5, 6, 12, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderTop: '1.5px solid rgba(255, 255, 255, 0.28)',
                boxShadow: '0 28px 56px -14px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                marginBottom: '20px',
                touchAction: 'pan-y',
              }}
            >
              {/* Inner animated wrapper keyed to currentProjectIdx */}
              <div
                key={currentProjectIdx}
                style={{
                  animation: 'mobileProjectFade 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
                  width: '100%',
                }}
              >
                {/* Project Image Viewport */}
              <div
                style={{
                  width: '100%',
                  height: 'clamp(210px, 56vw, 240px)',
                  backgroundColor: '#04050a',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="lazy"
                />

                {/* Smooth Gradient Vignette Fading Image to Card Base */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 8, 14, 0.95) 0%, rgba(7, 8, 14, 0.35) 45%, transparent 100%)',
                  }}
                />

                {/* Floating Capsule Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.82)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{currentProject.year}</span>
                  <span style={{ opacity: 0.35 }}>•</span>
                  <span>{currentProject.category}</span>
                </div>

                {/* Top Right External Arrow Disc */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <ExternalLink size={13} />
                </div>
              </div>

              {/* Project Body Info */}
              <div style={{ padding: '22px 20px 24px' }}>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '20px',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: '#ffffff',
                    margin: '0 0 10px 0',
                    lineHeight: 1.25,
                  }}
                >
                  {currentProject.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '13.5px',
                    lineHeight: 1.58,
                    color: 'rgba(255, 255, 255, 0.65)',
                    margin: '0 0 18px 0',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {currentProject.description}
                </p>

                {/* Frosted Tech Chips */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '7px',
                    marginBottom: '22px',
                  }}
                >
                  {currentProject.tags.map((tag, tIdx) => (
                    <div
                      key={tIdx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 11px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.035)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.82)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          opacity: 0.55,
                          flexShrink: 0,
                        }}
                      />
                      {tag}
                    </div>
                  ))}
                </div>

                {/* Case Study CTA Button */}
                <a
                  href={currentProject.link || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 20px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    color: '#000000',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Explore Project
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
            </div>

            {/* Carousel Navigation Controls Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 2px',
              }}
            >
              {/* Arrow Buttons & Play/Pause Button */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={prevProject}
                  aria-label="Previous project"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextProject}
                  aria-label="Next project"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Autoplay Play/Pause Toggle Button */}
                <button
                  onClick={() => {
                    setIsProjectAutoPlay((prev) => !prev)
                    isProjectPausedRef.current = false
                  }}
                  aria-label={isProjectAutoPlay ? 'Pause automatic slideshow' : 'Play automatic slideshow'}
                  title={isProjectAutoPlay ? 'Pause automatic slideshow' : 'Play automatic slideshow'}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isProjectAutoPlay ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                    border: isProjectAutoPlay ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.14)',
                    color: isProjectAutoPlay ? '#00f0ff' : 'rgba(255, 255, 255, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isProjectAutoPlay ? '0 0 12px rgba(0, 240, 255, 0.22)' : '0 4px 14px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease',
                    marginLeft: '2px',
                  }}
                >
                  {isProjectAutoPlay ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: '1px' }} />}
                </button>
              </div>

              {/* Dynamic Pill Dots Indicator */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {projectsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleUserInteractProject()
                      setCurrentProjectIdx(idx)
                    }}
                    aria-label={`Jump to project ${idx + 1}`}
                    style={{
                      height: '5px',
                      width: idx === currentProjectIdx ? '26px' : '6px',
                      borderRadius: '999px',
                      background: idx === currentProjectIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.22)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CLIENTS & PROCESS SECTION (MATCHING HERO SECTION THEME & TYPOGRAPHY)   */}
        {/* ========================================================================= */}
        <section
          id="mobile-process"
          style={{
            position: 'relative',
            padding: '64px 0 72px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#000000',
            overflow: 'hidden',
          }}
        >
          {/* Architectural grid lines (exact match to Hero Section) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Radial vignette mask over grid (matching Hero Section) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #000000 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Subtle top ambient glow (matching Hero Section) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70vw',
              height: '35vh',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Section Header */}
          <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', maxWidth: '640px', margin: '0 auto 30px' }}>
            {/* Pill Badge (matching Hero squircle buttons & badges) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                05 / METHODOLOGY & PROCESS
              </span>
            </div>

            {/* Heading (matching Hero wordmark font & weight) */}
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(28px, 7.5vw, 38px)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                color: '#ffffff',
                margin: '0 0 12px 0',
              }}
            >
              Our Proven Methodology
            </h2>

            {/* Subtitle (matching Hero tagline typography) */}
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.58)',
                margin: 0,
                maxWidth: '440px',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              We engineer high-performance web products, mobile platforms, and automated software with a disciplined, end-to-end execution pipeline.
            </p>
          </div>

          {/* Client Logos CSS Marquee with Edge Vignette */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              padding: '16px 0',
              marginBottom: '40px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'transparent',
              maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                width: 'max-content',
                animation: 'mobileMarquee 26s linear infinite',
              }}
            >
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, lIdx) => (
                <div
                  key={lIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: '#080910',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    style={{
                      height: '20px',
                      width: 'auto',
                      filter: 'grayscale(100%) brightness(1.7)',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.75)',
                      letterSpacing: '0.08em',
                      fontFamily: "'Space Grotesk', monospace",
                    }}
                  >
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Process Pipeline */}
          <div
            style={{
              padding: '0 20px',
              maxWidth: '640px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Vertical Laser Spine Line (Monochrome Silver/White) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '42px',
                top: '28px',
                bottom: '40px',
                width: '2px',
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.04) 100%)',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.12)',
                zIndex: 1,
              }}
            />

            {/* Step Cards List */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {MOBILE_PROCESS_STEPS.map((step) => {
                const isSelected = activeProcessStep === step.step
                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveProcessStep(isSelected ? null : step.step)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    {/* Left Squircle Node (Matching Hero squircle buttons: width 44, borderRadius 13) */}
                    <div
                      style={{
                        position: 'relative',
                        width: '44px',
                        height: '44px',
                        borderRadius: '13px',
                        background: '#080910',
                        border: isSelected
                          ? '1px solid rgba(255, 255, 255, 0.35)'
                          : '1px solid rgba(255, 255, 255, 0.14)',
                        boxShadow: isSelected
                          ? '0 10px 28px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 255, 255, 0.08)'
                          : '0 8px 24px rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        flexShrink: 0,
                        marginTop: '4px',
                        transition: 'all 0.3s ease',
                        transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                      }}
                    >
                      {step.icon}

                      {/* Mini Number Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-5px',
                          right: '-5px',
                          fontSize: '9.5px',
                          fontWeight: 700,
                          fontFamily: "'Space Grotesk', monospace",
                          background: '#0e0f18',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '6px',
                          lineHeight: 1.2,
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
                        }}
                      >
                        {step.step}
                      </span>
                    </div>

                    {/* Right Card (Matching Hero Bento Obsidian Card) */}
                    <div
                      style={{
                        flex: 1,
                        background: isSelected ? '#0c0d16' : '#080910',
                        border: isSelected
                          ? '1px solid rgba(255, 255, 255, 0.22)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '18px',
                        padding: '18px 16px 16px',
                        boxShadow: isSelected
                          ? '0 18px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 255, 255, 0.04)'
                          : '0 14px 32px rgba(0, 0, 0, 0.6)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Top Meta Line: Phase Badge + Tagline */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: "'Space Grotesk', monospace",
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'rgba(255, 255, 255, 0.42)',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                            }}
                          >
                            PHASE {step.step}
                          </span>
                          <span
                            style={{
                              width: '3px',
                              height: '3px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              color: 'rgba(255, 255, 255, 0.65)',
                            }}
                          >
                            {step.tagline}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '9px',
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {isSelected ? '●' : '○'}
                        </span>
                      </div>

                      {/* Main Title (Plus Jakarta Sans, 700) */}
                      <h4
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '17px',
                          fontWeight: 700,
                          color: '#ffffff',
                          letterSpacing: '-0.02em',
                          margin: '0 0 6px 0',
                        }}
                      >
                        {step.title}
                      </h4>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.58)',
                          lineHeight: 1.58,
                          margin: '0 0 14px 0',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {step.description}
                      </p>

                      {/* Deliverable Tags Row (Matching Hero's 100K+ / </> buttons) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {step.deliverables.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: '#0e0f18',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              fontSize: '11px',
                              fontWeight: 500,
                              color: 'rgba(255, 255, 255, 0.82)',
                              fontFamily: "'Space Grotesk', monospace",
                              letterSpacing: '0.01em',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CONTACT FORM SECTION                                                   */}
        {/* ========================================================================= */}
        <section
          id="mobile-contact"
          style={{
            position: 'relative',
            padding: '56px 20px 84px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#000000',
            overflow: 'hidden',
          }}
        >
          {/* ── Architectural grid lines (matches hero) ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Radial vignette mask ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 80% 60% at 50% 30%, transparent 20%, #000000 95%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'inline-block',
                }}
              />
              06 / GET IN TOUCH
            </div>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(26px, 7vw, 36px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              Ready to Build Something Extraordinary?
            </h2>

            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.58)',
                lineHeight: 1.6,
                marginBottom: '28px',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Tell us about your project, timeline and goals. We reply within 24 hours.
            </p>

            {/* Obsidian Glass Form Card (Matches Hero Bento Card) */}
            <div
              style={{
                padding: '24px 20px',
                borderRadius: '22px',
                background: '#080910',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)',
              }}
            >
              {isSubmitted ? (
                <div
                  style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckCircle2 size={44} color="#ffffff" />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                    Message Received!
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, lineHeight: 1.5 }}>
                    Thank you for reaching out. We will review your project requirements and get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        marginBottom: '7px',
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        background: '#0c0d15',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        marginBottom: '7px',
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        background: '#0c0d15',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        marginBottom: '7px',
                      }}
                    >
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        background: '#0c0d15',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Web Application">Full-Stack Web Application</option>
                      <option value="Mobile App">iOS & Android Mobile App</option>
                      <option value="E-Commerce">E-Commerce Platform</option>
                      <option value="AI & Automation">AI & Workflow Automation</option>
                      <option value="Branding & UI/UX">UI/UX & Brand Design</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        marginBottom: '7px',
                      }}
                    >
                      Project Scope & Goals
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Briefly describe your vision, goals and timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        background: '#0c0d15',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: '8px',
                      padding: '14px 22px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      letterSpacing: '-0.01em',
                      boxShadow: '0 4px 18px rgba(255, 255, 255, 0.12)',
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {isSubmitting ? (
                      'Sending Request...'
                    ) : (
                      <>
                        Send Project Request
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. FOOTER SECTION — Architectural Obsidian Redesign                       */}
        {/* ========================================================================= */}
        <footer
          style={{
            position: 'relative',
            padding: '54px 20px 120px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#030408',
            overflow: 'hidden',
          }}
        >
          {/* ── Architectural grid lines ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Top subtle glow ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80vw',
              height: '30vh',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
            {/* ── TOP ROW: Studio Brand & Back to Top ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    marginBottom: '8px',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Soultech Logo"
                    style={{ height: '24px', width: 'auto', display: 'block' }}
                  />
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '16px',
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                    }}
                  >
                    SOULTECHIES
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.52)',
                    maxWidth: '300px',
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  Crafting high-performance digital products, full-stack web platforms, and automated software.
                </p>
              </div>

              {/* Circular Back to Top Button (Matching Desktop Hero/Footer) */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#080910',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                }}
              >
                <ArrowUp size={16} />
              </button>
            </div>

            {/* ── SOCIAL CONNECT ROW (ICON BUTTONS) ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '26px',
              }}
            >
              {[
                {
                  label: 'LinkedIn',
                  url: 'https://linkedin.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.97 0-1.75.79-1.75 1.76s.78 1.76 1.75 1.76 1.75-.79 1.75-1.76-.78-1.76-1.75-1.76Z" />
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  url: 'https://github.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
                {
                  label: 'X (Twitter)',
                  url: 'https://x.com',
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'Discord',
                  url: 'https://discord.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.label}
                  aria-label={social.label}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#080910',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.background = '#10121d'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.background = '#080910'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* ── DIVIDER ── */}
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                marginBottom: '18px',
              }}
            />

            {/* ── METADATA & COPYRIGHT ROW ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.42)',
                letterSpacing: '0.02em',
                marginBottom: '20px',
              }}
            >
              <div>All rights reserved © 2026 Soultechies.</div>
              <div>Architected & Engineered with Soul in Kolkata</div>
            </div>

            {/* ── MASSIVE BRANDMARK WATERMARK (Edge-to-edge subtle gradient) ── */}
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                lineHeight: 0.78,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(48px, 14vw, 76px)',
                  fontWeight: 900,
                  letterSpacing: '-0.045em',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 75%, transparent 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                  transform: 'translateY(10%)',
                }}
              >
                SOULTECHIES
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
