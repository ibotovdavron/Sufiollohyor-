/* Fizika jonli tajribalari (2-qism): gaz porsheni va izojarayonlar, molekulalar tezligi, Broun harakati, kalorimetr,
   issiqlik dvigateli, kuchlarni qo'shish, qiya tekislik, aylana bo'ylab harakat va orbitalar, liftdagi og'irlik,
   richag va momentlar, mayatniklar, to'lqinlar va tovush, Bernulli. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const { animCanvas, plot, arrow, label, r2, ink } = window.FIZ;
  const PI = Math.PI, g0 = 9.81;

  // ===================================================================
  // 1. Gaz porsheni: p, V, T va izojarayonlar (p–V grafik)
  // ===================================================================
  W.gasPiston = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎈 Ideal gaz: porshen ostidagi molekulalar");
    let mode = p.mode || "free", T = 300, V = 2, N = 40, n = 0.1;
    const P = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), a: Math.random() * 6.28 }));
    const hist = [];
    const pres = () => (n * 8.314 * T) / (V / 1000) / 1000; // kPa
    animCanvas(stage, 340, 200, (c, dt) => {
      c.clearRect(0, 0, 340, 200); const w = 60 + V * 55, sp = Math.sqrt(T) * 0.035;
      c.strokeStyle = ink(); c.lineWidth = 3; c.strokeRect(10, 20, w, 160);
      c.fillStyle = "#64748b"; c.fillRect(10 + w, 22, 10, 156); c.fillRect(20 + w, 92, 330 - w, 16);
      const hot = Math.min(1, Math.max(0, (T - 150) / 600));
      for (let i = 0; i < N; i++) { const q = P[i]; q.a += (Math.random() - 0.5) * 0.4; q.x += Math.cos(q.a) * sp * dt / (V * 0.5); q.y += Math.sin(q.a) * sp * dt * 1.2;
        if (q.x < 0 || q.x > 1) { q.a = PI - q.a; q.x = Math.max(0, Math.min(1, q.x)); } if (q.y < 0 || q.y > 1) { q.a = -q.a; q.y = Math.max(0, Math.min(1, q.y)); }
        c.fillStyle = `hsl(${220 - hot * 220} 85% 60%)`; c.beginPath(); c.arc(14 + q.x * (w - 8), 24 + q.y * 152, 3.6, 0, 7); c.fill(); }
      label(c, 10 + w / 2, 14, `p = ${r2(pres(), 1)} kPa`, "#fde047");
    });
    const pv = h("div"); stage.append(pv);
    function info() {
      const pp = pres(); if (!hist.length || Math.hypot(hist[hist.length - 1][0] - V, hist[hist.length - 1][1] - pp) > 0.5) hist.push([V, pp]); if (hist.length > 120) hist.shift();
      const G = plot(0, 4.2, 0, 1400, 340, 170, ["V, l", "p, kPa"]);
      if (mode === "iso-T") G.curve((v) => (n * 8.314 * T) / (v / 1000) / 1000, "rgba(253,224,71,.5)", 1.5, 0.3, 4.2);
      G.poly(hist, "#38bdf8", 2.5); G.dot(V, pp);
      pv.innerHTML = ""; pv.append(G.g);
      const txt = { free: "pV = νRT — Mendeleyev–Klapeyron tenglamasi. Uchala kattalikni erkin o‘zgartiring.", "iso-T": "<b>Izotermik</b> (T = const, Boyl–Mariott): pV = const. Hajm 2 marta kamaysa, bosim 2 marta ortadi. Grafigi — giperbola (izoterma).", "iso-p": "<b>Izobarik</b> (p = const, Gey-Lyussak): V/T = const. Qizdirilganda gaz kengayadi, porshen ko‘tariladi.", "iso-V": "<b>Izoxorik</b> (V = const, Sharl): p/T = const. Yopiq idishdagi gaz qizdirilsa, bosimi ortadi (shuning uchun ballonni olovga tashlab bo‘lmaydi!)." }[mode];
      out.innerHTML = `<div class="big-num">p = ${r2(pp, 1)} kPa · V = ${r2(V, 2)} l · T = ${Math.round(T)} K (${Math.round(T - 273)} °C)</div><div>${txt}</div><div class="muted">Bosim — molekulalarning idish devoriga urilishlari natijasi. Harorat ortsa, molekulalar tezlashadi (rangi qizaradi).</div>`;
    }
    const pFix = () => pres();
    function render() {
      controls.innerHTML = ""; hist.length = 0;
      if (!p.mode) controls.append(buttons(["Erkin", "Izotermik T=const", "Izobarik p=const", "Izoxorik V=const"], (i) => { mode = ["free", "iso-T", "iso-p", "iso-V"][i]; render(); }, ["free", "iso-T", "iso-p", "iso-V"].indexOf(mode)));
      const p0 = pFix();
      if (mode !== "iso-T") controls.append(slider({ label: "Harorat T", min: 150, max: 900, step: 10, value: T, fmt: (v) => v + " K", onInput: (v) => { T = v; if (mode === "iso-p") { V = Math.max(0.3, Math.min(4.2, (n * 8.314 * T) / (p0 * 1000) * 1000)); } info(); } }));
      if (mode !== "iso-V" && mode !== "iso-p") controls.append(slider({ label: "Hajm V", min: 0.3, max: 4.2, step: 0.1, value: V, fmt: (v) => num(v) + " l", onInput: (v) => { V = v; info(); } }));
      if (mode === "free") controls.append(slider({ label: "Molekulalar soni", min: 5, max: 80, value: N, onInput: (v) => { N = v; n = v / 400; info(); } }));
      info();
    }
    render();
  };

  // ===================================================================
  // 2. Molekulalar tezligi (Maksvell taqsimoti) va Broun harakati
  // ===================================================================
  W.molecules = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔬 Molekulalar harakati: Broun zarrachasi va tezliklar taqsimoti");
    let T = 300, M = 0.029;
    const P = Array.from({ length: 70 }, () => ({ x: Math.random() * 340, y: Math.random() * 180, vx: 0, vy: 0 })), B = { x: 170, y: 90, vx: 0, vy: 0, tr: [] };
    const rnd = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.4;
    animCanvas(stage, 340, 180, (c, dt) => {
      const sp = Math.sqrt(T / 300) * 90;
      c.clearRect(0, 0, 340, 180);
      for (const q of P) { if (Math.random() < 0.05) { q.vx = rnd() * sp; q.vy = rnd() * sp; } q.x += q.vx * dt; q.y += q.vy * dt; if (q.x < 0 || q.x > 340) q.vx *= -1; if (q.y < 0 || q.y > 180) q.vy *= -1; q.x = Math.max(0, Math.min(340, q.x)); q.y = Math.max(0, Math.min(180, q.y)); c.fillStyle = "rgba(125,211,252,.8)"; c.beginPath(); c.arc(q.x, q.y, 2.5, 0, 7); c.fill(); }
      B.vx += rnd() * sp * 0.08; B.vy += rnd() * sp * 0.08; B.vx *= 0.9; B.vy *= 0.9; B.x = Math.max(20, Math.min(320, B.x + B.vx * dt)); B.y = Math.max(20, Math.min(160, B.y + B.vy * dt));
      B.tr.push([B.x, B.y]); if (B.tr.length > 400) B.tr.shift();
      c.strokeStyle = "rgba(253,224,71,.6)"; c.lineWidth = 1.2; c.beginPath(); B.tr.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      c.fillStyle = "#f97316"; c.beginPath(); c.arc(B.x, B.y, 9, 0, 7); c.fill();
    });
    const hg = h("div"); stage.append(hg);
    function info() {
      const k = 1.38e-23, m = M / 6.02e23, vp = Math.sqrt((2 * 8.314 * T) / M), vrms = Math.sqrt((3 * 8.314 * T) / M);
      const f = (v) => 4 * PI * (m / (2 * PI * k * T)) ** 1.5 * v * v * Math.exp((-m * v * v) / (2 * k * T));
      const G = plot(0, 2000, 0, 0.0025, 340, 150, ["v, m/s", "ulush"]); G.curve(f, "#38bdf8", 2.5); G.dot(vrms, f(vrms)); G.text(vrms, f(vrms) * 1.08, "v_kv", "#fde047", "middle");
      hg.innerHTML = ""; hg.append(G.g);
      out.innerHTML = `<div class="big-num">v<sub>kv</sub> = √(3RT/M) = ${Math.round(vrms)} m/s · E = 3/2·kT = ${r2(1.5 * k * T * 1e21, 2)}·10⁻²¹ J</div><div>Molekulalar har xil tezlikda harakatlanadi; ko‘pchiligi ${Math.round(vp)} m/s atrofida. Harorat ortsa — egri chiziq o‘ngga suriladi va yassilanadi.</div><div class="muted">To‘q sariq — Broun zarrachasi (chang, gul changi): uni ko‘rinmas molekulalar har tomondan turtib, tartibsiz yo‘l chizdiradi. Bu molekulalar mavjudligining isboti (1827, R. Broun).</div>`;
    }
    controls.append(slider({ label: "Harorat T", min: 100, max: 1200, step: 10, value: T, fmt: (v) => v + " K", onInput: (v) => { T = v; info(); } }), buttons(["Havo (29)", "Vodorod H₂ (2)", "Kislorod O₂ (32)", "Karbonat angidrid CO₂ (44)"], (i) => { M = [0.029, 0.002, 0.032, 0.044][i]; info(); }, 0));
    info();
  };

  // ===================================================================
  // 3. Kalorimetr: issiqlik muvozanati, solishtirma issiqlik sig'imi, yoqilg'i
  // ===================================================================
  const MAT = [["Suv", 4200, "#38bdf8"], ["Alyuminiy", 920, "#cbd5e1"], ["Temir", 460, "#94a3b8"], ["Mis", 400, "#c2703d"], ["Qo‘rg‘oshin", 140, "#64748b"], ["Muz (qattiq)", 2100, "#e0f2fe"]];
  const FUEL = [["Yog‘och", 10], ["Toshko‘mir", 27], ["Spirt", 27], ["Benzin", 46], ["Tabiiy gaz", 44], ["Vodorod", 120]];
  W.calorimeter = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌡 Kalorimetr: issiq jismni sovuq suvga tushiramiz");
    let mode = p.mode || "mix", mi = 2, m1 = 0.2, t1 = 100, m2 = 0.3, t2 = 20, fuel = 3, mf = 10;
    function draw() {
      if (mode === "fuel") {
        const q = FUEL[fuel][1] * 1e6, Q = q * mf / 1000, mw = Q / (4200 * 80);
        stage.innerHTML = `<div class="fz-fuel">${FUEL.map(([n, v], i) => `<div class="${i === fuel ? "on" : ""}"><b>${n}</b><i style="width:${(v / 120) * 100}%"></i><span>${v} MJ/kg</span></div>`).join("")}</div>`;
        out.innerHTML = `<div class="big-num">Q = q·m = ${FUEL[fuel][1]}·10⁶ · ${mf / 1000} = ${r2(Q / 1e6, 2)} MJ</div><div>Bu issiqlik bilan ≈ <b>${r2(mw, 1)} kg</b> suvni 20 °C dan 100 °C gacha qizdirish mumkin (Q = cmΔT).</div><div class="muted">Solishtirma yonish issiqligi q — 1 kg yoqilg‘i to‘liq yonganda ajraladigan issiqlik.</div>`;
        return;
      }
      const [n, c1, col] = MAT[mi], c2 = 4200, T = (c1 * m1 * t1 + c2 * m2 * t2) / (c1 * m1 + c2 * m2);
      const g = svg(340, 190, "fz-svg");
      s("rect", { x: 100, y: 40, width: 140, height: 130, rx: 8, fill: "none", stroke: "currentColor", "stroke-width": 3 }, g);
      s("rect", { x: 103, y: 80, width: 134, height: 87, fill: "#38bdf8", opacity: 0.4 }, g);
      s("rect", { x: 150, y: 120, width: 40, height: 34, rx: 4, fill: col }, g); s("text", { x: 170, y: 141, "text-anchor": "middle", "font-size": 10, "font-weight": 800, fill: "#111", text: n.split(" ")[0] }, g);
      const th = (x, t, lbl) => { s("rect", { x, y: 20, width: 10, height: 110, rx: 5, fill: "none", stroke: "currentColor" }, g); s("rect", { x: x + 2, y: 128 - t, width: 6, height: t, fill: "#ef4444" }, g); s("text", { x: x + 5, y: 148, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "currentColor", text: lbl }, g); };
      th(40, t1 * 1, Math.round(t1) + "°"); th(285, T, r2(T, 1) + "°");
      s("text", { x: 45, y: 166, "text-anchor": "middle", "font-size": 10, fill: "currentColor", text: "jism" }, g); s("text", { x: 290, y: 166, "text-anchor": "middle", "font-size": 10, fill: "currentColor", text: "aralashma" }, g);
      stage.innerHTML = ""; stage.append(g);
      const Q1 = c1 * m1 * (t1 - T), Q2 = c2 * m2 * (T - t2);
      out.innerHTML = `<div class="big-num">θ = (c₁m₁t₁ + c₂m₂t₂)/(c₁m₁ + c₂m₂) = ${r2(T, 1)} °C</div><div>Jism berdi: Q₁ = c₁m₁(t₁ − θ) = ${Math.round(Q1)} J · Suv oldi: Q₂ = c₂m₂(θ − t₂) = ${Math.round(Q2)} J → <b>Q₁ = Q₂</b> (issiqlik balansi)</div><div class="muted">${n}ning solishtirma issiqlik sig‘imi c = ${c1} J/(kg·°C). Suvniki eng katta — 4200: shuning uchun dengiz bo‘yida iqlim yumshoq, suv isitgichlarda ishlatiladi.</div>`;
    }
    function render() {
      controls.innerHTML = "";
      if (!p.mode) controls.append(buttons(["Aralashtirish", "Yoqilg‘i yonishi"], (i) => { mode = ["mix", "fuel"][i]; render(); }, mode === "fuel" ? 1 : 0));
      if (mode === "fuel") controls.append(buttons(FUEL.map((f) => f[0]), (i) => { fuel = i; draw(); }, fuel), slider({ label: "Yoqilg‘i massasi", min: 1, max: 1000, value: mf, fmt: (v) => v + " g", onInput: (v) => { mf = v; draw(); } }));
      else controls.append(buttons(MAT.map((m) => m[0]), (i) => { mi = i; draw(); }, mi), slider({ label: "Jism massasi", min: 0.05, max: 1, step: 0.05, value: m1, fmt: (v) => num(v) + " kg", onInput: (v) => { m1 = v; draw(); } }), slider({ label: "Jism harorati", min: 20, max: 100, value: t1, fmt: (v) => v + " °C", onInput: (v) => { t1 = v; draw(); } }), slider({ label: "Suv massasi", min: 0.1, max: 1, step: 0.05, value: m2, fmt: (v) => num(v) + " kg", onInput: (v) => { m2 = v; draw(); } }), slider({ label: "Suv harorati", min: 0, max: 60, value: t2, fmt: (v) => v + " °C", onInput: (v) => { t2 = v; draw(); } }));
      draw();
    }
    render();
  };

  // ===================================================================
  // 4. Ichki yonuv dvigateli (4 takt) va FIK
  // ===================================================================
  W.engine = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🚗 To‘rt taktli ichki yonuv dvigateli");
    let T1 = 1800, T2 = 500, speed = 1;
    const STR = ["1. So‘rish — yoqilg‘i aralashmasi kiradi", "2. Siqish — aralashma siqiladi, qiziydi", "3. Ish yo‘li — uchqun, portlash, porshen pastga itariladi", "4. Chiqarish — ishlatilgan gaz chiqib ketadi"];
    animCanvas(stage, 340, 220, (c, dt, t) => {
      const ph = (t * speed * 0.5) % 4, k = Math.floor(ph), f = ph - k, crank = ph * PI, y = 70 + 45 * (1 - Math.cos(crank)) / 2 * 2;
      c.clearRect(0, 0, 340, 220); c.strokeStyle = ink(); c.lineWidth = 3;
      c.strokeRect(110, 30, 80, 130);
      const gas = k === 0 ? "rgba(134,239,172,.45)" : k === 1 ? `rgba(250,204,21,${0.3 + f * 0.4})` : k === 2 ? `rgba(239,68,68,${0.8 - f * 0.5})` : "rgba(148,163,184,.4)";
      c.fillStyle = gas; c.fillRect(112, 32, 76, y - 32);
      c.fillStyle = "#64748b"; c.fillRect(112, y, 76, 22);
      const cx = 150, cy = 190, r = 22, px = cx + r * Math.sin(crank), py = cy - r * Math.cos(crank) * -1;
      c.strokeStyle = "#94a3b8"; c.lineWidth = 6; c.beginPath(); c.moveTo(150, y + 22); c.lineTo(px, py); c.stroke();
      c.strokeStyle = ink(); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
      // klapanlar va sham
      c.fillStyle = k === 0 ? "#22c55e" : "#475569"; c.fillRect(118, 18, 18, 10); c.fillStyle = k === 3 ? "#22c55e" : "#475569"; c.fillRect(164, 18, 18, 10);
      if (k === 2 && f < 0.15) { c.fillStyle = "#fde047"; c.beginPath(); c.arc(150, 34, 10, 0, 7); c.fill(); }
      label(c, 150, 14, "kirish ⇩     ⇧ chiqish", "#cbd5e1", "rgba(0,0,0,0)", 10);
      c.font = "700 12px system-ui"; c.textAlign = "left"; c.fillStyle = ink(); STR.forEach((s_, i) => { c.globalAlpha = i === k ? 1 : 0.35; c.fillText(s_.split(" — ")[0], 210, 50 + i * 30); }); c.globalAlpha = 1;
    });
    function info() { const eta = 1 - T2 / T1; out.innerHTML = `<div class="big-num">η<sub>max</sub> = (T₁ − T₂)/T₁ = (${T1} − ${T2})/${T1} = ${Math.round(eta * 100)}%</div><div>Faqat 3-takt (ish yo‘li) foydali ish bajaradi, qolgan taktlar maxovik inersiyasi hisobiga o‘tadi. Haqiqiy benzin dvigatelining FIK ~25–30%, dizelniki ~40%.</div><div class="muted">Termodinamikaning II qonuni: issiqlikning hammasini ishga aylantirib bo‘lmaydi — bir qismi sovutgichga (atrofga) berilishi shart.</div>`; }
    controls.append(slider({ label: "Isitgich T₁ (yonish)", min: 600, max: 2500, step: 50, value: T1, fmt: (v) => v + " K", onInput: (v) => { T1 = v; info(); } }), slider({ label: "Sovutgich T₂", min: 280, max: 600, step: 10, value: T2, fmt: (v) => v + " K", onInput: (v) => { T2 = v; info(); } }), slider({ label: "Tezlik", min: 0.2, max: 3, step: 0.1, value: speed, fmt: (v) => num(v) + "×", onInput: (v) => { speed = v; } }));
    info();
  };

  // ===================================================================
  // 5. Kuchlarni qo'shish (vektorlar)
  // ===================================================================
  W.forces = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "➕ Kuchlarni qo‘shish: strelkalar uchini suring");
    let F = [[60, -20], [10, -70]];
    const sc = 1, cx = 170, cy = 140; let drag = -1;
    const cv = animCanvas(stage, 340, 240, (c) => {
      c.clearRect(0, 0, 340, 240); c.strokeStyle = "rgba(148,163,184,.25)"; c.lineWidth = 1; for (let x = 10; x < 340; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 240); c.stroke(); } for (let y = 0; y < 240; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(340, y); c.stroke(); }
      const R = [F[0][0] + F[1][0], F[0][1] + F[1][1]];
      c.setLineDash([5, 5]); c.strokeStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.moveTo(cx + F[0][0], cy + F[0][1]); c.lineTo(cx + R[0], cy + R[1]); c.lineTo(cx + F[1][0], cy + F[1][1]); c.stroke(); c.setLineDash([]);
      arrow(c, cx, cy, cx + F[0][0], cy + F[0][1], "#38bdf8"); arrow(c, cx, cy, cx + F[1][0], cy + F[1][1], "#f472b6"); arrow(c, cx, cy, cx + R[0], cy + R[1], "#fde047", 4);
      c.fillStyle = "#94a3b8"; c.fillRect(cx - 12, cy - 12, 24, 24);
      label(c, cx + F[0][0], cy + F[0][1] - 10, "F₁", "#38bdf8"); label(c, cx + F[1][0], cy + F[1][1] - 10, "F₂", "#f472b6"); label(c, cx + R[0], cy + R[1] - 12, "R", "#fde047");
      info();
    });
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 340 - cx, (e.clientY - r.top) / r.height * 240 - cy]; };
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", (e) => { const [x, y] = pos(e); drag = Math.hypot(x - F[0][0], y - F[0][1]) < Math.hypot(x - F[1][0], y - F[1][1]) ? 0 : 1; F[drag] = [x, y]; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (drag >= 0) F[drag] = pos(e); });
    cv.addEventListener("pointerup", () => (drag = -1));
    let lastTxt = "";
    function info() {
      const m = (v) => Math.hypot(v[0], v[1]) / 10, R = [F[0][0] + F[1][0], F[0][1] + F[1][1]], ang = Math.acos(Math.max(-1, Math.min(1, (F[0][0] * F[1][0] + F[0][1] * F[1][1]) / (Math.hypot(...F[0]) * Math.hypot(...F[1]) || 1)))) * 180 / PI;
      const txt = `<div class="big-num">F₁ = ${r2(m(F[0]), 1)} N · F₂ = ${r2(m(F[1]), 1)} N · α = ${Math.round(ang)}° → R = ${r2(m(R), 1)} N</div><div>R = √(F₁² + F₂² + 2F₁F₂cosα) — parallelogramm qoidasi. Bir tomonga yo‘nalsa R = F₁ + F₂, qarama-qarshi bo‘lsa R = |F₁ − F₂|.</div>`;
      if (txt !== lastTxt) { out.innerHTML = txt; lastTxt = txt; }
    }
  };

  // ===================================================================
  // 6. Qiya tekislik: kuchlar, tezlanish, ish va FIK
  // ===================================================================
  W.incline = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⛰ Qiya tekislik: burchak, massa va ishqalanish");
    let a = 30, m = 2, mu = 0.2, pull = false, pos = 0, v = 0;
    animCanvas(stage, 340, 220, (c, dt) => {
      const al = (a * PI) / 180, Fg = m * g0, N = Fg * Math.cos(al), Fs = Fg * Math.sin(al), Ff = mu * N;
      const acc = pull ? 0 : Fs > Ff || v > 0 ? (Fs - Ff) / m : 0; if (!pull) { v = Math.max(0, v + acc * dt); pos = Math.min(1, pos + (v * dt) / 5); if (pos >= 1) { pos = 0; v = 0; } }
      c.clearRect(0, 0, 340, 220); const L = 260, x0 = 40, y0 = 200, xt = x0 + L * Math.cos(al), yt = y0 - L * Math.sin(al);
      c.fillStyle = "rgba(148,163,184,.35)"; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + L * Math.cos(al), y0); c.lineTo(xt, yt); c.closePath(); c.fill();
      const d = 1 - pos, bx = x0 + d * L * Math.cos(al) * 0.85, by = y0 - d * L * Math.sin(al) * 0.85;
      c.save(); c.translate(bx, by); c.rotate(-al); c.fillStyle = "#f97316"; c.fillRect(-16, -26, 32, 26); c.restore();
      const cxb = bx - 13 * Math.sin(al), cyb = by - 13 * Math.cos(al), k = 2.4;
      arrow(c, cxb, cyb, cxb, cyb + Fg * k, "#ef4444"); label(c, cxb + 18, cyb + Fg * k, "mg", "#ef4444");
      arrow(c, cxb, cyb, cxb - N * k * Math.sin(al), cyb - N * k * Math.cos(al), "#38bdf8"); label(c, cxb - N * k * Math.sin(al), cyb - N * k * Math.cos(al) - 10, "N", "#38bdf8");
      if (Ff > 0.01) arrow(c, cxb, cyb, cxb + Math.min(Ff, Fs + 0.001) * k * Math.cos(al), cyb - Math.min(Ff, Fs + 0.001) * k * Math.sin(al), "#a3e635");
      label(c, x0 + 30, y0 - 8, a + "°", "#fde047");
    });
    function info() {
      const al = (a * PI) / 180, Fs = m * g0 * Math.sin(al), Ff = mu * m * g0 * Math.cos(al), acc = Math.max(0, (Fs - Ff) / m), h_ = 1 * Math.sin(al), Ffoy = m * g0 * h_, Fpull = Fs + Ff, Asarf = Fpull * 1, eta = Ffoy / Asarf;
      out.innerHTML = `<div class="big-num">a = g(sinα − μcosα) = ${r2(acc, 2)} m/s² ${acc === 0 ? "— jism tinch turadi (ishqalanish ushlab turibdi)" : ""}</div>
        <div>Qiya tekislik bo‘ylab yuqoriga tortish kuchi: F = mg(sinα + μcosα) = <b>${r2(Fpull, 1)} N</b> (mg = ${r2(m * g0, 1)} N o‘rniga)</div>
        <div>1 m yo‘lda: foydali ish A<sub>f</sub> = mgh = ${r2(Ffoy, 1)} J, sarflangan ish A<sub>s</sub> = F·l = ${r2(Asarf, 1)} J → <b>FIK η = ${Math.round(eta * 100)}%</b></div>
        <div class="muted">Qiya tekislik kuchdan yutdiradi, lekin yo‘ldan yutqazadi. Ishqalanish qancha kam bo‘lsa, FIK shuncha yuqori. Qizil — og‘irlik, ko‘k — tayanch reaksiyasi, yashil — ishqalanish.</div>`;
    }
    controls.append(slider({ label: "Qiyalik burchagi α", min: 5, max: 60, value: a, fmt: (v) => v + "°", onInput: (v) => { a = v; pos = 0; v = 0; info(); } }), slider({ label: "Massa m", min: 0.5, max: 5, step: 0.5, value: m, fmt: (v) => num(v) + " kg", onInput: (v) => { m = v; info(); } }), slider({ label: "Ishqalanish koeffitsiyenti μ", min: 0, max: 0.8, step: 0.05, value: mu, fmt: (v) => num(v), onInput: (v) => { mu = v; pos = 0; v = 0; info(); } }));
    info(); void pull;
  };

  // ===================================================================
  // 7. Aylana bo'ylab harakat va gravitatsiya (orbita, kosmik tezliklar)
  // ===================================================================
  W.orbit = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🛰 Yer atrofida sun’iy yo‘ldosh: tezlikni tanlang");
    let v0 = 7.9, st = null;
    const R = 6371e3, GM = 3.986e14, scale = 340 / (6 * R);
    const reset = () => (st = { x: 0, y: R + 300e3, vx: v0 * 1000, vy: 0, tr: [], done: "" });
    reset();
    animCanvas(stage, 340, 300, (c, dt) => {
      for (let k = 0; k < 40; k++) { if (st.done) break; const r = Math.hypot(st.x, st.y), a = -GM / (r * r * r); st.vx += a * st.x * 6; st.vy += a * st.y * 6; st.x += st.vx * 6; st.y += st.vy * 6; if (r < R) st.done = "💥 Yerga qulab tushdi"; if (r > 4 * R) st.done = "🚀 Yerning tortishishidan chiqib ketdi"; if (k % 8 === 0) { st.tr.push([st.x, st.y]); if (st.tr.length > 900) st.tr.shift(); } }
      c.clearRect(0, 0, 340, 300); const cx = 170, cy = 150;
      const gr = c.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, R * scale); gr.addColorStop(0, "#60a5fa"); gr.addColorStop(1, "#1d4ed8"); c.fillStyle = gr; c.beginPath(); c.arc(cx, cy, R * scale, 0, 7); c.fill();
      c.strokeStyle = "rgba(253,224,71,.7)"; c.lineWidth = 1.5; c.beginPath(); st.tr.forEach(([x, y], i) => (i ? c.lineTo(cx + x * scale, cy - y * scale) : c.moveTo(cx + x * scale, cy - y * scale))); c.stroke();
      c.fillStyle = "#f8fafc"; c.beginPath(); c.arc(cx + st.x * scale, cy - st.y * scale, 4, 0, 7); c.fill();
      if (st.done) label(c, 170, 285, st.done, "#fde047");
    });
    function info() { out.innerHTML = `<div class="big-num">v₀ = ${num(v0)} km/s</div><div>${v0 < 7.9 ? "Birinchi kosmik tezlikdan kichik — yo‘ldosh Yerga qaytib tushadi." : v0 < 8.0 ? "≈ <b>Birinchi kosmik tezlik</b> v₁ = √(gR) ≈ 7,9 km/s — doiraviy orbita." : v0 < 11.2 ? "v₁ dan katta, v₂ dan kichik — <b>elliptik orbita</b>." : "≥ <b>Ikkinchi kosmik tezlik</b> v₂ = √2·v₁ ≈ 11,2 km/s — Yerdan butunlay uzoqlashadi."}</div><div class="muted">Markazga intilma tezlanish a = v²/R ni Yerning tortishish kuchi beradi: mv²/R = GMm/R². Orbitadagi kosmonavt vaznsizlikda — u doimo “tushib” turadi, lekin Yer yonidan o‘tib ketadi.</div>`; }
    controls.append(slider({ label: "Boshlang‘ich tezlik", min: 5, max: 12, step: 0.1, value: v0, fmt: (v) => num(v) + " km/s", onInput: (v) => { v0 = v; reset(); info(); } }), button("↺ Qayta uchirish", () => reset(), "ghost"));
    info();
  };
  W.circular = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔄 Aylana bo‘ylab tekis harakat: markazga intilma tezlanish");
    let v = 3, r = 1, m = 0.5;
    animCanvas(stage, 340, 220, (c, dt, t) => {
      c.clearRect(0, 0, 340, 220); const cx = 170, cy = 110, R = 40 + r * 40, w = v / r, a = w * t;
      c.strokeStyle = "rgba(255,255,255,.3)"; c.setLineDash([4, 4]); c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.setLineDash([]);
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      c.strokeStyle = ink(); c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
      c.fillStyle = "#f97316"; c.beginPath(); c.arc(x, y, 10, 0, 7); c.fill();
      arrow(c, x, y, x - Math.sin(a) * v * 12, y + Math.cos(a) * v * 12, "#38bdf8"); arrow(c, x, y, x + (cx - x) * 0.45, y + (cy - y) * 0.45, "#ef4444");
      label(c, 60, 20, "v (ko‘k) — urinma", "#38bdf8"); label(c, 280, 20, "a (qizil) — markazga", "#ef4444");
    });
    function info() { const a = (v * v) / r, T = (2 * PI * r) / v; out.innerHTML = `<div class="big-num">a = v²/R = ${r2(a, 2)} m/s² · F = ma = ${r2(m * a, 2)} N · T = 2πR/v = ${r2(T, 2)} s</div><div class="muted">Tezlik moduli o‘zgarmasa ham, yo‘nalishi doim o‘zgaradi — shuning uchun tezlanish bor. Ip uzilsa, jism urinma bo‘ylab (ko‘k strelka) uchib ketadi. Burilishda mashinani yo‘lga g‘ildirak ishqalanishi ushlab turadi.</div>`; }
    controls.append(slider({ label: "Tezlik v", min: 0.5, max: 6, step: 0.5, value: v, fmt: (x) => num(x) + " m/s", onInput: (x) => { v = x; info(); } }), slider({ label: "Radius R", min: 0.5, max: 2, step: 0.25, value: r, fmt: (x) => num(x) + " m", onInput: (x) => { r = x; info(); } }), slider({ label: "Massa m", min: 0.1, max: 2, step: 0.1, value: m, fmt: (x) => num(x) + " kg", onInput: (x) => { m = x; info(); } }));
    info();
  };

  // ===================================================================
  // 8. Liftdagi og'irlik
  // ===================================================================
  W.elevator = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🛗 Liftda tarozi: og‘irlik harakatga bog‘liq");
    let a = 0, m = 50;
    animCanvas(stage, 340, 220, (c, dt, t) => {
      c.clearRect(0, 0, 340, 220); const y = 60 + Math.sin(t * 0.8) * (a ? 30 : 0) * Math.sign(a);
      c.strokeStyle = ink(); c.lineWidth = 2; c.beginPath(); c.moveTo(170, 0); c.lineTo(170, y); c.stroke();
      c.strokeRect(120, y, 100, 130); c.font = "52px system-ui"; c.textAlign = "center"; c.fillText("🧍", 170, y + 105);
      c.fillStyle = "#64748b"; c.fillRect(140, y + 112, 60, 10);
      const P = m * (g0 + a); label(c, 170, y + 140, `${Math.round(P)} N ≈ ${r2(P / g0, 1)} kg`, "#fde047");
      if (a) arrow(c, 250, y + 65, 250, y + 65 - Math.sign(a) * 40, "#ef4444"); label(c, 285, y + 65, a > 0 ? "a ↑" : a < 0 ? "a ↓" : "", "#ef4444");
    });
    function info() { const P = m * (g0 + a); out.innerHTML = `<div class="big-num">P = m(g + a) = ${m}·(${num(g0)} ${a >= 0 ? "+" : "−"} ${Math.abs(a)}) = ${Math.round(P)} N</div><div>${a > 0 ? "Lift yuqoriga tezlanish bilan ketyapti (yoki pastga ketib tormozlanyapti) — <b>o‘ta yuklanish</b>, og‘irlik ortadi." : a < 0 ? (a <= -g0 ? "a = −g: <b>vaznsizlik</b>! Og‘irlik nolga teng (erkin tushish, kosmonavtlar)." : "Pastga tezlanish — og‘irlik <b>kamayadi</b>.") : "Tinch yoki tekis harakat — og‘irlik P = mg."}</div><div class="muted">Massa o‘zgarmaydi, o‘zgaradigan — og‘irlik (jism tayanchga bosadigan kuch).</div>`; }
    controls.append(slider({ label: "Lift tezlanishi a", min: -9.8, max: 6, step: 0.2, value: a, fmt: (v) => num(v) + " m/s²", onInput: (v) => { a = Math.round(v * 10) / 10; info(); } }), slider({ label: "Odam massasi", min: 20, max: 100, step: 5, value: m, fmt: (v) => v + " kg", onInput: (v) => { m = v; info(); } }));
    info();
  };

  // ===================================================================
  // 9. Richag va kuch momenti
  // ===================================================================
  W.lever = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚖️ Richag: yuklarni joylashtiring — momentlar qoidasi");
    let m1 = 4, d1 = -3, m2 = 2, d2 = 4, ang = 0;
    animCanvas(stage, 340, 200, (c, dt) => {
      const M = m1 * d1 + m2 * d2; const target = Math.max(-0.35, Math.min(0.35, M * 0.03)); ang += (target - ang) * Math.min(1, dt * 4);
      c.clearRect(0, 0, 340, 200); const cx = 170, cy = 110, k = 26;
      c.fillStyle = "rgba(148,163,184,.5)"; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - 18, 175); c.lineTo(cx + 18, 175); c.closePath(); c.fill();
      c.save(); c.translate(cx, cy); c.rotate(ang); c.fillStyle = "#a16207"; c.fillRect(-140, -5, 280, 10);
      for (let i = -5; i <= 5; i++) { c.fillStyle = "#fde68a"; c.fillRect(i * k - 1, -5, 2, 10); }
      for (const [m, d, col] of [[m1, d1, "#38bdf8"], [m2, d2, "#f472b6"]]) { const s_ = 10 + m * 3; c.fillStyle = col; c.fillRect(d * k - s_ / 2, -5 - s_, s_, s_); c.fillStyle = "#04112a"; c.font = "800 11px system-ui"; c.textAlign = "center"; c.fillText(m + "kg", d * k, -9 - s_ / 2 + 4); }
      c.restore();
    });
    function info() { const M1 = m1 * g0 * Math.abs(d1) * 0.1, M2 = m2 * g0 * Math.abs(d2) * 0.1, bal = Math.abs(m1 * d1 + m2 * d2) < 1e-9; out.innerHTML = `<div class="big-num">M₁ = F₁·l₁ = ${r2(M1, 1)} N·m · M₂ = F₂·l₂ = ${r2(M2, 1)} N·m ${bal ? "→ 🎯 muvozanat!" : ""}</div><div>Richag muvozanatda: <b>F₁·l₁ = F₂·l₂</b> (momentlar qoidasi). Kichik kuch bilan katta yukni ko‘tarish uchun yelkani uzaytiramiz.</div><div class="muted">Qaychi, qisqich, belkurak, tarozi, eshik dastasi — richaglar. “Menga tayanch nuqta bering — Yerni ko‘taraman” (Arximed).</div>`; }
    controls.append(slider({ label: "Chap yuk m₁", min: 1, max: 8, value: m1, fmt: (v) => v + " kg", onInput: (v) => { m1 = v; info(); } }), slider({ label: "Chap yelka", min: 1, max: 5, value: -d1, fmt: (v) => v * 10 + " sm", onInput: (v) => { d1 = -v; info(); } }), slider({ label: "O‘ng yuk m₂", min: 1, max: 8, value: m2, fmt: (v) => v + " kg", onInput: (v) => { m2 = v; info(); } }), slider({ label: "O‘ng yelka", min: 1, max: 5, value: d2, fmt: (v) => v * 10 + " sm", onInput: (v) => { d2 = v; info(); } }));
    info();
  };

  // ===================================================================
  // 10. Mayatniklar (matematik va prujinali) + x(t) grafik
  // ===================================================================
  W.pendulum = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🕰 Mayatnik tebranishlari");
    let kind = p.kind || "math", L = 1, gg = g0, m = 0.5, kk = 20, A = 0.3, damp = 0;
    const tr = [];
    animCanvas(stage, 340, 230, (c, dt, t) => {
      const T = kind === "math" ? 2 * PI * Math.sqrt(L / gg) : 2 * PI * Math.sqrt(m / kk), x = A * Math.exp(-damp * t) * Math.cos((2 * PI * t) / T);
      tr.push(x); if (tr.length > 220) tr.shift();
      c.clearRect(0, 0, 340, 230); c.strokeStyle = ink(); c.lineWidth = 2;
      if (kind === "math") { const len = 40 + L * 60, ox = 80, oy = 10, th = x * 1.4, bx = ox + len * Math.sin(th), by = oy + len * Math.cos(th); c.beginPath(); c.moveTo(40, oy); c.lineTo(120, oy); c.stroke(); c.beginPath(); c.moveTo(ox, oy); c.lineTo(bx, by); c.stroke(); c.fillStyle = "#f97316"; c.beginPath(); c.arc(bx, by, 11, 0, 7); c.fill(); }
      else { const ox = 80, y = 110 + x * 140; c.beginPath(); c.moveTo(40, 10); c.lineTo(120, 10); c.stroke(); c.beginPath(); c.moveTo(ox, 10); for (let i = 1; i <= 16; i++) c.lineTo(ox + (i % 2 ? -10 : 10), 10 + ((y - 20) * i) / 16); c.lineTo(ox, y - 10); c.stroke(); c.fillStyle = "#f97316"; c.fillRect(ox - 14, y - 10, 28, 24); }
      c.strokeStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(160, 115); c.lineTo(335, 115); c.stroke();
      c.strokeStyle = "#38bdf8"; c.lineWidth = 2; c.beginPath(); tr.forEach((v, i) => { const X = 160 + i * 0.8, Y = 115 - v * 220; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke();
      label(c, 250, 220, "x(t) — garmonik tebranish", "#38bdf8");
    });
    function info() {
      const T = kind === "math" ? 2 * PI * Math.sqrt(L / gg) : 2 * PI * Math.sqrt(m / kk);
      out.innerHTML = `<div class="big-num">T = ${kind === "math" ? `2π√(l/g) = 2π√(${num(L)}/${num(gg)})` : `2π√(m/k) = 2π√(${num(m)}/${kk})`} = ${r2(T, 3)} s · ν = ${r2(1 / T, 3)} Gs</div><div class="muted">${kind === "math" ? "Matematik mayatnik davri massaga va (kichik) amplitudaga bog‘liq emas — faqat ip uzunligi va g ga. Shuning uchun g ni o‘lchash mumkin: g = 4π²l/T². Oyda (g = 1,62) mayatnik ancha sekin tebranadi." : "Prujina qattiqroq bo‘lsa (k katta) — tezroq, yuk og‘irroq bo‘lsa — sekinroq tebranadi."} ${damp ? "Ishqalanish tufayli amplituda kamayib boradi — so‘nuvchi tebranish." : ""}</div>`;
    }
    function render() {
      controls.innerHTML = "";
      if (!p.kind) controls.append(buttons(["Matematik mayatnik", "Prujinali mayatnik"], (i) => { kind = ["math", "spring"][i]; render(); }, kind === "math" ? 0 : 1));
      if (kind === "math") controls.append(slider({ label: "Ip uzunligi l", min: 0.2, max: 2.5, step: 0.1, value: L, fmt: (v) => num(v) + " m", onInput: (v) => { L = v; info(); } }), buttons(["Yer g=9,81", "Oy g=1,62", "Mars g=3,71", "Yupiter g=24,8"], (i) => { gg = [9.81, 1.62, 3.71, 24.8][i]; info(); }, 0));
      else controls.append(slider({ label: "Yuk massasi m", min: 0.1, max: 2, step: 0.1, value: m, fmt: (v) => num(v) + " kg", onInput: (v) => { m = v; info(); } }), slider({ label: "Bikrlik k", min: 5, max: 100, value: kk, fmt: (v) => v + " N/m", onInput: (v) => { kk = v; info(); } }));
      controls.append(h("label", { class: "kb-check" }, h("input", { type: "checkbox", onchange: (e) => { damp = e.target.checked ? 0.15 : 0; info(); } }), " So‘nish (ishqalanish)"));
      info();
    }
    render();
  };

  // ===================================================================
  // 11. To'lqinlar va tovush (ovoz bilan)
  // ===================================================================
  let actx = null;
  W.wave = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌊 Mexanik to‘lqinlar: ko‘ndalang va bo‘ylama");
    let kind = p.kind || "trans", A = 25, f = 1, v = 120, osc = null, gain = null;
    animCanvas(stage, 340, 200, (c, dt, t) => {
      const lam = v / f, k = (2 * PI) / lam, w = 2 * PI * f; c.clearRect(0, 0, 340, 200);
      if (kind === "trans" || kind === "sound") {
        c.strokeStyle = "#38bdf8"; c.lineWidth = 2.5; c.beginPath(); for (let x = 0; x <= 340; x += 3) { const y = 100 - A * Math.sin(w * t - k * x); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        for (let x = 10; x < 340; x += 20) { const y = 100 - A * Math.sin(w * t - k * x); c.fillStyle = x === 170 ? "#f97316" : "#e2e8f0"; c.beginPath(); c.arc(x, y, x === 170 ? 6 : 3, 0, 7); c.fill(); }
        if (lam < 330) { c.strokeStyle = "#fde047"; c.setLineDash([4, 4]); const x0 = 40; c.beginPath(); c.moveTo(x0, 160); c.lineTo(x0 + lam, 160); c.stroke(); c.setLineDash([]); label(c, x0 + lam / 2, 178, "λ = " + r2(lam / 100, 2) + " m", "#fde047"); }
      } else {
        for (let i = 0; i < 70; i++) { const x0 = 5 + i * 4.8, x = x0 + 8 * Math.sin(w * t - k * x0); for (let j = 0; j < 7; j++) { c.fillStyle = "#e2e8f0"; c.beginPath(); c.arc(x, 40 + j * 20, 2.2, 0, 7); c.fill(); } }
        label(c, 170, 190, "zichlashish ↔ siyraklanish", "#fde047");
      }
    });
    function info() {
      const lam = v / f; out.innerHTML = kind === "sound" ? `<div class="big-num">ν = ${Math.round(f * 220)} Gs · λ = v/ν = 340/${Math.round(f * 220)} = ${r2(340 / (f * 220), 2)} m</div><div>Tovush — havodagi bo‘ylama to‘lqin, tezligi ~340 m/s. Chastota katta — <b>ingichka</b> ovoz, amplituda katta — <b>baland</b> ovoz. Inson 20 Gs dan 20 000 Gs gacha eshitadi.</div>`
        : `<div class="big-num">λ = v/ν = ${r2(v / 100, 2)} / ${num(f)} = ${r2(lam / 100, 2)} m · T = 1/ν = ${r2(1 / f, 2)} s</div><div>${kind === "trans" ? "<b>Ko‘ndalang</b> to‘lqin: zarrachalar to‘lqin yo‘nalishiga perpendikulyar tebranadi (to‘q sariq nuqtani kuzating — u faqat yuqori-pastga harakatlanadi!)." : "<b>Bo‘ylama</b> to‘lqin: zarrachalar to‘lqin yo‘nalishi bo‘ylab tebranib, zichlashish va siyraklanish hosil qiladi (tovush, prujina)."} To‘lqin energiyani ko‘chiradi, moddani emas.</div>`;
    }
    const tone = button("🔊 Tovushni eshitish", () => {
      if (osc) { osc.stop(); osc = null; tone.textContent = "🔊 Tovushni eshitish"; return; }
      actx = actx || new (window.AudioContext || window.webkitAudioContext)(); osc = actx.createOscillator(); gain = actx.createGain(); gain.gain.value = 0.05 + A / 600; osc.frequency.value = f * 220; osc.connect(gain); gain.connect(actx.destination); osc.start(); tone.textContent = "🔇 To‘xtatish";
      setTimeout(() => { if (osc) { osc.stop(); osc = null; tone.textContent = "🔊 Tovushni eshitish"; } }, 4000);
    });
    function render() {
      controls.innerHTML = "";
      if (!p.kind) controls.append(buttons(["Ko‘ndalang", "Bo‘ylama", "Tovush"], (i) => { kind = ["trans", "long", "sound"][i]; render(); }, ["trans", "long", "sound"].indexOf(kind)));
      controls.append(slider({ label: kind === "sound" ? "Chastota (balandlik)" : "Chastota ν", min: 0.25, max: 4, step: 0.25, value: f, fmt: (x) => kind === "sound" ? Math.round(x * 220) + " Gs" : num(x) + " Gs", onInput: (x) => { f = x; if (osc) osc.frequency.value = x * 220; info(); } }), slider({ label: "Amplituda", min: 5, max: 60, value: A, fmt: (x) => x + " mm", onInput: (x) => { A = x; if (gain) gain.gain.value = 0.05 + x / 600; info(); } }));
      if (kind !== "sound") controls.append(slider({ label: "To‘lqin tezligi v", min: 40, max: 300, step: 10, value: v, fmt: (x) => r2(x / 100, 1) + " m/s", onInput: (x) => { v = x; info(); } }));
      else controls.append(tone);
      info();
    }
    render();
  };

  // ===================================================================
  // 12. Bernulli: tor quvurda tezlik ortadi, bosim kamayadi
  // ===================================================================
  W.bernoulli = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💨 Bernulli qonuni: quvur toraysa — tezlik ortadi, bosim kamayadi");
    let v1 = 2, ratio = 0.5;
    const pts = Array.from({ length: 60 }, () => ({ x: Math.random() * 340, y: Math.random() }));
    animCanvas(stage, 340, 220, (c, dt) => {
      const h1 = 80, h2 = h1 * ratio, v2 = v1 / ratio, half = (x) => (x < 110 ? h1 : x > 230 ? h1 : x < 140 ? h1 - ((h1 - h2) * (x - 110)) / 30 : x > 200 ? h2 + ((h1 - h2) * (x - 200)) / 30 : h2) / 2;
      c.clearRect(0, 0, 340, 220); const cy = 140;
      c.fillStyle = "rgba(56,189,248,.25)"; c.beginPath(); for (let x = 0; x <= 340; x += 5) c.lineTo(x, cy - half(x)); for (let x = 340; x >= 0; x -= 5) c.lineTo(x, cy + half(x)); c.fill();
      for (const q of pts) { const hh = half(q.x), sp = (v1 * h1) / (2 * hh); q.x += sp * dt * 30; if (q.x > 340) { q.x = 0; q.y = Math.random(); } c.fillStyle = "#e0f2fe"; c.beginPath(); c.arc(q.x, cy - hh + q.y * 2 * hh, 2, 0, 7); c.fill(); }
      const p1 = 100 + 0.5 * 1 * (v2 * v2 - v1 * v1) * 0, P1 = 60, P2 = Math.max(5, 60 - (v2 * v2 - v1 * v1) * 2);
      for (const [x, P] of [[60, P1], [170, P2], [290, P1]]) { c.strokeStyle = ink(); c.lineWidth = 2; c.strokeRect(x - 6, cy - half(x) - 80, 12, 80); c.fillStyle = "#38bdf8"; c.fillRect(x - 5, cy - half(x) - P, 10, P); }
      label(c, 170, 208, `v₂ = ${r2(v2, 1)} m/s`, "#fde047"); label(c, 60, 208, `v₁ = ${v1} m/s`, "#fde047"); void p1;
    });
    function info() { const v2 = v1 / ratio, dp = 0.5 * 1000 * (v2 * v2 - v1 * v1); out.innerHTML = `<div class="big-num">S₁v₁ = S₂v₂ → v₂ = ${r2(v2, 1)} m/s · Δp = ρ(v₂² − v₁²)/2 = ${Math.round(dp)} Pa</div><div>Tor joyda suyuqlik tezroq oqadi va bosimi <b>kamayadi</b> — vertikal naychalardagi suv sathi pastroq.</div><div class="muted">Qo‘llanilishi: samolyot qanoti (ustida havo tezroq → bosim kam → ko‘tarish kuchi), purkagich, karbyurator, ikki kema yonma-yon suzsa bir-biriga tortiladi.</div>`; }
    controls.append(slider({ label: "Kirish tezligi v₁", min: 0.5, max: 4, step: 0.5, value: v1, fmt: (x) => num(x) + " m/s", onInput: (x) => { v1 = x; info(); } }), slider({ label: "Toraygan joy (S₂/S₁)", min: 0.25, max: 1, step: 0.05, value: ratio, fmt: (x) => num(x), onInput: (x) => { ratio = x; info(); } }));
    info();
  };
})();
