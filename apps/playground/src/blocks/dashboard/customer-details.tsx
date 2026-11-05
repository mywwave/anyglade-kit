import { Avatar, Box, Button, Chip, DetailRow, Frame, FrameTile, Stat, Text } from "@anyglade/kit";
import { Copy } from "@anyglade/kit/icons";
import { formatRubles } from "../format.ts";

export function CustomerDetailsBlock() {
  return (
    <Box display="block" padding={{ base: "l", md: "xl" }}>
      <Frame title="Клиент" meta="С марта 2025">
        <FrameTile>
          <Box alignItems="center" justifyContent="between" gap="l" flexWrap="wrap">
            <Box alignItems="center" gap="m">
              <Avatar>
                <Avatar.Fallback>АС</Avatar.Fallback>
              </Avatar>
              <Box flexDirection="column">
                <Text variant="title">Анна Смирнова</Text>
                <Text variant="caption" color="muted">
                  anna@example.com
                </Text>
              </Box>
            </Box>
            <Chip color="success" size="sm" variant="soft">
              <Chip.Label>Активна</Chip.Label>
            </Chip>
          </Box>
        </FrameTile>
        <Box
          display="grid"
          gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
          gap="xs"
        >
          <FrameTile>
            <Stat label="Всего оплачено" value={formatRubles(184200)} />
            <Stat label="Заказов" value="27" />
          </FrameTile>
          <FrameTile>
            <DetailRow
              label="Идентификатор"
              value="cus_8fK2mQ"
              action={
                <Button isIconOnly aria-label="Скопировать" size="sm" variant="ghost">
                  <Copy />
                </Button>
              }
            />
            <DetailRow label="Тариф" value="Рост" />
            <DetailRow label="Следующее списание" value="12 ноября" />
            <DetailRow label="Компания" />
          </FrameTile>
        </Box>
      </Frame>
    </Box>
  );
}
