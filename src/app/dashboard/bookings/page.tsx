import type { Metadata } from "next";
import { BookingsList } from "@/components/owner/BookingsList";
import { TabBar } from "@/components/ui/TabBar";
import { week } from "@/lib/fake-data";
import { bookings } from "@/lib/fake-owner";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = { title: "Bookings" };

export default function BookingsPage() {
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-32 pt-6">
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Bookings</h1>
        <BookingsList bookings={bookings} week={week} />
        <TabBar active="bookings" />
      </main>
    </PageTransition>
  );
}
