"use client";

import { useEffect, useRef } from "react";

type ProgrammeEvent = {
  time: string;
  title: string;
  detail: string;
  parallel?: boolean; // draws a forked twig at the branch tip
};

const days: { id: string; label: string; date: string; events: ProgrammeEvent[] }[] = [
  {
    id: "day1",
    label: "Day 1",
    date: "28 NOV",
    events: [
      { time: "07:30 – 08:30", title: "Registration", detail: "Participant check-in" },
      { time: "08:30 – 09:30", title: "Opening Ceremony", detail: "Official launch of TuniHack" },
      { time: "10:00 – 12:00", title: "Workshop 1 & Workshop 2", detail: "Parallel learning sessions", parallel: true },
      { time: "12:00 – 13:00", title: "Lunch Break", detail: "Meal and networking" },
      { time: "14:00 – 17:00", title: "Contest CP", detail: "Competitive programming tournament", parallel: true },
      { time: "14:30 – 16:30", title: "Workshop 3", detail: "Technical workshop", parallel: true },
      { time: "17:00 – 17:30", title: "Coffee Break", detail: "Refreshments" },
      { time: "17:30 – 18:30", title: "Murder Game", detail: "Fun group game" },
      { time: "18:30 – 20:00", title: "Activities", detail: "Side games and entertainment" },
      { time: "20:00 – 21:00", title: "Dinner Break", detail: "Evening meal break" },
      { time: "21:00 – 00:00", title: "Chess Tournament", detail: "Friendly competition" },
      { time: "00:00 → Overnight", title: "CTF Start", detail: "Capture The Flag tournament begins" },
    ],
  },
  {
    id: "day2",
    label: "Day 2",
    date: "29 NOV",
    events: [
      { time: "08:00 – 09:00", title: "Coffee Break", detail: "Morning refreshments" },
      { time: "10:00 – 12:00", title: "PitchHack Presentation", detail: "Live pitches in front of industry judges" },
      { time: "12:00 – 13:00", title: "Lunch Break", detail: "Midday break" },
      { time: "13:00 – 16:00", title: "TuniHack Presentation", detail: "Final project demos and pitches" },
      { time: "16:00 – 17:00", title: "Closing Ceremony", detail: "Winners announcement and closing" },
    ],
  },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function ProgrammeDay({ day, index }: { day: (typeof days)[number]; index: number }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let top = 0;
    let height = 1;
    let offsets: number[] = [];
    let raf = 0;

    // Layout is measured only on mount and on resize, never inside the scroll handler.
    const measure = () => {
      top = body.getBoundingClientRect().top + window.scrollY;
      height = body.offsetHeight || 1;
      offsets = itemRefs.current.map((li) => (li ? li.offsetTop + 14 : 0));
      update();
    };

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.6; // reading line at 60% of the viewport
      const p = reduce ? 1 : clamp((window.scrollY + line - top) / height, 0, 1);
      body.style.setProperty("--p", p.toFixed(4));
      const y = p * height;
      itemRefs.current.forEach((li, i) => {
        if (li) li.classList.toggle("pg-lit", reduce || y >= offsets[i]);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="pg-day lg:col-span-2" aria-labelledby={`${day.id}-heading`}>
      <div className="pg-day-heading">
        <span className="pg-day-kicker">{`// DAY 0${index + 1} · ${day.date}`}</span>
        <h3 id={`${day.id}-heading`}>{day.label}</h3>
      </div>

      <div className="pg-body" ref={bodyRef}>
        <div className="pg-trunk" aria-hidden="true">
          <span className="pg-trunk-lit" />
        </div>
        <span className="pg-head" aria-hidden="true" />
        <div className="pg-cap" aria-hidden="true">
          <i />
          <span>
            {day.label} <b>{"// ROOT"}</b>
          </span>
        </div>

        <ol className="pg-route">
          {day.events.map((e, i) => (
            <li
              key={`${day.id}-${e.time}-${e.title}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`pg-item ${e.parallel ? "pg-fork" : ""}`}
              // deterministic branch length (48–72px), no Math.random so SSR matches the client
              style={{ gridRow: i + 1, ["--len" as string]: `${48 + ((i * 13) % 25)}px` }}
            >
              <span className="pg-twig" aria-hidden="true" />
              <time>{e.time}</time>
              <h4>{e.title}</h4>
              <p>{e.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="pg-base" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}

export default function Programme() {
  return (
    <section id="program" className="programme-section">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="about-heading programme-title">Programme</h2>
          <div className="about-heading-rule" aria-hidden="true" />
          <p className="text-muted leading-relaxed mt-7">
            Two days of building, competing, learning, and sharing. Follow the route from the first check-in to the final announcement.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
            <span>#TuniHack</span>
            <span>#PitchHack</span>
            <span>#CTF</span>
            <span>#CompetitiveProgramming</span>
            <span>#Workshops</span>
          </div>
        </div>

        <div className="pg-days">
          {days.map((day, i) => (
            <ProgrammeDay key={day.id} day={day} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}