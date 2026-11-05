import { Box, Button, Dropdown, ItemList, Label, Text } from "@anyglade/kit";
import { Star, StarFill } from "@anyglade/kit/icons";
import { useState } from "react";

const items = [
  { id: "1", title: "Итоги запуска", note: "Договорились о дате" },
  { id: "2", title: "Счёт за ноябрь", note: "Оплатить до пятницы" },
];

export function ItemListDemo() {
  const [currentId, setCurrentId] = useState("1");
  const [starred, setStarred] = useState<string[]>(["2"]);

  return (
    <Box display="block" width="100%" maxWidth={320}>
      <ItemList
        currentId={currentId}
        getText={(item) => item.title}
        items={items}
        label="Письма"
        menu={{
          label: "Действия с письмом",
          renderItems: (item) => (
            <Dropdown.Item textValue="Открыть" onAction={() => setCurrentId(item.id)}>
              <Label>Открыть</Label>
            </Dropdown.Item>
          ),
        }}
        renderItem={(item) => (
          <Box alignItems="center" justifyContent="between" gap="s">
            <Box flexDirection="column" minWidth={0}>
              <Text as="span" variant="title" truncate>
                {item.title}
              </Text>
              <Text as="span" variant="caption" color="muted" truncate>
                {item.note}
              </Text>
            </Box>
            <Button
              isIconOnly
              aria-label={`Отметить ${item.title}`}
              size="sm"
              variant="ghost"
              onPress={() =>
                setStarred((list) =>
                  list.includes(item.id) ? list.filter((id) => id !== item.id) : [...list, item.id],
                )
              }
            >
              {starred.includes(item.id) ? <StarFill /> : <Star />}
            </Button>
          </Box>
        )}
        onOpen={setCurrentId}
      />
    </Box>
  );
}
