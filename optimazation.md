You are working on the repo O-S-S-E-C/Tunihack-website (Next.js 16, React 19, Tailwind 4, three.js). 
The site is deployed on Vercel and performs badly on slow internet. Do ALL of the following 
optimizations. Do not change any visual design or behavior beyond what is listed.

=====================================================
PROBLEM 1 — LOADER SCREEN: replace the 2.2MB logo image with pure CSS/SVG
=====================================================
File: src/components/ui/Loader.tsx

Currently the loader renders `/logo/TuniHackWordmark.png` (2.2MB) via a plain <img>. On slow 
internet the loading screen itself is broken because its own asset is huge.

1. Remove the <img> entirely. Recreate the "TuniHack 12.0" wordmark as pure HTML/CSS (or a small 
   inline SVG, hand-written, under 2KB): use the existing Tailwind/CSS font stack (Barlow Condensed 
   / Geist from layout.tsx), bold weight, tracking tight, with the same neon-blue/cyan glow styling 
   that matches the site's color palette (primary #2563eb, secondary #22d3ee). Apply the same 
   animation the current .loader-img has (check globals.css for .loader-img / .loader-logo styles 
   and keep the lid-reveal animation working on the new markup).
2. Delete the LOGO constant. No network request should be made by the loader.

=====================================================
PROBLEM 2 — LOADER GATING: never wait for window.load
=====================================================
File: src/components/ui/Loader.tsx

Currently the loader waits for the window "load" event, which only fires after ALL assets 
including a 23MB mp4 video. Change it to:
- Wait only for DOMContentLoaded (or document.readyState !== "loading"), never window.load.
- Lower MIN_MS from 2800 to 1400.
- Keep MAX_MS = 8000 as the hard cap.
- Keep the fake progress bar behavior and the leaving animation unchanged.

=====================================================
PROBLEM 3 — TUX PNG + 3D BACKGROUND LATENCY
=====================================================
Files: src/components/sections/HeroScene.tsx, src/components/layout/SiteBackground.tsx, 
src/app/layout.tsx

Currently: three.js is lazy-loaded via dynamic(..., { ssr: false }) so the background is invisible 
until the JS chunk + three.js + a 1.3MB texture all download. The tux sprite's reveal animation 
also waits for the loader to exit.

1. Compress the texture:
   - Convert public/hero/tux-hologram.png to WebP at ~1000px max dimension, quality 80 
     (use sharp-cli or squoosh). Target < 200KB.
   - Update SPRITE_URL to the .webp path.
2. Preload the texture in src/app/layout.tsx <head> so it downloads in parallel with the JS 
   bundle, not after it:
     <link rel="preload" as="image" href="/hero/tux-hologram.webp" fetchPriority="high" />
   (add via a <head> tag inside the root layout's <html> or using the metadata API's 
   "other" option — your choice, must end up in served HTML).
3. Instant CSS fallback so the page is never black/empty while WebGL loads:
   - In globals.css, give body (or .site-shell / the existing .site-background-overlay) a 
     permanent dark blue gradient background (#040918 → #0a1230) with a subtle radial glow. 
     This stays UNDER the WebGL canvas forever as a graceful base layer.
   - In HeroScene.tsx, set the canvas initial style to opacity:0 with a 1.2s opacity 
     transition, and set opacity to 1 right after the FIRST renderer.render() call. The 3D 
     scene should fade in smoothly instead of popping in late.
4. Decouple the tux intro from the loader exit: in the texture onLoad callback, call beginIntro() 
   if the loader is already exiting OR after a max wait of 3.5s (whichever comes first), so a 
   slow texture never blocks the reveal. Keep the MutationObserver path as the fast path.

=====================================================
PROBLEM 4 — LOW-INTERNET HARDENING (general)
=====================================================

1. Video: find where /videos/tunihack-previous-edition.mp4 (23MB) is used 
   (src/components/sections/PreviousEdition.tsx and/or src/components/ui/hero-video-dialog.tsx). 
   Ensure the <video> tag has preload="none" and loads only when the user interacts 
   (click-to-play already exists — just make sure no data downloads before that). Compress 
   public/videos/tunihack-previous-edition-poster.jpg and public/logo/TuniHack Poster.png 
   (4.6MB!) to webp < 300KB and update references.
2. Images: any large PNG used with plain <img> in components that renders above the fold should 
   either be recreated as CSS/SVG (like the loader logo) or use next/image with priority.
   Specifically check Navbar and Hero for oversized logos.
3. Fonts: add `display: "swap"` to every localFont() call in src/app/layout.tsx so text renders 
   immediately with a fallback font.
4. Verify the final result with `npm run build` — no TypeScript errors, no broken references, 
   and no file in /public larger than ~500KB except the mp4.

IMPORTANT CONSTRAINTS:
- Do not redesign anything. Same colors, same animations, same layout.
- Do not remove the loader or the 3D scene, just make them fast and resilient.
- After all changes, summarize: every file modified, every asset replaced with its before/after 
  size, and any reference I need to update manually.