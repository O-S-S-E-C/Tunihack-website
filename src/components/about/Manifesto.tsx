"use client";

import { useEffect, useRef } from "react";

const PARTS: { text: string; tone?: "lead" | "accent" }[] = [
  { text: "TuniHack 12.0:", tone: "lead" },
  { text: "Dare to go beyond.", tone: "accent" },
  { text: "Challenge the ordinary, create the extraordinary, and shape what comes next." },
];

const WORDS = PARTS.flatMap(({ text, tone }) => text.split(" ").map((word) => ({ word, tone })));

// Words light up one by one as the block scrolls through the viewport.
// Progress lives in a single CSS variable, so scrolling never re-renders React.
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--reveal", "1");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the block's top hits 90% of the viewport, completes when its bottom hits 55%.
      const start = vh * 0.9;
      const end = vh * 0.55 - height;
      const progress = (start - top) / (start - end);
      el.style.setProperty("--reveal", Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="about-manifesto"
      style={{ "--n": WORDS.length } as React.CSSProperties}
    >
      {WORDS.map(({ word, tone }, i) => (
        <span
          key={i}
          className={`about-manifesto-word${tone ? ` about-manifesto-${tone}` : ""}`}
          style={{ "--i": i } as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
