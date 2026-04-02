import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  badge,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-6 py-6 sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[var(--font-size-heading-m)] leading-[var(--line-height-heading)] font-semibold text-balance sm:text-[var(--font-size-heading-l)]">
              {title}
            </h1>
            {badge ? <Badge tone="information">{badge}</Badge> : null}
          </div>
          <p className="max-w-3xl text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted sm:text-[var(--font-size-body-l)]">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
