import { Box, Button, InputOTP, Text } from "@anyglade/kit";
import { Check } from "@anyglade/kit/icons";
import { useEffect, useState } from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const firstSlots = [0, 1, 2];
const secondSlots = [3, 4, 5];

export function VerifyCodeBlock() {
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0 || isVerified) {
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, isVerified]);

  function restart() {
    setCode("");
    setIsVerified(false);
    setSecondsLeft(RESEND_SECONDS);
  }

  if (isVerified) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        gap="xl"
        textAlign="center"
        paddingHorizontal="xl"
        paddingVertical="4xl"
      >
        <Box color="text-success">
          <Check />
        </Box>
        <Text as="h2" variant="heading-s">
          Почта подтверждена
        </Text>
        <Button variant="secondary" onPress={restart}>
          Подтвердить другую
        </Button>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      gap="xl"
      textAlign="center"
      paddingHorizontal="l"
      paddingVertical="4xl"
    >
      <Box flexDirection="column" gap="xs">
        <Text as="h2" variant="heading-s">
          Введите код из письма
        </Text>
        <Text color="muted">Отправили на anna@example.com. Подойдёт любой код.</Text>
      </Box>
      <InputOTP
        aria-label="Код подтверждения"
        maxLength={CODE_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={() => setIsVerified(true)}
      >
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
      <Button
        isDisabled={secondsLeft > 0}
        size="sm"
        variant="ghost"
        onPress={() => setSecondsLeft(RESEND_SECONDS)}
      >
        {secondsLeft > 0 ? `Отправить ещё раз через ${secondsLeft} с` : "Отправить ещё раз"}
      </Button>
    </Box>
  );
}
