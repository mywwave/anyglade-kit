import { Box, Skeleton, tokens } from "@anyglade/kit";

const twoColumns = { base: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(0, 1fr)" };

function Lines({ count }: { count: number }) {
  return (
    <Box flexDirection="column" gap="m">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-lg" />
      ))}
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box flexDirection="column" gap="3xl">
      <Skeleton className="h-8 w-64 rounded-lg" />
      <Box
        display="grid"
        gridTemplateColumns={{ base: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }}
        gap="xl"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
      </Box>
      <Box display="grid" gridTemplateColumns={twoColumns} gap="2xl">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Lines count={4} />
      </Box>
    </Box>
  );
}

export function BoardSkeleton() {
  return (
    <Box flexDirection="column" gap="xl">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Box display="grid" gridTemplateColumns="repeat(5, minmax(11.5rem, 1fr))" gap="s">
        {Array.from({ length: 5 }, (_, index) => (
          <Box key={index} flexDirection="column" gap="s">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function TableSkeleton() {
  return (
    <Box flexDirection="column" gap="l">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Lines count={6} />
    </Box>
  );
}

export function ListSkeleton() {
  return (
    <Box
      flexDirection="column"
      gap="2xl"
      width="100%"
      maxWidth={tokens.widths.content}
      marginHorizontal="auto"
    >
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Lines count={5} />
    </Box>
  );
}
