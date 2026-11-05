import { Box, Button, Input, Label, Link, Separator, Text, TextField } from "@anyglade/kit";

export function SignInBlock() {
  return (
    <Box
      justifyContent="center"
      paddingHorizontal="l"
      paddingVertical="4xl"
      backgroundColor="background-canvas"
    >
      <Box
        as="form"
        flexDirection="column"
        gap="xl"
        width="100%"
        maxWidth={380}
        padding="xl"
        backgroundColor="background-panel"
        borderRadius="l"
        borderWidth={1}
        borderStyle="solid"
        borderColor="border-secondary"
        onSubmit={(event) => event.preventDefault()}
      >
        <Box flexDirection="column" gap="xs">
          <Text as="h2" variant="heading-xs">
            Вход
          </Text>
          <Text color="muted">Рады видеть вас снова</Text>
        </Box>
        <Box flexDirection="column" gap="l">
          <TextField className="w-full" isRequired name="email" type="email">
            <Label>Почта</Label>
            <Input placeholder="you@example.com" />
          </TextField>
          <TextField className="w-full" isRequired name="password" type="password">
            <Label>Пароль</Label>
            <Input />
          </TextField>
        </Box>
        <Button fullWidth type="submit">
          Войти
        </Button>
        <Separator />
        <Button fullWidth variant="secondary">
          Войти по ссылке на почту
        </Button>
        <Box justifyContent="center" gap="xs">
          <Text as="span" color="muted">
            Нет аккаунта?
          </Text>
          <Link href="#SignIn">Создать</Link>
        </Box>
      </Box>
    </Box>
  );
}
