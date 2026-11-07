# Typography

Roles and sizes are in [generated/tokens.md](generated/tokens.md). Fonts: Inter for the interface, Geist Mono for numbers in code and identifiers.

## Hierarchy

Three or four sizes work on a screen, no more. Hierarchy is built first by size, then by color, and only then by weight.

| Role                        | Used for                                           |
| --------------------------- | -------------------------------------------------- |
| `heading-2xl`, `heading-xl` | The main statement or number on marketing          |
| `heading-l`, `heading-m`    | Landing page section headings, large screen titles |
| `heading-s`, `heading-xs`   | Work screen title                                  |
| `heading-xxs`               | Section heading inside a screen                    |
| `title`                     | Title of an object, row, card                      |
| `body`                      | Long text for reading                              |
| `default`                   | Interface text, the default value                  |
| `label`, `caption`          | Labels, metadata                                   |

- One `h1` per page, levels do not skip. The semantic level is set by `as`, the size by `variant`; they are independent.
- Weights above `strong` are not used: large bold text looks loud in Inter, and in Cyrillic too. Headings larger than `heading-xxs` are usually regular weight. Bold inside a line is almost always unnecessary.
- Italics are banned. Negative tracking is banned. All caps only on rare short labels, and better nowhere.
- Text color has three levels: `default`, `muted`, `subtle`. Opacity is not used for color.

## Reading

- Line length is 45–75 characters; this is the reason for limiting width.
- Long text uses the `body` role; the line height is already set by the role.
- Headings get `wrap="balance"`, paragraphs `wrap="pretty"`: this is the roles' default.
- `truncate` only where the full text is available another way. Inside flex the parent needs `minWidth={0}`.

## Numbers

- `tabularNums` on every number that is compared or that changes: amounts, tables, counters, timers. Otherwise columns do not line up and a counter jitters.
- `monospace` only on real identifiers: an order number, a token, a tool name, a command.
- Amounts through `Intl.NumberFormat` with a currency, large values in compact form. The unit goes next to the value, not in the column header, if the column is not uniform.
- Compared numbers are aligned on one scale; values in a column have the same precision.

## English text

- Sentence case: only the first word and proper names are capitalized: "New task", not "New Task".
- Curly quotes and apostrophes: “ ”, ’.
- No em dashes in UI copy; a numeric range takes an unspaced en dash: 10–20.
- A non-breaking space between a number and its unit: 10 MB, 5 min.
- Plurals are a function: 1 customer, 2 customers. The template "customers: 2" reads as a brush-off.

## If the interface is in Russian

- Guillemet quotes «», an em dash with spaces, a numeric range with an en dash.
- A non-breaking space in numbers and amounts, before units and `₽`, after short prepositions in headings.
- Plural forms are a function: 1 клиент, 2 клиента, 5 клиентов. The template «клиентов: 2» reads as a brush-off.
- A name inside a phrase is inflected: «от имени Анны». If the case cannot be computed, store the needed form in the data or rebuild the phrase.
- The letter ё wherever the word has it.
- Sentence case: «Новая задача», not «Новая Задача».

## Copy

Rules, templates and slop signs are in [writing.md](writing.md).
