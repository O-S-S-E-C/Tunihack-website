"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/sections/HeroScene"), { ssr: false });

export default function SiteBackground() {
  return <HeroScene />;
}
