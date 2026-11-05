import type { ComponentType } from "react";

type Modules = Record<string, Record<string, ComponentType>>;

export interface Demo {
  name: string;
  Component: ComponentType;
}

export interface DemoCategory {
  id: string;
  label: string;
  demos: Demo[];
}

function toLabel(id: string) {
  const words = id.replaceAll("-", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function collect(modules: Modules): DemoCategory[] {
  const byCategory = new Map<string, Demo[]>();

  for (const [path, exports] of Object.entries(modules)) {
    const id = path.split("/")[2];
    const entry = Object.entries(exports)[0];
    if (!id || !entry) {
      throw new Error(`${path} must export one component`);
    }
    const [exportName, Component] = entry;
    const demos = byCategory.get(id) ?? [];
    demos.push({ name: exportName.replace(/(Demo|Block)$/, ""), Component });
    byCategory.set(id, demos);
  }

  return [...byCategory.entries()]
    .map(([id, demos]) => ({
      id,
      label: toLabel(id),
      demos: demos.toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));
}

export const componentCategories = collect(
  import.meta.glob<Record<string, ComponentType>>("./demos/*/*.tsx", { eager: true }),
);

export const blockCategories = collect(
  import.meta.glob<Record<string, ComponentType>>("./blocks/*/*.tsx", { eager: true }),
);
