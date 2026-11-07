# Phone

The phone is any width below the `md` breakpoint. Values below it are written as `base`, from it as `md`. An intermediate boundary at 640 px creates a zone where the desktop layout lands on a narrow screen.

A drag handle gets `touch-action: none`, otherwise the browser takes the gesture for scrolling. On the phone `FloatingPanel` keeps working, but the screen is narrow: for persistent details `Sheet` is better.

## Scrolling and layers

- On the phone the document scrolls, not an inner container. Otherwise the address bar collapse, tap-to-top and sticky positioning break.
- Ancestors of sticky elements have no `overflow: hidden` or `auto`: they cancel `position: sticky`. If you need to clip content, use `overflow: clip`.
- Do not give a page with document scrolling a height of `100dvh`; set `minHeight`.
- A horizontally scrolling row inside a column gets `flexShrink={0}`, otherwise it collapses into a strip and clips its content.

## Shell

- The sidebar becomes a `Drawer` opened by a button with `aria-label`.
- The main action stays in the title row. Secondary actions go into a menu instead of lining up next to it.
- A screen with its own bottom bar, for example a form or a selection mode, hides the other bottom bars.
- A table scrolls in its own container, but on the phone a list of rows is often better: the main value, a label, a way to the details.

## Sheets instead of popovers

On the phone a bottom panel is more convenient than a popup: it is near the thumb and does not cover the context.

- Details and selection: `Sheet` or `Drawer`.
- A menu of several actions: an action sheet.
- A long selection: a sheet with search.
- A sheet opened over a modal accepts taps and input. Check it: open, scroll, type, close, and the modal beneath is still alive.
- The end of a long list in a sheet is reachable at any height.
- Focus moves into the sheet and returns to its place on close.

## Touch

- A touch target is at least 44 px. A small control may look smaller, but its hit area stays 44.
- Hover only under `(hover: hover) and (pointer: fine)`. Press feedback is `:active`.
- Nothing opens on hover alone.
- Important actions do not hide behind a swipe or long press: those are shortcuts and must have a visible alternative.
- Dragging is a shortcut too. Every move has a menu item, otherwise the action is unavailable on touch and with the keyboard.
- `prefers-reduced-motion` removes animation, but not gestures: swipe and long press keep working.
- A row of chips or tabs with a hidden scrollbar must also scroll with the mouse wheel: a narrow desktop browser window is a "phone" too.

## Fields

- The right `inputMode` and `autoComplete` give the right keyboard and autofill.
- The keyboard does not cover the field, and the submit button is reachable.
- A full-screen form is better than a modal if there are more than three fields.
- Fields and buttons do not shrink: a button spans the block width, within reason.

## Verification

1. 390×844 and 360×780 in the light and dark themes, with touch emulation.
2. Separately, a narrow desktop browser window of about 400 px, with a mouse and visible scrollbars. Different defects show up there.
3. `prefers-reduced-motion` mode for screens with gestures.
4. Sheets over modals.
5. The wide screen has not changed, and there is no horizontal page scroll.

Emulation does not prove the feel of flings, keyboard behavior, screen notches or iOS momentum. Say exactly that in the report instead of claiming it was checked.
