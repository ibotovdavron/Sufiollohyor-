# So‘fi Ollohyor o‘quv markazi — GitHub Pages sayti

## Fayllar
- `index.html` — bosh sahifa
- `competitions.html` — musobaqalar
- `teachers.html` — ustozlar
- `ranking.html` — yulduzli reyting
- `results.html` — natijalar
- `about.html` — markaz haqida
- `contact.html` — bog‘lanish
- `style.css` — yashil-qora mobil dizayn va pastki 7 tugmali navigatsiya
- `data.js` — o‘zgartiriladigan markaz, o‘quvchi, ustoz va yutuq ma’lumotlari
- `app.js` — sahifalar uchun interaktiv funksiyalar
- `assets/` — mavjud bo‘lsa, foydalanuvchi yuborgan original rasmlar

## GitHub Pages
1. ZIP faylni telefoningizda oching.
2. GitHub'da `Sufiollohyor` omborini oching.
3. **Add file → Upload files** orqali fayllarni va `assets` papkasini yuklang (papka yuklash qo‘llanmasa, fayllarni alohida yuklang).
4. **Commit changes** tugmasini bosing.
5. **Settings → Pages** ga kiring.
6. Build and deployment bo‘limida **Deploy from a branch**, branch `main`, folder `/(root)` tanlang va saqlang.

## Ma’lumotlarni yangilash
`data.js` ichidagi `students`, `teachers`, `competitions`, `starRules` massivlarini tahrirlang. Hozirgi o‘quvchi va ustoz nomlarining bir qismi NAMUNA; haqiqiy ma’lumot bilan almashtiring.

## Muhim
Bu statik, ommaviy sayt. Maxfiy ma’lumotlar, parollar, o‘quvchilarning telefon raqamlari yoki manzillarini kiritmang. Hozirgi kodda admin login yoki serverga ma’lumot yozish funksiyasi yo‘q. Reyting ma’lumotlari sahifaga tashrif buyurgan har kimga ko‘rinadi.
