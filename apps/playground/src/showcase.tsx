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
  TextSwap,
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
import { useEffect, useState, type ReactNode } from "react";

const dollarsFormat = { style: "currency", currency: "USD", maximumFractionDigits: 0 } as const;

const ranges = ["1D", "7D", "1M", "1Y", "All"];

const ASSETS = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com";

const team = [
  { name: "Anna Smith", initials: "AS", image: `${ASSETS}/avatars/blue.jpg` },
  { name: "Ethan Brooks", initials: "EB", image: `${ASSETS}/avatars/green.jpg` },
  { name: "Maria Kim", initials: "MK", image: `${ASSETS}/avatars/purple.jpg` },
  { name: "Paul Turner", initials: "PT", image: `${ASSETS}/avatars/orange.jpg` },
  { name: "Olivia Bell", initials: "OB", image: `${ASSETS}/avatars/red.jpg` },
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
  { name: "Indie hackers", members: 148, author: "Ivan", image: `${ASSETS}/docs/oranges.jpeg` },
  { name: "AI teams", members: 362, author: "Maria", image: `${ASSETS}/docs/robot1.jpeg` },
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
        Show again
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
        <Label>Email</Label>
        <Input placeholder="anna@example.com" />
        <Description>We never share it</Description>
      </TextField>
      <Select className="w-full" isRequired placeholder="Choose">
        <Label>Plan</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="start" textValue="Starter">
              Starter
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="growth" textValue="Growth">
              Growth
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
      <Checkbox aria-label="Consent" defaultSelected name="showcase-agree">
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Content>
      </Checkbox>
      <Switch aria-label="Notifications" defaultSelected>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
      <RadioGroup
        aria-label="Option"
        defaultValue="b"
        name="showcase-option"
        orientation="horizontal"
      >
        <Radio aria-label="First" value="a">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
          </Radio.Content>
        </Radio>
        <Radio aria-label="Second" value="b">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
          </Radio.Content>
        </Radio>
      </RadioGroup>
      <Spinner aria-label="Loading" size="sm" />
    </Box>
  );
}

function PriceExample() {
  return (
    <Slider className="w-full" defaultValue={250} formatOptions={dollarsFormat} maxValue={1000}>
      <Label>Price</Label>
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
    <Tabs className="w-full" defaultSelectedKey="1D">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Period">
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
        <Tabs.List aria-label="Channel">
          <Tabs.Tab id="chats">
            <Comments />
            Chats
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="mail">
            <Envelope />
            Email
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
        Actions
      </Text>
      <ListBox aria-label="Actions" selectionMode="none">
        <MenuItem
          id="new"
          title="New file"
          description="Blank document"
          icon={<FilePlus />}
          shortcut="N"
        />
        <MenuItem
          id="edit"
          title="Edit"
          description="Open in the editor"
          icon={<Pencil />}
          shortcut="E"
        />
      </ListBox>
      <Separator />
      <Text variant="caption" color="muted">
        Danger zone
      </Text>
      <ListBox aria-label="Danger zone" selectionMode="none">
        <MenuItem
          id="delete"
          title="Delete"
          description="Move to trash"
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

const RESEND_SECONDS = 15;

function VerifyExample() {
  const [code, setCode] = useState("4320");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <Box flexDirection="column" alignItems="center" gap="m">
      <Box flexDirection="column" gap="xs">
        <Text variant="title">Confirm your email</Text>
        <Text color="muted">We sent a code to a****@example.com</Text>
      </Box>
      <InputOTP aria-label="Code" maxLength={6} value={code} onChange={setCode}>
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
          No code?
        </Text>
        <Button
          isDisabled={secondsLeft > 0}
          size="sm"
          variant="ghost"
          onPress={() => {
            setCode("");
            setSecondsLeft(RESEND_SECONDS);
          }}
        >
          <Box as="span" display="block">
            <TextSwap text={secondsLeft > 0 ? "Resend in" : "Resend code"} />
            {secondsLeft > 0 ? (
              <Text as="span" tabularNums variant="label" weight="strong">
                {` ${secondsLeft}s`}
              </Text>
            ) : null}
          </Box>
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
          Press
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
            <Avatar.Image alt="Anna Smith" src={`${ASSETS}/avatars/blue.jpg`} />
            <Avatar.Fallback>AS</Avatar.Fallback>
          </Avatar>
          <Box flexDirection="column" minWidth={0}>
            <Text variant="title" truncate>
              Anna Smith
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
          <TextSwap text={isFollowing ? "Following" : "Follow"} />
        </Button>
      </Box>
      <Text>Building billing for small teams.</Text>
      <Box gap="m">
        <Text as="span" color="muted">
          4 following
        </Text>
        <Text as="span" color="muted" tabularNums>
          {isFollowing ? "97,101" : "97,100"} followers
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
          <Text variant="title">
            Credits left: <TextSwap text={String(credits)} />
          </Text>
          <Text variant="caption" color="muted">
            Top up your balance
          </Text>
        </Box>
        <Button size="sm" variant="secondary" onPress={() => setCredits(credits + 10)}>
          Add 10 credits
        </Button>
      </Box>
    </Panel>
  );
}

function NotificationsExample() {
  const [isOn, setIsOn] = useState(true);

  return (
    <Box alignItems="center" justifyContent="between" gap="l" paddingHorizontal="l">
      <Box flexDirection="column" minWidth={0}>
        <Text variant="title">Notifications</Text>
        <Box key={String(isOn)} display="block" motion="fade">
          <Text variant="caption" color="muted">
            {isOn ? "Email me about new orders" : "Order emails are off"}
          </Text>
        </Box>
      </Box>
      <Switch aria-label="Order notifications" isSelected={isOn} onChange={setIsOn}>
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
    <DismissiblePanel label="Close sign-up">
      <Box flexDirection="column" alignItems="center" gap="m" textAlign="center">
        <Avatar>
          <Avatar.Fallback>
            <Person />
          </Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column" gap="xs">
          <Text variant="title">Create an account</Text>
          <Text color="muted">
            First year free.
            <br />
            No card required.
          </Text>
        </Box>
        <Button fullWidth>
          Get started
          <ArrowRight />
        </Button>
        <Text variant="caption" color="subtle">
          or
        </Text>
        <Box flexDirection="column" gap="s" width="100%">
          <Button fullWidth variant="secondary">
            <img
              src="https://api.iconify.design/logos/google-icon.svg"
              alt=""
              width={16}
              height={16}
            />
            Continue with Google
          </Button>
          <Button fullWidth variant="secondary">
            <LogoApple />
            Continue with Apple
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
              {community.members} members
            </Text>
          </Box>
          <Text variant="caption" color="muted">
            By {community.author}
          </Text>
        </Panel>
      ))}
    </Box>
  );
}

const changeStates = {
  dirty: { title: "Unsaved changes", description: "Save them or discard?" },
  saved: { title: "Changes saved", description: "Your team can see the new version." },
  discarded: { title: "Changes discarded", description: "Restored the last saved version." },
};

type ChangeState = keyof typeof changeStates;

function UnsavedExample() {
  const [state, setState] = useState<ChangeState>("dirty");
  const isDirty = state === "dirty";

  return (
    <DismissiblePanel label="Close warning">
      <Box flexDirection="column" gap="m">
        <Box color="text-warning">
          <FloppyDisk />
        </Box>
        <Box key={state} flexDirection="column" gap="xs" motion="fade">
          <Text variant="title">{changeStates[state].title}</Text>
          <Text color="muted">{changeStates[state].description}</Text>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="s">
          <Button
            fullWidth
            variant="secondary"
            onPress={() => setState(isDirty ? "discarded" : "dirty")}
          >
            <Box key={String(isDirty)} as="span" display="block" motion="fade">
              {isDirty ? "Discard" : "Edit again"}
            </Box>
          </Button>
          <Button fullWidth isDisabled={!isDirty} onPress={() => setState("saved")}>
            <TextSwap text={state === "saved" ? "Saved" : "Save"} />
          </Button>
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
