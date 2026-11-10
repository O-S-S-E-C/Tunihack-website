ROLE
You are a senior front-end engineer. Project: Next.js (App Router, TypeScript, Tailwind), "TuniHack 12.0". Dark theme (#040918 background, cyan #22d3ee, blue #2563eb, monospace via var(--font-jetbrains)). Build the "Previous edition" gallery section for ONE past edition (TuniHack 11.0) with many photos.

RULES
- Section id="gallery". Reuse the heading style of the other sections: .about-eyebrow ("// LAST EDITION"), .about-heading ("TuniHack 11.0 in pictures"), .about-heading-rule, intro text in text-muted.
- No new dependencies. Plain React + CSS. Strict TypeScript, no `any`. Do not touch other sections.

DATA (data/gallery.ts)
type Photo = { src: string; alt: string; w: number; h: number; category: "opening" | "workshops" | "hacking" | "ctf" | "closing" };
- Photos live in /public/gallery/11/. Add 12 placeholder entries I can replace. Adding a photo is one line.

LAYOUT
- A row of filter chips: ALL, OPENING, WORKSHOPS, HACKING, CTF, CLOSING (mono, uppercase, rounded-full, 1px border; the active chip has a cyan border and a faint cyan fill).
- Under it, a viewport 420px tall (320px on mobile) with THREE columns (2 on mobile). Photos are split round-robin into the columns and keep their own aspect ratio (use w and h, so nothing jumps while loading).
- Each column drifts vertically in an infinite loop: columns 1 and 3 go up, column 2 goes down, at different speeds (30s, 36s, 44s). Duplicate each column's content once so the loop is seamless. Fade the top and bottom edges with a mask-image gradient.
- Hovering the gallery pauses all columns.
- Photo tile: rounded-lg, 1px border white/10. On hover or focus: cyan border, slight scale 1.02, and four small corner brackets appear (the same HUD detail as the rest of the site). A small caption at the bottom: "IMG_014 // OPENING".

FILTERING
- Clicking a chip fades the gallery out (250ms), rebuilds the columns with the filtered photos, then fades back in. Compute the columns with useMemo.
- If a filter has fewer than 3 photos, use fewer columns so it does not look empty.

LIGHTBOX
- Clicking a photo opens a full-screen overlay (dark, 94% opacity) with the large photo, a counter ("14 / 62") and previous/next buttons.
- Keyboard: Left/Right arrows to navigate, Esc to close. Touch: swipe left/right on mobile.
- It navigates within the currently filtered list. Trap focus inside, restore focus to the clicked tile on close, lock body scroll while open, aria-modal="true" and role="dialog".
- Preload the next and previous photo.

PERFORMANCE
- Use next/image for every photo with sizes set, placeholder="blur" (or a dark solid blurDataURL), and loading="lazy". In the lightbox use priority for the current photo.
- Only animate transform and opacity. Pause the drift animation when the section is off screen (IntersectionObserver). Clean up observers and listeners on unmount.

ACCESSIBILITY
- Every photo has real alt text. Tiles are <button> elements with aria-label "Open photo: <alt>". Chips are buttons with aria-pressed.
- prefers-reduced-motion: no drifting. Show the photos as a normal 3-column grid with vertical scroll inside the viewport.

WORKFLOW
1. Build the static 3-column layout from the data and check it at 1440px and 390px.
2. Add the drift animation, hover pause and off-screen pause.
3. Add the chips and the filter transition.
4. Add the lightbox with keyboard, swipe and focus handling.
5. Run `next build` and `next lint` and fix all errors and warnings.

If anything is ambiguous, decide, leave a short comment, and continue. Do not ask me questions. At the end, list the files and classes changed and tell me where to add photos and categories.