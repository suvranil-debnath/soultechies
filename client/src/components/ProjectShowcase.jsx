import React, { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const projectsData = [
  {
    id: 1,
    title: 'FACE RECOGNITION ATTENDANCE',
    year: '2025',
    category: 'Mobile Application',
    description: 'A Flutter-based employee attendance system that uses face recognition to identify employees and automatically record attendance. It includes employee registration, face capture, authentication, attendance marking, and attendance history. The app is integrated with Firebase for cloud data synchronization.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Face Recognition', 'REST API', 'Android Studio', 'Git'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 2,
    title: 'ENTERPRISE BILLING SYSTEM',
    year: '2024',
    category: 'Software / Business Utility',
    description: 'A professional billing and invoice management application designed for businesses to create and manage invoices. The system supports customer information, business details, GST calculations, product/service entries, automated totals and invoice generation.',
    tags: ['Flutter', 'Dart', 'Invoice Engine', 'GST Calculation', 'PDF Generation'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 3,
    title: 'HOPZY.IN TRAVEL PLATFORM',
    year: '2024',
    category: 'Full-Stack Travel Platform',
    description: 'A modern online bus booking platform where users can search routes, explore available buses, check schedules and book journeys. Engineered professionally across frontend and backend systems, including booking APIs, passenger records, ticketing, seat selection, availability and cancellations.',
    tags: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'REST APIs', 'Git'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 4,
    title: 'CAR HUNT — CAR RENTAL',
    year: '2024',
    category: 'Full-Stack Web Application',
    description: 'A full-stack car rental and fleet management platform designed for browsing vehicles, managing inventory, calculating rental pricing and handling reservations. The system includes customer/admin workflows, authentication, role-based access control, vehicle inventory, reservations and rental tracking.',
    tags: ['React.js', 'TypeScript', 'Tailwind CSS', 'Material UI', 'Spring Boot', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 5,
    title: 'AI RESUME BUILDER & STUDIO',
    year: '2025',
    category: 'Full-Stack Web Application',
    description: 'A modern resume-building platform designed to help users create clean, structured and ATS-friendly resumes. It provides real-time editing and PDF generation, making it suitable for job seekers who want to quickly create professional resumes.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'PDF Generation', 'ATS Optimization'],
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 6,
    title: 'BUDGET NINJA — EXPENSE TRACKER',
    year: '2023',
    category: 'Full-Stack / Financial Management',
    description: 'An expense-tracking application for managing personal income, expenses and budgets. It includes categorization, budget planning, transaction management, financial reporting and an interactive analytics dashboard.',
    tags: ['Java', 'JSP', 'JDBC', 'HTML', 'CSS', 'JavaScript', 'Git', 'SQL Database'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
]

// 3 sets of projects for seamless infinite track sliding
const EXTENDED_PROJECTS = [
  ...projectsData,
  ...projectsData,
  ...projectsData,
]
const N = projectsData.length

export default function ProjectShowcase({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const carouselViewportRef = useRef(null)
  const trackRef = useRef(null)
  const topMetaRef = useRef(null)
  const textContentRef = useRef(null)

  const [virtualIndex, setVirtualIndex] = useState(N) // Start at index N (first item in middle set)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentIndex = ((virtualIndex % N) + N) % N
  const currentProject = projectsData[currentIndex]

  const CARD_HEIGHT = 480
  const GAP = 32
  const PITCH = CARD_HEIGHT + GAP

  // Helper to compute track Y for a given virtual index
  const getTrackY = (vIdx) => {
    const vpHeight = carouselViewportRef.current?.clientHeight || window.innerHeight || 750
    return vpHeight / 2 - (vIdx * PITCH + CARD_HEIGHT / 2)
  }

  // Initial positioning & window resize sync
  useEffect(() => {
    if (!trackRef.current) return
    const initialY = getTrackY(virtualIndex)
    gsap.set(trackRef.current, { y: initialY })

    const handleResize = () => {
      if (!isAnimating && trackRef.current) {
        gsap.set(trackRef.current, { y: getTrackY(virtualIndex) })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [virtualIndex, isAnimating])

  // Sequential, seamless vertical track sliding handler
  const handleNavigate = (dir) => {
    if (isAnimating || !trackRef.current) return
    setIsAnimating(true)

    const nextVIdx = virtualIndex + dir
    const targetY = getTrackY(nextVIdx)

    // 1. Staggered Text Transition on both top metadata and center text
    const metaEl = topMetaRef.current
    const textEl = textContentRef.current
    const textTargets = [metaEl, textEl].filter(Boolean)

    if (textTargets.length > 0) {
      gsap.to(textTargets, {
        y: dir > 0 ? -24 : 24,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.24,
        ease: 'power2.in',
        onComplete: () => {
          setVirtualIndex(nextVIdx)
          gsap.fromTo(
            textTargets,
            { y: dir > 0 ? 24 : -24, opacity: 0, filter: 'blur(6px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.42,
              ease: 'power3.out',
            }
          )
        },
      })
    } else {
      setVirtualIndex(nextVIdx)
    }

    // 2. Smooth Physical Sliding Animation of the Vertical Track
    gsap.to(trackRef.current, {
      y: targetY,
      duration: 0.68,
      ease: 'power3.inOut',
      onComplete: () => {
        // Seamless loop normalization: keep index in the middle set [N..2N-1]
        let normalized = nextVIdx
        if (normalized >= 2 * N) {
          normalized -= N
        } else if (normalized < N) {
          normalized += N
        }

        if (normalized !== nextVIdx) {
          setVirtualIndex(normalized)
          gsap.set(trackRef.current, { y: getTrackY(normalized) })
        }
        setIsAnimating(false)
      },
    })
  }

  // Scroll Trigger Reveal (1260vh timeline): enters at p >= 0.680, fully visible & interactive at p >= 0.740
  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    const el = containerRef.current

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress

        // p < 0.550: completely hidden
        // p 0.550 -> 0.610: fade in & slide up into pinned state
        // p 0.610 -> 0.800: 100% visible & pinned
        // p > 0.800: pinned in place under WorkedWith slide-up stage
        if (p < 0.550) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          el.style.transform = 'translateY(36px)'
        } else if (p <= 0.610) {
          const t = (p - 0.550) / 0.060
          const eased = t * (2 - t) // ease-out
          el.style.opacity = eased.toFixed(4)
          el.style.pointerEvents = eased > 0.4 ? 'auto' : 'none'
          el.style.transform = `translateY(${(36 * (1 - eased)).toFixed(1)}px)`
        } else {
          el.style.opacity = '1'
          el.style.pointerEvents = p < 0.820 ? 'auto' : 'none'
          el.style.transform = 'translateY(0px)'
        }
      },
    })

    return () => st.kill()
  }, [isPreloaderDone])

  // Compute card state (active, peek, hidden) with twin-set synchronization for glitch-free loop transitions
  const getCardState = (idx, vIdx) => {
    const directDist = idx - vIdx
    if (directDist === 0) return 'active'
    if (directDist === -1 || directDist === 1) return 'peek'

    // Synchronize twin cards in neighboring sets so jump normalizations are 100% invisible
    const twinDistPlus = idx - (vIdx + N)
    const twinDistMinus = idx - (vIdx - N)
    if (twinDistPlus === 0 || twinDistMinus === 0) return 'active'
    if (
      twinDistPlus === -1 ||
      twinDistPlus === 1 ||
      twinDistMinus === -1 ||
      twinDistMinus === 1
    ) {
      return 'peek'
    }

    return 'hidden'
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        opacity: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: '100vw',
          maxWidth: '100%',
          height: '100vh',
          margin: 0,
          padding: '0 clamp(16px, 3vw, 44px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(440px, 1.4fr)',
          gap: 'clamp(20px, 3.5vw, 48px)',
          alignItems: 'center',
        }}
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: Pinned Top Meta, Centered Details, Pinned Bottom Buttons */}
        {/* ========================================================= */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            zIndex: 2,
            padding: 'clamp(36px, 6vh, 64px) clamp(16px, 2.5vw, 36px) clamp(32px, 5vh, 56px) clamp(16px, 2.5vw, 36px)',
            background: 'radial-gradient(ellipse at 15% 50%, rgba(0, 0, 0, 0.45) 0%, transparent 80%)',
            borderRadius: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* 1. TOP EDGE: Index Counter, Year & Category */}
          <div
            ref={topMetaRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: '#00f0ff',
              fontWeight: 600,
            }}
          >
            <span>{String(currentProject.id).padStart(2, '0')}</span>
            <div style={{ width: '40px', height: '1px', background: 'rgba(0, 240, 255, 0.4)' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{currentProject.year}</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ color: '#38bdf8', fontSize: '11px', textTransform: 'uppercase' }}>
              {currentProject.category}
            </span>
          </div>

          {/* 2. CENTER: Project Big Title, Description, Tags & Action Link */}
          <div
            ref={textContentRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 1.8vh, 22px)',
              justifyContent: 'center',
              margin: 'auto 0',
            }}
          >
            {/* Project Big Title */}
            <h2
              style={{
                fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(28px, 3.6vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.06,
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: 0,
                textShadow: '0 4px 24px rgba(0, 240, 255, 0.15)',
              }}
            >
              {currentProject.title}
            </h2>

            {/* Description Paragraph */}
            <p
              style={{
                fontSize: 'clamp(14px, 1.1vw, 16px)',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.72)',
                margin: 0,
                maxWidth: '460px',
                fontWeight: 400,
              }}
            >
              {currentProject.description}
            </p>

            {/* Pill Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              {currentProject.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '11px',
                    fontFamily: "'Space Grotesk', monospace",
                    letterSpacing: '0.04em',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View Project Action */}
            <a
              href={currentProject.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
                fontSize: '13px',
                fontFamily: "'Space Grotesk', monospace",
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'none',
                width: 'fit-content',
                cursor: 'pointer',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00f0ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
            >
              <span>EXPLORE CASE STUDY</span>
              <ExternalLink size={15} style={{ opacity: 0.85 }} />
            </a>
          </div>

          {/* 3. BOTTOM EDGE: Action Buttons & Pagination Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Prev Action Button */}
            <button
              onClick={() => handleNavigate(-1)}
              disabled={isAnimating}
              aria-label="Previous Project"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: isAnimating ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  e.currentTarget.style.borderColor = '#00f0ff'
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.12)'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.transform = 'scale(1.0)'
              }}
            >
              <ArrowLeft size={18} />
            </button>

            {/* Next Action Button */}
            <button
              onClick={() => handleNavigate(1)}
              disabled={isAnimating}
              aria-label="Next Project"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: isAnimating ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  e.currentTarget.style.borderColor = '#00f0ff'
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.12)'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.transform = 'scale(1.0)'
              }}
            >
              <ArrowRight size={18} />
            </button>

            {/* Pagination Indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: '12px',
              }}
            >
              {projectsData.map((_, idx) => {
                const isActive = idx === currentIndex
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx !== currentIndex && !isAnimating) {
                        const diff = idx - currentIndex
                        handleNavigate(diff)
                      }
                    }}
                    style={{
                      height: '4px',
                      width: isActive ? '32px' : '8px',
                      borderRadius: '999px',
                      background: isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: isActive ? '0 0 12px rgba(0, 240, 255, 0.6)' : 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Continuous Physical Sliding Vertical Carousel Track         */}
        {/* Glimpse of Prev at Top | Main Big in Center | Glimpse of Next at Bottom   */}
        {/* ========================================================= */}
        <div
          ref={carouselViewportRef}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Moving Vertical Track holding all cloned cards in physical sequence */}
          <div
            ref={trackRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: `${GAP}px`,
              willChange: 'transform',
            }}
          >
            {EXTENDED_PROJECTS.map((proj, idx) => {
              const cardState = getCardState(idx, virtualIndex)
              const isActive = cardState === 'active'
              const isPeek = cardState === 'peek'

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!isActive && !isAnimating) {
                      handleNavigate(idx - virtualIndex)
                    }
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: `${CARD_HEIGHT}px`,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: !isActive ? 'pointer' : 'default',
                    transform: isActive ? 'scale(1.0)' : 'scale(0.88)',
                    opacity: isActive ? 1.0 : (isPeek ? 0.45 : 0.15),
                    filter: isActive ? 'blur(0px) brightness(1.0)' : 'blur(2px) brightness(0.65)',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.18)'
                      : '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: isActive
                      ? '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 240, 255, 0.12)'
                      : '0 8px 32px rgba(0, 0, 0, 0.6)',
                    transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.65s ease, filter 0.65s ease',
                    zIndex: isActive ? 3 : (isPeek ? 1 : 0),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = '0.70'
                      e.currentTarget.style.filter = 'blur(0px) brightness(0.85)'
                      e.currentTarget.style.transform = 'scale(0.92)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.opacity = isPeek ? '0.45' : '0.15'
                      e.currentTarget.style.filter = 'blur(2px) brightness(0.65)'
                      e.currentTarget.style.transform = 'scale(0.88)'
                    }
                  }}
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading="eager"
                    decoding="sync"
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Sub-text Overlay Only (bottom-left) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 30%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', monospace",
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '2px',
                      }}
                    >
                      {proj.category}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
