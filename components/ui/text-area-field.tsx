import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/utils";

export function TextAreaField({
  label,
  helperText,
  error,
  characterCount,
  characterLimit,
  className,
  fieldClassName,
  textAreaClassName,
  disabled,
  rows = 5,
  ...props
}: {
  label: string;
  helperText?: ReactNode;
  error?: ReactNode;
  characterCount?: number;
  characterLimit?: number;
  className?: string;
  fieldClassName?: string;
  textAreaClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">) {
  const hasError = Boolean(error);
  const footerText = error ?? helperText;
  const countLabel =
    typeof characterCount === "number"
      ? typeof characterLimit === "number"
        ? `${characterCount}/${characterLimit}`
        : `${characterCount}`
      : null;

  return (
    <label className={cx("flex min-w-0 flex-col gap-2", className)}>
      <span
        className={cx(
          "text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-medium text-foreground",
          disabled && "text-border-strong",
        )}
      >
        {label}
      </span>
      <div
        className={cx(
          "glass-input overflow-hidden rounded-[18px] p-3 transition-[background-color,border-color,box-shadow]",
          disabled
            ? "border-white/26 bg-white/36"
            : hasError
              ? "border-danger/45"
              : "",
          fieldClassName,
        )}
      >
        <textarea
          aria-label={label}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          rows={rows}
          className={cx(
            "block min-h-24 w-full resize-y bg-transparent text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-foreground outline-none placeholder:text-muted disabled:text-border-strong disabled:placeholder:text-border-strong",
            textAreaClassName,
          )}
          {...props}
        />
      </div>
      {footerText || countLabel ? (
        <div className="flex items-start justify-between gap-3">
          <span
            className={cx(
              "min-w-0 text-[var(--font-size-body-s)] leading-[var(--line-height-body)]",
              hasError ? "text-danger" : "text-muted",
            )}
          >
            {footerText}
          </span>
          {!hasError && countLabel ? (
            <span className="shrink-0 text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-muted">
              {countLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </label>
  );
}
