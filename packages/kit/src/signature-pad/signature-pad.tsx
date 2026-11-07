/* oxlint-disable jsx-a11y/prefer-tag-over-role -- a drawing surface has to be a canvas, the role names what it shows */
"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button } from "../button/button.tsx";
import { ArrowRotateLeft } from "../icons.ts";
import { Text } from "../text/text.tsx";

export interface SignaturePadProps {
  /** What is being signed, for a screen reader. */
  label: string;
  /** Sits on the line until the first stroke: "Подпишите здесь". */
  placeholder: string;
  clearLabel: string;
  /** A PNG data URL after every stroke, `null` once cleared. */
  onChange: (signature: string | null) => void;
}

const STROKE_WIDTH = 2;

/** A hand-drawn signature. The ink takes the text colour, so it follows the theme. */
export function SignaturePad({ label, placeholder, clearLabel, onChange }: SignaturePadProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const element = canvas.current;
    if (!element) {
      return undefined;
    }
    const fit = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = Math.round(element.clientWidth * ratio);
      const height = Math.round(element.clientHeight * ratio);
      if (element.width === width && element.height === height) {
        return;
      }
      element.width = width;
      element.height = height;
      const context = element.getContext("2d");
      context?.scale(ratio, ratio);
      setIsEmpty(true);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    last.current = point(event);
  }

  function draw(event: PointerEvent<HTMLCanvasElement>) {
    const from = last.current;
    const context = event.currentTarget.getContext("2d");
    if (!from || !context) {
      return;
    }
    const to = point(event);
    const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
    context.strokeStyle = getComputedStyle(event.currentTarget).color;
    context.lineWidth = STROKE_WIDTH;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.quadraticCurveTo(from.x, from.y, middle.x, middle.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    last.current = to;
    setIsEmpty(false);
  }

  function end(event: PointerEvent<HTMLCanvasElement>) {
    if (!last.current) {
      return;
    }
    last.current = null;
    onChange(isEmpty ? null : event.currentTarget.toDataURL("image/png"));
  }

  function clear() {
    const element = canvas.current;
    element?.getContext("2d")?.clearRect(0, 0, element.width, element.height);
    setIsEmpty(true);
    onChange(null);
  }

  return (
    <div className="ag-signature">
      <canvas
        ref={canvas}
        aria-label={label}
        role="img"
        onPointerCancel={end}
        onPointerDown={start}
        onPointerMove={draw}
        onPointerUp={end}
      />
      {isEmpty ? (
        <span className="ag-signature__placeholder">
          <Text as="span" color="subtle">
            {placeholder}
          </Text>
        </span>
      ) : (
        <span className="ag-signature__clear">
          <Button isIconOnly aria-label={clearLabel} size="sm" variant="ghost" onPress={clear}>
            <ArrowRotateLeft />
          </Button>
        </span>
      )}
    </div>
  );
}
