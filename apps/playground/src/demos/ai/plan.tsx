import { Box } from "@anyglade/kit";
import { Plan } from "@anyglade/kit/ai";

const statusLabels = {
  pending: "Pending",
  running: "Running",
  waiting: "Needs input",
  done: "Done",
  failed: "Failed",
};

export function PlanDemo() {
  return (
    <Box display="block" width="100%" maxWidth={480}>
      <Plan
        formatProgress={(done, total) => `${done} of ${total} done`}
        statusLabels={statusLabels}
        title="Plan: migrate dialogs"
        steps={[
          { id: "1", title: "Install the dependency", status: "done" },
          { id: "2", title: "Replace imports", status: "done" },
          { id: "3", title: "Update types", status: "running" },
          { id: "4", title: "Run checks", status: "pending" },
        ]}
      />
    </Box>
  );
}
