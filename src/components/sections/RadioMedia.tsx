"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";

type RadioFeature = {
  id: string;
  name: string;
  image: string;
  videoUrl: string;
};

const radioFeatures: RadioFeature[] = [
  {
    id: "radio-diwan",
    name: "Radio Diwan",
    image: "/media/radio-diwan-cutout.webp",
    videoUrl: "https://www.facebook.com/share/p/19sfZCTk2H/",
  },
  {
    id: "rtci",
    name: "RTCI",
    image: "/media/radio-rtci-cutout.webp",
    videoUrl: "https://www.facebook.com/share/p/1L4ete1M6w/",
  },
  {
    id: "tv",
    name: "TV",
    image: "/media/tv-cutout.webp",
    videoUrl: "https://www.youtube.com/watch?v=0PtAK_w1XoA",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function RadioCard({ feature }: { feature: RadioFeature }) {
  return (
    <li className="radio-artwork-item">
      <a className="radio-artwork-link" href={feature.videoUrl} target="_blank" rel="noreferrer" aria-label={`Watch TuniHack on ${feature.name}`}>
        <Image className="radio-artwork" src={feature.image} alt={feature.id === "tv" ? "Wataniya 2 logo on a retro television screen" : `${feature.name} radio`} width={feature.id === "tv" ? 800 : 760} height={feature.id === "tv" ? 832 : 790} sizes="(max-width: 1023px) 90vw, 30vw" />
        <span className="radio-play-button" aria-hidden="true"><Play size={22} fill="currentColor" strokeWidth={1.75} /></span>
      </a>
    </li>
  );
}

export default function RadioMedia() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackWindowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
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
        const current = Math.min(radioFeatures.length, Math.floor(progress * (radioFeatures.length - 1)) + 1);
        countRef.current.textContent = `${String(current).padStart(2, "0")} / ${String(radioFeatures.length).padStart(2, "0")}`;
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
    <section id="radio" ref={sectionRef} className="ambassadors-section radio-section" aria-labelledby="radio-heading">
      <div className="ambassadors-pin" ref={viewportRef}>
        <header className="ambassadors-header">
          <p className="about-eyebrow">TuniHack in the media</p>
          <h2 id="radio-heading" className="about-heading">On Radio &amp; TV</h2>
          <div className="about-heading-rule" aria-hidden="true" />
        </header>
        <div className="ambassadors-track-window" ref={trackWindowRef}>
          <ul className="ambassadors-track radio-track" ref={trackRef}>
            {radioFeatures.map((feature) => <RadioCard key={feature.id} feature={feature} />)}
          </ul>
        </div>
        <div className="ambassadors-progress" aria-hidden="true">
          <span className="ambassadors-progress-track"><span className="ambassadors-progress-fill" ref={progressRef} /></span>
          <span className="ambassadors-count" ref={countRef}>01 / 01</span>
        </div>
      </div>
    </section>
  );
}
