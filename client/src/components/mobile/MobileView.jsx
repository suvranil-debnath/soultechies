import React, { useState, useEffect, useMemo } from 'react'
import Navbar from '../Navbar'
import {
  ArrowRight,
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
} from 'lucide-react'
import { projectsData } from '../ProjectShowcase'
import { SERVICES_DATA } from '../ServicesSection'
import { CLIENT_LOGOS, PROCESS_STEPS } from '../WorkedWithSection'

export default function MobileView() {
  // Mobile Project Carousel State
  const [currentProjectIdx, setCurrentProjectIdx] = useState(0)

  // Mobile Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Web Application',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Live Kolkata (IST) Time
  const [kolkataTime, setKolkataTime] = useState('')
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setKolkataTime(`${timeStr} IST`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentProject = useMemo(() => {
    return projectsData[currentProjectIdx] || projectsData[0]
  }, [currentProjectIdx])

  const nextProject = () => {
    setCurrentProjectIdx((prev) => (prev + 1) % projectsData.length)
  }

  const prevProject = () => {
    setCurrentProjectIdx((prev) => (prev - 1 + projectsData.length) % projectsData.length)
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
        {/* 3. ABOUT US SECTION                                                       */}
        {/* ========================================================================= */}
        <section
          id="mobile-about"
          style={{
            padding: '48px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#030712',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#00f0ff',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              01 / ABOUT US
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 6.5vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              Engineering Digital Reality for Modern Leaders
            </h2>

            <p
              style={{
                fontSize: '14.5px',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '16px',
              }}
            >
              Soultechies is a boutique technology and design engineering agency. We turn ambitious visions into robust, production-grade applications that stand out in speed, reliability, and visual craftsmanship.
            </p>

            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.55)',
                marginBottom: '28px',
              }}
            >
              From custom bus ticketing platforms and AI-driven resume studios to facial recognition attendance suites and e-commerce stores, we engineer systems that drive measurable business impact.
            </p>

            {/* 4 Pillars Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {[
                { label: 'Latency', value: '< 200ms', desc: 'Ultra-fast response' },
                { label: 'Uptime', value: '99.99%', desc: 'Cloud resilience' },
                { label: 'Security', value: 'End-to-End', desc: 'Hardened role auth' },
                { label: 'Design', value: 'Pixel Perfect', desc: 'Modern cyber UX' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 12px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontWeight: 600,
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '2px',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SERVICES SECTION                                                       */}
        {/* ========================================================================= */}
        <section
          id="mobile-services"
          style={{
            padding: '48px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#000000',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#ffe135',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              02 / WHAT WE BUILD
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 6.5vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
              }}
            >
              Specialized Digital Capabilities
            </h2>

            {/* Services Cards Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SERVICES_DATA.map((srv) => (
                <div
                  key={srv.id}
                  style={{
                    padding: '20px 18px',
                    borderRadius: '18px',
                    background: '#07080f',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700,
                        color: srv.accent || '#ffe135',
                      }}
                    >
                      {srv.number}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {srv.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '6px',
                    }}
                  >
                    {srv.category}
                  </h3>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                    }}
                  >
                    {srv.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {srv.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.75)',
                        }}
                      >
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: srv.accent || '#ffe135',
                          }}
                        />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. LOCATION & REGIONAL ECOSYSTEM                                          */}
        {/* ========================================================================= */}
        <section
          id="mobile-location"
          style={{
            padding: '48px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#030712',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#38bdf8',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              03 / LOCATION
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 6.5vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              Rooted in Kolkata, Engineering for the World
            </h2>

            {/* Static Map Graphic Card */}
            <div
              style={{
                borderRadius: '20px',
                background: '#080912',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  height: '180px',
                  width: '100%',
                  position: 'relative',
                  backgroundImage: 'url(/textures/kolkata-map.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay vignette */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.4), rgba(3, 7, 18, 0.95))',
                  }}
                />

                {/* Pin marker */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#00f0ff',
                      boxShadow: '0 0 16px #00f0ff',
                      border: '2px solid #ffffff',
                    }}
                  />
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.85)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Kolkata Tech Hub
                  </div>
                </div>
              </div>

              {/* Card Footer details */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} color="#00f0ff" />
                  <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.85)' }}>
                    {kolkataTime || 'Loading IST...'}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                  Global Delivery
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FEATURED PROJECTS SHOWCASE                                             */}
        {/* ========================================================================= */}
        <section
          id="mobile-projects"
          style={{
            padding: '48px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#000000',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#00f0ff',
                  textTransform: 'uppercase',
                }}
              >
                04 / FEATURED WORK
              </div>

              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                0{currentProjectIdx + 1} / 0{projectsData.length}
              </div>
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 6.5vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}
            >
              Selected Client Projects
            </h2>

            {/* Active Project Card */}
            <div
              style={{
                borderRadius: '22px',
                background: '#090a12',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden',
                marginBottom: '18px',
              }}
            >
              {/* Project Image Viewport */}
              <div
                style={{
                  width: '100%',
                  height: '210px',
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
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  {currentProject.year} • {currentProject.category}
                </div>
              </div>

              {/* Project Info */}
              <div style={{ padding: '20px 18px' }}>
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '8px',
                    lineHeight: 1.25,
                  }}
                >
                  {currentProject.title}
                </h3>

                <p
                  style={{
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '16px',
                  }}
                >
                  {currentProject.description}
                </p>

                {/* Tech Tags */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '20px',
                  }}
                >
                  {currentProject.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={currentProject.link || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#00f0ff',
                    textDecoration: 'none',
                  }}
                >
                  EXPLORE CASE STUDY
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Carousel Navigation Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={prevProject}
                  aria-label="Previous project"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextProject}
                  aria-label="Next project"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(0, 240, 255, 0.12)',
                    border: '1px solid rgba(0, 240, 255, 0.35)',
                    color: '#00f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Dots Indicator */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {projectsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentProjectIdx(idx)}
                    aria-label={`Jump to project ${idx + 1}`}
                    style={{
                      height: '5px',
                      width: idx === currentProjectIdx ? '22px' : '6px',
                      borderRadius: '999px',
                      background: idx === currentProjectIdx ? '#00f0ff' : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CLIENTS & PROCESS SECTION                                              */}
        {/* ========================================================================= */}
        <section
          id="mobile-process"
          style={{
            padding: '48px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: '#030712',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0 20px', maxWidth: '640px', margin: '0 auto 24px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#c084fc',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              05 / CLIENTS & PROCESS
            </div>

            <h2
              style={{
                fontSize: 'clamp(24px, 6.5vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Our Proven Methodology
            </h2>
          </div>

          {/* Client Logos CSS Marquee (0% CPU / No WebGL) */}
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              padding: '16px 0',
              marginBottom: '36px',
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '36px',
                width: 'max-content',
                animation: 'mobileMarquee 24s linear infinite',
              }}
            >
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, lIdx) => (
                <div
                  key={lIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.65,
                  }}
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    style={{
                      height: '24px',
                      width: 'auto',
                      filter: 'grayscale(100%) brightness(1.6)',
                      display: 'block',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.75)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Process Steps */}
          <div
            style={{
              padding: '0 20px',
              maxWidth: '640px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                style={{
                  padding: '18px 16px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: step.accent || '#c084fc',
                    lineHeight: 1,
                    marginTop: '3px',
                  }}
                >
                  {step.step}
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}
                  >
                    {step.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
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
        {/* 9. FOOTER SECTION                                                         */}
        {/* ========================================================================= */}
        <footer
          style={{
            padding: '36px 20px 48px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#020308',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <img
                src="/logo.png"
                alt="Soultech Logo"
                style={{ height: '28px', width: 'auto', display: 'block' }}
              />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                }}
              >
                SOULTECHIES
              </span>
            </div>

            <p
              style={{
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.5)',
                maxWidth: '380px',
                margin: '0 auto 20px',
              }}
            >
              Crafting premium digital experiences, full-stack web platforms, and automated software.
            </p>

            {/* Quick Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                marginBottom: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              <button
                onClick={() => scrollToSection('mobile-hero')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('mobile-about')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('mobile-services')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('mobile-projects')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection('mobile-contact')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Contact
              </button>
            </div>

            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.35)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '18px',
              }}
            >
              © {new Date().getFullYear()} Soultechies. All rights reserved. Built for performance.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
