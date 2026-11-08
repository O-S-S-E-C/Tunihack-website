export type Tier = "platinum" | "gold" | "partner";

export type Sponsor = {
  name: string;
  tier: Tier;
  logo?: string;
  url?: string;
  invert?: boolean;
};

// Add sponsors here. The graph assigns positions, routes, and reveal timing from these entries.
export const SPONSORS: Sponsor[] = [
  { name: "Talan", tier: "platinum", logo: "/sponsors/talan.png", url: "https://www.talan.com" },
  { name: "GOMYCODE", tier: "gold", logo: "/sponsors/gomycode.png", url: "https://gomycode.com" },
  { name: "Pristine", tier: "partner", logo: "/sponsors/pristine.png" },
];
