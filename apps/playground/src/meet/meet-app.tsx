import {
  Box,
  Button,
  Drawer,
  EmptyPanel,
  FloatingPanel,
  Input,
  Loadable,
  Modal,
  Skeleton,
  Text,
  toast,
  tokens,
} from "@anyglade/kit";
import { ArrowRightFromSquare, LinkSlash } from "@anyglade/kit/icons";
import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { CallTimer, MicButton, SoundButton } from "./controls.tsx";
import {
  ME,
  personById,
  seedChannels,
  type Channel,
  type Member,
  type VoiceChannel,
} from "./data.ts";
import { InviteModal } from "./invite.tsx";
import { ParticipantList, RemoveDialog, VolumeModal } from "./participants.tsx";
import { Lobby, LockedRoom, Room } from "./room.tsx";
import { CallDock, ChannelColumn, SpaceRail, type MemberMoves } from "./sidebar.tsx";
import { TextChannelView } from "./text-channel.tsx";
import {
  buildTiles,
  parseCarried,
  screenTileId,
  speakerOf,
  TileView,
  type PersonActions,
} from "./tiles.tsx";
import { isInviteHash, resolveInvite, useInvites } from "./use-invites.ts";
import { useLocalMedia } from "./use-local-media.ts";
import { useMeet } from "./use-meet.ts";

const LOAD_MS = 700;
const WINDOW_SIZE = { width: tokens.widths.panel, height: 320 };

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const list = matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => matchMedia(query).matches,
  );
}

function useIsOnline() {
  return useSyncExternalStore(
    (notify) => {
      addEventListener("online", notify);
      addEventListener("offline", notify);
      return () => {
        removeEventListener("online", notify);
        removeEventListener("offline", notify);
      };
    },
    () => navigator.onLine,
  );
}

const focusOnOpen = (input: HTMLInputElement | null) => input?.focus();

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Where an invite in the address leads: a channel, nowhere, or no invite at all. */
function readArrival(channels: readonly Channel[]): VoiceChannel | "expired" | null {
  if (!isInviteHash(location.hash)) {
    return null;
  }
  const channelId = resolveInvite(location.hash);
  return (
    channels.find((item): item is VoiceChannel => item.id === channelId && item.kind === "voice") ??
    "expired"
  );
}

function MeetSkeleton() {
  return (
    <Box
      height="100%"
      width="100%"
      gap="s"
      paddingHorizontal={{ base: "none", md: "s" }}
      paddingBottom={{ base: "none", md: "s" }}
    >
      <Box flexDirection="column" gap="xs" flexShrink={0} padding="s">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="size-10 rounded-full" />
        ))}
      </Box>
      <Box
        flexDirection="column"
        gap="xs"
        flexGrow={{ base: 1, md: 0 }}
        width={{ md: 256 }}
        padding="s"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-lg" />
        ))}
      </Box>
      <Box
        display={{ base: "none", md: "flex" }}
        flexGrow={1}
        minWidth={0}
        backgroundColor="background-panel"
        borderRadius="l"
      />
    </Box>
  );
}

interface NewSpaceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate: (name: string) => void;
}

function NewSpaceModal({ isOpen, onOpenChange, onCreate }: NewSpaceModalProps) {
  const [name, setName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      onOpenChange(false);
    }
  }

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>New space</Modal.Heading>
            </Modal.Header>
            <Box as="form" flexDirection="column" gap="l" onSubmit={submit}>
              <Modal.Body>
                <Input
                  ref={focusOnOpen}
                  aria-label="Space name"
                  fullWidth
                  placeholder="For example, Marketing"
                  value={name}
                  variant="secondary"
                  onChange={(event) => setName(event.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="tertiary">
                  Cancel
                </Button>
                <Button isDisabled={!name.trim()} type="submit">
                  Create space
                </Button>
              </Modal.Footer>
            </Box>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export function MeetApp() {
  const meet = useMeet();
  const media = useLocalMedia();
  const { call, channels, members, self, spaces, tick } = meet;
  const isWide = useMediaQuery(`(min-width: ${tokens.breakpoints.md})`);
  const isDesktop = useMediaQuery(`(min-width: ${tokens.breakpoints.xl})`);
  const isOnline = useIsOnline();

  const invites = useInvites();
  const [arrival] = useState(() => readArrival(seedChannels));
  const invited = arrival && arrival !== "expired" ? arrival : null;
  const [isLoading, setIsLoading] = useState(true);
  const [spaceId, setSpaceId] = useState(invited?.spaceId ?? "sales");
  const [openIds, setOpenIds] = useState<Record<string, string>>(
    invited ? { [invited.spaceId]: invited.id } : { sales: "standup" },
  );
  const [isPaneOpen, setIsPaneOpen] = useState(invited !== null);
  const [invitedId, setInvitedId] = useState(invited?.id ?? null);
  const [isLinkExpired, setIsLinkExpired] = useState(arrival === "expired");
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isWindowDismissed, setIsWindowDismissed] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [volumeId, setVolumeId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  const liveChannelId = call.status === "live" ? call.channelId : null;
  const activeChannelId = call.status === "idle" ? null : call.channelId;
  const selfMember: Member = useMemo(
    () => ({
      personId: ME,
      isMuted: self.isMuted,
      hasCamera: media.camera.status === "on",
      hasHand: self.hasHand,
      isSharing: media.screen.status === "on",
      connection: isOnline ? "good" : "weak",
    }),
    [self.isMuted, self.hasHand, media.camera.status, media.screen.status, isOnline],
  );

  const liveMembers = liveChannelId ? members[liveChannelId] : undefined;
  const roster = useMemo(
    () => (liveMembers ? [...liveMembers, selfMember] : []),
    [liveMembers, selfMember],
  );
  const rosterOf = (channelId: string): readonly Member[] =>
    channelId === liveChannelId ? roster : (members[channelId] ?? []);

  const spaceChannels = channels.filter((channel) => channel.spaceId === spaceId);
  const fallbackId = spaceChannels.find((channel) => channel.kind === "text")?.id;
  const openId = openIds[spaceId] ?? fallbackId ?? null;
  const open = spaceChannels.find((channel) => channel.id === openId);
  const liveChannel = channels.find(
    (channel): channel is VoiceChannel => channel.id === liveChannelId && channel.kind === "voice",
  );
  const activeChannel = channels.find((channel) => channel.id === activeChannelId);
  const speakerId = speakerOf(roster, tick);
  const isInRoom = liveChannelId !== null && open?.id === liveChannelId;
  const focusId = pinnedId;
  const canModerate = liveChannel?.organizerId === ME;
  const invitingChannel = channels.find((channel) => channel.id === invitingId);
  const isPaneOnScreen = isWide || isPaneOpen;
  const isRoomOnScreen = isInRoom && isPaneOnScreen;
  const isWindowOpen = isWide && !isInRoom && !isWindowDismissed;

  const personActions: PersonActions = {
    canModerate,
    focusId,
    onPin: setPinnedId,
    onMute: (personId) => {
      if (liveChannelId) {
        meet.updateMember(liveChannelId, personId, { isMuted: true });
      }
    },
    onLowerHand: (personId) => {
      if (liveChannelId) {
        meet.updateMember(liveChannelId, personId, { hasHand: false });
      }
    },
    onVolume: setVolumeId,
    onRemove: setRemovingId,
    moveTargets: channels.filter(
      (channel): channel is VoiceChannel =>
        channel.kind === "voice" &&
        channel.spaceId === liveChannel?.spaceId &&
        channel.id !== liveChannelId &&
        !channel.isLocked,
    ),
    onMove: (personId, channelId) => {
      if (liveChannelId) {
        moveMember(liveChannelId, channelId, personId);
      }
    },
  };

  const memberMoves: MemberMoves = {
    // Lands in the list of people, or starts one under the channel name.
    slot: (channel) => ({
      top: Number.parseInt(tokens.spacing[rosterOf(channel.id).length > 0 ? "xs" : "s"]),
      left: Number.parseInt(tokens.spacing.s),
    }),
    canDrag: (channel, member) => member.personId === ME || channel.organizerId === ME,
    canDrop: (channel, value) => !channel.isLocked && parseCarried(value).channelId !== channel.id,
    onDrop: (channel, value) => {
      const { channelId, personId } = parseCarried(value);
      if (personId === ME) {
        void connect(channel);
        openChannel(channel.id);
      } else {
        moveMember(channelId, channel.id, personId);
      }
    },
  };

  useEffect(() => {
    function arrive() {
      const next = readArrival(channels);
      if (next === "expired") {
        setIsLinkExpired(true);
      } else if (next) {
        setIsLinkExpired(false);
        setInvitedId(next.id);
        setSpaceId(next.spaceId);
        setOpenIds((all) => ({ ...all, [next.spaceId]: next.id }));
        setIsPaneOpen(true);
      }
      if (next) {
        history.replaceState(null, "", location.pathname);
      }
    }

    if (isInviteHash(location.hash)) {
      history.replaceState(null, "", location.pathname);
    }
    addEventListener("hashchange", arrive);
    return () => removeEventListener("hashchange", arrive);
  }, [channels]);

  // The room shows the call itself, and leaving it brings the window back.
  if (isInRoom && isWindowDismissed) {
    setIsWindowDismissed(false);
  }

  useEffect(() => {
    if (!liveChannelId) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (isTyping(event.target) || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (event.code === "KeyM") {
        meet.toggleMute();
      } else if (event.code === "KeyV") {
        media.toggleCamera();
      }
    }
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  function selectSpace(id: string) {
    setSpaceId(id);
    setIsLinkExpired(false);
  }

  function openChannel(id: string) {
    setOpenIds((all) => ({ ...all, [spaceId]: id }));
    setIsPaneOpen(true);
    setIsLinkExpired(false);
  }

  function moveMember(fromId: string, toId: string, personId: string) {
    meet.moveMember(fromId, toId, personId);
    const target = channels.find((channel) => channel.id === toId);
    const toastId = toast(`${personById(personId).name} moved to ${target?.name}`, {
      actionProps: {
        children: "Undo",
        onPress: () => {
          meet.moveMember(toId, fromId, personId);
          toast.close(toastId);
        },
      },
    });
  }

  function openInvite(channelId: string) {
    invites.ensure(channelId);
    setInvitingId(channelId);
    setIsInviteOpen(true);
  }

  function resetInvite(channelId: string) {
    const previous = invites.invites[channelId];
    invites.reset(channelId);
    const toastId = toast("The old link no longer works", {
      actionProps: {
        children: "Undo",
        onPress: () => {
          if (previous) {
            invites.restore(channelId, previous);
          }
          toast.close(toastId);
        },
      },
    });
  }

  function returnToCall() {
    if (activeChannel) {
      setSpaceId(activeChannel.spaceId);
      setOpenIds((all) => ({ ...all, [activeChannel.spaceId]: activeChannel.id }));
      setIsPaneOpen(true);
    }
  }

  async function connect(channel: VoiceChannel) {
    media.stopScreen();
    await meet.connect(channel.id);
    const sharing = (members[channel.id] ?? []).find((member) => member.isSharing);
    setPinnedId(sharing ? screenTileId(sharing.personId) : null);
    setIsPeopleOpen(isDesktop);
  }

  function leave() {
    const channel = liveChannel;
    meet.disconnect();
    media.stopScreen();
    media.stopCamera();
    setPinnedId(null);
    setIsPeopleOpen(false);

    if (channel) {
      const toastId = toast(`You left ${channel.name}`, {
        actionProps: {
          children: "Rejoin",
          onPress: () => {
            toast.close(toastId);
            void connect(channel);
          },
        },
      });
    }
  }

  async function shareScreen() {
    if (await media.startScreen(media.screen.status === "on" ? media.screen.mode : "text")) {
      setPinnedId(screenTileId(ME));
    }
  }

  const windowTile = useMemo(() => {
    const tiles = buildTiles(roster);
    return (
      tiles.find((tile) => tile.id === focusId) ??
      tiles.find((tile) => tile.id === speakerId) ??
      tiles[0]
    );
  }, [roster, focusId, speakerId]);

  const people =
    liveChannel && isInRoom ? (
      <ParticipantList
        actions={personActions}
        channelId={liveChannel.id}
        focusId={focusId}
        organizerId={liveChannel.organizerId}
        roster={roster}
        speakerId={speakerId}
        onMuteAll={() => meet.muteAll(liveChannel.id)}
        onPin={setPinnedId}
      />
    ) : null;

  const callStrip =
    call.status === "live" && activeChannel ? (
      <Box
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        gap="s"
        flexShrink={0}
        paddingHorizontal="l"
        paddingBottom="s"
      >
        <Box as="span" display="inline-flex" flexGrow={1} gap="s" minWidth={0} color="text-success">
          <Text as="span" variant="caption" color="inherit" truncate>
            {activeChannel.name}
          </Text>
          <CallTimer startedAt={call.startedAt} />
        </Box>
        <Button size="sm" variant="secondary" onPress={returnToCall}>
          Back to call
        </Button>
      </Box>
    ) : null;

  return (
    <Loadable isLoading={isLoading} skeleton={<MeetSkeleton />}>
      <Box
        height="100%"
        width="100%"
        minHeight={0}
        gap="s"
        paddingHorizontal={{ base: "none", md: "s" }}
        paddingBottom={{ base: "none", md: "s" }}
      >
        <Box
          display={{ base: isPaneOpen ? "none" : "flex", md: "flex" }}
          flexGrow={{ base: 1, md: 0 }}
          flexShrink={0}
          width={{ base: "100%", md: 320 }}
          minHeight={0}
        >
          <SpaceRail
            channels={channels}
            spaceId={spaceId}
            spaces={spaces}
            onCreate={() => setIsCreating(true)}
            onSelect={selectSpace}
          />
          <Box
            flexDirection="column"
            gap="s"
            flexGrow={1}
            minWidth={0}
            minHeight={0}
            paddingVertical="s"
          >
            <ChannelColumn
              channels={spaceChannels}
              moves={memberMoves}
              openId={isWide ? openId : null}
              roster={rosterOf}
              space={spaces.find((space) => space.id === spaceId)}
              speakerId={speakerId}
              onOpen={openChannel}
            />
            {call.status === "live" && activeChannel && !isRoomOnScreen && !isWindowOpen ? (
              <CallDock
                channelName={activeChannel.name}
                isOffline={!isOnline}
                meet={meet}
                startedAt={call.startedAt}
                onLeave={leave}
                onReturn={returnToCall}
              />
            ) : null}
          </Box>
        </Box>
        <Box
          as="main"
          display={{ base: isPaneOpen ? "flex" : "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
          minWidth={0}
          minHeight={0}
          overflowY="hidden"
          backgroundColor="background-panel"
          borderRadius={{ base: "none", md: "l" }}
        >
          {isLinkExpired ? (
            <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>
              <EmptyPanel
                actions={
                  <Button size="sm" variant="secondary" onPress={() => setIsLinkExpired(false)}>
                    Open channels
                  </Button>
                }
                description="The link expired or the organizer reset it. Ask for a new one."
                icon={<LinkSlash />}
                title="This link no longer works"
              />
            </Box>
          ) : null}
          {!isLinkExpired && isPaneOnScreen && open?.kind === "text" ? (
            <TextChannelView
              callStrip={callStrip}
              channel={open}
              draft={meet.drafts[open.id] ?? ""}
              notes={meet.notes[open.id] ?? []}
              typingId={meet.typing[open.id]}
              onBack={() => setIsPaneOpen(false)}
              onDraft={(text) => meet.setDraft(open.id, text)}
              onRead={() => meet.markRead(open.id)}
              onSend={(text, attachments) => meet.send(open.id, text, attachments)}
            />
          ) : null}
          {!isLinkExpired && open?.kind === "voice" && open.isLocked ? (
            <LockedRoom
              channel={open}
              isRequested={meet.requested.includes(open.id)}
              onBack={() => setIsPaneOpen(false)}
              onRequest={() => meet.requestAccess(open.id)}
            />
          ) : null}
          {!isLinkExpired &&
          open?.kind === "voice" &&
          !open.isLocked &&
          call.status === "live" &&
          isInRoom ? (
            <Room
              actions={personActions}
              channel={open}
              focusId={focusId}
              isOffline={!isOnline}
              isPeopleOpen={isPeopleOpen}
              media={media}
              meet={meet}
              roster={roster}
              speakerId={speakerId}
              startedAt={call.startedAt}
              onBack={() => setIsPaneOpen(false)}
              onInvite={() => openInvite(open.id)}
              onLeave={leave}
              onPin={setPinnedId}
              onShare={() => void shareScreen()}
              onTogglePeople={() => setIsPeopleOpen(!isPeopleOpen)}
            />
          ) : null}
          {!isLinkExpired && open?.kind === "voice" && !open.isLocked && !isInRoom ? (
            <Lobby
              activeChannelName={liveChannel?.name ?? null}
              channel={open}
              inside={rosterOf(open.id)}
              isInvited={open.id === invitedId}
              media={media}
              meet={meet}
              onBack={() => setIsPaneOpen(false)}
              onConnect={() => connect(open)}
              onInvite={() => openInvite(open.id)}
            />
          ) : null}
        </Box>
        {isDesktop && isPeopleOpen && people ? (
          <Box
            as="aside"
            aria-label="Call participants"
            flexDirection="column"
            flexShrink={0}
            width={280}
            minHeight={0}
            padding="s"
            motion="fade"
          >
            {people}
          </Box>
        ) : null}
        <Drawer>
          <Drawer.Backdrop
            isOpen={!isDesktop && isPeopleOpen && people !== null}
            onOpenChange={setIsPeopleOpen}
          >
            <Drawer.Content placement={isWide ? "right" : "bottom"}>
              <Drawer.Dialog aria-label="Call participants">
                <Drawer.Body>
                  <Box flexDirection="column" minHeight="100%">
                    {people}
                  </Box>
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
        {liveChannel && windowTile ? (
          <FloatingPanel
            isBodyFlush
            closeLabel="Hide call window"
            isOpen={isWindowOpen}
            moveLabel={`Move call window: ${liveChannel.name}`}
            resize={{ label: "Resize call window", defaultSize: WINDOW_SIZE }}
            title={liveChannel.name}
            onOpenChange={() => setIsWindowDismissed(true)}
          >
            <Box flexDirection="column" flexGrow={1} height="100%" minHeight={0}>
              <Box display="block" flexGrow={1} minHeight={0} paddingHorizontal="s">
                <TileView
                  actions={personActions}
                  camera={media.camera}
                  isFocused={windowTile.id === focusId}
                  screen={media.screen}
                  speakerId={speakerId}
                  tile={windowTile}
                />
              </Box>
              <Box alignItems="center" gap="xs" flexShrink={0} padding="s">
                <MicButton isOn={!self.isMuted} size="sm" onToggle={meet.toggleMute} />
                <SoundButton isOn={!self.isDeafened} size="sm" onToggle={meet.toggleDeafen} />
                <Box display="block" flexGrow={1} />
                <Button size="sm" variant="secondary" onPress={returnToCall}>
                  Back to call
                </Button>
                <Button
                  isIconOnly
                  aria-label="Leave"
                  size="sm"
                  variant="danger-soft"
                  onPress={leave}
                >
                  <ArrowRightFromSquare />
                </Button>
              </Box>
            </Box>
          </FloatingPanel>
        ) : null}
        {invitingId ? (
          <InviteModal
            canManage={invitingChannel?.kind === "voice" && invitingChannel.organizerId === ME}
            channelId={invitingId}
            channelName={invitingChannel?.name ?? ""}
            invite={invites.invites[invitingId]}
            isOpen={isInviteOpen}
            onOpenChange={setIsInviteOpen}
            onReset={() => resetInvite(invitingId)}
            onTerm={(term) => invites.setTerm(invitingId, term)}
          />
        ) : null}
        <VolumeModal
          personId={volumeId}
          volume={meet.volumeOf(volumeId ?? "")}
          onChange={meet.setVolume}
          onClose={() => setVolumeId(null)}
        />
        <RemoveDialog
          personId={removingId}
          onClose={() => setRemovingId(null)}
          onRemove={(personId) => {
            if (liveChannelId) {
              meet.removeMember(liveChannelId, personId);
            }
          }}
        />
        <NewSpaceModal
          isOpen={isCreating}
          onCreate={(name) => {
            const created = meet.createSpace(name);
            setSpaceId(created.spaceId);
            setOpenIds((all) => ({ ...all, [created.spaceId]: created.channelId }));
          }}
          onOpenChange={setIsCreating}
        />
      </Box>
    </Loadable>
  );
}
