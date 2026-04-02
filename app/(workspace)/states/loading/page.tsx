import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { LoadingStateGrid } from "@/components/states/state-panels";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, uploaders } from "@/lib/mock-data";

export default function LoadingStatePage() {
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="State mockup"
          title="Loading state"
          description="Skeleton panels keep the catalog layout stable while mocked content is still loading."
          badge="Transient state"
        />
      </Panel>

      <FilterToolbar
        query={{ search: "", category: "", uploader: "", sort: "newest" }}
        categories={categories}
        uploaders={uploaders}
      />
      <LoadingStateGrid />
    </div>
  );
}
