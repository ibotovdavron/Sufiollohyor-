-- SHAXMAT: reyting (Elo) va o‘yinlar tarixi.
-- Supabase → SQL Editor oynasida bir marta ishga tushiring.

create table if not exists public.chess_ratings (
  name text primary key check (char_length(name) between 3 and 80),
  rating int not null default 1200,
  games int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  draws int not null default 0,
  best int not null default 1200,
  updated_at timestamptz not null default now()
);

create table if not exists public.chess_games (
  id text primary key check (char_length(id) between 4 and 60),
  white text not null,
  black text not null,
  result text not null check (result in ('1-0', '0-1', '1/2-1/2')),
  reason text not null default '',
  moves int not null default 0,
  pgn text not null default '',
  white_delta int not null default 0,
  black_delta int not null default 0,
  white_rating int not null default 1200,
  black_rating int not null default 1200,
  created_at timestamptz not null default now()
);

create index if not exists chess_games_white on public.chess_games (white, created_at desc);
create index if not exists chess_games_black on public.chess_games (black, created_at desc);

alter table public.chess_ratings enable row level security;
alter table public.chess_games enable row level security;

drop policy if exists chess_ratings_read on public.chess_ratings;
create policy chess_ratings_read on public.chess_ratings for select using (true);
drop policy if exists chess_games_read on public.chess_games;
create policy chess_games_read on public.chess_games for select using (true);

-- O‘yin natijasini yozish. Ikkala o‘yinchi ham chaqirishi mumkin —
-- bitta o‘yin (p_id) faqat bir marta hisoblanadi.
create or replace function public.chess_finish(
  p_id text,
  p_white text,
  p_black text,
  p_result text,
  p_reason text,
  p_moves int,
  p_pgn text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.chess_games%rowtype;
  w public.chess_ratings%rowtype;
  b public.chess_ratings%rowtype;
  v_exp float;
  v_sw float;
  v_kw int;
  v_kb int;
  v_dw int := 0;
  v_db int := 0;
begin
  if p_result not in ('1-0', '0-1', '1/2-1/2') then
    raise exception 'Noto‘g‘ri natija: %', p_result;
  end if;
  if p_white is null or p_black is null or p_white = p_black then
    raise exception 'O‘yinchilar noto‘g‘ri';
  end if;

  perform pg_advisory_xact_lock(hashtext('chess|' || p_id));

  select * into g from public.chess_games where id = p_id;
  if found then
    return json_build_object('white_delta', g.white_delta, 'black_delta', g.black_delta,
      'white_rating', g.white_rating, 'black_rating', g.black_rating, 'dup', true);
  end if;

  insert into public.chess_ratings (name) values (p_white) on conflict (name) do nothing;
  insert into public.chess_ratings (name) values (p_black) on conflict (name) do nothing;
  select * into w from public.chess_ratings where name = p_white for update;
  select * into b from public.chess_ratings where name = p_black for update;

  -- Kamida 2 ta yurish bo‘lmasa — o‘yin bekor, reyting o‘zgarmaydi.
  if coalesce(p_moves, 0) >= 2 then
    v_exp := 1.0 / (1.0 + power(10.0, (b.rating - w.rating) / 400.0));
    v_sw := case p_result when '1-0' then 1.0 when '0-1' then 0.0 else 0.5 end;
    v_kw := case when w.games < 20 then 40 else 24 end;
    v_kb := case when b.games < 20 then 40 else 24 end;
    v_dw := round(v_kw * (v_sw - v_exp));
    v_db := round(v_kb * ((1.0 - v_sw) - (1.0 - v_exp)));

    update public.chess_ratings set
      rating = greatest(100, rating + v_dw), games = games + 1,
      wins = wins + (p_result = '1-0')::int, losses = losses + (p_result = '0-1')::int,
      draws = draws + (p_result = '1/2-1/2')::int,
      best = greatest(best, rating + v_dw), updated_at = now()
    where name = p_white;
    update public.chess_ratings set
      rating = greatest(100, rating + v_db), games = games + 1,
      wins = wins + (p_result = '0-1')::int, losses = losses + (p_result = '1-0')::int,
      draws = draws + (p_result = '1/2-1/2')::int,
      best = greatest(best, rating + v_db), updated_at = now()
    where name = p_black;
  end if;

  insert into public.chess_games (id, white, black, result, reason, moves, pgn,
    white_delta, black_delta, white_rating, black_rating)
  values (p_id, p_white, p_black, p_result, left(coalesce(p_reason, ''), 60), coalesce(p_moves, 0),
    left(coalesce(p_pgn, ''), 8000), v_dw, v_db,
    greatest(100, w.rating + v_dw), greatest(100, b.rating + v_db));

  return json_build_object('white_delta', v_dw, 'black_delta', v_db,
    'white_rating', greatest(100, w.rating + v_dw), 'black_rating', greatest(100, b.rating + v_db), 'dup', false);
end;
$$;

revoke all on function public.chess_finish(text, text, text, text, text, int, text) from public;
grant execute on function public.chess_finish(text, text, text, text, text, int, text) to anon, authenticated;
