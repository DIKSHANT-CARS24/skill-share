import type { Metadata } from "next";
import { requireActiveMember } from "@/lib/auth";
import { listSkillsForCatalog } from "@/lib/data";
import { getSkillsForCatalog, parseSkillCatalogQuery } from "@/lib/skills";
import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { SkillCard } from "@/components/skills/skill-card";
import { EmptyStatePanel } from "@/components/states/state-panels";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Skills",
};

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const context = await requireActiveMember();
  const query = parseSkillCatalogQuery(await searchParams);
  const catalog = await listSkillsForCatalog(context.supabase, {
    search: "",
    category: "",
    uploader: "",
    sort: "newest",
  });
  const filteredSkills = getSkillsForCatalog(catalog.skills, query);
  const hasCatalogSkills = catalog.skills.length > 0;

  return (
    <div className="space-y-5 pb-6">
      {!hasCatalogSkills ? (
        <EmptyStatePanel
          title="No skills have been uploaded yet"
          description="This workspace is ready for its first real skill. Upload a `.md` file to create the first storage object, `skills` row, and `skill_versions` record."
          actionLabel="Upload the first skill"
          actionHref="/upload"
        />
      ) : filteredSkills.length ? (
        <div className="space-y-4">
          <Panel padding="lg" className="relative overflow-hidden sm:p-7 xl:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(71,54,254,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,189,220,0.12),transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-5 border-b border-white/26 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <span className="glass-pill inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    Skills Catalog
                  </span>
                  <div className="space-y-2">
                    <h1 className="text-[2rem] leading-[0.98] font-semibold tracking-[-0.035em] text-foreground sm:text-[2.45rem]">
                      Discover reusable internal skills.
                    </h1>
                    <p className="max-w-3xl text-[var(--font-size-body-m)] leading-[1.6] text-muted">
                      Browse prompts, contracts, and reusable markdown workflows with stronger surface hierarchy and quick visual scanning.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
                    {catalog.skills.length} total
                  </span>
                  <span className="glass-pill rounded-full px-3 py-1.5 text-[12px] font-semibold text-foreground">
                    {filteredSkills.length} visible
                  </span>
                </div>
              </div>

              <FilterToolbar
                query={query}
                categories={catalog.categories}
                uploaders={catalog.uploaders}
                resultCount={filteredSkills.length}
                totalCount={catalog.skills.length}
                showSearch={false}
                standalone
              />

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          </Panel>
        </div>
      ) : (
        <div className="space-y-4">
          <Panel padding="lg" className="relative overflow-hidden sm:p-7 xl:p-8">
            <div className="space-y-6">
              <FilterToolbar
                query={query}
                categories={catalog.categories}
                uploaders={catalog.uploaders}
                resultCount={filteredSkills.length}
                totalCount={catalog.skills.length}
                showSearch={false}
                standalone
              />

              <EmptyStatePanel
                title={query.search ? `No skills match “${query.search}”` : "No skills match the selected filters"}
                description="Try broadening your search term, clearing one filter, or switching the sort order. The current view is preserved in the URL so it is easy to share."
                actionLabel="Reset catalog view"
                actionHref="/skills"
              />
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
