// FAKE DATA for Milestone 1: what Maya (the signed-in owner) sees in her dashboard.
// In M2/M3 this comes from the database, filtered so an owner only ever sees
// their own business's bookings.

import { getBusiness, getSlots, week, type Business } from "@/lib/fake-data";

export type Booking = {
  id: string;
  name: string;
  email: string;
  note: string;
  date: string; // "2026-11-10"
  start: string;
  end: string;
  status: "confirmed" | "cancelled";
  bookedAt: string; // shown as-is
};

export const owner = { firstName: "Maya", email: "maya@example.com" };
export const ownerBusiness = getBusiness("maya-chen-tutoring") as Business;

export const bookings: Booking[] = [
  { id: "bk_101", name: "Jordan Lee", email: "jordan@example.com", note: "", date: "2026-11-09", start: "14:00", end: "15:00", status: "confirmed", bookedAt: "Sat 7 Nov, 10:15" },
  { id: "bk_102", name: "Chloe Martin", email: "chloe@example.com", note: "Can we cover vectors?", date: "2026-11-09", start: "18:00", end: "19:00", status: "confirmed", bookedAt: "Sun 8 Nov, 21:03" },
  { id: "bk_103", name: "Alex Morgan", email: "alex@example.com", note: "Mock exam prep, chapter 4 please.", date: "2026-11-10", start: "12:30", end: "13:30", status: "confirmed", bookedAt: "Sun 8 Nov, 19:42" },
  { id: "bk_104", name: "Priya Shah", email: "priya.shah@example.com", note: "", date: "2026-11-11", start: "15:00", end: "16:00", status: "confirmed", bookedAt: "Mon 9 Nov, 08:30" },
  { id: "bk_105", name: "Daniel Okafor", email: "d.okafor@example.com", note: "First session. GCSE physics.", date: "2026-11-12", start: "13:00", end: "14:00", status: "confirmed", bookedAt: "Mon 9 Nov, 07:55" },
  { id: "bk_106", name: "Sofia Rossi", email: "sofia@example.com", note: "", date: "2026-11-13", start: "10:00", end: "11:00", status: "confirmed", bookedAt: "Fri 6 Nov, 16:20" },
  { id: "bk_090", name: "Tom Becker", email: "tom@example.com", note: "", date: "2026-11-09", start: "11:00", end: "12:00", status: "cancelled", bookedAt: "Thu 5 Nov, 12:00" },
];

export const getBooking = (id: string) => bookings.find((b) => b.id === id);

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export type OwnerSlot = { id: string; start: string; end: string } & (
  | { status: "open" }
  | { status: "booked"; bookingId: string; name: string }
);

/** Every time on a day for the owner: open ones plus booked ones, in time order. */
export function ownerSlotsFor(date: string): OwnerSlot[] {
  const open: OwnerSlot[] = getSlots(ownerBusiness, date).map((s) => ({ id: s.id, start: s.start, end: s.end, status: "open" }));
  const booked: OwnerSlot[] = bookings
    .filter((b) => b.date === date && b.status === "confirmed")
    .map((b) => ({ id: b.id, start: b.start, end: b.end, status: "booked", bookingId: b.id, name: b.name }));
  return [...open, ...booked].sort((a, b) => a.start.localeCompare(b.start));
}

export const ownerWeek = week;
