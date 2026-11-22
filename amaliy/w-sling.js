/* Rogatka: haqiqiy fizika — kinoviy tajriba.
   Tortish (F(x) grafigi, U = ∫F dx) → otilish (v₀ = √(2ηU/m)) → uchish (og'irlik + havo qarshiligi) →
   zarba (muz / yog'och / tosh mustahkamligi, bo'laklar) → energiya hisobi.
   Fizika dvigateli: Matter.js (lib/matter.min.js, faqat shu tajriba ochilganda yuklanadi). */
(() => {
  "use strict";
  const { h, slider, buttons, button, frame, W } = window.AK;

  let matterP = null;
  const loadMatter = () => matterP || (matterP = new Promise((res, rej) => {
    if (window.Matter) return res(window.Matter);
    const s = document.createElement("script");
    s.src = "lib/matter.min.js?v=0.19.0";
    s.onload = () => (window.Matter ? res(window.Matter) : rej(new Error("Matter yuklanmadi")));
    s.onerror = () => rej(new Error("Fizika kutubxonasi yuklanmadi"));
    document.head.append(s);
  }));

  // ---------- Fizik doimiylar (SI) ----------
  const PX = 20;                 // Matter ichida 1 m = 20 birlik
  const G = 9.81;
  const STEP = 1000 / 60;        // Matter qadam (ms)
  const BALL = { r: 0.32, m: 4 };                // tosh shar: 4 kg
  const BAND = { k: 3800, c: 8000, eta: 0.79, xMax: 0.62 }; // F = kx + cx³ (ikki juft rezina)
  const AIR = { rho: 1.2, cd: 0.47 };           // havo zichligi, shar uchun Cd
  const FORK = { x: 2.2, y: 1.25 };             // rogatka "ko'zi" (m)
  // Materiallar: maydon zichligi (kg/m²), sinish energiyasi (J), rang
  const MAT = {
    ice: { name: "MUZ", rho: 90, E: 25, sig: "σ ≈ 1 MPa", fill: "rgba(186,230,253,.78)", line: "#38bdf8", text: "#0284c7" },
    wood: { name: "YOG‘OCH", rho: 55, E: 70, sig: "σ ≈ 40 MPa", fill: "#e9c992", line: "#a0763b", text: "#92400e" },
    stone: { name: "TOSH", rho: 260, E: 500, sig: "σ ≈ 100 MPa", fill: "#cbd5e1", line: "#64748b", text: "#475569" },
  };
  const SHIFT = -5;              // inshootlarni rogatkaga yaqinlashtirish (m)
  const bandF = (x) => BAND.k * x + BAND.c * x ** 3;
  const bandU = (x) => 0.5 * BAND.k * x * x + 0.25 * BAND.c * x ** 4;

  // Inshoot loyihalari (m): [tur, material, cx, cy, w, h] — cy: markaz balandligi
  const LEVELS = [
    { name: "Kulba", items: [
      ["box", "wood", 27, 1.0, 0.28, 2.0], ["box", "wood", 30, 1.0, 0.28, 2.0],
      ["box", "wood", 28.5, 2.14, 3.8, 0.28], ["box", "ice", 28.5, 2.73, 0.9, 0.9],
      ["box", "ice", 27.6, 0.45, 0.9, 0.9], ["box", "stone", 31.3, 0.5, 1.0, 1.0],
      ["pig", "", 28.5, 0.42, 0.42], ["pig", "", 28.5, 3.62, 0.42], ["pig", "", 31.3, 1.42, 0.42], ["pig", "", 25.6, 0.42, 0.42]] },
    { name: "Ikki qavat", items: [
      ["box", "wood", 26.6, 1.0, 0.28, 2.0], ["box", "ice", 28.4, 1.0, 0.28, 2.0], ["box", "wood", 30.2, 1.0, 0.28, 2.0],
      ["box", "wood", 28.4, 2.14, 4.2, 0.28],
      ["box", "ice", 27.5, 3.03, 0.28, 1.5], ["box", "ice", 29.3, 3.03, 0.28, 1.5], ["box", "wood", 28.4, 3.92, 2.4, 0.28],
      ["box", "stone", 32, 0.5, 1.0, 1.0],
      ["pig", "", 27.5, 0.42, 0.42], ["pig", "", 29.3, 0.42, 0.42], ["pig", "", 28.4, 2.7, 0.42], ["pig", "", 28.4, 4.48, 0.42]] },
    { name: "Tosh qal’a", items: [
      ["box", "stone", 26.8, 0.6, 0.5, 1.2], ["box", "stone", 30.4, 0.6, 0.5, 1.2], ["box", "ice", 28.6, 0.6, 0.5, 1.2],
      ["box", "wood", 28.6, 1.34, 4.4, 0.28],
      ["box", "ice", 27.4, 2.08, 0.9, 1.2], ["box", "ice", 29.8, 2.08, 0.9, 1.2], ["box", "stone", 28.6, 2.82, 3.4, 0.28],
      ["pig", "", 27.7, 0.42, 0.42], ["pig", "", 29.5, 0.42, 0.42], ["pig", "", 28.6, 2.0, 0.42], ["pig", "", 28.6, 3.38, 0.42]] },
  ];

  // Barqaror (tasodifiy emas) bezaklar
  const rand = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const R0 = rand(7);
  const GRASS = Array.from({ length: 260 }, () => [-12 + R0() * 64, R0() * 3.2, 0.12 + R0() * 0.22, R0() - 0.5]);
  const CLOUDS = Array.from({ length: 9 }, () => [-8 + R0() * 60, 7 + R0() * 9, 0.8 + R0() * 1.4]);

  W.sling = async (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🏹 Rogatka — haqiqiy fizika: tortish → uchish → zarba");
    const cv = h("canvas", { class: "sl-cv", "aria-label": "Rogatka fizik simulyatsiyasi" });
    const tip = h("div", { class: "sl-tip" }, "👆 Sharni orqaga tortib qo‘yib yuboring yoki “▶ Otish”");
    setTimeout(() => (tip.hidden = true), 5000);
    stage.append(cv, tip);
    stage.classList.add("sl-stage");
    out.innerHTML = "⏳ Fizika dvigateli yuklanmoqda…";
    let M;
    try { M = await loadMatter(); } catch (e) { out.innerHTML = "❌ " + e.message; return; }
    const { Engine, Bodies, Body, Composite, Events } = M;
    const x = cv.getContext("2d");

    // ---------- holat ----------
    const S = { ang: p.angle || 36, draw: p.draw || 0.55, level: p.level || 0, air: true, slow: true,
      phase: "aim", t: 0, pull: 0, robotT: 0, ts: 1, hitT: -1, events: [], trail: [], labels: [], parts: [],
      vLaunch: 0, KE0: 0, U: 0, maxF: 0, cam: { x: 8, y: 3, z: 1 }, drag: null, finished: false, finishT: 0 };
    let eng, ball = null, bodies = [], W0 = 0, H0 = 0, DPR = 1;

    function size() {
      const r = cv.getBoundingClientRect(); DPR = Math.min(2, devicePixelRatio || 1);
      W0 = Math.max(300, r.width); H0 = Math.round(W0 * (W0 < 560 ? 0.78 : 0.56));
      cv.style.height = H0 + "px"; cv.width = Math.round(W0 * DPR); cv.height = Math.round(H0 * DPR);
    }
    size();
    const ro = window.ResizeObserver ? new ResizeObserver(() => size()) : null;
    ro && ro.observe(stage);

    // ---------- dunyo ----------
    function build() {
      eng = Engine.create({ enableSleeping: false });
      eng.gravity.y = 1; eng.gravity.scale = (G * PX) / 1e6; // px/ms²
      eng.positionIterations = 8; eng.velocityIterations = 6;
      const ground = Bodies.rectangle(15 * PX, 5 * PX, 200 * PX, 10 * PX, { isStatic: true, friction: 0.9, label: "ground" });
      Composite.add(eng.world, ground);
      bodies = [];
      const its = LEVELS[S.level].items.map((it) => { const c = it.slice(); c[2] += SHIFT; return c; });
      S.tx = its.reduce((a, it) => a + it[2], 0) / its.length;
      its.forEach((it) => {
        if (it[0] === "pig") {
          const b = Bodies.circle(it[2] * PX, -it[3] * PX, it[4] * PX, { friction: 0.6, restitution: 0.15, label: "pig" });
          Body.setMass(b, 18); b.kind = "pig"; b.y0 = it[3]; addB(b);
        } else {
          const m = MAT[it[1]];
          const b = Bodies.rectangle(it[2] * PX, -it[3] * PX, it[4] * PX, it[5] * PX, { friction: 0.7, restitution: 0.05, label: "box" });
          Body.setMass(b, m.rho * it[4] * it[5]); b.kind = "box"; b.mat = it[1]; b.wm = it[4]; b.hm = it[5]; b.y0 = it[3]; addB(b);
        }
      });
      Events.on(eng, "collisionStart", onHit);
      Events.on(eng, "collisionActive", onHit);
    }
    function addB(b) { b.alive = true; b.m0 = b.mass; bodies.push(b); Composite.add(eng.world, b); }
    function kill(b) { b.alive = false; Composite.remove(eng.world, b); }
    const toM = (v) => (v * 60) / PX;              // Matter tezligi (birlik/qadam) → m/s
    const fromM = (v) => (v * PX) / 60;

    // ---------- to'qnashuvlar: zarba energiyasi → sinish ----------
    const brk = new Set(), pops = new Set();
    function onHit(ev) {
      ev.pairs.forEach((pr) => {
        const a = pr.bodyA, b = pr.bodyB, n = pr.collision.normal;
        const va = a.pv || a.velocity, vb = b.pv || b.velocity; // qadamdan OLDINGI tezliklar
        const vr = ((va.x - vb.x) * n.x + (va.y - vb.y) * n.y);
        const v = Math.abs(toM(vr));
        const other = a === ball ? b : b === ball ? a : null;
        if (other && other.label === "ground" && S.landT < 0) S.landT = S.t;
        if (other && other.label !== "ground" && S.hitT < 0) { S.hitT = S.t; S.impactF = 0; }
        if (v < 1.2) return;
        const ma = a.isStatic ? Infinity : a.mass, mb = b.isStatic ? Infinity : b.mass;
        const mu = ma === Infinity ? mb : mb === Infinity ? ma : (ma * mb) / (ma + mb);
        const E = 0.5 * mu * v * v;
        const F = (mu * v) / 0.004; // zarba vaqti ~4 ms
        if (other && other.label !== "ground" && !S.impactF) S.impactF = F;
        if (a === ball || b === ball) S.maxF = Math.max(S.maxF, F);
        [a, b].forEach((o) => {
          if (!o.alive || o.isStatic) return;
          if (o.kind === "pig" && E > 14) pops.add(o);
          if (o.kind === "box" && !o.frag && E > MAT[o.mat].E) brk.add(o);
        });
      });
    }
    function shatter(o) {
      kill(o);
      const m = MAT[o.mat], nx = o.mat === "ice" ? 3 : 2, ny = o.mat === "ice" ? 3 : 2;
      const w = o.wm / nx, hh = o.hm / ny, cs = Math.cos(o.angle), sn = Math.sin(o.angle);
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const lx = (i + 0.5) * w - o.wm / 2, ly = (j + 0.5) * hh - o.hm / 2;
        const px = o.position.x + (lx * cs - ly * sn) * PX, py = o.position.y + (lx * sn + ly * cs) * PX;
        const f = Bodies.rectangle(px, py, w * PX * 0.94, hh * PX * 0.94, { angle: o.angle, friction: 0.6, restitution: 0.1 });
        Body.setMass(f, Math.max(0.5, m.rho * w * hh)); f.kind = "box"; f.mat = o.mat; f.frag = true; f.wm = w; f.hm = hh;
        f.y0 = o.y0 + (o.position.y - py) / PX; // bo'lak boshlang'ich balandligi (energiya hisobi uchun)
        Body.setVelocity(f, { x: o.velocity.x + (Math.random() - 0.5) * 2.4, y: o.velocity.y - Math.random() * 1.8 });
        Body.setAngularVelocity(f, (Math.random() - 0.5) * 0.3);
        addB(f);
      }
      for (let k = 0; k < (o.mat === "ice" ? 26 : 14); k++) S.parts.push({ x: o.position.x / PX, y: -o.position.y / PX, vx: (Math.random() - 0.4) * 7, vy: Math.random() * 6, life: 1.4 + Math.random(), c: m.line, s: 0.05 + Math.random() * 0.1 });
      S.labels.push({ x: o.position.x / PX, y: -o.position.y / PX + 0.6, text: m.name, sub: m.sig, c: m.text, life: 2.2 });
    }
    function pop(o) {
      kill(o);
      for (let k = 0; k < 18; k++) S.parts.push({ x: o.position.x / PX, y: -o.position.y / PX, vx: (Math.random() - 0.5) * 8, vy: Math.random() * 7, life: 1 + Math.random(), c: "#22c55e", s: 0.06 + Math.random() * 0.08 });
      S.labels.push({ x: o.position.x / PX, y: -o.position.y / PX + 0.7, text: "POP!", sub: "", c: "#16a34a", life: 1.8, big: true });
    }

    // ---------- boshqaruv ----------
    const sA = slider({ label: "Otish burchagi θ", min: 10, max: 75, value: S.ang, fmt: (v) => v + "°", onInput: (v) => { S.ang = v; if (S.phase === "aim") S.pull = S.draw; } });
    const sD = slider({ label: "Tortish x", min: 0.15, max: BAND.xMax, step: 0.01, value: S.draw, fmt: (v) => v.toFixed(2) + " m", onInput: (v) => { S.draw = v; if (S.phase === "aim") S.pull = v; } });
    const lv = buttons(LEVELS.map((l, i) => `${["🏚", "🏠", "🏰"][i]} ${l.name}`), (i) => { S.level = i; reset(); }, S.level);
    const bGo = button("▶ Otish (robot qo‘l tortadi)", () => { if (S.phase === "aim") { S.phase = "robot"; S.robotT = 0; S.pull = 0; } }, "primary");
    const bRe = button("↺ Qaytadan", () => reset());
    const tAir = button("💨 Havo qarshiligi: yoqiq", () => { S.air = !S.air; tAir.innerHTML = "💨 Havo qarshiligi: " + (S.air ? "yoqiq" : "o‘chiq"); });
    const tSlow = button("🐢 Sekin harakat: avto", () => { S.slow = !S.slow; tSlow.innerHTML = "🐢 Sekin harakat: " + (S.slow ? "avto" : "o‘chiq"); });
    controls.append(sA, sD, lv, h("div", { class: "sl-row" }, bGo, bRe, tAir, tSlow));

    function reset() {
      if (eng) { Events.off(eng); Engine.clear(eng); }
      brk.clear(); pops.clear();
      Object.assign(S, { phase: "aim", t: 0, pull: S.draw, ts: 1, hitT: -1, landT: -1, hitReal: 0, trail: [], labels: [], parts: [], finished: false, maxF: 0, impactF: 0, vLaunch: 0 });
      ball = null; build(); S.cam = { x: 8, y: 3, z: 1 }; tip.hidden = false; info();
    }

    // ---------- ko'rsatkichlar (pastdagi matn) ----------
    function info(final) {
      const U = bandU(S.draw), v0 = Math.sqrt((2 * BAND.eta * U) / BALL.m);
      const live = bodies.filter((b) => b.kind === "pig" && b.alive).length, all = bodies.filter((b) => b.kind === "pig").length;
      let html = `<div class="sl-f">F(x) = kx + cx³ <small>(k = ${BAND.k} N/m, c = ${BAND.c} N/m³ — ikki juft rezina)</small></div>
        <div class="sl-f">U = ∫F dx = ½kx² + ¼cx⁴ = <b>${U.toFixed(0)} J</b> <small>(x = ${S.draw.toFixed(2)} m)</small></div>
        <div class="sl-f">v₀ = √(2ηU / m) = <b>${v0.toFixed(1)} m/s</b> <small>(η = ${Math.round(BAND.eta * 100)} %, m = ${BALL.m} kg)</small></div>
        <div class="sl-f">m·a = m·g ${S.air ? "− ½ρC<sub>D</sub>A·|v|·v" : ""} <small>${S.air ? `(ρ = ${AIR.rho} kg/m³, C<sub>D</sub> = ${AIR.cd})` : "(havo qarshiligisiz — ideal parabola)"}</small></div>`;
      if (final) html += final;
      else html += `<div class="sl-f">🎯 Nishonlar: <b>${all - live} / ${all}</b> urildi</div>`;
      out.innerHTML = html;
    }

    // ---------- sudrab tortish (barmoq / sichqoncha) ----------
    const toWorld = (e) => {
      const r = cv.getBoundingClientRect(), sc = scale();
      return [S.cam.x + (e.clientX - r.left - W0 / 2) / sc, S.cam.y - (e.clientY - r.top - H0 * 0.55) / sc];
    };
    cv.addEventListener("pointerdown", (e) => {
      if (S.phase !== "aim") return;
      const [wx, wy] = toWorld(e), bp = ballAim();
      if (Math.hypot(wx - bp[0], wy - bp[1]) < 1.6) { S.drag = true; cv.setPointerCapture(e.pointerId); tip.hidden = true; e.preventDefault(); }
    });
    cv.addEventListener("pointermove", (e) => {
      if (!S.drag) return;
      const [wx, wy] = toWorld(e), dx = FORK.x - wx, dy = FORK.y - wy, d = Math.min(BAND.xMax, Math.max(0.1, Math.hypot(dx, dy)));
      const ang = Math.max(10, Math.min(75, (Math.atan2(dy, dx) * 180) / Math.PI));
      S.ang = Math.round(ang); S.draw = Math.round(d * 100) / 100; S.pull = S.draw; sA.set(S.ang); sD.set(S.draw); info();
    });
    const up = () => { if (S.drag) { S.drag = false; launch(); } };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);

    const ballAim = () => { const a = (S.ang * Math.PI) / 180; return [FORK.x - Math.cos(a) * S.pull, FORK.y - Math.sin(a) * S.pull]; };
    function launch() {
      const a = (S.ang * Math.PI) / 180, U = bandU(S.draw), v0 = Math.sqrt((2 * BAND.eta * U) / BALL.m);
      const [bx, by] = ballAim();
      ball = Bodies.circle(bx * PX, -by * PX, BALL.r * PX, { friction: 0.4, restitution: 0.25, frictionAir: 0, label: "ball" });
      Body.setMass(ball, BALL.m); ball.kind = "ball"; ball.alive = true; ball.y0 = by;
      Composite.add(eng.world, ball);
      Body.setVelocity(ball, { x: fromM(v0 * Math.cos(a)), y: -fromM(v0 * Math.sin(a)) });
      Object.assign(S, { phase: "fly", t: 0, vLaunch: v0, KE0: 0.5 * BALL.m * v0 * v0, U, trail: [] });
      tip.hidden = true; info();
    }

    // ---------- kamera ----------
    const scale = () => (W0 / 26) * S.cam.z;
    function camTarget() {
      if (S.phase === "aim" || S.phase === "robot") return { x: 4.5, y: 2.4, z: W0 < 560 ? 1.9 : 1.6 };
      if (S.phase === "fly" && ball && S.hitT < 0) {
        const bx = ball.position.x / PX, by = -ball.position.y / PX;
        const near = bx > S.tx - 6;
        return { x: Math.max(6, bx + (near ? 1 : 4)), y: Math.max(3, by * 0.6 + 2), z: near ? 1.45 : 1.0 };
      }
      if (S.hitT < 0 && ball) return { x: Math.min(ball.position.x / PX + 2, S.tx), y: 2.8, z: 1.25 };
      return { x: S.tx, y: 2.8, z: W0 < 560 ? 1.7 : 1.5 };
    }

    // ---------- asosiy sikl ----------
    let raf = 0, last = performance.now();
    function loop(now) {
      if (!root.isConnected) { cancelAnimationFrame(raf); ro && ro.disconnect(); return; }
      const dtReal = Math.min(0.05, (now - last) / 1000); last = now;
      // robot qo'l rezinani asta tortadi
      if (S.phase === "robot") {
        S.robotT += dtReal; S.pull = Math.min(S.draw, S.draw * Math.min(1, S.robotT / 1.6));
        if (S.robotT > 2.0) launch();
      }
      // sekin harakat
      let target = 1;
      if (S.slow && S.phase === "fly" && ball) {
        const bx = ball.position.x / PX;
        if (ball.speed < fromM(1.5)) target = 1; // shar deyarli to'xtagan — sekinlashtirish kerak emas
        else if (S.hitT < 0 && S.landT < 0 && bx > S.tx - 5 && bx < S.tx + 4) target = 0.125;
        else if (S.hitT >= 0 && S.t - S.hitT < 0.35) target = 0.08;
        else if (S.hitT >= 0 && S.t - S.hitT < 1.4) target = 0.25;
        else if (S.hitT >= 0 && S.t - S.hitT < 3) target = 0.5;
      }
      S.ts += (target - S.ts) * 0.15;
      if (S.phase === "fly") {
        const steps = 2;
        for (let i = 0; i < steps; i++) {
          eng.timing.timeScale = S.ts;
          // havo qarshiligi (faqat sharga sezilarli)
          if (S.air && ball) {
            const vx = toM(ball.velocity.x), vy = -toM(ball.velocity.y), v = Math.hypot(vx, vy);
            const kA = 0.5 * AIR.rho * AIR.cd * Math.PI * BALL.r * BALL.r, dt = (STEP / 1000 / steps) * S.ts;
            const f = (kA * v * dt) / BALL.m;
            Body.setVelocity(ball, { x: fromM(vx - f * vx), y: -fromM(vy - f * vy) });
          }
          bodies.forEach((b) => { if (b.alive) b.pv = { x: b.velocity.x, y: b.velocity.y }; });
          if (ball) ball.pv = { x: ball.velocity.x, y: ball.velocity.y };
          Engine.update(eng, STEP / steps);
          S.t += (STEP / 1000 / steps) * S.ts;
          brk.forEach(shatter); brk.clear();
          pops.forEach(pop); pops.clear();
        }
        // yiqilib ketgan nishonlar
        bodies.forEach((b) => { if (b.alive && b.kind === "pig" && b.y0 > 1.2 && -b.position.y / PX < 0.7) pop(b); }); // balanddan yerga qulagan nishon
        if (ball && S.landT >= 0 && -ball.position.y / PX < BALL.r + 0.05) Body.setVelocity(ball, { x: ball.velocity.x * 0.985, y: ball.velocity.y });
        if (ball) { S.trail.push([ball.position.x / PX, -ball.position.y / PX]); if (S.trail.length > 400) S.trail.shift(); }
        // tugash sharti
        const moving = bodies.some((b) => b.alive && b.speed > 0.25) || (ball && ball.speed > 0.25 && -ball.position.y / PX > -2);
        if (S.hitT >= 0 && !S.hitReal) S.hitReal = now;
        if (!S.finished && S.hitT >= 0 && S.t - S.hitT > 2.2 && !moving) finish();
        if (!S.finished && S.hitT >= 0 && (S.t - S.hitT > 5 || now - S.hitReal > 9000)) finish();
        if (!S.finished && S.t > 14) finish();
        if (!S.finished && S.hitT < 0 && S.landT >= 0 && (S.t - S.landT > 2.5 || (ball && ball.speed < 0.15))) finish();
        if (!S.finished && ball && ball.position.x / PX > 60) finish();
        if (!S.finished) info();
      }
      // zarrachalar va yozuvlar
      const pdt = dtReal * Math.max(0.15, S.ts);
      S.parts.forEach((q) => { q.vy -= G * pdt; q.x += q.vx * pdt; q.y += q.vy * pdt; if (q.y < 0) { q.y = 0; q.vx *= 0.6; q.vy *= -0.3; } q.life -= dtReal; });
      S.parts = S.parts.filter((q) => q.life > 0);
      S.labels.forEach((l) => { l.life -= dtReal; l.y += dtReal * 0.4; });
      S.labels = S.labels.filter((l) => l.life > 0);
      const ct = camTarget(); S.cam.x += (ct.x - S.cam.x) * 0.06; S.cam.y += (ct.y - S.cam.y) * 0.06; S.cam.z += (ct.z - S.cam.z) * 0.05;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function finish() {
      S.finished = true; S.phase = "done";
      const all = bodies.filter((b) => b.kind === "pig"), hit = all.filter((b) => !b.alive).length;
      // og'irlik kuchi bo'shatgan energiya: Σ m g (h0 − h)
      let Eg = 0;
      bodies.forEach((b) => { if (b.alive && b.kind === "box") Eg += b.mass * G * Math.max(0, b.y0 - -b.position.y / PX); });
      bodies.forEach((b) => { if (!b.alive && b.kind === "box" && !b.frag) { /* sinib ketgan — bo'laklari hisoblangan */ } });
      S.Eg = Eg; S.hit = hit; S.all = all.length;
      const mx = Math.max(S.KE0, Eg, 1);
      const bar = (v, c, l) => `<div class="sl-bar"><i style="height:${Math.max(4, (v / mx) * 90)}px;background:${c}"></i><b>${v.toFixed(0)} J</b><small>${l}</small></div>`;
      info(`<div class="sl-end ${hit === all.length ? "win" : ""}">
        <b>${hit === all.length ? "🏆 DARAJA TUGADI" : "🎯 Natija"} · ${hit}/${all.length} nishon</b>
        <p>Shar olib kelgan energiya: <b>${S.KE0.toFixed(0)} J</b> · og‘irlik kuchi bo‘shatgan energiya: <b>${Eg.toFixed(0)} J</b> ${Eg > S.KE0 ? `(×${(Eg / Math.max(1, S.KE0)).toFixed(1)} — qulagan inshoot o‘zi ko‘proq energiya berdi!)` : ""}</p>
        ${S.hitT < 0 ? `<p>Shar inshootga yetib bormadi — <b>${(ball ? ball.position.x / PX - FORK.x : 0).toFixed(1)} m</b> uchdi. Burchak yoki tortishni o‘zgartiring.</p>` : ""}
        <p>Eng katta zarba kuchi: <b>${(S.maxF / 1000).toFixed(1)} kN</b> · uchish vaqti: <b>${(S.hitT >= 0 ? S.hitT : S.t).toFixed(2)} s</b></p>
        <div class="sl-bars">${bar(S.KE0, "#ef4444", "shar (Eₖ)")}${bar(Eg, "#22c55e", "og‘irlik (mgh)")}${bar(S.U, "#a16207", "rezina (U)")}</div>
        <p class="sl-hint">💡 Burchak yoki tortishni 1–2 birlikka o‘zgartirib qayta urinib ko‘ring — natija qanchalik o‘zgarishini kuzating (xaotik tizim!).</p></div>`);
    }

    // ---------- chizish ----------
    function draw() {
      const sc = scale(), cx = S.cam.x, cy = S.cam.y;
      const X = (wx) => W0 / 2 + (wx - cx) * sc, Y = (wy) => H0 * 0.55 - (wy - cy) * sc;
      x.setTransform(DPR, 0, 0, DPR, 0, 0);
      // osmon va qog'oz fon
      const g = x.createLinearGradient(0, 0, 0, H0); g.addColorStop(0, "#f4f1e8"); g.addColorStop(1, "#ebe7da");
      x.fillStyle = g; x.fillRect(0, 0, W0, H0);
      // bulutlar (parallaks)
      CLOUDS.forEach(([wx, wy, s]) => {
        const px = W0 / 2 + (wx - cx * 0.4) * sc * 0.5, py = H0 * 0.55 - (wy - cy * 0.4) * sc * 0.5;
        x.fillStyle = "rgba(255,255,255,.9)"; x.strokeStyle = "rgba(148,163,184,.45)"; x.lineWidth = 1;
        x.beginPath(); [[0, 0, 1], [0.9, 0.15, 0.75], [-0.85, 0.2, 0.7], [0.3, -0.35, 0.65]].forEach(([dx, dy, r]) => x.ellipse(px + dx * s * sc * 0.45, py + dy * s * sc * 0.45, r * s * sc * 0.42, r * s * sc * 0.3, 0, 0, Math.PI * 2));
        x.fill(); x.stroke();
      });
      // yer
      const gy = Y(0);
      x.fillStyle = "#e6e2d3"; x.fillRect(0, gy, W0, H0 - gy);
      x.strokeStyle = "#b9b29c"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, gy); x.lineTo(W0, gy); x.stroke();
      x.strokeStyle = "rgba(120,113,95,.55)"; x.lineWidth = 1;
      GRASS.forEach(([wx, d, hgt, lean]) => { const px = X(wx), py = gy + d * sc * 0.25; if (px < -10 || px > W0 + 10) return; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + lean * 4, py - hgt * sc * 0.5, px + lean * 8, py - hgt * sc); x.stroke(); });
      // masofa belgilari
      x.fillStyle = "rgba(87,83,78,.7)"; x.font = `600 ${Math.max(10, sc * 0.32)}px Inter, system-ui, sans-serif`; x.textAlign = "center";
      for (let m = 5; m <= 45; m += 5) { const px = X(m); if (px < 0 || px > W0) continue; x.fillRect(px - 0.5, gy, 1, 6); x.fillText(m + " m", px, gy + 6 + Math.max(10, sc * 0.32)); }
      // iz chizig'i
      x.fillStyle = "rgba(127,29,29,.55)";
      S.trail.forEach(([wx, wy], i) => { if (i % 3) return; x.beginPath(); x.arc(X(wx), Y(wy), Math.max(1.2, sc * 0.04), 0, Math.PI * 2); x.fill(); });
      // rogatka
      drawSling(X, Y, sc);
      // jismlar
      bodies.forEach((b) => { if (!b.alive) return; if (b.kind === "pig") drawPig(b, X, Y, sc); else drawBox(b, X, Y, sc); });
      // zarrachalar
      S.parts.forEach((q) => { x.globalAlpha = Math.min(1, q.life); x.fillStyle = q.c; x.fillRect(X(q.x) - (q.s * sc) / 2, Y(q.y) - (q.s * sc) / 2, q.s * sc, q.s * sc); });
      x.globalAlpha = 1;
      // shar va vektorlar
      if (ball && S.phase !== "aim") drawBall(ball.position.x / PX, -ball.position.y / PX, X, Y, sc, true);
      // yozuvlar
      S.labels.forEach((l) => {
        x.globalAlpha = Math.min(1, l.life); x.textAlign = "center"; x.fillStyle = l.c;
        x.font = `900 ${Math.max(13, sc * (l.big ? 0.62 : 0.42))}px Georgia, serif`; x.fillText(l.text, X(l.x), Y(l.y));
        if (l.sub) { x.font = `italic 600 ${Math.max(10, sc * 0.26)}px Georgia, serif`; x.fillText(l.sub, X(l.x), Y(l.y) + Math.max(12, sc * 0.34)); }
      });
      x.globalAlpha = 1;
      drawHUD();
      if (S.phase === "aim" || S.phase === "robot") drawGraph();
    }
    function drawSling(X, Y, sc) {
      const lw = Math.max(3, sc * 0.16);
      x.lineCap = "round"; x.strokeStyle = "#a0855b"; x.lineWidth = lw;
      // poya va ikki shox
      x.beginPath(); x.moveTo(X(FORK.x), Y(0)); x.lineTo(X(FORK.x), Y(FORK.y - 0.45)); x.stroke();
      const tA = [FORK.x - 0.28, FORK.y + 0.18], tB = [FORK.x + 0.3, FORK.y + 0.22];
      x.beginPath(); x.moveTo(X(FORK.x), Y(FORK.y - 0.45)); x.quadraticCurveTo(X(FORK.x - 0.2), Y(FORK.y - 0.1), X(tA[0]), Y(tA[1])); x.stroke();
      x.beginPath(); x.moveTo(X(FORK.x), Y(FORK.y - 0.45)); x.quadraticCurveTo(X(FORK.x + 0.2), Y(FORK.y - 0.1), X(tB[0]), Y(tB[1])); x.stroke();
      x.strokeStyle = "#7c6a4a"; x.lineWidth = 1; x.stroke();
      // rezinalar
      const held = S.phase === "aim" || S.phase === "robot";
      const bp = held ? ballAim() : [FORK.x, FORK.y];
      x.strokeStyle = "#7c2d12"; x.lineWidth = Math.max(2, sc * 0.07);
      [tA, tB].forEach((t) => { x.beginPath(); x.moveTo(X(t[0]), Y(t[1])); x.lineTo(X(bp[0]), Y(bp[1])); x.stroke(); });
      if (held) {
        if (S.phase === "robot") drawRobot(X, Y, sc, bp);
        drawBall(bp[0], bp[1], X, Y, sc, false);
        // kuch vektori (rezina tarangligi)
        const F = bandF(S.pull), a = (S.ang * Math.PI) / 180, L = Math.min(3, 0.6 + F / 900);
        arrow(X(bp[0]), Y(bp[1]), X(bp[0] + Math.cos(a) * L), Y(bp[1] + Math.sin(a) * L), "#dc2626", `F = ${F.toFixed(0)} N`);
      }
    }
    function drawRobot(X, Y, sc, tgt) {
      // 2 bo'g'inli robot qo'l: asos (−1.6; 0), elka 1.3 m, bilak 1.2 m — teskari kinematika
      const base = [-1.4, 0.9], L1 = 1.4, L2 = 1.3, dx = tgt[0] - base[0], dy = tgt[1] - base[1];
      const d = Math.min(L1 + L2 - 0.01, Math.hypot(dx, dy)), a2 = Math.acos((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2));
      const a1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
      const el = [base[0] + L1 * Math.cos(a1), base[1] + L1 * Math.sin(a1)];
      x.fillStyle = "#f1f5f9"; x.strokeStyle = "#475569"; x.lineWidth = 1.5;
      x.beginPath(); x.ellipse(X(base[0]), Y(0.45), 0.8 * sc, 0.25 * sc, 0, 0, Math.PI * 2); x.fill(); x.stroke();
      x.fillRect(X(base[0] - 0.8), Y(0.9), 1.6 * sc, 0.45 * sc); x.strokeRect(X(base[0] - 0.8), Y(0.9), 1.6 * sc, 0.45 * sc);
      const seg = (p1, p2, w) => { x.strokeStyle = "#475569"; x.lineWidth = w + 2; x.beginPath(); x.moveTo(X(p1[0]), Y(p1[1])); x.lineTo(X(p2[0]), Y(p2[1])); x.stroke(); x.strokeStyle = "#e2e8f0"; x.lineWidth = w; x.stroke(); };
      seg(base, el, Math.max(6, sc * 0.32)); seg(el, tgt, Math.max(5, sc * 0.26));
      [base, el].forEach((j) => { x.fillStyle = "#cbd5e1"; x.beginPath(); x.arc(X(j[0]), Y(j[1]), Math.max(4, sc * 0.2), 0, Math.PI * 2); x.fill(); x.stroke(); });
      x.fillStyle = "#334155"; x.font = `italic ${Math.max(10, sc * 0.26)}px Georgia, serif`; x.textAlign = "left";
      x.fillText(`τ ≈ ${(bandF(S.pull) * 1.2).toFixed(0)} N·m`, X(el[0]) + 8, Y(el[1]) - 6);
    }
    function drawBall(wx, wy, X, Y, sc, vec) {
      const r = BALL.r * sc;
      const gr = x.createRadialGradient(X(wx) - r * 0.35, Y(wy) - r * 0.35, r * 0.1, X(wx), Y(wy), r);
      gr.addColorStop(0, "#fca5a5"); gr.addColorStop(0.5, "#dc2626"); gr.addColorStop(1, "#7f1d1d");
      x.fillStyle = gr; x.beginPath(); x.arc(X(wx), Y(wy), r, 0, Math.PI * 2); x.fill();
      x.strokeStyle = "#450a0a"; x.lineWidth = 1; x.stroke();
      if (vec && ball && S.phase === "fly" && S.hitT < 0) {
        const vx = toM(ball.velocity.x), vy = -toM(ball.velocity.y), v = Math.hypot(vx, vy), k = 0.09;
        arrow(X(wx), Y(wy), X(wx + vx * k), Y(wy + vy * k), "#dc2626", `v = ${v.toFixed(1)} m/s`);
        arrow(X(wx), Y(wy), X(wx), Y(wy - 1.2), "#334155", "mg");
        if (S.air) arrow(X(wx), Y(wy), X(wx - (vx / v) * 0.6), Y(wy - (vy / v) * 0.6), "#0ea5e9", "F_qarsh");
      }
    }
    function drawBox(b, X, Y, sc) {
      const m = MAT[b.mat];
      x.save(); x.translate(X(b.position.x / PX), Y(-b.position.y / PX)); x.rotate(b.angle);
      const w = b.wm * sc, hh = b.hm * sc;
      x.fillStyle = m.fill; x.strokeStyle = m.line; x.lineWidth = 1.4;
      x.fillRect(-w / 2, -hh / 2, w, hh); x.strokeRect(-w / 2, -hh / 2, w, hh);
      if (b.mat === "wood") { x.strokeStyle = "rgba(146,64,14,.35)"; x.lineWidth = 1; const n = Math.max(1, Math.round(Math.max(w, hh) / 14)); for (let i = 1; i < n; i++) { x.beginPath(); if (w > hh) { x.moveTo(-w / 2, -hh / 2 + (hh * i) / n); x.lineTo(w / 2, -hh / 2 + (hh * i) / n); } else { x.moveTo(-w / 2 + (w * i) / n, -hh / 2); x.lineTo(-w / 2 + (w * i) / n, hh / 2); } x.stroke(); } }
      if (b.mat === "ice") { x.strokeStyle = "rgba(255,255,255,.9)"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-w / 2 + 3, -hh / 2 + hh * 0.3); x.lineTo(-w / 2 + w * 0.35, -hh / 2 + 3); x.stroke(); }
      if (b.mat === "stone") { x.fillStyle = "rgba(71,85,105,.35)"; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(-w / 2 + ((i * 37) % 100) / 100 * w, -hh / 2 + ((i * 61) % 100) / 100 * hh, Math.max(1, sc * 0.04), 0, Math.PI * 2); x.fill(); } }
      x.restore();
    }
    function drawPig(b, X, Y, sc) {
      const r = b.circleRadius / PX * sc, px = X(b.position.x / PX), py = Y(-b.position.y / PX);
      const gr = x.createRadialGradient(px - r * 0.3, py - r * 0.35, r * 0.1, px, py, r);
      gr.addColorStop(0, "#bbf7d0"); gr.addColorStop(0.55, "#22c55e"); gr.addColorStop(1, "#15803d");
      x.fillStyle = gr; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); x.strokeStyle = "#14532d"; x.lineWidth = 1; x.stroke();
    }
    function arrow(x1, y1, x2, y2, c, label) {
      const a = Math.atan2(y2 - y1, x2 - x1), hl = 8;
      x.strokeStyle = c; x.fillStyle = c; x.lineWidth = 2;
      x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
      x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - hl * Math.cos(a - 0.4), y2 - hl * Math.sin(a - 0.4)); x.lineTo(x2 - hl * Math.cos(a + 0.4), y2 - hl * Math.sin(a + 0.4)); x.closePath(); x.fill();
      if (label) { x.font = "italic 600 12px Georgia, serif"; x.textAlign = "left"; x.fillText(label, x2 + 5, y2 - 4); }
    }
    function drawHUD() {
      x.textAlign = "left"; x.fillStyle = "#1c1917"; x.font = "600 13px ui-monospace, Menlo, monospace";
      x.fillText(`t = ${S.t.toFixed(3)} s`, 12, 20);
      let main = "", sub = "";
      if (S.phase === "aim" || S.phase === "robot") { main = `F = ${bandF(S.pull).toFixed(0)} N`; sub = `U = ${bandU(S.pull).toFixed(0)} J`; }
      else if (ball && S.hitT < 0) { const v = Math.hypot(toM(ball.velocity.x), toM(ball.velocity.y)); main = `v = ${v.toFixed(1)} m/s`; sub = `Eₖ = ${(0.5 * BALL.m * v * v).toFixed(0)} J`; }
      else if (S.hitT >= 0 && S.t - S.hitT < 0.8) { main = `F = ${(S.impactF / 1000).toFixed(1)} kN`; sub = "sharning zarba kuchi"; }
      else { main = `${bodies.filter((b) => b.kind === "pig" && !b.alive).length}/${bodies.filter((b) => b.kind === "pig").length} nishon`; sub = S.finished ? "tugadi" : "inshoot qulamoqda…"; }
      x.textAlign = "center"; x.fillStyle = "#b91c1c"; x.font = "italic 700 16px Georgia, serif"; x.fillText(main, W0 / 2, 22);
      x.fillStyle = "#57534e"; x.font = "italic 11px Georgia, serif"; x.fillText(sub, W0 / 2, 37);
      if (S.ts < 0.95 && S.phase === "fly") {
        const k = Math.round(1 / S.ts); x.strokeStyle = "#1c1917"; x.lineWidth = 1; x.strokeRect(12, 28, 46, 18);
        x.fillStyle = "#1c1917"; x.font = "700 11px ui-monospace, Menlo, monospace"; x.textAlign = "center"; x.fillText(`×1/${k}`, 35, 41);
      }
      // nishonlar ko'rsatkichi
      const pigs = bodies.filter((b) => b.kind === "pig");
      pigs.forEach((b, i) => { x.beginPath(); x.arc(W0 - 18 - (pigs.length - 1 - i) * 16, 18, 6, 0, Math.PI * 2); x.fillStyle = b.alive ? "#22c55e" : "transparent"; x.fill(); x.strokeStyle = "#15803d"; x.lineWidth = 1.2; x.stroke(); });
      x.fillStyle = "#57534e"; x.font = "9px Inter, system-ui, sans-serif"; x.textAlign = "right"; x.fillText("g ↓", W0 - 12, 36);
    }
    function drawGraph() {
      // F(x) grafigi — yuza = rezinada to'plangan energiya U
      const gw = Math.min(230, W0 * 0.42), gh = Math.min(120, H0 * 0.3), ox = W0 - gw - 22, oy = 52 + gh + 22;
      x.fillStyle = "rgba(255,255,255,.75)"; x.strokeStyle = "rgba(87,83,78,.35)"; x.lineWidth = 1;
      x.fillRect(ox - 6, oy - gh - 22, gw + 22, gh + 30); x.strokeRect(ox - 6, oy - gh - 22, gw + 22, gh + 30);
      const Fm = bandF(BAND.xMax), XX = (v) => ox + 22 + (v / BAND.xMax) * (gw - 22), YY = (f) => oy - 4 - (f / Fm) * (gh - 10);
      x.strokeStyle = "#57534e"; x.beginPath(); x.moveTo(XX(0), YY(Fm)); x.lineTo(XX(0), YY(0)); x.lineTo(XX(BAND.xMax), YY(0)); x.stroke();
      x.fillStyle = "rgba(161,98,7,.25)"; x.beginPath(); x.moveTo(XX(0), YY(0));
      for (let v = 0; v <= S.pull; v += 0.01) x.lineTo(XX(v), YY(bandF(v)));
      x.lineTo(XX(S.pull), YY(0)); x.closePath(); x.fill();
      x.strokeStyle = "#a16207"; x.lineWidth = 1.6; x.beginPath();
      for (let v = 0; v <= BAND.xMax + 1e-9; v += 0.01) { const px = XX(v), py = YY(bandF(v)); v ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
      x.fillStyle = "#dc2626"; x.beginPath(); x.arc(XX(S.pull), YY(bandF(S.pull)), 3.5, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#44403c"; x.font = "10px Inter, system-ui, sans-serif"; x.textAlign = "left";
      x.fillText("F (N)", ox, oy - gh - 10); x.textAlign = "right"; x.fillText("cho‘zilish x (m)", XX(BAND.xMax), oy + 10);
      x.fillStyle = "#7c2d12"; x.font = "italic 700 11px Georgia, serif"; x.textAlign = "center";
      if (S.pull > 0.12) x.fillText(`U = ${bandU(S.pull).toFixed(0)} J`, XX(S.pull * 0.6), YY(bandF(S.pull) * 0.28));
      x.fillStyle = "#57534e"; x.font = "italic 9px Georgia, serif"; x.textAlign = "right"; x.fillText("yuza = to‘plangan energiya", ox + gw + 10, oy - gh - 10);
    }

    reset();
    S.pull = S.draw;
    raf = requestAnimationFrame(loop);
  };
})();
