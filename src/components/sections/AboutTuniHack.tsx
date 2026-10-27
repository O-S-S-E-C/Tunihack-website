import React from 'react';
import { SectionHeading, StatCard } from '@/components/ui/BaseComponents';

const AboutTuniHack = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="About TuniHack"
          subtitle="A legacy of innovation, pushing the boundaries of what&apos;s possible in 48 hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6 text-lg text-muted leading-relaxed">
            <p>
              TuniHack is Tunisia&apos;s premier national hackathon, a gathering of the brightest minds
              in technology, design, and entrepreneurship. For over a decade, we&apos;ve provided a
              platform for students and professionals to collaborate and build impactful solutions.
            </p>
            <p>
              The 12th edition takes place at <span className="text-foreground font-bold">ENSI</span>,
              continuing our mission to foster a culture of creation and problem-solving.
              Whether you&apos;re a seasoned developer or a curious beginner, TuniHack is where
              ideas transform into reality.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value="12" label="Editions" />
            <StatCard value="5000+" label="Participants" />
            <StatCard value="200+" label="Projects" />
            <StatCard value="100+" label="Mentors" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTuniHack;
