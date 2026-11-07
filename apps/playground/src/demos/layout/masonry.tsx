import { Box, Masonry, MasonryTile, Stat, Text } from "@anyglade/kit";
import { formatMoney } from "../../blocks/format.ts";

export function MasonryDemo() {
  return (
    <Box display="block" width="100%">
      <Masonry>
        <MasonryTile note="Week" title="Revenue">
          <Stat label="Last 7 days" value={formatMoney(43820)} note="Up 4% from last week" />
        </MasonryTile>
        <MasonryTile title="Short tile">
          <Text color="muted">Tile height follows its content</Text>
        </MasonryTile>
        <MasonryTile note="Today" title="New customers">
          <Box flexDirection="column" alignItems="center" gap="xs">
            <Text as="p" variant="heading-xl" tabularNums>
              24
            </Text>
            <Text color="muted">9 of them from referrals</Text>
          </Box>
        </MasonryTile>
        <MasonryTile title="No side note">
          <Text color="muted">Columns fill from top to bottom</Text>
        </MasonryTile>
      </Masonry>
    </Box>
  );
}
