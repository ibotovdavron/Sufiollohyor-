# SO‘FI OLLOH YOR — to‘liq ta’lim platformasi

Bu paket GitHub Pages + Supabase uchun tayyorlangan zamonaviy ta’lim platformasi.

## Muhim
Frontend GitHub Pages’da ishlaydi. Haqiqiy login, arizalar, o‘quvchilar, kurslar, darslar, testlar va admin boshqaruvi uchun Supabase kerak.

1. Supabase project yarating.
2. SQL Editor’da `database.sql` ni bir marta ishga tushiring.
3. `assets/js/config.js` ichiga Supabase URL va Publishable key kiriting.
4. Supabase Auth’da email/password loginni yoqing.
5. GitHub Pages’da repo root qilib joylang.

`service_role` keyini hech qachon frontendga qo‘ymang.

Demo rejim: Supabase sozlanmagan bo‘lsa, saytning dizayn va navigatsiyasi ishlaydi, ariza esa brauzer localStorage’iga saqlanadi.
