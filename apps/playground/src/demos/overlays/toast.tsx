import { HardDrive, Persons } from "@anyglade/kit/icons";
import { Box, Button, toast } from "@anyglade/kit";

export function ToastDemo() {
  return (
    <Box
      height="100%"
      maxWidth="36rem"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="100%" flexWrap="wrap" alignItems="center" justifyContent="center" gap="l">
        <Button
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast("You have been invited to join a team", {
              actionProps: {
                children: "Dismiss",
                onPress: () => toast.close(id),
                variant: "tertiary",
              },
              description: "Bob sent you an invitation to join HeroUI team",
              indicator: <Persons />,
              variant: "default",
            });
          }}
        >
          Default toast
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => {
            const id = toast.info("You have 2 credits left", {
              actionProps: { children: "Upgrade", onPress: () => toast.close(id) },
              description: "Get a paid plan for more credits",
            });
          }}
        >
          Accent toast
        </Button>
        <Button
          className="text-success-soft-foreground"
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast.success("You have upgraded your plan", {
              actionProps: {
                children: "Billing",
                className: "bg-success text-success-foreground",
                onPress: () => toast.close(id),
              },
              description: "You can continue using HeroUI Chat",
            });
          }}
        >
          Success toast
        </Button>
        <Button
          className="text-warning-soft-foreground"
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast.warning("You have no credits left", {
              actionProps: {
                children: "Upgrade",
                className: "bg-warning text-warning-foreground",
                onPress: () => toast.close(id),
              },
              description: "Upgrade to a paid plan to continue",
            });
          }}
        >
          Warning toast
        </Button>
        <Button
          size="sm"
          variant="danger-soft"
          onPress={() => {
            const id = toast.danger("Storage is full", {
              actionProps: {
                children: "Remove",
                onPress: () => toast.close(id),
                variant: "danger",
              },
              description:
                "Remove files to release space. Adding more text to demonstrate longer content display",
              indicator: <HardDrive />,
            });
          }}
        >
          Danger toast
        </Button>
      </Box>
    </Box>
  );
}
