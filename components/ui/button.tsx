import { cloneElement, isValidElement, type CSSProperties } from "react";
import { cx } from "@/lib/utils";

const variantClasses = {
  primary:
    "glass-button-primary border !text-white [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  secondary:
    "glass-button-secondary border !text-accent-strong [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  accentSecondary:
    "glass-button-secondary border !text-accent [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  tertiary:
    "glass-button-neutral border !text-foreground [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  destructive:
    "glass-button-destructive border !text-danger [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  ghost:
    "border border-transparent bg-transparent !text-foreground hover:border-white/35 hover:bg-white/30 [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
};

const sizeClasses = {
  large:
    "min-h-14 rounded-[18px] px-5 py-[14px] text-[17px]",
  medium:
    "min-h-12 rounded-[16px] px-[15px] py-[10px] text-[15px]",
  small:
    "min-h-10 rounded-[14px] px-3.5 py-2 text-[12px]",
  xsmall:
    "min-h-9 rounded-[12px] px-3 py-[6px] text-[12px]",
};

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

const variantTextColor: Record<ButtonVariant, string> = {
  primary: "var(--text-inverse)",
  secondary: "var(--accent-strong)",
  accentSecondary: "var(--accent)",
  tertiary: "var(--text-primary)",
  destructive: "var(--danger)",
  ghost: "var(--text-primary)",
};

export function Button({
  children,
  variant = "primary",
  size = "medium",
  className,
  asChild = false,
  style,
  ...props
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const resolvedStyle = {
    ...style,
    color: props.disabled ? "var(--border-primary)" : variantTextColor[variant],
  } satisfies CSSProperties;

  const sharedClassName = cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold leading-[1.3] transition-[background-color,border-color,box-shadow,color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&_svg]:shrink-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/28 disabled:bg-white/36 disabled:text-border-strong disabled:shadow-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const child = children as React.ReactElement<{ className?: string; style?: CSSProperties }>;

    return cloneElement(child, {
      className: cx(
        child.props.className,
        sharedClassName,
      ),
      style:
        ({
          ...child.props.style,
          ...resolvedStyle,
          color: props.disabled ? "var(--border-primary)" : variantTextColor[variant],
        } satisfies CSSProperties),
    });
  }

  return (
    <button type="button" className={sharedClassName} style={resolvedStyle} {...props}>
      {children}
    </button>
  );
}
