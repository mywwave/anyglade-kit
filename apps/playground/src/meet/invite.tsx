import { Box, Button, CopyButton, Input, Label, ListBox, Modal, Select, Text } from "@anyglade/kit";
import { inviteLink, inviteTerms, type Invite, type InviteTerm } from "./use-invites.ts";

const expiry = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

interface InviteModalProps {
  isOpen: boolean;
  channelId: string;
  channelName: string;
  invite: Invite | undefined;
  /** Only the organizer decides how long a link lives. */
  canManage: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTerm: (term: InviteTerm) => void;
  onReset: () => void;
}

export function InviteModal({
  isOpen,
  channelId,
  channelName,
  invite,
  canManage,
  onOpenChange,
  onTerm,
  onReset,
}: InviteModalProps) {
  const link = invite ? inviteLink(channelId, invite) : "";

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Invite to {channelName}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Box flexDirection="column" gap="m">
                <Text color="muted">Anyone with this link joins the channel right away.</Text>
                <Input
                  readOnly
                  aria-label="Invite link"
                  fullWidth
                  value={link}
                  variant="secondary"
                />
                {canManage ? (
                  <Select
                    className="w-full"
                    value={invite?.term}
                    onChange={(key) => onTerm(key as InviteTerm)}
                  >
                    <Label>Expires after</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {inviteTerms.map(({ id, label }) => (
                          <ListBox.Item key={id} id={id} textValue={label}>
                            {label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                ) : null}
                <Box alignItems="center" justifyContent="between" gap="s" minHeight={32}>
                  <Text variant="caption" color="muted">
                    {invite?.expiresAt
                      ? `Link works until ${expiry.format(invite.expiresAt)}`
                      : "Link works until it is reset"}
                  </Text>
                  {canManage ? (
                    <Button size="sm" variant="ghost" onPress={onReset}>
                      Reset
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Modal.Body>
            <Modal.Footer>
              <CopyButton
                fullWidth
                isLabelVisible
                copiedLabel="Link copied"
                label="Copy link"
                size="md"
                value={link}
                variant="primary"
              />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
