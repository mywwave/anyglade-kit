import { Box, Button, PageLoader, Text } from "@anyglade/kit";
import { useEffect, useState } from "react";

const LOGO = { src: `${import.meta.env.BASE_URL}logo.svg`, width: 87, height: 48 };
const STEP_MS = 1100;
const FAST_PAGE_MS = 250;

const steps = [
  { status: "Checking sign-in", value: 15 },
  { status: "Loading your workspace", value: 45 },
  { status: "Connecting channels", value: 75 },
  { status: "Almost ready", value: 95 },
];

export function PageLoaderDemo() {
  const [step, setStep] = useState<number | null>(null);
  const [hasPercent, setHasPercent] = useState(true);
  const [isFastPageLoading, setIsFastPageLoading] = useState(false);
  const [hasFastPageOpened, setHasFastPageOpened] = useState(false);
  const current = step === null ? undefined : steps[step];

  useEffect(() => {
    if (step === null) {
      return;
    }
    const timer = setTimeout(() => setStep(step < steps.length - 1 ? step + 1 : null), STEP_MS);
    return () => clearTimeout(timer);
  }, [step]);

  function openFastPage() {
    setHasFastPageOpened(false);
    setIsFastPageLoading(true);
    setTimeout(() => {
      setIsFastPageLoading(false);
      setHasFastPageOpened(true);
    }, FAST_PAGE_MS);
  }

  function start(withPercent: boolean) {
    setHasPercent(withPercent);
    setStep(0);
  }

  return (
    <Box alignItems="center" flexWrap="wrap" gap="s">
      <Button variant="secondary" onPress={() => start(true)}>
        With percentage
      </Button>
      <Button variant="secondary" onPress={() => start(false)}>
        Without percentage
      </Button>
      <Button variant="secondary" onPress={openFastPage}>
        Fast page
      </Button>
      {hasFastPageOpened ? (
        <Text variant="caption" color="muted">
          Opened in {FAST_PAGE_MS} ms, no loader needed
        </Text>
      ) : null}
      <PageLoader
        isLoading={current !== undefined || isFastPageLoading}
        label="Loading the app"
        logo={LOGO}
        status={current?.status ?? "Ready"}
        value={hasPercent ? (current?.value ?? 100) : undefined}
      />
    </Box>
  );
}
