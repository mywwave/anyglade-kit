import { Avatar, Box, Button, DetailRow, Stat, Text, toast, tokens } from "@anyglade/kit";
import { Copy } from "@anyglade/kit/icons";
import { formatRubles } from "../format.ts";

const CUSTOMER_ID = "cus_8fK2mQ";

async function copyId() {
  await navigator.clipboard.writeText(CUSTOMER_ID);
  toast("Идентификатор скопирован");
}

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
              <Button
                isIconOnly
                aria-label="Скопировать идентификатор"
                size="sm"
                variant="ghost"
                onPress={copyId}
              >
                <Copy />
              </Button>
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
