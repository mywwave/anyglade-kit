import { Avatar, Box, Button, Drawer, Loadable, Text, withTransition } from "@anyglade/kit";
import { Bars, ChartColumn, CircleCheck, House, Persons, SquareListUl } from "@anyglade/kit/icons";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Analytics } from "./analytics.tsx";
import { Customers } from "./customers.tsx";
import {
  AVATARS,
  STALLED_AFTER_DAYS,
  initialDeals,
  initialTasks,
  type StageId,
  type TaskGroup,
} from "./data.ts";
import { Deals, type DealsView } from "./deals.tsx";
import { Overview } from "./overview.tsx";
import { BoardSkeleton, DashboardSkeleton, ListSkeleton, TableSkeleton } from "./skeletons.tsx";
import { Tasks } from "./tasks.tsx";

type Screen = "overview" | "deals" | "customers" | "tasks" | "analytics";

const screens: { id: Screen; label: string; icon: ComponentType }[] = [
  { id: "overview", label: "Today", icon: House },
  { id: "deals", label: "Deals", icon: SquareListUl },
  { id: "customers", label: "Customers", icon: Persons },
  { id: "tasks", label: "Tasks", icon: CircleCheck },
  { id: "analytics", label: "Analytics", icon: ChartColumn },
];

const skeletons: Record<Screen, ReactNode> = {
  overview: <DashboardSkeleton />,
  deals: <BoardSkeleton />,
  customers: <TableSkeleton />,
  tasks: <ListSkeleton />,
  analytics: <DashboardSkeleton />,
};

const SCREEN_LOAD_MS = 700;

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
          <Text as="span" variant="title">
            Touchpoint
          </Text>
        </Box>
        <Box as="nav" aria-label="CRM sections" flexDirection="column" gap="xs">
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

export function CrmApp() {
  const [screen, setScreen] = useState<Screen>("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deals, setDeals] = useState(initialDeals);
  const [tasks, setTasks] = useState(initialTasks);
  const [dealsView, setDealsView] = useState<DealsView>("all");
  const [loadedScreens, setLoadedScreens] = useState<ReadonlySet<Screen>>(new Set());
  const isLoading = !loadedScreens.has(screen);

  useEffect(() => {
    if (!isLoading) {
      return undefined;
    }
    const timer = setTimeout(
      () => setLoadedScreens((list) => new Set(list).add(screen)),
      SCREEN_LOAD_MS,
    );
    return () => clearTimeout(timer);
  }, [isLoading, screen]);

  function moveDeal(id: string, stage: StageId) {
    withTransition(() =>
      setDeals((list) =>
        list.map((deal) => (deal.id === id ? { ...deal, stage, daysInStage: 0 } : deal)),
      ),
    );
  }

  function openStalledDeals() {
    setDealsView("stalled");
    setScreen("deals");
  }

  function toggleTask(id: string) {
    setTasks((list) =>
      list.map((task) => (task.id === id ? { ...task, isDone: !task.isDone } : task)),
    );
  }

  function addTask(title: string, group: TaskGroup) {
    const task = { id: crypto.randomUUID(), title, company: "No company", group, isDone: false };
    withTransition(() => setTasks((list) => [task, ...list]));
  }

  function removeTask(id: string) {
    withTransition(() => setTasks((list) => list.filter((task) => task.id !== id)));
  }

  function clearDoneTasks() {
    withTransition(() => setTasks((list) => list.filter((task) => !task.isDone)));
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
    <Box alignItems="center" gap="s" paddingHorizontal="s">
      <Avatar size="sm">
        <Avatar.Image alt="Anna Wright" src={`${AVATARS}/blue.jpg`} />
        <Avatar.Fallback>AW</Avatar.Fallback>
      </Avatar>
      <Box flexDirection="column" minWidth={0}>
        <Text variant="title" truncate>
          Anna Wright
        </Text>
        <Text variant="caption" color="muted" truncate>
          Sales team
        </Text>
      </Box>
    </Box>
  );

  return (
    <Box
      flexDirection={{ base: "column", md: "row" }}
      width="100%"
      paddingHorizontal={{ base: "none", md: "s" }}
      paddingBottom={{ base: "none", md: "s" }}
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
          Touchpoint
        </Text>
        <Button
          isIconOnly
          aria-label="Open menu"
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
            <Drawer.Dialog aria-label="Menu">
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
          <Loadable isLoading={isLoading} skeleton={skeletons[screen]}>
            {screen === "overview" ? (
              <Overview
                deals={deals}
                tasks={tasks}
                onOpenDeals={openStalledDeals}
                onToggleTask={toggleTask}
              />
            ) : null}
            {screen === "deals" ? (
              <Deals deals={deals} view={dealsView} onMove={moveDeal} onViewChange={setDealsView} />
            ) : null}
            {screen === "customers" ? <Customers /> : null}
            {screen === "tasks" ? (
              <Tasks
                tasks={tasks}
                onAdd={addTask}
                onClearDone={clearDoneTasks}
                onRemove={removeTask}
                onToggle={toggleTask}
              />
            ) : null}
            {screen === "analytics" ? <Analytics /> : null}
          </Loadable>
        </Box>
      </Box>
    </Box>
  );
}
