import type { Metadata } from "next";
import Link from "next/link";
import { requireActiveMember } from "@/lib/auth";
import { listSkillsForMember, mapMemberToUploader } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { EmptyStatePanel } from "@/components/states/state-panels";
import { getStatusMeta } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const context = await requireActiveMember();
  const uploader = mapMemberToUploader(context.member);
  const authoredSkills = await listSkillsForMember(context.supabase, context.member.user_id);
  const contributionAreas = Array.from(
    new Set(authoredSkills.map((skill) => skill.categoryName).filter(Boolean)),
  );

  return (
    <div className="space-y-4 pb-6">
      <ProfileOverview uploader={uploader} skills={authoredSkills} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px]">
        <Panel padding="md">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
              Published skills
            </h2>
            <Badge tone="information">{authoredSkills.length} entries</Badge>
          </div>
          {authoredSkills.length ? (
            <div className="mt-4 space-y-3">
              {authoredSkills.map((skill) => {
                const status = getStatusMeta(skill.status);

                return (
                  <Link
                    key={skill.id}
                    href={`/skills/${skill.slug ?? skill.id}`}
                    className="block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-strong)] focus-visible:ring-offset-2"
                  >
                    <article className="rounded-[20px] border border-border bg-surface px-4 py-3.5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-border-strong">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
                          {skill.title}
                        </p>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        <Badge>{skill.categoryName}</Badge>
                      </div>
                      <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                        {skill.summary}
                      </p>
                      <p className="mt-3 text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-muted">
                        v{skill.latestVersion} updated by {skill.uploaderName}
                      </p>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyStatePanel
                title="No skills published yet"
                description="Your profile is connected correctly, but this member has not uploaded a markdown skill yet."
                actionLabel="Upload your first skill"
                actionHref="/upload"
              />
            </div>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel padding="md">
            <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
              Contribution areas
            </h2>
            {contributionAreas.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {contributionAreas.map((categoryName) => (
                  <Badge key={categoryName} tone="information">
                    {categoryName}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Contribution areas will appear here after the first successful upload.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
