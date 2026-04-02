import { EmptyStatePanel } from "@/components/states/state-panels";
import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, uploaders } from "@/lib/mock-data";

export default function EmptyStatePage() {
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="State mockup"
          title="Empty state"
          description="Shows the catalog after a new workspace has been provisioned but before any skills have been published."
          badge="Zero items"
        />
      </Panel>

      <FilterToolbar
        query={{ search: "", category: "", uploader: "", sort: "newest" }}
        categories={categories}
        uploaders={uploaders}
      />

      <EmptyStatePanel
        title="No skills have been published yet"
        description="When the catalog is empty, the layout still preserves search, filter, and navigation structure so the screen feels stable and production-ready."
        actionLabel="Open upload screen"
        actionHref="/upload"
      />
    </div>
  );
}
