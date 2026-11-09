import type { ComponentProps } from "react";

type ChipProps = ComponentProps<"button"> & {
  selected: boolean;
  /** "pill" for category filters, "slot" for bookable time buttons. */
  shape?: "pill" | "slot";
};

/** A toggle button. `aria-pressed` tells screen readers whether it is selected. */
export function Chip({ selected, shape = "pill", className = "", ...rest }: ChipProps) {
  const shapeClasses =
    shape === "slot"
      ? "h-[52px] w-full rounded-[var(--radius-control)] text-[17px] tabular-nums"
      : "h-11 shrink-0 rounded-full px-4 text-sm";
  const stateClasses = selected
    ? shape === "slot"
      ? "bg-accent font-semibold text-white"
      : "bg-ink font-semibold text-white"
    : "border border-line-mid bg-card font-medium text-ink hover:bg-canvas";
  return (
    <button type="button" aria-pressed={selected} className={`${shapeClasses} ${stateClasses} ${className}`} {...rest} />
  );
}
