import React, { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export default function KolkataMapOverlay({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const mapImageRef  = useRef(null)

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Synced with Scene.jsx:
    //   p < 0.88  → hidden (Earth diving / fading)
    //   p 0.88→1.0 → map iris-bursts from center, edges always blend into black
    const MAP_START = 0.88
    const MAP_END   = 1.00

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p   = self.progress
        const el  = containerRef.current
        const img = mapImageRef.current
        if (!el || !img) return

        if (p < MAP_START) {
          el.style.opacity       = '0'
          el.style.pointerEvents = 'none'
          // Reset to hidden pinpoint state
          img.style.opacity      = '0'
          img.style.transform    = 'scale(0.28)'
          img.style.filter       = 'blur(12px) brightness(2.5)'
          img.style.maskImage         = 'radial-gradient(ellipse 30% 25% at 50% 50%, black 55%, transparent 100%)'
          img.style.webkitMaskImage   = img.style.maskImage
          return
        }

        const t     = (p - MAP_START) / (MAP_END - MAP_START)
        const eased = 1 - Math.pow(1 - t, 2.8)   // ease-out — slightly less aggressive

        // ── Container fade-in
        el.style.opacity       = eased.toFixed(4)
        el.style.pointerEvents = t > 0.3 ? 'auto' : 'none'

        // ── Image: starts at 0.28 (clearly visible) and expands to 1.0
        const imgScale   = 0.28 + eased * 0.72   // 0.28 → 1.0
        const blur       = (1 - eased) * 10        // 10px → 0px
        const brightness = 1 + (1 - eased) * 1.5  // 2.5 → 1.0

        img.style.transform = `scale(${imgScale.toFixed(4)})`
        img.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)})`
        img.style.opacity   = Math.min(1, t * 2.5).toFixed(4)   // quick fade-in

        // ── Radial gradient mask applied DIRECTLY to the image
        //    so it clips the image's own rectangular background, not an outer wrapper.
        //    Ellipse expands: 30%×25% → 100%×85%
        //    Soft falloff zone is always 55%→100% of the ellipse (smooth blend into black)
        const rx   = 30  + eased * 70    // 30%  → 100% (horizontal radius)
        const ry   = 25  + eased * 60    // 25%  → 85%  (vertical — map is landscape)
        const mask = `radial-gradient(ellipse ${rx.toFixed(1)}% ${ry.toFixed(1)}% at 50% 50%, black 55%, transparent 100%)`
        img.style.maskImage        = mask
        img.style.webkitMaskImage  = mask
      },
    })

    return () => st.kill()
  }, [isPreloaderDone])

  return (
    <div
      ref={containerRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         11,
        pointerEvents:  'none',
        opacity:        0,
        background:     'transparent',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      <img
        ref={mapImageRef}
        src="/textures/kolkata-map.png"
        alt="Kolkata Map"
        style={{
          width:           '100vw',
          height:          '100vh',
          objectFit:       'contain',
          maxWidth:        '100%',
          maxHeight:       '100%',
          display:         'block',
          willChange:      'transform, filter, opacity, mask-image',
          transform:       'scale(0.28)',
          transformOrigin: '50% 50%',
          filter:          'blur(12px) brightness(2.5)',
          opacity:         0,
          // Initial mask — tight ellipse, edges completely fade to black
          maskImage:       'radial-gradient(ellipse 30% 25% at 50% 50%, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 30% 25% at 50% 50%, black 55%, transparent 100%)',
        }}
      />
    </div>
  )
}

