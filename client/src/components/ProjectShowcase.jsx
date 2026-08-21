import React, { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { ArrowUp, ArrowDown, ExternalLink, ArrowLeft, ArrowRight, Eye } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export const projectsData = [
  {
    id: 1,
    title: 'PRIME TOWER',
    year: '2025',
    category: 'Commercial Architecture',
    description: 'A 45-story commercial high-rise in the business district, featuring a sustainable double-skin facade and a sky garden bridging two kinetic volumes.',
    tags: ['Sustainable Design', 'Glass Facade', 'Urban Integration'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 2,
    title: 'THE AXEL',
    year: '2024',
    category: 'Mixed-Use Spatial',
    description: 'Curved parametric facade structures that redefine the city skyline. Intersecting circular floor plans create dynamic internal courtyards and fluid public spaces.',
    tags: ['Parametric Design', 'Public Space', 'Mixed-Use'],
    image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 3,
    title: 'MODERNIST PAVILION',
    year: '2023',
    category: 'Cultural Center',
    description: 'A minimalist white cement structure contrasting against natural landscapes. Designed as a seamless flow between interior gallery spaces and exterior sculpture gardens.',
    tags: ['Minimalism', 'Cast Concrete', 'Cultural Space'],
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
  {
    id: 4,
    title: 'NEXUS SPATIAL LAB',
    year: '2025',
    category: 'Cybernetic Tech',
    description: 'A futuristic research facility integrating holographic spatial interfaces, adaptive kinetic facade shading, and relativistic real-time computing pipelines.',
    tags: ['Spatial Computing', 'Kinetic Shading', 'Net Zero'],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    link: '#',
  },
]

export default function ProjectShowcase({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const textContentRef = useRef(null)

  // Carousel indices: circular infinite navigation
  const prevIndex = (currentIndex - 1 + projectsData.length) % projectsData.length
  const nextIndex = (currentIndex + 1) % projectsData.length

  const currentProject = projectsData[currentIndex]
  const prevProject = projectsData[prevIndex]
  const nextProject = projectsData[nextIndex]

  // Transition handler: direction = 1 (next / up) or -1 (prev / down)
  const handleNavigate = (dir) => {
    if (isAnimating) return
    setIsAnimating(true)

    const textEl = textContentRef.current
    if (textEl) {
      // Smooth exit animation for text
      gsap.to(textEl, {
        y: dir > 0 ? -26 : 26,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.26,
        ease: 'power2.in',
        onComplete: () => {
          if (dir > 0) {
            setCurrentIndex((prev) => (prev + 1) % projectsData.length)
          } else {
            setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length)
          }

          // Smooth enter animation for new text
          gsap.fromTo(
            textEl,
            { y: dir > 0 ? 26 : -26, opacity: 0, filter: 'blur(6px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.42,
              ease: 'power3.out',
              onComplete: () => setIsAnimating(false),
            }
          )
        },
      })
    } else {
      if (dir > 0) {
        setCurrentIndex((prev) => (prev + 1) % projectsData.length)
      } else {
        setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length)
      }
      setTimeout(() => setIsAnimating(false), 380)
    }
  }

  // Scroll Trigger Reveal: enters at p >= 0.82, fully visible & interactive at p >= 0.90
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

        // p < 0.82: completely hidden
        // p 0.82 -> 0.90: fade in & slide up into pinned state
        // p >= 0.90: 100% visible & pinned
        if (p < 0.82) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          el.style.transform = 'translateY(36px)'
        } else if (p <= 0.90) {
          const t = (p - 0.82) / 0.08
          const eased = t * (2 - t) // ease-out
          el.style.opacity = eased.toFixed(4)
          el.style.pointerEvents = eased > 0.4 ? 'auto' : 'none'
          el.style.transform = `translateY(${(36 * (1 - eased)).toFixed(1)}px)`
        } else {
          el.style.opacity = '1'
          el.style.pointerEvents = 'auto'
          el.style.transform = 'translateY(0px)'
        }
      },
    })

    return () => st.kill()
  }, [isPreloaderDone])

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
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.88) 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          height: '86vh',
          margin: '0 auto',
          padding: 'clamp(16px, 2.5vw, 40px) clamp(20px, 4vw, 64px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)',
          gap: 'clamp(24px, 4vw, 72px)',
          alignItems: 'center',
        }}
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: Project Details & Metadata (Reference 2)     */}
        {/* ========================================================= */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            position: 'relative',
            zIndex: 2,
            padding: '24px 28px 24px 0',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 65%, transparent 100%)',
            borderRadius: '24px',
          }}
        >
          {/* Animated Text Content Box */}
          <div
            ref={textContentRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 1.8vh, 22px)',
              minHeight: '380px',
              justifyContent: 'center',
            }}
          >
            {/* Index Counter & Year */}
            <div
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

            {/* Project Big Title */}
            <h2
              style={{
                fontFamily: "'Outfit', 'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 4.8vw, 68px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
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

          {/* ========================================================= */}
          {/* ACTION BUTTONS & PAGINATION PILLS (Reference 1 Bottom)     */}
          {/* ========================================================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: 'clamp(20px, 3.5vh, 40px)',
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
                        handleNavigate(idx > currentIndex ? 1 : -1)
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

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Infinite Vertical Carousel (Reference 1 Drawing)           */}
        {/* Glimpse of Prev at Top | Main Big in Center | Glimpse of Next at Bottom   */}
        {/* ========================================================================= */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Outer container holding the 3 vertical cards */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 1. TOP PEEK CARD (Glimpse of Previous Image) */}
            <div
              onClick={() => handleNavigate(-1)}
              style={{
                position: 'absolute',
                top: '-10%',
                width: '86%',
                height: '24%',
                borderRadius: '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: 0.45,
                transform: 'scale(0.92)',
                filter: 'blur(2px) brightness(0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.75'
                e.currentTarget.style.filter = 'blur(0px) brightness(0.85)'
                e.currentTarget.style.transform = 'scale(0.95)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.45'
                e.currentTarget.style.filter = 'blur(2px) brightness(0.65)'
                e.currentTarget.style.transform = 'scale(0.92)'
              }}
            >
              <img
                src={prevProject.image}
                alt={prevProject.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 80%)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  PREV // {prevProject.title}
                </span>
                <ArrowUp size={14} color="#00f0ff" />
              </div>
            </div>

            {/* 2. CENTER MAIN ACTIVE CARD (Large, Crisp, Focused) */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '62%',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(0, 240, 255, 0.12)',
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: 3,
              }}
            >
              <img
                key={currentProject.id}
                src={currentProject.image}
                alt={currentProject.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  animation: 'fadeInScale 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                }}
              />

              {/* Cybernetic HUD Frame Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                }}
              >
                {/* Top Corner Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.65)',
                      border: '1px solid rgba(0, 240, 255, 0.4)',
                      fontFamily: "'Space Grotesk', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: '#00f0ff',
                      fontWeight: 600,
                    }}
                  >
                    FEATURED PROJECT // 0{currentProject.id}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(0,0,0,0.65)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', letterSpacing: '0.1em' }}>
                      ARCHIVE LIVE
                    </span>
                  </div>
                </div>

                {/* Bottom Corner Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '22px',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: '#ffffff',
                      }}
                    >
                      {currentProject.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', monospace",
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '2px',
                      }}
                    >
                      {currentProject.category} // {currentProject.year}
                    </div>
                  </div>

                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      pointerEvents: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontFamily: "'Space Grotesk', monospace",
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#00f0ff'
                      e.currentTarget.style.color = '#000000'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                      e.currentTarget.style.color = '#ffffff'
                    }}
                  >
                    <Eye size={14} />
                    <span>VIEW DETAILS</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3. BOTTOM PEEK CARD (Glimpse of Next Image) */}
            <div
              onClick={() => handleNavigate(1)}
              style={{
                position: 'absolute',
                bottom: '-10%',
                width: '86%',
                height: '24%',
                borderRadius: '18px',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: 0.45,
                transform: 'scale(0.92)',
                filter: 'blur(2px) brightness(0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
                transition: 'all 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.75'
                e.currentTarget.style.filter = 'blur(0px) brightness(0.85)'
                e.currentTarget.style.transform = 'scale(0.95)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.45'
                e.currentTarget.style.filter = 'blur(2px) brightness(0.65)'
                e.currentTarget.style.transform = 'scale(0.92)'
              }}
            >
              <img
                src={nextProject.image}
                alt={nextProject.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 80%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  NEXT // {nextProject.title}
                </span>
                <ArrowDown size={14} color="#00f0ff" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0.3;
            transform: scale(1.06);
            filter: blur(8px);
          }
          to {
            opacity: 1.0;
            transform: scale(1.0);
            filter: blur(0px);
          }
        }
      `}</style>
    </div>
  )
}
