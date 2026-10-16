# So‘fi Ollohyor — saytning yangi dizayn fayllari

## Nimalar bor
- Qora, shaffof panel va olovrang aksentli moslashuvchan dizayn
- Bosh sahifa, ustozlar, to‘garaklar, tanlovlar, reyting, sovg‘alar, ariza, kirish, admin va o‘quvchi kabineti sahifalari
- Mobil menyu va sahifalararo havolalar
- Tanlov ballari yulduzlardan alohida bo‘lishi kerakligi ko‘rsatilgan

## Muhim: bu hozircha UI/start paketi
Ariza formasi, login, reyting, admin panel, Telegram xabarlari va sovg‘a tasdiqlash hali haqiqiy backend bilan ulanmagan. Forma yuborilganda ma’lumot saqlanmaydi. Bu ataylab shunday: mavjud Supabase bazasining sxemasi va RLS siyosatlarini tekshirmasdan ma’lumotlarni o‘zgartirmaymiz.

## GitHub Pages'ga joylash
1. ZIPni oching.
2. Ichidagi fayllarni mavjud omborga yuklashdan oldin eski fayllarni zaxirada saqlang.
3. `CNAME` faylini eski ombordan saqlab qoling — unda `sufiollohyor.uz` bo‘lishi mumkin. Uni ushbu paket bilan almashtirmang.
4. `config.example.js` faylini sozlashdan oldin Supabase loyihasi va jadval sxemasini tekshiring. Faqat publishable/anon kalitdan foydalaning.
5. GitHub Pages `main` branch/root katalogdan joylashtirilsa, `index.html` ildizda bo‘lishi kerak.

## Xavfsizlik
- Supabase `service_role` yoki `sb_secret_...` kalitlarini hech qachon front-endga qo‘ymang.
- Admin huquqini faqat brauzerdagi tugma yoki yashirin sahifa bilan himoyalash mumkin emas; Supabase Auth va RLS siyosatlari shart.
- Telegram bot tokeni server-side funksiyada saqlanishi kerak, `app.js` yoki HTML ichida emas.
