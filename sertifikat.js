/* Milliy sertifikat · Matematika — imtihon simulyatori.
   Ko'rsatma → imtihon (150 daqiqa, savollar kitobchasi + javoblar varaqasi) → natija (75 ballik shkala, daraja, tahlil). */
(() => {
  "use strict";
  const G = window.SERT_GEN; if (!G) return;
  const app = document.getElementById("msApp");
  const DUR = 150 * 60 * 1000, KEY = "sofi_ms_exam_v1", HIST = "sofi_ms_hist_v1", L4 = "ABCD", L6 = "ABCDEF";
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bo'sh */ } }, del(k) { try { localStorage.removeItem(k); } catch (e) { /* bo'sh */ } } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const GRADES = [[70, "A+"], [65, "A"], [60, "B+"], [55, "B"], [50, "C+"], [46, "C"]];
  const grade = (b) => (GRADES.find((g) => b >= g[0]) || [0, "—"])[1];
  // Xom ball: 1–35 — 1 ball, 36–45 — har bir qism (a, b) 1 ball → maks 55; 75 ballik shkalaga o'tkaziladi
  const RAW_MAX = 32 + 3 + 20;
  let ex = null, tick = 0;

  // =============================== KO'RSATMA ===============================
  function home() {
    clearInterval(tick); document.body.classList.remove("ms-on");
    const saved = LS.get(KEY, null), hist = LS.get(HIST, []);
    app.innerHTML = `
      <section class="ms-hero">
        <div class="ms-badge">📜 MILLIY SERTIFIKAT · MATEMATIKA</div>
        <h1>Imtihon simulyatori</h1>
        <p>Haqiqiy milliy sertifikat imtihoni tartibida: 45 ta topshiriq, 150 daqiqa, javoblar varaqasi va 75 ballik natija. Har bir variant raqami — yangi savollar to‘plami.</p>
      </section>
      <section class="ms-rules">
        <h2>Imtihon tartibi</h2>
        <table class="ms-tab">
          <tr><th>Imtihon davomiyligi</th><td><b>150 daqiqa</b> (2 soat 30 daqiqa)</td></tr>
          <tr><th>Topshiriqlar soni</th><td><b>45 ta</b></td></tr>
          <tr><th>1–32-topshiriqlar</th><td>Yopiq test — 4 ta javobdan (A, B, C, D) <b>bittasi to‘g‘ri</b></td></tr>
          <tr><th>33–35-topshiriqlar</th><td>Moslashtirish — bitta shartga 3 ta savol, javoblar A–F dan tanlanadi</td></tr>
          <tr><th>36–45-topshiriqlar</th><td>Ochiq (yozma javobli) — har birida <b>a)</b> va <b>b)</b> qismlar; faqat yakuniy javob baholanadi</td></tr>
          <tr><th>Maksimal ball</th><td><b>75 ball</b></td></tr>
          <tr><th>Darajalar</th><td>A+ — 70 va undan yuqori · A — 65 · B+ — 60 · B — 55 · C+ — 50 · C — 46 (sertifikat 46 balldan beriladi)</td></tr>
        </table>
        <ul class="ms-list">
          <li>Kalkulyator, telefon va ma’lumotnomalardan foydalanish taqiqlanadi.</li>
          <li>Javoblarni <b>javoblar varaqasiga</b> belgilang: yopiq testlarda bitta harfni, ochiq topshiriqlarda sonni yozing (masalan: <i>−3</i>, <i>2,5</i>, <i>1/3</i>).</li>
          <li>Vaqt tugaganda imtihon avtomatik yakunlanadi. Sahifani yangilasangiz ham vaqt va javoblar saqlanib qoladi.</li>
          <li class="muted">Eslatma: rasmiy natija Rasch modeli bilan hisoblanadi; bu yerda ball taxminiy (to‘g‘ri javoblar ulushi 75 ballik shkalaga o‘tkaziladi).</li>
        </ul>
      </section>
      <section class="ms-start">
        ${saved && !saved.done ? `<div class="ms-cont"><b>⏳ Tugallanmagan imtihon: ${saved.seed}-variant</b><span>Qolgan vaqt: ${fmt(Math.max(0, saved.start + DUR - Date.now()))}</span><button class="ms-btn" id="msCont">▶ Davom ettirish</button></div>` : ""}
        <label class="ms-lbl">Variant raqami <input id="msSeed" type="number" min="1" max="99999" value="${Math.floor(Math.random() * 900) + 100}"></label>
        <div class="ms-row"><button class="ms-btn big" id="msGo">🚀 Imtihonni boshlash</button><button class="ms-btn ghost" id="msRnd">🎲 Tasodifiy variant</button></div>
        <small class="muted">Ustoz bir xil variant raqamini aytsa, butun sinf bir xil savollarni oladi.</small>
      </section>
      ${hist.length ? `<section class="ms-hist"><h2>Oldingi natijalar</h2>${hist.slice(0, 8).map((h) => `<div><b>${h.seed}-variant</b><span>${h.date}</span><em class="g-${h.g.replace("+", "p")}">${h.g}</em><strong>${h.ball} ball</strong></div>`).join("")}</section>` : ""}`;
    document.getElementById("msGo").onclick = () => start(+document.getElementById("msSeed").value || 1);
    document.getElementById("msRnd").onclick = () => { document.getElementById("msSeed").value = Math.floor(Math.random() * 9000) + 100; };
    const c = document.getElementById("msCont"); if (c) c.onclick = () => resume(saved);
  }
  const fmt = (ms) => { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return `${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; };

  // =============================== IMTIHON ===============================
  function start(seed) {
    if (!confirm(`${seed}-variant. Imtihon 150 daqiqa davom etadi. Boshlaymizmi?`)) return;
    resume({ seed, start: Date.now(), ans: {}, done: false });
  }
  function resume(state) {
    ex = state; ex.qs = G.variant(ex.seed); document.body.classList.add("ms-on"); LS.set(KEY, { seed: ex.seed, start: ex.start, ans: ex.ans, done: false });
    const Q = ex.qs;
    app.innerHTML = `
      <div class="ms-top"><span class="ms-tt">MILLIY SERTIFIKAT · MATEMATIKA · <b>${ex.seed}-variant</b></span><span class="ms-timer" id="msTimer">2:30:00</span><span class="ms-prog" id="msProg"></span><button class="ms-btn" id="msEnd">✅ Yakunlash</button></div>
      <div class="ms-exam">
        <div class="ms-book">${Q.map(qHTML).join("")}</div>
        <aside class="ms-sheet" id="msSheet"><button class="ms-sheet-tg" id="msSheetTg">📋 Javoblar varaqasi</button><div class="ms-sheet-in">${sheetHTML(Q)}</div></aside>
      </div>`;
    app.querySelectorAll("[data-mc]").forEach((b) => (b.onclick = () => { const n = b.dataset.mc; ex.ans[n] = +b.dataset.v; save(); sync(); }));
    app.querySelectorAll("input[data-op]").forEach((i) => (i.oninput = () => { ex.ans[i.dataset.op] = i.value; save(); sync(i); }));
    app.querySelectorAll("[data-go]").forEach((a) => (a.onclick = (e) => { e.preventDefault(); const el = document.getElementById("q" + a.dataset.go); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); }));
    document.getElementById("msEnd").onclick = () => { const left = Q.reduce((s, q) => s + (q.t === "open" ? 2 : 1), 0) - Object.values(ex.ans).filter((v) => v !== "" && v != null).length; if (confirm(left ? `${left} ta javob bo‘sh. Baribir yakunlaysizmi?` : "Imtihonni yakunlaysizmi?")) finish(); };
    document.getElementById("msSheetTg").onclick = () => document.getElementById("msSheet").classList.toggle("open");
    sync(); clearInterval(tick); tick = setInterval(timer, 500); timer();
    window.scrollTo(0, 0);
  }
  function qHTML(q) {
    let h = "";
    if (q.t === "match" && q.first) h += `<div class="ms-ctx"><b>Topshiriqlar (33–35) va javob variantlari (A–F) ni o‘zaro moslashtiring.</b><br>${q.ctx}<div class="ms-mopts">${q.opts.map((o, i) => `<span><b>${L6[i]})</b> ${o}</span>`).join("")}</div></div>`;
    h += `<article class="ms-q" id="q${q.n}"><div class="ms-qn">${q.n}.</div><div class="ms-qb"><div class="ms-qt">${q.q}</div>`;
    if (q.t === "mc") h += `<div class="ms-opts">${q.opts.map((o, i) => `<button type="button" data-mc="${q.n}" data-v="${i}"><b>${L4[i]})</b> ${o}</button>`).join("")}</div>`;
    else if (q.t === "match") h += `<div class="ms-opts six">${q.opts.map((o, i) => `<button type="button" data-mc="${q.n}" data-v="${i}"><b>${L6[i]}</b></button>`).join("")}</div>`;
    else h += q.parts.map((p, i) => `<div class="ms-part"><span>${"ab"[i]}) ${p.q}</span><label>Javob: ${"ab"[i]}) <input data-op="${q.n}${"ab"[i]}" inputmode="decimal" autocomplete="off" placeholder="…"></label></div>`).join("");
    return h + `</div></article>`;
  }
  function sheetHTML(Q) {
    const mc = Q.filter((q) => q.t !== "open"), op = Q.filter((q) => q.t === "open");
    return `<div class="ms-sh-h">JAVOBLAR VARAQASI</div>
      <div class="ms-sh-grid">${mc.map((q) => `<div class="ms-sh-r"><a href="#q${q.n}" data-go="${q.n}">${q.n}</a>${(q.t === "match" ? L6 : L4).split("").map((L, i) => `<button type="button" data-mc="${q.n}" data-v="${i}">${L}</button>`).join("")}</div>`).join("")}</div>
      <div class="ms-sh-h">OCHIQ TOPSHIRIQLAR</div>
      <div class="ms-sh-open">${op.map((q) => `<div class="ms-sh-o"><a href="#q${q.n}" data-go="${q.n}">${q.n}</a>${"ab".split("").map((p) => `<label>${p}) <input data-op="${q.n}${p}" inputmode="decimal" autocomplete="off"></label>`).join("")}</div>`).join("")}</div>`;
  }
  function sync(src) {
    app.querySelectorAll("[data-mc]").forEach((b) => b.classList.toggle("on", ex.ans[b.dataset.mc] === +b.dataset.v));
    app.querySelectorAll("input[data-op]").forEach((i) => { if (i !== src && i.value !== (ex.ans[i.dataset.op] || "")) i.value = ex.ans[i.dataset.op] || ""; });
    const tot = ex.qs.reduce((s, q) => s + (q.t === "open" ? 2 : 1), 0), done = Object.values(ex.ans).filter((v) => v !== "" && v != null).length;
    const pg = document.getElementById("msProg"); if (pg) pg.textContent = `Belgilangan: ${done}/${tot}`;
  }
  const save = () => LS.set(KEY, { seed: ex.seed, start: ex.start, ans: ex.ans, done: false });
  function timer() {
    const left = ex.start + DUR - Date.now(), el = document.getElementById("msTimer"); if (!el) return clearInterval(tick);
    el.textContent = fmt(Math.max(0, left)); el.classList.toggle("warn", left < 15 * 60000); el.classList.toggle("crit", left < 5 * 60000);
    if (left <= 0) { clearInterval(tick); alert("Imtihon vaqti tugadi! Javoblaringiz qabul qilindi."); finish(); }
  }

  // =============================== NATIJA ===============================
  function finish() {
    clearInterval(tick); document.body.classList.remove("ms-on");
    const Q = ex.qs; let raw = 0, sec = { mc: 0, match: 0, open: 0 };
    const rows = Q.map((q) => {
      if (q.t !== "open") { const ok = ex.ans[q.n] === q.a; if (ok) { raw++; sec[q.t]++; } return { q, ok, yours: ex.ans[q.n] == null ? "—" : (q.t === "match" ? L6 : L4)[ex.ans[q.n]] }; }
      const parts = q.parts.map((p, i) => { const k = q.n + "ab"[i], v = G.parseAns(ex.ans[k]); const ok = isFinite(v) && Math.abs(v - p.a) < 1e-6; if (ok) { raw++; sec.open++; } return { ok, yours: ex.ans[k] || "—", right: G.num(p.a) }; });
      return { q, parts };
    });
    const ball = Math.round((raw / RAW_MAX) * 75 * 10) / 10, g = grade(ball);
    const hist = LS.get(HIST, []); hist.unshift({ seed: ex.seed, ball, g, date: new Date().toLocaleString("uz", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) }); LS.set(HIST, hist.slice(0, 30));
    LS.del(KEY);
    const used = Math.min(DUR, Date.now() - ex.start);
    app.innerHTML = `
      <section class="ms-res">
        <div class="ms-res-card">
          <small>MILLIY SERTIFIKAT · MATEMATIKA · ${ex.seed}-variant</small>
          <div class="ms-grade g-${g.replace("+", "p")}">${g}</div>
          <div class="ms-ball"><b>${String(ball).replace(".", ",")}</b> / 75 ball</div>
          <p>${g === "—" ? "Sertifikat uchun kamida 46 ball kerak. Tahlilni ko‘rib, xatolar ustida ishlang!" : g === "A+" ? "Ajoyib! Eng yuqori daraja. 🏆" : `Daraja: ${g}. Keyingi daraja uchun yana ozgina!`}</p>
          <div class="ms-secs"><span>Yopiq testlar: <b>${sec.mc}/32</b></span><span>Moslashtirish: <b>${sec.match}/3</b></span><span>Ochiq (a, b): <b>${sec.open}/20</b></span><span>Sarflangan vaqt: <b>${fmt(used)}</b></span></div>
          <div class="ms-row"><button class="ms-btn" id="msHome">↺ Yangi imtihon</button><button class="ms-btn ghost" onclick="window.print()">🖨 Chop etish</button></div>
        </div>
        <h2>Tahlil</h2>
        <div class="ms-review">${rows.map((r) => r.q.t !== "open"
          ? `<div class="ms-rv ${r.ok ? "ok" : "bad"}"><div class="ms-rv-h"><b>${r.q.n}.</b> ${r.ok ? "✅" : "❌"} Sizning javobingiz: <b>${r.yours}</b> · To‘g‘ri: <b>${(r.q.t === "match" ? L6 : L4)[r.q.a]}</b></div><div class="ms-rv-q">${r.q.t === "match" ? r.q.ctx + " " : ""}${r.q.q}</div><div class="ms-rv-s">💡 ${r.q.sol}</div></div>`
          : `<div class="ms-rv ${r.parts.every((p) => p.ok) ? "ok" : r.parts.some((p) => p.ok) ? "half" : "bad"}"><div class="ms-rv-h"><b>${r.q.n}.</b> ${r.parts.map((p, i) => `${"ab"[i]}) ${p.ok ? "✅" : "❌"} siz: <b>${esc(p.yours)}</b>, to‘g‘ri: <b>${p.right}</b>`).join(" · ")}</div><div class="ms-rv-q">${r.q.q} ${r.q.parts.map((p, i) => `<br>${"ab"[i]}) ${p.q}`).join("")}</div><div class="ms-rv-s">💡 ${r.q.sol}</div></div>`).join("")}</div>
      </section>`;
    document.getElementById("msHome").onclick = home;
    window.scrollTo(0, 0);
  }

  const saved = LS.get(KEY, null);
  if (saved && !saved.done && saved.start + DUR > Date.now() && /#davom/.test(location.hash)) resume(saved); else home();
})();
