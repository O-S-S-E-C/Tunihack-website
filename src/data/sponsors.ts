export type Tier = "platinum" | "gold" | "partner";

export type Sponsor = {
  name: string;
  tier: Tier;
  logo?: string;
  url?: string;
  invert?: boolean;
  /** Tile background matching the logo file's own background (default: white). */
  bg?: string;
};

// Add sponsors here. The graph assigns positions, routes, and reveal timing from these entries.
export const SPONSORS: Sponsor[] = [
  { name: "Talan", tier: "platinum", logo: "/sponsors/talan.webp", url: "https://www.talan.com" },
  { name: "GOMYCODE", tier: "gold", logo: "/sponsors/gomycode.webp", bg: "#120936", url: "https://gomycode.com" },
  { name: "MAD", tier: "partner", logo: "/sponsors/mad.webp", bg: "linear-gradient(#17ade3, #0c96d7)" },
 
 
];
