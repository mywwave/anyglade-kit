# Contributing to @anyglade/kit

Thanks for helping. This guide covers setup, the rules every change follows, and how a change reaches npm.

## Setup

You need [Bun](https://bun.sh) 1.4 or newer and Node.js 24.

```bash
git clone https://github.com/mywwave/anyglade-kit.git
cd anyglade-kit
bun install
bun run dev        # playground at http://localhost:5173
```

The package lives in `packages/kit`. The playground in `apps/playground` shows every component, the blocks gallery and reference apps. The live playground is published at https://mywwave.github.io/anyglade-kit/.

## Before you open a pull request

```bash
bun run ready      # lint, types, format, tests and builds
```

CI runs the same command, and a pull request cannot be merged while it fails.

## Rules for every change

- **Build interfaces only from the kit.** Layout through `Box`, text through `Text`, values only from tokens. The shipped oxlint rules enforce most of it.
- **Follow the design skill.** `.claude/skills/anyglade-design-system` holds the laws, reasons and lessons of the system. Read its `SKILL.md` before touching UI. Blocks follow `.claude/skills/block-reference`.
- **Keep the skill in sync.** After any change to the kit (tokens, components, props, styles, lint, README, decisions), run:

  ```bash
  node .claude/skills/design-system-sync/scripts/sync.mjs
  ```

  Move the meaning of your change into the skill, then accept it with `--accept`. The `design-skill` test and the pre-commit hook fail while the skill is out of date.

- **New component.** Closed API (no `className` or `style`), behaviour and accessibility from HeroUI or React Aria, a test in `packages/kit/tests`, a demo in `apps/playground/src/demos`, a line in the README patterns list. See the skill's `references/components.md`.
- **Write in English.** Code, comments, docs and playground copy.

## Changesets and releases

Every change to the published package needs a changeset:

```bash
bun run changeset
```

Pick `patch` for fixes, `minor` for new features and `major` for breaking changes, and describe the change for people who use the kit. Playground-only changes need no changeset.

When changes land on `master`, the release workflow opens a "chore: release" pull request that bumps the version and the changelog. Merging it publishes the package to npm through trusted publishing; no tokens live in the repository.

## Commits and pull requests

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, `chore:`.
- Keep a pull request focused on one change. Describe what changed and why, and attach screenshots in light and dark theme for anything visual.
- Check the result at 390 px width and with reduced motion.

## Reporting bugs and security issues

Open an issue with the bug template. For security problems do not open a public issue: follow [SECURITY.md](SECURITY.md).

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE) and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).
