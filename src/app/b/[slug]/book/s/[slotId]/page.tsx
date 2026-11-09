import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailsForm } from "@/components/booking/DetailsForm";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { allSlotParams } from "@/lib/booking-params";
import { getBusiness, getDay, getSlot } from "@/lib/fake-data";

export const generateStaticParams = allSlotParams;
export const metadata: Metadata = { title: "Your details" };

export default async function DetailsPage({ params }: PageProps<"/b/[slug]/book/s/[slotId]">) {
  const { slug, slotId } = await params;
  const business = getBusiness(slug);
  const slot = business && getSlot(business, slotId);
  const day = slot && getDay(slot.date);
  if (!business || !slot || !day) notFound();
  const base = `/b/${business.slug}/book`;

  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-36 pt-5">
      <FlowHeader
        backHref={`${base}/${slot.date}`}
        step={3}
        title="Your details"
        subtitle={`${day.compact} · ${slot.start} – ${slot.end} · ${business.name}`}
      />
      <DetailsForm slotId={slot.id} reviewPath={`${base}/s/${slot.id}/review`} ownerFirstName={business.name.split(" ")[0]} />
    </main>
  );
}
