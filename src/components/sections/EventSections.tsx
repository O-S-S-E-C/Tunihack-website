"use client";

import FaqConsole from "@/components/sections/FaqConsole";
import SocialMediaBeam from "@/components/sections/SocialMediaBeam";

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

      <section id="register" className="register starfield">
        <div className="register-stars" aria-hidden="true" />
        <div className="register-inner">
          <p className="register-kicker">Join the next build</p>
          <h2 className="register-title">Register for TuniHack<span className="dot">.</span></h2>
          <p className="register-tagline"><strong>TuniHack 12.0:</strong> Dare to go beyond.</p>
          <p className="register-text">Challenge the ordinary, create the extraordinary, and shape what comes next.</p>
          <div className="register-actions">
            <a
              role="link"
              aria-disabled="true"
              className="cta cta-primary"
            >
              Register Now
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a
              href="#home"
              className="cta cta-secondary"
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
          <div className="mt-10">
            <SocialMediaBeam />
          </div>
        </div>
      </section>

    </>
  );
}
