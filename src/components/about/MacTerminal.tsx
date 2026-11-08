"use client";

import { useInView } from "@/hooks/useInView";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { TerminalLine } from "@/data/about";

type MacTerminalProps = {
  title: string;
  lines: TerminalLine[];
  className?: string;
};

const TUX_ART = [
  "     .--.",
  "    |o_o |",
  "    |:_/ |",
  "   //   \\ \\",
  "  (|     | )",
  " /'\\_   _/`\\",
  " \\___)=(___/",
];

export default function MacTerminal({ title, lines, className = "" }: MacTerminalProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  const { visibleLines, complete, reducedMotion } = useTypewriter(lines, inView);

  return (
    <div
      ref={ref}
      className={`about-terminal ${className}`}
      role="region"
      aria-label={`${title} terminal`}
    >
      <div className="sr-only">
        <p>{title}</p>
        {lines.map((line, index) => (
          <p key={`${line.type}-${index}`}>{line.type === "command" ? `$ ${line.text}` : line.text}</p>
        ))}
      </div>

      <div className="about-terminal-window" aria-hidden="true">
        <div className="about-terminal-titlebar">
          <div className="about-terminal-controls">
            <span className="about-terminal-dot about-terminal-dot-red" />
            <span className="about-terminal-dot about-terminal-dot-yellow" />
            <span className="about-terminal-dot about-terminal-dot-green" />
          </div>
          <span className="about-terminal-title">{title}</span>
          <span aria-hidden="true" />
        </div>

        <div className="about-terminal-body">
          {visibleLines.map((line, index) => (
            <div className={`about-terminal-line about-terminal-${line.type}`} key={`${index}-${line.type}`}>
              {line.type === "command" && <span className="about-terminal-prompt">$ </span>}
              {line.type === "success" && <span className="about-terminal-check">✓ </span>}
              <span>{line.text}</span>
              {index === visibleLines.length - 1 && !reducedMotion && (
                <span className={`about-terminal-cursor ${complete ? "about-terminal-cursor-steady" : ""}`}>█</span>
              )}
            </div>
          ))}
          {complete && (
            <pre className="about-terminal-tux" aria-hidden="true">{TUX_ART.join("\n")}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
