"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import Image from "next/image";

import { AnimatedBeam } from "@/components/ui/animated-beam";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
    <path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.74-1.7H17.1V2.44A24.8 24.8 0 0 0 14.39 2C11.7 2 9.85 3.64 9.85 6.66V9.5H6.8V13h3.05v9h3.65Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-none stroke-current" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
    <path d="M6.5 8.3H3V21h3.5V8.3ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.83-2.04-5.61-4.76-5.61-2.19 0-3.17 1.2-3.72 2.05V8.3H9.03V21h3.49v-6.29c0-1.66.31-3.27 2.37-3.27 2.03 0 2.05 1.9 2.05 3.38V21H21v-7.3Z" />
  </svg>
);

type SocialNodeProps = {
  href: string;
  label: string;
  username: string;
  icon: ReactNode;
  className?: string;
};

const SocialNode = forwardRef<HTMLAnchorElement, SocialNodeProps>(
  ({ href, label, username, icon, className = "" }, ref) => (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open OSSEC on ${label}`}
      className={`group absolute z-20 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 pr-5 text-foreground shadow-[0_15px_45px_rgba(18,33,80,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-[0_20px_55px_rgba(37,99,235,0.2)] ${className}`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground">
        {icon}
      </span>

      <span className="hidden text-left sm:block">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs text-white/45">{username}</span>
      </span>

      <span className="ml-1 hidden text-sm text-secondary transition-transform duration-300 group-hover:translate-x-1 sm:block">
        ↗
      </span>
    </a>
  ),
);

SocialNode.displayName = "SocialNode";

const beamColors = {
  pathColor: "rgba(37, 99, 235, 0.2)",
  gradientStartColor: "#2563eb",
  gradientStopColor: "#22d3ee",
};

export default function SocialMediaBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const facebookRef = useRef<HTMLAnchorElement>(null);
  const instagramRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[430px] w-full max-w-[720px] overflow-hidden rounded-[2rem] border border-border bg-card/40 shadow-[0_25px_80px_rgba(18,33,80,0.08)] backdrop-blur-xl"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />

      <SocialNode
        ref={facebookRef}
        href="https://www.facebook.com/ossec.tn"
        label="Facebook"
        username="OSSEC Tunisia"
        icon={<FacebookIcon />}
        className="left-5 top-12 sm:left-10"
      />

      <SocialNode
        ref={instagramRef}
        href="https://www.instagram.com/open.source.software.ensi.club/"
        label="Instagram"
        username="@open.source.software.ensi.club"
        icon={<InstagramIcon />}
        className="bottom-12 left-5 sm:left-10"
      />

      <SocialNode
        ref={linkedinRef}
        href="https://www.linkedin.com/company/ossec-ensi/"
        label="LinkedIn"
        username="OSSEC"
        icon={<LinkedInIcon />}
        className="right-5 top-1/2 -translate-y-1/2 sm:right-10"
      />

      {/* Central OSSEC node */}
      <div
        ref={centerRef}
        className="absolute left-1/2 top-1/2 z-20 flex size-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2rem] border border-border bg-card/95 p-4 shadow-[0_22px_65px_rgba(37,99,235,0.22)] sm:size-36"
      >
        <div className="pointer-events-none absolute inset-2 animate-[spin_25s_linear_infinite] rounded-[1.6rem] border border-dashed border-secondary/25" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            src="/logo/logo.png"
            alt="OSSEC"
            width={64}
            height={65}
            className="block h-auto max-h-14 w-auto object-contain sm:max-h-16"
          />
          <span className="mt-2 whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.13em] text-secondary sm:text-[8px]">
            Connect with us
          </span>
        </div>
      </div>

      {/* Animated connections */}
      <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={facebookRef} curvature={-70} duration={4} {...beamColors} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={instagramRef} curvature={70} duration={4.5} delay={0.5} {...beamColors} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerRef} toRef={linkedinRef} duration={3.8} delay={1} {...beamColors} />
    </div>
  );
}
