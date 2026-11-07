import { tokens } from "@anyglade/kit";
import { useEffect, useState } from "react";
import { accentVariables } from "./accent.ts";

const textScales = {
  compact: "87.5%",
  default: "100%",
  large: "112.5%",
};

export type TextScale = keyof typeof textScales;
export type ButtonShape = "pill" | "rounded";

export interface ThemeSettings {
  /** Hex color, or `null` for the monochrome default. */
  accent: string | null;
  /** Multiplier for every radius token, in percent. */
  radius: number;
  /** Multiplier for every spacing token, in percent. */
  spacing: number;
  buttonShape: ButtonShape;
  textScale: TextScale;
}

export const defaultSettings: ThemeSettings = {
  accent: null,
  radius: 100,
  spacing: 100,
  buttonShape: "pill",
  textScale: "default",
};

const STORAGE_KEY = "anyglade-theme-settings";

function themeVariables({ accent, radius, spacing, buttonShape }: ThemeSettings) {
  const variables: Record<string, string> = accent ? accentVariables(accent) : {};

  if (radius !== defaultSettings.radius) {
    const scale = radius / 100;
    variables["--radius"] = `${0.5 * scale}rem`;
    for (const name of ["s", "m", "l", "frame", "xl"] as const) {
      variables[`--ag-radius-${name}`] = `${Number.parseFloat(tokens.radii[name]) * scale}px`;
    }
  }

  if (spacing !== defaultSettings.spacing) {
    const scale = spacing / 100;
    variables["--spacing"] = `${0.25 * scale}rem`;
    for (const [name, value] of Object.entries(tokens.spacing)) {
      if (name !== "none") {
        variables[`--ag-space-${name}`] = `${Number.parseFloat(value) * scale}px`;
      }
    }
  }

  if (buttonShape === "rounded") {
    variables["--ag-button-radius"] = "var(--ag-radius-m)";
  }

  return variables;
}

let appliedNames: string[] = [];

function applySettings(settings: ThemeSettings) {
  const { style } = document.documentElement;
  const variables = themeVariables(settings);

  for (const name of appliedNames) {
    style.removeProperty(name);
  }
  for (const [name, value] of Object.entries(variables)) {
    style.setProperty(name, value);
  }
  appliedNames = Object.keys(variables);
  style.fontSize = settings.textScale === "default" ? "" : textScales[settings.textScale];
}

function loadSettings(): ThemeSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? { ...defaultSettings, ...(JSON.parse(stored) as Partial<ThemeSettings>) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: ThemeSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings are not critical: without storage they last until reload.
  }
}

export function settingsToCss(settings: ThemeSettings) {
  const declarations = Object.entries(themeVariables(settings)).map(
    ([name, value]) => `  ${name}: ${value};`,
  );
  if (settings.textScale !== "default") {
    declarations.push(`  font-size: ${textScales[settings.textScale]};`);
  }
  return declarations.length > 0
    ? `:root {\n${declarations.join("\n")}\n}\n`
    : "/* Using the default theme */\n";
}

export function useThemeSettings() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  return {
    settings,
    update: (changes: Partial<ThemeSettings>) => setSettings((value) => ({ ...value, ...changes })),
    reset: () => setSettings(defaultSettings),
  };
}
