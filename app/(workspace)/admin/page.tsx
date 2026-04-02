import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { listCatalogData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { getPanelClassName, Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const context = await requireAdmin();
  const catalog = await listCatalogData(context.supabase);
  const approvedCount = catalog.skills.filter((skill) => skill.status === "published").length;
  const activeMembers = catalog.members.filter((member) => member.is_active);
  const recentVersions = catalog.versions.slice(0, 5);

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <SectionHeading
          eyebrow="Admin moderation"
          title="Admin-only access overview"
          description="This route is protected on the server and only renders when the authenticated org member has role = admin."
          badge={`${activeMembers.length} active members`}
        />

        <div className="grid gap-4 border-t border-border px-6 py-5 sm:grid-cols-3 sm:px-7">
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Published skills</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">{approvedCount}</p>
          </div>
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Categories</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">
              {catalog.categories.length}
            </p>
          </div>
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Downloads logged</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">
              {catalog.downloads.length}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <Panel padding="md">
          <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">Active org members</h2>
          {activeMembers.length ? (
            <div className="mt-4 space-y-3">
              {activeMembers.map((member) => (
                <div
                  key={member.user_id}
                  className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">{member.email}</p>
                      <p className="text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-muted">role: {member.role}</p>
                    </div>
                    <Badge tone={member.role === "admin" ? "information" : "neutral"}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
              No active org members are visible yet. Ask the first signed-in user to finish
              login so their membership row is created.
            </p>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel padding="md">
            <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">Recent versions</h2>
            {recentVersions.length ? (
              <div className="mt-4 space-y-3">
                {recentVersions.map((version) => (
                  <div
                    key={version.id}
                    className={getPanelClassName({
                      tone: "subtle",
                      padding: "md",
                      className: "shadow-none text-[var(--font-size-body-m)] leading-[var(--line-height-body)]",
                    })}
                  >
                    <p className="font-semibold text-foreground">
                      Skill {version.skill_id} · v{version.version_number}
                    </p>
                    <p className="mt-1 text-muted">{version.change_notes ?? "No change notes."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Version activity will appear here after the first upload succeeds.
              </p>
            )}
          </Panel>

          <Panel padding="md">
            <h2 className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">Admin notes</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="information">Role-based access</Badge>
              <Badge tone="warning">RLS enforced</Badge>
              <Badge tone="success">Dashboard editable</Badge>
            </div>
            <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
              Use the Supabase dashboard or SQL editor to promote the first admin,
              deactivate members, or inspect storage activity. The app intentionally
              keeps admin mutations small and readable.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
