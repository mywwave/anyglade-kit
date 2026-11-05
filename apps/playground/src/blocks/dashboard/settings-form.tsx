import {
  Box,
  Button,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  Separator,
  Switch,
  Text,
  TextField,
} from "@anyglade/kit";
import type { ReactNode } from "react";

const notifications = ["Новые заказы", "Неудачные платежи", "Еженедельный отчёт"];

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Box
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
  return (
    <Box
      as="form"
      flexDirection="column"
      gap="2xl"
      padding={{ base: "l", md: "2xl" }}
      onSubmit={(event) => event.preventDefault()}
    >
      <SettingsSection title="Организация" description="Эти данные попадут в счета.">
        <TextField className="w-full" defaultValue="ООО «Вектор»" name="company">
          <Label>Название</Label>
          <Input />
        </TextField>
        <TextField className="w-full" defaultValue="billing@example.com" name="email" type="email">
          <Label>Почта для счетов</Label>
          <Input />
          <Description>На этот адрес придут закрывающие документы.</Description>
        </TextField>
        <Select className="w-full" defaultSelectedKey="rub" placeholder="Выберите валюту">
          <Label>Валюта</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="rub" textValue="Рубль">
                Рубль
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="usd" textValue="Доллар">
                Доллар
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </SettingsSection>
      <Separator />
      <SettingsSection title="Уведомления" description="Письма о важных событиях.">
        {notifications.map((name) => (
          <Switch key={name} defaultSelected>
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              {name}
            </Switch.Content>
          </Switch>
        ))}
      </SettingsSection>
      <Separator />
      <Box justifyContent="end" gap="s">
        <Button size="sm" variant="ghost">
          Отменить
        </Button>
        <Button size="sm" type="submit">
          Сохранить
        </Button>
      </Box>
    </Box>
  );
}
