import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { Skill, Uploader } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ProfileOverview({
  uploader,
  skills,
}: {
  uploader: Uploader;
  skills: Skill[];
}) {
  const latestUpdate = skills[0]?.updatedAt ? formatDate(skills[0].updatedAt) : "No uploads yet";

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
      <Panel padding="md" className="sm:p-5">
        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-[var(--font-size-heading-m)] leading-[var(--line-height-heading)] font-semibold text-foreground sm:text-[var(--font-size-heading-l)]">
              {uploader.name}
            </h1>
            <p className="break-words text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
              {uploader.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="information">{skills.length} published skills</Badge>
            <Badge>{uploader.role}</Badge>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] border border-border bg-surface p-4">
          <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Published</p>
          <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold text-foreground">
            {skills.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-border bg-surface p-4">
          <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Latest update</p>
          <p className="mt-2 text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold text-foreground">
            {latestUpdate}
          </p>
        </div>
      </div>
    </div>
  );
}
