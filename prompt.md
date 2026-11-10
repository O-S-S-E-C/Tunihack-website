UPDATE: STOP TRYING TO MAKE `next build` WORK IN THIS SANDBOX. It stalls at "Creating an optimized production build..." and we are wasting time. Do exactly this:

STEP 0 - ONE BOUNDED DIAGNOSIS (max 10 minutes total, no retry loops)
Run and report the output of:
    node -v; npm -v; nproc; free -m
    node -e "console.log(require('next/package.json').version)"
    grep -n -E "\"build\"|\"dev\"|\"start\"" package.json
    ls next.config.* 2>/dev/null && cat next.config.*
Then try, each with a hard timeout and output saved to a log:
    export NEXT_TELEMETRY_DISABLED=1
    timeout 240 npx next build --webpack > build-webpack.log 2>&1 ; echo "exit: $?"
    # only if that also stalls:
    timeout 240 npx next build --debug > build-debug.log 2>&1 ; echo "exit: $?"
Also report whether node/next processes were using CPU during the stall (`ps aux --sort=-%cpu | head`). If `--webpack` completes, use it for all builds from now on and continue with the normal plan (just keep the build flag out of package.json; do not change the project's default build script). If both stall, write one paragraph: "Build is not possible in this sandbox because ...", and move to the BUILD-FREE WORKFLOW below. Do NOT keep retrying.

BUILD-FREE WORKFLOW (use this if the build cannot run)
I will measure on Vercel preview deployments, not in this sandbox. Your job is to make the changes safely and make each one individually deployable and revertable.
- Work on a new branch `perf/landing`. ONE COMMIT PER STEP, message format: "perf(<step>): <what> [expected: <effect>, unmeasured]". Never batch steps into one commit.
- Verification you CAN do without a build, required for every step: `npx tsc --noEmit`, `npx eslint <changed files>` (or `npm run lint` if it works), `node --check` for any .mjs scripts, and a check that every file referenced in code exists in public/ (grep + ls).
- Do NOT claim measured gains. Label everything "expected, unmeasured". Never invent numbers.
- For asset resizing/compression (sharp), verify without a browser: print before/after file sizes and dimensions, and generate a side-by-side contact sheet PNG (original vs new at its real display size) in perf/contact-sheets/ so I can eyeball that nothing changed. Keep originals (git or assets-src/).
- Do NOT try to run `next dev` for measurements (dev builds are unminified and not representative).

ORDER OF WORK (lowest risk first; each is its own commit)
1. Favicon: replace the multi-MB /logo/tunihack.png icon with small icons via Next's file convention (src/app/icon.png ~96px, src/app/apple-icon.png 180px), remove metadata.icons in layout.tsx.
2. Sponsors.tsx: the SVG <image href="/logo/logo.png"> -> a small right-sized public/logo/logo-hub.webp (same framing/transparency).
3. SponsorsShowcase.tsx: add loading="lazy" + fetchPriority="low" to the <img> (no width/height attrs); compress public/sponsors/* to ~2x displayed size; update src/data/sponsors.ts if extensions change.
4. layout.tsx Tux preload: add type="image/webp" and crossOrigin="anonymous" (three's TextureLoader uses anonymous CORS, so without it the preload is not reused and Tux downloads twice).
5. Remove `priority` from below-the-fold next/image (hero-video-dialog poster, Footer logo); poster gets loading="lazy" and sizes="(max-width: 1152px) 100vw, 1152px".
6. Loader logo: if public/logo/TuniHackWordmark.webp has the same artwork/framing as the PNG and is >= ~640px on its long side, use it for the loader (LOGO in Loader.tsx + preload in layout.tsx); otherwise create TuniHackWordmark-loader.webp (same framing, max 640px, quality ~80, alpha kept).
7. Tux right-sized variants (480 for phones, 720, keep current for big/retina screens), runtime selection from window.innerWidth * min(dpr,2), preload with matching `media` attributes. Compute the real on-screen sprite size from HeroScene.tsx first and show your numbers.
8. next.config.ts: images.minimumCacheTTL = 31536000; Cache-Control headers for /hero, /logo, /sponsors, /tunihack (immutable only if filenames change with content, else max-age=86400 + stale-while-revalidate=604800).
9. Move unreferenced big originals (poster PNG, tux PNG, wordmark PNG, emblem PNG, only after grepping the whole repo for zero references) to top-level assets-src/ so they stop being deployed.
10. HeroScene start-up: yield once before heavy scene construction, pixel ratio cap (min(dpr,2) desktop, 1.5 when innerWidth < 700), `await renderer.compileAsync(scene, camera)` if supported. Keep signalSceneReady() contract. No visual change.
11. EXPERIMENTAL (separate commits, easy to revert, flag clearly in the commit message): (a) SiteBackground `dynamic(...)` without ssr:false so the three.js chunk is referenced from the initial HTML; (b) next/dynamic (SSR kept) for below-the-fold sections; (c) fonts: preload:false for families not used above the fold, remove latin-ext only after a script proves no characters outside basic Latin are used. These cannot be fully verified without a build, so describe exactly what I should check on the preview (waterfall order, hydration warnings in the console, CLS, font swap).

FINAL OUTPUT
- A table: commit hash, step, files changed, risk (low/medium/high), what to check on the preview.
- The exact commands for me to run per preview:
    node scripts/perf-baseline.mjs --url <preview-url> --label <step> [--bypass <secret>]
    node scripts/perf-baseline.mjs compare perf/baseline.json perf/<step>.json
- List anything you could not verify.