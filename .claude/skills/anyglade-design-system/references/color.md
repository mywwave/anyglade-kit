# Color and contrast

The palette is in [generated/tokens.md](generated/tokens.md). Color is set only through tokens; the dark theme works by itself through `light-dark()`. `dark:` and ad-hoc colors are banned: they break the second theme.

The current item in a list or navigation is highlighted with the `--default` layer, the same one as an active button. A pressed `ToggleButton` is highlighted the same way: it is a selection, not an accent, and its background is opaque. `background-card` on `background-canvas` blends into the background in the light theme.

## Foundation

The interface is monochrome. Color is information: the less of it, the stronger each appearance. Blue serves focus and links; status colors appear only with meaning.

Surfaces from far to near: `background-canvas`, `background-panel`, `background-card`. `secondary` buttons and neutral fills are one step darker than the card, otherwise they are invisible on cards in the light theme.

Three text levels: `text-primary`, `text-secondary`, `text-tertiary`. A fourth shade is almost always a sign that the hierarchy is unresolved. Color through `opacity` is banned: on another surface it becomes a different color.

## Accent

The accent answers two questions: what is the main action here, and what is on right now. Everything else is monochrome. Without a set color, the main text color serves as the accent, and that is a complete theme.

- **One primary button per screen or block.** If there is no main action, there is no primary button either.
- **The on state of a control.** Checkbox, radio, switch and slider color themselves. Selection in navigation, filters and tables is neutral.
- **Links follow the accent.** By default the accent is monochrome, so links are monochrome too, distinguished by a thin underline. When a brand accent is set, the link takes its hue at 4.5:1 contrast, and so does the underline. There is no separate blue for links.
- **Accent text only on links.** Headings, numbers, amounts and icons are not colored with the accent. Importance comes from size and wording.
- **No accent fills on surfaces or borders.** A strong area is made with `background-inverse`. Accent fills take up less than 10% of a block's area.
- **One series per chart.** The main series gets the accent, the rest are neutral. Sparklines are always neutral: otherwise a screen without buttons becomes the most colorful one in the product.

The accent color is calm: acid hues hurt the eyes and compete with the data. A good starting point is OKLCH with lightness around 0.74 and chroma around 0.1. Color sets are built systematically: evenly around the hue wheel, one per family, at one lightness. Picking them one by one gives a skew, for example four shades of blue.

## Statuses

| Meaning | Token     | When                                                                   |
| ------- | --------- | ---------------------------------------------------------------------- |
| Success | `success` | It ended well and that matters. An ordinary success can stay uncolored |
| Warning | `warning` | Needs attention, but nothing is broken                                 |
| Error   | `danger`  | Broken or dangerous                                                    |

Labels are categories, not statuses, so they have their own hues: `text-label-blue`, `text-label-violet`, `text-label-teal`, `text-label-pink`. Only the label's marker is colored; the text stays neutral. A status color on a label reads as an alarm or a success that is not there.

In a call, a muted microphone and muted sound get `danger-soft`: the person is talking and nobody hears them, which must not be missed. A turned-off camera stays neutral, it is a normal state. Screen sharing and a raised hand are on, so they get the accent. The speaker ring is the accent too: it is the only "on right now" signal on the tile.

Status is not accent. The accent must not read as a status: the `success` hue, amber, red and the saturated orange between them do not work for it. Mint and muted clay work, because they are softer and do not match in hue.

Color is not the only signal: an error is visible from the text or an icon, an on state from the check mark and position. Otherwise the interface loses its meaning for color-blind people.

## Contrast

WCAG AA requirements:

| What                                           | Minimum                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| Normal text                                    | 4.5:1                                                 |
| Large text, from 24 px or 19 px bold           | 3:1                                                   |
| Controls, chart lines, focus, meaningful icons | 3:1                                                   |
| Disabled elements                              | No requirement, but the element must read as disabled |

Compute contrast on the theme's worst surface, not the main one: a color that passes on white fails on the gray canvas.

The label on a colored fill is chosen by higher contrast with the fill, not by a luminance threshold. A threshold gives white text where black reads almost twice as well.

One color does not work in both themes. Text and line colors are set as a `light-dark(...)` pair, shifted exactly enough to pass the requirement. A button keeps the exact brand color: its legibility comes from the label, not from contrast with the background. Unlabeled controls on a fill use the adjusted tone `--ag-accent-control`.

There is an upper limit too. Pure white on near-black gives 20:1 and is tiring to read, so the main text of the dark theme is dimmed to about 15:1. Do not bring back pure white: not for text, not for inverse surfaces, not for the main chart line.

## Dark theme

- Depth comes from lighter surfaces; shadows barely work there.
- Check the controls: the border of a checkbox and radio must be legible.
- Colored values in the dark theme are usually lighter and less saturated.
- Light and dark are equal. If a screen was checked only in one, it was not checked.
