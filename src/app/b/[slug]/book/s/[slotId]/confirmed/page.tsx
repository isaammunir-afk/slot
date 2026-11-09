import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmedDetails } from "@/components/booking/ConfirmedDetails";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { allSlotParams } from "@/lib/booking-params";
import { getBusiness, getDay, getSlot } from "@/lib/fake-data";

export const generateStaticParams = allSlotParams;
export const metadata: Metadata = { title: "You’re booked" };

export default async function ConfirmedPage({ params }: PageProps<"/b/[slug]/book/s/[slotId]/confirmed">) {
  const { slug, slotId } = await params;
  const business = getBusiness(slug);
  const slot = business && getSlot(business, slotId);
  const day = slot && getDay(slot.date);
  if (!business || !slot || !day) notFound();

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-7 px-4 pb-8 pt-[72px]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div aria-hidden="true" className="cf-badge flex size-[72px] items-center justify-center rounded-full bg-accent">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path className="cf-check" d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h1 className="mt-2 text-[28px] font-semibold leading-9 tracking-tight">You’re booked</h1>
        <p className="text-base text-muted">
          See you {day.isToday ? "today" : `${day.name} ${day.num} November`} at {slot.start}.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white">
            {business.initials}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold">{business.name}</span>
            <span className="text-sm text-muted">{business.sessionMinutes} min session</span>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5 rounded-xl bg-canvas p-3">
            <dt className="text-[13px] text-muted">Date</dt>
            <dd className="text-[15px] font-semibold">{day.compact}</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-xl bg-canvas p-3">
            <dt className="text-[13px] text-muted">Time</dt>
            <dd className="text-[15px] font-semibold tabular-nums">
              {slot.start} – {slot.end}
            </dd>
          </div>
        </dl>
        <ConfirmedDetails slotId={slot.id} />
      </Card>

      <p className="text-center text-sm text-muted">Need to change or cancel? Contact {business.name} directly.</p>

      <div className="mt-auto flex flex-col gap-3">
        <ButtonLink href="/search">Done</ButtonLink>
        <Link href={`/b/${business.slug}`} className="flex h-11 items-center justify-center text-[15px] font-medium text-muted hover:text-ink">
          Back to {business.name}
        </Link>
      </div>
    </main>
  );
}
