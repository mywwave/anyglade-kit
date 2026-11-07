# Screen archetypes

Most product screens belong to one of seven types. Determine the type before building: it has a proven structure. The scheme is a starting point, not a template: the screen's idea still decides the composition.

| Archetype   | Dense                                      | Calm                     | Two panes                                |
| ----------- | ------------------------------------------ | ------------------------ | ---------------------------------------- |
| Overview    | Main number, metrics, chart, feed          | Metrics only             | Customizable grid                        |
| Object list | Metrics and rich rows                      | Dense rows without cards | Database with view switching             |
| Work queue  |                                            | Feed with live statuses  | List and details panel                   |
| Object page | Dense header and tabs                      |                          | Content and a properties column          |
| Settings    |                                            |                          | Sections on the left, forms on the right |
| Messages    |                                            |                          | List, conversation, context              |
| Editor      | Full-width content with a floating toolbar |                          |                                          |

## Common page order

Work screens of one product are built the same way, which cuts learning time:

1. `PageHeader`: the title and the main action on the right.
2. Metrics, if there are any.
3. Filters and search.
4. The data area.
5. Pagination at the bottom of the area.
6. Modals and panels render at page level, not inside `.map()`.

The empty state replaces the data area instead of standing next to it. The skeleton repeats the same layout.

## Overview

Answers the question "is everything fine and where should I look". The title can be a conclusion: "3 deals are stuck".

```
Conclusion in one sentence                [Main action]
Metric       Metric       Metric       Metric
Full-width chart, or 2:1 with a funnel
Tasks for today           Sources
```

Components: `Stat`, `Sparkline`, `LineChart`, `SegmentedControl` for the period. Hierarchy no deeper than three levels: the main thing, metrics, details.

## Object list

```
Title                                     [+ Add]
[Status] [Search]                         [Export 3]
Table or dense rows
12 customers                              1 2 3
```

Components: `Table`, `SortableColumn`, `SegmentedControl`, `SearchField`, `Pagination`, `Drawer` for details. No card around the table.

## Work queue

Live statuses matter most. New items appear at the top; a status line updates in place.

```
Tasks
● Parse #152      Running  │  Parse
● Upload #151     Running  │  Status, progress
○ Queue #150      Waiting  │  Log
✓ Done #149                │  > Received 12 records
✗ Failed #148              │
```

Components: `Run`, `CodeOutput`, `Shimmer`, `ProgressBar`. A failed entry is expanded right away.

## Object page

```
← Customers / Anna Smirnova               [Message]
Content: history, notes          │ Status
                                 │ Manager
                                 │ Last contact
```

Components: `Tabs`, `DetailRow`, `Stat`, `CopyButton`. The main content on the left, properties on the right in a narrow column; on the phone properties go on top.

## Settings

```
Settings
Organization   │  Section title
Notifications  │  Fields in a column
Billing        │              [Save]
Danger zone    │
```

Form width is limited. Dangerous actions go in a separate block at the bottom. On the phone, a list of sections and a separate screen per section.

## Messages

```
Conversations │  Thread                  │  Context
Anna          │                          │  Customer
Ilya          │  [Input field]           │  Deals
```

Each column scrolls on its own: the list must not move the open conversation. The header and the input field sit outside the scroll area rather than sticking inside it: a new message physically cannot shift the field. The feed scrolls by itself only after your own send: "typing" and someone else's message do not move it, so the person finishes reading in peace, and a "down" button with a counter announces new messages. Read means what the person has seen: an open chat with a new message below the fold stays unread until they scroll to the end. A chat with unread messages opens at the "New messages" marker, not at the end. The counter in the list is a `CountBadge`: unread messages require action, so a badge is justified here. On the phone, one pane at a time, sections in a `Drawer`, and a way back from the conversation. Rows are `ItemList`, the conversation is `Conversation` without `ConversationTurn`: new messages stick to the bottom, as in a messenger, instead of reserving the screen.

The other person's context does not take a permanent column: it is a `FloatingPanel` at a button in the conversation header. A pinned panel stays on screen and shows the open chat, and changes its content when the chat changes. `FloatingPanel` lives at page level, not in the header, otherwise it disappears with it.

The conversation fills the whole panel: the header, messages and input field run edge to edge, and each side of the conversation is pinned to its edge. Line length is limited by the text in the bubble, not by a central column. A column is appropriate only in a chat with an agent, where there is one feed.

The time stands above a group of messages from one author, not in every bubble: a caption under a bubble would move it when the next one arrives. On the phone the list opens on entry, not the chat, otherwise unread messages count as read without being seen.

For a chat with an agent, see [ai.md](ai.md).

A conversation can be moved into a window: a context menu item and Alt + click on a row; this is a `FloatingPanel` without `triggerRef`. There can be many windows, each a live chat with an input field; a click raises a window to the top, and a repeated call does not spawn a copy but brings the same window forward with focus in the field. While a chat is open in a window, it counts as read. On the phone there is no such item: the chat opens the usual way.

The delivery status is an icon in the corner of the bubble of each of your messages, and in the list next to the time of the last one. The word appears only in the tooltip on hover and changes through TextSwap if the tooltip is open.

### Call

```
Spaces │ Channels        │ Stage            │ Participants
Sales  │ # general       │ Tiles            │ Maria
Design │ Standup         │                  │ Anna
       │    Maria, Anna  │ [Call controls]  │
```

Spaces sit in a narrow strip of icons, with channels below them: text and voice. A voice channel shows who is inside right in the list, so the person can decide whether to join. Choosing a channel opens a lobby with a microphone and camera check, and joining takes one press.

The call does not drop when the person leaves to read a channel: it moves into a `FloatingPanel` window, and if the window is closed, into a block at the bottom of the channel list. The block appears only when neither the stage nor the window is visible, otherwise it duplicates the call controls. On the phone there is no window; a bar above the chat replaces it.

The organizer moves participants between voice channels by dragging and through the menu. A locked channel does not accept moves. A move immediately shows a toast with an "Undo" button. You can drag yourself too: that is switching to another channel.

People are invited with a button that has a word, not a nameless copy icon. The invite modal shows the link, its expiry and a reset. An expired link leads to a screen with the reason and a way out, not to a dead end.

## Editor

Full-width content, tools float next to the selection. Saving is automatic and visible: a status next to the title.

## Maturity levels

The bar below which a screen looks dated:

- One main thing per screen, size equals importance.
- Data first, decoration second.
- Skeletons and instant response.
- Empty states explain and lead onward.
- Kit components instead of homemade ones.

What sets an expensive product apart: progressive disclosure, sensible defaults, micro-animations, recent and pinned items.

What sets the best products apart: a fast command palette, the main action in one or two steps, inline editing, optimistic UI, undo instead of confirmation.
