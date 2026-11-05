import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { textColors, textRoles, fontWeights } from "../tokens.ts";

type TextElement =
  | "p"
  | "span"
  | "label"
  | "strong"
  | "em"
  | "small"
  | "code"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export type TextVariant = keyof typeof textRoles;
export type TextColor = keyof typeof textColors | "inherit";
export type TextWeight = keyof typeof fontWeights;
export type TextWrap = "wrap" | "nowrap" | "balance" | "pretty";
export type TextAlign = "left" | "center" | "right";
export type TextFormatter = "number" | "compact" | ((value: string | number) => string);

const DEFAULT_ELEMENT: Record<TextVariant, TextElement> = {
  default: "p",
  title: "p",
  body: "p",
  label: "p",
  caption: "p",
  "heading-2xl": "h1",
  "heading-xl": "h2",
  "heading-l": "h3",
  "heading-m": "h4",
  "heading-s": "h5",
  "heading-xs": "h6",
  "heading-xxs": "h6",
};

const DEFAULT_WRAP: Partial<Record<TextVariant, TextWrap>> = {
  body: "pretty",
  "heading-2xl": "balance",
  "heading-xl": "balance",
  "heading-l": "balance",
};

const numberFormat = new Intl.NumberFormat("en-US");
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact" });

function format(formatter: TextFormatter, value: string | number) {
  if (typeof formatter === "function") {
    return formatter(value);
  }
  const number = Number(value);
  if (Number.isNaN(number)) {
    return String(value);
  }
  return (formatter === "compact" ? compactFormat : numberFormat).format(number);
}

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

export type TextProps<E extends TextElement = "p"> = TextStyleProps & {
  as?: E;
  children?: ReactNode;
} & Omit<
    ComponentPropsWithRef<E>,
    keyof TextStyleProps | "as" | "children" | "className" | "style"
  >;

export function Text<E extends TextElement = "p">({
  as,
  variant = "default",
  color = "inherit",
  weight,
  align,
  wrap,
  monospace,
  tabularNums,
  lineThrough,
  truncate,
  formatter,
  children,
  ...rest
}: TextProps<E>) {
  const resolvedWrap = wrap ?? (truncate ? undefined : DEFAULT_WRAP[variant]);
  const classes = [
    `ag-role-${variant}`,
    color !== "inherit" && `ag-tone-${color}`,
    weight && `ag-weight-${weight}`,
    align && `ag-align-${align}`,
    resolvedWrap && `ag-wrap-${resolvedWrap}`,
    monospace && "ag-mono",
    tabularNums && "ag-tabular",
    lineThrough && "ag-line-through",
    truncate === true && "ag-truncate",
    typeof truncate === "number" && "ag-clamp",
  ].filter(Boolean);

  const style =
    typeof truncate === "number" ? ({ "--ag-lines": truncate } as CSSProperties) : undefined;
  const isFormattable = typeof children === "string" || typeof children === "number";

  return createElement(
    as ?? DEFAULT_ELEMENT[variant],
    { ...rest, className: classes.join(" "), style },
    formatter && isFormattable ? format(formatter, children) : children,
  );
}
