"use client";

import { useEffect, useState } from "react";
import EventRow from "@/components/about/EventRow";
import Manifesto from "@/components/about/Manifesto";
import { useInView } from "@/hooks/useInView";
import Programme from "@/components/sections/Programme";
import Sponsors from "@/components/sections/Sponsors";
import {
  PITCHHACK_TERMINAL_LINES,
  PITCHHACK_TERMINAL_TITLE,
  TUNIHACK_TERMINAL_LINES,
  TUNIHACK_TERMINAL_TITLE,
} from "@/data/about";

const ABOUT_STATS = [
  { target: 2014, suffix: "", plain: true, label: "The beginning of TuniHack", description: "Bringing students together since 2014." },
  { target: 6, suffix: "K+", label: "Social media followers", description: "Following the TuniHack Facebook page." },
  { target: 150, suffix: "+", label: "Competitors & visitors each year", description: "Joining TuniHack to compete, build and discover." },
];

function AboutStat({ target, suffix, plain, label, description }: (typeof ABOUT_STATS)[number]) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 0 : 1400;

    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  // Years read as "2014", not "2,014".
  const format = (n: number) => (plain ? String(n) : n.toLocaleString());

  return (
    <article ref={ref} className="about-stat">
      <strong className="about-stat-value" aria-label={`${format(target)}${suffix}`}>
        {format(count)}{suffix}
      </strong>
      <span className="about-stat-label">{label}</span>
      <p className="about-stat-description">{description}</p>
    </article>
  );
}

const EVENT_WORDMARKS = {
  TuniHack: {
    index: "01",
    tag: "Hackathon",
    first: "Tuni",
    chips: ["24H build", "Teams", "Jury pitch"],
  },
  PitchHack: {
    index: "02",
    tag: "Pitch marathon",
    first: "Pitch",
    chips: ["No code", "Live pitch", "Expert feedback"],
  },
} as const;

function EventWordmark({ name, subtitle }: { name: keyof typeof EVENT_WORDMARKS; subtitle: string }) {
  const { index, tag, first, chips } = EVENT_WORDMARKS[name];
  return (
    <div className="wm">
      <span aria-hidden="true" className="wm-corner wm-corner-tl" />
      <span aria-hidden="true" className="wm-corner wm-corner-tr" />
      <span aria-hidden="true" className="wm-corner wm-corner-bl" />
      <span aria-hidden="true" className="wm-corner wm-corner-br" />

      <p className="wm-meta">
        <span className="wm-index">{index}</span>
        <span aria-hidden="true" className="wm-meta-line" />
        <span>{tag}</span>
      </p>

      <h3 className="wm-title" aria-label={name}>
        <span className="wm-outline" data-text={first} aria-hidden="true">{first}</span>
        <span className="wm-accent" aria-hidden="true">Hack</span>
      </h3>

      <p className="wm-subtitle">
        <span className="wm-prompt" aria-hidden="true">&gt;</span> {subtitle}
        <span className="wm-caret" aria-hidden="true" />
      </p>

      <ul className="wm-chips">
        {chips.map((chip) => <li key={chip}>{chip}</li>)}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="about-section bg-transparent px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="about-heading-wrap">
          <p className="about-eyebrow">EVENTS & COMMUNITY</p>
          <h2 className="about-heading">ABOUT TUNIHACK</h2>
          <div className="about-heading-rule" aria-hidden="true" />
        </div>

        <Manifesto />

        <EventRow
          terminalTitle={TUNIHACK_TERMINAL_TITLE}
          terminalLines={TUNIHACK_TERMINAL_LINES}
          visual={<EventWordmark name="TuniHack" subtitle="TUNISIA'S NATIONAL HACKATHON" />}
        />

        <div className="about-divider" aria-hidden="true" />

        <EventRow
          reverse
          terminalTitle={PITCHHACK_TERMINAL_TITLE}
          terminalLines={PITCHHACK_TERMINAL_LINES}
          visual={<EventWordmark name="PitchHack" subtitle="IDEAS THAT MOVE INDUSTRIES" />}
        />

        <div className="about-stats" aria-label="TuniHack community highlights">
          {ABOUT_STATS.map((stat) => <AboutStat key={stat.label} {...stat} />)}
        </div>

        <Programme />
        <Sponsors />
      </div>
    </section>
  );
}
