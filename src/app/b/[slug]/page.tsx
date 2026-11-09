import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { ButtonLink } from "@/components/ui/Button";
import { Card, HeroCard } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowRight, Calendar, Clock } from "@/components/ui/icons";
import { Wordmark } from "@/components/ui/Wordmark";
import { allBusinessParams } from "@/lib/booking-params";
import { getBusiness, getNextSlot } from "@/lib/fake-data";
import { PageTransition } from "@/components/ui/PageTransition";
import { FORWARD } from "@/lib/transitions";
import { ViewTransition } from "react";

export const generateStaticParams = allBusinessParams;

export async function generateMetadata({ params }: PageProps<"/b/[slug]">): Promise<Metadata> {
  const business = getBusiness((await params).slug);
  return { title: business?.name ?? "Business not found" };
}

export default async function BusinessPage({ params }: PageProps<"/b/[slug]">) {
  const business = getBusiness((await params).slug);
  if (!business) notFound();
  const next = getNextSlot(business);
  const base = `/b/${business.slug}/book`;

  return (
    <PageTransition>
      <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-4 px-4 pb-8 pt-5">
        <header className="flex items-center justify-between">
          <BackButton href="/search" label="Back to search" />
          <Wordmark size={20} />
        </header>

        <Card className="flex flex-col items-center gap-3 px-5 py-6 text-center">
          <ViewTransition name={`biz-avatar-${business.slug}`} share="morph" default="none">
            <div aria-hidden="true" className="flex size-[72px] items-center justify-center rounded-full bg-ink text-2xl font-semibold text-white">
              {business.initials}
            </div>
          </ViewTransition>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold leading-8 tracking-tight">{business.name}</h1>
            <p className="text-[15px] leading-[22px] text-muted">{business.description}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-2 text-[13px] font-medium">
            <li className="flex h-8 items-center gap-1.5 rounded-full bg-canvas px-3">
              <Clock size={14} /> {business.sessionMinutes} min sessions
            </li>
            <li className="flex h-8 items-center gap-1.5 rounded-full bg-canvas px-3">
              {business.category} · {business.area}
            </li>
          </ul>
        </Card>

        {next ? (
          <HeroCard className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-white/70">Next available</h2>
              {next.day.isToday && <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">Today</span>}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[32px] font-semibold leading-10 tracking-tight tabular-nums">{next.slot.start}</span>
              <span className="text-[15px] text-white/85">
                {next.day.name} {next.day.num} November · {business.sessionMinutes} min
              </span>
            </div>
            <ButtonLink href={`${base}/s/${next.slot.id}`} transitionTypes={FORWARD} size="md" variant="secondary" className="h-12 border-0">
              Book this time
            </ButtonLink>
          </HeroCard>
        ) : (
          <EmptyState icon={<Calendar size={28} />} title="Fully booked this week">
            {business.name} has no open times right now. Check back soon.
          </EmptyState>
        )}

        <Card className="flex flex-col gap-3.5">
          <h2 className="text-base font-semibold">How booking works</h2>
          <ol className="flex flex-col gap-3 text-[15px]">
            {["Choose a day and time", "Add your name and email", "Confirm. No account needed"].map((text, i) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent">
                  {i + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </Card>

        {next && (
          <ButtonLink href={base} transitionTypes={FORWARD} className="mt-auto">
            See all times <ArrowRight size={18} />
          </ButtonLink>
        )}
      </main>
    </PageTransition>
  );
}
