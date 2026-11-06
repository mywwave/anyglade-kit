import { Avatar, Box, Button, MediaStage, MediaTile, Text } from "@anyglade/kit";
import { MicrophoneSlash, Pin, PinSlash } from "@anyglade/kit/icons";
import { useState } from "react";

const people = [
  { id: "anna", name: "Анна Смирнова", isMuted: false },
  { id: "ilya", name: "Илья Воронов", isMuted: true },
  { id: "olga", name: "Ольга Белова", isMuted: false },
  { id: "pavel", name: "Павел Орлов", isMuted: false },
  { id: "elena", name: "Елена Жукова", isMuted: true },
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
          label="Участники звонка"
          more={{
            label: (count) => `Ещё ${count}, показать всех`,
            onPress: () => setIsAllShown(true),
          }}
          renderItem={(person) => (
            <MediaTile
              actions={
                <Button
                  isIconOnly
                  aria-label={person.id === focusId ? "Открепить" : "Закрепить"}
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
                    <MicrophoneSlash aria-label="Микрофон выключен" />
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
          Здесь откроется список всех участников.
        </Text>
      ) : null}
    </Box>
  );
}
