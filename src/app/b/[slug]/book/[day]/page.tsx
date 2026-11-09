import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { TimePicker } from "@/components/booking/TimePicker";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar } from "@/components/ui/icons";
import { allDayParams } from "@/lib/booking-params";
import { getBusiness, getDay, getSlots } from "@/lib/fake-data";

export const generateStaticParams = allDayParams;
export const metadata: Metadata = { title: "Choose a time" };

export default async function ChooseTimePage({ params }: PageProps<"/b/[slug]/book/[day]">) {
  const { slug, day: date } = await params;
  const business = getBusiness(slug);
  const day = getDay(date);
  if (!business || !day) notFound();
  const slots = getSlots(business, day.date);
  const base = `/b/${business.slug}/book`;

  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-44 pt-5">
      <FlowHeader backHref={base} step={2} title="Choose a time" subtitle={`${day.long} · ${business.timezoneLabel}`} />
      {slots.length ? (
        <TimePicker slots={slots} basePath={base} dayLabel={day.compact} />
      ) : (
        <EmptyState
          icon={<Calendar size={28} />}
          title={`No times left on ${day.name}`}
          action={<ButtonLink href={base} size="md" variant="secondary">Choose another day</ButtonLink>}
        >
          Someone may have just booked the last one.
        </EmptyState>
      )}
    </main>
  );
}
