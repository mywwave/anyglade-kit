# Project audit

Use it when asked to check consistency, find design system violations or understand how closely a project follows the kit. An audit only reports; it does not change code until asked.

A search match is a candidate, not a finding: confirm it by reading the code. A report is valuable only if it has no false alarms.

## 1. Automation

Run the lint with the kit rules. It catches raw elements, typography and spacing utilities, `dark:`, arbitrary values and foreign imports. If the rules are not connected, that is the first finding.

Then search for what the lint cannot see:

| What to search for                                   | Violation                                                                          |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `from "@heroui/`                                     | Import bypassing the kit, the replacements do not apply                            |
| `#[0-9a-fA-F]{3,8}`, `rgb(`, `oklch(` in screen code | Color bypassing tokens                                                             |
| `style={{`                                           | Bypassing the closed API. Only dynamic values and `viewTransitionName` are allowed |
| Scattered `toLocaleString`, `toFixed`                | Numbers without unified formatting                                                 |
| `<Spinner` next to `<Button`                         | A custom loader instead of the built-in one                                        |
| `animate-spin`, `animate-pulse`, `@keyframes`        | Homemade animation instead of kit components                                       |
| `<TextSwap`                                          | Several strings from one action, a timer, a cell, a sentence, a different object   |
| `No data`, or the same in the project's language     | An empty state without an explanation                                              |
| `<Button` without `onPress`                          | Possibly a dead button                                                             |

Exceptions: brand data colors from an API, colors of third-party services, progress width in percent.

## 2. Kit coverage

Find homemade versions of what already exists: metrics instead of `Stat`, label and value pairs instead of `DetailRow`, skeletons instead of `Skeleton`, empty blocks instead of `EmptyPanel`, segments instead of `SegmentedControl`, manual sorting instead of `useTableSort`.

Look for duplicates: two or more similar components should be merged.

## 3. Consistency across pages

For every work page, check the order from [archetypes.md](archetypes.md):

| Element      | Correct                         | Violation                           |
| ------------ | ------------------------------- | ----------------------------------- |
| `PageHeader` | The first element               | Missing or not first                |
| Main action  | In the page header              | Inside the content or at the bottom |
| Tabs         | In the header or right below it | Homemade pills in the content       |
| Metrics      | Right below the header          | Between filters and the table       |
| Filters      | Before the data area            | Inside the table                    |
| Pagination   | At the bottom of the data area  | Separate from the table             |
| Empty state  | Replaces the data area          | Sits next to the data               |
| Loading      | A skeleton of the same layout   | A spinner in the center             |
| Dialogs      | At page level                   | Inside `.map()`                     |

Compare how the same things are solved on different screens: header, empty state, pagination, dialogs, forms, tabs, toasts. Mixing approaches is bad, even if each one is good on its own.

## 4. Rules from the references

- Primary buttons per screen: one.
- Accent only in the allowed roles, see [color.md](color.md).
- Content width is limited.
- Hierarchy no deeper than three size levels.
- Template design indicators from [layout.md](layout.md).
- Animations only on `opacity` and `transform`.
- One action rolls no more than one string, see [motion.md](motion.md).
- Statuses as text, not tags.

## 5. In the browser

Open the main screens in both themes and on a phone. Walk the edges: empty, error, long values, slow network. Measure color on the real surface.

## Report

Findings from heaviest to lightest:

```
[Major] Orders page, orders/page.tsx:42
What: a custom table instead of Table and useTableSort.
Why it is bad: no sorting by value and no row reflow.
How to fix: replace it, see recipes.md.
```

Severity: a blocker breaks work or accessibility, major is visible to the eye or gets in the way of future changes, minor is cosmetic. At the end count the coverage: how many screens follow the system fully.
