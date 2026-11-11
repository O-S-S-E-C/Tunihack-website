export type TerminalLine = {
  type: "command" | "output" | "success" | "highlight" | "comment";
  text: string;
};

export const TUNIHACK_TERMINAL_TITLE = "tunihack@ensi: ~/about";
export const TUNIHACK_TERMINAL_LINES: TerminalLine[] = [
  { type: "command", text: "TuniHack 12.0 is coming!" },
  {
    type: "output",
    text: "Organized by the Open-Source Software ENSI Club (OSSEC), TuniHack is a 24-hour hackathon that brings together the brightest students from universities and engineering schools across Tunisia.",
  },
  {
    type: "output",
    text: "Participants get a specific theme and just 24 hours to build a project around it, then pitch it in front of a jury of industry professionals.",
  },
];

export const PITCHHACK_TERMINAL_TITLE = "pitchhack@ensi: ~/vision";
export const PITCHHACK_TERMINAL_LINES: TerminalLine[] = [
  { type: "command", text: "Got an idea? Pitch it." },
  { type: "output", text: "PitchHack is a competition born within TuniHack 12.0." },
  {
    type: "output",
    text: "Participants choose a problem tied to the event’s theme, design a solution, and present it live in front of our jury.",
  },
  {
    type: "output",
    text: "No 24-hour coding sprint here: it’s all about your idea, your vision, and how well you sell it.",
  },
  {
    type: "output",
    text: "Sharpen your problem-solving and presentation skills, and get feedback from industry professionals.",
  },
];
