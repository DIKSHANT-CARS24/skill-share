import { cx } from "@/lib/utils";

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "h-14 w-14 text-[var(--font-size-title-m)]"
      : size === "sm"
        ? "h-8 w-8 text-[var(--font-size-caption-xs)]"
        : "h-10 w-10 text-[var(--font-size-label-s)]";

  return (
    <div
      className={cx(
        "inline-flex items-center justify-center rounded-2xl border border-accent/10 bg-accent-soft leading-none font-semibold text-accent",
        sizeClass,
        className,
      )}
    >
      {initials}
    </div>
  );
}
