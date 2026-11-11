/* O'quvchi profili: parol bilan kirish va to'liq statistika. */
(() => {
  "use strict";
  const D = window.CENTER_DATA || {};
  const A = window.SofiAuth;
  const $ = (s, p = document) => p.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (v) => String(v || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("uz");
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const app = $("#pfApp");
  const STUDENTS = (D.students || []).map((s) => ({ name: s.name, cls: s.group, base: Number(s.stars) || 0, result: s.result }));
  const GAME = { "sirli-quti": ["🎁", "Sirli quti"], "poyga": ["🏎️", "Bilimlar poygasi"], "bilmasvoy": ["🧢", "Bilmasvoyga o‘rgat"], "master": ["🏅", "Matematika Master (g‘olib)"] };
  const MASTER_T = { "takror-3-4": "3–4-sinfni takrorlash", "takror-5": "5-sinfni takrorlash", "boluvchi-karrali": "Bo‘luvchilar va karralilar", "ekub-ekuk": "EKUB va EKUK", "oddiy-kasrlar": "Oddiy kasrlar", "onli-davriy": "O‘nli va davriy kasrlar", "chiziqli-tenglamalar": "Chiziqli tenglamalar", "ketma-ketliklar": "Ketma-ketliklar", "toplamlar": "To‘plamlar", "ehtimollik": "Ehtimollik", "statistika": "Statistika", "burchaklar": "Burchaklar" };
  const CLS_C = { "5-sinf": "#22c55e", "6-sinf": "#38bdf8", "6-A sinf": "#818cf8", "7-sinf": "#ec4899", "8-sinf": "#f59e0b" };

  // ---------- Kirish ----------
  function topBar() {
    const me = A && A.me();
    $("#pfTop").innerHTML = me ? `<button class="pf-out" type="button" id="pfOut">🚪 Chiqish</button>` : "";
    const o = $("#pfOut");
    if (o) o.onclick = () => { A.logout(); render(); };
  }

  function loginView() {
    app.innerHTML = `
      <section class="pf-login">
        <div class="pf-lock">🔐</div>
        <h1>Shaxsiy <span>profil</span></h1>
        <p>Yulduzlaringiz, reytingdagi o‘rningiz, o‘yinlar va marafon natijalaringizni ko‘rish uchun ismingizni tanlab, <b>shaxsiy parolingizni</b> kiriting.</p>
        <button class="pf-btn" type="button" id="pfLogin">🔑 Kirish</button>
        <small>Parolni ustozingiz yoki markaz rahbaridan oling. Parolni hech kimga bermang!</small>
      </section>`;
    $("#pfLogin").onclick = async () => { const u = await A.open({ title: "Profilga kirish" }); if (u) render(); };
  }

  // ---------- Ma'lumotlar ----------
  async function loadServer() {
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    const out = { ok: false, game: [], qw: [], mres: [], mwin: [], ts: [], chess: [] };
    if (!window.supabase || !cfg.SUPABASE_URL) return out;
    try {
      const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
      const [g, q, mr, mw, ts, cr] = await Promise.all([
        db.from("game_stars").select("student_name, game, stars, day, created_at"),
        db.from("question_winners").select("*"),
        db.from("master_results").select("student_name, topic, attempt, correct, points, seconds, created_at"),
        db.from("master_winners").select("topic, student_name, points, awarded_at"),
        db.from("teacher_stars").select("student_name, stars, reason, teacher, created_at").order("created_at", { ascending: false }),
        db.from("chess_ratings").select("*").order("rating", { ascending: false })
      ]);
      out.chess = cr.error ? [] : cr.data || [];
      out.ts = ts.error ? [] : ts.data || [];
      out.game = g.error ? [] : g.data || [];
      out.qw = q.error ? [] : q.data || [];
      out.mres = mr.error ? [] : mr.data || [];
      out.mwin = mw.error ? [] : mw.data || [];
      out.ok = !g.error || !q.error;
    } catch (e) { console.warn("Profil ma’lumotlari yuklanmadi", e); }
    return out;
  }

  function totals(srv) {
    const bonus = {};
    srv.game.concat(srv.qw, srv.ts).forEach((r) => { const k = norm(r.student_name); bonus[k] = (bonus[k] || 0) + Number(r.stars || 1); });
    const rows = STUDENTS.map((s) => ({ ...s, total: s.base + (bonus[norm(s.name)] || 0) })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "uz"));
    rows.forEach((r, i) => { r.rank = i && r.total === rows[i - 1].total ? rows[i - 1].rank : i + 1; });
    return rows;
  }

  function title(stars, max) {
    if (stars <= 0) return ["😴", "Uyg‘onish vaqti!"];
    if (stars >= max) return ["🏆", "A’lochi"];
    if (stars >= max * 0.5) return ["📖", "Kitobxon"];
    if (stars >= max * 0.2) return ["💪", "Mehnatkash"];
    return ["🚀", "Harakatda"];
  }

  function countUp(el, to) {
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1300); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // ---------- Profil ----------
  async function profileView(me) {
    app.innerHTML = `<div class="pf-loading"><span class="g-spinner"></span><p>Statistika yuklanmoqda…</p></div>`;
    const srv = await loadServer();
    const rows = totals(srv);
    const meRow = rows.find((r) => r.name === me.name) || { name: me.name, cls: me.cls, base: 0, total: 0, rank: rows.length };
    const k = norm(me.name);
    const max = Math.max(1, rows[0] ? rows[0].total : 1);
    const clsRows = rows.filter((r) => r.cls === meRow.cls);
    const clsRank = clsRows.findIndex((r) => r.name === me.name) + 1;
    const clsAvg = clsRows.reduce((a, r) => a + r.total, 0) / Math.max(1, clsRows.length);
    const above = rows.filter((r) => r.total > meRow.total).sort((a, b) => a.total - b.total)[0];
    const pct = Math.round(((rows.length - meRow.rank) / Math.max(1, rows.length - 1)) * 100);
    const [tIc, tName] = title(meRow.total, max);

    const myGame = srv.game.filter((r) => norm(r.student_name) === k);
    const myQ = srv.qw.filter((r) => norm(r.student_name) === k);
    const byGame = {};
    myGame.forEach((r) => (byGame[r.game] = (byGame[r.game] || 0) + Number(r.stars || 1)));
    const qStars = myQ.reduce((a, r) => a + Number(r.stars || 1), 0);
    const myT = srv.ts.filter((r) => norm(r.student_name) === k);
    const tStars = myT.reduce((a, r) => a + Number(r.stars || 0), 0);
    const gStars = Object.values(byGame).reduce((a, b) => a + b, 0);
    // Shu qurilmadagi (internetga yozilmagan) o'yin yulduzlari
    let localG = 0;
    try { localG = (JSON.parse(localStorage.getItem("sofi_game_stars_v1")) || {}).total?.[me.name] || 0; } catch (e) { localG = 0; }

    const parts = [
      ["📚", "Darslar va faollik", meRow.base, "#22c55e"],
      ["👨‍🏫", "Ustoz bergan yulduzlar", tStars, "#0ea5e9"],
      ["🏆", "Musobaqalar (kunlik savol)", qStars, "#f59e0b"],
      ...Object.entries(GAME).map(([g, [ic, nm]]) => [ic, nm, byGame[g] || 0, g === "master" ? "#ef4444" : "#a78bfa"])
    ];
    const sumParts = Math.max(1, parts.reduce((a, p) => a + Math.max(0, p[2]), 0));

    // Faollik: so'nggi 30 kun
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate() - i); days.push(d.toISOString().slice(0, 10)); }
    const perDay = Object.fromEntries(days.map((d) => [d, 0]));
    myGame.forEach((r) => { const d = String(r.day || r.created_at || "").slice(0, 10); if (d in perDay) perDay[d] += Number(r.stars || 1); });
    myQ.forEach((r) => { const d = String(r.created_at || r.day || "").slice(0, 10); if (d in perDay) perDay[d] += Number(r.stars || 1); });
    myT.forEach((r) => { const d = String(r.created_at || "").slice(0, 10); if (d in perDay && r.stars > 0) perDay[d] += Number(r.stars); });
    const mres = srv.mres.filter((r) => norm(r.student_name) === k);
    mres.forEach((r) => { const d = String(r.created_at || "").slice(0, 10); if (d in perDay) perDay[d] += 0; });
    const actMax = Math.max(1, ...Object.values(perDay));
    const activeDays = Object.values(perDay).filter((v) => v > 0).length;

    // Matematika Master
    const topics = {};
    mres.forEach((r) => {
      const t = topics[r.topic] || (topics[r.topic] = { tries: 0, best: null });
      t.tries++;
      if (!t.best || r.points > t.best.points) t.best = r;
    });
    const mPlace = (topic) => {
      const by = {};
      srv.mres.filter((r) => r.topic === topic).forEach((r) => { if (!by[r.student_name] || r.points > by[r.student_name]) by[r.student_name] = r.points; });
      const sorted = Object.entries(by).sort((a, b) => b[1] - a[1]);
      return { place: sorted.findIndex(([n]) => n === me.name) + 1, of: sorted.length };
    };
    const mWins = srv.mwin.filter((w) => norm(w.student_name) === k);
    const mCorrect = mres.reduce((a, r) => a + r.correct, 0), mTotalQ = mres.length * 10;

    // Do'kon
    const products = (D.products || []).slice().sort((a, b) => a.stars - b.stars);
    const can = products.filter((p) => p.stars <= meRow.total);
    const goal = products.find((p) => p.stars > meRow.total);

    // Yutuqlar
    const ach = [
      ["⭐", "Birinchi yulduz", meRow.total >= 1],
      ["🔟", "10 ta yulduz", meRow.total >= 10],
      ["💯", "50 ta yulduz", meRow.total >= 50],
      ["🥇", "Sinfda 1-o‘rin", clsRank === 1],
      ["🏅", "Umumiy TOP-10", meRow.rank <= 10],
      ["🎮", "O‘yinlardan yulduz", gStars > 0 || localG > 0],
      ["🏆", "Musobaqa g‘olibi", qStars > 0],
      ["🧠", "Master: 10/10", mres.some((r) => r.correct === 10)],
      ["👑", "Master marafon g‘olibi", mWins.length > 0],
      ["🔥", "5 kun faol", activeDays >= 5]
    ];

    app.innerHTML = `
      <section class="pf-hero" style="--c:${CLS_C[meRow.cls] || "#22c55e"}">
        <div class="pf-ava"><span>${esc(me.name.split(" ").map((p) => p[0]).join("").slice(0, 2))}</span><i>${tIc}</i></div>
        <div class="pf-who">
          <span class="pf-kicker">${esc(meRow.cls)} · ${tIc} ${esc(tName)}</span>
          <h1>${esc(me.name)}</h1>
          <div class="pf-big"><b id="pfStars">0</b><span>⭐ jami yulduz</span></div>
          <div class="pf-ranks">
            <div><b>${meRow.rank}</b><small>umumiy o‘rin / ${rows.length}</small></div>
            <div><b>${clsRank}</b><small>sinfda / ${clsRows.length}</small></div>
            <div><b>${pct}%</b><small>o‘quvchidan yaxshi</small></div>
          </div>
          <div class="pf-next">${above ? `Keyingi o‘ringa (${esc(above.name.split(" ")[1] || above.name)}) yetish uchun yana <b>${above.total - meRow.total} ⭐</b> kerak` : "🎉 Siz eng yuqori o‘rindasiz!"}</div>
        </div>
      </section>

      ${srv.ok ? "" : `<p class="pf-warn">⚠️ Internet bazasiga ulanib bo‘lmadi — faqat asosiy (dars) yulduzlari ko‘rsatilmoqda.</p>`}

      <div class="pf-grid">
        <section class="pf-card">
          <h2>⭐ Yulduzlar qayerdan?</h2>
          <div class="pf-bar">${parts.filter((p) => p[2] > 0).map((p) => `<i style="width:${(p[2] / sumParts) * 100}%;background:${p[3]}" title="${esc(p[1])}: ${p[2]}"></i>`).join("") || `<i style="width:100%;background:rgba(255,255,255,.08)"></i>`}</div>
          <ul class="pf-list">${parts.map((p) => `<li><span>${p[0]} ${esc(p[1])}</span><b style="color:${p[3]}">${p[2]}</b></li>`).join("")}
            ${localG ? `<li class="muted"><span>📱 Shu qurilmadagi o‘yin yulduzlari (serverga yozilmagan)</span><b>${localG}</b></li>` : ""}</ul>
        </section>

        <section class="pf-card">
          <h2>📊 Sinfdoshlar bilan solishtirish</h2>
          ${[["Siz", meRow.total, CLS_C[meRow.cls] || "#22c55e"], ["Sinf o‘rtachasi", Math.round(clsAvg * 10) / 10, "#94a3b8"], ["Sinf yetakchisi", clsRows[0] ? clsRows[0].total : 0, "#f5c84c"], ["Markaz yetakchisi", max, "#ef4444"]]
            .map(([l, v, c]) => `<div class="pf-cmp"><span>${l}</span><div><i style="width:${(v / max) * 100}%;background:${c}"></i></div><b>${v}</b></div>`).join("")}
          <p class="pf-muted">${meRow.total >= clsAvg ? "👍 Siz sinf o‘rtachasidan yuqorisiz!" : `Sinf o‘rtachasiga yetish uchun ${Math.ceil(clsAvg - meRow.total)} ⭐ yetishmayapti.`}</p>
        </section>

        <section class="pf-card wide">
          <h2>📅 So‘nggi 30 kunlik faollik</h2>
          <div class="pf-act">${days.map((d) => `<i style="height:${perDay[d] ? 14 + (perDay[d] / actMax) * 66 : 6}px" class="${perDay[d] ? "on" : ""}" title="${d}: ${perDay[d]} ⭐"></i>`).join("")}</div>
          <p class="pf-muted">${activeDays} kun yulduz olgansiz. ${activeDays >= 5 ? "Zo‘r davom eting! 🔥" : "Har kuni ozgina — katta natija!"}</p>
        </section>

        <section class="pf-card wide">
          <h2>🏅 Matematika Master marafoni</h2>
          ${mres.length ? `
            <div class="pf-stats4">
              <div><b>${Object.keys(topics).length}</b><small>mavzu</small></div>
              <div><b>${mres.length}</b><small>urinish</small></div>
              <div><b>${mTotalQ ? Math.round((mCorrect / mTotalQ) * 100) : 0}%</b><small>to‘g‘ri javoblar</small></div>
              <div><b>${mWins.length}</b><small>g‘alaba 👑</small></div>
            </div>
            <table class="pf-table"><tr><th>Mavzu</th><th>Urinish</th><th>Eng yaxshi</th><th>Ball</th><th>O‘rin</th></tr>
              ${Object.entries(topics).map(([t, v]) => { const pl = mPlace(t); return `<tr><td>${esc(MASTER_T[t] || t)}${mWins.some((w) => w.topic === t) ? " 👑" : ""}</td><td>${v.tries}/2</td><td>${v.best.correct}/10</td><td>${v.best.points}</td><td>${pl.place ? `${pl.place}/${pl.of}` : "—"}</td></tr>`; }).join("")}
            </table>` : `<p class="pf-muted">Hali marafonda qatnashmadingiz. <a href="games.html">O‘yinlar → Matematika Master</a></p>`}
        </section>

        <section class="pf-card">
          <h2>🎁 Do‘kon</h2>
          <p>Yulduzlaringizga hozir <b>${can.length}</b> ta sovg‘a olsa bo‘ladi.</p>
          ${goal ? `<div class="pf-goal"><span>${esc(goal.icon)}</span><div><b>${esc(goal.name)}</b><small>${fmt(goal.stars)} ⭐ · yana ${fmt(goal.stars - meRow.total)} ⭐</small><div class="pf-prog"><i style="width:${Math.min(100, (meRow.total / goal.stars) * 100)}%"></i></div></div></div>` : `<p>🎉 Barcha sovg‘alarga yulduzingiz yetadi!</p>`}
          <a class="pf-link" href="shop.html">Do‘konga o‘tish →</a>
        </section>

        <section class="pf-card">
          <h2>🏆 Yutuqlar <small>${ach.filter((a) => a[2]).length}/${ach.length}</small></h2>
          <div class="pf-ach">${ach.map(([ic, nm, ok]) => `<div class="${ok ? "on" : ""}"><span>${ok ? ic : "🔒"}</span><small>${esc(nm)}</small></div>`).join("")}</div>
        </section>

        ${(() => {
          let list = srv.chess && srv.chess.length ? srv.chess : [];
          if (!list.length) { try { list = Object.values((JSON.parse(localStorage.getItem("sofi_chess_local_v1")) || {}).ratings || {}).sort((a, b) => b.rating - a.rating); } catch (e) { list = []; } }
          const ranked = list.filter((r) => r.games > 0);
          const c = list.find((r) => norm(r.name) === norm(meRow.name));
          if (!c || !c.games) return `<section class="pf-card"><h2>♞ Shaxmat reytingi</h2><p>Hali shaxmat o‘ynamagansiz. Boshlang‘ich reyting: <b>1200</b>.</p><a class="pf-link" href="games.html">Do‘st bilan o‘ynash →</a></section>`;
          const place = ranked.findIndex((r) => norm(r.name) === norm(meRow.name)) + 1;
          return `<section class="pf-card"><h2>♞ Shaxmat reytingi</h2>
            <p style="font-size:34px;margin:4px 0;font-weight:900;color:#22c55e">${c.rating}</p>
            <p>${place ? `<b>${place}-o‘rin</b> (${ranked.length} o‘yinchi) · ` : ""}eng yuqori: <b>${c.best || c.rating}</b></p>
            <p>${c.games} o‘yin · ✅ ${c.wins} g‘alaba · 🤝 ${c.draws} durang · ❌ ${c.losses} mag‘lubiyat</p>
            <a class="pf-link" href="games.html">Shaxmat o‘ynash →</a></section>`;
        })()}
        ${myT.length ? `<section class="pf-card wide"><h2>👨‍🏫 Ustozlardan yulduzlar</h2><ul class="pf-list">${myT.slice(0, 15).map((r) => `<li><span>${esc(r.reason || "—")} <small class="pf-muted">· ${esc(r.teacher || "")} · ${String(r.created_at).slice(0, 10)}</small></span><b style="color:${r.stars > 0 ? "#22c55e" : "#f87171"}">${r.stars > 0 ? "+" : ""}${r.stars}</b></li>`).join("")}</ul></section>` : ""}
        ${meRow.result && !/hali kiritilmagan/i.test(meRow.result) ? `<section class="pf-card wide"><h2>📝 Ustoz izohi</h2><p>${esc(meRow.result)}</p></section>` : ""}
      </div>`;
    countUp($("#pfStars"), meRow.total);
  }

  // ---------- Ustoz: yulduz qo'shish ----------
  let pinCache = null;
  function teacherView(me) {
    const classes = [...new Set(STUDENTS.map((s) => s.cls))];
    let cls = classes[0];
    const picked = new Set();
    let amount = 1, reason = "Uy vazifasi";
    const REASONS = ["Uy vazifasi", "Darsda faollik", "Test natijasi", "Olimpiada / musobaqa", "Namunali xulq", "Jarima (qoidabuzarlik)"];
    app.innerHTML = `
      <section class="pf-login wide">
        <div class="pf-lock">👨‍🏫</div>
        <h1>Salom, <span>${esc(me.name)}</span></h1>
        <p>O‘quvchilarga yulduz qo‘shing yoki istalgan o‘quvchining profilini ko‘ring.</p>
      </section>
      <section class="pf-card pf-give">
        <h2>⭐ Yulduz berish</h2>
        <div class="pf-tabs" id="pfCls"></div>
        <div class="pf-pick" id="pfPick"></div>
        <div class="pf-row"><button type="button" class="pf-mini" id="pfAll">Hammasini tanlash</button><button type="button" class="pf-mini" id="pfNone">Tozalash</button><span class="pf-muted" id="pfCount"></span></div>
        <h3>Nechta yulduz?</h3>
        <div class="pf-tabs" id="pfAmt">${[1, 2, 3, 5, 10, -1, -2].map((v) => `<button type="button" data-v="${v}" class="${v === amount ? "on" : ""} ${v < 0 ? "neg" : ""}">${v > 0 ? "+" : ""}${v} ⭐</button>`).join("")}</div>
        <h3>Sabab</h3>
        <div class="pf-tabs" id="pfWhy">${REASONS.map((r) => `<button type="button" class="${r === reason ? "on" : ""}">${esc(r)}</button>`).join("")}</div>
        <input class="pf-select" id="pfWhyTxt" maxlength="100" placeholder="Yoki o‘z izohingizni yozing (ixtiyoriy)">
        <button class="pf-btn" type="button" id="pfGive">⭐ Yulduz berish</button>
        <p class="pf-muted" id="pfMsg"></p>
      </section>
      <section class="pf-card pf-gt" id="pfGT"><h2>🎮 O‘yinga kirish testi <small>“Ovchi” o‘yini</small></h2><p class="pf-muted">Yuklanmoqda…</p></section>
      <section class="pf-card pf-gt" id="pfCT"><h2>📋 Sinf testlari <small>barcha o‘yinlarni yopadi</small></h2><p class="pf-muted">Yuklanmoqda…</p></section>
      <section class="pf-card"><h2>🕘 So‘nggi berilgan yulduzlar</h2><div id="pfHist"><p class="pf-muted">Yuklanmoqda…</p></div></section>
      <section class="pf-card">
        <h2>👀 O‘quvchi profilini ko‘rish</h2>
        <select id="pfSel" class="pf-select">${STUDENTS.map((s) => `<option value="${esc(s.name)}">${esc(s.cls)} — ${esc(s.name)}</option>`).join("")}</select>
        <button class="pf-btn" type="button" id="pfSee">Profilni ochish</button>
      </section>`;
    const drawPick = () => {
      $("#pfCls").innerHTML = classes.map((c) => `<button type="button" data-c="${esc(c)}" class="${c === cls ? "on" : ""}">${esc(c)}</button>`).join("");
      $("#pfPick").innerHTML = STUDENTS.filter((s) => s.cls === cls).map((s) => `<button type="button" data-n="${esc(s.name)}" class="${picked.has(s.name) ? "on" : ""}">${picked.has(s.name) ? "✓ " : ""}${esc(s.name)}</button>`).join("");
      $("#pfCount").textContent = picked.size ? `${picked.size} ta o‘quvchi tanlandi` : "O‘quvchi tanlanmagan";
    };
    drawPick();
    app.addEventListener("click", (e) => {
      const c = e.target.closest("#pfCls [data-c]"); if (c) { cls = c.dataset.c; drawPick(); }
      const n = e.target.closest("#pfPick [data-n]"); if (n) { picked.has(n.dataset.n) ? picked.delete(n.dataset.n) : picked.add(n.dataset.n); drawPick(); }
      const v = e.target.closest("#pfAmt [data-v]"); if (v) { amount = +v.dataset.v; app.querySelectorAll("#pfAmt button").forEach((b) => b.classList.toggle("on", b === v)); }
      const w = e.target.closest("#pfWhy button"); if (w) { reason = w.textContent; app.querySelectorAll("#pfWhy button").forEach((b) => b.classList.toggle("on", b === w)); $("#pfWhyTxt").value = ""; }
    });
    $("#pfAll").onclick = () => { STUDENTS.filter((s) => s.cls === cls).forEach((s) => picked.add(s.name)); drawPick(); };
    $("#pfNone").onclick = () => { picked.clear(); drawPick(); };
    $("#pfSee").onclick = () => { const s = STUDENTS.find((x) => x.name === $("#pfSel").value); profileView({ name: s.name, cls: s.cls }).then(() => app.insertAdjacentHTML("afterbegin", `<p class="pf-warn">👨‍🏫 Ustoz rejimi: ${esc(s.name)} profili. <a href="profile.html">← Ustoz paneli</a></p>`)); };
    const history = async () => {
      const srv = await loadServer();
      const box = $("#pfHist");
      if (!box) return;
      box.innerHTML = srv.ts.length ? `<ul class="pf-list">${srv.ts.slice(0, 25).map((r) => `<li><span><b>${esc(r.student_name)}</b> <small class="pf-muted">· ${esc(r.reason || "")} · ${esc(r.teacher || "")} · ${String(r.created_at).slice(5, 16).replace("T", " ")}</small></span><b style="color:${r.stars > 0 ? "#22c55e" : "#f87171"}">${r.stars > 0 ? "+" : ""}${r.stars}</b></li>`).join("")}</ul>` : `<p class="pf-muted">${srv.ok ? "Hali yulduz berilmagan." : "Internet bazasiga ulanib bo‘lmadi."}</p>`;
    };
    history();
    gameTestPanel(me); classTestsPanel();
    $("#pfGive").onclick = async () => {
      const msg = $("#pfMsg");
      if (!picked.size) { msg.textContent = "Avval o‘quvchini tanlang."; return; }
      const why = $("#pfWhyTxt").value.trim() || reason;
      if (!confirm(`${picked.size} ta o‘quvchiga ${amount > 0 ? "+" : ""}${amount} ⭐ (${why}). Tasdiqlaysizmi?`)) return;
      if (!pinCache) { const p = prompt("Tasdiqlash uchun ustoz parolini kiriting:"); if (!p) return; pinCache = p.trim(); }
      const cfg = window.SUFIOLLOHYOR_CONFIG || {};
      try {
        const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
        const { data, error } = await db.rpc("teacher_add_stars", { p_pin: pinCache, p_teacher: me.name, p_students: [...picked], p_stars: amount, p_reason: why });
        if (error) throw error;
        msg.innerHTML = `✅ ${data} ta o‘quvchiga ${amount > 0 ? "+" : ""}${amount} ⭐ berildi. Reyting, do‘kon va profillarda darhol ko‘rinadi.`;
        picked.clear(); drawPick(); history();
      } catch (e) {
        const t = String(e.message || e);
        if (/parol/i.test(t)) pinCache = null;
        msg.textContent = /teacher_add_stars|function|schema cache/i.test(t) ? "⚠️ Supabase’da teacher-stars.sql hali ishga tushirilmagan." : "Xatolik: " + t;
      }
    };
  }

  /* ---------- Ustoz: o'yinga kirish testi va sinf testlari ---------- */
  const loadJS = (src) => new Promise((res, rej) => { const sc = document.createElement("script"); sc.src = src; sc.onload = res; sc.onerror = () => rej(new Error(src)); document.head.appendChild(sc); });
  const askPin = async () => { if (!pinCache) { const p = prompt("Tasdiqlash uchun ustoz parolini kiriting:"); if (!p) return null; pinCache = p.trim(); } return pinCache; };
  async function gameTestPanel(me) {
    const box = $("#pfGT"); if (!box) return;
    try {
      if (!window.SofiGameSettings) await loadJS("game-settings.js?v=1");
      if (!window.SofiOvchiBank) await loadJS("games/ovchi-bank.js?v=1");
    } catch (e) { box.querySelector("p").textContent = "Yuklab bo‘lmadi. Internetni tekshiring."; return; }
    const GS = window.SofiGameSettings, BANK = window.SofiOvchiBank || {};
    let all = (await GS.get("ovchi_test")) || {};
    const CLS = ["5", "6", "7", "8", "9", "10", "11"].filter((k) => (BANK[k] || []).length);
    let cls = CLS.includes(String(parseInt((STUDENTS[0] || {}).cls) || "")) ? String(parseInt(STUDENTS[0].cls)) : CLS[0], q = "";
    const def = () => ({ mode: "auto", topics: [], n: 5, pass: 80 });
    const cur = () => (all[cls] = Object.assign(def(), all[cls] || {}));
    const draw = () => {
      const c = cur(), bank = BANK[cls] || [];
      const groups = {}; bank.forEach((b) => { const g = (b.s || "") + " · " + (b.sec || ""); (groups[g] = groups[g] || []).push(b); });
      box.innerHTML = `<h2>🎮 O‘yinga kirish testi <small>“Ovchi” o‘yini</small></h2>
        <p class="pf-muted" style="margin:0 0 10px">O‘quvchi ovga chiqishdan oldin shu sozlama bo‘yicha test topshiradi. ${GS.shared ? "Sozlama internetda saqlanadi — hamma o‘quvchiga ta’sir qiladi." : "⚠️ Hozircha faqat shu qurilmada saqlanadi: Supabase’da <b>game-settings.sql</b> ishga tushirilmagan."}</p>
        <div class="pf-tabs" data-gt="cls">${CLS.map((k) => `<button type="button" data-k="${k}" class="${k === cls ? "on" : ""}">${k}-sinf${all[k] && all[k].mode === "off" ? " 🚫" : all[k] && all[k].mode === "topics" ? " ✏️" : ""}</button>`).join("")}</div>
        <h3>Test</h3>
        <div class="pf-tabs" data-gt="mode">${[["auto", "🤖 Avtomatik (dars rejasi / chorak)"], ["topics", "✏️ Mavzularni o‘zim tanlayman"], ["off", "🚫 Testsiz kirish"]].map(([m, t]) => `<button type="button" data-m="${m}" class="${c.mode === m ? "on" : ""}">${t}</button>`).join("")}</div>
        ${c.mode === "off" ? `<p class="pf-muted">${cls}-sinf o‘quvchilari “Ovchi” o‘yiniga testsiz kiradi.</p>` : `
        <h3>Savollar soni</h3><div class="pf-tabs" data-gt="n">${[3, 5, 7, 10].map((n) => `<button type="button" data-n="${n}" class="${c.n === n ? "on" : ""}">${n} ta</button>`).join("")}</div>
        <h3>O‘tish uchun</h3><div class="pf-tabs" data-gt="pass">${[60, 70, 80, 100].map((p) => `<button type="button" data-p="${p}" class="${c.pass === p ? "on" : ""}">${p}%</button>`).join("")}</div>
        <p class="pf-muted">${c.n} ta savoldan kamida <b>${Math.max(1, Math.ceil(c.n * c.pass / 100))} ta</b> to‘g‘ri javob kerak.</p>`}
        ${c.mode === "topics" ? `<h3>Mavzular <small class="pf-muted">(${c.topics.length} ta tanlandi)</small></h3>
          <input class="pf-select" data-gt="q" placeholder="🔎 Mavzu qidirish" value="${esc(q)}">
          <div class="pf-gt-list">${Object.keys(groups).map((g) => { const items = groups[g].filter((b) => !q || b.t.toLowerCase().includes(q.toLowerCase())); return items.length ? `<b class="pf-gt-g">${esc(g)}</b>${items.map((b) => `<label class="pf-gt-t"><input type="checkbox" data-t="${esc(b.t)}" ${c.topics.includes(b.t) ? "checked" : ""}><span>${esc(b.t)}</span><small>${b.q.length} savol</small></label>`).join("")}` : ""; }).join("") || `<p class="pf-muted">Mavzu topilmadi.</p>`}</div>` : ""}
        <button class="pf-btn" type="button" data-gt="save">💾 Saqlash</button>
        <p class="pf-muted" data-gt="msg">${all._by ? `Oxirgi o‘zgartirish: ${esc(all._by)}${all._at ? " · " + String(all._at).slice(0, 16).replace("T", " ") : ""}` : ""}</p>`;
    };
    draw();
    box.addEventListener("click", async (e) => {
      const b = e.target.closest("button, input[type=checkbox]"); if (!b) return;
      const grp = b.closest("[data-gt]") && b.closest("[data-gt]").dataset.gt, c = cur();
      if (grp === "cls") { cls = b.dataset.k; q = ""; draw(); }
      else if (grp === "mode") { c.mode = b.dataset.m; draw(); }
      else if (grp === "n") { c.n = +b.dataset.n; draw(); }
      else if (grp === "pass") { c.pass = +b.dataset.p; draw(); }
      else if (b.dataset.t !== undefined) { const t = b.dataset.t; c.topics = b.checked ? [...new Set([...c.topics, t])] : c.topics.filter((x) => x !== t); box.querySelector("h3 small") && (box.querySelector("h3 small").textContent = `(${c.topics.length} ta tanlandi)`); }
      else if (b.dataset.gt === "save") {
        const msg = box.querySelector("[data-gt=msg]");
        if (c.mode === "topics" && !c.topics.length) { msg.textContent = "Kamida bitta mavzu tanlang."; return; }
        const pin = await askPin(); if (!pin) return;
        msg.textContent = "Saqlanmoqda…";
        try { await GS.set(pin, me.name, "ovchi_test", all); msg.innerHTML = `✅ Saqlandi: ${cls}-sinf — ${c.mode === "off" ? "testsiz" : c.mode === "topics" ? `${c.topics.length} ta mavzu, ${c.n} savol, ${c.pass}%` : `avtomatik, ${c.n} savol, ${c.pass}%`}. O‘quvchilar keyingi kirishda yangi testni topshiradi.`; draw(); box.querySelector("[data-gt=msg]").innerHTML = msg.innerHTML; }
        catch (err) { if (/Parol/i.test(err.message)) pinCache = null; msg.textContent = "Xatolik: " + err.message; }
      }
    });
    box.addEventListener("input", (e) => { if (e.target.dataset.gt === "q") { q = e.target.value; const pos = e.target.selectionStart; draw(); const inp = box.querySelector("[data-gt=q]"); inp.focus(); inp.setSelectionRange(pos, pos); } });
  }
  async function classTestsPanel() {
    const box = $("#pfCT"); if (!box) return;
    try { if (!window.SofiTests) await loadJS("amaliy/ctest.js?v=1"); } catch (e) { box.querySelector("p").textContent = "Yuklab bo‘lmadi."; return; }
    const T = window.SofiTests;
    const draw = async () => {
      let tests = [];
      try { tests = await T.listActive(); } catch (e) { box.innerHTML = `<h2>📋 Sinf testlari</h2><p class="pf-muted">Yuklab bo‘lmadi: ${esc(e.message)}</p>`; return; }
      box.innerHTML = `<h2>📋 Sinf testlari <small>barcha o‘yinlarni yopadi</small></h2>
        <p class="pf-muted" style="margin:0 0 10px">Faol sinf testi bo‘lsa, o‘quvchi undan o‘tmaguncha hech bir o‘yinga kira olmaydi. Keragi bo‘lmasa — yoping.</p>
        ${tests.length ? `<ul class="pf-list">${tests.map((t) => `<li><span><b>${esc(t.cls)}</b> · ${esc(t.title)} <small class="pf-muted">· ⏱ ${t.minutes} daq · 🎯 ${t.pass_pct}% · ${esc(t.teacher || "")}</small></span><button type="button" class="pf-mini" data-close="${t.id}">🗑 Yopish</button></li>`).join("")}</ul>` : `<p class="pf-muted">Hozir faol sinf testi yo‘q — o‘yinlar ochiq.</p>`}
        <div class="pf-row"><a class="pf-mini" href="amaliy.html">➕ Yangi test berish (Amaliy darslar → mavzu)</a><a class="pf-mini" href="amaliy.html#tests">📊 Natijalar</a></div>
        <p class="pf-muted" data-ct="msg"></p>`;
    };
    await draw();
    box.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-close]"); if (!b) return;
      if (!confirm("Testni yopasizmi? O‘quvchilar uchun o‘yinlar yana ochiladi, natijalar saqlanib qoladi.")) return;
      const pin = await askPin(); if (!pin) return;
      try { await T.cancel(pin, Number(b.dataset.close)); await draw(); box.querySelector("[data-ct=msg]").textContent = "✅ Test yopildi."; }
      catch (err) { if (/Parol/i.test(err.message)) pinCache = null; box.querySelector("[data-ct=msg]").textContent = "Xatolik: " + err.message; }
    });
  }

  function render() {
    topBar();
    const me = A && A.me();
    if (!me) return loginView();
    if (me.role === "teacher") return teacherView(me);
    profileView(me);
  }
  document.addEventListener("sofi:auth", topBar);
  render();
})();

