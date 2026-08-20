import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Convert [latitude, longitude] to 3D Cartesian coordinates on sphere of radius R
 * x = -R * cos(lat) * cos(lon)
 * y = R * sin(lat) * z = R * cos(lat) * sin(lon)
 */
export function latLonToVector3(latDeg, lonDeg, radius = 2.0) {
  const lat = (latDeg * Math.PI) / 180
  const lon = (lonDeg * Math.PI) / 180
  const x = -radius * Math.cos(lat) * Math.cos(lon)
  const y = radius * Math.sin(lat)
  const z = radius * Math.cos(lat) * Math.sin(lon)
  return new THREE.Vector3(x, y, z)
}

/**
 * Custom Fresnel Rim Lighting Shader for Atmospheric Glow
 */
const FresnelAtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color('#0077aa') },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
      gl_FragColor = vec4(color * intensity, intensity * 0.85);
    }
  `,
}

/**
 * Create 3D text mesh for "ABOUT" positioned behind the left Earth curvature
 */
export function createAboutTextMesh() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '500 380px "Outfit", "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '-0.01em'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('ABOUT', canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  const geometry = new THREE.PlaneGeometry(12.0, 6.0)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(-3.8, -0.3, -2.4)
  mesh.renderOrder = 0
  mesh.name = 'AboutTextMesh'
  return mesh
}

/**
 * Create 3D text mesh for "US" positioned behind the right Earth curvature
 */
export function createUsTextMesh() {
  const canvas = document.createElement('canvas')
  canvas.width = 1536
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '500 380px "Outfit", "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '-0.01em'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('US', canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  const geometry = new THREE.PlaneGeometry(9.0, 6.0)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(4.2, -0.3, -2.4)
  mesh.renderOrder = 0
  mesh.name = 'UsTextMesh'
  return mesh
}

/**
 * Backward compatibility alias for single mesh if needed
 */
export function createAboutUsTextMesh() {
  return createAboutTextMesh()
}

/**
 * Imperative helper to create and manage Holographic TechEarth in Three.js
 */
export class TechEarthGroup {
  constructor(options = {}) {
    this.radius = options.radius ?? 2.4 // Base Earth size
    this.group = new THREE.Group()
    this.group.name = 'TechEarthGroup'

    this.innerCore = null
    this.landmesh = null
    this.pointsMesh = null
    this.glowMesh = null
    this.kolkataMarker = null
    this.mapPlane = null

    this.freeSpinAngle = 0
    this.lockProgress = 0 // 0.0 = free spin, 1.0 = locked on Kolkata
    this.kolkataPos = latLonToVector3(22.5726, 88.3639, this.radius)

    this.initInnerCore()
    this.initAtmosphere()
    this.initKolkataMarker()
    this.initKolkataMapPlane()
    this.loadLandmassOutlines()
    this.loadDotMatrixPoints()

    // Default to completely hidden on load (only emerges on scroll after black hole dissolves)
    this.setOpacity(0.0)
  }

  /**
   * Opaque black inner sphere with depthWrite: true to block objects behind the Earth.
   * DoubleSide ensures back-hemisphere faces also write to the depth buffer,
   * which prevents landmass lines on the opposite side of the globe from bleeding through.
   */
  initInnerCore() {
    const geometry = new THREE.SphereGeometry(this.radius * 0.992, 64, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      transparent: false,
      side: THREE.DoubleSide,  // KEY FIX: back-hemisphere faces now write depth, blocking behind-earth geometry
    })

    this.innerCore = new THREE.Mesh(geometry, material)
    this.innerCore.renderOrder = 1
    this.group.add(this.innerCore)
  }

  /**
   * Holographic Pinpoint Marker on Kolkata [22.5726° N, 88.3639° E]
   */
  initKolkataMarker() {
    const markerGroup = new THREE.Group()
    markerGroup.name = 'KolkataMarker'

    // 1. Delicate Pinpoint Core Dot
    const dotGeo = new THREE.SphereGeometry(0.012, 16, 16)
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
    })
    const dotMesh = new THREE.Mesh(dotGeo, dotMat)
    markerGroup.add(dotMesh)

    // 2. Ultra-Thin Hairline Concentric Target Rings (64 segments, 0.003 thickness)
    const ringGeo = new THREE.RingGeometry(0.068, 0.071, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    })
    this.markerRing = new THREE.Mesh(ringGeo, ringMat)
    markerGroup.add(this.markerRing)

    const outerRingGeo = new THREE.RingGeometry(0.128, 0.131, 64)
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    })
    this.markerOuterRing = new THREE.Mesh(outerRingGeo, outerRingMat)
    markerGroup.add(this.markerOuterRing)

    // 3. Holographic HUD Canvas Label
    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 1024
    labelCanvas.height = 256
    const lctx = labelCanvas.getContext('2d')
    lctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height)
    lctx.font = '600 52px "Space Grotesk", sans-serif'
    lctx.fillStyle = '#00f0ff'
    lctx.fillText('TARGET // KOLKATA', 40, 80)
    lctx.font = '400 36px "Space Grotesk", monospace'
    lctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    lctx.fillText('LAT 22.5726° N  |  LON 88.3639° E', 40, 140)

    const labelTex = new THREE.CanvasTexture(labelCanvas)
    const labelGeo = new THREE.PlaneGeometry(1.2, 0.3)
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
    const labelMesh = new THREE.Mesh(labelGeo, labelMat)
    labelMesh.position.set(0.7, 0.25, 0)
    markerGroup.add(labelMesh)

    // Position marker at Kolkata coordinate on sphere surface
    markerGroup.position.copy(this.kolkataPos.clone().multiplyScalar(1.015))
    markerGroup.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      this.kolkataPos.clone().normalize()
    )

    this.kolkataMarker = markerGroup
    this.kolkataMarker.visible = false
    this.group.add(this.kolkataMarker)
  }

  /**
   * Kolkata Street Map Texture Overlay for GTA V Satellite Arrival
   */
  initKolkataMapPlane() {
    const loader = new THREE.TextureLoader()
    loader.load('/textures/kolkata-map.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      const geo = new THREE.PlaneGeometry(8.0, 4.5)
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      this.mapPlane = new THREE.Mesh(geo, mat)
      this.mapPlane.position.set(0, 0, 2.35)
      this.mapPlane.name = 'KolkataMapPlane'
      this.mapPlane.visible = false
      this.group.add(this.mapPlane)
    })
  }

  /**
   * 1. Vector Landmass Outlines from /data/world.json
   */
  async loadLandmassOutlines() {
    try {
      const res = await fetch('/data/world.json')
      const data = await res.json()

      const linePositions = []

      const processPolygon = (ring) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const [lon1, lat1] = ring[i]
          const [lon2, lat2] = ring[i + 1]

          const p1 = latLonToVector3(lat1, lon1, this.radius)
          const p2 = latLonToVector3(lat2, lon2, this.radius)

          linePositions.push(p1.x, p1.y, p1.z)
          linePositions.push(p2.x, p2.y, p2.z)
        }
      }

      if (data && data.features) {
        data.features.forEach((feature) => {
          const geom = feature.geometry
          if (!geom) return

          if (geom.type === 'Polygon') {
            geom.coordinates.forEach((ring) => processPolygon(ring))
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly) => {
              poly.forEach((ring) => processPolygon(ring))
            })
          }
        })
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )

      const material = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthTest: true,   // Explicitly test depth so back-hemisphere lines are discarded
        depthWrite: false, // Lines are transparent — don't write depth themselves
      })

      this.landmesh = new THREE.LineSegments(geometry, material)
      this.group.add(this.landmesh)
    } catch (err) {
      console.warn('[TechEarth] Failed to load /data/world.json:', err)
    }
  }

  /**
   * 2. Dot-Matrix Point Grid from /textures/earth-mask.jpg
   */
  loadDotMatrixPoints() {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, img.width, img.height).data

      const positions = []
      const latSteps = 160
      const lonSteps = 320

      for (let i = 0; i <= latSteps; i++) {
        const lat = 90 - (i / latSteps) * 180
        for (let j = 0; j <= lonSteps; j++) {
          const lon = -180 + (j / lonSteps) * 360

          const u = (lon + 180) / 360
          const v = (90 - lat) / 180

          const px = Math.floor(Math.min(Math.max(u, 0), 0.999) * img.width)
          const py = Math.floor(Math.min(Math.max(v, 0), 0.999) * img.height)
          const idx = (py * img.width + px) * 4

          const r = imgData[idx]
          const g = imgData[idx + 1]
          const b = imgData[idx + 2]
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b

          // Keep vertices where specular mask is dark (landmass areas)
          if (luminance < 120) {
            const pt = latLonToVector3(lat, lon, this.radius)
            positions.push(pt.x, pt.y, pt.z)
          }
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      )

      const material = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.03,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      this.pointsMesh = new THREE.Points(geometry, material)
      this.group.add(this.pointsMesh)
    }
    img.src = '/textures/earth-mask.jpg'
  }

  /**
   * 3. Fresnel Atmospheric Glow Shell (Radius: 2.1)
   */
  initAtmosphere() {
    const geometry = new THREE.SphereGeometry(this.radius * 1.05, 64, 64)
    const material = new THREE.ShaderMaterial({
      vertexShader: FresnelAtmosphereShader.vertexShader,
      fragmentShader: FresnelAtmosphereShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(FresnelAtmosphereShader.uniforms),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })

    this.glowMesh = new THREE.Mesh(geometry, material)
    this.group.add(this.glowMesh)
  }

  /**
   * Set overall visibility opacity (0.0 = invisible, 1.0 = fully visible)
   */
  setOpacity(val) {
    this._opacity = val
    this.group.visible = val > 0.001
    if (this.innerCore && this.innerCore.material) {
      this.innerCore.material.opacity = val
      // Keep depthWrite ALWAYS true — the inner core must permanently occlude
      // back-hemisphere geometry even while the Earth is fading out.
      // Disabling depthWrite at low opacity causes back-side land lines to bleed through.
      this.innerCore.material.depthWrite = true
    }
    if (this.landmesh && this.landmesh.material) {
      this.landmesh.material.opacity = 0.85 * val
      this.landmesh.renderOrder = 2
    }
    if (this.pointsMesh && this.pointsMesh.material) {
      this.pointsMesh.material.opacity = 0.9 * val
      this.pointsMesh.renderOrder = 3
    }
    if (this.glowMesh && this.glowMesh.material) {
      this.glowMesh.renderOrder = 4
      if (this.glowMesh.material.uniforms?.color) {
        this.glowMesh.material.uniforms.color.value.setRGB(0 * val, 0.46 * val, 0.66 * val)
      }
    }
  }

  /**
   * Set overall 3D scale of TechEarth
   */
  setScale(s) {
    this.group.scale.set(s, s, s)
  }

  /**
   * Set 3D position of TechEarth
   */
  setPosition(x, y, z) {
    this.group.position.set(x, y, z)
  }

  /**
   * Target Lock: 0.0 = continuous free spin, 1.0 = locked on Kolkata facing camera
   */
  setTargetLock(lockProgress) {
    this.lockProgress = Math.max(0, Math.min(1, lockProgress))
    
    // Direction vector of Kolkata on unit sphere
    const kolkataUnit = this.kolkataPos.clone().normalize()
    
    // Exact quaternion that maps Kolkata directly to (0, 0, 1) towards camera
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      kolkataUnit,
      new THREE.Vector3(0, 0, 1)
    )

    // Current free spin quaternion around Y axis
    const freeQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.freeSpinAngle
    )

    const ease = (t) => t * t * (3 - 2 * t) // smoothstep
    const t = ease(this.lockProgress)

    // Mathematically exact spherical interpolation into dead-center Kolkata orientation
    this.group.quaternion.slerpQuaternions(freeQuat, targetQuat, t)
  }

  /**
   * Set opacity of the Kolkata holographic target reticle
   */
  setPinpointOpacity(val) {
    if (!this.kolkataMarker) return
    this.kolkataMarker.visible = val > 0.01
    this.kolkataMarker.traverse((child) => {
      if (child.material) {
        child.material.opacity = val
      }
    })
  }

  /**
   * Set opacity of the Kolkata street map texture plane
   */
  setMapOpacity(val) {
    if (!this.mapPlane) return
    this.mapPlane.visible = val > 0.01
    if (this.mapPlane.material) {
      this.mapPlane.material.opacity = val
    }
  }

  /**
   * Set scale of the Kolkata street map plane
   */
  setMapScale(s) {
    if (!this.mapPlane) return
    this.mapPlane.scale.set(s, s, 1)
  }

  /**
   * Update continuous rotation, target ring spin, and pulse
   */
  update(delta = 0.016) {
    const time = performance.now() * 0.001

    // Free spin advances only when not fully locked
    if (this.lockProgress < 0.999) {
      this.freeSpinAngle += 0.004 * (1.0 - this.lockProgress)
      if (this.lockProgress <= 0.001) {
        this.group.quaternion.setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          this.freeSpinAngle
        )
      }
    }

    // Animate Kolkata reticle rings
    if (this.markerRing) {
      this.markerRing.rotation.z = time * 2.0
    }
    if (this.markerOuterRing) {
      this.markerOuterRing.rotation.z = -time * 1.5
      const pulse = 1.0 + Math.sin(time * 6.0) * 0.08
      this.markerOuterRing.scale.set(pulse, pulse, 1)
    }
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
  }
}

/**
 * React Component Wrapper for TechEarth
 */
export default function TechEarth({ radius = 2.0, position = [0, 0, 0], scale = 1 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
  }, [])

  return null
}
