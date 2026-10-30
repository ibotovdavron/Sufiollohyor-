/* Savollar: tayyor savollar banki + har safar yangi matematik misollar.
   Bir xil "seed" bilan ikkala o'yinchiga bir xil savollar chiqadi. */
(() => {
  "use strict";

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function shuffle(r, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // [savol, TO'G'RI javob, xato1, xato2, xato3]
  const BANK = {
    fizika: [
      ["Tezlik formulasi?", "v = s / t", "v = s · t", "v = t / s", "v = s + t"],
      ["Kuch birligi?", "Nyuton", "Joul", "Vatt", "Paskal"],
      ["Suv normal bosimda necha °C da qaynaydi?", "100 °C", "90 °C", "110 °C", "80 °C"],
      ["Yorug‘lik tezligi taxminan?", "300 000 km/s", "300 km/s", "30 000 km/s", "3 000 km/s"],
      ["Energiya birligi?", "Joul", "Nyuton", "Amper", "Volt"],
      ["Erkin tushish tezlanishi taxminan?", "9,8 m/s²", "1,6 m/s²", "98 m/s²", "3,7 m/s²"],
      ["Tok kuchi birligi?", "Amper", "Volt", "Om", "Vatt"],
      ["Bosim birligi?", "Paskal", "Nyuton", "Joul", "Gers"],
      ["Mashina 2 soatda 120 km yurdi. Tezligi?", "60 km/soat", "240 km/soat", "120 km/soat", "30 km/soat"],
      ["Muz necha °C da eriydi?", "0 °C", "100 °C", "−10 °C", "4 °C"],
      ["Massa birligi (SI)?", "kilogramm", "Nyuton", "litr", "metr"],
      ["Tovush qaysi muhitda tarqalmaydi?", "Vakuumda", "Suvda", "Havoda", "Temirda"]
    ],
    ingliz: [
      ["“Apple” o‘zbekchada?", "Olma", "Nok", "Behi", "Uzum"],
      ["She ___ a student.", "is", "are", "am", "be"],
      ["“Kitob” inglizchada?", "Book", "Pen", "Desk", "Bag"],
      ["“Go” ning o‘tgan zamoni?", "went", "goed", "gone", "goes"],
      ["I ___ breakfast every day.", "eat", "eats", "eating", "ate"],
      ["“Child” ning ko‘pligi?", "children", "childs", "childrens", "childes"],
      ["They ___ football yesterday.", "played", "play", "plays", "playing"],
      ["“Beautiful” so‘zining ma’nosi?", "Chiroyli", "Katta", "Tez", "Aqlli"],
      ["“Mouse” ning ko‘pligi?", "mice", "mouses", "mices", "mouse"],
      ["He ___ to school now.", "is going", "go", "going", "goes now"],
      ["“Write” ning o‘tgan zamoni?", "wrote", "writed", "written", "writes"],
      ["“Thursday” qaysi kun?", "Payshanba", "Seshanba", "Juma", "Chorshanba"]
    ],
    onatili: [
      ["“Katta” so‘zining antonimi?", "Kichik", "Baland", "Keng", "Uzun"],
      ["Ot qaysi savolga javob beradi?", "Kim? Nima?", "Qanday?", "Qancha?", "Nima qildi?"],
      ["“Maktab” so‘zida nechta bo‘g‘in bor?", "2", "1", "3", "4"],
      ["Qaysi so‘z sifat?", "go‘zal", "kitob", "yozdi", "uch"],
      ["“Bola kitob o‘qidi.” Ega qaysi?", "Bola", "Kitob", "O‘qidi", "Bola kitob"],
      ["“Tez” so‘zining sinonimi?", "Chaqqon", "Sekin", "Og‘ir", "Past"],
      ["O‘zbek lotin alifbosida nechta harf bor?", "29", "26", "31", "28"],
      ["Fe’l qaysi savolga javob beradi?", "Nima qildi?", "Kim?", "Qanday?", "Qayerda?"],
      ["“Do‘stlik” so‘zining o‘zagi?", "do‘st", "do‘stlik", "lik", "do‘stl"],
      ["Qaysi so‘z son?", "yettinchi", "yetti marta", "yettilik", "yetmoq"],
      ["“Qalam” so‘zining ko‘plik shakli?", "qalamlar", "qalamdan", "qalamim", "qalamga"],
      ["“Alisher Navoiy” qaysi asr shoiri?", "XV asr", "XIX asr", "X asr", "XX asr"]
    ],
    mantiq: [
      ["2, 4, 8, 16, ... keyingi son?", "32", "24", "20", "18"],
      ["1, 1, 2, 3, 5, 8, ... keyingi son?", "13", "11", "12", "16"],
      ["Bir haftada necha soat bor?", "168", "148", "160", "144"],
      ["Soat 3:00 da strelkalar orasidagi burchak?", "90°", "60°", "45°", "120°"],
      ["3 ta mushuk 3 daqiqada 3 sichqon tutsa, 6 mushuk 6 daqiqada nechta tutadi?", "12", "6", "9", "18"],
      ["Kubning nechta qirrasi bor?", "12", "8", "6", "10"],
      ["Agar bugun dushanba bo‘lsa, 10 kundan keyin qaysi kun?", "Payshanba", "Chorshanba", "Juma", "Seshanba"],
      ["5 ta olmadan 3 tasini olsangiz, sizda nechta olma bor?", "3", "2", "5", "8"],
      ["1 dan 100 gacha nechta juft son bor?", "50", "49", "51", "100"],
      ["Akam mendan 4 yosh katta. 3 yildan keyin farq qancha bo‘ladi?", "4 yosh", "7 yosh", "1 yosh", "3 yosh"]
    ]
  };

  // ---------- Matematika generatorlari ----------
  const fmt = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));

  function distractors(r, ans, spread) {
    const out = new Set();
    const cands = [ans + 1, ans - 1, ans + spread, ans - spread, ans + 10, ans - 10, ans * 2, Math.round(ans / 2), ans + 2, ans - 2];
    for (const c of shuffle(r, cands)) {
      if (c !== ans && (ans < 0 || c >= 0) && out.size < 3) out.add(c);
    }
    while (out.size < 3) {
      const c = ans + int(r, 3, 20) * (r() < 0.5 && ans > 25 ? -1 : 1);
      if (c !== ans) out.add(c);
    }
    return [...out];
  }

  const GEN = {
    1: [
      (r) => { const a = int(r, 6, 12), b = int(r, 6, 12), c = int(r, 5, 40); return [`${a} × ${b} + ${c} = ?`, a * b + c, a]; },
      (r) => { const c = int(r, 3, 9), q = int(r, 4, 12), a = int(r, 1, c * q - 1); return [`(${a} + ${c * q - a}) ÷ ${c} = ?`, q, 2]; },
      (r) => { const p = pick(r, [10, 20, 25, 50]), n = int(r, 2, 12) * (100 / p) * pick(r, [1, 2]); return [`${n} ning ${p}% i = ?`, n * p / 100, 5]; },
      (r) => { const x = int(r, 12, 90), a = int(r, 15, 80); return [`x + ${a} = ${x + a}. x = ?`, x, 10]; },
      (r) => { const a = int(r, 4, 15), b = int(r, 3, 12); return [`To‘g‘ri to‘rtburchak: ${a} sm va ${b} sm. Perimetri (sm)?`, 2 * (a + b), a]; },
      (r) => { const a = int(r, 120, 480), b = int(r, 60, 300); return [`${a} − ${b} = ?`, a - b, 10]; }
    ],
    2: [
      (r) => { const a = int(r, -15, -2), b = int(r, 3, 20); return [`${fmt(a)} + ${b} × 2 = ?`, a + b * 2, 2]; },
      (r) => { const x = int(r, 2, 15), a = int(r, 2, 9), b = int(r, 3, 30); return [`${a}x + ${b} = ${a * x + b}. x = ?`, x, 1]; },
      (r) => { const a = int(r, 3, 15), b = int(r, 5, 40); return [`${a}² + ${b} = ?`, a * a + b, a]; },
      (r) => { const p = pick(r, [15, 30, 75, 40, 60]), n = int(r, 2, 9) * 20; return [`${n} ning ${p}% i = ?`, n * p / 100, 3]; },
      (r) => { const a = int(r, 3, 12), b = int(r, 2, 6), c = int(r, 2, 9); return [`${a * b} ÷ ${b} × ${c} − ${c} = ?`, a * c - c, c]; },
      (r) => { const a = int(r, 3, 12); return [`Kvadrat tomoni ${a} sm. Yuzi (sm²)?`, a * a, a]; }
    ],
    3: [
      (r) => { const x = int(r, -9, 12), a = int(r, 3, 9), c = int(r, 1, a - 1), b = int(r, -20, 20); const d = (a - c) * x + b; return [`${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}. x = ?`, x, 1]; },
      (r) => { const a = int(r, 6, 15), b = int(r, 1, 5); return [`(${a} − ${b})² = ?`, (a - b) ** 2, a]; },
      (r) => { const b = pick(r, [2, 3]), e = b === 2 ? int(r, 5, 9) : int(r, 3, 5); return [`${b}${"⁰¹²³⁴⁵⁶⁷⁸⁹"[e]} = ?`, b ** e, b]; },
      (r) => { const s = pick(r, [144, 169, 196, 225, 256, 289, 324, 361, 400]), k = int(r, 2, 6); return [`√${s} × ${k} = ?`, Math.sqrt(s) * k, k]; },
      (r) => { const n = int(r, 2, 9) * 50, p = pick(r, [10, 20, 30]); return [`${n} so‘mlik narx ${p}% ga oshdi. Yangi narx?`, n + n * p / 100, 5]; },
      (r) => { const a = int(r, 2, 9), d = int(r, 3, 9); return [`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, ... 10-had?`, a + 9 * d, d]; },
      (r) => { const a = int(r, 30, 80), b = int(r, 30, 140 - a); return [`Uchburchakda ikki burchak ${a}° va ${b}°. Uchinchisi?`, 180 - a - b, 10]; }
    ]
  };

  function mathQuestion(r, level) {
    const [q, ans, spread] = pick(r, GEN[level] || GEN[1])(r);
    const opts = shuffle(r, [ans, ...distractors(r, ans, spread || 1)]).map(fmt);
    return { q, a: fmt(ans), opts, subject: "Matematika" };
  }

  const SUBJECT_NAMES = { fizika: "Fizika", ingliz: "Ingliz tili", onatili: "Ona tili", mantiq: "Mantiq" };

  function bankQuestion(r, used) {
    for (let tries = 0; tries < 30; tries++) {
      const key = pick(r, Object.keys(BANK));
      const row = pick(r, BANK[key]);
      if (used.has(row[0])) continue;
      used.add(row[0]);
      return { q: row[0], a: row[1], opts: shuffle(r, row.slice(1)), subject: SUBJECT_NAMES[key] };
    }
    return mathQuestion(r, 2);
  }

  /** count ta savol: ~60% matematika, qolgani boshqa fanlar. */
  function make(seed, count, level) {
    const r = rng(seed);
    const used = new Set();
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(r() < 0.6 ? mathQuestion(r, level) : bankQuestion(r, used));
    }
    return list;
  }

  window.SofiQuestions = { rng, int, pick, shuffle, make, mathQuestion };
})();
