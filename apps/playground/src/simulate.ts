/** Stands in for a server: Reference screens wait exactly as a real product would. */
export const simulateRequest = (milliseconds = 900) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
