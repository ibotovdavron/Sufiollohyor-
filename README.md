# SO‘FI OLLOH YOR — GitHub Pages tayyor versiya

Bu paket GitHub Pages uchun qayta yig‘ilgan toza root-strukturadir.

## GitHub'ga joylash
1. Repository ichidagi eski sayt fayllarini olib tashlang (yoki alohida backup qiling).
2. ZIP ichidagi **barcha fayllarni** repository `main` branch'ining ROOT qismiga yuklang.
3. `index.html` repository rootida turishi shart.
4. `assets/css/style.css` va `assets/js/app.js` aynan shu yo‘llarda bo‘lishi shart.
5. GitHub → Settings → Pages → Source: **Deploy from a branch** → Branch: **main** → Folder: **/(root)** → Save.
6. Bir necha daqiqa kuting, keyin saytni oching.

## Sahifalar
- index.html
- courses.html
- course.html
- teachers.html
- schedule.html
- ranking.html
- about.html
- apply.html
- online.html
- login.html
- register.html
- admin.html va admin-* sahifalar
- student.html va student-* sahifalar

## Supabase
Haqiqiy login, o‘quvchilar, kurslar, darslar, testlar va admin ma’lumotlari uchun `database.sql` ni Supabase SQL Editor'da ishga tushiring va `assets/js/config.js` ga URL hamda publishable/anon key kiriting.

**service_role keyni frontendga qo‘ymang.**

Supabase sozlanmaganda kurslar demo ma’lumotlari bilan ko‘rinadi va ariza demo rejimida localStorage'ga yoziladi.

## Muhim
Bu paketda sahifalar va asset yo‘llari yagona `assets/` strukturasiga keltirilgan. Eski `style.css`, `styles.css`, `app.js`, `script.js` kabi parallel fayllarni qayta aralashtirmang.
