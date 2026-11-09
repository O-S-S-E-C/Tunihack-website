"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'program', label: 'Programme' },
  { id: 'sponsors', label: 'Sponsors' },
  { id: 'previousedition', label: 'Previous Edition' },
 
];

const SCROLL_THRESHOLD = 50;
const SCROLL_DELTA = 5;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [atTop, setAtTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // The hero is `sticky top-0`, so jumping to #home has nowhere to scroll to.
  // Scroll to the very top explicitly instead; other links keep native anchor behaviour.
  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    setActive('home');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 12);
      if (y < 40) setActive('home');
      if (y <= SCROLL_THRESHOLD || openRef.current) setVisible(true);
      else if (y > lastY.current + SCROLL_DELTA) setVisible(false);
      else if (y < lastY.current - SCROLL_DELTA) setVisible(true);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-all duration-300 ${
          atTop && !open
            ? 'bg-transparent'
            : 'bg-[#040918]/80 backdrop-blur-xl border-b border-white/10'
        }`}
      />

      <nav className="nav-enter relative mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <a href="#home" onClick={goHome} className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image
            src="/logo/TuniHackWordmark.png"
            alt="TuniHack Logo"
            width={40}
            height={40}
            loading="eager"
            className="h-9 w-auto object-contain brightness-150"
          />
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            TuniHack 12.0
          </span>
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={id === 'home' ? goHome : undefined}
              className={`group relative px-4 py-2 text-[14px] font-medium uppercase tracking-wide transition-colors duration-300 hover:text-white ${
                active === id ? 'text-white' : 'text-white/70'
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-4 -bottom-px h-px origin-left bg-secondary transition-transform duration-300 ease-out ${
                  active === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </a>
          ))}

          <div className="ml-2 mr-4 h-4 w-px shrink-0 bg-white/30" />

          <a
            href="#register"
            className="lime-button shrink-0 rounded-full px-8 py-2.5 text-[14px] font-bold uppercase tracking-widest"
          >
            Register Now
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="relative z-10 p-2 text-white lg:hidden"
        >
          <div className="flex w-5 flex-col gap-[5px]">
            <span className={`block h-[1.5px] bg-current transition-transform duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-transform duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      <div
        className={`relative grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col px-6 pb-6 pt-2">
            {LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={id === 'home' ? goHome : () => setOpen(false)}
                className={`border-b border-white/5 py-3.5 text-[16px] font-medium uppercase tracking-wide ${
                  active === id ? 'text-secondary' : 'text-white/70'
                }`}
              >
                {label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setOpen(false)}
              className="lime-button mt-5 w-fit rounded-full px-10 py-3.5 text-[15px] font-bold uppercase tracking-widest"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
