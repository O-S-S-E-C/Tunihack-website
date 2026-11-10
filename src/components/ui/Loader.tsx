"use client";
import { useEffect, useState } from "react";
import GlyphSonar from "@/components/ui/GlyphSonar";
const MIN_MS = 1400;      // minimum time on screen so the loader animation can play
const MAX_MS = 8000;      // never block the site longer than this
const ONCE_PER_SESSION = false; // true = only on the first page load of a browser session
const KEY = "tunihack-loader-seen";

export default function Loader() {
  const [show, setShow] = useState(true);
  const [leave, setLeave] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    const root = document.documentElement;
    let seen = false;
    if (ONCE_PER_SESSION) { try { seen = sessionStorage.getItem(KEY) === "1"; } catch {} }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen) {
      const id = setTimeout(() => setShow(false), 0);
      return () => {
        clearTimeout(id);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    root.dataset.loading = "on";
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let loaded = document.readyState !== "loading";
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      if (maxTimer) clearTimeout(maxTimer);
      cancelAnimationFrame(raf);
      setPct(100);
      timers.push(setTimeout(() => {
        root.dataset.loading = "leaving";
        setLeave(true);
      }, 350));
      timers.push(setTimeout(() => setShow(false), 350 + 900));
    };
    const check = () => {
      const t = performance.now() - start;
      if ((loaded && t >= (reduce ? 800 : MIN_MS)) || t >= MAX_MS) finish();
    };
    const onDOMContentLoaded = () => { loaded = true; check(); };
    if (!loaded) document.addEventListener("DOMContentLoaded", onDOMContentLoaded, { once: true });

    const tick = () => {
      const t = performance.now() - start;
      setPct((p) => (done ? p : Math.min(90, Math.round(90 * (1 - Math.exp(-t / 1400))))));
      check();
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const maxTimer: ReturnType<typeof setTimeout> = setTimeout(finish, MAX_MS);
    return () => {
      document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
      cancelAnimationFrame(raf);
      if (maxTimer) clearTimeout(maxTimer);
      timers.forEach(clearTimeout);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!show) {
      if (ONCE_PER_SESSION) { try { sessionStorage.setItem(KEY, "1"); } catch {} }
      delete document.documentElement.dataset.loading;
      document.body.style.overflow = "";
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={`loader ${leave ? "loader-leave" : ""}`} role="status" aria-label="Loading TuniHack 12.0">
      <noscript><style>{`.loader{display:none!important}`}</style></noscript>

      <div className="loader-backdrop" aria-hidden="true">
        <GlyphSonar />
      </div>

      <div className="loader-stage">
        <div className="loader-logo">
          <img
            src="/logo/TuniHackWordmark.webp"
            alt="TuniHack Wordmark"
            className="loader-wordmark-image"
            draggable={false}
          />
        </div>

        <div className="loader-meter" aria-hidden>
          <div className="loader-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
          <p>LOADING {String(pct).padStart(3, "0")}%</p>
        </div>
      </div>
    </div>
  );
}
