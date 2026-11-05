"use client";

import { Check, CheckDouble, Clock } from "@gravity-ui/icons";
import { Tooltip } from "@heroui/react";
import { useState, type ComponentProps } from "react";
import { Box } from "../box/box.tsx";
import { TextSwap } from "../text-swap/text-swap.tsx";
import { Text } from "../text/text.tsx";

export type Delivery = "sending" | "sent" | "delivered" | "read";

const marks = {
  sending: { Icon: Clock, color: "text-tertiary" },
  sent: { Icon: Check, color: "text-secondary" },
  delivered: { Icon: CheckDouble, color: "text-secondary" },
  read: { Icon: CheckDouble, color: "text-success" },
} satisfies Record<Delivery, { Icon: unknown; color: ComponentProps<typeof Box>["color"] }>;

export interface DeliveryStatusProps {
  status: Delivery;
  /** Shown on hover and read out by screen readers. */
  labels: Record<Delivery, string>;
}

/** Ticks on one's own message. They animate on a change, never when a chat opens. */
export function DeliveryStatus({ status, labels }: DeliveryStatusProps) {
  const [firstStatus] = useState(status);
  const { Icon, color } = marks[status];

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger className="ag-status" role="none" tabIndex={-1}>
        <Box
          key={status}
          as="span"
          display="inline-flex"
          color={color}
          motion={status === firstStatus ? undefined : "pop"}
        >
          <Icon />
        </Box>
        <span className="ag-visually-hidden">{labels[status]}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Text as="p">
          <TextSwap text={labels[status]} />
        </Text>
      </Tooltip.Content>
    </Tooltip>
  );
}
