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
