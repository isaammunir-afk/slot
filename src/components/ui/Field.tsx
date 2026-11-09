import type { ComponentProps, ReactNode } from "react";
import { Alert } from "./icons";

type FieldProps = {
  /** Must be unique on the page: it links the label, hint and error to the input. */
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: (a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: true }) => ReactNode;
};

/**
 * Wraps one form control with its label, hint and error message.
 * It hands the control the right accessibility attributes, so screen readers
 * read the label, the hint and any error together.
 */
export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, ...(error ? { "aria-invalid": true as const } : {}) })}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-[13px] leading-[18px] text-danger">
          <Alert size={14} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-[13px] leading-[18px] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

const control =
  "w-full rounded-[var(--radius-control)] border border-line-strong bg-card px-3.5 text-base text-ink placeholder:text-muted " +
  "focus:border-2 focus:border-accent focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger";

export function Input({ className = "", ...rest }: ComponentProps<"input">) {
  return <input className={`${control} h-[52px] ${className}`} {...rest} />;
}

export function Textarea({ className = "", rows = 3, ...rest }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={`${control} resize-none py-3 leading-6 ${className}`} {...rest} />;
}

export function Select({ className = "", ...rest }: ComponentProps<"select">) {
  return <select className={`${control} h-[52px] ${className}`} {...rest} />;
}
