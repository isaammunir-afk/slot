# Slot

A simple booking website for a solo small business (tutor, barber, nail technician).
Customers book an available time slot in under 30 seconds; the owner manages slots
and sees bookings.

**Status:** Milestone 1 (project skeleton) in progress.

## Features (MVP)

Customers (no login):
- See the business name and available slots for the next 7 days
- Pick a slot, enter name, email and an optional note, confirm
- Booked slots disappear for everyone else (no double-booking)

Owner (login required):
- Email/password login
- Dashboard: add/remove slots, see upcoming bookings, cancel a booking
- Set the business time zone

## Booking rules
- Slots can't be booked less than 1 hour before they start
- When the owner cancels a booking, the slot reopens

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
- [ ] M1 — Skeleton, design system, static booking page, deployed
- [ ] M2 — Supabase tables + RLS, real slots, bookings saved
- [ ] M3 — Owner login + dashboard
- [ ] M4 — Polish: mobile, edge cases, double-booking, accessibility
- [ ] M5 — Security audit, README, case study

## Later (not in MVP)
- Payments
- Email notifications / reminders
- Multiple staff
- Multiple businesses
- Recurring availability
- Calendar sync (Google/Apple/Outlook)
