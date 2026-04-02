import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { Skill } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils";

export function SkillCard({ skill }: { skill: Skill }) {
  const uploaderName = skill.uploaderName ?? "Unknown uploader";
  const categoryName = skill.categoryName ?? "Uncategorized";

  return (
    <Link href={`/skills/${skill.slug ?? skill.id}`} className="block">
      <Panel
        padding="lg"
        className="h-full transition-[border-color,transform] hover:-translate-y-0.5 hover:border-border-strong"
      >
        <div className="flex h-full flex-col gap-6">
          <div className="space-y-4">
            <Badge tone="information" size="xs">
              {categoryName}
            </Badge>

            <div className="space-y-2">
              <h2 className="text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                {skill.title}
              </h2>
              <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                {skill.summary}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
                {uploaderName}
              </p>
            </div>

            <div className="text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted sm:text-right">
              <p>Updated {formatDate(skill.updatedAt)}</p>
              <p className="mt-1">{formatNumber(skill.downloads ?? 0)} downloads</p>
            </div>
          </div>
        </div>
      </Panel>
    </Link>
  );
}
