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
          img.style.opacity      = '0'
          img.style.transform    = 'scale(0.28)'
          img.style.filter       = 'blur(12px) brightness(2.5)'
          // Tight initial pinpoint mask
          const initMask = 'radial-gradient(ellipse 18% 14% at 50% 50%, black 0%, black 30%, transparent 100%)'
          img.style.maskImage        = initMask
          img.style.webkitMaskImage  = initMask
          return
        }

        const t     = (p - MAP_START) / (MAP_END - MAP_START)
        const eased = 1 - Math.pow(1 - t, 2.8)

        // ── Container fade-in
        el.style.opacity       = eased.toFixed(4)
        el.style.pointerEvents = t > 0.3 ? 'auto' : 'none'

        // ── Image scale + blur-to-sharp
        const imgScale   = 0.28 + eased * 0.72   // 0.28 → 1.0
        const blur       = (1 - eased) * 10
        const brightness = 1 + (1 - eased) * 1.5

        img.style.transform = `scale(${imgScale.toFixed(4)})`
        img.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)})`
        img.style.opacity   = Math.min(1, t * 2.5).toFixed(4)

        // ── Radial gradient mask — directly on the img so it clips the map's
        //    own rectangular background, not an outer wrapper.
        //
        //    Key design: soft zone spans 30%→100% of the ellipse (70% of radius
        //    is a gradient fade). This creates a wide, feathered edge that
        //    always melts into the black background — even at full size.
        //
        //    Final ellipse is capped at 85%×68% (not 100%) so there is ALWAYS
        //    a visible vignette blending the corners into black.
        const rx   = 18 + eased * 67    // 18% → 85%
        const ry   = 14 + eased * 54    // 14% → 68%  (landscape aspect)
        const mask = `radial-gradient(ellipse ${rx.toFixed(1)}% ${ry.toFixed(1)}% at 50% 50%, black 0%, black 30%, transparent 100%)`
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
          // Initial mask: tight pinpoint, hard center fades to transparent
          maskImage:       'radial-gradient(ellipse 18% 14% at 50% 50%, black 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 18% 14% at 50% 50%, black 0%, black 30%, transparent 100%)',
        }}
      />
    </div>
  )
}

