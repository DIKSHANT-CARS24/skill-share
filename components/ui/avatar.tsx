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
        "inline-flex items-center justify-center rounded-[20px] border border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(232,227,255,0.62)_100%)] leading-none font-semibold text-accent shadow-[0_16px_32px_rgba(71,54,254,0.16)] backdrop-blur-[18px]",
        sizeClass,
        className,
      )}
    >
      {initials}
    </div>
  );
}
