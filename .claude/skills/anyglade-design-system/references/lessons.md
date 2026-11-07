# Lessons from real fixes

Each entry is a mistake that looked reasonable until someone pointed it out. Format: what was wrong, why, how to do it.

## Feedback

- **The press animation was disabled for the sake of strictness.** Buttons felt dead. Tactile response matters more than matching a reference; HeroUI animations are never disabled.
- **Success appeared instantly, with no wait.** It looked fake. A network action shows the wait through the button.
- **Buttons without an action in mockups.** "Start", "Continue", "Reset filters" did nothing. Every action gives a result, even a demo one.
- **"Export" showed a toast, but there was no file.** What is promised must happen: an export creates a file.

## Sizes and layout

- **Forms and blocks stretched to full width.** Content has its own width; a field wider than 480 px is almost always a mistake.
- **Badges were oval and stretched.** Round badges are strictly round, with an outline in the surface color rather than black, and no gap when scaled.
- **Steps took 60 px for 21 px of text.** Dense lists do not rest on spacing for the sake of air: rows of equal height, step `xs`.
- **Labels and counters drifted to the right edge.** The eye had to jump across the screen. Supporting information sits next to the heading.
- **Bold group headings competed with the content.** The heading of a quiet group is no bolder than its rows.
- **A nested block with its own header created a staircase.** Nesting is shown with indentation, without a second header.
- **Tree rows behaved like text.** Everything pressable shows a pointer cursor: without it an item does not read as an action.
- **Nested objects of different kinds lay in one tree.** The tree grew and mixed entities. The tree shows where I am, and the list in the next column shows what is inside.
- **The highlight of a nested item started from the panel edge.** The nesting offset was inner padding, and the background painted it. The highlight hugs the item itself, so nesting is set with an outer margin.
- **Step icons did not line up in one column.** The disclosure body padding shifted them by 8 px. Group and row icons align on one axis.
- **Inner scroll in the chat.** The scrollbar appeared along with the text and narrowed the column. The page scrolls, while the header and input stay in place.
- **The input shifted by 8 px.** The gap under the panel made a difference between the stuck and normal positions. There is no gap under a stuck footer.

## Input

- **A second field was visible inside the composer.** The text field had its own hover background. A composite input looks like one field: states belong to the whole composer, and a click on empty space places the cursor.
- **The form reset after saving.** A form `action` resets controlled fields. Such forms are written with `onSubmit`.

## People

- **People in a list had icons instead of faces.** In a list of people the eye looks for a face, not an object type. Show people with avatars; leave icons to folders and files.
- **The other person's messages had no bubble.** In a conversation both sides are equal: both get a bubble, and the side shows the author.
- **"On behalf of Anna" in the wrong grammatical form.** Substituting a name into a phrase breaks case. Store the form in the data.

## Color

- **Pure white text on near black hurt the eyes.** A 20:1 contrast is too much. Body text in the dark theme is muted.
- **Acid accents and four shades of blue in the palette.** The set is built systematically: one lightness and saturation, one color per tone family.
- **Contrast tuning turned mint into muddy green.** A button relies on the contrast of its label and keeps the brand color. Only unlabeled controls, text and lines are tuned.
- **Every preset failed contrast in one of the themes.** One color does not work in both themes; check it on the worst surface.
- **The label on a colored button was white where black read twice as well.** Choose by the higher contrast, not by a threshold.
- **Sparklines spent the accent.** A screen without buttons became the most colorful. Small charts are neutral.

## Motion

- **Everything was instant and flickered.** States had no time to be read. Pace is needed: a pause between blocks, a cascade, an animated status change.
- **The last step jerked.** Autoscroll jumped 180 px in one frame when the next block appeared. Scrolling catches up with content frame by frame.
- **A height animation lagged.** It recomputed the page layout on every frame. Only `opacity` and `transform`.
- **Everything lagged when something new appeared.** The main cause was not CSS: every word of the stream re-rendered the whole conversation. Isolating renders cut a frame from 279 to 12 ms with a 4x slowdown.
- **Text changed with a jerk.** Short text in place changes through `TextSwap`, and the width adjusts smoothly. The limit on its use is in the lesson about too much rolling.
- **The feed moved along with the text.** Reading was impossible. The question moves to the top, the answer grows into free space, and following turns on only when the answer hits the bottom.
- **Text jumped when the loader changed to a check mark.** An extra inline box produced a 22.5 px line and fractional coordinates. Lines sit on whole pixels.
- **Shimmer flashed on stop.** The highlight broke off mid-line, and the letters changed antialiasing. The real text is always present, and the highlight finishes its pass.
- **A copy of the text for the highlight doubled the letters.** An inline `span` as tall as the font gave a 2 px offset. The text and its copy share one box.

- **The selection disappeared in the light theme.** `background-card` equals `background-canvas`, and checking only in the dark theme did not show it. The current item is highlighted with `--default`.
- **Transitions failed when they overlapped.** The other person's reply arrived during another transition, and the browser rejected the `ready` promise. A skipped animation is normal, not an error.
- **No dead ends for labels.** An empty label with no way to put a chat into it is a dead end. If there is grouping, the object has an action that changes it.

- **The chat content shifted to the center.** The header, messages and input lay in a `widths.content` column, and on a wide screen the sides were empty. At 1280 px this was not visible. The panel fills completely; the text limits the line length.

- **The status caption answered for one message.** The line under the last message said nothing about the others. Delivery status is an icon on each of your own messages, next to the time of the last one in the list, and the word lives in the hover tooltip: permanent text in the corner of every bubble is excess.

- **Windows above the page must not jump over a modal.** A z-index counter grows with every click and sooner or later overtakes dialogs. All panels live in one layer with their own stacking context.

- **The window flashed and lost its background on send, and the input flew up.** There were two causes: `startViewTransition` replaced the page with a snapshot on every message, and the input lay inside the scroll and held on with `sticky`. A frequent action does not go through a page snapshot; the list computes the reorder itself through FLIP. The input sits outside the scroll.

- **The scroll-down button flashed on send.** A new message increased the height before the scroll could keep up, and the distance check said "not at the end" for a few frames. Such a button answers whether the person left on their own, not the current distance. Catch the rare case with a long conversation and frame counting: it does not reproduce on a short one.

- **The feed jumped down from other people's messages.** Scrolling fired on any new message and on "typing" and pulled the person out of reading. Other people's activity does not move the feed; only your own send does.

- **In the list it was unclear whether a chat was read.** A chat counted as read while it was open, even though a message could lie below the screen. Read status is a fact of viewing, not a state of the window.

- **The toast icon and text sat at different heights.** The HeroUI grid aligns the row to the top, and the action button is taller than the text, so a short line drifted apart. A single line is centered with the icon and button; with a description the icon stays at the first line. Test a component with the shortest text, not only with long text.
- **A key effect fired without a key change.** In StrictMode effects run twice, and the chat scrolled to the end by itself, marking everything read. Compare the key with its previous value, not with the fact that the effect ran.

- **A counter overlapped the neighboring button.** The badge stuck out past the edge, and there were 4 px between buttons. The badge overhang is part of the row gap: the gap must be larger than the overhang. Check a row where badges sit on several items in a row.
- **The invitation was an unlabeled copy icon.** The person did not realize it was there. A key action is labeled with a word and leads to where you can see what will happen: the link, the expiry, the reset. Check a link by opening it, not by copying it.
- **Drag and drop "shoved".** Browser drag drew its own ghost, and on release the item teleported and rows jerked. Drag runs on the pointer: the target opens up in advance, data changes after the landing, the source collapses together with its gap. Compute the target with this collapse in mind, otherwise the chip lands in the wrong place.
- **Check drag and drop frame by frame.** By eye a 5 px jerk looks like "something twitches". A frame-by-frame log of `getBoundingClientRect` revealed both the `inline-flex` gap and a 28 px miss.

- **The page loader is a logo, not a spinner.** The highlight is slow, `duration-drift`, and for most of the cycle the logo stands without a highlight: the pause is what gives a calm pace. The bar is thin, 2 px, so it does not compete with the mark. The status line names the step in words.

- **The loader flashed on fast pages.** The appearance threshold is set through `delay`: a static page opens before it, and there is no loading screen at all. A loader is needed only where it really takes long.

- **A link was blue with a monochrome accent.** The only color on the screen, for no reason. `text-accent` had its own value unrelated to the accent. The link color derives from the accent, and a link in text is distinguished by an underline: color alone does not do, since people with color vision deficiency cannot see it.

- **The accordion row highlight had sharp corners.** HeroUI paints the row on hover but sets no radius. Check third-party components in the hover state: everything that highlights has radius `m`, like `ItemList` rows. A rounded highlight does not touch the divider: there is a gap between them, otherwise the corners run onto the line.

- **`TextSwap` jerked on fast changes and even on rare ones.** The animation started from zero, the width was taken from an animation already running, and the outgoing line flashed in the last frame. An interruptible animation starts from the current state and drives the same element from enter to exit.

- **Random character direction turned out to be excess.** What was wanted was simple: a digit slides up. One direction reads as a counter, and a mix distracts from the value.

- **The tail of the text flashed.** Per-character cells suit only digits of equal width: for words of different lengths the cells shrank and letters ran into each other. Digits did not show this, nor did measurements: the mush is visible only on a zoomed frame. Move the changed part as one block.

- **New text appeared before the old one left.** Two lines in one place read as a flash. First the exit, then the entrance. The delay equals the remainder of the exit, otherwise the slot stands empty during rapid changes.
- **Text flashed on change.** The old line faded out completely, and the new one appeared with a jerk. Measure how much text is visible at each moment: the sum must not drop toward zero. Lines overlap where the old one is already almost transparent, and the new one starts smoothly.

- **Long text was clipped to fit the short one.** The border shrank while the old line was still leaving. Width follows the direction: shrinking after the old text leaves, growing before the new one arrives.

- **There was too much rolling text.** One press rolled four strings, a countdown moved every second, the window title rolled when another chat was chosen. The effect is noticeable while it is rare: the eye follows one movement. One action rolls one short string of the same object, where the person is already looking. Timers, values that follow input, tables and sentences do not roll.

## Showcase

- **Showcase blocks were flat: a button, text, another button.** Such a showcase sells nothing: the kit shows itself through details. Each sample is one crafted object (a receipt, a card, a contract, a phone) with a gesture, plausible data and all states: before, during, success, error, a way back. If a sample can be described in one phrase, "press the button", it is not ready.
- **New components did not appear among the examples.** A component without an example will not be found or checked by anyone. A new component gets an example with all states right away, including the error.

- **The confirmation handle grew when dragged and stuck out of the track.** Scaling inside a shape with a hard edge breaks that edge. In a narrow track the response comes from the cursor and the fill behind the handle, and the handle itself keeps the size of the track.
- **A pressed toggle with an avatar was outlined by a translucent ring.** HeroUI paints a selected `ToggleButton` with a soft translucent accent, and under content smaller than the button it shows as a rim. Selection is neutral and opaque, and if the state is already visible from the content itself, the content fills the whole button.

- **The "Listen" button could not be pressed.** A fill layer moved past the edge with a transform stayed on top of the button, invisible, and took the presses. Everything hidden by an offset that does not accept input gets `pointerEvents="none"`. Check `elementFromPoint` at the center of the button.
- **The receipt shook while dragged.** The tilt was computed from instantaneous velocity, but pointer events arrive at millisecond intervals, and velocity jumps around. Velocity for tilt and throw is smoothed over time and capped.
- **The focus border showed seams.** It was assembled from corners and stretched sides, and on fractional coordinates the seams separated. Draw an outline as one contour. If moving such a border requires cutting it into parts, fade it in at the new place instead.
- **Avatars in a row stuck together when the selection ring disappeared.** The spacing between them came from a backdrop, not from a gap. A row of objects keeps its own `gap`, independent of their state.

## Method

- **Test results disagreed with the eyes.** The test checked a different element and passed. If a person sees a problem and a measurement does not, the measurement is wrong.
- **Hypotheses about lag and jerks are usually wrong.** First a frame-by-frame measurement, then the fix.
- **Fixes were made in one theme only.** A screen is checked by eye in both themes and on a phone, not by counters.
