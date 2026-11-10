STEP 0: REVERT YOUR PREVIOUS CHANGES (do this first, no improvements)

Your last changes to the Programme section made it worse. Undo everything you changed or created for it:
- Restore components/Programme.tsx to the original version pasted at the bottom of this message.
- Remove every file you created for that work (data/programme.ts, any new hooks, icon files, helpers).
- In the CSS, delete every rule you added or changed for the Programme (--progress, head dot, comet tail, ticks, data pulses, branch lanes, LIVE state, mobile day tabs, scramble effect, category colors) and restore the original .programme-* rules as they were before your edits. Use your own edit history from this session. If the folder is a local git repo, `git diff` can help (no remote needed).
- Do not touch About, Hero, Navbar, or any other section.
- Run `next build` and confirm the site works with the old design before continuing.

STEP 1: THE NEW TASK (a targeted visual upgrade only)

ROLE
You are a senior front-end engineer with a strong eye for sci-fi UI design. Project: Next.js (App Router, TypeScript, Tailwind), "TuniHack 12.0". Dark theme (#000 to #050b1a), cyan #22d3ee, blue #2563eb. I liked the original Programme look, so keep it and upgrade ONLY the timeline.

HARD RULES
- Keep: section id="program", the heading block, the .programme-* class naming style, the semantic <ol>/<li> structure, the useInView hook, and the data (typo fix allowed: "Dinner / Lunch Break" -> "Dinner Break").
- Do NOT add: data-model rewrites, icons, LIVE state, text scramble, mobile tab bars, new dependencies. No scope creep.
- Change only Programme.tsx and its CSS.

REFERENCE DESIGN (my "PLANNING DAY 2" poster mockup)
- One tall central trunk, perfectly vertical, thin but strong: 3px bright cyan core with glow (box-shadow 0 0 12px cyan, plus a 24px blurred halo at 25% opacity). Bigger and more prominent than the current line.
- A small glowing pentagon/diamond cap at the top of the trunk, replacing the old ROOT node. Keep the label "Day 1 // ROOT" near it.
- At the bottom, the trunk ends on a holographic base: 3 concentric flattened elliptical cyan rings with a faint glow and slow pulse, like the hologram penguin's base in the hero.
- Events are BRANCHES, not nodes: short horizontal bars (~56px, 3px thick, same glow) coming off the trunk, alternating right, left, right, left. Right side text is left-aligned, left side text is right-aligned. Text sits at the end of the branch: time in bold monospace, title below, small gray detail under it.
- Each branch ends with a tiny glowing diamond tip (6px).

TREE FEEL
- Parallel events (Day 1: "Workshop 1 & Workshop 2" at 10:00, and "Contest CP" 14:00-17:00 with "Workshop 3" 14:30-16:30) become a FORKED branch: it leaves the trunk, then splits with a 45 degree elbow into two twigs (one slightly above, one below), each with its own tip and label. Mark these with a minimal `parallel` flag in the data.
- Branch length varies slightly (48 to 72px) by index, deterministic (no Math.random) so SSR and client match.
- Draw trunk, branches, elbows and twigs in ONE inline SVG per day so alignment is exact. Compute each branch's Y from the real <li> offsetTop, measured on mount and on ResizeObserver, never inside the scroll handler.

SCROLL BEHAVIOR (fix what felt wrong)
- The trunk lights up top to bottom as the user scrolls: an unlit track (white 10%) plus a cyan lit overlay driven by a CSS variable --progress on the list element.
- ONE passive, rAF-throttled scroll listener per day. Progress = how far the viewport center line has moved through the list (clamped 0 to 1). No React state per frame, no layout reads in the handler.
- A branch and its text light up only when the lit trunk reaches its Y, and are dim (opacity 0.3) before that. Smooth transitions, no flicker.
- Remove the old per-item stagger delays; scroll position now controls reveal.
- Use transform and opacity only, no layout shift when items activate.

LAYOUT
- Desktop (>= 1024px): Day 1 and Day 2 side by side, each with its own centered trunk and alternating branches. Give each column enough width so left-side labels never clip.
- Below 1024px: trunk at the left (x = 14px), all branches go right, text left-aligned, no clipping at 390px, no horizontal scroll.
- Keep at least ~96px between branches. Let the Day 1 trunk grow tall.

QUALITY
- prefers-reduced-motion: everything lit, no pulsing.
- AA contrast, <time> keeps real text, <ol> order stays chronological for screen readers.
- Clean up listeners and observers on unmount. Strict TypeScript, no `any`.

WORKFLOW
1. Revert (Step 0) and verify.
2. Build the static tree first (trunk, cap, base rings, alternating and forked branches), everything lit. Verify at 1440px and 390px.
3. Add the scroll-driven lit trunk and branch activation.
4. Polish glows and rings, then check: no clipped left labels, forks merge cleanly, lit line reaches the last branch exactly at the end, resize recalculates, `next build` and `next lint` pass.

If anything is ambiguous, decide, leave a short comment, and continue. Do not ask me questions. At the end, list exactly which files and classes changed.

ORIGINAL Programme.tsx (restore this in Step 0):

"use client";

import { useInView } from "@/hooks/useInView";

const programme = {
  dayOne: [
    ["07:30 – 08:30", "Registration", "Participant check-in"],
    ["08:30 – 09:30", "Opening Ceremony", "Official launch of TuniHack"],
    ["10:00 – 12:00", "Workshop 1 & Workshop 2", "Parallel learning sessions"],
    ["12:00 – 13:00", "Lunch Break", "Meal and networking"],
    ["14:00 – 17:00", "Contest CP", "Competitive programming tournament"],
    ["14:30 – 16:30", "Workshop 3", "Technical workshop"],
    ["17:00 – 17:30", "Coffee Break", "Refreshments"],
    ["17:30 – 18:30", "Murder Game", "Fun group game"],
    ["18:30 – 20:00", "Activities", "Side games and entertainment"],
    ["20:00 – 21:00", "Dinner / Lunch Break", "Evening meal break"],
    ["21:00 – 00:00", "Chess Tournament", "Friendly competition"],
    ["00:00 – Mid.", "CTF Start", "Capture The Flag tournament begins"],
  ],
  dayTwo: [
    ["08:00 – 09:00", "Coffee Break", "Morning refreshments"],
    ["10:00 – 12:00", "PitchHack Presentation", "Live pitches in front of industry judges"],
    ["12:00 – 13:00", "Lunch Break", "Midday break"],
    ["13:00 – 16:00", "TuniHack Presentation", "Final project demos and pitches"],
    ["16:00 – 17:00", "Closing Ceremony", "Winners announcement and closing"],
  ],
} as const;

const programmeDays = [
  { id: "dayOne", label: "Day 1", events: programme.dayOne },
  { id: "dayTwo", label: "Day 2", events: programme.dayTwo },
] as const;

function ProgrammeStop({ entry, index }: {
  entry: readonly [string, string, string];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLLIElement>(0.15, true);
  const [time, title, detail] = entry;

  return (
    <li
      ref={ref}
      className={`programme-stop ${inView ? "programme-stop-visible" : ""}`}
      style={{ gridRow: index + 1, transitionDelay: `${Math.min(index * 75, 675)}ms` }}
    >
      <span className="programme-trunk-segment" aria-hidden="true" />
      <span className="programme-stop-marker" aria-hidden="true" />
      <time>{time}</time>
      <div>
        <h4>{title}</h4>
        <p>{detail}</p>
      </div>
    </li>
  );
}

function ProgrammeRoot({ label }: { label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, true);

  return (
    <div ref={ref} className={`programme-tree-root ${inView ? "programme-tree-root-visible" : ""}`}>
      <span className="programme-tree-root-label">{label} <b>{"// ROOT"}</b></span>
      <span className="programme-root-node" aria-hidden="true" />
    </div>
  );
}

export default function Programme() {
  return (
    <section id="program" className="programme-section">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="about-eyebrow">THE RHYTHM OF THE WEEKEND</p>
          <h2 className="about-heading programme-title">Programme</h2>
          <div className="about-heading-rule" aria-hidden="true" />
          <p className="text-muted leading-relaxed mt-7">
            Two days of building, competing, learning, and sharing. Follow the route from the first check-in to the final announcement.
          </p>
        </div>

        <div className="programme-grid">
          {programmeDays.map(({ id, label, events }) => (
            <section className="programme-day" key={id} aria-labelledby={`${id}-heading`}>
              <div className="programme-day-heading">
                <span className="programme-day-kicker">Event timeline</span>
                <h3 id={`${id}-heading`}>{label}</h3>
              </div>
              <ProgrammeRoot label={label} />
              <ol className="programme-route">
                {events.map((entry, index) => (
                  <ProgrammeStop key={`${id}-${entry[0]}-${entry[1]}`} entry={entry} index={index} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}