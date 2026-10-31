/* Amaliy darslar sahifasi: sinf → fan → mavzu → dars. Manzil: #5/matematika/mavzu-id */
(() => {
  "use strict";
  const { h, rich, W } = window.AK;
  const DB = window.AMALIY;
  const root = document.getElementById("amaliyApp");
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const CLASS_ART = { "5": ["🔢", "#22c55e"], "6": ["➗", "#3b82f6"], "8": ["📐", "#a855f7"], "10": ["🌍", "#0ea5e9"] };

  function crumbs(parts) {
    return `<nav class="am-crumbs">${parts.map(([href, t], i) => i < parts.length - 1 ? `<a href="${href}">${esc(t)}</a><span>›</span>` : `<b>${esc(t)}</b>`).join("")}</nav>`;
  }

  function viewClasses() {
    root.innerHTML = `
      <section class="am-hero">
        <span class="eyebrow">🧪 Amaliy darslar</span>
        <h1>Mavzuni <span class="green">ko‘rib</span>, ushlab o‘rganing</h1>
        <p>Har bir mavzu hayotiy misol bilan tushuntirilgan, jonli tajriba orqali ko‘rsatilgan va kichik test bilan mustahkamlanadi.</p>
      </section>
      <h2 class="am-step"><span>1</span> Sinfingizni tanlang</h2>
      <div class="am-grid classes">
        ${DB.classes.map((c, i) => {
          const [ic, col] = CLASS_ART[c.id] || ["📘", "#22c55e"];
          const count = c.subjects.reduce((n, s_) => n + s_.topics.length, 0);
          return `<a class="am-card big" href="#${c.id}" style="--c:${col};--d:${i * 90}ms">
            <span class="am-ic">${ic}</span><b>${esc(c.name)}</b>
            <small>${c.subjects.map((s_) => esc(s_.name)).join(" · ")}</small>
            <em>${count} ta mavzu →</em></a>`;
        }).join("")}
      </div>`;
  }

  function viewSubjects(cls) {
    root.innerHTML = `
      ${crumbs([["#", "Amaliy darslar"], ["", cls.name]])}
      <h2 class="am-step"><span>2</span> Fanni tanlang</h2>
      <div class="am-grid">
        ${cls.subjects.map((s_, i) => `<a class="am-card big" href="#${cls.id}/${s_.id}" style="--c:${s_.color};--d:${i * 90}ms">
          <span class="am-ic">${s_.icon}</span><b>${esc(s_.name)}</b>
          <small>${esc(s_.note || "1-chorak mavzulari")}</small><em>${s_.topics.length} ta mavzu →</em></a>`).join("")}
      </div>`;
  }

  function viewTopics(cls, sub) {
    root.innerHTML = `
      ${crumbs([["#", "Amaliy darslar"], ["#" + cls.id, cls.name], ["", sub.name]])}
      <h2 class="am-step"><span>3</span> Mavzuni tanlang</h2>
      <input class="am-search" type="search" placeholder="🔎 Mavzu qidirish..." aria-label="Mavzu qidirish">
      <div class="am-topics">
        ${sub.topics.map((t, i) => `<a class="am-topic" href="#${cls.id}/${sub.id}/${t.id}" style="--c:${sub.color};--d:${Math.min(i, 12) * 40}ms">
          <span class="n">${i + 1}</span><span class="t"><b>${esc(t.title)}</b><small>${rich(esc(t.tag || ""))}</small></span>
          <span class="ic">${(t.demos || []).length ? "🔬" : "📖"}</span></a>`).join("")}
      </div>`;
    const search = root.querySelector(".am-search");
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase().trim();
      root.querySelectorAll(".am-topic").forEach((a) => a.classList.toggle("hidden", !a.textContent.toLowerCase().includes(q)));
    });
  }

  function quiz(box, list) {
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
          if (ok) score++;
          done++;
          card.append(h("div", { class: "am-expl " + (ok ? "good" : "bad"), html: (ok ? "✅ To‘g‘ri! " : "❌ Xato. ") + rich(item.e || "") }));
          if (done === list.length) {
            box.append(h("div", { class: "am-score", html: score === list.length ? `🏆 Ajoyib! ${score}/${list.length} — mavzuni to‘liq tushundingiz.` : `Natija: ${score}/${list.length}. Tajribani yana bir bor ko‘rib, qayta urinib ko‘ring.` }));
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
    root.innerHTML = `
      ${crumbs([["#", "Amaliy darslar"], ["#" + cls.id, cls.name], ["#" + cls.id + "/" + sub.id, sub.name], ["", t.title]])}
      <article class="am-lesson" style="--c:${sub.color}">
        <header class="am-lhead">
          <span class="tag">${esc(cls.name)} · ${esc(sub.name)} · ${idx + 1}-mavzu</span>
          <h1>${esc(t.title)}</h1>
          ${t.tag ? `<p>${rich(esc(t.tag))}</p>` : ""}
        </header>
        <section class="am-block life"><h2>🌍 Hayotda qayerda uchraydi?</h2><div>${rich(t.life)}</div></section>
        <section class="am-block"><h2>📖 Tushuntirish</h2><div class="am-text">${rich(t.explain)}</div>
          ${t.rule ? `<div class="am-rule">📌 ${rich(t.rule)}</div>` : ""}</section>
        ${(t.demos || []).length ? `<section class="am-block demo-block"><h2>🔬 Jonli tajriba</h2><p class="muted">Tugma va surgichlarni o‘zgartiring — natija darhol o‘zgaradi.</p><div class="am-demos"></div></section>` : ""}
        ${(t.examples || []).length ? `<section class="am-block"><h2>✍️ Ishlangan misollar</h2><div class="am-examples"></div></section>` : ""}
        ${(t.quiz || []).length ? `<section class="am-block"><h2>✅ O‘zingizni sinang</h2><div class="am-quiz"></div></section>` : ""}
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
    if (qz) quiz(qz, t.quiz);
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
    try { localStorage.setItem("sofi_amaliy_last", location.hash); } catch (e) {}
  }

  window.addEventListener("hashchange", route);
  route();
})();
