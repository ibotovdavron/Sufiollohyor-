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
