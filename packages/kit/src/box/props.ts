import { colors, durations, easings, radii, shadows, spacing } from "../tokens.ts";

type ColorToken = keyof typeof colors;

function keywords<const T extends readonly string[]>(...values: T) {
  return Object.fromEntries(values.map((value) => [value, value])) as Record<T[number], string>;
}

function tokenVars<T extends object>(group: string, tokens: T) {
  return Object.fromEntries(
    Object.keys(tokens).map((name) => [name, `var(--ag-${group}-${name})`]),
  ) as Record<keyof T & string, string>;
}

function colorVars<T extends ColorToken>(prefix: string) {
  return Object.fromEntries(
    Object.keys(colors)
      .filter((name) => name.startsWith(prefix))
      .map((name) => [name, `var(--ag-${name})`]),
  ) as Record<T, string>;
}

const space = tokenVars("space", spacing);
const flexAlign = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
};
const flexJustify = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

const negativeSpace = Object.fromEntries(
  Object.keys(spacing)
    .filter((name) => name !== "none")
    .map((name) => [`-${name}`, `calc(var(--ag-space-${name}) * -1)`]),
) as Record<`-${Exclude<keyof typeof spacing, "none">}`, string>;
const margin = { ...space, ...negativeSpace, auto: "auto" };
const overflow = keywords("hidden", "auto", "scroll", "visible");
const borderWidth = { 0: "0", 1: "1px", 2: "2px" };
const flexFactor = { 0: "0", 1: "1" };

/** Props that accept only named values. Each value becomes one generated class. */
export const tokenProps = {
  padding: { slug: "p", css: "padding", values: space },
  paddingTop: { slug: "pt", css: "padding-top", values: space },
  paddingRight: { slug: "pr", css: "padding-right", values: space },
  paddingBottom: { slug: "pb", css: "padding-bottom", values: space },
  paddingLeft: { slug: "pl", css: "padding-left", values: space },
  paddingHorizontal: { slug: "px", css: "padding-inline", values: space },
  paddingVertical: { slug: "py", css: "padding-block", values: space },

  margin: { slug: "m", css: "margin", values: margin },
  marginTop: { slug: "mt", css: "margin-top", values: margin },
  marginRight: { slug: "mr", css: "margin-right", values: margin },
  marginBottom: { slug: "mb", css: "margin-bottom", values: margin },
  marginLeft: { slug: "ml", css: "margin-left", values: margin },
  marginHorizontal: { slug: "mx", css: "margin-inline", values: margin },
  marginVertical: { slug: "my", css: "margin-block", values: margin },

  gap: { slug: "gap", css: "gap", values: space },
  rowGap: { slug: "row-gap", css: "row-gap", values: space },
  columnGap: { slug: "column-gap", css: "column-gap", values: space },

  backgroundColor: {
    slug: "bg",
    css: "background-color",
    values: colorVars<Extract<ColorToken, `background-${string}`>>("background-"),
    states: true,
  },
  color: {
    slug: "text",
    css: "color",
    values: colorVars<Extract<ColorToken, `text-${string}`>>("text-"),
    states: true,
  },
  borderColor: {
    slug: "border",
    css: "border-color",
    values: colorVars<Extract<ColorToken, `border-${string}`>>("border-"),
    states: true,
  },
  borderRadius: { slug: "rounded", css: "border-radius", values: tokenVars("radius", radii) },
  boxShadow: {
    slug: "shadow",
    css: "box-shadow",
    values: tokenVars("shadow", shadows),
    states: true,
  },

  borderWidth: { slug: "border-w", css: "border-width", values: borderWidth },
  borderTopWidth: { slug: "border-t", css: "border-top-width", values: borderWidth },
  borderRightWidth: { slug: "border-r", css: "border-right-width", values: borderWidth },
  borderBottomWidth: { slug: "border-b", css: "border-bottom-width", values: borderWidth },
  borderLeftWidth: { slug: "border-l", css: "border-left-width", values: borderWidth },
  borderStyle: {
    slug: "border-style",
    css: "border-style",
    values: keywords("solid", "dashed", "none"),
  },

  display: {
    slug: "d",
    css: "display",
    values: keywords("flex", "grid", "block", "inline", "inline-flex", "inline-block", "none"),
  },
  position: {
    slug: "pos",
    css: "position",
    values: keywords("relative", "absolute", "fixed", "sticky", "static"),
  },
  overflow: { slug: "overflow", css: "overflow", values: overflow },
  overflowX: { slug: "overflow-x", css: "overflow-x", values: overflow },
  overflowY: { slug: "overflow-y", css: "overflow-y", values: overflow },

  flexDirection: {
    slug: "flex",
    css: "flex-direction",
    values: keywords("row", "column", "row-reverse", "column-reverse"),
  },
  flexWrap: { slug: "flex-wrap", css: "flex-wrap", values: keywords("wrap", "nowrap") },
  flexGrow: { slug: "grow", css: "flex-grow", values: flexFactor },
  flexShrink: { slug: "shrink", css: "flex-shrink", values: flexFactor },
  alignItems: { slug: "items", css: "align-items", values: flexAlign },
  alignSelf: { slug: "self", css: "align-self", values: { ...flexAlign, auto: "auto" } },
  justifyContent: { slug: "justify", css: "justify-content", values: flexJustify },
  alignContent: { slug: "content", css: "align-content", values: flexJustify },

  textAlign: {
    slug: "align",
    css: "text-align",
    values: keywords("left", "center", "right"),
  },
  cursor: {
    slug: "cursor",
    css: "cursor",
    values: keywords("pointer", "default", "not-allowed", "grab", "text"),
  },
  pointerEvents: { slug: "events", css: "pointer-events", values: keywords("none", "auto") },
  visibility: { slug: "visibility", css: "visibility", values: keywords("visible", "hidden") },
  userSelect: { slug: "select", css: "user-select", values: keywords("none", "text", "all") },

  transitionProperty: {
    slug: "transition",
    css: "transition-property",
    values: {
      none: "none",
      colors: "color, background-color, border-color",
      opacity: "opacity",
      shadow: "box-shadow",
      transform: "transform",
      common: "color, background-color, border-color, box-shadow, opacity, transform",
    },
  },
  transitionDuration: {
    slug: "duration",
    css: "transition-duration",
    values: tokenVars("duration", durations),
  },
  ease: {
    slug: "ease",
    css: "transition-timing-function",
    values: tokenVars("ease", easings),
  },
} as const;

/** Props with free values, passed through a CSS variable set inline. */
export const freeProps = {
  width: { slug: "w", css: "width", unit: "px" },
  height: { slug: "h", css: "height", unit: "px" },
  minWidth: { slug: "min-w", css: "min-width", unit: "px" },
  maxWidth: { slug: "max-w", css: "max-width", unit: "px" },
  minHeight: { slug: "min-h", css: "min-height", unit: "px" },
  maxHeight: { slug: "max-h", css: "max-height", unit: "px" },
  flexBasis: { slug: "basis", css: "flex-basis", unit: "px" },
  top: { slug: "top", css: "top", unit: "px" },
  right: { slug: "right", css: "right", unit: "px" },
  bottom: { slug: "bottom", css: "bottom", unit: "px" },
  left: { slug: "left", css: "left", unit: "px" },
  inset: { slug: "inset", css: "inset", unit: "px" },

  flex: { slug: "flex-v", css: "flex" },
  aspectRatio: { slug: "aspect", css: "aspect-ratio" },
  zIndex: { slug: "z", css: "z-index" },
  gridTemplateColumns: { slug: "cols", css: "grid-template-columns" },
  gridTemplateRows: { slug: "rows", css: "grid-template-rows" },
  gridTemplateAreas: { slug: "areas", css: "grid-template-areas" },
  gridColumn: { slug: "col", css: "grid-column" },
  gridRow: { slug: "row", css: "grid-row" },
  gridArea: { slug: "area", css: "grid-area" },
  opacity: { slug: "opacity", css: "opacity", states: true },
  transform: { slug: "transform", css: "transform", states: true },
} as const;

export const breakpointConditions = ["sm", "md", "lg", "xl"] as const;

export const stateConditions = {
  hover: ":hover",
  focus: ":focus",
  focusVisible: ":focus-visible",
  focusWithin: ":focus-within",
  active: ":active",
} as const;

export type Condition =
  | "base"
  | (typeof breakpointConditions)[number]
  | keyof typeof stateConditions;

export type Responsive<T> = T | Partial<Record<Condition, T>>;

type TokenProps = typeof tokenProps;
type FreeProps = typeof freeProps;

type TokenStyleProps = {
  [K in keyof TokenProps]?: Responsive<keyof TokenProps[K]["values"]>;
};

type FreeStyleProps = {
  [K in keyof FreeProps]?: Responsive<string | number>;
};

export type BoxStyleProps = TokenStyleProps & FreeStyleProps;
