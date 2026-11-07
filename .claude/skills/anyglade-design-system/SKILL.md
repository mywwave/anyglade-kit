---
name: anyglade-design-system
description: The @anyglade/kit design system. Use it ALWAYS when a project creates or changes any interface: a page, screen, form, table, dashboard, landing page, checkout, chat, AI interface, component, layout, spacing, typography, color, contrast, dark theme, animation, loader, skeleton, empty state or user flow. Also on requests like "make it look good", "fix the design", "why does it look off", "add an animation", "build the layout", "redesign", "UI", "UX", even when the kit is not mentioned, and on the Russian phrasings «сделай красиво», «поправь дизайн», «почему выглядит криво», «добавь анимацию», «сверстай». Contains the laws, ready-made solutions and lessons from real fixes: how to build interfaces only through the kit.
---

# The @anyglade/kit design system

Interfaces in this project are built only from `@anyglade/kit`. The kit is built on HeroUI v3 and defines the tokens, layout, theme, motion and lint. The aesthetic: monochrome, precision, density, calm. The reference point is Polar: design by subtraction, every element derived from meaning, precision as respect for the person.

If the package is not yet a dependency, start with [references/setup.md](references/setup.md).

## Laws

Breaking any of them is almost always visible at a glance. Reasons and details are in the references.

1. **Kit only.** Layout through `Box`, text through `Text`, imports only from `@anyglade/kit`, `/icons`, `/charts`, `/ai`. Raw `div` and `p`, Tailwind spacing and typography utilities, `dark:` and arbitrary values are banned by the lint: they break the single scale and the theme. The only exception: HeroUI components get their size through `className`, for example `h-10 w-full` on `Skeleton`.
2. **Tokens only.** If the value you need is not on the scale, the decision is wrong. Scales are in [references/generated/tokens.md](references/generated/tokens.md).
3. **Every pixel pays for its place.** If you remove an element and the person loses nothing, it was clutter. Structure comes from spacing, size and weight, not from borders, lines and plates.
4. **Content has its own width.** Forms, text and settings do not stretch across the screen: `tokens.widths`.
5. **One surface level.** No cards inside cards. Borders only on fields and collection items.
6. **Status is text, not a tag.** A status is a word in its role color. A badge is only for a rare state that requires action.
7. **Accent means "the main action" or "on".** One primary button per screen. Accent means nothing else.
8. **Motion explains change.** The more frequent the action, the less motion. Only `opacity` and `transform`.
9. **Nothing jumps.** A loader does not change width, rows keep their height, new content does not jerk the page.
10. **Everything works.** Every button, filter and sort does real work. No placeholder buttons and no dead ends: every state has a way forward.

## How to build a screen

### 1. Understand the task

In one sentence: who is looking, what decision they make, what they do next. The main action follows from this. If you cannot name it, the screen has no primary button.

Decide the character of the surface:

- **Work surface** (dashboard, settings, table, checkout, chat): boldness is expressed through precision, density and reading speed. Showiness gets in the way.
- **Persuasion surface** (marketing, sign-in, pricing, showcase): it needs one strong idea and bold scale. Composition moves are in [references/layout.md](references/layout.md); the craft level, object and gesture are in [references/craft.md](references/craft.md).

### 2. Pick the archetype and components

Almost any work screen is one of seven types with its own structure: [references/archetypes.md](references/archetypes.md).

Open [references/components.md](references/components.md). First look for a ready-made solution in the kit, then assemble from `Box`, `Text` and HeroUI, and only then create your own by the rules in the same file. Exact props are in [references/generated/api.md](references/generated/api.md). For an interface with an agent, read [references/ai.md](references/ai.md).

### 3. Lay out the states

Before building the main state, list the others: loading, empty, error, nothing found, success, long values, no permission. Write the flow as a chain: before, action, waiting, result, way forward. Add life: retry, interruption, an event on top of an event, a dangerous action in two steps. Flows are in [references/ux-flows.md](references/ux-flows.md) and [references/craft.md](references/craft.md).

### 4. Assemble

- Layout, widths and composition: [references/layout.md](references/layout.md).
- Type, numbers and copy: [references/typography.md](references/typography.md).
- Color, accent and contrast: [references/color.md](references/color.md).

### 5. Add motion

Go through every action and answer what happens between "pressed" and "done". The decision table and bans are in [references/motion.md](references/motion.md).

### 6. Check the craft level

Describe the result in one sentence. "Press the button and X appears" means Template: such a result is not handed in. The check questions are in [references/craft.md](references/craft.md).

### 7. Check against the lessons

[references/lessons.md](references/lessons.md) holds real fixes. Skim it before handing in: these mistakes have already been made and look natural until someone points them out.

## Edit modes

When asked to improve an existing screen, first determine the mode. It sets the boundaries of the work.

| Request                     | What to do                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| "Simplify", "too cluttered" | Remove repetition, extra options, decoration. Everything else goes behind an action                                                             |
| "Too loud"                  | Less color, flat surfaces, less motion. Precision matters more than softening                                                                   |
| "Boring", "bolder"          | Strengthen one named part per [craft.md](references/craft.md): the object, details from data, the gesture. Leave neighbors and the system alone |
| "Check the edges"           | Long values, empty, error, network, permissions. See [ux-flows.md](references/ux-flows.md)                                                      |
| "Polish"                    | Only deviations from the system. If the idea is wrong, say so instead of hiding a redesign in the edits                                         |
| "Confusing"                 | Rewrite the copy along the person's whole path, not individual lines                                                                            |
| "Check the project"         | Audit per [audit.md](references/audit.md)                                                                                                       |

## Red flags

Stop and redo it if you see:

- two primary buttons, or text in the accent color "for looks";
- a value outside the tokens, a color with opacity, `dark:`;
- a badge on a normal state, a tag you cannot click;
- an unclear term without explanation, or a hint on an obvious word;
- a subtitle that repeats the title;
- "No data", "Error", "OK" in the interface;
- a list that grows without limit;
- two rolling lines from one action, a rolling timer, table or sentence;
- a screen checked in only one theme or without a phone.

## Excuses and answers

| Excuse                                            | Answer                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| A border is needed here to separate things        | Separate with a surface or spacing                                              |
| It's an internal screen, it'll do                 | The rules are the same for every screen                                         |
| The token I need is missing, I'll use a close one | Then the decision is wrong. A new value is added to the system, not on the spot |
| It's faster to make my own component              | Assemble from existing ones, see [components.md](references/components.md)      |
| It looks empty without a subtitle                 | Rewrite the title so it says what is inside                                     |
| The animation looks nice here                     | Name what it explains. If you can't, it isn't needed                            |
| I'll fix it later, the logic matters more now     | Empty states and errors are the logic                                           |
| The test passed, so it works                      | The test does not see how it looks. Open the screen                             |

## Verification

The interface is not done until every item passes. Types and lint do not see what a person sees.

1. Lint and types pass.
2. Look at the result with your own eyes: light theme, dark theme, 390 px width and a narrow window with a mouse. No clipping, overlap or horizontal scrolling.
3. Go through every action by hand: each button, filter, sort, empty state, error, reset. Walk the flow from scratch, with no data.
4. Check `prefers-reduced-motion` and keyboard control: focus is visible, icon buttons are labeled.
5. If something jerks or lags, measure instead of guessing: position and frame time frame by frame, with 4x CPU throttling. A hypothesis without a measurement is usually wrong.

If a rule feels like it is in the way, first ask what it protects. An exception is acceptable if the element really carries meaning that would otherwise be lost. Name the reason in your answer.

## Reference map

| File                                                  | When to read                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| [setup.md](references/setup.md)                       | Installing the kit, theme, lint, brand                             |
| [components.md](references/components.md)             | Which component to choose, how to create your own                  |
| [recipes.md](references/recipes.md)                   | Ready code: table, search, Select, panel, modal, tabs              |
| [layout.md](references/layout.md)                     | Shell, widths, spacing, grid, responsiveness, composition          |
| [archetypes.md](references/archetypes.md)             | Structure of typical screens: overview, list, settings and others  |
| [mobile.md](references/mobile.md)                     | Phone: scrolling, sheets, touch, verification                      |
| [writing.md](references/writing.md)                   | Copy, templates, slop signs, the check script                      |
| [audit.md](references/audit.md)                       | Auditing a project against the system                              |
| [typography.md](references/typography.md)             | Hierarchy, numbers, typographic conventions, copy                  |
| [color.md](references/color.md)                       | Surfaces, accent, statuses, contrast, dark theme                   |
| [motion.md](references/motion.md)                     | Micro-animations, loaders, morphing, performance                   |
| [craft.md](references/craft.md)                       | Creativity level, object details, gestures, a thought-through flow |
| [ux-flows.md](references/ux-flows.md)                 | States, forms, tables, filters, dangerous actions                  |
| [ai.md](references/ai.md)                             | Chat, streaming, agent steps, confirmations                        |
| [lessons.md](references/lessons.md)                   | Real fixes and their reasons                                       |
| [generated/tokens.md](references/generated/tokens.md) | Exact token values                                                 |
| [generated/api.md](references/generated/api.md)       | Exports and props                                                  |
