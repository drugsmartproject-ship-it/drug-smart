import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import {
  THEME_PRESETS, DEFAULT_THEME_ID, getThemeById,
  type ThemeId, type ThemePreset,
} from "@/lib/themes";

const STORAGE_KEY_PREFIX = "drugsmart_theme_";
const LOGO_STORAGE_KEY_PREFIX = "drugsmart_logo_";
const COLOR_MODE_KEY_PREFIX = "drugsmart_colormode_";

export type ColorMode = "light" | "dark" | "system";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemePreset;
  logoUrl: string | null;
  colorMode: ColorMode;
  setTheme: (id: ThemeId, pharmacyId?: string) => void;
  setCustomPrimary: (hex: string, pharmacyId?: string) => void;
  setLogo: (dataUrl: string | null, pharmacyId?: string) => void;
  resetTheme: (pharmacyId?: string) => void;
  loadForPharmacy: (pharmacyId: string) => void;
  clearAppliedTheme: () => void;
  setColorMode: (mode: ColorMode, pharmacyId?: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(preset: ThemePreset, customPrimary?: string) {
  const root = document.documentElement;
  const vars = preset.vars;

  if (customPrimary) {
    root.style.setProperty("--color-primary", customPrimary);
    root.style.setProperty("--color-ring", customPrimary);
    root.style.setProperty("--color-brand-green", customPrimary);
  } else {
    root.style.setProperty("--color-primary", vars.primary);
    root.style.setProperty("--color-ring", vars.ring);
    root.style.setProperty("--color-brand-green", vars.brandGreen);
  }

  root.style.setProperty("--color-primary-foreground", vars.primaryForeground);
  root.style.setProperty("--color-accent", vars.accent);
  root.style.setProperty("--color-accent-foreground", vars.accentForeground);
  root.style.setProperty("--color-brand-teal", vars.brandTeal);
  root.style.setProperty("--color-brand-green-dark", vars.brandGreenDark);
  root.style.setProperty("--color-brand-teal-dark", vars.brandTealDark);
  root.style.setProperty("--color-brand-green-light", vars.brandGreenLight);
  root.style.setProperty("--color-brand-teal-light", vars.brandTealLight);
}

function resolveColorMode(mode: ColorMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function applyColorMode(mode: ColorMode) {
  const resolved = resolveColorMode(mode);
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [currentPharmacyId, setCurrentPharmacyId] = useState<string | null>(null);
  const [colorMode, setColorModeState] = useState<ColorMode>("light");

  const storageKey = (pharmacyId?: string) =>
    `${STORAGE_KEY_PREFIX}${pharmacyId ?? currentPharmacyId ?? "global"}`;
  const logoKey = (pharmacyId?: string) =>
    `${LOGO_STORAGE_KEY_PREFIX}${pharmacyId ?? currentPharmacyId ?? "global"}`;
  const modeKey = (pharmacyId?: string) =>
    `${COLOR_MODE_KEY_PREFIX}${pharmacyId ?? currentPharmacyId ?? "global"}`;

  const loadForPharmacy = useCallback((pharmacyId: string) => {
    setCurrentPharmacyId(pharmacyId);
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${pharmacyId}`);
      const parsed = stored ? JSON.parse(stored) : null;
      const id: ThemeId = parsed?.themeId ?? DEFAULT_THEME_ID;
      const customPrimary: string | undefined = parsed?.customPrimary;
      setThemeId(id);
      applyTheme(getThemeById(id), customPrimary);

      const logo = localStorage.getItem(`${LOGO_STORAGE_KEY_PREFIX}${pharmacyId}`);
      setLogoUrl(logo ?? null);

      const savedMode = (localStorage.getItem(`${COLOR_MODE_KEY_PREFIX}${pharmacyId}`) as ColorMode) ?? "light";
      setColorModeState(savedMode);
      applyColorMode(savedMode);
    } catch {
      setThemeId(DEFAULT_THEME_ID);
      applyTheme(getThemeById(DEFAULT_THEME_ID));
      setColorModeState("light");
      applyColorMode("light");
    }
  }, []);

  // Clear applied theme (on logout) — resets CSS vars + in-memory state, preserves localStorage
  const clearAppliedTheme = useCallback(() => {
    setCurrentPharmacyId(null);
    setThemeId(DEFAULT_THEME_ID);
    setLogoUrl(null);
    setColorModeState("light");
    applyTheme(getThemeById(DEFAULT_THEME_ID));
    applyColorMode("light");
  }, []);

  // Apply default theme on first mount
  useEffect(() => {
    applyTheme(getThemeById(DEFAULT_THEME_ID));
  }, []);

  // Listen to system color scheme changes when mode is "system"
  useEffect(() => {
    if (colorMode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyColorMode("system");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [colorMode]);

  const setTheme = useCallback((id: ThemeId, pharmacyId?: string) => {
    setThemeId(id);
    const preset = getThemeById(id);
    applyTheme(preset);
    try {
      const key = storageKey(pharmacyId);
      const existing = localStorage.getItem(key);
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(key, JSON.stringify({ ...parsed, themeId: id, customPrimary: undefined }));
    } catch { /* ignore */ }
  }, [currentPharmacyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCustomPrimary = useCallback((hex: string, pharmacyId?: string) => {
    const preset = getThemeById(themeId);
    applyTheme(preset, hex);
    try {
      const key = storageKey(pharmacyId);
      const existing = localStorage.getItem(key);
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(key, JSON.stringify({ ...parsed, customPrimary: hex }));
    } catch { /* ignore */ }
  }, [themeId, currentPharmacyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLogo = useCallback((dataUrl: string | null, pharmacyId?: string) => {
    setLogoUrl(dataUrl);
    try {
      const key = logoKey(pharmacyId);
      if (dataUrl) {
        localStorage.setItem(key, dataUrl);
      } else {
        localStorage.removeItem(key);
      }
    } catch { /* ignore — base64 can be large */ }
  }, [currentPharmacyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetTheme = useCallback((pharmacyId?: string) => {
    setThemeId(DEFAULT_THEME_ID);
    applyTheme(getThemeById(DEFAULT_THEME_ID));
    setLogoUrl(null);
    setColorModeState("light");
    applyColorMode("light");
    try {
      localStorage.removeItem(storageKey(pharmacyId));
      localStorage.removeItem(logoKey(pharmacyId));
      localStorage.removeItem(modeKey(pharmacyId));
    } catch { /* ignore */ }
  }, [currentPharmacyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setColorMode = useCallback((mode: ColorMode, pharmacyId?: string) => {
    setColorModeState(mode);
    applyColorMode(mode);
    try {
      localStorage.setItem(modeKey(pharmacyId), mode);
    } catch { /* ignore */ }
  }, [currentPharmacyId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: getThemeById(themeId),
        logoUrl,
        colorMode,
        setTheme,
        setCustomPrimary,
        setLogo,
        resetTheme,
        loadForPharmacy,
        clearAppliedTheme,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export { THEME_PRESETS, DEFAULT_THEME_ID };
