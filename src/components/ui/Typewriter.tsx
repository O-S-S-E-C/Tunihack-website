"use client";
import { useEffect, useState } from "react";

type Props = {
  phrases: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
};

/** Types and erases a list of phrases with a blinking block cursor. */
export default function Typewriter({
  phrases,
  className = "",
  typeSpeed = 42,
  deleteSpeed = 22,
  pause = 1800,
}: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let n = 0;
    let deleting = false;
    let id: ReturnType<typeof setTimeout>;

    const step = () => {
      const full = phrases[i];
      if (!deleting) {
        n++;
        setText(full.slice(0, n));
        if (n === full.length) {
          deleting = true;
          id = setTimeout(step, pause);
          return;
        }
        id = setTimeout(step, typeSpeed + Math.random() * 40);
      } else {
        n--;
        setText(full.slice(0, n));
        if (n === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
          id = setTimeout(step, 350);
          return;
        }
        id = setTimeout(step, deleteSpeed);
      }
    };
    id = setTimeout(step, 900);
    return () => clearTimeout(id);
  }, [phrases, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      <span className="text-secondary">&gt;&nbsp;</span>
      <span className="tw-live">{text}</span>
      <span className="tw-static">{phrases[0]}</span>
      <span className="hero-caret tw-live" aria-hidden />
    </span>
  );
}
