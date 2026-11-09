"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChevronRight, List } from "@/components/ui/icons";
import type { Day } from "@/lib/fake-data";
import { initials, type Booking } from "@/lib/fake-owner";

type Tab = "upcoming" | "cancelled";

export function BookingsList({ bookings, week }: { bookings: Booking[]; week: Day[] }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const upcoming = bookings.filter((b) => b.status === "confirmed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const shown = tab === "upcoming" ? upcoming : cancelled;

  // Group bookings under a heading per day, e.g. "Today · Mon 9 Nov".
  const groups = week
    .map((day) => ({
      label: day.isToday ? `Today · ${day.compact}` : day.compact,
      items: shown.filter((b) => b.date === day.date).sort((a, b) => a.start.localeCompare(b.start)),
    }))
    .filter((g) => g.items.length);

  const tabs: { id: Tab; label: string }[] = [
    { id: "upcoming", label: `Upcoming · ${upcoming.length}` },
    { id: "cancelled", label: `Cancelled · ${cancelled.length}` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Filter bookings" className="grid grid-cols-2 gap-1 rounded-xl bg-line p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`h-10 rounded-[9px] text-sm ${tab === t.id ? "bg-card font-semibold shadow-sm" : "font-medium text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <EmptyState icon={<List size={28} />} title={tab === "upcoming" ? "No bookings yet" : "No cancelled bookings"}>
          {tab === "upcoming" ? "When customers book, they’ll appear here." : "Bookings you cancel will show here."}
        </EmptyState>
      ) : (
        groups.map((g) => (
          <section key={g.label} className="flex flex-col gap-2">
            <h2 className="text-[13px] font-semibold text-muted">{g.label}</h2>
            <ul className="rounded-2xl bg-card px-4">
              {g.items.map((b) => (
                <li key={b.id} className="border-b border-line last:border-b-0">
                  <Link href={`/dashboard/bookings/${b.id}`} className="flex min-h-16 items-center gap-3">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-[13px] font-semibold">
                      {initials(b.name)}
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-[15px] font-semibold">{b.name}</span>
                      <span className="text-[13px] text-muted">
                        {b.status === "cancelled" ? "Cancelled by you" : b.note ? "60 min · has a note" : "60 min"}
                      </span>
                    </span>
                    <span className="text-[15px] font-semibold tabular-nums">{b.start}</span>
                    <ChevronRight size={16} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
