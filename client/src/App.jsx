import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import Scene from './canvas/Scene'
import Preloader from './components/Preloader'
import AboutSection from './components/AboutSection'
import HeroSection from './components/HeroSection'
import KolkataMapOverlay from './components/KolkataMapOverlay'
import ProjectShowcase from './components/ProjectShowcase'
import WorkedWithSection from './components/WorkedWithSection'
import Navbar from './components/Navbar'
import { useScrollTimeline } from './hooks/useScrollTimeline'

function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const sceneSnapRef = useRef(null)

  // Initialize Lenis smooth scroll + GSAP ScrollTrigger
  useScrollTimeline(isPreloaderDone)

  // Lock scroll during preloader, reset to top, and refresh on complete
  useEffect(() => {
    if (!isPreloaderDone) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
      window.scrollTo(0, 0)
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [isPreloaderDone])

  // Called by HeroSection once it has measured the 'O' gap pixel offset from screen center
  const handleGapMeasured = useCallback((screenOffsetX) => {
    // screenOffsetX = gapCenterX - viewportCenterX (negative when gap is left of center)
    // We pass the raw pixel offset to Scene — it translates the canvas div by that many px
    console.log('[App] O-gap screen offset from center:', screenOffsetX.toFixed(1), 'px')
    if (sceneSnapRef.current) {
      sceneSnapRef.current(screenOffsetX)
    } else {
      console.warn('[App] sceneSnapRef not set yet')
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: '#000',
        color: '#fff',
        overflowX: 'hidden',
      }}
    >
      {/* Layer 0: WebGPU Black Hole Canvas (fixed behind everything) */}
      <Scene
        isPreloaderDone={isPreloaderDone}
        registerSnapCallback={(fn) => { sceneSnapRef.current = fn }}
      />

      {/* Layer 1: Scrollable content (hero wordmark, about us section, map, project showcase, worked with stage) */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroSection
          isPreloaderDone={isPreloaderDone}
          onGapMeasured={handleGapMeasured}
        />
        <AboutSection isPreloaderDone={isPreloaderDone} />
        <KolkataMapOverlay isPreloaderDone={isPreloaderDone} />
        <ProjectShowcase isPreloaderDone={isPreloaderDone} />
        <WorkedWithSection isPreloaderDone={isPreloaderDone} />
      </div>

      {/* Layer 2: Preloader overlay (highest, removed on complete) */}
      {!isPreloaderDone && (
        <Preloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      {/* Layer 3: Bottom Navbar (above all after preloader) */}
      <Navbar isPreloaderDone={isPreloaderDone} />
    </div>
  )
}

export default App
