# “So‘fi Ollohyor” ilovasini Google Play Market’ga chiqarish — qadamma-qadam yo‘riqnoma

Ilova — saytimiz (sufiollohyor.uz) ning Android “qobig‘i” (TWA — Trusted Web Activity).
Sayt yangilansa, ilova ham **avtomatik yangilanadi**, Play Market’ga qayta yuklash shart emas.

---

## 1-qadam. Google Play dasturchi akkaunti (siz qilasiz)

1. <https://play.google.com/console> ga markaz uchun ochilgan Gmail bilan kiring.
2. Akkaunt turini tanlang:
   - **Shaxsiy** — tezroq ochiladi. Lekin ilovani hammaga chiqarishdan oldin **kamida 12 sinovchi bilan 14 kun yopiq sinov** o‘tkazish shart (o‘quvchilar, ota-onalar, ustozlar bo‘lishi mumkin — ular Gmail’ini berishadi).
   - **Tashkilot** — markaz nomidan. **D-U-N-S raqami** kerak (bepul olinadi, 1–4 hafta), lekin 12 sinovchi talabi yo‘q.
3. Bir martalik to‘lov: **25 $** (bank kartasi bilan).
4. Shaxsingizni tasdiqlang (pasport rasmi). Tasdiq bir necha kun olishi mumkin.

## 2-qadam. Ilova faylini (.aab) yaratish — PWABuilder orqali (10 daqiqa)

1. <https://www.pwabuilder.com> saytini oching.
2. Manzilga `https://sufiollohyor.uz` yozib **Start** bosing — sayt tekshiriladi (manifest, ikonka, oflayn ishlash tayyor ✅).
3. **Package for stores → Android → Generate package**.
4. Sozlamalar:
   - **Package ID:** `uz.sufiollohyor.app`
   - **App name:** `So‘fi Ollohyor`
   - **Launcher name:** `So‘fi Ollohyor`
   - **Signing key:** *“Create new”* — PWABuilder sizga imzo kalitini yaratadi.
5. **Download** — ZIP fayl yuklanadi. Uning ichida:
   - `*.aab` — Play Market’ga yuklanadigan fayl;
   - `signing.keystore` va `signing-key-info.txt` — ⚠️ **juda muhim, xavfsiz joyda saqlang** (yo‘qolsa, ilovani yangilab bo‘lmaydi). Hech kimga bermang va GitHub’ga yuklamang!
   - `assetlinks.json` — sayt va ilovani bog‘lovchi fayl.

## 3-qadam. Sayt bilan ilovani bog‘lash (assetlinks.json)

Bu fayl bo‘lmasa, ilova tepasida manzil satri ko‘rinib turadi.

1. `assetlinks.json` ichidagi **SHA-256 barmoq izi**ni (`sha256_cert_fingerprints`) menga yuboring
   (bu ochiq ma’lumot, maxfiy emas — kalitning o‘zini yubormang!).
2. Men uni saytga `https://sufiollohyor.uz/.well-known/assetlinks.json` manzilida joylayman.
3. Play Console’da **Setup → App signing** bo‘limida Google’ning o‘z barmoq izi ham ko‘rsatiladi — uni ham menga yuboring, ikkalasini qo‘shaman.

## 4-qadam. Play Console’da ilova yaratish

1. **Create app** → nomi `So‘fi Ollohyor`, til: **O‘zbek**, turi: **App**, **Free** (bepul).
2. **Store listing (ilova sahifasi)** — `ILOVA-SAHIFASI.md` faylidagi matnlarni nusxalab qo‘ying.
3. Rasmlar (`play-market/rasmlar/` papkasida tayyor):
   - Ikonka 512×512 — `icon-512.png`
   - Bosh rasm (feature graphic) 1024×500 — `feature-graphic.png`
   - Telefon skrinshotlari (kamida 2 ta) — `screen-*.png`
4. **App content** bo‘limidagi shakllar — `GOOGLE-SHAKLLARI.md` dagi javoblar bilan to‘ldiring:
   - Privacy policy: `https://sufiollohyor.uz/maxfiylik.html`
   - Ads: **No** (reklama yo‘q)
   - App access: kirish uchun parol kerak bo‘lgan qismlar bor → sinov uchun “Mehmon” rejimini ko‘rsating
   - Content rating (IARC so‘rovnomasi)
   - Target audience (maqsadli yosh)
   - Data safety (ma’lumotlar xavfsizligi)

## 5-qadam. Yuklash va sinov

1. **Testing → Closed testing** → yangi trek → `.aab` faylni yuklang.
2. Sinovchilar ro‘yxatiga 12+ Gmail qo‘shing, ularga taklif havolasini yuboring — ular ilovani o‘rnatib, 14 kun davomida ishlatib turishsin.
3. 14 kundan keyin **Production → Apply for production** → Google ko‘rib chiqadi (odatda 1–7 kun).

## 6-qadam. Chiqdi! 🎉

Ilova havolasi: `https://play.google.com/store/apps/details?id=uz.sufiollohyor.app`
Saytga “Play Market’dan yuklab olish” tugmasini men qo‘shib beraman.

---

### Savollar bo‘lsa
Har bir qadamda ekran rasmini yuborsangiz, qayerni bosish kerakligini aytib beraman.
