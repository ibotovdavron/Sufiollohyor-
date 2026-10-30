/* Amaliy darslar: umumiy yordamchi funksiyalar va jonli tajribalar ro'yxati. */
(() => {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";

  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null) el.append(kid.nodeType ? kid : document.createTextNode(kid));
    return el;
  }

  function s(tag, attrs = {}, parent) {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "text") el.textContent = v;
      else el.setAttribute(k, v);
    }
    if (parent) parent.appendChild(el);
    return el;
  }

  function svg(w, hgt, cls = "") {
    return s("svg", { viewBox: `0 0 ${w} ${hgt}`, class: "demo-svg " + cls, role: "img" });
  }

  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  /** 1234567 → "1 234 567" */
  function num(n, digits = 2) {
    if (!isFinite(n)) return "—";
    const neg = n < 0;
    let v = Math.abs(n);
    let str = Number.isInteger(v) ? String(v) : v.toFixed(digits).replace(/\.?0+$/, "");
    let [i, f] = str.split(".");
    i = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + i + (f ? "," + f : "");
  }

  /** Kasrni HTML ko'rinishda: surat ustida, maxraj pastda */
  function fr(n, d) {
    if (d === 1) return `<span class="num">${n}</span>`;
    return `<span class="fr"><i>${n}</i><i>${d}</i></span>`;
  }
  /** Soddalashtirilgan kasr va kerak bo'lsa aralash son */
  function frSimple(n, d, mixed = true) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    n /= g; d /= g;
    if (d === 1) return `<span class="num">${n < 0 ? "−" + -n : n}</span>`;
    if (mixed && Math.abs(n) > d) {
      const w = Math.trunc(n / d), r = Math.abs(n % d);
      return `<span class="num">${w}</span>${fr(r, d)}`;
    }
    return (n < 0 ? "−" : "") + fr(Math.abs(n), d);
  }

  /** Matndagi [[a/b]] belgilarini kasr ko'rinishiga aylantiradi */
  function rich(text) {
    return String(text).replace(/\[\[([^\]/]+)\/([^\]]+)\]\]/g, (_, a, b) => fr(a.trim(), b.trim()));
  }

  // ---------- O'zbekcha son nomlari ----------
  const ONES = ["", "bir", "ikki", "uch", "to‘rt", "besh", "olti", "yetti", "sakkiz", "to‘qqiz"];
  const TENS = ["", "o‘n", "yigirma", "o‘ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to‘qson"];
  function words3(n) {
    const out = [];
    const hh = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
    if (hh) out.push(ONES[hh], "yuz");
    if (t) out.push(TENS[t]);
    if (o) out.push(ONES[o]);
    return out.join(" ");
  }
  function words(n) {
    if (n === 0) return "nol";
    const parts = [];
    const bil = Math.floor(n / 1e9), mln = Math.floor((n % 1e9) / 1e6), th = Math.floor((n % 1e6) / 1e3), r = n % 1e3;
    if (bil) parts.push(words3(bil) + " milliard");
    if (mln) parts.push(words3(mln) + " million");
    if (th) parts.push(words3(th) + " ming");
    if (r) parts.push(words3(r));
    return parts.join(" ");
  }

  // ---------- Boshqaruv elementlari ----------
  function slider({ label, min, max, step = 1, value, fmt = (v) => v, onInput }) {
    const out = h("b", {}, fmt(value));
    const input = h("input", { type: "range", min, max, step, value, "aria-label": label });
    input.addEventListener("input", () => { out.innerHTML = fmt(Number(input.value)); onInput(Number(input.value)); });
    const wrap = h("label", { class: "ctl" }, h("span", {}, label, " ", out), input);
    wrap.set = (v) => { input.value = v; out.innerHTML = fmt(Number(v)); };
    wrap.setRange = (mn, mx) => { input.min = mn; input.max = mx; };
    wrap.input = input;
    return wrap;
  }

  function buttons(list, onPick, active = 0) {
    const wrap = h("div", { class: "seg" });
    list.forEach((label, i) => {
      const b = h("button", { type: "button", class: i === active ? "on" : "" }, label);
      b.innerHTML = label;
      b.onclick = () => {
        wrap.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        onPick(i);
      };
      wrap.append(b);
    });
    return wrap;
  }

  function button(label, onClick, cls = "") {
    const b = h("button", { type: "button", class: "dbtn " + cls }, "");
    b.innerHTML = label;
    b.onclick = onClick;
    return b;
  }

  /** Tajriba qolipi: sahna, boshqaruv va natija qismlari */
  function frame(root, title) {
    const stage = h("div", { class: "demo-stage" });
    const controls = h("div", { class: "demo-controls" });
    const out = h("div", { class: "demo-out", "aria-live": "polite" });
    root.append(...(title ? [h("div", { class: "demo-title", html: title })] : []), stage, controls, out);
    return { stage, controls, out };
  }

  /** SVG ichida nuqtani sudrab yurish */
  function draggable(svgEl, handle, onMove) {
    handle.style.cursor = "grab";
    handle.style.touchAction = "none";
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const pt = svgEl.createSVGPoint();
        pt.x = ev.clientX; pt.y = ev.clientY;
        const p = pt.matrixTransform(svgEl.getScreenCTM().inverse());
        onMove(p.x, p.y);
      };
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
  }

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7", "#14b8a6", "#ef4444", "#84cc16", "#06b6d4", "#f97316"];

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

  window.AK = {
    h, s, svg, gcd, lcm, num, fr, frSimple, rich, words,
    slider, buttons, button, frame, draggable, COLORS, wait, reduced,
    W: {} // jonli tajribalar shu yerga ro'yxatdan o'tadi
  };
})();
