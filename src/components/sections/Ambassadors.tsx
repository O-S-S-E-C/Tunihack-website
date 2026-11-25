"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type Ambassador = {
  id: string;
  name: string;
  school: string;
  city: string;
  image?: string;
};

const ambassadors: Ambassador[] = [
  { id: "amb-01", name: "Ghofrane Helal", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/Ghofrane helal.webp" },
  { id: "amb-02", name: "Hazem Souki", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/Hazem Souki.webp" },
  { id: "amb-03", name: "Zayneb Yousfi", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/Zayneb Yousfi.webp" },
  { id: "amb-04", name: "Ali Souihy", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/ali souihy.webp" },
  { id: "amb-05", name: "Aya Skhiri", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/aya skhiri.webp" },
  { id: "amb-06", name: "Ghfranne Labidi", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/ghfranne labidi.webp" },
  { id: "amb-07", name: "Ilef Hlel", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/ilef hlel.webp" },
  { id: "amb-08", name: "Koussay", school: "TuniHack Ambassador", city: "Tunisia", image: "/Ambassadors/koussay.webp" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function PortraitPlaceholder() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 140" fill="none">
      <circle cx="60" cy="44" r="24" fill="currentColor" opacity=".72" />
      <path d="M17 132c2-31 20-49 43-49s41 18 43 49" fill="currentColor" opacity=".72" />
      <path d="M11 132h98" stroke="currentColor" strokeWidth="2" opacity=".45" />
    </svg>
  );
}

function AmbassadorBadge({ person, index }: { person: Ambassador; index: number }) {
  return (
    <li className="ambassador-item" style={{ "--badge-delay": `${index * -0.27}s` } as CSSProperties}>
      <article className="ambassador-badge" aria-label={`${person.name}, ${person.school}, ${person.city}`}>
        <div className="ambassador-lanyard" aria-hidden="true"><span /></div>
        <div className="ambassador-clip" aria-hidden="true"><span /></div>
        <div className="ambassador-hole" aria-hidden="true" />
        <div className="ambassador-poster">
          {person.image ? (
            <Image src={person.image} alt={`${person.name}, TuniHack ambassador`} width={1080} height={1350} sizes="(max-width: 767px) 260px, 22vw" className="ambassador-poster-image" />
          ) : (
            <div className="ambassador-placeholder"><PortraitPlaceholder /></div>
          )}
        </div>
      </article>
    </li>
  );
}

export default function Ambassadors() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackWindowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const trackWindow = trackWindowRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !trackWindow || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactLayout = window.matchMedia("(max-width: 1023px)");
    let sectionTop = 0;
    let travel = 0;
    let raf = 0;

    const update = () => {
      raf = 0;
      const horizontalMode = reducedMotion.matches || compactLayout.matches;
      const distance = horizontalMode ? trackWindow.scrollWidth - trackWindow.clientWidth : travel;
      const progress = distance > 0
        ? clamp(horizontalMode ? trackWindow.scrollLeft / distance : (window.scrollY - sectionTop) / travel, 0, 1)
        : 0;
      if (!horizontalMode) track.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (countRef.current) {
        const current = Math.min(ambassadors.length, Math.floor(progress * (ambassadors.length - 1)) + 1);
        countRef.current.textContent = `${String(current).padStart(2, "0")} / ${String(ambassadors.length).padStart(2, "0")}`;
      }
    };

    const scheduleUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      if (reducedMotion.matches || compactLayout.matches) {
        section.style.height = "auto";
        track.style.transform = "none";
        update();
        return;
      }
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      section.style.height = `${viewport.clientHeight + travel}px`;
      scheduleUpdate();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(trackWindow);
    observer.observe(track);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);
    trackWindow.addEventListener("scroll", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener("change", measure);
    compactLayout.addEventListener("change", measure);
    measure();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      trackWindow.removeEventListener("scroll", scheduleUpdate);
      reducedMotion.removeEventListener("change", measure);
      compactLayout.removeEventListener("change", measure);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="ambassadors" ref={sectionRef} className="ambassadors-section" aria-labelledby="ambassadors-heading">
      <div className="ambassadors-pin" ref={viewportRef}>
        <header className="ambassadors-header">
          <p className="about-eyebrow">TuniHack community</p>
          <h2 id="ambassadors-heading" className="about-heading">Our Ambassadors</h2>
          <div className="about-heading-rule" aria-hidden="true" />
        </header>
        <div className="ambassadors-track-window" ref={trackWindowRef}>
          <ul className="ambassadors-track" ref={trackRef}>
            {ambassadors.map((person, index) => <AmbassadorBadge key={person.id} person={person} index={index} />)}
          </ul>
        </div>
        <div className="ambassadors-progress" aria-hidden="true">
          <span className="ambassadors-progress-track"><span className="ambassadors-progress-fill" ref={progressRef} /></span>
          <span className="ambassadors-count" ref={countRef}>01 / 08</span>
        </div>
      </div>
    </section>
  );
}
