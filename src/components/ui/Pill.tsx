import type { ReactNode } from "react";

type Tone = "open" | "booked" | "cancelled" | "neutral";

const tones: Record<Tone, string> = {
  open: "bg-accent-soft text-accent",
  booked: "bg-ink text-white",
  cancelled: "bg-danger-soft text-danger",
  neutral: "bg-canvas text-muted",
};

/** Small status label, e.g. "Open", "Booked", "Next: Today 16:00". */
export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
