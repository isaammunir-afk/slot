"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Field";
import { TIMEZONES } from "@/lib/timezones";

/** On/off switch for "Show in Slot search". role="switch" tells screen readers it's a toggle. */
export function ListedSwitch() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex min-h-14 items-center gap-3 py-2">
      <span className="flex flex-1 flex-col">
        <span id="listed-label" className="text-[15px] font-medium">
          Show in Slot search
        </span>
        <span className="text-[13px] text-muted">{on ? "Anyone can find you in search" : "Only people with your link can book"}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="listed-label"
        onClick={() => setOn(!on)}
        className={`flex h-8 w-[52px] shrink-0 items-center rounded-full p-[3px] transition-colors ${on ? "justify-end bg-accent" : "justify-start bg-line-mid"}`}
      >
        <span className="size-[26px] rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

export function TimezoneSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label htmlFor="set-tz" className="flex min-h-14 items-center gap-3">
      <span className="flex-1 text-[15px] font-medium">Time zone</span>
      <Select id="set-tz" defaultValue={defaultValue} className="h-10 w-auto max-w-[180px] border-0 bg-transparent px-1 text-right text-sm text-muted">
        {TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </Select>
    </label>
  );
}

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your booking link:", `${window.location.origin}${path}`);
    }
  }
  return (
    <div className="flex min-h-14 items-center gap-3 py-2">
      <span className="flex flex-1 flex-col">
        <span className="text-[15px] font-medium">Your booking page</span>
        <span className="text-[13px] text-muted break-all">…{path}</span>
      </span>
      <button
        type="button"
        onClick={copy}
        className="flex h-9 shrink-0 items-center rounded-full bg-accent-soft px-3.5 text-[13px] font-semibold text-accent"
      >
        <span aria-live="polite">{copied ? "Copied!" : "Copy link"}</span>
      </button>
    </div>
  );
}
