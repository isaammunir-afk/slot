"use client"; // Error screens must run in the browser so "Try again" can work.

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert } from "@/components/ui/icons";

// Shown if something unexpected breaks while a page is loading.
// The visitor sees a calm message instead of a blank or broken screen.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // For now we log to the browser console. Later this could go to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <Alert size={26} />
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-[15px] leading-[22px] text-muted">It’s not you. Please try again in a moment.</p>
      <div className="mt-4 flex w-full max-w-xs flex-col gap-2.5">
        <Button onClick={() => retry()}>Try again</Button>
        <ButtonLink href="/search" variant="secondary">
          Go to search
        </ButtonLink>
      </div>
    </main>
  );
}
