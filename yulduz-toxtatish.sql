-- BARCHA YULDUZ BERISHNI TO‘XTATISH (o‘yinlar, sirli xatolar, ustozlar, musobaqa, turnir)
-- Supabase → SQL Editor → New query → joylab → Run.
-- Bazaga 2026-11-28 da qo‘llangan. Ilgari olingan yulduzlar o‘chmaydi — faqat yangi yozuv va o‘zgartirish bekor qilinadi.

create or replace function public.block_all_stars() returns trigger language plpgsql as $$ begin return null; end; $$;

drop trigger if exists block_all_stars on public.game_stars;
create trigger block_all_stars before insert or update on public.game_stars for each row execute function public.block_all_stars();
drop trigger if exists block_all_stars on public.sirli_stars;
create trigger block_all_stars before insert or update on public.sirli_stars for each row execute function public.block_all_stars();
drop trigger if exists block_all_stars on public.teacher_stars;
create trigger block_all_stars before insert or update on public.teacher_stars for each row execute function public.block_all_stars();

-- QAYTA YOQISH UCHUN (kerak bo‘lsa) quyidagilarni ishga tushiring:
-- drop trigger if exists block_all_stars on public.game_stars;
-- drop trigger if exists block_all_stars on public.sirli_stars;
-- drop trigger if exists block_all_stars on public.teacher_stars;
