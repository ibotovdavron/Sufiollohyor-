/* O'yinlar chati: umumiy suhbat, shaxsiy xabarlar, onlayn ro'yxat va ustoz nazorati.
   Xabarlar onlayn bo'lganlar orasida real vaqtda yuboriladi (serverda saqlanmaydi). */
(() => {
  "use strict";

  const G = window.SofiGames;
  const api = G.api;
  const $ = (s, p = document) => p.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const me = () => G.session;
  const isTeacher = () => me().role === "teacher";
  const first = (n) => (n || "").split(" ")[1] || n || "";
  const time = (ts) => new Date(ts).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

  const MAX_LEN = 200;
  const QUICK = ["👋 Salom!", "🎮 O‘ynaymizmi?", "👍 Zo‘r!", "😂", "🏆 Yutdim!", "🤝 Rahmat!"];
  // Odobsiz so'zlar (qisqa ro'yxat) — yulduzcha bilan almashtiriladi
  const BAD = ["ahmoq", "tentak", "jinni", "itvachcha", "harom", "dalbayob", "qanjiq", "sukin", "blyat", "suka", "debil", "idiot", "durak", "pidar", "nahuy", "xuy", "jalab"];
  const badRe = new RegExp(BAD.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi");
  const linkRe = /(https?:\/\/|www\.|t\.me\/|\.(com|uz|ru|org|net)\b)/i;

  const store = {
    get(k, d) { try { return JSON.parse(sessionStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  let msgs = store.get("sofi_chat_v1", []); // {id, from, fromCid, role, to, toName, text, ts, ann}
  let mutedUntil = store.get("sofi_chat_mute", 0);
  let tab = "all"; // all | dm:<cid> | people | watch
  let unread = 0;
  let open = false;
  const sentAt = [];
  let histAnswered = {};

  const save = () => store.set("sofi_chat_v1", msgs.slice(-150));
  const clean = (t) => t.replace(badRe, (w) => "*".repeat(w.length));

  // ---------- Interfeys ----------
  const fab = document.createElement("button");
  fab.className = "ch-fab";
  fab.type = "button";
  fab.setAttribute("aria-label", "Chat");
  fab.innerHTML = `💬<b hidden>0</b>`;
  const panel = document.createElement("section");
  panel.className = "ch-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Chat");
  document.body.append(fab, panel);

  function people() {
    return api.online.filter((p) => p.name && p.cid !== me().cid);
  }
  function dmThreads() {
    const ids = new Set();
    msgs.forEach((m) => {
      if (!m.to) return;
      if (m.fromCid === me().cid) ids.add(m.to);
      else if (m.to === me().cid) ids.add(m.fromCid);
    });
    return [...ids];
  }
  function nameOf(cid) {
    const p = api.online.find((x) => x.cid === cid);
    if (p) return p.name;
    const m = msgs.find((x) => x.fromCid === cid) || msgs.find((x) => x.to === cid);
    return m ? (m.fromCid === cid ? m.from : m.toName) : "Foydalanuvchi";
  }

  function render() {
    if (!open) return;
    const s = me();
    if (!s.name) {
      panel.innerHTML = `${head("Chat")}<div class="ch-empty"><span>👋</span><p>Chatda yozish uchun avval ismingizni tanlang.</p><button class="btn" data-ch-pick>Ismni tanlash</button></div>`;
      return;
    }
    const threads = dmThreads();
    const tabs = [["all", "💬 Umumiy"], ["people", `👥 Onlayn (${people().length})`], ...threads.map((c) => [`dm:${c}`, `✉️ ${esc(first(nameOf(c)))}`])];
    if (isTeacher()) tabs.push(["watch", "👁️ Nazorat"]);
    let body = "";
    if (tab === "people") body = renderPeople();
    else body = renderMsgs();
    const muted = mutedUntil > Date.now();
    panel.innerHTML = `${head(tab.startsWith("dm:") ? `✉️ ${esc(nameOf(tab.slice(3)))}` : "Chat")}
      <nav class="ch-tabs">${tabs.map(([id, t]) => `<button class="${tab === id ? "on" : ""}" data-tab="${esc(id)}">${t}</button>`).join("")}</nav>
      <div class="ch-body">${body}</div>
      ${tab === "people" ? "" : tab === "watch" ? `<p class="ch-note">Bu yerda o‘quvchilarning shaxsiy xabarlari ko‘rinadi (faqat ustozlarga).</p>` : `
        <div class="ch-quick">${QUICK.map((q) => `<button data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
        <form class="ch-form" ${muted ? "aria-disabled=true" : ""}>
          ${isTeacher() && tab === "all" ? `<label class="ch-ann"><input type="checkbox" id="chAnn"> 📢 E’lon</label>` : ""}
          <input id="chInput" maxlength="${MAX_LEN}" autocomplete="off" placeholder="${muted ? "Siz vaqtincha yoza olmaysiz" : "Xabar yozing..."}" ${muted ? "disabled" : ""} aria-label="Xabar">
          <button class="ch-send" type="submit" ${muted ? "disabled" : ""} aria-label="Yuborish">➤</button>
        </form>
        <p class="ch-note">${isTeacher() ? "Siz ustozsiz: xabarlarni o‘chira olasiz va o‘quvchini vaqtincha jim qila olasiz." : "Hurmat bilan yozing. Ustozlar barcha xabarlarni ko‘ra oladi."}</p>`}`;
    const b = panel.querySelector(".ch-body");
    b.scrollTop = b.scrollHeight;
    const input = $("#chInput", panel);
    if (input && document.activeElement !== input && window.matchMedia("(hover: hover)").matches) input.focus();
  }
  function head(title) {
    return `<header class="ch-head"><b>${title}</b><button class="ch-x" data-ch-close aria-label="Yopish">✕</button></header>`;
  }
  function visible(m) {
    if (tab === "all") return !m.to;
    if (tab === "watch") return !!m.to;
    if (tab.startsWith("dm:")) {
      const c = tab.slice(3);
      return (m.fromCid === me().cid && m.to === c) || (m.fromCid === c && m.to === me().cid);
    }
    return false;
  }
  function renderMsgs() {
    const list = msgs.filter(visible);
    const ann = tab === "all" ? msgs.filter((m) => m.ann).slice(-1)[0] : null;
    return (ann ? `<div class="ch-pin">📌 <b>${esc(ann.from)}:</b> ${esc(ann.text)}</div>` : "") +
      (list.map((m) => {
        const mine = m.fromCid === me().cid;
        return `<div class="ch-msg ${mine ? "mine" : ""} ${m.role === "teacher" ? "t" : ""} ${m.ann ? "ann" : ""}" data-id="${esc(m.id)}">
          ${mine ? "" : `<span class="ch-who">${m.role === "teacher" ? "👨‍🏫 " : ""}${esc(m.from)}${tab === "watch" ? ` → ${esc(m.toName)}` : ""}</span>`}
          <span class="ch-text">${esc(m.text)}</span>
          <span class="ch-meta">${time(m.ts)}${isTeacher() && !mine ? ` · <button data-del="${esc(m.id)}">o‘chirish</button>${m.role !== "teacher" ? ` · <button data-mute="${esc(m.fromCid)}" data-mname="${esc(m.from)}">jim qilish</button>` : ""}` : ""}</span>
        </div>`;
      }).join("") || `<div class="ch-empty small"><span>💬</span><p>${tab === "all" ? "Hali xabar yo‘q. Birinchi bo‘lib salom bering!" : "Suhbatni boshlang."}</p></div>`);
  }
  function renderPeople() {
    const list = people().sort((a, b) => (b.role === "teacher") - (a.role === "teacher") || a.name.localeCompare(b.name));
    if (!list.length) return `<div class="ch-empty small"><span>🌙</span><p>Hozircha boshqa hech kim onlayn emas.</p></div>`;
    return list.map((p) => `
      <div class="ch-person">
        <span class="ch-av ${p.role === "teacher" ? "t" : ""}">${p.role === "teacher" ? "👨‍🏫" : esc(p.name[0])}</span>
        <span class="ch-pn"><b>${esc(p.name)}</b><small>${p.role === "teacher" ? "Ustoz" : esc(p.cls)} · ${p.status === "playing" ? "🎮 o‘yinda" : "🟢 bo‘sh"}</small></span>
        <button data-dm="${esc(p.cid)}" aria-label="Xabar yozish">✉️</button>
        ${p.status !== "playing" ? `<button data-play="${esc(p.name)}" aria-label="O‘yinga taklif">🎮</button>` : ""}
      </div>`).join("");
  }

  function setUnread(n) {
    unread = n;
    const b = fab.querySelector("b");
    b.hidden = !n;
    b.textContent = n > 9 ? "9+" : n;
  }
  function toggle(v) {
    open = v ?? !open;
    panel.hidden = !open;
    fab.classList.toggle("on", open);
    if (open) { setUnread(0); render(); }
  }

  // ---------- Yuborish ----------
  function send(text) {
    const s = me();
    if (!s.name) return;
    if (mutedUntil > Date.now()) { api.toast("Ustoz sizni vaqtincha jim qildi."); return; }
    text = text.trim().slice(0, MAX_LEN);
    if (!text) return;
    if (linkRe.test(text)) { api.toast("Havolalar yuborish mumkin emas.", "bad"); return; }
    const now = Date.now();
    while (sentAt.length && now - sentAt[0] > 10000) sentAt.shift();
    if (sentAt.length >= 5 || (sentAt.length && now - sentAt[sentAt.length - 1] < 1200)) { api.toast("Juda tez yozyapsiz — biroz kuting."); return; }
    sentAt.push(now);
    const to = tab.startsWith("dm:") ? tab.slice(3) : null;
    const ann = !to && isTeacher() && $("#chAnn", panel)?.checked;
    const m = { t: "chat", id: Math.random().toString(36).slice(2, 10), from: s.name, fromCid: s.cid, role: s.role, to, toName: to ? nameOf(to) : null, text: clean(text), ts: now, ann: !!ann };
    msgs.push(m);
    save();
    api.send(m);
    render();
  }

  // ---------- Kelgan xabarlar ----------
  api.onMsg((m) => {
    if (m.t === "chat") {
      if (msgs.some((x) => x.id === m.id)) return;
      const forMe = !m.to || m.to === me().cid;
      if (!forMe && !isTeacher()) return; // shaxsiy xabarlar faqat qabul qiluvchi va ustozlarga
      m.text = clean(String(m.text || "").slice(0, MAX_LEN));
      msgs.push(m);
      save();
      if (open) render();
      if (forMe && (!open || (m.to && tab !== `dm:${m.fromCid}`) || (!m.to && tab !== "all"))) {
        setUnread(unread + 1);
        if (m.to) { api.toast(`✉️ ${first(m.from)}: ${m.text.slice(0, 40)}`); api.beep(740, 0.1); }
        if (m.ann) api.toast(`📢 ${m.from}: ${m.text.slice(0, 60)}`, "good");
      }
    } else if (m.t === "chat-del") {
      if (!isFromTeacher(m)) return;
      msgs = msgs.filter((x) => x.id !== m.id);
      save();
      render();
    } else if (m.t === "mute" && m.toCid === me().cid) {
      if (!isFromTeacher(m)) return;
      mutedUntil = m.until;
      store.set("sofi_chat_mute", mutedUntil);
      api.toast(`🔇 ${m.by} sizni ${Math.round((m.until - Date.now()) / 60000)} daqiqaga jim qildi.`, "bad");
      render();
    } else if (m.t === "chat-hist-req" && m.cid !== me().cid) {
      // Yangi kelgan foydalanuvchiga oxirgi umumiy xabarlarni yuborish (bir kishi javob beradi)
      const pub = msgs.filter((x) => !x.to).slice(-30);
      if (!pub.length) return;
      setTimeout(() => {
        if (histAnswered[m.cid]) return;
        api.send({ t: "chat-hist", toCid: m.cid, msgs: pub });
      }, 200 + Math.random() * 900);
    } else if (m.t === "chat-hist") {
      histAnswered[m.toCid] = true;
      if (m.toCid !== me().cid || !Array.isArray(m.msgs)) return;
      let added = 0;
      m.msgs.forEach((x) => { if (x && !x.to && !msgs.some((y) => y.id === x.id)) { x.text = clean(String(x.text || "").slice(0, MAX_LEN)); msgs.push(x); added++; } });
      if (added) { msgs.sort((a, b) => a.ts - b.ts); save(); render(); }
    }
  });
  // Ustoz yuborganini tekshirish: yuboruvchi hozir onlayn ustoz bo'lishi kerak
  function isFromTeacher(m) {
    return api.online.some((p) => p.cid === m.byCid && p.role === "teacher");
  }
  api.onPresence(() => { if (open && tab === "people") render(); });

  // ---------- Hodisalar ----------
  fab.onclick = () => toggle();
  panel.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-ch-close]")) return toggle(false);
    if (t.closest("[data-ch-pick]")) { toggle(false); api.askName(); return; }
    const tb = t.closest("[data-tab]");
    if (tb) { tab = tb.dataset.tab; render(); return; }
    const q = t.closest("[data-q]");
    if (q) { send(q.dataset.q); return; }
    const dm = t.closest("[data-dm]");
    if (dm) { tab = `dm:${dm.dataset.dm}`; render(); return; }
    const pl = t.closest("[data-play]");
    if (pl) { toggle(false); api.invite(pl.dataset.play); return; }
    const del = t.closest("[data-del]");
    if (del && isTeacher()) {
      api.send({ t: "chat-del", id: del.dataset.del, byCid: me().cid });
      msgs = msgs.filter((x) => x.id !== del.dataset.del);
      save();
      render();
      return;
    }
    const mu = t.closest("[data-mute]");
    if (mu && isTeacher()) {
      api.send({ t: "mute", toCid: mu.dataset.mute, until: Date.now() + 10 * 60000, by: me().name, byCid: me().cid });
      api.toast(`🔇 ${mu.dataset.mname} 10 daqiqaga jim qilindi.`);
    }
  });
  panel.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#chInput", panel);
    if (!input) return;
    send(input.value);
    input.value = "";
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) toggle(false); });

  // Kirganda oldingi umumiy xabarlarni so'rash
  setTimeout(() => api.send({ t: "chat-hist-req", cid: me().cid }), 2500);
})();
