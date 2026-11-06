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
import { firstName, ME, type Member, type VoiceChannel } from "./data.ts";
import { PersonAvatar, TileView, buildTiles, type PersonActions } from "./tiles.tsx";
import type { ScreenMode, useLocalMedia } from "./use-local-media.ts";
import type { Meet } from "./use-meet.ts";

type Media = ReturnType<typeof useLocalMedia>;

const screenModes: { id: ScreenMode; label: string }[] = [
  { id: "text", label: "Текст" },
  { id: "motion", label: "Видео" },
];

const countLabel = (count: number) => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens > 10 && tens < 20) return `${count} участников`;
  if (ones === 1) return `${count} участник`;
  return ones > 1 && ones < 5 ? `${count} участника` : `${count} участников`;
};

function BackButton({ onBack, isPadded = false }: { onBack: () => void; isPadded?: boolean }) {
  return (
    <Box display={{ base: "flex", md: "none" }} flexShrink={0} padding={isPadded ? "m" : undefined}>
      <Button isIconOnly aria-label="К списку каналов" size="sm" variant="ghost" onPress={onBack}>
        <ArrowLeft />
      </Button>
    </Box>
  );
}

function whoIsInside(inside: readonly Member[]) {
  if (inside.length === 0) {
    return "Пока никого. Подключитесь первым.";
  }
  const names = inside.slice(0, 2).map((member) => firstName(member.personId));
  const rest = inside.length - names.length;
  return `Внутри: ${names.join(", ")}${rest > 0 ? ` и ещё ${rest}` : ""}`;
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
            <MediaTile name="Вы">
              {media.camera.status === "on" ? (
                <StreamVideo isMirrored label="Ваша камера" stream={media.camera.stream} />
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
                  ? `Вы сейчас в канале «${activeChannelName}»`
                  : `${isInvited ? "Вас пригласили. " : ""}${whoIsInside(inside)}`}
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
            {activeChannelName ? "Перейти в этот канал" : "Подключиться"}
          </Button>
          <Button fullWidth variant="ghost" onPress={onInvite}>
            <PersonPlus />
            Пригласить по ссылке
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
              {isRequested ? "Запрос отправлен" : "Запросить доступ"}
            </Button>
          }
          description={`В канал «${channel.name}» входят по приглашению организатора.`}
          icon={<Lock />}
          title="Закрытый канал"
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
      <Text weight="medium">Вы показываете экран</Text>
      <SegmentedControl
        label="Что важнее в показе"
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
            Звук
          </Switch.Content>
        </Switch>
      ) : null}
      <Box display="block" flexGrow={1} />
      <Button size="sm" variant="ghost" onPress={onReplace}>
        Сменить
      </Button>
      <Button size="sm" variant="danger-soft" onPress={media.stopScreen}>
        Остановить
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
          Пригласить
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
          <Text color="inherit">Нет сети. Вернём вас в звонок, как только она появится.</Text>
        </Box>
      ) : null}
      <ShareBar media={media} onReplace={onShare} />
      <Box display="block" flexGrow={1} minHeight={0} paddingHorizontal="s">
        <MediaStage
          focusId={focusId}
          items={buildTiles(roster)}
          label="Участники звонка"
          more={{
            label: (count) => `Ещё ${count}, показать всех`,
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
