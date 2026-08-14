precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uScale;
uniform vec3 uPosition;
uniform vec2 resolution;

// User Config Uniforms
uniform float uBlackHoleMass;
uniform float uDiskInnerRadius;
uniform float uDiskOuterRadius;
uniform float uDiskTemperature;
uniform float uTemperatureFalloff;
uniform float uDiskBrightness;
uniform float uDiskRotationSpeed;

uniform float uTurbulenceScale;
uniform float uTurbulenceStretch;
uniform float uTurbulenceSharpness;
uniform float uTurbulenceCycleTime;
uniform float uTurbulenceLacunarity;
uniform float uTurbulencePersistence;

uniform float uDiskEdgeSoftnessInner;
uniform float uDiskEdgeSoftnessOuter;

uniform float uGravitationalLensing;
uniform float uDopplerStrength;
uniform float uStepSize;

uniform float uStarsEnabled;
uniform vec3 uStarBackgroundColor;
uniform float uStarDensity;
uniform float uStarSize;
uniform float uStarBrightness;

uniform float uNebulaEnabled;
uniform float uNebula1Scale;
uniform float uNebula1Density;
uniform float uNebula1Brightness;
uniform vec3 uNebula1Color;

uniform float uNebula2Scale;
uniform float uNebula2Density;
uniform float uNebula2Brightness;
uniform vec3 uNebula2Color;

uniform float uBloomStrength;
uniform float uBloomThreshold;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

// Hash functions for PRNG
float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

vec2 hash22(vec2 p) {
    float px = fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    float py = fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
    return vec2(px, py);
}

// 3D Value Noise
float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    float a = hash31(i);
    float b = hash31(i + vec3(1.0, 0.0, 0.0));
    float c = hash31(i + vec3(0.0, 1.0, 0.0));
    float d = hash31(i + vec3(1.0, 1.0, 0.0));
    float e = hash31(i + vec3(0.0, 0.0, 1.0));
    float f2 = hash31(i + vec3(1.0, 0.0, 1.0));
    float g = hash31(i + vec3(0.0, 1.0, 1.0));
    float h = hash31(i + vec3(1.0, 1.0, 1.0));

    return mix(
        mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
        mix(mix(e, f2, u.x), mix(g, h, u.x), u.y),
        u.z
    );
}

// Fractal Brownian Motion (FBM) - 4 octaves
float fbm(vec3 p, float lacunarity, float persistence) {
    float value = 0.0;
    float amplitude = 0.5;
    vec3 pos = p;

    for (int i = 0; i < 4; i++) {
        value += noise3D(pos) * amplitude;
        pos *= lacunarity;
        amplitude *= persistence;
    }

    return value;
}

// Mitchell Charity Blackbody Color Lookup & Interpolation (1,000K to 40,000K)
vec3 blackbodyColor(float tempK) {
    float temp = clamp(tempK, 1000.0, 40000.0);

    if (temp <= 2000.0) {
        float t = (temp - 1000.0) / 1000.0;
        return mix(vec3(1.0, 0.0337, 0.0), vec3(1.0, 0.2647, 0.0033), t);
    } else if (temp <= 3000.0) {
        float t = (temp - 2000.0) / 1000.0;
        return mix(vec3(1.0, 0.2647, 0.0033), vec3(1.0, 0.4870, 0.1411), t);
    } else if (temp <= 4000.0) {
        float t = (temp - 3000.0) / 1000.0;
        return mix(vec3(1.0, 0.4870, 0.1411), vec3(1.0, 0.6636, 0.3583), t);
    } else if (temp <= 5000.0) {
        float t = (temp - 4000.0) / 1000.0;
        return mix(vec3(1.0, 0.6636, 0.3583), vec3(1.0, 0.7992, 0.6045), t);
    } else if (temp <= 6000.0) {
        float t = (temp - 5000.0) / 1000.0;
        return mix(vec3(1.0, 0.7992, 0.6045), vec3(1.0, 0.9019, 0.8473), t);
    } else if (temp <= 7000.0) {
        float t = (temp - 6000.0) / 1000.0;
        return mix(vec3(1.0, 0.9019, 0.8473), vec3(0.9337, 0.9150, 1.0), t);
    } else if (temp <= 10000.0) {
        float t = (temp - 7000.0) / 3000.0;
        return mix(vec3(0.9337, 0.9150, 1.0), vec3(0.6268, 0.7039, 1.0), t);
    } else if (temp <= 20000.0) {
        float t = (temp - 10000.0) / 10000.0;
        return mix(vec3(0.6268, 0.7039, 1.0), vec3(0.4196, 0.5339, 1.0), t);
    } else {
        float t = (temp - 20000.0) / 20000.0;
        return mix(vec3(0.4196, 0.5339, 1.0), vec3(0.3563, 0.4745, 1.0), t);
    }
}

// Procedural Star Field
vec3 createStarField(vec3 rayDir) {
    float theta = atan(rayDir.z, rayDir.x);
    float phi = asin(clamp(rayDir.y, -1.0, 1.0));

    float gridScale = 60.0 / uStarSize;
    vec2 scaledCoord = vec2(theta, phi) * gridScale;
    vec2 cell = floor(scaledCoord);
    vec2 cellUV = fract(scaledCoord);

    float cellHash = hash21(cell);
    float starProb = step(1.0 - uStarDensity, cellHash);

    vec2 starPos = hash22(cell + 42.0) * 0.8 + 0.1;
    float distToStar = length(cellUV - starPos);

    float baseSizeVar = hash21(cell + 100.0) * 0.03 + 0.01;
    float finalStarSize = baseSizeVar * uStarSize;

    float starCore = smoothstep(finalStarSize, 0.0, distToStar);
    float starGlow = smoothstep(finalStarSize * 3.0, 0.0, distToStar) * 0.3;
    float starIntensity = (starCore + starGlow) * starProb;

    float colorTemp = hash21(cell + 200.0);
    vec3 starColor = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.95, 0.8), colorTemp);

    return starColor * starIntensity * uStarBrightness;
}

// Procedural Nebula Field
vec3 createNebulaField(vec3 rayDir) {
    vec3 noisePos1 = rayDir * uNebula1Scale;
    float n1 = fbm(noisePos1, 2.0, 0.5) * 2.0 - 1.0;
    float layer1 = clamp(n1 + uNebula1Density, 0.0, 1.0);
    vec3 color1 = uNebula1Color * layer1 * uNebula1Brightness;

    vec3 noisePos2 = rayDir * uNebula2Scale;
    float n2 = fbm(noisePos2, 2.0, 0.5) * 2.0 - 1.0;
    float layer2 = clamp(n2 + uNebula2Density, 0.0, 1.0);
    vec3 color2 = uNebula2Color * layer2 * uNebula2Brightness;

    return color1 + color2;
}

// Accretion Disk Color
vec4 createAccretionDiskColor(float hitR, float hitAngle, float time, vec3 rayDir, float innerR, float outerR) {
    float normR = clamp((hitR - innerR) / (outerR - innerR), 0.0, 1.0);

    float peakTempK = uDiskTemperature * 1000.0;
    float tempK = peakTempK * pow(innerR / hitR, uTemperatureFalloff);
    vec3 diskColor = blackbodyColor(tempK);

    // Relativistic Doppler beaming
    float rotationSign = sign(uDiskRotationSpeed);
    if (rotationSign == 0.0) rotationSign = 1.0;
    vec3 velocityDir = vec3(
        -sin(hitAngle) * rotationSign,
        0.0,
        cos(hitAngle) * rotationSign
    );
    float velocityMagnitude = 1.0 / sqrt(hitR / innerR);
    float beta = velocityMagnitude * 0.3;
    float cosTheta = dot(velocityDir, rayDir);
    float dopplerFactor = 1.0 / (1.0 - beta * cosTheta);
    float dopplerBoost = pow(dopplerFactor, 3.0 * uDopplerStrength);
    diskColor *= clamp(dopplerBoost, 0.1, 5.0);

    // Disk edge falloff
    float edgeFalloff = smoothstep(0.0, uDiskEdgeSoftnessInner, normR)
        * smoothstep(1.0, 1.0 - uDiskEdgeSoftnessOuter, normR);

    // Cyclic time for continuous rotation
    float cycleLength = uTurbulenceCycleTime;
    float cyclicTime = mod(time, cycleLength);
    float blendFactor = cyclicTime / cycleLength;

    float keplerianPhase1 = (cyclicTime * uDiskRotationSpeed) / pow(hitR, 1.5);
    float keplerianPhase2 = ((cyclicTime + cycleLength) * uDiskRotationSpeed) / pow(hitR, 1.5);
    float rotatedAngle1 = hitAngle + keplerianPhase1;
    float rotatedAngle2 = hitAngle + keplerianPhase2;

    float maxStretch = max(uTurbulenceStretch, 0.1);
    vec3 noiseCoord1 = vec3(
        hitR * uTurbulenceScale,
        cos(rotatedAngle1) / maxStretch,
        sin(rotatedAngle1) / maxStretch
    );
    vec3 noiseCoord2 = vec3(
        hitR * uTurbulenceScale,
        cos(rotatedAngle2) / maxStretch,
        sin(rotatedAngle2) / maxStretch
    );

    float turbulence1 = fbm(noiseCoord1, uTurbulenceLacunarity, uTurbulencePersistence);
    float turbulence2 = fbm(noiseCoord2, uTurbulenceLacunarity, uTurbulencePersistence);
    float turbulence = mix(turbulence2, turbulence1, blendFactor);
    float ringOpacity = pow(clamp(turbulence, 0.0, 1.0), uTurbulenceSharpness);

    float finalOpacity = ringOpacity * edgeFalloff;
    vec3 finalColor = diskColor * uDiskBrightness;
    return vec4(finalColor, finalOpacity);
}

// ACES Filmic Tone Mapping matching Three.js ACESFilmicToneMapping
vec3 ACESFilmicToneMapping(vec3 color) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
}

void main() {
    float rs = uBlackHoleMass * 2.0;

    // Screen UV calculation
    vec2 screenUV = gl_FragCoord.xy / resolution.xy;
    vec2 uv = (screenUV - 0.5) * 2.0;
    float aspect = resolution.x / resolution.y;
    vec2 screenPos = vec2(uv.x * aspect, uv.y);

    vec3 camPos = uCameraPosition;
    vec3 camTarget = uCameraTarget;
    vec3 camForward = normalize(camTarget - camPos);
    vec3 worldUp = vec3(0.0, 1.0, 0.0);
    vec3 camRight = normalize(cross(worldUp, camForward));
    vec3 camUp = cross(camForward, camRight);

    float fov = 1.0;
    vec3 rayDir = normalize(
        camForward * fov
            + camRight * screenPos.x
            + camUp * screenPos.y
    );

    vec3 rayPos = camPos;
    vec3 prevPos = camPos;
    vec3 color = vec3(0.0);
    float alpha = 0.0;
    bool escaped = false;
    bool captured = false;

    float innerR = uDiskInnerRadius;
    float outerR = uDiskOuterRadius;

    // Raymarching loop (68 steps matching raySteps setting)
    for (int i = 0; i < 68; i++) {
        if (escaped || captured || alpha > 0.99) {
            break;
        }

        float r = length(rayPos);

        // Captured inside event horizon
        if (r < rs * 1.01) {
            captured = true;
            break;
        }

        // Escaped ray to background
        if (r > 100.0) {
            escaped = true;
            break;
        }

        // Gravitational light bending: a = -rs/r² toward center
        vec3 toCenter = -rayPos / r;
        float bendStrength = (rs / (r * r)) * uStepSize * uGravitationalLensing;
        rayDir = normalize(rayDir + toCenter * bendStrength);

        prevPos = rayPos;
        rayPos += rayDir * uStepSize;

        // Disk plane intersection check (Y = 0)
        bool crossedPlane = prevPos.y * rayPos.y < 0.0;

        if (crossedPlane && alpha < 0.99) {
            float t = -prevPos.y / (rayPos.y - prevPos.y);
            vec3 hitPos = mix(prevPos, rayPos, t);
            float hitR = sqrt(hitPos.x * hitPos.x + hitPos.z * hitPos.z);
            bool inDisk = hitR > innerR && hitR < outerR;

            if (inDisk) {
                float hitAngle = atan(hitPos.z, hitPos.x);
                vec4 diskResult = createAccretionDiskColor(hitR, hitAngle, uTime, rayDir, innerR, outerR);

                float remainingAlpha = 1.0 - alpha;
                color += diskResult.rgb * diskResult.a * remainingAlpha;
                alpha += remainingAlpha * diskResult.a;
            }
        }
    }

    if (!captured) {
        escaped = true;
    }

    if (escaped && alpha < 0.99) {
        vec3 bgColor = uStarBackgroundColor;

        if (uStarsEnabled > 0.5) {
            bgColor += createStarField(rayDir);
        }

        if (uNebulaEnabled > 0.5) {
            bgColor += createNebulaField(rayDir);
        }

        color += bgColor * (1.0 - alpha);
    }

    // Additive TSL Bloom Node (matches BloomNode.js bloomPassNode in WebGPU pipeline)
    vec3 bloomColor = max(color - vec3(uBloomThreshold), vec3(0.0)) * uBloomStrength;
    vec3 hdrColor = color + bloomColor;

    // ACES Filmic Tone Mapping
    vec3 toneMapped = ACESFilmicToneMapping(hdrColor);

    // Gamma correction
    vec3 finalColor = pow(toneMapped, vec3(1.0 / 2.2));
    gl_FragColor = vec4(finalColor, 1.0);
}
