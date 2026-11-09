import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { ReviewSummary } from "@/components/booking/ReviewSummary";
import { allSlotParams } from "@/lib/booking-params";
import { getBusiness, getDay, getSlot } from "@/lib/fake-data";
import { PageTransition } from "@/components/ui/PageTransition";

export const generateStaticParams = allSlotParams;
export const metadata: Metadata = { title: "Review and confirm" };

export default async function ReviewPage({ params }: PageProps<"/b/[slug]/book/s/[slotId]/review">) {
  const { slug, slotId } = await params;
  const business = getBusiness(slug);
  const slot = business && getSlot(business, slotId);
  const day = slot && getDay(slot.date);
  if (!business || !slot || !day) notFound();
  const base = `/b/${business.slug}/book`;

  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-44 pt-5">
        <FlowHeader backHref={`${base}/s/${slot.id}`} step={4} title="Review and confirm" subtitle="Check everything looks right." />
        <ReviewSummary
          slotId={slot.id}
          businessName={business.name}
          dayLong={day.long}
          timeLabel={`${slot.start} – ${slot.end} · ${business.timezoneLabel}`}
          dayPath={base}
          timePath={`${base}/${slot.date}`}
          detailsPath={`${base}/s/${slot.id}`}
          confirmedPath={`${base}/s/${slot.id}/confirmed`}
        />
      </main>
    </PageTransition>
  );
}
