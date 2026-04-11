import type { CSSProperties } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { Skill } from "@/lib/types";
import { formatDate, formatNumber, hasSkillBeenEdited } from "@/lib/utils";

const titleClampStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
} satisfies CSSProperties;

const summaryClampStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 4,
  overflow: "hidden",
} satisfies CSSProperties;

const uploaderClampStyle = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
} satisfies CSSProperties;

export function SkillCard({ skill }: { skill: Skill }) {
  const uploaderName = skill.uploaderName ?? "Unknown uploader";
  const categoryName = skill.categoryName ?? "Uncategorized";
  const wasEdited = hasSkillBeenEdited(skill.createdAt, skill.updatedAt);
  const dateLabel = wasEdited ? "Updated" : "Uploaded";
  const dateValue = wasEdited ? skill.updatedAt : skill.createdAt;

  return (
    <Link href={`/skills/${skill.slug ?? skill.id}`} className="block h-full">
      <Panel
        tone="static-subtle"
        padding="md"
        className="h-[20.5rem] overflow-hidden transition-colors duration-200 hover:border-border-strong"
      >
        <div className="flex h-full min-h-0 flex-col gap-3.5">
          <div className="flex min-h-0 flex-1 flex-col gap-3.5">
            <div className="self-start">
              <Badge tone="information" size="xs">
                {categoryName}
              </Badge>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2.5">
              <h2
                className="text-[1.22rem] leading-[1.16] font-semibold text-foreground"
                style={titleClampStyle}
              >
                {skill.title}
              </h2>
              <p
                className="min-h-0 text-[var(--font-size-body-m)] leading-[1.48] text-muted"
                style={summaryClampStyle}
              >
                {skill.summary}
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-3 border-t border-border/80 pt-4">
            <p
              className="text-[var(--font-size-label-m)] leading-[1.35] font-semibold text-foreground"
              style={uploaderClampStyle}
            >
              {uploaderName}
            </p>

            <div className="flex items-end justify-between gap-3 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
              <p className="min-w-0">
                {dateLabel} {formatDate(dateValue)}
              </p>
              <p className="inline-flex shrink-0 items-center gap-1.5 text-right">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3.5 w-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M8 2.75V9.25" strokeLinecap="round" />
                  <path d="M5.5 7.25L8 9.75L10.5 7.25" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.25 11.75H12.75" strokeLinecap="round" />
                </svg>
                <span>{formatNumber(skill.downloads ?? 0)}</span>
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </Link>
  );
}
