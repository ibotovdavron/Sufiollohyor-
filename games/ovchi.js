/* OVCHI — o'yinlar sahifasidagi kirish: ov ruxsatnomasi (sinf testi), saqlash va 3D o'yinni ochish. */
(() => {
  "use strict";
  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const KEY = "sofi_ovchi_v1";
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null, testLibs = null;
  const loadTest = () => testLibs || (testLibs = (async () => {
    if (!window.SofiOvchiBank) await loadScript("games/ovchi-bank.js?v=1");
    if (!window.SofiOvchiPlan) await loadScript("games/ovchi-plan.js?v=1");
    if (!window.SofiOvchiTest) await loadScript("games/ovchi-test.js?v=1");
  })().catch((e) => { testLibs = null; throw e; }));
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.THREE.GLTFLoader) await loadScript("lib/GLTFLoader.js?v=1");
    if (!window.THREE.SkeletonUtils) await loadScript("lib/SkeletonUtils.js?v=1");
    if (!window.SofiFarm3D) await loadScript("games/ferma3d.js?v=6");
    if (!window.SofiOvchiRelief) await loadScript("games/ovchi-relief.js?v=1");
    if (!window.SofiOvchiVillage) await loadScript("games/ovchi-village.js?v=2");
    const V = window.SofiOvchiVillage;
    if (V && !V.mask) await new Promise((res) => { const im = new Image(); im.onload = () => { try { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d"); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data, m = new Uint8Array(c.width * c.height); for (let i = 0; i < m.length; i++) m[i] = d[i * 4]; V.img = im; V.mask = m; V.mw = c.width; V.mh = c.height; } catch (e) {} res(); }; im.onerror = () => res(); im.src = V.roads.src; });
    if (!window.SofiOvchi3D) await loadScript("games/ovchi3d.js?v=7");
  })().catch((e) => { libs = null; throw e; }));

  const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const who = () => G.session.name || "Mehmon";
  const DEF = () => ({ money: 0, owned: ["revolver"], cur: "revolver", ammo: 30, bag: [], bagCap: 3, med: 1, kills: {}, earned: 0 });
  const load = () => Object.assign(DEF(), all()[who()] || {});
  const store = (s) => { try { const d = all(); d[who()] = s; localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };

  const TOUCH = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  let root = null, engine = null;
  function applyRot() {
    if (!root) return;
    const g = root.querySelector("[data-game]");
    const want = TOUCH && !g.hidden && innerHeight > innerWidth;
    if (g.classList.contains("rot") !== want) { g.classList.toggle("rot", want); window.dispatchEvent(new Event("resize")); }
  }
  window.addEventListener("resize", () => setTimeout(applyRot, 50));
  window.addEventListener("orientationchange", () => setTimeout(applyRot, 250));

  function shell() {
    if (root) return root;
    root = document.createElement("div");
    root.className = "ov-root";
    root.innerHTML = `<div class="ov-menu" data-menu></div><div class="ov-game" data-game hidden></div>`;
    document.body.appendChild(root);
    document.body.classList.add("ov-open");
    return root;
  }
  function close() {
    if (engine) { engine.destroy(); engine = null; }
    leaveAll();
    if (root) root.remove(); root = null;
    document.body.classList.remove("ov-open");
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  const teacher = () => G.session.role === "teacher" || G.session.role === "admin";

  /* ---------- Do'stlar bilan ov: xonalar (4 kishigacha) ---------- */
  const MAXP = 4;
  const R = { lobby: null, rooms: [], room: null, code: null, at: 0, list: [] };
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const code5 = () => Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[(Math.random() * 32) | 0]).join("");
  const lobbyMeta = () => ({ cid: G.session.cid, name: who(), room: R.code ? { code: R.code, n: R.list.length || 1 } : null });
  async function joinLobby() {
    if (R.lobby) return;
    await window.SofiNet.init();
    try {
      R.lobby = await window.SofiNet.join("ov-lobby", { meta: lobbyMeta(), onPresence: (list) => {
        const m = new Map(); list.forEach((x) => { if (x && x.room && x.room.code) { const r = m.get(x.room.code) || { code: x.room.code, n: 0, names: [] }; r.n++; r.names.push(x.name); m.set(x.room.code, r); } });
        R.rooms = [...m.values()]; if (!R.code && root && root.querySelector("[data-lobby]")) drawLobby();
      } });
    } catch (e) { R.lobby = null; }
  }
  async function leaveAll() {
    if (R.room) { try { R.room.send({ t: "bye", c: G.session.cid }); R.room.leave(); } catch (e) {} }
    if (R.lobby) { try { R.lobby.leave(); } catch (e) {} }
    R.room = null; R.lobby = null; R.code = null; R.list = [];
  }
  function drawMode() {
    const m = root.querySelector("[data-menu]");
    m.innerHTML = `<div class="ov-tcard ov-mode"><span class="ov-tbig">🏹</span><h2>Ovga chiqish</h2><p>${esc(who())} — ruxsatnoma bor ✅</p>
      <div class="ov-modes"><button type="button" data-m="solo"><span>🧍</span><b>Yolg‘iz ov</b><small>O‘zingiz, o‘z sur’atingizda</small></button>
      <button type="button" data-m="team"><span>👥</span><b>Do‘stlar bilan</b><small>2–4 kishi birga ov qiladi</small></button></div>
      <div class="ov-trow"><button class="ov-tbtn ghost" data-m="exit" type="button">🚪 Chiqish</button></div></div>`;
  }
  function drawLobby() {
    const m = root.querySelector("[data-menu]");
    const local = window.SofiNet.kind !== "online";
    m.innerHTML = `<div class="ov-tcard ov-lobby" data-lobby><span class="ov-tbig">👥</span><h2>Do‘stlar bilan ov</h2>
      <p>Xona oching va kodni do‘stlaringizga ayting yoki ochiq xonaga qo‘shiling. Bir xonada <b>${MAXP} kishigacha</b>.</p>
      ${local ? `<p class="ov-warnl">⚠️ Internet aloqasi yo‘q — faqat shu qurilmadagi oynalar ko‘rinadi.</p>` : ""}
      <div class="ov-rooms">${R.rooms.length ? R.rooms.map((r) => `<button type="button" data-join="${esc(r.code)}" ${r.n >= MAXP ? "disabled" : ""}><b>🔑 ${esc(r.code)}</b><span>${r.names.slice(0, 4).map(esc).join(", ")}</span><em>${r.n}/${MAXP}</em></button>`).join("") : `<small class="ov-none">Hozircha ochiq xona yo‘q — birinchi bo‘lib oching!</small>`}</div>
      <div class="ov-code"><input data-code maxlength="5" placeholder="Xona kodi" autocomplete="off"><button class="ov-tbtn ghost" data-m="code" type="button">Kirish</button></div>
      <div class="ov-trow"><button class="ov-tbtn" data-m="create" type="button">➕ Xona ochish</button><button class="ov-tbtn ghost" data-m="back" type="button">← Orqaga</button></div></div>`;
  }
  async function enterRoom(code) {
    code = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    if (code.length !== 5) { api.toast("Kod 5 ta belgidan iborat."); return; }
    await window.SofiNet.init();
    R.code = code; R.at = Date.now();
    const meta = { cid: G.session.cid, name: who(), at: R.at };
    try {
      R.room = await window.SofiNet.join("ov-r-" + code, { meta,
        onMsg: (msg) => engine && engine.netMsg && engine.netMsg(msg),
        onPresence: (list) => {
          R.list = list.filter((x) => x && x.cid);
          const sorted = [...R.list].sort((a, b) => (a.at || 0) - (b.at || 0));
          if (sorted.length > MAXP && sorted.findIndex((x) => x.cid === G.session.cid) >= MAXP) { api.toast(`Xona to‘la (${MAXP} kishi).`, "bad"); if (engine) engine.destroy(); engine = null; leaveAll().then(() => { if (root) { root.querySelector("[data-game]").hidden = true; joinLobby().then(drawLobby); } }); return; }
          if (engine && engine.setPeers) engine.setPeers(R.list);
          if (R.lobby) R.lobby.track(lobbyMeta());
        } });
      if (R.lobby) R.lobby.track(lobbyMeta());
    } catch (e) { R.code = null; api.toast("Xonaga ulanib bo‘lmadi.", "bad"); return; }
    play();
  }

  async function play() {
    const g = root.querySelector("[data-game]");
    root.querySelector("[data-menu]").innerHTML = "";
    g.hidden = false; applyRot();
    try { if (TOUCH && document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch (e) {}
    g.innerHTML = `<div class="ov-loading"><span>🏹</span><b>Ov maydoni tayyorlanmoqda…</b><i></i></div>`;
    try { await loadLibs(); } catch (e) { g.innerHTML = `<div class="ov-loading"><b>😕 Yuklab bo‘lmadi. Internetni tekshiring.</b></div>`; setTimeout(close, 2200); return; }
    if (!root) return;
    g.innerHTML = "";
    const save = load();
    const net = R.room ? { cid: G.session.cid, name: who(), code: R.code, send: (m) => R.room && R.room.send(m) } : null;
    engine = window.SofiOvchi3D.create(g, {
      save, net,
      onSave: (s) => store(s),
      onExit: () => { engine = null; close(); },
    });
    if (net) engine.setPeers(R.list);
  }
  function onMenuClick(e) {
    const b = e.target.closest("[data-m],[data-join]"); if (!b || !root) return;
    if (b.dataset.join) return enterRoom(b.dataset.join);
    const k = b.dataset.m;
    if (k === "solo") play();
    else if (k === "team") { drawLobby(); joinLobby().then(() => root && !R.code && drawLobby()); }
    else if (k === "create") enterRoom(code5());
    else if (k === "code") enterRoom((root.querySelector("[data-code]") || {}).value);
    else if (k === "back") drawMode();
    else if (k === "exit") close();
  }

  async function open() {
    if (!G.session.name && !(await api.askName())) return;
    shell();
    root.addEventListener("click", onMenuClick);
    const m = root.querySelector("[data-menu]");
    loadLibs().catch(() => {});
    if (teacher()) return drawMode();
    m.innerHTML = `<div class="ov-loading"><span>🎯</span><b>Test tayyorlanmoqda…</b><i></i></div>`;
    try { await loadTest(); } catch (e) { m.innerHTML = `<div class="ov-loading"><b>😕 Yuklab bo‘lmadi.</b></div>`; setTimeout(close, 2000); return; }
    const T = window.SofiOvchiTest;
    if (T.hasLicense(who())) return drawMode();
    m.innerHTML = "";
    const person = { name: who(), cls: parseInt(G.session.cls) ? G.session.cls : "6-sinf" };
    const ok = await T.run(m, person);
    if (!root) return;
    if (ok) drawMode(); else close();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ov]");
    if (b && b.dataset.ov === "play") open();
  });
  window.SofiOvchi = { open, close, get engine() { return engine; } };
})();
