/* 5-sinf Matematika — 1-chorak mavzulari. */
window.AMALIY_ADD("5", "5-sinf", {
  id: "matematika", name: "Matematika", icon: "🧮", color: "#22c55e",
  topics: [
    {
      id: "sonlar-100-ming", title: "100 000 gacha bo‘lgan sonlar", tag: "Takrorlash: xonalar va sinflar",
      life: "Toshkentdagi stadion <b>34 000</b> kishini sig‘diradi, maktabimiz kutubxonasida <b>12 450</b> ta kitob bor. Bunday katta sonlarni to‘g‘ri o‘qish va yozish uchun har bir raqam qaysi <b>xonada</b> turganini bilish kerak.",
      explain: "<p>Sonni yozishda raqamning <b>o‘rni</b> uning qiymatini belgilaydi. O‘ngdan chapga: <b>birlar, o‘nlar, yuzlar</b> — bu birlar sinfi; keyin <b>minglar, o‘n minglar, yuz minglar</b> — minglar sinfi.</p><p>Masalan, 45 307 sonida 4 — o‘n minglar xonasida, ya’ni 40 000 ni bildiradi; 0 — o‘nlar xonasi bo‘sh ekanini ko‘rsatadi.</p><p>Katta sonni oson o‘qish uchun uni o‘ngdan boshlab <b>uch xonadan</b> guruhlab yozamiz: 45 307.</p>",
      rule: "Raqamning qiymati = raqam × xona birligi. 45 307 = 4·10 000 + 5·1 000 + 3·100 + 0·10 + 7",
      demos: [{ type: "placeValue", cols: 5, start: 45307 }],
      examples: [
        { q: "36 052 sonini xona qo‘shiluvchilari yig‘indisi ko‘rinishida yozing.", steps: ["3 — o‘n minglar: 30 000", "6 — minglar: 6 000", "0 — yuzlar xonasi bo‘sh", "5 — o‘nlar: 50, 2 — birlar: 2"], a: "30 000 + 6 000 + 50 + 2" },
        { q: "“Yetmish ming to‘rt yuz besh” sonini raqamlar bilan yozing.", steps: ["Minglar sinfi: yetmish ming → 70", "Birlar sinfi: to‘rt yuz besh → 405", "Birlashtiramiz: 70 | 405"], a: "70 405" }
      ],
      quiz: [
        { q: "58 214 sonida 8 raqami qaysi xonada?", o: ["Minglar", "O‘n minglar", "Yuzlar", "O‘nlar"], e: "O‘ngdan sanaymiz: 4 — birlar, 1 — o‘nlar, 2 — yuzlar, 8 — minglar." },
        { q: "90 000 + 400 + 6 = ?", o: ["90 406", "94 006", "90 460", "9 406"], e: "Minglar xonasi va o‘nlar xonasi bo‘sh — ularga 0 yoziladi." },
        { q: "Eng katta besh xonali son qaysi?", o: ["99 999", "100 000", "99 990", "10 000"], e: "100 000 — olti xonali son." }
      ]
    },
    {
      id: "sonlar-million", title: "1 milliongacha bo‘lgan sonlar", tag: "Yuz minglar va million",
      life: "Viloyatimiz aholisi taxminan <b>1 900 000</b> kishi, avtomobil narxi <b>285 000 000</b> so‘m bo‘lishi mumkin. 1 million — bu 1 000 ta mingtalik: agar har kuni 1 000 qadam yursangiz, 1 000 000 qadamga roppa-rosa 1 000 kunda yetasiz!",
      explain: "<p>Minglar sinfining eng katta xonasi — <b>yuz minglar</b>. 999 999 dan keyin keladigan son — <b>1 000 000 (bir million)</b>. U yetti xonali son.</p><p>Olti xonali sonni o‘qishda avval minglar sinfini (“... ming”), keyin birlar sinfini o‘qiymiz: 507 230 — <i>besh yuz yetti ming ikki yuz o‘ttiz</i>.</p>",
      rule: "1 000 000 = 1 000 · 1 000. Sonni o‘qishda sinflar chapdan o‘ngga o‘qiladi: avval minglar, keyin birlar.",
      demos: [{ type: "placeValue", cols: 7, start: 507230 }],
      examples: [
        { q: "Besh yuz yetti ming o‘ttiz sonini yozing.", steps: ["Minglar sinfi: besh yuz yetti → 507", "Birlar sinfi: o‘ttiz → 030 (uch xona to‘ldiriladi!)", "507 | 030"], a: "507 030" },
        { q: "999 999 ga 1 qo‘shsak nima bo‘ladi?", steps: ["Birlar: 9 + 1 = 10 → 0 yozib, 1 ni keyingi xonaga o‘tkazamiz", "Bu jarayon barcha xonalarda takrorlanadi", "Hosil bo‘ladi: 1 va oltita nol"], a: "1 000 000 — bir million" }
      ],
      quiz: [
        { q: "Bir million nechta nol bilan yoziladi?", o: ["6 ta", "5 ta", "7 ta", "3 ta"], e: "1 000 000 — birdan keyin 6 ta nol." },
        { q: "304 050 qanday o‘qiladi?", o: ["Uch yuz to‘rt ming ellik", "Uch yuz qirq ming besh yuz", "O‘ttiz to‘rt ming ellik", "Uch yuz to‘rt ming besh yuz"], e: "Minglar sinfi 304, birlar sinfi 050." },
        { q: "1 000 000 dan 1 kichik son?", o: ["999 999", "99 999", "100 000", "999 990"], e: "Eng katta olti xonali son — 999 999." }
      ]
    },
    {
      id: "sonlar-10-million", title: "10 milliongacha bo‘lgan sonlar", tag: "Millionlar sinfi",
      life: "O‘zbekistonda <b>36 000 000</b> dan ortiq odam yashaydi, Toshkent aholisi esa <b>3 000 000</b> dan ortiq. Statistika, byudjet va xaritalarda millionlar bilan ishlaymiz.",
      explain: "<p>Millionlar sinfi: <b>millionlar, o‘n millionlar, yuz millionlar</b>. 10 000 000 (o‘n million) — sakkiz xonali son.</p><p>7 450 300 sonini o‘qiymiz: <i>yetti million to‘rt yuz ellik ming uch yuz</i>. Har bir sinfni alohida o‘qib, oxiriga sinf nomini qo‘shamiz.</p><p>Sonlarni taqqoslashda avval xonalar sonini, keyin chapdan bir xil xonadagi raqamlarni solishtiramiz.</p>",
      rule: "Sinflar: birlar (3 xona) → minglar (3 xona) → millionlar. 10 000 000 = 10 · 1 000 000",
      demos: [{ type: "placeValue", cols: 8, start: 7450300 }],
      examples: [
        { q: "Qaysi katta: 6 999 999 yoki 7 000 001?", steps: ["Ikkalasi ham yetti xonali", "Chapdan birinchi raqamlar: 6 va 7", "7 > 6"], a: "7 000 001 katta" },
        { q: "Ikki million besh yuz ming to‘rtni yozing.", steps: ["Millionlar: 2", "Minglar: 500", "Birlar: 004", "2 | 500 | 004"], a: "2 500 004" }
      ],
      quiz: [
        { q: "4 080 600 sonida nechta million bor?", o: ["4", "40", "408", "80"], e: "Millionlar sinfida faqat 4 raqami turibdi." },
        { q: "O‘n million nechta xonali son?", o: ["8", "7", "10", "9"], e: "10 000 000 — 1 va yettita nol, jami 8 ta raqam." },
        { q: "3 000 000 + 50 000 + 7 = ?", o: ["3 050 007", "3 500 007", "3 050 070", "350 007"], e: "Minglar sinfi 050, birlar sinfi 007." }
      ]
    },
    {
      id: "kopaytirish-10", title: "Sonni 10, 100 va 1000 ga ko‘paytirish", tag: "Oxiriga nol qo‘shish qoidasi",
      life: "1 ta daftar 4 500 so‘m. Sinfga <b>10</b> ta, maktabga <b>1000</b> ta daftar kerak bo‘lsa, hisobni bir zumda qilish mumkin: 4 500 · 1000 = 4 500 000 so‘m.",
      explain: "<p>Sonni 10 ga ko‘paytirganda har bir raqam bir xona <b>chapga</b> suriladi: birlar o‘nlarga, o‘nlar yuzlarga aylanadi. Bo‘shab qolgan birlar xonasiga <b>0</b> yoziladi.</p><p>100 ga ko‘paytirsak — ikki xona suriladi (2 ta nol), 1000 ga — uch xona (3 ta nol).</p>",
      rule: "Sonni 10, 100, 1000 ga ko‘paytirish uchun uning oxiriga mos ravishda 1, 2, 3 ta nol yoziladi.",
      demos: [{ type: "times10", mode: "mul", start: 4507 }],
      examples: [
        { q: "305 · 100 = ?", steps: ["100 da 2 ta nol bor", "305 ning oxiriga ikkita nol yozamiz"], a: "30 500" },
        { q: "Bir quti 1000 ta qog‘oz. 48 quti qog‘ozda nechta varaq bor?", steps: ["48 · 1000", "48 ning oxiriga uchta nol"], a: "48 000 varaq" }
      ],
      quiz: [
        { q: "720 · 10 = ?", o: ["7 200", "72 000", "720", "7 020"], e: "Bitta nol qo‘shiladi." },
        { q: "56 · 1000 = ?", o: ["56 000", "5 600", "560 000", "50 600"], e: "Uchta nol qo‘shiladi." },
        { q: "Qaysi son 100 ga ko‘paytirilganda 40 300 chiqadi?", o: ["403", "4 030", "43", "4 003"], e: "403 · 100 = 40 300." }
      ]
    },
    {
      id: "kopaytirish-yuzlik", title: "Sonni o‘nlik, yuzlik va mingliklarga ko‘paytirish", tag: "30, 400, 2000 kabi sonlarga",
      life: "Avtobus soatiga 60 km yuradi. 3 soatda u 60 · 3 = 180 km yuradi. Bir paket sharbat 3 000 so‘m — 40 ta paket 3 000 · 40 = 120 000 so‘m. Bunday hisoblarni og‘zaki bajarish qulay usuli bor!",
      explain: "<p>30, 400, 2000 kabi sonlar — bu “raqam × 10, 100, 1000”. Masalan: 400 = 4 · 100.</p><p>Demak, 23 · 400 = 23 · 4 · 100: avval <b>nolsiz raqamga</b> ko‘paytiramiz (23 · 4 = 92), keyin oxiriga <b>nollarni</b> qo‘shamiz → 9 200.</p><p>Agar ikkala sonning oxirida nollar bo‘lsa, ularni chetga olib, ko‘paytirib, keyin hammasini birga qo‘shamiz: 120 · 30 = 12 · 3 va 2 ta nol = 3 600.</p>",
      rule: "a · 400 = (a · 4) · 100. Nollarni chetga olib, ko‘paytirib, keyin qaytarib qo‘shamiz.",
      demos: [{ type: "times10", mode: "mul", round: true, start: 23 }],
      examples: [
        { q: "35 · 200 = ?", steps: ["200 = 2 · 100", "35 · 2 = 70", "70 ning oxiriga 2 ta nol"], a: "7 000" },
        { q: "1 ta kitob 25 000 so‘m. 30 ta kitob qancha?", steps: ["25 000 · 30: nollar soni 3 + 1 = 4", "25 · 3 = 75", "75 ga 4 ta nol qo‘shamiz"], a: "750 000 so‘m" }
      ],
      quiz: [
        { q: "14 · 300 = ?", o: ["4 200", "420", "42 000", "1 700"], e: "14 · 3 = 42, oxiriga 2 ta nol." },
        { q: "600 · 50 = ?", o: ["30 000", "3 000", "300 000", "3 500"], e: "6 · 5 = 30 va 3 ta nol." },
        { q: "Mashina soatiga 80 km yursa, 6 soatda qancha yuradi?", o: ["480 km", "48 km", "4 800 km", "86 km"], e: "8 · 6 = 48, bitta nol qo‘shamiz." }
      ]
    },
    {
      id: "bolish-10", title: "Sonni 10, 100 va 1000 ga bo‘lish", tag: "Oxiridagi nollarni olib tashlash",
      life: "Maktabga <b>25 000</b> ta varaq keldi, ular 100 tadan pachkalarga joylanadi. Nechta pachka bo‘ladi? 25 000 : 100 = 250. Yoki 3 000 metr — necha kilometr? 3 000 : 1000 = 3 km.",
      explain: "<p>Bo‘lish — ko‘paytirishga teskari amal. 10 ga bo‘lganda har bir raqam bir xona <b>o‘ngga</b> suriladi, oxiridagi bitta nol “tushib qoladi”.</p><p>Agar oxirida yetarli nol bo‘lmasa, qolgan raqamlar <b>qoldiq</b> bo‘ladi: 4 507 : 100 = 45 (qoldiq 7).</p>",
      rule: "Oxiri nollar bilan tugagan sonni 10, 100, 1000 ga bo‘lish uchun oxiridan mos ravishda 1, 2, 3 ta nol olib tashlanadi.",
      demos: [{ type: "times10", mode: "div", start: 84000 }],
      examples: [
        { q: "56 000 : 1000 = ?", steps: ["1000 da 3 ta nol", "56 000 ning oxiridan 3 ta nolni olib tashlaymiz"], a: "56" },
        { q: "7 300 sm necha metr? (1 m = 100 sm)", steps: ["7 300 : 100", "Oxiridan 2 ta nol olib tashlaymiz"], a: "73 m" }
      ],
      quiz: [
        { q: "9 000 : 10 = ?", o: ["900", "90", "9", "90 000"], e: "Bitta nol olib tashlanadi." },
        { q: "400 000 : 1000 = ?", o: ["400", "40", "4 000", "4"], e: "Uchta nol olib tashlanadi." },
        { q: "5 kg = 5 000 g. 12 000 g necha kg?", o: ["12 kg", "120 kg", "1,2 kg", "1 200 kg"], e: "12 000 : 1000 = 12." }
      ]
    },
    {
      id: "bolish-yuzlik", title: "Sonni o‘nlik, yuzlik va mingliklarga bo‘lish", tag: "300, 4000 kabi sonlarga bo‘lish",
      life: "Sinf ekskursiyasi uchun 840 000 so‘m yig‘ildi. Bir kishilik chipta 40 000 so‘m bo‘lsa, nechta chipta olish mumkin? 840 000 : 40 000 = 84 : 4 = 21 ta.",
      explain: "<p>300 = 3 · 100 bo‘lgani uchun 8 400 : 300 ni ikki bosqichda bajaramiz: avval <b>100 ga</b> (nollarni olib tashlaymiz) → 84, keyin <b>3 ga</b> → 28.</p><p>Bo‘linuvchi va bo‘luvchidan <b>bir xil sondagi</b> nollarni olib tashlash mumkin — bo‘linma o‘zgarmaydi: 840 000 : 40 000 = 84 : 4.</p>",
      rule: "a : 300 = (a : 100) : 3. Bo‘linuvchi va bo‘luvchi oxiridan teng miqdordagi nollarni o‘chirsa bo‘ladi.",
      demos: [{ type: "times10", mode: "div", round: true, start: 8400 }],
      examples: [
        { q: "6 300 : 70 = ?", steps: ["Ikkalasidan bittadan nol o‘chiramiz: 630 : 7", "630 : 7 = 90"], a: "90" },
        { q: "Ombordagi 48 000 kg un 4 000 kg dan yuk mashinalariga ortildi. Nechta mashina kerak?", steps: ["48 000 : 4 000", "Uchtadan nol o‘chiramiz: 48 : 4", "= 12"], a: "12 ta mashina" }
      ],
      quiz: [
        { q: "2 400 : 600 = ?", o: ["4", "40", "400", "6"], e: "24 : 6 = 4." },
        { q: "90 000 : 300 = ?", o: ["300", "30", "3 000", "270"], e: "900 : 3 = 300." },
        { q: "1 500 : 50 = ?", o: ["30", "300", "3", "75"], e: "150 : 5 = 30." }
      ]
    },
    {
      id: "tartib-qavssiz", title: "Qavssiz ifodalarda amallarni bajarish tartibi", tag: "Avval × va :, keyin + va −",
      life: "Do‘konda 3 ta non (har biri 4 000 so‘m) va 1 ta sut (12 000 so‘m) oldingiz. Jami: 3 · 4 000 + 12 000. Agar chapdan o‘ngga “ko‘r-ko‘rona” hisoblasak: (3 · 4000 + 12000) to‘g‘ri, lekin 12 000 + 3 · 4 000 ni chapdan hisoblasak 60 000 chiqadi — bu xato! Shuning uchun amallar tartibi bor.",
      explain: "<p>Qavssiz ifodada:</p><ol><li>Avval <b>ko‘paytirish va bo‘lish</b> — chapdan o‘ngga, qaysi biri oldin kelsa.</li><li>Keyin <b>qo‘shish va ayirish</b> — chapdan o‘ngga.</li></ol><p>Ko‘paytirish va bo‘lish “katta” amallar, qo‘shish va ayirish — “kichik” amallar. Katta amallar birinchi bajariladi.</p>",
      rule: "1) × va : (chapdan o‘ngga) → 2) + va − (chapdan o‘ngga)",
      demos: [{ type: "orderOps", examples: ["120 − 45 : 5 × 3 + 18", "72 : 8 + 6 × 7 − 15", "500 − 25 × 4 : 10 + 3", "12 000 + 3 × 4 000"] }],
      examples: [
        { q: "36 + 64 : 8 − 2 × 5 = ?", steps: ["64 : 8 = 8", "2 × 5 = 10", "36 + 8 = 44", "44 − 10 = 34"], a: "34" },
        { q: "100 : 4 × 2 = ?", steps: ["Bo‘lish va ko‘paytirish teng kuchli — chapdan o‘ngga", "100 : 4 = 25", "25 × 2 = 50"], a: "50 (100 : 8 emas!)" }
      ],
      quiz: [
        { q: "20 + 30 × 2 = ?", o: ["80", "100", "52", "70"], e: "Avval 30 × 2 = 60, keyin 20 + 60." },
        { q: "48 : 6 × 2 = ?", o: ["16", "4", "12", "96"], e: "Chapdan o‘ngga: 48 : 6 = 8, 8 × 2 = 16." },
        { q: "90 − 10 × 5 + 4 = ?", o: ["44", "404", "36", "84"], e: "10 × 5 = 50; 90 − 50 = 40; 40 + 4 = 44." }
      ]
    },
    {
      id: "tartib-qavsli", title: "Qavsli ifodalarda amallarni bajarish tartibi", tag: "Qavs — birinchi navbat",
      life: "Uch do‘st 15 000 va 25 000 so‘mlik ikki sovg‘aning pulini teng bo‘lishmoqchi: (15 000 + 25 000) : 4 emas, (15 000 + 25 000) : 3. Qavs “avval shuni hisobla” degan belgi.",
      explain: "<p>Qavs ichidagi amallar <b>birinchi</b> bajariladi. Qavs ichida ham odatdagi tartib saqlanadi: avval × va :, keyin + va −.</p><p>Bir nechta qavs bo‘lsa, har birini alohida hisoblaymiz. Qavs ichida qavs bo‘lsa — <b>eng ichkisidan</b> boshlaymiz.</p>",
      rule: "1) Qavslar ichi → 2) × va : → 3) + va −",
      demos: [{ type: "orderOps", examples: ["(240 − 40) : (12 − 7) × 3", "500 − (36 + 64) × 4", "(15 + 25) × (60 : 12)", "(15 000 + 25 000) : 4"] }],
      examples: [
        { q: "(48 + 32) : (13 − 5) = ?", steps: ["1-qavs: 48 + 32 = 80", "2-qavs: 13 − 5 = 8", "80 : 8 = 10"], a: "10" },
        { q: "200 − (30 + 20 × 2) = ?", steps: ["Qavs ichida avval ×: 20 × 2 = 40", "30 + 40 = 70", "200 − 70 = 130"], a: "130" }
      ],
      quiz: [
        { q: "(20 + 30) × 2 = ?", o: ["100", "80", "52", "70"], e: "Qavs: 50, keyin 50 × 2." },
        { q: "60 : (2 + 4) = ?", o: ["10", "34", "36", "15"], e: "2 + 4 = 6; 60 : 6 = 10." },
        { q: "Qaysi ifodaning qiymati 25?", o: ["(3 + 2) × 5", "3 + 2 × 5", "3 × 2 + 5", "3 + 2 + 5"], e: "(3 + 2) × 5 = 5 × 5 = 25." }
      ]
    },
    {
      id: "masala-natural", title: "Matnli masalalar (natural sonlar)", tag: "Kesma modeli bilan yechish",
      life: "Masala — hayotiy vaziyatning matematik tilidagi tavsifi: xarid, yo‘l, vaqt, ish. Masalani <b>chizma (kesma modeli)</b> bilan tasvirlasak, yechim ko‘zga ko‘rinib qoladi.",
      explain: "<p>Masala yechish rejasi:</p><ol><li>Masalani diqqat bilan o‘qing: <b>nima ma’lum</b>, <b>nima so‘ralyapti</b>?</li><li>Kesma modeli chizing: har bir miqdorni uzunlik bilan tasvirlang.</li><li>Amallarni tanlang va bajaring.</li><li>Javobni tekshiring: masala shartiga mos keladimi?</li></ol>",
      rule: "“... ko‘p” → qo‘shish, “... kam” → ayirish, “... marta ko‘p” → ko‘paytirish, “teng bo‘ldi” → bo‘lish.",
      demos: [{ type: "wordProblem", problems: [
        { text: "Alida 1 250 so‘m, Valida esa Alidan 750 so‘m ko‘p pul bor. Ikkalasida jami qancha pul bor?",
          bars: [{ label: "Ali", parts: [{ v: 1250, t: "1 250" }] }, { label: "Vali", parts: [{ v: 1250, t: "1 250", c: "#22c55e" }, { v: 750, t: "+750", c: "#f59e0b" }] }],
          steps: ["Valida: 1 250 + 750 = 2 000 so‘m", "Jami: 1 250 + 2 000 = 3 250 so‘m"], answer: "3 250 so‘m" },
        { text: "Kutubxonada 2 400 ta kitob bor. Badiiy kitoblar darsliklardan 3 marta ko‘p. Nechta darslik bor?",
          bars: [{ label: "Darslik", parts: [{ v: 1, t: "?" }] }, { label: "Badiiy", parts: [{ v: 1, t: "?" }, { v: 1, t: "?" }, { v: 1, t: "?" }] }],
          steps: ["Jami 1 + 3 = 4 ta teng bo‘lak", "Bir bo‘lak: 2 400 : 4 = 600", "Darsliklar — 1 bo‘lak = 600, badiiy — 3 bo‘lak = 1 800"], answer: "600 ta darslik" },
        { text: "Poyezd 4 soatda 320 km yo‘l bosdi. Shu tezlikda 7 soatda qancha yo‘l bosadi?",
          bars: [{ label: "4 soat", parts: [80, 80, 80, 80].map((v) => ({ v, t: "80", c: "#3b82f6" })), total: "320 km" }, { label: "7 soat", parts: [1, 2, 3, 4, 5, 6, 7].map(() => ({ v: 80, t: "80", c: "#22c55e" })), total: "?" }],
          steps: ["1 soatda: 320 : 4 = 80 km", "7 soatda: 80 · 7 = 560 km"], answer: "560 km" }
      ] }],
      examples: [
        { q: "Bog‘da 120 tup olma, nok esa olmadan 35 tup kam. Bog‘da jami nechta daraxt?", steps: ["Nok: 120 − 35 = 85", "Jami: 120 + 85 = 205"], a: "205 tup" }
      ],
      quiz: [
        { q: "Ruchka 3 000 so‘m, daftar ruchkadan 2 marta qimmat. Daftar qancha?", o: ["6 000 so‘m", "5 000 so‘m", "1 500 so‘m", "3 002 so‘m"], e: "“Marta qimmat” — ko‘paytirish: 3 000 · 2." },
        { q: "36 ta konfet 4 bolaga teng bo‘lindi. Har biriga nechta?", o: ["9", "8", "32", "40"], e: "36 : 4 = 9." },
        { q: "Velosipedchi soatiga 15 km yuradi. 60 km ni necha soatda bosadi?", o: ["4 soat", "45 soat", "5 soat", "900 soat"], e: "60 : 15 = 4." }
      ]
    },
    {
      id: "bolish-kasr", title: "Sonlarni bo‘lishni kasr ko‘rinishida ifodalash", tag: "a : b = a/b",
      life: "3 ta pitsani 4 do‘st teng bo‘lishmoqchi. Har biriga butun pitsa yetmaydi — har kim [[3/4]] pitsa oladi. Bo‘lish natijasi butun son chiqmasa, uni <b>kasr</b> bilan yozamiz.",
      explain: "<p>Har qanday bo‘lishni kasr ko‘rinishida yozish mumkin: <b>bo‘linuvchi — surat</b>, <b>bo‘luvchi — maxraj</b>.</p><p>3 : 4 = [[3/4]], 7 : 2 = [[7/2]] = 3 [[1/2]], 8 : 4 = [[8/4]] = 2.</p><p>Kasr chizig‘i — bu aslida <b>bo‘lish belgisi</b>!</p>",
      rule: "a : b = [[a/b]] (b ≠ 0). Kasr chizig‘i bo‘lish belgisini bildiradi.",
      demos: [{ type: "shareDivision", a: 3, b: 4 }],
      examples: [
        { q: "5 ta tarvuzni 8 kishiga teng bo‘lsak, har kim qancha oladi?", steps: ["5 : 8", "Bo‘linuvchi suratga, bo‘luvchi maxrajga"], a: "[[5/8]] tarvuz" },
        { q: "7 m arqonni 3 teng bo‘lakka kesdik. Har bo‘lak uzunligi?", steps: ["7 : 3 = [[7/3]]", "7 da 3 ikki marta bor, 1 qoladi", "[[7/3]] = 2 [[1/3]]"], a: "2 [[1/3]] m" }
      ],
      quiz: [
        { q: "2 : 9 ni kasr ko‘rinishida yozing.", o: ["[[2/9]]", "[[9/2]]", "[[2/11]]", "[[1/9]]"], e: "Bo‘linuvchi (2) — surat." },
        { q: "[[12/4]] = ?", o: ["3", "4", "8", "48"], e: "12 : 4 = 3." },
        { q: "4 ta non 5 kishiga teng bo‘lindi. Har kimga qancha?", o: ["[[4/5]] non", "[[5/4]] non", "1 non", "[[1/5]] non"], e: "4 : 5 = [[4/5]]." }
      ]
    },
    {
      id: "onli-kasr", title: "Oddiy kasrni o‘nli kasrga aylantirish", tag: "[[3/4]] = 0,75",
      life: "Do‘konda narx “0,5 kg” yoki “1,25 l” deb yoziladi, tarozida ham o‘nli kasr ko‘rinadi. [[1/2]] kg = 0,5 kg, [[3/4]] l = 0,75 l. Oddiy kasrni o‘nli kasrga o‘tkazishni bilish kundalik hayotda juda kerak.",
      explain: "<p>Agar maxrajni <b>10, 100 yoki 1000</b> ga yetkazish mumkin bo‘lsa, kasrning surat va maxrajini bir xil songa ko‘paytiramiz:</p><p>[[3/4]] = [[3·25/4·25]] = [[75/100]] = 0,75.</p><p>Har doim ishlaydigan usul — <b>suratni maxrajga bo‘lish</b>: 3 : 4 = 0,75.</p>",
      rule: "[[a/b]] = a : b. Maxraj 10 bo‘lsa — verguldan keyin 1 xona, 100 bo‘lsa — 2 xona, 1000 bo‘lsa — 3 xona.",
      demos: [{ type: "decimalGrid" }],
      examples: [
        { q: "[[2/5]] ni o‘nli kasrga aylantiring.", steps: ["5 · 2 = 10 — maxrajni 10 ga yetkazamiz", "Surat: 2 · 2 = 4", "[[4/10]] = 0,4"], a: "0,4" },
        { q: "[[7/20]] = ?", steps: ["20 · 5 = 100", "7 · 5 = 35", "[[35/100]] = 0,35"], a: "0,35" }
      ],
      quiz: [
        { q: "[[1/4]] = ?", o: ["0,25", "0,4", "1,4", "0,14"], e: "[[25/100]] = 0,25." },
        { q: "[[3/10]] = ?", o: ["0,3", "3,10", "0,03", "0,310"], e: "Maxraj 10 — verguldan keyin bitta raqam." },
        { q: "0,5 kg qaysi kasrga teng?", o: ["[[1/2]] kg", "[[1/5]] kg", "[[5/100]] kg", "[[1/50]] kg"], e: "0,5 = [[5/10]] = [[1/2]]." }
      ]
    },
    {
      id: "kasr-qoshish", title: "Kasrlarni qo‘shish va ayirish", tag: "Takrorlash: maxrajlari bir xil kasrlar",
      life: "Onangiz tortning [[2/8]] qismini, siz [[3/8]] qismini yedingiz. Jami [[5/8]] qismi yeyildi, [[3/8]] qismi qoldi. Bo‘laklar bir xil kattalikda bo‘lgani uchun ularni shunchaki sanaymiz.",
      explain: "<p>Maxrajlari bir xil kasrlarda bo‘laklar bir xil o‘lchamda. Shuning uchun faqat <b>bo‘laklar sonini (suratlarni)</b> qo‘shamiz yoki ayiramiz, maxraj o‘zgarmaydi.</p><p>Natija noto‘g‘ri kasr bo‘lsa, butun qismini ajratamiz: [[7/5]] = 1 [[2/5]]. Qisqarsa — qisqartiramiz: [[4/8]] = [[1/2]].</p>",
      rule: "[[a/n]] + [[b/n]] = [[a+b/n]],  [[a/n]] − [[b/n]] = [[a−b/n]]",
      demos: [{ type: "fracAdd", mode: "simple" }],
      examples: [
        { q: "[[5/12]] + [[11/12]] = ?", steps: ["Suratlar: 5 + 11 = 16", "[[16/12]] — noto‘g‘ri kasr", "16 : 12 = 1 (qoldiq 4) → 1 [[4/12]] = 1 [[1/3]]"], a: "1 [[1/3]]" },
        { q: "Idishda [[9/10]] l sut bor edi, [[4/10]] l ichildi. Qancha qoldi?", steps: ["[[9/10]] − [[4/10]] = [[5/10]]", "Qisqartiramiz: [[5/10]] = [[1/2]]"], a: "[[1/2]] l" }
      ],
      quiz: [
        { q: "[[2/7]] + [[3/7]] = ?", o: ["[[5/7]]", "[[5/14]]", "[[6/7]]", "[[5/49]]"], e: "Maxraj o‘zgarmaydi!" },
        { q: "[[8/9]] − [[5/9]] = ?", o: ["[[1/3]]", "[[3/0]]", "[[13/9]]", "[[3/18]]"], e: "[[3/9]] = [[1/3]]." },
        { q: "[[4/5]] + [[3/5]] = ?", o: ["1 [[2/5]]", "[[7/10]]", "1 [[3/5]]", "[[1/5]]"], e: "[[7/5]] = 1 [[2/5]]." }
      ]
    },
    {
      id: "aralash-qoshish", title: "Aralash sonlarni qo‘shish va ayirish", tag: "Butun va kasr qismlar alohida",
      life: "Yo‘lning 2 [[3/4]] km ini piyoda, 1 [[2/4]] km ini velosipedda bosib o‘tdingiz. Jami: 4 [[1/4]] km. Retseptda 1 [[1/2]] stakan un va [[3/4]] stakan shakar — aralash sonlar oshxonada ham ko‘p uchraydi.",
      explain: "<p>Aralash son = butun qism + kasr qism. 2 [[3/4]] = 2 + [[3/4]].</p><p><b>Qo‘shish:</b> butunlarni alohida, kasrlarni alohida qo‘shamiz. Kasr qism 1 dan oshsa, undan 1 butun ajratib, butunlarga qo‘shamiz.</p><p><b>Ayirish:</b> agar kamayuvchining kasr qismi kichik bo‘lsa, uning butun qismidan 1 ni “qarzga olib”, kasrga aylantiramiz: 3 [[1/5]] = 2 [[6/5]].</p>",
      rule: "Butunlar + butunlar, kasrlar + kasrlar. Ayirishda kasr yetmasa — 1 butunni maydalaymiz.",
      demos: [{ type: "fracAdd", mode: "mixed" }],
      examples: [
        { q: "3 [[5/8]] + 1 [[7/8]] = ?", steps: ["Butunlar: 3 + 1 = 4", "Kasrlar: [[5/8]] + [[7/8]] = [[12/8]] = 1 [[4/8]]", "4 + 1 [[4/8]] = 5 [[4/8]] = 5 [[1/2]]"], a: "5 [[1/2]]" },
        { q: "5 [[1/6]] − 2 [[5/6]] = ?", steps: ["[[1/6]] dan [[5/6]] ni ayirib bo‘lmaydi", "5 [[1/6]] = 4 [[7/6]]", "4 − 2 = 2, [[7/6]] − [[5/6]] = [[2/6]] = [[1/3]]"], a: "2 [[1/3]]" }
      ],
      quiz: [
        { q: "1 [[2/5]] + 2 [[1/5]] = ?", o: ["3 [[3/5]]", "3 [[3/10]]", "2 [[3/5]]", "4 [[3/5]]"], e: "1 + 2 = 3, [[2/5]] + [[1/5]] = [[3/5]]." },
        { q: "4 [[3/7]] − 1 [[1/7]] = ?", o: ["3 [[2/7]]", "3 [[4/7]]", "5 [[2/7]]", "3 [[2/0]]"], e: "4 − 1 = 3, [[3/7]] − [[1/7]] = [[2/7]]." },
        { q: "3 − [[1/4]] = ?", o: ["2 [[3/4]]", "3 [[1/4]]", "2 [[1/4]]", "[[2/4]]"], e: "3 = 2 [[4/4]]; [[4/4]] − [[1/4]] = [[3/4]]." }
      ]
    },
    {
      id: "toplam-qismi", title: "To‘plamning qismi", tag: "Sonning kasrini topish",
      life: "Sinfda 24 o‘quvchi, ularning [[3/4]] qismi ekskursiyaga bordi. Nechta o‘quvchi bordi? Savatdagi 30 ta olmaning [[2/5]] qismi qizil. Bunday savollarga “to‘plamning qismi” javob beradi.",
      explain: "<p>To‘plamning [[a/b]] qismini topish uchun:</p><ol><li>To‘plamni <b>b ta teng guruhga</b> bo‘lamiz (maxrajga bo‘lamiz) — bu [[1/b]] qism.</li><li>Shunday guruhlardan <b>a tasini</b> olamiz (suratga ko‘paytiramiz).</li></ol>",
      rule: "N ning [[a/b]] qismi = N : b · a",
      demos: [{ type: "setPart" }],
      examples: [
        { q: "36 ta konfetning [[5/9]] qismi shokoladli. Nechta shokoladli konfet bor?", steps: ["36 : 9 = 4 — bu [[1/9]] qism", "4 · 5 = 20"], a: "20 ta" },
        { q: "Sinfda 28 o‘quvchi, [[3/7]] qismi qizlar. O‘g‘il bolalar nechta?", steps: ["Qizlar: 28 : 7 · 3 = 12", "O‘g‘illar: 28 − 12 = 16"], a: "16 ta" }
      ],
      quiz: [
        { q: "20 ning [[1/4]] qismi?", o: ["5", "4", "80", "16"], e: "20 : 4 = 5." },
        { q: "40 ning [[3/8]] qismi?", o: ["15", "5", "24", "120"], e: "40 : 8 = 5; 5 · 3 = 15." },
        { q: "1 soatning (60 daqiqa) [[2/3]] qismi necha daqiqa?", o: ["40", "20", "30", "90"], e: "60 : 3 · 2 = 40." }
      ]
    },
    {
      id: "kasr-x-natural", title: "To‘g‘ri kasrni natural songa ko‘paytirish", tag: "Faqat surat ko‘payadi",
      life: "Har kuni [[3/4]] stakan sut ichasiz. 3 kunda qancha ichasiz? [[3/4]] · 3 = [[9/4]] = 2 [[1/4]] stakan. Ko‘paytirish — bir xil kasrni bir necha marta qo‘shish.",
      explain: "<p>[[3/4]] · 3 = [[3/4]] + [[3/4]] + [[3/4]] = [[9/4]]. Ko‘rinib turibdiki, bo‘laklar o‘lchami (maxraj) o‘zgarmaydi, faqat bo‘laklar soni (surat) 3 marta ko‘payadi.</p><p>Natija noto‘g‘ri kasr bo‘lsa, butun qismini ajratamiz. Avval qisqartirib olsa, hisob osonlashadi: [[5/12]] · 4 = [[5·4/12]] = [[5/3]].</p>",
      rule: "[[a/b]] · n = [[a·n/b]]",
      demos: [{ type: "fracTimesNat", mode: "simple" }],
      examples: [
        { q: "[[2/9]] · 4 = ?", steps: ["Surat: 2 · 4 = 8", "Maxraj o‘zgarmaydi: 9"], a: "[[8/9]]" },
        { q: "Bir paket [[3/5]] kg. 10 ta paket necha kg?", steps: ["[[3/5]] · 10 = [[30/5]]", "30 : 5 = 6"], a: "6 kg" }
      ],
      quiz: [
        { q: "[[1/6]] · 5 = ?", o: ["[[5/6]]", "[[5/30]]", "[[6/5]]", "[[1/30]]"], e: "Faqat surat ko‘payadi." },
        { q: "[[3/8]] · 4 = ?", o: ["1 [[1/2]]", "[[12/32]]", "[[3/32]]", "1 [[1/4]]"], e: "[[12/8]] = 1 [[4/8]] = 1 [[1/2]]." },
        { q: "[[2/3]] · 6 = ?", o: ["4", "[[12/18]]", "[[2/18]]", "9"], e: "[[12/3]] = 4." }
      ]
    },
    {
      id: "kasr-x-kasr", title: "Ikkita to‘g‘ri kasrni ko‘paytirish", tag: "Surat × surat, maxraj × maxraj",
      life: "Bog‘ning [[2/3]] qismi ekilgan, ekilgan yerning [[3/4]] qismida pomidor. Pomidor butun bog‘ning qancha qismida? [[2/3]] · [[3/4]] = [[6/12]] = [[1/2]]. “Qismning qismi” — bu kasrlarni ko‘paytirish.",
      explain: "<p>Kvadratni olaylik. Uning [[2/3]] qismini vertikal, [[3/4]] qismini gorizontal bo‘yaymiz. Ikkalasi ustma-ust tushgan yashil qism — ko‘paytma.</p><p>Kvadrat 3 · 4 = 12 ta katakka bo‘lingan, yashil kataklar 2 · 3 = 6 ta. Demak natija [[6/12]].</p>",
      rule: "[[a/b]] · [[c/d]] = [[a·c/b·d]]. To‘g‘ri kasrlar ko‘paytmasi har ikkalasidan ham kichik!",
      demos: [{ type: "areaModel", mode: "proper" }],
      examples: [
        { q: "[[3/5]] · [[2/7]] = ?", steps: ["Suratlar: 3 · 2 = 6", "Maxrajlar: 5 · 7 = 35"], a: "[[6/35]]" },
        { q: "[[4/9]] · [[3/8]] = ?", steps: ["Avval qisqartiramiz: 4 va 8 → 1 va 2; 3 va 9 → 1 va 3", "[[1·1/3·2]]"], a: "[[1/6]]" }
      ],
      quiz: [
        { q: "[[1/2]] · [[1/3]] = ?", o: ["[[1/6]]", "[[2/5]]", "[[1/5]]", "[[2/6]]"], e: "1·1 = 1, 2·3 = 6." },
        { q: "[[2/3]] · [[3/5]] = ?", o: ["[[2/5]]", "[[5/8]]", "[[6/8]]", "[[5/15]]"], e: "[[6/15]] = [[2/5]]." },
        { q: "Pitsaning [[1/2]] qismining [[1/4]] qismi — butun pitsaning qanchasi?", o: ["[[1/8]]", "[[3/4]]", "[[1/6]]", "[[2/4]]"], e: "[[1/2]] · [[1/4]] = [[1/8]]." }
      ]
    },
    {
      id: "togri-notogri", title: "To‘g‘ri va noto‘g‘ri kasrlarni ko‘paytirish", tag: "Natija qachon kattalashadi?",
      life: "Suv nasosi 1 minutda [[5/2]] l suv chiqaradi. [[3/4]] minutda qancha? [[5/2]] · [[3/4]] = [[15/8]] = 1 [[7/8]] l.",
      explain: "<p>Qoida o‘zgarmaydi: suratni suratga, maxrajni maxrajga ko‘paytiramiz. Noto‘g‘ri kasr 1 dan katta bo‘lgani uchun, uni to‘g‘ri kasrga ko‘paytirsak, natija <b>noto‘g‘ri kasrdan kichik</b>, lekin to‘g‘ri kasrdan katta bo‘ladi.</p><p>Rasmda noto‘g‘ri kasr bir nechta birlik kvadratni egallaydi — yashil qismni sanab ko‘ring.</p>",
      rule: "[[a/b]] · [[c/d]] = [[a·c/b·d]]. Natijadan butun qismni ajratishni unutmang.",
      demos: [{ type: "areaModel", mode: "mixed" }],
      examples: [
        { q: "[[7/4]] · [[2/3]] = ?", steps: ["[[7·2/4·3]] = [[14/12]]", "Qisqartiramiz: [[7/6]]", "Butun qism: 1 [[1/6]]"], a: "1 [[1/6]]" },
        { q: "[[9/5]] · [[5/6]] = ?", steps: ["5 lar qisqaradi: [[9/6]]", "[[9/6]] = [[3/2]] = 1 [[1/2]]"], a: "1 [[1/2]]" }
      ],
      quiz: [
        { q: "[[3/2]] · [[1/3]] = ?", o: ["[[1/2]]", "[[3/5]]", "[[4/5]]", "[[3/6]] + 1"], e: "[[3/6]] = [[1/2]]." },
        { q: "[[5/4]] · [[2/5]] = ?", o: ["[[1/2]]", "[[7/9]]", "[[10/9]]", "2"], e: "[[10/20]] = [[1/2]]." },
        { q: "[[8/3]] · [[3/4]] = ?", o: ["2", "[[11/7]]", "[[24/7]]", "3"], e: "[[24/12]] = 2." }
      ]
    },
    {
      id: "notogri-x-notogri", title: "Ikkita noto‘g‘ri kasrni ko‘paytirish", tag: "Natija har ikkalasidan katta",
      life: "Xona uzunligi [[9/2]] m, eni [[7/2]] m. Polning yuzi: [[9/2]] · [[7/2]] = [[63/4]] = 15 [[3/4]] m². Ta’mirlashda qancha laminat kerakligini shunday hisoblaymiz.",
      explain: "<p>Ikkala kasr ham 1 dan katta bo‘lgani uchun ko‘paytma <b>har ikkalasidan ham katta</b> chiqadi.</p><p>Yuza modelida to‘g‘ri to‘rtburchak bir nechta birlik kvadratni egallaydi. Yashil kataklarni sanab, birlik kvadratdagi kataklar soniga bo‘lsak, natija chiqadi.</p>",
      rule: "[[a/b]] · [[c/d]] = [[a·c/b·d]] → butun qismni ajratamiz.",
      demos: [{ type: "areaModel", mode: "improper" }],
      examples: [
        { q: "[[5/3]] · [[7/4]] = ?", steps: ["[[5·7/3·4]] = [[35/12]]", "35 : 12 = 2 (qoldiq 11)"], a: "2 [[11/12]]" },
        { q: "[[9/4]] · [[8/3]] = ?", steps: ["Qisqartiramiz: 9 va 3 → 3 va 1; 8 va 4 → 2 va 1", "[[3·2/1·1]] = 6"], a: "6" }
      ],
      quiz: [
        { q: "[[3/2]] · [[5/2]] = ?", o: ["3 [[3/4]]", "[[8/4]]", "[[15/2]]", "4"], e: "[[15/4]] = 3 [[3/4]]." },
        { q: "[[4/3]] · [[3/2]] = ?", o: ["2", "[[7/5]]", "[[12/5]]", "1"], e: "[[12/6]] = 2." },
        { q: "Qaysi gap to‘g‘ri? Ikki noto‘g‘ri kasr ko‘paytmasi...", o: ["har doim 1 dan katta", "har doim 1 dan kichik", "har doim butun son", "doim 1 ga teng"], e: "1 dan katta sonlar ko‘paytmasi ham 1 dan katta." }
      ]
    },
    {
      id: "aralash-x-natural", title: "Aralash sonlarni natural songa ko‘paytirish", tag: "Avval noto‘g‘ri kasrga aylantiramiz",
      life: "Bir paket guruch 2 [[1/2]] kg. 4 ta paket: 2 [[1/2]] · 4 = 10 kg. Har bir qavat balandligi 3 [[1/4]] m bo‘lsa, 5 qavatli bino balandligi 16 [[1/4]] m.",
      explain: "<p><b>1-usul:</b> aralash sonni noto‘g‘ri kasrga aylantiramiz: 2 [[1/2]] = [[5/2]], keyin [[5/2]] · 4 = [[20/2]] = 10.</p><p><b>2-usul:</b> butun va kasr qismni alohida ko‘paytiramiz: 2 · 4 = 8, [[1/2]] · 4 = 2, jami 8 + 2 = 10.</p>",
      rule: "W [[a/b]] · n = [[W·b+a/b]] · n",
      demos: [{ type: "fracTimesNat", mode: "mixed" }],
      examples: [
        { q: "1 [[2/3]] · 5 = ?", steps: ["1 [[2/3]] = [[5/3]]", "[[5/3]] · 5 = [[25/3]]", "= 8 [[1/3]]"], a: "8 [[1/3]]" },
        { q: "3 [[1/4]] · 8 = ? (2-usul)", steps: ["3 · 8 = 24", "[[1/4]] · 8 = 2", "24 + 2 = 26"], a: "26" }
      ],
      quiz: [
        { q: "2 [[1/3]] · 3 = ?", o: ["7", "6 [[1/3]]", "6 [[1/9]]", "[[7/9]]"], e: "6 + 1 = 7." },
        { q: "1 [[1/2]] · 6 = ?", o: ["9", "6 [[1/2]]", "7", "8"], e: "[[3/2]] · 6 = 9." },
        { q: "4 [[2/5]] ni noto‘g‘ri kasrga aylantiring.", o: ["[[22/5]]", "[[8/5]]", "[[42/5]]", "[[11/5]]"], e: "4 · 5 + 2 = 22." }
      ]
    },
    {
      id: "qolgan-qism", title: "Qolgan qismning qismi", tag: "Ikki bosqichli kasr masalalari",
      life: "Sizga 60 000 so‘m berildi. Uning [[1/3]] qismiga kitob oldingiz, <b>qolganining</b> [[1/4]] qismiga daftar. Daftar uchun 60 000 ning emas, qolgan 40 000 ning [[1/4]] qismi — 10 000 so‘m sarflanadi!",
      explain: "<p>Bunday masalalarda <b>har bir kasr nimadan olinayotganiga</b> diqqat qiling:</p><ol><li>Butunning birinchi qismini topamiz.</li><li>Qolganini hisoblaymiz: butun − birinchi qism.</li><li>Ikkinchi kasrni <b>qolgan miqdordan</b> olamiz.</li></ol>",
      rule: "“Qolganining [[c/d]] qismi” = (Butun − 1-qism) : d · c",
      demos: [{ type: "remainderPart", first: "Kitob", second: "Daftar" }],
      examples: [
        { q: "Kitob 240 bet. 1-kuni [[1/4]] qismini, 2-kuni qolganining [[2/3]] qismini o‘qidi. 3-kunga necha bet qoldi?", steps: ["1-kun: 240 : 4 = 60 bet", "Qoldi: 240 − 60 = 180", "2-kun: 180 : 3 · 2 = 120", "Qoldi: 180 − 120 = 60"], a: "60 bet" },
        { q: "Bog‘dagi 90 ta daraxtning [[1/3]] qismi olma, qolganining [[1/2]] qismi nok. Nechta nok?", steps: ["Olma: 90 : 3 = 30", "Qolgan: 60", "Nok: 60 : 2 = 30"], a: "30 ta" }
      ],
      quiz: [
        { q: "100 ning [[1/2]] qismi olindi, qolganining [[1/5]] qismi necha?", o: ["10", "20", "50", "40"], e: "Qolgan 50; 50 : 5 = 10." },
        { q: "Yo‘l 120 km. [[1/3]] qismini avtobusda, qolganining [[1/2]] qismini taksida. Taksida necha km?", o: ["40", "60", "20", "80"], e: "Qolgan 80; 80 : 2 = 40." },
        { q: "“Qolganining [[1/4]] qismi” nimadan olinadi?", o: ["Qolgan miqdordan", "Butun miqdordan", "Birinchi qismdan", "1 dan"], e: "Aynan shu — asosiy tuzoq!" }
      ]
    },
    {
      id: "masala-kasr", title: "Matnli masalalar (kasrlar)", tag: "Kasrlar bilan hayotiy masalalar",
      life: "Kasrlar narx-navo, retsept, yo‘l va vaqt masalalarida doim uchraydi: “narx [[1/5]] qismiga arzonladi”, “yo‘lning [[2/3]] qismi bosib o‘tildi”.",
      explain: "<p>Kasrli masalalarning uch asosiy turi:</p><ol><li><b>Sonning qismini topish</b>: N ning [[a/b]] qismi = N : b · a.</li><li><b>Qismiga ko‘ra sonni topish</b>: agar [[a/b]] qism = M bo‘lsa, butun = M : a · b.</li><li><b>Qism nechanchi ekanini topish</b>: M son N ning [[M/N]] qismi.</li></ol>",
      rule: "Qismdan butunga: M : a · b. Butundan qismga: N : b · a.",
      demos: [{ type: "wordProblem", problems: [
        { text: "Kitobning [[3/5]] qismi o‘qildi — bu 90 bet. Kitob necha betli?",
          bars: [{ label: "Kitob", parts: [1, 2, 3].map(() => ({ v: 1, t: "30", c: "#22c55e" })).concat([4, 5].map(() => ({ v: 1, t: "?", c: "#334155" }))), total: "?" }],
          steps: ["3 bo‘lak = 90 bet", "1 bo‘lak: 90 : 3 = 30 bet", "Butun kitob — 5 bo‘lak: 30 · 5 = 150 bet"], answer: "150 bet" },
        { text: "Ko‘ylak 120 000 so‘m edi, narxi [[1/4]] qismiga arzonladi. Yangi narx?",
          bars: [{ label: "Narx", parts: [{ v: 1, t: "−30 000", c: "#ef4444" }, { v: 3, t: "90 000", c: "#22c55e" }], total: "120 000" }],
          steps: ["Arzonlash: 120 000 : 4 = 30 000", "Yangi narx: 120 000 − 30 000 = 90 000"], answer: "90 000 so‘m" }
      ] }],
      examples: [
        { q: "Sinfdagi 30 o‘quvchidan 12 tasi sport to‘garagiga qatnaydi. Bu sinfning qanday qismi?", steps: ["12 ni 30 ga nisbati: [[12/30]]", "6 ga qisqartiramiz"], a: "[[2/5]] qismi" }
      ],
      quiz: [
        { q: "Sonning [[1/4]] qismi 15. Son nechaga teng?", o: ["60", "19", "11", "[[15/4]]"], e: "15 · 4 = 60." },
        { q: "48 ning [[5/6]] qismi?", o: ["40", "8", "58", "30"], e: "48 : 6 · 5 = 40." },
        { q: "Yo‘lning [[2/7]] qismi 40 km. Butun yo‘l?", o: ["140 km", "80 km", "280 km", "20 km"], e: "40 : 2 · 7 = 140." }
      ]
    }
  ]
});
