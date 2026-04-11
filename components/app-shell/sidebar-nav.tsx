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
                ? "rounded-full px-3.5 py-2 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] font-semibold whitespace-nowrap transition-[background-color,border-color,box-shadow,color,transform] duration-200"
                : compact
                ? "rounded-[16px] px-3 py-2.5 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-200"
                : "rounded-[18px] px-4 py-3 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold transition-[background-color,border-color,box-shadow,color,transform] duration-200",
              isActive
                ? "glass-pill-active hover:-translate-y-0.5"
                : variant === "topbar"
                  ? "glass-pill text-muted hover:-translate-y-0.5 hover:text-foreground"
                  : compact
                    ? "glass-pill text-muted hover:-translate-y-0.5 hover:text-foreground"
                    : "glass-pill text-muted-strong hover:-translate-y-0.5 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
