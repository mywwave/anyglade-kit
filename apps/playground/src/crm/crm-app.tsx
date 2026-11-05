import { Avatar, Box, Button, Drawer, Text, useTheme } from "@anyglade/kit";
import {
  ArrowLeft,
  Bars,
  ChartColumn,
  CircleCheck,
  House,
  Moon,
  Persons,
  SquareListUl,
  Sun,
} from "@anyglade/kit/icons";
import { useState, type ComponentType, type ReactNode } from "react";
import { Analytics } from "./analytics.tsx";
import { Customers } from "./customers.tsx";
import { AVATARS, STALLED_AFTER_DAYS, initialDeals, initialTasks, type StageId } from "./data.ts";
import { Deals } from "./deals.tsx";
import { Overview } from "./overview.tsx";
import { Tasks } from "./tasks.tsx";

type Screen = "overview" | "deals" | "customers" | "tasks" | "analytics";

const screens: { id: Screen; label: string; icon: ComponentType }[] = [
  { id: "overview", label: "Сегодня", icon: House },
  { id: "deals", label: "Сделки", icon: SquareListUl },
  { id: "customers", label: "Клиенты", icon: Persons },
  { id: "tasks", label: "Задачи", icon: CircleCheck },
  { id: "analytics", label: "Аналитика", icon: ChartColumn },
];

interface NavigationProps {
  active: Screen;
  counts: Partial<Record<Screen, number>>;
  onSelect: (screen: Screen) => void;
  footer: ReactNode;
}

function Navigation({ active, counts, onSelect, footer }: NavigationProps) {
  return (
    <Box flexDirection="column" justifyContent="between" gap="xl" flexGrow={1} minHeight={0}>
      <Box flexDirection="column" gap="xl">
        <Box alignItems="center" gap="s" paddingHorizontal="s">
          <img src="/logo.svg" alt="" width={36} height={20} />
          <Text as="span" variant="title">
            Касание
          </Text>
        </Box>
        <Box as="nav" aria-label="Разделы CRM" flexDirection="column" gap="xs">
          {screens.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              aria-current={id === active ? "page" : undefined}
              className="justify-start"
              fullWidth
              size="sm"
              variant={id === active ? "secondary" : "ghost"}
              onPress={() => onSelect(id)}
            >
              <Icon />
              {label}
              {counts[id] ? (
                <Box as="span" display="block" marginLeft="auto">
                  <Text as="span" variant="caption" color="muted" tabularNums>
                    {counts[id]}
                  </Text>
                </Box>
              ) : null}
            </Button>
          ))}
        </Box>
      </Box>
      {footer}
    </Box>
  );
}

interface CrmAppProps {
  onExit: () => void;
}

export function CrmApp({ onExit }: CrmAppProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [screen, setScreen] = useState<Screen>("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deals, setDeals] = useState(initialDeals);
  const [tasks, setTasks] = useState(initialTasks);

  function moveDeal(id: string, stage: StageId) {
    setDeals((list) =>
      list.map((deal) => (deal.id === id ? { ...deal, stage, daysInStage: 0 } : deal)),
    );
  }

  function toggleTask(id: string) {
    setTasks((list) =>
      list.map((task) => (task.id === id ? { ...task, isDone: !task.isDone } : task)),
    );
  }

  function addTask(title: string) {
    setTasks((list) => [
      {
        id: `T-${list.length + 1}-${title}`,
        title,
        company: "Без компании",
        group: "today",
        isDone: false,
      },
      ...list,
    ]);
  }

  function select(next: Screen) {
    setScreen(next);
    setIsMenuOpen(false);
  }

  const counts = {
    deals: deals.filter((deal) => deal.stage !== "won" && deal.daysInStage >= STALLED_AFTER_DAYS)
      .length,
    tasks: tasks.filter((task) => task.group === "today" && !task.isDone).length,
  };

  const footer = (
    <Box flexDirection="column" gap="s">
      <Box alignItems="center" gap="s" paddingHorizontal="s">
        <Avatar size="sm">
          <Avatar.Image alt="Анна Смирнова" src={`${AVATARS}/blue.jpg`} />
          <Avatar.Fallback>АС</Avatar.Fallback>
        </Avatar>
        <Box flexDirection="column" minWidth={0}>
          <Text variant="title" truncate>
            Анна Смирнова
          </Text>
          <Text variant="caption" color="muted" truncate>
            Отдел продаж
          </Text>
        </Box>
      </Box>
      <Box gap="xs">
        <Button
          isIconOnly
          aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
          size="sm"
          variant="ghost"
          onPress={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun /> : <Moon />}
        </Button>
        <Button size="sm" variant="ghost" onPress={onExit}>
          <ArrowLeft />
          К витрине
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      flexDirection={{ base: "column", md: "row" }}
      height="100vh"
      backgroundColor="background-canvas"
      padding={{ base: "none", md: "s" }}
      gap={{ base: "none", md: "s" }}
    >
      <Box
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        width={224}
        flexShrink={0}
        padding="s"
      >
        <Navigation active={screen} counts={counts} footer={footer} onSelect={select} />
      </Box>
      <Box
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        justifyContent="between"
        gap="m"
        padding="m"
      >
        <Text as="span" variant="title">
          Касание
        </Text>
        <Button
          isIconOnly
          aria-label="Открыть меню"
          size="sm"
          variant="secondary"
          onPress={() => setIsMenuOpen(true)}
        >
          <Bars />
        </Button>
      </Box>
      <Drawer>
        <Drawer.Backdrop isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Drawer.Content placement="left">
            <Drawer.Dialog aria-label="Меню">
              <Drawer.Body>
                <Box flexDirection="column" minHeight="100%">
                  <Navigation active={screen} counts={counts} footer={footer} onSelect={select} />
                </Box>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
      <Box
        as="main"
        flexGrow={1}
        flex="1"
        minWidth={0}
        minHeight={0}
        justifyContent="center"
        overflowY="auto"
        backgroundColor="background-panel"
        borderRadius={{ base: "none", md: "l" }}
        paddingHorizontal={{ base: "l", md: "2xl" }}
      >
        <Box
          display="block"
          width="100%"
          maxWidth={1180}
          height="fit-content"
          paddingVertical="2xl"
        >
          {screen === "overview" ? (
            <Overview
              deals={deals}
              tasks={tasks}
              onOpenDeals={() => setScreen("deals")}
              onToggleTask={toggleTask}
            />
          ) : null}
          {screen === "deals" ? <Deals deals={deals} onMove={moveDeal} /> : null}
          {screen === "customers" ? <Customers /> : null}
          {screen === "tasks" ? (
            <Tasks tasks={tasks} onAdd={addTask} onToggle={toggleTask} />
          ) : null}
          {screen === "analytics" ? <Analytics /> : null}
        </Box>
      </Box>
    </Box>
  );
}
