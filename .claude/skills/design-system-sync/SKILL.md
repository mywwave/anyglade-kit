---
name: design-system-sync
description: Keeps the anyglade-design-system skill up to date. Use ALWAYS after any change in the kit (tokens, components, props, styles, lint, README, decisions), after every user correction to look, animation or UX, however small, and when the design-skill test fails or pre-commit reports that the skill is outdated. Also on requests like "update the design system skill", "sync the rules", "remember this as a design rule", "check the skill is up to date", «обнови скилл дизайн-системы», «синхронизируй правила», «запомни это как правило дизайна», «проверь, что скилл актуален».
---

# Design system skill sync

`anyglade-design-system` is copied into other projects, and there it is the only source of knowledge about the kit. Nobody will notice an outdated rule in someone else's project, so its accuracy is checked by code, not by memory.

What lives where:

- `references/generated/tokens.md` and `api.md` are generated from code. Never edit them by hand.
- `references/generated/sources.json` stores fingerprints of the files the rules were reconciled against.
- Everything else in the skill is written by hand: laws, reasons, lessons.

## Steps

### 1. Run the script

```bash
node .claude/skills/design-system-sync/scripts/sync.mjs
```

It regenerates the tokens and API and prints what needs attention:

| Message                             | What to do                                                   |
| ----------------------------------- | ------------------------------------------------------------ |
| `Not reconciled with the rules: X`  | Read `git diff` of file X, then step 2                       |
| `Missing from the skill rules: X`   | Describe the new component in the matching reference         |
| `Path of this repository`           | Remove the path: the skill must work outside this repository |
| `SKILL.md is longer than 500 lines` | Move details into `references/`                              |

### 2. Carry over the meaning

Tokens update themselves. The handwritten part is updated only by the meaning of the change:

| What changed                       | Where to write it                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| New component or pattern           | `references/components.md` or `ai.md`; a composite component also in `references/recipes.md` |
| Color, accent, contrast            | `references/color.md`                                                                        |
| Spacing, widths, grid, composition | `references/layout.md`                                                                       |
| Font, numbers                      | `references/typography.md`                                                                   |
| Interface copy                     | `references/writing.md`, stop words in `scripts/check-copy.mjs`                              |
| Phone                              | `references/mobile.md`                                                                       |
| Structure of typical screens       | `references/archetypes.md`                                                                   |
| What to check in an audit          | `references/audit.md`                                                                        |
| Animation, loaders, performance    | `references/motion.md`                                                                       |
| States, forms, tables, flows       | `references/ux-flows.md`                                                                     |
| Installation, theme, lint          | `references/setup.md`                                                                        |
| User correction                    | `references/lessons.md` and step 3                                                           |

Delete rules that are no longer true. An outdated line is worse than a missing one.

### 3. Generalize the user's correction

Every correction to look or behavior is a rule that must never be needed a second time. Write the pattern, not the case:

- Bad: "Removed the bold heading from the step in the chat."
- Good: "Show nesting with indentation. A second header inside a group turns the list into a staircase of blocks."

An entry in `lessons.md` has three parts: what was wrong, why, how to do it. If the lesson applies to every screen, promote it to a law in `SKILL.md`. If the decision is system-wide, add it to the kit decisions as well.

The reason is mandatory. A model in another project will meet a case that never came up here, and it will solve it by the reason, not by the letter.

### 4. Record the reconciliation

```bash
node .claude/skills/design-system-sync/scripts/sync.mjs --accept
```

The flag means "I have read the changes and carried over their meaning". Do not run it just to silence the message: then the safeguard stops meaning anything.

### 5. Verify

```bash
node .claude/skills/design-system-sync/scripts/sync.mjs --check
```

A clean exit means you can commit. The same check runs in the `design-skill` test and in pre-commit.

## How to write rules

- No paths of this repository: the skill is copied whole into another project.
- In English, imperative, with a reason.
- Do not duplicate values: a token reference survives a scale change, a number goes stale.
- Pair every prohibition with what to do instead.
- Keep `SKILL.md` short, details in `references/`.

In your reply to the user, say in one line which rules were added.
