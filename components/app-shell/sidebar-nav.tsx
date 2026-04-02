"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";

const navItems = [
  { href: "/skills", label: "Catalog" },
  { href: "/upload", label: "Upload" },
  { href: "/profile", label: "Profile" },
  { href: "/design-preview", label: "Preview" },
];

export function SidebarNav({
  isAdmin,
  compact = false,
  variant = "sidebar",
}: {
  isAdmin: boolean;
  compact?: boolean;
  variant?: "sidebar" | "topbar";
}) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...navItems.slice(0, 2), { href: "/admin", label: "Admin" }, ...navItems.slice(2)]
    : navItems;

  return (
    <nav
      className={cx(
        "flex overflow-x-auto pb-1",
        variant === "topbar"
          ? "gap-2 xl:flex-nowrap"
          : "lg:flex-col lg:overflow-visible",
        compact ? "gap-1.5" : "gap-2",
      )}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/skills" && pathname.startsWith("/skills/")) ||
          (item.href !== "/skills" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cx(
              variant === "topbar"
                ? "rounded-[12px] border px-3 py-2 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] font-semibold whitespace-nowrap transition-colors"
                : compact
                ? "rounded-[14px] border px-3 py-2.5 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] font-semibold transition-colors"
                : "rounded-2xl border px-4 py-3 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold transition-colors",
              isActive
                ? "border-accent/20 bg-accent-soft text-accent"
                : variant === "topbar"
                  ? "border-transparent text-muted hover:border-border hover:bg-surface-strong hover:text-foreground"
                  : compact
                  ? "border-transparent text-muted hover:border-border hover:bg-surface-strong hover:text-foreground"
                  : "border-transparent text-muted-strong hover:border-border hover:bg-surface",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
