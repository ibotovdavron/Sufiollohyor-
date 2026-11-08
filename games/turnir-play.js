/* Turnir o'yin oqimi (O'yinlar sahifasi, games.html#turnir):
   mening navbatdagi o'yinimni topadi, raqib tayyor bo'lsa shaxmatni avtomatik ochadi,
   g'alabadan keyin keyingi bosqich raqibini kutadi. */
(() => {
  "use strict";
  const G = window.SofiGames, T = window.SofiTurnir;
  if (!G || !T) return;
  const api = G.api;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  let root = null, poll = 0, launching = false, lastKey = "", playing = false;

  function shell() {
    if (root) return root;
    root = document.createElement("div");
    root.className = "tp-root";
    root.innerHTML = `<div class="tp-bg" aria-hidden="true">${"♔♕♖♗♘♙♚♛♜♝♞♟".split("").map((c, i) => `<i style="left:${(i * 8.3) % 100}%;animation-delay:${-i * 1.7}s">${c}</i>`).join("")}</div>
      <header class="tp-bar"><button class="tp-x" type="button" data-tp="close">← Chiqish</button><b>♟️ SHAXMAT TURNIRI</b><a class="tp-link" href="competitions.html#turnir">🗂 Setka</a></header>
      <main class="tp-main" data-main></main>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing");
    root.addEventListener("click", (e) => { const b = e.target.closest("[data-tp]"); if (b && b.dataset.tp === "close") close(); if (b && b.dataset.tp === "go") launch(true); });
    return root;
  }
  function close() {
    clearInterval(poll); poll = 0;
    if (root) root.remove(); root = null;
    document.body.classList.remove("g-playing");
    if (location.hash === "#turnir") history.replaceState(null, "", location.pathname);
  }
  const main = () => root.querySelector("[data-main]");
  function view(html) { if (!root) shell(); main().innerHTML = html; }

  let st = null, match = null;
  async function tick() {
    if (playing) return;
    try { st = await T.load(); } catch (e) { view(`<div class="tp-card"><span class="tp-big">⚠️</span><h2>Ulanib bo‘lmadi</h2><p>${esc(e.message)}</p></div>`); return; }
    const me = G.session.name, ev = st.ev;
    if (!ev) return view(`<div class="tp-card"><span class="tp-big">♟️</span><h2>Turnir hali e’lon qilinmagan</h2></div>`);
    const inT = st.players.some((p) => p.name === me);
    if (ev.status === "reg") {
      return view(`<div class="tp-card"><span class="tp-big">⏳</span><h2>${esc(ev.title)}</h2><p>Turnir hali boshlanmagan.${ev.start_at ? ` Boshlanish: <b>${new Date(ev.start_at).toLocaleString("uz-UZ", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</b>` : ""}</p>
        <p>${inT ? "✅ Siz ro‘yxatdasiz. Turnir boshlanganda shu sahifa o‘zi birinchi raqibingizni ko‘rsatadi." : "Siz hali yozilmagansiz."}</p><a class="tp-btn ghost" href="competitions.html#turnir">📋 Turnir sahifasi</a></div>`);
    }
    if (ev.status === "done") {
      const p = T.podium(st) || [];
      const place = p.indexOf(me);
      return view(`<div class="tp-card win"><span class="tp-big">🏆</span><h2>Turnir yakunlandi!</h2>
        <div class="tp-pod">${[[1, "🥈", 100], [0, "🥇", 150], [2, "🥉", 50]].map(([i, ic, s]) => `<div class="p${i + 1}"><span>${ic}</span><b>${esc(p[i] || "—")}</b><small>+${s} ⭐</small></div>`).join("")}</div>
        ${place >= 0 ? `<p class="tp-gold">🎉 Tabriklaymiz! Siz ${place + 1}-o‘rinni egalladingiz va +${[150, 100, 50][place]} ⭐ oldingiz!</p>` : ""}
        <a class="tp-btn ghost" href="competitions.html#turnir">🗂 To‘liq setka</a></div>`);
    }
    if (!inT) return view(`<div class="tp-card"><span class="tp-big">👀</span><h2>${esc(ev.title)}</h2><p>Siz bu turnirda qatnashmayapsiz. Jonli o‘yinlarni “Shaxmat → Kuzatish” orqali tomosha qilishingiz mumkin.</p><a class="tp-btn ghost" href="competitions.html#turnir">🗂 Setkani ko‘rish</a></div>`);
    match = T.myMatch(st, me);
    if (!match) {
      return view(`<div class="tp-card"><span class="tp-big">🙌</span><h2>Turnirdagi ishtirokingiz yakunlandi</h2><p>Siz ajoyib o‘ynadingiz! Qolgan o‘yinlarni kuzatib boring — final yaqin.</p><a class="tp-btn ghost" href="competitions.html#turnir">🗂 Setkani ko‘rish</a></div>`);
    }
    const rn = T.roundName(match.round, ev.rounds), opp = match.p1 === me ? match.p2 : match.p1;
    if (!opp) {
      // raqib hali aniqlanmagan: uni belgilaydigan o'yinni ko'rsatamiz
      const feed = st.matches.find((m) => m.round === match.round - 1 && Math.floor(m.slot / 2) === match.slot && !(m.p1 === me || m.p2 === me) && !m.winner);
      return view(`<div class="tp-card"><span class="tp-big tp-spin">♞</span><span class="tp-round">${esc(rn)}</span><h2>Keyingi raqibingiz aniqlanmoqda…</h2>
        ${feed ? `<div class="tp-vs small"><b>${esc(feed.p1 || "?")}</b><span>VS</span><b>${esc(feed.p2 || "?")}</b></div><p>Shu o‘yin g‘olibi bilan o‘ynaysiz. O‘yin tugashi bilan shaxmat o‘zi ochiladi.</p>` : `<p>Boshqa o‘yinlar tugashini kuting. Raqib tayyor bo‘lishi bilan shaxmat o‘zi ochiladi.</p>`}
        <div class="tp-dots"><i></i><i></i><i></i></div></div>`);
    }
    const key = `${ev.id}-${match.round}-${match.slot}`;
    view(`<div class="tp-card ready"><span class="tp-round">${esc(rn)}</span><h2>Raqibingiz tayyor!</h2>
      <div class="tp-vs"><div class="me"><span>${match.p1 === me ? "⚪" : "⚫"}</span><b>${esc(me)}</b><small>Siz</small></div><span class="v">VS</span><div><span>${match.p1 === me ? "⚫" : "⚪"}</span><b>${esc(opp)}</b><small>${T.isTeacher(opp) ? "👨‍🏫 Ustoz" : "Raqib"}</small></div></div>
      <p>⏱ 10 daqiqalik o‘yin · yutgan keyingi bosqichga o‘tadi · durangda ranglar almashib qayta o‘ynaladi</p>
      <button class="tp-btn" data-tp="go" type="button">♟ O‘yinni boshlash <em data-cd>5</em></button></div>`);
    if (lastKey !== key) { lastKey = key; let n = 5; const iv = setInterval(() => { const el = root && root.querySelector("[data-cd]"); if (!el || playing) return clearInterval(iv); n--; el.textContent = n; if (n <= 0) { clearInterval(iv); launch(); } }, 1000); api.beep(660, 0.15, "triangle", 0.06); }
  }

  async function launch() {
    if (launching || !match || !st || !window.SofiChessT) return;
    launching = true; playing = true;
    const me = G.session.name, ev = st.ev;
    const tn = { ev: ev.id, round: match.round, slot: match.slot, p1: match.p1, p2: match.p2, title: ev.title };
    if (root) root.style.display = "none";
    try { await window.SofiChessT.play({ code: `T${ev.id}r${match.round}s${match.slot}`, host: match.p1 === me, tn }); }
    catch (e) { console.warn(e); playing = false; if (root) root.style.display = ""; }
    launching = false;
  }

  async function open() {
    // sahifa ochilganda saqlangan ism ~1.5 soniyada tiklanadi — shuni kutamiz
    for (let i = 0; i < 30 && !G.session.name; i++) await new Promise((r) => setTimeout(r, 100));
    if (!G.session.name && !(await api.askName())) { close(); return; }
    if (G.session.role === "guest") { view(`<div class="tp-card"><span class="tp-big">👤</span><h2>Mehmonlar turnirda qatnashmaydi</h2><p>Ro‘yxatdagi ismingiz bilan kiring.</p></div>`); return; }
    shell();
    view(`<div class="tp-card"><span class="tp-big tp-spin">♞</span><h2>Turnir yuklanmoqda…</h2></div>`);
    playing = false; lastKey = "";
    tick();
    clearInterval(poll); poll = setInterval(tick, 4000);
  }

  window.SofiTurnirPlay = {
    open,
    resume(won) { playing = false; lastKey = ""; if (!root) shell(); root.style.display = ""; view(`<div class="tp-card ${won ? "win" : ""}"><span class="tp-big">${won ? "🏆" : "🤝"}</span><h2>${won ? "G‘alaba! Keyingi bosqichga o‘tdingiz" : "O‘yin tugadi"}</h2><p>Natijalar yangilanmoqda…</p></div>`); setTimeout(tick, 1500); clearInterval(poll); poll = setInterval(tick, 4000); },
  };

  const check = () => { if (location.hash === "#turnir") setTimeout(open, 600); };
  window.addEventListener("hashchange", check);
  check();
  document.addEventListener("click", (e) => { if (e.target.closest("[data-tn-play]")) { history.replaceState(null, "", "#turnir"); open(); } });
})();
