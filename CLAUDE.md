# Slot

Booking site for a solo small business. Customers book a slot in under 30s
(no login); the owner logs in to manage slots and bookings.

@AGENTS.md

## Stack
- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4
- Supabase (Postgres + Auth) via @supabase/ssr; Zod for validation
- Hosted on Vercel; code on GitHub. Testing happens on Vercel preview links.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build; must pass before every commit
- `npm run lint` / `npm run typecheck` — ESLint / `tsc --noEmit`

## Structure
- `src/app/` routes: public `/`, `/book/[slotId]`, `/book/confirmed`; owner `/login`, `/dashboard`
- `src/components/ui/` design-system primitives; `src/components/<feature>/` feature parts
- `src/lib/` helpers (dates, validation, supabase clients)
- `supabase/migrations/` every schema + RLS change as SQL, committed

## Conventions
- Server Components by default; "use client" only where interactivity needs it
- Mutations via Server Actions; validate every input with Zod on the server
- Store times as UTC `timestamptz`; display in the business timezone (owner-set)
- Design: black/white professional theme, one accent; use tokens, never raw hex
- Mobile-first (style ~375px first); tap targets >= 48px; inputs >= 16px font
- Every data view has loading, empty and error states
- Accessible: semantic HTML, a label on every input, visible focus, AA contrast
- Small commits, messages like `feat: ...`, `fix: ...`, `chore: ...`

## Security rules (non-negotiable)
- RLS enabled on every table, with explicit policies
- Public may only: read open future slots, and book via the `book_slot()` function
- Public may never read bookings or any customer personal data
- Only the authenticated owner manages slots and reads/cancels bookings
- Supabase sign-ups disabled; the owner is the only user
- Browser may only see `NEXT_PUBLIC_SUPABASE_URL` + the publishable/anon key
- The secret/service-role key never goes in client code, a `NEXT_PUBLIC_` var, or git
- `.env*.local` is git-ignored; list variable names in `.env.example`
- Never trust the client: validate on the server, enforce rules in the DB too

## How we work
- The user is a beginner: explain the approach before implementing
- Milestones M1–M5; propose a plan and wait for approval before coding
- Small steps; after each, explain what changed, new concepts, and how to test it
- Say when to commit and suggest the message
- Out-of-scope ideas go to the README "Later" list, not into code
