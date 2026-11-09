-- =====================================================================
-- Slot: SAMPLE data for development and demos (not real businesses).
-- Safe to run again at any time: it deletes and recreates only these
-- sample businesses, and always creates times for the next 7 days.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================

delete from public.businesses
where slug in ('maya-chen-tutoring', 'fade-and-co', 'nails-by-rosa', 'core-studio-pilates',
               'glow-skin-clinic', 'ahmeds-barbershop', 'leo-park-guitar', 'northern-quarter-fades',
               'ancoats-yoga', 'gulberg-glow-salon', 'ali-raza-maths', 'clifton-nail-bar',
               'marina-fitness-studio');

insert into public.businesses (slug, name, category, country_code, city, area, description, timezone, session_minutes) values
  ('maya-chen-tutoring',     'Maya Chen Tutoring',      'Tutoring', 'GB', 'London',     'Camden',           'Maths & physics tutor, GCSE and A-level.',      'Europe/London', 60),
  ('fade-and-co',            'Fade & Co. Barbers',      'Hair',     'GB', 'London',     'Shoreditch',       'Skin fades, beard trims and hot towel shaves.', 'Europe/London', 30),
  ('nails-by-rosa',          'Nails by Rosa',           'Nails',    'GB', 'London',     'Islington',        'Gel manicures and nail art.',                   'Europe/London', 45),
  ('core-studio-pilates',    'Core Studio Pilates',     'Fitness',  'GB', 'London',     'Hackney',          'One-to-one reformer Pilates.',                  'Europe/London', 60),
  ('glow-skin-clinic',       'Glow Skin Clinic',        'Beauty',   'GB', 'London',     'Soho',             'Facials and skin consultations.',               'Europe/London', 45),
  ('ahmeds-barbershop',      'Ahmed’s Barbershop',      'Hair',     'GB', 'London',     'Peckham',          'Classic cuts, walk-in friendly.',               'Europe/London', 30),
  ('leo-park-guitar',        'Leo Park Guitar Lessons', 'Tutoring', 'GB', 'London',     'Brixton',          'Guitar lessons for beginners and improvers.',   'Europe/London', 60),
  ('northern-quarter-fades', 'Northern Quarter Fades',  'Hair',     'GB', 'Manchester', 'Northern Quarter', 'Modern cuts and fades.',                        'Europe/London', 30),
  ('ancoats-yoga',           'Ancoats Yoga',            'Fitness',  'GB', 'Manchester', 'Ancoats',          'Private yoga sessions.',                        'Europe/London', 60),
  ('gulberg-glow-salon',     'Gulberg Glow Salon',      'Beauty',   'PK', 'Lahore',     'Gulberg',          'Facials, threading and bridal prep.',           'Asia/Karachi',  45),
  ('ali-raza-maths',         'Ali Raza Maths Tutor',    'Tutoring', 'PK', 'Lahore',     'DHA',              'O/A-level maths, one-to-one.',                  'Asia/Karachi',  60),
  ('clifton-nail-bar',       'Clifton Nail Bar',        'Nails',    'PK', 'Karachi',    'Clifton',          'Manicures, pedicures and nail art.',            'Asia/Karachi',  45),
  ('marina-fitness-studio',  'Marina Fitness Studio',   'Fitness',  'AE', 'Dubai',      'Dubai Marina',     'Personal training sessions.',                   'Asia/Dubai',    60);

-- Open times for the next 7 days, in each business's own time zone.
-- A simple pattern so businesses differ; Ahmed's Barbershop is left fully booked.
with biz as (
  select id, timezone, session_minutes, row_number() over (order by slug) as n
  from public.businesses
  where slug in ('maya-chen-tutoring', 'fade-and-co', 'nails-by-rosa', 'core-studio-pilates',
                 'glow-skin-clinic', 'leo-park-guitar', 'northern-quarter-fades', 'ancoats-yoga',
                 'gulberg-glow-salon', 'ali-raza-maths', 'clifton-nail-bar', 'marina-fitness-studio')
),
local_times as (
  select biz.id, biz.timezone, biz.session_minutes,
         ((now() at time zone biz.timezone)::date + d) + t as local_start
  from biz
  cross join generate_series(0, 6) as d
  cross join unnest(array['09:00', '10:00', '11:30', '14:00', '15:00', '16:30', '18:00']::time[]) as t
  where (d + biz.n) % 7 not in (5, 6)                          -- two days off a week
    and (extract(hour from t)::int + d + biz.n) % 3 <> 0      -- not every time every day
)
insert into public.slots (business_id, starts_at, ends_at)
select id,
       local_start at time zone timezone,
       (local_start at time zone timezone) + make_interval(mins => session_minutes)
from local_times
where (local_start at time zone timezone) > now() + interval '1 hour';

-- A few sample bookings for Maya, so there is private data for the security test to protect.
with picked as (
  select s.id, s.business_id, row_number() over (order by s.starts_at) as rn
  from public.slots s
  join public.businesses b on b.id = s.business_id
  where b.slug = 'maya-chen-tutoring'
  order by s.starts_at
  offset 1 limit 3
),
marked as (
  update public.slots s set status = 'booked'
  from picked p where s.id = p.id
  returning s.id, s.business_id, p.rn
)
insert into public.bookings (slot_id, business_id, customer_name, customer_email, note)
select m.id, m.business_id, x.name, x.email, x.note
from (select id, business_id, row_number() over (order by rn) as k from marked) m
join (values
  (1, 'Alex Morgan',   'alex@example.com',       'Mock exam prep, chapter 4 please.'),
  (2, 'Priya Shah',    'priya.shah@example.com', null),
  (3, 'Daniel Okafor', 'd.okafor@example.com',   'First session. GCSE physics.')
) as x(k, name, email, note) using (k);

-- Show a summary so you can see it worked.
select b.country_code, b.city, b.name,
       count(s.id) filter (where s.status = 'open')   as open_times,
       count(s.id) filter (where s.status = 'booked') as booked_times
from public.businesses b
left join public.slots s on s.business_id = b.id
group by b.country_code, b.city, b.name
order by b.country_code, b.city, b.name;
