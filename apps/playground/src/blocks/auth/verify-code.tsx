import { Box, Button, InputOTP, Text } from "@anyglade/kit";

const firstSlots = [0, 1, 2];
const secondSlots = [3, 4, 5];

export function VerifyCodeBlock() {
  return (
    <Box
      justifyContent="center"
      paddingHorizontal="l"
      paddingVertical="4xl"
      backgroundColor="background-canvas"
    >
      <Box
        flexDirection="column"
        alignItems="center"
        gap="xl"
        width="100%"
        maxWidth={380}
        padding="xl"
        textAlign="center"
        backgroundColor="background-panel"
        borderRadius="l"
        borderWidth={1}
        borderStyle="solid"
        borderColor="border-secondary"
      >
        <Box flexDirection="column" gap="xs">
          <Text as="h2" variant="heading-xs">
            Введите код
          </Text>
          <Text color="muted">Мы отправили его на anna@example.com</Text>
        </Box>
        <InputOTP aria-label="Код подтверждения" maxLength={6}>
          <InputOTP.Group>
            {firstSlots.map((index) => (
              <InputOTP.Slot key={index} index={index} />
            ))}
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            {secondSlots.map((index) => (
              <InputOTP.Slot key={index} index={index} />
            ))}
          </InputOTP.Group>
        </InputOTP>
        <Button fullWidth>Подтвердить</Button>
        <Button size="sm" variant="ghost">
          Отправить ещё раз
        </Button>
      </Box>
    </Box>
  );
}
