/* SHAXMAT TURNIRI — umumiy API (Supabase) va Musobaqalar sahifasidagi bo'lim.
   Jadval/funksiyalar: turnir.sql. O'yinlar sahifasi: games/turnir-play.js */
(() => {
  "use strict";
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const D = () => window.CENTER_DATA || {};
  let client;
  const db = () => {
    if (client !== undefined) return client;
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    client = window.supabase && cfg.SUPABASE_URL ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } }) : null;
    return client;
  };
  const missing = (e) => e && /does not exist|schema cache|Could not find|relation/i.test(e.message || "");
  const err = (e) => new Error(missing(e) ? "Supabase’da turnir.sql hali ishga tushirilmagan." : (e && e.message) || "Xatolik");

  /** Raund nomi: oxirigacha nechta bosqich qolganiga qarab */
  function roundName(r, R) {
    if (r === 99) return "3-o‘rin uchun";
    const left = R - r;
    return left === 0 ? "Final" : left === 1 ? "Yarim final" : left === 2 ? "Chorak final" : `1/${2 ** left} final`;
  }
  const isTeacher = (name) => (D().teachers || []).some((t) => t.name === name);

  const API = {
    roundName, isTeacher,
    async load() {
      const c = db(); if (!c) throw new Error("Internet yoki Supabase ulanmagan");
      const { data: evs, error } = await c.from("tn_events").select("*").order("id", { ascending: false }).limit(1);
      if (error) throw err(error);
      const ev = evs && evs[0];
      if (!ev) return { ev: null, players: [], matches: [] };
      const [p, m] = await Promise.all([
        c.from("tn_players").select("name,cls,created_at").eq("event_id", ev.id).order("created_at"),
        c.from("tn_matches").select("*").eq("event_id", ev.id).order("round").order("slot"),
      ]);
      if (p.error) throw err(p.error); if (m.error) throw err(m.error);
      return { ev, players: p.data || [], matches: m.data || [] };
    },
    async rpc(fn, args) { const c = db(); if (!c) throw new Error("Internet yoki Supabase ulanmagan"); const { data, error } = await c.rpc(fn, args); if (error) throw err(error); return data; },
    register: (ev, name, cls) => API.rpc("tn_register", { p_event: ev, p_name: name, p_cls: cls }),
    unregister: (ev, name) => API.rpc("tn_unregister", { p_event: ev, p_name: name }),
    report: (ev, round, slot, winner, reporter, reason) => API.rpc("tn_report", { p_event: ev, p_round: round, p_slot: slot, p_winner: winner, p_reporter: reporter, p_reason: reason || "" }),
    /** Mening hozirgi o'yinim (hal bo'lmagan) */
    myMatch(st, name) { return st.matches.filter((m) => !m.winner && (m.p1 === name || m.p2 === name)).sort((a, b) => (a.round === 99 ? 98.5 : a.round) - (b.round === 99 ? 98.5 : b.round))[0] || null; },
    podium(st) {
      const R = st.ev && st.ev.rounds, f = st.matches.find((m) => m.round === R), t = st.matches.find((m) => m.round === 99);
      if (!f || !f.winner) return null;
      return [f.winner, f.winner === f.p1 ? f.p2 : f.p1, t && t.winner];
    },
  };
  window.SofiTurnir = API;

  /* ===================== Musobaqalar sahifasi ===================== */
  const box = document.getElementById("tnBox");
  if (!box) return;
  let st = null, timer = 0, busy = false, adminOpen = false, pin = "";
  const me = () => (window.SofiAuth && window.SofiAuth.me()) || null;
  const fmtDate = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" }) + ", soat " + d.toTimeString().slice(0, 5); } catch (e) { return ""; } };

  function countdown(iso) {
    const ms = new Date(iso).getTime() - Date.now();
    if (!(ms > 0)) return null;
    const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return [[d, "kun"], [h, "soat"], [m, "daq"], [sec, "son"]];
  }

  function render() {
    if (!st) return;
    const { ev, players, matches } = st;
    if (!ev) { box.innerHTML = `<div class="tn-card"><p>Turnir hali e’lon qilinmagan.</p></div>`; return; }
    const u = me(), mine = u && players.some((p) => p.name === u.name);
    const full = players.length >= ev.size;
    const cd = ev.start_at ? countdown(ev.start_at) : null;
    const status = ev.status === "reg" ? (full ? "🔒 O‘rinlar to‘ldi" : "🟢 Ro‘yxat ochiq") : ev.status === "live" ? "● Turnir ketmoqda" : "🏁 Yakunlandi";
    const pod = API.podium(st);
    const myM = u && ev.status === "live" ? API.myMatch(st, u.name) : null;

    box.innerHTML = `
      <div class="tn-card tn-${ev.status}">
        <div class="tn-glow" aria-hidden="true"></div>
        <div class="tn-top">
          <div class="tn-title"><span class="tn-ico">♟️</span><div><span class="tn-kick">ASOSIY MUSOBAQA</span><h3>${esc(ev.title || "Shaxmat turniri")}</h3></div></div>
          <span class="tn-status ${ev.status}">${status}</span>
        </div>
        <div class="tn-facts">
          <span>👥 <b>${ev.size}</b> o‘rin</span>
          <span>⚔️ Yutgan — keyingi bosqichga</span>
          <span>👨‍🏫 Ustozlar ham qatnashadi</span>
          <span>⏱ 10 daqiqalik o‘yinlar</span>
        </div>
        <div class="tn-when">
          ${ev.status === "reg" ? (ev.start_at ? `<div class="tn-date">📅 Boshlanish: <b>${esc(fmtDate(ev.start_at))}</b></div>${cd ? `<div class="tn-cd">${cd.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("")}</div>` : `<div class="tn-date">⏳ Ustoz boshlashini kuting…</div>`}` : `<div class="tn-date">📅 Boshlanish vaqti tez orada e’lon qilinadi</div>`)
            : ev.status === "live" ? `<div class="tn-date">🔥 Turnir boshlandi! O‘yinlar “O‘yinlar” bo‘limidagi Shaxmatda o‘tadi.</div>` : `<div class="tn-date">🏁 Turnir yakunlandi. G‘oliblarga tabriklar!</div>`}
        </div>
        <div class="tn-prizes"><div class="g1"><span>🥇</span><b>150 ⭐</b><small>1-o‘rin</small></div><div class="g2"><span>🥈</span><b>100 ⭐</b><small>2-o‘rin</small></div><div class="g3"><span>🥉</span><b>50 ⭐</b><small>3-o‘rin</small></div><div class="tot"><span>🏆</span><b>300 ⭐</b><small>jami sovrin</small></div></div>

        ${pod ? `<div class="tn-podium">${[[1, pod[1], "🥈"], [0, pod[0], "🥇"], [2, pod[2], "🥉"]].map(([i, n, ic]) => `<div class="p${i + 1}"><span>${ic}</span><b>${esc(n || "—")}</b><small>+${[150, 100, 50][i]} ⭐</small></div>`).join("")}</div>` : ""}

        ${ev.status === "reg" ? `
          <div class="tn-reg">
            <div class="tn-bar"><i style="width:${(players.length / ev.size) * 100}%"></i></div>
            <div class="tn-count"><b>${players.length}</b> / ${ev.size} ishtirokchi yozildi${full ? " — o‘rinlar to‘ldi" : ` · ${ev.size - players.length} ta o‘rin qoldi`}</div>
            ${mine ? `<div class="tn-mine">✅ <b>${esc(u.name)}</b>, siz turnirga yozilgansiz! <button class="tn-link" data-tn="leave" type="button">Ro‘yxatdan chiqish</button></div>`
              : full ? "" : `<button class="tn-btn" data-tn="join" type="button">✍️ Turnirga yozilish</button><p class="tn-hint">Ismingizni ro‘yxatdan tanlang va parolingizni kiriting.</p>`}
          </div>` : ""}

        ${ev.status === "live" && u ? `<div class="tn-play">${myM ? `<a class="tn-btn" href="games.html#turnir">♟ Mening o‘yinimga o‘tish — ${esc(API.roundName(myM.round, ev.rounds))}</a>` : players.some((p) => p.name === u.name) ? `<p>Siz turnirdan chiqdingiz. Qolgan o‘yinlarni kuzating! 👀</p>` : ""}</div>` : ""}
        ${ev.status === "live" && !u ? `<div class="tn-play"><a class="tn-btn" href="games.html#turnir">♟ O‘yinimga o‘tish</a></div>` : ""}

        ${ev.status !== "reg" && matches.length ? bracketHTML(ev, matches, u && u.name) : ""}

        <div class="tn-list-head">📋 Ishtirokchilar <small>(${players.length})</small></div>
        <div class="tn-list">${players.length ? players.map((p, i) => {
          const t = isTeacher(p.name);
          const out = ev.status !== "reg" && matches.some((m) => m.winner && (m.p1 === p.name || m.p2 === p.name) && m.winner !== p.name && m.round !== 99);
          return `<div class="tn-pl ${u && p.name === u.name ? "me" : ""} ${out ? "out" : ""}"><span class="n">${i + 1}</span><span class="nm">${esc(p.name)}</span><span class="c ${t ? "t" : ""}">${t ? "👨‍🏫 Ustoz" : esc(p.cls || "")}</span></div>`;
        }).join("") : `<p class="tn-empty">Hali hech kim yozilmadi — birinchi bo‘ling! 🚀</p>`}</div>

        <details class="tn-admin" ${adminOpen ? "open" : ""}><summary>👨‍🏫 Ustoz paneli</summary>
          <div class="tn-adm">
            <label>🔑 Ustoz paroli <input type="password" data-a="pin" value="${esc(pin)}" autocomplete="off"></label>
            <label>📅 Boshlanish vaqti <input type="datetime-local" data-a="time" value="${ev.start_at ? new Date(new Date(ev.start_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}"></label>
            <label>🏷 Nomi <input type="text" data-a="title" value="${esc(ev.title || "")}" maxlength="80"></label>
            <div class="tn-adm-row"><button type="button" data-tn="save">💾 Saqlash</button>
              ${ev.status === "reg" ? `<button type="button" class="go" data-tn="start">▶ Turnirni boshlash (setka tuzish)</button>` : ""}
              ${ev.status !== "reg" ? `<button type="button" data-tn="new">➕ Yangi turnir</button>` : ""}</div>
            ${ev.status === "reg" && players.length ? `<div class="tn-adm-row"><select data-a="rm">${players.map((p) => `<option>${esc(p.name)}</option>`).join("")}</select><button type="button" data-tn="remove">🗑 Ro‘yxatdan o‘chirish</button></div>` : ""}
            ${ev.status === "live" ? (() => { const open = matches.filter((m) => !m.winner && m.p1 && m.p2); return open.length ? `<div class="tn-adm-row"><select data-a="mw">${open.map((m) => [m.p1, m.p2].map((w) => `<option value="${m.round}|${m.slot}|${esc(w)}">${esc(API.roundName(m.round, ev.rounds))}: ${esc(short(m.p1))} – ${esc(short(m.p2))} → g‘olib ${esc(w)}</option>`).join("")).join("")}</select><button type="button" data-tn="winner">✔ G‘olibni belgilash</button></div>` : ""; })() : ""}
            <p class="tn-hint">Turnir boshlanganda ishtirokchilar tasodifiy juftlanadi. G‘olib avtomatik keyingi bosqichga o‘tadi; turnir tugaganda yulduzlar o‘zi beriladi.</p>
            <div class="tn-msg" data-a="msg"></div>
          </div></details>
      </div>`;
  }

  function bracketHTML(ev, matches, myName) {
    const R = ev.rounds, cols = [];
    for (let r = 1; r <= R; r++) cols.push([r, matches.filter((m) => m.round === r)]);
    const third = matches.find((m) => m.round === 99);
    const cell = (m) => {
      const pl = (n) => n ? `<div class="${m.winner === n ? "w" : m.winner ? "l" : ""} ${myName === n ? "me" : ""}">${isTeacher(n) ? "👨‍🏫 " : ""}${esc(n)}</div>` : `<div class="tbd">${m.round === 1 ? "— bo‘sh joy —" : "…"}</div>`;
      const live = !m.winner && m.p1 && m.p2;
      return `<div class="tn-m ${live ? "live" : ""}">${pl(m.p1)}${pl(m.p2)}${live ? `<span class="lv">● o‘ynalmoqda</span>` : ""}</div>`;
    };
    return `<div class="tn-bracket-head">🗂 Turnir setkasi</div><div class="tn-bracket">${cols.map(([r, ms]) => `<div class="tn-col"><h4>${esc(roundName(r, R))}</h4><div class="tn-ms">${ms.map(cell).join("")}</div></div>`).join("")}${third ? `<div class="tn-col third"><h4>🥉 3-o‘rin uchun</h4><div class="tn-ms">${cell(third)}</div></div>` : ""}</div>`;
  }

  async function refresh() {
    try { st = await API.load(); render(); }
    catch (e) { box.innerHTML = `<div class="tn-card"><div class="tn-top"><div class="tn-title"><span class="tn-ico">♟️</span><div><span class="tn-kick">ASOSIY MUSOBAQA</span><h3>Shaxmat turniri</h3></div></div></div><p class="tn-err">⚠️ ${esc(e.message)}</p></div>`; }
  }
  const msg = (t, ok) => { const el = box.querySelector('[data-a="msg"]'); if (el) { el.textContent = t; el.className = "tn-msg " + (ok ? "ok" : "bad"); } };
  const toast = (t) => { const el = document.createElement("div"); el.className = "tn-toast"; el.textContent = t; document.body.append(el); setTimeout(() => el.remove(), 3500); };

  box.addEventListener("toggle", (e) => { if (e.target.classList && e.target.classList.contains("tn-admin")) adminOpen = e.target.open; }, true);
  box.addEventListener("input", (e) => { if (e.target.dataset.a === "pin") pin = e.target.value; });
  box.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-tn]"); if (!b || busy || !st) return;
    const a = b.dataset.tn, ev = st.ev, val = (k) => (box.querySelector(`[data-a="${k}"]`) || {}).value || "";
    busy = true;
    try {
      if (a === "join") {
        let u = me();
        if (!u && window.SofiAuth) u = await window.SofiAuth.open({ title: "Turnirga yozilish" });
        if (!u) return;
        const n = await API.register(ev.id, u.name, u.role === "teacher" ? "Ustoz" : u.cls);
        toast(`✅ ${short(u.name)}, siz turnirga yozildingiz! (${n}-ishtirokchi)`);
      } else if (a === "leave") {
        const u = me(); if (!u || !confirm("Turnir ro‘yxatidan chiqasizmi?")) return;
        await API.unregister(ev.id, u.name); toast("Ro‘yxatdan chiqdingiz.");
      } else if (a === "save") {
        const t = val("time");
        await API.rpc("tn_admin_time", { p_pin: pin, p_event: ev.id, p_start: t ? new Date(t).toISOString() : null, p_title: val("title") }); msg("✅ Saqlandi", true);
      } else if (a === "start") {
        if (!confirm(`Turnirni boshlaysizmi? ${st.players.length} ta ishtirokchi juftlanadi, keyin yozilib bo‘lmaydi.`)) return;
        const n = await API.rpc("tn_admin_start", { p_pin: pin, p_event: ev.id }); msg(`✅ Turnir boshlandi: ${n} ishtirokchi`, true);
      } else if (a === "new") {
        if (!confirm("Yangi turnir ochilsinmi? Joriy turnir tarixda qoladi.")) return;
        await API.rpc("tn_admin_new", { p_pin: pin, p_title: val("title") || "Shaxmat turniri" }); msg("✅ Yangi turnir ochildi", true);
      } else if (a === "remove") {
        await API.rpc("tn_admin_remove", { p_pin: pin, p_event: ev.id, p_name: val("rm") }); msg("✅ O‘chirildi", true);
      } else if (a === "winner") {
        const [r, s, w] = val("mw").split("|");
        await API.rpc("tn_admin_winner", { p_pin: pin, p_event: ev.id, p_round: Number(r), p_slot: Number(s), p_winner: w }); msg("✅ G‘olib belgilandi", true);
      }
      await refresh();
    } catch (ex) { if (["save", "start", "new", "remove", "winner"].includes(a)) msg("❌ " + ex.message); else toast("❌ " + ex.message); }
    finally { busy = false; }
  });

  refresh();
  timer = setInterval(() => { if (!document.hidden && !busy && !adminOpen) refresh(); }, 10000);
  setInterval(() => { const el = box.querySelector(".tn-cd"); if (el && st && st.ev && st.ev.start_at) { const cd = countdown(st.ev.start_at); if (cd) el.innerHTML = cd.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join(""); } }, 1000);
  document.addEventListener("sofi:auth", render);
})();
