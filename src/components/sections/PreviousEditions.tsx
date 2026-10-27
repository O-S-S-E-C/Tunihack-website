import React from 'react';
import { SectionHeading } from '@/components/ui/BaseComponents';

const editions = [
  {
    edition: 1,
    year: '2015',
    theme: 'The Beginning',
    highlight: 'First ever TuniHack event, bringing together 50 pioneers.',
  },
  {
    edition: 5,
    year: '2019',
    theme: 'Scaling Up',
    highlight: 'Expanded to include diverse tracks in AI and FinTech.',
  },
  {
    edition: 10,
    year: '2023',
    theme: 'Digital Transformation',
    highlight: 'A milestone edition with record-breaking participation.',
  },
  {
    edition: 11,
    year: '2024',
    theme: 'Sustainable Future',
    highlight: 'Focused on GreenTech and sustainable urban living.',
  },
];

const PreviousEditions = () => {
  return (
    <section id="editions" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Previous Editions"
          subtitle="A decade of innovation. Explore how TuniHack has evolved over the years."
        />

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-0 h-px bg-secondary/60 hidden md:block" />

          <div className="space-y-12">
            {editions.map((item) => (
              <div
                key={item.edition}
                className={`relative flex items-center justify-between w-full ${
                  'md:flex-row'
                }`}
              >
                {/* Content Box */}
                <div className="w-full md:w-[31%] p-6 rounded-2xl bg-[#0a1a55]/20 border border-white/10 hover:border-secondary/60 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-bold text-xl">Edition {item.edition}</span>
                    <span className="text-muted font-mono text-sm">{item.year}</span>
                  </div>
                  <h3 className="text-foreground font-bold text-2xl mb-2">{item.theme}</h3>
                  <p className="text-muted leading-relaxed">
                    {item.highlight}
                  </p>
                  <button className="mt-4 text-secondary text-sm font-bold hover:underline flex items-center gap-1">
                    View Details →
                  </button>
                </div>

                <div className="absolute left-0 top-[-7px] w-4 h-4 rounded-full bg-secondary shadow-[0_0_18px_rgba(34,211,238,0.8)] hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviousEditions;
