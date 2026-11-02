/* 7–11-sinf matematika uchun qo'shimcha jonli tajribalar: son o'qi, koordinata tekisligi,
   (a+b)² modeli, chiziqli tenglamalar sistemasi, parallel to'g'ri chiziqlar burchaklari,
   grafikni siljitish, Paskal uchburchagi, normal taqsimot, fazoda kub qirralari, kvadrat tengsizlik. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const r2 = (v) => Math.round(v * 100) / 100;
  const sg = (v) => (v < 0 ? "−" : "+");
  const neg = (v) => (v < 0 ? "−" + Math.abs(v) : String(v));

  function plane(o = {}) {
    const Wd = o.w || 380, Ht = o.h || 300, xmin = o.xmin ?? -6, xmax = o.xmax ?? 6, ymin = o.ymin ?? -6, ymax = o.ymax ?? 6;
    const el = svg(Wd, Ht);
    const X = (v) => ((v - xmin) / (xmax - xmin)) * Wd, Y = (v) => Ht - ((v - ymin) / (ymax - ymin)) * Ht;
    for (let i = Math.ceil(xmin); i <= xmax; i++) {
      s("line", { x1: X(i), y1: 0, x2: X(i), y2: Ht, stroke: "rgba(148,163,184,.12)" }, el);
      if (i) s("text", { x: X(i), y: Y(0) + 13, fill: "#64748b", "font-size": 10, "text-anchor": "middle", text: i }, el);
    }
    for (let i = Math.ceil(ymin); i <= ymax; i++) {
      s("line", { x1: 0, y1: Y(i), x2: Wd, y2: Y(i), stroke: "rgba(148,163,184,.12)" }, el);
      if (i) s("text", { x: X(0) + 4, y: Y(i) + 3, fill: "#64748b", "font-size": 10, text: i }, el);
    }
    s("line", { x1: 0, y1: Y(0), x2: Wd, y2: Y(0), stroke: "#94a3b8" }, el);
    s("line", { x1: X(0), y1: 0, x2: X(0), y2: Ht, stroke: "#94a3b8" }, el);
    const curve = (f, color = "#22c55e", w = 3) => {
      let d = "", pen = false;
      for (let i = 0; i <= 400; i++) {
        const x = xmin + ((xmax - xmin) * i) / 400, y = f(x);
        if (!isFinite(y) || y > ymax + 20 || y < ymin - 20) { pen = false; continue; }
        d += `${pen ? "L" : "M"}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; pen = true;
      }
      return s("path", { d, fill: "none", stroke: color, "stroke-width": w }, el);
    };
    const dot = (x, y, c = "#fde047", label) => {
      s("circle", { cx: X(x), cy: Y(y), r: 5.5, fill: c, stroke: "#0b1220", "stroke-width": 1.5 }, el);
      if (label) s("text", { x: X(x) + 8, y: Y(y) - 8, fill: c, "font-size": 12, "font-weight": 800, text: label }, el);
    };
    return { el, X, Y, curve, dot };
  }

  // ---------- 1. Son o'qi: butun sonlarni qo'shish/ayirish ----------
  W.numberLine = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "↔ Son o‘qi: a + b ni “sakrash” bilan ko‘ring");
    let a = p.a ?? -3, b = p.b ?? 5, op = 0;
    function render() {
      const bb = op ? -b : b, res = a + bb;
      const el = svg(460, 110), X = (v) => 230 + v * 20;
      s("line", { x1: 10, y1: 70, x2: 450, y2: 70, stroke: "#94a3b8", "stroke-width": 2 }, el);
      for (let i = -11; i <= 11; i++) {
        s("line", { x1: X(i), y1: 64, x2: X(i), y2: 76, stroke: "#64748b" }, el);
        if (i % 2 === 0 || Math.abs(i) < 2) s("text", { x: X(i), y: 92, fill: i === 0 ? "#fff" : "#94a3b8", "font-size": 11, "text-anchor": "middle", text: i }, el);
      }
      const mid = (X(a) + X(res)) / 2;
      s("path", { d: `M${X(a)},62 Q${mid},${62 - Math.min(60, Math.abs(bb) * 6 + 14)} ${X(res)},62`, fill: "none", stroke: bb >= 0 ? "#22c55e" : "#f472b6", "stroke-width": 3, "marker-end": "" }, el);
      s("circle", { cx: X(a), cy: 70, r: 6, fill: "#38bdf8" }, el);
      s("circle", { cx: X(res), cy: 70, r: 7, fill: "#fde047" }, el);
      s("text", { x: mid, y: 20, fill: bb >= 0 ? "#22c55e" : "#f472b6", "font-size": 13, "font-weight": 800, "text-anchor": "middle", text: `${bb >= 0 ? "+" : "−"}${Math.abs(bb)} (${bb >= 0 ? "o‘ngga" : "chapga"})` }, el);
      stage.innerHTML = ""; stage.append(el);
      out.innerHTML = `<div class="big-num">${neg(a)} ${op ? "−" : "+"} ${b < 0 ? "(" + neg(b) + ")" : b} = ${neg(res)}</div><div class="steps">${op ? `<div>Ayirish = qarama-qarshi sonni qo‘shish: ${neg(a)} − ${b < 0 ? "(" + neg(b) + ")" : b} = ${neg(a)} + ${b < 0 ? Math.abs(b) : "(" + neg(-b) + ")"}</div>` : ""}<div>Musbat son qo‘shilsa — o‘ngga, manfiy qo‘shilsa — chapga suriladi.</div><div>|${neg(res)}| = ${Math.abs(res)} — nolgacha masofa.</div></div>`;
    }
    controls.append(slider({ label: "a", min: -10, max: 10, value: a, onInput: (v) => { a = v; render(); } }), slider({ label: "b", min: -10, max: 10, value: b, onInput: (v) => { b = v; render(); } }), buttons(["a + b", "a − b"], (i) => { op = i; render(); }));
    render();
  };

  // ---------- 2. Koordinata tekisligi: nuqta, chorak, masofa ----------
  W.coordPoint = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📍 Koordinata tekisligi — nuqtani suring");
    let x = 3, y = 2;
    function render() {
      const P = plane({ xmin: -7, xmax: 7, ymin: -6, ymax: 6 });
      s("line", { x1: P.X(x), y1: P.Y(0), x2: P.X(x), y2: P.Y(y), stroke: "#fde047", "stroke-dasharray": "4 4" }, P.el);
      s("line", { x1: P.X(0), y1: P.Y(y), x2: P.X(x), y2: P.Y(y), stroke: "#fde047", "stroke-dasharray": "4 4" }, P.el);
      P.dot(x, y, "#fde047", `A(${x}; ${y})`);
      P.dot(-x, y, "rgba(56,189,248,.6)"); P.dot(x, -y, "rgba(244,114,182,.6)");
      stage.innerHTML = ""; stage.append(P.el);
      const q = x > 0 && y > 0 ? "I" : x < 0 && y > 0 ? "II" : x < 0 && y < 0 ? "III" : x > 0 && y < 0 ? "IV" : "o‘qda";
      out.innerHTML = `<div class="big-num">A(${x}; ${y}) — ${q === "o‘qda" ? "koordinata o‘qida yotadi" : q + " chorak"}</div><div class="steps"><div>Abssissa x = ${x} (gorizontal), ordinata y = ${y} (vertikal).</div><div>Koordinatalar boshigacha masofa: √(${x}² + ${y}²) = <b>${r2(Math.hypot(x, y))}</b></div><div>Ko‘k — Oy o‘qiga nisbatan simmetrik (${-x}; ${y}), pushti — Ox ga nisbatan (${x}; ${-y}).</div></div>`;
    }
    controls.append(slider({ label: "x", min: -6, max: 6, value: x, onInput: (v) => { x = v; render(); } }), slider({ label: "y", min: -5, max: 5, value: y, onInput: (v) => { y = v; render(); } }));
    render();
  };

  // ---------- 3. (a ± b)² va a² − b² geometrik modeli ----------
  W.binomSquare = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🟩 Qisqa ko‘paytirish formulalari — yuzalar bilan");
    let a = 5, b = 3, mode = p.mode || 0;
    function render() {
      const el = svg(320, 260), k = 230 / (a + b);
      if (mode === 0) {
        const A = a * k, B = b * k;
        s("rect", { x: 20, y: 15, width: A, height: A, fill: "#22c55e", opacity: 0.85 }, el);
        s("rect", { x: 20 + A, y: 15, width: B, height: A, fill: "#38bdf8", opacity: 0.85 }, el);
        s("rect", { x: 20, y: 15 + A, width: A, height: B, fill: "#38bdf8", opacity: 0.85 }, el);
        s("rect", { x: 20 + A, y: 15 + A, width: B, height: B, fill: "#f472b6", opacity: 0.85 }, el);
        [["a²", 20 + A / 2, 15 + A / 2], ["ab", 20 + A + B / 2, 15 + A / 2], ["ab", 20 + A / 2, 15 + A + B / 2], ["b²", 20 + A + B / 2, 15 + A + B / 2]].forEach(([t, x, y]) => s("text", { x, y: y + 5, "text-anchor": "middle", fill: "#0b1220", "font-weight": 900, "font-size": 15, text: t }, el));
        out.innerHTML = `<div class="big-num">(a + b)² = a² + 2ab + b²</div><div>(${a} + ${b})² = ${a * a} + ${2 * a * b} + ${b * b} = <b>${(a + b) ** 2}</b>. Katta kvadrat = yashil kvadrat + 2 ta ko‘k to‘rtburchak + pushti kvadrat.</div>`;
      } else {
        const A = a * k * 1.2, B = Math.min(b, a - 1) * k * 1.2;
        s("rect", { x: 20, y: 15, width: A, height: A, fill: "#22c55e", opacity: 0.85 }, el);
        s("rect", { x: 20 + A - B, y: 15 + A - B, width: B, height: B, fill: "#0b1220", stroke: "#f472b6", "stroke-dasharray": "5 4" }, el);
        s("text", { x: 20 + (A - B) / 2, y: 20 + (A - B) / 2, "text-anchor": "middle", fill: "#0b1220", "font-weight": 900, "font-size": 15, text: "a² − b²" }, el);
        s("text", { x: 20 + A - B / 2, y: 20 + A - B / 2, "text-anchor": "middle", fill: "#f472b6", "font-weight": 900, "font-size": 14, text: "b²" }, el);
        const bb = Math.min(b, a - 1);
        out.innerHTML = `<div class="big-num">a² − b² = (a − b)(a + b)</div><div>${a}² − ${bb}² = ${a * a} − ${bb * bb} = <b>${a * a - bb * bb}</b> = (${a} − ${bb})(${a} + ${bb}) = ${a - bb} · ${a + bb}. Kvadratdan kichik kvadrat qirqib olinsa, qolgan shaklni (a − b) × (a + b) to‘rtburchakka qayta yig‘ish mumkin.</div>`;
      }
      stage.innerHTML = ""; stage.append(el);
    }
    controls.append(buttons(["(a + b)²", "a² − b²"], (i) => { mode = i; render(); }, mode), slider({ label: "a", min: 2, max: 9, value: a, onInput: (v) => { a = v; render(); } }), slider({ label: "b", min: 1, max: 8, value: b, onInput: (v) => { b = v; render(); } }));
    render();
  };

  // ---------- 4. Chiziqli tenglamalar sistemasi (grafik usul) ----------
  W.linSystem = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "✖️ Ikki to‘g‘ri chiziq — sistemaning yechimi kesishish nuqtasida");
    const st = { k1: 1, b1: 1, k2: -1, b2: 5, ...(p.init || {}) };
    function render() {
      const P = plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 8 });
      P.curve((x) => st.k1 * x + st.b1, "#22c55e"); P.curve((x) => st.k2 * x + st.b2, "#38bdf8");
      let txt;
      if (st.k1 === st.k2) txt = st.b1 === st.b2 ? "Chiziqlar ustma-ust — <b>cheksiz ko‘p yechim</b>." : "Chiziqlar parallel — <b>yechim yo‘q</b>.";
      else {
        const x = (st.b2 - st.b1) / (st.k1 - st.k2), y = st.k1 * x + st.b1;
        P.dot(x, y, "#fde047", `(${r2(x)}; ${r2(y)})`);
        txt = `Yagona yechim: <b>x = ${r2(x)}, y = ${r2(y)}</b>. Tekshiruv: ${st.k1}·${r2(x)} ${sg(st.b1)} ${Math.abs(st.b1)} = ${r2(y)} ✓`;
      }
      stage.innerHTML = ""; stage.append(P.el);
      out.innerHTML = `<div class="big-num"><span style="color:#22c55e">y = ${st.k1}x ${sg(st.b1)} ${Math.abs(st.b1)}</span> &nbsp;|&nbsp; <span style="color:#38bdf8">y = ${st.k2}x ${sg(st.b2)} ${Math.abs(st.b2)}</span></div><div>${txt}</div><div class="muted">Algebraik usulda: ${st.k1}x ${sg(st.b1)} ${Math.abs(st.b1)} = ${st.k2}x ${sg(st.b2)} ${Math.abs(st.b2)} → x ni topamiz (o‘rniga qo‘yish usuli).</div>`;
    }
    [["k₁", "k1"], ["b₁", "b1"], ["k₂", "k2"], ["b₂", "b2"]].forEach(([l, key]) => controls.append(slider({ label: l, min: -4, max: 4, step: key[0] === "k" ? 0.5 : 1, value: st[key], onInput: (v) => { st[key] = v; render(); } })));
    render();
  };

  // ---------- 5. Ikki parallel to'g'ri chiziq va kesuvchi ----------
  W.parallelAngles = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "∥ Parallel to‘g‘ri chiziqlar va kesuvchi — burchaklar");
    let ang = 60, sel = 1;
    const NAMES = ["", "Vertikal (∠1 = ∠3)", "Mos (∠1 = ∠5)", "Ichki almashinuvchi (∠3 = ∠5)", "Ichki bir tomonli (∠4 + ∠5 = 180°)"];
    function render() {
      const el = svg(420, 260), t = (ang * Math.PI) / 180, y1 = 80, y2 = 190;
      s("line", { x1: 10, y1, x2: 410, y2: y1, stroke: "#94a3b8", "stroke-width": 2.5 }, el);
      s("line", { x1: 10, y1: y2, x2: 410, y2, stroke: "#94a3b8", "stroke-width": 2.5 }, el);
      const cx1 = 210 + 55 / Math.tan(t), cx2 = 210 - 55 / Math.tan(t);
      const dx = Math.cos(t) * 200, dy = Math.sin(t) * 200;
      s("line", { x1: 210 - dx, y1: 135 + dy, x2: 210 + dx, y2: 135 - dy, stroke: "#fde047", "stroke-width": 2.5 }, el);
      const pts = [[cx1 + 0, y1], [cx2, y2]];
      const lab = (x, y, n, on) => { s("circle", { cx: x, cy: y, r: 13, fill: on ? "#22c55e" : "rgba(255,255,255,.08)" }, el); s("text", { x, y: y + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: on ? "#02130c" : "#e2e8f0", text: n }, el); };
      const A = ang, B = 180 - ang;
      const val = [0, B, A, B, A, B, A, B, A];
      const on = { 1: [1, 3], 2: [1, 5], 3: [3, 5], 4: [4, 5] }[sel];
      const off = 26;
      [[1, pts[0][0] - off, pts[0][1] - 16], [2, pts[0][0] + off, pts[0][1] - 16], [3, pts[0][0] + off, pts[0][1] + 18], [4, pts[0][0] - off, pts[0][1] + 18], [5, pts[1][0] - off, pts[1][1] - 16], [6, pts[1][0] + off, pts[1][1] - 16], [7, pts[1][0] + off, pts[1][1] + 18], [8, pts[1][0] - off, pts[1][1] + 18]].forEach(([n, x, y]) => lab(x, y, n, on.includes(n)));
      stage.innerHTML = ""; stage.append(el);
      out.innerHTML = `<div class="big-num">${NAMES[sel]}</div><div>Kesuvchi burchagi ${A}°: ∠1 = ${val[1]}°, ∠2 = ${val[2]}°, ∠5 = ${val[5]}°, ∠4 = ${val[4]}°. ${sel === 4 ? `∠4 + ∠5 = ${val[4]} + ${val[5]} = 180° ✓` : "Tanlangan burchaklar teng ✓"}</div><div class="muted">Juft burchaklar shunday bo‘lsa — to‘g‘ri chiziqlar parallel (parallellik alomatlari).</div>`;
    }
    controls.append(slider({ label: "Kesuvchi burchagi°", min: 30, max: 150, value: ang, step: 5, onInput: (v) => { ang = v; render(); } }), buttons(["Vertikal", "Mos", "Ichki almashinuvchi", "Ichki bir tomonli"], (i) => { sel = i + 1; render(); }));
    render();
  };

  // ---------- 6. Grafikni siljitish va cho'zish: y = a·f(x − m) + n ----------
  const BASES = { "x²": (x) => x * x, "|x|": Math.abs, "√x": (x) => (x >= 0 ? Math.sqrt(x) : NaN), "1/x": (x) => (Math.abs(x) < 1e-9 ? NaN : 1 / x), "x³": (x) => x ** 3, "sin x": Math.sin, "2ˣ": (x) => 2 ** x };
  W.funcShift = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "↕ Grafiklarni almashtirish: y = a·f(x − m) + n");
    const st = { a: 1, m: 0, n: 0, f: p.f || "x²" };
    function render() {
      const P = plane({ xmin: -7, xmax: 7, ymin: -6, ymax: 7 });
      const f = BASES[st.f];
      P.curve(f, "rgba(148,163,184,.55)", 2);
      P.curve((x) => st.a * f(x - st.m) + st.n);
      stage.innerHTML = ""; stage.append(P.el);
      out.innerHTML = `<div class="big-num">y = ${st.a === 1 ? "" : st.a === -1 ? "−" : st.a}${st.m === 0 ? st.f : st.f.replace(/x|ˣ/, (c) => (c === "ˣ" ? `<sup>x ${sg(-st.m)} ${Math.abs(st.m)}</sup>` : `(x ${sg(-st.m)} ${Math.abs(st.m)})`))}${st.n ? ` ${sg(st.n)} ${Math.abs(st.n)}` : ""}</div><div class="steps"><div>m = ${st.m}: grafik <b>${Math.abs(st.m)}</b> birlik ${st.m >= 0 ? "o‘ngga" : "chapga"} suriladi.</div><div>n = ${st.n}: <b>${Math.abs(st.n)}</b> birlik ${st.n >= 0 ? "yuqoriga" : "pastga"}.</div><div>a = ${st.a}: ${Math.abs(st.a) > 1 ? "Oy bo‘ylab cho‘ziladi" : Math.abs(st.a) < 1 ? "Oy bo‘ylab siqiladi" : "o‘lcham o‘zgarmaydi"}${st.a < 0 ? ", Ox ga nisbatan akslanadi" : ""}.</div><div class="muted">Kulrang — asosiy y = ${st.f}.</div></div>`;
    }
    controls.append(buttons(Object.keys(BASES), (i) => { st.f = Object.keys(BASES)[i]; render(); }, Object.keys(BASES).indexOf(st.f)),
      slider({ label: "a", min: -3, max: 3, step: 0.5, value: 1, onInput: (v) => { st.a = v; render(); } }), slider({ label: "m (gorizontal)", min: -4, max: 4, value: 0, onInput: (v) => { st.m = v; render(); } }), slider({ label: "n (vertikal)", min: -4, max: 4, value: 0, onInput: (v) => { st.n = v; render(); } }));
    render();
  };

  // ---------- 7. Paskal uchburchagi va Nyuton binomi ----------
  W.pascal = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔺 Paskal uchburchagi va (a + b)ⁿ");
    let n = 5;
    const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i; return Math.round(r); };
    function render() {
      let html = `<div class="m2-pascal">`;
      for (let r = 0; r <= 8; r++) html += `<div class="${r === n ? "on" : ""}">${Array.from({ length: r + 1 }, (_, k) => `<span>${C(r, k)}</span>`).join("")}</div>`;
      stage.innerHTML = html + "</div>";
      const terms = Array.from({ length: n + 1 }, (_, k) => { const c = C(n, k), pa = n - k, pb = k; return `${c === 1 ? "" : c}${pa ? "a" + (pa > 1 ? `<sup>${pa}</sup>` : "") : ""}${pb ? "b" + (pb > 1 ? `<sup>${pb}</sup>` : "") : ""}`; });
      out.innerHTML = `<div class="big-num">(a + b)<sup>${n}</sup> = ${terms.join(" + ")}</div><div class="muted">Koeffitsiyentlar — Paskal uchburchagining ${n}-qatori: C<sub>${n}</sub><sup>k</sup> = ${n}! / (k!(${n}−k)!). Yig‘indisi 2<sup>${n}</sup> = ${2 ** n}. Har bir son — ustidagi ikki sonning yig‘indisi.</div>`;
    }
    controls.append(slider({ label: "n (daraja)", min: 0, max: 8, value: n, onInput: (v) => { n = v; render(); } }));
    render();
  };

  // ---------- 8. Normal va binomial taqsimot ----------
  W.normalCurve = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔔 Normal taqsimot — o‘rta qiymat va standart chetlashish");
    let mu = 0, sigma = 1, k = 1;
    function render() {
      const P = plane({ xmin: -6, xmax: 6, ymin: -0.05, ymax: 0.9, h: 220 });
      const f = (x) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
      let d = `M${P.X(mu - k * sigma)},${P.Y(0)} `;
      for (let i = 0; i <= 60; i++) { const x = mu - k * sigma + (2 * k * sigma * i) / 60; d += `L${P.X(x)},${P.Y(f(x))} `; }
      d += `L${P.X(mu + k * sigma)},${P.Y(0)} Z`;
      s("path", { d, fill: "rgba(34,197,94,.3)" }, P.el);
      P.curve(f);
      stage.innerHTML = ""; stage.append(P.el);
      const pct = { 1: 68.3, 2: 95.4, 3: 99.7 }[k];
      out.innerHTML = `<div class="big-num">μ = ${mu}, σ = ${sigma} → μ ± ${k}σ oralig‘ida ≈ ${pct}%</div><div class="muted">“68–95–99,7” qoidasi: qiymatlarning ~68% i o‘rtachadan 1σ, 95% i 2σ, 99,7% i 3σ masofada. Bo‘y, IQ, imtihon ballari taxminan shunday taqsimlanadi. σ kattalashsa — “qo‘ng‘iroq” yoyiladi.</div>`;
    }
    controls.append(slider({ label: "μ (o‘rta)", min: -3, max: 3, step: 0.5, value: 0, onInput: (v) => { mu = v; render(); } }), slider({ label: "σ (chetlashish)", min: 0.5, max: 2.5, step: 0.25, value: 1, onInput: (v) => { sigma = v; render(); } }), buttons(["±1σ", "±2σ", "±3σ"], (i) => { k = i + 1; render(); }));
    render();
  };

  // ---------- 9. Fazoda kub: qirralarning o'zaro joylashuvi ----------
  W.cubeEdges = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧊 Kub qirralari: parallel, kesishuvchi yoki ayqash? Ikki qirrani bosing");
    const V = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], A1: [0, 0, 1], B1: [1, 0, 1], C1: [1, 1, 1], D1: [0, 1, 1] };
    const E = ["AB", "BC", "CD", "DA", "A1B1", "B1C1", "C1D1", "D1A1", "AA1", "BB1", "CC1", "DD1"];
    const ends = (e) => { const m = e.match(/[A-D]1?/g); return [m[0], m[1]]; };
    let rot = 0.6, picked = [];
    const proj = ([x, y, z]) => { const cx = x - 0.5, cy = y - 0.5; const X = cx * Math.cos(rot) - cy * Math.sin(rot), Y = cx * Math.sin(rot) + cy * Math.cos(rot); return [200 + X * 150, 190 - z * 150 + Y * 55]; };
    function rel(e1, e2) {
      const [a, b] = ends(e1).map((k) => V[k]), [c, d] = ends(e2).map((k) => V[k]);
      const u = a.map((v, i) => b[i] - v), w = c.map((v, i) => d[i] - v);
      const cross = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      if (cross.every((v) => v === 0)) return "parallel";
      const shared = ends(e1).some((k) => ends(e2).includes(k));
      if (shared) return "kesishadi";
      const ac = c.map((v, i) => v - a[i]);
      const trip = ac[0] * cross[0] + ac[1] * cross[1] + ac[2] * cross[2];
      return trip === 0 ? "kesishadi" : "ayqash";
    }
    function render() {
      const el = svg(400, 330);
      E.forEach((e) => {
        const [p1, p2] = ends(e).map((k) => proj(V[k]));
        const on = picked.includes(e);
        const ln = s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: on ? "#fde047" : "#22c55e", "stroke-width": on ? 6 : 3.5, "stroke-linecap": "round", style: "cursor:pointer" }, el);
        const hit = s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: "transparent", "stroke-width": 18, style: "cursor:pointer" }, el);
        hit.onclick = ln.onclick = () => { picked = picked.includes(e) ? picked.filter((x) => x !== e) : [...picked.slice(-1), e]; render(); };
      });
      Object.entries(V).forEach(([k, v]) => { const [x, y] = proj(v); s("text", { x: x + 6, y: y - 6, fill: "#e2e8f0", "font-size": 12, "font-weight": 800, text: k.replace("1", "₁") }, el); });
      stage.innerHTML = ""; stage.append(el);
      if (picked.length === 2) {
        const r = rel(picked[0], picked[1]);
        out.innerHTML = `<div class="big-num">${picked.map((x) => x.replace(/1/g, "₁")).join(" va ")} — ${r === "ayqash" ? "AYQASH 🔀" : r === "parallel" ? "PARALLEL ∥" : "KESISHADI ✖"}</div><div class="muted">${r === "ayqash" ? "Ayqash to‘g‘ri chiziqlar bir tekislikda yotmaydi: kesishmaydi va parallel ham emas." : r === "parallel" ? "Parallel to‘g‘ri chiziqlar bir tekislikda yotadi va kesishmaydi." : "Kesishuvchi to‘g‘ri chiziqlar bitta umumiy nuqtaga ega."}</div>`;
      } else out.innerHTML = `<span class="muted">Kubning ikkita qirrasini bosing. Burish slayderi bilan kubni aylantiring.</span>`;
    }
    controls.append(slider({ label: "Kubni burish", min: 0, max: 6.28, step: 0.05, value: rot, fmt: (v) => Math.round((v * 180) / Math.PI) + "°", onInput: (v) => { rot = v; render(); } }));
    render();
  };

  // ---------- 10. Kvadrat tengsizlik: parabola va ishora oraliqlari ----------
  W.quadIneq = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📈 ax² + bx + c > 0 — parabola qayerda Ox dan yuqorida?");
    const st = { a: 1, b: -1, c: -6, sign: 0 };
    function render() {
      const P = plane({ xmin: -7, xmax: 7, ymin: -8, ymax: 8 });
      const f = (x) => st.a * x * x + st.b * x + st.c, D = st.b * st.b - 4 * st.a * st.c;
      P.curve(f);
      let roots = [];
      if (D >= 0) { roots = [(-st.b - Math.sqrt(D)) / (2 * st.a), (-st.b + Math.sqrt(D)) / (2 * st.a)].sort((u, v) => u - v); roots.forEach((r) => P.dot(r, 0, "#38bdf8")); }
      const pos = st.sign === 0;
      for (let x = -7; x <= 7; x += 0.05) if ((f(x) > 0) === pos && Math.abs(f(x)) > 1e-9) s("rect", { x: P.X(x), y: P.Y(0) - 3, width: 3, height: 6, fill: "#fde047" }, P.el);
      stage.innerHTML = ""; stage.append(P.el);
      let ans;
      const [x1, x2] = roots.map(r2);
      if (D < 0) ans = (st.a > 0) === pos ? "x — istalgan son (−∞; +∞)" : "yechim yo‘q (∅)";
      else if (D === 0) ans = (st.a > 0) === pos ? `x ≠ ${x1}` : "yechim yo‘q (qat’iy tengsizlik)";
      else ans = (st.a > 0) === pos ? `x ∈ (−∞; ${x1}) ∪ (${x2}; +∞)` : `x ∈ (${x1}; ${x2})`;
      out.innerHTML = `<div class="big-num">${st.a === 1 ? "" : st.a === -1 ? "−" : st.a}x² ${st.b ? `${sg(st.b)} ${Math.abs(st.b) === 1 ? "" : Math.abs(st.b)}x ` : ""}${st.c ? `${sg(st.c)} ${Math.abs(st.c)} ` : ""}${pos ? ">" : "<"} 0</div><div class="steps"><div>D = ${D}${D >= 0 ? `, ildizlar: ${x1}${D > 0 ? " va " + x2 : ""}` : " < 0 — ildiz yo‘q"}.</div><div>a ${st.a > 0 ? "> 0 — shoxlar yuqoriga" : "< 0 — shoxlar pastga"}.</div><div>Javob: <b>${ans}</b> (sariq — yechimlar).</div></div>`;
    }
    controls.append(slider({ label: "a", min: -3, max: 3, value: 1, onInput: (v) => { st.a = v || 1; render(); } }), slider({ label: "b", min: -6, max: 6, value: -1, onInput: (v) => { st.b = v; render(); } }), slider({ label: "c", min: -8, max: 8, value: -6, onInput: (v) => { st.c = v; render(); } }), buttons(["> 0", "< 0"], (i) => { st.sign = i; render(); }));
    render();
  };

  // ---------- 11. Burchakni o'lchash (transportir) va turlari ----------
  W.angleMeter = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📐 Burchak — transportir bilan o‘lchang");
    let a = 50;
    function render() {
      const el = svg(360, 210), cx = 180, cy = 185, R = 150;
      s("path", { d: `M${cx - R},${cy} A${R},${R} 0 0 1 ${cx + R},${cy}`, fill: "rgba(56,189,248,.08)", stroke: "#38bdf8" }, el);
      for (let d = 0; d <= 180; d += 10) { const t = (d * Math.PI) / 180, l = d % 30 ? 8 : 14; s("line", { x1: cx + R * Math.cos(t), y1: cy - R * Math.sin(t), x2: cx + (R - l) * Math.cos(t), y2: cy - (R - l) * Math.sin(t), stroke: "#64748b" }, el); if (d % 30 === 0) s("text", { x: cx + (R - 26) * Math.cos(t), y: cy - (R - 26) * Math.sin(t) + 4, "text-anchor": "middle", "font-size": 10, fill: "#94a3b8", text: d }, el); }
      const t = (a * Math.PI) / 180;
      s("line", { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: "#22c55e", "stroke-width": 4 }, el);
      s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(t), y2: cy - R * Math.sin(t), stroke: "#fde047", "stroke-width": 4 }, el);
      s("path", { d: `M${cx + 40},${cy} A40,40 0 0 0 ${cx + 40 * Math.cos(t)},${cy - 40 * Math.sin(t)}`, fill: "none", stroke: "#f472b6", "stroke-width": 3 }, el);
      stage.innerHTML = ""; stage.append(el);
      const type = a < 90 ? "o‘tkir" : a === 90 ? "to‘g‘ri" : a < 180 ? "o‘tmas" : "yoyiq";
      out.innerHTML = `<div class="big-num">∠ = ${a}° — ${type} burchak</div><div class="muted">O‘tkir: 0° < α < 90°; to‘g‘ri: 90°; o‘tmas: 90° < α < 180°; yoyiq: 180°. Qo‘shni burchak: ${180 - a}° (yig‘indisi 180°).</div>`;
    }
    controls.append(slider({ label: "Burchak°", min: 5, max: 180, value: a, step: 5, onInput: (v) => { a = v; render(); } }));
    render();
  };
})();
