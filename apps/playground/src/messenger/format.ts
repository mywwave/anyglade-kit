const time = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" });
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const date = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long" });

export function startOfDay(at: number) {
  return new Date(at).setHours(0, 0, 0, 0);
}

const daysAgo = (at: number) => Math.round((startOfDay(Date.now()) - startOfDay(at)) / 86400000);

export function formatListTime(at: number) {
  const days = daysAgo(at);
  if (days === 0) return time.format(at);
  if (days === 1) return "Yesterday";
  return days < 7 ? weekday.format(at) : date.format(at);
}

export const formatMessageTime = (at: number) => time.format(at);

export function formatDay(at: number) {
  const days = daysAgo(at);
  if (days === 0) return "Today";
  return days === 1 ? "Yesterday" : longDate.format(at);
}
