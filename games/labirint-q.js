/* BILIM LABIRINTI — savollar: javob klaviaturadan yoziladi.
   Matematik savollar sinfga qarab yaratiladi + umumiy bilim savollari. */
(() => {
  "use strict";
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Javobni solishtirish uchun tozalash: kichik harf, tutuq belgilarsiz, vergul → nuqta
  function norm(s) {
    return String(s || "").toLowerCase().trim()
      .replace(/[‘’ʻʼ'`´]/g, "").replace(/,/g, ".").replace(/\s+/g, "")
      .replace(/[.!?;:]+$/g, "").replace(/^\+/, "");
  }

  const BANK = [
    ["O‘zbekiston poytaxti qaysi shahar?", ["toshkent", "tashkent"]],
    ["Bir soatda necha daqiqa bor?", ["60"]],
    ["Bir sutkada necha soat bor?", ["24"]],
    ["Bir yilda nechta oy bor?", ["12"]],
    ["Haftada necha kun bor?", ["7"]],
    ["Kamalakda nechta rang bor?", ["7"]],
    ["Bir metrda necha santimetr bor?", ["100"]],
    ["Bir kilometrda necha metr bor?", ["1000"]],
    ["Bir tonnada necha kilogramm bor?", ["1000"]],
    ["Shaxmat taxtasida nechta katak bor?", ["64"]],
    ["Uchburchak ichki burchaklari yig‘indisi necha gradus?", ["180"]],
    ["To‘g‘ri burchak necha gradus?", ["90"]],
    ["Kvadratning nechta uchi bor?", ["4"]],
    ["Oltiburchakning nechta tomoni bor?", ["6"]],
    ["Suv necha gradusda qaynaydi (°C)?", ["100"]],
    ["Suv necha gradusda muzlaydi (°C)?", ["0"]],
    ["Suvning kimyoviy formulasi?", ["h2o", "h₂o"]],
    ["Kislorodning kimyoviy belgisi?", ["o"]],
    ["Temirning kimyoviy belgisi?", ["fe"]],
    ["Oltinning kimyoviy belgisi?", ["au"]],
    ["Natriyning kimyoviy belgisi?", ["na"]],
    ["O‘simliklar fotosintezda qaysi gazni yutadi? (formulasi)", ["co2", "co₂"]],
    ["Yerning tabiiy yo‘ldoshi nima?", ["oy"]],
    ["Bizga eng yaqin yulduz?", ["quyosh"]],
    ["Quyosh sistemasidagi eng katta sayyora?", ["yupiter", "jupiter", "yupitr"]],
    ["“Qizil sayyora” deb qaysi sayyora ataladi?", ["mars"]],
    ["Quyosh sistemasida nechta sayyora bor?", ["8"]],
    ["Odam skeletida nechta suyak bor (kattalarda)?", ["206"]],
    ["Odam yuragi nechta kameradan iborat?", ["4"]],
    ["Eng katta okean? (bir so‘z)", ["tinch", "tinchokean", "tinchokeani"]],
    ["1 kilobaytda necha bayt bor?", ["1024"]],
    ["1 baytda necha bit bor?", ["8"]],
    ["Ikkilik sanoq sistemasida 2 soni qanday yoziladi?", ["10"]],
    ["Ikkilik sanoq sistemasida 5 soni qanday yoziladi?", ["101"]],
    ["Kompyuterning “miyasi” qaysi qurilma?", ["protsessor", "cpu", "prosessor", "markaziyprotsessor"]],
    ["Ingliz tilida “kitob” qanday bo‘ladi?", ["book"]],
    ["Ingliz tilida “olma” qanday bo‘ladi?", ["apple"]],
    ["Ingliz tilida “maktab” qanday bo‘ladi?", ["school"]],
    ["Ingliz tilida “qizil” qanday bo‘ladi?", ["red"]],
    ["Ingliz tilida “suv” qanday bo‘ladi?", ["water"]],
    ["Ingliz tilida “ustoz” qanday bo‘ladi?", ["teacher"]],
    ["Amir Temur qaysi shahar yaqinida tug‘ilgan?", ["shahrisabz", "kesh"]],
    ["Alisher Navoiyning “Xamsa”si nechta dostondan iborat?", ["5", "besh"]],
    ["Musiqada nechta asosiy nota bor?", ["7"]],
    ["π (pi) soni taxminan nechaga teng? (ikki xona aniqlikda)", ["3.14"]],
    ["O‘zbekiston bayrog‘ida nechta yulduz bor?", ["12"]],
    ["O‘zbekiston mustaqilligi qaysi yili e’lon qilingan?", ["1991"]],
    ["Eng kichik tub son?", ["2"]],
    ["Eng kichik ikki xonali son?", ["10"]],
    ["Eng katta uch xonali son?", ["999"]],
  ];

  /** grade: 5..11 — savol {q, a:[javoblar], hint} */
  function make(grade) {
    const g = Math.max(5, Math.min(11, grade || 6));
    const kinds = ["add", "mul", "div", "ord", "bank"];
    if (g >= 6) kinds.push("pct", "frac", "bank");
    if (g >= 7) kinds.push("eq", "eq", "neg");
    if (g >= 8) kinds.push("pow", "sqrt", "eq2");
    const k = pick(kinds);
    if (k === "add") { const a = ri(25, g * 60), b = ri(12, g * 45); return Math.random() < 0.5 ? { q: `${a} + ${b} = ?`, a: [String(a + b)] } : { q: `${a + b} − ${b} = ?`, a: [String(a)] }; }
    if (k === "mul") { const a = ri(3, g >= 7 ? 19 : 12), b = ri(3, 12); return { q: `${a} × ${b} = ?`, a: [String(a * b)] }; }
    if (k === "div") { const b = ri(3, 12), c = ri(3, 15); return { q: `${b * c} : ${b} = ?`, a: [String(c)] }; }
    if (k === "ord") { const a = ri(2, 20), b = ri(2, 9), c = ri(2, 9); return { q: `${a} + ${b} × ${c} = ?`, a: [String(a + b * c)], hint: "Avval ko‘paytirish bajariladi." }; }
    if (k === "pct") { const p = pick([10, 20, 25, 50, 75]), n = pick([40, 60, 80, 120, 200, 240, 400]); return { q: `${n} ning ${p}% i nechaga teng?`, a: [String((n * p) / 100)] }; }
    if (k === "frac") { const d = pick([2, 3, 4, 5]), m = ri(1, d - 1), n = d * ri(2, 9); return { q: `${n} ning ${m}/${d} qismi nechaga teng?`, a: [String((n / d) * m)] }; }
    if (k === "eq") { const x = ri(2, 12), a = ri(2, 9), b = ri(1, 20); return { q: `${a}x + ${b} = ${a * x + b}.  x = ?`, a: [String(x)] }; }
    if (k === "eq2") { const x = ri(-9, 9) || 4, a = ri(2, 7), b = ri(-15, 15); return { q: `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${a * x + b}.  x = ?`, a: [String(x)] }; }
    if (k === "neg") { const a = ri(-30, -2), b = ri(3, 40); return { q: `(${a}) + ${b} = ?`, a: [String(a + b)] }; }
    if (k === "pow") { const n = ri(2, 15); return { q: `${n}² = ?`, a: [String(n * n)] }; }
    if (k === "sqrt") { const n = ri(2, 20); return { q: `√${n * n} = ?`, a: [String(n)] }; }
    const [q, a] = pick(BANK);
    return { q, a };
  }
  const check = (qq, input) => qq.a.some((x) => norm(x) === norm(input));

  window.SofiMazeQ = { make, check, norm };
})();

/* Sirli bog' topshiriqlari: ketma-ketlik va topishmoqlar */
(() => {
  "use strict";
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const RIDDLES = [
    ["Tishi bor, og‘zi yo‘q. Bu nima?", ["taroq"]],
    ["Qishin-yozin bir rangda — doim yashil. Bu nima?", ["archa", "qarag‘ay", "qaragay"]],
    ["Ko‘zi yo‘q, ammo yig‘laydi. Bu nima?", ["bulut"]],
    ["Oq dala, qora urug‘. Qo‘l bilan ekiladi, ko‘z bilan teriladi. Bu nima?", ["xat", "kitob", "yozuv"]],
    ["Tili yo‘q, og‘zi yo‘q — hamma narsani aytib beradi. Bu nima?", ["kitob"]],
    ["Bir qo‘ra qo‘y, bitta cho‘pon. Cho‘pon kim?", ["oy"]],
    ["Qanoti bor — qush emas, osmonda uchadi, odam tashiydi. Bu nima?", ["samolyot", "samolet"]],
    ["Uyini orqasida ko‘tarib yuradi, sekin-sekin yuradi. Bu kim?", ["toshbaqa", "shilliqqurt"]],
    ["Oyog‘i yo‘q — yuradi, to‘xtamaydi, vaqtni aytadi. Bu nima?", ["soat"]],
    ["Kunduzi yonadi, kechasi uxlaydi, hammani isitadi. Bu nima?", ["quyosh"]],
  ];
  function seq() {
    const k = ri(0, 3);
    if (k === 0) { const a = ri(1, 9), d = ri(2, 9); const s = [0, 1, 2, 3].map((i) => a + d * i); return { q: `Ketma-ketlikni davom ettiring: ${s.join(", ")}, ?`, a: [String(a + d * 4)] }; }
    if (k === 1) { const a = ri(1, 3), r = ri(2, 3); const s = [0, 1, 2, 3].map((i) => a * r ** i); return { q: `Ketma-ketlikni davom ettiring: ${s.join(", ")}, ?`, a: [String(a * r ** 4)] }; }
    if (k === 2) { const s = [1, 1, 2, 3, 5, 8]; return { q: `Ketma-ketlikni davom ettiring: ${s.join(", ")}, ?`, a: ["13"], hint: "Har bir son oldingi ikkitasining yig‘indisi." }; }
    const n = ri(2, 5); const s = [n, n + 1, n + 2, n + 3].map((i) => i * i); return { q: `Ketma-ketlikni davom ettiring: ${s.join(", ")}, ?`, a: [String((n + 4) ** 2)], hint: "Bular kvadrat sonlar." };
  }
  const riddle = () => { const [q, a] = pick(RIDDLES); return { q, a }; };
  Object.assign(window.SofiMazeQ, { seq, riddle });
})();

/* Variantli javoblar: har bir savolga 4 ta variant (biri to'g'ri) */
(() => {
  "use strict";
  const Q = window.SofiMazeQ;
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const SYM = { o: "O", fe: "Fe", au: "Au", na: "Na", h: "H", c: "C", cu: "Cu", ag: "Ag", zn: "Zn", k: "K", ca: "Ca", n: "N", s: "S", cl: "Cl", mg: "Mg" };
  const POOLS = [
    ["sym", Object.keys(SYM)],
    ["planet", ["yupiter", "mars", "venera", "saturn", "merkuriy", "neptun", "uran", "yer"]],
    ["en", ["book", "apple", "school", "red", "water", "teacher", "house", "green", "bread", "window", "pencil"]],
    ["city", ["toshkent", "samarqand", "buxoro", "xiva", "andijon", "shahrisabz", "namangan", "termiz"]],
    ["formula", ["h2o", "co2", "o2", "nacl", "h2so4", "ch4", "nh3"]],
    ["riddle", ["taroq", "archa", "bulut", "kitob", "oy", "samolyot", "toshbaqa", "soat", "quyosh", "xat", "qalam", "shamol"]],
    ["sky", ["quyosh", "oy", "yer", "mars", "yulduz", "kometa"]],
    ["ocean", ["tinch", "atlantika", "hind", "shimoliy muz"]],
    ["pc", ["protsessor", "monitor", "klaviatura", "sichqoncha", "printer", "xotira"]],
  ];
  const pretty = (s) => {
    const k = String(s).toLowerCase();
    if (SYM[k]) return SYM[k];
    if (/^[a-z0-9]+$/.test(k) && /\d/.test(k) && /[a-z]/.test(k)) return k.toUpperCase().replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]); // h2o → H₂O
    if (/^-?\d+([.,]\d+)?$/.test(k)) return k.replace(".", ",");
    if (/^\d+\/\d+$/.test(k)) return k;
    return k.charAt(0).toUpperCase() + k.slice(1);
  };
  function numDistract(n) {
    const out = new Set(), isInt = Number.isInteger(n), mag = Math.max(1, Math.abs(n));
    const cands = isInt ? [n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, n * 2, Math.round(n / 2), n + 5, n - 5, -n, n + 100, Math.round(mag * 1.1), Math.round(mag * 0.9)]
      : [+(n + 0.1).toFixed(2), +(n - 0.1).toFixed(2), +(n * 10).toFixed(2), +(n / 10).toFixed(2), +(n + 1).toFixed(2)];
    shuffle(cands).forEach((c) => { if (out.size < 3 && c !== n && !(n >= 0 && c < 0 && Math.random() < 0.7)) out.add(c); });
    let k = 3; while (out.size < 3) { out.add(n + k); k++; }
    return [...out].map(String);
  }
  /** qq: {q, a:[...]} → qq.opts: 4 ta matn (aralash), qq.right: to'g'ri variant matni */
  Q.options = function (qq) {
    if (qq.opts) return qq.opts;
    const ans = String(qq.a[0]);
    let wrong;
    const num = Number(ans.replace(",", "."));
    if (ans.trim() !== "" && !isNaN(num)) wrong = numDistract(num);
    else {
      const key = Q.norm(ans);
      const pool = POOLS.find(([, list]) => list.some((x) => Q.norm(x) === key || qq.a.some((y) => Q.norm(y) === Q.norm(x))));
      const list = pool ? pool[1] : POOLS.flatMap((p) => p[1]);
      wrong = shuffle(list.filter((x) => !qq.a.some((y) => Q.norm(y) === Q.norm(x)))).slice(0, 3);
    }
    const right = pretty(ans);
    qq.right = right;
    qq.opts = shuffle([right, ...wrong.map(pretty)]);
    return qq.opts;
  };
})();
