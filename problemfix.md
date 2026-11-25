You are working in an existing Next.js 16 / React 19 / Tailwind CSS 4 repo (TuniHack 12.0 landing page).
IMPORTANT: AGENTS.md says this Next.js version has breaking changes. Read the relevant guides in node_modules/next/dist/docs/ before coding. Do not add any new npm dependency.

Find the "TUNIHACK IN THE MEDIA / On Radio & TV" section (grep for "On Radio"). It is a pinned, horizontally scrolling row of cards (2 radios + 1 TV). I'm attaching two screenshots: #1 is a normal browser at 100% zoom, #2 is the same page zoomed out to ~50%. Fix the two problems below without changing the pinned-scroll mechanism, the section header, or the progress bar, except where noted.

## Problem 1: the TV card looks wrong
The two radio cards (Diwan FM, RTCI) are transparent neon-blue "device" illustrations: a rounded glowing bezel, a dark screen, an antenna with a glowing tip, a side panel with a round knob, three small buttons and the TuniHack emblem, and a faint glow under the feet.
The TV card is just the square Instagram-style poster ("TUNE IN TO OUR TV BROADCAST") dropped in as a rectangle. It has a hard visible edge, a different background, extra text, and a different scale, so it clashes with the radios.

Rework the TV card so it is the same kind of object as the radios, not a poster:
- Render only a retro CRT TV in the same neon-blue visual language: rounded glowing bezel, two V-shaped antennas with glowing tips, a dark screen, a side panel with two knobs and speaker lines, small feet with the same underglow, and the same glow intensity and line weight as the radios. Use the TuniHack emblem badge on the side panel like the radios do.
- The channel logo (Wataniya 2, the "2 / الوطنية" mark) goes inside the screen, the way the radio logos sit inside the radio screens.
- Remove the poster's square background, its corner brackets, and its "TUNE IN TO OUR TV BROADCAST" text. There must be no visible rectangular image edge anywhere.
- Preferred approach: build the TV frame as an inline SVG/CSS component in the same file or folder, matching the radios, and place the channel logo inside the screen. Get the logo by cropping it from the poster into a small transparent asset under /public (use whatever tool is already available locally; do not add dependencies). If you cannot extract a clean logo, put a clearly labelled placeholder in the screen and tell me which file to supply.
- Final size: the TV's visual height and width should match the radios (about the same footprint, same baseline so the three devices sit on one line). Same hover/animation behaviour as the radios if they have any.

## Problem 2: layout does not scale when the browser is zoomed out
At 100% zoom the cards are small and centered, with a big empty gap between the heading (left-aligned) and the first card. Zoomed out (screenshot #2), everything stays tiny in the middle of a huge viewport: the heading drifts toward the center, the cards stay small, the margins grow, and the "01 / 03" progress bar disappears.
Zoom-out increases the viewport size in CSS pixels, so anything with fixed pixel sizes shrinks relative to the screen. Find the real cause in the code (likely fixed px card sizes, container max-width plus auto margins, padding computed from vw, or the progress bar positioned outside the sticky viewport) and fix it properly:
- Size the cards with viewport-relative units, for example `height: clamp(220px, 46svh, 900px)` or `min(46svh, 22vw)`, so the composition scales proportionally at 50%, 67%, 100%, 125% and 150% zoom and on ultrawide screens. Do not cap the max size so low that large screens show tiny cards.
- Align everything to one left edge: the heading, the first card and the progress bar should share the same left padding. The last card should end with the same right padding. No big centered gap before the first card.
- The heading block and the progress bar/counter must stay inside the sticky viewport and remain visible at every zoom level.
- If the total track width is smaller than the viewport (all cards fit), do not pin and do not add dead scroll height. Compute the section height as `100svh + max(0, trackWidth - viewportWidth)`, and in that case lay the cards out as a normal static row, aligned to the same left edge.
- Make sure the pinned-scroll math is recomputed on resize and zoom changes (ResizeObserver on the track and viewport).
- Keep the decorative wireframe globe in the top-right fully inside the viewport and scaled proportionally.

## Constraints
- Do not touch Hero, Navbar or unrelated sections.
- Keep strict TypeScript (no `any`), semantic markup, aria-hidden on decorative parts, and prefers-reduced-motion behaviour unchanged.
- Keep the existing design tokens (--primary, --secondary, --background) and the current look of the radio cards.

## Verify before finishing
Test in a real browser at viewport widths 1280, 1440, 1920 and 2560, and with browser zoom 50%, 67%, 100% and 150%. At every size check the following, and show me a screenshot at 100% and one at 50%:
1. The three devices are the same height and sit on one baseline, and the TV has no visible rectangular edge.
2. The heading, first card and progress bar share the same left edge, and no huge empty margins appear.
3. The progress bar and counter are visible, and the last card is fully visible at the end of the scroll.
4. Scrolling up reverses the movement exactly.
Run `npm run lint` and `npx tsc --noEmit`, fix any issues, then give me a short summary of the changes.