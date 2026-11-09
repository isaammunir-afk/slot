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
  /** Next free time as shown to customers, or null when fully booked this week. */
  nextAvailable: string | null;
};

export const businesses: Business[] = [
  { slug: "maya-chen-tutoring", name: "Maya Chen Tutoring", initials: "MC", category: "Tutoring", area: "Camden", description: "Maths & physics tutor, GCSE and A-level.", nextAvailable: "Today 16:00" },
  { slug: "fade-and-co", name: "Fade & Co. Barbers", initials: "FC", category: "Hair", area: "Shoreditch", description: "Skin fades, beard trims and hot towel shaves.", nextAvailable: "Today 15:30" },
  { slug: "nails-by-rosa", name: "Nails by Rosa", initials: "NR", category: "Nails", area: "Islington", description: "Gel manicures and nail art.", nextAvailable: "Tue 11:00" },
  { slug: "core-studio-pilates", name: "Core Studio Pilates", initials: "CS", category: "Fitness", area: "Hackney", description: "One-to-one reformer Pilates.", nextAvailable: "Today 18:00" },
  { slug: "glow-skin-clinic", name: "Glow Skin Clinic", initials: "GS", category: "Beauty", area: "Soho", description: "Facials and skin consultations.", nextAvailable: "Wed 10:00" },
  { slug: "ahmeds-barbershop", name: "Ahmed’s Barbershop", initials: "AB", category: "Hair", area: "Peckham", description: "Classic cuts, walk-in friendly.", nextAvailable: null },
  { slug: "leo-park-guitar", name: "Leo Park Guitar Lessons", initials: "LP", category: "Tutoring", area: "Brixton", description: "Guitar lessons for beginners and improvers.", nextAvailable: "Thu 17:00" },
];
