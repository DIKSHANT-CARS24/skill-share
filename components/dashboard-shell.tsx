import { APP_NAME, DASHBOARD_SECTIONS, SAMPLE_SKILLS } from "@/lib/constants";
import { getPanelClassName } from "@/components/ui/panel";

const stats = [
  { label: "Skills in catalog", value: "12", note: "Seed data only" },
  { label: "Categories", value: "6", note: "Prompting, coding, research and more" },
  { label: "Planned access rule", value: "@cars24.com", note: "To be enforced with Supabase Auth" },
];

export function DashboardShell() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-10 lg:px-12">
      <section className={getPanelClassName({ className: "overflow-hidden" })}>
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10 lg:py-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-accent">
                Internal alpha scaffold
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] text-muted">
                Markdown skill marketplace
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.24em] text-muted">
                {APP_NAME}
              </p>
              <h1 className="max-w-3xl text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold text-balance sm:text-[var(--font-size-display-xl)]">
                A shared home for ChatGPT and Codex skills used across Cars teams.
              </h1>
              <p className="max-w-2xl text-[var(--font-size-body-l)] leading-[var(--line-height-body)] text-muted">
                The app boots, the stack is wired, and the repo is ready for the
                first real product slice: auth, uploads, browsing, and markdown
                previews.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-accent px-4 py-2 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-white">
                Next.js App Router
              </span>
              <span className="rounded-full border border-border bg-background px-4 py-2 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold">
                TypeScript
              </span>
              <span className="rounded-full border border-border bg-background px-4 py-2 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold">
                Tailwind CSS
              </span>
              <span className="rounded-full border border-border bg-background px-4 py-2 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold">
                Supabase planned next
              </span>
            </div>
          </div>

          <aside className={getPanelClassName({ tone: "subtle", padding: "md" })}>
            <div className="space-y-3">
              <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
                What this scaffold proves
              </p>
              <ul className="space-y-3 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                {DASHBOARD_SECTIONS.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-border bg-surface px-4 py-3">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={getPanelClassName({ tone: "subtle", padding: "md" })}
          >
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">{stat.label}</p>
            <p className="mt-3 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">{stat.value}</p>
            <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">{stat.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article
          className={getPanelClassName({
            tone: "subtle",
            padding: "md",
            className: "sm:p-6",
          })}
        >
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">Catalog preview</h2>
              <p className="mt-1 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Temporary seed data to shape the browse experience before a real backend exists.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)]">
              <span className="rounded-full border border-border px-3 py-1 text-muted">
                Search
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-muted">
                Sort
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-muted">
                Filter
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {SAMPLE_SKILLS.map((skill) => (
              <article
                key={skill.slug}
                className="rounded-3xl border border-border bg-background/80 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-accent-soft px-3 py-1 text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-accent">
                        {skill.category}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1 text-[var(--font-size-caption-xs)] leading-[var(--line-height-body)] text-muted">
                        v{skill.latestVersion}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">{skill.name}</h3>
                      <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">{skill.summary}</p>
                    </div>
                  </div>

                  <div className="min-w-40 rounded-2xl border border-border bg-surface px-4 py-3 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                    <p className="font-medium text-foreground">{skill.uploaderName}</p>
                    <p>{skill.uploaderEmail}</p>
                    <p className="mt-2">Versions: {skill.versionCount}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article
          className={getPanelClassName({
            tone: "subtle",
            padding: "md",
            className: "sm:p-6",
          })}
        >
          <h2 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">Next build targets</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl border border-border bg-background/80 px-4 py-4">
              <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">1. Authentication</p>
              <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Add Supabase auth scaffolding and gate access to `@cars24.com` users in middleware.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background/80 px-4 py-4">
              <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">2. Skill ingestion</p>
              <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Accept markdown uploads, parse frontmatter, and create skill plus version records.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background/80 px-4 py-4">
              <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">3. Marketplace UX</p>
              <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Build browse, detail, preview, download, and uploader filters with server components.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background/80 px-4 py-4">
              <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">4. Admin moderation</p>
              <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                Add role-aware controls for approvals, takedowns, metadata edits, and audit history.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
