import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

export interface DropRules {
  canDrop: (value: string) => boolean;
  onDrop: (value: string) => void;
}

interface DragSession {
  value: string;
  preview: ReactNode;
  /** The row that would take the value now. */
  target: HTMLElement | null;
}

const DROP_AREA = ".ag-item-list__drop";

const listeners = new Set<() => void>();
const areas = new WeakMap<HTMLElement, { current: DropRules | undefined }>();
let session: DragSession | null = null;
let isLanding = false;

const getSession = () => session;
const noSession = () => null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSessionTarget = () => session?.target ?? null;

export function publishSession(next: DragSession | null) {
  session = next;
  for (const listener of listeners) {
    listener();
  }
}

export function aimSession(x: number, y: number) {
  if (!session) {
    return;
  }
  const area = document.elementFromPoint(x, y)?.closest<HTMLElement>(DROP_AREA) ?? null;
  const target = area && areas.get(area)?.current?.canDrop(session.value) ? area : null;
  if (target !== session.target) {
    publishSession({ ...session, target });
  }
}

export const rulesOf = (area: HTMLElement) => areas.get(area)?.current;

/** The list keeps still for one frame: the leaving row has already closed its gap by itself. */
export function markLanding() {
  isLanding = true;
  requestAnimationFrame(() => {
    isLanding = false;
  });
}

export const isDropLanding = () => isLanding;

/** Makes a row a target and tells it when something hovers over it. */
export function useDropArea(rules: DropRules | undefined) {
  const [area, setArea] = useState<HTMLDivElement | null>(null);
  const current = useSyncExternalStore(subscribe, getSession, noSession);
  const latest = useRef(rules);

  useEffect(() => {
    latest.current = rules;
  });

  useEffect(() => {
    if (area) {
      areas.set(area, latest);
    }
  }, [area]);

  return {
    setArea,
    isTarget: area !== null && current?.target === area,
    /** Every row keeps it while a drag lasts, so a closing gap does not lose its height. */
    preview: rules && current ? current.preview : null,
  };
}
