/* Sirli xato: har bir mavzuda (5–11-sinflar) bitta xato yashirinishi mumkin.
   Taxminan yarim mavzularda xato bor, yarmida yo‘q. Joyi mavzu manziliga qarab doim bir xil.
   Qiyinlik: 📌 qoida — 1★, misol javobi / “Hayotda” bo‘limi — 2★, tushuntirish matni — 3★.
   Yulduzlar shu qurilmada saqlanadi. */
(() => {
  "use strict";
  const KEY = "sofi_amaliy_sirli_v1";
  /** Kirgan o'quvchi (SofiAuth). Ustoz va mehmonlar reytingga yulduz olmaydi. */
  const me = () => { try { const u = window.SofiAuth && window.SofiAuth.me(); return u && u.name && (u.role || "student") === "student" ? u : null; } catch (e) { return null; } };
  const skey = () => { const u = me(); return u ? KEY + ":" + u.name : KEY; }; // bitta qurilmada bir nechta o'quvchi bo'lsa ham aralashmasin
  const load = () => { try { return JSON.parse(localStorage.getItem(skey()) || "{}") || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(skey(), JSON.stringify(s)); } catch (e) { /* bo'sh */ } };
  let client;
  function db() {
    if (client !== undefined) return client;
    client = null;
    const cfg = window.SUFIOLLOHYOR_CONFIG || {};
    if (new URLSearchParams(location.search).get("net") !== "local" && window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      try { client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false } }); } catch (e) { client = null; }
    }
    return client;
  }
  /** Yulduzni markaz reytingiga yozish. Natija: { ok, n } yoki { ok:false, why } */
  const STARS_OFF = true; // yulduz berish to‘xtatilgan (bazada ham bloklangan)
  async function sendStars(key, stars) {
    const u = me(), c = db();
    if (!u) return { ok: false, why: "login" };
    if (!c || !stars) return { ok: false, why: "offline" };
    try {
      const { data, error } = await c.rpc("sirli_submit", { p_student: u.name, p_topic: key, p_stars: stars });
      if (error) return { ok: false, why: "error" };
      return { ok: true, n: Number(data) || 0 };
    } catch (e) { return { ok: false, why: "offline" }; }
  }
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const SHARE = 0.55; // xato bo'ladigan mavzular ulushi

  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* Matnning “tegilsa bo‘ladigan” qismlari: HTML teglar, [[kasr]] va &entity; dan tashqari. */
  function safeRanges(s) {
    const out = []; let i = 0, start = 0;
    const push = (a, b) => { if (b > a) out.push([a, b]); };
    while (i < s.length) {
      const c = s[i];
      if (c === "<") { push(start, i); const j = s.indexOf(">", i); i = j < 0 ? s.length : j + 1; start = i; continue; }
      if (c === "[" && s[i + 1] === "[") { push(start, i); const j = s.indexOf("]]", i); i = j < 0 ? s.length : j + 2; start = i; continue; }
      if (c === "&") { const m = /^&[#a-z0-9]{1,10};/i.exec(s.slice(i, i + 12)); if (m) { push(start, i); i += m[0].length; start = i; continue; } }
      i++;
    }
    push(start, s.length);
    return out;
  }
  const LET = /[A-Za-zÀ-ÿʻʼ‘’'Ѐ-ӿ]/;
  const isWordEdge = (s, a, b) => !(a > 0 && LET.test(s[a - 1])) && !(b < s.length && LET.test(s[b]));

  /* So‘z almashtirish: test javobining to‘g‘ri varianti matnda uchrasa, xato varianti bilan almashtiramiz. */
  function swapCands(text, quiz) {
    const out = [];
    if (!text) return out;
    const ranges = safeRanges(text);
    (quiz || []).forEach((q) => {
      const right = String(q.o[0] || "").trim(), wrong = String(q.o[1] || "").trim();
      if (!right || !wrong || right.length < 3 || right.length > 40 || /[<\[&]/.test(right + wrong) || wrong.length > 45) return;
      if (right.toLowerCase().includes(wrong.toLowerCase()) || wrong.toLowerCase().includes(right.toLowerCase())) return;
      if (text.includes(wrong)) return; // xato varianti matnda bor bo'lsa — juda oson, tanlamaymiz
      let from = 0, idx;
      while ((idx = text.indexOf(right, from)) >= 0) {
        const end = idx + right.length;
        if (ranges.some(([a, b]) => idx >= a && end <= b) && isWordEdge(text, idx, end)) { out.push({ at: idx, len: right.length, from: right, to: wrong, kind: "swap" }); break; }
        from = idx + 1;
      }
    });
    return out;
  }
  function mutateNumber(v, r) {
    const n = parseInt(v, 10);
    if (v.length === 1) return String(n === 9 ? 8 : n + 1 + (r() < 0.3 && n < 8 ? 1 : 0));
    if (v.length === 4 && n >= 1000 && n <= 2100) { const d = (1 + Math.floor(r() * 3)) * (r() < 0.5 ? -1 : 1) * (r() < 0.6 ? 10 : 1); const x = n + d; return String(x === n ? n + 1 : x); }
    const digits = v.split("");
    const pos = 1 + Math.floor(r() * (digits.length - 1));
    let nd; do { nd = String(Math.floor(r() * 10)); } while (nd === digits[pos]);
    digits[pos] = nd;
    return digits.join("");
  }
  function numCands(text, r, minLen = 2, strict = true) {
    const out = [];
    if (!text) return out;
    safeRanges(text).forEach(([a, b]) => {
      const seg = text.slice(a, b), re = /\d+/g; let m;
      while ((m = re.exec(seg))) {
        const at = a + m.index, end = at + m[0].length;
        const prev = text[at - 1], next = text[end];
        if (prev === "," || prev === "." || next === "," && /\d/.test(text[end + 1] || "") || next === "." && /\d/.test(text[end + 1] || "")) continue; // o'nli kasrlarni tegmaymiz
        if (/[A-Za-z]/.test(prev || "") || /[A-Za-z]/.test(next || "")) continue; // H2O, x2 kabi
        if (m[0].length > 7 || m[0].length < minLen) continue;
        if (strict) {
          const n = +m[0], year = m[0].length === 4 && n >= 1000 && n <= 2100;
          const sent = sentenceAround(text, at, m[0].length);
          if (!year && !/[=→≈]/.test(sent)) continue; // tekshirib bo'lmaydigan oddiy raqamni tegmaymiz
        }
        out.push({ at, len: m[0].length, from: m[0], to: mutateNumber(m[0], r), kind: "num", w: m[0].length >= 2 ? 2 : 1 });
      }
    });
    return out;
  }
  const strip = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
  const sentences = (plain) => plain.split(/(?<=[.!?…])\s+(?=[A-ZÀ-ÿʻ‘O‘G‘«“"0-9Ѐ-ӿ])/).map((x) => x.trim()).filter((x) => x.length >= 20);
  function sentenceAround(raw, at, len) {
    const marked = raw.slice(0, at) + "\u0001" + raw.slice(at, at + len) + "\u0002" + raw.slice(at + len);
    const plain = strip(marked);
    const ss = plain.split(/(?<=[.!?…])\s+/);
    let s = ss.find((x) => x.includes("\u0001")) || plain;
    if (s.length > 230) { const k = s.indexOf("\u0001"); s = (k > 100 ? "…" : "") + s.slice(Math.max(0, k - 100), k + 120) + "…"; }
    return s;
  }

  /** Mavzu uchun reja: { has, stars, field, ... } yoki { has:false }. */
  function plan(cls, sub, t) {
    if (!/^\d+$/.test(cls.id)) return null; // faqat 5–11-sinflar
    const key = `${cls.id}/${sub.id}/${t.id}`;
    const r = rng(hash("sirli:" + key));
    if (r() >= SHARE) return { key, has: false };
    const quiz = t.quiz || [];
    const pools = [];
    const add = (field, stars, list, idx) => list.forEach((c) => pools.push({ ...c, field, stars, idx }));
    add("rule", 1, swapCands(t.rule, quiz)); add("rule", 1, numCands(t.rule, r, 2, false));
    (t.examples || []).forEach((e, i) => add("exa", 2, numCands(e.a, r, 1, false), i));
    add("life", 2, swapCands(t.life, quiz)); add("life", 2, numCands(t.life, r));
    add("explain", 3, swapCands(t.explain, quiz)); add("explain", 3, numCands(t.explain, r));
    if (!pools.length) return { key, has: false };
    // Qiyinlik darajasini tasodifiy tanlaymiz, so'ng shu darajadagi variantni (so'z almashtirish ustun)
    const levels = [...new Set(pools.map((p) => p.stars))];
    const lv = levels[Math.floor(r() * levels.length)];
    let cand = pools.filter((p) => p.stars === lv);
    const swaps = cand.filter((p) => p.kind === "swap");
    if (swaps.length && r() < 0.7) cand = swaps;
    const big = cand.filter((p) => p.kind === "swap" || p.w === 2);
    if (big.length) cand = big;
    const c = cand[Math.floor(r() * cand.length)];
    const raw = c.field === "exa" ? t.examples[c.idx].a : t[c.field];
    const wrongRaw = raw.slice(0, c.at) + c.to + raw.slice(c.at + c.len);
    const spanRaw = raw.slice(0, c.at) + `<span class="am-sirli" data-sirli>${esc(c.to)}</span>` + raw.slice(c.at + c.len);
    const wrongSentence = sentenceAround(wrongRaw, c.at, c.to.length).replace(/[\u0001\u0002]/g, "");
    const rightSentence = sentenceAround(raw, c.at, c.len).replace(/[\u0001\u0002]/g, "");
    // Chalg'ituvchi (to'g'ri) gaplar
    const pool = [];
    ["life", "explain", "rule"].forEach((f) => { if (t[f] && f !== c.field) sentences(strip(t[f])).forEach((s) => pool.push(s)); });
    if (c.field !== "exa") (t.examples || []).forEach((e) => { const s = strip(e.a); if (s.length >= 8) pool.push("Javob: " + s); });
    if (c.field !== "exa") sentences(strip(raw)).forEach((s) => { if (!s.includes(c.from) && s !== rightSentence) pool.push(s); });
    const uniq = [...new Set(pool)].filter((s) => s.length <= 230 && s !== wrongSentence && s !== rightSentence);
    const decoys = [];
    while (uniq.length && decoys.length < 3) decoys.push(uniq.splice(Math.floor(r() * uniq.length), 1)[0]);
    const display = c.field === "exa" ? "Javob: " + wrongSentence : wrongSentence;
    const opts = [display, ...decoys];
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    return { key, has: true, stars: c.stars, field: c.field, idx: c.idx, from: c.from, to: c.to, spanRaw, opts, answer: display, right: c.field === "exa" ? "Javob: " + rightSentence : rightSentence };
  }

  /** Dars ko‘rsatilishidan oldin: mavzuning xatoli nusxasini qaytaradi. */
  function applyTo(cls, sub, t) {
    const p = plan(cls, sub, t);
    if (!p) return { topic: t, plan: null };
    if (!p.has) return { topic: t, plan: p };
    const tt = { ...t };
    if (p.field === "exa") { tt.examples = t.examples.map((e, i) => (i === p.idx ? { ...e, a: p.spanRaw } : e)); }
    else tt[p.field] = p.spanRaw;
    return { topic: tt, plan: p };
  }

  const LV = { 1: "oson — 📌 qoida qatorida", 2: "o‘rta — misol javobi yoki “Hayotda” bo‘limida", 3: "qiyin — tushuntirish matnida" };
  const starStr = (n) => "★".repeat(n) + "☆".repeat(3 - n);
  const total = () => Math.max(0, Object.values(load()).reduce((a, x) => a + (x.stars || 0), 0));

  function fixInline(rootEl, p) {
    rootEl.querySelectorAll("[data-sirli]").forEach((el) => {
      el.classList.add("fixed");
      el.innerHTML = `<s>${esc(p.to)}</s> <b>${esc(p.from)}</b>`;
      el.title = "Sirli xato tuzatildi";
    });
  }

  /** Dars oxiridagi “Sirli xato” bloki. */
  function mount(box, rootEl, p, rich) {
    if (!box || !p) return;
    const store = load();
    const prev = store[p.key];
    const intro = `<h2><span class="h-ic">🕵️</span> Sirli xato</h2>
      <p class="am-sirli-intro">Ba’zi mavzularda bitta <b>sirli xato</b> yashiringan, ba’zilarida esa xato yo‘q. Darsni diqqat bilan o‘qib chiqdingizmi? Xatoni topsangiz, qiyinligiga qarab <b>1–3 ⭐</b> olasiz. Xato yo‘q mavzuda “xato bor” yoki xato bor mavzuda “xato yo‘q” desangiz — <b>1 ⭐ olib tashlanadi</b>. Har mavzuda faqat <b>bir marta</b> javob berish mumkin!</p>`;
    const totalLine = () => {
      const u = me();
      return `<div class="am-sirli-total">⭐ Sirli xato yulduzlaringiz: <b>${total()}</b></div>` + (u
        ? `<div class="am-sirli-who">👤 ${esc(u.name)} — yulduzlar <a href="ranking.html">markaz reytingiga</a> qo‘shiladi</div>`
        : `<div class="am-sirli-who warn">⚠️ Yulduzlar reytingga yozilishi uchun <button type="button" class="dbtn sm" data-login>🔑 Kiring</button> (ismingizni tanlang). Kirmasangiz, yulduzlar faqat shu telefonda qoladi.</div>`);
    };
    const bindLogin = () => {
      const b = box.querySelector("[data-login]");
      if (b && window.SofiAuth) b.onclick = async () => { const u = await window.SofiAuth.open({ title: "Sirli xato yulduzlari uchun kirish", teachers: false }); if (u) mount(box, rootEl, p, rich); };
    };
    const syncLine = (res) => {
      if (!res.stars) return "";
      if (res.sync === "ok") return `<p class="am-sirli-sync ok">📊 Reytingga yozildi: ${res.sent > 0 ? "+" : ""}${res.sent} ⭐</p>`;
      if (res.sync === "cap") return `<p class="am-sirli-sync">📊 Bugungi limit (30 ⭐) to‘ldi — bu yulduz reytingga yozilmadi. Ertaga davom eting!</p>`;
      if (res.sync === "dup") return `<p class="am-sirli-sync">📊 Bu mavzu uchun yulduz avval yozilgan.</p>`;
      if (res.sync === "pending") return `<p class="am-sirli-sync">⏳ Internet yo‘q — reytingga keyinroq yoziladi.</p>`;
      return "";
    };
    const done = (html, res) => { box.innerHTML = intro + `<div class="am-sirli-res">${html}${res ? syncLine(res) : ""}</div>` + totalLine(); bindLogin(); };
    const resultHTML = (res) => STARS_OFF ? resultHTML0(res).replace(/ ?[+−]\d ⭐/g, "") + `<p class="muted">⏸ Yulduz berish hozircha to‘xtatilgan — javobingiz faqat o‘zingiz uchun.</p>` : resultHTML0(res);
    const resultHTML0 = (res) => {
      if (res.kind === "found") return `<b class="good">🎉 Topdingiz! +${res.stars} ⭐</b><p>Qiyinlik: <span class="am-stars">${starStr(res.stars)}</span> (${LV[res.stars]}).</p><p>✅ To‘g‘risi: ${rich(esc(p.right))}</p>`;
      if (res.kind === "missed") return `<b class="bad">😕 Afsus, xato boshqa joyda edi.</b><p>❌ Xato gap: ${rich(esc(p.answer))}</p><p>✅ To‘g‘risi: ${rich(esc(p.right))}</p><p>Qiyinlik: <span class="am-stars">${starStr(p.stars)}</span></p>`;
      if (res.kind === "skipped") return `<b class="bad">🙈 Bu mavzuda xato bor edi!${res.stars < 0 ? " −1 ⭐" : ""}</b><p>❌ Xato gap: ${rich(esc(p.answer))}</p><p>✅ To‘g‘risi: ${rich(esc(p.right))}</p><p>Qiyinlik: <span class="am-stars">${starStr(p.stars)}</span> — keyingi safar diqqatliroq bo‘ling 😉</p>`;
      if (res.kind === "clean") return `<b class="good">👏 To‘g‘ri! Bu mavzuda xato yo‘q edi. +1 ⭐</b><p>Siz darsga ishondingiz — chunki uni tushunib o‘qidingiz.</p>`;
      return `<b class="bad">🙁 Bu mavzuda xato yo‘q edi! −1 ⭐</b><p>Hamma ma’lumot to‘g‘ri edi. Shoshilmang — “xato bor” deyishdan oldin darsni yaxshilab tekshiring.</p>`;
    };
    const push = async (res) => {
      if (STARS_OFF || !res.stars || !me()) return;
      const r = await sendStars(p.key, res.stars);
      if (!r.ok) res.sync = "pending";
      else res.sync = r.n === 0 ? (res.stars > 0 && !res.sync ? "cap" : "dup") : "ok", res.sent = r.n;
      const s = load(); s[p.key] = res; save(s);
      if (box.isConnected) done(resultHTML(res), res);
    };
    if (prev) {
      done(resultHTML(prev), prev); if (p.has) fixInline(rootEl, p);
      if (prev.stars && me() && (!prev.sync || prev.sync === "pending")) push(prev); // avval yozilmay qolgan bo'lsa — qayta yuboramiz
      return;
    }
    const finishWith = (res) => {
      if (me()) res.sync = "pending";
      const s = load(); s[p.key] = res; save(s);
      done(resultHTML(res), res);
      if (p.has) fixInline(rootEl, p);
      if (res.stars > 0) box.classList.add("win");
      res.sync = ""; push(res);
    };
    box.innerHTML = intro + `
      <div class="am-sirli-ask"><b>Bu mavzuda xato bormi?</b>
        <div class="am-sirli-btns"><button type="button" class="dbtn" data-a="yes">🔎 Ha, xato bor</button><button type="button" class="dbtn ghost" data-a="no">✅ Xato yo‘q</button></div>
      </div>` + totalLine();
    bindLogin();
    box.querySelector('[data-a="no"]').onclick = () => finishWith(p.has ? { kind: "skipped", stars: total() > 0 ? -1 : 0 } : { kind: "clean", stars: 1 });
    box.querySelector('[data-a="yes"]').onclick = () => {
      if (!p.has) { finishWith({ kind: "none", stars: total() > 0 ? -1 : 0 }); return; }
      const ask = box.querySelector(".am-sirli-ask");
      ask.innerHTML = `<b>Qaysi gapda xato bor?</b><div class="am-sirli-opts">${p.opts.map((o, i) => `<button type="button" data-i="${i}">${rich(esc(o))}</button>`).join("")}</div>`;
      ask.querySelectorAll("button").forEach((b) => (b.onclick = () => {
        const ok = p.opts[+b.dataset.i] === p.answer;
        finishWith(ok ? { kind: "found", stars: p.stars } : { kind: "missed", stars: 0 });
      }));
    };
  }

  window.AMALIY_SIRLI = { plan, applyTo, mount, total };
})();
