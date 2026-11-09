"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/icons";

/**
 * "Cancel booking" button plus the confirm sheet that slides up from the bottom.
 * It uses the browser's built-in <dialog>, which handles the hard accessibility parts:
 * focus moves into the sheet, the page behind can't be tapped, and Esc closes it.
 */
export function CancelBooking({ firstName, when }: { firstName: string; when: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);

  function confirmCancel() {
    setLoading(true);
    // M1: pretend. M3: a Server Action marks the booking cancelled and reopens the time.
    setTimeout(() => router.push("/dashboard/bookings"), 600);
  }

  return (
    <>
      <Button variant="danger-outline" onClick={() => dialog.current?.showModal()}>
        Cancel booking
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby="cancel-title"
        className="sheet mx-auto mb-0 mt-auto w-full max-w-[560px] rounded-t-3xl bg-card p-0 text-ink backdrop:bg-ink/50"
      >
        <div className="flex flex-col gap-5 px-5 pb-[max(env(safe-area-inset-bottom),28px)] pt-3">
          <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line-mid" />
          <div className="flex size-[52px] items-center justify-center rounded-full bg-danger-soft text-danger">
            <Calendar size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 id="cancel-title" className="text-[22px] font-semibold leading-[30px] tracking-tight">
              Cancel {firstName}’s booking?
            </h2>
            <p className="text-[15px] leading-[22px] text-muted">{when}. The time will open up again so someone else can book it.</p>
          </div>
          <p className="rounded-xl bg-canvas px-3.5 py-3 text-sm text-ink/80">
            Slot doesn’t send emails yet, so let {firstName} know yourself.
          </p>
          <div className="flex flex-col gap-2.5">
            <Button variant="danger" loading={loading} onClick={confirmCancel}>
              {loading ? "Cancelling…" : "Yes, cancel booking"}
            </Button>
            <Button variant="secondary" disabled={loading} onClick={() => dialog.current?.close()}>
              Keep booking
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
