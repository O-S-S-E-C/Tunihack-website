"use client";

import Image from "next/image";
const OSSEC = {
  name: "OSSEC",
  description:
    "OSSEC the Open Source Security club at ENSI. We organise TuniHack, Tunisia's national hackathon on cybersecurity and artificial intelligence.",
  email: "contact@ossec.tn",
  location: "ENSI, Tunisia",
  socials: [
    { name: "Facebook", href: "" },
    { name: "Instagram", href: "" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/ossec-ensi/posts/?feedView=all" },
    { name: "GitHub", href: "https://github.com/ossec10" },
  ],
};

const NAVIGATE = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programme", href: "#program" },
  { label: "Speakers", href: "#speakers" },
  { label: "Board", href: "#board" },
  { label: "Sponsors", href: "#sponsors" },
];

const QUICK_LINKS = [
  { label: "Register Now", href: "#register" },
  { label: "Previous Edition", href: "#previousedition" },
  { label: "Contact Us", href: `mailto:${OSSEC.email}` },
];

const ICONS: Record<string, string> = {
  Facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  Instagram: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
  GitHub: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
};


function Logo() {
  return (
    <a
      href="#home"
      className="inline-flex items-center gap-3"
      aria-label="OSSEC home"
    >
      <Image
        src="/logo/logo.png"
        alt="OSSEC logo"
        width={24}
        height={24}
        priority
        className="h-12 w-12 object-contain"
      />

      <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
        OSSEC<span className="text-secondary">_</span>
      </span>
    </a>
  );
}

const Footer = () => {
  const socials = OSSEC.socials.filter((s) => s.href);
  return (
    <footer className="border-t border-white/10 bg-[#040918]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-2 md:px-16 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">{OSSEC.description}</p>
          <div className="mt-6 flex gap-4">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="text-muted transition-colors hover:text-secondary">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d={ICONS[s.name]} /></svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/90">Navigate</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {NAVIGATE.map((l) => (
              <li key={l.label}><a href={l.href} className="text-muted transition-colors hover:text-secondary">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/90">Quick Links</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}><a href={l.href} className="text-muted transition-colors hover:text-secondary">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/90">Contact Us</h3>
          <ul className="mt-6 space-y-4 text-sm text-muted">
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 shrink-0 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              <a href={`mailto:${OSSEC.email}`} className="transition-colors hover:text-secondary">{OSSEC.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="h-5 w-5 shrink-0 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              {OSSEC.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-sm text-muted md:px-16">
          © 2026 {OSSEC.name}. TuniHack 12.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
