/**
 * ============================================================================
 * BLACK HOLE SIMULATION WITH RAYMARCHED GRAVITATIONAL LENSING
 * ============================================================================
 *
 * This simulation renders a Schwarzschild (non-rotating) black hole with:
 * - Gravitational lensing of light rays through curved spacetime
 * - Accretion disk with temperature-based coloring and turbulence
 * - Doppler beaming (relativistic brightness variation)
 * - Procedural star field and nebula background
 * - Photon ring at the critical impact parameter
 *
 * @author Daniel Greenheck
 */

import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import { createBlackHoleShader } from './blackhole-shader.js';

export class BlackHoleSimulation {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.blackHoleMesh = null;
    this._screenOffsetX = 0; // lateral screen-space shift, preserved across camera updates
    this.initializeUniforms(config);
  }

  /**
   * Initialize all shader uniforms with default values.
   */
  initializeUniforms(config) {
    this.uniforms = {
      // Physics
      blackHoleMass: uniform(config.blackHoleMass ?? 1.0),

      // Accretion Disk Geometry
      diskInnerRadius: uniform(config.diskInnerRadius ?? 3.0),
      diskOuterRadius: uniform(config.diskOuterRadius ?? 12.0),

      // Accretion Disk Appearance
      diskTemperature: uniform(config.diskTemperature ?? 10.0),
      temperatureFalloff: uniform(config.temperatureFalloff ?? 0.75),
      diskBrightness: uniform(config.diskBrightness ?? 2.0),
      diskRotationSpeed: uniform(config.diskRotationSpeed ?? 0.3),

      // Turbulence Pattern Controls
      turbulenceScale: uniform(config.turbulenceScale ?? 1.0),
      turbulenceStretch: uniform(config.turbulenceStretch ?? 5.0),
      turbulenceSharpness: uniform(config.turbulenceSharpness ?? 1.0),
      turbulenceCycleTime: uniform(config.turbulenceCycleTime ?? 10.0),
      turbulenceLacunarity: uniform(config.turbulenceLacunarity ?? 2.0),
      turbulencePersistence: uniform(config.turbulencePersistence ?? 0.5),

      // Disk Edge Falloff
      diskEdgeSoftnessInner: uniform(config.diskEdgeSoftnessInner ?? 0.15),
      diskEdgeSoftnessOuter: uniform(config.diskEdgeSoftnessOuter ?? 0.15),

      // Relativistic Effects
      gravitationalLensing: uniform(config.gravitationalLensing ?? 1.5),
      dopplerStrength: uniform(config.dopplerStrength ?? 1.0),

      // Performance
      stepSize: uniform(config.stepSize ?? 0.3),

      // Stars
      starsEnabled: uniform(config.starsEnabled ? 1.0 : 0.0),
      starBackgroundColor: uniform(new THREE.Color(config.starBackgroundColor ?? '#000000')),
      starDensity: uniform(config.starDensity ?? 0.003),
      starSize: uniform(config.starSize ?? 2.0),
      starBrightness: uniform(config.starBrightness ?? 1.0),

      // Nebula Layer 1
      nebulaEnabled: uniform(config.nebulaEnabled ? 1.0 : 0.0),
      nebula1Scale: uniform(config.nebula1Scale ?? 2.0),
      nebula1Density: uniform(config.nebula1Density ?? 0.5),
      nebula1Brightness: uniform(config.nebula1Brightness ?? 0.15),
      nebula1Color: uniform(new THREE.Color(config.nebula1Color ?? '#1a0033')),

      // Nebula Layer 2
      nebula2Scale: uniform(config.nebula2Scale ?? 6.0),
      nebula2Density: uniform(config.nebula2Density ?? 0.5),
      nebula2Brightness: uniform(config.nebula2Brightness ?? 0.15),
      nebula2Color: uniform(new THREE.Color(config.nebula2Color ?? '#4d1a26')),

      // Animation State
      time: uniform(0),

      // Black Hole Shader Offset & Angle (leaves background stars frozen!)
      blackHoleScreenOffset: uniform(new THREE.Vector2(0, 0)),
      blackHoleAngle: uniform(0),
      particleDispersion: uniform(config.particleDispersion ?? 0.0),

      // Camera
      resolution: uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
      cameraPosition: uniform(new THREE.Vector3(0, 5, 20)),
      cameraTarget: uniform(new THREE.Vector3(0, 0, 0))
    };
  }

  setBlackHoleScreenOffset(x, y) {
    this.uniforms.blackHoleScreenOffset.value.set(x, y);
  }

  setBlackHoleAngle(angleRad) {
    this.uniforms.blackHoleAngle.value = angleRad;
  }

  setParticleDispersion(val) {
    this.uniforms.particleDispersion.value = val;
  }

  setDiskBrightness(val) {
    this.uniforms.diskBrightness.value = val;
  }

  setMeshVisibility(visible) {
    if (this.blackHoleMesh) {
      this.blackHoleMesh.visible = visible;
    }
  }

  createBlackHole() {
    if (this.blackHoleMesh) {
      this.scene.remove(this.blackHoleMesh);
      this.blackHoleMesh.material?.dispose();
      this.blackHoleMesh.geometry?.dispose();
    }

    const geometry = new THREE.SphereGeometry(100, 32, 32);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = this.createRaymarchingShader();

    this.blackHoleMesh = new THREE.Mesh(geometry, material);
    this.blackHoleMesh.frustumCulled = false;
    this.scene.add(this.blackHoleMesh);
  }

  createRaymarchingShader() {
    return createBlackHoleShader(this.uniforms);
  }

  updateUniforms(config) {
    const u = this.uniforms;

    if (config.blackHoleMass !== undefined) u.blackHoleMass.value = config.blackHoleMass;
    if (config.diskInnerRadius !== undefined) u.diskInnerRadius.value = config.diskInnerRadius;
    if (config.diskOuterRadius !== undefined) u.diskOuterRadius.value = config.diskOuterRadius;
    if (config.diskTemperature !== undefined) u.diskTemperature.value = config.diskTemperature;
    if (config.temperatureFalloff !== undefined) u.temperatureFalloff.value = config.temperatureFalloff;
    if (config.diskBrightness !== undefined) u.diskBrightness.value = config.diskBrightness;
    if (config.diskRotationSpeed !== undefined) u.diskRotationSpeed.value = config.diskRotationSpeed;
    if (config.turbulenceScale !== undefined) u.turbulenceScale.value = config.turbulenceScale;
    if (config.turbulenceStretch !== undefined) u.turbulenceStretch.value = config.turbulenceStretch;
    if (config.turbulenceSharpness !== undefined) u.turbulenceSharpness.value = config.turbulenceSharpness;
    if (config.turbulenceCycleTime !== undefined) u.turbulenceCycleTime.value = config.turbulenceCycleTime;
    if (config.turbulenceLacunarity !== undefined) u.turbulenceLacunarity.value = config.turbulenceLacunarity;
    if (config.turbulencePersistence !== undefined) u.turbulencePersistence.value = config.turbulencePersistence;
    if (config.diskEdgeSoftnessInner !== undefined) u.diskEdgeSoftnessInner.value = config.diskEdgeSoftnessInner;
    if (config.diskEdgeSoftnessOuter !== undefined) u.diskEdgeSoftnessOuter.value = config.diskEdgeSoftnessOuter;
    if (config.gravitationalLensing !== undefined) u.gravitationalLensing.value = config.gravitationalLensing;
    if (config.dopplerStrength !== undefined) u.dopplerStrength.value = config.dopplerStrength;
    if (config.stepSize !== undefined) u.stepSize.value = config.stepSize;
    if (config.starsEnabled !== undefined) u.starsEnabled.value = config.starsEnabled ? 1.0 : 0.0;
    if (config.starBackgroundColor !== undefined) u.starBackgroundColor.value.set(config.starBackgroundColor);
    if (config.starDensity !== undefined) u.starDensity.value = config.starDensity;
    if (config.starSize !== undefined) u.starSize.value = config.starSize;
    if (config.starBrightness !== undefined) u.starBrightness.value = config.starBrightness;
    if (config.nebulaEnabled !== undefined) u.nebulaEnabled.value = config.nebulaEnabled ? 1.0 : 0.0;
    if (config.nebula1Scale !== undefined) u.nebula1Scale.value = config.nebula1Scale;
    if (config.nebula1Density !== undefined) u.nebula1Density.value = config.nebula1Density;
    if (config.nebula1Brightness !== undefined) u.nebula1Brightness.value = config.nebula1Brightness;
    if (config.nebula1Color !== undefined) u.nebula1Color.value.set(config.nebula1Color);
    if (config.nebula2Scale !== undefined) u.nebula2Scale.value = config.nebula2Scale;
    if (config.nebula2Density !== undefined) u.nebula2Density.value = config.nebula2Density;
    if (config.nebula2Brightness !== undefined) u.nebula2Brightness.value = config.nebula2Brightness;
    if (config.nebula2Color !== undefined) u.nebula2Color.value.set(config.nebula2Color);
  }

  updateCamera(camera) {
    this.uniforms.cameraPosition.value.copy(camera.position);
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    const target = camera.position.clone().add(direction.multiplyScalar(10));
    // Preserve lateral screen-space offset — don't let camera math overwrite it
    target.x += this._screenOffsetX;
    this.uniforms.cameraTarget.value.copy(target);
  }

  /**
   * Shift the black hole horizontally in screen space by adjusting cameraTarget.x.
   * Stored separately so updateCamera() doesn't overwrite it each frame.
   * @param {number} offsetX  world-space lateral offset
   */
  setScreenOffsetX(offsetX) {
    this._screenOffsetX = offsetX;
    this.uniforms.cameraTarget.value.x = offsetX;
  }

  update(deltaTime, camera) {
    this.uniforms.time.value += deltaTime;
    this.updateCamera(camera);
  }

  onResize(width, height) {
    this.uniforms.resolution.value.set(width, height);
  }

  regenerate() {
    this.createBlackHole();
  }
}
