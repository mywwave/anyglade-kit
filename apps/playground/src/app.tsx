import { Box, Button, PageHeader, Text, Toast } from "@anyglade/kit";
import { useEffect, useState } from "react";
import { AssistantApp } from "./assistant/assistant-app.tsx";
import { CrmApp } from "./crm/crm-app.tsx";
import { blockCategories, componentCategories } from "./demos.ts";
import { MeetApp } from "./meet/meet-app.tsx";
import { isInviteHash } from "./meet/use-invites.ts";
import { MessengerApp } from "./messenger/messenger-app.tsx";
import { Showcase } from "./showcase.tsx";
import { ThemePanel } from "./theme/theme-panel.tsx";

const views = {
  showcase: { label: "Витрина", categories: [] },
  crm: { label: "CRM", categories: [] },
  assistant: { label: "Помощник", categories: [] },
  messenger: { label: "Сообщения", categories: [] },
  meet: { label: "Миты", categories: [] },
  components: { label: "Компоненты", categories: componentCategories },
  blocks: { label: "Блоки", categories: blockCategories },
};

type View = keyof typeof views;

const descriptions: Record<View, string> = {
  showcase: "Компоненты kit в работе.",
  crm: "",
  assistant: "",
  messenger: "",
  meet: "",
  components: "Компоненты и токены из исходников пакета.",
  blocks: "Готовые секции из компонентов kit.",
};

const viewNames = Object.keys(views) as View[];

export function App() {
  const [view, setView] = useState<View>(() => (isInviteHash(location.hash) ? "meet" : "showcase"));

  // An invite pasted into an open tab changes only the hash.
  useEffect(() => {
    function openInvite() {
      if (isInviteHash(location.hash)) {
        setView("meet");
      }
    }

    addEventListener("hashchange", openInvite);
    return () => removeEventListener("hashchange", openInvite);
  }, []);

  return (
    <Box
      flexDirection="column"
      height={view === "assistant" ? undefined : "100dvh"}
      minHeight="100dvh"
      backgroundColor="background-canvas"
    >
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        backgroundColor="background-canvas"
        alignItems="center"
        justifyContent="between"
        gap="m"
        flexShrink={0}
        paddingHorizontal="m"
        paddingVertical="s"
      >
        <Box alignItems="center" gap="l" minWidth={0}>
          <img src="/logo.svg" alt="" width={44} height={24} />
          <Box as="nav" aria-label="Разделы" gap="xs" overflowX="auto">
            {viewNames.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={name === view ? "secondary" : "ghost"}
                onPress={() => setView(name)}
              >
                {views[name].label}
              </Button>
            ))}
          </Box>
        </Box>
        <ThemePanel />
      </Box>
      <Box flexGrow={1} minHeight={0}>
        {view === "crm" ? <CrmApp /> : null}
        {view === "assistant" ? <AssistantApp /> : null}
        {view === "messenger" ? <MessengerApp /> : null}
        {view === "meet" ? <MeetApp /> : null}
        {view !== "crm" && view !== "assistant" && view !== "messenger" && view !== "meet" ? (
          <Documentation view={view} />
        ) : null}
      </Box>
      <Toast.Provider />
    </Box>
  );
}

function Documentation({
  view,
}: {
  view: Exclude<View, "crm" | "assistant" | "messenger" | "meet">;
}) {
  const { categories } = views[view];
  const isBlocks = view === "blocks";

  return (
    <Box
      width="100%"
      paddingHorizontal={{ base: "none", md: "s" }}
      paddingBottom={{ base: "none", md: "s" }}
      gap="s"
    >
      {categories.length > 0 ? (
        <Box
          as="nav"
          aria-label="Содержание"
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          gap="xl"
          width={208}
          flexShrink={0}
          padding="m"
          overflowY="auto"
        >
          {categories.map((category) => (
            <Box key={category.id} flexDirection="column">
              <Text variant="caption" color="subtle">
                {category.label}
              </Text>
              {category.demos.map(({ name }) => (
                <Box
                  as="a"
                  key={name}
                  href={`#${name}`}
                  paddingVertical="xs"
                  color={{ base: "text-secondary", hover: "text-primary" }}
                  transitionProperty="colors"
                  transitionDuration="fast"
                >
                  <Text as="span" weight="medium">
                    {name}
                  </Text>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ) : null}
      <Box
        as="main"
        flexGrow={1}
        minWidth={0}
        justifyContent="center"
        overflowY="auto"
        backgroundColor="background-panel"
        borderRadius={{ base: "none", md: "l" }}
        borderWidth={{ base: 0, md: 1 }}
        borderStyle="solid"
        borderColor="border-secondary"
        paddingHorizontal={{ base: "l", md: "2xl" }}
      >
        <Box
          flexDirection="column"
          gap="4xl"
          width="100%"
          maxWidth={1120}
          height="fit-content"
          paddingVertical="2xl"
        >
          <PageHeader title="@anyglade/kit" description={descriptions[view]} />
          {view === "showcase" ? <Showcase /> : null}
          {categories.map((category) => (
            <Box as="section" key={category.id} flexDirection="column" gap="3xl">
              <Text as="h2" variant="heading-xs">
                {category.label}
              </Text>
              {category.demos.map(({ name, Component }) => (
                <Box as="article" key={name} id={name} flexDirection="column" gap="l">
                  <Text as="h3" variant="title">
                    {name}
                  </Text>
                  {isBlocks ? (
                    <Box
                      display="block"
                      minWidth={0}
                      overflow="hidden"
                      backgroundColor="background-primary"
                      borderRadius="l"
                      borderWidth={1}
                      borderStyle="solid"
                      borderColor="border-primary"
                    >
                      <Component />
                    </Box>
                  ) : (
                    <Box display="block" minWidth={0} overflowX="auto" padding="xs">
                      <Component />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
