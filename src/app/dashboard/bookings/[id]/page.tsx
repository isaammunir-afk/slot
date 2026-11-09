import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CancelBooking } from "@/components/owner/CancelBooking";
import { BackButton } from "@/components/ui/BackButton";
import { ButtonLink } from "@/components/ui/Button";
import { Mail } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import { getDay } from "@/lib/fake-data";
import { bookings, getBooking, initials } from "@/lib/fake-owner";

export const generateStaticParams = () => bookings.map((b) => ({ id: b.id }));
export const metadata: Metadata = { title: "Booking" };

export default async function BookingDetailPage({ params }: PageProps<"/dashboard/bookings/[id]">) {
  const booking = getBooking((await params).id);
  const day = booking && getDay(booking.date);
  if (!booking || !day) notFound();
  const firstName = booking.name.split(" ")[0];
  const cancelled = booking.status === "cancelled";

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-4 px-4 pb-8 pt-5">
      <header className="flex items-center justify-between">
        <BackButton href="/dashboard/bookings" label="Back to bookings" />
        <Pill tone={cancelled ? "cancelled" : "open"}>{cancelled ? "Cancelled" : "Confirmed"}</Pill>
      </header>

      <div className="flex flex-col items-center gap-2.5 py-2 text-center">
        <div aria-hidden="true" className="flex size-[72px] items-center justify-center rounded-full bg-ink text-2xl font-semibold text-white">
          {initials(booking.name)}
        </div>
        <h1 className="text-2xl font-semibold leading-8 tracking-tight">{booking.name}</h1>
        <p className="text-[15px] text-muted">Booked on {booking.bookedAt}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
          <dt className="text-[13px] text-muted">Date</dt>
          <dd className="text-[17px] font-semibold">{day.compact}</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-card p-4">
          <dt className="text-[13px] text-muted">Time</dt>
          <dd className="text-[17px] font-semibold tabular-nums">
            {booking.start} – {booking.end}
          </dd>
        </div>
      </dl>

      <dl className="rounded-2xl bg-card px-4">
        <div className="flex min-h-16 flex-col justify-center gap-0.5 border-b border-line py-2">
          <dt className="text-[13px] text-muted">Email</dt>
          <dd>
            <a href={`mailto:${booking.email}`} className="inline-flex min-h-11 items-center text-base font-medium text-accent break-all">
              {booking.email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3.5">
          <dt className="text-[13px] text-muted">Note from {firstName}</dt>
          <dd className="text-base leading-6">{booking.note || <span className="text-muted">No note</span>}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <ButtonLink href={`mailto:${booking.email}`}>
          <Mail size={18} /> Email {firstName}
        </ButtonLink>
        {!cancelled && <CancelBooking firstName={firstName} when={`${day.compact}, ${booking.start} – ${booking.end}`} />}
      </div>
    </main>
  );
}
