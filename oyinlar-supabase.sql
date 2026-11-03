-- So‘fi Ollohyor: o‘yinlar uchun jadvallar (shaxmat, shashka, ferma, arxitektor).
-- Supabase → SQL Editor → New query → hammasini joylab → Run. Qayta ishga tushirsa ham zarari yo‘q.

-- ================= chess.sql =================
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

-- ================= shashka.sql =================
-- SHASHKA: reyting (Elo) va o‘yinlar tarixi.
-- Supabase → SQL Editor oynasida bir marta ishga tushiring.

create table if not exists public.checkers_ratings (
  name text primary key check (char_length(name) between 3 and 80),
  rating int not null default 1200,
  games int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  draws int not null default 0,
  best int not null default 1200,
  updated_at timestamptz not null default now()
);

create table if not exists public.checkers_games (
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

create index if not exists checkers_games_white on public.checkers_games (white, created_at desc);
create index if not exists checkers_games_black on public.checkers_games (black, created_at desc);

alter table public.checkers_ratings enable row level security;
alter table public.checkers_games enable row level security;

drop policy if exists checkers_ratings_read on public.checkers_ratings;
create policy checkers_ratings_read on public.checkers_ratings for select using (true);
drop policy if exists checkers_games_read on public.checkers_games;
create policy checkers_games_read on public.checkers_games for select using (true);

-- O‘yin natijasini yozish. Ikkala o‘yinchi ham chaqirishi mumkin —
-- bitta o‘yin (p_id) faqat bir marta hisoblanadi.
create or replace function public.checkers_finish(
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
  g public.checkers_games%rowtype;
  w public.checkers_ratings%rowtype;
  b public.checkers_ratings%rowtype;
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

  perform pg_advisory_xact_lock(hashtext('checkers|' || p_id));

  select * into g from public.checkers_games where id = p_id;
  if found then
    return json_build_object('white_delta', g.white_delta, 'black_delta', g.black_delta,
      'white_rating', g.white_rating, 'black_rating', g.black_rating, 'dup', true);
  end if;

  insert into public.checkers_ratings (name) values (p_white) on conflict (name) do nothing;
  insert into public.checkers_ratings (name) values (p_black) on conflict (name) do nothing;
  select * into w from public.checkers_ratings where name = p_white for update;
  select * into b from public.checkers_ratings where name = p_black for update;

  -- Kamida 2 ta yurish bo‘lmasa — o‘yin bekor, reyting o‘zgarmaydi.
  if coalesce(p_moves, 0) >= 2 then
    v_exp := 1.0 / (1.0 + power(10.0, (b.rating - w.rating) / 400.0));
    v_sw := case p_result when '1-0' then 1.0 when '0-1' then 0.0 else 0.5 end;
    v_kw := case when w.games < 20 then 40 else 24 end;
    v_kb := case when b.games < 20 then 40 else 24 end;
    v_dw := round(v_kw * (v_sw - v_exp));
    v_db := round(v_kb * ((1.0 - v_sw) - (1.0 - v_exp)));

    update public.checkers_ratings set
      rating = greatest(100, rating + v_dw), games = games + 1,
      wins = wins + (p_result = '1-0')::int, losses = losses + (p_result = '0-1')::int,
      draws = draws + (p_result = '1/2-1/2')::int,
      best = greatest(best, rating + v_dw), updated_at = now()
    where name = p_white;
    update public.checkers_ratings set
      rating = greatest(100, rating + v_db), games = games + 1,
      wins = wins + (p_result = '0-1')::int, losses = losses + (p_result = '1-0')::int,
      draws = draws + (p_result = '1/2-1/2')::int,
      best = greatest(best, rating + v_db), updated_at = now()
    where name = p_black;
  end if;

  insert into public.checkers_games (id, white, black, result, reason, moves, pgn,
    white_delta, black_delta, white_rating, black_rating)
  values (p_id, p_white, p_black, p_result, left(coalesce(p_reason, ''), 60), coalesce(p_moves, 0),
    left(coalesce(p_pgn, ''), 8000), v_dw, v_db,
    greatest(100, w.rating + v_dw), greatest(100, b.rating + v_db));

  return json_build_object('white_delta', v_dw, 'black_delta', v_db,
    'white_rating', greatest(100, w.rating + v_dw), 'black_rating', greatest(100, b.rating + v_db), 'dup', false);
end;
$$;

revoke all on function public.checkers_finish(text, text, text, text, text, int, text) from public;
grant execute on function public.checkers_finish(text, text, text, text, text, int, text) to anon, authenticated;

-- ================= ferma.sql =================
-- FERMA: har bir o‘quvchining fermasi (pul, hayvonlar, mahsulotlar).
-- Boshqalar fermasini ko‘rish (mehmonga borish) va reyting uchun.
-- Supabase → SQL Editor oynasida bir marta ishga tushiring.

create table if not exists public.farms (
  name text primary key check (char_length(name) between 3 and 80),
  cls text not null default '',
  state jsonb not null default '{}'::jsonb,
  value int not null default 0,
  animals int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists farms_value on public.farms (value desc);

alter table public.farms enable row level security;

drop policy if exists farms_read on public.farms;
create policy farms_read on public.farms for select using (true);

-- Fermani saqlash (faqat shu funksiya orqali yoziladi).
create or replace function public.farm_save(
  p_name text,
  p_cls text,
  p_state jsonb,
  p_value int,
  p_animals int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_name is null or char_length(p_name) < 3 or char_length(p_name) > 80 then
    raise exception 'name';
  end if;
  if p_name like 'Mehmon %' then
    return false; -- mehmonlar faqat o‘z qurilmasida o‘ynaydi
  end if;
  if pg_column_size(p_state) > 60000 then
    raise exception 'state too big';
  end if;
  insert into public.farms (name, cls, state, value, animals, updated_at)
  values (p_name, coalesce(left(p_cls, 30), ''), p_state,
          greatest(0, least(coalesce(p_value, 0), 100000000)),
          greatest(0, least(coalesce(p_animals, 0), 200)), now())
  on conflict (name) do update
    set cls = excluded.cls, state = excluded.state, value = excluded.value,
        animals = excluded.animals, updated_at = now();
  return true;
end;
$$;

grant execute on function public.farm_save(text, text, jsonb, int, int) to anon, authenticated;

-- ================= arxitektor.sql =================
-- ARXITEKTOR 3D: o‘quvchilar qurgan uylar va “yoqdi” (👍) belgilari.
-- Supabase → SQL Editor oynasida bir marta ishga tushiring.

create table if not exists public.arch_builds (
  name text primary key check (char_length(name) between 3 and 80),
  cls text not null default '',
  title text not null default '',
  state jsonb not null default '{}'::jsonb,
  pieces int not null default 0,
  likes int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists arch_builds_likes on public.arch_builds (likes desc, pieces desc);

create table if not exists public.arch_likes (
  owner text not null,
  liker text not null,
  created_at timestamptz not null default now(),
  primary key (owner, liker)
);

alter table public.arch_builds enable row level security;
alter table public.arch_likes enable row level security;
drop policy if exists arch_builds_read on public.arch_builds;
create policy arch_builds_read on public.arch_builds for select using (true);
drop policy if exists arch_likes_read on public.arch_likes;
create policy arch_likes_read on public.arch_likes for select using (true);

-- Uyni saqlash (faqat shu funksiya orqali yoziladi)
create or replace function public.arch_save(p_name text, p_cls text, p_state jsonb, p_pieces int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_name is null or char_length(p_name) < 3 or char_length(p_name) > 80 then raise exception 'name'; end if;
  if p_name like 'Mehmon %' then return false; end if;
  if pg_column_size(p_state) > 200000 then raise exception 'state too big'; end if;
  insert into public.arch_builds (name, cls, title, state, pieces, updated_at)
  values (p_name, coalesce(left(p_cls, 30), ''), left(coalesce(p_state->>'title', ''), 40), p_state,
          greatest(0, least(coalesce(p_pieces, 0), 1000)), now())
  on conflict (name) do update
    set cls = excluded.cls, title = excluded.title, state = excluded.state, pieces = excluded.pieces, updated_at = now();
  return true;
end;
$$;

-- “Yoqdi”: har kim bitta uyga bir marta; o‘z uyiga bosib bo‘lmaydi. Natija — yangi son.
create or replace function public.arch_like(p_owner text, p_liker text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare n int;
begin
  if p_owner is null or p_liker is null or p_owner = p_liker or p_liker like 'Mehmon %' then
    select likes into n from public.arch_builds where name = p_owner;
    return coalesce(n, 0);
  end if;
  insert into public.arch_likes (owner, liker) values (p_owner, left(p_liker, 80)) on conflict do nothing;
  update public.arch_builds set likes = (select count(*) from public.arch_likes where owner = p_owner) where name = p_owner
  returning likes into n;
  return coalesce(n, 0);
end;
$$;

grant execute on function public.arch_save(text, text, jsonb, int) to anon, authenticated;
grant execute on function public.arch_like(text, text) to anon, authenticated;
