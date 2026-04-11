import type { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";
import { UploadForm } from "@/components/upload/upload-form";
import { Panel } from "@/components/ui/panel";
import { isSkillOwner, requireActiveMember } from "@/lib/auth";
import { getSkillDetailBySlug, listCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Edit Skill",
};

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await requireActiveMember();
  const { id } = await params;
  const [categories, detail] = await Promise.all([
    listCategories(context.supabase),
    getSkillDetailBySlug(context.supabase, id),
  ]);

  if (!detail) {
    notFound();
  }

  if (!isSkillOwner(context.member.user_id, detail.skill.uploaderId)) {
    unauthorized();
  }

  return (
    <div className="space-y-5 pb-6">
      <Panel padding="lg" className="relative overflow-hidden space-y-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(71,54,254,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,190,223,0.08),transparent_34%)]" />
        <div className="relative space-y-3">
          <span className="glass-pill inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
            Edit Skill
          </span>
          <h1 className="max-w-4xl text-[2.4rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.25rem] lg:text-[3.8rem]">
            Refine {detail.skill.title}
          </h1>
          <p className="max-w-3xl text-[var(--font-size-body-l)] leading-[1.6] text-muted">
            Update metadata, versioning, and markdown content while preserving the existing published skill record.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
              v{detail.skill.latestVersion}
            </span>
            <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
              {detail.skill.categoryName}
            </span>
          </div>
        </div>
      </Panel>
      <UploadForm
        categories={categories}
        uploaderEmail={context.member.email}
        mode="edit"
        canDeleteSkill
        editSkill={{
          id: detail.skill.id,
          slug: detail.skill.slug ?? detail.skill.id,
          title: detail.skill.title,
          categoryId: detail.skill.categoryId,
          description: detail.skill.description,
          currentFileName: detail.currentFileName,
          currentVersion: detail.skill.latestVersion,
          markdownBlocks: detail.skill.markdownBlocks,
        }}
      />
    </div>
  );
}
