import { Box, CountBadge } from "@anyglade/kit";

export function CountBadgeDemo() {
  return (
    <Box alignItems="center" gap="m">
      <CountBadge count={1} />
      <CountBadge count={24} />
      <CountBadge count={128} />
    </Box>
  );
}
