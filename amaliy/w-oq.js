/* Oq to'plam (DTM matematika) uchun jonli tajribalar: grafiklar, birlik aylana, progressiya,
   hosila, integral, vektorlar, jismlar va boshqalar. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, frame, W } = window.AK;
  const r2 = (v) => Math.round(v * 100) / 100;
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const sgn = (v) => (v < 0 ? "−" : "+");
  const abs = Math.abs;

  /** Koordinata tekisligi: setka, o'qlar va belgilar */
  function plane(o = {}) {
    const Wd = o.w || 380, Ht = o.h || 300;
    const xmin = o.xmin ?? -6, xmax = o.xmax ?? 6, ymin = o.ymin ?? -5, ymax = o.ymax ?? 5;
    const el = svg(Wd, Ht);
    const X = (v) => ((v - xmin) / (xmax - xmin)) * Wd;
    const Y = (v) => Ht - ((v - ymin) / (ymax - ymin)) * Ht;
    const stepX = o.stepX || (xmax - xmin > 16 ? 2 : 1), stepY = o.stepY || (ymax - ymin > 16 ? 2 : 1);
    for (let i = Math.ceil(xmin / stepX) * stepX; i <= xmax; i += stepX) {
      s("line", { x1: X(i), y1: 0, x2: X(i), y2: Ht, stroke: "rgba(148,163,184,.12)" }, el);
      if (i !== 0 && o.labels !== false) s("text", { x: X(i), y: Math.min(Ht - 4, Math.max(12, Y(0) + 14)), fill: "#64748b", "font-size": 10, "text-anchor": "middle", text: i }, el);
    }
    for (let i = Math.ceil(ymin / stepY) * stepY; i <= ymax; i += stepY) {
      s("line", { x1: 0, y1: Y(i), x2: Wd, y2: Y(i), stroke: "rgba(148,163,184,.12)" }, el);
      if (i !== 0 && o.labels !== false) s("text", { x: Math.min(Wd - 14, Math.max(4, X(0) + 4)), y: Y(i) + 3, fill: "#64748b", "font-size": 10, text: i }, el);
    }
    if (ymin < 0 && ymax > 0) s("line", { x1: 0, y1: Y(0), x2: Wd, y2: Y(0), stroke: "#94a3b8" }, el);
    if (xmin < 0 && xmax > 0) s("line", { x1: X(0), y1: 0, x2: X(0), y2: Ht, stroke: "#94a3b8" }, el);
    s("text", { x: Wd - 10, y: Y(0) - 6, fill: "#94a3b8", text: "x" }, el);
    s("text", { x: X(0) + 6, y: 12, fill: "#94a3b8", text: "y" }, el);
    const curve = (f, color = "#22c55e", width = 3, from = xmin, to = xmax) => {
      let d = "", pen = false;
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const x = from + ((to - from) * i) / N, y = f(x);
        if (!isFinite(y) || y > ymax + (ymax - ymin) || y < ymin - (ymax - ymin)) { pen = false; continue; }
        d += `${pen ? "L" : "M"}${X(x).toFixed(1)},${Y(y).toFixed(1)} `;
        pen = true;
      }
      return s("path", { d, fill: "none", stroke: color, "stroke-width": width, "stroke-linejoin": "round" }, el);
    };
    const dot = (x, y, color = "#fde047", label) => {
      if (!isFinite(y) || y < ymin || y > ymax || x < xmin || x > xmax) return;
      s("circle", { cx: X(x), cy: Y(y), r: 5.5, fill: color, stroke: "#0b1220", "stroke-width": 1.5 }, el);
      if (label) s("text", { x: X(x) + 8, y: Y(y) - 8, fill: color, "font-size": 12, "font-weight": 800, text: label }, el);
    };
    return { el, X, Y, curve, dot, xmin, xmax, ymin, ymax };
  }
  const mount = (stage, el) => { stage.innerHTML = ""; stage.append(el); };

  // ---------- Funksiya grafiklari ----------
  W.fgraph = (root, p) => {
    const kind = p.kind || "linear";
    const st = { k: 2, b: 1, a: 1, bq: -2, c: -3, base: 2, A: 1, w: 1, m: 0, n: 0 };
    Object.assign(st, p.init || {});
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const P = plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
      let html = "";
      if (kind === "linear") {
        const f = (x) => st.k * x + st.b;
        P.curve(f);
        P.dot(0, st.b, "#fde047", `(0; ${st.b})`);
        if (st.k !== 0) P.dot(-st.b / st.k, 0, "#38bdf8", `(${r2(-st.b / st.k)}; 0)`);
        html = `<div class="big-num">y = ${st.k}x ${sgn(st.b)} ${abs(st.b)}</div><div class="steps">
          <div><b>k = ${st.k}</b> — burchak koeffitsienti: ${st.k > 0 ? "funksiya o‘sadi ↗" : st.k < 0 ? "funksiya kamayadi ↘" : "to‘g‘ri chiziq Ox ga parallel"}.</div>
          <div><b>b = ${st.b}</b> — grafik Oy o‘qini (0; ${st.b}) nuqtada kesadi.</div>
          ${st.k !== 0 ? `<div>Ox bilan kesishish: kx + b = 0 → x = −b/k = <b>${r2(-st.b / st.k)}</b></div>` : ""}
          <div>Burchak: tg α = k → α ≈ <b>${r2((Math.atan(st.k) * 180) / Math.PI)}°</b></div></div>`;
      } else if (kind === "quad") {
        const a = st.a || 1, b = st.bq, c = st.c;
        const f = (x) => a * x * x + b * x + c;
        P.curve(f);
        const D = b * b - 4 * a * c, x0 = -b / (2 * a), y0 = f(x0);
        P.dot(x0, y0, "#fde047", `T(${r2(x0)}; ${r2(y0)})`);
        s("line", { x1: P.X(x0), y1: 0, x2: P.X(x0), y2: 300, stroke: "#fde047", "stroke-dasharray": "4 4", opacity: 0.5 }, P.el);
        let roots = "";
        if (D > 0) { const x1 = (-b - Math.sqrt(D)) / (2 * a), x2 = (-b + Math.sqrt(D)) / (2 * a); P.dot(x1, 0, "#38bdf8"); P.dot(x2, 0, "#38bdf8"); roots = `D > 0 → ikki ildiz: x₁ = <b>${r2(Math.min(x1, x2))}</b>, x₂ = <b>${r2(Math.max(x1, x2))}</b>. Viyet: x₁+x₂ = ${r2(-b / a)}, x₁·x₂ = ${r2(c / a)}`; }
        else if (D === 0) { P.dot(x0, 0, "#38bdf8"); roots = `D = 0 → bitta ildiz: x = <b>${r2(x0)}</b>`; }
        else roots = "D < 0 → haqiqiy ildiz yo‘q, parabola Ox ni kesmaydi.";
        html = `<div class="big-num">y = ${a}x² ${sgn(b)} ${abs(b)}x ${sgn(c)} ${abs(c)}</div><div class="steps">
          <div>${a > 0 ? "a > 0 — shoxlar yuqoriga ∪, uchida eng kichik qiymat." : "a < 0 — shoxlar pastga ∩, uchida eng katta qiymat."}</div>
          <div>Uchi: x₀ = −b/(2a) = <b>${r2(x0)}</b>, y₀ = <b>${r2(y0)}</b></div>
          <div>D = b² − 4ac = ${b * b} − ${4 * a * c} = <b>${D}</b></div><div>${roots}</div></div>`;
      } else if (kind === "exp" || kind === "log") {
        const a = st.base;
        const f = kind === "exp" ? (x) => Math.pow(a, x) : (x) => (x > 0 ? Math.log(x) / Math.log(a) : NaN);
        if (p.both) {
          P.curve((x) => Math.pow(a, x), "#22c55e");
          P.curve((x) => (x > 0 ? Math.log(x) / Math.log(a) : NaN), "#f472b6");
          P.curve((x) => x, "rgba(253,224,71,.5)", 1.5);
        } else P.curve(f);
        if (kind === "exp") P.dot(0, 1, "#fde047", "(0; 1)"); else P.dot(1, 0, "#fde047", "(1; 0)");
        const grow = a > 1;
        html = `<div class="big-num">${kind === "exp" ? `y = ${a}<sup>x</sup>` : `y = log<sub>${a}</sub> x`}</div><div class="steps">
          <div>${grow ? "a > 1 → funksiya <b>o‘suvchi</b>" : "0 < a < 1 → funksiya <b>kamayuvchi</b>"}.</div>
          ${kind === "exp" ? `<div>Aniqlanish sohasi: x ∈ (−∞; +∞), qiymatlar sohasi: y > 0. Grafik doim (0; 1) dan o‘tadi.</div><div>Masalan: ${a}<sup>2</sup> = ${r3(a * a)}, ${a}<sup>−1</sup> = ${r3(1 / a)}</div>`
          : `<div>Aniqlanish sohasi: x > 0, qiymatlar sohasi: y ∈ (−∞; +∞). Grafik doim (1; 0) dan o‘tadi.</div><div>Masalan: log<sub>${a}</sub> ${r3(a * a)} = 2, log<sub>${a}</sub> 1 = 0</div>`}
          ${p.both ? `<div>Yashil — y = ${a}<sup>x</sup>, pushti — y = log<sub>${a}</sub>x. Ular <b>y = x</b> ga nisbatan simmetrik (o‘zaro teskari funksiyalar).</div>` : ""}</div>`;
      } else if (kind === "abs") {
        const f = (x) => abs(x - st.m) + st.n;
        P.curve(f);
        P.dot(st.m, st.n, "#fde047", `(${st.m}; ${st.n})`);
        html = `<div class="big-num">y = |x ${sgn(-st.m)} ${abs(st.m)}| ${sgn(st.n)} ${abs(st.n)}</div><div class="steps">
          <div>“Burchak” uchi: (${st.m}; ${st.n}). |x − m| grafigi y = |x| ni <b>${st.m}</b> birlik o‘ngga, +n esa <b>${st.n}</b> birlik yuqoriga suradi.</div>
          <div>|a| = a, agar a ≥ 0; |a| = −a, agar a < 0. Modul hech qachon manfiy bo‘lmaydi.</div></div>`;
      } else if (kind === "sin") {
        const P2 = plane({ xmin: -7, xmax: 7, ymin: -3.5, ymax: 3.5 });
        P2.curve((x) => st.A * Math.sin(st.w * x), "#22c55e");
        P2.curve((x) => Math.sin(x), "rgba(148,163,184,.5)", 1.5);
        mount(stage, P2.el);
        out.innerHTML = `<div class="big-num">y = ${st.A} sin(${st.w}x)</div><div class="steps">
          <div>Amplituda |A| = <b>${abs(st.A)}</b> → qiymatlar sohasi [−${abs(st.A)}; ${abs(st.A)}].</div>
          <div>Davr T = 2π / |k| = <b>${r2((2 * Math.PI) / st.w)}</b> (≈ 2π/${st.w}).</div>
          <div>Kulrang — oddiy y = sin x (davri 2π ≈ 6,28).</div></div>`;
        return;
      } else if (kind === "inverse") {
        const k = st.k, b = st.b;
        P.curve((x) => k * x + b, "#22c55e");
        if (k !== 0) P.curve((x) => (x - b) / k, "#f472b6");
        P.curve((x) => x, "rgba(253,224,71,.5)", 1.5);
        html = `<div class="big-num">y = ${k}x ${sgn(b)} ${abs(b)} &nbsp;⇄&nbsp; y = (x ${sgn(-b)} ${abs(b)}) / ${k}</div><div class="steps">
          <div>Teskari funksiyani topish: y = ${k}x ${sgn(b)} ${abs(b)} → x ni y orqali ifodalaymiz → x va y o‘rnini almashtiramiz.</div>
          <div>Grafiklar <b>y = x</b> to‘g‘ri chizig‘iga nisbatan simmetrik.</div></div>`;
      }
      mount(stage, P.el);
      out.innerHTML = html;
    }
    const add = (label, key, min, max, step = 1) => controls.append(slider({ label, min, max, step, value: st[key], fmt: (v) => num(v), onInput: (v) => { st[key] = v; render(); } }));
    if (kind === "linear" || kind === "inverse") { add("k", "k", -4, 4, 0.5); add("b", "b", -5, 5, 1); }
    if (kind === "quad") { add("a", "a", -3, 3, 1); add("b", "bq", -6, 6, 1); add("c", "c", -6, 6, 1); }
    if (kind === "exp" || kind === "log") controls.append(buttons(["a = 2", "a = 3", "a = ½", "a = ⅓"], (i) => { st.base = [2, 3, 0.5, 1 / 3][i]; render(); }));
    if (kind === "abs") { add("m", "m", -4, 4, 1); add("n", "n", -4, 4, 1); }
    if (kind === "sin") { add("A", "A", -3, 3, 0.5); add("k", "w", 0.5, 4, 0.5); }
    render();
  };

  // ---------- Birlik aylana ----------
  W.unitCircle = (root, p) => {
    let deg = 30;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const el = svg(320, 320), C = 160, R = 120;
      s("circle", { cx: C, cy: C, r: R, fill: "none", stroke: "#475569", "stroke-width": 2 }, el);
      s("line", { x1: 20, y1: C, x2: 300, y2: C, stroke: "#94a3b8" }, el);
      s("line", { x1: C, y1: 20, x2: C, y2: 300, stroke: "#94a3b8" }, el);
      [["I", 230, 90], ["II", 80, 90], ["III", 80, 240], ["IV", 230, 240]].forEach(([t, x, y]) => s("text", { x, y, fill: "#334155", "font-size": 20, "font-weight": 800, text: t }, el));
      const a = (deg * Math.PI) / 180, x = Math.cos(a), y = Math.sin(a);
      const px = C + R * x, py = C - R * y;
      const large = ((deg % 360) + 360) % 360 > 180 ? 1 : 0;
      s("path", { d: `M${C + 30},${C} A30,30 0 ${large} 0 ${C + 30 * x},${C - 30 * y}`, fill: "none", stroke: "#fde047", "stroke-width": 2 }, el);
      s("line", { x1: C, y1: C, x2: px, y2: py, stroke: "#fde047", "stroke-width": 3 }, el);
      s("line", { x1: px, y1: py, x2: px, y2: C, stroke: "#22c55e", "stroke-width": 3 }, el);
      s("line", { x1: C, y1: C, x2: px, y2: C, stroke: "#38bdf8", "stroke-width": 3 }, el);
      s("circle", { cx: px, cy: py, r: 7, fill: "#fde047" }, el);
      s("text", { x: Math.max(4, Math.min(220, px + (x >= 0 ? 10 : -100))), y: py < 30 ? py + 24 : py - 10, fill: "#fde047", "font-size": 12, "font-weight": 800, text: `(${r2(x)}; ${r2(y)})` }, el);
      mount(stage, el);
      const t = abs(x) < 1e-9 ? "mavjud emas" : r3(y / x);
      const ct = abs(y) < 1e-9 ? "mavjud emas" : r3(x / y);
      const gg = (m, n) => (n ? gg(n, m % n) : Math.abs(m));
      const g0 = gg(deg, 180) || 1, nu = deg / g0, de = 180 / g0;
      const rad = deg === 0 ? "0" : `${nu === 1 ? "" : nu === -1 ? "−" : nu}π${de === 1 ? "" : "/" + de} ≈ ${r3(a)}`;
      out.innerHTML = `<div class="big-num">α = ${deg}° = ${rad} rad</div><div class="steps">
        <div><span style="color:#38bdf8">cos α = x = <b>${r3(x)}</b></span> &nbsp; <span style="color:#22c55e">sin α = y = <b>${r3(y)}</b></span></div>
        <div>tg α = sin α / cos α = <b>${t}</b>, &nbsp; ctg α = <b>${ct}</b></div>
        <div>sin²α + cos²α = ${r3(y * y)} + ${r3(x * x)} = <b>1</b> (Pifagor teoremasi!)</div>
        <div>Radian: α° · π / 180. 180° = π, 90° = π/2, 60° = π/3, 45° = π/4, 30° = π/6.</div></div>`;
    }
    controls.append(slider({ label: "Burchak α (°)", min: -360, max: 360, step: 15, value: deg, onInput: (v) => { deg = v; render(); } }));
    controls.append(buttons(["30°", "45°", "60°", "90°", "120°", "180°", "270°"], (i) => { deg = [30, 45, 60, 90, 120, 180, 270][i]; controls.querySelector("input").value = deg; controls.querySelector(".ctl b").textContent = deg; render(); }, -1));
    render();
  };

  // ---------- Progressiyalar ----------
  W.progression = (root, p) => {
    const geo = p.kind === "geo";
    let a1 = geo ? 1 : 2, d = geo ? 2 : 3, n = 6;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const terms = Array.from({ length: n }, (_, i) => (geo ? a1 * Math.pow(d, i) : a1 + d * i));
      const mx = Math.max(1, ...terms.map(abs));
      const el = svg(380, 220);
      const bw = 340 / n;
      s("line", { x1: 20, y1: 110, x2: 370, y2: 110, stroke: "#94a3b8" }, el);
      terms.forEach((t, i) => {
        const hh = (abs(t) / mx) * 95;
        s("rect", { x: 22 + i * bw + 3, y: t >= 0 ? 110 - hh : 110, width: bw - 6, height: hh, rx: 6, fill: geo ? "#a855f7" : "#22c55e", opacity: 0.85 }, el);
        s("text", { x: 22 + i * bw + bw / 2, y: t >= 0 ? 104 - hh : 126 + hh, fill: "#e2e8f0", "font-size": 11, "font-weight": 800, "text-anchor": "middle", text: r2(t) }, el);
        s("text", { x: 22 + i * bw + bw / 2, y: 214, fill: "#64748b", "font-size": 10, "text-anchor": "middle", text: `a${i + 1}` }, el);
      });
      mount(stage, el);
      const an = terms[n - 1];
      const Sn = geo ? (d === 1 ? a1 * n : (a1 * (Math.pow(d, n) - 1)) / (d - 1)) : ((a1 + an) * n) / 2;
      out.innerHTML = geo
        ? `<div class="big-num">b<sub>n</sub> = b₁ · q<sup>n−1</sup></div><div class="steps">
          <div>b<sub>${n}</sub> = ${a1} · ${d}<sup>${n - 1}</sup> = <b>${r2(an)}</b></div>
          <div>S<sub>${n}</sub> = b₁(q<sup>n</sup> − 1)/(q − 1) = <b>${r2(Sn)}</b></div>
          <div>Har bir had oldingisidan <b>${d}</b> marta katta. ${abs(d) < 1 ? `|q| < 1 bo‘lgani uchun cheksiz kamayuvchi: S = b₁/(1 − q) = <b>${r2(a1 / (1 - d))}</b>` : ""}</div></div>`
        : `<div class="big-num">a<sub>n</sub> = a₁ + (n − 1)d</div><div class="steps">
          <div>a<sub>${n}</sub> = ${a1} + ${n - 1}·${d} = <b>${an}</b></div>
          <div>S<sub>${n}</sub> = (a₁ + a<sub>n</sub>)·n/2 = (${a1} + ${an})·${n}/2 = <b>${Sn}</b></div>
          <div>Har bir had oldingisidan <b>${d}</b> ga farq qiladi. O‘rta had — qo‘shnilarining o‘rta arifmetigi: a<sub>k</sub> = (a<sub>k−1</sub> + a<sub>k+1</sub>)/2.</div></div>`;
    }
    controls.append(
      slider({ label: geo ? "b₁" : "a₁", min: -5, max: 10, value: a1, onInput: (v) => { a1 = v; render(); } }),
      geo ? slider({ label: "q", min: -3, max: 3, step: 0.5, value: d, fmt: (v) => num(v), onInput: (v) => { d = v === 0 ? 0.5 : v; render(); } })
        : slider({ label: "d", min: -5, max: 6, value: d, onInput: (v) => { d = v; render(); } }),
      slider({ label: "n", min: 2, max: 10, value: n, onInput: (v) => { n = v; render(); } })
    );
    render();
  };

  // ---------- Hosila: urinma ----------
  const FUNCS = {
    "x²": { f: (x) => x * x, d: (x) => 2 * x, df: "2x", rng: [-4, 4, -2, 10] },
    "x³ − 3x": { f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, df: "3x² − 3", rng: [-3, 3, -5, 5] },
    "sin x": { f: Math.sin, d: Math.cos, df: "cos x", rng: [-6.5, 6.5, -2, 2] }
  };
  W.tangent = (root, p) => {
    let key = p.fn || "x²", x0 = 1;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const F = FUNCS[key], [a, b, c, d] = F.rng;
      const P = plane({ xmin: a, xmax: b, ymin: c, ymax: d, stepY: d - c > 8 ? 2 : 1 });
      P.curve(F.f);
      const k = F.d(x0), y0 = F.f(x0);
      P.curve((x) => y0 + k * (x - x0), "#fde047", 2);
      P.dot(x0, y0, "#fde047", `(${r2(x0)}; ${r2(y0)})`);
      mount(stage, P.el);
      out.innerHTML = `<div class="big-num">f(x) = ${key}, &nbsp; f′(x) = ${F.df}</div><div class="steps">
        <div>Urinma burchak koeffitsienti: k = f′(${r2(x0)}) = <b>${r3(k)}</b> ${k > 0 ? "→ funksiya shu nuqtada o‘sadi" : k < 0 ? "→ funksiya kamayadi" : "→ <b>kritik nuqta</b> (urinma gorizontal)!"}</div>
        <div>Urinma tenglamasi: y = f(x₀) + f′(x₀)(x − x₀) = <b>${r3(y0)} ${sgn(k)} ${r3(abs(k))}(x ${sgn(-x0)} ${r2(abs(x0))})</b></div>
        <div>Mexanik ma’nosi: agar f(t) — yo‘l bo‘lsa, f′(t) — shu paytdagi tezlik.</div></div>`;
    }
    controls.append(buttons(Object.keys(FUNCS), (i) => { key = Object.keys(FUNCS)[i]; render(); }, Object.keys(FUNCS).indexOf(key)));
    controls.append(slider({ label: "x₀", min: -3, max: 3, step: 0.25, value: x0, fmt: (v) => num(v), onInput: (v) => { x0 = v; render(); } }));
    render();
  };

  // ---------- Integral: egri chiziqli trapetsiya ----------
  W.integral = (root, p) => {
    let a = 0, b = 2, n = 6, fi = 0;
    const FS = [
      { name: "x²", f: (x) => x * x, F: (x) => (x ** 3) / 3, Fs: "x³/3" },
      { name: "x", f: (x) => x, F: (x) => (x * x) / 2, Fs: "x²/2" },
      { name: "√x", f: (x) => Math.sqrt(Math.max(0, x)), F: (x) => (2 / 3) * Math.pow(Math.max(0, x), 1.5), Fs: "⅔·x√x" }
    ];
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const G = FS[fi];
      const P = plane({ xmin: -0.5, xmax: 4.5, ymin: -0.5, ymax: 9, stepY: 1 });
      const lo = Math.min(a, b), hi = Math.max(a, b), dx = (hi - lo) / n;
      let rs = 0;
      for (let i = 0; i < n; i++) {
        const xm = lo + dx * (i + 0.5), yv = G.f(xm);
        rs += yv * dx;
        s("rect", { x: P.X(lo + dx * i), y: P.Y(Math.max(0, yv)), width: P.X(lo + dx * (i + 1)) - P.X(lo + dx * i), height: abs(P.Y(yv) - P.Y(0)), fill: "rgba(56,189,248,.25)", stroke: "#38bdf8" }, P.el);
      }
      P.curve(G.f);
      mount(stage, P.el);
      const exact = G.F(hi) - G.F(lo);
      out.innerHTML = `<div class="big-num">∫<sub>${lo}</sub><sup>${hi}</sup> ${G.name} dx = <b>${r3(exact)}</b></div><div class="steps">
        <div>Nyuton–Leybnits formulasi: ∫ₐᵇ f(x)dx = F(b) − F(a), bu yerda F(x) = ${G.Fs}</div>
        <div>F(${hi}) − F(${lo}) = ${r3(G.F(hi))} − ${r3(G.F(lo))} = <b>${r3(exact)}</b> — egri chiziqli trapetsiya yuzi.</div>
        <div>${n} ta to‘rtburchak yig‘indisi ≈ <b>${r3(rs)}</b>. To‘rtburchaklar ko‘paygan sari aniq javobga yaqinlashadi!</div></div>`;
    }
    controls.append(buttons(FS.map((x) => "f = " + x.name), (i) => { fi = i; render(); }));
    controls.append(
      slider({ label: "a", min: 0, max: 4, step: 0.5, value: a, fmt: (v) => num(v), onInput: (v) => { a = v; render(); } }),
      slider({ label: "b", min: 0, max: 4, step: 0.5, value: b, fmt: (v) => num(v), onInput: (v) => { b = v; render(); } }),
      slider({ label: "To‘rtburchaklar soni", min: 2, max: 40, value: n, onInput: (v) => { n = v; render(); } })
    );
    render();
  };

  // ---------- Oraliqlar usuli ----------
  W.signChart = (root, p) => {
    const rs = [-2, 1, 3];
    let count = 3;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const roots = rs.slice(0, count).slice().sort((a, b) => a - b);
      const el = svg(380, 120);
      const X = (v) => 190 + v * 30;
      s("line", { x1: 10, y1: 60, x2: 370, y2: 60, stroke: "#94a3b8", "stroke-width": 2 }, el);
      const pts = [-Infinity, ...roots, Infinity];
      let plus = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const lo = pts[i] === -Infinity ? -6 : pts[i], hi = pts[i + 1] === Infinity ? 6 : pts[i + 1];
        const mid = (lo + hi) / 2;
        const val = roots.reduce((m, r) => m * (mid - r), 1);
        const pos = val > 0;
        if (pos) plus.push([pts[i], pts[i + 1]]);
        s("text", { x: X(mid), y: 40, fill: pos ? "#22c55e" : "#f87171", "font-size": 22, "font-weight": 900, "text-anchor": "middle", text: pos ? "+" : "−" }, el);
        if (pos) s("line", { x1: X(Math.max(lo, -6)), y1: 60, x2: X(Math.min(hi, 6)), y2: 60, stroke: "#22c55e", "stroke-width": 5 }, el);
      }
      roots.forEach((r) => {
        s("circle", { cx: X(r), cy: 60, r: 6, fill: "#0b1220", stroke: "#fde047", "stroke-width": 2.5 }, el);
        s("text", { x: X(r), y: 88, fill: "#fde047", "font-size": 13, "font-weight": 800, "text-anchor": "middle", text: r }, el);
      });
      mount(stage, el);
      const show = (v) => (v === -Infinity ? "−∞" : v === Infinity ? "+∞" : v);
      out.innerHTML = `<div class="big-num">${roots.map((r) => `(x ${sgn(-r)} ${abs(r)})`).join("")} > 0</div><div class="steps">
        <div>1) Ildizlarni son o‘qiga qo‘yamiz: ${roots.join("; ")}.</div>
        <div>2) Eng o‘ng oraliqda ishora doim “+” (barcha qavslar musbat), keyin har bir ildizdan o‘tganda ishora almashadi.</div>
        <div>3) Javob (“+” oraliqlar): <b>${plus.map(([a, b]) => `(${show(a)}; ${show(b)})`).join(" ∪ ") || "yo‘q"}</b></div></div>`;
    }
    controls.append(buttons(["2 ta ildiz", "3 ta ildiz"], (i) => { count = i + 2; render(); }, 1));
    ["x₁", "x₂", "x₃"].forEach((l, i) => controls.append(slider({ label: l, min: -5, max: 5, value: rs[i], onInput: (v) => { rs[i] = v; render(); } })));
    render();
  };

  // ---------- Bo'linish belgilari va qoldiq ----------
  W.divCheck = (root, p) => {
    let n = 2346, d = 7;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const ds = String(n).split("").map(Number), sum = ds.reduce((a, b) => a + b, 0);
      const alt = ds.reverse().reduce((a, v, i) => a + (i % 2 ? -v : v), 0);
      const rules = [
        [2, n % 2 === 0, `oxirgi raqam ${n % 10} — ${n % 2 === 0 ? "juft" : "toq"}`],
        [3, sum % 3 === 0, `raqamlar yig‘indisi ${sum}`],
        [4, n % 4 === 0, `oxirgi ikki raqam ${String(n % 100).padStart(2, "0")}`],
        [5, n % 5 === 0, `oxirgi raqam ${n % 10}`],
        [9, sum % 9 === 0, `raqamlar yig‘indisi ${sum}`],
        [10, n % 10 === 0, `oxirgi raqam ${n % 10}`],
        [11, n % 11 === 0, `toq va juft o‘rindagi raqamlar ayirmasi ${alt}`]
      ];
      stage.innerHTML = `<div class="oq-chips">${rules.map(([k, ok, why]) => `<div class="oq-chip ${ok ? "ok" : "no"}"><b>${k} ga</b><span>${ok ? "✓ bo‘linadi" : "✗ bo‘linmaydi"}</span><small>${why}</small></div>`).join("")}</div>`;
      const q = Math.floor(n / d), r = n - q * d;
      out.innerHTML = `<div class="big-num">${n} = ${d} · ${q} + ${r}</div><div class="steps">
        <div>Qoldiqli bo‘lish: a = b·q + r, bunda 0 ≤ r < b. Bo‘linuvchi ${n}, bo‘luvchi ${d}, to‘liqsiz bo‘linma ${q}, qoldiq <b>${r}</b>.</div></div>`;
    }
    const inp = h("input", { type: "number", value: n, min: 1, max: 999999, class: "oq-input", "aria-label": "Son" });
    inp.addEventListener("input", () => { n = Math.max(1, Math.min(999999, Math.floor(+inp.value) || 1)); render(); });
    controls.append(h("label", { class: "ctl" }, h("span", {}, "Son"), inp));
    controls.append(slider({ label: "Bo‘luvchi", min: 2, max: 13, value: d, onInput: (v) => { d = v; render(); } }));
    render();
  };

  // ---------- Oxirgi raqam (davriylik) ----------
  W.lastDigit = (root, p) => {
    let a = 7, n = 23;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const cyc = [];
      let v = a % 10;
      while (!cyc.includes(v)) { cyc.push(v); v = (v * a) % 10; }
      const idx = (n - 1) % cyc.length;
      stage.innerHTML = `<div class="oq-cycle">${cyc.map((c, i) => `<span class="${i === idx ? "on" : ""}"><small>${a}<sup>${i + 1}</sup>→</small>${c}</span>`).join("")}</div>`;
      out.innerHTML = `<div class="big-num">${a}<sup>${n}</sup> ning oxirgi raqami: ${cyc[idx]}</div><div class="steps">
        <div>${a} ning darajalari oxirgi raqami <b>${cyc.length}</b> ta qadamda takrorlanadi: ${cyc.join(", ")}, …</div>
        <div>${n} ni ${cyc.length} ga bo‘lamiz: qoldiq ${n % cyc.length || cyc.length} → davrdagi ${idx + 1}-raqam = <b>${cyc[idx]}</b>.</div></div>`;
    }
    controls.append(slider({ label: "Asos", min: 2, max: 9, value: a, onInput: (v) => { a = v; render(); } }), slider({ label: "Daraja n", min: 1, max: 100, value: n, onInput: (v) => { n = v; render(); } }));
    render();
  };

  // ---------- Foiz ----------
  W.percentCalc = (root, p) => {
    let S = 1000000, pr = 10, yrs = 3;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const simple = S * (1 + (pr * yrs) / 100), comp = S * Math.pow(1 + pr / 100, yrs);
      const el = svg(380, 180);
      const mx = comp * 1.05;
      for (let i = 0; i <= yrs; i++) {
        const v = S * Math.pow(1 + pr / 100, i), u = S * (1 + (pr * i) / 100), bw = 340 / (yrs + 1);
        s("rect", { x: 20 + i * bw + 4, y: 160 - (u / mx) * 140, width: bw / 2 - 6, height: (u / mx) * 140, fill: "#38bdf8", rx: 4 }, el);
        s("rect", { x: 20 + i * bw + bw / 2, y: 160 - (v / mx) * 140, width: bw / 2 - 6, height: (v / mx) * 140, fill: "#22c55e", rx: 4 }, el);
        s("text", { x: 20 + i * bw + bw / 2, y: 176, fill: "#64748b", "font-size": 10, "text-anchor": "middle", text: `${i}-yil` }, el);
      }
      mount(stage, el);
      out.innerHTML = `<div class="steps">
        <div>${pr}% dan ${num(S)} so‘m: ${num(S)} · ${pr}/100 = <b>${num((S * pr) / 100)}</b> so‘m</div>
        <div><span style="color:#38bdf8">■ Oddiy foiz</span>: S(1 + p·n/100) = <b>${num(Math.round(simple))}</b> so‘m</div>
        <div><span style="color:#22c55e">■ Murakkab foiz</span>: S(1 + p/100)<sup>n</sup> = <b>${num(Math.round(comp))}</b> so‘m</div>
        <div>Narx ${pr}% oshib, keyin ${pr}% kamaysa: ${num(S)} · ${1 + pr / 100} · ${1 - pr / 100} = <b>${num(Math.round(S * (1 + pr / 100) * (1 - pr / 100)))}</b> — boshlang‘ichdan kam!</div></div>`;
    }
    controls.append(
      slider({ label: "Summa (so‘m)", min: 100000, max: 5000000, step: 100000, value: S, fmt: (v) => num(v), onInput: (v) => { S = v; render(); } }),
      slider({ label: "Foiz p (%)", min: 1, max: 50, value: pr, onInput: (v) => { pr = v; render(); } }),
      slider({ label: "Yillar n", min: 1, max: 10, value: yrs, onInput: (v) => { yrs = v; render(); } })
    );
    render();
  };

  // ---------- Uchburchak: kosinuslar teoremasi ----------
  W.triCalc = (root, p) => {
    let a = 5, b = 7, C = 60;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const g = (C * Math.PI) / 180;
      const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(g));
      const S = 0.5 * a * b * Math.sin(g);
      const k = 22, ox = 40, oy = 230;
      const A = [ox + b * k, oy], Bp = [ox + a * k * Math.cos(g), oy - a * k * Math.sin(g)];
      const sc = Math.min(1, 300 / Math.max(b * k, abs(Bp[0] - ox) + 10, 1), 210 / Math.max(1, oy - Bp[1]));
      const T = (pt) => [ox + (pt[0] - ox) * sc, oy - (oy - pt[1]) * sc];
      const [Ap, Bq, Cp] = [T(A), T(Bp), [ox, oy]];
      const el = svg(380, 250);
      s("polygon", { points: [Cp, Ap, Bq].map((q) => q.join(",")).join(" "), fill: "rgba(168,85,247,.18)", stroke: "#a855f7", "stroke-width": 3 }, el);
      s("text", { x: Cp[0] - 16, y: Cp[1] + 16, fill: "#fde047", "font-weight": 800, text: "C" }, el);
      s("text", { x: Ap[0] + 6, y: Ap[1] + 16, fill: "#fde047", "font-weight": 800, text: "A" }, el);
      s("text", { x: Bq[0] - 4, y: Bq[1] - 8, fill: "#fde047", "font-weight": 800, text: "B" }, el);
      s("text", { x: (Cp[0] + Ap[0]) / 2, y: Cp[1] + 18, fill: "#e2e8f0", text: `b = ${b}` }, el);
      s("text", { x: (Cp[0] + Bq[0]) / 2 - 40, y: (Cp[1] + Bq[1]) / 2, fill: "#e2e8f0", text: `a = ${a}` }, el);
      s("text", { x: (Ap[0] + Bq[0]) / 2 + 6, y: (Ap[1] + Bq[1]) / 2, fill: "#22c55e", "font-weight": 800, text: `c ≈ ${r2(c)}` }, el);
      s("text", { x: Cp[0] + 22, y: Cp[1] - 6, fill: "#fde047", "font-size": 12, text: `${C}°` }, el);
      mount(stage, el);
      const R = c / (2 * Math.sin(g));
      out.innerHTML = `<div class="big-num">c² = a² + b² − 2ab·cos C</div><div class="steps">
        <div>c² = ${a * a} + ${b * b} − 2·${a}·${b}·cos ${C}° = ${r2(c * c)} → c ≈ <b>${r2(c)}</b></div>
        <div>Yuzi: S = ½·a·b·sin C = <b>${r2(S)}</b></div>
        <div>Sinuslar teoremasi: c / sin C = 2R → tashqi chizilgan aylana radiusi R ≈ <b>${r2(R)}</b></div>
        ${C === 90 ? `<div>C = 90° → cos C = 0, kosinuslar teoremasi <b>Pifagor teoremasiga</b> aylanadi: c² = a² + b².</div>` : ""}</div>`;
    }
    controls.append(
      slider({ label: "a", min: 1, max: 10, value: a, onInput: (v) => { a = v; render(); } }),
      slider({ label: "b", min: 1, max: 10, value: b, onInput: (v) => { b = v; render(); } }),
      slider({ label: "C burchak (°)", min: 10, max: 170, step: 5, value: C, onInput: (v) => { C = v; render(); } })
    );
    render();
  };

  // ---------- Aylana va doira ----------
  W.circleCalc = (root, p) => {
    let R = 5, al = 90;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const el = svg(300, 260), cx = 150, cy = 130, rr = 100;
      const g = (al * Math.PI) / 180;
      s("circle", { cx, cy, r: rr, fill: "rgba(56,189,248,.08)", stroke: "#38bdf8", "stroke-width": 2 }, el);
      const x2 = cx + rr * Math.cos(-g), y2 = cy + rr * Math.sin(-g);
      s("path", { d: `M${cx},${cy} L${cx + rr},${cy} A${rr},${rr} 0 ${al > 180 ? 1 : 0} 0 ${x2},${y2} Z`, fill: "rgba(34,197,94,.3)", stroke: "#22c55e", "stroke-width": 2 }, el);
      s("line", { x1: cx + rr, y1: cy, x2, y2, stroke: "#fde047", "stroke-width": 2, "stroke-dasharray": "5 4" }, el);
      s("text", { x: cx + 20, y: cy - 8, fill: "#fde047", "font-size": 12, "font-weight": 800, text: `${al}°` }, el);
      s("text", { x: cx + rr / 2 - 10, y: cy + 16, fill: "#e2e8f0", "font-size": 12, text: `R = ${R}` }, el);
      mount(stage, el);
      const L = 2 * Math.PI * R, Sd = Math.PI * R * R, l = (Math.PI * R * al) / 180, Ss = (Math.PI * R * R * al) / 360;
      const Sseg = Ss - 0.5 * R * R * Math.sin(g);
      out.innerHTML = `<div class="steps">
        <div>Aylana uzunligi: C = 2πR = <b>${r2(L)}</b> (≈ ${2 * R}π)</div>
        <div>Doira yuzi: S = πR² = <b>${r2(Sd)}</b> (= ${R * R}π)</div>
        <div><span style="color:#22c55e">Yoy uzunligi</span>: l = πRα/180° = <b>${r2(l)}</b></div>
        <div><span style="color:#22c55e">Sektor yuzi</span>: S = πR²α/360° = <b>${r2(Ss)}</b></div>
        <div>Segment yuzi: S<sub>sektor</sub> − ½R²·sin α = <b>${r2(Sseg)}</b></div>
        <div>Vatar (sariq) uzunligi: 2R·sin(α/2) = <b>${r2(2 * R * Math.sin(g / 2))}</b></div></div>`;
    }
    controls.append(
      slider({ label: "Radius R", min: 1, max: 10, value: R, onInput: (v) => { R = v; render(); } }),
      slider({ label: "Markaziy burchak α (°)", min: 10, max: 350, step: 10, value: al, onInput: (v) => { al = v; render(); } })
    );
    render();
  };

  // ---------- Vektorlar ----------
  W.vectors = (root, p) => {
    const v = { ax: 3, ay: 1, bx: 1, by: 3 };
    const { stage, controls, out } = frame(root, p.title);
    function arrow(P, x1, y1, x2, y2, color, label) {
      const X1 = P.X(x1), Y1 = P.Y(y1), X2 = P.X(x2), Y2 = P.Y(y2);
      const ang = Math.atan2(Y2 - Y1, X2 - X1);
      s("line", { x1: X1, y1: Y1, x2: X2, y2: Y2, stroke: color, "stroke-width": 3 }, P.el);
      s("polygon", { points: `${X2},${Y2} ${X2 - 12 * Math.cos(ang - 0.4)},${Y2 - 12 * Math.sin(ang - 0.4)} ${X2 - 12 * Math.cos(ang + 0.4)},${Y2 - 12 * Math.sin(ang + 0.4)}`, fill: color }, P.el);
      if (label) s("text", { x: X2 + 6, y: Y2 - 6, fill: color, "font-weight": 800, text: label }, P.el);
    }
    function render() {
      const P = plane({ xmin: -6, xmax: 8, ymin: -5, ymax: 8 });
      const sx = v.ax + v.bx, sy = v.ay + v.by;
      arrow(P, 0, 0, v.ax, v.ay, "#22c55e", "a");
      arrow(P, 0, 0, v.bx, v.by, "#38bdf8", "b");
      s("line", { x1: P.X(v.ax), y1: P.Y(v.ay), x2: P.X(sx), y2: P.Y(sy), stroke: "#38bdf8", "stroke-dasharray": "4 4", opacity: 0.6 }, P.el);
      arrow(P, 0, 0, sx, sy, "#fde047", "a+b");
      mount(stage, P.el);
      const la = Math.hypot(v.ax, v.ay), lb = Math.hypot(v.bx, v.by), dot = v.ax * v.bx + v.ay * v.by;
      const cos = la && lb ? dot / (la * lb) : 0;
      const coll = v.ax * v.by - v.ay * v.bx === 0;
      out.innerHTML = `<div class="steps">
        <div>a(${v.ax}; ${v.ay}), b(${v.bx}; ${v.by}) → a + b = (<b>${sx}; ${sy}</b>)</div>
        <div>|a| = √(${v.ax}² + ${v.ay}²) = <b>${r3(la)}</b>, &nbsp; |b| = <b>${r3(lb)}</b></div>
        <div>Skalyar ko‘paytma: a·b = x₁x₂ + y₁y₂ = <b>${dot}</b> ${dot === 0 ? "→ vektorlar <b>perpendikulyar</b>!" : ""}</div>
        <div>cos φ = a·b / (|a|·|b|) = ${r3(cos)} → φ ≈ <b>${r2((Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI)}°</b></div>
        <div>${coll ? "x₁/x₂ = y₁/y₂ → vektorlar <b>kollinear</b>." : "Kollinear emas (x₁·y₂ ≠ x₂·y₁)."}</div></div>`;
    }
    [["a: x", "ax"], ["a: y", "ay"], ["b: x", "bx"], ["b: y", "by"]].forEach(([l, k]) => controls.append(slider({ label: l, min: -4, max: 5, value: v[k], onInput: (x) => { v[k] = x; render(); } })));
    render();
  };

  // ---------- Fazoviy jismlar ----------
  W.solid = (root, p) => {
    let kind = p.kind || "cylinder", R = 3, H = 5;
    const KINDS = ["cube", "prism", "pyramid", "cylinder", "cone", "sphere"];
    const NAMES = { cube: "Kub", prism: "To‘g‘ri prizma (kvadrat asos)", pyramid: "Muntazam piramida (kvadrat asos)", cylinder: "Silindr", cone: "Konus", sphere: "Shar" };
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const el = svg(320, 260), cx = 160, k = 18;
      const r = R * k, hh = (kind === "cube" ? R : H) * k, ry = r * 0.3;
      const base = 220;
      const st = { fill: "rgba(249,115,22,.18)", stroke: "#f97316", "stroke-width": 2.5 };
      const dash = { stroke: "#f97316", "stroke-width": 1.5, "stroke-dasharray": "5 4", fill: "none" };
      if (kind === "cylinder" || kind === "cone") {
        s("ellipse", { cx, cy: base, rx: r, ry, ...st }, el);
        if (kind === "cylinder") {
          s("rect", { x: cx - r, y: base - hh, width: 2 * r, height: hh, fill: "rgba(249,115,22,.12)", stroke: "none" }, el);
          s("line", { x1: cx - r, y1: base, x2: cx - r, y2: base - hh, stroke: "#f97316", "stroke-width": 2.5 }, el);
          s("line", { x1: cx + r, y1: base, x2: cx + r, y2: base - hh, stroke: "#f97316", "stroke-width": 2.5 }, el);
          s("ellipse", { cx, cy: base - hh, rx: r, ry, ...st }, el);
        } else {
          s("polygon", { points: `${cx - r},${base} ${cx + r},${base} ${cx},${base - hh}`, fill: "rgba(249,115,22,.12)", stroke: "#f97316", "stroke-width": 2.5 }, el);
          s("line", { x1: cx, y1: base, x2: cx, y2: base - hh, ...dash }, el);
        }
        s("line", { x1: cx, y1: base, x2: cx + r, y2: base, stroke: "#fde047", "stroke-width": 2 }, el);
      } else if (kind === "sphere") {
        s("circle", { cx, cy: 130, r, ...st }, el);
        s("ellipse", { cx, cy: 130, rx: r, ry, ...dash }, el);
        s("line", { x1: cx, y1: 130, x2: cx + r, y2: 130, stroke: "#fde047", "stroke-width": 2 }, el);
      } else {
        const a = r * 1.4, d = a * 0.45;
        const P = [[cx - a / 2 - d / 2, base], [cx + a / 2 - d / 2, base], [cx + a / 2 + d / 2, base - d * 0.7], [cx - a / 2 + d / 2, base - d * 0.7]];
        s("polygon", { points: P.map((q) => q.join(",")).join(" "), ...st }, el);
        if (kind === "pyramid") {
          const top = [cx, base - hh];
          P.forEach((q) => s("line", { x1: q[0], y1: q[1], x2: top[0], y2: top[1], stroke: "#f97316", "stroke-width": 2.5 }, el));
        } else {
          const T = P.map((q) => [q[0], q[1] - hh]);
          s("polygon", { points: T.map((q) => q.join(",")).join(" "), ...st }, el);
          P.forEach((q, i) => s("line", { x1: q[0], y1: q[1], x2: T[i][0], y2: T[i][1], stroke: "#f97316", "stroke-width": 2.5 }, el));
        }
      }
      mount(stage, el);
      const pi = Math.PI;
      let V, Sfull, extra = "", f = "";
      if (kind === "cube") { V = R ** 3; Sfull = 6 * R * R; f = `V = a³ = ${R}³, &nbsp; S = 6a²`; extra = `Diagonal: d = a√3 ≈ ${r2(R * Math.sqrt(3))}`; }
      if (kind === "prism") { V = R * R * H; Sfull = 2 * R * R + 4 * R * H; f = `V = S<sub>asos</sub>·h = ${R}²·${H}, &nbsp; S = 2S<sub>asos</sub> + P·h`; extra = `Diagonal: √(a² + a² + h²) ≈ ${r2(Math.sqrt(2 * R * R + H * H))}`; }
      if (kind === "pyramid") { V = (R * R * H) / 3; const ap = Math.sqrt(H * H + (R / 2) ** 2); Sfull = R * R + 2 * R * ap; f = `V = ⅓·S<sub>asos</sub>·h, &nbsp; S = S<sub>asos</sub> + ½·P·apofema`; extra = `Apofema = √(h² + (a/2)²) ≈ ${r2(ap)}`; }
      if (kind === "cylinder") { V = pi * R * R * H; Sfull = 2 * pi * R * (R + H); f = `V = πR²h, &nbsp; S = 2πR(R + h)`; extra = `Yon sirt: 2πRh ≈ ${r2(2 * pi * R * H)}`; }
      if (kind === "cone") { const l = Math.hypot(R, H); V = (pi * R * R * H) / 3; Sfull = pi * R * (R + l); f = `V = ⅓πR²h, &nbsp; S = πR(R + l)`; extra = `Yasovchi l = √(R² + h²) ≈ ${r2(l)}`; }
      if (kind === "sphere") { V = (4 / 3) * pi * R ** 3; Sfull = 4 * pi * R * R; f = `V = ⁴⁄₃πR³, &nbsp; S = 4πR²`; extra = `Katta doira yuzi: πR² ≈ ${r2(pi * R * R)}`; }
      out.innerHTML = `<div class="big-num">${NAMES[kind]}</div><div class="steps"><div>${f}</div>
        <div>Hajm V ≈ <b>${r2(V)}</b> &nbsp; · &nbsp; To‘la sirt S ≈ <b>${r2(Sfull)}</b></div><div>${extra}</div></div>`;
      hctl.style.display = kind === "cube" || kind === "sphere" ? "none" : "";
    }
    if (!p.kind) controls.append(buttons(KINDS.map((k) => NAMES[k].split(" ")[0]), (i) => { kind = KINDS[i]; render(); }, KINDS.indexOf(kind)));
    controls.append(slider({ label: kind === "cube" ? "Qirra a" : kind === "prism" || kind === "pyramid" ? "Asos tomoni a" : "Radius R", min: 1, max: 6, value: R, onInput: (v) => { R = v; render(); } }));
    const hctl = slider({ label: "Balandlik h", min: 1, max: 9, value: H, onInput: (v) => { H = v; render(); } });
    controls.append(hctl);
    render();
  };

  // ---------- Harakat masalasi ----------
  W.motion = (root, p) => {
    let v1 = 60, v2 = 40, S = 300;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const t = S / (v1 + v2), meet = v1 * t;
      const el = svg(380, 110);
      s("line", { x1: 20, y1: 60, x2: 360, y2: 60, stroke: "#475569", "stroke-width": 6, "stroke-linecap": "round" }, el);
      const mx = 20 + (meet / S) * 340;
      s("text", { x: 14, y: 46, "font-size": 26, text: "🚗" }, el);
      s("text", { x: 340, y: 46, "font-size": 26, text: "🚌" }, el);
      s("line", { x1: mx, y1: 40, x2: mx, y2: 80, stroke: "#fde047", "stroke-width": 3 }, el);
      s("text", { x: mx, y: 100, fill: "#fde047", "font-size": 12, "font-weight": 800, "text-anchor": "middle", text: `uchrashuv: ${r2(meet)} km` }, el);
      mount(stage, el);
      out.innerHTML = `<div class="big-num">S = v · t</div><div class="steps">
        <div>Qarama-qarshi harakatda yaqinlashish tezligi: v₁ + v₂ = ${v1} + ${v2} = <b>${v1 + v2}</b> km/soat</div>
        <div>Uchrashish vaqti: t = S / (v₁ + v₂) = ${S} / ${v1 + v2} = <b>${r2(t)}</b> soat</div>
        <div>Bir tomonga harakatda (quvib yetish): t = S / (v₁ − v₂) = ${v1 > v2 ? `<b>${r2(S / (v1 - v2))}</b> soat` : "v₁ > v₂ bo‘lishi kerak"}</div></div>`;
    }
    controls.append(
      slider({ label: "v₁ (km/soat)", min: 10, max: 120, step: 5, value: v1, onInput: (v) => { v1 = v; render(); } }),
      slider({ label: "v₂ (km/soat)", min: 10, max: 120, step: 5, value: v2, onInput: (v) => { v2 = v; render(); } }),
      slider({ label: "Masofa S (km)", min: 50, max: 600, step: 10, value: S, onInput: (v) => { S = v; render(); } })
    );
    render();
  };

  // ---------- Aralashma ----------
  W.mixture = (root, p) => {
    let m1 = 200, c1 = 10, m2 = 300, c2 = 40;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const c = (m1 * c1 + m2 * c2) / (m1 + m2);
      stage.innerHTML = `<div class="oq-mix">
        <div class="jar"><i style="height:${c1}%"></i><b>${m1} g</b><small>${c1}%</small></div><span>+</span>
        <div class="jar"><i style="height:${c2}%"></i><b>${m2} g</b><small>${c2}%</small></div><span>=</span>
        <div class="jar big"><i style="height:${c}%"></i><b>${m1 + m2} g</b><small>${r2(c)}%</small></div></div>`;
      out.innerHTML = `<div class="steps">
        <div>Sof modda: ${m1}·${c1}% + ${m2}·${c2}% = ${r2((m1 * c1) / 100)} + ${r2((m2 * c2) / 100)} = <b>${r2((m1 * c1 + m2 * c2) / 100)}</b> g</div>
        <div>Yangi konsentratsiya: ${r2((m1 * c1 + m2 * c2) / 100)} / ${m1 + m2} · 100% = <b>${r2(c)}%</b></div>
        <div>Qoida: aralashma foizi doim ikki foiz <b>orasida</b> bo‘ladi va ko‘p massali tomonga yaqinroq.</div></div>`;
    }
    controls.append(
      slider({ label: "1-eritma (g)", min: 50, max: 1000, step: 50, value: m1, onInput: (v) => { m1 = v; render(); } }),
      slider({ label: "1-eritma (%)", min: 0, max: 100, step: 5, value: c1, onInput: (v) => { c1 = v; render(); } }),
      slider({ label: "2-eritma (g)", min: 50, max: 1000, step: 50, value: m2, onInput: (v) => { m2 = v; render(); } }),
      slider({ label: "2-eritma (%)", min: 0, max: 100, step: 5, value: c2, onInput: (v) => { c2 = v; render(); } })
    );
    render();
  };
  // ---------- To'plamlar: Eyler–Venn ----------
  W.venn = (root, p) => {
    let A = 18, B = 15, AB = 6, U = 30;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      AB = Math.min(AB, A, B);
      const uni = A + B - AB, none = Math.max(0, U - uni);
      const el = svg(360, 220);
      s("rect", { x: 6, y: 6, width: 348, height: 208, rx: 16, fill: "rgba(148,163,184,.06)", stroke: "#475569" }, el);
      s("text", { x: 18, y: 26, fill: "#94a3b8", "font-weight": 800, text: `U = ${U}` }, el);
      const d = 70 - Math.min(60, (AB / Math.max(1, Math.min(A, B))) * 60);
      s("circle", { cx: 180 - 30 - d / 2, cy: 115, r: 70, fill: "rgba(34,197,94,.25)", stroke: "#22c55e", "stroke-width": 2.5 }, el);
      s("circle", { cx: 180 + 30 + d / 2, cy: 115, r: 70, fill: "rgba(56,189,248,.25)", stroke: "#38bdf8", "stroke-width": 2.5 }, el);
      s("text", { x: 180 - 70 - d / 2, y: 120, fill: "#e2e8f0", "font-size": 20, "font-weight": 900, "text-anchor": "middle", text: A - AB }, el);
      s("text", { x: 180, y: 120, fill: "#fde047", "font-size": 20, "font-weight": 900, "text-anchor": "middle", text: AB }, el);
      s("text", { x: 180 + 70 + d / 2, y: 120, fill: "#e2e8f0", "font-size": 20, "font-weight": 900, "text-anchor": "middle", text: B - AB }, el);
      s("text", { x: 90, y: 205, fill: "#22c55e", "font-weight": 800, text: "A" }, el);
      s("text", { x: 262, y: 205, fill: "#38bdf8", "font-weight": 800, text: "B" }, el);
      s("text", { x: 330, y: 26, fill: "#94a3b8", "text-anchor": "end", text: `hech biri: ${none}` }, el);
      mount(stage, el);
      out.innerHTML = `<div class="big-num">n(A ∪ B) = n(A) + n(B) − n(A ∩ B)</div><div class="steps">
        <div>${A} + ${B} − ${AB} = <b>${uni}</b> ta element kamida bitta to‘plamda.</div>
        <div>Faqat A da: ${A} − ${AB} = <b>${A - AB}</b>; faqat B da: <b>${B - AB}</b>; ikkalasida: <b>${AB}</b>.</div>
        <div>Hech qaysi birida emas: ${U} − ${uni} = <b>${none}</b>${uni > U ? " ⚠️ (U juda kichik!)" : ""}</div>
        <div>Masalan: sinfda ${U} o‘quvchi, ${A} tasi futbolga, ${B} tasi shaxmatga qatnaydi, ${AB} tasi ikkalasiga.</div></div>`;
    }
    [["n(A)", () => A, (v) => (A = v), 0, 30], ["n(B)", () => B, (v) => (B = v), 0, 30], ["n(A ∩ B)", () => AB, (v) => (AB = v), 0, 30], ["n(U)", () => U, (v) => (U = v), 10, 60]]
      .forEach(([l, g, st, mn, mx]) => controls.append(slider({ label: l, min: mn, max: mx, value: g(), onInput: (v) => { st(v); render(); } })));
    render();
  };

  // ---------- Kombinatorika ----------
  const fact = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  W.combi = (root, p) => {
    let n = 5, k = 3;
    const ITEMS = ["🍎", "🍐", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝"];
    const { stage, controls, out } = frame(root, p.title);
    function combos(arr, k) { const res = []; const go = (st, cur) => { if (cur.length === k) { res.push(cur.slice()); return; } for (let i = st; i < arr.length; i++) { cur.push(arr[i]); go(i + 1, cur); cur.pop(); } }; go(0, []); return res; }
    function render() {
      k = Math.min(k, n);
      const P = fact(n), A = fact(n) / fact(n - k), C = A / fact(k);
      const list = combos(ITEMS.slice(0, n), k);
      stage.innerHTML = `<div class="oq-combi"><div class="row">${ITEMS.slice(0, n).map((x) => `<span>${x}</span>`).join("")}</div>
        <small>${n} ta mevadan ${k} tasini tanlash usullari (tartib muhim emas): ${C} ta</small>
        <div class="grid">${list.slice(0, 40).map((c) => `<i>${c.join("")}</i>`).join("")}${list.length > 40 ? `<i>… yana ${list.length - 40}</i>` : ""}</div></div>`;
      out.innerHTML = `<div class="steps">
        <div><b>O‘rin almashtirish</b> (barchasini tartiblash): P<sub>${n}</sub> = ${n}! = <b>${P}</b></div>
        <div><b>O‘rinlashtirish</b> (k tasini tanlab, tartiblab): A<sub>${n}</sub><sup>${k}</sup> = n!/(n−k)! = <b>${A}</b></div>
        <div><b>Guruhlash</b> (k tasini tanlash, tartib muhim emas): C<sub>${n}</sub><sup>${k}</sup> = n!/(k!(n−k)!) = <b>${C}</b></div>
        <div>Bog‘lanish: A = C · k! → ${A} = ${C} · ${fact(k)}</div></div>`;
    }
    controls.append(
      slider({ label: "n (jami)", min: 1, max: 8, value: n, onInput: (v) => { n = v; render(); } }),
      slider({ label: "k (tanlanadi)", min: 0, max: 8, value: k, onInput: (v) => { k = v; render(); } })
    );
    render();
  };

  // ---------- Ehtimollik: tajriba ----------
  W.probability = (root, p) => {
    let mode = p.mode || "dice", counts = [], total = 0, target = 6;
    const { stage, controls, out } = frame(root, p.title);
    const faces = () => (mode === "dice" ? 6 : 2);
    function reset() { counts = Array(faces()).fill(0); total = 0; render(); }
    function roll(n) { for (let i = 0; i < n; i++) { counts[(Math.random() * faces()) | 0]++; total++; } render(); }
    function render() {
      const F = faces(), mx = Math.max(1, ...counts);
      const labels = mode === "dice" ? ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"] : ["Gerb", "Raqam"];
      const el = svg(360, 190);
      const bw = 320 / F;
      s("line", { x1: 20, y1: 160 - 140 / F * (F === 6 ? 1 : 1), x2: 340, y2: 160 - 140 / F, stroke: "transparent" }, el);
      counts.forEach((c, i) => {
        const hh = (c / mx) * 130;
        s("rect", { x: 20 + i * bw + 6, y: 160 - hh, width: bw - 12, height: hh, rx: 6, fill: i === (mode === "dice" ? target - 1 : 0) ? "#fde047" : "#38bdf8" }, el);
        s("text", { x: 20 + i * bw + bw / 2, y: 154 - hh, fill: "#e2e8f0", "font-size": 11, "text-anchor": "middle", text: total ? `${r2((c / total) * 100)}%` : "" }, el);
        s("text", { x: 20 + i * bw + bw / 2, y: 182, fill: "#e2e8f0", "font-size": mode === "dice" ? 22 : 13, "text-anchor": "middle", text: labels[i] }, el);
      });
      mount(stage, el);
      const fav = mode === "dice" ? counts[target - 1] : counts[0];
      out.innerHTML = `<div class="steps">
        <div>Klassik ehtimollik: P = <b>qulay hollar / barcha hollar</b> = 1/${F} ≈ <b>${r3(1 / F)}</b></div>
        <div>Tajribada: ${total} ta tashlashdan ${fav} ta → nisbiy chastota ≈ <b>${total ? r3(fav / total) : "—"}</b></div>
        <div>Tashlashlar ko‘paygan sari chastota nazariy ehtimollikka yaqinlashadi (katta sonlar qonuni).</div></div>`;
    }
    controls.append(buttons(["🎲 Kubik", "🪙 Tanga"], (i) => { mode = i ? "coin" : "dice"; reset(); }, mode === "dice" ? 0 : 1));
    controls.append(buttons(["1 marta", "10 marta", "100 marta", "1000 marta", "↺ Qayta"], (i) => { if (i === 4) reset(); else roll([1, 10, 100, 1000][i]); }, -1));
    reset();
  };

  // ---------- Statistika ----------
  W.stats = (root, p) => {
    let data = (p.data || [5, 3, 4, 5, 2, 5, 4, 3, 5, 4]).slice();
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const n = data.length, sorted = data.slice().sort((a, b) => a - b);
      const mean = data.reduce((a, b) => a + b, 0) / n;
      const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      const freq = {}; data.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
      const mf = Math.max(...Object.values(freq)), modes = Object.keys(freq).filter((k) => freq[k] === mf);
      const disp = data.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
      stage.innerHTML = `<div class="oq-data">${data.map((v, i) => `<button type="button" data-i="${i}" title="O‘chirish">${v}</button>`).join("")}</div>
        <div class="oq-hist">${Object.keys(freq).sort((a, b) => a - b).map((k) => `<div><i style="height:${(freq[k] / mf) * 80}px"></i><b>${k}</b><small>${freq[k]} ta</small></div>`).join("")}</div>`;
      stage.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { if (data.length > 2) { data.splice(+b.dataset.i, 1); render(); } }));
      out.innerHTML = `<div class="steps">
        <div>Tartiblangan qator: ${sorted.join(", ")} (n = ${n})</div>
        <div><b>O‘rta arifmetik</b>: yig‘indi / n = ${data.reduce((a, b) => a + b, 0)} / ${n} = <b>${r2(mean)}</b></div>
        <div><b>Mediana</b> (o‘rtadagi qiymat): <b>${med}</b></div>
        <div><b>Moda</b> (eng ko‘p uchraydigan): <b>${modes.join(", ")}</b> (${mf} marta)</div>
        <div><b>Kenglik</b>: ${sorted[n - 1]} − ${sorted[0]} = <b>${sorted[n - 1] - sorted[0]}</b>, &nbsp; <b>dispersiya</b> ≈ <b>${r2(disp)}</b>, standart chetlanish ≈ <b>${r2(Math.sqrt(disp))}</b></div></div>`;
    }
    const inp = h("input", { type: "number", class: "oq-input", value: 4, "aria-label": "Qiymat" });
    controls.append(h("label", { class: "ctl" }, h("span", {}, "Yangi qiymat (sonni bosib o‘chirish mumkin)"), inp));
    controls.append(buttons(["＋ Qo‘shish", "Tasodifiy 10 ta baho"], (i) => {
      if (i === 0) { const v = Number(inp.value); if (isFinite(v)) { data.push(v); render(); } }
      else { data = Array.from({ length: 10 }, () => 2 + ((Math.random() * 4) | 0)); render(); }
    }, -1));
    render();
  };
})();
