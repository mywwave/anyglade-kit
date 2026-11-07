# Components

Exact props are in [generated/api.md](generated/api.md), ready code for compound components in [recipes.md](recipes.md), token values in [generated/tokens.md](generated/tokens.md). This file covers choice and rules.

## Layout

**`Box`** is any container. It defaults to `display: flex`, except for `span`, `label`, `li`, `a`. The element is changed through `as`. `className` and `style` are closed off by the types: appearance is set only through props.

```tsx
<Box
  as="section"
  flexDirection={{ base: "column", md: "row" }}
  gap="m"
  padding={{ base: "l", md: "xl" }}
  backgroundColor={{ base: "background-card", hover: "background-secondary" }}
  borderRadius="l"
/>
```

Conditions inside a prop value: `base`, `sm`, `md`, `lg`, `xl`, `hover`, `focus`, `focusVisible`, `focusWithin`, `active`. Masonry comes from `columns` and `breakInside="avoid"`, but `Masonry` usually assembles it. Normal flow needs `display="block"`. `Box` has `motion`, `viewTransitionName`, `transitionProperty`.

**`Text`** is any text. The role is set by `variant`, the element by `as`, the color by `color`: `default`, `muted`, `subtle`, `disabled`, `inverse`, `accent`, `success`, `warning`, `danger`, `inherit`. A nested `Text` resets the size, so give it a `variant`. `Text` has no spacing; the parent `Box` sets it.

## What to choose

| Task                                                                       | Component                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page header                                                                | `PageHeader`                                                                                                                                                                                                                                                                 |
| Metric                                                                     | `Stat`                                                                                                                                                                                                                                                                       |
| A "label and value" row                                                    | `DetailRow`; an empty value shows "—". Put a `CopyButton` in `action`                                                                                                                                                                                                        |
| Product showcase on marketing                                              | `Frame` and `FrameTile`, no more than one per block                                                                                                                                                                                                                          |
| Empty state                                                                | `EmptyPanel`                                                                                                                                                                                                                                                                 |
| Copying                                                                    | `CopyButton`, confirmation right on the button                                                                                                                                                                                                                               |
| One of two to five short options                                           | `SegmentedControl`, the indicator morphs. More options or long labels: `Select`                                                                                                                                                                                              |
| Sortable table                                                             | `Table`, `SortableColumn`, `useTableSort`                                                                                                                                                                                                                                    |
| Loading a screen or list                                                   | `Loadable` and `Skeleton`                                                                                                                                                                                                                                                    |
| Work in progress, as text                                                  | `Shimmer`                                                                                                                                                                                                                                                                    |
| Short text changed state                                                   | `TextSwap`, conditions in [motion.md](motion.md)                                                                                                                                                                                                                             |
| Custom waiting indicator                                                   | `useLoadingIndicator`                                                                                                                                                                                                                                                        |
| Morphing objects                                                           | `withTransition` and `viewTransitionName`                                                                                                                                                                                                                                    |
| Modal question                                                             | `AlertDialog` for something dangerous, `Modal` for a short task                                                                                                                                                                                                              |
| Details panel                                                              | `Drawer`, `Sheet` on the phone                                                                                                                                                                                                                                               |
| Information needed nearby while working with the page                      | `FloatingPanel`: a popover at a button that can be pinned and dragged. It closes by itself until pinned. Without `triggerRef` the panel stands on screen right away and several can be kept open; `resize` adds resizing                                                     |
| Navigation through nested objects                                          | `TreeNav`: groups, status on the right, the selected item. Show people as avatars                                                                                                                                                                                            |
| A list whose rows open an object and have their own buttons                | `ItemList`. Nested buttons are not allowed in `ListBox`. The `menu` option gives a row context menu                                                                                                                                                                          |
| Launching the whole app, the shape of the future screen is unknown         | `PageLoader`: a logo with a slow glint, a thin bar and a status line. For a screen inside the app, use `Skeleton`                                                                                                                                                            |
| Tiles of people and screens in a call                                      | `MediaStage` lays them out, `MediaTile` shows one, `StreamVideo` outputs a live stream                                                                                                                                                                                       |
| Moving between groups of rows                                              | `Draggable` inside a row and the `drop` prop on `ItemList`. The same action must also be in the menu                                                                                                                                                                         |
| A gallery of objects of different heights: showcase, collection, portfolio | `Masonry` and `MasonryTile`. Columns fill top to bottom, so reading order goes down a column. Put data with uniform rows in a grid, not in masonry                                                                                                                           |
| An irreversible action that must not happen by accident                    | `SlideToConfirm`: a money transfer, permanent deletion, especially on the phone where it is easy to miss. The gesture to the end of the track is the confirmation; the keyboard confirms with Enter. An ordinary dangerous action with a question goes through `AlertDialog` |
| Handwritten signature                                                      | `SignaturePad`. The ink takes the text color and follows the theme, but a saved PNG no longer changes with the theme                                                                                                                                                         |
| Action menu                                                                | `Dropdown`                                                                                                                                                                                                                                                                   |
| Choosing from a list                                                       | `Select`, with search `ComboBox`, a short set `SegmentedControl` or `RadioGroup`                                                                                                                                                                                             |
| Hint                                                                       | `Tooltip`, only as a supplement; do not hide anything important                                                                                                                                                                                                              |
| How much new stuff awaits the person: unread, a queue                      | `CountBadge`. A monochrome counter, neither status nor accent                                                                                                                                                                                                                |
| Result of an action                                                        | `toast`, if the result is not visible on screen                                                                                                                                                                                                                              |
| Chart                                                                      | `LineChart`, `AreaChart`, `BarChart`, `DonutChart`, `Sparkline`                                                                                                                                                                                                              |
| Icon                                                                       | Gravity UI Icons from `@anyglade/kit/icons`                                                                                                                                                                                                                                  |

All of HeroUI is available from `@anyglade/kit`: `Accordion`, `Alert`, `Autocomplete`, `Avatar`, `Calendar`, `Checkbox`, `DatePicker`, `Disclosure`, `Form`, `Input`, `InputOTP`, `Link`, `ListBox`, `Meter`, `NumberField`, `Pagination`, `Popover`, `ProgressBar`, `Radio`, `ScrollShadow`, `SearchField`, `Separator`, `Slider`, `Spinner`, `Switch`, `Tabs`, `TagGroup`, `TextArea`, `TextField`, `ToggleButton`, `Toolbar` and others.

## Button

The kit's `Button` replaces the HeroUI button and shows the loader by itself. Do not add your own spinners next to the button.

```tsx
<Button onPress={save}>Save</Button>            // onPress returned a promise
<form action={save}><Button type="submit">Save</Button></form>
<Button isPending={isSaving} type="submit">Save</Button>
```

The button stops accepting presses immediately, the loader appears after `timings.loaderDelay`, stays for at least `timings.loaderMinimum`, and the width does not change.

`action` suits only forms without controlled fields. React resets the form after `action`, and `TextField` rolls its value back to the initial one. For controlled fields use `onSubmit` with `useTransition` and pass `isPending`.

Hierarchy: one `primary` per screen, `secondary` for ordinary actions, `ghost` for quiet and inline ones, `danger` and `danger-soft` for dangerous ones. `primary` is the default, so set the variant explicitly on secondary buttons. An icon-only button gets `isIconOnly` and `aria-label`.

## Tables

Sorting takes two steps: `SortableColumn` in the header and `tableProps` from `useTableSort` on `Table.Content`. A row opens details through `onRowAction`, see [recipes.md](recipes.md).

```tsx
const accessors: SortAccessors<Order> = {
  amount: (order) => order.amount,
  date: (order) => order.createdAt,
};

const { sorted, tableProps } = useTableSort(filtered, accessors, {
  column: "date",
  direction: "descending",
});
```

Keep the accessors object outside the component. Sorting goes by value, not by label: "Nov 2" and "Yesterday" are compared as dates. Give rows `style={{ viewTransitionName: \`order-${id}\` }}`and they morph when sorted. Status is colored text, not a`Chip`. Wrap the table in `Table.ScrollContainer`and set`min-w-*`, otherwise it breaks the page on the phone. The row selection type is `Selection`, the sort type is `SortDescriptor`.

Column types give all tables one look:

| Data                 | Alignment                 | Look                   |
| -------------------- | ------------------------- | ---------------------- |
| Object: name, avatar | Left                      | Main color             |
| Text                 | Left, takes the remainder | `muted`, truncated     |
| Number, money        | Right                     | `tabularNums`          |
| Date                 | Left                      | `muted`, `tabularNums` |
| Status               | Left                      | Colored text           |
| Actions              | Right                     | `ghost`, icons         |

The same data has the same width in every table. A row ends with money or an action, not with text. A row opens details; rare actions go in a menu. Abbreviations in headers are banned.

## Charts

Monochrome, no more than three series, no grid and no axis lines, values in the tooltip. A chart belongs only if it answers a question the person asks this screen: a decorative chart and a single-point chart are not needed. The more detailed the diagram, the worse: if the point can be expressed as a number or a sentence, no chart is needed. `isAnimationActive` is turned off on charts on purpose: this is data for reading.

## Images and icons

An icon goes not on every label, but where it speeds up reading. Real pictures are better than placeholders. Other companies' logos only for their intended purpose.

## A new component

If the idea cannot be assembled from what exists, create a component. Workarounds are worse: complex layout inside a page, copy-paste between screens, styles that bypass tokens.

First check, in order: HeroUI components, kit patterns, a change through a token. Then:

1. Assemble from `Box`, `Text` and kit components.
2. Take behavior and accessibility from HeroUI or React Aria. Do not hand-write keyboard handling, focus and roles.
3. Closed API: no `className` and `style`, appearance is set by semantic props. The calling code makes no visual decisions.
4. Incompatible states are ruled out by types.
5. Values only from tokens. Empty slots are not rendered. The default value is the most common one.
6. Names by meaning, not by look: `tone="danger"`, not `red`.
7. Without hooks the component stays a server component.

Logic for a single screen stays in its file. A shared component appears when at least two screens need it.
