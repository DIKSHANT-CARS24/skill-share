import { cx } from "@/lib/utils";

export type PanelTone = "default" | "subtle" | "brand-subtle";
export type PanelPadding = "none" | "md" | "lg";

const toneClasses: Record<PanelTone, string> = {
  default: "glass-surface-strong rounded-[24px]",
  subtle: "glass-surface rounded-[24px]",
  "brand-subtle": "glass-surface-brand rounded-[24px]",
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
  return cx("relative isolate", toneClasses[tone], paddingClasses[padding], className);
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
