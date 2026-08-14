import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import vertexShader from './shaders/blackHole.vert'
import fragmentShader from './shaders/blackHole.frag'

const defaultConfig = {
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
  "turbulenceSecondaryScale": 1.3,
  "turbulenceSecondaryStrength": 0.15,
  "turbulenceSharpness": 8.5,
  "turbulenceStretch": 1.18
}

const BlackHoleMaterial = shaderMaterial(
  {
    uTime: 0,
    uScale: 1.0,
    uPosition: new THREE.Vector3(0, 0, 0),
    resolution: new THREE.Vector2(1920, 1080),

    uBlackHoleMass: 0.30000000000000004,
    uDiskInnerRadius: 5,
    uDiskOuterRadius: 12,
    uDiskTemperature: 49.78,
    uTemperatureFalloff: 4.42,
    uDiskBrightness: 5,
    uDiskRotationSpeed: 20,

    uTurbulenceScale: 2,
    uTurbulenceStretch: 1.18,
    uTurbulenceSharpness: 8.5,
    uTurbulenceCycleTime: 5,
    uTurbulenceLacunarity: 2.9,
    uTurbulencePersistence: 0.8500000000000001,

    uDiskEdgeSoftnessInner: 0,
    uDiskEdgeSoftnessOuter: 0.3,

    uGravitationalLensing: 3,
    uDopplerStrength: 0.4,
    uStepSize: 1,

    uStarsEnabled: 1.0,
    uStarBackgroundColor: new THREE.Color("#000000"),
    uStarDensity: 0.1,
    uStarSize: 1.2,
    uStarBrightness: 0.5,

    uNebulaEnabled: 0.0,
    uNebula1Scale: 2,
    uNebula1Density: 0.5,
    uNebula1Brightness: 0.01,
    uNebula1Color: new THREE.Color("#071f44"),

    uNebula2Scale: 5.5,
    uNebula2Density: 0.05,
    uNebula2Brightness: 0.21,
    uNebula2Color: new THREE.Color("#010615"),

    uBloomStrength: 0.78,
    uBloomThreshold: 0.030000000000000013,

    uCameraPosition: new THREE.Vector3(0, 5, 20),
    uCameraTarget: new THREE.Vector3(0, 0, 0)
  },
  vertexShader,
  fragmentShader
)

extend({ BlackHoleMaterial })

export default function BlackHole({ scale = 1.0, position = [0, 0, 0], config = {} }) {
  const materialRef = useRef()
  const cfg = useMemo(() => ({ ...defaultConfig, ...config }), [config])

  useFrame((state, delta) => {
    if (materialRef.current) {
      const mat = materialRef.current
      mat.uTime += delta
      mat.uScale = scale
      mat.uPosition.set(position[0], position[1], position[2])

      const width = state.size.width * state.viewport.dpr
      const height = state.size.height * state.viewport.dpr
      mat.resolution.set(width, height)

      mat.uCameraPosition.copy(state.camera.position)

      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
      mat.uCameraTarget.copy(state.camera.position).add(cameraDirection.multiplyScalar(10))

      // Sync uniforms from config
      mat.uBlackHoleMass = cfg.blackHoleMass
      mat.uDiskInnerRadius = cfg.diskInnerRadius
      mat.uDiskOuterRadius = cfg.diskOuterRadius
      mat.uDiskTemperature = cfg.diskTemperature
      mat.uTemperatureFalloff = cfg.temperatureFalloff
      mat.uDiskBrightness = cfg.diskBrightness
      mat.uDiskRotationSpeed = cfg.diskRotationSpeed
      mat.uTurbulenceScale = cfg.turbulenceScale
      mat.uTurbulenceStretch = cfg.turbulenceStretch
      mat.uTurbulenceSharpness = cfg.turbulenceSharpness
      mat.uTurbulenceCycleTime = cfg.turbulenceCycleTime
      mat.uTurbulenceLacunarity = cfg.turbulenceLacunarity
      mat.uTurbulencePersistence = cfg.turbulencePersistence
      mat.uDiskEdgeSoftnessInner = cfg.diskEdgeSoftnessInner
      mat.uDiskEdgeSoftnessOuter = cfg.diskEdgeSoftnessOuter
      mat.uGravitationalLensing = cfg.gravitationalLensing
      mat.uDopplerStrength = cfg.dopplerStrength
      mat.uStepSize = cfg.stepSize
      mat.uStarsEnabled = cfg.starsEnabled ? 1.0 : 0.0
      mat.uStarDensity = cfg.starDensity
      mat.uStarSize = cfg.starSize
      mat.uStarBrightness = cfg.starBrightness
      mat.uNebulaEnabled = cfg.nebulaEnabled ? 1.0 : 0.0
      mat.uNebula1Scale = cfg.nebula1Scale
      mat.uNebula1Density = cfg.nebula1Density
      mat.uNebula1Brightness = cfg.nebula1Brightness
      mat.uNebula2Scale = cfg.nebula2Scale
      mat.uNebula2Density = cfg.nebula2Density
      mat.uNebula2Brightness = cfg.nebula2Brightness
      mat.uBloomStrength = cfg.bloomStrength
      mat.uBloomThreshold = cfg.bloomThreshold
    }
  })

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 64, 64]} />
      <blackHoleMaterial
        ref={materialRef}
        uScale={scale}
        uPosition={new THREE.Vector3(...position)}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
