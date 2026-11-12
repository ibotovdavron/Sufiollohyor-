/* Jadidlar sahifasi: kartalar, to'liq ma'lumot oynasi (#kalit bilan to'g'ridan-to'g'ri ochish mumkin). */
(() => {
  "use strict";
  const L = window.JADIDLAR || [], I = window.JADID_INTRO || {};
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const initials = (n) => n.split(" ").filter((w) => /^\p{Lu}/u.test(w)).slice(0, 2).map((w) => w[0]).join("");
  const photo = (p, cls) => `<div class="${cls}"><img src="assets/jadidlar/${p.key}.jpg" alt="${esc(p.name)} surati" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()"><span class="jd-ini">${esc(initials(p.name))}</span></div>`;

  document.getElementById("jdWhat").textContent = I.what || "";
  document.getElementById("jdTime").innerHTML = (I.timeline || []).map(([y, t]) => `<li><b>${esc(y)}</b><span>${esc(t)}</span></li>`).join("");

  const grid = document.getElementById("jdGrid");
  grid.innerHTML = L.map((p, i) => `<button type="button" class="jd-card" data-i="${i}" style="--d:${i * 60}ms">
      ${photo(p, "jd-ph")}
      <b>${esc(p.name)}</b><small>${esc(p.years)}</small></button>`).join("");

  const modal = document.getElementById("jdModal");
  let cur = -1, lastFocus = null;
  function open(i, push = true) {
    const p = L[i]; if (!p) return;
    cur = i; lastFocus = lastFocus || document.activeElement;
    modal.innerHTML = `<div class="jd-sheet" role="dialog" aria-modal="true" aria-labelledby="jdT">
        <button type="button" class="jd-x" data-x aria-label="Yopish">✕</button>
        <div class="jd-top">${photo(p, "jd-big")}
          <div><span class="jd-kick">${esc(p.place)}</span><h2 id="jdT">${esc(p.name)}</h2><div class="jd-yr">${esc(p.years)}</div><p class="jd-role">${esc(p.role)}</p></div></div>
        ${p.quote ? `<blockquote class="jd-q">“${esc(p.quote)}”</blockquote>` : ""}
        <h3>📜 Hayot yo‘li</h3>${p.life.map((t) => `<p>${esc(t)}</p>`).join("")}
        <h3>📚 Asosiy asarlari va ishlari</h3><ul class="jd-works">${p.works.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
        <div class="jd-death"><h3>🕯 Taqdiri</h3><p>${esc(p.death)}</p></div>
        <nav class="jd-nav"><button type="button" data-go="-1">← ${esc(L[(i - 1 + L.length) % L.length].name)}</button><button type="button" data-go="1">${esc(L[(i + 1) % L.length].name)} →</button></nav>
      </div>`;
    modal.hidden = false; document.body.classList.add("jd-lock");
    modal.querySelector(".jd-sheet").scrollTop = 0;
    modal.querySelector(".jd-x").focus({ preventScroll: true });
    if (push) history.replaceState(null, "", "#" + p.key);
  }
  function close() {
    modal.hidden = true; modal.innerHTML = ""; document.body.classList.remove("jd-lock"); cur = -1;
    history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus) { lastFocus.focus({ preventScroll: true }); lastFocus = null; }
  }
  grid.addEventListener("click", (e) => { const c = e.target.closest(".jd-card"); if (c) { lastFocus = c; open(+c.dataset.i); } });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-x]")) return close();
    const g = e.target.closest("[data-go]"); if (g) open((cur + Number(g.dataset.go) + L.length) % L.length);
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") open((cur + 1) % L.length);
    if (e.key === "ArrowLeft") open((cur - 1 + L.length) % L.length);
  });
  const fromHash = () => { const k = location.hash.slice(1); const i = L.findIndex((p) => p.key === k); if (i >= 0) open(i, false); };
  fromHash();
  addEventListener("hashchange", fromHash);
})();
