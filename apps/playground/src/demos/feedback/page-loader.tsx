import { Box, Button, PageLoader, Text } from "@anyglade/kit";
import { useEffect, useState } from "react";

const LOGO = { src: "/logo.svg", width: 87, height: 48 };
const STEP_MS = 1100;
const FAST_PAGE_MS = 250;

const steps = [
  { status: "Проверяем вход", value: 15 },
  { status: "Загружаем рабочее пространство", value: 45 },
  { status: "Подключаем каналы", value: 75 },
  { status: "Почти готово", value: 95 },
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
        С процентом
      </Button>
      <Button variant="secondary" onPress={() => start(false)}>
        Без процента
      </Button>
      <Button variant="secondary" onPress={openFastPage}>
        Быстрая страница
      </Button>
      {hasFastPageOpened ? (
        <Text variant="caption" color="muted">
          Открылась за {FAST_PAGE_MS} мс, лоадер не понадобился
        </Text>
      ) : null}
      <PageLoader
        isLoading={current !== undefined || isFastPageLoading}
        label="Загрузка приложения"
        logo={LOGO}
        status={current?.status ?? "Готово"}
        value={hasPercent ? (current?.value ?? 100) : undefined}
      />
    </Box>
  );
}
