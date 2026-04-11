import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

export type InputFieldSize = "medium" | "large";
export type InputFieldVariant = "default" | "primary";

const sizeClasses: Record<
  InputFieldSize,
  {
    field: string;
    input: string;
  }
> = {
  medium: {
    field: "min-h-12 rounded-[12px] px-2 py-3",
    input: "text-[var(--font-size-body-m)] leading-[var(--line-height-body)]",
  },
  large: {
    field: "min-h-14 rounded-[14px] px-3 py-[14px]",
    input: "text-[var(--font-size-body-l)] leading-[var(--line-height-body)]",
  },
};

export function InputShell({
  label,
  value,
  defaultValue,
  placeholder,
  trailing,
  helperText,
  error,
  size = "medium",
  variant = "default",
  className,
  labelClassName,
  fieldClassName,
  inputClassName,
  children,
  disabled,
  ...props
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  trailing?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  size?: InputFieldSize;
  variant?: InputFieldVariant;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
  inputClassName?: string;
  children?: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "children" | "value" | "defaultValue" | "size"
>) {
  const hasError = Boolean(error);
  const resolvedVariant = hasError ? "default" : variant;
  const supportText = error ?? helperText;

  return (
    <label className={cx("flex min-w-0 flex-col gap-2", className)}>
      <span
        className={cx(
          "text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-medium text-foreground",
          disabled && "text-border-strong",
          labelClassName,
        )}
      >
        {label}
      </span>
      <div
        className={cx(
          "glass-input flex items-center gap-2 overflow-hidden transition-[background-color,border-color,box-shadow]",
          sizeClasses[size].field,
          disabled
            ? "border-white/26 bg-white/36 text-border-strong"
            : hasError
              ? "border-danger/45"
              : resolvedVariant === "primary"
                ? "border-accent/30 shadow-[0_18px_36px_rgba(71,54,254,0.12)]"
                : "",
          fieldClassName,
        )}
      >
        {children ? (
          children
        ) : (
          <input
            placeholder={placeholder}
            aria-label={label}
            aria-invalid={hasError || undefined}
            disabled={disabled}
            className={cx(
              "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted disabled:text-border-strong disabled:placeholder:text-border-strong",
              sizeClasses[size].input,
              inputClassName,
            )}
            {...(value !== undefined ? { value } : { defaultValue })}
            {...props}
          />
        )}
        {trailing ? (
          <span
            className={cx(
              "shrink-0 text-[var(--font-size-body-s)] leading-[var(--line-height-body)]",
              disabled ? "text-border-strong" : "text-muted",
            )}
          >
            {trailing}
          </span>
        ) : null}
      </div>
      {supportText ? (
        <span
          className={cx(
            "text-[var(--font-size-body-s)] leading-[var(--line-height-body)]",
            hasError ? "text-danger" : "text-muted",
          )}
        >
          {supportText}
        </span>
      ) : null}
    </label>
  );
}
