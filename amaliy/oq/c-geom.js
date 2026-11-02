/* Oq to'plam — 3-bob Planimetriya va 4-bob Stereometriya. */
window.OQ = window.OQ || {};
(() => {
  const add = (code, o) => { window.OQ[code] = o; };
  const TRI = [{ type: "triCalc" }];
  const CIR = [{ type: "circleCalc" }];

  // ===== 3.1–3.2 =====
  add("3.1", {
    life: "Soat millari orasidagi burchak, yo‘l chorrahasidagi burilish, xona burchagi — burchaklar va masofalar geometriyaning eng asosiy tushunchalari.",
    explain: "<p><b>Burchak turlari:</b> o‘tkir (< 90°), to‘g‘ri (= 90°), o‘tmas (90°–180°), yoyiq (180°).</p><ul><li><b>Qo‘shni burchaklar</b> yig‘indisi 180°.</li><li><b>Vertikal burchaklar</b> teng.</li><li><b>Bissektrisa</b> burchakni teng ikkiga bo‘ladi.</li><li>Qo‘shni burchaklar bissektrisalari orasidagi burchak — 90°.</li></ul><p><b>Masofalar:</b> nuqtadan to‘g‘ri chiziqqacha masofa — perpendikulyar uzunligi (eng qisqa yo‘l). Kesmaning o‘rtasi uni teng ikkiga bo‘ladi.</p><p><b>Soat millari:</b> soat mili har soatda 30°, har daqiqada 0,5° buriladi; daqiqa mili har daqiqada 6°.</p>",
    rule: "Qo‘shni burchaklar yig‘indisi 180°, vertikal burchaklar teng.",
    tip: "Soat 3:30 da millar orasidagi burchak 90° emas: soat mili 3 va 4 o‘rtasida → 75°.",
    ex: [
      ["Qo‘shni burchaklardan biri ikkinchisidan 40° katta. Kattasini toping.", ["x + (x + 40°) = 180°", "2x = 140° → x = 70°"], "110°"],
      ["Soat 4:20 da millar orasidagi burchak?", ["Daqiqa mili: 20·6° = 120°", "Soat mili: 4·30° + 20·0,5° = 130°", "130° − 120° = 10°"], "10°"]
    ],
    qz: [
      ["Vertikal burchaklardan biri 35°. Ikkinchisi?", ["35°", "145°", "55°", "70°"], "Vertikal burchaklar teng."],
      ["Qo‘shni burchaklar nisbati 1 : 2. Kichigi?", ["60°", "45°", "90°", "30°"], "180/3 = 60."],
      ["Soat 3:00 da millar orasidagi burchak?", ["90°", "45°", "60°", "120°"], "3·30°."]
    ]
  });
  add("3.2", {
    life: "Temir yo‘l relslari, daftar chiziqlari, ko‘p qavatli uy qavatlari — parallel chiziqlar. Ular kesuvchi bilan kesishganda hosil bo‘lgan burchaklar qonuniyatlari ko‘p masalalarni yechadi.",
    explain: "<p>Ikki parallel to‘g‘ri chiziqni uchinchi chiziq (kesuvchi) kesganda 8 ta burchak hosil bo‘ladi:</p><ul><li><b>Ichki almashinuvchi</b> burchaklar teng.</li><li><b>Mos</b> burchaklar teng.</li><li><b>Ichki bir tomonli</b> burchaklar yig‘indisi 180°.</li></ul><p>Teskari ham to‘g‘ri: agar almashinuvchi burchaklar teng bo‘lsa, chiziqlar parallel.</p><p><b>Foydali natija:</b> uchburchakning tashqi burchagi o‘ziga qo‘shni bo‘lmagan ikki ichki burchak yig‘indisiga teng. Parallel chiziqlar orasidagi “siniq chiziq” burchagi — chap va o‘ng burchaklar yig‘indisi.</p>",
    rule: "Almashinuvchi va mos burchaklar teng; ichki bir tomonli burchaklar yig‘indisi 180°.",
    tip: "Burchaklarni chizmada belgilab chiqing — qaysi biri mos, qaysi biri almashinuvchi ekani ko‘rinadi.",
    ex: [
      ["Parallel chiziqlarni kesuvchi kesadi. Ichki bir tomonli burchaklar ayirmasi 30°. Ularni toping.", ["x + y = 180°, x − y = 30°", "x = 105°, y = 75°"], "105° va 75°"],
      ["a ∥ b. Ichki almashinuvchi burchaklardan biri 3x + 10°, ikkinchisi 5x − 30°. x?", ["3x + 10 = 5x − 30", "2x = 40 → x = 20°"], "x = 20°"]
    ],
    qz: [
      ["Mos burchaklardan biri 72°. Ikkinchisi?", ["72°", "108°", "18°", "144°"], "Mos burchaklar teng."],
      ["Ichki bir tomonli burchaklardan biri 65°. Ikkinchisi?", ["115°", "65°", "25°", "135°"], "180 − 65."],
      ["Uchburchakning ikki burchagi 50° va 60°. Uchinchi burchakka qo‘shni tashqi burchak?", ["110°", "70°", "120°", "130°"], "50 + 60."]
    ]
  });

  // ===== 3.3 Uchburchaklar =====
  add("3.3.1", {
    life: "Uchburchak — eng mustahkam shakl: ko‘priklar, minoralar, tom konstruksiyalari uchburchaklardan quriladi. Uning asosiy chiziqlari — mediana, bissektrisa, balandlik — har biri o‘ziga xos xossaga ega.",
    explain: "<p><b>Uchburchak tengsizligi:</b> har bir tomon qolgan ikkitasi yig‘indisidan kichik: a < b + c.</p><ul><li><b>Mediana</b> — uchdan qarshi tomon o‘rtasiga tushirilgan kesma.</li><li><b>Bissektrisa</b> — burchakni teng ikkiga bo‘luvchi kesma.</li><li><b>Balandlik</b> — uchdan qarshi tomonga (yoki davomiga) tushirilgan perpendikulyar.</li><li><b>O‘rta chiziq</b> — ikki tomon o‘rtalarini tutashtiruvchi kesma; u uchinchi tomonga parallel va uning yarmiga teng.</li></ul><p>Teng yonli uchburchakda asosga tushirilgan mediana ham bissektrisa, ham balandlik.</p><p><b>Perimetr</b> P = a + b + c. O‘rta chiziqlardan tuzilgan uchburchak perimetri P/2.</p>",
    rule: "O‘rta chiziq = ½ · parallel tomon. Uchburchak tengsizligi: a < b + c.",
    tip: "3, 4 va 8 uzunlikdagi kesmalardan uchburchak yasab bo‘lmaydi: 3 + 4 < 8.",
    demos: TRI,
    ex: [
      ["Uchburchak perimetri 36. O‘rta chiziqlaridan tuzilgan uchburchak perimetri?", ["Har bir o‘rta chiziq mos tomonning yarmi", "P = 36/2 = 18"], "18"],
      ["Teng yonli uchburchak yon tomoni 10, asosi 12. Asosga tushirilgan balandlik?", ["Balandlik asosni teng ikkiga bo‘ladi: 6", "h = √(10² − 6²) = 8"], "8"]
    ],
    qz: [
      ["Qaysi uchlik uchburchak tomonlari bo‘la oladi?", ["5, 7, 10", "2, 3, 6", "1, 1, 3", "4, 5, 9"], "5 + 7 > 10."],
      ["O‘rta chiziq 7 ga teng. Unga parallel tomon?", ["14", "7", "3,5", "21"], "2·7."],
      ["Teng tomonli uchburchakning balandligi ayni paytda nima?", ["mediana va bissektrisa", "faqat mediana", "o‘rta chiziq", "hech biri"], "Simmetriya."]
    ]
  });
  add("3.3.2", {
    life: "Uchburchak burchaklari yig‘indisi 180° — bu oddiy fakt navigatsiya, arxitektura va astronomiyada masofalarni hisoblashning asosi.",
    explain: "<span class='fb'>∠A + ∠B + ∠C = 180°</span><ul><li><b>Tashqi burchak</b> = unga qo‘shni bo‘lmagan ikki ichki burchak yig‘indisi.</li><li>Teng yonli uchburchakda asosdagi burchaklar teng.</li><li>Teng tomonli uchburchakda har bir burchak 60°.</li><li>Katta tomon qarshisida katta burchak yotadi (va aksincha).</li><li>To‘g‘ri burchakli uchburchakda o‘tkir burchaklar yig‘indisi 90°.</li></ul><p><b>Misol:</b> burchaklar 2 : 3 : 4 nisbatda → 180/9 = 20 → 40°, 60°, 80°.</p>",
    rule: "Ichki burchaklar yig‘indisi 180°. Tashqi burchak = ikki uzoq ichki burchak yig‘indisi.",
    tip: "Uchburchakda faqat bitta to‘g‘ri yoki o‘tmas burchak bo‘lishi mumkin.",
    ex: [
      ["Teng yonli uchburchakning uchidagi burchagi 40°. Asosdagi burchaklar?", ["(180° − 40°)/2 = 70°"], "70° va 70°"],
      ["Uchburchak burchaklari 1 : 2 : 3 nisbatda. Eng katta burchak?", ["180/6 = 30", "3·30 = 90°"], "90°"]
    ],
    qz: [
      ["Uchburchakning ikki burchagi 45° va 75°. Uchinchisi?", ["60°", "50°", "70°", "80°"], "180 − 120."],
      ["Tashqi burchak 130°, unga qo‘shni bo‘lmagan bir ichki burchak 70°. Ikkinchisi?", ["60°", "50°", "110°", "130°"], "130 − 70."],
      ["To‘g‘ri burchakli uchburchakning bir o‘tkir burchagi 35°. Ikkinchisi?", ["55°", "65°", "45°", "145°"], "90 − 35."]
    ]
  });
  add("3.3.3", {
    life: "Narvon devorga qanchalik yetadi? Televizor diagonali 55 dyuym — eni va bo‘yi qancha? Pifagor teoremasi — matematikaning eng mashhur va eng foydali teoremasi.",
    explain: "<span class='fb'>c² = a² + b² &nbsp; (Pifagor teoremasi)</span><p>c — gipotenuza (to‘g‘ri burchak qarshisidagi eng uzun tomon), a, b — katetlar.</p><p><b>Trigonometrik munosabatlar:</b> sin A = [[a/c]], cos A = [[b/c]], tg A = [[a/b]].</p><p><b>Muhim xossalar:</b></p><ul><li>30° li burchak qarshisidagi katet gipotenuzaning yarmiga teng.</li><li>Gipotenuzaga tushirilgan mediana gipotenuzaning yarmiga teng.</li><li>Gipotenuzaga tushirilgan balandlik: h = [[ab/c]], h² = a<sub>c</sub>·b<sub>c</sub> (katetlarning gipotenuzadagi proyeksiyalari).</li><li>Yuz: S = ½ab.</li></ul><p><b>Pifagor uchliklari:</b> 3-4-5, 5-12-13, 8-15-17, 7-24-25 (va ularga karralilar: 6-8-10, 9-12-15).</p>",
    rule: "c² = a² + b². 30° qarshisidagi katet = c/2. Gipotenuzaga mediana = c/2.",
    tip: "Pifagor uchliklarini yodlang — hisoblashni sezilarli tezlashtiradi.",
    demos: [{ type: "triCalc" }],
    ex: [
      ["Katetlar 9 va 12. Gipotenuza va gipotenuzaga tushirilgan balandlik?", ["c = √(81 + 144) = 15", "h = ab/c = 108/15 = 7,2"], "15 va 7,2"],
      ["Gipotenuza 20, bir burchak 30°. Katetlar?", ["30° qarshisidagi katet = 20/2 = 10", "Ikkinchisi: √(400 − 100) = 10√3"], "10 va 10√3"]
    ],
    qz: [
      ["Katetlar 5 va 12. Gipotenuza?", ["13", "17", "√119", "15"], "5-12-13 uchligi."],
      ["Gipotenuza 10. Gipotenuzaga tushirilgan mediana?", ["5", "10", "√50", "2,5"], "c/2."],
      ["Katet 8, gipotenuza 17. Ikkinchi katet?", ["15", "9", "√353", "12"], "√(289 − 64) = 15."]
    ]
  });
  add("3.3.4", {
    life: "Ko‘l bo‘ylab ikki nuqta orasidagi masofani to‘g‘ridan-to‘g‘ri o‘lchab bo‘lmaydi. Ammo uchinchi nuqtadan ikki masofa va burchakni o‘lchab, kosinuslar teoremasi bilan topish mumkin.",
    explain: "<span class='fb'>c² = a² + b² − 2ab·cos C &nbsp; (kosinuslar teoremasi)</span><span class='fb'>[[a/sin A]] = [[b/sin B]] = [[c/sin C]] = 2R &nbsp; (sinuslar teoremasi)</span><p>R — tashqi chizilgan aylana radiusi.</p><p><b>Qachon qaysi biri?</b></p><ul><li>Ikki tomon va ular orasidagi burchak → kosinuslar teoremasi (uchinchi tomon).</li><li>Uch tomon → kosinuslar teoremasi (burchak): cos C = [[(a² + b² − c²)/(2ab)]].</li><li>Tomon va ikki burchak → sinuslar teoremasi.</li></ul><p><b>Burchak turini aniqlash:</b> c² < a² + b² → C o‘tkir; c² = a² + b² → to‘g‘ri; c² > a² + b² → o‘tmas.</p>",
    rule: "c² = a² + b² − 2ab cos C; a/sin A = 2R.",
    tip: "cos 120° = −½ — o‘tmas burchakda kosinus manfiy, shuning uchun “− 2ab cos C” qo‘shishga aylanadi.",
    demos: TRI,
    ex: [
      ["a = 5, b = 8, C = 60°. c = ?", ["c² = 25 + 64 − 2·5·8·½ = 89 − 40 = 49", "c = 7"], "7"],
      ["a = 6, A = 30°. Tashqi chizilgan aylana radiusi?", ["a/sin A = 2R → 6/(1/2) = 12 = 2R"], "R = 6"]
    ],
    qz: [
      ["a = 3, b = 5, C = 120°. c = ?", ["7", "√19", "8", "√34"], "9 + 25 + 15 = 49."],
      ["Tomonlari 4, 5, 7 bo‘lgan uchburchak qanday?", ["o‘tmas burchakli", "o‘tkir burchakli", "to‘g‘ri burchakli", "teng yonli"], "49 > 16 + 25."],
      ["Teng tomonli uchburchak tomoni 6√3. R = ?", ["6", "3", "6√3", "12"], "a/sin 60° = 12 = 2R."]
    ]
  });
  add("3.3.5", {
    life: "Balandlik — uchburchak yuzi va burchaklarini bog‘lovchi asosiy element. Balandliklar xossalari murakkab geometrik masalalarni oddiy hisobga aylantiradi.",
    explain: "<p><b>Asosiy xossalar:</b></p><ul><li>Uchburchakning uchta balandligi (yoki ularning davomlari) bitta nuqtada kesishadi — <b>ortomarkaz</b>.</li><li>Yuz orqali: S = ½a·hₐ = ½b·h_b = ½c·h_c → balandliklar tomonlarga teskari proporsional: hₐ : h_b = b : a.</li><li>Eng kichik balandlik eng katta tomonga tushiriladi.</li><li>To‘g‘ri burchakli uchburchakda gipotenuzaga balandlik: h = [[ab/c]].</li><li>Teng tomonli uchburchakda h = [[a√3/2]].</li></ul><p><b>Balandlikni topish:</b> avval yuzni (masalan Geron formulasi bilan) topamiz, keyin h = [[2S/a]].</p>",
    rule: "h = 2S/a. Teng tomonli: h = a√3/2.",
    tip: "O‘tmas burchakli uchburchakda ikkita balandlik tashqariga — tomon davomiga tushadi.",
    ex: [
      ["Tomonlari 13, 14, 15 bo‘lgan uchburchakning 14 ga tushirilgan balandligi?", ["Geron: p = 21, S = √(21·8·7·6) = 84", "h = 2·84/14 = 12"], "12"],
      ["Teng tomonli uchburchak balandligi 6√3. Tomoni?", ["a√3/2 = 6√3", "a = 12"], "12"]
    ],
    qz: [
      ["Uchburchak yuzi 30, tomoni 12. Shu tomonga balandlik?", ["5", "2,5", "10", "6"], "2·30/12."],
      ["Teng tomonli uchburchak tomoni 4. Balandligi?", ["2√3", "4√3", "√3", "2"], "4√3/2."],
      ["Tomonlari 6 va 8, ularga balandliklar h₁ va h₂. h₁ : h₂ = ?", ["4 : 3", "3 : 4", "1 : 1", "6 : 8"], "Teskari proporsional."]
    ]
  });
  add("3.3.6", {
    life: "Bissektrisa xossasi tomonlarni proporsional bo‘lishga oid masalalarda “sehrli kalit” vazifasini o‘taydi. U geometriya olimpiadalarida ham sevimli mavzu.",
    explain: "<p><b>Bissektrisa xossasi:</b> bissektrisa qarshi tomonni yopishgan tomonlarga proporsional bo‘laklarga bo‘ladi:</p><span class='fb'>[[AD/DC]] = [[AB/BC]]</span><p>(BD — B burchak bissektrisasi.)</p><ul><li>Uchta bissektrisa bitta nuqtada kesishadi — <b>ichki chizilgan aylana markazi</b>.</li><li>Bissektrisaning har bir nuqtasi burchak tomonlaridan teng uzoqlikda.</li><li>Bissektrisa uzunligi: l<sub>c</sub> = [[2ab·cos(C/2)/(a + b)]].</li></ul><p><b>Misol:</b> AB = 6, BC = 9, AC = 10. Bissektrisa AC ni 6 : 9 = 2 : 3 nisbatda bo‘ladi → AD = 4, DC = 6.</p>",
    rule: "Bissektrisa qarshi tomonni yon tomonlarga proporsional bo‘ladi: AD/DC = AB/BC.",
    tip: "Proporsiyada qaysi bo‘lak qaysi tomonga yopishganini adashtirmang: AD — AB ga, DC — BC ga yopishgan.",
    ex: [
      ["AB = 8, BC = 12, AC = 15. B bissektrisasi AC ni qanday bo‘laklarga bo‘ladi?", ["AD : DC = 8 : 12 = 2 : 3", "AD = 15·2/5 = 6, DC = 9"], "6 va 9"],
      ["Bissektrisa qarshi tomonni 3 va 5 ga bo‘ldi. Kichik yon tomon 9. Katta yon tomon?", ["3 : 5 = 9 : x", "x = 15"], "15"]
    ],
    qz: [
      ["Bissektrisa qarshi tomonni 4 va 6 ga bo‘ldi. Yon tomonlar nisbati?", ["2 : 3", "4 : 10", "1 : 1", "3 : 2"], "4 : 6."],
      ["Teng yonli uchburchakda asosga tushirilgan bissektrisa asosni qanday bo‘ladi?", ["teng ikkiga", "1 : 2", "yon tomonlar nisbatida emas", "aniqlab bo‘lmaydi"], "Yon tomonlar teng."],
      ["Ichki chizilgan aylana markazi nima kesishgan nuqtasi?", ["bissektrisalar", "medianalar", "balandliklar", "o‘rta perpendikulyarlar"], "Bissektrisa — tomonlardan teng uzoq."]
    ]
  });
  add("3.3.7", {
    life: "Uchburchak shaklidagi plastinkani barmoq uchida muvozanatda ushlab turish mumkin bo‘lgan nuqta — medianalar kesishish nuqtasi (og‘irlik markazi). Muhandislar konstruksiya muvozanatini shu orqali hisoblaydi.",
    explain: "<p><b>Medianalar xossalari:</b></p><ul><li>Uchta mediana bitta nuqtada kesishadi (<b>og‘irlik markazi</b>, sentroid).</li><li>Bu nuqta har bir medianani uchidan boshlab <b>2 : 1</b> nisbatda bo‘ladi.</li><li>Mediana uchburchakni yuzalari teng ikki uchburchakka bo‘ladi; uchta mediana — teng yuzli 6 ta uchburchakka.</li></ul><span class='fb'>mₐ = ½√(2b² + 2c² − a²)</span><p>To‘g‘ri burchakli uchburchakda gipotenuzaga mediana = c/2.</p>",
    rule: "Medianalar kesishish nuqtasi ularni uchidan 2 : 1 nisbatda bo‘ladi.",
    tip: "2 : 1 nisbatda katta bo‘lak UCHGA yaqin tomonda.",
    ex: [
      ["Mediana 12. Og‘irlik markazidan uchgacha masofa?", ["2 : 1 → 12·[[2/3]] = 8"], "8"],
      ["Tomonlari 6, 8, 10 bo‘lgan uchburchakda 10 ga tushirilgan mediana?", ["6² + 8² = 10² → to‘g‘ri burchakli", "Gipotenuzaga mediana = 10/2 = 5"], "5"]
    ],
    qz: [
      ["Mediana 9. Og‘irlik markazidan tomonga masofa (mediana bo‘ylab)?", ["3", "6", "4,5", "9"], "1/3 qismi."],
      ["Uchburchak yuzi 24. Mediana uni qanday yuzali qismlarga bo‘ladi?", ["12 va 12", "8 va 16", "6 va 18", "aniqlab bo‘lmaydi"], "Teng yuzli."],
      ["a = 8, b = c = 5. a ga tushirilgan mediana?", ["3", "4", "√41", "5"], "Teng yonli: √(25 − 16)."]
    ]
  });
  add("3.3.8", {
    life: "Aralash bo‘lim — uchburchakka oid barcha bilimlarni birlashtiruvchi masalalar. Bu yerda bitta masala ichida Pifagor, burchaklar va medianalar uchrashadi.",
    explain: "<p><b>Uchburchak masalalarini yechish strategiyasi:</b></p><ol><li><b>Chizma chizing</b> va berilganlarni belgilang.</li><li>Uchburchak turini aniqlang: to‘g‘ri burchakli? teng yonli? teng tomonli?</li><li>Yordamchi chiziq o‘tkazing: balandlik (to‘g‘ri burchakli uchburchaklar hosil qiladi), mediana davomi.</li><li>Kerakli teoremani tanlang: Pifagor, kosinuslar, sinuslar, bissektrisa xossasi.</li></ol><p><b>Teng tomonli uchburchak formulalari</b> (tomon a): h = [[a√3/2]], S = [[a²√3/4]], R = [[a√3/3]], r = [[a√3/6]], R = 2r.</p>",
    rule: "Teng tomonli: S = a²√3/4, R = a/√3, r = a/(2√3).",
    tip: "Masala tushunarsiz bo‘lsa, balandlik tushiring — ko‘pincha yechim shu yerda.",
    demos: TRI,
    ex: [
      ["Teng tomonli uchburchak tomoni 6. Yuzi va tashqi chizilgan aylana radiusi?", ["S = 36√3/4 = 9√3", "R = 6√3/3 = 2√3"], "9√3 va 2√3"],
      ["Teng yonli uchburchakda asos 16, yon tomon 10. Yuzi?", ["h = √(100 − 64) = 6", "S = ½·16·6 = 48"], "48"]
    ],
    qz: [
      ["Teng tomonli uchburchak yuzi 4√3. Tomoni?", ["4", "2", "8", "2√3"], "a²√3/4 = 4√3."],
      ["Teng tomonli uchburchakda R : r = ?", ["2 : 1", "1 : 1", "3 : 1", "√3 : 1"], "R = 2r."],
      ["To‘g‘ri burchakli uchburchakda katetlar 6 va 8. Yuzi?", ["24", "48", "30", "14"], "½·6·8."]
    ]
  });
  add("3.3.9", {
    life: "Yer uchastkasi maydoni, uchburchak shaklidagi tom yuzi, yelkan materiali — uchburchak yuzini hisoblashning bir necha usuli bor, va masalaga qarab eng qulayini tanlash kerak.",
    explain: "<span class='fb'>S = ½·a·h</span><span class='fb'>S = ½·a·b·sin C</span><span class='fb'>S = √(p(p − a)(p − b)(p − c)), &nbsp; p = [[(a + b + c)/2]] &nbsp; (Geron)</span><span class='fb'>S = p·r = [[abc/(4R)]]</span><p>r — ichki, R — tashqi chizilgan aylana radiusi.</p><p><b>Qaysi formulani tanlash?</b></p><ul><li>Asos va balandlik → ½ah.</li><li>Ikki tomon va burchak → ½ab sin C.</li><li>Uch tomon → Geron.</li><li>Radiuslar so‘ralsa → S = pr va S = abc/(4R).</li></ul>",
    rule: "S = ½ah = ½ab sin C = √(p(p−a)(p−b)(p−c)) = pr = abc/(4R).",
    tip: "Geron formulasida p — YARIM perimetr.",
    demos: TRI,
    ex: [
      ["Tomonlari 5, 5, 6 bo‘lgan uchburchak yuzi va ichki chizilgan aylana radiusi?", ["p = 8, S = √(8·3·3·2) = 12", "r = S/p = 12/8 = 1,5"], "S = 12, r = 1,5"],
      ["a = 8, b = 10, C = 30°. S = ?", ["S = ½·8·10·sin 30° = 40·½"], "20"]
    ],
    qz: [
      ["Asos 10, balandlik 7. S = ?", ["35", "70", "17", "14"], "½·10·7."],
      ["Tomonlari 3, 4, 5. Ichki chizilgan aylana radiusi?", ["1", "2", "1,5", "2,5"], "S = 6, p = 6."],
      ["a = b = 6, C = 150°. S = ?", ["9", "18", "9√3", "36"], "½·36·½."]
    ]
  });
  add("3.3.10", {
    life: "Daraxt soyasi va o‘z soyangiz orqali daraxt balandligini topish, xarita masshtabi, fotosuratni kattalashtirish — hammasi o‘xshash uchburchaklar xossasiga asoslangan.",
    explain: "<p>Uchburchaklar <b>o‘xshash</b>, agar burchaklari teng va mos tomonlari proporsional bo‘lsa: [[a₁/a₂]] = [[b₁/b₂]] = [[c₁/c₂]] = k (o‘xshashlik koeffitsienti).</p><p><b>O‘xshashlik alomatlari:</b></p><ol><li>Ikki burchagi teng (BB).</li><li>Ikki tomoni proporsional va ular orasidagi burchaklar teng (TBT).</li><li>Uch tomoni proporsional (TTT).</li></ol><p><b>Muhim natijalar:</b></p><ul><li>Perimetrlar nisbati = k.</li><li><b>Yuzalar nisbati = k²</b>.</li><li>Uchburchak tomoniga parallel chiziq unga o‘xshash uchburchak kesib oladi.</li></ul>",
    rule: "O‘xshash uchburchaklarda: P₁/P₂ = k, S₁/S₂ = k².",
    tip: "Tomonlar 2 marta katta bo‘lsa, yuz 2 emas, 4 marta katta!",
    ex: [
      ["Odam bo‘yi 1,8 m, soyasi 2 m. Shu paytda daraxt soyasi 12 m. Daraxt balandligi?", ["O‘xshash uchburchaklar: h/12 = 1,8/2", "h = 10,8 m"], "10,8 m"],
      ["O‘xshash uchburchaklar yuzlari 16 va 36. Kichigining tomoni 8. Kattasining mos tomoni?", ["k² = 36/16 → k = 3/2", "8·1,5 = 12"], "12"]
    ],
    qz: [
      ["O‘xshashlik koeffitsienti 3. Yuzalar nisbati?", ["9", "3", "6", "27"], "k²."],
      ["Uchburchak o‘rta chizig‘i kesib olgan uchburchak yuzi butun yuzning qancha qismi?", ["[[1/4]]", "[[1/2]]", "[[1/3]]", "[[1/8]]"], "k = 1/2, k² = 1/4."],
      ["Perimetrlar 12 va 18. Mos tomonlar nisbati?", ["2 : 3", "4 : 9", "1 : 2", "3 : 2"], "Perimetrlar nisbati = k."]
    ]
  });

  // ===== 3.4 To'rtburchaklar =====
  add("3.4.1", {
    life: "Xona poli, futbol maydoni, telefon ekrani — to‘g‘ri to‘rtburchaklar. Kafel sonini, bo‘yoq miqdorini, ekran diagonalini hisoblash uchun ularning formulalarini bilish kerak.",
    explain: "<p><b>Har qanday qavariq to‘rtburchak:</b> burchaklari yig‘indisi 360°; yuzi S = ½d₁d₂ sin φ (d — diagonallar, φ — ular orasidagi burchak).</p><p><b>To‘g‘ri to‘rtburchak</b> (tomonlar a, b):</p><ul><li>S = ab, P = 2(a + b).</li><li>Diagonallar teng: d = √(a² + b²), kesishish nuqtasida teng ikkiga bo‘linadi.</li></ul><p><b>Kvadrat</b> (tomon a):</p><ul><li>S = a² = [[d²/2]], P = 4a.</li><li>d = a√2; diagonallar perpendikulyar va burchaklar bissektrisasi.</li></ul>",
    rule: "To‘g‘ri to‘rtburchak: d = √(a² + b²). Kvadrat: d = a√2, S = d²/2.",
    tip: "Kvadrat yuzini diagonal orqali: S = d²/2 (d² emas!).",
    
    ex: [
      ["To‘g‘ri to‘rtburchak tomonlari 6 va 8. Diagonali?", ["d = √(36 + 64) = 10"], "10"],
      ["Kvadrat diagonali 6√2. Yuzi?", ["a = 6, S = 36 (yoki d²/2 = 72/2)"], "36"]
    ],
    qz: [
      ["Perimetri 20, bir tomoni 4 bo‘lgan to‘g‘ri to‘rtburchak yuzi?", ["24", "16", "20", "80"], "Ikkinchi tomon 6."],
      ["Kvadrat yuzi 50. Diagonali?", ["10", "5√2", "25", "√50"], "d²/2 = 50."],
      ["To‘rtburchak burchaklaridan uchtasi 80°, 90°, 100°. To‘rtinchisi?", ["90°", "80°", "100°", "70°"], "360 − 270."]
    ]
  });
  add("3.4.2", {
    life: "Olmos shakli, plitkalardagi naqshlar, uchar varrak — romb. Uning diagonallari o‘zaro perpendikulyar bo‘lgani uchun yuzini hisoblash juda oson.",
    explain: "<p><b>Romb</b> — barcha tomonlari teng parallelogramm.</p><ul><li>Diagonallari <b>perpendikulyar</b> va kesishish nuqtasida teng ikkiga bo‘linadi.</li><li>Diagonallari burchaklarning bissektrisalari.</li><li>Qarama-qarshi burchaklar teng, qo‘shni burchaklar yig‘indisi 180°.</li></ul><span class='fb'>S = ½·d₁·d₂ = a·h = a²·sin α</span><span class='fb'>a² = ([[d₁/2]])² + ([[d₂/2]])²</span><p>Romb ichiga aylana chizish mumkin: r = [[h/2]].</p>",
    rule: "S = ½d₁d₂. Tomon: a = √((d₁/2)² + (d₂/2)²).",
    tip: "Diagonallar yarimlari va tomon to‘g‘ri burchakli uchburchak hosil qiladi — Pifagorni ishlating.",
    ex: [
      ["Romb diagonallari 12 va 16. Tomoni va yuzi?", ["Yarimlari 6 va 8 → a = 10", "S = ½·12·16 = 96"], "a = 10, S = 96"],
      ["Romb tomoni 8, o‘tkir burchagi 30°. Yuzi?", ["S = a²·sin α = 64·½"], "32"]
    ],
    qz: [
      ["Romb diagonallari 6 va 10. S = ?", ["30", "60", "16", "15"], "½·6·10."],
      ["Romb perimetri 40, bir diagonali 12. Ikkinchi diagonal?", ["16", "8", "20", "14"], "a = 10, √(100 − 36) = 8 → 16."],
      ["Romb burchaklaridan biri 60°. Kichik diagonal tomonga nisbatan qanday?", ["teng", "yarmi", "ikki marta katta", "√3 marta katta"], "Teng tomonli uchburchak hosil bo‘ladi."]
    ]
  });
  add("3.4.3", {
    life: "Parallelogramm — mexanizmlarda harakatni uzatuvchi richaglar, kuchlarni qo‘shish (fizikada parallelogramm qoidasi) uchun asos.",
    explain: "<p><b>Parallelogramm</b> — qarama-qarshi tomonlari juft-juft parallel to‘rtburchak.</p><ul><li>Qarama-qarshi tomonlar va burchaklar teng.</li><li>Qo‘shni burchaklar yig‘indisi 180°.</li><li>Diagonallar kesishish nuqtasida teng ikkiga bo‘linadi.</li><li>Diagonal parallelogrammni ikkita teng uchburchakka bo‘ladi.</li></ul><span class='fb'>S = a·hₐ = a·b·sin α = ½d₁d₂ sin φ</span><span class='fb'>d₁² + d₂² = 2(a² + b²)</span><p>Burchak bissektrisasi qarama-qarshi tomondan teng yonli uchburchak kesib oladi.</p>",
    rule: "S = ab sin α; d₁² + d₂² = 2(a² + b²).",
    tip: "Balandlik va yon tomonni adashtirmang: S = a·b faqat to‘g‘ri to‘rtburchakda.",
    ex: [
      ["Parallelogramm tomonlari 6 va 10, burchagi 30°. Yuzi?", ["S = 6·10·sin 30° = 30"], "30"],
      ["Tomonlari 5 va 7, bir diagonali 8. Ikkinchi diagonal?", ["d₂² = 2(25 + 49) − 64 = 84", "d₂ = 2√21"], "2√21"]
    ],
    qz: [
      ["Parallelogramm burchaklaridan biri 70°. Unga qo‘shni burchak?", ["110°", "70°", "20°", "140°"], "180 − 70."],
      ["Asos 12, unga balandlik 5. S = ?", ["60", "30", "17", "120"], "a·h."],
      ["Diagonallar kesishish nuqtasi ularni qanday bo‘ladi?", ["teng ikkiga", "1 : 2", "1 : 3", "teng bo‘lmagan"], "Asosiy xossa."]
    ]
  });
  add("3.4.4", {
    life: "Yo‘l ko‘tarmasi kesimi, kanal tubi, tom qiyaligi, sumkaning yon tomoni — trapetsiya. Uning o‘rta chizig‘i va yuzini hisoblash qurilishda tez-tez kerak bo‘ladi.",
    explain: "<p><b>Trapetsiya</b> — faqat ikki tomoni (asoslar a va b) parallel to‘rtburchak.</p><span class='fb'>O‘rta chiziq m = [[(a + b)/2]]</span><span class='fb'>S = [[(a + b)/2]]·h = m·h</span><p><b>Teng yonli trapetsiya:</b> yon tomonlar teng, asosdagi burchaklar teng, diagonallar teng. Katta asosga balandlik tushirilsa, u katta asosni [[(a − b)/2]] va [[(a + b)/2]] bo‘laklarga bo‘ladi.</p><p><b>To‘g‘ri burchakli trapetsiya</b> — bir yon tomoni asoslarga perpendikulyar (u balandlik).</p><p>Diagonallari perpendikulyar teng yonli trapetsiyada h = m.</p>",
    rule: "m = (a + b)/2, S = m·h. Teng yonlida balandlik asosdan (a − b)/2 kesib oladi.",
    tip: "Trapetsiya yuzi uchun balandlik kerak — uni ko‘pincha Pifagor orqali yon tomondan topasiz.",
    ex: [
      ["Teng yonli trapetsiya asoslari 10 va 22, yon tomoni 10. Yuzi?", ["(22 − 10)/2 = 6", "h = √(100 − 36) = 8", "S = (10 + 22)/2·8 = 128"], "128"],
      ["Trapetsiya o‘rta chizig‘i 9, bir asosi 6. Ikkinchi asos?", ["(6 + x)/2 = 9 → x = 12"], "12"]
    ],
    qz: [
      ["Asoslar 4 va 10, balandlik 6. S = ?", ["42", "84", "60", "24"], "7·6."],
      ["O‘rta chiziq 12, balandlik 5. S = ?", ["60", "30", "17", "120"], "m·h."],
      ["Teng yonli trapetsiyada asosdagi burchak 50°. Yuqoridagi burchak?", ["130°", "50°", "40°", "140°"], "180 − 50."]
    ]
  });

  // ===== 3.5 =====
  add("3.5", {
    life: "Asalari uyasi oltiburchak shaklida, futbol to‘pi besh va oltiburchaklardan tikilgan. Muntazam ko‘pburchaklar tabiat va dizaynda go‘zallik va tejamkorlik ramzi.",
    explain: "<span class='fb'>Ichki burchaklar yig‘indisi = 180°(n − 2)</span><span class='fb'>Tashqi burchaklar yig‘indisi = 360°</span><span class='fb'>Diagonallar soni = [[n(n − 3)/2]]</span><p><b>Muntazam n-burchak</b> (barcha tomon va burchaklar teng):</p><ul><li>Har bir ichki burchak: [[180°(n − 2)/n]]; tashqi burchak: [[360°/n]].</li><li>Tomon: a = 2R sin[[180°/n]], r = R cos[[180°/n]].</li></ul><p><b>Muntazam oltiburchak:</b> tomoni tashqi chizilgan aylana radiusiga teng (a = R); yuzi S = [[3√3a²/2]] (6 ta teng tomonli uchburchak).</p>",
    rule: "Ichki burchaklar yig‘indisi 180°(n − 2); tashqi — doim 360°.",
    tip: "Muntazam ko‘pburchakning tashqi burchagi berilsa, n = 360°/tashqi burchak.",
    ex: [
      ["Muntazam ko‘pburchakning ichki burchagi 140°. Tomonlari soni?", ["Tashqi burchak: 180° − 140° = 40°", "n = 360°/40° = 9"], "9"],
      ["Muntazam oltiburchak tomoni 4. Yuzi?", ["S = 3√3·16/2 = 24√3"], "24√3"]
    ],
    qz: [
      ["Beshburchak ichki burchaklari yig‘indisi?", ["540°", "360°", "720°", "900°"], "180·3."],
      ["Oltiburchakning diagonallari soni?", ["9", "6", "12", "15"], "6·3/2."],
      ["Muntazam sakkizburchakning ichki burchagi?", ["135°", "120°", "144°", "150°"], "180·6/8."]
    ]
  });

  // ===== 3.6 Aylana va doira =====
  add("3.6.1", {
    life: "G‘ildirak, soat siferblati, quduq qopqog‘i — aylana. Urinma (g‘ildirak yo‘lga tegib turgan chiziq), vatar va radiuslar o‘rtasidagi bog‘lanishlar ko‘plab masalalarni yechadi.",
    explain: "<ul><li><b>Radius</b> R — markazdan aylanagacha; <b>diametr</b> d = 2R.</li><li><b>Vatar</b> — aylananing ikki nuqtasini tutashtiruvchi kesma; eng katta vatar — diametr.</li><li>Vatarga perpendikulyar diametr vatarni teng ikkiga bo‘ladi.</li><li>Markazdan vatargacha masofa d bo‘lsa: (vatar/2)² + d² = R².</li><li><b>Urinma</b> aylana bilan bitta umumiy nuqtaga ega va urinish nuqtasiga o‘tkazilgan radiusga perpendikulyar.</li><li>Bir nuqtadan o‘tkazilgan ikki urinma kesmalari teng.</li></ul>",
    rule: "Urinma ⊥ radius. Vatar: (l/2)² + d² = R².",
    tip: "Vatar masalalarida markazdan vatarga perpendikulyar tushiring — to‘g‘ri burchakli uchburchak hosil bo‘ladi.",
    demos: CIR,
    ex: [
      ["R = 10, vatar uzunligi 16. Markazdan vatargacha masofa?", ["(16/2)² + d² = 10²", "d = √(100 − 64) = 6"], "6"],
      ["Aylana markazidan 13 masofadagi nuqtadan urinma o‘tkazildi, R = 5. Urinma kesmasi?", ["Urinma ⊥ radius → Pifagor", "√(169 − 25) = 12"], "12"]
    ],
    qz: [
      ["R = 5. Eng katta vatar?", ["10", "5", "25", "2,5"], "Diametr."],
      ["Urinma va urinish nuqtasiga o‘tkazilgan radius orasidagi burchak?", ["90°", "45°", "180°", "60°"], "Urinma xossasi."],
      ["R = 5, markazdan vatargacha 3. Vatar?", ["8", "4", "6", "10"], "2·√(25 − 9)."]
    ]
  });
  add("3.6.2", {
    life: "Velosiped g‘ildiragi bir aylanishda qancha yo‘l yuradi? Yer ekvatori qancha? Aylana uzunligi formulasi — insoniyatning eng qadimiy kashfiyotlaridan biri (π soni).",
    explain: "<span class='fb'>C = 2πR = πd</span><p>π ≈ 3,14159… — har qanday aylana uzunligining diametriga nisbati.</p><p><b>Masalalar turlari:</b></p><ul><li>G‘ildirak n marta aylansa, bosib o‘tilgan yo‘l n·2πR.</li><li>Radius k marta oshsa, uzunlik ham k marta oshadi.</li><li>Radius Δ ga oshsa, uzunlik 2πΔ ga oshadi (dastlabki radiusga bog‘liq emas!).</li></ul>",
    rule: "C = 2πR. Radius k marta → uzunlik k marta.",
    tip: "Yer ekvatori bo‘ylab tortilgan arqonni 1 m uzaytirsak, u Yerdan ≈ 16 sm ko‘tariladi — chunki ΔR = 1/(2π).",
    demos: CIR,
    ex: [
      ["G‘ildirak diametri 70 sm. 100 marta aylanganda qancha yo‘l (π ≈ 22/7)?", ["C = πd = 22/7·70 = 220 sm", "100·220 = 22 000 sm = 220 m"], "220 m"],
      ["Aylana uzunligi 18π. Radiusi?", ["2πR = 18π → R = 9"], "9"]
    ],
    qz: [
      ["R = 4. C = ?", ["8π", "16π", "4π", "2π"], "2π·4."],
      ["Radius 3 marta oshdi. Aylana uzunligi?", ["3 marta oshadi", "9 marta oshadi", "o‘zgarmaydi", "6 marta oshadi"], "C proporsional R ga."],
      ["C = 10π. Diametr?", ["10", "5", "20", "10π"], "πd = 10π."]
    ]
  });
  add("3.6.3", {
    life: "Yo‘lning aylanma burilishi uzunligi, soat mili uchining 15 daqiqada bosib o‘tgan yo‘li, pitsa bo‘lagining qirrasi — aylana yoyi uzunligi.",
    explain: "<span class='fb'>l = [[πRα/180°]] &nbsp; (α — gradusda)</span><span class='fb'>l = R·α &nbsp; (α — radianda)</span><p>Yoy uzunligi — aylananing [[α/360°]] qismi.</p><p><b>Misol:</b> R = 6, α = 60°: l = π·6·60/180 = 2π.</p><p>Radian ta’rifi aynan shundan: yoy uzunligi radiusga teng bo‘lsa, burchak 1 radian.</p>",
    rule: "l = πRα/180° = R·α(rad).",
    tip: "Burchak gradusda bo‘lsa, formulada 180° bo‘lishi shart; radianda — shunchaki R·α.",
    demos: CIR,
    ex: [
      ["R = 9, markaziy burchak 40°. Yoy uzunligi?", ["l = π·9·40/180 = 2π"], "2π"],
      ["Soat daqiqa mili uzunligi 12 sm. 20 daqiqada uchi qancha yo‘l bosadi?", ["20 daqiqa — 120°", "l = π·12·120/180 = 8π ≈ 25,1 sm"], "8π sm"]
    ],
    qz: [
      ["R = 3, α = 90°. l = ?", ["[[3π/2]]", "3π", "[[3π/4]]", "6π"], "π·3·90/180."],
      ["R = 5, α = 2 rad. l = ?", ["10", "5", "2,5", "10π"], "R·α."],
      ["Yoy aylananing [[1/6]] qismi. Markaziy burchak?", ["60°", "30°", "45°", "120°"], "360/6."]
    ]
  });
  add("3.6.4", {
    life: "Teatrdagi qaysi o‘rindan sahna bir xil burchak ostida ko‘rinadi? Aylanadagi barcha nuqtalardan vatar bir xil burchak ostida ko‘rinadi — ichki chizilgan burchak teoremasi.",
    explain: "<ul><li><b>Markaziy burchak</b> (uchi markazda) o‘zi tiralgan yoyga teng.</li><li><b>Ichki chizilgan burchak</b> (uchi aylanada) o‘zi tiralgan yoyning <b>yarmiga</b> teng.</li><li>Bir yoyga tiralgan ichki chizilgan burchaklar teng.</li><li><b>Diametrga tiralgan</b> ichki chizilgan burchak — 90°.</li><li><b>Urinma va vatar orasidagi burchak</b> ular orasidagi yoyning yarmiga teng.</li></ul><span class='fb'>ichki chizilgan burchak = ½ · markaziy burchak</span>",
    rule: "Ichki chizilgan burchak = yoyning yarmi. Diametrga tiralgan burchak = 90°.",
    tip: "Bir yoyga tiralgan markaziy burchak ichki chizilgan burchakdan 2 marta katta.",
    demos: CIR,
    ex: [
      ["Ichki chizilgan burchak 35°. Shu yoyga tiralgan markaziy burchak?", ["Markaziy = 2·35° = 70°"], "70°"],
      ["AB — diametr, C aylanada, ∠A = 25°. ∠B = ?", ["∠C = 90° (diametrga tiralgan)", "∠B = 180° − 90° − 25° = 65°"], "65°"]
    ],
    qz: [
      ["Markaziy burchak 100°. Shu yoyga tiralgan ichki chizilgan burchak?", ["50°", "100°", "200°", "80°"], "Yarmi."],
      ["Diametrga tiralgan ichki chizilgan burchak?", ["90°", "180°", "45°", "60°"], "Yarim aylana — 180°, yarmi 90°."],
      ["Urinma va vatar orasidagi yoy 80°. Burchak?", ["40°", "80°", "160°", "100°"], "Yoyning yarmi."]
    ]
  });
  add("3.6.5", {
    life: "Kesishuvchi vatarlar teoremasi — bitta tenglik bilan noma’lum kesmani topish imkonini beradi. Qadimgi muhandislar arkalar radiusini shu usulda hisoblagan.",
    explain: "<p>Aylanada AB va CD vatarlar E nuqtada kesishsa:</p><span class='fb'>AE · EB = CE · ED</span><p>Ya’ni bir vatar bo‘laklari ko‘paytmasi ikkinchisi bo‘laklari ko‘paytmasiga teng.</p><p><b>Arka radiusi:</b> arka eni 2a, balandligi h bo‘lsa, a·a = h·(2R − h) → R = [[(a² + h²)/(2h)]].</p><p>Kesishgan vatarlar orasidagi burchak ular kesgan yoylar yig‘indisining yarmiga teng.</p>",
    rule: "Kesishuvchi vatarlar: AE·EB = CE·ED.",
    tip: "Bo‘laklar har bir vatarda kesishish nuqtasidan uchlarigacha olinadi.",
    ex: [
      ["Vatarlar kesishdi: bir vatar bo‘laklari 4 va 6, ikkinchisining bir bo‘lagi 3. Ikkinchi bo‘lak?", ["4·6 = 3·x", "x = 8"], "8"],
      ["Arka eni 8 m, balandligi 2 m. Aylana radiusi?", ["a = 4: 4·4 = 2(2R − 2)", "16 = 4R − 4 → R = 5"], "5 m"]
    ],
    qz: [
      ["Bo‘laklar 2 va 9; 3 va x. x = ?", ["6", "5", "4", "12"], "18 = 3x."],
      ["Diametrga perpendikulyar vatar uni 4 va 9 ga bo‘lgan nuqtadan o‘tadi. Vatar uzunligi?", ["12", "6", "13", "36"], "x² = 36 → x = 6, vatar 12."],
      ["Vatarlar bo‘laklari 5 va 8; x va x. x = ?", ["√40", "6,5", "20", "40"], "x² = 40."]
    ]
  });
  add("3.6.6", {
    life: "Tashqi nuqtadan aylanaga o‘tkazilgan urinma va kesuvchi — bu teoremani dengizchilar mayoq ko‘rinish masofasini, astronomlar esa ufq uzoqligini hisoblashda ishlatgan.",
    explain: "<p>Aylanadan tashqaridagi M nuqtadan urinma MA va kesuvchi MBC o‘tkazilsa:</p><span class='fb'>MA² = MB · MC</span><p>(urinma kvadrati = kesuvchining tashqi qismi × butun kesuvchi).</p><p>Ikki kesuvchi uchun: MB·MC = MD·ME.</p><p>Ufq masofasi: balandlik h dan ko‘rinadigan ufq ≈ √(2Rh) (R — Yer radiusi).</p><p>Tashqi nuqtadan kesuvchilar orasidagi burchak — kesilgan yoylar ayirmasining yarmi.</p>",
    rule: "Urinma² = tashqi qism × butun kesuvchi.",
    tip: "Kesuvchi uchun BUTUN kesuvchi uzunligini (tashqi qism + vatar) oling, faqat vatarni emas.",
    ex: [
      ["Kesuvchining tashqi qismi 4, vatar qismi 5. Urinma uzunligi?", ["Butun kesuvchi 4 + 5 = 9", "MA² = 4·9 = 36 → MA = 6"], "6"],
      ["Urinma 8, kesuvchining tashqi qismi 4. Aylana ichidagi qism?", ["64 = 4·x → x = 16 (butun kesuvchi)", "Ichki qism: 16 − 4 = 12"], "12"]
    ],
    qz: [
      ["Urinma 10, tashqi qism 5. Butun kesuvchi?", ["20", "15", "25", "50"], "100 = 5x."],
      ["Tashqi qism 2, butun kesuvchi 18. Urinma?", ["6", "36", "9", "√20"], "√36."],
      ["Ikki kesuvchi: 3 va 12; 4 va x (butunlari). x = ?", ["9", "16", "6", "8"], "36 = 4x."]
    ]
  });
  add("3.6.7", {
    life: "Pitsa o‘lchami 30 sm va 40 sm — kattasi qancha ko‘p? Diametri atigi 1,33 marta katta, lekin yuzi 1,78 marta! Doira yuzi radius kvadratiga proporsional.",
    explain: "<span class='fb'>S = πR² = [[πd²/4]]</span><ul><li>Radius k marta oshsa, yuz k² marta oshadi.</li><li>Aylana uzunligi orqali: S = [[C²/(4π)]].</li><li><b>Halqa</b> (ikki konsentrik aylana orasi): S = π(R² − r²).</li></ul><p><b>Misol:</b> R = 7 (π ≈ 22/7): S = 22/7·49 = 154.</p>",
    rule: "S = πR². Radius k marta → yuz k² marta.",
    tip: "Diametr berilsa, avval radiusga o‘tkazing: d = 10 → R = 5 → S = 25π (100π emas!).",
    demos: CIR,
    ex: [
      ["Aylana uzunligi 12π. Doira yuzi?", ["2πR = 12π → R = 6", "S = 36π"], "36π"],
      ["Halqa: R = 5, r = 3. Yuzi?", ["S = π(25 − 9) = 16π"], "16π"]
    ],
    qz: [
      ["d = 8. S = ?", ["16π", "64π", "8π", "32π"], "R = 4."],
      ["Radius 2 marta oshdi. Yuz?", ["4 marta oshadi", "2 marta oshadi", "8 marta", "o‘zgarmaydi"], "k²."],
      ["S = 49π. Aylana uzunligi?", ["14π", "7π", "49π", "28π"], "R = 7."]
    ]
  });
  add("3.6.8", {
    life: "Pitsa bo‘lagi — sektor, nonning kesib olingan cheti — segment. Ular yuzini hisoblash uchun aylanadan qancha “bo‘lak” olinganini bilish kifoya.",
    explain: "<span class='fb'>S<sub>sektor</sub> = [[πR²α/360°]] = ½·l·R</span><span class='fb'>S<sub>segment</sub> = S<sub>sektor</sub> − S<sub>uchburchak</sub> = [[πR²α/360°]] − ½R²sin α</span><p>(α < 180° bo‘lganda; α > 180° da uchburchak yuzi qo‘shiladi.)</p><p><b>Misol:</b> R = 6, α = 90°. S<sub>sektor</sub> = 36π/4 = 9π; S<sub>uchburchak</sub> = ½·36 = 18; S<sub>segment</sub> = 9π − 18.</p>",
    rule: "Sektor = πR²α/360°; segment = sektor − ½R² sin α.",
    tip: "Sektor yuzini yoy uzunligi orqali ham topish mumkin: S = ½·l·R.",
    demos: CIR,
    ex: [
      ["R = 6, α = 60°. Sektor yuzi?", ["S = π·36·60/360 = 6π"], "6π"],
      ["R = 4, α = 90°. Segment yuzi?", ["Sektor: 16π/4 = 4π", "Uchburchak: ½·16 = 8", "4π − 8"], "4π − 8"]
    ],
    qz: [
      ["R = 10, α = 36°. Sektor yuzi?", ["10π", "100π", "36π", "5π"], "100π/10."],
      ["Yoy uzunligi 4, R = 5. Sektor yuzi?", ["10", "20", "9", "4π"], "½·4·5."],
      ["Yarim doira yuzi (R = 2)?", ["2π", "4π", "π", "8π"], "½·4π."]
    ]
  });
  add("3.6.9", {
    life: "GPS-navigatsiya, radiolokatsiya — “mendan 5 km uzoqlikdagi barcha nuqtalar” aylanadir. Koordinata tekisligida aylana tenglama bilan yoziladi.",
    explain: "<span class='fb'>(x − a)² + (y − b)² = R²</span><p>(a; b) — markaz, R — radius.</p><ul><li>Markaz koordinata boshida: x² + y² = R².</li><li><b>Umumiy ko‘rinishdan markazni topish</b> — to‘la kvadrat ajratish: x² + y² − 6x + 4y − 3 = 0 → (x − 3)² + (y + 2)² = 16 → markaz (3; −2), R = 4.</li><li>Nuqta aylanada, ichida yoki tashqarisida — markazgacha masofani R bilan solishtiramiz.</li></ul>",
    rule: "(x − a)² + (y − b)² = R². Markaz ishorasi qavsdagidan teskari.",
    tip: "(x + 3)² — markazning x koordinatasi −3 (plyus emas!).",
    ex: [
      ["x² + y² + 4x − 10y + 20 = 0 aylana markazi va radiusi?", ["(x² + 4x + 4) + (y² − 10y + 25) = −20 + 4 + 25", "(x + 2)² + (y − 5)² = 9"], "Markaz (−2; 5), R = 3"],
      ["Markazi (1; −2), (4; 2) nuqtadan o‘tuvchi aylana tenglamasi?", ["R² = (4 − 1)² + (2 + 2)² = 9 + 16 = 25"], "(x − 1)² + (y + 2)² = 25"]
    ],
    qz: [
      ["(x − 3)² + (y + 1)² = 16 markazi?", ["(3; −1)", "(−3; 1)", "(3; 1)", "(−3; −1)"], "Ishoralar teskari."],
      ["x² + y² = 25 radiusi?", ["5", "25", "12,5", "√5"], "R² = 25."],
      ["(2; 3) nuqta x² + y² = 10 aylanaga nisbatan qayerda?", ["tashqarida", "aylanada", "ichida", "markazda"], "4 + 9 = 13 > 10."]
    ]
  });

  // ===== 3.7 Aylana va ko'pburchak =====
  add("3.7.1", {
    life: "Uchburchakning uchala uchidan o‘tadigan aylana markazi — uchta qishloqdan teng uzoqlikdagi joy (masalan, maktab qurish uchun). Ichki chizilgan aylana markazi — uchala yo‘ldan teng uzoq nuqta.",
    explain: "<p><b>Tashqi chizilgan aylana</b> — uchburchakning uchala uchidan o‘tadi. Markazi — tomonlarga o‘tkazilgan o‘rta perpendikulyarlar kesishgan nuqta.</p><span class='fb'>R = [[abc/(4S)]] = [[a/(2sin A)]]</span><p><b>Ichki chizilgan aylana</b> — uchala tomonga urinadi. Markazi — bissektrisalar kesishgan nuqta.</p><span class='fb'>r = [[S/p]] &nbsp; (p — yarim perimetr)</span><p><b>To‘g‘ri burchakli uchburchakda:</b> R = [[c/2]] (markaz — gipotenuza o‘rtasi), r = [[(a + b − c)/2]].</p><p><b>Teng tomonli:</b> R = [[a√3/3]], r = [[a√3/6]].</p>",
    rule: "R = abc/(4S), r = S/p. To‘g‘ri burchaklida R = c/2, r = (a + b − c)/2.",
    tip: "O‘tmas burchakli uchburchakda tashqi aylana markazi uchburchakdan tashqarida yotadi.",
    demos: TRI,
    ex: [
      ["Katetlari 6 va 8 bo‘lgan to‘g‘ri burchakli uchburchakda R va r?", ["c = 10 → R = 5", "r = (6 + 8 − 10)/2 = 2"], "R = 5, r = 2"],
      ["Tomonlari 13, 14, 15. R = ?", ["S = 84 (Geron)", "R = 13·14·15/(4·84) = 2730/336 = 8,125"], "[[65/8]]"]
    ],
    qz: [
      ["Teng tomonli uchburchak tomoni 6. r = ?", ["√3", "2√3", "3", "6"], "6√3/6."],
      ["Gipotenuza 26. Tashqi chizilgan aylana radiusi?", ["13", "26", "6,5", "52"], "c/2."],
      ["S = 24, p = 12. r = ?", ["2", "12", "4", "0,5"], "S/p."]
    ]
  });
  add("3.7.2", {
    life: "Kvadrat stolga dumaloq dasturxon, dumaloq idishga kvadrat qopqoq — kvadrat va aylana munosabatlari dizayn va qadoqlashda uchraydi.",
    explain: "<p>Kvadrat tomoni a bo‘lsa:</p><ul><li><b>Ichki chizilgan aylana</b> radiusi r = [[a/2]] (tomonlarga urinadi).</li><li><b>Tashqi chizilgan aylana</b> radiusi R = [[a√2/2]] = [[d/2]] (diagonal yarmi).</li><li>R = r√2.</li></ul><p><b>Teskari:</b> radiusi R bo‘lgan aylanaga ichki chizilgan kvadrat tomoni a = R√2, yuzi 2R².</p><p>Doiraga ichki chizilgan kvadrat doira yuzining [[2/π]] ≈ 64% ini egallaydi.</p>",
    rule: "Kvadrat: r = a/2, R = a√2/2 = a/√2.",
    tip: "Tashqi aylana diametri — kvadrat diagonali, ichki aylana diametri — kvadrat tomoni.",
    ex: [
      ["Kvadrat tomoni 8. Ichki va tashqi chizilgan aylana radiuslari?", ["r = 8/2 = 4", "R = 8√2/2 = 4√2"], "4 va 4√2"],
      ["R = 5 aylanaga ichki chizilgan kvadrat yuzi?", ["Diagonal = 2R = 10", "S = d²/2 = 50"], "50"]
    ],
    qz: [
      ["Kvadratga ichki chizilgan aylana radiusi 3. Kvadrat yuzi?", ["36", "9", "18", "12"], "a = 6."],
      ["R = 4√2. Ichki chizilgan kvadrat tomoni?", ["8", "4", "4√2", "16"], "a = R√2."],
      ["Kvadrat uchun R : r = ?", ["√2 : 1", "2 : 1", "1 : 1", "√3 : 1"], "R = r√2."]
    ]
  });
  add("3.7.3", {
    life: "To‘g‘ri to‘rtburchak shaklidagi fotosuratni dumaloq ramkaga joylashtirish — tashqi chizilgan aylana masalasi.",
    explain: "<ul><li>Har qanday to‘g‘ri to‘rtburchak atrofiga aylana chizish mumkin: markazi — diagonallar kesishgan nuqta, R = [[d/2]] = [[√(a² + b²)/2]].</li><li>To‘g‘ri to‘rtburchak ichiga aylana chizish mumkin faqat u <b>kvadrat</b> bo‘lsa.</li></ul><p><b>Umumiy qoida:</b> to‘rtburchak atrofiga aylana chizish mumkin ⇔ qarama-qarshi burchaklari yig‘indisi 180°. Ichiga aylana chizish mumkin ⇔ qarama-qarshi tomonlari yig‘indilari teng (a + c = b + d).</p>",
    rule: "To‘g‘ri to‘rtburchak: R = √(a² + b²)/2.",
    tip: "Romb (kvadrat bo‘lmagan) atrofiga aylana chizib bo‘lmaydi, to‘g‘ri to‘rtburchak ichiga esa chizib bo‘lmaydi.",
    ex: [
      ["Tomonlari 6 va 8 bo‘lgan to‘g‘ri to‘rtburchakka tashqi chizilgan aylana uzunligi?", ["d = 10 → R = 5", "C = 2π·5 = 10π"], "10π"],
      ["R = 13, bir tomoni 10. Ikkinchi tomon?", ["d = 26", "b = √(676 − 100) = 24"], "24"]
    ],
    qz: [
      ["To‘g‘ri to‘rtburchak diagonali 12. R = ?", ["6", "12", "24", "3"], "d/2."],
      ["Qaysi to‘rtburchak atrofiga aylana chizib BO‘LMAYDI?", ["kvadrat bo‘lmagan romb", "kvadrat", "to‘g‘ri to‘rtburchak", "teng yonli trapetsiya"], "Burchaklar yig‘indisi sharti bajarilmaydi."],
      ["Tomonlari 5 va 12. R = ?", ["6,5", "13", "8,5", "6"], "13/2."]
    ]
  });
  add("3.7.4", {
    life: "Romb ichiga chizilgan aylana — g‘ildirak markazdagi teshik, plitkalar naqshi. Romb doim ichki aylanaga ega, chunki uning qarama-qarshi tomonlari yig‘indisi teng.",
    explain: "<ul><li>Har qanday romb ichiga aylana chizish mumkin; markazi — diagonallar kesishgan nuqta.</li><li>Ichki aylana diametri rombning balandligiga teng: r = [[h/2]].</li><li>Yuz orqali: S = a·h = 2a·r → r = [[S/(2a)]] = [[d₁d₂/(4a)]].</li></ul><p><b>Misol:</b> diagonallar 12 va 16 → a = 10, S = 96 → h = 9,6, r = 4,8.</p>",
    rule: "Rombga ichki chizilgan aylana: r = h/2 = S/(2a).",
    tip: "Romb atrofiga (kvadrat bo‘lmasa) aylana chizib bo‘lmaydi.",
    ex: [
      ["Romb diagonallari 6 va 8. Ichki chizilgan aylana radiusi?", ["a = 5, S = 24", "h = 24/5 = 4,8 → r = 2,4"], "2,4"],
      ["Romb tomoni 10, o‘tkir burchagi 30°. Ichki aylana radiusi?", ["h = a sin 30° = 5", "r = 2,5"], "2,5"]
    ],
    qz: [
      ["Romb balandligi 8. Ichki aylana radiusi?", ["4", "8", "16", "2"], "h/2."],
      ["Romb yuzi 40, tomoni 10. r = ?", ["2", "4", "5", "1"], "40/20."],
      ["Ichki aylana markazi rombda qayerda?", ["diagonallar kesishgan nuqtada", "uchida", "tomon o‘rtasida", "tashqarida"], "Simmetriya markazi."]
    ]
  });
  add("3.7.5", {
    life: "Trapetsiya va aylana masalalari — DTMning eng go‘zal geometrik topshiriqlaridan. Ichki va tashqi aylana shartlari trapetsiya o‘lchamlarini qat’iy belgilaydi.",
    explain: "<p><b>Trapetsiya atrofiga aylana</b> chizish mumkin ⇔ u <b>teng yonli</b>.</p><p><b>Trapetsiya ichiga aylana</b> chizish mumkin ⇔ asoslar yig‘indisi yon tomonlar yig‘indisiga teng: a + b = c + d.</p><ul><li>Bunda balandlik h = 2r.</li><li>Teng yonli trapetsiyada: yon tomon c = [[(a + b)/2]] (o‘rta chiziqqa teng), h² = a·b.</li><li>Yuz: S = [[(a + b)/2]]·2r = (a + b)r.</li></ul>",
    rule: "Ichki aylana: a + b = c + d, h = 2r. Teng yonlida h² = ab.",
    tip: "Trapetsiyaga ichki aylana chizilgan bo‘lsa, o‘rta chiziq = yon tomonlar yig‘indisining yarmi.",
    ex: [
      ["Teng yonli trapetsiyaga aylana ichki chizilgan, asoslari 2 va 8. Yon tomoni va radiusi?", ["c = (2 + 8)/2 = 5", "h = √(2·8) = 4 → r = 2"], "c = 5, r = 2"],
      ["Trapetsiyaga ichki aylana chizilgan, yon tomonlari 7 va 9, r = 3. Yuzi?", ["a + b = 7 + 9 = 16", "S = (a + b)/2 · 2r = 8·6 = 48"], "48"]
    ],
    qz: [
      ["Trapetsiyaga ichki aylana chizilgan, asoslar 4 va 10. Yon tomonlar yig‘indisi?", ["14", "7", "6", "28"], "a + b = c + d."],
      ["Trapetsiyaga ichki aylana radiusi 5. Balandlik?", ["10", "5", "2,5", "25"], "h = 2r."],
      ["Qaysi trapetsiya atrofiga aylana chizish mumkin?", ["teng yonli", "to‘g‘ri burchakli", "har qanday", "hech biri"], "Qarama-qarshi burchaklar yig‘indisi 180°."]
    ]
  });
  add("3.7.6", {
    life: "Muntazam ko‘pburchaklar va aylanalar — g‘ildirak, gayka, mozaika. Arximed π sonini aylanaga ichki va tashqi chizilgan 96-burchaklar perimetri orqali baholagan!",
    explain: "<p>Har qanday muntazam ko‘pburchakka ham ichki, ham tashqi aylana chizish mumkin, markazlari ustma-ust tushadi.</p><span class='fb'>a = 2R·sin[[180°/n]], &nbsp; r = R·cos[[180°/n]]</span><table class='oq-t'><tr><th>n</th><th>a (R orqali)</th><th>r (a orqali)</th></tr><tr><td>3</td><td>R√3</td><td>a√3/6</td></tr><tr><td>4</td><td>R√2</td><td>a/2</td></tr><tr><td>6</td><td>R</td><td>a√3/2</td></tr></table><p>Yuz: S = ½·P·r (P — perimetr).</p><p>Oltiburchakning eng katta diagonali 2R = 2a.</p>",
    rule: "aₙ = 2R sin(180°/n). Oltiburchakda a = R.",
    tip: "Muntazam oltiburchak — 6 ta teng tomonli uchburchakdan iborat: hamma narsani shundan hisoblang.",
    ex: [
      ["R = 6 aylanaga ichki chizilgan muntazam uchburchak tomoni?", ["a = R√3 = 6√3"], "6√3"],
      ["Muntazam oltiburchak tomoni 4. Ichki chizilgan aylana radiusi?", ["r = a√3/2 = 2√3"], "2√3"]
    ],
    qz: [
      ["R = 10 aylanaga ichki chizilgan muntazam oltiburchak tomoni?", ["10", "5", "10√3", "20"], "a = R."],
      ["Muntazam ko‘pburchak perimetri 30, r = 4. Yuzi?", ["60", "120", "30", "34"], "½·30·4."],
      ["Muntazam oltiburchak tomoni 3. Eng katta diagonali?", ["6", "3", "3√3", "9"], "2a."]
    ]
  });

  // ===== 3.8 Koordinatalar =====
  add("3.8", {
    life: "Xaritadagi nuqtalar orasidagi masofa, GPS koordinatalari, kompyuter o‘yinlaridagi obyektlar joylashuvi — koordinatalar sistemasi geometriyani algebraga aylantiradi.",
    explain: "<span class='fb'>AB = √((x₂ − x₁)² + (y₂ − y₁)²)</span><span class='fb'>Kesma o‘rtasi: ([[(x₁ + x₂)/2]]; [[(y₁ + y₂)/2]])</span><p><b>To‘g‘ri chiziq tenglamasi:</b> y = kx + b, k = [[(y₂ − y₁)/(x₂ − x₁)]].</p><p><b>Uchburchak yuzi</b> uchlari bo‘yicha: S = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.</p><p><b>Simmetriya:</b> (x; y) nuqtaning Ox ga simmetrigi (x; −y), Oy ga (−x; y), koordinata boshiga (−x; −y).</p><p>Nuqtadan Ox gacha masofa |y|, Oy gacha |x|.</p>",
    rule: "Masofa: √(Δx² + Δy²). O‘rta nuqta — koordinatalar o‘rta arifmetigi.",
    tip: "Masofa formulasida ayirmalar kvadratga ko‘tariladi — ishoraga e’tibor bermasangiz ham bo‘ladi, lekin qavslarni to‘g‘ri yozing.",
    ex: [
      ["A(−1; 2) va B(5; 10) orasidagi masofa va AB o‘rtasi?", ["AB = √(36 + 64) = 10", "O‘rta: ((−1 + 5)/2; (2 + 10)/2) = (2; 6)"], "10; (2; 6)"],
      ["M(3; 4) — AB o‘rtasi, A(1; −2). B = ?", ["(1 + x)/2 = 3 → x = 5", "(−2 + y)/2 = 4 → y = 10"], "B(5; 10)"]
    ],
    qz: [
      ["O(0; 0) va A(6; 8) orasidagi masofa?", ["10", "14", "48", "7"], "√(36 + 64)."],
      ["(2; −5) nuqtaning Oy ga simmetrigi?", ["(−2; −5)", "(2; 5)", "(−2; 5)", "(5; 2)"], "x ishorasi o‘zgaradi."],
      ["A(2; 3), B(6; 7). AB o‘rtasi?", ["(4; 5)", "(8; 10)", "(2; 2)", "(4; 4)"], "O‘rta arifmetik."]
    ]
  });

  // ===== 3.9 Vektorlar =====
  const VEC = [{ type: "vectors" }];
  add("3.9.1", {
    life: "Shamol yo‘nalishi va kuchi, samolyot tezligi, kuch — kattalik va yo‘nalishga ega miqdorlar vektor bilan tasvirlanadi. Koordinatalar vektorlar bilan ishlashni oddiy arifmetikaga aylantiradi.",
    explain: "<p>A(x₁; y₁) dan B(x₂; y₂) ga yo‘nalgan vektor:</p><span class='fb'>AB⃗ = (x₂ − x₁; y₂ − y₁)</span><p>(“oxiridan boshini ayiramiz”).</p><p><b>Amallar</b> (a(a₁; a₂), b(b₁; b₂)):</p><ul><li>Qo‘shish: a + b = (a₁ + b₁; a₂ + b₂).</li><li>Ayirish: a − b = (a₁ − b₁; a₂ − b₂).</li><li>Songa ko‘paytirish: k·a = (ka₁; ka₂).</li></ul><p><b>Teng vektorlar</b> — mos koordinatalari teng. <b>Qarama-qarshi</b>: −a = (−a₁; −a₂).</p>",
    rule: "AB⃗ = (x_B − x_A; y_B − y_A). Amallar koordinatama-koordinata bajariladi.",
    tip: "Vektor koordinatasi — OXIR minus BOSH, teskarisi emas.",
    demos: VEC,
    ex: [
      ["A(2; −1), B(5; 3). AB⃗ koordinatalari?", ["(5 − 2; 3 − (−1)) = (3; 4)"], "(3; 4)"],
      ["a(1; 2), b(−3; 4). 2a − b = ?", ["2a = (2; 4)", "2a − b = (2 + 3; 4 − 4) = (5; 0)"], "(5; 0)"]
    ],
    qz: [
      ["a(3; −2) + b(1; 5) = ?", ["(4; 3)", "(2; −7)", "(3; −10)", "(4; −7)"], "Koordinatalarni qo‘shamiz."],
      ["A(1; 1), B(4; 5). BA⃗ = ?", ["(−3; −4)", "(3; 4)", "(5; 6)", "(−3; 4)"], "A − B."],
      ["3·(2; −1) = ?", ["(6; −3)", "(5; 2)", "(6; 3)", "(2; −3)"], "Har bir koordinata 3 ga."]
    ]
  });
  add("3.9.2", {
    life: "Vektor uzunligi — kuch yoki tezlik kattaligi. Masalan, shimolga 3 km va sharqqa 4 km yurgan odam boshlang‘ich nuqtadan 5 km uzoqlashadi.",
    explain: "<span class='fb'>|a| = √(a₁² + a₂²)</span><p>Fazoda: |a| = √(a₁² + a₂² + a₃²).</p><ul><li>|AB⃗| = AB — nuqtalar orasidagi masofa.</li><li>|k·a| = |k|·|a|.</li><li><b>Birlik vektor</b> — uzunligi 1: e = [[a/|a|]].</li><li>Uchburchak tengsizligi: |a + b| ≤ |a| + |b|.</li></ul>",
    rule: "|a| = √(a₁² + a₂²).",
    tip: "|a + b| ≠ |a| + |b| (yo‘nalishlar bir xil bo‘lmasa).",
    demos: VEC,
    ex: [
      ["a(−6; 8). |a| = ?", ["√(36 + 64) = 10"], "10"],
      ["a(3; 4), b(1; −1). |a + 2b| = ?", ["a + 2b = (5; 2)", "√(25 + 4) = √29"], "√29"]
    ],
    qz: [
      ["a(5; 12). |a| = ?", ["13", "17", "7", "√17"], "5-12-13."],
      ["|a| = 4. |−3a| = ?", ["12", "−12", "7", "4"], "|k|·|a|."],
      ["a(x; 3), |a| = 5, x > 0. x = ?", ["4", "2", "√34", "8"], "x² + 9 = 25."]
    ]
  });
  add("3.9.3", {
    life: "Fizikada bajarilgan ish = kuch · yo‘l · cos α — bu skalyar ko‘paytma. U vektorlar orasidagi burchakni va perpendikulyarlikni aniqlashning eng qulay usuli.",
    explain: "<span class='fb'>a · b = |a|·|b|·cos φ</span><span class='fb'>a · b = a₁b₁ + a₂b₂ &nbsp; (koordinatalarda)</span><ul><li><b>a ⊥ b ⇔ a · b = 0.</b></li><li>a · a = |a|².</li><li>φ o‘tkir → a·b > 0; φ o‘tmas → a·b < 0.</li><li>(a + b)² = |a|² + 2a·b + |b|².</li></ul>",
    rule: "a·b = a₁b₁ + a₂b₂. Perpendikulyar ⇔ a·b = 0.",
    tip: "Skalyar ko‘paytma natijasi — SON, vektor emas.",
    demos: VEC,
    ex: [
      ["a(2; −3), b(4; 1). a · b = ?", ["2·4 + (−3)·1 = 8 − 3 = 5"], "5"],
      ["m ning qanday qiymatida a(m; 2) ⊥ b(3; −6)?", ["3m − 12 = 0", "m = 4"], "m = 4"]
    ],
    qz: [
      ["a(1; 2) · b(3; 4) = ?", ["11", "10", "(3; 8)", "7"], "3 + 8."],
      ["|a| = 3, |b| = 4, φ = 60°. a·b = ?", ["6", "12", "6√3", "7"], "12·½."],
      ["Qaysi juftlik perpendikulyar?", ["(2; 1) va (−1; 2)", "(1; 1) va (2; 2)", "(3; 0) va (1; 1)", "(1; 2) va (2; 1)"], "−2 + 2 = 0."]
    ]
  });
  add("3.9.4", {
    life: "Ikki yo‘nalish orasidagi burchakni topish — robototexnikada qo‘l burilishi, navigatsiyada kurs burchagi. Buning uchun skalyar ko‘paytmadan foydalanamiz.",
    explain: "<span class='fb'>cos φ = [[(a · b)/(|a|·|b|)]] = [[(a₁b₁ + a₂b₂)/(√(a₁² + a₂²)·√(b₁² + b₂²))]]</span><p>φ ∈ [0°; 180°].</p><ul><li>cos φ = 1 — bir yo‘nalishda (0°);</li><li>cos φ = 0 — perpendikulyar (90°);</li><li>cos φ = −1 — qarama-qarshi (180°).</li></ul><p>Uchburchak burchagini ham shu usul bilan topish mumkin: ∠A uchun AB⃗ va AC⃗ vektorlar.</p>",
    rule: "cos φ = a·b / (|a|·|b|).",
    tip: "Uchburchak burchagini topishda ikkala vektor ham shu UCHDAN chiqishi kerak.",
    demos: VEC,
    ex: [
      ["a(1; 0), b(1; 1) orasidagi burchak?", ["a·b = 1, |a| = 1, |b| = √2", "cos φ = 1/√2 → φ = 45°"], "45°"],
      ["a(3; 4), b(4; −3) orasidagi burchak?", ["a·b = 12 − 12 = 0"], "90°"]
    ],
    qz: [
      ["a(2; 0), b(−3; 0) orasidagi burchak?", ["180°", "0°", "90°", "45°"], "Qarama-qarshi yo‘nalgan."],
      ["a·b = 6, |a| = 2, |b| = 6. cos φ = ?", ["[[1/2]]", "1", "[[1/3]]", "2"], "6/12."],
      ["a(1; √3), b(1; 0). φ = ?", ["60°", "30°", "45°", "90°"], "cos φ = 1/2."]
    ]
  });
  add("3.9.5", {
    life: "Kollinear vektorlar — bir chiziqda yoki parallel chiziqlarda yotgan vektorlar. Ular orqali uchta nuqta bir to‘g‘ri chiziqda yotishini yoki chiziqlar parallelligini tekshiramiz.",
    explain: "<p>a va b <b>kollinear</b> ⇔ b = k·a (biror k soni uchun) ⇔ koordinatalar proporsional:</p><span class='fb'>[[a₁/b₁]] = [[a₂/b₂]] &nbsp; ⇔ &nbsp; a₁b₂ − a₂b₁ = 0</span><ul><li>k > 0 — bir yo‘nalishli; k < 0 — qarama-qarshi yo‘nalishli.</li><li>A, B, C nuqtalar bir to‘g‘ri chiziqda ⇔ AB⃗ va AC⃗ kollinear.</li></ul>",
    rule: "Kollinear ⇔ a₁/b₁ = a₂/b₂ (yoki a₁b₂ = a₂b₁).",
    tip: "Nol koordinata bo‘lsa, bo‘lish o‘rniga a₁b₂ = a₂b₁ tekshiruvini ishlating.",
    demos: VEC,
    ex: [
      ["m ning qanday qiymatida a(2; m) va b(6; 9) kollinear?", ["2/6 = m/9", "m = 3"], "m = 3"],
      ["A(1; 2), B(3; 6), C(4; 8) bir chiziqdami?", ["AB⃗ = (2; 4), AC⃗ = (3; 6)", "2/3 = 4/6 ✓"], "Ha, bir chiziqda"]
    ],
    qz: [
      ["Qaysi vektor (2; 3) ga kollinear?", ["(−4; −6)", "(3; 2)", "(4; 3)", "(2; −3)"], "k = −2."],
      ["a(1; 2) va b(x; 6) kollinear. x = ?", ["3", "12", "2", "6"], "1/x = 2/6."],
      ["b = −2a bo‘lsa, a va b qanday?", ["qarama-qarshi yo‘nalgan", "bir yo‘nalishli", "perpendikulyar", "teng"], "k < 0."]
    ]
  });

  // ===== 4. Stereometriya =====
  add("4.1", {
    life: "Xona burchagi, devor va pol, quvurlar va simlar — fazodagi chiziq va tekisliklar. Ularning o‘zaro joylashuvini tushunish stereometriyaning poydevori.",
    explain: "<p><b>Ikki to‘g‘ri chiziq fazoda:</b> kesishadi, parallel yoki <b>ayqash</b> (bir tekislikda yotmaydi va kesishmaydi).</p><p><b>To‘g‘ri chiziq va tekislik:</b> chiziq tekislikda yotadi, uni kesadi yoki unga parallel.</p><p><b>Tekislikka perpendikulyar chiziq</b> — tekislikdagi har bir chiziqqa perpendikulyar. Belgisi: tekislikdagi ikkita kesishuvchi chiziqqa perpendikulyar bo‘lsa yetarli.</p><p><b>Uch perpendikulyar teoremasi:</b> og‘ma proyeksiyasi tekislikdagi chiziqqa perpendikulyar bo‘lsa, og‘maning o‘zi ham unga perpendikulyar.</p><p><b>Masofalar:</b> nuqtadan tekislikkacha — perpendikulyar uzunligi; og‘ma, perpendikulyar va proyeksiya to‘g‘ri burchakli uchburchak hosil qiladi.</p><p><b>Ikki yoqli burchak</b> — tekisliklar orasidagi burchak; uning chiziqli burchagi qirraga perpendikulyar chiziqlar orasida o‘lchanadi.</p>",
    rule: "Og‘ma² = perpendikulyar² + proyeksiya².",
    tip: "Ayqash chiziqlar orasidagi burchakni topish uchun birini parallel ko‘chirib, ikkinchisi bilan kesishtiring.",
    ex: [
      ["Nuqtadan tekislikka 12 uzunlikdagi perpendikulyar va 13 uzunlikdagi og‘ma tushirildi. Og‘ma proyeksiyasi?", ["√(169 − 144) = 5"], "5"],
      ["Tekislikdan 8 masofadagi nuqtadan o‘tkazilgan og‘ma tekislik bilan 30° hosil qiladi. Og‘ma uzunligi?", ["sin 30° = 8/l", "l = 16"], "16"]
    ],
    qz: [
      ["Kubning qarama-qarshi yoqlaridagi ayqash diagonallari orasidagi eng katta burchak?", ["90°", "60°", "45°", "0°"], "Masalan, yuqori yoq diagonali (1; 1; 0), pastki yoqdagisi (1; −1; 0) yo‘nalishda — ular orasidagi burchak 90°."],
      ["Perpendikulyar 6, proyeksiya 8. Og‘ma?", ["10", "14", "√28", "48"], "√(36 + 64)."],
      ["Fazoda bir to‘g‘ri chiziqqa perpendikulyar ikki chiziq doim parallelmi?", ["yo‘q", "ha", "faqat kubda", "faqat tekislikda"], "Ular kesishishi yoki ayqash bo‘lishi mumkin."]
    ]
  });
  add("4.2.1", {
    life: "Shakar kubigi, Rubik kubigi, karton quti — kub. Uning hajmi, sirti va diagonallarini bilish qadoqlash va logistikada kerak.",
    explain: "<p>Qirrasi a bo‘lgan kub:</p><span class='fb'>V = a³, &nbsp; S = 6a², &nbsp; d = a√3 (diagonal), &nbsp; d<sub>yoq</sub> = a√2</span><ul><li>Kubning 6 yog‘i, 12 qirrasi, 8 uchi bor.</li><li>Qirra k marta oshsa: sirt k², hajm k³ marta oshadi.</li><li>Kubga ichki chizilgan shar radiusi a/2; tashqi chizilgan shar radiusi [[a√3/2]].</li></ul>",
    rule: "V = a³, S = 6a², d = a√3.",
    tip: "Qirra 2 marta oshsa, hajm 8 marta oshadi (2 emas!).",
    demos: [{ type: "solid", kind: "cube" }],
    ex: [
      ["Kub diagonali 6√3. Hajmi va sirti?", ["a√3 = 6√3 → a = 6", "V = 216, S = 6·36 = 216"], "V = 216, S = 216"],
      ["Kub sirti 150. Hajmi?", ["6a² = 150 → a = 5", "V = 125"], "125"]
    ],
    qz: [
      ["Qirra 4. Hajm?", ["64", "16", "96", "48"], "4³."],
      ["Qirra 3 marta oshdi. Hajm?", ["27 marta", "9 marta", "3 marta", "6 marta"], "k³."],
      ["Qirra 2. Diagonal?", ["2√3", "2√2", "4", "6"], "a√3."]
    ]
  });
  add("4.2.2", {
    life: "Gisht, xona, akvarium, yuk konteyneri — to‘g‘ri burchakli parallelepiped. Xonaga qancha havo sig‘adi, akvariumga necha litr suv ketadi — hajm formulasi javob beradi.",
    explain: "<p><b>To‘g‘ri burchakli parallelepiped</b> (o‘lchamlari a, b, c):</p><span class='fb'>V = abc, &nbsp; S = 2(ab + bc + ac), &nbsp; d² = a² + b² + c²</span><ul><li>Barcha diagonallari teng va bir nuqtada kesishadi.</li><li>Umumiy parallelepiped: V = S<sub>asos</sub>·h.</li></ul><p>1 litr = 1 dm³ = 1000 sm³; 1 m³ = 1000 litr.</p>",
    rule: "V = abc, d² = a² + b² + c².",
    tip: "O‘lchov birliklarini bir xil qiling: 2 m × 50 sm × 30 sm → 20 dm × 5 dm × 3 dm = 300 l.",
    demos: [{ type: "solid", kind: "prism", title: "Kvadrat asosli to‘g‘ri prizma (parallelepiped)" }],
    ex: [
      ["O‘lchamlari 2, 3, 6. Diagonal va hajm?", ["d = √(4 + 9 + 36) = 7", "V = 36"], "d = 7, V = 36"],
      ["Akvarium 60 × 40 × 50 sm. Necha litr?", ["6 × 4 × 5 = 120 dm³"], "120 litr"]
    ],
    qz: [
      ["O‘lchamlar 3, 4, 12. Diagonal?", ["13", "19", "√169", "12"], "√(9 + 16 + 144) = 13."],
      ["O‘lchamlar 2, 3, 4. To‘la sirt?", ["52", "24", "26", "48"], "2(6 + 12 + 8)."],
      ["Xona 5 × 4 × 3 m. Hajmi?", ["60 m³", "47 m³", "12 m³", "94 m³"], "5·4·3."]
    ]
  });
  add("4.2.3", {
    life: "Uy tomi (uchburchakli prizma), qalam (oltiburchakli prizma), shokolad qutisi — prizmalar. Hajm doim “asos yuzi × balandlik”.",
    explain: "<p><b>Prizma</b> — ikki teng parallel asos va parallelogramm yon yoqlardan iborat ko‘pyoq. <b>To‘g‘ri prizmada</b> yon qirralar asosga perpendikulyar (yon qirra = balandlik).</p><span class='fb'>V = S<sub>asos</sub> · h</span><span class='fb'>S<sub>yon</sub> = P<sub>asos</sub> · h &nbsp; (to‘g‘ri prizma)</span><span class='fb'>S<sub>to‘la</sub> = S<sub>yon</sub> + 2S<sub>asos</sub></span><p><b>Muntazam prizma</b> — asosi muntazam ko‘pburchak bo‘lgan to‘g‘ri prizma. Uchburchakli muntazam prizmada S<sub>asos</sub> = [[a²√3/4]].</p>",
    rule: "V = S_asos·h; S_yon = P·h.",
    tip: "To‘la sirtga IKKI asosni qo‘shishni unutmang.",
    demos: [{ type: "solid", kind: "prism" }],
    ex: [
      ["Muntazam uchburchakli prizma asos tomoni 4, balandligi 5. Hajm va yon sirt?", ["S_asos = 16√3/4 = 4√3", "V = 4√3·5 = 20√3", "S_yon = 12·5 = 60"], "V = 20√3, S_yon = 60"],
      ["To‘g‘ri prizma asosi katetlari 3 va 4 bo‘lgan to‘g‘ri burchakli uchburchak, h = 10. To‘la sirt?", ["Gipotenuza 5, P = 12", "S_yon = 120, S_asos = 6", "S = 120 + 12 = 132"], "132"]
    ],
    qz: [
      ["S_asos = 12, h = 5. V = ?", ["60", "17", "30", "120"], "12·5."],
      ["Asos perimetri 20, h = 6. Yon sirt?", ["120", "26", "60", "240"], "20·6."],
      ["Muntazam to‘rtburchakli prizma: a = 3, h = 4. V = ?", ["36", "48", "12", "24"], "9·4."]
    ]
  });
  add("4.3.1", {
    life: "Misr piramidalari, chodir, ba’zi binolarning tomi — piramida. Hajmi bir xil asos va balandlikdagi prizmaning aynan uchdan biri.",
    explain: "<span class='fb'>V = ⅓ · S<sub>asos</sub> · h</span><p><b>Muntazam piramida</b> — asosi muntazam ko‘pburchak, uchining proyeksiyasi asos markaziga tushadi.</p><span class='fb'>S<sub>yon</sub> = ½ · P<sub>asos</sub> · l &nbsp; (l — apofema, yon yoq balandligi)</span><span class='fb'>S<sub>to‘la</sub> = S<sub>yon</sub> + S<sub>asos</sub></span><p><b>Muntazam to‘rtburchakli piramida</b> (asos tomoni a, balandlik h): apofema l = √(h² + (a/2)²), yon qirra = √(h² + (a√2/2)²).</p><p>Yon yoqlar asos bilan bir xil burchak hosil qilsa, uchning proyeksiyasi asosga ichki chizilgan aylana markaziga tushadi.</p>",
    rule: "V = ⅓S_asos·h; muntazam piramida: S_yon = ½P·l.",
    tip: "Apofema (yon yoq balandligi) va piramida balandligini adashtirmang.",
    demos: [{ type: "solid", kind: "pyramid" }],
    ex: [
      ["Muntazam to‘rtburchakli piramida asos tomoni 6, balandligi 4. Apofema va to‘la sirt?", ["l = √(16 + 9) = 5", "S_yon = ½·24·5 = 60", "S = 60 + 36 = 96"], "l = 5, S = 96"],
      ["Shu piramida hajmi?", ["V = ⅓·36·4 = 48"], "48"]
    ],
    qz: [
      ["S_asos = 18, h = 5. V = ?", ["30", "90", "45", "15"], "⅓·18·5."],
      ["Muntazam piramida asos perimetri 24, apofema 7. Yon sirt?", ["84", "168", "31", "42"], "½·24·7."],
      ["Prizma va piramida asosi va balandligi teng. Hajmlar nisbati?", ["3 : 1", "1 : 1", "2 : 1", "9 : 1"], "V_piramida = ⅓V_prizma."]
    ]
  });
  add("4.4.1", {
    life: "Konserva bankasi, quvur, bochka, stakan — silindr. Bankaga qancha mahsulot sig‘adi, quvur qancha bo‘yoq talab qiladi — formulalar aniq javob beradi.",
    explain: "<p>Radiusi R, balandligi h bo‘lgan silindr:</p><span class='fb'>V = πR²h</span><span class='fb'>S<sub>yon</sub> = 2πRh, &nbsp; S<sub>to‘la</sub> = 2πR(R + h)</span><ul><li>Yon sirt yoyilmasi — to‘g‘ri to‘rtburchak (2πR × h).</li><li><b>O‘q kesimi</b> — to‘g‘ri to‘rtburchak 2R × h; uning diagonali √(4R² + h²).</li><li>O‘q kesimi kvadrat bo‘lsa, h = 2R (“teng tomonli silindr”).</li></ul>",
    rule: "V = πR²h; S_to‘la = 2πR(R + h).",
    tip: "Diametr berilsa, R = d/2 ni olishni unutmang.",
    demos: [{ type: "solid", kind: "cylinder" }],
    ex: [
      ["R = 3, h = 5. Hajm va to‘la sirt?", ["V = π·9·5 = 45π", "S = 2π·3·(3 + 5) = 48π"], "45π va 48π"],
      ["Silindr o‘q kesimi tomoni 6 bo‘lgan kvadrat. Hajmi?", ["2R = 6 → R = 3, h = 6", "V = π·9·6 = 54π"], "54π"]
    ],
    qz: [
      ["R = 2, h = 7. V = ?", ["28π", "14π", "56π", "4π"], "π·4·7."],
      ["R = 4, h = 5. Yon sirt?", ["40π", "80π", "20π", "72π"], "2π·4·5."],
      ["Radius 2 marta oshsa, hajm?", ["4 marta oshadi", "2 marta", "8 marta", "o‘zgarmaydi"], "R² ga proporsional."]
    ]
  });
  add("4.4.2", {
    life: "Muzqaymoq stakanchasi, voronka, qum uyumi, tom gumbazlari — konus. Uning hajmi bir xil asos va balandlikdagi silindrning uchdan biri.",
    explain: "<p>Radiusi R, balandligi h, yasovchisi l bo‘lgan konus:</p><span class='fb'>V = ⅓πR²h</span><span class='fb'>l² = R² + h²</span><span class='fb'>S<sub>yon</sub> = πRl, &nbsp; S<sub>to‘la</sub> = πR(R + l)</span><ul><li>O‘q kesimi — teng yonli uchburchak (asos 2R, yon tomon l).</li><li>Yon sirt yoyilmasi — sektor, burchagi α = [[360°·R/l]].</li></ul>",
    rule: "V = ⅓πR²h; S_yon = πRl, l = √(R² + h²).",
    tip: "Yon sirt uchun balandlik emas, YASOVCHI kerak.",
    demos: [{ type: "solid", kind: "cone" }],
    ex: [
      ["R = 6, h = 8. Yasovchi, yon sirt va hajm?", ["l = √(36 + 64) = 10", "S_yon = π·6·10 = 60π", "V = ⅓π·36·8 = 96π"], "l = 10, S = 60π, V = 96π"],
      ["Konus o‘q kesimi teng tomonli uchburchak, tomoni 4. Yon sirti?", ["R = 2, l = 4", "S_yon = π·2·4 = 8π"], "8π"]
    ],
    qz: [
      ["R = 3, h = 4. l = ?", ["5", "7", "√7", "25"], "√(9 + 16)."],
      ["R = 3, h = 5. V = ?", ["15π", "45π", "5π", "30π"], "⅓π·9·5."],
      ["R = 5, l = 13. Yon sirt?", ["65π", "90π", "25π", "130π"], "π·5·13."]
    ]
  });
  add("4.4.3", {
    life: "Futbol to‘pi, tarvuz, sayyoralar — shar. Arximed shar hajmi tashqi chizilgan silindr hajmining [[2/3]] qismi ekanini kashf qilgan va bu kashfiyotini qabr toshiga o‘yishni vasiyat qilgan.",
    explain: "<span class='fb'>V = [[4/3]]πR³</span><span class='fb'>S = 4πR²</span><ul><li>Sfera — shar sirti.</li><li>Markazdan d masofada o‘tgan tekislik kesimi — doira, radiusi r = √(R² − d²).</li><li>Katta doira (markazdan o‘tgan kesim) yuzi πR²; sfera yuzi — 4 ta katta doira yuzi.</li><li>Radius k marta oshsa: sirt k², hajm k³ marta oshadi.</li></ul>",
    rule: "V = ⁴⁄₃πR³; S = 4πR².",
    tip: "Shar radiusi 2 marta oshsa, hajm 8 marta oshadi — to‘p ichidagi havo ham shunday.",
    demos: [{ type: "solid", kind: "sphere" }],
    ex: [
      ["R = 3. Hajm va sirt?", ["V = 4/3·π·27 = 36π", "S = 4π·9 = 36π"], "36π va 36π"],
      ["Shar markazidan 5 masofada kesim o‘tkazildi, R = 13. Kesim yuzi?", ["r = √(169 − 25) = 12", "S = 144π"], "144π"]
    ],
    qz: [
      ["S = 100π. R = ?", ["5", "10", "25", "√10"], "4πR² = 100π."],
      ["R = 6. V = ?", ["288π", "144π", "216π", "48π"], "4/3·216π."],
      ["Radius 3 marta oshdi. Sirt?", ["9 marta", "3 marta", "27 marta", "6 marta"], "k²."]
    ]
  });
  add("4.5.1", {
    life: "Jismlarning kombinatsiyalari — bir jism ichiga ikkinchisini joylashtirish: qutiga to‘p, sharga kub. Bu masalalarda asosiy narsa — umumiy elementni (radius, diagonal) topish.",
    explain: "<p><b>Prizma va shar:</b></p><ul><li><b>Prizmaga shar ichki chizilgan</b> (barcha yoqlarga urinadi): balandlik h = 2r, va asosga ichki chizilgan aylana radiusi ham r. Kubda r = a/2.</li><li><b>Prizma sharga ichki chizilgan</b> (barcha uchlari sferada): to‘g‘ri prizma bo‘lishi va asosi atrofiga aylana chizish mumkin bo‘lishi kerak. R² = R<sub>asos</sub>² + (h/2)². Kubda R = [[a√3/2]] (diagonalning yarmi), parallelepipedda R = [[d/2]].</li></ul>",
    rule: "Kub: r = a/2, R = a√3/2. Prizmaga ichki shar: h = 2r.",
    tip: "Tashqi shar diametri — jismning eng katta diagonali.",
    ex: [
      ["Qirrasi 4 bo‘lgan kubga tashqi chizilgan shar hajmi?", ["R = 4√3/2 = 2√3", "V = 4/3·π·(2√3)³ = 4/3·π·24√3 = 32√3π"], "32√3π"],
      ["O‘lchamlari 2, 3, 6 bo‘lgan parallelepipedga tashqi chizilgan shar radiusi?", ["d = √(4 + 9 + 36) = 7", "R = 3,5"], "3,5"]
    ],
    qz: [
      ["Kubga ichki chizilgan shar radiusi 3. Kub qirrasi?", ["6", "3", "3√3", "9"], "a = 2r."],
      ["Kub qirrasi 2. Ichki va tashqi shar radiuslari nisbati?", ["1 : √3", "1 : 2", "1 : √2", "1 : 3"], "a/2 : a√3/2."],
      ["Muntazam prizmaga shar ichki chizilgan, r = 5. Prizma balandligi?", ["10", "5", "25", "2,5"], "h = 2r."]
    ]
  });
  add("4.5.2", {
    life: "Piramida va shar kombinatsiyasi — eng chiroyli stereometrik masalalardan biri. Bu yerda piramida kesimida hosil bo‘lgan uchburchak va aylana yechimni beradi.",
    explain: "<p><b>Piramidaga tashqi chizilgan shar:</b> asos atrofiga aylana chizish mumkin bo‘lishi kerak. Muntazam piramidada markaz balandlikda yotadi: (h − R)² + r<sub>asos</sub>² = R², bundan R = [[(h² + r_asos²)/(2h)]] (r_asos — asosga tashqi chizilgan aylana radiusi).</p><p><b>Piramidaga ichki chizilgan shar:</b> markaz balandlikda; asosga ichki chizilgan aylana radiusi ρ, apofema l bo‘lsa, kesim uchburchagiga ichki chizilgan aylana: r = [[ρ·h/(ρ + l)]]. Umumiy formula: r = [[3V/S_to‘la]].</p>",
    rule: "Ichki shar: r = 3V / S_to‘la. Muntazam piramidaga tashqi shar: R = (h² + r²)/(2h).",
    tip: "Kesim tekisligini balandlik va apofema orqali o‘tkazing — masala tekislikdagi uchburchakka keladi.",
    ex: [
      ["Muntazam to‘rtburchakli piramida asos tomoni 6, balandligi 4. Ichki chizilgan shar radiusi?", ["V = ⅓·36·4 = 48", "Apofema 5, S_to‘la = 36 + ½·24·5 = 96", "r = 3·48/96 = 1,5"], "1,5"],
      ["Muntazam to‘rtburchakli piramida: asos diagonalining yarmi 3, balandligi 3. Tashqi shar radiusi?", ["R = (h² + r²)/(2h) = (9 + 9)/6 = 3"], "3"]
    ],
    qz: [
      ["V = 20, S_to‘la = 30. Ichki shar radiusi?", ["2", "1,5", "[[2/3]]", "6"], "3·20/30."],
      ["Muntazam piramidaga tashqi shar markazi qayerda yotadi?", ["balandlik (yoki uning davomi)da", "asos uchida", "yon qirra o‘rtasida", "har doim tashqarida"], "Simmetriya."],
      ["h = 8, asosga tashqi aylana radiusi 4. Tashqi shar R = ?", ["5", "4", "8", "6"], "(64 + 16)/16."]
    ]
  });
  add("4.5.3", {
    life: "Silindrik qutiga to‘p joylashtirish — tennis to‘plari qutisi. Arximedning mashhur kashfiyoti aynan silindr va shar munosabati haqida.",
    explain: "<p><b>Silindrga shar ichki chizilgan</b> (asoslarga va yon sirtga urinadi): h = 2R, silindr radiusi = shar radiusi R. Bunda:</p><span class='fb'>V<sub>shar</sub> : V<sub>silindr</sub> = 2 : 3 &nbsp; (Arximed)</span><p>Sirtlar ham: S<sub>shar</sub> = S<sub>yon silindr</sub> = 4πR².</p><p><b>Silindr sharga ichki chizilgan:</b> o‘q kesimi — to‘g‘ri to‘rtburchak, uning diagonali sharning diametri: (2r)² + h² = (2R)².</p>",
    rule: "Silindrga ichki shar: h = 2R, V_shar/V_silindr = 2/3.",
    tip: "Silindr o‘q kesimining diagonali tashqi shar diametriga teng.",
    ex: [
      ["Silindrga shar ichki chizilgan, shar hajmi 36π. Silindr hajmi?", ["V_silindr = 3/2·36π = 54π"], "54π"],
      ["R = 5 sharga ichki chizilgan silindr balandligi 6. Silindr radiusi?", ["(2r)² + 36 = 100", "2r = 8 → r = 4"], "4"]
    ],
    qz: [
      ["Silindrga ichki shar radiusi 3. Silindr balandligi?", ["6", "3", "9", "12"], "h = 2R."],
      ["Shar va unga tashqi chizilgan silindr hajmlari nisbati?", ["2 : 3", "1 : 2", "3 : 4", "1 : 3"], "Arximed."],
      ["Silindr o‘q kesimi 6 × 8 to‘g‘ri to‘rtburchak. Tashqi shar radiusi?", ["5", "10", "7", "4"], "Diagonal 10."]
    ]
  });
  add("4.5.4", {
    life: "Muzqaymoq stakanchasi ustidagi shar, konussimon idishdagi to‘p — konus va shar kombinatsiyasi. Hammasi o‘q kesimidagi uchburchak va aylanaga keladi.",
    explain: "<p><b>Konusga ichki chizilgan shar:</b> o‘q kesimi — teng yonli uchburchak (asos 2R, yon tomon l, balandlik h). Shar radiusi — shu uchburchakka ichki chizilgan aylana radiusi:</p><span class='fb'>r = [[S/p]] = [[R·h/(R + l)]]</span><p><b>Konusga tashqi chizilgan shar:</b> uchburchakka tashqi chizilgan aylana radiusi:</p><span class='fb'>R<sub>shar</sub> = [[l²/(2h)]]</span><p>Barcha hisob o‘q kesimida tekislik geometriyasi bilan bajariladi.</p>",
    rule: "Konusga ichki shar: r = Rh/(R + l); tashqi shar: R_sh = l²/(2h).",
    tip: "Kesim uchburchagi tomonlari: 2R (asos), l, l (yon tomonlar).",
    ex: [
      ["Konus R = 6, h = 8. Ichki chizilgan shar radiusi?", ["l = 10", "r = 6·8/(6 + 10) = 48/16 = 3"], "3"],
      ["Shu konusga tashqi chizilgan shar radiusi?", ["R_sh = l²/(2h) = 100/16 = 6,25"], "6,25"]
    ],
    qz: [
      ["Konus o‘q kesimi teng tomonli uchburchak, tomoni 6. Ichki shar radiusi?", ["√3", "2√3", "3", "√2"], "a√3/6 = √3."],
      ["R = 3, h = 4 konusga ichki shar radiusi?", ["1,5", "2", "1", "2,5"], "3·4/(3 + 5)."],
      ["l = 10, h = 8. Tashqi shar radiusi?", ["6,25", "5", "8", "12,5"], "100/16."]
    ]
  });
  add("4.5.5", {
    life: "Aralash bo‘lim — stereometriyaning barcha formulalari bitta joyda. Bu yerda jismlar hajmini solishtirish, eritish va qayta quyish masalalari uchraydi.",
    explain: "<table class='oq-t'><tr><th>Jism</th><th>Hajm</th><th>To‘la sirt</th></tr><tr><td>Kub</td><td>a³</td><td>6a²</td></tr><tr><td>Parallelepiped</td><td>abc</td><td>2(ab + bc + ac)</td></tr><tr><td>Prizma</td><td>S·h</td><td>P·h + 2S</td></tr><tr><td>Piramida</td><td>⅓S·h</td><td>½P·l + S</td></tr><tr><td>Silindr</td><td>πR²h</td><td>2πR(R + h)</td></tr><tr><td>Konus</td><td>⅓πR²h</td><td>πR(R + l)</td></tr><tr><td>Shar</td><td>⁴⁄₃πR³</td><td>4πR²</td></tr></table><p><b>Eritish/quyish masalalari:</b> hajm saqlanadi. Masalan, 8 ta radiusi 1 bo‘lgan shar eritilib bitta shar quyilsa: 8·⁴⁄₃π = ⁴⁄₃πR³ → R = 2.</p><p><b>O‘xshash jismlar:</b> chiziqli o‘lchamlar nisbati k bo‘lsa, sirtlar nisbati k², hajmlar nisbati k³.</p>",
    rule: "Eritib qayta quyishda hajm saqlanadi. O‘xshash jismlar: S ~ k², V ~ k³.",
    tip: "Suv to‘ldirilgan idishga jism botirilsa, ko‘tarilgan suv hajmi = jism hajmi.",
    demos: [{ type: "solid" }],
    ex: [
      ["Qirrasi 2 sm bo‘lgan 27 ta kub eritilib bitta kub quyildi. Yangi qirra?", ["Umumiy hajm: 27·8 = 216", "a³ = 216 → a = 6"], "6 sm"],
      ["Silindrik idish (R = 5) da suv bor. Ichiga radiusi 3 bo‘lgan shar tushirildi. Suv qancha ko‘tariladi?", ["V_shar = 4/3·π·27 = 36π", "π·25·Δh = 36π → Δh = 1,44"], "1,44"]
    ],
    qz: [
      ["Ikki o‘xshash konus balandliklari nisbati 1 : 2. Hajmlar nisbati?", ["1 : 8", "1 : 4", "1 : 2", "1 : 6"], "k³."],
      ["Radiusi 3 bo‘lgan shar eritilib, radiusi 3 bo‘lgan silindr quyildi. Silindr balandligi?", ["4", "3", "6", "9"], "36π = 9πh."],
      ["Konus va silindrning R va h teng. V_konus : V_silindr?", ["1 : 3", "1 : 2", "2 : 3", "1 : 1"], "⅓."]
    ]
  });
})();
