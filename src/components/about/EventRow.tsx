"use client";

import type { ReactNode } from "react";
import type { TerminalLine } from "@/data/about";
import { useInView } from "@/hooks/useInView";
import MacTerminal from "@/components/about/MacTerminal";

type EventRowProps = {
  reverse?: boolean;
  terminalTitle: string;
  terminalLines: TerminalLine[];
  visual: ReactNode;
};

export default function EventRow({
  reverse = false,
  terminalTitle,
  terminalLines,
  visual,
}: EventRowProps) {
  // useInView toggles the reveal classes on this element directly; keep className static so
  // React never re-renders it and wipes them.
  const { ref } = useInView<HTMLDivElement>(0.12);

  return (
    <div ref={ref} className="about-event-row grid min-w-0 grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className={`about-event-content ${reverse ? "md:order-1" : "md:order-2"}`}>
        <div className="about-event-visual">{visual}</div>
      </div>

      <MacTerminal
        title={terminalTitle}
        lines={terminalLines}
        className={reverse ? "md:order-2" : "md:order-1"}
      />
    </div>
  );
}
