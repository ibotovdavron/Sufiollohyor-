/* Kimyo uchun jonli tajribalar (3-qism): agregat holatlar (zarrachalar modeli), reaksiya tezligi, kimyoviy muvozanat,
   elektroliz va Faradey qonuni, eritmalar konsentratsiyasi, gaz qonunlari, aralashmalarni ajratish, tarkib diagrammasi,
   saralash o'yini, laboratoriya jihozlari, metallar faollik qatori, korroziya, kristall panjaralar. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const K = window.KIM;
  const { BY, parse, mr, fml, balance, eqHTML, esc, beakerScene, wait } = K;

  /** Canvas animatsiyasi: faqat ko'rinib turganda ishlaydi (batareyani tejash) */
  function animCanvas(stage, w, hgt, step) {
    const cv = h("canvas", { class: "kk-canvas", width: w * 2, height: hgt * 2, style: `aspect-ratio:${w}/${hgt}` });
    stage.append(cv);
    const ctx = cv.getContext("2d"); ctx.scale(2, 2);
    let vis = true, raf = 0, last = performance.now();
    const loop = (t) => { const dt = Math.min(0.05, (t - last) / 1000); last = t; if (vis && cv.isConnected) step(ctx, dt); raf = cv.isConnected ? requestAnimationFrame(loop) : 0; };
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { vis = es[0].isIntersecting; }).observe(cv);
    raf = requestAnimationFrame(loop);
    return cv;
  }
  const ink = () => getComputedStyle(document.body).color || "#fff";

  // ===================================================================
  // 1. Agregat holatlar: zarrachalar modeli
  // ===================================================================
  const SUBS = [["Suv", 0, 100, "#38bdf8"], ["Temir", 1538, 2862, "#f97316"], ["Kislorod", -218, -183, "#a78bfa"], ["Etil spirt", -114, 78, "#22c55e"], ["Osh tuzi", 801, 1465, "#f8fafc"], ["Simob", -39, 357, "#cbd5e1"]];
  W.states = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌡 Moddaning agregat holatlari — haroratni o‘zgartiring");
    let si = 0, T = 20;
    const N = 36, W0 = 320, H0 = 200;
    const P = Array.from({ length: N }, (_, i) => ({ hx: 110 + (i % 6) * 20, hy: 95 + Math.floor(i / 6) * 17, x: 0, y: 0, vx: 0, vy: 0 }));
    P.forEach((q) => { q.x = q.hx; q.y = q.hy; });
    const st = () => { const [, mp, bp] = SUBS[si]; return T < mp ? 0 : T < bp ? 1 : 2; };
    animCanvas(stage, W0, H0, (c, dt) => {
      const [, mp, bp, col] = SUBS[si], state = st();
      const energy = state === 0 ? 0.6 + Math.max(0, (T - (mp - 300)) / 300) : state === 1 ? 1.4 : 2.6;
      c.clearRect(0, 0, W0, H0);
      c.strokeStyle = ink(); c.globalAlpha = 0.5; c.lineWidth = 2; c.strokeRect(60, 10, 200, 180); c.globalAlpha = 1;
      P.forEach((q, i) => {
        if (state === 0) { q.x += (q.hx - q.x) * 0.2 + (Math.random() - 0.5) * energy * 2; q.y += (q.hy - q.y) * 0.2 + (Math.random() - 0.5) * energy * 2; }
        else {
          q.vx += (Math.random() - 0.5) * energy * 40 * dt * 10; q.vy += (Math.random() - 0.5) * energy * 40 * dt * 10 + (state === 1 ? 30 * dt : 0);
          const vmax = state === 1 ? 40 : 160; const v = Math.hypot(q.vx, q.vy); if (v > vmax) { q.vx *= vmax / v; q.vy *= vmax / v; }
          q.x += q.vx * dt; q.y += q.vy * dt;
          const top = state === 1 ? 104 : 18;
          if (q.x < 68) { q.x = 68; q.vx = Math.abs(q.vx); } if (q.x > 252) { q.x = 252; q.vx = -Math.abs(q.vx); }
          if (q.y < top) { q.y = top; q.vy = Math.abs(q.vy); } if (q.y > 182) { q.y = 182; q.vy = -Math.abs(q.vy); }
          if (state === 1) for (let j = i + 1; j < N; j++) { const o = P[j], dx = o.x - q.x, dy = o.y - q.y, d = Math.hypot(dx, dy); if (d < 14 && d > 0) { const f = (14 - d) / 2; q.x -= dx / d * f; q.y -= dy / d * f; o.x += dx / d * f; o.y += dy / d * f; } }
        }
        c.beginPath(); c.arc(q.x, q.y, 7, 0, Math.PI * 2); c.fillStyle = col; c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = 1; c.stroke();
      });
    });
    const sl = slider({ label: "Harorat", min: -250, max: 3000, value: T, fmt: (v) => `${v} °C`, onInput: (v) => { T = v; info(); } });
    controls.append(buttons(SUBS.map((x) => x[0]), (i) => { si = i; const [, mp, bp] = SUBS[i]; T = Math.round((mp + bp) / 2); sl.setRange(Math.max(-273, mp - 300), bp + 400); sl.set(T); info(); }, 0), sl);
    sl.setRange(-300, 500);
    function info() {
      const [n, mp, bp] = SUBS[si], state = st();
      out.innerHTML = `<b>${n}</b> ${T} °C da — <b>${["qattiq", "suyuq", "gaz"][state]}</b> holatda. <span class="muted">(suyuqlanish: ${mp} °C, qaynash: ${bp} °C)</span>
        <div>${["Zarrachalar zich joylashgan, faqat o‘z joyida tebranadi — shakl va hajm saqlanadi.", "Zarrachalar yaqin, lekin bir-biri ustida sirpanadi — hajm saqlanadi, shakl idishnikini oladi.", "Zarrachalar uzoq va tez harakatlanadi — butun idishni egallaydi, oson siqiladi."][state]}</div>
        <div class="muted">Bu <b>fizik hodisa</b>: modda o‘zgarmaydi, faqat zarrachalar harakati va joylashuvi o‘zgaradi.</div>`;
    }
    info();
  };

  // ===================================================================
  // 2. Reaksiya tezligi (to'qnashuvlar modeli)
  // ===================================================================
  W.rate = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⏱ Reaksiya tezligi: harorat, konsentratsiya, katalizator");
    const st = { T: 25, c: 20, cat: false, made: 0, t: 0, hist: [] };
    let P = [];
    const spawn = () => { P = []; for (let i = 0; i < st.c * 2; i++) P.push({ x: 20 + Math.random() * 180, y: 20 + Math.random() * 150, a: Math.random() * 6.28, k: i % 2 ? "A" : "B" }); st.made = 0; st.t = 0; st.hist = []; };
    spawn();
    animCanvas(stage, 330, 190, (c, dt) => {
      const sp = 30 + st.T * 1.6, Ea = st.cat ? 0.45 : 0.75;
      st.t += dt;
      c.clearRect(0, 0, 330, 190); c.strokeStyle = ink(); c.globalAlpha = 0.45; c.strokeRect(10, 10, 200, 170); c.globalAlpha = 1;
      for (const q of P) {
        q.a += (Math.random() - 0.5) * 0.4; q.x += Math.cos(q.a) * sp * dt; q.y += Math.sin(q.a) * sp * dt;
        if (q.x < 16 || q.x > 204) { q.a = Math.PI - q.a; q.x = Math.max(16, Math.min(204, q.x)); }
        if (q.y < 16 || q.y > 174) { q.a = -q.a; q.y = Math.max(16, Math.min(174, q.y)); }
      }
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j]; if (a.k === b.k || a.k === "C" || b.k === "C") continue;
        if (Math.abs(a.x - b.x) < 9 && Math.abs(a.y - b.y) < 9) {
          const energy = Math.random() * (0.5 + st.T / 80);
          if (energy > Ea) { a.k = "C"; b.k = "C"; st.made++; c.fillStyle = "#fde047"; c.beginPath(); c.arc(a.x, a.y, 12, 0, 6.28); c.fill(); }
        }
      }
      for (const q of P) { c.beginPath(); c.arc(q.x, q.y, 4.5, 0, 6.28); c.fillStyle = q.k === "A" ? "#38bdf8" : q.k === "B" ? "#f87171" : "#a3e635"; c.fill(); }
      if (st.hist.length === 0 || st.t - st.hist[st.hist.length - 1][0] > 0.25) st.hist.push([st.t, st.made]);
      // grafik
      c.globalAlpha = 0.5; c.strokeStyle = ink(); c.beginPath(); c.moveTo(225, 20); c.lineTo(225, 170); c.lineTo(322, 170); c.stroke(); c.globalAlpha = 1;
      c.strokeStyle = "#a3e635"; c.lineWidth = 2; c.beginPath();
      st.hist.forEach(([t, m], i) => { const x = 225 + Math.min(97, t * 6), y = 170 - (m / Math.max(1, st.c)) * 145; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); c.lineWidth = 1;
      c.fillStyle = ink(); c.font = "10px system-ui"; c.fillText("mahsulot", 228, 16); c.fillText("vaqt →", 285, 184);
      if (Math.round(st.t * 4) % 4 === 0) info();
    });
    controls.append(
      slider({ label: "Harorat", min: 0, max: 100, value: st.T, fmt: (v) => `${v} °C`, onInput: (v) => { st.T = v; spawn(); } }),
      slider({ label: "Konsentratsiya (zarracha)", min: 5, max: 40, value: st.c, onInput: (v) => { st.c = v; spawn(); } }),
      h("label", { class: "kb-check" }, h("input", { type: "checkbox", onchange: (e) => { st.cat = e.target.checked; spawn(); } }), " Katalizator"),
      button("↺ Qaytadan", () => spawn(), "ghost"));
    function info() {
      out.innerHTML = `Hosil bo‘ldi: <b>${st.made}</b> ta mahsulot molekulasi (🟢) · ${num(st.t, 1)} s. <div class="muted">Faqat <b>yetarli energiya</b> bilan to‘qnashgan zarrachalar reaksiyaga kirishadi. Harorat ↑ — zarrachalar tezlashadi (har 10 °C da tezlik 2–4 marta ortadi — Vant-Goff qoidasi). Konsentratsiya ↑ — to‘qnashuvlar ko‘payadi. Katalizator faollanish energiyasini <b>pasaytiradi</b>.</div>`;
    }
    info();
  };

  // ===================================================================
  // 3. Kimyoviy muvozanat (Le Shatelye tamoyili)
  // ===================================================================
  const EQL = [
    { n: "2NO₂ ⇄ N₂O₄ + Q", l: "2NO₂ (qo‘ng‘ir)", r: "N₂O₄ (rangsiz)", exo: true, dn: -1, cl: "#b45309", cr: "#f1f5f9" },
    { n: "N₂ + 3H₂ ⇄ 2NH₃ + Q", l: "N₂ + 3H₂", r: "2NH₃", exo: true, dn: -2, cl: "#93c5fd", cr: "#c4b5fd" },
    { n: "H₂ + I₂ ⇄ 2HI − Q", l: "H₂ + I₂ (binafsha)", r: "2HI (rangsiz)", exo: false, dn: 0, cl: "#7e22ce", cr: "#f1f5f9" },
    { n: "2SO₂ + O₂ ⇄ 2SO₃ + Q", l: "2SO₂ + O₂", r: "2SO₃", exo: true, dn: -1, cl: "#fde68a", cr: "#e5e7eb" },
    { n: "CaCO₃ ⇄ CaO + CO₂ − Q", l: "CaCO₃", r: "CaO + CO₂", exo: false, dn: 1, cl: "#f8fafc", cr: "#cbd5e1" },
  ];
  W.equil = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⇄ Kimyoviy muvozanat — sharoitni o‘zgartiring");
    let ei = 0, b = 0.5;
    const box = h("div", { class: "ke-box" }); stage.append(box);
    function draw(msg, dir) {
      const E = EQL[ei];
      box.innerHTML = `<div class="ke-eq">${E.n}</div>
        <div class="ke-flask" style="--c1:${E.cl};--c2:${E.cr};--b:${b}"><i></i></div>
        <div class="ke-bars"><div><span>${E.l}</span><b style="width:${(1 - b) * 100}%;background:${E.cl}"></b></div><div><span>${E.r}</span><b style="width:${b * 100}%;background:${E.cr}"></b></div></div>
        ${dir !== undefined ? `<div class="ke-shift">${dir > 0 ? "Muvozanat <b>o‘ngga →</b> siljidi" : dir < 0 ? "Muvozanat <b>← chapga</b> siljidi" : "Muvozanat <b>siljimadi</b>"}</div>` : ""}`;
      out.innerHTML = msg || "Tugmalarni bosing. <b>Le Shatelye tamoyili:</b> muvozanatdagi tizimga tashqi ta’sir ko‘rsatilsa, muvozanat shu ta’sirni <b>kamaytiradigan</b> tomonga siljiydi.";
    }
    const act = (kind) => {
      const E = EQL[ei]; let d = 0, why = "";
      if (kind === "T+") { d = E.exo ? -1 : 1; why = `Harorat oshirildi → issiqlik yutiladigan (${E.exo ? "teskari" : "to‘g‘ri"}) reaksiya tezlashadi.`; }
      if (kind === "T-") { d = E.exo ? 1 : -1; why = `Harorat pasaytirildi → issiqlik chiqaradigan (${E.exo ? "to‘g‘ri" : "teskari"}) reaksiya ustun.`; }
      if (kind === "P+") { d = E.dn < 0 ? 1 : E.dn > 0 ? -1 : 0; why = E.dn ? `Bosim oshirildi → gaz molekulalari <b>kamroq</b> tomonga siljiydi.` : "Ikkala tomonda gaz molekulalari soni teng — bosim muvozanatga ta’sir qilmaydi."; }
      if (kind === "P-") { d = E.dn < 0 ? -1 : E.dn > 0 ? 1 : 0; why = E.dn ? "Bosim kamaytirildi → gaz molekulalari <b>ko‘proq</b> tomonga siljiydi." : "Gaz molekulalari soni teng — ta’sir yo‘q."; }
      if (kind === "C+") { d = 1; why = "Boshlang‘ich modda qo‘shildi → uni sarflash uchun to‘g‘ri reaksiya tezlashadi."; }
      if (kind === "C-") { d = 1; why = "Mahsulot chiqarib olindi → uni to‘ldirish uchun to‘g‘ri reaksiya ketadi."; }
      if (kind === "cat") { d = 0; why = "Katalizator ikkala reaksiyani <b>bir xil</b> tezlashtiradi — muvozanat siljimaydi, faqat tezroq qaror topadi."; }
      b = Math.max(0.08, Math.min(0.92, b + d * 0.16));
      draw(why, d);
    };
    controls.append(buttons(EQL.map((e) => e.n), (i) => { ei = i; b = 0.5; draw(); }, 0),
      h("div", { class: "kb-row" }, button("🔥 T ↑", () => act("T+")), button("❄️ T ↓", () => act("T-")), button("⬇ Bosim ↑", () => act("P+")), button("⬆ Bosim ↓", () => act("P-")),
        button("➕ Boshlang‘ich modda", () => act("C+"), "ghost"), button("➖ Mahsulotni olish", () => act("C-"), "ghost"), button("🧪 Katalizator", () => act("cat"), "ghost")));
    draw();
  };

  // ===================================================================
  // 4. Elektroliz va Faradey qonuni
  // ===================================================================
  const ELY = [
    { n: "CuCl₂ eritmasi", sol: "#3b82f6", cat: ["Cu", "mis qatlami", "#b45309", "Cu²⁺ + 2e⁻ → Cu"], an: ["Cl₂", "sarg‘ish-yashil gaz", "#d9f99d", "2Cl⁻ − 2e⁻ → Cl₂↑"], sum: "CuCl₂ → Cu + Cl₂↑", M: 64, z: 2, fade: true },
    { n: "CuSO₄ eritmasi", sol: "#3b82f6", cat: ["Cu", "mis qatlami", "#b45309", "Cu²⁺ + 2e⁻ → Cu"], an: ["O₂", "kislorod", "#ffffff", "2H₂O − 4e⁻ → O₂↑ + 4H⁺"], sum: "2CuSO₄ + 2H₂O → 2Cu + O₂↑ + 2H₂SO₄", M: 64, z: 2, fade: true },
    { n: "NaCl eritmasi", sol: "#cfe6ff", cat: ["H₂", "vodorod", "#ffffff", "2H₂O + 2e⁻ → H₂↑ + 2OH⁻"], an: ["Cl₂", "xlor", "#d9f99d", "2Cl⁻ − 2e⁻ → Cl₂↑"], sum: "2NaCl + 2H₂O → H₂↑ + Cl₂↑ + 2NaOH", M: 2, z: 2, gas: true },
    { n: "NaCl suyuqlanmasi", sol: "#fde68a", cat: ["Na", "suyuq natriy", "#e5e7eb", "Na⁺ + e⁻ → Na"], an: ["Cl₂", "xlor", "#d9f99d", "2Cl⁻ − 2e⁻ → Cl₂↑"], sum: "2NaCl → 2Na + Cl₂↑", M: 23, z: 1 },
    { n: "Na₂SO₄ eritmasi (suv)", sol: "#cfe6ff", cat: ["H₂", "vodorod", "#ffffff", "2H₂O + 2e⁻ → H₂↑ + 2OH⁻"], an: ["O₂", "kislorod", "#ffffff", "2H₂O − 4e⁻ → O₂↑ + 4H⁺"], sum: "2H₂O → 2H₂↑ + O₂↑ (tuz faqat tok o‘tkazadi)", M: 2, z: 2, gas: true },
    { n: "AgNO₃ eritmasi", sol: "#cfe6ff", cat: ["Ag", "kumush qatlami", "#e5e7eb", "Ag⁺ + e⁻ → Ag"], an: ["O₂", "kislorod", "#ffffff", "2H₂O − 4e⁻ → O₂↑ + 4H⁺"], sum: "4AgNO₃ + 2H₂O → 4Ag + O₂↑ + 4HNO₃", M: 108, z: 1 },
    { n: "KI eritmasi", sol: "#cfe6ff", cat: ["H₂", "vodorod", "#ffffff", "2H₂O + 2e⁻ → H₂↑ + 2OH⁻"], an: ["I₂", "yod (qo‘ng‘ir)", "#92400e", "2I⁻ − 2e⁻ → I₂"], sum: "2KI + 2H₂O → H₂↑ + I₂ + 2KOH", M: 2, z: 2, gas: true },
  ];
  W.electrolysis = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔋 Elektroliz — elektrolitni tanlang, tok va vaqtni o‘zgartiring");
    let ei = 0, I = 2, t = 30;
    const g = svg(320, 240, "kb-svg"); stage.append(g);
    function draw() {
      const E = ELY[ei], q = I * t * 60, m = (E.M * q) / (E.z * 96500), V = (22.4 * q) / (E.z * 96500);
      const fade = E.fade ? Math.max(0.15, 0.6 - t / 200) : 0.45;
      let ions = ""; for (let k = 0; k < 14; k++) { const plus = k % 2 === 0; ions += `<text x="${110 + Math.random() * 100}" y="${130 + Math.random() * 80}" class="kc-ion ${plus ? "pl" : "mi"}" text-anchor="middle" style="--dx:${plus ? "-34px" : "34px"};animation-delay:${-Math.random() * 3}s">${plus ? "+" : "−"}</text>`; }
      const bub = (x, col) => Array.from({ length: 10 }, () => `<circle cx="${x + (Math.random() - 0.5) * 12}" cy="200" r="${1.5 + Math.random() * 2.5}" fill="none" stroke="${col}" class="kb-bub" style="--rise:-90px;animation-duration:${1 + Math.random()}s;animation-delay:${-Math.random() * 2}s"/>`).join("");
      const catGas = /H₂|O₂|Cl₂/.test(E.cat[0]), anGas = /O₂|Cl₂/.test(E.an[0]);
      g.innerHTML = `<path d="M70 90 L70 214 Q70 228 84 228 L236 228 Q250 228 250 214 L250 90" fill="none" stroke="currentColor" stroke-width="3" opacity=".75"/>
        <rect x="73" y="112" width="174" height="114" fill="${E.sol}" opacity="${fade}"/>${ions}
        <rect x="96" y="60" width="12" height="150" fill="#475569"/><rect x="212" y="60" width="12" height="150" fill="#475569"/>
        ${!catGas ? `<rect x="93" y="${210 - Math.min(90, t)}" width="18" height="${Math.min(90, t)}" fill="${E.cat[2]}" opacity=".9" rx="2"/>` : bub(102, E.cat[2])}
        ${anGas ? bub(218, E.an[2]) : `<rect x="224" y="140" width="${Math.min(14, t / 6)}" height="70" fill="${E.an[2]}" opacity=".7"/>`}
        <path d="M102 60 L102 30 L140 30 M180 30 L218 30 L218 60" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <rect x="140" y="18" width="40" height="24" rx="4" fill="currentColor" opacity=".15" stroke="currentColor"/><text x="160" y="35" text-anchor="middle" class="kt-ax">${I} A</text>
        <text x="102" y="52" text-anchor="middle" class="kt-ax">K (−)</text><text x="218" y="52" text-anchor="middle" class="kt-ax">A (+)</text>`;
      out.innerHTML = `<div>Katodda (−): <b>${E.cat[1]}</b> — ${E.cat[3]}</div><div>Anodda (+): <b>${E.an[1]}</b> — ${E.an[3]}</div><div>Umumiy: <b>${E.sum}</b></div>
        <div class="big-num">Q = I·t = ${I}·${t * 60} = ${num(q)} Kl → ${catGas ? `V(${E.cat[0]}) = ${num(V, 3)} l` : `m(${E.cat[0]}) = ${num(m, 3)} g`}</div>
        <div class="muted">Faradey qonuni: m = M·I·t / (z·F), F = 96 500 Kl/mol. ${E.fade ? "Eritma rangi xiralashadi — Cu²⁺ ionlari kamaymoqda." : ""}</div>`;
    }
    controls.append(buttons(ELY.map((e) => e.n), (i) => { ei = i; draw(); }, 0),
      slider({ label: "Tok kuchi", min: 0.5, max: 10, step: 0.5, value: I, fmt: (v) => `${num(v)} A`, onInput: (v) => { I = v; draw(); } }),
      slider({ label: "Vaqt", min: 1, max: 120, value: t, fmt: (v) => `${v} daq`, onInput: (v) => { t = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 5. Eritmalar: tayyorlash, eruvchanlik, aralashtirish, suyultirish
  // ===================================================================
  const SOLU = [["NaCl", "Osh tuzi", (T) => 35.7 + T * 0.02, "#e2e8f0"], ["KNO₃", "Kaliy nitrat", (T) => 13.3 + T * 0.5 + T * T * 0.0125, "#f8fafc"], ["CuSO₄", "Mis kuporosi", (T) => 14.3 + T * 0.43, "#3b82f6"], ["C₁₂H₂₂O₁₁", "Shakar", (T) => 179 + T * 1.2, "#fef3c7"], ["NaOH", "Natriy gidroksid", (T) => 42 + T * 0.9, "#f8fafc"]];
  const MOLM = { "NaCl": 58.5, "KNO₃": 101, "CuSO₄": 160, "C₁₂H₂₂O₁₁": 342, "NaOH": 40 };
  W.solution = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧂 Eritma tayyorlash — modda va suv miqdorini tanlang");
    let mode = p.mode || 0, si = p.s || 0, ms = 20, mw = 180, T = 20;
    let m1 = 200, w1 = 10, m2 = 100, w2 = 40;
    const sc = beakerScene(stage); sc.tube(null, false);
    function render() {
      controls.innerHTML = "";
      controls.append(buttons(["Tayyorlash", "Aralashtirish", "Suyultirish/bug‘latish"], (i) => { mode = i; render(); }, mode));
      if (mode === 0) controls.append(buttons(SOLU.map((x) => x[1]), (i) => { si = i; draw(); }, si),
        slider({ label: "Erigan modda", min: 1, max: 300, value: ms, fmt: (v) => `${v} g`, onInput: (v) => { ms = v; draw(); } }),
        slider({ label: "Suv", min: 20, max: 500, value: mw, fmt: (v) => `${v} g`, onInput: (v) => { mw = v; draw(); } }),
        slider({ label: "Harorat", min: 0, max: 100, value: T, fmt: (v) => `${v} °C`, onInput: (v) => { T = v; draw(); } }));
      else controls.append(
        slider({ label: "1-eritma massasi", min: 10, max: 500, value: m1, fmt: (v) => `${v} g`, onInput: (v) => { m1 = v; draw(); } }),
        slider({ label: "1-eritma ω", min: 0, max: 60, value: w1, fmt: (v) => `${v}%`, onInput: (v) => { w1 = v; draw(); } }),
        slider({ label: mode === 1 ? "2-eritma massasi" : "Qo‘shilgan suv (− bug‘langan)", min: mode === 1 ? 10 : -300, max: 500, value: m2, fmt: (v) => `${v} g`, onInput: (v) => { m2 = v; draw(); } }),
        ...(mode === 1 ? [slider({ label: "2-eritma ω", min: 0, max: 60, value: w2, fmt: (v) => `${v}%`, onInput: (v) => { w2 = v; draw(); } })] : []));
      draw();
    }
    function draw() {
      if (mode === 0) {
        const [f, n, sol, col] = SOLU[si], max = (sol(T) * mw) / 100, dis = Math.min(ms, max), w = (dis / (dis + mw)) * 100, extra = ms - dis;
        const Vml = (dis + mw) / (1 + w * 0.007), C = (dis / MOLM[f]) / (Vml / 1000);
        sc.reset(); sc.liquid(col === "#3b82f6" ? col : "#bfdbfe", Math.min(140, 30 + (mw + dis) / 4), col === "#3b82f6" ? Math.min(0.8, 0.15 + w / 40) : 0.35);
        sc.solid(extra > 0.5 ? "powder" : null, col === "#3b82f6" ? "#1d4ed8" : "#f8fafc");
        sc.label(`${num(Math.round(dis + mw))} g eritma`, "");
        out.innerHTML = `<div class="big-num">ω = ${num(dis)} / (${num(dis)} + ${mw}) · 100% = ${num(w, 1)}%</div>
          <div>C<sub>M</sub> ≈ ${num(C, 2)} mol/l · eruvchanlik (${T} °C): <b>${num(sol(T), 1)} g</b> / 100 g suv</div>
          <div>${extra > 0.5 ? `⚠️ <b>To‘yingan eritma!</b> ${num(extra, 1)} g ${n} erimay tubda qoldi. ${si === 1 ? "Qizdiring — KNO₃ eruvchanligi keskin ortadi!" : ""}` : max - ms < max * 0.08 ? "Deyarli to‘yingan eritma." : "To‘yinmagan eritma — yana eritish mumkin."}</div>`;
      } else if (mode === 1) {
        const m = m1 + m2, w = (m1 * w1 + m2 * w2) / m;
        sc.reset(); sc.liquid("#bfdbfe", Math.min(150, m / 4), 0.35); sc.solid(null); sc.label(`${m} g aralashma`, "");
        out.innerHTML = `<div class="big-num">ω = (${m1}·${w1} + ${m2}·${w2}) / (${m1} + ${m2}) = ${num(w, 2)}%</div><div class="muted">Aralashtirilganda erigan modda massalari qo‘shiladi: m(modda) = ${num((m1 * w1) / 100, 1)} + ${num((m2 * w2) / 100, 1)} = ${num((m1 * w1 + m2 * w2) / 100, 1)} g. “Xoch qoidasi” bilan ham hisoblash mumkin.</div>`;
      } else {
        const m = Math.max(1, m1 + m2), sub = (m1 * w1) / 100, w = Math.min(100, (sub / m) * 100);
        sc.reset(); sc.liquid("#bfdbfe", Math.min(150, m / 4), 0.35); sc.solid(null); sc.label(`${num(m)} g eritma`, "");
        out.innerHTML = `<div class="big-num">ω = ${num(sub, 1)} / ${num(m)} · 100% = ${num(w, 2)}%</div><div class="muted">${m2 >= 0 ? "Suv qo‘shilganda modda massasi o‘zgarmaydi — konsentratsiya kamayadi (suyultirish)." : "Suv bug‘latilganda eritma massasi kamayadi — konsentratsiya ortadi."}</div>`;
      }
    }
    render();
  };

  // ===================================================================
  // 6. Gaz qonunlari: pV = nRT, molyar hajm, nisbiy zichlik
  // ===================================================================
  const GASES = ["H2", "He", "N2", "O2", "CO2", "NH3", "CH4", "Cl2", "SO2", "NO2"];
  W.gas = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🎈 Gaz qonunlari — Mendeleyev–Klapeyron tenglamasi");
    let n = 1, T = 273, V = 22.4, gi = 3;
    let P = [];
    const reseed = () => { P = Array.from({ length: Math.round(6 + n * 14) }, () => ({ x: Math.random(), y: Math.random(), a: Math.random() * 6.28 })); };
    reseed();
    animCanvas(stage, 320, 170, (c, dt) => {
      const w = 60 + (V / 50) * 200, sp = Math.sqrt(T) * 0.06;
      c.clearRect(0, 0, 320, 170); c.strokeStyle = ink(); c.globalAlpha = 0.5; c.lineWidth = 2;
      c.strokeRect(20, 20, 280, 130); c.globalAlpha = 1; c.fillStyle = "#64748b"; c.fillRect(20 + w, 22, 10, 126); c.fillRect(30 + w, 80, 290 - w, 10);
      for (const q of P) { q.a += (Math.random() - 0.5) * 0.3; q.x += Math.cos(q.a) * sp * dt; q.y += Math.sin(q.a) * sp * dt * 1.6;
        if (q.x < 0 || q.x > 1) { q.a = Math.PI - q.a; q.x = Math.max(0, Math.min(1, q.x)); } if (q.y < 0 || q.y > 1) { q.a = -q.a; q.y = Math.max(0, Math.min(1, q.y)); }
        c.beginPath(); c.arc(26 + q.x * (w - 12), 26 + q.y * 118, 3.5, 0, 6.28); c.fillStyle = `hsl(${200 - Math.min(180, T / 4)} 85% 60%)`; c.fill(); }
    });
    const gs = h("select", { class: "kb-select" }, ...GASES.map((g, i) => h("option", { value: i }, g)));
    gs.value = gi; gs.onchange = () => { gi = +gs.value; info(); };
    controls.append(h("label", { class: "ctl" }, h("span", {}, "Gaz"), gs),
      slider({ label: "Modda miqdori n", min: 0.2, max: 4, step: 0.1, value: n, fmt: (v) => `${num(v, 1)} mol`, onInput: (v) => { n = v; reseed(); info(); } }),
      slider({ label: "Harorat T", min: 100, max: 800, value: T, fmt: (v) => `${v} K (${v - 273} °C)`, onInput: (v) => { T = v; info(); } }),
      slider({ label: "Hajm V", min: 2, max: 50, step: 0.2, value: V, fmt: (v) => `${num(v, 1)} l`, onInput: (v) => { V = v; info(); } }),
      button("📍 Normal sharoit", () => { n = 1; T = 273; V = 22.4; info(); render(); }, "ghost"));
    const render = () => { controls.querySelectorAll("input[type=range]").forEach((r, i) => { r.value = [n, T, V][i]; r.dispatchEvent(new Event("input")); }); };
    function info() {
      const f = GASES[gi], M = mr(f), Pk = (n * 8.314 * T) / (V / 1000) / 1000;
      out.innerHTML = `<div class="big-num">p = nRT / V = ${num(n, 1)}·8,314·${T} / ${num(V / 1000, 4)} = ${num(Pk, 1)} kPa</div>
        <div>m(${fml(f)}) = n·M = ${num(n, 1)}·${num(M)} = <b>${num(n * M, 1)} g</b> · ρ = m/V = <b>${num((n * M) / V, 3)} g/l</b></div>
        <div>D<sub>H₂</sub> = M/2 = <b>${num(M / 2, 2)}</b> · D<sub>havo</sub> = M/29 = <b>${num(M / 29, 2)}</b> — ${M > 29 ? "havodan og‘ir (idish tubida to‘planadi)" : "havodan yengil (yuqoriga ko‘tariladi)"}</div>
        <div class="muted">Normal sharoitda (0 °C, 101,3 kPa) istalgan gazning 1 moli <b>22,4 l</b> hajmni egallaydi — Avogadro qonuni.</div>`;
    }
    info();
  };

  // ===================================================================
  // 7. Aralashmalarni ajratish (bosqichma-bosqich)
  // ===================================================================
  const SEPS = {
    salt: { n: "Ifloslangan osh tuzini tozalash", steps: [["1. Eritish", "Tuz + qum aralashmasini suvga solib aralashtiramiz — tuz eriydi, qum erimaydi.", "dissolve"], ["2. Filtrlash", "Voronka va filtr qog‘oz orqali o‘tkazamiz — qum filtrda qoladi, tiniq eritma (filtrat) pastga tushadi.", "filter"], ["3. Bug‘latish", "Filtratni chinni kosachada qizdiramiz — suv bug‘lanadi, toza tuz kristallari qoladi.", "evap"]] },
    magnet: { n: "Temir kukuni va oltingugurtni ajratish", steps: [["1. Aralashma", "Temir kukuni (kulrang) va oltingugurt kukuni (sariq) aralashgan.", "mix"], ["2. Magnit", "Magnitni yaqinlashtiramiz — temir zarrachalari magnitga tortiladi, oltingugurt qoladi.", "magnet"]] },
    funnel: { n: "Suv va o‘simlik moyini ajratish", steps: [["1. Aralashma", "Moy suvda erimaydi va yengil — ustki qatlam bo‘lib turadi.", "layers"], ["2. Ajratgich voronka", "Jo‘mrakni ochib, pastki qatlam (suv)ni to‘kib olamiz, moy voronkada qoladi.", "drain"]] },
    distill: { n: "Distillash (haydash) — toza suv olish", steps: [["1. Qizdirish", "Sho‘r suvni qizdiramiz — suv qaynab bug‘ga aylanadi, tuz kolbada qoladi.", "boil"], ["2. Sovutish", "Bug‘ sovutgichda sovib suyuqlikka aylanadi va qabul qilgichga tomadi — distillangan suv.", "drip"]] },
  };
  W.separate = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧹 Aralashmalarni ajratish usullari");
    const keys = p.methods || Object.keys(SEPS);
    let mi = 0, st = 0;
    const g = svg(320, 230, "kb-svg"); stage.append(g);
    const art = {
      dissolve: `<path d="M110 80 L110 200 Q110 212 122 212 L198 212 Q210 212 210 200 L210 80" fill="none" stroke="currentColor" stroke-width="3" opacity=".75"/><rect x="113" y="120" width="94" height="90" fill="#bfdbfe" opacity=".4"/>${dots(120, 200, 200, 210, "#a16207", 30)}<line x1="160" y1="60" x2="150" y2="190" stroke="#cbd5e1" stroke-width="4" class="ks-stir"/>`,
      filter: `<path d="M110 40 L210 40 L170 110 L170 140 L150 140 L150 110 Z" fill="#bfdbfe" opacity=".3" stroke="currentColor" stroke-width="2.5"/><path d="M120 46 L200 46 L160 104 Z" fill="#f8fafc" opacity=".8"/>${dots(140, 180, 60, 90, "#a16207", 25)}<line x1="160" y1="140" x2="160" y2="175" stroke="#93c5fd" stroke-width="3" class="ks-drip"/><path d="M115 160 L115 214 Q115 222 123 222 L197 222 Q205 222 205 214 L205 160" fill="none" stroke="currentColor" stroke-width="3" opacity=".75"/><rect x="118" y="190" width="84" height="30" fill="#bfdbfe" opacity=".45"/>`,
      evap: `<path d="M100 120 Q160 190 220 120" fill="#e2e8f0" opacity=".25" stroke="currentColor" stroke-width="3"/>${dots(130, 190, 135, 150, "#ffffff", 30)}<path d="M150 200 L170 200 L165 215 L155 215 Z" fill="#475569"/><path d="M160 170 q-12 -14 0 -26 q12 14 0 26" fill="#60a5fa" class="ks-flame"/>${[0, 1, 2].map((i) => `<path d="M${135 + i * 25} 110 q-6 -10 0 -20 q6 -10 0 -20" stroke="currentColor" stroke-opacity=".4" fill="none" class="ks-steam" style="animation-delay:${i * 0.4}s"/>`).join("")}`,
      mix: `<ellipse cx="160" cy="170" rx="90" ry="26" fill="currentColor" opacity=".08"/>${dots(80, 240, 150, 190, "#6b7280", 40)}${dots(80, 240, 150, 190, "#facc15", 40)}`,
      magnet: `<ellipse cx="160" cy="170" rx="90" ry="26" fill="currentColor" opacity=".08"/>${dots(80, 240, 150, 190, "#facc15", 40)}<path d="M120 40 L120 90 Q120 110 140 110 L180 110 Q200 110 200 90 L200 40 L184 40 L184 88 Q184 94 178 94 L142 94 Q136 94 136 88 L136 40 Z" fill="#ef4444"/><rect x="120" y="34" width="16" height="12" fill="#e5e7eb"/><rect x="184" y="34" width="16" height="12" fill="#e5e7eb"/>${dots(122, 198, 112, 124, "#6b7280", 40)}`,
      layers: `<path d="M120 40 L200 40 L200 150 L170 190 L150 190 L120 150 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M122 90 L198 90 L198 150 L170 188 L150 188 L122 150 Z" fill="#60a5fa" opacity=".45"/><rect x="122" y="62" width="76" height="28" fill="#facc15" opacity=".7"/><rect x="154" y="190" width="12" height="26" fill="currentColor" opacity=".5"/>`,
      drain: `<path d="M120 40 L200 40 L200 150 L170 190 L150 190 L120 150 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M128 160 L192 160 L170 188 L150 188 Z" fill="#facc15" opacity=".7"/><rect x="154" y="190" width="12" height="26" fill="currentColor" opacity=".5"/><line x1="160" y1="216" x2="160" y2="236" stroke="#93c5fd" stroke-width="3" class="ks-drip"/>`,
      boil: `<circle cx="110" cy="150" r="44" fill="#bfdbfe" opacity=".35" stroke="currentColor" stroke-width="2.5"/><rect x="104" y="80" width="12" height="30" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M110 210 q-12 -14 0 -26 q12 14 0 26" fill="#60a5fa" class="ks-flame"/>${Array.from({ length: 10 }, () => `<circle cx="${92 + Math.random() * 36}" cy="180" r="2.5" fill="none" stroke="#fff" class="kb-bub" style="--rise:-50px;animation-duration:${0.8 + Math.random()}s;animation-delay:${-Math.random()}s"/>`).join("")}<line x1="116" y1="88" x2="250" y2="140" stroke="currentColor" stroke-width="10" opacity=".25"/>`,
      drip: `<circle cx="110" cy="150" r="44" fill="#bfdbfe" opacity=".2" stroke="currentColor" stroke-width="2.5"/>${dots(80, 140, 170, 185, "#ffffff", 20)}<rect x="104" y="80" width="12" height="30" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="116" y1="88" x2="250" y2="140" stroke="#38bdf8" stroke-width="10" opacity=".45"/><line x1="252" y1="146" x2="252" y2="170" stroke="#93c5fd" stroke-width="3" class="ks-drip"/><path d="M230 175 L230 214 Q230 222 238 222 L266 222 Q274 222 274 214 L274 175" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="233" y="200" width="38" height="20" fill="#bfdbfe" opacity=".5"/>`,
    };
    function dots(x1, x2, y1, y2, c, n) { let o = ""; for (let i = 0; i < n; i++) o += `<circle cx="${x1 + Math.random() * (x2 - x1)}" cy="${y1 + Math.random() * (y2 - y1)}" r="2.6" fill="${c}"/>`; return o; }
    const nextB = button("Keyingi bosqich →", () => { const S = SEPS[keys[mi]]; st = (st + 1) % S.steps.length; draw(); });
    controls.append(buttons(keys.map((k) => SEPS[k].n), (i) => { mi = i; st = 0; draw(); }, 0), nextB);
    function draw() {
      const S = SEPS[keys[mi]], [t, d, a] = S.steps[st];
      g.innerHTML = art[a];
      out.innerHTML = `<b>${t}</b> — ${d}<div class="muted">${st + 1} / ${S.steps.length} bosqich. ${st === S.steps.length - 1 ? "✅ Aralashma ajratildi!" : ""}</div>`;
      nextB.textContent = st === S.steps.length - 1 ? "↺ Boshidan" : "Keyingi bosqich →";
    }
    draw();
  };

  // ===================================================================
  // 8. Tarkib diagrammasi (havo, Yer po'sti, inson tanasi ...)
  // ===================================================================
  const COMP = {
    air: ["Havo tarkibi (hajm bo‘yicha)", [["Azot N₂", 78.08, "#38bdf8"], ["Kislorod O₂", 20.95, "#22c55e"], ["Argon Ar", 0.93, "#f472b6"], ["CO₂ va boshqalar", 0.04, "#f59e0b"]]],
    crust: ["Yer po‘stidagi elementlar (massa)", [["Kislorod", 49.5, "#22c55e"], ["Kremniy", 25.7, "#a78bfa"], ["Alyuminiy", 7.5, "#cbd5e1"], ["Temir", 4.7, "#f97316"], ["Kalsiy", 3.4, "#f8fafc"], ["Natriy", 2.6, "#facc15"], ["Kaliy", 2.4, "#f472b6"], ["Magniy", 1.9, "#2dd4bf"], ["Boshqalar", 2.3, "#64748b"]]],
    body: ["Inson tanasidagi elementlar (massa)", [["Kislorod", 65, "#22c55e"], ["Uglerod", 18, "#64748b"], ["Vodorod", 10, "#38bdf8"], ["Azot", 3, "#a78bfa"], ["Kalsiy", 1.5, "#f8fafc"], ["Fosfor", 1, "#f97316"], ["Boshqalar", 1.5, "#f472b6"]]],
    sea: ["Dengiz suvidagi tuzlar", [["NaCl", 77.8, "#f8fafc"], ["MgCl₂", 10.9, "#2dd4bf"], ["MgSO₄", 4.7, "#a78bfa"], ["CaSO₄", 3.6, "#f59e0b"], ["K₂SO₄", 2.5, "#f472b6"], ["Boshqalar", 0.5, "#64748b"]]],
    food: ["Ozuqa moddalarining energiyasi (kJ/g)", [["Yog‘lar", 38.9, "#facc15"], ["Oqsillar", 17.2, "#f472b6"], ["Uglevodlar", 17.2, "#22c55e"]]],
  };
  W.composition = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🥧 Tarkib diagrammasi — bo‘lakni bosing");
    const keys = p.sets || ["air"];
    let ki = 0;
    const g = svg(320, 220, "kb-svg"); stage.append(g);
    function draw(sel = -1) {
      const [title, data] = COMP[keys[ki]], tot = data.reduce((a, d) => a + d[1], 0);
      let a0 = -Math.PI / 2, html = "";
      data.forEach(([n, v, c], i) => {
        const a1 = a0 + (v / tot) * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0, r = i === sel ? 96 : 88, cx = 120, cy = 110;
        const path = v / tot > 0.999 ? `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z` : `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${big} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`;
        html += `<path d="${path}" fill="${c}" stroke="rgba(0,0,0,.3)" data-i="${i}" style="cursor:pointer"/>`;
        a0 = a1;
      });
      html += `<circle cx="120" cy="110" r="40" fill="var(--bg, #0b1220)" opacity=".85"/>`;
      data.forEach(([n, v, c], i) => (html += `<g data-i="${i}" style="cursor:pointer"><rect x="226" y="${20 + i * 21}" width="12" height="12" rx="3" fill="${c}"/><text x="244" y="${30 + i * 21}" class="kt-ax">${v}${keys[ki] === "food" ? "" : "%"}</text></g>`));
      g.innerHTML = html;
      g.querySelectorAll("[data-i]").forEach((e) => (e.onclick = () => draw(+e.dataset.i)));
      const d = data[sel];
      out.innerHTML = `<b>${title}</b>${d ? `<div class="big-num">${d[0]}: ${d[1]}${keys[ki] === "food" ? " kJ/g" : "%"}</div>` : ""}<div class="km-w">${data.map(([n, v, c]) => `<span><i style="background:${c}"></i>${n}</span>`).join("")}</div>`;
    }
    if (keys.length > 1) controls.append(buttons(keys.map((k) => COMP[k][0]), (i) => { ki = i; draw(); }, 0));
    draw();
  };

  // ===================================================================
  // 9. Saralash o'yini: kartani to'g'ri guruhga joylang
  // ===================================================================
  W.sort = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🗂 To‘g‘ri guruhga ajrating");
    const items = p.items.map(([t, c]) => ({ t, c })).sort(() => Math.random() - 0.5);
    let i = 0, ok = 0;
    const card = h("div", { class: "ks-card" }), bins = h("div", { class: "ks-bins" });
    stage.append(card, bins);
    function draw(fb) {
      if (i >= items.length) { card.innerHTML = `🏁 <b>${ok} / ${items.length}</b> to‘g‘ri!`; bins.innerHTML = ""; controls.innerHTML = ""; controls.append(button("↺ Qaytadan", () => { i = 0; ok = 0; items.sort(() => Math.random() - 0.5); draw(); })); out.innerHTML = fb || ""; return; }
      card.innerHTML = `<small>${i + 1} / ${items.length}</small><b>${items[i].t}</b>`;
      bins.innerHTML = ""; p.cats.forEach((c, k) => bins.append(h("button", { type: "button", class: "ks-bin", onclick: () => pick(k) }, c)));
      out.innerHTML = fb || "Kartadagi narsa qaysi guruhga tegishli? Tugmani bosing.";
    }
    function pick(k) { const it = items[i], right = it.c === k; if (right) ok++; i++; draw(right ? `✅ To‘g‘ri: “${it.t}” — <b>${p.cats[it.c]}</b>.` : `❌ “${it.t}” — aslida <b>${p.cats[it.c]}</b>.`); }
    draw();
  };

  // ===================================================================
  // 10. Laboratoriya jihozlari
  // ===================================================================
  const EQUIP = [
    ["Probirka", "Oz miqdordagi moddalar bilan tajriba o‘tkazish uchun. Qizdirganda og‘zini o‘zingizga va boshqalarga qaratmang!", `<path d="M40 10 L40 80 Q40 92 50 92 Q60 92 60 80 L60 10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="42" y="55" width="16" height="30" fill="#60a5fa" opacity=".5"/>`],
    ["Kimyoviy stakan", "Eritmalar tayyorlash, aralashtirish va qizdirish uchun. Darajalari taxminiy.", `<path d="M20 20 L24 24 L24 86 Q24 92 30 92 L70 92 Q76 92 76 86 L76 24 L80 20" fill="none" stroke="currentColor" stroke-width="3"/><rect x="26" y="55" width="48" height="35" fill="#60a5fa" opacity=".45"/>`],
    ["Konussimon kolba", "Aralashtirish va titrlash uchun — tor og‘zi suyuqlik sachrashidan saqlaydi.", `<path d="M42 10 L42 38 L18 88 Q16 92 22 92 L78 92 Q84 92 82 88 L58 38 L58 10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M28 70 L72 70 L80 88 L20 88 Z" fill="#a78bfa" opacity=".45"/>`],
    ["O‘lchov silindri (menzurka)", "Suyuqlik hajmini aniq o‘lchash uchun. Ko‘z menisk pastki chegarasi bilan bir sathda bo‘lsin.", `<path d="M38 8 L38 86 L30 92 L70 92 L62 86 L62 8" fill="none" stroke="currentColor" stroke-width="3"/>${[20, 35, 50, 65].map((y) => `<line x1="38" x2="48" y1="${y}" y2="${y}" stroke="currentColor"/>`).join("")}<rect x="40" y="45" width="20" height="40" fill="#22c55e" opacity=".4"/>`],
    ["Voronka", "Suyuqlikni tor idishga quyish va filtrlash (filtr qog‘oz bilan) uchun.", `<path d="M15 15 L85 15 L56 55 L56 92 L44 92 L44 55 Z" fill="none" stroke="currentColor" stroke-width="3"/>`],
    ["Spirt lampa", "Qizdirish uchun. Faqat gugurt bilan yoqiladi, qopqog‘i bilan o‘chiriladi — puflab o‘chirilmaydi!", `<path d="M20 60 Q20 92 50 92 Q80 92 80 60 Z" fill="none" stroke="currentColor" stroke-width="3"/><rect x="44" y="44" width="12" height="16" fill="currentColor" opacity=".5"/><path d="M50 42 q-10 -14 0 -30 q10 16 0 30" fill="#f59e0b" class="ks-flame"/>`],
    ["Shtativ", "Idishlarni (probirka, kolba, voronka) qisqich va halqa yordamida mahkamlash uchun.", `<rect x="20" y="86" width="60" height="8" fill="currentColor" opacity=".6"/><rect x="30" y="10" width="5" height="78" fill="currentColor" opacity=".7"/><rect x="32" y="40" width="40" height="5" fill="currentColor" opacity=".7"/><circle cx="74" cy="42" r="8" fill="none" stroke="currentColor" stroke-width="3"/>`],
    ["Chinni kosacha", "Eritmalarni bug‘latish uchun — yuqori haroratga chidamli.", `<path d="M10 45 Q50 100 90 45 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 55 Q50 85 78 55 Z" fill="#f8fafc" opacity=".3"/>`],
    ["Tigel qisqich", "Qizigan tigel va kosachalarni ushlash uchun. Qizigan idishni qo‘l bilan ushlamang!", `<path d="M20 90 L50 40 L80 90 M50 40 L44 10 M50 40 L56 10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`],
    ["Pipetka", "Suyuqlikni tomchilab yoki aniq hajmda olish uchun.", `<path d="M47 5 L53 5 L53 30 L56 34 L56 70 L51 92 L49 92 L44 70 L44 34 L47 30 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="46" y="55" width="8" height="18" fill="#60a5fa" opacity=".5"/>`],
  ];
  W.equip = (root, p) => {
    const { stage, out } = frame(root, p.title || "🔬 Laboratoriya jihozlari — rasmni bosing");
    const grid = h("div", { class: "kq-equip" });
    EQUIP.forEach(([n, d, art], i) => {
      const b = h("button", { type: "button", class: "kq-it", html: `<svg viewBox="0 0 100 100" class="kq-ic">${art}</svg><span>${n}</span>` });
      b.onclick = () => { grid.querySelectorAll(".on").forEach((x) => x.classList.remove("on")); b.classList.add("on"); out.innerHTML = `<b>${n}</b> — ${d}`; };
      grid.append(b);
    });
    stage.append(grid);
    out.innerHTML = "Jihozni bosing — nomi va nima uchun ishlatilishi chiqadi.";
  };

  // ===================================================================
  // 11. Metallar faollik qatori: metall + kislota / tuz eritmasi
  // ===================================================================
  const ACT = ["Li", "K", "Ba", "Ca", "Na", "Mg", "Al", "Zn", "Fe", "Ni", "Sn", "Pb", "H", "Cu", "Hg", "Ag", "Pt", "Au"];
  const VAL = { Li: 1, K: 1, Ba: 2, Ca: 2, Na: 1, Mg: 2, Al: 3, Zn: 2, Fe: 2, Ni: 2, Sn: 2, Pb: 2, Cu: 2, Hg: 2, Ag: 1, Pt: 2, Au: 3 };
  const MCOL = { Mg: "#e5e7eb", Al: "#e2e8f0", Zn: "#cbd5e1", Fe: "#6b7280", Ni: "#a8a29e", Sn: "#d4d4d8", Pb: "#71717a", Cu: "#c2703d", Ag: "#e5e7eb", Au: "#facc15" };
  const SOLS = [["HCl", "Xlorid kislota", null, "Cl", 1, "#cfe6ff"], ["CuSO4", "Mis(II) sulfat", "Cu", "SO4", 2, "#3b82f6"], ["AgNO3", "Kumush nitrat", "Ag", "NO3", 1, "#cfe6ff"], ["FeSO4", "Temir(II) sulfat", "Fe", "SO4", 2, "#bbf7d0"], ["Pb(NO3)2", "Qo‘rg‘oshin nitrat", "Pb", "NO3", 1, "#cfe6ff"], ["ZnSO4", "Rux sulfat", "Zn", "SO4", 2, "#cfe6ff"]];
  const saltOf = (m, an, ac) => { const v = VAL[m]; const g = (a, b) => (b ? g(b, a % b) : a); const d = g(v, ac); const nm = ac / d, na = v / d; const A = an.length > 2 || /\d/.test(an) ? (na > 1 ? `(${an})${na}` : an) : an + (na > 1 ? na : ""); return `${m}${nm > 1 ? nm : ""}${A}`; };
  W.activity = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📏 Metallarning faollik qatori — metall va eritmani tanlang");
    const metals = ["Mg", "Al", "Zn", "Fe", "Sn", "Pb", "Cu", "Ag", "Au"];
    let mi = 2, si = 1;
    const row = h("div", { class: "kq-act" }, ...ACT.map((m) => h("span", { class: m === "H" ? "hh" : "" }, m)));
    stage.append(row);
    const sc = beakerScene(stage); sc.tube(null, false);
    const ms = h("select", { class: "kb-select" }, ...metals.map((m, i) => h("option", { value: i }, `${m} — ${BY[m].name}`))); ms.value = mi;
    const ss = h("select", { class: "kb-select" }, ...SOLS.map((x, i) => h("option", { value: i }, `${x[1]} (${x[0]})`))); ss.value = si;
    ms.onchange = () => { mi = +ms.value; prep(); }; ss.onchange = () => { si = +ss.value; prep(); };
    const go = button("🧪 Metallni tushirish", () => run());
    controls.append(h("label", { class: "ctl" }, h("span", {}, "Metall"), ms), h("label", { class: "ctl" }, h("span", {}, "Eritma"), ss), go);
    function prep() {
      const S = SOLS[si];
      sc.reset(); sc.solid(null); sc.liquid(S[5], 80, S[5] === "#cfe6ff" ? 0.35 : 0.6); sc.label(`${S[1]}`, "");
      row.querySelectorAll("span").forEach((e) => e.classList.toggle("on", e.textContent === metals[mi] || e.textContent === (S[2] || "H")));
      out.innerHTML = `Faollik qatorida <b>${metals[mi]}</b> va <b>${S[2] || "H"}</b> belgilangan. Chapdagi metall o‘ngdagini siqib chiqaradi. Taxmin qiling va bosing!`;
      go.disabled = false;
    }
    async function run() {
      go.disabled = true;
      const m = metals[mi], S = SOLS[si], other = S[2] || "H", yes = ACT.indexOf(m) < ACT.indexOf(other) && m !== other;
      sc.solid("metal", MCOL[m] || "#9ca3af"); await wait(400);
      if (!yes) { out.innerHTML = `❌ <b>Reaksiya bormaydi.</b> ${m} faollik qatorida ${other} dan ${m === other ? "farq qilmaydi" : "o‘ngda"} — uni ${S[2] ? "tuzidan" : "kislotadan"} siqib chiqara olmaydi.`; return; }
      const salt = saltOf(m, S[3], S[4]);
      const L = [m, S[0]], R = S[2] ? [salt, S[2]] : [salt, "H2"];
      let k = null; try { k = balance(L, R); } catch (e) { /* bo'sh */ }
      if (!S[2]) { sc.bubbles(30, "#fff", "solid"); sc.shrinkSolid(0.5); }
      else { setTimeout(() => sc.solidColor(MCOL[S[2]] || "#b45309"), 400); if (S[5] !== "#cfe6ff") setTimeout(() => sc.color("#cfe6ff", 0.35), 600); }
      await wait(1200);
      out.innerHTML = `✅ <b>Reaksiya boradi!</b> ${S[2] ? `Metall sirtida <b>${BY[S[2]].name.toLowerCase()}</b> qatlami hosil bo‘ladi.` : "Vodorod gazi ajraladi."}<div class="kb-eq">${eqHTML(L, R, k)}${S[2] ? "" : " ↑"}</div>`;
    }
    prep();
  };

  // ===================================================================
  // 12. Korroziya: temir mix turli sharoitda
  // ===================================================================
  W.corrosion = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧷 Korroziya — kunlarni o‘tkazib kuzating");
    const CASES = [["Quruq havo (CaCl₂ bilan)", 0.02, "#f8fafc"], ["Qaynatilgan suv + moy qatlami", 0.06, "#bfdbfe"], ["Oddiy suv", 0.5, "#bfdbfe"], ["Sho‘r suv (NaCl)", 1, "#e0f2fe"], ["Ruxlangan (sinklangan) mix + suv", 0.03, "#bfdbfe"], ["Mis bilan tutashgan mix + suv", 1.3, "#bfdbfe"]];
    let d = 0;
    const row = h("div", { class: "kq-corr" }); stage.append(row);
    function draw() {
      row.innerHTML = CASES.map(([n, r, c]) => { const rust = Math.min(1, (r * d) / 14); return `<div><svg viewBox="0 0 60 120"><path d="M14 10 L14 100 Q14 112 30 112 Q46 112 46 100 L46 10" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="16" y="40" width="28" height="70" fill="${c}" opacity=".35"/><rect x="27" y="20" width="6" height="86" fill="${n.startsWith("Ruxlangan") ? "#cbd5e1" : "#6b7280"}"/><rect x="27" y="40" width="6" height="66" fill="#b45309" opacity="${rust}"/>${rust > 0.4 ? `<rect x="16" y="104" width="28" height="${rust * 6}" fill="#92400e" opacity=".8"/>` : ""}</svg><small>${n}</small><b>${rust < 0.05 ? "zang yo‘q" : rust < 0.4 ? "oz zang" : rust < 0.8 ? "zanglagan" : "kuchli zang"}</b></div>`; }).join("");
      out.innerHTML = `${d} kun o‘tdi. <div class="muted">Temir zanglashi uchun <b>suv + kislorod</b> birga kerak: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃. Tuz tezlashtiradi. Rux qoplama himoya qiladi (rux o‘zi oksidlanadi), kam faol metall (mis) bilan tutashuv esa zanglashni kuchaytiradi.</div>`;
    }
    controls.append(slider({ label: "Vaqt", min: 0, max: 14, value: d, fmt: (v) => `${v} kun`, onInput: (v) => { d = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 13. Kristall panjaralar (aylanadigan 3D model)
  // ===================================================================
  const LAT = {
    NaCl: ["Ionli panjara — NaCl", "Tugunlarda Na⁺ va Cl⁻ ionlari. Qattiq, mo‘rt, suyuqlanish harorati yuqori (801 °C), eritmasi tok o‘tkazadi.", (x, y, z) => ((x + y + z) % 2 ? ["#a78bfa", 7] : ["#22c55e", 10])],
    metal: ["Metall panjara — Cu, Fe", "Tugunlarda metall atom-ionlari, ular orasida erkin elektronlar “gazi”. Bolg‘alanuvchan, tok va issiqlik o‘tkazadi.", () => ["#f59e0b", 8]],
    atom: ["Atom panjara — olmos, kvars", "Tugunlarda atomlar kuchli kovalent bog‘langan. Juda qattiq, suyuqlanish harorati juda yuqori, erimaydi.", () => ["#94a3b8", 7]],
    mol: ["Molekulyar panjara — muz, yod, CO₂", "Tugunlarda molekulalar kuchsiz kuchlar bilan bog‘langan. Yumshoq, oson suyuqlanadi yoki sublimatsiyalanadi.", (x, y, z) => ((x + y + z) % 2 ? ["#38bdf8", 6] : ["#ef4444", 9])],
  };
  W.crystal = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💎 Kristall panjara turlari — modelni tanlang");
    let li = 0, ang = 0;
    const keys = Object.keys(LAT);
    const pts = []; for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 3; z++) pts.push([x, y, z]);
    animCanvas(stage, 300, 220, (c, dt) => {
      ang += dt * 0.5;
      const [, , col] = LAT[keys[li]];
      c.clearRect(0, 0, 300, 220);
      const pr = pts.map(([x, y, z]) => { const X = x - 1, Y = y - 1, Z = z - 1; const cx = X * Math.cos(ang) - Z * Math.sin(ang), cz = X * Math.sin(ang) + Z * Math.cos(ang); const cy = Y * Math.cos(0.45) - cz * Math.sin(0.45), dz = Y * Math.sin(0.45) + cz * Math.cos(0.45); const f = 1 / (1 + dz * 0.15); return [150 + cx * 62 * f, 110 + cy * 62 * f, dz, x, y, z, f]; });
      c.globalAlpha = 0.35; c.strokeStyle = ink();
      pr.forEach((a) => pr.forEach((b) => { if (Math.abs(a[3] - b[3]) + Math.abs(a[4] - b[4]) + Math.abs(a[5] - b[5]) === 1) { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } }));
      c.globalAlpha = 1;
      if (keys[li] === "metal") for (let i = 0; i < 18; i++) { c.fillStyle = "#38bdf8"; c.beginPath(); c.arc(150 + Math.sin(ang * 3 + i) * 80, 110 + Math.cos(ang * 2.3 + i * 1.7) * 70, 2, 0, 6.28); c.fill(); }
      pr.sort((a, b) => b[2] - a[2]).forEach(([X, Y, , x, y, z, f]) => { const [cc, r] = col(x, y, z); c.beginPath(); c.arc(X, Y, r * f, 0, 6.28); c.fillStyle = cc; c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; c.stroke(); });
    });
    controls.append(buttons(keys.map((k) => LAT[k][0]), (i) => { li = i; out.innerHTML = `<b>${LAT[keys[i]][0]}</b><div>${LAT[keys[i]][1]}</div>`; }, 0));
    out.innerHTML = `<b>${LAT.NaCl[0]}</b><div>${LAT.NaCl[1]}</div>`;
  };
})();
