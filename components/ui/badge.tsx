import type { BadgeAppearance, BadgeSize, BadgeTone } from "@/lib/types";
import { cx } from "@/lib/utils";

const appearanceClasses = {
  subtle: "border border-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[14px]",
  solid: "border border-transparent shadow-[0_12px_24px_rgba(104,94,156,0.12)]",
  stroke: "border backdrop-blur-[14px]",
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: "rounded-full px-2.5 py-1.5 text-[11px]",
  md: "rounded-full px-3.5 py-2 text-[13px]",
};

const toneAppearanceClasses = {
  neutral: {
    subtle: "bg-badge-neutral-subtle-surface text-badge-neutral-subtle-text",
    solid: "bg-badge-neutral-solid-surface text-white",
    stroke: "border-white/42 bg-badge-neutral-stroke-surface text-foreground",
  },
  information: {
    subtle: "bg-surface-brand-subtle text-badge-information-text",
    solid: "bg-accent text-white",
    stroke: "border-badge-information-stroke-border bg-surface-brand-subtle text-badge-information-text",
  },
  success: {
    subtle: "bg-success-soft text-badge-success-text",
    solid: "bg-badge-success-solid-surface text-white",
    stroke: "border-badge-success-text/35 bg-success-soft text-badge-success-text",
  },
  warning: {
    subtle: "bg-warning-soft text-badge-warning-text",
    solid: "bg-badge-warning-solid-surface text-white",
    stroke: "border-badge-warning-text/30 bg-warning-soft text-badge-warning-text",
  },
  error: {
    subtle: "bg-danger-soft text-badge-error-text",
    solid: "bg-badge-error-solid-surface text-white",
    stroke: "border-badge-error-text/25 bg-danger-soft text-badge-error-text",
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
