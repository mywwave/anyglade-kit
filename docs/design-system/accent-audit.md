# Accent color audit

Review of November 5, 2026 against the rules in the "Accent" section of `packages/kit/README.md`.

Method: a bright accent `#DB2777` was set in the theme panel, then in Edge at a width of 1280 px, in both themes, primary buttons, fills, text, lines and borders in the accent color were counted on every CRM screen, on the showcase and in 14 blocks. Contrast was computed per WCAG for all seven panel presets on the worst surface of each theme: `#F3F4F6` in light, `#181818` in dark.

Not checked: hover states, phone width and the "Components" section.

## Summary

Accent use on the pages is disciplined, there are almost no composition violations. The main problem is elsewhere: the color set by the theme panel is not adapted to the theme, so each of the seven presets fails contrast.

## Measurements by page

Results in the light and dark themes were the same.

| Page               | Primary buttons | Area share | Where the accent is               |
| ------------------ | --------------- | ---------- | --------------------------------- |
| Showcase           | 4               | 3.38 %     | Buttons, switches, radios, slider |
| CRM Today          | 0               | 0 %        | 5 chart lines, a slice, 2 dots    |
| CRM Deals          | 0               | 0 %        | None                              |
| CRM Customers      | 0               | 0 %        | None until a row is selected      |
| CRM Tasks          | 1               | 0.57 %     | "Add"                             |
| CRM Analytics      | 0               | 0 %        | 6 bars, 2 lines, 2 dots           |
| SignIn             | 1               | 4.72 %     | "Continue"                        |
| CheckoutForm       | 1               | 4.24 %     | "Pay"                             |
| PlanPicker         | 1               | 5.71 %     | "Continue", radio                 |
| SettingsForm       | 1               | 0.78 %     | "Save", switch                    |
| Hero               | 1               | 1.96 %     | "Start for free"                  |
| Pricing            | 1               | 2.07 %     | "Choose", slider                  |
| The other 8 blocks | 0               | 0 %        | None                              |

Upheld: no more than one primary button per block, area share below 10 %, not a single border or text in the accent color, selection in navigation and filters is neutral, statuses use their own colors.

## Preset contrast

Standard: 4.5 for text, 3 for controls, chart lines and focus.

| Preset           | Current label  | Best label | On light | On dark  |
| ---------------- | -------------- | ---------- | -------- | -------- |
| Blue `#2563EB`   | White 5.17     | White 5.17 | 4.70     | **3.44** |
| Indigo `#4F46E5` | White 6.29     | White 6.29 | 5.71     | **2.82** |
| Violet `#7C3AED` | White 5.70     | White 5.70 | 5.18     | **3.12** |
| Pink `#DB2777`   | White 4.60     | White 4.60 | **4.18** | **3.86** |
| Orange `#EA580C` | **White 3.56** | Black 5.90 | **3.23** | 4.99     |
| Green `#059669`  | **White 3.77** | Black 5.57 | **3.42** | 4.71     |
| Teal `#0891B2`   | **White 3.68** | Black 5.70 | **3.35** | 4.82     |

Bold marks values below the 4.5 text standard. Indigo on the dark surface also fails the 3 standard for controls and lines.

## Findings

### Important

1. **The button label is unreadable for three presets.** `apps/playground/src/theme/theme-settings.ts:45`: a luminance threshold of 0.45 keeps white text where black gives almost twice the contrast. The color with the higher contrast should be picked instead of comparing against a threshold. The same code goes into the CSS export.
2. **One text color for both themes.** `theme-settings.ts:62-63`: `--link` and `--ag-text-accent` get the preset value as is, although the `text-accent` token is defined as a pair for the light and dark themes. All seven presets fail the standard in at least one theme. A pair of values derived from the accent and adjusted to 4.5 is needed.
3. **Focus and chart lines inherit the same problem.** `theme-settings.ts:61,64`: indigo on a dark card gives 2.82, while they need 3. The same pair of values will work for them.

### Medium

4. **Sparklines spend the accent on decoration.** `packages/kit/src/charts/charts.tsx:404`: on the "Today" screen four sparklines next to the main chart are colored with the accent. A sparkline shows a trend and must be neutral, otherwise a screen without a single button becomes the most colorful one in the CRM.
5. **Two presets clash with statuses.** `theme-settings.ts:4`: green is close to `text-success`, and orange to `text-warning`. With such an accent the primary button looks like a status. They should be removed from the presets.
6. **`background-accent` does not follow the accent.** `packages/kit/src/tokens.ts:54`: the token is not used anywhere and stays blue with any accent. It should be deleted.
7. **The main action of the "Today" screen is not highlighted.** `apps/playground/src/crm/overview.tsx:74`: the heading talks about stuck deals, and the only action, "Open deals", is `secondary`. A primary button fits here.

### Minor

8. **The showcase shows four primary buttons.** `apps/playground/src/showcase.tsx`: these are cards of different components, not one screen, so the rule is relaxed. If the showcase is meant as a model, it should keep one primary button.
9. **Links do not appear on the pages.** There is not a single `Link` in the CRM and blocks, so finding 2 is visible only in the component demos for now. In a product it will show up at once.

## Fixes

Findings 1–7 are closed. The numbers above describe the state before the fixes.

- Findings 1–3: `apps/playground/src/theme/accent.ts` derives a pair of theme values from the accent, adjusted to the standard. The button keeps the exact brand color, controls use `--ag-accent-control`. `accent.test.ts` checks the contrast of all presets and of extreme colors.
- Finding 4: sparklines are drawn in `text-secondary`.
- Finding 5: green and orange are removed from the presets. Later the whole set was replaced with seven muted colors of the same lightness: mint, sky, lavender, lilac, rose, clay, sage. The numbers in the contrast table do not apply to them.
- Finding 6: the `background-accent` token is deleted.
- Finding 7: "Open deals" became the primary button.

Findings 8 and 9 are left as is: the showcase is not subject to the rule, and links will appear with the first screen that needs them.
