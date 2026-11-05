import { Box, Button, PageHeader, Text, Toast, useTheme } from "@anyglade/kit";
import { useState } from "react";
import { CrmApp } from "./crm/crm-app.tsx";
import { blockCategories, componentCategories } from "./demos.ts";
import { Showcase } from "./showcase.tsx";

const views = {
  showcase: { label: "Витрина", categories: [] },
  crm: { label: "CRM", categories: [] },
  components: { label: "Компоненты", categories: componentCategories },
  blocks: { label: "Блоки", categories: blockCategories },
};

type View = keyof typeof views;

const descriptions: Record<View, string> = {
  showcase: "Компоненты kit в работе.",
  crm: "",
  components: "Компоненты и токены из исходников пакета.",
  blocks: "Готовые секции из компонентов kit.",
};

const viewNames = Object.keys(views) as View[];

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [view, setView] = useState<View>("showcase");
  const { categories } = views[view];
  const isBlocks = view === "blocks";

  if (view === "crm") {
    return <CrmApp onExit={() => setView("showcase")} />;
  }

  return (
    <Box
      height="100vh"
      backgroundColor="background-canvas"
      padding={{ base: "none", md: "s" }}
      gap="s"
    >
      <Box
        as="nav"
        aria-label="Разделы"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        gap="xl"
        width={208}
        flexShrink={0}
        padding="m"
        overflowY="auto"
      >
        <Box justifyContent="center">
          <img src="/logo.svg" alt="" width={51} height={28} />
        </Box>
        <Box flexDirection="column" gap="xs">
          {viewNames.map((name) => (
            <Button
              key={name}
              fullWidth
              size="sm"
              variant={name === view ? "secondary" : "ghost"}
              onPress={() => setView(name)}
            >
              {views[name].label}
            </Button>
          ))}
        </Box>
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
          <PageHeader
            title="@anyglade/kit"
            description={descriptions[view]}
            actions={
              <Button
                size="sm"
                variant="secondary"
                onPress={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? "Светлая тема" : "Тёмная тема"}
              </Button>
            }
          />
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
      <Toast.Provider />
    </Box>
  );
}
