import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection({ isPreloaderDone, onGapMeasured }) {
  const sectionRef = useRef(null)
  const sRef = useRef(null)
  const ultechiesRef = useRef(null)
  const gapRef = useRef(null) // ← the invisible 'O' spacer div
  const cardsWrapperRef = useRef(null) // ← container for the 2 metric cards
  const topNavRef = useRef(null) // ← top-right services indicator (APP | WEBAPP | SOLUTIONS)
  const subTextRef = useRef(null) // ← supporting subtext & CTA group (Reference Match)
  const entryDoneRef = useRef(false)

  useEffect(() => {
    if (!isPreloaderDone || entryDoneRef.current) return
    entryDoneRef.current = true

    const s = sRef.current
    const ultechies = ultechiesRef.current
    const cardsWrapper = cardsWrapperRef.current
    const topNav = topNavRef.current
    const subText = subTextRef.current

    // Initial state: both words scaled down & blurred, tucked behind black hole
    gsap.set(s, { x: '8vw', scale: 0.3, opacity: 0, filter: 'blur(12px)' })
    gsap.set(ultechies, { x: '-8vw', scale: 0.3, opacity: 0, filter: 'blur(12px)' })

    if (cardsWrapper) {
      gsap.set(cardsWrapper, { y: 28, opacity: 0, filter: 'blur(8px)' })
    }

    if (topNav) {
      gsap.set(topNav, { y: -18, opacity: 0, filter: 'blur(6px)' })
    }

    if (subText) {
      gsap.set(subText, { y: 28, opacity: 0, filter: 'blur(8px)' })
    }

    // Entry: S and ULTECHIES emerge outward from behind the black hole
    const entryTl = gsap.timeline({ delay: 0.2 })

    entryTl.to(s, {
      x: '0vw', scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.4, ease: 'power3.out',
    })

    entryTl.to(ultechies, {
      x: '0vw', scale: 1, opacity: 1, filter: 'blur(0px)',
      duration: 1.4, ease: 'power3.out',
    }, '-=1.4')

    // Top-right services bar and bottom-right cards slide smoothly into place
    if (topNav) {
      entryTl.to(topNav, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.9')
    }

    if (cardsWrapper) {
      entryTl.to(cardsWrapper, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.8')
    }

    if (subText) {
      entryTl.to(subText, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.8')
    }

    // After entry animation: measure where the 'O' gap ACTUALLY is
    // = midpoint between S's right edge and ULTECHIES's left edge
    entryTl.call(() => {
      if (!sRef.current || !ultechiesRef.current || !onGapMeasured) return
      const sRect = sRef.current.getBoundingClientRect()
      const uRect = ultechiesRef.current.getBoundingClientRect()
      const gapCenterX = (sRect.right + uRect.left) / 2
      const viewportCenterX = window.innerWidth / 2
      const offsetFromCenter = gapCenterX - viewportCenterX
      console.log('[HeroSection] gap at', gapCenterX.toFixed(1), 'px, offset from center:', offsetFromCenter.toFixed(1), 'px')
      onGapMeasured(offsetFromCenter)
    })

    // Scroll-driven Horizontal Wordmark Exit: S drifts strictly LEFT, ULTECHIES drifts strictly RIGHT
    // Completes early (by p = 0.18 scroll) so text is 100% off-screen before black hole zoom & dissolution!
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        if (!s || !ultechies) return

        if (p <= 0.002) {
          // At top of scroll (hero view) — preserve standard entry position
          if (entryTl.progress() >= 1) {
            s.style.transform = 'translateX(0vw)'
            s.style.opacity = '1'
            s.style.filter = 'blur(0px)'
            ultechies.style.transform = 'translateX(0vw)'
            ultechies.style.opacity = '1'
            ultechies.style.filter = 'blur(0px)'

            if (topNavRef.current) {
              topNavRef.current.style.transform = 'translateY(0px)'
              topNavRef.current.style.opacity = '1'
              topNavRef.current.style.filter = 'blur(0px)'
              topNavRef.current.style.pointerEvents = 'auto'
              topNavRef.current.style.visibility = 'visible'
            }

            if (cardsWrapperRef.current) {
              cardsWrapperRef.current.style.transform = 'translateY(0px)'
              cardsWrapperRef.current.style.opacity = '1'
              cardsWrapperRef.current.style.filter = 'blur(0px)'
              cardsWrapperRef.current.style.pointerEvents = 'auto'
              cardsWrapperRef.current.style.visibility = 'visible'
            }

            if (subTextRef.current) {
              subTextRef.current.style.transform = 'translateY(0px)'
              subTextRef.current.style.opacity = '1'
              subTextRef.current.style.filter = 'blur(0px)'
              subTextRef.current.style.pointerEvents = 'auto'
              subTextRef.current.style.visibility = 'visible'
            }
          }
          return
        }

        // Scroll exit for wordmark (p: 0.00 -> 0.07)
        const t = Math.min(1, p / 0.07)
        const ease = t * t // power2.in
        const op = Math.max(0, 1 - t)
        const blur = (t * 10).toFixed(1)

        s.style.transform = `translateX(${(-ease * 75).toFixed(1)}vw)`
        s.style.opacity = op.toFixed(4)
        s.style.filter = `blur(${blur}px)`

        ultechies.style.transform = `translateX(${(ease * 75).toFixed(1)}vw)`
        ultechies.style.opacity = op.toFixed(4)
        ultechies.style.filter = `blur(${blur}px)`

        // Cards and topNav exit slightly faster (p: 0.00 -> 0.045) so canvas is clean before black hole zoom
        const cardT = Math.min(1, p / 0.045)
        const cardEase = cardT * cardT
        const cardOp = Math.max(0, 1 - cardT * 1.25)
        const cardBlur = (cardT * 6).toFixed(1)

        if (topNavRef.current) {
          topNavRef.current.style.transform = `translateY(${(-cardEase * 18).toFixed(1)}px)`
          topNavRef.current.style.opacity = cardOp.toFixed(4)
          topNavRef.current.style.filter = `blur(${cardBlur}px)`
          topNavRef.current.style.pointerEvents = cardOp > 0.1 ? 'auto' : 'none'
          topNavRef.current.style.visibility = cardOp <= 0 ? 'hidden' : 'visible'
        }

        if (cardsWrapperRef.current) {
          cardsWrapperRef.current.style.transform = `translateY(${(cardEase * 26).toFixed(1)}px)`
          cardsWrapperRef.current.style.opacity = cardOp.toFixed(4)
          cardsWrapperRef.current.style.filter = `blur(${cardBlur}px)`
          cardsWrapperRef.current.style.pointerEvents = cardOp > 0.1 ? 'auto' : 'none'
          cardsWrapperRef.current.style.visibility = cardOp <= 0 ? 'hidden' : 'visible'
        }

        if (subTextRef.current) {
          subTextRef.current.style.transform = `translateY(${(cardEase * 26).toFixed(1)}px)`
          subTextRef.current.style.opacity = cardOp.toFixed(4)
          subTextRef.current.style.filter = `blur(${cardBlur}px)`
          subTextRef.current.style.pointerEvents = cardOp > 0.1 ? 'auto' : 'none'
          subTextRef.current.style.visibility = cardOp <= 0 ? 'hidden' : 'visible'
        }
      },
    })

    return () => {
      entryTl.kill()
      st.kill()
    }
  }, [isPreloaderDone, onGapMeasured])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '1260vh',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Pinned Fixed Container — guarantees zero vertical movement when scrolling! */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* S */}
          <div
            ref={sRef}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              WebkitFontSmoothing: 'antialiased',
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: '#ffffff',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              marginRight: 'clamp(60px, 10vw, 140px)',
            }}
          >
            S
          </div>

          {/* 'O' gap — measured after entry animation; black hole snaps here */}
          <div
            ref={gapRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(120px, 20vw, 280px)',
              height: 'clamp(120px, 20vw, 280px)',
              pointerEvents: 'none',
            }}
          />

          {/* ULTECHIES */}
          <div
            ref={ultechiesRef}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              WebkitFontSmoothing: 'antialiased',
              fontSize: 'clamp(64px, 12vw, 180px)',
              color: '#ffffff',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              marginLeft: 'clamp(60px, 10vw, 140px)',
            }}
          >
            ULTECHIES
          </div>
        </div>
      </div>

      {/* Top-Right Services Indicator (Reference Match: APP | WEBAPP | SOLUTIONS) */}
      <div
        ref={topNavRef}
        className="hero-top-nav"
      >
        <span className="hero-top-nav-item">APP</span>
        <span className="hero-top-nav-divider">|</span>
        <span className="hero-top-nav-item">WEBAPP</span>
        <span className="hero-top-nav-divider">|</span>
        <span className="hero-top-nav-item">SOLUTIONS</span>
      </div>

      {/* Bottom-Left Supporting Subtext & Action Group (Reference Match) */}
      <div
        ref={subTextRef}
        className="hero-subtext-cluster"
      >
        <p className="hero-subtext-paragraph">
          Scalable web apps, mobile platforms, and bespoke digital solutions — engineered for real impact.
        </p>

        <div className="hero-subtext-actions">
          <div
            className="hero-subtext-icon-btn"
            title="Solutions & Architecture"
          >
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
              <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
              <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
              <rect x="2.5" y="12" width="2" height="2" fill="currentColor" />
              <rect x="6" y="12" width="2" height="2" fill="currentColor" />
              <rect x="2.5" y="15.5" width="2" height="2" fill="currentColor" />
              <rect x="6" y="15.5" width="2" height="2" fill="currentColor" />
            </svg>
          </div>

          <div
            className="hero-subtext-icon-btn"
            title="Next Section"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="4" x2="12" y2="20" />
              <polyline points="6 14 12 20 18 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Credibility Cards Layer (Exact Style & Height Match) */}
      <div
        ref={cardsWrapperRef}
        className="hero-cards-cluster"
      >
        <div className="hero-cards-cluster-inner">
          {/* ================================================================ */}
          {/* CARD 1: Solid Obsidian Black (Matches Card 2's Style & Height)   */}
          {/* ================================================================ */}
          <div className="hero-ref-card-left">
            {/* Top Text */}
            <div style={{ fontFamily: "'Outfit', sans-serif" }}>
              <div
                style={{
                  fontSize: 'clamp(14.5px, 1.05vw, 16px)',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                100K+ Lines of Code
              </div>
              <p
                style={{
                  margin: '6px 0 0 0',
                  fontSize: 'clamp(12px, 0.88vw, 13px)',
                  fontWeight: 300,
                  lineHeight: 1.45,
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.01em',
                }}
              >
                Clean, scalable &<br />performance-focused work.
              </p>
            </div>

            {/* Bottom: 2 Squircle Icon Buttons (matching solid dark styling) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Button 1: </> Code icon */}
              <div
                className="hero-ref-squircle-btn"
                style={{ width: '40px', height: '40px', borderRadius: '13px' }}
                title="Code"
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '14.5px',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                  }}
                >
                  &lt;/&gt;
                </span>
              </div>

              {/* Button 2: 100K+ stat badge */}
              <div
                className="hero-ref-squircle-btn"
                style={{ height: '40px', padding: '0 12px', borderRadius: '13px' }}
                title="100K+ Lines of Code"
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '12.5px',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    color: '#ffffff',
                  }}
                >
                  100K+
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CARD 2: Portrait, Taller, Solid Obsidian Black with Watch & Arrow */}
          {/* ================================================================ */}
          <div className="hero-ref-card-right">
            {/* Top / Center: Smartwatch Frame (Reference Match - Scaled Down) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Watch Top Strap */}
              <div
                style={{
                  width: '36px',
                  height: '5px',
                  background: 'linear-gradient(to top, #161824, #0a0b12)',
                  borderRadius: '3px 3px 0 0',
                  opacity: 0.55,
                }}
              />

              {/* Watch Outer Case */}
              <div
                style={{
                  position: 'relative',
                  width: '84px',
                  height: '92px',
                  borderRadius: '19px',
                  background: 'linear-gradient(145deg, #242738 0%, #10111a 100%)',
                  padding: '2px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {/* Watch Crown Button on Right Edge */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-3.5px',
                    top: '18px',
                    width: '3px',
                    height: '12px',
                    borderRadius: '2px',
                    background: 'linear-gradient(to bottom, #555868, #181924)',
                  }}
                />

                {/* Watch OLED Screen */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '17px',
                    background: '#07080e',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px 4px',
                    textAlign: 'center',
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.95)',
                  }}
                >
                  {/* Top Live Pill Tag */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '1.5px 6px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      marginBottom: '2px',
                    }}
                  >
                    <span style={{ color: '#38bdf8', fontSize: '8px', lineHeight: 1 }}>◷</span>
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '7.5px',
                        fontWeight: 400,
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
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '19px',
                      fontWeight: 300,
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
                      gap: '3px',
                      fontSize: '7.5px',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 400,
                      color: '#38bdf8',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <span
                      style={{
                        width: '2.5px',
                        height: '2.5px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        boxShadow: '0 0 4px #38bdf8',
                      }}
                    />
                    <span>Reliability</span>
                  </div>
                </div>
              </div>

              {/* Watch Bottom Strap */}
              <div
                style={{
                  width: '36px',
                  height: '5px',
                  background: 'linear-gradient(to bottom, #161824, #0a0b12)',
                  borderRadius: '0 0 3px 3px',
                  opacity: 0.55,
                }}
              />
            </div>

            {/* Bottom Text */}
            <div style={{ padding: '0 2px' }}>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.92)',
                  marginBottom: '1px',
                  letterSpacing: '-0.01em',
                }}
              >
                Support & Reliability
              </div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '9px',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: 0,
                  maxWidth: '100px',
                }}
              >
                We're always here when you need us.
              </p>
            </div>

            {/* Bottom-Right Circular Arrow Button (Much Smaller) */}
            <div
              className="hero-ref-circle-btn"
              title="Support & Reliability"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10111a"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
