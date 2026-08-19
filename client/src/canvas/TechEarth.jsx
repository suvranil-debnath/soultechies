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
 * Create 3D text mesh for "ABOUT US" positioned behind the Earth sphere
 * Exact design matching reference image (Geometric Sans, weight 500, clean matte finish with zero glow)
 */
export function createAboutUsTextMesh() {
  const canvas = document.createElement('canvas')
  canvas.width = 4096
  canvas.height = 1200
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '500 380px "Outfit", "Plus Jakarta Sans", sans-serif'
  ctx.letterSpacing = '-0.01em'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('ABOUT US', canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true

  // Refined plane geometry spanning across the viewport
  const geometry = new THREE.PlaneGeometry(23.5, 6.8)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, -0.3, -2.4) // Positioned in 3D behind the Earth sphere
  mesh.renderOrder = 0 // Rendered in background behind the Earth
  mesh.name = 'AboutUsTextMesh'
  return mesh
}

/**
 * Imperative helper to create and manage Holographic TechEarth in Three.js
 */
export class TechEarthGroup {
  constructor(options = {}) {
    this.radius = options.radius ?? 2.4 // Increased Earth size
    this.group = new THREE.Group()
    this.group.name = 'TechEarthGroup'

    this.innerCore = null
    this.landmesh = null
    this.pointsMesh = null
    this.glowMesh = null

    this.initInnerCore()
    this.initAtmosphere()
    this.loadLandmassOutlines()
    this.loadDotMatrixPoints()

    // Default to completely hidden on load (only emerges on scroll after black hole dissolves)
    this.setOpacity(0.0)
  }

  /**
   * Opaque black inner sphere with depthWrite: true to block objects behind the Earth
   */
  initInnerCore() {
    const geometry = new THREE.SphereGeometry(this.radius * 0.992, 64, 64)
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
      transparent: false, // Opaque queue so it writes to depth buffer and blocks behind-earth objects!
    })

    this.innerCore = new THREE.Mesh(geometry, material)
    this.innerCore.renderOrder = 1
    this.group.add(this.innerCore)
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
      this.innerCore.material.depthWrite = val > 0.1
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
   * Update continuous slow Y-axis rotation
   */
  update(delta = 0.016) {
    if (this.group) {
      this.group.rotation.y += 0.003
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
