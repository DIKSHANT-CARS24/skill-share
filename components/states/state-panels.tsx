import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function EmptyStatePanel({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <Panel className="px-6 py-14 text-center">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-[var(--font-size-label-m)] leading-none font-semibold text-accent">
          SS
        </div>
        <h2 className="text-[var(--font-size-heading-m)] leading-[var(--line-height-heading)] font-semibold sm:text-[var(--font-size-heading-l)]">{title}</h2>
        <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted sm:text-[var(--font-size-body-l)]">{description}</p>
        <Button asChild className="mt-2 w-full sm:w-auto">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </Panel>
  );
}

export function ErrorStatePanel({
  title = "The catalog could not be loaded right now.",
  description = "This screen keeps the recovery path clear when a live data request fails without exposing unnecessary technical detail to most users.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Panel className="px-6 py-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-danger">
          Unable to load skills
        </p>
        <h2 className="text-[var(--font-size-heading-m)] leading-[var(--line-height-heading)] font-semibold sm:text-[var(--font-size-heading-l)]">{title}</h2>
        <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted sm:text-[var(--font-size-body-l)]">{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button onClick={onRetry} className="w-full sm:w-auto">
            Retry catalog
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto" disabled>
            Open status notes
          </Button>
        </div>
      </div>
    </Panel>
  );
}

export function LoadingStateGrid() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Panel key={index} padding="md" className="animate-pulse">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-surface-muted" />
              <div className="h-6 w-20 rounded-full bg-surface-muted" />
            </div>
            <div className="h-7 w-2/3 rounded-xl bg-surface-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-xl bg-surface-muted" />
              <div className="h-4 w-5/6 rounded-xl bg-surface-muted" />
            </div>
            <div className="h-24 rounded-[20px] bg-surface-muted" />
          </div>
        </Panel>
      ))}
    </div>
  );
}
