/* MATEMATIKA MASTER — marafon o'yini.
   Ustoz bitta mavzuni ochadi, qolganlari yopiq. Har bir o'quvchi ochiq mavzuda 2 marta urinadi.
   10 ta savol, har biriga 1 daqiqa. Natija avtomatik saqlanadi va marafon jadvalida chiqadi.
   Ustoz yangi mavzuni ochganda oldingi mavzu g'olibiga 1 ⭐ beriladi. */
(() => {
  "use strict";
  const G = window.SofiGames, api = G.api, MG = window.MASTER_GAME, D = window.CENTER_DATA || {};
  const QTIME = 60, ATTEMPTS = 2, NQ = 10;
  const $ = (s, p = document) => p.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const topicById = (id) => MG.TOPICS.find((t) => t.id === id);
  const short = (n) => { const p = String(n).split(" "); return p[1] ? `${p[1]} ${p[0][0]}.` : n; };
  const beep = (...a) => api.beep(...a);

  // =========================== Saqlash (Supabase yoki shu qurilma) ===========================
  const LKEY = "mm_local_v1";
  const lget = () => { try { return JSON.parse(localStorage.getItem(LKEY)) || { topic: null, results: [], winners: [] }; } catch (e) { return { topic: null, results: [], winners: [] }; } };
  const lset = (v) => { try { localStorage.setItem(LKEY, JSON.stringify(v)); } catch (e) { /* bo'sh */ } };

  const Back = {
    mode: null, reason: "",
    db() { return window.SofiNet && SofiNet.db; },
    async detect() {
      if (this.mode) return this.mode;
      const db = this.db();
      if (!db) { this.mode = "local"; this.reason = "Internet bazasi ulanmagan"; return this.mode; }
      try {
        const { error } = await db.from("master_state").select("topic").eq("id", 1).maybeSingle();
        if (error) throw error;
        this.mode = "server";
      } catch (e) {
        this.mode = "local";
        this.reason = /relation|does not exist|schema cache|PGRST/i.test(String(e.message || e.code)) ? "Supabase’da marafon jadvallari hali yaratilmagan (games-master.sql)" : "Internet bazasiga ulanib bo‘lmadi";
      }
      return this.mode;
    },
    async state() {
      if ((await this.detect()) === "server") {
        const { data } = await this.db().from("master_state").select("topic, opened_at").eq("id", 1).maybeSingle();
        return { topic: data ? data.topic : null };
      }
      return { topic: lget().topic };
    },
    async results(topic) {
      if ((await this.detect()) === "server") {
        const { data } = await this.db().from("master_results").select("student_name, cls, topic, attempt, correct, points, seconds, created_at").eq("topic", topic);
        return data || [];
      }
      return lget().results.filter((r) => r.topic === topic);
    },
    async winners() {
      if ((await this.detect()) === "server") {
        const { data } = await this.db().from("master_winners").select("topic, student_name, points, awarded_at").order("awarded_at", { ascending: false });
        return data || [];
      }
      return lget().winners;
    },
    async submit(r) {
      if ((await this.detect()) === "server") {
        const { data, error } = await this.db().rpc("master_submit", { p_student: r.student_name, p_cls: r.cls, p_topic: r.topic, p_correct: r.correct, p_points: r.points, p_seconds: r.seconds });
        if (error) throw error;
        return Number(data) || 0;
      }
      const L = lget();
      if (L.topic !== r.topic) return 0;
      const n = L.results.filter((x) => x.topic === r.topic && x.student_name === r.student_name).length;
      if (n >= ATTEMPTS) return 0;
      L.results.push({ ...r, attempt: n + 1, created_at: new Date().toISOString() });
      lset(L);
      return n + 1;
    },
    async open(pin, topic) {
      if ((await this.detect()) === "server") {
        const { data, error } = await this.db().rpc("master_open", { p_pin: pin, p_topic: topic });
        if (error) throw error;
        return data || {};
      }
      const L = lget();
      const prev = L.topic;
      let winner = null, points = null;
      if (prev && prev !== topic && !L.winners.some((w) => w.topic === prev)) {
        const best = L.results.filter((r) => r.topic === prev).sort((a, b) => b.points - a.points || a.seconds - b.seconds || String(a.created_at).localeCompare(String(b.created_at)))[0];
        if (best) { winner = best.student_name; points = best.points; L.winners.unshift({ topic: prev, student_name: winner, points, awarded_at: new Date().toISOString() }); }
      }
      L.topic = topic;
      lset(L);
      return { prev, winner, points };
    }
  };

  /** Har bir o'quvchining eng yaxshi natijasi bo'yicha jadval */
  function board(rows) {
    const by = {};
    rows.forEach((r) => {
      const b = by[r.student_name] || (by[r.student_name] = { name: r.student_name, cls: r.cls, best: null, tries: 0 });
      b.tries++;
      if (!b.best || r.points > b.best.points || (r.points === b.best.points && r.seconds < b.best.seconds)) b.best = r;
    });
    const list = Object.values(by).sort((a, b) => b.best.points - a.best.points || a.best.seconds - b.best.seconds);
    list.forEach((x, i) => { x.rank = i && x.best.points === list[i - 1].best.points && x.best.seconds === list[i - 1].best.seconds ? list[i - 1].rank : i + 1; });
    return list;
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // =========================== O'yin sahifasidagi marafon kartasi ===========================
  let cache = { topic: null, rows: [], winners: [] };
  async function refresh() {
    try {
      const st = await Back.state();
      const [rows, winners] = await Promise.all([st.topic ? Back.results(st.topic) : [], Back.winners()]);
      cache = { topic: st.topic, rows, winners };
    } catch (e) { console.warn("Marafon yuklanmadi:", e); }
    drawCard();
    if (root && root.dataset.view === "board") showBoard();
  }

  function leaderboardHTML(list, me, limit = 10) {
    if (!list.length) return `<p class="mm-empty">Hali hech kim yechmadi — birinchi bo‘ling! 🚀</p>`;
    return `<ol class="mm-lb">${list.slice(0, limit).map((x) => `
      <li class="${x.rank <= 3 ? "top t" + x.rank : ""} ${x.name === me ? "me" : ""}">
        <span class="rk">${x.rank === 1 ? "🥇" : x.rank === 2 ? "🥈" : x.rank === 3 ? "🥉" : x.rank}</span>
        <span class="nm"><b>${esc(short(x.name))}</b><small>${esc(x.cls || "")} · ${x.tries}/${ATTEMPTS} urinish</small></span>
        <span class="sc"><b>${x.best.points}</b><small>${x.best.correct}/10 · ${x.best.seconds} s</small></span>
      </li>`).join("")}</ol>`;
  }

  function drawCard() {
    const box = document.getElementById("mmBoard");
    if (!box) return;
    const me = G.session.name;
    const t = cache.topic && topicById(cache.topic);
    const list = board(cache.rows);
    const mine = cache.rows.filter((r) => r.student_name === me).length;
    const winBy = Object.fromEntries(cache.winners.map((w) => [w.topic, w]));
    box.innerHTML = `
      ${Back.mode === "local" ? `<p class="mm-warn">⚠️ ${esc(Back.reason)} — natijalar hozircha faqat shu qurilmada saqlanadi.</p>` : ""}
      <div class="mm-now ${t ? "on" : ""}">
        ${t ? `<span class="mm-live">● JONLI MARAFON</span><b>${t.icon} ${esc(t.title)}</b>
          <small>${me && G.session.role === "guest" ? "👤 Mehmonlar sinov rejimida o‘ynaydi" : me && G.session.role !== "teacher" ? `Sizda ${Math.max(0, ATTEMPTS - mine)} ta urinish qoldi` : `Har bir o‘quvchiga ${ATTEMPTS} ta urinish · 10 savol · har biriga 1 daqiqa`}</small>`
          : `<b>🔒 Ustoz hali mavzu ochmagan</b><small>Ustoz mavzuni ochishi bilan marafon boshlanadi.</small>`}
      </div>
      ${t ? leaderboardHTML(list, me) : ""}
      <div class="mm-chips">${MG.TOPICS.map((x) => {
        const w = winBy[x.id], open = x.id === cache.topic;
        return `<span class="mm-chip ${open ? "open" : w ? "done" : "lock"}" title="${esc(x.title)}">${open ? "🟢" : w ? "🏆" : "🔒"} ${esc(x.title)}${w ? `<i>${esc(short(w.student_name))}</i>` : ""}</span>`;
      }).join("")}</div>`;
  }

  // =========================== Sahna ===========================
  let root = null, timers = [];
  const clearT = () => { timers.forEach((t) => clearInterval(t)); timers = []; };
  function openRoot(view) {
    closeRoot();
    root = document.createElement("div");
    root.className = "mm";
    root.dataset.view = view;
    root.innerHTML = `
      <div class="mm-bg" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="mm-bar"><button class="mm-exit" type="button">← Chiqish</button><div class="mm-brand">🏅 <b>MATEMATIKA MASTER</b></div><div class="mm-bar-r"></div></header>
      <main class="mm-main"></main>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "zk-open");
    requestAnimationFrame(() => root.classList.add("show"));
    root.querySelector(".mm-exit").onclick = () => {
      if (root.dataset.busy === "1" && !confirm("O‘yindan chiqsangiz, bu urinish natijasi saqlanmaydi. Chiqasizmi?")) return;
      closeRoot();
    };
    return $(".mm-main", root);
  }
  function closeRoot() { clearT(); if (root) root.remove(); root = null; document.body.classList.remove("g-playing", "zk-open"); }

  // =========================== Kirish ===========================
  async function start() {
    if (!G.session.name && !(await api.askName())) return;
    await refresh();
    if (G.session.role === "teacher") return teacherPanel();
    const t = cache.topic && topicById(cache.topic);
    if (!t) { api.toast("Ustoz hali mavzu ochmagan. Ochilishi bilan o‘ynay olasiz! 🔒"); return; }
    // Mehmonlar marafonda qatnashmaydi — sinov rejimida o'ynaydi (natija saqlanmaydi)
    if (G.session.role === "guest") { api.toast("👤 Mehmon rejimi: o‘ynashingiz mumkin, lekin natija marafon jadvaliga yozilmaydi.", "good"); intro(t, 1, true); return; }
    const used = cache.rows.filter((r) => r.student_name === G.session.name).length;
    if (used >= ATTEMPTS) { showBoard(`Siz bu mavzuda ${ATTEMPTS} ta urinishni ishlatib bo‘ldingiz. Natijangiz jadvalda!`); return; }
    intro(t, used + 1);
  }

  function intro(t, attempt, practice = false) {
    const m = openRoot("intro");
    m.innerHTML = `
      <section class="mm-intro">
        <div class="mm-medal">🏅</div>
        <span class="mm-kicker">${practice ? "SINOV REJIMI (saqlanmaydi)" : `MARAFON · ${attempt}-urinish (${ATTEMPTS} tadan)`}</span>
        <h1>${t.icon} ${esc(t.title)}</h1>
        <div class="mm-rules">
          <div><b>10</b><small>savol</small></div>
          <div><b>60 s</b><small>har biriga</small></div>
          <div><b>50 + soniya</b><small>to‘g‘ri javob balli</small></div>
          <div><b>${ATTEMPTS}</b><small>urinish</small></div>
        </div>
        <p>Tezroq to‘g‘ri javob bersangiz — ko‘proq ball! Javob tugmasini bosgach o‘zgartirib bo‘lmaydi. Hamma savolga javob berganingizda natija <b>avtomatik saqlanadi</b>.</p>
        <button class="mm-btn big" type="button" id="mmGo">▶ Boshlash</button>
      </section>`;
    $("#mmGo", root).onclick = () => quiz(t, attempt, practice);
  }

  // =========================== Viktorina ===========================
  function quiz(t, attempt, practice) {
    const qs = MG.build(t.id, NQ);
    let i = 0, points = 0, correct = 0, seconds = 0;
    root.dataset.busy = practice ? "" : "1";
    root.dataset.view = "quiz";
    const m = $(".mm-main", root);
    const next = () => {
      clearT();
      if (i >= qs.length) return finish();
      const q = qs[i];
      let left = QTIME, locked = false;
      const t0 = Date.now();
      m.innerHTML = `
        <div class="mm-top">
          <span class="mm-qn">Savol <b>${i + 1}</b>/${NQ}</span>
          <div class="mm-dots">${qs.map((_, k) => `<i class="${k < i ? (qs[k].ok ? "ok" : "no") : k === i ? "cur" : ""}"></i>`).join("")}</div>
          <span class="mm-pts">⭐ <b>${points}</b></span>
        </div>
        <section class="mm-qcard">
          <div class="mm-timer" id="mmT" style="--p:1"><b id="mmS">${QTIME}</b></div>
          <p class="mm-q">${q.q}</p>
        </section>
        <div class="mm-opts">${q.options.map((o, k) => `<button type="button" data-k="${k}"><em class="mm-L">${"ABCD"[k]}</em>${o}</button>`).join("")}</div>`;
      const answer = (k) => {
        if (locked) return;
        locked = true;
        clearT();
        const used = Math.min(QTIME, Math.round((Date.now() - t0) / 1000));
        seconds += used;
        const ok = k === q.correct;
        q.ok = ok;
        if (ok) { correct++; const gain = 50 + Math.max(0, QTIME - used); points += gain; beep(880, 0.1); setTimeout(() => beep(1175, 0.12), 90); }
        else beep(200, 0.25, "sawtooth", 0.04);
        m.querySelectorAll(".mm-opts button").forEach((b, j) => { b.disabled = true; if (j === q.correct) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
        const fb = document.createElement("div");
        fb.className = "mm-fb " + (ok ? "ok" : "no");
        fb.innerHTML = ok ? `✅ To‘g‘ri! +${50 + Math.max(0, QTIME - used)}` : k < 0 ? "⏰ Vaqt tugadi" : "❌ Noto‘g‘ri";
        m.appendChild(fb);
        i++;
        setTimeout(next, ok ? 900 : 1500);
      };
      m.querySelectorAll(".mm-opts button").forEach((b) => (b.onclick = () => answer(+b.dataset.k)));
      timers.push(setInterval(() => {
        left = QTIME - (Date.now() - t0) / 1000;
        const el = $("#mmT", root);
        if (!el) return;
        el.style.setProperty("--p", Math.max(0, left / QTIME));
        el.classList.toggle("warn", left <= 15);
        const s = Math.max(0, Math.ceil(left));
        const sEl = $("#mmS", root);
        if (sEl.textContent !== String(s)) { sEl.textContent = s; if (s <= 5 && s > 0) beep(1250, 0.04, "square", 0.02); }
        if (left <= 0) answer(-1);
      }, 200));
    };
    const finish = async () => {
      clearT();
      root.dataset.busy = "";
      const r = { student_name: G.session.name, cls: G.session.cls, topic: t.id, correct, points, seconds };
      m.innerHTML = `<div class="mm-wait"><span class="g-spinner"></span><p>Natija saqlanmoqda…</p></div>`;
      let saved = 0, err = "";
      if (!practice) { try { saved = await Back.submit(r); } catch (e) { err = String(e.message || e); } }
      await refresh();
      const list = board(cache.rows);
      const mineRow = list.find((x) => x.name === G.session.name);
      const usedNow = cache.rows.filter((x) => x.student_name === G.session.name).length;
      const stars = correct >= 9 ? "🌟🌟🌟" : correct >= 7 ? "🌟🌟" : correct >= 5 ? "🌟" : "💪";
      if (correct >= 7 && window.confettiMM) window.confettiMM();
      m.innerHTML = `
        <section class="mm-result">
          <div class="mm-medal big">${stars}</div>
          <h2>${correct >= 9 ? "Ajoyib! Siz haqiqiy MASTERsiz!" : correct >= 7 ? "Zo‘r natija!" : correct >= 5 ? "Yaxshi!" : "Mashq qiling — keyingisi albatta yaxshiroq!"}</h2>
          <div class="mm-rules">
            <div><b>${correct}/10</b><small>to‘g‘ri</small></div>
            <div><b>${points}</b><small>ball</small></div>
            <div><b>${seconds} s</b><small>sarflangan vaqt</small></div>
            <div><b>${practice ? "—" : mineRow ? mineRow.rank + "-o‘rin" : "—"}</b><small>marafonda</small></div>
          </div>
          <p class="mm-saved">${practice ? "🧪 Sinov rejimi — natija saqlanmadi." : saved ? `✅ Natija saqlandi (${saved}-urinish). ${mineRow ? `Eng yaxshi natijangiz: <b>${mineRow.best.points}</b> ball.` : ""}` : `⚠️ Natija saqlanmadi${err ? ": " + esc(err) : " (urinishlar tugagan yoki mavzu yopilgan)"}.`}</p>
          <div class="mm-ctrl">
            ${!practice && usedNow < ATTEMPTS && cache.topic === t.id ? `<button class="mm-btn" type="button" id="mmAgain">↻ ${usedNow + 1}-urinish</button>` : ""}
            <button class="mm-btn ghost" type="button" id="mmBoardBtn">🏆 Marafon jadvali</button>
          </div>
        </section>`;
      const again = $("#mmAgain", root);
      if (again) again.onclick = () => intro(t, usedNow + 1);
      $("#mmBoardBtn", root).onclick = () => showBoard();
    };
    next();
  }

  // =========================== Marafon jadvali (to'liq) ===========================
  function showBoard(msg = "") {
    if (!root) openRoot("board");
    root.dataset.view = "board";
    const m = $(".mm-main", root);
    const t = cache.topic && topicById(cache.topic);
    const list = board(cache.rows);
    m.innerHTML = `
      <section class="mm-boardview">
        ${msg ? `<p class="mm-saved">${esc(msg)}</p>` : ""}
        <h2>${t ? `${t.icon} ${esc(t.title)}` : "🔒 Ochiq mavzu yo‘q"}</h2>
        ${t ? leaderboardHTML(list, G.session.name, 100) : ""}
        <h3>🏆 Oldingi mavzular g‘oliblari (+1 ⭐)</h3>
        ${cache.winners.length ? `<ul class="mm-win">${cache.winners.map((w) => `<li><span>${(topicById(w.topic) || {}).icon || "🏅"} ${esc((topicById(w.topic) || { title: w.topic }).title)}</span><b>${esc(w.student_name)}</b><small>${w.points} ball</small></li>`).join("")}</ul>` : `<p class="mm-empty">Hali g‘oliblar yo‘q.</p>`}
      </section>`;
  }

  // =========================== Ustoz paneli ===========================
  let teacherPin = null;
  async function askPin() {
    if (teacherPin) return teacherPin;
    const v = prompt("Mavzuni ochish uchun ustoz parolini kiriting:");
    if (!v) return null;
    const okPin = window.SofiAuth ? await window.SofiAuth.verify({ name: G.session.name, role: "teacher" }, v) : (await sha256(v.trim())) === D.teacherPinHash;
    if (!okPin) { api.toast("Parol noto‘g‘ri.", "bad"); return null; }
    teacherPin = v.trim();
    return teacherPin;
  }
  function teacherPanel() {
    const m = openRoot("teacher");
    const draw = () => {
      const winBy = Object.fromEntries(cache.winners.map((w) => [w.topic, w]));
      const list = board(cache.rows);
      const cur = cache.topic && topicById(cache.topic);
      m.innerHTML = `
        <section class="mm-teacher">
          <h2>👨‍🏫 Ustoz paneli</h2>
          <p class="mm-hint">Bir vaqtda faqat <b>bitta</b> mavzu ochiq bo‘ladi. Yangi mavzuni ochganingizda oldingi mavzuning 1-o‘rin egasiga avtomatik <b>1 ⭐</b> qo‘shiladi.</p>
          ${Back.mode === "local" ? `<p class="mm-warn">⚠️ ${esc(Back.reason)}. Hozir natijalar faqat shu qurilmada saqlanadi.</p>` : ""}
          ${cur ? `<div class="mm-now on"><span class="mm-live">● HOZIR OCHIQ</span><b>${cur.icon} ${esc(cur.title)}</b><small>${list.length} ta o‘quvchi qatnashdi${list[0] ? ` · yetakchi: ${esc(list[0].name)} (${list[0].best.points} ball)` : ""}</small></div>` : `<div class="mm-now"><b>Hozir hech qaysi mavzu ochiq emas</b></div>`}
          <div class="mm-tlist">${MG.TOPICS.map((t) => {
            const open = t.id === cache.topic, w = winBy[t.id];
            return `<div class="mm-trow ${open ? "open" : ""}">
              <span class="ic">${t.icon}</span>
              <span class="tt"><b>${esc(t.title)}</b><small>${esc(t.cls)}${w ? ` · 🏆 ${esc(w.student_name)} (${w.points})` : ""}</small></span>
              <button type="button" class="mm-mini ghost" data-try="${t.id}" title="Savollarni sinab ko‘rish">👀</button>
              ${open ? `<button type="button" class="mm-mini" data-close>Yopish</button>` : `<button type="button" class="mm-mini go" data-open="${t.id}">Ochish</button>`}
            </div>`;
          }).join("")}</div>
          ${cur ? `<h3>📋 Joriy marafon jadvali</h3>${leaderboardHTML(list, "", 100)}` : ""}
        </section>`;
      m.querySelectorAll("[data-try]").forEach((b) => (b.onclick = () => intro(topicById(b.dataset.try), 1, true)));
      const doOpen = async (id) => {
        const prevT = cache.topic && topicById(cache.topic);
        const lead = board(cache.rows)[0];
        const msg = id ? `“${topicById(id).title}” mavzusini ochasizmi?` : "Joriy mavzuni yopasizmi?";
        if (!confirm(msg + (prevT && lead ? `\n\n“${prevT.title}” g‘olibi ${lead.name} ga 1 ⭐ beriladi.` : ""))) return;
        const pin = await askPin();
        if (!pin) return;
        try {
          const res = await Back.open(pin, id);
          if (res && res.winner) api.toast(`🏆 ${res.winner} — “${(topicById(res.prev) || {}).title}” g‘olibi! +1 ⭐`, "good");
          else api.toast(id ? "Mavzu ochildi ✅" : "Mavzu yopildi", "good");
        } catch (e) {
          if (/parol/i.test(String(e.message))) teacherPin = null;
          api.toast("Xatolik: " + (e.message || e), "bad");
        }
        await refresh();
        draw();
      };
      m.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => doOpen(b.dataset.open)));
      const cl = m.querySelector("[data-close]");
      if (cl) cl.onclick = () => doOpen(null);
    };
    draw();
  }

  // Konfetti
  window.confettiMM = () => {
    const box = document.createElement("div");
    box.className = "g-confetti";
    const colors = ["#f5c84c", "#ef4444", "#22c55e", "#38bdf8", "#a78bfa"];
    for (let k = 0; k < 100; k++) { const p = document.createElement("i"); p.style.left = Math.random() * 100 + "%"; p.style.background = colors[k % 5]; p.style.animationDelay = Math.random() * 0.6 + "s"; p.style.animationDuration = 2 + Math.random() * 1.6 + "s"; box.appendChild(p); }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4500);
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-mm-start]")) { e.preventDefault(); start(); }
    if (e.target.closest("[data-mm-board]")) { e.preventDefault(); refresh().then(() => showBoard()); }
  });
  document.addEventListener("sofi:presence", () => drawCard());
  // Bazaga ulanish tayyor bo'lgach yuklash, keyin har 20 soniyada yangilash
  const boot = setInterval(() => { if (window.SofiNet && SofiNet.kind) { clearInterval(boot); refresh(); setInterval(refresh, 20000); } }, 400);
  window.SofiMaster = { refresh, Back };
})();
