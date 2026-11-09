"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar, Trash } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import type { Day } from "@/lib/fake-data";
import type { OwnerSlot } from "@/lib/fake-owner";
import { FORWARD } from "@/lib/transitions";

/** Pick a day, see its open and booked times, remove open ones. */
export function TimesManager({ week, slotsByDate }: { week: Day[]; slotsByDate: Record<string, OwnerSlot[]> }) {
  const [date, setDate] = useState(week[1].date);
  // M1: removing only changes what's on screen. M3: it deletes the slot in the database.
  const [removed, setRemoved] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const day = week.find((d) => d.date === date)!;
  const slots = slotsByDate[date].filter((s) => !removed.includes(s.id));
  const open = slots.filter((s) => s.status === "open").length;

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Choose a day" className="grid grid-cols-7 gap-1.5">
        {week.map((d) => {
          const on = d.date === date;
          return (
            <button
              key={d.date}
              type="button"
              aria-pressed={on}
              aria-label={d.long}
              onClick={() => {
                setDate(d.date);
                setMessage("");
              }}
              className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px] ${on ? "bg-ink text-white" : "bg-card"}`}
            >
              <span className={`text-[11px] font-semibold ${on ? "" : "text-muted"}`}>{d.short}</span>
              <span className="text-[17px] font-semibold">{d.num}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-baseline justify-between">
        <h2 className="text-[17px] font-semibold">{day.isToday ? `Today, ${day.compact}` : day.compact}</h2>
        <span className="text-sm text-muted">{slots.length ? `${open} open · ${slots.length - open} booked` : "Nothing added"}</span>
      </div>

      <p aria-live="polite" className="sr-only">
        {message}
      </p>

      {slots.length ? (
        <ul className="rounded-2xl bg-card pl-4 pr-1">
          {slots.map((s) => (
            <li key={s.id} className="flex min-h-[60px] items-center gap-3 border-b border-line last:border-b-0">
              <span className="w-[108px] text-[15px] font-semibold tabular-nums">
                {s.start} – {s.end}
              </span>
              {s.status === "booked" ? (
                <Link href={`/dashboard/bookings/${s.bookingId}`} transitionTypes={FORWARD} className="flex min-h-12 flex-1 items-center justify-between gap-2 pr-3">
                  <span className="text-sm text-muted">{s.name}</span>
                  <Pill tone="booked">Booked</Pill>
                </Link>
              ) : (
                <>
                  <span className="flex flex-1 justify-end">
                    <Pill tone="open">Open</Pill>
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${s.start} on ${day.compact}`}
                    onClick={() => {
                      setRemoved((r) => [...r, s.id]);
                      setMessage(`Removed ${s.start} on ${day.compact}`);
                    }}
                    className="flex size-11 items-center justify-center rounded-[10px] text-muted hover:bg-canvas hover:text-danger"
                  >
                    <Trash size={18} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Calendar size={28} />}
          title={`No times on ${day.name}`}
          action={<ButtonLink href="/dashboard/times/new" transitionTypes={FORWARD} size="md">Add a time</ButtonLink>}
        >
          Customers can’t book this day until you add a time.
        </EmptyState>
      )}
    </div>
  );
}
