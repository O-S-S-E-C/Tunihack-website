ROLE
You are a senior creative developer. Project: Next.js (App Router, TypeScript, Tailwind), "TuniHack 12.0". Dark theme (#040918, cyan #22d3ee, blue #2563eb). The hero already has a 3D look (hologram penguin and floating cyan wireframe shapes). Turn that 3D scene into a site-wide background.

FIRST
Read the current hero 3D implementation and reuse its materials, colors and shapes. Do not redesign the hero's look.

GOAL
One fixed, full-screen 3D canvas behind the whole page. As the user scrolls, the camera moves through the same scene so each section feels like a different area of one world.

REQUIREMENTS
1. Mount the canvas once in app/layout.tsx as a client component loaded with next/dynamic (ssr: false). Style: position fixed, inset 0, z-index -1, pointer-events none, transparent alpha, so content sits on top.
2. Scene: the existing wireframe shapes spread across a deep field (z from 0 to -40), a sparse star-particle layer, and soft fog in #040918 so far objects fade out. Keep the penguin hologram near the start of the camera path so the hero looks the same as now.
3. Scroll-driven camera: compute progress = scrollY / (documentHeight - viewportHeight), smooth it with lerp (factor 0.08) and move the camera along a gentle curve (CatmullRomCurve3 with 5 to 6 points) plus a small rotation. Optional: tint the fog or an accent light slightly per section (hero cyan, about blue, programme cyan, sponsors violet-blue). Write progress to a ref, not React state.
4. Mouse parallax: very small camera offset following the pointer (max 0.3 units), disabled on touch devices.
5. Readability: add a global overlay element above the canvas with a vertical dark gradient (#040918 at 55% to 80% opacity) so text sections stay readable. Section cards keep backdrop-blur.
6. Existing sections that have solid backgrounds must become transparent or semi-transparent. List every change you make to section styles.

PERFORMANCE (strict)
- Cap dpr at [1, 2]. Under 15k triangles total. Reuse geometries and materials. Dispose everything on unmount. No allocations inside the render loop.
- Pause rendering when the tab is hidden (visibilitychange). Reduce quality on small screens: halve the particles, remove the smallest shapes. Target 60 fps on a mid-range laptop, 30+ on a mid-range phone.
- Use frameloop="always" only while scrolling or animating, and slow idle animation to every other frame if possible.

ACCESSIBILITY
- prefers-reduced-motion: freeze camera motion and shape animation (render a single static frame).
- The canvas is aria-hidden and decorative.

WORKFLOW
1. Extract the current hero scene into a reusable background component. Verify the hero looks identical.
2. Make it fixed and full page. Make the other sections transparent and fix text contrast.
3. Add the scroll-driven camera and the per-section tint.
4. Add the mobile quality reduction, tab pause and reduced-motion.
5. Check contrast on every section, then run `next build` and `next lint`.

If anything is ambiguous, decide, leave a short comment, and continue. Do not ask me questions. At the end, list files and styles changed and where to tweak the camera path, colors and particle counts.