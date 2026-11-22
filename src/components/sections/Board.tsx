"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

type BoardMember = {
  id: string;
  name: string;
  role?: string;
  image: string;
};

const boardMembers: BoardMember[] = [
  { id: "board-01", name: "Chariak Abdallah", role: "Logistics Manager", image: "/Board/abdallah.webp" },
  { id: "board-02", name: "Abir Mejdoub", role: "Coordinator", image: "/Board/abir.webp" },
  { id: "board-03", name: "Arij Marzougui", role: "Coordinator", image: "/Board/arij.webp" },
  { id: "board-04", name: "Emna Kort", role: "Sponsoring Manager", image: "/Board/emna.webp" },
  { id: "board-05", name: "Farah Hajji", role: "Media Manager – Radio & Television", image: "/Board/farah.webp" },
  { id: "board-06", name: "Ahmed Farouk Aouini", image: "/Board/farouk.webp" },
  { id: "board-07", name: "Laajil Fedi", role: "Coordinator", image: "/Board/fedi.webp" },
  { id: "board-08", name: "Marouen Mohamed Hedi", role: "Media Manager – Social Media Content", image: "/Board/hedi.webp" },
  { id: "board-09", name: "Kanzari Mohamed", role: "Logistics Manager", image: "/Board/kanzari.webp" },
  { id: "board-10", name: "Mouheb Baccouch", role: "Coordinator", image: "/Board/mouheb.webp" },
  { id: "board-11", name: "Nour Ben Amar", role: "Media Manager – Social Media Content", image: "/Board/nour.webp" },
  { id: "board-12", name: "Ons Ben Abdelkader", role: "Sponsoring Manager", image: "/Board/ons ba.webp" },
  { id: "board-13", name: "Lachheb Ons", role: "Design Manager", image: "/Board/onsL.webp" },
  { id: "board-14", name: "Ons Guenaoui", role: "Design Manager", image: "/Board/onsg.webp" },
  { id: "board-15", name: "Ajil Yesser", role: "Coordinator", image: "/Board/yesser.webp" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function BoardBadge({ member, index }: { member: BoardMember; index: number }) {
  return (
    <li className="ambassador-item" style={{ "--badge-delay": `${index * -0.27}s` } as CSSProperties}>
      <article className="ambassador-badge board-badge" aria-label={`${member.name}, TuniHack Board`}>
        <div className="ambassador-lanyard" aria-hidden="true"><span /></div>
        <div className="ambassador-clip" aria-hidden="true"><span /></div>
        <div className="ambassador-hole" aria-hidden="true" />
        <div className="board-badge-content">
          <Image
            className="board-badge-logo"
            src="/logo/TuniHack-removebg-preview.png"
            alt="TuniHack"
            width={96}
            height={42}
          />
          <p className="board-badge-label">TuniHack Board</p>
          <h3 className="board-badge-name">{member.name}</h3>
          <p className="board-badge-role">{member.role ?? ""}</p>
          <div className="board-badge-photo">
            <Image
              src={member.image}
              alt={`Portrait of ${member.name}`}
              fill
              sizes="(max-width: 1023px) 300px, 22vw"
              className="board-badge-photo-image"
            />
          </div>
        </div>
      </article>
    </li>
  );
}

export default function Board() {
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
        const current = Math.min(boardMembers.length, Math.floor(progress * (boardMembers.length - 1)) + 1);
        countRef.current.textContent = `${String(current).padStart(2, "0")} / ${String(boardMembers.length).padStart(2, "0")}`;
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
      section.style.height = `${window.innerHeight + travel}px`;
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
    <section id="board" ref={sectionRef} className="ambassadors-section board-section" aria-labelledby="board-heading">
      <div className="ambassadors-pin" ref={viewportRef}>
        <header className="ambassadors-header">
          <p className="about-eyebrow">TuniHack leadership</p>
          <h2 id="board-heading" className="about-heading">Our Board</h2>
          <div className="about-heading-rule" aria-hidden="true" />
        </header>
        <div className="ambassadors-track-window" ref={trackWindowRef}>
          <ul className="ambassadors-track" ref={trackRef}>
            {boardMembers.map((member, index) => <BoardBadge key={member.id} member={member} index={index} />)}
          </ul>
        </div>
        <div className="ambassadors-progress" aria-hidden="true">
          <span className="ambassadors-progress-track"><span className="ambassadors-progress-fill" ref={progressRef} /></span>
          <span className="ambassadors-count" ref={countRef}>01 / 15</span>
        </div>
      </div>
    </section>
  );
}
