# Motion

Values are in [generated/tokens.md](generated/tokens.md).

Opening a chat is a frequent action, so messages that already exist appear instantly. Only what arrives while the chat is open is animated. `withTransition` can be called on top of itself: a new transition cancels the previous animation, and both changes are applied.

Dragging writes `transform` straight into the element, bypassing render: the panel content must not re-render on every move. The offset is computed from the unclamped pointer position, otherwise the panel lags behind the cursor after it passes the edge. The dragged object lifts with `scale(1.02)` from a point near the grab: scaling from a corner pulls the title out from under the cursor.

A one-off movement that cannot be expressed as state goes through Web Animations, not through an attribute and `transitionend`: if there is no offset, the transition never starts and the attribute stays forever.

## Principles

1. Motion explains a change. If there is nothing to explain, there is no animation.
2. The more frequent the action, the less motion. An animation seen a hundred times a day becomes a delay.
3. Enter with `base` and `decelerate`, exit with `fast` and `accelerate`. The exit is shorter: the person has already decided to leave.
4. Animate only `transform` and `opacity`. Height, width and `grid-template-rows` recompute the page layout on every frame and lag.
5. Scale starts from 0.9–0.99, offset is no more than `s`. Never `scale(0)`.
6. No springs or bounces in a work interface.
7. Under `prefers-reduced-motion` movement disappears and opacity changes remain. Kit components already do this.
8. Never disable the tactile press of HeroUI buttons. It is the most important feedback in the interface.

## What to use

| What happens                                            | Solution                                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A button starts work                                    | `onPress` returns a promise, forms use `action` or `isPending`                                 |
| A screen or list is loading                             | `Loadable` with a skeleton of the same shape                                                   |
| A small reversible action: a check, a switch            | Apply at once, no loader; on error roll back and show a toast                                  |
| Copying                                                 | `CopyButton`                                                                                   |
| Choosing one of several                                 | `SegmentedControl`                                                                             |
| Short text changed state: a button, a status, a counter | `TextSwap`, if it meets the conditions in "Rolling text"                                       |
| Work in progress shown as text                          | `Shimmer`                                                                                      |
| Change of order, filter, stage, removal, addition       | `withTransition` and `viewTransitionName` on the object. In `ItemList` rows move by themselves |
| A new element appears on its own                        | `<Box motion="enter">`                                                                         |
| Switching tabs, a whole block                           | `<Box motion="fade">`                                                                          |
| An icon changed                                         | `key` and `<Box motion="pop">`                                                                 |
| Success after a form                                    | `motion="enter"` on the new state and a way forward                                            |

Apply `withTransition` to discrete actions: sorting, filtering, moving. Typing in search and pagination go without a transition, otherwise the interface cannot keep up with input.

```tsx
<SegmentedControl onChange={(next) => withTransition(() => setFilter(next))} />
<Box viewTransitionName={`deal-${deal.id}`} />
```

## Showcase

A gallery of live samples is a persuasion surface, not a work screen: people look at it once to get a feel for the product. Motion here is more expressive. An object follows the finger, springs back with a slight overshoot when released, flies away when thrown, paper prints line by line. The limits stay: only `transform` and `opacity`, durations and easings from tokens, `prefers-reduced-motion` removes movement. A gesture writes `transform` straight into the element, and every gesture has a keyboard path: a button or Enter.

A masonry tile does not change height when its state changes: otherwise neighboring columns jump. Space for future content is reserved in advance.

## What not to animate

Main navigation between screens, keyboard actions, charts, a cascading page load on work screens, hover on cards, running gradients, numbers when a screen opens. Lifting cards and counters are fit for marketing at most.

## Rolling text

`TextSwap` is more noticeable than any other text change, and that only works while it is rare. When everything rolls, the eye has nothing to follow and the effect turns into ripple. Before using it, check all four conditions:

1. **Same object, new state.** "Save" became "Saved", 12 became 13. A different object in the same place, for example the name in a window title after choosing another chat, is new content, not a change.
2. **A short string.** A word, two or three words, or a number. A sentence cannot be read on the move, and descriptions are exactly what people read.
3. **The cause is visible.** The person caused the change or a step of work finished. Anything that ticks, follows input or arrives as a stream would move constantly.
4. **One place per action.** The eye can follow one movement. Roll what the person is already looking at: the label of the pressed button, and if it does not change, the main line of the result. Everything else from the same action changes quietly.

| What changes                                                | Solution                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Label of the pressed button: "Save", "Saved"                | `TextSwap`                                                                  |
| Object status after an action                               | `TextSwap`                                                                  |
| A number the person changed: balance after a top-up         | `TextSwap`                                                                  |
| A step of long work: agent status, loader line, `2/5`       | `TextSwap`, with `isShimmering` for agent status                            |
| A timer ran out: "Resend in", "Resend"                      | `TextSwap` on the words, seconds separately as plain text                   |
| Timer, countdown, call duration                             | Plain text with `tabularNums`                                               |
| A value that follows input: slider, field, count of matches | Plain text with `tabularNums`                                               |
| External data: people online, prices, metrics               | Plain text with `tabularNums`                                               |
| Table cells and values in list rows                         | Plain text. Ten rolling rows read as ripple                                 |
| A sentence, description, label next to a switch             | `key` and `<Box motion="fade">`. The switch has already shown the new state |
| Second text from the same action                            | `key` and `<Box motion="fade">`, the counter next to it as plain text       |
| Title after choosing another object, tab, screen            | Plain text or `motion="fade"` on the whole block                            |

If text is left without `TextSwap` but its width changes and neighbors jump, give the slot a fixed width.

## Loaders

| Wait                                 | What to show                                            |
| ------------------------------------ | ------------------------------------------------------- |
| Less than `timings.loaderDelay`      | Nothing, an indicator would only flash                  |
| A small reversible action            | Optimistic update without a loader                      |
| A button action                      | Loader inside the button, width does not change         |
| Refresh over data already shown      | Data stays, a quiet indicator, no skeleton              |
| Loading, shape known                 | `Skeleton` matching the size of the future content      |
| Shape unknown, search                | `Spinner` in place of the result                        |
| Launch of the whole app              | Full-screen `PageLoader`, with steps in the status line |
| More than 10 seconds or a percentage | `ProgressBar` with a percentage and cancel              |

`PageLoader` waits `timings.pageLoaderDelay`, 400 ms, not the general 150: a screen is louder than a spinner, and fast pages must not show it. The `delay` prop changes the threshold for a particular screen. A value of `0` shows the loader immediately; this is justified only where loading is known to be long.

A shown indicator stays for at least `timings.loaderMinimum`, otherwise a fast response looks like a flash. One loader per screen. For your own indicators these rules come from `useLoadingIndicator`.

A loader must not look like data, and vice versa. A thin ring indicator next to a running process reads as loading: show a percentage as a number instead.

## Pace

An interface where everything happens in one frame feels flickery. A state must have time to be read.

- Blocks that follow each other enter with a pause, a cascade of rows through `duration.stagger`.
- A View Transition replaces the whole page with a snapshot and blocks input for that time. It suits a rare discrete action. For a frequent one, like a new message, move only the elements themselves: FLIP on Web Animations, like `ItemList`. `withTransition` itself takes no snapshot while a `FloatingPanel` is open.
- A status change is animated: the icon through `key` and `motion="pop"`, the text through `TextSwap`.
- Minimum display time matters more than speed: a confirmation stays for `timings.confirmation`.
- Show a confirmation at the place of the action rather than in a toast.

## Stability

Nothing jumps. This matters more than the beauty of an animation.

- A loader lays over the label instead of replacing it.
- The status icon sits in a box of constant size: a spinner and a check mark of different sizes shift the text.
- A late caption does not add a second line: it goes on the same line, otherwise everything below moves.
- A skeleton repeats the shape of the content.
- Neighbors of changing text do not twitch: `TextSwap` animates width.
- `TextSwap` moves only what changed: the shared start and end stay put, the changed part slides up as one block and fades, and the new part appears from below when the old one is almost transparent. A real pause between them reads as a flash, full overlap as mush. In a counter this is one digit, in words the ending, for different words the whole string. With the `isShimmering` prop the whole string changes; this mode is for agent statuses. A change can arrive at any moment: the animation continues from the current position and width, not from zero. During rapid changes the border holds still, and after them it smoothly settles to the needed width.
- Autoscroll does not jump to the end but catches up with it frame by frame. A one-frame jerk on a scrolled page is a defect.

- Call tiles move to a new place through FLIP, not through a View Transition: a page snapshot would freeze live video. The speaker ring lies inside the tile and changes only `opacity`, so neighbors do not shift.

- Drag and drop runs on the pointer, not on browser drag: the browser draws its own ghost and does not let you control the landing. The chip follows the cursor and lifts, the source dims to 50 %, the target highlights with `--accent-soft` and opens up. Only this slot animates height, like a HeroUI disclosure, 200 ms. Data changes after the landing: the chip settles into the slot, the source collapses, the swap happens without a jerk. Cancel returns the chip to its place.

## Shimmer

Shimmer means only "work in progress" and stops together with the work. Use the `Shimmer` component, do not build your own: a trivial implementation on `background-clip` changes letter antialiasing when it stops, and the text flashes. In `Shimmer` the real text is always present, the highlight runs as a separate layer and always finishes its pass, and it is removed when it is already outside the text.

## Performance

Lag comes from render more often than from CSS.

- Keep frequent state, such as a stream, apart from heavy components. A new word re-renders a paragraph, not the screen.
- Memoize list items and pass them stable handlers.
- An input field must not depend on the stream.
- Test with the CPU slowed down 4 times: on a strong machine lag is invisible, but in reality a frame takes hundreds of milliseconds.
