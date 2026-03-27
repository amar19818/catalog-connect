// Store theme definitions — each theme sets CSS custom properties on the catalog pages
export interface StoreTheme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    success: string;
  };
}

export const STORE_THEMES: StoreTheme[] = [
  {
    id: "theme-orange",
    name: "Sunset Orange",
    emoji: "🔥",
    colors: {
      background: "0 0% 7%",
      foreground: "30 10% 92%",
      card: "0 0% 10%",
      cardForeground: "30 10% 92%",
      primary: "24 95% 53%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 14%",
      secondaryForeground: "30 10% 92%",
      muted: "0 0% 14%",
      mutedForeground: "0 0% 55%",
      accent: "24 95% 53%",
      accentForeground: "0 0% 100%",
      border: "0 0% 18%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-green",
    name: "Forest Green",
    emoji: "🌿",
    colors: {
      background: "160 20% 6%",
      foreground: "140 10% 92%",
      card: "160 15% 9%",
      cardForeground: "140 10% 92%",
      primary: "152 69% 46%",
      primaryForeground: "0 0% 100%",
      secondary: "160 12% 13%",
      secondaryForeground: "140 10% 92%",
      muted: "160 12% 13%",
      mutedForeground: "160 5% 50%",
      accent: "152 69% 46%",
      accentForeground: "0 0% 100%",
      border: "160 10% 17%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-blue",
    name: "Ocean Blue",
    emoji: "🌊",
    colors: {
      background: "220 20% 7%",
      foreground: "210 10% 92%",
      card: "220 15% 10%",
      cardForeground: "210 10% 92%",
      primary: "217 91% 60%",
      primaryForeground: "0 0% 100%",
      secondary: "220 12% 14%",
      secondaryForeground: "210 10% 92%",
      muted: "220 12% 14%",
      mutedForeground: "220 5% 50%",
      accent: "217 91% 60%",
      accentForeground: "0 0% 100%",
      border: "220 10% 18%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-purple",
    name: "Royal Purple",
    emoji: "👑",
    colors: {
      background: "270 20% 7%",
      foreground: "260 10% 92%",
      card: "270 15% 10%",
      cardForeground: "260 10% 92%",
      primary: "262 83% 58%",
      primaryForeground: "0 0% 100%",
      secondary: "270 12% 14%",
      secondaryForeground: "260 10% 92%",
      muted: "270 12% 14%",
      mutedForeground: "270 5% 50%",
      accent: "262 83% 58%",
      accentForeground: "0 0% 100%",
      border: "270 10% 18%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-rose",
    name: "Rose Pink",
    emoji: "🌸",
    colors: {
      background: "340 15% 7%",
      foreground: "340 10% 92%",
      card: "340 12% 10%",
      cardForeground: "340 10% 92%",
      primary: "346 77% 60%",
      primaryForeground: "0 0% 100%",
      secondary: "340 10% 14%",
      secondaryForeground: "340 10% 92%",
      muted: "340 10% 14%",
      mutedForeground: "340 5% 50%",
      accent: "346 77% 60%",
      accentForeground: "0 0% 100%",
      border: "340 8% 18%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-gold",
    name: "Gold Premium",
    emoji: "✨",
    colors: {
      background: "35 15% 6%",
      foreground: "40 15% 92%",
      card: "35 12% 9%",
      cardForeground: "40 15% 92%",
      primary: "43 96% 56%",
      primaryForeground: "0 0% 10%",
      secondary: "35 10% 13%",
      secondaryForeground: "40 15% 92%",
      muted: "35 10% 13%",
      mutedForeground: "35 5% 50%",
      accent: "43 96% 56%",
      accentForeground: "0 0% 10%",
      border: "35 8% 17%",
      success: "142 76% 36%",
    },
  },
  {
    id: "theme-light",
    name: "Clean White",
    emoji: "☀️",
    colors: {
      background: "0 0% 98%",
      foreground: "0 0% 10%",
      card: "0 0% 100%",
      cardForeground: "0 0% 10%",
      primary: "24 95% 53%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 94%",
      secondaryForeground: "0 0% 10%",
      muted: "0 0% 94%",
      mutedForeground: "0 0% 45%",
      accent: "24 95% 53%",
      accentForeground: "0 0% 100%",
      border: "0 0% 88%",
      success: "142 76% 36%",
    },
  },
];

export function getThemeById(id: string): StoreTheme {
  return STORE_THEMES.find(t => t.id === id) || STORE_THEMES[0];
}

export function applyThemeToElement(el: HTMLElement, theme: StoreTheme) {
  const c = theme.colors;
  el.style.setProperty("--background", c.background);
  el.style.setProperty("--foreground", c.foreground);
  el.style.setProperty("--card", c.card);
  el.style.setProperty("--card-foreground", c.cardForeground);
  el.style.setProperty("--primary", c.primary);
  el.style.setProperty("--primary-foreground", c.primaryForeground);
  el.style.setProperty("--secondary", c.secondary);
  el.style.setProperty("--secondary-foreground", c.secondaryForeground);
  el.style.setProperty("--muted", c.muted);
  el.style.setProperty("--muted-foreground", c.mutedForeground);
  el.style.setProperty("--accent", c.accent);
  el.style.setProperty("--accent-foreground", c.accentForeground);
  el.style.setProperty("--border", c.border);
  el.style.setProperty("--success", c.success);
  el.style.setProperty("--input", c.border);
  el.style.setProperty("--ring", c.primary);
}
