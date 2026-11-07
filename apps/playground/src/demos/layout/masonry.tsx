import { Box, Masonry, MasonryTile, Stat, Text } from "@anyglade/kit";
import { formatRubles } from "../../blocks/format.ts";

export function MasonryDemo() {
  return (
    <Box display="block" width="100%">
      <Masonry>
        <MasonryTile note="Неделя" title="Выручка">
          <Stat
            label="За 7 дней"
            value={formatRubles(438200)}
            note={"На 4 % больше прошлой недели"}
          />
        </MasonryTile>
        <MasonryTile title="Короткая плитка">
          <Text color="muted">Высота плитки идёт за содержимым</Text>
        </MasonryTile>
        <MasonryTile note="Сегодня" title="Новые клиенты">
          <Box flexDirection="column" alignItems="center" gap="xs">
            <Text as="p" variant="heading-xl" tabularNums>
              24
            </Text>
            <Text color="muted">из них 9 по рекомендации</Text>
          </Box>
        </MasonryTile>
        <MasonryTile title="Без подписи справа">
          <Text color="muted">Колонки заполняются сверху вниз</Text>
        </MasonryTile>
      </Masonry>
    </Box>
  );
}
