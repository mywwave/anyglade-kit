export const palette = {
  white: "#ffffff",
  black: "#000000",

  "gray-50": "oklch(0.985 0.002 247.839)",
  "gray-100": "oklch(0.967 0.003 264.542)",
  "gray-200": "oklch(0.928 0.006 264.531)",
  "gray-300": "oklch(0.872 0.01 258.338)",
  "gray-400": "oklch(0.707 0.022 261.325)",
  "gray-500": "oklch(0.551 0.027 264.364)",
  "gray-900": "oklch(0.21 0.034 264.665)",

  "ink-50": "hsl(0 0% 85%)",
  "ink-400": "hsl(0 0% 52%)",
  "ink-500": "hsl(0 0% 46%)",
  "ink-600": "hsl(0 0% 16%)",
  "ink-700": "hsl(0 0% 13%)",
  "ink-800": "hsl(0 0% 9.5%)",
  "ink-900": "hsl(0 0% 6.5%)",
  "ink-950": "hsl(0 0% 3.5%)",

  "blue-50": "oklch(0.97 0.014 254.604)",
  "blue-400": "oklch(0.707 0.165 254.624)",
  "blue-500": "oklch(0.623 0.214 259.815)",
  "blue-600": "oklch(0.546 0.245 262.881)",
  "blue-950": "oklch(0.282 0.091 267.935)",

  "emerald-50": "oklch(0.979 0.021 166.113)",
  "emerald-500": "oklch(0.696 0.17 162.48)",
  "emerald-950": "oklch(0.262 0.051 172.552)",

  "red-50": "oklch(0.971 0.013 17.38)",
  "red-500": "oklch(0.637 0.237 25.331)",
  "red-950": "oklch(0.258 0.092 26.042)",

  "amber-50": "oklch(0.987 0.022 95.277)",
  "amber-300": "oklch(0.879 0.169 91.605)",
  "amber-500": "oklch(0.769 0.188 70.08)",
  "amber-700": "oklch(0.555 0.163 48.998)",
  "amber-950": "oklch(0.279 0.077 45.635)",
} as const;

type PaletteColor = keyof typeof palette;
type ColorPair = readonly [light: PaletteColor, dark: PaletteColor];

export const colors = {
  "background-canvas": ["gray-100", "ink-950"],
  "background-panel": ["white", "ink-900"],
  "background-primary": ["white", "ink-950"],
  "background-secondary": ["gray-50", "ink-900"],
  "background-card": ["gray-100", "ink-800"],
  "background-inverse": ["gray-900", "white"],
  "background-accent": ["blue-50", "blue-950"],
  "background-warning": ["amber-50", "amber-950"],
  "background-success": ["emerald-50", "emerald-950"],
  "background-danger": ["red-50", "red-950"],

  "text-primary": ["black", "white"],
  "text-secondary": ["gray-500", "ink-400"],
  "text-tertiary": ["gray-400", "ink-500"],
  "text-disabled": ["gray-300", "ink-600"],
  "text-accent": ["blue-600", "blue-400"],
  "text-success": ["emerald-500", "emerald-500"],
  "text-danger": ["red-500", "red-500"],
  "text-warning": ["amber-500", "amber-500"],

  "border-primary": ["gray-200", "ink-700"],
  "border-secondary": ["gray-100", "ink-800"],
  "border-warning": ["amber-300", "amber-700"],
} as const satisfies Record<string, ColorPair>;

export const spacing = {
  none: "0",
  "2xs": "2px",
  xs: "4px",
  s: "8px",
  m: "12px",
  l: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
  "4xl": "64px",
  "5xl": "96px",
} as const;

export const radii = {
  none: "0",
  s: "8px",
  m: "12px",
  l: "16px",
  xl: "32px",
  full: "9999px",
} as const;

export const shadows = {
  none: "none",
  s: "0 1px 2px rgb(0 0 0 / 0.05)",
  m: "0 0 15px rgb(0 0 0 / 0.04), 0 0 2px rgb(0 0 0 / 0.06)",
  l: "0 0 20px rgb(0 0 0 / 0.04), 0 0 5px rgb(0 0 0 / 0.06)",
  xl: "0 0 30px rgb(0 0 0 / 0.04), 0 0 10px rgb(0 0 0 / 0.06)",
} as const;

export const durations = {
  instant: "0ms",
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  slower: "480ms",
} as const;

export const easings = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
  accelerate: "cubic-bezier(0.3, 0, 1, 1)",
} as const;

export const fontSizes = {
  1: "0.75rem",
  2: "0.875rem",
  3: "1rem",
  4: "1.125rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.875rem",
  8: "2.25rem",
  9: "3rem",
  10: "3.75rem",
  11: "4.5rem",
  12: "6rem",
} as const;

export const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
} as const;

export const fontWeights = {
  light: "300",
  book: "350",
  regular: "400",
  body: "450",
  medium: "500",
  strong: "550",
  semibold: "600",
} as const;

export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
} as const;

type FontSize = keyof typeof fontSizes;

/** Tailwind's text scale, so HeroUI and consumer utilities resolve to the same values. */
export const tailwindText = {
  xs: { size: 1, leading: "snug" },
  sm: { size: 2, leading: "normal" },
  base: { size: 3, leading: "normal" },
  lg: { size: 4, leading: "snug" },
  xl: { size: 5, leading: "snug" },
  "2xl": { size: 6, leading: "snug" },
  "3xl": { size: 7, leading: "snug" },
  "4xl": { size: 8, leading: "tight" },
  "5xl": { size: 9, leading: "tight" },
  "6xl": { size: 10, leading: "none" },
  "7xl": { size: 11, leading: "none" },
  "8xl": { size: 12, leading: "none" },
} as const satisfies Record<string, { size: FontSize; leading: keyof typeof lineHeights }>;

export const tailwindWeights = {
  normal: "body",
  medium: "medium",
  semibold: "strong",
  bold: "strong",
} as const satisfies Record<string, keyof typeof fontWeights>;

interface TextRole {
  size: FontSize;
  /** Size from the `md` breakpoint up. */
  mdSize?: FontSize;
  leading: keyof typeof lineHeights;
  weight?: keyof typeof fontWeights;
}

export const textRoles = {
  default: { size: 2, leading: "normal" },
  title: { size: 2, leading: "normal", weight: "medium" },
  body: { size: 3, leading: "normal" },
  label: { size: 1, leading: "snug", weight: "medium" },
  caption: { size: 1, leading: "snug" },
  "heading-2xl": { size: 10, mdSize: 12, leading: "none", weight: "regular" },
  "heading-xl": { size: 9, mdSize: 11, leading: "none", weight: "regular" },
  "heading-l": { size: 8, mdSize: 9, leading: "tight", weight: "regular" },
  "heading-m": { size: 7, mdSize: 8, leading: "tight", weight: "regular" },
  "heading-s": { size: 6, mdSize: 7, leading: "snug", weight: "regular" },
  "heading-xs": { size: 5, mdSize: 6, leading: "snug", weight: "regular" },
  "heading-xxs": { size: 4, mdSize: 5, leading: "snug", weight: "regular" },
} as const satisfies Record<string, TextRole>;

export const textColors = {
  default: "text-primary",
  muted: "text-secondary",
  subtle: "text-tertiary",
  disabled: "text-disabled",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const satisfies Record<string, keyof typeof colors>;
