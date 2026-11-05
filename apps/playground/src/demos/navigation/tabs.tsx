import { Box, Tabs } from "@anyglade/kit";

const tabs = [
  { id: "overview", label: "Overview", content: "Project summary and recent activity." },
  { id: "analytics", label: "Analytics", content: "Traffic and conversion for this month." },
  { id: "reports", label: "Reports", content: "Exported reports shared with the team." },
];

export function TabsDemo() {
  return (
    <Tabs className="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Project sections">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {tabs.map((tab) => (
        <Tabs.Panel key={tab.id} id={tab.id}>
          <Box display="block" paddingTop="l">
            {tab.content}
          </Box>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
