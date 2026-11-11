// FAQ content. Sources: the TuniHack 2026/2027 sponsoring dossier (OSSEC) and this site's own data
// (dates, venue, programme). Keep answers factual: only add what the organizers have confirmed.

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const FAQ: FaqGroup[] = [
  {
    title: "For participants",
    items: [
      {
        question: "What is TuniHack?",
        answer:
          "TuniHack is a 24-hour hackathon held over a weekend at ENSI. It brings together students from universities and engineering schools across Tunisia to build technology solutions around a shared theme, then present them to a jury of industry professionals.",
      },
      {
        question: "When and where is TuniHack 12.0?",
        answer:
          "On 28–29 November 2026 at ENSI (École Nationale des Sciences de l'Informatique), Manouba.",
      },
      {
        question: "What is this year's theme?",
        answer:
          "To be revealed soon. Stay tuned!",
      },
      {
        question: "Who can take part?",
        answer: "TuniHack is open to students from universities and engineering schools across Tunisia.",
      },
      {
        question: "How does the competition work?",
        answer:
          "A jury of experts reveals the challenge at the start of the event. Teams then have 24 hours to design and build their solution, and present it on the second day to a jury of professionals and industry partners. Projects are published on the club's official GitHub afterwards.",
      },
      {
        question: "What is PitchHack?",
        answer:
          "PitchHack is a competition born within TuniHack. Participants choose a problem tied to the event's theme, design a solution and pitch it live to the jury. There is no coding sprint: it's about the idea, the vision and how well you sell it.",
      },
      {
        question: "How many people are in a team?",
        answer: "TuniHack teams have 3 to 5 members. PitchHack teams have 2 members.",
      },
      {
        question: "What else happens during the weekend?",
        answer:
          "Conferences, hands-on workshops, a round table, a music show and activities. Overnight, there are side competitions: competitive programming, and a CTF from midnight to 5 a.m.",
      },
      {
        question: "How do I join the CTF and competitive programming competitions?",
        answer:
          "Each one has its own registration form, separate from TuniHack. They're free, and you can join as an individual.",
      },
      {
        question: "How do I register for the certified workshops?",
        answer: "The registration forms for the certified workshops will be posted soon on the event page.",
      },
      {
        question: "Are meals provided?",
        answer:
          "Meals are provided for TuniHack and PitchHack participants: lunch and dinner on day one, breakfast and lunch on day two, and a coffee break.",
      },
    ],
  },
  {
    title: "For sponsors",
    items: [
      {
        question: "Why sponsor TuniHack?",
        answer:
          "Your brand appears on posters, badges, goodies, the website, videos and social media in front of a young tech audience. You get a front-row seat to new solutions, direct access to talented students for internships and hiring, and an active role in Tunisia's open-source ecosystem.",
      },
      {
        question: "Can our company get involved beyond funding?",
        answer:
          "Yes. Partners can join the jury, mentor teams, give a talk or run a workshop, have a booth on site, and keep supporting the best projects after the event.",
      },
      {
        question: "How do we get the sponsoring dossier?",
        answer:
          "Email ossec@ensi-uma.tn or reach us through the Contact section below, and we'll send you the full dossier with the details of each pack.",
      },
    ],
  },
  {
    title: "About the organizers",
    items: [
      {
        question: "Who organizes TuniHack?",
        answer:
          "OSSEC (Open-Source Software ENSI Club), a student club founded at ENSI in 2012 to spread open-source culture. Besides TuniHack, it runs the Install Party, Code Clash, CTFs, and training in web development, Git and cybersecurity.",
      },
      {
        question: "How long has TuniHack been running?",
        answer:
          "Since December 2015. Past themes include Data Science, SmartGov, Trust on Social Media, Artificial Intelligence in Healthcare and Hacking the Future of Education. TuniHack 12.0 is the twelfth edition.",
      },
    ],
  },
];
