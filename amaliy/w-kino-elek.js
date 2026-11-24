/* Kinoviy elektr tajribalari (KINO dvigatelida): zaryadlash va elektroskop, Kulon qonuni (osilgan sharchalar),
   elektr maydon (sinov zaryadini qo'yib yuborish), elektr zanjiri (lampochka, ampermetr, voltmetr, I(U) grafigi),
   kondensator (RC zaryadlash / chaqnab razryadlanish). Eski versiyalar (w-fizika.js) shu fayl orqali almashtiriladi. */
(() => {
  "use strict";
  const { h, slider, buttons, button, W } = window.AK;
  const K = window.KINO;
  if (!K) return;
  const { C, r } = K;
  const PI = Math.PI, G0 = 9.81, KE = 8.99e9;
  const push = (arr, p, max = 1500) => { arr.push(p); if (arr.length > max) arr.shift(); };
  const chk = (label, on, cb) => h("label", { class: "kb-check" }, h("input", { type: "checkbox", checked: on, onchange: (e) => cb(e.target.checked) }), " " + label);

  /** Siniq chiziq bo'ylab d masofadagi nuqta */
  function along(poly, d) {
    let L = 0; for (let i = 1; i < poly.length; i++) L += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]);
    d = ((d % L) + L) % L;
    for (let i = 1; i < poly.length; i++) { const sl = Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]); if (d <= sl) { const k = d / sl; return [poly[i - 1][0] + (poly[i][0] - poly[i - 1][0]) * k, poly[i - 1][1] + (poly[i][1] - poly[i - 1][1]) * k]; } d -= sl; }
    return poly[poly.length - 1];
  }
  const polyLen = (poly) => { let L = 0; for (let i = 1; i < poly.length; i++) L += Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]); return L; };
  /** Strelkali o'lchov asbobi (ampermetr / voltmetr), so'nuvchi strelka bilan */
  function gauge(S, x0, y0, R, val, max, letter, unit, col) {
    const x = S.x, k = Math.max(0, Math.min(1.05, val / max)), a = PI * (1.15 - 0.3) * 0 + (-PI * 0.8) + k * PI * 0.6;
    x.fillStyle = "#fafaf9"; x.strokeStyle = C.ink; x.lineWidth = 1.5; x.beginPath(); x.arc(x0, y0, R, 0, 7); x.fill(); x.stroke();
    x.strokeStyle = C.sub; x.lineWidth = 1; x.beginPath(); x.arc(x0, y0 + R * 0.25, R * 0.72, -PI * 0.8, -PI * 0.2); x.stroke();
    for (let i = 0; i <= 5; i++) { const b = -PI * 0.8 + (i / 5) * PI * 0.6, c1 = Math.cos(b), s1 = Math.sin(b); x.beginPath(); x.moveTo(x0 + c1 * R * 0.62, y0 + R * 0.25 + s1 * R * 0.62); x.lineTo(x0 + c1 * R * 0.72, y0 + R * 0.25 + s1 * R * 0.72); x.stroke(); }
    x.strokeStyle = col || C.red; x.lineWidth = 1.6; x.beginPath(); x.moveTo(x0, y0 + R * 0.25); x.lineTo(x0 + Math.cos(a) * R * 0.7, y0 + R * 0.25 + Math.sin(a) * R * 0.7); x.stroke();
    S.text(letter, x0, y0 + R * 0.62, { size: Math.max(10, R * 0.42), c: C.ink, italic: false, font: K.SANS });
    if (unit) S.text(unit, x0, y0 + R + 13, { size: 11, c: col || C.red, halo: true });
  }

  // ===================================================================
  // 1. ZARYADLASH — ishqalash, elektroskopga tekkizish, yerga ulash
  // ===================================================================
  W.charging = (root, p) => {
    const S = K.scene(root, { title: p.title || "⚡ Ishqalab zaryadlash: tayoqchani matoga ishqalang, so‘ng elektroskopga tekkizing", aspect: 0.56, aspectMobile: 0.9,
      tip: "👆 Tayoqchani mato ustida u yoq-bu yoqqa suring (ishqalang)", slow: false });
    const x = S.x;
    const PAIRS = [["Shisha tayoqcha", "ipak", 1, "#cbd5e1", "#fde68a"], ["Ebonit tayoqcha", "jun", -1, "#334155", "#d6d3d1"], ["Plastik taroq", "soch", -1, "#7c3aed", "#92400e"], ["Havo shari", "jun", -1, "#ef4444", "#d6d3d1"]];
    const st = { pi: 0, q: 0, cloth: 0, es: 0, rod: [0, 0], home: true, drag: false, last: null, rubD: 0, th: 0, om: 0, anim: null, fly: [], spark: 0 };
    const geo = () => { const m = S.W < 560; return { cl: [m ? S.W * 0.28 : S.W * 0.22, S.H * (m ? 0.7 : 0.66)], es: [m ? S.W * 0.74 : S.W * 0.62, S.H * 0.36], RL: Math.min(140, S.W * 0.28) }; };
    const restRod = () => { const g = geo(); return [g.cl[0], g.cl[1] - 34]; };
    const sign = () => PAIRS[st.pi][2];
    function reset() { st.q = 0; st.cloth = 0; st.es = 0; st.th = 0; st.om = 0; st.rod = restRod(); st.home = true; st.fly = []; info(); }
    S.onSize = () => { if (st.home) st.rod = restRod(); };
    function rub(dist) {
      st.rubD += dist; while (st.rubD > 40 && Math.abs(st.q) < 12) { st.rubD -= 40; st.q += sign(); st.cloth -= sign(); const g = geo();
        // elektron uchib o'tadi: musbat tayoqcha — elektron tayoqchadan matoga, manfiy — matodan tayoqchaga
        st.fly.push({ from: sign() > 0 ? [...st.rod] : [g.cl[0] + (Math.random() - 0.5) * 60, g.cl[1]], to: sign() > 0 ? [g.cl[0] + (Math.random() - 0.5) * 60, g.cl[1]] : [...st.rod], t: 0 }); }
      info();
    }
    S.step = (dt) => {
      // elektroskop yaproqchalari: tanθ ~ q²
      const target = Math.min(1.0, 0.11 * Math.abs(st.es) ** 0.9 + (st.near ? 0.05 * Math.abs(st.q) : 0));
      st.om += ((target - st.th) * 60 - st.om * 6) * dt; st.th = Math.max(0, st.th + st.om * dt);
      st.fly.forEach((f) => (f.t += dt * 2.2)); st.fly = st.fly.filter((f) => f.t < 1);
      if (st.anim) { st.anim.t += dt; const a = st.anim, k = Math.min(1, a.t / a.T), e = k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) ** 2;
        st.rod = [a.a[0] + (a.b[0] - a.a[0]) * e, a.a[1] + (a.b[1] - a.a[1]) * e]; if (k >= 1) { const cb = a.cb; st.anim = null; cb && cb(); } }
      if (st.auto > 0) { st.auto -= dt; const g = geo(); const ph = st.auto * 9; const nx = g.cl[0] + Math.sin(ph) * 46; rub(Math.abs(nx - st.rod[0])); st.rod = [nx, g.cl[1] - 34]; if (st.auto <= 0) st.rod = restRod(); }
      const g = geo(); st.near = Math.hypot(st.rod[0] - g.es[0], st.rod[1] - (g.es[1] - 26)) < 70;
      if (st.spark > 0) st.spark -= dt;
    };
    function touch() {
      if (!st.q) { S.pop("Avval ishqalang!", S.W / 2, S.H * 0.3, { c: C.sub, size: 14 }); return; }
      const g = geo(), tgt = [g.es[0] - 4, g.es[1] - 40];
      st.home = false; st.anim = { a: [...st.rod], b: tgt, t: 0, T: 0.9, cb: () => {
        const tot = st.q + st.es; st.es = Math.round(tot / 2); st.q = tot - st.es; S.burst(g.es[0], g.es[1] - 30, 14, ["#60a5fa", "#facc15"], { sp: 60, g: 0 });
        S.pop("zaryad o‘tdi!", g.es[0], g.es[1] - 60, { c: C.v, size: 14 }); info();
        setTimeout(() => { st.anim = { a: [...st.rod], b: restRod(), t: 0, T: 0.9, cb: () => (st.home = true) }; }, 700);
      } };
    }
    function ground() {
      const g = geo(); if (st.es) { st.spark = 0.35; S.burst(g.es[0], g.es[1] - 26, 22, ["#facc15", "#fde68a", "#60a5fa"], { sp: 160, g: 0 }); S.pop("chirs!", g.es[0] + 30, g.es[1] - 40, { c: "#ca8a04" }); }
      st.es = 0; info();
    }
    S.draw = () => {
      S.bg(); const g = geo(), [nm, cn, , rc, cc] = PAIRS[st.pi];
      S.hatch(8, S.H - 14, S.W - 8, S.H - 14);
      // mato
      x.fillStyle = cc; x.beginPath(); x.roundRect ? x.roundRect(g.cl[0] - 70, g.cl[1] - 12, 140, 30, 8) : x.rect(g.cl[0] - 70, g.cl[1] - 12, 140, 30); x.fill();
      x.strokeStyle = "rgba(0,0,0,.25)"; x.lineWidth = 1; for (let i = 0; i < 14; i++) { x.beginPath(); x.moveTo(g.cl[0] - 66 + i * 10, g.cl[1] - 10); x.lineTo(g.cl[0] - 60 + i * 10, g.cl[1] + 16); x.stroke(); }
      S.text(cn, g.cl[0], g.cl[1] + 34, { size: 12, c: C.sub });
      for (let i = 0; i < Math.abs(st.cloth); i++) S.text(st.cloth > 0 ? "+" : "−", g.cl[0] - 60 + (i % 12) * 10.5, g.cl[1] + 4 + Math.floor(i / 12) * 10, { size: 13, c: st.cloth > 0 ? C.red : C.v, italic: false, font: K.SANS });
      // elektroskop
      const ex = g.es[0], ey = g.es[1];
      x.strokeStyle = C.sub; x.lineWidth = 1.5; x.beginPath(); x.arc(ex, ey + 70, 52, 0, 7); x.stroke(); x.fillStyle = "rgba(186,230,253,.18)"; x.fill();
      x.fillStyle = "#a16207"; x.fillRect(ex - 40, ey + 122, 80, 8);
      x.strokeStyle = "#78716c"; x.lineWidth = 4; x.beginPath(); x.moveTo(ex, ey - 22); x.lineTo(ex, ey + 70); x.stroke();
      x.fillStyle = "#facc15"; x.beginPath(); x.arc(ex, ey - 26, 10, 0, 7); x.fill(); x.strokeStyle = "#a16207"; x.lineWidth = 1; x.stroke();
      const L = 40, th = Math.min(1.1, st.th);
      x.strokeStyle = "#ca8a04"; x.lineWidth = 3; [-1, 1].forEach((s) => { x.beginPath(); x.moveTo(ex, ey + 56); x.lineTo(ex + s * Math.sin(th) * L, ey + 56 + Math.cos(th) * L); x.stroke(); });
      for (let i = 0; i < Math.min(10, Math.abs(st.es)); i++) { const s = i % 2 ? 1 : -1, k = 0.3 + (Math.floor(i / 2) / 5) * 0.7; S.text(st.es > 0 ? "+" : "−", ex + s * Math.sin(th) * L * k + s * 7, ey + 60 + Math.cos(th) * L * k, { size: 11, c: st.es > 0 ? C.red : C.v, italic: false, font: K.SANS }); }
      if (st.es && th > 0.05) { S.arrow(ex - Math.sin(th) * L - 4, ey + 56 + Math.cos(th) * L, ex - Math.sin(th) * L - 26, ey + 56 + Math.cos(th) * L, C.g, "", { w: 1.6 }); S.arrow(ex + Math.sin(th) * L + 4, ey + 56 + Math.cos(th) * L, ex + Math.sin(th) * L + 26, ey + 56 + Math.cos(th) * L, C.g, "", { w: 1.6 }); }
      S.text("elektroskop", ex, ey + 146, { size: 12, c: C.sub });
      // yerga ulash simi
      x.strokeStyle = st.spark > 0 ? "#facc15" : "rgba(87,83,78,.35)"; x.lineWidth = st.spark > 0 ? 3 : 1; x.setLineDash(st.spark > 0 ? [] : [4, 4]);
      x.beginPath(); x.moveTo(ex + 10, ey - 26); x.lineTo(ex + 80, ey - 26); x.lineTo(ex + 80, S.H - 14); x.stroke(); x.setLineDash([]);
      // uchayotgan elektronlar
      st.fly.forEach((f) => { const k = f.t, px = f.from[0] + (f.to[0] - f.from[0]) * k, py = f.from[1] + (f.to[1] - f.from[1]) * k - Math.sin(k * PI) * 18; x.fillStyle = C.v; x.beginPath(); x.arc(px, py, 3.5, 0, 7); x.fill(); S.text("e⁻", px + 8, py - 4, { size: 9, c: C.v }); });
      // tayoqcha
      const [rx, ry] = st.rod, RL = g.RL;
      if (st.pi === 3) { S.ball(rx, ry - 10, 26, "#fecaca", "#dc2626"); x.strokeStyle = C.sub; x.beginPath(); x.moveTo(rx, ry + 16); x.lineTo(rx, ry + 40); x.stroke(); }
      else { x.save(); x.translate(rx, ry); x.rotate(-0.12); x.fillStyle = rc; x.strokeStyle = "rgba(0,0,0,.35)"; x.lineWidth = 1; x.beginPath(); x.roundRect ? x.roundRect(-RL / 2, -8, RL, 16, 8) : x.rect(-RL / 2, -8, RL, 16); x.fill(); x.stroke(); x.restore(); }
      for (let i = 0; i < Math.abs(st.q); i++) S.text(sign() > 0 ? "+" : "−", rx - RL * 0.38 + (i % 12) * (RL * 0.065), ry + 4 - Math.floor(i / 12) * 11 - (st.pi === 3 ? 10 : 0), { size: 13, c: sign() > 0 ? C.red : "#bfdbfe", italic: false, font: K.SANS });
      S.text(nm, rx, ry - 20 - (st.pi === 3 ? 26 : 0), { size: 11, c: C.sub, bold: false, halo: true });
      S.hud(st.q ? `${nm}: q = ${st.q > 0 ? "+" : "−"}${Math.abs(st.q)}·10⁹ e` : "zaryadsiz", st.es ? `elektroskop: ${st.es > 0 ? "+" : "−"}${Math.abs(st.es)}·10⁹ e — yaproqchalar itarishadi` : "neytral jismlarda + va − teng", { dig: 1 });
    };
    S.hover = (pt) => Math.hypot(pt[0] - st.rod[0], pt[1] - st.rod[1]) < 70;
    S.pointer((pt) => { if (st.anim || Math.hypot(pt[0] - st.rod[0], pt[1] - st.rod[1]) > 80) return false; st.drag = true; st.home = false; st.last = pt; },
      (pt) => { const g = geo(); const dx = pt[0] - st.last[0], dy = pt[1] - st.last[1]; st.rod = [st.rod[0] + dx, st.rod[1] + dy]; st.last = pt;
        if (Math.abs(st.rod[1] - (g.cl[1] - 30)) < 30 && Math.abs(st.rod[0] - g.cl[0]) < 90) rub(Math.abs(dx));
        if (Math.hypot(st.rod[0] - g.es[0], st.rod[1] - (g.es[1] - 40)) < 24 && st.q) { st.drag = false; const tot = st.q + st.es; st.es = Math.round(tot / 2); st.q = tot - st.es; S.burst(g.es[0], g.es[1] - 30, 14, ["#60a5fa", "#facc15"], { sp: 60, g: 0 }); info(); } },
      () => { st.drag = false; st.anim = { a: [...st.rod], b: restRod(), t: 0, T: 0.6, cb: () => (st.home = true) }; });
    function info() {
      const [nm, cn, sg] = PAIRS[st.pi];
      S.out.innerHTML = S.f(`q = N·e,  e = 1,6·10⁻¹⁹ Kl`, "elementar zaryad") + (st.q || st.cloth
        ? `<p><b>${nm}</b> ${sg > 0 ? "elektron berib <b>musbat</b>" : "elektron olib <b>manfiy</b>"} zaryadlandi, <b>${cn}</b> esa teskari ishorali (${st.cloth > 0 ? "+" : "−"}${Math.abs(st.cloth)}). Yig‘indi: ${st.q + st.cloth + st.es === 0 ? "0" : st.q + st.cloth + st.es} — <b>zaryad saqlanadi</b>: u yo‘qdan paydo bo‘lmaydi, faqat bir jismdan ikkinchisiga o‘tadi.</p>`
        : `<p class="sl-hint">Tayoqchani mato ustida sudrab ishqalang (yoki “🤚 Ishqalash”). Keyin elektroskopga tekkizing — yaproqchalar bir xil zaryad olib itarishadi. “Yerga ulash” zaryadni olib ketadi.</p>`)
        + (st.es ? `<p class="sl-hint">Elektroskop yaproqchalari bir xil ishorali zaryadlangani uchun <b>itarishib</b> ochildi. Zaryad qancha ko‘p bo‘lsa, burchak shuncha katta.</p>` : "");
    }
    S.controls.append(buttons(PAIRS.map((q) => `${q[0]} + ${q[1]}`), (i) => { st.pi = i; reset(); }, 0),
      h("div", { class: "kn-row" }, button("🤚 Ishqalash", () => { if (!st.anim) { st.home = false; st.auto = 1.4; } }), button("👉 Elektroskopga tekkizish", touch), button("⏚ Yerga ulash", ground, "ghost"), button("↺", reset, "ghost")));
    reset();
  };

  // ===================================================================
  // 2. KULON QONUNI — ipga osilgan ikki sharcha, tegib zaryad almashadi
  // ===================================================================
  W.coulomb = (root, p) => {
    const S = K.scene(root, { title: p.title || "🧲 Kulon qonuni: ipga osilgan zaryadli sharchalar", aspect: 0.56, aspectMobile: 0.95, slow: false });
    const x = S.x, L = 0.5, M = 0.0005, RB = 0.012;
    const st = { q: [60, 60], d0: 0.12, th: [0, 0], om: [0, 0], tr: [], touched: 0, F: 0, rr: 0 };
    const pos = (i) => { const px = (i ? 1 : -1) * st.d0 / 2; return [px + L * Math.sin(st.th[i]), -L * Math.cos(st.th[i])]; };
    S.step = (dt) => {
      const a = pos(0), b = pos(1), dx = b[0] - a[0], dy = b[1] - a[1], rr = Math.max(2 * RB, Math.hypot(dx, dy));
      const F = (KE * st.q[0] * st.q[1] * 1e-18) / (rr * rr); st.F = F; st.rr = rr; // F>0 — itarish
      const ux = dx / rr, uy = dy / rr;
      [0, 1].forEach((i) => {
        const Fx = (i ? 1 : -1) * F * ux, Fy = (i ? 1 : -1) * F * uy; // i=1 ga +F·u, i=0 ga −F·u
        const th = st.th[i], tq = (Fx * Math.cos(th) + Fy * Math.sin(th)) / (M * L) - (G0 / L) * Math.sin(th);
        st.om[i] += (tq - 2.5 * st.om[i]) * dt; st.th[i] += st.om[i] * dt;
      });
      const a2 = pos(0), b2 = pos(1);
      if (Math.hypot(b2[0] - a2[0], b2[1] - a2[1]) < 2 * RB) {
        {
          if (st.q[0] !== st.q[1] && S.t - st.touched > 0.5) { const m = (st.q[0] + st.q[1]) / 2; st.q = [m, m]; st.touched = S.t; sync(); const g = geo(), c = g.X((a2[0] + b2[0]) / 2), cy = g.Y((a2[1] + b2[1]) / 2);
            S.burst(c, cy, 26, ["#facc15", "#fde68a", "#60a5fa"], { sp: 140, g: 0 }); S.pop("tegdi — zaryadlar tenglashdi!", c, cy - 30, { c: "#ca8a04", size: 14, life: 1.8 }); info(); }
        }
        // bir-biriga kirib ketmasin
        const ov = 2 * RB - Math.hypot(b2[0] - a2[0], b2[1] - a2[1]); st.th[0] -= ov / L / 2; st.th[1] += ov / L / 2; st.om = [st.om[0] * -0.3, st.om[1] * -0.3];
      }
      if (S.frame % 3 === 0) push(st.tr, [rr * 100, Math.abs(F) * 1000], 200);
    };
    const geo = () => { const ox = S.W < 560 ? S.W / 2 : S.W * 0.32, oy = 62, sc = (S.H * (S.W < 560 ? 0.52 : 0.74)) / L; return { ox, oy, sc, X: (v) => ox + v * sc, Y: (v) => oy - v * sc }; };
    S.draw = () => {
      S.bg(); const g = geo();
      S.hatch(g.X(-st.d0 / 2 - 0.08), g.oy, g.X(st.d0 / 2 + 0.08), g.oy, { up: true });
      const P = [pos(0), pos(1)];
      P.forEach((q, i) => { const px = (i ? 1 : -1) * st.d0 / 2; x.strokeStyle = C.ink; x.lineWidth = 1.2; x.beginPath(); x.moveTo(g.X(px), g.oy); x.lineTo(g.X(q[0]), g.Y(q[1])); x.stroke();
        x.setLineDash([3, 4]); x.strokeStyle = "rgba(87,83,78,.35)"; x.beginPath(); x.moveTo(g.X(px), g.oy); x.lineTo(g.X(px), g.Y(-L) + 10); x.stroke(); x.setLineDash([]); });
      P.forEach((q, i) => { const R = Math.max(9, RB * g.sc), qq = st.q[i];
        S.ball(g.X(q[0]), g.Y(q[1]), R, qq > 0 ? "#fee2e2" : qq < 0 ? "#dbeafe" : "#f5f5f4", qq > 0 ? "#dc2626" : qq < 0 ? "#2563eb" : "#78716c");
        S.text((qq > 0 ? "+" : "") + Math.round(qq), g.X(q[0]), g.Y(q[1]) + 4, { size: 10, c: "#fff", italic: false, font: K.SANS }); });
      // kuchlar
      const k = 70 / (M * G0);
      P.forEach((q, i) => { const o = P[1 - i], dx = q[0] - o[0], dy = q[1] - o[1], d = Math.hypot(dx, dy) || 1, f = st.F; const X0 = g.X(q[0]), Y0 = g.Y(q[1]);
        if (Math.abs(f) > 1e-7) S.arrow(X0, Y0, X0 + (dx / d) * f * k * (1), Y0 - (dy / d) * f * k, "#ca8a04", i ? "F" : "", { w: 2.2 });
        S.arrow(X0, Y0 + 10, X0, Y0 + 10 + M * G0 * k * 0.5, C.g, i ? "" : "mg", { w: 1.6, fs: 11 }); });
      const ang = (Math.abs(st.th[0]) + Math.abs(st.th[1])) / 2 * 180 / PI;
      S.hud(`F = ${r(Math.abs(st.F) * 1000, 2)} mN`, `${st.F > 0 ? "itarishadi" : st.F < 0 ? "tortishadi" : "kuch yo‘q"} · r = ${r(st.rr * 100, 1)} sm · og‘ish ≈ ${Math.round(ang)}°`, { dig: 1 });
      if (S.W >= 560) { const gw = Math.min(280, S.W * 0.36), gh = S.H * 0.42, gx = S.W - gw - 12;
        const th = []; const A = KE * Math.abs(st.q[0] * st.q[1]) * 1e-18; for (let rr = 2; rr <= 40; rr += 0.5) th.push([rr, (A / (rr / 100) ** 2) * 1000]);
        const G = S.graph(gx, 52, gw, gh, [{ d: th, c: "rgba(87,83,78,.6)", l: "F = kq₁q₂/r²" }], { xl: "r (sm)", yl: "F (mN)", xmin: 0, xmax: 40, ymin: 0, ymax: Math.max(2, A / 0.0004 * 1000 * 1.1) * 0.25 });
        const cx = G.X(st.rr * 100), cy = G.Y(Math.min(Math.abs(st.F) * 1000, Math.max(2, A / 0.0004 * 1000 * 1.1) * 0.25)); x.fillStyle = C.red; x.beginPath(); x.arc(cx, cy, 4.5, 0, 7); x.fill(); }
    };
    let sl = [];
    function sync() { sl[0].set(Math.round(st.q[0])); sl[1].set(Math.round(st.q[1])); }
    function info() {
      const F = Math.abs(st.F);
      S.out.innerHTML = S.f(`F = k·|q₁·q₂|/r² = 9·10⁹ · ${Math.abs(Math.round(st.q[0]))}·10⁻⁹ · ${Math.abs(Math.round(st.q[1]))}·10⁻⁹ / (${r(st.rr, 3)})² ≈ <b>${r(F * 1000, 2)} mN</b>`)
        + S.f(`tgα = F / mg`, "m = 0,5 g, ip uzunligi 50 sm")
        + `<p class="sl-hint">${!st.q[0] || !st.q[1] ? "Zaryadlardan biri nol — kuch yo‘q." : st.q[0] * st.q[1] < 0 ? "Har xil ishorali zaryadlar <b>tortishadi</b>. Sharchalar tegib ketsa, zaryadlar tenglashadi va ular endi itarishadi!" : "Bir xil ishorali zaryadlar <b>itarishadi</b>."} Masofa 2 marta ortsa, kuch 4 marta kamayadi.</p>`;
    }
    sl = [slider({ label: "q₁", min: -150, max: 150, step: 10, value: st.q[0], fmt: (v) => v + " nKl", onInput: (v) => { st.q[0] = v; info(); } }),
      slider({ label: "q₂", min: -150, max: 150, step: 10, value: st.q[1], fmt: (v) => v + " nKl", onInput: (v) => { st.q[1] = v; info(); } })];
    S.controls.append(...sl, slider({ label: "Osilish nuqtalari orasi", min: 2, max: 30, value: st.d0 * 100, fmt: (v) => v + " sm", onInput: (v) => { st.d0 = v / 100; info(); } }),
      h("div", { class: "kn-row" }, button("➕➕ Bir xil (itarish)", () => { st.q = [60, 60]; st.th = [0, 0]; st.om = [0, 0]; sync(); info(); }, "ghost"), button("➕➖ Har xil (tortishish)", () => { st.q = [60, -40]; st.th = [0, 0]; st.om = [0, 0]; sync(); info(); }, "ghost")), S.timeCtl({ slow: false }));
    setInterval(() => { if (S.cv.isConnected && S.visible) info(); }, 1200);
    info();
  };

  // ===================================================================
  // 3. ELEKTR MAYDON — kuch chiziqlari, sinov zaryadini qo'yib yuborish
  // ===================================================================
  W.efield = (root, p) => {
    const S = K.scene(root, { title: p.title || "🌐 Elektr maydon: zaryadlarni suring, sinov zaryadini qo‘yib yuboring", aspect: 0.6, aspectMobile: 0.95,
      tip: "👆 Zaryadlarni yoki sariq sinov zaryadini suring" });
    const x = S.x;
    const PRE = { "Bitta +": [[0, 0, 1]], "+ va −": [[-0.8, 0, 1], [0.8, 0, -1]], "+ va +": [[-0.8, 0, 1], [0.8, 0, 1]], "Yassi kondensator": Array.from({ length: 9 }, (_, i) => [-0.7, -0.96 + i * 0.24, 0.6]).concat(Array.from({ length: 9 }, (_, i) => [0.7, -0.96 + i * 0.24, -0.6])) };
    const names = Object.keys(PRE);
    const st = { pre: p.preset && PRE[p.preset] ? p.preset : "+ va −", Q: [], probe: [0, 0.7], drag: null, fly: null, trail: [], lines: null, key: "" };
    const set = (n) => { st.pre = n; st.Q = PRE[n].map((q) => [...q]); st.fly = null; st.trail = []; st.key = ""; };
    set(st.pre);
    const geo = () => { const sc = Math.min(S.W / 4.6, S.H / 3.2); return { sc, cx: S.W / 2, cy: S.H / 2 + 10 }; };
    const E = (px, py) => { let ex = 0, ey = 0; for (const [qx, qy, q] of st.Q) { const dx = px - qx, dy = py - qy, r2 = dx * dx + dy * dy + 0.004, r3 = r2 * Math.sqrt(r2); ex += (q * dx) / r3; ey += (q * dy) / r3; } return [ex, ey]; };
    function lines() {
      const key = JSON.stringify(st.Q) + S.W; if (key === st.key) return st.lines; st.key = key;
      const out = [], many = st.Q.length > 4;
      for (const [qx, qy, q] of st.Q) {
        if (q <= 0 && st.Q.some((z) => z[2] > 0)) continue;
        const n = many ? 2 : 16, sg = q > 0 ? 1 : -1;
        for (let i = 0; i < n; i++) {
          const a = many ? (i ? 0.25 : -0.25) : (i / n) * 2 * PI; let px = qx + 0.07 * Math.cos(a), py = qy + 0.07 * Math.sin(a); const ln = [[px, py]];
          for (let k = 0; k < 420; k++) { const [ex, ey] = E(px, py), m = Math.hypot(ex, ey) || 1; px += (sg * 0.016 * ex) / m; py += (sg * 0.016 * ey) / m; ln.push([px, py]);
            if (Math.abs(px) > 2.6 || Math.abs(py) > 1.8 || st.Q.some(([a2, b2, q2]) => q2 * q < 0 && Math.hypot(px - a2, py - b2) < 0.06)) break; }
          out.push(ln);
        }
      }
      return (st.lines = out);
    }
    S.step = (dt) => {
      const f = st.fly; if (!f) return;
      const [ex, ey] = E(f.x, f.y), k = 0.9; f.vx += ex * k * dt; f.vy += ey * k * dt;
      const sp = Math.hypot(f.vx, f.vy); if (sp > 4) { f.vx *= 4 / sp; f.vy *= 4 / sp; }
      f.x += f.vx * dt; f.y += f.vy * dt; S.ts = 0.6;
      if (S.frame % 1 === 0) push(st.trail, [f.x, f.y], 600);
      const hit = st.Q.find(([qx, qy, q]) => q < 0 && Math.hypot(f.x - qx, f.y - qy) < 0.09);
      const g = geo();
      if (hit) { S.burst(g.cx + hit[0] * g.sc, g.cy - hit[1] * g.sc, 22, ["#facc15", "#60a5fa"], { sp: 90, g: 0 }); S.pop("yetib bordi!", g.cx + hit[0] * g.sc, g.cy - hit[1] * g.sc - 22, { c: C.v, size: 13 }); st.fly = null; S.ts = 1; }
      else if (Math.abs(f.x) > 2.8 || Math.abs(f.y) > 2) { st.fly = null; S.ts = 1; S.pop("maydondan chiqib ketdi →", S.W / 2, S.H - 30, { c: C.sub, size: 13 }); }
    };
    S.draw = () => {
      S.bg(); const g = geo(), X = (v) => g.cx + v * g.sc, Y = (v) => g.cy - v * g.sc;
      // kuch chiziqlari
      x.strokeStyle = "rgba(37,99,235,.55)"; x.lineWidth = 1.2;
      lines().forEach((ln) => { x.beginPath(); ln.forEach(([a, b], i) => (i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b)))); x.stroke();
        const m = ln[Math.floor(ln.length * 0.45)], m2 = ln[Math.floor(ln.length * 0.45) + 1]; if (m && m2) S.arrow(X(m[0]), Y(m[1]), X(m2[0]) + (X(m2[0]) - X(m[0])) * 3, Y(m2[1]) + (Y(m2[1]) - Y(m[1])) * 3, "rgba(37,99,235,.7)", "", { w: 1.2, head: 7 }); });
      // iz
      if (st.trail.length > 1) { x.strokeStyle = "#ca8a04"; x.lineWidth = 2; x.beginPath(); st.trail.forEach(([a, b], i) => (i ? x.lineTo(X(a), Y(b)) : x.moveTo(X(a), Y(b)))); x.stroke(); }
      // zaryadlar
      const many = st.Q.length > 4;
      if (many) { [[-0.7, C.red], [0.7, C.v]].forEach(([px, c]) => { x.fillStyle = c; x.fillRect(X(px) - 5, Y(1.1), 10, Y(-1.1) - Y(1.1)); }); }
      st.Q.forEach(([qx, qy, q]) => { if (many) { S.text(q > 0 ? "+" : "−", X(qx) + (q > 0 ? -14 : 14), Y(qy) + 4, { size: 14, c: q > 0 ? C.red : C.v, italic: false, font: K.SANS }); return; }
        S.ball(X(qx), Y(qy), 15, q > 0 ? "#fecaca" : "#bfdbfe", q > 0 ? "#dc2626" : "#2563eb"); S.text(q > 0 ? "+" : "−", X(qx), Y(qy) + 5, { size: 16, c: "#fff", italic: false, font: K.SANS }); });
      // sinov zaryadi
      const pr = st.fly ? [st.fly.x, st.fly.y] : st.probe, [ex, ey] = E(pr[0], pr[1]), m = Math.hypot(ex, ey) || 1, Lr = Math.min(70, 16 + m * 10);
      S.ball(X(pr[0]), Y(pr[1]), 7, "#fef9c3", "#ca8a04");
      S.arrow(X(pr[0]), Y(pr[1]), X(pr[0]) + (ex / m) * Lr, Y(pr[1]) - (ey / m) * Lr, "#ca8a04", "E");
      S.hud(`E ≈ ${r(m * 9, 1)} kN/Kl`, st.fly ? "sinov zaryadi maydon kuchi ta’sirida harakatlanmoqda" : "sariq nuqta — musbat sinov zaryadi q₀", { dig: 1 });
    };
    const near = (pt) => { const g = geo(); const w = [(pt[0] - g.cx) / g.sc, -(pt[1] - g.cy) / g.sc];
      if (Math.hypot(w[0] - st.probe[0], w[1] - st.probe[1]) < 0.2) return "probe";
      if (st.Q.length <= 4) return st.Q.find((q) => Math.hypot(q[0] - w[0], q[1] - w[1]) < 0.25) || null; return null; };
    S.hover = (pt) => !!near(pt);
    S.pointer((pt) => { const n = near(pt); if (!n) return false; st.drag = n; st.fly = null; },
      (pt) => { const g = geo(), w = [Math.max(-2.3, Math.min(2.3, (pt[0] - g.cx) / g.sc)), Math.max(-1.6, Math.min(1.6, -(pt[1] - g.cy) / g.sc))];
        if (st.drag === "probe") st.probe = w; else { st.drag[0] = w[0]; st.drag[1] = w[1]; } st.trail = []; },
      () => (st.drag = null));
    function release() { st.trail = []; st.fly = { x: st.probe[0], y: st.probe[1], vx: 0, vy: 0 }; S.unpause && S.unpause(); }
    S.controls.append(buttons(names, (i) => set(names[i]), names.indexOf(st.pre)),
      h("div", { class: "kn-row" }, button("▶ Sinov zaryadini qo‘yib yuborish", release), button("🧹 Izni tozalash", () => (st.trail = []), "ghost")), S.timeCtl({ slow: false }));
    S.out.innerHTML = S.f(`E = F / q₀,  E = k·q / r²`) + `<p class="sl-hint">Kuch chiziqlari <b>musbat</b> zaryaddan chiqib, <b>manfiy</b>ga kiradi; chiziqlar zich joyda maydon kuchli. Sariq musbat sinov zaryadini qo‘yib yuboring — u maydon kuchi ta’sirida tezlanadi va manfiy zaryad tomon uchadi. Bir necha zaryad maydonlari <b>vektor sifatida qo‘shiladi</b> (superpozitsiya). Yassi kondensator ichida maydon bir jinsli — chiziqlar parallel.</p>`;
  };

  // ===================================================================
  // 4. ELEKTR ZANJIRI — lampochka, kalit, ampermetr/voltmetr, elektronlar oqimi, I(U)
  // ===================================================================
  W.circuit = (root, p) => {
    const S = K.scene(root, { title: p.title || "🔌 Elektr zanjiri: kalitni bosing, kuchlanish va qarshilikni o‘zgartiring", aspect: 0.58, aspectMobile: 1.0,
      tip: "👆 Kalitni bosib zanjirni ulang/uzing", slow: false });
    const x = S.x;
    const MODES = { single: "Bitta lampochka (Om qonuni)", series: "Ketma-ket", parallel: "Parallel", rheo: "Reostat bilan", cells: "Manbalarni ulash" };
    const st = { mode: p.mode || "single", U: 6, R1: 10, R2: 20, rh: 50, n: 1, conn: "series", on: true, ph: [0, 0, 0], needle: [0, 0], iu: [], burnt: false, heat: [0, 0] };
    function calc() {
      const off = !st.on || st.burnt;
      let o;
      if (st.mode === "single") o = { R: st.R1, U: st.U, parts: [[st.R1, st.U, st.U / st.R1]] };
      else if (st.mode === "series") { const R = st.R1 + st.R2, I = st.U / R; o = { R, U: st.U, parts: [[st.R1, I * st.R1, I], [st.R2, I * st.R2, I]] }; }
      else if (st.mode === "parallel") { const R = (st.R1 * st.R2) / (st.R1 + st.R2); o = { R, U: st.U, parts: [[st.R1, st.U, st.U / st.R1], [st.R2, st.U, st.U / st.R2]] }; }
      else if (st.mode === "rheo") { const Rr = (st.rh / 100) * 40, R = st.R1 + Rr, I = st.U / R; o = { R, U: st.U, parts: [[st.R1, I * st.R1, I], [Rr, I * Rr, I]] }; }
      else { const E = 1.5, ri = 0.5, Rl = 5, Et = st.conn === "series" ? E * st.n : E, rt = st.conn === "series" ? ri * st.n : ri / st.n, I = Et / (Rl + rt); o = { R: Rl, U: I * Rl, Et, rt, parts: [[Rl, I * Rl, I]] }; }
      o.I = o.parts.length === 2 && st.mode === "parallel" ? o.parts[0][2] + o.parts[1][2] : o.parts[0][2];
      if (off) { o.I = 0; o.parts = o.parts.map((q) => [q[0], 0, 0]); }
      return o;
    }
    const geo = () => { const m = S.W < 560, l = 34, rgt = m ? S.W - 34 : S.W * 0.6, t = m ? 104 : 70, b = m ? S.H * 0.62 : S.H - 54; return { l, rgt, t, b, m }; };
    S.step = (dt) => {
      const c = calc();
      st.ph[0] += c.I * dt * 60; if (c.parts[1]) st.ph[1] += c.parts[0][2] * dt * 60, st.ph[2] += c.parts[1][2] * dt * 60;
      const tgt = [c.I, st.mode === "cells" ? c.U : c.parts[0][1]];
      for (let i = 0; i < 2; i++) st.needle[i] += (tgt[i] - st.needle[i]) * Math.min(1, dt * 6);
      c.parts.forEach((q, i) => (st.heat[i] += ((q[1] * q[2]) - st.heat[i]) * Math.min(1, dt * 2)));
      if (st.mode === "single" && st.on && !st.burnt && st.U * st.U / st.R1 > 40) { st.burnt = true; const g = geo(); const lx = (g.l + g.rgt) / 2; S.burst(lx, g.t - 4, 40, ["#facc15", "#f97316", "#78716c"], { sp: 160 }); S.pop("PAQ! Lampochka kuydi", lx, g.t - 34, { c: C.red, size: 15, life: 2 }); info(); }
    };
    function lamp(cx, cy, P, burnt) {
      const gl = burnt ? 0 : Math.min(1, P / 12);
      if (gl > 0.02) { const gr = x.createRadialGradient(cx, cy, 2, cx, cy, 20 + gl * 50); gr.addColorStop(0, `rgba(253,224,71,${0.35 + gl * 0.6})`); gr.addColorStop(1, "rgba(253,224,71,0)"); x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, 20 + gl * 50, 0, 7); x.fill(); }
      x.fillStyle = burnt ? "rgba(120,113,108,.35)" : `rgba(255,251,235,${0.7 + gl * 0.3})`; x.strokeStyle = C.ink; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, 15, 0, 7); x.fill(); x.stroke();
      x.strokeStyle = burnt ? "#57534e" : gl > 0.05 ? "#f59e0b" : "#78716c"; x.lineWidth = 1.4; x.beginPath(); x.moveTo(cx - 8, cy + 6); for (let i = 0; i < 5; i++) x.lineTo(cx - 6 + i * 3, cy - 4 + (i % 2) * 5); if (!burnt) x.lineTo(cx + 8, cy + 6); x.stroke();
      x.strokeStyle = C.ink; x.lineWidth = 1; x.beginPath(); x.moveTo(cx - 10.6, cy - 10.6); x.lineTo(cx + 10.6, cy + 10.6); x.moveTo(cx + 10.6, cy - 10.6); x.lineTo(cx - 10.6, cy + 10.6); x.globalAlpha = 0.25; x.stroke(); x.globalAlpha = 1;
    }
    function resistor(cx, cy, w, txt, col, P) {
      const hot = Math.min(1, P / 15); x.fillStyle = `rgb(${250}, ${250 - hot * 140}, ${249 - hot * 200})`; x.strokeStyle = col; x.lineWidth = 2; x.fillRect(cx - w / 2, cy - 10, w, 20); x.strokeRect(cx - w / 2, cy - 10, w, 20);
      S.text(txt, cx, cy - 16, { size: 11, c: col, halo: true });
    }
    S.draw = () => {
      S.bg(); const g = geo(), c = calc(), mid = (g.l + g.rgt) / 2;
      const wire = (pts) => { x.strokeStyle = C.ink; x.lineWidth = 2.6; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); };
      // asosiy halqa (soat yo'nalishida: manba chapda pastdan yuqoriga)
      const loop = [[g.l, g.b], [g.l, g.t], [g.rgt, g.t], [g.rgt, g.b], [g.l, g.b]];
      wire(loop);
      const par = st.mode === "parallel", bx0 = mid - 70, bx1 = mid + 70, by = g.t + 64;
      if (par) wire([[bx0, g.t], [bx0, by], [bx1, by], [bx1, g.t]]);
      // kalit (pastki simda)
      const kx = g.l + (g.rgt - g.l) * 0.24, kb = g.b;
      x.fillStyle = C.paper; x.fillRect(kx - 22, kb - 4, 44, 8);
      x.fillStyle = C.ink; x.beginPath(); x.arc(kx - 18, kb, 3.5, 0, 7); x.arc(kx + 18, kb, 3.5, 0, 7); x.fill();
      const ka = st.on ? 0 : -0.6; x.strokeStyle = C.ink; x.lineWidth = 3; x.beginPath(); x.moveTo(kx - 18, kb); x.lineTo(kx - 18 + Math.cos(ka) * 36, kb + Math.sin(ka) * 36); x.stroke();
      S.text(st.on ? "kalit: ulangan" : "kalit: uzilgan", kx, kb + 22, { size: 10, c: st.on ? "#15803d" : C.red, bold: false });
      // elektronlar (tokka teskari: manfiydan → musbatga)
      x.fillStyle = "#2563eb";
      const eloop = loop.slice().reverse(), Lm = polyLen(eloop), N = Math.round(Lm / 16);
      for (let k = 0; k < N; k++) { const [ex, ey] = along(eloop, (k / N) * Lm + st.ph[0]); if (par && ey === g.t && ex > bx0 + 1 && ex < bx1 - 1) continue; if (Math.abs(ex - kx) < 22 && Math.abs(ey - kb) < 6) continue; x.beginPath(); x.arc(ex, ey, 2.4, 0, 7); x.fill(); }
      if (par) { [[[bx1, g.t], [bx0, g.t]], [[bx1, g.t], [bx1, by], [bx0, by], [bx0, g.t]]].forEach((pl, i) => { const L = polyLen(pl), n = Math.round(L / 16); for (let k = 0; k < n; k++) { const [ex, ey] = along(pl, ((k / n) * L + st.ph[1 + i]) % L); x.beginPath(); x.arc(ex, ey, 2.4, 0, 7); x.fill(); } }); }
      // tok yo'nalishi
      if (c.I > 0) { S.arrow(g.rgt + 14, g.t + 30, g.rgt + 14, g.t + 64, C.red, "I", { w: 1.6, fs: 12 }); S.text("e⁻", g.l - 16, g.t + 44, { size: 11, c: "#2563eb" }); }
      // manba
      const sy = (g.t + g.b) / 2, cells = st.mode === "cells" ? st.n : 1;
      x.fillStyle = C.paper; x.fillRect(g.l - 14, sy - 12 * cells - 8, 28, 24 * cells + 16);
      for (let i = 0; i < cells; i++) { const yy = sy - 12 * cells + i * 24 + 6; x.strokeStyle = C.ink; x.lineWidth = 2.5; x.beginPath(); x.moveTo(g.l - 14, yy); x.lineTo(g.l + 14, yy); x.stroke(); x.lineWidth = 5; x.beginPath(); x.moveTo(g.l - 7, yy + 9); x.lineTo(g.l + 7, yy + 9); x.stroke(); }
      if (st.mode === "cells" && st.conn === "parallel" && st.n > 1) S.text("parallel", g.l + 22, sy + 4, { size: 10, align: "left", c: C.sub, bold: false });
      S.text("+", g.l - 20, sy - 12 * cells, { size: 13, c: C.red, italic: false, font: K.SANS }); S.text(st.mode === "cells" ? `${st.conn === "series" ? st.n * 1.5 : 1.5} V` : `${st.U} V`, g.l + 24, sy - 12 * cells - 2, { size: 12, align: "left", c: C.ink });
      // iste'molchilar
      if (st.mode === "single" || st.mode === "cells") lamp(mid, g.t, c.parts[0][1] * c.parts[0][2] * (st.mode === "cells" ? 4 : 1), st.burnt);
      if (st.mode === "single") S.text(`R = ${st.R1} Ω`, mid, g.t + 34, { size: 11, c: C.sub });
      if (st.mode === "series" || st.mode === "rheo") { resistor(mid - 60, g.t, 56, `R₁ = ${st.R1} Ω`, "#c2410c", st.heat[0]); resistor(mid + 60, g.t, 56, st.mode === "rheo" ? `${r((st.rh / 100) * 40, 0)} Ω` : `R₂ = ${st.R2} Ω`, "#7c3aed", st.heat[1]);
        if (st.mode === "rheo") { const sx = mid + 60 - 28 + (st.rh / 100) * 56; x.strokeStyle = "#7c3aed"; x.lineWidth = 2; x.beginPath(); x.moveTo(sx, g.t - 26); x.lineTo(sx, g.t - 11); x.stroke(); x.beginPath(); x.moveTo(sx - 4, g.t - 16); x.lineTo(sx, g.t - 11); x.lineTo(sx + 4, g.t - 16); x.stroke(); } }
      if (par) { resistor(mid, g.t, 56, `R₁ = ${st.R1} Ω`, "#c2410c", st.heat[0]); resistor(mid, by, 56, `R₂ = ${st.R2} Ω`, "#7c3aed", st.heat[1]); }
      // ampermetr (o'ng simda), voltmetr (R1 ga parallel — yuqorida)
      const amax = st.mode === "cells" ? 1.5 : st.mode === "parallel" ? 4 : 2.5;
      gauge(S, g.rgt, (g.t + g.b) / 2 + 10, 22, st.needle[0], amax, "A", `${r(c.I, 3)} A`, "#15803d");
      const vx = st.mode === "single" || st.mode === "cells" ? mid : par ? mid : mid - 60, vy = g.t - 40;
      if (!g.m || true) { x.setLineDash([3, 3]); x.strokeStyle = "rgba(28,25,23,.45)"; x.lineWidth = 1; x.beginPath(); x.moveTo(vx - 30, g.t); x.lineTo(vx - 30, vy); x.lineTo(vx - 18, vy); x.moveTo(vx + 18, vy); x.lineTo(vx + 30, vy); x.lineTo(vx + 30, g.t); x.stroke(); x.setLineDash([]);
        gauge(S, vx, vy, 17, st.needle[1], st.mode === "cells" ? 6 : 24, "V", "", "#b91c1c"); S.text(`${r(st.mode === "cells" ? c.U : c.parts[0][1], 2)} V`, vx + 40, vy + 4, { size: 11, align: "left", c: "#b91c1c", halo: true }); }
      S.hud(`I = ${r(c.I, 3)} A`, !st.on ? "zanjir uzilgan — tok yo‘q" : st.burnt ? "lampochka kuygan — zanjir uzildi" : `R = ${r(c.R, 2)} Ω · P = ${r(c.I * (st.mode === "cells" ? c.U : c.U), 2)} W`, { dig: 1 });
      // I(U) grafigi (faqat Om qonuni rejimida) yoki ustunlar
      if (!g.m || st.mode === "single") {
        const gw = g.m ? S.W - 24 : Math.min(280, S.W - g.rgt - 40), gh = g.m ? S.H * 0.28 : S.H * 0.5, gx = g.m ? 12 : S.W - gw - 12, gy = g.m ? S.H - gh - 8 : 56;
        if (st.mode === "single") { const G = S.graph(gx, gy, gw, gh, [{ d: [[0, 0], [24, 24 / st.R1]], c: "rgba(87,83,78,.45)", dash: [4, 4], l: `I = U/${st.R1}` }], { xl: "U (V)", yl: "I (A)", xmin: 0, xmax: 24, ymin: 0, ymax: 2.6 });
          st.iu.forEach(([u, i, rr]) => { x.fillStyle = rr === st.R1 ? C.red : "rgba(185,28,28,.3)"; x.beginPath(); x.arc(G.X(u), G.Y(Math.min(2.6, i)), 3.5, 0, 7); x.fill(); }); }
        else if (!g.m) { const P = c.parts; S.bars(gx + 40, gy + gh, gh - 30, P.map((q, i) => ({ v: q[1], c: i ? "#7c3aed" : "#c2410c", l: i ? "U₂" : "U₁" })).concat(P.map((q, i) => ({ v: q[2] * 10, c: i ? "#a78bfa" : "#fb923c", l: i ? "I₂·10" : "I₁·10" }))), { max: Math.max(st.U, 1), title: st.mode === "cells" ? "U, V" : "kuchlanish (V) va tok (A·10)", bw: 22 }); }
      }
    };
    S.pointer((pt) => { const g = geo(), kx = g.l + (g.rgt - g.l) * 0.24; if (Math.hypot(pt[0] - kx, pt[1] - g.b) < 40) { st.on = !st.on; info(); return false; } return false; });
    S.hover = (pt) => { const g = geo(), kx = g.l + (g.rgt - g.l) * 0.24; return Math.hypot(pt[0] - kx, pt[1] - g.b) < 40; };
    function rec() { if (st.mode === "single" && st.on && !st.burnt) { const I = st.U / st.R1; if (!st.iu.some((q) => q[0] === st.U && q[2] === st.R1)) st.iu.push([st.U, I, st.R1]); if (st.iu.length > 60) st.iu.shift(); } }
    function info() {
      const c = calc(); rec();
      S.out.innerHTML = st.mode === "cells"
        ? S.f(`I = E / (R + r) = ${r(c.Et, 2)} / (${c.R} + ${r(c.rt, 2)}) = <b>${r(c.I, 3)} A</b>`) + `<p class="sl-hint">${st.conn === "series" ? "Ketma-ket: EYuKlar qo‘shiladi (E = n·E₁), ichki qarshilik ham ortadi (r = n·r₁) — lampochka yorqinroq." : "Parallel: EYuK o‘zgarmaydi, ichki qarshilik n marta kamayadi — batareya uzoqroq ishlaydi."}</p>`
        : S.f(`I = U / R = ${st.U} / ${r(c.R, 2)} = <b>${r(st.on && !st.burnt ? st.U / c.R : 0, 3)} A</b>`, !st.on ? "kalit uzilgan" : "")
          + c.parts.map(([R, u, i], k) => S.f(`${st.mode === "single" ? "Lampochka" : ["R₁", "R₂"][k]} = ${r(R, 1)} Ω:  U = ${r(u, 2)} V,  I = ${r(i, 3)} A,  P = UI = ${r(u * i, 2)} W`)).join("")
          + `<p class="sl-hint">${st.mode === "series" ? "Ketma-ket: tok hamma joyda bir xil, kuchlanishlar qo‘shiladi, R = R₁ + R₂." : st.mode === "parallel" ? "Parallel: kuchlanish bir xil, toklar qo‘shiladi, 1/R = 1/R₁ + 1/R₂ — umumiy qarshilik eng kichigidan ham kichik." : st.mode === "rheo" ? "Reostat surgichi qarshilikni o‘zgartiradi — tok kuchi rostlanadi." : st.burnt ? "Quvvat 40 W dan oshdi — lampochka spirali eriydi va zanjir uziladi. “↺ Yangi lampochka” ni bosing." : "Kuchlanishni o‘zgartiring — har bir o‘lchov I(U) grafigiga nuqta bo‘lib tushadi. Nuqtalar to‘g‘ri chiziqda yotadi: Om qonuni! Lampochka quvvati 40 W dan oshsa kuyadi."}</p>`;
    }
    function render() {
      S.controls.innerHTML = "";
      if (!p.mode) S.controls.append(buttons(Object.values(MODES), (i) => { st.mode = Object.keys(MODES)[i]; st.burnt = false; render(); }, Object.keys(MODES).indexOf(st.mode)));
      if (st.mode !== "cells") S.controls.append(slider({ label: "Kuchlanish U", min: 1, max: 24, value: st.U, fmt: (v) => v + " V", onInput: (v) => { st.U = v; info(); } }),
        slider({ label: st.mode === "single" ? "Lampochka qarshiligi R" : "R₁", min: 1, max: 50, value: st.R1, fmt: (v) => v + " Ω", onInput: (v) => { st.R1 = v; info(); } }));
      if (st.mode === "series" || st.mode === "parallel") S.controls.append(slider({ label: "R₂", min: 1, max: 50, value: st.R2, fmt: (v) => v + " Ω", onInput: (v) => { st.R2 = v; info(); } }));
      if (st.mode === "rheo") S.controls.append(slider({ label: "Reostat surgichi", min: 0, max: 100, value: st.rh, fmt: (v) => `${r((v / 100) * 40, 0)} Ω`, onInput: (v) => { st.rh = v; info(); } }));
      if (st.mode === "cells") S.controls.append(slider({ label: "Elementlar soni", min: 1, max: 4, value: st.n, onInput: (v) => { st.n = v; info(); } }), buttons(["Ketma-ket", "Parallel"], (i) => { st.conn = ["series", "parallel"][i]; info(); }, st.conn === "series" ? 0 : 1));
      S.controls.append(h("div", { class: "kn-row" }, button("🔘 Kalit", () => { st.on = !st.on; info(); }), st.mode === "single" ? button("↺ Yangi lampochka", () => { st.burnt = false; info(); }, "ghost") : "", st.mode === "single" ? button("🧹 Grafikni tozalash", () => { st.iu = []; info(); }, "ghost") : ""));
      info();
    }
    render();
  };

  // ===================================================================
  // 5. KONDENSATOR — RC zaryadlash, lampochka orqali chaqnab razryad
  // ===================================================================
  W.capacitor = (root, p) => {
    const S = K.scene(root, { title: p.title || "🔋 Kondensator: zaryadlang, so‘ng lampochka orqali razryadlang", aspect: 0.58, aspectMobile: 1.0 });
    const x = S.x, RC_R = 1e6, RL = 2e5; // zaryadlash 1 MΩ, razryad lampochka 200 kΩ
    const EPS = [["Havo", 1], ["Qog‘oz", 2.2], ["Shisha", 7], ["Suv", 81]];
    const st = { mode: 0, A: 100, d: 2, eps: 1, U: 12, q: 0, sw: 0, tr: [[], []], Q: 0, C1: 4, C2: 6 }; // sw: 0 — uzilgan, 1 — manbaga, 2 — lampochkaga
    const Cap = () => (st.eps * 8.854e-12 * st.A * 1e-4) / (st.d * 1e-3);
    const TS = () => 1 / (Cap() * RC_R) / 1.2; // simulyatsiya: 1 s ekranda ≈ 1,2·τ
    let simT = 0;
    S.step = (dt) => {
      if (st.mode) return;
      const C_ = Cap(), Uc = st.q / C_, k = 1.2 * C_ * (st.sw === 2 ? RL : RC_R); const h0 = dt * k; // haqiqiy soniya
      let I = 0;
      if (st.sw === 1) { I = (st.U - Uc) / RC_R; st.q += I * h0; }
      else if (st.sw === 2) { I = -Uc / RL; st.q += I * h0; st.Q += (Uc * Uc / RL) * h0; if (Math.abs(st.q) < 1e-18) st.q = 0; }
      simT += h0;
      if (S.frame % 2 === 0) { push(st.tr[0], [simT * 1e6, st.q / C_], 800); push(st.tr[1], [simT * 1e6, (I / (st.U / (st.sw === 2 ? RL : RC_R))) * st.U], 800); }
      st.I = I;
    };
    function setSw(v) { st.sw = v; st.tr = [[], []]; simT = 0; if (v === 2) st.Q = 0; S.t = 0; S.unpause && S.unpause(); info(); }
    S.draw = () => {
      S.bg();
      if (st.mode) return drawCmp();
      const m = S.W < 560, C_ = Cap(), Uc = st.q / C_, cx = m ? S.W * 0.5 : S.W * 0.3, cy = m ? S.H * 0.34 : S.H * 0.52;
      const w = 50 + st.A * 0.8, gap = 16 + st.d * 11;
      // simlar va kalit
      const top = cy - gap / 2 - 30, bot = cy + gap / 2 + 30, L = cx - Math.min(180, S.W * 0.24), R = cx + Math.min(180, S.W * 0.24);
      x.strokeStyle = C.ink; x.lineWidth = 2.4; x.beginPath(); x.moveTo(cx, cy - gap / 2 - 8); x.lineTo(cx, top); x.lineTo(L, top); x.lineTo(L, cy - 4); x.moveTo(L, cy + 5); x.lineTo(L, bot); x.lineTo(cx, bot); x.lineTo(cx, cy + gap / 2 + 8);
      x.moveTo(cx, top); x.lineTo(R, top); x.lineTo(R, cy - 14); x.moveTo(R, cy + 14); x.lineTo(R, bot); x.lineTo(cx, bot); x.stroke();
      // manba (chap)
      x.lineWidth = 2.5; x.beginPath(); x.moveTo(L - 12, cy - 4); x.lineTo(L + 12, cy - 4); x.stroke(); x.lineWidth = 5; x.beginPath(); x.moveTo(L - 6, cy + 5); x.lineTo(L + 6, cy + 5); x.stroke();
      S.text(`${st.U} V`, L - 16, cy + 4, { size: 12, align: "right", c: C.ink });
      const swDraw = (sx, y1, y2, on, lb) => { x.fillStyle = C.paper; x.fillRect(sx - 6, y1, 12, y2 - y1); x.fillStyle = C.ink; x.beginPath(); x.arc(sx, y1, 3, 0, 7); x.arc(sx, y2, 3, 0, 7); x.fill();
        x.strokeStyle = on ? "#15803d" : C.ink; x.lineWidth = 2.6; x.beginPath(); x.moveTo(sx, y2); x.lineTo(sx + (on ? 0 : 16), y1 + (on ? 0 : 6)); x.stroke(); S.text(lb, sx + 20, (y1 + y2) / 2 + 4, { size: 11, align: "left", c: on ? "#15803d" : C.sub }); };
      swDraw(L, cy + 18, cy + 40, st.sw === 1, "K₁ (zaryad)");
      // lampochka o'ngda
      const P = st.sw === 2 ? (Uc * Uc) / RL : 0, gl = Math.min(1, P / ((st.U * st.U) / RL) * 1.2);
      if (gl > 0.02) { const gr = x.createRadialGradient(R, cy, 2, R, cy, 20 + gl * 60); gr.addColorStop(0, `rgba(253,224,71,${0.3 + gl * 0.7})`); gr.addColorStop(1, "rgba(253,224,71,0)"); x.fillStyle = gr; x.beginPath(); x.arc(R, cy, 20 + gl * 60, 0, 7); x.fill(); }
      x.fillStyle = `rgba(255,251,235,${0.8 + gl * 0.2})`; x.strokeStyle = C.ink; x.lineWidth = 1.5; x.beginPath(); x.arc(R, cy, 14, 0, 7); x.fill(); x.stroke();
      x.strokeStyle = gl > 0.05 ? "#f59e0b" : "#78716c"; x.beginPath(); x.moveTo(R - 7, cy + 5); for (let i = 0; i < 5; i++) x.lineTo(R - 5 + i * 2.5, cy - 4 + (i % 2) * 5); x.lineTo(R + 7, cy + 5); x.stroke();
      swDraw(R, cy + 26, cy + 48, st.sw === 2, "K₂ (razryad)");
      // plastinkalar va zaryadlar
      x.fillStyle = "#b91c1c"; x.fillRect(cx - w / 2, cy - gap / 2 - 8, w, 8); x.fillStyle = "#1d4ed8"; x.fillRect(cx - w / 2, cy + gap / 2, w, 8);
      if (st.eps > 1) { x.fillStyle = "rgba(250,204,21,.28)"; x.fillRect(cx - w / 2, cy - gap / 2, w, gap); S.text(EPS.find((e) => e[1] === st.eps)[0], cx + w / 2 + 6, cy + 4, { size: 10, align: "left", c: "#a16207", bold: false }); }
      const fill = Math.min(1, Math.abs(Uc) / Math.max(1, st.U)), nq = Math.round(fill * 12);
      for (let i = 0; i < nq; i++) { const px = cx - w / 2 + ((i + 0.5) * w) / 12; S.text("+", px, cy - gap / 2 - 11, { size: 11, c: C.red, italic: false, font: K.SANS }); S.text("−", px, cy + gap / 2 + 20, { size: 11, c: C.v, italic: false, font: K.SANS });
        x.strokeStyle = "rgba(37,99,235,.45)"; x.lineWidth = 1; x.beginPath(); x.moveTo(px, cy - gap / 2 + 1); x.lineTo(px, cy + gap / 2 - 1); x.stroke(); }
      // elektronlar oqimi
      if (Math.abs(st.I || 0) > 1e-9) { const sp = Math.min(3, Math.abs(st.I) / (st.U / RC_R) + 0.2), dir = st.sw === 1 ? 1 : -1, ph = (S.t * 60 * sp) % 20;
        const path = st.sw === 1 ? [[cx, bot], [L, bot], [L, top], [cx, top]] : [[cx, top], [R, top], [R, bot], [cx, bot]];
        const Ln = polyLen(path); x.fillStyle = "#2563eb"; for (let d = 0; d < Ln; d += 20) { const [ex, ey] = along(path, d + ph * dir); x.beginPath(); x.arc(ex, ey, 2.3, 0, 7); x.fill(); } }
      S.hud(`U_C = ${r(Uc, 2)} V`, `q = CU = ${r(st.q * 1e9, 3)} nKl · C = ${r(C_ * 1e12, 1)} pF · τ = RC = ${r(C_ * RC_R * 1e6, 1)} mks`, { dig: 2 });
      S.text(`sekinlashtirilgan ×1/${Math.round(1 / (Cap() * (st.sw === 2 ? RL : RC_R)) / 1.2).toLocaleString("ru")}`, 12, 40, { size: 10, align: "left", c: C.sub, bold: false, font: K.SANS, italic: false });
      const gw = m ? S.W - 24 : Math.min(300, S.W * 0.38), gh = m ? S.H * 0.3 : S.H * 0.38, gx = S.W - gw - 12, gy = m ? S.H - gh - 8 : 56;
      S.graph(gx, gy, gw, gh, [{ d: st.tr[0], c: C.red, l: "U_C (V)" }, { d: st.tr[1], c: "#2563eb", l: "I (nisbiy)" }], { xl: "t (mks)", sym: true, ymin: -st.U * 1.1, ymax: st.U * 1.1 });
      if (!m) S.bars(gx + 40, gy + gh + 110, 70, [{ v: 0.5 * C_ * Uc * Uc * 1e9, c: C.e2, l: "W" }, { v: st.Q * 1e9, c: C.e1, l: "Q" }], { max: 0.5 * C_ * st.U * st.U * 1e9 || 1, title: "energiya (nJ)" });
    };
    function drawCmp() {
      const m = S.W < 560, ser = (st.C1 * st.C2) / (st.C1 + st.C2), par = st.C1 + st.C2;
      const cap = (cx, cy, c, col, vertical) => { const w = 16 + c * 3; x.fillStyle = col; if (vertical) { x.fillRect(cx - w / 2, cy - 7, w, 4); x.fillRect(cx - w / 2, cy + 3, w, 4); } S.text(`${c} mkF`, cx + w / 2 + 6, cy + 4, { size: 11, align: "left", c: col }); };
      const half = m ? S.W : S.W / 2;
      [[0, "PARALLEL", `C = C₁ + C₂ = ${r(par, 2)} mkF`], [1, "KETMA-KET", `1/C = 1/C₁ + 1/C₂ → C = ${r(ser, 2)} mkF`]].forEach(([i, t, f]) => {
        const ox = m ? 0 : i * half, oy = m ? i * S.H * 0.5 : 0, hh = m ? S.H * 0.5 : S.H, cx = ox + half / 2, cy = oy + hh * 0.5;
        S.text(t, cx, oy + 28, { size: 14, c: C.ink }); S.text(f, cx, oy + hh - 18, { size: 13, c: C.red });
        x.strokeStyle = C.ink; x.lineWidth = 2;
        if (!i) { x.beginPath(); x.moveTo(cx - 90, cy); x.lineTo(cx - 50, cy); x.moveTo(cx - 50, cy - 30); x.lineTo(cx - 50, cy + 30); x.moveTo(cx + 50, cy - 30); x.lineTo(cx + 50, cy + 30); x.moveTo(cx + 50, cy); x.lineTo(cx + 90, cy);
          x.moveTo(cx - 50, cy - 30); x.lineTo(cx, cy - 30); x.moveTo(cx - 50, cy + 30); x.lineTo(cx, cy + 30); x.moveTo(cx, cy - 30); x.lineTo(cx + 50, cy - 30); x.moveTo(cx, cy + 30); x.lineTo(cx + 50, cy + 30); x.stroke();
          [[cx, cy - 30, st.C1, "#c2410c"], [cx, cy + 30, st.C2, "#7c3aed"]].forEach(([a, b, c, col]) => { const w = 14 + c * 2.2; x.fillStyle = C.paper; x.fillRect(a - 5, b - w / 2, 10, w); x.fillStyle = col; x.fillRect(a - 6, b - w / 2, 4, w); x.fillRect(a + 2, b - w / 2, 4, w); S.text(`${c} mkF`, a, b - w / 2 - 6, { size: 11, c: col }); }); }
        else { x.beginPath(); x.moveTo(cx - 100, cy); x.lineTo(cx + 100, cy); x.stroke();
          [[cx - 40, cy, st.C1, "#c2410c"], [cx + 40, cy, st.C2, "#7c3aed"]].forEach(([a, b, c, col]) => { const w = 14 + c * 2.2; x.fillStyle = C.paper; x.fillRect(a - 5, b - w / 2, 10, w); x.fillStyle = col; x.fillRect(a - 6, b - w / 2, 4, w); x.fillRect(a + 2, b - w / 2, 4, w); S.text(`${c} mkF`, a, b - w / 2 - 6, { size: 11, c: col }); }); }
      });
      void cap;
    }
    function info() {
      if (st.mode) { S.out.innerHTML = `<p class="sl-hint">Parallel ulanganda sig‘imlar qo‘shiladi (plastinka yuzi ortgandek). Ketma-ket ulanganda umumiy sig‘im eng kichigidan ham kichik bo‘ladi (oraliq ortgandek), lekin batareya katta kuchlanishga chidaydi.</p>`; return; }
      const C_ = Cap();
      S.out.innerHTML = S.f(`C = εε₀S/d = ${st.eps}·8,85·10⁻¹²·${r(st.A * 1e-4, 4)}/${r(st.d * 1e-3, 4)} = <b>${r(C_ * 1e12, 1)} pF</b>`)
        + S.f(`q = CU = ${r(C_ * st.U * 1e9, 3)} nKl,  W = CU²/2 = ${r(0.5 * C_ * st.U * st.U * 1e9, 2)} nJ`)
        + S.f(`τ = RC = 1 MΩ · ${r(C_ * 1e12, 1)} pF = ${r(C_ * RC_R * 1e6, 1)} mks`, "zaryadlanish vaqti doimiysi")
        + `<p class="sl-hint">K₁ ni ulang — kondensator <b>eksponensial</b> zaryadlanadi: avval tok katta, U_C → U bo‘lganda tok nolga intiladi. Keyin K₂ — energiya lampochkaga o‘tib, u chaqnaydi (fotoaparat chirog‘i shunday ishlaydi). Dielektrik qo‘ysangiz, sig‘im ε marta ortadi va kondensator qo‘shimcha zaryad oladi.</p>`;
    }
    function render() {
      S.controls.innerHTML = ""; S.controls.append(buttons(["Zaryadlash va razryad", "Ulash: parallel va ketma-ket"], (i) => { st.mode = i; render(); }, st.mode));
      if (!st.mode) S.controls.append(h("div", { class: "kn-row" }, button("🔋 K₁: zaryadlash", () => setSw(1)), button("💡 K₂: lampochkaga razryad", () => setSw(2)), button("⭘ Kalitlarni uzish", () => setSw(0), "ghost")),
        slider({ label: "Plastinka yuzi S", min: 20, max: 200, value: st.A, fmt: (v) => v + " sm²", onInput: (v) => { st.A = v; info(); } }),
        slider({ label: "Oraliq d", min: 0.5, max: 6, step: 0.5, value: st.d, fmt: (v) => r(v, 1) + " mm", onInput: (v) => { st.d = v; info(); } }),
        slider({ label: "Manba kuchlanishi U", min: 1, max: 24, value: st.U, fmt: (v) => v + " V", onInput: (v) => { st.U = v; info(); } }),
        buttons(EPS.map((e) => e[0]), (i) => { st.eps = EPS[i][1]; info(); }, EPS.findIndex((e) => e[1] === st.eps)), S.timeCtl({ slow: false }));
      else S.controls.append(slider({ label: "C₁", min: 1, max: 20, value: st.C1, fmt: (v) => v + " mkF", onInput: (v) => { st.C1 = v; } }), slider({ label: "C₂", min: 1, max: 20, value: st.C2, fmt: (v) => v + " mkF", onInput: (v) => { st.C2 = v; } }));
      info();
    }
    render();
  };
})();
