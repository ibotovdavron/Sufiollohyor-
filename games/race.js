/* 2-o'yin: Bilimlar poygasi.
   Mashina 3 qatorli yo'lda yuradi: to'siqlardan qochiladi, savol darvozasida
   to'g'ri javob yozilgan qatordan o'tilsa — nitro, xato bo'lsa — sekinlashadi. */
(() => {
  "use strict";
  const Q = window.SofiQuestions;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const LENGTH = 1500;       // metr
  const CRUISE = 22;         // m/s
  const NITRO = 34;
  const LANE_M = 3.6;
  const GATES = 7;
  const SEND_MS = 120;

  function buildTrack(seed, level) {
    const r = Q.rng(seed ^ 0x7ac3);
    const qs = Q.make(seed ^ 0x2222, GATES, level);
    const gates = qs.map((q, i) => {
      const wrong = Q.shuffle(r, q.opts.filter((o) => o !== q.a)).slice(0, 2);
      return { d: 170 + i * 185, q, lanes: Q.shuffle(r, [q.a, ...wrong]), done: false, picked: null };
    });
    const obstacles = [];
    for (let d = 90; d < LENGTH - 60; d += 34 + r() * 40) {
      if (gates.some((g) => Math.abs(g.d - d) < 42)) continue;
      const free = Math.floor(r() * 3);
      const lanes = [0, 1, 2].filter((l) => l !== free);
      const count = r() < 0.3 + level * 0.08 ? 2 : 1;
      Q.shuffle(r, lanes).slice(0, count).forEach((lane) => {
        obstacles.push({ d: d + (r() - 0.5) * 4, lane, kind: Q.pick(r, ["cone", "cone", "oil", "barrier"]), hit: false });
      });
    }
    const trees = [];
    for (let d = -40; d < LENGTH + 80; d += 2 + r() * 5) {
      trees.push({ d, side: r() < 0.5 ? -1 : 1, off: 0.3 + r() * 5, s: 0.7 + r() * 0.6, kind: r() < 0.75 ? "tree" : "bush" });
    }
    return { gates, obstacles, trees };
  }

  function mount(root, ctx) {
    const track = buildTrack(ctx.seed, ctx.level);
    const me = { d: 0, lane: 1, x: 1, speed: 0, nitro: 0, slow: 0, spin: 0, hits: 0, good: 0, fin: false, time: 0 };
    const op = ctx.opponent ? { d: 0, x: 1, speed: 0, fin: false, time: 0, at: 0, seen: false } : null;
    let shake = 0, elapsed = 0, raf = 0, lastSend = 0, stopped = false, flash = null, ending = false;

    root.innerHTML = `
      <div class="rc">
        <canvas class="rc-canvas"></canvas>
        <div class="rc-hud">
          <div class="pill">⏱ <b class="rc-time">0.0</b>s</div>
          <div class="pill">🚦 <b class="rc-gates">0</b>/${GATES}</div>
          <div class="pill">💥 <b class="rc-hits">0</b></div>
          <div class="pill rc-speed"><b>0</b> km/soat</div>
        </div>
        <div class="rc-question" hidden></div>
        <div class="rc-progress"><span class="me"></span>${op ? '<span class="op"></span>' : ""}<i class="flag">🏁</i></div>
        <div class="rc-controls">
          <button class="rc-btn" data-dir="-1" aria-label="Chapga">◀</button>
          <button class="rc-btn" data-dir="1" aria-label="O‘ngga">▶</button>
        </div>
        <div class="rc-tip">← → tugmalari yoki ekranni chap/o‘ngga bosing. To‘g‘ri javob yozilgan darvozadan o‘ting!</div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const canvas = $(".rc-canvas");
    const g = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1, PPM = 18, roadW = 0, laneW = 0, cx = 0, carY = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      PPM = Math.max(11, Math.min(H / 58, (W * 0.86) / (3 * LANE_M)));
      laneW = LANE_M * PPM;
      roadW = laneW * 3;
      cx = W / 2;
      carY = H * 0.8;
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ---------- Boshqaruv ----------
    const steer = (dir) => {
      if (me.fin || stopped) return;
      me.lane = Math.max(0, Math.min(2, me.lane + dir));
    };
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { steer(-1); e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { steer(1); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    root.querySelectorAll(".rc-btn").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); steer(Number(b.dataset.dir)); }));
    let touchX = null;
    canvas.addEventListener("pointerdown", (e) => { touchX = e.clientX; });
    canvas.addEventListener("pointerup", (e) => {
      if (touchX === null) return;
      const dx = e.clientX - touchX;
      if (Math.abs(dx) > 30) steer(dx > 0 ? 1 : -1);
      else steer(e.clientX - canvas.getBoundingClientRect().left < W / 2 ? -1 : 1);
      touchX = null;
    });

    ctx.onMsg((s) => {
      if (!op) return;
      if (!op.seen && s.d > 0) op.seen = true;
      Object.assign(op, s, { at: performance.now() });
      if (s.fin && !op.announced) {
        op.announced = true;
        if (!me.fin) ctx.toast(`🏁 ${ctx.opponent.name} marraga yetdi!`);
      }
    });

    // ---------- Fizika ----------
    function laneOf(x) { return Math.round(x); }

    function update(dt) {
      if (!me.fin) {
        elapsed += dt;
        let target = CRUISE;
        if (me.nitro > 0) { target = NITRO; me.nitro -= dt; }
        if (me.slow > 0) { target = 9; me.slow -= dt; }
        const acc = target > me.speed ? (me.nitro > 0 ? 16 : 6) : 24;
        me.speed += Math.sign(target - me.speed) * Math.min(Math.abs(target - me.speed), acc * dt);
        me.d += me.speed * dt;
      } else {
        me.speed = Math.max(0, me.speed - 14 * dt);
        me.d += me.speed * dt;
      }
      me.x += (me.lane - me.x) * Math.min(1, dt * 11);
      if (me.spin > 0) me.spin -= dt;
      if (shake > 0) shake -= dt;

      if (!me.fin) {
        for (const o of track.obstacles) {
          if (o.hit || Math.abs(o.d - me.d) > 2.6) continue;
          if (Math.abs(me.x - o.lane) < 0.62) {
            o.hit = true;
            me.hits++;
            me.slow = o.kind === "oil" ? 1.1 : 0.8;
            me.speed = Math.min(me.speed, o.kind === "barrier" ? 4 : 9);
            if (o.kind === "oil") me.spin = 0.9;
            shake = 0.35;
            ctx.sfx.bad();
            if (navigator.vibrate) navigator.vibrate(80);
          }
        }
        for (const gt of track.gates) {
          if (gt.done || me.d < gt.d) continue;
          gt.done = true;
          gt.picked = laneOf(me.x);
          const ok = gt.lanes[gt.picked] === gt.q.a;
          if (ok) { me.good++; me.nitro = 2.6; ctx.sfx.good(); flash = { text: "🔥 NITRO!", good: true, t: 1.1 }; }
          else { me.slow = 1.4; me.speed = Math.min(me.speed, 10); ctx.sfx.bad(); flash = { text: `❌ Javob: ${gt.q.a}`, good: false, t: 1.6 }; }
        }
        if (me.d >= LENGTH) {
          me.fin = true;
          me.time = elapsed;
          ctx.sfx.star();
          sendState(true);
          end();
        }
      }
      if (flash) { flash.t -= dt; if (flash.t <= 0) flash = null; }
    }

    function sendState(force) {
      const now = performance.now();
      if (!op || (!force && now - lastSend < SEND_MS)) return;
      lastSend = now;
      ctx.send({ d: +me.d.toFixed(2), x: +me.x.toFixed(2), speed: +me.speed.toFixed(1), fin: me.fin, time: me.time });
    }

    // ---------- Chizish ----------
    const ySc = (d) => carY - (d - me.d) * PPM;
    const xLane = (lane) => cx + (lane - 1) * laneW;

    function drawScene() {
      // O't
      const grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#1f7a45");
      grad.addColorStop(1, "#2f9a57");
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
      const stripe = 8;
      const startD = Math.floor((me.d - (H - carY) / PPM) / stripe) * stripe;
      for (let d = startD; d < me.d + carY / PPM + stripe; d += stripe) {
        if (Math.floor(d / stripe) % 2) continue;
        const y = ySc(d + stripe);
        g.fillStyle = "rgba(255,255,255,.04)";
        g.fillRect(0, y, W, stripe * PPM);
      }
      // Yo'l
      const left = cx - roadW / 2;
      g.fillStyle = "#3a4048";
      g.fillRect(left - 10, 0, roadW + 20, H);
      g.fillStyle = "#2c3138";
      g.fillRect(left, 0, roadW, H);
      // Bordyur
      const seg = 3;
      const s0 = Math.floor((me.d - (H - carY) / PPM) / seg) * seg;
      for (let d = s0; d < me.d + carY / PPM + seg; d += seg) {
        const y = ySc(d + seg);
        g.fillStyle = Math.floor(d / seg) % 2 ? "#e53e3e" : "#f7f7f7";
        g.fillRect(left - 10, y, 10, seg * PPM + 1);
        g.fillRect(left + roadW, y, 10, seg * PPM + 1);
      }
      // Qator chiziqlari
      g.fillStyle = "rgba(255,255,255,.75)";
      const dash = 6;
      const d0 = Math.floor((me.d - (H - carY) / PPM) / dash) * dash;
      for (let d = d0; d < me.d + carY / PPM + dash; d += dash) {
        const y = ySc(d + dash * 0.55);
        for (const k of [1, 2]) g.fillRect(left + laneW * k - 2, y, 4, dash * 0.55 * PPM);
      }
      // Start va marra
      for (const [d, label] of [[0, "START"], [LENGTH, "MARRA"]]) {
        const y = ySc(d);
        if (y < -40 || y > H + 40) continue;
        const sq = laneW / 6;
        for (let i = 0; i < 18; i++) for (let j = 0; j < 2; j++) {
          g.fillStyle = (i + j) % 2 ? "#111" : "#fff";
          g.fillRect(left + i * sq, y - (j + 1) * sq, sq, sq);
        }
        g.fillStyle = "#fff";
        g.font = `800 ${Math.round(laneW * 0.22)}px Inter, system-ui, sans-serif`;
        g.textAlign = "center";
        g.fillText(label, cx, y - sq * 2 - 8);
      }
      // Daraxtlar
      for (const t of track.trees) {
        const y = ySc(t.d);
        if (y < -60 || y > H + 60) continue;
        const x = t.side < 0 ? left - 18 - t.off * laneW * 0.5 : left + roadW + 18 + t.off * laneW * 0.5;
        if (x < -40 || x > W + 40) continue;
        const r = laneW * 0.28 * t.s;
        g.fillStyle = "rgba(0,0,0,.22)";
        g.beginPath(); g.ellipse(x + r * 0.3, y + r * 0.35, r, r * 0.7, 0, 0, Math.PI * 2); g.fill();
        if (t.kind === "tree") {
          g.fillStyle = "#14522c"; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#1f7a3d"; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.25, r * 0.7, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#3fae5c"; g.beginPath(); g.arc(x - r * 0.4, y - r * 0.4, r * 0.32, 0, Math.PI * 2); g.fill();
        } else {
          g.fillStyle = "#2e8b46"; g.beginPath(); g.arc(x, y, r * 0.6, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#ff8fb1"; g.beginPath(); g.arc(x + r * 0.2, y - r * 0.2, r * 0.12, 0, Math.PI * 2); g.fill();
        }
      }
    }

    function drawObstacle(o) {
      const y = ySc(o.d);
      if (y < -40 || y > H + 40) return;
      const x = xLane(o.lane);
      const s = laneW;
      g.save();
      g.translate(x, y);
      if (o.hit) g.globalAlpha = 0.35;
      if (o.kind === "cone") {
        g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(3, 4, s * 0.18, s * 0.08, 0, 0, 7); g.fill();
        g.fillStyle = "#ff7a1a"; g.beginPath(); g.moveTo(0, -s * 0.24); g.lineTo(s * 0.14, s * 0.06); g.lineTo(-s * 0.14, s * 0.06); g.closePath(); g.fill();
        g.fillStyle = "#fff"; g.fillRect(-s * 0.08, -s * 0.08, s * 0.16, s * 0.05);
        g.fillStyle = "#c95510"; g.fillRect(-s * 0.18, s * 0.04, s * 0.36, s * 0.05);
      } else if (o.kind === "oil") {
        g.fillStyle = "#111"; g.beginPath(); g.ellipse(0, 0, s * 0.3, s * 0.16, 0.3, 0, 7); g.fill();
        g.fillStyle = "rgba(120,160,255,.35)"; g.beginPath(); g.ellipse(-s * 0.08, -s * 0.04, s * 0.1, s * 0.04, 0.3, 0, 7); g.fill();
      } else {
        g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-s * 0.36 + 4, -s * 0.08 + 5, s * 0.72, s * 0.18);
        const n = 6;
        for (let i = 0; i < n; i++) {
          g.fillStyle = i % 2 ? "#fff" : "#e53e3e";
          g.fillRect(-s * 0.36 + (i * s * 0.72) / n, -s * 0.08, (s * 0.72) / n + 0.5, s * 0.16);
        }
      }
      g.restore();
    }

    function drawGate(gt) {
      const y = ySc(gt.d);
      if (y < -80 || y > H + 40) return;
      const left = cx - roadW / 2;
      g.fillStyle = "#e9eef5";
      g.fillRect(left - 6, y - 4, 6, 10);
      g.fillRect(left + roadW, y - 4, 6, 10);
      for (let i = 0; i < 3; i++) {
        const x = left + i * laneW;
        let fill = "rgba(46,120,255,.92)";
        if (gt.done) {
          if (gt.lanes[i] === gt.q.a) fill = "rgba(34,197,94,.95)";
          else if (gt.picked === i) fill = "rgba(239,68,68,.95)";
          else fill = "rgba(100,116,139,.7)";
        }
        g.fillStyle = fill;
        roundRect(x + 4, y - laneW * 0.42, laneW - 8, laneW * 0.4, 8);
        g.fill();
        g.fillStyle = "#fff";
        let fs = Math.round(laneW * 0.2);
        g.font = `800 ${fs}px Inter, system-ui, sans-serif`;
        while (g.measureText(gt.lanes[i]).width > laneW - 16 && fs > 9) g.font = `800 ${--fs}px Inter, system-ui, sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(gt.lanes[i], x + laneW / 2, y - laneW * 0.22);
        g.textBaseline = "alphabetic";
      }
    }

    function roundRect(x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
    }

    function drawCar(x, y, colors, name, opts = {}) {
      const w = laneW * 0.5, h = laneW * 0.95;
      g.save();
      g.translate(x, y);
      if (opts.spin) g.rotate(Math.sin(opts.spin * 18) * 0.35);
      if (opts.ghost) g.globalAlpha = 0.9;
      // soya
      g.fillStyle = "rgba(0,0,0,.35)";
      g.beginPath(); g.ellipse(4, 6, w * 0.62, h * 0.55, 0, 0, 7); g.fill();
      // nitro olovi
      if (opts.nitro) {
        const fl = h * (0.25 + Math.random() * 0.2);
        const fg = g.createLinearGradient(0, h / 2, 0, h / 2 + fl);
        fg.addColorStop(0, "#fff6a0"); fg.addColorStop(0.4, "#ff9d1a"); fg.addColorStop(1, "rgba(255,60,0,0)");
        g.fillStyle = fg;
        for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * w * 0.22, h / 2 + fl / 2, w * 0.1, fl / 2, 0, 0, 7); g.fill(); }
      }
      // g'ildiraklar
      g.fillStyle = "#0b0b0d";
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        roundRect(sx * w / 2 - (sx > 0 ? 2 : w * 0.16 - 2), sy * h * 0.3 - h * 0.11, w * 0.16, h * 0.22, 3);
        g.fill();
      }
      // kuzov
      const body = g.createLinearGradient(-w / 2, 0, w / 2, 0);
      body.addColorStop(0, colors[1]); body.addColorStop(0.5, colors[0]); body.addColorStop(1, colors[1]);
      g.fillStyle = body;
      roundRect(-w / 2, -h / 2, w, h, w * 0.32); g.fill();
      // old/orqa oyna
      g.fillStyle = "rgba(12,20,35,.85)";
      roundRect(-w * 0.36, -h * 0.24, w * 0.72, h * 0.2, 5); g.fill();
      roundRect(-w * 0.34, h * 0.16, w * 0.68, h * 0.13, 4); g.fill();
      // tom
      g.fillStyle = colors[0];
      roundRect(-w * 0.34, -h * 0.03, w * 0.68, h * 0.18, 4); g.fill();
      // poyga chizig'i
      g.fillStyle = "rgba(255,255,255,.85)";
      g.fillRect(-w * 0.07, -h / 2 + 3, w * 0.14, h * 0.2);
      g.fillRect(-w * 0.07, h * 0.3, w * 0.14, h * 0.18);
      // faralar
      g.fillStyle = "#fff8c2";
      g.beginPath(); g.ellipse(-w * 0.3, -h / 2 + 4, w * 0.1, 3, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(w * 0.3, -h / 2 + 4, w * 0.1, 3, 0, 0, 7); g.fill();
      g.fillStyle = "#ff3b3b";
      g.fillRect(-w * 0.42, h / 2 - 4, w * 0.18, 3);
      g.fillRect(w * 0.24, h / 2 - 4, w * 0.18, 3);
      // tomdagi bosh harf
      g.fillStyle = "#fff";
      g.font = `900 ${Math.round(w * 0.32)}px Inter, system-ui, sans-serif`;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(name.split(" ").map((p) => p[0]).join("").slice(0, 2), 0, h * 0.065);
      g.textBaseline = "alphabetic";
      g.restore();
      // ism yorlig'i
      const label = name.split(" ")[1] || name;
      g.font = `800 ${Math.max(11, Math.round(laneW * 0.17))}px Inter, system-ui, sans-serif`;
      const tw = g.measureText(label).width + 16;
      const ly = y - h / 2 - 22;
      g.fillStyle = opts.me ? "rgba(16,185,129,.95)" : "rgba(244,63,94,.95)";
      roundRect(x - tw / 2, ly - 12, tw, 22, 11); g.fill();
      g.beginPath(); g.moveTo(x - 5, ly + 10); g.lineTo(x + 5, ly + 10); g.lineTo(x, ly + 16); g.fill();
      g.fillStyle = "#fff";
      g.textAlign = "center";
      g.fillText(label, x, ly + 4);
    }

    function render() {
      g.save();
      if (shake > 0) g.translate((Math.random() - 0.5) * 10 * shake * 3, (Math.random() - 0.5) * 10 * shake * 3);
      drawScene();
      track.obstacles.forEach(drawObstacle);
      track.gates.forEach(drawGate);

      if (op && op.seen) {
        const since = (performance.now() - op.at) / 1000;
        const od = op.fin ? Math.min(op.d + op.speed * since, LENGTH + 30) : op.d + op.speed * Math.min(since, 0.5);
        const y = ySc(od);
        if (y > -60 && y < H + 60) {
          drawCar(cx + (op.x - 1) * laneW, y, ["#f43f5e", "#9f1239"], ctx.opponent.name, {});
        } else {
          const ahead = y < 0;
          const label = `${ahead ? "▲" : "▼"} ${ctx.opponent.name.split(" ")[1] || ctx.opponent.name} ${ahead ? "+" : "−"}${Math.round(Math.abs(od - me.d))} m`;
          g.font = "800 13px Inter, system-ui, sans-serif";
          const tw = g.measureText(label).width + 20;
          const yy = ahead ? 70 : H - 120;
          g.fillStyle = "rgba(244,63,94,.92)";
          roundRect(cx - tw / 2, yy - 15, tw, 26, 13); g.fill();
          g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText(label, cx, yy + 3);
        }
      }
      drawCar(cx + (me.x - 1) * laneW, carY, ["#10b981", "#047857"], ctx.me.name, { me: true, nitro: me.nitro > 0, spin: me.spin > 0 ? me.spin : 0 });

      if (me.nitro > 0) {
        g.strokeStyle = "rgba(255,255,255,.18)";
        g.lineWidth = 2;
        for (let i = 0; i < 14; i++) {
          const x = Math.random() * W, y = Math.random() * H;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 40 + Math.random() * 40); g.stroke();
        }
      }
      if (flash) {
        g.globalAlpha = Math.min(1, flash.t * 2);
        g.font = "900 26px Inter, system-ui, sans-serif";
        g.textAlign = "center";
        g.lineWidth = 6;
        g.strokeStyle = "rgba(0,0,0,.5)";
        g.strokeText(flash.text, cx, H * 0.42);
        g.fillStyle = flash.good ? "#fde047" : "#fecaca";
        g.fillText(flash.text, cx, H * 0.42);
        g.globalAlpha = 1;
      }
      g.restore();
    }

    function hud() {
      $(".rc-time").textContent = (me.fin ? me.time : elapsed).toFixed(1);
      $(".rc-gates").textContent = me.good;
      $(".rc-hits").textContent = me.hits;
      $(".rc-speed b").textContent = Math.round(me.speed * 3.6);
      $(".rc-speed").classList.toggle("boost", me.nitro > 0);
      const p = Math.min(1, me.d / LENGTH);
      $(".rc-progress .me").style.bottom = p * 100 + "%";
      if (op) $(".rc-progress .op").style.bottom = Math.min(1, op.d / LENGTH) * 100 + "%";
      const next = track.gates.find((gt) => !gt.done);
      const qEl = $(".rc-question");
      if (next && next.d - me.d < 95 && !me.fin) {
        if (qEl.dataset.d !== String(next.d)) {
          qEl.dataset.d = next.d;
          qEl.innerHTML = `<span class="tag">${esc(next.q.subject)}</span><b>${esc(next.q.q)}</b><small>To‘g‘ri javob yozilgan darvozadan o‘ting</small>`;
          ctx.sfx.tick();
        }
        qEl.hidden = false;
        qEl.classList.toggle("near", next.d - me.d < 30);
      } else {
        qEl.hidden = true;
      }
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!stopped) {
        update(dt);
        sendState(false);
      }
      render();
      hud();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    setTimeout(() => { const t = $(".rc-tip"); if (t) t.classList.add("hide"); }, 4500);

    async function end() {
      if (ending) return;
      ending = true;
      const rows = [["Vaqt", me.time.toFixed(1) + " s"], ["To‘g‘ri darvozalar", `${me.good} / ${GATES}`], ["To‘qnashuvlar", me.hits]];
      if (!op) {
        const earn = me.good >= GATES - 1 && me.hits <= 2;
        setTimeout(() => ctx.finish({
          title: earn ? "Chempion poyga! 🏁" : "Marraga yetdingiz!",
          rows,
          earnStar: earn,
          starHint: earn ? "" : `Yulduz uchun kamida ${GATES - 1} ta to‘g‘ri darvoza va ko‘pi bilan 2 ta to‘qnashuv kerak.`
        }), 1200);
        return;
      }
      const opRes = await ctx.exchangeFinal({ time: me.time, good: me.good });
      if (!opRes) {
        ctx.finish({
          title: "Marraga yetdingiz!",
          text: `${ctx.opponent.name} poygani tugatmadi.`,
          rows,
          earnStar: me.good >= GATES - 1 && me.hits <= 2,
          starHint: `Yulduz uchun kamida ${GATES - 1} ta to‘g‘ri darvoza va ko‘pi bilan 2 ta to‘qnashuv kerak.`
        });
        return;
      }
      const won = me.time < opRes.time;
      ctx.finish({
        title: won ? "Siz birinchi keldingiz! 🏆" : `${ctx.opponent.name} birinchi keldi`,
        won,
        rows: [
          [ctx.me.name, `${me.time.toFixed(1)} s · ${me.good}/${GATES}`],
          [ctx.opponent.name, `${opRes.time.toFixed(1)} s · ${opRes.good}/${GATES}`]
        ],
        earnStar: won && me.good >= GATES - 2,
        starHint: won ? `Yulduz uchun g‘alaba va kamida ${GATES - 2} ta to‘g‘ri darvoza kerak.` : "Yulduzni faqat g‘olib oladi."
      });
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }

  window.SofiGames.register({
    id: "poyga",
    title: "Bilimlar poygasi",
    icon: "🏎️",
    mount
  });
})();
