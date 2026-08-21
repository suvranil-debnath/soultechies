import React, { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export default function KolkataMapOverlay({ isPreloaderDone }) {
  const containerRef = useRef(null)
  const mapImageRef  = useRef(null)

  useEffect(() => {
    if (!isPreloaderDone || !containerRef.current) return

    // Synced with Scene.jsx & ProjectShowcase:
    //   p < 0.76: hidden (Earth diving / fading)
    //   p 0.76 -> 0.86: map iris-bursts from center into full sharp view
    //   p 0.86 -> 0.94: map gently blurs & enhances brightness to become the glowing backdrop for Project Showcase
    //   p >= 0.94: persistent luminous atmospheric map background (reaches end of scroll without dead space)
    const BURST_START = 0.76
    const BURST_END   = 0.86
    const BLUR_START  = 0.86
    const BLUR_END    = 0.94

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

        if (p < BURST_START) {
          el.style.opacity       = '0'
          el.style.pointerEvents = 'none'
          img.style.opacity      = '0'
          img.style.transform    = 'scale(0.28)'
          img.style.filter       = 'blur(12px) brightness(2.5)'
          const initMask = 'radial-gradient(ellipse 18% 14% at 50% 50%, black 0%, black 30%, transparent 100%)'
          img.style.maskImage        = initMask
          img.style.webkitMaskImage  = initMask
          return
        }

        if (p <= BURST_END) {
          // Phase 1: Iris burst from center dot to full sharp map (0.76 -> 0.86)
          const t = (p - BURST_START) / (BURST_END - BURST_START)
          const eased = 1 - Math.pow(1 - t, 2.8)

          el.style.opacity       = eased.toFixed(4)
          el.style.pointerEvents = t > 0.3 ? 'auto' : 'none'

          const imgScale   = 0.28 + eased * 0.72   // 0.28 → 1.0
          const blur       = (1 - eased) * 10
          const brightness = 1 + (1 - eased) * 1.5

          img.style.transform = `scale(${imgScale.toFixed(4)})`
          img.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)})`
          img.style.opacity   = Math.min(1, t * 2.5).toFixed(4)

          const rx   = 18 + eased * 67    // 18% → 85%
          const ry   = 14 + eased * 54    // 14% → 68%
          const mask = `radial-gradient(ellipse ${rx.toFixed(1)}% ${ry.toFixed(1)}% at 50% 50%, black 0%, black 30%, transparent 100%)`
          img.style.maskImage        = mask
          img.style.webkitMaskImage  = mask
        } else if (p <= BLUR_END) {
          // Phase 2: Map smoothly transitions into comfortable ambient backdrop for Project Showcase (0.86 -> 0.94)
          const t = (p - BLUR_START) / (BLUR_END - BLUR_START)
          const eased = t * (2 - t) // ease-out

          el.style.opacity       = '1'
          el.style.pointerEvents = 'none'

          const imgScale   = 1.0 + eased * 0.05   // 1.0 → 1.05
          const blur       = eased * 5.5          // Soft 5.5px blur diffuses dense clusters
          const brightness = 1.0 + (1 - eased) * 0.5 + eased * 0.20 // 1.5 → 1.20
          const opacity    = 1.0 - eased * 0.50   // 1.0 → 0.50 balanced background visibility
          const contrast   = 1.0 + eased * 0.15   // 1.0 → 1.15

          img.style.transform = `scale(${imgScale.toFixed(4)})`
          img.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)})`
          img.style.opacity   = opacity.toFixed(4)

          if (eased > 0.6) {
            img.style.maskImage        = 'none'
            img.style.webkitMaskImage  = 'none'
          } else {
            const rx   = 85 + eased * 15
            const ry   = 68 + eased * 32
            const mask = `radial-gradient(ellipse ${rx.toFixed(1)}% ${ry.toFixed(1)}% at 50% 50%, black 0%, black 85%, transparent 100%)`
            img.style.maskImage        = mask
            img.style.webkitMaskImage  = mask
          }
        } else {
          // Phase 3: Pinned comfortable ambient Kolkata map backdrop behind Project Showcase (p > 0.94)
          el.style.opacity       = '1'
          el.style.pointerEvents = 'none'
          img.style.transform    = 'scale(1.05)'
          img.style.filter       = 'blur(5.5px) brightness(1.20) contrast(1.15)'
          img.style.opacity      = '0.50'
          img.style.maskImage    = 'none'
          img.style.webkitMaskImage = 'none'
        }
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
          objectFit:       'cover',
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

