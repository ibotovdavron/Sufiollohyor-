/* Algebra va nisbatlar bo'yicha jonli tajribalar. */
(() => {
  "use strict";
  const { h, s, svg, gcd, num, fr, frSimple, slider, buttons, button, frame, wait, COLORS, W } = window.AK;

  // ---------- Algebraik ifoda qiymati ----------
  // item: { story, display, vars: {x:[min,max,start,label]}, fn, unit, draw: 'rect'|'items', icons }
  W.exprValue = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let item, vals;
    const sliders = h("div", { class: "ctl-group" });

    function picture() {
      if (item.draw === "rect") {
        const [x, y] = Object.keys(item.vars).map((k) => vals[k]);
        const sc = Math.min(260 / Math.max(x, 1), 120 / Math.max(y, 1), 26);
        const el = svg(340, 170);
        s("rect", { x: 170 - (x * sc) / 2, y: 85 - (y * sc) / 2, width: x * sc, height: y * sc, rx: 4, fill: "rgba(34,197,94,.25)", stroke: "#22c55e", "stroke-width": 3, class: "pop" }, el);
        const k = Object.keys(item.vars);
        s("text", { x: 170, y: 85 - (y * sc) / 2 - 8, "text-anchor": "middle", fill: "#86efac", "font-size": 15, "font-weight": 800, text: `${k[0]} = ${x}` }, el);
        s("text", { x: 170 + (x * sc) / 2 + 8, y: 90, fill: "#86efac", "font-size": 15, "font-weight": 800, text: `${k[1]} = ${y}` }, el);
        return el;
      }
      if (item.draw === "items") {
        const box = h("div", { class: "ev-items" });
        Object.entries(item.count || {}).forEach(([k, cnt], i) => {
          const g = h("div", { class: "ev-item" });
          for (let j = 0; j < cnt; j++) g.append(h("span", { style: `--d:${j * 60}ms` }, item.icons[i]));
          g.append(h("small", {}, `${cnt} ta · ${k} = ${num(vals[k])} ${item.unit || ""}`));
          box.append(g);
        });
        return box;
      }
      return h("div");
    }
    function render() {
      stage.innerHTML = `<div class="ev-story">${item.story}</div><div class="ev-expr">${item.display}</div>`;
      stage.append(picture());
      let sub = item.display;
      Object.keys(item.vars).forEach((k) => { sub = sub.replace(new RegExp(`(?<![a-zA-Z])${k}(?![a-zA-Z])`, "g"), `<b class="v">(${num(vals[k])})</b>`); });
      const val = item.fn(vals);
      out.innerHTML = `<div class="steps"><div>O‘rniga qo‘yamiz: ${sub}</div></div><div class="big-num">= ${num(val)} ${item.unit || ""}</div>`;
    }
    function load(i) {
      item = p.items[i];
      vals = {};
      sliders.innerHTML = "";
      Object.entries(item.vars).forEach(([k, [mn, mx, st, label]]) => {
        vals[k] = st;
        sliders.append(slider({ label: label || k, min: mn, max: mx, value: st, step: item.step || 1, fmt: (v) => `${k} = ${num(v)}`, onInput: (v) => { vals[k] = v; render(); } }));
      });
      render();
    }
    if (p.items.length > 1) controls.append(buttons(p.items.map((it, i) => `${i + 1}-misol`), load));
    controls.append(sliders);
    load(0);
  };

  // ---------- O'xshash hadlar (algebra plitkalari) ----------
  function parseTerms(src) {
    const terms = [];
    const re = /([+\-−]?)\s*(\d*)\s*([a-z]?)/gy;
    const str = src.replace(/\s+/g, "");
    let pos = 0;
    while (pos < str.length) {
      re.lastIndex = pos;
      const m = re.exec(str);
      if (!m || m[0] === "") return null;
      const sign = m[1] === "-" || m[1] === "−" ? -1 : 1;
      const coef = m[2] === "" ? 1 : Number(m[2]);
      if (m[2] === "" && m[3] === "") return null;
      terms.push({ k: sign * coef, v: m[3] || "" });
      pos = re.lastIndex;
    }
    return terms;
  }
  const termStr = (k, v, first) => {
    const sign = k < 0 ? "− " : first ? "" : "+ ";
    const abs = Math.abs(k);
    return `${sign}${abs === 1 && v ? "" : abs}${v}`;
  };
  W.likeTerms = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let terms = [];
    const KIND = { x: ["#22c55e", "x"], y: ["#3b82f6", "y"], "": ["#f59e0b", "1"] };
    function tiles(list) {
      const wrap = h("div", { class: "lt-row" });
      list.forEach((t, ti) => {
        const g = h("div", { class: "lt-term", style: `--d:${ti * 90}ms` });
        for (let i = 0; i < Math.min(Math.abs(t.k), 12); i++) {
          g.append(h("span", { class: `lt-tile k${t.v || "1"} ${t.k < 0 ? "neg" : ""}`, style: `--c:${KIND[t.v][0]}` }, (t.k < 0 ? "−" : "") + KIND[t.v][1]));
        }
        g.append(h("small", {}, termStr(t.k, t.v, ti === 0)));
        wrap.append(g);
      });
      return wrap;
    }
    function show(src) {
      const t = parseTerms(src);
      if (!t) { stage.innerHTML = `<p class="bad">Ifodani tushunmadim. Masalan: 3x + 2y − x + 4 − 1</p>`; return; }
      terms = t;
      stage.innerHTML = `<div class="lt-label">Boshlang‘ich ifoda:</div>`;
      stage.append(tiles(terms));
      out.innerHTML = `<span class="muted">Bir xil rangdagi plitkalar — o‘xshash hadlar. “Guruhlash” tugmasini bosing.</span>`;
    }
    async function group() {
      const order = ["x", "y", ""];
      const sorted = order.flatMap((v) => terms.filter((t) => t.v === v));
      stage.innerHTML = `<div class="lt-label">1) O‘xshash hadlarni yonma-yon qo‘yamiz:</div>`;
      stage.append(tiles(sorted));
      await wait(900);
      const res = order.map((v) => ({ v, k: terms.filter((t) => t.v === v).reduce((s_, t) => s_ + t.k, 0), had: terms.some((t) => t.v === v) })).filter((t) => t.had);
      stage.append(h("div", { class: "lt-label", html: "2) Musbat va manfiy plitkalar bir-birini yo‘qotadi (+x va −x = 0), qolganini sanaymiz:" }));
      stage.append(tiles(res.filter((t) => t.k !== 0)));
      const lines = res.map((r) => {
        const parts = terms.filter((t) => t.v === r.v).map((t, i) => termStr(t.k, t.v, i === 0)).join(" ");
        return `<div>${r.v || "sonlar"}: ${parts} = <b>${r.k === 0 ? "0" : termStr(r.k, r.v, true)}</b></div>`;
      });
      const final = res.filter((r) => r.k !== 0).map((r, i) => termStr(r.k, r.v, i === 0)).join(" ") || "0";
      out.innerHTML = `<div class="steps">${lines.join("")}</div><div class="big-num">= ${final}</div>`;
    }
    const input = h("input", { class: "dinput wide", value: p.examples[0], "aria-label": "Ifoda", spellcheck: "false" });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") show(input.value); });
    controls.append(
      buttons(p.examples.map((_, i) => `${i + 1}-misol`), (i) => { input.value = p.examples[i]; show(p.examples[i]); }),
      h("label", { class: "ctl wide" }, h("span", {}, "Ifoda (x, y va sonlar)"), input),
      button("Ko‘rsat", () => show(input.value), "ghost"),
      button("🧲 Guruhlash", group)
    );
    show(p.examples[0]);
  };

  // ---------- Tenglama: tarozi ----------
  // eq: [a, b, c, d] → a·x + b = c·x + d
  W.balance = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let eq, step = 0, L, R;
    const fmtSide = (k, n) => {
      const parts = [];
      if (k) parts.push(`${k === 1 ? "" : k}x`);
      if (n || !k) parts.push(parts.length ? `${n < 0 ? "−" : "+"} ${Math.abs(n)}` : `${n}`);
      return parts.join(" ");
    };
    function scene(tilt = 0) {
      const el = svg(520, 250);
      s("polygon", { points: "250,230 270,230 260,120", fill: "#94a3b8" }, el);
      s("rect", { x: 200, y: 228, width: 120, height: 10, rx: 4, fill: "#64748b" }, el);
      const g = s("g", { transform: `rotate(${tilt} 260 120)`, class: "beam" }, el);
      s("rect", { x: 40, y: 114, width: 440, height: 10, rx: 5, fill: "#cbd5e1" }, g);
      for (const [cx, side] of [[110, L], [410, R]]) {
        s("line", { x1: cx - 60, y1: 124, x2: cx - 70, y2: 170, stroke: "#94a3b8" }, g);
        s("line", { x1: cx + 60, y1: 124, x2: cx + 70, y2: 170, stroke: "#94a3b8" }, g);
        s("rect", { x: cx - 90, y: 170, width: 180, height: 10, rx: 5, fill: "#cbd5e1" }, g);
        let x = cx - 84;
        const bx = Math.min(side.k, 6);
        for (let i = 0; i < bx; i++) {
          s("rect", { x, y: 136, width: 26, height: 32, rx: 5, fill: "#22c55e", class: "pop", style: `animation-delay:${i * 60}ms` }, g);
          s("text", { x: x + 13, y: 158, "text-anchor": "middle", fill: "#052e16", "font-weight": 900, "font-size": 15, text: "x" }, g);
          x += 29;
        }
        if (side.n) {
          const wdt = Math.max(36, String(Math.abs(side.n)).length * 11 + 16);
          s("rect", { x, y: 140, width: wdt, height: 28, rx: 6, fill: side.n < 0 ? "#ef4444" : "#f59e0b", class: "pop" }, g);
          s("text", { x: x + wdt / 2, y: 159, "text-anchor": "middle", fill: "#1f2937", "font-weight": 900, "font-size": 14, text: side.n }, g);
        }
      }
      stage.innerHTML = "";
      stage.append(el);
      stage.append(h("div", { class: "big-num" }, `${fmtSide(L.k, L.n)} = ${fmtSide(R.k, R.n)}`));
    }
    function load(i) {
      eq = p.examples[i];
      const [a, b, c, d] = eq;
      L = { k: a, n: b }; R = { k: c, n: d };
      step = 0;
      scene(-6);
      setTimeout(() => scene(0), 400);
      out.innerHTML = `<span class="muted">Tarozi muvozanatda: chap va o‘ng tomon teng. Ikkala tomonga <b>bir xil</b> amal qilsak, muvozanat buzilmaydi.</span>`;
      nextBtn.disabled = false;
    }
    async function next() {
      const log = [];
      if (R.k) {
        log.push(`Ikkala tomondan ${R.k === 1 ? "" : R.k}x ni olib tashlaymiz`);
        L = { k: L.k - R.k, n: L.n }; R = { k: 0, n: R.n };
      } else if (L.n) {
        log.push(`Ikkala tomondan ${L.n} ni ${L.n > 0 ? "olib tashlaymiz" : "qo‘shamiz (manfiyni yo‘qotish uchun)"}`);
        R = { k: 0, n: R.n - L.n }; L = { k: L.k, n: 0 };
      } else if (L.k !== 1) {
        log.push(`Ikkala tomonni ${L.k} ga bo‘lamiz`);
        R = { k: 0, n: R.n / L.k }; L = { k: 1, n: 0 };
      }
      scene(4);
      await wait(350);
      scene(0);
      out.innerHTML = `<div class="steps"><div>${++step}-qadam: ${log[0]}.</div><div>${fmtSide(L.k, L.n)} = ${fmtSide(R.k, R.n)}</div></div>`;
      if (L.k === 1 && !L.n && !R.k) {
        const [a, b, c, d] = eq;
        const x = R.n;
        out.innerHTML += `<div class="big-num">x = ${num(x)}</div><div class="muted">Tekshiruv: ${a}·${num(x)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${num(a * x + b)}, ${c ? `${c}·${num(x)} ${d < 0 ? "−" : "+"} ${Math.abs(d)}` : d} = ${num(c * x + d)} ✓</div>`;
        nextBtn.disabled = true;
      }
    }
    const nextBtn = button("Keyingi qadam →", next);
    controls.append(buttons(p.examples.map((_, i) => `${i + 1}-tenglama`), load), nextBtn,
      button("🎲 Yangi tenglama", () => {
        const x = 1 + Math.floor(Math.random() * 9), a = 2 + Math.floor(Math.random() * 4), b = 1 + Math.floor(Math.random() * 15);
        p.examples.push([a, b, 0, a * x + b]);
        load(p.examples.length - 1);
      }, "ghost"));
    load(0);
  };

  // ---------- Nisbat: aralashma va oshirish ----------
  const mix = (c1, c2, t) => {
    const p1 = c1.match(/\w\w/g).map((x) => parseInt(x, 16)), p2 = c2.match(/\w\w/g).map((x) => parseInt(x, 16));
    return "#" + p1.map((v, i) => Math.round(v * (1 - t) + p2[i] * t).toString(16).padStart(2, "0")).join("");
  };
  W.ratioMix = (root, p) => {
    const it = p.items || [["Ko‘k bo‘yoq", "Sariq bo‘yoq", "#2563eb", "#facc15", "stakan"]];
    let a = 2, b = 3, k = 1, cur = 0;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const [n1, n2, c1, c2, unit] = it[cur];
      const A = a * k, B = b * k, T = A + B;
      const el = svg(520, 220);
      // ingredientlar
      const cell = Math.min(18, 160 / Math.max(A, B, 1));
      for (let i = 0; i < A; i++) s("rect", { x: 20 + (i % 10) * 20, y: 30 + Math.floor(i / 10) * 22, width: 16, height: 18, rx: 4, fill: c1, class: "pop", style: `animation-delay:${i * 30}ms` }, el);
      for (let i = 0; i < B; i++) s("rect", { x: 20 + (i % 10) * 20, y: 130 + Math.floor(i / 10) * 22, width: 16, height: 18, rx: 4, fill: c2, class: "pop", style: `animation-delay:${i * 30}ms` }, el);
      s("text", { x: 20, y: 22, fill: c1, "font-weight": 800, "font-size": 13, text: `${n1}: ${A} ${unit}` }, el);
      s("text", { x: 20, y: 122, fill: c2, "font-weight": 800, "font-size": 13, text: `${n2}: ${B} ${unit}` }, el);
      void cell;
      // idish
      const gx = 330, gy = 20, gw = 140, gh = 180;
      s("path", { d: `M${gx},${gy} L${gx + 12},${gy + gh} L${gx + gw - 12},${gy + gh} L${gx + gw},${gy}`, fill: "rgba(255,255,255,.06)", stroke: "#cbd5e1", "stroke-width": 3 }, el);
      const fill = Math.min(1, T / 40);
      const fh = (gh - 10) * (0.25 + 0.75 * fill);
      s("rect", { x: gx + 10, y: gy + gh - fh, width: gw - 20, height: fh - 2, fill: mix(c1.replace("#", ""), c2.replace("#", ""), B / T), class: "liquid" }, el);
      s("text", { x: gx + gw / 2, y: gy + gh + 18, "text-anchor": "middle", fill: "#cbd5e1", "font-size": 13, text: `Jami: ${T} ${unit}` }, el);
      stage.innerHTML = "";
      stage.append(el);
      const g = gcd(a, b);
      const rows = [1, 2, 3, 4, 5].map((m) => `<tr class="${m === k ? "on" : ""}"><td>×${m}</td><td>${a * m}</td><td>${b * m}</td><td>${a * m + b * m}</td></tr>`).join("");
      out.innerHTML = `
        <div class="big-num">${a} : ${b}${k > 1 ? ` = ${A} : ${B}` : ""}${g > 1 ? ` <small>(soddalashtirilgani ${a / g} : ${b / g})</small>` : ""}</div>
        <div class="steps"><div>Nisbat ${k} marta oshirildi — ikkala qism ham ${k} ga ko‘paydi, ta’m/rang <b>o‘zgarmadi</b>.</div>
        <div>${n1} butun aralashmaning ${fr(a, a + b)} qismi, ${n2} — ${fr(b, a + b)} qismi.</div></div>
        <table class="rt"><tr><th></th><th>${n1}</th><th>${n2}</th><th>Jami</th></tr>${rows}</table>`;
    }
    if (it.length > 1) controls.append(buttons(it.map((x) => `${x[0]} + ${x[1]}`), (i) => { cur = i; render(); }));
    controls.append(
      slider({ label: "1-qism", min: 1, max: 9, value: a, onInput: (v) => { a = v; render(); } }),
      slider({ label: "2-qism", min: 1, max: 9, value: b, onInput: (v) => { b = v; render(); } }),
      slider({ label: "Nisbatni oshirish (necha marta)", min: 1, max: 5, value: k, fmt: (v) => "×" + v, onInput: (v) => { k = v; render(); } })
    );
    render();
  };

  // ---------- Nisbat bo'yicha bo'lish (2 yoki 3 qism) ----------
  W.ratioShare = (root, p) => {
    const names = p.names || ["Ali", "Vali", "Gani"];
    const n = p.parts || 2;
    let parts = n === 3 ? [2, 3, 5] : [3, 5], total = n === 3 ? 200000 : 64;
    const unit = p.unit || "ta";
    const { stage, controls, out } = frame(root, p.title);
    const totalCtl = slider({ label: "Jami miqdor", min: 1, max: 20, value: 8, fmt: (v) => num(v * sum() * (p.scale || 1)), onInput: (v) => { total = v * sum() * (p.scale || 1); render(); } });
    function sum() { return parts.reduce((a, b) => a + b, 0); }
    function render() {
      const S = sum(), u = total / S;
      stage.innerHTML = "";
      const box = h("div", { class: "rs" });
      parts.forEach((pt, i) => {
        const row = h("div", { class: "rs-row" }, h("span", { class: "rs-name" }, names[i]));
        const bar = h("div", { class: "rs-bar" });
        for (let j = 0; j < pt; j++) bar.append(h("i", { style: `--c:${COLORS[i]};--d:${(i * 4 + j) * 70}ms` }, num(u)));
        row.append(bar, h("b", {}, `${num(u * pt)} ${unit}`));
        box.append(row);
      });
      stage.append(box);
      out.innerHTML = `<div class="steps">
        <div>1) Jami ulushlar: ${parts.join(" + ")} = <b>${S}</b></div>
        <div>2) Bir ulush: ${num(total)} : ${S} = <b>${num(u)}</b> ${unit}</div>
        ${parts.map((pt, i) => `<div>3) ${names[i]}: ${num(u)} · ${pt} = <b>${num(u * pt)}</b></div>`).join("")}
        <div>Tekshiruv: ${parts.map((pt) => num(u * pt)).join(" + ")} = ${num(total)} ✓</div></div>`;
    }
    const ctl = parts.map((pt, i) => slider({ label: `${names[i]} ulushi`, min: 1, max: 9, value: pt, onInput: (v) => {
      parts[i] = v;
      total = Number(totalCtl.input.value) * sum() * (p.scale || 1);
      totalCtl.set(totalCtl.input.value);
      render();
    } }));
    controls.append(...ctl, totalCtl);
    total = 8 * sum() * (p.scale || 1);
    render();
  };

  // ---------- O'zgaruvchan nisbat: oldin va keyin ----------
  W.ratioChange = (root, p) => {
    let a = 3, b = 5, u = 8, t = 6, mode = 0;
    const { stage, controls, out } = frame(root, p.title);
    const modes = ["Ali Valiga beradi", "Ikkalasiga bir xil qo‘shiladi", "Faqat Aliga qo‘shiladi"];
    function bars(A, B, label) {
      const mx = Math.max(A, B, 1);
      return `<div class="rc-block"><div class="rc-cap">${label}</div>
        <div class="rs-row"><span class="rs-name">Ali</span><div class="rc-b" style="width:${(A / mx) * 100}%;--c:#3b82f6">${A}</div></div>
        <div class="rs-row"><span class="rs-name">Vali</span><div class="rc-b" style="width:${(B / mx) * 100}%;--c:#f59e0b">${B}</div></div></div>`;
    }
    function render() {
      const A = a * u, B = b * u;
      let A2 = A, B2 = B;
      if (mode === 0) { A2 = A - t; B2 = B + t; }
      else if (mode === 1) { A2 = A + t; B2 = B + t; }
      else { A2 = A + t; }
      const g1 = gcd(A, B), g2 = gcd(A2, B2);
      stage.innerHTML = `<div class="rc-wrap">${bars(A, B, "Oldin")}${bars(A2, B2, "Keyin")}</div>`;
      out.innerHTML = A2 < 0 ? `<p class="bad">Alida buncha narsa yo‘q!</p>` : `
        <div class="steps">
          <div>Oldin: ${A} : ${B} = <b>${A / g1} : ${B / g1}</b></div>
          <div>${modes[mode]}: ${t} ta</div>
          <div>Keyin: ${A2} : ${B2} = <b>${A2 / g2} : ${B2 / g2}</b></div>
          <div>${mode === 0 ? "Jami o‘zgarmadi: " + (A + B) + " = " + (A2 + B2) + " — shuning uchun “jami ulushlar” orqali yechiladi." : mode === 1 ? "Ayirma o‘zgarmadi: " + (B - A) + " = " + (B2 - A2) + " — shuning uchun “farq” orqali yechiladi." : "Valiniki o‘zgarmadi: " + B + " — shu miqdor orqali yechiladi."}</div>
        </div>`;
    }
    controls.append(
      buttons(modes, (i) => { mode = i; render(); }),
      slider({ label: "Ali ulushi", min: 1, max: 9, value: a, onInput: (v) => { a = v; render(); } }),
      slider({ label: "Vali ulushi", min: 1, max: 9, value: b, onInput: (v) => { b = v; render(); } }),
      slider({ label: "Bir ulush", min: 1, max: 12, value: u, onInput: (v) => { u = v; render(); } }),
      slider({ label: "O‘zgarish miqdori", min: 1, max: 30, value: t, onInput: (v) => { t = v; render(); } })
    );
    render();
  };

  // ---------- Qisqa ko'paytirish formulalari: yuza modeli ----------
  W.squareArea = (root, p) => {
    let a = 5, b = 2, mode = 0;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const sc = 230 / Math.max(a + b, 1);
      const el = svg(320, 290);
      const o = 40;
      const R = (x, y, w, hh, fill, label, d = 0) => {
        s("rect", { x: o + x * sc, y: o + y * sc, width: w * sc, height: hh * sc, fill, stroke: "#0b1220", "stroke-width": 2, class: "pop", style: `animation-delay:${d}ms` }, el);
        if (w * sc > 26 && hh * sc > 18) s("text", { x: o + (x + w / 2) * sc, y: o + (y + hh / 2) * sc + 5, "text-anchor": "middle", fill: "#0b1220", "font-weight": 900, "font-size": 14, text: label }, el);
      };
      let text;
      if (mode === 0) {
        R(0, 0, a, a, "#22c55e", "a²"); R(a, 0, b, a, "#3b82f6", "ab", 150); R(0, a, a, b, "#3b82f6", "ab", 300); R(a, a, b, b, "#f59e0b", "b²", 450);
        s("text", { x: o + (a * sc) / 2, y: o - 8, "text-anchor": "middle", fill: "#86efac", "font-weight": 800, text: `a = ${a}` }, el);
        s("text", { x: o + (a + b / 2) * sc, y: o - 8, "text-anchor": "middle", fill: "#fcd34d", "font-weight": 800, text: `b = ${b}` }, el);
        text = `(a + b)² = a² + 2ab + b²<br>(${a} + ${b})² = ${a * a} + ${2 * a * b} + ${b * b} = <b>${(a + b) ** 2}</b>`;
      } else if (mode === 1) {
        const c = a - b;
        R(0, 0, c, c, "#22c55e", "(a−b)²"); R(c, 0, b, a, "rgba(239,68,68,.55)", "ab", 150); R(0, c, a, b, "rgba(239,68,68,.35)", "ab", 300); R(c, c, b, b, "#f59e0b", "b²", 450);
        s("text", { x: o + (a * sc) / 2, y: o - 8, "text-anchor": "middle", fill: "#86efac", "font-weight": 800, text: `a = ${a}` }, el);
        text = `(a − b)² = a² − 2ab + b²<br>Katta kvadratdan (a²) ikki “ab” tasmani olib tashlaymiz, b² ikki marta olingani uchun bir marta qaytaramiz.<br>(${a} − ${b})² = ${a * a} − ${2 * a * b} + ${b * b} = <b>${(a - b) ** 2}</b>`;
      } else {
        R(0, 0, a, a - b, "#22c55e", "", 0); R(0, a - b, a - b, b, "#22c55e", "", 0); R(a - b, a - b, b, b, "rgba(239,68,68,.35)", "b²", 200);
        s("text", { x: o + (a * sc) / 2, y: o + ((a - b) * sc) / 2, "text-anchor": "middle", fill: "#052e16", "font-weight": 900, text: "a² − b²" }, el);
        text = `a² − b² = (a − b)(a + b)<br>Yashil shaklni kesib, uzunligi (a + b), eni (a − b) bo‘lgan to‘g‘ri to‘rtburchakka yig‘ish mumkin.<br>${a}² − ${b}² = ${a * a - b * b} = (${a} − ${b})(${a} + ${b}) = ${a - b} · ${a + b} ✓`;
      }
      stage.innerHTML = "";
      stage.append(el);
      out.innerHTML = `<div class="big-num formula">${text}</div>`;
    }
    const cb = slider({ label: "b", min: 1, max: a - 1, value: b, onInput: (v) => { b = v; render(); } });
    controls.append(buttons(["(a + b)²", "(a − b)²", "a² − b²"], (i) => { mode = i; render(); }),
      slider({ label: "a", min: 3, max: 10, value: a, onInput: (v) => { a = v; b = Math.min(b, a - 1); cb.setRange(1, a - 1); cb.set(b); render(); } }), cb);
    render();
  };

  // ---------- Algebraik kasr: soddalashtirish va tekshirish ----------
  // item: { from, to, steps:[], f1(x), f2(x), bad:[x...] }
  W.formulaCheck = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let item, x = 2, si = 0;
    function plot() {
      const el = svg(360, 220);
      const X = (v) => 180 + v * 18, Y = (v) => 110 - v * 9;
      s("line", { x1: 0, y1: 110, x2: 360, y2: 110, stroke: "#475569" }, el);
      s("line", { x1: 180, y1: 0, x2: 180, y2: 220, stroke: "#475569" }, el);
      let d = "", prevOk = false;
      for (let v = -9.9; v <= 9.9; v += 0.05) {
        const y = item.f1(v);
        const ok = isFinite(y) && Math.abs(y) < 13 && !item.bad.some((b) => Math.abs(b - v) < 0.06);
        if (ok) { d += `${prevOk ? "L" : "M"}${X(v).toFixed(1)},${Y(y).toFixed(1)} `; }
        prevOk = ok;
      }
      s("path", { d, fill: "none", stroke: "#22c55e", "stroke-width": 3, class: "draw" }, el);
      item.bad.forEach((b) => {
        const y = item.f2(b);
        if (isFinite(y) && Math.abs(y) < 13) s("circle", { cx: X(b), cy: Y(y), r: 5, fill: "#0b1220", stroke: "#ef4444", "stroke-width": 2.5 }, el);
        s("line", { x1: X(b), y1: 0, x2: X(b), y2: 220, stroke: "rgba(239,68,68,.4)", "stroke-dasharray": "4 4" }, el);
      });
      const y1 = item.f1(x);
      if (isFinite(y1) && Math.abs(y1) < 13) s("circle", { cx: X(x), cy: Y(y1), r: 6, fill: "#fde047" }, el);
      return el;
    }
    function render() {
      stage.innerHTML = `<div class="fc"><div class="fc-eq">${item.from} <span>=</span> ${item.to}</div></div>`;
      stage.append(plot());
      const ok = !item.bad.some((b) => Math.abs(b - x) < 1e-9);
      const v1 = item.f1(x), v2 = item.f2(x);
      out.innerHTML = `
        <div class="steps">${item.steps.slice(0, si).map((t, i) => `<div><span class="oo-n">${i + 1}</span> ${t}</div>`).join("")}</div>
        <div class="fc-check">x = <b>${num(x)}</b> da: chap tomon = <b>${ok ? num(Math.round(v1 * 1000) / 1000, 3) : "aniqlanmagan (maxraj 0)"}</b>,
          o‘ng tomon = <b>${ok ? num(Math.round(v2 * 1000) / 1000, 3) : "—"}</b> ${ok ? "✓ teng" : "⚠️ bu qiymat mumkin emas"}</div>
        <div class="muted">Grafikda qizil halqa — kasr ma’noga ega bo‘lmagan nuqta (${item.bad.map((b) => "x = " + b).join(", ") || "yo‘q"}).</div>`;
    }
    function load(i) { item = p.items[i]; si = 0; render(); }
    controls.append(
      ...(p.items.length > 1 ? [buttons(p.items.map((_, i) => `${i + 1}-misol`), load)] : []),
      button("Keyingi qadam →", () => { if (si < item.steps.length) { si++; render(); } }),
      slider({ label: "x qiymati (tekshirish)", min: -6, max: 6, step: 0.5, value: x, fmt: (v) => num(v), onInput: (v) => { x = v; render(); } })
    );
    load(0);
  };

  // ---------- y = k/x giperbola ----------
  W.hyperbola = (root, p) => {
    let k = 12, x = 3;
    const { stage, controls, out } = frame(root, p.title);
    function render() {
      const el = svg(380, 380);
      const X = (v) => 190 + v * 15, Y = (v) => 190 - v * 15;
      for (let i = -12; i <= 12; i += 2) {
        s("line", { x1: X(i), y1: 0, x2: X(i), y2: 380, stroke: "rgba(148,163,184,.12)" }, el);
        s("line", { x1: 0, y1: Y(i), x2: 380, y2: Y(i), stroke: "rgba(148,163,184,.12)" }, el);
      }
      s("line", { x1: 0, y1: 190, x2: 380, y2: 190, stroke: "#94a3b8" }, el);
      s("line", { x1: 190, y1: 0, x2: 190, y2: 380, stroke: "#94a3b8" }, el);
      s("text", { x: 368, y: 184, fill: "#94a3b8", text: "x" }, el);
      s("text", { x: 196, y: 14, fill: "#94a3b8", text: "y" }, el);
      for (const sign of [1, -1]) {
        let d = "";
        for (let v = 0.3; v <= 12.5; v += 0.05) {
          const xv = sign * v, yv = k / xv;
          if (Math.abs(yv) > 13) continue;
          d += `${d ? "L" : "M"}${X(xv).toFixed(1)},${Y(yv).toFixed(1)} `;
        }
        s("path", { d, fill: "none", stroke: k > 0 ? "#22c55e" : "#f472b6", "stroke-width": 3, class: "draw" }, el);
      }
      const y = k / x;
      if (Math.abs(y) <= 13) {
        s("rect", { x: Math.min(X(0), X(x)), y: Math.min(Y(0), Y(y)), width: Math.abs(x * 15), height: Math.abs(y * 15), fill: "rgba(253,224,71,.18)", stroke: "#fde047", "stroke-dasharray": "5 4" }, el);
        s("circle", { cx: X(x), cy: Y(y), r: 7, fill: "#fde047" }, el);
        s("text", { x: X(x) + 10, y: Y(y) - 8, fill: "#fde047", "font-weight": 800, text: `(${num(x)}; ${num(Math.round(y * 100) / 100)})` }, el);
      }
      stage.innerHTML = "";
      stage.append(el);
      out.innerHTML = `
        <div class="big-num">y = ${k} / x</div>
        <div class="steps">
          <div>Sariq to‘rtburchak yuzi: |x · y| = ${num(Math.abs(x))} · ${num(Math.abs(Math.round(y * 100) / 100))} = <b>${Math.abs(k)}</b> — nuqta qayerda bo‘lmasin, doim |k|!</div>
          <div>${k > 0 ? "k > 0: grafik I va III choraklarda, x ortsa y kamayadi." : "k < 0: grafik II va IV choraklarda, har bir oraliqda x ortsa y ham ortadi."}</div>
          <div>x = 0 bo‘lishi mumkin emas, y ham hech qachon 0 ga teng bo‘lmaydi — grafik o‘qlarga yaqinlashadi, lekin kesib o‘tmaydi.</div>
          ${p.story && k > 0 ? `<div>🚗 ${p.story.replace("{k}", k).replace("{x}", num(x)).replace("{y}", num(Math.round(y * 100) / 100))}</div>` : ""}
        </div>`;
    }
    controls.append(
      slider({ label: "k", min: -24, max: 24, value: k, onInput: (v) => { k = v === 0 ? 1 : v; render(); } }),
      slider({ label: "x (nuqta)", min: -12, max: 12, step: 0.5, value: x, fmt: (v) => num(v), onInput: (v) => { x = v === 0 ? 0.5 : v; render(); } })
    );
    render();
  };
})();
