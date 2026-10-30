/* 1-o'yin: Sirli quti.
   Har raundda 3 ta quti: ichida ball yoki bomba. Qutini ochgach savolga javob beriladi. */
(() => {
  "use strict";
  const Q = window.SofiQuestions;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const ROUNDS = 10;
  const TIME = 15;
  const COLORS = ["c1", "c2", "c3"];

  function mount(root, ctx) {
    const r = Q.rng(ctx.seed ^ 0x51a7);
    const questions = Q.make(ctx.seed, ROUNDS, ctx.level);
    // Har raund uchun qutilar ichidagi narsa (ikkala o'yinchida bir xil).
    const rounds = questions.map((q, i) => {
      const prizes = [10, 20, 30];
      if (i >= 2 && r() < 0.45) prizes[Math.floor(r() * 3)] = "bomb";
      return Q.shuffle(r, prizes);
    });

    let round = 0, score = 0, correct = 0, timer = null, left = TIME, busy = false, over = false;
    let op = ctx.opponent ? { round: 0, score: 0, correct: 0, done: false } : null;

    root.innerHTML = `
      <div class="mq">
        <div class="mq-hud">
          <div class="pill">📦 <b class="mq-round">1</b>/${ROUNDS}</div>
          <div class="pill">🏅 <b class="mq-score">0</b> ball</div>
          <div class="pill">✅ <b class="mq-correct">0</b></div>
          ${op ? `<div class="pill op">👤 ${esc(ctx.opponent.name.split(" ")[1] || ctx.opponent.name)}: <b class="mq-op">0 ball · 1-raund</b></div>` : ""}
        </div>
        <div class="mq-scene">
          <p class="mq-hint">Qutilardan birini tanlang! Ichida 10, 20, 30 ball... yoki 💣 bomba bo‘lishi mumkin.</p>
          <div class="mq-boxes"></div>
          <div class="mq-question" hidden></div>
        </div>
      </div>`;
    const $ = (s) => root.querySelector(s);

    function drawBoxes() {
      busy = false;
      $(".mq-round").textContent = round + 1;
      $(".mq-question").hidden = true;
      $(".mq-hint").hidden = false;
      $(".mq-boxes").innerHTML = rounds[round].map((_, i) => `
        <button class="box ${COLORS[(i + round) % 3]}" data-i="${i}" style="--d:${i * 0.12}s" aria-label="${i + 1}-quti">
          <span class="lid"><span class="bow"></span></span>
          <span class="body"><span class="q">?</span></span>
          <span class="prize"></span>
          <span class="shadow"></span>
        </button>`).join("");
    }

    function openBox(i) {
      if (busy || over) return;
      busy = true;
      const prize = rounds[round][i];
      const boxes = root.querySelectorAll(".box");
      boxes.forEach((b, j) => {
        b.disabled = true;
        b.querySelector(".prize").textContent = rounds[round][j] === "bomb" ? "💣" : rounds[round][j];
        if (j !== i) b.classList.add("dim");
      });
      const box = boxes[i];
      box.classList.add("open");
      $(".mq-hint").hidden = true;
      setTimeout(() => boxes.forEach((b, j) => j !== i && b.classList.add("reveal")), 700);

      if (prize === "bomb") {
        ctx.sfx.bad();
        box.classList.add("boom");
        score = Math.max(0, score - 10);
        update();
        showMsg("💥 Bomba! −10 ball. Bu raundda savol yo‘q.", "bad");
        setTimeout(next, 1800);
        return;
      }
      ctx.sfx.good();
      setTimeout(() => ask(prize), 750);
    }

    function ask(prize) {
      const q = questions[round];
      const box = $(".mq-question");
      box.hidden = false;
      box.innerHTML = `
        <div class="mq-qcard">
          <div class="mq-qtop"><span class="tag">${esc(q.subject)}</span><span class="mq-prize">+${prize} ball</span></div>
          <h3>${esc(q.q)}</h3>
          <div class="mq-timer"><i></i></div>
          <div class="mq-opts">${q.opts.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
        </div>`;
      left = TIME;
      const bar = box.querySelector(".mq-timer i");
      bar.style.transition = "none";
      bar.style.width = "100%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `width ${TIME}s linear`;
        bar.style.width = "0%";
      }));
      timer = setInterval(() => {
        left--;
        if (left <= 3 && left > 0) ctx.sfx.tick();
        if (left <= 0) answer(null, prize);
      }, 1000);
      box.querySelectorAll(".opt").forEach((b) => (b.onclick = () => answer(b.dataset.o, prize)));
    }

    function answer(choice, prize) {
      clearInterval(timer);
      const q = questions[round];
      const ok = choice === q.a;
      root.querySelectorAll(".opt").forEach((b) => {
        b.disabled = true;
        if (b.dataset.o === q.a) b.classList.add("right");
        else if (b.dataset.o === choice) b.classList.add("wrong");
      });
      if (ok) {
        score += prize;
        correct++;
        ctx.sfx.good();
        coins(prize);
      } else {
        ctx.sfx.bad();
        showMsg(choice === null ? `⏰ Vaqt tugadi! To‘g‘ri javob: ${q.a}` : `❌ To‘g‘ri javob: ${q.a}`, "bad");
      }
      update();
      setTimeout(next, ok ? 1100 : 1900);
    }

    function coins(n) {
      const scene = $(".mq-scene");
      for (let i = 0; i < Math.min(12, n / 3); i++) {
        const c = document.createElement("span");
        c.className = "mq-coin";
        c.textContent = "🪙";
        c.style.left = 40 + Math.random() * 20 + "%";
        c.style.setProperty("--x", (Math.random() - 0.5) * 260 + "px");
        c.style.animationDelay = i * 0.04 + "s";
        scene.appendChild(c);
        setTimeout(() => c.remove(), 1400);
      }
    }

    function showMsg(text, kind) {
      const m = document.createElement("div");
      m.className = "mq-msg " + kind;
      m.textContent = text;
      $(".mq-scene").appendChild(m);
      setTimeout(() => m.remove(), 1800);
    }

    function update() {
      $(".mq-score").textContent = score;
      $(".mq-correct").textContent = correct;
      ctx.send({ round: round + 1, score, correct, done: over });
    }

    function drawOp() {
      if (!op) return;
      const el = $(".mq-op");
      if (el) el.textContent = op.done ? `${op.score} ball · tugatdi` : `${op.score} ball · ${Math.min(op.round, ROUNDS)}-raund`;
    }

    function next() {
      if (over) return;
      round++;
      if (round >= ROUNDS) return end();
      drawBoxes();
    }

    async function end() {
      over = true;
      ctx.send({ round: ROUNDS, score, correct, done: true });
      if (!ctx.opponent) {
        const earn = correct >= 9;
        ctx.finish({
          title: earn ? "Ajoyib natija!" : "O‘yin tugadi",
          text: `${ROUNDS} ta savoldan ${correct} tasiga to‘g‘ri javob berdingiz.`,
          rows: [["Ball", score], ["To‘g‘ri javoblar", `${correct} / ${ROUNDS}`]],
          earnStar: earn,
          starHint: earn ? "" : "Yulduz olish uchun kamida 9 ta savolga to‘g‘ri javob bering."
        });
        return;
      }
      $(".mq-scene").innerHTML = `<div class="g-center"><span class="g-spinner"></span><p>${esc(ctx.opponent.name)} tugatishini kutyapmiz...</p></div>`;
      const opRes = await ctx.exchangeFinal({ score, correct });
      if (!opRes) {
        ctx.finish({
          title: "Do‘stingiz chiqib ketdi",
          text: "G‘olib aniqlanmadi.",
          rows: [["Sizning ballingiz", score], ["To‘g‘ri javoblar", `${correct} / ${ROUNDS}`]],
          earnStar: correct >= 9,
          starHint: "Yulduz uchun 9 ta to‘g‘ri javob kerak edi."
        });
        return;
      }
      const won = score > opRes.score || (score === opRes.score && correct > opRes.correct);
      const draw = score === opRes.score && correct === opRes.correct;
      ctx.finish({
        title: draw ? "Durang!" : won ? "Siz yutdingiz!" : `${ctx.opponent.name} yutdi`,
        won: draw ? undefined : won,
        rows: [
          [ctx.me.name, `${score} ball · ${correct}/${ROUNDS}`],
          [ctx.opponent.name, `${opRes.score} ball · ${opRes.correct}/${ROUNDS}`]
        ],
        earnStar: won && !draw && correct >= 8,
        starHint: won ? "Yulduz uchun g‘alaba va kamida 8 ta to‘g‘ri javob kerak." : "Yulduzni faqat g‘olib oladi (kamida 8 ta to‘g‘ri javob bilan)."
      });
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest(".box");
      if (b && !b.disabled) openBox(Number(b.dataset.i));
    });
    ctx.onMsg((d) => { if (op) { Object.assign(op, d); drawOp(); } });

    drawBoxes();
    return () => { over = true; clearInterval(timer); };
  }

  window.SofiGames.register({
    id: "sirli-quti",
    title: "Sirli quti",
    icon: "🎁",
    mount
  });
})();
