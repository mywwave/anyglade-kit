import { Box, Skeleton } from "@anyglade/kit";

export function SkeletonDemo() {
  return (
    <Box boxShadow="m" width={250} flexDirection="column" gap="xl" borderRadius="s" padding="l">
      <Skeleton className="h-32 rounded-lg" />
      <Box flexDirection="column" gap="m">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />
      </Box>
    </Box>
  );
}
