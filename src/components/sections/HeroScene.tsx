"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Palette (kept in sync with --primary / --secondary in globals.css)         */
/* -------------------------------------------------------------------------- */
const PRIMARY = 0x2563eb;
const SECONDARY = 0x22d3ee;

const CAMERA_Z = 9;
const FOV = 40;
const PENGUIN_HEIGHT = 4.0; // hologram height in local units
const SPRITE_ASPECT = 937 / 1249; // width / height of /public/hero/tux-hologram.png
const SPRITE_URL = "/hero/tux-hologram.png";

/* -------------------------------------------------------------------------- */
/*  Hologram shader                                                            */
/* -------------------------------------------------------------------------- */
const HOLO_VERT = /* glsl */ `
uniform float uTime;
uniform float uGlitch;
varying vec3 vN;
varying vec3 vV;
varying vec3 vW;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  float slice = step(0.5, fract(floor(wp.y * 9.0) * 0.37 + floor(uTime * 14.0) * 0.61));
  wp.x += uGlitch * slice * 0.22;
  vec4 mv = viewMatrix * wp;
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  vW = wp.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const HOLO_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uScale;
uniform float uOriginY;
uniform float uReveal;
uniform float uAlpha;
uniform float uStrength;
uniform float uLine;
varying vec3 vN;
varying vec3 vV;
varying vec3 vW;
void main() {
  float ly = (vW.y - uOriginY) / uScale;
  float front = mix(-2.1, 2.1, uReveal);
  float edge = 0.0;
  if (uReveal < 1.0) {
    if (ly > front) discard;
    edge = smoothstep(0.3, 0.0, front - ly);
  }
  float fres = 0.55;
  if (uLine < 0.5) {
    fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
  }
  float scan = 0.85 + 0.15 * sin(ly * 80.0 - uTime * 0.3);
  float sweepY = mix(-2.1, 2.1, fract(uTime * 0.16));
  float sweep = exp(-pow((ly - sweepY) * 3.2, 2.0));
  float flick = 0.95 + 0.05 * sin(uTime * 53.0);
  float k = (0.2 + fres * 1.0 + sweep * 0.8 + edge * 1.5) * scan * flick;
  k *= mix(1.0, 1.7, uLine);
  vec3 col = uColor * (0.55 + fres + sweep * 0.7 + edge * 1.4);
  gl_FragColor = vec4(col, clamp(k, 0.0, 1.0) * uAlpha * uStrength);
}`;

/* -------------------------------------------------------------------------- */
/*  Tux hologram sprite shader                                                 */
/* -------------------------------------------------------------------------- */
const SPRITE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SPRITE_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uTime;
uniform float uGlitch;
uniform float uReveal;
uniform float uAlpha;
uniform float uPhase;
uniform float uTint;
varying vec2 vUv;
void main() {
  float front = uReveal * 1.08 - 0.04;
  if (uReveal < 1.0 && vUv.y > front) discard;
  float edge = uReveal < 1.0 ? smoothstep(0.045, 0.0, front - vUv.y) : 0.0;

  // horizontal glitch slices + slight chromatic split while glitching
  vec2 uv = vUv;
  float row = floor(uv.y * 36.0);
  float slice = step(0.55, fract(sin(row * 12.9898 + floor((uTime + uPhase) * 14.0) * 78.233) * 43758.5453));
  uv.x += uGlitch * slice * 0.04;
  float cs = 0.0012 + uGlitch * 0.007;
  vec4 c = texture2D(uMap, uv);
  c.r = texture2D(uMap, uv + vec2(cs, 0.0)).r;
  c.b = texture2D(uMap, uv - vec2(cs, 0.0)).b;

  float scan = 0.93 + 0.07 * sin(vUv.y * 540.0 - uTime * 5.0);
  float sweep = exp(-pow((vUv.y - (1.0 - fract(uTime * 0.12))) * 9.0, 2.0));
  float flick = 0.97 + 0.03 * sin(uTime * 47.0 + uPhase) + uGlitch * 0.12;

  vec3 col = c.rgb * scan * flick;
  col *= mix(vec3(1.0), vec3(0.45, 0.85, 1.25), uTint);
  col += vec3(0.2, 0.75, 1.0) * sweep * 0.2 * c.a;

  float side = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
  col += vec3(0.45, 0.95, 1.0) * edge * side;
  float a = max(c.a, edge * side * 0.55) * uAlpha;
  gl_FragColor = vec4(col, a);
}`;

/* -------------------------------------------------------------------------- */
/*  Star field shader (GPU-driven drift, no per-frame buffer uploads)          */
/* -------------------------------------------------------------------------- */
const STAR_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vC;
varying float vA;
void main() {
  vec3 p = position;
  p.z = mod(p.z + uTime * 0.9 + 44.0, 52.0) - 44.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aSize * uPx / max(-mv.z, 0.1), 1.0, 5.0);
  vC = aColor;
  float tw = 0.75 + 0.25 * sin(uTime * 1.6 + aPhase);
  vA = smoothstep(-44.0, -34.0, p.z) * (1.0 - smoothstep(2.0, 6.0, p.z)) * tw;
}`;

const STAR_FRAG = /* glsl */ `
varying vec3 vC;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vC, a * a * vA);
}`;

/* -------------------------------------------------------------------------- */
/*  Background drifters: small wireframe "holograms"                           */
/* -------------------------------------------------------------------------- */
type Drifter = {
  geo: () => THREE.BufferGeometry;
  fx: number; // horizontal position, -1..1 of the visible width at its depth
  fy: number; // vertical position, -1..1
  z: number;
  size: number;
  color: number;
  spin: [number, number];
};

const DRIFTERS: Drifter[] = [
  { geo: () => new THREE.IcosahedronGeometry(1, 1), fx: 0.8, fy: 0.58, z: -2, size: 0.5, color: SECONDARY, spin: [0.22, 0.31] },
  { geo: () => new THREE.OctahedronGeometry(1, 0), fx: 0.74, fy: -0.8, z: -4, size: 0.5, color: PRIMARY, spin: [0.3, 0.18] },
  { geo: () => new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), fx: 0.94, fy: -0.38, z: -3, size: 0.42, color: SECONDARY, spin: [0.18, 0.26] },
  { geo: () => new THREE.BoxGeometry(1, 1, 1), fx: 0.22, fy: 0.8, z: -6, size: 0.55, color: PRIMARY, spin: [0.25, 0.2] },
  { geo: () => new THREE.TorusGeometry(1, 0.32, 12, 28), fx: -0.9, fy: 0.74, z: -8, size: 0.6, color: PRIMARY, spin: [0.15, 0.22] },
  { geo: () => new THREE.DodecahedronGeometry(1, 0), fx: -0.62, fy: -0.86, z: -10, size: 0.6, color: SECONDARY, spin: [0.2, 0.14] },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */
type Uni = Record<string, THREE.IUniform>;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL unavailable: the CSS background stays as a graceful fallback
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText = "display:block;width:100%;height:100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
    camera.position.set(0, 0.5, CAMERA_Z);

    const raw = (hex: number) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace);

    /* ---- shared uniforms ------------------------------------------------ */
    const time = { value: 0 };
    const glitch = { value: 0 };
    const penguinU = {
      uTime: time,
      uGlitch: glitch,
      uScale: { value: 1 },
      uOriginY: { value: 0 },
      uReveal: { value: reduce ? 1 : 0 },
      uAlpha: { value: 1 },
    };
    const bgU = {
      uTime: time,
      uGlitch: { value: 0 },
      uScale: { value: 1 },
      uOriginY: { value: 0 },
      uReveal: { value: 1 },
      uAlpha: { value: reduce ? 0.5 : 0 },
    };

    const holo = (shared: Uni, color: number, strength = 1, line = false) =>
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uColor: { value: raw(color) },
          uStrength: { value: strength },
          uLine: { value: line ? 1 : 0 },
        },
        vertexShader: HOLO_VERT,
        fragmentShader: HOLO_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });

    /* ---- star field ----------------------------------------------------- */
    const starCount = window.innerWidth < 700 ? 900 : 1800;
    const sPos = new Float32Array(starCount * 3);
    const sSize = new Float32Array(starCount);
    const sPhase = new Float32Array(starCount);
    const sColor = new Float32Array(starCount * 3);
    const tints = [raw(0xdbe8ff), raw(0xa5d8ff), raw(0x7fb2ff), raw(0x9ff3ff)];
    for (let i = 0; i < starCount; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 70;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      sPos[i * 3 + 2] = -44 + Math.random() * 52;
      sSize[i] = 0.03 + Math.random() * Math.random() * 0.07;
      sPhase[i] = Math.random() * 6.28;
      const c = tints[Math.floor(Math.random() * tints.length)];
      sColor.set([c.r, c.g, c.b], i * 3);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));
    starGeo.setAttribute("aPhase", new THREE.BufferAttribute(sPhase, 1));
    starGeo.setAttribute("aColor", new THREE.BufferAttribute(sColor, 3));
    const starU = { uTime: time, uPx: { value: 1 } };
    const stars = new THREE.Points(
      starGeo,
      new THREE.ShaderMaterial({
        uniforms: starU,
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    stars.frustumCulled = false;
    scene.add(stars);

    /* ---- Tux hologram: projected sprite + two faint depth echoes --------- */
    const penguin = new THREE.Group();
    scene.add(penguin);

    const texU: { value: THREE.Texture | null } = { value: null };
    const spriteGeo = new THREE.PlaneGeometry(PENGUIN_HEIGHT * SPRITE_ASPECT, PENGUIN_HEIGHT);
    const sprites: THREE.Mesh[] = [];
    const addSprite = (alpha: number, additive: boolean, z: number, phase: number, tint: number) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: texU,
          uTime: time,
          uGlitch: glitch,
          uReveal: penguinU.uReveal,
          uAlpha: { value: alpha },
          uPhase: { value: phase },
          uTint: { value: tint },
        },
        vertexShader: SPRITE_VERT,
        fragmentShader: SPRITE_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const mesh = new THREE.Mesh(spriteGeo, mat);
      mesh.position.z = z;
      mesh.visible = false; // shown once the texture has loaded
      penguin.add(mesh);
      sprites.push(mesh);
    };
    addSprite(0.1, true, -0.4, 3.1, 1);
    addSprite(0.16, true, -0.2, 1.7, 1);
    addSprite(1, false, 0, 0, 0);

    let disposed = false;
    let introAt = reduce ? 0 : -1;
    let introObserver: MutationObserver | undefined;
    const isLoaderExiting = () => document.documentElement.dataset.loading !== "on";
    const beginIntro = () => {
      if (!disposed && introAt < 0) introAt = time.value;
    };
    const waitForLoader = () => {
      if (isLoaderExiting()) {
        beginIntro();
        return;
      }

      introObserver = new MutationObserver(() => {
        if (isLoaderExiting()) {
          introObserver?.disconnect();
          introObserver = undefined;
          beginIntro();
        }
      });
      introObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-loading"],
        childList: true,
        subtree: true,
      });
    };
    new THREE.TextureLoader().load(SPRITE_URL, (tex) => {
      if (disposed) { tex.dispose(); return; }
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      texU.value = tex;
      sprites.forEach((m) => (m.visible = true));
      if (!reduce) waitForLoader();
      if (reduce) renderer.render(scene, camera);
    });

    /* ---- drifters -------------------------------------------------------- */
    const drifters = DRIFTERS.map((d, i) => {
      const geo = d.geo();
      const wire = new THREE.EdgesGeometry(geo, 1);
      const mesh = new THREE.LineSegments(wire, holo(bgU, d.color, 0.9, true));
      mesh.scale.setScalar(d.size);
      scene.add(mesh);
      geo.dispose();
      return { d, mesh, phase: i * 1.7 };
    });

    /* ---- central 3D lock hologram -------------------------------------- */
    const lock = new THREE.Group();
    const lockUniforms: Uni = { ...bgU, uGlitch: { value: 0 } };
    const lockBodyShape = new THREE.Shape();
    const lockWidth = 1.4;
    const lockHeight = 1.1;
    const corner = 0.18;
    const halfW = lockWidth / 2;
    const lockHalfHeight = lockHeight / 2;
    lockBodyShape.moveTo(-halfW + corner, -lockHalfHeight);
    lockBodyShape.lineTo(halfW - corner, -lockHalfHeight);
    lockBodyShape.quadraticCurveTo(halfW, -lockHalfHeight, halfW, -lockHalfHeight + corner);
    lockBodyShape.lineTo(halfW, lockHalfHeight - corner);
    lockBodyShape.quadraticCurveTo(halfW, lockHalfHeight, halfW - corner, lockHalfHeight);
    lockBodyShape.lineTo(-halfW + corner, lockHalfHeight);
    lockBodyShape.quadraticCurveTo(-halfW, lockHalfHeight, -halfW, lockHalfHeight - corner);
    lockBodyShape.lineTo(-halfW, -lockHalfHeight + corner);
    lockBodyShape.quadraticCurveTo(-halfW, -lockHalfHeight, -halfW + corner, -lockHalfHeight);

    // The keyhole is cut through the extruded body, not painted onto its face.
    const keyhole = new THREE.Path();
    keyhole.moveTo(-0.08, -0.34);
    keyhole.lineTo(-0.055, -0.11);
    keyhole.bezierCurveTo(-0.21, -0.015, -0.15, 0.2, 0, 0.2);
    keyhole.bezierCurveTo(0.15, 0.2, 0.21, -0.015, 0.055, -0.11);
    keyhole.lineTo(0.08, -0.34);
    keyhole.closePath();
    lockBodyShape.holes.push(keyhole);

    const lockBodyGeometry = new THREE.ExtrudeGeometry(lockBodyShape, {
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      curveSegments: 24,
    });
    lockBodyGeometry.translate(0, -0.45, -0.225);
    const bodyFill = holo(lockUniforms, PRIMARY, 0.08);
    lock.add(new THREE.Mesh(lockBodyGeometry, bodyFill));
    lock.add(new THREE.LineSegments(new THREE.EdgesGeometry(lockBodyGeometry, 20), holo(lockUniforms, SECONDARY, 1.2, true)));

    // The straight legs pass 0.12 units into the body; the centerline stays on its Z plane.
    const shacklePath = new THREE.CurvePath<THREE.Vector3>();
    shacklePath.add(new THREE.LineCurve3(new THREE.Vector3(-0.38, -0.02, 0), new THREE.Vector3(-0.38, 0.43, 0)));
    const archPoints = Array.from({ length: 25 }, (_, i) => {
      const angle = Math.PI - (i / 24) * Math.PI;
      return new THREE.Vector3(Math.cos(angle) * 0.38, 0.43 + Math.sin(angle) * 0.38, 0);
    });
    shacklePath.add(new THREE.CatmullRomCurve3(archPoints));
    shacklePath.add(new THREE.LineCurve3(new THREE.Vector3(0.38, 0.43, 0), new THREE.Vector3(0.38, -0.02, 0)));
    const shackleGeometry = new THREE.TubeGeometry(shacklePath, 48, 0.07, 12, false);
    lock.add(new THREE.Mesh(shackleGeometry, holo(lockUniforms, PRIMARY, 0.08)));
    lock.add(new THREE.LineSegments(new THREE.EdgesGeometry(shackleGeometry, 20), holo(lockUniforms, SECONDARY, 1.2, true)));

    // Trace the actual cutout on the front face and add its pulsing indicator.
    const holePoints = keyhole.getPoints(32);
    const holeOutlineGeometry = new THREE.BufferGeometry().setFromPoints(holePoints);
    holeOutlineGeometry.translate(0, -0.45, 0.27);
    lock.add(new THREE.LineLoop(holeOutlineGeometry, holo(lockUniforms, SECONDARY, 0.9, true)));
    const keyholeDotMaterial = holo(lockUniforms, SECONDARY, 1.0);
    const keyholeDot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), keyholeDotMaterial);
    keyholeDot.position.set(0, -0.42, 0.28);
    lock.add(keyholeDot);

    // Projector base: two thin, pulsing rings below the lock.
    const baseRingMaterials: THREE.ShaderMaterial[] = [];
    for (const [index, radius] of [0.9, 1.1].entries()) {
      const material = holo(lockUniforms, SECONDARY, 0.3, true);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 4, 64), material);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.08;
      lock.add(ring);
      baseRingMaterials.push(material);
      ring.userData.pulsePhase = index * 0.9;
    }
    lock.scale.setScalar(0.78);
    lock.position.set(0, 0.18, -1.6);
    scene.add(lock);

    /* ---- layout ---------------------------------------------------------- */
    let w = 1, h = 1, aspect = 1;
    let baseX = 0, baseY = 0, baseScale = 1;
    const halfH = (z: number) => Math.tan((FOV * Math.PI) / 360) * (CAMERA_Z - z);

    const layout = () => {
      w = Math.max(1, host.clientWidth);
      h = Math.max(1, host.clientHeight);
      aspect = w / h;
      renderer.setSize(w, h, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      starU.uPx.value = (h * dpr) / (2 * Math.tan((FOV * Math.PI) / 360));

      const visH = halfH(0) * 2;
      const visW = visH * aspect;
      if (aspect >= 1) {
        baseScale = (visH * 0.58) / PENGUIN_HEIGHT;
        baseX = visW * 0.2;
        baseY = visH * 0.015;
      } else {
        baseScale = (visH * 0.36) / PENGUIN_HEIGHT;
        baseX = 0;
        baseY = -visH * 0.2;
      }
      penguin.scale.setScalar(baseScale);
      penguinU.uScale.value = baseScale;

      drifters.forEach(({ d, mesh }) => {
        const hh = halfH(d.z);
        mesh.userData.bx = d.fx * hh * aspect * 0.95;
        mesh.userData.by = d.fy * hh * 0.9;
        mesh.position.z = d.z;
      });
    };

    /* ---- pointer --------------------------------------------------------- */
    const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / window.innerWidth - 0.5) * 2;
      ptr.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    /* ---- loop ------------------------------------------------------------ */
    let raf = 0, last = 0, visible = true;
    let nextGlitch = 4, glitchLeft = 0;
    let nextLockGlitch = 4 + Math.random() * 3, lockGlitchLeft = 0;

    const update = (dt: number) => {
      time.value += dt;
      const t = time.value;

      // materialise
      const intro = introAt < 0 ? 0 : clamp01((t - introAt - 0.15) / 2.4);
      penguinU.uReveal.value = reduce || intro >= 1 ? 1 : easeOut(intro);
      bgU.uAlpha.value = reduce ? 0.55 : 0.55 * easeOut(clamp01((t - 0.8) / 2));

      // smooth pointer
      const k = Math.min(1, dt * 3);
      ptr.sx += (ptr.x - ptr.sx) * k;
      ptr.sy += (ptr.y - ptr.sy) * k;

      // penguin float + look-at-cursor
      penguin.position.set(baseX, baseY + Math.sin(t * 1.1) * 0.1 * baseScale, 0);
      penguinU.uOriginY.value = penguin.position.y;
      penguin.rotation.y = ptr.sx * 0.24 + Math.sin(t * 0.45) * 0.06;
      penguin.rotation.x = ptr.sy * 0.1;
      if (!reduce) {
        nextLockGlitch -= dt;
        if (nextLockGlitch <= 0) {
          lockGlitchLeft = 0.05;
          nextLockGlitch = 4 + Math.random() * 3;
        }
      }
      lockUniforms.uGlitch.value = lockGlitchLeft > 0 ? 0.12 : 0;
      const glitchOffset = lockGlitchLeft > 0 ? (Math.random() - 0.5) * 0.05 : 0;
      lockGlitchLeft = Math.max(0, lockGlitchLeft - dt);
      keyholeDotMaterial.uniforms.uStrength.value = 1 + (Math.sin(t * 2.6) + 1) * 0.3;
      baseRingMaterials.forEach((material, index) => {
        material.uniforms.uStrength.value = 0.22 + (Math.sin(t * 1.2 + index * 0.9) + 1) * 0.09;
      });
      lock.rotation.x = ptr.sy * 0.1;
      lock.rotation.y = t * 0.25 - ptr.sx * 0.16;
      lock.position.x = ptr.sx * 0.12 + glitchOffset;
      lock.position.y = 0.18 + Math.sin(t) * 0.08 - ptr.sy * 0.05;
      stars.position.x = -ptr.sx * 0.28;
      stars.position.y = ptr.sy * 0.18;

      // occasional glitch
      nextGlitch -= dt;
      if (nextGlitch <= 0) {
        glitchLeft = 0.16;
        nextGlitch = 3.5 + Math.random() * 5;
      }
      glitch.value = glitchLeft > 0 ? 1 : 0;
      glitchLeft -= dt;

      // drifters
      drifters.forEach(({ d, mesh, phase }) => {
        mesh.rotation.x += d.spin[0] * dt;
        mesh.rotation.y += d.spin[1] * dt;
        mesh.position.x = mesh.userData.bx + Math.sin(t * 0.35 + phase) * 0.18 + ptr.sx * (CAMERA_Z + d.z) * -0.03;
        mesh.position.y = mesh.userData.by + Math.cos(t * 0.3 + phase) * 0.22 + ptr.sy * (CAMERA_Z + d.z) * -0.022;
      });

      // camera parallax
      camera.position.x += (ptr.sx * 0.7 - camera.position.x) * k;
      camera.position.y += (0.5 - ptr.sy * 0.4 - camera.position.y) * k;
      camera.lookAt(0, 0, 0);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      update(dt);
      renderer.render(scene, camera);
    };

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) renderer.render(scene, camera);
    });
    ro.observe(host);

    let io: IntersectionObserver | undefined;
    if (reduce) {
      update(0);
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
      io.observe(host);
    }

    return () => {
      disposed = true;
      introObserver?.disconnect();
      texU.value?.dispose();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
