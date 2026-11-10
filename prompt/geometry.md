ROLE
You are a senior creative developer specializing in procedural 3D for the web. You are working inside an existing Next.js (App Router, TypeScript, Tailwind) project for "TuniHack 12.0", a cybersecurity x AI hackathon. The site is dark (#000 to #050b1a), with cyan (#22d3ee) and blue (#2563eb) accents. The hero already has a hologram Linux penguin and floating cyan wireframe shapes. Your job is to add 3 new cyber-defense 3D objects that match that look.

STACK (strict)
- three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- 100% procedural geometry. NO external models, textures, or GLB files.
- Client components only ("use client"), loaded with next/dynamic and ssr: false.

VISUAL LANGUAGE (apply to ALL objects, no exceptions)
Every object is a hologram, built from three layers:
1. Edge lines: EdgesGeometry (threshold angle 20 deg) rendered as LineSegments, color #22d3ee.
2. Faint fill: same geometry, MeshBasicMaterial, color #2563eb, opacity 0.08, transparent, depthWrite false, blending AdditiveBlending, side DoubleSide.
3. Scanlines: a small ShaderMaterial (or onBeforeCompile patch) on the fill that adds horizontal bands moving upward slowly (frequency ~80, speed 0.3, intensity 0.15), plus a thin fresnel rim glow.
Post-processing: Bloom (intensity 0.9, luminanceThreshold 0.1, mipmapLevels 6), transparent canvas background.
Animation: slow Y rotation 0.25 rad/s, vertical float sin(t) * 0.08, a tiny random glitch jitter every 4 to 7 seconds (50 ms offset on X). 
Each object sits on a hologram base: two thin concentric cyan rings (radius 0.9 and 1.1) with a pulsing opacity, like the penguin's projector disc.

OBJECTS (each normalized to fit a 2-unit-tall bounding box, centered at origin)

1. PADLOCK
- Body: ExtrudeGeometry of a rounded-rectangle Shape (1.4 wide, 1.1 tall, corner radius 0.18), depth 0.45, bevelEnabled true, bevelSize 0.04, bevelThickness 0.04, bevelSegments 3, curveSegments 24.
- Shackle: TubeGeometry along a CurvePath: straight leg up (0.25) -> half-circle arc (radius 0.38) -> straight leg down (0.25). Tube radius 0.07, 48 tubular segments, 12 radial. The legs must penetrate 0.12 INTO the body top so there is no gap, and the shackle must be centered on the body's Z depth.
- Keyhole: a front-face cutout (Shape hole) made of a circle r=0.1 and a trapezoid below it (top width 0.08, bottom width 0.16, height 0.22). Add a recessed inner outline on the face.
- Add one small detail: a pulsing cyan dot (sphere r 0.03) inside the keyhole.

2. SHIELD
- Outline Shape using bezierCurveTo: flat top with slightly concave dip at the center, straight sides for the first 40%, then curving inward to a pointed bottom. Total 1.4 wide x 1.7 tall. Define control points explicitly in a const array and mirror the left and right halves so it is perfectly symmetric.
- ExtrudeGeometry depth 0.14, bevel size 0.035, bevelSegments 2.
- Inner inset outline at 80% scale (second LineSegments, brighter #67e8f9) on the front face, offset 0.001 in Z to avoid z-fighting.
- Circuit traces on the face: 3 polyline paths with right-angle and 45 deg turns, ending in small node spheres (r 0.025). Center a small check-mark or keyhole glyph built from lines.

3. DATA CORE / FIREWALL
- Outer: IcosahedronGeometry(1, 1) wireframe edges.
- Inner: OctahedronGeometry(0.45) with its own edges, counter-rotating at 0.6 rad/s on two axes.
- 12 Points (size 0.05, additive, same cyan) orbiting on a tilted ring (radius 1.25, tilt 20 deg) at varied speeds.
- 2 thin torus rings (radius 1.4, tube 0.008) rotating on different axes like a gyroscope.

CODE STRUCTURE
- components/three/materials.ts: shared holo materials and the scanline shader
- components/three/Padlock.tsx, Shield.tsx, DataCore.tsx
- components/three/HoloBase.tsx: the ring base
- components/three/CyberScene.tsx: Canvas wrapper that takes a prop `variant: "padlock" | "shield" | "core"` and a `className`
- app/lab/page.tsx: a demo page showing all three side by side on a dark background so I can evaluate them
Requirements for CyberScene: 
- Canvas dpr={[1, 2]}, antialias true, powerPreference "high-performance", alpha true
- Pause rendering when offscreen (IntersectionObserver, frameloop "demand" or "never")
- Respect prefers-reduced-motion (disable rotation, glitch, float)
- Dispose all geometries and materials on unmount
- Reuse materials and geometries via useMemo; no allocations inside useFrame
- Keep each object under 8k triangles

WORKFLOW (important, follow in order)
1. Build ONLY the padlock first. Render it, screenshot it from front, side (90 deg), and 3/4 view.
2. Run this checklist and fix every failure before moving on:
   - Shackle legs enter the body (no visible gap, no poke-through on the bottom)
   - Keyhole is a real cutout and centered
   - No inverted normals or flipped faces
   - No z-fighting flicker on the face detail lines
   - Edges are clean (no diagonal triangulation lines, only silhouette and crease edges)
   - Proportions look like a classic padlock silhouette
3. Repeat for the shield, then the data core.
4. Finally, build the /lab page, run `next build`, and fix any type or lint errors.

ACCEPTANCE CRITERIA
- Reads as a recognizable padlock, shield, and core within 1 second
- Visually consistent with the existing cyan hologram penguin
- 60 fps on a mid-range laptop, no console warnings
- Changing the palette requires editing one constants file only

If any geometry is ambiguous, make a decision, document it in a comment, and continue. Do not ask me questions. At the end, summarize what you built, any tradeoffs, and how to tweak the colors and speeds.