"use client";
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import DecryptText from '@/components/ui/DecryptText';

// three.js is only needed in the browser; load it after first paint.
const HeroScene = dynamic(() => import('@/components/sections/HeroScene'), { ssr: false });

const TAGLINES = [
  'Build. Break. Defend.',
  'Where cybersecurity meets artificial intelligence.',
  'Teach machines to think. Teach systems to resist.',
];

function DynamicTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % TAGLINES.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span key={TAGLINES[index]} className="hero-fade inline-block">
      {TAGLINES[index]}
    </span>
  );
}

const Hero = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty('--p', Math.min(1, Math.max(0, window.scrollY / window.innerHeight)).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <section id="home" ref={ref} className="sticky top-0 z-0 h-screen overflow-hidden bg-black">
      {/* 3D space: stars, floating wireframes, penguin hologram */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <HeroScene />

      {/* Diagonal text panel (desktop) */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[1] hidden h-full w-full md:block"
      >
        <defs>
          <linearGradient id="hero-panel-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#01030a" stopOpacity="0.94" />
            <stop offset="1" stopColor="#01030a" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="hero-panel-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="0.45" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <polygon points="0,0 0,100 64,100" fill="url(#hero-panel-fill)" />
        <line x1="0" y1="0" x2="64" y2="100" stroke="url(#hero-panel-edge)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Legibility scrim (mobile) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-b from-black/85 via-black/40 to-transparent md:hidden" />

      <div className="hero-inner relative z-10 flex h-full flex-col justify-start pb-12 pl-[clamp(1.5rem,5vw,5rem)] pr-6 pt-24 md:justify-end md:pb-14 md:pt-28">
        <h1
          aria-label="TuniHack 12.0"
          className="select-none font-mono font-bold leading-[0.95] tracking-tight text-foreground [--step:clamp(0.75rem,4vw,4.5rem)] [font-size:clamp(2.5rem,min(7vw,11vh),6.25rem)]"
        >
          <span className="block">
            <DecryptText text="Tuni" delay={300} duration={900} />
          </span>
          <span className="block" style={{ marginLeft: 'var(--step)' }}>
            <DecryptText
              text="Hack"
              delay={650}
              duration={900}
              className="inline-block bg-linear-to-r from-[#60a5fa] to-secondary bg-clip-text text-transparent"
            />
          </span>
          <span className="block" style={{ marginLeft: 'calc(var(--step) * 2)' }}>
            <DecryptText
              text="12.0"
              delay={1000}
              duration={900}
              className="inline-block text-secondary drop-shadow-[0_0_28px_rgba(34,211,238,0.35)]"
            />
          </span>
        </h1>

        <div className="hero-rise mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-foreground/80" style={{ animationDelay: '0.9s' }}>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-secondary" aria-hidden>
              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
            </svg>
            ENSI, Tunisia
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-secondary" aria-hidden>
              <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            28–29 November 2026
          </span>
        </div>

        <p className="hero-rise mt-4 min-h-7 max-w-md text-base leading-relaxed text-muted md:text-lg" style={{ animationDelay: '1.0s' }}>
          <DynamicTagline />
        </p>

        <p className="hero-rise mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted/70" style={{ animationDelay: '1.05s' }}>
          Cybersecurity × Artificial Intelligence
        </p>

        <div className="hero-rise mt-8 flex flex-wrap gap-4" style={{ animationDelay: '1.15s' }}>
          <a href="#register" className="lime-button rounded-md px-6 py-3 text-sm font-semibold">
            Register Now →
          </a>
          <a href="#about" className="outline-button rounded-md px-6 py-3 text-sm font-semibold">
            Explore the Event
          </a>
        </div>
      </div>

      <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-20" />
    </section>
  );
};

export default Hero;