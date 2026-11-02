-- Shashka o‘yini uchun yulduzlarni yoqish.
-- Supabase → SQL Editor → New query → hammasini joylab bir marta “Run” bosing.
-- (games.sql va games-master.sql avval ishga tushirilgan bo‘lsa — shu faylning o‘zi yetarli.)

alter table public.game_stars drop constraint if exists game_stars_game_check;
alter table public.game_stars add constraint game_stars_game_check
  check (game in ('sirli-quti', 'poyga', 'bilmasvoy', 'master', 'shashka'));

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
  if p_game not in ('sirli-quti', 'poyga', 'bilmasvoy', 'shashka') then
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
