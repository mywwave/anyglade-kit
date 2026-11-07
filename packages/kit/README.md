<img src="https://unpkg.com/@anyglade/kit/assets/logo.svg" alt="" width="96" />

# @anyglade/kit

A React UI kit on HeroUI v3. One package gives you every HeroUI component, a theme built on semantic tokens, typed `Box` and `Text` for layout, a closed component API, motion and loading behaviour, oxlint rules that keep a project inside the system, and a design skill that teaches AI agents to build with it.

Requirements: React 19+, Tailwind CSS 4+.

## Install

```bash
bun add @anyglade/kit
```

HeroUI and React Aria come with the package. No Provider is needed.

## Setup

In the main CSS file of the app, strictly in this order:

```css
@import "tailwindcss";
@import "@anyglade/kit/styles.css";
```

The kit replaces the Tailwind text scale, weights and tracking, so Tailwind utilities and HeroUI components follow the same scale.

```tsx
import { Button, PageHeader } from "@anyglade/kit";

export function Page() {
  return <PageHeader title="Orders" actions={<Button>Create</Button>} />;
}
```

Import components only from `@anyglade/kit`, not from `@heroui/react`. Otherwise the kit wrappers and replacements, such as `Button` with its built-in loader, do not apply.

| Entry point            | What it gives                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `@anyglade/kit`        | All HeroUI components, `Box`, `Text`, patterns, motion helpers, `tokens`, `Shimmer` |
| `@anyglade/kit/ai`     | Components for an agent interface                                                   |
| `@anyglade/kit/charts` | Charts on Recharts                                                                  |
| `@anyglade/kit/icons`  | Gravity UI Icons and `VideoSlash`                                                   |
| `@anyglade/kit/oxlint` | The oxlint plugin                                                                   |

## For AI agents

The design system rules ship inside the package as the `anyglade-design-system` skill and update with it. The `anyglade-kit` CLI connects a project's agents to them:

```bash
bunx @anyglade/kit init
```

It writes pointers, not copies, so the rules always match the installed version:

- `.claude/skills/anyglade-design-system/SKILL.md` for Claude Code and `.agents/skills/anyglade-design-system/SKILL.md` for Codex and other agents that read skills. Both point at `node_modules/@anyglade/kit/skills/anyglade-design-system/SKILL.md`.
- A marked block in `AGENTS.md` for Cursor and the rest. Running `init` again updates the block and leaves the text around it alone.

A `SKILL.md` written by hand, without the kit's mark, is never replaced. In a monorepo `init` finds the package installed above the app.

The same connection runs from `postinstall`. It is skipped in CI, when `ANYGLADE_KIT_NO_AGENTS=1` is set, and when the kit is not installed from `node_modules`, and it never fails an install. Bun and pnpm do not run dependency scripts without permission, so there either install with trust or run `init`:

```bash
bun add --trust @anyglade/kit
```

Lint errors from the kit rules also point to the skill.

## Layout

`Box` and `Text` accept only tokens. `className` and `style` are closed at the type level, and the dark theme works without `dark:`.

```tsx
import { Box, Text } from "@anyglade/kit";

export function Card() {
  return (
    <Box
      flexDirection="column"
      gap="m"
      padding={{ base: "l", md: "xl" }}
      backgroundColor={{ base: "background-card", hover: "background-secondary" }}
      borderRadius="l"
    >
      <Text as="h3" variant="heading-xs">
        Revenue
      </Text>
      <Text variant="body" tabularNums formatter="number">
        {3290033}
      </Text>
    </Box>
  );
}
```

`Box`:

- `display: flex` by default, except for `span`, `label`, `li` and `a`. The element changes through `as`.
- Every token prop takes a value or an object of conditions: `base`, the breakpoints `sm`, `md`, `lg`, `xl` and the states `hover`, `focus`, `focusVisible`, `focusWithin`, `active`.
- Token props cover spacing (`padding*`, `margin*`, `gap`, `rowGap`, `columnGap`; negative margins as `-s`), color (`backgroundColor`, `color`, `borderColor`), `borderRadius`, `boxShadow`, borders, flex and alignment, `position`, `overflow`, `cursor`, `breakInside`, `motion` and transitions.
- Free props take any value: sizes, insets, `flex`, `aspectRatio`, `zIndex`, grid templates and areas, `columns`, `opacity`, `transform`, `viewTransitionName`.
- Works in server components and injects no styles at render time.

`Text`:

- `variant` sets the role: `default`, `title`, `body`, `label`, `caption`, `heading-xxs` to `heading-2xl`.
- `color`: `default`, `muted`, `subtle`, `disabled`, `inverse`, `accent`, `success`, `warning`, `danger`. `weight`, `align` and `wrap` (`wrap`, `nowrap`, `balance`, `pretty`) adjust the role.
- `tabularNums`, `monospace`, `lineThrough`, `truncate` (`true` for one line or a number of lines), and `formatter` (`"number"`, `"compact"` or a function) for a string or number child.
- `as` takes a text element: `p` by default, `span`, `label`, headings and the like.

## Tokens

Tokens name decisions, not values: `background-card`, not `gray-100`. The source is `src/tokens.ts`, and the same values are available in JavaScript through the `tokens` export.

| Group       | Values                                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Spacing     | `none` 0, `2xs` 2, `xs` 4, `s` 8, `m` 12, `l` 16, `xl` 24, `2xl` 32, `3xl` 48, `4xl` 64, `5xl` 96                                 |
| Radius      | `none` 0, `s` 8, `m` 12, `l` 16, `frame` 20, `xl` 32, `full`                                                                      |
| Surfaces    | `background-canvas`, `-panel`, `-primary`, `-secondary`, `-card`, `-emphasis`, `-inverse`, plus `-warning`, `-success`, `-danger` |
| Text colors | `text-primary`, `-secondary`, `-tertiary`, `-disabled`, `-inverse`, `-accent`, status colors and `text-label-*`                   |
| Borders     | `border-primary`, `-secondary`, `-control`, `-warning`                                                                            |
| Widths      | `tokens.widths`: `panel` 320, `form` 400, `content` 720, `wide` 880                                                               |
| Motion      | `--ag-duration-*` from `instant` to `slower`, `--ag-ease-standard`, `-decelerate`, `-accelerate`                                  |
| Feedback    | `tokens.timings`: `loaderDelay` 150, `pageLoaderDelay` 400, `loaderMinimum` 400, `confirmation` 1500                              |

Every color is a pair for the light and dark themes. Content does not stretch to the full width: forms up to `form`, reading and settings up to `content`, mixed content up to `wide`.

## Patterns

Ready compositions on top of `Box` and `Text`. Every label is a prop, so the kit has no built-in language.

- `PageHeader` — page title with a description and actions.
- `Frame` and `FrameTile` — a frame with a header and tiles inside.
- `Stat` — a label and a value with tabular figures, with an optional note.
- `DetailRow` — a label and value row. An empty value shows as "—".
- `EmptyPanel` — an empty state with an icon, a description and actions.
- `CopyButton` — copies a value and confirms right on the button.
- `CountBadge` — a counter of new items: unread, queue. Above 99 it shows "99+" and gives a short nudge when the number grows.
- `SegmentedControl` — a filter of a few options with a sliding indicator.
- `SortableColumn` and `useTableSort` — table sorting by values, not by labels.
- `Loadable` — a skeleton while loading, then the content fades in.
- `PageLoader` — app start: a logo with a slow highlight, a thin bar and a status line on the whole screen. It appears only if the work takes longer than `delay`, 400 ms by default, so fast pages open without it.
- `TreeNav` — a sidebar tree: groups expand, the current item is marked, a status sits on the right.
- `ItemList` — rows that open an object and carry their own buttons: chats, mail, tasks. Arrows move between rows, Enter opens, the right arrow reaches the row buttons. `menu` adds a context menu on right click, long press and the menu key. `onAltOpen` gives a second way to open.
- `Draggable` — drags a value onto `ItemList` rows that have `drop`. Repeat the action in the menu for touch and keyboard.
- `FloatingPanel` — a popover at a button that can be pinned and dragged. Without `triggerRef` it stands on its own, there can be many such windows, and a click brings one to the front. `resize` adds resizing. The page under it keeps working. Dragging the header pins it. Keyboard: arrows on the header.
- `MediaStage`, `MediaTile`, `StreamVideo` — a call stage: a grid or one tile on stage with a strip of the others, a tile with a name and a speaker ring, a live stream.
- `Masonry` and `MasonryTile` — a gallery of tiles of different heights: columns fill top to bottom, a live piece stands on a calm stage with its title under it. One column on a phone, two from `md`, three from `lg`.
- `SlideToConfirm` — gesture confirmation for an action that must not happen by accident: a money transfer, a deletion. The thumb slides to the end with the fill behind it, an `onConfirm` promise holds the loader, a rejection sends the thumb back. Enter works from the keyboard.
- `SignaturePad` — a handwritten signature. The ink takes the text color, `onChange` returns a PNG data URL after every stroke and `null` after clearing.
- `TextSwap` — short text that changed state: only the changed part moves and the width eases. With `isShimmering` the whole line changes at once. One line per action: timers, values that follow typing, tables and sentences go without it.
- `Shimmer` — a string with a highlight that means only "work in progress".

## Loading and motion

A button shows its loader by itself. There are three ways, none needs extra markup:

```tsx
import { Box, Button } from "@anyglade/kit";

const save = () => fetch("/api/save", { method: "POST" });

async function send(data: FormData) {
  await fetch("/api/send", { method: "POST", body: data });
}

export function Actions({ isSaving }: { isSaving: boolean }) {
  return (
    <Box gap="s">
      {/* onPress returns a promise */}
      <Button onPress={save}>Save</Button>

      {/* the form is submitting */}
      <Box as="form" action={send}>
        <Button type="submit">Send</Button>
      </Box>

      {/* state from outside */}
      <Button isPending={isSaving}>Save</Button>
    </Box>
  );
}
```

`action` suits forms without controlled fields. React resets the form after `action`, and the React Aria `TextField` rolls back to its initial value. For controlled fields use `onSubmit` with `useTransition` and pass `isPending`.

The button stops responding to presses at once, while the loader appears after 150 ms and stays for at least 400 ms. The width does not change. `useLoadingIndicator(isLoading)` gives the same rules to your own indicators.

For morphing, wrap the state change in `withTransition` and give the element a `viewTransitionName`. While a `FloatingPanel` is open, no page snapshot is taken. `ItemList` rows move on their own, without a snapshot. The entrance of a single element is set by `<Box motion="fade | enter | pop">`.

Motion explains a change: the more frequent the action, the less motion. With `prefers-reduced-motion` movement stops and opacity changes stay.

## Lint

oxlint rules keep the project inside the system. Connect them in `vite.config.ts` for Vite+ or in the oxlint config:

```ts
lint: {
  jsPlugins: [{ name: "anyglade", specifier: "@anyglade/kit/oxlint" }],
  rules: {
    "anyglade/no-raw-layout": "error",
    "anyglade/no-raw-text": "error",
    "anyglade/no-typography-utility": "error",
    "anyglade/no-spacing-utility": "error",
    "anyglade/no-foreign-import": "error",
    "anyglade/no-dark-variant": "error",
    "anyglade/no-arbitrary-value": "error",
  },
},
```

| Rule                    | What it catches                                                           |
| ----------------------- | ------------------------------------------------------------------------- |
| `no-raw-layout`         | `div`, `section`, `form`, `ul` and other layout elements instead of `Box` |
| `no-raw-text`           | `h1`–`h6` and `p` instead of `Text`                                       |
| `no-typography-utility` | `text-sm`, `font-semibold`, `leading-*`, `tracking-*` in `className`      |
| `no-spacing-utility`    | `p-*`, `m-*`, `gap-*`, `space-*` in `className`                           |
| `no-foreign-import`     | Imports from `@heroui/react`, `@heroui/styles`, `@gravity-ui/icons`       |
| `no-dark-variant`       | `dark:` variants                                                          |
| `no-arbitrary-value`    | Arbitrary Tailwind values like `w-[13px]`                                 |

Typography and spacing are set only through `Text` and `Box`. Tailwind utilities like `text-sm` or `font-semibold` and HeroUI components take values from the same scale, so the system stays consistent even without the linter.

## Accent

The accent answers two questions: what the main action is here, and what is on right now. Everything else stays monochrome. Without a color set, the accent is the primary text color, and that is a complete theme.

- **One primary button per screen or block.** `variant="primary"` goes to the action the person came for. Other buttons are `secondary` or `ghost`. If there is no main action, there is no primary button. `primary` is the default, so always set the variant on a secondary button.
- **The on state of a control.** A checkbox, radio, switch and slider take the accent by themselves. Selection in navigation, filters and tables stays neutral, as in `SegmentedControl`.
- **Accent text only for links.** Headings, numbers, amounts, labels and icons are never accent colored. Importance comes from size, weight and wording.
- **No surface or border fills.** The accent does not color sections, cards or backgrounds. A strong area of the screen uses `background-inverse`. Accent fills take less than 10 % of a block's area.
- **Status is not accent.** Success, warning and error have their own colors, deletion goes through `danger`. The accent must not read as a status: the `success` hue, amber, red and saturated orange between them do not fit. Mint and muted clay fit: they are softer than the statuses and do not match their hue.
- **A calm color.** The accent is never acid. The ready colors in the panel share one lightness and chroma in OKLCH (0.74 and 0.1), one per hue family. Pick a brand color close to that chroma.
- **One series per chart.** The main series gets the accent, the others are neutral. Sparklines are always neutral.
- **Contrast is required.** A label on the accent and accent text hold 4.5; unlabeled controls on a fill, chart lines and focus hold 3 on every surface. The button keeps the exact brand color: its label keeps it readable. The label color is picked by the higher contrast. Text and lines are set as a pair of values for the light and dark themes. The "Theme" panel derives such a pair from one brand color and shifts it only where contrast falls short. The control tone lives in `--ag-accent-control`.
- **Color is not the only signal.** The on state is visible without color too: by a check, a position, a shape.

The component showcase displays variants and is not subject to the one-button rule. The latest audit is in `docs/design-system/accent-audit.md`.

## Theme

By default the theme follows the OS setting and works without JavaScript. Pin it on `<html>`:

```html
<html class="dark" data-theme="dark"></html>
```

Light and dark are equal. For a user-facing switch use the HeroUI `useTheme()` hook from `@anyglade/kit`.

Accent, radii and button shape can be changed in the project. Open the "Theme" panel in the playground, tune the look and copy the ready CSS into your stylesheet after the kit import.

- Accent: `--accent`, `--accent-foreground`, `--ag-accent-control`, `--ag-accent-control-foreground`, `--focus`, `--link`, `--ag-text-accent`, `--ag-chart-primary`.
- Button shape: `--ag-button-radius`.
- Density: `--spacing` and `--ag-space-*`.

## Fonts

Inter for the interface and Geist Mono for numbers and code come with the styles and are served by your app, with no requests to external services. Replace them with Tailwind theme tokens in the app CSS:

```css
@theme {
  --font-sans: "Your Font", sans-serif;
}
```

## AI

Components for an agent interface live in a separate entry, `@anyglade/kit/ai`, so projects without one stay light. They do not depend on a provider and take plain data, so they work with any SDK. Labels are passed as props.

| Component                                                 | What it covers                                                                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Conversation`, `ConversationTurn`, `ConversationNewMark` | A feed on the page scroll: the question at the top, the answer grows under it; a mark before the first unread message |
| `Message`, `StreamingText`                                | A message and an answer word by word. A `[1]` mark becomes a link to a source                                         |
| `DeliveryStatus`                                          | Checks on your own message, a word in the tooltip. The `meta` slot of `Message`                                       |
| `PromptComposer`, `Suggestions`                           | Input, attachments, send and stop in one place, suggestions                                                           |
| `Reasoning`                                               | The agent's reasoning                                                                                                 |
| `Plan`                                                    | What the agent is going to do: a separate object with a title, progress and steps on a line                           |
| `Run`                                                     | A plan, a queue, tasks, a chain of steps, a test run. Subagent steps go into `steps`                                  |
| `ToolCall`                                                | A tool call and the approval before it                                                                                |
| `CodeOutput`                                              | Terminal output and a stack trace                                                                                     |
| `FileTree`                                                | Changed files                                                                                                         |
| `Sources`, `Citation`                                     | Sources as a list and in the text                                                                                     |
| `ModelPicker`, `ContextMeter`                             | Model, effort, context usage                                                                                          |
| `Checkpoint`                                              | A point you can return to                                                                                             |

The page scrolls. A new question moves to the top, and the answer grows into the free space under it. When it reaches the input, the page follows it smoothly, and if the reader has scrolled up, it stays put and shows a scroll-down button. Wrap each turn in `ConversationTurn`, pass the id of the latest turn to `followKey` and the height of everything stuck to the top to `topInset`. For a chat in a panel or a window use `isContained`: the messages scroll in their own box and the input stays outside it.

Blocks appear through `opacity` and `transform`, so the layout is not recalculated on every frame. Keep the stream state apart from the input and memoize messages: a new word should re-render only its own paragraph. Step rows keep a constant height.

`Shimmer` lives in the main entry and takes a string. It means only "work in progress". The highlight is a separate layer on top of the text. After it stops, it finishes its pass and is removed once it is outside the text, so the letters are not repainted and the end is not visible. With `prefers-reduced-motion` plain text remains.

## Charts

Charts come from a separate entry, so projects without them do not get Recharts in the bundle:

```tsx
import { LineChart } from "@anyglade/kit/charts";

export function Revenue() {
  return (
    <LineChart
      label="Revenue by month"
      data={[
        { month: "Sep", revenue: 96 },
        { month: "Oct", revenue: 120 },
      ]}
      xKey="month"
      series={[{ dataKey: "revenue", label: "Revenue" }]}
    />
  );
}
```

Available: `LineChart`, `AreaChart`, `BarChart` (with `stacked`), `DonutChart` and `Sparkline`. Colors come from the tokens, with at most three series or slices. The legend shows only for several series. Sparklines are always neutral.

## Icons

The [Gravity UI Icons](https://gravity-ui.com/icons) set comes from a separate entry, because some names clash with components (`Link`, `Calendar`, `Tag`):

```tsx
import { Button } from "@anyglade/kit";
import { Persons } from "@anyglade/kit/icons";

export function Invite() {
  return (
    <Button>
      <Persons />
      Invite
    </Button>
  );
}
```

Only the icons you use end up in the bundle. The `Box` icon clashes with the component, so import it as `Box as BoxIcon`. The kit adds `VideoSlash`, which Gravity lacks.

## Contributing

Tokens are defined in `src/tokens.ts`. After a change run `bun run generate`: a test checks that the generated CSS matches the source.
