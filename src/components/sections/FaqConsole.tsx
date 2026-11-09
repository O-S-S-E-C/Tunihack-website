"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FAQ } from "@/data/faq";

const TAB_LABELS: Record<string, string> = {
  "For participants": "Participants",
  "For sponsors": "Sponsors",
  "About the organizers": "Organizers",
};

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, "")
    .replace(/\.$/, "")
    .trim()
    .replace(/\s+/g, "-");

/** Answer that fades in word by word (skipped for reduced motion). */
function AnimatedAnswer({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <p>{text}</p>;
  return (
    <p>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(6px)", y: 4 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.018, ease: "easeOut" }}
          className="inline-block whitespace-pre"
        >
          {word}{" "}
        </motion.span>
      ))}
    </p>
  );
}

export default function FaqConsole() {
  const uid = useId();
  const [groupIndex, setGroupIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const group = FAQ[groupIndex];
  const item = group.items[itemIndex];
  const panelId = `${uid}-panel`;

  const selectGroup = (index: number) => {
    setGroupIndex(index);
    setItemIndex(0);
  };

  return (
    <div className="mt-12">
      {/* Group tabs with a sliding highlight */}
      <div role="tablist" aria-label="FAQ categories" className="inline-flex max-w-full gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
        {FAQ.map((g, i) => (
          <button
            key={g.title}
            type="button"
            role="tab"
            aria-selected={i === groupIndex}
            onClick={() => selectGroup(i)}
            className={`font-label relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-[0.06em] transition-colors sm:px-5 sm:text-base sm:tracking-[0.1em] ${
              i === groupIndex ? "text-[#040918]" : "text-white/70 hover:text-white"
            }`}
          >
            {i === groupIndex && (
              <motion.span
                layoutId={`${uid}-tab`}
                className="absolute inset-0 rounded-full bg-secondary shadow-[0_0_20px_rgba(34,211,238,0.45)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{TAB_LABELS[g.title] ?? g.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        {/* Question list */}
        <ol className="flex flex-col gap-1" key={group.title}>
          {group.items.map((q, i) => {
            const active = i === itemIndex;
            return (
              <li key={q.question}>
                <button
                  type="button"
                  onClick={() => setItemIndex(i)}
                  aria-expanded={active}
                  aria-controls={panelId}
                  className={`group relative flex w-full items-baseline gap-4 rounded-xl px-4 py-3.5 text-left transition-colors ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`${uid}-question`}
                      className="absolute inset-0 rounded-xl border border-secondary/40 bg-secondary/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className={`font-label relative w-7 shrink-0 text-base font-semibold ${active ? "text-secondary" : "text-white/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative text-base font-medium uppercase md:text-lg">{q.question}</span>
                  <span
                    aria-hidden="true"
                    className={`relative ml-auto text-secondary transition-transform duration-300 ${active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`}
                  >
                    →
                  </span>
                </button>

                {/* Mobile: answer inline under the active question */}
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden lg:hidden"
                    >
                      <div className="px-4 pb-4 pl-[3.75rem] pt-1 leading-relaxed text-muted">{q.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>

        {/* Desktop: terminal answer panel */}
        <div id={panelId} role="region" aria-live="polite" aria-label={item.question} className="about-terminal hidden lg:sticky lg:top-28 lg:block">
          <div className="about-terminal-titlebar">
            <div className="about-terminal-controls">
              <span className="about-terminal-dot about-terminal-dot-red" />
              <span className="about-terminal-dot about-terminal-dot-yellow" />
              <span className="about-terminal-dot about-terminal-dot-green" />
            </div>
            <span className="about-terminal-title">{`faq@tunihack: ~/${slug(TAB_LABELS[group.title] ?? group.title)}`}</span>
            <span aria-hidden="true" />
          </div>
          <div className="min-h-[19rem] p-6 font-mono text-[0.95rem] leading-7 text-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-white">
                  <span className="text-secondary">$ </span>cat faq/{slug(item.question)}.md
                </p>
                <p className="mt-4 font-sans text-xl font-bold tracking-tight text-white">{item.question}</p>
                <div className="mt-3 font-sans text-base leading-relaxed text-slate-300">
                  <AnimatedAnswer text={item.answer} />
                </div>
                <p className="mt-6 text-white">
                  <span className="text-secondary">$ </span>
                  <span className="about-terminal-cursor">█</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
