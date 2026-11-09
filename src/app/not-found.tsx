import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = { title: "Page not found" };

// Shown for addresses that don't exist, e.g. a business that has left Slot.
export default function NotFound() {
  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col items-center justify-center gap-3 px-6 text-center">
        <Wordmark size={40} />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">We couldn’t find that page</h1>
        <p className="text-[15px] leading-[22px] text-muted">The link may be old, or the business may no longer be on Slot.</p>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-2.5">
          <ButtonLink href="/search">Find a business</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Go to the start
          </ButtonLink>
        </div>
      </main>
    </PageTransition>
  );
}
