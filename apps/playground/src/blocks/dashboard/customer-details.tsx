import { Avatar, Box, CopyButton, DetailRow, Stat, Text, tokens } from "@anyglade/kit";
import { formatRubles } from "../format.ts";

const CUSTOMER_ID = "cus_8fK2mQ";

export function CustomerDetailsBlock() {
  return (
    <Box
      flexDirection="column"
      gap="2xl"
      width="100%"
      maxWidth={tokens.widths.content}
      marginHorizontal="auto"
      padding={{ base: "l", md: "2xl" }}
    >
      <Box alignItems="center" gap="m">
        <Avatar>
          <Avatar.Fallback>АС</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column">
          <Text as="h2" variant="heading-xxs">
            Анна Смирнова
          </Text>
          <Text color="muted">anna@example.com</Text>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
        gap="2xl"
      >
        <Box flexDirection={{ base: "row", md: "column" }} gap="xl">
          <Stat label="Всего оплачено" value={formatRubles(184200)} />
          <Stat label="Заказов" value="27" />
        </Box>
        <Box flexDirection="column" gap="m">
          <DetailRow
            label="Идентификатор"
            value={
              <Text as="span" monospace>
                {CUSTOMER_ID}
              </Text>
            }
            action={
              <CopyButton
                copiedLabel="Идентификатор скопирован"
                label="Скопировать идентификатор"
                value={CUSTOMER_ID}
              />
            }
          />
          <DetailRow label="Статус" value="Активна" />
          <DetailRow label="Тариф" value="Рост" />
          <DetailRow label="Следующее списание" value="12 ноября" />
          <DetailRow label="Компания" />
        </Box>
      </Box>
    </Box>
  );
}
