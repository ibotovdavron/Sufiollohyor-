-- “So‘fi Ollohyor musobaqasi” — oflayn test (5, 6, 7-sinflar):
-- 15 matematika + 15 ona tili + 15 ingliz tili + 5 IQ = 50 ball.
-- Darajalar: A+ (45+), A (40+), B+ (35+), B (30+), C+ (25+), C. Yulduzlar: A+ 100, A 70, B+ 50.
-- Supabase → SQL Editor → New query → hammasini joylab “Run” bosing. Qayta ishga tushirish xavfsiz.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.sm_events (
  id bigserial primary key,
  title text not null default 'So‘fi Ollohyor musobaqasi',
  test_at timestamptz,
  place text,
  status text not null default 'reg' check (status in ('reg', 'test', 'done')),
  awarded boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.sm_players (
  event_id bigint not null references public.sm_events (id) on delete cascade,
  name text not null check (char_length(name) between 3 and 80),
  cls int not null check (cls between 5 and 7),
  guest boolean not null default false,
  math int check (math between 0 and 15),
  ona int check (ona between 0 and 15),
  eng int check (eng between 0 and 15),
  iq int check (iq between 0 and 5),
  total int,
  level text,
  stars int not null default 0,
  created_at timestamptz not null default now(),
  primary key (event_id, name)
);

alter table public.sm_events enable row level security;
alter table public.sm_players enable row level security;
drop policy if exists sm_events_read on public.sm_events;
create policy sm_events_read on public.sm_events for select using (true);
drop policy if exists sm_players_read on public.sm_players;
create policy sm_players_read on public.sm_players for select using (true);

create or replace function public.sm_pin_ok(p_pin text) returns boolean
language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(coalesce(trim(p_pin), ''), 'sha256'), 'hex') in (
    '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73',
    '1136e4b62029095e629e1ca4d06643a5f325bc74e2702f5e2f9fa028048145de',
    'c7478b47b806aeb84eb2b0b9f2424cd02ca923555152b172565786a4fdb1b235'
  );
$$;

create or replace function public.sm_level(t int) returns text
language sql immutable as $$
  select case when t is null then null when t >= 45 then 'A+' when t >= 40 then 'A' when t >= 35 then 'B+'
              when t >= 30 then 'B' when t >= 25 then 'C+' else 'C' end;
$$;

-- Yulduzlar teacher_stars jadvaliga yoziladi — 100 ⭐ sig'ishi uchun cheklovni kengaytiramiz
do $$ begin
  if to_regclass('public.teacher_stars') is not null then
    alter table public.teacher_stars drop constraint if exists teacher_stars_stars_check;
    alter table public.teacher_stars add constraint teacher_stars_stars_check check (stars between -500 and 500 and stars <> 0);
  end if;
end $$;

insert into public.sm_events (title) select 'So‘fi Ollohyor musobaqasi' where not exists (select 1 from public.sm_events);

-- ---------- Ro'yxatdan o'tish ----------
create or replace function public.sm_register(p_event bigint, p_name text, p_cls int, p_guest boolean) returns int
language plpgsql security definer set search_path = public as $$
declare e public.sm_events; n int; nm text := regexp_replace(trim(coalesce(p_name, '')), '\s+', ' ', 'g');
begin
  select * into e from public.sm_events where id = p_event for update;
  if not found then raise exception 'Musobaqa topilmadi'; end if;
  if e.status <> 'reg' then raise exception 'Ro‘yxatdan o‘tish yopilgan'; end if;
  if p_cls not between 5 and 7 then raise exception 'Faqat 5, 6, 7-sinf o‘quvchilari qatnashadi'; end if;
  if char_length(nm) < 5 or nm !~ ' ' then raise exception 'Ism va familiyani to‘liq kiriting'; end if;
  if exists (select 1 from public.sm_players where event_id = p_event and lower(name) = lower(nm)) then raise exception 'Bu ism bilan allaqachon yozilgan'; end if;
  insert into public.sm_players (event_id, name, cls, guest) values (p_event, left(nm, 80), p_cls, coalesce(p_guest, false));
  select count(*) into n from public.sm_players where event_id = p_event and cls = p_cls;
  return n;
end; $$;

create or replace function public.sm_unregister(p_event bigint, p_name text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if (select status from public.sm_events where id = p_event) <> 'reg' then raise exception 'Ro‘yxat yopilgan'; end if;
  delete from public.sm_players where event_id = p_event and name = p_name;
  return found;
end; $$;

-- ---------- Ustoz ----------
create or replace function public.sm_admin_info(p_pin text, p_event bigint, p_test_at timestamptz, p_place text, p_title text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  update public.sm_events set test_at = p_test_at, place = left(nullif(trim(p_place), ''), 120),
    title = coalesce(nullif(trim(p_title), ''), title) where id = p_event;
  return found;
end; $$;

-- Ro'yxatni yopish (test kuni) yoki qayta ochish
create or replace function public.sm_admin_status(p_pin text, p_event bigint, p_status text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  if p_status not in ('reg', 'test') then raise exception 'Noto‘g‘ri holat'; end if;
  if (select status from public.sm_events where id = p_event) = 'done' then raise exception 'Musobaqa yakunlangan'; end if;
  update public.sm_events set status = p_status where id = p_event;
  return found;
end; $$;

-- Oflayn test natijasini kiritish (bo'sh qoldirilsa — null)
create or replace function public.sm_admin_score(p_pin text, p_event bigint, p_name text, p_math int, p_ona int, p_eng int, p_iq int) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare t int;
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  if (select status from public.sm_events where id = p_event) = 'done' then raise exception 'Musobaqa yakunlangan — natijani o‘zgartirib bo‘lmaydi'; end if;
  if p_math not between 0 and 15 or p_ona not between 0 and 15 or p_eng not between 0 and 15 or p_iq not between 0 and 5 then
    raise exception 'Ball noto‘g‘ri: fanlar 0–15, IQ 0–5';
  end if;
  t := case when p_math is null or p_ona is null or p_eng is null or p_iq is null then null else p_math + p_ona + p_eng + p_iq end;
  update public.sm_players set math = p_math, ona = p_ona, eng = p_eng, iq = p_iq, total = t, level = public.sm_level(t)
    where event_id = p_event and name = p_name;
  if not found then raise exception 'Ishtirokchi topilmadi'; end if;
  return public.sm_level(t);
end; $$;

-- Yakunlash: natijalar e'lon qilinadi, A+ / A / B+ ga yulduzlar beriladi (bir marta)
create or replace function public.sm_admin_finish(p_pin text, p_event bigint) returns int
language plpgsql security definer set search_path = public, extensions as $$
declare e public.sm_events; r record; n int := 0; s int;
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  select * into e from public.sm_events where id = p_event for update;
  if e.awarded then raise exception 'Yulduzlar allaqachon berilgan'; end if;
  for r in select * from public.sm_players where event_id = p_event and level in ('A+', 'A', 'B+') loop
    s := case r.level when 'A+' then 100 when 'A' then 70 else 50 end;
    if to_regclass('public.teacher_stars') is not null then
      insert into public.teacher_stars (student_name, stars, reason, teacher)
        values (r.name, s, '🏅 So‘fi Ollohyor musobaqasi — ' || r.level || ' daraja', 'Musobaqa');
    end if;
    update public.sm_players set stars = s where event_id = p_event and name = r.name;
    n := n + 1;
  end loop;
  update public.sm_events set status = 'done', awarded = true where id = p_event;
  return n;
end; $$;

create or replace function public.sm_admin_remove(p_pin text, p_event bigint, p_name text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  if (select status from public.sm_events where id = p_event) = 'done' then raise exception 'Musobaqa yakunlangan'; end if;
  delete from public.sm_players where event_id = p_event and name = p_name;
  return found;
end; $$;

create or replace function public.sm_admin_new(p_pin text, p_title text) returns bigint
language plpgsql security definer set search_path = public, extensions as $$
declare v bigint;
begin
  if not public.sm_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  insert into public.sm_events (title) values (coalesce(nullif(trim(p_title), ''), 'So‘fi Ollohyor musobaqasi')) returning id into v;
  return v;
end; $$;

revoke all on function public.sm_pin_ok(text) from public, anon, authenticated;
grant execute on function public.sm_register(bigint, text, int, boolean) to anon, authenticated;
grant execute on function public.sm_unregister(bigint, text) to anon, authenticated;
grant execute on function public.sm_admin_info(text, bigint, timestamptz, text, text) to anon, authenticated;
grant execute on function public.sm_admin_status(text, bigint, text) to anon, authenticated;
grant execute on function public.sm_admin_score(text, bigint, text, int, int, int, int) to anon, authenticated;
grant execute on function public.sm_admin_finish(text, bigint) to anon, authenticated;
grant execute on function public.sm_admin_remove(text, bigint, text) to anon, authenticated;
grant execute on function public.sm_admin_new(text, text) to anon, authenticated;
