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
      <Panel padding="lg" className="relative overflow-hidden space-y-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(71,54,254,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,190,223,0.1),transparent_34%)]" />
        <div className="relative space-y-3">
          <span className="glass-pill inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
            New Entry
          </span>
          <h1 className="max-w-4xl text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground sm:text-[3.5rem] lg:text-[4rem]">
            Upload a new skill
          </h1>
          <p className="max-w-3xl text-[var(--font-size-body-l)] leading-[1.6] text-muted">
            Add the title, category, description, and markdown file to publish a clean new catalog entry.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
              Markdown upload
            </span>
            <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
              Live preview
            </span>
            <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
              Catalog-ready metadata
            </span>
          </div>
        </div>
      </Panel>

      <UploadForm categories={categories} uploaderEmail={context.member.email} mode="create" />
    </div>
  );
}
