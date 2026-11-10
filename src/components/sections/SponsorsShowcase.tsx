"use client";

import TiltedCard from "@/components/ui/TiltedCard";
import { SPONSORS, type Sponsor, type Tier } from "@/data/sponsors";

const TIER_ORDER: Tier[] = ["platinum", "gold", "partner"];
const ORDERED: Sponsor[] = TIER_ORDER.flatMap((tier) => SPONSORS.filter((s) => s.tier === tier));

/*
 * The logo files have mixed backgrounds. Logos with a solid background fill the tile's height
 * on a tile of the same colour (`bg`), so the edges disappear; the rest sit on white.
 */
function LogoTile({ sponsor }: { sponsor: Sponsor }) {
  if (!sponsor.logo) {
    return <span className="sp-tile sp-tile-text">{sponsor.name}</span>;
  }
  return (
    <span className={`sp-tile ${sponsor.bg ? "sp-tile-bleed" : ""}`} style={sponsor.bg ? { background: sponsor.bg } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small static logos, already sized */}
      <img src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" draggable={false} />
    </span>
  );
}

export default function SponsorsShowcase() {
  return (
    <section id="sponsors" className="sponsors-section">
      <div className="sponsors-heading-wrap">
        <p className="about-eyebrow">Powered by</p>
        <h2 className="about-heading">MEET OUR SPONSORS</h2>
        <div className="about-heading-rule" aria-hidden="true" />
        <p className="text-muted leading-relaxed mt-7 max-w-2xl">
          The partners behind the builders, ideas, and challenges shaping this edition of TuniHack.
        </p>
      </div>

      <ul className="sp-tilt-grid">
        {ORDERED.map((s) => (
          <li key={s.name} className="sp-tilt-item">
            <TiltedCard
              showTooltip={false}
              altText={s.name}
              containerWidth="100%"
              containerHeight="15rem"
              imageWidth="100%"
              imageHeight="15rem"
              radius={16}
              rotateAmplitude={10}
              scaleOnHover={1.04}
              glare={0.35}
              gyroscope={false}
            >
              <LogoTile sponsor={s} />
            </TiltedCard>
            <span className="sp-tilt-name">{s.name}</span>
          </li>
        ))}
      </ul>

      <div className="sponsors-cta">
        <p>Want your brand in front of Tunisia&apos;s best student builders?</p>
        <a href="#contact" className="outline-button rounded-md px-5 py-3 text-sm font-semibold">Become a sponsor →</a>
      </div>
    </section>
  );
}
