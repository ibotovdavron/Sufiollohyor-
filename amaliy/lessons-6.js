/* 6-sinf Matematika — 1-chorak mavzulari. */
window.AMALIY_ADD("6", "6-sinf", {
  id: "matematika", name: "Matematika", icon: "🧮", color: "#3b82f6",
  topics: [
    {
      id: "algebraik-ifoda", title: "Algebraik ifodalar", tag: "Harflar bilan ifoda tuzish",
      life: "Daftar narxi <b>x</b> so‘m, ruchka narxi <b>y</b> so‘m. 3 ta daftar va 2 ta ruchka narxi: <b>3x + 2y</b>. Narxlar o‘zgarsa ham, ifoda o‘zgarmaydi — faqat harflar o‘rniga yangi sonlarni qo‘yamiz. Formulalar shu tarzda ishlaydi.",
      explain: "<p><b>Algebraik ifoda</b> — sonlar, harflar (o‘zgaruvchilar) va amal belgilaridan tuzilgan yozuv: 2a + 5, 3(x − 1), [[a/2]].</p><p>Harf <b>noma’lum yoki o‘zgaruvchan miqdorni</b> bildiradi. Son va harf orasidagi ko‘paytirish belgisi odatda yozilmaydi: 3 · x = 3x.</p><p>Ifoda tuzishda so‘zlarni belgiga aylantiramiz: “a dan 5 ta ko‘p” → a + 5, “b ning 3 marta ortig‘i” → 3b, “x va y yig‘indisining yarmi” → (x + y) : 2.</p>",
      rule: "Ko‘paytirish belgisi son va harf orasida tushirib qoldiriladi: 4 · a = 4a, a · b = ab.",
      demos: [{ type: "exprValue", items: [
        { story: "Do‘konda <b>x</b> — daftar, <b>y</b> — ruchka narxi (ming so‘mda). 3 daftar va 2 ruchka narxi:", display: "3x + 2y", vars: { x: [1, 10, 4, "Daftar narxi x"], y: [1, 10, 3, "Ruchka narxi y"] }, fn: (v) => 3 * v.x + 2 * v.y, unit: "ming so‘m", draw: "items", count: { x: 3, y: 2 }, icons: ["📒", "🖊️"] },
        { story: "To‘g‘ri to‘rtburchakli bog‘ning uzunligi <b>a</b>, eni <b>b</b> metr. Atrofini o‘rash uchun to‘siq uzunligi (perimetr):", display: "2(a + b)", vars: { a: [2, 12, 8, "Uzunlik a"], b: [1, 6, 4, "En b"] }, fn: (v) => 2 * (v.a + v.b), unit: "m", draw: "rect" }
      ] }],
      examples: [
        { q: "“x sonining 4 marta ortig‘idan 7 ni ayiring” ni ifoda bilan yozing.", steps: ["x ning 4 marta ortig‘i: 4x", "7 ni ayiramiz: 4x − 7"], a: "4x − 7" },
        { q: "Ota a yoshda, o‘g‘li otasidan 26 yosh kichik. Ikkalasining yoshlari yig‘indisi?", steps: ["O‘g‘li: a − 26", "Yig‘indi: a + (a − 26) = 2a − 26"], a: "2a − 26" }
      ],
      quiz: [
        { q: "“b dan 8 ta kam” ifodasi?", o: ["b − 8", "8 − b", "8b", "b + 8"], e: "b dan kam → b − 8." },
        { q: "Kvadrat tomoni a. Perimetri?", o: ["4a", "a²", "a + 4", "2a"], e: "To‘rt tomon yig‘indisi: a + a + a + a = 4a." },
        { q: "5 · m · 3 qisqacha qanday yoziladi?", o: ["15m", "53m", "8m", "5m3"], e: "Sonlar ko‘paytiriladi: 5 · 3 = 15." }
      ]
    },
    {
      id: "soddalashtirish", title: "Algebraik ifodalarni soddalashtirish", tag: "O‘xshash hadlarni ixchamlash",
      life: "Savatda 3 ta olma va 2 ta nok bor, yana 4 ta olma va 1 ta nok qo‘shdik. Jami: 7 ta olma va 3 ta nok. Olmani nokka qo‘shib bo‘lmaydi! Algebrada ham shunday: 3x + 2y + 4x + y = 7x + 3y.",
      explain: "<p>Harfiy qismi bir xil bo‘lgan qo‘shiluvchilar <b>o‘xshash hadlar</b> deyiladi: 3x va −5x, 2y va y, 7 va −4.</p><p>O‘xshash hadlarni ixchamlash uchun ularning <b>koeffitsiyentlarini</b> (oldidagi sonlarini) qo‘shamiz, harfiy qismni o‘zgartirmaymiz: 3x − 5x = −2x.</p><p>Qavsli ifodalarda avval qavsni ochamiz: 2(x + 3) = 2x + 6, −(a − 4) = −a + 4.</p>",
      rule: "ax + bx = (a + b)x. Turli harfli hadlar qo‘shilmaydi: 3x + 2y — bundan soddaroq bo‘lmaydi.",
      demos: [{ type: "likeTerms", examples: ["3x + 2y + 4x + y", "5x − 2 + x + 7", "2x + 3y − x − 3y + 4", "4y − 2x + 3 − y + 5x − 1"] }],
      examples: [
        { q: "6a − 2b + a + 5b ni soddalashtiring.", steps: ["a lar: 6a + a = 7a", "b lar: −2b + 5b = 3b"], a: "7a + 3b" },
        { q: "3(x + 2) − x ni soddalashtiring.", steps: ["Qavsni ochamiz: 3x + 6 − x", "3x − x = 2x"], a: "2x + 6" }
      ],
      quiz: [
        { q: "5x + 3x = ?", o: ["8x", "15x", "8x²", "8"], e: "Koeffitsiyentlar qo‘shiladi: 5 + 3 = 8." },
        { q: "7y − 7y + 2 = ?", o: ["2", "14y + 2", "0", "2y"], e: "7y − 7y = 0." },
        { q: "2(a − 4) + 3a = ?", o: ["5a − 8", "5a − 4", "6a − 8", "a − 8"], e: "2a − 8 + 3a = 5a − 8." }
      ]
    },
    {
      id: "ifoda-qiymati", title: "Algebraik ifodalarning qiymatini topish", tag: "Harf o‘rniga son qo‘yish",
      life: "Taksi narxi formulasi: <b>5 000 + 2 000k</b> so‘m, bu yerda k — kilometrlar soni. 7 km yursangiz: 5 000 + 2 000 · 7 = 19 000 so‘m. Telefon tarifi, elektr hisobi — hammasi algebraik ifodalar!",
      explain: "<p>Ifodaning qiymatini topish uchun:</p><ol><li>Harf o‘rniga uning qiymatini <b>qavs ichida</b> qo‘yamiz.</li><li>Amallar tartibiga rioya qilib hisoblaymiz.</li></ol><p>Avval ifodani soddalashtirsak, hisob osonlashadi: 3a + 7a − 5a ni a = 12 da hisoblash o‘rniga 5a = 5 · 12 = 60.</p>",
      rule: "Harf o‘rniga qo‘yilgan son qavsga olinadi — ayniqsa manfiy son bo‘lsa: x = −3 da 2x² = 2 · (−3)² = 18.",
      demos: [{ type: "exprValue", items: [
        { story: "Taksi narxi: chiqish 5 ming so‘m va har km uchun 2 ming so‘m. <b>k</b> — kilometrlar soni:", display: "5 + 2k", vars: { k: [1, 30, 7, "Masofa k (km)"] }, fn: (v) => 5 + 2 * v.k, unit: "ming so‘m" },
        { story: "Ifodaning qiymatini toping:", display: "3a − 2b + 10", vars: { a: [-10, 10, 4, "a"], b: [-10, 10, 5, "b"] }, fn: (v) => 3 * v.a - 2 * v.b + 10 },
        { story: "Jism bosib o‘tgan yo‘l: tezlik <b>v</b> (km/soat) va vaqt <b>t</b> (soat):", display: "v · t", vars: { v: [10, 120, 60, "Tezlik v"], t: [1, 8, 3, "Vaqt t"] }, fn: (q) => q.v * q.t, unit: "km" }
      ] }],
      examples: [
        { q: "4x − 3 ning qiymatini x = 2,5 da toping.", steps: ["4 · 2,5 = 10", "10 − 3 = 7"], a: "7" },
        { q: "a + 2b ni a = −4, b = 6 da hisoblang.", steps: ["(−4) + 2 · 6", "−4 + 12 = 8"], a: "8" }
      ],
      quiz: [
        { q: "5m + 1 ning qiymati m = 3 da?", o: ["16", "54", "9", "15"], e: "5 · 3 + 1 = 16." },
        { q: "x² − x qiymati x = 4 da?", o: ["12", "4", "16", "8"], e: "16 − 4 = 12." },
        { q: "2(a + b), a = 7, b = 3 da?", o: ["20", "17", "13", "10"], e: "2 · 10 = 20." }
      ]
    },
    {
      id: "tenglama", title: "Tenglamalarni yechish", tag: "Tarozi qoidasi",
      life: "Tarozining bir pallasida 3 ta bir xil qadoq va 5 kg tosh, ikkinchisida 20 kg bor, tarozi muvozanatda. Bitta qadoq necha kg? 3x + 5 = 20. Ikkala pallaga bir xil o‘zgarish qilsak, muvozanat saqlanadi — tenglama yechishning butun siri shu!",
      explain: "<p><b>Tenglama</b> — noma’lum qatnashgan tenglik. Uni yechish — noma’lumning tenglikni to‘g‘ri qiladigan qiymatini topish.</p><p>Asosiy qoidalar:</p><ol><li>Tenglikning <b>ikkala tomoniga bir xil son qo‘shish yoki ayirish</b> mumkin.</li><li>Ikkala tomonni <b>bir xil (0 dan farqli) songa ko‘paytirish yoki bo‘lish</b> mumkin.</li><li>Qo‘shiluvchini bir tomondan ikkinchisiga o‘tkazganda <b>ishorasi teskarisiga</b> o‘zgaradi.</li></ol><p>Oxirida albatta <b>tekshiring</b>: topilgan sonni tenglamaga qo‘yib ko‘ring.</p>",
      rule: "3x + 5 = 20 → 3x = 20 − 5 → 3x = 15 → x = 15 : 3 = 5",
      demos: [{ type: "balance", examples: [[3, 5, 0, 20], [2, -4, 0, 10], [5, 3, 2, 18], [4, 7, 1, 31]] }],
      examples: [
        { q: "7x − 9 = 40", steps: ["−9 ni o‘ngga o‘tkazamiz: 7x = 40 + 9", "7x = 49", "x = 49 : 7"], a: "x = 7" },
        { q: "5x + 4 = 3x + 18", steps: ["x li hadlar chapga, sonlar o‘ngga: 5x − 3x = 18 − 4", "2x = 14", "x = 7"], a: "x = 7" }
      ],
      quiz: [
        { q: "x + 12 = 30, x = ?", o: ["18", "42", "2,5", "360"], e: "x = 30 − 12." },
        { q: "4x = 52, x = ?", o: ["13", "48", "208", "56"], e: "x = 52 : 4." },
        { q: "2x − 6 = 10, x = ?", o: ["8", "2", "16", "4"], e: "2x = 16, x = 8." }
      ]
    },
    {
      id: "kasr-bol-natural", title: "To‘g‘ri kasrni natural songa bo‘lish", tag: "Maxraj ko‘payadi",
      life: "Tortning [[3/4]] qismi qoldi, uni 2 kishi teng bo‘lishdi. Har biriga [[3/4]] : 2 = [[3/8]] qism tort tegadi. Qism kichikroq bo‘laklarga bo‘linadi — maxraj kattalashadi.",
      explain: "<p>[[3/4]] ni 2 ga bo‘lish — har bir chorakni yana 2 ga bo‘lish demak. Endi tort 8 bo‘lakka bo‘lingan va har kimda 3 tadan bo‘lak bor.</p><p>Agar surat bo‘luvchiga bo‘linsa, suratni bo‘lish ham mumkin: [[6/7]] : 3 = [[2/7]].</p>",
      rule: "[[a/b]] : n = [[a/b·n]]",
      demos: [{ type: "fracDivide", mode: "fracNat" }],
      examples: [
        { q: "[[4/5]] : 3 = ?", steps: ["Maxrajni 3 ga ko‘paytiramiz: 5 · 3 = 15", "[[4/15]]"], a: "[[4/15]]" },
        { q: "[[8/9]] l sharbat 4 stakanga teng quyildi. Har stakanda?", steps: ["[[8/9]] : 4 = [[8/36]]", "Qisqartiramiz: [[2/9]]"], a: "[[2/9]] l" }
      ],
      quiz: [
        { q: "[[1/2]] : 4 = ?", o: ["[[1/8]]", "2", "[[4/2]]", "[[1/6]]"], e: "2 · 4 = 8." },
        { q: "[[6/7]] : 2 = ?", o: ["[[3/7]]", "[[12/14]]", "[[12/7]]", "[[6/9]]"], e: "[[6/14]] = [[3/7]]." },
        { q: "[[2/3]] : 5 = ?", o: ["[[2/15]]", "[[10/3]]", "[[2/8]]", "[[7/3]]"], e: "3 · 5 = 15." }
      ]
    },
    {
      id: "natural-bol-kasr", title: "Natural sonni to‘g‘ri kasrga bo‘lish", tag: "Nechta bo‘lak sig‘adi?",
      life: "3 kg guruchni [[1/2]] kg dan paketlarga joylasak, nechta paket bo‘ladi? 3 : [[1/2]] = 6 ta. Kasrga bo‘lganda natija bo‘linuvchidan <b>katta</b> chiqishi mumkin — bu g‘alati emas!",
      explain: "<p>n : [[a/b]] savoli: “n ning ichiga [[a/b]] nechta sig‘adi?”</p><p>1 ning ichiga [[1/4]] to‘rtta sig‘adi, 3 ning ichiga — 12 ta. [[3/4]] esa 3 marta kattaroq, demak 12 : 3 = 4 ta sig‘adi.</p><p>Shuning uchun qoida: bo‘luvchini <b>teskari kasrga</b> almashtirib, ko‘paytiramiz: 3 : [[3/4]] = 3 · [[4/3]] = 4.</p>",
      rule: "n : [[a/b]] = n · [[b/a]]",
      demos: [{ type: "fracDivide", mode: "natFrac" }],
      examples: [
        { q: "5 : [[1/3]] = ?", steps: ["Teskari kasr: [[3/1]] = 3", "5 · 3 = 15"], a: "15" },
        { q: "6 m lentadan [[3/4]] m li bo‘laklar kesildi. Nechta bo‘lak?", steps: ["6 : [[3/4]] = 6 · [[4/3]]", "[[24/3]] = 8"], a: "8 ta" }
      ],
      quiz: [
        { q: "2 : [[1/5]] = ?", o: ["10", "[[2/5]]", "[[1/10]]", "7"], e: "2 · 5 = 10." },
        { q: "4 : [[2/3]] = ?", o: ["6", "[[8/3]]", "[[2/12]]", "12"], e: "4 · [[3/2]] = 6." },
        { q: "[[2/7]] ning teskari kasri?", o: ["[[7/2]]", "[[2/7]]", "[[−2/7]]", "[[1/7]]"], e: "Surat va maxraj o‘rin almashadi." }
      ]
    },
    {
      id: "kasr-bol-kasr", title: "To‘g‘ri kasrni to‘g‘ri kasrga bo‘lish", tag: "Teskari kasrga ko‘paytirish",
      life: "Idishda [[3/4]] l sharbat bor. [[1/8]] l li kichik stakanlarga quysak, nechta stakan to‘ladi? [[3/4]] : [[1/8]] = 6 ta. Oshpazlar va farmatsevtlar bunday hisobni har kuni qilishadi.",
      explain: "<p>Bo‘lish — bo‘luvchini teskarisiga ko‘paytirish: [[a/b]] : [[c/d]] = [[a/b]] · [[d/c]] = [[a·d/b·c]].</p><p>Nega? [[1/8]] ning ichida 1 sakkizta sig‘adi, demak [[3/4]] ning ichida [[3/4]] · 8 = 6 ta sig‘adi.</p>",
      rule: "[[a/b]] : [[c/d]] = [[a·d/b·c]]",
      demos: [{ type: "fracDivide", mode: "fracFrac" }],
      examples: [
        { q: "[[5/6]] : [[2/3]] = ?", steps: ["[[5/6]] · [[3/2]]", "[[15/12]] = [[5/4]]", "= 1 [[1/4]]"], a: "1 [[1/4]]" },
        { q: "[[2/9]] : [[4/3]] = ?", steps: ["[[2/9]] · [[3/4]]", "Qisqartiramiz: [[1/3]] · [[1/2]]"], a: "[[1/6]]" }
      ],
      quiz: [
        { q: "[[1/2]] : [[1/4]] = ?", o: ["2", "[[1/8]]", "[[1/2]]", "4"], e: "[[1/2]] · 4 = 2." },
        { q: "[[3/5]] : [[3/10]] = ?", o: ["2", "[[9/50]]", "[[1/2]]", "3"], e: "[[3/5]] · [[10/3]] = 2." },
        { q: "[[2/3]] : [[5/6]] = ?", o: ["[[4/5]]", "[[5/9]]", "[[10/18]]", "1 [[1/4]]"], e: "[[2/3]] · [[6/5]] = [[12/15]] = [[4/5]]." }
      ]
    },
    {
      id: "masala-kasr-bolish", title: "Matnli masalalar (kasrlar)", tag: "Kasrlarni bo‘lishga doir masalalar",
      life: "Avtomobil [[3/4]] soatda 60 km yo‘l bosdi. Tezligi qancha? 60 : [[3/4]] = 80 km/soat. Kasrga bo‘lish tezlik, narx va ish unumi masalalarida kerak bo‘ladi.",
      explain: "<p>Masalada “1 birlikka qancha to‘g‘ri keladi?” deb so‘ralsa, umumiy miqdorni <b>kasrga bo‘lamiz</b>.</p><p>Tezlik = masofa : vaqt, narx = summa : miqdor, unum = ish : vaqt. Agar vaqt yoki miqdor kasr bo‘lsa — kasrga bo‘lish qoidasidan foydalanamiz.</p>",
      rule: "Qism ma’lum bo‘lsa butunni topish: M : [[a/b]] = M · [[b/a]]",
      demos: [{ type: "wordProblem", problems: [
        { text: "Velosipedchi [[2/3]] soatda 10 km yurdi. 1 soatda qancha yuradi?",
          bars: [{ label: "[[2/3]] soat", parts: [{ v: 1, t: "5 km", c: "#22c55e" }, { v: 1, t: "5 km", c: "#22c55e" }], total: "10 km" }, { label: "1 soat", parts: [1, 2, 3].map(() => ({ v: 1, t: "5 km", c: "#3b82f6" })), total: "?" }],
          steps: ["[[1/3]] soatda: 10 : 2 = 5 km", "1 soat = 3 ta [[1/3]] soat: 5 · 3 = 15 km", "Yoki: 10 : [[2/3]] = 10 · [[3/2]] = 15"], answer: "15 km/soat" },
        { text: "[[3/4]] kg pishloq 60 000 so‘m. 1 kg qancha turadi?",
          bars: [{ label: "[[3/4]] kg", parts: [1, 2, 3].map(() => ({ v: 1, t: "20 000", c: "#f59e0b" })), total: "60 000" }, { label: "1 kg", parts: [1, 2, 3, 4].map(() => ({ v: 1, t: "20 000", c: "#22c55e" })), total: "?" }],
          steps: ["[[1/4]] kg: 60 000 : 3 = 20 000", "1 kg: 20 000 · 4 = 80 000"], answer: "80 000 so‘m" }
      ] }],
      examples: [{ q: "Hovuzning [[2/5]] qismi 6 soatda to‘ldi. Butun hovuz necha soatda to‘ladi?", steps: ["6 : [[2/5]] = 6 · [[5/2]]", "= 15"], a: "15 soatda" }],
      quiz: [
        { q: "[[1/2]] soatda 30 km. Tezlik?", o: ["60 km/soat", "15 km/soat", "30 km/soat", "90 km/soat"], e: "30 : [[1/2]] = 60." },
        { q: "[[2/3]] m mato 12 000 so‘m. 1 m narxi?", o: ["18 000", "8 000", "24 000", "6 000"], e: "12 000 · [[3/2]] = 18 000." },
        { q: "Sonning [[3/7]] qismi 21. Son?", o: ["49", "9", "63", "147"], e: "21 : [[3/7]] = 21 · [[7/3]] = 49." }
      ]
    },
    {
      id: "nisbat-kasr", title: "Nisbatlar va kasrlar", tag: "Nisbatni oshirish va soddalashtirish",
      life: "Choy damlash: 1 qoshiq choy 4 stakan suvga. Mehmon ko‘paysa, nisbatni <b>oshiramiz</b>: 2 qoshiq — 8 stakan, 3 qoshiq — 12 stakan. Ta’m o‘zgarmaydi! Bo‘yoq aralashtirish, retseptlar, xarita masshtabi — hammasi nisbat.",
      explain: "<p><b>Nisbat</b> — ikki miqdorni taqqoslash: a : b (“a ning b ga nisbati”). Nisbat kasr bilan ham yoziladi: a : b = [[a/b]].</p><p>Nisbatning ikkala hadini <b>bir xil songa ko‘paytirsak</b> (nisbatni oshirsak) yoki bo‘lsak, nisbat o‘zgarmaydi: 2 : 3 = 4 : 6 = 10 : 15.</p><p>Nisbatni soddalashtirish — kasrni qisqartirish kabi: 12 : 18 = 2 : 3 (6 ga bo‘ldik).</p><p>Aralashmada qism ulushi: ko‘k : sariq = 2 : 3 bo‘lsa, ko‘k bo‘yoq butun aralashmaning [[2/5]] qismi.</p>",
      rule: "a : b = (a·k) : (b·k). Qism ulushi = [[a/a+b]].",
      demos: [{ type: "ratioMix", items: [["Ko‘k bo‘yoq", "Sariq bo‘yoq", "#2563eb", "#facc15", "qoshiq"], ["Sharbat", "Suv", "#f97316", "#7dd3fc", "stakan"], ["Qizil bo‘yoq", "Oq bo‘yoq", "#dc2626", "#f8fafc", "qoshiq"]] }],
      examples: [
        { q: "24 : 36 nisbatni soddalashtiring.", steps: ["EKUB(24; 36) = 12", "24 : 12 = 2, 36 : 12 = 3"], a: "2 : 3" },
        { q: "Pishiriq uchun un va shakar 5 : 2 nisbatda. 15 qoshiq un uchun qancha shakar kerak?", steps: ["Un 5 dan 15 ga — 3 marta oshdi", "Shakar ham 3 marta: 2 · 3 = 6"], a: "6 qoshiq" }
      ],
      quiz: [
        { q: "3 : 4 ga teng nisbat?", o: ["9 : 12", "4 : 3", "6 : 7", "3 : 8"], e: "Ikkala had 3 ga ko‘paytirildi." },
        { q: "10 : 25 soddalashtirilgani?", o: ["2 : 5", "1 : 2", "5 : 2", "2 : 3"], e: "5 ga bo‘lamiz." },
        { q: "Sinfda o‘g‘il : qiz = 2 : 3. Qizlar sinfning qancha qismi?", o: ["[[3/5]]", "[[2/3]]", "[[3/2]]", "[[2/5]]"], e: "3 : (2 + 3) = [[3/5]]." }
      ]
    },
    {
      id: "nisbat-masala", title: "Nisbatga doir matnli masalalar", tag: "Ulushlar usuli",
      life: "Ikki aka-uka 64 ta yong‘oqni 3 : 5 nisbatda bo‘lishdi. Kichigiga 24 ta, kattasiga 40 ta tegdi. Meros, foyda, materialni nisbat bo‘yicha taqsimlash — hayotda juda ko‘p uchraydi.",
      explain: "<p><b>Ulushlar usuli</b>:</p><ol><li>Jami ulushlar sonini topamiz: 3 + 5 = 8.</li><li>Bir ulush qiymati: jami : ulushlar soni = 64 : 8 = 8.</li><li>Har bir qism: ulushlar soni × bir ulush: 3 · 8 = 24, 5 · 8 = 40.</li></ol><p>Agar jami emas, <b>farq</b> berilsa (masalan, “kattasida 16 ta ko‘p”), farqni ulushlar farqiga bo‘lamiz: 16 : (5 − 3) = 8.</p>",
      rule: "Bir ulush = Jami : (ulushlar yig‘indisi) yoki Farq : (ulushlar farqi)",
      demos: [{ type: "ratioShare", parts: 2, names: ["Kichik uka", "Katta aka"], unit: "ta" }],
      examples: [
        { q: "Ip 4 : 7 nisbatda ikkiga kesildi, uzun bo‘lagi qisqasidan 15 sm uzun. Ip uzunligi?", steps: ["Ulushlar farqi: 7 − 4 = 3", "Bir ulush: 15 : 3 = 5 sm", "Jami 11 ulush: 11 · 5 = 55 sm"], a: "55 sm" },
        { q: "120 000 so‘mni 1 : 2 nisbatda bo‘ling.", steps: ["Ulushlar: 1 + 2 = 3", "Bir ulush: 40 000", "40 000 va 80 000"], a: "40 000 va 80 000 so‘m" }
      ],
      quiz: [
        { q: "30 ni 2 : 3 nisbatda bo‘ling.", o: ["12 va 18", "10 va 20", "15 va 15", "6 va 24"], e: "30 : 5 = 6; 12 va 18." },
        { q: "Nisbat 3 : 5, farq 12. Kichik son?", o: ["18", "30", "6", "24"], e: "12 : 2 = 6; 3 · 6 = 18." },
        { q: "Aralashmada sement : qum = 1 : 3. 20 kg aralashmada qum?", o: ["15 kg", "5 kg", "60 kg", "10 kg"], e: "20 : 4 · 3 = 15." }
      ]
    },
    {
      id: "uch-nisbat", title: "Uch miqdor nisbati", tag: "a : b : c",
      life: "Uch hamkor biznesga 2, 3 va 5 million so‘m qo‘shdi. 2 000 000 so‘m foydani qo‘shgan puliga mos — 2 : 3 : 5 nisbatda bo‘lishadi: 400 000, 600 000 va 1 000 000 so‘m.",
      explain: "<p>Uch miqdor nisbati a : b : c ko‘rinishida yoziladi. U ham barcha hadlari bir xil songa ko‘paytirilsa yoki bo‘linsa, o‘zgarmaydi: 4 : 6 : 10 = 2 : 3 : 5.</p><p>Taqsimlash ham ulushlar usulida: jami ulushlar a + b + c, bir ulush = jami : (a + b + c).</p><p>Ikki nisbatdan uchtasini tuzish: a : b = 2 : 3 va b : c = 3 : 4 bo‘lsa, a : b : c = 2 : 3 : 4 (b ikkalasida bir xil bo‘lishi kerak).</p>",
      rule: "Bir ulush = Jami : (a + b + c)",
      demos: [{ type: "ratioShare", parts: 3, names: ["1-hamkor", "2-hamkor", "3-hamkor"], unit: "so‘m", scale: 10000 }],
      examples: [
        { q: "Uchburchak burchaklari 2 : 3 : 4 nisbatda. Burchaklarni toping.", steps: ["Yig‘indi 180°, ulushlar 2 + 3 + 4 = 9", "Bir ulush: 180° : 9 = 20°", "40°, 60°, 80°"], a: "40°, 60°, 80°" },
        { q: "a : b = 1 : 2, b : c = 4 : 5. a : b : c = ?", steps: ["b ni tenglashtiramiz: 1 : 2 = 2 : 4", "2 : 4 : 5"], a: "2 : 4 : 5" }
      ],
      quiz: [
        { q: "60 ni 1 : 2 : 3 nisbatda bo‘ling.", o: ["10, 20, 30", "20, 20, 20", "6, 12, 18", "15, 20, 25"], e: "60 : 6 = 10." },
        { q: "6 : 9 : 12 soddalashtirilgani?", o: ["2 : 3 : 4", "1 : 2 : 3", "3 : 4 : 5", "2 : 3 : 5"], e: "3 ga bo‘lamiz." },
        { q: "Perimetri 36 sm uchburchak tomonlari 3 : 4 : 5. Eng katta tomon?", o: ["15 sm", "12 sm", "9 sm", "20 sm"], e: "36 : 12 = 3; 5 · 3 = 15." }
      ]
    },
    {
      id: "ozgaruvchan-nisbat", title: "O‘zgaruvchan nisbatlar", tag: "Oldin va keyin",
      life: "Alida va Valida markalar 3 : 5 nisbatda edi. Ali Valiga 6 ta marka berdi — endi nisbat boshqacha. Narsalar berilganda, qo‘shilganda yoki sarflanganda nisbat o‘zgaradi. Bunday masalalarda <b>o‘zgarmay qolgan miqdorni</b> topish — kalit.",
      explain: "<p>Uch xil holat bor:</p><ol><li><b>Biri ikkinchisiga beradi</b> — jami miqdor o‘zgarmaydi. Oldingi va keyingi nisbatni jami bo‘yicha tenglashtiramiz.</li><li><b>Ikkalasiga bir xil qo‘shiladi/olinadi</b> — farq o‘zgarmaydi.</li><li><b>Faqat biriniki o‘zgaradi</b> — ikkinchisiniki o‘zgarmaydi.</li></ol><p>O‘zgarmagan miqdorni ikkala nisbatda bir xil ulushlar soniga keltiramiz, keyin ulushlar farqidan bir ulushni topamiz.</p>",
      rule: "O‘zgarmaydigan miqdorni toping → ikki nisbatni unga moslang → ulushlar farqi = o‘zgarish.",
      demos: [{ type: "ratioChange" }],
      examples: [
        { q: "Ali : Vali = 3 : 5. Ali Valiga 6 ta berdi, nisbat 1 : 3 bo‘ldi. Dastlab Alida nechta bor edi?", steps: ["Jami o‘zgarmaydi: 3 + 5 = 8 ulush, 1 + 3 = 4 ulush → 1 : 3 = 2 : 6 (8 ulush)", "Ali: 3 ulushdan 2 ulushga tushdi — 1 ulush = 6 ta", "Dastlab Ali: 3 · 6 = 18"], a: "18 ta" },
        { q: "Ona va qiz yoshlari 7 : 2. 10 yildan so‘ng 9 : 4 bo‘ladi. Hozir qizi necha yoshda?", steps: ["Farq o‘zgarmaydi: 7 − 2 = 5 ulush, 9 − 4 = 5 ulush — tayyor!", "Qiz: 2 ulushdan 4 ulushga — 2 ulush = 10 yil, 1 ulush = 5", "Qiz hozir: 2 · 5 = 10"], a: "10 yoshda" }
      ],
      quiz: [
        { q: "Biri ikkinchisiga narsa bersa, nima o‘zgarmaydi?", o: ["Jami miqdor", "Farq", "Har birining miqdori", "Nisbat"], e: "Narsa bir qo‘ldan ikkinchisiga o‘tdi, xolos." },
        { q: "Ikkalasiga 5 tadan qo‘shilsa, nima o‘zgarmaydi?", o: ["Farq", "Jami", "Nisbat", "Hech narsa"], e: "(a + 5) − (b + 5) = a − b." },
        { q: "Olma : nok = 2 : 3, jami 25 ta. 5 ta olma qo‘shildi. Yangi nisbat?", o: ["1 : 1", "2 : 3", "3 : 2", "7 : 3"], e: "10 + 5 = 15 olma, 15 nok → 1 : 1." }
      ]
    }
  ]
});
