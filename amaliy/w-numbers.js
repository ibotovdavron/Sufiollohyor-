/* Natural sonlar bo'yicha jonli tajribalar. */
(() => {
  "use strict";
  const { h, num, words, slider, buttons, button, frame, wait, rich, W } = window.AK;

  const PLACES = ["birlar", "o‘nlar", "yuzlar", "minglar", "o‘n minglar", "yuz minglar", "millionlar", "o‘n millionlar"];
  const CLASSES = [["Birlar sinfi", 0, 3], ["Minglar sinfi", 3, 6], ["Millionlar sinfi", 6, 8]];

  // ---------- Xona birliklari ----------
  W.placeValue = (root, p) => {
    const cols = p.cols || 6;
    const max = 10 ** cols - 1;
    let value = p.start || 254381;
    const { stage, controls, out } = frame(root, p.title);

    const grid = h("div", { class: "pv-grid", style: `--cols:${cols}` });
    stage.append(grid);

    function render() {
      const digits = String(value).padStart(cols, "0").split("");
      const lead = String(value).length;
      grid.innerHTML = "";
      const groups = h("div", { class: "pv-classes" });
      CLASSES.forEach(([name, from, to]) => {
        const span = Math.min(to, cols) - from;
        if (span > 0) groups.prepend(h("div", { class: "pv-class", style: `flex:${span}` }, name));
      });
      grid.append(groups);
      const row = h("div", { class: "pv-row" });
      digits.forEach((d, i) => {
        const place = cols - 1 - i;
        const active = place < lead;
        row.append(h("div", { class: "pv-col" + (active ? "" : " off") + (place % 3 === 2 && place > 0 ? " sep" : "") },
          h("span", { class: "pv-name" }, PLACES[place]),
          h("span", { class: "pv-digit", style: `--d:${i * 60}ms` }, active ? d : "·"),
          h("span", { class: "pv-val" }, active && d !== "0" ? num(Number(d) * 10 ** place) : "")));
      });
      grid.append(row);
      const parts = [];
      String(value).split("").forEach((d, i, arr) => {
        const place = arr.length - 1 - i;
        if (d !== "0") parts.push(`${d} · ${num(10 ** place)}`);
      });
      out.innerHTML = `
        <div class="big-num">${num(value)}</div>
        <div class="read">🗣 <b>${words(value)}</b></div>
        <div class="muted">Xona qo‘shiluvchilari: ${parts.join(" + ") || "0"}</div>`;
    }

    const input = h("input", { type: "number", min: 0, max, value, class: "dinput", "aria-label": "Son" });
    input.addEventListener("input", () => {
      const v = Math.max(0, Math.min(max, Math.floor(Number(input.value) || 0)));
      value = v;
      render();
    });
    controls.append(
      h("label", { class: "ctl" }, h("span", {}, "Sonni yozing"), input),
      button("🎲 Tasodifiy son", () => {
        value = Math.floor(10 ** (cols - 1) + Math.random() * (max - 10 ** (cols - 1)));
        input.value = value;
        render();
      }),
      button("+1", () => { value = Math.min(max, value + 1); input.value = value; render(); }, "ghost"),
      button("+1 000", () => { value = Math.min(max, value + 1000); input.value = value; render(); }, "ghost")
    );
    render();
  };

  // ---------- 10, 100, 1000 ga ko'paytirish / bo'lish ----------
  W.times10 = (root, p) => {
    const div = p.mode === "div";
    const round = !!p.round;
    const COLS = 9;
    let n = p.start || (div ? 84000 : 4507);
    let factor = round ? (div ? 300 : 30) : 100;
    const { stage, controls, out } = frame(root, p.title);

    const board = h("div", { class: "tx-board" });
    const head = h("div", { class: "tx-head" });
    for (let i = COLS - 1; i >= 0; i--) head.append(h("span", {}, ["bir", "o‘n", "yuz", "ming", "o‘n m.", "yuz m.", "mln", "o‘n mln", "yuz mln"][i]));
    const lane = h("div", { class: "tx-lane" });
    board.append(head, lane);
    stage.append(board);

    let chips = [];
    function place(chip, col) { chip.style.left = `calc(${(COLS - 1 - col)} * (100% / ${COLS}))`; }
    function draw(v) {
      lane.innerHTML = "";
      chips = String(v).split("").map((d, i, arr) => {
        const c = h("span", { class: "tx-chip" }, d);
        place(c, arr.length - 1 - i);
        c.dataset.col = arr.length - 1 - i;
        lane.append(c);
        return c;
      });
    }

    async function run() {
      runBtn.disabled = true;
      draw(n);
      const zeros = String(factor).length - 1;
      const lead = Number(String(factor)[0]);
      const steps = [];
      let shown = n;
      await wait(350);
      if (!div) {
        if (round && lead > 1) {
          shown = n * lead;
          steps.push(`${num(n)} · ${lead} = <b>${num(shown)}</b>`);
          draw(shown);
          lane.classList.add("flash");
          await wait(600);
          lane.classList.remove("flash");
        }
        // raqamlar chapga suriladi, o'ngdan nollar keladi
        chips.forEach((c) => { const col = Number(c.dataset.col) + zeros; place(c, col); });
        for (let z = 0; z < zeros; z++) {
          const c = h("span", { class: "tx-chip zero" }, "0");
          place(c, z);
          c.style.opacity = 0;
          lane.append(c);
          setTimeout(() => (c.style.opacity = 1), 450 + z * 120);
        }
        const result = shown * 10 ** zeros;
        steps.push(`${num(shown)} · ${num(10 ** zeros)} = <b>${num(result)}</b> — oxiriga ${zeros} ta nol qo‘shildi`);
        out.innerHTML = `<div class="steps">${steps.map((t) => `<div>${t}</div>`).join("")}</div>
          <div class="big-num">${num(n)} · ${num(factor)} = ${num(n * factor)}</div>`;
      } else {
        const divisor10 = 10 ** zeros;
        const q = Math.floor(n / divisor10), rem = n % divisor10;
        // o'ngdagi raqamlar chiqib ketadi
        chips.forEach((c) => {
          const col = Number(c.dataset.col) - zeros;
          if (col < 0) { c.classList.add("gone"); } else place(c, col);
        });
        steps.push(rem === 0
          ? `${num(n)} : ${num(divisor10)} = <b>${num(q)}</b> — oxiridagi ${zeros} ta nol olib tashlandi`
          : `${num(n)} : ${num(divisor10)} = <b>${num(q)}</b> (qoldiq ${num(rem)}) — oxirgi ${zeros} ta raqam qoldiq bo‘ldi`);
        let final = q, finalRem = rem;
        if (round && lead > 1) {
          await wait(900);
          final = Math.floor(q / lead);
          const r2 = q % lead;
          steps.push(`${num(q)} : ${lead} = <b>${num(final)}</b>${r2 ? ` (qoldiq ${r2})` : ""}`);
          draw(final);
          finalRem = rem + r2 * divisor10;
        }
        out.innerHTML = `<div class="steps">${steps.map((t) => `<div>${t}</div>`).join("")}</div>
          <div class="big-num">${num(n)} : ${num(factor)} = ${num(final)}${finalRem ? ` <small>(qoldiq ${num(finalRem)})</small>` : ""}</div>`;
      }
      await wait(700);
      runBtn.disabled = false;
    }

    const input = h("input", { type: "number", min: 1, max: div ? 999999999 : 999999, value: n, class: "dinput", "aria-label": "Son" });
    input.addEventListener("input", () => { n = Math.max(1, Math.floor(Number(input.value) || 1)); draw(n); out.innerHTML = ""; });
    const factors = round ? (div ? [20, 300, 4000, 500] : [30, 400, 2000, 50]) : [10, 100, 1000];
    const seg = buttons(factors.map((f) => (div ? ":" : "×") + " " + num(f)), (i) => { factor = factors[i]; draw(n); out.innerHTML = ""; }, round ? (div ? 1 : 0) : 1);
    const runBtn = button(div ? "▶ Bo‘lish" : "▶ Ko‘paytirish", run);
    controls.append(h("label", { class: "ctl" }, h("span", {}, "Son"), input), seg, runBtn);
    draw(n);
  };

  // ---------- Amallar tartibi ----------
  function tokenize(src) {
    const t = [];
    const re = /\s*(\d+(?:[.,]\d+)?|[+\-−×*x:/÷()])/gy;
    let m;
    let pos = 0;
    src = src.trim();
    while (pos < src.length) {
      re.lastIndex = pos;
      m = re.exec(src);
      if (!m) return null;
      let tok = m[1];
      if (/^\d/.test(tok)) t.push(Number(tok.replace(",", ".")));
      else t.push({ "-": "−", "*": "×", x: "×", "/": ":", "÷": ":" }[tok] || tok);
      pos = re.lastIndex;
    }
    return t;
  }
  const show = (tokens, from = -1, to = -1) => tokens.map((tk, i) => {
    const txt = typeof tk === "number" ? num(tk, 4) : tk;
    if (i === from) return `<mark>${txt}`;
    if (i === to) return `${txt}</mark>`;
    return txt;
  }).join(" ").replace(/<mark>([^<]*)<\/mark>/, "<mark>$1</mark>").replace(/\( /g, "(").replace(/ \)/g, ")");

  function stepsOf(tokens) {
    const steps = [];
    let t = tokens.slice();
    for (let guard = 0; guard < 60 && t.length > 1; guard++) {
      // eng ichki qavs
      let lo = 0, hi = t.length - 1;
      const close = t.indexOf(")");
      if (close >= 0) {
        hi = close;
        lo = t.lastIndexOf("(", close);
        if (lo < 0) return null;
        if (hi - lo === 2) { t.splice(hi, 1); t.splice(lo, 1); continue; }
        lo += 1; hi -= 1;
      }
      let k = -1;
      for (let i = lo; i <= hi; i++) if (t[i] === "×" || t[i] === ":") { k = i; break; }
      if (k < 0) for (let i = lo; i <= hi; i++) if (t[i] === "+" || t[i] === "−") { k = i; break; }
      if (k < 0) return null;
      const a = t[k - 1], b = t[k + 1];
      if (typeof a !== "number" || typeof b !== "number") return null;
      const r = { "+": a + b, "−": a - b, "×": a * b, ":": a / b }[t[k]];
      const why = t[k] === "×" || t[k] === ":" ? "ko‘paytirish va bo‘lish birinchi" : "qo‘shish va ayirish keyin";
      steps.push({ before: show(t, k - 1, k + 1), op: `${num(a, 4)} ${t[k]} ${num(b, 4)} = ${num(Math.round(r * 1e6) / 1e6, 4)}`, why: close >= 0 ? "qavs ichi birinchi" : why });
      t.splice(k - 1, 3, Math.round(r * 1e6) / 1e6);
    }
    return { steps, result: t[0] };
  }

  W.orderOps = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let list = p.examples;
    let cur = null, idx = 0;
    const board = h("div", { class: "oo-board" });
    stage.append(board);

    function load(expr) {
      const tokens = tokenize(expr);
      const res = tokens && stepsOf(tokens);
      if (!res) { board.innerHTML = `<p class="bad">Ifodani tushunmadim. Faqat sonlar va + − × : ( ) belgilaridan foydalaning.</p>`; cur = null; return; }
      cur = res; idx = 0;
      board.innerHTML = `<div class="oo-line start">${show(tokens)}</div>`;
      out.innerHTML = `<span class="muted">“Keyingi qadam” tugmasini bosing.</span>`;
      nextBtn.disabled = false;
    }
    function next() {
      if (!cur) return;
      if (idx >= cur.steps.length) return;
      const st = cur.steps[idx++];
      board.append(h("div", { class: "oo-line", html: `<span class="oo-n">${idx}</span> ${st.before} <small>→ ${st.op} <em>(${st.why})</em></small>` }));
      if (idx >= cur.steps.length) {
        board.append(h("div", { class: "oo-line final", html: `= <b>${num(cur.result, 4)}</b>` }));
        out.innerHTML = `✅ Javob: <b>${num(cur.result, 4)}</b>. ${cur.steps.length} ta amal bajarildi.`;
        nextBtn.disabled = true;
      }
    }

    const nextBtn = button("Keyingi qadam →", next);
    const allBtn = button("Hammasini ko‘rsat", () => { while (cur && idx < cur.steps.length) next(); }, "ghost");
    const seg = buttons(list.map((e, i) => `${i + 1}-misol`), (i) => { input.value = list[i]; load(list[i]); });
    const input = h("input", { type: "text", value: list[0], class: "dinput wide", "aria-label": "Ifoda", spellcheck: "false" });
    const own = button("O‘z misolim", () => load(input.value), "ghost");
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") load(input.value); });
    controls.append(seg, h("label", { class: "ctl wide" }, h("span", {}, "Ifoda (o‘zingiz ham yozing)"), input), own, nextBtn, allBtn);
    load(list[0]);
  };

  // ---------- Matnli masala: kesma (bar) modeli ----------
  W.wordProblem = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let pi = 0, si = 0;

    function drawBars(pr) {
      const max = Math.max(...pr.bars.map((b) => b.parts.reduce((s, x) => s + x.v, 0)));
      return `<div class="wp-bars">${pr.bars.map((b) => `
        <div class="wp-row"><span class="wp-label">${rich(b.label)}</span>
          <div class="wp-bar" style="width:${(b.parts.reduce((s, x) => s + x.v, 0) / max) * 100}%">
            ${b.parts.map((x, i) => `<span class="wp-part" style="flex:${x.v};--c:${x.c || window.AK.COLORS[i % 10]};--d:${i * 120}ms">${rich(x.t ?? "")}</span>`).join("")}
          </div>
          ${b.total ? `<span class="wp-total">${b.total}</span>` : ""}
        </div>`).join("")}</div>`;
    }
    function load(i) {
      pi = i; si = 0;
      const pr = p.problems[i];
      stage.innerHTML = `<div class="wp-text">📝 ${rich(pr.text)}</div>${drawBars(pr)}<div class="wp-steps"></div>`;
      out.innerHTML = "";
      nextBtn.disabled = false;
    }
    function next() {
      const pr = p.problems[pi];
      if (si >= pr.steps.length) return;
      stage.querySelector(".wp-steps").append(h("div", { class: "wp-step", html: `<span class="oo-n">${si + 1}</span> ${rich(pr.steps[si])}` }));
      si++;
      if (si >= pr.steps.length) {
        out.innerHTML = `✅ <b>Javob:</b> ${rich(pr.answer)}`;
        nextBtn.disabled = true;
      }
    }
    const nextBtn = button("Keyingi qadam →", next);
    controls.append(buttons(p.problems.map((_, i) => `${i + 1}-masala`), load), nextBtn);
    load(0);
  };
})();
