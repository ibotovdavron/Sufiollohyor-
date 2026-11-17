/* BIOLOGIYA jonli tajribalari (3-qism):
   eyetest — ko‘rish o‘tkirligi jadvali    hearing — eshitish chegarasi (tovush generatori)    memory — xotira testi
   selection — tabiiy tanlanish (niqoblanish o‘yini)    hardy — Hardi–Vaynberg kalkulyatori
   cycle — moddalar aylanishi sxemasi (uglerod, azot, suv, kislorod)    diet — kunlik ratsion kalkulyatori
   sexlink — jinsga bog‘liq irsiylanish (daltonizm, gemofiliya)    noallel — noallel genlarning o‘zaro ta’siri */
(() => {
  "use strict";
  const { h, s, svg, slider, buttons, button, frame, W } = window.AK;
  const { animCanvas, label } = window.FIZ;
  const { clamp } = window.BIO;
  const PI = Math.PI, TAU = PI * 2;
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

  // ===================================================================
  // 1. KO'RISH O'TKIRLIGI (Golovin-Sivsev jadvali uslubida — “Ш” belgisi yo‘nalishi)
  // ===================================================================
  W.eyetest = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "👁 Ko‘rish o‘tkirligini tekshiring — belgining ochiq tomonini toping");
    const ROWS = [[0.1, 70], [0.2, 35], [0.3, 23], [0.4, 17.5], [0.5, 14], [0.6, 11.7], [0.7, 10], [0.8, 8.8], [0.9, 7.8], [1.0, 7], [1.5, 4.7], [2.0, 3.5]];
    let row = 0, ok = 0, tries = 0, dir = 0;
    const box = h("div", { class: "bio-eye" }), sign = h("div", { class: "bio-eye-s" }, "E"); box.append(sign); stage.append(box);
    const dirs = [["⬅", 180], ["⬆", 270], ["➡", 0], ["⬇", 90]];
    function next() { dir = Math.floor(Math.random() * 4); sign.style.fontSize = ROWS[row][1] * 1.6 + "px"; sign.style.transform = `rotate(${dirs[dir][1]}deg)`; out.innerHTML = `Qator: <b>V = ${ROWS[row][0]}</b> · Belgining “oyoqlari” qaysi tomonga qaragan? <small>(Telefonni 2–3 qadam uzoqlikda ushlang, bir ko‘zni yoping.)</small>`; }
    controls.append(h("div", { class: "bio-dirs" }, ...dirs.map(([e], i) => h("button", { type: "button", class: "dbtn", onclick: () => ans(i) }, e))));
    function ans(i) {
      tries++; if (i === dir) ok++;
      if (tries >= 3) {
        if (ok >= 2 && row < ROWS.length - 1) { row++; ok = 0; tries = 0; next(); return; }
        const v = ok >= 2 ? ROWS[row][0] : row ? ROWS[row - 1][0] : "< 0,1";
        out.innerHTML = `🏁 Taxminiy ko‘rish o‘tkirligi: <b>V ≈ ${v}</b>. Me’yor — <b>1,0</b>. ${typeof v === "number" && v < 0.8 ? "Ko‘z shifokoriga (oftalmolog) uchrashing." : "Yaxshi natija!"} <small>Bu o‘quv testi — tibbiy tashxis emas.</small>`;
        controls.querySelectorAll(".bio-dirs button").forEach((b) => (b.disabled = true));
        controls.append(button("↺ Qaytadan", () => { row = 0; ok = 0; tries = 0; controls.querySelectorAll(".bio-dirs button").forEach((b) => (b.disabled = false)); next(); }));
        return;
      }
      next();
    }
    next();
  };

  // ===================================================================
  // 2. ESHITISH CHEGARASI — tovush generatori
  // ===================================================================
  W.hearing = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "👂 Eshitish chegarasini aniqlang — chastotani o‘zgartiring");
    let f = 1000, vol = 0.15, osc = null, gain = null, ac = null, t0 = 0;
    animCanvas(stage, 440, 140, (c, dt, t) => {
      c.clearRect(0, 0, 440, 140); c.strokeStyle = osc ? "#38bdf8" : "#475569"; c.lineWidth = 2; c.beginPath();
      const k = Math.min(60, f / 300 + 1);
      for (let x = 0; x <= 440; x++) { const y = 70 - Math.sin((x / 440) * TAU * k + t * 8) * (osc ? 40 * Math.sqrt(vol / 0.3) : 4); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
      label(c, 220, 128, `${Math.round(f).toLocaleString("uz")} Hz ${f < 20 ? "(infratovush)" : f > 20000 ? "(ultratovush)" : ""}`, "#e0f2fe", "rgba(0,0,0,.5)", 12);
    });
    const play = () => { if (osc) return; ac = ac || new (window.AudioContext || window.webkitAudioContext)(); osc = ac.createOscillator(); gain = ac.createGain(); gain.gain.value = vol; osc.frequency.value = f; osc.connect(gain).connect(ac.destination); osc.start(); t0 = performance.now(); };
    const stop = () => { if (osc) { osc.stop(); osc.disconnect(); osc = null; } };
    const fs = slider({ label: "Chastota", min: 1.3, max: 4.3, step: 0.01, value: 3, fmt: (v) => Math.round(10 ** v).toLocaleString("uz") + " Hz", onInput: (v) => { f = 10 ** v; if (osc) osc.frequency.value = f; info(); } });
    controls.append(button("▶ / ⏹ Tovush", () => (osc ? stop() : play())), fs, slider({ label: "Balandlik", min: 0.01, max: 0.3, step: 0.01, value: vol, fmt: (v) => Math.round(v * 333) + " %", onInput: (v) => { vol = v; if (gain) gain.gain.value = v; } }),
      buttons(["🐘 20 Hz", "🎵 440 Hz (lya)", "🔔 4000 Hz", "🦗 15 000 Hz", "🦇 19 000 Hz"], (i) => { f = [20, 440, 4000, 15000, 19000][i]; fs.set(Math.log10(f)); if (osc) osc.frequency.value = f; info(); }, -1));
    const info = () => (out.innerHTML = `Inson quloqi <b>20 Hz — 20 000 Hz</b> oralig‘ini eshitadi; eng sezgir — <b>1000–4000 Hz</b>. Yosh o‘tgan sari yuqori chastotalarni eshitish pasayadi (kattalar ko‘pincha 15 000 Hz dan yuqorisini eshitmaydi). Chastotani asta oshirib, qachon eshitmay qolganingizni toping. ⚠️ Ovozni baland qo‘ymang — quloqchinda ayniqsa ehtiyot bo‘ling!`);
    info();
    const chk = setInterval(() => { if (!root.isConnected) { stop(); clearInterval(chk); } }, 1000);
  };

  // ===================================================================
  // 3. XOTIRA TESTI
  // ===================================================================
  const WORDS = ["olma", "kitob", "daryo", "qalam", "quyosh", "mushuk", "tog‘", "non", "gul", "soat", "mashina", "daraxt", "kalit", "eshik", "baliq", "yulduz", "stul", "deraza", "qor", "tuz", "shamol", "qush", "choy", "oyna"];
  W.memory = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧠 Xotira testi — 10 ta so‘zni 20 soniyada eslab qoling");
    const box = h("div", { class: "bio-mem" }); stage.append(box);
    let set = [], timer = 0;
    function start() {
      set = shuffle(WORDS).slice(0, 10); box.innerHTML = set.map((w) => `<span>${w}</span>`).join(""); controls.innerHTML = "";
      let left = 20; out.innerHTML = `⏳ Eslab qoling: <b>${left}</b> s`;
      clearInterval(timer); timer = setInterval(() => { left--; out.innerHTML = `⏳ Eslab qoling: <b>${left}</b> s`; if (left <= 0) { clearInterval(timer); recall(); } }, 1000);
    }
    function recall() {
      const opts = shuffle([...set, ...shuffle(WORDS.filter((w) => !set.includes(w))).slice(0, 10)]); const picked = new Set();
      box.innerHTML = ""; opts.forEach((w) => box.append(h("button", { type: "button", class: "ks-bin", onclick: (e) => { e.currentTarget.classList.toggle("on"); picked.has(w) ? picked.delete(w) : picked.add(w); } }, w)));
      out.innerHTML = "Qaysi so‘zlar bor edi? Belgilang (adashtiruvchi so‘zlar ham bor).";
      controls.innerHTML = ""; controls.append(button("✅ Tekshirish", () => {
        const hit = [...picked].filter((w) => set.includes(w)).length, wrong = [...picked].length - hit;
        box.querySelectorAll("button").forEach((b) => { const w = b.textContent; b.disabled = true; b.classList.toggle("ok", set.includes(w)); if (picked.has(w) && !set.includes(w)) b.classList.add("no"); });
        out.innerHTML = `Natija: <b>${hit}/10</b> to‘g‘ri, ${wrong} ta xato. Qisqa muddatli xotira hajmi o‘rtacha <b>7 ± 2</b> element (Miller qonuni). 💡 Yaxshiroq eslash usullari: so‘zlarni guruhlash, hikoya to‘qish, tasavvur qilish, takrorlash, yetarli uyqu!`;
        controls.innerHTML = ""; controls.append(button("↺ Yana urinish", start));
      }));
    }
    controls.append(button("▶ Boshlash", start));
    out.innerHTML = "<b>Xotira</b> — ma’lumotni eslab qolish, saqlash va qayta tiklash. Boshlang!";
  };

  // ===================================================================
  // 4. TABIIY TANLANISH — niqoblanish (qayin kapalagi)
  // ===================================================================
  W.selection = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🦋 Siz — qush! Ko‘zga tashlanayotgan kapalaklarni “yeng” va tanlanishni kuzating");
    let bg = 0, gen = 1, moths = [], caught = 0, hist = [];
    const BG = [["🌳 Oq qayin po‘stlog‘i", "#e7e5e4"], ["🏭 Is bosgan po‘stloq", "#3f3f46"]];
    const spawn = (light) => { moths = []; for (let i = 0; i < 30; i++) moths.push({ x: 20 + Math.random() * 400, y: 20 + Math.random() * 200, l: Math.random() < light, a: Math.random() * TAU }); caught = 0; };
    spawn(0.5);
    const cv = animCanvas(stage, 440, 240, (c) => {
      c.fillStyle = BG[bg][1]; c.fillRect(0, 0, 440, 240);
      c.strokeStyle = bg ? "rgba(0,0,0,.35)" : "rgba(68,64,60,.35)"; c.lineWidth = 3; for (let i = 0; i < 30; i++) { c.beginPath(); c.moveTo((i * 53) % 440, (i * 37) % 240); c.lineTo((i * 53) % 440 + 30, (i * 37) % 240 + 2); c.stroke(); }
      for (const m of moths) { c.save(); c.translate(m.x, m.y); c.rotate(m.a); c.fillStyle = m.l ? "#f5f5f4" : "#27272a"; c.strokeStyle = m.l ? "#a8a29e" : "#52525b"; c.beginPath(); c.ellipse(-7, 0, 8, 5, 0.4, 0, TAU); c.ellipse(7, 0, 8, 5, -0.4, 0, TAU); c.fill(); c.stroke(); c.restore(); }
      label(c, 70, 228, `Avlod: ${gen} · tutildi: ${caught}/15`, "#fff", "rgba(0,0,0,.55)", 11);
    });
    cv.addEventListener("pointerdown", (e) => {
      const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 440, y = ((e.clientY - r.top) / r.height) * 240;
      const i = moths.findIndex((m) => Math.hypot(m.x - x, m.y - y) < 14); if (i < 0) return;
      moths.splice(i, 1); caught++;
      if (caught >= 15) { const lightShare = moths.filter((m) => m.l).length / moths.length; hist.push(Math.round(lightShare * 100)); gen++; spawn(lightShare); info(); }
    });
    function info() { out.innerHTML = `Har avlodda 15 ta kapalakni tuting — qolganlari ko‘payadi. Oq kapalaklar ulushi avlodlar bo‘yicha: <b>${hist.length ? hist.map((x) => x + "%").join(" → ") : "50%"}</b>.<br>Qushlar ko‘zga tashlangan kapalaklarni yeydi — <b>niqoblangan</b> rangdagilar omon qolib, ko‘payadi. Bu <b>tabiiy tanlanish</b> (Ch. Darvin). Angliyada sanoat inqilobi davrida is bosgan daraxtlarda qora qayin kapalaklari ko‘paygani — haqiqiy misol (“sanoat melanizmi”).`; }
    controls.append(buttons(BG.map((x) => x[0]), (i) => { bg = i; gen = 1; hist = []; spawn(0.5); info(); }, 0), button("↺ Qaytadan", () => { gen = 1; hist = []; spawn(0.5); info(); }));
    info();
  };

  // ===================================================================
  // 5. HARDI–VAYNBERG KALKULYATORI
  // ===================================================================
  W.hardy = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "📊 Hardi–Vaynberg qonuni: p² + 2pq + q² = 1");
    let q2 = p.q2 ?? 0.04, N = 1000;
    const box = h("div", { class: "bio-hw" }); stage.append(box);
    function draw() {
      const q = Math.sqrt(q2), pp = 1 - q, AA = pp * pp, Aa = 2 * pp * q, aa = q * q;
      box.innerHTML = `<div class="bio-hw-bar"><i style="width:${AA * 100}%;background:#22c55e">AA</i><i style="width:${Aa * 100}%;background:#eab308">Aa</i><i style="width:${aa * 100}%;background:#ef4444">aa</i></div>
        <table><tr><th></th><th>Ulush</th><th>${N} kishida</th></tr>
        <tr><td>p (A alleli)</td><td>${pp.toFixed(3)}</td><td>—</td></tr><tr><td>q (a alleli)</td><td>${q.toFixed(3)}</td><td>—</td></tr>
        <tr><td>AA — sog‘lom gomozigota</td><td>${(AA * 100).toFixed(1)} %</td><td>${Math.round(AA * N)}</td></tr>
        <tr><td>Aa — tashuvchi geterozigota</td><td>${(Aa * 100).toFixed(1)} %</td><td>${Math.round(Aa * N)}</td></tr>
        <tr><td>aa — retsessiv belgi namoyon</td><td>${(aa * 100).toFixed(1)} %</td><td>${Math.round(aa * N)}</td></tr></table>`;
      out.innerHTML = `Retsessiv belgili individlar ulushi (q²) ma’lum bo‘lsa: q = √q², p = 1 − q. Ko‘rinishidan sog‘lom, lekin <b>tashuvchilar (2pq)</b> retsessiv belgililardan ancha ko‘p bo‘lishi mumkin! Qonun shartlari: katta populyatsiya, erkin chatishish, mutatsiya, migratsiya va tanlanish yo‘q.`;
    }
    controls.append(slider({ label: "Retsessiv belgili ulush q² (aa)", min: 0.0001, max: 0.5, step: 0.0001, value: q2, fmt: (v) => (v * 100).toFixed(2) + " %", onInput: (v) => { q2 = v; draw(); } }),
      slider({ label: "Populyatsiya soni N", min: 100, max: 100000, step: 100, value: N, fmt: (v) => v.toLocaleString("uz"), onInput: (v) => { N = v; draw(); } }),
      buttons(["Albinizm (1:20 000)", "Retsessiv belgi 4 %", "Retsessiv 25 %"], (i) => { q2 = [1 / 20000, 0.04, 0.25][i]; controls.querySelector("input").value = q2; draw(); }, -1));
    draw();
  };

  // ===================================================================
  // 6. MODDALAR AYLANISHI SXEMASI
  // ===================================================================
  const CYC = {
    "♻ Uglerod": { nodes: [["🌫 Atmosferadagi CO₂", 220, 30], ["🌿 O‘simliklar (fotosintez)", 360, 110], ["🐄 Hayvonlar", 340, 220], ["🍂 O‘lik organizmlar → redutsentlar", 120, 220], ["⛽ Qazilma yoqilg‘i (ko‘mir, neft)", 70, 120]], edges: [[0, 1, "Fotosintez: CO₂ yutiladi"], [1, 2, "Oziqlanish"], [2, 0, "Nafas: CO₂ ajraladi"], [1, 3, "O‘lim, to‘kilma"], [2, 3, "O‘lim"], [3, 0, "Chirish (parchalanish) — CO₂"], [3, 4, "Millionlab yillarda — ko‘mir, neft"], [4, 0, "Yoqish — CO₂ (inson ta’siri, issiqxona effekti!)"]] },
    "🌱 Azot": { nodes: [["🌫 Atmosferadagi N₂ (78 %)", 220, 30], ["🦠 Azot to‘plovchi bakteriyalar (tuganak)", 370, 110], ["🌿 O‘simliklar (oqsillar)", 330, 220], ["🐄 Hayvonlar", 110, 220], ["🧪 Tuproqdagi ammoniy va nitratlar", 80, 110]], edges: [[0, 1, "Azot fiksatsiyasi (chaqmoq ham)"], [1, 4, "Ammiak → nitratlar (nitrifikatsiya)"], [4, 2, "Ildiz orqali so‘riladi"], [2, 3, "Oziqlanish — oqsillar"], [3, 4, "Chiqindilar, o‘lik — chirituvchi bakteriyalar"], [4, 0, "Denitrifikatsiya — N₂ qaytadi"]] },
    "💧 Suv": { nodes: [["☁ Bulutlar", 220, 30], ["🌧 Yog‘in", 360, 110], ["🏞 Daryo, ko‘l, yer osti suvlari", 300, 220], ["🌊 Okean", 120, 220], ["🌿 O‘simliklar (transpiratsiya)", 80, 110]], edges: [[0, 1, "Kondensatsiya"], [1, 2, "Oqim, shimilish"], [2, 3, "Daryolar okeanga quyiladi"], [3, 0, "Bug‘lanish (Quyosh energiyasi)"], [2, 4, "Ildiz orqali so‘riladi"], [4, 0, "Transpiratsiya"]] },
    "🫧 Kislorod": { nodes: [["🌫 Atmosferadagi O₂ (21 %)", 220, 30], ["🌿 Produtsentlar", 360, 120], ["🐄 Hayvonlar, odam", 300, 225], ["🔥 Yonish, chirish", 110, 225], ["🛡 Ozon qatlami (O₃)", 80, 110]], edges: [[1, 0, "Fotosintez — O₂ ajraladi"], [0, 2, "Nafas olish"], [0, 3, "Oksidlanish"], [0, 4, "UB nurlar ta’sirida O₃"], [2, 1, "CO₂ → o‘simliklarga"]] },
  };
  W.cycle = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "♻ Biosferada moddalar aylanishi — strelkani bosing");
    let ck = p.kind || Object.keys(CYC)[0];
    const g = svg(440, 260, "fz-svg bio-cyc"); stage.append(g);
    function draw() {
      g.innerHTML = ""; const C = CYC[ck];
      const defs = s("defs", {}, g); const mk = s("marker", { id: "bioArr", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" }, defs); s("path", { d: "M0 0 L10 5 L0 10 z", fill: "#38bdf8" }, mk);
      C.edges.forEach(([a, b, t], i) => {
        const [, x1, y1] = C.nodes[a], [, x2, y2] = C.nodes[b], mx = (x1 + x2) / 2 + (y2 - y1) * 0.15, my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
        const sh = 0.18, sx = x1 + (x2 - x1) * sh, sy = y1 + (y2 - y1) * sh, ex = x2 - (x2 - x1) * sh, ey = y2 - (y2 - y1) * sh;
        const path = s("path", { d: `M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`, class: "bio-cyc-e", "marker-end": "url(#bioArr)", style: `--d:${i * 0.3}s` }, g);
        const hit = s("path", { d: `M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`, stroke: "transparent", "stroke-width": 16, fill: "none", style: "cursor:pointer" }, g);
        hit.addEventListener("click", () => { g.querySelectorAll(".bio-cyc-e").forEach((e) => e.classList.remove("on")); path.classList.add("on"); out.innerHTML = `<b>${C.nodes[a][0]} → ${C.nodes[b][0]}</b>: ${t}`; });
      });
      C.nodes.forEach(([t, x, y]) => { const gg = s("g", { transform: `translate(${x},${y})` }, g); s("rect", { x: -62, y: -15, width: 124, height: 30, rx: 10, class: "bio-cyc-n" }, gg); s("text", { y: 4, "text-anchor": "middle", class: "fz-t", fill: "currentColor", text: t.length > 22 ? t.slice(0, 21) + "…" : t }, gg); s("title", { text: t }, gg); });
    }
    controls.append(buttons(Object.keys(CYC), (i) => { ck = Object.keys(CYC)[i]; draw(); out.innerHTML = "Strelkani bosing — jarayon nomi va mohiyati chiqadi."; }, Object.keys(CYC).indexOf(ck)));
    draw(); out.innerHTML = "Strelkalarni bosing. Moddalar biosferada <b>to‘xtovsiz aylanadi</b>, energiya esa bir yo‘nalishda — Quyoshdan issiqlikka o‘tadi (V. Vernadskiy: “tirik modda — biosferaning asosiy kuchi”).";
  };

  // ===================================================================
  // 7. KUNLIK RATSION KALKULYATORI
  // ===================================================================
  const FOOD = [["🍞 Non (100 g)", 8, 1, 50, 245], ["🍚 Osh / palov (250 g)", 15, 22, 70, 540], ["🥚 Tuxum (1 dona)", 6, 5, 0.5, 70], ["🥛 Sut (250 ml)", 8, 8, 12, 150], ["🍗 Tovuq go‘shti (100 g)", 25, 7, 0, 165], ["🥩 Mol go‘shti (100 g)", 26, 15, 0, 250], ["🍎 Olma", 0.4, 0.3, 19, 80], ["🍌 Banan", 1.3, 0.4, 27, 105], ["🥗 Sabzavot salati (200 g)", 3, 5, 10, 100], ["🧀 Pishloq (30 g)", 7, 9, 0.5, 110], ["🍫 Shokolad (50 g)", 3, 15, 30, 270], ["🥤 Gazli ichimlik (330 ml)", 0, 0, 35, 140], ["🍟 Kartoshka fri (100 g)", 3.4, 15, 41, 310], ["🫘 No‘xat/loviya (150 g pishgan)", 13, 4, 40, 240], ["🥜 Yong‘oq (30 g)", 5, 19, 4, 200]];
  W.diet = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🥗 Kunlik ratsioningizni tuzing — oqsil, yog‘, uglevod va energiya");
    const cnt = FOOD.map(() => 0);
    const list = h("div", { class: "bio-diet" }), bars = h("div", { class: "bio-sim" }); stage.append(list, bars);
    let norm = [80, 80, 340, 2500];
    function draw() {
      list.innerHTML = "";
      FOOD.forEach(([n], i) => list.append(h("div", { class: "bio-food" }, h("span", {}, n), h("button", { type: "button", class: "dbtn", onclick: () => { cnt[i] = Math.max(0, cnt[i] - 1); draw(); } }, "−"), h("b", {}, String(cnt[i])), h("button", { type: "button", class: "dbtn", onclick: () => { cnt[i]++; draw(); } }, "+"))));
      const tot = [0, 0, 0, 0]; FOOD.forEach((f, i) => { for (let k = 0; k < 4; k++) tot[k] += f[k + 1] * cnt[i]; });
      const names = ["Oqsil, g", "Yog‘, g", "Uglevod, g", "Energiya, kkal"];
      bars.innerHTML = names.map((n, k) => { const r = tot[k] / norm[k]; return `<div class="bio-bar"><span>${n}</span><i style="width:${Math.min(100, r * 100)}%;background:${r > 1.15 ? "#ef4444" : r > 0.85 ? "#22c55e" : "#eab308"}"></i><b>${Math.round(tot[k])}/${norm[k]}</b></div>`; }).join("");
      const r = tot[3] / norm[3];
      out.innerHTML = `${r < 0.85 ? "🟡 Energiya yetarli emas." : r > 1.15 ? "🔴 Energiya me’yordan ko‘p — ortiqcha vazn xavfi." : "🟢 Energiya me’yorida!"} Sog‘lom nisbat: oqsil : yog‘ : uglevod ≈ <b>1 : 1 : 4</b>. Shirin ichimlik va fri — “bo‘sh kaloriyalar”: energiya ko‘p, vitamin kam.`;
    }
    controls.append(buttons(["12–14 yosh (2400 kkal)", "15–17 yosh, qiz (2500)", "15–17 yosh, o‘g‘il (2900)", "Sportchi o‘smir (3300)"], (i) => { norm = [[80, 80, 330, 2400], [85, 85, 340, 2500], [95, 95, 400, 2900], [110, 110, 450, 3300]][i]; draw(); }, 0), button("↺ Tozalash", () => { cnt.fill(0); draw(); }));
    draw();
  };

  // ===================================================================
  // 8. JINSGA BOG'LIQ IRSIYLANISH
  // ===================================================================
  W.sexlink = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 Jinsga bog‘liq irsiylanish — X xromosomadagi genlar");
    const DIS = { "🎨 Daltonizm": ["D", "d", "normal ko‘radi", "daltonik"], "🩸 Gemofiliya": ["H", "h", "sog‘lom", "gemofiliya"] };
    let dk = Object.keys(DIS)[0];
    const box = h("div", { class: "bio-pun" }); stage.append(box);
    function names() { const [A, a] = DIS[dk]; return { moms: [`X${A}X${A}`, `X${A}X${a}`, `X${a}X${a}`], dads: [`X${A}Y`, `X${a}Y`] }; }
    const pretty = (g) => g.replace(/X([A-Za-z])/g, (m, x) => `X<sup>${x}</sup>`);
    let M = 1, F = 0;
    function draw() {
      const [A, a, ok, bad] = DIS[dk], nm = names(), mg = [nm.moms[M].slice(0, 2), nm.moms[M].slice(2)], fg = [nm.dads[F].slice(0, 2), "Y"];
      const ph = (g) => { if (g.includes("Y")) return g[1] === A ? `👦 o‘g‘il — ${ok}` : `👦 o‘g‘il — <b>${bad}</b>`; const al = [g[1], g[3]]; return al.every((x) => x === a) ? `👧 qiz — <b>${bad}</b>` : al.includes(a) ? `👧 qiz — ${ok}, <i>tashuvchi</i>` : `👧 qiz — ${ok}`; };
      let t = `<table><tr><th>♀ \\ ♂</th>${fg.map((g) => `<th>${pretty(g)}</th>`).join("")}</tr>`;
      mg.forEach((x) => { t += `<tr><th>${pretty(x)}</th>${fg.map((y) => { const g = x + y; return `<td><b>${pretty(g)}</b><br><small>${ph(g)}</small></td>`; }).join("")}</tr>`; });
      box.innerHTML = `<div class="bio-cross">♀ ${pretty(nm.moms[M])} × ♂ ${pretty(nm.dads[F])}</div>` + t + "</table>";
      out.innerHTML = `Gen <b>X xromosomada</b> joylashgan, Y da yo‘q. Shuning uchun o‘g‘il bolalar (XY) kasallikni <b>onasidan</b> oladi va bitta retsessiv allel yetarli — kasallik erkaklarda ko‘proq uchraydi. Ayollar ko‘pincha <b>tashuvchi</b> bo‘ladi. (Gemofiliya Britaniya qirolichasi Viktoriya avlodlari orqali Yevropa qirollik oilalariga tarqalgan.)`;
    }
    controls.append(buttons(Object.keys(DIS), (i) => { dk = Object.keys(DIS)[i]; draw(); }, 0),
      buttons(["♀ sog‘lom", "♀ tashuvchi", "♀ kasal"], (i) => { M = i; draw(); }, 1), buttons(["♂ sog‘lom", "♂ kasal"], (i) => { F = i; draw(); }, 0));
    draw();
  };

  // ===================================================================
  // 9. NOALLEL GENLARNING O'ZARO TA'SIRI (diduragay 16 katak)
  // ===================================================================
  const INT = {
    "Mustaqil (9:3:3:1)": [["A_B_", "#22c55e", "1-belgi"], ["A_bb", "#3b82f6", "2-belgi"], ["aaB_", "#eab308", "3-belgi"], ["aabb", "#ef4444", "4-belgi"]],
    "Komplementar (9:7) — no‘xat gullari": [["A_B_", "#a855f7", "binafsha"], ["A_bb", "#f5f5f4", "oq"], ["aaB_", "#f5f5f4", "oq"], ["aabb", "#f5f5f4", "oq"]],
    "Komplementar (9:3:3:1) — tovuq toji": [["A_B_", "#ef4444", "yong‘oqsimon"], ["A_bb", "#f97316", "atirgulsimon"], ["aaB_", "#eab308", "no‘xatsimon"], ["aabb", "#a3a3a3", "oddiy"]],
    "Dominant epistaz (12:3:1) — qovoq rangi": [["A_B_", "#f5f5f4", "oq"], ["A_bb", "#f5f5f4", "oq"], ["aaB_", "#eab308", "sariq"], ["aabb", "#22c55e", "yashil"]],
    "Retsessiv epistaz (9:3:4) — sichqon juni": [["A_B_", "#a16207", "kulrang (agouti)"], ["A_bb", "#27272a", "qora"], ["aaB_", "#f5f5f4", "oq"], ["aabb", "#f5f5f4", "oq"]],
    "Polimeriya (15:1) — bug‘doy doni": [["A_B_", "#b91c1c", "qizil"], ["A_bb", "#b91c1c", "qizil"], ["aaB_", "#b91c1c", "qizil"], ["aabb", "#f5f5f4", "oq"]],
  };
  W.noallel = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧬 Noallel genlarning o‘zaro ta’siri — AaBb × AaBb");
    let ik = p.kind || Object.keys(INT)[0];
    const box = h("div", { class: "bio-pun bio-16" }); stage.append(box);
    const G = ["AB", "Ab", "aB", "ab"];
    const cls = (g) => (g.includes("A") ? "A_" : "aa") + (g.includes("B") ? "B_" : "bb");
    function draw() {
      const R = INT[ik], cnt = {};
      let t = `<table><tr><th></th>${G.map((x) => `<th>${x}</th>`).join("")}</tr>`;
      G.forEach((x) => { t += `<tr><th>${x}</th>`; G.forEach((y) => { const gen = [x[0], y[0]].sort().join("") + [x[1], y[1]].sort().join(""); const c = cls(gen); const [, col, nm] = R.find((r) => r[0] === c); cnt[nm] = (cnt[nm] || 0) + 1; t += `<td style="background:${col};color:${["#f5f5f4", "#eab308"].includes(col) ? "#111" : "#fff"}"><b>${gen}</b><br><small>${nm}</small></td>`; }); t += "</tr>"; });
      box.innerHTML = t + "</table>";
      out.innerHTML = `<b>Nisbat:</b> ${Object.entries(cnt).map(([k, v]) => `${k} — ${v}`).join(" : ")}<br>Ikki noallel gen <b>birgalikda</b> bitta belgini belgilaydi — klassik 9:3:3:1 nisbat “birlashib” o‘zgaradi.`;
    }
    controls.append(buttons(Object.keys(INT), (i) => { ik = Object.keys(INT)[i]; draw(); }, Object.keys(INT).indexOf(ik)));
    draw();
  };
})();
