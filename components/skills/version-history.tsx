import { Badge } from "@/components/ui/badge";
import { getPanelClassName, Panel } from "@/components/ui/panel";
import type { SkillVersion } from "@/lib/types";
import { formatDate, getStatusMeta } from "@/lib/utils";

export function VersionHistory({ versions }: { versions: SkillVersion[] }) {
  return (
    <Panel padding="md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">Version history</h2>
          <p className="mt-1 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
            Review recent updates and release notes for this skill.
          </p>
        </div>
        <Badge size="xs">Recent changes</Badge>
      </div>

      <div className="mt-5 space-y-4">
        {versions.length ? versions.map((version) => {
          const status = getStatusMeta(version.status);

          return (
            <article
              key={version.version}
              className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">v{version.version}</p>
                <Badge tone={status.tone} size="xs">{status.label}</Badge>
                <span className="text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-muted">{formatDate(version.publishedAt)}</span>
              </div>
              <p className="mt-3 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted-strong">{version.summary}</p>
            </article>
          );
        }) : (
          <div
            className={getPanelClassName({
              tone: "subtle",
              padding: "md",
              className: "shadow-none text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted",
            })}
          >
            No version history has been recorded for this skill yet.
          </div>
        )}
      </div>
    </Panel>
  );
}
