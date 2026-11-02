/* Shashka — rus shashkasi qoidalari bilan 2D o‘yin.
   Taxta va boshqaruv shaxmatdagidek: a–h / 1–8 koordinatalari, yurishlar ro‘yxati,
   oxirgi yurish belgisi, mumkin bo‘lgan yurishlar nuqtalari, taxtani aylantirish,
   taslim bo‘lish, durang taklifi va (do‘st bilan o‘ynaganda) shaxmat soati.
   Rejimlar: kompyuterga qarshi (3 daraja), bitta qurilmada 2 kishi, do‘st bilan onlayn. */
(() => {
  "use strict";

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const FILES = "abcdefgh";
  const DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  const on = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const sqName = (i) => FILES[i & 7] + (8 - (i >> 3));
  const promoRow = (side) => (side === 1 ? 0 : 7);
  const CLOCK_MS = 10 * 60 * 1000;
  const LEVELS = {
    easy: { name: "Oson", depth: 2, random: 0.4, ms: 300 },
    medium: { name: "O‘rta", depth: 4, random: 0, ms: 500 },
    hard: { name: "Qiyin", depth: 12, random: 0, ms: 1300 }
  };

  // ================= Qoidalar (rus shashkasi) =================
  // Taxta: 64 katak, 0 — bo‘sh, 1 — oq dona, 2 — oq damka, -1 — qora dona, -2 — qora damka.
  // Oq pastda (6–8-qatorlar), birinchi oq yuradi.
  function initialBoard() {
    const b = new Int8Array(64);
    for (let i = 0; i < 64; i++) {
      const r = i >> 3, c = i & 7;
      if ((r + c) % 2) { if (r < 3) b[i] = -1; else if (r > 4) b[i] = 1; }
    }
    return b;
  }

  // Bitta urish imkoniyatlari: [olinadigan katak, [tushish kataklari]]
  function jumps(b, sq, king, side, caps) {
    const out = [];
    const r = sq >> 3, c = sq & 7;
    for (const [dr, dc] of DIRS) {
      if (!king) {
        const r2 = r + 2 * dr, c2 = c + 2 * dc;
        if (!on(r2, c2)) continue;
        const m = (r + dr) * 8 + c + dc, l = r2 * 8 + c2;
        if (b[m] * side < 0 && !caps.includes(m) && b[l] === 0) out.push([m, [l]]);
      } else {
        let rr = r + dr, cc = c + dc;
        while (on(rr, cc) && b[rr * 8 + cc] === 0) { rr += dr; cc += dc; }
        if (!on(rr, cc)) continue;
        const m = rr * 8 + cc;
        if (b[m] * side >= 0 || caps.includes(m)) continue;
        const lands = [];
        rr += dr; cc += dc;
        while (on(rr, cc) && b[rr * 8 + cc] === 0) { lands.push(rr * 8 + cc); rr += dr; cc += dc; }
        if (lands.length) out.push([m, lands]);
      }
    }
    return out;
  }

  // Ketma-ket urishlarning barcha yo‘llari. Olingan donalar yurish oxirigacha taxtada qoladi
  // (bir donani ikki marta urib bo‘lmaydi). Oddiy dona oxirgi qatorga yetsa — damkaga aylanib urishda davom etadi.
  function captureChains(b, sq, king, side, caps, path, out) {
    const js = jumps(b, sq, king, side, caps);
    if (!js.length) {
      if (caps.length) out.push({ path: path.slice(), caps: caps.slice(), king });
      return;
    }
    for (const [m, lands] of js) {
      const nc = caps.concat(m);
      let use = lands;
      if (king && lands.length > 1) {
        // Damka urishni davom ettira oladigan katakka tushishi shart.
        const cont = lands.filter((l) => jumps(b, l, true, side, nc).length);
        if (cont.length) use = cont;
      }
      for (const l of use) {
        const k = king || (l >> 3) === promoRow(side);
        path.push(l);
        captureChains(b, l, k, side, nc, path, out);
        path.pop();
      }
    }
  }

  function legalMoves(b, side) {
    const caps = [];
    for (let i = 0; i < 64; i++) {
      const p = b[i];
      if (p * side <= 0) continue;
      b[i] = 0;
      const out = [];
      captureChains(b, i, Math.abs(p) === 2, side, [], [], out);
      b[i] = p;
      for (const o of out) caps.push({ from: i, path: o.path, caps: o.caps, king: o.king, to: o.path[o.path.length - 1] });
    }
    if (caps.length) return caps; // urish majburiy
    const quiet = [];
    for (let i = 0; i < 64; i++) {
      const p = b[i];
      if (p * side <= 0) continue;
      const r = i >> 3, c = i & 7;
      if (Math.abs(p) === 1) {
        const r1 = r - side;
        for (const dc of [-1, 1]) {
          if (!on(r1, c + dc)) continue;
          const t = r1 * 8 + c + dc;
          if (b[t] === 0) quiet.push({ from: i, path: [t], caps: [], king: r1 === promoRow(side), to: t });
        }
      } else {
        for (const [dr, dc] of DIRS) {
          let rr = r + dr, cc = c + dc;
          while (on(rr, cc) && b[rr * 8 + cc] === 0) {
            const t = rr * 8 + cc;
            quiet.push({ from: i, path: [t], caps: [], king: true, to: t });
            rr += dr; cc += dc;
          }
        }
      }
    }
    return quiet;
  }

  function applyMove(b, mv) {
    const nb = b.slice();
    const p = nb[mv.from];
    nb[mv.from] = 0;
    for (const c of mv.caps) nb[c] = 0;
    nb[mv.to] = mv.king ? 2 * Math.sign(p) : p;
    return nb;
  }

  const moveText = (mv) => sqName(mv.from) + (mv.caps.length ? ":" + mv.path.map(sqName).join(":") : "-" + sqName(mv.to));

  // ================= Kompyuter =================
  function evaluate(b, side) {
    let s = 0;
    for (let i = 0; i < 64; i++) {
      const p = b[i];
      if (!p) continue;
      const r = i >> 3, c = i & 7;
      const center = c >= 2 && c <= 5 && r >= 2 && r <= 5 ? 4 : 0;
      if (p === 1) s += 100 + (7 - r) * 3 + (r === 7 ? 6 : 0) + center;
      else if (p === -1) s -= 100 + r * 3 + (r === 0 ? 6 : 0) + center;
      else if (p === 2) s += 310;
      else s -= 310;
    }
    return s * side;
  }

  const STOP = {};
  function negamax(b, side, depth, alpha, beta, ply, ctl) {
    if ((++ctl.n & 1023) === 0 && performance.now() > ctl.deadline) throw STOP;
    const ms = legalMoves(b, side);
    if (!ms.length) return -100000 + ply;
    const forced = ms[0].caps.length > 0;
    if ((depth <= 0 && !forced) || depth <= -8) return evaluate(b, side);
    if (forced) ms.sort((x, y) => y.caps.length - x.caps.length);
    let best = -Infinity;
    for (const m of ms) {
      const v = -negamax(applyMove(b, m), -side, depth - 1, -beta, -alpha, ply + 1, ctl);
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (alpha >= beta) break;
    }
    return best;
  }

  function aiMove(b, side, levelKey) {
    const L = LEVELS[levelKey];
    const ms = legalMoves(b, side);
    if (ms.length === 1) return ms[0];
    for (let i = ms.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ms[i], ms[j]] = [ms[j], ms[i]]; }
    if (L.random && Math.random() < L.random) return ms[0];
    const ctl = { n: 0, deadline: performance.now() + L.ms };
    let bestMove = ms[0];
    let order = ms;
    for (let d = 1; d <= L.depth; d++) {
      try {
        let best = -Infinity, bm = order[0], alpha = -Infinity;
        const scored = [];
        for (const m of order) {
          const v = -negamax(applyMove(b, m), -side, d - 1, -Infinity, -alpha, 1, ctl);
          scored.push([v, m]);
          if (v > best) { best = v; bm = m; }
          if (v > alpha) alpha = v;
        }
        bestMove = bm;
        order = scored.sort((x, y) => y[0] - x[0]).map((x) => x[1]);
        if (best > 90000) break; // aniq g‘alaba topildi
      } catch (e) {
        if (e !== STOP) throw e;
        break;
      }
    }
    return bestMove;
  }

  // ================= Oyna (UI) =================
  function mount(root, ctx) {
    const friend = !!ctx.opponent;
    let alive = true;
    const timers = new Set();
    const later = (fn, ms) => {
      const t = setTimeout(() => { timers.delete(t); if (alive) fn(); }, ms);
      timers.add(t);
      return t;
    };
    const wait = (ms) => new Promise((res) => later(res, ms));
    let clockTimer = null;
    let resendTimer = null;

    if (friend) {
      const names = [ctx.me.name, ctx.opponent.name].sort();
      const white = Math.abs(ctx.seed) % 2 ? names[0] : names[1];
      play({ mode: "friend", me: white === ctx.me.name ? 1 : -1 });
    } else {
      setup();
    }

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      clearInterval(clockTimer);
      clearInterval(resendTimer);
    };

    // ---------- Sozlash oynasi ----------
    function setup() {
      const pick = { level: "medium", color: "white" };
      root.innerHTML = `
        <div class="sh-setup">
          <div class="sh-setup-card">
            <div class="sh-setup-logo" aria-hidden="true"><i class="w"></i><i class="b"></i></div>
            <h2>Shashka</h2>
            <p>Rus shashkasi qoidalari: urish majburiy, donalar orqaga ham uradi, damka uzoqqa yuradi.</p>
            <h3>Kim bilan o‘ynaysiz?</h3>
            <div class="sh-opts" data-g="level">
              <button data-v="easy"><b>🙂 Oson</b><small>Kompyuter</small></button>
              <button data-v="medium" class="on"><b>🤔 O‘rta</b><small>Kompyuter</small></button>
              <button data-v="hard"><b>🧠 Qiyin</b><small>Kompyuter · ⭐</small></button>
              <button data-v="local"><b>👥 Ikki kishi</b><small>Bitta qurilmada</small></button>
            </div>
            <div data-colorbox>
              <h3>Rangingiz</h3>
              <div class="sh-opts three" data-g="color">
                <button data-v="white" class="on"><b>⚪ Oq</b><small>Birinchi yurasiz</small></button>
                <button data-v="black"><b>⚫ Qora</b><small>Ikkinchi</small></button>
                <button data-v="random"><b>🎲 Tasodifiy</b><small>&nbsp;</small></button>
              </div>
            </div>
            <button class="btn sh-go" data-go>▶ Boshlash</button>
            <p class="sh-hint">⭐ Yulduz “Qiyin” darajadagi kompyuterni yutganda yoki do‘stingizni onlayn yutganda beriladi.</p>
          </div>
        </div>`;
      root.querySelectorAll(".sh-opts").forEach((g) => {
        g.addEventListener("click", (e) => {
          const btn = e.target.closest("button");
          if (!btn) return;
          g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === btn));
          pick[g.dataset.g] = btn.dataset.v;
          root.querySelector("[data-colorbox]").hidden = pick.level === "local";
        });
      });
      root.querySelector("[data-go]").onclick = () => {
        if (pick.level === "local") return play({ mode: "local", me: 1 });
        const me = pick.color === "random" ? (Math.random() < 0.5 ? 1 : -1) : pick.color === "white" ? 1 : -1;
        play({ mode: "ai", level: pick.level, me });
      };
    }

    // ---------- O‘yin ----------
    function play(cfg) {
      const { mode } = cfg;
      const me = cfg.me;
      let b = initialBoard();
      let ids = new Int16Array(64);
      let nextId = 1;
      for (let i = 0; i < 64; i++) if (b[i]) ids[i] = nextId++;
      let turn = 1;
      let flipped = mode !== "local" && me === -1;
      let sel = null;
      let prefix = [];
      let legal = legalMoves(b, turn);
      let last = null;
      let busy = false;
      let over = false;
      let notation = [];
      let keys = [key()];
      let kingQuiet = 0;
      const taken = { 1: 0, "-1": 0 };
      const history = [];
      const clock = { 1: CLOCK_MS, "-1": CLOCK_MS };
      let clockAt = performance.now();
      let drawOffered = false;
      let sentN = 0, ackedN = 0, lastSent = null;
      let remoteQueue = Promise.resolve();

      const sideName = (s) => (s === 1 ? "Oq" : "Qora");
      const who = (s) => {
        if (mode === "local") return `${sideName(s)} donalar`;
        if (s === me) return ctx.me.name;
        return mode === "ai" ? `Kompyuter · ${LEVELS[cfg.level].name}` : ctx.opponent.name;
      };
      const human = (s) => mode === "local" || s === me;
      const bottomSide = () => (flipped ? -1 : 1);

      root.innerHTML = `
        <div class="sh-wrap">
          <div class="sh-main">
            <div class="sh-player" data-pl="top"></div>
            <div class="sh-board-box">
              <div class="sh-board" data-board>
                <div class="sh-squares"></div>
                <div class="sh-layer"></div>
              </div>
            </div>
            <div class="sh-player" data-pl="bottom"></div>
          </div>
          <aside class="sh-side">
            <div class="sh-status" data-status></div>
            <div class="sh-offer" data-offer hidden></div>
            <div class="sh-moves">
              <h4>📜 Yurishlar</h4>
              <ol data-moves></ol>
            </div>
            <div class="sh-actions">
              ${mode === "ai" ? '<button class="btn secondary" data-undo>↶ Orqaga</button>' : ""}
              <button class="btn secondary" data-flip>⇅ Aylantirish</button>
              ${mode === "friend" ? '<button class="btn secondary" data-draw>🤝 Durang taklif</button>' : ""}
              <button class="btn secondary sh-resign" data-resign>🏳 Taslim bo‘lish</button>
            </div>
            <details class="sh-rules">
              <summary>📖 Qoidalar</summary>
              <ul>
                <li>Donalar faqat qora kataklarda, diagonal bo‘ylab bir katak oldinga yuradi. Birinchi bo‘lib oq yuradi.</li>
                <li><b>Urish majburiy.</b> Dona oldinga ham, orqaga ham uradi. Urib bo‘lgach yana urish mumkin bo‘lsa — davom ettiriladi.</li>
                <li>Oxirgi qatorga yetgan dona <b>damka</b> 👑 bo‘ladi: diagonal bo‘ylab istalgan masofaga yuradi va uradi.</li>
                <li>Raqibning barcha donasini olgan yoki uni yurolmaydigan qilib qo‘ygan o‘yinchi yutadi.</li>
                <li>Bir xil holat 3 marta takrorlansa yoki 15 yurish davomida faqat damkalar urishsiz yursa — durang.</li>
              </ul>
            </details>
          </aside>
        </div>`;

      const boardEl = root.querySelector("[data-board]");
      const sqWrap = root.querySelector(".sh-squares");
      const layer = root.querySelector(".sh-layer");
      const statusEl = root.querySelector("[data-status]");
      const movesEl = root.querySelector("[data-moves]");
      const offerEl = root.querySelector("[data-offer]");
      const pieceEls = new Map();

      // Ko‘rinishdagi (qator, ustun) <-> taxtadagi katak
      const toView = (i) => (flipped ? 63 - i : i);
      const place = (el, i) => {
        const v = toView(i);
        el.style.left = (v & 7) * 12.5 + "%";
        el.style.top = (v >> 3) * 12.5 + "%";
      };

      function drawSquares() {
        let html = "";
        for (let v = 0; v < 64; v++) {
          const i = toView(v);
          const vr = v >> 3, vc = v & 7;
          const dark = ((i >> 3) + (i & 7)) % 2 === 1;
          html += `<div class="sh-sq ${dark ? "d" : "l"}" data-sq="${i}">${vc === 0 ? `<span class="rk">${8 - (i >> 3)}</span>` : ""}${vr === 7 ? `<span class="fl">${FILES[i & 7]}</span>` : ""}</div>`;
        }
        sqWrap.innerHTML = html;
      }

      function buildPieces() {
        layer.innerHTML = "";
        pieceEls.clear();
        for (let i = 0; i < 64; i++) {
          if (!b[i]) continue;
          const el = document.createElement("div");
          el.className = "sh-pc " + (b[i] > 0 ? "w" : "b") + (Math.abs(b[i]) === 2 ? " k" : "");
          el.innerHTML = "<i></i>";
          place(el, i);
          layer.appendChild(el);
          pieceEls.set(ids[i], el);
        }
      }

      function fmt(ms) {
        ms = Math.max(0, ms);
        const s = Math.ceil(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      }

      function drawPlayers() {
        for (const [slot, s] of [["bottom", bottomSide()], ["top", -bottomSide()]]) {
          const el = root.querySelector(`[data-pl="${slot}"]`);
          const left = b.reduce((n, p) => n + (p * s > 0 ? 1 : 0), 0);
          const kings = b.reduce((n, p) => n + (p === 2 * s ? 1 : 0), 0);
          const active = !over && turn === s;
          const avatar = mode === "ai" && s !== me ? "🤖" : s === 1 ? "⚪" : "⚫";
          el.className = `sh-player ${active ? "active" : ""}`;
          el.innerHTML = `
            <span class="sh-av ${s === 1 ? "w" : "b"}">${avatar}</span>
            <span class="sh-pn"><b>${esc(who(s))}</b><small>${sideName(s)} · ${left} ta dona${kings ? ` · 👑${kings}` : ""}</small></span>
            <span class="sh-taken" title="Olingan donalar">${"<i></i>".repeat(Math.min(taken[s], 12))}${taken[s] ? `<em>${taken[s]}</em>` : ""}</span>
            ${mode === "friend" ? `<span class="sh-clock ${active ? "run" : ""} ${clock[s] < 30000 ? "low" : ""}" data-clock="${s}">${fmt(clock[s])}</span>` : ""}`;
        }
      }

      function drawMoves() {
        let html = "";
        for (let k = 0; k < notation.length; k += 2) {
          html += `<li><span>${notation[k]}</span><span>${notation[k + 1] || ""}</span></li>`;
        }
        movesEl.innerHTML = html || '<li class="sh-empty">Hali yurish qilinmadi</li>';
        movesEl.scrollTop = movesEl.scrollHeight;
      }

      function drawStatus(text) {
        if (text) { statusEl.innerHTML = text; return; }
        if (over) return;
        const forced = legal.length && legal[0].caps.length;
        let t;
        if (mode === "local") t = `<b>${sideName(turn)}</b> yuradi`;
        else if (turn === me) t = "<b>Sizning navbatingiz</b>";
        else t = mode === "ai" ? '<span class="sh-dots">Kompyuter o‘ylamoqda</span>' : `<span class="sh-dots">${esc(ctx.opponent.name)} o‘ylamoqda</span>`;
        statusEl.innerHTML = `<span class="sh-turn ${turn === 1 ? "w" : "b"}"></span>${t}${forced && human(turn) ? '<small>⚔️ Urish majburiy!</small>' : ""}`;
      }

      function drawMarks() {
        root.querySelectorAll(".sh-sq").forEach((el) => el.classList.remove("sel", "dot", "cap", "last", "must"));
        if (last) {
          for (const i of [last.from, last.to]) root.querySelector(`[data-sq="${i}"]`).classList.add("last");
        }
        if (over || busy || !human(turn)) return;
        if (legal.length && legal[0].caps.length) {
          new Set(legal.map((m) => m.from)).forEach((i) => root.querySelector(`[data-sq="${i}"]`).classList.add("must"));
        }
        if (sel === null) return;
        root.querySelector(`[data-sq="${prefix.length ? prefix[prefix.length - 1] : sel}"]`).classList.add("sel");
        nextTargets().forEach((t) => root.querySelector(`[data-sq="${t}"]`).classList.add(legal[0].caps.length ? "cap" : "dot"));
      }

      const candidates = () => legal.filter((m) => m.from === sel && prefix.every((p, k) => m.path[k] === p));
      const nextTargets = () => [...new Set(candidates().filter((m) => m.path.length > prefix.length).map((m) => m.path[prefix.length]))];

      function redraw() { drawPlayers(); drawMoves(); drawStatus(); drawMarks(); }

      function key() { return turn + ":" + b.join(","); }

      // ---------- Bosish ----------
      boardEl.addEventListener("click", (e) => {
        const sqEl = e.target.closest("[data-sq]") || squareAt(e);
        if (!sqEl || over || busy || !human(turn)) return;
        const i = Number(sqEl.dataset.sq);
        if (sel !== null && nextTargets().includes(i)) {
          prefix.push(i);
          const cands = candidates();
          const done = cands.find((m) => m.path.length === prefix.length);
          if (done && cands.every((m) => m.path.length === prefix.length)) {
            const shown = prefix.length - 1;
            sel = null; prefix = [];
            doMove(done, false, shown);
          } else {
            const el = pieceEls.get(ids[sel]);
            if (el) place(el, i);
            ctx.sfx.tick();
            drawMarks();
          }
          return;
        }
        if (prefix.length) {
          // Urish yarmida — boshidan tanlash uchun dastlabki donaga bosiladi.
          if (i === sel) { const el = pieceEls.get(ids[sel]); if (el) place(el, sel); prefix = []; drawMarks(); }
          return;
        }
        if (legal.some((m) => m.from === i)) { sel = sel === i ? null : i; drawMarks(); }
        else if (b[i] * turn > 0 && legal.length && legal[0].caps.length) { flash("⚔️ Urish majburiy — belgilangan donalardan biri bilan uring!"); }
        else { sel = null; drawMarks(); }
      });
      // Dona ustiga bosilganda ham katakni topish
      function squareAt(e) {
        const r = boardEl.getBoundingClientRect();
        const vc = Math.floor(((e.clientX - r.left) / r.width) * 8), vr = Math.floor(((e.clientY - r.top) / r.height) * 8);
        if (!on(vr, vc)) return null;
        return root.querySelector(`[data-sq="${toView(vr * 8 + vc)}"]`);
      }
      layer.style.pointerEvents = "none";

      function flash(text) {
        drawStatus(`<span class="sh-warn">${text}</span>`);
        ctx.sfx.bad();
        later(() => drawStatus(), 1600);
      }

      // ---------- Yurish ----------
      async function doMove(mv, remote, startAt = 0) {
        busy = true;
        history.push({ b: b.slice(), ids: ids.slice(), turn, last, notation: notation.slice(), keys: keys.slice(), kingQuiet, taken: { ...taken } });
        drawMarks();
        const id = ids[mv.from];
        const el = pieceEls.get(id);
        if (friend && !remote) sendMove(mv);
        // Animatsiya: har bir qadam alohida
        if (el) {
          el.classList.add("moving");
          for (let k = startAt; k < mv.path.length; k++) {
            place(el, mv.path[k]);
            if (mv.caps.length) ctx.sfx.tick();
            await wait(mv.caps.length ? 210 : 190);
          }
          el.classList.remove("moving");
        }
        mv.caps.forEach((c) => {
          const ce = pieceEls.get(ids[c]);
          if (ce) { ce.classList.add("gone"); later(() => ce.remove(), 300); pieceEls.delete(ids[c]); }
          ids[c] = 0;
        });
        const wasKing = Math.abs(b[mv.from]) === 2;
        b = applyMove(b, mv);
        ids[mv.from] = 0;
        ids[mv.to] = id;
        if (el && mv.king && !wasKing) { el.classList.add("k", "crown"); later(() => el.classList.remove("crown"), 900); }
        taken[turn] += mv.caps.length;
        notation.push(moveText(mv));
        kingQuiet = wasKing && !mv.caps.length ? kingQuiet + 1 : 0;
        if (mv.caps.length) ctx.sfx.good(); else ctx.sfx.tick();
        last = { from: mv.from, to: mv.to };
        // Soat
        const now = performance.now();
        if (friend && notation.length > 1) clock[turn] -= now - clockAt;
        clockAt = now;
        turn = -turn;
        keys.push(key());
        legal = legalMoves(b, turn);
        busy = false;
        drawOffered = false;
        redraw();

        if (!legal.length) {
          const left = b.some((p) => p * turn > 0);
          return end(-turn, left ? `${sideName(turn)} donalar yurolmaydi — yo‘l to‘sildi.` : `${sideName(turn)} donalarning barchasi olindi.`);
        }
        if (keys.filter((k) => k === keys[keys.length - 1]).length >= 3) return end(0, "Bir xil holat 3 marta takrorlandi.");
        if (kingQuiet >= 30) return end(0, "15 yurish davomida faqat damkalar urishsiz yurdi.");
        if (mode === "ai" && turn !== me) later(think, 380);
      }

      function think() {
        if (over || turn === me) return;
        const mv = aiMove(b, turn, cfg.level);
        if (mv) doMove(mv, true);
      }

      // ---------- Tugash ----------
      function end(winner, reason, opts = {}) {
        if (over) return;
        over = true;
        sel = null; prefix = [];
        clearInterval(clockTimer);
        clearInterval(resendTimer);
        drawPlayers();
        drawMarks();
        offerEl.hidden = true;
        root.querySelectorAll(".sh-actions [data-undo], .sh-actions [data-draw], .sh-actions [data-resign]").forEach((x) => (x.disabled = true));
        const head = winner === 0 ? "🤝 Durang!" : mode === "local" ? `🏆 ${sideName(winner)} donalar yutdi!` : winner === me ? "🏆 Siz yutdingiz!" : "🙂 Bu safar raqib yutdi";
        statusEl.innerHTML = `<b>${head}</b><small>${esc(reason)}</small>`;
        if (winner === me && mode !== "local") ctx.confetti(70);
        const moves = Math.ceil(notation.length / 2);
        let result;
        if (mode === "local") {
          result = {
            title: winner === 0 ? "Durang!" : `${sideName(winner)} donalar yutdi!`,
            text: reason,
            rows: [["Yurishlar", String(moves)], ["Oq olgan donalar", String(taken[1])], ["Qora olgan donalar", String(taken[-1])]],
            earnStar: false,
            starHint: "Bitta qurilmada ikki kishi o‘ynaganda yulduz berilmaydi."
          };
        } else {
          const won = winner === 0 ? undefined : winner === me;
          const opName = mode === "ai" ? "Kompyuter" : ctx.opponent.name;
          const rows = [["Rangingiz", sideName(me)], ["Yurishlar", String(moves)], ["Olingan donalar", `${taken[me]} : ${taken[-me]}`]];
          if (mode === "ai") rows.unshift(["Daraja", LEVELS[cfg.level].name]);
          let earnStar = false, starHint;
          if (mode === "ai") {
            earnStar = won === true && cfg.level === "hard";
            starHint = cfg.level === "hard" ? "“Qiyin” kompyuterni yutsangiz +1 ⭐ olasiz." : "Yulduz faqat “Qiyin” darajadagi kompyuterni yutganda beriladi.";
          } else {
            earnStar = won === true && !opts.forfeit;
            starHint = won && opts.forfeit ? "Raqib o‘yindan chiqib ketgani uchun yulduz berilmaydi." : "Yulduzni faqat g‘olib oladi.";
          }
          result = {
            title: winner === 0 ? "Durang!" : won ? "Siz yutdingiz!" : `${opName} yutdi`,
            text: reason,
            won,
            rows,
            earnStar,
            starHint
          };
        }
        later(() => ctx.finish(result), 1800);
      }

      // ---------- Tugmalar ----------
      root.querySelector("[data-flip]").onclick = () => {
        flipped = !flipped;
        drawSquares();
        buildPieces();
        redraw();
      };
      root.querySelector("[data-resign]").onclick = () => {
        if (over || busy) return;
        if (!confirm("Rostdan ham taslim bo‘lasizmi?")) return;
        if (mode === "local") return end(-turn, `${sideName(turn)} donalar taslim bo‘ldi.`);
        if (friend) ctx.send({ k: "resign" });
        end(-me, "Siz taslim bo‘ldingiz.");
      };
      const undoBtn = root.querySelector("[data-undo]");
      if (undoBtn) undoBtn.onclick = () => {
        if (over || busy || turn !== me || !history.length) return;
        let snap = history.pop();
        while (snap.turn !== me && history.length) snap = history.pop();
        if (snap.turn !== me) { history.push(snap); return; }
        ({ turn, last, kingQuiet } = snap);
        b = snap.b; ids = snap.ids; notation = snap.notation; keys = snap.keys;
        Object.assign(taken, snap.taken);
        sel = null; prefix = [];
        legal = legalMoves(b, turn);
        buildPieces();
        redraw();
      };
      const drawBtn = root.querySelector("[data-draw]");
      if (drawBtn) drawBtn.onclick = () => {
        if (over || drawOffered) return;
        if (notation.length < 6) { flash("Durangni kamida 3 yurishdan keyin taklif qilish mumkin."); return; }
        drawOffered = true;
        ctx.send({ k: "drawOffer" });
        ctx.toast("Durang taklifi yuborildi.");
      };

      // ---------- Do‘st bilan (onlayn) ----------
      function sendMove(mv) {
        sentN = notation.length + 1;
        const now = performance.now();
        const myLeft = notation.length ? clock[me] - (now - clockAt) : clock[me];
        lastSent = { k: "mv", n: sentN, from: mv.from, path: mv.path, t: Math.round(myLeft) };
        ctx.send(lastSent);
      }
      function receive(d) {
        if (!d || over) return;
        if (d.k === "mv") {
          ctx.send({ k: "ack", n: d.n });
          if (d.n !== notation.length + 1) return; // takror yoki eski xabar
          remoteQueue = remoteQueue.then(async () => {
            while (busy) await wait(50);
            if (over || d.n !== notation.length + 1 || turn === me) return;
            const mv = legal.find((m) => m.from === d.from && m.path.length === d.path.length && m.path.every((p, k) => p === d.path[k]));
            if (!mv) { ctx.toast("Yurishni o‘qib bo‘lmadi.", "bad"); return; }
            await doMove(mv, true);
            if (typeof d.t === "number") { clock[-me] = d.t; drawPlayers(); }
          });
        } else if (d.k === "ack") {
          if (d.n >= sentN) ackedN = d.n;
        } else if (d.k === "resign") {
          end(me, `${ctx.opponent.name} taslim bo‘ldi.`);
        } else if (d.k === "flag") {
          end(me, `${ctx.opponent.name}ning vaqti tugadi.`);
        } else if (d.k === "drawOffer") {
          offerEl.hidden = false;
          offerEl.innerHTML = `<p>🤝 <b>${esc(ctx.opponent.name)}</b> durang taklif qilmoqda.</p><div><button class="btn" data-yes>Qabul qilish</button><button class="btn secondary" data-no>Rad etish</button></div>`;
          offerEl.querySelector("[data-yes]").onclick = () => { ctx.send({ k: "drawYes" }); end(0, "Ikkala o‘yinchi durangga kelishdi."); };
          offerEl.querySelector("[data-no]").onclick = () => { ctx.send({ k: "drawNo" }); offerEl.hidden = true; };
        } else if (d.k === "drawYes") {
          end(0, "Ikkala o‘yinchi durangga kelishdi.");
        } else if (d.k === "drawNo") {
          ctx.toast(`${ctx.opponent.name} durangni rad etdi.`);
        }
      }

      if (friend) {
        ctx.onMsg(receive);
        ctx.onOpponentLeft(() => end(me, `${ctx.opponent.name} o‘yindan chiqib ketdi.`, { forfeit: true }));
        // Xabar yo‘qolsa — yurish qayta yuboriladi
        resendTimer = setInterval(() => { if (lastSent && ackedN < sentN) ctx.send(lastSent); }, 2000);
        clockTimer = setInterval(() => {
          if (over || notation.length === 0) return;
          const left = clock[turn] - (performance.now() - clockAt);
          const el = root.querySelector(`[data-clock="${turn}"]`);
          if (el) { el.textContent = fmt(left); el.classList.toggle("low", left < 30000); }
          if (left <= 0 && turn === me && !busy) { ctx.send({ k: "flag" }); end(-me, "Vaqtingiz tugadi."); }
          else if (left <= -5000 && turn !== me) end(me, `${ctx.opponent.name}ning vaqti tugadi.`);
        }, 250);
      }

      drawSquares();
      buildPieces();
      redraw();
      if (friend) ctx.toast(me === 1 ? "Siz oq donalar bilan o‘ynaysiz — birinchi yurasiz!" : "Siz qora donalar bilan o‘ynaysiz.");
      if (mode === "ai" && turn !== me) later(think, 600);
    }
  }

  // O‘yinlar sahifasidagi karta uchun kichik taxta
  const mini = document.getElementById("shMini");
  if (mini) {
    const b = initialBoard();
    mini.innerHTML = Array.from(b, (p, i) => `<i class="${((i >> 3) + (i & 7)) % 2 ? "d" : ""} ${p > 0 ? "w" : p < 0 ? "b" : ""}"></i>`).join("");
  }

  window.SofiShashka = { initialBoard, legalMoves, applyMove, aiMove, moveText };
  window.SofiGames.register({ id: "shashka", title: "Shashka", icon: "⛀", mount });
})();
