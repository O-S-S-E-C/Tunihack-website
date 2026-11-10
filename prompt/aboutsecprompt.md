ROLE
You are a senior front-end engineer with a strong eye for design. You are working in an existing Next.js (App Router, TypeScript, Tailwind) project for "TuniHack 12.0", a cybersecurity x AI hackathon organized by OSSEC at ENSI. The site is dark (#000 to #050b1a) with cyan (#22d3ee) and blue (#2563eb) accents, monospace for terminal/UI details, and a bold sans for headings (same fonts as the hero). Build the ABOUT section. Do not touch the hero or navbar except to make the "ABOUT" nav link scroll to #about.

GOAL
The About section presents two events, TuniHack and PitchHack, as two full-width rows that mirror each other (zig-zag layout).

ROW 1: TUNIHACK
- LEFT: a macOS-style dark terminal window.
- RIGHT: the TuniHack logo (use /public/images/tunihack-logo.svg, assume it exists, and add a clearly commented fallback to the text wordmark if it is missing). Directly UNDER the logo: a row of stat boxes.

ROW 2: PITCHHACK (mirrored)
- RIGHT: a macOS-style dark terminal window.
- LEFT: the title "PitchHack" as a big wordmark styled like the hero title ("Pitch" in white, "Hack" in a blue-to-cyan gradient, with a soft cyan glow). Directly UNDER the title: a row of stat boxes.

On mobile (< 768px), each row stacks as: logo/title, stat boxes, then terminal.

MACOS TERMINAL COMPONENT (components/about/MacTerminal.tsx)
- Window: rounded-xl, bg #0b0f1a at 90% opacity with backdrop-blur, 1px border white/10, shadow with a faint cyan glow (0 0 40px rgba(34,211,238,0.12)).
- Title bar: 3 traffic-light dots (#ff5f57, #febc2e, #28c840, 12px) on the left, centered title text in muted gray monospace (e.g. "tunihack@ensi: ~/about").
- Body: monospace 13-14px, line-height 1.7, padding 20px, fixed min-height so the layout does not jump while typing.
- Line types, with typed props: command (prompt "$" in cyan, text in white), output (gray-300), success (green check + text), highlight (cyan), comment (gray-500).
- Typing animation: commands type character by character (~25ms/char), output lines appear instantly after a short delay (~120ms), with a blinking block cursor at the end. Start only when the terminal enters the viewport (IntersectionObserver, once). Play once, then stay static.
- prefers-reduced-motion: render all lines instantly, no cursor blink.
- Accessibility: aria-label on the window, the visible text is real DOM text (no canvas), and the animation must not hide content from screen readers (render the full text in a visually hidden element and mark the animated copy aria-hidden).
- Props: title, lines[], className.

TERMINAL CONTENT (put in data/about.ts, not hardcoded in JSX)

TuniHack terminal, title "tunihack@ensi: ~/about":
$ cat about.md
24-hour hackathon for top students of Tunisian engineering schools.
Organized by OSSEC, the Open-Source Software ENSI Club.
$ ./tunihack --start
[1/3] get_theme()     -> revealed later, during the event
[2/3] build_project() -> 24 hours of non-stop development
[3/3] pitch_it()      -> working prototype, industry jury
$ ls side_tracks/
competitive_programming/  capture_the_flag/  chess/  workshops/  murder_game/
$ echo "Ready?" _

PitchHack terminal, title "pitchhack@ensi: ~/vision":
$ cat pitchhack.md
Idea & strategy marathon. No 24-hour coding sprint required.
Built for visionaries and problem solvers.
$ ./pitchhack --run
[1/3] choose_problem()  -> tied to the event's theme
[2/3] design_solution() -> your idea, your strategy
[3/3] pitch_live()      -> in front of the jury
$ cat focus.txt
vision | problem-solving | presentation | selling your idea
$ echo "Pitch it." _

STAT BOXES (components/about/StatBox.tsx)
- Each box: rounded-lg, 1px border cyan/30, bg white/[0.03], padding 16px 20px, a faint corner-bracket detail (4 small L-shaped lines in the corners, cyan/60) for a HUD look.
- Big number in monospace/bold, white, with the cyan glow on hover; a small uppercase label below; a one-line description in gray-400 under that.
- Count-up animation from 0 when scrolled into view (1.2s ease-out, supports suffixes like "+" and plain years that must NOT be formatted with a thousands separator). Respect prefers-reduced-motion (show the final value).
- Row: flex, wrap, gap-4, equal width boxes.
- Data (from the README, in data/about.ts):
  - "2012" / "THE BEGINNING OF OSSEC" / "Building the community since 2012."
  - "10,000+" / "SOCIAL MEDIA FOLLOWERS" / "Following OSSEC activities and events."
  - "120+" / "ACTIVE MEMBERS EACH YEAR" / "Students learning, building, and sharing together."
- ASSUMPTION (decide, comment, and keep it a one-line change): the TuniHack row shows 2012 and 120+; the PitchHack row shows 10,000+ followers and 2012. Drive this with a `stats` array per event so I can reassign them easily.

SECTION LAYOUT AND POLISH
- Section id="about", max-w-6xl, py-24. Small eyebrow label above (monospace, cyan, tracking-widest: "// ABOUT"), then each row.
- Each row is a 2-column grid (gap-12, items-center); the second row reverses column order with `md:[&>*:first-child]:order-2`.
- Row reveal: fade + translate-y 24px on scroll, staggered (terminal first, then logo/title, then stat boxes), using IntersectionObserver or CSS only. No heavy animation library needed.
- Subtle background: a few faint cyan grid lines or dots at 4% opacity, and a thin glowing divider between the two rows.
- Keep it visually consistent with the hero: same cyan, same glow, same button/border radius.

CODE STRUCTURE
- components/about/About.tsx (section), EventRow.tsx (takes `reverse`, `terminal`, `visual`, `stats`), MacTerminal.tsx, StatBox.tsx
- data/about.ts for all copy and numbers
- hooks/useInView.ts and hooks/useTypewriter.ts (no allocations inside render loops, clean up timers on unmount)
- Strict TypeScript, no `any`, no new dependencies unless truly necessary.

WORKFLOW
1. Build MacTerminal alone, check it at 1440px and 390px widths.
2. Build StatBox and the count-up.
3. Assemble both rows, verify the mirroring and the mobile stacking order.
4. Run through this checklist and fix every failure: no layout shift while typing, no horizontal scroll on mobile, long terminal lines wrap instead of overflowing, animation starts only when visible, reduced-motion works, keyboard/screen-reader text is complete, contrast passes AA.
5. Run `next build` and `next lint`, fix all errors and warnings.

If anything is ambiguous, make a decision, leave a short comment, and continue. Do not ask me questions. At the end, summarize what you built and where to edit the copy, stats, and colors.

