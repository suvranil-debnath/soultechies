import React, { useEffect, useRef } from 'react'
import * as THREE from 'three/webgpu'
import { pass } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { BlackHoleSimulation } from './blackhole.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const userConfig = {
  "adaptiveMinStep": 0.15,
  "blackHoleMass": 0.30000000000000004,
  "bloomRadius": 6.938893903907228e-18,
  "bloomStrength": 0.78,
  "bloomThreshold": 0.030000000000000013,
  "diskBrightness": 5,
  "diskDensity": 1,
  "diskDifferentialRotation": 1,
  "diskEdgeSoftnessInner": 0,
  "diskEdgeSoftnessOuter": 0.3,
  "diskInnerColor": "#a84b23",
  "diskInnerRadius": 5,
  "diskInnerThickness": 0.7,
  "diskOpacityFalloff": 0.5,
  "diskOuterColor": "#7f1b00",
  "diskOuterRadius": 12,
  "diskOuterThickness": 0.5,
  "diskRadialFalloff": 2,
  "diskRotationSpeed": 20,
  "diskTemperature": 49.78,
  "diskThickness": 1.3,
  "diskTurbulence": 0.9,
  "dopplerStrength": 0.4,
  "gravitationalLensing": 3,
  "heightDensityFalloff": 5,
  "maxRayDistance": 500,
  "nebula1Brightness": 0.01,
  "nebula1Color": "#071f44",
  "nebula1Density": 0.5,
  "nebula1Scale": 2,
  "nebula2Brightness": 0.21,
  "nebula2Color": "#010615",
  "nebula2Density": 0.05,
  "nebula2Scale": 5.5,
  "nebulaBlend": 0.55,
  "nebulaBrightness": 0.07,
  "nebulaColor1": "#113844",
  "nebulaColor2": "#1b214a",
  "nebulaDensity": 0.35,
  "nebulaDetailScale": 2.4,
  "nebulaEnabled": false,
  "nebulaOffsetX": 0,
  "nebulaOffsetY": 0,
  "nebulaOffsetZ": 0,
  "nebulaScale": 3,
  "nebulaScale1": 3,
  "nebulaScale2": 3.5,
  "nebulaSpeed": 0.065,
  "noiseAnimAmplitude": 2,
  "noiseAnimFrequency": 4.2,
  "noiseEvolutionSpeed": 5,
  "qualityPreset": "medium",
  "rayJitter": 1,
  "raySteps": 68,
  "ringBrightness": 0.4,
  "ringContrast": 0.95,
  "ringEnabled": true,
  "ringNoiseAmplitude": 1.45,
  "ringNoiseEnabled": true,
  "ringNoiseLacunarity": 1.9,
  "ringNoiseOctaves": 2,
  "ringNoiseOffset": -0.2,
  "ringNoisePersistence": 0.45,
  "ringNoiseScale": 4.5,
  "ringNoiseSharpness": 4,
  "ringScale": 0.83,
  "ringSharpness": 10,
  "ringTwist": 10.3,
  "starBackgroundColor": "#000000",
  "starBrightness": 0.5,
  "starDensity": 0.1,
  "starSize": 1.2,
  "starsEnabled": true,
  "stepJitter": 0,
  "stepSize": 1,
  "temperatureFalloff": 4.42,
  "temporalAA": false,
  "temporalFrames": 16,
  "turbulenceBrightness": -0.05,
  "turbulenceCycleTime": 5,
  "turbulenceLacunarity": 2.9,
  "turbulenceOffset": 0.1,
  "turbulencePersistence": 0.8500000000000001,
  "turbulencePrimaryScale": 0.65,
  "turbulenceScale": 2,
  "turbulenceStretch": 1.18,
  "turbulenceSecondaryScale": 1.3,
  "turbulenceSecondaryStrength": 0.15,
  "turbulenceSharpness": 8.5
}

export default function Scene({ isPreloaderDone, registerSnapCallback }) {
  const containerRef = useRef(null)
  const cameraRef = useRef(null)
  const simulationRef = useRef(null)
  const baseOffsetPx = useRef(0) // pixel translateX after O-gap snap

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationFrameId = null
    let isDisposed = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const renderW = window.innerWidth
    const renderH = window.innerHeight

    const camera = new THREE.PerspectiveCamera(
      60,
      renderW / renderH,
      0.1,
      1000
    )
    // Start zoomed in close — inside the black hole for preloader reveal effect
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGPURenderer({ antialias: true })
    renderer.setSize(renderW, renderH)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = -0.5
    controls.minDistance = 5
    controls.maxDistance = 80
    controls.target.set(0, 0, 0)
    controls.enabled = false

    const blackHoleSimulation = new BlackHoleSimulation(scene, userConfig)
    blackHoleSimulation.createBlackHole()
    simulationRef.current = blackHoleSimulation

    let postProcessing = null
    let lastFrameTime = performance.now()

    function animate() {
      if (isDisposed) return
      animationFrameId = requestAnimationFrame(animate)

      const currentTime = performance.now()
      const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.033)
      lastFrameTime = currentTime

      controls.update()
      blackHoleSimulation.update(deltaTime, camera)

      if (postProcessing) {
        postProcessing.render()
      } else {
        renderer.render(scene, camera)
      }
    }

    renderer.init().then(() => {
      if (isDisposed) return
      postProcessing = new THREE.PostProcessing(renderer)

      const scenePass = pass(scene, camera)
      const scenePassColor = scenePass.getTextureNode()

      const bloomPassNode = bloom(scenePassColor)
      bloomPassNode.threshold.value = userConfig.bloomThreshold
      bloomPassNode.strength.value = userConfig.bloomStrength
      bloomPassNode.radius.value = userConfig.bloomRadius

      postProcessing.outputNode = scenePassColor.add(bloomPassNode)
      animate()
    }).catch(err => {
      console.warn('WebGPU init failed:', err)
      animate()
    })

    const handleResize = () => {
      if (isDisposed) return
      const rW = window.innerWidth
      const rH = window.innerHeight
      camera.aspect = rW / rH
      camera.updateProjectionMatrix()
      renderer.setSize(rW, rH)
      blackHoleSimulation.onResize(rW, rH)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      isDisposed = true
      controls.dispose()
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Preloader done → zoom camera out from inside black hole
  useEffect(() => {
    if (!isPreloaderDone || !cameraRef.current) return

    const camera = cameraRef.current

    // Zoom out from inside BH to standard viewing distance
    gsap.to(camera.position, {
      x: 0, y: -5, z: 20,
      duration: 1.8,
      ease: 'power2.inOut',
    })

    // Register snap callback — called by App after HeroSection measures the real O-gap pixel
    if (registerSnapCallback) {
      registerSnapCallback((offsetPx) => {
        const sim = simulationRef.current
        if (!sim) return

        // Convert pixel offset to exact aspect-corrected screen UV offset
        const aspect = window.innerWidth / window.innerHeight
        const targetNormX = (offsetPx / window.innerWidth) * 2.0 * aspect
        const targetAngle = 0.488 // +28 deg diagonal tilt (bottom-left up to top-right)

        console.log('[Scene] Snapping blackHoleScreenOffset to', targetNormX.toFixed(3), 'angle to 0.488 rad')

        const proxy = { x: 0, angle: 0 }
        gsap.to(proxy, {
          x: targetNormX,
          angle: targetAngle,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            sim.setBlackHoleScreenOffset(proxy.x, 0)
            sim.setBlackHoleAngle(proxy.angle)
          },
          onComplete: () => {
            baseOffsetPx.current = targetNormX
          }
        })

        // Animate camera position further back (z = 27) to reduce black hole size
        gsap.to(camera.position, {
          y: -0.6,
          z: 27,
          duration: 1.4,
          ease: 'power2.inOut',
        })
      })
    }
  }, [isPreloaderDone, registerSnapCallback])

  // Scroll-driven: Black Hole Zoom Trajectory & Particle Dissolution
  useEffect(() => {
    if (!isPreloaderDone) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '85% top',
      scrub: 1.2,
      onUpdate: (self) => {
        const sim = simulationRef.current
        const camera = cameraRef.current
        if (!sim || !camera) return

        const p = self.progress

        // 1. Black Hole Zoom Trajectory:
        // Phase 1 (p <= 0.25): Dip slightly toward bottom center (y: 0.0 -> -0.2, x: baseOffset -> 0.0)
        // Phase 2 (p > 0.25): Zoom rapidly into camera lens while drifting toward top (y: -0.2 -> +0.85, z: 27 -> 3.5)
        let currentX = 0
        let currentY = 0
        let targetZ = 27

        if (p <= 0.25) {
          const t = p / 0.25
          currentX = baseOffsetPx.current * (1.0 - t)
          currentY = -0.2 * t
          targetZ = 27 - t * 5
        } else {
          const t = (p - 0.25) / 0.75
          currentX = 0.15 * t
          currentY = -0.2 + t * 1.05
          targetZ = 22 - t * 18.5
        }

        sim.setBlackHoleScreenOffset(currentX, currentY)
        sim.setBlackHoleAngle(0.488)
        camera.position.z = targetZ

        // 2. Particle Explosion & Accretion Disk Dissolution:
        // Accretion disk material dissolves into floating stellar particles filling screen
        const dispersion = Math.max(0, Math.min(1.0, (p - 0.2) / 0.65))
        sim.setParticleDispersion(dispersion)
      }
    })

    return () => st.kill()
  }, [isPreloaderDone])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: '#000',
      }}
    />
  )
}
