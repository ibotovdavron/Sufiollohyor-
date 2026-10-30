/* O'yinlar markazi: ism tanlash, ism band qilish, do'stni taklif qilish,
   yulduzlar va o'yin sahnasi. */
(() => {
  "use strict";

  const $ = (s, p = document) => p.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const D = window.CENTER_DATA || {};
  const STUDENTS = (D.students || []).map((s) => ({ name: s.name, cls: s.group }));
  const CLASSES = [...new Set(STUDENTS.map((s) => s.cls))].sort((a, b) => parseInt(a) - parseInt(b));
  const LEVEL = { "5-sinf": 1, "6-sinf": 2, "8-sinf": 3 };

  // Yulduz qoidalari: bitta o'yindan kuniga ko'pi bilan 2 ta yulduz.
  const DAILY_CAP = 2;
  const INVITE_TTL = 30000;

  const GAMES = {};
  const session = {
    cid: null,
    name: null,
    cls: null,
    at: 0,
    status: "idle",
    game: null
  };
  let lobby = null;
  let online = [];
  let pendingInvite = null;
  let incoming = null;
  let activeGame = null;

  // ---------- Saqlash ----------
  const store = {
    get(k, d) { try { return JSON.parse(sessionStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    lget(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---------- Modal oynalar ----------
  const modalRoot = () => $("#gModal");
  function openModal(html, { closable = true, wide = false } = {}) {
    const root = modalRoot();
    root.innerHTML = `<div class="g-modal-card ${wide ? "wide" : ""}" role="dialog" aria-modal="true">
      ${closable ? '<button class="g-close" data-close aria-label="Yopish">✕</button>' : ""}${html}</div>`;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("show"));
    root.onclick = (e) => {
      if (closable && (e.target === root || e.target.closest("[data-close]"))) closeModal();
    };
    return root.firstElementChild;
  }
  function closeModal() {
    const root = modalRoot();
    root.classList.remove("show");
    root.hidden = true;
    root.innerHTML = "";
    root.onclick = null;
  }

  function toast(text, kind = "") {
    const t = document.createElement("div");
    t.className = "g-toast " + kind;
    t.textContent = text;
    $("#gToasts").appendChild(t);
    setTimeout(() => t.classList.add("out"), 3200);
    setTimeout(() => t.remove(), 3800);
  }

  // ---------- Onlayn ro'yxat ----------
  function meta() {
    return { cid: session.cid, name: session.name, cls: session.cls, at: session.at, status: session.status, game: session.game };
  }
  function syncMeta() {
    if (lobby) lobby.track(meta());
    renderPlayerChip();
  }
  function holderOf(name) {
    return online.find((p) => p.name === name && p.cid !== session.cid) || null;
  }

  function onPresence(list) {
    online = list.filter(Boolean);
    // Bir ismni ikki kishi ishlata olmaydi: avvalroq tanlagan qoladi.
    if (session.name) {
      const rival = online.find((p) => p.name === session.name && p.cid !== session.cid &&
        (p.at < session.at || (p.at === session.at && p.cid < session.cid)));
      if (rival) {
        const lost = session.name;
        releaseName();
        if (activeGame) activeGame.abort("Ismingiz boshqa qurilmada band qilindi.");
        toast(`“${lost}” ismi boshqa qurilmada ishlatilmoqda. Boshqa ism tanlang.`, "bad");
      }
    }
    renderOnlineCount();
    document.dispatchEvent(new CustomEvent("sofi:presence"));
  }

  function onLobbyMsg(m) {
    if (!m || !session.name) return;
    if (m.t === "invite" && m.toCid === session.cid) receiveInvite(m);
    else if (m.t === "reply" && m.toCid === session.cid) inviteAnswered(m);
    else if (m.t === "cancel" && m.toCid === session.cid && incoming && incoming.id === m.id) {
      incoming = null;
      closeModal();
      toast(`${m.from} taklifni bekor qildi.`);
    }
  }

  // ---------- Ism tanlash ----------
  function claimName(student) {
    if (holderOf(student.name)) return false;
    session.name = student.name;
    session.cls = student.cls;
    session.at = Date.now();
    session.status = "idle";
    store.set("sofi_games_me", { name: session.name, cls: session.cls });
    syncMeta();
    return true;
  }
  function releaseName() {
    session.name = null;
    session.cls = null;
    session.at = 0;
    session.status = "idle";
    session.game = null;
    store.set("sofi_games_me", null);
    syncMeta();
  }

  function studentList(container, { mode, onPick, filterCls }) {
    let cls = filterCls || session.cls || CLASSES[0];
    let query = "";
    const draw = () => {
      const q = query.toLowerCase();
      const rows = STUDENTS.filter((s) => s.cls === cls && s.name.toLowerCase().includes(q));
      container.querySelector(".g-tabs").innerHTML = CLASSES.map((c) =>
        `<button class="g-tab ${c === cls ? "on" : ""}" data-cls="${esc(c)}">${esc(c)}</button>`).join("");
      container.querySelector(".g-names").innerHTML = rows.map((s) => {
        const holder = holderOf(s.name);
        const me = s.name === session.name;
        let state = "", label = "", disabled = false;
        if (mode === "pick") {
          if (holder) { state = "busy"; label = "🔒 band"; disabled = true; }
          else label = "Tanlash";
        } else {
          if (me) { state = "me"; label = "Siz"; disabled = true; }
          else if (!holder) { state = "off"; label = "onlayn emas"; disabled = true; }
          else if (holder.status !== "idle") { state = "busy"; label = "🎮 o‘yinda"; disabled = true; }
          else { state = "on"; label = "Taklif qilish ✉️"; }
        }
        return `<button class="g-name ${state}" data-name="${esc(s.name)}" ${disabled ? "disabled" : ""}>
          <span class="dot"></span><span class="nm">${esc(s.name)}</span><span class="st">${label}</span></button>`;
      }).join("") || `<p class="g-empty">Hech kim topilmadi</p>`;
    };
    container.innerHTML = `<div class="g-tabs"></div>
      <input class="g-search" type="search" placeholder="🔎 Ism bo‘yicha qidirish..." aria-label="Qidirish">
      <div class="g-names"></div>`;
    container.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-cls]");
      if (tab) { cls = tab.dataset.cls; draw(); return; }
      const btn = e.target.closest(".g-name");
      if (btn && !btn.disabled) onPick(STUDENTS.find((s) => s.name === btn.dataset.name));
    });
    container.querySelector(".g-search").addEventListener("input", (e) => { query = e.target.value.trim(); draw(); });
    const refresh = () => container.isConnected ? draw() : document.removeEventListener("sofi:presence", refresh);
    document.addEventListener("sofi:presence", refresh);
    draw();
  }

  function askName() {
    return new Promise((resolve) => {
      const card = openModal(`
        <div class="g-modal-head"><span class="g-big">👋</span>
          <h2>Ismingizni tanlang</h2>
          <p>Sinfingizni tanlab, ro‘yxatdan o‘z ismingizni bosing. Band ismlar 🔒 bilan belgilangan.</p></div>
        <div class="g-list"></div>`, { wide: true });
      studentList(card.querySelector(".g-list"), {
        mode: "pick",
        onPick(student) {
          if (!claimName(student)) { toast("Bu ism hozirgina band qilindi.", "bad"); return; }
          closeModal();
          toast(`Xush kelibsiz, ${student.name}! 🎉`, "good");
          resolve(true);
        }
      });
      const watch = new MutationObserver(() => {
        if (!card.isConnected) { watch.disconnect(); if (!session.name) resolve(false); }
      });
      watch.observe(modalRoot(), { childList: true });
    });
  }

  function askMode(game) {
    return new Promise((resolve) => {
      const card = openModal(`
        <div class="g-modal-head"><span class="g-big">${game.icon}</span><h2>${esc(game.title)}</h2>
          <p>Qanday o‘ynaysiz, ${esc(session.name.split(" ")[1] || session.name)}?</p></div>
        <div class="g-modes">
          <button class="g-mode" data-mode="solo"><span>🎯</span><b>O‘zim o‘ynayman</b><small>Yakka o‘yin</small></button>
          <button class="g-mode" data-mode="friend"><span>🤝</span><b>Do‘st bilan</b><small>Ro‘yxatdan do‘stingizni taklif qiling</small></button>
        </div>`);
      card.addEventListener("click", (e) => {
        const b = e.target.closest("[data-mode]");
        if (b) { closeModal(); resolve(b.dataset.mode); }
      });
      const watch = new MutationObserver(() => { if (!card.isConnected) { watch.disconnect(); resolve(null); } });
      watch.observe(modalRoot(), { childList: true });
    });
  }

  // ---------- Takliflar ----------
  function pickFriend(game) {
    const card = openModal(`
      <div class="g-modal-head"><span class="g-big">🤝</span><h2>Do‘stingizni tanlang</h2>
        <p>Faqat hozir saytda bo‘lgan o‘quvchilarni taklif qilish mumkin. 🟢 — onlayn.</p></div>
      ${SofiNet.kind === "local" ? '<p class="g-warn">⚠️ Onlayn server ulanmagan: hozircha faqat shu qurilmadagi boshqa oynalar bilan o‘ynash mumkin.</p>' : ""}
      <div class="g-list"></div>`, { wide: true });
    studentList(card.querySelector(".g-list"), {
      mode: "invite",
      onPick(student) { sendInvite(game, student); }
    });
  }

  function sendInvite(game, student) {
    const holder = holderOf(student.name);
    if (!holder || holder.status !== "idle") { toast("Bu o‘quvchi hozir taklif qabul qila olmaydi."); return; }
    const inv = {
      t: "invite", id: SofiNet.randomId(), room: SofiNet.randomId(), game: game.id,
      from: session.name, fromCls: session.cls, fromCid: session.cid,
      to: student.name, toCls: student.cls, toCid: holder.cid
    };
    pendingInvite = inv;
    lobby.send(inv);
    let left = INVITE_TTL / 1000;
    const card = openModal(`
      <div class="g-modal-head"><span class="g-big g-pulse">✉️</span><h2>Taklif yuborildi</h2>
        <p><b>${esc(student.name)}</b> javobini kutyapmiz...</p></div>
      <div class="g-wait"><span class="g-spinner"></span><span class="g-count">${left}</span> soniya</div>
      <button class="btn secondary g-full" data-cancel>Bekor qilish</button>`, { closable: false });
    const timer = setInterval(() => {
      left--;
      const c = card.querySelector(".g-count");
      if (c) c.textContent = left;
      if (left <= 0) cancelInvite("Javob bo‘lmadi. Keyinroq urinib ko‘ring.");
    }, 1000);
    inv.timer = timer;
    card.querySelector("[data-cancel]").onclick = () => cancelInvite();
  }
  function cancelInvite(msg) {
    if (!pendingInvite) return;
    clearInterval(pendingInvite.timer);
    lobby.send({ t: "cancel", id: pendingInvite.id, toCid: pendingInvite.toCid, from: session.name });
    pendingInvite = null;
    closeModal();
    if (msg) toast(msg);
  }
  function inviteAnswered(m) {
    if (!pendingInvite || pendingInvite.id !== m.id) return;
    const inv = pendingInvite;
    clearInterval(inv.timer);
    pendingInvite = null;
    closeModal();
    if (!m.accept) { toast(`${inv.to} taklifni rad etdi.`); return; }
    startMatch(GAMES[inv.game], {
      host: true, room: inv.room,
      opponent: { name: inv.to, cls: inv.toCls, cid: inv.toCid }
    });
  }

  function receiveInvite(m) {
    const game = GAMES[m.game];
    if (!game) return;
    if (session.status !== "idle" || incoming || pendingInvite) {
      lobby.send({ t: "reply", id: m.id, toCid: m.fromCid, accept: false });
      return;
    }
    incoming = m;
    beep(880);
    const card = openModal(`
      <div class="g-modal-head"><span class="g-big g-pulse">${game.icon}</span>
        <h2>Sizni o‘yinga taklif qilishdi!</h2>
        <p><b>${esc(m.from)}</b> (${esc(m.fromCls)}) sizni <b>“${esc(game.title)}”</b> o‘yiniga chaqirmoqda.</p></div>
      <div class="g-modes two">
        <button class="btn" data-yes>▶ O‘ynash</button>
        <button class="btn secondary" data-no>Rad etish</button>
      </div>`, { closable: false });
    const expire = setTimeout(() => { if (incoming === m) { incoming = null; closeModal(); } }, INVITE_TTL);
    card.querySelector("[data-yes]").onclick = () => {
      clearTimeout(expire);
      incoming = null;
      closeModal();
      lobby.send({ t: "reply", id: m.id, toCid: m.fromCid, accept: true });
      startMatch(game, { host: false, room: m.room, opponent: { name: m.from, cls: m.fromCls, cid: m.fromCid } });
    };
    card.querySelector("[data-no]").onclick = () => {
      clearTimeout(expire);
      incoming = null;
      closeModal();
      lobby.send({ t: "reply", id: m.id, toCid: m.fromCid, accept: false });
    };
  }

  // ---------- Yulduzlar ----------
  const today = () => new Date().toISOString().slice(0, 10);
  function localStars() {
    const s = store.lget("sofi_game_stars_v1", {});
    if (s.day !== today()) return { day: today(), counts: {}, total: s.total || {} };
    s.total = s.total || {};
    return s;
  }
  function earnedToday(game) {
    return localStars().counts[session.name + "|" + game] || 0;
  }
  async function awardStar(game) {
    const s = localStars();
    const key = session.name + "|" + game;
    if ((s.counts[key] || 0) >= DAILY_CAP) return { awarded: 0, capped: true };
    let awarded = 1;
    let saved = "local";
    const db = SofiNet.db;
    if (db) {
      try {
        const { data, error } = await db.rpc("add_game_star", { p_student: session.name, p_game: game, p_stars: 1 });
        if (error) throw error;
        awarded = Number(data) || 0;
        saved = "server";
      } catch (e) {
        console.warn("Yulduzni serverga yozib bo‘lmadi:", e);
      }
    }
    if (awarded > 0 || saved === "server") {
      s.counts[key] = saved === "server" && awarded === 0 ? DAILY_CAP : (s.counts[key] || 0) + awarded;
      s.total[session.name] = (s.total[session.name] || 0) + awarded;
      store.lset("sofi_game_stars_v1", s);
    }
    renderPlayerChip();
    return { awarded, capped: awarded === 0, saved };
  }

  // ---------- O'yin sahnasi ----------
  function beep(freq = 660, dur = 0.12, type = "sine", vol = 0.05) {
    try {
      const A = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
      const o = A.createOscillator(), g = A.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, A.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + dur);
      o.connect(g).connect(A.destination);
      o.start();
      o.stop(A.currentTime + dur);
    } catch (e) {}
  }
  const sfx = {
    good() { beep(660, 0.1); setTimeout(() => beep(990, 0.14), 90); },
    bad() { beep(200, 0.25, "sawtooth", 0.04); },
    star() { [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => beep(f, 0.15, "triangle"), i * 90)); },
    tick() { beep(1200, 0.04, "square", 0.02); }
  };

  function confetti(n = 90) {
    const box = document.createElement("div");
    box.className = "g-confetti";
    const colors = ["#22e3a0", "#ffd447", "#ff6b8b", "#5bc0ff", "#b98cff"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.6 + "s";
      p.style.animationDuration = 2 + Math.random() * 1.6 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4500);
  }

  async function startMatch(game, opts = {}) {
    const stage = $("#gStage");
    const friend = !!opts.opponent;
    session.status = "playing";
    session.game = game.id;
    syncMeta();

    stage.innerHTML = `
      <div class="g-stage-bar">
        <button class="g-back" data-quit aria-label="Chiqish">← Chiqish</button>
        <div class="g-stage-title">${game.icon} ${esc(game.title)}</div>
        <div class="g-vs">${friend
          ? `<span class="me">${esc(session.name)}</span><span class="v">VS</span><span class="op">${esc(opts.opponent.name)}</span>`
          : `<span class="me">${esc(session.name)}</span>`}</div>
      </div>
      <div class="g-stage-body"></div>`;
    stage.hidden = false;
    document.body.classList.add("g-playing");
    requestAnimationFrame(() => stage.classList.add("show"));
    const body = stage.querySelector(".g-stage-body");

    let room = null;
    let roomHandlers = [];
    let finished = false;
    let cleanup = null;
    let opponentGone = false;
    let lastOpSeen = Date.now();
    let opFinal = null;
    let opFinalWaiters = [];
    const goneHandlers = [];

    const ctx = {
      me: { name: session.name, cls: session.cls },
      opponent: friend ? { name: opts.opponent.name, cls: opts.opponent.cls } : null,
      level: friend
        ? Math.min(LEVEL[session.cls] || 2, LEVEL[opts.opponent.cls] || 2)
        : LEVEL[session.cls] || 2,
      seed: 0,
      sfx,
      confetti,
      toast,
      send(data) { if (room) room.send({ t: "g", from: session.cid, d: data }); },
      onMsg(fn) { roomHandlers.push(fn); },
      onOpponentLeft(fn) { goneHandlers.push(fn); },
      get opponentGone() { return opponentGone; },
      /** Ikkala o'yinchining yakuniy natijasini almashish. */
      exchangeFinal(result, timeoutMs = 90000) {
        if (!friend) return Promise.resolve(null);
        const msg = { t: "final", from: session.cid, d: result };
        room && room.send(msg);
        const resend = setInterval(() => room && room.send(msg), 1500);
        return new Promise((resolve) => {
          const done = (v) => { clearInterval(resend); resolve(v); };
          if (opFinal) return done(opFinal);
          if (opponentGone) return done(null);
          opFinalWaiters.push(done);
          setTimeout(() => done(opFinal), timeoutMs);
        });
      },
      async finish(result) {
        if (finished) return;
        finished = true;
        let star = null;
        if (result.earnStar) star = await awardStar(game.id);
        showResult(game, result, star, friend);
      }
    };

    activeGame = {
      abort(msg) {
        finished = true;
        teardown();
        if (msg) toast(msg, "bad");
      }
    };

    function teardown() {
      try { cleanup && cleanup(); } catch (e) {}
      cleanup = null;
      if (room) { room.leave(); room = null; }
      clearInterval(watchdog);
      stage.classList.remove("show");
      stage.hidden = true;
      stage.innerHTML = "";
      document.body.classList.remove("g-playing");
      activeGame = null;
      session.status = "idle";
      session.game = null;
      syncMeta();
    }
    ctx.quit = teardown;
    stage.querySelector("[data-quit]").onclick = () => {
      if (finished || confirm("O‘yindan chiqasizmi? Natija saqlanmaydi.")) { finished = true; teardown(); closeModal(); }
    };

    const markGone = () => {
      if (opponentGone || !friend) return;
      opponentGone = true;
      opFinalWaiters.forEach((w) => w(opFinal));
      opFinalWaiters = [];
      if (!finished) toast(`${opts.opponent.name} o‘yindan chiqib ketdi.`);
      goneHandlers.forEach((fn) => fn());
    };
    let ticks = 0;
    const watchdog = setInterval(() => {
      if (!friend || !room) return;
      if (++ticks % 3 === 0) room.send({ t: "ping", from: session.cid });
      if (!opponentGone && Date.now() - lastOpSeen > 9000) markGone();
    }, 1000);

    if (friend) {
      body.innerHTML = `<div class="g-center"><span class="g-spinner"></span><p>Do‘stingiz bilan ulanmoqda...</p></div>`;
      let started = false;
      let helloTimer = null;
      const begin = (seed) => {
        if (started) return;
        started = true;
        clearInterval(helloTimer);
        ctx.seed = seed;
        countdown(body).then(() => { if (!finished) cleanup = game.mount(body, ctx); });
      };
      const seed = (Math.random() * 2 ** 31) | 0;
      try {
        room = await SofiNet.join("room-" + opts.room, {
          meta: { cid: session.cid, name: session.name },
          onPresence(list) {
            if (list.some((p) => p && p.cid === opts.opponent.cid)) lastOpSeen = Date.now();
            else if (started) markGone();
          },
          onMsg(m) {
            if (!m || m.from === session.cid) return;
            lastOpSeen = Date.now();
            if (m.t === "hello" && opts.host) { room.send({ t: "start", seed, from: session.cid }); begin(seed); }
            else if (m.t === "start" && !opts.host) begin(m.seed);
            else if (m.t === "g") roomHandlers.forEach((fn) => fn(m.d));
            else if (m.t === "final") {
              opFinal = m.d;
              opFinalWaiters.forEach((w) => w(opFinal));
              opFinalWaiters = [];
            } else if (m.t === "bye") markGone();
          }
        });
      } catch (e) {
        toast("Ulanib bo‘lmadi. Qayta urinib ko‘ring.", "bad");
        teardown();
        return;
      }
      // Mehmon "hello" yuboradi, mezbon "start" (seed bilan) javob qaytaradi.
      if (!opts.host) {
        const hello = () => room && room.send({ t: "hello", from: session.cid });
        hello();
        helloTimer = setInterval(hello, 700);
      }
      setTimeout(() => {
        if (!started && !finished) { clearInterval(helloTimer); toast("Do‘stingiz ulanmadi.", "bad"); teardown(); }
      }, 15000);
      const leaveMsg = () => room && room.send({ t: "bye", from: session.cid });
      window.addEventListener("pagehide", leaveMsg, { once: true });
    } else {
      ctx.seed = (Math.random() * 2 ** 31) | 0;
      await countdown(body);
      if (!finished) cleanup = game.mount(body, ctx);
    }
  }

  function countdown(body) {
    return new Promise((resolve) => {
      body.innerHTML = `<div class="g-countdown"><span>3</span></div>`;
      const el = body.querySelector(".g-countdown span");
      let n = 3;
      sfx.tick();
      const t = setInterval(() => {
        n--;
        if (!el.isConnected) { clearInterval(t); return; }
        el.textContent = n > 0 ? n : "Boshla!";
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
        n > 0 ? sfx.tick() : beep(990, 0.25, "triangle");
        if (n <= 0) { clearInterval(t); setTimeout(resolve, 600); }
      }, 800);
    });
  }

  function showResult(game, r, star, friend) {
    let starHtml = "";
    if (star && star.awarded > 0) {
      sfx.star();
      confetti();
      starHtml = `<div class="g-star-won"><span>⭐</span><b>+1 yulduz!</b>${star.saved === "server" ? "" : "<small>Bu qurilmada saqlandi</small>"}</div>`;
    } else if (star && star.capped) {
      starHtml = `<p class="g-note">Bugun bu o‘yindan yulduz chegarasiga (${DAILY_CAP} ⭐) yetdingiz. Ertaga yana urinib ko‘ring!</p>`;
    } else if (r.starHint) {
      starHtml = `<p class="g-note">⭐ ${esc(r.starHint)}</p>`;
    }
    if (friend && r.won) confetti(60);
    const card = openModal(`
      <div class="g-modal-head">
        <span class="g-big">${r.won === true ? "🏆" : r.won === false ? "🙂" : r.earnStar ? "🌟" : "🎮"}</span>
        <h2>${esc(r.title || "O‘yin tugadi")}</h2>
        ${r.text ? `<p>${esc(r.text)}</p>` : ""}
      </div>
      ${r.rows ? `<div class="g-result-rows">${r.rows.map(([a, b]) => `<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join("")}</div>` : ""}
      ${starHtml}
      <div class="g-modes two">
        <button class="btn" data-again>↻ Yana o‘ynash</button>
        <button class="btn secondary" data-menu>O‘yinlar menyusi</button>
      </div>`, { closable: false });
    card.querySelector("[data-menu]").onclick = () => { closeModal(); activeGame && activeGame.abort(); };
    card.querySelector("[data-again]").onclick = () => {
      closeModal();
      activeGame && activeGame.abort();
      launch(game.id);
    };
  }

  // ---------- Bosh oqim ----------
  async function launch(id) {
    const game = GAMES[id];
    if (!game) return;
    if (!lobby) { toast("Ulanish tayyorlanmoqda, bir soniya..."); return; }
    if (!session.name && !(await askName())) return;
    const mode = await askMode(game);
    if (mode === "solo") startMatch(game);
    else if (mode === "friend") pickFriend(game);
  }

  function renderPlayerChip() {
    const chip = $("#gPlayer");
    if (!chip) return;
    if (!session.name) {
      chip.innerHTML = `<button class="g-chip" data-pick>👤 Ismni tanlash</button>`;
    } else {
      const total = Object.keys(GAMES).reduce((n, g) => n + earnedToday(g), 0);
      chip.innerHTML = `<div class="g-chip on"><span class="av">${esc(session.name[0])}</span>
        <span><b>${esc(session.name)}</b><small>${esc(session.cls)} · bugun ⭐ ${total}</small></span>
        <button class="g-link" data-change>almashtirish</button></div>`;
    }
  }
  function renderOnlineCount() {
    const el = $("#gOnline");
    if (!el) return;
    const n = online.filter((p) => p.name).length;
    el.innerHTML = `<span class="g-live ${SofiNet.kind}"></span> ${SofiNet.kind === "online" ? "Onlayn" : "Faqat shu qurilma"} · ${n} o‘quvchi o‘yinda`;
  }

  async function boot() {
    const saved = store.get("sofi_games_cid", null);
    session.cid = saved || SofiNet.randomId();
    store.set("sofi_games_cid", session.cid);

    document.addEventListener("click", (e) => {
      const start = e.target.closest("[data-start]");
      if (start) { launch(start.dataset.start); return; }
      if (e.target.closest("[data-pick]")) askName();
      if (e.target.closest("[data-change]")) { if (session.status === "idle") { releaseName(); askName(); } }
    });

    renderPlayerChip();
    await SofiNet.init();
    lobby = await SofiNet.join("lobby", { meta: meta(), onMsg: onLobbyMsg, onPresence });
    renderOnlineCount();

    // Sahifa yangilansa, avvalgi ism bo'sh bo'lsa qaytariladi.
    const me = store.get("sofi_games_me", null);
    if (me && me.name) {
      setTimeout(() => {
        const student = STUDENTS.find((s) => s.name === me.name);
        if (student && !session.name && !claimName(student)) toast(`“${me.name}” ismi hozir band.`, "bad");
      }, 1500);
    }
    window.addEventListener("pagehide", () => lobby && lobby.leave());
  }

  window.SofiGames = {
    register(game) { GAMES[game.id] = game; },
    boot,
    get session() { return session; }
  };
})();
