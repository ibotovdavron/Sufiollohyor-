/* Amaliy darslar: sinf testlari interfeysi.
   - Dars sahifasida ustoz uchun "Sinfga test qilib berish"
   - #test/ID — o'quvchi vaqtli testni topshiradi
   - #tests  — ustoz natijalarni kuzatadi */
(() => {
  "use strict";
  const { h, rich } = window.AK;
  const DB = window.AMALIY;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const T = () => window.SofiTests;
  const Auth = () => window.SofiAuth;
  const CD = () => window.CENTER_DATA || {};
  const fx = () => window.AMALIY_FX || {};
  const byNum = (a, b) => parseInt(a) - parseInt(b) || String(a).localeCompare(String(b));
  const groups = () => [...new Set((CD().students || []).map((s) => s.group))].sort(byNum);
  const roster = (cls) => (CD().students || []).filter((s) => s.group === cls).map((s) => s.name);
  const teachers = () => (CD().teachers || []).filter((t) => !/^Ustoz \d+$/.test(t.name));
  const fmtT = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const fmtD = (iso) => { try { const d = new Date(iso); return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "2-digit" }) + " " + d.toTimeString().slice(0, 5); } catch (e) { return ""; } };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const findTopic = (key) => {
    const [c, s_, t] = String(key || "").split("/");
    const cls = DB.classes.find((x) => x.id === c), sub = cls && cls.subjects.find((x) => x.id === s_);
    const top = sub && sub.topics.find((x) => x.id === t);
    return top ? { cls, sub, t: top, href: `#${c}/${s_}/${t}` } : null;
  };

  /* ---------- Modal ---------- */
  function modal(html) {
    const el = h("div", { class: "ct-modal" });
    el.innerHTML = `<div class="ct-card" role="dialog" aria-modal="true"><button class="ct-x" type="button" aria-label="Yopish">✕</button>${html}</div>`;
    document.body.append(el);
    const close = () => el.remove();
    el.addEventListener("click", (e) => { if (e.target === el || e.target.closest(".ct-x")) close(); });
    return { el, card: el.firstElementChild, close };
  }

  /* ================= Ustoz: biriktirish ================= */
  function openAssign(cls, sub, topic) {
    const me = Auth() && Auth().me();
    const isT = me && me.role === "teacher";
    const tlist = teachers();
    const gs = groups();
    const match = (g) => (isNaN(cls.id) ? false : parseInt(g) === Number(cls.id));
    const { card, close } = modal(`
      <h2>📝 Sinfga test qilib berish</h2>
      <p class="ct-sub">O‘quvchilar shu testdan o‘tmaguncha o‘yinlar ochilmaydi.</p>
      <form class="ct-form">
        <label class="ct-f"><span>Test nomi</span><input name="title" maxlength="150" value="${esc(topic.title)}"></label>
        <div class="ct-f"><span>Qaysi sinflarga?</span><div class="ct-chips">${gs.map((g) => `<label class="ct-chip"><input type="checkbox" name="cls" value="${esc(g)}" ${match(g) ? "checked" : ""}><b>${esc(g)}</b><small>${roster(g).length} o‘quvchi</small></label>`).join("")}</div></div>
        <div class="ct-f"><span>Mavzular <small>(bir nechtasini birlashtirish mumkin)</small></span>
          <input class="ct-find" type="search" placeholder="🔎 Mavzu qidirish...">
          <div class="ct-topics">${sub.topics.map((t) => {
            const n = (t.quiz || []).length;
            return `<label class="ct-top ${n ? "" : "off"}"><input type="checkbox" name="top" value="${esc(t.id)}" ${t === topic ? "checked" : ""} ${n ? "" : "disabled"}><span>${esc(t.title)}</span><em>${n} savol</em></label>`;
          }).join("")}</div>
          <div class="ct-count"></div></div>
        <div class="ct-row">
          <label class="ct-f"><span>⏱ Vaqt (daqiqa)</span><input name="min" type="number" min="1" max="120" value="5"></label>
          <label class="ct-f"><span>🎯 O‘tish bali (%)</span><input name="pass" type="number" min="10" max="100" value="80"></label>
        </div>
        <div class="ct-row">
          <label class="ct-f"><span>👨‍🏫 Ustoz</span><select name="teacher" ${isT ? "disabled" : ""}>${tlist.map((t) => `<option ${isT && me.name === t.name ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select></label>
          <label class="ct-f"><span>🔑 Ustoz paroli</span><input name="pin" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Parol"></label>
        </div>
        <div class="ct-err" role="alert"></div>
        <button class="am-btn primary ct-go" type="submit">📌 Biriktirish</button>
      </form>`);
    const f = card.querySelector("form");
    const picked = () => [...f.querySelectorAll('input[name="top"]:checked')].map((i) => sub.topics.find((t) => t.id === i.value)).filter(Boolean);
    let autoMin = true;
    f.min.addEventListener("input", () => { autoMin = false; });
    const recount = () => {
      const tops = picked(), n = tops.reduce((a, t) => a + (t.quiz || []).length, 0);
      card.querySelector(".ct-count").innerHTML = `Tanlandi: <b>${tops.length}</b> mavzu · <b>${n}</b> savol${n && n < 5 ? ` <span class="warn">— kam, yana mavzu qo‘shing</span>` : ""}`;
      if (autoMin) f.min.value = Math.max(3, Math.min(60, Math.ceil(n * 1.2)));
      if (tops.length > 1 && f.title.dataset.edited !== "1") f.title.value = `${tops[0].title} va yana ${tops.length - 1} ta mavzu`;
      else if (tops.length === 1 && f.title.dataset.edited !== "1") f.title.value = tops[0].title;
    };
    f.title.addEventListener("input", () => { f.title.dataset.edited = "1"; });
    f.addEventListener("change", (e) => { if (e.target.name === "top") recount(); });
    card.querySelector(".ct-find").addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      card.querySelectorAll(".ct-top").forEach((l) => (l.hidden = !l.textContent.toLowerCase().includes(q)));
    });
    recount();
    f.onsubmit = async (e) => {
      e.preventDefault();
      const err = card.querySelector(".ct-err");
      err.textContent = "";
      const classes = [...f.querySelectorAll('input[name="cls"]:checked')].map((i) => i.value);
      const tops = picked();
      const questions = [];
      tops.forEach((t) => (t.quiz || []).forEach((q) => questions.push({ q: q.q, o: q.o, e: q.e || "" })));
      const teacherName = isT ? me.name : f.teacher.value;
      const pin = f.pin.value.trim();
      if (!classes.length) return (err.textContent = "Kamida bitta sinfni tanlang.");
      if (!questions.length) return (err.textContent = "Savoli bor mavzuni tanlang.");
      if (!pin) return (err.textContent = "Ustoz parolini kiriting.");
      const person = { name: teacherName, role: "teacher" };
      if (Auth() && !(await Auth().verify(person, pin))) { err.textContent = "Parol noto‘g‘ri."; f.pin.value = ""; return; }
      const btn = f.querySelector(".ct-go");
      btn.disabled = true; btn.textContent = "Saqlanmoqda...";
      try {
        await T().assign({
          pin, teacher: teacherName, classes, title: f.title.value.trim() || topic.title, subject: sub.name,
          topics: tops.map((t) => `${cls.id}/${sub.id}/${t.id}`), questions,
          minutes: Math.max(1, Math.min(120, Number(f.min.value) || 10)), pass: Math.max(10, Math.min(100, Number(f.pass.value) || 80)),
        });
        if (Auth() && !isT) Auth().save({ name: teacherName, cls: "Ustoz", role: "teacher" });
        card.innerHTML = `<div class="ct-ok"><span>✅</span><h2>Test biriktirildi!</h2>
          <p><b>${classes.map(esc).join(", ")}</b> o‘quvchilari endi o‘yinga kirishdan oldin ${questions.length} ta savollik testni topshiradi (o‘tish bali ${esc(f.pass.value)}%).</p>
          <a class="am-btn primary" href="#tests">📊 Natijalarni kuzatish</a></div>`;
        card.querySelector("a").addEventListener("click", close);
      } catch (ex) {
        err.textContent = ex.message || "Xatolik yuz berdi.";
        btn.disabled = false; btn.textContent = "📌 Biriktirish";
      }
    };
  }

  function lessonTools(box, cls, sub, topic) {
    if (!(topic.quiz || []).length && !sub.topics.some((t) => (t.quiz || []).length)) return;
    box.innerHTML = `<button class="ct-teach" type="button">👨‍🏫 Ustoz: shu mavzuni sinfga test qilib berish</button>`;
    box.firstElementChild.onclick = () => openAssign(cls, sub, topic);
  }

  /* ================= Bosh sahifa banneri ================= */
  async function homeBanner(root) {
    const me = Auth() && Auth().me();
    if (!me || !T()) return;
    const hero = root.querySelector(".am-hero");
    if (!hero) return;
    if (me.role === "teacher") {
      hero.after(h("a", { class: "ct-banner teach", href: "#tests", html: `<span class="i">📊</span><span><b>Sinf testlari natijalari</b><small>Qaysi o‘quvchi testdan o‘tdi — kuzatish</small></span><em>Ochish →</em>` }));
      return;
    }
    let list = [];
    try { list = await T().pending(me.name, me.cls); } catch (e) { return; }
    if (!list.length || !hero.isConnected) return;
    const t = list[0];
    hero.after(h("a", { class: "ct-banner", href: `#test/${t.id}`, html: `<span class="i">📝</span><span><b>Sizga test berildi: ${esc(t.title)}</b><small>⏱ ${t.minutes} daqiqa · o‘tish bali ${t.pass_pct}% · testdan o‘tgach o‘yinlar ochiladi${list.length > 1 ? ` · yana ${list.length - 1} ta test` : ""}</small></span><em>Boshlash →</em>` }));
  }

  /* ================= O'quvchi: test topshirish ================= */
  async function viewTest(root, id) {
    root.innerHTML = `<div class="ct-wrap"><div class="ct-load">⏳ Test yuklanmoqda...</div></div>`;
    const wrap = root.firstElementChild;
    let test;
    try { test = await T().get(Number(id)); } catch (e) { wrap.innerHTML = `<div class="ct-box"><h2>😕 Testni yuklab bo‘lmadi</h2><p>${esc(e.message)}</p><a class="am-btn ghost" href="#">← Amaliy darslar</a></div>`; return; }
    if (!test) { wrap.innerHTML = `<div class="ct-box"><h2>🔍 Test topilmadi</h2><a class="am-btn ghost" href="#">← Amaliy darslar</a></div>`; return; }
    const topicLinks = (test.topics || []).map(findTopic).filter(Boolean);
    const readHtml = topicLinks.length ? `<div class="ct-read"><span>📖 Mavzuni o‘qish:</span>${topicLinks.map((x) => `<a href="${x.href}">${esc(x.t.title)}</a>`).join("")}</div>` : "";
    const head = `<span class="tag">📝 Sinf testi · ${esc(test.cls)}</span><h1>${esc(test.title)}</h1>
      <div class="ct-facts"><span>❓ <b>${test.questions.length}</b> savol</span><span>⏱ <b>${test.minutes}</b> daqiqa</span><span>🎯 o‘tish: <b>${test.pass_pct}%</b></span>${test.teacher ? `<span>👨‍🏫 ${esc(test.teacher)}</span>` : ""}</div>`;

    if (!test.active) { wrap.innerHTML = `<div class="ct-box">${head}<p class="ct-note">Bu test ustoz tomonidan yopilgan.</p><a class="am-btn ghost" href="#">← Amaliy darslar</a></div>`; return; }

    let me = Auth() && Auth().me();
    const login = async () => { const u = await Auth().open({ title: "Testga kirish", teachers: true }); if (u) viewTest(root, id); };
    if (!me) {
      wrap.innerHTML = `<div class="ct-box">${head}<p class="ct-note">Testni topshirish uchun ismingiz va parolingiz bilan kiring.</p><button class="am-btn primary" type="button">🔐 Kirish</button></div>`;
      wrap.querySelector("button").onclick = login;
      return;
    }
    const practice = me.role === "teacher";
    if (!practice && me.cls !== test.cls) {
      wrap.innerHTML = `<div class="ct-box">${head}<p class="ct-note">Bu test <b>${esc(test.cls)}</b> o‘quvchilari uchun. Siz: ${esc(me.name)} (${esc(me.cls)}).</p><a class="am-btn ghost" href="#">← Amaliy darslar</a></div>`;
      return;
    }

    let past = [];
    if (!practice) { try { past = await T().results([test.id], me.name); } catch (e) { past = []; } }
    const passed = past.find((r) => r.passed);
    if (passed) {
      wrap.innerHTML = `<div class="ct-box win">${head}<div class="ct-big ok">✅ ${passed.pct}%</div><p class="ct-note">Siz bu testdan o‘tgansiz. Barakalla!</p><a class="am-btn primary" href="games.html">🎮 O‘yinlarga o‘tish</a></div>`;
      return;
    }
    const last = past[past.length - 1];
    const wait = last ? new Date(last.created_at).getTime() + T().COOLDOWN_MS - Date.now() : 0;
    const runKey = `sofi_ct_run_${test.id}_${me.name}`;
    let run = store.get(runKey);
    if (wait > 0 && !run) {
      wrap.innerHTML = `<div class="ct-box">${head}<div class="ct-big bad">${last.pct}%</div>
        <p class="ct-note">Oxirgi urinish: ${last.score}/${last.total}. Qayta topshirish uchun <b class="ct-wait">${fmtT(wait)}</b> kuting — bu vaqtda mavzuni yana bir bor o‘qib chiqing.</p>${readHtml}</div>`;
      const el = wrap.querySelector(".ct-wait"), until = Date.now() + wait;
      const iv = setInterval(() => { if (!el.isConnected) return clearInterval(iv); const left = until - Date.now(); if (left <= 0) { clearInterval(iv); viewTest(root, id); } else el.textContent = fmtT(left); }, 1000);
      return;
    }

    const start = () => {
      run = { start: Date.now(), seed: (Math.random() * 2 ** 31) | 0, ans: [] };
      if (!practice) store.set(runKey, run);
      exam();
    };

    if (!run) {
      wrap.innerHTML = `<div class="ct-box">${head}
        <ul class="ct-rules">
          <li>⏱ Vaqt <b>${test.minutes} daqiqa</b>. “Boshlash”ni bosganingizdan keyin vaqt to‘xtamaydi — sahifani yopsangiz ham.</li>
          <li>☝️ Har bir savolga bir marta javob berasiz, javobni o‘zgartirib bo‘lmaydi.</li>
          <li>🎯 <b>${test.pass_pct}%</b> va undan ko‘p to‘g‘ri javob bersangiz — o‘tdingiz, o‘yinlar ochiladi.</li>
          <li>🔁 O‘ta olmasangiz, 10 daqiqadan keyin qayta topshirasiz.</li>
        </ul>
        ${practice ? `<p class="ct-note">👨‍🏫 Siz ustozsiz — test sinov rejimida ochiladi, natija saqlanmaydi.</p>` : `<p class="ct-note">O‘quvchi: <b>${esc(me.name)}</b> (${esc(me.cls)})</p>`}
        ${readHtml}
        <button class="am-btn primary ct-start" type="button">🚀 Testni boshlash</button></div>`;
      wrap.querySelector(".ct-start").onclick = start;
      return;
    }
    exam();

    function exam() {
      const r = rng(run.seed);
      const order = shuffle(test.questions.map((_, i) => i), r);
      const opts = order.map((qi) => shuffle(test.questions[qi].o.map((o, i) => ({ o, ok: i === 0 })), r));
      const deadline = run.start + test.minutes * 60000;
      let finished = false;
      wrap.innerHTML = `<div class="ct-exam">
        <div class="ct-bar"><div class="ct-timer"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="v" cx="22" cy="22" r="19"/></svg><b></b></div>
          <div class="ct-prog"><small></small><span><i></i></span></div>${practice ? '<em class="ct-pr">sinov</em>' : ""}</div>
        <div class="ct-dots">${order.map((_, i) => `<i data-i="${i}"></i>`).join("")}</div>
        <div class="ct-q"></div></div>`;
      const qBox = wrap.querySelector(".ct-q"), tB = wrap.querySelector(".ct-timer b"), tC = wrap.querySelector(".ct-timer .v");
      const C = 2 * Math.PI * 19;
      tC.style.strokeDasharray = C;
      const dots = [...wrap.querySelectorAll(".ct-dots i")];
      const tick = () => {
        if (!wrap.isConnected || finished) return false;
        const left = deadline - Date.now();
        tB.textContent = fmtT(left);
        tC.style.strokeDashoffset = C * (1 - Math.max(0, left) / (test.minutes * 60000));
        wrap.querySelector(".ct-timer").classList.toggle("low", left < 60000);
        if (left <= 0) { finish(true); return false; }
        return true;
      };
      const iv = setInterval(() => { if (!tick()) clearInterval(iv); }, 250);
      const show = () => {
        const i = run.ans.length;
        dots.forEach((d, k) => { d.className = k < i ? (run.ans[k] ? "ok" : "no") : k === i ? "on" : ""; });
        wrap.querySelector(".ct-prog small").textContent = `${Math.min(i + 1, order.length)} / ${order.length}-savol`;
        wrap.querySelector(".ct-prog i").style.width = (i / order.length) * 100 + "%";
        if (i >= order.length) return finish(false);
        const q = test.questions[order[i]];
        qBox.innerHTML = `<div class="ct-qcard"><p><span>${i + 1}.</span> ${rich(q.q)}</p><div class="ct-opts">${opts[i].map((o, k) => `<button type="button" data-k="${k}"><i>${"ABCDEF"[k]}</i><span>${rich(o.o)}</span></button>`).join("")}</div></div>`;
        qBox.querySelectorAll("button").forEach((b) => (b.onclick = () => {
          if (finished) return;
          qBox.querySelectorAll("button").forEach((x) => (x.disabled = true));
          b.classList.add("picked");
          run.ans.push(!!opts[i][Number(b.dataset.k)].ok);
          if (!practice) store.set(runKey, run);
          setTimeout(show, 380);
        }));
      };
      async function finish(timeUp) {
        if (finished) return;
        finished = true;
        clearInterval(iv);
        const score = run.ans.filter(Boolean).length;
        const secs = Math.round((Math.min(Date.now(), deadline) - run.start) / 1000);
        wrap.innerHTML = `<div class="ct-box"><div class="ct-load">⏳ Natija saqlanmoqda...</div></div>`;
        let res;
        if (practice) res = { score, total: order.length, pct: Math.floor((score * 100) / order.length) };
        else {
          try { res = await T().submit(test, me.name, score, secs); store.del(runKey); }
          catch (e) {
            wrap.innerHTML = `<div class="ct-box"><h2>⚠️ Natijani saqlab bo‘lmadi</h2><p class="ct-note">${esc(e.message)}</p><button class="am-btn primary" type="button">🔁 Qayta yuborish</button></div>`;
            wrap.querySelector("button").onclick = () => { finished = false; finish(timeUp); };
            return;
          }
        }
        const ok = res.pct >= test.pass_pct;
        wrap.innerHTML = `<div class="ct-box ${ok ? "win" : ""}">
          ${timeUp ? `<p class="ct-note">⏰ Vaqt tugadi!</p>` : ""}
          <div class="ct-big ${ok ? "ok" : "bad"}">${res.pct}%</div>
          <h2>${ok ? "🎉 Tabriklaymiz, testdan o‘tdingiz!" : "😔 Bu safar o‘ta olmadingiz"}</h2>
          <p class="ct-note">${score} / ${order.length} to‘g‘ri · ${Math.floor(secs / 60)} daq ${secs % 60} soniya · kerak edi: ${test.pass_pct}%</p>
          ${ok ? (practice ? "" : `<a class="am-btn primary" href="games.html">🎮 O‘yinlarga o‘tish</a>`) : `<p class="ct-note">Mavzuni yana bir bor o‘qing, tajribani ko‘ring. 10 daqiqadan keyin qayta topshirasiz.</p>${readHtml}`}
        </div>`;
        if (ok && fx().confetti) fx().confetti();
      }
      tick();
      show();
    }
  }

  /* ================= Ustoz: natijalar ================= */
  async function viewTests(root) {
    const me = Auth() && Auth().me();
    root.innerHTML = `<nav class="am-crumbs"><a href="#">Amaliy darslar</a><span>›</span><b>Sinf testlari</b></nav><div class="ct-wrap"></div>`;
    const wrap = root.querySelector(".ct-wrap");
    if (!me || me.role !== "teacher") {
      wrap.innerHTML = `<div class="ct-box"><h2>👨‍🏫 Faqat ustozlar uchun</h2><p class="ct-note">Natijalarni ko‘rish uchun ustoz sifatida kiring.</p><button class="am-btn primary" type="button">🔐 Ustoz kirishi</button></div>`;
      wrap.querySelector("button").onclick = async () => { const u = await Auth().open({ title: "Ustoz kirishi" }); if (u) viewTests(root); };
      return;
    }
    wrap.innerHTML = `<div class="ct-load">⏳ Yuklanmoqda...</div>`;
    let tests = [], res = [];
    try { tests = await T().listActive(); res = await T().results(tests.map((t) => t.id)); }
    catch (e) { wrap.innerHTML = `<div class="ct-box"><h2>😕 Yuklab bo‘lmadi</h2><p class="ct-note">${esc(e.message)}</p></div>`; return; }
    if (!wrap.isConnected) return;
    const head = `<div class="ct-dhead"><div><h1>📊 Sinf testlari</h1><p class="ct-note">Faol testlar va o‘quvchilar natijasi${T().online ? "" : " · ⚠️ faqat shu qurilma (Supabase ulanmagan)"}</p></div><button class="am-btn ghost sm" data-ref type="button">🔄 Yangilash</button></div>`;
    if (!tests.length) {
      wrap.innerHTML = `${head}<div class="ct-box"><p class="ct-note">Hozircha faol test yo‘q. Amaliy darsdagi istalgan mavzu ichida <b>“👨‍🏫 Ustoz: shu mavzuni sinfga test qilib berish”</b> tugmasini bosing.</p></div>`;
      wrap.querySelector("[data-ref]").onclick = () => viewTests(root);
      return;
    }
    wrap.innerHTML = head + tests.map((t) => {
      const names = roster(t.cls);
      const rs = res.filter((r) => r.test_id === t.id);
      const extra = [...new Set(rs.map((r) => r.student))].filter((n) => !names.includes(n));
      const rows = names.concat(extra).map((n) => {
        const mine = rs.filter((r) => r.student === n);
        const best = mine.find((r) => r.passed) || mine.reduce((a, r) => (!a || r.pct > a.pct ? r : a), null);
        const st = !best ? ["wait", "⏳ topshirmagan"] : best.passed ? ["ok", `✅ ${best.pct}%`] : ["no", `❌ ${best.pct}%`];
        return { n, st, tries: mine.length, at: best && best.created_at, passed: best && best.passed };
      }).sort((a, b) => (b.passed ? 1 : 0) - (a.passed ? 1 : 0) || a.n.localeCompare(b.n));
      const nPass = rows.filter((r) => r.passed).length;
      return `<section class="ct-test" data-id="${t.id}">
        <header><div><span class="tag">${esc(t.cls)}${t.subject ? " · " + esc(t.subject) : ""}</span><h2>${esc(t.title)}</h2>
          <small>⏱ ${t.minutes} daq · 🎯 ${t.pass_pct}% · ${esc(t.teacher || "")} · ${fmtD(t.created_at)}</small></div>
          <div class="ct-score"><b>${nPass}/${rows.length}</b><small>o‘tdi</small></div></header>
        <span class="am-pbar"><i style="--w:${rows.length ? (nPass / rows.length) * 100 : 0}%"></i></span>
        <div class="ct-list">${rows.map((r) => `<div class="ct-st ${r.st[0]}"><span>${esc(r.n)}</span><b>${r.st[1]}</b><small>${r.tries ? `${r.tries} urinish · ${fmtD(r.at)}` : ""}</small></div>`).join("")}</div>
        <div class="ct-actions"><a class="am-btn ghost sm" href="#test/${t.id}">👁 Testni ko‘rish</a><button class="am-btn ghost sm ct-cancel" type="button">🗑 Testni yopish</button></div>
      </section>`;
    }).join("");
    wrap.querySelector("[data-ref]").onclick = () => viewTests(root);
    wrap.querySelectorAll(".ct-cancel").forEach((b) => (b.onclick = () => {
      const sec = b.closest(".ct-test"), tid = Number(sec.dataset.id);
      const { card, close } = modal(`<h2>🗑 Testni yopish</h2><p class="ct-sub">Test yopilsa, o‘quvchilar uchun o‘yinlar yana ochiladi. Natijalar saqlanib qoladi.</p>
        <form class="ct-form"><label class="ct-f"><span>🔑 Ustoz paroli</span><input name="pin" type="password" autocomplete="off"></label><div class="ct-err"></div><button class="am-btn primary" type="submit">Yopish</button></form>`);
      const f = card.querySelector("form");
      setTimeout(() => f.pin.focus(), 50);
      f.onsubmit = async (e) => {
        e.preventDefault();
        try { await T().cancel(f.pin.value.trim(), tid); close(); viewTests(root); }
        catch (ex) { card.querySelector(".ct-err").textContent = ex.message; }
      };
    }));
  }

  window.AMALIY_CT = { lessonTools, homeBanner, viewTest, viewTests };
})();
