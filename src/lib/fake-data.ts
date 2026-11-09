// FAKE DATA for Milestone 1 only. In M2 this file is deleted and the same
// information comes from the Supabase database instead.

export const CATEGORIES = ["Tutoring", "Hair", "Nails", "Fitness", "Beauty"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Business = {
  /** The part of the web address that identifies the business: /b/maya-chen-tutoring */
  slug: string;
  name: string;
  initials: string;
  category: Category;
  area: string;
  description: string;
  sessionMinutes: number;
  timezoneLabel: string;
};

export type Day = {
  /** ISO date, also used in the address: /b/maya-chen-tutoring/book/2026-11-10 */
  date: string;
  short: string; // "MON"
  num: string; // "9"
  name: string; // "Monday"
  long: string; // "Tuesday 10 November" or "Today, Monday 9 November"
  compact: string; // "Tue 10 Nov"
  isToday: boolean;
};

export type Slot = {
  /** Fake id, e.g. "2026-11-10-1000". In M2 this becomes the database id. */
  id: string;
  date: string;
  start: string; // "10:00"
  end: string; // "11:00"
};

export const businesses: Business[] = [
  { slug: "maya-chen-tutoring", name: "Maya Chen Tutoring", initials: "MC", category: "Tutoring", area: "Camden", description: "Maths & physics tutor, GCSE and A-level.", sessionMinutes: 60, timezoneLabel: "London time" },
  { slug: "fade-and-co", name: "Fade & Co. Barbers", initials: "FC", category: "Hair", area: "Shoreditch", description: "Skin fades, beard trims and hot towel shaves.", sessionMinutes: 30, timezoneLabel: "London time" },
  { slug: "nails-by-rosa", name: "Nails by Rosa", initials: "NR", category: "Nails", area: "Islington", description: "Gel manicures and nail art.", sessionMinutes: 45, timezoneLabel: "London time" },
  { slug: "core-studio-pilates", name: "Core Studio Pilates", initials: "CS", category: "Fitness", area: "Hackney", description: "One-to-one reformer Pilates.", sessionMinutes: 60, timezoneLabel: "London time" },
  { slug: "glow-skin-clinic", name: "Glow Skin Clinic", initials: "GS", category: "Beauty", area: "Soho", description: "Facials and skin consultations.", sessionMinutes: 45, timezoneLabel: "London time" },
  { slug: "ahmeds-barbershop", name: "Ahmed’s Barbershop", initials: "AB", category: "Hair", area: "Peckham", description: "Classic cuts, walk-in friendly.", sessionMinutes: 30, timezoneLabel: "London time" },
  { slug: "leo-park-guitar", name: "Leo Park Guitar Lessons", initials: "LP", category: "Tutoring", area: "Brixton", description: "Guitar lessons for beginners and improvers.", sessionMinutes: 60, timezoneLabel: "London time" },
];

// A fixed fake week, so the screens match the design. Real dates arrive in M2.
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const week: Day[] = WEEKDAYS.map((name, i) => {
  const n = 9 + i;
  return {
    date: `2026-11-${String(n).padStart(2, "0")}`,
    short: name.slice(0, 3).toUpperCase(),
    num: String(n),
    name,
    long: i === 0 ? `Today, ${name} ${n} November` : `${name} ${n} November`,
    compact: `${name.slice(0, 3)} ${n} Nov`,
    isToday: i === 0,
  };
});

// Open start times per weekday (Mon..Sun). Each business gets this pattern shifted
// by a few days so they don't all look the same.
const PATTERN: string[][] = [
  ["16:00", "17:00"],
  ["09:00", "10:00", "11:30", "14:00", "15:00", "16:30"],
  ["10:00", "13:00"],
  ["09:00", "10:00", "11:00", "15:00", "16:00"],
  ["14:00"],
  [],
  [],
];

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function getBusiness(slug: string) {
  return businesses.find((b) => b.slug === slug);
}

export function getDay(date: string) {
  return week.find((d) => d.date === date);
}

export function getSlots(business: Business, date: string): Slot[] {
  if (business.slug === "ahmeds-barbershop") return []; // a fully booked example
  const dayIndex = week.findIndex((d) => d.date === date);
  if (dayIndex === -1) return [];
  const shift = businesses.indexOf(business) % 3;
  const times = PATTERN[(dayIndex - shift + 7) % 7];
  return times.map((start) => ({
    id: `${date}-${start.replace(":", "")}`,
    date,
    start,
    end: addMinutes(start, business.sessionMinutes),
  }));
}

export function getSlot(business: Business, slotId: string) {
  const date = slotId.slice(0, 10);
  return getSlots(business, date).find((s) => s.id === slotId);
}

/** First open slot this week, or undefined if fully booked. */
export function getNextSlot(business: Business) {
  for (const day of week) {
    const slots = getSlots(business, day.date);
    if (slots.length) return { day, slot: slots[0] };
  }
  return undefined;
}

/** Short label for search results: "Today 16:00", "Tue 11:00" or null. */
export function nextAvailableLabel(business: Business) {
  const next = getNextSlot(business);
  if (!next) return null;
  const dayLabel = next.day.isToday ? "Today" : next.day.name.slice(0, 3);
  return `${dayLabel} ${next.slot.start}`;
}
