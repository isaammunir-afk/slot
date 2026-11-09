import Link from "next/link";
import { ChevronLeft, Close } from "./icons";
import { BACK } from "@/lib/transitions";

/** Round 44px back (or close) button for the top of a screen. */
export function BackButton({ href, label = "Back", icon = "back" }: { href: string; label?: string; icon?: "back" | "close" }) {
  return (
    <Link
      href={href}
      transitionTypes={BACK}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink hover:bg-canvas"
    >
      {icon === "close" ? <Close size={18} /> : <ChevronLeft />}
    </Link>
  );
}
