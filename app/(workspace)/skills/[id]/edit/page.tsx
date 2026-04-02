import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UploadForm } from "@/components/upload/upload-form";
import { requireActiveMember } from "@/lib/auth";
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

  const canDeleteSkill =
    detail.skill.uploaderId === context.member.user_id || context.member.role === "admin";

  return (
    <div className="pb-6">
      <UploadForm
        categories={categories}
        uploaderEmail={context.member.email}
        mode="edit"
        canDeleteSkill={canDeleteSkill}
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
