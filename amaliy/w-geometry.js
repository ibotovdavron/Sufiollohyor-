/* Geometriya va fizika bo'yicha jonli tajribalar. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, draggable, wait, COLORS, W } = window.AK;

  const deg = (r) => (r * 180) / Math.PI;
  const rad = (d) => (d * Math.PI) / 180;
  const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  function angleAt(P, A, B) {
    const v1 = [A[0] - P[0], A[1] - P[1]], v2 = [B[0] - P[0], B[1] - P[1]];
    const c = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2));
    return deg(Math.acos(Math.max(-1, Math.min(1, c))));
  }
  function arc(el, P, A, B, r, color, label) {
    const a1 = Math.atan2(A[1] - P[1], A[0] - P[0]), a2 = Math.atan2(B[1] - P[1], B[0] - P[0]);
    let da = a2 - a1;
    while (da <= -Math.PI) da += 2 * Math.PI;
    while (da > Math.PI) da -= 2 * Math.PI;
    const x1 = P[0] + r * Math.cos(a1), y1 = P[1] + r * Math.sin(a1);
    const x2 = P[0] + r * Math.cos(a1 + da), y2 = P[1] + r * Math.sin(a1 + da);
    s("path", { d: `M${P[0]},${P[1]} L${x1},${y1} A${r},${r} 0 0 ${da > 0 ? 1 : 0} ${x2},${y2} Z`, fill: color, opacity: 0.35 }, el);
    if (label) {
      const am = a1 + da / 2;
      s("text", { x: P[0] + (r + 14) * Math.cos(am), y: P[1] + (r + 14) * Math.sin(am) + 4, "text-anchor": "middle", fill: color, "font-size": 12, "font-weight": 800, text: label }, el);
    }
  }
  const poly = (el, pts, attrs) => s("polygon", { points: pts.map((p) => p.join(",")).join(" "), ...attrs }, el);
  const line = (el, P, Q, attrs) => s("line", { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], ...attrs }, el);
  const label = (el, P, t, dx = 0, dy = 0, color = "#e2e8f0") => s("text", { x: P[0] + dx, y: P[1] + dy, fill: color, "font-size": 15, "font-weight": 900, "text-anchor": "middle", text: t }, el);
  function ticks(el, P, Q, n, color = "#fde047") {
    const m = mid(P, Q), ang = Math.atan2(Q[1] - P[1], Q[0] - P[0]) + Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 5;
      const c = [m[0] + off * Math.cos(ang - Math.PI / 2), m[1] + off * Math.sin(ang - Math.PI / 2)];
      line(el, [c[0] - 7 * Math.cos(ang), c[1] - 7 * Math.sin(ang)], [c[0] + 7 * Math.cos(ang), c[1] + 7 * Math.sin(ang)], { stroke: color, "stroke-width": 2.5 });
    }
  }
  function arrow(el, P, Q, n, color = "#38bdf8") {
    const m = mid(P, Q), ang = Math.atan2(Q[1] - P[1], Q[0] - P[0]);
    for (let i = 0; i < n; i++) {
      const c = [m[0] + (i * 8 - 4) * Math.cos(ang), m[1] + (i * 8 - 4) * Math.sin(ang)];
      s("path", { d: `M${c[0] - 8 * Math.cos(ang - 0.5)},${c[1] - 8 * Math.sin(ang - 0.5)} L${c[0]},${c[1]} L${c[0] - 8 * Math.cos(ang + 0.5)},${c[1] - 8 * Math.sin(ang + 0.5)}`, fill: "none", stroke: color, "stroke-width": 2.5 }, el);
    }
  }
  const SC = 26; // 1 birlik = 26 px
  const u = (px) => Math.round((px / SC) * 10) / 10;

  // ---------- Uchburchak: burchaklar yig'indisi va o'rta chiziq ----------
  W.triangle = (root, p) => {
    const mode = p.mode || "angles";
    const pts = { A: [60, 270], B: [200, 60], C: [400, 260] };
    const { stage, controls, out } = frame(root, p.title);
    const el = svg(460, 310);
    stage.append(el);
    function render() {
      el.innerHTML = "";
      const { A, B, C } = pts;
      poly(el, [A, B, C], { fill: "rgba(34,197,94,.12)", stroke: "#22c55e", "stroke-width": 3 });
      const aA = angleAt(A, B, C), aB = angleAt(B, A, C), aC = angleAt(C, A, B);
      if (mode === "angles") {
        arc(el, A, B, C, 30, "#f59e0b", Math.round(aA) + "°");
        arc(el, B, A, C, 30, "#3b82f6", Math.round(aB) + "°");
        arc(el, C, A, B, 30, "#ec4899", Math.round(aC) + "°");
        out.innerHTML = `<div class="big-num">∠A + ∠B + ∠C = ${Math.round(aA)}° + ${Math.round(aB)}° + ${Math.round(aC)}° = 180°</div>
          <div class="steps"><div>Uchlarni sudrab ko‘ring — shakl o‘zgaradi, lekin yig‘indi doim <b>180°</b>.</div>
          <div>Tomonlar: AB = ${u(dist(A, B))}, BC = ${u(dist(B, C))}, AC = ${u(dist(A, C))}. Eng katta tomon qarshisida eng katta burchak yotadi.</div>
          <div>Turi: ${Math.max(aA, aB, aC) > 90.5 ? "o‘tmas burchakli" : Math.max(aA, aB, aC) > 89.5 ? "to‘g‘ri burchakli" : "o‘tkir burchakli"} uchburchak.</div></div>`;
      } else {
        const M = mid(A, B), N = mid(B, C);
        line(el, M, N, { stroke: "#fde047", "stroke-width": 4, class: "draw" });
        s("circle", { cx: M[0], cy: M[1], r: 5, fill: "#fde047" }, el);
        s("circle", { cx: N[0], cy: N[1], r: 5, fill: "#fde047" }, el);
        label(el, M, "M", -14, -6, "#fde047"); label(el, N, "N", 14, -6, "#fde047");
        ticks(el, A, M, 1); ticks(el, M, B, 1); ticks(el, B, N, 2); ticks(el, N, C, 2);
        arrow(el, M, N, 1); arrow(el, A, C, 1);
        const mn = dist(M, N), ac = dist(A, C);
        out.innerHTML = `<div class="big-num">MN = ${u(mn)}, AC = ${u(ac)} → MN = AC : 2</div>
          <div class="steps"><div>M — AB ning o‘rtasi, N — BC ning o‘rtasi. MN — <b>o‘rta chiziq</b>.</div>
          <div>O‘rta chiziq uchinchi tomonga (AC) <b>parallel</b> va uning <b>yarmiga teng</b>: ${u(ac)} : 2 = ${u(ac / 2)} ✓</div>
          <div>Uchlarni sudrab tekshiring!</div></div>`;
      }
      for (const [k, P] of Object.entries(pts)) {
        const c = s("circle", { cx: P[0], cy: P[1], r: 11, fill: "#22c55e", stroke: "#fff", "stroke-width": 2, class: "handle" }, el);
        label(el, P, k, 0, k === "B" ? -18 : 28);
        draggable(el, c, (x, y) => { pts[k] = [Math.max(15, Math.min(445, x)), Math.max(25, Math.min(295, y))]; render(); });
      }
    }
    controls.append(h("p", { class: "muted" }, "👆 A, B, C nuqtalarni barmoq yoki sichqoncha bilan sudrang."));
    render();
  };

  // ---------- Ko'pburchak: ichki va tashqi burchaklar ----------
  W.polygon = (root, p) => {
    let n = 6, mode = p.mode === "exterior" ? 1 : 0;
    const { stage, controls, out } = frame(root, p.title);
    let token = 0;
    async function render() {
      const my = ++token;
      const el = svg(420, 340);
      stage.innerHTML = "";
      stage.append(el);
      const cx = 210, cy = 170, R = 120;
      const P = [...Array(n)].map((_, i) => [cx + R * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n), cy + R * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / n)]);
      poly(el, P, { fill: "rgba(34,197,94,.1)", stroke: "#22c55e", "stroke-width": 3 });
      if (mode === 0) {
        out.innerHTML = `<div class="big-num">S = (n − 2) · 180° = (${n} − 2) · 180° = ${(n - 2) * 180}°</div>
          <div class="steps"><div>Bitta uchdan diagonallar o‘tkazsak, ko‘pburchak <b>${n - 2} ta uchburchakka</b> bo‘linadi.</div>
          <div>Har bir uchburchak burchaklari yig‘indisi 180°, demak jami ${n - 2} · 180° = ${(n - 2) * 180}°.</div>
          <div>Muntazam ${n}-burchakning har bir burchagi: ${(n - 2) * 180}° : ${n} = <b>${num(((n - 2) * 180) / n)}°</b></div></div>`;
        for (let i = 1; i < n - 1; i++) {
          await wait(260);
          if (my !== token) return;
          poly(el, [P[0], P[i], P[i + 1]], { fill: COLORS[i % 10], opacity: 0.45, class: "pop" });
          if (i > 1) line(el, P[0], P[i], { stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "6 4" });
          const c = [(P[0][0] + P[i][0] + P[i + 1][0]) / 3, (P[0][1] + P[i][1] + P[i + 1][1]) / 3];
          label(el, c, "180°", 0, 5, "#0b1220");
        }
      } else {
        out.innerHTML = `<div class="big-num">Tashqi burchaklar yig‘indisi = 360°</div>
          <div class="steps"><div>Ko‘pburchak bo‘ylab aylanib chiqqan odam har bir uchda tashqi burchakka buriladi.</div>
          <div>Boshlang‘ich joyga qaytganda u roppa-rosa <b>bir marta to‘liq aylangan</b> bo‘ladi — 360°.</div>
          <div>Muntazam ${n}-burchakda har bir tashqi burchak: 360° : ${n} = <b>${num(360 / n)}°</b>, ichki burchak: 180° − ${num(360 / n)}° = ${num(180 - 360 / n)}°</div></div>`;
        let total = 0;
        const txt = s("text", { x: 210, y: 176, "text-anchor": "middle", fill: "#fde047", "font-size": 22, "font-weight": 900, text: "0°" }, el);
        for (let i = 0; i < n; i++) {
          await wait(380);
          if (my !== token) return;
          const A = P[i], B = P[(i + 1) % n], C = P[(i + 2) % n];
          const ext = [B[0] + (B[0] - A[0]) * 0.45, B[1] + (B[1] - A[1]) * 0.45];
          line(el, B, ext, { stroke: "#94a3b8", "stroke-width": 2, "stroke-dasharray": "5 4" });
          arc(el, B, ext, C, 26, COLORS[i % 10]);
          total += 360 / n;
          txt.textContent = `${num(total)}°`;
        }
      }
    }
    controls.append(
      buttons(["Ichki burchaklar", "Tashqi burchaklar"], (i) => { mode = i; render(); }, mode),
      slider({ label: "Tomonlar soni n", min: 3, max: 12, value: n, onInput: (v) => { n = v; render(); } }),
      button("▶ Qayta ko‘rsat", render, "ghost")
    );
    render();
  };

  // ---------- To'rtburchaklar ----------
  W.quad = (root, p) => {
    const type = p.shape; // parallelogram | rectangle | rhombus | square | trapezoid | isoTrap
    const st = { a: 8, b: 5, ang: 60, top: 4, hgt: 4.5, off: 1.5 };
    let showDiag = true;
    const { stage, controls, out } = frame(root, p.title);
    const el = svg(460, 300);
    stage.append(el);
    function points() {
      const ox = 50, oy = 260;
      const A = [ox, oy];
      let B, C, D;
      if (type === "parallelogram" || type === "rhombus") {
        const b = type === "rhombus" ? st.a : st.b;
        B = [ox + st.a * SC, oy];
        D = [ox + b * SC * Math.cos(rad(st.ang)), oy - b * SC * Math.sin(rad(st.ang))];
        C = [B[0] + D[0] - A[0], D[1]];
      } else if (type === "rectangle" || type === "square") {
        const b = type === "square" ? st.a : st.b;
        B = [ox + st.a * SC, oy]; C = [B[0], oy - b * SC]; D = [ox, oy - b * SC];
      } else {
        const off = type === "isoTrap" ? (st.a - st.top) / 2 : st.off;
        B = [ox + st.a * SC, oy];
        D = [ox + off * SC, oy - st.hgt * SC];
        C = [D[0] + st.top * SC, D[1]];
      }
      // markazlash
      const xs = [A, B, C, D].map((q) => q[0]);
      const shift = 230 - (Math.min(...xs) + Math.max(...xs)) / 2;
      return [A, B, C, D].map((q) => [q[0] + shift, q[1]]);
    }
    function render() {
      el.innerHTML = "";
      const [A, B, C, D] = points();
      poly(el, [A, B, C, D], { fill: "rgba(34,197,94,.12)", stroke: "#22c55e", "stroke-width": 3, class: "pop" });
      const O = (() => { // diagonallar kesishishi
        const [x1, y1] = A, [x2, y2] = C, [x3, y3] = B, [x4, y4] = D;
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
      })();
      if (showDiag) {
        line(el, A, C, { stroke: "#a78bfa", "stroke-width": 2, "stroke-dasharray": "6 4" });
        line(el, B, D, { stroke: "#f472b6", "stroke-width": 2, "stroke-dasharray": "6 4" });
        s("circle", { cx: O[0], cy: O[1], r: 4, fill: "#fff" }, el);
        label(el, O, "O", 12, -6, "#cbd5e1");
      }
      const AB = dist(A, B), BC = dist(B, C), CD = dist(C, D), DA = dist(D, A);
      const near = (x, y) => Math.abs(x - y) < 0.6;
      // belgilar
      const isPar = ["parallelogram", "rectangle", "rhombus", "square"].includes(type);
      if (isPar) { arrow(el, A, B, 1); arrow(el, D, C, 1); arrow(el, A, D, 2, "#fb923c"); arrow(el, B, C, 2, "#fb923c"); }
      else { arrow(el, A, B, 1); arrow(el, D, C, 1); }
      const eqAll = near(AB, BC) && near(BC, CD);
      if (eqAll) [[A, B], [B, C], [C, D], [D, A]].forEach(([P, Q]) => ticks(el, P, Q, 1));
      else if (isPar) { ticks(el, A, B, 1); ticks(el, C, D, 1); ticks(el, B, C, 2); ticks(el, D, A, 2); }
      else if (type === "isoTrap") { ticks(el, B, C, 1); ticks(el, D, A, 1); }
      const angs = { A: angleAt(A, B, D), B: angleAt(B, A, C), C: angleAt(C, B, D), D: angleAt(D, A, C) };
      [[A, B, D, "A"], [B, C, A, "B"], [C, D, B, "C"], [D, A, C, "D"]].forEach(([P, Q, R, k], i) => arc(el, P, Q, R, 22, COLORS[i], Math.round(angs[k]) + "°"));
      label(el, A, "A", -14, 18); label(el, B, "B", 14, 18); label(el, C, "C", 14, -8); label(el, D, "D", -14, -8);
      const mnLine = type === "trapezoid" || type === "isoTrap";
      if (mnLine) {
        const M = mid(A, D), N = mid(B, C);
        line(el, M, N, { stroke: "#fde047", "stroke-width": 3, "stroke-dasharray": "8 5" });
        label(el, mid(M, N), `o‘rta chiziq ${u(dist(M, N))}`, 0, 20, "#fde047");
      }
      const AO = dist(A, O), OC = dist(O, C), BO = dist(B, O), OD = dist(O, D), AC = dist(A, C), BD = dist(B, D);
      const diagAng = angleAt(O, A, B);
      const checks = [];
      const ck = (ok, t) => checks.push(`<div class="${ok ? "ok" : "no"}">${ok ? "✓" : "✗"} ${t}</div>`);
      if (isPar) {
        ck(near(AB, CD) && near(BC, DA), `Qarama-qarshi tomonlar teng: AB = CD = ${u(AB)}, BC = AD = ${u(BC)}`);
        ck(Math.abs(angs.A - angs.C) < 1 && Math.abs(angs.B - angs.D) < 1, `Qarama-qarshi burchaklar teng: ∠A = ∠C = ${Math.round(angs.A)}°, ∠B = ∠D = ${Math.round(angs.B)}°`);
        ck(Math.abs(angs.A + angs.B - 180) < 1, `Yonma-yon burchaklar yig‘indisi 180°: ${Math.round(angs.A)}° + ${Math.round(angs.B)}° = ${Math.round(angs.A + angs.B)}°`);
        ck(near(AO, OC) && near(BO, OD), `Diagonallar kesishish nuqtasida teng ikkiga bo‘linadi: AO = OC = ${u(AO)}, BO = OD = ${u(BO)}`);
        ck(near(AC, BD), `Diagonallar teng: AC = ${u(AC)}, BD = ${u(BD)}`);
        ck(Math.abs(diagAng - 90) < 1, `Diagonallar perpendikulyar: burchak ${Math.round(diagAng)}°`);
        ck(Math.abs(angs.A - 90) < 1, `Hamma burchaklar to‘g‘ri (90°)`);
        ck(eqAll, `Hamma tomonlar teng`);
      } else {
        ck(true, `Asoslar parallel: AB ∥ CD (AB = ${u(AB)}, CD = ${u(CD)})`);
        ck(near(BC, DA), `Yon tomonlar teng: AD = ${u(DA)}, BC = ${u(BC)}`);
        ck(Math.abs(angs.A - angs.B) < 1, `Asosdagi burchaklar teng: ∠A = ${Math.round(angs.A)}°, ∠B = ${Math.round(angs.B)}°`);
        ck(near(AC, BD), `Diagonallar teng: AC = ${u(AC)}, BD = ${u(BD)}`);
        ck(Math.abs(angs.A + angs.D - 180) < 1, `Yon tomondagi burchaklar yig‘indisi 180°: ∠A + ∠D = ${Math.round(angs.A + angs.D)}°`);
        ck(true, `O‘rta chiziq = (AB + CD) : 2 = (${u(AB)} + ${u(CD)}) : 2 = ${u((AB + CD) / 2)}`);
      }
      const area = Math.abs((A[0] * B[1] - B[0] * A[1]) + (B[0] * C[1] - C[0] * B[1]) + (C[0] * D[1] - D[0] * C[1]) + (D[0] * A[1] - A[0] * D[1])) / 2 / (SC * SC);
      out.innerHTML = `<div class="props">${checks.join("")}</div>
        <div class="muted">Perimetr: ${u(AB + BC + CD + DA)} · Yuza: ${num(Math.round(area * 10) / 10)} kv. birlik. Yashil ✓ — bu shaklda doim bajariladigan xossalar.</div>`;
    }
    const set = (k) => (v) => { st[k] = v; render(); };
    const ctl = [];
    if (type === "parallelogram") ctl.push(slider({ label: "AB tomon", min: 4, max: 10, step: 0.5, value: st.a, onInput: set("a") }), slider({ label: "AD tomon", min: 3, max: 7, step: 0.5, value: st.b, onInput: set("b") }), slider({ label: "∠A burchak", min: 30, max: 150, value: st.ang, fmt: (v) => v + "°", onInput: set("ang") }));
    if (type === "rhombus") { st.a = 6; ctl.push(slider({ label: "Tomon", min: 3, max: 7, step: 0.5, value: st.a, onInput: set("a") }), slider({ label: "∠A burchak", min: 30, max: 150, value: st.ang, fmt: (v) => v + "°", onInput: set("ang") })); }
    if (type === "rectangle") ctl.push(slider({ label: "Uzunlik", min: 3, max: 12, step: 0.5, value: st.a, onInput: set("a") }), slider({ label: "Eni", min: 2, max: 8, step: 0.5, value: st.b, onInput: set("b") }));
    if (type === "square") { st.a = 6; ctl.push(slider({ label: "Tomon", min: 2, max: 8, step: 0.5, value: st.a, onInput: set("a") })); }
    if (type === "trapezoid") ctl.push(slider({ label: "Katta asos AB", min: 6, max: 12, step: 0.5, value: st.a, onInput: set("a") }), slider({ label: "Kichik asos CD", min: 2, max: 6, step: 0.5, value: st.top, onInput: set("top") }), slider({ label: "Balandlik", min: 2, max: 7, step: 0.5, value: st.hgt, onInput: set("hgt") }), slider({ label: "Siljish", min: -2, max: 6, step: 0.5, value: st.off, onInput: set("off") }));
    if (type === "isoTrap") ctl.push(slider({ label: "Katta asos AB", min: 6, max: 12, step: 0.5, value: st.a, onInput: set("a") }), slider({ label: "Kichik asos CD", min: 2, max: 6, step: 0.5, value: st.top, onInput: set("top") }), slider({ label: "Balandlik", min: 2, max: 7, step: 0.5, value: st.hgt, onInput: set("hgt") }));
    controls.append(...ctl, button("Diagonallar: yoq/o‘chir", () => { showDiag = !showDiag; render(); }, "ghost"));
    render();
  };

  // ---------- Parallelogramm alomatlari: erkin to'rtburchak ----------
  W.quadFree = (root, p) => {
    const pts = { A: [80, 250], B: [300, 250], C: [410, 60], D: [120, 110] };
    const { stage, controls, out } = frame(root, p.title);
    const el = svg(460, 300);
    stage.append(el);
    function render() {
      el.innerHTML = "";
      const { A, B, C, D } = pts;
      poly(el, [A, B, C, D], { fill: "rgba(34,197,94,.12)", stroke: "#22c55e", "stroke-width": 3 });
      line(el, A, C, { stroke: "#a78bfa", "stroke-dasharray": "6 4", "stroke-width": 2 });
      line(el, B, D, { stroke: "#f472b6", "stroke-dasharray": "6 4", "stroke-width": 2 });
      const cross = (P, Q, R, S_) => Math.abs((Q[0] - P[0]) * (S_[1] - R[1]) - (Q[1] - P[1]) * (S_[0] - R[0])) / (dist(P, Q) * dist(R, S_));
      const parAB = cross(A, B, D, C) < 0.03, parAD = cross(A, D, B, C) < 0.03;
      const eqAB = Math.abs(dist(A, B) - dist(D, C)) < 8, eqAD = Math.abs(dist(A, D) - dist(B, C)) < 8;
      const M1 = mid(A, C), M2 = mid(B, D);
      const bis = dist(M1, M2) < 6;
      s("circle", { cx: M1[0], cy: M1[1], r: 4, fill: "#a78bfa" }, el);
      s("circle", { cx: M2[0], cy: M2[1], r: 4, fill: "#f472b6" }, el);
      if (parAB) { arrow(el, A, B, 1); arrow(el, D, C, 1); }
      if (parAD) { arrow(el, A, D, 2, "#fb923c"); arrow(el, B, C, 2, "#fb923c"); }
      const signs = [
        [parAB && eqAB || parAD && eqAD, "1-alomat: bir juft qarama-qarshi tomon <b>parallel va teng</b>"],
        [eqAB && eqAD, "2-alomat: qarama-qarshi tomonlar <b>juft-juft teng</b>"],
        [bis, "3-alomat: diagonallar kesishish nuqtasida <b>teng ikkiga bo‘linadi</b>"]
      ];
      const isPar = signs.some((x) => x[0]);
      for (const [k, P] of Object.entries(pts)) {
        const c = s("circle", { cx: P[0], cy: P[1], r: 11, fill: isPar ? "#22c55e" : "#f59e0b", stroke: "#fff", "stroke-width": 2, class: "handle" }, el);
        label(el, P, k, 0, k === "A" || k === "B" ? 28 : -16);
        draggable(el, c, (x, y) => {
          pts[k] = [Math.max(15, Math.min(445, x)), Math.max(25, Math.min(290, y))];
          render();
        });
      }
      out.innerHTML = `
        <div class="props">${signs.map(([ok, t]) => `<div class="${ok ? "ok" : "no"}">${ok ? "✓" : "✗"} ${t}</div>`).join("")}</div>
        <div class="big-num">${isPar ? "✅ Bu — parallelogramm!" : "Hozircha oddiy to‘rtburchak"}</div>
        <div class="muted">AB = ${u(dist(A, B))}, CD = ${u(dist(D, C))}, AD = ${u(dist(A, D))}, BC = ${u(dist(B, C))}. Diagonallar o‘rtalari (binafsha va pushti nuqta) ustma-ust tushsa — 3-alomat bajariladi.</div>`;
    }
    controls.append(
      h("p", { class: "muted" }, "👆 Uchlarni sudrab, shaklni parallelogrammga aylantiring."),
      button("✨ Parallelogramm qil", () => { pts.C = [pts.B[0] + pts.D[0] - pts.A[0], pts.B[1] + pts.D[1] - pts.A[1]]; render(); }),
      button("↺ Tasodifiy shakl", () => { pts.C = [330 + Math.random() * 90, 60 + Math.random() * 60]; pts.D = [90 + Math.random() * 90, 70 + Math.random() * 60]; render(); }, "ghost")
    );
    render();
  };

  // ---------- Fales teoremasi ----------
  W.thales = (root, p) => {
    const divide = p.mode === "divide";
    let n = 4, ang = 35, tilt = 25, step = 0;
    const { stage, controls, out } = frame(root, p.title);
    const el = svg(480, 320);
    stage.append(el);
    function render() {
      el.innerHTML = "";
      const O = [30, 290];
      const r1 = [Math.cos(0), -Math.sin(0)], r2 = [Math.cos(rad(ang)), -Math.sin(rad(ang))];
      if (!divide) {
        const L = 430;
        line(el, O, [O[0] + r1[0] * L, O[1] + r1[1] * L], { stroke: "#94a3b8", "stroke-width": 2 });
        line(el, O, [O[0] + r2[0] * L, O[1] + r2[1] * L], { stroke: "#94a3b8", "stroke-width": 2 });
        const seg = 300 / n;
        const dir = [Math.cos(rad(90 + tilt)), -Math.sin(rad(90 + tilt))];
        const B = [];
        for (let i = 1; i <= n; i++) {
          const A = [O[0] + r1[0] * seg * i * 1.15, O[1]];
          // A dan dir yo'nalishida 2-nur bilan kesishish
          const den = dir[0] * r2[1] - dir[1] * r2[0];
          const t = ((A[0] - O[0]) * r2[1] - (A[1] - O[1]) * r2[0]) / -den;
          const Bi = [A[0] + dir[0] * t, A[1] + dir[1] * t];
          B.push([A, Bi]);
          line(el, A, Bi, { stroke: COLORS[i % 10], "stroke-width": 2.5, class: "draw" });
          s("circle", { cx: A[0], cy: A[1], r: 4, fill: "#fde047" }, el);
          s("circle", { cx: Bi[0], cy: Bi[1], r: 4, fill: "#38bdf8" }, el);
          label(el, A, "A" + i, 0, 20, "#fde047");
          label(el, Bi, "B" + i, -10, -8, "#38bdf8");
        }
        const segA = B.map(([A], i) => dist(i ? B[i - 1][0] : O, A));
        const segB = B.map(([, Bi], i) => dist(i ? B[i - 1][1] : O, Bi));
        out.innerHTML = `
          <div class="steps"><div>1-nurda teng kesmalar: ${segA.map((v) => u(v)).join(" = ")}</div>
          <div>Parallel chiziqlar 2-nurda ham teng kesmalar hosil qildi: ${segB.map((v) => u(v)).join(" = ")} ✓</div></div>
          <div class="big-num">Fales: parallel to‘g‘ri chiziqlar burchak tomonlarida teng kesmalar ajratadi</div>
          <div class="muted">Burchak va chiziqlar qiyaligini o‘zgartiring — 2-nurdagi kesmalar uzunligi o‘zgaradi, lekin ular <b>doim o‘zaro teng</b>.</div>`;
      } else {
        // AB kesmani n ta teng bo'lakka bo'lish yasashi
        const A = [40, 250], Bp = [440, 250];
        line(el, A, Bp, { stroke: "#22c55e", "stroke-width": 4 });
        label(el, A, "A", 0, 24); label(el, Bp, "B", 0, 24);
        const ray = [Math.cos(rad(ang)), -Math.sin(rad(ang))];
        const unitL = 300 / n;
        const P = [...Array(n)].map((_, i) => [A[0] + ray[0] * unitL * (i + 1), A[1] + ray[1] * unitL * (i + 1)]);
        const texts = [
          "1) A nuqtadan ixtiyoriy nur o‘tkazamiz.",
          `2) Nurga sirkul bilan ${n} ta bir xil kesma qo‘yamiz.`,
          `3) Oxirgi nuqta (${n}) ni B bilan tutashtiramiz.`,
          "4) Qolgan nuqtalardan shu chiziqqa parallel chiziqlar o‘tkazamiz.",
          `5) Fales teoremasiga ko‘ra AB kesma ${n} ta teng bo‘lakka bo‘lindi!`
        ];
        if (step >= 1) line(el, A, [A[0] + ray[0] * 420, A[1] + ray[1] * 420], { stroke: "#94a3b8", "stroke-width": 2, class: "draw" });
        if (step >= 2) P.forEach((q, i) => { s("circle", { cx: q[0], cy: q[1], r: 5, fill: "#fde047", class: "pop", style: `animation-delay:${i * 120}ms` }, el); label(el, q, i + 1, -10, -8, "#fde047"); });
        if (step >= 3) line(el, P[n - 1], Bp, { stroke: "#f472b6", "stroke-width": 2.5, class: "draw" });
        if (step >= 4) {
          const d = [Bp[0] - P[n - 1][0], Bp[1] - P[n - 1][1]];
          for (let i = 0; i < n - 1; i++) {
            const t = (A[1] - P[i][1]) / d[1];
            const X = [P[i][0] + d[0] * t, A[1]];
            line(el, P[i], X, { stroke: "#f472b6", "stroke-width": 2, "stroke-dasharray": "6 4", class: "draw" });
            s("circle", { cx: X[0], cy: X[1], r: 5, fill: "#38bdf8", class: "pop" }, el);
          }
        }
        out.innerHTML = `<div class="steps">${texts.slice(0, Math.max(1, step)).map((t) => `<div>${t}</div>`).join("")}</div>
          ${step >= 5 ? `<div class="big-num">AB = ${u(400)} → har bir bo‘lak ${u(400 / n)}</div>` : ""}`;
      }
    }
    const ctl = [slider({ label: "Bo‘laklar soni", min: 2, max: 7, value: n, onInput: (v) => { n = v; render(); } }),
      slider({ label: "Burchak", min: 15, max: 70, value: ang, fmt: (v) => v + "°", onInput: (v) => { ang = v; render(); } })];
    if (!divide) ctl.push(slider({ label: "Parallel chiziqlar qiyaligi", min: -10, max: 60, value: tilt, fmt: (v) => v + "°", onInput: (v) => { tilt = v; render(); } }));
    else ctl.unshift(button("Keyingi qadam →", () => { step = Math.min(5, step + 1); render(); }), button("↺ Boshidan", () => { step = 0; render(); }, "ghost"));
    controls.append(...ctl);
    render();
  };

  // ---------- Fizika: erkin tushish ----------
  W.freeFall = (root, p) => {
    let H = 45, g = 9.8, running = false, raf = 0;
    const { stage, controls, out } = frame(root, p.title);
    const cv = h("canvas", { class: "ff-canvas", width: 640, height: 420 });
    stage.append(cv);
    const c = cv.getContext("2d");
    const T = () => Math.sqrt((2 * H) / g);
    function draw(t, trail) {
      const Wd = cv.width, Hd = cv.height, top = 40, bottom = Hd - 40;
      const sc = (bottom - top) / H;
      c.clearRect(0, 0, Wd, Hd);
      const sky = c.createLinearGradient(0, 0, 0, Hd);
      sky.addColorStop(0, g < 2 ? "#0b1020" : "#0c4a6e"); sky.addColorStop(1, g < 2 ? "#1e293b" : "#164e63");
      c.fillStyle = sky; c.fillRect(0, 0, Wd, Hd);
      c.fillStyle = g < 2 ? "#64748b" : g < 5 ? "#9a3412" : "#166534";
      c.fillRect(0, bottom, Wd, Hd - bottom);
      // bino
      c.fillStyle = "#334155"; c.fillRect(60, top, 90, bottom - top);
      c.fillStyle = "#fde68a";
      for (let y = top + 14; y < bottom - 14; y += 26) for (let x = 72; x < 140; x += 26) c.fillRect(x, y, 12, 14);
      // o'lchov chizig'i
      c.strokeStyle = "#94a3b8"; c.fillStyle = "#cbd5e1"; c.font = "12px system-ui";
      for (let m = 0; m <= H; m += H > 40 ? 10 : 5) {
        const y = top + m * sc;
        c.beginPath(); c.moveTo(560, y); c.lineTo(575, y); c.stroke();
        c.fillText(`${m} m`, 580, y + 4);
      }
      // iz (har 0.2 s)
      c.globalAlpha = 0.35;
      for (const tt of trail) {
        const y = top + 0.5 * g * tt * tt * sc;
        c.fillStyle = "#f97316"; c.beginPath(); c.arc(330, y, 13, 0, 7); c.fill();
        c.fillStyle = "#e2e8f0"; c.fillText(`${tt.toFixed(1)} s`, 352, y + 4);
      }
      c.globalAlpha = 1;
      const fallen = Math.min(H, 0.5 * g * t * t);
      const y = top + fallen * sc;
      const grad = c.createRadialGradient(325, y - 5, 2, 330, y, 16);
      grad.addColorStop(0, "#fff7ed"); grad.addColorStop(1, "#ea580c");
      c.fillStyle = grad; c.beginPath(); c.arc(330, y, 15, 0, 7); c.fill();
      // tezlik o'qi
      const v = Math.min(g * t, g * T());
      c.strokeStyle = "#fde047"; c.lineWidth = 4;
      c.beginPath(); c.moveTo(330, y + 18); c.lineTo(330, y + 18 + v * 2); c.stroke();
      c.lineWidth = 1;
      c.fillStyle = "#fde047"; c.font = "bold 13px system-ui";
      c.fillText(`v = ${v.toFixed(1)} m/s`, 400, y + 30);
      out.innerHTML = `
        <div class="ff-read"><span>⏱ t = <b>${Math.min(t, T()).toFixed(2)} s</b></span><span>📏 h = g·t²/2 = <b>${fallen.toFixed(1)} m</b></span><span>💨 v = g·t = <b>${v.toFixed(1)} m/s</b> (${(v * 3.6).toFixed(0)} km/soat)</span></div>
        <div class="steps"><div>Yerga tushish vaqti: t = √(2h/g) = √(2·${H}/${g}) = <b>${T().toFixed(2)} s</b></div>
        <div>Izlarga qarang: har 0,2 soniyada jism <b>tobora ko‘proq</b> masofa bosadi — chunki tezlik har soniyada ${g} m/s ga oshadi.</div></div>`;
    }
    function play() {
      cancelAnimationFrame(raf);
      running = true;
      const t0 = performance.now();
      const trail = [];
      const loop = (now) => {
        const t = (now - t0) / 1000;
        const mark = Math.floor(t / 0.2) * 0.2;
        if (mark > 0 && mark < T() && !trail.some((x) => Math.abs(x - mark) < 1e-6)) trail.push(mark);
        draw(t, trail);
        if (t < T() && running && cv.isConnected) raf = requestAnimationFrame(loop);
        else running = false;
      };
      raf = requestAnimationFrame(loop);
    }
    controls.append(
      button("▶ Tashlash", play),
      buttons(["🌍 Yer (9,8)", "🌙 Oy (1,6)", "🔴 Mars (3,7)"], (i) => { g = [9.8, 1.6, 3.7][i]; draw(0, []); }),
      slider({ label: "Balandlik", min: 5, max: 80, step: 5, value: H, fmt: (v) => v + " m", onInput: (v) => { H = v; draw(0, []); } })
    );
    draw(0, []);
  };
})();
