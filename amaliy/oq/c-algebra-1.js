/* Oq to'plam — 1-bob Algebra (1.1–1.7). Har mavzu: nega kerak, nazariya, formula, diqqat, misollar, test. */
window.OQ = window.OQ || {};
(() => {
  const add = (code, o) => { window.OQ[code] = o; };

  // ===== 1.1 Natural va butun sonlar =====
  add("1.1.1", {
    life: "DTM testining birinchi savollari ko‘pincha hisoblashga oid bo‘ladi. Ular oson ko‘rinadi, lekin amallar tartibidagi bitta xato butun javobni buzadi. Tez va xatosiz hisoblash — vaqtni tejash degani.",
    explain: "<p><b>Natural sonlar</b> — sanashda ishlatiladigan sonlar: 1, 2, 3, … (0 natural son emas). Ular to‘plami <b>N</b> bilan belgilanadi.</p><p><b>Amallar tartibi:</b> 1) qavs ichidagi amallar; 2) daraja; 3) ko‘paytirish va bo‘lish (chapdan o‘ngga); 4) qo‘shish va ayirish (chapdan o‘ngga).</p><p><b>Tez hisoblash usullari:</b></p><ul><li>Guruhlash: 25·37·4 = (25·4)·37 = 3700.</li><li>Taqsimot qonuni: 37·99 = 37·(100 − 1) = 3700 − 37 = 3663.</li><li>Umumiy ko‘paytuvchini chiqarish: 48·73 + 48·27 = 48·(73 + 27) = 4800.</li><li>Kvadratlar ayirmasi: 51·49 = (50 + 1)(50 − 1) = 2500 − 1 = 2499.</li></ul>",
    rule: "Amallar tartibi: qavs → daraja → ko‘paytirish/bo‘lish → qo‘shish/ayirish. a(b + c) = ab + ac.",
    tip: "Ko‘paytirish va bo‘lish teng huquqli — chapdan o‘ngga bajariladi: 24 : 4 · 2 = 6 · 2 = 12 (3 emas!).",
    demos: [{ type: "orderOps", examples: ["48 : 6 × 2 + 3", "(64 + 36) × 35 − 500", "125 × 8 − 24 : 4 × 2", "999 × 13 − (100 − 1) × 3"] }],
    ex: [
      ["Hisoblang: 125 · 17 · 8", ["Qulay juftlik: 125 · 8 = 1000", "1000 · 17 = 17 000"], "17 000"],
      ["Hisoblang: 64 · 35 + 36 · 35", ["Umumiy ko‘paytuvchi 35: 35 · (64 + 36)", "35 · 100 = 3500"], "3500"],
      ["Hisoblang: 999 · 13", ["999 = 1000 − 1", "13 000 − 13 = 12 987"], "12 987"]
    ],
    qz: [
      ["48 : 6 · 2 + 3 = ?", ["19", "7", "11", "4"], "48 : 6 = 8, 8 · 2 = 16, 16 + 3 = 19."],
      ["101 · 99 = ?", ["9999", "10 001", "9899", "10 099"], "(100 + 1)(100 − 1) = 10 000 − 1."],
      ["25 · 36 = ?", ["900", "850", "925", "960"], "25 · 4 · 9 = 100 · 9 = 900."]
    ]
  });
  add("1.1.2", {
    life: "Do‘kondagi 1236 ta daftarni 3 ta sinfga teng bo‘lib bo‘ladimi? Bo‘lmasdan turib, raqamlarga qarab bilish mumkin. Testlarda bo‘linish belgilari noma’lum raqamni topishda juda ko‘p uchraydi.",
    explain: "<table class='oq-t'><tr><th>Son</th><th>Belgisi</th><th>Misol</th></tr><tr><td>2</td><td>oxirgi raqam juft</td><td>358</td></tr><tr><td>3</td><td>raqamlar yig‘indisi 3 ga bo‘linadi</td><td>1236: 1+2+3+6=12</td></tr><tr><td>4</td><td>oxirgi ikki raqam 4 ga bo‘linadi</td><td>7316: 16</td></tr><tr><td>5</td><td>oxirgi raqam 0 yoki 5</td><td>845</td></tr><tr><td>6</td><td>2 ga va 3 ga bo‘linadi</td><td>522</td></tr><tr><td>8</td><td>oxirgi uch raqam 8 ga bo‘linadi</td><td>5136: 136</td></tr><tr><td>9</td><td>raqamlar yig‘indisi 9 ga bo‘linadi</td><td>4563: 18</td></tr><tr><td>10</td><td>oxirgi raqam 0</td><td>730</td></tr><tr><td>11</td><td>toq va juft o‘rindagi raqamlar yig‘indilari ayirmasi 11 ga bo‘linadi</td><td>2728: (2+2)−(7+8)=−11</td></tr></table><p>Murakkab bo‘luvchilar uchun o‘zaro tub ko‘paytuvchilarga ajratamiz: 12 = 3·4, 15 = 3·5, 18 = 2·9, 36 = 4·9.</p>",
    rule: "6 = 2·3, 12 = 3·4, 15 = 3·5, 18 = 2·9, 36 = 4·9, 45 = 5·9 — har bir ko‘paytuvchi bo‘yicha alohida tekshiring.",
    tip: "12 ga bo‘linishni 2 va 6 orqali tekshirib bo‘lmaydi (ular o‘zaro tub emas)! Faqat 3 va 4 orqali.",
    demos: [{ type: "divCheck" }],
    ex: [
      ["5*8 sonida * o‘rniga qanday raqam qo‘yilsa, son 9 ga bo‘linadi?", ["Raqamlar yig‘indisi: 5 + * + 8 = 13 + *", "13 + * son 9 ga bo‘linishi kerak → 13 + * = 18", "* = 5"], "5 (son 558)"],
      ["2*4 son 12 ga bo‘linadigan barcha * ni toping.", ["12 = 3 · 4. 4 ga: oxirgi ikki raqam *4 → 04, 24, 44, 64, 84", "3 ga: 2 + * + 4 = 6 + * → * ∈ {0, 3, 6, 9}", "Ikkalasi: * = 0 yoki 6 (204, 264)"], "0 yoki 6"]
    ],
    qz: [
      ["Qaysi son 9 ga bo‘linadi?", ["7281", "7282", "7283", "7284"], "7 + 2 + 8 + 1 = 18 — 9 ga bo‘linadi."],
      ["Qaysi son 4 ga bo‘linadi?", ["3716", "3714", "3718", "3722"], "Oxirgi ikki raqam 16 — 4 ga bo‘linadi."],
      ["Qaysi son 11 ga bo‘linadi?", ["4719", "4718", "4720", "4717"], "(4 + 1) − (7 + 9) = −11 — 11 ga bo‘linadi."]
    ]
  });
  add("1.1.3", {
    life: "Bugun dushanba. 100 kundan keyin haftaning qaysi kuni bo‘ladi? Soat hozir 15:00 — 50 soatdan keyin-chi? Bunday savollarning hammasi qoldiqli bo‘lish orqali yechiladi.",
    explain: "<p>Har qanday natural a sonni b ga qoldiqli bo‘lish mumkin:</p><span class='fb'>a = b · q + r, &nbsp; 0 ≤ r < b</span><p>Bu yerda q — to‘liqsiz bo‘linma, r — qoldiq. Qoldiq doim bo‘luvchidan kichik.</p><p><b>Qoldiqlar xossalari:</b> yig‘indining qoldig‘i = qoldiqlar yig‘indisining qoldig‘i; ko‘paytmaning qoldig‘i = qoldiqlar ko‘paytmasining qoldig‘i. Masalan, 17 va 23 ni 5 ga bo‘lgandagi qoldiqlar 2 va 3 → 17·23 ning qoldig‘i 2·3 = 6 → 6 ning 5 ga qoldig‘i 1.</p><p>Teskari masala: “5 ga bo‘lganda qoldig‘i 3” — bu son <b>5k + 3</b> ko‘rinishida: 3, 8, 13, 18, …</p>",
    rule: "a = bq + r, 0 ≤ r < b. “n ga bo‘lganda qoldiq r” → son n·k + r ko‘rinishida.",
    tip: "Qoldiq hech qachon bo‘luvchiga teng yoki undan katta bo‘lmaydi. Agar bo‘luvchi 7 bo‘lsa, eng katta qoldiq 6.",
    demos: [{ type: "divCheck" }],
    ex: [
      ["Bugun dushanba. 100 kundan keyin qaysi kun?", ["Hafta 7 kun: 100 = 7 · 14 + 2", "14 to‘liq hafta o‘tadi, yana 2 kun qo‘shiladi", "Dushanba + 2 = chorshanba"], "Chorshanba"],
      ["Son 6 ga bo‘lganda qoldiq 5. Shu sonni 3 ga bo‘lganda qoldiq qancha?", ["Son = 6k + 5 = 6k + 3 + 2 = 3(2k + 1) + 2", "Demak 3 ga bo‘lganda qoldiq 2"], "2"]
    ],
    qz: [
      ["125 ni 7 ga bo‘lgandagi qoldiq?", ["6", "5", "4", "3"], "125 = 7 · 17 + 6."],
      ["Qaysi son 4 ga bo‘lganda 3 qoldiq beradi?", ["27", "26", "28", "30"], "27 = 4 · 6 + 3."],
      ["a ni 5 ga bo‘lganda qoldiq 3. 2a ning 5 ga qoldig‘i?", ["1", "6", "3", "2"], "2 · 3 = 6, 6 ning 5 ga qoldig‘i 1."]
    ]
  });
  add("1.1.4", {
    life: "24 ta olma va 36 ta nokni bir xil sovg‘a paketlariga teng taqsimlash kerak — eng ko‘pi bilan nechta paket? (EKUB). Ikki avtobus 12 va 18 daqiqada qatnaydi — yana qachon bir vaqtda jo‘naydi? (EKUK).",
    explain: "<p><b>EKUB</b> (eng katta umumiy bo‘luvchi) — ikki sonning har biri bo‘linadigan eng katta son. <b>EKUK</b> (eng kichik umumiy karrali) — ikkala songa bo‘linadigan eng kichik son.</p><p><b>Tub ko‘paytuvchilar usuli:</b> 72 = 2³·3², 120 = 2³·3·5.</p><ul><li>EKUB — umumiy tub ko‘paytuvchilarning <b>eng kichik</b> darajalari: 2³·3 = 24.</li><li>EKUK — barcha tub ko‘paytuvchilarning <b>eng katta</b> darajalari: 2³·3²·5 = 360.</li></ul><span class='fb'>EKUB(a, b) · EKUK(a, b) = a · b</span><p>Tekshiramiz: 24 · 360 = 8640 = 72 · 120 ✓. EKUB = 1 bo‘lsa, sonlar <b>o‘zaro tub</b>, unda EKUK = a·b.</p>",
    rule: "EKUB · EKUK = a · b. EKUB — kichik darajalar, EKUK — katta darajalar.",
    tip: "“Eng ko‘p nechta guruh / eng katta o‘lcham” — EKUB; “qachon yana birga / eng kam miqdor” — EKUK.",
    ex: [
      ["EKUB(84; 126) va EKUK(84; 126) ni toping.", ["84 = 2²·3·7, 126 = 2·3²·7", "EKUB = 2·3·7 = 42", "EKUK = 2²·3²·7 = 252", "Tekshiruv: 42·252 = 10 584 = 84·126 ✓"], "EKUB = 42, EKUK = 252"],
      ["Avtobuslar 12 va 18 daqiqada qatnaydi. Soat 8:00 da birga jo‘nadi. Keyingi safar qachon?", ["EKUK(12; 18) = 36", "8:00 + 36 daqiqa"], "8:36 da"]
    ],
    qz: [
      ["EKUB(48; 60) = ?", ["12", "6", "24", "4"], "48 = 2⁴·3, 60 = 2²·3·5 → 2²·3 = 12."],
      ["EKUK(15; 20) = ?", ["60", "300", "30", "120"], "15 = 3·5, 20 = 2²·5 → 2²·3·5 = 60."],
      ["EKUB(a; b) = 6, EKUK(a; b) = 90, a = 18. b = ?", ["30", "15", "45", "36"], "b = 6·90/18 = 30."]
    ]
  });
  add("1.1.5", {
    life: "7¹⁰⁰ ning oxirgi raqami qanday? Kalkulyator bunday sonni ko‘rsata olmaydi, lekin oxirgi raqam doim takrorlanuvchi qonuniyatga bo‘ysunadi. Bu — DTMning sevimli savollaridan biri.",
    explain: "<p>Ko‘paytmaning oxirgi raqami faqat ko‘paytuvchilarning oxirgi raqamlariga bog‘liq. Shuning uchun darajalarning oxirgi raqamlari <b>davriy</b> takrorlanadi:</p><table class='oq-t'><tr><th>Asos oxiri</th><th>Davr</th><th>Uzunligi</th></tr><tr><td>0, 1, 5, 6</td><td>o‘zgarmaydi</td><td>1</td></tr><tr><td>4</td><td>4, 6</td><td>2</td></tr><tr><td>9</td><td>9, 1</td><td>2</td></tr><tr><td>2</td><td>2, 4, 8, 6</td><td>4</td></tr><tr><td>3</td><td>3, 9, 7, 1</td><td>4</td></tr><tr><td>7</td><td>7, 9, 3, 1</td><td>4</td></tr><tr><td>8</td><td>8, 4, 2, 6</td><td>4</td></tr></table><p><b>Usul:</b> darajani davr uzunligiga bo‘lamiz. Qoldiq r bo‘lsa — davrdagi r-raqam; qoldiq 0 bo‘lsa — davrning oxirgi raqami.</p>",
    rule: "Davr uzunligi ko‘pincha 4. n ni 4 ga bo‘lib, qoldiqqa qarang (qoldiq 0 → davrning 4-raqami).",
    tip: "Qoldiq 0 chiqsa, birinchi emas, davrning OXIRGI raqamini oling: 3⁴⁰ → 40 = 4·10 → 1.",
    demos: [{ type: "lastDigit" }],
    ex: [
      ["7²⁰²⁵ ning oxirgi raqami?", ["7 ning davri: 7, 9, 3, 1 (uzunligi 4)", "2025 = 4 · 506 + 1 → qoldiq 1", "Davrning 1-raqami: 7"], "7"],
      ["2¹⁰ + 3¹⁰ ning oxirgi raqami?", ["2: 10 = 4·2 + 2 → 4", "3: 10 = 4·2 + 2 → 9", "4 + 9 = 13 → oxirgi raqam 3"], "3"]
    ],
    qz: [
      ["3¹⁰⁰ ning oxirgi raqami?", ["1", "3", "9", "7"], "100 = 4·25, qoldiq 0 → davrning oxirgisi 1."],
      ["8⁵ ning oxirgi raqami?", ["8", "4", "2", "6"], "5 = 4·1 + 1 → davrning 1-raqami 8."],
      ["4⁹⁹ ning oxirgi raqami?", ["4", "6", "8", "2"], "4 ning davri 4, 6. 99 toq → 4."]
    ]
  });
  add("1.1.6", {
    life: "Harorat −5°C dan +3°C ga ko‘tarildi — necha gradusga? Bank hisobidagi qarz, dengiz sathidan pastdagi chuqurlik — manfiy sonlar kundalik hayotda ham bor.",
    explain: "<p><b>Butun sonlar</b> (Z): …, −3, −2, −1, 0, 1, 2, 3, … Har bir son uchun unga <b>qarama-qarshi</b> son bor: 5 va −5. Son o‘qida ular 0 dan bir xil uzoqlikda.</p><p><b>Ishora qoidalari:</b></p><ul><li>Bir xil ishorali sonlarni qo‘shishda modullar qo‘shiladi, ishora saqlanadi: (−3) + (−5) = −8.</li><li>Har xil ishoralida katta moduldan kichigi ayiriladi, katta modulning ishorasi olinadi: (−9) + 4 = −5.</li><li>Ayirish — qarama-qarshisini qo‘shish: 3 − (−5) = 3 + 5 = 8.</li><li>Ko‘paytirish/bo‘lishda: (+)(+) = +, (−)(−) = +, (+)(−) = −.</li><li>Manfiy sonning juft darajasi musbat, toq darajasi manfiy: (−2)⁴ = 16, (−2)³ = −8.</li></ul>",
    rule: "“Minus × minus = plyus”. (−a)²ⁿ = a²ⁿ, (−a)²ⁿ⁺¹ = −a²ⁿ⁺¹.",
    tip: "−2⁴ va (−2)⁴ farqli! −2⁴ = −16 (avval daraja, keyin minus), (−2)⁴ = 16.",
    ex: [
      ["Hisoblang: (−3)³ − (−2)⁴ + (−1)¹⁰¹", ["(−3)³ = −27", "(−2)⁴ = 16", "(−1)¹⁰¹ = −1", "−27 − 16 − 1 = −44"], "−44"],
      ["Harorat ertalab −7°C, tushda +5°C. Farq necha gradus?", ["5 − (−7) = 5 + 7"], "12°C"]
    ],
    qz: [
      ["(−4) · (−5) − 3 · (−2) = ?", ["26", "14", "−26", "−14"], "20 − (−6) = 26."],
      ["−3² + (−3)² = ?", ["0", "18", "−18", "9"], "−9 + 9 = 0."],
      ["(−1) + (−2) + … + (−10) = ?", ["−55", "−50", "−45", "55"], "1 + 2 + … + 10 = 55, ishora minus."]
    ]
  });

  // ===== 1.2 Kasrlar =====
  add("1.2.1", {
    life: "Pitsaning [[3/8]] qismi qoldi deyish o‘rniga “ozgina qoldi” deymizmi? Retseptlardagi “yarim stakan”, chegirmalardagi “[[1/4]] arzon” — kasrlar hamma joyda. DTMda esa kasrli ifodalar deyarli har bir variantda bor.",
    explain: "<p>[[a/b]] — butunni b ta teng bo‘lakka bo‘lib, a tasini olish. a — surat, b — maxraj (b ≠ 0).</p><p><b>Asosiy xossa:</b> surat va maxrajni bir xil songa ko‘paytirish yoki bo‘lish mumkin: [[6/8]] = [[3/4]]. Shu orqali kasr <b>qisqartiriladi</b>.</p><p><b>Qo‘shish/ayirish:</b> umumiy maxrajga (EKUK) keltiramiz: [[1/4]] + [[1/6]] = [[3/12]] + [[2/12]] = [[5/12]].</p><p><b>Ko‘paytirish:</b> suratni suratga, maxrajni maxrajga: [[2/3]] · [[9/10]] = [[18/30]] = [[3/5]] (ko‘paytirishdan oldin qisqartirish qulay).</p><p><b>Bo‘lish:</b> bo‘luvchining teskarisiga ko‘paytiramiz: [[3/4]] : [[9/8]] = [[3/4]] · [[8/9]] = [[2/3]].</p>",
    rule: "[[a/b]] + [[c/d]] = [[(ad + bc)/bd]], &nbsp; [[a/b]] · [[c/d]] = [[ac/bd]], &nbsp; [[a/b]] : [[c/d]] = [[ad/bc]].",
    tip: "Maxrajlarni qo‘shib bo‘lmaydi: [[1/2]] + [[1/3]] ≠ [[2/5]]! To‘g‘risi [[5/6]].",
    demos: [{ type: "fracAdd" }],
    ex: [
      ["Hisoblang: [[5/6]] − [[3/8]] + [[1/4]]", ["Umumiy maxraj EKUK(6, 8, 4) = 24", "[[20/24]] − [[9/24]] + [[6/24]] = [[17/24]]"], "[[17/24]]"],
      ["Hisoblang: ([[2/3]] + [[1/6]]) : [[5/12]]", ["[[2/3]] + [[1/6]] = [[4/6]] + [[1/6]] = [[5/6]]", "[[5/6]] : [[5/12]] = [[5/6]] · [[12/5]] = 2"], "2"]
    ],
    qz: [
      ["[[3/4]] + [[1/6]] = ?", ["[[11/12]]", "[[4/10]]", "[[2/5]]", "[[5/6]]"], "[[9/12]] + [[2/12]] = [[11/12]]."],
      ["[[4/9]] · [[3/8]] = ?", ["[[1/6]]", "[[7/17]]", "[[12/17]]", "[[1/3]]"], "[[12/72]] = [[1/6]]."],
      ["[[5/7]] : [[10/21]] = ?", ["[[3/2]]", "[[2/3]]", "[[50/147]]", "[[1/2]]"], "[[5/7]] · [[21/10]] = [[105/70]] = [[3/2]]."]
    ]
  });
  add("1.2.2", {
    life: "“2 yarim kilogramm”, “1 soat 15 daqiqa = 1 butun [[1/4]] soat” — aralash sonlar hayotda qulay. Lekin hisoblashda ularni noto‘g‘ri kasrga aylantirish kerak.",
    explain: "<p><b>Aralash son</b> — butun va kasr qism: 3[[2/5]] = 3 + [[2/5]].</p><p><b>Noto‘g‘ri kasrga aylantirish:</b> butun qismni maxrajga ko‘paytirib, suratga qo‘shamiz: 3[[2/5]] = [[(3·5 + 2)/5]] = [[17/5]].</p><p><b>Teskarisi:</b> suratni maxrajga qoldiqli bo‘lamiz: [[23/4]] → 23 = 4·5 + 3 → 5[[3/4]].</p><p><b>Qo‘shish/ayirish</b>da butun va kasr qismlarni alohida qo‘shish qulay: 2[[1/3]] + 1[[1/2]] = 3 + [[5/6]] = 3[[5/6]]. Ayirishda kasr qism yetmasa, butundan 1 ni “qarzga” olamiz: 5[[1/4]] − 2[[3/4]] = 4[[5/4]] − 2[[3/4]] = 2[[2/4]] = 2[[1/2]].</p><p><b>Ko‘paytirish va bo‘lishda</b> esa doim noto‘g‘ri kasrga aylantiring.</p>",
    rule: "a[[b/c]] = [[(a·c + b)/c]]. Ko‘paytirish va bo‘lishdan oldin noto‘g‘ri kasrga o‘tkazing.",
    tip: "2[[1/2]] · 2[[1/2]] ≠ 4[[1/4]]! To‘g‘risi: [[5/2]] · [[5/2]] = [[25/4]] = 6[[1/4]].",
    ex: [
      ["Hisoblang: 3[[1/3]] · 1[[4/5]]", ["3[[1/3]] = [[10/3]], 1[[4/5]] = [[9/5]]", "[[10/3]] · [[9/5]] = [[90/15]] = 6"], "6"],
      ["Hisoblang: 7[[1/6]] − 3[[5/6]]", ["[[1/6]] < [[5/6]] → 7[[1/6]] = 6[[7/6]]", "6[[7/6]] − 3[[5/6]] = 3[[2/6]] = 3[[1/3]]"], "3[[1/3]]"]
    ],
    qz: [
      ["4[[2/3]] ni noto‘g‘ri kasr ko‘rinishida yozing.", ["[[14/3]]", "[[8/3]]", "[[12/3]]", "[[6/3]]"], "4·3 + 2 = 14."],
      ["2[[1/4]] : 1[[1/2]] = ?", ["1[[1/2]]", "[[2/3]]", "1[[1/4]]", "3"], "[[9/4]] : [[3/2]] = [[9/4]] · [[2/3]] = [[3/2]]."],
      ["1[[1/2]] + 2[[2/3]] = ?", ["4[[1/6]]", "3[[3/5]]", "3[[5/6]]", "4[[1/2]]"], "3 + [[3/6]] + [[4/6]] = 3 + 1[[1/6]]."]
    ]
  });
  add("1.2.3", {
    life: "Narxlar, masofalar, o‘lchovlar — hammasi o‘nli kasrda: 12,5 ming so‘m, 1,75 metr. O‘nli kasrlar bilan tez va xatosiz ishlash — kundalik hisob-kitobning asosi.",
    explain: "<p>O‘nli kasr — maxraji 10, 100, 1000, … bo‘lgan kasrning boshqa yozuvi: 0,37 = [[37/100]].</p><ul><li><b>Qo‘shish/ayirish:</b> vergulni vergul tagiga yozib, xonama-xona.</li><li><b>Ko‘paytirish:</b> vergulga qaramay ko‘paytirib, natijada ikkala ko‘paytuvchidagi verguldan keyingi raqamlar soni yig‘indisicha raqam ajratamiz: 1,2 · 0,03 = 0,036.</li><li><b>Bo‘lish:</b> bo‘luvchini butun songa aylantiramiz (ikkalasida vergulni bir xil suramiz): 4,2 : 0,06 = 420 : 6 = 70.</li><li>10, 100, 1000 ga ko‘paytirishda vergul o‘ngga, bo‘lishda chapga suriladi.</li></ul><p><b>Oddiy kasrga o‘tkazish:</b> 0,125 = [[125/1000]] = [[1/8]]. Bilish foydali: [[1/2]] = 0,5; [[1/4]] = 0,25; [[3/4]] = 0,75; [[1/5]] = 0,2; [[1/8]] = 0,125.</p>",
    rule: "Bo‘lishda bo‘luvchini butun songa keltiring: a : 0,05 = 100a : 5 = 20a.",
    tip: "0,1 ga bo‘lish — 10 ga ko‘paytirish degani: 3,7 : 0,1 = 37. 0,5 ga bo‘lish — 2 ga ko‘paytirish.",
    demos: [{ type: "decimalGrid" }],
    ex: [
      ["Hisoblang: 2,4 · 0,15 + 0,64 : 0,8", ["2,4 · 0,15 = 0,36", "0,64 : 0,8 = 6,4 : 8 = 0,8", "0,36 + 0,8 = 1,16"], "1,16"],
      ["0,375 ni oddiy kasrga aylantiring.", ["0,375 = [[375/1000]]", "125 ga qisqartiramiz: [[3/8]]"], "[[3/8]]"]
    ],
    qz: [
      ["0,3 · 0,02 = ?", ["0,006", "0,06", "0,6", "0,0006"], "3·2 = 6, verguldan keyin 1 + 2 = 3 raqam."],
      ["1,8 : 0,06 = ?", ["30", "3", "0,3", "300"], "180 : 6 = 30."],
      ["[[7/20]] ni o‘nli kasrga aylantiring.", ["0,35", "0,7", "0,07", "3,5"], "[[7/20]] = [[35/100]] = 0,35."]
    ]
  });
  add("1.2.4", {
    life: "1 ni 3 ga bo‘lsak 0,333… cheksiz davom etadi. Bunday sonlarni oddiy kasrga qanday aylantirish kerak? DTMda 0,(3), 1,2(5) kabi yozuvlar tez-tez uchraydi.",
    explain: "<p>Maxrajida 2 va 5 dan boshqa tub ko‘paytuvchi bo‘lgan qisqarmas kasr <b>cheksiz davriy o‘nli kasr</b>ga aylanadi: [[1/3]] = 0,333… = 0,(3); [[1/6]] = 0,1(6); [[5/11]] = 0,(45).</p><p><b>Sof davriy kasr</b> → oddiy kasr: davrni suratga, maxrajga davrdagi raqamlar sonicha 9 yozamiz:</p><span class='fb'>0,(7) = [[7/9]], &nbsp; 0,(36) = [[36/99]] = [[4/11]]</span><p><b>Aralash davriy kasr</b> → oddiy kasr: suratga (verguldan keyingi butun son) − (davrgacha bo‘lgan qism), maxrajga davr raqamlaricha 9 va davrgacha raqamlaricha 0:</p><span class='fb'>0,2(5) = [[(25 − 2)/90]] = [[23/90]]</span><p>Isbot g‘oyasi: x = 0,(7) → 10x = 7,(7) → 10x − x = 7 → x = [[7/9]].</p>",
    rule: "0,(ab) = [[ab/99]]; 0,a(b) = [[(ab − a)/90]]. Esda tuting: 0,(9) = 1.",
    tip: "Butun qismni alohida qo‘shing: 2,(3) = 2 + [[3/9]] = 2[[1/3]].",
    ex: [
      ["0,(27) ni oddiy kasrga aylantiring.", ["Davr 27, ikki raqamli → [[27/99]]", "9 ga qisqartiramiz → [[3/11]]"], "[[3/11]]"],
      ["1,3(6) ni oddiy kasrga aylantiring.", ["0,3(6) = [[(36 − 3)/90]] = [[33/90]] = [[11/30]]", "1 + [[11/30]] = [[41/30]]"], "[[41/30]] = 1[[11/30]]"]
    ],
    qz: [
      ["0,(6) = ?", ["[[2/3]]", "[[3/5]]", "[[6/10]]", "[[1/6]]"], "[[6/9]] = [[2/3]]."],
      ["0,1(6) = ?", ["[[1/6]]", "[[16/99]]", "[[16/90]]", "[[1/16]]"], "[[(16 − 1)/90]] = [[15/90]] = [[1/6]]."],
      ["0,(3) + 0,(6) = ?", ["1", "0,(9) dan kichik", "[[9/10]]", "[[1/2]]"], "[[1/3]] + [[2/3]] = 1."]
    ]
  });

  // ===== 1.3 Algebraik ifodalar =====
  add("1.3.1", {
    life: "Algebra — sonlar o‘rniga harflar bilan ishlash. Murakkab ifodani tartibga keltira olish — tenglama, funksiya va keyingi barcha mavzularning poydevori.",
    explain: "<p><b>Birhad</b> — son va harflar ko‘paytmasi: −3a²b. Uning <b>darajasi</b> — harflar darajalari yig‘indisi (2 + 1 = 3).</p><p><b>Ko‘phad</b> — birhadlar yig‘indisi. <b>Standart shakl</b>: o‘xshash hadlar ixchamlangan, har bir birhad standart ko‘rinishda, odatda darajalar kamayishi tartibida yozilgan.</p><p><b>O‘xshash hadlar</b> — harfiy qismi bir xil birhadlar: 5x²y va −2x²y. Ularni qo‘shishda koeffitsientlar qo‘shiladi: 3x²y.</p><p>Ko‘phadni ko‘phadga ko‘paytirishda har bir hadni har bir hadga ko‘paytiramiz: (a + 2)(a − 5) = a² − 5a + 2a − 10 = a² − 3a − 10.</p><p>Qavs oldida minus bo‘lsa, qavsni ochganda barcha ishoralar teskarisiga o‘zgaradi: −(2x − 3) = −2x + 3.</p>",
    rule: "Ko‘phad darajasi — undagi birhadlar darajalarining eng kattasi.",
    tip: "x² va x o‘xshash had EMAS — ularni qo‘shib bo‘lmaydi: 3x² + 2x ≠ 5x³.",
    demos: [{ type: "likeTerms", examples: ["3x + 2y + 4x + y", "5x − 2 + x + 7", "2x + 3y − x − 3y + 4", "4y − 2x + 3 − y + 5x − 1"] }],
    ex: [
      ["Soddalashtiring: (3x² − 2x + 1) − (x² − 5x − 4)", ["Qavsni ochamiz: 3x² − 2x + 1 − x² + 5x + 4", "O‘xshash hadlar: (3 − 1)x² + (−2 + 5)x + (1 + 4)"], "2x² + 3x + 5"],
      ["(2a − 3)(a + 4) ni standart shaklga keltiring.", ["2a·a + 2a·4 − 3·a − 3·4", "2a² + 8a − 3a − 12"], "2a² + 5a − 12"]
    ],
    qz: [
      ["−4x³y²z birhadining darajasi?", ["6", "5", "3", "−4"], "3 + 2 + 1 = 6."],
      ["(x − 1)(x + 3) = ?", ["x² + 2x − 3", "x² − 2x − 3", "x² + 3x − 1", "x² − 3"], "x² + 3x − x − 3."],
      ["5a − (2a − 7) = ?", ["3a + 7", "3a − 7", "7a − 7", "3a"], "5a − 2a + 7."]
    ]
  });
  add("1.3.2", {
    life: "98² ni og‘zaki hisoblash mumkinmi? (100 − 2)² = 10 000 − 400 + 4 = 9604. Qisqa ko‘paytirish formulalari — algebradagi eng ko‘p ishlatiladigan “sehrli kalitlar”.",
    explain: "<span class='fb'>(a + b)² = a² + 2ab + b²</span><span class='fb'>(a − b)² = a² − 2ab + b²</span><span class='fb'>a² − b² = (a − b)(a + b)</span><span class='fb'>(a + b)³ = a³ + 3a²b + 3ab² + b³</span><span class='fb'>(a − b)³ = a³ − 3a²b + 3ab² − b³</span><span class='fb'>a³ + b³ = (a + b)(a² − ab + b²)</span><span class='fb'>a³ − b³ = (a − b)(a² + ab + b²)</span><p>Formulalar ikki tomonlama ishlaydi: chapdan o‘ngga — qavsni ochish, o‘ngdan chapga — ko‘paytuvchilarga ajratish.</p><p>Foydali natija: (a + b)² − (a − b)² = 4ab, &nbsp; (a + b)² + (a − b)² = 2(a² + b²), &nbsp; a² + b² = (a + b)² − 2ab.</p>",
    rule: "a² + b² = (a + b)² − 2ab; &nbsp; a³ + b³ = (a + b)³ − 3ab(a + b).",
    tip: "(a + b)² ≠ a² + b²! O‘rtadagi 2ab ni unutish — eng ko‘p uchraydigan xato.",
    demos: [{ type: "squareArea" }],
    ex: [
      ["Hisoblang: 103² − 97²", ["Kvadratlar ayirmasi: (103 − 97)(103 + 97)", "6 · 200 = 1200"], "1200"],
      ["a + b = 5, ab = 3. a² + b² va a³ + b³ ni toping.", ["a² + b² = (a + b)² − 2ab = 25 − 6 = 19", "a³ + b³ = (a + b)³ − 3ab(a + b) = 125 − 45 = 80"], "19 va 80"]
    ],
    qz: [
      ["(2x − 3)² = ?", ["4x² − 12x + 9", "4x² − 9", "4x² − 6x + 9", "2x² − 12x + 9"], "(2x)² − 2·2x·3 + 3²."],
      ["x − y = 3, xy = 10. x² + y² = ?", ["29", "19", "9", "39"], "(x − y)² + 2xy = 9 + 20."],
      ["27a³ − 8 ni ko‘paytuvchilarga ajrating.", ["(3a − 2)(9a² + 6a + 4)", "(3a − 2)³", "(3a − 2)(9a² − 6a + 4)", "(3a + 2)(9a² − 6a + 4)"], "a³ − b³ = (a − b)(a² + ab + b²), a → 3a, b → 2."]
    ]
  });
  add("1.3.3", {
    life: "Ko‘paytuvchilarga ajratish — kasrlarni qisqartirish, tenglamalarni yechish va ifodalarni soddalashtirishning asosiy quroli. “x² − 5x + 6 = 0” ni (x − 2)(x − 3) = 0 deb ko‘rish — yechimning yarmi.",
    explain: "<p><b>Asosiy usullar:</b></p><ol><li><b>Umumiy ko‘paytuvchini qavsdan chiqarish:</b> 6a²b − 9ab² = 3ab(2a − 3b).</li><li><b>Guruhlash:</b> ax + ay + bx + by = a(x + y) + b(x + y) = (x + y)(a + b).</li><li><b>Qisqa ko‘paytirish formulalari:</b> 4x² − 25 = (2x − 5)(2x + 5); x² + 6x + 9 = (x + 3)².</li><li><b>Kvadrat uchhad:</b> ax² + bx + c = a(x − x₁)(x − x₂), bu yerda x₁, x₂ — ildizlar. Masalan: x² − 5x + 6 = (x − 2)(x − 3).</li><li><b>To‘la kvadrat ajratish:</b> x⁴ + 4 = (x² + 2)² − 4x² = (x² − 2x + 2)(x² + 2x + 2).</li></ol>",
    rule: "ax² + bx + c = a(x − x₁)(x − x₂). Avval umumiy ko‘paytuvchini chiqaring, keyin formulalarni qo‘llang.",
    tip: "a² + b² haqiqiy sonlarda ko‘paytuvchilarga ajralmaydi (kvadratlar yig‘indisi uchun formula yo‘q).",
    ex: [
      ["Ko‘paytuvchilarga ajrating: x³ − 2x² − 9x + 18", ["Guruhlash: x²(x − 2) − 9(x − 2)", "(x − 2)(x² − 9)", "(x − 2)(x − 3)(x + 3)"], "(x − 2)(x − 3)(x + 3)"],
      ["Kasrni qisqartiring: [[(x² − 4)/(x² + x − 6)]]", ["x² − 4 = (x − 2)(x + 2)", "x² + x − 6 = (x − 2)(x + 3)", "(x − 2) ga qisqartiramiz"], "[[(x + 2)/(x + 3)]]"]
    ],
    qz: [
      ["2x² − 8 = ?", ["2(x − 2)(x + 2)", "(2x − 4)(x + 2)", "2(x − 4)(x + 4)", "2(x − 2)²"], "2(x² − 4)."],
      ["x² − 7x + 12 = ?", ["(x − 3)(x − 4)", "(x + 3)(x + 4)", "(x − 2)(x − 6)", "(x − 1)(x − 12)"], "3 + 4 = 7, 3·4 = 12."],
      ["ab − 3a + 2b − 6 = ?", ["(b − 3)(a + 2)", "(a − 3)(b + 2)", "(a + b)(−3 + 2)", "(a − 2)(b + 3)"], "a(b − 3) + 2(b − 3)."]
    ]
  });
  add("1.3.4", {
    life: "Murakkab ko‘ringan ifoda soddalashtirilgach ko‘pincha bitta son yoki oddiy ifodaga aylanadi. Testda javoblar odatda soddalashtirilgan ko‘rinishda beriladi — kim tez soddalashtirsa, o‘sha yutadi.",
    explain: "<p><b>Ayniyat</b> — harflarning barcha joiz qiymatlarida to‘g‘ri bo‘ladigan tenglik. Uni isbotlash uchun bir tomonni ikkinchisiga keltiramiz yoki ayirmasi 0 ekanini ko‘rsatamiz.</p><p><b>Soddalashtirish rejasi:</b></p><ol><li>Har bir kasrning surat va maxrajini ko‘paytuvchilarga ajrating.</li><li>Aniqlanish sohasini yozing (maxraj ≠ 0).</li><li>Qavs ichidagi amallarni umumiy maxrajga keltirib bajaring.</li><li>Ko‘paytirish/bo‘lishda qisqartiring.</li></ol><p><b>Sun’iy usul:</b> ba’zan qiymat berilganda uni o‘rniga qo‘yib, javob variantlarini tekshirish ham yordam beradi (lekin aniqlanish sohasiga e’tibor bering!).</p>",
    rule: "Soddalashtirishdan oldin har bir kasrni ko‘paytuvchilarga ajrating — qisqarishlar o‘zi ko‘rinadi.",
    tip: "Qisqartirish faqat KO‘PAYTUVCHILARNI qisqartiradi: [[(a + b)/a]] ≠ b!",
    ex: [
      ["Soddalashtiring: ([[1/(a − b)]] − [[1/(a + b)]]) · [[(a² − b²)/(2b)]]", ["[[1/(a − b)]] − [[1/(a + b)]] = [[(a + b − a + b)/(a² − b²)]] = [[2b/(a² − b²)]]", "[[2b/(a² − b²)]] · [[(a² − b²)/(2b)]] = 1"], "1"],
      ["Ayniyatni isbotlang: (a + b)² − (a − b)² = 4ab", ["Chap tomon: a² + 2ab + b² − a² + 2ab − b²", "= 4ab = o‘ng tomon ✓"], "Isbotlandi"]
    ],
    qz: [
      ["[[(x² − 9)/(x + 3)]] = ?", ["x − 3", "x + 3", "x − 9", "[[x/3]]"], "(x − 3)(x + 3)/(x + 3)."],
      ["[[a/(a − 1)]] − [[1/(a − 1)]] = ?", ["1", "a", "[[(a + 1)/(a − 1)]]", "0"], "[[(a − 1)/(a − 1)]] = 1."],
      ["[[(a³ − 1)/(a² + a + 1)]] = ?", ["a − 1", "a + 1", "a² − 1", "a"], "a³ − 1 = (a − 1)(a² + a + 1)."]
    ]
  });

  // ===== 1.4 Ildizlar =====
  add("1.4.1", {
    life: "Kvadrat yer maydoni 400 m² — tomoni qancha? √400 = 20 m. Ildizlar geometriya, fizika (masalan, tezlik formulalari) va statistikada doim uchraydi.",
    explain: "<p><b>Arifmetik kvadrat ildiz</b> √a (a ≥ 0) — kvadrati a ga teng bo‘lgan <b>manfiy bo‘lmagan</b> son: √49 = 7 (−7 emas!).</p><span class='fb'>√(ab) = √a · √b, &nbsp; √(a/b) = √a / √b, &nbsp; (√a)² = a, &nbsp; √(a²) = |a|</span><p><b>Ko‘paytuvchini ildiz ostidan chiqarish:</b> √72 = √(36·2) = 6√2. <b>Kiritish:</b> 3√5 = √(9·5) = √45.</p><p><b>Maxrajni irratsionallikdan qutqarish:</b></p><ul><li>[[6/√3]] = [[6√3/3]] = 2√3</li><li>[[1/(√5 − √2)]] = [[(√5 + √2)/(5 − 2)]] = [[(√5 + √2)/3]] (qo‘shmasiga ko‘paytirish)</li></ul>",
    rule: "√(a²) = |a|. √a + √b ≠ √(a + b)!",
    tip: "√(x²) = x deb yozish xato — to‘g‘risi |x|. Masalan, x = −3 da √9 = 3 = |−3|.",
    ex: [
      ["Soddalashtiring: √50 + √18 − √8", ["√50 = 5√2, √18 = 3√2, √8 = 2√2", "5√2 + 3√2 − 2√2 = 6√2"], "6√2"],
      ["Maxrajni irratsionallikdan qutqaring: [[4/(√7 + √3)]]", ["Qo‘shmasiga ko‘paytiramiz: [[4(√7 − √3)/(7 − 3)]]", "= √7 − √3"], "√7 − √3"]
    ],
    qz: [
      ["√(16 · 25) = ?", ["20", "41", "400", "9"], "4 · 5 = 20."],
      ["√12 · √3 = ?", ["6", "36", "√15", "3√2"], "√36 = 6."],
      ["(√5 − 2)(√5 + 2) = ?", ["1", "3", "9", "√5"], "5 − 4 = 1."]
    ]
  });
  add("1.4.2", {
    life: "Ildizli ifodalarni hisoblash — DTMning standart topshirig‘i. Odatda ildiz ostidagi ifoda to‘la kvadrat bo‘lib chiqadi va javob butun son bo‘ladi.",
    explain: "<p><b>Murakkab ildiz (to‘la kvadrat):</b> √(a ± 2√b) ni (√x ± √y)² ko‘rinishida yozamiz, bunda x + y = a, xy = b:</p><span class='fb'>√(7 − 4√3) = √(4 − 2·2√3 + 3) = √((2 − √3)²) = 2 − √3</span><p><b>Muhim:</b> natija manfiy bo‘lmasligi kerak — kattasidan kichigini ayiring: √((1 − √2)²) = √2 − 1.</p><p><b>Darajalar bilan:</b> √(2⁶) = 2³ = 8; √(0,0081) = 0,09.</p><p><b>Taqqoslash:</b> ildiz ostiga kiritib taqqoslang: 2√3 = √12 va 3√2 = √18 → 3√2 katta.</p>",
    rule: "√(a + b ± 2√(ab)) = |√a ± √b|.",
    tip: "√((a − b)²) = |a − b| — modul ichidagi ishorani tekshirishni unutmang.",
    ex: [
      ["Hisoblang: √(11 + 6√2) − √(11 − 6√2)", ["11 + 6√2 = 9 + 2·3·√2 + 2 = (3 + √2)²", "11 − 6√2 = (3 − √2)²", "(3 + √2) − (3 − √2) = 2√2"], "2√2"],
      ["Hisoblang: √(3 − 2√2) + √2", ["3 − 2√2 = (√2 − 1)²", "√(...) = √2 − 1", "√2 − 1 + √2 = 2√2 − 1"], "2√2 − 1"]
    ],
    qz: [
      ["√(4 + 2√3) = ?", ["√3 + 1", "√3 + 2", "2 + √2", "√5"], "(√3 + 1)² = 3 + 2√3 + 1."],
      ["Qaysi biri katta: 2√5 yoki 3√2?", ["2√5", "3√2", "teng", "aniqlab bo‘lmaydi"], "√20 > √18."],
      ["√(0,49) + √(1,44) = ?", ["1,9", "1,93", "0,19", "2,1"], "0,7 + 1,2 = 1,9."]
    ]
  });
  add("1.4.3", {
    life: "Ildizli kasrlarni soddalashtirish — ko‘paytuvchilarga ajratish va qisqa ko‘paytirish formulalarini ildizlar uchun qo‘llash. Asosiy g‘oya: √a ni yangi o‘zgaruvchi deb ko‘rish.",
    explain: "<p>Agar a ≥ 0 bo‘lsa, a = (√a)². Shuning uchun:</p><ul><li>a − b = (√a − √b)(√a + √b)</li><li>a − 2√(ab) + b = (√a − √b)²</li><li>a√a + b√b = (√a)³ + (√b)³ = (√a + √b)(a − √(ab) + b)</li></ul><p><b>Misol:</b> [[(a − b)/(√a − √b)]] = [[(√a − √b)(√a + √b)/(√a − √b)]] = √a + √b.</p><p>Belgilash qulay: √a = x, √b = y. Unda ifoda oddiy ko‘phadlarga aylanadi va tanish formulalar ishlaydi.</p><p>Aniqlanish sohasi: ildiz ostidagi ifoda ≥ 0, maxraj ≠ 0.</p>",
    rule: "a − b = (√a − √b)(√a + √b); &nbsp; √a = x deb belgilang.",
    tip: "Natijani yozishdan oldin a ≥ 0, b ≥ 0 va a ≠ b shartlarini eslang.",
    ex: [
      ["Soddalashtiring: [[(x − 4)/(√x + 2)]]", ["x − 4 = (√x − 2)(√x + 2)", "Qisqartiramiz"], "√x − 2"],
      ["Soddalashtiring: [[(a√a − 1)/(√a − 1)]] − √a", ["a√a − 1 = (√a)³ − 1 = (√a − 1)(a + √a + 1)", "Kasr = a + √a + 1", "a + √a + 1 − √a = a + 1"], "a + 1"]
    ],
    qz: [
      ["[[(a − 9)/(√a − 3)]] = ?", ["√a + 3", "√a − 3", "a + 3", "3"], "(√a − 3)(√a + 3)/(√a − 3)."],
      ["(√x + √y)² − 2√(xy) = ?", ["x + y", "x − y", "4√(xy)", "(x + y)²"], "x + 2√(xy) + y − 2√(xy)."],
      ["[[(x + 2√x + 1)/(√x + 1)]] = ?", ["√x + 1", "√x − 1", "x + 1", "1"], "(√x + 1)²/(√x + 1)."]
    ]
  });
  add("1.4.4", {
    life: "Bankdagi omonat, bakteriyalar soni, radioaktiv parchalanish — kasr va manfiy darajalar bilan yoziladi. 8^(2/3) ni hisoblay olish — ko‘rsatkichli funksiya va logarifmlarga tayyorgarlik.",
    explain: "<p><b>n-darajali ildiz:</b> ⁿ√a — n-darajasi a ga teng son. n juft bo‘lsa a ≥ 0 bo‘lishi shart; n toq bo‘lsa a istalgan son: ∛(−8) = −2.</p><p><b>Daraja xossalari:</b></p><span class='fb'>aᵐ · aⁿ = aᵐ⁺ⁿ, &nbsp; aᵐ : aⁿ = aᵐ⁻ⁿ, &nbsp; (aᵐ)ⁿ = aᵐⁿ, &nbsp; (ab)ⁿ = aⁿbⁿ</span><span class='fb'>a⁰ = 1, &nbsp; a⁻ⁿ = [[1/aⁿ]], &nbsp; a^(m/n) = ⁿ√(aᵐ)</span><p><b>Misollar:</b> 8^(2/3) = (∛8)² = 4; 16^(−3/4) = [[1/(⁴√16)³]] = [[1/8]]; 27^(1/3) = 3.</p><p><b>Ildizlar xossalari:</b> ⁿ√a · ⁿ√b = ⁿ√(ab); ᵐ√(ⁿ√a) = ᵐⁿ√a; ⁿ√(aⁿ) = |a| (n juft), = a (n toq).</p>",
    rule: "a^(m/n) = ⁿ√(aᵐ) = (ⁿ√a)ᵐ. Manfiy daraja — teskari son: a⁻ⁿ = 1/aⁿ.",
    tip: "Kasr darajani hisoblashda avval ildiz chiqaring, keyin darajaga ko‘taring — sonlar kichikroq bo‘ladi: 32^(3/5) = 2³ = 8.",
    ex: [
      ["Hisoblang: 27^(2/3) + 16^(3/4) − 81^(1/4)", ["27^(2/3) = (∛27)² = 9", "16^(3/4) = (⁴√16)³ = 8", "81^(1/4) = 3", "9 + 8 − 3 = 14"], "14"],
      ["Soddalashtiring: (a^(1/2) · a^(1/3)) : a^(1/6)", ["a^(1/2 + 1/3 − 1/6) = a^(3/6 + 2/6 − 1/6)", "= a^(4/6) = a^(2/3)"], "a^(2/3) = ∛(a²)"]
    ],
    qz: [
      ["4^(−3/2) = ?", ["[[1/8]]", "−8", "8", "[[1/6]]"], "(√4)³ = 8, manfiy daraja → [[1/8]]."],
      ["∛(−125) = ?", ["−5", "5", "mavjud emas", "±5"], "Toq darajali ildiz manfiy sondan ham olinadi."],
      ["2⁵ · 2⁻³ : 2⁻¹ = ?", ["8", "2", "4", "16"], "2^(5 − 3 + 1) = 2³."]
    ]
  });

  // ===== 1.5 Tenglamalar =====
  add("1.5.1", {
    life: "“3 ta daftar va 2 ta ruchka 19 ming so‘m, ruchka daftardan 2 ming arzon” — bunday masalalar chiziqli tenglamaga keladi. Proporsiya esa retsept, xarita masshtabi va narx hisob-kitobida ishlatiladi.",
    explain: "<p><b>Chiziqli tenglama:</b> ax = b.</p><ul><li>a ≠ 0 → yagona yechim x = [[b/a]];</li><li>a = 0, b ≠ 0 → yechim yo‘q;</li><li>a = 0, b = 0 → x istalgan son (cheksiz ko‘p yechim).</li></ul><p><b>Yechish tartibi:</b> qavslarni ochamiz → kasrlardan qutulamiz (umumiy maxrajga ko‘paytiramiz) → noma’lumli hadlarni bir tomonga, sonlarni boshqa tomonga o‘tkazamiz (ishora o‘zgaradi) → bo‘lamiz.</p><p><b>Proporsiya:</b> [[a/b]] = [[c/d]] ⇔ ad = bc (chetki hadlar ko‘paytmasi o‘rta hadlar ko‘paytmasiga teng). Noma’lum had: x = [[bc/d]].</p>",
    rule: "[[a/b]] = [[c/d]] ⇔ a·d = b·c. Hadni tenglikning boshqa tomoniga o‘tkazganda ishorasi o‘zgaradi.",
    tip: "Kasrlardan qutulishda HAR BIR hadni umumiy maxrajga ko‘paytiring — sonli hadlarni unutmang.",
    demos: [{ type: "balance", examples: [[3, 5, 0, 20], [2, -4, 0, 10], [5, 3, 2, 18], [4, 7, 1, 31]] }],
    ex: [
      ["Yeching: [[(x − 1)/3]] − [[(x + 2)/4]] = 1", ["12 ga ko‘paytiramiz: 4(x − 1) − 3(x + 2) = 12", "4x − 4 − 3x − 6 = 12", "x − 10 = 12 → x = 22"], "x = 22"],
      ["Proporsiyani yeching: [[3/(x − 2)]] = [[5/(x + 4)]]", ["3(x + 4) = 5(x − 2)", "3x + 12 = 5x − 10", "22 = 2x → x = 11"], "x = 11"]
    ],
    qz: [
      ["3(x − 2) = 2x + 5 → x = ?", ["11", "7", "−1", "3"], "3x − 6 = 2x + 5 → x = 11."],
      ["[[x/4]] = [[15/12]] → x = ?", ["5", "3", "45", "20"], "12x = 60."],
      ["2x + 3 = 2(x + 1) tenglama nechta yechimga ega?", ["Yechimi yo‘q", "1 ta", "2 ta", "Cheksiz ko‘p"], "2x + 3 = 2x + 2 → 3 = 2 — noto‘g‘ri."]
    ]
  });
  add("1.5.2", {
    life: "Tosh balandlikdan tashlandi — qachon yerga tushadi? To‘rtburchak maydon yuzi 60 m², bir tomoni ikkinchisidan 4 m uzun — tomonlari? Bunday masalalar kvadrat tenglamaga keladi.",
    explain: "<p><b>Kvadrat tenglama:</b> ax² + bx + c = 0 (a ≠ 0).</p><span class='fb'>D = b² − 4ac, &nbsp; x₁,₂ = [[(−b ± √D)/(2a)]]</span><ul><li>D > 0 — ikki xil ildiz;</li><li>D = 0 — bitta (ikki karrali) ildiz x = −[[b/(2a)]];</li><li>D < 0 — haqiqiy ildiz yo‘q.</li></ul><p><b>Juft b uchun qulay formula</b> (b = 2k): x = [[(−k ± √(k² − ac))/a]].</p><p><b>To‘liqmas tenglamalar:</b> ax² + bx = 0 → x(ax + b) = 0 → x = 0 yoki x = −b/a; ax² + c = 0 → x² = −c/a.</p><p><b>Tez tekshiruv:</b> a + b + c = 0 bo‘lsa, x₁ = 1, x₂ = c/a; a − b + c = 0 bo‘lsa, x₁ = −1, x₂ = −c/a.</p>",
    rule: "D = b² − 4ac. a + b + c = 0 bo‘lsa, ildizlardan biri 1.",
    tip: "x² = 9 ning ildizlari ±3 — manfiy ildizni unutmang! x² = x da x ga bo‘lib yubormang — x = 0 ildiz yo‘qoladi.",
    demos: [{ type: "fgraph", kind: "quad", title: "Parabola va ildizlar: a, b, c ni o‘zgartiring" }],
    ex: [
      ["Yeching: 2x² − 7x + 3 = 0", ["D = 49 − 24 = 25, √D = 5", "x = (7 ± 5)/4", "x₁ = 3, x₂ = [[1/2]]"], "3 va [[1/2]]"],
      ["Yeching: 5x² − 2x − 3 = 0", ["a + b + c = 5 − 2 − 3 = 0", "x₁ = 1, x₂ = c/a = −[[3/5]]"], "1 va −0,6"]
    ],
    qz: [
      ["x² − 6x + 9 = 0 ning ildizi?", ["3", "−3", "±3", "ildizi yo‘q"], "(x − 3)² = 0, D = 0."],
      ["x² + x + 1 = 0 ning nechta haqiqiy ildizi bor?", ["0", "1", "2", "cheksiz"], "D = 1 − 4 = −3 < 0."],
      ["3x² − 12 = 0 → ildizlar?", ["±2", "2", "4", "±4"], "x² = 4."]
    ]
  });
  add("1.5.3", {
    life: "Tenglamani yechmasdan turib ildizlar yig‘indisi va ko‘paytmasini bilish mumkin! Viyet teoremasi testda vaqtni bir necha barobar tejaydi.",
    explain: "<p>Agar x₁, x₂ — ax² + bx + c = 0 ning ildizlari bo‘lsa:</p><span class='fb'>x₁ + x₂ = −[[b/a]], &nbsp; x₁ · x₂ = [[c/a]]</span><p>Keltirilgan tenglama x² + px + q = 0 uchun: x₁ + x₂ = −p, x₁x₂ = q.</p><p><b>Teskari teorema:</b> yig‘indisi S va ko‘paytmasi P bo‘lgan sonlar x² − Sx + P = 0 ning ildizlari.</p><p><b>Simmetrik ifodalar</b> (ildizlarni topmasdan):</p><ul><li>x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂</li><li>[[1/x₁]] + [[1/x₂]] = [[(x₁ + x₂)/(x₁x₂)]]</li><li>(x₁ − x₂)² = (x₁ + x₂)² − 4x₁x₂</li><li>x₁³ + x₂³ = (x₁ + x₂)³ − 3x₁x₂(x₁ + x₂)</li></ul><p><b>Ishoralar:</b> P > 0 — ildizlar bir xil ishorali; P < 0 — har xil ishorali.</p>",
    rule: "x₁ + x₂ = −b/a, x₁x₂ = c/a. Faqat D ≥ 0 bo‘lsa ma’noga ega!",
    tip: "Viyetni qo‘llashdan oldin D ≥ 0 ekanini tekshiring — aks holda haqiqiy ildizlar yo‘q.",
    ex: [
      ["x² − 5x + 3 = 0. x₁² + x₂² ni toping.", ["x₁ + x₂ = 5, x₁x₂ = 3 (D = 13 > 0)", "x₁² + x₂² = 25 − 6 = 19"], "19"],
      ["Ildizlari 2 va −7 bo‘lgan keltirilgan kvadrat tenglamani tuzing.", ["S = 2 + (−7) = −5, P = −14", "x² − Sx + P = x² + 5x − 14"], "x² + 5x − 14 = 0"]
    ],
    qz: [
      ["x² + 7x − 8 = 0 ildizlari yig‘indisi?", ["−7", "7", "−8", "8"], "x₁ + x₂ = −p = −7."],
      ["2x² − 6x + 1 = 0 ildizlari ko‘paytmasi?", ["[[1/2]]", "3", "1", "−3"], "c/a = 1/2."],
      ["x² − 4x + 1 = 0. [[1/x₁]] + [[1/x₂]] = ?", ["4", "[[1/4]]", "−4", "1"], "(x₁ + x₂)/(x₁x₂) = 4/1."]
    ]
  });
  add("1.5.4", {
    life: "Ikki ishchi birgalikda ishni 6 soatda bajaradi — har biri alohida qancha vaqtda? Ish va harakat masalalarining ko‘pchiligi ratsional (kasrli) tenglamaga keladi.",
    explain: "<p><b>Ratsional tenglama</b> — noma’lum maxrajda qatnashgan tenglama. Yechish rejasi:</p><ol><li><b>ATS</b> (aniqlanish sohasi): barcha maxrajlar ≠ 0.</li><li>Maxrajlarni ko‘paytuvchilarga ajratib, umumiy maxrajni toping.</li><li>Ikki tomonni umumiy maxrajga ko‘paytiring — butun tenglama hosil bo‘ladi.</li><li>Yeching va <b>ATSga tekshiring</b> — begona ildizlarni tashlang.</li></ol><p><b>Proporsiya ko‘rinishi:</b> [[A/B]] = 0 ⇔ A = 0 va B ≠ 0.</p><p><b>Yangi o‘zgaruvchi:</b> x + [[1/x]] = t kabi takrorlanuvchi ifodalarni bitta harf bilan almashtiring.</p>",
    rule: "[[A(x)/B(x)]] = 0 ⇔ A(x) = 0 va B(x) ≠ 0.",
    tip: "Topilgan ildiz maxrajni nolga aylantirsa — u BEGONA ildiz, javobga yozilmaydi!",
    ex: [
      ["Yeching: [[(x² − 9)/(x − 3)]] = 0", ["Surat = 0: x = ±3", "Maxraj ≠ 0: x ≠ 3", "Javob: faqat x = −3"], "x = −3"],
      ["Yeching: [[3/(x − 1)]] + [[2/(x + 1)]] = [[6/(x² − 1)]]", ["ATS: x ≠ ±1. Umumiy maxraj (x − 1)(x + 1)", "3(x + 1) + 2(x − 1) = 6", "5x + 1 = 6 → x = 1 — ATSga kirmaydi!"], "Yechimi yo‘q"]
    ],
    qz: [
      ["[[(x − 2)/(x + 5)]] = 0 → x = ?", ["2", "−5", "2 va −5", "yechim yo‘q"], "Surat 0, maxraj 7 ≠ 0."],
      ["[[x/(x − 4)]] = [[4/(x − 4)]] tenglamaning yechimi?", ["yechim yo‘q", "4", "0", "istalgan x"], "x = 4 maxrajni nolga aylantiradi."],
      ["[[6/x]] = x − 1 → musbat ildiz?", ["3", "2", "6", "1"], "x² − x − 6 = 0 → x = 3 yoki −2."]
    ]
  });
  add("1.5.5", {
    life: "Parametr — “harfli son”. Tenglama a ning qanday qiymatlarida yechimga ega? Bunday savollar DTMning eng murakkab topshiriqlari qatorida, lekin chiziqli holatda juda oddiy qoidaga bo‘ysunadi.",
    explain: "<p>Tenglamani <b>ax = b</b> ko‘rinishiga keltiramiz (a va b parametrga bog‘liq bo‘lishi mumkin). Keyin uch holatni tekshiramiz:</p><table class='oq-t'><tr><th>Shart</th><th>Natija</th></tr><tr><td>a ≠ 0</td><td>yagona yechim x = b/a</td></tr><tr><td>a = 0, b ≠ 0</td><td>yechimi yo‘q</td></tr><tr><td>a = 0, b = 0</td><td>cheksiz ko‘p yechim</td></tr></table><p><b>Misol:</b> (m − 2)x = m² − 4.</p><ul><li>m ≠ 2: x = [[(m² − 4)/(m − 2)]] = m + 2;</li><li>m = 2: 0·x = 0 → istalgan x.</li></ul><p>Agar x ga qo‘shimcha shart bo‘lsa (masalan, x > 0), topilgan formulaga shu shartni qo‘yamiz.</p>",
    rule: "ax = b: a ≠ 0 → bitta yechim; a = 0, b ≠ 0 → yo‘q; a = b = 0 → cheksiz.",
    tip: "Koeffitsientga bo‘lishdan oldin u nolga teng emasligini alohida tekshiring.",
    ex: [
      ["a ning qanday qiymatida (a² − 1)x = a + 1 yechimga ega emas?", ["a² − 1 = 0 → a = ±1", "a = 1: 0·x = 2 — yechim yo‘q ✓", "a = −1: 0·x = 0 — cheksiz ko‘p"], "a = 1"],
      ["k ning qanday qiymatida kx + 3 = 2x + k tenglamaning ildizi 2 ga teng?", ["x = 2 ni qo‘yamiz: 2k + 3 = 4 + k", "k = 1"], "k = 1"]
    ],
    qz: [
      ["(a − 3)x = 5 tenglama a ning qaysi qiymatida yechimga ega emas?", ["3", "0", "5", "−3"], "a = 3 da 0·x = 5."],
      ["m(m − 1)x = m tenglama cheksiz ko‘p yechimga ega bo‘ladigan m?", ["0", "1", "−1", "bunday m yo‘q"], "m = 0: 0·x = 0."],
      ["ax = a² tenglama a ≠ 0 da yechimi?", ["x = a", "x = a²", "x = 1", "x = 0"], "x = a²/a = a."]
    ]
  });
  add("1.5.6", {
    life: "Parametrli kvadrat tenglamalar — “ildizlar nechta va qanday bo‘ladi?” degan savolga D va Viyet orqali javob berish. Bu mavzu oliy matematika uslubida fikrlashni o‘rgatadi.",
    explain: "<p><b>Asosiy savollar va shartlar</b> (ax² + bx + c = 0):</p><table class='oq-t'><tr><th>Savol</th><th>Shart</th></tr><tr><td>Ikki xil ildiz</td><td>a ≠ 0, D > 0</td></tr><tr><td>Bitta ildiz</td><td>a ≠ 0 va D = 0, <b>yoki</b> a = 0 (chiziqli bo‘lib qoladi, b ≠ 0)</td></tr><tr><td>Ildiz yo‘q</td><td>a ≠ 0, D < 0</td></tr><tr><td>Ikkala ildiz musbat</td><td>D ≥ 0, x₁ + x₂ > 0, x₁x₂ > 0</td></tr><tr><td>Ikkala ildiz manfiy</td><td>D ≥ 0, x₁ + x₂ < 0, x₁x₂ > 0</td></tr><tr><td>Har xil ishorali</td><td>x₁x₂ = c/a < 0 (D avtomatik > 0)</td></tr></table><p><b>Muhim:</b> bosh koeffitsient parametrga bog‘liq bo‘lsa (masalan (m − 1)x² + …), a = 0 holatini alohida ko‘rib chiqing!</p>",
    rule: "Ildizlar har xil ishorali ⇔ c/a < 0. Bosh koeffitsient = 0 holatini unutmang.",
    tip: "“Tenglama bitta ildizga ega” — faqat D = 0 emas, a = 0 holati ham bo‘lishi mumkin!",
    demos: [{ type: "fgraph", kind: "quad", title: "c ni o‘zgartirib ko‘ring: D qachon nolga teng?" }],
    ex: [
      ["m ning qanday qiymatida x² − 6x + m = 0 bitta ildizga ega?", ["D = 36 − 4m = 0", "m = 9"], "m = 9"],
      ["k ning qanday qiymatlarida x² + 2x + k = 0 ikki xil ildizga ega?", ["D = 4 − 4k > 0", "k < 1"], "k < 1"]
    ],
    qz: [
      ["x² + px + 16 = 0 bitta ildizga ega. p = ?", ["±8", "8", "16", "±4"], "p² − 64 = 0."],
      ["a ning qanday qiymatida x² − 4x + a = 0 ildizlari har xil ishorali?", ["a < 0", "a > 4", "a < 4", "a > 0"], "x₁x₂ = a < 0."],
      ["(m − 2)x² + 3x − 1 = 0 tenglama m = 2 da nechta ildizga ega?", ["1", "2", "0", "cheksiz"], "3x − 1 = 0 — chiziqli, bitta ildiz."]
    ]
  });

  // ===== 1.6 Tenglamalar sistemasi =====
  add("1.6.1", {
    life: "“Olma va nokning narxi birga 12 ming, 3 ta olma va 2 ta nok 31 ming” — ikki noma’lumli masalalar sistemaga keladi. Iqtisod, fizika va kimyoda bu eng ko‘p ishlatiladigan usul.",
    explain: "<p>Ikki noma’lumli chiziqli sistema: { a₁x + b₁y = c₁; a₂x + b₂y = c₂ }.</p><p><b>Usullar:</b></p><ol><li><b>O‘rniga qo‘yish:</b> bir tenglamadan x (yoki y) ni ifodalab, ikkinchisiga qo‘yamiz.</li><li><b>Qo‘shish (ayirish):</b> tenglamalarni shunday songa ko‘paytiramizki, bitta noma’lum oldidagi koeffitsientlar qarama-qarshi bo‘lsin, keyin qo‘shamiz.</li><li><b>Grafik:</b> har bir tenglama — to‘g‘ri chiziq; yechim — kesishish nuqtasi.</li></ol><p><b>Yechimlar soni:</b></p><ul><li>[[a₁/a₂]] ≠ [[b₁/b₂]] — yagona yechim (chiziqlar kesishadi);</li><li>[[a₁/a₂]] = [[b₁/b₂]] ≠ [[c₁/c₂]] — yechim yo‘q (parallel);</li><li>[[a₁/a₂]] = [[b₁/b₂]] = [[c₁/c₂]] — cheksiz ko‘p (ustma-ust tushadi).</li></ul>",
    rule: "Koeffitsientlar nisbati: a₁/a₂ ≠ b₁/b₂ → bitta yechim; teng, lekin c ga teng emas → yo‘q; hammasi teng → cheksiz.",
    tip: "Topilgan juftlikni ikkala tenglamaga qo‘yib tekshiring — bu 10 soniya oladi, lekin xatodan saqlaydi.",
    ex: [
      ["Yeching: { 3x + 2y = 16; 5x − 2y = 0 }", ["Qo‘shamiz: 8x = 16 → x = 2", "3·2 + 2y = 16 → y = 5"], "(2; 5)"],
      ["a ning qanday qiymatida { 2x + 3y = 5; 4x + ay = 7 } yechimga ega emas?", ["2/4 = 3/a ≠ 5/7", "a = 6", "5/7 ≠ 1/2 ✓"], "a = 6"]
    ],
    qz: [
      ["{ x + y = 10; x − y = 4 } → x · y = ?", ["21", "24", "16", "25"], "x = 7, y = 3."],
      ["{ 2x − y = 1; 4x − 2y = 2 } sistema nechta yechimga ega?", ["Cheksiz ko‘p", "1", "0", "2"], "Ikkinchi tenglama birinchisining 2 barobari."],
      ["{ y = 2x; x + y = 9 } → y = ?", ["6", "3", "9", "4"], "3x = 9 → x = 3, y = 6."]
    ]
  });
  add("1.6.2", {
    life: "To‘g‘ri chiziq va parabola qayerda kesishadi? To‘rtburchakning perimetri va yuzi berilgan — tomonlarini toping. Bunday masalalar chiziqli va kvadrat tenglamadan iborat sistemaga keladi.",
    explain: "<p>Sistemada bitta tenglama chiziqli, ikkinchisi ikkinchi darajali bo‘lsa — <b>o‘rniga qo‘yish</b> usuli eng qulay:</p><ol><li>Chiziqli tenglamadan bitta noma’lumni ifodalang: y = … .</li><li>Ikkinchi tenglamaga qo‘ying — kvadrat tenglama hosil bo‘ladi.</li><li>Uni yeching va har bir ildiz uchun ikkinchi noma’lumni toping.</li></ol><p><b>Simmetrik sistema:</b> { x + y = S; xy = P } — Viyet teoremasiga ko‘ra x va y — t² − St + P = 0 ning ildizlari.</p><p>Odatda ikkita juftlik yechim chiqadi — ikkalasini ham yozing.</p>",
    rule: "{ x + y = S; xy = P } → x, y — t² − St + P = 0 ning ildizlari.",
    tip: "Har bir x uchun mos y ni topishni unutmang — javob juftliklardan iborat.",
    ex: [
      ["Yeching: { x + y = 7; xy = 12 }", ["t² − 7t + 12 = 0 → t = 3 yoki 4", "(3; 4) va (4; 3)"], "(3; 4), (4; 3)"],
      ["Yeching: { y − x = 1; x² + y² = 25 }", ["y = x + 1 → x² + (x + 1)² = 25", "2x² + 2x − 24 = 0 → x² + x − 12 = 0", "x = 3 → y = 4; x = −4 → y = −3"], "(3; 4), (−4; −3)"]
    ],
    qz: [
      ["{ x − y = 2; xy = 15 } musbat yechimda x + y = ?", ["8", "2", "15", "17"], "x = 5, y = 3."],
      ["To‘rtburchak perimetri 20, yuzi 24. Tomonlari?", ["6 va 4", "8 va 3", "12 va 2", "5 va 5"], "x + y = 10, xy = 24."],
      ["{ y = x + 2; y = x² } nechta yechim?", ["2", "1", "0", "3"], "x² − x − 2 = 0, D = 9 > 0."]
    ]
  });
  add("1.6.3", {
    life: "Ikkala tenglama ham ikkinchi darajali bo‘lsa, maxsus usullar kerak: qo‘shish, bo‘lish, yangi o‘zgaruvchi kiritish. Bu mavzu algebraik “zukkolik”ni talab qiladi.",
    explain: "<p><b>Asosiy usullar:</b></p><ol><li><b>Qo‘shish/ayirish:</b> { x² + y² = 13; x² − y² = 5 } → 2x² = 18.</li><li><b>Yangi o‘zgaruvchi:</b> u = x + y, v = xy. Bunda x² + y² = u² − 2v, x³ + y³ = u³ − 3uv.</li><li><b>Bir jinsli tenglama:</b> x² − 3xy + 2y² = 0 → y² ga bo‘lib, t = x/y uchun t² − 3t + 2 = 0 → x = y yoki x = 2y.</li><li><b>Tenglamalarni ko‘paytirish/bo‘lish:</b> { x²y = 12; xy² = 18 } → bo‘lsak x/y = 2/3.</li></ol>",
    rule: "x² + y² = (x + y)² − 2xy; x³ + y³ = (x + y)³ − 3xy(x + y).",
    tip: "Bir jinsli tenglamada y ga bo‘lishdan oldin y = 0 holatini alohida tekshiring.",
    ex: [
      ["Yeching: { x² + y² = 13; xy = 6 }", ["(x + y)² = 13 + 12 = 25 → x + y = ±5", "x + y = 5, xy = 6 → (2; 3), (3; 2)", "x + y = −5, xy = 6 → (−2; −3), (−3; −2)"], "4 ta juftlik: (2;3), (3;2), (−2;−3), (−3;−2)"],
      ["Yeching: { x² − y² = 16; x + y = 8 }", ["x² − y² = (x − y)(x + y) → 8(x − y) = 16", "x − y = 2, x + y = 8", "x = 5, y = 3"], "(5; 3)"]
    ],
    qz: [
      ["{ x² + y² = 10; x + y = 4 } → xy = ?", ["3", "6", "−3", "4"], "16 − 2xy = 10."],
      ["{ x² − y² = 21; x − y = 3 } → x = ?", ["5", "7", "2", "4"], "x + y = 7, x − y = 3."],
      ["{ x³ + y³ = 9; x + y = 3 } → xy = ?", ["2", "3", "1", "6"], "27 − 9xy = 9."]
    ]
  });
  add("1.6.4", {
    life: "Parametrli sistemalar — “sistema qachon yagona yechimga ega?” degan savollar. Grafik tasavvur (to‘g‘ri chiziqlar, aylanalar) bu yerda eng kuchli yordamchi.",
    explain: "<p><b>Chiziqli sistema</b> { a₁x + b₁y = c₁; a₂x + b₂y = c₂ } uchun:</p><ul><li>yagona yechim: a₁b₂ − a₂b₁ ≠ 0;</li><li>yechim yo‘q: a₁/a₂ = b₁/b₂ ≠ c₁/c₂;</li><li>cheksiz ko‘p: a₁/a₂ = b₁/b₂ = c₁/c₂.</li></ul><p><b>Grafik usul:</b> x² + y² = R² — markazi koordinata boshida, radiusi R bo‘lgan aylana. To‘g‘ri chiziq aylanaga urinsa — bitta yechim, kessa — ikkita, uchrashmasa — yo‘q.</p><p><b>Yechimni shartga bo‘ysundirish:</b> x va y ni parametr orqali ifodalab, berilgan shartni (masalan x > 0, y > 0) tengsizlik sifatida yeching.</p>",
    rule: "Yagona yechim ⇔ a₁b₂ ≠ a₂b₁ (chiziqlar parallel emas).",
    tip: "Parametr qiymatini topgach, uni sistemaga qo‘yib, haqiqatan ham kerakli holat chiqishini tekshiring.",
    ex: [
      ["k ning qanday qiymatida { kx + 2y = 3; 8x + ky = 6 } cheksiz ko‘p yechimga ega?", ["k/8 = 2/k = 3/6 = 1/2", "k/8 = 1/2 → k = 4; 2/k = 1/2 → k = 4 ✓"], "k = 4"],
      ["a ning qanday qiymatida { x + y = a; x − y = 2 } yechimi musbat sonlardan iborat?", ["x = (a + 2)/2, y = (a − 2)/2", "x > 0 → a > −2; y > 0 → a > 2"], "a > 2"]
    ],
    qz: [
      ["{ 2x + ay = 1; 4x + 6y = 3 } yechimga ega emas. a = ?", ["3", "6", "2", "1,5"], "2/4 = a/6 → a = 3, 1/3 ≠ 1/2."],
      ["{ x + 2y = 5; 3x + my = 7 } yagona yechimga ega bo‘lmaydigan m?", ["6", "3", "2", "0"], "1/3 = 2/m → m = 6."],
      ["{ x² + y² = 4; y = b } bitta yechimga ega bo‘ladigan musbat b?", ["2", "4", "1", "√2"], "Gorizontal chiziq aylanaga yuqoridan urinadi: b = R = 2."]
    ]
  });

  // ===== 1.7 Tengsizliklar =====
  add("1.7.1", {
    life: "“Taksi chaqiruvi 5 ming + har km 2 ming. 25 mingdan oshmaslik uchun necha km yurish mumkin?” — 5 + 2x ≤ 25. Tengsizliklar cheklovlar va shartlar tilidir.",
    explain: "<p><b>Chiziqli tengsizlik:</b> ax > b (yoki <, ≥, ≤).</p><p><b>Asosiy qoidalar:</b></p><ul><li>Ikkala tomonga bir xil son qo‘shish/ayirish mumkin.</li><li>Musbat songa ko‘paytirish/bo‘lishda belgi <b>saqlanadi</b>.</li><li>Manfiy songa ko‘paytirish/bo‘lishda belgi <b>teskarisiga o‘zgaradi</b>: −2x < 6 → x > −3.</li></ul><p><b>Javobni yozish:</b> oraliqlar bilan. x > 3 → (3; +∞); x ≤ −1 → (−∞; −1]. Qavs ( ) — chegara kirmaydi, [ ] — kiradi.</p><p><b>Son o‘qida</b>: qat’iy tengsizlikda nuqta “bo‘sh” (○), noqat’iyda “to‘la” (●).</p>",
    rule: "Manfiy songa ko‘paytirish yoki bo‘lishda tengsizlik belgisi teskarisiga o‘zgaradi.",
    tip: "−3x ≥ 12 → x ≤ −4 (belgini almashtirishni unutmang!). Cheksizlik oldida doim yumaloq qavs.",
    ex: [
      ["Yeching: 3 − 2x ≥ 5x − 11", ["−2x − 5x ≥ −11 − 3", "−7x ≥ −14", "−7 ga bo‘lamiz, belgi o‘zgaradi: x ≤ 2"], "x ∈ (−∞; 2]"],
      ["Yeching: [[(x − 1)/2]] − [[x/3]] < 1", ["6 ga ko‘paytiramiz: 3(x − 1) − 2x < 6", "x − 3 < 6 → x < 9"], "x ∈ (−∞; 9)"]
    ],
    qz: [
      ["−4x > 8 → ?", ["x < −2", "x > −2", "x < 2", "x > 2"], "−4 ga bo‘lsak belgi o‘zgaradi."],
      ["2x − 5 ≤ 7 tengsizlikning eng katta butun yechimi?", ["6", "5", "7", "12"], "x ≤ 6."],
      ["5 − x < 2 → ?", ["x > 3", "x < 3", "x > −3", "x < −3"], "−x < −3 → x > 3."]
    ]
  });
  add("1.7.2", {
    life: "“Harorat 18° dan past bo‘lmasin va 25° dan oshmasin” — bu ikki shart birga, ya’ni tengsizliklar sistemasi. Yechim — ikkala shartni qanoatlantiruvchi umumiy qism.",
    explain: "<p><b>Sistema</b> { f(x) > 0; g(x) > 0 } — ikkala tengsizlik bir vaqtda bajariladi. Har birini alohida yechib, son o‘qida <b>kesishma</b>sini (umumiy qismini) olamiz.</p><p><b>Qo‘sh tengsizlik:</b> −3 < 2x + 1 ≤ 7 → har bir qismdan 1 ni ayiramiz: −4 < 2x ≤ 6 → −2 < x ≤ 3.</p><p><b>To‘plam</b> (kvadrat qavs bilan, “yoki”) — birlashma: x < −1 yoki x > 4 → (−∞; −1) ∪ (4; +∞).</p><p>Kesishma bo‘sh bo‘lsa, sistemaning yechimi yo‘q: { x > 5; x < 2 } → ∅.</p>",
    rule: "Sistema → kesishma (∩), to‘plam → birlashma (∪).",
    tip: "Sistemada “butun yechimlar soni”ni so‘rasa, chegaralar kirish-kirmasligiga diqqat qiling.",
    ex: [
      ["Yeching: { 2x − 3 > 1; 3x + 1 ≤ 16 }", ["2x > 4 → x > 2", "3x ≤ 15 → x ≤ 5", "Kesishma: 2 < x ≤ 5"], "(2; 5]"],
      ["−1 ≤ [[(3 − x)/2]] < 4 qo‘sh tengsizlikni yeching.", ["2 ga ko‘paytiramiz: −2 ≤ 3 − x < 8", "3 ni ayiramiz: −5 ≤ −x < 5", "−1 ga ko‘paytiramiz: −5 < x ≤ 5"], "(−5; 5]"]
    ],
    qz: [
      ["{ x > −2; x ≤ 3 } butun yechimlari soni?", ["5", "6", "4", "3"], "−1, 0, 1, 2, 3."],
      ["{ x ≥ 4; x < 1 } sistemaning yechimi?", ["Yechim yo‘q", "(1; 4)", "[1; 4]", "barcha sonlar"], "Kesishma bo‘sh."],
      ["1 < 2x − 1 < 7 → ?", ["1 < x < 4", "0 < x < 3", "1 < x < 3", "2 < x < 8"], "2 < 2x < 8."]
    ]
  });
  add("1.7.3", {
    life: "Kvadrat va ratsional tengsizliklarning universal yechish usuli — oraliqlar usuli. U bitta qoidaga asoslanadi: ifoda o‘z ildizlaridan o‘tgandagina ishorasini o‘zgartiradi.",
    explain: "<p><b>Oraliqlar usuli rejasi:</b></p><ol><li>Tengsizlikni f(x) > 0 (yoki <, ≥, ≤) ko‘rinishiga keltiring, bir tomonda 0 qolsin.</li><li>f(x) ni ko‘paytuvchilarga ajrating: (x − x₁)(x − x₂)… va [[…/…]].</li><li>Surat va maxrajning ildizlarini son o‘qiga qo‘ying (maxraj ildizlari doim “bo‘sh” nuqta).</li><li>Eng o‘ng oraliqda ishorani aniqlang (barcha qavslar (x − a) ko‘rinishida bo‘lsa, “+”).</li><li>Har bir oddiy ildizdan o‘tganda ishora almashadi; <b>juft karrali</b> ildizdan (masalan (x − 1)²) o‘tganda almashmaydi.</li></ol><p><b>Kvadrat tengsizlik</b> ax² + bx + c > 0: a > 0 bo‘lsa, ildizlar orasida manfiy, tashqarisida musbat.</p>",
    rule: "Ildizdan o‘tganda ishora almashadi (juft karrali ildizdan tashqari). Maxraj ildizlari javobga kirmaydi.",
    tip: "(3 − x) kabi qavslarni −(x − 3) qilib yozing — aks holda eng o‘ngdagi ishora “−” bo‘ladi.",
    demos: [{ type: "signChart" }],
    ex: [
      ["Yeching: x² − x − 6 < 0", ["Ildizlar: (x − 3)(x + 2) = 0 → −2 va 3", "a = 1 > 0 → ildizlar orasida manfiy", "−2 < x < 3"], "(−2; 3)"],
      ["Yeching: [[(x − 1)(x + 4)/(x − 3)]] ≥ 0", ["Ildizlar: −4, 1 (to‘la nuqta), 3 (bo‘sh — maxraj)", "Ishoralar o‘ngdan: + | − | + | −", "“+” oraliqlar: [−4; 1] va (3; +∞)"], "[−4; 1] ∪ (3; +∞)"]
    ],
    qz: [
      ["x² − 9 ≥ 0 → ?", ["(−∞; −3] ∪ [3; +∞)", "[−3; 3]", "(−3; 3)", "x ≥ 3"], "Ildizlar tashqarisi."],
      ["[[(x + 2)/(x − 5)]] < 0 → ?", ["(−2; 5)", "(−∞; −2)", "[−2; 5)", "(5; +∞)"], "Ildizlar orasida manfiy."],
      ["(x − 1)²(x − 4) > 0 → ?", ["(4; +∞)", "(1; 4)", "(−∞; 1) ∪ (4; +∞)", "x ≠ 1"], "(x − 1)² ≥ 0, ishora (x − 4) ga bog‘liq, x = 1 da 0."]
    ]
  });
  add("1.7.4", {
    life: "Parametrli tengsizliklar — “a ning qanday qiymatida tengsizlik barcha x lar uchun bajariladi?” Bunday savollar kvadrat uchhad grafigini tasavvur qilish orqali oson yechiladi.",
    explain: "<p><b>Kvadrat uchhad ax² + bx + c ning ishorasi:</b></p><table class='oq-t'><tr><th>Savol</th><th>Shart</th></tr><tr><td>Barcha x da &gt; 0</td><td>a > 0 va D < 0</td></tr><tr><td>Barcha x da ≥ 0</td><td>a > 0 va D ≤ 0</td></tr><tr><td>Barcha x da &lt; 0</td><td>a < 0 va D < 0</td></tr><tr><td>Yechimi yo‘q (&gt; 0)</td><td>a < 0 va D ≤ 0</td></tr></table><p>Grafik ma’nosi: parabola butunlay Ox dan yuqorida (yoki pastda) yotadi.</p><p><b>Chiziqli</b> ax > b uchun: a > 0 → x > b/a; a < 0 → x < b/a; a = 0 → b < 0 bo‘lsa barcha x, b ≥ 0 bo‘lsa yechim yo‘q.</p><p>Bosh koeffitsient parametrli bo‘lsa — a = 0 holatini alohida tekshiring.</p>",
    rule: "ax² + bx + c > 0 barcha x da ⇔ a > 0, D < 0.",
    tip: "(m − 1)x² + … ko‘rinishida m = 1 da tengsizlik chiziqli bo‘lib qoladi — uni ham tekshiring.",
    demos: [{ type: "fgraph", kind: "quad", title: "Parabola butunlay Ox dan yuqorida qachon bo‘ladi?" }],
    ex: [
      ["m ning qanday qiymatlarida x² + 4x + m > 0 barcha x da bajariladi?", ["a = 1 > 0 ✓", "D = 16 − 4m < 0 → m > 4"], "m > 4"],
      ["a ning qanday qiymatlarida −x² + 2x + a < 0 barcha x da bajariladi?", ["Bosh koeffitsient −1 < 0 ✓", "D = 4 + 4a < 0 → a < −1"], "a < −1"]
    ],
    qz: [
      ["x² − 6x + k ≥ 0 barcha x da bajariladigan eng kichik k?", ["9", "6", "36", "3"], "D = 36 − 4k ≤ 0 → k ≥ 9."],
      ["x² + px + 1 > 0 barcha x da bajariladi. p ning oralig‘i?", ["(−2; 2)", "[−2; 2]", "p > 2", "p < −2"], "p² − 4 < 0."],
      ["ax > 3 tengsizlik a = 0 da?", ["yechimi yo‘q", "barcha x", "x > 0", "x > 3"], "0 > 3 — noto‘g‘ri."]
    ]
  });
  add("1.7.5", {
    life: "Ikki son yig‘indisi o‘zgarmas bo‘lsa, ko‘paytmasi qachon eng katta bo‘ladi? Bunday savollar Koshi tengsizligi bilan bir zumda yechiladi va geometriyada ham (eng katta yuz) qo‘llaniladi.",
    explain: "<p><b>Asosiy g‘oya:</b> har qanday sonning kvadrati manfiy emas: (a − b)² ≥ 0. Undan ko‘plab tengsizliklar kelib chiqadi:</p><span class='fb'>a² + b² ≥ 2ab</span><span class='fb'>[[(a + b)/2]] ≥ √(ab) &nbsp; (a, b ≥ 0) — Koshi tengsizligi</span><span class='fb'>a + [[1/a]] ≥ 2 &nbsp; (a > 0)</span><p>Tenglik faqat a = b (yoki a = 1) bo‘lganda bajariladi.</p><p><b>Natija:</b> yig‘indisi S bo‘lgan ikki musbat sonning ko‘paytmasi eng katta bo‘ladi, agar ular teng bo‘lsa: max(ab) = [[S²/4]]. Perimetri berilgan to‘rtburchaklar ichida eng katta yuzga ega bo‘lgani — kvadrat.</p><p><b>Isbotlash usuli:</b> ayirmani tuzing va uning ishorasini ko‘rsating (to‘la kvadrat ajratib).</p>",
    rule: "O‘rta arifmetik ≥ o‘rta geometrik: (a + b)/2 ≥ √(ab). a + 1/a ≥ 2.",
    tip: "Koshi tengsizligi faqat MANFIY BO‘LMAGAN sonlar uchun to‘g‘ri.",
    ex: [
      ["x > 0 bo‘lsa, x + [[9/x]] ning eng kichik qiymatini toping.", ["Koshi: x + 9/x ≥ 2√(x · 9/x) = 2·3 = 6", "Tenglik: x = 9/x → x = 3"], "6 (x = 3 da)"],
      ["Perimetri 40 m bo‘lgan to‘rtburchakning eng katta yuzi?", ["Tomonlar yig‘indisi a + b = 20", "ab ≤ (20/2)² = 100, tenglik a = b = 10 da"], "100 m² (kvadrat)"]
    ],
    qz: [
      ["a > 0 da a + [[1/a]] ning eng kichik qiymati?", ["2", "1", "0", "4"], "Koshi tengsizligi."],
      ["x + y = 10, x, y > 0. xy ning eng katta qiymati?", ["25", "20", "50", "100"], "(10/2)² = 25."],
      ["Qaysi biri doim to‘g‘ri?", ["a² + 1 ≥ 2a", "a² ≥ a", "a + 1 > 2a", "a² > 0"], "(a − 1)² ≥ 0."]
    ]
  });
})();
