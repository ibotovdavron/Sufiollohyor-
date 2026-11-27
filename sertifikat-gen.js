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
  // 1–32: YOPIQ TESTLAR
  // ===================================================================
  const CLOSED = [
    // 1. Raqamlar
    () => { const c = pick([
        ["a, b, c — turli raqamlar bo‘lsa, <i>100a + 10b + c</i> ning eng katta qiymatini toping.", 987, [999, 897, 978]],
        ["a, b, c — turli raqamlar va a ≠ 0 bo‘lsa, <i>100a + 10b + c</i> ning eng kichik qiymatini toping.", 102, [100, 123, 120]],
        ["a, b, c — turli juft raqamlar bo‘lsa, <i>100a + 10b + c</i> ning eng katta qiymatini toping.", 864, [888, 846, 986]],
        ["a, b, c — turli toq raqamlar bo‘lsa, <i>100a + 10b + c</i> ning eng kichik qiymatini toping.", 135, [111, 153, 137]],
        ["Raqamlari turli bo‘lgan eng katta to‘rt xonali juft son raqamlari yig‘indisini toping.", 9 + 8 + 7 + 6, [30, 28, 29]]]);
      return { q: c[0], ...mc(num(c[1]), c[2].map(num)), sol: `Javob: ${c[1]}.` }; },
    // 2. Kasrlar bilan hisoblash
    () => { const n = ri(5, 40), k = ri(2, 9);
      return { q: `Hisoblang: <span class="ex">(${n} + ${F(1, n)}) : ${F(n * n + 1, n)} · ${k}</span>`, ...mc(num(k), [num(n), F(1, n), num(k * n)]),
        sol: `${n} + ${F(1, n)} = ${F(n * n + 1, n)}, shuning uchun bo‘linma 1 ga teng, natija ${k}.` }; },
    // 3. Ish (quvurlar)
    () => { let a, b, c, T; for (;;) { a = ri(3, 12); b = ri(a + 1, 16); c = ri(2, 12); const [p, q] = fr(b * c + a * c - a * b, a * b * c); if (p === 1 && q >= 4 && q <= 60) { T = q; break; } }
      return { q: `Hovuzni 1-quvur yolg‘iz o‘zi ${a} soatda, 2-quvur ${b} soatda to‘ldiradi, 3-quvur esa to‘la hovuzni ${c} soatda bo‘shatadi. Uchala quvur birga ishlasa, bo‘sh hovuz necha soatda to‘ladi?`,
        ...mc(num(T), near(T, [-5, 5, 10]).concat([num(T * 2)])), sol: `${F(1, a)} + ${F(1, b)} − ${F(1, c)} = ${F(1, T)} → ${T} soat.` }; },
    // 4. Harakat
    () => { const t = pick([2, 3, 4, 5]), v1 = 5 * ri(8, 18), v2 = 5 * ri(6, 16), S = (v1 + v2) * t;
      return { q: `Oralig‘i ${S} km bo‘lgan ikki shahardan bir vaqtda bir-biriga qarab ikki avtomobil yo‘lga chiqdi. Ularning tezliklari ${v1} km/soat va ${v2} km/soat. Necha soatdan keyin ular uchrashadi?`,
        ...mc(num(t), [num(t + 1), num(t - 1 || 6), num(t + 0.5)]), sol: `t = S/(v₁ + v₂) = ${S}/${v1 + v2} = ${t} soat.` }; },
    // 5. Xonalar soni
    () => { let p, q, r, E2, E5; do { p = ri(1, 5); q = ri(2, 10); r = ri(5, 20); E2 = 5 * p + 3 * q; E5 = 3 * r; } while (E5 < E2 || E5 - E2 > 12);
      const d = (2n ** BigInt(E2) * 5n ** BigInt(E5)).toString().length;
      return { q: `<span class="ex">32<sup>${p}</sup> · 8<sup>${q}</sup> · 125<sup>${r}</sup></span> necha xonali son?`, ...mc(num(d), [num(d + 1), num(d - 1), num(E2)]),
        sol: `= 2<sup>${E2}</sup> · 5<sup>${E5}</sup> = 10<sup>${E2}</sup> · 5<sup>${E5 - E2}</sup>; 5<sup>${E5 - E2}</sup> ${String(5 ** (E5 - E2)).length} xonali → jami ${d} xona.` }; },
    // 6. Modul va ildiz
    () => { const p = ri(1, 6), q = ri(p + 1, p + 7), m = q + ri(0, 3);
      return { q: `a &gt; ${m} bo‘lsa, <span class="ex">√(${p} − a)² − √(a − ${q})²</span> ni soddalashtiring.`, ...mc(num(q - p), [`2a − ${p + q}`, num(p - q), `${p + q} − 2a`]),
        sol: `√x² = |x|: |${p} − a| − |a − ${q}| = (a − ${p}) − (a − ${q}) = ${q - p}.` }; },
    // 7. Ildizlar
    () => { const [x, y, z] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), k = ri(1, 3), c = ri(2, 5);
      const A = z * k, B = y * k, res = x * k + c;
      return { q: `Hisoblang: <span class="ex">√(${A}² − ${B}²) + ∛${c ** 3}</span>`, ...mc(num(res), [num(res + 1), num(x * k + c * c), num(A - B + c)]),
        sol: `√((${A} − ${B})(${A} + ${B})) = √${(A - B) * (A + B)} = ${x * k}; ∛${c ** 3} = ${c}; jami ${res}.` }; },
    // 8. Bo'linish
    () => { const [p, q] = pick([[2, 3], [2, 5], [3, 5], [3, 4], [2, 7]]); let s = 0, s2 = 0; for (let n = 10; n <= 99; n++) { if (n % p && n % q) s += n; else s2 += n; }
      return { q: `${p} ga ham, ${q} ga ham bo‘linmaydigan barcha ikki xonali natural sonlar yig‘indisini toping.`, ...mc(num(s), [num(s2), num(s + 100), num(s - 90)]),
        sol: `Barcha ikki xonali sonlar yig‘indisi 4905; ${p} yoki ${q} ga bo‘linadiganlari yig‘indisi ${s2}; 4905 − ${s2} = ${s}.` }; },
    // 9. Geometrik progressiya
    () => { const b1 = pick([1, 2, 3, -1, -2]), q = pick([2, -2, 3, -3]), t = (n) => b1 * q ** (n - 1);
      return { q: `Geometrik progressiyada b₂ = ${num(t(2))}, b₅ = ${num(t(5))} bo‘lsa, b₆ ni toping.`, ...mc(num(t(6)), [num(-t(6)), num(t(7)), num(t(5) * 2)]),
        sol: `q³ = b₅/b₂ = ${num(q ** 3)} → q = ${q}; b₆ = b₅·q = ${num(t(6))}.` }; },
    // 10. Nisbat
    () => { const m = ri(2, 6), n = ri(2, 9); // c=1, b=n, a=mn
      const [P, Q] = fr(m * n * m * n + n * n + 1, m * n); // (a²+b²+c²)/(ac)
      return { q: `<span class="ex">a/b = ${m}, b/c = ${n}</span> bo‘lsa, <span class="ex">(a² + b² + c²)/(ac)</span> ni hisoblang.`,
        ...mc(F(P, Q), [F(P + Q, Q), F(P, Q + 1), F(P - Q, Q)]), sol: `c = 1 deb olsak: b = ${n}, a = ${m * n}. (${m * n}² + ${n}² + 1)/${m * n} = ${F(P, Q)}.` }; },
    // 11. Soddalashtirish
    () => { const x = ri(2, 12), y = ri(1, x - 1);
      return { q: `x = ${x}, y = ${y} bo‘lsa, <span class="ex">(x³ − y³)/(x² + xy + y²) + 2y</span> ifodaning qiymatini toping.`, ...mc(num(x + y), [num(x - y), num(x + 2 * y), num(x * y)]),
        sol: `x³ − y³ = (x − y)(x² + xy + y²) → ifoda = x − y + 2y = x + y = ${x + y}.` }; },
    // 12. Trigonometrik qiymatlar
    () => { const S = [["π/6", 1, 2], ["5π/6", 1, 2], ["7π/6", -1, 2], ["11π/6", -1, 2], ["π/2", 1, 1], ["3π/2", -1, 1]], C2 = [["π/3", 1, 4], ["π/4", 1, 2], ["π/6", 3, 4], ["2π/3", 1, 4], ["3π/4", 1, 2], ["7π/4", 1, 2], ["5π/6", 3, 4], ["π", 1, 1]];
      const s = pick(S), c = pick(C2), A = pick([2, 4, 6]), B = pick([1, 2, 4]);
      const [n, d] = fr(A * s[1] * c[2] + B * c[1] * s[2], s[2] * c[2]);
      return { q: `<span class="ex">${A}·sin(${s[0]}) + ${B}·cos²(${c[0]})</span> ni hisoblang.`, ...mc(F(n, d), [F(-n, d), F(n + d, d), F(n, 2 * d)]),
        sol: `sin(${s[0]}) = ${F(s[1], s[2])}, cos²(${c[0]}) = ${F(c[1], c[2])} → ${F(n, d)}.` }; },
    // 13. Trigonometrik soddalashtirish
    () => { const T = [["sin2α / (2cosα)", "sinα"], ["(1 − cos2α) / sin2α", "tgα"], ["(1 + cos2α) / (2cosα)", "cosα"], ["(cos²α − sin²α) / (cosα − sinα)", "cosα + sinα"], ["sin(α + β) + sin(α − β)", "2sinα·cosβ"], ["(sin3α + sinα) / (2sin2α)", "cosα"], ["2sin²α + cos2α", "1"]];
      const t = pick(T); const others = shuffle(T.filter((x) => x[1] !== t[1]).map((x) => x[1]));
      return { q: `Soddalashtiring: <span class="ex">${t[0]}</span>`, ...mc(t[1], others), sol: `Ikki karrali burchak va yig‘indi formulalari: natija ${t[1]}.` }; },
    // 14. Ko'rsatkichli tenglama ildizlari soni
    () => { const bases = pick([["4", "25", "10"], ["9", "4", "6"], ["9", "25", "15"]]);
      const kind = pick([0, 1, 2]); let k1, k2, k3, ans;
      if (kind === 2) { const t1 = ri(1, 3), t2 = t1 + ri(1, 3); k1 = 1; k3 = t1 + t2; k2 = t1 * t2; ans = "2 ta"; }
      else if (kind === 1) { const t1 = ri(1, 4); k1 = 1; k3 = 2 * t1; k2 = t1 * t1; ans = "1 ta"; }
      else { k1 = ri(2, 4); k3 = ri(1, 3); k2 = ri(Math.ceil((k3 * k3) / (4 * k1)) + 1, 6); ans = "Haqiqiy ildizga ega emas"; }
      return { q: `<span class="ex">${k1 > 1 ? k1 + "·" : ""}${bases[0]}<sup>x</sup> + ${k2 > 1 ? k2 + "·" : ""}${bases[1]}<sup>x</sup> = ${k3 > 1 ? k3 + "·" : ""}${bases[2]}<sup>x</sup></span> tenglama nechta haqiqiy ildizga ega?`,
        ...mc(ans, ["Haqiqiy ildizga ega emas", "1 ta", "2 ta", "Cheksiz ko‘p"].filter((x) => x !== ans)), sol: `Tenglamani ${bases[1]}<sup>x</sup> ga bo‘lib, t = (√${bases[0]}/√${bases[1]})<sup>x</sup> &gt; 0 almashtirishdan kvadrat tenglama hosil bo‘ladi: ${k1}t² − ${k3}t + ${k2} = 0. Musbat ildizlar soni — javob: ${ans}.` }; },
    // 15. Logarifmik tengsizlik (butun yechimlar)
    () => { const b = pick([2, 3]), k = ri(2, b === 2 ? 4 : 3), m = ri(-5, 8), cnt = b ** k - 1;
      return { q: `<span class="ex">log<sub>${b}</sub>(${XM(m)}) &lt; ${k}</span> tengsizlikning butun yechimlari nechta?`, ...mc(num(cnt), [num(cnt + 1), num(b ** k), num(k * b)]),
        sol: `0 &lt; ${XM(m)} &lt; ${b ** k} → ${m} &lt; x &lt; ${m + b ** k}; butun sonlar: ${cnt} ta.` }; },
    // 16. Modulli tengsizlik
    () => { const a = pick([1, 2, 3]), b = ri(-3, 5), c = ri(3, 8), d = ri(1, c - 1); let cnt = 0; for (let x = -200; x <= 200; x++) if (Math.abs(Math.abs(a * x - b) - c) <= d) cnt++;
      return { q: `<span class="ex">||${P([a, "x"], [-b, ""])}| − ${c}| ≤ ${d}</span> tengsizlikni qanoatlantiradigan butun sonlar nechta?`, ...mc(num(cnt), [num(cnt + 2), num(cnt - 2), num(cnt * 2)]),
        sol: `${c - d} ≤ |${P([a, "x"], [-b, ""])}| ≤ ${c + d}; ikki oraliqdagi butun sonlar soni ${cnt}.` }; },
    // 17. Kvadrat tenglama ildizlari soni
    () => { const a = ri(1, 5), b = ri(-9, 9), kind = pick([0, 1, 2]); let c;
      if (kind === 1 && b % 2 === 0 && (b * b) % (4 * a) === 0) c = (b * b) / (4 * a); else if (kind === 0) c = Math.floor((b * b) / (4 * a)) + ri(1, 4); else c = Math.floor((b * b) / (4 * a)) - ri(1, 5);
      const D = b * b - 4 * a * c, ans = D > 0 ? "2 ta" : D === 0 ? "1 ta" : "Haqiqiy ildizga ega emas";
      return { q: `<span class="ex">${P([a, "x²"], [b, "x"], [c, ""])} = 0</span> tenglama nechta haqiqiy ildizga ega?`, ...mc(ans, ["2 ta", "1 ta", "Haqiqiy ildizga ega emas", "Cheksiz ko‘p"].filter((x) => x !== ans)),
        sol: `D = b² − 4ac = ${b * b} − ${4 * a * c} = ${D}.` }; },
    // 18. Foiz
    () => { const p = pick([10, 20, 25, 30, 40, 50]), q = pick([10, 20, 25, 30, 40, 50]), ch = Math.round(((100 + p) * (100 - q) - 10000) / 100 * 100) / 100;
      return { q: `Mahsulot narxi avval ${p} % ga oshirildi, so‘ng ${q} % ga kamaytirildi. Narx dastlabkisiga nisbatan qanday o‘zgardi?`,
        ...mc(ch === 0 ? "O‘zgarmadi" : `${num(Math.abs(ch))} % ga ${ch > 0 ? "oshdi" : "kamaydi"}`, [`${num(Math.abs(p - q))} % ga ${p - q >= 0 ? "oshdi" : "kamaydi"}`, `${num(Math.abs(ch) + 2)} % ga ${ch > 0 ? "oshdi" : "kamaydi"}`, `${num(Math.abs(ch))} % ga ${ch > 0 ? "kamaydi" : "oshdi"}`, "O‘zgarmadi"]),
        sol: `(1 + ${p}/100)(1 − ${q}/100) = ${num((100 + p) * (100 - q) / 10000)} → ${ch > 0 ? "+" : ""}${num(ch)} %.` }; },
    // 19. Tenglamalar sistemasi
    () => { const x = ri(-5, 7), y = ri(-5, 7), a = ri(1, 5), b = ri(1, 5), d = ri(1, 5), e = -ri(1, 5);
      return { q: `<span class="ex">${P([a, "x"], [b, "y"])} = ${a * x + b * y};  ${P([d, "x"], [e, "y"])} = ${d * x + e * y}</span> sistemadan x + y ni toping.`, ...mc(num(x + y), [num(x - y), num(x * y), num(x + y + 1)]),
        sol: `Yechim: x = ${x}, y = ${y}; x + y = ${x + y}.` }; },
    // 20. Arifmetik progressiya
    () => { const a1 = ri(-10, 15), d = pick([-3, -2, 2, 3, 4, 5]), n = pick([10, 12, 15, 20]), a = (k) => a1 + (k - 1) * d, S = ((2 * a1 + (n - 1) * d) * n) / 2;
      return { q: `Arifmetik progressiyada a₃ = ${a(3)}, a₇ = ${a(7)}. Dastlabki ${n} ta hadi yig‘indisini toping.`, ...mc(num(S), [num(S + n), num(S - d * n), num(a(n) * n)]),
        sol: `d = (a₇ − a₃)/4 = ${d}, a₁ = ${a1}; S = (2a₁ + ${n - 1}d)·${n}/2 = ${S}.` }; },
    // 21. Aniqlanish sohasi
    () => { const m = ri(2, 9), n = ri(1, 8), cnt = m + n;
      return { q: `<span class="ex">y = √(${m} − x) + 1/√(x + ${n})</span> funksiyaning aniqlanish sohasiga tegishli butun sonlar nechta?`, ...mc(num(cnt), [num(cnt + 1), num(cnt - 1), num(cnt + 2)]),
        sol: `${m} − x ≥ 0 va x + ${n} &gt; 0 → −${n} &lt; x ≤ ${m}; butun sonlar ${cnt} ta.` }; },
    // 22. Hosila
    () => { const a = ri(1, 4), b = ri(-5, 5), c = ri(-6, 6), x0 = ri(-2, 3), d = 3 * a * x0 * x0 + 2 * b * x0 + c;
      return { q: `<span class="ex">f(x) = ${P([a, "x³"], [b, "x²"], [c, "x"], [7, ""])}</span> bo‘lsa, f′(${x0}) ni toping.`, ...mc(num(d), [num(d + 7), num(a * x0 ** 3 + b * x0 ** 2 + c * x0 + 7), num(-d)]),
        sol: `f′(x) = ${P([3 * a, "x²"], [2 * b, "x"], [c, ""])} → f′(${x0}) = ${d}.` }; },
    // 23. Integral
    () => { const a = pick([3, 6, 9]), b = ri(1, 6), k = ri(1, 3), v = (a * k ** 3) / 3 + b * k;
      return { q: `Hisoblang: <span class="ex">∫₀<sup>${k}</sup> (${a}x² + ${b}) dx</span>`, ...mc(num(v), [num(a * k ** 3 + b * k), num(v + b), num((a * k ** 2) / 2 + b * k)]),
        sol: `[${a / 3}x³ + ${b}x]₀<sup>${k}</sup> = ${v}.` }; },
    // 24. Doira va kvadrat
    () => { const s = 2 * ri(1, 6), ins = pick([true, false]), v = ins ? (s * s) / 4 : (s * s) / 2;
      return { q: `Tomoni ${s} ga teng kvadratga doira ${ins ? "ichki" : "tashqi"} chizilgan. Doiraning yuzini toping.`, ...mc(`${num(v)}π`, [`${num(ins ? (s * s) / 2 : (s * s) / 4)}π`, `${num(s * s)}π`, `${num(s)}π`]),
        sol: ins ? `r = ${s}/2 = ${s / 2}, S = πr² = ${num(v)}π.` : `R = d/2 = ${s}√2/2, S = πR² = ${num(v)}π.` }; },
    // 25. O'xshash uchburchaklar
    () => { const k = pick([[3, 4], [2, 3], [3, 5], [1, 2], [2, 5]]), m = ri(2, 6), AB = k[1] * m * 2, EF = k[0] * m * 2, AC = k[1] * ri(2, 6), x = (EF / AB) * AC;
      return { q: `ABC uchburchakda EF ∥ AB (E ∈ BC, F ∈ AC). AB = ${AB}, EF = ${EF}, AC = ${AC} bo‘lsa, FC ni toping.`, ...mc(num(x), [num(AC - x), num(x + 2), num((AB / EF) * AC)]),
        sol: `△FEC ∼ △ABC: FC/AC = EF/AB → FC = ${AC}·${EF}/${AB} = ${num(x)}.` }; },
    // 26. To'g'ri burchakli uchburchak
    () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]]), k = ri(1, 3);
      return { q: `To‘g‘ri burchakli uchburchakning gipotenuzasi ${c * k} ga, bir kateti ${a * k} ga teng. Uchburchak yuzini toping.`, ...mc(num((a * b * k * k) / 2), [num(a * b * k * k), num((a * c * k * k) / 2), num((b * c * k * k) / 2)]),
        sol: `Ikkinchi katet √(${c * k}² − ${a * k}²) = ${b * k}; S = ${a * k}·${b * k}/2 = ${num((a * b * k * k) / 2)}.` }; },
    // 27. Romb
    () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), k = ri(1, 2), d1 = 2 * a * k, d2 = 2 * b * k, side = c * k, ask = pick(["P", "S"]);
      const v = ask === "P" ? 4 * side : (d1 * d2) / 2;
      return { q: `Rombning diagonallari ${d1} va ${d2} ga teng. Rombning ${ask === "P" ? "perimetrini" : "yuzini"} toping.`, ...mc(num(v), ask === "P" ? [num(2 * (d1 + d2)), num(4 * side + 4), num(side * 2)] : [num(d1 * d2), num(side * side), num((d1 * d2) / 4)]),
        sol: `Tomon = √(${a * k}² + ${b * k}²) = ${side}; ${ask === "P" ? `P = 4·${side} = ${v}` : `S = d₁d₂/2 = ${v}`}.` }; },
    // 28. Ko'pburchak
    () => { const k = ri(2, 8), n = 2 * k + 3, s = (n - 2) * 180;
      return { q: `Diagonallari soni tomonlari sonidan ${k} marta ko‘p bo‘lgan qavariq ko‘pburchakning ichki burchaklari yig‘indisini toping.`, ...mc(`${s}°`, [`${s + 180}°`, `${s - 180}°`, `${n * 180}°`]),
        sol: `n(n − 3)/2 = ${k}n → n = ${n}; (n − 2)·180° = ${s}°.` }; },
    // 29. Kosinuslar teoremasi
    () => { const [a, b, c, g] = pick([[3, 5, 7, 120], [5, 8, 7, 60], [3, 8, 7, 60], [5, 3, 7, 120], [7, 8, 13, 120], [5, 21, 19, 60]]), k = ri(1, 3);
      return { q: `Uchburchakning ikki tomoni ${a * k} va ${b * k} ga, ular orasidagi burchak ${g}° ga teng. Uchinchi tomonini toping.`, ...mc(num(c * k), [num((c + 1) * k), num((a + b) * k), num(Math.round(Math.sqrt(a * a + b * b)) * k)]),
        sol: `c² = a² + b² − 2ab·cos${g}° = ${(c * k) ** 2} → c = ${c * k}.` }; },
    // 30. Vektorlar
    () => { const a = [ri(-4, 5), ri(-4, 5)], b = [ri(-4, 5), ri(-4, 5)], k = ri(2, 3), sp = a[0] * b[0] + a[1] * b[1];
      const dot = (k * a[0] - b[0]) * b[0] + (k * a[1] - b[1]) * b[1];
      return { q: `a⃗(${a[0]}; ${a[1]}) va b⃗(${b[0]}; ${b[1]}) vektorlar berilgan. <span class="ex">(${k}a⃗ − b⃗)·b⃗</span> skalyar ko‘paytmani toping.`, ...mc(num(dot), [num(sp), num(k * sp), num(dot + 2)]),
        sol: `${k}a⃗ − b⃗ = (${k * a[0] - b[0]}; ${k * a[1] - b[1]}); ko‘paytma = ${dot}.` }; },
    // 31. To'plamlar
    () => { const n = ri(30, 45), a = ri(12, 22), b = ri(10, 20), c = ri(3, Math.min(a, b) - 2), none = n - (a + b - c);
      return { q: `Sinfdagi ${n} o‘quvchidan ${a} tasi matematika, ${b} tasi fizika to‘garagiga qatnashadi, ${c} tasi ikkalasiga ham. Hech qaysi to‘garakka qatnashmaydigan o‘quvchilar nechta?`, ...mc(num(none), [num(n - a - b), num(none + c), num(n - c)]),
        sol: `|A ∪ B| = ${a} + ${b} − ${c} = ${a + b - c}; ${n} − ${a + b - c} = ${none}.` }; },
    // 32. Ehtimollik
    () => { const p = pick([6, 7, 8, 9]), h = ri(2, 3), m = ri(1, 2), P = p ** h * (10 - p) ** m, den = 10 ** (h + m);
      const s = (x) => num(x / den);
      return { q: `Merganning nishonga tekkizish ehtimoli 0,${p}. ${h + m} marta o‘q uzildi. Dastlabki ${h} ta o‘q tegib, keyingi ${m} tasi tegmaslik ehtimolini toping.`, ...mc(s(P), [s(p ** m * (10 - p) ** h), s(P * C(h + m, h)), s(p ** h * 10 ** m)]),
        sol: `0,${p}<sup>${h}</sup> · 0,${10 - p}<sup>${m}</sup> = ${s(P)}.` }; },
  ];

  // ===================================================================
  // 33–35: MOSLASHTIRISH (bitta shart, 3 ta savol, A–F javoblar)
  // ===================================================================
  const MATCH = [
    () => { const r = ri(2, 6), h = ri(3, 9); // silindr, π ≈ 3
      const qs = [["Silindr hajmini toping.", 3 * r * r * h], ["Silindr yon sirti yuzini toping.", 6 * r * h], ["Silindr to‘la sirti yuzini toping.", 6 * r * (r + h)]];
      return { ctx: `Silindrning asos radiusi ${r} ga, balandligi ${h} ga teng (π ≈ 3 deb oling).`, qs, extra: [3 * r * h, 6 * r * r, 2 * r * h * 3 + 3 * r * r] }; },
    () => { const [r, hh, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); // konus
      const qs = [["Konus hajmini toping.", r * r * hh], ["Konus yon sirti yuzini toping.", 3 * r * l], ["Konus to‘la sirti yuzini toping.", 3 * r * (r + l)]];
      return { ctx: `Konusning asos radiusi ${r} ga, balandligi ${hh} ga teng (π ≈ 3 deb oling).`, qs, extra: [3 * r * r * hh, 3 * r * hh, 6 * r * l] }; },
    () => { const [a, b, c, d] = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9]]), k = ri(1, 2); // to'g'ri burchakli parallelepiped
      const A = a * k, B = b * k, Cc = c * k;
      const qs = [["Parallelepiped hajmini toping.", A * B * Cc], ["To‘la sirti yuzini toping.", 2 * (A * B + B * Cc + A * Cc)], ["Diagonalini toping.", d * k]];
      return { ctx: `To‘g‘ri burchakli parallelepipedning o‘lchamlari ${A}, ${B} va ${Cc} ga teng.`, qs, extra: [A + B + Cc, A * B + B * Cc + A * Cc, 4 * (A + B + Cc)] }; },
    () => { const r = 3 * ri(1, 3); // shar, π ≈ 3
      const qs = [["Shar hajmini toping.", 4 * r ** 3], ["Shar sirti yuzini toping.", 12 * r * r], ["Katta doira yuzini toping.", 3 * r * r]];
      return { ctx: `Sharning radiusi ${r} ga teng (π ≈ 3 deb oling).`, qs, extra: [12 * r ** 3, 6 * r * r, 4 * r * r] }; },
  ];
  function genMatch() {
    const m = pick(MATCH)(); const vals = [...new Set([...m.qs.map((q) => q[1]), ...m.extra])];
    let k = 1; while (vals.length < 6) { const v = m.qs[0][1] + 6 * k++; if (!vals.includes(v)) vals.push(v); }
    const opts = shuffle(vals.slice(0, 6)); const L = "ABCDEF";
    return { ctx: m.ctx, items: m.qs.map(([q, v]) => ({ q, a: opts.indexOf(v), sol: `${q.replace(/ni toping\.|toping\./, "").trim()} = ${num(v)} → ${L[opts.indexOf(v)]}` })), opts: opts.map(num) };
  }

  // ===================================================================
  // 36–45: OCHIQ TOPSHIRIQLAR (a, b)
  // ===================================================================
  const OPEN = [
    // 36. Kvadrat tenglama (Viyet)
    () => { const x1 = ri(-6, 9), x2 = ri(-6, 9), p = x1 + x2, q = x1 * x2;
      return { q: `<span class="ex">${P([1, "x²"], [-p, "x"], [q, ""])} = 0</span> tenglama berilgan.`,
        parts: [{ q: "Tenglamaning katta ildizini toping.", a: Math.max(x1, x2) }, { q: "Ildizlar kvadratlari yig‘indisini toping.", a: x1 * x1 + x2 * x2 }],
        sol: `Ildizlar: ${x1} va ${x2}. x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${x1 * x1 + x2 * x2}.` }; },
    // 37. Simmetrik sistema
    () => { const x = ri(1, 7), y = ri(-4, 6), s = x + y, p = x * y;
      return { q: `<span class="ex">x + y = ${s}, xy = ${p}</span> bo‘lsa:`, parts: [{ q: "x² + y² ni toping.", a: s * s - 2 * p }, { q: "x³ + y³ ni toping.", a: s ** 3 - 3 * p * s }],
        sol: `x² + y² = s² − 2p = ${s * s - 2 * p}; x³ + y³ = s³ − 3ps = ${s ** 3 - 3 * p * s}.` }; },
    // 38. Kvadrat funksiya
    () => { const h0 = ri(-3, 4), m = ri(-9, 5), a = pick([1, 2, -1]), f = (x) => a * (x - h0) ** 2 + m;
      return { q: `Parabolaning uchi (${h0}; ${m}) nuqtada, bosh koeffitsienti ${a} ga teng: <span class="ex">f(x) = ${a === 1 ? "" : a === -1 ? "−" : a}${h0 === 0 ? "x²" : `(${XM(h0)})²`}${m ? ` ${m > 0 ? "+" : "−"} ${Math.abs(m)}` : ""}</span>.`,
        parts: [{ q: "f(0) ni toping.", a: f(0) }, { q: `f(${h0 + 3}) ni toping.`, a: f(h0 + 3) }],
        sol: `f(0) = ${a}·${h0 * h0} ${m >= 0 ? "+" : "−"} ${Math.abs(m)} = ${f(0)}; f(${h0 + 3}) = ${a}·9 ${m >= 0 ? "+" : "−"} ${Math.abs(m)} = ${f(h0 + 3)}.` }; },
    // 39. Logarifmik tenglama
    () => { for (;;) { const b = pick([2, 3]), i = ri(0, 3), j = ri(1, 3), x0 = ri(-3, 8), u = b ** i, w = b ** j, c = u - x0, d = w - x0, k = i + j;
        if (c === d) continue; const x1 = -c - d - x0; if (x1 + c > 0 && x1 + d > 0) continue;
        return { q: `<span class="ex">log<sub>${b}</sub>(${XM(-c)}) + log<sub>${b}</sub>(${XM(-d)}) = ${k}</span> tenglama berilgan.`,
          parts: [{ q: "Tenglama ildizini toping.", a: x0 }, { q: "Tenglamaning ildizlari sonini toping.", a: 1 }],
          sol: `(${XM(-c)})(${XM(-d)}) = ${b ** k} → x = ${x0} yoki x = ${x1}; ikkinchisi aniqlanish sohasiga kirmaydi. Bitta ildiz.` }; } },
    // 40. Arifmetik progressiya
    () => { const a1 = ri(-8, 10), d = pick([-3, -2, 2, 3, 4]), a = (k) => a1 + (k - 1) * d;
      return { q: `Arifmetik progressiyada a₂ = ${a(2)}, a₆ = ${a(6)}.`, parts: [{ q: "Progressiya ayirmasini toping.", a: d }, { q: "Dastlabki 10 ta hadi yig‘indisini toping.", a: ((2 * a1 + 9 * d) * 10) / 2 }],
        sol: `4d = a₆ − a₂ = ${4 * d} → d = ${d}; a₁ = ${a1}; S₁₀ = (2a₁ + 9d)·5 = ${((2 * a1 + 9 * d) * 10) / 2}.` }; },
    // 41. Trigonometrik tenglama
    () => { const T = pick([
        ["2sin²x − 3sinx + 1 = 0", "[0; 2π]", 3, 270, "sinx = 1 yoki sinx = 1/2 → x = 90°, 30°, 150°"],
        ["2cos²x − cosx − 1 = 0", "[0; 2π]", 4, 720, "cosx = 1 yoki cosx = −1/2 → x = 0°, 360°, 120°, 240°"],
        ["2sin²x + sinx − 1 = 0", "[0; 2π)", 3, 540, "sinx = 1/2 yoki sinx = −1 → x = 30°, 150°, 270°"],
        ["tg²x − 3 = 0", "(0; π)", 2, 180, "tgx = ±√3 → x = 60°, 120°"],
        ["cos2x + cosx = 0", "[0; π]", 2, 240, "2cos²x + cosx − 1 = 0 → cosx = 1/2 yoki −1 → x = 60°, 180°"]]);
      return { q: `<span class="ex">${T[0]}</span> tenglamaning <span class="ex">${T[1]}</span> oraliqdagi ildizlari haqida:`, parts: [{ q: "Ildizlar sonini toping.", a: T[2] }, { q: "Ildizlar yig‘indisini gradusda toping.", a: T[3] }], sol: T[4] + "." }; },
    // 42. Uchburchak: yuz va ichki chizilgan aylana
    () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 40, 41]]), k = ri(1, 2);
      return { q: `To‘g‘ri burchakli uchburchakning katetlari ${a * k} va ${b * k} ga teng.`, parts: [{ q: "Ichki chizilgan aylana radiusini toping.", a: ((a + b - c) * k) / 2 }, { q: "Tashqi chizilgan aylana radiusini toping.", a: (c * k) / 2 }],
        sol: `Gipotenuza ${c * k}; r = (a + b − c)/2 = ${num(((a + b - c) * k) / 2)}; R = c/2 = ${num((c * k) / 2)}.` }; },
    // 43. Kombinatorika
    () => { const n = ri(5, 9), m = ri(3, 7);
      return { q: `Sinfda ${n} ta o‘g‘il va ${m} ta qiz bor. Olimpiadaga 3 kishilik jamoa tanlanadi.`, parts: [{ q: "Jamoani necha usulda tanlash mumkin?", a: C(n + m, 3) }, { q: "Jamoada roppa-rosa bitta qiz bo‘ladigan nechta usul bor?", a: m * C(n, 2) }],
        sol: `C(${n + m}, 3) = ${C(n + m, 3)}; ${m}·C(${n}, 2) = ${m * C(n, 2)}.` }; },
    // 44. Aralashma
    () => { for (;;) { const m1 = 50 * ri(2, 8), m2 = 50 * ri(2, 8), p1 = 5 * ri(1, 8), p2 = 5 * ri(2, 12), s = (m1 * p1 + m2 * p2) / 100, P = (100 * s) / (m1 + m2);
        if (p1 === p2 || Math.abs(P - Math.round(P)) > 1e-9) continue;
        return { q: `${m1} g ${p1} % li tuz eritmasiga ${m2} g ${p2} % li tuz eritmasi qo‘shildi.`, parts: [{ q: "Aralashmada necha gramm tuz bor?", a: s }, { q: "Hosil bo‘lgan eritma necha foizli?", a: P }],
          sol: `Tuz: ${m1}·${p1}/100 + ${m2}·${p2}/100 = ${num(s)} g; ${num(s)}/${m1 + m2}·100 % = ${P} %.` }; } },
    // 45. Hosila: ekstremum
    () => { const a = ri(1, 3), c = ri(-5, 10);
      return { q: `<span class="ex">f(x) = ${P([1, "x³"], [-3 * a * a, "x"], [c, ""])}</span> funksiya berilgan.`, parts: [{ q: "Funksiyaning minimum nuqtasini toping.", a }, { q: "Funksiyaning minimum qiymatini toping.", a: -2 * a ** 3 + c }],
        sol: `f′(x) = 3x² − ${3 * a * a} = 0 → x = ±${a}; x = ${a} da minimum: f(${a}) = ${-2 * a ** 3 + c}.` }; },
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
