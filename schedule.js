/* Matematika 144: haftalik jadval va keyingi darsgacha ortga sanash. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const S = D.schedule || { days: [], slots: [] };
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // JS: 0 — yakshanba
  const WEEK = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
  const SHORT = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const jsDay = (name) => (WEEK.indexOf(name) + 1) % 7;
  const COLORS = { "5-sinf": "#22c55e", "6-sinf": "#38bdf8", "8-sinf": "#f59e0b" };
  const color = (c) => COLORS[c] || "#a78bfa";

  let cls;
  try { cls = localStorage.getItem("sofi_m144_cls"); } catch (e) {}
  if (!S.slots.some((s) => s.cls === cls)) cls = (S.slots[0] || {}).cls;

  // ---------- Suzib yuruvchi belgilar ----------
  const syms = ["π", "∑", "√", "∞", "÷", "×", "=", "∫", "Δ", "x²", "%", "144", "∠", "≈", "φ"];
  const box = $("#mSymbols");
  for (let i = 0; i < 22; i++) {
    const e = document.createElement("i");
    e.textContent = syms[i % syms.length];
    e.style.left = Math.random() * 100 + "%";
    e.style.top = Math.random() * 100 + "%";
    e.style.fontSize = 14 + Math.random() * 26 + "px";
    e.style.animationDelay = -Math.random() * 10 + "s";
    e.style.animationDuration = 8 + Math.random() * 8 + "s";
    box.append(e);
  }

  // ---------- Keyingi dars ----------
  function nextLesson(c) {
    const slot = S.slots.find((s) => s.cls === c);
    if (!slot) return null;
    const [hh, mm] = slot.time.split(":").map(Number);
    const now = new Date();
    let best = null;
    for (let add = 0; add <= 7; add++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + add, hh, mm, 0);
      if (!S.days.some((n) => jsDay(n) === d.getDay())) continue;
      if (d > now) { best = d; break; }
    }
    return best && { date: best, slot };
  }
  function renderPick() {
    $("#clsPick").innerHTML = S.slots.map((s) => `<button role="tab" aria-selected="${s.cls === cls}" class="${s.cls === cls ? "on" : ""}" style="--c:${color(s.cls)}" data-cls="${esc(s.cls)}">${esc(s.cls)}</button>`).join("");
  }
  function tick() {
    const n = nextLesson(cls);
    if (!n) { $("#nextWhen").textContent = "Jadval hali kiritilmagan"; $("#nextCount").innerHTML = ""; return; }
    const diff = n.date - new Date();
    const days = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
    const dayName = WEEK[(n.date.getDay() + 6) % 7];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dd = Math.round((new Date(n.date).setHours(0, 0, 0, 0) - today) / 864e5);
    const rel = dd === 0 ? "Bugun" : dd === 1 ? "Ertaga" : dayName;
    $("#nextWhen").innerHTML = `<span class="m-rel" style="--c:${color(cls)}">${rel}</span><b>${esc(n.slot.time)}</b><small>${esc(cls)} · ${esc(dayName)}</small>`;
    const parts = (days ? [[days, "kun"]] : []).concat([[h, "soat"], [m, "daqiqa"], [s, "soniya"]]);
    $("#nextCount").innerHTML = parts.map(([v, u]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${u}</small></div>`).join("");
    $("#nextCard").classList.toggle("soon", diff < 36e5);
  }

  // ---------- Haftalik jadval ----------
  function renderWeek() {
    const todayIdx = (new Date().getDay() + 6) % 7;
    $("#groupName").textContent = S.group || "";
    $("#week").innerHTML = WEEK.map((d, i) => {
      const on = S.days.includes(d);
      const slots = on ? S.slots.slice().sort((a, b) => a.time.localeCompare(b.time)) : [];
      return `
        <div class="m-day ${on ? "on" : ""} ${i === todayIdx ? "today" : ""}" style="--d:${i * 70}ms">
          <div class="m-day-name"><b>${d}</b><span>${SHORT[i]}</span>${i === todayIdx ? '<em>Bugun</em>' : ""}</div>
          ${on ? slots.map((s) => `
            <div class="m-slot ${s.cls === cls ? "mine" : ""}" style="--c:${color(s.cls)}">
              <time>${esc(s.time)}</time><span>${esc(s.cls)}</span>
            </div>`).join("") : `<div class="m-free">Dars yo‘q</div>`}
        </div>`;
    }).join("");
    $("#note").textContent = S.note ? "⚠️ " + S.note : "";
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cls]");
    if (!b) return;
    cls = b.dataset.cls;
    try { localStorage.setItem("sofi_m144_cls", cls); } catch (err) {}
    renderPick(); renderWeek(); tick();
  });

  renderPick();
  renderWeek();
  tick();
  setInterval(tick, 1000);
})();
