"use client";

import FaqConsole from "@/components/sections/FaqConsole";

export default function EventSections() {
  return (
    <>
      <section id="faq" className="px-6 md:px-16 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="section-kicker mb-5">Your questions, answered</p>
          <h2 className="about-heading">FAQ<span className="text-secondary">.</span></h2>
          <FaqConsole />
        </div>
      </section>

      <section id="register" className="starfield px-6 md:px-16 py-32">
        <div className="max-w-7xl mx-auto text-center">
          <p className="section-kicker mb-5">Join the next build</p>
          <h2 className="about-heading">Register for TuniHack<span className="text-secondary">.</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-muted leading-relaxed">Bring your ideas, your team, and your curiosity. Build something real with Tunisia&apos;s cybersecurity and AI community.</p>
          <div className="flex justify-center gap-4 mt-10">
            <button type="button" className="lime-button rounded-xl px-7 py-4 text-lg">Register Now</button>
            <a
              href="#home"
              className="outline-button rounded-xl px-7 py-4 text-lg"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
              }}
            >
              See Event
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-6 py-20 md:px-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="section-kicker mb-5">Stay connected</p>
          <h2 className="about-heading">Contact Us<span className="text-secondary">.</span></h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://www.facebook.com/tunihackENSI" target="_blank" rel="noopener noreferrer" className="outline-button rounded-full px-6 py-3 text-sm font-semibold">Facebook</a>
            <a href="https://www.linkedin.com/company/ossec-ensi/posts/" target="_blank" rel="noopener noreferrer" className="outline-button rounded-full px-6 py-3 text-sm font-semibold">LinkedIn</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="outline-button rounded-full px-6 py-3 text-sm font-semibold">Instagram</a>
          </div>
        </div>
      </section>

    </>
  );
}