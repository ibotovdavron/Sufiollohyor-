/* Geografiya bo'yicha jonli tajribalar. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, COLORS, W } = window.AK;

  // ---------- Davlatlar ma'lumotlari (taxminiy, 2024) ----------
  // [nom, bayroq, poytaxt, materik, maydon (ming km²), aholi (mln)]
  const COUNTRIES = [
    ["Rossiya", "🇷🇺", "Moskva", "Yevrosiyo", 17098, 144],
    ["Kanada", "🇨🇦", "Ottava", "Shimoliy Amerika", 9985, 40],
    ["AQSH", "🇺🇸", "Vashington", "Shimoliy Amerika", 9834, 340],
    ["Xitoy", "🇨🇳", "Pekin", "Osiyo", 9597, 1410],
    ["Braziliya", "🇧🇷", "Braziliya", "Janubiy Amerika", 8516, 212],
    ["Avstraliya", "🇦🇺", "Kanberra", "Avstraliya va Okeaniya", 7692, 27],
    ["Hindiston", "🇮🇳", "Dehli", "Osiyo", 3287, 1440],
    ["Argentina", "🇦🇷", "Buenos-Ayres", "Janubiy Amerika", 2780, 46],
    ["Qozog‘iston", "🇰🇿", "Astana", "Osiyo", 2725, 20],
    ["Jazoir", "🇩🇿", "Jazoir", "Afrika", 2382, 46],
    ["Saudiya Arabistoni", "🇸🇦", "Ar-Riyod", "Osiyo", 2150, 33],
    ["Indoneziya", "🇮🇩", "Jakarta", "Osiyo", 1905, 280],
    ["Misr", "🇪🇬", "Qohira", "Afrika", 1002, 114],
    ["Nigeriya", "🇳🇬", "Abuja", "Afrika", 924, 229],
    ["Turkiya", "🇹🇷", "Anqara", "Osiyo", 784, 85],
    ["Fransiya", "🇫🇷", "Parij", "Yevropa", 552, 68],
    ["O‘zbekiston", "🇺🇿", "Toshkent", "Osiyo", 449, 37],
    ["Yaponiya", "🇯🇵", "Tokio", "Osiyo", 378, 124],
    ["Germaniya", "🇩🇪", "Berlin", "Yevropa", 357, 84],
    ["Buyuk Britaniya", "🇬🇧", "London", "Yevropa", 244, 68]
  ];
  window.AK.COUNTRIES = COUNTRIES;

  // ---------- Davlatlar ko'rgazmasi ----------
  W.countryExplorer = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let by = p.by === "pop" ? 5 : 4, cont = "Hammasi";
    const conts = ["Hammasi", ...new Set(COUNTRIES.map((c) => c[3]))];
    function render() {
      const list = COUNTRIES.filter((c) => cont === "Hammasi" || c[3] === cont).sort((a, b) => b[by] - a[by]).slice(0, 12);
      const max = Math.max(...list.map((c) => c[by]));
      stage.innerHTML = `<div class="ge-bars">${list.map((c, i) => `
        <button class="ge-bar" data-n="${c[0]}" style="--w:${(c[by] / max) * 100}%;--c:${COLORS[i % 10]};--d:${i * 60}ms">
          <span class="ge-flag">${c[1]}</span><span class="ge-name">${c[0]}</span>
          <span class="ge-track"><i></i></span><b>${by === 4 ? num(c[4]) + " ming km²" : num(c[5]) + " mln"}</b>
        </button>`).join("")}</div>`;
      stage.querySelectorAll(".ge-bar").forEach((b) => (b.onclick = () => info(b.dataset.n)));
      info(list[0][0]);
    }
    function info(name) {
      const c = COUNTRIES.find((x) => x[0] === name);
      const dens = (c[5] * 1e6) / (c[4] * 1e3);
      out.innerHTML = `<div class="ge-info"><span class="ge-bigflag">${c[1]}</span><div>
        <b>${c[0]}</b><small>Poytaxti: <b>${c[2]}</b> · ${c[3]}</small>
        <small>Maydoni ≈ ${num(c[4])} ming km² · Aholisi ≈ ${num(c[5])} mln · Zichlik ≈ ${num(Math.round(dens))} kishi/km²</small></div></div>
        <div class="muted">Ma’lumotlar taxminiy (2024). Ustunni bosib, boshqa davlat haqida biling.</div>`;
    }
    controls.append(
      buttons(["🗺️ Maydon bo‘yicha", "👥 Aholi bo‘yicha"], (i) => { by = i ? 5 : 4; render(); }, by === 5 ? 1 : 0),
      buttons(conts, (i) => { cont = conts[i]; render(); })
    );
    render();
  };

  // ---------- Poytaxt viktorinasi ----------
  W.capitalQuiz = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let score = 0, n = 0, cur;
    function next() {
      cur = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const wrong = COUNTRIES.filter((c) => c !== cur).sort(() => Math.random() - 0.5).slice(0, 3).map((c) => c[2]);
      const opts = [cur[2], ...wrong].sort(() => Math.random() - 0.5);
      stage.innerHTML = `<div class="ge-quiz"><span class="ge-bigflag pop">${cur[1]}</span><b>${cur[0]}</b><small>poytaxti qaysi shahar?</small>
        <div class="ge-opts">${opts.map((o) => `<button>${o}</button>`).join("")}</div></div>`;
      stage.querySelectorAll(".ge-opts button").forEach((b) => (b.onclick = () => {
        stage.querySelectorAll(".ge-opts button").forEach((x) => { x.disabled = true; if (x.textContent === cur[2]) x.classList.add("right"); });
        n++;
        if (b.textContent === cur[2]) { score++; b.classList.add("right"); } else b.classList.add("wrong");
        out.innerHTML = `${b.textContent === cur[2] ? "✅ To‘g‘ri!" : `❌ To‘g‘ri javob: <b>${cur[2]}</b>`} · Natija: <b>${score} / ${n}</b> · ${cur[0]} — ${cur[3]}`;
      }));
    }
    controls.append(button("Keyingi davlat →", next), button("↺ Hisobni tozalash", () => { score = 0; n = 0; out.innerHTML = ""; next(); }, "ghost"));
    next();
  };

  // ---------- Saralash o'yini ----------
  // p.cats: [nom...], p.items: [[nom, togri_toifa, izoh]]
  W.sorter = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let items, placed;
    function load() {
      items = p.items.slice().sort(() => Math.random() - 0.5);
      placed = {};
      render();
      out.innerHTML = `<span class="muted">Belgini bosing, keyin uni to‘g‘ri guruhga joylang.</span>`;
    }
    let pick = null;
    function render() {
      const left = items.filter((it) => placed[it[0]] == null);
      stage.innerHTML = `
        <div class="ge-pool">${left.map((it) => `<button class="ge-chip ${pick === it[0] ? "on" : ""}" data-i="${it[0]}">${it[0]}</button>`).join("") || "<em>Hammasi joylandi! 🎉</em>"}</div>
        <div class="ge-cats" style="--n:${p.cats.length}">${p.cats.map((c, ci) => `
          <div class="ge-cat" data-c="${ci}" style="--c:${COLORS[ci]}"><b>${c}</b>
            ${items.filter((it) => placed[it[0]] === ci).map((it) => `<span class="ge-in ${it[1] === ci ? "ok" : "no"}">${it[1] === ci ? "✓" : "✗"} ${it[0]}</span>`).join("")}
          </div>`).join("")}</div>`;
      stage.querySelectorAll(".ge-chip").forEach((b) => (b.onclick = () => { pick = b.dataset.i; render(); }));
      stage.querySelectorAll(".ge-cat").forEach((c) => (c.onclick = () => {
        if (!pick) return;
        const it = items.find((x) => x[0] === pick);
        placed[pick] = Number(c.dataset.c);
        out.innerHTML = it[1] === placed[pick] ? `✅ <b>${it[0]}</b> — to‘g‘ri! ${it[2] || ""}` : `❌ <b>${it[0]}</b> aslida “${p.cats[it[1]]}” guruhiga kiradi. ${it[2] || ""}`;
        pick = null;
        render();
        if (items.every((x) => placed[x[0]] != null)) {
          const ok = items.filter((x) => placed[x[0]] === x[1]).length;
          out.innerHTML += `<div class="big-num">Natija: ${ok} / ${items.length}</div>`;
        }
      }));
    }
    controls.append(button("↺ Qaytadan", load, "ghost"), button("💡 To‘g‘ri javoblarni ko‘rsat", () => { items.forEach((x) => (placed[x[0]] = x[1])); pick = null; render(); }, "ghost"));
    load();
  };

  // ---------- Juftini top ----------
  W.matcher = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let leftSel = null, done = {};
    function render() {
      const rights = p.pairs.map((x, i) => [x[1], i]).sort((a, b) => a[0].localeCompare(b[0]));
      stage.innerHTML = `<div class="ge-match">
        <div>${p.pairs.map((x, i) => `<button class="ge-m l ${done[i] ? "ok" : ""} ${leftSel === i ? "on" : ""}" data-l="${i}" ${done[i] ? "disabled" : ""}>${x[0]}</button>`).join("")}</div>
        <div>${rights.map(([t, i]) => `<button class="ge-m r ${done[i] ? "ok" : ""}" data-r="${i}" ${done[i] ? "disabled" : ""}>${t}</button>`).join("")}</div></div>`;
      stage.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => { leftSel = Number(b.dataset.l); render(); }));
      stage.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => {
        if (leftSel == null) { out.innerHTML = "Avval chap ustundan tanlang."; return; }
        const r = Number(b.dataset.r);
        if (r === leftSel) { done[r] = true; out.innerHTML = `✅ ${p.pairs[r][0]} — ${p.pairs[r][1]}. ${p.pairs[r][2] || ""}`; }
        else out.innerHTML = `❌ Bu juftlik emas. Yana urinib ko‘ring.`;
        leftSel = null;
        render();
        if (Object.keys(done).length === p.pairs.length) out.innerHTML += `<div class="big-num">🎉 Hammasi to‘g‘ri!</div>`;
      }));
    }
    controls.append(button("↺ Qaytadan", () => { done = {}; leftSel = null; out.innerHTML = ""; render(); }, "ghost"));
    render();
  };

  // ---------- Resurs bilan ta'minlanganlik ----------
  W.reserveCalc = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    const presets = [["🛢️ Neft (dunyo)", 50], ["🔥 Tabiiy gaz (dunyo)", 50], ["⛏️ Ko‘mir (dunyo)", 130]];
    let R = 1000, P = 20;
    function render() {
      const years = R / P;
      const el = svg(520, 120);
      const W_ = Math.min(480, years * 3);
      s("rect", { x: 20, y: 40, width: 480, height: 30, rx: 8, fill: "rgba(255,255,255,.08)" }, el);
      s("rect", { x: 20, y: 40, width: W_, height: 30, rx: 8, fill: years < 30 ? "#ef4444" : years < 80 ? "#f59e0b" : "#22c55e", class: "grow-x" }, el);
      for (let y = 0; y <= 160; y += 40) {
        s("text", { x: 20 + y * 3, y: 95, fill: "#94a3b8", "font-size": 12, "text-anchor": "middle", text: `${y} yil` }, el);
      }
      stage.innerHTML = "";
      stage.append(el);
      out.innerHTML = `<div class="big-num">Ta’minlanganlik = ${num(R)} : ${num(P)} ≈ ${num(Math.round(years))} yil</div>
        <div class="steps"><div>Zaxira (R) — yer ostidagi aniqlangan miqdor; yillik qazib olish (P) — har yili chiqarilayotgan miqdor.</div>
        <div>Bu ko‘rsatkich “hozirgi sur’atda qazib olinsa, resurs necha yilga yetadi?” degan savolga javob beradi.</div></div>`;
    }
    const cR = slider({ label: "Zaxira (R), mln tonna", min: 100, max: 5000, step: 100, value: R, fmt: num, onInput: (v) => { R = v; render(); } });
    const cP = slider({ label: "Yillik qazib olish (P), mln tonna", min: 5, max: 200, step: 5, value: P, fmt: num, onInput: (v) => { P = v; render(); } });
    controls.append(cR, cP, buttons(presets.map((x) => x[0]), (i) => { P = 20; R = presets[i][1] * 20; cR.set(R); cP.set(P); render(); out.innerHTML += `<div class="muted">${presets[i][0]}: dunyo bo‘yicha taxminan ${presets[i][1]} yil (zaxira/qazib olish nisbati).</div>`; }, -1));
    render();
  };

  // ---------- Dunyo aholisi ----------
  W.popTimeline = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    const M = [[1804, 1], [1927, 2], [1960, 3], [1974, 4], [1987, 5], [1999, 6], [2011, 7], [2022, 8]];
    let r = 0.9, P0 = 8.1, t = 20;
    function render() {
      const el = svg(520, 230);
      const X = (y) => 40 + ((y - 1800) / 230) * 460, Y = (v) => 200 - v * 21;
      s("line", { x1: 40, y1: 200, x2: 505, y2: 200, stroke: "#64748b" }, el);
      let d = "";
      M.forEach(([y, v], i) => { d += `${i ? "L" : "M"}${X(y)},${Y(v)} `; });
      s("path", { d, fill: "none", stroke: "#38bdf8", "stroke-width": 3, class: "draw" }, el);
      M.forEach(([y, v], i) => {
        s("circle", { cx: X(y), cy: Y(v), r: 6, fill: "#fde047", class: "pop", style: `animation-delay:${i * 120}ms` }, el);
        s("text", { x: i ? X(y) - 4 : X(y) + 6, y: Y(v) - 10, fill: "#e2e8f0", "font-size": 11, "text-anchor": i ? "end" : "start", text: `${v} mlrd · ${y}` }, el);
      });
      stage.innerHTML = "";
      stage.append(el);
      const Pt = P0 * Math.pow(1 + r / 100, t);
      out.innerHTML = `<div class="steps"><div>1 mlrddan 2 mlrdga yetish uchun 123 yil kerak bo‘lgan, 7 dan 8 mlrdga — atigi 11 yil!</div>
        <div>Prognoz: P = P₀ · (1 + r)ᵗ = ${P0} · (1 + ${r}%)^${t}</div></div>
        <div class="big-num">${t} yildan keyin ≈ ${Pt.toFixed(2).replace(".", ",")} mlrd kishi</div>
        <div class="muted">Bu oddiy model: yillik o‘sish sur’ati o‘zgarmas deb olinadi. Haqiqatda o‘sish sekinlashmoqda.</div>`;
    }
    controls.append(
      slider({ label: "Yillik o‘sish (%)", min: 0, max: 3, step: 0.1, value: r, fmt: (v) => v.toFixed(1) + "%", onInput: (v) => { r = v; render(); } }),
      slider({ label: "Necha yil keyin", min: 5, max: 50, value: t, onInput: (v) => { t = v; render(); } })
    );
    render();
  };

  // ---------- Yosh-jins piramidasi ----------
  W.agePyramid = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    // namunaviy foizlar (har guruh uchun erkak/ayol), pastdan yuqoriga
    const types = {
      "O‘suvchi (yosh aholi)": [8.5, 7.5, 6.5, 5.6, 4.7, 3.8, 2.9, 2.0, 1.2, 0.6],
      "Barqaror": [5.2, 5.2, 5.1, 5.0, 4.8, 4.5, 4.0, 3.2, 2.2, 1.0],
      "Qisqaruvchi (qariyotgan aholi)": [3.6, 3.9, 4.3, 4.7, 5.0, 5.2, 5.1, 4.7, 4.0, 2.6]
    };
    const names = Object.keys(types);
    let cur = 0;
    function render() {
      const v = types[names[cur]];
      const el = svg(420, 300);
      const mid = 210, sc = 18;
      v.forEach((x, i) => {
        const y = 270 - i * 26;
        s("rect", { x: mid - 22 - x * sc, y, width: x * sc, height: 22, rx: 4, fill: "#38bdf8", class: "pop", style: `animation-delay:${i * 50}ms` }, el);
        s("rect", { x: mid + 22, y, width: x * sc * 0.98, height: 22, rx: 4, fill: "#f472b6", class: "pop", style: `animation-delay:${i * 50}ms` }, el);
        s("text", { x: mid, y: y + 15, "text-anchor": "middle", fill: "#cbd5e1", "font-size": 11, text: `${i * 10}–${i * 10 + 9}` }, el);
      });
      s("text", { x: 60, y: 20, fill: "#38bdf8", "font-weight": 800, text: "♂ Erkaklar" }, el);
      s("text", { x: 300, y: 20, fill: "#f472b6", "font-weight": 800, text: "♀ Ayollar" }, el);
      stage.innerHTML = "";
      stage.append(el);
      const notes = [
        "Asosi keng, cho‘qqisi tor: tug‘ilish yuqori, aholi yosh. Afrika va Janubiy Osiyoning ko‘p mamlakatlariga xos.",
        "Yosh guruhlari deyarli teng: tug‘ilish va o‘lim muvozanatlashgan.",
        "Asosi tor: tug‘ilish past, keksalar ulushi katta. Yaponiya va ko‘plab Yevropa mamlakatlariga xos."
      ];
      out.innerHTML = `<div class="big-num">${names[cur]}</div><div>${notes[cur]}</div><div class="muted">Piramida namunaviy: har bir ustun — 10 yillik yosh guruhining ulushi.</div>`;
    }
    controls.append(buttons(names, (i) => { cur = i; render(); }));
    render();
  };

  // ---------- Ulushlar (donut) ----------
  // p.sets: [[nom, [[label, foiz], ...]]]
  W.shareChart = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    let cur = 0;
    function render() {
      const [, parts] = p.sets[cur];
      const total = parts.reduce((a, b) => a + b[1], 0);
      const el = svg(260, 260);
      let a0 = -Math.PI / 2;
      parts.forEach(([, v], i) => {
        const a1 = a0 + (v / total) * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const R = 110, r = 62, cx = 130, cy = 130;
        const d = `M${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} L${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} A${r},${r} 0 ${large} 0 ${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} Z`;
        s("path", { d, fill: COLORS[i % 10], stroke: "#03110b", "stroke-width": 2, class: "pop", style: `animation-delay:${i * 90}ms` }, el);
        a0 = a1;
      });
      s("text", { x: 130, y: 136, "text-anchor": "middle", fill: "#fff", "font-weight": 900, "font-size": 15, text: p.center || "100%" }, el);
      stage.innerHTML = "";
      stage.append(el);
      stage.append(h("div", { class: "legend", html: parts.map(([l, v], i) => `<span style="--c:${COLORS[i % 10]}">${l} — ${num(v)}%</span>`).join("") }));
      out.innerHTML = p.sets[cur][2] ? `<div>${p.sets[cur][2]}</div>` : "";
    }
    if (p.sets.length > 1) controls.append(buttons(p.sets.map((x) => x[0]), (i) => { cur = i; render(); }));
    render();
  };

  // ---------- Urbanizatsiya ----------
  W.urbanChart = (root, p) => {
    const { stage, controls, out } = frame(root, p.title);
    const D = [[1950, 30], [1975, 37], [2000, 47], [2007, 50], [2018, 55], [2030, 60], [2050, 68]];
    let city = 18, total = 37;
    function render() {
      const el = svg(520, 200);
      const X = (y) => 40 + ((y - 1950) / 100) * 450, Y = (v) => 180 - v * 2.2;
      s("line", { x1: 40, y1: Y(50), x2: 495, y2: Y(50), stroke: "rgba(253,224,71,.4)", "stroke-dasharray": "5 4" }, el);
      s("text", { x: 495, y: Y(50) - 6, "text-anchor": "end", fill: "#fde047", "font-size": 11, text: "50%" }, el);
      D.forEach(([y, v], i) => {
        const proj = y > 2024;
        s("rect", { x: X(y) - 14, y: Y(v), width: 28, height: 180 - Y(v), rx: 5, fill: proj ? "rgba(56,189,248,.45)" : "#38bdf8", class: "grow-y", style: `animation-delay:${i * 80}ms;transform-origin:bottom` }, el);
        s("text", { x: X(y), y: Y(v) - 5, "text-anchor": "middle", fill: "#e2e8f0", "font-size": 11, "font-weight": 800, text: v + "%" }, el);
        s("text", { x: X(y), y: 196, "text-anchor": "middle", fill: "#94a3b8", "font-size": 10, text: y + (proj ? "*" : "") }, el);
      });
      stage.innerHTML = "";
      stage.append(el);
      const u = (city / total) * 100;
      out.innerHTML = `<div class="steps"><div>Dunyoda shahar aholisi ulushi (BMT ma’lumotlari, * — prognoz). 2007-yilda birinchi marta shaharliklar yarmidan oshdi.</div>
        <div>Urbanizatsiya darajasi = shahar aholisi : jami aholi · 100%</div></div>
        <div class="big-num">${num(city)} : ${num(total)} · 100% ≈ ${u.toFixed(1).replace(".", ",")}%</div>`;
    }
    const cTot = slider({ label: "Jami aholi (mln)", min: 1, max: 200, value: total, onInput: (v) => { total = v; if (city > total) { city = total; cCity.set(city); } render(); } });
    const cCity = slider({ label: "Shahar aholisi (mln)", min: 0, max: 200, value: city, onInput: (v) => { city = Math.min(v, total); render(); } });
    controls.append(cTot, cCity);
    render();
  };
})();
