-- Ustozlar o‘quvchilarga yulduz qo‘shishi uchun jadval va funksiya.
-- Supabase → SQL Editor → New query → hammasini joylab “Run” bosing.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.teacher_stars (
  id bigserial primary key,
  student_name text not null check (char_length(student_name) between 3 and 80),
  stars int not null check (stars between -20 and 20 and stars <> 0),
  reason text,
  teacher text,
  created_at timestamptz not null default now()
);
create index if not exists teacher_stars_student on public.teacher_stars (student_name);

alter table public.teacher_stars enable row level security;
drop policy if exists teacher_stars_read on public.teacher_stars;
create policy teacher_stars_read on public.teacher_stars for select using (true);

-- Faqat ustoz paroli bilan yoziladi. Qaytaradi: nechta o‘quvchiga yozildi.
create or replace function public.teacher_add_stars(
  p_pin text, p_teacher text, p_students text[], p_stars int, p_reason text
) returns int
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_n int := 0;
  v_s text;
begin
  if encode(extensions.digest(coalesce(p_pin, ''), 'sha256'), 'hex') not in (
       '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73', -- umumiy ustoz paroli
       '1136e4b62029095e629e1ca4d06643a5f325bc74e2702f5e2f9fa028048145de'  -- Raufov Azizbek
     ) then
    raise exception 'Parol noto‘g‘ri';
  end if;
  if p_stars is null or p_stars = 0 or p_stars < -20 or p_stars > 20 then
    raise exception 'Yulduz soni −20 dan 20 gacha bo‘lishi kerak';
  end if;
  foreach v_s in array coalesce(p_students, '{}') loop
    insert into public.teacher_stars (student_name, stars, reason, teacher)
    values (v_s, p_stars, left(coalesce(p_reason, ''), 120), left(coalesce(p_teacher, ''), 80));
    v_n := v_n + 1;
  end loop;
  return v_n;
end;
$$;

revoke all on function public.teacher_add_stars(text, text, text[], int, text) from public;
grant execute on function public.teacher_add_stars(text, text, text[], int, text) to anon, authenticated;
