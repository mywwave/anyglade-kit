import { Box, Button, CountBadge, Draggable, ItemList, Text, Tooltip } from "@anyglade/kit";
import {
  ArrowRightFromSquare,
  Hashtag,
  Lock,
  MicrophoneSlash,
  Plus,
  VolumeFill,
} from "@anyglade/kit/icons";
import type { ComponentType, ReactNode } from "react";
import {
  personById,
  type Channel,
  type Member,
  type Space,
  type TextChannel,
  type VoiceChannel,
} from "./data.ts";
import { CallTimer, MicButton, SoundButton } from "./controls.tsx";
import { carriedMember, PersonAvatar, PersonChip } from "./tiles.tsx";
import type { Meet } from "./use-meet.ts";

interface SpaceRailProps {
  spaces: Space[];
  channels: Channel[];
  spaceId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const unreadOf = (channels: Channel[], spaceId: string) =>
  channels.reduce(
    (sum, channel) =>
      channel.spaceId === spaceId && channel.kind === "text" ? sum + channel.unread : sum,
    0,
  );

export function SpaceRail({ spaces, channels, spaceId, onSelect, onCreate }: SpaceRailProps) {
  return (
    <Box
      as="nav"
      aria-label="Spaces"
      flexDirection="column"
      alignItems="center"
      gap="m"
      flexShrink={0}
      minHeight={0}
      overflowY="auto"
      padding="s"
    >
      {spaces.map(({ id, name, icon: Icon }) => {
        const unread = unreadOf(channels, id);

        return (
          <Box key={id} display="block" position="relative">
            <Tooltip delay={0}>
              <Button
                isIconOnly
                aria-current={id === spaceId ? "page" : undefined}
                aria-label={unread > 0 ? `${name}, ${unread} unread` : name}
                variant={id === spaceId ? "secondary" : "ghost"}
                onPress={() => onSelect(id)}
              >
                <Icon />
              </Button>
              <Tooltip.Content placement="right">
                <Text as="p">{name}</Text>
              </Tooltip.Content>
            </Tooltip>
            {unread > 0 ? (
              <Box position="absolute" top={-4} right={-4} pointerEvents="none">
                <CountBadge count={unread} />
              </Box>
            ) : null}
          </Box>
        );
      })}
      <Tooltip delay={0}>
        <Button isIconOnly aria-label="New space" variant="ghost" onPress={onCreate}>
          <Plus />
        </Button>
        <Tooltip.Content placement="right">
          <Text as="p">New space</Text>
        </Tooltip.Content>
      </Tooltip>
    </Box>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Box display="block" paddingHorizontal="s">
      <Text variant="caption" color="muted">
        {children}
      </Text>
    </Box>
  );
}

interface ChannelNameProps {
  icon: ComponentType;
  name: string;
  isStrong?: boolean;
  trailing?: ReactNode;
}

function ChannelName({ icon: Icon, name, isStrong = false, trailing }: ChannelNameProps) {
  return (
    <Box alignItems="center" gap="s" minWidth={0}>
      <Box as="span" display="inline-flex" color="text-secondary" flexShrink={0}>
        <Icon />
      </Box>
      <Box as="span" display="block" flexGrow={1} minWidth={0}>
        <Text as="span" weight={isStrong ? "medium" : undefined} truncate>
          {name}
        </Text>
      </Box>
      {trailing}
    </Box>
  );
}

function RoomPerson({ member, speakerId }: { member: Member; speakerId: string | null }) {
  const isSpeaking = member.personId === speakerId;

  return (
    <Box alignItems="center" gap="s" minWidth={0} data-speaking={isSpeaking ? "" : undefined}>
      <PersonAvatar personId={member.personId} size="s" />
      <Box as="span" display="block" flexGrow={1} minWidth={0}>
        <Text as="span" variant="caption" color={isSpeaking ? "default" : "muted"} truncate>
          {personById(member.personId).name}
        </Text>
      </Box>
      {member.isMuted ? (
        <Box as="span" display="inline-flex" color="text-tertiary">
          <MicrophoneSlash aria-label="Microphone muted" />
        </Box>
      ) : null}
    </Box>
  );
}

export interface MemberMoves {
  canDrag: (channel: VoiceChannel, member: Member) => boolean;
  canDrop: (channel: VoiceChannel, value: string) => boolean;
  onDrop: (channel: VoiceChannel, value: string) => void;
  slot: (channel: VoiceChannel) => { top: number; left: number };
}

interface ChannelColumnProps {
  moves: MemberMoves;
  space: Space | undefined;
  channels: Channel[];
  openId: string | null;
  roster: (channelId: string) => readonly Member[];
  speakerId: string | null;
  onOpen: (id: string) => void;
}

export function ChannelColumn({
  moves,
  space,
  channels,
  openId,
  roster,
  speakerId,
  onOpen,
}: ChannelColumnProps) {
  const texts = channels.filter((channel): channel is TextChannel => channel.kind === "text");
  const voices = channels.filter((channel): channel is VoiceChannel => channel.kind === "voice");

  return (
    <Box flexDirection="column" gap="l" flexGrow={1} minHeight={0} overflowY="auto">
      <Box display="block" paddingHorizontal="s" paddingTop="s">
        <Text variant="title" truncate>
          {space?.name}
        </Text>
      </Box>
      <Box flexDirection="column" gap="xs">
        <SectionTitle>Text channels</SectionTitle>
        <ItemList
          currentId={openId}
          getText={(channel) =>
            channel.unread > 0 ? `${channel.name}, ${channel.unread} unread` : channel.name
          }
          items={texts}
          label="Text channels"
          renderItem={(channel) => (
            <ChannelName
              icon={Hashtag}
              isStrong={channel.unread > 0}
              name={channel.name}
              trailing={channel.unread > 0 ? <CountBadge count={channel.unread} /> : null}
            />
          )}
          onOpen={onOpen}
        />
      </Box>
      <Box flexDirection="column" gap="xs">
        <SectionTitle>Voice channels</SectionTitle>
        <ItemList
          currentId={openId}
          getText={(channel) => {
            const count = roster(channel.id).length;
            return count > 0 ? `${channel.name}, ${count} inside` : channel.name;
          }}
          items={voices}
          label="Voice channels"
          drop={moves}
          renderItem={(channel) => {
            const inside = roster(channel.id);

            return (
              <Box flexDirection="column" gap="s" minWidth={0}>
                <ChannelName icon={channel.isLocked ? Lock : VolumeFill} name={channel.name} />
                {inside.length > 0 ? (
                  <Box flexDirection="column" gap="xs" minWidth={0} paddingLeft="s">
                    {inside.map((member) => (
                      <Draggable
                        key={member.personId}
                        isDisabled={!moves.canDrag(channel, member)}
                        preview={<PersonChip personId={member.personId} />}
                        value={carriedMember(channel.id, member.personId)}
                      >
                        <RoomPerson member={member} speakerId={speakerId} />
                      </Draggable>
                    ))}
                  </Box>
                ) : null}
              </Box>
            );
          }}
          onOpen={onOpen}
        />
      </Box>
    </Box>
  );
}

interface CallDockProps {
  startedAt: number;
  channelName: string;
  isOffline: boolean;
  meet: Meet;
  onReturn: () => void;
  onLeave: () => void;
}

/** Keeps a call within reach when neither the room nor its window is on screen. */
export function CallDock({
  startedAt,
  channelName,
  isOffline,
  meet,
  onReturn,
  onLeave,
}: CallDockProps) {
  return (
    <Box
      flexDirection="column"
      gap="s"
      flexShrink={0}
      padding="s"
      backgroundColor="background-panel"
      borderRadius="l"
      motion="enter"
    >
      <Box flexDirection="column" paddingHorizontal="xs" minWidth={0}>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          gap="xs"
          color={isOffline ? "text-warning" : "text-success"}
        >
          <Text as="span" variant="caption" color="inherit">
            {isOffline ? "Offline" : "Connected"}
          </Text>
          <CallTimer startedAt={startedAt} />
        </Box>
        <Text truncate>{channelName}</Text>
      </Box>
      <Box alignItems="center" gap="xs">
        <MicButton isOn={!meet.self.isMuted} size="sm" onToggle={meet.toggleMute} />
        <SoundButton isOn={!meet.self.isDeafened} size="sm" onToggle={meet.toggleDeafen} />
        <Box display="block" flexGrow={1} />
        <Button size="sm" variant="ghost" onPress={onReturn}>
          Back to call
        </Button>
        <Button isIconOnly aria-label="Leave" size="sm" variant="danger-soft" onPress={onLeave}>
          <ArrowRightFromSquare />
        </Button>
      </Box>
    </Box>
  );
}
