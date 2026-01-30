import type { GameTheme } from "./types";

export function applyTheme(theme: GameTheme) {
  const root = document.documentElement;

  root.style.setProperty("--bg", theme.colors.background);
  root.style.setProperty("--foreground", theme.colors.foreground);
  root.style.setProperty("--card-foreground", theme.colors['card-foreground']);
  root.style.setProperty("--card", theme.colors.card);
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--text", theme.colors.text);
  root.style.setProperty("--muted-text", theme.colors.mutedText);
  root.style.setProperty("--border", theme.colors.border);

  root.style.setProperty("--font-main", theme.font);
}
