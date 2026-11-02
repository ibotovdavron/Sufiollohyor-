/* Matematika MASTER — 5–8-modullar: Kombinatorika, Planimetriya, Stereometriya, Vektorlar. */
window.MASTER = window.MASTER || [];
(() => {
  const T = (mod, o) => window.MASTER.push({ mod, ...o });

  // ===================== 5. KOMBINATORIKA VA TO'PLAMLAR =====================
  T(5, {
    id: "toplamlar-mantiq", title: "To‘plamlar nazariyasi va mantiqiy mulohazalar", tag: "Birlashma, kesishma, Eyler–Venn diagrammalari",
    life: "“Sinfda 30 o‘quvchi: 18 tasi futbol, 15 tasi shaxmat bilan shug‘ullanadi, 6 tasi ikkalasi bilan. Nechtasi hech biri bilan?” — bunday savollar Eyler–Venn diagrammasi bilan bir zumda yechiladi.",
    explain: "<p><b>To‘plam</b> — elementlar majmui: A = {1, 2, 3}. a ∈ A — a element A ga tegishli. ∅ — bo‘sh to‘plam.</p><p><b>Amallar:</b></p><ul><li><b>Birlashma</b> A ∪ B — kamida bittasiga tegishli elementlar (“yoki”).</li><li><b>Kesishma</b> A ∩ B — ikkalasiga tegishli (“va”).</li><li><b>Ayirma</b> A \\ B — A da bor, B da yo‘q.</li><li><b>To‘ldiruvchi</b> Ā — universal to‘plamda A ga kirmaganlar.</li><li><b>Qism to‘plam</b> A ⊂ B — A ning har bir elementi B da.</li></ul><span class='fb'>n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</span><span class='fb'>n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(A∩C) − n(B∩C) + n(A∩B∩C)</span><p>n elementli to‘plamning qism to‘plamlari soni 2ⁿ.</p><p><b>Mantiq:</b> “va” (∧) — ikkalasi rost bo‘lsa rost; “yoki” (∨) — kamida biri rost bo‘lsa rost; inkor (¬) — teskari. “Hamma” ning inkori — “kamida bittasi … emas”.</p>",
    rule: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Qism to‘plamlar soni 2ⁿ.",
    tip: "“Faqat futbol” = futbol − ikkalasi. Diagrammani markazdan (kesishmadan) to‘ldiring.",
    demos: [{ type: "venn" }],
    ex: [
      ["A = {1, 2, 3, 4, 5}, B = {4, 5, 6, 7}. A ∪ B, A ∩ B, A \\ B?", ["A ∪ B = {1, 2, 3, 4, 5, 6, 7}", "A ∩ B = {4, 5}", "A \\ B = {1, 2, 3}"], "{1..7}, {4; 5}, {1; 2; 3}"],
      ["30 o‘quvchidan 18 tasi ingliz, 14 tasi rus tilini o‘rganadi, 5 tasi ikkalasini. Nechtasi hech birini o‘rganmaydi?", ["Kamida bittasi: 18 + 14 − 5 = 27", "30 − 27 = 3"], "3 o‘quvchi"],
      ["{a, b, c, d} to‘plamning nechta qism to‘plami bor?", ["2⁴ = 16 (∅ va o‘zi bilan birga)"], "16"]
    ],
    qz: [
      ["A = {2, 4, 6}, B = {4, 6, 8}. n(A ∪ B) = ?", ["4", "6", "2", "3"], "{2, 4, 6, 8}."],
      ["n(A) = 10, n(B) = 8, n(A ∩ B) = 3. n(A ∪ B) = ?", ["15", "18", "21", "13"], "10 + 8 − 3."],
      ["3 elementli to‘plamning qism to‘plamlari soni?", ["8", "6", "9", "3"], "2³."],
      ["“Barcha o‘quvchilar a’lochi” jumlasining inkori?", ["Kamida bitta o‘quvchi a’lochi emas", "Hech kim a’lochi emas", "Barchasi a’lochi emas", "Ba’zilari a’lochi"], "Hamma → kamida bittasi … emas."],
      ["A ⊂ B bo‘lsa, A ∩ B = ?", ["A", "B", "∅", "A ∪ B"], "A ning hamma elementi B da."]
    ]
  });
  T(5, {
    id: "kombinatorika", title: "Kombinatorika elementlari", tag: "O‘rin almashtirish, guruhlash, kombinatsiyalar",
    life: "Telefon parolini necha xil tuzish mumkin? Futbol jamoasidan sardor va o‘rinbosarni necha usulda tanlash mumkin? Kombinatorika — “nechta usul bor?” degan savol fani.",
    explain: "<p><b>Ko‘paytirish qoidasi:</b> birinchi tanlov m usulda, ikkinchisi n usulda bo‘lsa — jami m·n usul. <b>Qo‘shish qoidasi:</b> “yoki” — m + n.</p><p><b>Faktorial:</b> n! = 1·2·…·n; 0! = 1. 5! = 120, 6! = 720.</p><table class='oq-t'><tr><th>Turi</th><th>Tartib muhimmi?</th><th>Formula</th></tr><tr><td>O‘rin almashtirish (barchasi)</td><td>ha</td><td>Pₙ = n!</td></tr><tr><td>O‘rinlashtirish (k tasi)</td><td>ha</td><td>Aₙᵏ = [[n!/(n − k)!]]</td></tr><tr><td>Guruhlash (k tasi)</td><td>yo‘q</td><td>Cₙᵏ = [[n!/(k!(n − k)!)]]</td></tr></table><p><b>Xossalar:</b> Cₙᵏ = Cₙⁿ⁻ᵏ; Cₙ⁰ = Cₙⁿ = 1; Cₙ¹ = n; Cₙ² = n(n − 1)/2 (masalan, n kishining qo‘l berib ko‘rishishlari soni).</p><p><b>Takrorli o‘rinlashtirish:</b> n xil belgidan k uzunlikdagi so‘zlar soni nᵏ (masalan, 4 xonali PIN kod: 10⁴).</p>",
    rule: "Tartib muhim → A; tartib muhim emas → C. Cₙᵏ = n!/(k!(n − k)!).",
    tip: "“Sardor va o‘rinbosar” — tartib muhim (A); “2 kishilik guruh” — tartib muhim emas (C).",
    demos: [{ type: "combi" }],
    ex: [
      ["“KITOB” so‘zi harflaridan nechta har xil “so‘z” tuzish mumkin?", ["5 ta har xil harf, barchasini tartiblaymiz", "P₅ = 5! = 120"], "120"],
      ["10 kishilik guruhdan rais va kotibni necha usulda saylash mumkin?", ["Tartib muhim: A₁₀² = 10·9"], "90"],
      ["8 kishi bir-biri bilan qo‘l berib ko‘rishdi. Nechta qo‘l berish bo‘ldi?", ["Har juftlik bir marta: C₈² = 8·7/2"], "28"]
    ],
    qz: [
      ["4! = ?", ["24", "16", "12", "10"], "1·2·3·4."],
      ["C₆² = ?", ["15", "30", "12", "36"], "6·5/2."],
      ["A₅³ = ?", ["60", "10", "125", "20"], "5·4·3."],
      ["3 ko‘ylak va 4 shimdan necha xil kiyinish mumkin?", ["12", "7", "24", "81"], "3·4."],
      ["Raqamlari takrorlanishi mumkin bo‘lgan 3 xonali kodlar soni (0–9)?", ["1000", "720", "999", "30"], "10³."]
    ]
  });
  T(5, {
    id: "ehtimollik", title: "Ehtimollar nazariyasi", tag: "Tasodifiy hodisalar va ularning ehtimoli",
    life: "Ob-havo prognozidagi “yomg‘ir ehtimoli 70%”, lotereya, sug‘urta, sport tikishlari — ehtimollik noaniqlikni son bilan o‘lchaydi. Bu zamonaviy statistika va sun’iy intellektning asosi.",
    explain: "<p><b>Klassik ta’rif:</b></p><span class='fb'>P(A) = [[m/n]] = [[qulay hollar/barcha teng imkoniyatli hollar]]</span><p>0 ≤ P ≤ 1. Muqarrar hodisa P = 1, mumkin bo‘lmagan P = 0.</p><p><b>Qarama-qarshi hodisa:</b> P(Ā) = 1 − P(A). “Kamida bitta” savollarida juda qulay: P(kamida bitta) = 1 − P(hech biri).</p><p><b>Qo‘shish:</b> birgalikda bo‘lmagan hodisalar uchun P(A yoki B) = P(A) + P(B); umumiy holda P(A ∪ B) = P(A) + P(B) − P(A ∩ B).</p><p><b>Ko‘paytirish:</b> bog‘liq bo‘lmagan hodisalar uchun P(A va B) = P(A)·P(B).</p><p><b>Mashhur misollar:</b> tanga — ½; kubik — 1/6; ikki kubik — 36 ta natija, yig‘indi 7 — 6 ta (1/6); 52 talik karta, tuz — 4/52 = 1/13.</p>",
    rule: "P = m/n; P(Ā) = 1 − P(A); mustaqil hodisalar: P(A·B) = P(A)·P(B).",
    tip: "Ikki kubik tashlanganda natijalar 36 ta (11 ta emas!) — (1;2) va (2;1) har xil holat.",
    demos: [{ type: "probability" }],
    ex: [
      ["Qutida 5 oq va 3 qora shar. Tasodifan olingan shar oq bo‘lish ehtimoli?", ["n = 8, m = 5"], "[[5/8]]"],
      ["Ikki kubik tashlandi. Yig‘indi 8 bo‘lish ehtimoli?", ["Qulay: (2;6), (3;5), (4;4), (5;3), (6;2) — 5 ta", "P = 5/36"], "[[5/36]]"],
      ["Tanga 3 marta tashlandi. Kamida bir marta gerb tushish ehtimoli?", ["Hech bir marta gerb tushmasligi: (½)³ = ⅛", "P = 1 − ⅛"], "[[7/8]]"]
    ],
    qz: [
      ["Kubik tashlanganda juft son tushish ehtimoli?", ["[[1/2]]", "[[1/3]]", "[[1/6]]", "[[2/3]]"], "3/6."],
      ["Tanga 2 marta tashlandi. Ikkalasida gerb ehtimoli?", ["[[1/4]]", "[[1/2]]", "[[1/3]]", "1"], "½·½."],
      ["P(A) = 0,3. P(Ā) = ?", ["0,7", "0,3", "1,3", "0"], "1 − 0,3."],
      ["1 dan 20 gacha tasodifiy son 5 ga karrali bo‘lish ehtimoli?", ["[[1/5]]", "[[1/4]]", "[[1/20]]", "[[1/10]]"], "5, 10, 15, 20 → 4/20."],
      ["Ikki kubikda bir xil son tushish ehtimoli?", ["[[1/6]]", "[[1/36]]", "[[1/12]]", "[[1/3]]"], "6/36."]
    ]
  });
  T(5, {
    id: "statistika", title: "Ma’lumotlar tahlili va statistika", tag: "O‘rta qiymat, moda, mediana, dispersiya",
    life: "O‘rtacha baho, o‘rtacha oylik, eng ko‘p sotilgan o‘lcham — statistika ma’lumotlar ichidan mohiyatni ajratib beradi. Yangiliklar, iqtisod va sportdagi raqamlarni to‘g‘ri tushunish uchun zarur.",
    explain: "<p>x₁, x₂, …, xₙ ma’lumotlar qatori uchun:</p><ul><li><b>O‘rta arifmetik:</b> x̄ = [[(x₁ + x₂ + … + xₙ)/n]].</li><li><b>Mediana</b> — tartiblangan qatorning o‘rtasidagi qiymat (n juft bo‘lsa — ikki o‘rta qiymat o‘rtachasi).</li><li><b>Moda</b> — eng ko‘p uchraydigan qiymat (bir nechta bo‘lishi mumkin).</li><li><b>Kenglik (qamrov)</b> = eng katta − eng kichik.</li><li><b>Dispersiya</b> D = [[((x₁ − x̄)² + … + (xₙ − x̄)²)/n]] — qiymatlarning o‘rtachadan tarqoqligi. <b>Standart chetlanish</b> σ = √D.</li></ul><p><b>Muhim:</b> mediana katta “chetdagi” qiymatlarga sezgir emas. Masalan, 5 kishining oyligi 3, 3, 4, 4, 50 mln → o‘rtacha 12,8 mln, mediana 4 mln (haqiqatga yaqinroq).</p><p><b>Chastotalar jadvali:</b> qiymat — necha marta. O‘rtacha = Σ(qiymat·chastota)/Σ chastota.</p><p>Barcha qiymatlarga c qo‘shilsa, o‘rtacha c ga ortadi, dispersiya o‘zgarmaydi.</p>",
    rule: "O‘rtacha = yig‘indi/soni; mediana — tartiblangan qatorda o‘rtadagi; moda — eng ko‘p uchraydigan.",
    tip: "Medianani topishdan oldin qatorni TARTIBLANG.",
    demos: [{ type: "stats" }],
    ex: [
      ["Baholar: 5, 3, 4, 5, 4, 5, 2. O‘rtacha, mediana, moda?", ["Yig‘indi 28, n = 7 → o‘rtacha 4", "Tartib: 2, 3, 4, 4, 5, 5, 5 → mediana 4", "Moda 5 (3 marta)"], "4; 4; 5"],
      ["2, 4, 6, 8 qatorning dispersiyasi?", ["x̄ = 5", "D = (9 + 1 + 1 + 9)/4 = 5"], "5"],
      ["5 ta sonning o‘rtachasi 12. Oltinchi son qo‘shilgach o‘rtacha 13 bo‘ldi. Oltinchi son?", ["Yig‘indi 60 edi, endi 6·13 = 78", "78 − 60 = 18"], "18"]
    ],
    qz: [
      ["3, 7, 8 ning o‘rta arifmetigi?", ["6", "7", "5", "18"], "18/3."],
      ["1, 3, 3, 6, 7, 8 mediana?", ["4,5", "3", "6", "4"], "(3 + 6)/2."],
      ["2, 5, 5, 7, 5, 9 moda?", ["5", "7", "2", "9"], "3 marta."],
      ["4, 10, 1, 7 kengligi?", ["9", "6", "10", "3"], "10 − 1."],
      ["Har bir songa 3 qo‘shilsa, dispersiya?", ["o‘zgarmaydi", "3 ga ortadi", "9 ga ortadi", "3 marta ortadi"], "Tarqoqlik o‘zgarmaydi."]
    ]
  });

  // ===================== 6. PLANIMETRIYA =====================
  T(6, {
    id: "geometrik-tushunchalar", title: "Boshlang‘ich geometrik tushunchalar va burchaklar", tag: "Nuqta, to‘g‘ri chiziq, nur, kesma",
    life: "Har qanday chizma, xarita yoki bino rejasi nuqta, chiziq va burchaklardan boshlanadi. Bu tushunchalar geometriyaning “alifbosi”.",
    explain: "<p><b>Asosiy tushunchalar:</b> nuqta, to‘g‘ri chiziq (cheksiz), <b>nur</b> (bir tomonga cheksiz), <b>kesma</b> (ikki uchli). Ikki nuqtadan yagona to‘g‘ri chiziq o‘tadi.</p><p><b>Burchak</b> — bir nuqtadan chiqqan ikki nur. Turlari: o‘tkir (< 90°), to‘g‘ri (90°), o‘tmas (90°–180°), yoyiq (180°), to‘liq (360°).</p><ul><li><b>Qo‘shni burchaklar</b>: yig‘indisi 180°.</li><li><b>Vertikal burchaklar</b>: teng.</li><li><b>Bissektrisa</b> burchakni teng ikkiga bo‘ladi.</li><li><b>Perpendikulyar chiziqlar</b> 90° ostida kesishadi.</li></ul><p><b>Parallel chiziqlar va kesuvchi:</b> mos va ichki almashinuvchi burchaklar teng; ichki bir tomonli burchaklar yig‘indisi 180°.</p><p><b>Kesma o‘rtasi</b> — kesmani teng ikkiga bo‘luvchi nuqta. AB = AC + CB (C kesmada yotsa).</p>",
    rule: "Qo‘shni burchaklar 180°, vertikal burchaklar teng; parallel chiziqlarda almashinuvchi burchaklar teng.",
    tip: "Qo‘shni burchaklar bissektrisalari doim 90° hosil qiladi.",
    ex: [
      ["Ikki to‘g‘ri chiziq kesishganda hosil bo‘lgan burchaklardan biri 3 marta katta. Burchaklarni toping.", ["Qo‘shni: x + 3x = 180° → x = 45°", "Burchaklar: 45°, 135°, 45°, 135°"], "45° va 135°"],
      ["C nuqta AB kesmada, AC = 7, CB AC dan 3 ga uzun. AB = ?", ["CB = 10", "AB = 17"], "17"],
      ["Parallel chiziqlarni kesuvchi kesganda ichki bir tomonli burchaklar 2 : 3 nisbatda. Kattasi?", ["2x + 3x = 180° → x = 36°", "3·36 = 108°"], "108°"]
    ],
    qz: [
      ["Qo‘shni burchaklardan biri 65°. Ikkinchisi?", ["115°", "25°", "65°", "135°"], "180 − 65."],
      ["Vertikal burchaklar yig‘indisi 140°. Har biri?", ["70°", "140°", "40°", "110°"], "Teng."],
      ["To‘liq burchak necha gradus?", ["360°", "180°", "90°", "270°"], "Aylana."],
      ["Ikki nuqtadan nechta to‘g‘ri chiziq o‘tadi?", ["1", "2", "cheksiz", "0"], "Aksioma."],
      ["Bissektrisa 120° li burchakni qanday burchaklarga bo‘ladi?", ["60° va 60°", "40° va 80°", "30° va 90°", "120° va 0°"], "Teng ikkiga."]
    ],
    see: ["3.1", "3.2"]
  });
  T(6, {
    id: "uchburchaklar", title: "Uchburchaklar (turlari, xossalari, burchaklari)", tag: "Uchburchak tengsizligi va elementlari",
    life: "Uchburchak — eng qattiq, deformatsiyalanmaydigan shakl. Ko‘prik fermalari, minoralar, velosiped ramasi — hammasi uchburchaklarga asoslangan.",
    explain: "<p><b>Turlari:</b> tomonlari bo‘yicha — turli tomonli, teng yonli, teng tomonli; burchaklari bo‘yicha — o‘tkir, to‘g‘ri, o‘tmas burchakli.</p><p><b>Asosiy xossalar:</b></p><ul><li>Burchaklar yig‘indisi 180°.</li><li>Tashqi burchak = ikki uzoq ichki burchak yig‘indisi.</li><li>Uchburchak tengsizligi: |b − c| < a < b + c.</li><li>Katta tomon qarshisida katta burchak.</li></ul><p><b>Elementlar:</b> mediana (2 : 1 nisbatda kesishadi), bissektrisa (qarshi tomonni yon tomonlarga proporsional bo‘ladi), balandlik, o‘rta chiziq (= ½ asos).</p><p><b>Tenglik alomatlari:</b> TBT (ikki tomon va orasidagi burchak), BTB (tomon va yopishgan ikki burchak), TTT (uch tomon).</p><p><b>Teng yonli uchburchak:</b> asosdagi burchaklar teng; asosga tushirilgan mediana = bissektrisa = balandlik.</p>",
    rule: "∠A + ∠B + ∠C = 180°; a < b + c; medianalar 2 : 1.",
    tip: "Uchburchakning faqat bitta burchagi to‘g‘ri yoki o‘tmas bo‘lishi mumkin.",
    demos: [{ type: "triCalc" }],
    ex: [
      ["Teng yonli uchburchakning asosdagi burchagi 35°. Uchidagi burchak?", ["180° − 2·35° = 110°"], "110°"],
      ["Uchburchak tomonlari 5 va 9. Uchinchi tomon butun son bo‘lsa, eng katta qiymati?", ["9 − 5 < c < 9 + 5 → 4 < c < 14"], "13"],
      ["Bissektrisa qarshi tomonni 6 va 9 ga bo‘ldi, yon tomonlar yig‘indisi 25. Yon tomonlar?", ["a : b = 6 : 9 = 2 : 3", "2k + 3k = 25 → k = 5"], "10 va 15"]
    ],
    qz: [
      ["Burchaklari 40° va 70°. Uchinchisi?", ["70°", "80°", "60°", "90°"], "180 − 110."],
      ["Qaysi uchlik uchburchak bo‘la oladi?", ["6, 8, 10", "1, 2, 3", "2, 2, 5", "3, 4, 8"], "6 + 8 > 10."],
      ["Mediana 15. Og‘irlik markazidan uchgacha?", ["10", "5", "7,5", "12"], "2/3 qismi."],
      ["O‘rta chiziq 8. Asos?", ["16", "8", "4", "24"], "2·8."],
      ["Teng tomonli uchburchakning har bir burchagi?", ["60°", "90°", "45°", "120°"], "180/3."]
    ],
    see: ["3.3.1", "3.3.2", "3.3.6", "3.3.7"]
  });
  T(6, {
    id: "pifagor", title: "To‘g‘ri burchakli uchburchak va Pifagor teoremasi", tag: "Metrik munosabatlar va trigonometrik nisbatlar",
    life: "Narvon uzunligi, televizor diagonali, ikki shahar orasidagi to‘g‘ri masofa — Pifagor teoremasi 2500 yildan beri eng ko‘p ishlatiladigan geometrik qoida.",
    explain: "<span class='fb'>c² = a² + b²</span><p><b>Trigonometrik nisbatlar</b> (A burchak uchun): sin A = [[a/c]] (qarshi katet/gipotenuza), cos A = [[b/c]] (yopishgan katet/gipotenuza), tg A = [[a/b]].</p><p><b>Metrik munosabatlar</b> (h — gipotenuzaga balandlik, aᶜ, bᶜ — katetlar proyeksiyalari):</p><ul><li>h² = aᶜ · bᶜ</li><li>a² = c · aᶜ, b² = c · bᶜ</li><li>h = [[ab/c]]</li></ul><p><b>Muhim faktlar:</b></p><ul><li>30° qarshisidagi katet = c/2.</li><li>45° li uchburchakda katetlar teng, c = a√2.</li><li>Gipotenuzaga mediana = c/2 = R.</li><li>Ichki aylana radiusi r = (a + b − c)/2.</li></ul><p><b>Pifagor uchliklari:</b> 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29.</p>",
    rule: "c² = a² + b²; h = ab/c; h² = aᶜbᶜ; 30° qarshisida c/2.",
    tip: "Teskari teorema: agar c² = a² + b² bo‘lsa, uchburchak to‘g‘ri burchakli. Uni burchak turini aniqlashda ishlating.",
    demos: [{ type: "triCalc" }],
    ex: [
      ["Katetlar 15 va 20. Gipotenuza, balandlik va proyeksiyalar?", ["c = 25", "h = 15·20/25 = 12", "aᶜ = 15²/25 = 9, bᶜ = 20²/25 = 16"], "c = 25, h = 12, 9 va 16"],
      ["Narvon uzunligi 5 m, pastki uchi devordan 3 m uzoqda. Narvon devorning qancha balandligiga yetadi?", ["√(25 − 9) = 4"], "4 m"],
      ["To‘g‘ri burchakli uchburchakda gipotenuza 10, sin A = 0,6. Katetlar?", ["a = 10·0,6 = 6", "b = √(100 − 36) = 8"], "6 va 8"]
    ],
    qz: [
      ["Katetlar 8 va 15. Gipotenuza?", ["17", "23", "√161", "16"], "8-15-17."],
      ["45° li to‘g‘ri burchakli uchburchakda katet 5. Gipotenuza?", ["5√2", "10", "5", "5√3"], "a√2."],
      ["Gipotenuza 26, bir katet 10. Ikkinchisi?", ["24", "16", "√776", "20"], "√(676 − 100)."],
      ["Katetlar 6 va 8. Ichki aylana radiusi?", ["2", "4", "5", "3"], "(6 + 8 − 10)/2."],
      ["Proyeksiyalar 4 va 9. Gipotenuzaga balandlik?", ["6", "13", "36", "6,5"], "√36."]
    ],
    see: ["3.3.3", "3.3.5"]
  });
  T(6, {
    id: "uchburchak-yuzi", title: "Uchburchak yuzasi va o‘xshashligi", tag: "Yuz formulalari va o‘xshashlik koeffitsiyenti",
    life: "Yer maydonini o‘lchash, xarita masshtabi, fotosuratni kattalashtirish, daraxt balandligini soya bo‘yicha topish — yuz va o‘xshashlik formulalari kundalik hayotda.",
    explain: "<p><b>Yuz formulalari:</b></p><span class='fb'>S = ½ah = ½ab·sin C = √(p(p − a)(p − b)(p − c)) = pr = [[abc/(4R)]]</span><p>p — yarim perimetr, r — ichki, R — tashqi aylana radiusi. Teng tomonli: S = [[a²√3/4]].</p><p><b>Sinuslar va kosinuslar teoremalari:</b> a/sin A = 2R; c² = a² + b² − 2ab cos C.</p><p><b>O‘xshashlik:</b> burchaklar teng, tomonlar proporsional (k).</p><ul><li>Alomatlar: BB, TBT, TTT.</li><li>Perimetrlar nisbati k, <b>yuzalar nisbati k²</b>.</li><li>Tomonga parallel chiziq o‘xshash uchburchak kesib oladi.</li></ul><p><b>Bir xil balandlikli uchburchaklar</b> yuzlari asoslari nisbatida. Mediana uchburchakni teng yuzli ikki qismga bo‘ladi.</p>",
    rule: "S = ½ab sin C; Geron; o‘xshashlikda S₁/S₂ = k².",
    tip: "Masalada uch tomon berilsa — Geron; ikki tomon va burchak — ½ab sin C.",
    demos: [{ type: "triCalc" }],
    ex: [
      ["Tomonlari 7, 8, 9 bo‘lgan uchburchak yuzi?", ["p = 12", "S = √(12·5·4·3) = √720 = 12√5"], "12√5"],
      ["Uchburchakda AB = 12, unga parallel chiziq MN = 4 (M, N yon tomonlarda). Kichik uchburchak yuzi 6. Katta uchburchak yuzi?", ["k = 12/4 = 3", "S = 6·9 = 54"], "54"],
      ["a = 10, b = 6, C = 150°. S = ?", ["½·10·6·sin 150° = 30·½"], "15"]
    ],
    qz: [
      ["Tomonlari 6, 8, 10. S = ?", ["24", "48", "30", "40"], "To‘g‘ri burchakli: ½·6·8."],
      ["O‘xshashlik koeffitsienti 2. Yuzalar nisbati?", ["4", "2", "8", "√2"], "k²."],
      ["Teng tomonli uchburchak tomoni 2. S = ?", ["√3", "2√3", "4", "[[√3/2]]"], "4√3/4."],
      ["S = 30, p = 15. r = ?", ["2", "45", "0,5", "15"], "S/p."],
      ["Daraxt soyasi 15 m, 2 m li tayoq soyasi 3 m. Daraxt balandligi?", ["10 m", "22,5 m", "7,5 m", "6 m"], "15·2/3."]
    ],
    see: ["3.3.4", "3.3.9", "3.3.10"]
  });
  T(6, {
    id: "tortburchaklar", title: "To‘rtburchaklar (parallelogramm, romb, trapetsiya)", tag: "Kvadrat va to‘g‘ri to‘rtburchak xossalari",
    life: "Xona, deraza, yer uchastkasi, plitka, yo‘l kesimi — to‘rtburchaklar. Ta’mirlash, qurilish va dizaynda ularning yuz va diagonallarini hisoblash kerak bo‘ladi.",
    explain: "<table class='oq-t'><tr><th>Shakl</th><th>Xossalari</th><th>Yuzi</th></tr><tr><td>Parallelogramm</td><td>qarama-qarshi tomonlar va burchaklar teng, diagonallar teng ikkiga bo‘linadi</td><td>a·h = ab sin α</td></tr><tr><td>To‘g‘ri to‘rtburchak</td><td>+ barcha burchaklar 90°, diagonallar teng</td><td>ab</td></tr><tr><td>Romb</td><td>+ barcha tomonlar teng, diagonallar perpendikulyar va bissektrisa</td><td>½d₁d₂ = a² sin α</td></tr><tr><td>Kvadrat</td><td>hammasi birga, d = a√2</td><td>a² = d²/2</td></tr><tr><td>Trapetsiya</td><td>faqat asoslar parallel, o‘rta chiziq m = (a + b)/2</td><td>m·h</td></tr></table><p><b>Har qanday to‘rtburchak:</b> burchaklar yig‘indisi 360°; S = ½d₁d₂ sin φ.</p><p><b>Parallelogramm diagonallari:</b> d₁² + d₂² = 2(a² + b²).</p><p><b>Teng yonli trapetsiya:</b> balandlik katta asosdan (a − b)/2 kesib oladi; diagonallar teng.</p><p><b>Aylana bilan:</b> atrofiga aylana chizish — qarama-qarshi burchaklar yig‘indisi 180°; ichiga — qarama-qarshi tomonlar yig‘indilari teng.</p>",
    rule: "Romb S = ½d₁d₂; trapetsiya S = (a + b)/2·h; parallelogramm S = ab sin α.",
    tip: "Romb tomoni diagonallar yarimlari orqali Pifagor bilan topiladi.",
    
    ex: [
      ["Romb diagonallari 10 va 24. Perimetri va yuzi?", ["Tomon: √(5² + 12²) = 13", "P = 52, S = ½·10·24 = 120"], "P = 52, S = 120"],
      ["Teng yonli trapetsiya asoslari 6 va 16, yon tomoni 13. Yuzi?", ["(16 − 6)/2 = 5", "h = √(169 − 25) = 12", "S = (6 + 16)/2·12 = 132"], "132"],
      ["Parallelogramm tomonlari 8 va 5, burchagi 60°. Yuzi va kichik diagonali?", ["S = 40·sin 60° = 20√3", "d² = 64 + 25 − 2·40·½ = 49 → d = 7"], "20√3 va 7"]
    ],
    qz: [
      ["Kvadrat diagonali 8. Yuzi?", ["32", "64", "16", "8√2"], "d²/2."],
      ["Trapetsiya asoslari 5 va 11, balandligi 4. S = ?", ["32", "64", "44", "20"], "8·4."],
      ["Romb burchaklaridan biri 50°. Qolganlari?", ["50°, 130°, 130°", "50°, 50°, 50°", "130°, 130°, 130°", "40°, 140°, 130°"], "Qarama-qarshi teng, qo‘shni 180°."],
      ["To‘g‘ri to‘rtburchak tomonlari 9 va 12. Diagonali?", ["15", "21", "√63", "10"], "3-4-5 ×3."],
      ["Trapetsiya o‘rta chizig‘i 10, bir asosi 7. Ikkinchi asos?", ["13", "3", "17", "8,5"], "(7 + x)/2 = 10."]
    ],
    see: ["3.4.1", "3.4.2", "3.4.3", "3.4.4", "3.5"]
  });
  T(6, {
    id: "aylana-doira", title: "Aylana va doira (urinma, vatar)", tag: "Markaziy va ichki chizilgan burchaklar, yuzalar",
    life: "G‘ildirak, soat, stadion, sun’iy yo‘ldosh orbitasi — aylanalar. Aylana bilan bog‘liq teoremalar navigatsiya, mexanika va arxitekturada qo‘llaniladi.",
    explain: "<p><b>Asosiy formulalar:</b></p><span class='fb'>C = 2πR; &nbsp; S = πR²; &nbsp; l = [[πRα/180°]]; &nbsp; S<sub>sektor</sub> = [[πR²α/360°]]</span><p><b>Elementlar va xossalar:</b></p><ul><li>Urinma urinish nuqtasiga o‘tkazilgan radiusga perpendikulyar; bir nuqtadan o‘tkazilgan urinma kesmalari teng.</li><li>Vatarga perpendikulyar diametr uni teng ikkiga bo‘ladi: (l/2)² + d² = R².</li><li><b>Markaziy burchak</b> = yoy; <b>ichki chizilgan burchak</b> = yoyning yarmi; diametrga tiralgan burchak = 90°.</li><li><b>Kesishuvchi vatarlar:</b> AE·EB = CE·ED.</li><li><b>Urinma va kesuvchi:</b> MA² = MB·MC.</li></ul><p><b>Aylana tenglamasi:</b> (x − a)² + (y − b)² = R².</p><p><b>Ko‘pburchak bilan:</b> uchburchakka tashqi R = abc/(4S), ichki r = S/p; kvadratda R = a√2/2, r = a/2; muntazam oltiburchakda R = a.</p>",
    rule: "Ichki chizilgan burchak = ½ markaziy burchak; urinma ⊥ radius.",
    tip: "Diametr berilsa, doira yuzi πd²/4 (πd² emas!).",
    demos: [{ type: "circleCalc" }],
    ex: [
      ["R = 12, markaziy burchak 120°. Yoy uzunligi va sektor yuzi?", ["l = π·12·120/180 = 8π", "S = π·144·120/360 = 48π"], "8π va 48π"],
      ["Ichki chizilgan burchak 40°. Shu yoyga tiralgan markaziy burchak?", ["2·40° = 80°"], "80°"],
      ["Aylanadan tashqaridagi nuqtadan urinma 12, kesuvchining tashqi qismi 8. Kesuvchining aylana ichidagi qismi?", ["144 = 8·x → x = 18 (butun kesuvchi)", "18 − 8 = 10"], "10"]
    ],
    qz: [
      ["R = 6. Aylana uzunligi?", ["12π", "36π", "6π", "24π"], "2πR."],
      ["Doira yuzi 25π. Diametri?", ["10", "5", "25", "50"], "R = 5."],
      ["Diametrga tiralgan ichki chizilgan burchak?", ["90°", "180°", "60°", "45°"], "Yarim aylana."],
      ["Vatarlar bo‘laklari 3 va 8; 4 va x. x = ?", ["6", "7", "5", "12"], "24 = 4x."],
      ["(x − 2)² + (y + 5)² = 9 markazi va radiusi?", ["(2; −5), 3", "(−2; 5), 3", "(2; 5), 9", "(−2; −5), 9"], "Ishoralar teskari."]
    ],
    see: ["3.6.1", "3.6.4", "3.6.7", "3.6.8", "3.7.1"]
  });

  // ===================== 7. STEREOMETRIYA =====================
  T(7, {
    id: "fazoda-chiziqlar", title: "Fazoda to‘g‘ri chiziqlar va tekisliklar", tag: "Parallel va perpendikulyarlik shartlari",
    life: "Bino devorlari va pol, simyog‘och va yer, ko‘prik ustunlari — fazodagi chiziq va tekisliklarning o‘zaro joylashuvi. Bu muhandislik chizmachiligining asosi.",
    explain: "<p><b>Stereometriya aksiomalari:</b> bir to‘g‘ri chiziqda yotmagan uch nuqtadan yagona tekislik o‘tadi; ikki tekislik kesishsa, ular to‘g‘ri chiziq bo‘yicha kesishadi.</p><p><b>Ikki to‘g‘ri chiziq:</b> kesishadi, parallel yoki <b>ayqash</b> (bir tekislikda yotmaydi).</p><p><b>Chiziq va tekislik:</b> tekislikda yotadi, kesadi yoki parallel. <b>Parallellik belgisi:</b> chiziq tekislikdagi biror chiziqqa parallel bo‘lsa, tekislikka ham parallel.</p><p><b>Perpendikulyarlik belgisi:</b> chiziq tekislikdagi ikkita kesishuvchi chiziqqa perpendikulyar bo‘lsa, tekislikka perpendikulyar.</p><p><b>Uch perpendikulyar teoremasi:</b> og‘maning proyeksiyasi tekislikdagi chiziqqa perpendikulyar bo‘lsa, og‘maning o‘zi ham perpendikulyar (va aksincha).</p><p><b>Masofa va burchaklar:</b> nuqtadan tekislikkacha masofa — perpendikulyar; og‘ma² = perpendikulyar² + proyeksiya²; og‘ma va tekislik orasidagi burchak — og‘ma va uning proyeksiyasi orasidagi burchak.</p><p><b>Tekisliklar:</b> parallel (umumiy nuqta yo‘q) yoki kesishadi; ular orasidagi burchak — ikki yoqli burchakning chiziqli burchagi.</p>",
    rule: "Og‘ma² = perpendikulyar² + proyeksiya²; sin φ = perpendikulyar / og‘ma.",
    tip: "Fazoda bitta chiziqqa perpendikulyar ikki chiziq parallel bo‘lishi shart emas (masalan, kub qirralari).",
    ex: [
      ["Nuqtadan tekislikka tushirilgan perpendikulyar 8, og‘ma 10. Og‘ma proyeksiyasi?", ["√(100 − 64) = 6"], "6"],
      ["Og‘ma 12, tekislik bilan 30° burchak hosil qiladi. Nuqtadan tekislikkacha masofa?", ["h = 12·sin 30° = 6"], "6"],
      ["Kubning bitta qirrasi bilan ayqash bo‘lgan qirralar soni?", ["Qolgan 11 qirradan: 3 tasi parallel, 4 tasi kesishadi", "11 − 3 − 4 = 4 tasi ayqash"], "4 ta"]
    ],
    qz: [
      ["Bir to‘g‘ri chiziqda yotmagan 3 nuqtadan nechta tekislik o‘tadi?", ["1", "3", "cheksiz", "0"], "Aksioma."],
      ["Perpendikulyar 5, proyeksiya 12. Og‘ma?", ["13", "17", "√119", "7"], "5-12-13."],
      ["Kubning AB qirrasi va qarama-qarshi yoqdagi unga parallel bo‘lmagan qirra qanday joylashgan bo‘lishi mumkin?", ["ayqash", "doim parallel", "doim kesishadi", "ustma-ust"], "Kubda ayqash qirralar bor."],
      ["Ikki tekislik kesishsa, ular nima bo‘yicha kesishadi?", ["to‘g‘ri chiziq", "nuqta", "tekislik", "aylana"], "Aksioma."],
      ["Og‘ma 10, proyeksiya 5. Og‘ma va tekislik orasidagi burchak?", ["60°", "30°", "45°", "90°"], "cos φ = 5/10."]
    ],
    see: ["4.1"]
  });
  T(7, {
    id: "kopyoqlar", title: "Ko‘pyoqlar (prizma, parallelepiped, kub, piramida)", tag: "To‘liq sirt yuzi va hajmi",
    life: "Qutilar, binolar, kristallar, Misr piramidalari — ko‘pyoqlar. Qadoq hajmi, bo‘yoq miqdori, beton hajmi — ularning formulalari bilan hisoblanadi.",
    explain: "<table class='oq-t'><tr><th>Jism</th><th>Hajm</th><th>To‘la sirt</th><th>Diagonal</th></tr><tr><td>Kub (a)</td><td>a³</td><td>6a²</td><td>a√3</td></tr><tr><td>To‘g‘ri burchakli parallelepiped</td><td>abc</td><td>2(ab + bc + ac)</td><td>√(a² + b² + c²)</td></tr><tr><td>To‘g‘ri prizma</td><td>S<sub>asos</sub>·h</td><td>P·h + 2S<sub>asos</sub></td><td>—</td></tr><tr><td>Piramida</td><td>⅓S<sub>asos</sub>·h</td><td>S<sub>yon</sub> + S<sub>asos</sub></td><td>—</td></tr></table><p><b>Muntazam piramida:</b> S<sub>yon</sub> = ½P·l (l — apofema). Kvadrat asosli: l = √(h² + (a/2)²), yon qirra = √(h² + a²/2).</p><p><b>Eyler formulasi:</b> uchlar − qirralar + yoqlar = 2 (kub: 8 − 12 + 6 = 2).</p><p><b>O‘xshash jismlar:</b> chiziqli o‘lchamlar k marta → sirt k², hajm k³ marta.</p><p>1 l = 1 dm³; 1 m³ = 1000 l.</p>",
    rule: "V_prizma = S·h; V_piramida = ⅓S·h; kub diagonali a√3.",
    tip: "Piramida hajmida ⅓ ni unutmang — bu eng ko‘p uchraydigan xato.",
    demos: [{ type: "solid", kind: "prism" }, { type: "solid", kind: "pyramid" }],
    ex: [
      ["Parallelepiped o‘lchamlari 3, 4, 12. Diagonali, hajmi va to‘la sirti?", ["d = √(9 + 16 + 144) = 13", "V = 144", "S = 2(12 + 48 + 36) = 192"], "13; 144; 192"],
      ["Muntazam to‘rtburchakli piramida asos tomoni 8, apofemasi 5. Balandlik va hajm?", ["h = √(25 − 16) = 3", "V = ⅓·64·3 = 64"], "h = 3, V = 64"],
      ["Muntazam uchburchakli prizma: asos tomoni 6, yon qirrasi 10. Hajmi?", ["S_asos = 36√3/4 = 9√3", "V = 90√3"], "90√3"]
    ],
    qz: [
      ["Kub hajmi 27. Sirti?", ["54", "27", "36", "81"], "a = 3, 6·9."],
      ["Kub diagonali 5√3. Qirrasi?", ["5", "√3", "15", "25"], "a√3."],
      ["Piramida asosi 30, balandligi 6. V = ?", ["60", "180", "90", "36"], "⅓·30·6."],
      ["Qirra 2 marta oshsa, kub hajmi?", ["8 marta", "2 marta", "4 marta", "6 marta"], "k³."],
      ["Kubning nechta qirrasi bor?", ["12", "8", "6", "24"], "Eyler: 8 − 12 + 6 = 2."]
    ],
    see: ["4.2.1", "4.2.2", "4.2.3", "4.3.1"]
  });
  T(7, {
    id: "aylanma-jismlar", title: "Aylanma jismlar (silindr, konus, shar)", tag: "Sirtlari, kesimlari va hajmlari",
    life: "Banka, quvur, bochka (silindr), voronka va muzqaymoq (konus), to‘p va sayyoralar (shar). Ishlab chiqarishda material sarfi va hajm aynan shu formulalar bilan hisoblanadi.",
    explain: "<table class='oq-t'><tr><th>Jism</th><th>Hajm</th><th>Yon sirt</th><th>To‘la sirt</th></tr><tr><td>Silindr</td><td>πR²h</td><td>2πRh</td><td>2πR(R + h)</td></tr><tr><td>Konus</td><td>⅓πR²h</td><td>πRl</td><td>πR(R + l)</td></tr><tr><td>Shar</td><td>⁴⁄₃πR³</td><td colspan='2'>4πR²</td></tr></table><p>Konusda yasovchi l = √(R² + h²).</p><p><b>Kesimlar:</b> silindrning o‘q kesimi — to‘g‘ri to‘rtburchak 2R × h; konusniki — teng yonli uchburchak (asos 2R, yon tomon l); sharning har qanday kesimi — doira, radiusi r = √(R² − d²).</p><p><b>Kombinatsiyalar:</b> silindrga ichki shar: h = 2R, V<sub>shar</sub> : V<sub>silindr</sub> = 2 : 3 (Arximed). Konusga ichki shar: r = Rh/(R + l).</p><p><b>Eritib quyish:</b> hajm saqlanadi.</p>",
    rule: "V_silindr = πR²h; V_konus = ⅓πR²h; V_shar = ⁴⁄₃πR³; S_shar = 4πR².",
    tip: "Konus yon sirti uchun balandlik emas, yasovchi l kerak.",
    demos: [{ type: "solid", kind: "cylinder" }, { type: "solid", kind: "cone" }, { type: "solid", kind: "sphere" }],
    ex: [
      ["Silindr R = 4, h = 10. Hajm va to‘la sirt?", ["V = π·16·10 = 160π", "S = 2π·4·14 = 112π"], "160π va 112π"],
      ["Konus R = 5, l = 13. Balandlik va hajm?", ["h = √(169 − 25) = 12", "V = ⅓π·25·12 = 100π"], "h = 12, V = 100π"],
      ["Radiusi 1 bo‘lgan 27 ta shar eritilib bitta shar quyildi. Uning radiusi?", ["27·⁴⁄₃π = ⁴⁄₃πR³", "R³ = 27 → R = 3"], "3"]
    ],
    qz: [
      ["Shar R = 3. Sirti?", ["36π", "12π", "9π", "108π"], "4π·9."],
      ["Silindr R = 3, h = 4. V = ?", ["36π", "12π", "24π", "48π"], "π·9·4."],
      ["Konus R = 6, h = 8. Yasovchi?", ["10", "14", "√28", "48"], "√(36 + 64)."],
      ["Shar radiusi 2 marta oshsa, hajm?", ["8 marta", "4 marta", "2 marta", "6 marta"], "R³."],
      ["Konus va silindrda R, h teng. Hajmlar nisbati?", ["1 : 3", "1 : 2", "2 : 3", "3 : 1"], "⅓."]
    ],
    see: ["4.4.1", "4.4.2", "4.4.3", "4.5.3", "4.5.5"]
  });

  // ===================== 8. KOORDINATALAR VA VEKTORLAR =====================
  T(8, {
    id: "vektorlar", title: "Vektorlar va ular ustida amallar", tag: "Skalyar ko‘paytma, vektor uzunligi va koordinatalari",
    life: "Kuch, tezlik, shamol, navigatsiya, kompyuter grafikasi va o‘yinlar — hammasi vektorlar bilan hisoblanadi. Vektor — kattalik va yo‘nalish birgalikda.",
    explain: "<p><b>Koordinatalar:</b> A(x₁; y₁), B(x₂; y₂) → AB⃗ = (x₂ − x₁; y₂ − y₁).</p><p><b>Amallar:</b> a ± b = (a₁ ± b₁; a₂ ± b₂); k·a = (ka₁; ka₂). Geometrik: uchburchak va parallelogramm qoidasi.</p><p><b>Uzunlik:</b> |a| = √(a₁² + a₂²) (fazoda + a₃²). Masofa: AB = |AB⃗|.</p><p><b>Skalyar ko‘paytma:</b></p><span class='fb'>a·b = |a||b|cos φ = a₁b₁ + a₂b₂</span><ul><li>a ⊥ b ⇔ a·b = 0.</li><li>cos φ = [[a·b/(|a||b|)]].</li><li>a·a = |a|².</li></ul><p><b>Kollinearlik:</b> a ∥ b ⇔ a₁/b₁ = a₂/b₂ (a₁b₂ = a₂b₁).</p><p><b>Kesma o‘rtasi:</b> ((x₁ + x₂)/2; (y₁ + y₂)/2). Uchburchak medianalari kesishish nuqtasi: koordinatalar o‘rta arifmetigi.</p>",
    rule: "|a| = √(a₁² + a₂²); a·b = a₁b₁ + a₂b₂; a ⊥ b ⇔ a·b = 0.",
    tip: "Skalyar ko‘paytma — son; vektorlar yig‘indisi — vektor. Ularni adashtirmang.",
    demos: [{ type: "vectors" }],
    ex: [
      ["A(1; −2), B(4; 2). AB⃗ va |AB⃗|?", ["AB⃗ = (3; 4)", "|AB⃗| = 5"], "(3; 4), 5"],
      ["a(2; 3), b(m; −4) perpendikulyar. m = ?", ["2m − 12 = 0", "m = 6"], "6"],
      ["|a| = 3, |b| = 5, a·b = 7,5. Vektorlar orasidagi burchak?", ["cos φ = 7,5/15 = 0,5", "φ = 60°"], "60°"]
    ],
    qz: [
      ["a(−3; 4). |a| = ?", ["5", "7", "1", "25"], "√(9 + 16)."],
      ["a(1; 2) + b(3; −1) = ?", ["(4; 1)", "(2; 3)", "(4; 3)", "(−2; 3)"], "Koordinatalar qo‘shiladi."],
      ["a(2; −1)·b(3; 4) = ?", ["2", "10", "(6; −4)", "−2"], "6 − 4."],
      ["a(3; 6) va b(1; k) kollinear. k = ?", ["2", "3", "6", "0,5"], "3/1 = 6/k."],
      ["A(2; 4), B(8; 10). AB o‘rtasi?", ["(5; 7)", "(10; 14)", "(6; 6)", "(3; 3)"], "O‘rta arifmetik."]
    ],
    see: ["3.8", "3.9.1", "3.9.2", "3.9.3", "3.9.4", "3.9.5"]
  });
})();
