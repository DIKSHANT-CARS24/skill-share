import { ErrorStatePanel } from "@/components/states/state-panels";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ErrorStatePage() {
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="State mockup"
          title="Error state"
          description="This variant models a recoverable catalog fetch failure while keeping the surrounding shell intact."
          badge="Recovery path"
        />
      </Panel>
      <ErrorStatePanel />
    </div>
  );
}
