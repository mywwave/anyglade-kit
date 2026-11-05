import { Box, Button, Checkbox, Input, Text, tokens } from "@anyglade/kit";
import { useState, type FormEvent } from "react";
import type { Task, TaskGroup } from "./data.ts";

const groups: { id: TaskGroup; label: string }[] = [
  { id: "today", label: "Сегодня" },
  { id: "tomorrow", label: "Завтра" },
  { id: "later", label: "Позже" },
];

interface TasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
}

export function Tasks({ tasks, onToggle, onAdd }: TasksProps) {
  const [title, setTitle] = useState("");
  const remaining = tasks.filter((task) => !task.isDone).length;

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTitle("");
    }
  }

  return (
    <Box
      flexDirection="column"
      gap="2xl"
      width="100%"
      maxWidth={tokens.widths.content}
      marginHorizontal="auto"
    >
      <Box flexDirection="column" gap="xs">
        <Text as="h1" variant="heading-xs" weight="medium">
          Задачи
        </Text>
        <Text color="muted">Осталось {remaining}</Text>
      </Box>
      <Box as="form" gap="s" onSubmit={submit}>
        <Input
          aria-label="Новая задача"
          className="w-full"
          placeholder="Что нужно сделать?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button isDisabled={!title.trim()} type="submit">
          Добавить
        </Button>
      </Box>
      {groups.map((group) => {
        const items = tasks.filter((task) => task.group === group.id);

        return items.length === 0 ? null : (
          <Box as="section" key={group.id} flexDirection="column" gap="m">
            <Text as="h2" variant="title" color="muted">
              {group.label}
            </Text>
            <Box flexDirection="column" gap="m">
              {items.map((task) => (
                <Checkbox
                  key={task.id}
                  isSelected={task.isDone}
                  name={task.id}
                  onChange={() => onToggle(task.id)}
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Box flexDirection="column" minWidth={0}>
                      <Text
                        as="span"
                        lineThrough={task.isDone}
                        color={task.isDone ? "muted" : "inherit"}
                      >
                        {task.title}
                      </Text>
                      <Text as="span" variant="caption" color="muted">
                        {task.company}
                      </Text>
                    </Box>
                  </Checkbox.Content>
                </Checkbox>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
