import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection({ isPreloaderDone }) {
  const footerRef = useRef(null)
  const [isQrZoomed, setIsQrZoomed] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to specific section progress
  const scrollToSection = (targetProgress) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: maxScroll * targetProgress, behavior: 'smooth' })
  }

  // =========================================================================
  // CURTAIN-UP SCROLL TRANSITION (p: 0.915 → 1.00)
  // The footer curtain slides up from translateY(100%) to translateY(0%)
  // completely covering the Contact Us / Robot section from the bottom.
  // =========================================================================
  useEffect(() => {
    if (!isPreloaderDone || !footerRef.current) return

    const footer = footerRef.current

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress

        if (p < 0.95) {
          footer.style.transform = 'translateY(100%)'
          footer.style.opacity = '0'
          footer.style.visibility = 'hidden'
          footer.style.pointerEvents = 'none'
        } else {
          // Slide up smoothly like a solid curtain
          const t = (p - 0.95) / 0.05
          const curtainEase = 1 - Math.pow(1 - t, 2.5) // smooth cubic deceleration
          const translateY = (100 * (1 - curtainEase)).toFixed(2)

          footer.style.transform = `translateY(${translateY}%)`
          footer.style.opacity = '1'
          footer.style.visibility = 'visible'
          footer.style.pointerEvents = t > 0.4 ? 'auto' : 'none'
        }
      },
    })

    return () => st.kill()
  }, [isPreloaderDone])

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 35,
        backgroundColor: '#03040b',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: 'clamp(72px, 12vh, 132px) clamp(24px, 5vw, 72px) 0 clamp(24px, 5vw, 72px)',
        transform: 'translateY(100%)',
        visibility: 'hidden',
        pointerEvents: 'none',
        boxShadow: '0 -25px 80px rgba(0, 0, 0, 0.95)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Ambient Gradient Glows (Left indigo nebula + Subtle top sheen) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '55vw',
          height: '65vh',
          background: 'radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.4) 30%, rgba(99, 102, 241, 0.5) 70%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* ========================================================================= */}
      {/* TOP AREA: QR CODE CARD + MULTI-COLUMN NAVIGATION + BACK TO TOP BUTTON      */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'clamp(24px, 4vw, 60px)',
          zIndex: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side: QR Code Neural Hub Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            maxWidth: '320px',
          }}
        >
          {/* Interactive QR Code Box */}
          <div
            onClick={() => setIsQrZoomed(!isQrZoomed)}
            style={{
              width: 'clamp(72px, 7.5vw, 92px)',
              height: 'clamp(72px, 7.5vw, 92px)',
              borderRadius: '20px',
              backgroundColor: '#0a091d',
              border: '1px solid rgba(168, 85, 247, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)'
              e.currentTarget.style.borderColor = '#a855f7'
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0px)'
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.28)'
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)'
            }}
          >
            {/* Custom High-Tech Stylized QR SVG */}
            <svg
              width="60%"
              height="60%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Top Left Target */}
              <rect x="2" y="2" width="7" height="7" rx="1.5" />
              <rect x="4.5" y="4.5" width="2" height="2" fill="#ffffff" />
              {/* Outer Top Right Target */}
              <rect x="15" y="2" width="7" height="7" rx="1.5" />
              <rect x="17.5" y="4.5" width="2" height="2" fill="#ffffff" />
              {/* Outer Bottom Left Target */}
              <rect x="2" y="15" width="7" height="7" rx="1.5" />
              <rect x="4.5" y="17.5" width="2" height="2" fill="#ffffff" />
              {/* Neural Data Grid Points */}
              <path d="M15 15h2v2h-2z" fill="#ffffff" />
              <path d="M19 15h3v3h-3z" fill="#ffffff" />
              <path d="M15 19h3v3h-3z" fill="#ffffff" />
              <path d="M10 5v4h4" />
              <path d="M5 10v4h4" />
              <path d="M12 12h.01" />
            </svg>
          </div>

          {/* QR Text Info */}
          <div>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(12px, 1.1vw, 13.5px)',
                fontWeight: 600,
                color: '#ffffff',
                margin: '0 0 4px 0',
                lineHeight: 1.35,
              }}
            >
              Scan this QR code to connect with Soultech.
            </p>
            <button
              type="button"
              onClick={() => setIsQrZoomed(!isQrZoomed)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'rgba(216, 180, 254, 0.8)',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(216, 180, 254, 0.8)')}
            >
              Click to zoom
            </button>
          </div>
        </div>

        {/* Center & Right Navigation Columns */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(36px, 7vw, 110px)',
            flexWrap: 'wrap',
          }}
        >
          {/* Column 1: Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(168, 85, 247, 0.85)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              PAGES
            </span>
            {[
              { label: 'Home', action: () => scrollToTop() },
              { label: 'About Us', action: () => scrollToSection(0.32) },
              { label: 'Map Ecosystem', action: () => scrollToSection(0.56) },
              { label: 'Projects', action: () => scrollToSection(0.68) },
              { label: 'Contact', action: () => scrollToSection(0.86) },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(13px, 1.15vw, 14.5px)',
                  fontWeight: 500,
                  color: hoveredNav === item.label ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease, transform 0.25s ease',
                  transform: hoveredNav === item.label ? 'translateX(4px)' : 'translateX(0px)',
                  textDecoration: item.label === 'Home' ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Column 2: Solutions / Expertise */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(168, 85, 247, 0.85)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              CAPABILITIES
            </span>
            {[
              '3D Web Experiences',
              'Full-Stack Web App',
              'AI & Automation',
              'UI/UX & Branding',
              'Custom Architecture',
            ].map((item) => (
              <span
                key={item}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(13px, 1.15vw, 14.5px)',
                  color: 'rgba(255, 255, 255, 0.65)',
                  cursor: 'default',
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Column 3: Socials & Comms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(168, 85, 247, 0.85)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              NETWORK
            </span>
            {[
              { label: 'LinkedIn', url: 'https://linkedin.com' },
              { label: 'Instagram', url: 'https://instagram.com' },
              { label: 'X (Twitter)', url: 'https://x.com' },
              { label: 'GitHub', url: 'https://github.com' },
              { label: 'Discord', url: 'https://discord.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(13px, 1.15vw, 14.5px)',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease, transform 0.25s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'
                  e.currentTarget.style.transform = 'translateX(0px)'
                }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Far Right: Circular Back to Top Button */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          style={{
            width: 'clamp(42px, 4vw, 50px)',
            height: 'clamp(42px, 4vw, 50px)',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#a855f7'
            e.currentTarget.style.borderColor = '#d8b4fe'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(168, 85, 247, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'
            e.currentTarget.style.transform = 'translateY(0px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MIDDLE SECTION: CRISP DIVIDER & METADATA BAR                              */}
      {/* ========================================================================= */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', paddingTop: '20px' }}>
        {/* Subtle Horizontal Divider */}
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '16px',
          }}
        />

        {/* Metadata Copyright & Attribution */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.04em',
          }}
        >
          <div>All rights reserved © 2026 by Soultechies</div>
          <div>
            Architected & Engineered with{' '}
            <span style={{ color: '#d8b4fe', fontWeight: 600 }}>Soul</span> in Kolkata
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM HEROIC BRAND TYPOGRAPHY (SOULTECHIES - True Edge-to-Edge Minimalist) */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-1 * clamp(24px, 5vw, 72px))',
          marginRight: 'calc(-1 * clamp(24px, 5vw, 72px))',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          lineHeight: 0.74,
          marginTop: 'clamp(6px, 1.2vh, 16px)',
          zIndex: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(58px, 14.8vw, 240px)',
            fontWeight: 900,
            letterSpacing: '-0.048em',
            margin: 0,
            padding: 0,
            textAlign: 'center',
            width: '100%',
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.75) 45%, rgba(255, 255, 255, 0.18) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
            transform: 'translateY(11%)',
          }}
        >
          SOULTECHIES
        </h1>
      </div>

      {/* Optional Fullscreen QR Code Zoom Modal */}
      {isQrZoomed && (
        <div
          onClick={() => setIsQrZoomed(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 4, 11, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '36px',
              borderRadius: '28px',
              backgroundColor: '#0a091d',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(168, 85, 247, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              maxWidth: '340px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                boxSizing: 'border-box',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#03040b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="7" height="7" rx="1" />
                <rect x="4.5" y="4.5" width="2" height="2" fill="#03040b" />
                <rect x="15" y="2" width="7" height="7" rx="1" />
                <rect x="17.5" y="4.5" width="2" height="2" fill="#03040b" />
                <rect x="2" y="15" width="7" height="7" rx="1" />
                <rect x="4.5" y="17.5" width="2" height="2" fill="#03040b" />
                <path d="M15 15h2v2h-2z" fill="#03040b" />
                <path d="M19 15h3v3h-3z" fill="#03040b" />
                <path d="M15 19h3v3h-3z" fill="#03040b" />
                <path d="M10 5v4h4" />
                <path d="M5 10v4h4" />
                <path d="M12 12h.01" />
              </svg>
            </div>
            <div>
              <h4
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 6px 0',
                }}
              >
                SOULTECH NEURAL HUB
              </h4>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12.5px',
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Scan with any smartphone camera to instantly initiate direct communication with our leadership.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                backgroundColor: '#150f33',
                color: '#d8b4fe',
                fontFamily: "'Space Grotesk', monospace",
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
