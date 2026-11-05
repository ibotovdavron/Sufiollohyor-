-- O‘YINLARDAN YULDUZ BERISHNI TO‘XTATISH
-- Supabase → SQL Editor → New query → joylab → Run.
-- O‘yinlar (Sirli quti, Poyga, Bilmasvoy, Matematika Master) endi game_stars jadvaliga yulduz yoza olmaydi.
-- Ilgari olingan yulduzlar o‘chmaydi. Ustozlar beradigan yulduzlar (teacher_stars) avvalgidek ishlaydi.

create or replace function public.block_game_stars()
returns trigger
language plpgsql
as $$
begin
  return null; -- yangi yozuv jimgina bekor qilinadi
end;
$$;

drop trigger if exists block_game_stars on public.game_stars;
create trigger block_game_stars
  before insert on public.game_stars
  for each row execute function public.block_game_stars();

-- QAYTA YOQISH UCHUN (kerak bo‘lsa) quyidagi qatorni ishga tushiring:
-- drop trigger if exists block_game_stars on public.game_stars;
