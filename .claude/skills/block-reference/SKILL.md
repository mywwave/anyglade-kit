---
name: block-reference
description: Use ALWAYS when asked for a block, section, screen, reference or example for the UI kit: "make a block", "add a section", "I need a reference screen", "come up with a landing page / dashboard / checkout", "redo the blocks", "make it more creative", "fix Pricing", and the Russian phrasings «сделай блок», «добавь секцию», «нужен эталон экрана», «переделай блоки», «сделай креативнее». Also when reviewing existing blocks and when moving a block into a product. Defines the modes, the creative step, the files in apps/playground/src/blocks, the kit laws, the bans on template design and the mandatory browser check.
argument-hint: '[block or section, for example "Pricing" or "a new hero for checkout"]'
---

# UI kit blocks

A block is a live sample in the `apps/playground/src/blocks` gallery, like the bencho.dev tiles. It is the kit's showcase: one deeply crafted object (a receipt, a card, a contract, a phone) with a gesture, final copy, plausible data and every state in the light and dark themes and on a phone.

A block is worth something only if it cannot be mistaken for a template. "Press the button, text appears" is not a block. It needs the details of the object, a multi-step interaction, pleasant motion and a way back from every state.

Before you start, read:

- `docs/design-system/decisions.md`: decisions already made;
- `docs/design-system/polar-research.md`: reference values and patterns;
- `packages/kit/src/tokens.ts` and `packages/kit/README.md`: tokens and API;
- the neighbouring files in `apps/playground/src/blocks`, so you do not repeat them;
- `.claude/skills/anyglade-design-system/references/craft.md`: creativity level, detail, gesture and scenario. A block is handed in only at the "Crafted" level.

Load the `anti-slop` skill. For marketing also load `design-taste-frontend`, for motion `transitions-dev`.

## 1. Mode

| Mode            | When                                       | What to do                                                                          |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| A. New          | The block does not exist                   | Build it from scratch                                                               |
| B. Rethink      | "Redo it", "more creative", "from scratch" | Write it anew instead of patching the old one. Keep the features. Git keeps history |
| C. Targeted fix | A specific element is named                | Change only that, keep the block's identity                                         |

If the mode is unclear, ask once: "rethink it fully or fix X?". Answer everything the code can answer yourself.

Decide the character of the surface, it sets how bold to be:

- **Persuasion** (marketing, sign-in, pricing): the block itself is the design. It needs one strong idea, bold scale, character.
- **Work** (dashboard, settings, tables, checkout): boldness shows as precision, density and reading speed. Showiness gets in the way here.

## 2. Creative step (modes A and B)

Code is written only after this step.

1. **Why.** Who looks, what decision they make, what they do next. One sentence.
2. **Idea.** One thought the block conveys without reading the small print. If it fits any product, it is weak.
3. **Three different concepts.** One line each, using different composition moves. Treat the first option that comes to mind as a template and drop it.
4. **Choice.** Take the concept with the strongest idea and tell the user in one line why.

Composition moves a concept is built from:

- **Product instead of illustration.** A real working piece of interface on real data takes the main place.
- **Scale as hierarchy.** One number or phrase in `heading-2xl`, everything else is subordinate.
- **Density contrast.** Lots of air next to a dense block of data.
- **Asymmetry.** 1:2, 2:3, 5:7 grids instead of equal columns. An offset axis instead of centring.
- **Inversion.** One area on `background-inverse` as the only accent on the screen.
- **Two-tone heading.** The statement in the main color, the explanation in `muted`, in one run.
- **Tabular typography.** Numbers and `monospace` build the composition instead of decoration.
- **End-to-end interaction.** A switch or slider changes the whole block: price, calculation, chart.
- **A slice instead of the whole.** One live moment is shown: the charge went through, the status changed, the number grew.
- **Text as interface.** A strong phrase replaces feature cards.

Banned starting compositions: a centred heading over three identical cards, an icon-heading-text grid, a hero with a heading on the left and a picture on the right with no idea. Two blocks in a row must not use the same main move.

## 3. Template design indicators

Each of them must either be removed or come with a concrete answer about what information it carries.

| Indicator                   | Kit rule                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tags                        | `Chip` and `Badge` only for a rare state that needs action. A status is text in its role color by default. No eyebrows over headings and no "New" pills                                          |
| Italic words                | Banned. Emphasis comes from wording or `muted` contrast                                                                                                                                          |
| Serif and negative tracking | Only Inter and Geist Mono. Tracking comes from tokens, negative tracking is banned                                                                                                               |
| Over-detailed UI            | Only what this screen's decision needs. Not every label gets an icon, no extra metadata in a row. The rest on demand                                                                             |
| Separators                  | Structure comes from `gap`, size and weight. `Separator` is allowed only between groups of different nature in menus and in dense tables                                                         |
| Many shades and opacities   | Three text levels: `default`, `muted`, `subtle`. Surfaces only from tokens. `opacity` for color is banned                                                                                        |
| Bordered containers         | One surface level. A border only on inputs and collection items. No cards in cards. At most one `Frame` per block and only as a product showcase                                                 |
| Accent as decoration        | One primary button per block, the others set `variant` explicitly. Accent never colors text, icons, numbers, borders or surfaces. Full rules in the "Accent" section of `packages/kit/README.md` |
| Charts                      | The more detail, the worse. One line, no axes, grid or legend. If the thought fits a number or a sentence, no chart is needed                                                                    |
| Code breadcrumbs            | No file paths, `~/project $`, `01 / FEATURES` or mono caps as decoration. `monospace` only for real identifiers                                                                                  |
| Section numbering           | No "01 — Features". Numbers only on a real sequence of actions                                                                                                                                   |

There is one exception: a rule gives way if the element really carries meaning that would otherwise be lost. Tell the user why.

## 4. Kit laws

A block is made only of the kit.

- Layout with `Box`, text with `Text`. No raw `div`, `p`, `h1`, the linter catches them.
- Imports only from `@anyglade/kit` and `@anyglade/kit/icons`. Import the `Box` icon as `Box as BoxIcon`.
- Tokens only. A new value is added to `packages/kit/src/tokens.ts`, then `bun run generate` in `packages/kit`. No CSS inside blocks.
- A new component is created only following section 5.
- HeroUI component changes go only into `packages/kit/styles/components.css`. HeroUI animations, especially the tactile press, are never turned off.
- A new system decision is recorded in `docs/design-system/decisions.md`.

Size: a block sits in the centre of a `MasonryTile` stage, content about 300 px wide on desktop and 330 on a phone.

- A block must look finished at 300 px: centre it with `width="100%"` and `maxWidth`.
- The tile height does not change between states, otherwise neighbouring columns jump. Reserve space for future content in advance.
- A label and its value must read as a pair. An input wider than 480 px is a defect.
- A gesture writes `transform` straight into the element through a `ref`, complex motion goes through Web Animations. Every gesture has a keyboard path.

Traps we have already fallen into:

- `Box` is `flex` by default, so normal flow needs `display="block"`.
- A row of fields is a `repeat(2, minmax(0, 1fr))` grid, otherwise inputs overflow the container on a phone.
- `Text` has no margins, the parent `Box` sets spacing.
- `Text` inherits color. For contrast inside a `Box` use `color`.
- Grids must use `minmax(0, 1fr)`, otherwise long content stretches the column.
- A form `action` resets the form when done, and `TextField` rolls back its controlled value. Such forms use `onSubmit`, `useTransition` and `isPending`.
- Concentric radii: the outer one equals the inner one plus the padding.
- HeroUI components have high specificity and `min-height`. Check the real selector in `@heroui/styles/dist/components`.

## 5. New component

If the idea cannot be built from what exists, create a component. Workarounds are banned: complex layout inside a block, copy-paste between blocks, styles that bypass tokens.

First check, in order, what already exists:

1. HeroUI components and their variants in the playground's Components tab.
2. Kit patterns: `Frame`, `Stat`, `DetailRow`, `EmptyPanel`, `PageHeader`.
3. A new token or a change in `styles/components.css`, if only the look changes.

Creating a new component:

1. **File.** `packages/kit/src/<name>/<name>.tsx`, built from `Box`, `Text` and HeroUI components.
2. **Behaviour and accessibility.** Interactivity is built on HeroUI or React Aria. Keyboard, focus and roles are not written by hand.
3. **Closed API.** No `className` and no `style`. The look comes from meaningful props: a variant picks the color and the icon, and the calling code makes no visual decisions. Names describe meaning, not value.
4. **States cannot be assembled wrong.** Incompatible prop combinations are ruled out by types.
5. **Values only from tokens.** Empty slots are not rendered. The default is the most common value.
6. **Server components.** Without hooks and event handlers a component stays a server component. With them, the first line needs `"use client"`.
7. **Export.** The component and its props type are exported from `packages/kit/src/index.ts`. The name must not shadow a HeroUI export: check it in advance, as happened with `EmptyState`.
8. **Test.** `packages/kit/tests`: markup, empty slots, branching on props.
9. **Demo.** `apps/playground/src/demos/<section>/<name>.tsx` with variants and states.
10. **Docs.** A line in the "Patterns" section of `packages/kit/README.md`. If a new decision appeared, an entry in `docs/design-system/decisions.md`.

Extraction rule: logic for a single block stays in its file as an internal function. A kit component appears when at least two blocks need it or it will clearly be useful in products.

In your answer, name the new component and why the existing ones were not enough.

## 6. Files

- Block: `apps/playground/src/blocks/<kind>/<name>.tsx`, a single export `export function <Name>Block()` and `<Name>Block.displayName = "English title"`: it becomes the tile caption. No registration needed, `import.meta.glob` picks the file up.
- The folder sets the kind of interaction and the gallery filter: `press` Press, `drag` Drag, `type` Type, `loading` Loading. A new kind is added as a folder and a label in `block-gallery.tsx`.
- Shared helpers and data live at the root of `blocks/`, for example `format.ts`.

## 7. Content

- Final copy in English. A button is a verb naming the result. A heading is up to seven words. Sentence case.
- Plausible data: English names, real amounts through `formatMoney`, dates and times through `Intl` with `en-US`, tabular figures. A non-breaking space between a number and its unit is fine.
- No lorem ipsum, "Test", "Item 1", made-up testimonials or "40% more" promises.
- Icons and images may come from the internet. Gravity Icons from `@anyglade/kit/icons` first, a direct URL for photos and pictures. Check the response with `curl` before using it; an avatar always has `Avatar.Fallback`, a meaningful picture has `alt`.
- Third-party logos only for their purpose, for example on sign-in buttons or payment methods. The product brand in a block is always its own.
- No dead ends: every state has a way forward.
- Everything interactive works: buttons, fields, switches, tabs, filters, sorting, pagination, export. A button without an action is a defect. If there is no real action, the block shows the result: a state, a toast, a file.
- Every column where order makes sense is sortable, by value rather than by label: a date sorts as a date. Use `SortableColumn` and `useTableSort`.
- Filters combine with search, reset the page, and an empty result offers a reset. Selected rows are counted only among the found ones.
- Empty, loading, error states and long values are handled where they really happen.

## 8. Motion

Before handing in, walk through every action and answer what happens between "pressed" and "done". Values and bans are in `docs/design-system/decisions.md`.

| What happens                                 | What to use                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| A button starts work                         | `onPress` returns a promise, forms use `action` and `type="submit"`. No custom spinners |
| A screen or list loads                       | `Loadable` with a skeleton of the same shape as the content                             |
| A reversible small action: a check, a switch | Apply immediately, no loader                                                            |
| Copying                                      | `CopyButton`, confirmation on the button itself                                         |
| Choosing one of several                      | `SegmentedControl`                                                                      |
| Reorder, filter, stage change, delete, add   | `withTransition` and `viewTransitionName` on the object                                 |
| Short text changed state: a status, a button | `TextSwap`, one line per action. Not for timers, tables and sentences                   |
| A new element appears on its own             | `<Box motion="enter">`                                                                  |
| Success after a form                         | `motion="enter"` on the new state and a way forward                                     |

Do not animate the main navigation, keyboard input, charts, a cascading page load, hover on cards or numbers when a screen opens. Blocks wait through `simulateRequest` from `apps/playground/src/simulate.ts`.

## 9. Check

A block is not ready until every item passes.

```bash
vp run ready
bash .claude/skills/block-reference/scripts/verify.sh 5170 Hero,Pricing
```

The script builds the playground, opens it in a headless browser at 1280 and 390 px and prints, per block, overflows, off-scale values and template indicator counters. Then it saves screenshots of the named blocks in both themes and on a phone and prints the paths.

1. No overflows and no off-scale values, except documented exceptions.
2. The indicator counters are justified. `borders`, `separators`, `tags`, `alpha` above zero need a reason.
3. Look at every screenshot with your own eyes: clipping, overlaps, gaps, dark theme contrast, line breaks.
4. Check the interactions. Headless does not play CSS transitions and may return an empty frame while scrolling; check such observations through `data-*` and without the transition.
5. Compare with the neighbouring blocks: does the main move repeat?
6. For a set of blocks, run a separate agent for an independent review of the screenshots: it must not know your decisions.

## 10. Handing in

A short answer: the mode, the idea, what changed in the kit, the check result and what remains unchecked. Commit only when asked.
