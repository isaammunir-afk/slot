-- =====================================================================
-- Slot: security self-test (run any time; it cleans up after itself)
-- Pretends to be an anonymous website visitor (the 'anon' role, which is
-- what the publishable key uses) and tries things a visitor must NOT be
-- able to do. Every row should say PASS.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================

create or replace function pg_temp.slot_security_check()
returns table (check_name text, result text)
language plpgsql
as $$
declare
  n          int;
  v_slot     uuid;
  v_booking  uuid;
begin
  -- From here on, act as an anonymous visitor.
  perform set_config('role', 'anon', true);

  check_name := '01 Visitor cannot read bookings (customer names/emails)';
  begin
    select count(*) into n from public.bookings;
    result := 'FAIL: could read ' || n || ' bookings';
  exception when insufficient_privilege then result := 'PASS';
  end;
  return next;

  check_name := '02 Visitor cannot insert a booking directly';
  begin
    insert into public.bookings (slot_id, business_id, customer_name, customer_email)
    select s.id, s.business_id, 'Hacker', 'h@example.com' from public.slots s limit 1;
    result := 'FAIL: direct insert worked';
  exception when insufficient_privilege then result := 'PASS';
  end;
  return next;

  check_name := '03 Visitor can see business profiles';
  select count(*) into n from public.businesses;
  result := case when n > 0 then 'PASS (' || n || ' businesses)' else 'FAIL: none visible (did you run seed.sql?)' end;
  return next;

  check_name := '04 Visitor cannot see which account owns a business';
  begin
    select count(owner_id) into n from public.businesses;
    result := 'FAIL: owner_id is readable';
  exception when insufficient_privilege then result := 'PASS';
  end;
  return next;

  check_name := '05 Visitor cannot see booked times';
  select count(*) into n from public.slots where status = 'booked';
  result := case when n = 0 then 'PASS' else 'FAIL: saw ' || n || ' booked times' end;
  return next;

  check_name := '06 Visitor cannot see past or too-soon times';
  select count(*) into n from public.slots where starts_at <= now() + interval '1 hour';
  result := case when n = 0 then 'PASS' else 'FAIL: saw ' || n end;
  return next;

  check_name := '07 Visitor cannot change a time (e.g. reopen a booked one)';
  begin
    update public.slots set status = 'open';
    result := 'FAIL: update worked';
  exception when insufficient_privilege then result := 'PASS';
  end;
  return next;

  check_name := '08 Visitor CAN book an open time with book_slot()';
  select s.id into v_slot from public.slots s order by s.starts_at limit 1;
  begin
    select b.booking_id into v_booking from public.book_slot(v_slot, 'Test Customer', 'test@example.com', null) b;
    result := case when v_booking is not null then 'PASS' else 'FAIL: no booking returned' end;
  exception when others then result := 'FAIL: ' || sqlerrm;
  end;
  return next;

  check_name := '09 The same time cannot be booked twice';
  begin
    perform public.book_slot(v_slot, 'Second Person', 'second@example.com', null);
    result := 'FAIL: double booking was allowed';
  exception when others then
    result := case when sqlerrm = 'slot_taken' then 'PASS' else 'FAIL: unexpected error ' || sqlerrm end;
  end;
  return next;

  check_name := '10 book_slot() rejects a bad email';
  select s.id into v_slot from public.slots s order by s.starts_at offset 1 limit 1;
  begin
    perform public.book_slot(v_slot, 'Someone', 'not-an-email', null);
    result := 'FAIL: bad email accepted';
  exception when others then
    result := case when sqlerrm = 'invalid_email' then 'PASS' else 'FAIL: unexpected error ' || sqlerrm end;
  end;
  return next;

  -- Back to the admin role, and remove the test booking from check 08.
  perform set_config('role', 'none', true);
  if v_booking is not null then
    update public.slots s set status = 'open'
    from public.bookings bk where bk.id = v_booking and s.id = bk.slot_id;
    delete from public.bookings where id = v_booking;
  end if;
end;
$$;

select * from pg_temp.slot_security_check();
