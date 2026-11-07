import { Avatar, Box, Button, Dropdown, Label, MediaTile, StreamVideo, Text } from "@anyglade/kit";
import {
  EllipsisVertical,
  Hand,
  MicrophoneSlash,
  Pin,
  PinSlash,
  Signal,
} from "@anyglade/kit/icons";
import {
  firstName,
  ME,
  personById,
  type Connection,
  type Member,
  type VoiceChannel,
} from "./data.ts";
import shareSlide from "./share-slide.svg";
import type { CameraState, ScreenState } from "./use-local-media.ts";

export type Tile = { id: string } & (
  | { kind: "person"; member: Member }
  | { kind: "screen"; ownerId: string }
);

export const screenTileId = (ownerId: string) => `screen:${ownerId}`;

export function buildTiles(roster: readonly Member[]): Tile[] {
  const screens = roster
    .filter((member) => member.isSharing)
    .map((member): Tile => ({
      id: screenTileId(member.personId),
      kind: "screen",
      ownerId: member.personId,
    }));
  const faces = roster.map((member): Tile => ({ id: member.personId, kind: "person", member }));
  return [...screens, ...faces];
}

/** The current speaker for this tick. Now and then nobody talks, as in a real call. */
export function speakerOf(roster: readonly Member[], tick: number) {
  const voices = roster.filter((member) => !member.isMuted && member.personId !== ME);
  const turn = tick % (voices.length + 1);
  return voices[turn]?.personId ?? null;
}

const SIZES = { s: "size-6", m: "size-8", tile: "rounded-full" };

interface PersonAvatarProps {
  personId: string;
  size?: keyof typeof SIZES;
}

export function PersonAvatar({ personId, size = "m" }: PersonAvatarProps) {
  const person = personById(personId);

  return (
    <Avatar className={SIZES[size]} size="sm">
      {person.photo ? <Avatar.Image alt="" src={person.photo} /> : null}
      <Avatar.Fallback>{person.name.charAt(0)}</Avatar.Fallback>
    </Avatar>
  );
}

/** What follows the pointer while a person is dragged to another channel. */
export function PersonChip({ personId }: { personId: string }) {
  return (
    <>
      <PersonAvatar personId={personId} size="s" />
      <Text as="span" variant="caption">
        {personById(personId).name}
      </Text>
    </>
  );
}

const CARRIED_SEPARATOR = "/";

export const carriedMember = (channelId: string, personId: string) =>
  `${channelId}${CARRIED_SEPARATOR}${personId}`;

export function parseCarried(value: string) {
  const [channelId = "", personId = ""] = value.split(CARRIED_SEPARATOR);
  return { channelId, personId };
}

interface MemberStatusProps {
  hasHand: boolean;
  isMuted: boolean;
  connection: Connection;
}

/** Only what differs from a normal call: raised hand, muted microphone, weak connection. */
export function MemberStatus({ hasHand, isMuted, connection }: MemberStatusProps) {
  return (
    <>
      {hasHand ? (
        <Box as="span" display="inline-flex" color="text-accent">
          <Hand aria-label="Hand raised" />
        </Box>
      ) : null}
      {connection === "weak" ? (
        <Box as="span" display="inline-flex" color="text-warning">
          <Signal aria-label="Weak connection" />
        </Box>
      ) : null}
      {isMuted ? (
        <Box as="span" display="inline-flex" color="text-danger">
          <MicrophoneSlash aria-label="Microphone muted" />
        </Box>
      ) : null}
    </>
  );
}

export interface PersonActions {
  canModerate: boolean;
  focusId: string | null;
  onPin: (id: string | null) => void;
  onMute: (personId: string) => void;
  onLowerHand: (personId: string) => void;
  onVolume: (personId: string) => void;
  onRemove: (personId: string) => void;
  /** The same move as dragging, for touch and the keyboard. */
  moveTargets: VoiceChannel[];
  onMove: (personId: string, channelId: string) => void;
}

interface PersonMenuItemsProps {
  member: Member;
  actions: PersonActions;
  /** A tile has its own pin button, and a row of the list opens with a press. */
  showsPin?: boolean;
}

export function PersonMenuItems({ member, actions, showsPin = false }: PersonMenuItemsProps) {
  const { personId } = member;
  const isSelf = personId === ME;
  const isPinned = actions.focusId === personId;
  const pinLabel = isPinned ? "Unpin" : "Pin to stage";

  return (
    <>
      {showsPin ? (
        <Dropdown.Item
          id="pin"
          textValue={pinLabel}
          onAction={() => actions.onPin(isPinned ? null : personId)}
        >
          <Label>{pinLabel}</Label>
        </Dropdown.Item>
      ) : null}
      {isSelf ? null : (
        <Dropdown.Item
          id="volume"
          textValue="Volume for you"
          onAction={() => actions.onVolume(personId)}
        >
          <Label>Volume for you</Label>
        </Dropdown.Item>
      )}
      {actions.canModerate && !isSelf && !member.isMuted ? (
        <Dropdown.Item
          id="mute"
          textValue="Mute microphone"
          onAction={() => actions.onMute(personId)}
        >
          <Label>Mute microphone</Label>
        </Dropdown.Item>
      ) : null}
      {actions.canModerate && !isSelf && member.hasHand ? (
        <Dropdown.Item
          id="hand"
          textValue="Lower hand"
          onAction={() => actions.onLowerHand(personId)}
        >
          <Label>Lower hand</Label>
        </Dropdown.Item>
      ) : null}
      {actions.canModerate && !isSelf
        ? actions.moveTargets.map((channel) => (
            <Dropdown.Item
              key={channel.id}
              id={`move:${channel.id}`}
              textValue={`Move to ${channel.name}`}
              onAction={() => actions.onMove(personId, channel.id)}
            >
              <Label>Move to {channel.name}</Label>
            </Dropdown.Item>
          ))
        : null}
      {actions.canModerate && !isSelf ? (
        <Dropdown.Item
          id="remove"
          textValue="Remove from channel"
          variant="danger"
          onAction={() => actions.onRemove(personId)}
        >
          <Label>Remove from channel</Label>
        </Dropdown.Item>
      ) : null}
    </>
  );
}

interface TileViewProps {
  tile: Tile;
  camera: CameraState;
  screen: ScreenState;
  speakerId: string | null;
  isFocused: boolean;
  actions: PersonActions;
  /** Without it the tile stays a plain picture, as in the small call window. */
  onPin?: (id: string | null) => void;
}

interface TileButtonsProps extends Pick<TileViewProps, "tile" | "isFocused" | "actions"> {
  onPin: (id: string | null) => void;
}

function TileButtons({ tile, isFocused, actions, onPin }: TileButtonsProps) {
  const name = tile.kind === "person" ? personById(tile.member.personId).name : "screen";

  return (
    <>
      <Button
        isIconOnly
        aria-label={isFocused ? `Unpin ${name}` : `Pin ${name}`}
        aria-pressed={isFocused}
        size="sm"
        variant="secondary"
        onPress={() => onPin(isFocused ? null : tile.id)}
      >
        {isFocused ? <PinSlash /> : <Pin />}
      </Button>
      {tile.kind === "person" && tile.member.personId !== ME ? (
        <Dropdown>
          <Button isIconOnly aria-label={`Actions for ${name}`} size="sm" variant="secondary">
            <EllipsisVertical />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu aria-label={`Actions for ${name}`}>
              <PersonMenuItems actions={actions} member={tile.member} />
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      ) : null}
    </>
  );
}

export function TileView({ camera, screen, speakerId, onPin, ...shared }: TileViewProps) {
  const { tile } = shared;
  const buttons = onPin ? <TileButtons {...shared} onPin={onPin} /> : undefined;

  if (tile.kind === "screen") {
    const isOwn = tile.ownerId === ME;
    const name = isOwn ? "Your screen" : `${firstName(tile.ownerId)}'s screen`;

    return (
      <MediaTile actions={buttons} fit="contain" name={name}>
        {isOwn && screen.status === "on" ? (
          <StreamVideo label={name} stream={screen.stream} />
        ) : (
          <img alt={name} src={shareSlide} />
        )}
      </MediaTile>
    );
  }

  const { member } = tile;
  const person = personById(member.personId);
  const isSelf = member.personId === ME;
  const name = isSelf ? "You" : person.name;

  return (
    <MediaTile
      actions={buttons}
      isSpeaking={speakerId === member.personId}
      name={name}
      status={
        <MemberStatus
          connection={member.connection}
          hasHand={member.hasHand}
          isMuted={member.isMuted}
        />
      }
    >
      {isSelf && camera.status === "on" ? (
        <StreamVideo isMirrored label="Your camera" stream={camera.stream} />
      ) : !isSelf && member.hasCamera && person.photo ? (
        <img alt={person.name} src={person.photo} />
      ) : (
        <PersonAvatar personId={member.personId} size="tile" />
      )}
    </MediaTile>
  );
}
