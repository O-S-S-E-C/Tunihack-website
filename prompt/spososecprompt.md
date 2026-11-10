ROLE
You are a senior front-end engineer with a strong eye for sci-fi UI and SVG animation. Project: Next.js (App Router, TypeScript, Tailwind), "TuniHack 12.0", a cybersecurity x AI hackathon organized by OSSEC (Open-Source Software ENSI Club). Dark theme (#040918, cyan #22d3ee, blue #2563eb, monospace via var(--font-jetbrains)). I already have a sponsors network section, and I like how the center looks. REWORK it so it behaves like a REAL GRAPH (nodes + edges, a topology map), not rectangles on rings.

HARD RULES
- Replace the existing Sponsors component and its CSS (remove the old sponsor rules from globals.css so nothing conflicts). Keep section id="sponsors" and the heading block (.about-eyebrow "// POWERED BY", .about-heading, .about-heading-rule, intro text).
- Keep the center hub design I already have (OSSEC logo in the middle, glow, sonar pulse). Do not redesign it.
- No new dependencies (no D3, no animation library). React + one inline SVG + CSS only. Strict TypeScript, no `any`.
- Do not touch other sections.

WHAT "REAL GRAPH" MEANS HERE
1. NODES ARE CIRCLES. Every sponsor is a circular node, mid size and clearly visible: diameter about 96px for platinum, 84px for gold, 72px for partners in the 1000x640 viewBox (keep sizes in one constants object). Each node = dark filled circle (#071126), a 1.5px cyan ring, and the sponsor logo centered inside with ~14px padding, object-fit contain.
2. LOGOS MUST BE READABLE. Show logos in their FULL COLOR by default (no grayscale, no low opacity). If a logo is dark and would disappear, `invert: true` renders it white. If a logo is missing or fails to load, show the sponsor's initials or name in monospace inside the circle.
3. EDGES FORM A GRAPH, NOT A STAR. Use the hierarchy as the backbone: hub -> platinum, each platinum -> its nearest gold, each gold -> its nearest partner. Then add extra cross-links so it reads as a network: every node also links to its nearest neighbor of the same or an adjacent tier that it is not yet connected to (skip if the edge would cross the hub node). Edges are straight lines or very slightly curved quadratic paths, stroke cyan at 30% opacity, 1.3px.
4. ORGANIC DETERMINISTIC LAYOUT. Do not place nodes on strict ellipses. Compute positions with a small force-directed layout run ONCE inside useMemo: seeded PRNG (mulberry32, fixed seed) for the initial angles/radii by tier (platinum near, gold middle, partner far), then ~300 fixed iterations of: node-node repulsion, spring force along edges, weak pull toward the tier's target radius, a collision radius so circles never overlap (node radius + 18px), and clamping inside the viewBox with a 60px margin. Round positions to 1 decimal so server and client markup match exactly. No Math.random, no layout in useEffect.
5. Data lives in data/sponsors.ts: type Tier = "platinum" | "gold" | "partner"; type Sponsor = { name: string; tier: Tier; logo?: string; url?: string; invert?: boolean }. Adding a sponsor is one line, and the graph rebuilds itself. 2 to 4 platinum, 3 to 6 gold, 4 to 10 partners must all look good.

THE PROCESS (the animation tells a story: a signal spreading from the club to its network)
Play ONCE when the graph first scrolls into view (IntersectionObserver, threshold 0.3, then disconnect). Until then, everything except the empty dot-grid background is hidden. Derive the order from the graph itself using BFS depth from the hub, not from hardcoded times:

STEP 1, EMERGE (0.0s to 1.0s): The center OSSEC logo emerges alone: scale 0.5 to 1 with fade, its ring draws around the circle (stroke-dashoffset), then 2 sonar pulses expand outward. The caption "OSSEC // THE CLUB" types or fades in under it. Nothing else is visible.

STEP 2, PROPAGATE (depth 1): From the hub, the edges to the platinum nodes start to GROW outward at the same time (stagger 120ms): the line draws with stroke-dasharray/stroke-dashoffset (pathLength=1, 0.8s, ease-out), and a bright glowing head dot travels at the tip of the line, leaving the line lit cyan behind it.

STEP 3, REVEAL (when an edge's head ARRIVES): At the exact moment the head reaches its target, that node pops in: circle scales 0 -> 1.12 -> 1 (overshoot, 450ms), the ring draws around it, a small ripple ring expands from it, then its logo fades in inside the circle (250ms after the pop). A node NEVER appears before the edge that reaches it has finished.

STEP 4, REPEAT OUTWARD: Each newly revealed node becomes a new source. The edges leaving it toward the next depth start drawing at its arrival time (+80ms), so the signal visibly branches and spreads: hub -> platinum -> gold -> partners. Compute everything in one helper:
  arrive[hub] = 1.0
  edgeStart = arrive[parent] + 0.08 + siblingIndex * 0.12
  arrive[node] = edgeStart + edgeDuration (0.8)
  Pass `--start` and `--arrive` to elements as CSS variables. No setTimeout chains, no per-frame React state. Total build time should land between 4 and 6 seconds.

STEP 5, MESH (after the last node arrives): The cross-links draw in quickly (0.6s, all together, dimmer at 18% opacity), and the whole graph gives one soft "online" flash.

STEP 6, ALIVE (idle): Small cyan data packets travel along edges on a loop in both directions (SVG animateMotion, 3 to 6s, staggered, paused when the section is off screen). The hub pulses every 3.2s. Nodes have a very slow, tiny float (translate +-3px, 6 to 9s, different phase per node) applied to the node circle only, with its edges unchanged.

INTERACTION
- Hover or keyboard focus on a node: highlight its route back to the hub (the edges along the path turn bright cyan, thicker, with glow), enlarge the node 1.12x, show a small tooltip label with the sponsor name and tier ("Sponsor One // PLATINUM") in monospace, and dim everything else to 50% opacity. Also lightly highlight directly connected neighbors.
- Nodes with a url are <a> elements (target="_blank", rel="noopener noreferrer", aria-label "Name (opens in a new tab)") with a clear focus-visible ring. Others are plain groups with a <title>.
- Highlight state comes from useMemo over the hovered id and the precomputed parent map. Do not measure the DOM.
- A small "Replay" button (mono, 11px, bottom right of the graph, aria-label "Replay network animation") restarts the sequence by resetting a key.

MOBILE (under 768px)
- Keep it a graph, not a list, but simplified: reduce the viewBox to a tall 600x900, use the same layout function with a vertical bias, smaller circles (platinum 76, gold 66, partner 56), and keep the same emerge -> propagate -> reveal sequence. Hide the tooltips and rely on tap (first tap highlights the route, second tap opens the link).

ACCESSIBILITY AND QUALITY
- prefers-reduced-motion: render the final graph instantly, no drawing, packets, pulses or floating.
- Add a visually hidden <ul> listing the sponsors grouped by tier so screen readers get everything without relying on the SVG. The SVG itself is role="img" or role="group" with an aria-label.
- Animate only opacity, transform and stroke-dashoffset. Pause idle animations off screen. Clean up observers on unmount. No layout shift. 60 fps on a mid-range laptop.
- Verify with 3 and with 10 sponsors per tier: no overlapping circles, no node outside the viewBox, no edge passing through an unrelated node's circle (if one does, nudge with extra layout iterations).

WORKFLOW
1. Build the data model, the BFS depth and the deterministic force layout. Render the graph fully visible and static. Check overlaps at 1440px, 1024px, 768px and 390px.
2. Add the timing helper and the build sequence: hub emerges, then depth-1 edges propagate, then depth-1 nodes reveal, then depth 2, then depth 3, then the mesh. Verify that no node appears before its edge finishes.
3. Add hover routes, tooltips, idle packets, floating and the Replay button.
4. Add the mobile layout and reduced-motion handling.
5. Run the checklist and then `next build` and `next lint`. Fix all errors and warnings.

If anything is ambiguous, decide, leave a short comment, and continue. Do not ask me questions. At the end, list exactly which files and classes changed, and where to edit the sponsors, node sizes, colors and animation timings.