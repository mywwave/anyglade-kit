# @anyglade/kit

## 0.4.1

### Patch Changes

- 21fd5ab: Everything is in English now: the README is rewritten for the current kit, and the bundled design skill, the generated API and token references, the `anyglade-kit` CLI messages and the changelog are translated.

## 0.4.0

### Minor Changes

- da3b62b: New components: `Masonry` and `MasonryTile` for a gallery of tiles of different heights, `SlideToConfirm` for actions that must not happen on an accidental press, and `SignaturePad` for a handwritten signature. `Box` gained `columns` and `breakInside` for masonry.
- da3b62b: Links are no longer blue by default: their color follows the theme accent, and a thin underline sets a link apart. The `text-accent` token is now monochrome until an accent is set. The speaker ring in `MediaTile` follows it.
- da3b62b: `TextSwap` moves only the part of the text that changed: it slides up, the new part slides in from below, and the matching start and end stay still. The component no longer jerks on fast changes: the animation continues from its current position. With the `isShimmering` prop the whole line changes at once. The `FloatingPanel` title changes without animation: a title change there means another object.

### Patch Changes

- da3b62b: The `Accordion` row hover highlight got a radius and a gap from the divider. The row height did not change.

## 0.3.0

### Minor Changes

- 020424a: The design system rules now ship in the package. On install, or through `bunx @anyglade/kit init`, the project connects them for Claude Code, Codex, Cursor and other agents: the project gets only pointers, so the rules always match the installed version. Lint errors also point to these rules.

## 0.2.1

### Patch Changes

- c6f5f22: Releases are built and published automatically from GitHub Actions, without tokens.

## 0.2.0

### Minor Changes

- First public release. Tokens, layout, theme, motion and lint on HeroUI v3, the `ItemList`, `FloatingPanel` and `TreeNav` patterns, AI components, the `MediaStage`, `MediaTile` and `StreamVideo` call stage, `Draggable` drag and drop and the `PageLoader` page loader.
