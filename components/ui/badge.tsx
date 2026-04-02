import type { BadgeAppearance, BadgeSize, BadgeTone } from "@/lib/types";
import { cx } from "@/lib/utils";

const appearanceClasses = {
  subtle: "border-transparent",
  solid: "border-transparent",
  stroke: "border",
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: "rounded-[12px] px-2 py-1.5 text-[11px]",
  md: "rounded-[14px] px-3 py-2 text-[13px]",
};

const toneAppearanceClasses = {
  neutral: {
    subtle: "bg-badge-neutral-subtle-surface text-badge-neutral-subtle-text",
    solid: "bg-badge-neutral-solid-surface text-white",
    stroke: "border-border bg-badge-neutral-stroke-surface text-foreground",
  },
  information: {
    subtle: "bg-surface-brand-subtle text-badge-information-text",
    solid: "bg-accent text-white",
    stroke: "border-badge-information-stroke-border bg-surface-brand-subtle text-badge-information-text",
  },
  success: {
    subtle: "bg-success-soft text-badge-success-text",
    solid: "bg-badge-success-solid-surface text-white",
    stroke: "border-badge-success-text bg-success-soft text-badge-success-text",
  },
  warning: {
    subtle: "bg-warning-soft text-badge-warning-text",
    solid: "bg-badge-warning-solid-surface text-white",
    stroke: "border-badge-warning-text bg-warning-soft text-badge-warning-text",
  },
  error: {
    subtle: "bg-danger-soft text-badge-error-text",
    solid: "bg-badge-error-solid-surface text-white",
    stroke: "border-badge-error-text bg-danger-soft text-badge-error-text",
  },
} satisfies Record<"neutral" | "information" | "success" | "warning" | "error", Record<BadgeAppearance, string>>;

export function Badge({
  children,
  tone = "neutral",
  appearance = "subtle",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  className?: string;
}) {
  const resolvedTone =
    tone === "accent"
      ? "information"
      : tone === "danger"
        ? "error"
        : tone;

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold leading-[1.3]",
        appearanceClasses[appearance],
        sizeClasses[size],
        toneAppearanceClasses[resolvedTone][appearance],
        className,
      )}
    >
      {children}
    </span>
  );
}
