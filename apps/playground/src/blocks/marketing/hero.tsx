import { Box, Button, Frame, FrameTile, Stat, Text } from "@anyglade/kit";
import { ChevronRight } from "@anyglade/kit/icons";
import { AreaChart } from "../area-chart.tsx";
import { formatRubles, revenueByDay } from "../format.ts";

export function HeroBlock() {
  return (
    <Box as="section" flexDirection="column" gap="3xl" padding={{ base: "xl", md: "3xl" }}>
      <Box flexDirection="column" alignItems="start" gap="2xl" maxWidth={720}>
        <Box display="block">
          <Text as="h1" variant="heading-l">
            Биллинг без таблиц
          </Text>
          <Text as="p" variant="heading-l" color="muted">
            Подписки, счета и отчёты в одном месте
          </Text>
        </Box>
        <Box flexWrap="wrap" gap="s">
          <Button size="lg">
            Начать бесплатно
            <ChevronRight />
          </Button>
          <Button size="lg" variant="secondary">
            Посмотреть демо
          </Button>
        </Box>
      </Box>
      <Frame title="Поток" meta="Текущий период">
        <Box
          display="grid"
          gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
          gap="xs"
        >
          <FrameTile>
            <Stat label="Выручка" value={formatRubles(1848885)} note="+18% к прошлому месяцу" />
            <Stat label="Активные подписки" value="9 260" />
            <Stat label="Средний чек" value={formatRubles(1996)} />
          </FrameTile>
          <FrameTile>
            <Stat label="Маржа" value="61%" />
            <AreaChart label="Рост выручки за 20 дней" values={revenueByDay} />
          </FrameTile>
        </Box>
      </Frame>
    </Box>
  );
}
