/* Matematika Master — 5–6-sinf mavzulari bo'yicha savol generatorlari.
   Har bir urinishda savollar yangidan (tasodifiy) tuziladi. */
(() => {
  "use strict";
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const sp = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const dec = (x) => String(Math.round(x * 10000) / 10000).replace(".", ",");
  /** Kasr ko'rinishi (qisqartirilgan) */
  const F = (n, d) => {
    const g = gcd(n, d); n /= g; d /= g;
    if (d < 0) { n = -n; d = -d; }
    if (d === 1) return String(n);
    return `<span class="mm-fr"><i>${n}</i><i>${d}</i></span>`;
  };
  const near = (x, k = 3) => [x + ri(1, k), x - ri(1, k), x + ri(k + 1, 2 * k + 2)];

  const T = {};

  // 1. 3–4-sinfni takrorlash
  T["takror-3-4"] = [
    () => { const a = ri(12, 49), b = ri(3, 9), c = ri(10, 99); return { q: `${a} · ${b} + ${c} = ?`, a: sp(a * b + c), w: near(a * b + c, 9).map(sp).concat(sp(a * (b + c))) }; },
    () => { const b = ri(4, 9), x = ri(12, 99); return { q: `x · ${b} = ${b * x}. x = ?`, a: String(x), w: near(x, 5).map(String) }; },
    () => { const km = ri(2, 9), m = ri(5, 95); return { q: `${km} km ${m} m necha metr?`, a: sp(km * 1000 + m), w: [sp(km * 100 + m), sp(km * 1000 + m * 10), sp(km * 10000 + m)] }; },
    () => { const a = ri(5, 30), b = ri(3, 20); return { q: `Tomonlari ${a} m va ${b} m bo‘lgan to‘g‘ri to‘rtburchak perimetri?`, a: `${2 * (a + b)} m`, w: [`${a + b} m`, `${a * b} m`, `${2 * (a + b) + 2} m`] }; },
    () => { const h = ri(2, 5); return { q: `${h} soat necha daqiqa?`, a: String(h * 60), w: [String(h * 100), String(h * 60 + 30), String(h * 30)] }; },
    () => { const a = ri(100, 900), b = ri(3, 9) * 100; return { q: `${sp(a * 10)} − ${sp(b)} = ?`, a: sp(a * 10 - b), w: near(a * 10 - b, 50).map(sp) }; },
    () => { const d = ri(3, 9), q = ri(20, 120); return { q: `${sp(d * q)} : ${d} = ?`, a: String(q), w: near(q, 6).map(String) }; },
    () => { const a = ri(4, 12); return { q: `Tomoni ${a} sm bo‘lgan kvadrat yuzi?`, a: `${a * a} sm²`, w: [`${4 * a} sm²`, `${2 * a} sm²`, `${a * a + a} sm²`] }; }
  ];
  // 2. 5-sinfni takrorlash
  T["takror-5"] = [
    () => { const d = pick([3, 4, 5, 6, 8]), n = ri(1, d - 1), k = ri(3, 15) * d; return { q: `${k} ning ${F(n, d)} qismi nechaga teng?`, a: String((k / d) * n), w: near((k / d) * n, 4).map(String) }; },
    () => { const p = pick([10, 20, 25, 50, 15, 30]), s = ri(2, 20) * 20; return { q: `${s} ning ${p}% i?`, a: String((s * p) / 100), w: [String(s - (s * p) / 100), String((s * p) / 10), String((s * p) / 100 + 5)] }; },
    () => { const a = ri(2, 9), x = ri(2, 15), b = ri(1, 30); return { q: `${a}x + ${b} = ${a * x + b}. x = ?`, a: String(x), w: near(x, 3).map(String) }; },
    () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return { q: `${a * b} : ${a} + ${b} · ${c} = ?`, a: String(b + b * c), w: [String((b + b) * c), String(b + b + c), String(b * c - b)] }; },
    () => { const n = ri(11, 15); return { q: `${n}² = ?`, a: String(n * n), w: [String(n * 2), String(n * n + n), String((n - 1) * (n + 1))] }; },
    () => { const a = ri(2, 6), b = ri(2, 6), c = ri(2, 6); return { q: `O‘lchamlari ${a}, ${b}, ${c} sm bo‘lgan quti hajmi?`, a: `${a * b * c} sm³`, w: [`${a + b + c} sm³`, `${2 * (a * b + b * c + a * c)} sm³`, `${a * b * c + a} sm³`] }; },
    () => { const d = pick([3, 4, 5]), n = ri(1, d - 1), v = ri(2, 12) * n; return { q: `Sonning ${F(n, d)} qismi ${v} ga teng. Sonni toping.`, a: String((v / n) * d), w: [String((v / d) * n), String(v * d), String((v / n) * d + d)] }; },
    () => { const a = ri(11, 99) / 10, b = ri(11, 99) / 10; return { q: `${dec(a)} + ${dec(b)} = ?`, a: dec(a + b), w: [dec(a + b + 1), dec(a + b - 0.1), dec(a + b + 0.2)] }; }
  ];
  // 3. Bo'luvchilar va karralilar
  const PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  const ndiv = (n) => { let c = 0; for (let i = 1; i <= n; i++) if (n % i === 0) c++; return c; };
  T["boluvchi-karrali"] = [
    () => { const p = pick(PR.filter((x) => x > 20)); const comp = [pick([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93]), pick([25, 35, 45, 55, 65, 85, 95]), pick([22, 34, 38, 46, 58, 62, 74])]; return { q: "Qaysi son tub?", a: String(p), w: comp.map(String) }; },
    () => { const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 48]); return { q: `${n} ning natural bo‘luvchilari soni?`, a: String(ndiv(n)), w: near(ndiv(n), 2).map(String) }; },
    () => { const k = ri(100, 333) * 3; return { q: "Qaysi son 3 ga bo‘linadi?", a: String(k), w: [k + 1, k + 2, k + 4].map(String) }; },
    () => { const k = ri(12, 110) * 9; return { q: "Qaysi son 9 ga bo‘linadi?", a: String(k), w: [k + 3, k + 6, k + 1].map(String) }; },
    () => { const k = ri(25, 240) * 4; return { q: "Qaysi son 4 ga bo‘linadi?", a: String(k), w: [k + 2, k + 6, k + 10].map(String) }; },
    () => { const opts = [[60, "2²·3·5", ["2·3·10", "2²·15", "2³·3·5"]], [72, "2³·3²", ["2²·3³", "2³·9", "2·6²"]], [90, "2·3²·5", ["2·3·15", "3²·10", "2²·3·5"]], [84, "2²·3·7", ["2·6·7", "2²·21", "2³·3·7"]], [100, "2²·5²", ["2·5³", "4·25", "10²"]]]; const [n, a, w] = pick(opts); return { q: `${n} ni tub ko‘paytuvchilarga ajrating.`, a, w }; },
    () => ({ q: "Eng kichik tub son?", a: "2", w: ["1", "3", "0"] }),
    () => { const a = ri(3, 9), k = ri(4, 9); return { q: `${a} ga karrali ${k}-son (${a}, ${2 * a}, …)?`, a: String(a * k), w: near(a * k, a).map(String) }; }
  ];
  // 4. EKUB va EKUK
  T["ekub-ekuk"] = [
    () => { const g = ri(2, 9), a = g * ri(2, 7), b = g * ri(2, 7); const G = gcd(a, b); return { q: `EKUB(${a}; ${b}) = ?`, a: String(G), w: [String(lcm(a, b)), String(G * 2), String(Math.max(1, G - 1))] }; },
    () => { const a = pick([4, 6, 8, 9, 10, 12, 15]), b = pick([6, 8, 9, 10, 12, 14, 18, 20]); const L = lcm(a, b); return { q: `EKUK(${a}; ${b}) = ?`, a: String(L), w: [String(a * b === L ? L + a : a * b), String(gcd(a, b)), String(L * 2)] }; },
    () => { const g = pick([6, 8, 12]), q = g * ri(2, 4), d = g * ri(3, 5); const G = gcd(q, d); return { q: `${q} ta qalam va ${d} ta daftarni o‘quvchilarga teng bo‘lish kerak. Eng ko‘pi bilan necha o‘quvchiga?`, a: String(G), w: [String(lcm(q, d)), String(G / 2), String(G + 2)] }; },
    () => { const a = pick([10, 12, 15, 20]), b = pick([6, 8, 9, 18, 25, 30]); const L = lcm(a, b); return { q: `Avtobuslar ${a} va ${b} daqiqada qatnaydi. Birga jo‘nagandan keyin yana necha daqiqadan keyin birga jo‘naydi?`, a: String(L), w: [String(a + b), String(a * b === L ? L * 2 : a * b), String(gcd(a, b))] }; },
    () => { const g = ri(2, 6), x = g * ri(2, 5), y = g * ri(2, 5); const G = gcd(x, y), L = lcm(x, y); return { q: `EKUB(a; b) = ${G}, a = ${x}, b = ${y}. EKUK(a; b) = ?`, a: String(L), w: [String(x * y), String(L + G), String(G * 2)] }; },
    () => ({ q: "Qaysi juftlik o‘zaro tub?", a: pick(["8 va 15", "9 va 16", "14 va 25", "21 va 22"]), w: ["12 va 18", "14 va 21", "15 va 25"] })
  ];
  // 5. Oddiy kasrlar
  const den = () => pick([2, 3, 4, 5, 6, 8, 10, 12]);
  T["oddiy-kasrlar"] = [
    () => { const b = den(), d = den(), a = ri(1, b - 1), c = ri(1, d - 1); return { q: `${F(a, b)} + ${F(c, d)} = ?`, a: F(a * d + b * c, b * d), w: [F(a + c, b + d), F(a * d + b * c + b, b * d), F(a * c, b * d)] }; },
    () => { const b = den(), a = ri(1, b - 1), d = den(), c = ri(1, d - 1); return { q: `${F(a, b)} · ${F(c, d)} = ?`, a: F(a * c, b * d), w: [F(a + c, b + d), F(a * d, b * c), F(a * c + 1, b * d)] }; },
    () => { const b = den(), a = ri(1, b - 1), d = den(), c = ri(1, d - 1); return { q: `${F(a, b)} : ${F(c, d)} = ?`, a: F(a * d, b * c), w: [F(a * c, b * d), F(b * c, a * d), F(a * d + 1, b * c)] }; },
    () => { const g = ri(2, 9), n = ri(1, 7), d = n + ri(1, 6); if (gcd(n, d) !== 1) return T["oddiy-kasrlar"][3](); return { q: `<span class="mm-fr"><i>${n * g}</i><i>${d * g}</i></span> kasrni qisqartiring.`, a: F(n, d), w: [F(n + 1, d), F(n, d + 1), F(d, n)] }; },
    () => { const d = pick([5, 7, 8, 9, 11]), a = ri(1, d - 1), c = ri(1, d - 1); if (a === c) return T["oddiy-kasrlar"][4](); const big = a > c ? a : c; return { q: `Qaysi biri katta: ${F(a, d)} yoki ${F(c, d)}?`, a: F(big, d), w: [F(a + c - big, d), "teng", "aniqlab bo‘lmaydi"] }; },
    () => { const w = ri(1, 4), d = pick([2, 3, 5, 7]), n = ri(1, d - 1); return { q: `${w}${F(n, d)} ni noto‘g‘ri kasrga aylantiring.`, a: `<span class="mm-fr"><i>${w * d + n}</i><i>${d}</i></span>`, w: [`<span class="mm-fr"><i>${w + n}</i><i>${d}</i></span>`, `<span class="mm-fr"><i>${w * n + d}</i><i>${d}</i></span>`, `<span class="mm-fr"><i>${w * d}</i><i>${n}</i></span>`] }; },
    () => { const b = den(), d = den(), a = ri(1, b - 1), c = ri(1, d - 1); if (a * d - b * c <= 0) return T["oddiy-kasrlar"][6](); return { q: `${F(a, b)} − ${F(c, d)} = ?`, a: F(a * d - b * c, b * d), w: [F(Math.abs(a - c) || 1, Math.abs(b - d) || 2), F(a * d + b * c, b * d), F(a * d - b * c + 1, b * d)] }; }
  ];
  // 6. O'nli va davriy kasrlar
  T["onli-davriy"] = [
    () => { const [n, d] = pick([[1, 4], [3, 4], [1, 5], [2, 5], [1, 8], [3, 8], [7, 20], [9, 25]]); return { q: `${F(n, d)} ni o‘nli kasrga aylantiring.`, a: dec(n / d), w: [dec(n / d + 0.1), `${n},${d}`, dec(n / (d * 10))] }; },
    () => { const a = ri(2, 9) / 10, b = ri(2, 9) / 10; return { q: `${dec(a)} · ${dec(b)} = ?`, a: dec(a * b), w: [dec(a * b * 10), dec(a * b / 10), dec(a + b)] }; },
    () => { const b = pick([0.2, 0.4, 0.5, 0.05, 0.25]), q = ri(2, 30); const a = Math.round(b * q * 100) / 100; return { q: `${dec(a)} : ${dec(b)} = ?`, a: String(q), w: [String(q * 10), dec(q / 10), String(q + 1)] }; },
    () => { const a = ri(1, 8); return { q: `0,(${a}) ni oddiy kasrga aylantiring.`, a: F(a, 9), w: [F(a, 10), F(a, 99), F(a + 1, 9)] }; },
    () => { const a = ri(10, 98); if (a % 11 === 0) return T["onli-davriy"][4](); return { q: `0,(${a}) ni oddiy kasrga aylantiring.`, a: F(a, 99), w: [F(a, 100), F(a, 90), F(a, 9)] }; },
    () => { const x = ri(101, 999) / 100; return { q: `${dec(x)} · 100 = ?`, a: dec(x * 100), w: [dec(x * 10), dec(x * 1000), dec(x / 100)] }; },
    () => { const a = ri(10, 99) / 10, b = ri(1, 9) / 10; return { q: `${dec(a)} − ${dec(b)} = ?`, a: dec(a - b), w: [dec(a - b + 1), dec(a - b - 0.1), dec(a + b)] }; }
  ];
  // 9. Chiziqli tenglamalar
  T["chiziqli-tenglamalar"] = [
    () => { const x = ri(-6, 12), a = ri(2, 9), c = ri(1, a - 1), b = ri(-10, 15), d = a * x + b - c * x; return { q: `${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}. x = ?`, a: String(x), w: near(x, 3).map(String) }; },
    () => { const x = ri(2, 12), k = ri(2, 6); return { q: `${k}(x − ${x - 1}) = ${k}. x = ?`, a: String(x), w: [String(x - 2), String(x + 1), String(k + x)] }; },
    () => { const a = pick([2, 3, 4, 5]), b = pick([6, 8, 9, 10, 12, 15]), x = (b * ri(1, 5)); return { q: `${F(a, 1)} : x = ${F(a * b, x)} ... ya’ni ${a} / x = ${a * b} / ${x * b}. x = ?`, a: String(x), w: near(x, 4).map(String) }; },
    () => { const n = ri(10, 40); return { q: `Uchta ketma-ket sonning yig‘indisi ${3 * n}. O‘rtadagi son?`, a: String(n), w: [String(n - 1), String(n + 1), String(3 * n / 2 | 0)] }; },
    () => { const x = ri(4, 12), m = ri(2, 4); return { q: `Bir son ikkinchisidan ${m} marta katta, ularning yig‘indisi ${x * (m + 1)}. Kichigi?`, a: String(x), w: [String(x * m), String(x + m), String(x * (m + 1) / 2 | 0)] }; },
    () => { const x = ri(5, 40); return { q: `[x/${pick([2, 4, 5])}] tipidagi: x − ${Math.round(x / 2)} = ${x - Math.round(x / 2)}. x = ?`.replace(/\[x\/\d\] tipidagi: /, ""), a: String(x), w: near(x, 5).map(String) }; },
    () => { const s = ri(5, 12), f = s * ri(3, 4); return { q: `Ota ${f} yoshda, o‘g‘li ${s} yoshda. Necha yildan keyin ota o‘g‘lidan 3 marta katta bo‘ladi?`, a: f - 3 * s >= 0 && (f - 3 * s) % 2 === 0 ? String((f - 3 * s) / 2) : "—", w: [] }; }
  ];
  // oxirgi generator har doim ham butun javob bermaydi — uni olib tashlaymiz
  T["chiziqli-tenglamalar"].pop();
  // proporsiya savolini soddalashtiramiz
  T["chiziqli-tenglamalar"][2] = () => { const a = ri(2, 6), k = ri(2, 5), x = ri(2, 9); return { q: `Proporsiya: ${a} / x = ${a * k} / ${x * k}. x = ?`, a: String(x), w: near(x, 3).map(String) }; };

  T["chiziqli-tenglamalar"][5] = () => { const k = pick([2, 3, 4, 5]), x = k * ri(2, 12), b = ri(1, 20); return { q: `<span class="mm-fr"><i>x</i><i>${k}</i></span> + ${b} = ${x / k + b}. x = ?`, a: String(x), w: [String(x / k), String(x + k), String((x / k + b) * k)] }; };

  // 14. Ketma-ketliklar
  T["ketma-ketliklar"] = [
    () => { const a = ri(1, 20), d = ri(2, 9); const s = [0, 1, 2, 3, 4].map((i) => a + d * i); return { q: `${s.join(", ")}, … keyingi son?`, a: String(a + 5 * d), w: near(a + 5 * d, 3).map(String) }; },
    () => { const a = ri(1, 4), q = ri(2, 3); const s = [0, 1, 2, 3].map((i) => a * q ** i); return { q: `${s.join(", ")}, … keyingi son?`, a: String(a * q ** 4), w: [String(a * q ** 3 + a * q ** 2), String(a * q ** 4 + q), String(a * q ** 3 * 2)] }; },
    () => { const k = ri(1, 4); const s = [0, 1, 2, 3, 4].map((i) => (k + i) ** 2); return { q: `${s.join(", ")}, … keyingi son?`, a: String((k + 5) ** 2), w: near((k + 5) ** 2, 4).map(String) }; },
    () => { const a = ri(1, 3), b = ri(2, 5); const s = [a, b]; for (let i = 0; i < 4; i++) s.push(s[s.length - 1] + s[s.length - 2]); const nx = s[5] + s[4]; return { q: `${s.join(", ")}, … keyingi son?`, a: String(nx), w: near(nx, 4).map(String) }; },
    () => { const s = [1, 3, 6, 10, 15]; return { q: `${s.join(", ")}, … keyingi son?`, a: "21", w: ["20", "25", "18"] }; },
    () => { const a = ri(50, 99), d = ri(3, 8); const s = [0, 1, 2, 3, 4].map((i) => a - d * i); return { q: `${s.join(", ")}, … keyingi son?`, a: String(a - 5 * d), w: near(a - 5 * d, 3).map(String) }; },
    () => { const a = ri(2, 9), d = ri(2, 6), n = ri(8, 20); return { q: `${a}, ${a + d}, ${a + 2 * d}, … ketma-ketlikning ${n}-hadi?`, a: String(a + (n - 1) * d), w: [String(a + n * d), String(a * n), String(a + (n - 2) * d)] }; },
    () => { const a = ri(1, 9); const s = [a, a + 10, a + 1, a + 11, a + 2]; return { q: `${s.join(", ")}, … keyingi son?`, a: String(a + 12), w: [String(a + 3), String(a + 13), String(a + 20)] }; }
  ];
  // 26. To'plamlar
  T["toplamlar"] = [
    () => { const A = ri(10, 20), B = ri(8, 18), AB = ri(2, Math.min(A, B) - 2); return { q: `n(A) = ${A}, n(B) = ${B}, n(A ∩ B) = ${AB}. n(A ∪ B) = ?`, a: String(A + B - AB), w: [String(A + B), String(A + B - 2 * AB), String(A + B + AB)] }; },
    () => { const U = ri(25, 35), f = ri(10, 18), s = ri(8, 15), both = ri(2, 6); const none = U - (f + s - both); if (none < 0) return T["toplamlar"][1](); return { q: `Sinfda ${U} o‘quvchi. ${f} tasi futbol, ${s} tasi shaxmat bilan shug‘ullanadi, ${both} tasi ikkalasi bilan. Nechtasi hech biri bilan shug‘ullanmaydi?`, a: String(none), w: [String(U - f - s), String(none + both), String(Math.max(0, none - 1) === none ? none + 2 : Math.max(0, none - 1))] }; },
    () => { const n = ri(2, 6); return { q: `${n} elementli to‘plamning nechta qism to‘plami bor?`, a: String(2 ** n), w: [String(n * 2), String(n ** 2 === 2 ** n ? n * 3 : n ** 2), String(2 ** n - 1)] }; },
    () => { const a = ri(1, 4); const A = [a, a + 1, a + 2, a + 3, a + 4], B = [a + 3, a + 4, a + 5, a + 6]; return { q: `A = {${A.join("; ")}}, B = {${B.join("; ")}}. A ∩ B = ?`, a: `{${a + 3}; ${a + 4}}`, w: [`{${a}; ${a + 1}; ${a + 2}}`, `{${a + 5}; ${a + 6}}`, `{${a + 3}}`] }; },
    () => { const a = ri(1, 4); const A = [a, a + 2, a + 4], B = [a + 2, a + 4, a + 6]; return { q: `A = {${A.join("; ")}}, B = {${B.join("; ")}}. A ∪ B nechta elementdan iborat?`, a: "4", w: ["6", "2", "3"] }; },
    () => { const A = ri(12, 20), AB = ri(3, 8); return { q: `n(A) = ${A}, n(A ∩ B) = ${AB}. Faqat A ga tegishli elementlar soni?`, a: String(A - AB), w: [String(A + AB), String(A), String(AB)] }; }
  ];
  // 28. Ehtimollik
  T["ehtimollik"] = [
    () => ({ q: "Kubik tashlanganda juft son tushish ehtimoli?", a: F(1, 2), w: [F(1, 3), F(1, 6), F(2, 3)] }),
    () => { const k = ri(1, 6); return { q: `Kubik tashlanganda ${k} tushish ehtimoli?`, a: F(1, 6), w: [F(1, 2), F(k, 6) === F(1, 6) ? F(1, 3) : F(k, 6), F(1, 12)] }; },
    () => { const w = ri(2, 8), b = ri(2, 8); return { q: `Qutida ${w} ta oq va ${b} ta qora shar bor. Tasodifan olingan shar oq bo‘lish ehtimoli?`, a: F(w, w + b), w: [F(w, b) === F(w, w + b) ? F(1, 2) : F(w, b), F(b, w + b), F(1, w + b)] }; },
    () => ({ q: "Tanga 2 marta tashlandi. Ikkalasida ham gerb tushish ehtimoli?", a: F(1, 4), w: [F(1, 2), F(1, 3), F(3, 4)] }),
    () => { const n = pick([10, 20, 30]), k = pick([2, 5]); return { q: `1 dan ${n} gacha sonlardan tasodifan olingan son ${k} ga karrali bo‘lish ehtimoli?`, a: F(Math.floor(n / k), n), w: [F(1, n), F(k, n), F(1, 3)] }; },
    () => ({ q: "Ikki kubik tashlandi. Ikkalasida bir xil son tushish ehtimoli?", a: F(1, 6), w: [F(1, 36), F(1, 12), F(1, 3)] }),
    () => { const p = pick([1, 2, 3, 4]) / 10; return { q: `P(A) = ${dec(p)}. A hodisa ro‘y BERMASLIK ehtimoli?`, a: dec(1 - p), w: [dec(p), dec(1 + p), "0"] }; }
  ];
  // 29. Statistika
  const arr = (n, a, b) => Array.from({ length: n }, () => ri(a, b));
  T["statistika"] = [
    () => { let d = arr(4, 2, 12); const s = d.reduce((x, y) => x + y, 0); if (s % 4) d[0] += 4 - (s % 4); const m = d.reduce((x, y) => x + y, 0) / 4; return { q: `${d.join(", ")} sonlarining o‘rta arifmetigi?`, a: String(m), w: near(m, 2).map(String) }; },
    () => { const d = arr(5, 1, 20); const s = d.slice().sort((x, y) => x - y); return { q: `${d.join(", ")} qatorning medianasi?`, a: String(s[2]), w: [String(s[1]), String(s[3]), String(Math.round(d.reduce((x, y) => x + y, 0) / 5))].filter((x) => x !== String(s[2])).concat([String(s[2] + 1)]) }; },
    () => { const m = ri(2, 5); const d = [m, m, m, ri(1, 5), ri(1, 5)].map((x, i) => (i > 2 && x === m ? x + 1 : x)); d.sort(() => Math.random() - 0.5); return { q: `${d.join(", ")} qatorning modasi?`, a: String(m), w: [String(m + 1), String(m - 1 || 6), String(m + 2)] }; },
    () => { const d = arr(5, 1, 30); const r = Math.max(...d) - Math.min(...d); return { q: `${d.join(", ")} qatorning kengligi (eng katta − eng kichik)?`, a: String(r), w: near(r, 3).map(String) }; },
    () => { const m = ri(10, 15), n = ri(4, 6), x = ri(16, 25); return { q: `${n} ta sonning o‘rtachasi ${m}. Yana bitta son qo‘shilgach o‘rtacha ${m + 1} bo‘ldi. Qo‘shilgan son?`, a: String((n + 1) * (m + 1) - n * m), w: [String(m + 1), String((n + 1) * (m + 1) - n * m + 1), String(x)] }; },
    () => { const d = [5, 4, 5, 3, 5, 4]; return { q: `Baholar: ${d.join(", ")}. O‘rtacha baho?`, a: dec(26 / 6).slice(0, 4), w: ["4,5", "5", "4"] }; }
  ];
  // 30. Geometrik tushunchalar va burchaklar
  T["burchaklar"] = [
    () => { const a = ri(20, 160); return { q: `Qo‘shni burchaklardan biri ${a}°. Ikkinchisi?`, a: `${180 - a}°`, w: [`${a}°`, `${90 - a > 0 ? 90 - a : 360 - a}°`, `${180 - a + 10}°`] }; },
    () => { const a = ri(20, 160); return { q: `Vertikal burchaklardan biri ${a}°. Ikkinchisi?`, a: `${a}°`, w: [`${180 - a}°`, `${2 * a}°`, `${a + 10}°`] }; },
    () => { const a = ri(30, 80), b = ri(30, 80); return { q: `Uchburchakning ikki burchagi ${a}° va ${b}°. Uchinchi burchak?`, a: `${180 - a - b}°`, w: [`${a + b}°`, `${360 - a - b}°`, `${180 - a - b + 10}°`] }; },
    () => { const h = ri(1, 11); const ang = Math.min(h * 30, 360 - h * 30); return { q: `Soat ${h}:00 da soat va daqiqa millari orasidagi (kichik) burchak?`, a: `${ang}°`, w: [`${h * 30 === ang ? ang + 30 : h * 30}°`, `${ang + 15}°`, `${Math.abs(ang - 30) || 45}°`] }; },
    () => { const a = ri(40, 140); return { q: `Burchak ${a}°. Uning bissektrisasi qanday burchaklar hosil qiladi?`, a: `${a / 2}° va ${a / 2}°`, w: [`${a}° va ${a}°`, `${a / 2 + 10}° va ${a / 2 - 10}°`, `${180 - a}° va ${a}°`] }; },
    () => { const a = ri(40, 140); return { q: `Parallel chiziqlarni kesuvchi kesganda ichki almashinuvchi burchaklardan biri ${a}°. Ikkinchisi?`, a: `${a}°`, w: [`${180 - a}°`, `${90}°`, `${a + 20}°`] }; },
    () => { const a = ri(40, 140); return { q: `Ichki bir tomonli burchaklardan biri ${a}°. Ikkinchisi?`, a: `${180 - a}°`, w: [`${a}°`, `${360 - a}°`, `${180 - a + 20}°`] }; },
    () => { const t = pick([["o‘tkir", ri(10, 85)], ["o‘tmas", ri(95, 175)], ["to‘g‘ri", 90], ["yoyiq", 180]]); return { q: `${t[1]}° li burchak qanday burchak?`, a: t[0], w: ["o‘tkir", "o‘tmas", "to‘g‘ri", "yoyiq"].filter((x) => x !== t[0]) }; }
  ];

  const TOPICS = [
    { id: "takror-3-4", title: "3–4-sinfni takrorlash", icon: "🧮", cls: "5-sinf" },
    { id: "takror-5", title: "5-sinfni takrorlash", icon: "📘", cls: "5–6-sinf" },
    { id: "boluvchi-karrali", title: "Bo‘luvchilar va karralilar", icon: "🔢", cls: "5–6-sinf" },
    { id: "ekub-ekuk", title: "EKUB va EKUK", icon: "🔗", cls: "6-sinf" },
    { id: "oddiy-kasrlar", title: "Oddiy kasrlar", icon: "🍕", cls: "5–6-sinf" },
    { id: "onli-davriy", title: "O‘nli va davriy kasrlar", icon: "🔟", cls: "5–6-sinf" },
    { id: "chiziqli-tenglamalar", title: "Chiziqli tenglamalar", icon: "⚖️", cls: "6-sinf" },
    { id: "ketma-ketliklar", title: "Ketma-ketliklar va qonuniyatlar", icon: "🧩", cls: "5–6-sinf" },
    { id: "toplamlar", title: "To‘plamlar va Venn diagrammasi", icon: "⭕", cls: "6-sinf" },
    { id: "ehtimollik", title: "Ehtimollik", icon: "🎲", cls: "6-sinf" },
    { id: "statistika", title: "Statistika: o‘rtacha, mediana, moda", icon: "📊", cls: "6-sinf" },
    { id: "burchaklar", title: "Burchaklar", icon: "📐", cls: "5–6-sinf" }
  ];

  /** Mavzu bo'yicha 10 ta savol: har bir savolda 4 ta har xil variant */
  function build(topicId, n = 10) {
    const gens = T[topicId] || [];
    const out = [];
    const used = new Set();
    let guard = 0;
    while (out.length < n && guard++ < 400) {
      const g = gens[(out.length + guard) % gens.length === 0 ? ri(0, gens.length - 1) : ri(0, gens.length - 1)];
      let item;
      try { item = g(); } catch (e) { continue; }
      if (!item || !item.a || used.has(item.q)) continue;
      const opts = [item.a];
      for (const w of item.w || []) if (w != null && w !== "" && !opts.includes(String(w)) && opts.length < 4) opts.push(String(w));
      let k = 1;
      while (opts.length < 4 && k < 30) {
        const delta = k % 2 ? Math.ceil(k / 2) : -Math.ceil(k / 2);
        const src = String(item.a);
        const alt = src.replace(/-?\d+(?:,\d+)?/, (m) => { const v = Number(m.replace(",", ".")) + delta; return dec(v); });
        if (alt !== src && !opts.includes(alt)) opts.push(alt);
        k++;
      }
      used.add(item.q);
      const order = opts.map((o, i) => [o, Math.random(), i]).sort((a, b) => a[1] - b[1]);
      out.push({ q: item.q, options: order.map((x) => x[0]), correct: order.findIndex((x) => x[2] === 0) });
    }
    return out;
  }

  window.MASTER_GAME = { TOPICS, build };
})();
