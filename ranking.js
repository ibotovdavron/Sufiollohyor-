/* Reyting: chempion kubok ko'taradi, qolganlar pastdan ko'tariladi. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (v) => String(v || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("uz");
  const initials = (n) => n.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CLS = { "5-sinf": "#22c55e", "6-sinf": "#38bdf8", "8-sinf": "#f59e0b" };

  let rows = [];
  let cls = "all";
  let stageShown = false;

  function build(bonus = {}) {
    rows = (D.students || []).map((s) => ({ name: s.name, cls: s.group, stars: (Number(s.stars) || 0) + (bonus[norm(s.name)] || 0) }))
      .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name, "uz"));
    // Teng yulduzda bir xil o'rin
    rows.forEach((r, i) => { r.rank = i && r.stars === rows[i - 1].stars ? rows[i - 1].rank : i + 1; });
  }

  async function loadBonus() {
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (!window.supabase || !cfg.SUPABASE_URL) return null;
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
      return ok ? bonus : null;
    } catch (e) {
      console.warn("Reyting yuklash xatosi:", e);
      return null;
    }
  }

  function countUp(el, to, ms = 1600, delay = 0) {
    if (reduce) { el.textContent = to; return; }
    setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }

  // ---------- Shohsupa ----------
  function renderStage() {
    const top = rows.slice(0, 3);
    const order = [1, 0, 2];
    $("#rkPodium").innerHTML = order.filter((i) => top[i]).map((i) => {
      const s = top[i];
      const place = i + 1;
      return `
        <div class="rk-spot s${place}" style="--c:${CLS[s.cls] || "#a78bfa"}">
          ${place === 1 ? `
            <div class="rk-champ">
              <span class="rk-rays"></span>
              <span class="rk-cup">🏆</span>
              <span class="rk-arms"><i>🙌</i></span>
            </div>` : `<span class="rk-medal">${["🥇", "🥈", "🥉"][Math.min(s.rank, 3) - 1]}</span>`}
          <div class="rk-ava">${place === 1 ? '<span class="rk-crown">👑</span>' : ""}<b>${esc(initials(s.name))}</b></div>
          <b class="rk-name">${esc(s.name)}</b>
          <small class="rk-cls">${esc(s.cls)}</small>
          <div class="rk-block"><span class="rk-stars">⭐ <b data-to="${s.stars}">0</b></span><em>${s.rank}</em></div>
        </div>`;
    }).join("");
    const ties = rows.filter((r) => r.rank === 1).length;
    $("#rkTie").textContent = ties > 1 ? `🤝 ${ties} nafar o‘quvchi ${rows[0].stars} ⭐ bilan birinchi o‘rinni bo‘lishmoqda — teng ochkoda alifbo tartibida ko‘rsatilgan.` : "";
    if (!stageShown) {
      stageShown = true;
      requestAnimationFrame(() => $(".rk-stage").classList.add("go"));
      setTimeout(confetti, reduce ? 0 : 1900);
    } else $(".rk-stage").classList.add("go");
    document.querySelectorAll(".rk-podium [data-to]").forEach((b, i) => countUp(b, Number(b.dataset.to), 1400, 700 + i * 200));
  }

  function confetti() {
    if (reduce) return;
    const box = $("#rkConfetti");
    const colors = ["#fde047", "#f59e0b", "#fff7d6", "#22c55e", "#38bdf8", "#f472b6"];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i");
      c.style.left = 50 + (Math.random() - 0.5) * 30 + "%";
      c.style.background = colors[i % colors.length];
      c.style.setProperty("--x", (Math.random() - 0.5) * 700 + "px");
      c.style.setProperty("--r", Math.random() * 720 + "deg");
      c.style.animationDelay = Math.random() * 0.4 + "s";
      box.append(c);
    }
    setTimeout(() => (box.innerHTML = ""), 4500);
  }

  // ---------- Ro'yxat ----------
  function renderTabs() {
    const classes = [...new Set(rows.map((r) => r.cls))];
    $("#rkTabs").innerHTML = [["all", "Hammasi"], ...classes.map((c) => [c, c])].map(([id, t]) =>
      `<button class="${cls === id ? "on" : ""}" data-cls="${esc(id)}">${esc(t)}</button>`).join("");
  }
  function renderList() {
    const q = norm($("#rkSearch").value);
    const max = Math.max(1, rows[0] ? rows[0].stars : 1);
    const list = rows.filter((r) => (cls === "all" || r.cls === cls) && norm(r.name + " " + r.cls).includes(q));
    $("#rkList").innerHTML = list.map((r, i) => `
      <li class="rk-row ${r.rank <= 3 ? "top t" + r.rank : ""}" style="--c:${CLS[r.cls] || "#a78bfa"};--d:${Math.min(i, 20) * 45}ms">
        <span class="rk-rank">${r.rank <= 3 ? ["🥇", "🥈", "🥉"][r.rank - 1] : r.rank}</span>
        <span class="rk-av">${esc(initials(r.name))}</span>
        <span class="rk-who"><b>${esc(r.name)}</b><small>${esc(r.cls)}</small></span>
        <span class="rk-bar"><i style="--w:${(r.stars / max) * 100}%"></i></span>
        <span class="rk-pts">${r.stars}<small>⭐</small></span>
      </li>`).join("") || `<li class="rk-empty">Hech kim topilmadi</li>`;
    // Ekranga chiqqanda pastdan ko'tarilish
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".rk-row").forEach((r) => r.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
    document.querySelectorAll(".rk-row").forEach((r) => io.observe(r));
  }

  function renderRules() {
    $("#rkRules").innerHTML = (D.starRules || []).map((r) => `<div class="rk-rule"><span>${esc(r.title)}</span><b>+${Number(r.stars) || 0} ⭐</b></div>`).join("") +
      `<div class="rk-rule"><span>O‘yinlarda g‘alaba (kuniga 2 tagacha)</span><b>+1 ⭐</b></div>`;
  }

  function setStatus(ok) {
    const el = $("#rkStatus");
    el.className = "rk-status " + (ok ? "ok" : "off");
    el.innerHTML = `<i></i> ${ok ? "Jonli" : "Saqlangan"}`;
    el.title = ok ? "Reyting serverdan yangilandi" : "Server bilan bog‘lanib bo‘lmadi — data.js dagi ma’lumotlar ko‘rsatilmoqda";
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cls]");
    if (b) { cls = b.dataset.cls; renderTabs(); renderList(); }
  });
  $("#rkSearch").addEventListener("input", renderList);

  build();
  renderStage();
  renderTabs();
  renderList();
  renderRules();
  loadBonus().then((bonus) => {
    setStatus(!!bonus);
    if (bonus) { build(bonus); renderStage(); renderList(); }
  });
})();
