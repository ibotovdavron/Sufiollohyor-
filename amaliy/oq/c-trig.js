/* Oq to'plam — 2-bob Trigonometriya va matematik analiz. */
window.OQ = window.OQ || {};
(() => {
  const add = (code, o) => { window.OQ[code] = o; };
  const UC = [{ type: "unitCircle" }];

  // ===== 2.1 Trigonometriya =====
  add("2.1.1", {
    life: "Qiyalik burchagi, quyosh balandligi, uyning tomi, aylanuvchi g‘ildirak — burchaklar va ularning sinus-kosinuslari muhandislik, astronomiya va navigatsiyada ishlatiladi.",
    explain: "<p><b>Radian o‘lchov:</b> radiusga teng yoyga tiralgan markaziy burchak — 1 radian (≈ 57,3°).</p><span class='fb'>180° = π rad; &nbsp; α(rad) = α° · [[π/180]]</span><p><b>Birlik aylanada</b> (radiusi 1) α burchakka mos nuqta (x; y) bo‘lsa: <b>cos α = x</b>, <b>sin α = y</b>, tg α = [[sin α/cos α]], ctg α = [[cos α/sin α]].</p><table class='oq-t'><tr><th>α</th><th>0</th><th>π/6 (30°)</th><th>π/4 (45°)</th><th>π/3 (60°)</th><th>π/2 (90°)</th></tr><tr><td>sin</td><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr><tr><td>cos</td><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr><tr><td>tg</td><td>0</td><td>√3/3</td><td>1</td><td>√3</td><td>—</td></tr></table><p><b>Choraklardagi ishoralar:</b> I — hammasi +; II — faqat sin +; III — faqat tg, ctg +; IV — faqat cos +.</p><p>−1 ≤ sin α ≤ 1, −1 ≤ cos α ≤ 1.</p>",
    rule: "180° = π. sin — y, cos — x. II chorakda sin > 0, III da tg > 0, IV da cos > 0.",
    tip: "sin 30° = 1/2, cos 60° = 1/2 — ular almashib ketmasin: sin kichik burchakda kichik.",
    demos: UC,
    ex: [
      ["150° ni radianga o‘tkazing.", ["150 · π/180 = [[5π/6]]"], "[[5π/6]]"],
      ["Hisoblang: 2sin 30° + √3·tg 60° − cos 0°", ["2·[[1/2]] + √3·√3 − 1", "1 + 3 − 1 = 3"], "3"]
    ],
    qz: [
      ["[[π/5]] radian necha gradus?", ["36°", "72°", "18°", "45°"], "180/5."],
      ["cos 200° ning ishorasi?", ["manfiy", "musbat", "nol", "aniqlab bo‘lmaydi"], "200° — III chorak, cos < 0."],
      ["sin 45° · cos 45° = ?", ["[[1/2]]", "1", "√2", "[[√2/2]]"], "(√2/2)² = 1/2."]
    ]
  });
  add("2.1.2", {
    life: "Bitta trigonometrik funksiya qiymatini bilib, qolganlarini topish — DTMning klassik topshirig‘i. Hammasi Pifagor teoremasidan kelib chiqadigan bitta ayniyatga asoslangan.",
    explain: "<span class='fb'>sin²α + cos²α = 1</span><span class='fb'>tg α · ctg α = 1</span><span class='fb'>1 + tg²α = [[1/cos²α]], &nbsp; 1 + ctg²α = [[1/sin²α]]</span><p><b>Topish rejasi:</b> berilgan qiymatdan ayniyat orqali ikkinchisini topamiz, ishorani chorak bo‘yicha aniqlaymiz.</p><p><b>Misol:</b> sin α = 3/5, α — II chorakda. cos²α = 1 − 9/25 = 16/25 → cos α = −4/5 (II chorakda cos < 0). tg α = −3/4.</p><p><b>Foydali:</b> (sin α + cos α)² = 1 + 2sin α cos α.</p>",
    rule: "sin²α + cos²α = 1; 1 + tg²α = 1/cos²α. Ishorani chorak hal qiladi.",
    tip: "Ildizdan chiqarganda ± chiqadi — chorakka qarab bittasini tanlang.",
    demos: UC,
    ex: [
      ["cos α = −[[5/13]], α ∈ (π; [[3π/2]]). sin α va tg α ni toping.", ["sin²α = 1 − 25/169 = 144/169", "III chorakda sin < 0 → sin α = −[[12/13]]", "tg α = sin/cos = (−12/13)/(−5/13) = [[12/5]]"], "sin α = −[[12/13]], tg α = [[12/5]]"],
      ["sin α + cos α = [[1/2]]. sin α · cos α = ?", ["Kvadratga: 1 + 2sin α cos α = [[1/4]]", "2sin α cos α = −[[3/4]] → sin α cos α = −[[3/8]]"], "−[[3/8]]"]
    ],
    qz: [
      ["tg α = 2. ctg α = ?", ["[[1/2]]", "−2", "2", "−[[1/2]]"], "tg·ctg = 1."],
      ["sin²17° + cos²17° = ?", ["1", "0", "2", "sin 34°"], "Asosiy ayniyat."],
      ["tg α = 3/4, α — I chorak. cos α = ?", ["[[4/5]]", "[[3/5]]", "[[5/4]]", "[[3/4]]"], "1 + 9/16 = 25/16 = 1/cos²α."]
    ]
  });
  add("2.1.3", {
    life: "sin 150°, cos 225°, tg 300° kabi “katta” burchaklarni jadvaldagi kichik burchaklarga keltirish — keltirish formulalarining vazifasi. Ularni yodlash shart emas, qoidasini tushunish kifoya.",
    explain: "<p><b>Qoida (2 qadam):</b></p><ol><li><b>Funksiya nomi:</b> agar burchak π/2 yoki 3π/2 (90°, 270°) orqali yozilsa — nom almashadi (sin ↔ cos, tg ↔ ctg); π yoki 2π (180°, 360°) orqali yozilsa — nom saqlanadi.</li><li><b>Ishora:</b> α ni kichik o‘tkir burchak deb, <b>dastlabki</b> funksiyaning shu chorakdagi ishorasini qo‘yamiz.</li></ol><p><b>Misollar:</b></p><ul><li>sin(π − α) = sin α (nom saqlanadi, II chorakda sin > 0).</li><li>cos(π/2 + α) = −sin α (nom almashadi, II chorakda cos < 0).</li><li>tg(2π − α) = −tg α.</li><li>sin 150° = sin(180° − 30°) = sin 30° = 1/2.</li></ul><p><b>Davriylik:</b> sin, cos — 2π; tg, ctg — π. Juftlik: cos(−α) = cos α, sin(−α) = −sin α.</p>",
    rule: "90°/270° → nom almashadi; 180°/360° → saqlanadi. Ishora — dastlabki funksiyaning choragidagi ishorasi.",
    tip: "Ishorani YANGI funksiya bo‘yicha emas, DASTLABKI funksiya bo‘yicha aniqlang.",
    demos: UC,
    ex: [
      ["Hisoblang: cos 240°", ["240° = 180° + 60° → nom saqlanadi", "III chorakda cos < 0", "cos 240° = −cos 60° = −[[1/2]]"], "−[[1/2]]"],
      ["Soddalashtiring: sin(π + α) + cos([[π/2]] + α)", ["sin(π + α) = −sin α", "cos(π/2 + α) = −sin α", "−2sin α"], "−2sin α"]
    ],
    qz: [
      ["sin 120° = ?", ["[[√3/2]]", "−[[√3/2]]", "[[1/2]]", "−[[1/2]]"], "sin(180° − 60°) = sin 60°."],
      ["tg 135° = ?", ["−1", "1", "√3", "0"], "tg(180° − 45°) = −tg 45°."],
      ["cos(3π/2 − α) = ?", ["−sin α", "sin α", "cos α", "−cos α"], "Nom almashadi, III chorakda cos < 0."]
    ]
  });
  add("2.1.4", {
    life: "sin 75° jadvalda yo‘q, lekin 75° = 45° + 30°. Qo‘shish formulalari noma’lum burchaklarni tanish burchaklarga ajratib hisoblash imkonini beradi.",
    explain: "<span class='fb'>sin(α ± β) = sin α cos β ± cos α sin β</span><span class='fb'>cos(α ± β) = cos α cos β ∓ sin α sin β</span><span class='fb'>tg(α ± β) = [[(tg α ± tg β)/(1 ∓ tg α tg β)]]</span><p><b>Eslab qolish:</b> sin — “sin·cos + cos·sin” (ishora saqlanadi); cos — “cos·cos − sin·sin” (ishora teskari).</p><p><b>Misol:</b> sin 75° = sin(45° + 30°) = [[√2/2]]·[[√3/2]] + [[√2/2]]·[[1/2]] = [[(√6 + √2)/4]].</p><p>Formulalarni teskari tomonga ham ishlating: sin 40° cos 20° + cos 40° sin 20° = sin 60°.</p>",
    rule: "cos(α + β) = cos α cos β − sin α sin β — cos da ishora teskari!",
    tip: "sin(α + β) ≠ sin α + sin β! Masalan, sin 90° = 1, lekin sin 45° + sin 45° = √2.",
    ex: [
      ["Hisoblang: cos 15°", ["cos(45° − 30°) = cos 45° cos 30° + sin 45° sin 30°", "= [[√2/2]]·[[√3/2]] + [[√2/2]]·[[1/2]] = [[(√6 + √2)/4]]"], "[[(√6 + √2)/4]]"],
      ["Hisoblang: cos 70° cos 10° + sin 70° sin 10°", ["cos(70° − 10°) = cos 60°"], "[[1/2]]"]
    ],
    qz: [
      ["sin 50° cos 40° + cos 50° sin 40° = ?", ["1", "0", "[[1/2]]", "sin 10°"], "sin 90°."],
      ["tg α = 2, tg β = 3. tg(α + β) = ?", ["−1", "1", "5", "−5"], "(2 + 3)/(1 − 6)."],
      ["cos 80° cos 20° + sin 80° sin 20° = ?", ["[[1/2]]", "[[√3/2]]", "1", "0"], "cos 60°."]
    ]
  });
  add("2.1.5", {
    life: "Ikkilangan burchak formulalari trigonometrik tenglamalarni yechishda eng ko‘p ishlatiladi. Fizikada uloqtirilgan jismning uchish uzoqligi formulasida ham sin 2α bor.",
    explain: "<span class='fb'>sin 2α = 2 sin α cos α</span><span class='fb'>cos 2α = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α</span><span class='fb'>tg 2α = [[2tg α/(1 − tg²α)]]</span><p><b>Daraja pasaytirish</b> (cos 2α dan):</p><span class='fb'>sin²α = [[(1 − cos 2α)/2]], &nbsp; cos²α = [[(1 + cos 2α)/2]]</span><p><b>Uchlangan burchak:</b> sin 3α = 3sin α − 4sin³α, cos 3α = 4cos³α − 3cos α.</p><p><b>Misol:</b> 2sin 15° cos 15° = sin 30° = 1/2; cos² 22,5° − sin² 22,5° = cos 45° = √2/2.</p>",
    rule: "sin 2α = 2sin α cos α; cos 2α = 1 − 2sin²α = 2cos²α − 1.",
    tip: "cos 2α ning uchta shakli bor — masalada qaysi funksiya berilgan bo‘lsa, shunisini tanlang.",
    ex: [
      ["sin α = [[3/5]], α — I chorak. sin 2α va cos 2α ni toping.", ["cos α = [[4/5]]", "sin 2α = 2·[[3/5]]·[[4/5]] = [[24/25]]", "cos 2α = 1 − 2·[[9/25]] = [[7/25]]"], "[[24/25]] va [[7/25]]"],
      ["Hisoblang: 1 − 2sin²15°", ["= cos 30°"], "[[√3/2]]"]
    ],
    qz: [
      ["2sin 22,5° cos 22,5° = ?", ["[[√2/2]]", "[[1/2]]", "1", "[[√3/2]]"], "sin 45°."],
      ["cos²75° − sin²75° = ?", ["−[[√3/2]]", "[[√3/2]]", "[[1/2]]", "−[[1/2]]"], "cos 150°."],
      ["cos α = 0,6. cos 2α = ?", ["−0,28", "0,28", "1,2", "0,36"], "2·0,36 − 1."]
    ]
  });
  add("2.1.6", {
    life: "Ikki tovush to‘lqini qo‘shilganda “urilish” hodisasi yuzaga keladi — bu aynan sin α + sin β formulasi. Matematikada esa yig‘indini ko‘paytmaga aylantirish tenglamalarni yechishni osonlashtiradi.",
    explain: "<span class='fb'>sin α + sin β = 2 sin[[(α + β)/2]] cos[[(α − β)/2]]</span><span class='fb'>sin α − sin β = 2 cos[[(α + β)/2]] sin[[(α − β)/2]]</span><span class='fb'>cos α + cos β = 2 cos[[(α + β)/2]] cos[[(α − β)/2]]</span><span class='fb'>cos α − cos β = −2 sin[[(α + β)/2]] sin[[(α − β)/2]]</span><p><b>Nega kerak?</b> Yig‘indi = 0 tenglamani ko‘paytma = 0 ga aylantiramiz — har bir ko‘paytuvchini alohida nolga tenglaymiz.</p><p><b>Misol:</b> sin 75° + sin 15° = 2 sin 45° cos 30° = 2·[[√2/2]]·[[√3/2]] = [[√6/2]].</p>",
    rule: "Yig‘indi → ko‘paytma: yarim yig‘indi va yarim ayirma.",
    tip: "cos α − cos β formulasida oldida MINUS bor — eng ko‘p unutiladigan joy.",
    ex: [
      ["Hisoblang: cos 105° + cos 15°", ["2 cos 60° cos 45°", "= 2·[[1/2]]·[[√2/2]] = [[√2/2]]"], "[[√2/2]]"],
      ["Yeching: sin 3x + sin x = 0", ["2 sin 2x cos x = 0", "sin 2x = 0 → x = πn/2 (bu cos x = 0 holatini ham o‘z ichiga oladi)"], "x = [[πn/2]], n ∈ Z"]
    ],
    qz: [
      ["sin 80° − sin 20° = ?", ["cos 50°", "sin 60°", "2 sin 30°", "sin 50°"], "2cos 50° sin 30° = cos 50°."],
      ["cos 50° + cos 10° = ?", ["√3 cos 20°", "cos 60°", "2cos 30°", "cos 20°"], "2cos 30° cos 20°."],
      ["sin 40° + sin 20° = ?", ["cos 10°", "sin 60°", "2sin 60°", "sin 10°"], "2sin 30° cos 10° = cos 10°."]
    ]
  });
  add("2.1.7", {
    life: "Ko‘paytmani yig‘indiga aylantirish formulalari integrallar, to‘lqinlar va signallarni qayta ishlashda (radio, telefon aloqasi) qo‘llaniladi.",
    explain: "<span class='fb'>sin α cos β = ½[sin(α + β) + sin(α − β)]</span><span class='fb'>cos α cos β = ½[cos(α − β) + cos(α + β)]</span><span class='fb'>sin α sin β = ½[cos(α − β) − cos(α + β)]</span><p><b>Misol:</b> sin 75° cos 15° = ½(sin 90° + sin 60°) = ½(1 + [[√3/2]]) = [[(2 + √3)/4]].</p><p><b>Mashhur hiyla:</b> cos 20° cos 40° cos 80° ni hisoblash uchun ifodani sin 20° ga ko‘paytirib, ikkilangan burchak formulasini ketma-ket qo‘llaymiz: natija [[1/8]].</p>",
    rule: "sin α sin β = ½[cos(α − β) − cos(α + β)].",
    tip: "sin·sin formulasida ayirma — cos(α − β) birinchi turadi.",
    ex: [
      ["Hisoblang: 2 sin 75° sin 15°", ["= cos 60° − cos 90°", "= [[1/2]] − 0"], "[[1/2]]"],
      ["Hisoblang: cos 20° cos 40° cos 80°", ["sin 20° ga ko‘paytirib bo‘lamiz", "sin 20° cos 20° = ½ sin 40°; ½ sin 40° cos 40° = ¼ sin 80°; ¼ sin 80° cos 80° = ⅛ sin 160° = ⅛ sin 20°", "⅛ sin 20° / sin 20° = ⅛"], "[[1/8]]"]
    ],
    qz: [
      ["2 cos 45° cos 15° = ?", ["cos 30° + cos 60°", "cos 60°", "sin 60°", "1"], "cos(45° − 15°) + cos(45° + 15°)."],
      ["2 sin 45° cos 15° = ?", ["[[(√3 + 1)/2]]", "1", "[[√3/2]]", "[[1/2]]"], "sin 60° + sin 30°."],
      ["sin 15° cos 15° = ?", ["[[1/4]]", "[[1/2]]", "[[√3/4]]", "1"], "½ sin 30°."]
    ]
  });
  add("2.1.8", {
    life: "Yarim burchak formulalari sin 15°, cos 22,5° kabi qiymatlarni topishga yordam beradi. Universal almashtirish esa har qanday trigonometrik ifodani bitta tg ga keltiradi.",
    explain: "<span class='fb'>sin²[[α/2]] = [[(1 − cos α)/2]], &nbsp; cos²[[α/2]] = [[(1 + cos α)/2]]</span><span class='fb'>tg[[α/2]] = [[sin α/(1 + cos α)]] = [[(1 − cos α)/sin α]]</span><p><b>Universal almashtirish</b> (t = tg α/2):</p><span class='fb'>sin α = [[2t/(1 + t²)]], &nbsp; cos α = [[(1 − t²)/(1 + t²)]], &nbsp; tg α = [[2t/(1 − t²)]]</span><p>Ishora α/2 qaysi chorakda ekaniga qarab tanlanadi.</p><p><b>Misol:</b> cos 22,5° = √([[(1 + cos 45°)/2]]) = [[√(2 + √2)/2]].</p>",
    rule: "1 − cos α = 2sin²(α/2), 1 + cos α = 2cos²(α/2).",
    tip: "Yarim burchakning choragini aniqlang: α ∈ (π; 2π) bo‘lsa, α/2 ∈ (π/2; π).",
    ex: [
      ["cos α = [[1/9]], α ∈ (0; π). sin[[α/2]] ni toping.", ["sin²(α/2) = (1 − 1/9)/2 = [[4/9]]", "α/2 ∈ (0; π/2) → sin > 0", "sin(α/2) = [[2/3]]"], "[[2/3]]"],
      ["Soddalashtiring: [[(1 − cos 2x)/sin 2x]]", ["1 − cos 2x = 2sin²x, sin 2x = 2sin x cos x", "[[2sin²x/(2sin x cos x)]] = tg x"], "tg x"]
    ],
    qz: [
      ["[[(1 + cos 2α)/2]] = ?", ["cos²α", "sin²α", "cos 2α", "1"], "Daraja pasaytirish."],
      ["tg 15° = ?", ["2 − √3", "2 + √3", "√3 − 1", "[[√3/3]]"], "(1 − cos 30°)/sin 30° = 2 − √3."],
      ["[[sin α/(1 + cos α)]] = ?", ["tg[[α/2]]", "ctg[[α/2]]", "tg α", "sin[[α/2]]"], "Yarim burchak tangensi."]
    ]
  });
  add("2.1.9", {
    life: "Qiyalik balandligi va uzunligi ma’lum — burchakni qanday topamiz? Kalkulyatordagi sin⁻¹ tugmasi aynan arksinus. Teskari trigonometrik funksiyalar burchakni qiymatdan tiklaydi.",
    explain: "<table class='oq-t'><tr><th>Funksiya</th><th>Ta’rif</th><th>Qiymatlar oralig‘i</th></tr><tr><td>arcsin a</td><td>sin x = a</td><td>[−π/2; π/2], |a| ≤ 1</td></tr><tr><td>arccos a</td><td>cos x = a</td><td>[0; π], |a| ≤ 1</td></tr><tr><td>arctg a</td><td>tg x = a</td><td>(−π/2; π/2)</td></tr><tr><td>arcctg a</td><td>ctg x = a</td><td>(0; π)</td></tr></table><p><b>Asosiy xossalar:</b></p><ul><li>arcsin(−a) = −arcsin a, arctg(−a) = −arctg a (toq).</li><li>arccos(−a) = π − arccos a, arcctg(−a) = π − arcctg a.</li><li>arcsin a + arccos a = [[π/2]], arctg a + arcctg a = [[π/2]].</li><li>sin(arcsin a) = a, lekin arcsin(sin x) = x faqat x ∈ [−π/2; π/2] da.</li></ul>",
    rule: "arcsin ∈ [−π/2; π/2], arccos ∈ [0; π]. arccos(−a) = π − arccos a.",
    tip: "arcsin 2 mavjud emas — sinus 1 dan katta bo‘lolmaydi.",
    demos: UC,
    ex: [
      ["Hisoblang: arcsin[[1/2]] + arccos(−[[1/2]])", ["arcsin(1/2) = [[π/6]]", "arccos(−1/2) = π − [[π/3]] = [[2π/3]]", "[[π/6]] + [[2π/3]] = [[5π/6]]"], "[[5π/6]]"],
      ["Hisoblang: cos(arcsin [[3/5]])", ["α = arcsin(3/5), sin α = 3/5, α ∈ [−π/2; π/2] → cos α ≥ 0", "cos α = √(1 − 9/25) = [[4/5]]"], "[[4/5]]"]
    ],
    qz: [
      ["arctg 1 = ?", ["[[π/4]]", "[[π/2]]", "[[π/3]]", "0"], "tg(π/4) = 1."],
      ["arccos 0 = ?", ["[[π/2]]", "0", "π", "[[π/4]]"], "cos(π/2) = 0."],
      ["arcsin(−[[√3/2]]) = ?", ["−[[π/3]]", "[[4π/3]]", "[[2π/3]]", "−[[π/6]]"], "Toq funksiya: −arcsin(√3/2)."]
    ]
  });
  add("2.1.10", {
    life: "Tebranishlar, to‘lqinlar, o‘zgaruvchan tok — davriy jarayonlar trigonometrik tenglamalar bilan tasvirlanadi. DTMda bu mavzu eng ko‘p sahifani egallaydi (11 bet!).",
    explain: "<p><b>Eng oddiy tenglamalar:</b></p><span class='fb'>sin x = a (|a| ≤ 1): x = (−1)ⁿ arcsin a + πn</span><span class='fb'>cos x = a (|a| ≤ 1): x = ± arccos a + 2πn</span><span class='fb'>tg x = a: x = arctg a + πn</span><p><b>Xususiy holatlar:</b> sin x = 0 → x = πn; sin x = 1 → x = π/2 + 2πn; cos x = 0 → x = π/2 + πn; cos x = 1 → x = 2πn; cos x = −1 → x = π + 2πn.</p><p><b>Murakkab tenglamalar usullari:</b></p><ol><li><b>Kvadrat tenglamaga keltirish:</b> 2sin²x − sin x − 1 = 0 → t = sin x.</li><li><b>Ko‘paytuvchilarga ajratish:</b> sin 2x = cos x → cos x(2sin x − 1) = 0.</li><li><b>Bir jinsli:</b> a sin x + b cos x = 0 → cos x ga bo‘lib, tg x = −b/a.</li><li><b>Daraja pasaytirish, yig‘indini ko‘paytmaga aylantirish.</b></li></ol>",
    rule: "sin x = a: (−1)ⁿarcsin a + πn; cos x = a: ±arccos a + 2πn; tg x = a: arctg a + πn.",
    tip: "|a| > 1 bo‘lsa sin x = a va cos x = a yechimga ega emas. t = sin x almashtirishda |t| ≤ 1 ni tekshiring.",
    demos: [{ type: "fgraph", kind: "sin", title: "y = A sin(kx): grafik y = a chizig‘ini qayerda kesadi?" }],
    ex: [
      ["Yeching: 2cos²x + cos x − 1 = 0", ["t = cos x: 2t² + t − 1 = 0 → t = [[1/2]] yoki t = −1", "cos x = 1/2 → x = ±[[π/3]] + 2πn", "cos x = −1 → x = π + 2πn"], "x = ±[[π/3]] + 2πn; x = π + 2πn"],
      ["Yeching: sin x = √3 cos x", ["cos x ≠ 0 (aks holda sin x ham 0 bo‘lardi)", "tg x = √3", "x = [[π/3]] + πn"], "x = [[π/3]] + πn"]
    ],
    qz: [
      ["sin x = 1 → x = ?", ["[[π/2]] + 2πn", "πn", "[[π/2]] + πn", "2πn"], "Xususiy holat."],
      ["cos 2x = 0 → x = ?", ["[[π/4]] + [[πn/2]]", "[[π/2]] + πn", "[[π/4]] + πn", "πn"], "2x = π/2 + πn."],
      ["sin x = 2 ning nechta yechimi bor?", ["0", "1", "2", "cheksiz"], "|2| > 1."]
    ]
  });
  add("2.1.11", {
    life: "Trigonometrik tengsizliklar — birlik aylanada yoy tanlash san’ati. “Qaysi burchaklarda sinus 1/2 dan katta?” degan savolga rasm chizib javob beriladi.",
    explain: "<p><b>Birlik aylana usuli:</b></p><ol><li>sin x > a uchun y = a gorizontal chiziq, cos x > a uchun x = a vertikal chiziq chizamiz.</li><li>Aylana bilan kesishish nuqtalarini topamiz.</li><li>Shartni qanoatlantiruvchi yoyni belgilaymiz (soat strelkasiga teskari yo‘nalishda o‘qiymiz).</li><li>Davrni qo‘shamiz: sin, cos uchun +2πn, tg uchun +πn.</li></ol><p><b>Namunalar:</b></p><ul><li>sin x > [[1/2]]: [[π/6]] + 2πn < x < [[5π/6]] + 2πn.</li><li>cos x ≤ [[1/2]]: [[π/3]] + 2πn ≤ x ≤ [[5π/3]] + 2πn.</li><li>tg x < 1: −[[π/2]] + πn < x < [[π/4]] + πn.</li></ul>",
    rule: "Birlik aylanada yoyni belgilab, chapdan o‘ngga (soat strelkasiga teskari) yozing va davr qo‘shing.",
    tip: "Yoy chegaralarini yozganda chap chegara o‘ngdagisidan kichik bo‘lishi kerak: −π/3 < x < π/3, emas π/3 < x < −π/3.",
    demos: UC,
    ex: [
      ["Yeching: cos x > [[√2/2]]", ["cos x = √2/2 nuqtalari: ±π/4", "x o‘qida √2/2 dan o‘ngdagi yoy: −π/4 dan π/4 gacha"], "−[[π/4]] + 2πn < x < [[π/4]] + 2πn"],
      ["Yeching: sin x ≤ 0", ["sin x — y koordinata, y ≤ 0 — pastki yarim aylana", "π dan 2π gacha"], "π + 2πn ≤ x ≤ 2π + 2πn"]
    ],
    qz: [
      ["sin x > 0 → ?", ["2πn < x < π + 2πn", "−π/2 + 2πn < x < π/2 + 2πn", "πn < x < π/2 + πn", "barcha x"], "Yuqori yarim aylana."],
      ["tg x > 0 → ?", ["πn < x < [[π/2]] + πn", "0 < x < π", "2πn < x < π + 2πn", "x > 0"], "I va III choraklar, davr π."],
      ["cos x > 2 → ?", ["yechim yo‘q", "barcha x", "x > 2", "x = 0"], "cos x ≤ 1."]
    ]
  });
  add("2.1.12", {
    life: "Aralash bo‘lim — trigonometriyaning barcha formulalarini birga qo‘llash. Haqiqiy test savollari aynan shunday: bitta masalada keltirish, qo‘shish va ikkilangan burchak formulalari birga uchraydi.",
    explain: "<p><b>Strategiya:</b></p><ol><li>Burchaklarni soddalashtiring (keltirish formulalari, davriylik).</li><li>Turli burchaklarni bitta burchakka keltiring (ikkilangan, yarim burchak).</li><li>Turli funksiyalarni bitta funksiyaga keltiring (asosiy ayniyatlar).</li><li>Yig‘indi/ko‘paytma formulalari bilan soddalashtiring.</li></ol><p><b>Eng kichik va eng katta qiymat:</b></p><span class='fb'>a sin x + b cos x ∈ [−√(a² + b²); √(a² + b²)]</span><p>Masalan, 3sin x + 4cos x ning eng katta qiymati √(9 + 16) = 5.</p><p><b>sin x + cos x = √2 sin(x + π/4)</b> → qiymatlari [−√2; √2].</p>",
    rule: "a sin x + b cos x ning eng katta qiymati √(a² + b²), eng kichigi −√(a² + b²).",
    tip: "sin x va cos x bir vaqtda 1 ga teng bo‘lolmaydi, shuning uchun sin x + cos x ≤ √2 (2 emas).",
    ex: [
      ["y = 5sin x − 12cos x ning eng katta qiymati?", ["√(25 + 144) = √169 = 13"], "13"],
      ["Hisoblang: [[(sin 2α)/(1 + cos 2α)]] · ctg α", ["sin 2α = 2sin α cos α, 1 + cos 2α = 2cos²α", "[[2sin α cos α/(2cos²α)]] = tg α", "tg α · ctg α = 1"], "1"]
    ],
    qz: [
      ["y = sin x cos x ning eng katta qiymati?", ["[[1/2]]", "1", "2", "[[√2/2]]"], "½ sin 2x ≤ ½."],
      ["y = 2 − 3cos x ning qiymatlar sohasi?", ["[−1; 5]", "[−1; 2]", "[2; 5]", "[−3; 3]"], "cos x ∈ [−1; 1]."],
      ["sin⁴α − cos⁴α = ?", ["−cos 2α", "cos 2α", "1", "sin 2α"], "(sin²α − cos²α)(sin²α + cos²α)."]
    ]
  });
  add("2.1.13", {
    life: "Yurak urishi, okean to‘lqinlari, kun uzunligining yil davomida o‘zgarishi — sinusoida shaklida. Trigonometrik funksiyalar grafigi davriy jarayonlarning tasviri.",
    explain: "<table class='oq-t'><tr><th></th><th>sin x</th><th>cos x</th><th>tg x</th><th>ctg x</th></tr><tr><td>D(f)</td><td>R</td><td>R</td><td>x ≠ π/2 + πn</td><td>x ≠ πn</td></tr><tr><td>E(f)</td><td>[−1; 1]</td><td>[−1; 1]</td><td>R</td><td>R</td></tr><tr><td>Davr</td><td>2π</td><td>2π</td><td>π</td><td>π</td></tr><tr><td>Juftlik</td><td>toq</td><td>juft</td><td>toq</td><td>toq</td></tr></table><p><b>y = A sin(kx + b) + c uchun:</b> amplituda |A|; davr T = [[2π/|k|]]; qiymatlar sohasi [c − |A|; c + |A|].</p><p>tg(kx) ning davri [[π/|k|]].</p><p><b>Ikki davriy funksiya yig‘indisining davri</b> — davrlarning EKUKi: sin 2x + cos 3x → davrlar π va 2π/3 → umumiy davr 2π.</p>",
    rule: "y = A sin(kx + b) davri 2π/|k|, qiymatlar sohasi [−|A|; |A|].",
    tip: "y = sin²x ning davri 2π emas, π (chunki sin²x = (1 − cos 2x)/2).",
    demos: [{ type: "fgraph", kind: "sin" }],
    ex: [
      ["y = 3sin(2x − 1) + 1 ning davri va qiymatlar sohasi?", ["T = 2π/2 = π", "E = [1 − 3; 1 + 3] = [−2; 4]"], "T = π, E = [−2; 4]"],
      ["y = tg[[x/3]] ning eng kichik musbat davri?", ["T = π/(1/3) = 3π"], "3π"]
    ],
    qz: [
      ["y = cos 4x ning davri?", ["[[π/2]]", "4π", "π", "[[π/4]]"], "2π/4."],
      ["Qaysi funksiya juft?", ["y = cos x", "y = sin x", "y = tg x", "y = sin x + 1"], "cos(−x) = cos x."],
      ["y = 2sin x − 1 ning eng kichik qiymati?", ["−3", "−1", "−2", "1"], "2·(−1) − 1."]
    ]
  });

  // ===== 2.2 Hosila =====
  add("2.2.1", {
    life: "Spidometr ko‘rsatkichi — yo‘lning vaqt bo‘yicha hosilasi. Hosila har qanday jarayonning “o‘zgarish tezligi”ni o‘lchaydi: narx o‘sish tezligi, haroratning sovish tezligi.",
    explain: "<p><b>Hosila</b> f′(x) — funksiya o‘zgarishining argument o‘zgarishiga nisbatining limiti: f′(x) = lim [[Δf/Δx]] (Δx → 0).</p><p><b>Asosiy jadval:</b></p><table class='oq-t'><tr><th>f(x)</th><th>f′(x)</th><th>f(x)</th><th>f′(x)</th></tr><tr><td>C (son)</td><td>0</td><td>sin x</td><td>cos x</td></tr><tr><td>xⁿ</td><td>n·xⁿ⁻¹</td><td>cos x</td><td>−sin x</td></tr><tr><td>√x</td><td>[[1/(2√x)]]</td><td>tg x</td><td>[[1/cos²x]]</td></tr><tr><td>[[1/x]]</td><td>−[[1/x²]]</td><td>eˣ</td><td>eˣ</td></tr><tr><td>aˣ</td><td>aˣ ln a</td><td>ln x</td><td>[[1/x]]</td></tr></table><p><b>Yig‘indi va ayirma:</b> (f ± g)′ = f′ ± g′; (C·f)′ = C·f′.</p><p><b>Misol:</b> (3x⁴ − 2x² + 5x − 7)′ = 12x³ − 4x + 5.</p>",
    rule: "(xⁿ)′ = nxⁿ⁻¹; (C)′ = 0; (f + g)′ = f′ + g′.",
    tip: "(5)′ = 0, lekin (5x)′ = 5. O‘zgarmas sonning hosilasi doim nol.",
    demos: [{ type: "tangent" }],
    ex: [
      ["f(x) = x³ − 4x² + 2x − 1. f′(2) = ?", ["f′(x) = 3x² − 8x + 2", "f′(2) = 12 − 16 + 2 = −2"], "−2"],
      ["f(x) = 2√x + [[3/x]]. f′(x) = ?", ["(2√x)′ = 2·[[1/(2√x)]] = [[1/√x]]", "(3/x)′ = −[[3/x²]]"], "[[1/√x]] − [[3/x²]]"]
    ],
    qz: [
      ["(x⁵)′ = ?", ["5x⁴", "x⁴", "5x⁵", "4x⁵"], "nxⁿ⁻¹."],
      ["f(x) = 3x² − 5x. f′(1) = ?", ["1", "−2", "6", "11"], "6x − 5 → 1."],
      ["(sin x + cos x)′ = ?", ["cos x − sin x", "cos x + sin x", "−cos x − sin x", "sin x − cos x"], "(sin)′ = cos, (cos)′ = −sin."]
    ]
  });
  add("2.2.2", {
    life: "Daromad = narx × miqdor. Ikkalasi ham o‘zgarsa, daromad qanday tezlikda o‘zgaradi? Ko‘paytmaning hosilasi formulasi aynan shu savolga javob beradi.",
    explain: "<span class='fb'>(u · v)′ = u′v + uv′</span><p>“Birinchisining hosilasi × ikkinchisi + birinchisi × ikkinchisining hosilasi”.</p><p><b>Misol:</b> (x² sin x)′ = 2x sin x + x² cos x.</p><p>Uchta ko‘paytuvchi: (uvw)′ = u′vw + uv′w + uvw′.</p><p><b>Maslahat:</b> agar ko‘paytmani qavslarni ochib ko‘phadga aylantirish oson bo‘lsa, shunday qiling: (x + 1)(x − 2) = x² − x − 2 → hosila 2x − 1.</p>",
    rule: "(uv)′ = u′v + uv′ — ko‘paytmaning hosilasi hosilalar ko‘paytmasiga TENG EMAS.",
    tip: "(x · sin x)′ ≠ 1 · cos x! To‘g‘risi: sin x + x cos x.",
    ex: [
      ["f(x) = (2x + 1)(x² − 3). f′(x) = ?", ["u′v + uv′ = 2(x² − 3) + (2x + 1)·2x", "= 2x² − 6 + 4x² + 2x = 6x² + 2x − 6"], "6x² + 2x − 6"],
      ["f(x) = x·eˣ. f′(0) = ?", ["f′(x) = eˣ + x·eˣ", "f′(0) = 1 + 0 = 1"], "1"]
    ],
    qz: [
      ["(x · cos x)′ = ?", ["cos x − x sin x", "−sin x", "cos x + x sin x", "−x sin x"], "u′v + uv′."],
      ["f(x) = x²(x − 1). f′(1) = ?", ["1", "0", "2", "3"], "f = x³ − x², f′ = 3x² − 2x → 1."],
      ["(√x · x)′ = ?", ["[[3√x/2]]", "[[1/(2√x)]]", "√x", "[[3x/2]]"], "x^(3/2) → (3/2)x^(1/2)."]
    ]
  });
  add("2.2.3", {
    life: "O‘rtacha xarajat = umumiy xarajat / mahsulot soni. Uning o‘zgarish tezligini topish uchun bo‘linmaning hosilasi kerak.",
    explain: "<span class='fb'>([[u/v]])′ = [[(u′v − uv′)/v²]]</span><p>Suratda tartib muhim: “surat hosilasi × maxraj − surat × maxraj hosilasi”, maxrajda maxrajning kvadrati.</p><p><b>Misol:</b> ([[x/(x + 1)]])′ = [[(1·(x + 1) − x·1)/(x + 1)²]] = [[1/(x + 1)²]].</p><p>tg x ning hosilasi ham shu formuladan: ([[sin x/cos x]])′ = [[(cos²x + sin²x)/cos²x]] = [[1/cos²x]].</p>",
    rule: "(u/v)′ = (u′v − uv′)/v². Suratda MINUS va tartib muhim.",
    tip: "u′v va uv′ o‘rnini almashtirsangiz, javob ishorasi teskari bo‘lib qoladi.",
    ex: [
      ["f(x) = [[(2x − 1)/(x + 3)]]. f′(x) = ?", ["u = 2x − 1, v = x + 3", "[[(2(x + 3) − (2x − 1)·1)/(x + 3)²]] = [[7/(x + 3)²]]"], "[[7/(x + 3)²]]"],
      ["f(x) = [[x²/(x − 1)]]. f′(2) = ?", ["f′ = [[(2x(x − 1) − x²)/(x − 1)²]] = [[(x² − 2x)/(x − 1)²]]", "f′(2) = 0/1 = 0"], "0"]
    ],
    qz: [
      ["([[1/x]])′ = ?", ["−[[1/x²]]", "[[1/x²]]", "ln x", "−[[1/x]]"], "(0·x − 1·1)/x²."],
      ["([[x/(x − 2)]])′ = ?", ["−[[2/(x − 2)²]]", "[[2/(x − 2)²]]", "[[1/(x − 2)²]]", "[[x/(x − 2)²]]"], "(x − 2 − x)/(x − 2)²."],
      ["(tg x)′ = ?", ["[[1/cos²x]]", "−[[1/sin²x]]", "ctg x", "[[1/sin²x]]"], "Jadval formulasi."]
    ]
  });
  add("2.2.4", {
    life: "sin(3x²) — bu “funksiya ichida funksiya”. Hayotda ham shunday: benzin narxi neft narxiga, neft narxi dollar kursiga bog‘liq. Murakkab funksiyaning hosilasi — “zanjir qoidasi”.",
    explain: "<span class='fb'>(f(g(x)))′ = f′(g(x)) · g′(x)</span><p>Tashqi funksiyaning hosilasi (ichki ifoda o‘zgarmasdan) × ichki funksiyaning hosilasi.</p><p><b>Misollar:</b></p><ul><li>((2x + 1)⁵)′ = 5(2x + 1)⁴ · 2 = 10(2x + 1)⁴</li><li>(sin 3x)′ = cos 3x · 3 = 3cos 3x</li><li>(√(x² + 1))′ = [[1/(2√(x² + 1))]] · 2x = [[x/√(x² + 1)]]</li><li>(e^(−2x))′ = −2e^(−2x)</li><li>(ln(x² + 4))′ = [[2x/(x² + 4)]]</li></ul>",
    rule: "(f(g(x)))′ = f′(g(x))·g′(x). (f(kx + b))′ = k·f′(kx + b).",
    tip: "Ichki funksiyaning hosilasiga ko‘paytirishni unutish — eng keng tarqalgan xato: (sin 2x)′ = 2cos 2x, cos 2x emas.",
    ex: [
      ["f(x) = (3x − 2)⁴. f′(1) = ?", ["f′(x) = 4(3x − 2)³ · 3 = 12(3x − 2)³", "f′(1) = 12 · 1 = 12"], "12"],
      ["f(x) = cos²x. f′(x) = ?", ["Tashqi: u², ichki: cos x", "2cos x · (−sin x) = −sin 2x"], "−sin 2x"]
    ],
    qz: [
      ["(sin 5x)′ = ?", ["5cos 5x", "cos 5x", "−5cos 5x", "5sin 5x"], "Ichki hosila 5."],
      ["((x² + 1)³)′ = ?", ["6x(x² + 1)²", "3(x² + 1)²", "3x(x² + 1)²", "6x³"], "3(x² + 1)²·2x."],
      ["(√(4x + 1))′ x = 2 da?", ["[[2/3]]", "[[1/3]]", "2", "[[1/6]]"], "4/(2√9) = 4/6."]
    ]
  });
  add("2.2.5", {
    life: "Grafikni chizmasdan funksiya qayerda o‘sishini va qayerda kamayishini bilish mumkin — hosilaning ishorasiga qarash kifoya. Iqtisodda bu “qachon foyda o‘sadi?” degan savolga javob.",
    explain: "<p><b>Asosiy teorema:</b></p><ul><li>Oraliqda f′(x) > 0 bo‘lsa, f <b>o‘suvchi</b>.</li><li>Oraliqda f′(x) < 0 bo‘lsa, f <b>kamayuvchi</b>.</li></ul><p><b>Topish rejasi:</b></p><ol><li>Aniqlanish sohasini toping.</li><li>f′(x) ni hisoblang.</li><li>f′(x) = 0 yoki mavjud bo‘lmagan nuqtalarni (kritik nuqtalar) toping.</li><li>Oraliqlar usuli bilan f′ ishorasini aniqlang.</li></ol><p><b>Misol:</b> f(x) = x³ − 3x → f′ = 3x² − 3 = 3(x − 1)(x + 1). Ishoralar: + | − | + → o‘sadi (−∞; −1] va [1; +∞), kamayadi [−1; 1].</p>",
    rule: "f′ > 0 → o‘sadi ↗; f′ < 0 → kamayadi ↘.",
    tip: "Kritik nuqtalarni aniqlanish sohasidan tashqarida qidirmang.",
    demos: [{ type: "tangent", fn: "x³ − 3x", title: "Urinma qiyaligi (hosila) ishorasini kuzating" }],
    ex: [
      ["f(x) = x² − 6x + 5 ning kamayish oralig‘i?", ["f′(x) = 2x − 6", "2x − 6 < 0 → x < 3"], "(−∞; 3]"],
      ["f(x) = 2x³ − 6x² + 1 ning o‘sish oraliqlari?", ["f′ = 6x² − 12x = 6x(x − 2)", "Ishoralar: + | − | +", "x ≤ 0 va x ≥ 2"], "(−∞; 0] va [2; +∞)"]
    ],
    qz: [
      ["f(x) = −x² + 4x ning o‘sish oralig‘i?", ["(−∞; 2]", "[2; +∞)", "(−∞; 4]", "[0; 4]"], "f′ = −2x + 4 ≥ 0."],
      ["f(x) = x³ funksiya qanday?", ["butun o‘qda o‘suvchi", "kamayuvchi", "x < 0 da kamayuvchi", "o‘zgarmas"], "f′ = 3x² ≥ 0."],
      ["f′(x) = (x − 1)(x − 5). f qayerda kamayadi?", ["[1; 5]", "(−∞; 1]", "[5; +∞)", "(−∞; 5]"], "Ildizlar orasida f′ < 0."]
    ]
  });
  add("2.2.6", {
    life: "Tog‘ cho‘qqisi va vodiy tubi — grafikdagi maksimum va minimum nuqtalar. Ular optimallashtirish masalalarining kalitidir: eng kam xarajat, eng ko‘p foyda.",
    explain: "<p><b>Ekstremum nuqtalar:</b></p><ul><li><b>Maksimum</b> — f′ ishorasi “+” dan “−” ga o‘zgaradigan nuqta.</li><li><b>Minimum</b> — f′ ishorasi “−” dan “+” ga o‘zgaradigan nuqta.</li><li>Ishora o‘zgarmasa — ekstremum yo‘q (masalan, y = x³ da x = 0).</li></ul><p><b>Zaruriy shart:</b> ekstremum nuqtada f′(x₀) = 0 yoki mavjud emas (kritik nuqta). Lekin har bir kritik nuqta ekstremum emas!</p><p><b>Misol:</b> f(x) = x³ − 3x: f′ = 3(x − 1)(x + 1). x = −1: “+” → “−” → maksimum, f(−1) = 2. x = 1: “−” → “+” → minimum, f(1) = −2.</p><p>x_max — maksimum <b>nuqtasi</b>, y_max = f(x_max) — maksimum <b>qiymati</b>. Savolda nimani so‘rashganiga diqqat!</p>",
    rule: "f′: + → − — maksimum; − → + — minimum.",
    tip: "“Maksimum nuqtasi” (x) va “maksimum qiymati” (y) — farqli narsalar.",
    demos: [{ type: "tangent", fn: "x³ − 3x", title: "x₀ = −1 va x₀ = 1 da urinma gorizontal" }],
    ex: [
      ["f(x) = x³ − 12x + 3 ning ekstremum nuqtalari?", ["f′ = 3x² − 12 = 3(x − 2)(x + 2)", "x = −2: + → − → maksimum, f(−2) = −8 + 24 + 3 = 19", "x = 2: − → + → minimum, f(2) = 8 − 24 + 3 = −13"], "x_max = −2, x_min = 2"],
      ["f(x) = x⁴ − 2x² ning minimum qiymati?", ["f′ = 4x³ − 4x = 4x(x − 1)(x + 1)", "Minimumlar x = ±1 da: f(±1) = 1 − 2 = −1"], "−1"]
    ],
    qz: [
      ["f(x) = x² − 4x + 7 ning minimum nuqtasi?", ["2", "3", "−2", "7"], "f′ = 2x − 4 = 0."],
      ["f(x) = −x² + 6x ning maksimum qiymati?", ["9", "3", "6", "0"], "x = 3, f = 9."],
      ["f(x) = x³ ning ekstremumlari soni?", ["0", "1", "2", "3"], "f′ = 3x² ishorasini o‘zgartirmaydi."]
    ]
  });
  add("2.2.7", {
    life: "Berilgan oraliqda eng katta va eng kichik qiymat — amaliy optimallashtirish: “10 m simdan qanday eng katta maydonni o‘rash mumkin?”, “Qaysi narxda foyda eng katta?”",
    explain: "<p><b>[a; b] kesmada eng katta va eng kichik qiymatni topish:</b></p><ol><li>f′(x) ni toping.</li><li>Kesma ichidagi kritik nuqtalarni toping (f′ = 0).</li><li>f ning qiymatlarini kritik nuqtalarda va <b>kesma uchlarida</b> (a va b) hisoblang.</li><li>Ular ichidan eng kattasi — max, eng kichigi — min.</li></ol><p>Uchlarni tekshirishni unutmang — eng katta qiymat ko‘pincha aynan chegara nuqtada bo‘ladi!</p><p><b>Misol:</b> f(x) = x³ − 3x, [0; 2]. Kritik: x = 1 (x = −1 kesmada emas). f(0) = 0, f(1) = −2, f(2) = 2 → max = 2, min = −2.</p>",
    rule: "Kesma uchlari + kesma ichidagi kritik nuqtalar → qiymatlarni solishtiring.",
    tip: "Kesmadan tashqaridagi kritik nuqtalarni hisobga olmang.",
    ex: [
      ["f(x) = x² − 4x + 1 ning [0; 5] dagi eng katta va eng kichik qiymati?", ["f′ = 2x − 4 = 0 → x = 2 ∈ [0; 5]", "f(0) = 1, f(2) = −3, f(5) = 6"], "max = 6, min = −3"],
      ["Yig‘indisi 20 bo‘lgan ikki musbat son kvadratlari yig‘indisining eng kichik qiymati?", ["x² + (20 − x)², x ∈ (0; 20)", "Hosila: 2x − 2(20 − x) = 4x − 40 = 0 → x = 10", "100 + 100 = 200"], "200"]
    ],
    qz: [
      ["f(x) = 3x − x³ ning [0; 2] dagi eng katta qiymati?", ["2", "0", "−2", "4"], "f′ = 3 − 3x² = 0 → x = 1, f(1) = 2; f(2) = −2."],
      ["f(x) = x² ning [−1; 3] dagi eng kichik qiymati?", ["0", "1", "9", "−1"], "x = 0 da."],
      ["f(x) = 2x + 1 ning [1; 4] dagi eng katta qiymati?", ["9", "3", "4", "8"], "O‘suvchi, x = 4 da."]
    ]
  });
  add("2.2.8", {
    life: "Yo‘l qiyaligi, avtomobil burilishidagi yo‘nalish — urinma chiziq egri chiziqning shu nuqtadagi “yo‘nalishi”. Uning burchak koeffitsienti — hosila.",
    explain: "<p><b>Hosilaning geometrik ma’nosi:</b></p><span class='fb'>k = f′(x₀) = tg α</span><p>bu yerda α — urinmaning Ox o‘qining musbat yo‘nalishi bilan hosil qilgan burchagi.</p><ul><li>f′(x₀) > 0 — urinma “yuqoriga”, o‘tkir burchak;</li><li>f′(x₀) < 0 — “pastga”, o‘tmas burchak;</li><li>f′(x₀) = 0 — urinma gorizontal (Ox ga parallel).</li></ul><p><b>Tipik savol:</b> “Grafikning qaysi nuqtasida urinma y = 3x + 1 ga parallel?” → f′(x₀) = 3 tenglamani yechamiz.</p>",
    rule: "Urinma burchak koeffitsienti k = f′(x₀) = tg α.",
    tip: "Urinma Ox bilan 45° hosil qilsa, f′(x₀) = 1; 135° bo‘lsa, f′(x₀) = −1.",
    demos: [{ type: "tangent" }],
    ex: [
      ["f(x) = x³ grafigiga x₀ = 1 da o‘tkazilgan urinma Ox bilan qanday burchak hosil qiladi?", ["f′(x) = 3x², f′(1) = 3", "tg α = 3 → α = arctg 3"], "arctg 3"],
      ["y = x² − 3x grafigining qaysi nuqtasida urinma Ox ga parallel?", ["f′(x) = 2x − 3 = 0 → x = 1,5", "y = 2,25 − 4,5 = −2,25"], "(1,5; −2,25)"]
    ],
    qz: [
      ["y = x² ga x₀ = 2 dagi urinmaning burchak koeffitsienti?", ["4", "2", "8", "1"], "f′ = 2x → 4."],
      ["f′(x₀) = −1 bo‘lsa, urinma Ox bilan qanday burchak hosil qiladi?", ["135°", "45°", "90°", "−45°"], "tg α = −1."],
      ["y = x³ − 3x grafigida urinma gorizontal bo‘lgan nuqtalar soni?", ["2", "1", "0", "3"], "3x² − 3 = 0 → x = ±1."]
    ]
  });
  add("2.2.9", {
    life: "Egri chiziqni nuqta atrofida to‘g‘ri chiziq bilan almashtirish — taxminiy hisoblashlarning asosi. GPS navigatorlar ham yo‘lni kichik to‘g‘ri bo‘laklar bilan hisoblaydi.",
    explain: "<span class='fb'>y = f(x₀) + f′(x₀)(x − x₀)</span><p><b>Tuzish rejasi:</b></p><ol><li>f(x₀) ni hisoblang.</li><li>f′(x) ni toping va f′(x₀) ni hisoblang.</li><li>Formulaga qo‘yib, y = kx + b ko‘rinishiga keltiring.</li></ol><p><b>Misol:</b> f(x) = x² − 2x, x₀ = 3. f(3) = 3, f′(x) = 2x − 2, f′(3) = 4. Urinma: y = 3 + 4(x − 3) = 4x − 9.</p><p><b>Normal</b> (urinmaga perpendikulyar) chiziqning koeffitsienti: −[[1/f′(x₀)]].</p>",
    rule: "Urinma: y = f(x₀) + f′(x₀)(x − x₀).",
    tip: "Formulada f(x₀) — funksiya qiymati, f′(x₀) — hosila qiymati; ularni adashtirmang.",
    demos: [{ type: "tangent" }],
    ex: [
      ["y = x³ − 2x ga x₀ = 1 nuqtada urinma tenglamasi?", ["f(1) = −1", "f′(x) = 3x² − 2, f′(1) = 1", "y = −1 + 1·(x − 1) = x − 2"], "y = x − 2"],
      ["y = [[1/x]] ga x₀ = 2 dagi urinma Oy ni qayerda kesadi?", ["f(2) = 1/2, f′(x) = −1/x², f′(2) = −1/4", "y = 1/2 − (x − 2)/4 = −x/4 + 1", "x = 0 → y = 1"], "(0; 1)"]
    ],
    qz: [
      ["y = x² ga x₀ = 1 da urinma?", ["y = 2x − 1", "y = 2x + 1", "y = x", "y = 2x"], "y = 1 + 2(x − 1)."],
      ["y = 3x − 5 to‘g‘ri chiziqning o‘ziga urinmasi?", ["y = 3x − 5", "y = 3x", "y = −5", "mavjud emas"], "To‘g‘ri chiziqning urinmasi — o‘zi."],
      ["y = eˣ ga x₀ = 0 da urinma?", ["y = x + 1", "y = x", "y = eˣ", "y = 1"], "f(0) = 1, f′(0) = 1."]
    ]
  });
  add("2.2.10", {
    life: "Yo‘lning vaqt bo‘yicha hosilasi — tezlik, tezlikning hosilasi — tezlanish. Fizikada harakat qonuni berilsa, istalgan paytdagi tezlikni hosila orqali topamiz.",
    explain: "<p>Agar moddiy nuqta S(t) qonun bo‘yicha harakatlansa:</p><span class='fb'>v(t) = S′(t), &nbsp; a(t) = v′(t) = S″(t)</span><p><b>Misol:</b> S(t) = t³ − 2t² + 3t (m). v(t) = 3t² − 4t + 3; a(t) = 6t − 4. t = 2 s da: v = 12 − 8 + 3 = 7 m/s, a = 8 m/s².</p><p><b>Tipik savollar:</b></p><ul><li>“Qaysi paytda to‘xtaydi?” → v(t) = 0.</li><li>“Qaysi paytda tezlanish nolga teng?” → a(t) = 0.</li><li>“Tezlik qachon 10 m/s?” → v(t) = 10.</li></ul><p>Umumiy ma’no: f′(x) — f ning x ga nisbatan <b>o‘zgarish tezligi</b>.</p>",
    rule: "Tezlik = yo‘lning hosilasi; tezlanish = tezlikning hosilasi.",
    tip: "Vaqt manfiy bo‘lmaydi — t < 0 chiqqan ildizlarni tashlang.",
    ex: [
      ["S(t) = 2t³ − 3t² + 4 (m). t = 3 s dagi tezlik va tezlanish?", ["v = 6t² − 6t → v(3) = 54 − 18 = 36 m/s", "a = 12t − 6 → a(3) = 30 m/s²"], "36 m/s, 30 m/s²"],
      ["S(t) = t² − 8t + 1. Jism qachon to‘xtaydi?", ["v(t) = 2t − 8 = 0", "t = 4 s"], "4 s da"]
    ],
    qz: [
      ["S(t) = 5t² (m). t = 2 s da tezlik?", ["20 m/s", "10 m/s", "40 m/s", "5 m/s"], "v = 10t."],
      ["v(t) = 3t² + 2t. Tezlanish t = 1 da?", ["8", "5", "6", "2"], "a = 6t + 2."],
      ["S(t) = t³ − 3t. Tezlik nolga teng bo‘ladigan musbat t?", ["1", "3", "√3", "0"], "3t² − 3 = 0."]
    ]
  });
  add("2.2.11", {
    life: "Tezlik ma’lum bo‘lsa, bosib o‘tilgan yo‘lni qanday topamiz? Bu hosilaga teskari amal — boshlang‘ich funksiya (integral).",
    explain: "<p>F(x) — f(x) ning <b>boshlang‘ich funksiyasi</b>, agar F′(x) = f(x) bo‘lsa.</p><p>Har bir funksiyaning cheksiz ko‘p boshlang‘ichi bor: F(x) + C (C — istalgan son). Bularning to‘plami — <b>aniqmas integral</b>:</p><span class='fb'>∫ f(x) dx = F(x) + C</span><p><b>Misol:</b> f(x) = 2x uchun F(x) = x² + C, chunki (x² + C)′ = 2x.</p><p><b>Tekshirish:</b> topilgan javobning hosilasini oling — dastlabki funksiya chiqishi kerak.</p><p><b>Shartli masala:</b> “grafigi (1; 5) dan o‘tuvchi boshlang‘ich” → F(1) = 5 dan C ni topamiz.</p>",
    rule: "F′(x) = f(x). Umumiy ko‘rinish: F(x) + C.",
    tip: "+C ni unutmang — u nuqtadan o‘tish sharti bilan aniqlanadi.",
    demos: [{ type: "integral" }],
    ex: [
      ["f(x) = 3x² ning (1; 4) nuqtadan o‘tuvchi boshlang‘ich funksiyasini toping.", ["F(x) = x³ + C", "F(1) = 1 + C = 4 → C = 3"], "F(x) = x³ + 3"],
      ["F(x) = sin x + x² funksiya qaysi funksiyaning boshlang‘ichi?", ["F′(x) = cos x + 2x"], "f(x) = cos x + 2x"]
    ],
    qz: [
      ["f(x) = 4x³ ning boshlang‘ichi?", ["x⁴ + C", "12x² + C", "4x⁴ + C", "x³ + C"], "(x⁴)′ = 4x³."],
      ["f(x) = cos x ning boshlang‘ichi?", ["sin x + C", "−sin x + C", "cos x + C", "−cos x + C"], "(sin x)′ = cos x."],
      ["F(x) = x² + C, F(0) = 3. F(2) = ?", ["7", "4", "3", "5"], "C = 3, F(2) = 4 + 3."]
    ]
  });
  add("2.2.12", {
    life: "Boshlang‘ich funksiyalar jadvali — hosilalar jadvalining teskarisi. Uni bilish aniq integral va yuzalarni hisoblashning birinchi qadami.",
    explain: "<table class='oq-t'><tr><th>f(x)</th><th>F(x)</th><th>f(x)</th><th>F(x)</th></tr><tr><td>k (son)</td><td>kx</td><td>sin x</td><td>−cos x</td></tr><tr><td>xⁿ (n ≠ −1)</td><td>[[xⁿ⁺¹/(n + 1)]]</td><td>cos x</td><td>sin x</td></tr><tr><td>[[1/x]]</td><td>ln|x|</td><td>[[1/cos²x]]</td><td>tg x</td></tr><tr><td>eˣ</td><td>eˣ</td><td>[[1/sin²x]]</td><td>−ctg x</td></tr><tr><td>[[1/√x]]</td><td>2√x</td><td>aˣ</td><td>[[aˣ/ln a]]</td></tr></table><p><b>Qoidalar:</b></p><ul><li>∫(f ± g) = ∫f ± ∫g; ∫k·f = k∫f.</li><li>∫f(kx + b)dx = [[1/k]]·F(kx + b) + C. Masalan, ∫cos 3x dx = [[1/3]]sin 3x + C; ∫(2x + 1)³dx = [[(2x + 1)⁴/8]] + C.</li></ul>",
    rule: "∫xⁿdx = xⁿ⁺¹/(n + 1) + C; ∫f(kx + b)dx = (1/k)F(kx + b) + C.",
    tip: "∫ sin x dx = −cos x (minus bilan!), chunki (cos x)′ = −sin x.",
    ex: [
      ["∫(6x² − 4x + 5)dx = ?", ["6·x³/3 − 4·x²/2 + 5x", "= 2x³ − 2x² + 5x + C"], "2x³ − 2x² + 5x + C"],
      ["∫ sin 2x dx = ?", ["k = 2 → [[1/2]]·(−cos 2x)"], "−[[1/2]]cos 2x + C"]
    ],
    qz: [
      ["∫x⁴dx = ?", ["[[x⁵/5]] + C", "4x³ + C", "x⁵ + C", "[[x⁴/4]] + C"], "n = 4."],
      ["∫ e^(3x) dx = ?", ["[[1/3]]e^(3x) + C", "3e^(3x) + C", "e^(3x) + C", "e^(3x)/x + C"], "k = 3."],
      ["∫[[1/√x]]dx = ?", ["2√x + C", "√x + C", "[[1/(2√x)]] + C", "ln x + C"], "Jadvaldan."]
    ]
  });
  add("2.2.13", {
    life: "Aniq integral — cheksiz ko‘p kichik bo‘laklarni qo‘shish. Uning yordamida yuzalar, hajmlar, bajarilgan ish va bosib o‘tilgan yo‘l hisoblanadi.",
    explain: "<p><b>Nyuton–Leybnits formulasi:</b></p><span class='fb'>∫ₐᵇ f(x) dx = F(b) − F(a)</span><p>bu yerda F — f ning istalgan boshlang‘ich funksiyasi (C qisqarib ketadi).</p><p><b>Misol:</b> ∫₁³ 2x dx = x² |₁³ = 9 − 1 = 8.</p><p><b>Xossalari:</b></p><ul><li>∫ₐᵃ f dx = 0; ∫ₐᵇ f dx = −∫ᵦᵃ f dx.</li><li>∫ₐᵇ f dx = ∫ₐᶜ f dx + ∫ᶜᵇ f dx.</li><li>Toq funksiya uchun ∫₋ₐᵃ f dx = 0; juft uchun = 2∫₀ᵃ f dx.</li></ul><p><b>Fizik ma’no:</b> tezlik v(t) bo‘lsa, [a; b] vaqtda bosib o‘tilgan yo‘l ∫ₐᵇ v(t)dt.</p>",
    rule: "∫ₐᵇ f dx = F(b) − F(a). Avval yuqori chegarani, keyin pastkini qo‘ying.",
    tip: "F(b) − F(a) tartibini almashtirsangiz, ishora teskari bo‘ladi.",
    demos: [{ type: "integral" }],
    ex: [
      ["∫₀² (3x² − 2x) dx = ?", ["F(x) = x³ − x²", "F(2) − F(0) = (8 − 4) − 0 = 4"], "4"],
      ["∫₀^(π/2) cos x dx = ?", ["F(x) = sin x", "sin(π/2) − sin 0 = 1"], "1"]
    ],
    qz: [
      ["∫₀¹ x dx = ?", ["[[1/2]]", "1", "0", "2"], "x²/2 |₀¹."],
      ["∫₋₂² x³ dx = ?", ["0", "8", "16", "4"], "Toq funksiya, simmetrik chegaralar."],
      ["∫₁ᵉ [[1/x]] dx = ?", ["1", "e", "0", "e − 1"], "ln e − ln 1."]
    ]
  });
  add("2.2.14", {
    life: "Daryo kesimining yuzi, quyosh paneli qabul qilgan energiya, egri chiziq bilan chegaralangan yer maydoni — bularni faqat integral yordamida aniq hisoblash mumkin.",
    explain: "<p><b>Egri chiziqli trapetsiya</b> — y = f(x) ≥ 0 grafigi, Ox o‘qi va x = a, x = b to‘g‘ri chiziqlar bilan chegaralangan shakl. Uning yuzi:</p><span class='fb'>S = ∫ₐᵇ f(x) dx</span><p><b>Ikki chiziq orasidagi yuz</b> (f(x) ≥ g(x)):</p><span class='fb'>S = ∫ₐᵇ (f(x) − g(x)) dx</span><p>a va b — ko‘pincha chiziqlarning kesishish nuqtalari: f(x) = g(x) ni yechib topiladi.</p><p><b>Funksiya Ox dan pastda</b> bo‘lsa, yuz = −∫ f dx (yuz doim musbat!).</p><p><b>Misol:</b> y = x² va y = x orasidagi yuz: kesishish x = 0, 1; [0; 1] da x ≥ x² → S = ∫₀¹(x − x²)dx = 1/2 − 1/3 = 1/6.</p>",
    rule: "S = ∫ₐᵇ (yuqori − pastki) dx. Chegaralar — kesishish nuqtalari.",
    tip: "Ox dan pastdagi qism uchun integral manfiy chiqadi — yuz uchun modulini oling.",
    demos: [{ type: "integral" }],
    ex: [
      ["y = x², y = 0, x = 3 chiziqlar bilan chegaralangan yuz?", ["S = ∫₀³ x² dx = x³/3 |₀³ = 9"], "9"],
      ["y = 4 − x² va y = 0 bilan chegaralangan yuz?", ["Kesishish: 4 − x² = 0 → x = ±2", "S = ∫₋₂² (4 − x²)dx = (4x − x³/3)|₋₂² = (8 − 8/3) − (−8 + 8/3) = [[32/3]]"], "[[32/3]]"]
    ],
    qz: [
      ["y = 2x, y = 0, x = 3 bilan chegaralangan yuz?", ["9", "6", "18", "3"], "Uchburchak: ½·3·6 yoki x²|₀³."],
      ["y = sin x, y = 0, x ∈ [0; π] yuz?", ["2", "1", "π", "0"], "−cos x |₀^π = 1 + 1."],
      ["y = √x, y = 0, x = 4 bilan chegaralangan yuz?", ["[[16/3]]", "8", "[[8/3]]", "4"], "⅔·x√x |₀⁴ = ⅔·8."]
    ]
  });

  // ===== 2.3 Maxsus yo'l =====
  add("2.3", {
    life: "Ba’zi masalalarni standart formulalar bilan yechish juda uzoq. Maxsus usullar — simmetriya, baholash, grafik, sun’iy almashtirish — bir necha qatorda yechim beradi. Bu matematik zukkolikni rivojlantiradi.",
    explain: "<p><b>Asosiy maxsus usullar:</b></p><ol><li><b>Baholash (chegaralash):</b> sin x ≤ 1, x² ≥ 0, a + 1/a ≥ 2 dan foydalanish. Masalan, sin x + cos y = 2 ⇔ sin x = 1 va cos y = 1.</li><li><b>Monotonlik:</b> o‘suvchi funksiya har bir qiymatni bir marta qabul qiladi. 2ˣ + x = 3 → chap tomon o‘suvchi, x = 1 tanlab topiladi, boshqa yechim yo‘q.</li><li><b>Kvadratlar yig‘indisi:</b> (x − 1)² + (y + 2)² = 0 ⇔ x = 1, y = −2.</li><li><b>Grafik usul:</b> f(x) = g(x) ning ildizlar soni — grafiklarning kesishish nuqtalari soni.</li><li><b>Sun’iy almashtirish va simmetriya:</b> x + 1/x = t; ifodani o‘ziga teskari tartibda yozib qo‘shish (Gauss usuli).</li><li><b>Teleskopik yig‘indi:</b> [[1/(n(n + 1))]] = [[1/n]] − [[1/(n + 1)]].</li></ol>",
    rule: "Kvadratlar (va modullar) yig‘indisi nolga teng ⇔ har biri nolga teng.",
    tip: "Monoton funksiya uchun bitta ildiz topilsa — boshqasi yo‘q. Isbot uchun monotonlikni ko‘rsating.",
    ex: [
      ["Hisoblang: [[1/(1·2)]] + [[1/(2·3)]] + … + [[1/(99·100)]]", ["Har bir had: [[1/n]] − [[1/(n + 1)]]", "Yig‘indi: 1 − [[1/2]] + [[1/2]] − [[1/3]] + … − [[1/100]]", "= 1 − [[1/100]] = [[99/100]]"], "[[99/100]]"],
      ["Yeching: x² + y² − 4x + 6y + 13 = 0", ["To‘la kvadrat: (x − 2)² + (y + 3)² = 0", "x = 2, y = −3"], "(2; −3)"]
    ],
    qz: [
      ["|x − 1| + (y − 2)² = 0 → x + y = ?", ["3", "1", "2", "0"], "x = 1, y = 2."],
      ["3ˣ + x = 4 tenglamaning ildizi?", ["1", "0", "2", "ildizi yo‘q"], "Chap tomon o‘suvchi, x = 1 da 3 + 1 = 4."],
      ["sin x · cos x = 1 ning yechimlari soni?", ["0", "1", "2", "cheksiz"], "sin x cos x = ½ sin 2x ≤ ½."]
    ]
  });
})();
