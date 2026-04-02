import type { Metadata } from "next";
import { requireActiveMember } from "@/lib/auth";
import { listCategories } from "@/lib/data";
import { Panel } from "@/components/ui/panel";
import { UploadForm } from "@/components/upload/upload-form";

export const metadata: Metadata = {
  title: "Upload Skill",
};

export default async function UploadPage() {
  const context = await requireActiveMember();
  const categories = await listCategories(context.supabase);

  return (
    <div className="space-y-5 pb-6">
      <Panel padding="lg" className="space-y-4">
        <div className="space-y-3">
          <h1 className="max-w-4xl text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.5rem] lg:text-[4rem]">
            Upload a new skill
          </h1>
          <p className="max-w-3xl text-[var(--font-size-body-l)] leading-[1.6] text-muted">
            Add the title, category, description, and markdown file to publish a clean new catalog entry.
          </p>
        </div>
      </Panel>

      <UploadForm categories={categories} uploaderEmail={context.member.email} mode="create" />
    </div>
  );
}
