# Agent interface

Everything lives in `@anyglade/kit/ai`. The components do not depend on a provider and take plain data, so they fit any SDK. Labels are passed as props; the kit does not impose a language.

## What to choose

| Task                                                            | Component                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A feed on the page scroll                                       | `Conversation`, `ConversationTurn`                                                                                                                                                                                                                                                                                                        |
| A message                                                       | `Message`: `user` as a bubble on the right, `assistant` without a bubble, `contact` as a bubble on the left. `isHistory` on what was already there when the chat opened: history is not animated                                                                                                                                          |
| A chat in a panel or dialog                                     | `Conversation` with `isContained`: messages scroll in their own box, the input sits below it outside the scroll. Without it the page scrolls; this is the assistant screen mode. `onReachEnd` reports that the end was seen, `newCount` shows a number on the scroll-down button, `ConversationNewMark` places the mark the chat opens at |
| Status of your own message                                      | `DeliveryStatus` in the `meta` slot of `Message`: a clock, one check "sent", two "delivered", two in the success color "read". The word appears only in the hover tooltip; an open tooltip changes it through `TextSwap`                                                                                                                  |
| A word-by-word answer                                           | `StreamingText`, the `[1]` mark becomes a link to the source                                                                                                                                                                                                                                                                              |
| Input, attachments, send, stop                                  | `PromptComposer`                                                                                                                                                                                                                                                                                                                          |
| Suggestions                                                     | `Suggestions`                                                                                                                                                                                                                                                                                                                             |
| Reasoning                                                       | `Reasoning`                                                                                                                                                                                                                                                                                                                               |
| The agent's intent                                              | `Plan`                                                                                                                                                                                                                                                                                                                                    |
| Progress of work: tasks, queue, chain of steps, tests, subagent | `Run`, subagent steps in the `steps` field                                                                                                                                                                                                                                                                                                |
| Tool call and approval                                          | `ToolCall`                                                                                                                                                                                                                                                                                                                                |
| Terminal, stack trace                                           | `CodeOutput`, `tone="danger"` for errors                                                                                                                                                                                                                                                                                                  |
| Changed files                                                   | `FileTree`                                                                                                                                                                                                                                                                                                                                |
| Sources                                                         | `Sources`, `Citation` in the text                                                                                                                                                                                                                                                                                                         |
| Model and depth, context usage                                  | `ModelPicker`, `ContextMeter`                                                                                                                                                                                                                                                                                                             |
| A restore point                                                 | `Checkpoint`                                                                                                                                                                                                                                                                                                                              |

Step statuses `AgentStatus`: `pending`, `running`, `waiting`, `done`, `failed`. Status text for a screen reader is passed in `statusLabels`. Data types: `RunStep`, `Source`, `ChangedFile`, `PromptAttachment`, `ToolApproval`, `StatusLabels`.

## Feed model

The page scrolls, only messages move. The header and the input stay in place.

```tsx
<Conversation
  followKey={lastTurn?.id}
  footer={<Composer />}
  label="Conversation"
  scrollLabel="Jump to latest message"
  topInset={64}
>
  {turns.map((turn) => (
    <ConversationTurn key={turn.id}>…</ConversationTurn>
  ))}
</Conversation>
```

A new question moves up, under the header, and a full screen of space is reserved below it. The answer grows into that space while the screen stays still, so it can be read calmly. When the answer reaches the input, the page smoothly follows it. If the person scrolled up, the page no longer moves and a scroll-down button appears.

- `topInset` is the height of everything stuck to the top, plus a small gap.
- `followKey` is the id of the last message. It changes on send.
- Put suggestions after an answer inside the last message, otherwise they end up below the bottom edge of the screen.
- There must be no gap below `Conversation`, otherwise the input moves around.

## Plan and progress

`Plan` and `Run` are different objects. A plan reads as intent: a heading, progress, check-mark steps on a line. Progress of work is a quiet list. If you mix them, the plan gets lost among the tasks.

Activities look like quiet rows of equal height, not like blocks: the label and counter next to the heading, no bold. Nesting is shown by indentation. A second header inside a group turns the list into a staircase.

The group heading shows the current step while it runs, then the outcome in `summary`. A status is an icon and text, not a tag.

## Approval

`ToolCall` with `approval` stops the agent until it gets an answer. The question names the consequence: "Send three emails? This cannot be undone." While the agent waits, the input shows the stop, so there is one primary button on the screen.

## Input

The whole `PromptComposer` is one field: hover and focus apply to it as a whole, and a click on empty space puts the cursor into the text. Send and stop are in the same place, so the way out is always under the cursor. Attachments are visible before sending.

## Stream

- New words fade in, and a line already read does not move.
- Keep stream state apart from the input, memoize messages. Otherwise every word re-renders the conversation, and on an ordinary laptop a frame takes hundreds of milliseconds.
- Renders update only the message that changed; the parts of a message are memoized too.

## Stopping

Everything stops at any moment: reasoning, a step, a tool, the stream. After stopping nothing shimmers, unfinished steps return to `pending`, pending approvals close, and the answer keeps "Stopped" and "Retry".

"Retry" is shown only on the last message: otherwise the old answer moves to the end of the conversation. `Checkpoint` removes a message and everything after it, and the request text returns to the input.

## Citations

`Citation` opens on press, not on hover: there is no hover on a phone, and the link inside must be reachable from the keyboard.

## Context

`ContextMeter` shows usage as a number, not a ring: a thin ring next to a working agent reads as a loader. The color changes only at the warning and danger thresholds.
