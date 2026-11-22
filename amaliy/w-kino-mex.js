/* Kinoviy mexanika tajribalari (KINO dvigatelida): mayatnik, qiya tekislik, erkin tushish,
   aylana harakat (ipni kesish), lift, richag, orbita, kuchlarni qo'shish.
   Eski versiyalar (w-fizika2.js, w-geometry.js) shu fayl orqali almashtiriladi. */
(() => {
  "use strict";
  const { h, slider, buttons, button, W } = window.AK;
  const K = window.KINO;
  if (!K) return;
  const { C, r } = K;
  const PI = Math.PI, G0 = 9.81;
  const PLAN = [["🌍 Yer", 9.81], ["🌙 Oy", 1.62], ["🔴 Mars", 3.71], ["🪐 Yupiter", 24.8]];
  const chk = (label, on, cb) => h("label", { class: "kb-check" }, h("input", { type: "checkbox", checked: on, onchange: (e) => cb(e.target.checked) }), " " + label);
  const push = (arr, p, max = 1500) => { arr.push(p); if (arr.length > max) arr.shift(); };

  // ===================================================================
  // 1. MAYATNIK (matematik / prujinali) — tortib qo'yib yuboring
  // ===================================================================
  W.pendulum = (root, p) => {
    const S = K.scene(root, { title: p.title || "🕰 Mayatnik: sharchani tortib qo‘yib yuboring — davrni o‘lchang", aspect: 0.6, aspectMobile: 0.95,
      tip: "👆 Sharchani sichqoncha/barmoq bilan chetga torting va qo‘ying", slow: false });
    const x = S.x;
    const st = { kind: p.kind || "math", L: 1, g: 9.81, m: 0.5, k: 20, damp: 0, th: 0.35, om: 0, y: 0.25, v: 0, hold: false,
      tr: [], ghost: [], cross: [], E0: 0, Tm: 0, n: 0, lastS: 0 };
    const Tf = () => (st.kind === "math" ? 2 * PI * Math.sqrt(st.L / st.g) : 2 * PI * Math.sqrt(st.m / st.k));
    const E = () => {
      if (st.kind === "math") { const Ep = st.m * st.g * st.L * (1 - Math.cos(st.th)), Ek = 0.5 * st.m * (st.L * st.om) ** 2; return [Ek, Ep]; }
      return [0.5 * st.m * st.v * st.v, 0.5 * st.k * st.y * st.y];
    };
    const restart = () => { st.om = 0; st.v = 0; st.tr = []; st.cross = []; st.Tm = 0; st.n = 0; S.t = 0; const [a, b] = E(); st.E0 = a + b; info(); };
    const geo = () => {
      if (st.kind === "math") { const sc = ((S.W < 560 ? S.H * 0.7 : S.H) - 70) / Math.max(1.1, st.L), ox = S.W < 560 ? S.W * 0.5 : S.W * 0.3, oy = 34;
        return { sc, ox, oy, bx: ox + st.L * sc * Math.sin(st.th), by: oy + st.L * sc * Math.cos(st.th) }; }
      const sc = S.H * (S.W < 560 ? 0.4 : 0.55), ox = S.W < 560 ? S.W * 0.5 : S.W * 0.3, oy = 30, ye = oy + S.H * (S.W < 560 ? 0.3 : 0.42);
      return { sc, ox, oy, ye, bx: ox, by: ye + st.y * sc };
    };
    S.step = (dt) => {
      if (st.hold) return;
      const s0 = st.kind === "math" ? st.th : st.y;
      if (st.kind === "math") { st.om += (-(st.g / st.L) * Math.sin(st.th) - st.damp * st.om) * dt; st.th += st.om * dt; }
      else { st.v += (-(st.k / st.m) * st.y - st.damp * st.v) * dt; st.y += st.v * dt; }
      const s1 = st.kind === "math" ? st.th : st.y;
      if (s0 < 0 && s1 >= 0) { st.cross.push(S.t); if (st.cross.length > 1) { st.n = st.cross.length - 1; st.Tm = (st.cross[st.cross.length - 1] - st.cross[0]) / st.n; } }
      if (S.frame !== st.lastS) { st.lastS = S.frame; push(st.tr, [S.t, s1 * (st.kind === "math" ? 180 / PI : 100)], 900); }
    };
    S.draw = () => {
      S.bg(); const g = geo();
      // ship
      S.hatch(g.ox - 60, g.oy, g.ox + 60, g.oy, { up: true });
      // stroboskop izlari
      if (S.frame % 6 === 0 && !st.hold) { st.ghost.push([g.bx, g.by]); if (st.ghost.length > 9) st.ghost.shift(); }
      st.ghost.forEach(([gx, gy], i) => { x.globalAlpha = 0.06 + i * 0.03; x.fillStyle = "#c2410c"; x.beginPath(); x.arc(gx, gy, 12, 0, 7); x.fill(); });
      x.globalAlpha = 1;
      const [Ek, Ep] = E();
      if (st.kind === "math") {
        // vertikal va burchak
        x.setLineDash([4, 5]); x.strokeStyle = "rgba(87,83,78,.5)"; x.lineWidth = 1; x.beginPath(); x.moveTo(g.ox, g.oy); x.lineTo(g.ox, g.oy + st.L * g.sc + 18); x.stroke(); x.setLineDash([]);
        x.strokeStyle = "#a16207"; x.lineWidth = 1.5; x.beginPath(); x.arc(g.ox, g.oy, 42, PI / 2, PI / 2 - st.th, st.th > 0); x.stroke();
        S.text(`θ = ${Math.round((st.th * 180) / PI)}°`, g.ox + (st.th > 0 ? 34 : -34), g.oy + 62, { size: 12, c: "#92400e", halo: true });
        // ip (metr belgilari bilan)
        x.strokeStyle = C.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(g.ox, g.oy); x.lineTo(g.bx, g.by); x.stroke();
        for (let mm = 0.5; mm < st.L - 0.05; mm += 0.5) { const qx = g.ox + mm * g.sc * Math.sin(st.th), qy = g.oy + mm * g.sc * Math.cos(st.th); x.fillStyle = C.sub; x.beginPath(); x.arc(qx, qy, 1.8, 0, 7); x.fill(); }
        x.fillStyle = C.ink; x.beginPath(); x.arc(g.ox, g.oy, 3.5, 0, 7); x.fill();
        S.ball(g.bx, g.by, 12);
        // vektorlar
        const kN = 46 / (st.m * st.g), T = st.m * st.g * Math.cos(st.th) + st.m * st.L * st.om * st.om, v = st.L * st.om;
        S.arrow(g.bx, g.by + 12, g.bx, g.by + 12 + st.m * st.g * kN, C.g, "mg");
        S.arrow(g.bx, g.by, g.bx - Math.sin(st.th) * T * kN, g.by - Math.cos(st.th) * T * kN, C.t, "T");
        if (Math.abs(v) > 0.05) S.arrow(g.bx, g.by, g.bx + Math.cos(st.th) * v * 26, g.by - Math.sin(st.th) * v * 26, C.v, "v");
        S.hud(`v = ${r(Math.abs(v), 2)} m/s`, `T = ${r(T, 2)} N — ip taranglik kuchi`);
      } else {
        x.strokeStyle = "rgba(87,83,78,.5)"; x.setLineDash([4, 5]); x.lineWidth = 1; x.beginPath(); x.moveTo(g.ox - 50, g.ye); x.lineTo(g.ox + 50, g.ye); x.stroke(); x.setLineDash([]);
        S.text("muvozanat", g.ox + 52, g.ye + 4, { size: 10, align: "left", c: C.sub, bold: false });
        // chizg'ich
        for (let i = -4; i <= 4; i++) { const yy = g.ye + i * 0.1 * g.sc; x.strokeStyle = C.sub; x.lineWidth = 1; x.beginPath(); x.moveTo(g.ox - 70, yy); x.lineTo(g.ox - (i % 2 ? 64 : 60), yy); x.stroke(); if (!(i % 2)) S.text(`${i * 10}`, g.ox - 74, yy + 3, { size: 9, align: "right", c: C.sub, bold: false, italic: false, font: K.SANS }); }
        S.spring(g.ox, g.oy, g.ox, g.by - 16, 14, 10);
        x.fillStyle = "#c2410c"; x.fillRect(g.ox - 18, g.by - 16, 36, 30); x.strokeStyle = C.ink; x.lineWidth = 1; x.strokeRect(g.ox - 18, g.by - 16, 36, 30);
        S.text(`${r(st.m, 1)} kg`, g.ox, g.by + 3, { size: 10, c: "#fff", italic: false, font: K.SANS });
        const kN = 40 / (st.m * G0), Fk = st.k * (st.y + (st.m * G0) / st.k);
        S.arrow(g.ox + 24, g.by, g.ox + 24, g.by + st.m * G0 * kN, C.g, "mg");
        S.arrow(g.ox - 24, g.by, g.ox - 24, g.by - Fk * kN, C.n, "kΔl");
        if (Math.abs(st.v) > 0.03) S.arrow(g.ox + 46, g.by, g.ox + 46, g.by + st.v * 60, C.v, "v");
        S.hud(`x = ${r(st.y * 100, 1)} sm`, `F = kΔl = ${r(Fk, 1)} N — prujina kuchi`);
      }
      // grafik va energiya
      const gw = S.W < 560 ? S.W - 24 : Math.min(300, S.W * 0.42), gh = S.W < 560 ? S.H * 0.26 : S.H * 0.38, gx = S.W - gw - 12, gy = S.W < 560 ? S.H - gh - 10 : 52;
      S.graph(gx, gy, gw, gh, [{ d: st.tr, c: "#c2410c", l: st.kind === "math" ? "θ(t), °" : "x(t), sm" }], { win: 8, sym: true });
      if (S.W >= 560) S.bars(gx + 30, gy + gh + 120, 80, [{ v: Ek, c: C.e1, l: "Eₖ" }, { v: Ep, c: C.e2, l: "Eₚ" }, { v: Math.max(0, st.E0 - Ek - Ep), c: C.e3, l: "Q" }], { max: st.E0 || 1, title: "energiya" });
      if (S.W >= 560) { const tx = gx + 150, ty = gy + gh + 40;
        S.text(`T (o‘lchangan) = ${st.Tm ? r(st.Tm, 3) + " s" : "…"}`, tx, ty, { size: 13, align: "left" });
        S.text(`T (formula) = ${r(Tf(), 3)} s`, tx, ty + 20, { size: 13, align: "left", c: C.sub });
        S.text(`tebranishlar: ${st.n}`, tx, ty + 40, { size: 12, align: "left", c: C.sub, bold: false }); }
    };
    S.hover = (pt) => { const g = geo(); return Math.hypot(pt[0] - g.bx, pt[1] - g.by) < 28; };
    S.pointer((pt) => { const g = geo(); if (Math.hypot(pt[0] - g.bx, pt[1] - g.by) > 40) return false; st.hold = true; st.ghost = []; },
      (pt) => { const g = geo(); if (st.kind === "math") st.th = Math.max(-1.4, Math.min(1.4, Math.atan2(pt[0] - g.ox, pt[1] - g.oy))); else st.y = Math.max(-0.4, Math.min(0.4, (pt[1] - g.ye) / g.sc)); restart(); },
      () => { st.hold = false; restart(); });
    function info() {
      const T = Tf();
      const gm = st.kind === "math" && st.Tm ? (4 * PI * PI * st.L) / (st.Tm * st.Tm) : 0;
      S.out.innerHTML = st.kind === "math"
        ? S.f(`T = 2π√(l/g) = 2π√(${r(st.L, 1)}/${r(st.g, 2)}) = <b>${r(T, 3)} s</b>`, "kichik burchaklarda")
          + S.f(`ν = 1/T = ${r(1 / T, 3)} Gs`) + (gm ? S.f(`g = 4π²l/T² = <b>${r(gm, 2)} m/s²</b>`, `o‘lchangan davrdan (${st.n} ta tebranish)`) : "")
          + `<p class="sl-hint">Davr massaga bog‘liq emas — faqat ip uzunligi va g ga. Katta burchakda (60° dan ortiq) o‘lchangan davr formuladan biroz katta chiqadi — tekshirib ko‘ring! Ip taranglik kuchi T eng pastki nuqtada eng katta: T = mg + mv²/l.</p>`
        : S.f(`T = 2π√(m/k) = 2π√(${r(st.m, 1)}/${st.k}) = <b>${r(T, 3)} s</b>`) + S.f(`Statik cho‘zilish: Δl₀ = mg/k = ${r((st.m * G0) / st.k * 100, 1)} sm`)
          + `<p class="sl-hint">Prujina qattiqroq (k katta) — tezroq, yuk og‘irroq — sekinroq tebranadi. Eₖ va Eₚ bir-biriga aylanib turadi; so‘nishda energiya issiqlikka (Q) o‘tadi.</p>`;
    }
    setInterval(() => { if (S.cv.isConnected && st.n && S.visible) info(); }, 1500);
    function render() {
      S.controls.innerHTML = "";
      if (!p.kind) S.controls.append(buttons(["Matematik mayatnik", "Prujinali mayatnik"], (i) => { st.kind = ["math", "spring"][i]; st.ghost = []; render(); restart(); }, st.kind === "math" ? 0 : 1));
      if (st.kind === "math") S.controls.append(slider({ label: "Ip uzunligi l", min: 0.2, max: 2.5, step: 0.1, value: st.L, fmt: (v) => r(v, 1) + " m", onInput: (v) => { st.L = v; st.ghost = []; restart(); } }),
        buttons(PLAN.map((q) => `${q[0]} g=${r(q[1], 2)}`), (i) => { st.g = PLAN[i][1]; restart(); }, PLAN.findIndex((q) => q[1] === st.g)));
      else S.controls.append(slider({ label: "Yuk massasi m", min: 0.1, max: 2, step: 0.1, value: st.m, fmt: (v) => r(v, 1) + " kg", onInput: (v) => { st.m = v; restart(); } }),
        slider({ label: "Bikrlik k", min: 5, max: 100, value: st.k, fmt: (v) => v + " N/m", onInput: (v) => { st.k = v; restart(); } }));
      S.controls.append(h("div", { class: "kn-row" }, chk("So‘nish (havo qarshiligi)", st.damp > 0, (on) => { st.damp = on ? 0.12 : 0; restart(); }),
        button(st.kind === "math" ? "↺ 20° dan qo‘yib yuborish" : "↺ 25 sm dan qo‘yib yuborish", () => { if (st.kind === "math") st.th = 0.35; else st.y = 0.25; st.ghost = []; restart(); }, "ghost")), S.timeCtl({ slow: false }));
    }
    render(); restart();
  };

  // ===================================================================
  // 2. QIYA TEKISLIK — sirpanish yoki tortib chiqarish (FIK)
  // ===================================================================
  W.incline = (root, p) => {
    const S = K.scene(root, { title: p.title || "⛰ Qiya tekislik: brusokni qo‘yib yuboring yoki tortib chiqaring", aspect: 0.58, aspectMobile: 0.9 });
    const x = S.x, LM = 4;
    const st = { a: 30, m: 2, mu: 0.2, mode: 0, s: 0, v: 0, run: false, done: false, stuck: false, tr: [], Q: 0, A: 0, hitT: -1, dust: false };
    const al = () => (st.a * PI) / 180;
    const forces = () => { const a = al(), mg = st.m * G0; return { mg, N: mg * Math.cos(a), Fs: mg * Math.sin(a), Ff: st.mu * mg * Math.cos(a) }; };
    const reset = () => { Object.assign(st, { s: st.mode ? LM : 0, v: 0, run: false, done: false, stuck: false, tr: [], Q: 0, A: 0 }); S.t = 0; S.ts = 1; info(); };
    const geo = () => {
      const a = al(), base = LM * Math.cos(a), hh = LM * Math.sin(a);
      const sc = Math.min((S.W - (S.W < 560 ? 60 : S.W * 0.42)) / (base + 0.8), (S.H - 80) / (hh + 0.6));
      const xR = 20 + (base + 0.6) * sc, yB = S.H - 24, xL = xR - base * sc, yT = yB - hh * sc;
      return { a, sc, xL, yT, xR, yB, base, hh };
    };
    S.step = (dt) => {
      if (!st.run || st.done) return;
      const F = forces();
      if (st.mode === 0) {
        const acc = (F.Fs - F.Ff) / st.m;
        st.v += acc * dt; st.s += st.v * dt; st.Q += F.Ff * st.v * dt;
        const g = geo(); S.ts = LM - st.s < 0.7 ? 0.25 : 1;
        if (st.s >= LM) { st.s = LM; st.done = true; S.ts = 1; const bx = g.xR - 6, by = g.yB; S.burst(bx, by - 4, 26, ["#a8a29e", "#d6d3d1", "#78716c"], { a0: -PI / 2, spread: 2.4, sp: 90 }); S.pop("TAQ!", bx - 10, by - 40); finish(); }
      } else {
        const v = 0.6; st.s -= v * dt; st.A += (F.Fs + F.Ff) * v * dt; st.Q += F.Ff * v * dt; st.v = v;
        if (st.s <= 0) { st.s = 0; st.done = true; S.pop("✓ yuqorida!", geo().xL + 30, geo().yT - 40, { c: "#15803d" }); finish(); }
      }
      if (S.frame % 2 === 0) push(st.tr, [S.t, st.v]);
    };
    S.draw = () => {
      S.bg(); const g = geo(), F = forces();
      // yer
      S.hatch(8, g.yB, S.W - 8, g.yB);
      // qiyalik (yog'och tekstura)
      const gr = x.createLinearGradient(g.xL, g.yT, g.xR, g.yB); gr.addColorStop(0, "#e9c992"); gr.addColorStop(1, "#d6b27a");
      x.fillStyle = gr; x.beginPath(); x.moveTo(g.xL, g.yT); x.lineTo(g.xR, g.yB); x.lineTo(g.xL, g.yB); x.closePath(); x.fill();
      x.strokeStyle = "#a0763b"; x.lineWidth = 1.5; x.stroke();
      for (let i = 1; i < 6; i++) { x.strokeStyle = "rgba(160,118,59,.25)"; x.beginPath(); x.moveTo(g.xL, g.yT + (g.yB - g.yT) * (i / 6)); x.lineTo(g.xL + (g.xR - g.xL) * (1 - i / 6), g.yB); x.stroke(); }
      // metr belgilari
      for (let mm = 1; mm < LM; mm++) { const k = mm / LM, qx = g.xL + (g.xR - g.xL) * k, qy = g.yT + (g.yB - g.yT) * k; x.strokeStyle = "#7c2d12"; x.lineWidth = 1; x.beginPath(); x.moveTo(qx, qy); x.lineTo(qx - 6 * Math.sin(g.a), qy - 6 * Math.cos(g.a)); x.stroke(); }
      // burchak
      x.strokeStyle = "#a16207"; x.lineWidth = 1.5; x.beginPath(); x.arc(g.xR, g.yB, 34, PI, PI + g.a); x.stroke();
      S.text(`α = ${st.a}°`, g.xR - 58, g.yB - 8, { size: 13, c: "#92400e", halo: true });
      S.text(`h = ${r(g.hh, 2)} m`, g.xL - 8, (g.yT + g.yB) / 2, { size: 11, align: "right", c: C.sub, halo: true });
      // blok
      const k = st.s / LM, px = g.xL + (g.xR - g.xL) * k, py = g.yT + (g.yB - g.yT) * k, bw = 0.5 * g.sc, bh = 0.32 * g.sc;
      x.save(); x.translate(px, py); x.rotate(g.a);
      x.fillStyle = "#c2410c"; x.fillRect(-bw / 2, -bh, bw, bh); x.strokeStyle = "#7c2d12"; x.lineWidth = 1.2; x.strokeRect(-bw / 2, -bh, bw, bh);
      x.fillStyle = "rgba(255,255,255,.85)"; x.font = `700 ${Math.max(9, bh * 0.38)}px ${K.SANS}`; x.textAlign = "center"; x.fillText(`${st.m} kg`, 0, -bh * 0.35); x.restore();
      // arqon va lebedka (tortish rejimi)
      const cxb = px + (bh / 2) * Math.sin(g.a), cyb = py - (bh / 2) * Math.cos(g.a);
      if (st.mode === 1) { const ux = -Math.cos(g.a), uy = -Math.sin(g.a), tx = g.xL - 14 * Math.cos(g.a), ty = g.yT - 14 * Math.sin(g.a) - bh / 2;
        x.strokeStyle = "#57534e"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px - (bw / 2) * Math.cos(g.a) + 0 * ux, cyb - (bw / 2) * Math.sin(g.a) + 0 * uy); x.lineTo(tx, ty); x.stroke();
        x.fillStyle = "#475569"; x.beginPath(); x.arc(tx, ty, 9, 0, 7); x.fill(); x.fillStyle = "#e2e8f0"; x.beginPath(); x.arc(tx, ty, 3, 0, 7); x.fill();
        S.text("lebedka", tx, ty - 14, { size: 10, c: C.sub, bold: false }); }
      // kuch vektorlari
      const kN = Math.min(60, g.sc * 0.9) / F.mg;
      S.arrow(cxb, cyb, cxb, cyb + F.mg * kN, C.g, "mg");
      S.arrow(cxb, cyb, cxb - Math.sin(g.a) * F.N * kN, cyb - Math.cos(g.a) * F.N * kN, C.n, "N");
      S.arrow(cxb, cyb, cxb + Math.cos(g.a) * F.Fs * kN, cyb + Math.sin(g.a) * F.Fs * kN, "rgba(220,38,38,.55)", "", { dash: [4, 3], w: 1.5 });
      S.arrow(cxb, cyb, cxb + Math.sin(g.a) * F.N * kN, cyb + Math.cos(g.a) * F.N * kN, "rgba(220,38,38,.55)", "", { dash: [4, 3], w: 1.5 });
      const moving = st.run && !st.done, dir = st.mode === 0 ? -1 : 1, ff = st.mode === 0 && !moving ? Math.min(F.Ff, F.Fs) : F.Ff;
      S.arrow(cxb, cyb, cxb + dir * Math.cos(g.a) * ff * kN, cyb + dir * Math.sin(g.a) * ff * kN, C.f, "F₍ishq₎", { fs: 11 });
      if (st.mode === 1) S.arrow(cxb - Math.cos(g.a) * bw * 0.6, cyb - Math.sin(g.a) * bw * 0.6, cxb - Math.cos(g.a) * (bw * 0.6 + (F.Fs + F.Ff) * kN), cyb - Math.sin(g.a) * (bw * 0.6 + (F.Fs + F.Ff) * kN), C.t, "F");
      // HUD
      if (st.mode === 0) S.hud(`v = ${r(st.v, 2)} m/s`, st.stuck ? "tinch turibdi — ishqalanish ushlab turibdi" : `a = g(sinα − μcosα) = ${r(Math.max(0, (F.Fs - F.Ff) / st.m), 2)} m/s²`);
      else S.hud(`F = ${r(F.Fs + F.Ff, 1)} N`, "dinamometr ko‘rsatkichi (tekis tortish)");
      const gw = S.W < 560 ? S.W * 0.48 : Math.min(260, S.W * 0.36), gh = S.W < 560 ? S.H * 0.25 : S.H * 0.34, gx = S.W - gw - 10;
      S.graph(gx, 50, gw, gh, [{ d: st.tr, c: C.v, l: "v(t), m/s" }], { xmax: Math.max(2, ...st.tr.map((q) => q[0])) });
      if (S.W >= 560) { const E1 = st.mode === 0 ? 0.5 * st.m * st.v * st.v : st.A, Ep = st.m * G0 * (1 - st.s / LM) * g.hh;
        S.bars(gx + 40, 50 + gh + 110, 70, st.mode === 0 ? [{ v: st.m * G0 * (1 - st.s / LM) * g.hh, c: C.e2, l: "Eₚ" }, { v: E1, c: C.e1, l: "Eₖ" }, { v: st.Q, c: C.e3, l: "Q" }]
          : [{ v: E1, c: C.t, l: "A₍s₎" }, { v: Ep, c: C.e2, l: "mgh" }, { v: st.Q, c: C.e3, l: "Q" }], { max: st.mode === 0 ? st.m * G0 * g.hh : (F.Fs + F.Ff) * LM, title: "energiya (J)" }); }
    };
    function go() {
      reset(); const F = forces(); S.unpause && S.unpause();
      if (st.mode === 0 && F.Fs <= F.Ff) { st.stuck = true; S.pop("Ishqalanish ushlab turibdi!", S.W * 0.4, S.H * 0.35, { c: "#15803d", size: 15, life: 2 }); info(); return; }
      st.run = true; S.t = 0;
    }
    function finish() {
      const F = forces(), g = geo();
      if (st.mode === 0) {
        const Ep = st.m * G0 * g.hh, Ek = 0.5 * st.m * st.v * st.v, acc = (F.Fs - F.Ff) / st.m;
        S.out.innerHTML = S.endCard(`PASTGA YETDI — t = ${r(S.t, 2)} s`, S.f(`t = √(2l/a) = √(2·${LM}/${r(acc, 2)}) = <b>${r(Math.sqrt((2 * LM) / acc), 2)} s</b>`, "nazariy")
          + S.f(`v = √(2al) = <b>${r(Math.sqrt(2 * acc * LM), 2)} m/s</b>`) + S.f(`mgh = Eₖ + Q: ${r(Ep, 1)} J = ${r(Ek, 1)} J + ${r(st.Q, 1)} J`, "energiya saqlanadi")
          + `<p class="sl-hint">μ ni 0 qiling — Q yo‘qoladi va butun mgh kinetik energiyaga o‘tadi. tgα ≤ μ bo‘lsa, brusok umuman qo‘zg‘almaydi.</p>`,
          [{ v: Ep, c: C.e2, l: "mgh (boshida)" }, { v: Ek, c: C.e1, l: "Eₖ (pastda)" }, { v: st.Q, c: C.e3, l: "Q (issiqlik)" }]);
      } else {
        const Af = st.m * G0 * g.hh, eta = Af / st.A;
        S.out.innerHTML = S.endCard(`FIK η = ${Math.round(eta * 100)} %`, S.f(`F = mg(sinα + μcosα) = <b>${r(F.Fs + F.Ff, 1)} N</b>`, `mg = ${r(F.mg, 1)} N o‘rniga`)
          + S.f(`A₍s₎ = F·l = ${r(st.A, 1)} J,  A₍f₎ = mgh = ${r(Af, 1)} J`) + S.f(`η = A₍f₎/A₍s₎ = <b>${Math.round(eta * 100)} %</b>`)
          + `<p class="sl-hint">Qiya tekislik kuchdan yutdiradi (F &lt; mg), lekin yo‘ldan yutqazadi (l &gt; h). Ishqalanish qancha kam bo‘lsa, FIK shuncha yuqori.</p>`,
          [{ v: st.A, c: C.t, l: "A₍sarflangan₎" }, { v: Af, c: C.e2, l: "A₍foydali₎=mgh" }, { v: st.Q, c: C.e3, l: "Q (issiqlik)" }]);
      }
    }
    function info() {
      if (st.done) return; const F = forces();
      S.out.innerHTML = S.f(`mg = ${r(F.mg, 1)} N,  N = mg·cosα = ${r(F.N, 1)} N,  F₍ishq₎ = μN = ${r(F.Ff, 1)} N`)
        + (st.mode === 0 ? S.f(`a = g(sinα − μcosα) = <b>${r(Math.max(0, (F.Fs - F.Ff) / st.m), 2)} m/s²</b>`, F.Fs <= F.Ff ? "tgα ≤ μ — jism sirpanmaydi" : "")
          : S.f(`Tortish kuchi F = mg(sinα + μcosα) = <b>${r(F.Fs + F.Ff, 1)} N</b>`))
        + `<p class="sl-hint">Qizil — og‘irlik (punktir — uning tashkil etuvchilari), ko‘k — tayanch reaksiyasi, yashil — ishqalanish${st.mode ? ", binafsha — tortish kuchi" : ""}.</p>`;
    }
    S.controls.append(buttons(["⬇ Sirpanish", "⬆ Tortib chiqarish (FIK)"], (i) => { st.mode = i; reset(); }, 0),
      slider({ label: "Qiyalik burchagi α", min: 5, max: 60, value: st.a, fmt: (v) => v + "°", onInput: (v) => { st.a = v; reset(); } }),
      slider({ label: "Massa m", min: 0.5, max: 5, step: 0.5, value: st.m, fmt: (v) => r(v, 1) + " kg", onInput: (v) => { st.m = v; reset(); } }),
      slider({ label: "Ishqalanish koeffitsiyenti μ", min: 0, max: 0.8, step: 0.05, value: st.mu, fmt: (v) => r(v, 2), onInput: (v) => { st.mu = v; reset(); } }),
      h("div", { class: "kn-row" }, button("▶ Boshlash", go), button("↺ Qaytadan", reset, "ghost")), S.timeCtl());
    reset();
  };

  // ===================================================================
  // 3. ERKIN TUSHISH — shar va pat (havoda / vakuumda)
  // ===================================================================
  W.freeFall = (root, p) => {
    const S = K.scene(root, { title: p.title || "🪶 Erkin tushish: po‘lat shar va pat — havoda va vakuumda", aspect: 0.62, aspectMobile: 1.05 });
    const x = S.x;
    const st = { H: 45, pl: 0, air: true, run: false, done: false, objs: [], tr: [], ghosts: [] };
    const RHO = [1, 0, 0.012, 0];
    const mk = () => [
      { name: "po‘lat shar", m: 1, k: 0.0022, y: 0, v: 0, land: -1, c: "#c2410c" },
      { name: "pat", m: 0.005, k: 9.81 / (1.4 * 1.4), y: 0, v: 0, land: -1, c: "#7c3aed", sway: 0 }];
    const g = () => PLAN[st.pl][1];
    const reset = () => { st.objs = mk(); st.run = false; st.done = false; st.tr = [[], []]; st.ghosts = []; S.t = 0; S.ts = 1; info(); };
    const geo = () => { const top = 74, bot = S.H - 30, sc = (bot - top) / st.H; return { top, bot, sc, xs: S.W < 560 ? [S.W * 0.3, S.W * 0.47] : [S.W * 0.3, S.W * 0.42] }; };
    S.step = (dt) => {
      if (!st.run || st.done) return;
      const air = st.air ? RHO[st.pl] : 0, gg = g();
      st.objs.forEach((o, i) => {
        if (o.land >= 0) return;
        const a = gg - (air * o.k * o.v * Math.abs(o.v) * (i ? 1 : 1)) ;
        o.v += a * dt; o.y += o.v * dt; if (i) o.sway += dt;
        if (o.y >= st.H) { o.y = st.H; o.land = S.t; const gm = geo(); S.burst(gm.xs[i], gm.bot, i ? 6 : 30, i ? "#a78bfa" : ["#a8a29e", "#78716c", "#d6d3d1"], { a0: -PI / 2, spread: 2.6, sp: i ? 30 : 60 + o.v * 4 }); if (!i) S.pop(o.v > 15 ? "BUM!" : "tak!", gm.xs[i], gm.bot - 30); }
      });
      const b = st.objs[0];
      if (S.frame % 2 === 0) st.objs.forEach((o, i) => o.land < 0 && push(st.tr[i], [S.t, o.v]));
      const nx = Math.floor(S.t / 0.25); if (b.land < 0 && nx > st.ghosts.length) st.ghosts.push([S.t, b.y]);
      S.ts = b.land < 0 && st.H - b.y < st.H * 0.12 && b.v > 4 ? 0.2 : 1;
      if (st.objs.every((o) => o.land >= 0) || (b.land >= 0 && S.t - b.land > 4)) { st.done = true; S.ts = 1; finish(); }
    };
    S.draw = () => {
      S.bg(); const gm = geo(), b = st.objs[0];
      // osmon/vakuum
      if (!st.air || !RHO[st.pl]) { x.fillStyle = "rgba(30,41,59,.06)"; x.fillRect(gm.xs[0] - 50, gm.top - 20, gm.xs[1] - gm.xs[0] + 100, gm.bot - gm.top + 20); S.text("VAKUUM", (gm.xs[0] + gm.xs[1]) / 2, gm.top - 26, { size: 10, c: C.sub, font: K.SANS, italic: false }); }
      S.hatch(8, gm.bot, S.W - 8, gm.bot);
      // chizg'ich
      const step = st.H > 40 ? 10 : 5;
      for (let m = 0; m <= st.H; m += step) { const yy = gm.top + m * gm.sc; x.strokeStyle = C.sub; x.lineWidth = 1; x.beginPath(); x.moveTo(30, yy); x.lineTo(42, yy); x.stroke(); S.text(`${m} m`, 46, yy + 4, { size: 10, align: "left", c: C.sub, italic: false, bold: false, font: K.SANS }); }
      x.strokeStyle = C.sub; x.beginPath(); x.moveTo(36, gm.top); x.lineTo(36, gm.bot); x.stroke();
      // ushlagich
      x.fillStyle = "#475569"; x.fillRect(gm.xs[0] - 40, gm.top - 22, gm.xs[1] - gm.xs[0] + 80, 6);
      // stroboskop izlari (shar)
      st.ghosts.forEach(([tt, yy], i) => { const py = gm.top + yy * gm.sc; x.globalAlpha = 0.28; S.ball(gm.xs[0], py, 9); x.globalAlpha = 1;
        if (i % (st.ghosts.length > 14 ? 2 : 1) === 0) { const sd = S.W < 560 ? 1 : -1; x.strokeStyle = "rgba(87,83,78,.35)"; x.beginPath(); x.moveTo(gm.xs[0] + sd * 14, py); x.lineTo(gm.xs[0] + sd * 24, py); x.stroke(); S.text(`${r(tt, 2)} s`, gm.xs[0] + sd * 27, py + 3, { size: 9, align: sd > 0 ? "left" : "right", c: C.sub, bold: false }); } });
      // jismlar
      st.objs.forEach((o, i) => {
        const py = gm.top + o.y * gm.sc - (i ? 0 : 10), px = gm.xs[i] + (i && o.land < 0 && st.air && RHO[st.pl] ? Math.sin(o.sway * 3) * 10 : 0);
        if (!i) S.ball(px, py, 10);
        else { x.save(); x.translate(px, py - 6); x.rotate(st.air && RHO[st.pl] && o.land < 0 ? Math.sin(o.sway * 3) * 0.5 : 0.1); x.fillStyle = "#c4b5fd"; x.strokeStyle = "#6d28d9"; x.lineWidth = 1;
          x.beginPath(); x.ellipse(0, 0, 5, 15, 0.3, 0, 7); x.fill(); x.stroke(); x.beginPath(); x.moveTo(-3, 13); x.lineTo(4, -14); x.stroke(); x.restore(); }
        if (o.land < 0 && o.v > 3) S.arrow(px + 16, py, px + 16, py + Math.min(80, o.v * 3), C.v, i ? "" : "v", { w: 1.8 });
        S.text(o.name, gm.xs[i], gm.bot + 16, { size: 10, c: o.c, bold: false });
      });
      S.hud(`v = ${r(b.v, 1)} m/s`, b.land >= 0 ? `yerga ${r(b.land, 2)} s da tushdi` : `h = gt²/2 → ${r(b.y, 1)} m tushdi`);
      const gw = S.W < 560 ? S.W * 0.38 : Math.min(290, S.W * 0.4), gh = S.W < 560 ? S.H * 0.25 : S.H * 0.4, gx = S.W - gw - 10;
      const tmax = Math.max(1, Math.sqrt((2 * st.H) / g()) * 1.15, S.t);
      const th = []; for (let tt = 0; tt <= Math.sqrt((2 * st.H) / g()) + 1e-9; tt += 0.05) th.push([tt, g() * tt]);
      S.graph(gx, 50, gw, gh, [{ d: th, c: "rgba(87,83,78,.6)", dash: [4, 4], l: "gt" }, { d: st.tr[0] || [], c: "#c2410c", l: "shar" }, { d: st.tr[1] || [], c: "#7c3aed", l: "pat" }], { xmax: tmax, yl: "v (m/s)", ymin: 0, ymax: g() * Math.sqrt((2 * st.H) / g()) * 1.1 });
    };
    function finish() {
      const b = st.objs[0], f = st.objs[1], T = Math.sqrt((2 * st.H) / g()), Ek = 0.5 * b.m * b.v * b.v, Ep = b.m * g() * st.H;
      const vac = !st.air || !RHO[st.pl];
      S.out.innerHTML = S.endCard(vac ? "VAKUUMDA IKKALASI BIRGA TUSHDI!" : `SHAR ${r(b.land, 2)} s, PAT ${f.land >= 0 ? r(f.land, 1) + " s" : "hali havoda"}`,
        S.f(`t = √(2h/g) = √(2·${st.H}/${r(g(), 2)}) = <b>${r(T, 2)} s</b>`, "nazariy (vakuum)") + S.f(`v = √(2gh) = <b>${r(Math.sqrt(2 * g() * st.H), 1)} m/s</b> (${Math.round(Math.sqrt(2 * g() * st.H) * 3.6)} km/soat)`)
        + S.f(`O‘lchangan: shar t = ${r(b.land, 2)} s, v = ${r(b.v, 1)} m/s`)
        + `<p class="sl-hint">${vac ? "Havo bo‘lmasa, hamma jism massasidan qat’i nazar bir xil tezlanish (g) bilan tushadi — Galiley g‘oyasi. 1971-yilda “Apollon-15” astronavti Oyda bolg‘a va patni tashlab buni ko‘rsatgan." : "Havoda pat tezda o‘zgarmas (chegaraviy) tezlikka yetadi: havo qarshiligi og‘irlikni muvozanatlaydi. “Havo” belgisini o‘chirib qayta tashlang!"} Stroboskop izlari orasidagi masofa ortib boradi — tezlik har soniyada ${r(g(), 1)} m/s ga oshadi.</p>`,
        [{ v: Ep, c: C.e2, l: "mgh (boshida)" }, { v: Ek, c: C.e1, l: "Eₖ (yerda)" }, { v: Math.max(0, Ep - Ek), c: C.e3, l: "havoga ketdi" }]);
    }
    function info() { if (st.done) return; S.out.innerHTML = S.f(`h = gt²/2,  v = gt,  g = ${r(g(), 2)} m/s²`) + `<p class="sl-hint">“▶ Tashlash” ni bosing. Yerga yaqinlashganda kamera sekinlashadi (×1/5). Har 0,25 s da sharning surati qoladi.</p>`; }
    let airChk;
    function render() {
      S.controls.innerHTML = "";
      airChk = chk("Havo bor (qarshilik)", st.air, (on) => { st.air = on; reset(); });
      S.controls.append(h("div", { class: "kn-row" }, button("▶ Tashlash", () => { reset(); st.run = true; S.unpause && S.unpause(); }), button("↺ Qaytadan", reset, "ghost"), airChk),
        buttons(PLAN.slice(0, 3).map((q) => `${q[0]} (${r(q[1], 1)})`), (i) => { st.pl = i; reset(); }, st.pl),
        slider({ label: "Balandlik h", min: 5, max: 80, step: 5, value: st.H, fmt: (v) => v + " m", onInput: (v) => { st.H = v; reset(); } }), S.timeCtl());
    }
    render(); reset();
  };

  // ===================================================================
  // 4. AYLANA HARAKAT — ipni kesing: jism urinma bo'ylab uchadi
  // ===================================================================
  W.circular = (root, p) => {
    const S = K.scene(root, { title: p.title || "🔄 Aylana bo‘ylab harakat: ipni kesing — tosh qayerga uchadi?", aspect: 0.58, aspectMobile: 0.95 });
    const x = S.x, LIM = 60;
    const st = { v: 3, R: 1, m: 0.5, ang: 0, cut: false, fx: 0, fy: 0, fvx: 0, fvy: 0, trail: [], tr: [[], []], cutT: -1, revs: 0, snapped: false };
    const reset = () => { Object.assign(st, { ang: 0, cut: false, trail: [], tr: [[], []], cutT: -1, revs: 0, snapped: false }); S.t = 0; S.ts = 1; info(); };
    const geo = () => { const cx = S.W < 560 ? S.W * 0.5 : S.W * 0.3, cy = S.W < 560 ? S.H * 0.38 : S.H * 0.55, sc = Math.min(S.H * 0.36, S.W * 0.2) / 2; return { cx, cy, sc }; };
    const F = () => (st.m * st.v * st.v) / st.R;
    S.step = (dt) => {
      if (!st.cut) {
        const a0 = st.ang; st.ang += (st.v / st.R) * dt; if (Math.floor(st.ang / (2 * PI)) > Math.floor(a0 / (2 * PI))) st.revs++;
        if (F() > LIM) cut(true);
      } else { st.fx += st.fvx * dt; st.fy += st.fvy * dt; S.ts = S.t - st.cutT < 1.2 ? 0.25 : 1; }
      if (S.frame % 2 === 0) { const vx = st.cut ? st.fvx : -st.v * Math.sin(st.ang), vy = st.cut ? st.fvy : st.v * Math.cos(st.ang); push(st.tr[0], [S.t, vx], 600); push(st.tr[1], [S.t, vy], 600); }
    };
    function cut(snap) {
      if (st.cut) return; const g = geo();
      st.cut = true; st.snapped = !!snap; st.cutT = S.t; st.fx = st.R * Math.cos(st.ang); st.fy = st.R * Math.sin(st.ang); st.fvx = -st.v * Math.sin(st.ang); st.fvy = st.v * Math.cos(st.ang);
      const px = g.cx + st.fx * g.sc, py = g.cy + st.fy * g.sc;
      S.burst(px, py, 14, ["#facc15", "#a16207"], { sp: 70, g: 0 }); S.pop(snap ? "IP UZILDI!" : "✂ kesildi", px, py - 24, { c: C.red });
      info();
    }
    S.draw = () => {
      S.bg(); const g = geo();
      const px = g.cx + (st.cut ? st.fx : st.R * Math.cos(st.ang)) * g.sc, py = g.cy + (st.cut ? st.fy : st.R * Math.sin(st.ang)) * g.sc;
      if (S.frame % 2 === 0) { st.trail.push([px, py]); if (st.trail.length > 70) st.trail.shift(); }
      x.setLineDash([4, 5]); x.strokeStyle = "rgba(87,83,78,.45)"; x.lineWidth = 1; x.beginPath(); x.arc(g.cx, g.cy, st.R * g.sc, 0, 7); x.stroke(); x.setLineDash([]);
      st.trail.forEach(([tx, ty], i) => { x.globalAlpha = i / st.trail.length * 0.5; x.fillStyle = "#c2410c"; x.beginPath(); x.arc(tx, ty, 2.5, 0, 7); x.fill(); }); x.globalAlpha = 1;
      if (st.cut) { const ex = g.cx + st.R * Math.cos(st.ang) * g.sc, ey = g.cy + st.R * Math.sin(st.ang) * g.sc;
        x.setLineDash([2, 4]); x.strokeStyle = C.v; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex + st.fvx * 400, ey + st.fvy * 400); x.stroke(); x.setLineDash([]);
        S.text("urinma", ex + st.fvx * 40 + 22, ey + st.fvy * 40 + 4, { size: 10, c: C.v, bold: false, halo: true }); }
      // qo'l / o'q
      x.fillStyle = "#475569"; x.beginPath(); x.arc(g.cx, g.cy, 8, 0, 7); x.fill(); x.fillStyle = "#e2e8f0"; x.beginPath(); x.arc(g.cx, g.cy, 3, 0, 7); x.fill();
      if (!st.cut) { x.strokeStyle = C.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(g.cx, g.cy); x.lineTo(px, py); x.stroke(); }
      else { const a = st.ang, L = st.R * g.sc * 0.5; x.strokeStyle = C.ink; x.lineWidth = 1.6; x.beginPath(); x.moveTo(g.cx, g.cy); x.lineTo(g.cx + Math.cos(a + 0.15) * L, g.cy + Math.sin(a + 0.15) * L); x.stroke(); }
      S.ball(px, py, 11, "#e7e5e4", "#57534e");
      const vx = st.cut ? st.fvx : -st.v * Math.sin(st.ang), vy = st.cut ? st.fvy : st.v * Math.cos(st.ang);
      S.arrow(px, py, px + vx * 14, py + vy * 14, C.v, "v");
      if (!st.cut) { const ac = (st.v * st.v) / st.R, L = Math.min(st.R * g.sc * 0.8, 10 + ac * 2.2); S.arrow(px, py, px - Math.cos(st.ang) * L, py - Math.sin(st.ang) * L, C.g, "a, F"); }
      S.hud(st.cut ? "Ip kesildi → to‘g‘ri chiziq!" : `F = mv²/R = ${r(F(), 1)} N`, st.cut ? "inersiya: tezlik saqlanadi" : `ip chidamliligi: ${LIM} N · aylanishlar: ${st.revs}`);
      // ip kuchlanishi o'lchagich
      if (!st.cut) { const k = Math.min(1, F() / LIM); x.fillStyle = "rgba(87,83,78,.15)"; x.fillRect(12, S.H - 22, 120, 8); x.fillStyle = k > 0.8 ? C.red : k > 0.5 ? "#f59e0b" : "#16a34a"; x.fillRect(12, S.H - 22, 120 * k, 8);
        S.text("ip tarangligi", 12, S.H - 28, { size: 10, align: "left", c: C.sub, bold: false }); }
      const gw = S.W < 560 ? S.W - 24 : Math.min(300, S.W * 0.4), gh = S.W < 560 ? S.H * 0.24 : S.H * 0.38, gx = S.W - gw - 12, gy = S.W < 560 ? S.H - gh - 34 : 54;
      S.graph(gx, gy, gw, gh, [{ d: st.tr[0], c: C.v, l: "vₓ" }, { d: st.tr[1], c: "#c2410c", l: "v_y" }], { win: 6, sym: true, yl: "m/s" });
    };
    function info() {
      const a = (st.v * st.v) / st.R, T = (2 * PI * st.R) / st.v;
      S.out.innerHTML = S.f(`a = v²/R = ${r(st.v, 1)}²/${r(st.R, 2)} = <b>${r(a, 2)} m/s²</b>`) + S.f(`F = ma = <b>${r(st.m * a, 1)} N</b>`, F() > LIM ? "ip chidamaydi!" : `ip chidamliligi ${LIM} N`)
        + S.f(`T = 2πR/v = ${r(T, 2)} s,  ν = ${r(1 / T, 2)} ayl/s,  ω = v/R = ${r(st.v / st.R, 2)} rad/s`)
        + `<p class="sl-hint">${st.cut ? "Ip kesilgach jismga markazga tortuvchi kuch ta’sir qilmaydi — u <b>urinma bo‘ylab to‘g‘ri chiziqli</b> uchib ketadi (Nyutonning 1-qonuni). Grafikda vₓ va v_y endi o‘zgarmaydi." : "Tezlik moduli o‘zgarmaydi, lekin yo‘nalishi doim o‘zgaradi — grafikda vₓ va v_y sinusoida. Tezlikni oshiring: ip kuchi v² ga proporsional o‘sadi va ip uzilishi mumkin!"}</p>`;
    }
    S.controls.append(h("div", { class: "kn-row" }, button("✂ Ipni kesish", () => cut(false)), button("↺ Qaytadan", reset, "ghost")),
      slider({ label: "Tezlik v", min: 0.5, max: 8, step: 0.5, value: st.v, fmt: (v) => r(v, 1) + " m/s", onInput: (v) => { st.v = v; if (!st.cut) info(); } }),
      slider({ label: "Radius R", min: 0.5, max: 2, step: 0.25, value: st.R, fmt: (v) => r(v, 2) + " m", onInput: (v) => { st.R = v; if (!st.cut) info(); } }),
      slider({ label: "Massa m", min: 0.1, max: 2, step: 0.1, value: st.m, fmt: (v) => r(v, 1) + " kg", onInput: (v) => { st.m = v; if (!st.cut) info(); } }), S.timeCtl());
    reset();
  };

  // ===================================================================
  // 5. LIFT — tarozi ko'rsatkichi, tezlanish profili, vaznsizlik
  // ===================================================================
  W.elevator = (root, p) => {
    const S = K.scene(root, { title: p.title || "🛗 Liftda tarozi: harakat davomida og‘irlik qanday o‘zgaradi?", aspect: 0.6, aspectMobile: 1.0 });
    const x = S.x, FL = 3, NF = 9;
    const st = { m: 50, y: 0, v: 0, a: 0, prog: null, pt: 0, tr: [[], []], free: false, done: true, float: 0 };
    const P = () => Math.max(0, st.m * (G0 + st.a));
    const plan = (from, to) => { const D = (to - from) * FL, s = Math.sign(D), A = 1.6, V = 2.5, tA = V / A, dA = 0.5 * A * tA * tA;
      const tC = Math.max(0, (Math.abs(D) - 2 * dA) / V); return [[0.6, 0], [tA, s * A], [tC, 0], [tA, -s * A], [0.8, 0]]; };
    function start(kind) {
      const fl = Math.round(st.y / FL);
      st.free = kind === 2; st.br = false; st.tr = [[], []]; S.t = 0; st.pt = 0; st.done = false; st.v = 0; S.unpause && S.unpause();
      if (kind === 2) { st.y = Math.max(st.y, 7 * FL); st.prog = [[0.6, 0], [1.6, -G0], [0.55, 28], [0.8, 0]]; }
      else st.prog = plan(fl, kind === 0 ? NF - 1 : 0);
      info();
    }
    S.step = (dt) => {
      if (st.done || !st.prog) return;
      st.pt += dt; let acc = 0, tt = st.pt, seg = -1;
      for (let i = 0; i < st.prog.length; i++) { if (tt < st.prog[i][0]) { seg = i; acc = st.prog[i][1]; break; } tt -= st.prog[i][0]; }
      if (seg < 0) { st.done = true; st.a = 0; st.v = 0; st.y = Math.round(st.y / FL) * FL; finish(); return; }
      if (st.free && seg === 2 && st.v >= 0) { acc = 0; st.v = 0; }
      st.a = acc; st.v += acc * dt; st.y = Math.max(0, Math.min((NF - 1) * FL, st.y + st.v * dt));
      S.ts = st.free && seg === 2 ? 0.25 : 1;
      if (st.free && seg === 2 && !st.br) { st.br = true; S.pop("⚠ favqulodda tormoz!", S.W * 0.3, S.H * 0.3, { c: C.red, size: 14 }); }
      if (S.frame % 2 === 0) { push(st.tr[0], [S.t, st.a]); push(st.tr[1], [S.t, P() / G0]); }
    };
    S.draw = () => {
      S.bg({ grid: false });
      const shX = S.W < 560 ? S.W * 0.3 : S.W * 0.2, shW = Math.min(150, S.W * 0.32), hP = S.H * 0.36; // 1 qavat = hP px
      const camY = st.y; const cy = S.H * 0.5;
      const Y = (wy) => cy - (wy - camY) * (hP / FL);
      // shaxta
      x.fillStyle = "rgba(87,83,78,.08)"; x.fillRect(shX - shW / 2 - 10, 0, shW + 20, S.H);
      for (let f = 0; f < NF; f++) { const yy = Y(f * FL); x.strokeStyle = "rgba(87,83,78,.5)"; x.lineWidth = 2; x.beginPath(); x.moveTo(shX - shW / 2 - 40, yy); x.lineTo(shX - shW / 2 - 10, yy); x.stroke();
        S.text(`${f + 1}-qavat`, shX - shW / 2 - 44, yy - 6, { size: 10, align: "right", c: C.sub, bold: false, italic: false, font: K.SANS }); }
      // kabina
      const top = Y(st.y + FL * 0.92), bot = Y(st.y);
      x.strokeStyle = C.ink; x.lineWidth = 1.5; x.beginPath(); x.moveTo(shX, 0); x.lineTo(shX, top); x.stroke();
      x.fillStyle = "#fafaf9"; x.fillRect(shX - shW / 2, top, shW, bot - top); x.strokeStyle = C.ink; x.lineWidth = 2; x.strokeRect(shX - shW / 2, top, shW, bot - top);
      // tarozi va odam
      const wl = st.a <= -G0 + 0.1 ? 1 : 0; st.float += ((wl ? 1 : 0) - st.float) * 0.08;
      const sx = shX, sy = bot - 10; x.fillStyle = "#334155"; x.fillRect(sx - 26, sy, 52, 8);
      x.fillStyle = "#111827"; x.fillRect(sx - 16, sy + 1, 32, 6); S.text(`${r(P() / G0, 1)}`, sx, sy + 7, { size: 7, c: "#4ade80", italic: false, font: K.MONO });
      const ph = (bot - top) * 0.62, fy = sy - st.float * 14; // odam
      x.strokeStyle = C.ink; x.lineWidth = 2.5; x.lineCap = "round";
      x.beginPath(); x.arc(sx, fy - ph + 8, 8, 0, 7); x.stroke();
      x.beginPath(); x.moveTo(sx, fy - ph + 16); x.lineTo(sx, fy - ph * 0.4); x.moveTo(sx, fy - ph * 0.4); x.lineTo(sx - 9, fy); x.moveTo(sx, fy - ph * 0.4); x.lineTo(sx + 9, fy);
      const arm = st.float * 0.9; x.moveTo(sx, fy - ph * 0.75); x.lineTo(sx - 14, fy - ph * (0.5 + arm * 0.5)); x.moveTo(sx, fy - ph * 0.75); x.lineTo(sx + 14, fy - ph * (0.5 + arm * 0.5)); x.stroke(); x.lineCap = "butt";
      // kuchlar
      const k = 50 / (st.m * G0);
      S.arrow(sx + 30, fy - ph * 0.45, sx + 30, fy - ph * 0.45 + st.m * G0 * k, C.g, "mg");
      if (P() > 1) S.arrow(sx - 30, sy, sx - 30, sy - P() * k, C.n, "N");
      if (Math.abs(st.a) > 0.05) S.arrow(shX + shW / 2 + 22, cy, shX + shW / 2 + 22, cy - Math.sign(st.a) * Math.min(60, 12 + Math.abs(st.a) * 5), "#a16207", "a");
      // katta tarozi displeyi
      const dx = S.W < 560 ? S.W * 0.74 : S.W * 0.48, dy = 96;
      x.fillStyle = "#111827"; x.fillRect(dx - 62, dy - 26, 124, 46); x.strokeStyle = "#475569"; x.lineWidth = 2; x.strokeRect(dx - 62, dy - 26, 124, 46);
      S.text(`${r(P() / G0, 1)} kg`, dx, dy + 4, { size: 22, c: P() < 5 ? "#f87171" : "#4ade80", italic: false, font: K.MONO });
      S.text("tarozi", dx, dy - 31, { size: 10, c: C.sub, bold: false });
      S.hud(`P = m(g + a) = ${Math.round(P())} N`, st.a <= -G0 + 0.1 ? "VAZNSIZLIK!" : st.a > 0.05 ? "o‘ta yuklanish" : st.a < -0.05 ? "og‘irlik kamaydi" : `v = ${r(st.v, 1)} m/s`);
      const gw = S.W < 560 ? S.W * 0.5 : Math.min(300, S.W * 0.42), gh = S.W < 560 ? S.H * 0.3 : S.H * 0.44, gx = S.W - gw - 10, gy = S.H - gh - 12;
      S.graph(gx, gy, gw, gh, [{ d: st.tr[1], c: "#16a34a", l: "tarozi, kg" }, { d: st.tr[0].map((q) => [q[0], q[1] * 5]), c: "#a16207", l: "a×5" }], { xmax: Math.max(4, S.t), ymin: -55, ymax: Math.max(st.m * 2.6, 90) });
    };
    function finish() { info(true); }
    function info(fin) {
      S.out.innerHTML = S.f(`P = m(g + a)`, "a yuqoriga musbat") + S.f(`Tinch turganda: ${st.m}·9,81 = <b>${Math.round(st.m * G0)} N</b> (${st.m} kg)`)
        + S.f(`Tezlanish 1,6 m/s² yuqoriga: <b>${Math.round(st.m * (G0 + 1.6))} N</b> (${r(st.m * (G0 + 1.6) / G0, 1)} kg) — o‘ta yuklanish`)
        + S.f(`Pastga 1,6 m/s²: <b>${Math.round(st.m * (G0 - 1.6))} N</b> (${r(st.m * (G0 - 1.6) / G0, 1)} kg)`)
        + `<p class="sl-hint">${fin && st.free ? "Tros uzilganda lift va odam birga erkin tushdi (a = −g) — tarozi 0 ni ko‘rsatdi: <b>vaznsizlik</b>. Tormozlanishda esa og‘irlik bir necha marta ortdi!" : "Massa o‘zgarmaydi — o‘zgaradigan og‘irlik (tayanchga bosim kuchi). Grafikda tarozi ko‘rsatkichi tezlanish bilan birga o‘zgaradi."}</p>`;
    }
    S.controls.append(h("div", { class: "kn-row" }, button("⬆ 1 → 9-qavat", () => start(0)), button("⬇ 9 → 1-qavat", () => start(1)), button("⚠ Tros uzildi!", () => start(2), "ghost")),
      slider({ label: "Odam massasi", min: 20, max: 100, step: 5, value: st.m, fmt: (v) => v + " kg", onInput: (v) => { st.m = v; info(); } }), S.timeCtl());
    info();
  };

  // ===================================================================
  // 6. RICHAG — yuklarni sudrang, momentlar qoidasi
  // ===================================================================
  W.lever = (root, p) => {
    const S = K.scene(root, { title: p.title || "⚖️ Richag: yuklarni sudrab joylashtiring — momentlar qoidasi", aspect: 0.5, aspectMobile: 0.8,
      tip: "👆 Yuklarni richag ustida sudrang", slow: false });
    const x = S.x;
    const st = { w: [{ m: 4, d: -3, c: "#2563eb" }, { m: 2, d: 4, c: "#db2777" }], th: 0, om: 0, drag: -1, bal: false, sl: [] };
    const geo = () => { const cx = S.W < 560 ? S.W / 2 : S.W * 0.38, cy = S.H * 0.52, k = Math.min(S.W < 560 ? S.W * 0.085 : S.W * 0.055, 44); return { cx, cy, k }; };
    const M = () => st.w.reduce((s, w) => s + w.m * G0 * w.d * 0.1, 0);
    S.step = (dt) => {
      const I = st.w.reduce((s, w) => s + w.m * (w.d * 0.1) ** 2, 0) + 0.6;
      st.om += ((M() * Math.cos(st.th) - 3 * st.om) / I) * dt; st.th += st.om * dt;
      if (st.th > 0.32) { st.th = 0.32; st.om = Math.min(0, st.om) * -0.25; } if (st.th < -0.32) { st.th = -0.32; st.om = Math.max(0, st.om) * -0.25; }
    };
    S.draw = () => {
      S.bg(); const g = geo();
      S.hatch(10, S.H - 20, S.W - 10, S.H - 20);
      x.fillStyle = "#a8a29e"; x.beginPath(); x.moveTo(g.cx, g.cy); x.lineTo(g.cx - 24, S.H - 20); x.lineTo(g.cx + 24, S.H - 20); x.closePath(); x.fill(); x.strokeStyle = "#57534e"; x.stroke();
      x.save(); x.translate(g.cx, g.cy); x.rotate(st.th);
      const L = g.k * 5.6; const gr = x.createLinearGradient(0, -6, 0, 6); gr.addColorStop(0, "#d6b27a"); gr.addColorStop(1, "#a0763b");
      x.fillStyle = gr; x.fillRect(-L, -6, 2 * L, 12); x.strokeStyle = "#7c2d12"; x.lineWidth = 1; x.strokeRect(-L, -6, 2 * L, 12);
      for (let i = -5; i <= 5; i++) { x.fillStyle = "#7c2d12"; x.fillRect(i * g.k - 0.5, -6, 1, i % 5 ? 5 : 12); if (i) S.text(`${Math.abs(i) * 10}`, i * g.k, 20, { size: 9, c: C.sub, italic: false, bold: false, font: K.SANS }); }
      st.w.forEach((w, i) => { const s = 14 + w.m * 3.2, X0 = w.d * g.k; x.fillStyle = w.c; x.fillRect(X0 - s / 2, -6 - s, s, s); x.strokeStyle = "rgba(0,0,0,.4)"; x.strokeRect(X0 - s / 2, -6 - s, s, s);
        S.text(`${w.m} kg`, X0, -6 - s / 2 + 4, { size: 10, c: "#fff", italic: false, font: K.SANS }); });
      x.restore();
      x.fillStyle = C.ink; x.beginPath(); x.arc(g.cx, g.cy, 4, 0, 7); x.fill();
      // og'irlik kuchlari va momentlar
      st.w.forEach((w) => { const px = g.cx + w.d * g.k * Math.cos(st.th), py = g.cy + w.d * g.k * Math.sin(st.th); S.arrow(px, py + 6, px, py + 6 + w.m * 9, C.g, `${r(w.m * G0, 0)} N`, { fs: 10 }); });
      const m1 = Math.abs(st.w[0].m * G0 * st.w[0].d * 0.1), m2 = Math.abs(st.w[1].m * G0 * st.w[1].d * 0.1);
      const bal = Math.abs(M()) < 1e-6;
      if (bal && !st.bal) { S.burst(g.cx, g.cy - 40, 30, ["#facc15", "#22c55e", "#3b82f6"], { sp: 120, g: 120 }); S.pop("⚖ MUVOZANAT!", g.cx, g.cy - 60, { c: "#15803d", size: 18, life: 1.6 }); }
      st.bal = bal;
      S.hud(bal ? "M₁ = M₂ — muvozanat" : `ΣM = ${r(M(), 2)} N·m`, `M₁ = ${r(m1, 2)} N·m,  M₂ = ${r(m2, 2)} N·m`, { dig: 1 });
      if (S.W >= 560) S.bars(S.W - 110, S.H - 50, S.H * 0.5, [{ v: m1, c: st.w[0].c, l: "M₁" }, { v: m2, c: st.w[1].c, l: "M₂" }], { max: Math.max(m1, m2, 1) * 1.1, title: "momentlar", bw: 22 });
    };
    const wpos = (i) => { const g = geo(), w = st.w[i], s = 14 + w.m * 3.2; return [g.cx + w.d * g.k * Math.cos(st.th) + (6 + s / 2) * Math.sin(st.th), g.cy + w.d * g.k * Math.sin(st.th) - (6 + s / 2) * Math.cos(st.th)]; };
    S.hover = (pt) => st.w.some((_, i) => { const q = wpos(i); return Math.hypot(pt[0] - q[0], pt[1] - q[1]) < 26; });
    S.pointer((pt) => { let best = -1, bd = 36; st.w.forEach((_, i) => { const q = wpos(i), d = Math.hypot(pt[0] - q[0], pt[1] - q[1]); if (d < bd) { bd = d; best = i; } }); if (best < 0) return false; st.drag = best; },
      (pt) => { const g = geo(); let d = Math.round(((pt[0] - g.cx) / Math.cos(st.th)) / g.k); d = Math.max(-5, Math.min(5, d)); if (!d) d = st.drag ? 1 : -1;
        if (st.w[st.drag].d !== d) { st.w[st.drag].d = d; sync(); info(); } }, () => (st.drag = -1));
    function info() {
      const [a, b] = st.w, M1 = a.m * G0 * Math.abs(a.d) * 0.1, M2 = b.m * G0 * Math.abs(b.d) * 0.1, same = Math.sign(a.d) === Math.sign(b.d);
      S.out.innerHTML = S.f(`M₁ = F₁·l₁ = ${r(a.m * G0, 1)}·${r(Math.abs(a.d) * 0.1, 1)} = <b>${r(M1, 2)} N·m</b>`) + S.f(`M₂ = F₂·l₂ = ${r(b.m * G0, 1)}·${r(Math.abs(b.d) * 0.1, 1)} = <b>${r(M2, 2)} N·m</b>`)
        + `<p class="sl-hint">${same ? "Ikkala yuk bir tomonda — momentlar qo‘shiladi, muvozanat bo‘lmaydi." : "Muvozanat sharti: <b>F₁·l₁ = F₂·l₂</b>. Masalan 4 kg ni 30 sm ga, 2 kg ni 60 sm ga qo‘ying."} Kichik kuch bilan katta yukni ko‘tarish uchun yelkani uzaytiramiz (qaychi, belkurak, eshik dastasi). “Menga tayanch nuqta bering — Yerni ko‘taraman” (Arximed).</p>`;
    }
    function sync() { st.sl.forEach((s, i) => s.set(i % 2 ? Math.abs(st.w[i >> 1].d) : st.w[i >> 1].m)); }
    st.sl = [slider({ label: "Chap yuk m₁", min: 1, max: 8, value: 4, fmt: (v) => v + " kg", onInput: (v) => { st.w[0].m = v; info(); } }),
      slider({ label: "Chap yelka l₁", min: 1, max: 5, value: 3, fmt: (v) => v * 10 + " sm", onInput: (v) => { st.w[0].d = -v; info(); } }),
      slider({ label: "O‘ng yuk m₂", min: 1, max: 8, value: 2, fmt: (v) => v + " kg", onInput: (v) => { st.w[1].m = v; info(); } }),
      slider({ label: "O‘ng yelka l₂", min: 1, max: 5, value: 4, fmt: (v) => v * 10 + " sm", onInput: (v) => { st.w[1].d = v; info(); } })];
    S.controls.append(...st.sl);
    info();
  };

  // ===================================================================
  // 7. ORBITA — kosmik tezliklar, izlar, balandlik grafigi
  // ===================================================================
  W.orbit = (root, p) => {
    const S = K.scene(root, { title: p.title || "🛰 Sun’iy yo‘ldosh: tezlikni tanlab uchiring — orbita qanday bo‘ladi?", aspect: 0.62, aspectMobile: 1.1, slow: false });
    const x = S.x, R = 6371e3, GM = 3.986e14, WARP = 300;
    const st = { v0: 7.9, s: null, old: [], tr: [], simT: 0 };
    const stars = Array.from({ length: 70 }, (_, i) => [((i * 7919) % 997) / 997, ((i * 6271) % 991) / 991]);
    function launch() {
      if (st.s && st.s.tr.length > 5) { st.old.push({ tr: st.s.tr, v: st.s.v0 }); if (st.old.length > 4) st.old.shift(); }
      st.s = { x: 0, y: R + 300e3, vx: st.v0 * 1000, vy: 0, tr: [], done: "", v0: st.v0, hmax: 0, hmin: 1e12 }; st.tr = []; st.simT = 0; S.t = 0; S.unpause && S.unpause(); info();
    }
    S.step = (dt) => {
      const s = st.s; if (!s || s.done) return;
      const h0 = WARP * dt, n = 4;
      for (let i = 0; i < n; i++) { const rr = Math.hypot(s.x, s.y), a = -GM / (rr * rr * rr); s.vx += a * s.x * (h0 / n); s.vy += a * s.y * (h0 / n); s.x += s.vx * (h0 / n); s.y += s.vy * (h0 / n);
        if (rr < R) { s.done = "💥 Yerga qulab tushdi"; const g = geo(); S.burst(g.cx + s.x * g.sc, g.cy - s.y * g.sc, 30, ["#f97316", "#facc15", "#78716c"], { sp: 60, g: 0 }); info(); break; }
        if (rr > 6.5 * R) { s.done = "🚀 Yerning tortishishidan chiqib ketdi"; info(); break; } }
      st.simT += h0;
      const alt = (Math.hypot(s.x, s.y) - R) / 1000; s.hmax = Math.max(s.hmax, alt); s.hmin = Math.min(s.hmin, alt);
      if (S.frame % 3 === 0 && (!s.tr.length || S.frame !== s.lf)) { s.lf = S.frame; s.tr.push([s.x, s.y]); if (s.tr.length > 2500) s.tr.shift(); push(st.tr, [st.simT / 60, alt], 2000); }
    };
    const geo = () => { const cx = S.W < 560 ? S.W / 2 : S.W * 0.36, cy = S.W < 560 ? S.H * 0.38 : S.H / 2, sc = Math.min(S.W < 560 ? S.W : S.W * 0.7, S.W < 560 ? S.H * 0.7 : S.H) / (5.2 * R); return { cx, cy, sc }; };
    S.draw = () => {
      x.fillStyle = "#0b1120"; x.fillRect(0, 0, S.W, S.H);
      stars.forEach(([a, b], i) => { x.fillStyle = `rgba(255,255,255,${0.3 + (i % 5) * 0.12})`; x.fillRect(a * S.W, b * S.H, 1.4, 1.4); });
      const g = geo(), Rp = R * g.sc;
      const at = x.createRadialGradient(g.cx, g.cy, Rp, g.cx, g.cy, Rp * 1.12); at.addColorStop(0, "rgba(96,165,250,.45)"); at.addColorStop(1, "rgba(96,165,250,0)"); x.fillStyle = at; x.beginPath(); x.arc(g.cx, g.cy, Rp * 1.12, 0, 7); x.fill();
      const gr = x.createRadialGradient(g.cx - Rp * 0.3, g.cy - Rp * 0.3, Rp * 0.1, g.cx, g.cy, Rp); gr.addColorStop(0, "#60a5fa"); gr.addColorStop(0.7, "#1d4ed8"); gr.addColorStop(1, "#1e3a8a");
      x.fillStyle = gr; x.beginPath(); x.arc(g.cx, g.cy, Rp, 0, 7); x.fill();
      x.fillStyle = "rgba(34,197,94,.55)"; [[-0.3, -0.2, 0.35], [0.25, 0.3, 0.28], [0.1, -0.45, 0.2]].forEach(([a, b, c]) => { x.beginPath(); x.ellipse(g.cx + a * Rp, g.cy + b * Rp, c * Rp, c * Rp * 0.6, a, 0, 7); x.fill(); });
      const path = (tr, col, w) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); tr.forEach(([px, py], i) => (i ? x.lineTo(g.cx + px * g.sc, g.cy - py * g.sc) : x.moveTo(g.cx + px * g.sc, g.cy - py * g.sc))); x.stroke(); };
      st.old.forEach((o) => { path(o.tr, "rgba(148,163,184,.35)", 1); const lp = o.tr[o.tr.length - 1]; S.text(`${r(o.v, 1)}`, g.cx + lp[0] * g.sc + 8, g.cy - lp[1] * g.sc, { size: 9, c: "#94a3b8", bold: false, align: "left" }); });
      const s = st.s;
      if (s) {
        path(s.tr, "#fde047", 1.8);
        const px = g.cx + s.x * g.sc, py = g.cy - s.y * g.sc;
        if (!s.done || s.done.startsWith("🚀")) {
          const vv = Math.hypot(s.vx, s.vy), rr = Math.hypot(s.x, s.y), gl = (GM / (rr * rr));
          x.strokeStyle = "#60a5fa"; x.fillStyle = "#60a5fa";
          S.arrow(px, py, px + (s.vx / vv) * (14 + vv / 300), py - (s.vy / vv) * (14 + vv / 300), "#38bdf8", "v");
          S.arrow(px, py, px - (s.x / rr) * (8 + gl * 3), py + (s.y / rr) * (8 + gl * 3), "#f87171", "F");
          x.fillStyle = "#f8fafc"; x.fillRect(px - 3, py - 3, 6, 6); x.fillStyle = "#60a5fa"; x.fillRect(px - 9, py - 1.5, 5, 3); x.fillRect(px + 4, py - 1.5, 5, 3);
        }
        const alt = (Math.hypot(s.x, s.y) - R) / 1000, vv = Math.hypot(s.vx, s.vy) / 1000;
        S.text(`t = ${Math.floor(st.simT / 60)} min (×${WARP})`, 12, 20, { font: K.MONO, italic: false, align: "left", c: "#e2e8f0", size: 12 });
        S.text(`v = ${r(vv, 2)} km/s`, K.hx(S) + 30, 22, { size: 16, c: "#fde047" });
        S.text(`balandlik ${Math.round(alt)} km`, K.hx(S) + 30, 38, { size: 11, c: "#cbd5e1", bold: false });
        if (s.done) S.text(s.done, S.W / 2, S.H - 14, { size: 14, c: "#fde047" });
      }
      const gw = S.W < 560 ? S.W - 24 : Math.min(260, S.W * 0.32), gh = S.W < 560 ? S.H * 0.22 : S.H * 0.34, gx = S.W - gw - 12, gy = S.W < 560 ? S.H - gh - 30 : 52;
      S.graph(gx, gy, gw, gh, [{ d: st.tr, c: "#ca8a04", l: "h(t), km" }], { xl: "t (min)", ymin: 0 });
    };
    function info() {
      const v = st.v0, s = st.s;
      S.out.innerHTML = S.f(`v₀ = <b>${r(v, 1)} km/s</b>`, "300 km balandlikdan gorizontal") + S.f(`v₁ = √(gR) ≈ 7,9 km/s,  v₂ = √2·v₁ ≈ 11,2 km/s`)
        + `<p class="sl-hint">${v < 7.7 ? "Birinchi kosmik tezlikdan kichik — yo‘ldosh Yerga qaytib tushadi." : v < 8.0 ? "≈ <b>Birinchi kosmik tezlik</b> — deyarli doiraviy orbita (davri ≈ 90 min)." : v < 11.0 ? "v₁ dan katta, v₂ dan kichik — <b>elliptik orbita</b>: yo‘ldosh uzoqlashib, yana qaytib keladi (h(t) grafigi to‘lqinsimon)." : "≈ yoki ≥ <b>ikkinchi kosmik tezlik</b> — Yerdan butunlay uzoqlashadi."} ${s && s.hmax ? `Eng katta balandlik: ${Math.round(s.hmax)} km.` : ""} Kulrang izlar — oldingi uchirishlar: bir nechta tezlikni solishtiring.</p>`;
    }
    S.controls.append(slider({ label: "Boshlang‘ich tezlik", min: 5, max: 12, step: 0.1, value: st.v0, fmt: (v) => r(v, 1) + " km/s", onInput: (v) => { st.v0 = v; info(); } }),
      h("div", { class: "kn-row" }, button("🚀 Uchirish", launch), button("🧹 Izlarni tozalash", () => { st.old = []; }, "ghost")), S.timeCtl({ slow: false }));
    launch();
  };

  // ===================================================================
  // 8. KUCHLARNI QO'SHISH — ikki robot arqon tortadi, quti teng ta'sir etuvchi bo'ylab siljiydi
  // ===================================================================
  W.forces = (root, p) => {
    const S = K.scene(root, { title: p.title || "➕ Kuchlarni qo‘shish: strelkalarni suring, so‘ng qutini qo‘yib yuboring", aspect: 0.58, aspectMobile: 0.95,
      tip: "👆 Ko‘k va pushti strelkalar uchini suring" });
    const x = S.x, m = 10, mu = 0.3, sc = 2.2; // px / N
    const st = { F: [[40, -14], [8, -36]], drag: -1, run: false, px: 0, py: 0, vx: 0, vy: 0, tr: [], path: [], done: false, stuck: false };
    const R = () => [st.F[0][0] + st.F[1][0], st.F[0][1] + st.F[1][1]];
    const reset = () => { Object.assign(st, { run: false, px: 0, py: 0, vx: 0, vy: 0, tr: [], path: [], done: false, stuck: false }); S.t = 0; info(); };
    const ctr = () => [S.W < 560 ? S.W / 2 : S.W * 0.36, S.H * 0.56];
    S.step = (dt) => {
      if (!st.run || st.done) return;
      const [rx, ry] = R(), Rm = Math.hypot(rx, ry), Ff = mu * m * G0;
      if (Rm <= Ff) { st.stuck = true; st.done = true; return; }
      const a = (Rm - Ff) / m; st.vx += (rx / Rm) * a * dt; st.vy += (ry / Rm) * a * dt; st.px += st.vx * dt; st.py += st.vy * dt;
      if (S.frame % 2 === 0) { push(st.tr, [S.t, Math.hypot(st.vx, st.vy)]); st.path.push([st.px, st.py]); }
      const [cx, cy] = ctr(); const qx = cx + st.px * 10, qy = cy + st.py * 10;
      if (qx < 20 || qx > S.W - 20 || qy < 20 || qy > S.H - 20 || S.t > 5) { st.done = true; info(); }
    };
    S.draw = () => {
      S.bg({ gstep: 20 }); const [cx0, cy0] = ctr(), cx = cx0 + st.px * 10, cy = cy0 + st.py * 10;
      if (st.path.length > 1) { x.strokeStyle = "rgba(202,138,4,.6)"; x.setLineDash([3, 4]); x.beginPath(); st.path.forEach(([a, b], i) => (i ? x.lineTo(cx0 + a * 10, cy0 + b * 10) : x.moveTo(cx0 + a * 10, cy0 + b * 10))); x.stroke(); x.setLineDash([]); }
      const [rx, ry] = R(), F1 = st.F[0], F2 = st.F[1];
      x.setLineDash([5, 5]); x.strokeStyle = "rgba(87,83,78,.5)"; x.lineWidth = 1; x.beginPath(); x.moveTo(cx + F1[0] * sc, cy + F1[1] * sc); x.lineTo(cx + rx * sc, cy + ry * sc); x.lineTo(cx + F2[0] * sc, cy + F2[1] * sc); x.stroke(); x.setLineDash([]);
      // robotlar (arqon uchida)
      [[F1, "#2563eb"], [F2, "#db2777"]].forEach(([F, c]) => { const L = Math.hypot(...F) || 1, ux = F[0] / L, uy = F[1] / L, ex = cx + ux * (L * sc + 40), ey = cy + uy * (L * sc + 40);
        x.strokeStyle = "#a16207"; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(ex, ey); x.stroke();
        x.fillStyle = c; x.beginPath(); x.arc(ex, ey, 10, 0, 7); x.fill(); x.fillStyle = "#fff"; x.fillRect(ex - 5, ey - 3, 3, 3); x.fillRect(ex + 2, ey - 3, 3, 3); });
      x.fillStyle = "#c2410c"; x.fillRect(cx - 16, cy - 16, 32, 32); x.strokeStyle = "#7c2d12"; x.strokeRect(cx - 16, cy - 16, 32, 32);
      S.text(`${m} kg`, cx, cy + 4, { size: 10, c: "#fff", italic: false, font: K.SANS });
      S.arrow(cx, cy, cx + F1[0] * sc, cy + F1[1] * sc, "#2563eb", `F₁=${r(Math.hypot(...F1), 0)} N`, { fs: 11 });
      S.arrow(cx, cy, cx + F2[0] * sc, cy + F2[1] * sc, "#db2777", `F₂=${r(Math.hypot(...F2), 0)} N`, { fs: 11 });
      S.arrow(cx, cy, cx + rx * sc, cy + ry * sc, "#ca8a04", `R=${r(Math.hypot(rx, ry), 0)} N`, { w: 3.5, fs: 12 });
      const Rm = Math.hypot(rx, ry), Ff = mu * m * G0;
      S.hud(`R = ${r(Rm, 1)} N`, Rm <= Ff ? `R ≤ μmg = ${r(Ff, 1)} N — quti qo‘zg‘almaydi` : `a = (R − μmg)/m = ${r((Rm - Ff) / m, 2)} m/s²`);
      if (S.W >= 560) S.graph(S.W - 250, 52, 238, S.H * 0.36, [{ d: st.tr, c: "#ca8a04", l: "v(t), m/s" }], { xmax: Math.max(2, S.t) });
    };
    const tipPos = (i) => { const [cx0, cy0] = ctr(); return [cx0 + st.px * 10 + st.F[i][0] * sc, cy0 + st.py * 10 + st.F[i][1] * sc]; };
    S.hover = (pt) => [0, 1].some((i) => { const q = tipPos(i); return Math.hypot(pt[0] - q[0], pt[1] - q[1]) < 22; });
    S.pointer((pt) => { const d = [0, 1].map((i) => { const q = tipPos(i); return Math.hypot(pt[0] - q[0], pt[1] - q[1]); }); const i = d[0] < d[1] ? 0 : 1; if (d[i] > 60) return false; st.drag = i; if (st.run) reset(); },
      (pt) => { const [cx0, cy0] = ctr(); let fx = (pt[0] - cx0) / sc, fy = (pt[1] - cy0) / sc; const L = Math.hypot(fx, fy); if (L > 70) { fx *= 70 / L; fy *= 70 / L; } st.F[st.drag] = [fx, fy]; info(); },
      () => (st.drag = -1));
    function info() {
      const [F1, F2] = st.F, a1 = Math.hypot(...F1), a2 = Math.hypot(...F2), [rx, ry] = R(), Rm = Math.hypot(rx, ry);
      const ang = Math.acos(Math.max(-1, Math.min(1, (F1[0] * F2[0] + F1[1] * F2[1]) / ((a1 * a2) || 1)))) * 180 / PI;
      S.out.innerHTML = S.f(`R = √(F₁² + F₂² + 2F₁F₂cosα) = √(${r(a1, 0)}² + ${r(a2, 0)}² + 2·${r(a1, 0)}·${r(a2, 0)}·cos${Math.round(ang)}°) = <b>${r(Rm, 1)} N</b>`)
        + S.f(`Ishqalanish: μmg = ${mu}·${m}·9,81 = ${r(mu * m * G0, 1)} N`) + (st.done && st.stuck ? `<p class="sl-hint">Teng ta’sir etuvchi ishqalanishdan kichik — quti joyidan qo‘zg‘almadi.</p>` : "")
        + `<p class="sl-hint">Parallelogramm qoidasi: R — parallelogramm diagonali. Bir tomonga yo‘nalsa R = F₁ + F₂, qarama-qarshi bo‘lsa R = |F₁ − F₂|. Quti doim <b>R yo‘nalishida</b> harakatlanadi.</p>`;
    }
    S.controls.append(h("div", { class: "kn-row" }, button("▶ Qo‘yib yuborish", () => { reset(); st.run = true; S.unpause && S.unpause(); }), button("↺ Qaytadan", reset, "ghost")), S.timeCtl({ slow: false }));
    info();
  };
})();
