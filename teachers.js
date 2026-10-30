/* Ustozlar — faxriylar zali. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const isPending = (t) => /^Ustoz \d+$/.test(t.name);
  const teachers = (D.teachers || []);
  const ready = teachers.filter((t) => !isPending(t));
  const pending = teachers.filter(isPending);
  const initials = (n) => n.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const SUBJ = {
    "Matematika": ["#fbbf24", "∑"], "Ona tili": ["#f472b6", "Aa"], "Ingliz tili": ["#60a5fa", "En"],
    "Fizika": ["#a78bfa", "⚛"], "Kimyo": ["#34d399", "⚗"], "Biologiya": ["#4ade80", "🌿"]
  };
  const tone = (s) => (SUBJ[s] || ["#fbbf24", "★"]);

  function portrait(t, big = false) {
    const [c] = tone(t.subject);
    return `
      <div class="hl-portrait ${big ? "big" : ""}" style="--c:${c}">
        <span class="hl-ring"></span>
        ${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.name)}" loading="lazy">` : `<span class="hl-mono">${esc(initials(t.name))}</span>`}
        <span class="hl-crest" title="${esc(t.subject)}">${esc(t.icon || tone(t.subject)[1])}</span>
      </div>`;
  }

  function card(t, i) {
    const [c] = tone(t.subject);
    const ach = Array.isArray(t.achievements) ? t.achievements : [];
    return `
      <article class="hl-card" style="--c:${c};--d:${i * 120}ms" data-i="${teachers.indexOf(t)}" tabindex="0">
        <span class="hl-shine" aria-hidden="true"></span>
        <span class="hl-num">${String(i + 1).padStart(2, "0")}</span>
        ${portrait(t)}
        <span class="hl-subject">${esc(t.subject)}</span>
        <h3>${esc(t.name)}</h3>
        <p class="hl-title">${esc(t.title || t.subject + " ustozi")}</p>
        ${ach.length ? `<div class="hl-badges">${ach.map((a) => `<span>🏅 ${esc(a)}</span>`).join("")}</div>` : ""}
        ${t.experience ? `<p class="hl-exp">⏳ ${esc(t.experience)} tajriba</p>` : ""}
        ${t.quote ? `<p class="hl-q">“${esc(t.quote)}”</p>` : ""}
        <button class="hl-more" type="button">Profilni ko‘rish →</button>
      </article>`;
  }

  function pendingCard(t, i) {
    return `
      <article class="hl-card soon" style="--c:#64748b;--d:${(ready.length + i) * 120}ms">
        <div class="hl-portrait"><span class="hl-ring"></span><span class="hl-mono sil">👤</span><span class="hl-crest">${esc(t.icon || "🎓")}</span></div>
        <span class="hl-subject">${esc(t.subject)}</span>
        <h3>Tez orada tanishtiramiz</h3>
        <p class="hl-title">Jamoamizning yana bir ustozi</p>
      </article>`;
  }

  function render() {
    $("#hallGrid").innerHTML = ready.map(card).join("") + pending.map(pendingCard).join("");
    const subjects = new Set(teachers.map((t) => t.subject).filter((s) => !/keyin/.test(s)));
    $("#hlStats").innerHTML = [
      [teachers.length, "ustoz"], [subjects.size, "fan"], [(D.students || []).length, "shogird"]
    ].map(([n, l]) => `<div><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
    document.querySelectorAll("[data-n]").forEach((b) => {
      const to = Number(b.dataset.n), t0 = performance.now();
      const tick = (now) => { const p = Math.min(1, (now - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    const dust = $(".hl-dust");
    for (let i = 0; i < 30; i++) {
      const e = document.createElement("i");
      e.style.left = Math.random() * 100 + "%";
      e.style.top = Math.random() * 100 + "%";
      e.style.animationDelay = -Math.random() * 8 + "s";
      e.style.animationDuration = 5 + Math.random() * 6 + "s";
      dust.append(e);
    }
  }

  // Profil oynasi
  function openProfile(i) {
    const t = teachers[i];
    const ach = Array.isArray(t.achievements) ? t.achievements : [];
    const m = $("#hlModal");
    m.innerHTML = `
      <div class="hl-sheet" role="dialog" aria-label="${esc(t.name)}" style="--c:${tone(t.subject)[0]}">
        <button class="hl-x" data-close aria-label="Yopish">✕</button>
        ${portrait(t, true)}
        <span class="hl-subject">${esc(t.subject)}</span>
        <h2>${esc(t.name)}</h2>
        <p class="hl-title">${esc(t.title || t.subject + " ustozi")}</p>
        <div class="hl-info">
          <div><span>📚</span><b>Fan</b><small>${esc(t.subject)}</small></div>
          ${t.experience ? `<div><span>⏳</span><b>Tajriba</b><small>${esc(t.experience)}</small></div>` : ""}
          ${ach.length ? `<div><span>🏅</span><b>Yutuqlar</b><small>${ach.map(esc).join(", ")}</small></div>` : ""}
        </div>
        ${t.bio ? `<p class="hl-bio">${esc(t.bio)}</p>` : ""}
        ${t.quote ? `<blockquote class="hl-q big">“${esc(t.quote)}”</blockquote>` : ""}
        <a class="hl-cta" data-telegram href="${esc(D.telegram || "https://t.me/sufi_ollohyor_uquv_markaz")}" target="_blank" rel="noopener noreferrer">✈️ ${esc(t.subject)} darsiga yozilish</a>
      </div>`;
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add("open"));
    document.body.style.overflow = "hidden";
  }
  function close() {
    const m = $("#hlModal");
    m.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { if (!m.classList.contains("open")) { m.hidden = true; m.innerHTML = ""; } }, 300);
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest(".hl-card[data-i]");
    if (c) { openProfile(Number(c.dataset.i)); return; }
    if (e.target.closest("[data-close]") || e.target.id === "hlModal") close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Enter" && e.target.matches(".hl-card[data-i]")) openProfile(Number(e.target.dataset.i));
  });

  // Sichqoncha bilan 3D egilish
  if (window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("pointermove", (e) => {
      const c = e.target.closest(".hl-card");
      document.querySelectorAll(".hl-card.tilt").forEach((x) => { if (x !== c) { x.classList.remove("tilt"); x.style.transform = ""; } });
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.classList.add("tilt");
      c.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      c.style.setProperty("--mx", (x + 0.5) * 100 + "%");
      c.style.setProperty("--my", (y + 0.5) * 100 + "%");
    });
  }

  render();
})();
