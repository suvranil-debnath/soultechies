import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function KolkataMapOverlay({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const mapImageRef = useRef(null)

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Sync with Scene.jsx: map reveal starts at p=0.85 and completes at p=1.0
    // Using ScrollTrigger.create with onUpdate for precise progress-based control
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress

        // Map starts fading in at p=0.85 (after Earth zoom reaches full) and fully shown by p=1.0
        const mapStart = 0.85
        const mapEnd = 1.0

        if (p < mapStart) {
          // Completely hidden before the reveal window
          containerRef.current.style.opacity = '0'
          containerRef.current.style.pointerEvents = 'none'
          if (mapImageRef.current) {
            mapImageRef.current.style.filter = 'blur(8px) brightness(2.0)'
            mapImageRef.current.style.transform = 'scale(1.15)'
          }
        } else {
          // Smooth linear fade in from p=0.85 to p=1.0
          const t = (p - mapStart) / (mapEnd - mapStart)
          const eased = t * t * (3 - 2 * t) // smoothstep

          containerRef.current.style.opacity = eased.toFixed(4)
          containerRef.current.style.pointerEvents = eased > 0.5 ? 'auto' : 'none'

          if (mapImageRef.current) {
            // Blur clears and scale resets as map comes in (cinematic satellite reveal)
            const blur = (1 - eased) * 8
            const scale = 1.15 - eased * 0.15 // 1.15 -> 1.0
            mapImageRef.current.style.filter = `blur(${blur.toFixed(2)}px) brightness(${(1 + (1 - eased) * 1.0).toFixed(2)})`
            mapImageRef.current.style.transform = `scale(${scale.toFixed(4)})`
          }
        }
      },
    })

    return () => {
      st.kill()
    }
  }, [isPreloaderDone])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11,
        pointerEvents: 'none',
        opacity: 0,
        overflow: 'hidden',
        // Transparent background so the 3D scene bleeds through during transition
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Full-Frame Kolkata Street Map — shown at full viewport, unzoomed */}
      <img
        ref={mapImageRef}
        src="/textures/kolkata-map.png"
        alt="Kolkata Map"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
          willChange: 'transform, filter, opacity',
          transform: 'scale(1.15)',
          filter: 'blur(8px) brightness(2.0)',
          transformOrigin: '50% 50%',
        }}
      />
    </div>
  )
}
