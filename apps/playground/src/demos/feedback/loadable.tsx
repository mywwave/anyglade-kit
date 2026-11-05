import { Box, Button, Loadable, Skeleton, Stat } from "@anyglade/kit";
import { useState } from "react";

export function LoadableDemo() {
  const [isLoading, setIsLoading] = useState(false);

  function reload() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }

  return (
    <Box flexDirection="column" alignItems="start" gap="l" width={250}>
      <Loadable isLoading={isLoading} skeleton={<Skeleton className="h-16 w-full rounded-lg" />}>
        <Stat label="Выручка" value="1 848 885 ₽" />
      </Loadable>
      <Button isDisabled={isLoading} size="sm" variant="secondary" onPress={reload}>
        Обновить
      </Button>
    </Box>
  );
}
