const memories = [
  ['48H', 'of making'],
  ['500+', 'builders'],
  ['12', 'editions'],
  ['1', 'shared future'],
];

const program = [
  ['09:00', 'Doors open', 'Check in, coffee, and team forming'],
  ['11:00', 'Opening ceremony', 'The challenge is on'],
  ['14:00', 'Workshops', 'Learn from people in the field'],
  ['20:00', 'Night shift', 'Keep building, keep surprising us'],
  ['10:00', 'Demo day', 'Show the room what you made'],
];

const speakers = [
  ['01', 'Coming soon', 'Builders, founders, and mentors'],
  ['02', 'Coming soon', 'The people behind the ideas'],
  ['03', 'Coming soon', 'Stories from the other side'],
];

const faqs = [
  ['Who can participate?', 'Students, professionals, designers, makers, and curious beginners are all welcome.'],
  ['Do I need a team?', 'No. You can arrive solo and meet your future team during the opening session.'],
  ['What should I bring?', 'Your laptop, charger, curiosity, and the energy to make something real.'],
];

export default function EventSections() {
  return (
    <>
      <section className="px-6 md:px-16 py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="section-kicker mb-5">A decade in motion</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/15 border border-white/15">
            {memories.map(([value, label]) => (
              <div key={label} className="bg-[#040918] p-7 md:p-10">
                <strong className="block text-4xl md:text-6xl text-primary tracking-[-0.08em]">{value}</strong>
                <span className="text-xs uppercase tracking-[0.18em] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="program" className="px-6 md:px-16 py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.7fr_1.3fr] gap-14">
          <div>
            <p className="section-kicker mb-5">The rhythm of the weekend</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-[-0.08em] uppercase">Program<span className="text-secondary">.</span></h2>
            <p className="text-muted leading-relaxed mt-7 max-w-sm">A carefully chaotic sequence of ideas, conversations, focused work, and moments worth remembering.</p>
          </div>
          <div className="border-t border-secondary/60">
            {program.map(([time, title, detail]) => (
              <div key={time} className="grid grid-cols-[5rem_1fr] md:grid-cols-[7rem_1fr] gap-5 py-6 border-b border-white/15">
                <span className="text-secondary text-sm">{time}</span>
                <div><h3 className="text-xl uppercase tracking-wide">{title}</h3><p className="text-sm text-muted mt-2">{detail}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="speakers" className="px-6 md:px-16 py-28 bg-[#0a1a55]/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="section-kicker mb-5">People to watch</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.08em] uppercase">Speakers<span className="text-secondary">.</span></h2>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {speakers.map(([number, title, detail]) => (
              <div key={number} className="min-h-64 border border-white/15 p-6 flex flex-col justify-between hover:border-secondary transition-colors">
                <span className="text-secondary">{number}</span><div><h3 className="text-2xl uppercase">{title}</h3><p className="text-sm text-muted mt-2">{detail}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div><p className="section-kicker mb-5">Your questions, answered</p><h2 className="text-5xl md:text-7xl font-black tracking-[-0.08em] uppercase">FAQ<span className="text-secondary">.</span></h2></div>
          <div>{faqs.map(([question, answer]) => <details key={question} className="group border-t border-white/20 py-5"><summary className="cursor-pointer list-none flex justify-between gap-5 text-lg uppercase"><span>{question}</span><span className="text-secondary group-open:rotate-45 transition-transform">+</span></summary><p className="text-muted leading-relaxed mt-4 max-w-lg">{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="starfield px-6 md:px-16 py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl text-secondary mb-6">&lt;/&gt;</div>
          <h2 className="text-4xl md:text-7xl font-black tracking-[-0.08em] uppercase">[Motivational message]</h2>
          <div className="flex justify-center gap-4 mt-10">
            <button className="lime-button rounded-xl px-7 py-4 text-lg">Register Now</button>
            <button className="outline-button rounded-xl px-7 py-4 text-lg">Event information</button>
          </div>
        </div>
      </section>

    </>
  );
}