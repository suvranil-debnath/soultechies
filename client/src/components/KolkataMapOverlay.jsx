import React, { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export default function KolkataMapOverlay({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const mapImageRef = useRef(null)

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Perfectly synced with Scene.jsx:
    //   p < 0.88  → hidden (Earth is diving)
    //   p 0.88→1.0 → map bursts from center (iris / portal open from Kolkata dot)
    const MAP_START = 0.88
    const MAP_END   = 1.00

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        const el  = containerRef.current
        const img = mapImageRef.current
        if (!el || !img) return

        if (p < MAP_START) {
          el.style.opacity       = '0'
          el.style.pointerEvents = 'none'
          img.style.transform    = 'scale(0.04)'
          img.style.filter       = 'blur(16px) brightness(3)'
          img.style.opacity      = '0'
          return
        }

        // t: 0→1 over the map burst window
        const t = (p - MAP_START) / (MAP_END - MAP_START)
        // Cubic ease-out — fast start, settles into full frame
        const eased = 1 - Math.pow(1 - t, 3)

        // Container
        el.style.opacity       = eased.toFixed(4)
        el.style.pointerEvents = t > 0.4 ? 'auto' : 'none'

        // Map iris-burst: scale from pinpoint (0.04) at screen center to full frame (1.0)
        const scale      = 0.04 + eased * 0.96   // 0.04 → 1.0
        const blur       = (1 - eased) * 14       // 14px → 0px
        const brightness = 1 + (1 - eased) * 2.0  // 3.0 → 1.0

        img.style.transform = `scale(${scale.toFixed(4)})`
        img.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)})`
        // Opacity: fast 0→1 in the first half of the burst
        img.style.opacity   = Math.min(1, t * 2).toFixed(4)
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
        // Transparent so the black 3D canvas shows through during Earth fade
        background:     'transparent',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      {/* Map starts as a tiny pinpoint at screen center (where Kolkata target was) */}
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
          willChange:      'transform, filter, opacity',
          transform:       'scale(0.04)',
          transformOrigin: '50% 50%',
          filter:          'blur(16px) brightness(3)',
          opacity:         0,
        }}
      />
    </div>
  )
}
