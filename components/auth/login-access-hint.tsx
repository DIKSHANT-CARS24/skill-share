export function LoginAccessHint() {
  return (
    <div className="group relative inline-flex max-w-full items-center gap-2 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
      <button
        type="button"
        aria-label="Access restriction details"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-[11px] font-semibold text-foreground outline-none transition-colors hover:border-border-strong focus-visible:border-accent"
      >
        i
      </button>
      <span>Only @cars24.com emails</span>
      <div className="pointer-events-none absolute left-0 top-full z-10 mt-3 w-[264px] rounded-[16px] border border-border bg-surface-strong px-4 py-3 text-[var(--font-size-body-s)] leading-[1.5] text-muted opacity-0 shadow-[var(--card-shadow)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        Only Google accounts with an <span className="font-semibold text-foreground">@cars24.com</span>{" "}
        email address can sign in to Skill Share.
      </div>
    </div>
  );
}
