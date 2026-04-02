"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface TopbarLogoProps {
  subtitle?: string;
  showAppName?: boolean;
}

export function TopbarLogo({ subtitle, showAppName = true }: TopbarLogoProps) {
  return (
    <Link
      href="/skills"
      aria-label="Go to skills catalog"
      className="flex min-w-0 shrink-0 items-center gap-3 rounded-[12px] transition-opacity hover:cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] focus-visible:ring-offset-2"
    >
      <Image
        src="/logo.svg"
        alt="Skill Share logo"
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 object-contain"
        priority
      />
      {showAppName || subtitle ? (
        <div className="min-w-0">
          {showAppName ? (
            <p className="text-[var(--font-size-title-s)] leading-[var(--line-height-heading)] font-semibold text-foreground">
              {APP_NAME}
            </p>
          ) : null}
          {subtitle ? (
            <p className="truncate text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
