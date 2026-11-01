/* Matematika MASTER — 1–4-modullar: Arifmetika, Algebra, Funksiyalar, Analiz. */
window.MASTER = window.MASTER || [];
(() => {
  const T = (mod, o) => window.MASTER.push({ mod, ...o });

  // ===================== 1. ARIFMETIKA VA SONLAR NAZARIYASI =====================
  T(1, {
    id: "takror-3-4", title: "3–4-sinfda o‘tilganlarni takrorlash", tag: "Boshlang‘ich bazaviy tushunchalar",
    life: "Har qanday murakkab matematika to‘rt amal va son xonalariga tayanadi. Bu mavzu poydevorni mustahkamlaydi: ko‘p xonali sonlar, og‘zaki hisob, birliklar, oddiy masalalar.",
    explain: "<p><b>1. Xona birliklari.</b> 3 457 201 sonida: 3 — million, 4 — yuz ming, 5 — o‘n ming, 7 — ming, 2 — yuz, 0 — o‘n, 1 — birlik. Son yoyilmasi: 3·1 000 000 + 4·100 000 + 5·10 000 + 7·1000 + 2·100 + 1.</p><p><b>2. To‘rt amal va ularning komponentlari:</b></p><table class='oq-t'><tr><th>Amal</th><th>Komponentlar</th><th>Noma’lumni topish</th></tr><tr><td>a + b = c</td><td>qo‘shiluvchi, yig‘indi</td><td>a = c − b</td></tr><tr><td>a − b = c</td><td>kamayuvchi, ayriluvchi, ayirma</td><td>a = c + b; b = a − c</td></tr><tr><td>a · b = c</td><td>ko‘paytuvchi, ko‘paytma</td><td>a = c : b</td></tr><tr><td>a : b = c</td><td>bo‘linuvchi, bo‘luvchi, bo‘linma</td><td>a = c · b; b = a : c</td></tr></table><p><b>3. Amallar qonunlari:</b> o‘rin almashtirish (a + b = b + a), guruhlash ((a + b) + c = a + (b + c)), taqsimot (a(b + c) = ab + ac). 0 ga bo‘lish mumkin emas; a · 0 = 0; a · 1 = a.</p><p><b>4. O‘lchov birliklari:</b> 1 km = 1000 m, 1 m = 100 sm, 1 sm = 10 mm; 1 t = 10 sr = 1000 kg; 1 soat = 60 daq = 3600 s; 1 sutka = 24 soat.</p><p><b>5. Perimetr va yuz:</b> to‘g‘ri to‘rtburchak P = 2(a + b), S = a·b; kvadrat P = 4a, S = a².</p>",
    rule: "Noma’lum qo‘shiluvchi = yig‘indi − ma’lum qo‘shiluvchi; noma’lum ko‘paytuvchi = ko‘paytma : ma’lum ko‘paytuvchi.",
    tip: "Birliklarni bir xil qiling: 2 m 5 sm = 205 sm (25 sm emas!).",
    demos: [{ type: "placeValue" }],
    ex: [
      ["Hisoblang: 4 800 : 16 + 25 · 12", ["4 800 : 16 = 300", "25 · 12 = 300", "300 + 300 = 600"], "600"],
      ["x · 24 = 1 920 bo‘lsa, x = ?", ["Noma’lum ko‘paytuvchi = ko‘paytma : ma’lum ko‘paytuvchi", "x = 1 920 : 24 = 80"], "80"],
      ["Bog‘ uzunligi 45 m, eni 20 m. Atrofini o‘rash uchun necha metr sim kerak?", ["P = 2(45 + 20) = 130 m"], "130 m"]
    ],
    qz: [
      ["5 km 30 m necha metr?", ["5030 m", "530 m", "5300 m", "503 m"], "5·1000 + 30."],
      ["(x − 35) = 47 → x = ?", ["82", "12", "72", "92"], "Kamayuvchi = ayirma + ayriluvchi."],
      ["3 soat necha sekund?", ["10 800", "180", "3600", "1080"], "3·3600."],
      ["Tomoni 9 sm kvadrat yuzi?", ["81 sm²", "36 sm²", "18 sm²", "27 sm²"], "9²."],
      ["2 040 060 sonida 4 raqami qaysi xonada?", ["o‘n minglar", "minglar", "yuz minglar", "o‘nlar"], "2 040 060: 2 mln, 0 yuz ming, 4 o‘n ming."]
    ],
    see: ["1.1.1"]
  });
  T(1, {
    id: "takror-5", title: "5-sinfda o‘tilganlarni takrorlash", tag: "Hisoblash va soddalashtirish",
    life: "5-sinf — natural sonlar, oddiy va o‘nli kasrlar, foizlar va tenglamalarning boshlanishi. Bu bilimlarsiz algebra va geometriyaga o‘tib bo‘lmaydi.",
    explain: "<p><b>1. Amallar tartibi:</b> qavs → daraja → ko‘paytirish/bo‘lish → qo‘shish/ayirish (chapdan o‘ngga).</p><p><b>2. Sonning kvadrati va kubi:</b> a² = a·a, a³ = a·a·a. 1² … 15² ni yodlash foydali: 11² = 121, 12² = 144, 13² = 169, 14² = 196, 15² = 225.</p><p><b>3. Oddiy kasrlar:</b> [[a/b]] — butunning b ta bo‘lagidan a tasi. Sonning qismini topish: 60 ning [[3/4]] i = 60 : 4 · 3 = 45. Qismi bo‘yicha sonni topish: [[2/5]] qismi 18 bo‘lsa, son 18 : 2 · 5 = 45.</p><p><b>4. O‘nli kasrlar va foiz:</b> 1% = [[1/100]] = 0,01. 25% = [[1/4]], 50% = [[1/2]], 20% = [[1/5]].</p><p><b>5. Sodda tenglamalar:</b> 3x + 7 = 22 → 3x = 15 → x = 5.</p><p><b>6. Burchaklar va shakllar:</b> to‘g‘ri burchak 90°, yoyiq 180°; to‘g‘ri burchakli parallelepiped hajmi V = abc.</p>",
    rule: "Sonning [[m/n]] qismi: son : n · m. Qismiga ko‘ra son: qism : m · n.",
    tip: "“Qismini topish” va “qismiga ko‘ra sonni topish” masalalarini adashtirmang — birida ko‘paytiriladi, ikkinchisida bo‘linadi.",
    demos: [{ type: "orderOps", examples: ["(36 + 24) : 5 × 3 − 4", "100 − 12 × 5 + 48 : 6", "7 × (18 − 9) : 3 + 11"] }],
    ex: [
      ["Kitob 240 bet. Birinchi kuni [[3/8]] qismi o‘qildi. Necha bet qoldi?", ["240 : 8 · 3 = 90 bet o‘qildi", "240 − 90 = 150"], "150 bet"],
      ["Hisoblang: 2,5 · 4 + 18 : 0,3", ["2,5 · 4 = 10", "18 : 0,3 = 180 : 3 = 60", "10 + 60 = 70"], "70"],
      ["Yeching: 5(x − 2) = 35", ["x − 2 = 7", "x = 9"], "x = 9"]
    ],
    qz: [
      ["13² = ?", ["169", "139", "196", "156"], "13·13."],
      ["80 ning 25% i?", ["20", "25", "40", "16"], "80 : 4."],
      ["[[3/5]] qismi 36 bo‘lgan son?", ["60", "21,6", "45", "108"], "36 : 3 · 5."],
      ["4x − 9 = 31 → x = ?", ["10", "5,5", "8", "11"], "4x = 40."],
      ["O‘lchamlari 2, 3, 5 sm bo‘lgan quti hajmi?", ["30 sm³", "10 sm³", "62 sm³", "15 sm³"], "2·3·5."]
    ],
    see: ["1.1.1", "1.2.1", "1.2.3"]
  });
  T(1, {
    id: "boluvchi-karrali", title: "Sonlarning bo‘luvchilari va karralisi", tag: "Tub va murakkab sonlar xossalari",
    life: "Kriptografiya (bank kartalari, internet xavfsizligi) aynan tub sonlarga asoslangan. Bo‘luvchilarni bilish kasrlarni qisqartirish va ko‘plab olimpiada masalalarining kalitidir.",
    explain: "<p><b>Bo‘luvchi:</b> a son b ga qoldiqsiz bo‘linsa, b — a ning bo‘luvchisi, a — b ning karralisi.</p><p><b>Tub son</b> — faqat 1 ga va o‘ziga bo‘linadigan, 1 dan katta son: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, … (2 — yagona juft tub son). <b>Murakkab son</b> — ikkitadan ko‘p bo‘luvchili son. 1 tub ham, murakkab ham emas.</p><p><b>Arifmetikaning asosiy teoremasi:</b> har bir murakkab son tub ko‘paytuvchilarga yagona tarzda ajraladi: 360 = 2³·3²·5.</p><p><b>Bo‘luvchilar soni:</b> n = p₁^a · p₂^b · p₃^c bo‘lsa, bo‘luvchilar soni (a + 1)(b + 1)(c + 1). Masalan, 360 da (3 + 1)(2 + 1)(1 + 1) = 24 ta.</p><p><b>Tub ekanini tekshirish:</b> √n gacha bo‘lgan tub sonlarga bo‘lib ko‘ring. 97: √97 < 10 → 2, 3, 5, 7 ga bo‘linmaydi → tub.</p><p><b>Bo‘linish belgilari:</b> 2, 3, 4, 5, 9, 10, 11 (Oq to‘plamdagi jadvalga qarang).</p>",
    rule: "n = p₁ᵃ·p₂ᵇ·… → bo‘luvchilar soni (a + 1)(b + 1)…",
    tip: "1 tub son EMAS. 2 — eng kichik va yagona juft tub son.",
    demos: [{ type: "divCheck" }],
    ex: [
      ["72 ning barcha natural bo‘luvchilari soni?", ["72 = 2³ · 3²", "(3 + 1)(2 + 1) = 12"], "12 ta"],
      ["91 tub sonmi?", ["√91 < 10 → 2, 3, 5, 7 ga tekshiramiz", "91 = 7 · 13"], "Yo‘q, murakkab"],
      ["1 dan 50 gacha nechta tub son bor?", ["2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47"], "15 ta"]
    ],
    qz: [
      ["Qaysi son tub?", ["53", "51", "57", "49"], "51 = 3·17, 57 = 3·19, 49 = 7²."],
      ["100 ning bo‘luvchilari soni?", ["9", "10", "8", "6"], "2²·5² → 3·3."],
      ["120 ni tub ko‘paytuvchilarga ajrating.", ["2³·3·5", "2²·3·10", "2·3·4·5", "2³·15"], "120 = 8·15."],
      ["Eng kichik murakkab son?", ["4", "1", "2", "6"], "4 = 2·2."],
      ["Ikki tub sonning yig‘indisi 25. Ularning ko‘paytmasi?", ["46", "36", "100", "150"], "Biri juft bo‘lishi kerak: 2 + 23 → 46."]
    ],
    see: ["1.1.2", "1.1.3"]
  });
  T(1, {
    id: "ekub-ekuk", title: "EKUB va EKUK", tag: "Eng katta umumiy bo‘luvchi va eng kichik karrali",
    life: "Sovg‘alarni teng taqsimlash, avtobuslar jadvali, plitka o‘lchamini tanlash, kasrlarni umumiy maxrajga keltirish — EKUB va EKUK har kuni ishlatiladi.",
    explain: "<p><b>EKUB(a, b)</b> — a va b ning har biri bo‘linadigan eng katta son. <b>EKUK(a, b)</b> — a ga ham, b ga ham bo‘linadigan eng kichik son.</p><p><b>1-usul — tub ko‘paytuvchilar:</b> 84 = 2²·3·7, 90 = 2·3²·5. EKUB = umumiylarning kichik darajalari = 2·3 = 6. EKUK = hammasining katta darajalari = 2²·3²·5·7 = 1260.</p><p><b>2-usul — Evklid algoritmi:</b> EKUB(a, b) = EKUB(b, a mod b). EKUB(84, 90): 90 = 84·1 + 6; 84 = 6·14 + 0 → 6.</p><span class='fb'>EKUB(a, b) · EKUK(a, b) = a · b</span><p><b>O‘zaro tub sonlar:</b> EKUB = 1 (masalan, 8 va 15). Ularning EKUKi = a·b.</p><p><b>Masala turlari:</b> “eng ko‘p nechta bir xil sovg‘a” — EKUB; “eng kam nechta / qachon yana birga” — EKUK.</p>",
    rule: "EKUB·EKUK = a·b. Evklid: EKUB(a, b) = EKUB(b, a mod b).",
    tip: "EKUB ikkala sondan katta bo‘lolmaydi, EKUK esa ikkalasidan kichik bo‘lolmaydi — javobni shunday tekshiring.",
    ex: [
      ["EKUB(168; 252) ni Evklid usulida toping.", ["252 = 168·1 + 84", "168 = 84·2 + 0", "EKUB = 84"], "84"],
      ["36 ta qalam va 48 ta daftarni o‘quvchilarga teng bo‘lish kerak. Eng ko‘pi bilan necha o‘quvchiga?", ["EKUB(36; 48) = 12", "Har biriga 3 qalam, 4 daftar"], "12 o‘quvchi"],
      ["Uch qo‘ng‘iroq 4, 6 va 10 daqiqada chalinadi. Birga chalingandan keyin yana qachon birga?", ["EKUK(4; 6; 10) = 60"], "60 daqiqadan keyin"]
    ],
    qz: [
      ["EKUB(54; 72) = ?", ["18", "9", "6", "36"], "2·3² = 18."],
      ["EKUK(12; 18) = ?", ["36", "72", "216", "6"], "2²·3²."],
      ["EKUB(a; b) = 4, ab = 240. EKUK = ?", ["60", "240", "960", "40"], "240/4."],
      ["Qaysi juftlik o‘zaro tub?", ["9 va 16", "12 va 18", "14 va 21", "10 va 25"], "EKUB(9; 16) = 1."],
      ["EKUK(7; 9) = ?", ["63", "16", "1", "21"], "O‘zaro tub → ko‘paytma."]
    ],
    see: ["1.1.4"]
  });
  T(1, {
    id: "oddiy-kasrlar", title: "Oddiy kasrlar va ular ustida amallar", tag: "Maxraj berish, ko‘paytirish va bo‘lish",
    life: "Retseptlar, vaqt (“chorak soat”), chegirmalar va ulushlar — kasrlar. Kasrlar bilan erkin ishlash algebraik kasrlar va tenglamalar uchun zarur.",
    explain: "<p><b>Asosiy xossa:</b> [[a/b]] = [[ak/bk]] (k ≠ 0). Qisqartirish — surat va maxrajni EKUBga bo‘lish: [[36/48]] = [[3/4]].</p><p><b>Taqqoslash:</b> umumiy maxrajga keltirib yoki “ko‘ndalang ko‘paytirib”: [[5/7]] va [[7/10]] → 50 > 49 → [[5/7]] katta.</p><p><b>Qo‘shish/ayirish:</b> EKUK(maxrajlar) ga keltiramiz, har bir kasrga qo‘shimcha ko‘paytuvchi beramiz.</p><p><b>Ko‘paytirish:</b> [[a/b]]·[[c/d]] = [[ac/bd]] (avval ko‘ndalang qisqartiring!).</p><p><b>Bo‘lish:</b> [[a/b]] : [[c/d]] = [[a/b]]·[[d/c]].</p><p><b>Aralash sonlar:</b> 2[[3/5]] = [[13/5]]. Ko‘paytirish va bo‘lishdan oldin noto‘g‘ri kasrga aylantiring.</p><p><b>Ko‘p qavatli kasr:</b> [[(1/2 + 1/3)/(1/6)]] = [[5/6]] : [[1/6]] = 5.</p>",
    rule: "Qo‘shish — umumiy maxraj; ko‘paytirish — surat×surat, maxraj×maxraj; bo‘lish — teskarisiga ko‘paytirish.",
    tip: "Kasrlarni ko‘paytirishda umumiy maxraj kerak EMAS — bu faqat qo‘shish va ayirish uchun.",
    demos: [{ type: "fracAdd" }],
    ex: [
      ["Hisoblang: [[7/12]] + [[5/18]] − [[1/4]]", ["EKUK(12, 18, 4) = 36", "[[21/36]] + [[10/36]] − [[9/36]] = [[22/36]] = [[11/18]]"], "[[11/18]]"],
      ["Hisoblang: 3[[3/4]] · 1[[1/5]] : 2[[1/4]]", ["[[15/4]] · [[6/5]] = [[90/20]] = [[9/2]]", "[[9/2]] : [[9/4]] = [[9/2]] · [[4/9]] = 2"], "2"],
      ["Hisoblang: [[(2/3 − 1/2)/(1/4 + 1/6)]]", ["Surat: [[1/6]]", "Maxraj: [[5/12]]", "[[1/6]] : [[5/12]] = [[12/30]] = [[2/5]]"], "[[2/5]]"]
    ],
    qz: [
      ["[[2/3]] + [[3/4]] = ?", ["1[[5/12]]", "[[5/7]]", "[[6/12]]", "1[[1/12]]"], "[[8/12]] + [[9/12]] = [[17/12]]."],
      ["[[45/60]] ni qisqartiring.", ["[[3/4]]", "[[9/12]]", "[[5/6]]", "[[2/3]]"], "15 ga."],
      ["[[6/7]] : 3 = ?", ["[[2/7]]", "[[18/7]]", "[[6/21]]", "[[1/7]]"], "[[6/7]]·[[1/3]]."],
      ["Qaysi biri katta: [[4/9]] yoki [[5/11]]?", ["[[5/11]]", "[[4/9]]", "teng", "aniqlab bo‘lmaydi"], "44 < 45."],
      ["1[[1/2]] · 1[[1/3]] = ?", ["2", "1[[1/6]]", "2[[1/6]]", "1[[5/6]]"], "[[3/2]]·[[4/3]] = 2."]
    ],
    see: ["1.2.1", "1.2.2"]
  });
  T(1, {
    id: "onli-davriy", title: "O‘nli kasrlar va cheksiz davriy kasrlar", tag: "Kasrlarni shakldan shaklga o‘tkazish",
    life: "Kalkulyator [[1/3]] ni 0,3333333 deb ko‘rsatadi — bu aniq emas. Davriy kasrlarni oddiy kasrga aylantirish orqali aniq javob olamiz. Narx, o‘lchov va foizlar esa o‘nli kasrda yoziladi.",
    explain: "<p><b>Oddiy → o‘nli:</b> suratni maxrajga bo‘lamiz. Maxraj faqat 2 va 5 dan iborat bo‘lsa — chekli o‘nli kasr ([[3/8]] = 0,375), aks holda — cheksiz davriy ([[2/11]] = 0,(18)).</p><p><b>Chekli o‘nli → oddiy:</b> 0,45 = [[45/100]] = [[9/20]].</p><p><b>Sof davriy → oddiy:</b> 0,(ab) = [[ab/99]]: 0,(12) = [[12/99]] = [[4/33]].</p><p><b>Aralash davriy → oddiy:</b> 0,a(b) = [[(ab − a)/90]]; 0,ab(c) = [[(abc − ab)/900]]. Masalan, 0,1(3) = [[(13 − 1)/90]] = [[12/90]] = [[2/15]].</p><p><b>O‘nli kasrlar bilan amallar:</b> ko‘paytirishda verguldan keyingi raqamlar soni qo‘shiladi; bo‘lishda bo‘luvchini butun songa aylantiramiz.</p><p><b>Yaxlitlash:</b> 3,1416 ≈ 3,14 (keyingi raqam < 5 → tashlanadi); 2,675 ≈ 2,68.</p>",
    rule: "0,(a) = a/9; 0,(ab) = ab/99; 0,a(b) = (ab − a)/90.",
    tip: "0,(9) = 1 — bu xato emas, haqiqatan teng: [[9/9]] = 1.",
    demos: [{ type: "decimalGrid" }],
    ex: [
      ["0,(45) + 0,(54) = ?", ["[[45/99]] + [[54/99]] = [[99/99]] = 1"], "1"],
      ["2,1(6) ni oddiy kasrga aylantiring.", ["0,1(6) = [[(16 − 1)/90]] = [[15/90]] = [[1/6]]", "2 + [[1/6]] = [[13/6]]"], "[[13/6]]"],
      ["Hisoblang: (0,8 − 0,35) : 0,15", ["0,45 : 0,15 = 45 : 15 = 3"], "3"]
    ],
    qz: [
      ["[[7/8]] = ?", ["0,875", "0,78", "0,87", "0,8"], "7 : 8."],
      ["0,(5) = ?", ["[[5/9]]", "[[1/2]]", "[[5/10]]", "[[5/99]]"], "Sof davriy."],
      ["0,2(7) = ?", ["[[1/4]]", "[[27/99]]", "[[27/90]]", "[[5/18]]"], "(27 − 2)/90 = 25/90 = 5/18."],
      ["Qaysi kasr chekli o‘nli kasrga aylanadi?", ["[[7/40]]", "[[1/6]]", "[[2/15]]", "[[5/12]]"], "40 = 2³·5."],
      ["0,12 · 0,5 = ?", ["0,06", "0,6", "0,006", "0,0006"], "12·5 = 60 → 3 raqam."]
    ],
    see: ["1.2.3", "1.2.4"]
  });

  // ===================== 2. ALGEBRA VA TENGLAMALAR =====================
  T(2, {
    id: "algebraik-ifodalar", title: "Algebraik ifodalar va qisqa ko‘paytirish formulalari", tag: "Qavslarni ochish va guruhlash",
    life: "Qisqa ko‘paytirish formulalari — algebrachining “karra jadvali”. Ular yordamida 49·51, 99² kabi hisoblarni og‘zaki bajarish va murakkab ifodalarni bir qatorga keltirish mumkin.",
    explain: "<p><b>Asosiy formulalar:</b></p><span class='fb'>(a ± b)² = a² ± 2ab + b²</span><span class='fb'>a² − b² = (a − b)(a + b)</span><span class='fb'>(a ± b)³ = a³ ± 3a²b + 3ab² ± b³</span><span class='fb'>a³ ± b³ = (a ± b)(a² ∓ ab + b²)</span><span class='fb'>(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ac</span><p><b>Ko‘paytuvchilarga ajratish usullari:</b> umumiy ko‘paytuvchini chiqarish → guruhlash → formulalar → kvadrat uchhad ax² + bx + c = a(x − x₁)(x − x₂).</p><p><b>Foydali ayniyatlar:</b> a² + b² = (a + b)² − 2ab; (a − b)² = (a + b)² − 4ab; a³ + b³ = (a + b)³ − 3ab(a + b).</p><p><b>Algebraik kasrlar:</b> qisqartirishdan oldin surat va maxrajni ko‘paytuvchilarga ajrating.</p>",
    rule: "(a + b)² = a² + 2ab + b² — o‘rtadagi 2ab ni unutmang!",
    tip: "(a − b)² = (b − a)², lekin a − b = −(b − a). Kasrlarda ishora almashishiga diqqat.",
    demos: [{ type: "squareArea" }],
    ex: [
      ["Hisoblang: 997² (og‘zaki)", ["(1000 − 3)² = 1 000 000 − 6000 + 9"], "994 009"],
      ["Ko‘paytuvchilarga ajrating: x⁴ − 16", ["(x² − 4)(x² + 4)", "(x − 2)(x + 2)(x² + 4)"], "(x − 2)(x + 2)(x² + 4)"],
      ["a − b = 2, ab = 15. a² + b² va a³ − b³ ni toping.", ["a² + b² = (a − b)² + 2ab = 4 + 30 = 34", "a³ − b³ = (a − b)(a² + ab + b²) = 2·(34 + 15) = 98"], "34 va 98"]
    ],
    qz: [
      ["(3a + 2)² = ?", ["9a² + 12a + 4", "9a² + 4", "9a² + 6a + 4", "3a² + 12a + 4"], "(3a)² + 2·3a·2 + 4."],
      ["52² − 48² = ?", ["400", "16", "200", "800"], "4·100."],
      ["x³ + 8 = ?", ["(x + 2)(x² − 2x + 4)", "(x + 2)³", "(x + 2)(x² + 2x + 4)", "(x − 2)(x² + 2x + 4)"], "a³ + b³."],
      ["x + y = 6, xy = 5. x² + y² = ?", ["26", "36", "31", "46"], "36 − 10."],
      ["[[(a² − 2a + 1)/(a − 1)]] = ?", ["a − 1", "a + 1", "1", "a² − 1"], "(a − 1)²/(a − 1)."]
    ],
    see: ["1.3.1", "1.3.2", "1.3.3", "1.3.4"]
  });
  T(2, {
    id: "haqiqiy-sonlar-ildiz", title: "Haqiqiy sonlar va ildizlar (ratsional/irratsional)", tag: "Ildiz ostidagi amallar va darajalar",
    life: "√2 ≈ 1,41421… — kvadrat diagonali tomonidan necha marta uzun? Bu son hech qachon kasr bilan aniq yozilmaydi. Irratsional sonlar geometriya, fizika va muhandislikda doim uchraydi.",
    explain: "<p><b>Sonlar to‘plamlari:</b> N (natural) ⊂ Z (butun) ⊂ Q (ratsional) ⊂ R (haqiqiy).</p><ul><li><b>Ratsional</b> — [[m/n]] ko‘rinishidagi son (chekli yoki davriy o‘nli kasr): 0,5; −3; 0,(3).</li><li><b>Irratsional</b> — cheksiz davriy bo‘lmagan o‘nli kasr: √2, √3, π, e. √n (n — to‘la kvadrat bo‘lmasa) irratsional.</li></ul><p><b>Ildiz xossalari:</b> √(ab) = √a·√b; √(a/b) = √a/√b; √(a²) = |a|; (√a)² = a (a ≥ 0).</p><p><b>Daraja xossalari:</b> aᵐaⁿ = aᵐ⁺ⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ; a^(m/n) = ⁿ√(aᵐ).</p><p><b>Maxrajni irratsionallikdan qutqarish:</b> [[1/(√a − √b)]] = [[(√a + √b)/(a − b)]].</p><p><b>Murakkab ildiz:</b> √(a ± 2√b) = |√x ± √y|, x + y = a, xy = b.</p>",
    rule: "√(a²) = |a|; a^(m/n) = ⁿ√(aᵐ); a⁻ⁿ = 1/aⁿ.",
    tip: "Ikki irratsional sonning yig‘indisi yoki ko‘paytmasi ratsional bo‘lishi mumkin: √2 · √2 = 2.",
    ex: [
      ["Hisoblang: (√12 − √3)² ", ["√12 = 2√3 → 2√3 − √3 = √3", "(√3)² = 3"], "3"],
      ["Hisoblang: 16^(0,75) + 27^(−1/3)", ["16^(3/4) = 2³ = 8", "27^(−1/3) = 1/3", "8 + [[1/3]]"], "8[[1/3]]"],
      ["Soddalashtiring: √(9 − 4√5)", ["9 − 4√5 = 5 − 2·2√5 + 4 = (√5 − 2)²", "√5 > 2 → √5 − 2"], "√5 − 2"]
    ],
    qz: [
      ["Qaysi son irratsional?", ["√7", "√49", "0,(3)", "[[22/7]]"], "7 to‘la kvadrat emas."],
      ["√18 · √8 = ?", ["12", "√26", "144", "6√2"], "√144."],
      ["2⁻³ = ?", ["[[1/8]]", "−8", "−6", "[[1/6]]"], "1/2³."],
      ["[[6/√2]] = ?", ["3√2", "6√2", "√3", "3"], "6√2/2."],
      ["√((2 − √5)²) = ?", ["√5 − 2", "2 − √5", "2 + √5", "−√5 − 2"], "|2 − √5|."]
    ],
    see: ["1.4.1", "1.4.2", "1.4.3", "1.4.4"]
  });
  T(2, {
    id: "chiziqli-tenglamalar", title: "Birinchi darajali (chiziqli) tenglamalar", tag: "Oddiy tenglamalar yechish tizimi",
    life: "Narxni, vaqtni, masofani topishga oid deyarli har bir kundalik masala chiziqli tenglamaga keladi. Uni yechish algoritmi — matematikaning eng ko‘p ishlatiladigan “retsepti”.",
    explain: "<p><b>Ko‘rinishi:</b> ax + b = 0 yoki ax = b.</p><p><b>Yechish algoritmi:</b></p><ol><li>Kasr bo‘lsa — barcha hadlarni umumiy maxrajga ko‘paytiring.</li><li>Qavslarni oching.</li><li>Noma’lumli hadlarni chapga, sonlarni o‘ngga o‘tkazing (ishora o‘zgaradi).</li><li>O‘xshash hadlarni ixchamlang: ax = b.</li><li>a ≠ 0 bo‘lsa, x = b/a.</li></ol><p><b>Maxsus holatlar:</b> 0·x = 5 — yechim yo‘q; 0·x = 0 — x istalgan son.</p><p><b>Proporsiya:</b> [[a/b]] = [[c/d]] ⇔ ad = bc.</p><p><b>Matnli masalani tenglamaga aylantirish:</b> noma’lumni belgilash → shartlarni ifoda bilan yozish → tenglik tuzish.</p>",
    rule: "ax = b: a ≠ 0 → x = b/a; a = 0, b ≠ 0 → yechim yo‘q; a = b = 0 → cheksiz ko‘p.",
    tip: "Tenglikning bir tomoniga o‘tkazganda ishorani almashtiring: 3x − 5 = 7 → 3x = 7 + 5.",
    demos: [{ type: "balance", examples: [[3, 5, 0, 20], [2, -4, 0, 10], [5, 3, 2, 18]] }],
    ex: [
      ["Yeching: [[(2x + 1)/3]] − [[(x − 2)/2]] = 2", ["6 ga ko‘paytiramiz: 2(2x + 1) − 3(x − 2) = 12", "4x + 2 − 3x + 6 = 12", "x = 4"], "x = 4"],
      ["Otaning yoshi o‘g‘lidan 4 marta katta, 20 yildan keyin 2 marta katta bo‘ladi. O‘g‘il necha yoshda?", ["O‘g‘il x, ota 4x", "4x + 20 = 2(x + 20)", "2x = 20 → x = 10"], "10 yosh"],
      ["Yeching: 3(x − 1) = 3x − 3", ["3x − 3 = 3x − 3 → 0 = 0"], "x — istalgan son"]
    ],
    qz: [
      ["7x − 4 = 3x + 8 → x = ?", ["3", "1", "4", "−3"], "4x = 12."],
      ["[[x/3]] + [[x/6]] = 5 → x = ?", ["10", "15", "30", "5"], "x/2 = 5."],
      ["2(x + 3) = 2x + 5 yechimlari soni?", ["0", "1", "2", "cheksiz"], "6 = 5 — noto‘g‘ri."],
      ["[[3/x]] = [[9/12]] → x = ?", ["4", "36", "3", "27"], "9x = 36."],
      ["Uchta ketma-ket sonning yig‘indisi 60. O‘rtadagisi?", ["20", "19", "21", "30"], "3n = 60."]
    ],
    see: ["1.5.1", "1.5.5", "1.11.1"]
  });
  T(2, {
    id: "kvadrat-tenglamalar", title: "Ikkinchi darajali (kvadrat) tenglamalar va Viyet teoremasi", tag: "Diskriminant va ildizlar munosabati",
    life: "Snaryad trayektoriyasi, yuzni maksimallashtirish, tezlik va vaqt masalalari — kvadrat tenglamaga keladi. Bu DTMda eng ko‘p uchraydigan tenglama turi.",
    explain: "<p><b>Ko‘rinishi:</b> ax² + bx + c = 0, a ≠ 0.</p><span class='fb'>D = b² − 4ac; &nbsp; x₁,₂ = [[(−b ± √D)/(2a)]]</span><table class='oq-t'><tr><th>D</th><th>Ildizlar</th></tr><tr><td>D > 0</td><td>ikkita har xil</td></tr><tr><td>D = 0</td><td>bitta: x = −b/(2a)</td></tr><tr><td>D < 0</td><td>haqiqiy ildiz yo‘q</td></tr></table><p><b>Viyet teoremasi:</b> x₁ + x₂ = −[[b/a]], x₁·x₂ = [[c/a]].</p><p><b>Tezkor usullar:</b></p><ul><li>a + b + c = 0 → x₁ = 1, x₂ = c/a.</li><li>a − b + c = 0 → x₁ = −1, x₂ = −c/a.</li><li>Keltirilgan (a = 1): ko‘paytmasi c, yig‘indisi −b bo‘lgan sonlarni og‘zaki toping.</li></ul><p><b>To‘liqmas:</b> ax² + bx = 0 → x(ax + b) = 0; ax² + c = 0 → x² = −c/a.</p><p><b>Bikvadrat:</b> ax⁴ + bx² + c = 0 → t = x² ≥ 0.</p>",
    rule: "D = b² − 4ac; x₁ + x₂ = −b/a; x₁x₂ = c/a.",
    tip: "Bikvadrat tenglamada t = x² manfiy chiqsa, u ildiz bermaydi.",
    demos: [{ type: "fgraph", kind: "quad" }],
    ex: [
      ["Yeching: 3x² − 10x + 3 = 0", ["D = 100 − 36 = 64", "x = (10 ± 8)/6", "x₁ = 3, x₂ = [[1/3]]"], "3 va [[1/3]]"],
      ["Yeching: x⁴ − 5x² + 4 = 0", ["t = x²: t² − 5t + 4 = 0 → t = 1, 4", "x² = 1 → ±1; x² = 4 → ±2"], "±1, ±2"],
      ["x² − 7x + 5 = 0. (x₁ − x₂)² = ?", ["x₁ + x₂ = 7, x₁x₂ = 5", "(x₁ − x₂)² = 49 − 20 = 29"], "29"]
    ],
    qz: [
      ["x² − 5x + 6 = 0 ildizlari?", ["2 va 3", "−2 va −3", "1 va 6", "−1 va 6"], "2·3 = 6, 2 + 3 = 5."],
      ["2x² + 3x − 5 = 0 ildizlaridan biri?", ["1", "−1", "5", "2"], "a + b + c = 0."],
      ["x² + 4x + c = 0 bitta ildizga ega. c = ?", ["4", "16", "2", "−4"], "16 − 4c = 0."],
      ["x² − 3x − 10 = 0 ildizlari ko‘paytmasi?", ["−10", "10", "3", "−3"], "c/a."],
      ["x² = 3x tenglamaning ildizlari?", ["0 va 3", "3", "±√3", "0"], "x(x − 3) = 0."]
    ],
    see: ["1.5.2", "1.5.3", "1.5.6"]
  });
  T(2, {
    id: "tenglamalar-sistemasi", title: "Tenglamalar sistemasi (chiziqli va yuqori darajali)", tag: "O‘rniga qo‘yish va qo‘shish usullari",
    life: "Ikki noma’lum — ikki tenglama. “Olma va anor narxi”, “ikki sonning yig‘indisi va ayirmasi”, “ikki quvurning unumdorligi” — hammasi sistemalar orqali yechiladi.",
    explain: "<p><b>Chiziqli sistema yechish usullari:</b></p><ol><li><b>O‘rniga qo‘yish:</b> bir tenglamadan noma’lumni ifodalab, ikkinchisiga qo‘yish.</li><li><b>Qo‘shish:</b> koeffitsientlarni tenglashtirib, tenglamalarni qo‘shish yoki ayirish.</li><li><b>Grafik:</b> to‘g‘ri chiziqlar kesishish nuqtasi.</li></ol><p><b>Yechimlar soni:</b> a₁/a₂ ≠ b₁/b₂ — bitta; a₁/a₂ = b₁/b₂ ≠ c₁/c₂ — yo‘q; hammasi teng — cheksiz.</p><p><b>Yuqori darajali sistemalar:</b></p><ul><li>Bitta chiziqli tenglama bo‘lsa — o‘rniga qo‘yish.</li><li>Simmetrik sistema { x + y = S; xy = P } — x, y lar t² − St + P = 0 ning ildizlari.</li><li>x² + y² = (x + y)² − 2xy dan foydalanish.</li><li>Bir jinsli tenglama: y ga bo‘lib, t = x/y.</li></ul>",
    rule: "{ x + y = S; xy = P } → t² − St + P = 0.",
    tip: "Javobni ikkala tenglamaga qo‘yib tekshiring. Yuqori darajali sistemada bir nechta juftlik bo‘lishi mumkin.",
    ex: [
      ["Yeching: { 4x − 3y = 7; 2x + 5y = 23 }", ["Ikkinchisini 2 ga ko‘paytirib ayiramiz: 4x + 10y − (4x − 3y) = 46 − 7", "13y = 39 → y = 3", "2x + 15 = 23 → x = 4"], "(4; 3)"],
      ["Yeching: { x + y = 9; x² + y² = 41 }", ["xy = ((x + y)² − (x² + y²))/2 = (81 − 41)/2 = 20", "t² − 9t + 20 = 0 → t = 4, 5"], "(4; 5) va (5; 4)"],
      ["Daftar va ruchka birga 7000 so‘m. 3 ta daftar va 2 ta ruchka 17 000 so‘m. Daftar narxi?", ["d + r = 7000; 3d + 2r = 17 000", "3d + 2(7000 − d) = 17 000 → d = 3000"], "3000 so‘m"]
    ],
    qz: [
      ["{ x + 2y = 8; x − 2y = 0 } → y = ?", ["2", "4", "1", "3"], "x = 4, y = 2."],
      ["{ x − y = 1; xy = 6 } musbat yechim?", ["(3; 2)", "(2; 3)", "(6; 1)", "(4; 3)"], "3 − 2 = 1, 3·2 = 6."],
      ["{ 3x + 6y = 9; x + 2y = 3 } yechimlar soni?", ["cheksiz", "1", "0", "2"], "Birinchisi ikkinchisining 3 barobari."],
      ["{ x + y = 5; x² − y² = 15 } → x − y = ?", ["3", "10", "5", "1"], "15/5."],
      ["{ 2x + y = 7; x = 2 } → y = ?", ["3", "5", "2", "1"], "4 + y = 7."]
    ],
    see: ["1.6.1", "1.6.2", "1.6.3", "1.6.4"]
  });
  T(2, {
    id: "modul-parametr", title: "Modulli va parametrli tenglamalar", tag: "Murakkab shartli tenglamalar",
    life: "Modul — masofa, parametr — o‘zgaruvchan shart. Bu ikki mavzu matematik fikrlashni eng yuqori darajaga olib chiqadi va DTMda “qiyin” savollar orasida doim bor.",
    explain: "<p><b>Modulli tenglamalar:</b></p><ul><li>|f| = a: a < 0 — yechim yo‘q; a ≥ 0 — f = ±a.</li><li>|f| = g: g ≥ 0 sharti bilan f = ±g.</li><li>|f| = |g| ⇔ f = ±g.</li><li>Bir nechta modul — modul ichidagi ifodalar nollari bo‘yicha oraliqlarga bo‘lish.</li></ul><p><b>Parametrli tenglamalar</b> — koeffitsientida harf (a, k, m) qatnashgan tenglama. Savol odatda: “parametrning qaysi qiymatida yechim yo‘q / bitta / ikkita / musbat?”</p><ul><li>Chiziqli ax = b: a = 0 holatini alohida ko‘ring.</li><li>Kvadrat: D ning ishorasi va Viyet; bosh koeffitsient 0 bo‘lishini tekshiring.</li><li>Grafik usul: f(x) = a tenglama ildizlari soni — y = f(x) grafigi va gorizontal y = a chizig‘i kesishishlari soni.</li></ul>",
    rule: "|f| = g ⇔ g ≥ 0 va f = ±g. Parametrli kvadrat tenglamada a = 0 holatini unutmang.",
    tip: "Grafik usul eng tez: |x| − 2 = a tenglama a > −2 da 2 ta, a = −2 da 1 ta, a < −2 da 0 ta ildizga ega.",
    demos: [{ type: "fgraph", kind: "abs" }],
    ex: [
      ["Yeching: |x − 3| = 2x", ["Shart: 2x ≥ 0 → x ≥ 0", "x − 3 = 2x → x = −3 (shartga mos emas)", "x − 3 = −2x → x = 1 ✓"], "x = 1"],
      ["a ning qanday qiymatida |x| = a − 1 ikki ildizga ega?", ["Ikki ildiz ⇔ a − 1 > 0"], "a > 1"],
      ["k ning qanday qiymatida kx² − 4x + 1 = 0 bitta ildizga ega?", ["k = 0: −4x + 1 = 0 → bitta ildiz ✓", "k ≠ 0: D = 16 − 4k = 0 → k = 4 ✓"], "k = 0 yoki k = 4"]
    ],
    qz: [
      ["|2x − 1| = 7 ildizlari yig‘indisi?", ["1", "7", "4", "−3"], "x = 4 yoki −3."],
      ["|x + 1| = |x − 3| → x = ?", ["1", "−1", "3", "2"], "x + 1 = −(x − 3)."],
      ["(m − 2)x = 3 yechimga ega emas. m = ?", ["2", "3", "0", "−2"], "0·x = 3."],
      ["x² − 2x + a = 0 ildizga ega emas. a ning oralig‘i?", ["a > 1", "a < 1", "a = 1", "a > 0"], "4 − 4a < 0."],
      ["|x| = −x ning yechimi?", ["x ≤ 0", "x = 0", "x < 0", "barcha x"], "|x| = −x faqat x ≤ 0 da."]
    ],
    see: ["1.8.2", "1.5.5", "1.5.6"]
  });
  T(2, {
    id: "tengsizliklar", title: "Tengsizliklar va tengsizliklar sistemasi", tag: "Intervallar usuli va grafik yechimlar",
    life: "Byudjet chegarasi, ruxsat etilgan tezlik, dori dozasi — “dan oshmasin”, “dan kam bo‘lmasin” shartlari tengsizliklar bilan yoziladi.",
    explain: "<p><b>Asosiy qoidalar:</b> ikkala tomonga bir xil son qo‘shish mumkin; musbat songa ko‘paytirishda belgi saqlanadi; <b>manfiy songa ko‘paytirish/bo‘lishda belgi teskarisiga o‘zgaradi</b>.</p><p><b>Chiziqli:</b> ax > b → a > 0: x > b/a; a < 0: x < b/a.</p><p><b>Kvadrat:</b> ax² + bx + c > 0. a > 0 da ildizlar tashqarisida musbat, orasida manfiy (D > 0 bo‘lsa).</p><p><b>Intervallar (oraliqlar) usuli:</b></p><ol><li>f(x) ni ko‘paytuvchilarga ajrating, bir tomonda 0 qolsin.</li><li>Ildizlarni son o‘qiga qo‘ying (maxraj ildizlari — bo‘sh nuqta).</li><li>Eng o‘ng oraliqda “+”, har bir oddiy ildizdan o‘tganda ishora almashadi (juft karralidan — almashmaydi).</li></ol><p><b>Sistema</b> — kesishma (∩), <b>to‘plam</b> — birlashma (∪).</p><p>Modulli: |f| < a ⇔ −a < f < a; |f| > a ⇔ f < −a yoki f > a.</p>",
    rule: "Manfiy songa ko‘paytirish/bo‘lishda belgi o‘zgaradi. Sistema → kesishma.",
    tip: "Kasrli tengsizlikda maxrajga ko‘paytirib yubormang (uning ishorasi noma’lum) — oraliqlar usulini ishlating.",
    demos: [{ type: "signChart" }],
    ex: [
      ["Yeching: 2x² − 5x − 3 ≤ 0", ["Ildizlar: x = 3, x = −[[1/2]]", "a = 2 > 0 → orasida manfiy"], "[−0,5; 3]"],
      ["Yeching: [[(x + 3)/(x − 2)]] ≥ 0", ["Nollar: −3 (to‘la), 2 (bo‘sh)", "Ishoralar: + | − | +"], "(−∞; −3] ∪ (2; +∞)"],
      ["Yeching: { 3x − 1 > 5; x² < 16 }", ["x > 2", "−4 < x < 4", "Kesishma: 2 < x < 4"], "(2; 4)"]
    ],
    qz: [
      ["−3x ≤ 12 → ?", ["x ≥ −4", "x ≤ −4", "x ≥ 4", "x ≤ 4"], "Belgi o‘zgaradi."],
      ["x² − 4x < 0 → ?", ["(0; 4)", "(−∞; 0) ∪ (4; +∞)", "x < 4", "(−4; 0)"], "x(x − 4) < 0."],
      ["x² + 1 > 0 → ?", ["barcha x", "yechim yo‘q", "x > −1", "x > 1"], "Doim musbat."],
      ["[[1/x]] < 0 → ?", ["x < 0", "x > 0", "x ≠ 0", "yechim yo‘q"], "Musbat surat."],
      ["{ x ≥ 1; x < 5 } butun yechimlari soni?", ["4", "5", "3", "6"], "1, 2, 3, 4."]
    ],
    see: ["1.7.1", "1.7.2", "1.7.3", "1.8.3"]
  });

  // ===================== 3. FUNKSIYALAR VA PROGRESSIYALAR =====================
  T(3, {
    id: "ketma-ketliklar", title: "Ketma-ketliklar va qonuniyatlar", tag: "Mantiqiy va matematik algoritmlar",
    life: "IQ testlari, olimpiada va DTMning mantiqiy savollari — “keyingi son qaysi?” Qonuniyatni topish — algoritmik fikrlash va dasturlashning ham asosi.",
    explain: "<p><b>Ketma-ketlik</b> — tartiblangan sonlar qatori a₁, a₂, a₃, … Uni <b>formula</b> (aₙ = 2n + 1) yoki <b>rekurrent</b> qoida (aₙ₊₁ = aₙ + aₙ₋₁) bilan berish mumkin.</p><p><b>Qonuniyatni topish rejasi:</b></p><ol><li><b>Ayirmalarni</b> tekshiring: 3, 7, 11, 15 → doimiy 4 (arifmetik).</li><li><b>Nisbatlarni</b> tekshiring: 2, 6, 18, 54 → ×3 (geometrik).</li><li><b>Ikkinchi ayirmalar:</b> 1, 4, 9, 16 → ayirmalar 3, 5, 7 → ikkinchi ayirmalar 2 (kvadratlar, aₙ = n²).</li><li><b>Mashhur ketma-ketliklar:</b> kvadratlar 1, 4, 9, 16; kublar 1, 8, 27, 64; tub sonlar 2, 3, 5, 7, 11; Fibonachchi 1, 1, 2, 3, 5, 8; uchburchak sonlar 1, 3, 6, 10, 15 (n(n + 1)/2).</li><li><b>Aralash</b> (ikki qator navbatma-navbat): 1, 10, 2, 20, 3, 30, …</li></ol>",
    rule: "Avval ayirmalarni, keyin nisbatlarni, so‘ng ikkinchi ayirmalarni tekshiring.",
    tip: "Ba’zi qatorlarda toq va juft o‘rindagi hadlar alohida qonuniyatga bo‘ysunadi.",
    demos: [{ type: "progression", kind: "arith", title: "Arifmetik ketma-ketlik: a₁, d va n ni o‘zgartiring" }],
    ex: [
      ["2, 5, 10, 17, 26, … keyingi son?", ["Ayirmalar: 3, 5, 7, 9 → keyingi 11", "26 + 11 = 37 (aₙ = n² + 1)"], "37"],
      ["1, 2, 6, 24, 120, … keyingi son?", ["Nisbatlar: ×2, ×3, ×4, ×5 → ×6", "120·6 = 720 (n!)"], "720"],
      ["aₙ = 3n − 2 ketma-ketlikning 15-hadi?", ["a₁₅ = 45 − 2"], "43"]
    ],
    qz: [
      ["1, 4, 9, 16, 25, … keyingisi?", ["36", "30", "49", "35"], "6²."],
      ["3, 6, 12, 24, … keyingisi?", ["48", "36", "30", "27"], "×2."],
      ["1, 3, 6, 10, 15, … keyingisi?", ["21", "20", "25", "18"], "+6."],
      ["2, 3, 5, 8, 13, … keyingisi?", ["21", "18", "20", "26"], "8 + 13."],
      ["1, 8, 27, 64, … keyingisi?", ["125", "100", "81", "216"], "5³."]
    ],
    see: ["1.10.1", "1.10.2"]
  });
  T(3, {
    id: "progressiyalar", title: "Arifmetik va geometrik progressiya", tag: "Hadlar va yig‘indilar formulalari",
    life: "Oylik jamg‘arma (arifmetik), bank foizi va bakteriyalar ko‘payishi (geometrik), shaxmat taxtasidagi don afsonasi — progressiyalar kundalik moliya va tabiatda bor.",
    explain: "<table class='oq-t'><tr><th></th><th>Arifmetik</th><th>Geometrik</th></tr><tr><td>Qoida</td><td>aₙ₊₁ = aₙ + d</td><td>bₙ₊₁ = bₙ·q</td></tr><tr><td>n-had</td><td>aₙ = a₁ + (n − 1)d</td><td>bₙ = b₁qⁿ⁻¹</td></tr><tr><td>Yig‘indi</td><td>Sₙ = (a₁ + aₙ)n/2</td><td>Sₙ = b₁(qⁿ − 1)/(q − 1)</td></tr><tr><td>Xossa</td><td>aₙ = (aₙ₋₁ + aₙ₊₁)/2</td><td>bₙ² = bₙ₋₁·bₙ₊₁</td></tr><tr><td>Simmetriya</td><td>aₘ + aₙ = aₚ + a_q</td><td>bₘ·bₙ = bₚ·b_q</td></tr></table><p>(m + n = p + q bo‘lganda.)</p><p><b>Cheksiz kamayuvchi geometrik progressiya</b> (|q| < 1): S = [[b₁/(1 − q)]].</p><p><b>Foydali yig‘indilar:</b> 1 + 2 + … + n = n(n + 1)/2; 1 + 3 + … + (2n − 1) = n²; 1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1.</p>",
    rule: "aₙ = a₁ + (n − 1)d; bₙ = b₁qⁿ⁻¹. Cheksiz: S = b₁/(1 − q).",
    tip: "Hadlar soni: (oxirgi − birinchi)/d + 1.",
    demos: [{ type: "progression", kind: "geo" }],
    ex: [
      ["Arifmetik progressiyada a₁ = 5, d = 4. Dastlabki 20 ta had yig‘indisi?", ["a₂₀ = 5 + 19·4 = 81", "S = (5 + 81)·20/2 = 860"], "860"],
      ["Geometrik progressiyada b₁ = 3, q = 2. S₆ = ?", ["S₆ = 3(2⁶ − 1)/(2 − 1) = 3·63"], "189"],
      ["0,(6) ni cheksiz geometrik progressiya yig‘indisi sifatida toping.", ["0,6 + 0,06 + … ; b₁ = 0,6, q = 0,1", "S = 0,6/0,9 = [[2/3]]"], "[[2/3]]"]
    ],
    qz: [
      ["5, 9, 13, … ning 10-hadi?", ["41", "45", "37", "49"], "5 + 9·4."],
      ["1 + 2 + … + 50 = ?", ["1275", "2550", "1250", "1300"], "50·51/2."],
      ["b₁ = 2, q = 3. b₄ = ?", ["54", "18", "162", "24"], "2·27."],
      ["4 + 2 + 1 + … = ?", ["8", "7", "6", "∞"], "4/(1 − 1/2)."],
      ["Arifmetik progressiyada a₃ + a₇ = 24. a₅ = ?", ["12", "24", "6", "8"], "2a₅ = 24."]
    ],
    see: ["1.10.1", "1.10.2"]
  });
  T(3, {
    id: "funksiya-xossalari", title: "Funksiya tushunchasi va xossalari", tag: "Aniqlanish va qiymatlar sohasi",
    life: "Funksiya — bog‘liqlik qonuni: harorat vaqtga, narx miqdorga, yuz tomonga bog‘liq. Funksiya xossalarini bilish grafikni chizmasdan uning shaklini tasavvur qilishga yordam beradi.",
    explain: "<p><b>Ta’rif:</b> X to‘plamdagi har bir x ga Y dagi yagona y = f(x) mos qo‘yilsa, f — funksiya.</p><p><b>Aniqlanish sohasi D(f) — cheklovlar:</b></p><ul><li>maxraj ≠ 0;</li><li>juft darajali ildiz ostida ≥ 0;</li><li>logarifm ostida > 0, asos > 0, ≠ 1;</li><li>tg x da x ≠ π/2 + πn.</li></ul><p><b>Qiymatlar sohasi E(f):</b> x² ≥ 0, √x ≥ 0, aˣ > 0, −1 ≤ sin x ≤ 1. Masalan, y = x² − 4x + 7 = (x − 2)² + 3 → E = [3; +∞).</p><p><b>Xossalar:</b> juft (f(−x) = f(x)) / toq (f(−x) = −f(x)); o‘suvchi / kamayuvchi; nollari (f(x) = 0); ishora saqlash oraliqlari; davriylik; eng katta va eng kichik qiymat.</p><p><b>Grafik almashtirishlar:</b> f(x) + a — yuqoriga; f(x − a) — o‘ngga; −f(x) — Ox ga aks; f(−x) — Oy ga aks; k·f(x) — cho‘zish.</p>",
    rule: "D(f): maxraj ≠ 0, √ ostida ≥ 0, log ostida > 0.",
    tip: "Funksiya juft yoki toq bo‘lishi uchun avval D(f) simmetrik bo‘lishi shart.",
    demos: [{ type: "fgraph", kind: "abs", title: "Grafikni surish: y = |x − m| + n" }],
    ex: [
      ["y = [[√(4 − x)/(x + 1)]] ning aniqlanish sohasi?", ["4 − x ≥ 0 → x ≤ 4", "x + 1 ≠ 0 → x ≠ −1"], "(−∞; −1) ∪ (−1; 4]"],
      ["y = −x² + 6x − 5 ning qiymatlar sohasi?", ["y = −(x − 3)² + 4", "Eng katta qiymat 4"], "(−∞; 4]"],
      ["f(x) = x⁴ − 3x² juft yoki toqmi?", ["f(−x) = (−x)⁴ − 3(−x)² = x⁴ − 3x² = f(x)"], "juft"]
    ],
    qz: [
      ["y = √(x − 5) ning aniqlanish sohasi?", ["[5; +∞)", "(5; +∞)", "(−∞; 5]", "R"], "x − 5 ≥ 0."],
      ["y = 2 + sin x qiymatlar sohasi?", ["[1; 3]", "[−1; 1]", "[2; 3]", "[0; 2]"], "sin x ∈ [−1; 1]."],
      ["Qaysi funksiya toq?", ["y = x³ − x", "y = x² + 1", "y = |x|", "y = x + 1"], "f(−x) = −f(x)."],
      ["f(x) = 2x − 1. f(f(1)) = ?", ["1", "3", "0", "2"], "f(1) = 1, f(1) = 1."],
      ["y = x² grafigini 2 birlik chapga surilsa?", ["y = (x + 2)²", "y = (x − 2)²", "y = x² + 2", "y = x² − 2"], "f(x + 2)."]
    ],
    see: ["1.12.1", "1.12.4", "1.12.5"]
  });
  T(3, {
    id: "chiziqli-kvadrat-funksiya", title: "Chiziqli va kvadrat funksiyalar", tag: "Grafiklar chizish va koordinatalar",
    life: "Taksi tarifi (chiziqli), to‘pning uchishi va ko‘prik arkasi (kvadrat) — eng ko‘p uchraydigan ikki funksiya. Ularni grafik bilan ko‘ra bilish masalalarni ko‘z bilan yechish imkonini beradi.",
    explain: "<p><b>Chiziqli funksiya y = kx + b:</b> grafik — to‘g‘ri chiziq. k — qiyalik (tg α), b — Oy bilan kesishish. k > 0 o‘sadi, k < 0 kamayadi. Parallel: k₁ = k₂; perpendikulyar: k₁k₂ = −1. Ikki nuqtadan: k = [[(y₂ − y₁)/(x₂ − x₁)]].</p><p><b>Kvadrat funksiya y = ax² + bx + c:</b> grafik — parabola.</p><ul><li>a > 0 — shoxlar yuqoriga (min), a < 0 — pastga (max).</li><li>Uchi: x₀ = −[[b/(2a)]], y₀ = f(x₀).</li><li>Oy bilan kesishish: (0; c). Ox bilan — ildizlar (D ga qarab).</li><li>Simmetriya o‘qi x = x₀.</li></ul><p><b>Grafik chizish rejasi:</b> yo‘nalish → uchi → Oy bilan kesishish → Ox bilan kesishish → simmetrik nuqtalar.</p><p><b>Teskari proporsionallik</b> y = k/x — giperbola.</p>",
    rule: "Parabola uchi x₀ = −b/(2a). Chiziq qiyaligi k = Δy/Δx.",
    tip: "c — parabola Oy ni kesadigan nuqta; a va b ishorasi bir xil bo‘lsa, uchi chapda (x₀ < 0).",
    demos: [{ type: "fgraph", kind: "linear" }, { type: "fgraph", kind: "quad" }],
    ex: [
      ["A(−1; 1) va B(2; 7) dan o‘tuvchi chiziq tenglamasi?", ["k = (7 − 1)/(2 + 1) = 2", "1 = −2 + b → b = 3"], "y = 2x + 3"],
      ["y = x² − 6x + 8 parabolaning uchi va Ox bilan kesishish nuqtalari?", ["x₀ = 3, y₀ = 9 − 18 + 8 = −1", "x² − 6x + 8 = 0 → x = 2, 4"], "Uchi (3; −1); (2; 0) va (4; 0)"],
      ["y = 2x + 1 va y = x² − 2 kesishish nuqtalari?", ["x² − 2 = 2x + 1 → x² − 2x − 3 = 0", "x = 3 → y = 7; x = −1 → y = −1"], "(3; 7) va (−1; −1)"]
    ],
    qz: [
      ["y = −3x + 2 qanday?", ["kamayuvchi", "o‘suvchi", "o‘zgarmas", "juft"], "k < 0."],
      ["y = x² + 4x + 1 uchining x koordinatasi?", ["−2", "2", "−4", "4"], "−4/2."],
      ["y = 2x − 3 ga parallel chiziq?", ["y = 2x + 5", "y = −2x", "y = [[1/2]]x", "y = 3x − 2"], "k bir xil."],
      ["y = −x² + 9 ning eng katta qiymati?", ["9", "0", "−9", "3"], "x = 0 da."],
      ["y = (x − 1)² + 2 parabola Ox ni nechta nuqtada kesadi?", ["0", "1", "2", "4"], "Eng kichik qiymat 2 > 0."]
    ],
    see: ["1.12.2", "1.12.3"]
  });
  T(3, {
    id: "korsatkichli-logarifmik", title: "Ko‘rsatkichli va logarifmik funksiyalar", tag: "Logarifm xossalari va tenglamalari",
    life: "Aholining o‘sishi, bank foizlari, radioaktiv yemirilish (ko‘rsatkichli) va zilzila kuchi, tovush balandligi, pH (logarifmik) — tabiatning eng muhim qonunlari.",
    explain: "<p><b>y = aˣ</b> (a > 0, a ≠ 1): D = R, E = (0; +∞), (0; 1) dan o‘tadi; a > 1 o‘sadi, 0 < a < 1 kamayadi.</p><p><b>y = logₐx</b>: D = (0; +∞), E = R, (1; 0) dan o‘tadi; aˣ ga teskari.</p><p><b>Logarifm ta’rifi:</b> logₐb = c ⇔ aᶜ = b. Asosiy ayniyat: a^(logₐb) = b.</p><p><b>Xossalar:</b> logₐ(xy) = logₐx + logₐy; logₐ(x/y) = logₐx − logₐy; logₐxⁿ = n logₐx; logₐb = log_c b / log_c a.</p><p><b>Tenglamalar:</b> aᶠ = aᵍ ⇔ f = g; logₐf = logₐg ⇔ f = g > 0. Yangi o‘zgaruvchi: t = aˣ > 0 yoki t = logₐx.</p><p><b>Tengsizliklar:</b> asos > 1 — belgi saqlanadi, 0 < asos < 1 — o‘zgaradi. Logarifmda ATS (ostidagi > 0) majburiy.</p>",
    rule: "logₐb = c ⇔ aᶜ = b. Asos < 1 bo‘lsa, tengsizlik belgisi o‘zgaradi.",
    tip: "Logarifmik tenglamaning javobini doim ATSga tekshiring — begona ildizlar ko‘p chiqadi.",
    demos: [{ type: "fgraph", kind: "log", both: true }],
    ex: [
      ["Yeching: 3^(2x − 1) = 27", ["3^(2x − 1) = 3³ → 2x − 1 = 3"], "x = 2"],
      ["Hisoblang: log₂20 − log₂5 + log₃[[1/9]]", ["log₂(20/5) = log₂4 = 2", "log₃(1/9) = −2", "2 − 2 = 0"], "0"],
      ["Yeching: log₃(x − 2) + log₃x = 1", ["ATS: x > 2", "x(x − 2) = 3 → x² − 2x − 3 = 0", "x = 3 (x = −1 ATSga kirmaydi)"], "x = 3"]
    ],
    qz: [
      ["log₄64 = ?", ["3", "16", "4", "2"], "4³ = 64."],
      ["2ˣ = 32 → x = ?", ["5", "16", "6", "4"], "2⁵."],
      ["lg 2 + lg 50 = ?", ["2", "52", "1", "lg 52"], "lg 100."],
      ["(0,5)ˣ > 4 → ?", ["x < −2", "x > −2", "x > 2", "x < 2"], "Asos < 1."],
      ["y = log₂(x + 3) aniqlanish sohasi?", ["(−3; +∞)", "[−3; +∞)", "(3; +∞)", "R"], "x + 3 > 0."]
    ],
    see: ["1.13.1", "1.13.2", "1.14.1", "1.14.2", "1.14.3"]
  });
  T(3, {
    id: "trigonometriya", title: "Trigonometriya (aylana va asosiy ayniyatlar)", tag: "Sinus, kosinus, tangens, kotangens",
    life: "Trigonometriya — burchaklar va masofalar fani: navigatsiya, astronomiya, qurilish, tovush va yorug‘lik to‘lqinlari. Uning poydevori — birlik aylana va bir nechta ayniyat.",
    explain: "<p><b>Radian:</b> 180° = π. α(rad) = α° · π/180.</p><p><b>Birlik aylanada:</b> cos α = x, sin α = y, tg α = sin/cos, ctg α = cos/sin.</p><table class='oq-t'><tr><th></th><th>0°</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th></tr><tr><td>sin</td><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr><tr><td>cos</td><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr><tr><td>tg</td><td>0</td><td>√3/3</td><td>1</td><td>√3</td><td>—</td></tr></table><p><b>Ayniyatlar:</b> sin²α + cos²α = 1; tg α·ctg α = 1; 1 + tg²α = 1/cos²α.</p><p><b>Keltirish formulalari:</b> 90°/270° — nom almashadi, 180°/360° — saqlanadi; ishora — dastlabki funksiyaning choragidagi ishorasi.</p><p><b>Qo‘shish va ikkilangan burchak:</b> sin(α ± β) = sin α cos β ± cos α sin β; cos(α ± β) = cos α cos β ∓ sin α sin β; sin 2α = 2 sin α cos α; cos 2α = cos²α − sin²α.</p>",
    rule: "sin²α + cos²α = 1; sin 2α = 2sin α cos α; cos 2α = 1 − 2sin²α.",
    tip: "Ishorani chorak bo‘yicha aniqlang: II chorakda faqat sin musbat, III da tg, IV da cos.",
    demos: [{ type: "unitCircle" }],
    ex: [
      ["sin α = [[4/5]], α ∈ (90°; 180°). cos α, tg α?", ["cos α = −√(1 − 16/25) = −[[3/5]] (II chorak)", "tg α = −[[4/3]]"], "cos α = −0,6; tg α = −[[4/3]]"],
      ["Hisoblang: sin 210° + cos 300°", ["sin 210° = −sin 30° = −[[1/2]]", "cos 300° = cos 60° = [[1/2]]"], "0"],
      ["Soddalashtiring: [[(1 − cos 2α)/sin 2α]]", ["2sin²α / (2 sin α cos α)"], "tg α"]
    ],
    qz: [
      ["cos 60° + sin 30° = ?", ["1", "√3", "[[1/2]]", "2"], "½ + ½."],
      ["tg 45° · ctg 45° = ?", ["1", "0", "2", "√2"], "Doim 1."],
      ["[[3π/4]] necha gradus?", ["135°", "120°", "150°", "270°"], "3·45."],
      ["sin 150° = ?", ["[[1/2]]", "−[[1/2]]", "[[√3/2]]", "−[[√3/2]]"], "sin(180° − 30°)."],
      ["2 sin 15° cos 15° = ?", ["[[1/2]]", "1", "[[√3/2]]", "[[√2/2]]"], "sin 30°."]
    ],
    see: ["2.1.1", "2.1.2", "2.1.3", "2.1.4", "2.1.5"]
  });
  T(3, {
    id: "trig-tenglamalar", title: "Trigonometrik tenglamalar va tengsizliklar", tag: "Arksinus, arkkosinus va davrlar",
    life: "Davriy jarayonlarda (tebranish, o‘zgaruvchan tok, mavsumlar) “qachon?” degan savolga trigonometrik tenglama javob beradi. Javob — cheksiz ko‘p, davriy takrorlanuvchi sonlar.",
    explain: "<p><b>Teskari funksiyalar:</b> arcsin a ∈ [−π/2; π/2], arccos a ∈ [0; π], arctg a ∈ (−π/2; π/2). arccos(−a) = π − arccos a.</p><p><b>Eng oddiy tenglamalar:</b></p><span class='fb'>sin x = a: x = (−1)ⁿ arcsin a + πn</span><span class='fb'>cos x = a: x = ±arccos a + 2πn</span><span class='fb'>tg x = a: x = arctg a + πn</span><p>|a| > 1 bo‘lsa sin x = a va cos x = a yechimga ega emas.</p><p><b>Murakkab tenglamalar:</b> kvadrat tenglamaga keltirish (t = sin x, |t| ≤ 1); ko‘paytuvchilarga ajratish; bir jinsli (cos x ga bo‘lish); formulalar bilan soddalashtirish.</p><p><b>Tengsizliklar:</b> birlik aylanada yoyni belgilab, davr qo‘shamiz. sin x > ½ → π/6 + 2πn < x < 5π/6 + 2πn.</p>",
    rule: "cos x = a → ±arccos a + 2πn; sin x = a → (−1)ⁿarcsin a + πn; tg x = a → arctg a + πn.",
    tip: "sin x = 0, 1, −1 va cos x = 0, 1, −1 uchun xususiy formulalarni ishlating — ular sodda.",
    demos: [{ type: "unitCircle" }, { type: "fgraph", kind: "sin" }],
    ex: [
      ["Yeching: 2 sin x − √3 = 0", ["sin x = [[√3/2]]", "x = (−1)ⁿ[[π/3]] + πn"], "x = (−1)ⁿ[[π/3]] + πn"],
      ["Yeching: cos 2x + 3 sin x − 2 = 0", ["1 − 2sin²x + 3 sin x − 2 = 0 → 2t² − 3t + 1 = 0 (t = sin x)", "t = 1 → x = π/2 + 2πn; t = [[1/2]] → x = (−1)ⁿπ/6 + πn"], "x = [[π/2]] + 2πn; x = (−1)ⁿ[[π/6]] + πn"],
      ["Yeching: tg x ≥ 1", ["tg x = 1 da x = π/4; tg ning davri π, x ≠ π/2 + πn"], "[[π/4]] + πn ≤ x < [[π/2]] + πn"]
    ],
    qz: [
      ["cos x = 1 → x = ?", ["2πn", "πn", "[[π/2]] + πn", "π + 2πn"], "Xususiy holat."],
      ["arcsin [[1/2]] + arccos [[1/2]] = ?", ["[[π/2]]", "π", "[[π/3]]", "0"], "Doim π/2."],
      ["tg x = −1 → x = ?", ["−[[π/4]] + πn", "[[π/4]] + πn", "[[3π/4]] + 2πn", "πn"], "arctg(−1) = −π/4."],
      ["sin x = 1,5 yechimlari soni?", ["0", "1", "2", "cheksiz"], "|1,5| > 1."],
      ["cos x < 0 → ?", ["[[π/2]] + 2πn < x < [[3π/2]] + 2πn", "0 < x < π", "πn < x < π/2 + πn", "−π/2 < x < π/2"], "Chap yarim aylana."]
    ],
    see: ["2.1.9", "2.1.10", "2.1.11"]
  });

  // ===================== 4. MATEMATIK ANALIZ =====================
  T(4, {
    id: "hosila", title: "Hosila va uning qo‘llanilishi", tag: "Hosila olish qoidalari va xossalari",
    life: "Hosila — o‘zgarish tezligi. U fizikada tezlik va tezlanishni, iqtisodda chegaraviy xarajatni, biologiyada o‘sish sur’atini o‘lchaydi. Optimallashtirishning asosiy quroli.",
    explain: "<p><b>Hosilalar jadvali:</b> (C)′ = 0; (xⁿ)′ = nxⁿ⁻¹; (√x)′ = [[1/(2√x)]]; (1/x)′ = −1/x²; (sin x)′ = cos x; (cos x)′ = −sin x; (tg x)′ = 1/cos²x; (eˣ)′ = eˣ; (aˣ)′ = aˣ ln a; (ln x)′ = 1/x.</p><p><b>Qoidalar:</b></p><span class='fb'>(u ± v)′ = u′ ± v′; &nbsp; (Cu)′ = Cu′</span><span class='fb'>(uv)′ = u′v + uv′; &nbsp; (u/v)′ = [[(u′v − uv′)/v²]]</span><span class='fb'>(f(g(x)))′ = f′(g(x))·g′(x)</span><p><b>Qo‘llanilishi:</b> o‘sish/kamayish oraliqlari, ekstremumlar, eng katta va eng kichik qiymatlar, urinma tenglamasi, tezlik va tezlanish.</p>",
    rule: "(xⁿ)′ = nxⁿ⁻¹; (uv)′ = u′v + uv′; (f(g))′ = f′(g)·g′.",
    tip: "Murakkab funksiyada ichki hosilaga ko‘paytirishni unutmang: (sin 3x)′ = 3cos 3x.",
    demos: [{ type: "tangent" }],
    ex: [
      ["f(x) = 2x³ − 5x² + 4x − 7. f′(1) = ?", ["f′(x) = 6x² − 10x + 4", "f′(1) = 0"], "0"],
      ["f(x) = (x² + 1)·sin x. f′(x) = ?", ["2x·sin x + (x² + 1)·cos x"], "2x sin x + (x² + 1)cos x"],
      ["f(x) = √(3x + 1). f′(1) = ?", ["f′ = 3/(2√(3x + 1))", "f′(1) = 3/4"], "[[3/4]]"]
    ],
    qz: [
      ["(x⁴ − 3x)′ = ?", ["4x³ − 3", "x³ − 3", "4x³", "4x − 3"], "nxⁿ⁻¹."],
      ["(cos 2x)′ = ?", ["−2sin 2x", "2sin 2x", "−sin 2x", "2cos x"], "Ichki hosila 2."],
      ["([[1/x]])′ x = 2 da?", ["−[[1/4]]", "[[1/4]]", "−[[1/2]]", "[[1/2]]"], "−1/x²."],
      ["(x·eˣ)′ = ?", ["eˣ(x + 1)", "eˣ", "xeˣ", "eˣ + x"], "u′v + uv′."],
      ["((2x − 1)⁵)′ = ?", ["10(2x − 1)⁴", "5(2x − 1)⁴", "10(2x − 1)⁵", "2(2x − 1)⁴"], "5·2."]
    ],
    see: ["2.2.1", "2.2.2", "2.2.3", "2.2.4"]
  });
  T(4, {
    id: "hosila-manosi", title: "Hosilaning fizik va geometrik ma’nosi", tag: "Urinma tenglamasi, tezlik va tezlanish",
    life: "Avtomobil spidometri — yo‘l funksiyasining hosilasi; yo‘lning qiyaligi — balandlik funksiyasining hosilasi. Hosila egri chiziqni nuqta atrofida to‘g‘ri chiziq bilan almashtiradi.",
    explain: "<p><b>Geometrik ma’no:</b> f′(x₀) — grafikka x₀ nuqtada o‘tkazilgan urinmaning burchak koeffitsienti:</p><span class='fb'>k = f′(x₀) = tg α</span><p><b>Urinma tenglamasi:</b></p><span class='fb'>y = f(x₀) + f′(x₀)(x − x₀)</span><p>Urinma berilgan chiziqqa parallel → f′(x₀) = k; Ox ga parallel → f′(x₀) = 0.</p><p><b>Fizik ma’no:</b> S(t) — yo‘l bo‘lsa:</p><span class='fb'>v(t) = S′(t); &nbsp; a(t) = v′(t) = S″(t)</span><p>“To‘xtadi” → v = 0; “tezlanish nol” → a = 0.</p><p>Umuman: f′(x) — f ning x bo‘yicha o‘zgarish tezligi (masalan, kimyoviy reaksiya tezligi, aholining o‘sish sur’ati).</p>",
    rule: "Urinma: y = f(x₀) + f′(x₀)(x − x₀). Tezlik v = S′, tezlanish a = v′.",
    tip: "Urinma tenglamasida f(x₀) va f′(x₀) — ikki xil son, ikkalasini ham hisoblang.",
    demos: [{ type: "tangent" }],
    ex: [
      ["y = x² − 4x grafigiga x₀ = 3 da urinma tenglamasi?", ["f(3) = −3, f′(x) = 2x − 4, f′(3) = 2", "y = −3 + 2(x − 3) = 2x − 9"], "y = 2x − 9"],
      ["S(t) = t³ − 6t² + 9t. Qachon tezlik nolga teng?", ["v = 3t² − 12t + 9 = 3(t − 1)(t − 3)", "t = 1 va t = 3"], "1 s va 3 s"],
      ["y = x³ grafigining qaysi nuqtalarida urinma y = 12x + 1 ga parallel?", ["3x² = 12 → x = ±2", "y = ±8"], "(2; 8) va (−2; −8)"]
    ],
    qz: [
      ["f′(x₀) = 1. Urinma Ox bilan qanday burchak hosil qiladi?", ["45°", "30°", "60°", "90°"], "tg α = 1."],
      ["S(t) = 4t² + t. v(2) = ?", ["17", "18", "16", "9"], "8t + 1."],
      ["v(t) = t² − 3t. a(1) = ?", ["−1", "1", "−2", "2"], "2t − 3."],
      ["y = x² ga x₀ = 0 dagi urinma?", ["y = 0", "y = x", "y = 2x", "x = 0"], "f′(0) = 0."],
      ["y = sin x ga x₀ = 0 dagi urinma?", ["y = x", "y = 0", "y = 1", "y = −x"], "f(0) = 0, f′(0) = 1."]
    ],
    see: ["2.2.8", "2.2.9", "2.2.10"]
  });
  T(4, {
    id: "osish-kamayish", title: "Funksiyaning o‘sish va kamayish oraliqlari", tag: "Ekstremum nuqtalar (max, min)",
    life: "Biznesda: “narxni qayergacha oshirsak, foyda o‘sadi?”, muhandislikda: “qaysi o‘lchamda material eng kam ketadi?” — bu savollarga hosila va ekstremumlar javob beradi.",
    explain: "<p><b>Monotonlik:</b> f′(x) > 0 — o‘sadi; f′(x) < 0 — kamayadi.</p><p><b>Ekstremumlar:</b> f′ ishorasi “+” → “−” — maksimum; “−” → “+” — minimum. f′(x₀) = 0 — zaruriy, lekin yetarli shart emas (y = x³).</p><p><b>Tekshirish rejasi:</b></p><ol><li>D(f) ni toping.</li><li>f′(x) ni hisoblang va kritik nuqtalarni toping (f′ = 0 yoki mavjud emas).</li><li>Oraliqlar usuli bilan f′ ishorasini aniqlang.</li><li>Xulosa: o‘sish/kamayish oraliqlari va ekstremumlar.</li></ol><p><b>Kesmada eng katta va eng kichik qiymat:</b> kritik nuqtalar va kesma uchlaridagi qiymatlarni solishtiramiz.</p><p><b>Optimallashtirish masalalari:</b> kattalikni bitta o‘zgaruvchi funksiyasi sifatida yozib, uning ekstremumini topamiz.</p>",
    rule: "f′: + → − — max; − → + — min. Kesmada: uchlar + kritik nuqtalar.",
    tip: "Kesmadan tashqaridagi kritik nuqtalarni hisobga olmang.",
    demos: [{ type: "tangent", fn: "x³ − 3x" }],
    ex: [
      ["f(x) = x³ − 3x² − 9x + 1 ning ekstremumlari?", ["f′ = 3x² − 6x − 9 = 3(x − 3)(x + 1)", "x = −1: max, f(−1) = −1 − 3 + 9 + 1 = 6", "x = 3: min, f(3) = 27 − 27 − 27 + 1 = −26"], "max 6 (x = −1), min −26 (x = 3)"],
      ["f(x) = x² − 6x ning [0; 5] dagi eng katta va eng kichik qiymati?", ["f′ = 0 → x = 3", "f(0) = 0, f(3) = −9, f(5) = −5"], "max 0, min −9"],
      ["Perimetri 20 sm bo‘lgan to‘g‘ri to‘rtburchaklar ichida eng katta yuzlisi?", ["S(x) = x(10 − x), S′ = 10 − 2x = 0 → x = 5"], "kvadrat 5 × 5, S = 25 sm²"]
    ],
    qz: [
      ["f(x) = x² − 8x o‘sish oralig‘i?", ["[4; +∞)", "(−∞; 4]", "[8; +∞)", "R"], "2x − 8 ≥ 0."],
      ["f(x) = −x² + 2x + 3 maksimum qiymati?", ["4", "3", "1", "5"], "x = 1 da 4."],
      ["f(x) = x³ − 12x maksimum nuqtasi?", ["−2", "2", "0", "12"], "+ → − x = −2 da."],
      ["f(x) = 3x − x³ ning [−2; 0] dagi eng kichik qiymati?", ["−2", "2", "0", "−4"], "f(−1) = −2, f(−2) = 2, f(0) = 0."],
      ["f′(x) = x²(x − 2) bo‘lsa, ekstremum nuqtalar soni?", ["1", "2", "0", "3"], "x = 0 da ishora o‘zgarmaydi, x = 2 — min."]
    ],
    see: ["2.2.5", "2.2.6", "2.2.7"]
  });
  T(4, {
    id: "boshlangich-funksiya", title: "Boshlang‘ich funksiya (aniqmas integral)", tag: "Integral jadvali va integrallash",
    life: "Tezlik ma’lum — yo‘lni toping; o‘sish sur’ati ma’lum — miqdorni toping. Integral — hosilaning teskarisi, “qayta tiklash” amali.",
    explain: "<p>F′(x) = f(x) bo‘lsa, F — f ning boshlang‘ich funksiyasi. Umumiy ko‘rinish: F(x) + C.</p><span class='fb'>∫ f(x) dx = F(x) + C</span><table class='oq-t'><tr><th>f(x)</th><th>∫f dx</th></tr><tr><td>xⁿ (n ≠ −1)</td><td>xⁿ⁺¹/(n + 1) + C</td></tr><tr><td>1/x</td><td>ln|x| + C</td></tr><tr><td>eˣ</td><td>eˣ + C</td></tr><tr><td>sin x</td><td>−cos x + C</td></tr><tr><td>cos x</td><td>sin x + C</td></tr><tr><td>1/cos²x</td><td>tg x + C</td></tr></table><p><b>Qoidalar:</b> ∫(f ± g) = ∫f ± ∫g; ∫k f = k∫f; ∫f(kx + b)dx = (1/k)F(kx + b) + C.</p><p><b>Nuqtadan o‘tish sharti:</b> F(x₀) = y₀ dan C topiladi.</p>",
    rule: "∫xⁿdx = xⁿ⁺¹/(n + 1) + C; ∫f(kx + b)dx = F(kx + b)/k + C.",
    tip: "Javobni tekshirish oson — uning hosilasini oling.",
    demos: [{ type: "integral" }],
    ex: [
      ["∫(4x³ − 6x + 2)dx = ?", ["x⁴ − 3x² + 2x + C"], "x⁴ − 3x² + 2x + C"],
      ["f(x) = 2x + 3 ning (1; 6) dan o‘tuvchi boshlang‘ichi?", ["F = x² + 3x + C", "1 + 3 + C = 6 → C = 2"], "F(x) = x² + 3x + 2"],
      ["∫ cos(2x + 1) dx = ?", ["k = 2 → [[1/2]] sin(2x + 1) + C"], "[[1/2]]sin(2x + 1) + C"]
    ],
    qz: [
      ["∫ 3x² dx = ?", ["x³ + C", "6x + C", "3x³ + C", "x² + C"], "3·x³/3."],
      ["∫ sin x dx = ?", ["−cos x + C", "cos x + C", "sin x + C", "−sin x + C"], "(−cos x)′ = sin x."],
      ["∫ e^(2x) dx = ?", ["[[1/2]]e^(2x) + C", "2e^(2x) + C", "e^(2x) + C", "e^x + C"], "k = 2."],
      ["∫ [[1/x]] dx = ?", ["ln|x| + C", "−[[1/x²]] + C", "x + C", "1 + C"], "Jadval."],
      ["F(x) = x³ + C, F(1) = 5. C = ?", ["4", "5", "6", "1"], "1 + C = 5."]
    ],
    see: ["2.2.11", "2.2.12"]
  });
  T(4, {
    id: "aniq-integral", title: "Aniq integral va yuzalarni hisoblash", tag: "Nyuton–Leybnits formulasi",
    life: "Egri chiziq bilan chegaralangan yer maydoni, o‘zgaruvchan tezlik bilan bosib o‘tilgan yo‘l, bajarilgan ish — aniq integral bilan hisoblanadi.",
    explain: "<span class='fb'>∫ₐᵇ f(x) dx = F(b) − F(a) &nbsp; (Nyuton–Leybnits)</span><p><b>Xossalari:</b> ∫ₐᵃ = 0; ∫ₐᵇ = −∫ᵦᵃ; ∫ₐᵇ = ∫ₐᶜ + ∫ᶜᵇ; toq funksiya uchun ∫₋ₐᵃ f = 0.</p><p><b>Egri chiziqli trapetsiya yuzi</b> (f ≥ 0): S = ∫ₐᵇ f(x)dx.</p><p><b>Ikki chiziq orasidagi yuz:</b></p><span class='fb'>S = ∫ₐᵇ (f(x) − g(x)) dx, &nbsp; f ≥ g</span><p>a, b — kesishish nuqtalari (f(x) = g(x)).</p><p><b>Yo‘l:</b> S = ∫ v(t) dt.</p>",
    rule: "∫ₐᵇ f dx = F(b) − F(a); yuz = ∫(yuqori − pastki).",
    tip: "Ox dan pastdagi qism integrali manfiy — yuz uchun modulni oling yoki qismlarga bo‘ling.",
    demos: [{ type: "integral" }],
    ex: [
      ["∫₁² (3x² + 2x) dx = ?", ["F = x³ + x²", "F(2) − F(1) = 12 − 2 = 10"], "10"],
      ["y = x² va y = 2x orasidagi yuz?", ["Kesishish: x² = 2x → x = 0, 2", "S = ∫₀² (2x − x²)dx = (x² − x³/3)|₀² = 4 − [[8/3]] = [[4/3]]"], "[[4/3]]"],
      ["v(t) = 3t² (m/s). Dastlabki 2 s da bosib o‘tilgan yo‘l?", ["S = ∫₀² 3t² dt = t³|₀² = 8"], "8 m"]
    ],
    qz: [
      ["∫₀³ 2x dx = ?", ["9", "6", "3", "18"], "x²|₀³."],
      ["∫₀^π sin x dx = ?", ["2", "0", "1", "π"], "−cos π + cos 0."],
      ["y = x³, y = 0, x = 2 bilan chegaralangan yuz?", ["4", "8", "2", "16"], "x⁴/4 |₀²."],
      ["∫₋₁¹ x⁵ dx = ?", ["0", "[[1/3]]", "2", "[[2/6]]"], "Toq funksiya."],
      ["∫₀¹ eˣ dx = ?", ["e − 1", "e", "1", "e + 1"], "eˣ|₀¹."]
    ],
    see: ["2.2.13", "2.2.14"]
  });
})();
