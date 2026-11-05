import { Box, Button, Input, Text } from "@anyglade/kit";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";

export function CallToActionBlock() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function send() {
    await simulateRequest();
    setSentTo(email);
  }

  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 2fr)" }}
      alignItems="end"
      gap="2xl"
      paddingHorizontal={{ base: "xl", md: "3xl" }}
      paddingVertical="4xl"
      backgroundColor="background-inverse"
      color="text-inverse"
    >
      <Box display="block">
        <Text as="h2" variant="heading-l">
          Первый год бесплатно.
        </Text>
        <Text as="p" variant="heading-l" color="subtle">
          Карта не нужна.
        </Text>
      </Box>
      {sentTo ? (
        <Box flexDirection="column" alignItems="start" gap="m" motion="enter">
          <Text aria-live="polite" variant="body">
            Ссылка для входа отправлена на {sentTo}
          </Text>
          <Button size="sm" variant="secondary" onPress={() => setSentTo(null)}>
            Указать другую почту
          </Button>
        </Box>
      ) : (
        <Box as="form" gap="s" action={send}>
          <Input
            aria-label="Рабочая почта"
            className="w-full"
            placeholder="Рабочая почта"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="secondary">
            Начать
          </Button>
        </Box>
      )}
    </Box>
  );
}
