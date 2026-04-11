import { Badge } from "@/components/ui/badge";
import { getPanelClassName, Panel } from "@/components/ui/panel";
import type { SkillVersion } from "@/lib/types";
import { formatDate, getStatusMeta } from "@/lib/utils";

export function VersionHistory({ versions }: { versions: SkillVersion[] }) {
  return (
    <Panel padding="md" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(71,54,254,0.07),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,189,220,0.08),transparent_28%)]" />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">Recent changes</h2>
          <p className="mt-1 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
            Review what changed on each save, with the related version shown on every entry.
          </p>
        </div>
        <Badge size="xs">Change log</Badge>
      </div>

      <div className="relative mt-5 space-y-4">
        {versions.length ? versions.map((version, index) => {
          const status = getStatusMeta(version.status);

          return (
            <article
              key={version.id ?? `${version.version}-${version.publishedAt}-${index}`}
              className={getPanelClassName({ tone: "subtle", padding: "md", className: "rounded-[22px] shadow-none" })}
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
              className: "rounded-[22px] shadow-none text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted",
            })}
          >
            No changes have been recorded for this skill yet.
          </div>
        )}
      </div>
    </Panel>
  );
}
