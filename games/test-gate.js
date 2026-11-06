/* O'yinlar oldidan sinf testi: ustoz biriktirgan testdan o'tmagan o'quvchi o'yinga kira olmaydi.
   Ustozlar va mehmonlar tekshirilmaydi. Supabase'da jadval bo'lmasa — hech narsa yopilmaydi. */
(() => {
  "use strict";
  const T = window.SofiTests;
  if (!T) return;
  const SEL = "[data-start],[data-mm-start],[data-zakovat],[data-cs],[data-sh],[data-fm],[data-ar],[data-kl],[data-sn],[data-lb]";
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const TTL = 60000;
  let cache = { key: null, at: 0, list: [] };
  let bypass = false;

  const st = document.createElement("style");
  st.textContent = `
    .tg-ban{display:flex;align-items:center;gap:14px;margin:0 0 18px;padding:16px 18px;border-radius:22px;border:1px solid rgba(253,224,71,.6);
      background:radial-gradient(circle at 0% 50%,rgba(253,224,71,.22),transparent 55%),linear-gradient(135deg,#1d1a05,#03100b);color:#fff;animation:tgP 2.4s ease-out infinite}
    @keyframes tgP{0%{box-shadow:0 0 0 0 rgba(253,224,71,.45)}100%{box-shadow:0 0 0 14px rgba(253,224,71,0)}}
    .tg-ban .i{font-size:38px}.tg-ban>div{flex:1;display:grid;gap:3px;min-width:0}.tg-ban small{color:#b1c7bc}
    .tg-ban a{padding:11px 15px;border-radius:14px;background:#fde047;color:#1a1205;font-weight:900;white-space:nowrap}
    .tg-ov{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;padding:14px;background:rgba(0,0,0,.72);backdrop-filter:blur(6px)}
    .tg-card{position:relative;width:min(520px,100%);max-height:calc(100vh - 28px);overflow:auto;padding:24px;border-radius:24px;text-align:center;
      background:linear-gradient(170deg,#1f1c06,#04140c);border:1px solid rgba(253,224,71,.5);color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:tgIn .4s cubic-bezier(.2,1.5,.4,1)}
    @keyframes tgIn{from{opacity:0;transform:scale(.85)}}
    .tg-card .big{font-size:58px;line-height:1}.tg-card h2{margin:8px 0 6px}.tg-card p{margin:0 0 14px;color:#cbd9d2;line-height:1.55}
    .tg-t{display:grid;gap:4px;margin:8px 0;padding:12px;border-radius:16px;background:rgba(255,255,255,.05);text-align:left}
    .tg-t small{color:#b1c7bc}.tg-t a{justify-self:start;margin-top:6px;padding:10px 14px;border-radius:12px;background:linear-gradient(140deg,#00f59b,#07984b);color:#02130c;font-weight:900}
    .tg-x{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:16px;cursor:pointer}
    @media(max-width:640px){.tg-ban{flex-wrap:wrap}.tg-ban a{width:100%;text-align:center}}`;
  document.head.append(st);

  function who() {
    const s = window.SofiGames && window.SofiGames.session;
    if (s && s.name) return { name: s.name, cls: s.cls, role: s.role };
    const m = window.SofiAuth && window.SofiAuth.me();
    return m && m.name ? { name: m.name, cls: m.cls, role: m.role || "student" } : null;
  }
  const exempt = (w) => !w || w.role === "teacher" || w.role === "guest" || /^Mehmon/.test(w.cls || "");

  async function pending(w, fresh) {
    const key = w.name + "|" + w.cls;
    if (!fresh && cache.key === key && Date.now() - cache.at < TTL) return cache.list;
    let list = [];
    try { list = await T.pending(w.name, w.cls); } catch (e) { list = []; }
    cache = { key, at: Date.now(), list };
    banner(w, list);
    return list;
  }

  const testCard = (t) => `<div class="tg-t"><b>📝 ${esc(t.title)}</b><small>⏱ ${t.minutes} daqiqa · 🎯 o‘tish bali ${t.pass_pct}%${t.teacher ? " · 👨‍🏫 " + esc(t.teacher) : ""}</small>
    <a href="amaliy.html#test/${t.id}">Testni boshlash →</a></div>`;

  function showGate(list) {
    const ov = document.createElement("div");
    ov.className = "tg-ov";
    ov.innerHTML = `<div class="tg-card" role="dialog" aria-modal="true"><button class="tg-x" aria-label="Yopish">✕</button>
      <div class="big">🔒</div><h2>Avval testdan o‘ting!</h2>
      <p>Ustozingiz yangi mavzu bo‘yicha test berdi. Testdan o‘tganingizdan keyin barcha o‘yinlar ochiladi.</p>
      ${list.map(testCard).join("")}</div>`;
    document.body.append(ov);
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest(".tg-x")) ov.remove(); });
  }

  function banner(w, list) {
    let el = document.getElementById("tgBanner");
    if (!list.length || exempt(w)) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "tgBanner";
      el.className = "tg-ban";
      const hero = document.querySelector(".g-hero");
      if (hero) hero.after(el); else return;
    }
    const t = list[0];
    el.innerHTML = `<span class="i">📝</span><div><b>${esc(w.name.split(" ")[1] || w.name)}, sizga test berildi: ${esc(t.title)}</b>
      <small>⏱ ${t.minutes} daqiqa · o‘tish bali ${t.pass_pct}% · testdan o‘tgach o‘yinlar ochiladi${list.length > 1 ? ` · yana ${list.length - 1} ta test` : ""}</small></div>
      <a href="amaliy.html#test/${t.id}">Testni boshlash →</a>`;
  }

  function redo(b) { bypass = true; try { b.click(); } finally { bypass = false; } }

  window.addEventListener("click", async (e) => {
    if (bypass) return;
    const b = e.target.closest(SEL);
    if (!b) return;
    const v = b.dataset.cs || b.dataset.sh || b.dataset.fm || b.dataset.ar || b.dataset.kl || b.dataset.sn;
    if (v === "rating") return;
    let w = who();
    if (w && exempt(w)) return;
    if (w && cache.key === w.name + "|" + w.cls && Date.now() - cache.at < TTL && !cache.list.length) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!w) {
      const ok = window.SofiGames && (await window.SofiGames.api.askName());
      if (!ok) return;
      w = who();
      if (!w || exempt(w)) return redo(b);
    }
    const list = await pending(w, true);
    if (!list.length) return redo(b);
    showGate(list);
  }, true);

  // Ism tanlangani yoki almashganini kuzatib, bannerni yangilab turamiz.
  let lastKey = null;
  setInterval(() => {
    const w = who();
    const key = w ? w.name + "|" + w.cls : null;
    if (key === lastKey) return;
    lastKey = key;
    if (!w || exempt(w)) { banner(w, []); return; }
    pending(w, true);
  }, 1500);
  document.addEventListener("visibilitychange", () => { const w = who(); if (!document.hidden && w && !exempt(w)) pending(w, true); });
})();
