# SO‘FI OLLOHYOR O‘QUV MARKAZI — Glassmorphism v2

Zamonaviy, yorqin va shaffof glassmorphism dizaynidagi statik sayt.

## Qo‘shilgan effektlar
- Oq/shaffof glassmorphism interfeys
- Yorqin gradientlar va futuristik aurora fon
- Harakatlanuvchi particle effektlari
- Mouse cursor glow
- Scroll reveal animatsiyalari
- Hover/float/scan-line animatsiyalari
- Interaktiv tugmalar uchun Web Audio ovoz effektlari
- 🔊/🔇 ovoz boshqaruvi (tanlov brauzerda saqlanadi)
- Ariza va savol formasi WhatsApp’ga yuboradi
- Responsive: telefon, planshet va kompyuter

## Ishga tushirish

### GitHub Pages
1. Fayllarni repository root qismiga joylang.
2. GitHub → **Settings → Pages**.
3. **Deploy from a branch** ni tanlang.
4. Branch: `main`, Folder: `/ (root)`.
5. Save bosing.

### Codespaces / lokal
```bash
python3 -m http.server 5500
```
So‘ng Codespaces’da **Ports → 5500 → Open in Browser** ni bosing.

## Muhim
Ovoz effektlari alohida mp3/wav talab qilmaydi — `script.js` ichidagi Web Audio API orqali brauzerda yaratiladi. Brauzer autoplay cheklovi sabab ovoz foydalanuvchi birinchi marta bosgandan keyin ishlaydi.
