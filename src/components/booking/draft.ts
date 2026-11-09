"use client";

// Remembers the customer's name/email/note between the "Your details" and "Review"
// steps. It lives in sessionStorage: it stays in this browser tab only and is gone
// when the tab closes. We keep it out of the web address on purpose: addresses end
// up in browser history and server logs, and personal details shouldn't.

import { useSyncExternalStore } from "react";

export type Draft = { name: string; email: string; note: string };

const key = (slotId: string) => `slot:draft:${slotId}`;

export function saveDraft(slotId: string, draft: Draft) {
  sessionStorage.setItem(key(slotId), JSON.stringify(draft));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Reads the saved draft. On the server (and the first paint) there is no
 * sessionStorage, so `ready` is false until the browser takes over.
 */
export function useDraft(slotId: string): { ready: boolean; draft: Draft | null } {
  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem(key(slotId)) ?? "",
    () => null,
  );
  if (raw === null) return { ready: false, draft: null };
  try {
    return { ready: true, draft: raw ? (JSON.parse(raw) as Draft) : null };
  } catch {
    return { ready: true, draft: null };
  }
}
