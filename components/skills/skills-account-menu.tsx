"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getDisplayNameFromEmail, getInitialsFromEmail } from "@/lib/auth-utils";
import type { UserRole } from "@/lib/types";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPanelClassName } from "@/components/ui/panel";
import { cx } from "@/lib/utils";

interface SkillsAccountMenuProps {
  member: {
    email: string;
    role: UserRole;
  };
}

export function SkillsAccountMenu({ member }: SkillsAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const memberName = getDisplayNameFromEmail(member.email);
  const initials = getInitialsFromEmail(member.email);

  function getItemClassName(href: string) {
    const isActive =
      pathname === href ||
      (href === "/skills" && pathname.startsWith("/skills/")) ||
      (href !== "/skills" && pathname.startsWith(href));

    return cx(
      "flex rounded-[12px] px-3 py-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] font-medium transition-colors",
      isActive
        ? "bg-accent-soft text-accent"
        : "text-foreground hover:bg-surface-strong",
    );
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="tertiary"
        size="small"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open account menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-border bg-surface p-0"
      >
        <span className="flex h-8 w-8 min-h-8 min-w-8 shrink-0 aspect-square items-center justify-center rounded-full bg-accent-soft text-center text-[var(--font-size-caption-xs)] leading-none font-semibold text-accent">
          {initials}
        </span>
      </Button>

      {isOpen ? (
        <div
          className={cx(
            getPanelClassName({
              padding: "md",
              className:
                "absolute right-0 top-[calc(100%+12px)] z-30 w-[240px] bg-background shadow-[var(--card-shadow)]",
            }),
          )}
          role="menu"
          aria-label="Account menu"
        >
          <div className="border-b border-border pb-3">
            <p className="truncate text-[var(--font-size-body-s)] leading-[var(--line-height-body)] font-semibold text-foreground">
              {memberName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <p className="truncate text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-muted">
                {member.email}
              </p>
              <Badge tone={member.role === "admin" ? "information" : "neutral"} size="xs">
                {member.role}
              </Badge>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <Link
              href="/skills"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={getItemClassName("/skills")}
            >
              Catalog
            </Link>

            {member.role === "admin" ? (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className={getItemClassName("/admin")}
              >
                Admin
              </Link>
            ) : null}

            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className={getItemClassName("/profile")}
            >
              Profile
            </Link>
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <SignOutButton
              variant="destructive"
              size="small"
              className="w-full justify-start border-transparent bg-transparent px-3 hover:border-border hover:bg-danger-soft"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
