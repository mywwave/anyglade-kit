import { Avatar, Box, Button, MediaStage, MediaTile, Text } from "@anyglade/kit";
import { MicrophoneSlash, Pin, PinSlash } from "@anyglade/kit/icons";
import { useState } from "react";

const people = [
  { id: "anna", name: "Anna Wright", isMuted: false },
  { id: "ethan", name: "Ethan Cole", isMuted: true },
  { id: "olivia", name: "Olivia Bell", isMuted: false },
  { id: "paul", name: "Paul Morgan", isMuted: false },
  { id: "ellen", name: "Ellen Hughes", isMuted: true },
];

export function MediaStageDemo() {
  const [focusId, setFocusId] = useState<string | null>(null);
  const [isAllShown, setIsAllShown] = useState(false);

  return (
    <Box flexDirection="column" gap="s" width="100%">
      <Box display="block" width="100%" height={360}>
        <MediaStage
          focusId={focusId}
          items={people}
          label="Call participants"
          more={{
            label: (count) => `${count} more, show all`,
            onPress: () => setIsAllShown(true),
          }}
          renderItem={(person) => (
            <MediaTile
              actions={
                <Button
                  isIconOnly
                  aria-label={person.id === focusId ? "Unpin" : "Pin"}
                  size="sm"
                  variant="secondary"
                  onPress={() => setFocusId(person.id === focusId ? null : person.id)}
                >
                  {person.id === focusId ? <PinSlash /> : <Pin />}
                </Button>
              }
              isSpeaking={person.id === "anna"}
              name={person.name}
              status={
                person.isMuted ? (
                  <Box as="span" display="inline-flex" color="text-danger">
                    <MicrophoneSlash aria-label="Microphone off" />
                  </Box>
                ) : null
              }
            >
              <Avatar className="rounded-full">
                <Avatar.Fallback>{person.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
            </MediaTile>
          )}
        />
      </Box>
      {isAllShown ? (
        <Text variant="caption" color="muted">
          The full participant list opens here.
        </Text>
      ) : null}
    </Box>
  );
}
