export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function hasSkillBeenEdited(createdAt: string, updatedAt: string) {
  const createdTime = new Date(createdAt).getTime();
  const updatedTime = new Date(updatedAt).getTime();

  if (!Number.isFinite(createdTime) || !Number.isFinite(updatedTime)) {
    return false;
  }

  return updatedTime > createdTime;
}

export function getStatusMeta(status: string) {
  switch (status) {
    case "published":
      return { label: "Published", tone: "success" as const };
    case "archived":
      return { label: "Archived", tone: "neutral" as const };
    case "approved":
      return { label: "Approved", tone: "success" as const };
    case "in-review":
      return { label: "In review", tone: "warning" as const };
    case "needs-changes":
      return { label: "Needs changes", tone: "error" as const };
    case "draft":
      return { label: "Draft", tone: "neutral" as const };
    default:
      return { label: status, tone: "neutral" as const };
  }
}
