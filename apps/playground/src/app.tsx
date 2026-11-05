import { Box, Button, PageHeader, Text, Toast, useTheme } from "@anyglade/kit";
import { categories } from "./demos.ts";

export function App() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Box
      height="100vh"
      backgroundColor="background-canvas"
      padding={{ base: "none", md: "s" }}
      gap="s"
    >
      <Box
        as="nav"
        aria-label="Components"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        gap="xl"
        width={208}
        flexShrink={0}
        padding="m"
        overflowY="auto"
      >
        <img src="/logo.svg" alt="" width={51} height={28} />
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
          maxWidth={1024}
          height="fit-content"
          paddingVertical="2xl"
        >
          <PageHeader
            title="@anyglade/kit"
            description="Components and tokens rendered from the package source."
            actions={
              <Button
                size="sm"
                variant="secondary"
                onPress={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? "Light theme" : "Dark theme"}
              </Button>
            }
          />
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
                  <Box display="block" minWidth={0} overflowX="auto" padding="xs">
                    <Component />
                  </Box>
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
