"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import type { Slot } from "@/lib/fake-data";
import { ActionFooter } from "./FlowHeader";
import { FORWARD } from "@/lib/transitions";

/** Tap a time to select it; Continue unlocks once one is picked. */
export function TimePicker({ slots, basePath, dayLabel }: { slots: Slot[]; basePath: string; dayLabel: string }) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const groups = [
    { label: "Morning", slots: slots.filter((s) => s.start < "12:00") },
    { label: "Afternoon", slots: slots.filter((s) => s.start >= "12:00") },
  ].filter((g) => g.slots.length);

  return (
    <>
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <section key={group.label} className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-card p-4">
            <h2 className="text-sm font-semibold text-muted">{group.label}</h2>
            <div role="group" aria-label={`${group.label} times`} className="grid grid-cols-3 gap-2">
              {group.slots.map((slot) => (
                <Chip key={slot.id} shape="slot" selected={selected?.id === slot.id} onClick={() => setSelected(slot)}>
                  {slot.start}
                </Chip>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ActionFooter>
        <p className="text-center text-sm text-muted" aria-live="polite">
          {selected ? `${dayLabel} · ${selected.start} – ${selected.end}` : "Tap a time to continue"}
        </p>
        {selected ? <ButtonLink href={`${basePath}/s/${selected.id}`} transitionTypes={FORWARD}>Continue</ButtonLink> : <Button disabled>Continue</Button>}
      </ActionFooter>
    </>
  );
}
