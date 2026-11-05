-- Sinf testlari: ustoz amaliy darsdagi mavzuni sinfga test qilib biriktiradi,
-- o'quvchi testdan (odatda 80%) o'tmaguncha o'yinlar yopiq turadi.
-- Supabase → SQL Editor → New query → hammasini joylab “Run” bosing.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.class_tests (
  id bigserial primary key,
  cls text not null check (char_length(cls) between 1 and 40),
  title text not null check (char_length(title) between 1 and 160),
  subject text,
  topics text[] not null default '{}',
  questions jsonb not null,
  minutes int not null check (minutes between 1 and 120),
  pass_pct int not null default 80 check (pass_pct between 10 and 100),
  teacher text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists class_tests_cls on public.class_tests (cls, active);

create table if not exists public.class_test_results (
  id bigserial primary key,
  test_id bigint not null references public.class_tests (id) on delete cascade,
  student text not null check (char_length(student) between 3 and 80),
  score int not null,
  total int not null,
  pct int not null,
  passed boolean not null,
  secs int,
  created_at timestamptz not null default now()
);
create index if not exists class_test_results_t on public.class_test_results (test_id, student);

alter table public.class_tests enable row level security;
alter table public.class_test_results enable row level security;
drop policy if exists class_tests_read on public.class_tests;
create policy class_tests_read on public.class_tests for select using (true);
drop policy if exists class_test_results_read on public.class_test_results;
create policy class_test_results_read on public.class_test_results for select using (true);

-- Ustoz parolini tekshirish (teacher-stars.sql dagi xeshlar bilan bir xil)
create or replace function public.ct_pin_ok(p_pin text) returns boolean
language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(coalesce(trim(p_pin), ''), 'sha256'), 'hex') in (
    '86fc699a4987c8f7b9f7d01f97863b3667206b5c43e02188c31aa50d51607a73', -- umumiy ustoz paroli
    '1136e4b62029095e629e1ca4d06643a5f325bc74e2702f5e2f9fa028048145de'  -- Raufov Azizbek
  );
$$;

-- Test biriktirish: har bir sinf uchun bitta yozuv. Qaytaradi: nechta sinfga biriktirildi.
create or replace function public.ct_assign(
  p_pin text, p_teacher text, p_classes text[], p_title text, p_subject text,
  p_topics text[], p_questions jsonb, p_minutes int, p_pass int
) returns int
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_c text;
  v_n int := 0;
begin
  if not public.ct_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  if p_questions is null or jsonb_typeof(p_questions) <> 'array'
     or jsonb_array_length(p_questions) < 1 or jsonb_array_length(p_questions) > 100 then
    raise exception 'Savollar soni 1 dan 100 gacha bo‘lishi kerak';
  end if;
  if length(p_questions::text) > 200000 then raise exception 'Test juda katta'; end if;
  foreach v_c in array coalesce(p_classes, '{}') loop
    insert into public.class_tests (cls, title, subject, topics, questions, minutes, pass_pct, teacher)
    values (left(v_c, 40), left(coalesce(p_title, 'Test'), 160), left(coalesce(p_subject, ''), 60),
            coalesce(p_topics, '{}'), p_questions,
            greatest(1, least(120, coalesce(p_minutes, 10))), greatest(10, least(100, coalesce(p_pass, 80))),
            left(coalesce(p_teacher, ''), 80));
    v_n := v_n + 1;
  end loop;
  return v_n;
end;
$$;

-- Testni yopish (o'quvchilar uchun o'chiriladi, natijalar saqlanib qoladi)
create or replace function public.ct_cancel(p_pin text, p_id bigint) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.ct_pin_ok(p_pin) then raise exception 'Parol noto‘g‘ri'; end if;
  update public.class_tests set active = false where id = p_id;
  return found;
end;
$$;

-- Natijani yozish. O'tdi/o'tmadi server hisoblaydi. Yiqilgandan keyin 10 daqiqa kutish kerak.
create or replace function public.ct_submit(p_test bigint, p_student text, p_score int, p_secs int)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  t public.class_tests;
  v_total int;
  v_score int;
  v_pct int;
  v_last timestamptz;
begin
  select * into t from public.class_tests where id = p_test;
  if not found or not t.active then raise exception 'Test topilmadi yoki yopilgan'; end if;
  if exists (select 1 from public.class_test_results where test_id = p_test and student = p_student and passed) then
    raise exception 'Bu testdan allaqachon o‘tgansiz';
  end if;
  select max(created_at) into v_last from public.class_test_results where test_id = p_test and student = p_student;
  if v_last is not null and v_last > now() - interval '10 minutes' then
    raise exception 'Qayta topshirish uchun 10 daqiqa kuting';
  end if;
  v_total := jsonb_array_length(t.questions);
  v_score := greatest(0, least(v_total, coalesce(p_score, 0)));
  v_pct := floor(v_score * 100.0 / v_total);
  insert into public.class_test_results (test_id, student, score, total, pct, passed, secs)
  values (p_test, left(p_student, 80), v_score, v_total, v_pct, v_pct >= t.pass_pct, p_secs);
  return jsonb_build_object('pct', v_pct, 'passed', v_pct >= t.pass_pct, 'score', v_score, 'total', v_total);
end;
$$;

revoke all on function public.ct_pin_ok(text) from public, anon, authenticated;
revoke all on function public.ct_assign(text, text, text[], text, text, text[], jsonb, int, int) from public;
revoke all on function public.ct_cancel(text, bigint) from public;
revoke all on function public.ct_submit(bigint, text, int, int) from public;
grant execute on function public.ct_assign(text, text, text[], text, text, text[], jsonb, int, int) to anon, authenticated;
grant execute on function public.ct_cancel(text, bigint) to anon, authenticated;
grant execute on function public.ct_submit(bigint, text, int, int) to anon, authenticated;
