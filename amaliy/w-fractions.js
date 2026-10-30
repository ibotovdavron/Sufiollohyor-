/* Kasrlar bo'yicha jonli tajribalar. */
(() => {
  "use strict";
  const { h, s, svg, gcd, num, fr, frSimple, slider, buttons, button, frame, wait, COLORS, W } = window.AK;

  function pieSlice(cx, cy, r, a0, a1) {
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`;
  }

  // ---------- Bo'lishni kasr ko'rinishida: a ta pitsani b kishiga ----------
  W.shareDivision = (root, p) => {
    let a = p.a || 3, b = p.b || 4;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const R = 46, gap = 16, per = Math.min(a, 4);
      const rows = Math.ceil(a / per);
      const W_ = per * (2 * R + gap) + gap, H_ = rows * (2 * R + gap) + gap;
      const el = svg(W_, H_);
      for (let i = 0; i < a; i++) {
        const cx = gap + R + (i % per) * (2 * R + gap), cy = gap + R + Math.floor(i / per) * (2 * R + gap);
        s("circle", { cx, cy, r: R + 4, fill: "#b45309" }, el);
        for (let j = 0; j < b; j++) {
          const a0 = -Math.PI / 2 + (j * 2 * Math.PI) / b, a1 = a0 + (2 * Math.PI) / b;
          const path = s("path", { d: pieSlice(cx, cy, R, a0, a1), fill: COLORS[j % 10], stroke: "#fff7ed", "stroke-width": 2, class: "pop", style: `animation-delay:${(i * b + j) * 40}ms` }, el);
          s("title", { text: `${j + 1}-do‘st` }, path);
        }
      }
      stage.innerHTML = "";
      stage.append(el);
      const legend = h("div", { class: "legend" });
      for (let j = 0; j < b; j++) legend.append(h("span", { style: `--c:${COLORS[j % 10]}` }, `${j + 1}-do‘st: ${a} bo‘lak`));
      stage.append(legend);
      out.innerHTML = `
        <div>${a} ta pitsa ${b} kishiga teng bo‘lindi. Har bir pitsa ${b} bo‘lakka kesildi, har kim har bir pitsadan 1 bo‘lakdan oldi.</div>
        <div class="big-num">${a} : ${b} = ${fr(a, b)}${a > b || gcd(a, b) > 1 ? " = " + frSimple(a, b) : ""} pitsa</div>
        <div class="muted">Qoida: <b>a : b = ${fr("a", "b")}</b> — bo‘linuvchi suratga, bo‘luvchi maxrajga yoziladi.</div>`;
    }
    controls.append(
      slider({ label: "Pitsalar soni (a)", min: 1, max: 8, value: a, onInput: (v) => { a = v; render(); } }),
      slider({ label: "Do‘stlar soni (b)", min: 2, max: 8, value: b, onInput: (v) => { b = v; render(); } })
    );
    render();
  };

  // ---------- Oddiy kasrni o'nli kasrga: 100 katakli to'r ----------
  W.decimalGrid = (root, p) => {
    const list = p.list || [[1, 2], [1, 4], [3, 4], [2, 5], [3, 5], [7, 10], [3, 20], [9, 25], [17, 50], [1, 8], [3, 8]];
    let cur = 2;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const [n, d] = list[cur];
      const total = d === 8 ? 1000 : 100;
      const k = total / d;
      const shaded = n * k;
      const el = svg(220, 220);
      const cells = 10, cs = 20;
      for (let i = 0; i < 100; i++) {
        const x = 10 + (i % cells) * cs, y = 10 + Math.floor(i / cells) * cs;
        const full = total === 100 ? i < shaded : i < Math.floor(shaded / 10);
        const part = total === 1000 && i === Math.floor(shaded / 10) ? (shaded % 10) / 10 : 0;
        s("rect", { x, y, width: cs - 2, height: cs - 2, rx: 3, fill: full ? "#22c55e" : "rgba(255,255,255,.08)", class: full ? "pop" : "", style: `animation-delay:${i * 8}ms` }, el);
        if (part) s("rect", { x, y, width: (cs - 2) * part, height: cs - 2, rx: 3, fill: "#22c55e" }, el);
      }
      stage.innerHTML = "";
      stage.append(el);
      const dec = n / d;
      out.innerHTML = `
        <div class="steps">
          <div>1) Maxrajni ${total === 100 ? "100" : "1000"} ga yetkazamiz: ${d} · ${k} = ${total}</div>
          <div>2) Suratni ham shu songa ko‘paytiramiz: ${n} · ${k} = ${shaded}</div>
          <div>3) ${fr(n, d)} = ${fr(shaded, total)} = <b>${String(dec).replace(".", ",")}</b></div>
        </div>
        <div class="big-num">${fr(n, d)} = ${String(dec).replace(".", ",")}</div>
        <div class="muted">${total === 100 ? `100 ta katakdan ${shaded} tasi bo‘yaldi — bu ${shaded} yuzdan bir.` : `Har katak 10 ga bo‘lingan deb tasavvur qiling: 1000 dan ${shaded} qismi.`} Tekshirish: ${n} : ${d} = ${String(dec).replace(".", ",")}</div>`;
    }
    controls.append(buttons(list.map(([n, d]) => fr(n, d)), (i) => { cur = i; render(); }, cur));
    render();
  };

  // ---------- Kasrlarni qo'shish/ayirish (oddiy va aralash) ----------
  W.fracAdd = (root, p) => {
    const mixed = p.mode === "mixed";
    let d = 6, A = mixed ? 2 : 0, a = mixed ? 5 : 2, B = mixed ? 1 : 0, b = mixed ? 3 : 3, op = "+";
    const { stage, controls, out } = frame(root, p.title);

    function bar(whole, part, color, label) {
      const row = h("div", { class: "fb-row" }, h("span", { class: "fb-label", html: label }));
      for (let w = 0; w < whole; w++) {
        const unit = h("div", { class: "fb-unit" });
        for (let i = 0; i < d; i++) unit.append(h("span", { class: "on", style: `--c:${color}` }));
        row.append(unit);
      }
      if (part > 0 || whole === 0) {
        const unit = h("div", { class: "fb-unit" });
        for (let i = 0; i < d; i++) unit.append(h("span", { class: i < part ? "on" : "", style: `--c:${color};--d:${i * 40}ms` }));
        row.append(unit);
      }
      return row;
    }
    function render() {
      const n1 = A * d + a, n2 = B * d + b;
      const res = op === "+" ? n1 + n2 : n1 - n2;
      stage.innerHTML = "";
      const lab = (W_, x) => (W_ ? `<span class="num">${W_}</span>` : "") + fr(x, d);
      stage.append(bar(A, a, "#3b82f6", lab(A, a)), bar(B, b, "#f59e0b", (op === "+" ? "+ " : "− ") + lab(B, b)));
      if (res >= 0) {
        stage.append(bar(Math.floor(res / d), res % d, "#22c55e", "= " + frSimple(res, d)));
      }
      let steps;
      if (!mixed) {
        steps = [`Maxrajlar bir xil (${d}) — maxraj o‘zgarmaydi.`, `Suratlar: ${a} ${op === "+" ? "+" : "−"} ${b} = ${a + (op === "+" ? b : -b)}`, `Natija: ${fr(res, d)}${gcd(Math.abs(res), d) > 1 || res > d ? " = " + frSimple(res, d) : ""}`];
      } else if (op === "+") {
        const sumW = A + B, sumF = a + b;
        steps = [`Butun qismlarni qo‘shamiz: ${A} + ${B} = ${sumW}`, `Kasr qismlarni qo‘shamiz: ${fr(a, d)} + ${fr(b, d)} = ${fr(sumF, d)}`,
          sumF >= d ? `${fr(sumF, d)} — noto‘g‘ri kasr, undan 1 butun ajratamiz: ${fr(sumF, d)} = 1 ${fr(sumF - d, d)}` : "Kasr qism to‘g‘ri kasr — ajratish shart emas.",
          `Natija: ${frSimple(res, d)}`];
      } else {
        steps = a >= b
          ? [`Butunlarni ayiramiz: ${A} − ${B} = ${A - B}`, `Kasrlarni ayiramiz: ${fr(a, d)} − ${fr(b, d)} = ${fr(a - b, d)}`, `Natija: ${res >= 0 ? frSimple(res, d) : "manfiy — kamayuvchi kichik!"}`]
          : [`${fr(a, d)} dan ${fr(b, d)} ni ayirib bo‘lmaydi, shuning uchun ${A} butundan 1 tasini kasrga aylantiramiz:`, `${A} ${fr(a, d)} = ${A - 1} ${fr(a + d, d)}`, `Endi: (${A - 1} − ${B}) va ${fr(a + d, d)} − ${fr(b, d)} = ${fr(a + d - b, d)}`, `Natija: ${res >= 0 ? frSimple(res, d) : "manfiy — kamayuvchi kichik!"}`];
      }
      out.innerHTML = `<div class="steps">${steps.map((t) => `<div>${t}</div>`).join("")}</div>`;
    }
    const cA = slider({ label: "1-son butuni", min: 0, max: 4, value: A, onInput: (v) => { A = v; render(); } });
    const ca = slider({ label: "1-kasr surati", min: 0, max: d - 1, value: a, onInput: (v) => { a = v; render(); } });
    const cB = slider({ label: "2-son butuni", min: 0, max: 4, value: B, onInput: (v) => { B = v; render(); } });
    const cb = slider({ label: "2-kasr surati", min: 0, max: d - 1, value: b, onInput: (v) => { b = v; render(); } });
    const cd = slider({ label: "Umumiy maxraj", min: 2, max: 12, value: d, onInput: (v) => {
      d = v; a = Math.min(a, d - 1); b = Math.min(b, d - 1);
      ca.setRange(0, d - 1); cb.setRange(0, d - 1); ca.set(a); cb.set(b); render();
    } });
    controls.append(buttons(["＋ Qo‘shish", "− Ayirish"], (i) => { op = i ? "−" : "+"; render(); }), cd, ...(mixed ? [cA] : []), ca, ...(mixed ? [cB] : []), cb);
    render();
  };

  // ---------- To'plamning qismi ----------
  W.setPart = (root, p) => {
    const icons = p.icons || ["🍎", "🍬", "📗", "⚽"];
    let icon = 0, N = 24, b = 4, a = 3;
    const { stage, controls, out } = frame(root, p.title);
    const divisors = (n) => [...Array(n).keys()].map((x) => x + 1).filter((x) => x > 1 && n % x === 0 && x <= 12);
    function render() {
      const groups = h("div", { class: "sp-groups" });
      const per = N / b;
      for (let g = 0; g < b; g++) {
        const box = h("div", { class: "sp-group" + (g < a ? " on" : ""), style: `--d:${g * 90}ms` });
        for (let i = 0; i < per; i++) box.append(h("span", {}, icons[icon]));
        groups.append(box);
      }
      stage.innerHTML = "";
      stage.append(groups);
      out.innerHTML = `
        <div class="steps"><div>1) ${N} ta narsani ${b} ta teng guruhga bo‘lamiz: ${N} : ${b} = ${per} (bu ${fr(1, b)} qism)</div>
        <div>2) ${a} ta guruhni olamiz: ${per} · ${a} = <b>${per * a}</b></div></div>
        <div class="big-num">${N} ning ${fr(a, b)} qismi = ${N} : ${b} · ${a} = ${per * a}</div>`;
    }
    const cb = slider({ label: "Maxraj (nechta guruh)", min: 0, max: 0, value: 0, fmt: (i) => divisors(N)[i] ?? b, onInput: (i) => { b = divisors(N)[i]; a = Math.min(a, b); ca.setRange(1, b); ca.set(a); render(); } });
    const ca = slider({ label: "Surat (nechta guruh olinadi)", min: 1, max: b, value: a, onInput: (v) => { a = v; render(); } });
    const syncB = () => { const ds = divisors(N); if (!ds.includes(b)) b = ds[Math.min(ds.length - 1, 2)] || ds[0]; cb.setRange(0, ds.length - 1); cb.set(ds.indexOf(b)); a = Math.min(a, b); ca.setRange(1, b); ca.set(a); };
    const cN = slider({ label: "Jami narsalar", min: 6, max: 36, step: 6, value: N, onInput: (v) => { N = v; syncB(); render(); } });
    controls.append(buttons(icons, (i) => { icon = i; render(); }), cN, cb, ca);
    syncB();
    render();
  };

  // ---------- Kasrni natural songa ko'paytirish (aralash son ham) ----------
  W.fracTimesNat = (root, p) => {
    const mixed = p.mode === "mixed";
    let Wh = mixed ? 1 : 0, a = mixed ? 1 : 3, b = 4, n = 3;
    const { stage, controls, out } = frame(root, p.title);
    function unit(filled, color, delay = 0) {
      const u = h("div", { class: "fb-unit" });
      for (let i = 0; i < b; i++) u.append(h("span", { class: i < filled ? "on" : "", style: `--c:${color};--d:${delay + i * 40}ms` }));
      return u;
    }
    function render(combined = false) {
      stage.innerHTML = "";
      const num_ = Wh * b + a;
      if (!combined) {
        for (let k = 0; k < n; k++) {
          const row = h("div", { class: "fb-row" }, h("span", { class: "fb-label", html: `${k + 1}-marta` }));
          for (let w = 0; w < Wh; w++) row.append(unit(b, COLORS[k % 10], k * 120));
          row.append(unit(a, COLORS[k % 10], k * 120));
          stage.append(row);
        }
      } else {
        const total = num_ * n;
        const row = h("div", { class: "fb-row wrap" }, h("span", { class: "fb-label", html: "Jami" }));
        let left = total, k = 0;
        while (left > 0) { row.append(unit(Math.min(b, left), "#22c55e", k * 150)); left -= b; k++; }
        stage.append(row);
      }
      const total = num_ * n;
      const first = Wh ? `${Wh} ${fr(a, b)}` : fr(a, b);
      const steps = mixed
        ? [`Aralash sonni noto‘g‘ri kasrga aylantiramiz: ${Wh} ${fr(a, b)} = ${fr(`${Wh}·${b}+${a}`, b)} = ${fr(num_, b)}`, `Suratni ${n} ga ko‘paytiramiz: ${fr(num_ + " · " + n, b)} = ${fr(total, b)}`, `Butun qismini ajratamiz: ${frSimple(total, b)}`]
        : [`Faqat surat ko‘paytiriladi, maxraj o‘zgarmaydi: ${fr(a + " · " + n, b)} = ${fr(total, b)}`, `Soddalashtiramiz: ${frSimple(total, b)}`];
      out.innerHTML = `<div class="steps">${steps.map((t) => `<div>${t}</div>`).join("")}</div>
        <div class="big-num">${first} · ${n} = ${frSimple(total, b)}</div>`;
    }
    const ca = slider({ label: "Surat", min: 1, max: b - 1, value: a, onInput: (v) => { a = v; render(); } });
    controls.append(
      ...(mixed ? [slider({ label: "Butun qismi", min: 1, max: 3, value: Wh, onInput: (v) => { Wh = v; render(); } })] : []),
      ca,
      slider({ label: "Maxraj", min: 2, max: 10, value: b, onInput: (v) => { b = v; a = Math.min(a, b - 1); ca.setRange(1, b - 1); ca.set(a); render(); } }),
      slider({ label: "Natural son (necha marta)", min: 2, max: 6, value: n, onInput: (v) => { n = v; render(); } }),
      button("🔀 Bo‘laklarni birlashtir", () => render(true)),
      button("↺ Qaytarish", () => render(false), "ghost")
    );
    render();
  };

  // ---------- Kasrni kasrga ko'paytirish: yuza modeli ----------
  W.areaModel = (root, p) => {
    const mode = p.mode || "proper"; // proper | mixed | improper
    let a = mode === "proper" ? 2 : 5, b = 3, c = mode === "improper" ? 7 : 3, d = 4;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const ux = Math.max(1, Math.ceil(a / b)), uy = Math.max(1, Math.ceil(c / d));
      const U = Math.min(170, 300 / Math.max(ux, uy));
      const W_ = ux * U + 40, H_ = uy * U + 40;
      const el = svg(W_, H_);
      const ox = 30, oy = 10;
      // birlik kvadratlar
      for (let i = 0; i < ux; i++) for (let j = 0; j < uy; j++) s("rect", { x: ox + i * U, y: oy + j * U, width: U, height: U, fill: "rgba(255,255,255,.04)", stroke: "#94a3b8", "stroke-width": 2 }, el);
      // to'r chiziqlari
      for (let i = 1; i < ux * b; i++) s("line", { x1: ox + (i * U) / b, y1: oy, x2: ox + (i * U) / b, y2: oy + uy * U, stroke: "rgba(148,163,184,.35)" }, el);
      for (let j = 1; j < uy * d; j++) s("line", { x1: ox, y1: oy + (j * U) / d, x2: ox + ux * U, y2: oy + (j * U) / d, stroke: "rgba(148,163,184,.35)" }, el);
      const wA = (a / b) * U, hC = (c / d) * U;
      s("rect", { x: ox, y: oy, width: wA, height: uy * U, fill: "rgba(59,130,246,.35)", class: "grow-x" }, el);
      s("rect", { x: ox, y: oy, width: ux * U, height: hC, fill: "rgba(245,158,11,.35)", class: "grow-y" }, el);
      s("rect", { x: ox, y: oy, width: wA, height: hC, fill: "rgba(34,197,94,.75)", stroke: "#22c55e", "stroke-width": 3, class: "pop", style: "animation-delay:.6s" }, el);
      s("text", { x: ox + wA / 2, y: H_ - 6, "text-anchor": "middle", fill: "#93c5fd", "font-size": 14, "font-weight": 800, text: `${a}/${b}` }, el);
      s("text", { x: 14, y: oy + hC / 2, "text-anchor": "middle", fill: "#fcd34d", "font-size": 14, "font-weight": 800, transform: `rotate(-90 14 ${oy + hC / 2})`, text: `${c}/${d}` }, el);
      stage.innerHTML = "";
      stage.append(el);
      const N = a * c, D = b * d;
      out.innerHTML = `
        <div class="steps">
          <div>🟦 Ko‘k: ${fr(a, b)} — kenglik. 🟧 Sariq: ${fr(c, d)} — balandlik. 🟩 Yashil — ikkalasining ustma-ust qismi, ya’ni ko‘paytma.</div>
          <div>Bitta birlik kvadrat ${b} · ${d} = <b>${D}</b> ta mayda katakka bo‘lingan. Yashil kataklar soni: ${a} · ${c} = <b>${N}</b>.</div>
          <div>Qoida: suratni suratga, maxrajni maxrajga ko‘paytiramiz: ${fr(`${a} · ${c}`, `${b} · ${d}`)} = ${fr(N, D)}${gcd(N, D) > 1 || N > D ? " = " + frSimple(N, D) : ""}</div>
        </div>
        <div class="big-num">${fr(a, b)} · ${fr(c, d)} = ${frSimple(N, D)}</div>`;
    }
    const range = (den, kind) => kind === "proper" ? [1, den - 1] : [den + 1, 3 * den - 1];
    const k1 = mode === "proper" ? "proper" : "improper";
    const k2 = mode === "improper" ? "improper" : "proper";
    const ca = slider({ label: "1-kasr surati", min: range(b, k1)[0], max: range(b, k1)[1], value: a, onInput: (v) => { a = v; render(); } });
    const cc = slider({ label: "2-kasr surati", min: range(d, k2)[0], max: range(d, k2)[1], value: c, onInput: (v) => { c = v; render(); } });
    const fix = () => {
      const r1 = range(b, k1), r2 = range(d, k2);
      a = Math.min(Math.max(a, r1[0]), r1[1]); c = Math.min(Math.max(c, r2[0]), r2[1]);
      ca.setRange(...r1); cc.setRange(...r2); ca.set(a); cc.set(c);
    };
    controls.append(ca,
      slider({ label: "1-kasr maxraji", min: 2, max: 6, value: b, onInput: (v) => { b = v; fix(); render(); } }),
      cc,
      slider({ label: "2-kasr maxraji", min: 2, max: 6, value: d, onInput: (v) => { d = v; fix(); render(); } }));
    fix();
    render();
  };

  // ---------- Qolgan qismning qismi ----------
  W.remainderPart = (root, p) => {
    let a = 1, b = 3, c = 1, d = 4, k = 6;
    const { stage, controls, out } = frame(root, p.title);
    const unitName = p.unit || "so‘m";
    function render() {
      const T = k * b * d * 1000;
      const first = (T * a) / b, rest = T - first, second = (rest * c) / d, left = rest - second;
      stage.innerHTML = `
        <div class="rp">
          <div class="rp-row"><span>Jami</span><div class="rp-bar">
            <i style="flex:${first};--c:#ef4444" class="g">${p.first || "Kitob"}<br>${num(first)}</i>
            <i style="flex:${rest};--c:#334155">qoldi ${num(rest)}</i></div></div>
          <div class="rp-row"><span>Qolgan</span><div class="rp-bar" style="margin-left:${(first / T) * 100}%">
            <i style="flex:${second};--c:#f59e0b;--d:.5s" class="g">${p.second || "Daftar"}<br>${num(second)}</i>
            <i style="flex:${left};--c:#22c55e;--d:.9s" class="g">qoldi<br>${num(left)}</i></div></div>
        </div>`;
      out.innerHTML = `
        <div class="steps">
          <div>1) ${num(T)} ${unitName}ning ${fr(a, b)} qismi: ${num(T)} : ${b} · ${a} = <b>${num(first)}</b></div>
          <div>2) Qolgani: ${num(T)} − ${num(first)} = <b>${num(rest)}</b> (bu ${fr(b - a, b)} qism)</div>
          <div>3) Qolganning ${fr(c, d)} qismi: ${num(rest)} : ${d} · ${c} = <b>${num(second)}</b></div>
          <div>4) Oxirida qoldi: ${num(rest)} − ${num(second)} = <b>${num(left)}</b></div>
        </div>
        <div class="muted">Diqqat: “qolganning ${fr(c, d)} qismi” — bu jami pulning emas, <b>qolgan</b> pulning qismi!</div>`;
    }
    const ca = slider({ label: "1-qism surati", min: 1, max: b - 1, value: a, onInput: (v) => { a = v; render(); } });
    const cc = slider({ label: "2-qism surati", min: 1, max: d - 1, value: c, onInput: (v) => { c = v; render(); } });
    controls.append(
      ca, slider({ label: "1-qism maxraji", min: 2, max: 6, value: b, onInput: (v) => { b = v; a = Math.min(a, b - 1); ca.setRange(1, b - 1); ca.set(a); render(); } }),
      cc, slider({ label: "2-qism maxraji", min: 2, max: 6, value: d, onInput: (v) => { d = v; c = Math.min(c, d - 1); cc.setRange(1, d - 1); cc.set(c); render(); } }),
      slider({ label: "Jami pul", min: 1, max: 10, value: k, fmt: (v) => num(v * b * d * 1000), onInput: (v) => { k = v; render(); } })
    );
    render();
  };

  // ---------- Kasrlarni bo'lish ----------
  W.fracDivide = (root, p) => {
    const mode = p.mode; // fracNat | natFrac | fracFrac
    let a = mode === "natFrac" ? 3 : 3, b = mode === "natFrac" ? 1 : 4, c = mode === "fracNat" ? 2 : 1, d = mode === "fracNat" ? 1 : 4;
    if (mode === "fracFrac") { a = 3; b = 4; c = 1; d = 8; }
    const { stage, controls, out } = frame(root, p.title);

    let token = 0;
    async function render() {
      const my = ++token;
      const N = a * d, D = b * c; // natija = (a/b) : (c/d) = (a·d)/(b·c)
      stage.innerHTML = "";
      const max = Math.max(1, Math.ceil(a / b));
      const Wd = 560, x0 = 20, U = (Wd - 40) / max;
      const el = svg(Wd, 140);
      for (let i = 0; i <= max; i++) {
        s("line", { x1: x0 + i * U, y1: 20, x2: x0 + i * U, y2: 120, stroke: "#64748b", "stroke-dasharray": "4 4" }, el);
        s("text", { x: x0 + i * U, y: 136, "text-anchor": "middle", fill: "#94a3b8", "font-size": 13, text: i }, el);
      }
      const len = (a / b) * U;
      s("rect", { x: x0, y: 24, width: len, height: 34, rx: 6, fill: "#3b82f6", class: "grow-x" }, el);
      s("text", { x: x0 + len / 2, y: 46, "text-anchor": "middle", fill: "#fff", "font-size": 14, "font-weight": 800, text: b === 1 ? `${a}` : `${a}/${b}` }, el);
      stage.append(el);
      if (mode === "fracNat") {
        // a/b ni c ta teng bo'lakka bo'lamiz
        const piece = len / c;
        for (let i = 0; i < c; i++) {
          await wait(250);
          if (my !== token) return;
          s("rect", { x: x0 + i * piece + 1, y: 70, width: piece - 2, height: 34, rx: 6, fill: COLORS[i % 10], class: "pop" }, el);
          s("text", { x: x0 + i * piece + piece / 2, y: 92, "text-anchor": "middle", fill: "#0b1220", "font-size": 12, "font-weight": 800, text: `${a}/${b * c}` }, el);
        }
        out.innerHTML = `
          <div>${fr(a, b)} ni ${c} ta teng bo‘lakka bo‘ldik — har bir bo‘lak ${fr(a, b * c)}.</div>
          <div class="steps"><div>Qoida: kasrni natural songa bo‘lish uchun <b>maxrajni</b> shu songa ko‘paytiramiz:</div>
          <div>${fr(a, b)} : ${c} = ${fr(a, `${b} · ${c}`)} = ${frSimple(a, b * c)}</div></div>`;
        return;
      }
      // nechta c/d sig'adi?
      const piece = (c / d) * U;
      const count = (a / b) / (c / d);
      const full = Math.floor(count + 1e-9);
      for (let i = 0; i < Math.ceil(count - 1e-9); i++) {
        await wait(180);
        if (my !== token) return;
        const wPart = i < full ? piece : (count - full) * piece;
        s("rect", { x: x0 + i * piece + 1, y: 70, width: Math.max(2, wPart - 2), height: 34, rx: 6, fill: i < full ? COLORS[i % 10] : "#e2e8f0", class: "pop" }, el);
        if (i < full && piece > 22) s("text", { x: x0 + i * piece + piece / 2, y: 92, "text-anchor": "middle", fill: "#0b1220", "font-size": 12, "font-weight": 800, text: i + 1 }, el);
      }
      out.innerHTML = `
        <div>Savol: ${b === 1 ? a : fr(a, b)} ning ichiga ${fr(c, d)} nechta sig‘adi? Rasmda — <b>${frSimple(N, D)}</b> ta.</div>
        <div class="steps"><div>Qoida: bo‘luvchini <b>teskari kasrga</b> almashtirib, ko‘paytiramiz:</div>
        <div>${b === 1 ? a : fr(a, b)} : ${fr(c, d)} = ${b === 1 ? a : fr(a, b)} · ${fr(d, c)} = ${fr(N, D)}${gcd(N, D) > 1 || N > D ? " = " + frSimple(N, D) : ""}</div></div>`;
    }
    const ctls = [];
    if (mode === "natFrac") {
      ctls.push(slider({ label: "Natural son", min: 1, max: 5, value: a, onInput: (v) => { a = v; render(); } }));
      const cc = slider({ label: "Kasr surati", min: 1, max: d - 1, value: c, onInput: (v) => { c = v; render(); } });
      ctls.push(cc, slider({ label: "Kasr maxraji", min: 2, max: 8, value: d, onInput: (v) => { d = v; c = Math.min(c, d - 1); cc.setRange(1, d - 1); cc.set(c); render(); } }));
    } else {
      const ca = slider({ label: "Bo‘linuvchi surati", min: 1, max: b - 1, value: a, onInput: (v) => { a = v; render(); } });
      ctls.push(ca, slider({ label: "Bo‘linuvchi maxraji", min: 2, max: 8, value: b, onInput: (v) => { b = v; a = Math.min(a, b - 1); ca.setRange(1, b - 1); ca.set(a); render(); } }));
      if (mode === "fracNat") ctls.push(slider({ label: "Natural son (bo‘luvchi)", min: 2, max: 6, value: c, onInput: (v) => { c = v; render(); } }));
      else {
        const cc = slider({ label: "Bo‘luvchi surati", min: 1, max: d - 1, value: c, onInput: (v) => { c = v; render(); } });
        ctls.push(cc, slider({ label: "Bo‘luvchi maxraji", min: 2, max: 12, value: d, onInput: (v) => { d = v; c = Math.min(c, d - 1); cc.setRange(1, d - 1); cc.set(c); render(); } }));
      }
    }
    controls.append(...ctls);
    render();
  };
})();
