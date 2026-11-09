import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { PageTransition } from "@/components/ui/PageTransition";
import { FORWARD } from "@/lib/transitions";

// The welcome screen. The animation is pure CSS (see the "Welcome animation" section in
// globals.css), so it starts instantly without waiting for any JavaScript to load.
export default function WelcomePage() {
  return (
    <PageTransition>
      <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-ink px-6 pb-10 pt-[72px] text-white">
        <div aria-hidden="true" className="sl-glow pointer-events-none absolute top-[24%] size-[360px] rounded-full" />

        <div className="relative flex flex-1 items-center justify-center">
          <h1 aria-label="Slot" className="flex items-baseline text-[112px] font-extrabold leading-none tracking-[-0.06em]">
            {["S", "l", "o", "t"].map((letter, i) => (
              <span key={i} aria-hidden="true" className="sl-letter" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                {letter}
              </span>
            ))}
            <span aria-hidden="true" className="sl-dot wm-dot text-accent-on-dark" />
          </h1>
        </div>

        <div className="flex w-full max-w-[420px] flex-col items-center gap-7">
          <div className="sl-rise flex flex-col items-center gap-2 text-center" style={{ animationDelay: "1.4s" }}>
            <p className="text-2xl font-semibold leading-8 tracking-tight">Reserve slots in seconds.</p>
            <p className="text-base text-white/65">Find a business, pick a time, done.</p>
          </div>
          <div className="sl-rise flex w-full flex-col gap-3" style={{ animationDelay: "1.6s" }}>
            <Link
              href="/search"
            transitionTypes={FORWARD}
              className="flex h-14 items-center justify-center gap-2 rounded-[14px] bg-white text-[17px] font-semibold text-ink hover:bg-white/90"
            >
              Get started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/signup"
            transitionTypes={FORWARD}
              className="flex h-12 items-center justify-center text-[15px] font-medium text-white/80 hover:text-white"
            >
              Own a business? List it on Slot
            </Link>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
