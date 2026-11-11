/* OVCHI — kirish testi: har bir sinfga o'z mavzularidan 5 ta savol.
   Dars rejasi bo'lsa (ovchi-plan.js) — shu kungacha o'tilgan mavzulardan, aks holda joriy chorak mavzularidan.
   4/5 (80%) to'g'ri — bugun uchun "ov ruxsatnomasi". */
(() => {
  "use strict";
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (s) => String(s || "").toLowerCase().replace(/[‘’ʻʼ'`´]/g, "").replace(/а/g, "a").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  let N = 5, PASS = 4; const SEC = 30;

  function quarterOf(d = new Date()) { const m = d.getMonth() + 1; return m >= 9 && m <= 10 ? 0 : m >= 11 ? 1 : m <= 3 ? 2 : 3; }
  const QNAMES = ["I chorak", "II chorak", "III chorak", "IV chorak"];

  /** Sinf uchun mavzular va savollar */
  function pickTopics(cls, cfg) {
    const key = String(parseInt(cls) || 6);
    const bank = (window.SofiOvchiBank || {})[key] || [];
    // Ustoz tanlagan mavzular (profil → “O‘yinga kirish testi”)
    if (cfg && cfg.mode === "topics" && (cfg.topics || []).length) {
      const sel = bank.filter((b) => cfg.topics.includes(b.t));
      if (sel.length) return { topics: sel, source: "Ustoz tanlagan mavzular", key };
    }
    const plan = (window.SofiOvchiPlan || {})[key];
    let topics = [], source = "";
    if (plan) {
      const taught = plan.filter(([d, t]) => d <= today() && !/nazorat|xatolar ustida/i.test(t)).map(([, t]) => t);
      const recent = [...new Set(taught.reverse())].slice(0, 3);
      recent.forEach((t) => { const k = norm(t).slice(0, 26); const m = bank.filter((b) => norm(b.t).startsWith(k) || k.startsWith(norm(b.t).slice(0, 26))); topics.push(...m); });
      if (topics.length) source = "Dars rejasi bo‘yicha o‘tilgan mavzular";
    }
    if (!topics.length) {
      let q = quarterOf();
      // reja bo'yicha chorak hali boshlanmagan bo'lsa (masalan, 2-chorak darslari keyinroq) — oldingi chorak
      if (plan && plan.length && plan[0][0] > today()) q = Math.max(0, q - 1);
      for (let k = q; k >= 0 && !topics.length; k--) topics = bank.filter((b) => b.sec === QNAMES[k]);
      topics = topics.slice(-6);
      source = `${QNAMES[q]} mavzulari`;
    }
    if (!topics.length) topics = bank.slice(0, 6);
    return { topics, source, key };
  }
  function makeTest(cls, cfg) {
    N = Math.max(3, Math.min(10, (cfg && cfg.n) || 5));
    PASS = Math.max(1, Math.ceil(N * ((cfg && cfg.pass) || 80) / 100));
    const { topics, source, key } = pickTopics(cls, cfg);
    const pool = [];
    topics.forEach((t) => t.q.forEach(([q, o, e]) => { if (q.length < 24 && !/\d/.test(q)) return; pool.push({ q, o, e, t: t.t, s: t.s }); }));
    const qs = shuffle(pool).slice(0, N).map((x) => { const right = x.o[0]; return { ...x, right, opts: shuffle(x.o.slice(0, 4)) }; });
    return { qs, source, key, titles: [...new Set(qs.map((x) => x.t))] };
  }

  const LK = "sofi_ovchi_lic";
  const hasLicense = (name) => { try { const l = JSON.parse(localStorage.getItem(LK) || "{}"); return l.name === name && l.day === today(); } catch (e) { return false; } };
  const giveLicense = (name) => { try { localStorage.setItem(LK, JSON.stringify({ name, day: today() })); } catch (e) {} };

  /** Testni ko'rsatish. Natija: Promise<boolean> (o'tdimi) */
  function run(host, person, cfg) {
    return new Promise((resolve) => {
      const T = makeTest(person.cls, cfg);
      let i = 0, ok = 0, timer = 0, left = SEC, locked = false;
      const el = document.createElement("div");
      el.className = "ov-test";
      host.appendChild(el);
      const finish = (v) => { clearInterval(timer); el.remove(); resolve(v); };
      const intro = () => {
        el.innerHTML = `<div class="ov-tcard"><span class="ov-tbig">🎯</span><h2>Ov ruxsatnomasi</h2>
          <p>Ovga chiqishdan oldin <b>${esc(person.cls || "")}</b> mavzularidan kichik test: <b>${N} ta savol</b>, har biriga ${SEC} soniya. <b>${PASS} ta</b> to‘g‘ri javob — bugun kun bo‘yi ov qilishingiz mumkin!</p>
          <div class="ov-ttopics"><small>📚 ${esc(T.source)}:</small>${T.titles.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
          <div class="ov-trow"><button class="ov-tbtn" data-t="go" type="button">▶ Testni boshlash</button><button class="ov-tbtn ghost" data-t="exit" type="button">🚪 Chiqish</button></div></div>`;
      };
      const show = () => {
        const q = T.qs[i]; locked = false; left = SEC;
        el.innerHTML = `<div class="ov-tcard"><div class="ov-thead"><span>${i + 1} / ${T.qs.length}</span><div class="ov-tbar"><i style="width:${(i / T.qs.length) * 100}%"></i></div><b class="ov-ttime" data-tm>${SEC}</b></div>
          <small class="ov-tsub">${esc(q.s)} · ${esc(q.t)}</small><h3>${esc(q.q)}</h3>
          <div class="ov-topts">${q.opts.map((o, k) => `<button type="button" data-o="${k}"><i>${"ABCD"[k]}</i><span>${esc(o)}</span></button>`).join("")}</div><em class="ov-texp" data-ex></em></div>`;
        clearInterval(timer);
        timer = setInterval(() => { left--; const t = el.querySelector("[data-tm]"); if (t) { t.textContent = left; t.classList.toggle("low", left <= 5); } if (left <= 0) pick(-1); }, 1000);
      };
      const pick = (k) => {
        if (locked) return; locked = true; clearInterval(timer);
        const q = T.qs[i], btns = el.querySelectorAll("[data-o]");
        btns.forEach((b, j) => { b.disabled = true; if (q.opts[j] === q.right) b.classList.add("right"); });
        const good = k >= 0 && q.opts[k] === q.right;
        if (!good && k >= 0) btns[k].classList.add("wrong");
        if (good) ok++;
        const ex = el.querySelector("[data-ex]"); ex.textContent = (good ? "✅ To‘g‘ri! " : k < 0 ? "⏰ Vaqt tugadi. " : "❌ Noto‘g‘ri. ") + (q.e || "");
        setTimeout(() => { i++; if (i < T.qs.length) show(); else result(); }, good ? 900 : 2200);
      };
      const result = () => {
        const pass = ok >= Math.min(PASS, T.qs.length);
        if (pass) giveLicense(person.name);
        el.innerHTML = `<div class="ov-tcard ${pass ? "win" : ""}"><span class="ov-tbig">${pass ? "🎫" : "📚"}</span><h2>${pass ? "Ruxsatnoma berildi!" : "Bu safar o‘tmadi"}</h2>
          <div class="ov-tscore"><b>${ok}</b> / ${T.qs.length}</div>
          <p>${pass ? "Ajoyib! Endi bugun kun bo‘yi ovga chiqishingiz mumkin. Omad, ovchi! 🏹" : `Kamida ${PASS} ta to‘g‘ri javob kerak. Mavzuni Amaliy darslarda takrorlab, 1 daqiqadan keyin qayta urinib ko‘ring.`}</p>
          <div class="ov-trow">${pass ? `<button class="ov-tbtn" data-t="hunt" type="button">🏹 Ovga chiqish</button>` : `<button class="ov-tbtn" data-t="retry" type="button" disabled data-wait>⏳ 60</button><a class="ov-tbtn ghost" href="amaliy.html">📖 Amaliy darslar</a>`}<button class="ov-tbtn ghost" data-t="exit" type="button">🚪 Chiqish</button></div></div>`;
        if (!pass) { let w = 60; const b = el.querySelector("[data-wait]"); const iv = setInterval(() => { w--; if (!b.isConnected) return clearInterval(iv); b.textContent = w > 0 ? `⏳ ${w}` : "🔁 Qayta urinish"; if (w <= 0) { clearInterval(iv); b.disabled = false; } }, 1000); }
      };
      el.addEventListener("click", (e) => {
        const o = e.target.closest("[data-o]"); if (o) return pick(Number(o.dataset.o));
        const b = e.target.closest("[data-t]"); if (!b) return;
        const a = b.dataset.t;
        if (a === "go") show();
        else if (a === "hunt") finish(true);
        else if (a === "exit") finish(false);
        else if (a === "retry") { const n = makeTest(person.cls, cfg); T.qs = n.qs; i = 0; ok = 0; show(); }
      });
      intro();
    });
  }

  window.SofiOvchiTest = { run, hasLicense, makeTest, topicsOf: (cls) => ((window.SofiOvchiBank || {})[String(parseInt(cls) || 6)] || []).map((b) => ({ t: b.t, s: b.s, sec: b.sec, n: b.q.length })) };
})();
