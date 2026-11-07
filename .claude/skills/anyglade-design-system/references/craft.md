# Craft: creativity, details, gesture, flow

Read this before any object that should be memorable: a showcase, a landing page, onboarding, a component sample, a request to "make it more creative". The "Flow" section is mandatory for work screens too.

A neat interface made of the right components is not yet crafted. Craft shows in what the person did not ask for but will notice: a computed detail, a state thought of in advance, a gesture that behaves like the real thing.

## Creativity level

First, honestly determine the level. On a persuasion surface (showcase, landing page, sign-in, pricing) only the third level is accepted. On a work surface no object or metaphor is needed: there, craft means flow, precision and speed, but the first level is unacceptable there too.

| Level    | What it looks like                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Template | "Press the button, text appears". A card, a heading, a button, a toast                                                        |
| Neat     | The right components and tokens, there is a wait and a success. No object and no idea                                         |
| Crafted  | A recognizable object from the product's world, its own gesture, details from data, all states and a way back thought through |

Check: describe the block in one phrase. If it fits "press the button and X appears", the block is at the first level.

### Where the idea comes from

Look not for decoration but for an object or ritual from the domain that the person already knows by hand. Its behavior suggests the interaction:

- payment: a receipt comes out of the printer line by line, and it is torn off;
- contract: a signature on the line, a stamp comes down, the sheet sags under it;
- wallet: a stack of cards is flipped through, the top one is swiped away;
- transfer: a handle is pulled all the way, because an accidental press is dangerous here;
- reconciliation: a wave runs across the payment matrix, mismatches remain as rings;
- payment notification: an island on the phone screen expands and collapses by itself.

The metaphor must be honest. The object behaves like the real one and at the same time does real work: the sum adds up, the request goes out, the file downloads. Decoration without work reads as a mockup.

## Object detail

### Anatomy

List what the real object consists of and carry over everything that helps recognition:

- a receipt has the store header, address, date, time, cashier, number, line items "qty × price" with dot leaders, VAT, a large TOTAL, a QR code and "Thank you!";
- a card has a chip, the contactless symbol, number, holder, expiry and payment network.

The smaller the object on screen, the more important the outline by which it is recognized in a fraction of a second.

### Details are computed, not drawn

The data must add up; then the object withstands a close look:

- the total and VAT are computed from the line items, the receipt number grows from order to order;
- the QR code is built from the number, so every receipt has its own;
- the voice message waveform is built from the speech timeline: pauses between phrases show as dips and match the word highlighting;
- the card number passes the Luhn check, the payment network is derived from the first digits;
- rounding cents stay with the payer, and the amounts add up to the total.

A drawn detail that does not match its neighbor destroys trust in the whole block.

### Every detail has a state

Small signals make an object alive: a "Primary" mark on the selected card, an "unplayed" dot that goes out after the first playback, a printer light blinking during printing, a struck-through line after a refund. Each such signal answers a question the person would ask themselves.

### Copy and numbers

Plurals through plural rules ("1 payment", "3 payments"), non-breaking spaces in amounts, the current time and dates, plausible names, addresses and payment descriptions. Drawings (chip, QR, waveform, stamp) are made in svg with `currentColor`, so they follow the theme.

## Interaction

### The main gesture

Determine which gesture the object suggests: pull, swipe, slide, sign, scrub. A press remains the keyboard path and a fallback, not the only path.

### Gesture physics

- **Resistance up to the threshold.** Paper held by the printer moves slower than the finger. This way the person feels they are doing something irreversible.
- **Threshold.** It triggers by distance or by throw velocity. Before the threshold the object returns with a slight overshoot; after it the object flies off in the direction of movement and fades.
- **Follows the finger without lag.** After it breaks free the object moves 1:1. Tilt is proportional to offset and smoothed velocity. Raw velocity between events jumps around, and the object shakes.
- **Interruptibility.** Every movement starts from the current position: a running animation is committed and removed, not cut off with a jerk.
- **No render per frame.** The gesture writes `transform` straight into the element; complex motion goes through Web Animations.
- **Response.** A short vibration on the phone at the threshold, the `grab` and `grabbing` cursors, a one-time hint after appearing: the object crouches slightly, showing that it can be pulled.

### Do not disturb neighbors

- A horizontal gesture does not block vertical page scrolling.
- A thrown object is clipped by the edge of its tile and does not overlap neighbors.
- The block height does not change between states: space for future content is reserved in advance.
- Invisible layers moved past the edge do not accept input: otherwise they cover buttons.

### Gesture accessibility

Every gesture needs a keyboard path: a button ("Tear off receipt", "Next card") or Enter. A native `range` suits scrubbing. Under `prefers-reduced-motion` movements are replaced by opacity changes, and the gesture itself keeps following the finger.

## Flow

Before code, write the flow as a chain of states: before, action, wait, result, a way forward or back. Then add what happens in real life:

| Situation                    | Solution                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| No data yet                  | The button is disabled, with the reason as text next to it: "Not all items are checked", "Awaiting your signature"        |
| Invalid input                | The error at the source: the field or object shakes briefly, text on the same line, the layout does not jump              |
| Valid input                  | Speed up the path: focus moves to the next field by itself, sample data is inserted with one button                       |
| Why do this                  | Show it before the action: register and bank totals are visible before reconciliation, the difference is clear in advance |
| Dangerous action             | Two steps: "Refund", then "Refund for sure?". A reversible one is applied at once and can be undone                       |
| Events come in a row         | A queue with a "2 more" counter. Auto-hide pauses on hover and focus                                                      |
| An action interrupted midway | The object returns to where it started. A repeated action starts from zero                                                |
| Result                       | Explain the consequences: "Refund issued, the money will arrive in 1–3 days", "A copy was sent to your email"             |
| End                          | Not a dead end: "New order", "Link another card", "Split again", "Reconcile again"                                        |

Multi-step work shows its progress: paper comes out in steps, a wave runs diagonally, and there is a short pause before the verdict so the finished picture can be seen. Only one short string rolls per action; the rules are in [motion.md](motion.md).

## Check

A block is crafted only if every question has an answer:

1. What object or ritual from the product's world does it show?
2. What is the main gesture and what is its keyboard path?
3. Which details are computed from data, and do they agree with each other?
4. How many states? At minimum: before, during, success, refusal or error, a way back.
5. What happens on a repeat, a double quick action, an interrupted gesture, an event on top of an event?
6. Does the layout jump, and does the block disturb its neighbors?
7. How does it look in the dark theme, at 300 px and on a phone, with reduced motion?

If even one answer is "it doesn't", the block is still at the second level.
