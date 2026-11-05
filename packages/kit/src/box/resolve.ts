import type { CSSProperties } from "react";
import { freeProps, tokenProps, type Condition } from "./props.ts";

export function conditionClass(condition: Condition, name: string) {
  return condition === "base" ? `ag-${name}` : `${condition}:ag-${name}`;
}

export function freeVariable(slug: string, condition: Condition) {
  return condition === "base" ? `--ag-${slug}` : `--ag-${slug}-${condition}`;
}

type StyleValue = string | number | undefined;

function entries(value: unknown): [Condition, StyleValue][] {
  if (typeof value === "object" && value !== null) {
    return Object.entries(value) as [Condition, StyleValue][];
  }
  return [["base", value as StyleValue]];
}

function hasKey<T extends object>(object: T, key: string): key is string & keyof T {
  return Object.hasOwn(object, key);
}

interface ResolvedBox {
  className: string | undefined;
  style: CSSProperties | undefined;
  rest: Record<string, unknown>;
}

export function resolveBox(props: Record<string, unknown>): ResolvedBox {
  const classes: string[] = [];
  const style: Record<string, string> = {};
  const rest: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(props)) {
    if (hasKey(tokenProps, name)) {
      for (const [condition, token] of entries(value)) {
        if (token !== undefined) {
          classes.push(conditionClass(condition, `${tokenProps[name].slug}-${String(token)}`));
        }
      }
    } else if (hasKey(freeProps, name)) {
      const prop = freeProps[name];
      for (const [condition, free] of entries(value)) {
        if (free !== undefined) {
          classes.push(conditionClass(condition, prop.slug));
          const isPixels = "unit" in prop && typeof free === "number" && free !== 0;
          style[freeVariable(prop.slug, condition)] = isPixels ? `${free}px` : String(free);
        }
      }
    } else {
      rest[name] = value;
    }
  }

  return {
    className: classes.length > 0 ? classes.join(" ") : undefined,
    style: Object.keys(style).length > 0 ? (style as CSSProperties) : undefined,
    rest,
  };
}
