"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01$%&";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  replayOnHover?: boolean;
};

export default function DecryptText({
  text,
  className = "",
  delay = 0,
  duration = 1300,
  replayOnHover = true,
}: Props) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const running = useRef(false);

  const run = useCallback(
    (startDelay: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
      running.current = true;

      const chars = [...text];
      const reveal = chars.map(
        (_, i) =>
          startDelay + (i / chars.length) * duration * 0.7 + Math.random() * duration * 0.3,
      );
      let lastSwap = 0;
      let current = chars.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      setOut(current.join(""));

      timer.current = setTimeout(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
          const el = now - t0;
          if (now - lastSwap > 45) {
            current = chars.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
            lastSwap = now;
          }
          let done = true;
          const next = chars
            .map((c, i) => {
              if (c === " " || el >= reveal[i]) return c;
              done = false;
              return current[i];
            })
            .join("");
          setOut(next);
          if (done) {
            running.current = false;
            setOut(text);
          } else {
            raf.current = requestAnimationFrame(tick);
          }
        };
        raf.current = requestAnimationFrame(tick);
      }, 0);
    },
    [text, duration],
  );

  useLayoutEffect(() => {
    const start = () => {
      if (document.visibilityState === "visible" && document.documentElement.dataset.loading !== "on") {
        run(delay);
      }
    };
    const onPageShow = () => start();
    const onVisibilityChange = () => start();

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const loading = document.documentElement.dataset.loading === "on";
    if (!loading) {
      start();
      return () => {
        window.removeEventListener("pageshow", onPageShow);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        cancelAnimationFrame(raf.current);
        clearTimeout(timer.current);
      };
    }

    const observer = new MutationObserver(() => {
      if (document.documentElement.dataset.loading !== "on") {
        observer.disconnect();
        start();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-loading"] });

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    };
  }, [run, delay]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span
      className={className}
      onMouseEnter={replayOnHover ? () => !running.current && run(0) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}
