/* Milliy sertifikat (Matematika) — variant generatori. Savollar mualliflik (sayt uchun yozilgan) shablonlar asosida
   tasodifiy sonlar bilan yaratiladi; to'g'ri javob dastur tomonidan hisoblanadi.
   Tuzilish: 1–32 yopiq test (A–D), 33–35 moslashtirish (A–F), 36–45 ochiq topshiriqlar (a, b). */
(() => {
  "use strict";
  // ---------- yordamchilar ----------
  function rng(seed) { let a = (seed * 2654435761) >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let R = Math.random;
  const ri = (a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(R() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  /** Kasr: [surat, maxraj] → qisqartirilgan */
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  /** HTML ko'rinishi: butun yoki kasr */
  const F = (n, d = 1) => { const [a, b] = fr(n, d); if (b === 1) return num(a); return `${a < 0 ? "−" : ""}<span class="fr"><i>${Math.abs(a)}</i><i>${b}</i></span>`; };
  const num = (v) => (v < 0 ? "−" : "") + String(Math.abs(Math.round(v * 1e6) / 1e6)).replace(".", ",");
  /** Ko'phad yozuvi: P([2,"x²"],[-3,"x"],[5,""]) → "2x² − 3x + 5" (nollar tashlanadi) */
  const P = (...terms) => { let out = ""; terms.forEach(([c, v]) => { if (!c) return; const a = Math.abs(c), body = (a === 1 && v ? "" : a) + v;
    out += out ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; }); return out || "0"; };
  /** (x − a) yozuvi */
  const XM = (a, v = "x") => (a === 0 ? v : `${v} ${a > 0 ? "−" : "+"} ${Math.abs(a)}`);
  /** Yopiq test: to'g'ri javob HTML va chalg'ituvchilar → {opts, a} */
  function mc(right, wrongs) {
    const seen = new Set([right]); const ws = [];
    for (const w of wrongs) { if (!seen.has(w) && ws.length < 3) { seen.add(w); ws.push(w); } }
    let k = 2; while (ws.length < 3 && k < 40) { const w = right.replace(/\d+/, (m) => String(Number(m) + k)); if (!seen.has(w)) { seen.add(w); ws.push(w); } k++; }
    while (ws.length < 3) ws.push("—".repeat(ws.length + 1));
    const opts = shuffle([right, ...ws]); return { opts, a: opts.indexOf(right) };
  }
  const near = (v, steps) => steps.map((s) => num(v + s));

  // ===================================================================
  // 1–32: YOPIQ TESTLAR (yuqori qiyinlik — milliy sertifikat darajasi)
  // ===================================================================
  const tz = (n) => { let z = 0; for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p); return z; };
  const modpow = (b, e, m) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; };
  const SQ = (k) => (k === 1 ? "" : `${k}`);
  const CLOSED = [
    // 1. n! oxiridagi nollar
    () => { let k, n; do { k = ri(6, 40); n = 0; for (let x = 5; x < 1000; x++) if (tz(x) === k) { n = x; break; } } while (!n);
      return { q: `n! (1·2·3·…·n) ko‘paytma roppa-rosa ${k} ta nol bilan tugaydigan eng kichik natural n ni toping.`, ...mc(num(n), [num(n + 5), num(n - 5), num(5 * k)]),
        sol: `n! oxiridagi nollar soni [n/5] + [n/25] + [n/125] + …; n = ${n} da ${k} ta, n = ${n - 1} da esa kamroq.` }; },
    // 2. Teleskopik yig'indi
    () => { const n = ri(8, 40), t = pick([1, 2]);
      if (t === 1) return { q: `Hisoblang: <span class="ex">${F(1, 1 * 2)} + ${F(1, 2 * 3)} + ${F(1, 3 * 4)} + … + ${F(1, n * (n + 1))}</span>`, ...mc(F(n, n + 1), [F(n - 1, n), F(1, n + 1), F(n + 1, n + 2)]),
        sol: `${F(1, "k(k+1)".length ? 1 : 1)}/(k(k + 1)) = 1/k − 1/(k + 1) → 1 − ${F(1, n + 1)} = ${F(n, n + 1)}.` };
      return { q: `Hisoblang: <span class="ex">${F(1, 1 * 3)} + ${F(1, 3 * 5)} + ${F(1, 5 * 7)} + … + ${F(1, (2 * n - 1) * (2 * n + 1))}</span>`, ...mc(F(n, 2 * n + 1), [F(2 * n, 2 * n + 1), F(n, 2 * n - 1), F(n + 1, 2 * n + 1)]),
        sol: `1/((2k − 1)(2k + 1)) = ½(1/(2k − 1) − 1/(2k + 1)) → ½(1 − ${F(1, 2 * n + 1)}) = ${F(n, 2 * n + 1)}.` }; },
    // 3. Ish: ikki ishchi, kvadrat tenglama
    () => { let x, d, t; for (;;) { x = ri(3, 30); d = ri(1, 25); const num_ = x * (x + d), den = 2 * x + d; if (num_ % den === 0) { t = num_ / den; break; } }
      return { q: `Ikki usta birgalikda ishni ${t} kunda tugatadi. Birinchi usta yolg‘iz o‘zi ishni ikkinchisidan ${d} kun tezroq bajaradi. Birinchi usta ishni yolg‘iz necha kunda bajaradi?`,
        ...mc(num(x), [num(x + d), num(2 * t), num(x + 1)]), sol: `1/x + 1/(x + ${d}) = 1/${t} → x = ${x} (musbat ildiz).` }; },
    // 4. Daryo oqimi
    () => { let v, u, S, T; for (;;) { v = ri(8, 25); u = ri(1, 5); S = ri(2, 12) * (v * v - u * u) / gcd(v * v - u * u, 2 * v); if (Number.isInteger(S) && S <= 400) { T = (S / (v + u)) + (S / (v - u)); if (Number.isInteger(T * 2)) break; } }
      return { q: `Motorli qayiqning turg‘un suvdagi tezligi ${v} km/soat. Qayiq oqim bo‘yicha ${num(S)} km yurib, orqaga qaytdi va hamma yo‘lga ${num(T)} soat sarfladi. Daryo oqimining tezligini toping.`,
        ...mc(`${u} km/soat`, [`${u + 1} km/soat`, `${u + 2} km/soat`, `${Math.max(1, u - 1) === u ? u + 3 : u - 1} km/soat`]), sol: `${num(S)}/(${v} + u) + ${num(S)}/(${v} − u) = ${num(T)} → u = ${u}.` }; },
    // 5. Qoldiq / oxirgi raqam
    () => { const t = pick([0, 1]);
      if (t === 0) { const a = ri(2, 9), n = ri(100, 2025), m = pick([7, 9, 11, 13]), r = modpow(a, n, m);
        return { q: `<span class="ex">${a}<sup>${n}</sup></span> ni ${m} ga bo‘lgandagi qoldiqni toping.`, ...mc(num(r), [num((r + 1) % m), num((r + 2) % m), num((r + m - 1) % m)].map((x) => (x === num(r) ? num((r + 3) % m) : x))),
          sol: `${a} ning darajalari ${m} ga bo‘lganda qoldiqlar davriy takrorlanadi; ${a}<sup>${n}</sup> ≡ ${r} (mod ${m}).` }; }
      const a = ri(2, 9), b = ri(2, 9), n = ri(100, 2025), m = ri(100, 2025), d = (modpow(a, n, 10) + modpow(b, m, 10)) % 10;
      return { q: `<span class="ex">${a}<sup>${n}</sup> + ${b}<sup>${m}</sup></span> sonining oxirgi raqamini toping.`, ...mc(num(d), [num((d + 2) % 10), num((d + 5) % 10), num((d + 7) % 10)]),
        sol: `Oxirgi raqamlar 4 tadan davriy takrorlanadi: ${modpow(a, n, 10)} + ${modpow(b, m, 10)} → ${d}.` }; },
    // 6. Murakkab ildizlar
    () => { const x = ri(3, 12), y = ri(1, x - 1); if (Math.sqrt(x) % 1 === 0 && Math.sqrt(y) % 1 === 0) return CLOSED[5]();
      return { q: `Hisoblang: <span class="ex">√(${x + y} + 2√${x * y}) − √(${x + y} − 2√${x * y})</span>`, ...mc(`2√${y}`, [`2√${x}`, `√${x + y}`, `${2 * y}`]),
        sol: `${x + y} ± 2√${x * y} = (√${x} ± √${y})² → (√${x} + √${y}) − (√${x} − √${y}) = 2√${y}.` }; },
    // 7. Ildizlar yig'indisi
    () => { const p = ri(2, 6), q = ri(2, p * p - 1); if (Math.sqrt(q) % 1 === 0) return CLOSED[6]();
      return { q: `Hisoblang: <span class="ex">√(${p * p + q} + ${2 * p}√${q}) + √(${p * p + q} − ${2 * p}√${q})</span>`, ...mc(num(2 * p), [`${2 * p}√${q}`, num(2 * p + 1), `2√${q}`]),
        sol: `${p * p + q} ± ${2 * p}√${q} = (${p} ± √${q})², ${p} &gt; √${q} → ${p} + √${q} + ${p} − √${q} = ${2 * p}.` }; },
    // 8. Bo'luvchilar soni
    () => { const a = ri(1, 5), b = ri(1, 3), c = ri(0, 2), N = 2 ** a * 3 ** b * 5 ** c, k = (a + 1) * (b + 1) * (c + 1);
      return { q: `${N} sonining natural bo‘luvchilari nechta?`, ...mc(num(k), [num(k + 2), num(a + b + c + 1), num(k * 2)]),
        sol: `${N} = 2<sup>${a}</sup>·3<sup>${b}</sup>${c ? `·5<sup>${c}</sup>` : ""} → (${a} + 1)(${b} + 1)${c ? `(${c} + 1)` : ""} = ${k}.` }; },
    // 9. Cheksiz kamayuvchi geometrik progressiya
    () => { const [qn, qd] = pick([[1, 2], [1, 3], [-1, 2], [2, 3], [-1, 3]]), b1 = ri(2, 9) * qd;
      const [Sn, Sd] = fr(b1 * qd, qd - qn), [S2n, S2d] = fr(b1 * b1 * qd * qd, qd * qd - qn * qn);
      return { q: `Cheksiz kamayuvchi geometrik progressiya hadlarining yig‘indisi ${F(Sn, Sd)} ga, hadlari kvadratlarining yig‘indisi ${F(S2n, S2d)} ga teng. Progressiyaning birinchi hadini toping.`,
        ...mc(num(b1), [num(b1 * 2), F(b1, 2), num(b1 + qd)]), sol: `S = b₁/(1 − q), S₂ = b₁²/(1 − q²) → S₂/S = b₁/(1 + q). Yechib: q = ${F(qn, qd)}, b₁ = ${b1}.` }; },
    // 10. x + 1/x
    () => { const k = ri(3, 7), t = pick([0, 1]); const v = t ? k ** 3 - 3 * k : (k * k - 2) ** 2 - 2;
      return { q: `<span class="ex">x + ${F(1, 1).replace("1", "")}1/x = ${k}</span> bo‘lsa, <span class="ex">${t ? "x³ + 1/x³" : "x⁴ + 1/x⁴"}</span> ni hisoblang.`, ...mc(num(v), [num(t ? k ** 3 : k ** 4), num(v + 2), num(t ? k ** 3 - k : (k * k - 2) ** 2)]),
        sol: t ? `x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${k ** 3} − ${3 * k} = ${v}.` : `x² + 1/x² = ${k * k} − 2 = ${k * k - 2}; x⁴ + 1/x⁴ = ${k * k - 2}² − 2 = ${v}.` }; },
    // 11. Viyet: x/y + y/x
    () => { const x = ri(1, 8), y = ri(1, 8) * pick([1, -1]); if (x === y) return CLOSED[10](); const s = x + y, p = x * y, [n, d] = fr(s * s - 2 * p, p);
      return { q: `<span class="ex">x + y = ${s}, xy = ${p}</span> bo‘lsa, <span class="ex">x/y + y/x</span> ni toping.`, ...mc(F(n, d), [F(s * s, p), F(n + d, d), F(-n, d)]),
        sol: `x/y + y/x = (x² + y²)/(xy) = (s² − 2p)/p = ${F(n, d)}.` }; },
    // 12. tgα berilgan
    () => { const a = ri(2, 7), b = pick([1, 2, 3]); if (a === b) return CLOSED[11](); const [n, d] = fr(a + b, a - b);
      return { q: `<span class="ex">tgα = ${F(a, b)}</span> bo‘lsa, <span class="ex">(sinα + cosα)/(sinα − cosα)</span> ni hisoblang.`, ...mc(F(n, d), [F(d, n), F(a - b, a + b), F(-n, d)]),
        sol: `Surat va maxrajni cosα ga bo‘lamiz: (tgα + 1)/(tgα − 1) = ${F(n, d)}.` }; },
    // 13. Trigonometrik ayniyatlar (qiymat)
    () => { const T = pick([["sin10°·sin50°·sin70°", F(1, 8), [F(1, 4), F(1, 16), F(3, 8)]], ["cos20°·cos40°·cos80°", F(1, 8), [F(1, 4), F(3, 8), F(1, 16)]], ["tg20°·tg40°·tg80°", "√3", ["1", `${F(1, 1).replace("1", "")}√3/3`, "3"]],
        ["cos²15° − sin²15°", "√3/2", ["1/2", "√2/2", "1"]], ["sin15°·cos15°", F(1, 4), [F(1, 2), "√3/4", F(1, 8)]], ["cos(π/7)·cos(2π/7)·cos(4π/7)", "−" + F(1, 8), [F(1, 8), "−" + F(1, 4), F(1, 4)]], ["sin18°·cos36°", F(1, 4), [F(1, 2), F(1, 8), "√5/4"]]]);
      return { q: `Hisoblang: <span class="ex">${T[0]}</span>`, ...mc(T[1], T[2]), sol: `Ikki karrali burchak formulasini ketma-ket qo‘llash (yoki ayniyat): natija ${T[1]}.` }; },
    // 14. Ko'rsatkichli: ildizlar yig'indisi
    () => { const b = pick([2, 3]), i = ri(0, 3), j = ri(i + 1, 4), t1 = b ** i, t2 = b ** j;
      return { q: `<span class="ex">${b * b === 4 ? 4 : 9}<sup>x</sup> − ${t1 + t2}·${b}<sup>x</sup> + ${t1 * t2} = 0</span> tenglama ildizlari yig‘indisini toping.`, ...mc(num(i + j), [num(t1 + t2), num(i * j), num(j - i)]),
        sol: `t = ${b}<sup>x</sup>: t² − ${t1 + t2}t + ${t1 * t2} = 0 → t = ${t1}, ${t2} → x = ${i}, ${j}; yig‘indi ${i + j}.` }; },
    // 15. Logarifmlar (har xil asoslar)
    () => { const k = 7 * ri(1, 2), x = 2 ** ((4 * k) / 7);
      return { q: `<span class="ex">log₂x + log₄x + log₁₆x = ${k}</span> tenglamani yeching.`, ...mc(num(x), [num(x * 2), num(2 ** k), num(x / 2)]),
        sol: `log₂x·(1 + ½ + ¼) = ${k} → log₂x = ${(4 * k) / 7} → x = ${x}.` }; },
    // 16. Ratsional tengsizlik (butun yechimlar)
    () => { const a = ri(-7, -1), b = ri(2, 8), c = ri(-6, 9); if (c === a || c === b) return CLOSED[15](); let cnt = 0; for (let x = -10; x <= 10; x++) { if (x === c) continue; if (((x - a) * (x - b)) / (x - c) <= 0) cnt++; }
      return { q: `<span class="ex">(${XM(a)})(${XM(b)}) / (${XM(c)}) ≤ 0</span> tengsizlikning [−10; 10] kesmadagi butun yechimlari nechta?`, ...mc(num(cnt), [num(cnt + 1), num(cnt - 1), num(21 - cnt)]),
        sol: `Oraliqlar usuli: nollar ${a}, ${b}, uzilish ${c}. Kesmadagi butun yechimlar soni ${cnt}.` }; },
    // 17. Viyet: ildizlar ayirmasi
    () => { const s = ri(3, 15), d = ri(1, s - 1); if ((s + d) % 2) return CLOSED[16](); const q = (s * s - d * d) / 4;
      return { q: `<span class="ex">x² − ${s}x + q = 0</span> tenglama ildizlari ayirmasi ${d} ga teng. q ni toping.`, ...mc(num(q), [num(q + d), num((s * s + d * d) / 4), num(s * d)]),
        sol: `(x₁ − x₂)² = (x₁ + x₂)² − 4x₁x₂ → ${d * d} = ${s * s} − 4q → q = ${q}.` }; },
    // 18. Ketma-ket foiz
    () => { const p = pick([10, 20, 25, 30, 50]), tot = Math.round(((1 + p / 100) ** 2 - 1) * 10000) / 100;
      return { q: `Mahsulot narxi ikki marta bir xil foizga oshirildi va natijada jami ${num(tot)} % ga oshdi. Har safar narx necha foizga oshirilgan?`, ...mc(`${p} %`, [`${num(tot / 2)} %`, `${p + 5} %`, `${p - 5} %`]),
        sol: `(1 + x)² = ${num(1 + tot / 100)} → 1 + x = ${num(1 + p / 100)} → x = ${p} %.` }; },
    // 19. Nochiziqli sistema
    () => { const x = ri(1, 9), y = ri(1, 9), A = x * x + y * y, B = x * y;
      return { q: `x &gt; 0, y &gt; 0 va <span class="ex">x² + y² = ${A}, xy = ${B}</span> bo‘lsa, x + y ni toping.`, ...mc(num(x + y), [num(Math.abs(x - y)), num(A - B), num(x + y + 1)]),
        sol: `(x + y)² = x² + y² + 2xy = ${A + 2 * B} → x + y = ${x + y}.` }; },
    // 20. Sₙ formulasi
    () => { const a = ri(1, 5), b = ri(-5, 6), k = ri(5, 15), ak = a * (2 * k - 1) + b;
      return { q: `Arifmetik progressiyaning dastlabki n ta hadi yig‘indisi <span class="ex">Sₙ = ${P([a, "n²"], [b, "n"])}</span> formula bilan berilgan. a<sub>${k}</sub> ni toping.`, ...mc(num(ak), [num(a * k * k + b * k), num(ak + 2 * a), num(a * 2 * k + b)]),
        sol: `aₙ = Sₙ − Sₙ₋₁ = ${a}(2n − 1) ${b >= 0 ? "+" : "−"} ${Math.abs(b)} → a<sub>${k}</sub> = ${ak}.` }; },
    // 21. Teskari funksiya
    () => { const a = ri(1, 5), b = ri(-6, 6), c = ri(1, 3), d = ri(1, 7), x0 = ri(-4, 6); if (a * d - b * c === 0 || c * x0 + d === 0) return CLOSED[20](); const [n, dd] = fr(a * x0 + b, c * x0 + d);
      return { q: `<span class="ex">f(x) = (${P([a, "x"], [b, ""])})/(${P([c, "x"], [d, ""])})</span> bo‘lsa, <span class="ex">f⁻¹(${F(n, dd)})</span> ni toping.`, ...mc(num(x0), [num(-x0 || 1), num(x0 + 1), F(dd, n || 1)]),
        sol: `f(x) = ${F(n, dd)} tenglamani yechamiz → x = ${x0}.` }; },
    // 22. Urinma
    () => { const a = ri(1, 3), b = ri(1, 6), x0 = ri(-3, 3) || 2; const f = (x) => a * x ** 3 - 3 * b * x, df = 3 * a * x0 * x0 - 3 * b, c = f(x0) - df * x0;
      return { q: `<span class="ex">y = ${P([a, "x³"], [-3 * b, "x"])}</span> funksiya grafigiga abssissasi x₀ = ${x0} nuqtada o‘tkazilgan urinma Oy o‘qini qaysi nuqtada kesadi (ordinatasini toping)?`, ...mc(num(c), [num(f(x0)), num(df), num(-c)]),
        sol: `y = f(x₀) + f′(x₀)(x − x₀); f(${x0}) = ${f(x0)}, f′(${x0}) = ${df}; x = 0 da y = ${c}.` }; },
    // 23. Egri chiziqlar orasidagi yuza
    () => { const k = pick([1, 2, 3, 4, 6]), [n, d] = fr(k ** 3, 6);
      return { q: `<span class="ex">y = x²</span> va <span class="ex">y = ${k === 1 ? "" : k}x</span> chiziqlar bilan chegaralangan figuraning yuzini toping.`, ...mc(F(n, d), [F(k ** 3, 3), F(k ** 3, 2), F(k * k, 2)]),
        sol: `∫₀<sup>${k}</sup> (${k === 1 ? "" : k}x − x²) dx = ${k}³/2 − ${k}³/3 = ${F(n, d)}.` }; },
    // 24. Ichki chizilgan aylana (Geron)
    () => { const [a, b, c, S] = pick([[13, 14, 15, 84], [5, 5, 6, 12], [10, 10, 12, 48], [7, 15, 20, 42], [9, 10, 17, 36], [6, 25, 29, 60]]), k = ri(1, 2), r = (2 * S * k * k) / ((a + b + c) * k);
      return { q: `Tomonlari ${a * k}, ${b * k} va ${c * k} ga teng uchburchakka ichki chizilgan aylana radiusini toping.`, ...mc(num(r), [num(r * 2), num(r + 1), num((S * k * k) / (a * k))]),
        sol: `p = ${((a + b + c) * k) / 2}, S = √(p(p − a)(p − b)(p − c)) = ${S * k * k}, r = S/p = ${num(r)}.` }; },
    // 25. Teng yonli trapetsiya
    () => { const [x, h, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), b = ri(2, 12), a = b + 2 * x, S = ((a + b) * h) / 2;
      return { q: `Teng yonli trapetsiyaning asoslari ${a} va ${b} ga, yon tomoni ${c} ga teng. Trapetsiya yuzini toping.`, ...mc(num(S), [num((a + b) * c / 2), num(S + a), num((a + b) * h)]),
        sol: `Balandlik √(${c}² − ${x}²) = ${h}; S = (${a} + ${b})·${h}/2 = ${S}.` }; },
    // 26. Gipotenuzaga tushirilgan balandlik
    () => { const [p, q, h] = pick([[4, 9, 6], [1, 16, 4], [2, 8, 4], [9, 16, 12], [3, 12, 6], [4, 25, 10]]);
      return { q: `To‘g‘ri burchakli uchburchakning to‘g‘ri burchagidan tushirilgan balandlik gipotenuzani ${p} va ${q} ga teng bo‘laklarga ajratadi. Uchburchak yuzini toping.`, ...mc(num(((p + q) * h) / 2), [num(p * q), num((p + q) * h), num(((p + q) * (p + q)) / 4)]),
        sol: `h² = ${p}·${q} → h = ${h}; S = (${p} + ${q})·${h}/2 = ${num(((p + q) * h) / 2)}.` }; },
    // 27. Vatar
    () => { const [d, hc, R] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), k = ri(1, 2);
      return { q: `Radiusi ${R * k} ga teng aylananing markazidan ${d * k} masofada joylashgan vatar uzunligini toping.`, ...mc(num(2 * hc * k), [num(hc * k), num(2 * R * k - d * k), num(2 * d * k)]),
        sol: `Yarim vatar √(${R * k}² − ${d * k}²) = ${hc * k}; vatar ${2 * hc * k}.` }; },
    // 28. Muntazam ko'pburchak
    () => { const k = ri(2, 9), n = 2 * k + 2, D = (n * (n - 3)) / 2;
      return { q: `Muntazam ko‘pburchakning ichki burchagi tashqi burchagidan ${k} marta katta. Uning diagonallari nechta?`, ...mc(num(D), [num(D + n), num(n), num((n * (n - 1)) / 2)]),
        sol: `ichki/tashqi = (n − 2)/2 = ${k} → n = ${n}; diagonallar n(n − 3)/2 = ${D}.` }; },
    // 29. Sinuslar teoremasi
    () => { const [A, s, txt] = pick([[30, 1, "30°"], [150, 1, "150°"], [45, Math.SQRT2, "45°"], [60, Math.sqrt(3), "60°"], [120, Math.sqrt(3), "120°"]]), R = ri(2, 9);
      const side = s === 1 ? num(R) : s === Math.SQRT2 ? `${R}√2` : `${R}√3`;
      return { q: `Uchburchakda A = ${txt} va BC = ${side}. Uchburchakka tashqi chizilgan doira yuzini toping.`, ...mc(`${R * R}π`, [`${4 * R * R}π`, `${2 * R * R}π`, `${R}π`]),
        sol: `BC/sinA = 2R → R = ${R}; S = πR² = ${R * R}π.` }; },
    // 30. Perpendikulyar vektorlar
    () => { let p, q, r, m; for (;;) { p = ri(1, 6); q = ri(1, 6); r = ri(-6, 8); if ((p * r) % (p + q) === 0) { m = (p * r) / (p + q); break; } }
      return { q: `<span class="ex">a⃗(m; ${p})</span> va <span class="ex">b⃗(${q}; ${XM(r, "m")})</span> vektorlar perpendikulyar bo‘lsa, m ni toping.`, ...mc(num(m), [num(-m || 1), num(m + 1), num(r)]),
        sol: `a⃗·b⃗ = ${q}m + ${p}(m ${r >= 0 ? "−" : "+"} ${Math.abs(r)}) = 0 → ${p + q}m = ${p * r} → m = ${m}.` }; },
    // 31. Kombinatorika (sanash)
    () => { const t = pick([0, 1, 2]); let cnt = 0, txt;
      if (t === 0) { const d = pick([5, 4, 3]); for (let n = 1000; n <= 9999; n++) { const s = String(n); if (new Set(s).size === 4 && n % d === 0) cnt++; } txt = `Raqamlari turli bo‘lgan ${d} ga karrali to‘rt xonali sonlar nechta?`; }
      else if (t === 1) { for (let n = 100; n <= 999; n++) { const s = String(n); if (new Set(s).size === 3 && n % 2 === 0) cnt++; } txt = "Raqamlari turli bo‘lgan uch xonali juft sonlar nechta?"; }
      else { const k = ri(3, 4); for (let n = 10 ** (k - 1); n < 10 ** k; n++) { const s = String(n); if ([...s].every((c) => "13579".includes(c)) && new Set(s).size === k) cnt++; } txt = `Faqat toq raqamlardan tuzilgan, raqamlari turli ${k} xonali sonlar nechta?`; }
      return { q: txt, ...mc(num(cnt), [num(cnt + 24), num(cnt - 16), num(Math.round(cnt * 1.25))]), sol: `Sanash (o‘rinlashtirishlar): ${cnt} ta.` }; },
    // 32. Ehtimollik (qaytarmasdan)
    () => { const r = ri(3, 8), w = ri(3, 8), n = r + w, [a, b] = fr(r * (r - 1), n * (n - 1)), [c, d] = fr(2 * r * w, n * (n - 1)), t = pick([0, 1]);
      return { q: `Qutida ${r} ta qizil va ${w} ta oq shar bor. Tavakkaliga ketma-ket 2 ta shar olinadi (qaytarilmaydi). ${t ? "Sharlar har xil rangda" : "Ikkalasi ham qizil"} bo‘lish ehtimolini toping.`,
        ...mc(t ? F(c, d) : F(a, b), t ? [F(r * w, n * n), F(r * w, n * (n - 1)), F(a, b)] : [F(r * r, n * n), F(r, n), F(c, d)]),
        sol: t ? `P = 2·(${r}/${n})·(${w}/${n - 1}) = ${F(c, d)}.` : `P = (${r}/${n})·(${r - 1}/${n - 1}) = ${F(a, b)}.` }; },
  ];

  // ===================================================================
  // 33–35: MOSLASHTIRISH
  // ===================================================================
  const MATCH = [
    () => { const [a, h, l] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), k = ri(1, 2), A = 2 * a * k, H = h * k, Lp = l * k; // muntazam to'rtburchakli piramida
      const qs = [["Piramida hajmini toping.", (A * A * H) / 3], ["Piramida yon sirti yuzini toping.", 2 * A * Lp], ["Piramida to‘la sirti yuzini toping.", 2 * A * Lp + A * A]];
      return { ctx: `Muntazam to‘rtburchakli piramidaning asos tomoni ${A} ga, apofemasi ${Lp} ga teng.`, qs, extra: [A * A * H, A * Lp, A * A * Lp / 3] }; },
    () => { const [r, hh, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]); // konus, yasovchi berilgan
      const qs = [["Konus hajmini toping.", r * r * hh], ["Konus yon sirti yuzini toping.", 3 * r * l], ["Konus o‘q kesimi yuzini toping.", r * hh]];
      return { ctx: `Konusning yasovchisi ${l} ga, asos radiusi ${r} ga teng (π ≈ 3 deb oling).`, qs, extra: [3 * r * r * hh, 3 * r * (r + l), 2 * r * hh] }; },
    () => { const [a, b, c, d] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11]]), k = ri(1, 2), A = a * k, B = b * k, Cc = c * k;
      const qs = [["Parallelepiped hajmini toping.", A * B * Cc], ["Parallelepiped to‘la sirti yuzini toping.", 2 * (A * B + B * Cc + A * Cc)], ["Parallelepiped diagonalini toping.", d * k]];
      return { ctx: `To‘g‘ri burchakli parallelepipedning bir uchidan chiqqan qirralari ${A}, ${B} va ${Cc} ga teng.`, qs, extra: [A + B + Cc, A * B + B * Cc + A * Cc, 4 * (A + B + Cc)] }; },
    () => { const a = 2 * ri(1, 4); // kubga ichki va tashqi chizilgan shar, π ≈ 3
      const qs = [["Kubga ichki chizilgan shar hajmini toping.", (a / 2) ** 3 * 4], ["Kubga tashqi chizilgan shar sirti yuzini toping.", 3 * 3 * a * a], ["Kubning to‘la sirti yuzini toping.", 6 * a * a]];
      return { ctx: `Kubning qirrasi ${a} ga teng (π ≈ 3 deb oling).`, qs, extra: [a ** 3, 12 * (a / 2) ** 2, 4 * a * a] }; },
  ];
  function genMatch() {
    const m = pick(MATCH)(); const vals = [...new Set([...m.qs.map((q) => q[1]), ...m.extra])];
    let k = 1; while (vals.length < 6) { const v = m.qs[0][1] + 6 * k++; if (!vals.includes(v)) vals.push(v); }
    const opts = shuffle(vals.slice(0, 6)); const L = "ABCDEF";
    return { ctx: m.ctx, items: m.qs.map(([q, v]) => ({ q, a: opts.indexOf(v), sol: `${num(v)} → ${L[opts.indexOf(v)]}` })), opts: opts.map(num) };
  }

  // ===================================================================
  // 36–45: OCHIQ TOPSHIRIQLAR (a, b)
  // ===================================================================
  const OPEN = [
    // 36. Modulli tenglama, parametr
    () => { const p = ri(1, 4), V = p * p, a = ri(1, V - 1);
      return { q: `<span class="ex">|x² − ${2 * p}x| = a</span> tenglama berilgan.`, parts: [{ q: `a = ${a} bo‘lganda tenglama nechta ildizga ega?`, a: 4 }, { q: "Tenglama roppa-rosa 3 ta ildizga ega bo‘ladigan a ning qiymatini toping.", a: V }],
        sol: `y = |x² − ${2 * p}x| grafigining “do‘ngi” balandligi ${V} (x = ${p} da). 0 &lt; a &lt; ${V} da 4 ta, a = ${V} da 3 ta ildiz.` }; },
    // 37. Logarifmik kvadrat tenglama
    () => { const t1 = ri(-2, 3), t2 = ri(t1 + 1, 5), s = t1 + t2, pr = t1 * t2;
      return { q: `<span class="ex">log₂²x ${s >= 0 ? "−" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}log₂x ${pr >= 0 ? "+" : "−"} ${Math.abs(pr)} = 0</span> tenglama berilgan.`.replace(" − 0log₂x", "").replace(" + 0 =", " ="),
        parts: [{ q: "Tenglama ildizlari ko‘paytmasini toping.", a: 2 ** s }, { q: "Tenglama ildizlari yig‘indisini toping.", a: 2 ** t1 + 2 ** t2 }],
        sol: `t = log₂x: t² − ${s}t + ${pr} = 0 → t = ${t1}, ${t2} → x = ${num(2 ** t1)}, ${num(2 ** t2)}.` }; },
    // 38. Trigonometrik tenglama oraliqda
    () => { const T = pick([
        ["2sin²x − 3sinx + 1 = 0", "[0; 2π]", 3, 270, "sinx = 1 yoki 1/2 → 90°, 30°, 150°"],
        ["2cos²x − cosx − 1 = 0", "[0; 2π]", 4, 720, "cosx = 1 yoki −1/2 → 0°, 360°, 120°, 240°"],
        ["2sin²x + sinx − 1 = 0", "[0; 2π)", 3, 540, "sinx = 1/2 yoki −1 → 30°, 150°, 270°"],
        ["cos2x + cosx = 0", "[0; π]", 2, 240, "2cos²x + cosx − 1 = 0 → cosx = 1/2 yoki −1 → 60°, 180°"],
        ["sin2x = cosx", "[0; π]", 3, 300, "cosx(2sinx − 1) = 0 → 90°, 30°, 150°"],
        ["cos2x = sinx", "[0; 2π]", 3, 540, "1 − 2sin²x = sinx → sinx = 1/2 yoki −1 → 30°, 150°, 270°"]]);
      return { q: `<span class="ex">${T[0]}</span> tenglamaning <span class="ex">${T[1]}</span> oraliqdagi ildizlari:`, parts: [{ q: "Ildizlar sonini toping.", a: T[2] }, { q: "Ildizlar yig‘indisini gradusda toping.", a: T[3] }], sol: T[4] + "." }; },
    // 39. Irratsional tenglama
    () => { for (;;) { const x0 = ri(2, 12), b = ri(-3, x0 - 1), a = (x0 - b) ** 2 - x0, x1 = 2 * b + 1 - x0; if (x1 - b >= 0 || x1 + a < 0 && false) continue;
        return { q: `<span class="ex">√(${P([1, "x"], [a, ""])}) = ${P([1, "x"], [-b, ""])}</span> tenglama berilgan.`, parts: [{ q: "Tenglama ildizini toping.", a: x0 }, { q: "Kvadratga oshirilgandan keyin hosil bo‘lgan tenglamaning chet ildizini toping.", a: x1 }],
          sol: `x + ${a} = (x − ${b})² → x² − ${2 * b + 1}x + ${b * b - a} = 0 → x = ${x0} yoki x = ${x1}; x = ${x1} da o‘ng tomon manfiy — chet ildiz.` }; } },
    // 40. Geometrik progressiya
    () => { const b1 = ri(1, 5) * pick([1, -1]), q = pick([2, 3, -2]), A = b1 * (1 + q * q), B = b1 * q * (1 + q * q), S5 = (b1 * (q ** 5 - 1)) / (q - 1);
      return { q: `Geometrik progressiyada <span class="ex">b₁ + b₃ = ${A}</span>, <span class="ex">b₂ + b₄ = ${B}</span>.`, parts: [{ q: "Progressiya maxrajini toping.", a: q }, { q: "Dastlabki 5 ta hadi yig‘indisini toping.", a: S5 }],
        sol: `q = (b₂ + b₄)/(b₁ + b₃) = ${q}; b₁ = ${A}/(1 + q²) = ${b1}; S₅ = ${S5}.` }; },
    // 41. Ratsional tengsizlik
    () => { const a = ri(1, 4), b = ri(-8, 8); if (Math.abs(b) === a) return OPEN[5](); let cnt = 0, mx = null; for (let x = -10; x <= 10; x++) { if (x === b) continue; if ((x * x - a * a) / (x - b) <= 0) { cnt++; mx = x; } }
      return { q: `<span class="ex">(x² − ${a * a}) / (${XM(b)}) ≤ 0</span> tengsizlik berilgan.`, parts: [{ q: "Tengsizlikning [−10; 10] kesmadagi butun yechimlari sonini toping.", a: cnt }, { q: "Shu kesmadagi eng katta butun yechimini toping.", a: mx }],
        sol: `Nollar: ±${a}, uzilish: ${b}. Oraliqlar usuli bilan yechimlar topiladi; kesmada ${cnt} ta butun yechim, eng kattasi ${mx}.` }; },
    // 42. Uchburchak: yuz va balandlik
    () => { const [a, b, c, S] = pick([[13, 14, 15, 84], [10, 10, 12, 48], [7, 15, 20, 42], [9, 10, 17, 36]]), k = ri(1, 2);
      return { q: `Uchburchakning tomonlari ${a * k}, ${b * k} va ${c * k} ga teng.`, parts: [{ q: "Uchburchak yuzini toping.", a: S * k * k }, { q: `Uzunligi ${b * k} bo‘lgan tomonga tushirilgan balandlikni toping.`, a: (2 * S * k) / b }],
        sol: `Geron formulasi: S = ${S * k * k}; h = 2S/${b * k} = ${num((2 * S * k) / b)}.` }; },
    // 43. Ehtimollik (javob kasr)
    () => { const r = ri(3, 7), w = ri(3, 7), n = r + w;
      return { q: `Qutida ${r} ta qizil va ${w} ta ko‘k shar bor. Tavakkaliga 3 ta shar olinadi. (Javobni oddiy kasr ko‘rinishida yozing, masalan 3/14.)`, parts: [{ q: "Uchala shar ham qizil bo‘lish ehtimolini toping.", a: C(r, 3) / C(n, 3) }, { q: "Roppa-rosa bitta shar qizil bo‘lish ehtimolini toping.", a: (r * C(w, 2)) / C(n, 3) }],
        sol: `C(${n}, 3) = ${C(n, 3)}; a) C(${r}, 3)/${C(n, 3)} = ${F(C(r, 3), C(n, 3))}; b) ${r}·C(${w}, 2)/${C(n, 3)} = ${F(r * C(w, 2), C(n, 3))}.` }; },
    // 44. Harakat: quvib yetish
    () => { const v1 = 5 * ri(8, 14), v2 = v1 + 5 * ri(2, 6), d = ri(1, 3), D = v1 * d, t = D / (v2 - v1);
      return { q: `A shahardan tezligi ${v1} km/soat bo‘lgan avtobus jo‘nadi. ${d} soatdan keyin shu yo‘nalishda tezligi ${v2} km/soat bo‘lgan avtomobil yo‘lga chiqdi.`, parts: [{ q: "Avtomobil avtobusni necha soatda quvib yetadi?", a: t }, { q: "Quvib yetish A shahardan necha km uzoqlikda sodir bo‘ladi?", a: v2 * t }],
        sol: `Oradagi masofa ${D} km, yaqinlashish tezligi ${v2 - v1} km/soat → t = ${num(t)} soat; masofa ${v2}·${num(t)} = ${num(v2 * t)} km.` }; },
    // 45. Kesmadagi eng katta va eng kichik qiymat
    () => { const c = ri(-10, 15), f = (x) => x ** 3 - 3 * x * x - 9 * x + c, pts = [-2, -1, 3, 4].map(f);
      return { q: `<span class="ex">f(x) = ${P([1, "x³"], [-3, "x²"], [-9, "x"], [c, ""])}</span> funksiyaning <span class="ex">[−2; 4]</span> kesmadagi:`, parts: [{ q: "eng katta qiymatini toping.", a: Math.max(...pts) }, { q: "eng kichik qiymatini toping.", a: Math.min(...pts) }],
        sol: `f′(x) = 3x² − 6x − 9 = 0 → x = −1, x = 3. f(−2) = ${pts[0]}, f(−1) = ${pts[1]}, f(3) = ${pts[2]}, f(4) = ${pts[3]}.` }; },
  ];

  /** Variant yaratish (seed — variant raqami) */
  function variant(seed) {
    R = rng(seed);
    const closed = CLOSED.map((g, i) => ({ n: i + 1, t: "mc", ...g() }));
    const m = genMatch(); const match = m.items.map((it, i) => ({ n: 33 + i, t: "match", ctx: m.ctx, q: it.q, opts: m.opts, a: it.a, sol: it.sol, first: i === 0 }));
    const open = OPEN.map((g, i) => ({ n: 36 + i, t: "open", ...g() }));
    R = Math.random;
    return [...closed, ...match, ...open];
  }
  /** Ochiq javobni son sifatida o'qish: "1/2", "−3", "0,5", "2 1/2" */
  function parseAns(s) {
    s = String(s || "").trim().replace(/−/g, "-").replace(/,/g, ".").replace(/\s+/g, " ");
    if (!s) return NaN;
    let m = /^(-?)(\d+) (\d+)\/(\d+)$/.exec(s); if (m) return (m[1] ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]));
    m = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(s); if (m) return Number(m[1]) / Number(m[2]);
    return Number(s.replace(/°|%/g, ""));
  }
  window.SERT_GEN = { variant, parseAns, num, F };
})();
