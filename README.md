<img src="packages/kit/assets/logo.svg" alt="" width="96" />

# anyglade-kit

Monorepo of the `@anyglade/kit` UI kit on HeroUI v3, Tailwind CSS v4 and Vite+.

- `packages/kit` — the published package. Setup and API are in its [README](packages/kit/README.md).
- `apps/playground` — the showcase: components, a theme panel with CSS export, reference screens (CRM, messenger, call, assistant) and a gallery of blocks. Blocks live in `src/blocks`, grouped by interaction (`press`, `drag`, `type`, `loading`), and serve as examples to copy.
- The playground takes the kit from source, it does not need the `dist` build.
- `docs/design-system` — decisions, the Polar research and the accent audit.

## Development

```bash
bun install
vp run dev        # playground
vp run ready      # format, lint, types, tests, build
```

| Script      | What it does                                               |
| ----------- | ---------------------------------------------------------- |
| `ready`     | `vp check`, then tests and build in every workspace        |
| `dev`       | Starts the playground                                      |
| `changeset` | Records a change to the kit for the next release           |
| `release`   | Builds and publishes the kit to npm, then tags the release |

The pre-commit hook runs `vp staged` and checks that the design skill is in sync with the kit.

## New component

1. Create `packages/kit/src/<name>/<name>.tsx`.
2. Export it from `packages/kit/src/index.ts`.

Components and the playground are laid out with `Box` and `Text`. Values are set in `packages/kit/src/tokens.ts`, and `styles/tokens.css` and `styles/box.css` are generated with `bun run generate`.

To replace a HeroUI component with your own wrapper, export it under the same name: an explicit export takes precedence over `export *`.

Components with hooks or event handlers need the `"use client"` directive on the first line of the file. The build keeps the file structure, so the directive works in Next.js.

## Releases

Releases go through [changesets](https://github.com/changesets/changesets):

1. With a change to the kit, run `bun run changeset` and describe it. Commit the file from `.changeset` together with the change.
2. On every push to `master`, `.github/workflows/release.yml` runs `bun run ready` and the changesets action. While there are pending changesets, it opens or updates the "chore: release" pull request with the new version and changelog.
3. Merging that pull request publishes the version: `bun run release` runs `scripts/publish-kit.mjs`, which packs the kit with bun and publishes it with npm trusted publishing, without tokens, and then `changeset tag` tags the release.

`npm publish` does not work inside this repository: `devEngines` allows only bun, and only `bun pm pack` resolves `catalog:` versions.

## Agent skills

The skills in `.claude/skills` guide agents working in this repository:

- `anyglade-design-system` — the portable design system rules: laws, recipes and lessons for building any interface with the kit. It ships inside the package and is connected to consumer projects by `anyglade-kit init`.
- `block-reference` — how to create and review showcase blocks and reference screens in `apps/playground`.
- `design-system-sync` — keeps `anyglade-design-system` in step with the kit: regenerates the token and API references and reconciles the rules after changes. The `design-skill` test and the pre-commit hook fail when it is out of date.
