# Copy

Text is the most-read part of an interface. Slop is recognized in a second: after the phrase "a powerful tool that lets you quickly and easily", the reader stops believing the rest.

After editing copy, run the check. A hit means "reread this", not "you must rewrite":

```bash
node <skill folder>/scripts/check-copy.mjs <files>
```

How to write: name the fact first. What is happening, what the person gets, what they need to do. Take numbers, names and deadlines from the product. Then ask yourself what here gives away an AI.

The kit's examples are in English. If the product's interface is in Russian, also apply [If the interface is in Russian](#if-the-interface-is-in-russian).

## Interface rules

- Address the person as "you".
- Sentence case everywhere: titles, buttons, tabs, menu items, column headers. Only the first word and proper names are capitalized: "New task", not "New Task". Title Case reads as marketing and slows scanning.
- A title is up to seven words, an explanation one or two sentences.
- Plain words over jargon: "data", not "payload"; "sign in", not "authenticate". One concept is called by one word across the whole product.
- A button is a verb and an object that name the result: "Export 3 customers". Never "OK", "Yes", "Confirm", "Submit".
- A screen title can be a conclusion: "3 deals are stuck" is stronger than "Overview".
- An error says how to fix it: "Enter a number from 0 to 100", not "Invalid value".
- Consequences are named directly and with numbers: "2 years of history will be deleted permanently."
- Abbreviations in labels and column headers are banned: "Curr.", "Qty". No room means a short word, with the full name in a tooltip.
- No exclamation marks, all caps or emoji.
- A subtitle does not repeat the title. If the title says everything, there is no subtitle.
- No lorem ipsum, "Test", "Item 1". Data is plausible, including long values.
- No invented promises: "40% faster" without a source is a lie.

## Punctuation and numbers

- Curly quotes and apostrophes: “Archive”, can’t. Straight quotes look like code.
- No em dashes in UI copy: use a comma or a period. A numeric range takes an unspaced en dash: 10–20, Mon–Fri.
- A non-breaking space between a number and its unit: 10 MB, 5 min. Percent and currency follow English convention: 40%, $1,200.
- Numbers that are compared or that change get tabular figures, see [typography.md](typography.md).
- Plurals are a function: 1 customer, 2 customers. The template "customers: 2" reads as a brush-off.

## Templates

| Situation                | Title                 | Text                                                        | Button           |
| ------------------------ | --------------------- | ----------------------------------------------------------- | ---------------- |
| Nothing yet              | No campaigns yet      | A campaign writes to all your customers at once             | Create campaign  |
| Needs connecting         | Connect your register | Payments start counting as soon as it’s connected           | Connect register |
| Not arrived yet          | No sales yet          | They appear after the first sync, usually within 10 minutes | None             |
| Empty because of filters | Nothing found         | No orders match these filters                               | Reset filters    |
| All done                 | All tasks done        | New ones will appear here                                   | None             |
| Deletion                 | Delete {name}?        | {What disappears, with numbers}. This can’t be undone       | Delete {object}  |
| Success toast            | Saved                 | Notification settings updated                               | None             |
| Toast with undo          | Campaign archived     | You can restore it within 30 days                           | Undo             |
| Error toast              | Couldn’t save         | No connection to the server. Check your internet            | Retry            |
| Search with no results   | None                  | No one found. Check the spelling                            | None             |

## A hint on a term

An icon with a tooltip goes only on a non-obvious term, an abbreviation or a calculation. On an obvious word it is noise, and adding one "just in case" devalues every other hint.

Format: the name and one or two sentences on what it is and how it is calculated. No "This metric displays".

> **Average order value.** Revenue divided by the number of sales. Shows how much one purchase brings in on average.

## Slop signs

| Sign                        | Example                                                    | Instead                                                   |
| --------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| Advertising instead of fact | Powerful, intuitive, seamless, effortless, one-click       | A fact from which the reader draws their own conclusion   |
| Inflated significance       | Plays a pivotal role, opens up new possibilities           | What concretely happens                                   |
| "Not just X, but Y"         | Not just hints, but a real assistant                       | Two simple statements                                     |
| Trailing negation           | No extra clicks, no more busywork                          | Remove                                                    |
| Corporate filler            | Utilize, facilitate, in order to, serves as, allows you to | The verb directly, with a visible actor                   |
| Participle tail             | ..., ensuring transparency                                 | Cut it or make it a separate fact                         |
| Habitual triples            | Fast, simple and reliable                                  | As many items as there really are                         |
| Dash for a pause            | Connect your register — and everything works               | A comma or a period                                       |
| Staccato                    | No templates. No busywork. Just results                    | An ordinary sentence                                      |
| Rhetorical opener           | Imagine, Sound familiar?, Here’s the thing                 | Say right away what you were about to announce            |
| Explaining the interface    | In this section you can, Here you can see                  | Remove: the screen already shows it                       |
| Release anchoring           | Now you can, We’ve added, New feature                      | Permanent text does not know what came before the release |
| Synonym carousel            | Client, customer, buyer for the same thing                 | One word per concept                                      |
| Servility                   | Great question, Hope this helps                            | End on the last useful fact                               |
| Invented authority          | Experts agree, many companies already                      | A source, or remove it                                    |
| AI vocabulary               | Delve, leverage, robust, empower, unlock, elevate, crucial | Plain words                                               |
| Title Case                  | Manage Your Team Settings                                  | Sentence case                                             |

## If the interface is in Russian

- Address the person as «вы» in lowercase.
- Typography: guillemets «», ё, non-breaking spaces in numbers, plural forms and name inflection, see [typography.md](typography.md#if-the-interface-is-in-russian).
- Button and template rules are the same: «Выгрузить 3 клиента», never «ОК», «Да», «Подтвердить», «Отправить данные». Jargon: «синхронизация», not «sync»; «данные», not «payload».
- Russian slop, by the same signs:

| Sign                        | Russian example                                                              |
| --------------------------- | ---------------------------------------------------------------------------- |
| Advertising instead of fact | Мощный, удобный, интуитивный, бесшовный, в один клик                         |
| Inflated significance       | Играет ключевую роль, открывает новые возможности                            |
| "Not just X, but Y"         | Не просто подсказки, а настоящий помощник                                    |
| Trailing negation           | Без лишних кликов, никакой рутины                                            |
| Corporate filler            | Является, осуществляет, данный, в рамках, позволяет                          |
| Participle tail             | ..., обеспечивая прозрачность                                                |
| Dash for a pause            | Подключите кассу — и всё заработает (no more than one dash per sentence)     |
| Rhetorical opener           | Представьте, Знакомо?, Секрет прост                                          |
| Explaining the interface    | В этом разделе вы можете, Здесь отображаются                                 |
| Release anchoring           | Теперь можно, Мы добавили                                                    |
| Servility                   | Отличный вопрос, Надеемся, это было полезно                                  |
| Invented authority          | Эксперты считают, многие компании уже                                        |
| Calques                     | Это поможет вам, на ежедневной основе, имеет смысл: write it the Russian way |

## False positives

The script looks for patterns and does not understand meaning. Quotes, legal text, feature names and cases where a word is used literally do not need rewriting. An unspaced en dash in a range (Mon–Fri, 10–20) is correct. In Russian, a dash between subject and predicate is legitimate: «Комиссия — 20 %».
