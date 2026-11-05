"use client";

import { Check, Copy } from "@gravity-ui/icons";
import { useEffect, useState } from "react";
import { Box } from "../box/box.tsx";
import { Button, type ButtonProps } from "../button/button.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { timings } from "../tokens.ts";

export interface CopyButtonProps extends Pick<ButtonProps, "fullWidth" | "size" | "variant"> {
  value: string;
  label: string;
  copiedLabel: string;
  isLabelVisible?: boolean;
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  isLabelVisible = false,
  size = "sm",
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "restored">("idle");
  const isCopied = state === "copied";
  const Icon = isCopied ? Check : Copy;
  const text = isCopied ? copiedLabel : label;

  useEffect(() => {
    if (!isCopied) {
      return undefined;
    }
    const timer = setTimeout(() => setState("restored"), timings.confirmation);
    return () => clearTimeout(timer);
  }, [isCopied]);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setState("copied");
  }

  return (
    <Button
      {...props}
      aria-label={text}
      isIconOnly={!isLabelVisible}
      size={size}
      variant={variant}
      onPress={copy}
    >
      <Box
        key={isCopied ? "copied" : "copy"}
        as="span"
        display="inline-flex"
        motion={state === "idle" ? undefined : "pop"}
      >
        <Icon />
      </Box>
      {isLabelVisible ? <TextSwap text={text} /> : null}
    </Button>
  );
}
