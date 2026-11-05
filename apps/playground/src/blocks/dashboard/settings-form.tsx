import {
  Box,
  Button,
  Description,
  Input,
  Label,
  Switch,
  Text,
  TextField,
  toast,
  tokens,
} from "@anyglade/kit";
import { useState, type FormEvent, type ReactNode } from "react";

const notificationNames = ["Новые заказы", "Неудачные платежи", "Еженедельный отчёт"] as const;

const savedSettings = {
  company: "ООО «Вектор»",
  email: "billing@example.com",
  notifications: ["Неудачные платежи"] as string[],
};

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Box
      as="section"
      display="grid"
      gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
      gap="xl"
    >
      <Box flexDirection="column" gap="xs">
        <Text as="h3" variant="body" weight="medium">
          {title}
        </Text>
        <Text color="muted">{description}</Text>
      </Box>
      <Box flexDirection="column" gap="l">
        {children}
      </Box>
    </Box>
  );
}

export function SettingsFormBlock() {
  const [saved, setSaved] = useState(savedSettings);
  const [draft, setDraft] = useState(savedSettings);
  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);

  function toggle(name: string, isEnabled: boolean) {
    setDraft((value) => ({
      ...value,
      notifications: isEnabled
        ? [...value.notifications, name]
        : value.notifications.filter((item) => item !== name),
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSaved(draft);
    toast("Настройки сохранены");
  }

  return (
    <Box
      as="form"
      flexDirection="column"
      gap="3xl"
      width="100%"
      maxWidth={tokens.widths.content}
      marginHorizontal="auto"
      padding={{ base: "l", md: "2xl" }}
      onSubmit={submit}
    >
      <SettingsSection title="Организация" description="Эти данные попадут в счета.">
        <TextField
          className="w-full"
          isRequired
          name="company"
          value={draft.company}
          onChange={(company) => setDraft((value) => ({ ...value, company }))}
        >
          <Label>Название</Label>
          <Input />
        </TextField>
        <TextField
          className="w-full"
          isRequired
          name="email"
          type="email"
          value={draft.email}
          onChange={(email) => setDraft((value) => ({ ...value, email }))}
        >
          <Label>Почта для счетов</Label>
          <Input />
          <Description>Сюда придут закрывающие документы.</Description>
        </TextField>
      </SettingsSection>
      <SettingsSection title="Уведомления" description="Письма о важных событиях.">
        {notificationNames.map((name) => (
          <Switch
            key={name}
            isSelected={draft.notifications.includes(name)}
            onChange={(isEnabled) => toggle(name, isEnabled)}
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              {name}
            </Switch.Content>
          </Switch>
        ))}
      </SettingsSection>
      <Box alignItems="center" justifyContent="end" gap="m">
        {isDirty ? (
          <Text aria-live="polite" color="muted">
            Есть несохранённые изменения
          </Text>
        ) : null}
        <Button isDisabled={!isDirty} size="sm" variant="ghost" onPress={() => setDraft(saved)}>
          Отменить
        </Button>
        <Button isDisabled={!isDirty} size="sm" type="submit">
          Сохранить
        </Button>
      </Box>
    </Box>
  );
}
