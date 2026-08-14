import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Sequence: 01 -> 39 -> 64 -> 85 -> 99
const SEQUENCE = [
  { value: '01', tensDir: 'up', unitsDir: 'down' },
  { value: '39', tensDir: 'up', unitsDir: 'down' },
  { value: '64', tensDir: 'down', unitsDir: 'up' },
  { value: '85', tensDir: 'up', unitsDir: 'down' },
  { value: '99', tensDir: 'down', unitsDir: 'up' },
]

const STEP_INTERVAL = 1.15 // seconds between digit transitions

// Single digit renderer with true vertical slide-out AND slide-in animation.
// direction = 'up' (old slides out UP, new enters from DOWN)
// direction = 'down' (old slides out DOWN, new enters from UP)
function SingleDigit({ char, direction = 'up' }) {
  const [displayChar, setDisplayChar] = useState(char)
  const [prevChar, setPrevChar] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (char !== displayChar) {
      setPrevChar(displayChar)
      setDisplayChar(char)
    }
  }, [char, displayChar])

  useLayoutEffect(() => {
    if (!prevChar || !containerRef.current) return

    const currentEl = containerRef.current.querySelector('.digit-current')
    const prevEl = containerRef.current.querySelector('.digit-prev')

    if (!currentEl || !prevEl) return

    const isUp = direction === 'up'
    const exitY = isUp ? '-100%' : '100%'
    const enterY = isUp ? '100%' : '-100%'

    // Slide OLD digit out vertically
    gsap.fromTo(
      prevEl,
      { y: '0%', opacity: 1 },
      { y: exitY, opacity: 0, duration: 0.8, ease: 'power3.inOut' }
    )

    // Slide NEW digit in vertically from opposite direction
    gsap.fromTo(
      currentEl,
      { y: enterY, opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          setPrevChar(null)
        },
      }
    )
  }, [displayChar, prevChar, direction])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '0.62em',
        height: '1.1em',
        overflow: 'hidden',
      }}
    >
      {/* Previous digit sliding out */}
      {prevChar !== null && (
        <span
          className="digit-prev"
          style={{
            position: 'absolute',
            lineHeight: 1,
            willChange: 'transform, opacity',
          }}
        >
          {prevChar}
        </span>
      )}

      {/* Current digit sliding in */}
      <span
        className="digit-current"
        style={{
          position: 'absolute',
          lineHeight: 1,
          willChange: 'transform, opacity',
        }}
      >
        {displayChar}
      </span>
    </div>
  )
}

export default function Preloader({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const overlayRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const counter = counterRef.current

    // Start visible immediately — zero delay
    gsap.set(counter, { opacity: 1, y: 0 })

    const tl = gsap.timeline({ delay: 0 })

    // 2. Step through 01 -> 39 -> 64 -> 85 -> 99
    SEQUENCE.slice(1).forEach((_, idx) => {
      tl.call(() => {
        setStepIndex(idx + 1)
      }, null, `+=${STEP_INTERVAL}`)
    })

    // 3. Pause on 99
    tl.to({}, { duration: 0.8 })

    // 4. Fade out counter and hazy backdrop overlay
    tl.to(counter, {
      opacity: 0,
      y: -15,
      duration: 0.6,
      ease: 'power2.in',
    })

    tl.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onComplete) onComplete()
      },
    }, '-=0.2')

    return () => tl.kill()
  }, [onComplete])

  const stepObj = SEQUENCE[stepIndex]
  const tensChar = stepObj.value[0]
  const unitsChar = stepObj.value[1]

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        // Hazy dark backdrop with frosted glass blur over WebGPU canvas
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={counterRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(140px, 22vw, 240px)',
          color: '#dcdfe8',
          letterSpacing: '-0.03em',
          userSelect: 'none',
        }}
      >


        {/* 2-Digit row: Tens (slides UP) and Units (slides DOWN) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.02em',
          }}
        >
          <SingleDigit char={tensChar} direction={stepObj.tensDir} />
          <SingleDigit char={unitsChar} direction={stepObj.unitsDir} />
        </div>
      </div>
    </div>
  )
}
