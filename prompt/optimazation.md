CONTEXT
Next.js app (src/ dir). Production loading screen is broken on slow networks:
 (a) the loader background (glyph canvas) does not appear instantly,
 (b) the loader logo image takes a long time, and the blinking "eyelids" float over empty space until it loads,
 (c) the loader sits at 90% for a long time because it waits for window "load", and the 3D background (Three.js) pops in after the loader leaves.
I want to KEEP the OLD loader design (GlyphSonar backdrop + <img className="loader-img"> logo + blinking lids) and fix the problems around it. Do not redesign anything.

STEP 0 - RESTORE THE OLD LOADER (code + CSS)
- The repo currently has a NEWER loader (text wordmark with .loader-wordmark, no GlyphSonar). Use git history to find the OLD version: `git log --oneline -- src/components/ui/Loader.tsx` and `git log -p -S"loader-img" -- src/app/globals.css`. Restore src/components/ui/Loader.tsx to the old version (imports GlyphSonar, renders <img className="loader-img" src="/logo/TuniHackWordmark.png">).
- IMPORTANT: the current src/app/globals.css has NO `.loader-img` rule. Restore the old loader CSS rules from history (at least `.loader-img`). If it cannot be found, add:
    .loader-img { display:block; width:100%; height:100%; object-fit:contain; user-select:none; }
- Keep all other CSS as is (.loader, .loader-backdrop, .glyph-sonar, .loader-stage, .loader-logo, .loader-lid*, .loader-meter...).
- If an earlier "tunihack-perf.patch" is applied, keep its HeroScene.tsx / layout.tsx / Footer / hero-video-dialog / CountdownTimer changes; only the Loader and sceneReady.ts get replaced below.

STEP 1 - REPLACE src/components/ui/Loader.tsx WITH EXACTLY THIS (it is the old loader plus fixes)
Changes vs old: no more waiting for window "load"; waits only for logo + fonts + first 3D frame (hard cap MAX_MS); lids render only after the logo has loaded; logo uses a small optimized webp.

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import GlyphSonar from "@/components/ui/GlyphSonar";
import { isSceneReady } from "@/lib/sceneReady";

const LOGO = "/logo/TuniHackWordmark-loader.webp"; // small optimized copy, preloaded in layout.tsx
const MIN_MS = 2800;      // minimum time on screen so the loader animation can play
const MAX_MS = 6000;      // never block the site longer than this, whatever is still loading
const ONCE_PER_SESSION = false; // true = only on the first page load of a browser session
const KEY = "tunihack-loader-seen";

export default function Loader() {
  const [show, setShow] = useState(true);
  const [leave, setLeave] = useState(false);
  const [pct, setPct] = useState(0);
  const [imgReady, setImgReady] = useState(false);
  const imgReadyRef = useRef(false);

  // The <img> is in the server HTML, so it can finish loading BEFORE React hydrates and
  // onLoad would never fire. The ref callback catches that case (img.complete).
  const markImgReady = useCallback(() => {
    imgReadyRef.current = true;
    setImgReady(true);
  }, []);
  const imgRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete) markImgReady();
  }, [markImgReady]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    const root = document.documentElement;
    let seen = false;
    if (ONCE_PER_SESSION) { try { seen = sessionStorage.getItem(KEY) === "1"; } catch {} }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) {
      const id = setTimeout(() => setShow(false), 0);
      return () => {
        clearTimeout(id);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    root.dataset.loading = "on";
    document.body.style.overflow = "hidden";

    const start = performance.now();
    // Do NOT wait for window "load": it waits for every image, video poster and preload on the
    // page, which on a slow connection can take many seconds. Wait only for what the first
    // screen really needs: the loader logo, the fonts, and the first frame of the 3D scene.
    let fontsReady = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { fontsReady = true; }, () => { fontsReady = true; });
    } else {
      fontsReady = true;
    }
    const assetsReady = () => imgReadyRef.current && fontsReady && isSceneReady();

    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      if (maxTimer) clearTimeout(maxTimer);
      cancelAnimationFrame(raf);
      setPct(100);
      timers.push(setTimeout(() => {
        root.dataset.loading = "leaving";
        setLeave(true);
      }, 350));
      timers.push(setTimeout(() => setShow(false), 350 + 900));
    };
    const check = () => {
      const t = performance.now() - start;
      if ((assetsReady() && t >= (reduce ? 800 : MIN_MS)) || t >= MAX_MS) finish();
    };

    const tick = () => {
      const t = performance.now() - start;
      setPct((p) => (done ? p : Math.min(90, Math.round(90 * (1 - Math.exp(-t / 1400))))));
      check(); // polled every frame, so no extra listeners are needed
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const maxTimer: ReturnType<typeof setTimeout> = setTimeout(finish, MAX_MS);
    return () => {
      cancelAnimationFrame(raf);
      if (maxTimer) clearTimeout(maxTimer);
      timers.forEach(clearTimeout);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!show) {
      if (ONCE_PER_SESSION) { try { sessionStorage.setItem(KEY, "1"); } catch {} }
      delete document.documentElement.dataset.loading;
      document.body.style.overflow = "";
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`loader ${leave ? "loader-leave" : ""}`} role="status" aria-label="Loading TuniHack 12.0">
      <noscript><style>{`.loader{display:none!important}`}</style></noscript>

      <div className="loader-backdrop" aria-hidden="true">
        <GlyphSonar />
      </div>

      <div className="loader-stage">
        <div className="loader-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={LOGO}
            alt="TuniHack 12.0"
            className="loader-img"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            onLoad={markImgReady}
            onError={markImgReady}
          />
          {/* The eyelids are positioned in % of the artwork: only show them once the artwork is there */}
          {imgReady && (
            <>
              <span className="loader-lid loader-lid-l" />
              <span className="loader-lid loader-lid-r" />
            </>
          )}
        </div>

        <div className="loader-meter" aria-hidden>
          <div className="loader-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
          <p>LOADING {String(pct).padStart(3, "0")}%</p>
        </div>
      </div>
    </div>
  );
}

STEP 2 - CREATE/REPLACE src/lib/sceneReady.ts WITH EXACTLY THIS (remove any old SCENE_READY_EVENT usage)

declare global {
  interface Window {
    __tunihackSceneReady?: boolean;
  }
}

/** Called by HeroScene once its first 3D frame is drawn (or when the scene is skipped / fails). */
export function signalSceneReady() {
  if (typeof window === "undefined") return;
  window.__tunihackSceneReady = true;
}

/** Polled by the Loader every frame. */
export function isSceneReady() {
  return typeof window !== "undefined" && !!window.__tunihackSceneReady;
}

STEP 3 - HeroScene.tsx MUST CALL signalSceneReady() (otherwise the loader always waits the full MAX_MS)
In src/components/sections/HeroScene.tsx call signalSceneReady() in ALL these cases:
 - after the first rendered frame AND after the tux texture finished loading (success or error callback of THREE.TextureLoader.load; pass an onError callback);
 - when WebGL creation fails (catch block);
 - when the scene is skipped on slow/data-saver connections: if navigator.connection?.saveData is true or effectiveType is "slow-2g" or "2g", call signalSceneReady() and return before creating the renderer;
 - in the prefers-reduced-motion path after the single static render.
Also: yield once before the heavy synchronous scene setup (move the effect body into a startScene(host) function and call it from window.setTimeout(..., 0), clean up properly) so the loader can paint first, and cap renderer pixel ratio to 1.5 when window.innerWidth < 700.

STEP 4 - LOGO IMAGE: SMALL, PRELOADED, SAME FRAMING
- Inspect public/logo/TuniHackWordmark.png (`file`, `ls -lh`). Create public/logo/TuniHackWordmark-loader.webp from it: keep the EXACT same aspect ratio, framing and transparency (the eyelids use % positions of the artwork), max 640px on the long side, quality ~80, alpha preserved, target < 80 KB (use sharp: `npx sharp-cli` or a small node script with sharp, or cwebp).
- Verify visually: render the loader and confirm the two lids still sit exactly over the pupils. If they do not, the framing changed; redo without cropping/padding changes.
- Keep the original PNG in place (do not delete it).

STEP 5 - BACKDROP APPEARS INSTANTLY WITHOUT JS
The glyph canvas (GlyphSonar) is only drawn after hydration, so the backdrop appears late. Add a CSS-only placeholder:
 - In globals.css give `.loader-backdrop` a `::before` pseudo-element (position:absolute; inset:0; pointer-events:none; opacity:1; transition: opacity .6s ease) whose background-image is an inline SVG data-URI tile (~168x152px) containing a 4x4 grid of the same glyph characters used in GlyphSonar (0 1 < > / \ { } [ ] * + etc., monospace, font-size ~12px, fill #509ce6 at ~0.12 opacity). The existing radial-gradient background of .loader-backdrop stays.
 - Make `.glyph-sonar` start at opacity:0 with `transition: opacity .6s ease`. In GlyphSonar.tsx, after the first draw, set `canvas.dataset.ready = "1"`. CSS: `.glyph-sonar[data-ready]{opacity:.9}` and `.loader-backdrop:has(.glyph-sonar[data-ready])::before{opacity:0}` so the canvas cross-fades over the static pattern.
 - Add `html{background:#040918}` so there is never a white flash before CSS/JS.

STEP 6 - src/app/layout.tsx
 - Add data-loading="on" to the <html> element (so hero animations / DecryptText stay paused from the first paint). The Loader already deletes it when it finishes and has the MAX_MS fallback.
 - In <head>, in this order:
   <link rel="preload" as="image" href="/logo/TuniHackWordmark-loader.webp" type="image/webp" fetchPriority="high" />
   <link rel="preload" as="image" href="/hero/tux-hologram.webp" type="image/webp" fetchPriority="high" crossOrigin="anonymous" />
   The crossOrigin="anonymous" on the tux link is REQUIRED: three.js TextureLoader fetches with anonymous CORS, so a preload without it is not reused and the file downloads twice. The loader logo link must NOT have crossOrigin (a plain <img> is no-cors).
 - Run `ls -lh public/hero/tux-hologram.webp public/sponsors public/videos`. If tux-hologram.webp > 150 KB, recompress (937x1249 RGBA, quality ~75-80 or reduce width to ~700px).

STEP 7 - STOP OTHER ASSETS COMPETING ON FIRST LOAD
 - Remove `priority` from the next/image in src/components/ui/hero-video-dialog.tsx (use loading="lazy" and sizes="(max-width: 1152px) 100vw, 1152px") and from the logo in src/components/layout/Footer.tsx. Keep priority only on the navbar logo.
 - Compress public/sponsors/* (served as raw png/jpg).
 - In next.config.ts add headers: Cache-Control "public, max-age=31536000, immutable" for /hero/:path*, /logo/:path*, /sponsors/:path*, /tunihack/:path* (only if filenames change when content changes; otherwise max-age=86400 + stale-while-revalidate).

STEP 8 - VERIFY (do not skip)
 - `npm run lint` and `npm run build` pass, no new warnings.
 - `npm run start`; Chrome DevTools > Network: Slow 4G, Disable cache, hard reload. Report:
   1. the loader background (dark gradient + glyph pattern) and the logo are visible in the very first paint (use the Performance filmstrip),
   2. no black eyelid rectangles are visible before the logo has loaded,
   3. tux-hologram.webp and TuniHackWordmark-loader.webp are each requested exactly once, and there is no "preloaded but not used" console warning,
   4. the loader leaves within MAX_MS (6 s) even when the network is slow, and on a fast connection around MIN_MS (2.8 s) with the 3D background already drawn behind it,
   5. window.__tunihackSceneReady becomes true in the console.
 - Summarize every file changed and why. Do not change unrelated components or visual design.