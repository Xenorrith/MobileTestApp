export const formatDateTime = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "numeric",
    year: "2-digit",
  })}\n${date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const getTaskAge = (createdAt?: string | null): string => {
  if (!createdAt) return "";
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = Number(now) - Number(created);
  const days = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} old`;
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString: string | null): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

