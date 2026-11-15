/* “Ish qurollari” bo'limi uchun jonli tajribalar:
   3D jismlar (aylantiriladigan model), tekis figuralar, hayotdagi misollar,
   hosila (kesuvchi → urinma, spidometr, quti optimallashtirish), integral (tezlik → yo'l, idish to'lishi, aylanish jismi). */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const PI = Math.PI;
  const r2 = (v) => num(Math.round(v * 100) / 100);
  const ink = () => getComputedStyle(document.body).color || "#fff";

  // ===================================================================
  // Kichik 3D dvigatel (canvas): yoqlar, yorug'lik, sichqoncha/barmoq bilan aylantirish
  // ===================================================================
  function ngon(n, r, y, a0 = PI / 2) { const v = []; for (let i = 0; i < n; i++) { const a = a0 + (i / n) * 2 * PI; v.push([r * Math.cos(a), y, r * Math.sin(a)]); } return v; }
  /** Jism to'ri: V — uchlar, F — yoqlar (uchlar indekslari), smooth — silliq jism (qirralar chizilmaydi) */
  function mesh(kind, d) {
    const V = [], F = []; let smooth = false;
    const add = (pts) => { const o = V.length; V.push(...pts); return o; };
    if (kind === "cube" || kind === "cuboid") {
      const a = d.a / 2, b = (kind === "cube" ? d.a : d.b) / 2, c = (kind === "cube" ? d.a : d.c) / 2;
      add([[-a, -c, -b], [a, -c, -b], [a, -c, b], [-a, -c, b], [-a, c, -b], [a, c, -b], [a, c, b], [-a, c, b]]);
      F.push([0, 1, 2, 3], [7, 6, 5, 4], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]);
    } else if (kind === "prism" || kind === "pyramid" || kind === "cylinder" || kind === "cone" || kind === "frustum") {
      const n = kind === "cylinder" || kind === "cone" || kind === "frustum" ? 40 : d.n;
      smooth = n >= 40;
      const r = kind === "prism" || kind === "pyramid" ? d.a / (2 * Math.sin(PI / n)) : d.r, hh = d.h / 2;
      const b0 = add(ngon(n, r, -hh));
      if (kind === "pyramid" || kind === "cone") {
        const t = add([[0, hh, 0]]);
        for (let i = 0; i < n; i++) F.push([b0 + i, t, b0 + (i + 1) % n]);
      } else {
        const t0 = add(ngon(n, kind === "frustum" ? d.r2 : r, hh));
        for (let i = 0; i < n; i++) F.push([b0 + i, t0 + i, t0 + (i + 1) % n, b0 + (i + 1) % n]);
        F.push([...Array(n).keys()].map((i) => t0 + n - 1 - i));
      }
      F.push([...Array(n).keys()].map((i) => b0 + i));
    } else if (kind === "sphere") {
      smooth = true; const R = d.r, la = 18, lo = 32;
      for (let i = 0; i <= la; i++) { const t = (i / la) * PI; for (let j = 0; j < lo; j++) { const p = (j / lo) * 2 * PI; V.push([R * Math.sin(t) * Math.cos(p), R * Math.cos(t), R * Math.sin(t) * Math.sin(p)]); } }
      for (let i = 0; i < la; i++) for (let j = 0; j < lo; j++) { const a = i * lo + j, b = i * lo + (j + 1) % lo; F.push([a, b, b + lo, a + lo]); }
    } else if (kind === "revolve") {
      // y o'qi bo'ylab aylanish jismi: d.f(x) — radius, x ∈ [d.a, d.b]
      smooth = true; const st = 28, lo = 32;
      for (let i = 0; i <= st; i++) { const x = d.a + ((d.b - d.a) * i) / st, r = Math.max(0.0001, d.f(x)); for (let j = 0; j < lo; j++) { const p = (j / lo) * 2 * PI; V.push([r * Math.cos(p), x - (d.a + d.b) / 2, r * Math.sin(p)]); } }
      for (let i = 0; i < st; i++) for (let j = 0; j < lo; j++) { const a = i * lo + j, b = i * lo + (j + 1) % lo; F.push([a, a + lo, b + lo, b]); }
    }
    const center = [0, 1, 2].map((k) => V.reduce((q, p) => q + p[k], 0) / V.length);
    return { V, F, smooth, center, axis: kind === "revolve" };
  }

  function viewer(stage, opts = {}) {
    const W0 = 340, H0 = 270;
    const cv = h("canvas", { class: "qv-canvas", width: W0 * 2, height: H0 * 2, style: `aspect-ratio:${W0}/${H0}`, "aria-label": "3D model — aylantirish uchun suring" });
    const hint = h("div", { class: "qv-hint" }, "👆 Barmoq yoki sichqoncha bilan aylantiring");
    stage.append(h("div", { class: "qv-wrap" }, cv, hint));
    const ctx = cv.getContext("2d"); ctx.scale(2, 2);
    let yaw = -0.6, pitch = -0.45, auto = true, drag = null, m = null, color = opts.color || "#f97316", wire = false, labels = [], scale = 1, vis = true, raf = 0;
    cv.addEventListener("pointerdown", (e) => { drag = [e.clientX, e.clientY, yaw, pitch]; auto = false; cv.setPointerCapture(e.pointerId); hint.style.opacity = 0; });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; yaw = drag[2] + (e.clientX - drag[0]) * 0.01; pitch = Math.max(-1.4, Math.min(1.4, drag[3] + (e.clientY - drag[1]) * 0.01)); draw(); });
    const up = () => { drag = null; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.style.touchAction = "none";
    const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    function project(p) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x = p[0] * cy - p[2] * sy, z0 = p[0] * sy + p[2] * cy;
      const y = p[1] * cp - z0 * sp, z = p[1] * sp + z0 * cp;
      const f = 11 / (11 + z);
      return [W0 / 2 + x * scale * 34 * f, H0 / 2 - y * scale * 34 * f, z];
    }
    function draw() {
      ctx.clearRect(0, 0, W0, H0);
      if (!m) return;
      const P = m.V.map(project), base = hex(color);
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const rot = (n) => { const x = n[0] * cy - n[2] * sy, z0 = n[0] * sy + n[2] * cy; return [x, n[1] * cp - z0 * sp, n[1] * sp + z0 * cp]; };
      const Lg = [-0.45, 0.6, -0.66];
      const faces = m.F.map((f) => {
        const A = m.V[f[0]], B = m.V[f[1]], C = m.V[f[Math.min(2, f.length - 1)]];
        const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
        let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const ln = Math.hypot(...n) || 1; n = n.map((q) => q / ln);
        // normalni tashqariga qaratamiz (qavariq jism: markazdan yoq markaziga)
        const c = [0, 1, 2].map((k) => f.reduce((s2, i) => s2 + m.V[i][k], 0) / f.length);
        const ref = m.axis ? [0, c[1], 0] : m.center;
        if (n[0] * (c[0] - ref[0]) + n[1] * (c[1] - ref[1]) + n[2] * (c[2] - ref[2]) < 0) n = n.map((q) => -q);
        const nr = rot(n);
        const lit = Math.max(0, nr[0] * Lg[0] + nr[1] * Lg[1] + nr[2] * Lg[2]);
        return { f, z: f.reduce((s2, i) => s2 + P[i][2], 0) / f.length, front: nr[2] < 0.0001, lit };
      }).sort((p, q) => q.z - p.z);
      for (const fc of faces) {
        if (!wire && !fc.front) continue;
        ctx.beginPath(); fc.f.forEach((i, k) => (k ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1]))); ctx.closePath();
        const k = 0.35 + fc.lit * 0.75;
        const rgb = base.map((c) => Math.min(255, Math.round(c * k + 18)));
        ctx.fillStyle = wire ? `rgba(${rgb.join(",")},${fc.front ? 0.18 : 0.06})` : `rgb(${rgb.join(",")})`;
        ctx.fill();
        if (!m.smooth || wire) { ctx.strokeStyle = wire ? (fc.front ? color : "rgba(255,255,255,.35)") : "rgba(0,0,0,.35)"; ctx.lineWidth = wire ? (fc.front ? 1.6 : 1) : 1.2; if (wire && !fc.front) ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]); }
        else { ctx.strokeStyle = `rgb(${rgb.join(",")})`; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      // o'lcham chiziqlari va yozuvlar
      ctx.font = "700 12px system-ui, sans-serif"; ctx.textAlign = "center";
      for (const [p1, p2, txt, col] of labels) {
        const a = project(p1), b = project(p2);
        ctx.strokeStyle = col || "#fde047"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = col || "#fde047"; ctx.beginPath(); ctx.arc(a[0], a[1], 3, 0, 7); ctx.arc(b[0], b[1], 3, 0, 7); ctx.fill();
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        ctx.fillStyle = "rgba(0,0,0,.6)"; const w = ctx.measureText(txt).width + 10; ctx.fillRect(mx - w / 2, my - 9, w, 18);
        ctx.fillStyle = col || "#fde047"; ctx.fillText(txt, mx, my + 4);
      }
    }
    const loop = () => { if (cv.isConnected) { if (auto && vis) { yaw += 0.006; draw(); } raf = requestAnimationFrame(loop); } };
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { vis = es[0].isIntersecting; }).observe(cv);
    raf = requestAnimationFrame(loop);
    return {
      set(mm, lbls = [], fit = 3) { m = mm; labels = lbls; scale = 3.7 / Math.max(0.5, fit); draw(); },
      wire(v) { wire = v; draw(); },
      color(c) { color = c; draw(); },
      spin(v) { auto = v; },
    };
  }

  // ===================================================================
  // 1. 3D jism: model + o'lchamlar + formulalar
  // ===================================================================
  const SOLIDS = {
    cube: { n: "Kub", c: "#f97316", dims: [["a", "Qirra a", 1, 8, 3]], calc: (d) => ({ V: d.a ** 3, S: 6 * d.a * d.a, fV: "V = a³", fS: "S = 6a²", x: [["Diagonal", "d = a√3", d.a * Math.sqrt(3)], ["Yoq diagonali", "a√2", d.a * Math.sqrt(2)]], el: "8 ta uch, 12 ta qirra, 6 ta yoq (hammasi teng kvadratlar)" }), lab: (d) => [[[-d.a / 2, -d.a / 2, d.a / 2], [d.a / 2, -d.a / 2, d.a / 2], "a = " + d.a]] },
    cuboid: { n: "To‘g‘ri burchakli parallelepiped", c: "#38bdf8", dims: [["a", "Uzunlik a", 1, 8, 5], ["b", "Eni b", 1, 8, 3], ["c", "Balandlik c", 1, 8, 2]], calc: (d) => ({ V: d.a * d.b * d.c, S: 2 * (d.a * d.b + d.b * d.c + d.a * d.c), fV: "V = a·b·c", fS: "S = 2(ab + bc + ac)", x: [["Diagonal", "d = √(a² + b² + c²)", Math.hypot(d.a, d.b, d.c)]], el: "8 ta uch, 12 ta qirra, 6 ta yoq (qarama-qarshi yoqlar teng to‘g‘ri to‘rtburchaklar)" }), lab: (d) => [[[-d.a / 2, -d.c / 2, d.b / 2], [d.a / 2, -d.c / 2, d.b / 2], "a = " + d.a], [[d.a / 2, -d.c / 2, d.b / 2], [d.a / 2, -d.c / 2, -d.b / 2], "b = " + d.b, "#86efac"], [[d.a / 2, -d.c / 2, -d.b / 2], [d.a / 2, d.c / 2, -d.b / 2], "c = " + d.c, "#f9a8d4"]] },
    prism: { n: "Muntazam prizma", c: "#a78bfa", dims: [["n", "Asos burchaklari soni n", 3, 8, 6], ["a", "Asos tomoni a", 1, 6, 2], ["h", "Balandlik h", 1, 8, 4]], calc: (d) => { const Sb = (d.n * d.a * d.a) / (4 * Math.tan(PI / d.n)); return { V: Sb * d.h, S: 2 * Sb + d.n * d.a * d.h, fV: "V = S<sub>asos</sub>·h", fS: "S = 2S<sub>asos</sub> + P·h", x: [["Asos yuzi", `S<sub>asos</sub> = n·a²/(4·tg(180°/n))`, Sb], ["Yon sirt", "P·h", d.n * d.a * d.h]], el: `${2 * d.n} ta uch, ${3 * d.n} ta qirra, ${d.n + 2} ta yoq (2 ta asos + ${d.n} ta yon yoq)` }; }, lab: (d) => [[[0, -d.h / 2, 0], [0, d.h / 2, 0], "h = " + d.h]] },
    pyramid: { n: "Muntazam piramida", c: "#facc15", dims: [["n", "Asos burchaklari soni n", 3, 8, 4], ["a", "Asos tomoni a", 1, 6, 3], ["h", "Balandlik h", 1, 8, 4]], calc: (d) => { const Sb = (d.n * d.a * d.a) / (4 * Math.tan(PI / d.n)), ri = d.a / (2 * Math.tan(PI / d.n)), ap = Math.hypot(d.h, ri); return { V: (Sb * d.h) / 3, S: Sb + (d.n * d.a * ap) / 2, fV: "V = ⅓·S<sub>asos</sub>·h", fS: "S = S<sub>asos</sub> + ½·P·apofema", x: [["Apofema", "√(h² + r²)", ap], ["Asos yuzi", "S<sub>asos</sub>", Sb]], el: `${d.n + 1} ta uch, ${2 * d.n} ta qirra, ${d.n + 1} ta yoq (1 ta asos + ${d.n} ta uchburchak)` }; }, lab: (d) => [[[0, -d.h / 2, 0], [0, d.h / 2, 0], "h = " + d.h]] },
    cylinder: { n: "Silindr", c: "#22c55e", dims: [["r", "Radius r", 1, 5, 2], ["h", "Balandlik h", 1, 8, 5]], calc: (d) => ({ V: PI * d.r * d.r * d.h, S: 2 * PI * d.r * (d.r + d.h), fV: "V = πr²h", fS: "S = 2πr(r + h)", x: [["Yon sirt", "2πrh", 2 * PI * d.r * d.h], ["Asos yuzi", "πr²", PI * d.r * d.r]], el: "2 ta doira asos + egilgan yon sirt (yoyilsa — to‘g‘ri to‘rtburchak)" }), lab: (d) => [[[0, -d.h / 2, 0], [d.r, -d.h / 2, 0], "r = " + d.r], [[d.r, -d.h / 2, 0], [d.r, d.h / 2, 0], "h = " + d.h, "#f9a8d4"]] },
    cone: { n: "Konus", c: "#ef4444", dims: [["r", "Radius r", 1, 5, 2], ["h", "Balandlik h", 1, 8, 5]], calc: (d) => { const l = Math.hypot(d.r, d.h); return { V: (PI * d.r * d.r * d.h) / 3, S: PI * d.r * (d.r + l), fV: "V = ⅓πr²h", fS: "S = πr(r + l)", x: [["Yasovchi", "l = √(r² + h²)", l], ["Yon sirt", "πrl", PI * d.r * l]], el: "1 ta doira asos + uch (cho‘qqi) + egilgan yon sirt (yoyilsa — doira sektori)" }; }, lab: (d) => [[[0, -d.h / 2, 0], [d.r, -d.h / 2, 0], "r = " + d.r], [[0, -d.h / 2, 0], [0, d.h / 2, 0], "h = " + d.h, "#f9a8d4"]] },
    sphere: { n: "Shar", c: "#0ea5e9", dims: [["r", "Radius r", 1, 5, 3]], calc: (d) => ({ V: (4 / 3) * PI * d.r ** 3, S: 4 * PI * d.r * d.r, fV: "V = ⁴⁄₃πr³", fS: "S = 4πr²", x: [["Katta doira yuzi", "πr²", PI * d.r * d.r], ["Diametr", "d = 2r", 2 * d.r]], el: "Markazdan bir xil r masofadagi barcha nuqtalar to‘plami. Uchi ham, qirrasi ham yo‘q." }), lab: (d) => [[[0, 0, 0], [d.r, 0, 0], "r = " + d.r]] },
    frustum: { n: "Kesik konus", c: "#fb923c", dims: [["r", "Pastki radius R", 1, 5, 3], ["r2", "Ustki radius r", 0.5, 5, 1.5], ["h", "Balandlik h", 1, 8, 4]], calc: (d) => { const l = Math.hypot(d.r - d.r2, d.h); return { V: (PI * d.h * (d.r * d.r + d.r * d.r2 + d.r2 * d.r2)) / 3, S: PI * (d.r * d.r + d.r2 * d.r2 + (d.r + d.r2) * l), fV: "V = ⅓πh(R² + Rr + r²)", fS: "S = π(R² + r² + (R + r)l)", x: [["Yasovchi", "l = √((R − r)² + h²)", l]], el: "2 ta har xil doira asos + yon sirt" }; }, lab: (d) => [[[0, -d.h / 2, 0], [0, d.h / 2, 0], "h = " + d.h]] },
  };
  W.shape3d = (root, p) => {
    let kind = p.kind || "cube";
    const S0 = SOLIDS[kind];
    const { stage, controls, out } = frame(root, p.title || `🧊 ${S0.n} — 3D model`);
    const v = viewer(stage, { color: S0.c });
    const d = {}; S0.dims.forEach(([k, , , , val]) => (d[k] = val));
    function draw() {
      const S = SOLIDS[kind], c = S.calc(d), dims = { ...d };
      if (kind === "frustum" && dims.r2 > dims.r) dims.r2 = dims.r;
      v.set(mesh(kind, dims), S.lab(dims), Math.max(dims.a || 0, dims.b || 0, dims.c || 0, dims.h || 0, (dims.r || 0) * 2, kind === "prism" || kind === "pyramid" ? (dims.a || 0) / Math.sin(PI / dims.n) : 0));
      out.innerHTML = `<div class="big-num">V = ${r2(c.V)} &nbsp;·&nbsp; S = ${r2(c.S)}</div>
        <div class="steps"><div>Hajm: <b>${c.fV}</b> · To‘la sirt: <b>${c.fS}</b></div>
        ${c.x.map(([n, f, val]) => `<div>${n}: ${f} ≈ <b>${r2(val)}</b></div>`).join("")}
        <div class="muted">Elementlari: ${c.el}</div></div>`;
    }
    S0.dims.forEach(([k, label, mn, mx]) => controls.append(slider({ label, min: mn, max: mx, step: k === "n" ? 1 : 0.5, value: d[k], fmt: (x) => num(x), onInput: (x) => { d[k] = x; draw(); } })));
    controls.append(h("label", { class: "kb-check" }, h("input", { type: "checkbox", onchange: (e) => v.wire(e.target.checked) }), " Shaffof (ichini ko‘rish)"));
    draw();
  };
  W.shape3d.SOLIDS = SOLIDS;

  // ===================================================================
  // 2. Tekis figuralar: chizma + elementlar + formulalar
  // ===================================================================
  const FIG = {
    triangle: { n: "Uchburchak", dims: [["a", "Tomon a (asos)", 2, 10, 6], ["b", "Tomon b", 2, 10, 5], ["c", "Tomon c", 2, 10, 4]] },
    square: { n: "Kvadrat", dims: [["a", "Tomon a", 1, 10, 5]] },
    rect: { n: "To‘g‘ri to‘rtburchak", dims: [["a", "Uzunlik a", 1, 10, 7], ["b", "Eni b", 1, 10, 4]] },
    parallelogram: { n: "Parallelogramm", dims: [["a", "Tomon a", 2, 10, 7], ["b", "Tomon b", 1, 8, 4], ["al", "Burchak α", 20, 90, 60]] },
    rhombus: { n: "Romb", dims: [["d1", "Diagonal d₁", 2, 12, 8], ["d2", "Diagonal d₂", 2, 12, 5]] },
    trapezoid: { n: "Trapetsiya", dims: [["a", "Katta asos a", 3, 12, 9], ["b", "Kichik asos b", 1, 10, 5], ["hh", "Balandlik h", 1, 8, 4]] },
    circle: { n: "Doira va aylana", dims: [["r", "Radius r", 1, 8, 4], ["al", "Sektor burchagi", 10, 360, 90]] },
    polygon: { n: "Muntazam ko‘pburchak", dims: [["n", "Tomonlar soni n", 3, 12, 6], ["a", "Tomon a", 1, 8, 4]] },
  };
  W.shape2d = (root, p) => {
    const kind = p.kind || "triangle", F0 = FIG[kind];
    const { stage, controls, out } = frame(root, p.title || `📐 ${F0.n} — o‘lchamlarni o‘zgartiring`);
    const d = {}; F0.dims.forEach(([k, , , , v]) => (d[k] = v));
    function draw() {
      const g = svg(340, 240, "qf-svg"); let pts = [], info = "", extra = "";
      const sty = { fill: "rgba(56,189,248,.18)", stroke: "#38bdf8", "stroke-width": 2.5, "stroke-linejoin": "round" };
      const lab = (x, y, t, c = "#fde047") => s("text", { x, y, "text-anchor": "middle", class: "qf-l", fill: c, text: t }, g);
      const fitPts = (P) => { const xs = P.map((q) => q[0]), ys = P.map((q) => q[1]); const w = Math.max(...xs) - Math.min(...xs) || 1, hh = Math.max(...ys) - Math.min(...ys) || 1, k = Math.min(260 / w, 170 / hh); const ox = 170 - ((Math.max(...xs) + Math.min(...xs)) / 2) * k, oy = 120 + ((Math.max(...ys) + Math.min(...ys)) / 2) * k; return { k, T: (q) => [ox + q[0] * k, oy - q[1] * k] }; };
      if (kind === "triangle") {
        let { a, b, c } = d; const ok = a < b + c && b < a + c && c < a + b;
        if (!ok) { out.innerHTML = `<span class="bad">⚠️ Bunday uchburchak yo‘q: har bir tomon qolgan ikkitasi yig‘indisidan kichik bo‘lishi kerak (uchburchak tengsizligi).</span>`; stage.innerHTML = ""; stage.append(g); return; }
        const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(Math.max(0, c * c - x * x));
        const { T } = fitPts([[0, 0], [a, 0], [x, y]]); pts = [[0, 0], [a, 0], [x, y]].map(T);
        s("polygon", { points: pts.map((q) => q.join(",")).join(" "), ...sty }, g);
        const hf = T([x, 0]); s("line", { x1: pts[2][0], y1: pts[2][1], x2: hf[0], y2: hf[1], stroke: "#f9a8d4", "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
        lab((pts[0][0] + pts[1][0]) / 2, pts[0][1] + 18, "a = " + a); lab((pts[1][0] + pts[2][0]) / 2 + 16, (pts[1][1] + pts[2][1]) / 2, "b = " + b); lab((pts[0][0] + pts[2][0]) / 2 - 16, (pts[0][1] + pts[2][1]) / 2, "c = " + c); lab(hf[0] + 14, (pts[2][1] + hf[1]) / 2, "h", "#f9a8d4");
        const P = a + b + c, pp = P / 2, S = Math.sqrt(pp * (pp - a) * (pp - b) * (pp - c));
        const ang = (o, q, w) => (Math.acos((q * q + w * w - o * o) / (2 * q * w)) * 180) / PI;
        const A = ang(a, b, c), B = ang(b, a, c), C = 180 - A - B, mx = Math.max(A, B, C);
        info = `<div class="big-num">S = ${r2(S)} · P = ${r2(P)}</div><div class="steps"><div>Geron formulasi: S = √(p(p−a)(p−b)(p−c)), p = P/2 = ${r2(pp)}</div><div>Balandlik: h = 2S / a = <b>${r2((2 * S) / a)}</b> · S = ½·a·h</div><div>Burchaklar: ${r2(A)}°, ${r2(B)}°, ${r2(C)}° (yig‘indisi 180°) → <b>${mx > 90.01 ? "o‘tmas burchakli" : Math.abs(mx - 90) < 0.5 ? "to‘g‘ri burchakli" : "o‘tkir burchakli"}</b>${a === b && b === c ? ", <b>teng tomonli</b>" : a === b || b === c || a === c ? ", <b>teng yonli</b>" : ""}</div></div>`;
      } else if (kind === "square" || kind === "rect" || kind === "parallelogram") {
        const a = d.a, b = kind === "square" ? d.a : d.b, al = kind === "parallelogram" ? (d.al * PI) / 180 : PI / 2;
        const P4 = [[0, 0], [a, 0], [a + b * Math.cos(al), b * Math.sin(al)], [b * Math.cos(al), b * Math.sin(al)]];
        const { T } = fitPts(P4); pts = P4.map(T);
        s("polygon", { points: pts.map((q) => q.join(",")).join(" "), ...sty }, g);
        s("line", { x1: pts[0][0], y1: pts[0][1], x2: pts[2][0], y2: pts[2][1], stroke: "#86efac", "stroke-width": 1.5, "stroke-dasharray": "5 4" }, g);
        s("line", { x1: pts[1][0], y1: pts[1][1], x2: pts[3][0], y2: pts[3][1], stroke: "#86efac", "stroke-width": 1.5, "stroke-dasharray": "5 4" }, g);
        lab((pts[0][0] + pts[1][0]) / 2, pts[0][1] + 18, "a = " + a); lab((pts[1][0] + pts[2][0]) / 2 + 22, (pts[1][1] + pts[2][1]) / 2, "b = " + b);
        const hh = b * Math.sin(al), S = a * hh, dd1 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(al)), dd2 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(al));
        info = `<div class="big-num">S = ${r2(S)} · P = ${r2(2 * (a + b))}</div><div class="steps">${kind === "square" ? `<div>S = a² · P = 4a · Diagonal d = a√2 ≈ <b>${r2(a * Math.SQRT2)}</b></div><div>Diagonallar teng, perpendikulyar va kesishish nuqtasida teng ikkiga bo‘linadi.</div>` : kind === "rect" ? `<div>S = a·b · P = 2(a + b) · Diagonal d = √(a² + b²) ≈ <b>${r2(dd1)}</b></div><div>Barcha burchaklari 90°, diagonallari teng.</div>` : `<div>S = a·h = a·b·sinα · h = b·sinα ≈ <b>${r2(hh)}</b></div><div>Diagonallar: d₁ ≈ ${r2(dd1)}, d₂ ≈ ${r2(dd2)} (d₁² + d₂² = 2(a² + b²)). Qarama-qarshi tomon va burchaklar teng, burchaklar yig‘indisi 360°.</div>`}</div>`;
      } else if (kind === "rhombus") {
        const P4 = [[-d.d1 / 2, 0], [0, -d.d2 / 2], [d.d1 / 2, 0], [0, d.d2 / 2]]; const { T } = fitPts(P4); pts = P4.map(T);
        s("polygon", { points: pts.map((q) => q.join(",")).join(" "), ...sty }, g);
        s("line", { x1: pts[0][0], y1: pts[0][1], x2: pts[2][0], y2: pts[2][1], stroke: "#86efac", "stroke-width": 2, "stroke-dasharray": "5 4" }, g); s("line", { x1: pts[1][0], y1: pts[1][1], x2: pts[3][0], y2: pts[3][1], stroke: "#f9a8d4", "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
        lab((pts[0][0] + pts[2][0]) / 2 + 40, pts[0][1] - 6, "d₁ = " + d.d1, "#86efac"); lab(pts[1][0] + 28, (pts[1][1] + pts[3][1]) / 2 + 24, "d₂ = " + d.d2, "#f9a8d4");
        const a = Math.hypot(d.d1 / 2, d.d2 / 2);
        info = `<div class="big-num">S = ${r2((d.d1 * d.d2) / 2)} · P = ${r2(4 * a)}</div><div class="steps"><div>S = ½·d₁·d₂ · tomon a = √((d₁/2)² + (d₂/2)²) ≈ <b>${r2(a)}</b></div><div>Barcha tomonlari teng, diagonallari perpendikulyar va burchaklarni teng ikkiga bo‘ladi.</div></div>`;
      } else if (kind === "trapezoid") {
        const off = (d.a - Math.min(d.b, d.a)) / 2; const P4 = [[0, 0], [d.a, 0], [off + Math.min(d.b, d.a), d.hh], [off, d.hh]]; const { T } = fitPts(P4); pts = P4.map(T);
        s("polygon", { points: pts.map((q) => q.join(",")).join(" "), ...sty }, g);
        const hb = T([off, 0]); s("line", { x1: pts[3][0], y1: pts[3][1], x2: hb[0], y2: hb[1], stroke: "#f9a8d4", "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
        const m1 = T([off / 2, d.hh / 2]), m2 = T([d.a - off / 2, d.hh / 2]); s("line", { x1: m1[0], y1: m1[1], x2: m2[0], y2: m2[1], stroke: "#86efac", "stroke-width": 1.8, "stroke-dasharray": "3 4" }, g);
        lab((pts[0][0] + pts[1][0]) / 2, pts[0][1] + 18, "a = " + d.a); lab((pts[2][0] + pts[3][0]) / 2, pts[3][1] - 8, "b = " + d.b); lab(hb[0] + 14, (pts[3][1] + hb[1]) / 2, "h", "#f9a8d4");
        const l = Math.hypot(off, d.hh), mid = (d.a + d.b) / 2;
        info = `<div class="big-num">S = ${r2(mid * d.hh)} · P ≈ ${r2(d.a + d.b + 2 * l)}</div><div class="steps"><div>S = (a + b)/2 · h · O‘rta chiziq m = (a + b)/2 = <b>${r2(mid)}</b> (yashil)</div><div>Teng yonli trapetsiyada yon tomon ≈ ${r2(l)}. Faqat bir juft tomoni (asoslari) parallel.</div></div>`;
      } else if (kind === "circle") {
        const R = 95; const cx = 170, cy = 120, a1 = (d.al * PI) / 180;
        s("circle", { cx, cy, r: R, ...sty }, g);
        const ex = cx + R * Math.cos(-a1), ey = cy + R * Math.sin(-a1);
        s("path", { d: `M${cx} ${cy} L${cx + R} ${cy} A${R} ${R} 0 ${a1 > PI ? 1 : 0} 0 ${ex} ${ey} Z`, fill: "rgba(250,204,21,.35)", stroke: "#facc15", "stroke-width": 2 }, g);
        s("line", { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: "#86efac", "stroke-width": 1.5, "stroke-dasharray": "5 4" }, g);
        lab(cx + R / 2, cy + 18, "r = " + d.r); lab(cx - R / 2, cy - 8, "d = 2r", "#86efac");
        const Sc = PI * d.r * d.r, L = 2 * PI * d.r;
        info = `<div class="big-num">S = ${r2(Sc)} · C = ${r2(L)}</div><div class="steps"><div>Doira yuzi S = πr² · Aylana uzunligi C = 2πr = πd · π ≈ 3,14159</div><div>Sektor (${d.al}°): S = πr²·α/360° ≈ <b>${r2((Sc * d.al) / 360)}</b> · yoy uzunligi = 2πr·α/360° ≈ <b>${r2((L * d.al) / 360)}</b></div><div class="muted">Aylana — chiziq (chegara), doira — uning ichidagi yuza.</div></div>`;
      } else if (kind === "polygon") {
        const n = d.n, Rr = d.a / (2 * Math.sin(PI / n)); const P = []; for (let i = 0; i < n; i++) { const a = PI / 2 + (i / n) * 2 * PI; P.push([Rr * Math.cos(a), Rr * Math.sin(a)]); }
        const { T } = fitPts(P); pts = P.map(T);
        s("polygon", { points: pts.map((q) => q.join(",")).join(" "), ...sty }, g);
        const c0 = T([0, 0]); s("circle", { cx: c0[0], cy: c0[1], r: Math.hypot(pts[0][0] - c0[0], pts[0][1] - c0[1]), fill: "none", stroke: "#86efac", "stroke-dasharray": "4 4" }, g);
        const ri = d.a / (2 * Math.tan(PI / n)), S = (n * d.a * ri) / 2;
        info = `<div class="big-num">S = ${r2(S)} · P = ${r2(n * d.a)}</div><div class="steps"><div>Ichki burchak = 180°(n − 2)/n = <b>${r2((180 * (n - 2)) / n)}°</b> · burchaklar yig‘indisi = 180°(n − 2) = ${180 * (n - 2)}°</div><div>Tashqi chizilgan aylana R = a / (2sin(180°/n)) ≈ ${r2(Rr)} · ichki r ≈ ${r2(ri)} · S = ½·P·r</div><div class="muted">n ortgan sari ko‘pburchak aylanaga yaqinlashadi — π shunday topilgan!</div></div>`;
      }
      stage.innerHTML = ""; stage.append(g); out.innerHTML = info + extra;
    }
    F0.dims.forEach(([k, label, mn, mx]) => controls.append(slider({ label, min: mn, max: mx, step: k === "n" || k === "al" ? 1 : 0.5, value: d[k], fmt: (x) => num(x) + (k === "al" ? "°" : ""), onInput: (x) => { d[k] = x; draw(); } })));
    draw();
  };

  // ===================================================================
  // 3. Hayotdagi misollar (rasmli kartalar)
  // ===================================================================
  W.reallife = (root, p) => {
    const { stage, out } = frame(root, p.title || "🌍 Hayotda qayerda uchraydi? — rasmni bosing");
    const grid = h("div", { class: "qr-grid" });
    const FOTO = window.QUROL_FOTO || {};
    p.items.forEach(([em, t, d], i) => {
      const ph = FOTO[t];
      const pic = ph ? h("img", { class: "qr-ph", src: "amaliy/foto/" + ph[0], alt: t, loading: "lazy" }) : h("span", { class: "qr-em" }, em);
      if (ph) pic.onerror = () => pic.replaceWith(h("span", { class: "qr-em" }, em));
      const b = h("button", { type: "button", class: "qr-it" + (ph ? " has-ph" : ""), style: `--d:${i * 50}ms` }, pic, h("b", {}, t));
      b.onclick = () => {
        grid.querySelectorAll(".on").forEach((x) => x.classList.remove("on")); b.classList.add("on");
        out.innerHTML = `${ph ? `<figure class="qr-fig"><img src="amaliy/foto/${ph[0]}" alt=""><figcaption>Surat: ${ph[1].replace(/[<>&]/g, "")} · Wikimedia Commons</figcaption></figure>` : ""}<b>${em} ${t}</b> — ${d}`;
      };
      grid.append(b);
    });
    stage.append(grid);
    out.innerHTML = "Rasmlardan birini bosing — u bilan bog‘liq tushuntirish chiqadi.";
  };

  // ===================================================================
  // Grafik yordamchisi
  // ===================================================================
  function plot(xmin, xmax, ymin, ymax, w = 340, hh = 220) {
    const g = svg(w, hh, "qp-svg"), L = 34, R = 10, T = 10, B = 26;
    const X = (x) => L + ((x - xmin) / (xmax - xmin)) * (w - L - R), Y = (y) => hh - B - ((y - ymin) / (ymax - ymin)) * (hh - T - B);
    s("line", { x1: L, y1: Y(Math.max(ymin, Math.min(ymax, 0))), x2: w - R, y2: Y(Math.max(ymin, Math.min(ymax, 0))), stroke: "currentColor", opacity: 0.45 }, g);
    s("line", { x1: X(Math.max(xmin, 0)), y1: T, x2: X(Math.max(xmin, 0)), y2: hh - B, stroke: "currentColor", opacity: 0.45 }, g);
    const curve = (f, col = "#38bdf8", wd = 2.5, a = xmin, b = xmax) => { let d = ""; for (let i = 0; i <= 120; i++) { const x = a + ((b - a) * i) / 120, y = f(x); if (!isFinite(y)) continue; d += (d ? "L" : "M") + X(x).toFixed(1) + " " + Y(Math.max(ymin - 5, Math.min(ymax + 5, y))).toFixed(1); } s("path", { d, fill: "none", stroke: col, "stroke-width": wd }, g); };
    const area = (f, a, b, col = "rgba(56,189,248,.3)") => { let d = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 80; i++) { const x = a + ((b - a) * i) / 80; d += `L${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`; } d += `L${X(b)} ${Y(0)}Z`; s("path", { d, fill: col, stroke: "none" }, g); };
    const dot = (x, y, col = "#fde047", r = 5) => s("circle", { cx: X(x), cy: Y(y), r, fill: col }, g);
    const text = (x, y, t, col = "currentColor", anchor = "start") => s("text", { x: X(x), y: Y(y), fill: col, class: "qp-t", "text-anchor": anchor, text: t }, g);
    const axisLbl = (tx, ty) => { s("text", { x: w - R, y: hh - 8, "text-anchor": "end", class: "qp-t", fill: "currentColor", text: tx }, g); s("text", { x: L + 4, y: T + 10, class: "qp-t", fill: "currentColor", text: ty }, g); };
    return { g, X, Y, curve, area, dot, text, axisLbl };
  }

  // ===================================================================
  // 4. Hosila: kesuvchi → urinma (h → 0)
  // ===================================================================
  W.secant = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🔍 Hosila nima? Kesuvchi urinmaga aylanadi (h → 0)");
    const f = (x) => 0.25 * x * x * x - x + 1.2, df = (x) => 0.75 * x * x - 1;
    let x0 = 1, hv = 1.5;
    function draw() {
      const P = plot(-3, 3, -2, 5);
      P.curve(f);
      const x1 = x0 + hv, k = (f(x1) - f(x0)) / hv, kt = df(x0);
      P.curve((x) => f(x0) + k * (x - x0), "#f472b6", 2);
      P.curve((x) => f(x0) + kt * (x - x0), "#fde047", 1.5);
      P.dot(x0, f(x0)); P.dot(x1, f(x1), "#f472b6");
      P.axisLbl("x", "y");
      stage.innerHTML = ""; stage.append(P.g);
      out.innerHTML = `<div class="big-num">Kesuvchi qiyaligi = <span style="color:#f472b6">${r2(k)}</span> → hosila f′(${x0}) = <span style="color:#fde047">${r2(kt)}</span></div>
        <div class="steps"><div>Δy/Δx = (f(x₀ + h) − f(x₀)) / h = (${r2(f(x1))} − ${r2(f(x0))}) / ${num(hv)} = <b>${r2(k)}</b></div>
        <div>h ni kichraytiring: pushti kesuvchi sariq <b>urinma</b>ga yopishib boradi. h → 0 dagi limit — <b>hosila</b>: f′(x₀) = lim<sub>h→0</sub> Δy/Δx.</div></div>`;
    }
    controls.append(slider({ label: "Nuqta x₀", min: -2.5, max: 2, step: 0.25, value: x0, fmt: (v) => num(v), onInput: (v) => { x0 = v; draw(); } }),
      slider({ label: "Qadam h", min: 0.05, max: 2, step: 0.05, value: hv, fmt: (v) => num(v), onInput: (v) => { hv = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 5. Hosila hayotda: yo'l grafigi va spidometr
  // ===================================================================
  W.carSpeed = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🚗 Tajriba: yo‘l grafigidan tezlikni topamiz (spidometr = hosila)");
    // s(t): 0–4 s tezlanish, 4–8 s tekis, 8–10 s tormoz (metrda)
    const s_ = (t) => (t <= 4 ? 2.5 * t * t : t <= 8 ? 40 + 20 * (t - 4) : 120 + 20 * (t - 8) - 5 * (t - 8) ** 2);
    const v_ = (t) => (t <= 4 ? 5 * t : t <= 8 ? 20 : 20 - 10 * (t - 8));
    let t = 3, play = null;
    const road = h("div", { class: "qc-road" }, h("span", { class: "qc-car" }, "🚗"));
    const gauge = svg(150, 96, "qc-gauge");
    function draw() {
      const P = plot(0, 10, 0, 140, 340, 200);
      P.curve(s_, "#38bdf8", 2.5, 0, 10);
      P.curve((x) => s_(t) + v_(t) * (x - t), "#fde047", 1.8, Math.max(0, t - 2), Math.min(10, t + 2));
      P.dot(t, s_(t)); P.axisLbl("t, s", "s, m");
      stage.innerHTML = ""; stage.append(road, P.g, gauge);
      road.querySelector(".qc-car").style.left = `${(s_(t) / 140) * 90}%`;
      const v = v_(t), kmh = v * 3.6, ang = -PI + (kmh / 80) * PI;
      gauge.innerHTML = `<path d="M15 85 A60 60 0 0 1 135 85" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="8"/><path d="M15 85 A60 60 0 0 1 ${75 + 60 * Math.cos(ang)} ${85 + 60 * Math.sin(ang)}" fill="none" stroke="#22c55e" stroke-width="8"/><line x1="75" y1="85" x2="${75 + 50 * Math.cos(ang)}" y2="${85 + 50 * Math.sin(ang)}" stroke="#fde047" stroke-width="3"/><circle cx="75" cy="85" r="5" fill="#fde047"/><text x="75" y="66" text-anchor="middle" class="qp-t" fill="currentColor">${Math.round(kmh)} km/soat</text>`;
      out.innerHTML = `<div class="big-num">t = ${num(t)} s · s = ${r2(s_(t))} m · v = s′(t) = ${r2(v)} m/s</div>
        <div class="steps"><div>Sariq chiziq — grafikka urinma. Uning qiyaligi — <b>tezlik</b>. Tikroq bo‘lsa — tezroq ketyapmiz.</div>
        <div>${t <= 4 ? "0–4 s: tezlanish — urinma tobora tiklashadi (v ortadi)." : t <= 8 ? "4–8 s: tekis harakat — grafik to‘g‘ri chiziq, qiyalik o‘zgarmas (20 m/s = 72 km/soat)." : "8–10 s: tormozlash — urinma yotiqlashadi, oxirida gorizontal (v = 0, mashina to‘xtadi)."}</div>
        <div class="muted">Mashina spidometri aynan shu ishni qiladi: yo‘lning vaqt bo‘yicha hosilasini ko‘rsatadi.</div></div>`;
    }
    const sl = slider({ label: "Vaqt t", min: 0, max: 10, step: 0.1, value: t, fmt: (v) => num(v) + " s", onInput: (v) => { t = v; draw(); } });
    controls.append(sl, button("▶ Yurgizish", () => { if (play) { clearInterval(play); play = null; return; } t = 0; play = setInterval(() => { t = Math.round((t + 0.1) * 10) / 10; sl.set(t); draw(); if (t >= 10) { clearInterval(play); play = null; } }, 60); }));
    draw();
  };

  // ===================================================================
  // 6. Hosila hayotda: eng katta hajmli quti (optimallashtirish)
  // ===================================================================
  W.boxOpt = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📦 Tajriba: 30×30 sm kartondan eng katta quti yasang");
    const A = 30; let x = 3;
    const V = (x) => x * (A - 2 * x) ** 2, dV = (x) => (A - 2 * x) * (A - 6 * x);
    function draw() {
      const sheet = svg(170, 170, "qb-sheet"), k = 150 / A, o = 10;
      sheet.innerHTML = `<rect x="${o}" y="${o}" width="150" height="150" fill="#d6a76b" stroke="#92400e"/>${[[0, 0], [A - x, 0], [0, A - x], [A - x, A - x]].map(([a, b]) => `<rect x="${o + a * k}" y="${o + b * k}" width="${x * k}" height="${x * k}" fill="#0b1220" stroke="#ef4444" stroke-dasharray="3 2"/>`).join("")}<rect x="${o + x * k}" y="${o + x * k}" width="${(A - 2 * x) * k}" height="${(A - 2 * x) * k}" fill="none" stroke="#92400e" stroke-dasharray="4 3"/><text x="85" y="92" text-anchor="middle" class="qp-t" fill="#3b2410">${num(A - 2 * x)} sm</text>`;
      const P = plot(0, 15, 0, 2200, 340, 190);
      P.curve(V, "#38bdf8", 2.5, 0, 15); P.dot(x, V(x)); P.dot(5, V(5), "#22c55e", 4);
      P.curve((t) => V(x) + dV(x) * (t - x), "#fde047", 1.5, Math.max(0, x - 2), Math.min(15, x + 2));
      P.axisLbl("x, sm", "V, sm³");
      stage.innerHTML = ""; stage.append(h("div", { class: "qb-row" }, sheet, P.g));
      out.innerHTML = `<div class="big-num">x = ${num(x)} sm → V = ${num(x)}·(${A} − 2·${num(x)})² = ${r2(V(x))} sm³</div>
        <div class="steps"><div>Burchaklardan x sm kvadrat kesib, chetlarini bukamiz. V(x) = x(30 − 2x)². V′(x) = (30 − 2x)(30 − 6x) = <b>${r2(dV(x))}</b> ${dV(x) > 0.01 ? "→ hajm hali o‘smoqda, x ni oshiring" : dV(x) < -0.01 ? "→ hajm kamaymoqda, x ni kamaytiring" : "→ 🎯 <b>V′ = 0: eng katta hajm!</b>"}</div>
        <div>V′(x) = 0 → x = 5 sm (x = 15 — quti yo‘qoladi). Eng katta hajm: <b>V(5) = 2000 sm³ = 2 litr</b>. Urinma (sariq) eng yuqori nuqtada gorizontal bo‘ladi.</div>
        <div class="muted">Muhandislar xuddi shunday hosila yordamida eng arzon, eng yengil, eng sig‘imli shaklni topishadi.</div></div>`;
    }
    controls.append(slider({ label: "Kesiladigan kvadrat x", min: 0.5, max: 14, step: 0.5, value: x, fmt: (v) => num(v) + " sm", onInput: (v) => { x = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 7. Integral hayotda: tezlik grafigi ostidagi yuza = yo'l
  // ===================================================================
  W.speedArea = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🚴 Tajriba: tezlik grafigi ostidagi yuza — bosib o‘tilgan yo‘l");
    const v_ = (t) => (t <= 4 ? 5 * t : t <= 8 ? 20 : Math.max(0, 20 - 10 * (t - 8)));
    let T = 6, n = 0;
    const road = h("div", { class: "qc-road" }, h("span", { class: "qc-car" }, "🚴"));
    function draw() {
      const P = plot(0, 10, 0, 24, 340, 200);
      if (n) { const dt = T / n; for (let i = 0; i < n; i++) { const vv = v_(dt * i + dt / 2); s("rect", { x: P.X(dt * i), y: P.Y(vv), width: P.X(dt * (i + 1)) - P.X(dt * i), height: P.Y(0) - P.Y(vv), fill: "rgba(250,204,21,.25)", stroke: "#facc15" }, P.g); } }
      else P.area(v_, 0, T, "rgba(34,197,94,.35)");
      P.curve(v_, "#22c55e", 2.5, 0, 10); P.dot(T, v_(T)); P.axisLbl("t, s", "v, m/s");
      let S = 0; const N = 2000; for (let i = 0; i < N; i++) S += v_((T * (i + 0.5)) / N) * (T / N);
      let Sr = 0; if (n) { const dt = T / n; for (let i = 0; i < n; i++) Sr += v_(dt * i + dt / 2) * dt; }
      stage.innerHTML = ""; stage.append(road, P.g);
      road.querySelector(".qc-car").style.left = `${(S / 140) * 90}%`;
      out.innerHTML = `<div class="big-num">S = ∫₀<sup>${num(T)}</sup> v(t) dt = ${r2(S)} m</div>
        <div class="steps"><div>Yashil yuza — ${num(T)} soniyada bosib o‘tilgan yo‘l. Tezlik o‘zgarmas bo‘lsa S = v·t (to‘g‘ri to‘rtburchak), o‘zgaruvchan bo‘lsa — <b>integral</b>.</div>
        ${n ? `<div>${n} ta to‘rtburchak (har birida “tezlik × vaqt”) yig‘indisi ≈ <b>${r2(Sr)}</b> m. Bo‘laklar ko‘paysa — aniq javobga yaqinlashadi.</div>` : ""}
        <div class="muted">Integral — juda ko‘p kichik bo‘laklarning yig‘indisi. Hosila tezlikni yo‘ldan topsa, integral yo‘lni tezlikdan topadi: ular bir-biriga teskari amallar.</div></div>`;
    }
    controls.append(slider({ label: "Vaqt T", min: 0.5, max: 10, step: 0.5, value: T, fmt: (v) => num(v) + " s", onInput: (v) => { T = v; draw(); } }),
      buttons(["Aniq yuza", "4 bo‘lak", "8 bo‘lak", "20 bo‘lak"], (i) => { n = [0, 4, 8, 20][i]; draw(); }, 0));
    draw();
  };

  // ===================================================================
  // 8. Integral hayotda: idishga suv quyish (oqim tezligi → hajm)
  // ===================================================================
  W.tankFill = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🚰 Tajriba: jo‘mrak oqimidan idishdagi suv hajmini topamiz");
    const MODES = [["Teng oqim", () => 2], ["Asta ochiladi", (t) => 0.4 * t], ["Ochilib-yopiladi", (t) => 2 + 1.6 * Math.sin(t * 0.9)]];
    let mi = 1, T = 5;
    function draw() {
      const r = MODES[mi][1]; let Vol = 0; const N = 1000; for (let i = 0; i < N; i++) Vol += r((T * (i + 0.5)) / N) * (T / N);
      const P = plot(0, 10, 0, 4.5, 340, 180);
      P.area(r, 0, T, "rgba(56,189,248,.35)"); P.curve(r, "#38bdf8", 2.5, 0, 10); P.dot(T, r(T)); P.axisLbl("t, daq", "l/daq");
      const tank = svg(120, 180, "qt-tank"), lvl = Math.min(1, Vol / 22);
      tank.innerHTML = `<rect x="20" y="20" width="80" height="150" rx="6" fill="none" stroke="currentColor" stroke-width="3" opacity=".7"/><rect x="23" y="${167 - 144 * lvl}" width="74" height="${144 * lvl}" fill="#38bdf8" opacity=".6"/><path d="M60 0 L60 ${167 - 144 * lvl}" stroke="#38bdf8" stroke-width="${1 + r(T) * 1.5}" opacity=".8"/><text x="60" y="${Math.max(36, 160 - 144 * lvl)}" text-anchor="middle" class="qp-t" fill="currentColor">${r2(Vol)} l</text>`;
      stage.innerHTML = ""; stage.append(h("div", { class: "qb-row" }, P.g, tank));
      out.innerHTML = `<div class="big-num">V = ∫₀<sup>${num(T)}</sup> r(t) dt ≈ ${r2(Vol)} litr</div>
        <div class="steps"><div>Ko‘k chiziq — har daqiqada qancha suv oqayotgani (oqim tezligi). Grafik ostidagi yuza — idishga yig‘ilgan jami suv.</div>
        <div class="muted">Xuddi shunday integral bilan hisoblagich (schyotchik) sarflangan suv, gaz va elektr miqdorini, shifokorlar esa qonga tushgan dori miqdorini hisoblaydi.</div></div>`;
    }
    controls.append(buttons(MODES.map((m) => m[0]), (i) => { mi = i; draw(); }, mi), slider({ label: "Vaqt T", min: 0.5, max: 10, step: 0.5, value: T, fmt: (v) => num(v) + " daq", onInput: (v) => { T = v; draw(); } }));
    draw();
  };

  // ===================================================================
  // 9. Integral: aylanish jismi hajmi (3D vaza)
  // ===================================================================
  W.revolve = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🏺 Tajriba: chiziqni aylantirib jism yasaymiz — hajmi integral bilan");
    const SH = [["Vaza", (x) => 1 + 0.6 * Math.sin(x * 1.3) + 0.15 * x, 0, 5], ["Konus", (x) => 0.5 * x, 0, 5], ["Silindr", () => 1.5, 0, 5], ["Yarim shar", (x) => Math.sqrt(Math.max(0, 6.25 - (x - 2.5) ** 2)), 0, 5]];
    let si = 0;
    const v = viewer(stage, { color: "#a78bfa" });
    const pl = h("div"); stage.append(pl);
    function draw() {
      const [n, f, a, b] = SH[si];
      v.set(mesh("revolve", { f, a, b }), [], 5.4);
      let V = 0; const N = 2000; for (let i = 0; i < N; i++) { const x = a + ((b - a) * (i + 0.5)) / N; V += PI * f(x) ** 2 * ((b - a) / N); }
      const P = plot(0, 5, 0, 3, 340, 140); P.area(f, a, b, "rgba(167,139,250,.3)"); P.curve(f, "#a78bfa", 2.5, a, b); P.axisLbl("x (balandlik)", "r(x)");
      pl.innerHTML = ""; pl.append(P.g);
      out.innerHTML = `<div class="big-num">V = π∫₀⁵ r(x)² dx ≈ ${r2(V)}</div>
        <div class="steps"><div>Pastdagi chiziqni o‘q atrofida aylantirsak, yuqoridagi 3D jism hosil bo‘ladi. Uni yupqa doiralarga (tangalarga) bo‘lamiz: har birining hajmi π·r²·dx. Hammasini qo‘shish — integral.</div>
        ${n === "Konus" ? `<div>Tekshiramiz: konus formulasi ⅓πr²h = ⅓π·2,5²·5 ≈ <b>${r2((PI * 6.25 * 5) / 3)}</b> ✅</div>` : n === "Silindr" ? `<div>Tekshiramiz: πr²h = π·1,5²·5 ≈ <b>${r2(PI * 2.25 * 5)}</b> ✅</div>` : n === "Yarim shar" ? `<div>Bu aslida to‘liq shar (r = 2,5): ⁴⁄₃πr³ ≈ <b>${r2((4 / 3) * PI * 2.5 ** 3)}</b> ✅</div>` : `<div class="muted">Kulolchilikda, idish va shisha zavodlarida aynan shu usul bilan sig‘im hisoblanadi.</div>`}</div>`;
    }
    controls.append(buttons(SH.map((x) => x[0]), (i) => { si = i; draw(); }, 0));
    draw();
  };
})();
