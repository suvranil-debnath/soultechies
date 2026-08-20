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

import { TechEarthGroup, createAboutTextMesh, createUsTextMesh } from './TechEarth.jsx'

export default function Scene({ isPreloaderDone, registerSnapCallback }) {
  const containerRef = useRef(null)
  const cameraRef = useRef(null)
  const simulationRef = useRef(null)
  const techEarthRef = useRef(null)
  const aboutTextMeshRef = useRef(null)
  const usTextMeshRef = useRef(null)
  const bloomPassNodeRef = useRef(null)
  const aboutUsBaseY = useRef(-0.3)
  const baseOffsetPx = useRef(0) // pixel translateX after O-gap snap
  const isIntroComplete = useRef(false)

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
    // Start zoomed in close — inside the black hole for preloader reveal effect (Frames 1-2)
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

    // Holographic Tech Earth Integration (Hidden by default on initial hero screen)
    const techEarth = new TechEarthGroup({ radius: 2.4 })
    techEarth.setOpacity(0.0)
    scene.add(techEarth.group)
    techEarthRef.current = techEarth

    // 3D Split "ABOUT" & "US" text meshes placed behind the Earth (Z = -2.4)
    const aboutMesh = createAboutTextMesh()
    const usMesh = createUsTextMesh()
    scene.add(aboutMesh)
    scene.add(usMesh)
    aboutTextMeshRef.current = aboutMesh
    usTextMeshRef.current = usMesh

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
      techEarth.update(deltaTime)

      // Subtle weightless breathing float on About & Us text when revealed
      if (aboutTextMeshRef.current && aboutTextMeshRef.current.material.opacity > 0.05) {
        const time = currentTime * 0.001
        const floatY = Math.sin(time * 1.5) * 0.02
        aboutTextMeshRef.current.position.y = aboutUsBaseY.current + floatY
        if (usTextMeshRef.current) {
          usTextMeshRef.current.position.y = aboutUsBaseY.current + floatY
        }
      }

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
      bloomPassNodeRef.current = bloomPassNode
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

  // Preloader done → zoom camera out from inside black hole (Frames 2-4)
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
            isIntroComplete.current = true
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

  // Scroll-driven Sequential Flow:
  // Step 1 (0 -> 0.28): Wordmark Exit & Black Hole Zoom / Disappearance
  // Step 2 (0.28 -> 0.58): Full Size Earth Appears in the Middle (Storyboard Panel 8)
  // Step 3 (0.58 -> 1.00): Earth Moves to Bottom (~30% Revealed) & About Us Appears
  useEffect(() => {
    if (!isPreloaderDone) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '100% bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const sim = simulationRef.current
        const camera = cameraRef.current
        const techEarth = techEarthRef.current
        if (!sim || !camera) return

        const p = self.progress

        // Protect intro zoom-out animation if user has not scrolled yet
        if (!isIntroComplete.current && p < 0.005) {
          return
        }

        isIntroComplete.current = true

        const aboutMesh = aboutTextMeshRef.current
        const usMesh = usTextMeshRef.current

        // Stage 0: Black Hole Zoom & Dissolution (p: 0.00 -> 0.20)
        if (p <= 0.20) {
          if (bloomPassNodeRef.current) {
            bloomPassNodeRef.current.threshold.value = userConfig.bloomThreshold
            bloomPassNodeRef.current.strength.value = userConfig.bloomStrength
          }
          const t = p / 0.20
          const currentX = baseOffsetPx.current * (1.0 - t)
          const currentY = -0.2 * t
          const targetZ = 27 - t * 23.5 // 27 -> 3.5

          sim.setBlackHoleScreenOffset(currentX, currentY)
          sim.setBlackHoleAngle(0.488)
          camera.position.set(0, -0.6 * (1.0 - t), targetZ)
          camera.fov = 60
          camera.updateProjectionMatrix()

          // Particle dispersion & brightness fade
          const dispT = Math.max(0, (t - 0.2) / 0.8)
          sim.setParticleDispersion(dispT)
          sim.setDiskBrightness(2.0 * (1.0 - dispT))
          sim.setMeshVisibility(true)

          // Earth and text are completely hidden during black hole zoom
          if (techEarth) {
            techEarth.setOpacity(0.0)
            techEarth.setScale(0.5)
            techEarth.setPosition(0, 0, 0)
            techEarth.setTargetLock(0.0)
            techEarth.setPinpointOpacity(0.0)
            techEarth.setMapOpacity(0.0)
          }
          if (aboutMesh) aboutMesh.material.opacity = 0.0
          if (usMesh) usMesh.material.opacity = 0.0
        } else {
          // p > 0.20: BLACK HOLE IS 100% GONE AND DISAPPEARED!
          if (bloomPassNodeRef.current) {
            bloomPassNodeRef.current.threshold.value = 1.05
            bloomPassNodeRef.current.strength.value = 0.35
          }
          sim.setMeshVisibility(false)
          sim.setDiskBrightness(0.0)
          sim.setParticleDispersion(1.0)

          if (p <= 0.38) {
            // Stage 1: Initial Staging — Earth in Lower-Third with "ABOUT" and "US" (p: 0.20 -> 0.38)
            const t = (p - 0.20) / 0.18
            camera.position.set(0, 0, 6.5)
            camera.fov = 60
            camera.updateProjectionMatrix()

            if (techEarth) {
              techEarth.setPosition(0, -4.1 * t, 0)
              techEarth.setScale(0.8 + 0.55 * t) // 0.8 -> 1.35
              techEarth.setOpacity(Math.min(1.0, t * 1.5))
              techEarth.setTargetLock(0.0) // Continuous free rotation
              techEarth.setPinpointOpacity(0.0)
              techEarth.setMapOpacity(0.0)
            }

            if (aboutMesh) {
              aboutMesh.position.set(-3.8, -0.3, -2.4)
              aboutMesh.material.opacity = Math.min(1.0, t * 1.5)
            }
            if (usMesh) {
              usMesh.position.set(4.2, -0.3, -2.4)
              usMesh.material.opacity = Math.min(1.0, t * 1.5)
            }
          } else if (p <= 0.58) {
            // Stage 2 (Step 1): Text Split & Earth Centering (p: 0.38 -> 0.58)
            const t = (p - 0.38) / 0.20
            camera.position.set(0, 0, 6.5)
            camera.fov = 60
            camera.updateProjectionMatrix()

            // Earth translates from bottom to exact center
            if (techEarth) {
              const earthY = -4.1 * (1.0 - t)
              const earthScale = 1.35 - 0.35 * t // 1.35 -> 1.0
              techEarth.setPosition(0, earthY, 0)
              techEarth.setScale(earthScale)
              techEarth.setOpacity(1.0)
              techEarth.setTargetLock(0.0) // Continues unbroken natural rotation
              techEarth.setPinpointOpacity(0.0)
              techEarth.setMapOpacity(0.0)
            }

            // "ABOUT" slides left, "US" slides right
            const easeT = t * t
            const textOpacity = Math.max(0, 1.0 - t * 1.6)

            if (aboutMesh) {
              aboutMesh.position.set(-3.8 - easeT * 20.0, -0.3, -2.4)
              aboutMesh.material.opacity = textOpacity
            }
            if (usMesh) {
              usMesh.position.set(4.2 + easeT * 20.0, -0.3, -2.4)
              usMesh.material.opacity = textOpacity
            }
          } else if (p <= 0.76) {
            // Stage 3 (Step 2): Continuous Spin to Kolkata Target Lock (p: 0.58 -> 0.76)
            const t = (p - 0.58) / 0.18
            camera.position.set(0, 0, 6.5)
            camera.fov = 60
            camera.updateProjectionMatrix()

            if (techEarth) {
              techEarth.setPosition(0, 0, 0)
              techEarth.setScale(1.0)
              techEarth.setOpacity(1.0)
              techEarth.setTargetLock(t) // Decelerates & snaps Kolkata to face camera lens
              techEarth.setPinpointOpacity(Math.max(0, (t - 0.25) / 0.75))
              techEarth.setMapOpacity(0.0)
            }

            if (aboutMesh) aboutMesh.material.opacity = 0.0
            if (usMesh) usMesh.material.opacity = 0.0
          } else {
            // Stage 4 (Step 3): GTA V Satellite Dive + Map Reveal (p: 0.76 -> 1.00)
            const t = (p - 0.76) / 0.24

            // Dive: camera plunges forward (Z: 6.5 -> 4.0) with telephoto FOV compression
            // Capped at Z=4.0 so we never clip through the Earth surface (radius 2.4 * max scale 1.6 = 3.84)
            const plungeT = Math.pow(Math.min(t, 1.0), 1.6)
            const camZ = 6.5 - plungeT * 2.5   // 6.5 -> 4.0 max
            camera.position.set(0, 0, camZ)

            // Telephoto compression: 60deg -> 22deg (keeps Kolkata area large without zooming past the globe)
            const fovT = Math.pow(Math.min(t, 1.0), 1.4)
            camera.fov = 60.0 - fovT * 38.0    // 60 -> 22 deg
            camera.updateProjectionMatrix()

            if (techEarth) {
              techEarth.setPosition(0, 0, 0)
              // Scale: 1.0 -> max 1.6 (surface stays in FRONT of camera the whole time)
              techEarth.setScale(1.0 + Math.min(t, 1.0) * 0.6)
              techEarth.setTargetLock(1.0)
              // Reticle fades quickly
              techEarth.setPinpointOpacity(Math.max(0, 1.0 - t * 2.5))
              // Earth opacity fades out: starts at t=0.4, fully gone by t=0.75
              const earthFade = Math.max(0, Math.min(1, (0.75 - t) / 0.35))
              techEarth.setOpacity(earthFade)
              techEarth.setMapOpacity(0.0)
            }

            if (aboutMesh) aboutMesh.material.opacity = 0.0
            if (usMesh) usMesh.material.opacity = 0.0
          }
        }
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
