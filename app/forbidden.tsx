import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8">
      <Panel padding="lg" className="w-full">
        <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-muted">
          Forbidden
        </p>
        <h1 className="mt-3 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold sm:text-[var(--font-size-display-xl)]">
          Your account does not have access to this page
        </h1>
        <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted sm:text-[var(--font-size-body-l)]">
          You are signed in, but your
          <code className="mx-1 rounded bg-surface px-2 py-0.5">org_members</code>
          row is inactive or your role is not allowed to view this resource.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary">
            <Link href="/skills">Back to catalog</Link>
          </Button>
        </div>
      </Panel>
    </main>
  );
}
