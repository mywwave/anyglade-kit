import {
  Box,
  Button,
  ButtonGroup,
  Dropdown,
  Header,
  Label,
  Separator,
  Text,
  Tooltip,
} from "@anyglade/kit";
import {
  ArrowRightFromSquare,
  Check,
  ChevronUp,
  Display,
  Hand,
  Headphones,
  Microphone,
  MicrophoneSlash,
  Persons,
  Video,
  VideoSlash,
  VolumeSlash,
} from "@anyglade/kit/icons";
import { useEffect, useState, type ReactNode } from "react";
import { microphones, speakers } from "./data.ts";
import { canShareScreen, type useLocalMedia } from "./use-local-media.ts";
import type { Meet, SelfState } from "./use-meet.ts";

type Size = "sm" | "md";

const pad = (value: number) => String(value).padStart(2, "0");

export function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const clock = `${pad(minutes % 60)}:${pad(seconds % 60)}`;
  return hours > 0 ? `${hours}:${clock}` : clock;
}

export function CallTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text as="span" variant="caption" color="inherit" tabularNums>
      {formatElapsed(Math.max(0, Math.floor((now - startedAt) / 1000)))}
    </Text>
  );
}

interface HintProps {
  label: string;
  hotkey?: string;
  children: ReactNode;
}

function Hint({ label, hotkey, children }: HintProps) {
  return (
    <Tooltip delay={0}>
      {children}
      <Tooltip.Content>
        <Box as="span" display="inline-flex" alignItems="center" gap="s">
          <Text as="span">{label}</Text>
          {hotkey ? (
            <Text as="span" color="muted" monospace>
              {hotkey}
            </Text>
          ) : null}
        </Box>
      </Tooltip.Content>
    </Tooltip>
  );
}

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  size?: Size;
  hotkey?: string;
}

/** A muted microphone is the one state a person must not miss: they talk and nobody hears. */
export function MicButton({ isOn, onToggle, size = "md", hotkey }: ToggleProps) {
  const label = isOn ? "Mute microphone" : "Unmute microphone";

  return (
    <Hint hotkey={hotkey} label={label}>
      <Button
        isIconOnly
        aria-label={label}
        aria-pressed={!isOn}
        size={size}
        variant={isOn ? "secondary" : "danger-soft"}
        onPress={onToggle}
      >
        {isOn ? <Microphone /> : <MicrophoneSlash />}
      </Button>
    </Hint>
  );
}

export function SoundButton({ isOn, onToggle, size = "md" }: ToggleProps) {
  const label = isOn ? "Mute sound" : "Unmute sound";

  return (
    <Hint label={label}>
      <Button
        isIconOnly
        aria-label={label}
        aria-pressed={!isOn}
        size={size}
        variant={isOn ? "secondary" : "danger-soft"}
        onPress={onToggle}
      >
        {isOn ? <Headphones /> : <VolumeSlash />}
      </Button>
    </Hint>
  );
}

interface CameraButtonProps extends ToggleProps {
  isStarting: boolean;
}

/** A camera that is off is normal, so it stays neutral. */
export function CameraButton({
  isOn,
  isStarting,
  onToggle,
  size = "md",
  hotkey,
}: CameraButtonProps) {
  const label = isOn ? "Turn off camera" : "Turn on camera";

  return (
    <Hint hotkey={hotkey} label={label}>
      <Button
        isIconOnly
        aria-label={label}
        aria-pressed={isOn}
        isPending={isStarting}
        size={size}
        variant="secondary"
        onPress={onToggle}
      >
        {isOn ? <Video /> : <VideoSlash />}
      </Button>
    </Hint>
  );
}

interface DeviceItemProps {
  id: string;
  label: string;
  isCurrent: boolean;
}

function DeviceItem({ id, label, isCurrent }: DeviceItemProps) {
  return (
    <Dropdown.Item id={id} textValue={label}>
      <Label>{label}</Label>
      {isCurrent ? (
        <Box as="span" display="inline-flex" marginLeft="auto">
          <Check />
        </Box>
      ) : null}
    </Dropdown.Item>
  );
}

interface AudioDevicesProps {
  self: SelfState;
  variant: "secondary" | "danger-soft";
  onChange: (change: Partial<SelfState>) => void;
}

function AudioDevices({ self, variant, onChange }: AudioDevicesProps) {
  return (
    <Dropdown>
      <Button isIconOnly aria-label="Choose microphone and speakers" variant={variant}>
        <ChevronUp />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="Microphone and speakers"
          onAction={(key) => {
            const [kind, value] = String(key).split(":");
            onChange(kind === "in" ? { microphone: value } : { speaker: value });
          }}
        >
          <Dropdown.Section aria-label="Microphone">
            <Header>Microphone</Header>
            {microphones.map((name) => (
              <DeviceItem
                key={name}
                id={`in:${name}`}
                isCurrent={name === self.microphone}
                label={name}
              />
            ))}
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section aria-label="Speakers">
            <Header>Speakers</Header>
            {speakers.map((name) => (
              <DeviceItem
                key={name}
                id={`out:${name}`}
                isCurrent={name === self.speaker}
                label={name}
              />
            ))}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

interface CameraDevicesProps {
  cameras: MediaDeviceInfo[];
  cameraId: string | null;
  onSelect: (id: string) => void;
}

/** Browsers name cameras only after permission, so before that there is nothing to choose. */
function CameraDevices({ cameras, cameraId, onSelect }: CameraDevicesProps) {
  return cameras.length > 1 ? (
    <Dropdown>
      <Button isIconOnly aria-label="Choose camera" variant="secondary">
        <ChevronUp />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu aria-label="Camera" onAction={(key) => onSelect(String(key))}>
          {cameras.map((device, position) => (
            <DeviceItem
              key={device.deviceId}
              id={device.deviceId}
              isCurrent={device.deviceId === cameraId}
              label={device.label || `Camera ${position + 1}`}
            />
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  ) : null;
}

interface CallBarProps {
  meet: Meet;
  media: ReturnType<typeof useLocalMedia>;
  peopleCount: number;
  isPeopleOpen: boolean;
  onTogglePeople: () => void;
  onShare: () => void;
  onLeave: () => void;
}

export function CallBar({
  meet,
  media,
  peopleCount,
  isPeopleOpen,
  onTogglePeople,
  onShare,
  onLeave,
}: CallBarProps) {
  const { self } = meet;
  const isSharing = media.screen.status === "on";
  const isCameraOn = media.camera.status === "on";
  const shareLabel = isSharing ? "Stop sharing" : "Share screen";
  const handLabel = self.hasHand ? "Lower hand" : "Raise hand";

  return (
    <Box
      as="footer"
      aria-label="Call controls"
      alignItems="center"
      justifyContent="center"
      gap="s"
      flexShrink={0}
      padding="m"
    >
      <ButtonGroup>
        <MicButton hotkey="M" isOn={!self.isMuted} onToggle={meet.toggleMute} />
        <AudioDevices
          self={self}
          variant={self.isMuted ? "danger-soft" : "secondary"}
          onChange={meet.patchSelf}
        />
      </ButtonGroup>
      <ButtonGroup>
        <CameraButton
          hotkey="V"
          isOn={isCameraOn}
          isStarting={media.camera.status === "starting"}
          onToggle={media.toggleCamera}
        />
        <CameraDevices
          cameraId={media.cameraId}
          cameras={media.cameras}
          onSelect={media.startCamera}
        />
      </ButtonGroup>
      {canShareScreen() ? (
        <Hint label={shareLabel}>
          <Button
            isIconOnly
            aria-label={shareLabel}
            aria-pressed={isSharing}
            variant={isSharing ? "primary" : "secondary"}
            onPress={isSharing ? media.stopScreen : onShare}
          >
            <Display />
          </Button>
        </Hint>
      ) : null}
      <Hint label={handLabel}>
        <Button
          isIconOnly
          aria-label={handLabel}
          aria-pressed={self.hasHand}
          variant={self.hasHand ? "primary" : "secondary"}
          onPress={() => meet.patchSelf({ hasHand: !self.hasHand })}
        >
          <Hand />
        </Button>
      </Hint>
      <Button
        aria-expanded={isPeopleOpen}
        aria-label={`Participants: ${peopleCount}`}
        variant={isPeopleOpen ? "secondary" : "ghost"}
        onPress={onTogglePeople}
      >
        <Persons />
        <Text as="span" tabularNums>
          {peopleCount}
        </Text>
      </Button>
      <Box display={{ base: "none", md: "flex" }} marginLeft="l">
        <Button variant="danger" onPress={onLeave}>
          Leave
        </Button>
      </Box>
      <Box display={{ base: "flex", md: "none" }}>
        <Button isIconOnly aria-label="Leave" variant="danger" onPress={onLeave}>
          <ArrowRightFromSquare />
        </Button>
      </Box>
    </Box>
  );
}
