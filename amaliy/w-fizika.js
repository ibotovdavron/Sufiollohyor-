/* Fizika jonli tajribalari (1-qism): umumiy yordamchilar, o'lchashlar (chizg'ich, birliklar, yuza, menzurka, tarozi, sekundomer),
   mexanik harakat (yo'l va tezlik grafiklari), elektrostatika (zaryadlash, Kulon, maydon chiziqlari), elektr zanjirlari, kondensator. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const PI = Math.PI;
  const r2 = (v, d = 2) => num(Math.round(v * 10 ** d) / 10 ** d);
  const ink = () => getComputedStyle(document.body).color || "#fff";

  /** Faqat ko'rinib turganda ishlaydigan canvas animatsiyasi */
  function animCanvas(stage, w, hh, step) {
    const cv = h("canvas", { class: "fz-canvas", width: w * 2, height: hh * 2, style: `aspect-ratio:${w}/${hh}` });
    stage.append(cv);
    const c = cv.getContext("2d"); c.scale(2, 2);
    let vis = true, last = performance.now(), t = 0;
    const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (vis && cv.isConnected) { t += dt; step(c, dt, t); } if (cv.isConnected) requestAnimationFrame(loop); };
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { vis = es[0].isIntersecting; }).observe(cv);
    requestAnimationFrame(loop);
    return cv;
  }
  /** SVG grafik */
  function plot(xmin, xmax, ymin, ymax, w = 340, hh = 200, lab = ["", ""]) {
    const g = svg(w, hh, "fz-plot"), L = 36, R = 10, T = 12, B = 26;
    const X = (x) => L + ((x - xmin) / (xmax - xmin)) * (w - L - R), Y = (y) => hh - B - ((y - ymin) / (ymax - ymin)) * (hh - T - B);
    const y0 = Y(Math.max(ymin, Math.min(ymax, 0))), x0 = X(Math.max(xmin, Math.min(xmax, 0)));
    s("line", { x1: L, y1: y0, x2: w - R, y2: y0, stroke: "currentColor", opacity: 0.45 }, g);
    s("line", { x1: x0, y1: T, x2: x0, y2: hh - B, stroke: "currentColor", opacity: 0.45 }, g);
    s("text", { x: w - R, y: hh - 8, "text-anchor": "end", class: "fz-t", fill: "currentColor", text: lab[0] }, g);
    s("text", { x: L + 4, y: T + 9, class: "fz-t", fill: "currentColor", text: lab[1] }, g);
    const curve = (f, col = "#38bdf8", wd = 2.5, a = xmin, b = xmax, n = 160) => { let d = ""; for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n, y = f(x); if (!isFinite(y)) continue; d += (d ? "L" : "M") + X(x).toFixed(1) + " " + Y(Math.max(ymin - 9, Math.min(ymax + 9, y))).toFixed(1); } s("path", { d, fill: "none", stroke: col, "stroke-width": wd }, g); };
    const poly = (pts, col = "#38bdf8", wd = 2.5) => s("polyline", { points: pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" "), fill: "none", stroke: col, "stroke-width": wd }, g);
    const dot = (x, y, col = "#fde047", r = 5) => s("circle", { cx: X(x), cy: Y(y), r, fill: col }, g);
    const text = (x, y, t, col = "currentColor", a = "start") => s("text", { x: X(x), y: Y(y), fill: col, class: "fz-t", "text-anchor": a, text: t }, g);
    const area = (f, a, b, col = "rgba(56,189,248,.3)") => { let d = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = a + ((b - a) * i) / 60; d += `L${X(x)} ${Y(f(x))}`; } s("path", { d: d + `L${X(b)} ${Y(0)}Z`, fill: col }, g); };
    return { g, X, Y, curve, poly, dot, text, area };
  }
  function arrow(c, x1, y1, x2, y2, col, wd = 3, head = 9) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
    c.strokeStyle = c.fillStyle = col; c.lineWidth = wd; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6); c.stroke();
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - head * Math.cos(a - 0.45), y2 - head * Math.sin(a - 0.45)); c.lineTo(x2 - head * Math.cos(a + 0.45), y2 - head * Math.sin(a + 0.45)); c.closePath(); c.fill();
  }
  const label = (c, x, y, t, col = "#fff", bg = "rgba(0,0,0,.55)", f = 12) => { c.font = `700 ${f}px system-ui, sans-serif`; const w = c.measureText(t).width + 10; c.fillStyle = bg; c.fillRect(x - w / 2, y - f + 1, w, f + 6); c.fillStyle = col; c.textAlign = "center"; c.fillText(t, x, y + 3); };
  window.FIZ = { animCanvas, plot, arrow, label, r2, ink };

  // ===================================================================
  // 1. O'lchash: chizg'ich / shtangensirkul — bo'lim qiymati va xatolik
  // ===================================================================
  W.ruler = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📏 Jismni chizg‘ich bilan o‘lchang — bo‘lim qiymatini toping");
    const OBJ = [["✏️ Qalam", 14.6], ["🔑 Kalit", 6.3], ["📱 Telefon", 15.2], ["🪙 Tanga", 2.45], ["📘 Daftar", 20.5]];
    const SC = [["Santimetrli (1 sm)", 1], ["Millimetrli (1 mm)", 0.1], ["Yarim santimetr (0,5 sm)", 0.5]];
    let oi = 0, si = 1, guess = "";
    function draw() {
      const [n, L] = OBJ[oi], [sn, dv] = SC[si], max = Math.ceil(L / 5) * 5 + 5;
      const g = svg(360, 130, "fz-svg"), k = 330 / max, x0 = 15;
      s("rect", { x: x0, y: 70, width: max * k, height: 40, rx: 4, fill: "#fde68a", stroke: "#a16207" }, g);
      for (let v = 0; v <= max + 1e-9; v += dv) { const big = Math.abs(v - Math.round(v)) < 1e-6, mid = Math.abs(v * 2 - Math.round(v * 2)) < 1e-6; s("line", { x1: x0 + v * k, y1: 70, x2: x0 + v * k, y2: 70 + (big ? 16 : mid ? 11 : 7), stroke: "#422006", "stroke-width": big ? 1.4 : 0.8 }, g); if (big && (Math.round(v) % (max > 20 ? 5 : 1) === 0)) s("text", { x: x0 + v * k, y: 102, "text-anchor": "middle", "font-size": 10, fill: "#422006", text: Math.round(v) }, g); }
      s("rect", { x: x0, y: 34, width: L * k, height: 26, rx: 8, fill: "#38bdf8", opacity: 0.85 }, g);
      s("text", { x: x0 + (L * k) / 2, y: 52, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: "#04112a", text: n }, g);
      s("line", { x1: x0 + L * k, y1: 30, x2: x0 + L * k, y2: 112, stroke: "#ef4444", "stroke-dasharray": "3 3" }, g);
      stage.innerHTML = ""; stage.append(g);
      const read = Math.round(L / dv) * dv;
      out.innerHTML = `<div>Chizg‘ich: <b>${sn}</b>. Bo‘lim qiymati = (ikki raqam ayirmasi) : (orasidagi bo‘laklar soni) = <b>${num(dv)} sm</b>.</div>
        <div class="big-num">L ≈ ${r2(read, 2)} sm ± ${num(dv / 2)} sm</div>
        <div class="muted">O‘lchash xatoligi bo‘lim qiymatining yarmiga teng. Mayda bo‘limli asbob aniqroq o‘lchaydi. Haqiqiy uzunlik: ${num(L)} sm.</div>`;
    }
    controls.append(buttons(OBJ.map((o) => o[0]), (i) => { oi = i; draw(); }, 0), buttons(SC.map((o) => o[0]), (i) => { si = i; draw(); }, 1));
    draw(); void guess;
  };

  // ===================================================================
  // 2. Birliklar konvertori (XBS)
  // ===================================================================
  const UNITS = {
    "Uzunlik": [["km", 1000], ["m", 1], ["dm", 0.1], ["sm", 0.01], ["mm", 0.001], ["mkm", 1e-6]],
    "Yuza": [["km²", 1e6], ["ga", 1e4], ["m²", 1], ["dm²", 0.01], ["sm²", 1e-4], ["mm²", 1e-6]],
    "Hajm": [["m³", 1], ["l (dm³)", 1e-3], ["ml (sm³)", 1e-6]],
    "Massa": [["t", 1000], ["kg", 1], ["g", 0.001], ["mg", 1e-6]],
    "Vaqt": [["sutka", 86400], ["soat", 3600], ["min", 60], ["s", 1], ["ms", 0.001]],
    "Tezlik": [["km/soat", 1 / 3.6], ["m/s", 1], ["sm/s", 0.01]],
  };
  W.units = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔁 Birliklarni XBS ga o‘tkazish");
    let q = p.q || "Uzunlik", v = 1, from = 0;
    const inp = h("input", { type: "number", class: "kb-input", value: v, step: "any", "aria-label": "Qiymat" });
    inp.oninput = () => { v = Number(inp.value) || 0; draw(); };
    function draw() {
      const U = UNITS[q], base = v * U[from][1];
      stage.innerHTML = `<div class="fz-units">${U.map(([n, k], i) => `<button type="button" class="${i === from ? "on" : ""}" data-u="${i}"><b>${r2(base / k, 6).replace(/,?0+$/, "") || 0}</b><small>${n}</small></button>`).join("")}</div>`;
      stage.querySelectorAll("[data-u]").forEach((b) => (b.onclick = () => { from = +b.dataset.u; v = Number(b.querySelector("b").textContent.replace(/\s/g, "").replace(",", ".")) || 0; inp.value = v; draw(); }));
      const si = U.find((u) => u[1] === 1);
      out.innerHTML = `${num(v)} ${U[from][0]} = <b>${r2(base, 6)} ${si ? si[0] : ""}</b> (XBS asosiy birligi). <div class="muted">Qo‘shimchalar: kilo = 10³, detsi = 10⁻¹, santi = 10⁻², milli = 10⁻³, mikro = 10⁻⁶. 1 km/soat = 1000 m : 3600 s ≈ 0,278 m/s.</div>`;
    }
    controls.append(buttons(Object.keys(UNITS), (i) => { q = Object.keys(UNITS)[i]; from = 0; v = 1; inp.value = 1; draw(); }, Object.keys(UNITS).indexOf(q)), h("label", { class: "ctl" }, h("span", {}, "Qiymat"), inp));
    draw();
  };

  // ===================================================================
  // 3. Yuzani kataklar bilan o'lchash (notekis shakl)
  // ===================================================================
  W.areaGrid = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🍃 Notekis shakl yuzini kataklar bilan o‘lchash");
    let cell = 1, shape = 0;
    const SH = [["🍃 Barg", (x, y) => { const u = (x - 5) / 4.2, v = (y - 4) / 2.6; return u * u + v * v * (1 + 0.6 * u) < 1; }], ["🖐 Kaft", (x, y) => { const pal = ((x - 5) / 2.6) ** 2 + ((y - 3) / 2.4) ** 2 < 1; const f = [3, 4.2, 5.4, 6.6].some((fx, i) => Math.abs(x - fx) < 0.45 && y > 4 && y < 7.4 - Math.abs(i - 1.5) * 0.5); const th = Math.abs(y - 3 - (x - 7.2) * 0.6) < 0.45 && x > 7 && x < 9; return pal || f || th; }], ["💧 Ko‘lmak", (x, y) => { const a = Math.atan2(y - 4, x - 5), r = 3.2 + 0.6 * Math.sin(3 * a) + 0.4 * Math.cos(5 * a); return Math.hypot(x - 5, (y - 4) * 1.3) < r; }]];
    function draw() {
      const f = SH[shape][1], g = svg(340, 280, "fz-svg"), k = 32, ox = 10, oy = 10;
      let full = 0, part = 0;
      for (let x = 0; x < 10; x += cell) for (let y = 0; y < 8; y += cell) {
        let inside = 0; const n = 6; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (f(x + ((i + 0.5) * cell) / n, y + ((j + 0.5) * cell) / n)) inside++;
        const fr = inside / (n * n); if (fr > 0.97) full++; else if (fr > 0.02) part++;
        s("rect", { x: ox + x * k, y: oy + (8 - y - cell) * k, width: cell * k, height: cell * k, fill: fr > 0.97 ? "rgba(34,197,94,.45)" : fr > 0.02 ? "rgba(250,204,21,.35)" : "none", stroke: "currentColor", "stroke-opacity": 0.25 }, g);
      }
      let d = ""; for (let y = 0; y <= 8; y += 0.05) for (let x = 0; x <= 10; x += 0.05) if (f(x, y) !== f(x + 0.05, y)) d += `M${ox + x * k} ${oy + (8 - y) * k}h1.5`;
      s("path", { d, stroke: "#38bdf8", "stroke-width": 2.5 }, g);
      stage.innerHTML = ""; stage.append(g);
      const Sc = cell * cell; let exact = 0; for (let x = 0; x < 10; x += 0.05) for (let y = 0; y < 8; y += 0.05) if (f(x + 0.025, y + 0.025)) exact += 0.0025;
      out.innerHTML = `<div>To‘liq kataklar (yashil): <b>${full}</b> · chala kataklar (sariq): <b>${part}</b> · 1 katak = ${num(Sc)} sm²</div>
        <div class="big-num">S ≈ (${full} + ${part} : 2) · ${num(Sc)} = ${r2((full + part / 2) * Sc, 1)} sm²</div><div class="muted">Aniqroq hisob: ≈ ${r2(exact, 1)} sm². Kataklar kichrayganda natija aniqlashadi.</div>`;
    }
    controls.append(buttons(SH.map((s_) => s_[0]), (i) => { shape = i; draw(); }, 0), buttons(["1 sm katak", "0,5 sm katak"], (i) => { cell = [1, 0.5][i]; draw(); }, 0));
    draw();
  };

  // ===================================================================
  // 4. Menzurka: suyuqlik hajmi va jism hajmi (siqib chiqarish usuli)
  // ===================================================================
  W.beaker = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧪 Menzurka: jism hajmini suv sathi orqali o‘lchash");
    const OB = [["Tosh", 18, "#78716c"], ["Kalit", 4, "#d4d4d8"], ["Temir kubik (2 sm)", 8, "#6b7280"], ["Olma", 120, "#ef4444"]];
    let oi = 0, inside = false, V0 = 100, dv = 2;
    function draw() {
      const [n, Vb, col] = OB[oi], cap = 250, V = V0 + (inside ? Vb : 0);
      const g = svg(300, 260, "fz-svg"), x = 110, top = 20, H = 220, k = H / cap;
      s("rect", { x, y: top + H - V * k, width: 80, height: V * k, fill: "#38bdf8", opacity: 0.45 }, g);
      if (inside) { const r = Math.max(6, Math.cbrt(Vb) * 6); s("circle", { cx: x + 40, cy: top + H - r - 2, r, fill: col }, g); }
      s("path", { d: `M${x} ${top} V${top + H} H${x + 80} V${top}`, fill: "none", stroke: "currentColor", "stroke-width": 3 }, g);
      for (let v = 0; v <= cap; v += dv * 5) { const yy = top + H - v * k, big = v % 50 === 0; s("line", { x1: x + 80, y1: yy, x2: x + 80 - (big ? 18 : 9), y2: yy, stroke: "currentColor", opacity: 0.8 }, g); if (big) s("text", { x: x + 88, y: yy + 4, "font-size": 11, fill: "currentColor", text: v }, g); }
      s("text", { x: x + 40, y: top + H - V * k - 6, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "#fde047", text: "← sath" }, g);
      stage.innerHTML = ""; stage.append(g);
      out.innerHTML = inside ? `<div>Suv sathi: ${V0} ml → <b>${V} ml</b></div><div class="big-num">V(${n.toLowerCase()}) = ${V} − ${V0} = ${Vb} ml = ${Vb} sm³</div><div class="muted">Jism siqib chiqargan suv hajmi uning hajmiga teng (1 ml = 1 sm³). Arximed shunday usulda tojning hajmini aniqlagan.</div>`
        : `<div>Menzurkada <b>${V0} ml</b> suv. Bo‘lim qiymati: (50 − 0) : 5 = <b>10 ml</b>. Ko‘z sath bilan bir chiziqda bo‘lsin (meniskning pastki qismi bo‘yicha o‘qiladi).</div>`;
    }
    controls.append(buttons(OB.map((o) => o[0]), (i) => { oi = i; inside = false; draw(); }, 0),
      slider({ label: "Boshlang‘ich suv", min: 50, max: 120, step: 10, value: V0, fmt: (v) => v + " ml", onInput: (v) => { V0 = v; draw(); } }),
      button("⬇ Jismni tushirish / chiqarish", () => { inside = !inside; draw(); }));
    draw();
  };

  // ===================================================================
  // 5. Richagli tarozi: massa o'lchash
  // ===================================================================
  W.scales = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚖️ Tarozida massani o‘lchash — toshlarni qo‘ying");
    const OB = [["🍎 Olma", 186], ["📱 Telefon", 204], ["🥚 Tuxum", 58], ["🔋 Batareyka", 23]];
    const WT = [100, 50, 20, 10, 5, 2, 1];
    let oi = 0, put = [];
    const sum = () => put.reduce((a, b) => a + b, 0);
    function draw() {
      const m = OB[oi][1], d = sum() - m, ang = Math.max(-12, Math.min(12, -d * 0.2)) * (PI / 180);
      const g = svg(340, 200, "fz-svg"), cx = 170, cy = 70, L = 120;
      const lx = cx - L * Math.cos(ang), ly = cy + L * Math.sin(ang), rx = cx + L * Math.cos(ang), ry = cy - L * Math.sin(ang);
      s("path", { d: `M${cx} ${cy} L${cx - 20} 180 L${cx + 20} 180 Z`, fill: "currentColor", opacity: 0.35 }, g);
      s("line", { x1: lx, y1: ly, x2: rx, y2: ry, stroke: "currentColor", "stroke-width": 5 }, g);
      for (const [x, y, items] of [[lx, ly, [OB[oi][0].split(" ")[0]]], [rx, ry, put.map((w) => w + "g")]]) {
        s("line", { x1: x, y1: y, x2: x - 30, y2: y + 50, stroke: "currentColor", opacity: 0.6 }, g); s("line", { x1: x, y1: y, x2: x + 30, y2: y + 50, stroke: "currentColor", opacity: 0.6 }, g);
        s("path", { d: `M${x - 40} ${y + 50} Q${x} ${y + 64} ${x + 40} ${y + 50}`, fill: "none", stroke: "currentColor", "stroke-width": 3 }, g);
        items.forEach((t, i) => s("text", { x: x - 30 + (i % 4) * 20, y: y + 46 - Math.floor(i / 4) * 14, "font-size": items.length > 1 ? 10 : 26, "font-weight": 800, fill: items.length > 1 ? "#fde047" : "currentColor", text: t }, g));
      }
      s("polygon", { points: `${cx - 6},${cy - 22} ${cx + 6},${cy - 22} ${cx},${cy - 6}`, fill: Math.abs(d) < 0.5 ? "#22c55e" : "#ef4444" }, g);
      stage.innerHTML = ""; stage.append(g);
      out.innerHTML = Math.abs(d) < 0.5 ? `🎯 <b>Muvozanat!</b> m = ${put.join(" + ")} = <b>${sum()} g</b>` : `Toshlar: <b>${sum()} g</b> ${d < 0 ? "— yana qo‘shing (jism og‘irroq)" : "— ko‘p bo‘ldi, olib tashlang"}. <div class="muted">Katta toshdan boshlang: og‘ir bo‘lsa olib, kichigini qo‘ying.</div>`;
    }
    const wbox = h("div", { class: "kb-row" }, ...WT.map((w) => button(w + " g", () => { put.push(w); draw(); }, "ghost")), button("↶", () => { put.pop(); draw(); }, "ghost"), button("Tozalash", () => { put = []; draw(); }, "ghost"));
    controls.append(buttons(OB.map((o) => o[0]), (i) => { oi = i; put = []; draw(); }, 0), wbox);
    draw();
  };

  // ===================================================================
  // 6. Sekundomer va tebranishlar (vaqtni o'lchash)
  // ===================================================================
  W.stopwatch = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⏱ Vaqtni o‘lchash: mayatnik tebranishlarini sanang");
    let L = 1, run = false, tt = 0, cnt = 0, prev = 0;
    animCanvas(stage, 340, 220, (c, dt, t) => {
      const T = 2 * PI * Math.sqrt(L / 9.81); if (run) tt += dt;
      const th = 0.35 * Math.cos((2 * PI * tt) / T), ph = Math.floor(tt / T); if (run && ph > prev) { cnt = ph; prev = ph; info(); }
      c.clearRect(0, 0, 340, 220); const ox = 120, oy = 14, len = 60 + L * 70, bx = ox + len * Math.sin(th), by = oy + len * Math.cos(th);
      c.strokeStyle = ink(); c.lineWidth = 2; c.beginPath(); c.moveTo(60, oy); c.lineTo(180, oy); c.stroke(); c.beginPath(); c.moveTo(ox, oy); c.lineTo(bx, by); c.stroke();
      c.fillStyle = "#f97316"; c.beginPath(); c.arc(bx, by, 12, 0, 7); c.fill();
      c.strokeStyle = ink(); c.lineWidth = 3; c.beginPath(); c.arc(275, 110, 52, 0, 7); c.stroke();
      const a = (tt % 60) / 60 * 2 * PI - PI / 2; c.strokeStyle = "#ef4444"; c.beginPath(); c.moveTo(275, 110); c.lineTo(275 + 44 * Math.cos(a), 110 + 44 * Math.sin(a)); c.stroke();
      label(c, 275, 185, r2(tt, 2) + " s", "#fde047"); label(c, 120, 205, cnt + " ta tebranish", "#86efac");
    });
    function info() { out.innerHTML = cnt ? `<div class="big-num">T = t : N = ${r2(tt, 2)} : ${cnt} = ${r2(tt / cnt, 3)} s</div><div class="muted">Bitta tebranishni o‘lchash xato bo‘ladi (reaksiya vaqti ~0,2 s). Ko‘p tebranish vaqtini o‘lchab, songa bo‘lsak — aniq natija chiqadi. Nazariy: T = 2π√(l/g) = ${r2(2 * PI * Math.sqrt(L / 9.81), 3)} s.</div>` : "▶ ni bosing va tebranishlar sonini kuzating."; }
    controls.append(slider({ label: "Ip uzunligi l", min: 0.25, max: 2, step: 0.25, value: L, fmt: (v) => num(v) + " m", onInput: (v) => { L = v; tt = 0; cnt = 0; prev = 0; info(); } }),
      button("▶ / ⏸", () => { run = !run; }), button("↺ Nol", () => { tt = 0; cnt = 0; prev = 0; run = false; info(); }, "ghost"));
    info();
  };

  // ===================================================================
  // 7. Mexanik harakat: ikki jism, yo'l va tezlik grafiklari
  // ===================================================================
  W.motionGraph = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🚗 Harakat: tezlikni tanlang — yo‘l va tezlik grafiklari chiziladi");
    let v1 = 15, v2 = 10, t = 0, run = false;
    const road = h("div", { class: "fz-road" }, h("span", { class: "fz-car a" }, "🚗"), h("span", { class: "fz-car b" }, "🚌"));
    const g1 = h("div"), g2 = h("div");
    stage.append(road, g1, g2);
    let raf = 0, last = 0;
    const step = (now) => { if (!run) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt * 2; if (t >= 20) { t = 20; run = false; } draw(); if (run) raf = requestAnimationFrame(step); };
    function draw() {
      road.querySelector(".a").style.left = `${Math.min(92, (v1 * t) / 300 * 92)}%`; road.querySelector(".b").style.left = `${Math.min(92, (v2 * t) / 300 * 92)}%`;
      const P = plot(0, 20, 0, 300, 340, 170, ["t, s", "s, m"]); P.curve((x) => v1 * Math.min(x, t), "#f87171", 2.5, 0, Math.max(0.01, t)); P.curve((x) => v2 * Math.min(x, t), "#facc15", 2.5, 0, Math.max(0.01, t)); P.dot(t, v1 * t, "#f87171"); P.dot(t, v2 * t, "#facc15");
      const Q = plot(0, 20, 0, 25, 340, 130, ["t, s", "v, m/s"]); Q.poly([[0, v1], [t, v1]], "#f87171"); Q.poly([[0, v2], [t, v2]], "#facc15"); Q.area(() => v1, 0, Math.max(0.01, t), "rgba(248,113,113,.18)");
      g1.innerHTML = ""; g1.append(P.g); g2.innerHTML = ""; g2.append(Q.g);
      out.innerHTML = `<div>t = <b>${r2(t, 1)} s</b> · 🚗 s₁ = v₁t = ${v1}·${r2(t, 1)} = <b>${r2(v1 * t, 1)} m</b> · 🚌 s₂ = <b>${r2(v2 * t, 1)} m</b></div>
        <div class="muted">Tekis harakatda s(t) — to‘g‘ri chiziq: qancha tik bo‘lsa, tezlik shuncha katta. v(t) — gorizontal chiziq, uning ostidagi yuza — bosib o‘tilgan yo‘l. ${v1 * 3.6} km/soat = ${v1} m/s.</div>`;
    }
    controls.append(slider({ label: "🚗 tezligi", min: 0, max: 25, value: v1, fmt: (v) => v + " m/s", onInput: (v) => { v1 = v; draw(); } }), slider({ label: "🚌 tezligi", min: 0, max: 25, value: v2, fmt: (v) => v + " m/s", onInput: (v) => { v2 = v; draw(); } }),
      button("▶ Harakat", () => { if (t >= 20) t = 0; run = !run; last = performance.now(); if (run) raf = requestAnimationFrame(step); }), button("↺", () => { run = false; t = 0; draw(); }, "ghost"));
    draw(); void raf;
  };

  // ===================================================================
  // 8. Elektrlanish: ishqalash, elektroskop
  // ===================================================================
  W.charging = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚡ Jismlarni ishqalab zaryadlash — elektronlar qayerga o‘tadi?");
    const PAIRS = [["Shisha tayoqcha + ipak", "+", "−"], ["Ebonit tayoqcha + jun", "−", "+"], ["Plastik taroq + soch", "−", "+"], ["Shar (havo shari) + jun", "−", "+"]];
    let pi = 0, rubs = 0;
    function draw() {
      const [n, a, b] = PAIRS[pi], q = Math.min(8, rubs);
      const g = svg(340, 200, "fz-svg");
      s("rect", { x: 40, y: 40, width: 150, height: 26, rx: 13, fill: "#94a3b8" }, g); s("rect", { x: 200, y: 30, width: 90, height: 46, rx: 10, fill: "#a16207", opacity: 0.8 }, g);
      for (let i = 0; i < q; i++) { s("text", { x: 55 + i * 17, y: 59, "font-size": 15, "font-weight": 900, fill: a === "+" ? "#ef4444" : "#3b82f6", text: a }, g); s("text", { x: 210 + (i % 4) * 20, y: 50 + Math.floor(i / 4) * 18, "font-size": 15, "font-weight": 900, fill: b === "+" ? "#ef4444" : "#3b82f6", text: b }, g); }
      // elektroskop
      const ang = q * 4.5;
      s("line", { x1: 115, y1: 100, x2: 115, y2: 150, stroke: "currentColor", "stroke-width": 3 }, g); s("circle", { cx: 115, cy: 96, r: 8, fill: "#facc15" }, g);
      s("circle", { cx: 115, cy: 165, r: 32, fill: "none", stroke: "currentColor", opacity: 0.4 }, g);
      s("line", { x1: 115, y1: 150, x2: 115 - 22 * Math.sin((ang * PI) / 180), y2: 150 + 22 * Math.cos((ang * PI) / 180), stroke: "#fde047", "stroke-width": 3 }, g);
      s("line", { x1: 115, y1: 150, x2: 115 + 22 * Math.sin((ang * PI) / 180), y2: 150 + 22 * Math.cos((ang * PI) / 180), stroke: "#fde047", "stroke-width": 3 }, g);
      s("text", { x: 240, y: 170, "text-anchor": "middle", "font-size": 11, fill: "currentColor", text: "elektroskop yaproqchalari ↔" }, g);
      stage.innerHTML = ""; stage.append(g);
      out.innerHTML = rubs ? `<b>${n.split(" + ")[0]}</b> ${a === "+" ? "elektron berib <b>musbat</b>" : "elektron olib <b>manfiy</b>"} zaryadlandi, <b>${n.split(" + ")[1]}</b> esa teskari ishorali. Zaryad yo‘qdan paydo bo‘lmaydi — faqat bir jismdan ikkinchisiga o‘tadi (zaryad saqlanish qonuni). Elektroskop yaproqchalari bir xil ishorali zaryad olib, bir-biridan <b>itariladi</b>.`
        : "“Ishqalash” tugmasini bir necha marta bosing.";
    }
    controls.append(buttons(PAIRS.map((x) => x[0]), (i) => { pi = i; rubs = 0; draw(); }, 0), button("🤚 Ishqalash", () => { rubs++; draw(); }), button("Yerga ulash (zaryadsizlantirish)", () => { rubs = 0; draw(); }, "ghost"));
    draw();
  };

  // ===================================================================
  // 9. Kulon qonuni
  // ===================================================================
  W.coulomb = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧲 Kulon qonuni: F = k·|q₁·q₂| / r²");
    let q1 = 2, q2 = -3, r = 0.3;
    function draw() {
      const k = 9e9, F = (k * Math.abs(q1 * q2) * 1e-12) / (r * r), attr = q1 * q2 < 0;
      const g = svg(340, 140, "fz-svg"), x1 = 170 - r * 300, x2 = 170 + r * 300, L = Math.min(110, 12 + Math.log10(1 + F * 100) * 40);
      for (const [x, q] of [[x1, q1], [x2, q2]]) { s("circle", { cx: x, cy: 70, r: 12 + Math.abs(q) * 2.5, fill: q > 0 ? "#ef4444" : q < 0 ? "#3b82f6" : "#64748b" }, g); s("text", { x, y: 75, "text-anchor": "middle", "font-size": 13, "font-weight": 900, fill: "#fff", text: (q > 0 ? "+" : "") + q }, g); }
      const dir = attr ? 1 : -1;
      if (q1 && q2) { s("line", { x1: x1, y1: 112, x2: x1 + dir * L, y2: 112, stroke: "#fde047", "stroke-width": 4, "marker-end": "url(#fzA)" }, g); s("line", { x1: x2, y1: 112, x2: x2 - dir * L, y2: 112, stroke: "#fde047", "stroke-width": 4, "marker-end": "url(#fzA)" }, g); }
      s("defs", {}, g).innerHTML = `<marker id="fzA" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#fde047"/></marker>`;
      s("text", { x: 170, y: 30, "text-anchor": "middle", "font-size": 12, fill: "currentColor", text: `r = ${num(r)} m` }, g);
      stage.innerHTML = ""; stage.append(g);
      out.innerHTML = `<div class="big-num">F = 9·10⁹ · ${Math.abs(q1)}·10⁻⁶ · ${Math.abs(q2)}·10⁻⁶ / ${num(r)}² = ${r2(F, 3)} N</div><div>${!q1 || !q2 ? "Zaryadlardan biri nol — kuch yo‘q." : attr ? "Har xil ishorali zaryadlar <b>tortishadi</b>." : "Bir xil ishorali zaryadlar <b>itarishadi</b>."} Masofa 2 marta ortsa, kuch <b>4 marta</b> kamayadi.</div>`;
    }
    controls.append(slider({ label: "q₁", min: -5, max: 5, value: q1, fmt: (v) => v + " mkKl", onInput: (v) => { q1 = v; draw(); } }), slider({ label: "q₂", min: -5, max: 5, value: q2, fmt: (v) => v + " mkKl", onInput: (v) => { q2 = v; draw(); } }), slider({ label: "Masofa r", min: 0.1, max: 0.45, step: 0.05, value: r, fmt: (v) => num(v) + " m", onInput: (v) => { r = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 10. Elektr maydon: kuch chiziqlari, superpozitsiya, sinov zaryadi
  // ===================================================================
  W.efield = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌐 Elektr maydon kuch chiziqlari — zaryadlarni suring");
    const PRE = { "Bitta +": [[0, 0, 1]], "+ va −": [[-0.8, 0, 1], [0.8, 0, -1]], "+ va +": [[-0.8, 0, 1], [0.8, 0, 1]], "Yassi kondensator": Array.from({ length: 7 }, (_, i) => [-0.7, -0.9 + i * 0.3, 1]).concat(Array.from({ length: 7 }, (_, i) => [0.7, -0.9 + i * 0.3, -1])) };
    let Q = (p.preset ? PRE[p.preset] : PRE["+ va −"]).map((q) => [...q]), probe = [0, 0.7], drag = null;
    const Wd = 340, Hd = 240, sc = 90, cx = Wd / 2, cy = Hd / 2;
    const E = (x, y) => { let ex = 0, ey = 0; for (const [qx, qy, q] of Q) { const dx = x - qx, dy = y - qy, r2_ = dx * dx + dy * dy + 0.004, r3 = r2_ * Math.sqrt(r2_); ex += (q * dx) / r3; ey += (q * dy) / r3; } return [ex, ey]; };
    const cv = animCanvas(stage, Wd, Hd, (c) => {
      c.clearRect(0, 0, Wd, Hd);
      // kuch chiziqlari: musbat zaryadlardan chiqadi
      c.strokeStyle = "rgba(125,211,252,.75)"; c.lineWidth = 1.2;
      for (const [qx, qy, q] of Q) {
        if (q <= 0 && Q.some((z) => z[2] > 0)) continue; const n = Q.length > 4 ? 3 : 14;
        for (let i = 0; i < n; i++) {
          let a = (i / n) * 2 * PI, x = qx + 0.06 * Math.cos(a), y = qy + 0.06 * Math.sin(a); const sg = q > 0 ? 1 : -1; c.beginPath(); c.moveTo(cx + x * sc, cy - y * sc);
          for (let k = 0; k < 260; k++) { const [ex, ey] = E(x, y), m = Math.hypot(ex, ey) || 1; x += (sg * 0.02 * ex) / m; y += (sg * 0.02 * ey) / m; c.lineTo(cx + x * sc, cy - y * sc); if (Math.abs(x) > 2.2 || Math.abs(y) > 1.6 || Q.some(([a2, b2, q2]) => q2 * q < 0 && Math.hypot(x - a2, y - b2) < 0.05)) break; }
          c.stroke();
        }
      }
      for (const [qx, qy, q] of Q) { c.fillStyle = q > 0 ? "#ef4444" : "#3b82f6"; c.beginPath(); c.arc(cx + qx * sc, cy - qy * sc, Q.length > 4 ? 7 : 13, 0, 7); c.fill(); c.fillStyle = "#fff"; c.font = "900 14px system-ui"; c.textAlign = "center"; c.fillText(q > 0 ? "+" : "−", cx + qx * sc, cy - qy * sc + 5); }
      const [ex, ey] = E(probe[0], probe[1]), m = Math.hypot(ex, ey), L = Math.min(60, 14 + m * 12), px = cx + probe[0] * sc, py = cy - probe[1] * sc;
      c.fillStyle = "#fde047"; c.beginPath(); c.arc(px, py, 5, 0, 7); c.fill(); arrow(c, px, py, px + (ex / m) * L, py - (ey / m) * L, "#fde047", 2.5);
      label(c, px, py + 22, "E ≈ " + r2(m, 2), "#fde047");
    });
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width * Wd - cx) / sc, -((e.clientY - r.top) / r.height * Hd - cy) / sc]; };
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", (e) => { const [x, y] = pos(e); drag = Q.find((q) => Math.hypot(q[0] - x, q[1] - y) < 0.25) || "probe"; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; const [x, y] = pos(e); if (drag === "probe") probe = [x, y]; else { drag[0] = x; drag[1] = y; } });
    cv.addEventListener("pointerup", () => (drag = null));
    controls.append(buttons(Object.keys(PRE), (i) => { Q = PRE[Object.keys(PRE)[i]].map((q) => [...q]); }, Object.keys(PRE).indexOf(p.preset || "+ va −")));
    out.innerHTML = "Kuch chiziqlari <b>musbat</b> zaryaddan chiqib, <b>manfiy</b>ga kiradi. Sariq nuqta — sinov zaryadi: strelka maydon kuchlanganligi <b>E</b> yo‘nalishi (uni suring). Bir necha zaryad maydonlari <b>vektor sifatida qo‘shiladi</b> (superpozitsiya). Zaryadlarni ham surish mumkin.";
  };

  // ===================================================================
  // 11. Elektr zanjiri: Om qonuni, ketma-ket va parallel ulash, reostat, manbalar
  // ===================================================================
  W.circuit = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔌 Elektr zanjiri — kuchlanish va qarshilikni o‘zgartiring");
    let mode = p.mode || "single", U = 6, R1 = 10, R2 = 20, rh = 50, n = 1, conn = "series";
    const MODES = { single: "Bitta rezistor (Om qonuni)", series: "Ketma-ket", parallel: "Parallel", rheo: "Reostat bilan", cells: "Manbalarni ulash" };
    let phase = 0;
    function calc() {
      if (mode === "single") return { R: R1, I: U / R1, parts: [[R1, U, U / R1]] };
      if (mode === "series") { const R = R1 + R2, I = U / R; return { R, I, parts: [[R1, I * R1, I], [R2, I * R2, I]] }; }
      if (mode === "parallel") { const R = (R1 * R2) / (R1 + R2); return { R, I: U / R, parts: [[R1, U, U / R1], [R2, U, U / R2]] }; }
      if (mode === "rheo") { const Rr = (rh / 100) * 40, R = R1 + Rr, I = U / R; return { R, I, parts: [[R1, I * R1, I], [Rr, I * Rr, I]] }; }
      const E = 1.5, r = 0.5, Rl = 5; const Et = conn === "series" ? E * n : E, rt = conn === "series" ? r * n : r / n, I = Et / (Rl + rt); return { R: Rl, I, parts: [[Rl, I * Rl, I]], Et, rt };
    }
    const cv = animCanvas(stage, 340, 210, (c, dt) => {
      const C = calc(); phase += dt * C.I * 6; c.clearRect(0, 0, 340, 210); c.strokeStyle = ink(); c.lineWidth = 2.5;
      const path = [[40, 40], [300, 40], [300, 170], [40, 170], [40, 40]];
      c.beginPath(); path.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
      // elektronlar (manfiydan musbatga) — tok yo'nalishiga teskari
      const per = 2 * (260 + 130); c.fillStyle = "#38bdf8";
      for (let k = 0; k < 26; k++) { let d = ((k / 26) * per - phase * 20) % per; if (d < 0) d += per; let x, y; if (d < 260) { x = 40 + d; y = 40; } else if (d < 390) { x = 300; y = 40 + (d - 260); } else if (d < 650) { x = 300 - (d - 390); y = 170; } else { x = 40; y = 170 - (d - 650); } c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); }
      // manba
      c.fillStyle = "#0b1220"; c.fillRect(28, 85, 24, 40); c.strokeStyle = "#fde047"; c.lineWidth = 3; c.beginPath(); c.moveTo(22, 98); c.lineTo(58, 98); c.moveTo(30, 112); c.lineTo(50, 112); c.stroke();
      label(c, 40, 140, mode === "cells" ? `${n}×1,5 V` : U + " V", "#fde047");
      // rezistorlar
      const box = (x, y, w, txt, col = "#f97316") => { c.fillStyle = "#0b1220"; c.fillRect(x - w / 2, y - 11, w, 22); c.strokeStyle = col; c.lineWidth = 2.5; c.strokeRect(x - w / 2, y - 11, w, 22); label(c, x, y - 18, txt, col); };
      if (mode === "parallel") { c.strokeStyle = ink(); c.lineWidth = 2.5; c.beginPath(); c.moveTo(130, 40); c.lineTo(130, 100); c.lineTo(230, 100); c.lineTo(230, 40); c.stroke(); box(180, 40, 54, "R₁=" + R1 + "Ω"); box(180, 100, 54, "R₂=" + R2 + "Ω", "#a78bfa"); }
      else if (mode === "series" || mode === "rheo") { box(130, 40, 54, "R₁=" + R1 + "Ω"); box(230, 40, 54, mode === "rheo" ? "reostat" : "R₂=" + R2 + "Ω", "#a78bfa"); if (mode === "rheo") { c.strokeStyle = "#fde047"; c.beginPath(); const sx = 205 + rh / 2; c.moveTo(sx, 18); c.lineTo(sx, 29); c.stroke(); } }
      else { const I = calc().I, gl = Math.min(1, I / 1.2); c.fillStyle = `rgba(253,224,71,${0.15 + gl * 0.85})`; c.beginPath(); c.arc(180, 40, 14 + gl * 10, 0, 7); c.fill(); c.strokeStyle = ink(); c.beginPath(); c.arc(180, 40, 12, 0, 7); c.stroke(); if (mode === "single") label(c, 180, 72, "R=" + R1 + "Ω", "#f97316"); }
      // asboblar
      c.fillStyle = "#16a34a"; c.beginPath(); c.arc(170, 170, 15, 0, 7); c.fill(); c.fillStyle = "#fff"; c.font = "900 13px system-ui"; c.textAlign = "center"; c.fillText("A", 170, 175);
      label(c, 170, 200, r2(calc().I, 3) + " A", "#86efac");
    });
    void cv;
    function info() {
      const C = calc();
      out.innerHTML = mode === "cells" ? `<div class="big-num">I = E / (R + r) = ${r2(C.Et, 2)} / (${C.R} + ${r2(C.rt, 2)}) = ${r2(C.I, 3)} A</div><div>${conn === "series" ? "Ketma-ket: EYuKlar qo‘shiladi (E = n·E₁), ichki qarshilik ham ortadi (r = n·r₁)." : "Parallel: EYuK o‘zgarmaydi, ichki qarshilik n marta kamayadi — batareya uzoqroq ishlaydi."}</div>`
        : `<div class="big-num">R = ${r2(C.R, 2)} Ω · I = U / R = ${U} / ${r2(C.R, 2)} = ${r2(C.I, 3)} A</div>
        ${C.parts.map(([R, u, i], k) => `<div>${["R₁", "R₂"][k]} = ${r2(R, 1)} Ω: kuchlanish <b>${r2(u, 2)} V</b>, tok <b>${r2(i, 3)} A</b></div>`).join("")}
        <div class="muted">${mode === "series" ? "Ketma-ket: tok hamma joyda bir xil, kuchlanishlar qo‘shiladi, R = R₁ + R₂." : mode === "parallel" ? "Parallel: kuchlanish bir xil, toklar qo‘shiladi, 1/R = 1/R₁ + 1/R₂ — umumiy qarshilik eng kichigidan ham kichik." : mode === "rheo" ? "Reostat surgichi qarshilikni o‘zgartiradi — tok kuchi rostlanadi (yorug‘lik, ovoz balandligi)." : "Om qonuni: tok kuchi kuchlanishga to‘g‘ri, qarshilikka teskari proporsional. Ko‘k nuqtalar — elektronlar."}</div>`;
    }
    function render() {
      controls.innerHTML = "";
      if (!p.mode) controls.append(buttons(Object.values(MODES), (i) => { mode = Object.keys(MODES)[i]; render(); }, Object.keys(MODES).indexOf(mode)));
      if (mode !== "cells") controls.append(slider({ label: "Kuchlanish U", min: 1, max: 24, value: U, fmt: (v) => v + " V", onInput: (v) => { U = v; info(); } }), slider({ label: "R₁", min: 1, max: 50, value: R1, fmt: (v) => v + " Ω", onInput: (v) => { R1 = v; info(); } }));
      if (mode === "series" || mode === "parallel") controls.append(slider({ label: "R₂", min: 1, max: 50, value: R2, fmt: (v) => v + " Ω", onInput: (v) => { R2 = v; info(); } }));
      if (mode === "rheo") controls.append(slider({ label: "Reostat surgichi", min: 0, max: 100, value: rh, fmt: (v) => `${num((v / 100) * 40)} Ω`, onInput: (v) => { rh = v; info(); } }));
      if (mode === "cells") controls.append(slider({ label: "Elementlar soni", min: 1, max: 4, value: n, onInput: (v) => { n = v; info(); } }), buttons(["Ketma-ket", "Parallel"], (i) => { conn = ["series", "parallel"][i]; info(); }, 0));
      info();
    }
    render();
  };

  // ===================================================================
  // 12. Kondensator: sig'im, ulash
  // ===================================================================
  W.capacitor = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔋 Yassi kondensator: C = ε·ε₀·S / d");
    let S = 100, d = 2, eps = 1, U = 12, mode = 0, C1 = 4, C2 = 6;
    const EPS = [["Havo", 1], ["Qog‘oz", 2.2], ["Shisha", 7], ["Suv", 81]];
    function draw() {
      if (mode === 0) {
        const C = (eps * 8.85e-12 * S * 1e-4) / (d * 1e-3), q = C * U;
        const g = svg(340, 170, "fz-svg"), w = 40 + S * 0.9, gap = 12 + d * 12;
        s("rect", { x: 170 - w / 2, y: 85 - gap / 2 - 8, width: w, height: 8, fill: "#ef4444" }, g); s("rect", { x: 170 - w / 2, y: 85 + gap / 2, width: w, height: 8, fill: "#3b82f6" }, g);
        if (eps > 1) s("rect", { x: 170 - w / 2, y: 85 - gap / 2, width: w, height: gap, fill: "#facc15", opacity: 0.25 }, g);
        for (let i = 0; i < 7; i++) { const x = 170 - w / 2 + ((i + 0.5) * w) / 7; s("line", { x1: x, y1: 85 - gap / 2, x2: x, y2: 85 + gap / 2, stroke: "#7dd3fc", "stroke-width": 1.2 }, g); }
        stage.innerHTML = ""; stage.append(g);
        out.innerHTML = `<div class="big-num">C = ${r2(C * 1e12, 2)} pF · q = C·U = ${r2(q * 1e9, 3)} nKl · W = CU²/2 = ${r2((C * U * U) / 2 * 1e9, 3)} nJ</div><div class="muted">Plastinkalar yuzi S ortsa yoki oralig‘i d kamaysa — sig‘im ortadi. Dielektrik (${EPS.find((e) => e[1] === eps)[0]}, ε = ${eps}) sig‘imni ε marta oshiradi.</div>`;
      } else {
        const ser = (C1 * C2) / (C1 + C2), par = C1 + C2;
        stage.innerHTML = `<div class="fz-capcmp"><div><b>Parallel</b><span>C = C₁ + C₂</span><em>${r2(par, 2)} mkF</em></div><div><b>Ketma-ket</b><span>1/C = 1/C₁ + 1/C₂</span><em>${r2(ser, 2)} mkF</em></div></div>`;
        out.innerHTML = `Parallel ulanganda sig‘imlar qo‘shiladi (plastinka yuzi ortgandek). Ketma-ket ulanganda umumiy sig‘im eng kichigidan ham kichik bo‘ladi (oraliq ortgandek), lekin katta kuchlanishga chidaydi.`;
      }
    }
    function render() {
      controls.innerHTML = ""; controls.append(buttons(["Bitta kondensator", "Ulash: parallel va ketma-ket"], (i) => { mode = i; render(); }, mode));
      if (mode === 0) controls.append(slider({ label: "Yuza S", min: 20, max: 200, value: S, fmt: (v) => v + " sm²", onInput: (v) => { S = v; draw(); } }), slider({ label: "Oraliq d", min: 0.5, max: 6, step: 0.5, value: d, fmt: (v) => num(v) + " mm", onInput: (v) => { d = v; draw(); } }), slider({ label: "Kuchlanish U", min: 1, max: 100, value: U, fmt: (v) => v + " V", onInput: (v) => { U = v; draw(); } }), buttons(EPS.map((e) => e[0]), (i) => { eps = EPS[i][1]; draw(); }, 0));
      else controls.append(slider({ label: "C₁", min: 1, max: 20, value: C1, fmt: (v) => v + " mkF", onInput: (v) => { C1 = v; draw(); } }), slider({ label: "C₂", min: 1, max: 20, value: C2, fmt: (v) => v + " mkF", onInput: (v) => { C2 = v; draw(); } }));
      draw();
    }
    render();
  };
})();
