export type TerminalLine = {
  type: "command" | "output" | "success" | "highlight" | "comment";
  text: string;
};

export const TUNIHACK_TERMINAL_TITLE = "tunihack@ensi: ~/about";
export const TUNIHACK_TERMINAL_LINES: TerminalLine[] = [
  { type: "output", text: "A 24-hour build sprint for Tunisia's brightest makers." },
  { type: "output", text: "Solve a real challenge with a team." },
  { type: "output", text: "Ship a working prototype and pitch it to industry." },
  { type: "output", text: "Workshops, side quests, and a community that keeps moving." },
];

export const PITCHHACK_TERMINAL_TITLE = "pitchhack@ensi: ~/vision";
export const PITCHHACK_TERMINAL_LINES: TerminalLine[] = [
  { type: "output", text: "An idea marathon for bold problem solvers." },
  { type: "output", text: "Shape a problem into a clear strategy." },
  { type: "output", text: "Pitch your vision to a jury that listens." },
  { type: "output", text: "No coding sprint required. Just clarity, courage, and momentum." },
];

