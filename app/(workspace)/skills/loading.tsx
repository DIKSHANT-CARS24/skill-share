import { FilterToolbar } from "@/components/skills/filter-toolbar";
import { LoadingStateGrid } from "@/components/states/state-panels";

export default function SkillsLoading() {
  return (
    <div className="space-y-5 pb-6">
      <FilterToolbar
        query={{ search: "", category: "", uploader: "", sort: "newest" }}
        categories={[]}
        uploaders={[]}
        resultCount={0}
        totalCount={0}
        showSearch={false}
        standalone
      />

      <LoadingStateGrid />
    </div>
  );
}
