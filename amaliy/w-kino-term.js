/* Kinoviy issiqlik va to'lqin tajribalari (KINO dvigatelida): gaz porsheni (izojarayonlar, p–V), molekulalar
   (Maksvell taqsimoti, Broun harakati), kalorimetr (aralashtirish / yoqilg'i), to'rt taktli dvigatel (p–V sikl),
   to'lqinlar va tovush, Bernulli qonuni. Eski versiyalar (w-fizika2.js) shu fayl orqali almashtiriladi. */
(() => {
  "use strict";
  const { h, slider, buttons, button, W } = window.AK;
  const K = window.KINO;
  if (!K) return;
  const { C, r } = K;
  const PI = Math.PI, RG = 8.314;
  const push = (arr, p, max = 1500) => { arr.push(p); if (arr.length > max) arr.shift(); };
  const hot = (k) => `hsl(${Math.round(220 - Math.max(0, Math.min(1, k)) * 220)} 85% 52%)`;
  function thermo(S, x0, y0, hgt, T, Tmin, Tmax, lab) { // termometr
    const x = S.x, k = Math.max(0, Math.min(1, (T - Tmin) / (Tmax - Tmin)));
    x.fillStyle = "#fff"; x.strokeStyle = C.ink; x.lineWidth = 1.2; x.beginPath(); x.roundRect ? x.roundRect(x0 - 6, y0 - hgt, 12, hgt, 6) : x.rect(x0 - 6, y0 - hgt, 12, hgt); x.fill(); x.stroke();
    x.fillStyle = "#dc2626"; x.fillRect(x0 - 3, y0 - 6 - (hgt - 14) * k, 6, (hgt - 14) * k + 6); x.beginPath(); x.arc(x0, y0 + 4, 9, 0, 7); x.fill(); x.stroke();
    if (lab) S.text(lab, x0, y0 + 26, { size: 11, c: "#b91c1c", halo: true });
  }
  function flame(S, cx, cy, s, t) { const x = S.x; if (s <= 0.02) return; for (let i = 0; i < 3; i++) { const w = (12 + i * 5) * s, hh = (26 + Math.sin(t * 17 + i) * 4) * s * (1 - i * 0.18);
    x.fillStyle = ["rgba(250,204,21,.85)", "rgba(249,115,22,.7)", "rgba(37,99,235,.55)"][i]; x.beginPath(); x.moveTo(cx - w / 2, cy); x.quadraticCurveTo(cx - w / 2, cy - hh * 0.6, cx, cy - hh); x.quadraticCurveTo(cx + w / 2, cy - hh * 0.6, cx + w / 2, cy); x.closePath(); x.fill(); } }

  // ===================================================================
  // 1. GAZ PORSHENI — izojarayonlar, p–V diagramma, birinchi qonun
  // ===================================================================
  W.gasPiston = (root, p) => {
    const S = K.scene(root, { title: p.title || "🎈 Ideal gaz porshen ostida: molekulalar devorga uriladi", aspect: 0.58, aspectMobile: 1.0,
      tip: "👆 Porshenni sudrab gazni siqing yoki kengaytiring", slow: false });
    const x = S.x, n = 0.1, CV = 1.5 * RG;
    const st = { mode: p.mode || "free", T: 300, V: 2, heat: 0, trace: [], P: [], hits: 0, hitRate: 0, drag: false, U0: 0, A: 0, Q: 0, V0: 2, T0: 300 };
    const pres = () => (n * RG * st.T) / (st.V / 1000) / 1000; // kPa
    const mkP = () => (st.P = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), a: Math.random() * 7, s: 0.6 + Math.random() * 0.8 })));
    mkP();
    const reset = () => { st.trace = []; st.A = 0; st.Q = 0; st.V0 = st.V; st.T0 = st.T; S.t = 0; info(); };
    const geo = () => { const m = S.W < 560, cx = m ? S.W * 0.3 : S.W * 0.24, w = Math.min(150, S.W * 0.22), bot = S.H - 70, Vmax = 4.4, hmax = S.H - 140; return { cx, w, bot, top: bot - (st.V / Vmax) * hmax, hmax, Vmax }; };
    S.step = (dt) => {
      const T1 = st.T, V1 = st.V;
      if (st.mode === "iso-p") { const dT = st.heat * 60 * dt; st.T = Math.max(150, Math.min(900, st.T + dT)); st.V = Math.max(0.6, Math.min(4.3, (n * RG * st.T) / (pres0 * 1000) * 1000)); }
      else if (st.mode === "iso-V") { st.T = Math.max(150, Math.min(900, st.T + st.heat * 60 * dt)); }
      const pk = pres();
      const dV = (st.V - V1) / 1000, dU = n * CV * (st.T - T1);
      st.A += pk * 1000 * dV; st.Q += dU + pk * 1000 * dV;
      // molekulalar
      const sp = Math.sqrt(st.T / 300) * 0.9;
      st.P.forEach((q) => { q.x += Math.cos(q.a) * sp * q.s * dt; q.y += Math.sin(q.a) * sp * q.s * dt * (2 / Math.max(0.6, st.V));
        if (q.x < 0 || q.x > 1) { q.a = PI - q.a; q.x = Math.max(0, Math.min(1, q.x)); }
        if (q.y < 0) { q.a = -q.a; q.y = 0; } if (q.y > 1) { q.a = -q.a; q.y = 1; st.hits++; } });
      if (S.frame % 3 === 0 && (!st.trace.length || Math.abs(st.trace[st.trace.length - 1][0] - st.V) > 0.01 || Math.abs(st.trace[st.trace.length - 1][1] - pk) > 0.5)) push(st.trace, [st.V, pk], 600);
    };
    let pres0 = pres();
    S.draw = (real) => {
      S.bg(); const g = geo(), pk = pres(), m = S.W < 560;
      st.hitRate += ((st.hits / Math.max(1e-3, real)) - st.hitRate) * 0.05; st.hits = 0;
      // stol va gorelka
      S.hatch(g.cx - g.w, S.H - 22, g.cx + g.w, S.H - 22);
      flame(S, g.cx, g.bot + 40, st.heat > 0 ? 0.6 + st.heat : 0, S.t);
      if (st.heat < 0) { S.text("❄", g.cx, g.bot + 36, { size: 22, italic: false, c: "#0284c7" }); }
      // silindr
      x.fillStyle = "rgba(186,230,253,.35)"; x.fillRect(g.cx - g.w / 2, g.top, g.w, g.bot - g.top);
      x.strokeStyle = C.ink; x.lineWidth = 3; x.beginPath(); x.moveTo(g.cx - g.w / 2 - 2, g.bot - g.hmax - 20); x.lineTo(g.cx - g.w / 2 - 2, g.bot + 2); x.lineTo(g.cx + g.w / 2 + 2, g.bot + 2); x.lineTo(g.cx + g.w / 2 + 2, g.bot - g.hmax - 20); x.stroke();
      // molekulalar
      const kT = (st.T - 150) / 750;
      st.P.forEach((q) => { x.fillStyle = hot(kT * (0.6 + q.s * 0.5)); x.beginPath(); x.arc(g.cx - g.w / 2 + 6 + q.x * (g.w - 12), g.bot - 6 - (1 - q.y) * (g.bot - g.top - 12), 3.4, 0, 7); x.fill(); });
      // porshen
      x.fillStyle = "#64748b"; x.fillRect(g.cx - g.w / 2, g.top - 14, g.w, 14); x.fillStyle = "#475569"; x.fillRect(g.cx - 6, g.top - 70, 12, 56);
      if (st.mode === "iso-p") { x.fillStyle = "#334155"; x.fillRect(g.cx - 26, g.top - 96, 52, 26); S.text("yuk", g.cx, g.top - 79, { size: 10, c: "#fff", italic: false, font: K.SANS }); }
      if (st.mode === "iso-V") { x.fillStyle = C.red; x.fillRect(g.cx - g.w / 2 - 10, g.top - 18, 8, 22); x.fillRect(g.cx + g.w / 2 + 2, g.top - 18, 8, 22); S.text("qotirilgan", g.cx + g.w / 2 + 14, g.top - 4, { size: 10, align: "left", c: C.red, bold: false }); }
      S.arrow(g.cx + g.w / 2 + 26, g.top + 10, g.cx + g.w / 2 + 26, g.top + 10 - Math.min(60, 10 + pk / 12), C.g, "pS", { fs: 11 });
      // termometr va manometr
      thermo(S, g.cx + g.w / 2 + 60, g.bot - 10, Math.min(150, g.hmax * 0.6), st.T, 150, 900, `${Math.round(st.T)} K`);
      const mx = m ? S.W * 0.72 : g.cx + g.w / 2 + 120, my = 86, kp = Math.min(1, pk / 1500), a = -PI * 0.85 + kp * PI * 0.7;
      x.fillStyle = "#fafaf9"; x.strokeStyle = C.ink; x.lineWidth = 1.5; x.beginPath(); x.arc(mx, my, 28, 0, 7); x.fill(); x.stroke();
      x.strokeStyle = C.red; x.lineWidth = 2; x.beginPath(); x.moveTo(mx, my + 6); x.lineTo(mx + Math.cos(a) * 22, my + 6 + Math.sin(a) * 22); x.stroke();
      S.text(`${r(pk, 0)} kPa`, mx, my + 46, { size: 12, c: C.red, halo: true }); S.text("manometr", mx, my - 34, { size: 9, c: C.sub, bold: false, italic: false, font: K.SANS });
      S.hud(`pV = νRT`, `p = ${r(pk, 1)} kPa · V = ${r(st.V, 2)} l · T = ${Math.round(st.T)} K (${Math.round(st.T - 273)} °C)`, { dig: 1 });
      // p–V diagramma
      const gw = m ? S.W - 24 : Math.min(330, S.W * 0.42), gh = m ? S.H * 0.3 : S.H * 0.56, gx = S.W - gw - 12, gy = m ? S.H - gh - 8 : 56;
      const iso = []; if (st.mode === "iso-T" || st.mode === "free") for (let v = 0.5; v <= 4.4; v += 0.05) iso.push([v, (n * RG * st.T) / v]);
      const G = S.graph(gx, gy, gw, gh, [{ d: iso, c: "rgba(87,83,78,.4)", dash: [4, 4], l: st.mode === "iso-T" ? "izoterma" : "" }, { d: st.trace, c: "#2563eb", l: "p(V)" }], { xmin: 0, xmax: 4.5, ymin: 0, ymax: 1600, xl: "V (l)", yl: "p (kPa)" });
      if (st.mode === "iso-p" && st.trace.length > 1) { const v0 = Math.min(st.V0, st.V), v1 = Math.max(st.V0, st.V); x.fillStyle = "rgba(37,99,235,.15)"; x.fillRect(G.X(v0), G.Y(pk), G.X(v1) - G.X(v0), G.Y(0) - G.Y(pk)); S.text("A = pΔV", (G.X(v0) + G.X(v1)) / 2, (G.Y(pk) + G.Y(0)) / 2, { size: 12, c: "#1d4ed8" }); }
      x.fillStyle = C.red; x.beginPath(); x.arc(G.X(st.V), G.Y(Math.min(1600, pk)), 4.5, 0, 7); x.fill();
      if (!m && st.mode !== "free") S.bars(gx + 40, gy + gh + 104, 62, [{ v: Math.abs(st.Q), c: "#dc2626", l: "Q" }, { v: Math.abs(n * CV * (st.T - st.T0)), c: "#f59e0b", l: "ΔU" }, { v: Math.abs(st.A), c: "#2563eb", l: "A" }], { max: Math.max(50, Math.abs(st.Q), Math.abs(st.A)), title: "Q = ΔU + A (J)" });
      if (S.frame % 30 === 0) info();
    };
    S.hover = (pt) => { if (st.mode === "iso-p" || st.mode === "iso-V") return false; const g = geo(); return Math.abs(pt[1] - (g.top - 7)) < 30 && Math.abs(pt[0] - g.cx) < g.w / 2 + 10; };
    S.pointer((pt) => { if (!S.hover(pt)) return false; st.drag = true; },
      (pt) => { const g = geo(); const V = Math.max(0.6, Math.min(4.3, ((g.bot - pt[1] - 7) / g.hmax) * g.Vmax)); st.V = V; sl.V && sl.V.set(r(V, 2).replace(",", ".")); },
      () => (st.drag = false));
    const TXT = { free: "pV = νRT — Mendeleyev–Klapeyron tenglamasi. Porshenni sudrang, harorat va gaz miqdorini o‘zgartiring.",
      "iso-T": "<b>Izotermik</b> jarayon (T = const, Boyl–Mariott qonuni): pV = const. Porshenni pastga sursangiz — bosim ortadi. Grafik — giperbola (izoterma).",
      "iso-p": "<b>Izobarik</b> jarayon (p = const, Gey-Lyussak qonuni): V/T = const. Qizdirsangiz gaz kengayib porshenni ko‘taradi va <b>ish bajaradi</b>: A = pΔV (grafikdagi bo‘yalgan yuza). Q = ΔU + A.",
      "iso-V": "<b>Izoxorik</b> jarayon (V = const, Sharl qonuni): p/T = const. Porshen qotirilgan — gaz ish bajarmaydi (A = 0), barcha issiqlik ichki energiyaga ketadi: Q = ΔU." };
    function info() {
      S.out.innerHTML = S.f(`pV = νRT:  ${r(pres(), 1)} kPa · ${r(st.V, 2)} l = 0,1 mol · 8,31 · ${Math.round(st.T)} K`)
        + (st.mode !== "free" ? S.f(`Q = ΔU + A:  ${r(st.Q, 0)} J = ${r(n * CV * (st.T - st.T0), 0)} J + ${r(st.A, 0)} J`, "termodinamikaning 1-qonuni") : "")
        + `<p class="sl-hint">${TXT[st.mode]} Bosim — molekulalarning porshenga zarbalari (hozir ~${Math.round(st.hitRate)} ta/s). Harorat ortsa, molekulalar tezlashadi (qizil rang).</p>`;
    }
    const sl = {};
    function render() {
      S.controls.innerHTML = "";
      if (!p.mode) S.controls.append(buttons(["Erkin", "Izotermik", "Izobarik", "Izoxorik"], (i) => { st.mode = ["free", "iso-T", "iso-p", "iso-V"][i]; st.heat = 0; pres0 = pres(); render(); reset(); }, ["free", "iso-T", "iso-p", "iso-V"].indexOf(st.mode)));
      if (st.mode === "free" || st.mode === "iso-T") S.controls.append(sl.V = slider({ label: "Hajm V (porshenni ham sudrash mumkin)", min: 0.6, max: 4.3, step: 0.05, value: st.V, fmt: (v) => r(v, 2) + " l", onInput: (v) => { st.V = v; } }));
      if (st.mode === "free") S.controls.append(slider({ label: "Harorat T", min: 150, max: 900, step: 10, value: st.T, fmt: (v) => v + " K", onInput: (v) => { st.T = v; } }));
      if (st.mode === "iso-p" || st.mode === "iso-V") S.controls.append(buttons(["❄ Sovitish", "⏸ To‘xtatish", "🔥 Qizdirish"], (i) => { st.heat = [-1, 0, 1][i]; }, 1), button("↺ Qaytadan", () => { st.T = 300; st.V = 2; pres0 = pres(); st.heat = 0; reset(); }, "ghost"));
      S.controls.append(button("🧹 Grafikni tozalash", () => reset(), "ghost"));
      info();
    }
    render();
  };

  // ===================================================================
  // 2. MOLEKULALAR — Maksvell taqsimoti va Broun harakati
  // ===================================================================
  W.molecules = (root, p) => {
    const S = K.scene(root, { title: p.title || "🔬 Molekulalar harakati: tezliklar taqsimoti va Broun zarrachasi", aspect: 0.56, aspectMobile: 1.0, slow: false });
    const x = S.x, kB = 1.380649e-23, NA = 6.022e23;
    const GAS = [["He", 0.004], ["N₂ (havo)", 0.028], ["CO₂", 0.044]];
    const st = { T: 300, gi: 1, P: [], B: { x: 0.5, y: 0.5, vx: 0, vy: 0, tr: [] }, hist: new Array(24).fill(0) };
    const N = 140, vmax = 2600; // m/s, gistogramma chegarasi
    const sample = () => { const M = GAS[st.gi][1], s = Math.sqrt((kB * st.T) / (M / NA)); const g = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * Math.random()); }; return [g() * s, g() * s]; };
    st.P = Array.from({ length: N }, () => { const [vx, vy] = sample(); return { x: Math.random(), y: Math.random(), vx, vy }; });
    const box = () => { const m = S.W < 560, w = m ? S.W - 24 : S.W * 0.55, hh = m ? S.H * 0.5 : S.H - 80; return { x0: 12, y0: 52, w, hh }; };
    S.step = (dt) => {
      const sc = 0.00028; // ekran tezligi (nisbiy birlik / (m/s))
      st.P.forEach((q) => { q.x += q.vx * sc * dt; q.y += q.vy * sc * dt * 1.5;
        if (q.x < 0 || q.x > 1) { q.vx *= -1; q.x = Math.max(0, Math.min(1, q.x)); } if (q.y < 0 || q.y > 1) { q.vy *= -1; q.y = Math.max(0, Math.min(1, q.y)); }
        if (Math.random() < 0.6 * dt) { const [a, b] = sample(); q.vx = a; q.vy = b; } }); // to'qnashuvlar: tezlik qayta taqsimlanadi
      const B = st.B, kick = Math.sqrt(st.T / 300) * 0.9;
      B.vx += (Math.random() - 0.5) * kick * dt * 6; B.vy += (Math.random() - 0.5) * kick * dt * 6; B.vx *= 0.92; B.vy *= 0.92;
      B.x = Math.max(0.05, Math.min(0.95, B.x + B.vx * dt * 0.2)); B.y = Math.max(0.05, Math.min(0.95, B.y + B.vy * dt * 0.2));
      if (S.frame % 2 === 0) push(B.tr, [B.x, B.y], 500);
    };
    S.draw = () => {
      S.bg(); const b = box(), M = GAS[st.gi][1];
      x.fillStyle = "rgba(186,230,253,.25)"; x.fillRect(b.x0, b.y0, b.w, b.hh); x.strokeStyle = C.ink; x.lineWidth = 2; x.strokeRect(b.x0, b.y0, b.w, b.hh);
      const vrms = Math.sqrt((3 * kB * st.T) / (M / NA));
      st.P.forEach((q) => { const v = Math.hypot(q.vx, q.vy); x.fillStyle = hot(v / (vrms * 1.6)); x.beginPath(); x.arc(b.x0 + q.x * b.w, b.y0 + q.y * b.hh, 2.8, 0, 7); x.fill(); });
      x.strokeStyle = "rgba(161,98,7,.7)"; x.lineWidth = 1.3; x.beginPath(); st.B.tr.forEach(([a, c], i) => (i ? x.lineTo(b.x0 + a * b.w, b.y0 + c * b.hh) : x.moveTo(b.x0 + a * b.w, b.y0 + c * b.hh))); x.stroke();
      S.ball(b.x0 + st.B.x * b.w, b.y0 + st.B.y * b.hh, 9, "#fde68a", "#a16207");
      S.text("Broun zarrachasi", b.x0 + st.B.x * b.w, b.y0 + st.B.y * b.hh - 14, { size: 10, c: "#92400e", bold: false, halo: true });
      // gistogramma
      const H = new Array(24).fill(0); st.P.forEach((q) => { const v = Math.hypot(q.vx, q.vy), i = Math.floor((v / vmax) * 24); if (i < 24) H[i]++; });
      st.hist = st.hist.map((v, i) => v + (H[i] - v) * 0.06);
      const m = S.W < 560, gw = m ? S.W - 24 : S.W - b.w - 40, gh = m ? S.H * 0.36 : S.H * 0.62, gx = m ? 12 : b.x0 + b.w + 16, gy = m ? S.H - gh - 8 : 52;
      const a = (M / NA) / (kB * st.T), th = []; for (let v = 0; v <= vmax; v += 40) th.push([v, N * (vmax / 24) * a * v * Math.exp(-a * v * v / 2)]); // 2D Maksvell
      const G = S.graph(gx, gy, gw, gh, [{ d: th, c: "#dc2626", l: "Maksvell" }], { xmin: 0, xmax: vmax, ymin: 0, ymax: Math.max(...th.map((q) => q[1])) * 1.3, xl: "v (m/s)", yl: "molekulalar" });
      st.hist.forEach((v, i) => { const x0 = G.X((i * vmax) / 24) + 1, x1 = G.X(((i + 1) * vmax) / 24) - 1; x.fillStyle = "rgba(37,99,235,.45)"; x.fillRect(x0, G.Y(v), x1 - x0, G.Y(0) - G.Y(v)); });
      const vp = Math.sqrt(1 / a); x.setLineDash([3, 3]); x.strokeStyle = C.ink; x.beginPath(); x.moveTo(G.X(vp), G.Y(0)); x.lineTo(G.X(vp), gy + 18); x.stroke(); x.setLineDash([]);
      S.hud(`v̄ₖᵥ = √(3kT/m₀) = ${Math.round(vrms)} m/s`, `${GAS[st.gi][0]} · T = ${st.T} K (${st.T - 273} °C) · Eₖ = 3kT/2 = ${r(1.5 * kB * st.T * 1e21, 2)}·10⁻²¹ J`, { dig: 1 });
    };
    function info() {
      const M = GAS[st.gi][1], vrms = Math.sqrt((3 * RG * st.T) / M);
      S.out.innerHTML = S.f(`v = √(3RT/M) = √(3·8,31·${st.T}/${M}) = <b>${Math.round(vrms)} m/s</b>`, `${Math.round(vrms * 3.6)} km/soat!`)
        + `<p class="sl-hint">Molekulalar har xil tezlikda harakatlanadi — ko‘k ustunlar (hozirgi taqsimot) qizil Maksvell egri chizig‘i atrofida. Harorat ortsa, egri o‘ngga suriladi va yassilanadi. Yengil gaz (He) og‘irroq gazdan (CO₂) tezroq. Sariq Broun zarrachasi ko‘rinmas molekulalar zarbalaridan tartibsiz “raqsga tushadi” — bu molekulalar mavjudligining isboti (1827, R. Broun; 1905, A. Eynshteyn).</p>`;
    }
    S.controls.append(slider({ label: "Harorat T", min: 100, max: 1000, step: 10, value: st.T, fmt: (v) => `${v} K (${v - 273} °C)`, onInput: (v) => { st.T = v; info(); } }),
      buttons(GAS.map((g) => g[0]), (i) => { st.gi = i; info(); }, st.gi), S.timeCtl({ slow: false }));
    info();
  };

  // ===================================================================
  // 3. KALORIMETR — issiqlik balansi (aralashtirish) va yoqilg'i yonishi
  // ===================================================================
  W.calorimeter = (root, p) => {
    const S = K.scene(root, { title: p.title || "🌡 Kalorimetr: issiq jismni sovuq suvga tushiramiz", aspect: 0.56, aspectMobile: 1.0, slow: false });
    const x = S.x;
    const MAT = [["Alyuminiy", 920, "#cbd5e1"], ["Temir", 460, "#94a3b8"], ["Mis", 400, "#c2703d"], ["Qo‘rg‘oshin", 140, "#64748b"], ["Suv (issiq)", 4200, "#38bdf8"]];
    const FUEL = [["Yog‘och", 10], ["Toshko‘mir", 27], ["Spirt", 27], ["Benzin", 46], ["Tabiiy gaz", 44], ["Vodorod", 120]];
    const st = { mode: p.mode || "mix", mi: 0, m1: 0.2, t1: 100, m2: 0.3, t2: 20, T1: 100, T2: 20, y: -1, run: false, tr: [[], []], fuel: 3, mf: 10, burnt: 0, Tw: 20, mw: 1 };
    const theta = () => { const c1 = MAT[st.mi][1]; return (c1 * st.m1 * st.t1 + 4200 * st.m2 * st.t2) / (c1 * st.m1 + 4200 * st.m2); };
    function reset() { Object.assign(st, { T1: st.t1, T2: st.t2, y: -1, run: false, tr: [[], []], burnt: 0, Tw: 20 }); S.t = 0; info(); }
    function go() { reset(); st.run = true; st.y = 0; S.unpause && S.unpause(); }
    S.step = (dt) => {
      if (!st.run) return;
      if (st.mode === "mix") {
        if (st.y < 1) { st.y = Math.min(1, st.y + dt * 1.6); if (st.y >= 1) { const g = geo(); S.burst(g.cx, g.wy, 26, ["#93c5fd", "#bfdbfe", "#fff"], { a0: -PI / 2, spread: 2.4, sp: 110 }); S.pop("plyuh!", g.cx + 30, g.wy - 30, { c: "#0284c7" }); } return; }
        // jism harorati muvozanatga eksponensial yaqinlashadi (τ ≈ 1,6 s, sekinlashtirilgan); suv harorati — issiqlik balansidan
        const c1 = MAT[st.mi][1], th = theta();
        st.T1 = th + (st.T1 - th) * Math.exp(-dt / 1.6);
        st.T2 = th - ((st.T1 - th) * c1 * st.m1) / (4200 * st.m2);
        if (S.frame % 2 === 0) { push(st.tr[0], [S.t, st.T1]); push(st.tr[1], [S.t, st.T2]); }
        if (Math.abs(st.T1 - th) < 0.05 && !st.done) { st.done = true; S.pop("muvozanat!", S.W * 0.35, S.H * 0.3, { c: "#15803d" }); finish(); }
      } else {
        const qf = FUEL[st.fuel][1] * 1e6, rate = st.mf / 1000 / 6; // 6 s da yonib bo'ladi
        if (st.burnt < st.mf / 1000) { const dm = Math.min(rate * dt, st.mf / 1000 - st.burnt); st.burnt += dm; const Q = qf * dm; st.Tw = Math.min(100, st.Tw + Q / (4200 * st.mw)); }
        else if (!st.done) { st.done = true; finish(); }
        if (S.frame % 2 === 0) push(st.tr[0], [S.t, st.Tw]);
      }
    };
    const geo = () => { const m = S.W < 560, cx = m ? S.W * 0.36 : S.W * 0.28, bw = Math.min(170, S.W * 0.3), wy = S.H * (m ? 0.42 : 0.5), bot = S.H * (m ? 0.62 : 0.82); return { cx, bw, wy, bot, m }; };
    S.draw = () => {
      S.bg(); const g = geo();
      const Tw = st.mode === "mix" ? st.T2 : st.Tw;
      // idish
      x.fillStyle = `rgba(${Math.round(56 + (Tw - 20) * 1.6)},${Math.round(189 - (Tw - 20) * 0.8)},248,.45)`; x.fillRect(g.cx - g.bw / 2, g.wy, g.bw, g.bot - g.wy);
      x.strokeStyle = C.ink; x.lineWidth = 3; x.beginPath(); x.moveTo(g.cx - g.bw / 2, g.wy - 60); x.lineTo(g.cx - g.bw / 2, g.bot); x.lineTo(g.cx + g.bw / 2, g.bot); x.lineTo(g.cx + g.bw / 2, g.wy - 60); x.stroke();
      if (st.mode === "mix") {
        x.strokeStyle = "rgba(87,83,78,.4)"; x.lineWidth = 1; x.strokeRect(g.cx - g.bw / 2 - 10, g.wy - 66, g.bw + 20, g.bot - g.wy + 72); S.text("kalorimetr", g.cx, g.bot + 18, { size: 10, c: C.sub, bold: false });
        const by = st.y < 0 ? g.wy - 120 : g.wy - 120 + Math.min(1, st.y) * (g.bot - g.wy + 120 - 40) * Math.min(1, st.y);
        const kb = (st.T1 - 20) / 80;
        x.fillStyle = MAT[st.mi][2]; x.fillRect(g.cx - 22, by, 44, 34); x.strokeStyle = `rgba(220,38,38,${Math.max(0, kb) * 0.9})`; x.lineWidth = 4; x.strokeRect(g.cx - 22, by, 44, 34);
        if (kb > 0.2 && st.y < 1) for (let i = 0; i < 3; i++) { x.strokeStyle = "rgba(220,38,38,.35)"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(g.cx - 10 + i * 10, by - 4); x.quadraticCurveTo(g.cx - 16 + i * 10, by - 14, g.cx - 10 + i * 10, by - 22 - Math.sin(S.t * 5 + i) * 3); x.stroke(); }
        S.text(MAT[st.mi][0], g.cx, by + 21, { size: 9, c: "#111", italic: false, font: K.SANS });
        if (st.y >= 1) for (let i = 0; i < 6; i++) { const a = S.t * 2 + i; x.strokeStyle = "rgba(220,38,38,.25)"; x.beginPath(); x.arc(g.cx, by + 17, 30 + ((a * 14) % 40), 0, 7); x.stroke(); }
        thermo(S, g.cx - g.bw / 2 - 34, g.bot - 4, g.bot - g.wy + 40, st.T1, 0, 110, `${r(st.T1, 1)} °`); S.text("jism", g.cx - g.bw / 2 - 34, g.bot + 36, { size: 10, c: C.sub, bold: false });
        thermo(S, g.cx + g.bw / 2 + 34, g.bot - 4, g.bot - g.wy + 40, st.T2, 0, 110, `${r(st.T2, 1)} °`); S.text("suv", g.cx + g.bw / 2 + 34, g.bot + 36, { size: 10, c: C.sub, bold: false });
        S.hud(`θ = ${r(theta(), 1)} °C`, "issiqlik balansi: Q₍berilgan₎ = Q₍olingan₎", { dig: 1 });
      } else {
        const left = 1 - st.burnt / (st.mf / 1000);
        x.fillStyle = "#475569"; x.fillRect(g.cx - 26, g.bot + 34, 52, 22);
        flame(S, g.cx, g.bot + 30, st.run && left > 0 ? 1.1 : 0, S.t);
        x.fillStyle = "#a16207"; x.fillRect(g.cx - 18, g.bot + 56 - 0, 36 * Math.max(0, left), 4);
        thermo(S, g.cx + g.bw / 2 + 34, g.bot - 4, g.bot - g.wy + 40, st.Tw, 0, 110, `${r(st.Tw, 1)} °`);
        if (st.Tw >= 99.9) for (let i = 0; i < 8; i++) { x.fillStyle = "rgba(255,255,255,.8)"; x.beginPath(); x.arc(g.cx - g.bw / 2 + 10 + ((i * 37 + S.frame * 2) % (g.bw - 20)), g.bot - ((S.frame * 3 + i * 23) % (g.bot - g.wy)), 3, 0, 7); x.fill(); }
        S.hud(`Q = qm = ${r(FUEL[st.fuel][1] * st.burnt * 1000, 2)} MJ·10⁻³`, `${FUEL[st.fuel][0]}: yondi ${r(st.burnt * 1000, 1)} g dan ${st.mf} g`, { dig: 1 });
      }
      const gw = g.m ? S.W - 24 : Math.min(320, S.W * 0.42), gh = g.m ? S.H * 0.3 : S.H * 0.5, gx = S.W - gw - 12, gy = g.m ? S.H - gh - 8 : 56;
      S.graph(gx, gy, gw, gh, st.mode === "mix" ? [{ d: st.tr[0], c: "#dc2626", l: "jism" }, { d: st.tr[1], c: "#2563eb", l: "suv" }] : [{ d: st.tr[0], c: "#2563eb", l: "suv" }], { ymin: 0, ymax: 110, yl: "t (°C)", xmax: Math.max(4, S.t) });
    };
    function finish() {
      if (st.mode === "mix") { const c1 = MAT[st.mi][1], th = theta(), Q1 = c1 * st.m1 * (st.t1 - th), Q2 = 4200 * st.m2 * (th - st.t2);
        S.out.innerHTML = S.endCard(`MUVOZANAT: θ = ${r(th, 1)} °C`, S.f(`θ = (c₁m₁t₁ + c₂m₂t₂)/(c₁m₁ + c₂m₂) = <b>${r(th, 1)} °C</b>`) + S.f(`Q₁ = c₁m₁(t₁ − θ) = ${Math.round(Q1)} J,  Q₂ = c₂m₂(θ − t₂) = ${Math.round(Q2)} J`)
          + `<p class="sl-hint">Issiq jism bergan issiqlik = suv olgan issiqlik (yo‘qotishlar bo‘lmasa). Suvning solishtirma issiqlik sig‘imi (4200 J/(kg·°C)) metallarnikidan ancha katta — shuning uchun suv harorati kam o‘zgaradi.</p>`,
          [{ v: Q1, c: "#dc2626", l: "Q₁ berdi" }, { v: Q2, c: "#2563eb", l: "Q₂ oldi" }]); }
      else { const Q = FUEL[st.fuel][1] * 1e6 * st.mf / 1000, need = 4200 * st.mw * 80;
        S.out.innerHTML = S.endCard(`YONDI: Q = ${r(Q / 1e6, 3)} MJ`, S.f(`Q = q·m = ${FUEL[st.fuel][1]}·10⁶ · ${st.mf / 1000} = <b>${r(Q / 1000, 0)} kJ</b>`) + S.f(`1 l suvni 20 → 100 °C qizdirish uchun: cmΔT = ${r(need / 1000, 0)} kJ`)
          + `<p class="sl-hint">${Q >= need ? "Issiqlik yetarli — suv qaynadi!" : `Yetmadi: suv ${r(st.Tw, 1)} °C gacha isidi. Yoqilg‘ini ko‘paytiring yoki issiqligi yuqorirog‘ini tanlang.`} Bu ideal hisob — amalda issiqlikning bir qismi havoga ketadi.</p>`,
          [{ v: Q / 1000, c: "#f59e0b", l: "yoqilg‘i, kJ" }, { v: need / 1000, c: "#2563eb", l: "kerak, kJ", fmt: r(need / 1000, 0) + " kJ" }]); }
    }
    function info() {
      if (st.run && st.done) return; st.done = false;
      S.out.innerHTML = st.mode === "mix" ? S.f(`Kutilayotgan harorat: θ = <b>${r(theta(), 1)} °C</b>`) + `<p class="sl-hint">“▶ Tushirish” ni bosing — jism suvga tushadi, ikki termometr asta-sekin bir xil haroratga keladi.</p>`
        : S.f(`q(${FUEL[st.fuel][0]}) = ${FUEL[st.fuel][1]} MJ/kg`, "solishtirma yonish issiqligi") + `<p class="sl-hint">“▶ Yoqish” — yoqilg‘i yonib, 1 l suvni qizdiradi.</p>`;
    }
    function render() {
      S.controls.innerHTML = "";
      if (!p.mode) S.controls.append(buttons(["Aralashtirish", "Yoqilg‘i yonishi"], (i) => { st.mode = ["mix", "fuel"][i]; render(); reset(); }, st.mode === "fuel" ? 1 : 0));
      if (st.mode === "mix") S.controls.append(h("div", { class: "kn-row" }, button("▶ Tushirish", go), button("↺", reset, "ghost")), buttons(MAT.map((m) => m[0]), (i) => { st.mi = i; reset(); }, st.mi),
        slider({ label: "Jism massasi m₁", min: 0.05, max: 1, step: 0.05, value: st.m1, fmt: (v) => r(v, 2) + " kg", onInput: (v) => { st.m1 = v; reset(); } }),
        slider({ label: "Jism harorati t₁", min: 30, max: 100, value: st.t1, fmt: (v) => v + " °C", onInput: (v) => { st.t1 = v; reset(); } }),
        slider({ label: "Suv massasi m₂", min: 0.1, max: 1, step: 0.05, value: st.m2, fmt: (v) => r(v, 2) + " kg", onInput: (v) => { st.m2 = v; reset(); } }),
        slider({ label: "Suv harorati t₂", min: 0, max: 40, value: st.t2, fmt: (v) => v + " °C", onInput: (v) => { st.t2 = v; reset(); } }));
      else S.controls.append(h("div", { class: "kn-row" }, button("▶ Yoqish", go), button("↺", reset, "ghost")), buttons(FUEL.map((f) => f[0]), (i) => { st.fuel = i; reset(); }, st.fuel),
        slider({ label: "Yoqilg‘i massasi", min: 1, max: 30, value: st.mf, fmt: (v) => v + " g", onInput: (v) => { st.mf = v; reset(); } }));
      S.controls.append(S.timeCtl({ slow: false }));
      reset();
    }
    render();
  };

  // ===================================================================
  // 4. TO'RT TAKTLI DVIGATEL — porshen, klapanlar, uchqun, p–V sikl
  // ===================================================================
  W.engine = (root, p) => {
    const S = K.scene(root, { title: p.title || "🚗 To‘rt taktli ichki yonuv dvigateli: sikl va FIK", aspect: 0.58, aspectMobile: 1.05, slow: false });
    const x = S.x;
    const st = { T1: 1800, T2: 500, rpm: 30, ph: 0, tr: [] };
    const STR = ["1. So‘rish", "2. Siqish", "3. Ish yo‘li", "4. Chiqarish"], DESC = ["kirish klapani ochiq — yoqilg‘i aralashmasi kiradi", "ikkala klapan yopiq — aralashma siqiladi va qiziydi", "uchqun! — yonish, gaz porshenni itaradi (foydali ish)", "chiqish klapani ochiq — ishlatilgan gaz chiqadi"];
    const pv = (ph) => { // ph 0..4 → [V, p] Otto sikli (nisbiy)
      const k = Math.floor(ph) % 4, f = ph - Math.floor(ph), Vmin = 1, Vmax = 8, gam = 1.4, r_ = Vmax / Vmin;
      const V = k % 2 === 0 ? Vmin + (Vmax - Vmin) * (1 - Math.cos(f * PI)) / 2 : Vmax - (Vmax - Vmin) * (1 - Math.cos(f * PI)) / 2;
      const p1 = 1, p2 = p1 * r_ ** gam, p3 = p2 * (st.T1 / Math.max(st.T2, 300)) * 1.2, p4 = p3 / r_ ** gam;
      if (k === 0) return [V, p1]; if (k === 1) return [V, p1 * (Vmax / V) ** gam];
      if (k === 2) return [V, (f < 0.04 ? p2 + (p3 - p2) * f / 0.04 : p3 * (Vmin / V) ** gam)]; return [V, f < 0.05 ? p4 + (p1 - p4) * f / 0.05 : p1];
    };
    S.step = (dt) => { st.ph = (st.ph + dt * st.rpm / 60 * 2) % 4; if (S.frame % 1 === 0) push(st.tr, pv(st.ph), 260); };
    S.draw = () => {
      S.bg(); const m = S.W < 560, cx = m ? S.W * 0.5 : S.W * 0.24, top = m ? 104 : 70, cw = m ? 80 : 96, ch = m ? 100 : Math.min(170, S.H * 0.42);
      const k = Math.floor(st.ph) % 4, f = st.ph - Math.floor(st.ph), crank = st.ph * PI, R = m ? 20 : 30, cy0 = top + ch + (m ? 50 : 70);
      const pin = [cx + R * Math.sin(crank), cy0 - R * Math.cos(crank)], rod = m ? 62 : 92, py = pin[1] - Math.sqrt(rod * rod - (pin[0] - cx) ** 2);
      // gaz rangi
      const gasC = k === 0 ? "rgba(132,204,22,.35)" : k === 1 ? `rgba(234,179,8,${0.3 + f * 0.3})` : k === 2 ? `rgba(239,68,68,${0.7 - f * 0.4})` : "rgba(120,113,108,.45)";
      x.fillStyle = gasC; x.fillRect(cx - cw / 2, top, cw, py - top - 14);
      if (k === 2 && f < 0.15) { S.burst(cx, top + 10, 4, ["#facc15", "#fb923c"], { sp: 80, g: 0, life: 0.3 }); x.fillStyle = "rgba(253,224,71,.8)"; x.beginPath(); x.arc(cx, top + 8, 18 * (1 - f / 0.15) + 6, 0, 7); x.fill(); }
      // silindr devorlari va qopqoq
      x.strokeStyle = C.ink; x.lineWidth = 4; x.beginPath(); x.moveTo(cx - cw / 2 - 2, top - 2); x.lineTo(cx - cw / 2 - 2, top + ch + 10); x.moveTo(cx + cw / 2 + 2, top - 2); x.lineTo(cx + cw / 2 + 2, top + ch + 10); x.stroke();
      x.fillStyle = "#64748b"; x.fillRect(cx - cw / 2 - 10, top - 16, cw + 20, 14);
      // klapanlar
      const vIn = k === 0 ? Math.sin(f * PI) * 10 : 0, vEx = k === 3 ? Math.sin(f * PI) * 10 : 0;
      [[cx - 24, vIn, "#16a34a", "kirish"], [cx + 24, vEx, "#78716c", "chiqish"]].forEach(([vx, o, c, l]) => { x.strokeStyle = c; x.lineWidth = 3; x.beginPath(); x.moveTo(vx, top - 40); x.lineTo(vx, top - 2 + o); x.stroke(); x.fillStyle = c; x.fillRect(vx - 10, top - 4 + o, 20, 4); S.text(l, vx, top - 46, { size: 9, c: C.sub, bold: false }); });
      x.fillStyle = "#facc15"; x.fillRect(cx - 3, top - 22, 6, 12); S.text("sham", cx, top - 26, { size: 8, c: C.sub, bold: false, italic: false, font: K.SANS });
      // porshen, shatun, tirsakli val
      x.fillStyle = "#94a3b8"; x.fillRect(cx - cw / 2 + 2, py - 14, cw - 4, 28); x.strokeStyle = "#475569"; x.lineWidth = 1; x.strokeRect(cx - cw / 2 + 2, py - 14, cw - 4, 28);
      x.strokeStyle = "#475569"; x.lineWidth = 7; x.beginPath(); x.moveTo(cx, py); x.lineTo(pin[0], pin[1]); x.stroke();
      x.strokeStyle = "#1f2937"; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy0, R + 8, 0, 7); x.stroke(); x.lineWidth = 6; x.beginPath(); x.moveTo(cx, cy0); x.lineTo(pin[0], pin[1]); x.stroke();
      x.fillStyle = "#1f2937"; x.beginPath(); x.arc(cx, cy0, 6, 0, 7); x.fill();
      if (k === 2) S.arrow(cx + cw / 2 + 18, top + 20, cx + cw / 2 + 18, top + 64, C.red, "F", { fs: 12 });
      S.hud(STR[k], DESC[k], { dig: 1 });
      // p–V diagramma
      const gw = m ? S.W - 24 : Math.min(330, S.W * 0.44), gh = m ? S.H * 0.32 : S.H * 0.58, gx = S.W - gw - 12, gy = m ? S.H - gh - 8 : 56;
      const cyc = []; for (let q = 0; q < 4; q += 0.01) cyc.push(pv(q));
      const G = S.graph(gx, gy, gw, gh, [{ d: cyc, c: "rgba(87,83,78,.35)", w: 1.2 }, { d: st.tr.slice(-60), c: "#dc2626", w: 2.4 }], { xmin: 0, xmax: 9, ymin: 0, ymax: Math.max(...cyc.map((q) => q[1])) * 1.1, xl: "V", yl: "p" });
      const cur = pv(st.ph); x.fillStyle = C.red; x.beginPath(); x.arc(G.X(cur[0]), G.Y(cur[1]), 5, 0, 7); x.fill();
      S.text("yuza = sikldagi foydali ish", gx + gw / 2, gy + gh - 18, { size: 10, c: C.sub, bold: false });
    };
    function info() { const eta = 1 - st.T2 / st.T1; S.out.innerHTML = S.f(`η₍max₎ = 1 − T₂/T₁ = 1 − ${st.T2}/${st.T1} = <b>${Math.round(eta * 100)} %</b>`, "Karno formulasi — ideal chegara")
      + `<p class="sl-hint">Haqiqiy benzin dvigatelining FIK i ~25–35 %, dizelniki ~40 % — qolgan energiya issiqlik sifatida radiator va gaz bilan chiqib ketadi. 4 taktdan faqat bittasi (ish yo‘li) foydali ish bajaradi; qolganlarida tirsakli valni maxovik inersiyasi aylantiradi. p–V diagrammadagi yopiq egri yuzasi — bir sikldagi ish.</p>`; }
    S.controls.append(slider({ label: "Aylanish tezligi", min: 6, max: 120, value: st.rpm, fmt: (v) => v + " ayl/min (sekinlashtirilgan)", onInput: (v) => { st.rpm = v; } }),
      slider({ label: "Isitkich harorati T₁", min: 800, max: 2500, step: 50, value: st.T1, fmt: (v) => v + " K", onInput: (v) => { st.T1 = v; info(); } }),
      slider({ label: "Sovitkich harorati T₂", min: 300, max: 700, step: 10, value: st.T2, fmt: (v) => v + " K", onInput: (v) => { st.T2 = v; info(); } }), S.timeCtl({ slow: false, speeds: false }));
    info();
  };

  // ===================================================================
  // 5. TO'LQINLAR — ko'ndalang (arqon), bo'ylama (prujina), tovush (ovoz bilan)
  // ===================================================================
  W.wave = (root, p) => {
    const S = K.scene(root, { title: p.title || "🌊 Mexanik to‘lqinlar: ko‘ndalang, bo‘ylama va tovush", aspect: 0.56, aspectMobile: 0.95, slow: false });
    const x = S.x;
    const st = { kind: p.kind || "trans", A: 25, f: 1, v: 160, ac: null, osc: null, gain: null, snd: false, tt: 0, mark: 0 };
    S.step = (dt) => { st.tt += dt; };
    S.draw = () => {
      S.bg(); const m = S.W < 560, x0 = 30, x1 = S.W - 20, cy = m ? S.H * 0.42 : S.H * 0.5;
      const ppx = 1, lam = st.v / st.f, k = (2 * PI) / lam, w = 2 * PI * st.f, t = st.tt;
      if (st.kind === "trans") {
        x.strokeStyle = "rgba(87,83,78,.35)"; x.setLineDash([4, 5]); x.beginPath(); x.moveTo(x0, cy); x.lineTo(x1, cy); x.stroke(); x.setLineDash([]);
        x.strokeStyle = "#a16207"; x.lineWidth = 2; x.beginPath(); for (let X = x0; X <= x1; X += 3) { const d = X - x0, y = d < st.v * t ? cy - st.A * Math.sin(w * t - k * d) : cy; X === x0 ? x.moveTo(X, y) : x.lineTo(X, y); } x.stroke();
        for (let X = x0; X <= x1; X += 16) { const d = X - x0, y = d < st.v * t ? cy - st.A * Math.sin(w * t - k * d) : cy, mk = Math.abs(X - (x0 + 16 * 12)) < 1; S.ball(X, y, mk ? 7 : 4.5, mk ? "#fecaca" : "#e7e5e4", mk ? "#dc2626" : "#57534e"); }
        // qo'l
        const hy = cy - st.A * Math.sin(w * t); x.fillStyle = "#fcd34d"; x.beginPath(); x.arc(x0 - 10, hy, 10, 0, 7); x.fill();
        S.arrow(x0 + 16 * 12 + 16, cy, x0 + 16 * 12 + 16, cy - st.A * 1.2, C.v, "tebranish", { w: 1.4, fs: 10 }); S.arrow(x0 + 16 * 12 + 16, cy + st.A + 20, x0 + 16 * 12 + 76, cy + st.A + 20, C.red, "to‘lqin", { w: 1.4, fs: 10 });
      } else {
        const coils = Math.floor((x1 - x0) / 9);
        for (let i = 0; i <= coils; i++) { const X0 = x0 + i * 9, d = X0 - x0, s = d < st.v * t ? st.A * 0.45 * Math.sin(w * t - k * d) : 0, X = X0 + s;
          if (st.kind === "long") { x.strokeStyle = i === 24 ? "#dc2626" : "#475569"; x.lineWidth = i === 24 ? 3 : 1.6; x.beginPath(); x.ellipse(X, cy, 3, 26, 0, 0, 7); x.stroke(); }
          else { const dens = Math.cos(w * t - k * d); for (let j = 0; j < 7; j++) { x.fillStyle = `rgba(37,99,235,${0.25 + (d < st.v * t ? dens * 0.25 : 0)})`; x.beginPath(); x.arc(X, cy - 60 + j * 20 + ((i * 7 + j * 3) % 9), 2.2, 0, 7); x.fill(); } } }
        if (st.kind === "sound") { // karnay
          x.fillStyle = "#334155"; x.beginPath(); x.moveTo(x0 - 4, cy - 14); x.lineTo(x0 - 24, cy - 34); x.lineTo(x0 - 24, cy + 34); x.lineTo(x0 - 4, cy + 14); x.closePath(); x.fill();
          const diaph = x0 - 2 + Math.sin(w * t) * 3; x.fillStyle = "#94a3b8"; x.fillRect(diaph, cy - 16, 4, 32);
          S.text(st.snd ? "🔊 eshityapsiz" : "🔈 ovoz o‘chiq", x0 + 50, cy + 84, { size: 11, c: C.sub, bold: false });
        } else S.arrow(x0 + 24 * 9, cy + 40, x0 + 24 * 9 + 60, cy + 40, C.red, "to‘lqin = tebranish yo‘nalishi", { w: 1.4, fs: 10 });
        S.text(st.kind === "long" ? "siqilish va siyraklanish" : "havo zichlanishlari", (x0 + x1) / 2, cy - 74, { size: 11, c: C.sub, bold: false });
      }
      // λ belgisi
      const lx = x0 + 40; if (lam > 20 && lx + lam < x1) { const ly = (st.kind === "trans" ? cy + st.A + 44 : cy + 60); x.strokeStyle = "#7c3aed"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(lx, ly); x.lineTo(lx + lam, ly); x.moveTo(lx, ly - 6); x.lineTo(lx, ly + 6); x.moveTo(lx + lam, ly - 6); x.lineTo(lx + lam, ly + 6); x.stroke(); S.text(`λ = ${r(lam / 100, 2)} m`, lx + lam / 2, ly - 8, { size: 12, c: "#7c3aed", halo: true }); }
      const fShow = st.kind === "sound" ? st.f * 220 : st.f;
      S.hud(`v = λν = ${r(lam / 100, 2)} · ${r(st.f, 2)} = ${r(st.v / 100, 2)} m/s`, st.kind === "sound" ? `tovush: ν = ${Math.round(fShow)} Gs (havoda v ≈ 340 m/s, λ = ${r(340 / fShow, 2)} m)` : `T = 1/ν = ${r(1 / st.f, 2)} s`, { dig: 1 });
    };
    function sound(on) {
      st.snd = on;
      try { if (on) { st.ac = st.ac || new (window.AudioContext || window.webkitAudioContext)(); st.osc = st.ac.createOscillator(); st.gain = st.ac.createGain(); st.gain.gain.value = 0.05 * (st.A / 40); st.osc.frequency.value = st.f * 220; st.osc.connect(st.gain); st.gain.connect(st.ac.destination); st.osc.start(); }
        else if (st.osc) { st.osc.stop(); st.osc = null; } } catch (e) { /* bo'sh */ }
      render();
    }
    const upd = () => { if (st.osc) { st.osc.frequency.value = st.f * 220; st.gain.gain.value = 0.05 * (st.A / 40); } info(); };
    function info() {
      const fz = st.kind === "sound" ? st.f * 220 : st.f;
      S.out.innerHTML = S.f(`v = λ·ν,  λ = v/ν,  T = 1/ν`) + `<p class="sl-hint">${st.kind === "trans" ? "<b>Ko‘ndalang to‘lqin</b> — zarralar to‘lqin yo‘nalishiga <b>tik</b> tebranadi (arqon, suv yuzasi). Qizil zarra joyidan ketmaydi — faqat yuqori-pastga tebranadi; to‘lqin esa energiyani olib ketadi." : st.kind === "long" ? "<b>Bo‘ylama to‘lqin</b> — zarralar to‘lqin yo‘nalishi <b>bo‘ylab</b> tebranadi: siqilish va siyraklanish (prujina, tovush). Qizil o‘ram oldinga-orqaga tebranadi." : `<b>Tovush</b> — havodagi bo‘ylama to‘lqin. Inson qulog‘i 20–20 000 Gs ni eshitadi. Chastota ortsa — ovoz <b>ingichkalashadi</b>, amplituda ortsa — <b>balandlashadi</b>. Hozir ${Math.round(fz)} Gs.`}</p>`;
    }
    function render() {
      S.controls.innerHTML = "";
      if (!p.kind) S.controls.append(buttons(["Ko‘ndalang", "Bo‘ylama", "Tovush"], (i) => { if (st.snd) sound(false); st.kind = ["trans", "long", "sound"][i]; st.tt = 0; render(); }, ["trans", "long", "sound"].indexOf(st.kind)));
      S.controls.append(slider({ label: st.kind === "sound" ? "Chastota (balandlik)" : "Chastota ν", min: 0.3, max: 4, step: 0.1, value: st.f, fmt: (v) => st.kind === "sound" ? Math.round(v * 220) + " Gs" : r(v, 1) + " Gs", onInput: (v) => { st.f = v; upd(); } }),
        slider({ label: st.kind === "sound" ? "Amplituda (qattiqlik)" : "Amplituda A", min: 5, max: 45, value: st.A, fmt: (v) => v + " mm", onInput: (v) => { st.A = v; upd(); } }));
      if (st.kind !== "sound") S.controls.append(slider({ label: "To‘lqin tezligi v", min: 60, max: 300, step: 10, value: st.v, fmt: (v) => r(v / 100, 1) + " m/s", onInput: (v) => { st.v = v; upd(); } }));
      S.controls.append(h("div", { class: "kn-row" }, st.kind === "sound" ? button(st.snd ? "🔇 Ovozni o‘chirish" : "🔊 Ovozni yoqish", () => sound(!st.snd)) : "", button("↺ Boshidan", () => (st.tt = 0), "ghost")), S.timeCtl({ slow: false }));
      info();
    }
    render();
    const obs = new MutationObserver(() => { if (!S.cv.isConnected && st.osc) { try { st.osc.stop(); } catch (e) { /* bo'sh */ } st.osc = null; obs.disconnect(); } });
    obs.observe(document.body, { childList: true, subtree: true });
  };

  // ===================================================================
  // 6. BERNULLI — quvur toraysa tezlik ortadi, bosim kamayadi (manometr naychalari)
  // ===================================================================
  W.bernoulli = (root, p) => {
    const S = K.scene(root, { title: p.title || "💨 Bernulli qonuni: quvur toraysa — tezlik ortadi, bosim kamayadi", aspect: 0.56, aspectMobile: 0.9, slow: false });
    const x = S.x, RHO = 1000, P1 = 120000;
    const st = { v1: 1.5, ratio: 0.5, P: Array.from({ length: 90 }, () => ({ u: Math.random(), w: Math.random() * 2 - 1 })), lv: [0, 0, 0] };
    const v2 = () => st.v1 / st.ratio, p2 = () => P1 + 0.5 * RHO * (st.v1 ** 2 - v2() ** 2);
    const geo = () => { const x0 = 20, x1 = S.W - 20, L = x1 - x0, cy = S.H * (S.W < 560 ? 0.68 : 0.66), h1 = Math.min(90, S.H * 0.28); return { x0, x1, L, cy, h1, h2: h1 * st.ratio }; };
    const half = (g, X) => { const a = g.x0 + g.L * 0.36, b = g.x0 + g.L * 0.46, c = g.x0 + g.L * 0.58, d = g.x0 + g.L * 0.68;
      if (X < a || X > d) return g.h1 / 2; if (X < b) return (g.h1 - (g.h1 - g.h2) * (X - a) / (b - a)) / 2; if (X > c) return (g.h2 + (g.h1 - g.h2) * (X - c) / (d - c)) / 2; return g.h2 / 2; };
    S.step = (dt) => { const g = geo(); st.P.forEach((q) => { const X = g.x0 + q.u * g.L, hh = half(g, X), v = st.v1 * (g.h1 / 2) / hh; q.u += (v * 40 * dt) / g.L; if (q.u > 1) { q.u -= 1; q.w = Math.random() * 2 - 1; } }); };
    S.draw = () => {
      S.bg(); const g = geo();
      // quvur
      x.fillStyle = "rgba(56,189,248,.28)"; x.beginPath(); for (let X = g.x0; X <= g.x1; X += 4) x.lineTo(X, g.cy - half(g, X)); for (let X = g.x1; X >= g.x0; X -= 4) x.lineTo(X, g.cy + half(g, X)); x.closePath(); x.fill();
      x.strokeStyle = C.ink; x.lineWidth = 3; [-1, 1].forEach((s) => { x.beginPath(); for (let X = g.x0; X <= g.x1; X += 4) { const Y = g.cy + s * half(g, X); X === g.x0 ? x.moveTo(X, Y) : x.lineTo(X, Y); } x.stroke(); });
      st.P.forEach((q) => { const X = g.x0 + q.u * g.L, hh = half(g, X), v = st.v1 * (g.h1 / 2) / hh, len = Math.min(18, 3 + v * 2.2); x.strokeStyle = "rgba(29,78,216,.7)"; x.lineWidth = 2; x.beginPath(); x.moveTo(X - len, g.cy + q.w * hh * 0.85); x.lineTo(X, g.cy + q.w * hh * 0.85); x.stroke(); });
      // manometr naychalari: suv ustuni balandligi ~ bosim
      const pts = [[g.x0 + g.L * 0.18, P1, st.v1], [g.x0 + g.L * 0.52, p2(), v2()], [g.x0 + g.L * 0.84, P1, st.v1]], base = 100000, sc = (g.cy - g.h1 / 2 - 70) / 30000;
      pts.forEach(([X, pr, v], i) => { const hh = half(g, X), tgt = Math.max(4, (pr - base) * sc); st.lv[i] += (tgt - st.lv[i]) * 0.08;
        x.strokeStyle = C.ink; x.lineWidth = 2; const tubeH = g.cy - hh - 56; x.strokeRect(X - 7, g.cy - hh - tubeH, 14, tubeH);
        x.fillStyle = "rgba(37,99,235,.55)"; x.fillRect(X - 5, g.cy - hh - st.lv[i], 10, st.lv[i]);
        S.text(`${r(pr / 1000, 1)} kPa`, X + 14, g.cy - hh - st.lv[i] + 4, { size: 11, align: "left", c: "#1d4ed8", halo: true });
        S.arrow(X - 20, g.cy + g.h1 / 2 + 24, X - 20 + Math.min(70, v * 9), g.cy + g.h1 / 2 + 24, C.red, `${r(v, 1)} m/s`, { w: 1.8, fs: 11 }); });
      S.hud(`p + ρv²/2 = const`, `tor joyda: v₂ = ${r(v2(), 2)} m/s, p₂ = ${r(p2() / 1000, 1)} kPa`, { dig: 1 });
    };
    function info() {
      S.out.innerHTML = S.f(`S₁v₁ = S₂v₂ → v₂ = v₁·S₁/S₂ = ${r(st.v1, 1)}/${r(st.ratio, 2)} = <b>${r(v2(), 2)} m/s</b>`, "uzluksizlik tenglamasi")
        + S.f(`p₁ + ρv₁²/2 = p₂ + ρv₂²/2 → p₂ = <b>${r(p2() / 1000, 1)} kPa</b>`, "Bernulli tenglamasi")
        + `<p class="sl-hint">Quvur toraygan joyda suv tezroq oqadi va <b>bosimi kamayadi</b> — o‘rtadagi naychada suv ustuni pastroq. Hayotda: samolyot qanoti (ustida havo tez — bosim kam → ko‘tarish kuchi), purkagich, ikki yonma-yon kema bir-biriga tortiladi, shamolda tom ko‘chishi.</p>`;
    }
    S.controls.append(slider({ label: "Oqim tezligi v₁", min: 0.5, max: 3, step: 0.1, value: st.v1, fmt: (v) => r(v, 1) + " m/s", onInput: (v) => { st.v1 = v; info(); } }),
      slider({ label: "Toraygan qism kesimi S₂/S₁", min: 0.25, max: 1, step: 0.05, value: st.ratio, fmt: (v) => r(v, 2), onInput: (v) => { st.ratio = v; info(); } }), S.timeCtl({ slow: false }));
    info();
  };
})();
