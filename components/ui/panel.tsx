import { cx } from "@/lib/utils";

export type PanelTone = "default" | "subtle" | "brand-subtle";
export type PanelPadding = "none" | "md" | "lg";

const toneClasses: Record<PanelTone, string> = {
  default: "rounded-[16px] border-border bg-surface-strong shadow-[var(--card-shadow)]",
  subtle: "rounded-[16px] border-border bg-surface shadow-[var(--card-shadow)]",
  "brand-subtle":
    "rounded-[20px] border-border bg-surface-brand-subtle shadow-[var(--card-shadow)]",
};

const paddingClasses: Record<PanelPadding, string> = {
  none: "",
  md: "p-4",
  lg: "p-6",
};

export function getPanelClassName({
  tone = "default",
  padding = "none",
  className,
}: {
  tone?: PanelTone;
  padding?: PanelPadding;
  className?: string;
}) {
  return cx("border", toneClasses[tone], paddingClasses[padding], className);
}

export function Panel({
  children,
  className,
  tone = "default",
  padding = "none",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: PanelTone;
  padding?: PanelPadding;
}) {
  return (
    <section className={getPanelClassName({ tone, padding, className })}>
      {children}
    </section>
  );
}
