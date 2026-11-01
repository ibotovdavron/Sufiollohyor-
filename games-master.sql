-- “Matematika Master” marafoni uchun jadvallar va funksiyalar.
-- Supabase → SQL Editor oynasiga to‘liq nusxalab, bir marta “Run” bosing.
-- (games.sql avval ishga tushirilgan bo‘lishi kerak — game_stars jadvali kerak.)

create extension if not exists pgcrypto with schema extensions;

-- 1) Hozir ochiq mavzu (bitta qator)
create table if not exists public.master_state (
  id int primary key default 1 check (id = 1),
  topic text,
  opened_at timestamptz
);
insert into public.master_state (id, topic) values (1, null) on conflict (id) do nothing;

-- 2) O‘quvchilar natijalari (har bir mavzuda ko‘pi bilan 2 ta urinish)
create table if not exists public.master_results (
  id bigserial primary key,
  student_name text not null check (char_length(student_name) between 3 and 80),
  cls text,
  topic text not null,
  attempt int not null check (attempt in (1, 2)),
  correct int not null check (correct between 0 and 10),
  points int not null check (points between 0 and 1100),
  seconds int not null check (seconds between 0 and 600),
  created_at timestamptz not null default now(),
  unique (student_name, topic, attempt)
);
create index if not exists master_results_topic on public.master_results (topic);

-- 3) Har bir yopilgan mavzuning g‘olibi (1 ⭐ olgan)
create table if not exists public.master_winners (
  topic text primary key,
  student_name text not null,
  points int not null,
  awarded_at timestamptz not null default now()
);

alter table public.master_state enable row level security;
alter table public.master_results enable row level security;
alter table public.master_winners enable row level security;
drop policy if exists master_state_read on public.master_state;
create policy master_state_read on public.master_state for select using (true);
drop policy if exists master_results_read on public.master_results;
create policy master_results_read on public.master_results for select using (true);
drop policy if exists master_winners_read on public.master_winners;
create policy master_winners_read on public.master_winners for select using (true);

-- game_stars jadvaliga “master” o‘yinini ruxsat etish (g‘olib yulduzi shu yerga yoziladi)
alter table public.game_stars drop constraint if exists game_stars_game_check;
alter table public.game_stars add constraint game_stars_game_check
  check (game in ('sirli-quti', 'poyga', 'bilmasvoy', 'master'));

-- O‘quvchi natijasini saqlash: faqat ochiq mavzuga, ko‘pi bilan 2 marta.
-- Qaytaradi: urinish raqami (1 yoki 2), 0 — ruxsat yo‘q.
create or replace function public.master_submit(
  p_student text, p_cls text, p_topic text, p_correct int, p_points int, p_seconds int
) returns int
language plpgsql security definer set search_path = public as $$
declare
  v_open text;
  v_n int;
begin
  select topic into v_open from public.master_state where id = 1;
  if v_open is null or v_open <> p_topic then return 0; end if;
  perform pg_advisory_xact_lock(hashtext('master|' || p_student || '|' || p_topic));
  select count(*) into v_n from public.master_results where student_name = p_student and topic = p_topic;
  if v_n >= 2 then return 0; end if;
  insert into public.master_results (student_name, cls, topic, attempt, correct, points, seconds)
  values (p_student, p_cls, p_topic, v_n + 1, p_correct, least(greatest(p_points, 0), 1100), least(greatest(p_seconds, 0), 600));
  return v_n + 1;
end;
$$;

-- Ustoz yangi mavzuni ochadi (yoki p_topic = null bilan hammasini yopadi).
-- Oldingi mavzuning 1-o‘rin egasiga avtomatik 1 ⭐ beriladi.
-- Parol: o‘yinlardagi ustoz paroli (SHA-256 xeshi pastda).
create or replace function public.master_open(p_pin text, p_topic text)
returns json
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_prev text;
  v_name text;
  v_pts int;
begin
  if encode(extensions.digest(coalesce(p_pin, ''), 'sha256'), 'hex')
     <> '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73' then
    raise exception 'Parol noto‘g‘ri';
  end if;

  select topic into v_prev from public.master_state where id = 1 for update;

  if v_prev is not null and v_prev is distinct from p_topic
     and not exists (select 1 from public.master_winners where topic = v_prev) then
    select student_name, points into v_name, v_pts
    from public.master_results where topic = v_prev
    order by points desc, seconds asc, created_at asc
    limit 1;
    if v_name is not null then
      insert into public.master_winners (topic, student_name, points) values (v_prev, v_name, v_pts);
      insert into public.game_stars (student_name, game) values (v_name, 'master');
    end if;
  end if;

  update public.master_state set topic = p_topic, opened_at = now() where id = 1;

  return json_build_object('prev', v_prev, 'winner', v_name, 'points', v_pts);
end;
$$;

revoke all on function public.master_submit(text, text, text, int, int, int) from public;
revoke all on function public.master_open(text, text) from public;
grant execute on function public.master_submit(text, text, text, int, int, int) to anon, authenticated;
grant execute on function public.master_open(text, text) to anon, authenticated;
