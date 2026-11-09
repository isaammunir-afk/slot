import type { Metadata } from "next";
import { TimesManager } from "@/components/owner/TimesManager";
import { ButtonLink } from "@/components/ui/Button";
import { Plus } from "@/components/ui/icons";
import { TabBar } from "@/components/ui/TabBar";
import { week } from "@/lib/fake-data";
import { ownerSlotsFor } from "@/lib/fake-owner";
import { PageTransition } from "@/components/ui/PageTransition";
import { FORWARD } from "@/lib/transitions";

export const metadata: Metadata = { title: "Your times" };

export default function TimesPage() {
  const slotsByDate = Object.fromEntries(week.map((d) => [d.date, ownerSlotsFor(d.date)]));
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-32 pt-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Your times</h1>
          <ButtonLink href="/dashboard/times/new" transitionTypes={FORWARD} size="md" className="rounded-full pl-3">
            <Plus size={18} /> Add
          </ButtonLink>
        </div>
        <TimesManager week={week} slotsByDate={slotsByDate} />
        <TabBar active="times" />
      </main>
    </PageTransition>
  );
}
