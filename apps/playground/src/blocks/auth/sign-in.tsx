import { Box, Button, Input, Text, TextSwap, tokens } from "@anyglade/kit";
import { ArrowLeft } from "@anyglade/kit/icons";
import { useState } from "react";
import { simulateRequest } from "../../simulate.ts";

type Intent = "signIn" | "signUp";

const PASSWORD_MIN_LENGTH = 8;

const headings: Record<Intent, { email: string; password: string; done: string; submit: string }> =
  {
    signIn: {
      email: "Какая у вас почта?",
      password: "Теперь пароль",
      done: "С возвращением",
      submit: "Войти",
    },
    signUp: {
      email: "Какая будет почта?",
      password: "Придумайте пароль",
      done: "Аккаунт создан",
      submit: "Создать аккаунт",
    },
  };

export function SignInBlock() {
  const [intent, setIntent] = useState<Intent>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordStep, setIsPasswordStep] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const text = headings[intent];

  async function submit() {
    await simulateRequest(isPasswordStep ? 1000 : 500);
    if (isPasswordStep) {
      setIsSignedIn(true);
    } else {
      setIsPasswordStep(true);
    }
  }

  function restart() {
    setPassword("");
    setIsPasswordStep(false);
    setIsSignedIn(false);
  }

  if (isSignedIn) {
    return (
      <Box
        flexDirection="column"
        alignItems="center"
        gap="xl"
        textAlign="center"
        motion="enter"
        padding={{ base: "xl", md: "4xl" }}
      >
        <Text as="h2" variant="heading-m">
          {text.done}
        </Text>
        <Button variant="secondary" onPress={restart}>
          Выйти
        </Button>
      </Box>
    );
  }

  return (
    <Box
      as="form"
      flexDirection="column"
      gap="xl"
      width="100%"
      maxWidth={tokens.widths.form}
      marginHorizontal="auto"
      paddingHorizontal="l"
      paddingVertical={{ base: "2xl", md: "4xl" }}
      action={submit}
    >
      <Box display="block">
        <Text as="h2" variant="heading-m">
          {isPasswordStep ? text.password : text.email}
        </Text>
        {isPasswordStep ? (
          <Text as="p" variant="heading-m" color="muted" truncate>
            {email}
          </Text>
        ) : null}
      </Box>
      <Box flexDirection="column" gap="m">
        {isPasswordStep ? (
          <Input
            key="password"
            aria-label="Пароль"
            autoComplete={intent === "signUp" ? "new-password" : "current-password"}
            className="w-full"
            minLength={intent === "signUp" ? PASSWORD_MIN_LENGTH : undefined}
            placeholder={intent === "signUp" ? "Минимум 8 символов" : undefined}
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        ) : (
          <Input
            key="email"
            aria-label="Почта"
            autoComplete="email"
            className="w-full"
            placeholder="you@example.com"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        )}
        <Button fullWidth size="lg" type="submit">
          <TextSwap text={isPasswordStep ? text.submit : "Продолжить"} />
        </Button>
      </Box>
      {isPasswordStep ? (
        <Button fullWidth size="sm" variant="ghost" onPress={restart}>
          <ArrowLeft />
          Другая почта
        </Button>
      ) : (
        <Button
          fullWidth
          size="sm"
          variant="ghost"
          onPress={() => setIntent(intent === "signIn" ? "signUp" : "signIn")}
        >
          <TextSwap text={intent === "signIn" ? "Создать аккаунт" : "Уже есть аккаунт"} />
        </Button>
      )}
    </Box>
  );
}
