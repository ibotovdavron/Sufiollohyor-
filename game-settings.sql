-- O'yin sozlamalari (masalan, “Ovchi” o'yiniga kirish testi har bir sinf uchun).
-- Ustoz profil sahifasidan o'zgartiradi; o'quvchilar faqat o'qiydi.
-- Supabase → SQL Editor → New query → hammasini joylab “Run” bosing. Qayta ishga tushirish xavfsiz.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.game_settings (
  key text primary key check (char_length(key) between 1 and 60),
  value jsonb not null default '{}'::jsonb,
  teacher text,
  updated_at timestamptz not null default now()
);

alter table public.game_settings enable row level security;
drop policy if exists game_settings_read on public.game_settings;
create policy game_settings_read on public.game_settings for select using (true);

create or replace function public.gs_set(p_pin text, p_teacher text, p_key text, p_value jsonb)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if encode(extensions.digest(coalesce(trim(p_pin), ''), 'sha256'), 'hex') not in (
       '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73', -- umumiy ustoz paroli
       '1136e4b62029095e629e1ca4d06643a5f325bc74e2702f5e2f9fa028048145de', -- Raufov Azizbek
       'c7478b47b806aeb84eb2b0b9f2424cd02ca923555152b172565786a4fdb1b235'  -- Shaymardonov Abdusattor
     ) then
    raise exception 'Parol noto‘g‘ri';
  end if;
  if p_value is null or length(p_value::text) > 20000 then raise exception 'Sozlama juda katta'; end if;
  insert into public.game_settings (key, value, teacher, updated_at)
  values (left(p_key, 60), p_value, left(coalesce(p_teacher, ''), 80), now())
  on conflict (key) do update set value = excluded.value, teacher = excluded.teacher, updated_at = now();
  return true;
end;
$$;

grant execute on function public.gs_set(text, text, text, jsonb) to anon, authenticated;
