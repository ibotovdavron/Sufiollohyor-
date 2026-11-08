-- Shaxmat turniri (olimpiya tizimi, 32 o'rin): ro'yxatdan o'tish, setka, natijalar, yulduz mukofotlari.
-- Supabase → SQL Editor → New query → hammasini joylab “Run” bosing.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.tn_events (
  id bigserial primary key,
  title text not null default 'Shaxmat turniri',
  start_at timestamptz,
  size int not null default 32 check (size between 2 and 64),
  status text not null default 'reg' check (status in ('reg', 'live', 'done')),
  rounds int not null default 0,
  prizes int[] not null default '{150,100,50}',
  awarded boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.tn_players (
  event_id bigint not null references public.tn_events (id) on delete cascade,
  name text not null check (char_length(name) between 3 and 80),
  cls text,
  created_at timestamptz not null default now(),
  primary key (event_id, name)
);
-- round: 1..rounds (oxirgisi final); 3-o'rin uchun o'yin: round = 99
create table if not exists public.tn_matches (
  event_id bigint not null references public.tn_events (id) on delete cascade,
  round int not null,
  slot int not null,
  p1 text, p2 text, winner text,
  reason text,
  updated_at timestamptz not null default now(),
  primary key (event_id, round, slot)
);

alter table public.tn_events enable row level security;
alter table public.tn_players enable row level security;
alter table public.tn_matches enable row level security;
drop policy if exists tn_events_read on public.tn_events;
create policy tn_events_read on public.tn_events for select using (true);
drop policy if exists tn_players_read on public.tn_players;
create policy tn_players_read on public.tn_players for select using (true);
drop policy if exists tn_matches_read on public.tn_matches;
create policy tn_matches_read on public.tn_matches for select using (true);

create or replace function public.tn_pin_ok(p_pin text) returns boolean
language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(coalesce(trim(p_pin), ''), 'sha256'), 'hex') in (
    '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73',
    '1136e4b62029095e629e1ca4d06643a5f325bc74e2702f5e2f9fa028048145de'
  );
$$;

-- Turnir mukofotlari (150/100/50) teacher_stars jadvaliga yoziladi — cheklovni kengaytiramiz
do $$ begin
  if to_regclass('public.teacher_stars') is not null then
    alter table public.teacher_stars drop constraint if exists teacher_stars_stars_check;
    alter table public.teacher_stars add constraint teacher_stars_stars_check check (stars between -500 and 500 and stars <> 0);
  end if;
end $$;

-- Birinchi turnir avtomatik yaratiladi
insert into public.tn_events (title) select 'Shaxmat turniri' where not exists (select 1 from public.tn_events);

-- ---------- Ro'yxatdan o'tish ----------
create or replace function public.tn_register(p_event bigint, p_name text, p_cls text) returns int
language plpgsql security definer set search_path = public as $$
declare e public.tn_events; n int;
begin
  select * into e from public.tn_events where id = p_event for update;
  if not found then raise exception 'Turnir topilmadi'; end if;
  if e.status <> 'reg' then raise exception 'Ro‘yxatdan o‘tish yopilgan'; end if;
  if exists (select 1 from public.tn_players where event_id = p_event and name = p_name) then raise exception 'Siz allaqachon yozilgansiz'; end if;
  select count(*) into n from public.tn_players where event_id = p_event;
  if n >= e.size then raise exception 'Barcha % o‘rin band', e.size; end if;
  insert into public.tn_players (event_id, name, cls) values (p_event, left(trim(p_name), 80), left(coalesce(p_cls, ''), 40));
  return n + 1;
end; $$;

create or replace function public.tn_unregister(p_event bigint, p_name text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if (select status from public.tn_events where id = p_event) <> 'reg' then raise exception 'Turnir boshlangan'; end if;
  delete from public.tn_players where event_id = p_event and name = p_name;
  return found;
end; $$;

-- ---------- Ichki: g'olibni keyingi bosqichga o'tkazish ----------
create or replace function public.tn_advance(p_event bigint, p_round int, p_slot int) returns void
language plpgsql security definer set search_path = public as $$
declare e public.tn_events; m public.tn_matches; loser text; other public.tn_matches; t public.tn_matches;
  first_n text; second_n text; third_n text;
begin
  select * into e from public.tn_events where id = p_event;
  select * into m from public.tn_matches where event_id = p_event and round = p_round and slot = p_slot;
  if m.winner is null then return; end if;
  loser := case when m.winner = m.p1 then m.p2 else m.p1 end;
  if p_round < e.rounds then
    if p_slot % 2 = 0 then update public.tn_matches set p1 = m.winner, updated_at = now() where event_id = p_event and round = p_round + 1 and slot = p_slot / 2;
    else update public.tn_matches set p2 = m.winner, updated_at = now() where event_id = p_event and round = p_round + 1 and slot = p_slot / 2; end if;
    -- yarim final yutqazuvchisi 3-o'rin uchun o'ynaydi
    if p_round = e.rounds - 1 and e.rounds >= 2 then
      if p_slot % 2 = 0 then update public.tn_matches set p1 = loser, updated_at = now() where event_id = p_event and round = 99 and slot = 0;
      else update public.tn_matches set p2 = loser, updated_at = now() where event_id = p_event and round = 99 and slot = 0; end if;
      -- ikkala yarim final tugagan, lekin 3-o'rinda bitta o'yinchi bo'lsa (raqibi "bo'sh joy" edi) — u 3-o'rin
      select * into t from public.tn_matches where event_id = p_event and round = 99 and slot = 0;
      if t.winner is null and not exists (select 1 from public.tn_matches where event_id = p_event and round = e.rounds - 1 and winner is null)
         and ((t.p1 is null) <> (t.p2 is null)) then
        update public.tn_matches set winner = coalesce(t.p1, t.p2), reason = 'bye', updated_at = now() where event_id = p_event and round = 99 and slot = 0;
      end if;
    end if;
  end if;
  -- Turnir tugadimi? (final va 3-o'rin hal bo'lgan)
  if exists (select 1 from public.tn_matches where event_id = p_event and round = e.rounds and winner is not null)
     and not exists (select 1 from public.tn_matches where event_id = p_event and round = 99 and winner is null and (p1 is not null or p2 is not null)) then
    update public.tn_events set status = 'done' where id = p_event;
    if not e.awarded then
      select winner, case when winner = p1 then p2 else p1 end into first_n, second_n from public.tn_matches where event_id = p_event and round = e.rounds;
      select winner into third_n from public.tn_matches where event_id = p_event and round = 99;
      if first_n is not null then insert into public.teacher_stars (student_name, stars, reason, teacher) values (first_n, e.prizes[1], '♟ Shaxmat turniri — 1-o‘rin', 'Turnir'); end if;
      if second_n is not null then insert into public.teacher_stars (student_name, stars, reason, teacher) values (second_n, e.prizes[2], '♟ Shaxmat turniri — 2-o‘rin', 'Turnir'); end if;
      if third_n is not null then insert into public.teacher_stars (student_name, stars, reason, teacher) values (third_n, e.prizes[3], '♟ Shaxmat turniri — 3-o‘rin', 'Turnir'); end if;
      update public.tn_events set awarded = true where id = p_event;
    end if;
  end if;
end; $$;

-- ---------- O'yin natijasi (o'yinchilarning o'zi yuboradi) ----------
create or replace function public.tn_report(p_event bigint, p_round int, p_slot int, p_winner text, p_reporter text, p_reason text)
returns boolean
language plpgsql security definer set search_path = public as $$
declare m public.tn_matches;
begin
  select * into m from public.tn_matches where event_id = p_event and round = p_round and slot = p_slot for update;
  if not found then raise exception 'O‘yin topilmadi'; end if;
  if m.winner is not null then return false; end if;
  if m.p1 is null or m.p2 is null then raise exception 'Raqib hali aniqlanmagan'; end if;
  if p_winner not in (m.p1, m.p2) or p_reporter not in (m.p1, m.p2) then raise exception 'Noto‘g‘ri natija'; end if;
  update public.tn_matches set winner = p_winner, reason = left(coalesce(p_reason, ''), 40), updated_at = now()
    where event_id = p_event and round = p_round and slot = p_slot;
  perform public.tn_advance(p_event, p_round, p_slot);
  return true;
end; $$;

-- ---------- Ustoz: turnir sozlamalari ----------
create or replace function public.tn_admin_time(p_pin text, p_event bigint, p_start timestamptz, p_title text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.tn_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  update public.tn_events set start_at = p_start, title = coalesce(nullif(trim(p_title), ''), title) where id = p_event;
  return found;
end; $$;

create or replace function public.tn_admin_remove(p_pin text, p_event bigint, p_name text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.tn_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  delete from public.tn_players where event_id = p_event and name = p_name;
  return found;
end; $$;

-- Setkani tuzish va boshlash: o'yinchilar aralashtiriladi, bo'sh joylar ("bye") avtomatik o'tadi
create or replace function public.tn_admin_start(p_pin text, p_event bigint) returns int
language plpgsql security definer set search_path = public, extensions as $$
declare e public.tn_events; names text[]; n int; sz int := 2; r int := 1; byes int; i int; k int := 1; a text; b text;
begin
  if not public.tn_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  select * into e from public.tn_events where id = p_event for update;
  if e.status <> 'reg' then raise exception 'Turnir allaqachon boshlangan'; end if;
  select array_agg(name order by random()) into names from public.tn_players where event_id = p_event;
  n := coalesce(array_length(names, 1), 0);
  if n < 2 then raise exception 'Kamida 2 ta ishtirokchi kerak'; end if;
  while sz < n loop sz := sz * 2; r := r + 1; end loop;
  byes := sz - n;
  delete from public.tn_matches where event_id = p_event;
  -- 1-bosqich: avval "bo'sh joyli" juftliklar (har birida bitta o'yinchi), keyin to'liq juftliklar
  for i in 0 .. sz / 2 - 1 loop
    if i < byes then a := names[k]; b := null; k := k + 1;
    else a := names[k]; b := names[k + 1]; k := k + 2; end if;
    insert into public.tn_matches (event_id, round, slot, p1, p2) values (p_event, 1, i, a, b);
  end loop;
  for i in 2 .. r loop
    for k in 0 .. (sz / power(2, i))::int - 1 loop insert into public.tn_matches (event_id, round, slot) values (p_event, i, k); end loop;
  end loop;
  if r >= 2 then insert into public.tn_matches (event_id, round, slot) values (p_event, 99, 0); end if;
  update public.tn_events set status = 'live', rounds = r where id = p_event;
  -- bo'sh joylar: raqibsiz o'yinchi keyingi bosqichga o'tadi
  for i in 0 .. byes - 1 loop
    update public.tn_matches set winner = p1, reason = 'bye' where event_id = p_event and round = 1 and slot = i;
    perform public.tn_advance(p_event, 1, i);
  end loop;
  return n;
end; $$;

-- Bahsli holatda ustoz g'olibni belgilaydi
create or replace function public.tn_admin_winner(p_pin text, p_event bigint, p_round int, p_slot int, p_winner text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare m public.tn_matches;
begin
  if not public.tn_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  select * into m from public.tn_matches where event_id = p_event and round = p_round and slot = p_slot for update;
  if m.winner is not null then raise exception 'Bu o‘yin natijasi allaqachon bor'; end if;
  if p_winner not in (m.p1, m.p2) then raise exception 'Bu o‘yinchi bu juftlikda yo‘q'; end if;
  update public.tn_matches set winner = p_winner, reason = 'ustoz', updated_at = now() where event_id = p_event and round = p_round and slot = p_slot;
  perform public.tn_advance(p_event, p_round, p_slot);
  return true;
end; $$;

-- Yangi turnir (eskisi tarixda qoladi)
create or replace function public.tn_admin_new(p_pin text, p_title text) returns bigint
language plpgsql security definer set search_path = public, extensions as $$
declare v bigint;
begin
  if not public.tn_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  insert into public.tn_events (title) values (coalesce(nullif(trim(p_title), ''), 'Shaxmat turniri')) returning id into v;
  return v;
end; $$;

revoke all on function public.tn_pin_ok(text) from public, anon, authenticated;
revoke all on function public.tn_advance(bigint, int, int) from public, anon, authenticated;
grant execute on function public.tn_register(bigint, text, text) to anon, authenticated;
grant execute on function public.tn_unregister(bigint, text) to anon, authenticated;
grant execute on function public.tn_report(bigint, int, int, text, text, text) to anon, authenticated;
grant execute on function public.tn_admin_time(text, bigint, timestamptz, text) to anon, authenticated;
grant execute on function public.tn_admin_remove(text, bigint, text) to anon, authenticated;
grant execute on function public.tn_admin_start(text, bigint) to anon, authenticated;
grant execute on function public.tn_admin_winner(text, bigint, int, int, text) to anon, authenticated;
grant execute on function public.tn_admin_new(text, text) to anon, authenticated;
