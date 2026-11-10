"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/sections/HeroScene"), { ssr: false });

// Start fetching the scene chunk as soon as this client module evaluates.
void import("@/components/sections/HeroScene");

export default function SiteBackground() {
  return <HeroScene />;
}
