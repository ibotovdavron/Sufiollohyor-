/* SHAXMAT 3D — faqat do'st bilan onlayn o'yin va jonli kuzatish, Elo reyting.
   Xona egasi (host) o'yin holatini boshqaradi: yurishlarni tekshiradi, soatni yuritadi,
   natijani reytingga yozadi. Raqib va kuzatuvchilar holatni xona kanalidan oladi. */
(() => {
  "use strict";

  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const D = window.CENTER_DATA || {};
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const initials = (n) => String(n || "?").split(" ").slice(0, 2).map((x) => x[0] || "").join("").toUpperCase();

  const TCS = [
    { id: "3+2", base: 180, inc: 2, label: "3+2", sub: "Blits" },
    { id: "5+0", base: 300, inc: 0, label: "5 daq", sub: "Blits" },
    { id: "10+0", base: 600, inc: 0, label: "10 daq", sub: "Rapid" },
    { id: "15+10", base: 900, inc: 10, label: "15+10", sub: "Rapid" },
    { id: "inf", base: 0, inc: 0, label: "∞", sub: "Vaqtsiz" }
  ];
  const tcById = (id) => TCS.find((t) => t.id === id) || TCS[2];
  const START_RATING = 1200;
  const GLYPH = { w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" }, b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" } };
  const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  const REASONS = {
    mate: "Mat!", resign: "Taslim bo‘ldi", time: "Vaqt tugadi", stalemate: "Pat", repetition: "Uch marta takrorlanish",
    material: "Mat qilishga dona yetmaydi", fifty: "50 yurish qoidasi", agreed: "Kelishilgan durang", left: "Raqib o‘yindan chiqib ketdi",
    abort: "O‘yin bekor qilindi"
  };

  // ---------- Kutubxonalarni kerak bo'lganda yuklash ----------
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error(src));
    document.head.appendChild(s);
  });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.Chess) await loadScript("lib/chess.js?v=1");
    if (!window.SofiBoard3D) await loadScript("games/chess3d.js?v=1");
  })().catch((e) => { libs = null; throw e; }));

  // ---------- Ovoz ----------
  const sfx = {
    move() { api.beep(520, 0.05, "triangle", 0.06); setTimeout(() => api.beep(380, 0.04, "triangle", 0.04), 40); },
    capture() { api.beep(240, 0.09, "square", 0.04); setTimeout(() => api.beep(160, 0.08, "triangle", 0.05), 50); },
    check() { [880, 1175].forEach((f, i) => setTimeout(() => api.beep(f, 0.1, "triangle", 0.05), i * 80)); },
    start() { [392, 523, 659, 784].forEach((f, i) => setTimeout(() => api.beep(f, 0.13, "triangle", 0.05), i * 90)); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => api.beep(f, 0.18, "triangle", 0.06), i * 120)); },
    lose() { [392, 330, 262].forEach((f, i) => setTimeout(() => api.beep(f, 0.25, "sine", 0.05), i * 160)); },
    low() { api.beep(1300, 0.04, "square", 0.02); }
  };

  // =========================================================
  // REYTING (Supabase, bo'lmasa shu qurilmada)
  // =========================================================
  const LKEY = "sofi_chess_local_v1";
  const local = {
    get() { try { return JSON.parse(localStorage.getItem(LKEY)) || { ratings: {}, games: {} }; } catch (e) { return { ratings: {}, games: {} }; } },
    set(v) { try { localStorage.setItem(LKEY, JSON.stringify(v)); } catch (e) { /* bo'sh */ } }
  };
  const blank = (name) => ({ name, rating: START_RATING, games: 0, wins: 0, losses: 0, draws: 0, best: START_RATING });
  const Rating = {
    cache: new Map(),
    db() { return window.SofiNet && window.SofiNet.db; },
    async top(n = 20) {
      const db = this.db();
      if (db) {
        try {
          const { data, error } = await db.from("chess_ratings").select("*").gt("games", 0).order("rating", { ascending: false }).limit(n);
          if (!error && data) { data.forEach((r) => this.cache.set(r.name, r)); return data; }
        } catch (e) { /* mahalliyga o'tamiz */ }
      }
      return Object.values(local.get().ratings).filter((r) => r.games > 0).sort((a, b) => b.rating - a.rating).slice(0, n);
    },
    async get(name) {
      if (!name) return blank("?");
      const db = this.db();
      if (db) {
        try {
          const { data, error } = await db.from("chess_ratings").select("*").eq("name", name).maybeSingle();
          if (!error) { const r = data || blank(name); this.cache.set(name, r); return r; }
        } catch (e) { /* mahalliy */ }
      }
      const r = local.get().ratings[name] || blank(name);
      this.cache.set(name, r);
      return r;
    },
    peek(name) { return (this.cache.get(name) || {}).rating || START_RATING; },
    async finish(g) {
      // g: { id, white, black, result: '1-0'|'0-1'|'1/2-1/2', reason, moves, pgn }
      const db = this.db();
      if (db) {
        try {
          const { data, error } = await db.rpc("chess_finish", {
            p_id: g.id, p_white: g.white, p_black: g.black, p_result: g.result,
            p_reason: g.reason, p_moves: g.moves, p_pgn: g.pgn || ""
          });
          if (!error && data) {
            this.cache.delete(g.white); this.cache.delete(g.black);
            return data;
          }
          console.warn("chess_finish:", error);
        } catch (e) { console.warn("chess_finish:", e); }
      }
      // Mahalliy hisob
      const s = local.get();
      if (s.games[g.id]) return s.games[g.id];
      const w = s.ratings[g.white] || blank(g.white), b = s.ratings[g.black] || blank(g.black);
      let dw = 0, dbb = 0;
      if (g.moves >= 2) {
        const exp = 1 / (1 + Math.pow(10, (b.rating - w.rating) / 400));
        const sw = g.result === "1-0" ? 1 : g.result === "0-1" ? 0 : 0.5;
        dw = Math.round((w.games < 20 ? 40 : 24) * (sw - exp));
        dbb = Math.round((b.games < 20 ? 40 : 24) * ((1 - sw) - (1 - exp)));
        const upd = (r, d, score) => {
          r.rating = Math.max(100, r.rating + d); r.games++; r.best = Math.max(r.best || START_RATING, r.rating);
          if (score === 1) r.wins++; else if (score === 0) r.losses++; else r.draws++;
        };
        upd(w, dw, sw); upd(b, dbb, 1 - sw);
      }
      s.ratings[g.white] = w; s.ratings[g.black] = b;
      const out = { white_delta: dw, black_delta: dbb, white_rating: w.rating, black_rating: b.rating, local: true };
      s.games[g.id] = out;
      local.set(s);
      this.cache.set(g.white, w); this.cache.set(g.black, b);
      return out;
    }
  };

  // =========================================================
  // LOBBY: ochiq xonalar va jonli o'yinlar
  // =========================================================
  const rooms = new Map();
  const liveRooms = () => {
    const now = Date.now();
    for (const [k, r] of rooms) if (now - r.seen > 10000) rooms.delete(k);
    return [...rooms.values()];
  };
  let pendingInvite = null;
  api.onMsg((m) => {
    if (!m) return;
    if (m.t === "cs-room") {
      const isNew = !rooms.has(m.code);
      rooms.set(m.code, { ...m, seen: Date.now() });
      if (isNew) document.dispatchEvent(new CustomEvent("cs:rooms"));
    } else if (m.t === "cs-close") {
      rooms.delete(m.code);
      document.dispatchEvent(new CustomEvent("cs:rooms"));
    } else if (m.t === "cs-invite" && m.toCid === G.session.cid) {
      receiveInvite(m);
    }
  });
  setInterval(() => document.dispatchEvent(new CustomEvent("cs:rooms")), 3000);

  function receiveInvite(m) {
    if (root || pendingInvite) return;
    pendingInvite = m;
    const box = document.createElement("div");
    box.className = "cs-invite";
    box.innerHTML = `<div class="cs-invite-in">
        <span class="cs-invite-ico">♞</span>
        <div><b>${esc(m.from)}</b><small>sizni shaxmatga chaqiryapti · ${esc(tcById(m.tc).label)} · #${esc(m.code)}</small></div>
        <button class="cs-btn gold" data-yes type="button">Qabul</button>
        <button class="cs-btn ghost" data-no type="button">Rad</button>
      </div>`;
    document.body.appendChild(box);
    sfx.check();
    const close = () => { box.remove(); pendingInvite = null; };
    const timer = setTimeout(close, 30000);
    $("[data-no]", box).onclick = () => { clearTimeout(timer); close(); };
    $("[data-yes]", box).onclick = async () => {
      clearTimeout(timer); close();
      if (!(await needName())) return;
      openGame(m.code, "guest");
    };
  }

  async function needName() {
    if (G.session.name) return true;
    return api.askName();
  }

  const tcChip = (id) => { const t = tcById(id); return `<span class="cs-tc">${t.id === "inf" ? "∞" : "⏱"} ${esc(t.label)}</span>`; };
  function roomRow(r) {
    if (r.phase === "wait") {
      const mine = r.hostCid === G.session.cid;
      return `<button class="cs-room" type="button" data-play="${esc(r.code)}" ${mine ? "disabled" : ""}>
        <span class="cs-room-av">${esc(initials(r.host))}</span>
        <span class="cs-room-t"><b>${esc(r.host)}</b><small>${esc(r.hostRating || START_RATING)} reyting · ${tcChip(r.tc)} · #${esc(r.code)}</small></span>
        <span class="cs-room-go">${mine ? "Sizniki" : "O‘ynash →"}</span></button>`;
    }
    return `<button class="cs-room live" type="button" data-watch="${esc(r.code)}">
      <span class="cs-live-dot"></span>
      <span class="cs-room-t"><b>♔ ${esc(short(r.w))} <i>vs</i> ♚ ${esc(short(r.b))}</b><small>${esc(r.wr || "")}–${esc(r.br || "")} · ${tcChip(r.tc)} · ${Math.ceil((r.ply || 0) / 2)}-yurish · 👁 ${r.viewers || 0}</small></span>
      <span class="cs-room-go">${r.phase === "end" ? "Tugadi" : "👁 Kuzatish"}</span></button>`;
  }
  function bindRooms(box) {
    $$("[data-play]", box).forEach((b) => (b.onclick = async () => {
      if (!(await needName())) return;
      openGame(b.dataset.play, "guest");
    }));
    $$("[data-watch]", box).forEach((b) => (b.onclick = () => openGame(b.dataset.watch, "viewer")));
  }

  // ---------- O'yinlar sahifasidagi karta ----------
  async function drawCard() {
    const box = document.getElementById("csLive");
    if (box) {
      const list = liveRooms().filter((r) => r.phase !== "end");
      const wait = list.filter((r) => r.phase === "wait"), play = list.filter((r) => r.phase === "play");
      box.innerHTML = (wait.length || play.length)
        ? `${wait.length ? `<div class="cs-live-head"><span class="cs-live-dot"></span> Raqib kutayotganlar</div>${wait.map(roomRow).join("")}` : ""}
           ${play.length ? `<div class="cs-live-head"><span class="cs-live-dot red"></span> Jonli o‘yinlar — kuzating!</div>${play.map(roomRow).join("")}` : ""}`
        : `<div class="cs-live-head muted">Hozircha jonli o‘yin yo‘q — do‘stingizni chaqirib, birinchi bo‘ling!</div>`;
      bindRooms(box);
    }
  }
  async function drawTop() {
    const box = document.getElementById("csTop");
    if (!box) return;
    const top = await Rating.top(5);
    box.innerHTML = `<div class="cs-top-head">🏆 Reyting TOP-5</div>` + (top.length
      ? top.map((r, i) => `<div class="cs-top-row"><span class="n">${["🥇", "🥈", "🥉"][i] || i + 1}</span><b>${esc(r.name)}</b><span class="r">${r.rating}</span></div>`).join("")
      : `<p class="cs-top-empty">Birinchi o‘yinni o‘ynang — reyting shu yerda chiqadi!</p>`);
  }
  document.addEventListener("cs:rooms", () => { drawCard(); if (root && root.dataset.screen === "menu") drawMenuRooms(); });
  setTimeout(() => { drawCard(); drawTop(); }, 400);
  setInterval(drawTop, 60000);
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-cs]");
    if (!b) return;
    const what = b.dataset.cs;
    if (what === "play") { if (!(await needName())) return; openMenu("new"); }
    else openMenu(what);
  });

  // =========================================================
  // SAHNA
  // =========================================================
  let root = null;
  let cleanups = [];
  const onClose = (fn) => cleanups.push(fn);
  function openRoot() {
    closeRoot();
    root = document.createElement("div");
    root.className = "cs";
    root.innerHTML = `
      <div class="cs-bg" aria-hidden="true"><i class="o1"></i><i class="o2"></i><i class="grid"></i></div>
      <header class="cs-bar">
        <button class="cs-exit" type="button">← Chiqish</button>
        <div class="cs-brand"><span>♞</span><b>SHAXMAT</b><em>3D</em></div>
        <div class="cs-bar-r" id="csBarR"></div>
      </header>
      <main class="cs-main" id="csMain"></main>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "cs-open");
    requestAnimationFrame(() => root && root.classList.add("show"));
    $(".cs-exit", root).onclick = () => {
      if (root.dataset.busy === "1" && !confirm("O‘yindan chiqasizmi? Davom etayotgan o‘yinda bu taslim bo‘lish hisoblanadi.")) return;
      closeRoot();
    };
    return $("#csMain", root);
  }
  function closeRoot() {
    cleanups.forEach((fn) => { try { fn(); } catch (e) { console.warn(e); } });
    cleanups = [];
    if (root) root.remove();
    root = null;
    document.body.classList.remove("g-playing", "cs-open");
    drawCard(); drawTop();
  }
  const main = () => $("#csMain", root);

  // ---------- Menyu ----------
  let menuState = { tc: "10+0", color: "r" };
  async function openMenu(focus = "new") {
    const m = openRoot();
    root.dataset.screen = "menu";
    $("#csBarR", root).innerHTML = G.session.name ? `<span class="cs-me">${esc(short(G.session.name))} · <b id="csMyR">…</b></span>` : "";
    if (G.session.name) Rating.get(G.session.name).then((r) => { const el = $("#csMyR", root || document.createElement("i")); if (el) el.textContent = r.rating; });
    m.innerHTML = `
      <div class="cs-menu">
        <section class="cs-panel cs-new" id="csNew">
          <h2>♟ Do‘st bilan o‘ynash</h2>
          <p class="cs-muted">Xona oching va do‘stingizga kodni ayting yoki taklif yuboring. Xona hammaga ko‘rinadi — boshqalar kuzatib turishi mumkin.</p>
          <div class="cs-label">Vaqt nazorati</div>
          <div class="cs-chips" id="csTc">${TCS.map((t) => `<button type="button" class="cs-chip ${t.id === menuState.tc ? "on" : ""}" data-tc="${t.id}"><b>${esc(t.label)}</b><small>${esc(t.sub)}</small></button>`).join("")}</div>
          <div class="cs-label">Rangingiz</div>
          <div class="cs-chips" id="csCol">
            <button type="button" class="cs-chip ${menuState.color === "w" ? "on" : ""}" data-col="w"><b>♔</b><small>Oq</small></button>
            <button type="button" class="cs-chip ${menuState.color === "r" ? "on" : ""}" data-col="r"><b>🎲</b><small>Tasodifiy</small></button>
            <button type="button" class="cs-chip ${menuState.color === "b" ? "on" : ""}" data-col="b"><b>♚</b><small>Qora</small></button>
          </div>
          <button class="cs-btn gold big" id="csCreate" type="button">✨ Xona ochish</button>
          <form class="cs-code" id="csCode">
            <input inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="Xona kodi: 1234" aria-label="Xona kodi">
            <button class="cs-btn" type="submit">Kirish</button>
          </form>
        </section>
        <div class="cs-col">
        <section class="cs-panel" id="csRooms">
          <h2>📡 Xonalar</h2>
          <div id="csRoomList"></div>
        </section>
        <section class="cs-panel" id="csRating">
          <h2>🏆 Shaxmat reytingi</h2>
          <p class="cs-muted">Elo tizimi: hamma 1200 dan boshlaydi. Kuchliroq raqibni yutsangiz ko‘proq ball olasiz.</p>
          <div id="csBoard"><p class="cs-muted">Yuklanmoqda…</p></div>
        </section>
        </div>
      </div>`;
    $$("[data-tc]", m).forEach((b) => (b.onclick = () => { menuState.tc = b.dataset.tc; $$("[data-tc]", m).forEach((x) => x.classList.toggle("on", x === b)); }));
    $$("[data-col]", m).forEach((b) => (b.onclick = () => { menuState.color = b.dataset.col; $$("[data-col]", m).forEach((x) => x.classList.toggle("on", x === b)); }));
    $("#csCreate", m).onclick = async () => {
      if (!(await needName()) || !root) return;
      createRoom(menuState.tc, menuState.color);
    };
    $("#csCode", m).onsubmit = async (e) => {
      e.preventDefault();
      const code = $("input", e.target).value.trim();
      if (!/^\d{4}$/.test(code)) { api.toast("4 xonali kodni kiriting.", "bad"); return; }
      const r = rooms.get(code);
      if (r && r.phase !== "wait") { openGame(code, "viewer"); return; }
      if (!(await needName())) return;
      openGame(code, "guest");
    };
    drawMenuRooms();
    const top = await Rating.top(30);
    const me = G.session.name;
    const bd = $("#csBoard", m);
    if (bd) bd.innerHTML = top.length ? `<div class="cs-table">${top.map((r, i) => `
        <div class="cs-tr ${r.name === me ? "me" : ""}">
          <span class="n">${["🥇", "🥈", "🥉"][i] || i + 1}</span>
          <span class="nm"><b>${esc(r.name)}</b><small>${r.games} o‘yin · ${r.wins} g‘ · ${r.draws} d · ${r.losses} m</small></span>
          <span class="r">${r.rating}</span></div>`).join("")}</div>`
      : `<p class="cs-muted">Hali reytingli o‘yin bo‘lmagan. Birinchi bo‘ling!</p>`;
    const target = { new: "#csNew", watch: "#csRooms", rating: "#csRating" }[focus];
    if (target && focus !== "new") setTimeout(() => { const t = $(target, m); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
  }
  function drawMenuRooms() {
    const box = root && $("#csRoomList", root);
    if (!box) return;
    const list = liveRooms().filter((r) => r.phase !== "end");
    const wait = list.filter((r) => r.phase === "wait"), play = list.filter((r) => r.phase === "play");
    box.innerHTML = `
      <div class="cs-label">⏳ Raqib kutayotganlar</div>
      ${wait.length ? wait.map(roomRow).join("") : `<p class="cs-muted">Hozir ochiq xona yo‘q.</p>`}
      <div class="cs-label">🔴 Jonli o‘yinlar — kuzatish</div>
      ${play.length ? play.map(roomRow).join("") : `<p class="cs-muted">Hozir hech kim o‘ynamayapti.</p>`}`;
    bindRooms(box);
  }

  // =========================================================
  // HOST: xona egasi — o'yin holatini boshqaradi
  // =========================================================
  async function createRoom(tcId, colorPref) {
    let code;
    do { code = String(1000 + Math.floor(Math.random() * 9000)); } while (rooms.has(code));
    const me = G.session;
    main().innerHTML = `<div class="cs-wait"><span class="cs-spin"></span><p>Xona ochilmoqda…</p></div>`;
    let room = null;
    try {
      await Promise.all([loadLibs(), window.SofiNet.init()]);
    } catch (e) {
      main().innerHTML = `<div class="cs-wait"><p>❌ O‘yin fayllari yuklanmadi. Internetni tekshiring.</p></div>`;
      return;
    }
    if (!root) return;
    const myRating = (await Rating.get(me.name)).rating;
    const tc = tcById(tcId);
    const myColor = colorPref === "r" ? (Math.random() < 0.5 ? "w" : "b") : colorPref;
    const S = {
      t: "state", code, phase: "wait", tc: tc.id,
      players: { w: null, b: null },
      moves: [], clock: { w: tc.base * 1000, b: tc.base * 1000 }, turnStart: 0,
      result: null, draw: null, rematch: { w: false, b: false }, viewers: 0, gameId: null, deltas: null, startedAt: 0
    };
    S.players[myColor] = { name: me.name, cls: me.cls, cid: me.cid, rating: myRating };
    const chess = new window.Chess();
    const seen = { w: Date.now(), b: Date.now() };
    let ui = null;

    const snap = () => {
      const now = Date.now();
      const turn = S.moves.length % 2 ? "b" : "w";
      const left = { ...S.clock };
      if (S.phase === "play" && tc.base && S.moves.length >= 2) left[turn] = Math.max(0, left[turn] - (now - S.turnStart));
      return { ...S, left, sent: now };
    };
    const deliver = (msg) => { if (room) room.send(msg); if (ui) ui.onMsg(msg); };
    const push = () => deliver(snap());
    const announce = () => api.send({
      t: "cs-room", code, host: me.name, hostCid: me.cid, hostRating: myRating, tc: tc.id, phase: S.phase,
      w: S.players.w && S.players.w.name, b: S.players.b && S.players.b.name,
      wr: S.players.w && S.players.w.rating, br: S.players.b && S.players.b.rating,
      viewers: S.viewers, ply: S.moves.length
    });
    const colorOf = (cid, name) => (["w", "b"].find((c) => S.players[c] && (S.players[c].cid === cid || (name && S.players[c].name === name))) || null);

    function startGame() {
      chess.reset();
      S.phase = "play";
      S.moves = [];
      S.clock = { w: tc.base * 1000, b: tc.base * 1000 };
      S.turnStart = Date.now();
      S.startedAt = Date.now();
      S.result = null; S.draw = null; S.deltas = null;
      S.rematch = { w: false, b: false };
      S.gameId = code + "-" + Date.now().toString(36);
      push(); announce();
    }

    async function finish(score, reason) {
      if (S.phase !== "play") return;
      S.phase = "end";
      S.result = { score, reason };
      S.draw = null;
      push(); announce();
      if (reason === "abort" || S.moves.length < 2) return;
      const out = await Rating.finish({
        id: S.gameId, white: S.players.w.name, black: S.players.b.name, result: score, reason, moves: S.moves.length,
        pgn: (() => { try { return chess.pgn(); } catch (e) { return ""; } })()
      });
      S.deltas = { w: out.white_delta, b: out.black_delta, wr: out.white_rating, br: out.black_rating };
      S.players.w.rating = out.white_rating;
      S.players.b.rating = out.black_rating;
      push();
    }

    function afterMove() {
      if (chess.in_checkmate()) return finish(chess.turn() === "w" ? "0-1" : "1-0", "mate");
      if (chess.in_stalemate()) return finish("1/2-1/2", "stalemate");
      if (chess.in_threefold_repetition()) return finish("1/2-1/2", "repetition");
      if (chess.insufficient_material()) return finish("1/2-1/2", "material");
      if (chess.in_draw()) return finish("1/2-1/2", "fifty");
      push(); announce();
    }

    function engine(m) {
      if (!m || m.code !== code) return;
      const c = colorOf(m.cid, null);
      if (c) seen[c] = Date.now();
      switch (m.t) {
        case "hello": push(); break;
        case "sit": {
          const already = colorOf(m.cid, m.name);
          if (already) { S.players[already].cid = m.cid; push(); break; }
          if (S.phase !== "wait") { push(); break; }
          const free = !S.players.w ? "w" : !S.players.b ? "b" : null;
          if (!free) { push(); break; }
          S.players[free] = { name: m.name, cls: m.cls, cid: m.cid, rating: m.rating || START_RATING };
          seen[free] = Date.now();
          startGame();
          break;
        }
        case "move": {
          if (S.phase !== "play" || !c || m.ply !== S.moves.length) { push(); break; }
          if (chess.turn() !== c) { push(); break; }
          const mv = chess.move({ from: m.uci.slice(0, 2), to: m.uci.slice(2, 4), promotion: m.uci[4] || "q" });
          if (!mv) { push(); break; }
          const now = Date.now();
          if (tc.base && S.moves.length >= 2) {
            S.clock[c] = Math.max(0, S.clock[c] - (now - S.turnStart)) + tc.inc * 1000;
          }
          S.moves.push(m.uci.slice(0, 4) + (mv.promotion || ""));
          S.turnStart = now;
          if (S.draw && S.draw !== c) S.draw = null;
          afterMove();
          break;
        }
        case "resign":
          if (S.phase === "play" && c) finish(c === "w" ? "0-1" : "1-0", S.moves.length < 2 ? "abort" : "resign");
          break;
        case "draw-offer":
          if (S.phase === "play" && c && !S.draw && S.moves.length >= 2) { S.draw = c; push(); }
          break;
        case "draw-answer":
          if (S.phase === "play" && c && S.draw && S.draw !== c) {
            if (m.yes) finish("1/2-1/2", "agreed"); else { S.draw = null; push(); }
          }
          break;
        case "rematch":
          if (S.phase === "end" && c) {
            S.rematch[c] = true;
            if (S.rematch.w && S.rematch.b) {
              const w = S.players.w; S.players.w = S.players.b; S.players.b = w;
              startGame();
            } else push();
          }
          break;
        case "leave":
          if (!c) break;
          if (S.phase === "play") finish(c === "w" ? "0-1" : "1-0", S.moves.length < 2 ? "abort" : "left");
          else if (S.phase === "end") { S.rematch[c] = false; S.leftCid = m.cid; push(); }
          break;
        case "react": if (ui) ui.onMsg(m); break;
        default: break;
      }
    }

    function onPresence(list) {
      const viewers = list.filter((p) => p && p.role === "viewer").length;
      ["w", "b"].forEach((c) => { const p = S.players[c]; if (p && list.some((x) => x && x.cid === p.cid)) seen[c] = Date.now(); });
      if (viewers !== S.viewers) { S.viewers = viewers; push(); }
    }

    try {
      room = await window.SofiNet.join("cs-" + code, { meta: { cid: me.cid, name: me.name, role: "host" }, onMsg: engine, onPresence });
    } catch (e) {
      main().innerHTML = `<div class="cs-wait"><p>❌ Xona ochib bo‘lmadi. Internetni tekshiring.</p><button class="cs-btn" type="button" id="csBack">Menyu</button></div>`;
      $("#csBack", root).onclick = () => openMenu();
      return;
    }
    if (!root) { room.leave(); return; }

    // Soat va aloqa nazorati
    const tick = setInterval(() => {
      if (S.phase !== "play") return;
      const now = Date.now();
      const turn = chess.turn();
      if (tc.base && S.moves.length >= 2 && S.clock[turn] - (now - S.turnStart) <= 0) {
        S.clock[turn] = 0;
        const other = turn === "w" ? "b" : "w";
        const hasMaterial = chess.board().flat().some((p) => p && p.color === other && p.type !== "k");
        finish(hasMaterial ? (turn === "w" ? "0-1" : "1-0") : "1/2-1/2", "time");
        return;
      }
      const opp = ["w", "b"].find((c) => S.players[c] && S.players[c].cid !== me.cid);
      if (opp && now - seen[opp] > 45000) finish(opp === "w" ? "0-1" : "1-0", S.moves.length < 2 ? "abort" : "left");
    }, 250);
    const beat = setInterval(() => { push(); announce(); }, 3000);
    announce();
    onClose(() => {
      clearInterval(tick); clearInterval(beat);
      if (S.phase === "play") engine({ t: "leave", code, cid: me.cid });
      api.send({ t: "cs-close", code });
      if (room) setTimeout(() => room.leave(), 300);
    });

    ui = gameView(code, "host", { send: (msg) => {
      const full = { ...msg, code, cid: me.cid, name: me.name };
      if (msg.t === "react") { if (room) room.send(full); return; }
      engine(full);
    } });
    push();
  }

  // =========================================================
  // MEHMON yoki KUZATUVCHI
  // =========================================================
  async function openGame(code, role) {
    openRoot();
    main().innerHTML = `<div class="cs-wait"><span class="cs-spin"></span><p>#${esc(code)} xonasiga ulanmoqda…</p></div>`;
    try { await Promise.all([loadLibs(), window.SofiNet.init()]); }
    catch (e) { main().innerHTML = `<div class="cs-wait"><p>❌ O‘yin fayllari yuklanmadi. Internetni tekshiring.</p></div>`; return; }
    if (!root) return;
    const me = G.session;
    const cid = me.cid || window.SofiNet.randomId();
    const name = me.name || "Mehmon";
    let room = null, ui = null, gotState = false;
    const myRating = role === "guest" ? (await Rating.get(name)).rating : 0;
    const send = (msg) => room && room.send({ ...msg, code, cid, name, cls: me.cls, rating: myRating });
    try {
      room = await window.SofiNet.join("cs-" + code, {
        meta: { cid, name, role: role === "guest" ? "player" : "viewer" },
        onMsg: (m) => { if (m && m.code === code && m.t === "state") gotState = true; ui && ui.onMsg(m); },
        onPresence: () => {}
      });
    } catch (e) {
      main().innerHTML = `<div class="cs-wait"><p>❌ Xonaga ulanib bo‘lmadi.</p><button class="cs-btn" id="csBack" type="button">Menyu</button></div>`;
      $("#csBack", root).onclick = () => openMenu();
      return;
    }
    if (!root) { room.leave(); return; }
    ui = gameView(code, role, { send });
    const hello = setInterval(() => { if (!gotState) send({ t: role === "guest" ? "sit" : "hello" }); }, 1000);
    send({ t: role === "guest" ? "sit" : "hello" });
    const notFound = setTimeout(() => { if (!gotState && root) ui.gone("Bunday xona topilmadi yoki yopilgan."); }, 10000);
    onClose(() => {
      clearInterval(hello); clearTimeout(notFound);
      if (role === "guest") send({ t: "leave" });
      if (room) setTimeout(() => room.leave(), 300);
    });
  }

  // =========================================================
  // O'YIN EKRANI (hamma uchun bir xil)
  // =========================================================
  function gameView(code, role, net) {
    const me = G.session;
    const myCid = me.cid;
    const m = main();
    root.dataset.screen = "game";
    m.innerHTML = `
      <div class="cs-game">
        <div class="cs-stage">
          <div class="cs-pl top" id="csTopPl"></div>
          <div class="cs-3d" id="cs3d">
            <div class="cs-banner" id="csBanner" hidden></div>
            <div class="cs-floats" id="csFloats"></div>
            <div class="cs-promo" id="csPromo" hidden></div>
            <div class="cs-overlay" id="csOverlay" hidden></div>
            <div class="cs-view-btns">
              <button type="button" class="cs-round" id="csFlip" title="Taxtani aylantirish">🔄</button>
              <button type="button" class="cs-round" id="csCenter" title="Ko‘rinishni tiklash">🎯</button>
            </div>
          </div>
          <div class="cs-pl bottom" id="csBotPl"></div>
        </div>
        <aside class="cs-side">
          <div class="cs-status" id="csStatus">Ulanmoqda…</div>
          <div class="cs-moves" id="csMoves"></div>
          <div class="cs-actions" id="csActions"></div>
          <div class="cs-reacts" id="csReacts">${["👏", "🔥", "😮", "😂", "🤝", "♟"].map((e) => `<button type="button" data-react="${e}">${e}</button>`).join("")}</div>
        </aside>
      </div>`;
    root.dataset.busy = "";

    const chess = new window.Chess();
    let S = null, recvAt = 0, myColor = null, sel = null, board = null, ended = false;
    let localMoves = [];
    let lastSound = 0;
    let lastEndKey = "";
    try {
      board = new window.SofiBoard3D($("#cs3d", m), { orientation: "w", onSquare });
    } catch (e) {
      $("#cs3d", m).insertAdjacentHTML("beforeend", `<div class="cs-nogl">😔 Qurilmangiz 3D grafikani qo‘llamaydi (WebGL). Boshqa brauzer yoki qurilmadan urinib ko‘ring.</div>`);
    }
    if (board) board.setPosition(chess.board());
    root.__board = board;
    onClose(() => { if (board) board.destroy(); board = null; });

    $("#csFlip", m).onclick = () => board && board.flip();
    $("#csCenter", m).onclick = () => board && board.setOrientation(myColor || "w");
    $$("[data-react]", m).forEach((b) => (b.onclick = () => {
      const e = b.dataset.react;
      net.send({ t: "react", e });
      floatEmoji(e, short(me.name || "Mehmon"));
    }));

    const turn = () => (S ? (S.moves.length % 2 ? "b" : "w") : "w");
    const isPlayer = () => !!myColor;
    const myTurn = () => S && S.phase === "play" && myColor && chess.turn() === myColor;

    // ---------- Holatni qabul qilish ----------
    function onMsg(msg) {
      if (!msg || msg.code !== code || !root) return;
      if (msg.t === "react") { if (msg.cid !== myCid) floatEmoji(msg.e, short(msg.name)); return; }
      if (msg.t !== "state") return;
      lastSeen = Date.now();
      const prev = S;
      S = msg;
      recvAt = Date.now();
      myColor = ["w", "b"].find((c) => S.players[c] && S.players[c].cid === myCid) ||
        (role !== "viewer" && me.name ? ["w", "b"].find((c) => S.players[c] && S.players[c].name === me.name) : null) || null;
      if (myColor && (!prev || prev.gameId !== S.gameId)) {
        board && board.setOrientation(myColor, !!prev);
      }
      root.dataset.busy = S.phase === "play" && myColor ? "1" : "";
      if (prev && prev.gameId !== S.gameId && S.phase === "play") { sfx.start(); resetTo([]); }
      syncMoves(S.moves);
      drawAll();
      if (S.phase === "end") showEnd();
    }

    function resetTo(list) {
      chess.reset();
      list.forEach((u) => chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || "q" }));
      localMoves = list.slice();
      sel = null;
      if (board) board.setPosition(chess.board());
    }
    function syncMoves(list) {
      const same = list.length === localMoves.length && list.every((u, i) => u === localMoves[i]);
      if (same) return;
      const prefix = localMoves.every((u, i) => list[i] === u);
      if (prefix && list.length === localMoves.length + 1) {
        const u = list[list.length - 1];
        const mv = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || "q" });
        if (mv) { localMoves.push(u); animate(mv); return; }
      }
      resetTo(list);
    }
    function animate(mv) {
      sel = null;
      if (board) board.playMove(mv, chess.board());
      const now = Date.now();
      if (now - lastSound > 60) {
        lastSound = now;
        if (chess.in_check()) sfx.check(); else if (mv.captured) sfx.capture(); else sfx.move();
      }
    }

    // ---------- Yurish qilish ----------
    function legalFrom(sq) { return chess.moves({ square: sq, verbose: true }); }
    function onSquare(first, all) {
      let sq = first;
      if (sel && all && all.length > 1) {
        // Dona orqasidagi katak: avval mumkin yurishlardan birini tanlaymiz
        const targets = legalFrom(sel).map((x) => x.to);
        sq = all.find((s) => targets.includes(s)) || first;
      }
      if (!S || !myTurn() || ended) {
        if (S && S.phase === "play" && myColor && chess.turn() !== myColor) flash("Raqib navbati — kuting");
        return;
      }
      const piece = chess.get(sq);
      if (sel) {
        const mv = legalFrom(sel).filter((x) => x.to === sq);
        if (mv.length) {
          if (mv.some((x) => x.promotion)) askPromotion(sel, sq);
          else play(sel + sq);
          return;
        }
      }
      if (piece && piece.color === myColor) { sel = sel === sq ? null : sq; drawMarks(); if (sel) sfx.low(); return; }
      sel = null;
      drawMarks();
    }
    function play(uci) {
      const mv = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || "q" });
      if (!mv) return;
      const full = uci.slice(0, 4) + (mv.promotion || "");
      localMoves.push(full);
      animate(mv);
      net.send({ t: "move", uci: full, ply: localMoves.length - 1 });
      drawAll();
    }
    function askPromotion(from, to) {
      const box = $("#csPromo", m);
      box.hidden = false;
      box.innerHTML = `<b>Piyoda nimaga aylansin?</b><div>${["q", "r", "b", "n"].map((p) => `<button type="button" data-pr="${p}">${GLYPH[myColor][p]}</button>`).join("")}</div>`;
      $$("[data-pr]", box).forEach((b) => (b.onclick = () => { box.hidden = true; play(from + to + b.dataset.pr); }));
    }

    // ---------- Chizish ----------
    function drawMarks() {
      if (!board) return;
      const hist = chess.history({ verbose: true });
      const last = hist.length ? [hist[hist.length - 1].from, hist[hist.length - 1].to] : null;
      let check = null;
      if (chess.in_check()) {
        const t = chess.turn();
        chess.board().forEach((row, i) => row.forEach((p, j) => { if (p && p.type === "k" && p.color === t) check = "abcdefgh"[j] + (8 - i); }));
      }
      const moves = sel ? legalFrom(sel).map((x) => ({ to: x.to, capture: !!x.captured })) : [];
      board.setMarks({ last, sel, check, moves });
    }

    function captured(color) {
      // color rangidagi o'yinchi olgan donalar (raqibning yo'qolgan donalari)
      const opp = color === "w" ? "b" : "w";
      const full = { p: 8, n: 2, b: 2, r: 2, q: 1 };
      const have = { p: 0, n: 0, b: 0, r: 0, q: 0 };
      chess.board().flat().forEach((p) => { if (p && p.color === opp && p.type !== "k") have[p.type]++; });
      const out = [];
      ["q", "r", "b", "n", "p"].forEach((t) => { for (let i = have[t]; i < full[t]; i++) out.push(t); });
      return out;
    }
    const material = (color) => chess.board().flat().reduce((s, p) => s + (p && p.color === color ? VALUE[p.type] : 0), 0);

    function clockLeft(c) {
      if (!S) return 0;
      const tc = tcById(S.tc);
      if (!tc.base) return null;
      let left = S.left ? S.left[c] : S.clock[c];
      if (S.phase === "play" && turn() === c && S.moves.length >= 2) left -= Date.now() - recvAt;
      return Math.max(0, left);
    }
    const fmt = (ms) => {
      if (ms === null) return "∞";
      const s = Math.ceil(ms / 1000);
      if (ms < 10000) return (ms / 1000).toFixed(1);
      return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
    };

    function playerHTML(c) {
      const p = S && S.players[c];
      const opp = c === "w" ? "b" : "w";
      const caps = captured(c);
      const diff = material(c) - material(opp);
      const delta = S && S.deltas ? S.deltas[c] : null;
      const active = S && S.phase === "play" && turn() === c;
      const ms = clockLeft(c);
      return `
        <div class="cs-av ${c}">${p ? esc(initials(p.name)) : "?"}</div>
        <div class="cs-pi">
          <b>${p ? esc(p.name) : `<span class="cs-muted">Raqib kutilmoqda…</span>`}${p && p.cid === myCid ? ` <em class="cs-you">siz</em>` : ""}</b>
          <small>${GLYPH[c].k} ${c === "w" ? "Oq" : "Qora"}${p ? ` · <span class="cs-rt">${p.rating || START_RATING}</span>` : ""}${delta !== null && delta !== undefined ? ` <span class="cs-delta ${delta >= 0 ? "up" : "down"}">${delta >= 0 ? "+" : ""}${delta}</span>` : ""}${p && p.cls ? ` · ${esc(p.cls)}` : ""}</small>
          <span class="cs-caps">${caps.map((t) => GLYPH[opp][t]).join("")}${diff > 0 ? ` <i>+${diff}</i>` : ""}</span>
        </div>
        <div class="cs-clock ${active ? "on" : ""} ${ms !== null && ms < 20000 && active ? "low" : ""}" data-clock="${c}">${fmt(ms)}</div>`;
    }

    function drawPlayers() {
      const bottom = myColor || "w";
      const top = bottom === "w" ? "b" : "w";
      $("#csTopPl", m).innerHTML = playerHTML(top);
      $("#csBotPl", m).innerHTML = playerHTML(bottom);
    }
    function drawMoves() {
      const hist = chess.history();
      let html = "";
      for (let i = 0; i < hist.length; i += 2) {
        html += `<div class="cs-mv"><span class="n">${i / 2 + 1}.</span><span class="${i === hist.length - 1 ? "last" : ""}">${esc(hist[i])}</span><span class="${i + 1 === hist.length - 1 ? "last" : ""}">${esc(hist[i + 1] || "")}</span></div>`;
      }
      const box = $("#csMoves", m);
      box.innerHTML = html || `<p class="cs-muted">Yurishlar shu yerda ko‘rinadi.</p>`;
      box.scrollTop = box.scrollHeight;
    }
    function drawStatus() {
      const st = $("#csStatus", m);
      if (!S) return;
      let t = "", cls = "";
      if (S.phase === "wait") {
        t = myColor ? `⏳ Raqib kutilmoqda. Xona kodi: <b>#${esc(code)}</b>` : "⏳ O‘yinchilar kutilmoqda…";
      } else if (S.phase === "play") {
        const inCheck = chess.in_check();
        if (myColor) {
          if (chess.turn() === myColor) { t = inCheck ? "⚠️ Shax! Shohingizni himoya qiling" : "🟢 Sizning navbatingiz"; cls = inCheck ? "warn" : "go"; }
          else t = "⏳ Raqib o‘ylayapti…";
        } else {
          t = `👁 Kuzatuv · ${chess.turn() === "w" ? "Oq" : "Qora"} yuradi${inCheck ? " · Shax!" : ""}`;
          cls = inCheck ? "warn" : "";
        }
        if (S.draw && myColor && S.draw !== myColor) {
          t = `🤝 Raqib durang taklif qildi <span class="cs-inline"><button type="button" class="cs-btn tiny gold" data-dr="1">Qabul</button><button type="button" class="cs-btn tiny ghost" data-dr="0">Rad</button></span>`;
          cls = "warn";
        } else if (S.draw && myColor === S.draw) t = "🤝 Durang taklif yuborildi…";
      } else if (S.phase === "end") {
        t = resultText();
        cls = "end";
      }
      st.className = "cs-status " + cls;
      st.innerHTML = t;
      $$("[data-dr]", st).forEach((b) => (b.onclick = () => net.send({ t: "draw-answer", yes: b.dataset.dr === "1" })));
    }
    function resultText() {
      if (!S || !S.result) return "";
      const r = S.result;
      if (r.reason === "abort") return "⛔ " + REASONS.abort;
      if (r.score === "1/2-1/2") return `🤝 Durang · ${REASONS[r.reason] || ""}`;
      const w = r.score === "1-0" ? "w" : "b";
      const p = S.players[w];
      return `🏆 ${w === "w" ? "Oq" : "Qora"} g‘alaba qozondi${p ? ` — ${esc(p.name)}` : ""} · ${REASONS[r.reason] || ""}`;
    }
    function drawActions() {
      const box = $("#csActions", m);
      if (!S) { box.innerHTML = ""; return; }
      let html = "";
      if (myColor && S.phase === "play") {
        html += `<button type="button" class="cs-btn ghost" data-act="draw" ${S.draw || S.moves.length < 2 ? "disabled" : ""}>🤝 Durang</button>`;
        html += `<button type="button" class="cs-btn danger" data-act="resign">🏳️ ${S.moves.length < 2 ? "Bekor qilish" : "Taslim"}</button>`;
      }
      if (myColor && S.phase === "wait") html += `<button type="button" class="cs-btn gold" data-act="invite">📨 Do‘stni taklif qilish</button>`;
      if (S.phase === "end" && myColor) html += `<button type="button" class="cs-btn gold" data-act="rematch" ${S.rematch && S.rematch[myColor] ? "disabled" : ""}>🔁 ${S.rematch && S.rematch[myColor] ? "Kutilmoqda…" : "Qayta o‘ynash"}</button>`;
      html += `<button type="button" class="cs-btn ghost" data-act="menu">📋 Menyu</button>`;
      html += `<span class="cs-viewers">👁 ${S.viewers || 0} kuzatuvchi</span>`;
      box.innerHTML = html;
      $$("[data-act]", box).forEach((b) => (b.onclick = () => action(b.dataset.act)));
    }
    function action(a) {
      if (a === "draw") net.send({ t: "draw-offer" });
      else if (a === "resign") { if (confirm(S.moves.length < 2 ? "O‘yinni bekor qilasizmi?" : "Rostdan ham taslim bo‘lasizmi?")) net.send({ t: "resign" }); }
      else if (a === "rematch") net.send({ t: "rematch" });
      else if (a === "invite") inviteFriend();
      else if (a === "menu") {
        if (S && S.phase === "play" && myColor && !confirm("O‘yindan chiqasizmi? Bu taslim bo‘lish hisoblanadi.")) return;
        openMenu("watch");
      }
    }
    function drawAll() {
      drawPlayers(); drawMoves(); drawStatus(); drawActions(); drawMarks();
      $("#csBarR", root).innerHTML = `<span class="cs-code-chip">#${esc(code)}</span>${S ? tcChip(S.tc) : ""}<span class="cs-eye">👁 ${S ? S.viewers || 0 : 0}</span>`;
      const ov = $("#csOverlay", m);
      if (S && S.phase !== "wait") inviteOpen = false;
      if (inviteOpen) return;
      if (S && S.phase === "wait") {
        ov.hidden = false;
        ov.className = "cs-overlay wait";
        ov.innerHTML = myColor
          ? `<div class="cs-ov-card"><span class="cs-ov-ico">♞</span><h3>Raqib kutilmoqda</h3><p>Do‘stingizga xona kodini ayting:</p><div class="cs-bigcode">${esc(code.split("").join(" "))}</div><p class="cs-muted">yoki pastdagi “Do‘stni taklif qilish” tugmasini bosing.</p><button class="cs-btn gold" type="button" data-inv>📨 Taklif yuborish</button></div>`
          : `<div class="cs-ov-card"><span class="cs-ov-ico">⏳</span><h3>O‘yin hali boshlanmadi</h3><p>Ikkinchi o‘yinchi kutilmoqda.</p></div>`;
        const ib = $("[data-inv]", ov);
        if (ib) ib.onclick = inviteFriend;
      } else if (S && S.phase === "play") { ov.hidden = true; ov.className = "cs-overlay"; }
    }
    let inviteOpen = false;

    function showEnd() {
      const key = S.gameId + "|" + (S.deltas ? "d" : "") + "|" + JSON.stringify(S.rematch);
      if (key === lastEndKey) return;
      const firstShow = !lastEndKey.startsWith(S.gameId + "|");
      lastEndKey = key;
      const r = S.result || {};
      const winC = r.score === "1-0" ? "w" : r.score === "0-1" ? "b" : null;
      const iWon = myColor && winC === myColor, iLost = myColor && winC && winC !== myColor;
      if (firstShow) {
        if (iWon) { sfx.win(); confetti(); } else if (iLost) sfx.lose(); else sfx.check();
      }
      const ov = $("#csOverlay", m);
      ov.hidden = false;
      ov.className = "cs-overlay end";
      const head = r.reason === "abort" ? "O‘yin bekor qilindi" : !winC ? "Durang!" : myColor ? (iWon ? "G‘alaba!" : "Mag‘lubiyat") : `${winC === "w" ? "Oq" : "Qora"} yutdi!`;
      const ico = r.reason === "abort" ? "⛔" : !winC ? "🤝" : myColor ? (iWon ? "🏆" : "😔") : "🏆";
      const line = (c) => {
        const p = S.players[c];
        if (!p) return "";
        const d = S.deltas ? S.deltas[c] : null;
        return `<div class="cs-ov-pl ${winC === c ? "win" : ""}"><span>${GLYPH[c].k} ${esc(p.name)}</span><b>${p.rating || START_RATING}${d !== null && d !== undefined ? ` <em class="${d >= 0 ? "up" : "down"}">${d >= 0 ? "+" : ""}${d}</em>` : ""}</b></div>`;
      };
      ov.innerHTML = `<div class="cs-ov-card ${iWon ? "gold" : ""}">
          <span class="cs-ov-ico">${ico}</span>
          <h3>${head}</h3>
          <p>${esc(REASONS[r.reason] || "")} · ${Math.ceil(S.moves.length / 2)} yurish</p>
          ${line("w")}${line("b")}
          ${r.reason !== "abort" && S.moves.length >= 2 && !S.deltas ? `<p class="cs-muted">Reyting hisoblanmoqda…</p>` : ""}
          <div class="cs-ov-btns">
            ${myColor ? `<button class="cs-btn gold" type="button" data-ov="rematch" ${S.rematch && S.rematch[myColor] ? "disabled" : ""}>🔁 ${S.rematch && S.rematch[myColor] ? "Raqib kutilmoqda…" : (S.rematch && S.rematch[myColor === "w" ? "b" : "w"] ? "Raqib qayta o‘ynamoqchi — Qabul!" : "Qayta o‘ynash")}</button>` : ""}
            <button class="cs-btn ghost" type="button" data-ov="board">♟ Taxtani ko‘rish</button>
            <button class="cs-btn ghost" type="button" data-ov="menu">📋 Menyu</button>
          </div></div>`;
      $$("[data-ov]", ov).forEach((b) => (b.onclick = () => {
        const a = b.dataset.ov;
        if (a === "board") { ov.hidden = true; }
        else if (a === "menu") openMenu("rating");
        else net.send({ t: "rematch" });
      }));
      ended = true;
    }

    function inviteFriend() {
      const seen = new Set();
      const list = (api.online || []).filter((p) => p && p.name && p.cid !== myCid && !seen.has(p.name) && seen.add(p.name));
      const ov = $("#csOverlay", m);
      inviteOpen = true;
      ov.hidden = false;
      ov.className = "cs-overlay wait";
      ov.innerHTML = `<div class="cs-ov-card wide"><span class="cs-ov-ico">📨</span><h3>Kimni chaqiramiz?</h3>
        ${list.length ? `<div class="cs-online">${list.map((p) => `<button type="button" class="cs-room" data-to="${esc(p.cid)}"><span class="cs-room-av">${esc(initials(p.name))}</span><span class="cs-room-t"><b>${esc(p.name)}</b><small>${esc(p.cls || "")}${p.status === "playing" ? " · o‘ynayapti" : " · onlayn"}</small></span><span class="cs-room-go">Taklif →</span></button>`).join("")}</div>`
          : `<p class="cs-muted">Hozir saytda boshqa hech kim onlayn emas. Do‘stingizga <b>#${esc(code)}</b> kodini yuboring — u O‘yinlar → Shaxmat → “Kod bilan kirish”dan kiradi.</p>`}
        <button class="cs-btn ghost" type="button" data-back>← Orqaga</button></div>`;
      $("[data-back]", ov).onclick = () => { inviteOpen = false; drawAll(); };
      $$("[data-to]", ov).forEach((b) => (b.onclick = () => {
        api.send({ t: "cs-invite", toCid: b.dataset.to, code, from: me.name, tc: S ? S.tc : "10+0" });
        b.disabled = true;
        $(".cs-room-go", b).textContent = "Yuborildi ✓";
        api.toast("Taklif yuborildi!", "good");
      }));
    }

    function floatEmoji(e, who) {
      const box = $("#csFloats", m);
      if (!box) return;
      const el = document.createElement("span");
      el.className = "cs-float";
      el.style.left = 10 + Math.random() * 75 + "%";
      el.innerHTML = `${esc(e)}<small>${esc(who || "")}</small>`;
      box.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    }
    function flash(text) {
      const b = $("#csBanner", m);
      b.hidden = false;
      b.textContent = text;
      clearTimeout(flash.t);
      flash.t = setTimeout(() => (b.hidden = true), 1400);
    }
    function confetti() {
      const box = document.createElement("div");
      box.className = "g-confetti";
      const colors = ["#f5c84c", "#00f59b", "#38bdf8", "#f472b6", "#ffffff"];
      for (let i = 0; i < 110; i++) {
        const p = document.createElement("i");
        p.style.left = Math.random() * 100 + "%";
        p.style.background = colors[i % colors.length];
        p.style.animationDelay = Math.random() * 0.7 + "s";
        p.style.animationDuration = 2 + Math.random() * 1.8 + "s";
        box.appendChild(p);
      }
      document.body.appendChild(box);
      setTimeout(() => box.remove(), 5000);
    }

    // Soatlarni yangilash va xona egasini kuzatish
    let lastSeen = Date.now(), lowBeep = 0, reported = false;
    const clockTimer = setInterval(() => {
      if (!S || !root) return;
      ["w", "b"].forEach((c) => {
        const el = $(`[data-clock="${c}"]`, m);
        if (!el) return;
        const ms = clockLeft(c);
        el.textContent = fmt(ms);
        const active = S.phase === "play" && turn() === c;
        el.classList.toggle("on", active);
        el.classList.toggle("low", active && ms !== null && ms < 20000);
        if (active && c === myColor && ms !== null && ms < 10000 && Date.now() - lowBeep > 1000) { lowBeep = Date.now(); sfx.low(); }
      });
      if (role !== "host" && Date.now() - lastSeen > 20000 && !ended) {
        if (S.phase === "play" && myColor && !reported && S.moves.length >= 2) {
          reported = true;
          const w = S.players.w, b = S.players.b;
          Rating.finish({ id: S.gameId, white: w.name, black: b.name, result: myColor === "w" ? "1-0" : "0-1", reason: "left", moves: S.moves.length, pgn: "" })
            .then((out) => api.toast(`Raqib chiqib ketdi — g‘alaba sizniki! Reyting: ${myColor === "w" ? out.white_rating : out.black_rating}`, "good"));
        }
        gone("Xona egasi o‘yindan chiqib ketdi.");
      }
    }, 200);
    onClose(() => clearInterval(clockTimer));

    // Mehmon ham natijani reytingga yozadi (bir o'yin bir marta hisoblanadi)
    let finishedIds = new Set();
    const guestReport = setInterval(() => {
      if (!S || role !== "guest" || S.phase !== "end" || !myColor || !S.result || S.result.reason === "abort" || S.moves.length < 2) return;
      if (finishedIds.has(S.gameId)) return;
      finishedIds.add(S.gameId);
      Rating.finish({ id: S.gameId, white: S.players.w.name, black: S.players.b.name, result: S.result.score, reason: S.result.reason, moves: S.moves.length, pgn: (() => { try { return chess.pgn(); } catch (e) { return ""; } })() });
    }, 1500);
    onClose(() => clearInterval(guestReport));

    function gone(text) {
      ended = true;
      root.dataset.busy = "";
      const ov = $("#csOverlay", m);
      if (!ov) return;
      ov.hidden = false;
      ov.className = "cs-overlay end";
      ov.innerHTML = `<div class="cs-ov-card"><span class="cs-ov-ico">📴</span><h3>${esc(text)}</h3><div class="cs-ov-btns"><button class="cs-btn gold" type="button" data-menu>📋 Menyu</button></div></div>`;
      $("[data-menu]", ov).onclick = () => openMenu("watch");
    }

    // Har yangi holatda tugash ekranini qayta ochish uchun
    const _onMsg = onMsg;
    return {
      onMsg(msg) {
        if (msg && msg.t === "state" && msg.code === code && S && msg.gameId !== S.gameId) { ended = false; lastEndKey = ""; }
        if (msg && msg.t === "state" && msg.code === code && msg.phase !== "end") ended = false;
        _onMsg(msg);
      },
      gone
    };
  }

  window.SofiChess = { openMenu, Rating };
})();
