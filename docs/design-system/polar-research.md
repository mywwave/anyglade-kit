# Polar research

Sources: polar.sh (browser, computed styles, JS chunks) and the open repository polarsource/polar, Apache-2.0 license.

## Legal boundaries

- Orbit code and tokens can be used as long as the Apache-2.0 notice is kept.
- PP Neue Montreal is a commercial font by Pangram Pangram. Do not copy it, even if the file sits in their repository.
- Do not use the Polar logo, name or brand identity.

## Architecture

- Next.js + Turbopack, dark theme by default (`html.dark`, `color-scheme: dark`).
- Orbit: `clients/packages/orbit`, documentation in `clients/apps/orbit`. StyleX, Radix, MUI Icons + lucide, motion.
- Tailwind v4 and shadcn tokens (`--background`, `--primary`…) live alongside as legacy.
- ADR-0004: UI is written with `<Box>` and `<Text>` with typed tokens. A raw `<div>` with Tailwind is forbidden.
- The rules are enforced by custom oxlint rules in CI: `no-classname-box`, `no-style-box`, `no-classname-text`.

## Principles (by priority)

1. Design by subtraction. Remove until only what is necessary remains, then remove one more thing.
2. Derived, not decorated. Everything follows from a rule, not from taste.
3. Precision as respect. Imprecision reads as not understanding the user's world.

Product: the data is the design, density with clarity, all states are first-class, speed as a value.

Motion: obeys physics, nothing springs. Elements assemble, lines draw, numbers count.

## Tokens

Two tiers: Tier 1 holds values (`value.stylex.ts`), Tier 2 holds decisions (`semantics.stylex.ts`). Components use only Tier 2.

Dark theme neutrals (`polar`): 50 `#d9d9d9`, 100 `#c9c9c9`, 200 `#adadad`, 300 `#9e9e9e`, 400 `#858585`, 500 `#757575`, 600 `#292929`, 700 `#212121`, 800 `#181818`, 900 `#111`, 950 `#090909`. The scale is pure gray, with a gap between 500 and 600: there are no mid grays.

Background: `background-primary` white/polar950, `background-secondary` gray50/polar900, `background-card` gray100/polar800, `background-inverse` gray900/white.

Text: `text-primary` black/white, `text-secondary` gray500/polar400, `text-tertiary` gray400/polar500, `text-disabled` gray300/polar600.

Borders: `border-primary` gray200/polar700, `border-secondary` gray100/polar800.

Statuses: emerald, red, amber, indigo (the Tailwind scale in oklch).

Spacing: none 0, xs 4, s 8, m 12, l 16, xl 24, 2xl 32, 3xl 48, 4xl 64, 5xl 96.

Radii: none 0, s 8, m 12, l 16, xl 32, full.

Font: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96. Weights 300, 350, 400, 500, 600. Line height 1, 1.25, 1.375, 1.5, 1.625. Tracking -0.02em, 0, 0.025em.

Text roles: `default` 14, `title` 14/500, `body` 16, `label` 12/500, `caption` 12, `heading-xxs` 18→20, `heading-xs` 20→24, `heading-s` 24→30, `heading-m` 30→36, `heading-l` 36→48, `heading-xl` 48→72, `heading-2xl` 60→96. Headings use weight 400.

Shadows: s `0 1px 2px #0000000d`, m/l/xl are a soft glow without offset (`0 0 15px #0000000a, 0 0 2px #0000000f`).

Motion: durations 0, 120, 200, 320, 480 ms. Curves: standard `(0.2, 0, 0, 1)`, decelerate `(0, 0, 0, 1)`, accelerate `(0.3, 0, 1, 1)`, spring `(0.5, 1.25, 0.4, 1)`. Presets: slide by 12px over 300 ms, fade 200/150, scale from 0.95.

Breakpoints: 640, 768, 1024, 1280.

## Orbit methodology

- A token names a decision, not a value: `background-card`, not `gray-100`. The value follows from the decision.
- "Docs are a suggestion. CI is a contract." A rule not enforced by the linter is treated as nonexistent.
- Closed styling: `Alert` and `Status` have no `className`. The variant picks the icon and color itself.
- `Box`: polymorphic, `display: flex` by default, props accept only token names, a `{ base, md, hover }` object for responsiveness and states.
- `Text`: the role sets size, font and tag. Wrapping is built in: headings `balance`, text `pretty`. It has `formatter`, `tabularNums`, `truncate`, `loading` with a skeleton.
- Icons come through a single entry point only. The documentation page counts the usage of every icon.
- The documentation is an app with live examples and links to the source: Foundations (Colors, Spacing, Radius, Shadows, Motion, Typography, Icons) and 22 components.
- Known weak spots: `Button`, `Input`, `Pill` are still on Tailwind with `dark:`; `spring` in the tokens contradicts the "nothing springs" principle.

## Component specifications

- Button: pill, `font-display`, weight 550, tracking 0.01em. Sizes sm h-32 px-12 12px, default h-40 px-20 14px, lg h-48 px-20 14px, icon square. Variants default (inverse, hover opacity .85 over 100 ms), secondary, outline, ghost, underline, link, destructive. `loading` keeps the width: the content is invisible, the spinner is centered.
- Input: h-40, radius 12, focus shown by a blue-300 border and a 3px ring, pre/post slots, base on mobile and sm on desktop against iOS zoom.
- Pill: pill, px-6 py-2, 12px/500, color is required.
- Status: radius 0.5em, padding in em, closed styling.
- SegmentedControl: pill container p-4, the active segment on a raised surface with a shadow, default and tabs variants.
- Modal: appears with scale .99 → 1 over 100 ms, outer radius 24 with 4 padding, inner 20, backdrop black/70.
- Alert: `auto 1fr auto` grid, radius 12, secondary background, only the icon is colored.
- ListGroup: ring frame radius 16, items separated by border-top, p-20.

## Real usage in the Polar frontend

Statistics over 1138 files in `clients/apps/web`, `packages/ui`, `packages/checkout`.

Orbit components by import frequency: Box 380, Text 313, Button 302, icons 266, Input 93, Grid 58, Select 53, Alert 47, InlineModal 42, Status 42, DataTable 41, Avatar 38, Tooltip 26, Modal 22, Switch 19, List 18, Spinner 17, Pill 16, TextArea 15, Checkbox 14, SegmentedControl 11, Tabs 10.

From `@polar-sh/ui`: form 110 (react-hook-form), FormattedDateTime 59, dropdown-menu 27, ShadowBox 20, CopyToClipboardInput 14, popover 11, CountryPicker 10, MoneyInput 8, Combobox 6, DateTimePicker 5.

Value frequency:

- `gap`: s 274, l 244, m 190, xs 176, xl 96, 2xl 65, 3xl 44. Working range 4–24.
- `padding`: xl 99, l 68, m 41, s 31, 2xl 31.
- Background: card 48, secondary 31, inverse 10, primary 9.
- Border: primary 124, secondary 18.
- Radius: l 54, full 26, s 26, m 25.
- `boxShadow` in Box: 0. Shadows are almost unused, depth comes from surfaces.
- Button: `secondary` 189, `ghost` 97, `destructive` 12, `outline` 7. Size `sm` 122, `icon` 76, `lg` 33. The main dashboard button is `secondary sm`.
- Text: `caption` 259, `body` 118, `heading-xxs` 83, `heading-xs` 62, `title` 49. Color `muted` 523.
- The migration to Box is halfway: 1642 Box against 1684 `div`.

Takeaways for the kit: the default dashboard density is small text, `sm` buttons, spacing 8–16. The scale is wider than real usage, and that is fine: the large steps are needed for marketing.

## Screen patterns

- Dashboard shell: a gray-100/polar-950 canvas with 8 padding. The sidebar sits on the canvas without a background. The content is a panel with radius 16, a border and an 8 gap to the context panel.
- Active sidebar item: the panel surface, a border and `shadow-xs`, the icon without color. Inactive items are `muted`, the text darkens on hover.
- Page header: `text-2xl font-medium`, content width up to 1280, `pt-8`, gap 32.
- Master-detail: a 300–320 px list and a detail view, both panels with radius 16, gap 8. One column on mobile.
- InlineModal (42 uses, twice as often as Modal): a 540 px side panel on the right, enters over 320 ms with `decelerate` and a 100% shift, exits over 200 ms with `accelerate`, backdrop black/50. Editing happens in a panel, not in a centered modal.
- Section: `gap-8 p-6 md:p-12`, compact variant `gap-6 p-6 md:p-8`, heading `text-lg font-medium`, description `muted`.
- DetailRow: a `muted` label and a value in two equal columns, an empty value shows as `—`, the action appears on hover, a column on mobile.
- StatisticCard: a `muted` label, a `font-mono` value, sizes sm and lg.
- EmptyState: a `border-primary` frame, radius 12, `padding 3xl`, an icon, a `body` heading, a `muted` description, actions. An empty filter result is simpler: no frame, a `secondary sm` button "Clear filters".
- DataTable: a frame with radius 16, the header on the secondary background, `table-fixed`, manual sorting and pagination, a 24 gap before pagination, row selection with a checkbox, loading as a separate row.
- Forms: react-hook-form, `space-y-2` inside a field, error `text-destructive text-sm font-medium`, linked through `aria-describedby`.
- Charts: Recharts, cursor sync between charts of one group.
- In-page content editing through `ShadowBox`: gray-50/polar-900 background, radius 12, 32 on large screens, `p-8`.
- Formatting: `FormattedDateTime` and money are separate components, not utilities.

## Observations on the page

- Nested frame: an outer container with a border and a header strip, 4 padding, tiles on another surface inside. One technique for product cards, pricing plans and modals.
- Depth is built by surface contrast, shadows are almost unused in the dark theme.

- The main text weight is 450, buttons 550, headings 400.
- Two-tone headings: the first part white, the second gray.
- Numbers: `font-feature-settings: "liga" 0, "ss07", "ss08"`, Geist Mono for technical values.
- Radii: 12 and 16 on cards, pill on buttons and inputs.
- 1px borders `#212121` and `#181818`, dividers instead of shadows.
- Main transitions 120 ms ease, state changes 75–150 ms.
