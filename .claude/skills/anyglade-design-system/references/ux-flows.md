# UX flows

A good screen is more than its main view. An interface is judged by its edges: loading, error, emptiness.

A context menu speeds things up but does not replace the interface: each of its actions is also available without it, in the object header or in the "More" menu. It opens with a right click, a long press and the menu key, and it acts on the row under the cursor, not on the open one. That row stays highlighted while the menu is open. A dangerous action comes last, is separated by a line and is confirmed by the same dialog as in the header.

## Screen states

For every screen and list, think through all of them:

| State             | How to handle                                                        |
| ----------------- | -------------------------------------------------------------------- |
| Loading           | `Loadable` with a skeleton of the same shape                         |
| Empty, first time | `EmptyPanel`: what will be here and one action to start              |
| Nothing found     | Text and a "Reset filters" button                                    |
| Error             | What happened, what to do, a "Retry" button. Data and input are kept |
| Partial data      | Show what is there, mark what is unavailable in place                |
| Success           | The new state with `motion="enter"` and a way forward                |
| No permission     | Explain whom to get it from                                          |
| Long values       | Test with a long name and amount, `truncate` or wrap                 |

No dead ends: every state has a way forward. After a form is sent there is "New payment" or "Use another email", not just text.

## Empty states

The type answers why it is empty. The size answers where it is empty. One heading of up to five words, one sentence, one button or none.

| Type             | Example                | Action                                                         |
| ---------------- | ---------------------- | -------------------------------------------------------------- |
| Nothing yet      | No campaigns yet       | Creates the first one                                          |
| Needs connecting | Connect your register  | Connects                                                       |
| Nothing found    | Filter, search, period | "Reset filters". For search, text with the query and no button |
| Not arrived yet  | Sync, first sale       | None, the text names the time as a number                      |
| All done         | Tasks closed           | None, or a quiet "Show completed"                              |

| Where                        | How                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Instead of the whole section | `EmptyPanel`, the page header stays, filters hide, the "Create" button moves from the header into the empty state: there is one primary button |
| In a block, panel, table     | Compact `EmptyPanel`, `secondary` button. A table keeps its column header and filters                                                          |
| In a popover, picker list    | One line of text, no icon                                                                                                                      |
| In a chart                   | The same height, no data                                                                                                                       |

A metric without data is not an empty state: "0", and "—" only if it cannot be computed. A chart of zeros is a line at zero.

## No dead ends

An empty section and the first launch do not hide what has to be prepared in advance.

- Entry points to preparation are visible even on an empty page: templates, lists, settings, connections.
- If an action is missing something, a way to create it is right there.
- A wizard does not demand what can be done later.
- Check: walk the flow from scratch, without a single entity, and make sure the main action can be reached.

## Every button works

A button without an action is a defect, not a draft. If there is no real action yet, show a plausible result: a state, a toast, a file. An export creates a real file. A button that looks active and does nothing destroys trust in the whole interface.

## Loading and errors

- First load: a skeleton of the same shape.
- Refresh over data already shown without a skeleton: data stays, the indicator is quiet.
- Loading more: skeleton rows at the end of the list.
- A block error stays inside the block: what failed to load and "Retry". One block does not bring down the whole screen.
- A problem that blocks work is a banner above the content with an action.

## Feedback

Every action gets a response, at the place of the action if possible:

| Time                     | Response                                                  |
| ------------------------ | --------------------------------------------------------- |
| Press                    | The button's tactile response                             |
| Fast action              | The result is visible at once                             |
| Waiting                  | A loader in the button                                    |
| Result visible on screen | Nothing more is needed                                    |
| Result not visible       | A `toast` with a concrete outcome: "3 customers exported" |

Apply small reversible actions optimistically, and on error roll back with a toast. There is no reason to wait for the server for a check mark.

## Forms

- The label is always visible. A placeholder does not replace a label: it disappears on input.
- Fields in a logical order, related ones together, one column by default.
- The width of a field hints at the length of the answer.
- The right `type`, `autoComplete`, `inputMode`: these are the mobile keyboard and autofill.
- An error shows when leaving the field or on submit, not while typing. Next to the field, with how to fix it.
- On error focus goes to the first invalid field, and what was entered is not lost.
- The submit button stays active while there is nothing to block. Disabling it until the form is filled is bad: the person does not understand what is missing. Exception: an edit form with no changes.
- Unsaved changes are visible, and there is "Cancel".
- A multi-step form: one question per step, a way back, the context of the previous step visible.
- Enter submits; in a multiline field Shift+Enter inserts a line break.

## Tables and lists

- Every column where order makes sense is sortable, and by value, not by label.
- Filters combine with search. Changing a filter resets to the first page.
- An empty result offers to reset everything: both search and filters.
- Selected rows are counted only among the found ones, otherwise "Export 5" exports the invisible.
- An action on the selection appears on selection and names the count.
- The result count is visible: "12 customers".
- A link from an overview opens a ready filter: "Open deals" shows the stuck ones.
- A row leads to details: a `Drawer` keeps the list context.

## Long lists

A list does not stretch the page without limit. A customer with a hundred objects must see the same neat screen.

| What kind of list             | How to limit                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Table, history, log           | `Pagination`, "N–M of K", when there are more rows than one page, usually from 20. Shorter lists need no pagination |
| Rows inside a block or dialog | From eight items, search and inner scrolling                                                                        |
| Preview in a block            | The first five and "Show all"                                                                                       |
| Chart legend and series       | Top 7 and an "Other" series in a neutral color                                                                      |
| Choosing from a long list     | `ComboBox` with search, not a `Select` with a hundred options                                                       |
| Full-page feed                | Infinite loading is acceptable only here                                                                            |

The counter in the header counts the whole list, not the found items. While the next page is loading, the current one stays on screen dimmed, and the pagination buttons are disabled.

## Metrics

- The required part: label and value. Everything else only if it changes a decision.
- A row of metrics has the same composition: if the neighbor does not need a sparkline, remove it from all.
- A comparison is always labeled: "vs last week".
- Change is shown by an arrow and color. Where growth is bad, for example refunds and unsubscribes, the colors swap.
- A sparkline only where the shape of the trend matters. Balances and counters do not need one.

## Settings

- Each section answers "why": a heading, fields in a column.
- Settings are saved with a button that shows progress, and unsaved changes are visible.
- Anything that moves money is confirmed explicitly and never applied silently.
- Options with consequences are a `RadioGroup` with explanations, not a `Select`.
- Dangerous settings in a separate block at the bottom of the page.
- Loading and errors on each section separately.

## Dangerous actions

| Reversible | Solution                                          |
| ---------- | ------------------------------------------------- |
| Yes        | Do it at once and offer undo                      |
| No         | `AlertDialog` with the consequence and the object |

The confirm button names the action, `danger` variant: "Delete project", not "Yes". The best confirmation is the ability to undo.

## Races and repeats

An interface often works correctly only with a perfect order of events.

| Situation                  | How it should be                                                         |
| -------------------------- | ------------------------------------------------------------------------ |
| Double click               | A kit button locks immediately                                           |
| Two requests in a row      | The last one wins, the response to the old one is ignored                |
| Repeated submit            | Does not create a duplicate                                              |
| Form while submitting      | Fields are locked; on error input is kept and the button is active again |
| Mutation success           | Data updated, dialog closed, result visible                              |
| Expired link or invitation | A clear message and a way forward                                        |

Harden the interface against real data: very long and very short text, millions in amounts, thousands of rows, missing data, a slow and dropped network.

## Permissions

An action unavailable to the person is hidden, not disabled without explanation. If they opened a section by a direct link, show whom to get access from.

- A browser refusing camera access is an error with a reason and a next step: allow access, connect a device, close the other program. A closed screen-picker dialog is the person's decision; do not show an error.
- Screen sharing can stop from outside, with the browser's button. Listen to `ended` on the track, otherwise the interface shows sharing that is not happening.
- Do not show organizer actions without permission, rather than disabling them: a participant sees only their own actions in the menu.

## Navigation and context

- The active section is visible, the current page is marked with `aria-current`.
- Filters and selection are not lost on return, if possible.
- A modal for a short task, a panel for details, a separate page for long work.
- No more than one layer above the page. A modal from a modal means the flow was designed wrong.
- State that people share lives in the URL.

## Patterns with limits

| Pattern                      | When                                       | When not                                         |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------ |
| Command palette              | A product with more than three sections    | A landing page, a simple utility                 |
| Optimistic UI                | Switch, check, drag                        | Money and irreversible actions                   |
| Skeleton                     | Tables, cards, feed                        | Loading faster than 200 ms, a dialog with a form |
| Field validation             | On leaving the field                       | On every keystroke, only on submit               |
| Undo instead of confirmation | A reversible action: toast "Deleted. Undo" | Irreversible                                     |
| Sensible default             | Preselect the most common                  | A choice with consequences                       |
| Progressive disclosure       | The main thing first, the rest on action   | What a decision cannot be made without           |
| State in the URL             | Filters, tabs, page                        | Temporary dialog state                           |
| Inline editing               | Frequent small edits                       | Related fields                                   |
| Wizard                       | More than five fields, checkout            | A short form                                     |
| Personalization              | There is behavior data                     | There is no data                                 |

Do not propose dark patterns: hidden check boxes, a confusing unsubscribe, a full-page spinner, filters lost on refresh.

## Accessibility

- Everything works from the keyboard, focus order is logical, focus is visible. HeroUI provides this; do not break it.
- An icon-only button gets an `aria-label`, a decorative image `alt=""`.
- A status expressed by an icon has text for a screen reader.
- Changes important for reading are announced through `aria-live`.
- Hover is not the only way to open anything.
- Browser zoom at 200 % breaks nothing.
