# Setting up the kit

Requirements: React 19+, Tailwind CSS 4+.

```bash
bun add @anyglade/kit
```

HeroUI and React Aria are installed together with the package; no Provider is needed. Full documentation is in `node_modules/@anyglade/kit/README.md`.

So that the project's agents know these rules, run `bunx @anyglade/kit init`. The command puts links to the rules from the package into the project, so they update together with it.

## Styles

In the main CSS file, strictly in this order:

```css
@import "tailwindcss";
@import "@anyglade/kit/styles.css";
```

The order matters: the kit replaces Tailwind's text scale, weights and tracking, so utilities and HeroUI components follow the same scale.

## Entries

| Import                 | What it provides                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `@anyglade/kit`        | All HeroUI components, `Box`, `Text`, kit patterns, `tokens`                                         |
| `@anyglade/kit/icons`  | Gravity UI Icons. A separate entry because the names `Link`, `Calendar`, `Tag` clash with components |
| `@anyglade/kit/charts` | Charts. Separate so that Recharts does not end up in the bundle needlessly                           |
| `@anyglade/kit/ai`     | Agent interface                                                                                      |

Never import directly from `@heroui/react`: then the kit replacements do not apply, for example `Button` with a built-in loader. Import the `Box` icon as `Box as BoxIcon`.

## Lint

The rules are published together with the kit and keep the project within the system. Connect them right away, in `vite.config.ts` for Vite+ or in the oxlint config:

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

## Theme

By default the theme follows the OS setting and works without JavaScript through `light-dark()`. You can pin it on `<html>`:

```html
<html class="dark" data-theme="dark"></html>
```

A user-facing switch is `useTheme()`. Both themes are equal; check every screen in both.

## Brand

Settings are set with CSS variables after the kit import. The easiest way to get ready CSS is the "Theme" panel of the kit showcase: it derives readable values from a single color by itself.

- Accent: `--accent`, `--accent-foreground`, `--ag-accent-control`, `--ag-accent-control-foreground`, `--focus`, `--link`, `--ag-text-accent`, `--ag-chart-primary`. Rules in [color.md](color.md).
- Button shape: `--ag-button-radius`.
- Density: `--spacing` and `--ag-space-*`.
- Font: `@theme { --font-sans: "Your Font", sans-serif; }`. Inter and Geist Mono by default; they are served by the app, with no external requests.

## Server components

`Box` and `Text` work in server components and do not inject styles during render. Components with behavior are marked `"use client"`.
