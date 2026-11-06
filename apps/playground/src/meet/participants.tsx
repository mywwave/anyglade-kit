import {
  AlertDialog,
  Box,
  Button,
  Draggable,
  ItemList,
  Label,
  Modal,
  Slider,
  Text,
} from "@anyglade/kit";
import { firstName, ME, personById, type Member } from "./data.ts";
import {
  carriedMember,
  MemberStatus,
  PersonAvatar,
  PersonChip,
  PersonMenuItems,
  type PersonActions,
} from "./tiles.tsx";

interface ParticipantRowProps {
  member: Member;
  isSpeaking: boolean;
  isOrganizer: boolean;
}

function ParticipantRow({ member, isSpeaking, isOrganizer }: ParticipantRowProps) {
  const person = personById(member.personId);
  const isSelf = member.personId === ME;

  return (
    <Box alignItems="center" gap="m" minWidth={0}>
      <PersonAvatar personId={member.personId} />
      <Box flexDirection="column" flexGrow={1} minWidth={0}>
        <Text as="span" weight={isSpeaking ? "medium" : undefined} truncate>
          {isSelf ? `${person.name} (вы)` : person.name}
        </Text>
        <Text as="span" variant="caption" color={isSpeaking ? "default" : "muted"} truncate>
          {isSpeaking ? "Говорит" : isOrganizer ? "Организатор" : person.role}
        </Text>
      </Box>
      <Box as="span" display="inline-flex" alignItems="center" gap="xs" flexShrink={0}>
        <MemberStatus
          connection={member.connection}
          hasHand={member.hasHand}
          isMuted={member.isMuted}
        />
      </Box>
    </Box>
  );
}

interface ParticipantListProps {
  channelId: string;
  roster: readonly Member[];
  organizerId: string;
  speakerId: string | null;
  focusId: string | null;
  actions: PersonActions;
  onPin: (id: string | null) => void;
  onMuteAll: () => void;
}

export function ParticipantList({
  channelId,
  roster,
  organizerId,
  speakerId,
  focusId,
  actions,
  onPin,
  onMuteAll,
}: ParticipantListProps) {
  // Raised hands stay on top: the host must not lose them in a long list.
  const items = roster
    .map((member) => ({ ...member, id: member.personId }))
    .toSorted((a, b) => Number(b.hasHand) - Number(a.hasHand));
  const canMuteAll =
    actions.canModerate && roster.some((member) => member.personId !== ME && !member.isMuted);

  return (
    <Box flexDirection="column" gap="s" flexGrow={1} minHeight={0}>
      <Box alignItems="center" justifyContent="between" gap="s" paddingHorizontal="s" height={32}>
        <Box as="span" display="inline-flex" alignItems="baseline" gap="s">
          <Text as="span" variant="title">
            Участники
          </Text>
          <Text as="span" color="muted" tabularNums>
            {roster.length}
          </Text>
        </Box>
        {canMuteAll ? (
          <Button size="sm" variant="ghost" onPress={onMuteAll}>
            Выключить всем
          </Button>
        ) : null}
      </Box>
      <Box display="block" flexGrow={1} minHeight={0} overflowY="auto">
        <ItemList
          currentId={focusId}
          getText={(member) => personById(member.personId).name}
          items={items}
          label="Участники"
          menu={{
            label: "Действия с участником",
            renderItems: (member) => <PersonMenuItems showsPin actions={actions} member={member} />,
          }}
          renderItem={(member) => (
            <Draggable
              isDisabled={!actions.canModerate && member.personId !== ME}
              preview={<PersonChip personId={member.personId} />}
              value={carriedMember(channelId, member.personId)}
            >
              <ParticipantRow
                isOrganizer={member.personId === organizerId}
                isSpeaking={member.personId === speakerId}
                member={member}
              />
            </Draggable>
          )}
          onOpen={(id) => onPin(id === focusId ? null : id)}
        />
      </Box>
    </Box>
  );
}

interface VolumeModalProps {
  personId: string | null;
  volume: number;
  onChange: (personId: string, volume: number) => void;
  onClose: () => void;
}

export function VolumeModal({ personId, volume, onChange, onClose }: VolumeModalProps) {
  return (
    <Modal>
      <Modal.Backdrop isOpen={personId !== null} onOpenChange={onClose}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{personId ? firstName(personId) : ""}: громкость</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Slider
                className="w-full"
                formatOptions={{ style: "unit", unit: "percent" }}
                maxValue={200}
                minValue={0}
                step={5}
                value={volume}
                onChange={(value) => {
                  if (personId) {
                    onChange(personId, Number(value));
                  }
                }}
              >
                <Label>Слышно только вам</Label>
                <Slider.Output />
                <Slider.Track>
                  <Slider.Fill />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="tertiary">
                Готово
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

interface RemoveDialogProps {
  personId: string | null;
  onClose: () => void;
  onRemove: (personId: string) => void;
}

export function RemoveDialog({ personId, onClose, onRemove }: RemoveDialogProps) {
  return (
    <AlertDialog>
      <AlertDialog.Backdrop isOpen={personId !== null} onOpenChange={onClose}>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Убрать из канала: {personId ? personById(personId).name : ""}?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text as="p">Человек отключится сразу и сможет вернуться только по ссылке.</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Отменить
              </Button>
              <Button
                slot="close"
                variant="danger"
                onPress={() => {
                  if (personId) {
                    onRemove(personId);
                  }
                }}
              >
                Убрать
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
