/* “O‘zim uchun 1 soat” — hamma uchun e’lon va 60 daqiqalik orqaga sanash taymeri.
   Tugash vaqti brauzerda saqlanadi: sahifa yopilib ochilsa ham taymer davom etadi. */
(() => {
  "use strict";
  const box = document.getElementById("pfHour");
  // Bosh sahifa va Profil — ikkalasida bir xil saqlangan vaqt (localStorage) ishlatiladi
  if (!box) return;
  const KEY = "sofi_hour_v1", DUR = 60 * 60 * 1000;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  let st = load(), iv = 0;
  // st: { end } — ishlayapti; { left } — pauza; {} — boshlanmagan
  const left = () => (st.end ? Math.max(0, st.end - Date.now()) : st.left != null ? st.left : DUR);
  const fmt = (ms) => { const t = Math.ceil(ms / 1000), m = Math.floor(t / 60), s = t % 60; return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; };
  box.innerHTML = `
    <div class="ph-card">
      <span class="ph-kicker">📣 E’LON · HAMMA UCHUN</span>
      <div class="ph-row">
        <div class="ph-text"><h2>⏳ O‘zim uchun 1 soat</h2>
          <p>Kuniga bir soatni faqat o‘zingizga ajrating: kitob o‘qing, dars takrorlang, sport qiling yoki yangi narsa o‘rganing. Telefonni chetga qo‘yib, tugmani bosing!</p></div>
        <div class="ph-clock">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" data-ring/></svg>
          <b data-time>60:00</b><small data-state>tayyor</small>
        </div>
      </div>
      <div class="ph-btns"><button type="button" class="btn ph-go" data-a="go">▶ Boshlash</button><button type="button" class="btn ghost" data-a="reset">↺ Qaytadan</button></div>
    </div>`;
  const $ = (s) => box.querySelector(s), ring = $("[data-ring]"), C = 2 * Math.PI * 52;
  ring.style.strokeDasharray = C;
  let rang = false;
  function beep() {
    try { const ac = new (window.AudioContext || window.webkitAudioContext)(); [0, 0.35, 0.7].forEach((d, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = [784, 988, 1319][i]; g.gain.setValueAtTime(0.0001, ac.currentTime + d); g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d + 0.6); o.connect(g); g.connect(ac.destination); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + 0.65); }); } catch (e) {}
    try { navigator.vibrate && navigator.vibrate([300, 150, 300]); } catch (e) {}
  }
  function draw() {
    const l = left(), run = !!st.end, done = l <= 0;
    $("[data-time]").textContent = done ? "00:00" : fmt(l);
    ring.style.strokeDashoffset = C * (1 - l / DUR);
    $("[data-state]").textContent = done ? "tugadi 🎉" : run ? "ketmoqda" : st.left != null ? "pauza" : "tayyor";
    const go = $("[data-a=go]");
    go.textContent = done ? "▶ Yana 1 soat" : run ? "⏸ To‘xtatish" : st.left != null ? "▶ Davom etish" : "▶ Boshlash";
    box.classList.toggle("running", run && !done); box.classList.toggle("done", done);
    if (done && run) { st = { left: 0 }; save(st); if (!rang) { rang = true; beep(); } stop(); }
  }
  const tick = () => { draw(); };
  function start() { clearInterval(iv); iv = setInterval(tick, 250); }
  function stop() { clearInterval(iv); iv = 0; }
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    if (b.dataset.a === "go") {
      if (st.end) { st = { left: left() }; stop(); }
      else { const l = st.left != null && st.left > 0 ? st.left : DUR; st = { end: Date.now() + l }; rang = false; start(); }
    } else { st = {}; stop(); rang = false; }
    save(st); draw();
  });
  document.addEventListener("visibilitychange", draw);
  if (st.end) start();
  draw();
})();
