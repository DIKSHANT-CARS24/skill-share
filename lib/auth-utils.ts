export const DEFAULT_SIGN_IN_REDIRECT_PATH = "/skills";

export function isCarsEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@cars24.com");
}

export function isPublicPath(pathname: string) {
  return pathname === "/login" || pathname === "/auth/callback";
}

export function getSafeNextPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_SIGN_IN_REDIRECT_PATH,
) {
  const value = candidate?.trim() ?? "";

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const normalized = new URL(value, "https://skill-share.local");

    return `${normalized.pathname}${normalized.search}${normalized.hash}`;
  } catch {
    return fallback;
  }
}

export function buildLoginRedirectPath(pathname: string, search = "") {
  const nextPath = `${pathname}${search}`;

  if (nextPath === "/") {
    return "/login";
  }

  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export function isSkillOwner(viewerUserId: string, skillUploaderId: string) {
  return viewerUserId === skillUploaderId;
}

export function getDisplayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function getInitialsFromEmail(email: string) {
  const displayName = getDisplayNameFromEmail(email);
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "SS";
}
