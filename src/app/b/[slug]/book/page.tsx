import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { ChevronRight } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import { allBusinessParams } from "@/lib/booking-params";
import { getBusiness, getSlots, week } from "@/lib/fake-data";
import { PageTransition } from "@/components/ui/PageTransition";
import { FORWARD } from "@/lib/transitions";

export const generateStaticParams = allBusinessParams;
export const metadata: Metadata = { title: "Choose a day" };

export default async function ChooseDayPage({ params }: PageProps<"/b/[slug]/book">) {
  const business = getBusiness((await params).slug);
  if (!business) notFound();

  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-8 pt-5">
        <FlowHeader backHref={`/b/${business.slug}`} step={1} title="Choose a day" subtitle={`Next 7 days · ${business.name}`} />

        <ul className="overflow-hidden rounded-[var(--radius-card)] bg-card">
          {week.map((day) => {
            const count = getSlots(business, day.date).length;
            const dateBox = (
              <span
                className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl ${count ? "bg-canvas" : "border border-dashed border-line-mid"}`}
              >
                <span className="text-[11px] font-semibold leading-[14px] text-muted">{day.short}</span>
                <span className="text-lg font-semibold leading-[22px]">{day.num}</span>
              </span>
            );
            return (
              <li key={day.date} className="border-b border-line last:border-b-0">
                {count ? (
                  <Link href={`/b/${business.slug}/book/${day.date}`} transitionTypes={FORWARD} className="flex min-h-[72px] items-center gap-3.5 px-4 hover:bg-canvas/60">
                    {dateBox}
                    <span className="flex flex-1 flex-col">
                      <span className="text-base font-semibold">{day.isToday ? "Today" : day.name}</span>
                      <span className="text-sm text-muted">From {getSlots(business, day.date)[0].start}</span>
                    </span>
                    <Pill tone="open">{count === 1 ? "1 time" : `${count} times`}</Pill>
                    <ChevronRight size={18} className="text-muted" />
                  </Link>
                ) : (
                  <div className="flex min-h-[72px] items-center gap-3.5 px-4 text-muted">
                    {dateBox}
                    <span className="flex flex-1 flex-col">
                      <span className="text-base font-medium">{day.isToday ? "Today" : day.name}</span>
                      <span className="text-sm">Fully booked</span>
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </PageTransition>
  );
}
