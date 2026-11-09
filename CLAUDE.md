# Slot

Booking marketplace for solo small businesses. Customers search for a business and
book a time in under 30s (no login). Owners sign up, set up a page, manage times/bookings.

@AGENTS.md

## Stack
- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4
- Supabase (Postgres + Auth) via @supabase/ssr; Zod for validation
- Hosted on Vercel; code on GitHub. Testing happens on Vercel preview links.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build; must pass before every commit
- `npm run lint` / `npm run typecheck` — ESLint / typegen + `tsc --noEmit`

## Structure
- Customer routes: `/` welcome, `/search`, `/b/[slug]`, `/b/[slug]/book/...`
- Owner routes: `/login`, `/signup`, `/onboarding`, `/dashboard/...`
- `src/components/ui/` design-system primitives; `src/components/<feature>/` feature parts
- `src/lib/` helpers (dates, validation, supabase clients)
- `supabase/migrations/` every schema + RLS change as SQL, committed

## Conventions
- Server Components by default; "use client" only where interactivity needs it
- Mutations via Server Actions; validate every input with Zod on the server
- Store times as UTC `timestamptz`; display in the business's own time zone
- Design: black/white, one accent; wordmark logo "Slot." (accent full stop);
  white cards on #F5F5F5; one job per screen; use tokens, never raw hex
- Mobile-first (style ~375px first); tap targets >= 44px; inputs >= 16px font
- Every data view has loading, empty and error states
- Accessible: semantic HTML, a label on every input, visible focus, AA contrast
- Small commits, messages like `feat: ...`, `fix: ...`, `chore: ...`

## Security rules (non-negotiable)
- RLS enabled on every table, with explicit policies
- Public may only: search listed businesses, read open future slots, book via `book_slot()`
- Public may never read bookings or any customer personal data
- An owner may only manage the slots and bookings of businesses they own
  (every owner policy checks `businesses.owner_id = auth.uid()`)
- Owner sign-up requires email confirmation; customers have no accounts
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
