"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionFooter } from "@/components/booking/FlowHeader";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Field, Input } from "@/components/ui/Field";
import { Clock } from "@/components/ui/icons";

const LENGTHS = [30, 45, 60, 90];

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  // Format in UTC so the label never shifts by a day because of the viewer's time zone.
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export function AddTimeForm({ minDate, defaultLength }: { minDate: string; defaultLength: number }) {
  const router = useRouter();
  const [date, setDate] = useState(minDate);
  const [start, setStart] = useState("10:00");
  const [length, setLength] = useState(defaultLength);
  const [errors, setErrors] = useState<{ date?: string; start?: string }>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = {
      date: !date ? "Please pick a date." : date < minDate ? "Pick today or a later date." : undefined,
      start: start ? undefined : "Please pick a start time.",
    };
    setErrors(found);
    if (found.date || found.start) return;
    setLoading(true);
    // M1: pretend. M3: a Server Action checks it doesn't overlap another time, then saves it.
    setTimeout(() => router.push("/dashboard/times"), 600);
  }

  return (
    <form id="add-time" noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-[18px] rounded-[var(--radius-card)] bg-card px-4 py-5">
        <Field id="at-date" label="Date" error={errors.date}>
          {(a11y) => <Input {...a11y} type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />}
        </Field>
        <Field id="at-start" label="Start time" error={errors.start}>
          {(a11y) => <Input {...a11y} type="time" step={300} value={start} onChange={(e) => setStart(e.target.value)} />}
        </Field>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Length</legend>
          <div className="grid grid-cols-4 gap-2">
            {LENGTHS.map((m) => (
              <Chip key={m} shape="slot" selected={m === length} onClick={() => setLength(m)} className="h-12 text-[15px]">
                {m} min
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      {date && start && (
        <p className="flex items-center gap-3 rounded-2xl bg-accent-soft px-4 py-3.5 text-[15px] font-medium" aria-live="polite">
          <Clock size={20} className="text-accent" />
          {formatDate(date)} · {start} – {addMinutes(start, length)}
        </p>
      )}

      <ActionFooter>
        <Button type="submit" form="add-time" loading={loading}>
          {loading ? "Saving…" : "Save time"}
        </Button>
      </ActionFooter>
    </form>
  );
}
