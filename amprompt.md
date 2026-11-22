You are working in an existing Next.js 16 / React 19 / Tailwind CSS 4 repo (TuniHack 12.0 landing page).
IMPORTANT: AGENTS.md says this Next.js version has breaking changes. Before writing code, read the relevant guides in node_modules/next/dist/docs/. Do not add any new npm dependency.

## Goal
Add an "Ambassadors" section where the visitor scrolls down normally, the section "catches" the page, and continued vertical scrolling moves a row of ambassador badge cards horizontally. When the last card is reached, the page continues scrolling down normally.

## Files
- Create: src/components/sections/Ambassadors.tsx ("use client")
- Edit: src/app/page.tsx — render <Ambassadors /> inside the existing `page-sheet` wrapper, between <PreviousEditions /> and <EventSections />.
- Do NOT modify Hero.tsx, Navbar.tsx, or other sections. Do not add it to the navbar links.
- The section root must have id="ambassadors".

## Scroll behaviour (pinned horizontal scroll)
Use the native "sticky + tall wrapper" technique. Do NOT hijack the wheel or call preventDefault, so keyboard, touch, scrollbar and anchor navigation keep working.
- Outer <section>: height = 100svh + (trackWidth - viewportWidth), so the extra height is the horizontal distance to travel.
- Inner wrapper: `sticky top-0 h-svh overflow-hidden`, containing a flex track of cards.
- Compute progress (0..1) from window.scrollY relative to the section's top/height. Update the track with `transform: translate3d(-x, 0, 0)`.
- Use one passive scroll listener throttled with requestAnimationFrame, and write the transform directly via a ref. No React state updates per frame.
- Measure the track and viewport with ResizeObserver and recompute on resize.
- The first card starts fully visible with comfortable left padding. The last card ends fully visible (not cut off) when progress reaches 1.
- Gotcha: position: sticky breaks if any ancestor has overflow hidden/auto/scroll. Check the ancestors (main, .site-shell, .page-sheet in globals.css). If one is a problem, use `overflow-x: clip` instead, without changing the visual layout.
- Small UI inside the pinned view: a heading ("Our Ambassadors") top-left, and a thin progress bar with a counter like "03 / 08" at the bottom, driven by the same progress value.
- prefers-reduced-motion: no pinning. Render the cards as a normal horizontally scrollable row (overflow-x-auto, scroll-snap-x) with a normal-height section.

## Card design (use the attached badge image as the visual reference)
Each ambassador is a conference-badge / lanyard card:
- Portrait ratio about 5:7, width clamp(260px, 22vw, 340px), rounded-[28px], dark navy gradient (from #06112e toward the site's --background #040918) with a 1px light-blue border, soft inner blue glow and a subtle diagonal sheen.
- A small punched hole at the top center, with a simple SVG metal clip and a dark lanyard strap that goes up and out of the card's top edge (thin blue stitching along the strap edges is a nice touch).
- Idle animation: the card sways gently like a pendulum (rotate about ±1.5deg, transform-origin at the top hole), with a different animation-delay per card. Disable it under prefers-reduced-motion.
- Content, top to bottom: the TuniHack logo (/logo/TuniHack-removebg-preview.png via next/image) small and centered; a letter-spaced "AMBASSADOR" label; the ambassador's name in bold uppercase; university / city in muted text; and at the bottom a photo area (rounded) with a faint outlined giant "12" watermark behind it, like in the reference.
- Use the existing tokens: --primary #2563eb, --secondary #22d3ee, --background #040918, --foreground, --muted, and font-mono for small labels.

## Placeholder data (important)
Do NOT generate or fetch any images. Define a typed array at the top of the file:
  type Ambassador = { id: string; name: string; school: string; city: string; image?: string };
Fill it with 8 fake entries and no `image`. When `image` is missing, the photo area renders a CSS-only placeholder (blue gradient plus a simple user-silhouette SVG). When `image` is provided, render it with next/image (object-cover, with proper alt text). That way I can later replace placeholders just by filling in `image`.

## Quality bar
- Strict TypeScript, no `any`. Semantic markup: <section aria-labelledby>, cards in <ul>/<li>, decorative parts aria-hidden.
- Clean up all listeners and observers on unmount. Avoid layout thrash (read geometry only in the resize handler, not in the scroll handler).
- Works at 1440x900, 1024x768 and a 390px-wide mobile viewport (use svh, not vh).
- Professional and restrained: no extra effects beyond what is described above.
- Run `npm run lint` and `npx tsc --noEmit`, and fix any issues. Then manually verify: scrolling down pins the section, cards travel left until the last is fully visible, the section unpins, and scrolling up reverses it exactly.
- Show me a short summary of what you changed.