import { Box, Text } from "@anyglade/kit";
import { DeliveryStatus, Message, type Delivery } from "@anyglade/kit/ai";

const labels = {
  sending: "Отправляется",
  sent: "Отправлено",
  delivered: "Доставлено",
  read: "Прочитано",
};

const statuses: Delivery[] = ["sending", "sent", "delivered", "read"];

export function DeliveryStatusDemo() {
  return (
    <Box flexDirection="column" gap="s" width="100%" maxWidth={480}>
      {statuses.map((status) => (
        <Message
          key={status}
          isHistory
          author="user"
          meta={<DeliveryStatus labels={labels} status={status} />}
        >
          <Text>Договор ушёл на подпись</Text>
        </Message>
      ))}
    </Box>
  );
}
