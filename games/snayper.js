/* SNAYPER JANGI — Qizil va Ko'k robot jamoalar, 5 ga 5.
   Lobbi: xonalar ro'yxati (sn-lobby), xona: sn-r-KOD (Supabase Realtime yoki shu qurilma).
   Bo'sh o'rinlarni botlar to'ldiradi. Xona egasi (host) botlar va raundlarni boshqaradi. */
(() => {
  "use strict";
  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const MAXP = 10, TEAM_N = 5;
  const TOUCH = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  /** Telefon tik tursa — o'yin oynasini 90° burib, doim yotiq ko'rsatamiz (PUBG kabi). */
  function applyRot() {
    if (!S.root) return;
    const box = S.root.querySelector("[data-game]");
    const want = TOUCH && !box.hidden && innerHeight > innerWidth;
    if (box.classList.contains("rot") !== want) { box.classList.toggle("rot", want); window.dispatchEvent(new Event("resize")); }
  }
  window.addEventListener("resize", () => setTimeout(applyRot, 50));
  window.addEventListener("orientationchange", () => setTimeout(applyRot, 250));

  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.THREE.GLTFLoader) await loadScript("lib/GLTFLoader.js?v=1");
    if (!window.THREE.SkeletonUtils) await loadScript("lib/SkeletonUtils.js?v=1");
    if (!window.SofiSniperWorld) await loadScript("games/snayper-world.js?v=4");
    if (!window.SofiSniper3D) await loadScript("games/snayper3d.js?v=7");
    await window.SofiSniper3D.load();
  })().catch((e) => { libs = null; throw e; }));

  /* ---------- Holat ---------- */
  const S = { root: null, lobby: null, rooms: [], room: null, code: null, members: [], meAt: 0, team: "r", engine: null, roster: null, fill: true, title: "" };
  const me = () => ({ cid: G.session.cid, name: G.session.name, cls: G.session.cls });

  function shell() {
    if (S.root) return S.root;
    const el = document.createElement("div");
    el.className = "sn-root";
    el.innerHTML = `<div class="sn-panel" data-panel></div><div class="sn-game" data-game hidden></div>`;
    document.body.appendChild(el);
    document.body.classList.add("sn-open");
    S.root = el;
    el.addEventListener("click", onClick);
    return el;
  }
  const panel = () => S.root.querySelector("[data-panel]");
  const gameBox = () => S.root.querySelector("[data-game]");

  async function close() {
    if (S.engine) { S.engine.destroy(); S.engine = null; }
    await leaveRoom();
    if (S.lobby) { try { S.lobby.leave(); } catch (e) {} S.lobby = null; }
    if (S.root) S.root.remove();
    S.root = null;
    document.body.classList.remove("sn-open");
  }

  /* ---------- Lobbi ---------- */
  const lobbyMeta = () => {
    const m = { cid: G.session.cid, name: G.session.name, at: S.meAt || Date.now() };
    if (S.code && isHost()) m.room = { code: S.code, title: S.title, n: S.members.length, play: !!S.roster };
    return m;
  };
  async function joinLobby() {
    if (S.lobby) return;
    await window.SofiNet.init();
    try {
      S.lobby = await window.SofiNet.join("sn-lobby", {
        meta: lobbyMeta(),
        onMsg: () => {},
        onPresence: (list) => { S.rooms = list.filter((m) => m && m.room && m.room.code).map((m) => ({ ...m.room, host: m.name })); if (!S.code) drawLobby(); },
      });
    } catch (e) { S.lobby = null; }
  }
  const trackLobby = () => { if (S.lobby) try { S.lobby.track(lobbyMeta()); } catch (e) {} };

  function drawLobby() {
    if (!S.root || S.code) return;
    const local = window.SofiNet.kind !== "online";
    panel().innerHTML = `
      <div class="sn-lob">
        <header><button class="sn-x" data-a="close" type="button">✕</button>
          <span class="sn-logo">🎯</span><div><h2>Snayper jangi</h2><p>🔴 Qizil 🆚 🔵 Ko‘k · 5 ga 5 · robotlar jangi</p></div></header>
        <div class="sn-acts">
          <button class="sn-btn" data-a="create" type="button">➕ Xona ochish</button>
          <button class="sn-btn ghost" data-a="solo" type="button">🤖 Botlar bilan mashq</button>
          <form class="sn-code" data-code><input maxlength="5" placeholder="Xona kodi" aria-label="Xona kodi" autocapitalize="characters"><button class="sn-btn ghost" type="submit">🔑 Kirish</button></form>
        </div>
        <h3>🟢 Ochiq xonalar</h3>
        <div class="sn-rooms">${S.rooms.length ? S.rooms.map((r) => `<button class="sn-room" data-join="${esc(r.code)}" type="button" ${r.n >= MAXP ? "disabled" : ""}>
            <b>${esc(r.title || r.host + " xonasi")}</b><small>👑 ${esc(short(r.host))} · kod ${esc(r.code)}</small>
            <span class="n">${r.n}/${MAXP}</span><em>${r.play ? "⚔️ o‘yinda" : "⏳ kutmoqda"}</em></button>`).join("")
          : `<p class="sn-empty">Hozircha ochiq xona yo‘q. Birinchi bo‘lib xona oching va do‘stlaringizni chaqiring!</p>`}</div>
        ${local ? `<p class="sn-warn">⚠️ Internet aloqasi yo‘q — faqat shu qurilmadagi oynalar ko‘rinadi. Botlar bilan mashq qilishingiz mumkin.</p>` : ""}
        <div class="sn-rules"><b>📜 Qoidalar</b><ul>
          <li>Ikki uy bir-biriga qarama-qarshi turibdi. Siz jamoangiz uyidan boshlaysiz.</li>
          <li>🔭 Durbin bilan nishonga oling: boshga tekkan o‘q robotni darhol o‘chiradi, tanaga — 2 ta o‘q kerak.</li>
          <li>Raqib jamoaning hamma robotini o‘chirgan jamoa raundni yutadi. 3 raund yutgan — g‘olib!</li>
          <li>Xonada 10 kishigacha o‘ynaydi, bo‘sh joylarni 🤖 botlar egallaydi.</li></ul></div>
      </div>`;
  }

  /* ---------- Xona ---------- */
  const code5 = () => Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[(Math.random() * 32) | 0]).join("");
  const order = (list) => list.slice().sort((a, b) => (a.at || 0) - (b.at || 0) || String(a.cid).localeCompare(String(b.cid)));
  const hostCid = () => (order(S.members)[0] || {}).cid;
  const isHost = () => !!S.code && hostCid() === G.session.cid;
  const roomMeta = () => ({ cid: G.session.cid, name: G.session.name, cls: G.session.cls || "", team: S.team, at: S.meAt });

  async function enterRoom(code, creating) {
    await window.SofiNet.init();
    S.code = code; S.meAt = Date.now(); S.roster = null; S.members = [];
    if (creating) S.title = `${short(G.session.name)} xonasi`;
    panel().innerHTML = `<div class="sn-lob"><p class="sn-empty">⏳ Xonaga ulanmoqda...</p></div>`;
    let first = true;
    try {
      S.room = await window.SofiNet.join("sn-r-" + code, {
        meta: roomMeta(),
        onMsg: onRoomMsg,
        onPresence: (list) => {
          const prevHost = hostCid();
          S.members = list.filter((m) => m && m.cid && m.name);
          if (first && S.members.length > 1) {
            first = false;
            if (S.members.length > MAXP) { api.toast("Xona to‘la (10 kishi).", "bad"); leaveRoom().then(drawLobby); return; }
            const others = S.members.filter((m) => m.cid !== G.session.cid);
            const nr = others.filter((m) => m.team === "r").length, nb = others.filter((m) => m.team === "b").length;
            S.team = nr <= nb ? "r" : "b";
            S.room.track(roomMeta());
          }
          first = false;
          onMembers(prevHost);
        },
      });
    } catch (e) { api.toast("Xonaga ulanib bo‘lmadi.", "bad"); S.code = null; drawLobby(); return; }
    trackLobby();
    drawRoom();
  }
  async function leaveRoom() {
    if (S.room) { try { S.room.send({ t: "bye", cid: G.session.cid }); S.room.leave(); } catch (e) {} }
    S.room = null; S.code = null; S.members = []; S.roster = null;
    trackLobby();
  }

  function onMembers(prevHost) {
    const host = hostCid();
    if (S.engine) {
      S.engine.setHost(host === G.session.cid);
      if (host === G.session.cid) syncRoster();
    }
    if (isHost()) trackLobby();
    if (!S.engine) drawRoom();
    if (prevHost && host !== prevHost && host === G.session.cid) api.toast("👑 Endi xona egasi sizsiz.");
  }

  /** Odamlar + bo'sh joyga botlar (host hisoblaydi). */
  function buildRoster(prev) {
    const humans = order(S.members).slice(0, MAXP).map((m) => ({ id: m.cid, name: m.name, team: m.team === "b" ? "b" : "r", cls: m.cls }));
    const list = humans.slice();
    if (S.fill) {
      const used = new Set(humans.map((h) => h.name));
      const names = window.SofiSniper3D ? window.SofiSniper3D.BOTNAMES : ["Bot"];
      ["r", "b"].forEach((team) => {
        const need = TEAM_N - humans.filter((h) => h.team === team).length;
        const oldBots = (prev || []).filter((r) => r.bot && r.team === team);
        for (let i = 0; i < need; i++) {
          const ob = oldBots[i];
          if (ob) { list.push(ob); continue; }
          let nm = names.find((n) => !used.has("Bot " + n) && !list.some((x) => x.name === "Bot " + n)) || "Bot " + (i + 1);
          if (!nm.startsWith("Bot ")) nm = "Bot " + nm;
          used.add(nm);
          list.push({ id: `bot-${team}${Date.now().toString(36).slice(-3)}${i}`, name: nm, team, bot: true });
        }
      });
    }
    return list;
  }
  function syncRoster() {
    if (!isHost() || !S.engine || !S.roster) return;
    const next = buildRoster(S.roster);
    const newbies = next.filter((r) => !r.bot && !S.roster.some((o) => o.id === r.id));
    const changed = JSON.stringify(next.map((r) => r.id + r.team)) !== JSON.stringify(S.roster.map((r) => r.id + r.team));
    S.roster = next;
    if (changed) { S.room.send({ t: "roster", list: next }); S.engine.setRoster(next); }
    newbies.forEach((r) => setTimeout(() => S.engine && S.engine.syncFor(r.id), 600));
  }

  function drawRoom() {
    if (!S.root || !S.code || S.engine) return;
    const host = isHost();
    const hostName = (order(S.members)[0] || {}).name || "";
    const col = (team) => {
      const ms = order(S.members).filter((m) => m.team === team);
      const slots = [];
      for (let i = 0; i < TEAM_N; i++) {
        const m = ms[i];
        slots.push(m ? `<li class="${m.cid === G.session.cid ? "me" : ""}"><span class="av">${esc(short(m.name)[0] || "?")}</span>${esc(m.name)}${m.cid === hostCid() ? " 👑" : ""}</li>`
          : `<li class="empty">${S.fill ? "🤖 bot o‘ynaydi" : "bo‘sh joy"}</li>`);
      }
      return slots.join("");
    };
    panel().innerHTML = `
      <div class="sn-lob">
        <header><button class="sn-x" data-a="leave" type="button">←</button>
          <span class="sn-logo">🏠</span><div><h2>${esc(S.title || hostName + " xonasi")}</h2><p>Xona kodi: <b class="sn-kod">${esc(S.code)}</b> · ${S.members.length}/${MAXP} kishi</p></div></header>
        <div class="sn-teams">
          <div class="sn-team r"><h3>🔴 Qizil jamoa</h3><ul>${col("r")}</ul></div>
          <div class="sn-vs">VS</div>
          <div class="sn-team b"><h3>🔵 Ko‘k jamoa</h3><ul>${col("b")}</ul></div>
        </div>
        <div class="sn-acts">
          <button class="sn-btn ghost" data-a="swap" type="button">🔁 Jamoani almashtirish</button>
          <button class="sn-btn ghost" data-a="share" type="button">📨 Kodni ulashish</button>
        </div>
        ${host ? `<label class="sn-chk"><input type="checkbox" data-fill ${S.fill ? "checked" : ""}> Bo‘sh joylarni botlar bilan to‘ldirish</label>
          <button class="sn-btn big" data-a="start" type="button">▶ O‘yinni boshlash</button>`
        : `<p class="sn-empty">⏳ Xona egasi (${esc(short(hostName))}) o‘yinni boshlashini kuting...</p>`}
      </div>`;
    const f = panel().querySelector("[data-fill]");
    if (f) f.onchange = () => { S.fill = f.checked; drawRoom(); };
  }

  function onRoomMsg(m) {
    if (!m || !m.t) return;
    if (m.t === "go") { if (!S.engine) startGame(m.list, false); return; }
    if (m.t === "roster") {
      S.roster = m.list;
      if (S.engine) S.engine.setRoster(m.list);
      else if (m.list.some((r) => r.id === G.session.cid)) startGame(m.list, false);
      return;
    }
    if (m.t === "bye") return;
    if (S.engine) S.engine.onMsg(m);
  }

  async function startGame(list, solo) {
    const box = gameBox();
    box.hidden = false;
    applyRot();
    if (TOUCH) {
      const el = document.documentElement, fs = el.requestFullscreen || el.webkitRequestFullscreen;
      const lock = () => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").then(() => setTimeout(applyRot, 300)).catch(() => {}); } catch (e) {} };
      try { const r = fs && fs.call(el); if (r && r.then) r.then(lock).catch(lock); else lock(); } catch (e) { lock(); }
    }
    box.innerHTML = `<div class="sn-loading"><span>🎯</span><b>Jang maydoni yuklanmoqda...</b><i></i></div>`;
    try { await loadLibs(); } catch (e) { box.innerHTML = `<div class="sn-loading"><b>😕 Yuklab bo‘lmadi. Internetni tekshiring.</b><button class="sn-btn" data-a="back" type="button">← Orqaga</button></div>`; return; }
    const mine = list.find((r) => r.id === G.session.cid);
    if (!mine) { box.hidden = true; return; }
    box.innerHTML = "";
    S.roster = list;
    S.engine = window.SofiSniper3D.create(box, {
      me: { id: mine.id, name: mine.name, team: mine.team },
      roster: list,
      host: solo || isHost(),
      send: solo ? () => {} : (msg) => S.room && S.room.send(msg),
      onExit: () => { S.engine = null; box.hidden = true; box.innerHTML = ""; box.classList.remove("rot"); try { if (document.fullscreenElement) document.exitFullscreen(); screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) {} if (solo) drawLobby(); else leaveRoom().then(drawLobby); },
    });
    if (!solo) trackLobby();
  }

  function startSolo() {
    const my = { id: G.session.cid, name: G.session.name, team: "r", cls: G.session.cls };
    const names = window.SofiSniper3D ? window.SofiSniper3D.BOTNAMES : ["Temirbek", "Chaqmoq", "Burgut", "Lochin", "Qoplon", "Shamol", "Bo‘ron", "Yashin", "Tulpor", "Sherdil"];
    const pool = names.length >= 9 ? names : ["Temirbek", "Chaqmoq", "Burgut", "Lochin", "Qoplon", "Shamol", "Bo‘ron", "Yashin", "Tulpor", "Sherdil"];
    const list = [my];
    for (let i = 0; i < 9; i++) list.push({ id: "bot" + i, name: "Bot " + pool[i], team: i < 4 ? "r" : "b", bot: true });
    startGame(list, true);
  }

  async function onClick(e) {
    const a = e.target.closest("[data-a]");
    const j = e.target.closest("[data-join]");
    if (j) { enterRoom(j.dataset.join, false); return; }
    if (!a) return;
    const k = a.dataset.a;
    if (k === "close") close();
    else if (k === "solo") startSolo();
    else if (k === "create") enterRoom(code5(), true);
    else if (k === "leave") { await leaveRoom(); drawLobby(); }
    else if (k === "back") { gameBox().hidden = true; }
    else if (k === "swap") { const n = S.members.filter((m) => m.team !== S.team).length; if (n >= TEAM_N) { api.toast("U jamoa to‘la."); return; } S.team = S.team === "r" ? "b" : "r"; S.room && S.room.track(roomMeta()); }
    else if (k === "share") {
      const txt = `🎯 Snayper jangi! sufiollohyor.uz/games.html — “Snayper” → kod: ${S.code}`;
      try { if (navigator.share) await navigator.share({ text: txt }); else { await navigator.clipboard.writeText(txt); api.toast("Kod nusxalandi ✅"); } } catch (er) {}
    } else if (k === "start") {
      if (!isHost()) return;
      const list = buildRoster(null);
      if (!list.some((r) => r.team === "r") || !list.some((r) => r.team === "b")) { api.toast("Ikkala jamoada ham kamida bitta o‘yinchi yoki bot bo‘lsin.", "bad"); return; }
      S.room.send({ t: "go", list });
      startGame(list, false);
    }
  }
  document.addEventListener("submit", (e) => {
    const f = e.target.closest && e.target.closest("[data-code]");
    if (!f) return;
    e.preventDefault();
    const v = f.querySelector("input").value.trim().toUpperCase();
    if (v.length === 5) enterRoom(v, false); else api.toast("Kod 5 ta belgidan iborat.");
  });

  window.SofiSniperState = S;
  async function open() {
    if (!G.session.name && !(await api.askName())) return;
    shell();
    S.meAt = Date.now();
    drawLobby();
    joinLobby();
    loadLibs().catch(() => {});
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sn]");
    if (!b) return;
    if (b.dataset.sn === "play") open();
    if (b.dataset.sn === "solo") (async () => { if (!G.session.name && !(await api.askName())) return; shell(); drawLobby(); startSolo(); })();
  });
})();
