/* 3-o'yin: Bilmasvoyga o'rgat.
   Bilmasvoy javob aytadi — o'quvchi to'g'ri yoki xato ekanini topadi,
   xato bo'lsa to'g'ri javobni o'rgatadi. */
(() => {
  "use strict";
  const Q = window.SofiQuestions;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const COUNT = 10;
  const LIVES = 3;
  const TIME = 14;

  const BOY = `
  <svg class="bv-boy" viewBox="0 0 200 240" aria-hidden="true">
    <ellipse cx="100" cy="232" rx="58" ry="7" fill="rgba(0,0,0,.18)"/>
    <g class="bv-body">
      <path d="M52 232 Q50 168 100 160 Q150 168 148 232 Z" fill="#16a34a"/>
      <path d="M86 162 L100 182 L114 162" fill="#fff"/>
      <rect x="94" y="182" width="12" height="50" fill="#15803d" opacity=".5"/>
      <g class="bv-arm"><path d="M146 178 Q172 160 176 130" stroke="#16a34a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <circle cx="177" cy="124" r="10" fill="#f2c29b"/></g>
      <path d="M54 180 Q38 200 48 222" stroke="#16a34a" stroke-width="16" stroke-linecap="round" fill="none"/>
    </g>
    <g class="bv-head">
      <circle cx="46" cy="104" r="12" fill="#eab48d"/><circle cx="154" cy="104" r="12" fill="#eab48d"/>
      <circle cx="100" cy="100" r="56" fill="#f2c29b"/>
      <path d="M48 78 Q100 40 152 78 L148 60 Q100 30 52 60 Z" fill="#3b2314"/>
      <g class="bv-doppi">
        <path d="M50 62 Q100 50 150 62 L140 28 Q100 16 60 28 Z" fill="#111827"/>
        <path d="M50 62 Q100 50 150 62" stroke="#f8fafc" stroke-width="3" fill="none"/>
        <g fill="#f8fafc">
          <path d="M72 50 q6 -14 0 -18 q-6 4 0 18z"/><path d="M100 46 q6 -14 0 -20 q-6 6 0 20z"/>
          <path d="M128 50 q6 -14 0 -18 q-6 4 0 18z"/>
        </g>
        <path d="M60 28 Q100 16 140 28" stroke="#f8fafc" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
      </g>
      <g class="bv-brows"><path d="M70 82 q10 -6 20 0" stroke="#3b2314" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M110 82 q10 -6 20 0" stroke="#3b2314" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="bv-eyes"><ellipse cx="80" cy="98" rx="7" ry="9" fill="#1f2937"/><ellipse cx="120" cy="98" rx="7" ry="9" fill="#1f2937"/>
        <circle cx="82" cy="95" r="2.5" fill="#fff"/><circle cx="122" cy="95" r="2.5" fill="#fff"/></g>
      <circle cx="68" cy="118" r="8" fill="#f59e9e" opacity=".55"/><circle cx="132" cy="118" r="8" fill="#f59e9e" opacity=".55"/>
      <path class="bv-mouth m-idle" d="M86 126 Q100 136 114 126" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path class="bv-mouth m-happy" d="M82 122 Q100 146 118 122 Z" fill="#7c2d12"/>
      <path class="bv-mouth m-sad" d="M86 134 Q100 122 114 134" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M96 108 q4 6 8 0" stroke="#d99a72" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <text class="bv-q" x="170" y="56" font-size="34" font-weight="900" fill="#f59e0b">?</text>
  </svg>`;

  const BRAG = ["Men bilaman!", "Oson-ku!", "Aniq bilaman!", "Menimcha shunday:", "Bu juda oddiy!", "Hech shubha yo‘q!"];

  function mount(root, ctx) {
    const r = Q.rng(ctx.seed ^ 0xb11a);
    const questions = Q.make(ctx.seed ^ 0x0b0b, COUNT, ctx.level).map((q) => {
      const truthful = r() < 0.4;
      const wrong = q.opts.filter((o) => o !== q.a);
      return { ...q, claim: truthful ? q.a : Q.pick(r, wrong), brag: Q.pick(r, BRAG) };
    });

    let i = 0, lives = LIVES, taught = 0, perfect = 0, timer = null, left = TIME, over = false, t0 = performance.now();
    const op = ctx.opponent ? { i: 0, taught: 0, lives: LIVES, done: false } : null;

    root.innerHTML = `
      <div class="bv">
        <div class="mq-hud">
          <div class="pill">📚 <b class="bv-n">1</b>/${COUNT}</div>
          <div class="pill"><b class="bv-lives">${"❤".repeat(LIVES)}</b></div>
          <div class="pill">🎓 <b class="bv-taught">0</b></div>
          ${op ? `<div class="pill op">👤 ${esc(ctx.opponent.name.split(" ")[1] || ctx.opponent.name)}: <b class="bv-op">0 · 1-savol</b></div>` : ""}
        </div>
        <div class="bv-stage">
          <div class="bv-board">
            <div class="bv-meter"><span>Bilmasvoyning bilimi</span><div><i class="bv-fill"></i></div></div>
            <div class="bv-bubble"></div>
          </div>
          <div class="bv-char idle">${BOY}</div>
        </div>
        <div class="bv-panel"></div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const char = $(".bv-char");

    function mood(m) {
      char.classList.remove("idle", "happy", "sad");
      void char.offsetWidth;
      char.classList.add(m);
    }

    function show() {
      const q = questions[i];
      mood("idle");
      $(".bv-n").textContent = i + 1;
      $(".bv-bubble").innerHTML = `
        <span class="tag">${esc(q.subject)}</span>
        <p class="bv-question">${esc(q.q)}</p>
        <p class="bv-claim">“${esc(q.brag)} Javobi — <b>${esc(q.claim)}</b>!”</p>`;
      $(".bv-bubble").classList.remove("pop");
      void $(".bv-bubble").offsetWidth;
      $(".bv-bubble").classList.add("pop");
      $(".bv-panel").innerHTML = `
        <p class="bv-ask">Bilmasvoy to‘g‘ri aytdimi?</p>
        <div class="mq-timer"><i></i></div>
        <div class="bv-judge">
          <button class="opt yes" data-j="1">✅ To‘g‘ri</button>
          <button class="opt no" data-j="0">❌ Xato</button>
        </div>`;
      startTimer();
    }

    function startTimer() {
      clearInterval(timer);
      left = TIME;
      const bar = $(".bv-panel .mq-timer i");
      bar.style.transition = "none";
      bar.style.width = "100%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `width ${TIME}s linear`;
        bar.style.width = "0%";
      }));
      timer = setInterval(() => {
        left--;
        if (left <= 3 && left > 0) ctx.sfx.tick();
        if (left <= 0) { clearInterval(timer); fail("⏰ Vaqt tugadi!"); }
      }, 1000);
    }

    function judge(saysRight) {
      clearInterval(timer);
      const q = questions[i];
      const isRight = q.claim === q.a;
      if (saysRight !== isRight) {
        return fail(isRight ? "Aslida Bilmasvoy to‘g‘ri aytgan edi!" : `Bilmasvoy xato qildi. To‘g‘risi: ${q.a}`);
      }
      if (isRight) return success("Barakalla! Bilmasvoy to‘g‘ri aytgan ekan. 👍");
      // Xato — endi to'g'ri javobni o'rgatish kerak
      $(".bv-panel").innerHTML = `
        <p class="bv-ask">To‘g‘ri! Endi Bilmasvoyga to‘g‘ri javobni o‘rgating:</p>
        <div class="mq-timer"><i></i></div>
        <div class="mq-opts">${q.opts.filter((o) => o !== q.claim).map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
      startTimer();
    }

    function teach(choice) {
      clearInterval(timer);
      const q = questions[i];
      root.querySelectorAll(".opt").forEach((b) => {
        b.disabled = true;
        if (b.dataset.o === q.a) b.classList.add("right");
        else if (b.dataset.o === choice) b.classList.add("wrong");
      });
      if (choice === q.a) success("Rahmat, ustoz! Endi bilaman! 🤩");
      else fail(`To‘g‘ri javob: ${q.a}`);
    }

    function success(text) {
      taught++;
      perfect++;
      ctx.sfx.good();
      mood("happy");
      say(text, true);
      next();
    }
    function fail(text) {
      lives--;
      ctx.sfx.bad();
      mood("sad");
      say(text, false);
      next();
    }
    function say(text, good) {
      $(".bv-panel").innerHTML = `<p class="bv-result ${good ? "good" : "bad"}">${esc(text)}</p>`;
      $(".bv-fill").style.width = (taught / COUNT) * 100 + "%";
      $(".bv-taught").textContent = taught;
      $(".bv-lives").textContent = lives > 0 ? "❤".repeat(lives) : "💔";
      ctx.send({ i: i + 1, taught, lives, done: false });
    }
    function next() {
      setTimeout(() => {
        if (over) return;
        i++;
        if (i >= COUNT || lives <= 0) end();
        else show();
      }, 1700);
    }

    function drawOp() {
      const el = $(".bv-op");
      if (!el || !op) return;
      el.textContent = op.done ? `${op.taught} · tugatdi` : op.lives <= 0 ? `${op.taught} · 💔` : `${op.taught} · ${Math.min(op.i + 1, COUNT)}-savol`;
    }

    async function end() {
      over = true;
      clearInterval(timer);
      const time = (performance.now() - t0) / 1000;
      const lost = lives <= 0;
      ctx.send({ i: COUNT, taught, lives, done: true });
      mood(taught >= 8 ? "happy" : "sad");
      const rows = [["O‘rgatildi", `${taught} / ${COUNT}`], ["Qolgan jon", lives > 0 ? "❤".repeat(lives) : "0"]];
      if (!op) {
        const earn = !lost && taught >= 9;
        ctx.finish({
          title: lost ? "Jonlar tugadi 💔" : earn ? "Bilmasvoy endi bilimdon! 🎓" : "Dars tugadi",
          text: lost ? "Bilmasvoy hali ko‘p narsani bilmaydi. Yana urinib ko‘ring!" : "",
          rows,
          earnStar: earn,
          starHint: earn ? "" : "Yulduz uchun 10 ta savoldan kamida 9 tasini to‘g‘ri hal qiling."
        });
        return;
      }
      $(".bv-panel").innerHTML = `<div class="g-center"><span class="g-spinner"></span><p>${esc(ctx.opponent.name)} tugatishini kutyapmiz...</p></div>`;
      const opRes = await ctx.exchangeFinal({ taught, time });
      if (!opRes) {
        ctx.finish({ title: "Do‘stingiz chiqib ketdi", rows, earnStar: !lost && taught >= 9, starHint: "Yulduz uchun kamida 9 ta to‘g‘ri javob kerak edi." });
        return;
      }
      const draw = taught === opRes.taught && Math.abs(time - opRes.time) < 0.5;
      const won = taught > opRes.taught || (taught === opRes.taught && time < opRes.time);
      ctx.finish({
        title: draw ? "Durang!" : won ? "Siz yutdingiz! 🏆" : `${ctx.opponent.name} yutdi`,
        won: draw ? undefined : won,
        rows: [
          [ctx.me.name, `${taught}/${COUNT} · ${time.toFixed(0)} s`],
          [ctx.opponent.name, `${opRes.taught}/${COUNT} · ${opRes.time.toFixed(0)} s`]
        ],
        earnStar: won && !draw && taught >= 8,
        starHint: "Yulduzni g‘olib oladi (kamida 8 ta to‘g‘ri javob bilan)."
      });
    }

    root.addEventListener("click", (e) => {
      const j = e.target.closest("[data-j]");
      if (j && !over) { root.querySelectorAll("[data-j]").forEach((b) => (b.disabled = true)); judge(j.dataset.j === "1"); return; }
      const o = e.target.closest("[data-o]");
      if (o && !o.disabled && !over) teach(o.dataset.o);
    });
    ctx.onMsg((d) => { if (op) { Object.assign(op, d); drawOp(); } });

    show();
    return () => { over = true; clearInterval(timer); };
  }

  window.SofiBilmasvoyArt = BOY;
  window.SofiGames.register({
    id: "bilmasvoy",
    title: "Bilmasvoyga o‘rgat",
    icon: "🧢",
    mount
  });
})();
