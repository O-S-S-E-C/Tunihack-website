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

function EventWordmark({ name, subtitle }: { name: "TuniHack" | "PitchHack"; subtitle: string }) {
  const [first, accent] = name === "TuniHack" ? ["Tuni", "Hack"] : ["Pitch", "Hack"];
  return (
    <div className="about-event-wordmark-wrap">
      <h3 className="about-event-wordmark" aria-label={name}>
        <span className="about-event-wordmark-main">{first}</span><span className="about-event-wordmark-accent">{accent}</span>
      </h3>
      <p className="about-event-wordmark-subtitle">{subtitle}</p>
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
