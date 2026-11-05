import {
  Box,
  Button,
  Checkbox,
  Input,
  SegmentedControl,
  Text,
  tokens,
  withTransition,
} from "@anyglade/kit";
import { Xmark } from "@anyglade/kit/icons";
import { useState, type FormEvent } from "react";
import type { Task, TaskGroup } from "./data.ts";

type TaskFilter = "all" | "open" | "done";

const groups: { id: TaskGroup; label: string }[] = [
  { id: "today", label: "Сегодня" },
  { id: "tomorrow", label: "Завтра" },
  { id: "later", label: "Позже" },
];

const filters: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "open", label: "Активные" },
  { id: "done", label: "Выполненные" },
];

const matches = (task: Task, filter: TaskFilter) =>
  filter === "all" || task.isDone === (filter === "done");

interface TasksProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string, group: TaskGroup) => void;
  onRemove: (id: string) => void;
  onClearDone: () => void;
}

export function Tasks({ tasks, onToggle, onAdd, onRemove, onClearDone }: TasksProps) {
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState<TaskGroup>("today");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const remaining = tasks.filter((task) => !task.isDone).length;
  const doneCount = tasks.length - remaining;
  const visible = tasks.filter((task) => matches(task, filter));

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed, group);
      setTitle("");
      setFilter((current) => (current === "done" ? "all" : current));
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
      <Box as="form" flexDirection="column" gap="m" onSubmit={submit}>
        <Box gap="s">
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
        <SegmentedControl label="Срок задачи" options={groups} value={group} onChange={setGroup} />
      </Box>
      <Box alignItems="center" justifyContent="between" flexWrap="wrap" gap="m">
        <SegmentedControl
          label="Какие задачи показать"
          options={filters}
          value={filter}
          onChange={(next) => withTransition(() => setFilter(next))}
        />
        {doneCount > 0 ? (
          <Button size="sm" variant="ghost" onPress={onClearDone}>
            Убрать выполненные
          </Button>
        ) : null}
      </Box>
      {visible.length === 0 ? (
        <Box flexDirection="column" alignItems="center" gap="m" padding="2xl" textAlign="center">
          <Text color="muted">{filter === "done" ? "Выполненных нет" : "Активных нет"}</Text>
          <Button size="sm" variant="secondary" onPress={() => setFilter("all")}>
            Показать все
          </Button>
        </Box>
      ) : null}
      {groups.map((item) => {
        const items = visible.filter((task) => task.group === item.id);

        return items.length === 0 ? null : (
          <Box as="section" key={item.id} flexDirection="column" gap="m">
            <Text as="h2" variant="title" color="muted">
              {item.label}
            </Text>
            <Box flexDirection="column" gap="m">
              {items.map((task) => (
                <Box
                  key={task.id}
                  alignItems="center"
                  justifyContent="between"
                  gap="m"
                  viewTransitionName={`task-${task.id}`}
                >
                  <Checkbox
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
                  <Button
                    isIconOnly
                    aria-label={`Удалить задачу ${task.title}`}
                    size="sm"
                    variant="ghost"
                    onPress={() => onRemove(task.id)}
                  >
                    <Xmark />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
