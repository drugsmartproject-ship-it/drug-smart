export type ThemeId =
  | "medical-green"
  | "teal-professional"
  | "clean-blue"
  | "slate-professional"
  | "warm-clinical"
  | "deep-indigo";

export interface ThemeVars {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  brandGreen: string;
  brandTeal: string;
  brandGreenDark: string;
  brandTealDark: string;
  brandGreenLight: string;
  brandTealLight: string;
}

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  primaryHex: string;   // for swatch display
  accentHex: string;
  vars: ThemeVars;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "medical-green",
    name: "Medical Green",
    description: "Fresh emerald — default pharmacy aesthetic",
    primaryHex: "#1FA67A",
    accentHex: "#2FB9B3",
    vars: {
      primary: "hsl(161 68% 39%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(182 60% 45%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(161 68% 39%)",
      brandGreen: "#1FA67A",
      brandTeal: "#2FB9B3",
      brandGreenDark: "#17845F",
      brandTealDark: "#259E98",
      brandGreenLight: "#E6F7F2",
      brandTealLight: "#E6F7F7",
    },
  },
  {
    id: "teal-professional",
    name: "Teal Professional",
    description: "Deep teal — calm, clinical confidence",
    primaryHex: "#0D9488",
    accentHex: "#0891B2",
    vars: {
      primary: "hsl(174 72% 32%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(199 89% 38%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(174 72% 32%)",
      brandGreen: "#0D9488",
      brandTeal: "#0891B2",
      brandGreenDark: "#0A7870",
      brandTealDark: "#0779A0",
      brandGreenLight: "#CCFBF1",
      brandTealLight: "#E0F2FE",
    },
  },
  {
    id: "clean-blue",
    name: "Clean Blue",
    description: "Trustworthy blue — universally professional",
    primaryHex: "#2563EB",
    accentHex: "#7C3AED",
    vars: {
      primary: "hsl(221 83% 53%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(262 83% 58%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(221 83% 53%)",
      brandGreen: "#2563EB",
      brandTeal: "#7C3AED",
      brandGreenDark: "#1D4ED8",
      brandTealDark: "#6D28D9",
      brandGreenLight: "#DBEAFE",
      brandTealLight: "#EDE9FE",
    },
  },
  {
    id: "slate-professional",
    name: "Slate Professional",
    description: "Sophisticated slate — understated authority",
    primaryHex: "#475569",
    accentHex: "#0EA5E9",
    vars: {
      primary: "hsl(215 28% 37%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(199 89% 48%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(215 28% 37%)",
      brandGreen: "#475569",
      brandTeal: "#0EA5E9",
      brandGreenDark: "#334155",
      brandTealDark: "#0284C7",
      brandGreenLight: "#F1F5F9",
      brandTealLight: "#E0F2FE",
    },
  },
  {
    id: "warm-clinical",
    name: "Warm Clinical",
    description: "Warm amber — approachable and welcoming",
    primaryHex: "#D97706",
    accentHex: "#EA580C",
    vars: {
      primary: "hsl(37 91% 55%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(21 90% 48%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(37 91% 55%)",
      brandGreen: "#D97706",
      brandTeal: "#EA580C",
      brandGreenDark: "#B45309",
      brandTealDark: "#C2410C",
      brandGreenLight: "#FEF3C7",
      brandTealLight: "#FFEDD5",
    },
  },
  {
    id: "deep-indigo",
    name: "Deep Indigo",
    description: "Rich indigo — premium, executive presence",
    primaryHex: "#4F46E5",
    accentHex: "#7C3AED",
    vars: {
      primary: "hsl(243 75% 59%)",
      primaryForeground: "hsl(0 0% 100%)",
      accent: "hsl(262 83% 58%)",
      accentForeground: "hsl(0 0% 100%)",
      ring: "hsl(243 75% 59%)",
      brandGreen: "#4F46E5",
      brandTeal: "#7C3AED",
      brandGreenDark: "#4338CA",
      brandTealDark: "#6D28D9",
      brandGreenLight: "#EEF2FF",
      brandTealLight: "#EDE9FE",
    },
  },
];

export const DEFAULT_THEME_ID: ThemeId = "medical-green";

export function getThemeById(id: ThemeId): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0]!;
}
