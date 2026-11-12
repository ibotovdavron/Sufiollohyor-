/* “SO‘FI OLLOHYOR MUSOBAQASI” — asosiy musobaqa (Musobaqalar sahifasi).
   Oflayn test: 15 matematika + 15 ona tili + 15 ingliz tili + 5 IQ = 50 ball, 5/6/7-sinflar alohida.
   Jadval/funksiyalar: sofi-musobaqa.sql. ?net=local — internetsiz sinov (shu qurilmada). */
(() => {
  "use strict";
  const box = document.getElementById("smBox");
  if (!box) return;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const D = () => window.CENTER_DATA || {};
  const SUBJ = [["math", "Matematika", "➗", 15], ["ona", "Ona tili", "📖", 15], ["eng", "Ingliz tili", "🇬🇧", 15], ["iq", "IQ test", "🧠", 5]];
  const LEVELS = [["A+", 45, 100], ["A", 40, 70], ["B+", 35, 50], ["B", 30, 0], ["C+", 25, 0], ["C", 0, 0]];
  const level = (t) => (t == null ? null : LEVELS.find(([, min]) => t >= min)[0]);
  const starsOf = (lv) => (LEVELS.find(([l]) => l === lv) || [0, 0, 0])[2];
  const CLASSES = [5, 6, 7];
  const clsOf = (group) => { const m = /^([5-7])\b|^([5-7])-/.exec(String(group || "")); return m ? Number(m[1] || m[2]) : null; };
  const GK = "sofi_sm_guest";

  /* ---------- ma'lumot qatlami: Supabase yoki mahalliy sinov ---------- */
  const local = new URLSearchParams(location.search).get("net") === "local";
  let client;
  const db = () => {
    if (client !== undefined) return client;
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    client = !local && window.supabase && cfg.SUPABASE_URL ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } }) : null;
    return client;
  };
  const missing = (e) => e && /does not exist|schema cache|Could not find|relation/i.test(e.message || "");
  const err = (e) => new Error(missing(e) ? "Supabase’da sofi-musobaqa.sql hali ishga tushirilmagan." : (e && e.message) || "Xatolik");

  const LS = "sofi_sm_local";
  const L = {
    get() { try { return JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { return null; } },
    put(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} },
    st() { let s = L.get(); if (!s) { s = { ev: { id: 1, title: "So‘fi Ollohyor musobaqasi", test_at: null, place: "", status: "reg", awarded: false }, players: [] }; L.put(s); } return s; },
    async pinOk(pin) {
      const h = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(pin || "").trim())))].map((b) => b.toString(16).padStart(2, "0")).join("");
      if (!(h === D().teacherPinHash || (D().teachers || []).some((t) => t.pinHash === h))) throw new Error("Parol noto‘g‘ri");
    },
    async rpc(fn, a) {
      const s = L.st(), ev = s.ev, P = s.players, find = (n) => P.find((p) => p.name === n);
      if (fn.startsWith("sm_admin")) await L.pinOk(a.p_pin);
      let out = true;
      if (fn === "sm_register") {
        if (ev.status !== "reg") throw new Error("Ro‘yxatdan o‘tish yopilgan");
        const nm = String(a.p_name).trim().replace(/\s+/g, " ");
        if (nm.length < 5 || !/ /.test(nm)) throw new Error("Ism va familiyani to‘liq kiriting");
        if (P.some((p) => p.name.toLowerCase() === nm.toLowerCase())) throw new Error("Bu ism bilan allaqachon yozilgan");
        P.push({ name: nm, cls: a.p_cls, guest: a.p_guest, stars: 0, created_at: new Date().toISOString() });
        out = P.filter((p) => p.cls === a.p_cls).length;
      } else if (fn === "sm_unregister" || fn === "sm_admin_remove") { s.players = P.filter((p) => p.name !== a.p_name); }
      else if (fn === "sm_admin_info") { ev.test_at = a.p_test_at; ev.place = a.p_place; ev.title = a.p_title || ev.title; }
      else if (fn === "sm_admin_status") ev.status = a.p_status;
      else if (fn === "sm_admin_score") {
        if (ev.status === "done") throw new Error("Musobaqa yakunlangan — natijani o‘zgartirib bo‘lmaydi");
        const p = find(a.p_name); Object.assign(p, { math: a.p_math, ona: a.p_ona, eng: a.p_eng, iq: a.p_iq });
        p.total = [a.p_math, a.p_ona, a.p_eng, a.p_iq].some((v) => v == null) ? null : a.p_math + a.p_ona + a.p_eng + a.p_iq; p.level = level(p.total); out = p.level;
      } else if (fn === "sm_admin_finish") {
        if (ev.awarded) throw new Error("Yulduzlar allaqachon berilgan");
        out = 0; P.forEach((p) => { p.stars = starsOf(p.level); if (p.stars) out++; }); ev.status = "done"; ev.awarded = true;
      } else if (fn === "sm_admin_new") { s.ev = { id: ev.id + 1, title: a.p_title || "So‘fi Ollohyor musobaqasi", status: "reg", awarded: false }; s.players = []; }
      L.put(s); return out;
    },
  };

  const API = {
    async load() {
      const c = db();
      if (!c) { if (!local) throw new Error("Internet yoki Supabase ulanmagan"); const s = L.st(); return { ev: s.ev, players: s.players }; }
      const { data: evs, error } = await c.from("sm_events").select("*").order("id", { ascending: false }).limit(1);
      if (error) throw err(error);
      const ev = evs && evs[0];
      if (!ev) return { ev: null, players: [] };
      const p = await c.from("sm_players").select("*").eq("event_id", ev.id).order("created_at");
      if (p.error) throw err(p.error);
      return { ev, players: p.data || [] };
    },
    async rpc(fn, args) {
      const c = db();
      if (!c) { if (!local) throw new Error("Internet yoki Supabase ulanmagan"); return L.rpc(fn, args); }
      const { data, error } = await c.rpc(fn, args); if (error) throw err(error); return data;
    },
  };

  /* ---------- holat ---------- */
  let st = null, busy = false, adminOpen = false, pin = "", tab = 5, admTab = 5, guestForm = false;
  const me = () => (window.SofiAuth && window.SofiAuth.me()) || null;
  const guest = () => { try { return JSON.parse(localStorage.getItem(GK)); } catch (e) { return null; } };
  const setGuest = (v) => { try { v ? localStorage.setItem(GK, JSON.stringify(v)) : localStorage.removeItem(GK); } catch (e) {} };
  const fmtDate = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" }) + ", soat " + d.toTimeString().slice(0, 5); } catch (e) { return ""; } };
  const countdown = (iso) => {
    const ms = new Date(iso).getTime() - Date.now(); if (!(ms > 0)) return null;
    const s = Math.floor(ms / 1000);
    return [[Math.floor(s / 86400), "kun"], [Math.floor((s % 86400) / 3600), "soat"], [Math.floor((s % 3600) / 60), "daq"], [s % 60, "son"]];
  };
  const cdHTML = (cd) => cd.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("");

  /** Shu qurilmadagi ishtirokchi: kirgan o'quvchi yoki mehmon */
  function mine() {
    if (!st || !st.ev) return null;
    const u = me(), g = guest();
    if (u && st.players.some((p) => p.name === u.name)) return st.players.find((p) => p.name === u.name);
    if (g && g.event === st.ev.id) return st.players.find((p) => p.name === g.name) || null;
    return null;
  }

  function render() {
    if (!st) return;
    const { ev, players } = st;
    if (!ev) { box.innerHTML = `<div class="tn-card sm-card"><p>Musobaqa hali e’lon qilinmagan.</p></div>`; return; }
    const my = mine(), done = ev.status === "done";
    const cd = ev.test_at && ev.status !== "done" ? countdown(ev.test_at) : null;
    const status = ev.status === "reg" ? "🟢 Ro‘yxat ochiq" : ev.status === "test" ? "📝 Test bosqichi" : "🏁 Natijalar e’lon qilindi";
    const byCls = (c) => players.filter((p) => p.cls === c);

    box.innerHTML = `
      <div class="tn-card sm-card sm-${ev.status}">
        <div class="tn-glow" aria-hidden="true"></div>
        <div class="tn-top">
          <div class="tn-title"><span class="tn-ico">🏅</span><div><span class="tn-kick">ASOSIY MUSOBAQA</span><h3>${esc(ev.title || "So‘fi Ollohyor musobaqasi")}</h3></div></div>
          <span class="tn-status ${ev.status === "test" ? "live" : ev.status === "done" ? "done" : ""}">${status}</span>
        </div>
        <div class="tn-facts">
          <span>📝 <b>Oflayn</b> test — markazda, qog‘ozda</span>
          <span>🎒 <b>5, 6, 7</b>-sinflar</span>
          <span>📚 Har bir sinfga <b>alohida</b> test</span>
          <span>❓ <b>50</b> ta savol</span>
        </div>
        <div class="sm-subj">${SUBJ.map(([, t, ic, n]) => `<div><span>${ic}</span><b>${n}</b><small>${t}</small></div>`).join("")}</div>
        <div class="tn-when">
          ${done ? `<div class="tn-date">🏁 Musobaqa yakunlandi. Barcha ishtirokchilarga rahmat!</div>`
            : ev.test_at ? `<div class="tn-date">📅 Test kuni: <b>${esc(fmtDate(ev.test_at))}</b>${ev.place ? ` · 📍 ${esc(ev.place)}` : ""}</div>${cd ? `<div class="tn-cd">${cdHTML(cd)}</div>` : ev.status === "test" ? `<div class="tn-date">✍️ Test bo‘lib o‘tdi — natijalar tekshirilmoqda…</div>` : ""}`
            : `<div class="tn-date">📅 Test kuni tez orada e’lon qilinadi${ev.place ? ` · 📍 ${esc(ev.place)}` : ""}</div>`}
        </div>
        <div class="sm-levels">
          ${LEVELS.slice(0, 3).map(([l, min, s]) => `<div class="lv-${l.replace("+", "p")}"><em>${l}</em><b>${s} ⭐</b><small>${min}–${l === "A+" ? 50 : LEVELS.find(([x]) => x === l)[1] + 4} ball</small></div>`).join("")}
          <div class="sm-nost"><em>B · C+ · C</em><small>yulduzsiz</small></div>
        </div>

        ${ev.status === "reg" ? regHTML(my, players) : my ? `<div class="tn-mine">✅ <b>${esc(my.name)}</b> — ${my.cls}-sinf, ro‘yxatda bor.${done && my.level ? ` Darajangiz: <b>${esc(my.level)}</b>${my.stars ? ` · +${my.stars} ⭐` : ""}` : ""}</div>` : ""}

        <div class="sm-tabs">${CLASSES.map((c) => `<button type="button" data-tab="${c}" class="${c === tab ? "on" : ""}">${c}-sinf <small>${byCls(c).length}</small></button>`).join("")}</div>
        ${done ? resultsHTML(byCls(tab), my) : `<div class="tn-list">${byCls(tab).length ? byCls(tab).map((p, i) => `<div class="tn-pl ${my && p.name === my.name ? "me" : ""}"><span class="n">${i + 1}</span><span class="nm">${esc(p.name)}</span><span class="c">${p.guest ? "👤 mehmon" : ""}</span></div>`).join("") : `<p class="tn-empty">${tab}-sinfdan hali hech kim yozilmadi — birinchi bo‘ling! 🚀</p>`}</div>`}

        ${adminHTML(ev, players)}
      </div>`;
    showMsg();
  }

  function regHTML(my, players) {
    if (my) return `<div class="tn-reg"><div class="tn-mine">✅ <b>${esc(my.name)}</b>, siz ${my.cls}-sinf ro‘yxatidasiz! Test kuni markazga keling. <button class="tn-link" data-sm="leave" type="button">Ro‘yxatdan chiqish</button></div></div>`;
    if (guestForm) return `<form class="sm-guest" data-sm-form>
        <b>👤 Mehmon sifatida ro‘yxatdan o‘tish</b>
        <div class="sm-grid">
          <label>Ism <input name="ism" required maxlength="40" autocomplete="given-name" placeholder="Masalan: Aziza"></label>
          <label>Familiya <input name="fam" required maxlength="40" autocomplete="family-name" placeholder="Masalan: Karimova"></label>
          <label>Sinf <select name="cls" required><option value="">— tanlang —</option>${CLASSES.map((c) => `<option value="${c}">${c}-sinf</option>`).join("")}</select></label>
        </div>
        <div class="sm-row"><button type="button" class="sm-back" data-sm="guest-cancel">← Orqaga</button><button type="submit" class="tn-btn">✍️ Yozilish</button></div>
      </form>`;
    return `<div class="tn-reg">
        <div class="tn-count"><b>${players.length}</b> ishtirokchi yozildi</div>
        <div class="sm-row"><button class="tn-btn" data-sm="join" type="button">✍️ Ismimni tanlab yozilaman</button><button class="tn-btn sm-alt" data-sm="guest" type="button">👤 Mehmonman</button></div>
        <p class="tn-hint">Markaz o‘quvchisi bo‘lsangiz — ismingizni ro‘yxatdan tanlang. Boshqa maktabdan bo‘lsangiz — “Mehmonman” ni bosib, ism, familiya va sinfingizni kiriting.</p>
      </div>`;
  }

  function resultsHTML(list, my) {
    const done = list.filter((p) => p.total != null).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    const rest = list.filter((p) => p.total == null);
    if (!list.length) return `<p class="tn-empty">Bu sinfda ishtirokchi yo‘q.</p>`;
    return `<div class="sm-res">
      <div class="sm-rh"><span>#</span><span>Ishtirokchi</span><span>Jami</span><span>Daraja</span></div>
      ${done.map((p, i) => `<div class="sm-r ${my && p.name === my.name ? "me" : ""}"><span>${["🥇", "🥈", "🥉"][i] || i + 1}</span><span class="nm">${esc(p.name)}${p.guest ? " 👤" : ""}<small class="sc">${SUBJ.map(([k, t, ic]) => `<i title="${t}">${ic} ${p[k] ?? "—"}</i>`).join("")}</small></span><span><b>${p.total}</b><small class="of">/50</small></span><span><i class="sm-lv lv-${String(p.level).replace("+", "p")}">${esc(p.level)}</i>${p.stars ? `<small>+${p.stars}⭐</small>` : ""}</span></div>`).join("")}
      ${rest.map((p) => `<div class="sm-r off"><span>—</span><span class="nm">${esc(p.name)}</span><span class="sm-na">qatnashmadi</span></div>`).join("")}
    </div>`;
  }

  function adminHTML(ev, players) {
    const local = ev.test_at ? new Date(new Date(ev.test_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
    const list = players.filter((p) => p.cls === admTab);
    const filled = players.filter((p) => p.total != null).length;
    return `<details class="tn-admin" ${adminOpen ? "open" : ""}><summary>👨‍🏫 Ustoz paneli</summary>
      <div class="tn-adm">
        <label>🔑 Ustoz paroli <input type="password" data-a="pin" value="${esc(pin)}" autocomplete="off"></label>
        <div class="sm-grid">
          <label>📅 Test kuni va soati <input type="datetime-local" data-a="time" value="${local}"></label>
          <label>📍 Joyi <input type="text" data-a="place" value="${esc(ev.place || "")}" maxlength="120" placeholder="Masalan: markaz, 2-xona"></label>
          <label>🏷 Nomi <input type="text" data-a="title" value="${esc(ev.title || "")}" maxlength="80"></label>
        </div>
        <div class="tn-adm-row"><button type="button" data-sm="save">💾 Saqlash</button>
          ${ev.status === "reg" ? `<button type="button" data-sm="close">🔒 Ro‘yxatni yopish (test kuni)</button>` : ""}
          ${ev.status === "test" ? `<button type="button" data-sm="reopen">🔓 Ro‘yxatni qayta ochish</button>` : ""}
          ${ev.status === "done" ? `<button type="button" data-sm="new">➕ Yangi musobaqa</button>` : ""}</div>
        ${ev.status !== "done" ? `
          <div class="sm-adm-head">📝 Natijalarni kiritish <small>(${filled} / ${players.length} kiritildi)</small></div>
          <div class="sm-tabs">${CLASSES.map((c) => `<button type="button" data-atab="${c}" class="${c === admTab ? "on" : ""}">${c}-sinf <small>${players.filter((p) => p.cls === c).length}</small></button>`).join("")}</div>
          <div class="sm-score">
            ${list.length ? `<div class="sm-sh"><span>Ishtirokchi</span>${SUBJ.map(([, t, , n]) => `<span>${t}<small>/${n}</small></span>`).join("")}<span>Jami</span><span></span></div>` : `<p class="tn-empty">${admTab}-sinfda ishtirokchi yo‘q.</p>`}
            ${list.map((p) => `<div class="sm-s" data-row="${esc(p.name)}"><span class="nm">${esc(p.name)}${p.guest ? " 👤" : ""}</span>${SUBJ.map(([k, t, , n]) => `<input type="number" inputmode="numeric" min="0" max="${n}" data-k="${k}" value="${p[k] ?? ""}" placeholder="${t.slice(0, 3)}" aria-label="${t}">`).join("")}<span class="tot">${p.total != null ? `${p.total} · <i class="sm-lv lv-${String(p.level).replace("+", "p")}">${esc(p.level)}</i>` : "—"}</span><button type="button" data-sm="score">💾</button></div>`).join("")}
          </div>
          ${players.length ? `<div class="tn-adm-row"><select data-a="rm">${players.map((p) => `<option value="${esc(p.name)}">${esc(p.name)} (${p.cls}-sinf)</option>`).join("")}</select><button type="button" data-sm="remove">🗑 Ro‘yxatdan o‘chirish</button></div>` : ""}
          <div class="tn-adm-row"><button type="button" class="go" data-sm="finish">🏁 Natijalarni e’lon qilish va yulduzlarni berish</button></div>` : ""}
        <p class="tn-hint">Darajalar: A+ — 45–50, A — 40–44, B+ — 35–39, B — 30–34, C+ — 25–29, C — 0–24 ball. Yulduzlar faqat “Natijalarni e’lon qilish” bosilganda, bir marta beriladi.</p>
        <div class="tn-msg" data-a="msg"></div>
      </div></details>`;
  }

  async function refresh() {
    try { st = await API.load(); render(); }
    catch (e) { box.innerHTML = `<div class="tn-card sm-card"><div class="tn-top"><div class="tn-title"><span class="tn-ico">🏅</span><div><span class="tn-kick">ASOSIY MUSOBAQA</span><h3>So‘fi Ollohyor musobaqasi</h3></div></div></div><p class="tn-err">⚠️ ${esc(e.message)}</p></div>`; }
  }
  let lastMsg = null;
  const showMsg = () => { const el = box.querySelector('[data-a="msg"]'); if (el && lastMsg) { el.textContent = lastMsg[0]; el.className = "tn-msg " + (lastMsg[1] ? "ok" : "bad"); } };
  const msg = (t, ok) => { lastMsg = [t, ok]; showMsg(); };
  const toast = (t) => { const el = document.createElement("div"); el.className = "tn-toast"; el.textContent = t; document.body.append(el); setTimeout(() => el.remove(), 3500); };
  const val = (k) => (box.querySelector(`[data-a="${k}"]`) || {}).value || "";

  box.addEventListener("toggle", (e) => { if (e.target.classList && e.target.classList.contains("tn-admin")) adminOpen = e.target.open; }, true);
  box.addEventListener("input", (e) => {
    if (e.target.dataset.a === "pin") pin = e.target.value;
    const row = e.target.closest("[data-row]");
    if (row) { // jami va darajani darrov ko'rsatamiz
      const v = [...row.querySelectorAll("input")].map((i) => (i.value === "" ? null : Number(i.value)));
      const t = v.some((x) => x == null) ? null : v.reduce((a, b) => a + b, 0);
      row.querySelector(".tot").innerHTML = t == null ? "—" : `${t} · <i class="sm-lv lv-${level(t).replace("+", "p")}">${level(t)}</i>`;
      row.classList.add("dirty");
    }
  });
  box.addEventListener("submit", async (e) => {
    const f = e.target.closest("[data-sm-form]"); if (!f) return;
    e.preventDefault(); if (busy) return;
    const ism = f.ism.value.trim(), fam = f.fam.value.trim(), cls = Number(f.cls.value);
    if (ism.length < 2 || fam.length < 2 || !cls) return toast("❌ Ism, familiya va sinfni to‘liq kiriting");
    const name = `${fam} ${ism}`;
    busy = true;
    try {
      const n = await API.rpc("sm_register", { p_event: st.ev.id, p_name: name, p_cls: cls, p_guest: true });
      setGuest({ event: st.ev.id, name }); guestForm = false;
      toast(`✅ ${ism}, siz ${cls}-sinf ro‘yxatiga yozildingiz! (${n}-ishtirokchi)`); tab = cls;
      await refresh();
    } catch (ex) { toast("❌ " + ex.message); } finally { busy = false; }
  });
  box.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-tab]"); if (t) { tab = Number(t.dataset.tab); return render(); }
    const at = e.target.closest("[data-atab]"); if (at) { admTab = Number(at.dataset.atab); return render(); }
    const b = e.target.closest("[data-sm]"); if (!b || busy || !st) return;
    const a = b.dataset.sm, ev = st.ev;
    if (a === "guest") { guestForm = true; render(); setTimeout(() => { const i = box.querySelector('[name="ism"]'); if (i) i.focus(); }, 30); return; }
    if (a === "guest-cancel") { guestForm = false; return render(); }
    busy = true;
    try {
      if (a === "join") {
        let u = me();
        if (!u || clsOf(u.cls) == null) {
          if (u && u.role === "teacher") { toast("Ustozlar bu musobaqada qatnashmaydi — natijalarni “Ustoz paneli”dan kiritasiz."); return; }
          if (window.SofiAuth) u = await window.SofiAuth.open({ title: "Musobaqaga yozilish", teachers: false });
        }
        if (!u) return;
        const c = clsOf(u.cls);
        if (c == null) { toast(`❌ ${short(u.name)}, bu musobaqa faqat 5, 6, 7-sinflar uchun.`); return; }
        const n = await API.rpc("sm_register", { p_event: ev.id, p_name: u.name, p_cls: c, p_guest: false });
        toast(`✅ ${short(u.name)}, siz ${c}-sinf ro‘yxatiga yozildingiz! (${n}-ishtirokchi)`); tab = c;
      } else if (a === "leave") {
        const my = mine(); if (!my || !confirm("Musobaqa ro‘yxatidan chiqasizmi?")) return;
        await API.rpc("sm_unregister", { p_event: ev.id, p_name: my.name }); if (my.guest) setGuest(null); toast("Ro‘yxatdan chiqdingiz.");
      } else if (a === "save") {
        const tm = val("time");
        await API.rpc("sm_admin_info", { p_pin: pin, p_event: ev.id, p_test_at: tm ? new Date(tm).toISOString() : null, p_place: val("place"), p_title: val("title") }); msg("✅ Saqlandi", true);
      } else if (a === "close" || a === "reopen") {
        await API.rpc("sm_admin_status", { p_pin: pin, p_event: ev.id, p_status: a === "close" ? "test" : "reg" }); msg(a === "close" ? "✅ Ro‘yxat yopildi" : "✅ Ro‘yxat qayta ochildi", true);
      } else if (a === "score") {
        const row = b.closest("[data-row]"), v = {};
        for (const i of row.querySelectorAll("input")) {
          const max = Number(i.max), x = i.value === "" ? null : Number(i.value);
          if (x != null && !(Number.isInteger(x) && x >= 0 && x <= max)) { msg(`❌ ${i.getAttribute("aria-label")}: 0 dan ${max} gacha butun son kiriting`); i.focus(); return; }
          v[i.dataset.k] = x;
        }
        const lv = await API.rpc("sm_admin_score", { p_pin: pin, p_event: ev.id, p_name: row.dataset.row, p_math: v.math, p_ona: v.ona, p_eng: v.eng, p_iq: v.iq });
        msg(`✅ ${row.dataset.row}: saqlandi${lv ? ` — ${lv} daraja` : ""}`, true);
      } else if (a === "remove") {
        const n = val("rm"); if (!confirm(`${n} ro‘yxatdan o‘chirilsinmi?`)) return;
        await API.rpc("sm_admin_remove", { p_pin: pin, p_event: ev.id, p_name: n }); msg("✅ O‘chirildi", true);
      } else if (a === "finish") {
        const dirty = box.querySelectorAll(".sm-s.dirty").length;
        const empty = st.players.filter((p) => p.total == null).length;
        if (!confirm(`Natijalar e’lon qilinsinmi?${dirty ? `\n⚠️ ${dirty} ta qatorda saqlanmagan o‘zgarish bor (💾 bosilmagan).` : ""}${empty ? `\n${empty} ta ishtirokchining natijasi kiritilmagan — ular “qatnashmadi” deb ko‘rinadi.` : ""}\nA+ / A / B+ olganlarga yulduzlar beriladi. Keyin natijani o‘zgartirib bo‘lmaydi.`)) return;
        const n = await API.rpc("sm_admin_finish", { p_pin: pin, p_event: ev.id }); msg(`✅ Natijalar e’lon qilindi. ${n} ta o‘quvchiga yulduz berildi`, true);
      } else if (a === "new") {
        if (!confirm("Yangi musobaqa ochilsinmi? Joriysi tarixda qoladi.")) return;
        await API.rpc("sm_admin_new", { p_pin: pin, p_title: val("title") || "So‘fi Ollohyor musobaqasi" }); msg("✅ Yangi musobaqa ochildi", true);
      }
      // Ball kiritishda boshqa qatorlardagi saqlanmagan raqamlar yo'qolmasin
      if (a === "score") { const row = b.closest("[data-row]"); row.classList.remove("dirty"); st = await API.load(); }
      else await refresh();
    } catch (ex) { if (["join", "leave"].includes(a)) toast("❌ " + ex.message); else msg("❌ " + ex.message); }
    finally { busy = false; }
  });

  refresh();
  setInterval(() => { if (!document.hidden && !busy && !adminOpen && !guestForm) refresh(); }, 15000);
  setInterval(() => { const el = box.querySelector(".sm-card .tn-cd"); if (el && st && st.ev && st.ev.test_at) { const cd = countdown(st.ev.test_at); if (cd) el.innerHTML = cdHTML(cd); } }, 1000);
  document.addEventListener("sofi:auth", render);
})();
