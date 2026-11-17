/* TARIX: zamonaviy usullardagi interaktiv vositalar.
   timeline — voqealarni xronologik tartibga qo'yish (vaqt chizig'i)
   geo      — tarixiy xarita: shaharlar, yo'llar, yurishlar (karvon animatsiyasi, "shaharni top" o'yini)
   source   — tarixiy manba tahlili (Kim? Qachon? Nima uchun? Ishonchlimi?)
   whoami   — "Men kimman?" — tarixiy shaxsni ishoralar bo'yicha topish
   debate   — munozara: fikr bildirish, dalillar, FDMX usuli
   interview— tarixiy shaxs bilan "suhbat" (rol o'yini)
   dig      — arxeologik qazish: qatlamlar va topilmalar
   yearcalc — asr va yil hisoblagich (mil. av. / milodiy) */
(() => {
  "use strict";
  const { h, s, buttons, button, frame, W } = window.AK;
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const roman = (n) => { const R = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let o = ""; for (const [v, l] of R) while (n >= v) { o += l; n -= v; } return o; };
  const yfmt = (y) => (y < 0 ? `mil. av. ${Math.ceil(-y)}-y.` : `${Math.floor(y)}-y.`);
  const century = (y) => (y < 0 ? `mil. av. ${roman(Math.ceil(-y / 100))} asr` : `${roman(Math.ceil(y / 100))} asr`);
  window.TARIX = { yfmt, century, roman };

  // ===================================================================
  // 1. Vaqt chizig'i: voqealarni tartib bilan bosing
  // ===================================================================
  W.timeline = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⏳ Vaqt chizig‘i — voqealarni eng qadimgisidan boshlab bosing");
    const ev = p.events.map(([y, t, d, disp]) => ({ y, t, d, disp: disp || yfmt(y) }));
    const sorted = ev.slice().sort((a, b) => a.y - b.y);
    const y0 = sorted[0].y, y1 = sorted[sorted.length - 1].y, span = Math.max(1, y1 - y0);
    const line = h("div", { class: "tx-line" }), cards = h("div", { class: "tx-cards" });
    stage.append(line, cards);
    let next = 0, miss = 0;
    function placeDot(e, k) {
      const pct = 4 + ((e.y - y0) / span) * 92;
      const d = h("button", { type: "button", class: "tx-dot " + (k % 2 ? "dn" : "up"), style: `left:${pct}%` }, h("i"), h("b", {}, e.disp), h("span", {}, e.t));
      d.onclick = () => { line.querySelectorAll(".on").forEach((x) => x.classList.remove("on")); d.classList.add("on"); out.innerHTML = `<b>${esc(e.disp)} — ${esc(e.t)}</b>${e.d ? "<br>" + e.d : ""}`; };
      line.append(d);
    }
    function reset() {
      next = 0; miss = 0; line.innerHTML = ""; cards.innerHTML = "";
      shuffle(ev).forEach((e) => {
        const c = h("button", { type: "button", class: "tx-card" }, e.t);
        c.onclick = () => {
          if (c.disabled) return;
          if (e === sorted[next] || e.y === sorted[next].y) {
            const k = sorted.indexOf(e) >= 0 ? next : next; c.disabled = true; c.classList.add("ok"); placeDot(e, k); next++;
            out.innerHTML = `✅ <b>${esc(e.disp)}</b> — ${esc(e.t)}${e.d ? "<br><small>" + e.d + "</small>" : ""}`;
            if (next === sorted.length) out.innerHTML = `🏁 Barcha voqealar joyida! Xatolar: <b>${miss}</b>. ${miss === 0 ? "🌟 Ajoyib — haqiqiy tarixchi!" : "Nuqtalarni bosib, har bir voqeani qayta ko‘ring."}`;
          } else { miss++; c.classList.remove("bad"); void c.offsetWidth; c.classList.add("bad"); out.innerHTML = `❌ Bu voqea hali emas. <b>Undan oldin</b> bo‘lgan voqea bor — o‘ylab ko‘ring.`; }
        };
        cards.append(c);
      });
      out.innerHTML = "Kartalarni <b>eng qadimgisidan</b> boshlab bosing — ular vaqt chizig‘iga joylashadi.";
    }
    controls.append(button("↺ Qaytadan", reset), button("👁 Javobni ko‘rsatish", () => { line.innerHTML = ""; sorted.forEach(placeDot); cards.querySelectorAll(".tx-card").forEach((c) => { c.disabled = true; c.classList.add("ok"); }); next = sorted.length; out.innerHTML = "Nuqtalarni bosib, har bir voqea haqida o‘qing."; }));
    reset();
  };

  // ===================================================================
  // 2. Tarixiy xarita
  // ===================================================================
  const BASE = {
    caspian: [[47, 44.8], [49, 46.6], [51.5, 47], [53.2, 46.8], [53, 45.3], [51.3, 44.5], [50.3, 44.6], [51.3, 43.2], [52.7, 42], [52.9, 41], [53.8, 40.6], [53, 39.4], [53.9, 37.8], [53.9, 37], [51, 36.7], [49, 37.6], [48.9, 38.5], [49.4, 40.2], [50.4, 40.3], [49, 41.2], [48, 42.5], [47.4, 43], [47.6, 44]],
    aral: [[58.3, 46.6], [59.5, 46.5], [61, 46.2], [61.6, 45.5], [61.3, 44.4], [60.4, 43.6], [59.6, 43.6], [58.7, 44], [58.2, 44.9]],
    black: [[28, 41.2], [28.5, 43.5], [30.5, 46.2], [33, 45.9], [35.5, 45.1], [37.5, 44.6], [39.7, 43.5], [41.6, 41.6], [40, 41], [37, 41.1], [34, 42], [31.2, 41.1]],
    gulf: [[48, 30], [50.3, 29.2], [51.5, 27.8], [54.5, 26.5], [56.4, 26.8], [56.3, 25.6], [54, 24.2], [52, 24], [51.5, 25.5], [50.8, 25.6], [50, 26.6], [48.4, 28.4]],
    red: [[32.5, 29.9], [34.6, 28], [36.5, 25.5], [39, 21.5], [42.5, 14.5], [43.4, 12.7], [42.3, 13.2], [39.5, 15.8], [37.2, 19.5], [35.5, 23.8], [33.6, 27.3]],
  };
  const RIVERS = {
    amu: [[73, 37.1], [70, 37.4], [67.3, 37.2], [65.2, 37.8], [63.6, 39.1], [62, 40.3], [60.6, 41.5], [59.6, 42.5], [59.5, 43.6]],
    sir: [[72.5, 40.9], [71.7, 41], [70.6, 40.6], [69.6, 40.3], [68.8, 40.9], [68, 41.3], [68.3, 43.3], [65.5, 44.8], [61.6, 46.2]],
    zar: [[68.5, 39.4], [67.6, 39.5], [66.95, 39.7], [65.4, 40.1], [64.4, 39.8], [63.5, 39.5]],
    nil: [[32.9, 23.9], [32.6, 25.7], [31.2, 27.2], [31.25, 30.05], [31, 31.3]],
    tigr: [[42, 37.3], [43.1, 36.3], [44.4, 33.3], [46, 31.9], [47.8, 30.6], [48.4, 29.9]],
    efr: [[38.4, 37.4], [40.2, 35.5], [43, 34], [44.4, 32.5], [46, 31.3], [47.8, 30.6]],
    ind: [[75.5, 34.5], [73.2, 33.6], [72, 31], [70.3, 28.5], [68.6, 25.5], [67.5, 24.2]],
    gang: [[79, 30.1], [80.3, 26.5], [83, 25.3], [86.5, 25.3], [88.5, 23.5], [90.5, 22.5]],
    xuan: [[96.5, 35.5], [103.8, 36], [106.5, 39.3], [111, 40.5], [111.5, 37], [110.4, 34.6], [113.6, 34.8], [117, 36.6], [118.9, 37.7]],
  };
  const RNAME = { amu: "Amudaryo", sir: "Sirdaryo", zar: "Zarafshon", nil: "Nil", tigr: "Dajla", efr: "Frot", ind: "Hind", gang: "Gang", xuan: "Xuanxe" };
  window.TARIX.PLACES = {
    "Samarqand": [66.96, 39.65], "Buxoro": [64.42, 39.77], "Xiva": [60.36, 41.38], "Urganch": [59.15, 42.33], "Toshkent": [69.24, 41.31], "Termiz": [67.28, 37.22],
    "Qarshi": [65.79, 38.86], "Shahrisabz": [66.83, 39.06], "Farg‘ona": [71.78, 40.38], "Andijon": [72.34, 40.78], "Qo‘qon": [70.94, 40.53], "Namangan": [71.67, 41.0],
    "Xo‘jand": [69.63, 40.28], "Marv": [61.83, 37.66], "Nishopur": [58.8, 36.2], "Hirot": [62.2, 34.35], "Balx": [66.9, 36.76], "Kobul": [69.17, 34.53], "O‘tror": [68.3, 42.85],
    "Taroz": [71.4, 42.9], "Koshg‘ar": [75.99, 39.47], "Nukus": [59.6, 42.46], "Panjikent": [67.6, 39.49], "Axsikent": [71.4, 40.9], "G‘azna": [68.42, 33.55], "Bag‘dod": [44.4, 33.3],
    "Isfahon": [51.67, 32.65], "Damashq": [36.3, 33.5], "Konstantinopol": [28.98, 41.0], "Chang‘an (Sian)": [108.9, 34.3], "Dunxuan": [94.7, 40.1], "Qoraqurum": [102.8, 47.2],
    "Dehli": [77.2, 28.6], "Rim": [12.5, 41.9], "Afina": [23.7, 37.98], "Iskandariya": [29.9, 31.2], "Bobil": [44.42, 32.54], "Memfis": [31.25, 29.85], "Ur": [46.1, 30.96],
    "Makka": [39.83, 21.42], "Madina": [39.61, 24.47], "Tabriz": [46.3, 38.08], "Saroy": [47.4, 46.6], "Ko‘hna Urganch": [59.15, 42.33], "Afrosiyob": [66.99, 39.67],
    "Toprog‘qal’a": [60.88, 41.93], "Tuproqqal’a": [60.88, 41.93], "Ayritom": [67.43, 37.25], "Varaxsha": [64.16, 39.97], "Ko‘hitang (Teshiktosh)": [66.8, 38.3], "Sarazm": [67.45, 39.5],
    "Sopollitepa": [67.05, 37.6], "Jarqo‘ton": [67.3, 37.6], "Mohenjo-Daro": [68.14, 27.33], "Harappa": [72.87, 30.63], "Anyang": [114.35, 36.1], "Pekin": [116.4, 39.9], "Persepol": [52.89, 29.93],
    "Suza": [48.25, 32.19], "Ninevia": [43.15, 36.36], "Quddus": [35.23, 31.78], "Antioxiya": [36.16, 36.2], "Kesh": [66.83, 39.06], "Choch": [69.24, 41.31], "Usrushona": [68.8, 39.9],
    "Sig‘noq": [66.5, 44.0], "Yassi (Turkiston)": [68.25, 43.3], "Sayram": [69.75, 42.3], "Ming‘tepa (Andijon)": [72.5, 40.8], "Kat": [61.1, 41.6], "Xazorasp": [61.07, 41.32], "Istanbul": [28.98, 41.0],
    "Moskva": [37.62, 55.75], "Suyob": [75.2, 42.8], "Kuchuktepa": [67.4, 37.55], "Hindiston (Agra)": [78.0, 27.18], "Agra": [78.0, 27.18], "Kalkutta": [88.36, 22.57], "Bombey": [72.88, 19.08], "Tokio": [139.7, 35.7], "Seul": [126.98, 37.57], "Vashington": [-77.04, 38.9], "Nyu-York": [-74.0, 40.7], "Berlin": [13.4, 52.52], "Vena": [16.37, 48.2], "Rio-de-Janeyro": [-43.2, -22.9], "Mexiko": [-99.13, 19.43], "Keyptaun": [18.42, -33.92], "Lissabon": [-9.14, 38.72], "Amsterdam": [4.9, 52.37], "Kobul (Afg‘.)": [69.17, 34.53], "Mashhad": [59.6, 36.3], "Qo‘qon xonligi": [70.94, 40.53], "Turkiston": [68.25, 43.3], "Chimkent": [69.6, 42.3], "Ashtarxon": [48.03, 46.35], "Qozon": [49.1, 55.8], "Tobolsk": [68.25, 58.2], "Oqmasjid": [65.5, 44.85], "Avliyoota": [71.4, 42.9], "Jizzax": [67.84, 40.12], "Kattaqo‘rg‘on": [66.26, 39.9], "Krasnovodsk": [52.97, 40.02], "Ko‘kteppa (Geoktepe)": [57.96, 38.16], "Marg‘ilon": [71.72, 40.47], "O‘sh": [72.8, 40.53], "Mo‘ynoq": [59.0, 43.77], "Chorjo‘y": [63.58, 39.08], "Karmana": [65.36, 40.14], "Kosonsoy": [71.55, 41.25], "Yangikent": [62.0, 45.5], "Gurganj": [59.15, 42.33], "Poykand": [63.85, 39.75], "Kiyev": [30.52, 50.45], "Novgorod": [31.27, 58.52], "Axen": [6.08, 50.78], "Parij": [2.35, 48.86], "London": [-0.13, 51.5], "Madrid": [-3.7, 40.42], "Venetsiya": [12.33, 45.44], "Qohira": [31.24, 30.04], "Tehron": [51.39, 35.69], "Orenburg": [55.1, 51.77], "Peterburg": [30.3, 59.94], "Ashxobod": [58.38, 37.95], "Dushanbe": [68.78, 38.56], "Bishkek": [74.6, 42.87], "Olmaota": [76.9, 43.24], "Astana": [71.45, 51.17],
  };
  W.geo = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🗺 Tarixiy xarita — shaharni bosing");
    const P = window.TARIX.PLACES;
    const places = (p.places || []).map((x) => (typeof x === "string" ? [x, ...(P[x] || []), ""] : x[1] == null || typeof x[1] === "string" ? [x[0], ...(P[x[0]] || []), x[1] || "", x[2]] : x))
      .filter((x) => { if (typeof x[1] !== "number") { console.warn("Xaritada joy topilmadi:", x[0]); return false; } return true; })
      .map((x) => (typeof x[3] === "number" ? x : x));
    const pts = places.map((x) => [x[1], x[2]]).concat(...(p.routes || []).map((r) => r.path.map((q) => (typeof q === "string" ? P[q] : q)).filter(Boolean)));
    let [lo0, la0, lo1, la1] = p.bbox || [Math.min(...pts.map((q) => q[0])) - 3, Math.min(...pts.map((q) => q[1])) - 2.5, Math.max(...pts.map((q) => q[0])) + 3, Math.max(...pts.map((q) => q[1])) + 2.5];
    const k = Math.cos(((la0 + la1) / 2) * Math.PI / 180), Wd = 440;
    const Ht = Math.max(200, Math.min(420, (Wd * (la1 - la0)) / ((lo1 - lo0) * k)));
    const X = (lo) => ((lo - lo0) / (lo1 - lo0)) * Wd, Y = (la) => Ht - ((la - la0) / (la1 - la0)) * Ht;
    const g = s("svg", { viewBox: `0 0 ${Wd} ${Ht}`, class: "tx-map" });
    s("rect", { x: 0, y: 0, width: Wd, height: Ht, rx: 14, class: "tx-land" }, g);
    const step = lo1 - lo0 > 40 ? 10 : 5;
    for (let lo = Math.ceil(lo0 / step) * step; lo < lo1; lo += step) s("line", { x1: X(lo), x2: X(lo), y1: 0, y2: Ht, class: "tx-grid" }, g);
    for (let la = Math.ceil(la0 / step) * step; la < la1; la += step) s("line", { y1: Y(la), y2: Y(la), x1: 0, x2: Wd, class: "tx-grid" }, g);
    const poly = (arr) => arr.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(" ");
    Object.values(BASE).forEach((pp) => s("polygon", { points: poly(pp), class: "tx-sea" }, g));
    Object.entries(RIVERS).forEach(([key, pp]) => {
      const inBox = pp.some(([a, b]) => a > lo0 && a < lo1 && b > la0 && b < la1); if (!inBox) return;
      s("polyline", { points: poly(pp), class: "tx-river" }, g);
      const m = pp[Math.floor(pp.length / 2)]; if (lo1 - lo0 < 60) s("text", { x: X(m[0]) + 3, y: Y(m[1]) - 3, class: "tx-rlab", text: RNAME[key] }, g);
    });
    (p.regions || []).forEach(([name, lo, la, col]) => s("text", { x: X(lo), y: Y(la), class: "tx-reg", fill: col || "currentColor", text: name }, g));
    const routeEls = (p.routes || []).map((r, i) => {
      const path = r.path.map((q) => (typeof q === "string" ? P[q] : q)).filter(Boolean);
      const d = "M" + path.map(([a, b]) => `${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join(" L");
      const el = s("path", { d, class: "tx-route", stroke: r.color || ["#f59e0b", "#ef4444", "#38bdf8", "#a78bfa"][i % 4] }, g);
      return { el, r };
    });
    const dots = places.map(([name, lo, la, info, em], i) => {
      const gg = s("g", { class: "tx-pin", transform: `translate(${X(lo).toFixed(1)},${Y(la).toFixed(1)})`, tabindex: 0 }, g);
      s("circle", { r: 9, class: "tx-hit" }, gg); s("circle", { r: 4.5, class: "tx-c" }, gg);
      const t = s("text", { x: 7, y: -6, class: "tx-lab", text: (em ? em + " " : "") + name }, gg);
      if (X(lo) > Wd - 70) { t.setAttribute("x", -7); t.setAttribute("text-anchor", "end"); }
      gg.addEventListener("click", () => pick(i)); gg.addEventListener("keydown", (e) => e.key === "Enter" && pick(i));
      return gg;
    });
    const car = s("text", { class: "tx-car", text: p.mover || "🐫", "text-anchor": "middle", "dominant-baseline": "middle", opacity: 0 }, g);
    stage.append(g);
    let quiz = null, score = 0, asked = 0;
    function pick(i) {
      const [name, , , info] = places[i];
      dots.forEach((d) => d.classList.remove("on")); dots[i].classList.add("on");
      if (quiz) {
        asked++; const right = quiz === name; if (right) score++;
        out.innerHTML = (right ? `✅ To‘g‘ri — <b>${esc(name)}</b>!` : `❌ Bu — <b>${esc(name)}</b>. <b>${esc(quiz)}</b> boshqa joyda.`) + ` Hisob: <b>${score}/${asked}</b>`;
        if (!right) { const j = places.findIndex((x) => x[0] === quiz); dots[j].classList.add("hint"); setTimeout(() => dots[j].classList.remove("hint"), 1500); }
        setTimeout(ask, 1300); return;
      }
      out.innerHTML = `<b>📍 ${esc(name)}</b>${info ? " — " + info : ""}`;
    }
    function ask() {
      if (!quiz) return;
      const pool = places.filter((x) => x[0] !== quiz); quiz = (pool[Math.floor(Math.random() * pool.length)] || places[0])[0];
      dots.forEach((d) => d.classList.add("quiz"));
      out.innerHTML = `🎯 Xaritadan toping: <b>${esc(quiz)}</b>` + (asked ? ` · Hisob: <b>${score}/${asked}</b>` : "");
    }
    let anim = 0;
    function play(ri) {
      cancelAnimationFrame(anim);
      const { el, r } = routeEls[ri]; const L = el.getTotalLength(); const T = Math.max(3000, L * 18); let t0 = 0;
      routeEls.forEach((x) => x.el.classList.toggle("on", x === routeEls[ri]));
      out.innerHTML = `<b>${esc(r.name || "Yo‘l")}</b>${r.info ? " — " + r.info : ""}`;
      car.setAttribute("opacity", 1); car.textContent = r.mover || p.mover || "🐫";
      const step2 = (ts) => { if (!t0) t0 = ts; const u = Math.min(1, (ts - t0) / T); const q = el.getPointAtLength(u * L); car.setAttribute("x", q.x); car.setAttribute("y", q.y); if (u < 1 && g.isConnected) anim = requestAnimationFrame(step2); };
      anim = requestAnimationFrame(step2);
    }
    if (routeEls.length) controls.append(buttons(routeEls.map(({ r }) => "▶ " + (r.name || "Yo‘l")), play, -1));
    if (places.length > 3) controls.append(button("🎯 Shaharni top o‘yini", (e) => {
      if (quiz) { quiz = null; dots.forEach((d) => d.classList.remove("quiz")); e.target.innerHTML = "🎯 Shaharni top o‘yini"; out.innerHTML = `O‘yin tugadi. Natija: <b>${score}/${asked}</b>`; return; }
      score = 0; asked = 0; quiz = "_"; e.target.innerHTML = "⏹ O‘yinni tugatish"; ask();
    }));
    out.innerHTML = p.hint || "Shahar nuqtasini bosing — u haqida ma’lumot chiqadi." + (routeEls.length ? " ▶ tugmasi — yo‘l bo‘ylab harakat." : "");
  };

  // ===================================================================
  // 3. Tarixiy manba tahlili
  // ===================================================================
  W.source = (root, p) => {
    const { stage, out } = frame(root, p.title || "📜 Tarixiy manba bilan ishlash");
    stage.append(h("blockquote", { class: "tx-src" }, h("p", { html: p.text }), h("cite", {}, "— " + p.author + (p.when ? ", " + p.when : ""))));
    const qs = p.qs || [];
    const list = h("div", { class: "tx-qs" });
    qs.forEach(([q, a], i) => {
      const b = h("button", { type: "button", class: "tx-q" }, h("b", {}, ["🧑‍🎓", "🕰", "🎯", "⚖️", "💡"][i % 5] + " " + q), h("span", { class: "tx-a", html: a }));
      b.onclick = () => b.classList.toggle("open");
      list.append(b);
    });
    stage.append(list);
    out.innerHTML = "<b>Manba tahlili usuli:</b> avval o‘zingiz javob o‘ylang, keyin savolni bosib tekshiring. Tarixchi doim so‘raydi: <i>kim yozgan? qachon? nima maqsadda? ishonsa bo‘ladimi?</i>";
  };

  // ===================================================================
  // 4. "Men kimman?" — ishoralar bo'yicha topish
  // ===================================================================
  W.whoami = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🕵️ Men kimman? — kamroq ishora bilan toping");
    const all = p.who; let order = shuffle(all.map((_, i) => i)), qi = 0, shown = 1, pts = 0, done = false;
    const box = h("div", { class: "tx-who" }), opts = h("div", { class: "tx-opts" });
    stage.append(box, opts);
    function clues() {
      const [, cl] = all[order[qi]];
      box.innerHTML = `<small>${qi + 1} / ${all.length} · ochko: ${pts}</small>` + cl.slice(0, shown).map((c, i) => `<p class="tx-clue" style="--d:${i * 60}ms">🔎 ${c}</p>`).join("");
      controls.innerHTML = "";
      if (!done && shown < cl.length) controls.append(button("➕ Yana ishora", () => { shown++; clues(); }));
    }
    function draw() {
      const [name, , extra] = all[order[qi]];
      let names = shuffle(all.filter((x) => x[0] !== name).map((x) => x[0])).concat(extra || []);
      names = shuffle([name, ...names.filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)]);
      opts.innerHTML = "";
      names.forEach((n) => opts.append(h("button", { type: "button", class: "ks-bin", onclick: (e) => guess(n, e.currentTarget) }, n)));
      clues();
      out.innerHTML = `Javob bersangiz: 1-ishorada — <b>3</b> ochko, 2-da — <b>2</b>, keyin — <b>1</b>.`;
    }
    function guess(n, el) {
      if (done) return; const [name, cl] = all[order[qi]];
      if (n !== name) { el.classList.add("no"); el.disabled = true; if (shown < cl.length) shown++; clues(); out.innerHTML = "❌ Yo‘q. Yangi ishora ochildi — yana o‘ylang."; return; }
      const g = shown === 1 ? 3 : shown === 2 ? 2 : 1; pts += g; done = true; el.classList.add("ok"); clues();
      out.innerHTML = `✅ Topdingiz: <b>${esc(name)}</b> (+${g})`;
      controls.append(button(qi + 1 < all.length ? "➡ Keyingisi" : "🏁 Natija", () => {
        done = false;
        if (qi + 1 < all.length) { qi++; shown = 1; draw(); return; }
        box.innerHTML = `<p class="tx-clue">🏆 Jami ochko: <b>${pts}</b> / ${all.length * 3}</p>`; opts.innerHTML = ""; controls.innerHTML = "";
        controls.append(button("↺ Qaytadan", () => { order = shuffle(order); qi = 0; shown = 1; pts = 0; draw(); }));
        out.innerHTML = pts >= all.length * 2 ? "🌟 Zo‘r! Tarixiy shaxslarni yaxshi bilasiz." : "Mavzuni yana bir ko‘zdan kechiring va qayta urinib ko‘ring.";
      }));
    }
    draw();
  };

  // ===================================================================
  // 5. Munozara
  // ===================================================================
  W.debate = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🗣 Munozara — o‘z fikringizni dalillang");
    const key = "tx-vote-" + p.q.slice(0, 40);
    stage.append(h("div", { class: "tx-deb-q" }, "❓ " + p.q));
    const col = (t, arr, cls) => h("div", { class: "tx-deb " + cls }, h("b", {}, t), ...arr.map((a) => h("p", {}, a)));
    const res = h("div", { class: "tx-deb-res", hidden: true }, col("👍 Tarafdorlar dalillari", p.pro, "pro"), col("👎 Qarshi dalillar", p.con, "con"));
    stage.append(res);
    const show = (v) => {
      res.hidden = false;
      out.innerHTML = `Siz: <b>${v}</b>. Endi <b>FDMX</b> usulida 4 gap yozing (daftarga yoki og‘zaki):<br><b>F</b>ikr — “Men … deb hisoblayman”, <b>D</b>alil — “Chunki …”, <b>M</b>isol — “Masalan, …”, <b>X</b>ulosa — “Shunday qilib, …”.` + (p.note ? `<br><small>💡 ${p.note}</small>` : "");
      try { localStorage.setItem(key, v); } catch (e) { /* bo'sh */ }
    };
    controls.append(buttons(["👍 Qo‘shilaman", "🤔 Qisman", "👎 Qo‘shilmayman"], (i) => show(["Qo‘shilaman", "Qisman qo‘shilaman", "Qo‘shilmayman"][i]), -1));
    let prev = null; try { prev = localStorage.getItem(key); } catch (e) { /* bo'sh */ }
    out.innerHTML = prev ? `Avvalgi fikringiz: <b>${prev}</b>. Yana tanlang.` : "Avval o‘z pozitsiyangizni tanlang — keyin ikki tomon dalillari ochiladi.";
  };

  // ===================================================================
  // 6. Tarixiy shaxs bilan suhbat
  // ===================================================================
  W.interview = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || `🎙 Suhbat: ${p.who}`);
    const chat = h("div", { class: "tx-chat" });
    stage.append(chat);
    const say = (who, t, me) => { chat.append(h("div", { class: "tx-msg " + (me ? "me" : "he") }, h("small", {}, who), h("p", { html: t }))); chat.scrollTop = chat.scrollHeight; };
    say((p.emoji || "👤") + " " + p.who, p.intro);
    const left = p.qa.slice();
    const draw = () => {
      controls.innerHTML = "";
      left.forEach((qa, i) => controls.append(button("💬 " + qa[0], () => { left.splice(i, 1); say("🧑‍🎓 Siz", esc(qa[0]), true); setTimeout(() => { say((p.emoji || "👤") + " " + p.who, qa[1]); draw(); }, 350); })));
      if (!left.length) out.innerHTML = "✍️ <b>Topshiriq:</b> o‘zingiz yana bitta savol o‘ylang va javobini darslikdan toping. <small>(Suhbat — o‘quv maqsadida tuzilgan rol o‘yini; javoblar tarixiy faktlarga asoslangan.)</small>";
    };
    draw();
    out.innerHTML = "Savolni tanlang — tarixiy shaxs “javob beradi”. <small>(O‘quv rol o‘yini)</small>";
  };

  // ===================================================================
  // 7. Arxeologik qazish
  // ===================================================================
  W.dig = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⛏ Arxeologik qazish — qatlamni bosib, chuqurroq qazing");
    const L = p.layers; let d = 0;
    const pit = h("div", { class: "tx-pit" }); stage.append(pit);
    const cols = ["#a16207", "#92400e", "#78350f", "#713f12", "#57534e", "#44403c", "#292524"];
    function draw() {
      pit.innerHTML = "";
      L.forEach(([name, age, find, em], i) => {
        const open = i < d;
        const el = h("button", { type: "button", class: "tx-layer" + (open ? " open" : "") + (i === d ? " next" : ""), style: `background:${cols[i % cols.length]}` }, h("span", { html: open ? `${em || "🏺"} <b>${name}</b> <small>${age}</small>` : i === d ? "⛏ Qazish uchun bosing" : "" }));
        el.onclick = () => { if (i === d) { d++; draw(); out.innerHTML = `${em || "🏺"} <b>${name}</b> (${age}) — topildi: ${find}`; } else if (open) out.innerHTML = `${em || "🏺"} <b>${name}</b> (${age}) — ${find}`; };
        pit.append(el);
      });
    }
    controls.append(button("↺ Qayta ko‘mish", () => { d = 0; draw(); out.innerHTML = "Yer yuzasidan boshlang."; }));
    draw();
    out.innerHTML = "<b>Qoida:</b> chuqurroq qatlam — qadimgiroq (stratigrafiya). Yuqoridan pastga qazing.";
  };

  // ===================================================================
  // 8. Asr va yil hisoblagich
  // ===================================================================
  W.yearcalc = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧮 Yil hisoblagich: asr, mil. av., necha yil oldin?");
    const NOW = new Date().getFullYear();
    let era = 1, yv = p.year || 1336;
    const inp = h("input", { type: "number", min: 1, max: 9999, value: yv, class: "tx-inp", "aria-label": "Yil" });
    stage.append(h("div", { class: "tx-yc" }, inp));
    const bar = h("div", { class: "tx-ybar" }); stage.append(bar);
    function calc() {
      yv = Math.max(1, Math.min(9999, Math.round(+inp.value || 1)));
      const y = era * yv, ago = y < 0 ? NOW + yv - 1 : NOW - y;
      const mill = y < 0 ? `mil. av. ${roman(Math.ceil(yv / 1000))} ming yillik` : `${roman(Math.ceil(yv / 1000))} ming yillik`;
      out.innerHTML = `📅 <b>${yfmt(y)}</b> → <b>${century(y)}</b> (${mill})<br>⏳ Bundan <b>${ago.toLocaleString("uz")}</b> yil oldin${y < 0 ? " <small>(0-yil bo‘lmagani uchun 1 yil ayiramiz)</small>" : ""}<br><small>Qoida: asr = yilni 100 ga bo‘lib, yuqoriga yaxlitlash. ${yv} : 100 → ${Math.ceil(yv / 100)}-asr.</small>`;
      const pct = Math.max(0, Math.min(100, ((y + 3000) / (NOW + 3000)) * 100));
      bar.innerHTML = `<span style="left:0">mil. av. 3000</span><span style="left:${(3000 / (NOW + 3000)) * 100}%">0</span><span style="right:0">${NOW}</span><i style="left:${pct}%"></i>`;
    }
    controls.append(buttons(["Milodiy", "Miloddan avvalgi"], (i) => { era = i ? -1 : 1; calc(); }, 0));
    inp.addEventListener("input", calc);
    calc();
  };
})();
