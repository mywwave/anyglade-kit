import { Box, Typography } from "@anyglade/kit";

export function TypographyDemo() {
  return (
    <Box maxWidth="36rem" flexDirection="column" gap="l">
      <Typography type="h1">Build better interfaces</Typography>
      <Typography type="h2">Typography that stays semantic</Typography>
      <Typography type="h3">Composable by default</Typography>
      <Typography type="h4">Small heading</Typography>
      <Typography>Body copy for regular reading.</Typography>
      <Typography color="muted" type="body-sm">
        Smaller muted body copy for secondary descriptions.
      </Typography>
      <Typography type="code">bun add @anyglade/kit</Typography>
    </Box>
  );
}
