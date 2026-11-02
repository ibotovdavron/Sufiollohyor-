/* MENING FERMAM — 3D ferma o'yini.
   Har bir o'quvchiga 100 000 so'm beriladi: ot, qo'y, sigir yoki tovuq sotib oladi.
   Har kuni suv, beda va don berish uchun savollarga javob beradi.
   Tovuq — tuxum, sigir — sut, qo'y va ot — go'sht beradi. Boshqalar fermasiga mehmonga borish mumkin. */
(() => {
  "use strict";

  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const sum = (n) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ") + " so‘m";
  const isGuest = (p) => !!p && (p.role === "guest" || p.cls === "Mehmon");
  const LEVEL = { "5-sinf": 1, "6-sinf": 2, "6-A sinf": 2, "8-sinf": 3, "Ustoz": 3, "Mehmon": 2 };

  // ---------- O'yin qoidalari ----------
  const START_MONEY = 100000;
  const KINDS = {
    tovuq: { name: "Tovuq", icon: "🐔", price: 10000, eats: "grain", gives: "tuxum", per: 1, max: 40, note: "Har kuni 1 ta tuxum" },
    qoy: { name: "Qo‘y", icon: "🐑", price: 50000, eats: "hay", gives: "gosht", meat: 20, grow: 7, max: 12, note: "7 kun boqilsa — 20 kg go‘sht" },
    sigir: { name: "Sigir", icon: "🐄", price: 100000, eats: "hay", gives: "sut", per: 5, max: 8, note: "Har kuni 5 litr sut" },
    ot: { name: "Ot", icon: "🐎", price: 100000, eats: "hay", gives: "gosht", meat: 45, grow: 10, max: 6, note: "10 kun boqilsa — 45 kg go‘sht" }
  };
  const PACKS = [
    { t: "ot", n: 1, label: "1 ta ot" },
    { t: "qoy", n: 2, label: "2 ta qo‘y" },
    { t: "sigir", n: 1, label: "1 ta sigir" },
    { t: "tovuq", n: 10, label: "10 ta tovuq" }
  ];
  const GOODS = {
    tuxum: { name: "Tuxum", icon: "🥚", unit: "dona", price: 1200 },
    sut: { name: "Sut", icon: "🥛", unit: "litr", price: 2000 },
    gosht: { name: "Go‘sht", icon: "🥩", unit: "kg", price: 4000 }
  };
  const TASKS = {
    water: { name: "Suv berish", icon: "💧", what: "Hamma hayvonlarga toza suv", need: () => true },
    hay: { name: "Beda berish", icon: "🌿", what: "Qo‘y, sigir va otlarga beda", need: (s) => s.animals.some((a) => KINDS[a.t].eats === "hay") },
    grain: { name: "Don berish", icon: "🌾", what: "Tovuqlarga don", need: (s) => s.animals.some((a) => a.t === "tovuq") }
  };
  const Q_PER_TASK = 3, Q_NEED = 2;
  const SELL_RATE = 0.7;
  const GRANT = 30000;
  const SICK = 30;
  const NAMES = {
    tovuq: ["Cho‘pon", "Oqpar", "Sariq", "Malla", "Chipor", "Qizil", "Ola", "Popuk", "Jo‘ja", "Kokil", "Shirin", "Oppoq"],
    qoy: ["Qorako‘z", "Oqtosh", "Jingalak", "Paxmoq", "Qo‘zivoy", "Momiq"],
    sigir: ["Moviy", "Olapar", "Sarvi", "Gulsara", "Qoravoy", "Bo‘ri"],
    ot: ["G‘irot", "Boychibor", "Qorabayir", "Tulpor", "Saman", "Jiyron"]
  };

  // Toshkent vaqti bo'yicha kun raqami
  const dayNo = (t = Date.now()) => Math.floor((t + 5 * 3600e3) / 86400e3);
  const dayLabel = (d) => { const x = new Date(d * 86400e3); return `${x.getUTCDate()}.${String(x.getUTCMonth() + 1).padStart(2, "0")}`; };
  const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

  // ---------- Kutubxonalarni yuklash ----------
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error(src));
    document.head.appendChild(s);
  });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.SofiFarm3D) await loadScript("games/ferma3d.js?v=3");
    if (window.SofiFarm3D.preload) await window.SofiFarm3D.preload();
  })().catch((e) => { libs = null; throw e; }));

  // ---------- Ovoz (games/ferma-sound.js) ----------
  const SND = () => window.SofiFarmSound;
  const fx = (n, o) => { const s = SND(); if (s) s.fx(n, o); };
  const sfx = { ok: () => fx("ok"), bad: () => fx("bad"), coin: () => fx("coin"), done: () => fx("done") };
  // Hayvon ovozi: sahnadagi joyiga qarab chap/o'ng va balandlik
  function speak(id, t) {
    const s = SND();
    if (!s || !s.on) return;
    const info = scene ? scene.call(id) : null;
    const kind = t === "tovuq" && info && info.rooster ? "xoroz" : t;
    s.voice(kind, info ? { pan: info.pan * 0.8, vol: info.vol } : { vol: 0.6 });
  }

  // =========================================================
  // HOLAT: saqlash (shu qurilma + Supabase)
  // =========================================================
  const LKEY = "sofi_farm_v1:";
  const db = () => window.SofiNet && window.SofiNet.db;
  const lget = (name) => { try { return JSON.parse(localStorage.getItem(LKEY + name)); } catch (e) { return null; } };
  const lset = (st) => { try { localStorage.setItem(LKEY + st.name, JSON.stringify(st)); } catch (e) { /* joy yo'q */ } };

  function fresh(me) {
    return {
      v: 1, name: me.name, cls: me.cls || "", money: START_MONEY, animals: [], seq: 0,
      inv: { tuxum: 0, sut: 0, gosht: 0 }, pending: { tuxum: 0, sut: 0 },
      today: { day: dayNo(), done: false, tasks: {} }, started: dayNo(), grant: false,
      stats: { days: 0, earned: 0, eggs: 0, milk: 0, meat: 0, answers: 0, right: 0 }, log: [], updated: 0
    };
  }
  function fix(st) {
    st.inv = Object.assign({ tuxum: 0, sut: 0, gosht: 0 }, st.inv);
    st.pending = Object.assign({ tuxum: 0, sut: 0 }, st.pending);
    st.stats = Object.assign({ days: 0, earned: 0, eggs: 0, milk: 0, meat: 0, answers: 0, right: 0 }, st.stats);
    st.animals = (st.animals || []).filter((a) => KINDS[a.t]);
    st.today = st.today || { day: dayNo(), done: false, tasks: {} };
    st.today.tasks = st.today.tasks || {};
    st.log = (st.log || []).slice(-30);
    return st;
  }
  const valueOf = (st) => Math.round(st.money +
    st.animals.reduce((s, a) => s + KINDS[a.t].price * (a.health >= SICK ? 1 : 0.6), 0) +
    Object.keys(GOODS).reduce((s, k) => s + (st.inv[k] || 0) * GOODS[k].price, 0) +
    (st.pending.tuxum || 0) * GOODS.tuxum.price + (st.pending.sut || 0) * GOODS.sut.price);

  async function loadFarm(me) {
    let st = lget(me.name);
    const d = db();
    if (d && !isGuest(me)) {
      try {
        const { data, error } = await d.from("farms").select("state").eq("name", me.name).maybeSingle();
        if (!error && data && data.state && data.state.name === me.name && (!st || (data.state.updated || 0) > (st.updated || 0))) st = data.state;
      } catch (e) { /* mahalliy */ }
    }
    return st ? fix(st) : null;
  }
  let saveTimer = 0;
  function save(st) {
    st.updated = Date.now();
    lset(st);
    if (isGuest(st)) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const d = db();
      if (!d) return;
      try {
        const { error } = await d.rpc("farm_save", { p_name: st.name, p_cls: st.cls || "", p_state: st, p_value: valueOf(st), p_animals: st.animals.length });
        if (error) console.warn("farm_save:", error.message);
      } catch (e) { console.warn("farm_save:", e); }
    }, 1200);
  }
  async function listFarms() {
    const d = db();
    if (d) {
      try {
        const { data, error } = await d.from("farms").select("name,cls,value,animals,updated_at").order("value", { ascending: false }).limit(60);
        if (!error && data) return data;
      } catch (e) { /* mahalliy */ }
    }
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(LKEY)) continue;
      try { const s = fix(JSON.parse(localStorage.getItem(k))); out.push({ name: s.name, cls: s.cls, value: valueOf(s), animals: s.animals.length, updated_at: s.updated }); } catch (e) { /* buzuq */ }
    }
    return out.sort((a, b) => b.value - a.value);
  }
  async function getFarm(name) {
    const d = db();
    if (d) {
      try {
        const { data, error } = await d.from("farms").select("state").eq("name", name).maybeSingle();
        if (!error && data && data.state) return fix(data.state);
      } catch (e) { /* mahalliy */ }
    }
    const s = lget(name);
    return s ? fix(s) : null;
  }

  // ---------- Kun almashishi ----------
  // Boqilmagan kunlar uchun sog'liq kamayadi. Hayvonlar o'lmaydi, lekin kasal bo'lsa mahsulot bermaydi.
  function rollDay(st) {
    const now = dayNo();
    if (st.today.day >= now) return [];
    const notes = [];
    const missed = Math.min(6, (st.today.done ? 0 : 1) + Math.max(0, now - st.today.day - 1));
    if (st.animals.length && missed > 0) {
      st.animals.forEach((a) => { a.health = Math.max(0, (a.health ?? 100) - 25 * missed); });
      const sick = st.animals.filter((a) => a.health < SICK).length;
      notes.push(`⚠️ ${missed} kun hayvonlar boqilmadi. Sog‘lig‘i pasaydi${sick ? ` — ${sick} tasi kasal 🤒` : ""}.`);
      log(st, `${missed} kun boqilmadi`);
    }
    st.today = { day: now, done: false, tasks: {} };
    return notes;
  }
  function needed(st) { return st.animals.length ? Object.keys(TASKS).filter((k) => TASKS[k].need(st)) : []; }
  function log(st, text) { st.log.push({ d: dayNo(), t: text }); st.log = st.log.slice(-30); }

  // Hamma vazifa bajarilganda: hayvonlar to'yadi, mahsulot beradi
  function finishDay(st) {
    st.today.done = true;
    st.stats.days++;
    let eggs = 0, milk = 0;
    st.animals.forEach((a) => {
      a.health = Math.min(100, (a.health ?? 100) + 20);
      a.fed = (a.fed || 0) + 1;
      if (a.health < SICK) return;
      if (a.t === "tovuq") eggs += KINDS.tovuq.per;
      if (a.t === "sigir") milk += KINDS.sigir.per;
    });
    st.pending.tuxum += eggs; st.pending.sut += milk;
    log(st, `Hayvonlar boqildi${eggs ? ` · ${eggs} tuxum` : ""}${milk ? ` · ${milk} l sut` : ""}`);
    return { eggs, milk };
  }
  const ready = (a) => KINDS[a.t].grow && (a.fed || 0) >= KINDS[a.t].grow && a.health >= SICK;
  function statusOf(st, a, guest) {
    if (a.health < SICK) return "sick";
    if (ready(a)) return "ready";
    if (!guest && !st.today.done && st.animals.length) return "hungry";
    if (a.t === "tovuq" && st.pending.tuxum > 0) return "product";
    if (a.t === "sigir" && st.pending.sut > 0) return "milk";
    return "fed";
  }

  // =========================================================
  // KARTA (o'yinlar sahifasida)
  // =========================================================
  async function drawCard() {
    const box = $("#fmTop");
    if (!box) return;
    const list = (await listFarms()).filter((f) => !/^Mehmon /.test(f.name)).slice(0, 5);
    box.innerHTML = `<div class="fm-top-head">🏆 Eng boy fermalar</div>` + (list.length
      ? list.map((f, i) => `<div class="fm-top-row"><span>${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(f.name)}</b><em>${esc(sum(f.value))}</em></div>`).join("")
      : `<p class="fm-top-empty">Hali fermalar yo‘q — birinchi bo‘ling!</p>`);
  }
  setTimeout(drawCard, 600);
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-fm]");
    if (!b) return;
    const what = b.dataset.fm;
    if (what === "visit") { openApp(null, "visit"); return; }
    if (!G.session.name && !(await api.askName())) return;
    openApp(G.session, what === "rating" ? "rating" : null);
  });

  // =========================================================
  // ILOVA OYNASI
  // =========================================================
  let root = null, scene = null, st = null, viewing = null, sheetFn = null, timers = [];
  const H = { busy: false };

  function shell() {
    root = document.createElement("div");
    root.className = "fm";
    root.innerHTML = `
      <header class="fm-bar">
        <button class="fm-exit" type="button">← Chiqish</button>
        <div class="fm-brand"><span>🐄</span><b>MENING FERMAM</b><em>3D</em></div>
        <div class="fm-bar-r" id="fmBarR"></div>
        <button class="fm-snd" type="button" id="fmSnd" title="Ovoz"></button>
      </header>
      <div class="fm-world" id="fmWorld">
        <div class="fm-loading" id="fmLoading"><div class="fm-load-art" aria-hidden="true"><span class="sun">☀️</span><span class="hill"></span><span class="an a1">🐄</span><span class="an a2">🐑</span><span class="an a3">🐔</span><span class="an a4">🐎</span></div><b>Ferma uyg‘onmoqda…</b><p>Hayvonlar o‘tloqqa chiqyapti 🌾</p></div>
        <div class="fm-hud" id="fmHud"></div>
        <div class="fm-visit" id="fmVisit" hidden></div>
        <div class="fm-pop" id="fmPop" hidden></div>
        <div class="fm-floats" id="fmFloats"></div>
        <div class="fm-cam"><button type="button" id="fmHome" title="Umumiy ko‘rinish">🎯</button></div>
      </div>
      <nav class="fm-dock" id="fmDock">
        <button type="button" data-p="tasks"><span>📋</span><b>Vazifalar</b><i id="fmBadge" hidden></i></button>
        <button type="button" data-p="shop"><span>🛒</span><b>Do‘kon</b></button>
        <button type="button" data-p="market"><span>💰</span><b>Bozor</b></button>
        <button type="button" data-p="herd"><span>🐾</span><b>Podam</b></button>
        <button type="button" data-p="visit"><span>🏡</span><b>Mehmonga</b></button>
        <button type="button" data-p="rating"><span>🏆</span><b>Reyting</b></button>
      </nav>
      <section class="fm-sheet" id="fmSheet" hidden><button class="fm-sheet-x" type="button" aria-label="Yopish">✕</button><div class="fm-sheet-in" id="fmSheetIn"></div></section>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "fm-open");
    requestAnimationFrame(() => root && root.classList.add("show"));
    $(".fm-exit", root).onclick = () => { if (H.busy && !confirm("Savollar tugamadi. Chiqasizmi?")) return; close(); };
    $(".fm-sheet-x", root).onclick = closeSheet;
    const sb = $("#fmSnd", root), drawSnd = () => { const on = SND() && SND().on; sb.textContent = on ? "🔊" : "🔇"; sb.classList.toggle("off", !on); };
    sb.onclick = () => { const s = SND(); if (!s) return; s.setOn(!s.on); if (s.on) { s.startAmbience(scene && scene.isNight); } drawSnd(); };
    drawSnd();
    $("#fmHome", root).onclick = () => scene && scene.overview();
    $$("#fmDock [data-p]", root).forEach((b) => (b.onclick = () => panel(b.dataset.p)));
    const onKey = (e) => { if (e.key === "Escape" && root) { if (!$("#fmSheet", root).hidden) closeSheet(); } };
    document.addEventListener("keydown", onKey);
    timers.push(() => document.removeEventListener("keydown", onKey));
  }
  function close() {
    if (SND()) SND().stopAmbience();
    timers.forEach((fn) => { try { fn(); } catch (e) { /* bo'sh */ } });
    timers = [];
    if (scene) { try { scene.destroy(); } catch (e) { /* bo'sh */ } }
    scene = null; st = null; viewing = null; H.busy = false;
    if (root) root.remove();
    root = null;
    document.body.classList.remove("g-playing", "fm-open");
    drawCard();
  }

  async function openApp(me, first) {
    if (root) close();
    if (SND()) SND().init(); // bosish paytida ochiladi (brauzer talabi)
    shell();
    try { await loadLibs(); } catch (e) { /* 3D bo'lmasa ham ro'yxat bilan ishlaydi */ }
    if (!root) return;
    try {
      scene = new window.SofiFarm3D($("#fmWorld", root), {
        onAnimal: (id) => showAnimal(id),
        onGround: () => { const p = $("#fmPop", root); if (p) p.hidden = true; }
      });
    } catch (e) {
      $("#fmWorld", root).insertAdjacentHTML("beforeend", `<div class="fm-nogl">😔 Qurilmangiz 3D grafikani qo‘llamaydi. O‘yin davom etadi — hayvonlaringizni “🐾 Podam” bo‘limida ko‘ring.</div>`);
      scene = null;
    }
    $("#fmLoading", root).remove();
    if (SND() && SND().on) SND().startAmbience(scene && scene.isNight);
    startVoices();
    if (!me) { $("#fmDock", root).classList.add("off"); panel("visit"); return; }

    let s = await loadFarm(me);
    if (!root) return;
    const isNew = !s;
    if (!s) s = fresh(me);
    s.cls = me.cls || s.cls;
    const notes = rollDay(s);
    st = s;
    save(st);
    render();
    const tick = setInterval(() => {
      if (!st || viewing) return;
      const n = rollDay(st);
      if (n.length || st.today.day !== dayNo()) { save(st); render(); }
      n.forEach((t) => api.toast(t, "bad"));
    }, 60000);
    timers.push(() => clearInterval(tick));
    if (isNew) welcome();
    else {
      notes.forEach((t) => api.toast(t, "bad"));
      if (first === "rating") panel("rating");
      else if (first === "visit") panel("visit");
      else if (needed(st).length && !st.today.done) setTimeout(() => panel("tasks"), 500);
    }
  }

  // ---------- Hayvonlar ovozi: och qolsa tez-tez chaqiradi ----------
  function chorus() {
    const s = viewing || st;
    if (!s) return;
    const seen = new Set();
    s.animals.filter((a) => !seen.has(a.t) && seen.add(a.t)).forEach((a, i) => setTimeout(() => root && speak(a.id, a.t), 300 + i * 900));
  }
  function startVoices() {
    let next = Date.now() + 1800, greeted = false;
    const iv = setInterval(() => {
      const s = viewing || st;
      if (!root || !s || !scene || document.hidden || !SND() || !SND().on) return;
      if (!s.animals.length) return;
      if (!greeted) { greeted = true; chorus(); next = Date.now() + 5000 + s.animals.length * 300; return; }
      if (Date.now() < next) return;
      const guest = !!viewing;
      const hungry = s.animals.filter((a) => { const x = statusOf(s, a, guest); return x === "hungry" || x === "sick"; });
      const pool = hungry.length ? hungry : s.animals;
      const a = pool[Math.random() * pool.length | 0];
      speak(a.id, a.t);
      if (hungry.length && Math.random() < 0.35) { const b = pool[Math.random() * pool.length | 0]; if (b !== a) setTimeout(() => speak(b.id, b.t), 700); }
      next = Date.now() + (hungry.length ? rand(4500, 9000) : rand(14000, 26000));
      if (SND() && scene) SND().setNight(scene.isNight);
    }, 700);
    timers.push(() => clearInterval(iv));
  }
  const rand = (a, b) => a + Math.random() * (b - a);

  // ---------- Ekranni yangilash ----------
  function render() {
    if (!root) return;
    const s = viewing || st;
    if (!s) return;
    const guest = !!viewing;
    $("#fmBarR", root).innerHTML = guest
      ? `<span class="fm-chip">🏡 ${esc(short(s.name))}ning fermasi</span>`
      : `<span class="fm-chip money" id="fmMoney">💵 ${esc(sum(st.money))}</span>`;
    root.classList.toggle("guest", guest);
    const need = needed(st || s), done = need.filter((k) => st && (st.today.done || st.today.tasks[k]));
    const inv = (x) => Object.keys(GOODS).map((k) => `<span class="fm-chip" title="${GOODS[k].name}">${GOODS[k].icon} ${x.inv[k] || 0}${k === "sut" ? " l" : k === "gosht" ? " kg" : ""}</span>`).join("");
    const counts = Object.keys(KINDS).map((t) => { const n = s.animals.filter((a) => a.t === t).length; return n ? `<span class="fm-chip">${KINDS[t].icon} ${n}</span>` : ""; }).join("");
    const d = new Date(), hh = d.getHours(), clock = `<span class="fm-chip clock">${hh >= 6 && hh < 19 ? (hh >= 17 || hh < 8 ? "🌇" : "☀️") : "🌙"} ${String(hh).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}</span>`;
    $("#fmHud", root).innerHTML = guest ? `<div class="fm-hud-row">${clock}${counts || '<span class="fm-chip">Hayvon yo‘q</span>'}</div>` : `
      <div class="fm-hud-row">${clock}${inv(st)}</div>
      <div class="fm-hud-row">${counts}</div>
      ${st.animals.length ? `<button type="button" class="fm-day ${st.today.done ? "ok" : ""}" data-p="tasks">
        <b>${st.today.done ? "✅ Bugun hamma hayvon to‘q" : `📋 Bugungi vazifalar: ${done.length}/${need.length}`}</b>
        <span>${need.map((k) => `<i class="${st.today.done || st.today.tasks[k] ? "on" : ""}">${TASKS[k].icon}</i>`).join("")}</span></button>` : ""}
      ${!guest && (st.pending.tuxum || st.pending.sut) ? `<button type="button" class="fm-collect" data-collect>🧺 Hosilni yig‘ish ${st.pending.tuxum ? `🥚${st.pending.tuxum}` : ""} ${st.pending.sut ? `🥛${st.pending.sut} l` : ""}</button>` : ""}`;
    $$("#fmHud [data-p]", root).forEach((b) => (b.onclick = () => panel(b.dataset.p)));
    const c = $("#fmHud [data-collect]", root);
    if (c) c.onclick = collect;
    const badge = $("#fmBadge", root);
    if (badge) { const left = st ? need.length - done.length : 0; badge.hidden = !left || (st && st.today.done); badge.textContent = left; }
    if (scene) {
      scene.setAnimals(s.animals.map((a) => ({ id: a.id, t: a.t, status: statusOf(s, a, guest) })));
      const tk = guest ? { water: 1, hay: 1, grain: 1 } : st.today.tasks;
      scene.setFeed({ water: !!tk.water, hay: !!tk.hay, grain: !!tk.grain });
    }
    if (sheetFn && !H.busy && !$("#fmSheet", root).hidden && sheetFn.key !== "visit" && sheetFn.key !== "rating") sheetFn();
  }
  function float(text, kind = "") {
    const box = $("#fmFloats", root);
    if (!box) return;
    const el = document.createElement("div");
    el.className = "fm-float " + kind; el.textContent = text;
    box.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  // ---------- Pastki oyna (sheet) ----------
  function openSheet(fn) {
    sheetFn = fn;
    const sh = $("#fmSheet", root);
    sh.hidden = false;
    $("#fmPop", root).hidden = true;
    fn();
    $$("#fmDock [data-p]", root).forEach((b) => b.classList.toggle("on", b.dataset.p === fn.key));
  }
  function closeSheet() {
    if (!root) return;
    if (H.busy && !confirm("Savollar tugamadi. Yopasizmi?")) return;
    H.busy = false;
    $("#fmSheet", root).hidden = true; sheetFn = null;
    $$("#fmDock [data-p]", root).forEach((b) => b.classList.remove("on"));
  }
  const inner = () => $("#fmSheetIn", root);
  function panel(name) {
    if (H.busy) return;
    if (viewing && name !== "visit" && name !== "rating") { backHome(); return; }
    const map = { tasks: pTasks, shop: pShop, market: pMarket, herd: pHerd, visit: pVisit, rating: pRating };
    const fn = () => map[name]();
    fn.key = name;
    if (!st && name !== "visit" && name !== "rating") return;
    openSheet(fn);
  }

  // ---------- Xush kelibsiz ----------
  function welcome() {
    const fn = () => {
      inner().innerHTML = `
        <div class="fm-welcome">
          <div class="fm-big">🎁</div>
          <h2>Xush kelibsiz, ${esc(short(st.name))}!</h2>
          <p>Sizga fermani boshlash uchun <b>${esc(sum(START_MONEY))}</b> berildi. Birinchi xaridingizni tanlang:</p>
          <div class="fm-packs">${PACKS.map((p, i) => `<button type="button" class="fm-pack" data-pack="${i}">
            <span class="ic">${KINDS[p.t].icon.repeat(Math.min(p.n, 3))}${p.n > 3 ? "…" : ""}</span><b>${esc(p.label)}</b>
            <small>${esc(KINDS[p.t].note)}</small><em>${esc(sum(KINDS[p.t].price * p.n))}</em></button>`).join("")}</div>
          <div class="fm-rules">
            <div>💧🌿🌾 <span>Har kuni hayvonlarga suv, beda yoki don bering. Buning uchun savollarga to‘g‘ri javob bering (3 tadan kamida 2 tasi).</span></div>
            <div>🥚🥛🥩 <span>Tovuq — tuxum, sigir — sut, qo‘y va ot — go‘sht beradi. Mahsulotni bozorda soting.</span></div>
            <div>🤒 <span>Boqilmagan kun hayvonning sog‘lig‘i pasayadi. Kasal hayvon mahsulot bermaydi.</span></div>
            <div>🏡 <span>Do‘stlaringiz fermasiga mehmonga borib ko‘ring!</span></div>
          </div>
        </div>`;
      $$("[data-pack]", inner()).forEach((b) => (b.onclick = () => {
        const p = PACKS[+b.dataset.pack];
        buy(p.t, p.n, true);
        closeSheet();
        setTimeout(() => panel("tasks"), 900);
      }));
    };
    fn.key = "shop";
    openSheet(fn);
  }

  // ---------- Vazifalar va savollar ----------
  function pTasks() {
    const need = needed(st);
    if (!st.animals.length) {
      inner().innerHTML = `<div class="fm-empty"><div class="fm-big">🌾</div><h3>Fermangizda hali hayvon yo‘q</h3><p>Do‘kondan hayvon sotib oling — keyin har kuni ularni boqasiz.</p><button class="btn" type="button" data-go="shop">🛒 Do‘konga</button></div>`;
      $("[data-go]", inner()).onclick = () => panel("shop");
      return;
    }
    inner().innerHTML = `
      <h2>📋 Bugungi vazifalar <small>${dayLabel(st.today.day)}</small></h2>
      <p class="fm-muted">Har bir vazifa uchun ${Q_PER_TASK} ta savol. Kamida ${Q_NEED} tasiga to‘g‘ri javob bersangiz, hayvonlar oziqlanadi.</p>
      <div class="fm-tasks">${need.map((k) => `<div class="fm-task ${st.today.done || st.today.tasks[k] ? "ok" : ""}">
          <span class="ic">${TASKS[k].icon}</span><span class="t"><b>${TASKS[k].name}</b><small>${TASKS[k].what}</small></span>
          ${st.today.done || st.today.tasks[k] ? `<span class="fm-tick">✅ Berildi</span>` : `<button class="btn" type="button" data-task="${k}">Boshlash</button>`}</div>`).join("")}</div>
      ${st.today.done ? `<div class="fm-done">🎉 Bugun hamma hayvonlar to‘q va xursand! Ertaga yana keling.${st.pending.tuxum || st.pending.sut ? `<button class="btn" type="button" data-collect>🧺 Hosilni yig‘ish</button>` : ""}</div>` : ""}
      ${sickList()}`;
    $$("[data-task]", inner()).forEach((b) => (b.onclick = () => quiz(b.dataset.task)));
    const c = $("[data-collect]", inner());
    if (c) c.onclick = collect;
  }
  function sickList() {
    const sick = st.animals.filter((a) => a.health < SICK);
    return sick.length ? `<div class="fm-warn">🤒 Kasal hayvonlar: ${sick.map((a) => `${KINDS[a.t].icon} ${esc(a.name)}`).join(", ")}. Ularni har kuni boqing — sog‘lig‘i tiklanadi.</div>` : "";
  }

  function quiz(task) {
    const attempt = (st.today.tries = (st.today.tries || 0) + 1);
    const level = LEVEL[st.cls] || 2;
    const qs = window.SofiQuestions.make(hash(`${st.name}|${st.today.day}|${task}|${attempt}`), Q_PER_TASK, level)
      .map((q) => ({ ...q, opts: q.opts.includes(q.a) ? q.opts : [q.a, ...q.opts.slice(0, 3)] }));
    let i = 0, right = 0;
    H.busy = true;
    const T = TASKS[task];
    const step = () => {
      if (!root) return;
      const q = qs[i];
      inner().innerHTML = `
        <div class="fm-quiz">
          <div class="fm-quiz-h"><span class="ic">${T.icon}</span><b>${T.name}</b><span class="fm-dots">${qs.map((_, j) => `<i class="${j < i ? (qs[j].ok ? "y" : "n") : j === i ? "c" : ""}"></i>`).join("")}</span></div>
          <div class="fm-subj">${esc(q.subject || "Savol")} · ${i + 1}/${qs.length}</div>
          <div class="fm-q">${esc(q.q)}</div>
          <div class="fm-opts">${q.opts.map((o, j) => `<button type="button" data-o="${j}">${esc(o)}</button>`).join("")}</div>
        </div>`;
      $$("[data-o]", inner()).forEach((b) => (b.onclick = () => {
        const pick = q.opts[+b.dataset.o];
        q.ok = String(pick) === String(q.a);
        st.stats.answers++;
        if (q.ok) { right++; st.stats.right++; sfx.ok(); } else sfx.bad();
        $$("[data-o]", inner()).forEach((x) => {
          x.disabled = true;
          if (String(q.opts[+x.dataset.o]) === String(q.a)) x.classList.add("y");
          else if (x === b) x.classList.add("n");
        });
        setTimeout(() => { i++; if (i < qs.length) step(); else end(); }, q.ok ? 650 : 1500);
      }));
    };
    const end = () => {
      H.busy = false;
      const ok = right >= Q_NEED;
      if (ok) {
        st.today.tasks[task] = true;
        float(`${T.icon} ${T.name}!`, "good");
        fx(task);
        let msg = "";
        if (!st.today.done && needed(st).every((k) => st.today.tasks[k])) {
          const r = finishDay(st);
          setTimeout(() => { sfx.done(); if (scene) scene.celebrate("❤️"); chorus(); }, 1100);
          api.toast("🎉 Hamma hayvonlar boqildi!", "good");
          msg = `<p>Bugungi hosil: ${r.eggs ? `🥚 ${r.eggs} ta tuxum ` : ""}${r.milk ? `🥛 ${r.milk} l sut ` : ""}${!r.eggs && !r.milk ? "hayvonlar o‘sib, semiryapti 💪" : ""}</p>`;
          const rd = st.animals.filter(ready);
          if (rd.length) msg += `<p>⭐ ${rd.map((a) => esc(a.name)).join(", ")} go‘shtga tayyor! “🐾 Podam” bo‘limida topshiring.</p>`;
        } else sfx.ok();
        save(st); render();
        inner().innerHTML = `<div class="fm-result good"><div class="fm-big">${T.icon}</div><h3>Barakalla! ${right}/${qs.length} to‘g‘ri</h3><p>${T.name} bajarildi.</p>${msg}<button class="btn" type="button" data-back>Davom etish</button></div>`;
      } else {
        save(st);
        inner().innerHTML = `<div class="fm-result bad"><div class="fm-big">😕</div><h3>${right}/${qs.length} to‘g‘ri — yetarli emas</h3><p>Hayvonlar hali och. Kamida ${Q_NEED} ta to‘g‘ri javob kerak. Yangi savollar bilan qayta urinib ko‘ring!</p><div class="fm-row"><button class="btn" type="button" data-retry>🔁 Qayta urinish</button><button class="btn ghost" type="button" data-back>Orqaga</button></div></div>`;
        $("[data-retry]", inner()).onclick = () => quiz(task);
      }
      $("[data-back]", inner()).onclick = () => panel("tasks");
    };
    step();
  }

  function collect() {
    const e = st.pending.tuxum || 0, m = st.pending.sut || 0;
    if (!e && !m) return;
    st.inv.tuxum += e; st.inv.sut += m;
    st.stats.eggs += e; st.stats.milk += m;
    st.pending = { tuxum: 0, sut: 0 };
    sfx.coin();
    const hen = st.animals.find((a) => a.t === "tovuq");
    if (hen && e) setTimeout(() => speak(hen.id, "tovuq"), 300);
    float(`🧺 ${e ? `+${e} 🥚 ` : ""}${m ? `+${m} l 🥛` : ""}`, "good");
    save(st); render();
  }

  // ---------- Do'kon ----------
  function buy(t, n = 1, silent) {
    const K = KINDS[t];
    const have = st.animals.filter((a) => a.t === t).length;
    if (have + n > K.max) { api.toast(`Fermada ${K.name.toLowerCase()} uchun joy yetmaydi (ko‘pi bilan ${K.max} ta).`, "bad"); return false; }
    if (st.money < K.price * n) { api.toast("Pul yetmaydi 😕 Mahsulotlarni bozorda soting.", "bad"); return false; }
    st.money -= K.price * n;
    for (let i = 0; i < n; i++) {
      const used = new Set(st.animals.map((a) => a.name));
      const pool = NAMES[t].filter((x) => !used.has(x));
      const name = pool.length ? pool[(st.seq + i) % pool.length] : `${K.name} ${st.seq + 1}`;
      st.animals.push({ id: "a" + (++st.seq), t, name, born: dayNo(), fed: 0, health: 100 });
    }
    // Bugun vazifalar bajarilgan bo'lsa, yangi hayvonlar to'q holda keladi (ertadan boqiladi)
    log(st, `${n} ta ${K.name.toLowerCase()} sotib olindi`);
    sfx.coin();
    const newId = st.animals[st.animals.length - 1].id;
    setTimeout(() => speak(newId, t), 900);
    float(`${K.icon} +${n}`, "good");
    if (!silent) api.toast(`${n} ta ${K.name.toLowerCase()} sotib olindi! ${K.icon}`, "good");
    save(st); render();
    return true;
  }
  function pShop() {
    inner().innerHTML = `
      <h2>🛒 Hayvonlar do‘koni</h2>
      <p class="fm-muted">Hisobingizda: <b>${esc(sum(st.money))}</b></p>
      <div class="fm-shop">${Object.keys(KINDS).map((t) => {
        const K = KINDS[t], have = st.animals.filter((a) => a.t === t).length;
        const pack = PACKS.find((p) => p.t === t);
        return `<div class="fm-item">
          <span class="ic">${K.icon}</span>
          <span class="t"><b>${K.name}</b><small>${esc(K.note)} · bor: ${have}/${K.max}</small><em>${esc(sum(K.price))}</em></span>
          <span class="fm-buy">
            <button class="btn" type="button" data-buy="${t}" data-n="1" ${st.money < K.price || have >= K.max ? "disabled" : ""}>+1</button>
            ${pack.n > 1 ? `<button class="btn ghost" type="button" data-buy="${t}" data-n="${pack.n}" ${st.money < K.price * pack.n || have + pack.n > K.max ? "disabled" : ""}>+${pack.n}</button>` : ""}
          </span></div>`;
      }).join("")}</div>
      ${grantBox()}`;
    $$("[data-buy]", inner()).forEach((b) => (b.onclick = () => buy(b.dataset.buy, +b.dataset.n)));
    const g = $("[data-grant]", inner());
    if (g) g.onclick = () => { st.money += GRANT; st.grant = true; log(st, "Yordam puli olindi"); sfx.coin(); save(st); render(); };
  }
  function grantBox() {
    const broke = !st.grant && st.money < KINDS.tovuq.price && !st.animals.length && !Object.values(st.inv).some((x) => x > 0);
    return broke ? `<div class="fm-warn">🤝 Pulingiz tugadimi? Markaz bir marta <b>${esc(sum(GRANT))}</b> yordam beradi. <button class="btn" type="button" data-grant>Olish</button></div>` : "";
  }

  // ---------- Bozor ----------
  function pMarket() {
    const total = Object.keys(GOODS).reduce((s, k) => s + st.inv[k] * GOODS[k].price, 0);
    inner().innerHTML = `
      <h2>💰 Bozor</h2>
      <p class="fm-muted">Mahsulotlaringizni soting va yangi hayvonlar oling.</p>
      <div class="fm-shop">${Object.keys(GOODS).map((k) => {
        const g = GOODS[k], n = st.inv[k] || 0;
        return `<div class="fm-item"><span class="ic">${g.icon}</span>
          <span class="t"><b>${g.name}: ${n} ${g.unit}</b><small>1 ${g.unit} = ${esc(sum(g.price))}</small><em>${n ? "= " + esc(sum(n * g.price)) : "—"}</em></span>
          <button class="btn" type="button" data-sell="${k}" ${n ? "" : "disabled"}>Sotish</button></div>`;
      }).join("")}</div>
      ${total ? `<button class="btn fm-wide" type="button" data-sellall>Hammasini sotish · ${esc(sum(total))}</button>` : ""}
      ${st.pending.tuxum || st.pending.sut ? `<div class="fm-warn">🧺 Yig‘ilmagan hosil bor! <button class="btn" type="button" data-collect>Yig‘ish</button></div>` : ""}
      <h3 class="fm-h3">📈 Natijalar</h3>
      <div class="fm-stats">
        <div><b>${esc(sum(valueOf(st)))}</b><small>ferma qiymati</small></div>
        <div><b>${esc(sum(st.stats.earned))}</b><small>jami daromad</small></div>
        <div><b>${st.stats.days}</b><small>boqilgan kun</small></div>
        <div><b>${st.stats.answers ? Math.round((st.stats.right / st.stats.answers) * 100) : 0}%</b><small>to‘g‘ri javob</small></div>
      </div>`;
    const sell = (k) => {
      const n = st.inv[k]; if (!n) return 0;
      const got = n * GOODS[k].price;
      st.money += got; st.stats.earned += got; st.inv[k] = 0;
      log(st, `${n} ${GOODS[k].unit} ${GOODS[k].name.toLowerCase()} sotildi`);
      return got;
    };
    $$("[data-sell]", inner()).forEach((b) => (b.onclick = () => { const g = sell(b.dataset.sell); sfx.coin(); float(`+${sum(g)}`, "money"); save(st); render(); }));
    const all = $("[data-sellall]", inner());
    if (all) all.onclick = () => { const g = Object.keys(GOODS).reduce((s, k) => s + sell(k), 0); sfx.coin(); float(`+${sum(g)}`, "money"); save(st); render(); };
    const c = $("[data-collect]", inner());
    if (c) c.onclick = collect;
  }

  // ---------- Podam (hayvonlar ro'yxati) ----------
  const health = (a) => `<span class="fm-hp"><i style="width:${Math.max(4, a.health ?? 100)}%;background:${a.health < SICK ? "#e5484d" : a.health < 60 ? "#f5a524" : "#30a46c"}"></i></span>`;
  function animalLine(s, a, guest) {
    const K = KINDS[a.t];
    const grow = K.grow ? `${Math.min(a.fed || 0, K.grow)}/${K.grow} kun` : `${a.fed || 0} kun boqildi`;
    return `<button type="button" class="fm-an" data-an="${esc(a.id)}"><span class="ic">${K.icon}</span>
      <span class="t"><b>${esc(a.name)}</b><small>${K.name} · ${grow}${ready(a) ? " · ⭐ tayyor" : ""}${a.health < SICK ? " · 🤒 kasal" : ""}</small>${health(a)}</span>
      <span class="fm-st">${{ fed: "😋", hungry: "🍽️", sick: "🤒", ready: "⭐", product: "🥚", milk: "🥛" }[statusOf(s, a, guest)]}</span></button>`;
  }
  function pHerd() {
    inner().innerHTML = `<h2>🐾 Mening podam <small>${st.animals.length} ta</small></h2>
      ${st.animals.length ? `<div class="fm-herd">${st.animals.map((a) => animalLine(st, a)).join("")}</div>` : `<div class="fm-empty"><p>Hayvonlar yo‘q.</p><button class="btn" type="button" data-go="shop">🛒 Do‘konga</button></div>`}
      ${st.log.length ? `<h3 class="fm-h3">📜 Ferma kundaligi</h3><div class="fm-log">${st.log.slice(-8).reverse().map((l) => `<div><span>${dayLabel(l.d)}</span>${esc(l.t)}</div>`).join("")}</div>` : ""}`;
    $$("[data-an]", inner()).forEach((b) => (b.onclick = () => { closeSheet(); showAnimal(b.dataset.an); }));
    const go = $("[data-go]", inner());
    if (go) go.onclick = () => panel("shop");
  }
  function showAnimal(id) {
    const s = viewing || st;
    if (!s || !root) return;
    const a = s.animals.find((x) => x.id === id);
    if (!a) return;
    if (scene) scene.focus(id);
    speak(id, a.t);
    const K = KINDS[a.t], pop = $("#fmPop", root), guest = !!viewing;
    const sell = Math.round(K.price * SELL_RATE * (a.health < SICK ? 0.6 : 1));
    pop.hidden = false;
    pop.innerHTML = `<button class="fm-pop-x" type="button" aria-label="Yopish">✕</button>
      <div class="fm-pop-h"><span class="ic">${K.icon}</span><span><b>${esc(a.name)}</b><small>${K.name}${guest ? ` · ${esc(short(s.name))}niki` : ""}</small></span></div>
      <div class="fm-pop-row"><span>Sog‘lig‘i</span>${health(a)}<em>${a.health ?? 100}%</em></div>
      <div class="fm-pop-row"><span>Boqilgan</span><em>${a.fed || 0} kun</em></div>
      <div class="fm-pop-row"><span>Foydasi</span><em>${esc(K.note)}</em></div>
      ${guest ? "" : `<div class="fm-pop-row"><span>Holati</span><em>${{ fed: "😋 To‘q", hungry: "🍽️ Och — vazifalarni bajaring", sick: "🤒 Kasal — har kuni boqing", ready: "⭐ Go‘shtga tayyor", product: "🥚 Tuxum qo‘ydi", milk: "🥛 Sut berdi" }[statusOf(s, a)]}</em></div>
      <div class="fm-row">
        ${ready(a) ? `<button class="btn" type="button" data-meat>🥩 Go‘shtga topshirish (+${K.meat} kg)</button>` : ""}
        ${statusOf(s, a) === "hungry" ? `<button class="btn" type="button" data-feed>📋 Boqish</button>` : ""}
        ${statusOf(s, a) === "product" || statusOf(s, a) === "milk" ? `<button class="btn" type="button" data-col>🧺 Yig‘ish</button>` : ""}
        <button class="btn ghost" type="button" data-sellan>Sotish · ${esc(sum(sell))}</button>
      </div>`}`;
    $(".fm-pop-x", pop).onclick = () => { pop.hidden = true; };
    if (guest) return;
    const q = (s2) => $(s2, pop);
    if (q("[data-feed]")) q("[data-feed]").onclick = () => panel("tasks");
    if (q("[data-col]")) q("[data-col]").onclick = () => { collect(); showAnimal(id); };
    if (q("[data-meat]")) q("[data-meat]").onclick = () => {
      if (!confirm(`${a.name}ni go‘shtga topshirasizmi? Sizga ${K.meat} kg go‘sht beriladi.`)) return;
      st.animals = st.animals.filter((x) => x.id !== id);
      st.inv.gosht += K.meat; st.stats.meat += K.meat;
      log(st, `${a.name} (${K.name.toLowerCase()}) — ${K.meat} kg go‘sht`);
      sfx.coin(); float(`🥩 +${K.meat} kg`, "good"); pop.hidden = true;
      save(st); render();
    };
    q("[data-sellan]").onclick = () => {
      if (!confirm(`${a.name}ni ${sum(sell)}ga sotasizmi?`)) return;
      st.animals = st.animals.filter((x) => x.id !== id);
      st.money += sell;
      log(st, `${a.name} sotildi`);
      sfx.coin(); float(`+${sum(sell)}`, "money"); pop.hidden = true;
      save(st); render();
    };
  }

  // ---------- Mehmonga borish ----------
  async function pVisit() {
    const box = inner();
    if (box.dataset.k !== "visit") box.innerHTML = `<h2>🏡 Mehmonga borish</h2><div class="fm-wait"><div class="fm-spin"></div></div>`;
    box.dataset.k = "visit";
    const list = await listFarms();
    if (!root || !sheetFn || sheetFn.key !== "visit") return;
    box.dataset.k = "";
    const me = st && st.name;
    const others = list.filter((f) => f.name !== me);
    box.innerHTML = `<h2>🏡 Mehmonga borish</h2>
      <p class="fm-muted">Boshqa o‘quvchilarning fermalarini 3D ko‘rinishda ko‘ring.</p>
      <input class="fm-search" type="search" placeholder="🔎 Ism bo‘yicha qidirish" aria-label="Qidirish">
      <div class="fm-farms">${others.length ? others.map((f) => `<button type="button" class="fm-farm" data-visit="${esc(f.name)}" data-q="${esc(f.name.toLowerCase())}">
        <span class="av">${esc((short(f.name) || "?")[0])}</span><span class="t"><b>${esc(f.name)}</b><small>${esc(f.cls || "")} · ${f.animals || 0} ta hayvon</small></span><em>${esc(sum(f.value))}</em></button>`).join("")
        : `<p class="fm-muted">Hozircha boshqa fermalar yo‘q. Do‘stlaringizni ham o‘ynashga taklif qiling!</p>`}</div>`;
    $(".fm-search", box).oninput = (e) => { const v = e.target.value.toLowerCase().trim(); $$("[data-visit]", box).forEach((b) => (b.hidden = v && !b.dataset.q.includes(v))); };
    $$("[data-visit]", box).forEach((b) => (b.onclick = () => visit(b.dataset.visit)));
  }
  async function visit(name) {
    const s = await getFarm(name);
    if (!root) return;
    if (!s) { api.toast("Bu ferma topilmadi.", "bad"); return; }
    viewing = s;
    H.busy = false;
    $("#fmSheet", root).hidden = true; sheetFn = null;
    $$("#fmDock [data-p]", root).forEach((b) => b.classList.remove("on"));
    $("#fmPop", root).hidden = true;
    if (scene) { scene.setAnimals([]); scene.overview(); }
    const v = $("#fmVisit", root);
    v.hidden = false;
    v.innerHTML = `<div class="fm-visit-in"><span class="av">${esc((short(s.name) || "?")[0])}</span>
      <span class="t"><b>${esc(s.name)}</b><small>${esc(s.cls || "")} · ${s.animals.length} ta hayvon · ${s.stats.days} kun boqilgan</small></span>
      <span class="fm-chip">💎 ${esc(sum(valueOf(s)))}</span>
      ${st ? `<button class="btn" type="button" data-home>🏠 Fermamga qaytish</button>` : ""}</div>`;
    const h = $("[data-home]", v);
    if (h) h.onclick = backHome;
    api.toast(`🏡 ${short(s.name)}ning fermasidasiz`, "good");
    render();
    setTimeout(chorus, 1200);
  }
  function backHome() {
    viewing = null;
    $("#fmVisit", root).hidden = true;
    $("#fmPop", root).hidden = true;
    if (scene) { scene.setAnimals([]); scene.overview(); }
    render();
  }

  // ---------- Reyting ----------
  async function pRating() {
    const box = inner();
    box.innerHTML = `<h2>🏆 Eng boy fermalar</h2><div class="fm-wait"><div class="fm-spin"></div></div>`;
    const list = (await listFarms()).filter((f) => !/^Mehmon /.test(f.name));
    if (!root || !sheetFn || sheetFn.key !== "rating") return;
    const me = st && st.name;
    box.innerHTML = `<h2>🏆 Eng boy fermalar</h2>
      <p class="fm-muted">Ferma qiymati = pul + hayvonlar + mahsulotlar. Mehmonlar reytingda ko‘rinmaydi.</p>
      <div class="fm-farms">${list.length ? list.slice(0, 30).map((f, i) => `<button type="button" class="fm-farm ${f.name === me ? "me" : ""}" data-visit="${esc(f.name)}">
        <span class="av rank">${["🥇", "🥈", "🥉"][i] || i + 1}</span><span class="t"><b>${esc(f.name)}</b><small>${esc(f.cls || "")} · ${f.animals || 0} ta hayvon</small></span><em>${esc(sum(f.value))}</em></button>`).join("")
        : `<p class="fm-muted">Hali reyting bo‘sh.</p>`}</div>`;
    $$("[data-visit]", box).forEach((b) => (b.onclick = () => (b.dataset.visit === me ? (backHome(), closeSheet()) : visit(b.dataset.visit))));
  }

  window.SofiFarm = { open: (who) => openApp(who || G.session), _state: () => st };
})();
