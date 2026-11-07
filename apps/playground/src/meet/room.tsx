import {
  Box,
  Button,
  EmptyPanel,
  MediaStage,
  MediaTile,
  SegmentedControl,
  Spinner,
  StreamVideo,
  Switch,
  Text,
  tokens,
} from "@anyglade/kit";
import { ArrowLeft, Lock, PersonPlus } from "@anyglade/kit/icons";
import { CameraButton, CallBar, CallTimer, MicButton } from "./controls.tsx";
import { pluralize } from "../crm/format.ts";
import { firstName, ME, type Member, type VoiceChannel } from "./data.ts";
import { PersonAvatar, TileView, buildTiles, type PersonActions } from "./tiles.tsx";
import type { ScreenMode, useLocalMedia } from "./use-local-media.ts";
import type { Meet } from "./use-meet.ts";

type Media = ReturnType<typeof useLocalMedia>;

const screenModes: { id: ScreenMode; label: string }[] = [
  { id: "text", label: "Text" },
  { id: "motion", label: "Video" },
];

const countLabel = (count: number) => `${count} ${pluralize(count, "participant", "participants")}`;

function BackButton({ onBack, isPadded = false }: { onBack: () => void; isPadded?: boolean }) {
  return (
    <Box display={{ base: "flex", md: "none" }} flexShrink={0} padding={isPadded ? "m" : undefined}>
      <Button isIconOnly aria-label="Back to channels" size="sm" variant="ghost" onPress={onBack}>
        <ArrowLeft />
      </Button>
    </Box>
  );
}

function whoIsInside(inside: readonly Member[]) {
  if (inside.length === 0) {
    return "No one here yet. Be the first to join.";
  }
  const names = inside.slice(0, 2).map((member) => firstName(member.personId));
  const rest = inside.length - names.length;
  return `Inside: ${names.join(", ")}${rest > 0 ? ` and ${rest} more` : ""}`;
}

interface LobbyProps {
  channel: VoiceChannel;
  inside: readonly Member[];
  meet: Meet;
  media: Media;
  /** A call in another channel: pressing the button moves there. */
  activeChannelName: string | null;
  isInvited: boolean;
  onConnect: () => Promise<void>;
  onInvite: () => void;
  onBack: () => void;
}

/** A moment to fix the microphone and hair before anyone sees. */
export function Lobby({
  channel,
  inside,
  meet,
  media,
  activeChannelName,
  isInvited,
  onConnect,
  onInvite,
  onBack,
}: LobbyProps) {
  return (
    <Box flexDirection="column" flexGrow={1} minHeight={0} overflowY="auto">
      <BackButton isPadded onBack={onBack} />
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        padding="l"
      >
        <Box flexDirection="column" gap="l" width="100%" maxWidth={tokens.widths.form}>
          <Box display="block" width="100%" aspectRatio="16 / 9">
            <MediaTile name="You">
              {media.camera.status === "on" ? (
                <StreamVideo isMirrored label="Your camera" stream={media.camera.stream} />
              ) : (
                <PersonAvatar personId={ME} size="tile" />
              )}
            </MediaTile>
          </Box>
          <Box alignItems="center" justifyContent="between" gap="m">
            <Box flexDirection="column" minWidth={0}>
              <Text variant="title" truncate>
                {channel.name}
              </Text>
              <Text variant="caption" color="muted" truncate>
                {activeChannelName
                  ? `You are in ${activeChannelName} right now`
                  : `${isInvited ? "You were invited. " : ""}${whoIsInside(inside)}`}
              </Text>
            </Box>
            <Box alignItems="center" gap="s" flexShrink={0}>
              <MicButton isOn={!meet.self.isMuted} onToggle={meet.toggleMute} />
              <CameraButton
                isOn={media.camera.status === "on"}
                isStarting={media.camera.status === "starting"}
                onToggle={media.toggleCamera}
              />
            </Box>
          </Box>
          <Button fullWidth onPress={onConnect}>
            {activeChannelName ? "Switch to this channel" : "Join"}
          </Button>
          <Button fullWidth variant="ghost" onPress={onInvite}>
            <PersonPlus />
            Invite with a link
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

interface LockedRoomProps {
  channel: VoiceChannel;
  isRequested: boolean;
  onRequest: () => void;
  onBack: () => void;
}

export function LockedRoom({ channel, isRequested, onRequest, onBack }: LockedRoomProps) {
  return (
    <Box flexDirection="column" flexGrow={1} minHeight={0}>
      <BackButton isPadded onBack={onBack} />
      <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
        <EmptyPanel
          actions={
            <Button isDisabled={isRequested} size="sm" variant="secondary" onPress={onRequest}>
              {isRequested ? "Request sent" : "Request access"}
            </Button>
          }
          description={`Joining ${channel.name} requires an invitation from the organizer.`}
          icon={<Lock />}
          title="Private channel"
        />
      </Box>
    </Box>
  );
}

function ShareBar({ media, onReplace }: { media: Media; onReplace: () => void }) {
  const { screen } = media;
  if (screen.status !== "on") {
    return null;
  }

  return (
    <Box
      alignItems="center"
      gap="m"
      flexShrink={0}
      flexWrap="wrap"
      paddingHorizontal="l"
      paddingBottom="s"
      motion="fade"
    >
      <Text weight="medium">You are sharing your screen</Text>
      <SegmentedControl
        label="Optimize sharing for"
        options={screenModes}
        value={screen.mode}
        onChange={media.setScreenMode}
      />
      {screen.hasSound ? (
        <Switch isSelected={screen.isSoundOn} size="sm" onChange={media.setScreenSound}>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            Sound
          </Switch.Content>
        </Switch>
      ) : null}
      <Box display="block" flexGrow={1} />
      <Button size="sm" variant="ghost" onPress={onReplace}>
        Change
      </Button>
      <Button size="sm" variant="danger-soft" onPress={media.stopScreen}>
        Stop
      </Button>
    </Box>
  );
}

interface RoomProps {
  channel: VoiceChannel;
  roster: readonly Member[];
  startedAt: number;
  speakerId: string | null;
  focusId: string | null;
  isOffline: boolean;
  isPeopleOpen: boolean;
  meet: Meet;
  media: Media;
  actions: PersonActions;
  onBack: () => void;
  onPin: (id: string | null) => void;
  onShare: () => void;
  onInvite: () => void;
  onTogglePeople: () => void;
  onLeave: () => void;
}

export function Room({
  channel,
  roster,
  startedAt,
  speakerId,
  focusId,
  isOffline,
  isPeopleOpen,
  meet,
  media,
  actions,
  onBack,
  onPin,
  onShare,
  onInvite,
  onTogglePeople,
  onLeave,
}: RoomProps) {
  return (
    <Box flexDirection="column" flexGrow={1} width="100%" minHeight={0}>
      <Box alignItems="center" gap="s" flexShrink={0} paddingHorizontal="l" paddingVertical="m">
        <BackButton onBack={onBack} />
        <Box flexDirection="column" flexGrow={1} minWidth={0}>
          <Text variant="title" truncate>
            {channel.name}
          </Text>
          <Box as="span" display="inline-flex" gap="s" color="text-secondary">
            <Text as="span" variant="caption" color="inherit">
              {countLabel(roster.length)}
            </Text>
            <CallTimer startedAt={startedAt} />
          </Box>
        </Box>
        <Button size="sm" variant="secondary" onPress={onInvite}>
          <PersonPlus />
          Invite
        </Button>
      </Box>
      {isOffline ? (
        <Box
          alignItems="center"
          gap="s"
          flexShrink={0}
          paddingHorizontal="l"
          paddingBottom="s"
          color="text-warning"
          motion="fade"
        >
          <Spinner size="sm" />
          <Text color="inherit">
            You are offline. We will bring you back to the call once the connection returns.
          </Text>
        </Box>
      ) : null}
      <ShareBar media={media} onReplace={onShare} />
      <Box display="block" flexGrow={1} minHeight={0} paddingHorizontal="s">
        <MediaStage
          focusId={focusId}
          items={buildTiles(roster)}
          label="Call participants"
          more={{
            label: (count) => `${count} more, show all`,
            onPress: onTogglePeople,
          }}
          renderItem={(tile) => (
            <TileView
              actions={actions}
              camera={media.camera}
              isFocused={tile.id === focusId}
              screen={media.screen}
              speakerId={speakerId}
              tile={tile}
              onPin={onPin}
            />
          )}
        />
      </Box>
      <CallBar
        isPeopleOpen={isPeopleOpen}
        media={media}
        meet={meet}
        peopleCount={roster.length}
        onLeave={onLeave}
        onShare={onShare}
        onTogglePeople={onTogglePeople}
      />
    </Box>
  );
}
