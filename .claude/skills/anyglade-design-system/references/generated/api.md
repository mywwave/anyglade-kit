# Публичный API

Файл создан автоматически. Не правьте его вручную.

## @anyglade/kit

`Box`, `Button`, `CopyButton`, `CountBadge`, `DetailRow`, `Draggable`, `EmptyPanel`, `FloatingPanel`, `Frame`, `FrameTile`, `ItemList`, `Loadable`, `MediaStage`, `MediaTile`, `PageHeader`, `PageLoader`, `SegmentedControl`, `Shimmer`, `SortableColumn`, `Stat`, `StreamVideo`, `Text`, `TextSwap`, `TreeNav`, `useLoadingIndicator`, `useTableSort`, `withTransition`

## @anyglade/kit/ai

`Checkpoint`, `Citation`, `CodeOutput`, `ContextMeter`, `Conversation`, `ConversationNewMark`, `ConversationTurn`, `DeliveryStatus`, `FileTree`, `Message`, `ModelPicker`, `Plan`, `PromptComposer`, `Reasoning`, `Run`, `Sources`, `StreamingText`, `Suggestions`, `ToolCall`

## @anyglade/kit/charts

`AreaChart`, `BarChart`, `DonutChart`, `LineChart`, `Sparkline`

Основной вход дополнительно отдаёт все компоненты HeroUI и объект `tokens` со значениями шкал: `tokens.widths.content`, `tokens.timings.confirmation`.

## Функции и хуки

```ts
function useLoadingIndicator(isLoading: boolean, delay: number = timings.loaderDelay);
function useTableSort<T>( items: readonly T[], accessors: SortAccessors<T>, initial: SortDescriptor, );
function withTransition(update: () => void);
type AgentStatus = "pending" | "running" | "waiting" | "done" | "failed";
type SortAccessors<T> = Record<string, (item: T) => string | number>;
type StatusLabels = Record<AgentStatus, string>;
```

## Пропсы Box

Значения можно задавать объектом условий. Отрицательные отступы пишутся с минусом: `-s`.

| Проп | Значения |
| --- | --- |
| `padding` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingTop` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingRight` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingBottom` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingLeft` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingHorizontal` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `paddingVertical` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `margin` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginTop` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginRight` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginBottom` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginLeft` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginHorizontal` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `marginVertical` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl, auto |
| `gap` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `rowGap` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `columnGap` | none, 2xs, xs, s, m, l, xl, 2xl, 3xl, 4xl, 5xl |
| `backgroundColor` | background-canvas, background-panel, background-primary, background-secondary, background-card, background-emphasis, background-inverse, background-warning, background-success, background-danger |
| `color` | text-primary, text-secondary, text-tertiary, text-disabled, text-inverse, text-accent, text-success, text-danger, text-warning, text-label-blue, text-label-violet, text-label-teal, text-label-pink |
| `borderColor` | border-primary, border-secondary, border-control, border-warning |
| `borderRadius` | none, s, m, l, frame, xl, full |
| `boxShadow` | none, s, m, l, xl |
| `borderWidth` | 0, 1, 2 |
| `borderTopWidth` | 0, 1, 2 |
| `borderRightWidth` | 0, 1, 2 |
| `borderBottomWidth` | 0, 1, 2 |
| `borderLeftWidth` | 0, 1, 2 |
| `borderStyle` | solid, dashed, none |
| `display` | flex, grid, block, inline, inline-flex, inline-block, none |
| `position` | relative, absolute, fixed, sticky, static |
| `overflow` | hidden, auto, scroll, visible |
| `overflowX` | hidden, auto, scroll, visible |
| `overflowY` | hidden, auto, scroll, visible |
| `flexDirection` | row, column, row-reverse, column-reverse |
| `flexWrap` | wrap, nowrap |
| `flexGrow` | 0, 1 |
| `flexShrink` | 0, 1 |
| `alignItems` | start, end, center, baseline, stretch |
| `alignSelf` | start, end, center, baseline, stretch, auto |
| `justifyContent` | start, end, center, between, around, evenly |
| `alignContent` | start, end, center, between, around, evenly |
| `textAlign` | left, center, right |
| `cursor` | pointer, default, not-allowed, grab, text |
| `pointerEvents` | none, auto |
| `visibility` | visible, hidden |
| `userSelect` | none, text, all |
| `motion` | fade, enter, pop |
| `transitionProperty` | none, colors, opacity, shadow, transform, common |
| `transitionDuration` | instant, fast, base, slow, slower, shimmer, drift, stagger |
| `ease` | standard, decelerate, accelerate |

Свободные значения: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `flexBasis`, `top`, `right`, `bottom`, `left`, `inset`, `viewTransitionName`, `flex`, `aspectRatio`, `zIndex`, `gridTemplateColumns`, `gridTemplateRows`, `gridTemplateAreas`, `gridColumn`, `gridRow`, `gridArea`, `opacity`, `transform`.

## Пропсы Text

Значения `variant`, `color` и `weight` в tokens.md.

```ts
interface TextStyleProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  wrap?: TextWrap;
  monospace?: boolean;
  tabularNums?: boolean;
  lineThrough?: boolean;
  /** `true` clamps to one line, a number to that many lines. */
  truncate?: boolean | number;
  /** Formats a string or number child. */
  formatter?: TextFormatter;
}
```

## Пропсы и типы

```ts
export interface BarChartProps extends CartesianChartProps {
  stacked?: boolean;
}
```

```ts
export interface ButtonProps extends Omit<HeroButtonProps, "onPress"> {
  /** Return a promise and the button shows its loader until it settles. */
  onPress?: (event: PressEvent) => unknown;
}
```

```ts
export interface ChangedFile {
  path: string;
  added?: number;
  removed?: number;
}
```

```ts
export interface ChartSeries {
  /** Field of each data item that holds the value. */
  dataKey: string;
  label: string;
}
```

```ts
export interface CheckpointProps {
  label: string;
  restoreLabel: string;
  onRestore: () => unknown;
}
```

```ts
export interface CitationProps {
  index: number;
  source: Source;
}
```

```ts
export interface CodeOutputProps {
  /** A command, a file name or an error message. */
  title: string;
  output: string;
  copyLabel: string;
  copiedLabel: string;
  /** Terminal output is neutral. A stack trace uses `danger`. */
  tone?: "default" | "danger";
  isStreaming?: boolean;
}
```

```ts
export interface ContextMeterProps {
  label: string;
  used: number;
  limit: number;
  /** Exact numbers, shown on demand. */
  detail: ReactNode;
}
```

```ts
export interface ConversationProps {
  label: string;
  scrollLabel: string;
  /** One `ConversationTurn` per question and answer. */
  children: ReactNode;
  /**
   * Usually `PromptComposer`. It stays at the bottom of the page while the page scrolls.
   * Leave no padding under the conversation, or the footer shifts by that much as it docks.
   */
  footer: ReactNode;
  /** Id of the latest turn. When it changes, the view eases there. On mount it jumps. */
  followKey?: string;
  /** Height of whatever is stuck to the top of the page, in pixels. */
  topInset?: number;
  /**
   * For a pane or a window with a height of its own: the messages scroll in their own box
   * and the footer stands under it, outside the scrolling, so new content cannot move it.
   * Only `followKey` scrolls here. What others write stays below, behind the scroll button.
   */
  isContained?: boolean;
  /** Called every time the end is in view: whatever is there has now been seen. */
  onReachEnd?: () => void;
  /** Messages waiting below. The scroll button shows the number. */
  newCount?: number;
}
```

```ts
export interface CopyButtonProps extends Pick<ButtonProps, "fullWidth" | "size" | "variant"> {
  value: string;
  label: string;
  copiedLabel: string;
  isLabelVisible?: boolean;
}
```

```ts
export interface CountBadgeProps {
  count: number;
}
```

```ts
export interface DeliveryStatusProps {
  status: Delivery;
  /** Shown on hover and read out by screen readers. */
  labels: Record<Delivery, string>;
}
```

```ts
export interface DetailRowProps {
  label: ReactNode;
  value?: ReactNode;
  action?: ReactNode;
}
```

```ts
export interface DonutChartProps {
  label: string;
  /** Limited to three slices, group the rest into one. */
  data: readonly [DonutSlice, DonutSlice?, DonutSlice?];
  /** Main figure shown in the middle. */
  center?: ReactNode;
  format?: Formatter;
  height?: number;
}
```

```ts
export interface DonutSlice {
  label: string;
  value: number;
}
```

```ts
export interface DraggableProps {
  /** What a target receives. Targets are `ItemList` rows with `drop`. */
  value: string;
  /** Follows the pointer and shows in the row where it would land. A short name, not the row. */
  preview: ReactNode;
  isDisabled?: boolean;
  children: ReactNode;
}
```

```ts
export interface EmptyPanelProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}
```

```ts
export interface FileTreeProps {
  label: string;
  files: readonly ChangedFile[];
  onOpen?: (path: string) => void;
}
```

```ts
export interface FrameProps {
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}
```

```ts
export interface FrameTileProps {
  children: ReactNode;
}
```

```ts
export interface ItemListProps<T extends { id: string }> {
  label: string;
  items: readonly T[];
  /** The open item. It stays marked while focus moves elsewhere. */
  currentId?: string | null;
  onOpen: (id: string) => void;
  /** Alt + click or Alt + Enter: the second way to open, usually in its own window. */
  onAltOpen?: (id: string) => void;
  /** What a screen reader and type-ahead get for the row. */
  getText: (item: T) => string;
  /** The row may hold its own buttons, which a plain list box does not allow. */
  renderItem: (item: T) => ReactNode;
  /** Opens on right click, long press and the menu key. `renderItems` returns `Dropdown.Item`s. */
  menu?: { label: string; renderItems: (item: T) => ReactNode };
  /** Rows take what a `Draggable` carries. A row that refuses it does not light up. */
  drop?: {
    canDrop: (item: T, value: string) => boolean;
    onDrop: (item: T, value: string) => void;
    /** Where the dropped value will stand in the row, in px from the end of its content. */
    slot: (item: T) => { top: number; left: number };
  };
}
```

```ts
export interface LoadableProps {
  isLoading: boolean;
  /** Repeats the layout of the content, so nothing jumps when it arrives. */
  skeleton: ReactNode;
  children: ReactNode;
}
```

```ts
export interface MediaStageProps<T extends { id: string }> {
  label: string;
  items: readonly T[];
  /** The tile that takes the stage. The others shrink into a strip beside it. */
  focusId?: string | null;
  /** Each item keeps its tile while the layout changes, so a live video never restarts. */
  renderItem: (item: T) => ReactNode;
  /** Stands in the strip when not everyone fits. */
  more: { label: (count: number) => string; onPress: () => void };
}
```

```ts
export interface MediaTileProps {
  /** Who or what the tile shows. It stays readable over any picture. */
  name: string;
  /** The picture: `StreamVideo`, an image, or an avatar that stands in the middle. */
  children: ReactNode;
  /** `contain` shows a whole screen, `cover` fills the tile with a face. */
  fit?: "cover" | "contain";
  isSpeaking?: boolean;
  /** Short state icons next to the name. */
  status?: ReactNode;
  /** Buttons in the corner. Shown on hover and focus, always on touch. */
  actions?: ReactNode;
}
```

```ts
export interface MessageProps {
  /** `contact` is the other person in a chat: a bubble on the left. */
  author: "user" | "assistant" | "contact";
  children: ReactNode;
  /** Copy, retry and so on, under the reply. */
  actions?: ReactNode;
  /** A bubble's corner: `DeliveryStatus` and the like. It keeps to the last line. */
  meta?: ReactNode;
  /** Already there when the chat opened, so it does not animate. */
  isHistory?: boolean;
}
```

```ts
export interface ModelPickerProps<M extends string, E extends string> {
  modelLabel: string;
  models: readonly Option<M>[];
  model: M;
  onModelChange: (model: M) => void;
  effortLabel: string;
  efforts: readonly Option<E>[];
  effort: E;
  onEffortChange: (effort: E) => void;
}
```

```ts
export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}
```

```ts
export interface PageLoaderProps {
  isLoading: boolean;
  /** One shape on a clear background: it becomes a mask, so the colors follow the theme. */
  logo: { src: string; width: number; height: number };
  /** What is happening now. It swaps in place as the work moves on. */
  status: string;
  /** Spoken name of the bar. */
  label: string;
  /** Percent done. Without it the bar runs until the work ends. */
  value?: number;
  /**
   * How long the work may take before the loader appears, in milliseconds.
   * Anything faster never sees it, so a static page opens without a flash.
   */
  delay?: number;
}
```

```ts
export interface PlanProps {
  title: string;
  steps: readonly RunStep[];
  statusLabels: StatusLabels;
  /** Wording of the progress, such as "2 of 4 done". */
  formatProgress: (done: number, total: number) => string;
}
```

```ts
export interface PromptAttachment {
  id: string;
  name: string;
}
```

```ts
export interface PromptComposerProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  /** Sending turns into stopping in the same place, so the way out is always under the cursor. */
  isRunning: boolean;
  submitLabel: string;
  stopLabel: string;
  attachLabel: string;
  removeAttachmentLabel: string;
  attachments: readonly PromptAttachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  /** Model picker and context meter. */
  toolbar?: ReactNode;
  /** The text field, for a window that opens ready to type. */
  inputRef?: Ref<HTMLTextAreaElement>;
}
```

```ts
export interface ReasoningProps {
  /** What the agent is doing right now, then how long it took. */
  label: string;
  isStreaming: boolean;
  children: ReactNode;
}
```

```ts
export interface RunProps {
  steps: readonly RunStep[];
  statusLabels: StatusLabels;
  /** Shown once nothing is running. A running step always takes the header. */
  summary: string;
  isDefaultExpanded?: boolean;
}
```

```ts
export interface RunStep {
  id: string;
  title: string;
  status: AgentStatus;
  /** One short fact. It sits on the title line, so a late note never moves the rows below. */
  note?: string;
  /** Steps of a subagent. They follow their parent with an indent, without a second header. */
  steps?: readonly RunStep[];
  /** Anything worth reading: output, a file tree. */
  detail?: ReactNode;
}
```

```ts
export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { id: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}
```

```ts
export interface ShimmerProps {
  children: string;
  /** Stop it the moment the work ends: a shimmer always means "in progress". */
  isActive?: boolean;
}
```

```ts
export interface SortableColumnProps extends Omit<
  ComponentProps<typeof Table.Column>,
  "allowsSorting" | "children"
> {
  children: ReactNode;
}
```

```ts
export interface Source {
  title: string;
  url: string;
  note?: string;
}
```

```ts
export interface SourcesProps {
  label: string;
  items: readonly Source[];
}
```

```ts
export interface SparklineProps {
  label: string;
  values: readonly number[];
  height?: number;
}
```

```ts
export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  /** Context for the value, such as a change over the previous period. */
  note?: ReactNode;
}
```

```ts
export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  /** `[1]` in the text becomes a citation of the first source. */
  sources?: readonly Source[];
}
```

```ts
export interface StreamVideoProps {
  stream: MediaStream;
  /** Spoken name of the picture. */
  label: string;
  /** A person expects to see their own camera as a mirror. */
  isMirrored?: boolean;
}
```

```ts
export interface SuggestionsProps {
  label: string;
  items: readonly string[];
  onSelect: (item: string) => void;
}
```

```ts
export interface TextSwapProps {
  text: string;
  /** The text is in progress: see `Shimmer`. */
  isShimmering?: boolean;
}
```

```ts
export interface ToolApproval {
  question: ReactNode;
  approveLabel: string;
  rejectLabel: string;
  onApprove: () => unknown;
  onReject: () => unknown;
}
```

```ts
export interface ToolCallProps {
  title: string;
  /** The real tool name, for those who want to know what actually ran. */
  name: string;
  status: AgentStatus;
  statusLabels: StatusLabels;
  /** Arguments and result. Usually `CodeOutput`. */
  children?: ReactNode;
  /** Shown only while `status` is `waiting`: the agent cannot go on without an answer. */
  approval?: ToolApproval;
}
```

```ts
export interface TreeNavNode {
  id: string;
  label: string;
  /** An icon or an avatar. */
  leading?: ReactNode;
  /** A short status or count, next to the right edge. */
  trailing?: ReactNode;
  /** A group only opens and closes: it is never the current item. */
  isGroup?: boolean;
  children?: readonly TreeNavNode[];
}
```

```ts
export interface TreeNavProps {
  label: string;
  nodes: readonly TreeNavNode[];
  /** Pass it to show the current item. Without it rows act as plain actions. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}
```
