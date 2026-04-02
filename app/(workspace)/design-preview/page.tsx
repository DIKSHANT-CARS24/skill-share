import Link from "next/link";
import type { Metadata } from "next";
import { previewLinks } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Design Preview",
};

export default function DesignPreviewPage() {
  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="Design index"
          title="Preview every mocked screen and state"
          description="Use this route as the review hub for the visual design layer. Every page below is backed by isolated mocked data and shared UI primitives."
          badge="Review ready"
        />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        {previewLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block">
            <Panel tone="subtle" padding="md" className="h-full transition-transform hover:-translate-y-0.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">{link.label}</h2>
                  <Badge tone="information">Open</Badge>
                </div>
                <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">{link.description}</p>
                <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] font-semibold text-accent">{link.href}</p>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
