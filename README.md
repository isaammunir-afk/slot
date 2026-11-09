# Slot

A booking marketplace for solo small businesses (tutors, barbers, nail technicians,
trainers). Customers search for a business and book an open time in under 30 seconds,
no account needed. Each business owner signs up, sets up their page and manages
their times and bookings.

**Status:** Milestone 1 (skeleton + static screens) in progress.

## Features (MVP)

Customers (no login):
- Welcome screen, then search businesses by name, service or area, with category filters
- Business page: who they are, the next free time
- Book in 4 steps: day → time → name/email/note → review & confirm
- Booked times disappear for everyone else (no double-booking)

Business owners (login required):
- Sign up with email and password (email confirmation), then set up a business page:
  name, category, area, description, time zone
- Home: today's bookings, next customer, weekly numbers
- Bookings: upcoming and cancelled, booking detail, cancel a booking
- Times: add and remove open times per day
- Settings: edit the business profile, show or hide it in search, copy the booking link

## Booking rules
- A time can't be booked less than 1 hour before it starts
- When an owner cancels a booking, the time reopens
- Owners only ever see their own business's times and bookings

## Tech stack
Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Vercel

## Running locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Copy `.env.example` to `.env.local` and fill it in
(needed from Milestone 2).

## Roadmap
- [ ] M1: Skeleton, design system, all screens as static pages with fake data, deployed
- [ ] M2: Supabase tables (businesses, slots, bookings) + RLS, search, real booking
- [ ] M3: Owner sign-up, onboarding, login and dashboard
- [ ] M4: Polish: mobile, edge cases, double-booking, accessibility
- [ ] M5: Security audit, README, case study

## Later (not in MVP)
- Payments
- Email notifications and reminders
- Customer accounts and "my bookings"
- Reviews and ratings
- Maps and distance-based search
- Business photos
- Verifying businesses and moderating spam sign-ups
- Multiple staff per business
- Recurring availability
- Calendar sync (Google/Apple/Outlook)
