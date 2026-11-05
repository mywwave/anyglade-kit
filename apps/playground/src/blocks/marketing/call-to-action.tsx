import { Box, Button, Input, Text } from "@anyglade/kit";
import { useState, type FormEvent } from "react";

export function CallToActionBlock() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
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
        <Text aria-live="polite" variant="body">
          Ссылка для входа отправлена на {sentTo}
        </Text>
      ) : (
        <Box as="form" gap="s" onSubmit={submit}>
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
