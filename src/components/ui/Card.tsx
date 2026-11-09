import type { ComponentProps } from "react";

/** White rounded panel that sits on the grey canvas. */
export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`rounded-[var(--radius-card)] bg-card p-5 ${className}`} {...rest} />;
}

/** Dark card for the single most important thing on a screen ("Next available", "Next up"). */
export function HeroCard({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`rounded-[var(--radius-card)] bg-ink p-5 text-white ${className}`} {...rest} />;
}
