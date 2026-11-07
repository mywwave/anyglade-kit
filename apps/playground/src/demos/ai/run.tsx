import { Box } from "@anyglade/kit";
import { CodeOutput, Run, type StatusLabels } from "@anyglade/kit/ai";

const statusLabels: StatusLabels = {
  pending: "Pending",
  running: "Running",
  waiting: "Needs input",
  done: "Done",
  failed: "Failed",
};

export function RunDemo() {
  return (
    <Box flexDirection="column" gap="l" width="100%" maxWidth={480}>
      <Run
        isDefaultExpanded
        statusLabels={statusLabels}
        summary="Plan"
        steps={[
          { id: "1", title: "Find deals", status: "done", note: "Found three" },
          { id: "2", title: "Draft emails", status: "running" },
          { id: "3", title: "Wait for replies", status: "pending" },
        ]}
      />
      <Run
        isDefaultExpanded
        statusLabels={statusLabels}
        summary="Two of three checks"
        steps={[
          { id: "1", title: "Currencies", status: "done" },
          {
            id: "2",
            title: "Totals match",
            status: "failed",
            detail: (
              <CodeOutput
                copiedLabel="Copied"
                copyLabel="Copy"
                output={"expected 185,500\nreceived 183,050"}
                title="AssertionError"
                tone="danger"
              />
            ),
          },
        ]}
      />
    </Box>
  );
}
