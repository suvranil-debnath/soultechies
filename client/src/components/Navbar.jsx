import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Brand Logo component loading /logo.png
function BrandLogo({ height = 44, style = {} }) {
  return (
    <img
      src="/logo.png"
      alt="Soultech Logo"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  )
}

// Two horizontal lines menu icon with smooth hover shortening on bottom line
function TwoLinesIcon({ color = '#1c1c22', isHovered = false }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        width: '38px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '1.2px',
          background: color,
          borderRadius: '1px',
        }}
      />
      <div
        style={{
          width: isHovered ? '26px' : '38px',
          height: '1.2px',
          background: color,
          borderRadius: '1px',
          transition: 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </div>
  )
}

// Close icon for bottom round close button
function CloseIcon({ color = '#ffffff' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L14 14M14 2L2 14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar({ isPreloaderDone }) {
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const leftContentRef = useRef(null)
  const rightContentRef = useRef(null)
  const menuContentRef = useRef(null)
  const closeBtnRef = useRef(null)
  const backdropRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMenuHovered, setIsMenuHovered] = useState(false)

  const lastScrollY = useRef(0)
  const isAnimatingRef = useRef(false)
  const hasEnteredRef = useRef(false)

  // Helper to compute numeric target pixel width (avoids min() string parsing issues in GSAP)
  const getTargetPillWidth = () => Math.min(440, Math.floor(window.innerWidth * 0.92))

  // Reveal animation: ONLY triggers after preloader is completely done!
  useEffect(() => {
    if (!isPreloaderDone || hasEnteredRef.current) return
    hasEnteredRef.current = true

    const wrapper = wrapperRef.current
    const leftContent = leftContentRef.current
    const rightContent = rightContentRef.current

    // Initial hidden state before reveal
    gsap.set(wrapper, { opacity: 0, y: 40, scale: 0.95 })
    gsap.set([leftContent, rightContent], { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.3 })

    // 1. Slow, silky smooth popup of navbar container from bottom
    tl.to(wrapper, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'power3.out',
    })

    // 2. Fade in left menu icon & right Contact CTA button
    tl.to(
      [leftContent, rightContent],
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.4'
    )
  }, [isPreloaderDone])

  // Morphing Menu Expansion Transition (Pill -> Menu Card)
  const handleOpenMenu = () => {
    if (isAnimatingRef.current || isMenuOpen) return
    isAnimatingRef.current = true
    setIsMenuOpen(true)

    const wrapper = wrapperRef.current
    const container = containerRef.current
    const leftContent = leftContentRef.current
    const rightContent = rightContentRef.current
    const menuContent = menuContentRef.current
    const closeBtn = closeBtnRef.current
    const backdrop = backdropRef.current

    // Prepare elements for fluid expansion
    gsap.set(menuContent, { display: 'flex', opacity: 0, y: 15 })
    gsap.set(backdrop, { display: 'block', opacity: 0 })
    gsap.set(closeBtn, { display: 'flex', opacity: 0, scale: 0.6, y: 10 })

    const targetHeight = menuContent.scrollHeight
    const targetWidth = `${getTargetPillWidth()}px`

    const tl = gsap.timeline({
      onComplete: () => {
        setIsExpanded(true)
        isAnimatingRef.current = false
      },
    })

    // 1. Simultaneously shift wrapper position Y upward (0.85s)
    tl.to(wrapper, { y: -48, duration: 0.85, ease: 'power3.inOut' }, 0)

    // 2. Fade in backdrop overlay (0.85s)
    tl.to(backdrop, { opacity: 1, duration: 0.85, ease: 'power3.inOut' }, 0)

    // 3. Fade out left menu icon & right Contact button (0.25s)
    tl.to([leftContent, rightContent], { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)

    // 4. Fluidly morph container width AND height & border radius simultaneously using numeric targetWidth (0.85s)
    tl.to(
      container,
      {
        width: targetWidth,
        height: targetHeight,
        borderRadius: '38px',
        duration: 0.85,
        ease: 'power3.inOut',
      },
      0
    )

    // 5. Fluidly reveal expanded menu content (0.6s)
    tl.to(
      menuContent,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      0.2
    )

    // 6. Reveal close button X (0.6s)
    tl.to(
      closeBtn,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      0.22
    )
  }

  // Morphing Menu Close Transition (EXACT MIRROR OPPOSITE OF OPENING)
  const handleCloseMenu = () => {
    if (isAnimatingRef.current || !isMenuOpen) return
    isAnimatingRef.current = true

    const wrapper = wrapperRef.current
    const container = containerRef.current
    const leftContent = leftContentRef.current
    const rightContent = rightContentRef.current
    const menuContent = menuContentRef.current
    const closeBtn = closeBtnRef.current
    const backdrop = backdropRef.current

    // Check if scrolled down past 80px to return to correct width state
    const isScrolled = window.scrollY > 80
    const targetWidth = isScrolled ? '68px' : `${getTargetPillWidth()}px`

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false)
        setIsExpanded(!isScrolled)
        gsap.set(menuContent, { display: 'none' })
        gsap.set(backdrop, { display: 'none' })
        gsap.set(closeBtn, { display: 'none' })
        gsap.set(container, { height: '56px' })
        isAnimatingRef.current = false
      },
    })

    // 1. Close button X pops down/fades out (exact mirror opposite)
    tl.to(closeBtn, { opacity: 0, scale: 0.6, y: 10, duration: 0.4, ease: 'power3.in' }, 0)

    // 2. Menu content slides down & fades out (exact mirror opposite)
    tl.to(menuContent, { opacity: 0, y: 15, duration: 0.4, ease: 'power3.in' }, 0)

    // 3. Fluidly morph container width & height back simultaneously (0.85s)
    tl.to(
      container,
      {
        width: targetWidth,
        height: '56px',
        borderRadius: '999px',
        duration: 0.85,
        ease: 'power3.inOut',
      },
      0
    )

    // 4. Shift wrapper position Y back down to 0 simultaneously (0.85s)
    tl.to(wrapper, { y: 0, duration: 0.85, ease: 'power3.inOut' }, 0)

    // 5. Fade backdrop overlay out simultaneously (0.85s)
    tl.to(backdrop, { opacity: 0, duration: 0.85, ease: 'power3.inOut' }, 0)

    // 6. If returning to scrolled-down state, keep left/right hidden, otherwise fade back in
    if (!isScrolled) {
      tl.to([leftContent, rightContent], { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.35)
    } else {
      gsap.set([leftContent, rightContent], { opacity: 0 })
    }
  }

  // Scroll-Velocity & Direction Driven Shrink/Expand
  useEffect(() => {
    if (!isPreloaderDone || isMenuOpen) return

    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      // Scrolling down past top section (>80px) -> shrink navbar horizontally to 68px (only brand logo visible)
      if (currentY > 80 && delta > 3 && isExpanded && !isAnimatingRef.current) {
        collapseNavbar()
      }
      // Scrolling up or near top (<=80px) -> expand navbar back to full width
      else if ((delta < -3 || currentY <= 80) && !isExpanded && !isAnimatingRef.current) {
        expandNavbar()
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPreloaderDone, isExpanded, isMenuOpen])

  // Shrink navbar horizontally until ONLY central brand logo remains visible
  const collapseNavbar = () => {
    if (!hasEnteredRef.current || isAnimatingRef.current || isMenuOpen || !isExpanded) return
    isAnimatingRef.current = true
    setIsExpanded(false)

    const container = containerRef.current
    const leftContent = leftContentRef.current
    const rightContent = rightContentRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
      },
    })

    // 1. Fade out left menu icon & right Contact CTA button (0.3s - smooth power2.in)
    tl.to([leftContent, rightContent], { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)

    // 2. Shrink container width horizontally to 68px (0.85s - power3.inOut)
    tl.to(
      container,
      {
        width: '68px',
        duration: 0.85,
        ease: 'power3.inOut',
      },
      0
    )
  }

  // Expand navbar horizontally back to full width (EXACT MIRROR OF COLLAPSE)
  const expandNavbar = () => {
    if (!hasEnteredRef.current || isAnimatingRef.current || isMenuOpen || isExpanded) return
    isAnimatingRef.current = true
    setIsExpanded(true)

    const container = containerRef.current
    const leftContent = leftContentRef.current
    const rightContent = rightContentRef.current

    const targetWidth = `${getTargetPillWidth()}px`

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
      },
    })

    // 1. Expand container width horizontally to full width using targetWidth (0.85s - power3.inOut)
    tl.to(
      container,
      {
        width: targetWidth,
        duration: 0.85,
        ease: 'power3.inOut',
      },
      0
    )

    // 2. Fluidly fade left & right content back in (0.45s - power2.out at t=0.35s as width completes)
    tl.to(
      [leftContent, rightContent],
      {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
      },
      0.35
    )
  }

  // Hover handlers for collapsed state: expanding on hover
  const handleMouseEnterContainer = () => {
    if (!isExpanded && !isMenuOpen && !isAnimatingRef.current) {
      expandNavbar()
    }
  }

  const handleMouseLeaveContainer = () => {
    if (window.scrollY > 80 && isExpanded && !isMenuOpen && !isAnimatingRef.current) {
      collapseNavbar()
    }
  }

  // STRICT GUARD: Navbar is NOT rendered in DOM at all while preloader is running!
  if (!isPreloaderDone) return null

  const mainLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Referral', href: '#referral' },
    { label: 'Pricing', href: '#pricing' },
  ]

  const leftSecondary = ['Support', 'Terms of Use', 'Policy Privacy']
  const rightSecondary = ['Linkedin', 'Instagram']

  return (
    <>
      {/* Dimmed backdrop when menu is open */}
      <div
        ref={backdropRef}
        onClick={handleCloseMenu}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'none',
          willChange: 'opacity',
        }}
      />

      {/* Main Floating Wrapper Pinned at Fixed Screen Position (bottom: 32px) */}
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {/* Morphing Navbar Container */}
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnterContainer}
          onMouseLeave={handleMouseLeaveContainer}
          style={{
            position: 'relative',
            width: 'min(440px, 92vw)',
            height: '56px',
            borderRadius: '999px',
            background: '#d4d4de', // Light lavender-grey
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            userSelect: 'none',
            willChange: 'width, height, border-radius',
          }}
        >
          {/* ONE SINGLE PERMANENT BRAND LOGO (100% Stationary, Un-faded, Fixed Position & Size!) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '28px',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            onClick={handleOpenMenu}
            title="Soultech Logo"
          >
            <BrandLogo height={44} />
          </div>

          {/* STATE A: Collapsed Floating Pill Elements (Left Menu Icon & Right Contact CTA) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '56px',
              padding: '4px 6px 4px 18px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Left: Two horizontal lines Menu Button with Hover animation */}
            <div
              ref={leftContentRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '6px',
                willChange: 'opacity',
                zIndex: 10,
              }}
              onClick={handleOpenMenu}
              onMouseEnter={() => setIsMenuHovered(true)}
              onMouseLeave={() => setIsMenuHovered(false)}
              title="Open Menu"
            >
              <TwoLinesIcon color="#1c1c22" isHovered={isMenuHovered} />
            </div>

            {/* Right: Dark Pill CTA Button ("Contact") */}
            <div ref={rightContentRef} style={{ willChange: 'opacity', zIndex: 10 }}>
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  background: '#1c1c22',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#32323a'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1c1c22'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Contact
              </button>
            </div>
          </div>

          {/* STATE B: Expanded Menu Card Content */}
          <div
            ref={menuContentRef}
            style={{
              display: 'none',
              flexDirection: 'column',
              padding: '36px 32px 32px 32px',
              width: '100%',
              boxSizing: 'border-box',
              position: 'absolute',
              top: 0,
              left: 0,
              willChange: 'opacity, transform',
            }}
          >
            {/* Top row: Home header ONLY (Logo is permanently pinned in absolute center at top: 28px) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                height: '44px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                  fontSize: '28px',
                  fontWeight: 500,
                  color: '#6b6b78',
                  letterSpacing: '-0.02em',
                }}
              >
                Home
              </span>
            </div>

            {/* Main Nav Links */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '28px',
              }}
            >
              {mainLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleCloseMenu}
                  style={{
                    fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#1c1c22',
                    textDecoration: 'none',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    transition: 'transform 0.2s, color 0.2s',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#50505e'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1c1c22'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Horizontal Divider */}
            <div
              style={{
                height: '1px',
                background: 'rgba(0, 0, 0, 0.12)',
                marginBottom: '24px',
              }}
            />

            {/* Secondary Links Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leftSecondary.map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={handleCloseMenu}
                    style={{
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1c1c22',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rightSecondary.map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={handleCloseMenu}
                    style={{
                      fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1c1c22',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom CTA Button ("Contact") */}
            <button
              style={{
                width: '100%',
                padding: '16px',
                background: '#1c1c22',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#32323a'
                e.currentTarget.style.transform = 'scale(1.01)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1c1c22'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Circular Close Button (X) ABSOLUTELY POSITIONED AT FIXED OFFSET BELOW CARD */}
        <div
          ref={closeBtnRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'none',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#1c1c22',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            willChange: 'transform, opacity',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onClick={handleCloseMenu}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#32323a'
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1c1c22'
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
          }}
          title="Close Menu"
        >
          <CloseIcon color="#ffffff" />
        </div>
      </div>
    </>
  )
}
