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
