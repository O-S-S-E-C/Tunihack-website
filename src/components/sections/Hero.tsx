"use client";
import React, { useEffect, useRef, useState } from 'react';
import DecryptText from '@/components/ui/DecryptText';

const TAGLINES = [
  'Build. Pitch. Win.',
  'Where bold ideas meet 24 hours of code.',
  'One theme. One night. One shot.',
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
    <section id="home" ref={ref} className="relative z-10 min-h-screen overflow-hidden bg-transparent">
      {/* 3D space: stars, floating wireframes, penguin hologram */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      <div className="hero-inner relative z-10 flex min-h-screen flex-col justify-start px-6 pb-12 pt-24 md:justify-end md:px-12 md:pb-14 md:pt-28 xl:px-20">
        <h1
          aria-label="TuniHack 12.0"
          className="hero-title select-none font-sans text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-7xl xl:text-8xl [--step:1.5rem] md:[--step:2.5rem] xl:[--step:4rem]"
        >
          <span className="block">
            <DecryptText text="Tuni" delay={300} duration={900} />
          </span>
          <span className="block" style={{ marginLeft: 'var(--step)' }}>
            <DecryptText
              text="Hack"
              delay={650}
              duration={900}
              className="inline-block text-[#60a5fa]"
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

        <div className="hero-copy hero-rise mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-label text-lg tracking-[0.04em] text-foreground/90" style={{ animationDelay: '1.85s' }}>
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

        <p className="hero-copy hero-rise mt-4 min-h-7 max-w-md text-base leading-relaxed text-[#d7e6ff] md:text-lg" style={{ animationDelay: '1.95s' }}>
          <DynamicTagline />
        </p>

        <p className="hero-copy hero-rise mt-1 font-label text-base uppercase tracking-[0.12em] text-[#bed0ee]" style={{ animationDelay: '2.05s' }}>
          Theme to be revealed soon
        </p>

        <div className="hero-rise mt-8 flex flex-wrap gap-4" style={{ animationDelay: '2.2s' }}>
          <a href="https://docs.google.com/forms/d/1YrrZv_gyFh36HbVz5H8YSV0V9IbwOmfGmLHWB5akm6o/edit" target="_blank" rel="noopener noreferrer" className="lime-button rounded-md px-6 py-3 text-sm font-semibold">
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
