"use client";

import { Button as HeroButton, Spinner } from "@heroui/react";
import { useState, type ComponentProps } from "react";
import type { PressEvent } from "react-aria-components";
import { useFormStatus } from "react-dom";
import { useLoadingIndicator } from "../motion/use-loading-indicator.ts";

type HeroButtonProps = ComponentProps<typeof HeroButton>;

export interface ButtonProps extends Omit<HeroButtonProps, "onPress"> {
  /** Return a promise and the button shows its loader until it settles. */
  onPress?: (event: PressEvent) => unknown;
}

function ButtonRoot({ children, isPending, onPress, type, ...props }: ButtonProps) {
  const [isRunning, setIsRunning] = useState(false);
  const form = useFormStatus();
  const isBusy = Boolean(isPending) || isRunning || (type === "submit" && form.pending);
  const isLoaderVisible = useLoadingIndicator(isBusy);

  function press(event: PressEvent) {
    const result = onPress?.(event);
    if (result instanceof Promise) {
      setIsRunning(true);
      void result.finally(() => setIsRunning(false));
    }
  }

  return (
    <HeroButton
      {...props}
      data-loading={isLoaderVisible || undefined}
      isPending={isBusy || isLoaderVisible}
      type={type}
      onPress={press}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children(values) : children}
          {isLoaderVisible ? <Spinner color="current" size="sm" /> : null}
        </>
      )}
    </HeroButton>
  );
}

export const Button = Object.assign(ButtonRoot, { Root: ButtonRoot });
