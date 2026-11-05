/* Amaliy darslar sahifasi: sinf → fan → mavzu → dars. Manzil: #5/matematika/mavzu-id */
(() => {
  "use strict";
  const { h, rich, W } = window.AK;
  const DB = window.AMALIY;
  const root = document.getElementById("amaliyApp");
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  const CLASS_ART = {
    "5": ["🔢", "#22c55e"], "6": ["➗", "#3b82f6"], "7": ["🧮", "#f97316"], "8": ["📐", "#a855f7"],
    "9": ["📊", "#14b8a6"], "10": ["🌍", "#0ea5e9"], "11": ["🎓", "#ec4899"],
    "oq": ["📗", "#f5c84c"], "master": ["🏅", "#ef4444"],
  };

  /* ---------- O'qish jarayoni (faqat shu qurilmada) ---------- */
  const DONE_KEY = "sofi_amaliy_done";
  let DONE = {};
  try { DONE = JSON.parse(localStorage.getItem(DONE_KEY) || "{}") || {}; } catch (e) { DONE = {}; }
  const keyOf = (c, s_, t) => `${c.id}/${s_.id}/${t.id}`;
  const isDone = (c, s_, t) => DONE[keyOf(c, s_, t)] != null;
  function markDone(c, s_, t, score) {
    const k = keyOf(c, s_, t);
    DONE[k] = Math.max(DONE[k] ?? 0, score ?? 0);
    try { localStorage.setItem(DONE_KEY, JSON.stringify(DONE)); } catch (e) {}
  }
  const subDone = (c, s_) => s_.topics.filter((t) => isDone(c, s_, t)).length;
  const clsTotals = (c) => c.subjects.reduce((a, s_) => [a[0] + subDone(c, s_), a[1] + s_.topics.length], [0, 0]);

  function crumbs(parts) {
    return `<nav class="am-crumbs">${parts.map(([href, t], i) => i < parts.length - 1 ? `<a href="${href}">${esc(t)}</a><span>›</span>` : `<b>${esc(t)}</b>`).join("")}</nav>`;
  }
  const ring = (done, total, col) => {
    const p = total ? done / total : 0, C = 2 * Math.PI * 16;
    return `<span class="am-ring" style="--c:${col}" title="${done}/${total} o‘rganildi"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16" style="stroke-dasharray:${C};--off:${C * (1 - p)}"/></svg><i>${Math.round(p * 100)}%</i></span>`;
  };
  const bar = (done, total) => `<span class="am-pbar"><i style="--w:${total ? (done / total) * 100 : 0}%"></i></span>`;

  /* ---------- Bosh sahifa foni: suzib yuruvchi belgilar ---------- */
  const SYMBOLS = ["π", "∑", "√x", "x²", "∞", "△", "∫", "%", "⅔", "y=kx+b", "a²+b²", "</>", "{ }", "01", "sin α", "∠", "÷", "≠", "≈", "e", "λ", "🔬", "⚛", "📐"];
  function startSky(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W_ = 0, H_ = 0, mx = 0, my = 0, last = performance.now();
    const items = [];
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W_ = r.width; H_ = r.height;
      canvas.width = W_ * dpr; canvas.height = H_ * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const n = Math.round(Math.min(34, Math.max(14, W_ / 30)));
    for (let i = 0; i < n; i++) {
      const z = 0.35 + Math.random() * 0.65;
      items.push({
        t: SYMBOLS[i % SYMBOLS.length], x: Math.random() * W_, y: Math.random() * H_, z,
        vx: (Math.random() - 0.5) * 10 * z, vy: -(6 + Math.random() * 14) * z,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.6, ph: Math.random() * 6.28,
        hue: [158, 190, 45, 280, 200][i % 5],
      });
    }
    const host = canvas.parentElement;
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
    });
    window.addEventListener("resize", resize);
    let visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
    const frame = (now) => {
      if (!canvas.isConnected) { window.removeEventListener("resize", resize); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (visible && !document.hidden) {
        ctx.clearRect(0, 0, W_, H_);
        for (const it of items) {
          it.x += it.vx * dt; it.y += it.vy * dt; it.r += it.vr * dt; it.ph += dt;
          if (it.y < -40) { it.y = H_ + 30; it.x = Math.random() * W_; }
          if (it.x < -60) it.x = W_ + 40; else if (it.x > W_ + 60) it.x = -40;
          const px = it.x - mx * 40 * it.z, py = it.y - my * 30 * it.z;
          const a = (0.1 + 0.32 * it.z) * (0.75 + 0.25 * Math.sin(it.ph * 1.3));
          ctx.save();
          ctx.translate(px, py); ctx.rotate(Math.sin(it.r) * 0.35);
          ctx.font = `800 ${Math.round(13 + 22 * it.z)}px system-ui, sans-serif`;
          ctx.fillStyle = `hsla(${it.hue}, 95%, 65%, ${a})`;
          ctx.shadowColor = `hsla(${it.hue}, 95%, 60%, ${a})`; ctx.shadowBlur = 14 * it.z;
          ctx.textAlign = "center"; ctx.fillText(it.t, 0, 0);
          ctx.restore();
        }
      }
      requestAnimationFrame(frame);
    };
    if (REDUCED) { frame(performance.now()); visible = false; } else requestAnimationFrame(frame);
  }

  /* ---------- Raqamlarni sanab chiqish ---------- */
  function countUp(el) {
    const to = Number(el.dataset.to) || 0, dur = 1400, t0 = performance.now();
    const fmt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (REDUCED) { el.textContent = fmt(to); return; }
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1 && el.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Almashib turuvchi so'z (yozuv mashinkasi) ---------- */
  function typeWords(el, words) {
    if (REDUCED) return;
    let wi = 0, ci = words[0].length, del = true, wait = 1600;
    const tick = () => {
      if (!el.isConnected) return;
      const w = words[wi];
      if (wait > 0) { wait -= 60; return setTimeout(tick, 60); }
      if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; } }
      else { ci++; if (ci >= words[wi].length) { del = true; wait = 1700; } }
      el.textContent = words[wi].slice(0, Math.max(0, ci)) || " ";
      setTimeout(tick, del ? 45 : 85);
    };
    setTimeout(tick, 60);
  }

  /* ---------- 3D egilish + yorug'lik ---------- */
  function tilt(scope) {
    if (!FINE || REDUCED) return;
    scope.querySelectorAll(".am-card").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
        c.style.setProperty("--ry", (x - 0.5) * 12 + "deg"); c.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
        c.classList.add("tilting");
      });
      c.addEventListener("pointerleave", () => { c.classList.remove("tilting"); c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
    });
  }

  /* ---------- Scroll bilan paydo bo'lish ---------- */
  function reveal(scope) {
    const els = scope.querySelectorAll(".rv");
    if (REDUCED || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((list) => list.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Konfetti ---------- */
  function confetti() {
    if (REDUCED) return;
    const cv = h("canvas", { class: "am-confetti" });
    document.body.append(cv);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W_ = innerWidth, H_ = innerHeight;
    cv.width = W_ * dpr; cv.height = H_ * dpr;
    const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    const cols = ["#00f59b", "#fde047", "#38bdf8", "#f472b6", "#a78bfa", "#fb923c"];
    const P = Array.from({ length: 150 }, (_, i) => ({
      x: W_ / 2 + (Math.random() - 0.5) * 80, y: H_ * 0.62,
      vx: (Math.random() - 0.5) * 900, vy: -(450 + Math.random() * 650),
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 14, s: 5 + Math.random() * 7, c: cols[i % cols.length],
    }));
    const t0 = performance.now(); let last = t0;
    const step = (now) => {
      const dt = Math.min(0.04, (now - last) / 1000); last = now;
      ctx.clearRect(0, 0, W_, H_);
      for (const p of P) {
        p.vy += 900 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * (0.4 + Math.abs(Math.sin(p.r)))); ctx.restore();
      }
      if (now - t0 < 3200) requestAnimationFrame(step); else cv.remove();
    };
    requestAnimationFrame(step);
  }

  /* ================= Ko'rinishlar ================= */
  function lastTopic() {
    let hsh = "";
    try { hsh = localStorage.getItem("sofi_amaliy_last") || ""; } catch (e) {}
    const [c, sId, tId] = decodeURIComponent(hsh.slice(1)).split("/");
    const cls = DB.classes.find((x) => x.id === c), sub = cls && cls.subjects.find((x) => x.id === sId);
    const t = sub && sub.topics.find((x) => x.id === tId);
    return t ? { cls, sub, t } : null;
  }

  function topicOfDay() {
    const pool = [];
    DB.classes.forEach((c) => c.subjects.forEach((s_) => s_.topics.forEach((t) => { if ((t.demos || []).length && t.life) pool.push({ c, s_, t }); })));
    if (!pool.length) return null;
    const d = new Date(), seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    return pool[(seed * 2654435761 >>> 0) % pool.length];
  }

  function viewClasses() {
    let topics = 0, demos = 0, qs = 0;
    DB.classes.forEach((c) => c.subjects.forEach((s_) => s_.topics.forEach((t) => { topics++; demos += (t.demos || []).length; qs += (t.quiz || []).length; })));
    const done = Object.keys(DONE).length;
    const last = lastTopic();
    const tod = topicOfDay();
    const plain = (x) => String(x || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const short = (x, n) => { const p = plain(x); return p.length > n ? p.slice(0, n).replace(/\s\S*$/, "") + "…" : p; };

    root.innerHTML = `
      <section class="am-hero am-hero-x">
        <canvas class="am-sky" aria-hidden="true"></canvas>
        <div class="am-orb o1"></div><div class="am-orb o2"></div><div class="am-orb o3"></div>
        <div class="am-hero-in">
          <span class="eyebrow am-glow-pill">🧪 Amaliy darslar · 5–11-sinf</span>
          <h1>Mavzuni <span class="am-type" aria-label="ko‘rib, ushlab, o‘ynab">ko‘rib</span><span class="am-caret">|</span><br>o‘rganing</h1>
          <p>Har bir mavzu hayotiy misoldan boshlanadi, jonli tajribada qo‘lingiz bilan sinab ko‘rasiz va kichik test bilan mustahkamlaysiz. Zerikarli formula yodlash yo‘q!</p>
          <div class="am-cta">
            <a class="am-btn primary" href="#start">🚀 Boshlash</a>
            ${last ? `<a class="am-btn ghost" href="#${last.cls.id}/${last.sub.id}/${last.t.id}">▶ Davom ettirish: <b>${esc(short(last.t.title, 34))}</b></a>` : ""}
          </div>
          <div class="am-stats">
            <div><b data-to="${topics}">0</b><small>mavzu</small></div>
            <div><b data-to="${demos}">0</b><small>jonli tajriba</small></div>
            <div><b data-to="${qs}">0</b><small>test savoli</small></div>
            ${done ? `<div class="mine"><b data-to="${done}">0</b><small>siz o‘rgandingiz</small></div>` : ""}
          </div>
        </div>
      </section>

      <section class="am-how rv">
        ${[["🌍", "Hayotiy misol", "Bu bilim qayerda kerak?"], ["📖", "Oddiy tushuntirish", "Qisqa va tushunarli"], ["🔬", "Jonli tajriba", "Surib, bosib ko‘ring"], ["✅", "Kichik test", "O‘zingizni sinang"]]
          .map(([ic, b, s_], i) => `<div class="am-how-step" style="--d:${i * 140}ms"><span class="ic">${ic}</span><b>${b}</b><small>${s_}</small></div>`).join('<i class="am-how-line" aria-hidden="true"></i>')}
      </section>

      ${tod ? `<a class="am-today rv" href="#${tod.c.id}/${tod.s_.id}/${tod.t.id}" style="--c:${tod.s_.color || "#00f59b"}">
        <span class="am-today-badge">✨ Kun mavzusi</span>
        <span class="am-today-ic">${tod.s_.icon || "🔬"}</span>
        <span class="am-today-t"><small>${esc(tod.c.name)} · ${esc(tod.s_.name)}</small><b>${esc(tod.t.title)}</b><em>${esc(short(tod.t.life, 140))}</em></span>
        <span class="am-today-go">Ochish →</span></a>` : ""}

      <h2 class="am-step" id="start"><span>1</span> Sinfingizni tanlang</h2>
      <div class="am-grid classes">
        ${DB.classes.map((c, i) => {
          const [ic, col] = CLASS_ART[c.id] || ["📘", "#22c55e"];
          const [d, tot] = clsTotals(c);
          return `<a class="am-card big" href="#${c.id}" style="--c:${col};--d:${i * 80}ms">
            <span class="am-shine" aria-hidden="true"></span>
            <span class="am-ic" style="--f:${(i % 3) * 0.6}s">${ic}</span><b>${esc(c.name)}</b>
            <small>${c.subjects.map((s_) => esc(s_.name)).join(" · ")}</small>
            ${d ? bar(d, tot) : ""}
            <em>${d ? `${d}/${tot} o‘rganildi →` : `${tot} ta mavzu →`}</em></a>`;
        }).join("")}
      </div>`;

    startSky(root.querySelector(".am-sky"));
    root.querySelectorAll(".am-stats b").forEach(countUp);
    typeWords(root.querySelector(".am-type"), ["ko‘rib", "ushlab", "o‘ynab", "tajriba qilib", "his qilib"]);
    root.querySelector('a[href="#start"]').addEventListener("click", (e) => { e.preventDefault(); root.querySelector("#start").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); });
    tilt(root); reveal(root);
  }

  function viewSubjects(cls) {
    root.innerHTML = `
      ${crumbs([["#", "Amaliy darslar"], ["", cls.name]])}
      <h2 class="am-step"><span>2</span> Fanni tanlang</h2>
      <div class="am-grid">
        ${cls.subjects.map((s_, i) => {
          const d = subDone(cls, s_);
          return `<a class="am-card big" href="#${cls.id}/${s_.id}" style="--c:${s_.color};--d:${i * 90}ms">
          <span class="am-shine" aria-hidden="true"></span>
          <span class="am-card-top"><span class="am-ic" style="--f:${i * 0.5}s">${s_.icon}</span>${ring(d, s_.topics.length, s_.color)}</span>
          <b>${esc(s_.name)}</b>
          <small>${esc(s_.note || "1-chorak mavzulari")}</small><em>${s_.topics.length} ta mavzu →</em></a>`;
        }).join("")}
      </div>`;
    tilt(root);
  }

  function viewTopics(cls, sub) {
    const d = subDone(cls, sub), tot = sub.topics.length;
    const firstNew = sub.topics.find((t) => !isDone(cls, sub, t));
    root.innerHTML = `
      ${crumbs([["#", "Amaliy darslar"], ["#" + cls.id, cls.name], ["", sub.name]])}
      <section class="am-subhead" style="--c:${sub.color}">
        <span class="am-subhead-ic">${sub.icon}</span>
        <div><b>${esc(cls.name)} · ${esc(sub.name)}</b>
          <small>${d ? `${d} / ${tot} mavzu o‘rganildi${d === tot ? " — barchasi! 🏆" : ""}` : `${tot} ta mavzu sizni kutmoqda`}</small>
          ${bar(d, tot)}</div>
        ${firstNew ? `<a class="am-btn primary sm" href="#${cls.id}/${sub.id}/${firstNew.id}">${d ? "▶ Keyingisi" : "🚀 Boshlash"}</a>` : ""}
      </section>
      <h2 class="am-step"><span>3</span> Mavzuni tanlang</h2>
      <input class="am-search" type="search" placeholder="🔎 Mavzu qidirish..." aria-label="Mavzu qidirish">
      <div class="am-topics">
        ${sub.topics.map((t, i) => {
          const ok = isDone(cls, sub, t);
          return `${t.sec && (i === 0 || sub.topics[i - 1].sec !== t.sec) ? `<h3 class="am-sec">${esc(t.sec)}</h3>` : ""}<a class="am-topic${ok ? " done" : ""}" href="#${cls.id}/${sub.id}/${t.id}" style="--c:${sub.color};--d:${Math.min(i, 12) * 40}ms">
          <span class="n">${ok ? "✓" : esc(t.code || i + 1)}</span><span class="t"><b>${esc(t.title)}</b><small>${rich(esc(t.tag || ""))}</small></span>
          <span class="ic">${(t.demos || []).length ? "🔬" : "📖"}</span></a>`;
        }).join("")}
      </div>`;
    const search = root.querySelector(".am-search");
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase().trim();
      root.querySelectorAll(".am-topic").forEach((a) => a.classList.toggle("hidden", !a.textContent.toLowerCase().includes(q)));
      root.querySelectorAll(".am-sec").forEach((hd) => { let n = hd.nextElementSibling, any = false; while (n && !n.classList.contains("am-sec")) { if (!n.classList.contains("hidden")) any = true; n = n.nextElementSibling; } hd.classList.toggle("hidden", !any); });
    });
  }

  function quiz(box, list, onFinish) {
    let score = 0, done = 0;
    list.forEach((item, qi) => {
      const opts = item.o.map((o, i) => ({ o, ok: i === 0 })).sort(() => Math.random() - 0.5);
      const card = h("div", { class: "am-q" }, h("p", { html: `<b>${qi + 1}.</b> ${rich(item.q)}` }));
      const row = h("div", { class: "am-opts" });
      opts.forEach(({ o, ok }) => {
        const b = h("button", { type: "button", html: rich(o) });
        b.onclick = () => {
          row.querySelectorAll("button").forEach((x) => (x.disabled = true));
          b.classList.add(ok ? "right" : "wrong");
          if (!ok) row.querySelectorAll("button").forEach((x, j) => { if (opts[j].ok) x.classList.add("right"); });
          if (ok) { score++; card.classList.add("q-ok"); } else card.classList.add("q-no");
          done++;
          card.append(h("div", { class: "am-expl " + (ok ? "good" : "bad"), html: (ok ? "✅ To‘g‘ri! " : "❌ Xato. ") + rich(item.e || "") }));
          box.dispatchEvent(new CustomEvent("amq", { detail: { done, score, total: list.length } }));
          if (done === list.length) {
            box.append(h("div", { class: "am-score", html: score === list.length ? `🏆 Ajoyib! ${score}/${list.length} — mavzuni to‘liq tushundingiz.` : score * 2 >= list.length ? `👍 Yaxshi! ${score}/${list.length}. Xatolarning izohini o‘qib chiqing.` : `Natija: ${score}/${list.length}. Tajribani yana bir bor ko‘rib, qayta urinib ko‘ring.` }));
            if (onFinish) onFinish(score, list.length);
          }
        };
        row.append(b);
      });
      card.append(row);
      box.append(card);
    });
  }

  function viewLesson(cls, sub, t) {
    const idx = sub.topics.indexOf(t);
    const prev = sub.topics[idx - 1], next = sub.topics[idx + 1];
    const parts = [
      t.life && ["s-life", t.code ? "🎯" : "🌍", t.code ? "Nega kerak" : "Hayotda"],
      ["s-explain", "📖", "Tushuntirish"],
      (t.demos || []).length && ["s-demo", "🔬", "Tajriba"],
      (t.examples || []).length && ["s-ex", "✍️", "Misollar"],
      (t.quiz || []).length && ["s-quiz", "✅", "Test"],
    ].filter(Boolean);
    const nextHref = next ? `#${cls.id}/${sub.id}/${next.id}` : `#${cls.id}/${sub.id}`;

    root.innerHTML = `
      <div class="am-readbar" aria-hidden="true"><i></i></div>
      ${crumbs([["#", "Amaliy darslar"], ["#" + cls.id, cls.name], ["#" + cls.id + "/" + sub.id, sub.name], ["", t.title]])}
      <article class="am-lesson" style="--c:${sub.color}">
        <header class="am-lhead">
          <span class="am-lhead-art" aria-hidden="true"><i>${sub.icon || "📘"}</i><i>✦</i><i>✧</i><i>✦</i></span>
          <span class="tag">${esc(cls.name)} · ${esc(sub.name)} · ${t.code ? esc(t.code) : idx + 1 + "-mavzu"}${isDone(cls, sub, t) ? ` · <b class="am-donebadge">✓ o‘rganilgan</b>` : ""}</span>
          <h1>${esc(t.title)}</h1>
          ${t.tag ? `<p>${rich(esc(t.tag))}</p>` : ""}
          <span class="am-meta">⏱ ~${Math.max(3, Math.round(((t.explain || "").length + (t.life || "").length) / 900) + (t.demos || []).length * 2 + (t.quiz || []).length)} daqiqa · ${idx + 1}/${sub.topics.length}-mavzu</span>
        </header>
        ${parts.length > 2 ? `<nav class="am-stepper">${parts.map(([id, ic, nm], i) => `<a href="#${id}" data-id="${id}"><span>${ic}</span><b>${nm}</b></a>${i < parts.length - 1 ? '<i></i>' : ""}`).join("")}</nav>` : ""}
        ${t.life ? `<section class="am-block life rv" id="s-life"><h2><span class="h-ic">${t.code ? "🎯" : "🌍"}</span> ${t.code ? "Nega kerak?" : "Hayotda qayerda uchraydi?"}</h2><div>${rich(t.life)}</div></section>` : ""}
        <section class="am-block rv" id="s-explain"><h2><span class="h-ic">📖</span> Tushuntirish</h2><div class="am-text">${rich(t.explain)}</div>
          ${t.rule ? `<div class="am-rule">📌 ${rich(t.rule)}</div>` : ""}
          ${t.tip ? `<div class="am-tip">⚠️ <b>Diqqat:</b> ${rich(t.tip)}</div>` : ""}
          ${(t.see || []).length ? `<div class="am-see"><span>📗 Oq to‘plamda batafsil:</span>${t.see.map(([href, title]) => `<a href="${href}">${esc(title)}</a>`).join("")}</div>` : ""}</section>
        ${(t.demos || []).length ? `<section class="am-block demo-block rv" id="s-demo"><h2><span class="h-ic spin">🔬</span> Jonli tajriba</h2><p class="muted am-hint">👆 Tugma va surgichlarni o‘zgartiring — natija darhol o‘zgaradi.</p><div class="am-demos"></div></section>` : ""}
        ${(t.examples || []).length ? `<section class="am-block rv" id="s-ex"><h2><span class="h-ic">✍️</span> Ishlangan misollar</h2><div class="am-examples"></div></section>` : ""}
        ${(t.quiz || []).length ? `<section class="am-block rv" id="s-quiz"><h2><span class="h-ic">✅</span> O‘zingizni sinang <span class="am-qprog"><i></i></span></h2><div class="am-quiz"></div></section>` : ""}
        ${t.p1 ? `<p class="am-book">📗 Bu mavzu bo‘yicha test topshiriqlari: <b>Oq to‘plam (1996–2007)</b>, ${t.p1 === t.p2 ? t.p1 + "-bet" : t.p1 + "–" + t.p2 + "-betlar"}.</p>` : ""}
        <div class="am-finish" hidden>
          <span class="am-finish-ic">🎉</span>
          <div><b>Mavzu o‘rganildi!</b><small>${esc(sub.name)}: <span class="am-finish-n"></span></small></div>
          <a class="am-btn primary sm" href="${nextHref}">${next ? "Keyingi mavzu →" : "Barcha mavzular →"}</a>
        </div>
        <nav class="am-pager">
          ${prev ? `<a href="#${cls.id}/${sub.id}/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="next" href="#${cls.id}/${sub.id}/${next.id}">${esc(next.title)} →</a>` : `<a class="next" href="#${cls.id}/${sub.id}">Barcha mavzular →</a>`}
        </nav>
      </article>`;

    const demos = root.querySelector(".am-demos");
    (t.demos || []).forEach((d) => {
      const box = h("div", { class: "demo" });
      demos.append(box);
      try { W[d.type](box, d); } catch (e) { console.error(e); box.innerHTML = `<p class="bad">Tajribani yuklab bo‘lmadi.</p>`; }
    });

    const ex = root.querySelector(".am-examples");
    (t.examples || []).forEach((e, i) => {
      const card = h("div", { class: "am-ex" }, h("div", { class: "am-ex-q", html: `<span>${i + 1}-misol.</span> ${rich(e.q)}` }));
      const steps = h("ol", { class: "am-ex-steps" });
      const ans = h("div", { class: "am-ex-a", html: `Javob: ${rich(e.a)}` });
      ans.hidden = true;
      let k = 0;
      const btn = h("button", { type: "button", class: "dbtn" }, "Yechimni ko‘rsat →");
      btn.onclick = () => {
        if (k < e.steps.length) steps.append(h("li", { html: rich(e.steps[k++]) }));
        if (k >= e.steps.length) { ans.hidden = false; btn.remove(); }
        else btn.textContent = "Keyingi qadam →";
      };
      card.append(steps, ans, btn);
      ex.append(card);
    });

    const qz = root.querySelector(".am-quiz");
    const finish = (score, total) => {
      const fin = root.querySelector(".am-finish");
      const passed = !total || score / total >= 0.5;
      if (passed) markDone(cls, sub, t, total ? score / total : 1);
      if (!fin) return;
      fin.classList.toggle("retry", !passed);
      fin.querySelector(".am-finish-ic").textContent = passed ? "🎉" : "💪";
      fin.querySelector("b").textContent = passed ? "Mavzu o‘rganildi!" : "Yana bir urinib ko‘ring!";
      fin.querySelector(".am-finish-n").textContent = passed
        ? `${subDone(cls, sub)} / ${sub.topics.length} mavzu o‘rganildi`
        : "Kamida yarmi to‘g‘ri bo‘lsa, mavzu o‘rganilgan hisoblanadi";
      const btn = fin.querySelector(".am-btn");
      btn.textContent = passed ? (next ? "Keyingi mavzu →" : "Barcha mavzular →") : "🔄 Qayta yechish";
      btn.onclick = passed ? null : (e) => {
        e.preventDefault();
        fin.hidden = true;
        qz.innerHTML = "";
        root.querySelector(".am-qprog i").style.width = "0";
        quiz(qz, t.quiz, finish);
        root.querySelector("#s-quiz").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      };
      fin.hidden = false;
      if (passed) confetti();
    };

    if (qz) {
      const qp = root.querySelector(".am-qprog i");
      qz.addEventListener("amq", (e) => { qp.style.width = (e.detail.done / e.detail.total) * 100 + "%"; });
      quiz(qz, t.quiz, finish);
    }

    reveal(root);

    /* O'qish chizig'i, bosqichlar va test bo'lmasa — oxirigacha o'qilganda belgilash */
    const rb = root.querySelector(".am-readbar i");
    const stepLinks = [...root.querySelectorAll(".am-stepper a")];
    stepLinks.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); const el = document.getElementById(a.dataset.id); if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); }));
    let readMarked = !!qz;
    const onScroll = () => {
      if (!rb.isConnected) { window.removeEventListener("scroll", onScroll); return; }
      const art = root.querySelector(".am-lesson");
      const r = art.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.6)));
      rb.style.transform = `scaleX(${p})`;
      let cur = null;
      stepLinks.forEach((a) => { const el = document.getElementById(a.dataset.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) cur = a; });
      stepLinks.forEach((a) => { a.classList.toggle("on", a === cur); a.classList.toggle("past", cur && stepLinks.indexOf(a) < stepLinks.indexOf(cur)); });
      if (!readMarked && p > 0.92) { readMarked = true; finish(0, 0); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function route() {
    const [c, sId, tId] = decodeURIComponent(location.hash.slice(1)).split("/");
    const cls = DB.classes.find((x) => x.id === c);
    const sub = cls && cls.subjects.find((x) => x.id === sId);
    const t = sub && sub.topics.find((x) => x.id === tId);
    if (t) viewLesson(cls, sub, t);
    else if (sub) viewTopics(cls, sub);
    else if (cls) viewSubjects(cls);
    else viewClasses();
    window.scrollTo(0, 0);
    if (t) { try { localStorage.setItem("sofi_amaliy_last", location.hash); } catch (e) {} }
  }

  window.addEventListener("hashchange", () => { document.querySelectorAll(".am-confetti").forEach((c) => c.remove()); route(); });
  route();
})();
