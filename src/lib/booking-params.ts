// Every fake address the booking pages can have, so Next.js can build them all
// ahead of time. In M2 these come from the database instead.
import { businesses, getSlots, week } from "@/lib/fake-data";

export const allBusinessParams = () => businesses.map((b) => ({ slug: b.slug }));

export const allDayParams = () => businesses.flatMap((b) => week.map((d) => ({ slug: b.slug, day: d.date })));

export const allSlotParams = () =>
  businesses.flatMap((b) => week.flatMap((d) => getSlots(b, d.date).map((s) => ({ slug: b.slug, slotId: s.id }))));
