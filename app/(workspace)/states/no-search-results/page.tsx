import { EmptyStatePanel } from "@/components/states/state-panels";
import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, uploaders } from "@/lib/mock-data";

export default function NoSearchResultsPage() {
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="State mockup"
          title="No search results"
          description="A focused recovery pattern for when filters are valid but the current search term returns no matches."
          badge="Search specific"
        />
      </Panel>

      <FilterToolbar
        query={{
          search: "risk score generator",
          category: "finance",
          uploader: "rahul-verma",
          sort: "newest",
        }}
        categories={categories}
        uploaders={uploaders}
      />

      <EmptyStatePanel
        title="No skills match “risk score generator”"
        description="Suggested next step: broaden the search term, clear one filter, or check nearby approved skills with similar tags."
        actionLabel="Back to all skills"
        actionHref="/skills"
      />
    </div>
  );
}
