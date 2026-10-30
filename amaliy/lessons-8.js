/* 8-sinf: Algebra, Geometriya va Fizika (namuna) — 1-chorak mavzulari. */
(() => {
  const F = (a, b) => window.AK.fr(a, b);

  window.AMALIY_ADD("8", "8-sinf", {
    id: "algebra", name: "Algebra", icon: "🔣", color: "#a855f7",
    topics: [
      {
        id: "takrorlash", title: "7-sinf kursini takrorlash", tag: "Qisqa ko‘paytirish formulalari",
        life: "Usta kvadrat xonaning har bir tomonini 1 m ga uzaytirmoqchi. Yangi pol yuzi (a + 1)² — bu a² + 2a + 1, ya’ni eski yuzaga 2a + 1 qo‘shiladi. 99² ni og‘zaki hisoblash: (100 − 1)² = 10 000 − 200 + 1 = 9 801.",
        explain: "<p>Qisqa ko‘paytirish formulalari hisoblashni tezlashtiradi va ifodalarni soddalashtiradi:</p><ul><li><b>(a + b)² = a² + 2ab + b²</b> — yig‘indi kvadrati</li><li><b>(a − b)² = a² − 2ab + b²</b> — ayirma kvadrati</li><li><b>a² − b² = (a − b)(a + b)</b> — kvadratlar ayirmasi</li></ul><p>Ular geometrik ma’noga ega: (a + b)² — tomoni a + b bo‘lgan kvadrat yuzi, u a², b² va ikkita ab to‘g‘ri to‘rtburchakdan iborat.</p>",
        rule: "(a ± b)² = a² ± 2ab + b²;  a² − b² = (a − b)(a + b)",
        demos: [{ type: "squareArea" }],
        examples: [
          { q: "(x + 3)² ni ko‘phad shaklida yozing.", steps: ["a = x, b = 3", "x² + 2 · x · 3 + 3²"], a: "x² + 6x + 9" },
          { q: "51² − 49² ni hisoblang.", steps: ["Kvadratlar ayirmasi: (51 − 49)(51 + 49)", "2 · 100"], a: "200" }
        ],
        quiz: [
          { q: "(a − 5)² = ?", o: ["a² − 10a + 25", "a² − 25", "a² + 25", "a² − 5a + 25"], e: "2 · a · 5 = 10a." },
          { q: "x² − 16 = ?", o: ["(x − 4)(x + 4)", "(x − 4)²", "(x − 8)(x + 8)", "(x − 16)(x + 1)"], e: "16 = 4²." },
          { q: "101² = ?", o: ["10 201", "10 101", "1 201", "10 002"], e: "(100 + 1)² = 10 000 + 200 + 1." }
        ]
      },
      {
        id: "algebraik-ifoda", title: "Algebraik ifodalar", tag: "Butun va kasr ifodalar, aniqlanish sohasi",
        life: "Har bir o‘quvchiga tushadigan pul: " + F("S", "n") + " — bu yerda n o‘quvchilar soni. n = 0 bo‘lishi mumkin emas — hech kimga bo‘lib bo‘lmaydi! Kasr ifodalarda maxrajni nolga aylantiradigan qiymatlar “taqiqlangan”.",
        explain: "<p><b>Butun ifoda</b> — o‘zgaruvchiga bo‘lish qatnashmagan ifoda: 3x² − 2x + 1, (a + b)/2.</p><p><b>Kasr ifoda</b> — o‘zgaruvchili ifodaga bo‘lish bor: " + F("5", "x") + ", " + F("x + 1", "x − 3") + ".</p><p>Kasr ifoda faqat maxraj <b>nolga teng bo‘lmagan</b> qiymatlarda ma’noga ega. Bu qiymatlar to‘plami <b>aniqlanish sohasi</b> (joiz qiymatlar) deyiladi.</p><p>" + F("x + 1", "x − 3") + " uchun: x − 3 ≠ 0 → x ≠ 3.</p>",
        rule: "Kasr ifodada maxraj ≠ 0. Joiz qiymatlarni topish: maxrajni 0 ga tenglab, topilgan sonlarni chiqarib tashlaymiz.",
        demos: [{ type: "exprValue", items: [
          { story: "x ni o‘zgartirib ko‘ring. x = 3 da nima bo‘ladi?", display: F("x + 1", "x − 3"), vars: { x: [-5, 8, 1, "x"] }, fn: (v) => (v.x === 3 ? Infinity : (v.x + 1) / (v.x - 3)) },
          { story: "Bu ifoda qaysi x larda ma’noga ega emas?", display: F("2x", "x² − 4"), vars: { x: [-5, 5, 1, "x"] }, fn: (v) => (Math.abs(v.x) === 2 ? Infinity : (2 * v.x) / (v.x * v.x - 4)) }
        ], step: 1 }],
        examples: [
          { q: F("7", "x(x + 5)") + " ifodaning joiz qiymatlarini toping.", steps: ["x(x + 5) = 0", "x = 0 yoki x + 5 = 0 → x = −5"], a: "x ≠ 0 va x ≠ −5" },
          { q: F("a − 1", "a² + 1") + " qachon ma’noga ega?", steps: ["a² ≥ 0, demak a² + 1 ≥ 1 > 0", "Maxraj hech qachon 0 bo‘lmaydi"], a: "Barcha a larda" }
        ],
        quiz: [
          { q: F("3", "x − 7") + " qaysi x da ma’noga ega emas?", o: ["x = 7", "x = 0", "x = −7", "x = 3"], e: "x − 7 = 0." },
          { q: "Qaysi ifoda butun ifoda?", o: [F("x + 2", "5"), F("5", "x + 2"), F("1", "x"), F("x", "x − 1")], e: "Songa bo‘lish ifodani kasr qilmaydi." },
          { q: F("x", "x² − 9") + " joiz qiymatlari?", o: ["x ≠ ±3", "x ≠ 9", "x ≠ 0", "x ≠ 3"], e: "x² = 9 → x = ±3." }
        ]
      },
      {
        id: "qisqartirish", title: "Algebraik kasr. Kasrlarni qisqartirish", tag: "Ko‘paytuvchiga ajratib qisqartirish",
        life: "Oddiy kasrni qisqartirgandek: " + F("12", "18") + " = " + F("2", "3") + ". Algebraik kasrlarni ham soddalashtirsak, hisob kitob va formulalar ancha ixcham bo‘ladi — muhandislar va dasturchilar shundan foydalanadi.",
        explain: "<p><b>Algebraik kasr</b> — surati va maxraji ko‘phad bo‘lgan kasr.</p><p>Kasrning <b>asosiy xossasi</b>: surat va maxrajni bir xil (nolga teng bo‘lmagan) ko‘phadga ko‘paytirish yoki bo‘lish mumkin.</p><p>Qisqartirish uchun:</p><ol><li>Surat va maxrajni <b>ko‘paytuvchilarga ajratamiz</b> (umumiy ko‘paytuvchini chiqarish, formulalar).</li><li>Umumiy ko‘paytuvchilarni qisqartiramiz.</li></ol><p>Diqqat: faqat <b>ko‘paytuvchilar</b> qisqaradi, qo‘shiluvchilar emas! " + F("x + 3", "3") + " ≠ x.</p>",
        rule: "Faqat ko‘paytuvchilarni qisqartirish mumkin. Qisqargan ko‘paytuvchi nolga teng bo‘ladigan x lar joiz emas.",
        demos: [{ type: "formulaCheck", items: [
          { from: F("x² − 9", "x + 3"), to: "x − 3", steps: ["Suratni ajratamiz: x² − 9 = (x − 3)(x + 3)", "Umumiy ko‘paytuvchi (x + 3) ni qisqartiramiz", "Natija: x − 3, lekin x ≠ −3"], f1: (x) => (x * x - 9) / (x + 3), f2: (x) => x - 3, bad: [-3] },
          { from: F("2x + 6", "x² + 3x"), to: F("2", "x"), steps: ["Surat: 2x + 6 = 2(x + 3)", "Maxraj: x² + 3x = x(x + 3)", "(x + 3) qisqaradi → " + F("2", "x") + ", x ≠ 0, x ≠ −3"], f1: (x) => (2 * x + 6) / (x * x + 3 * x), f2: (x) => 2 / x, bad: [0, -3] },
          { from: F("x² − 4x + 4", "x − 2"), to: "x − 2", steps: ["Surat — ayirma kvadrati: (x − 2)²", "(x − 2) ni qisqartiramiz", "Natija: x − 2, x ≠ 2"], f1: (x) => (x * x - 4 * x + 4) / (x - 2), f2: (x) => x - 2, bad: [2] }
        ] }],
        examples: [
          { q: F("15a²b", "20ab³") + " ni qisqartiring.", steps: ["Sonlar: 15 va 20 → 3 va 4", "a² : a = a, b : b³ = " + F("1", "b²")], a: F("3a", "4b²") },
          { q: F("a² − b²", "a² + ab") + " ni qisqartiring.", steps: ["Surat: (a − b)(a + b)", "Maxraj: a(a + b)", "(a + b) qisqaradi"], a: F("a − b", "a") }
        ],
        quiz: [
          { q: F("5x", "10x²") + " = ?", o: [F("1", "2x"), F("x", "2"), "2x", F("5", "10x")], e: "5x ga qisqartiramiz." },
          { q: F("x² − 1", "x − 1") + " = ?", o: ["x + 1", "x − 1", "x", "x² "], e: "(x − 1)(x + 1)/(x − 1)." },
          { q: "Qaysi qisqartirish XATO?", o: [F("x + 5", "5") + " = x", F("5x", "5") + " = x", F("x(x+1)", "x") + " = x + 1", F("3(a−b)", "6") + " = " + F("a−b", "2")], e: "Qo‘shiluvchi qisqarmaydi!" }
        ]
      },
      {
        id: "umumiy-maxraj", title: "Kasrlarni umumiy maxrajga keltirish", tag: "Qo‘shimcha ko‘paytuvchi",
        life: "Ikki shahar soatlarini solishtirish uchun ularni bitta vaqt mintaqasiga keltiramiz. Kasrlarni qo‘shishdan oldin ham ularni “bitta tilga” — umumiy maxrajga keltirish kerak.",
        explain: "<p>Umumiy maxraj — barcha maxrajlarga bo‘linadigan ifoda. Eng qulayi — <b>eng kichik umumiy maxraj</b>.</p><ol><li>Har bir maxrajni ko‘paytuvchilarga ajratamiz.</li><li>Umumiy maxrajga barcha ko‘paytuvchilarni (eng katta darajasi bilan) olamiz.</li><li>Har bir kasr uchun <b>qo‘shimcha ko‘paytuvchi</b> = umumiy maxraj : o‘z maxraji. Surat va maxrajni unga ko‘paytiramiz.</li></ol>",
        rule: "Qo‘shimcha ko‘paytuvchi = Umumiy maxraj : kasr maxraji",
        demos: [{ type: "formulaCheck", items: [
          { from: F("3", "x"), to: F("3(x + 1)", "x(x + 1)"), steps: ["Maxrajlar x va x + 1 bo‘lsa, umumiy maxraj x(x + 1)", F("3", "x") + " uchun qo‘shimcha ko‘paytuvchi: x + 1", "Surat va maxrajni (x + 1) ga ko‘paytiramiz — kasr qiymati o‘zgarmaydi (x ≠ −1 da)"], f1: (x) => 3 / x, f2: (x) => (3 * (x + 1)) / (x * (x + 1)), bad: [0, -1] },
          { from: F("a", "x − 2"), to: F("a(x + 2)", "x² − 4"), steps: ["x² − 4 = (x − 2)(x + 2)", "Qo‘shimcha ko‘paytuvchi: x + 2", "a = 1 deb grafikda tekshiramiz"], f1: (x) => 1 / (x - 2), f2: (x) => (x + 2) / (x * x - 4), bad: [2, -2] }
        ] }],
        examples: [
          { q: F("1", "2x") + " va " + F("3", "x²") + " ni umumiy maxrajga keltiring.", steps: ["Umumiy maxraj: 2x²", "1-kasrga qo‘shimcha ko‘paytuvchi x, 2-kasrga 2"], a: F("x", "2x²") + " va " + F("6", "2x²") },
          { q: F("5", "a − b") + " va " + F("2", "b − a") + " umumiy maxraji?", steps: ["b − a = −(a − b)", F("2", "b − a") + " = −" + F("2", "a − b")], a: "a − b" }
        ],
        quiz: [
          { q: F("1", "x") + " va " + F("1", "y") + " umumiy maxraji?", o: ["xy", "x + y", "x", "1"], e: "Ikkalasiga bo‘linadigan eng sodda ifoda." },
          { q: F("2", "3a") + " ni 6a² maxrajga keltirganda surat?", o: ["4a", "2a", "6a", "4"], e: "Qo‘shimcha ko‘paytuvchi 2a." },
          { q: "x² − 9 va x + 3 ning umumiy maxraji?", o: ["x² − 9", "(x² − 9)(x + 3)", "x + 3", "x − 3"], e: "x² − 9 = (x − 3)(x + 3)." }
        ]
      },
      {
        id: "qoshish-ayirish", title: "Algebraik kasrlarni qo‘shish va ayirish", tag: "Umumiy maxraj orqali",
        life: "Ikki quvur hovuzni to‘ldiradi: biri x soatda, ikkinchisi x + 1 soatda. Birgalikda 1 soatda hovuzning " + F("1", "x") + " + " + F("1", "x + 1") + " qismini to‘ldiradi. Ish va harakat masalalari shu kasrlar bilan yechiladi.",
        explain: "<p><b>Maxrajlar bir xil</b> bo‘lsa: suratlarni qo‘shamiz/ayiramiz, maxraj o‘zgarmaydi.</p><p><b>Maxrajlar har xil</b> bo‘lsa: avval umumiy maxrajga keltiramiz, keyin suratlar bilan amal bajaramiz.</p><p>Natijani albatta qisqartirib ko‘ring. Ayirishda suratdagi qavs oldidagi minusga e’tibor bering!</p>",
        rule: F("a", "c") + " ± " + F("b", "c") + " = " + F("a ± b", "c") + ";  " + F("a", "b") + " + " + F("c", "d") + " = " + F("ad + bc", "bd"),
        demos: [{ type: "formulaCheck", items: [
          { from: F("x", "x − 2") + " − " + F("2", "x − 2"), to: "1", steps: ["Maxrajlar bir xil: " + F("x − 2", "x − 2"), "Qisqartiramiz: 1 (x ≠ 2)"], f1: (x) => x / (x - 2) - 2 / (x - 2), f2: () => 1, bad: [2] },
          { from: F("1", "x") + " + " + F("1", "x + 1"), to: F("2x + 1", "x(x + 1)"), steps: ["Umumiy maxraj: x(x + 1)", "Suratlar: 1·(x + 1) + 1·x = 2x + 1"], f1: (x) => 1 / x + 1 / (x + 1), f2: (x) => (2 * x + 1) / (x * (x + 1)), bad: [0, -1] },
          { from: F("3", "x − 1") + " − " + F("3", "x + 1"), to: F("6", "x² − 1"), steps: ["Umumiy maxraj: (x − 1)(x + 1) = x² − 1", "Surat: 3(x + 1) − 3(x − 1) = 3x + 3 − 3x + 3 = 6"], f1: (x) => 3 / (x - 1) - 3 / (x + 1), f2: (x) => 6 / (x * x - 1), bad: [1, -1] }
        ] }],
        examples: [
          { q: F("a + 3", "5a") + " − " + F("a − 2", "5a") + " = ?", steps: ["Maxraj bir xil", "(a + 3) − (a − 2) = 5", F("5", "5a") + " = " + F("1", "a")], a: F("1", "a") },
          { q: F("2", "x") + " + " + F("3", "2x") + " = ?", steps: ["Umumiy maxraj 2x", F("4", "2x") + " + " + F("3", "2x")], a: F("7", "2x") }
        ],
        quiz: [
          { q: F("3", "y") + " + " + F("5", "y") + " = ?", o: [F("8", "y"), F("8", "2y"), F("15", "y"), "8"], e: "Maxraj bir xil." },
          { q: F("1", "a") + " − " + F("1", "b") + " = ?", o: [F("b − a", "ab"), F("a − b", "ab"), F("0", "ab"), F("1", "a − b")], e: F("b", "ab") + " − " + F("a", "ab") + "." },
          { q: F("x", "x + 1") + " + " + F("1", "x + 1") + " = ?", o: ["1", "x", F("x + 1", "2x + 2"), F("1", "x + 1")], e: F("x + 1", "x + 1") + " = 1." }
        ]
      },
      {
        id: "kopaytirish-bolish", title: "Algebraik kasrlarni ko‘paytirish va bo‘lish", tag: "Oddiy kasrlardagi kabi",
        life: "Fizikada formulalarni almashtirishda (masalan, tezlik = " + F("s", "t") + " va vaqtni ifodalashda) algebraik kasrlar ko‘paytiriladi va bo‘linadi. Qoidalar 5–6-sinfdagi kasrlar bilan bir xil!",
        explain: "<p><b>Ko‘paytirish:</b> suratni suratga, maxrajni maxrajga ko‘paytiramiz: " + F("a", "b") + " · " + F("c", "d") + " = " + F("ac", "bd") + ".</p><p><b>Bo‘lish:</b> bo‘luvchini teskari kasrga almashtirib ko‘paytiramiz: " + F("a", "b") + " : " + F("c", "d") + " = " + F("a", "b") + " · " + F("d", "c") + ".</p><p>Ko‘paytirishdan <b>oldin</b> ko‘paytuvchilarga ajratib qisqartirish hisoblashni ancha osonlashtiradi.</p>",
        rule: "Avval ko‘paytuvchilarga ajrating → qisqartiring → keyin ko‘paytiring.",
        demos: [{ type: "formulaCheck", items: [
          { from: F("x² − 1", "x") + " · " + F("x", "x + 1"), to: "x − 1", steps: ["x² − 1 = (x − 1)(x + 1)", "x va (x + 1) qisqaradi", "Natija: x − 1 (x ≠ 0, x ≠ −1)"], f1: (x) => ((x * x - 1) / x) * (x / (x + 1)), f2: (x) => x - 1, bad: [0, -1] },
          { from: F("x + 2", "x") + " : " + F("x² − 4", "x²"), to: F("x", "x − 2"), steps: ["Teskariga ko‘paytiramiz: " + F("x + 2", "x") + " · " + F("x²", "(x − 2)(x + 2)"), "(x + 2) va x qisqaradi", "Natija: " + F("x", "x − 2")], f1: (x) => ((x + 2) / x) / ((x * x - 4) / (x * x)), f2: (x) => x / (x - 2), bad: [0, 2, -2] }
        ] }],
        examples: [
          { q: F("6a", "b²") + " · " + F("b", "3a²") + " = ?", steps: ["Sonlar: 6 : 3 = 2", "a : a² = " + F("1", "a") + ", b : b² = " + F("1", "b")], a: F("2", "ab") },
          { q: F("m", "n") + " : " + F("m²", "n³") + " = ?", steps: [F("m", "n") + " · " + F("n³", "m²"), F("mn³", "nm²") + " = " + F("n²", "m")], a: F("n²", "m") }
        ],
        quiz: [
          { q: F("2", "x") + " · " + F("x", "4") + " = ?", o: [F("1", "2"), F("x", "8"), "2", F("x", "2")], e: F("2x", "4x") + " = " + F("1", "2") + "." },
          { q: F("a", "3") + " : " + F("a", "6") + " = ?", o: ["2", F("1", "2"), F("a²", "18"), "a"], e: F("a", "3") + " · " + F("6", "a") + " = 2." },
          { q: F("x + 1", "x") + " · " + F("x²", "x + 1") + " = ?", o: ["x", "x + 1", "x²", "1"], e: "(x + 1) va x qisqaradi." }
        ]
      },
      {
        id: "ayniy-almashtirish", title: "Kasr-ratsional ifodalarni ayniy almashtirish", tag: "Bir nechta amalni ketma-ket bajarish",
        life: "Elektr zanjirida ikki qarshilik parallel ulansa, umumiy qarshilik " + F("1", F("1", "R₁") + " + " + F("1", "R₂")) + " = " + F("R₁R₂", "R₁ + R₂") + ". Murakkab formulani soddalashtirish — ayniy almashtirish.",
        explain: "<p><b>Ayniy almashtirish</b> — ifodani unga teng (barcha joiz qiymatlarda) boshqa ifoda bilan almashtirish.</p><p>Murakkab kasr-ratsional ifodalarda amallar tartibi odatdagidek: qavslar → ko‘paytirish/bo‘lish → qo‘shish/ayirish. Har bir bosqichda qisqartirishni unutmang.</p><p>Natijani tekshirish usuli: biror joiz x qiymatida boshlang‘ich va oxirgi ifodani hisoblab, teng chiqishini ko‘ring.</p>",
        rule: "Ayniyat — barcha joiz qiymatlarda to‘g‘ri bo‘lgan tenglik. Tekshirish: biror x da ikkala tomonni hisoblang.",
        demos: [{ type: "formulaCheck", items: [
          { from: "(" + F("1", "x − 1") + " − " + F("1", "x + 1") + ") · " + F("x² − 1", "2"), to: "1", steps: ["Qavs ichi: " + F("(x + 1) − (x − 1)", "x² − 1") + " = " + F("2", "x² − 1"), "Ko‘paytiramiz: " + F("2", "x² − 1") + " · " + F("x² − 1", "2") + " = 1", "Ifoda x ga bog‘liq emas! (x ≠ ±1)"], f1: (x) => (1 / (x - 1) - 1 / (x + 1)) * ((x * x - 1) / 2), f2: () => 1, bad: [1, -1] },
          { from: F("x² − 4", "x") + " : (x + 2) + " + F("2", "x"), to: "1", steps: ["Bo‘lish: " + F("(x − 2)(x + 2)", "x(x + 2)") + " = " + F("x − 2", "x"), "Qo‘shish: " + F("x − 2", "x") + " + " + F("2", "x") + " = " + F("x", "x") + " = 1"], f1: (x) => ((x * x - 4) / x) / (x + 2) + 2 / x, f2: () => 1, bad: [0, -2] }
        ] }],
        examples: [
          { q: "(1 + " + F("1", "a") + ") : " + F("a + 1", "a²") + " = ?", steps: ["Qavs: " + F("a + 1", "a"), F("a + 1", "a") + " · " + F("a²", "a + 1") + " = a"], a: "a" }
        ],
        quiz: [
          { q: "(" + F("1", "x") + " + 1) · x = ?", o: ["1 + x", "2x", "x", "1"], e: "1 + x." },
          { q: F("a", "b") + " + " + F("b", "a") + " − 2 = ?", o: [F("(a − b)²", "ab"), "0", F("a + b", "ab"), F("a² + b²", "ab")], e: F("a² + b² − 2ab", "ab") + "." },
          { q: "Ayniyatni qanday tekshirish mumkin?", o: ["Joiz x da ikkala tomonni hisoblab", "Faqat x = 0 da", "Tekshirib bo‘lmaydi", "x ni o‘chirib"], e: "Biror joiz qiymatda tenglik bajarilishi kerak." }
        ]
      },
      {
        id: "giperbola", title: "y = k/x funksiya, uning xossalari va grafigi", tag: "Teskari proporsionallik",
        life: "120 km yo‘lni bosish kerak. Tezlik 60 km/soat bo‘lsa — 2 soat, 40 km/soat bo‘lsa — 3 soat, 120 km/soat bo‘lsa — 1 soat. Tezlik ortsa, vaqt kamayadi: t = " + F("120", "v") + ". Bu — <b>teskari proporsionallik</b>, grafigi esa <b>giperbola</b>.",
        explain: "<p>y = " + F("k", "x") + " (k ≠ 0) funksiyada x va y teskari proporsional: <b>x · y = k</b> doim o‘zgarmas.</p><ul><li>Aniqlanish sohasi: x ≠ 0; qiymatlar sohasi: y ≠ 0.</li><li><b>k > 0</b>: grafik I va III choraklarda, har bir oraliqda funksiya kamayadi.</li><li><b>k < 0</b>: grafik II va IV choraklarda, har bir oraliqda funksiya o‘sadi.</li><li>Grafik koordinata boshiga nisbatan simmetrik, o‘qlarga yaqinlashadi, lekin ularni kesmaydi.</li></ul>",
        rule: "y = " + F("k", "x") + " ⇔ xy = k. Grafigi — giperbola (ikki tarmoqli egri chiziq).",
        demos: [{ type: "hyperbola", story: "Agar masofa {k} km bo‘lsa, {x} soatda yetib borish uchun tezlik {y} km/soat bo‘lishi kerak." }],
        examples: [
          { q: "y = " + F("k", "x") + " grafigi A(4; −3) nuqtadan o‘tadi. k = ?", steps: ["k = x · y", "k = 4 · (−3)"], a: "k = −12" },
          { q: "y = " + F("6", "x") + " grafigi B(−2; 3) nuqtadan o‘tadimi?", steps: ["x · y = (−2) · 3 = −6", "−6 ≠ 6"], a: "Yo‘q, o‘tmaydi" }
        ],
        quiz: [
          { q: "y = " + F("8", "x") + " da x = 2 bo‘lsa, y = ?", o: ["4", "16", "6", "10"], e: "8 : 2 = 4." },
          { q: "y = −" + F("5", "x") + " grafigi qaysi choraklarda?", o: ["II va IV", "I va III", "I va II", "III va IV"], e: "k < 0." },
          { q: "Qaysi juftlik teskari proporsional?", o: ["Ishchilar soni va ish vaqti", "Daftar soni va narxi", "Tomon va perimetr", "Vaqt va yo‘l (tezlik o‘zgarmas)"], e: "Ishchi ko‘p bo‘lsa, ish tezroq tugaydi: n · t = const." }
        ]
      }
    ]
  });

  window.AMALIY_ADD("8", "8-sinf", {
    id: "geometriya", name: "Geometriya", icon: "📐", color: "#f59e0b",
    topics: [
      {
        id: "takrorlash", title: "7-sinfda o‘tilganlarni takrorlash", tag: "Uchburchak va uning burchaklari",
        life: "Ko‘prik va uylarning tom konstruksiyalari uchburchaklardan yasaladi — uchburchak eng mustahkam shakl: uning tomonlari aniq bo‘lsa, shakli o‘zgarmaydi. Uchburchak burchaklari yig‘indisi qanday bo‘lmasin — doim 180°.",
        explain: "<p>Takrorlaymiz:</p><ul><li>Uchburchak ichki burchaklari yig‘indisi <b>180°</b>.</li><li>Tashqi burchak o‘ziga qo‘shni bo‘lmagan ikki ichki burchak yig‘indisiga teng.</li><li>Katta tomon qarshisida katta burchak yotadi.</li><li>Uchburchak tengsizligi: istalgan tomon qolgan ikkitasining yig‘indisidan kichik.</li><li>Teng yonli uchburchakda asosdagi burchaklar teng.</li></ul>",
        rule: "∠A + ∠B + ∠C = 180°",
        demos: [{ type: "triangle", mode: "angles" }],
        examples: [
          { q: "Uchburchakning ikki burchagi 47° va 68°. Uchinchisi?", steps: ["180° − 47° − 68°"], a: "65°" },
          { q: "Teng yonli uchburchak uchidagi burchak 40°. Asosdagi burchaklar?", steps: ["Asosdagi ikki burchak yig‘indisi: 180° − 40° = 140°", "Ular teng: 140° : 2"], a: "70° va 70°" }
        ],
        quiz: [
          { q: "To‘g‘ri burchakli uchburchakning bir o‘tkir burchagi 35°. Ikkinchisi?", o: ["55°", "65°", "145°", "45°"], e: "90° − 35° = 55°." },
          { q: "Tomonlari 3, 4, 8 bo‘lgan uchburchak mavjudmi?", o: ["Yo‘q", "Ha", "Faqat to‘g‘ri burchakli", "Faqat teng yonli"], e: "3 + 4 = 7 < 8." },
          { q: "Teng tomonli uchburchakning har bir burchagi?", o: ["60°", "90°", "45°", "180°"], e: "180° : 3." }
        ]
      },
      {
        id: "kopburchak", title: "Ko‘pburchaklar", tag: "Ichki burchaklar yig‘indisi (n − 2)·180°",
        life: "Asalarilar uyasi muntazam oltiburchaklardan, futbol to‘pi besh- va oltiburchaklardan, “STOP” belgisi sakkizburchakdan iborat. Muntazam oltiburchakning har bir burchagi nega aynan 120°? Bilib olamiz.",
        explain: "<p><b>Ko‘pburchak</b> — o‘zaro kesishmaydigan kesmalardan tuzilgan yopiq siniq chiziq bilan chegaralangan shakl. n ta uchi, n ta tomoni bor.</p><p><b>Qavariq</b> ko‘pburchak bir uchidan diagonallar o‘tkazilsa, <b>n − 2</b> ta uchburchakka bo‘linadi. Shuning uchun ichki burchaklar yig‘indisi:</p><p style=\"text-align:center\"><b>S = (n − 2) · 180°</b></p><p><b>Muntazam</b> ko‘pburchakda barcha tomonlar va burchaklar teng: har bir burchak " + F("(n − 2) · 180°", "n") + ".</p><p>Bir uchdan chiquvchi diagonallar soni: n − 3; jami diagonallar: " + F("n(n − 3)", "2") + ".</p>",
        rule: "S = (n − 2) · 180°",
        demos: [{ type: "polygon", mode: "interior" }],
        examples: [
          { q: "Qavariq beshburchak burchaklari yig‘indisi?", steps: ["(5 − 2) · 180°", "3 · 180°"], a: "540°" },
          { q: "Ichki burchaklar yig‘indisi 1440° bo‘lgan ko‘pburchakning nechta tomoni bor?", steps: ["(n − 2) · 180 = 1440", "n − 2 = 8"], a: "n = 10" }
        ],
        quiz: [
          { q: "Oltiburchak burchaklari yig‘indisi?", o: ["720°", "540°", "1080°", "360°"], e: "4 · 180°." },
          { q: "Muntazam sakkizburchakning bir burchagi?", o: ["135°", "120°", "145°", "150°"], e: "1080° : 8 = 135°." },
          { q: "Beshburchakda nechta diagonal bor?", o: ["5", "10", "3", "2"], e: "5 · 2 : 2 = 5." }
        ]
      },
      {
        id: "tashqi-burchak", title: "Ko‘pburchak ichki va tashqi burchaklarining xossasi", tag: "Tashqi burchaklar yig‘indisi 360°",
        life: "Robot-changyutgich xonani aylanib chiqdi: har bir burchakda biroz burilib, boshlang‘ich joyiga qaytdi. Qancha burchakli xona bo‘lmasin, u jami roppa-rosa <b>360°</b> ga burilgan bo‘ladi!",
        explain: "<p><b>Tashqi burchak</b> — ichki burchakka qo‘shni burchak (tomonni davom ettirib hosil qilinadi). Ichki va tashqi burchak yig‘indisi 180°.</p><p>Qavariq ko‘pburchakning har bir uchidan bittadan olingan tashqi burchaklari yig‘indisi <b>doim 360°</b> — tomonlar soniga bog‘liq emas.</p><p>Isbot: n ta (ichki + tashqi) = n · 180°, ichkilari (n − 2) · 180°, demak tashqilari: n · 180° − (n − 2) · 180° = 360°.</p>",
        rule: "Tashqi burchaklar yig‘indisi = 360°. Muntazam n-burchakda tashqi burchak = 360° : n.",
        demos: [{ type: "polygon", mode: "exterior" }],
        examples: [
          { q: "Muntazam ko‘pburchakning tashqi burchagi 24°. Nechta tomoni bor?", steps: ["360° : 24°"], a: "15 ta" },
          { q: "Muntazam ko‘pburchak ichki burchagi 140°. Tomonlari soni?", steps: ["Tashqi burchak: 180° − 140° = 40°", "360° : 40°"], a: "9 ta" }
        ],
        quiz: [
          { q: "Qavariq 20-burchak tashqi burchaklari yig‘indisi?", o: ["360°", "3240°", "720°", "180°"], e: "Doim 360°." },
          { q: "Muntazam oltiburchak tashqi burchagi?", o: ["60°", "120°", "30°", "90°"], e: "360° : 6." },
          { q: "Ichki burchak 108° bo‘lsa, tashqi burchak?", o: ["72°", "252°", "108°", "18°"], e: "180° − 108°." }
        ]
      },
      {
        id: "parallelogramm", title: "Parallelogramm va uning xossalari", tag: "Tomonlar, burchaklar, diagonallar",
        life: "Qaychi-lift, eshik oynasi ochiladigan mexanizmlar, ba’zi stol oyoqlari parallelogramm shaklida harakatlanadi: burchagi o‘zgarsa ham, qarama-qarshi tomonlari doim parallel va teng qoladi.",
        explain: "<p><b>Parallelogramm</b> — qarama-qarshi tomonlari juft-juft parallel bo‘lgan to‘rtburchak.</p><p>Xossalari:</p><ol><li>Qarama-qarshi tomonlari <b>teng</b>.</li><li>Qarama-qarshi burchaklari <b>teng</b>.</li><li>Bir tomonga yopishgan burchaklar yig‘indisi <b>180°</b>.</li><li>Diagonallari kesishish nuqtasida <b>teng ikkiga bo‘linadi</b>.</li></ol>",
        rule: "AB = CD, AD = BC; ∠A = ∠C, ∠B = ∠D; ∠A + ∠B = 180°; AO = OC, BO = OD",
        demos: [{ type: "quad", shape: "parallelogram" }],
        examples: [
          { q: "Parallelogrammning bir burchagi 65°. Qolgan burchaklari?", steps: ["Qarama-qarshisi ham 65°", "Qo‘shnisi: 180° − 65° = 115°"], a: "65°, 115°, 65°, 115°" },
          { q: "Perimetri 40 sm, bir tomoni ikkinchisidan 4 sm uzun. Tomonlar?", steps: ["Yarim perimetr: a + b = 20", "a − b = 4 → a = 12, b = 8"], a: "12 sm va 8 sm" }
        ],
        quiz: [
          { q: "Parallelogramm diagonallari...", o: ["kesishish nuqtasida teng ikkiga bo‘linadi", "doim teng", "doim perpendikulyar", "burchaklarni teng ikkiga bo‘ladi"], e: "Teng va perpendikulyarlik — faqat maxsus turlarda." },
          { q: "∠A = 50° bo‘lsa, ∠B = ?", o: ["130°", "50°", "40°", "90°"], e: "Yonma-yon burchaklar yig‘indisi 180°." },
          { q: "AO = 6 sm bo‘lsa, AC = ?", o: ["12 sm", "6 sm", "3 sm", "18 sm"], e: "AC = 2 · AO." }
        ]
      },
      {
        id: "parallelogramm-alomat", title: "Parallelogrammning alomatlari", tag: "To‘rtburchak qachon parallelogramm bo‘ladi?",
        life: "Duradgor romni yasadi. U parallelogramm ekanini qanday tekshiradi? O‘lchagich bilan qarama-qarshi tomonlarni o‘lchaydi yoki diagonallarning o‘rtasi bir nuqtada ekanini tekshiradi. Bular — alomatlar.",
        explain: "<p>To‘rtburchak parallelogramm bo‘ladi, agar:</p><ol><li>Uning ikki qarama-qarshi tomoni <b>teng va parallel</b> bo‘lsa;</li><li>Qarama-qarshi tomonlari <b>juft-juft teng</b> bo‘lsa;</li><li>Diagonallari kesishish nuqtasida <b>teng ikkiga bo‘linsa</b>.</li></ol><p>Xossa: “parallelogramm bo‘lsa → ...”. Alomat: “... bo‘lsa → parallelogramm”. Ular bir-biriga teskari.</p>",
        rule: "Bitta alomat bajarilsa yetarli — to‘rtburchak parallelogramm.",
        demos: [{ type: "quadFree" }],
        examples: [
          { q: "To‘rtburchakda AB = CD = 7 sm va AB ∥ CD. Bu parallelogrammmi?", steps: ["1-alomat: bir juft tomon teng va parallel", "Bajarildi"], a: "Ha" },
          { q: "To‘rtburchakda AB = CD va BC ∥ AD. Parallelogramm bo‘lishi shartmi?", steps: ["Teng tomonlar va parallel tomonlar <b>har xil juftlar</b>", "Bunday shakl teng yonli trapetsiya ham bo‘lishi mumkin"], a: "Shart emas" }
        ],
        quiz: [
          { q: "Diagonallari kesishib, teng ikkiga bo‘linadigan to‘rtburchak?", o: ["Parallelogramm", "Trapetsiya", "Har qanday to‘rtburchak", "Faqat kvadrat"], e: "3-alomat." },
          { q: "Qarama-qarshi tomonlari 5, 8, 5, 8 bo‘lgan to‘rtburchak?", o: ["Parallelogramm", "Trapetsiya", "Romb", "Aniqlab bo‘lmaydi"], e: "2-alomat." },
          { q: "Alomat va xossa farqi?", o: ["Alomat — shaklni tanib olish sharti", "Farqi yo‘q", "Xossa — isbotlanmaydi", "Alomat faqat kvadratda"], e: "Alomat orqali shakl turini aniqlaymiz." }
        ]
      },
      {
        id: "togri-tortburchak", title: "To‘g‘ri to‘rtburchak va uning xossalari", tag: "Diagonallari teng",
        life: "Quruvchilar poydevor to‘g‘ri burchakli ekanini tekshirish uchun ikkala diagonalni arqon bilan o‘lchaydi: teng chiqsa — burchaklar to‘g‘ri! Bu to‘g‘ri to‘rtburchakning maxsus xossasiga asoslangan.",
        explain: "<p><b>To‘g‘ri to‘rtburchak</b> — barcha burchaklari to‘g‘ri bo‘lgan parallelogramm.</p><p>Parallelogrammning barcha xossalaridan tashqari, uning <b>diagonallari teng</b>.</p><p>Alomati: diagonallari teng bo‘lgan parallelogramm — to‘g‘ri to‘rtburchak.</p>",
        rule: "AC = BD; ∠A = ∠B = ∠C = ∠D = 90°",
        demos: [{ type: "quad", shape: "rectangle" }],
        examples: [
          { q: "To‘g‘ri to‘rtburchak diagonali 10 sm, diagonallar orasidagi burchak 60°. Kichik tomon?", steps: ["AO = BO = 5 sm (diagonallar teng va teng bo‘linadi)", "AOB uchburchak teng yonli, uchidagi burchak 60° → teng tomonli", "AB = AO"], a: "5 sm" }
        ],
        quiz: [
          { q: "To‘g‘ri to‘rtburchak diagonallari...", o: ["teng", "perpendikulyar", "teng emas", "burchakni teng bo‘ladi"], e: "Asosiy xossa." },
          { q: "Diagonallari teng parallelogramm?", o: ["To‘g‘ri to‘rtburchak", "Romb", "Trapetsiya", "Har qanday"], e: "Alomat." },
          { q: "Tomonlari 6 va 8 bo‘lsa, diagonal?", o: ["10", "14", "12", "7"], e: "Pifagor: √(36 + 64) = 10." }
        ]
      },
      {
        id: "romb", title: "Romb va uning xossalari", tag: "Diagonallari perpendikulyar",
        life: "Olmos (romb) shaklidagi yo‘l belgilari, panjara to‘rlari, plitkalar. Romb diagonallari doim to‘g‘ri burchak ostida kesishadi — shuning uchun romb shaklidagi panjara cho‘zilsa ham mustahkam qoladi.",
        explain: "<p><b>Romb</b> — barcha tomonlari teng bo‘lgan parallelogramm.</p><p>Maxsus xossalari:</p><ol><li>Diagonallari <b>perpendikulyar</b>.</li><li>Diagonallari romb burchaklarining <b>bissektrisalari</b>.</li></ol><p>Yuzi: S = " + F("d₁ · d₂", "2") + ".</p>",
        rule: "AC ⊥ BD; diagonallar burchaklarni teng ikkiga bo‘ladi; S = d₁d₂/2",
        demos: [{ type: "quad", shape: "rhombus" }],
        examples: [
          { q: "Romb diagonallari 6 va 8 sm. Tomoni?", steps: ["Yarim diagonallar: 3 va 4", "Ular to‘g‘ri burchakli uchburchak katetlari", "Tomon = √(9 + 16)"], a: "5 sm" },
          { q: "Rombning bir burchagi 50°. Diagonal tomon bilan qanday burchak hosil qiladi?", steps: ["Diagonal burchakni teng ikkiga bo‘ladi: 25°", "Ikkinchi diagonal: 130° : 2 = 65°"], a: "25° va 65°" }
        ],
        quiz: [
          { q: "Romb diagonallari orasidagi burchak?", o: ["90°", "60°", "45°", "180°"], e: "Doim perpendikulyar." },
          { q: "Diagonallari 10 va 12 bo‘lgan romb yuzi?", o: ["60", "120", "22", "30"], e: "10 · 12 : 2." },
          { q: "Romb perimetri 36 sm. Tomoni?", o: ["9 sm", "18 sm", "6 sm", "12 sm"], e: "36 : 4." }
        ]
      },
      {
        id: "kvadrat", title: "Kvadrat va uning xossalari", tag: "Ham romb, ham to‘g‘ri to‘rtburchak",
        life: "Shaxmat taxtasi, kafel, Rubik kubigining yuzi — kvadrat. Kvadrat “eng mukammal” to‘rtburchak: u to‘g‘ri to‘rtburchakning ham, rombning ham barcha xossalariga ega.",
        explain: "<p><b>Kvadrat</b> — barcha tomonlari teng to‘g‘ri to‘rtburchak (yoki barcha burchaklari to‘g‘ri romb).</p><p>Xossalari:</p><ul><li>Barcha tomonlar teng, barcha burchaklar 90°.</li><li>Diagonallar <b>teng</b>, <b>perpendikulyar</b>, kesishish nuqtasida teng ikkiga bo‘linadi.</li><li>Diagonallar burchaklarni 45° dan ikkiga bo‘ladi.</li><li>Diagonal d = a√2.</li></ul>",
        rule: "Kvadrat = to‘g‘ri to‘rtburchak + romb",
        demos: [{ type: "quad", shape: "square" }],
        examples: [
          { q: "Kvadrat diagonali 8 sm. Yuzi?", steps: ["Kvadrat — romb ham, S = d₁d₂/2", "8 · 8 : 2"], a: "32 sm²" }
        ],
        quiz: [
          { q: "Kvadrat diagonali tomon bilan qanday burchak hosil qiladi?", o: ["45°", "90°", "60°", "30°"], e: "90° : 2." },
          { q: "Diagonallari teng va perpendikulyar parallelogramm?", o: ["Kvadrat", "Romb", "To‘g‘ri to‘rtburchak", "Trapetsiya"], e: "Ikkala xossa birga — kvadrat." },
          { q: "Kvadrat perimetri 28 sm. Yuzi?", o: ["49 sm²", "28 sm²", "196 sm²", "14 sm²"], e: "Tomon 7, yuza 49." }
        ]
      },
      {
        id: "trapetsiya", title: "Trapetsiya va uning xossalari", tag: "Asoslar, yon tomonlar, o‘rta chiziq",
        life: "Ko‘prik tayanchlari, tom profili, sumka va chelak yon devori trapetsiya shaklida. To‘g‘on trapetsiya shaklida quriladi: pastki asosi keng — suv bosimiga chidamli.",
        explain: "<p><b>Trapetsiya</b> — faqat bir juft qarama-qarshi tomoni parallel bo‘lgan to‘rtburchak. Parallel tomonlar — <b>asoslar</b>, qolganlari — <b>yon tomonlar</b>.</p><p>Xossalari:</p><ul><li>Yon tomonga yopishgan burchaklar yig‘indisi <b>180°</b>.</li><li><b>O‘rta chiziq</b> (yon tomonlar o‘rtalarini tutashtiradi) asoslarga parallel va ularning yarim yig‘indisiga teng: m = " + F("a + b", "2") + ".</li></ul>",
        rule: "∠A + ∠D = 180°, ∠B + ∠C = 180°; o‘rta chiziq m = (a + b) : 2",
        demos: [{ type: "quad", shape: "trapezoid" }],
        examples: [
          { q: "Trapetsiya asoslari 7 va 13 sm. O‘rta chizig‘i?", steps: ["(7 + 13) : 2"], a: "10 sm" },
          { q: "Trapetsiyaning bir burchagi 70°. Shu yon tomondagi ikkinchi burchak?", steps: ["180° − 70°"], a: "110°" }
        ],
        quiz: [
          { q: "Trapetsiyada nechta juft parallel tomon bor?", o: ["1", "2", "0", "4"], e: "Faqat asoslar parallel." },
          { q: "O‘rta chiziq 9, bir asos 6. Ikkinchi asos?", o: ["12", "3", "15", "7,5"], e: "9 · 2 − 6 = 12." },
          { q: "∠A = 55° (asosda). ∠D (shu yon tomonda) = ?", o: ["125°", "55°", "35°", "145°"], e: "180° − 55°." }
        ]
      },
      {
        id: "teng-yonli-trapetsiya", title: "Teng yonli trapetsiya xossalari", tag: "Simmetrik trapetsiya",
        life: "Ko‘plab uy tomlari, abajurlar, piyola profili teng yonli trapetsiyaga o‘xshaydi — chap va o‘ng tomoni ko‘zgudagidek bir xil. Bu simmetriya qanday xossalarni beradi?",
        explain: "<p><b>Teng yonli trapetsiya</b> — yon tomonlari teng trapetsiya.</p><p>Xossalari:</p><ol><li>Asosdagi burchaklari <b>teng</b>.</li><li>Diagonallari <b>teng</b>.</li><li>Asoslarning o‘rtalarini tutashtiruvchi to‘g‘ri chiziq — <b>simmetriya o‘qi</b>.</li></ol><p>Alomat: asosdagi burchaklari yoki diagonallari teng trapetsiya — teng yonli.</p>",
        rule: "AD = BC ⇔ ∠A = ∠B ⇔ AC = BD",
        demos: [{ type: "quad", shape: "isoTrap" }],
        examples: [
          { q: "Teng yonli trapetsiyaning bir burchagi 64°. Qolganlari?", steps: ["Asosdagi burchaklar teng: 64° va 64°", "Yuqori asosdagilar: 180° − 64° = 116°"], a: "64°, 64°, 116°, 116°" },
          { q: "Asoslari 6 va 14, yon tomoni 5. Balandligi?", steps: ["Proyeksiya: (14 − 6) : 2 = 4", "h = √(5² − 4²)"], a: "3" }
        ],
        quiz: [
          { q: "Teng yonli trapetsiya diagonallari...", o: ["teng", "perpendikulyar", "teng ikkiga bo‘linadi", "asosga parallel"], e: "Asosiy xossa." },
          { q: "Asosdagi burchaklari teng trapetsiya?", o: ["Teng yonli", "To‘g‘ri burchakli", "Parallelogramm", "Romb"], e: "Alomat." },
          { q: "Teng yonli trapetsiyada nechta simmetriya o‘qi bor?", o: ["1", "2", "0", "4"], e: "Asoslar o‘rtalari orqali o‘tadi." }
        ]
      },
      {
        id: "fales", title: "Fales teoremasi", tag: "Parallel chiziqlar va teng kesmalar",
        life: "Qadimgi yunon olimi Fales piramida soyasini o‘lchab, uning balandligini topgan. Daftardagi chiziqlar ham parallel: qiya qo‘yilgan lineykani ular teng bo‘laklarga bo‘ladi — bu Fales teoremasining o‘zi!",
        explain: "<p><b>Fales teoremasi</b>: agar burchakning bir tomonida ketma-ket teng kesmalar ajratilib, ularning uchlaridan parallel to‘g‘ri chiziqlar o‘tkazilsa, bu chiziqlar burchakning ikkinchi tomonida ham <b>teng kesmalar</b> ajratadi.</p><p>Muhim: ikkinchi tomondagi kesmalar birinchi tomondagilarga teng bo‘lishi <b>shart emas</b>, ular faqat o‘zaro teng.</p>",
        rule: "A₁A₂ = A₂A₃ = ... va A₁B₁ ∥ A₂B₂ ∥ ... ⇒ B₁B₂ = B₂B₃ = ...",
        demos: [{ type: "thales" }],
        examples: [
          { q: "Burchak tomonida 3 ta teng kesma ajratilib, parallellar o‘tkazildi. Ikkinchi tomonda birinchi kesma 4 sm. Uchala kesma uzunligi?", steps: ["Fales: ikkinchi tomondagi kesmalar ham teng", "Har biri 4 sm, jami 12 sm"], a: "12 sm" }
        ],
        quiz: [
          { q: "Fales teoremasida chiziqlar qanday bo‘lishi shart?", o: ["Parallel", "Perpendikulyar", "Teng", "Kesishuvchi"], e: "Parallellik — asosiy shart." },
          { q: "1-tomondagi kesmalar 2 sm dan. 2-tomondagilar albatta 2 sm mi?", o: ["Yo‘q, faqat o‘zaro teng", "Ha", "Har doim kattaroq", "Har doim kichikroq"], e: "Ular o‘zaro teng, lekin uzunligi boshqa bo‘lishi mumkin." },
          { q: "Daftar chiziqlari lineykani teng bo‘laklarga bo‘lishi qaysi teoremaga asoslangan?", o: ["Fales", "Pifagor", "Viyet", "Tashqi burchak"], e: "Chiziqlar parallel va teng oraliqda." }
        ]
      },
      {
        id: "fales-tatbiq", title: "Fales teoremasi tatbiqlari", tag: "Kesmani teng bo‘laklarga bo‘lish",
        life: "40 sm taxtani o‘lchagichsiz 7 ta teng bo‘lakka bo‘lish kerak. 40 : 7 = 5,714... — noqulay son! Fales usuli bilan sirkul va chizg‘ichning o‘zi yetarli.",
        explain: "<p>Kesmani n ta teng bo‘lakka bo‘lish yasashi:</p><ol><li>A uchidan ixtiyoriy nur o‘tkazamiz.</li><li>Nurga sirkul bilan n ta bir xil kesma qo‘yamiz.</li><li>Oxirgi nuqtani B bilan tutashtiramiz.</li><li>Qolgan nuqtalardan shu kesmaga parallel chiziqlar o‘tkazamiz.</li></ol><p>Fales teoremasiga ko‘ra AB kesma n ta teng bo‘lakka bo‘linadi. Shu usul bilan kesmani berilgan nisbatda (masalan, 2 : 3) ham bo‘lish mumkin.</p>",
        rule: "Nurdagi teng kesmalar + parallellar ⇒ AB ham teng bo‘laklarga bo‘linadi.",
        demos: [{ type: "thales", mode: "divide" }],
        examples: [
          { q: "AB kesmani 2 : 3 nisbatda qanday bo‘lish mumkin?", steps: ["Nurga 2 + 3 = 5 ta teng kesma qo‘yamiz", "5-nuqtani B bilan tutashtiramiz", "2-nuqtadan parallel o‘tkazamiz — u AB ni 2 : 3 nisbatda bo‘ladi"], a: "5 ta teng kesma va 2-nuqtadan parallel" }
        ],
        quiz: [
          { q: "Kesmani 5 bo‘lakka bo‘lish uchun nurga nechta teng kesma qo‘yiladi?", o: ["5", "4", "6", "10"], e: "Bo‘laklar soniga teng." },
          { q: "Oxirgi nuqta qaysi nuqta bilan tutashtiriladi?", o: ["B", "A", "Nurning boshi", "O‘rtasi"], e: "Kesmaning ikkinchi uchi bilan." },
          { q: "Qolgan chiziqlar qanday o‘tkaziladi?", o: ["Parallel", "Perpendikulyar", "Ixtiyoriy", "A orqali"], e: "Fales teoremasi talabi." }
        ]
      },
      {
        id: "orta-chiziq", title: "Uchburchak va trapetsiyaning o‘rta chizig‘i", tag: "Yarmi va yarim yig‘indisi",
        life: "Ko‘l ikki tomonidagi A va C nuqtalar orasini to‘g‘ridan-to‘g‘ri o‘lchab bo‘lmaydi. Lekin quruqlikda B nuqtani tanlab, AB va BC o‘rtalarini (M, N) belgilasak, MN ni o‘lchab, ikkiga ko‘paytirsak — ko‘l kengligi tayyor!",
        explain: "<p><b>Uchburchak o‘rta chizig‘i</b> — ikki tomon o‘rtalarini tutashtiruvchi kesma. U uchinchi tomonga <b>parallel</b> va uning <b>yarmiga teng</b>: MN = " + F("AC", "2") + ".</p><p><b>Trapetsiya o‘rta chizig‘i</b> — yon tomonlar o‘rtalarini tutashtiradi. U asoslarga parallel va ularning <b>yarim yig‘indisiga</b> teng: m = " + F("a + b", "2") + ".</p><p>Har bir uchburchakda 3 ta o‘rta chiziq bor, ular uchburchakni 4 ta teng uchburchakka bo‘ladi.</p>",
        rule: "Uchburchak: MN ∥ AC, MN = AC/2.  Trapetsiya: m = (a + b)/2",
        demos: [{ type: "triangle", mode: "midline" }, { type: "quad", shape: "trapezoid" }],
        examples: [
          { q: "Uchburchak tomonlari 8, 10, 12 sm. O‘rta chiziqlaridan tuzilgan uchburchak perimetri?", steps: ["Har bir o‘rta chiziq tomonning yarmi: 4, 5, 6", "4 + 5 + 6"], a: "15 sm" },
          { q: "Trapetsiya o‘rta chizig‘i 11, asoslar ayirmasi 6. Asoslar?", steps: ["a + b = 22, a − b = 6", "a = 14, b = 8"], a: "14 va 8" }
        ],
        quiz: [
          { q: "AC = 18 sm bo‘lsa, o‘rta chiziq MN = ?", o: ["9 sm", "36 sm", "18 sm", "6 sm"], e: "Yarmi." },
          { q: "Asoslar 5 va 9. O‘rta chiziq?", o: ["7", "14", "4", "2"], e: "(5 + 9) : 2." },
          { q: "O‘rta chiziq uchinchi tomonga...", o: ["parallel", "perpendikulyar", "teng", "kesishadi"], e: "Va uning yarmiga teng." }
        ]
      },
      {
        id: "amaliy-tatbiq", title: "Amaliy mashq va tatbiq", tag: "Geometriya hayotda",
        life: "Bob davomida o‘rganilgan shakllar va teoremalar quruvchi, duradgor, dizayner va o‘lchovchilar ishida har kuni qo‘llaniladi. Keling, real vaziyatlarda qo‘llab ko‘ramiz.",
        explain: "<ul><li><b>Poydevor to‘g‘riligini tekshirish:</b> to‘rtburchak poydevor diagonallari teng bo‘lsa — u to‘g‘ri to‘rtburchak.</li><li><b>Ko‘l kengligini o‘lchash:</b> o‘rta chiziq yordamida — MN ni o‘lchab, 2 ga ko‘paytiramiz.</li><li><b>Taxtani teng bo‘lish:</b> Fales usuli.</li><li><b>Parket va plitka:</b> muntazam ko‘pburchaklardan faqat ichki burchagi 360° ning bo‘luvchisi bo‘lganlari (uchburchak 60°, kvadrat 90°, oltiburchak 120°) tekislikni bo‘shliqsiz qoplaydi.</li></ul>",
        rule: "Diagonallar teng → to‘g‘ri burchak; o‘rta chiziq = asos/2; Fales → teng bo‘laklar.",
        demos: [{ type: "triangle", mode: "midline" }, { type: "thales", mode: "divide" }],
        examples: [
          { q: "Poydevor tomonlari 6 m va 8 m, diagonallari 10 m va 10,3 m. To‘g‘ri burchaklimi?", steps: ["To‘g‘ri to‘rtburchakda diagonallar teng bo‘lishi kerak", "10 ≠ 10,3"], a: "Yo‘q — burchaklarni tuzatish kerak" },
          { q: "Ko‘l chetidagi A va C nuqtalar uchun MN = 85 m o‘lchandi. AC = ?", steps: ["MN — o‘rta chiziq", "AC = 2 · 85"], a: "170 m" }
        ],
        quiz: [
          { q: "Qaysi muntazam ko‘pburchak bilan pol bo‘shliqsiz qoplanadi?", o: ["Oltiburchak", "Beshburchak", "Sakkizburchak", "Yettiburchak"], e: "120° · 3 = 360°." },
          { q: "Quruvchi to‘g‘ri burchakni nima bilan tekshiradi?", o: ["Diagonallar tengligi", "Faqat tomonlar", "Rang", "Balandlik"], e: "To‘g‘ri to‘rtburchak diagonallari teng." },
          { q: "MN = 40 m o‘rta chiziq bo‘lsa, asos?", o: ["80 m", "20 m", "40 m", "120 m"], e: "2 · 40." }
        ]
      }
    ]
  });

  window.AMALIY_ADD("8", "8-sinf", {
    id: "fizika", name: "Fizika", icon: "⚛️", color: "#06b6d4", note: "Namuna mavzu",
    topics: [
      {
        id: "erkin-tushish", title: "Jismlarning erkin tushishi", tag: "Namuna mavzu · tezlanish g = 9,8 m/s²",
        life: "Daraxtdan olma tushadi, qo‘lingizdan telefon tushib ketadi, sharshara suvi pastga oqadi — bularning barchasida Yer tortishish kuchi ishlaydi. Ko‘prikdan tosh tashlab, uning suvga tushish vaqtini o‘lchasangiz, ko‘prik balandligini hisoblash mumkin!",
        explain: "<p><b>Erkin tushish</b> — jismning faqat og‘irlik kuchi ta’sirida (havo qarshiligisiz) harakati.</p><p>Galileo Galiley tajribalar bilan ko‘rsatdi: havo qarshiligi bo‘lmasa, <b>barcha jismlar — og‘ir ham, yengil ham — bir xil tezlanish bilan</b> tushadi. Vakuumli trubkada pat va tanga bir vaqtda tushadi.</p><p>Erkin tushish tezlanishi Yerda <b>g ≈ 9,8 m/s²</b>: har soniyada tezlik 9,8 m/s ga ortadi.</p><ul><li>Tezlik: <b>v = g · t</b></li><li>Bosib o‘tilgan yo‘l: <b>h = " + F("g · t²", "2") + "</b></li><li>Tushish vaqti: <b>t = √(2h/g)</b></li></ul><p>Oyda g ≈ 1,6 m/s² — u yerda jismlar 6 marta sekinroq tezlashadi.</p>",
        rule: "v = gt,  h = gt²/2,  t = √(2h/g),  g ≈ 9,8 m/s²",
        demos: [{ type: "freeFall" }],
        examples: [
          { q: "Tosh 3 s da yerga tushdi. Qanday balandlikdan tashlangan? (g = 10 m/s²)", steps: ["h = g · t² / 2", "h = 10 · 9 / 2"], a: "45 m" },
          { q: "20 m balandlikdan tushgan jism yerga qanday tezlik bilan uriladi? (g = 10)", steps: ["t = √(2 · 20 / 10) = 2 s", "v = g · t = 10 · 2"], a: "20 m/s (72 km/soat)" }
        ],
        quiz: [
          { q: "Havosiz muhitda pat va tosh qanday tushadi?", o: ["Bir vaqtda", "Tosh oldin", "Pat oldin", "Pat tushmaydi"], e: "Tezlanish massaga bog‘liq emas." },
          { q: "2 soniyadan keyin tezlik (g = 10)?", o: ["20 m/s", "10 m/s", "40 m/s", "5 m/s"], e: "v = gt." },
          { q: "Oyda erkin tushish tezlanishi?", o: ["≈ 1,6 m/s²", "≈ 9,8 m/s²", "0", "≈ 20 m/s²"], e: "Oy massasi kichik." }
        ]
      }
    ]
  });
})();
