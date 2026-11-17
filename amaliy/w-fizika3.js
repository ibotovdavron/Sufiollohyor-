/* Fizika jonli tajribalari (3-qism): magnit maydon, tokli ramka (dvigatel), Lorens kuchi, elektromagnit induksiya,
   o'zinduksiya, tebranish konturi, o'zgaruvchan tok zanjiri va rezonans.
   Astronomiya: osmon sferasi, Oy fazalari va tutilishlar, Quyosh sistemasi, Kepler qonunlari, parallaks, nurlanish, teleskop, Quyosh tuzilishi. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const { animCanvas, plot, arrow, label, r2, ink } = window.FIZ;
  const PI = Math.PI, MU0 = 4 * PI * 1e-7;

  // ===================================================================
  // 1. Magnit maydon: to'g'ri o'tkazgich, halqa, g'altak (kompas strelkalari)
  // ===================================================================
  W.magField = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧲 Tokning magnit maydoni — kompas strelkalari");
    let kind = p.kind || "wire", I = 5, dir = 1, N = 200, Lc = 0.1;
    const Bat = (x, y) => {
      if (kind === "wire") { const r2_ = x * x + y * y + 0.02; return [(-dir * y) / r2_, (dir * x) / r2_]; }
      // halqa/g'altak: kesimda ikki teskari o'tkazgich (yuqori va past)
      let bx = 0, by = 0; const rings = kind === "loop" ? [0] : [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
      for (const cx of rings) for (const [cy, sg] of [[0.55, 1], [-0.55, -1]]) { const dx = x - cx, dy = y - cy, rr = dx * dx + dy * dy + 0.01; bx += (-sg * dir * dy) / rr; by += (sg * dir * dx) / rr; }
      return [bx, by];
    };
    animCanvas(stage, 340, 240, (c, dt, t) => {
      c.clearRect(0, 0, 340, 240); const sc = 70, cx = 170, cy = 120;
      for (let gx = -2.2; gx <= 2.2; gx += 0.4) for (let gy = -1.5; gy <= 1.5; gy += 0.4) {
        const [bx, by] = Bat(gx, gy), m = Math.hypot(bx, by); if (m < 1e-6) continue; const ux = bx / m, uy = by / m, X = cx + gx * sc, Y = cy - gy * sc, L = 11, a = Math.min(1, 0.25 + m * 0.25);
        c.globalAlpha = a; c.strokeStyle = "#ef4444"; c.lineWidth = 3; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + ux * L, Y - uy * L); c.stroke(); c.strokeStyle = "#e2e8f0"; c.beginPath(); c.moveTo(X, Y); c.lineTo(X - ux * L, Y + uy * L); c.stroke(); c.globalAlpha = 1;
      }
      const sym = (x, y, sg) => { c.fillStyle = "#facc15"; c.beginPath(); c.arc(cx + x * sc, cy - y * sc, 9, 0, 7); c.fill(); c.fillStyle = "#111"; c.font = "900 13px system-ui"; c.textAlign = "center"; c.fillText(sg > 0 ? "•" : "×", cx + x * sc, cy - y * sc + 5); };
      if (kind === "wire") sym(0, 0, dir); else { const rings = kind === "loop" ? [0] : [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9]; rings.forEach((x) => { sym(x, 0.55, dir); sym(x, -0.55, -dir); }); }
      label(c, 170, 232, "• — tok bizga qarab, × — bizdan, qizil uchi — Shimol", "#cbd5e1", "rgba(0,0,0,.5)", 10);
    });
    function info() {
      const r = 0.05, B = kind === "wire" ? (MU0 * I) / (2 * PI * r) : kind === "loop" ? (MU0 * I) / (2 * 0.05) : (MU0 * N * I) / Lc;
      out.innerHTML = `<div class="big-num">B = ${kind === "wire" ? "μ₀I/(2πr)" : kind === "loop" ? "μ₀I/(2R)" : "μ₀NI/l"} = ${r2(B * 1000, 3)} mTl</div><div>${kind === "wire" ? "To‘g‘ri tok atrofida kuch chiziqlari — konsentrik aylanalar (r = 5 sm da). Yo‘nalishi <b>parma (o‘ng vint) qoidasi</b> bilan topiladi." : kind === "loop" ? "Halqa markazida maydon (R = 5 sm) — halqa tekisligiga perpendikulyar." : `G‘altak (solenoid, N = ${N}, l = ${num(Lc * 100)} sm) ichida maydon deyarli <b>bir jinsli</b> — doimiy magnitga o‘xshaydi; temir o‘zak qo‘yilsa — elektromagnit.`}</div><div class="muted">μ₀ = 4π·10⁻⁷ Tl·m/A — magnit doimiysi. Tok yo‘nalishi o‘zgarsa, kompaslar teskari buriladi (Ersted tajribasi, 1820).</div>`;
    }
    function render() {
      controls.innerHTML = "";
      if (!p.kind) controls.append(buttons(["To‘g‘ri o‘tkazgich", "Halqa", "G‘altak (solenoid)"], (i) => { kind = ["wire", "loop", "coil"][i]; render(); }, ["wire", "loop", "coil"].indexOf(kind)));
      controls.append(slider({ label: "Tok kuchi I", min: 1, max: 20, value: I, fmt: (v) => v + " A", onInput: (v) => { I = v; info(); } }), button("⇄ Tok yo‘nalishini almashtirish", () => { dir *= -1; }, "ghost"));
      if (kind === "coil") controls.append(slider({ label: "O‘ramlar soni N", min: 50, max: 1000, step: 50, value: N, onInput: (v) => { N = v; info(); } }));
      info();
    }
    render();
  };

  // ===================================================================
  // 2. Tokli ramka magnit maydonda (elektr dvigatel), parallel toklar
  // ===================================================================
  W.motor = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚙️ Bir jinsli magnit maydonda tokli ramka — elektr dvigatel");
    let B = 0.5, I = 2, S = 0.01, Nw = 10, om = 0, ph = 0;
    animCanvas(stage, 340, 220, (c, dt) => {
      const M = Nw * B * I * S * Math.abs(Math.sin(ph)); om += M * dt * 60 - om * dt * 0.8; ph += om * dt;
      c.clearRect(0, 0, 340, 220);
      c.fillStyle = "#ef4444"; c.fillRect(10, 40, 60, 140); c.fillStyle = "#3b82f6"; c.fillRect(270, 40, 60, 140);
      c.fillStyle = "#fff"; c.font = "900 26px system-ui"; c.textAlign = "center"; c.fillText("N", 40, 120); c.fillText("S", 300, 120);
      c.strokeStyle = "rgba(255,255,255,.18)"; for (let y = 55; y < 180; y += 20) { c.beginPath(); c.moveTo(72, y); c.lineTo(268, y); c.stroke(); }
      const w = 80 * Math.abs(Math.cos(ph)); c.strokeStyle = "#facc15"; c.lineWidth = 5; c.strokeRect(170 - w / 2, 60, w, 100);
      c.fillStyle = Math.cos(ph) > 0 ? "#facc15" : "#ca8a04"; c.fillRect(165, 160, 10, 30);
      label(c, 170, 210, `M = NBIS·sinα = ${r2(Nw * B * I * S * Math.abs(Math.sin(ph)), 3)} N·m`, "#fde047");
    });
    out.innerHTML = `<div>Ramkaning tokli tomonlariga <b>Amper kuchi</b> F = BIl·sinα ta’sir qiladi va juft kuch ramkani aylantiradi: M = N·B·I·S·sinα. Kollektor tok yo‘nalishini har yarim aylanishda almashtiradi — ramka to‘xtovsiz aylanadi. <b>Elektr dvigatel</b> shunday ishlaydi.</div><div class="muted">Amper kuchi yo‘nalishi — <b>chap qo‘l qoidasi</b>: kuch chiziqlari kaftga kirsa, 4 barmoq tok yo‘nalishida bo‘lsa, ochilgan bosh barmoq kuch yo‘nalishini ko‘rsatadi. Parallel toklar bir yo‘nalishda bo‘lsa tortishadi, qarama-qarshi bo‘lsa itarishadi: F = μ₀I₁I₂l/(2πd).</div>`;
    controls.append(slider({ label: "Magnit induksiya B", min: 0.1, max: 1, step: 0.1, value: B, fmt: (v) => num(v) + " Tl", onInput: (v) => (B = v) }), slider({ label: "Tok kuchi I", min: 0, max: 5, step: 0.5, value: I, fmt: (v) => num(v) + " A", onInput: (v) => (I = v) }), slider({ label: "O‘ramlar N", min: 1, max: 50, value: Nw, onInput: (v) => (Nw = v) }));
  };

  // ===================================================================
  // 3. Lorens kuchi: zaryadli zarra magnit maydonda
  // ===================================================================
  W.lorentz = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌀 Lorens kuchi: zarra magnit maydonda aylana chizadi");
    let B = 0.5, v = 2, q = 1, m = 1, P = null;
    const reset = () => (P = { x: 30, y: 200, vx: 1, vy: 0, tr: [] });
    reset();
    animCanvas(stage, 340, 240, (c, dt) => {
      const sp = v * 40, R = (m * v) / (Math.abs(q) * B) * 22, w = (q * sp) / R;
      for (let k = 0; k < 4; k++) { const ang = Math.atan2(P.vy, P.vx) - (w * dt) / 4; P.vx = Math.cos(ang); P.vy = Math.sin(ang); P.x += P.vx * sp * dt / 4; P.y += P.vy * sp * dt / 4; P.tr.push([P.x, P.y]); }
      if (P.tr.length > 800) P.tr.splice(0, 4); if (P.x < -50 || P.x > 400 || P.y < -50 || P.y > 300) reset();
      c.clearRect(0, 0, 340, 240); c.fillStyle = "rgba(148,163,184,.4)"; c.font = "12px system-ui"; c.textAlign = "center"; for (let x = 20; x < 340; x += 30) for (let y = 20; y < 240; y += 30) c.fillText("×", x, y);
      c.strokeStyle = q > 0 ? "#f87171" : "#60a5fa"; c.lineWidth = 2; c.beginPath(); P.tr.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      c.fillStyle = q > 0 ? "#ef4444" : "#3b82f6"; c.beginPath(); c.arc(P.x, P.y, 6, 0, 7); c.fill();
      label(c, 90, 230, "× — B bizdan ichkariga", "#cbd5e1", "rgba(0,0,0,.5)", 10);
    });
    function info() { out.innerHTML = `<div class="big-num">F = qvB · R = mv/(qB) · T = 2πm/(qB)</div><div>Lorens kuchi tezlikka doim perpendikulyar — u zarrani tezlatmaydi, faqat burib, <b>aylana</b> bo‘ylab harakatlantiradi. B yoki zaryad katta bo‘lsa, aylana kichrayadi; massa yoki tezlik katta bo‘lsa — kattalashadi. Musbat va manfiy zarralar teskari tomonga buriladi.</div><div class="muted">Qo‘llanilishi: mass-spektrometr, tezlatgichlar (siklotron), shimol yog‘dusi — Quyosh zarralari Yer magnit maydonida qutblar tomon buriladi.</div>`; }
    controls.append(slider({ label: "Magnit induksiya B", min: 0.2, max: 2, step: 0.1, value: B, fmt: (x) => num(x) + " Tl", onInput: (x) => { B = x; info(); } }), slider({ label: "Tezlik v", min: 0.5, max: 4, step: 0.5, value: v, fmt: (x) => num(x), onInput: (x) => { v = x; info(); } }), slider({ label: "Massa m", min: 0.5, max: 4, step: 0.5, value: m, fmt: (x) => num(x), onInput: (x) => { m = x; info(); } }), buttons(["Musbat zarra (proton)", "Manfiy (elektron)"], (i) => { q = i ? -1 : 1; reset(); info(); }, 0), button("↺", () => reset(), "ghost"));
    info();
  };

  // ===================================================================
  // 4. Elektromagnit induksiya: magnitni g'altakka kiritish
  // ===================================================================
  W.induction = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔁 Elektromagnit induksiya: magnitni suring (yoki ▶ bosing)");
    let x = 40, prevX = 40, auto = false, N = 100, emf = 0, drag = false; const hist = [];
    const flux = (xm) => { const d = (xm - 230) / 40; return 1 / (1 + d * d); };
    const cv = animCanvas(stage, 340, 230, (c, dt, t) => {
      if (auto) x = 140 + 100 * Math.sin(t * 1.6);
      const e = -N * (flux(x) - flux(prevX)) / Math.max(dt, 0.001) * 0.01; emf += (e - emf) * 0.4; prevX = x;
      hist.push(emf); if (hist.length > 200) hist.shift();
      c.clearRect(0, 0, 340, 230);
      c.strokeStyle = "#c2703d"; c.lineWidth = 4; for (let i = 0; i < 10; i++) { c.beginPath(); c.ellipse(205 + i * 6, 80, 6, 34, 0, 0, 7); c.stroke(); }
      c.fillStyle = "#ef4444"; c.fillRect(x - 40, 66, 40, 28); c.fillStyle = "#3b82f6"; c.fillRect(x, 66, 40, 28); c.fillStyle = "#fff"; c.font = "900 14px system-ui"; c.textAlign = "center"; c.fillText("N", x - 20, 85); c.fillText("S", x + 20, 85);
      c.strokeStyle = ink(); c.lineWidth = 2; c.beginPath(); c.arc(270, 175, 34, PI, 2 * PI); c.stroke();
      const ang = -PI / 2 + Math.max(-1.3, Math.min(1.3, emf * 0.6)); c.strokeStyle = "#ef4444"; c.lineWidth = 3; c.beginPath(); c.moveTo(270, 175); c.lineTo(270 + 30 * Math.cos(ang), 175 + 30 * Math.sin(ang)); c.stroke();
      label(c, 270, 200, "galvanometr", "#cbd5e1", "rgba(0,0,0,.4)", 10);
      c.strokeStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(10, 175); c.lineTo(200, 175); c.stroke(); c.strokeStyle = "#fde047"; c.lineWidth = 2; c.beginPath(); hist.forEach((v, i) => { const X = 10 + i * 0.95, Y = 175 - v * 18; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke();
      label(c, 100, 222, "ℰ(t) — induksiya EYuK", "#fde047", "rgba(0,0,0,.4)", 10);
    });
    const posx = (e) => { const r = cv.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 340; };
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", (e) => { drag = true; auto = false; x = Math.max(40, Math.min(300, posx(e))); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (drag) x = Math.max(40, Math.min(300, posx(e))); });
    cv.addEventListener("pointerup", () => (drag = false));
    out.innerHTML = `<div class="big-num">ℰ = −N·ΔΦ/Δt (Faradey qonuni)</div><div>G‘altak orqali o‘tayotgan <b>magnit oqimi o‘zgarganda</b> induksiya toki paydo bo‘ladi. Magnit tinch tursa — tok yo‘q. Tezroq harakatlantirsangiz — EYuK katta. Kiritish va chiqarishda tok yo‘nalishi teskari (<b>Lens qoidasi</b>: induksiya toki o‘zini keltirib chiqargan o‘zgarishga qarshilik qiladi).</div><div class="muted">Elektr stansiyalardagi generatorlar, transformatorlar, simsiz zaryadlash, induksion plita — hammasi shu hodisaga asoslangan (Faradey, 1831).</div>`;
    controls.append(button("▶ Avtomatik harakat", () => { auto = !auto; }), slider({ label: "O‘ramlar soni N", min: 20, max: 300, step: 20, value: N, onInput: (v) => (N = v) }));
  };

  // ===================================================================
  // 5. O'zinduksiya: kalit ulanganda lampalar
  // ===================================================================
  W.selfInd = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💡 O‘zinduksiya: g‘altakli lampa kechikib yonadi");
    let L = 2, R = 4, U = 6, t0 = null, on = false;
    animCanvas(stage, 340, 200, (c) => {
      const t = t0 ? (performance.now() - t0) / 1000 : 0, I0 = U / R, tau = L / R;
      const i1 = on ? I0 : 0, i2 = on ? I0 * (1 - Math.exp(-t / tau)) : I0 * Math.exp(-t / tau) * (t0 ? 1 : 0);
      c.clearRect(0, 0, 340, 200);
      const lamp = (x, y, I, txt) => { const g_ = Math.min(1, I / I0); c.fillStyle = `rgba(253,224,71,${0.1 + g_ * 0.9})`; c.beginPath(); c.arc(x, y, 18 + g_ * 12, 0, 7); c.fill(); c.strokeStyle = ink(); c.lineWidth = 2; c.beginPath(); c.arc(x, y, 16, 0, 7); c.stroke(); label(c, x, y + 44, txt, "#cbd5e1", "rgba(0,0,0,.4)", 11); };
      lamp(110, 70, i1, "rezistor bilan"); lamp(240, 70, i2, "g‘altak bilan");
      const G = (tt) => I0 * (1 - Math.exp(-tt / tau)); c.strokeStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(20, 185); c.lineTo(330, 185); c.stroke();
      c.strokeStyle = "#fde047"; c.beginPath(); for (let k = 0; k <= 100; k++) { const tt = (k / 100) * tau * 5, X = 20 + k * 3.1, Y = 185 - (G(tt) / I0) * 50; k ? c.lineTo(X, Y) : c.moveTo(X, Y); } c.stroke();
    });
    function info() { out.innerHTML = `<div class="big-num">ℰ<sub>s</sub> = −L·ΔI/Δt · τ = L/R = ${r2(L / R, 2)} s · W = LI²/2 = ${r2((L * (U / R) ** 2) / 2, 2)} J</div><div>Kalit ulanganda g‘altakda tok o‘zgarishiga qarshi <b>o‘zinduksiya EYuK</b> paydo bo‘ladi — tok asta-sekin ortadi, lampa kechikib yonadi. Induktivlik L (Genri) katta bo‘lsa, kechikish uzun.</div><div class="muted">Uzilishda esa g‘altak tokni “ushlab qolishga” intiladi — uchqun chiqishi mumkin (avtomobil o‘t oldirish g‘altagi shunday ishlaydi).</div>`; }
    controls.append(button("🔌 Kalitni ulash / uzish", () => { on = !on; t0 = performance.now(); }), slider({ label: "Induktivlik L", min: 0.5, max: 5, step: 0.5, value: L, fmt: (v) => num(v) + " Gn", onInput: (v) => { L = v; info(); } }), slider({ label: "Qarshilik R", min: 1, max: 10, value: R, fmt: (v) => v + " Ω", onInput: (v) => { R = v; info(); } }));
    info();
  };

  // ===================================================================
  // 6. Tebranish konturi (LC): energiya almashinuvi, so'nish, generator
  // ===================================================================
  W.lc = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📻 Tebranish konturi: kondensator ⇄ g‘altak");
    let L = 0.5, C = 2, Rd = 0, gen = false; const hq = [], hi = [];
    animCanvas(stage, 340, 240, (c, dt, t) => {
      const w = 1 / Math.sqrt(L * C) * 3, beta = gen ? 0 : Rd, A = Math.exp(-beta * t), q = A * Math.cos(w * t), i = -A * Math.sin(w * t);
      hq.push(q); hi.push(i); if (hq.length > 200) { hq.shift(); hi.shift(); }
      c.clearRect(0, 0, 340, 240);
      c.fillStyle = "#ef4444"; c.fillRect(30, 40, 50, 6); c.fillStyle = "#3b82f6"; c.fillRect(30, 70, 50, 6);
      c.fillStyle = `rgba(125,211,252,${Math.abs(q)})`; c.fillRect(30, 46, 50, 24);
      c.strokeStyle = "#c2703d"; c.lineWidth = 3; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(140 + k * 12, 58, 7, PI, 0); c.stroke(); }
      c.strokeStyle = `rgba(253,224,71,${Math.abs(i)})`; c.lineWidth = 2; for (let r = 10; r < 40; r += 10) { c.beginPath(); c.ellipse(170, 58, r + 20, r, 0, 0, 7); c.stroke(); }
      const bar = (x, v, col, txt) => { c.fillStyle = "rgba(255,255,255,.1)"; c.fillRect(x, 20, 24, 80); c.fillStyle = col; c.fillRect(x, 100 - v * 80, 24, v * 80); label(c, x + 12, 114, txt, col, "rgba(0,0,0,0)", 10); };
      bar(260, q * q, "#38bdf8", "W_el"); bar(296, i * i, "#fde047", "W_mag");
      c.strokeStyle = "rgba(255,255,255,.3)"; c.beginPath(); c.moveTo(10, 180); c.lineTo(330, 180); c.stroke();
      for (const [arr, col] of [[hq, "#38bdf8"], [hi, "#fde047"]]) { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); arr.forEach((v, k) => { const X = 10 + k * 1.6, Y = 180 - v * 50; k ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.stroke(); }
      label(c, 90, 236, "q(t) — ko‘k, i(t) — sariq", "#cbd5e1", "rgba(0,0,0,.4)", 10);
    });
    function info() { const T = 2 * PI * Math.sqrt(L * 1e-3 * C * 1e-6); out.innerHTML = `<div class="big-num">T = 2π√(LC) = 2π√(${num(L)}·10⁻³ · ${num(C)}·10⁻⁶) = ${r2(T * 1e6, 1)} mks · ν = ${r2(1 / T / 1000, 2)} kGs</div><div>Zaryadlangan kondensator g‘altak orqali razryadlanadi: <b>elektr maydon energiyasi</b> (q²/2C) <b>magnit maydon energiyasiga</b> (Li²/2) aylanadi va aksincha. Zaryad va tok chorak davrga siljigan.</div><div class="muted">${gen ? "<b>Generator rejimi</b>: tranzistor har davrda manbadan energiya qo‘shib turadi — so‘nmas tebranishlar (radio uzatgichlar)." : Rd ? "Qarshilik tufayli energiya issiqlikka aylanadi — <b>so‘nuvchi tebranishlar</b>." : "Qarshiliksiz ideal kontur — so‘nmas erkin tebranishlar."} Radioda kontur sig‘imini o‘zgartirib kerakli stansiya chastotasi tanlanadi.</div>`; }
    controls.append(slider({ label: "Induktivlik L", min: 0.1, max: 2, step: 0.1, value: L, fmt: (v) => num(v) + " mGn", onInput: (v) => { L = v; info(); } }), slider({ label: "Sig‘im C", min: 0.5, max: 5, step: 0.5, value: C, fmt: (v) => num(v) + " mkF", onInput: (v) => { C = v; info(); } }), slider({ label: "Qarshilik (so‘nish)", min: 0, max: 0.5, step: 0.05, value: Rd, fmt: (v) => num(v), onInput: (v) => { Rd = v; info(); } }), h("label", { class: "kb-check" }, h("input", { type: "checkbox", onchange: (e) => { gen = e.target.checked; info(); } }), " Tranzistorli generator"));
    info();
  };

  // ===================================================================
  // 7. O'zgaruvchan tok: R, L, C, RLC va rezonans
  // ===================================================================
  W.ac = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "〰 O‘zgaruvchan tok zanjiri");
    let kind = p.kind || "R", f = 50, R = 20, L = 0.2, C = 50, Um = 100;
    const g1 = h("div"), g2 = h("div"); stage.append(g1, g2);
    function draw() {
      const w = 2 * PI * f, XL = w * L, XC = 1 / (w * C * 1e-6);
      let Z, phi; if (kind === "R") { Z = R; phi = 0; } else if (kind === "L") { Z = XL; phi = PI / 2; } else if (kind === "C") { Z = XC; phi = -PI / 2; } else { Z = Math.hypot(R, XL - XC); phi = Math.atan2(XL - XC, R); }
      const Im = Um / Z, P_ = (Um * Im) / 2 * Math.cos(phi);
      const G = plot(0, 2 / f, -Um * 1.1, Um * 1.1, 340, 160, ["t", "u, i"]);
      G.curve((t) => Um * Math.sin(w * t), "#38bdf8"); G.curve((t) => Math.min(Um, Im * 20) * Math.sin(w * t - phi), "#fde047");
      g1.innerHTML = ""; g1.append(G.g);
      g2.innerHTML = "";
      if (kind === "RLC") { const f0 = 1 / (2 * PI * Math.sqrt(L * C * 1e-6)); const Q = plot(10, 200, 0, Um / R * 1.1, 340, 140, ["ν, Gs", "I, A"]); Q.curve((ff) => Um / Math.hypot(R, 2 * PI * ff * L - 1 / (2 * PI * ff * C * 1e-6)), "#a78bfa"); Q.dot(f, Im); Q.text(f0, Um / R * 1.02, "ν₀", "#fde047", "middle"); g2.append(Q.g); }
      out.innerHTML = `<div class="big-num">Z = ${r2(Z, 1)} Ω · I<sub>m</sub> = U<sub>m</sub>/Z = ${r2(Im, 2)} A · φ = ${Math.round((phi * 180) / PI)}° · P = UIcosφ/… = ${r2(P_, 1)} W</div>
        <div>${kind === "R" ? "Aktiv qarshilikda tok va kuchlanish <b>bir fazada</b> (ko‘k va sariq bir vaqtda maksimal). Energiya issiqlikka aylanadi." : kind === "L" ? `G‘altakda tok kuchlanishdan <b>T/4 orqada</b> qoladi. Induktiv qarshilik X<sub>L</sub> = ωL = ${r2(XL, 1)} Ω — chastota ortsa ortadi.` : kind === "C" ? `Kondensatorda tok kuchlanishdan <b>T/4 oldinda</b>. Sig‘im qarshiligi X<sub>C</sub> = 1/(ωC) = ${r2(XC, 1)} Ω — chastota ortsa kamayadi (o‘zgarmas tokni o‘tkazmaydi).` : `Om qonuni: I = U/Z, Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²). X<sub>L</sub> = X<sub>C</sub> bo‘lganda — <b>rezonans</b>: ν₀ = 1/(2π√(LC)) = ${r2(1 / (2 * PI * Math.sqrt(L * C * 1e-6)), 1)} Gs, tok maksimal.`}</div>
        <div class="muted">Ko‘k — kuchlanish, sariq — tok. Quvvat koeffitsiyenti cosφ = ${r2(Math.cos(phi), 2)}: u 1 ga yaqin bo‘lsa, energiya foydali sarflanadi. Uydagi tarmoq: U = 220 V (ta’sir etuvchi), ν = 50 Gs.</div>`;
    }
    function render() {
      controls.innerHTML = "";
      if (!p.kind) controls.append(buttons(["Aktiv R", "G‘altak L", "Kondensator C", "R-L-C ketma-ket"], (i) => { kind = ["R", "L", "C", "RLC"][i]; render(); }, ["R", "L", "C", "RLC"].indexOf(kind)));
      controls.append(slider({ label: "Chastota ν", min: 10, max: 200, step: 5, value: f, fmt: (v) => v + " Gs", onInput: (v) => { f = v; draw(); } }));
      if (kind === "R" || kind === "RLC") controls.append(slider({ label: "R", min: 5, max: 100, step: 5, value: R, fmt: (v) => v + " Ω", onInput: (v) => { R = v; draw(); } }));
      if (kind === "L" || kind === "RLC") controls.append(slider({ label: "L", min: 0.05, max: 1, step: 0.05, value: L, fmt: (v) => num(v) + " Gn", onInput: (v) => { L = v; draw(); } }));
      if (kind === "C" || kind === "RLC") controls.append(slider({ label: "C", min: 5, max: 200, step: 5, value: C, fmt: (v) => v + " mkF", onInput: (v) => { C = v; draw(); } }));
      draw();
    }
    render();
  };

  // ===================================================================
  // ASTRONOMIYA
  // ===================================================================
  // 8. Osmon sferasi: kenglik, olam qutbi balandligi, yulduzlarning sutkalik harakati, kulminatsiya
  W.skySphere = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌌 Osmon sferasi: kenglikni tanlang — yulduzlar qanday aylanadi?");
    let lat = 38.3, dec = 20, speed = 1;
    const stars = Array.from({ length: 70 }, () => ({ d: Math.asin(Math.random() * 2 - 1) * 180 / PI, ra: Math.random() * 360, m: Math.random() }));
    const toXY = (d, ha) => { // ufq koordinatalari: balandlik h, azimut A → ekran
      const D = d * PI / 180, H = ha * PI / 180, F = lat * PI / 180;
      const sinh = Math.sin(F) * Math.sin(D) + Math.cos(F) * Math.cos(D) * Math.cos(H), hh = Math.asin(sinh);
      const A = Math.atan2(-Math.cos(D) * Math.sin(H), Math.sin(D) * Math.cos(F) - Math.cos(D) * Math.cos(H) * Math.sin(F));
      return { h: hh, A };
    };
    animCanvas(stage, 340, 240, (c, dt, t) => {
      c.clearRect(0, 0, 340, 240); const cx = 170, cy = 150, R = 130, rot = t * 20 * speed;
      c.fillStyle = "#0b1229"; c.fillRect(0, 0, 340, 150); c.fillStyle = "#14532d"; c.fillRect(0, 150, 340, 90);
      const proj = (o) => { const X = cx + R * Math.cos(o.h) * Math.sin(o.A), Y = cy - R * Math.sin(o.h) * 0.9; return [X, Y]; };
      for (const st of stars) { const o = toXY(st.d, st.ra + rot); if (o.h < 0) continue; if (Math.cos(o.A) < 0) continue; const [X, Y] = proj(o); c.fillStyle = `rgba(255,255,255,${0.4 + st.m * 0.6})`; c.beginPath(); c.arc(X, Y, 0.8 + st.m * 1.6, 0, 7); c.fill(); }
      // tanlangan yulduz yo'li
      c.strokeStyle = "rgba(253,224,71,.6)"; c.lineWidth = 1.5; c.beginPath(); let first = true; for (let ha = -180; ha <= 180; ha += 3) { const o = toXY(dec, ha); if (o.h < 0 || Math.cos(o.A) < 0) { first = true; continue; } const [X, Y] = proj(o); first ? c.moveTo(X, Y) : c.lineTo(X, Y); first = false; } c.stroke();
      const os = toXY(dec, (rot % 360) - 180); if (os.h >= 0 && Math.cos(os.A) >= 0) { const [X, Y] = proj(os); c.fillStyle = "#fde047"; c.beginPath(); c.arc(X, Y, 5, 0, 7); c.fill(); }
      const pole = proj({ h: lat * PI / 180, A: 0 }); c.fillStyle = "#38bdf8"; c.beginPath(); c.arc(pole[0], pole[1], 5, 0, 7); c.fill(); label(c, pole[0], pole[1] - 12, "Qutb yulduzi", "#38bdf8", "rgba(0,0,0,.4)", 10);
      label(c, 170, 166, "N (shimol) ufqi", "#86efac", "rgba(0,0,0,.4)", 10);
    });
    function info() { const hU = 90 - lat + dec, hL = -90 + lat + dec; out.innerHTML = `<div class="big-num">Olam qutbining balandligi h<sub>P</sub> = φ = ${num(lat)}°</div><div>Shimolga qarab turibmiz. Yulduzlar olam qutbi atrofida aylanadi (Yer o‘z o‘qi atrofida aylanishining aksi). Sariq yulduz (δ = ${dec}°): yuqori kulminatsiya h = 90° − φ + δ = <b>${r2(hU, 1)}°</b>, quyi kulminatsiya h = δ − (90° − φ) = <b>${r2(hL, 1)}°</b> ${hL > 0 ? "→ <b>botmaydigan</b> yulduz" : hU < 0 ? "→ <b>chiqmaydigan</b> yulduz" : "→ chiqadi va botadi"}.</div><div class="muted">Oltinsoy kengligi ≈ 38°. Qutbda (φ = 90°) yulduzlar ufqqa parallel aylanadi, ekvatorda (φ = 0°) — tik chiqib, tik botadi.</div>`; }
    controls.append(slider({ label: "Geografik kenglik φ", min: 0, max: 90, step: 0.5, value: lat, fmt: (v) => num(v) + "°", onInput: (v) => { lat = v; info(); } }), slider({ label: "Yulduz og‘ishi δ", min: -60, max: 89, value: dec, fmt: (v) => v + "°", onInput: (v) => { dec = v; info(); } }), slider({ label: "Tezlik", min: 0.2, max: 4, step: 0.2, value: speed, fmt: (v) => num(v) + "×", onInput: (v) => (speed = v) }));
    info();
  };

  // 9. Oy fazalari va tutilishlar
  W.moon = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌙 Oy fazalari — kunni tanlang");
    let day = 7;
    const NAMES = [[0, "🌑 Yangi oy"], [3.7, "🌒 O‘sayotgan hilol"], [7.4, "🌓 Birinchi chorak"], [11, "🌔 O‘sayotgan Oy"], [14.8, "🌕 To‘lin oy"], [18.5, "🌖 Kamayayotgan Oy"], [22.1, "🌗 Oxirgi chorak"], [25.8, "🌘 Kamayayotgan hilol"]];
    function draw() {
      const a = (day / 29.53) * 2 * PI, g = svg(340, 200, "fz-svg"), ex = 100, ey = 100, mx = ex + 70 * Math.cos(a + PI), my = ey - 70 * Math.sin(a + PI);
      s("line", { x1: 0, y1: 100, x2: 20, y2: 100, stroke: "#fde047", "stroke-width": 3 }, g); s("text", { x: 4, y: 90, "font-size": 10, fill: "#fde047", text: "☀ Quyosh nurlari →" }, g);
      s("circle", { cx: ex, cy: ey, r: 70, fill: "none", stroke: "currentColor", "stroke-opacity": 0.3, "stroke-dasharray": "3 4" }, g);
      s("circle", { cx: ex, cy: ey, r: 16, fill: "#3b82f6" }, g); s("path", { d: `M${ex} ${ey - 16} A16 16 0 0 1 ${ex} ${ey + 16} Z`, fill: "#0b1229", opacity: 0.6, transform: `rotate(180 ${ex} ${ey})` }, g);
      s("circle", { cx: mx, cy: my, r: 9, fill: "#e5e7eb" }, g); s("path", { d: `M${mx} ${my - 9} A9 9 0 0 1 ${mx} ${my + 9} Z`, fill: "#111827", transform: `rotate(180 ${mx} ${my})` }, g);
      // Yerdan ko'rinishi
      const k = Math.cos(a), cxm = 270, R = 50, ill = (1 - k) / 2, wax = Math.sin(a) >= 0;
      s("circle", { cx: cxm, cy: 100, r: R, fill: "#111827", stroke: "rgba(255,255,255,.2)" }, g);
      const tx = R * Math.abs(1 - 2 * ill), sweep = ill > 0.5 ? 1 : 0;
      const dPath = wax ? `M${cxm} ${100 - R} A${R} ${R} 0 0 1 ${cxm} ${100 + R} A${tx} ${R} 0 0 ${sweep} ${cxm} ${100 - R}` : `M${cxm} ${100 - R} A${R} ${R} 0 0 0 ${cxm} ${100 + R} A${tx} ${R} 0 0 ${1 - sweep} ${cxm} ${100 - R}`;
      s("path", { d: dPath, fill: "#f1f5f9" }, g); s("text", { x: cxm, y: 175, "text-anchor": "middle", "font-size": 11, fill: "currentColor", text: "Yerdan ko‘rinishi" }, g);
      stage.innerHTML = ""; stage.append(g);
      const nm = NAMES.reduce((a_, b) => (Math.abs(b[0] - day) < Math.abs(a_[0] - day) ? b : a_))[1];
      out.innerHTML = `<div class="big-num">${nm} · ${num(day)}-kun · yoritilgan qism ${Math.round(ill * 100)}%</div><div>Oy o‘zi nur sochmaydi — Quyosh nurini qaytaradi. Biz Oyning yoritilgan yarmining turli qismini ko‘ramiz. <b>Sinodik oy</b> (fazalar davri) = 29,5 sutka, <b>siderik</b> (yulduzlarga nisbatan) = 27,3 sutka.</div><div class="muted">${day < 1 || day > 28.5 ? "Yangi oyda Oy Quyosh va Yer orasida — agar bir chiziqda bo‘lsa, <b>Quyosh tutilishi</b> bo‘ladi." : Math.abs(day - 14.8) < 1 ? "To‘lin oyda Yer o‘rtada — agar bir chiziqda bo‘lsa, <b>Oy tutilishi</b> bo‘ladi (Oy Yer soyasiga kiradi)." : "Hijriy kalendar Oy oylariga asoslangan: 12 oy ≈ 354 kun, shuning uchun Ramazon har yili ~11 kun oldinga suriladi."}</div>`;
    }
    controls.append(slider({ label: "Oy kuni", min: 0, max: 29.5, step: 0.5, value: day, fmt: (v) => num(v), onInput: (v) => { day = v; draw(); } }));
    draw();
  };

  // 10. Quyosh sistemasi
  const PLAN = [["Merkuriy", 0.39, 0.24, "#a8a29e", 4], ["Venera", 0.72, 0.62, "#fcd34d", 6], ["Yer", 1, 1, "#3b82f6", 6], ["Mars", 1.52, 1.88, "#ef4444", 5], ["Yupiter", 5.2, 11.86, "#f59e0b", 11], ["Saturn", 9.54, 29.46, "#fde68a", 10], ["Uran", 19.2, 84, "#67e8f9", 8], ["Neptun", 30.06, 164.8, "#6366f1", 8]];
  W.solarSystem = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🪐 Quyosh sistemasi — sayyoralar real davrlarida aylanadi");
    let speed = 1, sel = 2;
    const cv = animCanvas(stage, 340, 340, (c, dt, t) => {
      c.clearRect(0, 0, 340, 340); const cx = 170, cy = 170, yrs = t * speed * 0.5;
      const R = (a) => 18 + Math.log(1 + a * 3) / Math.log(91) * 148;
      c.fillStyle = "#fde047"; c.beginPath(); c.arc(cx, cy, 10, 0, 7); c.fill();
      PLAN.forEach(([n, a, T, col, rr], i) => { c.strokeStyle = i === sel ? "rgba(253,224,71,.6)" : "rgba(255,255,255,.12)"; c.beginPath(); c.arc(cx, cy, R(a), 0, 7); c.stroke(); const ang = (yrs / T) * 2 * PI; c.fillStyle = col; c.beginPath(); c.arc(cx + R(a) * Math.cos(ang), cy - R(a) * Math.sin(ang), rr / 2 + 2, 0, 7); c.fill(); if (i === sel) label(c, cx + R(a) * Math.cos(ang), cy - R(a) * Math.sin(ang) - 12, n, "#fde047"); });
      label(c, 170, 334, `${r2(yrs, 2)} yil o‘tdi`, "#cbd5e1", "rgba(0,0,0,.4)", 11);
    });
    void cv;
    function info() { const [n, a, T] = PLAN[sel]; out.innerHTML = `<div class="big-num">${n}: a = ${num(a)} a.b. · T = ${num(T)} yil</div><div>Kepler III qonuni: T² = a³ → ${num(T)}² ≈ ${r2(T * T, 2)}, ${num(a)}³ ≈ ${r2(a ** 3, 2)} ✅. 1 astronomik birlik (a.b.) = Yer–Quyosh masofasi ≈ 150 mln km.</div><div class="muted">Masofalar logarifmik shkalada (aks holda ichki sayyoralar ko‘rinmaydi). Ichki sayyoralar (Merkuriy, Venera) Quyoshdan uzoqlashmaydi — ular faqat ertalab yoki kechqurun ko‘rinadi; tashqi sayyoralar qarama-qarshi turishda (oppozitsiya) eng yaxshi ko‘rinadi.</div>`; }
    controls.append(buttons(PLAN.map((x) => x[0]), (i) => { sel = i; info(); }, 2), slider({ label: "Vaqt tezligi", min: 0.2, max: 10, step: 0.2, value: speed, fmt: (v) => num(v) + "×", onInput: (v) => (speed = v) }));
    info();
  };

  // 11. Kepler qonunlari: ellips, teng yuzalar
  W.kepler = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📐 Kepler qonunlari: ellips va teng yuzalar");
    let e = 0.6; const wedges = [];
    animCanvas(stage, 340, 240, (c, dt, t) => {
      const a = 130, b = a * Math.sqrt(1 - e * e), cf = a * e, cx = 170, cy = 120, Tp = 8;
      const M = ((t % Tp) / Tp) * 2 * PI; let E = M; for (let k = 0; k < 8; k++) E = M + e * Math.sin(E);
      const x = cx + a * Math.cos(E), y = cy - b * Math.sin(E), fx = cx + cf;
      c.clearRect(0, 0, 340, 240); c.strokeStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(cx, cy, a, b, 0, 0, 7); c.stroke();
      const slot = Math.floor(((t % Tp) / Tp) * 12); if (!wedges[slot] || wedges[slot].t < t - Tp * 0.9) wedges[slot] = { t, pts: [] }; wedges[slot].pts.push([x, y]);
      wedges.forEach((w, i) => { if (!w || i % 3) return; c.fillStyle = "rgba(253,224,71,.25)"; c.beginPath(); c.moveTo(fx, cy); w.pts.forEach(([X, Y]) => c.lineTo(X, Y)); c.closePath(); c.fill(); });
      c.fillStyle = "#fde047"; c.beginPath(); c.arc(fx, cy, 9, 0, 7); c.fill(); c.fillStyle = "#3b82f6"; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill();
      c.strokeStyle = "rgba(59,130,246,.6)"; c.beginPath(); c.moveTo(fx, cy); c.lineTo(x, y); c.stroke();
      label(c, fx, cy + 22, "Quyosh (fokus)", "#fde047", "rgba(0,0,0,.4)", 10);
    });
    out.innerHTML = `<div><b>I qonun:</b> sayyoralar ellips bo‘ylab harakatlanadi, Quyosh — fokuslardan birida.</div><div><b>II qonun:</b> sayyora radius-vektori teng vaqtlarda teng yuzalar chizadi (sariq bo‘laklar) — Quyoshga yaqinda (perigeliy) tezroq, uzoqda (afeliy) sekinroq harakatlanadi.</div><div><b>III qonun:</b> T₁²/T₂² = a₁³/a₂³. Nyutonning aniqlashtirilgan ko‘rinishi: T² = 4π²a³/(G(M + m)) — undan osmon jismlarining <b>massasi</b> hisoblanadi.</div><div class="muted">Kosmik tezliklar: v₁ = √(GM/R) ≈ 7,9 km/s, v₂ = √2·v₁ ≈ 11,2 km/s, v₃ ≈ 16,7 km/s (Quyosh sistemasidan chiqish).</div>`;
    controls.append(slider({ label: "Ekssentrisitet e", min: 0, max: 0.85, step: 0.05, value: e, fmt: (v) => num(v), onInput: (v) => { e = v; wedges.length = 0; } }));
  };

  // 12. Parallaks: masofani aniqlash
  W.parallax = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📏 Parallaks: burchak orqali masofani topamiz");
    let kind = p.kind || "hor", pi = 8.8;
    function draw() {
      const g = svg(340, 180, "fz-svg"), ang = Math.max(0.03, pi / (kind === "hor" ? 60 : 1) / 30);
      s("circle", { cx: 40, cy: 90, r: kind === "hor" ? 26 : 8, fill: "#3b82f6" }, g); if (kind !== "hor") s("circle", { cx: 40, cy: 90, r: 60, fill: "none", stroke: "currentColor", "stroke-opacity": 0.3 }, g);
      const D = 300, bx = kind === "hor" ? 26 : 60;
      s("line", { x1: 40, y1: 90 - bx, x2: D, y2: 90, stroke: "#fde047" }, g); s("line", { x1: 40, y1: 90, x2: D, y2: 90, stroke: "#fde047", "stroke-dasharray": "4 4" }, g); s("line", { x1: 40, y1: 90 - bx, x2: 40, y2: 90, stroke: "#f472b6", "stroke-width": 2 }, g);
      s("circle", { cx: D, cy: 90, r: 7, fill: kind === "hor" ? "#e5e7eb" : "#fde047" }, g); s("text", { x: D - 30, y: 80, "font-size": 12, fill: "#fde047", text: "p" }, g);
      s("text", { x: 50, y: 70, "font-size": 11, fill: "#f472b6", text: kind === "hor" ? "R⊕" : "1 a.b." }, g);
      stage.innerHTML = ""; stage.append(g); void ang;
      if (kind === "hor") { const Dk = 6371 / Math.sin((pi / 3600) * (PI / 180)); out.innerHTML = `<div class="big-num">D = R⊕ / sin p = 6371 km / sin ${num(pi)}″ = ${r2(Dk / 1e6, 2)} mln km</div><div>Gorizontal parallaks — Yer radiusi jismdan ko‘rinadigan burchak. Quyosh uchun p ≈ 8,8″ → ~150 mln km; Oy uchun p ≈ 57′ = 3420″ → ~384 ming km.</div>`; }
      else { const pc = 1 / pi; out.innerHTML = `<div class="big-num">D = 1/p = 1/${num(pi)}″ = ${r2(pc, 3)} pk = ${r2(pc * 3.26, 2)} yorug‘lik yili</div><div>Yillik parallaks — Yer orbitasi radiusi (1 a.b.) yulduzdan ko‘rinadigan burchak. Eng yaqin yulduz Proksima Sentavrda p = 0,77″ → 1,3 pk.</div><div class="muted">1 pk (parsek) = 206 265 a.b. ≈ 3,26 yorug‘lik yili ≈ 3,1·10¹³ km.</div>`; }
    }
    function render() {
      controls.innerHTML = "";
      if (!p.kind) controls.append(buttons(["Sutkalik (gorizontal) parallaks", "Yillik parallaks (yulduzlar)"], (i) => { kind = ["hor", "ann"][i]; pi = kind === "hor" ? 8.8 : 0.77; render(); }, kind === "hor" ? 0 : 1));
      controls.append(kind === "hor" ? slider({ label: "Parallaks p", min: 1, max: 3500, step: 0.1, value: pi, fmt: (v) => num(v) + "″", onInput: (v) => { pi = v; draw(); } }) : slider({ label: "Parallaks p", min: 0.01, max: 1, step: 0.01, value: pi, fmt: (v) => num(v) + "″", onInput: (v) => { pi = v; draw(); } }));
      draw();
    }
    render();
  };

  // 13. Nurlanish qonunlari: absolyut qora jism, Vin va Stefan–Bolsman
  W.blackbody = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌈 Yulduz harorati va rangi: nurlanish qonunlari");
    let T = 5800;
    const col = (T_) => { const t = T_ / 100; let r, g_, b; if (t <= 66) { r = 255; g_ = 99.47 * Math.log(t) - 161.1; b = t <= 19 ? 0 : 138.5 * Math.log(t - 10) - 305; } else { r = 329.7 * Math.pow(t - 60, -0.1332); g_ = 288.1 * Math.pow(t - 60, -0.0755); b = 255; } const cl = (v) => Math.max(0, Math.min(255, Math.round(v))); return `rgb(${cl(r)},${cl(g_)},${cl(b)})`; };
    function draw() {
      const B = (lam, T_) => { const l = lam * 1e-9; return 1 / (l ** 5 * (Math.exp(1.4388e-2 / (l * T_)) - 1)); };
      const mx = B(2.898e6 / T, T);
      const G = plot(100, 2500, 0, 1.15, 340, 170, ["λ, nm", "intensivlik"]);
      const vis = s("defs", {}, G.g); vis.innerHTML = `<linearGradient id="fzSp" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset=".25" stop-color="#2563eb"/><stop offset=".45" stop-color="#16a34a"/><stop offset=".6" stop-color="#facc15"/><stop offset=".8" stop-color="#f97316"/><stop offset="1" stop-color="#dc2626"/></linearGradient>`;
      s("rect", { x: G.X(380), y: G.Y(1.15), width: G.X(750) - G.X(380), height: G.Y(0) - G.Y(1.15), fill: "url(#fzSp)", opacity: 0.25 }, G.g);
      G.curve((l) => B(l, T) / mx, "#fff", 2.5); const lm = 2.898e6 / T; G.dot(lm, 1); G.text(lm, 1.08, "λmax", "#fde047", "middle");
      stage.innerHTML = `<div class="fz-star" style="background:radial-gradient(circle at 40% 35%, #fff, ${col(T)} 45%, transparent 72%)"></div>`; stage.append(G.g);
      out.innerHTML = `<div class="big-num">λ<sub>max</sub> = b/T = 2,898·10⁻³ / ${T} = ${Math.round(lm)} nm · L ~ T⁴</div><div>Vin qonuni: jism qancha issiq bo‘lsa, nurlanish maksimumi shuncha qisqa to‘lqinlarga (ko‘kka) suriladi. ${T < 4000 ? "Qizil yulduz (Betelgeuze, ~3500 K)." : T < 6500 ? "Sariq yulduz — Quyosh (~5800 K)." : T < 10000 ? "Oq yulduz (Sirius, ~9900 K)." : "Ko‘k-oq qaynoq yulduz (Rigel, ~12 000 K)."}</div><div class="muted">Stefan–Bolsman: 1 m² sirt nurlanish quvvati E = σT⁴ — harorat 2 marta ortsa, 16 marta ko‘p nur sochadi. Spektrdagi qora chiziqlar yulduzning kimyoviy tarkibini ko‘rsatadi (spektral analiz).</div>`;
    }
    controls.append(slider({ label: "Yulduz sirti harorati T", min: 2500, max: 25000, step: 100, value: T, fmt: (v) => v + " K", onInput: (v) => { T = v; draw(); } }));
    draw();
  };

  // 14. Teleskop: diametr → yorug'lik yig'ish va ajrata olish
  W.telescope = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔭 Teleskop: obyektiv diametri nimani hal qiladi?");
    let D = 100, F = 1000, f = 10;
    function draw() {
      const g = svg(340, 120, "fz-svg"), w = 30 + D / 10;
      s("rect", { x: 40, y: 60 - w / 2, width: 230, height: w, rx: 6, fill: "#475569" }, g); s("ellipse", { cx: 40, cy: 60, rx: 6, ry: w / 2, fill: "#93c5fd" }, g); s("rect", { x: 270, y: 52, width: 30, height: 16, fill: "#64748b" }, g);
      for (let i = -2; i <= 2; i++) s("line", { x1: 0, y1: 60 + i * w / 5, x2: 40, y2: 60 + i * w / 5, stroke: "#fde047", opacity: 0.6 }, g);
      stage.innerHTML = ""; stage.append(g);
      const gain = (D / 6) ** 2, res = (1.22 * 550e-9) / (D / 1000) * 206265, mag = F / f;
      out.innerHTML = `<div class="big-num">Yorug‘lik yig‘ish: (D/d<sub>ko‘z</sub>)² = (${D}/6)² ≈ ${Math.round(gain)} marta · ajrata olish θ ≈ ${r2(res, 2)}″ · kattalashtirish Γ = F/f = ${Math.round(mag)}×</div><div>Diametr qancha katta bo‘lsa — xira jismlar ko‘rinadi va mayda detallar ajraladi. Kattalashtirish esa okulyar bilan o‘zgaradi, lekin cheksiz oshirib bo‘lmaydi.</div><div class="muted">Linzali — refraktor, ko‘zguli — reflektor. Radioteleskoplar radioto‘lqinlarni ushlaydi (tumanlik, pulsarlar). Ulug‘bek rasadxonasining (1420-yillar) “bosh asbobi” — radiusi ~40 m bo‘lgan ulkan meridian sekstant (Faxriy sekstanti): u bilan yil uzunligi 365 kun 6 soat 10 daqiqa deb deyarli aniq o‘lchangan.</div>`;
    }
    controls.append(slider({ label: "Obyektiv diametri D", min: 30, max: 400, step: 10, value: D, fmt: (v) => v + " mm", onInput: (v) => { D = v; draw(); } }), slider({ label: "Obyektiv fokusi F", min: 400, max: 2000, step: 100, value: F, fmt: (v) => v + " mm", onInput: (v) => { F = v; draw(); } }), slider({ label: "Okulyar fokusi f", min: 4, max: 40, value: f, fmt: (v) => v + " mm", onInput: (v) => { f = v; draw(); } }));
    draw();
  };

  // 15. Quyosh tuzilishi
  const SUN = [["Yadro", "~15 mln K. Termoyadro reaksiyasi: 4 ta vodorod yadrosi geliyga aylanadi, massa farqi energiyaga (E = mc²). Har soniyada ~4 mln tonna massa nurga aylanadi.", 0.25, "#fff7ed"], ["Nurlanish zonasi", "Energiya fotonlar orqali juda sekin — yuz minglab yillar davomida tashqariga chiqadi.", 0.7, "#fdba74"], ["Konvektiv zona", "Qaynayotgan suvdek issiq plazma ko‘tariladi, sovugani tushadi — granulyatsiya hosil bo‘ladi.", 1, "#fb923c"], ["Fotosfera", "Ko‘rinadigan “sirt”, ~5800 K. Unda Quyosh dog‘lari — kuchli magnit maydonli, ~4000 K li sovuqroq (shuning uchun qora ko‘rinadi) joylar.", 1.03, "#f59e0b"], ["Xromosfera", "Qalinligi ~2000 km, pushti rangli qatlam — faqat to‘liq tutilishda ko‘rinadi. Protuberanetslar shu yerdan ko‘tariladi.", 1.08, "#f472b6"], ["Toj (korona)", "Juda siyrak, lekin 1–2 mln K issiq qatlam. Undan Quyosh shamoli oqib chiqadi — Yerda qutb yog‘dulari va magnit bo‘ronlarini keltirib chiqaradi.", 1.4, "#e0e7ff"]];
  W.sunLayers = (root, p) => {
    const { stage, out } = frame(root, p.title || "☀️ Quyosh tuzilishi — qatlamni bosing");
    const g = svg(340, 240, "fz-svg");
    [...SUN].reverse().forEach(([n, d, r, c]) => { const el = s("circle", { cx: 120, cy: 120, r: r * 80, fill: c, opacity: n === "Toj (korona)" ? 0.25 : n === "Xromosfera" ? 0.6 : 1, style: "cursor:pointer" }, g); el.onclick = () => (out.innerHTML = `<b>${n}</b> — ${d}`); });
    [[100, 100], [140, 115], [118, 140]].forEach(([x, y]) => s("circle", { cx: x + 30, cy: y - 10, r: 4, fill: "#78350f", style: "pointer-events:none" }, g));
    SUN.forEach(([n], i) => { const t = s("text", { x: 240, y: 40 + i * 32, "font-size": 12, "font-weight": 700, fill: "currentColor", text: "• " + n, style: "cursor:pointer" }, g); t.onclick = () => (out.innerHTML = `<b>${n}</b> — ${SUN[i][1]}`); });
    stage.append(g);
    out.innerHTML = "Quyosh — bizga eng yaqin yulduz: radiusi Yerdan 109 marta, massasi 333 000 marta katta. Qatlamni bosing. Quyosh faolligi ~11 yillik sikl bilan o‘zgaradi (dog‘lar soni) va Yerdagi radioaloqa, sun’iy yo‘ldoshlar, hatto odamlar salomatligiga ta’sir qiladi.";
  };
})();
