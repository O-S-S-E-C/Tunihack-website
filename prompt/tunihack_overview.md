

# 🚀 TuniHack 12.0 — Event Details & Schedule

## 📌 Event Overview

**Organizer:** Open-Source Software ENSI Club (**OSSEC**)

**Location:** École Nationale des Sciences de l'Informatique (ENSI)

### What is TuniHack?

**TuniHack 12.0** is a **24-hour hackathon** that brings together top students from Tunisian engineering schools. Participants are given a specific theme and have exactly 24 hours to build a project around it before pitching it in front of a jury of industry professionals.

## 📊 OSSEC Key Statistics

| Metric | Detail | Description |
| :--- | :--- | :--- |
| 📅 **2012** | **The beginning of OSSEC** | Building the community since 2012. |
| 👥 **10,000+** | **Social media followers** | Following OSSEC activities and events. |
| 🧑‍💻 **120+** | **Active members each year** | Students learning, building, and sharing together. |

## 💡 Event Tracks & Competitions

### 1. Main Hackathon (TuniHack)

* **Format:** 24-hour coding sprint.

* **Process:**

  1. **Get a Theme:** Revealed later on during the event.

  2. **Build a Project:** 24 hours of non-stop development.

  3. **Pitch It:** Present your working prototype to a panel of industry professionals.

### 2. PitchHack

* **Format:** Idea & Strategy Marathon (No 24-hour coding sprint required).

* **Overview:** Designed for visionaries and problem solvers. Participants choose a problem tied to the event's theme, design a solution, and present it live in front of the jury.

* **Focus:** Vision, problem-solving, presentation skills, and selling your idea effectively.

## 🎮 Parallel Activities & Tournaments

Throughout the event, participants can join several side tracks and friendly competitions:

* **Competitive Programming (CP):** Friendly programming contest to test algorithmic problem-solving.

* **Capture The Flag (CTF):** Friendly cybersecurity tournament.

* **Chess Tournament:** Friendly strategy contest.

* **Workshops:** Interactive sessions to learn new skills on the spot.

* **Murder Game & Side Activities:** Fun team-building and leisure games.

## 📅 Full Planning & Schedule

### 🟦 Day 1

| Time | Event / Activity | Details | 
| ----- | ----- | ----- | 
| **07:30 – 08:30** | Registration | Participant check-in | 
| **08:30 – 09:30** | Opening Ceremony | Official launch of TuniHack | 
| **10:00 – 12:00** | Workshop 1 & Workshop 2 | Parallel Learning Sessions | 
| **12:00 – 13:00** | Lunch Break | Meal & Networking | 
| **14:00 – 17:00** | Contest CP | Competitive Programming Tournament | 
| **14:30 – 16:30** | Workshop 3 | Technical Workshop | 
| **17:00 – 17:30** | Coffee Break | Refreshments | 
| **17:30 – 18:30** | Murder Game | Fun Group Game | 
| **18:30 – 20:00** | Activities | Side Games & Entertainment | 
| **20:00 – 21:00** | Dinner / Lunch Break | Evening Meal Break | 
| **21:00 – 00:00** | Chess Tournament | Friendly Competition | 
| **00:00 – Mid.** | CTF Start | Capture The Flag Tournament Begins | 

### 🟩 Day 2

| Time | Event / Activity | Details | 
| ----- | ----- | ----- | 
| **08:00 – 09:00** | Coffee Break | Morning Refreshments | 
| **10:00 – 12:00** | PitchHack Presentation | Live pitches in front of industry judges | 
| **12:00 – 13:00** | Lunch Break | Midday Break | 
| **13:00 – 16:00** | TuniHack Presentation | Main Hackathon final project demos & pitches | 
| **16:00 – 17:00** | Closing Ceremony | Winners Announcement & Closing | 
 programme tsx 

 "use client";

import { useInView } from "@/hooks/useInView";

const programme = {
  dayOne: [
    ["07:30 – 08:30", "Registration", "Participant check-in"],
    ["08:30 – 09:30", "Opening Ceremony", "Official launch of TuniHack"],
    ["10:00 – 12:00", "Workshop 1 & Workshop 2", "Parallel learning sessions"],
    ["12:00 – 13:00", "Lunch Break", "Meal and networking"],
    ["14:00 – 17:00", "Contest CP", "Competitive programming tournament"],
    ["14:30 – 16:30", "Workshop 3", "Technical workshop"],
    ["17:00 – 17:30", "Coffee Break", "Refreshments"],
    ["17:30 – 18:30", "Murder Game", "Fun group game"],
    ["18:30 – 20:00", "Activities", "Side games and entertainment"],
    ["20:00 – 21:00", "Dinner / Lunch Break", "Evening meal break"],
    ["21:00 – 00:00", "Chess Tournament", "Friendly competition"],
    ["00:00 – Mid.", "CTF Start", "Capture The Flag tournament begins"],
  ],
  dayTwo: [
    ["08:00 – 09:00", "Coffee Break", "Morning refreshments"],
    ["10:00 – 12:00", "PitchHack Presentation", "Live pitches in front of industry judges"],
    ["12:00 – 13:00", "Lunch Break", "Midday break"],
    ["13:00 – 16:00", "TuniHack Presentation", "Final project demos and pitches"],
    ["16:00 – 17:00", "Closing Ceremony", "Winners announcement and closing"],
  ],
} as const;

const programmeDays = [
  { id: "dayOne", label: "Day 1", events: programme.dayOne },
  { id: "dayTwo", label: "Day 2", events: programme.dayTwo },
] as const;

function ProgrammeStop({ entry, index }: {
  entry: readonly [string, string, string];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLLIElement>(0.15, true);
  const [time, title, detail] = entry;

  return (
    <li
      ref={ref}
      className={`programme-stop ${inView ? "programme-stop-visible" : ""}`}
      style={{ gridRow: index + 1, transitionDelay: `${Math.min(index * 75, 675)}ms` }}
    >
      <span className="programme-trunk-segment" aria-hidden="true" />
      <span className="programme-stop-marker" aria-hidden="true" />
      <time>{time}</time>
      <div>
        <h4>{title}</h4>
        <p>{detail}</p>
      </div>
    </li>
  );
}

function ProgrammeRoot({ label }: { label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, true);

  return (
    <div ref={ref} className={`programme-tree-root ${inView ? "programme-tree-root-visible" : ""}`}>
      <span className="programme-tree-root-label">{label} <b>{"// ROOT"}</b></span>
      <span className="programme-root-node" aria-hidden="true" />
    </div>
  );
}

export default function Programme() {
  return (
    <section id="program" className="programme-section">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="about-eyebrow">THE RHYTHM OF THE WEEKEND</p>
          <h2 className="about-heading programme-title">
            Programme
          </h2>
          <div className="about-heading-rule" aria-hidden="true" />
          <p className="text-muted leading-relaxed mt-7">
            Two days of building, competing, learning, and sharing. Follow the route from the first check-in to the final announcement.
          </p>
        </div>

        <div className="programme-grid">
          {programmeDays.map(({ id, label, events }) => (
            <section className="programme-day" key={id} aria-labelledby={`${id}-heading`}>
              <div className="programme-day-heading">
                <span className="programme-day-kicker">Event timeline</span>
                <h3 id={`${id}-heading`}>{label}</h3>
              </div>
              <ProgrammeRoot label={label} />
              <ol className="programme-route">
                {events.map((entry, index) => (
                  <ProgrammeStop key={`${id}-${entry[0]}-${entry[1]}`} entry={entry} index={index} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
