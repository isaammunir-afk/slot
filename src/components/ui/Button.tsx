import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "./icons";

type Variant = "primary" | "secondary" | "danger" | "danger-outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-[color-mix(in_srgb,var(--color-ink)_85%,white)]",
  secondary: "border border-line-mid bg-card text-ink hover:bg-canvas",
  danger: "bg-danger text-white hover:bg-[color-mix(in_srgb,var(--color-danger)_88%,black)]",
  "danger-outline": "border border-line-mid bg-card text-danger hover:bg-danger-soft",
};

// How a button looks when it can't be used yet (e.g. "Continue" before a time is picked).
const disabledLook: Record<Variant, string> = {
  primary: "disabled:bg-line disabled:text-muted",
  secondary: "disabled:text-muted",
  danger: "disabled:opacity-60",
  "danger-outline": "disabled:opacity-60",
};

const sizes: Record<Size, string> = {
  md: "h-11 rounded-[var(--radius-control)] px-4 text-[15px]",
  lg: "h-14 w-full rounded-[14px] px-5 text-[17px]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClasses({
  variant = "primary",
  size = "lg",
  className = "",
  loading = false,
}: Omit<Common, "children"> & { loading?: boolean }) {
  // While loading, the button keeps its normal colour (slightly faded) instead of looking disabled.
  const state = loading ? "disabled:cursor-progress opacity-90" : disabledLook[variant];
  return `${base} ${variants[variant]} ${state} ${sizes[size]} ${className}`;
}

/** A real <button>. Pass `loading` while a form is submitting: it shows a spinner and blocks double taps. */
export function Button({
  variant,
  size,
  className,
  loading = false,
  children,
  disabled,
  type = "button",
  ...rest
}: Common & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className, loading })}
      {...rest}
    >
      {loading && <Spinner size={18} />}
      {children}
    </button>
  );
}

/** Looks like a button but navigates to another page. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}
