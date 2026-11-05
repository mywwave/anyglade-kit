const BLACK = "#000000";
const WHITE = "#ffffff";

const TEXT_CONTRAST = 4.5;
const CONTROL_CONTRAST = 3;
const MIX_STEP = 0.02;

/** The surfaces of each theme that sit closest to the accent: `gray-100` and `ink-800`. */
const WORST_SURFACES = { light: "#f3f4f6", dark: "#181818" };

/** One color per hue family at the same OKLCH lightness 0.74 and chroma 0.1, so none shouts. */
export const accentPresets = [
  "#5AC0AB",
  "#6DB3E4",
  "#A4A2E8",
  "#BE99DA",
  "#DF90A8",
  "#DE9871",
  "#9CB66F",
];

function channels(hex: string) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

function luminance(hex: string) {
  const [red = 0, green = 0, blue = 0] = channels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrast(first: string, second: string) {
  const [lighter = 0, darker = 0] = [luminance(first), luminance(second)].toSorted((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function mix(hex: string, target: string, amount: number) {
  const destination = channels(target);
  const mixed = channels(hex).map((channel, index) =>
    Math.round(channel + ((destination[index] ?? 0) - channel) * amount)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${mixed.join("")}`;
}

/** Moves a color away from the surface by the smallest step that reaches the contrast. */
function fit(color: string, surface: string, minimum: number) {
  const target = luminance(surface) > 0.5 ? BLACK : WHITE;
  for (let amount = 0; amount < 1; amount += MIX_STEP) {
    const candidate = mix(color, target, amount);
    if (contrast(candidate, surface) >= minimum) {
      return candidate;
    }
  }
  return target;
}

const readingColor = (fill: string) =>
  contrast(fill, BLACK) > contrast(fill, WHITE) ? BLACK : WHITE;

function themeAccent(accent: string, surface: string) {
  const control = fit(accent, surface, CONTROL_CONTRAST);
  return {
    control,
    controlForeground: readingColor(control),
    text: fit(accent, surface, TEXT_CONTRAST),
  };
}

/**
 * Buttons keep the exact brand color because their label carries the contrast.
 * Controls and text have no label on the fill, so they get a tone that reads on the surface.
 */
export function accentPalette(accent: string) {
  return {
    foreground: readingColor(accent),
    light: themeAccent(accent, WORST_SURFACES.light),
    dark: themeAccent(accent, WORST_SURFACES.dark),
  };
}

export function accentVariables(accent: string) {
  const { foreground, light, dark } = accentPalette(accent);
  const pair = (name: keyof typeof light) => `light-dark(${light[name]}, ${dark[name]})`;
  const text = pair("text");

  return {
    "--accent": accent,
    "--accent-foreground": foreground,
    "--ag-accent-control": pair("control"),
    "--ag-accent-control-foreground": pair("controlForeground"),
    "--focus": text,
    "--link": text,
    "--ag-text-accent": text,
    "--ag-chart-primary": text,
  };
}
