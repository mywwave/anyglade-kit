import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Description,
  Input,
  InputOTP,
  Kbd,
  Label,
  ListBox,
  ListBoxItem,
  Radio,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Text,
  TextField,
} from "@anyglade/kit";
import {
  ArrowRight,
  CircleInfo,
  Comments,
  Envelope,
  FilePlus,
  FloppyDisk,
  LogoApple,
  Pencil,
  Person,
  TrashBin,
} from "@anyglade/kit/icons";
import { useState, type ReactNode } from "react";

const rublesFormat = { style: "currency", currency: "RUB", maximumFractionDigits: 0 } as const;

const ranges = ["1Д", "7Д", "1М", "1Г", "Все"];

const ASSETS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com";

const team = [
  { name: "Анна Смирнова", initials: "АС", image: `${ASSETS}/avatars/blue.jpg` },
  { name: "Илья Воронов", initials: "ИВ", image: `${ASSETS}/avatars/green.jpg` },
  { name: "Мария Ким", initials: "МК", image: `${ASSETS}/avatars/purple.jpg` },
  { name: "Павел Орлов", initials: "ПО", image: `${ASSETS}/avatars/orange.jpg` },
  { name: "Ольга Белова", initials: "ОБ", image: `${ASSETS}/avatars/red.jpg` },
];

const buttonVariants = [
  "primary",
  "secondary",
  "tertiary",
  "danger",
  "danger-soft",
  "ghost",
] as const;

const communities = [
  { name: "Индихакеры", members: 148, author: "Иван", image: `${ASSETS}/docs/oranges.jpeg` },
  { name: "ИИ-команды", members: 362, author: "Мария", image: `${ASSETS}/docs/robot1.jpeg` },
];

interface PanelProps {
  children: ReactNode;
}

function Panel({ children }: PanelProps) {
  return (
    <Box
      flexDirection="column"
      gap="m"
      flexGrow={1}
      minWidth={0}
      padding="l"
      backgroundColor="background-card"
      borderRadius="frame"
    >
      {children}
    </Box>
  );
}

interface DismissiblePanelProps {
  label: string;
  children: ReactNode;
}

function DismissiblePanel({ label, children }: DismissiblePanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Показать снова
      </Button>
    );
  }

  return (
    <Panel>
      <Box position="relative" display="block">
        <Box position="absolute" top={0} right={0}>
          <CloseButton aria-label={label} onPress={() => setIsOpen(false)} />
        </Box>
        {children}
      </Box>
    </Panel>
  );
}

function FieldsExample() {
  return (
    <Box flexDirection="column" gap="xl">
      <TextField className="w-full" isRequired name="showcase-email" type="email">
        <Label>Почта</Label>
        <Input placeholder="anna@example.com" />
        <Description>Никому её не покажем</Description>
      </TextField>
      <Select className="w-full" isRequired placeholder="Выберите">
        <Label>Тариф</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="start" textValue="Старт">
              Старт
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="growth" textValue="Рост">
              Рост
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </Box>
  );
}

function ControlsExample() {
  return (
    <Box alignItems="center" justifyContent="between" gap="m">
      <Checkbox aria-label="Согласие" defaultSelected name="showcase-agree">
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Content>
      </Checkbox>
      <Switch aria-label="Уведомления" defaultSelected>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
      <RadioGroup
        aria-label="Вариант"
        defaultValue="b"
        name="showcase-option"
        orientation="horizontal"
      >
        <Radio aria-label="Первый" value="a">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
          </Radio.Content>
        </Radio>
        <Radio aria-label="Второй" value="b">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
          </Radio.Content>
        </Radio>
      </RadioGroup>
      <Spinner aria-label="Загрузка" size="sm" />
    </Box>
  );
}

function PriceExample() {
  return (
    <Slider className="w-full" defaultValue={25000} formatOptions={rublesFormat} maxValue={100000}>
      <Label>Цена</Label>
      <Slider.Output />
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}

function RangeExample() {
  return (
    <Tabs className="w-full" defaultSelectedKey="1Д">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Период">
          {ranges.map((range) => (
            <Tabs.Tab key={range} id={range}>
              {range}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

function ChannelsExample() {
  return (
    <Tabs className="w-full" defaultSelectedKey="chats">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Канал">
          <Tabs.Tab id="chats">
            <Comments />
            Чаты
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="mail">
            <Envelope />
            Письма
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

interface MenuItemProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  shortcut: string;
  variant?: "danger";
}

function MenuItem({ id, title, description, icon, shortcut, variant }: MenuItemProps) {
  return (
    <ListBoxItem id={id} textValue={title} variant={variant}>
      {icon}
      <Box flexDirection="column" flexGrow={1} minWidth={0}>
        <Label>{title}</Label>
        <Description>{description}</Description>
      </Box>
      <Kbd>
        <Kbd.Abbr keyValue="command" />
        <Kbd.Content>{shortcut}</Kbd.Content>
      </Kbd>
    </ListBoxItem>
  );
}

function MenuExample() {
  return (
    <Panel>
      <Text variant="caption" color="muted">
        Действия
      </Text>
      <ListBox aria-label="Действия" selectionMode="none">
        <MenuItem
          id="new"
          title="Новый файл"
          description="Пустой документ"
          icon={<FilePlus />}
          shortcut="N"
        />
        <MenuItem
          id="edit"
          title="Изменить"
          description="В редакторе"
          icon={<Pencil />}
          shortcut="E"
        />
      </ListBox>
      <Separator />
      <Text variant="caption" color="muted">
        Опасная зона
      </Text>
      <ListBox aria-label="Опасная зона" selectionMode="none">
        <MenuItem
          id="delete"
          title="Удалить"
          description="В корзину"
          icon={<TrashBin />}
          shortcut="D"
          variant="danger"
        />
      </ListBox>
    </Panel>
  );
}

function TeamExample() {
  return (
    <Box justifyContent="center">
      <AvatarGroup>
        {team.map((person) => (
          <Avatar key={person.name}>
            <Avatar.Image alt={person.name} src={person.image} />
            <Avatar.Fallback>{person.initials}</Avatar.Fallback>
          </Avatar>
        ))}
        <Avatar>
          <Avatar.Fallback>+2</Avatar.Fallback>
        </Avatar>
      </AvatarGroup>
    </Box>
  );
}

function VerifyExample() {
  const [code, setCode] = useState("4320");

  return (
    <Box flexDirection="column" alignItems="center" gap="m">
      <Box flexDirection="column" gap="xs">
        <Text variant="title">Подтвердите почту</Text>
        <Text color="muted">Код отправлен на a****@example.com</Text>
      </Box>
      <InputOTP aria-label="Код" maxLength={6} value={code} onChange={setCode}>
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      <Box alignItems="center" gap="xs">
        <Text as="span" color="muted">
          Нет кода?
        </Text>
        <Button size="sm" variant="ghost" onPress={() => setCode("")}>
          Отправить снова
        </Button>
      </Box>
    </Box>
  );
}

function ButtonsExample() {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      gap="s"
      justifyContent="center"
    >
      {buttonVariants.map((variant) => (
        <Button key={variant} fullWidth size="sm" variant={variant}>
          Нажать
        </Button>
      ))}
    </Box>
  );
}

function ProfileExample() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <Panel>
      <Box alignItems="center" justifyContent="between" gap="m">
        <Box alignItems="center" gap="m" minWidth={0}>
          <Avatar>
            <Avatar.Image alt="Анна Смирнова" src={`${ASSETS}/avatars/blue.jpg`} />
            <Avatar.Fallback>АС</Avatar.Fallback>
          </Avatar>
          <Box flexDirection="column" minWidth={0}>
            <Text variant="title" truncate>
              Анна Смирнова
            </Text>
            <Text variant="caption" color="muted" truncate>
              @anna
            </Text>
          </Box>
        </Box>
        <Button
          size="sm"
          variant={isFollowing ? "secondary" : "primary"}
          onPress={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? "Вы читаете" : "Читать"}
        </Button>
      </Box>
      <Text>Делаю биллинг для небольших команд.</Text>
      <Box gap="m">
        <Text as="span" color="muted">
          Читает 4
        </Text>
        <Text as="span" color="muted">
          Читатели {isFollowing ? "97 101" : "97 100"}
        </Text>
      </Box>
    </Panel>
  );
}

function CreditsExample() {
  const [credits, setCredits] = useState(2);

  return (
    <Panel>
      <Box alignItems="center" gap="m">
        <Box color="text-primary" flexShrink={0}>
          <CircleInfo />
        </Box>
        <Box flexDirection="column" flexGrow={1} minWidth={0}>
          <Text variant="title">Осталось кредитов: {credits}</Text>
          <Text variant="caption" color="muted">
            Пополните баланс
          </Text>
        </Box>
        <Button size="sm" variant="secondary" onPress={() => setCredits(credits + 10)}>
          Пополнить
        </Button>
      </Box>
    </Panel>
  );
}

function NotificationsExample() {
  return (
    <Box alignItems="center" justifyContent="between" gap="l" paddingHorizontal="l">
      <Box flexDirection="column" minWidth={0}>
        <Text variant="title">Уведомления</Text>
        <Text variant="caption" color="muted">
          Присылать письма о новых заказах
        </Text>
      </Box>
      <Switch aria-label="Уведомления о заказах" defaultSelected>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </Box>
  );
}

function SignUpExample() {
  return (
    <DismissiblePanel label="Закрыть регистрацию">
      <Box flexDirection="column" alignItems="center" gap="m" textAlign="center">
        <Avatar>
          <Avatar.Fallback>
            <Person />
          </Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column" gap="xs">
          <Text variant="title">Создайте аккаунт</Text>
          <Text color="muted">
            Первый год бесплатно.
            <br />
            Карта не нужна.
          </Text>
        </Box>
        <Button fullWidth>
          Начать
          <ArrowRight />
        </Button>
        <Text variant="caption" color="subtle">
          или
        </Text>
        <Box flexDirection="column" gap="s" width="100%">
          <Button fullWidth variant="secondary">
            <img
              src="https://api.iconify.design/logos/google-icon.svg"
              alt=""
              width={16}
              height={16}
            />
            Продолжить с Google
          </Button>
          <Button fullWidth variant="secondary">
            <LogoApple />
            Продолжить с Apple
          </Button>
        </Box>
      </Box>
    </DismissiblePanel>
  );
}

function CommunitiesExample() {
  return (
    <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="m">
      {communities.map((community) => (
        <Panel key={community.name}>
          <Box display="block" width={48} height={48} overflow="hidden" borderRadius="m">
            <img src={community.image} alt="" width={48} height={48} />
          </Box>
          <Box flexDirection="column" minWidth={0}>
            <Text variant="title" truncate>
              {community.name}
            </Text>
            <Text variant="caption" color="muted">
              {community.members} участников
            </Text>
          </Box>
          <Text variant="caption" color="muted">
            Автор: {community.author}
          </Text>
        </Panel>
      ))}
    </Box>
  );
}

function UnsavedExample() {
  return (
    <DismissiblePanel label="Закрыть предупреждение">
      <Box flexDirection="column" gap="m">
        <Box color="text-warning">
          <FloppyDisk />
        </Box>
        <Box flexDirection="column" gap="xs">
          <Text variant="title">Несохранённые изменения</Text>
          <Text color="muted">Сохранить их или отменить?</Text>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="s">
          <Button fullWidth variant="secondary">
            Отменить
          </Button>
          <Button fullWidth>Сохранить</Button>
        </Box>
      </Box>
    </DismissiblePanel>
  );
}

const column = { flexDirection: "column", gap: "xl", minWidth: 0 } as const;

export function Showcase() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "minmax(0, 1fr)",
        md: "minmax(0, 1fr) minmax(0, 1fr)",
        lg: "minmax(0, 5fr) minmax(0, 7fr) minmax(0, 6fr)",
      }}
      alignItems="start"
      gap="xl"
    >
      <Box {...column}>
        <FieldsExample />
        <ControlsExample />
        <PriceExample />
        <RangeExample />
        <ChannelsExample />
        <MenuExample />
      </Box>
      <Box {...column}>
        <TeamExample />
        <VerifyExample />
        <ButtonsExample />
        <ProfileExample />
        <CreditsExample />
        <NotificationsExample />
      </Box>
      <Box {...column}>
        <SignUpExample />
        <CommunitiesExample />
        <UnsavedExample />
      </Box>
    </Box>
  );
}
