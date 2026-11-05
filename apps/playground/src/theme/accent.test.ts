import { expect, test } from "vite-plus/test";
import { accentPalette, accentPresets, accentVariables, contrast } from "./accent.ts";

const surfaces = { light: "#f3f4f6", dark: "#181818" };
const extremes = ["#000000", "#ffffff", "#ffff00", "#ea580c", "#059669", "#777777"];

test.each([...accentPresets, ...extremes])("%s stays legible in both themes", (accent) => {
  const palette = accentPalette(accent);

  expect(contrast(accent, palette.foreground)).toBeGreaterThanOrEqual(4.5);

  for (const theme of ["light", "dark"] as const) {
    const { control, controlForeground, text } = palette[theme];

    expect(contrast(text, surfaces[theme])).toBeGreaterThanOrEqual(4.5);
    expect(contrast(control, surfaces[theme])).toBeGreaterThanOrEqual(3);
    expect(contrast(control, controlForeground)).toBeGreaterThanOrEqual(4.5);
  }
});

test("buttons keep the exact brand color even when it is bright", () => {
  const variables = accentVariables("#5AC0AB");

  expect(variables["--accent"]).toBe("#5AC0AB");
  expect(variables["--accent-foreground"]).toBe("#000000");
  expect(variables["--ag-accent-control"]).not.toContain("#5AC0AB");
});

test("a legible accent stays untouched in controls and text", () => {
  expect(accentPalette("#2563EB").light.control).toBe("#2563eb");
  expect(accentPalette("#2563EB").light.text).toBe("#2563eb");
});

test("a mid-tone accent gets the label with the higher contrast", () => {
  expect(accentPalette("#0891B2").foreground).toBe("#000000");
  expect(accentPalette("#2563EB").foreground).toBe("#ffffff");
});

test("variables describe both themes", () => {
  const variables = accentVariables("#4F46E5");

  expect(variables["--ag-text-accent"]).toMatch(/^light-dark\(#[\da-f]{6}, #[\da-f]{6}\)$/);
  expect(variables["--focus"]).toBe(variables["--link"]);
});
