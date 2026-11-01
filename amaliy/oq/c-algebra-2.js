/* Oq to'plam — 1-bob Algebra (1.8–1.14). */
window.OQ = window.OQ || {};
(() => {
  const add = (code, o) => { window.OQ[code] = o; };

  // ===== 1.8 Modul =====
  add("1.8.1", {
    life: "Modul — sonning noldan uzoqligi. Ikki shahar orasidagi masofa, xatolik kattaligi, harorat farqi — bularning hammasi modul bilan o‘lchanadi, chunki masofa manfiy bo‘lmaydi.",
    explain: "<span class='fb'>|a| = a, agar a ≥ 0; &nbsp; |a| = −a, agar a < 0</span><p>Geometrik ma’nosi: |a| — son o‘qida a nuqtadan 0 gacha masofa; |a − b| — a va b nuqtalar orasidagi masofa.</p><p><b>Xossalari:</b> |a| ≥ 0; |−a| = |a|; |ab| = |a|·|b|; |a/b| = |a|/|b|; |a|² = a²; √(a²) = |a|; |a + b| ≤ |a| + |b|.</p><p><b>Modulni ochish:</b> ichidagi ifodaning ishorasini aniqlaymiz. Masalan, |√3 − 2|: √3 ≈ 1,73 < 2 → ifoda manfiy → |√3 − 2| = 2 − √3.</p>",
    rule: "|a| = a (a ≥ 0), |a| = −a (a < 0). √(a²) = |a|.",
    tip: "|a| = −a manfiy son degani emas! a < 0 bo‘lsa, −a musbat bo‘ladi.",
    demos: [{ type: "fgraph", kind: "abs", title: "y = |x − m| + n grafigi" }],
    ex: [
      ["Hisoblang: |3 − π| + |π − 4|", ["π ≈ 3,14: 3 − π < 0 → |3 − π| = π − 3", "π − 4 < 0 → |π − 4| = 4 − π", "π − 3 + 4 − π = 1"], "1"],
      ["x < 2 bo‘lsa, √((x − 2)²) + x ni soddalashtiring.", ["√((x − 2)²) = |x − 2|", "x < 2 → |x − 2| = 2 − x", "2 − x + x = 2"], "2"]
    ],
    qz: [
      ["|−7| − |3| = ?", ["4", "−10", "10", "−4"], "7 − 3 = 4."],
      ["|1 − √2| = ?", ["√2 − 1", "1 − √2", "1 + √2", "−1 − √2"], "1 < √2 → ifoda manfiy."],
      ["a < 0 da [[|a|/a]] = ?", ["−1", "1", "a", "0"], "|a| = −a."]
    ]
  });
  add("1.8.2", {
    life: "“Harorat 20° dan 3 gradusga farq qiladi” — bu |t − 20| = 3, ya’ni t = 17 yoki 23. Modulli tenglamalarda odatda ikkita javob bo‘ladi — buni unutmaslik muhim.",
    explain: "<p><b>Asosiy turlari:</b></p><ul><li><b>|f(x)| = a</b>: a < 0 → yechim yo‘q; a = 0 → f(x) = 0; a > 0 → f(x) = a yoki f(x) = −a.</li><li><b>|f(x)| = g(x)</b>: g(x) ≥ 0 sharti bilan f(x) = g(x) yoki f(x) = −g(x).</li><li><b>|f(x)| = |g(x)|</b> ⇔ f(x) = g(x) yoki f(x) = −g(x).</li><li><b>Bir nechta modul</b> (|x − 1| + |x − 3| = 4): modul ichidagi ifodalarning nollari son o‘qini oraliqlarga bo‘ladi; har bir oraliqda modullarni ochib, yechamiz va yechim shu oraliqqa tegishliligini tekshiramiz.</li></ul>",
    rule: "|f| = a (a > 0) ⇔ f = ±a. |f| = g ⇔ g ≥ 0 va f = ±g.",
    tip: "|f(x)| = g(x) da topilgan ildizlar uchun g(x) ≥ 0 ni tekshiring — aks holda begona ildiz kiradi.",
    demos: [{ type: "fgraph", kind: "abs", title: "Grafik y = n chizig‘ini nechta nuqtada kesadi?" }],
    ex: [
      ["Yeching: |2x − 3| = 5", ["2x − 3 = 5 → x = 4", "2x − 3 = −5 → x = −1"], "−1 va 4"],
      ["Yeching: |x − 1| + |x − 3| = 4", ["Nollar: 1 va 3", "x < 1: (1 − x) + (3 − x) = 4 → x = 0 ✓", "1 ≤ x ≤ 3: (x − 1) + (3 − x) = 2 ≠ 4 — yechim yo‘q", "x > 3: (x − 1) + (x − 3) = 4 → x = 4 ✓"], "0 va 4"]
    ],
    qz: [
      ["|x + 2| = 3 ildizlari yig‘indisi?", ["−4", "6", "2", "−2"], "x = 1 yoki −5."],
      ["|x − 5| = −2 ning yechimi?", ["yechim yo‘q", "3", "7", "3 va 7"], "Modul manfiy bo‘lmaydi."],
      ["|x| = x tenglamaning yechimi?", ["x ≥ 0", "x = 0", "x > 0", "barcha x"], "|x| = x faqat x ≥ 0 da."]
    ]
  });
  add("1.8.3", {
    life: "“Detal o‘lchami 50 mm dan ko‘pi bilan 0,1 mm farq qilishi mumkin” — |d − 50| ≤ 0,1. Sanoatda ruxsat etilgan xatolik aynan modulli tengsizlik bilan yoziladi.",
    explain: "<p><b>Asosiy qoidalar</b> (a > 0):</p><span class='fb'>|f(x)| < a ⇔ −a < f(x) < a</span><span class='fb'>|f(x)| > a ⇔ f(x) < −a yoki f(x) > a</span><p>Geometrik ma’no: |x − c| < r — c dan r dan kam masofadagi nuqtalar, ya’ni (c − r; c + r) oraliq.</p><p><b>Maxsus holatlar:</b> |f| < 0 — yechim yo‘q; |f| ≥ 0 — barcha x; |f| > −3 — barcha x (ATSda).</p><p><b>|f| < |g|</b> ⇔ f² < g² ⇔ (f − g)(f + g) < 0 — kvadratga ko‘tarish qulay.</p><p>Bir nechta modul bo‘lsa — oraliqlar usuli (1.8.2 dagidek).</p>",
    rule: "|f| < a → qo‘sh tengsizlik (“orasida”); |f| > a → ikki oraliq (“tashqarisida”).",
    tip: "|x − 3| ≤ 2 javobi [1; 5] — chegaralar ham kiradi, chunki tengsizlik noqat’iy.",
    ex: [
      ["Yeching: |3x − 2| ≤ 7", ["−7 ≤ 3x − 2 ≤ 7", "−5 ≤ 3x ≤ 9", "−[[5/3]] ≤ x ≤ 3"], "[−[[5/3]]; 3]"],
      ["Yeching: |x + 1| > 4", ["x + 1 < −4 → x < −5", "x + 1 > 4 → x > 3"], "(−∞; −5) ∪ (3; +∞)"]
    ],
    qz: [
      ["|x| < 3 butun yechimlari soni?", ["5", "6", "7", "3"], "−2, −1, 0, 1, 2."],
      ["|x − 4| ≥ 1 → ?", ["(−∞; 3] ∪ [5; +∞)", "[3; 5]", "(3; 5)", "x ≥ 5"], "Tashqarisi, chegaralar bilan."],
      ["|2x + 1| < −1 → ?", ["yechim yo‘q", "barcha x", "x < −1", "x > 0"], "Modul manfiy sondan kichik bo‘lolmaydi."]
    ]
  });
  add("1.8.4", {
    life: "Modulli sistemalar — bir nechta shartni birga qanoatlantirish. Ular modulni ochish ko‘nikmasini to‘liq mustahkamlaydi.",
    explain: "<p><b>Sistemani yechish rejasi:</b></p><ol><li>Har bir tengsizlik yoki tenglamani alohida yeching.</li><li>Son o‘qida yechimlarni belgilang va kesishmasini toping.</li></ol><p><b>Modulli tenglamalar sistemasi</b> { |x| + |y| = a; … } da ishoralar bo‘yicha holatlarga ajratamiz: x ≥ 0, y ≥ 0; x ≥ 0, y < 0 va hokazo.</p><p><b>Geometrik tasavvur:</b> |x| + |y| = a — uchlari (±a; 0), (0; ±a) bo‘lgan kvadrat (romb); |x| ≤ a — vertikal polosa.</p><p>Har bir holatda topilgan yechim shu holat shartiga mos kelishini tekshiring.</p>",
    rule: "Har bir tengsizlikni alohida yeching → kesishmani oling.",
    tip: "Holatlarga bo‘lganda yechimni shu holat shartiga tekshirmaslik — eng ko‘p xato.",
    ex: [
      ["Yeching: { |x − 2| < 3; |x| ≥ 2 }", ["|x − 2| < 3 → −1 < x < 5", "|x| ≥ 2 → x ≤ −2 yoki x ≥ 2", "Kesishma: 2 ≤ x < 5"], "[2; 5)"],
      ["Yeching: { |x| = 3; |x − y| = 1 } (x > 0)", ["x = 3", "|3 − y| = 1 → y = 2 yoki y = 4"], "(3; 2) va (3; 4)"]
    ],
    qz: [
      ["{ |x| ≤ 4; x > 1 } butun yechimlari soni?", ["3", "4", "5", "2"], "2, 3, 4."],
      ["{ |x − 1| < 2; |x + 1| < 2 } → ?", ["(−1; 1)", "(−3; 3)", "(−1; 3)", "(−3; 1)"], "(−1; 3) ∩ (−3; 1)."],
      ["|x| + |y| = 2 grafigi qanday shakl?", ["Kvadrat (romb)", "Aylana", "To‘g‘ri chiziq", "Parabola"], "Uchlari (±2; 0), (0; ±2)."]
    ]
  });

  // ===== 1.9 Irratsional =====
  add("1.9.1", {
    life: "Fizikada mayatnik davri, erkin tushish vaqti t = √(2h/g) — ildizli formulalar. Noma’lum ildiz ostida bo‘lsa, irratsional tenglama hosil bo‘ladi.",
    explain: "<p><b>Asosiy usul — kvadratga ko‘tarish:</b></p><span class='fb'>√f(x) = g(x) ⇔ { g(x) ≥ 0; f(x) = g²(x) }</span><p>Kvadratga ko‘tarishda <b>begona ildizlar</b> paydo bo‘lishi mumkin, shuning uchun g(x) ≥ 0 shartini qo‘shamiz yoki javobni tekshiramiz.</p><p><b>Boshqa turlari:</b></p><ul><li>√f = √g ⇔ f = g, f ≥ 0.</li><li>Ikki ildiz: birini yolg‘iz qoldirib, ikki marta kvadratga ko‘taramiz.</li><li>Yangi o‘zgaruvchi: x + √x − 6 = 0 → √x = t ≥ 0 → t² + t − 6 = 0 → t = 2 → x = 4.</li></ul><p><b>ATS:</b> juft darajali ildiz ostidagi ifoda ≥ 0.</p>",
    rule: "√f = g ⇔ g ≥ 0 va f = g². Javobni albatta tekshiring!",
    tip: "√(x) = −2 yechimga ega emas — arifmetik ildiz manfiy bo‘lmaydi.",
    ex: [
      ["Yeching: √(x + 7) = x + 1", ["Shart: x + 1 ≥ 0 → x ≥ −1", "x + 7 = x² + 2x + 1 → x² + x − 6 = 0", "x = 2 yoki x = −3; −3 shartga mos emas"], "x = 2"],
      ["Yeching: x − 5√x + 6 = 0", ["√x = t ≥ 0: t² − 5t + 6 = 0", "t = 2 yoki 3", "x = 4 yoki x = 9"], "4 va 9"]
    ],
    qz: [
      ["√(2x − 1) = 3 → x = ?", ["5", "4", "2", "10"], "2x − 1 = 9."],
      ["√(x + 2) = −x ning yechimi?", ["−1", "2", "−1 va 2", "yechim yo‘q"], "x + 2 = x², x = 2 yoki −1; −x ≥ 0 → x = −1."],
      ["√(x − 3) + √(3 − x) = 0 → x = ?", ["3", "0", "yechim yo‘q", "istalgan"], "ATS: x ≥ 3 va x ≤ 3."]
    ]
  });
  add("1.9.2", {
    life: "Irratsional tengsizliklar ATS va ishoralar bilan ishlashni talab qiladi. Ular hamma narsani birlashtiradi: ildiz, kvadrat tengsizlik va sistema.",
    explain: "<p><b>Asosiy sxemalar:</b></p><span class='fb'>√f < g ⇔ { f ≥ 0; g > 0; f < g² }</span><span class='fb'>√f > g ⇔ { g < 0; f ≥ 0 } yoki { g ≥ 0; f > g² }</span><span class='fb'>√f < √g ⇔ { f ≥ 0; f < g }</span><p><b>Eng oddiy holatlar:</b> √f < a (a > 0) ⇔ 0 ≤ f < a²; √f > a (a ≥ 0) ⇔ f > a²; √f > a (a < 0) ⇔ f ≥ 0.</p><p>Har doim avval ATSni yozing: ildiz ostidagi ifoda ≥ 0.</p>",
    rule: "√f < a → 0 ≤ f < a² (a > 0). Ildiz ostidagi ifoda ≥ 0 — doim!",
    tip: "√(x − 1) < 2 ni yechganda x < 5 bilan cheklanmang — ATS x ≥ 1 ni ham qo‘shing: [1; 5).",
    ex: [
      ["Yeching: √(x + 3) < 2", ["ATS: x + 3 ≥ 0 → x ≥ −3", "x + 3 < 4 → x < 1", "Kesishma: −3 ≤ x < 1"], "[−3; 1)"],
      ["Yeching: √(x − 2) > x − 4", ["1) x − 4 < 0 va x − 2 ≥ 0: 2 ≤ x < 4", "2) x ≥ 4 va x − 2 > (x − 4)² → x² − 9x + 18 < 0 → 3 < x < 6 → 4 ≤ x < 6", "Birlashma: 2 ≤ x < 6"], "[2; 6)"]
    ],
    qz: [
      ["√x < 3 → ?", ["[0; 9)", "(−∞; 9)", "(0; 3)", "[0; 3)"], "0 ≤ x < 9."],
      ["√(x − 1) ≥ 2 → ?", ["[5; +∞)", "[1; 5]", "[3; +∞)", "(5; +∞)"], "x − 1 ≥ 4."],
      ["√(x + 1) > −2 → ?", ["[−1; +∞)", "barcha x", "(−1; +∞)", "yechim yo‘q"], "Faqat ATS: x ≥ −1."]
    ]
  });

  // ===== 1.10 Progressiyalar =====
  add("1.10.1", {
    life: "Har oy jamg‘armaga 50 ming qo‘shib borsangiz, bir yildan keyin qancha bo‘ladi? Zinapoya, teatr qatorlaridagi o‘rinlar, oylik maoshning har yili oshishi — arifmetik progressiya.",
    explain: "<p><b>Arifmetik progressiya</b> — har bir hadi oldingisiga bir xil son d (ayirma) qo‘shish bilan hosil bo‘ladi: 3, 7, 11, 15, … (d = 4).</p><span class='fb'>aₙ = a₁ + (n − 1)d</span><span class='fb'>Sₙ = [[(a₁ + aₙ)/2]] · n = [[(2a₁ + (n − 1)d)/2]] · n</span><p><b>Xossalari:</b></p><ul><li>Har bir had qo‘shnilarining o‘rta arifmetigi: aₙ = [[(aₙ₋₁ + aₙ₊₁)/2]].</li><li>m + n = p + q bo‘lsa, aₘ + aₙ = aₚ + a_q. Masalan, a₂ + a₉ = a₅ + a₆.</li><li>d = [[(aₘ − aₙ)/(m − n)]].</li></ul><p>Klassik misol: 1 + 2 + … + 100 = (1 + 100)·100/2 = 5050 (Gauss).</p>",
    rule: "aₙ = a₁ + (n − 1)d; Sₙ = (a₁ + aₙ)n/2.",
    tip: "Hadlar soni: 5 dan 50 gacha 5 ga karrali sonlar — (50 − 5)/5 + 1 = 10 ta (1 qo‘shishni unutmang!).",
    demos: [{ type: "progression", kind: "arith" }],
    ex: [
      ["a₃ = 7, a₈ = 22. a₁ va d ni toping.", ["d = (22 − 7)/(8 − 3) = 3", "a₁ = a₃ − 2d = 7 − 6 = 1"], "a₁ = 1, d = 3"],
      ["Ikki xonali 3 ga karrali sonlar yig‘indisi?", ["12, 15, …, 99: n = (99 − 12)/3 + 1 = 30", "S = (12 + 99)·30/2 = 1665"], "1665"]
    ],
    qz: [
      ["2, 5, 8, … progressiyaning 20-hadi?", ["59", "62", "57", "60"], "2 + 19·3 = 59."],
      ["1 + 3 + 5 + … + 99 = ?", ["2500", "5000", "2550", "2450"], "50 ta had: (1 + 99)·50/2."],
      ["a₄ + a₇ = 20. a₂ + a₉ = ?", ["20", "10", "40", "aniqlab bo‘lmaydi"], "4 + 7 = 2 + 9."]
    ]
  });
  add("1.10.2", {
    life: "Bakteriyalar har soatda 2 barobar ko‘payadi, bankdagi omonat har yili 20% oshadi, shaxmat taxtasiga don qo‘yish afsonasi — bular geometrik progressiya. U juda tez o‘sadi!",
    explain: "<p><b>Geometrik progressiya</b> — har bir hadi oldingisini bir xil q ≠ 0 songa (maxrajga) ko‘paytirish bilan hosil bo‘ladi: 3, 6, 12, 24, … (q = 2).</p><span class='fb'>bₙ = b₁ · qⁿ⁻¹</span><span class='fb'>Sₙ = [[b₁(qⁿ − 1)/(q − 1)]] &nbsp; (q ≠ 1)</span><span class='fb'>Cheksiz kamayuvchi (|q| < 1): S = [[b₁/(1 − q)]]</span><p><b>Xossalari:</b> bₙ² = bₙ₋₁ · bₙ₊₁ (o‘rta geometrik); m + n = p + q bo‘lsa bₘ·bₙ = bₚ·b_q.</p><p><b>Misol:</b> 1 + [[1/2]] + [[1/4]] + … = [[1/(1 − 1/2)]] = 2.</p><p>Davriy kasrlar ham cheksiz geometrik progressiya: 0,(3) = 0,3 + 0,03 + … = [[0,3/0,9]] = [[1/3]].</p>",
    rule: "bₙ = b₁qⁿ⁻¹; Sₙ = b₁(qⁿ − 1)/(q − 1); |q| < 1 da S = b₁/(1 − q).",
    tip: "Cheksiz yig‘indi formulasi faqat |q| < 1 da ishlaydi.",
    demos: [{ type: "progression", kind: "geo" }],
    ex: [
      ["b₂ = 6, b₅ = 162. q va b₁ ni toping.", ["b₅/b₂ = q³ = 27 → q = 3", "b₁ = b₂/q = 2"], "q = 3, b₁ = 2"],
      ["12 + 6 + 3 + … cheksiz yig‘indini toping.", ["b₁ = 12, q = [[1/2]]", "S = 12/(1 − 1/2) = 24"], "24"]
    ],
    qz: [
      ["2, 6, 18, … ning 5-hadi?", ["162", "54", "486", "108"], "2·3⁴ = 162."],
      ["1 + 2 + 4 + … + 2⁹ = ?", ["1023", "1024", "512", "511"], "S₁₀ = 2¹⁰ − 1."],
      ["b₃ = 4, b₅ = 16 (b₄ > 0). b₄ = ?", ["8", "10", "12", "64"], "b₄² = 4·16."]
    ]
  });

  // ===== 1.11 Matnli masalalar =====
  add("1.11.1", {
    life: "Sonlarga oid matnli masalalar — mantiqiy fikrlashni tenglama tiliga o‘girish mashqi. “Son o‘ylandi…” degan topishmoqlar aslida tenglamadir.",
    explain: "<p><b>Masalani yechish rejasi:</b> 1) noma’lumni x deb belgilash; 2) shartlarni tenglama qilib yozish; 3) yechish; 4) javob ma’noga mosligini tekshirish.</p><p><b>Raqamli sonlar:</b> ikki xonali son <b>10a + b</b> (a — o‘nlar, b — birlar), raqamlari o‘rni almashganda <b>10b + a</b>. Uch xonali: 100a + 10b + c.</p><p><b>Ketma-ket sonlar:</b> n, n + 1, n + 2; ketma-ket juft (toq) sonlar: n, n + 2, n + 4.</p><p><b>“… marta katta”</b> — ko‘paytirish; <b>“… ga katta”</b> — qo‘shish. “a son b ning [[2/3]] qismi” → a = [[2/3]]b.</p>",
    rule: "Ikki xonali son: 10a + b. Raqamlar o‘rni almashsa ayirma 9(a − b).",
    tip: "“5 ga katta” (x + 5) va “5 marta katta” (5x) ni adashtirmang.",
    ex: [
      ["Ikki xonali sonning raqamlari yig‘indisi 9. Raqamlar o‘rni almashsa, son 27 ga ortadi. Sonni toping.", ["a + b = 9; (10b + a) − (10a + b) = 27 → 9(b − a) = 27 → b − a = 3", "a = 3, b = 6"], "36"],
      ["Uchta ketma-ket natural son yig‘indisi 87. Eng kattasi?", ["n + (n + 1) + (n + 2) = 87 → 3n + 3 = 87 → n = 28"], "30"]
    ],
    qz: [
      ["Bir son ikkinchisidan 3 marta katta, yig‘indisi 48. Kattasi?", ["36", "12", "32", "16"], "x + 3x = 48 → x = 12."],
      ["Sonning [[3/5]] qismi 24. Son?", ["40", "14,4", "30", "45"], "24 : [[3/5]] = 40."],
      ["Ikki ketma-ket juft son ko‘paytmasi 168. Kichigi?", ["12", "14", "10", "16"], "12·14 = 168."]
    ]
  });
  add("1.11.2", {
    life: "Chegirma 30%, kredit foizi 24%, narx 15% oshdi — foizlarsiz zamonaviy hayot yo‘q. Foiz masalalari DTMning har bir variantida bor.",
    explain: "<p><b>1% — sonning [[1/100]] qismi.</b></p><ul><li>a ning p% i: [[a·p/100]].</li><li>p% i b bo‘lgan son: [[b·100/p]].</li><li>a son b ning necha foizi: [[a/b]]·100%.</li></ul><p><b>O‘zgarish:</b> a son p% oshsa → a(1 + [[p/100]]); kamaysa → a(1 − [[p/100]]). Masalan, 20% oshish — 1,2 ga ko‘paytirish.</p><p><b>Ketma-ket o‘zgarishlar</b> ko‘paytiriladi, qo‘shilmaydi! 20% oshib, keyin 20% kamaysa: 1,2·0,8 = 0,96 → umuman 4% kamaygan.</p><p><b>Murakkab foiz:</b> S = S₀(1 + [[p/100]])ⁿ.</p>",
    rule: "p% oshish → ×(1 + p/100), p% kamayish → ×(1 − p/100). Ketma-ket o‘zgarishlar ko‘paytiriladi.",
    tip: "Narx 25% oshdi. Qaytib eski narxga tushishi uchun 25% emas, 20% kamayishi kerak (1,25·0,8 = 1).",
    demos: [{ type: "percentCalc" }],
    ex: [
      ["Mahsulot narxi 20% oshgach 72 000 so‘m bo‘ldi. Dastlabki narx?", ["x · 1,2 = 72 000", "x = 60 000"], "60 000 so‘m"],
      ["Omonat yiliga 10%. 1 000 000 so‘m 2 yildan keyin?", ["1 000 000 · 1,1² = 1 000 000 · 1,21"], "1 210 000 so‘m"]
    ],
    qz: [
      ["80 ning 15% i?", ["12", "15", "8", "10"], "80·0,15 = 12."],
      ["Narx 10% oshib, keyin 10% kamaydi. Umumiy o‘zgarish?", ["1% kamaydi", "o‘zgarmadi", "1% oshdi", "2% kamaydi"], "1,1·0,9 = 0,99."],
      ["30 son 120 ning necha foizi?", ["25%", "40%", "30%", "4%"], "30/120 = 0,25."]
    ]
  });
  add("1.11.3", {
    life: "Ikki shahardan bir-biriga qarab chiqqan mashinalar qachon uchrashadi? Daryo oqimiga qarshi suzgan qayiq qancha vaqt sarflaydi? Harakat masalalari — S = vt formulasi atrofida.",
    explain: "<span class='fb'>S = v · t, &nbsp; v = S / t, &nbsp; t = S / v</span><ul><li><b>Qarama-qarshi harakat:</b> yaqinlashish tezligi v₁ + v₂, uchrashish vaqti t = [[S/(v₁ + v₂)]].</li><li><b>Bir tomonga (quvib yetish):</b> yaqinlashish tezligi v₁ − v₂, t = [[S/(v₁ − v₂)]].</li><li><b>Daryoda:</b> oqim bo‘yicha v + v<sub>oq</sub>, oqimga qarshi v − v<sub>oq</sub>.</li><li><b>O‘rtacha tezlik</b> = umumiy yo‘l / umumiy vaqt (tezliklarning o‘rta arifmetigi EMAS!).</li></ul><p>Bir xil masofani v₁ va v₂ tezlikda o‘tganda o‘rtacha tezlik: [[2v₁v₂/(v₁ + v₂)]].</p>",
    rule: "Uchrashuv: t = S/(v₁ + v₂); quvish: t = S/(v₁ − v₂). O‘rtacha tezlik = jami yo‘l / jami vaqt.",
    tip: "60 km/soat va 40 km/soat bilan teng masofalarni o‘tsa, o‘rtacha tezlik 50 emas, 48 km/soat!",
    demos: [{ type: "motion" }],
    ex: [
      ["Masofa 360 km. Ikki mashina bir-biriga qarab 70 va 50 km/soat tezlikda chiqdi. Qachon uchrashadi?", ["v₁ + v₂ = 120 km/soat", "t = 360 / 120 = 3 soat"], "3 soatdan keyin"],
      ["Qayiq tezligi 15 km/soat, oqim 3 km/soat. 36 km ga borib-qaytish vaqti?", ["Borish: 36/18 = 2 soat", "Qaytish: 36/12 = 3 soat", "Jami 5 soat"], "5 soat"]
    ],
    qz: [
      ["Velosipedchi 3 soatda 45 km yurdi. Tezligi?", ["15 km/soat", "135 km/soat", "12 km/soat", "48 km/soat"], "45/3."],
      ["Yo‘lning yarmini 30, yarmini 60 km/soatda o‘tdi. O‘rtacha tezlik?", ["40 km/soat", "45 km/soat", "50 km/soat", "35 km/soat"], "2·30·60/90 = 40."],
      ["Oqim bo‘yicha 20 km/soat, qarshi 14 km/soat. Oqim tezligi?", ["3 km/soat", "6 km/soat", "17 km/soat", "2 km/soat"], "(20 − 14)/2."]
    ]
  });
  add("1.11.4", {
    life: "Bir quvur hovuzni 6 soatda, ikkinchisi 3 soatda to‘ldiradi — ikkalasi birga-chi? Ish masalalari qurilish, ishlab chiqarish va rejalashtirishda kerak.",
    explain: "<p><b>Asosiy g‘oya:</b> butun ishni <b>1</b> deb olamiz. Agar ishni t soatda bajarsa, <b>unumdorlik</b> (1 soatdagi ish) = [[1/t]].</p><span class='fb'>Ish = unumdorlik × vaqt</span><p><b>Birgalikda ishlaganda</b> unumdorliklar qo‘shiladi: [[1/t₁]] + [[1/t₂]] = [[1/t]].</p><p><b>Misol:</b> 6 va 3 soat → [[1/6]] + [[1/3]] = [[1/2]] → birga 2 soatda.</p><p>Hovuzni bir quvur to‘ldirib, boshqasi bo‘shatsa, unumdorliklar ayiriladi.</p>",
    rule: "Birga ishlash vaqti: t = t₁t₂/(t₁ + t₂). Unumdorlik = 1/t.",
    tip: "Vaqtlarni qo‘shmang (6 + 3 = 9 emas!) — unumdorliklarni qo‘shing.",
    ex: [
      ["Usta ishni 10 kunda, shogird 15 kunda bajaradi. Birga necha kunda?", ["[[1/10]] + [[1/15]] = [[3/30]] + [[2/30]] = [[1/6]]", "t = 6 kun"], "6 kun"],
      ["Bir quvur hovuzni 4 soatda to‘ldiradi, ikkinchisi 6 soatda bo‘shatadi. Ikkalasi ochiq bo‘lsa?", ["[[1/4]] − [[1/6]] = [[1/12]]", "12 soatda to‘ladi"], "12 soat"]
    ],
    qz: [
      ["Ikki traktor birga 4 kunda, birinchisi yolg‘iz 6 kunda haydaydi. Ikkinchisi yolg‘iz?", ["12 kun", "10 kun", "2 kun", "8 kun"], "1/4 − 1/6 = 1/12."],
      ["Uch ishchi ishni 2, 3, 6 soatda bajaradi. Birga?", ["1 soat", "11 soat", "2 soat", "[[1/2]] soat"], "1/2 + 1/3 + 1/6 = 1."],
      ["Ishni 8 soatda bajaradigan ishchi 3 soatda ishning qancha qismini bajaradi?", ["[[3/8]]", "[[5/8]]", "[[8/3]]", "[[1/3]]"], "3·(1/8)."]
    ]
  });
  add("1.11.5", {
    life: "Choyga shakar, eritma tayyorlash, qotishmalar, sut mahsulotlaridagi yog‘ foizi — aralashma masalalari kimyo va oshxona hayotida ham uchraydi.",
    explain: "<p><b>Asosiy formula:</b> sof modda massasi = aralashma massasi × konsentratsiya.</p><span class='fb'>m<sub>modda</sub> = m · [[p/100]]</span><p><b>Ikki eritma aralashtirilsa:</b> sof moddalar va massalar alohida qo‘shiladi:</p><span class='fb'>p = [[(m₁p₁ + m₂p₂)/(m₁ + m₂)]]</span><p><b>Suv qo‘shilsa</b> — modda miqdori o‘zgarmaydi, massa ortadi. <b>Bug‘latilsa</b> — modda o‘zgarmaydi, massa kamayadi.</p><p>Natija foizi doim p₁ va p₂ orasida bo‘ladi.</p>",
    rule: "Sof modda = massa × foiz/100. Aralashtirishda sof moddalar qo‘shiladi.",
    tip: "Foizlarni to‘g‘ridan-to‘g‘ri o‘rta arifmetigini olish xato — massalar har xil bo‘lsa!",
    demos: [{ type: "mixture" }],
    ex: [
      ["10% li 200 g va 30% li 300 g eritma aralashtirildi. Yangi foiz?", ["Tuz: 200·0,1 + 300·0,3 = 20 + 90 = 110 g", "Massa: 500 g", "110/500 = 22%"], "22%"],
      ["20% li 400 g eritmaga qancha suv qo‘shilsa, 16% li bo‘ladi?", ["Tuz: 400·0,2 = 80 g", "80 / (400 + x) = 0,16 → 400 + x = 500"], "100 g"]
    ],
    qz: [
      ["300 g 15% li eritmada necha gramm tuz bor?", ["45 g", "15 g", "30 g", "20 g"], "300·0,15."],
      ["5% li 100 g va 15% li 100 g aralashma foizi?", ["10%", "20%", "7,5%", "12%"], "(5 + 15)/200·100."],
      ["Mevaning 90% i suv. 10 kg mevada quruq modda qancha?", ["1 kg", "9 kg", "0,9 kg", "10 kg"], "10·0,1."]
    ]
  });

  // ===== 1.12 Funksiyalar =====
  add("1.12.1", {
    life: "Taksi narxi masofaga, harorat vaqtga, yuz tomonga bog‘liq — funksiya bu bog‘liqlik. Uning xossalarini bilish grafikni chizmasdan “ko‘rish” imkonini beradi.",
    explain: "<p><b>Funksiya</b> — har bir x ga bitta y mos qo‘yuvchi qoida: y = f(x).</p><ul><li><b>Aniqlanish sohasi D(f)</b> — x ning joiz qiymatlari: maxraj ≠ 0, juft ildiz ostida ≥ 0, logarifm ostida > 0.</li><li><b>Qiymatlar sohasi E(f)</b> — y qabul qiladigan qiymatlar.</li><li><b>Juft</b>: f(−x) = f(x), grafik Oy ga simmetrik (x², |x|, cos x). <b>Toq</b>: f(−x) = −f(x), grafik koordinata boshiga simmetrik (x³, sin x, 1/x).</li><li><b>O‘suvchi</b>: x ortsa, f(x) ortadi; <b>kamayuvchi</b> — kamayadi.</li><li><b>Nollari</b> — f(x) = 0 bo‘ladigan nuqtalar (Ox bilan kesishish).</li><li><b>Davriy</b>: f(x + T) = f(x).</li></ul>",
    rule: "D(f): maxraj ≠ 0, √(…) ≥ 0, log(…) > 0. Juft: f(−x) = f(x); toq: f(−x) = −f(x).",
    tip: "Aniqlanish sohasi koordinata boshiga simmetrik bo‘lmasa, funksiya juft ham, toq ham emas.",
    ex: [
      ["y = √(x + 2) + [[1/(x − 3)]] ning aniqlanish sohasi?", ["x + 2 ≥ 0 → x ≥ −2", "x − 3 ≠ 0 → x ≠ 3"], "[−2; 3) ∪ (3; +∞)"],
      ["f(x) = x³ − x juftmi, toqmi?", ["f(−x) = (−x)³ − (−x) = −x³ + x = −(x³ − x) = −f(x)"], "Toq funksiya"]
    ],
    qz: [
      ["y = [[1/(x² − 4)]] aniqlanmagan nuqtalar?", ["±2", "2", "4", "0"], "x² ≠ 4."],
      ["Qaysi funksiya juft?", ["y = x² + |x|", "y = x³", "y = x + 1", "y = √x"], "f(−x) = f(x)."],
      ["y = x² + 3 ning qiymatlar sohasi?", ["[3; +∞)", "(−∞; +∞)", "[0; +∞)", "(3; +∞)"], "x² ≥ 0 → y ≥ 3."]
    ]
  });
  add("1.12.2", {
    life: "Mobil aloqa tarifi: oylik to‘lov + har daqiqa uchun narx — bu chiziqli funksiya y = kx + b. Grafigi to‘g‘ri chiziq, o‘zgarish tezligi doimiy.",
    explain: "<span class='fb'>y = kx + b</span><ul><li><b>k</b> — burchak koeffitsienti: k = tg α (α — chiziqning Ox bilan burchagi). k > 0 — o‘sadi, k < 0 — kamayadi, k = 0 — gorizontal.</li><li><b>b</b> — Oy o‘qi bilan kesishish nuqtasi (0; b).</li><li>Ox bilan kesishish: (−b/k; 0).</li></ul><p><b>Ikki chiziq</b> y = k₁x + b₁ va y = k₂x + b₂:</p><ul><li>parallel: k₁ = k₂, b₁ ≠ b₂;</li><li>perpendikulyar: k₁ · k₂ = −1;</li><li>kesishadi: k₁ ≠ k₂.</li></ul><p>Ikki nuqtadan o‘tuvchi to‘g‘ri chiziq: k = [[(y₂ − y₁)/(x₂ − x₁)]].</p>",
    rule: "k = (y₂ − y₁)/(x₂ − x₁). Parallel: k₁ = k₂; perpendikulyar: k₁k₂ = −1.",
    tip: "Chiziq (2; 5) nuqtadan o‘tadimi? Tekshirish uchun x = 2 ni qo‘yib, y = 5 chiqishini ko‘ring.",
    demos: [{ type: "fgraph", kind: "linear" }],
    ex: [
      ["A(1; 3) va B(3; 7) nuqtalardan o‘tuvchi to‘g‘ri chiziq tenglamasi?", ["k = (7 − 3)/(3 − 1) = 2", "3 = 2·1 + b → b = 1"], "y = 2x + 1"],
      ["y = 3x − 2 ga parallel va (0; 5) dan o‘tuvchi chiziq?", ["Parallel → k = 3", "b = 5"], "y = 3x + 5"]
    ],
    qz: [
      ["y = −2x + 6 Ox ni qayerda kesadi?", ["(3; 0)", "(0; 6)", "(−3; 0)", "(6; 0)"], "−2x + 6 = 0 → x = 3."],
      ["y = 2x + 1 ga perpendikulyar chiziqning k si?", ["−[[1/2]]", "2", "−2", "[[1/2]]"], "k₁k₂ = −1."],
      ["y = x chizig‘i Ox bilan qanday burchak hosil qiladi?", ["45°", "30°", "60°", "90°"], "tg α = 1."]
    ]
  });
  add("1.12.3", {
    life: "Basketbol to‘pi parabola bo‘ylab uchadi. Ko‘prik arkalari, antennalar, avtomobil faralari — parabolaning xossalaridan foydalanadi. Daromadni maksimal qilish masalalari ham kvadrat funksiyaga keladi.",
    explain: "<span class='fb'>y = ax² + bx + c &nbsp; (a ≠ 0)</span><ul><li>Grafik — <b>parabola</b>. a > 0 — shoxlari yuqoriga, a < 0 — pastga.</li><li><b>Uchi:</b> x₀ = −[[b/(2a)]], y₀ = f(x₀) = −[[D/(4a)]].</li><li>Simmetriya o‘qi: x = x₀.</li><li>Oy bilan kesishish: (0; c).</li><li>Ox bilan kesishish: ax² + bx + c = 0 ning ildizlari (D ga qarab 0, 1 yoki 2 nuqta).</li></ul><p><b>Eng katta/kichik qiymat:</b> a > 0 da eng kichik qiymat y₀ (uchida), a < 0 da eng katta qiymat y₀.</p><p><b>To‘la kvadrat ajratish:</b> y = x² − 4x + 1 = (x − 2)² − 3 → uchi (2; −3).</p>",
    rule: "Uchi: x₀ = −b/(2a), y₀ = −D/(4a). a > 0 → min, a < 0 → max.",
    tip: "c — Oy bilan kesishish nuqtasi; b ning ishorasi a bilan birga uchning chap/o‘ngda ekanini bildiradi.",
    demos: [{ type: "fgraph", kind: "quad" }],
    ex: [
      ["y = −x² + 6x − 5 ning eng katta qiymati?", ["a = −1 < 0 → uchida max", "x₀ = −6/(−2) = 3", "y₀ = −9 + 18 − 5 = 4"], "4"],
      ["Perimetri 24 m bo‘lgan to‘rtburchakning eng katta yuzi?", ["Tomonlar x va 12 − x, S = x(12 − x) = −x² + 12x", "x₀ = 6 → S = 36"], "36 m²"]
    ],
    qz: [
      ["y = x² − 2x − 3 uchining koordinatalari?", ["(1; −4)", "(−1; 0)", "(2; −3)", "(1; 4)"], "x₀ = 1, y₀ = 1 − 2 − 3."],
      ["y = 2x² + 3 ning eng kichik qiymati?", ["3", "0", "2", "−3"], "x = 0 da."],
      ["y = −x² + 4 parabola Ox ni nechta nuqtada kesadi?", ["2", "1", "0", "4"], "x = ±2."]
    ]
  });
  add("1.12.4", {
    life: "Aralash bo‘lim — funksiyalarga oid turli masalalar: grafik bo‘yicha xossa aniqlash, funksiyalar tarkibi, qiymat hisoblash. Bu mavzu oldingi bilimlarni birlashtiradi.",
    explain: "<p><b>Tipik topshiriqlar:</b></p><ul><li><b>Qiymat hisoblash:</b> f(x) = 2x² − 3 bo‘lsa, f(−2) = 2·4 − 3 = 5.</li><li><b>Murakkab funksiya:</b> f(g(x)) — avval g, keyin f. f(x) = x², g(x) = x + 1 → f(g(x)) = (x + 1)², g(f(x)) = x² + 1.</li><li><b>Funksiyani tiklash:</b> f(x + 1) = x² bo‘lsa, t = x + 1 → x = t − 1 → f(t) = (t − 1)².</li><li><b>Grafik almashtirishlar:</b> y = f(x) + a — yuqoriga a birlik; y = f(x − a) — o‘ngga a birlik; y = −f(x) — Ox ga nisbatan aks; y = f(−x) — Oy ga nisbatan aks; y = |f(x)| — Ox dan pastdagi qism yuqoriga ko‘chiriladi.</li><li><b>Kesishish nuqtalari:</b> f(x) = g(x) tenglamani yechish.</li></ul>",
    rule: "f(x − a) — o‘ngga, f(x) + a — yuqoriga suriladi.",
    tip: "f(x − 2) grafigi CHAPGA emas, O‘NGGA 2 birlik suriladi.",
    demos: [{ type: "fgraph", kind: "abs", title: "Grafikni surish: m va n" }],
    ex: [
      ["f(x) = 3x − 1, g(x) = x². f(g(2)) va g(f(2)) ni toping.", ["g(2) = 4 → f(4) = 11", "f(2) = 5 → g(5) = 25"], "11 va 25"],
      ["f(2x − 1) = 4x + 3. f(x) ni toping.", ["t = 2x − 1 → x = (t + 1)/2", "f(t) = 4·(t + 1)/2 + 3 = 2t + 5"], "f(x) = 2x + 5"]
    ],
    qz: [
      ["f(x) = x² − x. f(−1) = ?", ["2", "0", "−2", "1"], "1 + 1 = 2."],
      ["y = x² grafigi 3 birlik o‘ngga surilsa?", ["y = (x − 3)²", "y = (x + 3)²", "y = x² + 3", "y = x² − 3"], "f(x − 3)."],
      ["f(x + 1) = x + 5 bo‘lsa, f(3) = ?", ["7", "8", "9", "4"], "x + 1 = 3 → x = 2 → 7."]
    ]
  });
  add("1.12.5", {
    life: "Selsiy → Farengeyt: F = 1,8C + 32. Teskarisi: C = (F − 32)/1,8. Teskari funksiya “qaytarish” amali: natijadan boshlang‘ich qiymatni topish.",
    explain: "<p>Agar y = f(x) har bir y uchun bitta x beradigan (o‘zaro bir qiymatli, masalan monoton) funksiya bo‘lsa, unga <b>teskari funksiya</b> x = f⁻¹(y) mavjud.</p><p><b>Topish usuli:</b></p><ol><li>y = f(x) dan x ni y orqali ifodalang.</li><li>x va y o‘rnini almashtiring.</li></ol><p><b>Misol:</b> y = 2x + 3 → x = (y − 3)/2 → f⁻¹(x) = [[(x − 3)/2]].</p><p><b>Xossalari:</b> D(f⁻¹) = E(f), E(f⁻¹) = D(f); f(f⁻¹(x)) = x; grafiklar <b>y = x</b> ga nisbatan simmetrik.</p><p>Muhim juftliklar: y = aˣ ⇄ y = logₐx; y = x² (x ≥ 0) ⇄ y = √x.</p>",
    rule: "Teskari funksiya: x ni y orqali ifodalab, x va y o‘rnini almashtiring.",
    tip: "y = x² butun sonlar o‘qida teskari funksiyaga ega emas — faqat x ≥ 0 (yoki x ≤ 0) da.",
    demos: [{ type: "fgraph", kind: "inverse" }],
    ex: [
      ["f(x) = [[(2x − 1)/3]] ga teskari funksiyani toping.", ["y = (2x − 1)/3 → 3y = 2x − 1 → x = (3y + 1)/2", "O‘rnini almashtiramiz"], "f⁻¹(x) = [[(3x + 1)/2]]"],
      ["f(x) = x³ + 1 bo‘lsa, f⁻¹(9) = ?", ["f(x) = 9 → x³ = 8 → x = 2"], "2"]
    ],
    qz: [
      ["y = 3x ga teskari funksiya?", ["y = [[x/3]]", "y = −3x", "y = [[3/x]]", "y = x − 3"], "x = y/3."],
      ["f(x) = 2x − 4. f⁻¹(0) = ?", ["2", "−4", "0", "4"], "2x − 4 = 0."],
      ["y = 2ˣ ga teskari funksiya?", ["y = log₂x", "y = x²", "y = √x", "y = 2⁻ˣ"], "Ko‘rsatkichli ⇄ logarifmik."]
    ]
  });

  // ===== 1.13 Ko'rsatkichli =====
  add("1.13.1", {
    life: "Koronavirus tarqalishi, aholining o‘sishi, bankdagi foizlar, radioaktiv yemirilish — hammasi ko‘rsatkichli funksiya y = aˣ bilan tasvirlanadi. U boshqa har qanday funksiyadan tezroq o‘sadi.",
    explain: "<span class='fb'>y = aˣ, &nbsp; a > 0, a ≠ 1</span><ul><li>Aniqlanish sohasi: barcha haqiqiy sonlar.</li><li>Qiymatlar sohasi: y > 0 (grafik doim Ox dan yuqorida).</li><li>Grafik (0; 1) nuqtadan o‘tadi, chunki a⁰ = 1.</li><li>a > 1 — o‘suvchi; 0 < a < 1 — kamayuvchi.</li></ul><p><b>Monotonlik — asosiy qurol:</b></p><ul><li>a > 1 bo‘lsa: aˣ¹ < aˣ² ⇔ x₁ < x₂;</li><li>0 < a < 1 bo‘lsa: aˣ¹ < aˣ² ⇔ x₁ > x₂ (belgi teskari).</li></ul><p><b>Taqqoslash:</b> 2^√3 va 2^1,7: √3 ≈ 1,732 > 1,7 → 2^√3 katta.</p>",
    rule: "aˣ > 0 doim. a > 1 → o‘suvchi, 0 < a < 1 → kamayuvchi. a⁰ = 1.",
    tip: "y = 2ˣ hech qachon 0 ga yoki manfiy songa teng bo‘lmaydi — 2ˣ = −4 ning yechimi yo‘q.",
    demos: [{ type: "fgraph", kind: "exp" }],
    ex: [
      ["Taqqoslang: (0,5)^(−2) va (0,5)^(−3)", ["Asos 0,5 < 1 → kamayuvchi", "−2 > −3 → (0,5)^(−2) < (0,5)^(−3)", "Tekshiruv: 4 < 8 ✓"], "(0,5)^(−2) < (0,5)^(−3)"],
      ["y = 3ˣ − 2 ning qiymatlar sohasi?", ["3ˣ > 0 → 3ˣ − 2 > −2"], "(−2; +∞)"]
    ],
    qz: [
      ["y = (1/3)ˣ funksiya qanday?", ["kamayuvchi", "o‘suvchi", "o‘zgarmas", "juft"], "Asos 1/3 < 1."],
      ["y = 5ˣ grafigi qaysi nuqtadan o‘tadi?", ["(0; 1)", "(1; 0)", "(0; 0)", "(0; 5)"], "5⁰ = 1."],
      ["y = 2ˣ + 1 ning qiymatlar sohasi?", ["(1; +∞)", "[1; +∞)", "(0; +∞)", "R"], "2ˣ > 0."]
    ]
  });
  add("1.13.2", {
    life: "“Bakteriyalar har soatda ikki barobar ko‘payadi. Qachon 1024 ta bo‘ladi?” — 2ᵗ = 1024 → t = 10. Ko‘rsatkichli tenglamalar o‘sish va kamayish jarayonlarining vaqtini topadi.",
    explain: "<p><b>Asosiy g‘oya:</b> aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ ⇔ f(x) = g(x) (a > 0, a ≠ 1).</p><p><b>Usullar:</b></p><ol><li><b>Bir xil asosga keltirish:</b> 8ˣ = 32 → 2³ˣ = 2⁵ → x = [[5/3]].</li><li><b>Umumiy ko‘paytuvchini chiqarish:</b> 3ˣ⁺¹ + 3ˣ = 36 → 3ˣ(3 + 1) = 36 → 3ˣ = 9 → x = 2.</li><li><b>Yangi o‘zgaruvchi:</b> 4ˣ − 3·2ˣ + 2 = 0 → 2ˣ = t > 0 → t² − 3t + 2 = 0 → t = 1, 2 → x = 0, 1.</li><li><b>Bir jinsli:</b> 9ˣ + 6ˣ = 2·4ˣ → 4ˣ ga bo‘lib, t = (3/2)ˣ.</li><li><b>Logarifmlash:</b> 3ˣ = 7 → x = log₃7.</li></ol>",
    rule: "aᶠ = aᵍ ⇔ f = g. Yangi o‘zgaruvchi t = aˣ > 0 — manfiy t ni tashlang!",
    tip: "t = 2ˣ almashtirishda t ≤ 0 chiqqan ildizlar javobga kirmaydi.",
    ex: [
      ["Yeching: 2ˣ⁺² − 2ˣ = 24", ["2ˣ(2² − 1) = 24 → 3·2ˣ = 24", "2ˣ = 8 → x = 3"], "x = 3"],
      ["Yeching: 9ˣ − 4·3ˣ + 3 = 0", ["3ˣ = t > 0: t² − 4t + 3 = 0", "t = 1 → x = 0; t = 3 → x = 1"], "0 va 1"]
    ],
    qz: [
      ["5^(x − 1) = 125 → x = ?", ["4", "3", "2", "5"], "x − 1 = 3."],
      ["(1/2)ˣ = 16 → x = ?", ["−4", "4", "8", "−8"], "2⁻ˣ = 2⁴."],
      ["4ˣ = 2^(x + 3) → x = ?", ["3", "1", "6", "−3"], "2x = x + 3."]
    ]
  });
  add("1.13.3", {
    life: "“Omonat qachondan boshlab 2 mln dan oshadi?” — ko‘rsatkichli tengsizlik. Bu yerda bitta “tuzoq” bor: asos 1 dan kichik bo‘lsa, belgi teskarisiga o‘zgaradi.",
    explain: "<span class='fb'>a > 1: &nbsp; aᶠ > aᵍ ⇔ f > g</span><span class='fb'>0 < a < 1: &nbsp; aᶠ > aᵍ ⇔ f < g</span><p><b>Yechish:</b> ikkala tomonni bir xil asosga keltiramiz, asosga qarab belgini saqlaymiz yoki almashtiramiz.</p><p><b>Misollar:</b></p><ul><li>2ˣ > 8 → 2ˣ > 2³ → x > 3.</li><li>(1/3)ˣ ≤ 9 → (1/3)ˣ ≤ (1/3)⁻² → x ≥ −2 (belgi o‘zgardi).</li></ul><p>Yangi o‘zgaruvchi kiritilsa (t = aˣ), t > 0 shartini hisobga oling.</p><p>aˣ > −5 — barcha x da to‘g‘ri; aˣ < 0 — yechim yo‘q.</p>",
    rule: "Asos > 1 → belgi saqlanadi; 0 < asos < 1 → belgi o‘zgaradi.",
    tip: "0,5ˣ > 0,25 → x < 2 (belgi teskari!). Ko‘pchilik x > 2 deb xato qiladi.",
    ex: [
      ["Yeching: 3^(2x − 1) < 27", ["3^(2x − 1) < 3³, asos 3 > 1", "2x − 1 < 3 → x < 2"], "(−∞; 2)"],
      ["Yeching: (0,2)^(x + 1) ≥ 25", ["25 = (0,2)⁻²", "Asos 0,2 < 1 → belgi o‘zgaradi: x + 1 ≤ −2", "x ≤ −3"], "(−∞; −3]"]
    ],
    qz: [
      ["2ˣ ≥ 16 → ?", ["x ≥ 4", "x ≤ 4", "x ≥ 8", "x > 4"], "2ˣ ≥ 2⁴."],
      ["(1/2)ˣ < 4 → ?", ["x > −2", "x < −2", "x > 2", "x < 2"], "(1/2)ˣ < (1/2)⁻², belgi o‘zgaradi."],
      ["5ˣ > −1 → ?", ["barcha x", "x > 0", "yechim yo‘q", "x > −1"], "5ˣ > 0 > −1."]
    ]
  });

  // ===== 1.14 Logarifm =====
  add("1.14.1", {
    life: "Zilzila kuchi (Rixter shkalasi), tovush balandligi (detsibel), kislotalik (pH) — logarifmik shkalalar. Logarifm “necha marta ko‘paytirish kerak?” degan savolga javob beradi.",
    explain: "<p><b>Ta’rif:</b> logₐb — b sonini hosil qilish uchun a ni ko‘tarish kerak bo‘lgan daraja:</p><span class='fb'>logₐb = c ⇔ aᶜ = b &nbsp; (a > 0, a ≠ 1, b > 0)</span><p>log₂8 = 3, chunki 2³ = 8. log₁₀ = lg (o‘nli), logₑ = ln (natural).</p><p><b>Funksiya y = logₐx:</b></p><ul><li>Aniqlanish sohasi: x > 0.</li><li>Qiymatlar sohasi: barcha haqiqiy sonlar.</li><li>Grafik (1; 0) dan o‘tadi: logₐ1 = 0; shuningdek logₐa = 1.</li><li>a > 1 — o‘suvchi, 0 < a < 1 — kamayuvchi.</li><li>y = aˣ ga teskari: grafiklari y = x ga simmetrik.</li></ul><p><b>Asosiy ayniyat:</b> a^(logₐb) = b.</p>",
    rule: "logₐb = c ⇔ aᶜ = b. logₐ1 = 0, logₐa = 1, a^(logₐb) = b.",
    tip: "Logarifm ostidagi son doim musbat: log₂(−4) mavjud emas. Asos ham musbat va 1 ga teng emas.",
    demos: [{ type: "fgraph", kind: "log", both: true, title: "y = aˣ va y = logₐx — o‘zaro teskari funksiyalar" }],
    ex: [
      ["Hisoblang: log₃81 + log₂[[1/8]] − lg 0,01", ["log₃81 = 4 (3⁴ = 81)", "log₂(1/8) = −3", "lg 0,01 = −2", "4 − 3 + 2 = 3"], "3"],
      ["y = log₂(6 − 2x) ning aniqlanish sohasi?", ["6 − 2x > 0 → x < 3"], "(−∞; 3)"]
    ],
    qz: [
      ["log₅125 = ?", ["3", "25", "5", "2"], "5³ = 125."],
      ["7^(log₇ 9) = ?", ["9", "7", "63", "log₇9"], "Asosiy ayniyat."],
      ["y = log₀,₅ x funksiya qanday?", ["kamayuvchi", "o‘suvchi", "juft", "davriy"], "Asos 0,5 < 1."]
    ]
  });
  add("1.14.2", {
    life: "Logarifmlar ko‘paytirishni qo‘shishga aylantiradi — kalkulyatorlar paydo bo‘lgunga qadar muhandislar aynan shu xossa yordamida hisoblagan. DTMda logarifmik ifodalarni hisoblash juda ko‘p uchraydi.",
    explain: "<span class='fb'>logₐ(bc) = logₐb + logₐc</span><span class='fb'>logₐ(b/c) = logₐb − logₐc</span><span class='fb'>logₐ(bⁿ) = n·logₐb</span><span class='fb'>log_(aᵏ) b = [[1/k]]·logₐb</span><span class='fb'>logₐb = [[log_c b / log_c a]] &nbsp; (yangi asosga o‘tish)</span><span class='fb'>logₐb = [[1/(log_b a)]], &nbsp; logₐb · log_b c = logₐc</span><p><b>Misollar:</b> lg 2 + lg 5 = lg 10 = 1; log₂12 − log₂3 = log₂4 = 2; log₄8 = log_(2²)2³ = [[3/2]].</p>",
    rule: "Ko‘paytma → yig‘indi, bo‘linma → ayirma, daraja → ko‘paytuvchi. Yangi asos: logₐb = log b / log a.",
    tip: "log(a + b) ≠ log a + log b! Faqat ko‘paytmaning logarifmi yig‘indiga ajraladi.",
    ex: [
      ["Hisoblang: log₆4 + log₆9", ["log₆(4 · 9) = log₆36", "= 2"], "2"],
      ["Hisoblang: 3^(2 + log₃5)", ["3² · 3^(log₃5)", "= 9 · 5 = 45"], "45"]
    ],
    qz: [
      ["lg 25 + lg 4 = ?", ["2", "29", "lg 29", "100"], "lg 100 = 2."],
      ["log₂48 − log₂3 = ?", ["4", "16", "45", "log₂45"], "log₂16."],
      ["log₂3 · log₃8 = ?", ["3", "8", "log₂24", "1"], "log₂8 = 3."]
    ]
  });
  add("1.14.3", {
    life: "“Aholi yiliga 2% o‘ssa, qachon ikki baravar ko‘payadi?” — 1,02ᵗ = 2 → t = log₁,₀₂2 ≈ 35 yil. Logarifmik tenglamalar noma’lum darajani topadi.",
    explain: "<p><b>Asosiy turlari:</b></p><ol><li><b>logₐf(x) = b</b> ⇔ f(x) = aᵇ.</li><li><b>logₐf(x) = logₐg(x)</b> ⇔ f(x) = g(x), shart: f(x) > 0 (yoki g(x) > 0).</li><li><b>Xossalar orqali:</b> log₂x + log₂(x − 2) = 3 → log₂(x(x − 2)) = 3 → x² − 2x = 8 (ATS: x > 2).</li><li><b>Yangi o‘zgaruvchi:</b> log₂²x − 3log₂x + 2 = 0 → t = log₂x.</li></ol><p><b>ATS (eng muhim!):</b> logarifm ostidagi barcha ifodalar > 0, asos > 0 va ≠ 1.</p><p>Xossalarni qo‘llaganda ATS kengayishi mumkin, shuning uchun javobni dastlabki tenglama ATSiga tekshiring.</p>",
    rule: "logₐf = b ⇔ f = aᵇ. Javobni ATSga (f > 0) tekshirish shart!",
    tip: "log₂x + log₂(x − 2) = 3 da x = −2 ham chiqadi, lekin u ATSga kirmaydi.",
    ex: [
      ["Yeching: log₃(2x − 1) = 2", ["2x − 1 = 3² = 9", "x = 5 (ATS: 2·5 − 1 > 0 ✓)"], "x = 5"],
      ["Yeching: log₂x + log₂(x − 2) = 3", ["ATS: x > 2", "x(x − 2) = 8 → x² − 2x − 8 = 0", "x = 4 yoki x = −2 (ATSga kirmaydi)"], "x = 4"]
    ],
    qz: [
      ["log₂(x + 3) = 4 → x = ?", ["13", "5", "1", "16"], "x + 3 = 16."],
      ["lg x = −1 → x = ?", ["0,1", "−10", "10", "−0,1"], "x = 10⁻¹."],
      ["log₅(x² − 4) = log₅(3x) → x = ?", ["4", "−1", "4 va −1", "yechim yo‘q"], "x² − 3x − 4 = 0; x = −1 da 3x < 0."]
    ]
  });
  add("1.14.4", {
    life: "Logarifmik tengsizliklar ko‘rsatkichli tengsizliklarga o‘xshaydi: asos 1 dan katta yoki kichikligi belgini hal qiladi. Ammo bu yerda ATS yanada muhimroq.",
    explain: "<span class='fb'>a > 1: logₐf > logₐg ⇔ f > g > 0</span><span class='fb'>0 < a < 1: logₐf > logₐg ⇔ 0 < f < g</span><p><b>Yechish rejasi:</b></p><ol><li>ATS: logarifm ostidagi ifodalar > 0.</li><li>O‘ng tomonni ham logarifm qiling: 2 = log₃9.</li><li>Asosga qarab belgini saqlang yoki almashtiring.</li><li>ATS bilan kesishmasini oling.</li></ol><p><b>Misol:</b> log₀,₅(x − 1) > −2 → ATS x > 1; −2 = log₀,₅4; asos < 1 → x − 1 < 4 → x < 5. Javob: (1; 5).</p>",
    rule: "Asos > 1 → belgi saqlanadi, 0 < asos < 1 → o‘zgaradi. ATS bilan kesishma — majburiy.",
    tip: "log₂x < 3 javobi x < 8 emas, (0; 8) — chunki x > 0 bo‘lishi shart.",
    ex: [
      ["Yeching: log₂(x − 3) < 2", ["ATS: x > 3", "x − 3 < 4 → x < 7", "Kesishma: 3 < x < 7"], "(3; 7)"],
      ["Yeching: log_(1/3)(2x + 1) ≥ −1", ["ATS: x > −[[1/2]]", "−1 = log_(1/3)3; asos < 1 → 2x + 1 ≤ 3 → x ≤ 1", "Kesishma: −[[1/2]] < x ≤ 1"], "(−0,5; 1]"]
    ],
    qz: [
      ["log₃x > 2 → ?", ["x > 9", "x > 6", "0 < x < 9", "x > 8"], "x > 3²."],
      ["log₀,₅x > 1 → ?", ["0 < x < 0,5", "x > 0,5", "x < 0,5", "x > 2"], "Asos < 1, belgi o‘zgaradi, ATS x > 0."],
      ["lg(x − 1) ≤ 0 → ?", ["(1; 2]", "x ≤ 2", "(1; +∞)", "[2; +∞)"], "0 < x − 1 ≤ 1."]
    ]
  });
})();
