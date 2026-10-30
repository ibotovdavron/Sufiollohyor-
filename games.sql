-- O‘yinlar uchun yulduzlar jadvali.
-- Supabase → SQL Editor oynasida bir marta ishga tushiring.

create table if not exists public.game_stars (
  id bigserial primary key,
  student_name text not null check (char_length(student_name) between 3 and 80),
  game text not null check (game in ('sirli-quti', 'poyga', 'bilmasvoy')),
  stars int not null default 1 check (stars = 1),
  day date not null default (now() at time zone 'Asia/Tashkent')::date,
  created_at timestamptz not null default now()
);

create index if not exists game_stars_lookup
  on public.game_stars (student_name, game, day);

alter table public.game_stars enable row level security;

-- Hamma reytingni ko‘ra oladi, lekin to‘g‘ridan-to‘g‘ri yoza olmaydi.
drop policy if exists game_stars_read on public.game_stars;
create policy game_stars_read on public.game_stars
  for select using (true);

-- Yulduz faqat shu funksiya orqali qo‘shiladi:
-- bitta o‘quvchi bitta o‘yindan kuniga ko‘pi bilan 2 ta yulduz oladi.
create or replace function public.add_game_star(
  p_student text,
  p_game text,
  p_stars int default 1
)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (now() at time zone 'Asia/Tashkent')::date;
  v_count int;
begin
  if p_game not in ('sirli-quti', 'poyga', 'bilmasvoy') then
    raise exception 'Noma’lum o‘yin: %', p_game;
  end if;

  if coalesce(p_stars, 0) < 1 then
    return 0;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_student || '|' || p_game));

  select count(*) into v_count
  from public.game_stars
  where student_name = p_student and game = p_game and day = v_day;

  if v_count >= 2 then
    return 0;
  end if;

  insert into public.game_stars (student_name, game, day)
  values (p_student, p_game, v_day);

  return 1;
end;
$$;

revoke all on function public.add_game_star(text, text, int) from public;
grant execute on function public.add_game_star(text, text, int) to anon, authenticated;
