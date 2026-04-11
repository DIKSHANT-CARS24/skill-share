"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const pathname = usePathname();
  const memberName = getDisplayNameFromEmail(member.email);
  const initials = getInitialsFromEmail(member.email);
  const canUsePortal = typeof window !== "undefined";
  const menuWidth = 240;
  const menuOffset = 12;
  const viewportInset = 16;

  function getItemClassName(href: string) {
    const isActive =
      pathname === href ||
      (href === "/skills" && pathname.startsWith("/skills/")) ||
      (href !== "/skills" && pathname.startsWith(href));

    return cx(
      "flex rounded-[14px] px-3 py-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] font-medium transition-[background-color,border-color,box-shadow,color,transform] duration-200",
      isActive
        ? "glass-pill-active hover:-translate-y-0.5"
        : "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(247,244,255,0.93)_100%)] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.84),0_12px_26px_rgba(92,83,145,0.08)] backdrop-blur-[10px] hover:-translate-y-0.5 hover:border-white/90 hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(246,242,255,0.96)_100%)]",
    );
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !containerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
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

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateMenuPosition() {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const left = Math.min(
        Math.max(rect.right - menuWidth, viewportInset),
        window.innerWidth - menuWidth - viewportInset,
      );

      setMenuPosition({
        top: rect.bottom + menuOffset,
        left,
      });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={triggerRef} className="flex h-12 w-12 items-center justify-center">
        <Button
          variant="tertiary"
          size="small"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Open account menu"
          onClick={() => setIsOpen((current) => !current)}
          className="glass-pill flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0"
        >
          <span className="flex h-8 w-8 min-h-8 min-w-8 shrink-0 aspect-square items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(226,220,255,0.72)_100%)] text-center text-[var(--font-size-caption-xs)] leading-none font-semibold text-accent shadow-[0_8px_18px_rgba(71,54,254,0.14)]">
            {initials}
          </span>
        </Button>
      </div>

      {isOpen && canUsePortal
        ? createPortal(
            <div
              ref={menuRef}
              className={cx(
                getPanelClassName({
                  padding: "md",
                  className:
                    "!fixed z-[10000] w-[240px] origin-top-right border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.985)_0%,rgba(248,245,255,0.965)_100%)] shadow-[0_32px_80px_rgba(39,33,70,0.24),0_16px_36px_rgba(15,23,43,0.12),inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-[18px]",
                }),
              )}
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
              role="menu"
              aria-label="Account menu"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(71,54,254,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,192,223,0.1),transparent_28%)]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-[1px] rounded-[23px] border border-white/50" />

              <div className="relative border-b border-black/8 pb-3">
                <p className="truncate text-[var(--font-size-body-s)] leading-[var(--line-height-body)] font-semibold text-[color:rgba(29,27,50,0.98)]">
                  {memberName}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="truncate text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-[color:rgba(76,73,104,0.95)]">
                    {member.email}
                  </p>
                  <Badge tone={member.role === "admin" ? "information" : "neutral"} size="xs">
                    {member.role}
                  </Badge>
                </div>
              </div>

              <div className="relative mt-3 space-y-1">
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

              <div className="relative mt-3 border-t border-black/8 pt-3">
                <SignOutButton
                  variant="destructive"
                  size="small"
                  className="w-full justify-start border-danger/22 bg-[linear-gradient(180deg,rgba(255,246,247,0.94)_0%,rgba(255,239,241,0.88)_100%)] px-3 text-danger shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-danger/32 hover:bg-[linear-gradient(180deg,rgba(255,248,249,0.98)_0%,rgba(255,240,242,0.92)_100%)]"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
