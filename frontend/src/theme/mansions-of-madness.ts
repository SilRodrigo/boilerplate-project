import { getBackground } from "@/utils/getBackground";
import type { GameTheme } from "./types";
import { catalog } from "@/data/catalog";

export const mansionsOfMadnessTheme: GameTheme = {
  name: catalog.mansions_of_madness,
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
  sheetBackground: getBackground(catalog.mansions_of_madness as keyof typeof catalog),
  font: "'Inter', serif",
};
