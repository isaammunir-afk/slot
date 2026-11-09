"use client";

import { useDraft } from "./draft";

/** "Booked for Alex Morgan · alex@example.com", read from this browser tab. */
export function ConfirmedDetails({ slotId }: { slotId: string }) {
  const { draft } = useDraft(slotId);
  if (!draft) return null;
  return (
    <p className="text-sm text-muted">
      Booked for {draft.name} · {draft.email}
    </p>
  );
}
