import { getBackground } from "@/utils/getBackground";
import type { GameTheme } from "./types";

export const eldritchTheme: GameTheme = {
  name: "eldritch",
  colors: {
    background: "#0d0f12",
    foreground: "#fff",
    'card-foreground': "#fff",
    card: "#16191fc9",
    primary: "#7b1e1e",
    text: "#e6e6e6",
    mutedText: "#9aa0a6",
    border: "#2a2f3a",
  },
  sheetBackground: getBackground("eldritch"),
  font: "'Inter', serif",
};
