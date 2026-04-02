"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Category, SkillCatalogQuery, Uploader } from "@/lib/types";
import { createSkillCatalogSearchParams, sortOptions } from "@/lib/skills";
import { InputShell } from "@/components/ui/input-shell";

interface FilterToolbarProps {
  query: SkillCatalogQuery;
  categories: Category[];
  uploaders: Uploader[];
  resultCount?: number;
  totalCount?: number;
  showSearch?: boolean;
  showCategory?: boolean;
  showUploader?: boolean;
  showSort?: boolean;
  standalone?: boolean;
}

export function FilterToolbar({
  query,
  categories,
  uploaders,
  resultCount,
  totalCount,
  showSearch = true,
  showCategory = true,
  showUploader = true,
  showSort = true,
  standalone = false,
}: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { search, category, uploader, sort } = query;
  const [draftSearch, setDraftSearch] = useState(query.search);

  useEffect(() => {
    setDraftSearch(search);
  }, [search]);

  const activeFilterCount = [search, category, uploader].filter(Boolean).length;
  const summaryCount =
    typeof resultCount === "number" ? resultCount : typeof totalCount === "number" ? totalCount : 0;
  const visibleControlCount = [showSearch, showCategory, showUploader, showSort].filter(Boolean).length;

  const navigate = useCallback(
    (nextQuery: SkillCatalogQuery) => {
      const params = createSkillCatalogSearchParams(nextQuery);
      const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(href);
    },
    [pathname, router],
  );

  const updateQuery = useCallback(
    (patch: Partial<SkillCatalogQuery>) => {
      navigate({
        search,
        category,
        uploader,
        sort,
        ...patch,
      });
    },
    [category, navigate, search, sort, uploader],
  );

  useEffect(() => {
    if (draftSearch === search) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateQuery({ search: draftSearch.trim() });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [draftSearch, search, updateQuery]);

  const activeBadges = useMemo(
    () =>
      [
        search
          ? {
              key: "search",
              label: `Search: ${search}`,
              onRemove: () => updateQuery({ search: "" }),
            }
          : null,
        category
          ? {
              key: "category",
              label: categories.find((item) => item.id === category)?.name ?? "Category selected",
              onRemove: () => updateQuery({ category: "" }),
            }
          : null,
        uploader
          ? {
              key: "uploader",
              label: uploaders.find((item) => item.id === uploader)?.name ?? "Uploader selected",
              onRemove: () => updateQuery({ uploader: "" }),
            }
          : null,
      ].filter(Boolean) as Array<{
        key: string;
        label: string;
        onRemove: () => void;
      }>,
    [categories, category, search, updateQuery, uploader, uploaders],
  );
  return (
    <div className={standalone ? "space-y-4" : "space-y-5 border-t border-border pt-5"}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 lg:flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
            <span className="font-semibold text-foreground">{summaryCount} results</span>
            {typeof totalCount === "number" ? <span>{totalCount} total skills</span> : null}
            {activeFilterCount > 0 ? (
              <span>
                {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
              </span>
            ) : null}
          </div>

          {activeBadges.length ? (
            <div className="flex flex-wrap gap-2">
              {activeBadges.map((badge) => (
                <div
                  key={badge.key}
                  className="inline-flex items-center gap-2 rounded-[12px] border border-border bg-surface-strong px-3 py-1.5 text-[11px] leading-[1.3] font-semibold text-foreground"
                >
                  <span>{badge.label}</span>
                  <button
                    type="button"
                    onClick={badge.onRemove}
                    aria-label={`Remove ${badge.label} filter`}
                    className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] focus-visible:ring-offset-2"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3 w-3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M4 4L12 12" strokeLinecap="round" />
                      <path d="M12 4L4 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {visibleControlCount ? (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {showSearch ? (
              <InputShell
                label="Search"
                labelClassName="sr-only"
                name="q"
                value={draftSearch}
                placeholder="Find skills"
                onChange={(event) => setDraftSearch(event.currentTarget.value)}
                size="medium"
                className="min-w-0 sm:w-[220px]"
                fieldClassName="min-h-10 rounded-[12px] bg-background px-3 py-0"
              />
            ) : null}

            {showCategory ? (
              <InputShell
                label="Category filter"
                labelClassName="sr-only"
                size="medium"
                className="min-w-0 sm:w-[170px]"
                fieldClassName="min-h-10 rounded-[12px] bg-background px-3 py-0"
              >
                <select
                  name="category"
                  value={category}
                  aria-label="Category filter"
                  onChange={(event) => updateQuery({ category: event.currentTarget.value })}
                  className="min-w-0 flex-1 bg-transparent text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-foreground outline-none"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </InputShell>
            ) : null}

            {showUploader ? (
              <InputShell
                label="Uploader filter"
                labelClassName="sr-only"
                size="medium"
                className="min-w-0 sm:w-[170px]"
                fieldClassName="min-h-10 rounded-[12px] bg-background px-3 py-0"
              >
                <select
                  name="uploader"
                  value={uploader}
                  aria-label="Uploader filter"
                  onChange={(event) => updateQuery({ uploader: event.currentTarget.value })}
                  className="min-w-0 flex-1 bg-transparent text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-foreground outline-none"
                >
                  <option value="">All uploaders</option>
                  {uploaders.map((uploader) => (
                    <option key={uploader.id} value={uploader.id}>
                      {uploader.name}
                    </option>
                  ))}
                </select>
              </InputShell>
            ) : null}

            {showSort ? (
              <InputShell
                label="Sort"
                labelClassName="sr-only"
                size="medium"
                className="min-w-0 sm:w-[150px]"
                fieldClassName="min-h-10 rounded-[12px] bg-background px-3 py-0"
              >
                <select
                  name="sort"
                  value={sort}
                  aria-label="Sort"
                  onChange={(event) =>
                    updateQuery({ sort: event.currentTarget.value as SkillCatalogQuery["sort"] })
                  }
                  className="min-w-0 flex-1 bg-transparent text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-foreground outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </InputShell>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
