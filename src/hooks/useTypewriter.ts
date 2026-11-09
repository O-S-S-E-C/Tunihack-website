"use client";

import { useEffect, useState } from "react";
import type { TerminalLine } from "@/data/about";

const CHAR_DELAY = 24; // ms per character
const LINE_DELAY = 180; // pause between lines

export function useTypewriter(lines: TerminalLine[], active: boolean) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lineIndex = 0;

    const showNextLine = () => {
      if (cancelled) return;
      const line = lines[lineIndex];
      if (!line) {
        setComplete(true);
        return;
      }

      let characterIndex = 0;
      setVisibleLines((current) => [...current, { ...line, text: "" }]);
      const typeCharacter = () => {
        if (cancelled) return;
        characterIndex += 1;
        setVisibleLines((current) => {
          const next = [...current];
          next[lineIndex] = { ...line, text: line.text.slice(0, characterIndex) };
          return next;
        });
        if (characterIndex < line.text.length) {
          timer = setTimeout(typeCharacter, CHAR_DELAY);
        } else {
          timer = setTimeout(() => {
            lineIndex += 1;
            showNextLine();
          }, LINE_DELAY);
        }
      };
      timer = setTimeout(typeCharacter, CHAR_DELAY);
    };

    timer = setTimeout(() => {
      if (cancelled) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReducedMotion(reduce);
      if (reduce) {
        setVisibleLines(lines);
        setComplete(true);
      } else {
        setVisibleLines([]);
        setComplete(false);
        showNextLine();
      }
    }, 0);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [active, lines]);

  return { visibleLines, complete, reducedMotion };
}
