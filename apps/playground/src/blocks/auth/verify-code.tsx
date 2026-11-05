import { Box, Button, InputOTP, Spinner, Text, toast, useLoadingIndicator } from "@anyglade/kit";
import { Check } from "@anyglade/kit/icons";
import { useEffect, useState } from "react";
import { simulateRequest } from "../../simulate.ts";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const WRONG_CODE = "000000";
const firstSlots = [0, 1, 2];
const secondSlots = [3, 4, 5];

export function VerifyCodeBlock() {
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [isChecking, setIsChecking] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const isSpinnerVisible = useLoadingIndicator(isChecking);

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
    setIsWrong(false);
    setSecondsLeft(RESEND_SECONDS);
  }

  async function verify(value: string) {
    setIsChecking(true);
    setIsWrong(false);
    await simulateRequest();
    setIsChecking(false);
    if (value === WRONG_CODE) {
      setIsWrong(true);
      setCode("");
    } else {
      setIsVerified(true);
    }
  }

  async function resend() {
    await simulateRequest();
    setSecondsLeft(RESEND_SECONDS);
    toast("Новый код отправлен");
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
        <Text color="muted">Отправили на anna@example.com. Подойдёт любой код, кроме 000000.</Text>
      </Box>
      <InputOTP
        aria-label="Код подтверждения"
        isDisabled={isChecking}
        isInvalid={isWrong}
        maxLength={CODE_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={verify}
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
      {isWrong ? (
        <Text aria-live="polite" color="danger">
          Код не подошёл, попробуйте ещё раз
        </Text>
      ) : null}
      {isSpinnerVisible ? (
        <Spinner aria-label="Проверяем код" size="sm" />
      ) : (
        <Button isDisabled={secondsLeft > 0} size="sm" variant="ghost" onPress={resend}>
          {secondsLeft > 0 ? `Отправить ещё раз через ${secondsLeft} с` : "Отправить ещё раз"}
        </Button>
      )}
    </Box>
  );
}
