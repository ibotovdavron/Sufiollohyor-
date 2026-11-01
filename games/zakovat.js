/* ZAKOVAT — intellektual jamoaviy o'yin.
   2 yoki 3 ta guruh, har birida 4 kishigacha (1 sardor + 3 sherik).
   Har bir savolga 1 daqiqa: guruh muhokama qiladi, sardor yakuniy javobni beradi.
   Rejimlar: "Sinfda" (bitta ekran, ustoz boshqaradi) va "Onlayn xona" (har kim o'z telefonidan). */
(() => {
  "use strict";

  const BANK = window.ZAKOVAT_QUESTIONS || [];
  const G = window.SofiGames;
  const api = G.api;
  const $ = (s, p = document) => p.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const D = window.CENTER_DATA || {};
  const STUDENTS = (D.students || []).map((s) => s.name);

  const QTIME = 60;          // savol vaqti (soniya)
  const CAPTAIN_PHASE = 10;  // oxirgi soniyalar — sardor javobi
  const TEAM_MAX = 4;
  const TEAMS = [
    { id: "a", name: "Burgutlar", emb: "🦅", color: "#38bdf8" },
    { id: "b", name: "Sherlar", emb: "🦁", color: "#f5c84c" },
    { id: "c", name: "Qoplonlar", emb: "🐆", color: "#f472b6" }
  ];

  // ---------- Yordamchilar ----------
  const beep = (...a) => api.beep(...a);
  const sfx = {
    tick() { beep(1250, 0.05, "square", 0.025); },
    gong() { [196, 147, 98].forEach((f, i) => setTimeout(() => beep(f, 0.9, "triangle", 0.09), i * 120)); },
    good() { [660, 880, 1175].forEach((f, i) => setTimeout(() => beep(f, 0.16, "triangle"), i * 90)); },
    bad() { beep(180, 0.35, "sawtooth", 0.04); },
    open() { [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.12, "sine", 0.06), i * 70)); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.2, "triangle", 0.07), i * 130)); }
  };

  const norm = (s) => String(s || "").toLowerCase()
    .replace(/[ʻʼ‘’'`´]/g, "").replace(/,/g, ".")
    .replace(/[^a-z0-9а-яёўқғҳ. ]+/gi, " ").replace(/\s+/g, " ").trim();
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  /** Sardor javobini avtomatik tekshirish (boshlovchi keyin o'zgartira oladi). */
  function check(q, answer) {
    const ans = norm(answer);
    if (!ans) return false;
    const padded = " " + ans;
    return q.ok.some((ok) => {
      const o = norm(ok);
      if (padded.includes(" " + o)) return true;
      if (o.length >= 5 && !o.includes(" ")) return ans.split(" ").some((w) => lev(w, o) <= 1);
      return false;
    });
  }
  function pickQuestions(n, cat) {
    const pool = BANK.map((q, i) => ({ ...q, id: i })).filter((q) => cat === "mix" || q.cat === cat);
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    if (cat !== "mix") return pool.slice(0, n).map((q) => q.id);
    // Aralash: tarix va mantiqni navbatma-navbat
    const t = pool.filter((q) => q.cat === "Tarix"), m = pool.filter((q) => q.cat === "Mantiq"), out = [];
    while (out.length < n && (t.length || m.length)) { const a = out.length % 2 ? m : t; out.push((a.length ? a : (a === t ? m : t)).shift().id); }
    return out;
  }
  const qById = (id) => ({ ...BANK[id], id });

  function confetti(n = 120) {
    const box = document.createElement("div");
    box.className = "g-confetti";
    const colors = ["#f5c84c", "#38bdf8", "#f472b6", "#22e3a0", "#a78bfa"];
    for (let i = 0; i < n; i++) {
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

  // ---------- Sahna ----------
  let root = null;
  let cleanups = [];
  const onClose = (fn) => cleanups.push(fn);

  function openRoot() {
    closeRoot();
    root = document.createElement("div");
    root.className = "zk";
    root.innerHTML = `
      <div class="zk-bg" aria-hidden="true"><i class="s1"></i><i class="s2"></i><i class="s3"></i><div class="zk-stars"></div></div>
      <header class="zk-bar">
        <button class="zk-exit" type="button">← Chiqish</button>
        <div class="zk-brand"><span class="zk-owl">🦉</span><b>ZAKOVAT</b></div>
        <div class="zk-bar-r" id="zkBarR"></div>
      </header>
      <main class="zk-main" id="zkMain"></main>`;
    root.querySelector(".zk-stars").innerHTML = Array.from({ length: 40 }, (_, i) =>
      `<i style="left:${(i * 47) % 100}%;top:${(i * 29) % 100}%;animation-delay:${(i % 9) * 0.4}s"></i>`).join("");
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "zk-open");
    requestAnimationFrame(() => root.classList.add("show"));
    root.querySelector(".zk-exit").onclick = () => {
      if (root.dataset.busy === "1" && !confirm("O‘yindan chiqasizmi?")) return;
      closeRoot();
    };
    return $("#zkMain", root);
  }
  function closeRoot() {
    cleanups.forEach((fn) => { try { fn(); } catch (e) { /* bo'sh */ } });
    cleanups = [];
    if (root) root.remove();
    root = null;
    document.body.classList.remove("g-playing", "zk-open");
  }
  const main = () => $("#zkMain", root);
  const busy = (on) => { if (root) root.dataset.busy = on ? "1" : ""; };

  // ---------- Umumiy ko'rinishlar ----------
  const R = 54, CIRC = 2 * Math.PI * R;
  const timerHTML = () => `
    <div class="zk-timer" id="zkTimer">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="bg" cx="60" cy="60" r="${R}"/>
        <circle class="fg" cx="60" cy="60" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="0"/>
      </svg>
      <div class="zk-timer-n"><b id="zkSec">${QTIME}</b><small>soniya</small></div>
    </div>`;
  /** Taymer: endsAt (ms) gacha. getEnd() — yangilanib turadigan tugash vaqti. */
  function runClock(getEnd, onEnd) {
    let last = -1, done = false;
    const step = () => {
      if (done || !root) return;
      const el = $("#zkTimer", root);
      const left = Math.max(0, getEnd() - Date.now());
      const sec = Math.ceil(left / 1000);
      if (el) {
        el.querySelector(".fg").style.strokeDashoffset = String(CIRC * (1 - left / (QTIME * 1000)));
        $("#zkSec", root).textContent = sec;
        el.classList.toggle("warn", sec <= 20 && sec > CAPTAIN_PHASE);
        el.classList.toggle("danger", sec <= CAPTAIN_PHASE);
        const ph = $("#zkPhase", root);
        if (ph) {
          const cap = sec <= CAPTAIN_PHASE && sec > 0;
          ph.className = "zk-phase" + (cap ? " cap" : "");
          ph.innerHTML = sec === 0 ? "⏰ Vaqt tugadi!" : cap ? "👑 Sardor, javobni ayting!" : "💬 Guruhda muhokama";
        }
      }
      if (sec !== last) { if (sec <= CAPTAIN_PHASE && sec > 0) sfx.tick(); last = sec; }
      if (left <= 0) { done = true; sfx.gong(); onEnd && onEnd(); return; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    const stop = () => { done = true; };
    onClose(stop);
    return stop;
  }

  const scoreboard = (teams, extra = {}) => `
    <div class="zk-score">${teams.map((t) => `
      <div class="zk-team-chip ${extra.answered && extra.answered[t.id] ? "done" : ""} ${extra.mine === t.id ? "mine" : ""}" style="--c:${t.color}">
        <span class="em">${t.emb}</span>
        <span class="nm">${esc(t.name)}</span>
        <b class="pt">${t.score}${extra.plus && extra.plus[t.id] ? `<i>+1</i>` : ""}</b>
        ${extra.answered ? `<span class="st">${extra.answered[t.id] ? "✅" : "⏳"}</span>` : ""}
      </div>`).join("")}</div>`;

  const questionCard = (q, i, total) => `
    <div class="zk-qhead"><span class="zk-qnum">Savol <b>${i + 1}</b> / ${total}</span><span class="zk-cat ${q.cat === "Tarix" ? "t" : "m"}">${q.cat === "Tarix" ? "📜 Tarix" : "🧩 Mantiq"}</span></div>
    <div class="zk-qcard"><p class="zk-q">${esc(q.q)}</p></div>`;

  const answerFlip = (q, open) => `
    <div class="zk-flip ${open ? "open" : ""}" id="zkFlip">
      <div class="front">🔒 To‘g‘ri javob yashirin</div>
      <div class="back"><small>To‘g‘ri javob</small><b>${esc(q.a)}</b>${q.note ? `<p>${esc(q.note)}</p>` : ""}</div>
    </div>`;

  function podium(teams, sub = "") {
    const sorted = teams.slice().sort((a, b) => b.score - a.score);
    const top = sorted[0].score;
    const winners = sorted.filter((t) => t.score === top);
    const order = sorted.length === 3 ? [sorted[1], sorted[0], sorted[2]] : [sorted[1], sorted[0]];
    sfx.win();
    confetti();
    return `
      <div class="zk-final">
        <div class="zk-cup">🏆</div>
        <h2>${winners.length > 1 ? "Durang! G‘oliblar:" : "G‘olib guruh:"} <span>${winners.map((w) => `${w.emb} ${esc(w.name)}`).join(" va ")}</span></h2>
        ${sub ? `<p class="zk-sub">${sub}</p>` : ""}
        <div class="zk-podium">${order.map((t) => {
          const place = sorted.indexOf(t) + 1;
          const rank = sorted.findIndex((x) => x.score === t.score) + 1;
          return `<div class="zk-pod p${place}" style="--c:${t.color}">
            <span class="em">${t.emb}</span><b>${esc(t.name)}</b><span class="sc">${t.score} ball</span>
            ${t.members && t.members.length ? `<small>${t.members.map((m) => esc(m.name || m)).join(", ")}</small>` : ""}
            <div class="col"><i>${rank}</i></div></div>`;
        }).join("")}</div>
      </div>`;
  }

  // =========================================================
  //  MENYU
  // =========================================================
  function openMenu() {
    const m = openRoot();
    busy(false);
    m.innerHTML = `
      <section class="zk-intro">
        <div class="zk-owl-big">🦉</div>
        <h1>Zakovat</h1>
        <p>Jamoaviy intellektual o‘yin. 2 yoki 3 ta guruh, har birida 4 kishigacha — <b>1 sardor</b> va <b>3 sherik</b>. Har bir savolga <b>1 daqiqa</b>: sheriklar muhokama qiladi, sardor ularni tinglab yakuniy javobni beradi.</p>
        <div class="zk-rules">
          <div><span>👥</span><b>Guruh</b><small>4 kishigacha, 2–3 jamoa</small></div>
          <div><span>⏱️</span><b>1 daqiqa</b><small>har bir savolga</small></div>
          <div><span>👑</span><b>Sardor</b><small>yakuniy javobni beradi</small></div>
          <div><span>📜🧩</span><b>Savollar</b><small>tarix va mantiq</small></div>
        </div>
        <div class="zk-modes">
          <button class="zk-mode" data-m="class" type="button">
            <span class="ic">📺</span><b>Sinfda o‘ynash</b>
            <small>Bitta ekran (proyektor yoki telefon). Guruhlar stol atrofida muhokama qiladi, ustoz ballarni belgilaydi.</small>
          </button>
          <button class="zk-mode" data-m="online" type="button">
            <span class="ic">🌐</span><b>Onlayn xona</b>
            <small>Xona hammaga ko‘rinadi, har kim o‘z telefonidan kiradi. Joylar to‘lsa o‘yin o‘zi boshlanadi, guruh stol atrofida muhokama qiladi, natija avtomatik aytiladi.</small>
          </button>
        </div>
      </section>`;
    m.querySelector('[data-m="class"]').onclick = classSetup;
    m.querySelector('[data-m="online"]').onclick = onlineMenu;
  }

  // =========================================================
  //  SINFDA (bitta ekran)
  // =========================================================
  function classSetup() {
    const m = main();
    let count = 2;
    const datalist = `<datalist id="zkNames">${STUDENTS.map((n) => `<option value="${esc(n)}">`).join("")}</datalist>`;
    const draw = () => {
      m.innerHTML = `
        <section class="zk-setup">
          <h2>📺 Sinfda o‘ynash — sozlash</h2>
          <div class="zk-row">
            <span>Guruhlar soni:</span>
            <div class="zk-seg" id="zkCount">${[2, 3].map((n) => `<button type="button" data-n="${n}" class="${n === count ? "on" : ""}">${n} ta</button>`).join("")}</div>
          </div>
          <div class="zk-teams-form">${TEAMS.slice(0, count).map((t, ti) => `
            <div class="zk-tf" style="--c:${t.color}">
              <div class="zk-tf-head"><span>${t.emb}</span><input data-team="${ti}" value="${esc(t.name)}" aria-label="Guruh nomi" maxlength="20"></div>
              ${[0, 1, 2, 3].map((k) => `<label><span>${k === 0 ? "👑 Sardor" : `${k + 1}-a’zo`}</span>
                <input list="zkNames" data-mem="${ti}-${k}" placeholder="${k === 0 ? "Sardor ismi" : "Ism (ixtiyoriy)"}"></label>`).join("")}
            </div>`).join("")}</div>
          <div class="zk-row">
            <span>Savollar:</span>
            <div class="zk-seg" id="zkN">${[6, 10, 15].map((n) => `<button type="button" data-v="${n}" class="${n === 10 ? "on" : ""}">${n} ta</button>`).join("")}</div>
          </div>
          <div class="zk-row">
            <span>Mavzu:</span>
            <div class="zk-seg" id="zkCat">${[["mix", "Aralash"], ["Tarix", "📜 Tarix"], ["Mantiq", "🧩 Mantiq"]].map(([v, l]) => `<button type="button" data-v="${v}" class="${v === "mix" ? "on" : ""}">${l}</button>`).join("")}</div>
          </div>
          <button class="zk-btn big" id="zkGo" type="button">🚀 O‘yinni boshlash</button>
          ${datalist}
        </section>`;
      m.querySelectorAll("#zkCount button").forEach((b) => (b.onclick = () => { count = +b.dataset.n; draw(); }));
      ["#zkN", "#zkCat"].forEach((id) => m.querySelectorAll(`${id} button`).forEach((b) => (b.onclick = () => {
        m.querySelectorAll(`${id} button`).forEach((x) => x.classList.remove("on")); b.classList.add("on");
      })));
      m.querySelector("#zkGo").onclick = () => {
        const teams = TEAMS.slice(0, count).map((t, ti) => ({
          ...t,
          name: (m.querySelector(`[data-team="${ti}"]`).value.trim() || t.name).slice(0, 20),
          members: [0, 1, 2, 3].map((k) => m.querySelector(`[data-mem="${ti}-${k}"]`).value.trim()).filter(Boolean),
          score: 0
        }));
        const n = +m.querySelector("#zkN .on").dataset.v;
        const cat = m.querySelector("#zkCat .on").dataset.v;
        classGame({ teams, qs: pickQuestions(n, cat), i: 0 });
      };
    };
    draw();
  }

  function classGame(g) {
    busy(true);
    const showQuestion = () => {
      const q = qById(g.qs[g.i]);
      const verdict = {};
      let endsAt = 0, stop = null, phase = "read";
      const m = main();
      m.innerHTML = `
        ${scoreboard(g.teams)}
        <section class="zk-stage">
          ${questionCard(q, g.i, g.qs.length)}
          <div class="zk-mid">
            ${timerHTML()}
            <div class="zk-phase" id="zkPhase">📖 Savolni o‘qing</div>
          </div>
          <div class="zk-ctrl" id="zkCtrl">
            <button class="zk-btn big" id="zkStart" type="button">▶ 1 daqiqa — muhokamani boshlash</button>
          </div>
          <div id="zkJudge"></div>
        </section>`;
      typeIn(m.querySelector(".zk-q"));
      const judge = () => {
        phase = "judge";
        $("#zkCtrl", root).innerHTML = "";
        $("#zkJudge", root).innerHTML = `
          <div class="zk-judge">
            <h3>Sardorlar javobini ayting — to‘g‘ri topgan guruhni belgilang:</h3>
            <div class="zk-judge-rows">${g.teams.map((t) => `
              <div class="zk-jrow" style="--c:${t.color}" data-t="${t.id}">
                <span class="em">${t.emb}</span><b>${esc(t.name)}</b>
                <button type="button" class="ok" data-v="1">✓ To‘g‘ri</button>
                <button type="button" class="no" data-v="0">✗ Xato</button>
              </div>`).join("")}</div>
            ${answerFlip(q, false)}
            <div class="zk-ctrl">
              <button class="zk-btn ghost" id="zkOpen" type="button">🔓 To‘g‘ri javobni ochish</button>
              <button class="zk-btn" id="zkNext" type="button">${g.i + 1 < g.qs.length ? "Keyingi savol →" : "🏆 Natijalar"}</button>
            </div>
          </div>`;
        root.querySelectorAll(".zk-jrow button").forEach((b) => (b.onclick = () => {
          const row = b.closest(".zk-jrow"), id = row.dataset.t, v = b.dataset.v === "1";
          verdict[id] = verdict[id] === v ? undefined : v;
          row.classList.toggle("is-ok", verdict[id] === true);
          row.classList.toggle("is-no", verdict[id] === false);
          verdict[id] === true ? sfx.good() : verdict[id] === false ? sfx.bad() : 0;
        }));
        $("#zkOpen", root).onclick = (e) => { $("#zkFlip", root).classList.add("open"); sfx.open(); e.target.remove(); };
        $("#zkNext", root).onclick = () => {
          g.teams.forEach((t) => { if (verdict[t.id]) t.score++; });
          g.i++;
          if (g.i < g.qs.length) showQuestion(); else finish();
        };
        $("#zkJudge", root).scrollIntoView({ behavior: "smooth", block: "start" });
      };
      $("#zkStart", root).onclick = () => {
        phase = "run";
        endsAt = Date.now() + QTIME * 1000;
        $("#zkCtrl", root).innerHTML = `<button class="zk-btn ghost" id="zkStop" type="button">⏹ Javobga tayyormiz</button>`;
        $("#zkStop", root).onclick = () => { endsAt = Date.now(); };
        stop = runClock(() => endsAt, judge);
      };
      void phase; void stop;
    };
    const finish = () => {
      busy(false);
      main().innerHTML = podium(g.teams) + `<div class="zk-ctrl center"><button class="zk-btn" id="zkAgain" type="button">↻ Yangi o‘yin</button><button class="zk-btn ghost" id="zkMenu" type="button">Menyu</button></div>`;
      $("#zkAgain", root).onclick = classSetup;
      $("#zkMenu", root).onclick = openMenu;
    };
    showQuestion();
  }

  function typeIn(el) {
    if (!el) return;
    const text = el.textContent;
    el.textContent = "";
    el.classList.add("typing");
    let i = 0;
    const t = setInterval(() => {
      if (!el.isConnected) return clearInterval(t);
      i += 2;
      el.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(t); el.classList.remove("typing"); }
    }, 18);
    onClose(() => clearInterval(t));
  }

  // =========================================================
  //  ONLAYN XONA
  //  Xona ochilganda hammaga ko'rinadi. Joylar to'lsa o'yin o'zi boshlanadi.
  //  Guruh stol atrofida muhokama qiladi, sardor javob beradi, natija avtomatik e'lon qilinadi.
  // =========================================================
  const START_DELAY = 5000;  // hamma joy to'lgach, boshlanishgacha
  const REVEAL_MS = 9000;    // natijani ko'rsatish vaqti, keyin keyingi savol

  const rooms = new Map(); // lobbydagi ochiq xonalar
  const seenRooms = new Set();
  const liveRooms = () => {
    const now = Date.now();
    for (const [k, r] of rooms) if (now - r.seen > 9000) rooms.delete(k);
    return [...rooms.values()].filter((r) => r.phase === "lobby");
  };
  api.onMsg((m) => {
    if (m.t === "zk-room") {
      rooms.set(m.code, { ...m, seen: Date.now() });
      if (!seenRooms.has(m.code)) {
        seenRooms.add(m.code);
        if (!root && m.phase === "lobby" && m.hostCid !== G.session.cid) {
          api.toast(`🦉 ${m.host} Zakovat xonasini ochdi (#${m.code}). Zakovat kartasidagi “Kirish”ni bosing!`, "good");
          api.beep(784, 0.12, "triangle", 0.05);
        }
      }
      document.dispatchEvent(new CustomEvent("zk:rooms"));
    } else if (m.t === "zk-room-close") {
      rooms.delete(m.code);
      document.dispatchEvent(new CustomEvent("zk:rooms"));
    }
  });

  const roomRow = (r) => `
    <button class="zk-room" type="button" data-code="${esc(r.code)}" ${r.players >= r.cap ? "disabled" : ""}>
      <span class="code">#${esc(r.code)}</span>
      <span><b>Boshlovchi: ${esc(r.host)}</b><small>${r.teams} guruh × ${r.size} kishi · <i class="zk-fill"><i style="width:${Math.round((r.players / r.cap) * 100)}%"></i></i> ${r.players}/${r.cap} joy</small></span>
      <span class="go">${r.players >= r.cap ? "To‘lgan" : "Kirish →"}</span>
    </button>`;

  // O'yinlar sahifasidagi kartada jonli xonalar ro'yxati
  function drawLive() {
    const box = document.getElementById("zkLive");
    if (!box) return;
    const list = liveRooms();
    box.innerHTML = list.length
      ? `<div class="zk-live-head"><span class="zk-dot"></span> Ochiq xonalar — kiring!</div>${list.map(roomRow).join("")}`
      : `<div class="zk-live-head muted">Hozircha ochiq xona yo‘q — birinchi bo‘lib xona oching!</div>`;
    box.querySelectorAll("[data-code]").forEach((b) => (b.onclick = async () => {
      if (!(await needName())) return;
      openRoot();
      joinRoom(b.dataset.code);
    }));
  }
  document.addEventListener("zk:rooms", drawLive);
  setInterval(drawLive, 3000);
  setTimeout(drawLive, 300);

  async function needName() {
    if (G.session.name) return true;
    return api.askName();
  }

  async function onlineMenu() {
    if (!(await needName()) || !root) return;
    const m = main();
    const local = window.SofiNet && SofiNet.kind !== "online";
    const draw = () => {
      if (!root || !m.isConnected) return;
      const box = m.querySelector("#zkRooms");
      if (!box) return;
      const list = liveRooms();
      box.innerHTML = list.length ? list.map(roomRow).join("") : `<p class="zk-muted">Hozircha ochiq xona yo‘q. Ustoz yoki do‘stingiz xona ochsin — u shu yerda paydo bo‘ladi.</p>`;
      box.querySelectorAll("[data-code]").forEach((b) => (b.onclick = () => joinRoom(b.dataset.code)));
    };
    m.innerHTML = `
      <section class="zk-online-menu">
        <h2>🌐 Onlayn xona</h2>
        ${local ? `<p class="zk-warn">⚠️ Hozir internet aloqasi “faqat shu qurilma” rejimida — boshqa telefonlar bilan bog‘lanmaydi.</p>` : ""}
        <div class="zk-om-grid">
          <div class="zk-om-card">
            <span class="ic">🎙️</span><b>Xona ochish</b><small>Xona hammaga ko‘rinadi. Barcha joylar to‘lishi bilan o‘yin o‘zi boshlanadi. Siz ham guruhga qo‘shilib o‘ynashingiz mumkin.</small>
            <label class="zk-lbl">Guruhlar soni</label>
            <div class="zk-seg" id="zkCount">${[2, 3].map((n) => `<button type="button" data-n="${n}" class="${n === 2 ? "on" : ""}">${n} guruh</button>`).join("")}</div>
            <label class="zk-lbl">Har bir guruhda</label>
            <div class="zk-seg" id="zkSize">${[2, 3, 4].map((n) => `<button type="button" data-n="${n}" class="${n === 4 ? "on" : ""}">${n} kishi</button>`).join("")}</div>
            <label class="zk-lbl">Savollar</label>
            <div class="zk-seg" id="zkN">${[6, 10, 15].map((n) => `<button type="button" data-v="${n}" class="${n === 10 ? "on" : ""}">${n} ta</button>`).join("")}</div>
            <div class="zk-seg" id="zkCat">${[["mix", "Aralash"], ["Tarix", "Tarix"], ["Mantiq", "Mantiq"]].map(([v, l]) => `<button type="button" data-v="${v}" class="${v === "mix" ? "on" : ""}">${l}</button>`).join("")}</div>
            <button class="zk-btn" id="zkHost" type="button">🎙️ Xona ochish</button>
          </div>
          <div class="zk-om-card">
            <span class="ic">🚪</span><b>Xonaga kirish</b><small>Ochiq xonani tanlang yoki 4 xonali kodni kiriting.</small>
            <div id="zkRooms" class="zk-rooms"></div>
            <div class="zk-code"><input id="zkCode" inputmode="numeric" maxlength="4" placeholder="Kod: 1234" aria-label="Xona kodi"><button class="zk-btn" id="zkJoin" type="button">Kirish</button></div>
          </div>
        </div>
      </section>`;
    ["#zkCount", "#zkSize", "#zkN", "#zkCat"].forEach((id) => m.querySelectorAll(`${id} button`).forEach((b) => (b.onclick = () => {
      m.querySelectorAll(`${id} button`).forEach((x) => x.classList.remove("on")); b.classList.add("on");
    })));
    m.querySelector("#zkHost").onclick = () => hostRoom({
      count: +m.querySelector("#zkCount .on").dataset.n,
      size: +m.querySelector("#zkSize .on").dataset.n,
      n: +m.querySelector("#zkN .on").dataset.v,
      cat: m.querySelector("#zkCat .on").dataset.v
    });
    m.querySelector("#zkJoin").onclick = () => {
      const c = m.querySelector("#zkCode").value.replace(/\D/g, "");
      if (c.length !== 4) { api.toast("4 xonali kodni kiriting.", "bad"); return; }
      joinRoom(c);
    };
    draw();
    document.addEventListener("zk:rooms", draw);
    const iv = setInterval(draw, 3000);
    onClose(() => { document.removeEventListener("zk:rooms", draw); clearInterval(iv); });
  }

  // ---------- Xona dvigateli (xonani ochgan qurilmada ishlaydi) ----------
  async function hostRoom(opt) {
    const me = G.session;
    const code = String(1000 + ((Math.random() * 9000) | 0));
    const S = {
      code, phase: "lobby", size: opt.size,
      host: { cid: me.cid, name: me.name },
      teams: TEAMS.slice(0, opt.count).map((t) => ({ ...t, captain: null, members: [], score: 0 })),
      qs: pickQuestions(opt.n, opt.cat), i: 0, endsAt: 0, startsAt: 0, nextAt: 0, answers: {}, verdict: {}
    };
    let room = null, ui = null;
    busy(true);
    main().innerHTML = `<div class="zk-wait"><span class="g-spinner"></span><p>Xona ochilmoqda…</p></div>`;
    try {
      room = await SofiNet.join("zk-" + code, {
        meta: { cid: me.cid, name: me.name, role: "host" },
        onMsg: (m) => { onMsg(m); ui && ui.onMsg(m); },
        onPresence: (l) => { onPresence(l); ui && ui.onPresence(l); }
      });
    } catch (e) {
      api.toast("Xona ochib bo‘lmadi. Internetni tekshiring.", "bad");
      openMenu();
      return;
    }

    const teamOf = (cid) => S.teams.find((t) => t.members.some((m) => m.cid === cid));
    const players = () => S.teams.reduce((n, t) => n + t.members.length, 0);
    const allFull = () => S.teams.every((t) => t.members.length >= S.size);
    const snap = () => {
      const q = S.phase === "lobby" ? null : qById(S.qs[S.i]);
      const reveal = S.phase === "reveal" || S.phase === "final";
      const now = Date.now();
      return {
        t: "state", code, phase: S.phase, host: S.host, size: S.size, i: S.i, total: S.qs.length,
        teams: S.teams.map((t) => ({ id: t.id, name: t.name, emb: t.emb, color: t.color, captain: t.captain, members: t.members, score: t.score })),
        q: q ? (reveal ? { q: q.q, cat: q.cat, a: q.a, note: q.note } : { q: q.q, cat: q.cat }) : null,
        left: S.phase === "question" ? Math.max(0, S.endsAt - now) : 0,
        startLeft: S.phase === "lobby" && S.startsAt ? Math.max(0, S.startsAt - now) : 0,
        nextLeft: S.phase === "reveal" ? Math.max(0, S.nextAt - now) : 0,
        answered: Object.fromEntries(S.teams.map((t) => [t.id, !!S.answers[t.id]])),
        answers: reveal ? S.answers : null,
        verdict: reveal ? S.verdict : null
      };
    };
    const deliver = (m) => { room && room.send(m); ui && ui.onMsg(m); };
    const push = () => deliver(snap());
    const announce = () => api.send({ t: "zk-room", code, host: me.name, hostCid: me.cid, teams: S.teams.length, size: S.size, players: players(), cap: S.teams.length * S.size, phase: S.phase });

    function onMsg(m) {
      if (!m || m.code !== code) return;
      if (m.t === "hello") { room && room.send(snap()); return; }
      if (m.t === "join") {
        const team = S.teams.find((t) => t.id === m.team);
        if (!team || S.phase !== "lobby") { push(); return; }
        const cur = teamOf(m.cid);
        if (cur === team) { push(); return; }
        if (team.members.length >= S.size) { deliver({ t: "full", code, to: m.cid }); return; }
        if (cur) { cur.members = cur.members.filter((x) => x.cid !== m.cid); if (cur.captain === m.cid) cur.captain = cur.members[0] ? cur.members[0].cid : null; }
        team.members.push({ cid: m.cid, name: m.name, at: Date.now() });
        if (!team.captain) team.captain = m.cid;
        push(); announce();
      } else if (m.t === "leave") {
        const cur = teamOf(m.cid);
        if (cur && S.phase === "lobby") {
          cur.members = cur.members.filter((x) => x.cid !== m.cid);
          if (cur.captain === m.cid) cur.captain = cur.members[0] ? cur.members[0].cid : null;
          push(); announce();
        }
      } else if (m.t === "answer" && S.phase === "question") {
        const team = S.teams.find((t) => t.id === m.team);
        if (!team || team.captain !== m.cid) return;
        S.answers[team.id] = String(m.text || "").slice(0, 80);
        // Hamma guruh javob bersa — 3 soniyadan keyin natija
        if (S.teams.every((t) => S.answers[t.id] || !t.members.some((x) => !x.off))) S.endsAt = Math.min(S.endsAt, Date.now() + 3000);
        push();
      }
    }
    let present = new Set();
    function onPresence(list) { present = new Set(list.map((p) => p && p.cid)); prune(); }
    function prune() {
      const now = Date.now();
      let changed = false;
      S.teams.forEach((t) => {
        t.members.forEach((m) => {
          const off = m.cid !== me.cid && !present.has(m.cid) && now - (m.at || 0) > 6000;
          if (!!m.off !== off) { m.off = off; changed = true; }
        });
        if (S.phase === "lobby") {
          const before = t.members.length;
          t.members = t.members.filter((m) => !m.off);
          if (before !== t.members.length) changed = true;
        }
        const cap = t.members.find((m) => m.cid === t.captain);
        if (!cap || cap.off) {
          const next = t.members.find((m) => !m.off);
          const id = next ? next.cid : (cap ? cap.cid : null);
          if (id !== t.captain) { t.captain = id; changed = true; }
        }
      });
      if (changed) { push(); if (S.phase === "lobby") announce(); }
    }

    const startGame = () => {
      S.teams = S.teams.filter((t) => t.members.length);
      S.startsAt = 0;
      api.send({ t: "zk-room-close", code });
      startQuestion();
    };
    const startQuestion = () => {
      S.phase = "question"; S.answers = {}; S.verdict = {};
      S.endsAt = Date.now() + QTIME * 1000;
      push();
    };
    const toReveal = () => {
      S.phase = "reveal";
      const q = qById(S.qs[S.i]);
      S.teams.forEach((t) => { S.verdict[t.id] = check(q, S.answers[t.id]); });
      S.teams.forEach((t) => { if (S.verdict[t.id]) t.score++; });
      S.nextAt = Date.now() + REVEAL_MS;
      push();
    };
    const next = () => {
      S.i++;
      if (S.i >= S.qs.length) { S.phase = "final"; push(); busy(false); }
      else startQuestion();
    };
    const tick = () => {
      const now = Date.now();
      if (S.phase === "lobby") {
        if (allFull() && !S.startsAt) { S.startsAt = now + START_DELAY; push(); }
        else if (!allFull() && S.startsAt) { S.startsAt = 0; push(); }
        else if (S.startsAt && now >= S.startsAt) startGame();
      } else if (S.phase === "question" && now >= S.endsAt) toReveal();
      else if (S.phase === "reveal" && now >= S.nextAt) next();
    };
    const iv = setInterval(() => { prune(); push(); if (S.phase === "lobby") announce(); }, 2000);
    const clockIv = setInterval(tick, 250);
    onClose(() => {
      clearInterval(iv); clearInterval(clockIv);
      api.send({ t: "zk-room-close", code });
      if (room) { room.send({ t: "closed", code }); room.leave(); }
      room = null;
    });

    // Boshlovchi uchun boshqaruv
    const control = {
      canStart: () => S.phase === "lobby" && S.teams.filter((t) => t.members.length).length >= 2,
      start() { if (control.canStart()) startGame(); },
      endTime() { if (S.phase === "question") { S.endsAt = Date.now(); tick(); } },
      skip() { if (S.phase === "reveal") next(); },
      toggle(id) {
        if (S.phase !== "reveal") return;
        S.verdict[id] = !S.verdict[id];
        const t = S.teams.find((x) => x.id === id);
        if (t) t.score += S.verdict[id] ? 1 : -1;
        push();
      }
    };
    ui = joinRoom(code, { room, engine: onMsg, control });
    push(); announce();
  }

  function lobbyTeams(S, myCid) {
    return `<div class="zk-lteams">${S.teams.map((t) => {
      const mine = t.members.some((m) => m.cid === myCid);
      const full = t.members.length >= S.size;
      return `<div class="zk-lteam ${mine ? "mine" : ""} ${full ? "full" : ""}" style="--c:${t.color}">
        <div class="hd"><span class="em">${t.emb}</span><b>${esc(t.name)}</b><small>${t.members.length}/${S.size}</small></div>
        <ul>${Array.from({ length: S.size }, (_, k) => {
          const m = t.members[k];
          if (!m) return `<li class="empty">bo‘sh joy</li>`;
          const cap = t.captain === m.cid;
          return `<li class="${cap ? "cap" : ""}">${cap ? "👑 " : ""}${esc(m.name)}${m.cid === myCid ? " (siz)" : ""}${m.off ? " 📴" : ""}</li>`;
        }).join("")}</ul>
        ${mine ? `<span class="zk-in">✓ Siz shu guruhdasiz</span>` : `<button class="zk-btn" type="button" data-join="${t.id}" ${full ? "disabled" : ""}>${full ? "To‘lgan" : "Qo‘shilish"}</button>`}
      </div>`;
    }).join("")}</div>`;
  }

  /** Stol atrofidagi o'rindiqlar: muhokama shu yerda ko'rinadi. */
  function tableHTML(t, size, myCid) {
    const seats = Array.from({ length: Math.max(size, t.members.length) }, (_, k) => t.members[k] || null);
    return `
      <div class="zk-table n${seats.length}" style="--c:${t.color}">
        <div class="zk-desk"><span>${t.emb}</span><small>${esc(t.name)}</small></div>
        ${seats.map((m, k) => m ? `
          <div class="zk-seat s${k} ${t.captain === m.cid ? "cap" : ""} ${m.cid === myCid ? "me" : ""} ${m.off ? "off" : ""}" data-seat="${esc(m.cid)}">
            <div class="bub"></div>
            <div class="av">${t.captain === m.cid ? "<i>👑</i>" : ""}${esc((m.name.split(" ")[1] || m.name)[0])}</div>
            <small>${esc(m.name.split(" ")[1] || m.name)}${m.cid === myCid ? " (siz)" : ""}</small>
          </div>` : `<div class="zk-seat s${k} empty"><div class="av">·</div></div>`).join("")}
      </div>`;
  }

  /** Natijani ovoz bilan aytish (qurilmada o'zbekcha ovoz bo'lsa). */
  function speak(text) {
    try {
      const v = speechSynthesis.getVoices().find((x) => /^uz/i.test(x.lang));
      if (!v) return;
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v; u.lang = v.lang;
      speechSynthesis.speak(u);
    } catch (e) { /* bo'sh */ }
  }
  function verdictBanner(ok, sub) {
    if (!root) return;
    const el = document.createElement("div");
    el.className = "zk-verdict " + (ok ? "ok" : "no");
    el.innerHTML = `<b>${ok ? "✅ TO‘G‘RI!" : "❌ NOTO‘G‘RI"}</b>${sub ? `<small>${esc(sub)}</small>` : ""}`;
    root.appendChild(el);
    setTimeout(() => el.classList.add("out"), 2600);
    setTimeout(() => el.remove(), 3200);
    if (ok) { sfx.good(); confetti(60); } else sfx.bad();
    speak(ok ? "To‘g‘ri javob!" : "Noto‘g‘ri javob");
  }

  // ---------- O'yinchi ekrani (xona ochgan qurilmada ham shu ishlaydi) ----------
  function joinRoom(code, hostCtx = null) {
    const me = G.session;
    const isHost = !!hostCtx;
    let room = hostCtx ? hostCtx.room : null;
    let S = null, endsAt = 0, startAt = 0, nextAt = 0, lastKey = "", stopClock = null, hostSeen = Date.now(), ended = false;
    const chat = [];
    const bubbleTimers = {};
    let myAnswer = "";
    busy(true);

    const send = (d) => {
      const msg = { ...d, code, cid: me.cid, name: me.name };
      if (room) room.send(msg);
      if (isHost) hostCtx.engine(msg);
    };

    if (!isHost) {
      main().innerHTML = `<div class="zk-wait"><span class="g-spinner"></span><p>#${esc(code)} xonasiga ulanmoqda…</p></div>`;
      SofiNet.join("zk-" + code, { meta: { cid: me.cid, name: me.name, role: "player" }, onMsg, onPresence }).then((r) => {
        if (!root) { r.leave(); return; }
        room = r;
        send({ t: "hello" });
      }).catch(() => { api.toast("Xonaga ulanib bo‘lmadi.", "bad"); openMenu(); });
      const hello = setInterval(() => { if (!S && room) send({ t: "hello" }); }, 900);
      const notFound = setTimeout(() => { if (!S && root) { api.toast("Bunday xona topilmadi.", "bad"); openMenu(); } }, 9000);
      const watch = setInterval(() => {
        if (S && !ended && S.phase !== "final" && Date.now() - hostSeen > 12000) gone("Xona egasi chiqib ketdi. O‘yin to‘xtadi.");
      }, 2000);
      onClose(() => {
        clearInterval(hello); clearInterval(watch); clearTimeout(notFound);
        if (room) { send({ t: "leave" }); room.leave(); }
        room = null;
      });
    }
    const gone = (text) => {
      ended = true; busy(false);
      if (stopClock) stopClock();
      main().innerHTML = `<div class="zk-wait"><span class="g-big">📴</span><p>${esc(text)}</p><button class="zk-btn" id="zkMenu" type="button">Menyu</button></div>`;
      $("#zkMenu", root).onclick = openMenu;
    };

    const myTeam = () => S && S.teams.find((t) => t.members.some((m) => m.cid === me.cid));
    const amCaptain = () => { const t = myTeam(); return !!t && t.captain === me.cid; };
    const syncClock = (target, left, force) => { const e = Date.now() + left; return force || !target || Math.abs(e - target) > 1500 ? e : target; };

    function onMsg(m) {
      if (!m || m.code !== code || ended) return;
      if (m.t === "state") {
        hostSeen = Date.now();
        const prev = S;
        S = m;
        const changed = !prev || prev.i !== S.i || prev.phase !== S.phase;
        if (S.phase === "question") endsAt = syncClock(endsAt, S.left, changed);
        if (S.phase === "reveal") nextAt = syncClock(nextAt, S.nextLeft, changed);
        startAt = S.startLeft ? syncClock(startAt, S.startLeft, !prev || !prev.startLeft) : 0;
        if (changed && S.phase === "question") myAnswer = "";
        render(prev);
      } else if (m.t === "full" && m.to === me.cid) {
        api.toast("Bu guruhda joy qolmadi. Boshqasini tanlang.", "bad");
      } else if (m.t === "tchat") {
        const t = myTeam();
        if (t && m.team === t.id) {
          chat.push(m);
          drawChat();
          bubble(m);
          if (m.cid !== me.cid) beep(880, 0.06, "sine", 0.03);
        }
      } else if (m.t === "closed" && !isHost) {
        if (S && S.phase !== "final") gone("Xona yopildi.");
      }
    }
    function onPresence(list) {
      if (S && list.some((p) => p && p.cid === S.host.cid)) hostSeen = Date.now();
    }

    function bubble(c) {
      if (!root || !S || c.qi !== S.i) return;
      const seat = root.querySelector(`[data-seat="${CSS.escape(c.cid)}"]`);
      if (!seat) return;
      const b = seat.querySelector(".bub");
      b.textContent = (c.kind === "final" ? "👑 Javob: " : "") + c.text;
      b.className = "bub show" + (c.kind === "final" ? " final" : "");
      seat.classList.add("talk");
      clearTimeout(bubbleTimers[c.cid]);
      bubbleTimers[c.cid] = setTimeout(() => { b.classList.remove("show"); seat.classList.remove("talk"); }, c.kind === "final" ? 15000 : 7000);
    }

    function drawChat() {
      const box = root && $("#zkChat", root);
      if (!box) return;
      const t = myTeam();
      const msgs = chat.filter((c) => t && c.team === t.id && c.qi === S.i);
      const cap = amCaptain();
      box.innerHTML = msgs.length ? msgs.map((c) => `
        <div class="zk-msg ${c.cid === me.cid ? "me" : ""} ${c.kind === "final" ? "final" : ""}">
          <small>${c.cid === (t && t.captain) ? "👑 " : ""}${esc(c.name.split(" ")[1] || c.name)}</small>
          <span>${c.kind === "final" ? "Yakuniy javob: " : ""}${esc(c.text)}</span>
          ${cap && c.kind !== "final" && c.cid !== me.cid ? `<button type="button" data-use="${esc(c.text)}">↥ javob qilish</button>` : ""}
        </div>`).join("") : `<p class="zk-muted">Stol atrofida fikr bildiring — faqat o‘z guruhingiz ko‘radi.</p>`;
      box.scrollTop = box.scrollHeight;
      box.querySelectorAll("[data-use]").forEach((b) => (b.onclick = () => {
        const inp = $("#zkFinal", root);
        if (inp) { inp.value = b.dataset.use; inp.focus(); }
      }));
    }

    const hostBar = (html) => isHost ? `<div class="zk-hostbar"><span>🎙️ Siz xona egasisiz</span>${html}</div>` : "";

    function render(prev) {
      if (!root || ended) return;
      const m = main();
      $("#zkBarR", root).innerHTML = `<span class="zk-codebadge">Xona <b>#${esc(code)}</b></span>`;
      const t = myTeam();
      const key = S.phase + ":" + S.i + ":" + (t ? t.id : "-") + ":" + (amCaptain() ? "c" : "p") + ":" + (t ? t.members.length : 0);

      if (S.phase === "lobby") {
        const filled = S.teams.reduce((n, x) => n + x.members.length, 0), cap = S.teams.length * S.size;
        const startIn = startAt ? Math.max(0, Math.ceil((startAt - Date.now()) / 1000)) : 0;
        m.innerHTML = `
          <section class="zk-lobby">
            <div class="zk-lobby-head">
              <span class="zk-bigcode">#${esc(code)}</span>
              <p>Xona egasi: <b>${esc(S.host.name)}</b>. Xona hammaga ochiq — guruhni tanlang. Birinchi qo‘shilgan a’zo 👑 sardor bo‘ladi.</p>
              <div class="zk-cap-bar"><i style="width:${Math.round((filled / cap) * 100)}%"></i><span>${filled} / ${cap} joy band</span></div>
              ${startIn ? `<div class="zk-startin">🚀 Hamma joy to‘ldi! O‘yin <b id="zkStartN">${startIn}</b> soniyada boshlanadi…</div>` : `<p class="zk-muted">Barcha joylar to‘lishi bilan o‘yin avtomatik boshlanadi.</p>`}
            </div>
            ${lobbyTeams(S, me.cid)}
            ${hostBar(`<button class="zk-btn" id="zkStartNow" type="button" ${hostCtx && hostCtx.control.canStart() ? "" : "disabled"}>▶ Kutmasdan boshlash</button>`)}
          </section>`;
        m.querySelectorAll("[data-join]").forEach((b) => (b.onclick = () => send({ t: "join", team: b.dataset.join })));
        const sn = $("#zkStartNow", root);
        if (sn) sn.onclick = () => hostCtx.control.start();
        if (startIn && (!prev || !prev.startLeft)) { sfx.open(); }
        lastKey = key;
        return;
      }

      if (S.phase === "final") {
        if (lastKey !== key) {
          busy(false); ended = !isHost;
          if (stopClock) stopClock();
          const top = Math.max(...S.teams.map((x) => x.score));
          m.innerHTML = podium(S.teams, t ? (t.score === top ? "🎉 Tabriklaymiz, guruhingiz g‘olib!" : "Yaxshi o‘yin! Keyingi safar albatta yutasiz 💪") : "") +
            `<div class="zk-ctrl center"><button class="zk-btn" id="zkMenu" type="button">Menyu</button></div>`;
          $("#zkMenu", root).onclick = openMenu;
        }
        lastKey = key;
        return;
      }

      if (lastKey !== key) {
        if (stopClock) stopClock();
        const cap = amCaptain();
        m.innerHTML = `
          <div id="zkSB"></div>
          <section class="zk-stage ${t ? "with-team" : ""}">
            <div class="zk-left">
              ${questionCard(S.q, S.i, S.total)}
              ${S.phase === "question" ? `<div class="zk-mid">${timerHTML()}<div class="zk-phase" id="zkPhase"></div></div>` : `<div id="zkReveal"></div>`}
              ${S.phase === "question" ? hostBar(`<button class="zk-btn ghost" id="zkEnd" type="button">⏹ Vaqtni tugatish</button>`) : ""}
            </div>
            ${t ? `<aside class="zk-teambox" style="--c:${t.color}">
              <div class="zk-tb-head">${t.emb} <b>${esc(t.name)}</b> <small>${cap ? "👑 Siz sardorsiz" : `Sardor: ${esc((t.members.find((x) => x.cid === t.captain) || {}).name || "—")}`}</small></div>
              ${tableHTML(t, S.size, me.cid)}
              ${S.phase === "question" ? `
                <form class="zk-say" id="zkSay"><input id="zkSayIn" maxlength="80" placeholder="Stolga fikr ayting…" autocomplete="off"><button type="submit" aria-label="Yuborish">➤</button></form>
                ${cap ? `<form class="zk-cap" id="zkCap"><label>👑 Guruh javobini siz aytasiz</label><div><input id="zkFinal" maxlength="80" placeholder="Yakuniy javob" autocomplete="off" value="${esc(myAnswer)}"><button type="submit" class="zk-btn">✅ Aytish</button></div><small id="zkCapSt">${myAnswer ? "Javob aytildi — vaqt tugaguncha o‘zgartirish mumkin" : "Sheriklaringizni tinglang va javobni ayting"}</small></form>` :
                  `<div class="zk-capwait" id="zkCapSt"></div>`}` : ""}
              <details class="zk-log"><summary>💬 Muhokama tarixi</summary><div class="zk-chat" id="zkChat"></div></details>
            </aside>` : ""}
          </section>`;
        if (S.phase === "question") {
          typeIn(m.querySelector(".zk-q"));
          stopClock = runClock(() => endsAt, null);
          const end = $("#zkEnd", root);
          if (end) end.onclick = () => hostCtx.control.endTime();
          const say = $("#zkSay", root);
          if (say) say.onsubmit = (e) => {
            e.preventDefault();
            const inp = $("#zkSayIn", root), text = inp.value.trim();
            if (!text) return;
            const msg = { t: "tchat", code, team: t.id, cid: me.cid, name: me.name, text, qi: S.i, id: Math.random().toString(36).slice(2) };
            room && room.send(msg); onMsg(msg);
            inp.value = "";
          };
          const capF = $("#zkCap", root);
          if (capF) capF.onsubmit = (e) => {
            e.preventDefault();
            const text = $("#zkFinal", root).value.trim();
            if (!text) return;
            myAnswer = text;
            send({ t: "answer", team: t.id, text });
            const msg = { t: "tchat", code, team: t.id, cid: me.cid, name: me.name, text, qi: S.i, kind: "final", id: Math.random().toString(36).slice(2) };
            room && room.send(msg); onMsg(msg);
            $("#zkCapSt", root).textContent = "✅ Javob aytildi — vaqt tugaguncha o‘zgartirish mumkin";
          };
        }
        lastKey = key;
        drawChat();
        chat.filter((c) => t && c.team === t.id && c.qi === S.i).slice(-4).forEach(bubble);
      }

      $("#zkSB", root).innerHTML = scoreboard(S.teams, S.phase === "question" ? { answered: S.answered, mine: t && t.id } : { plus: S.verdict, mine: t && t.id });
      if (S.phase === "question" && t && !amCaptain()) {
        const st = $("#zkCapSt", root);
        if (st) st.innerHTML = S.answered[t.id] ? "👑 Sardor javobni aytdi ✅" : "👑 Sardor sizni tinglamoqda — fikringizni ayting!";
      }
      if (S.phase === "reveal") {
        const box = $("#zkReveal", root);
        const html = `
          <div class="zk-judge">
            <div class="zk-judge-rows">${S.teams.map((x) => `
              <div class="zk-jrow ${S.verdict[x.id] ? "is-ok" : "is-no"} ${t && t.id === x.id ? "mine" : ""}" style="--c:${x.color}">
                <span class="em">${x.emb}</span><b>${esc(x.name)}</b>
                <span class="ans">${S.answers[x.id] ? `“${esc(S.answers[x.id])}”` : "<i>javob yo‘q</i>"}</span>
                <span class="vd">${S.verdict[x.id] ? "✓ To‘g‘ri" : "✗ Noto‘g‘ri"}</span>
                ${isHost ? `<button type="button" class="tog" data-tog="${x.id}" title="Bahoni o‘zgartirish">↺</button>` : ""}
              </div>`).join("")}</div>
            ${answerFlip(S.q, true)}
            <div class="zk-nextin"><i id="zkNextBar"></i><span>${S.i + 1 < S.total ? "Keyingi savol" : "Natijalar"} <b id="zkNextN"></b> soniyada…</span></div>
            ${hostBar(`<button class="zk-btn" id="zkSkip" type="button">⏭ Hoziroq o‘tish</button>`)}
          </div>`;
        if (box && box.dataset.h !== html) {
          const first = !box.dataset.h;
          box.innerHTML = html; box.dataset.h = html;
          root.querySelectorAll("[data-tog]").forEach((b) => (b.onclick = () => hostCtx.control.toggle(b.dataset.tog)));
          const sk = $("#zkSkip", root);
          if (sk) sk.onclick = () => hostCtx.control.skip();
          if (first) {
            if (t) verdictBanner(!!S.verdict[t.id], S.verdict[t.id] ? `${t.name} +1 ball` : `To‘g‘ri javob: ${S.q.a}`);
            else sfx.open();
          }
        }
      }
    }

    // Sanoqlar (boshlanish va keyingi savol)
    const cd = setInterval(() => {
      if (!root || !S) return;
      const sn = $("#zkStartN", root);
      if (sn && startAt) { const v = Math.max(0, Math.ceil((startAt - Date.now()) / 1000)); if (sn.textContent !== String(v)) { sn.textContent = v; sfx.tick(); } }
      const nn = $("#zkNextN", root), nb = $("#zkNextBar", root);
      if (nn && nextAt) {
        const left = Math.max(0, nextAt - Date.now());
        nn.textContent = Math.ceil(left / 1000);
        if (nb) nb.style.width = (100 * (1 - left / REVEAL_MS)) + "%";
      }
    }, 200);
    onClose(() => clearInterval(cd));

    return { onMsg, onPresence };
  }

  // ---------- Kirish nuqtasi ----------
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-zakovat]")) { e.preventDefault(); openMenu(); }
  });
  window.SofiZakovat = { open: openMenu, check };
})();
