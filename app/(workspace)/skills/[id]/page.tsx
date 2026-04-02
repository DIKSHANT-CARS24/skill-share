import Link from "next/link";
import { notFound } from "next/navigation";
import { requireActiveMember, getInitialsFromEmail, isSkillOwner } from "@/lib/auth";
import { getSkillDetailBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Avatar } from "@/components/ui/avatar";
import { MarkdownPreview } from "@/components/skills/markdown-preview";
import { SkillSaveToast } from "@/components/skills/skill-save-toast";
import { VersionHistory } from "@/components/skills/version-history";
import { formatDate, formatNumber, getStatusMeta } from "@/lib/utils";

export default async function SkillDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await requireActiveMember();
  const { id } = await params;
  await searchParams;
  const detail = await getSkillDetailBySlug(context.supabase, id);

  if (!detail) {
    notFound();
  }

  const { skill, category, uploader } = detail;
  const status = getStatusMeta(skill.status);
  const canEditSkill = isSkillOwner(context.member.user_id, skill.uploaderId);

  return (
    <div className="space-y-5 pb-6">
      <SkillSaveToast />
      <Panel padding="lg" className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="information" size="xs">
                {category.name}
              </Badge>
              <Badge tone={status.tone} size="xs">
                {status.label}
              </Badge>
              <Badge size="xs" appearance="stroke">
                v{skill.latestVersion}
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-4xl text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.5rem] lg:text-[4rem]">
                {skill.title}
              </h1>
              <p className="max-w-3xl text-[var(--font-size-body-l)] leading-[1.6] text-muted">
                {skill.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/api/skills/${skill.slug ?? skill.id}/download`}>
                Download .md
              </Link>
            </Button>
            {canEditSkill ? (
              <Button asChild variant="accentSecondary" className="w-full sm:w-auto">
                <Link href={`/skills/${skill.slug ?? skill.id}/edit`}>Edit skill</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <MarkdownPreview blocks={skill.markdownBlocks} />

        <div className="space-y-5">
          <Panel padding="md">
            <div className="flex items-start gap-4">
              <Avatar initials={getInitialsFromEmail(uploader.email)} size="lg" />
              <div className="min-w-0">
                <p className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                  {uploader.name}
                </p>
                <p className="mt-1 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
                  {uploader.role}
                </p>
                <p className="text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
                  {uploader.email}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid gap-3 text-[var(--font-size-body-s)] leading-[var(--line-height-body)]">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Created</dt>
                <dd className="font-medium text-foreground">{formatDate(skill.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Updated</dt>
                <dd className="font-medium text-foreground">{formatDate(skill.updatedAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Category</dt>
                <dd className="font-medium text-foreground">{category.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Downloads</dt>
                <dd className="font-medium text-foreground">
                  {formatNumber(skill.downloads ?? 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Versions</dt>
                <dd className="font-medium text-foreground">{skill.versionCount}</dd>
              </div>
            </dl>
          </Panel>

          <VersionHistory versions={skill.versionHistory} />
        </div>
      </div>
    </div>
  );
}
