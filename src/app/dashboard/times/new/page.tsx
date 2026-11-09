import type { Metadata } from "next";
import { AddTimeForm } from "@/components/owner/AddTimeForm";
import { BackButton } from "@/components/ui/BackButton";
import { week } from "@/lib/fake-data";
import { ownerBusiness } from "@/lib/fake-owner";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = { title: "Add a time" };

export default function AddTimePage() {
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-36 pt-5">
        <BackButton href="/dashboard/times" label="Close" icon="close" />
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Add a time</h1>
          <p className="text-[15px] text-muted">Customers can book it straight away.</p>
        </div>
        <AddTimeForm minDate={week[0].date} defaultLength={ownerBusiness.sessionMinutes} />
      </main>
    </PageTransition>
  );
}
