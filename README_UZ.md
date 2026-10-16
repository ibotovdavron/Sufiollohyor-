# So‘fi Ollohyor — yangi dizayn

1) Avval eski GitHub repo: Code → Download ZIP orqali zaxiralang.
2) Bu ZIP ichidagi fayllarni yuklang. Mavjud fayllarni darhol o‘chirmang.
3) `config.js`ni o‘zingiz yarating: `config.example.js` namunasidan foydalaning va Supabase Project URL + faqat `sb_publishable_...` kalitini kiriting.
4) `sb_secret_...` kalitini hech qachon brauzer fayliga qo‘ymang. Chatga yuborilgan secret kalitni Supabase’da bekor qiling/almashtiring.
5) Administrator orqali Auth foydalanuvchi yaratish uchun ishonchli server-side Edge Function/backend kerak; secret kalit HTML/JS ichida ishlatilmasin.
6) Supabase RLS siyosatlari ruxsat bermasa, jadvallar o‘qilmaydi yoki yozilmaydi. Bu paket dizayn va asosiy login/kabinet skeletini beradi; barcha modullarni mavjud jadval ustunlariga moslab keyingi bosqichlarda ulash kerak.
