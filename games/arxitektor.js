/* ARXITEKTOR 3D — bolalar devor, deraza, eshik, mebel va hovli jihozlaridan uy quradi.
   Boshqalar mehmonga kelib, uyni ichidan yurib ko'radi va "yoqdi" bosadi. */
(() => {
  "use strict";
  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const isGuest = (p) => !!p && (p.role === "guest" || p.cls === "Mehmon");
  const MAX_PIECES = 700;

  // ---------- Kutubxonalar ----------
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.SofiArch3D) await loadScript("games/arxitektor3d.js?v=1");
  })().catch((e) => { libs = null; throw e; }));
  const sfx = {
    put() { api.beep(420, 0.05, "triangle", 0.05); setTimeout(() => api.beep(300, 0.05, "triangle", 0.04), 45); },
    del() { api.beep(220, 0.08, "sawtooth", 0.025); },
    tap() { api.beep(900, 0.03, "sine", 0.03); },
    bad() { api.beep(160, 0.12, "square", 0.02); },
    like() { [660, 880, 1175].forEach((f, i) => setTimeout(() => api.beep(f, 0.1, "triangle", 0.05), i * 80)); }
  };

  // =========================================================
  // SAQLASH: shu qurilma + Supabase (arch_builds)
  // =========================================================
  const LKEY = "sofi_arch_v1:";
  const db = () => window.SofiNet && window.SofiNet.db;
  const lget = (n) => { try { return JSON.parse(localStorage.getItem(LKEY + n)); } catch (e) { return null; } };
  const lset = (s) => { try { localStorage.setItem(LKEY + s.name, JSON.stringify(s)); } catch (e) { api.toast("Qurilmada joy yetmadi.", "bad"); } };
  // Ixcham saqlash: [t, x, z, l, r, c]
  const pack = (list) => list.map((p) => [p.t, p.x, p.z, p.l, p.r, p.c]);
  const unpack = (arr) => (arr || []).map((a, i) => ({ id: "p" + (i + 1), t: a[0], x: a[1], z: a[2], l: a[3] || 0, r: a[4] || 0, c: a[5] ?? -1 }));
  async function loadBuild(name, guest) {
    let st = lget(name);
    const d = db();
    if (d && !guest) {
      try {
        const { data, error } = await d.from("arch_builds").select("state,likes").eq("name", name).maybeSingle();
        if (!error && data && data.state && (!st || (data.state.updated || 0) > (st.updated || 0))) st = { ...data.state, likes: data.likes };
        else if (!error && data && st) st.likes = data.likes;
      } catch (e) { /* mahalliy */ }
    }
    return st;
  }
  let saveTimer = 0;
  function save(st, now) {
    st.updated = Date.now();
    lset(st);
    if (isGuest(st)) return;
    clearTimeout(saveTimer);
    const run = async () => {
      const d = db();
      if (!d) return;
      try {
        const { error } = await d.rpc("arch_save", { p_name: st.name, p_cls: st.cls || "", p_state: { v: 1, name: st.name, cls: st.cls, title: st.title || "", items: st.items, updated: st.updated }, p_pieces: st.items.length });
        if (error) console.warn("arch_save:", error.message);
      } catch (e) { console.warn("arch_save:", e); }
    };
    if (now) run(); else saveTimer = setTimeout(run, 1500);
  }
  async function listBuilds() {
    const d = db();
    if (d) {
      try {
        const { data, error } = await d.from("arch_builds").select("name,cls,pieces,likes,title,updated_at").gt("pieces", 0).order("likes", { ascending: false }).order("pieces", { ascending: false }).limit(80);
        if (!error && data) return data;
      } catch (e) { /* mahalliy */ }
    }
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(LKEY)) continue;
      try { const s = JSON.parse(localStorage.getItem(k)); if (s.items && s.items.length) out.push({ name: s.name, cls: s.cls, pieces: s.items.length, likes: (s.likedBy || []).length, title: s.title || "" }); } catch (e) { /* buzuq */ }
    }
    return out.sort((a, b) => b.likes - a.likes || b.pieces - a.pieces);
  }
  async function like(owner, me) {
    const d = db();
    if (d) {
      try { const { data, error } = await d.rpc("arch_like", { p_owner: owner, p_liker: me }); if (!error) return data; } catch (e) { /* mahalliy */ }
    }
    const s = lget(owner);
    if (!s) return null;
    s.likedBy = s.likedBy || [];
    if (!s.likedBy.includes(me)) s.likedBy.push(me);
    lset(s);
    return s.likedBy.length;
  }

  // ---------- Namuna uy ----------
  function templateHouse() {
    const L = [];
    const w = (t, x, z, r) => L.push({ t, x, z, l: 0, r, c: -1 });
    const x0 = -4, x1 = 4, z0 = -3, z1 = 3;
    for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) L.push({ t: x < 0 ? "pol_parket" : "pol_plitka", x, z, l: 0, r: 0, c: -1 });
    for (let x = x0; x < x1; x++) { w(x === -1 ? "eshik_kirish" : x === -3 || x === 2 ? "deraza_gisht" : "devor_gisht", x, z1, 0); w(x === 1 || x === -2 ? "deraza_gisht" : "devor_gisht", x, z0, 0); }
    for (let z = z0; z < z1; z++) { w(z === 0 ? "deraza_gisht" : "devor_gisht", x0, z, 1); w(z === -1 ? "deraza_gisht" : "devor_gisht", x1, z, 1); }
    for (let z = z0; z < z1; z++) w(z === 1 ? "eshik" : "devor_suvoq", 0, z, 1);
    for (let x = x0 - 1; x <= x1; x++) for (let z = z0 - 1; z <= z1; z++) L.push({ t: "qiya_tom", x, z, l: 0, r: 0, c: -1 });
    const o = (t, x, z, r = 0) => L.push({ t, x, z, l: 0, r, c: -1 });
    o("divan", -3, -3, 0); o("gilam", -3, -1, 0); o("tv", -3, 2, 2); o("lampa", -4 + 3, -3); o("gul", -4, 2); o("kreslo", -1, 0, 1);
    o("oshxona", 3, -3, 0); o("plita", 2, -3, 0); o("muzlatgich", 1, -3, 0); o("stol", 1, 0, 0); o("stul", 1, 1, 2); o("stul", 2, 1, 2); o("stul", 1, -1, 0); o("stul", 2, -1, 0);
    for (let x = -1; x < 1; x++) for (let z = 3; z < 9; z++) L.push({ t: "yolak", x, z, l: 0, r: 0, c: -1 });
    o("daraxt", -6, 6); o("olma", 5, 6); o("archa", -8, -5); o("gulzor", 1, 4); o("gulzor", -2, 4); o("sori", 3, 7, 0); o("tandir", -5, 8); o("fonar", 1, 8); o("buta", -3, 5); o("buta", 3, 4);
    for (let x = -10; x < 10; x++) { if (x === -1 || x === 0) continue; L.push({ t: "panjara", x, z: 10, l: 0, r: 0, c: -1 }); }
    L.push({ t: "darvoza", x: -1, z: 10, l: 0, r: 0, c: -1 }); L.push({ t: "darvoza", x: 0, z: 10, l: 0, r: 0, c: -1 });
    return L;
  }

  // =========================================================
  // KARTA
  // =========================================================
  async function drawCard() {
    const box = $("#arTop");
    if (!box) return;
    const list = (await listBuilds()).filter((b) => !/^Mehmon /.test(b.name)).slice(0, 5);
    box.innerHTML = `<div class="ar-top-head">🏆 Eng chiroyli uylar</div>` + (list.length
      ? list.map((b, i) => `<div class="ar-top-row"><span>${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(b.name)}</b><em>👍 ${b.likes || 0}</em></div>`).join("")
      : `<p class="ar-top-empty">Hali uylar qurilmagan — birinchi arxitektor bo‘ling!</p>`);
  }
  setTimeout(drawCard, 700);
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-ar]");
    if (!b) return;
    const what = b.dataset.ar;
    if (what === "visit") { openApp(G.session.name ? G.session : null, "visit"); return; }
    if (what === "rating") { openApp(G.session.name ? G.session : null, "rating"); return; }
    if (!G.session.name && !(await api.askName())) return;
    openApp(G.session, null);
  });

  // =========================================================
  // OYNA
  // =========================================================
  let root = null, scene = null, st = null, viewing = null, cleanups = [];
  let mode = "view", cat = "qurilish", tool = null, level = 0, roofs = true, night = false, selected = null, undo = [], seq = 0, prevMode = "build";

  function shell() {
    root = document.createElement("div");
    root.className = "ar";
    root.innerHTML = `
      <header class="ar-bar">
        <button class="ar-exit" type="button">← Chiqish</button>
        <div class="ar-brand"><span>🏗️</span><b>ARXITEKTOR</b><em>3D</em></div>
        <div class="ar-bar-r" id="arBarR"></div>
        <button class="ar-ico" type="button" id="arNight" title="Kun / tun">🌙</button>
      </header>
      <div class="ar-world" id="arWorld">
        <div class="ar-loading" id="arLoading"><div class="ar-load-art"><i></i><i></i><i></i><i></i></div><b>Qurilish maydoni tayyorlanmoqda…</b></div>
        <div class="ar-tools" id="arTools"></div>
        <div class="ar-levels" id="arLevels"></div>
        <div class="ar-hint" id="arHint" hidden></div>
        <div class="ar-sel" id="arSel" hidden></div>
        <div class="ar-visit" id="arVisit" hidden></div>
        <div class="ar-walk" id="arWalk" hidden>
          <div class="ar-pad">
            <button type="button" data-w="f">▲</button><button type="button" data-w="l">◀</button><button type="button" data-w="b">▼</button><button type="button" data-w="r">▶</button>
          </div>
          <button type="button" class="ar-btn" id="arWalkExit">✕ Yurishni tugatish</button>
          <p>Sudrab atrofga qarang · W A S D yoki tugmalar bilan yuring</p>
        </div>
      </div>
      <section class="ar-panel" id="arPanel"></section>
      <section class="ar-sheet" id="arSheet" hidden><button class="ar-sheet-x" type="button" aria-label="Yopish">✕</button><div class="ar-sheet-in" id="arSheetIn"></div></section>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "ar-open");
    requestAnimationFrame(() => root && root.classList.add("show"));
    $(".ar-exit", root).onclick = close;
    $(".ar-sheet-x", root).onclick = closeSheet;
    $("#arNight", root).onclick = () => { night = !night; scene && scene.setNight(night); $("#arNight", root).textContent = night ? "☀️" : "🌙"; };
    $("#arWalkExit", root).onclick = () => setMode(prevMode);
    $$("[data-w]", root).forEach((b) => {
      const dir = { f: [1, 0], b: [-1, 0], l: [0, -1], r: [0, 1] }[b.dataset.w];
      const on = (e) => { e.preventDefault(); scene && scene.walkInput(dir[0], dir[1]); b.classList.add("on"); };
      const off = () => { scene && scene.walkInput(0, 0); b.classList.remove("on"); };
      b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off); b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
    });
    const key = (e) => {
      if (!root || mode === "walk" || /INPUT|TEXTAREA/.test((e.target.tagName || ""))) return;
      if (e.key === "r" || e.key === "R") rotate();
      else if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); doUndo(); }
      else if (e.key === "Delete" && selected) delSelected();
      else if (e.key === "Escape") { if (!$("#arSheet", root).hidden) closeSheet(); else setTool(null); }
    };
    document.addEventListener("keydown", key);
    cleanups.push(() => document.removeEventListener("keydown", key));
  }
  function close() {
    if (st && !viewing) save(st, true);
    cleanups.forEach((f) => { try { f(); } catch (e) { /* bo'sh */ } }); cleanups = [];
    if (scene) { try { scene.destroy(); } catch (e) { /* bo'sh */ } }
    scene = null; st = null; viewing = null; selected = null; tool = null; undo = [];
    if (root) root.remove();
    root = null;
    document.body.classList.remove("g-playing", "ar-open");
    drawCard();
  }

  async function openApp(me, first) {
    if (root) close();
    shell();
    try { await loadLibs(); } catch (e) { $("#arLoading", root).innerHTML = "<b>❌ Fayllar yuklanmadi. Internetni tekshiring.</b>"; return; }
    if (!root) return;
    try {
      scene = new window.SofiArch3D($("#arWorld", root), {
        onPlace: place, onPick: pick, onErase: erase, onMiss: () => select(null),
        onBlocked: () => { sfx.bad(); hint("Bu joy band yoki maydondan tashqarida", 1400); }
      });
    } catch (e) {
      $("#arLoading", root).innerHTML = "<b>😔 Qurilmangiz 3D grafikani qo‘llamaydi (WebGL).</b>";
      return;
    }
    $("#arLoading", root).remove();
    level = 0; scene.setLevel(0);
    if (!me) { mode = "view"; drawAll(); panel(first || "visit"); return; }
    let s = await loadBuild(me.name, isGuest(me));
    if (!root) return;
    if (!s) s = { v: 1, name: me.name, cls: me.cls || "", items: [], updated: 0, title: "" };
    s.cls = me.cls || s.cls;
    st = s;
    const list = unpack(st.items);
    seq = list.length;
    scene.setPieces(list);
    st.list = list;
    setMode("build");
    if (!list.length) { setTimeout(() => panel("welcome"), 300); }
    else scene.focusAll();
    if (first) panel(first);
  }

  // ---------- Holat ----------
  const items = () => (viewing ? viewing.list : st ? st.list : []);
  function commit() {
    st.items = pack(st.list);
    save(st);
    drawBar();
  }
  function pushUndo() { undo.push(JSON.stringify(st.list)); if (undo.length > 40) undo.shift(); }
  function doUndo() {
    if (!st || viewing || !undo.length) return;
    st.list = JSON.parse(undo.pop());
    scene.setPieces(st.list);
    select(null); commit(); sfx.tap();
    hint("↶ Bekor qilindi", 900);
  }
  function place(rec) {
    if (!st || viewing) return;
    if (st.list.length >= MAX_PIECES) { api.toast(`Ko‘pi bilan ${MAX_PIECES} ta jihoz qo‘yish mumkin.`, "bad"); return; }
    pushUndo();
    const r = { ...rec, id: "p" + (++seq) };
    st.list.push(r);
    scene.add(r);
    sfx.put(); commit();
    if (movingFrom) { movingFrom = null; setTool(null); setMode("select"); select(r.id); }
  }
  function erase(id) {
    if (!st || viewing) return;
    pushUndo();
    st.list = st.list.filter((p) => p.id !== id);
    scene.remove(id);
    if (selected === id) select(null);
    sfx.del(); commit();
  }
  function pick(id) {
    if (viewing) { const p = viewing.list.find((x) => x.id === id); if (p) hint(`${window.SofiArch3D.BY_ID[p.t].icon} ${window.SofiArch3D.BY_ID[p.t].name}`, 1200); return; }
    if (mode === "select") select(id);
  }
  function select(id) {
    selected = id;
    if (scene) scene.highlight(id);
    drawSel();
  }
  function delSelected() { if (selected) erase(selected); }
  let movingFrom = null;

  // ---------- Rejim va asbob ----------
  function setMode(m) {
    if (m === "walk" && mode !== "walk") prevMode = mode;
    mode = m;
    if (m !== "select") select(null);
    if (scene) { scene.setMode(m); if (m === "build" && tool) scene.setTool(tool.t, tool.r, tool.c); }
    if (m === "walk") { api.toast("🚶 Uy ichida yuring! Sudrab atrofga qarang.", "good"); }
    drawAll();
  }
  function setTool(t) {
    tool = t ? { t, r: tool && tool.t === t ? tool.r : 0, c: tool && tool.t === t ? tool.c : -1 } : null;
    if (scene) scene.setTool(tool && tool.t, tool && tool.r, tool && tool.c);
    if (t && mode !== "build") setMode("build"); else drawAll();
    if (t) { const it = window.SofiArch3D.BY_ID[t]; hint(it.autoRoof ? "🔺 Tom kataklarini belgilang — tom o‘zi qiya bo‘lib yig‘iladi (devordan 1 katak chiqarib qo‘ysangiz, chiroyli bo‘ladi)" : `${it.icon} ${it.name} — qo‘yish uchun joyni bosing${it.layer === "wall" ? " (katak chizig‘iga)" : ""}`, it.autoRoof ? 3500 : 2200); }
  }
  function rotate() {
    if (mode === "build" && tool && scene) { tool.r = scene.rotateTool(); sfx.tap(); return; }
    if (mode === "select" && selected) {
      const p = st.list.find((x) => x.id === selected);
      if (!p) return;
      const it = window.SofiArch3D.BY_ID[p.t];
      for (let k = 1; k <= 3; k++) {
        const n = { ...p, r: (p.r + k) % 4 };
        if (scene.canPlace(n, p.id)) { pushUndo(); Object.assign(p, n); scene.update(p); scene.highlight(p.id); sfx.tap(); commit(); return; }
        if (it.layer === "wall") break;
      }
      sfx.bad(); hint("Burish uchun joy yetmaydi", 1200);
    }
  }
  function paint(c) {
    if (mode === "build" && tool) { tool.c = c; scene.setTool(tool.t, tool.r, c); drawPanel(); return; }
    if (selected) {
      const p = st.list.find((x) => x.id === selected);
      if (!p) return;
      pushUndo(); p.c = c; scene.update(p); scene.highlight(p.id); commit(); drawSel();
    }
  }
  function hint(text, ms) {
    const h = $("#arHint", root);
    if (!h) return;
    h.hidden = false; h.textContent = text;
    clearTimeout(hint.t); hint.t = setTimeout(() => { if (h) h.hidden = true; }, ms || 1600);
  }

  // ---------- Chizish ----------
  function drawAll() { drawBar(); drawTools(); drawLevels(); drawPanel(); drawSel(); drawVisit(); $("#arWalk", root).hidden = mode !== "walk"; root.dataset.mode = mode; }
  function drawBar() {
    const r = $("#arBarR", root);
    if (!r) return;
    if (viewing) r.innerHTML = `<span class="ar-chip">🏡 ${esc(short(viewing.name))}ning uyi</span>`;
    else if (st) r.innerHTML = `<span class="ar-chip">🧱 ${st.list.length}</span>${isGuest(st) ? `<span class="ar-chip">👤 mehmon</span>` : `<span class="ar-chip">👍 ${st.likes || 0}</span>`}`;
    else r.innerHTML = "";
  }
  function drawTools() {
    const box = $("#arTools", root);
    if (!box) return;
    if (mode === "walk") { box.innerHTML = ""; return; }
    const b = (id, ico, label, on, dis) => `<button type="button" class="ar-tool ${on ? "on" : ""}" data-t="${id}" ${dis ? "disabled" : ""} title="${esc(label)}"><span>${ico}</span><b>${esc(label)}</b></button>`;
    box.innerHTML = viewing || !st
      ? b("walk", "🚶", "Ichida yurish") + b("focus", "🎯", "Ko‘rinish") + b("visit", "🏡", "Mehmonga") + b("rating", "🏆", "Reyting")
      : b("build", "🧱", "Qurish", mode === "build") + b("select", "👆", "Tanlash", mode === "select") + b("erase", "🧽", "O‘chirish", mode === "erase") +
        b("rotate", "🔄", "Burish", false, !(tool || selected)) + b("undo", "↶", "Bekor", false, !undo.length) + b("roof", roofs ? "🏠" : "🏚️", roofs ? "Tom bor" : "Tomsiz") +
        b("walk", "🚶", "Ichida yurish") + b("more", "☰", "Yana");
    $$("[data-t]", box).forEach((x) => (x.onclick = () => {
      const t = x.dataset.t;
      if (t === "build" || t === "select" || t === "erase") setMode(t);
      else if (t === "rotate") rotate();
      else if (t === "undo") doUndo();
      else if (t === "roof") { roofs = !roofs; scene.setRoofs(roofs); drawTools(); }
      else if (t === "walk") setMode("walk");
      else if (t === "focus") scene.focusAll();
      else panel(t);
    }));
  }
  function drawLevels() {
    const box = $("#arLevels", root);
    if (!box) return;
    if (viewing || !st || mode === "walk") { box.innerHTML = ""; return; }
    box.innerHTML = `<span>Qavat</span>` + [2, 1, 0].map((l) => `<button type="button" class="${l === level ? "on" : ""}" data-l="${l}">${l + 1}</button>`).join("");
    $$("[data-l]", box).forEach((x) => (x.onclick = () => { level = +x.dataset.l; scene.setLevel(level); sfx.tap(); drawLevels(); hint(`${level + 1}-qavat${level ? " — pol va devorlar pastki devorlar ustiga qo‘yiladi" : ""}`, 1600); }));
  }
  function drawPanel() {
    const box = $("#arPanel", root);
    if (!box) return;
    if (viewing || !st || mode !== "build") { box.hidden = true; return; }
    box.hidden = false;
    const A = window.SofiArch3D;
    const it = tool && A.BY_ID[tool.t];
    box.innerHTML = `
      <div class="ar-cats">${A.CATEGORIES.map((c) => `<button type="button" class="${c.id === cat ? "on" : ""}" data-cat="${c.id}">${c.icon} ${esc(c.name)}</button>`).join("")}
        ${it && it.paint !== undefined ? `<div class="ar-pal">${A.PALETTE.map((p, i) => `<button type="button" class="${(tool.c < 0 ? it.paint : tool.c) === i ? "on" : ""}" data-c="${i}" style="background:#${p.toString(16).padStart(6, "0")}" aria-label="Rang ${i + 1}"></button>`).join("")}</div>` : ""}
      </div>
      <div class="ar-items">${A.CATALOG.filter((c) => c.cat === cat).map((c) => `<button type="button" class="ar-item ${tool && tool.t === c.id ? "on" : ""}" data-it="${c.id}"><span>${c.icon}</span><b>${esc(c.name)}</b></button>`).join("")}</div>`;
    $$("[data-cat]", box).forEach((x) => (x.onclick = () => { cat = x.dataset.cat; drawPanel(); }));
    $$("[data-it]", box).forEach((x) => (x.onclick = () => { sfx.tap(); setTool(tool && tool.t === x.dataset.it ? null : x.dataset.it); }));
    $$("[data-c]", box).forEach((x) => (x.onclick = () => paint(+x.dataset.c)));
  }
  function drawSel() {
    const box = $("#arSel", root);
    if (!box) return;
    const p = selected && st && st.list.find((x) => x.id === selected);
    if (!p || mode !== "select") { box.hidden = true; return; }
    const A = window.SofiArch3D, it = A.BY_ID[p.t];
    box.hidden = false;
    box.innerHTML = `<div class="ar-sel-h"><span>${it.icon}</span><b>${esc(it.name)}</b><small>${p.l + 1}-qavat</small></div>
      ${it.paint !== undefined ? `<div class="ar-pal">${A.PALETTE.map((c, i) => `<button type="button" class="${(p.c < 0 ? it.paint : p.c) === i ? "on" : ""}" data-c="${i}" style="background:#${c.toString(16).padStart(6, "0")}"></button>`).join("")}</div>` : ""}
      <div class="ar-row"><button type="button" class="ar-btn" data-s="rot">🔄 Burish</button><button type="button" class="ar-btn" data-s="move">✋ Ko‘chirish</button><button type="button" class="ar-btn" data-s="copy">➕ Yana</button><button type="button" class="ar-btn danger" data-s="del">🗑️</button></div>`;
    $$("[data-c]", box).forEach((x) => (x.onclick = () => paint(+x.dataset.c)));
    $$("[data-s]", box).forEach((x) => (x.onclick = () => {
      const a = x.dataset.s;
      if (a === "rot") rotate();
      else if (a === "del") delSelected();
      else {
        if (a === "move") { erase(p.id); movingFrom = p.id; }
        tool = { t: p.t, r: p.r, c: p.c };
        setMode("build"); scene.setTool(tool.t, tool.r, tool.c); cat = it.cat; drawPanel();
        hint(a === "move" ? "Yangi joyni bosing" : "Yana qo‘yish uchun joyni bosing", 1800);
      }
    }));
  }
  function drawVisit() {
    const v = $("#arVisit", root);
    if (!v) return;
    if (!viewing || mode === "walk") { v.hidden = true; return; }
    const mine = G.session.name;
    const can = mine && !isGuest(G.session) && mine !== viewing.name;
    const liked = (viewing.likedBy || []).includes(mine) || viewing._liked;
    v.hidden = false;
    v.innerHTML = `<div class="ar-visit-in"><span class="av">${esc((short(viewing.name) || "?")[0])}</span>
      <span class="t"><b>${esc(viewing.title || short(viewing.name) + "ning uyi")}</b><small>${esc(viewing.name)} · ${esc(viewing.cls || "")} · ${viewing.list.length} ta jihoz</small></span>
      <button type="button" class="ar-btn like ${liked ? "on" : ""}" data-like ${!can || liked ? "disabled" : ""}>👍 ${viewing.likes || 0}</button>
      ${st ? `<button type="button" class="ar-btn" data-home>🏠 Uyimga</button>` : ""}</div>`;
    const lb = $("[data-like]", v);
    if (lb) lb.onclick = async () => {
      lb.disabled = true;
      const n = await like(viewing.name, mine);
      if (n !== null && n !== undefined) { viewing.likes = n; viewing._liked = true; sfx.like(); api.toast("👍 Yoqdi! Rahmat!", "good"); drawVisit(); drawCard(); }
    };
    const hb = $("[data-home]", v);
    if (hb) hb.onclick = backHome;
  }

  // ---------- Pastki oyna ----------
  let sheetKey = null;
  function openSheet(key, html) {
    sheetKey = key;
    const s = $("#arSheet", root);
    s.hidden = false; $("#arSheetIn", root).innerHTML = html;
  }
  function closeSheet() { const s = root && $("#arSheet", root); if (s) s.hidden = true; sheetKey = null; }
  async function panel(name) {
    if (name === "welcome") {
      openSheet(name, `<div class="ar-welcome"><div class="ar-big">🏗️</div><h2>Xush kelibsiz, arxitektor ${esc(short(st.name))}!</h2>
        <p>30×30 metrli yer maydoni sizniki. Devor, deraza, eshik, mebel va hovli jihozlaridan orzuingizdagi uyni quring!</p>
        <div class="ar-steps">
          <div><b>1</b><span>Pastdan jihozni tanlang (🧱 Qurilish, 🛋️ Mebel, 🌳 Hovli).</span></div>
          <div><b>2</b><span>Maydonga bosing — jihoz o‘sha joyga qo‘yiladi. 🔄 tugmasi bilan buring.</span></div>
          <div><b>3</b><span>Devorlar katak chiziqlariga qo‘yiladi — xona yasash oson!</span></div>
          <div><b>4</b><span>🚶 “Ichida yurish” bilan uyingiz ichida sayr qiling. Do‘stlaringiz mehmonga keladi!</span></div>
        </div>
        <div class="ar-row c"><button type="button" class="ar-btn gold" data-w1="empty">✨ Bo‘sh maydondan boshlash</button><button type="button" class="ar-btn" data-w1="tpl">🏠 Namuna uy bilan boshlash</button></div></div>`);
      $$("[data-w1]", root).forEach((b) => (b.onclick = () => { closeSheet(); if (b.dataset.w1 === "tpl") loadTemplate(); else { setMode("build"); hint("Pastdan jihoz tanlang 👇", 2200); } }));
      return;
    }
    if (name === "more") {
      openSheet(name, `<h2>☰ Uyim</h2>
        <label class="ar-lab">Uy nomi<input id="arTitle" maxlength="40" value="${esc((st && st.title) || "")}" placeholder="Masalan: Bog‘li hovli"></label>
        <div class="ar-grid2">
          <button type="button" class="ar-btn" data-m="tpl">🏠 Namuna uyni qo‘shish</button>
          <button type="button" class="ar-btn" data-m="focus">🎯 Uyni markazga</button>
          <button type="button" class="ar-btn" data-m="visit">🏡 Mehmonga borish</button>
          <button type="button" class="ar-btn" data-m="rating">🏆 Reyting</button>
          <button type="button" class="ar-btn danger" data-m="clear">🗑️ Hammasini o‘chirish</button>
        </div>
        <p class="ar-muted">Maslahat: sichqonchaning o‘ng tugmasi yoki ikki barmoq bilan kamerani suring, g‘ildirak / chimdish bilan yaqinlashtiring. R — burish, Ctrl+Z — bekor qilish.</p>`);
      const ti = $("#arTitle", root);
      ti.onchange = () => { st.title = ti.value.replace(/[<>]/g, "").trim(); commit(); api.toast("Nom saqlandi", "good"); };
      $$("[data-m]", root).forEach((b) => (b.onclick = () => {
        const m = b.dataset.m;
        if (m === "tpl") { closeSheet(); loadTemplate(); }
        else if (m === "focus") { closeSheet(); scene.focusAll(); }
        else if (m === "clear") { if (confirm("Hamma jihozlar o‘chirilsinmi? (“Bekor” bilan qaytarish mumkin)")) { pushUndo(); st.list = []; scene.setPieces([]); commit(); closeSheet(); drawAll(); } }
        else panel(m);
      }));
      return;
    }
    if (name === "visit" || name === "rating") {
      openSheet(name, `<h2>${name === "visit" ? "🏡 Mehmonga borish" : "🏆 Eng chiroyli uylar"}</h2><div class="ar-wait"><div class="ar-spin"></div></div>`);
      const list = (await listBuilds()).filter((b) => name === "visit" || !/^Mehmon /.test(b.name));
      if (!root || sheetKey !== name) return;
      const me = G.session.name;
      const rows = (name === "visit" ? list.filter((b) => b.name !== me) : list).slice(0, 50);
      $("#arSheetIn", root).innerHTML = `<h2>${name === "visit" ? "🏡 Mehmonga borish" : "🏆 Eng chiroyli uylar"}</h2>
        <p class="ar-muted">${name === "visit" ? "Do‘stlaringiz qurgan uylarni ko‘ring, ichida yuring va yoqqanini 👍 bilan belgilang." : "Reyting — uyga bosilgan 👍 “yoqdi”lar soni bo‘yicha."}</p>
        ${name === "visit" ? `<input class="ar-search" type="search" placeholder="🔎 Ism bo‘yicha qidirish">` : ""}
        <div class="ar-list">${rows.length ? rows.map((b, i) => `<button type="button" class="ar-li ${b.name === me ? "me" : ""}" data-v="${esc(b.name)}" data-q="${esc(b.name.toLowerCase())}">
          <span class="av ${name === "rating" ? "rank" : ""}">${name === "rating" ? ["🥇", "🥈", "🥉"][i] || i + 1 : esc((short(b.name) || "?")[0])}</span>
          <span class="t"><b>${esc(b.title || b.name)}</b><small>${esc(b.name)}${b.cls ? " · " + esc(b.cls) : ""} · ${b.pieces} ta jihoz</small></span><em>👍 ${b.likes || 0}</em></button>`).join("")
          : `<p class="ar-muted">Hali boshqa uylar yo‘q. Do‘stlaringizni ham qurishga taklif qiling!</p>`}</div>`;
      const se = $(".ar-search", root);
      if (se) se.oninput = () => { const v = se.value.toLowerCase().trim(); $$("[data-v]", root).forEach((b) => (b.hidden = v && !b.dataset.q.includes(v))); };
      $$("[data-v]", root).forEach((b) => (b.onclick = () => (b.dataset.v === me && st ? (closeSheet(), backHome()) : visit(b.dataset.v))));
    }
  }
  function loadTemplate() {
    pushUndo();
    let added = 0;
    templateHouse().forEach((r) => {
      const rec = { ...r, id: "p" + (seq + 1) };
      if (st.list.length < MAX_PIECES && scene.canPlace(rec)) { seq++; st.list.push(rec); scene.add(rec); added++; }
    });
    commit(); setMode("build"); scene.focusAll(); sfx.put();
    api.toast(added ? `🏠 Namuna uy qo‘yildi (${added} ta jihoz). Endi uni o‘zgartiring!` : "Namuna uchun joy band.", added ? "good" : "bad");
  }
  async function visit(name) {
    const s = await loadBuild(name, false);
    if (!root) return;
    if (!s || !s.items || !s.items.length) { api.toast("Bu uy topilmadi.", "bad"); return; }
    viewing = { ...s, list: unpack(s.items) };
    closeSheet();
    scene.setPieces(viewing.list);
    setMode("view");
    scene.focusAll();
    api.toast(`🏡 ${short(name)}ning uyiga mehmonga keldingiz!`, "good");
  }
  function backHome() {
    viewing = null;
    if (st) { scene.setPieces(st.list); setMode("build"); scene.focusAll(); } else { scene.setPieces([]); drawAll(); }
  }

  window.SofiArch = { open: (who) => openApp(who || G.session), _state: () => st };
})();
