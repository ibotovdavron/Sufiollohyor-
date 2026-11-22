/* KINO — “Rogatka” uslubidagi kinoviy jonli tajribalar uchun umumiy dvigatel.
   Qog‘oz fonli HiDPI sahna, vaqt (t), sekin harakat (×1/k), pauza/qadam, jonli grafik, vektorlar,
   uchqunlar, HUD va yakuniy energiya ustunlari. Tajribalar: w-kino-*.js */
(() => {
  "use strict";
  const { h, buttons, button, frame } = window.AK;
  const C = {
    paper: "#f4f1e8", ink: "#1c1917", sub: "#57534e", grid: "rgba(87,83,78,.12)", red: "#b91c1c",
    v: "#2563eb", g: "#dc2626", n: "#0891b2", f: "#16a34a", t: "#7c3aed", e1: "#f59e0b", e2: "#2563eb", e3: "#dc2626",
  };
  const SERIF = "Georgia, 'Times New Roman', serif", MONO = "ui-monospace, Menlo, monospace", SANS = "Inter, system-ui, sans-serif";

  /** Sahna yaratish. opt: {title, aspect, aspectMobile, tip, slow:true, onPointer} */
  function scene(root, opt = {}) {
    const { stage, controls, out } = frame(root, opt.title);
    stage.classList.add("kn-stage");
    const cv = h("canvas", { class: "kn-cv", "aria-label": opt.label || "Jonli tajriba" });
    const tip = h("div", { class: "kn-tip" }, opt.tip || "");
    if (!opt.tip) tip.hidden = true; else setTimeout(() => (tip.hidden = true), 6000);
    stage.append(cv, tip);
    const x = cv.getContext("2d");
    const S = { cv, x, stage, controls, out, tip, W: 340, H: 220, DPR: 1, t: 0, ts: 1, paused: false, slow: opt.slow !== false,
      visible: true, step: null, draw: null, parts: [], pops: [], C, SERIF, MONO, SANS, onSize: null, frame: 0 };
    function size() {
      const r = stage.getBoundingClientRect(); S.DPR = Math.min(2, window.devicePixelRatio || 1);
      S.W = Math.max(280, r.width || 340);
      S.H = Math.round(S.W * (S.W < 560 ? opt.aspectMobile || (opt.aspect || 0.56) * 1.3 : opt.aspect || 0.56));
      cv.style.height = S.H + "px"; cv.width = Math.round(S.W * S.DPR); cv.height = Math.round(S.H * S.DPR);
      S.onSize && S.onSize();
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(() => { const w = stage.getBoundingClientRect().width; if (Math.abs(w - S.W) > 2) size(); }).observe(stage);
    if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => (S.visible = e.isIntersecting))).observe(stage);

    // --- asosiy sikl: qat'iy qadam (1/240 s) × sekinlashtirish ---
    let last = 0, acc = 0;
    const DT = 1 / 240;
    function loop(now) {
      if (!cv.isConnected) return;
      requestAnimationFrame(loop);
      if (!S.visible) { last = now; return; }
      const real = Math.min(0.05, last ? (now - last) / 1000 : 0); last = now;
      if (!S.paused && S.step) {
        acc += real * (S.slow ? S.ts : 1) * (S.speed || 1);
        let n = 0;
        while (acc >= DT && n < 400) { S.step(DT); S.t += DT; acc -= DT; n++; }
      }
      S.parts = S.parts.filter((p) => (p.life -= real) > 0);
      S.parts.forEach((p) => { p.x += p.vx * real; p.y += p.vy * real; p.vy += (p.g || 0) * real; });
      S.pops = S.pops.filter((p) => (p.life -= real) > 0);
      S.frame++;
      x.setTransform(S.DPR, 0, 0, S.DPR, 0, 0);
      S.draw && S.draw(real);
      drawParts();
    }
    requestAnimationFrame(loop);

    function drawParts() {
      S.parts.forEach((p) => { x.globalAlpha = Math.max(0, Math.min(1, p.life / (p.l0 || 1))); x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); });
      x.globalAlpha = 1;
      S.pops.forEach((p) => { const k = 1 - p.life / p.l0; x.globalAlpha = Math.min(1, p.life / p.l0 * 2); x.fillStyle = p.c || C.red;
        x.font = `italic 800 ${p.size || 18}px ${SERIF}`; x.textAlign = "center"; x.fillText(p.text, p.x, p.y - k * 26); });
      x.globalAlpha = 1;
    }

    // --- chizish yordamchilari ---
    S.bg = (o = {}) => {
      x.fillStyle = C.paper; x.fillRect(0, 0, S.W, S.H);
      if (o.grid !== false) { x.strokeStyle = C.grid; x.lineWidth = 1; const st = o.gstep || 24;
        for (let i = st; i < S.W; i += st) { x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, S.H); x.stroke(); }
        for (let i = st; i < S.H; i += st) { x.beginPath(); x.moveTo(0, i + 0.5); x.lineTo(S.W, i + 0.5); x.stroke(); } }
    };
    S.arrow = (x1, y1, x2, y2, c, lab, o = {}) => {
      const L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
      const a = Math.atan2(y2 - y1, x2 - x1), hl = Math.min(o.head || 9, L * 0.5);
      x.strokeStyle = c; x.fillStyle = c; x.lineWidth = o.w || 2.2; if (o.dash) x.setLineDash(o.dash);
      x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2 - hl * 0.6 * Math.cos(a), y2 - hl * 0.6 * Math.sin(a)); x.stroke(); x.setLineDash([]);
      x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - hl * Math.cos(a - 0.38), y2 - hl * Math.sin(a - 0.38)); x.lineTo(x2 - hl * Math.cos(a + 0.38), y2 - hl * Math.sin(a + 0.38)); x.closePath(); x.fill();
      if (lab) { x.font = `italic 700 ${o.fs || 13}px ${SERIF}`; x.textAlign = "center"; x.textBaseline = "middle";
        const lx = x2 + Math.cos(a) * 11 + (o.lx || 0), ly = x2 === x1 && y2 === y1 ? y2 : y2 + Math.sin(a) * 11 + (o.ly || 0);
        x.lineWidth = 3; x.strokeStyle = "rgba(244,241,232,.9)"; x.strokeText(lab, lx, ly); x.fillText(lab, lx, ly); x.textBaseline = "alphabetic"; }
    };
    S.text = (s, tx, ty, o = {}) => {
      x.font = `${o.italic === false ? "" : "italic "}${o.bold === false ? "" : "700 "}${o.size || 13}px ${o.font || SERIF}`;
      x.textAlign = o.align || "center"; x.fillStyle = o.c || C.ink;
      if (o.halo) { x.lineWidth = 3; x.strokeStyle = "rgba(244,241,232,.92)"; x.strokeText(s, tx, ty); }
      x.fillText(s, tx, ty);
    };
    S.hatch = (x1, y1, x2, y2, o = {}) => { // yer/ship (shtrixli chiziq)
      x.strokeStyle = o.c || C.ink; x.lineWidth = 2; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
      x.lineWidth = 1; const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / 9), ux = (x2 - x1) / L, uy = (y2 - y1) / L, s = o.up ? -1 : 1;
      for (let i = 0; i <= n; i++) { const px = x1 + ux * i * 9, py = y1 + uy * i * 9; x.beginPath(); x.moveTo(px, py); x.lineTo(px - 6 * (uy * s) - 5 * ux, py + 6 * (ux * s) - 5 * uy); x.stroke(); }
    };
    /** HUD: chap yuqorida t va ×1/k, markazda asosiy ko'rsatkich */
    S.hud = (main, sub, o = {}) => {
      S.text(`t = ${S.t.toFixed(o.dig == null ? 2 : o.dig)} s`, 12, 20, { font: MONO, italic: false, align: "left", size: 13, c: C.ink });
      if (S.slow && S.ts < 0.95) { const k = Math.round(1 / S.ts); x.strokeStyle = C.ink; x.lineWidth = 1; x.strokeRect(12.5, 28.5, 46, 18);
        S.text(`×1/${k}`, 35, 41, { font: MONO, italic: false, size: 11 }); }
      if (S.paused) S.text("❚❚ pauza", 12, 62, { font: SANS, italic: false, align: "left", size: 11, c: C.sub });
      const hx = S.W < 560 ? (S.W + 108) / 2 : S.W / 2;
      if (main) S.text(main, hx, 22, { size: S.W < 560 ? 14 : 16, c: C.red, halo: true });
      if (sub) S.text(sub, hx, 38, { size: S.W < 560 ? 10 : 11, bold: false, c: C.sub, halo: true });
    };
    /** Jonli grafik paneli. series: [{d:[[t,y]...], c, l}] */
    S.graph = (gx, gy, gw, gh, series, o = {}) => {
      x.fillStyle = "rgba(255,255,255,.78)"; x.strokeStyle = "rgba(87,83,78,.35)"; x.lineWidth = 1;
      x.fillRect(gx, gy, gw, gh); x.strokeRect(gx + 0.5, gy + 0.5, gw, gh);
      const px = gx + 26, py = gy + 16, pw = gw - 34, ph = gh - 30;
      let xmin = o.xmin, xmax = o.xmax, ymin = o.ymin, ymax = o.ymax;
      const all = series.flatMap((s) => s.d);
      if (xmax == null) { xmax = all.length ? Math.max(...all.map((p) => p[0])) : 1; xmin = xmin == null ? (o.win ? Math.max(0, xmax - o.win) : 0) : xmin; if (o.win) xmax = Math.max(xmax, o.win); }
      if (xmin == null) xmin = 0;
      if (ymax == null) { ymax = all.length ? Math.max(...all.map((p) => p[1])) : 1; ymax = ymax > 0 ? ymax * 1.15 : 1; }
      if (ymin == null) { ymin = all.length ? Math.min(0, ...all.map((p) => p[1])) : 0; if (ymin < 0) ymin *= 1.15; }
      if (o.sym) { const m = Math.max(Math.abs(ymin), Math.abs(ymax)); ymin = -m; ymax = m; }
      if (xmax - xmin < 1e-9) xmax = xmin + 1; if (ymax - ymin < 1e-9) ymax = ymin + 1;
      const X = (v) => px + ((v - xmin) / (xmax - xmin)) * pw, Y = (v) => py + ph - ((v - ymin) / (ymax - ymin)) * ph;
      x.strokeStyle = C.sub; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py - 4); x.lineTo(px, py + ph); x.stroke();
      const y0 = Y(Math.max(ymin, Math.min(ymax, 0))); x.beginPath(); x.moveTo(px, y0); x.lineTo(px + pw, y0); x.stroke();
      series.forEach((s) => { if (!s.d.length) return; x.strokeStyle = s.c; x.lineWidth = s.w || 1.8; if (s.dash) x.setLineDash(s.dash); x.beginPath();
        let st = false; s.d.forEach((p) => { if (p[0] < xmin) return; const qx = X(p[0]), qy = Y(Math.max(ymin, Math.min(ymax, p[1]))); st ? x.lineTo(qx, qy) : (x.moveTo(qx, qy), (st = true)); }); x.stroke(); x.setLineDash([]);
        const lp = s.d[s.d.length - 1]; if (lp[0] >= xmin && !s.dash) { x.fillStyle = s.c; x.beginPath(); x.arc(X(lp[0]), Y(Math.max(ymin, Math.min(ymax, lp[1]))), 3, 0, 7); x.fill(); } });
      x.font = `10px ${SANS}`; x.fillStyle = C.sub; x.textAlign = "left"; x.fillText(o.yl || "", gx + 5, gy + 11);
      x.textAlign = "right"; x.fillText(o.xl || "t (s)", gx + gw - 5, gy + gh - 4);
      let lx = gx + gw - 6; x.textAlign = "right"; x.font = `italic 700 10px ${SERIF}`;
      series.slice().reverse().forEach((s) => { if (!s.l) return; x.fillStyle = s.c; x.fillText(s.l, lx, gy + 11); lx -= x.measureText(s.l).width + 10; });
      return { X, Y };
    };
    /** Kanvas ichidagi energiya ustunlari (jonli) */
    S.bars = (bx, by, bh, list, o = {}) => { // list: [{v, c, l}]
      const mx = o.max || Math.max(1e-9, ...list.map((b) => Math.abs(b.v))), bw = o.bw || 16, gap = o.gap || 10;
      x.fillStyle = "rgba(255,255,255,.7)"; const tw = list.length * (bw + gap) + gap; x.fillRect(bx - gap / 2, by - bh - 14, tw, bh + 30);
      list.forEach((b, i) => { const hh = (Math.max(0, b.v) / mx) * bh, X0 = bx + i * (bw + gap);
        x.fillStyle = b.c; x.fillRect(X0, by - hh, bw, hh); x.strokeStyle = "rgba(28,25,23,.35)"; x.strokeRect(X0 + 0.5, by - bh + 0.5, bw, bh);
        S.text(b.l, X0 + bw / 2, by + 12, { size: 10, c: C.ink }); });
      if (o.title) S.text(o.title, bx - gap / 2 + tw / 2, by - bh - 3, { size: 9, bold: false, c: C.sub, font: SANS, italic: false });
    };
    S.burst = (px, py, n, c, o = {}) => { for (let i = 0; i < n; i++) { const a = (o.a0 ?? 0) + (o.spread ?? Math.PI * 2) * Math.random() - (o.spread ?? Math.PI * 2) / 2, sp = (o.sp || 120) * (0.3 + Math.random());
      const l = (o.life || 0.9) * (0.5 + Math.random() * 0.7); S.parts.push({ x: px, y: py, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: o.g ?? 260, r: (o.r || 2.2) * (0.6 + Math.random()), c: Array.isArray(c) ? c[i % c.length] : c, life: l, l0: l }); } };
    S.pop = (text, px, py, o = {}) => S.pops.push({ text, x: px, y: py, life: o.life || 1.2, l0: o.life || 1.2, c: o.c, size: o.size });
    S.ball = (bx, by, r, c1, c2) => { const gr = x.createRadialGradient(bx - r * 0.35, by - r * 0.4, r * 0.1, bx, by, r); gr.addColorStop(0, c1 || "#fff7ed"); gr.addColorStop(1, c2 || "#c2410c");
      x.fillStyle = gr; x.beginPath(); x.arc(bx, by, r, 0, 7); x.fill(); x.strokeStyle = "rgba(28,25,23,.5)"; x.lineWidth = 1; x.stroke(); };
    S.spring = (x1, y1, x2, y2, coils = 12, wdt = 9) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
      x.strokeStyle = "#475569"; x.lineWidth = 2; x.beginPath(); x.moveTo(x1, y1); const e = 0.08;
      x.lineTo(x1 + ux * L * e, y1 + uy * L * e);
      for (let i = 0; i <= coils * 2; i++) { const k = e + (1 - 2 * e) * (i / (coils * 2)), s = i === 0 || i === coils * 2 ? 0 : i % 2 ? 1 : -1; x.lineTo(x1 + ux * L * k + nx * wdt * s, y1 + uy * L * k + ny * wdt * s); }
      x.lineTo(x2, y2); x.stroke(); };

    // --- standart boshqaruv: pauza, sekin harakat ---
    S.timeCtl = (o = {}) => {
      const pb = button("❚❚ Pauza", () => { S.paused = !S.paused; pb.innerHTML = S.paused ? "▶ Davom" : "❚❚ Pauza"; }, "ghost");
      const row = h("div", { class: "kn-row" }, pb);
      if (o.speeds !== false) row.append(buttons(["×1/4", "×1/2", "×1", "×2"], (i) => (S.speed = [0.25, 0.5, 1, 2][i]), 2));
      if (o.slow !== false) row.append(h("label", { class: "kb-check" }, h("input", { type: "checkbox", checked: S.slow, onchange: (e) => (S.slow = e.target.checked) }), " Sekin harakat (muhim lahzada)"));
      S.speed = 1; S.unpause = () => { S.paused = false; pb.innerHTML = "❚❚ Pauza"; };
      return row;
    };
    /** Kanvas koordinatasi (CSS px) */
    S.pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (S.W / r.width), (e.clientY - r.top) * (S.H / r.height)]; };
    S.pointer = (down, move, up) => {
      cv.style.touchAction = "none";
      let on = false;
      cv.addEventListener("pointerdown", (e) => { const p = S.pt(e); if (down(p, e) !== false) { on = true; cv.setPointerCapture(e.pointerId); tip.hidden = true; } });
      cv.addEventListener("pointermove", (e) => { const p = S.pt(e); if (on) move && move(p, e); else if (S.hover) cv.style.cursor = S.hover(p) ? "grab" : "default"; });
      const end = (e) => { if (on) { on = false; up && up(S.pt(e), e); } };
      cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    };
    /** Yakuniy karta (DOM) */
    S.endCard = (title, html, bars) => {
      const mx = Math.max(1e-9, ...(bars || []).map((b) => b.v));
      const bh = (bars || []).map((b) => `<div class="sl-bar"><i style="height:${Math.max(4, (b.v / mx) * 90)}px;background:${b.c}"></i><b>${b.fmt || b.v.toFixed(0) + " J"}</b><small>${b.l}</small></div>`).join("");
      return `<div class="sl-end win"><b>${title}</b>${bars ? `<div class="sl-bars">${bh}</div>` : ""}${html}</div>`;
    };
    S.f = (s, note) => `<div class="sl-f">${s}${note ? ` <small>${note}</small>` : ""}</div>`;
    return S;
  }

  const r = (v, d = 2) => (Math.round(v * 10 ** d) / 10 ** d).toString().replace(".", ",");
  window.KINO = { hx: (S) => (S.W < 560 ? (S.W + 108) / 2 : S.W / 2), scene, C, r, SERIF, MONO, SANS };
})();
