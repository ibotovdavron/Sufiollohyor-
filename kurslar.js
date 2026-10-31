/* Kurslar sahifasi: kurs kartalari, jadval, keyingi dars, abakus va Telegram anketa. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const C = D.courses || [];
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const DAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const WEEK = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
  const mins = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const dur = (l) => { const d = mins(l.to) - mins(l.from); return d % 60 ? `${Math.floor(d / 60) ? Math.floor(d / 60) + " soat " : ""}${d % 60} daqiqa` : `${d / 60} soat`; };
  const byId = (id) => C.find((c) => c.id === id) || C[0];
  const target = (c) => c.telegram
    ? { url: `https://t.me/${c.telegram}`, label: "@" + c.telegram }
    : { url: `https://t.me/${c.phone}`, label: c.phone.replace(/^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5") };

  // Yulduzli osmon
  const sky = $("#ksSky");
  if (sky) sky.innerHTML = Array.from({ length: 26 }, (_, i) => {
    const sym = ["+", "÷", "×", "√", "π", "А", "Б", "∑", "%", "✦"][i % 10];
    return `<i style="left:${(i * 37) % 100}%;top:${(i * 53) % 100}%;--d:${(i % 7) * .6}s;--s:${.7 + (i % 4) * .25}">${sym}</i>`;
  }).join("");

  // Raqamlarni sanash animatsiyasi
  const countUp = (el) => {
    const to = Number(el.dataset.count), pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      el.textContent = pre + v + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (e.target.dataset.count) countUp(e.target); else e.target.classList.add("in");
  }), { threshold: .2 }) : null;
  const watch = (el) => io ? io.observe(el) : (el.dataset.count ? countUp(el) : el.classList.add("in"));

  // Kurs kartalari
  $("#ksCards").innerHTML = C.map((c, i) => {
    const t = target(c);
    return `
    <article class="ks-card" style="--c:${c.color};--d:${i * .12}s">
      <div class="ks-card-glow"></div>
      <div class="ks-card-top">
        <span class="ks-card-icon">${c.icon}</span>
        <span class="ks-tag">${esc(c.tag)}</span>
      </div>
      <h3>${esc(c.name)}</h3>
      <span class="ks-grades">👦 ${esc(c.grades)}</span>
      <p>${esc(c.about)}</p>
      <ul>${c.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="ks-times">${c.lessons.length
        ? c.lessons.map((l) => `<span><b>${esc(l.day)}</b>${l.from}–${l.to}</span>`).join("")
        : `<span class="soon"><b>Vaqti</b>anketa orqali kelishiladi</span>`}</div>
      <div class="ks-card-foot">
        <div class="ks-price">${c.price ? `<b>${money(c.price)}</b><small>so‘m / oy</small>` : `<b class="ask">Narxini</b><small>so‘rab biling</small>`}</div>
        <button class="ks-btn" type="button" data-apply="${c.id}">📝 Anketa</button>
      </div>
      <small class="ks-to">✈️ Anketa ${esc(t.label)} ga boradi</small>
    </article>`;
  }).join("");
  document.querySelectorAll(".ks-card, .ks-why > div, .ks-steps li, .ks-stats b, .ks-week .ks-day").forEach(watch);

  // Haftalik jadval
  const all = C.flatMap((c) => c.lessons.map((l) => ({ ...l, c })));
  $("#ksWeek").innerHTML = WEEK.map((d) => {
    const ls = all.filter((l) => l.day === d).sort((a, b) => mins(a.from) - mins(b.from));
    const today = DAYS[new Date().getDay()] === d;
    return `<div class="ks-day ${ls.length ? "has" : "off"} ${today ? "today" : ""}">
      <div class="ks-day-name">${esc(d)}${today ? "<em>bugun</em>" : ""}</div>
      ${ls.length ? ls.map((l) => `
        <div class="ks-slot" style="--c:${l.c.color}">
          <span>${l.c.icon}</span>
          <div><b>${esc(l.c.name)}</b><small>${l.from} – ${l.to} · ${dur(l)}</small></div>
        </div>`).join("") : `<div class="ks-rest">Dam olish 🌿</div>`}
    </div>`;
  }).join("");
  document.querySelectorAll(".ks-week .ks-day").forEach(watch);

  // Eng yaqin dars va teskari sanoq
  const nextLesson = () => {
    const now = new Date();
    let best = null;
    all.forEach((l) => {
      const dow = DAYS.indexOf(l.day);
      for (let add = 0; add <= 7; add++) {
        const d = new Date(now);
        d.setDate(now.getDate() + add);
        if (d.getDay() !== dow) continue;
        const [h, m] = l.from.split(":").map(Number);
        const [eh, em] = l.to.split(":").map(Number);
        d.setHours(h, m, 0, 0);
        const end = new Date(d); end.setHours(eh, em, 0, 0);
        if (end <= now) continue;
        if (!best || d < best.at) best = { at: d, end, l };
        break;
      }
    });
    return best;
  };
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const n = nextLesson();
    if (!n) { $("#ksNext").hidden = true; return; }
    const same = all.filter((l) => l.day === n.l.day && l.from === n.l.from).map((l) => `${l.c.icon} ${esc(l.c.name)}`).join(" · ");
    $("#ksNextWhen").innerHTML = `<b>${same}</b><span>${esc(n.l.day)}, ${n.l.from} – ${n.l.to}</span>`;
    const ms = n.at - new Date();
    if (ms <= 0) { $("#ksCount").innerHTML = `<div class="live">🔴 Dars hozir davom etmoqda</div>`; return; }
    const s = Math.floor(ms / 1000);
    const parts = [[Math.floor(s / 86400), "kun"], [Math.floor(s / 3600) % 24, "soat"], [Math.floor(s / 60) % 60, "daqiqa"], [s % 60, "soniya"]];
    $("#ksCount").innerHTML = parts.map(([v, u]) => `<div><b>${pad(v)}</b><small>${u}</small></div>`).join("");
  };
  tick(); setInterval(tick, 1000);

  // Hero narxini "sanash"
  const pc = $("#ksPriceCount");
  if (pc) {
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1600); pc.textContent = money(Math.round(100000 * (1 - Math.pow(1 - k, 4)) / 1000) * 1000); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // Abakus (soroban): har ustunda 1 ta "5" tosh va 4 ta "1" tosh
  const ab = $("#ksAbacus"), abNum = $("#ksAbacusNum");
  const COLS = 4;
  const drawAbacus = (n) => {
    const digits = String(n).padStart(COLS, "0").split("").map(Number);
    ab.innerHTML = `<div class="ks-bar"></div>` + digits.map((d) => {
      const five = d >= 5, ones = d % 5;
      return `<div class="ks-rod">
        <i class="bead top ${five ? "on" : ""}"></i>
        ${[0, 1, 2, 3].map((k) => `<i class="bead low ${k < ones ? "on" : ""}" style="--k:${k}"></i>`).join("")}
      </div>`;
    }).join("");
    abNum.textContent = n;
  };
  if (ab) {
    let shown = 0;
    drawAbacus(0);
    setInterval(() => { shown = Math.floor(Math.random() * 9999); drawAbacus(shown); }, 2600);
  }

  // Mini mashq
  let qa = 0;
  const newQ = () => {
    const a = 10 + Math.floor(Math.random() * 90), b = 10 + Math.floor(Math.random() * 90);
    qa = a + b; $("#ksQuizQ").textContent = `${a} + ${b} =`; $("#ksQuizA").value = "";
  };
  if ($("#ksQuizQ")) {
    newQ();
    let started = Date.now();
    const check = () => {
      const v = Number($("#ksQuizA").value.trim());
      const res = $("#ksQuizRes");
      if (v === qa) {
        const sec = ((Date.now() - started) / 1000).toFixed(1);
        res.textContent = `✅ To‘g‘ri! ${sec} soniya. Mental arifmetika bilan bundan ham tez bo‘ladi!`;
        res.className = "ok";
        setTimeout(() => { newQ(); started = Date.now(); }, 1600);
      } else { res.textContent = "❌ Yana urinib ko‘ring"; res.className = "bad"; }
    };
    $("#ksQuizBtn").addEventListener("click", check);
    $("#ksQuizA").addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
  }

  // Savol-javob
  const faq = [
    ["Kurslar narxi qancha?", "Matematika (repetitor) va Ona tili — har biri oyiga 100 000 so‘m. Mental arifmetika narxini anketa yuborib yoki qo‘ng‘iroq qilib bilib oling."],
    ["Darslar qachon bo‘ladi?", "Matematika: seshanba 09:30–10:30, payshanba 09:30–11:00, yakshanba 10:00–12:00. Ona tili: yakshanba 10:00–12:00."],
    ["Mental arifmetikaga kimlar qabul qilinadi?", "5-sinfdan 7-sinfgacha bo‘lgan o‘quvchilar. Oldindan tayyorgarlik shart emas — noldan boshlaymiz."],
    ["Anketa qanday yuboriladi?", "“Anketa” tugmasini bosib ma’lumotlarni yozasiz. Telegram anketa yozilgan holda ochiladi — siz faqat “Yuborish”ni bosasiz. Matematika va Mental arifmetika anketasi @ibotov_davron ga, Ona tili anketasi +998 93 221 26 04 ga boradi."],
    ["Bir vaqtda ikkita kursga yozilsa bo‘ladimi?", "Ha. Yakshanba kuni Matematika va Ona tili bir vaqtda bo‘lgani uchun guruhni ustoz bilan kelishib olasiz."],
    ["Markaz qayerda?", `${D.address || "Oltinsoy tumani, 68-maktab binosi"}.`]
  ];
  $("#ksFaq").innerHTML = faq.map(([q, a], i) => `
    <details class="ks-q" ${i === 0 ? "open" : ""}><summary>${esc(q)}<span>+</span></summary><p>${esc(a)}</p></details>`).join("");

  // Anketa oynasi
  const modal = $("#ksModal"), form = $("#ksForm"), sel = $("#ksCourse"), cls = $("#ksCls");
  sel.innerHTML = C.map((c) => `<option value="${c.id}">${c.icon} ${esc(c.name)}${c.price ? ` — ${money(c.price)} so‘m/oy` : ""}</option>`).join("");
  const setClasses = (c) => {
    const [a, b] = (c.grades.match(/\d+/g) || [5, 11]).map(Number);
    const keep = cls.value;
    cls.innerHTML = Array.from({ length: b - a + 1 }, (_, i) => `<option>${a + i}-sinf</option>`).join("");
    if ([...cls.options].some((o) => o.value === keep)) cls.value = keep;
  };
  const text = () => {
    const f = new FormData(form), c = byId(f.get("course"));
    const v = (k) => String(f.get(k) || "").trim() || "—";
    const when = c.lessons.length ? c.lessons.map((l) => `${l.day} ${l.from}–${l.to}`).join(", ") : "kelishiladi";
    return `📝 KURSGA ANKETA\n` +
      `📚 Kurs: ${c.name}${c.price ? ` (${money(c.price)} so‘m/oy)` : ""}\n` +
      `👦 O‘quvchi: ${v("student")}, ${f.get("cls")}\n` +
      `👤 Ota-ona: ${v("parent")}\n📞 Telefon: ${v("phone")}\n` +
      `🗓️ Dars vaqti: ${when}\n💬 Izoh: ${v("note")}\n` +
      `— sufiollohyor.uz saytidan`;
  };
  const refresh = () => {
    const c = byId(sel.value), t = target(c);
    $("#ksFormIcon").textContent = c.icon;
    $("#ksFormTitle").textContent = `${c.name} — anketa`;
    $("#ksFormTo").innerHTML = `Anketa <b>${esc(t.label)}</b> Telegramiga yuboriladi`;
    modal.querySelector(".ks-sheet").style.setProperty("--c", c.color);
    setClasses(c);
    $("#ksPreview").textContent = text();
  };
  const open = (id) => {
    sel.value = byId(id).id;
    $("#ksErr").textContent = "";
    refresh();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => form.querySelector('[name="student"]').focus({ preventScroll: true }), 250);
  };
  const close = () => { modal.hidden = true; document.body.style.overflow = ""; };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-apply]");
    if (b) { e.preventDefault(); open(b.dataset.apply); }
    if (e.target === modal || e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  form.addEventListener("input", refresh);
  form.addEventListener("change", refresh);

  const toast = (m) => { const t = $("#ksToast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2600); };
  const valid = () => {
    const f = new FormData(form);
    if (!String(f.get("student") || "").trim() || String(f.get("phone") || "").replace(/\D/g, "").length < 9) {
      $("#ksErr").textContent = "Iltimos, o‘quvchi ismi va telefon raqamini to‘liq yozing.";
      return false;
    }
    $("#ksErr").textContent = "";
    return true;
  };
  const copy = async (msg) => {
    try { await navigator.clipboard.writeText(msg); return true; } catch { return false; }
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valid()) return;
    const c = byId(sel.value), t = target(c), msg = text();
    await copy(msg);
    window.open(`${t.url}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    toast("✈️ Telegram ochildi — “Yuborish”ni bosing. Anketa nusxalandi ham.");
  });
  $("#ksCopy").addEventListener("click", async () => {
    if (!valid()) return;
    toast(await copy(text()) ? "📋 Anketa nusxalandi — Telegramga joylashtiring" : "Nusxalab bo‘lmadi, matnni qo‘lda belgilang");
  });

  if (location.hash.startsWith("#anketa")) open(location.hash.split("-")[1] || "matematika");
})();
