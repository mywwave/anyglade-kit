# Layout and composition

Scale values are in [generated/tokens.md](generated/tokens.md).

The width limit applies to content, not to the app panel. A panel that already occupies its place in the layout is filled entirely: a column inside it leaves empty margins on both sides on a wide screen. Check the shell on a wide window too, from 1920 px.

## Spacing rhythm

Proximity is grouping. People understand what belongs together by distance, so lines are usually unnecessary.

| Relationship                                     | Step                |
| ------------------------------------------------ | ------------------- |
| Inside a control: icon and label                 | `2xs`, `xs`         |
| Inside a unit: label and value, heading and text | `xs`, `s`           |
| Related elements: form fields, list rows         | `m`, `l`            |
| Groups inside a section                          | `xl`, `2xl`         |
| Screen sections                                  | `2xl`, `3xl`        |
| Landing page sections                            | `3xl`, `4xl`, `5xl` |

Outer spacing is always larger than inner spacing, otherwise the group falls apart. The space above a heading is larger than below it: a heading belongs to what follows. Dense lists: rows of one height, step `xs`. A 60 px step on a 21 px row turns a list into scattered pieces.

## Width

Content does not stretch across the whole available area.

| Content                       | Width                                         |
| ----------------------------- | --------------------------------------------- |
| Form, sign-in, checkout       | `tokens.widths.form`                          |
| Reading, settings, chat       | `tokens.widths.content`                       |
| Mixed content                 | `tokens.widths.wide`                          |
| Tables, dashboards, marketing | Full width with a sensible limit, around 1180 |

A field wider than 480 px is almost always a mistake: the length of a field hints at the length of the answer. `NumberField` and `InputOTP` keep their width to their content.

```tsx
<Box width="100%" maxWidth={tokens.widths.content} marginHorizontal="auto" padding={{ base: "l", md: "2xl" }}>
```

## App shell

- Header: `position="sticky"`, `top={0}`, canvas background, `zIndex`. About 48 px.
- Sidebar: 224 px, a `Drawer` on the phone, opened by a button with `aria-label`.
- Content: a `background-panel` panel on the `background-canvas` canvas, `borderRadius="l"`, padding `l` on the phone and `2xl` on desktop.
- Navigation: the active item is `secondary`, the rest are `ghost`, the active one is marked with `aria-current="page"`.

The whole page scrolls, not individual columns. Inner scrolling appears only if the area has its own meaning: a table, code, a list in a panel. Otherwise a scrollbar in the middle of the screen looks like a bug and shifts the width when it appears.

A scrolling page reserves room for the scrollbar with `scrollbar-gutter: stable`, otherwise the content shifts as soon as the text stops fitting. If a sticky footer has spacing below it, the footer will slide by that amount when it docks, so there must be no spacing below it.

## Grids

Columns always use `minmax(0, 1fr)`, otherwise long content pushes the column wider.

```tsx
<Box
  display="grid"
  gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 2fr) minmax(0, 1fr)" }}
  gap="2xl"
/>
```

- Prefer asymmetry: 1:2, 2:3, 5:7. Equal columns usually mean no decision was made.
- A row of fields: `repeat(2, minmax(0, 1fr))`.
- Elements inside flex get `minWidth={0}`, otherwise `truncate` will not work.

## Surfaces

Depth comes from surface contrast, not from shadows and borders. Canvas, panel, card. One level of nesting: a card on a panel is fine, a card in a card is not. Borders only on input fields and collection items.

Concentric radii: the outer radius equals the inner one plus the padding. Otherwise the corners look foreign.

## Responsiveness

Values are given as an object: `padding={{ base: "l", md: "2xl" }}`. The base value is for the phone.

- At 390 px there is no horizontal page scroll.
- An action row wraps or becomes a column.
- A table scrolls in its own container.
- Hover does not exist on the phone: hide nothing important behind it.
- Text lines sit on whole pixels. A height made up of an extra inline box produces fractional coordinates, and the letters shimmer.

## Composition

Treat the first option that comes to mind as a template. For a prominent screen, come up with three concepts with different moves and pick the one with the strongest idea. An idea is bad if it could be applied to any product.

Moves:

- **Product instead of illustration.** A real working piece of the interface on real data.
- **Scale as hierarchy.** One number or phrase at a huge size, everything else subordinate.
- **Density contrast.** Lots of air next to a dense block of data.
- **Asymmetry.** An offset axis instead of centering.
- **Inversion.** One area on `background-inverse` as the screen's only accent.
- **Two-tone heading.** The statement in the main color, the explanation in `muted`, in one flow.
- **Tabular typography.** Numbers and the monospace font build the composition instead of decoration.
- **End-to-end interaction.** A slider or toggle changes the whole block.
- **A slice instead of the whole.** One live moment: the charge went through, the status changed.
- **Text as interface.** A strong statement instead of benefit cards.

Banned starting compositions: a centered heading above three identical cards, an "icon, heading, text" grid, a hero with a heading on the left and a picture on the right with no idea.

## Browser surfaces

What you did not draw is still part of the design: text selection, the caret, scrollbars, the focus ring, link underlines, field autofill. Check them in both themes instead of leaving the browser defaults.

## Signs of template design

Each of them requires removal or a concrete answer about what information it carries.

| Sign                          | Instead                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Tags                          | `Chip` and `Badge` only for a rare state that requires action. No eyebrows above headings and no "New" pills |
| Italics                       | Emphasis comes from wording or `muted` contrast                                                              |
| Serif and negative tracking   | Only Inter and Geist Mono, tracking from tokens                                                              |
| Overloaded UI                 | Only what is needed for the decision on this screen, the rest behind an action                               |
| Dividers                      | Structure comes from `gap`, size and weight. `Separator` only between groups of a different nature           |
| A zoo of shades               | Three text levels, surfaces from tokens, `opacity` for color is banned                                       |
| Bordered containers           | One surface level                                                                                            |
| Charts for the sake of charts | One line, no axes and no legend, if the point can be expressed as a number                                   |
| Code breadcrumbs              | No file paths and no monospace caps as decoration                                                            |
| The big-number template       | A big number, a caption, a row of small metrics and an accent as structure with no idea                      |
| Gradients and glass           | Gradient text, blur as decoration. Importance comes from size and weight                                     |
| A colored side stripe         | A stripe on the left of cards and notifications. The text carries the meaning                                |
| Emoji instead of icons        | Icons from one set                                                                                           |
| Border together with shadow   | Depth is set one way                                                                                         |
| An unnecessary modal          | A modal for a task that does not require interruption                                                        |
| Section numbering             | Numbers only on a real sequence of actions                                                                   |
