import { cloneElement, isValidElement, type CSSProperties } from "react";
import { cx } from "@/lib/utils";

const variantClasses = {
  primary:
    "border border-transparent bg-accent !text-white [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  secondary:
    "border border-accent bg-accent-soft !text-white [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  accentSecondary:
    "border border-accent bg-surface !text-accent [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  tertiary:
    "border border-border-strong bg-surface !text-white [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  destructive:
    "border border-danger/20 bg-danger-soft !text-danger [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
  ghost:
    "border border-border-strong bg-surface !text-white [&_svg]:!text-current [&_svg]:!stroke-current [&_svg]:!fill-current",
};

const sizeClasses = {
  large:
    "min-h-14 rounded-[14px] px-4 py-[14px] text-[17px]",
  medium:
    "min-h-12 rounded-[12px] px-[14px] py-[10px] text-[15px]",
  small:
    "min-h-10 rounded-[8px] px-3 py-2 text-[12px]",
  xsmall:
    "min-h-9 rounded-[8px] px-3 py-[6px] text-[12px]",
};

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

const variantTextColor: Record<ButtonVariant, string> = {
  primary: "var(--text-inverse)",
  secondary: "var(--text-inverse)",
  accentSecondary: "var(--accent)",
  tertiary: "var(--text-inverse)",
  destructive: "var(--danger)",
  ghost: "var(--text-inverse)",
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
    color: variantTextColor[variant],
  } satisfies CSSProperties;

  const sharedClassName = cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold leading-[1.3] transition-colors [&_svg]:shrink-0 disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-border-strong disabled:shadow-none",
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
          color: variantTextColor[variant],
        } satisfies CSSProperties),
    });
  }

  return (
    <button type="button" className={sharedClassName} style={resolvedStyle} {...props}>
      {children}
    </button>
  );
}
