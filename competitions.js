/* Bilimlar arenasi: sinflar jangi, yulduzlar marafoni, shohsupa va musobaqalar. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const norm = (v) => String(v || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("uz");
  const first = (name) => name.split(" ")[1] || name;
  const CLASS_COLORS = { "5-sinf": ["#22c55e", "#14532d"], "6-sinf": ["#3b82f6", "#1e3a8a"], "8-sinf": ["#f97316", "#7c2d12"] };
  const RUNNERS = ["🏃", "🏃‍♀️", "🏃‍♂️"];

  let students = (D.students || []).map((s) => ({ name: s.name, cls: s.group, stars: Number(s.stars) || 0 }));
  let raceCls = "all";

  // ---------- Yulduzlar (reyting bilan bir xil hisob) ----------
  async function loadBonus() {
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!window.supabase || !cfg.SUPABASE_URL) return false;
    try {
      const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
      const bonus = {};
      let ok = false;
      for (const table of ["question_winners", "game_stars"]) {
        const { data, error } = await db.from(table).select("student_name, stars");
        if (error) continue;
        ok = true;
        (data || []).forEach((r) => { const k = norm(r.student_name); bonus[k] = (bonus[k] || 0) + Number(r.stars || 0); });
      }
      if (ok) students = (D.students || []).map((s) => ({ name: s.name, cls: s.group, stars: (Number(s.stars) || 0) + (bonus[norm(s.name)] || 0) }));
      return ok;
    } catch (e) {
      console.warn("Yulduzlarni yuklab bo‘lmadi", e);
      return false;
    }
  }

  // Raqamlarni sanab chiqish
  function countUp(el, to, ms = 1200) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  // Ekranga chiqqanda animatsiyani boshlash
  function onShow(el, fn) {
    if (!("IntersectionObserver" in window)) return fn();
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(); } }, { threshold: 0.25 });
    io.observe(el);
  }

  // ---------- Hero ----------
  function renderHero() {
    const total = students.reduce((s, x) => s + x.stars, 0);
    const classes = new Set(students.map((s) => s.cls)).size;
    $("#heroStats").innerHTML = `
      <div><b data-n="${students.length}">0</b><span>jangchi</span></div>
      <div><b data-n="${classes}">0</b><span>sinf</span></div>
      <div><b data-n="${total}">0</b><span>yulduz yig‘ildi</span></div>
      <div><b data-n="${(D.competitions || []).length}">0</b><span>musobaqa</span></div>`;
    $("#heroStats").querySelectorAll("[data-n]").forEach((b) => countUp(b, Number(b.dataset.n)));
    const sp = $(".ar-sparks");
    if (!sp.children.length) {
      for (let i = 0; i < 26; i++) {
        const e = document.createElement("i");
        e.style.left = Math.random() * 100 + "%";
        e.style.animationDelay = -Math.random() * 6 + "s";
        e.style.animationDuration = 4 + Math.random() * 4 + "s";
        e.style.setProperty("--x", (Math.random() - 0.5) * 80 + "px");
        sp.append(e);
      }
    }
  }

  // ---------- Sinflar jangi ----------
  function renderBattle() {
    const by = {};
    students.forEach((s) => {
      by[s.cls] = by[s.cls] || { cls: s.cls, total: 0, n: 0, best: null };
      const g = by[s.cls];
      g.total += s.stars; g.n++;
      if (!g.best || s.stars > g.best.stars) g.best = s;
    });
    const list = Object.values(by).sort((a, b) => b.total - a.total);
    const max = Math.max(1, ...list.map((g) => g.total));
    const el = $("#battle");
    el.innerHTML = list.map((g, i) => {
      const [c1, c2] = CLASS_COLORS[g.cls] || ["#a855f7", "#4c1d95"];
      return `
        ${i ? '<div class="ar-vs-sm">VS</div>' : ""}
        <div class="ar-team ${i === 0 ? "lead" : ""}" style="--c1:${c1};--c2:${c2}">
          ${i === 0 ? '<span class="ar-crown">👑</span>' : ""}
          <div class="ar-team-top"><b>${esc(g.cls)}</b><span>${g.n} jangchi</span></div>
          <div class="ar-score"><span data-n="${g.total}">0</span> ⭐</div>
          <div class="ar-power"><i data-w="${(g.total / max) * 100}"></i></div>
          <small>O‘rtacha: ${(g.total / g.n).toFixed(1)} ⭐ · Eng kuchlisi: ${esc(first(g.best.name))} (${g.best.stars})</small>
        </div>`;
    }).join("");
    onShow(el, () => {
      el.querySelectorAll("[data-n]").forEach((b) => countUp(b, Number(b.dataset.n), 1500));
      el.querySelectorAll("[data-w]").forEach((b, i) => setTimeout(() => (b.style.width = b.dataset.w + "%"), 100 + i * 150));
    });
  }

  // ---------- Marafon ----------
  function renderRaceFilter() {
    const classes = [...new Set(students.map((s) => s.cls))];
    $("#raceFilter").innerHTML = [["all", "Hammasi"], ...classes.map((c) => [c, c])].map(([id, t]) =>
      `<button class="${raceCls === id ? "on" : ""}" data-race="${esc(id)}">${esc(t)}</button>`).join("");
  }
  function renderRace() {
    const top = students.filter((s) => raceCls === "all" || s.cls === raceCls).sort((a, b) => b.stars - a.stars).slice(0, 10);
    const lead = Math.max(1, top[0] ? top[0].stars : 1);
    const finish = Math.max(10, Math.ceil((lead * 1.15) / 10) * 10);
    $("#raceNote").textContent = `Top ${top.length} · marra: ${finish} ⭐`;
    const el = $("#race");
    el.innerHTML = top.map((s, i) => {
      const [c1] = CLASS_COLORS[s.cls] || ["#a855f7"];
      const pos = Math.min(100, (s.stars / finish) * 100);
      return `
        <div class="ar-lane" style="--c:${c1}">
          <span class="ar-rank">${i + 1}</span>
          <div class="ar-road">
            <div class="ar-trail" data-w="${pos}"></div>
            <div class="ar-runner" data-l="${pos}">
              <span class="ar-tag">${esc(first(s.name))} <b>${s.stars}⭐</b></span>
              <span class="ar-man">${i === 0 ? "🔥" : ""}${RUNNERS[i % 3]}</span>
            </div>
          </div>
          <span class="ar-flag">🏁</span>
        </div>`;
    }).join("") || `<p class="ar-note">Hozircha natija yo‘q</p>`;
    const go = () => el.querySelectorAll(".ar-lane").forEach((lane, i) => setTimeout(() => {
      const r = lane.querySelector(".ar-runner"), t = lane.querySelector(".ar-trail");
      r.style.left = r.dataset.l + "%";
      r.style.transform = `translateX(-${r.dataset.l}%)`;
      t.style.width = t.dataset.w + "%";
      lane.classList.add("go");
    }, 80 * i));
    onShow(el, go);
  }

  // ---------- Shohsupa ----------
  function renderPodium() {
    const top = students.slice().sort((a, b) => b.stars - a.stars).slice(0, 3);
    const order = [1, 0, 2];
    const medals = ["🥇", "🥈", "🥉"];
    const el = $("#podium");
    el.innerHTML = order.filter((i) => top[i]).map((i) => `
      <div class="ar-place p${i + 1}">
        <span class="ar-medal">${medals[i]}</span>
        <span class="ar-ava">${esc(top[i].name[0])}</span>
        <b>${esc(top[i].name)}</b>
        <small>${esc(top[i].cls)}</small>
        <div class="ar-step"><span>${top[i].stars} ⭐</span><em>${i + 1}</em></div>
      </div>`).join("");
    onShow(el, () => el.classList.add("up"));
  }

  // ---------- Musobaqalar ----------
  const GRADS = [["#7c3aed", "#db2777"], ["#dc2626", "#f97316"], ["#0891b2", "#2563eb"], ["#ca8a04", "#16a34a"]];
  function timer(date) {
    const t = new Date(date).getTime() - Date.now();
    if (!date || isNaN(t)) return null;
    if (t <= 0) return "live";
    const d = Math.floor(t / 864e5), hh = Math.floor((t % 864e5) / 36e5), m = Math.floor((t % 36e5) / 6e4), s_ = Math.floor((t % 6e4) / 1e3);
    return [[d, "kun"], [hh, "soat"], [m, "daq"], [s_, "son"]];
  }
  function renderEvents() {
    const rules = D.starRules || [];
    const prize = (n) => (rules.find((r) => r.title.includes(n + "-o‘rin")) || {}).stars;
    $("#events").innerHTML = (D.competitions || []).map((c, i) => {
      const [g1, g2] = GRADS[i % GRADS.length];
      const tm = timer(c.date);
      return `
        <article class="ar-event" style="--g1:${g1};--g2:${g2};--d:${i * 100}ms">
          <div class="ar-ev-top">
            <span class="ar-ev-icon">${esc(c.icon)}</span>
            <span class="ar-ev-status ${tm === "live" ? "live" : ""}">${tm === "live" ? "● JONLI" : esc(c.status || "Tez orada")}</span>
          </div>
          <h3>${esc(c.name)}</h3>
          <div class="ar-ev-meta"><span>${esc(c.type)}</span>${c.format ? `<span>${esc(c.format)}</span>` : ""}</div>
          <p>${esc(c.description)}</p>
          <div class="ar-timer" ${c.date ? `data-date="${esc(c.date)}"` : ""}>
            ${Array.isArray(tm) ? tm.map(([v, u]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${u}</small></div>`).join("") : tm === "live" ? "<em>Musobaqa hozir bo‘lyapti!</em>" : "<em>📅 Sana Telegram kanalida e’lon qilinadi</em>"}
          </div>
          <div class="ar-prizes">
            <span>🥇 +${prize(1) ?? 5}⭐</span><span>🥈 +${prize(2) ?? 3}⭐</span><span>🥉 +${prize(3) ?? 2}⭐</span>
          </div>
          <a class="ar-btn" data-telegram href="https://t.me/sufi_ollohyor_uquv_markaz">⚔️ Qatnashaman</a>
        </article>`;
    }).join("");
  }
  setInterval(() => {
    document.querySelectorAll(".ar-timer[data-date]").forEach((el) => {
      const tm = timer(el.dataset.date);
      if (Array.isArray(tm)) el.innerHTML = tm.map(([v, u]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${u}</small></div>`).join("");
    });
  }, 1000);

  function renderRules() {
    $("#rules").innerHTML = (D.starRules || []).map((r, i) => `
      <div class="ar-rule" style="--d:${i * 60}ms"><span>${esc(r.title)}</span><b>+${Number(r.stars) || 0} ⭐</b></div>`).join("");
  }

  function renderAll() {
    renderHero();
    renderBattle();
    renderRaceFilter();
    renderRace();
    renderPodium();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-race]");
    if (b) { raceCls = b.dataset.race; renderRaceFilter(); renderRace(); }
  });

  renderAll();
  renderEvents();
  renderRules();
  loadBonus().then((ok) => { if (ok) renderAll(); });
})();
