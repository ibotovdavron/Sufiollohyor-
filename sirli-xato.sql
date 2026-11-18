-- Sirli xato yulduzlari (Amaliy darslar) → markaz reytingi
-- Supabase → SQL Editor → shu faylni to'liq qo'yib "Run" bosing. Qayta ishga tushirish xavfsiz.

create table if not exists public.sirli_stars (
  id bigserial primary key,
  student_name text not null,
  topic text not null,
  stars integer not null check (stars between -1 and 3),
  day date not null default ((now() at time zone 'Asia/Tashkent')::date),
  created_at timestamptz not null default now(),
  unique (student_name, topic)
);
alter table public.sirli_stars enable row level security;
drop policy if exists sirli_stars_read on public.sirli_stars;
create policy sirli_stars_read on public.sirli_stars for select using (true);
grant select on public.sirli_stars to anon, authenticated;

-- Har bir o'quvchining jami sirli xato yulduzlari (reyting shundan o'qiydi)
create or replace view public.sirli_totals with (security_invoker = on) as
  select student_name, sum(stars)::int as stars from public.sirli_stars group by student_name;
grant select on public.sirli_totals to anon, authenticated;

-- Yulduz yozish: bitta mavzu uchun bir marta, −1..+3, kuniga ko'pi bilan +30
create or replace function public.sirli_submit(p_student text, p_topic text, p_stars integer)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_day date := (now() at time zone 'Asia/Tashkent')::date;
  v_today int;
  v_s int := greatest(-1, least(3, coalesce(p_stars, 0)));
begin
  if p_student is null or length(trim(p_student)) < 2 or length(p_student) > 80 then return 0; end if;
  if p_topic is null or length(p_topic) > 160 or p_topic !~ '^\d{1,2}/[a-z0-9-]+/[a-z0-9.-]+$' then return 0; end if;
  if v_s = 0 then return 0; end if;
  perform pg_advisory_xact_lock(hashtext('sirli|' || p_student));
  if v_s > 0 then
    select coalesce(sum(stars), 0) into v_today from public.sirli_stars where student_name = p_student and day = v_day and stars > 0;
    if v_today >= 30 then return 0; end if;
    v_s := least(v_s, 30 - v_today);
  end if;
  insert into public.sirli_stars (student_name, topic, stars, day) values (p_student, p_topic, v_s, v_day)
    on conflict (student_name, topic) do nothing;
  if not found then return 0; end if;
  return v_s;
end;
$$;
revoke all on function public.sirli_submit(text, text, integer) from public;
grant execute on function public.sirli_submit(text, text, integer) to anon, authenticated;
