-- =====================================================================
-- Slot: initial database (M2)
-- Tables: businesses, slots, bookings
-- Security: Row Level Security (RLS) on every table, explicit grants,
--           and one locked-down function (book_slot) for creating bookings.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================

set search_path = public, extensions;

-- Needed for the "no two times may overlap" rule on slots.
create extension if not exists btree_gist with schema extensions;

-- A private schema for helpers. The website's API can't see this schema.
create schema if not exists private;
revoke all on schema private from public;

create or replace function private.is_valid_timezone(tz text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from pg_catalog.pg_timezone_names where name = tz);
$$;

-- ---------------------------------------------------------------------
-- businesses: one row per business listed on Slot
-- ---------------------------------------------------------------------
create table public.businesses (
  id              uuid primary key default gen_random_uuid(),
  -- The owner's login account. Empty for the sample businesses until owner sign-up (M3).
  owner_id        uuid references auth.users (id) on delete set null,
  slug            text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  name            text not null check (char_length(btrim(name)) between 2 and 60),
  category        text not null check (category in ('Tutoring', 'Hair', 'Nails', 'Fitness', 'Beauty', 'Other')),
  country_code    text not null check (country_code ~ '^[A-Z]{2}$'),   -- e.g. GB, PK, AE
  city            text not null check (char_length(btrim(city)) between 1 and 60),
  area            text check (area is null or char_length(area) <= 60),
  description     text check (description is null or char_length(description) <= 160),
  timezone        text not null default 'Europe/London' check (private.is_valid_timezone(timezone)),
  session_minutes int  not null default 60 check (session_minutes between 15 and 240),
  is_listed       boolean not null default true,   -- false = hidden from search, still bookable by link
  created_at      timestamptz not null default now()
);

create index businesses_search_idx on public.businesses (country_code, city) where is_listed;

-- ---------------------------------------------------------------------
-- slots: the times a business offers
-- ---------------------------------------------------------------------
create table public.slots (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      text not null default 'open' check (status in ('open', 'booked')),
  created_at  timestamptz not null default now(),
  constraint slots_end_after_start check (ends_at > starts_at),
  constraint slots_max_length check (ends_at - starts_at <= interval '4 hours'),
  -- A business can't offer two times that overlap.
  constraint slots_no_overlap exclude using gist (
    business_id with =,
    tstzrange(starts_at, ends_at) with &&
  )
);

create index slots_business_time_idx on public.slots (business_id, starts_at);

-- ---------------------------------------------------------------------
-- bookings: customers' bookings (contains personal details: name, email, note)
-- ---------------------------------------------------------------------
create table public.bookings (
  id             uuid primary key default gen_random_uuid(),
  slot_id        uuid not null references public.slots (id) on delete cascade,
  business_id    uuid not null references public.businesses (id) on delete cascade,
  customer_name  text not null check (char_length(btrim(customer_name)) between 1 and 80),
  customer_email text not null check (
                   char_length(customer_email) <= 254
                   and customer_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  note           text check (note is null or char_length(note) <= 500),
  status         text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at     timestamptz not null default now(),
  cancelled_at   timestamptz
);

-- The database itself refuses a second confirmed booking for the same slot.
create unique index bookings_one_confirmed_per_slot on public.bookings (slot_id) where status = 'confirmed';
create index bookings_business_idx on public.bookings (business_id, status);

-- ---------------------------------------------------------------------
-- Row Level Security: ON for every table. With RLS on and no matching
-- policy, a role sees nothing at all.
-- ---------------------------------------------------------------------
alter table public.businesses enable row level security;
alter table public.slots      enable row level security;
alter table public.bookings   enable row level security;

-- ---------------------------------------------------------------------
-- Grants: what the website's roles may touch at all.
--   anon          = any visitor (the publishable key)
--   authenticated = a logged-in owner (used from M3)
-- "Automatically expose new tables" is off in this project, so nothing is
-- reachable unless granted here. Note: no grant on bookings at all.
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

-- Businesses: public profile columns only. owner_id is deliberately left out.
grant select (id, slug, name, category, country_code, city, area, description, timezone, session_minutes, is_listed)
  on public.businesses to anon, authenticated;

grant select (id, business_id, starts_at, ends_at, status)
  on public.slots to anon, authenticated;

-- ---------------------------------------------------------------------
-- Policies: which rows those roles may see.
-- ---------------------------------------------------------------------
-- A business profile is public information (it's a shop window). Unlisted
-- businesses are left out of search by the app, but stay reachable by their link.
create policy "Anyone can view business profiles"
  on public.businesses for select
  to anon, authenticated
  using (true);

-- Visitors only ever see times that are open and at least 1 hour away.
-- Booked and past times are invisible, so nobody can work out who booked when.
create policy "Anyone can view bookable slots"
  on public.slots for select
  to anon, authenticated
  using (status = 'open' and starts_at > now() + interval '1 hour');

-- bookings: no policies for visitors. Owners get theirs in M3.

-- ---------------------------------------------------------------------
-- book_slot(): the ONLY way a visitor can create a booking.
-- Runs with elevated rights (security definer) but does exactly one job:
--   1. checks the input,
--   2. marks the slot booked ONLY IF it is still open and >= 1 hour away,
--   3. saves the booking.
-- Steps 2 and 3 happen together. If two people confirm the same time at once,
-- the second one finds the slot already booked and gets 'slot_taken'.
-- ---------------------------------------------------------------------
create or replace function public.book_slot(
  p_slot_id uuid,
  p_name    text,
  p_email   text,
  p_note    text default null
)
returns table (booking_id uuid, slot_starts_at timestamptz, slot_ends_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slot       public.slots%rowtype;
  v_booking_id uuid;
begin
  p_name  := btrim(coalesce(p_name, ''));
  p_email := lower(btrim(coalesce(p_email, '')));
  p_note  := nullif(btrim(coalesce(p_note, '')), '');

  if char_length(p_name) not between 1 and 80 then
    raise exception 'invalid_name';
  end if;
  if char_length(p_email) > 254 or p_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$' then
    raise exception 'invalid_email';
  end if;
  if p_note is not null and char_length(p_note) > 500 then
    raise exception 'invalid_note';
  end if;

  update public.slots s
     set status = 'booked'
   where s.id = p_slot_id
     and s.status = 'open'
     and s.starts_at >= now() + interval '1 hour'
  returning s.* into v_slot;

  if not found then
    if exists (select 1 from public.slots s where s.id = p_slot_id and s.status = 'open') then
      raise exception 'slot_too_soon';
    elsif exists (select 1 from public.slots s where s.id = p_slot_id) then
      raise exception 'slot_taken';
    else
      raise exception 'slot_not_found';
    end if;
  end if;

  insert into public.bookings (slot_id, business_id, customer_name, customer_email, note)
  values (v_slot.id, v_slot.business_id, p_name, p_email, p_note)
  returning id into v_booking_id;

  return query select v_booking_id, v_slot.starts_at, v_slot.ends_at;
end;
$$;

revoke all on function public.book_slot(uuid, text, text, text) from public;
grant execute on function public.book_slot(uuid, text, text, text) to anon, authenticated;

comment on function public.book_slot(uuid, text, text, text) is
  'Books an open slot for a customer. The only way visitors can create bookings.';
