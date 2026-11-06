/* BILIM LABIRINTI — o'yinlar sahifasidagi kirish, darajalar va rekordlar. */
(() => {
  "use strict";
  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const KEY = "sofi_maze_v1";
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.SofiMazeQ) await loadScript("games/labirint-q.js?v=2");
    if (!window.SofiMaze3D) await loadScript("games/labirint3d.js?v=4");
  })().catch((e) => { libs = null; throw e; }));
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const data = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const who = () => G.session.name || "Mehmon";
  const prog = () => { const d = data(); const p = d[who()] || { open: 1, best: {} }; if (!p.ach) p.ach = []; return p; };
  const PRIZES = [["crystal", "💎", "Sehrli kristall"], ["crown", "👑", "Bilim toji"], ["cup", "🏆", "Oltin kubok"], ["star", "⭐", "Yulduz nishoni"], ["book", "📘", "Donolik kitobi"], ["key", "🗝️", "Oltin kalit"], ["orb", "🔮", "Sehrli shar"], ["medal", "🏅", "Zakovat medali"]];
  const TOUCH = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  /** Telefon tik tursa — o'yin oynasini 90° burib, doim yotiq ko'rsatamiz (snayperdagi kabi). */
  function applyRot() {
    if (!root) return;
    const g = root.querySelector("[data-game]");
    const want = TOUCH && !g.hidden && innerHeight > innerWidth;
    if (g.classList.contains("rot") !== want) { g.classList.toggle("rot", want); window.dispatchEvent(new Event("resize")); }
  }
  window.addEventListener("resize", () => setTimeout(applyRot, 50));
  window.addEventListener("orientationchange", () => setTimeout(applyRot, 250));
  const setProg = (p) => { const d = data(); d[who()] = p; save(d); };

  let root = null, engine = null;
  window.SofiMazeState = { get engine() { return engine; } };
  function shell() {
    if (root) return root;
    root = document.createElement("div");
    root.className = "lb-root";
    root.innerHTML = `<div class="lb-menu" data-menu></div><div class="lb-game" data-game hidden></div>`;
    document.body.appendChild(root);
    document.body.classList.add("lb-open");
    root.addEventListener("click", onClick);
    return root;
  }
  function close() {
    if (engine) { engine.destroy(); engine = null; }
    if (root) root.remove(); root = null;
    document.body.classList.remove("lb-open");
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  function drawMenu() {
    const p = prog(), N = 5;
    const m = root.querySelector("[data-menu]");
    m.innerHTML = `<div class="lb-mcard">
      <header><button class="lb-x" data-a="close" type="button">✕</button><span class="lb-logo">🧩</span>
        <div><h2>Bilim labirinti</h2><p>${esc(G.session.name || "Mehmon")} · ${esc(G.session.cls || "")}</p></div></header>
      <div class="lb-levels">${Array.from({ length: N }, (_, i) => {
        const lv = i + 1, open = lv <= p.open, b = p.best[lv];
        return `<button class="lb-lv ${open ? "" : "lock"} ${b ? "done" : ""}" data-lv="${lv}" type="button" ${open ? "" : "disabled"}>
          <b>${open ? lv : "🔒"}</b><small>${["6×6", "8×8", "10×10", "12×12", "14×14"][i]}</small><em>${b ? `⭐ ${b.score}` : open ? "ochiq" : "yopiq"}</em></button>`;
      }).join("")}</div>
      <div class="lb-ach"><b>🏆 Yutuqlarim · ${p.ach.length}/${PRIZES.length}</b><div class="lb-ach-grid">${PRIZES.map(([id, ic, nm]) => `<div class="${p.ach.includes(id) ? "on" : "off"}"><span>${ic}</span>${nm}</div>`).join("")}</div></div>
      <div class="lb-rules"><b>📜 Qanday o‘ynaladi</b><ul>
        <li>Siz tungi tosh labirintdasiz. Maqsad — binafsha <b>chiqish portali</b>ga yetish.</li>
        <li>Yo‘lda oldingizdan to‘satdan <b>sehrli darvoza</b> ko‘tariladi. Savolga javobni klaviaturada yozing — darvoza ochiladi.</li>
        <li>Xato javob 1 ❤️ oladi. 3 ta yurak tugasa, daraja qaytadan boshlanadi.</li>
        <li>Boshi berk yo‘laklarda 💰 <b>xazina sandiqlari</b> bor — qo‘shimcha ball!</li>
        <li>🗺️ Xarita yuqorida: siz yurgan joylar ochiladi, chiqish doim ko‘rinadi.</li>
        <li>✦ Oltin <b>sirli portal</b> sizni “Sirli bog‘”ga olib boradi — u yerda topshiriq bajarib yutuqlarni yig‘asiz.</li>
        <li>😱 Ba’zi darvozalar qo‘rqinchli, ✨ ba’zilari oltin va yoqimli — qo‘rqmang, bilim hammasidan kuchli!</li></ul></div>
    </div>`;
  }
  async function play(level) {
    const g = root.querySelector("[data-game]");
    g.hidden = false;
    applyRot();
    g.innerHTML = `<div class="lb-loading"><span>🧩</span><b>Labirint qurilmoqda...</b><i></i></div>`;
    try { await loadLibs(); } catch (e) { g.innerHTML = `<div class="lb-loading"><b>😕 Yuklab bo‘lmadi. Internetni tekshiring.</b></div>`; setTimeout(() => (g.hidden = true), 2000); return; }
    g.innerHTML = "";
    const grade = parseInt(G.session.cls) || 6;
    engine = window.SofiMaze3D.create(g, {
      level, grade, owned: prog().ach,
      onAchieve: (prize) => { const p = prog(); if (!p.ach.includes(prize.id)) p.ach.push(prize.id); setProg(p); },
      onExit: () => { engine = null; g.hidden = true; g.innerHTML = ""; g.classList.remove("rot"); try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) {} drawMenu(); try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} },
      onWin: (next) => { engine = null; g.innerHTML = ""; play(Math.min(5, next)); },
      onResult: (r) => {
        const p = prog(), prev = p.best[r.level];
        const best = !prev || r.score > prev.score;
        if (best) p.best[r.level] = { score: r.score, secs: r.secs };
        p.open = Math.max(p.open, Math.min(5, r.level + 1));
        setProg(p);
        return { best: best && !!prev, prev: prev ? prev.score : 0 };
      },
    });
  }
  function onClick(e) {
    const a = e.target.closest("[data-a]"), lv = e.target.closest("[data-lv]");
    if (a && a.dataset.a === "close") close();
    if (lv && !lv.disabled) play(Number(lv.dataset.lv));
  }
  async function open(direct) {
    if (!G.session.name && !(await api.askName())) return;
    shell(); drawMenu();
    loadLibs().catch(() => {});
    if (direct) play(prog().open);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lb]");
    if (!b) return;
    if (b.dataset.lb === "play") open(true);
    if (b.dataset.lb === "levels") open(false);
  });
})();
