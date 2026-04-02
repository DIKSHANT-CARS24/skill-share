"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_SKILL_SORT,
  createSkillCatalogSearchParams,
  parseSkillCatalogQuery,
} from "@/lib/skills";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TopbarLogo } from "@/components/app-shell/topbar-logo";
import { InputShell } from "@/components/ui/input-shell";
import { Panel } from "@/components/ui/panel";
import { SkillsAccountMenu } from "@/components/skills/skills-account-menu";

interface SkillsTopbarProps {
  member: {
    email: string;
    role: UserRole;
  };
}

export function SkillsTopbar({ member }: SkillsTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef<number | null>(null);
  const query = parseSkillCatalogQuery({
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    uploader: searchParams.get("uploader") ?? "",
    sort: searchParams.get("sort") ?? DEFAULT_SKILL_SORT,
  });

  const updateQuery = useCallback(
    (patch: Partial<typeof query>) => {
      const nextQuery = {
        ...query,
        ...patch,
      };
      const params = createSkillCatalogSearchParams(nextQuery);
      const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(href);
    },
    [pathname, query, router],
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  function handleSearchChange(value: string) {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      updateQuery({ search: value.trim() });
    }, 250);
  }

  return (
    <Panel padding="md" tone="subtle" className="overflow-visible sm:px-5 sm:py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-4 xl:flex-row xl:items-center xl:gap-5">
          <TopbarLogo showAppName={false} />

          <InputShell
            label="Search skills"
            labelClassName="sr-only"
            size="medium"
            className="min-w-0 w-full xl:max-w-[540px] xl:flex-[0_1_540px]"
            fieldClassName="min-h-12 rounded-[12px] bg-background px-[14px] py-0"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 shrink-0 text-muted"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="8.5" cy="8.5" r="4.75" />
              <path d="M12 12L16 16" strokeLinecap="round" />
            </svg>
            <input
              id="skills-topbar-search"
              name="q"
              key={query.search}
              defaultValue={query.search}
              placeholder="Search skills"
              onChange={(event) => handleSearchChange(event.currentTarget.value)}
              className="min-w-0 flex-1 bg-transparent text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-foreground outline-none placeholder:text-muted"
            />
          </InputShell>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end xl:shrink-0">
          <Button asChild size="medium" className="w-full sm:w-auto">
            <Link href="/upload">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M10 4.5V15.5" strokeLinecap="round" />
                <path d="M4.5 10H15.5" strokeLinecap="round" />
              </svg>
              <span>Upload skill</span>
            </Link>
          </Button>
          <SkillsAccountMenu member={member} />
        </div>
      </div>
    </Panel>
  );
}
