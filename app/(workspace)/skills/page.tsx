import type { Metadata } from "next";
import { requireActiveMember } from "@/lib/auth";
import { listSkillsForCatalog } from "@/lib/data";
import { parseSkillCatalogQuery } from "@/lib/skills";
import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { SkillCard } from "@/components/skills/skill-card";
import { EmptyStatePanel } from "@/components/states/state-panels";

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
  const catalog = await listSkillsForCatalog(context.supabase, query);
  const filteredSkills = catalog.skills;
  const hasCatalogSkills = catalog.totalSkillCount > 0;

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
          <FilterToolbar
            query={query}
            categories={catalog.categories}
            uploaders={catalog.uploaders}
            resultCount={filteredSkills.length}
            totalCount={catalog.totalSkillCount}
            showSearch={false}
            standalone
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <FilterToolbar
            query={query}
            categories={catalog.categories}
            uploaders={catalog.uploaders}
            resultCount={filteredSkills.length}
            totalCount={catalog.totalSkillCount}
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
      )}
    </div>
  );
}
