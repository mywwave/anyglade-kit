import { Box, Button, Input, Text, tokens } from "@anyglade/kit";
import { ArrowLeft } from "@anyglade/kit/icons";
import { useState, type FormEvent } from "react";

export function SignInBlock() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordStep, setIsPasswordStep] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
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
        padding={{ base: "xl", md: "4xl" }}
      >
        <Text as="h2" variant="heading-m">
          С возвращением
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
      onSubmit={submit}
    >
      <Box display="block">
        <Text as="h2" variant="heading-m">
          {isPasswordStep ? "Теперь пароль" : "Какая у вас почта?"}
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
            autoComplete="current-password"
            className="w-full"
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
          {isPasswordStep ? "Войти" : "Продолжить"}
        </Button>
      </Box>
      {isPasswordStep ? (
        <Button fullWidth size="sm" variant="ghost" onPress={restart}>
          <ArrowLeft />
          Другая почта
        </Button>
      ) : (
        <Button fullWidth size="sm" variant="ghost">
          Создать аккаунт
        </Button>
      )}
    </Box>
  );
}
