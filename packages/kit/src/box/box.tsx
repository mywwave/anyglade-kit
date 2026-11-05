import { createElement, type ComponentPropsWithRef } from "react";
import type { BoxStyleProps } from "./props.ts";
import { resolveBox } from "./resolve.ts";

type BoxElement =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "nav"
  | "header"
  | "footer"
  | "form"
  | "fieldset"
  | "label"
  | "ul"
  | "ol"
  | "li"
  | "a";

const NON_FLEX_ELEMENTS: ReadonlySet<BoxElement> = new Set(["span", "label", "li", "a"]);

export type BoxProps<E extends BoxElement = "div"> = BoxStyleProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof BoxStyleProps | "as" | "className" | "style">;

export function Box<E extends BoxElement = "div">({ as, ...props }: BoxProps<E>) {
  const element = as ?? "div";
  const display = props.display ?? (NON_FLEX_ELEMENTS.has(element) ? undefined : "flex");
  const { className, style, rest } = resolveBox({ ...props, display });

  return createElement(element, { ...rest, className, style });
}
