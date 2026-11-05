/* SNAYPER — o'yin mexanikasi: harakat va fizika, durbinli miltiq, o'q (nur) hisoblash,
   botlar, raundlar, tarmoq sinxronlash, HUD, tovushlar.
   create(container, { me, roster, host, send, onExit }) */
(() => {
  "use strict";
  const T = window.THREE;
  const W = window.SofiSniperWorld;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const short = (n) => { const p = String(n || "").split(" "); return p[1] || p[0] || ""; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rr = (a, b) => a + Math.random() * (b - a);
  const now = () => performance.now();

  const CFG = {
    WIN: 3, ROUND_MS: 150000, FREEZE_MS: 3500, BREAK_MS: 5500,
    HP: 100, DMG: { head: 100, body: 70, legs: 45 },
    MAG: 5, RESERVE: 25, BOLT: 1.15, RELOAD: 2.5,
    SPEED: 4.6, SPRINT: 6.4, CROUCH: 2.2, SCOPED: 2.2,
    H: 1.78, HC: 1.25, EYE: 1.6, EYEC: 1.1, R: 0.32,
    FOV: 72, ZOOM: [72, 20, 9], NET_MS: 100,
  };
  const TEAMNAME = { r: "Qizil", b: "Ko‘k" };
  const BOTNAMES = ["Temirbek", "Chaqmoq", "Burgut", "Lochin", "Qoplon", "Shamol", "Bo‘ron", "Yashin", "Tulpor", "Sherdil", "Olmos", "Po‘lat"];

  /* =================== Tovushlar (Web Audio) =================== */
  const Snd = (() => {
    let ac = null, master = null, noiseBuf = null, on = true, wind = null;
    const init = () => {
      if (ac) { if (ac.state === "suspended") ac.resume(); return; }
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        master = ac.createGain(); master.gain.value = 0.8; master.connect(ac.destination);
        noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
        const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      } catch (e) { ac = null; }
    };
    const noise = (t, dur, f0, f1, vol, type = "lowpass", q = 0.7, dest) => {
      const s = ac.createBufferSource(); s.buffer = noiseBuf;
      const f = ac.createBiquadFilter(); f.type = type; f.Q.value = q;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(dest || master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
    };
    const tone = (t, dur, f0, f1, vol, type = "sine", dest) => {
      const o = ac.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + 0.05);
    };
    const ok = () => on && ac && ac.state === "running";
    return {
      init, get on() { return on; },
      set(v) { on = v; if (master) master.gain.value = v ? 0.8 : 0; },
      shot(dist = 0) {
        if (!ok()) return;
        const delay = dist / 340, k = dist > 0 ? clamp(1 - dist / 140, 0.08, 1) : 1;
        const t = ac.currentTime + delay;
        noise(t, 0.5, dist > 0 ? 1800 : 6000, 200, 0.9 * k, "lowpass", 0.5);
        tone(t, 0.25, 110, 38, 0.8 * k, "sine");
        tone(t, 0.18, 1600, 260, 0.07 * k, "square"); // lazer jarangi
        if (dist > 20) noise(t + 0.12, 0.9, 900, 120, 0.18 * k, "lowpass"); // aks-sado
      },
      bolt() { if (!ok()) return; const t = ac.currentTime; [0.22, 0.42, 0.68, 0.86].forEach((d, i) => noise(t + d, 0.05, i % 2 ? 2600 : 4200, 1400, 0.22, "bandpass", 3)); },
      reload() { if (!ok()) return; const t = ac.currentTime; [0.3, 0.9, 1.6, 2.1].forEach((d) => noise(t + d, 0.06, 3200, 1200, 0.25, "bandpass", 2.5)); },
      empty() { if (!ok()) return; noise(ac.currentTime, 0.04, 3500, 2000, 0.2, "bandpass", 4); },
      hit(head) { if (!ok()) return; const t = ac.currentTime; tone(t, 0.08, head ? 2400 : 1700, head ? 2300 : 1600, 0.25, "triangle"); if (head) tone(t + 0.07, 0.25, 3100, 3000, 0.18, "sine"); },
      hurt() { if (!ok()) return; const t = ac.currentTime; tone(t, 0.25, 180, 60, 0.5, "sawtooth"); noise(t, 0.3, 3000, 400, 0.25, "bandpass", 1); },
      down(dist = 0) { if (!ok()) return; const k = clamp(1 - dist / 90, 0.1, 1), t = ac.currentTime; tone(t, 0.9, 700, 40, 0.25 * k, "sawtooth"); noise(t, 0.6, 5000, 800, 0.15 * k, "highpass", 1); },
      step(k = 1) { if (!ok()) return; noise(ac.currentTime, 0.09, 420, 140, 0.12 * k, "lowpass", 1); },
      horn() { if (!ok()) return; const t = ac.currentTime; tone(t, 0.35, 440, 440, 0.22, "sawtooth"); tone(t + 0.38, 0.6, 660, 660, 0.22, "sawtooth"); },
      win() { if (!ok()) return; const t = ac.currentTime; [523, 659, 784, 1046].forEach((f, i) => tone(t + i * 0.12, 0.35, f, f, 0.2, "triangle")); },
      lose() { if (!ok()) return; const t = ac.currentTime; [392, 330, 262].forEach((f, i) => tone(t + i * 0.18, 0.4, f, f * 0.98, 0.2, "triangle")); },
      tick() { if (!ok()) return; tone(ac.currentTime, 0.06, 1000, 1000, 0.12, "square"); },
      zoom() { if (!ok()) return; noise(ac.currentTime, 0.07, 5000, 2500, 0.08, "bandpass", 2); },
      ambience(start) {
        if (!ac) return;
        if (!start) { if (wind) { try { wind.s.stop(); } catch (e) {} wind = null; } return; }
        if (wind) return;
        const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
        const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380;
        const g = ac.createGain(); g.gain.value = 0.06;
        const lfo = ac.createOscillator(); lfo.frequency.value = 0.12; const lg = ac.createGain(); lg.gain.value = 0.035; lfo.connect(lg); lg.connect(g.gain); lfo.start();
        s.connect(f); f.connect(g); g.connect(master); s.start();
        wind = { s };
      },
      bird() { if (!ok()) return; const t = ac.currentTime, b = rr(2400, 3600); for (let i = 0; i < 3; i++) tone(t + i * 0.13, 0.09, b, b * 1.3, 0.035, "sine"); },
    };
  })();

  /* =================== Geometrik yordamchilar =================== */
  function raySphere(o, d, c, r) {
    const ox = o[0] - c[0], oy = o[1] - c[1], oz = o[2] - c[2];
    const b = ox * d[0] + oy * d[1] + oz * d[2], cc = ox * ox + oy * oy + oz * oz - r * r;
    const h = b * b - cc; if (h < 0) return -1;
    const t = -b - Math.sqrt(h); return t >= 0 ? t : -1;
  }
  function rayCyl(o, d, cx, cz, y0, y1, r) {
    const ox = o[0] - cx, oz = o[2] - cz;
    const a = d[0] * d[0] + d[2] * d[2]; if (a < 1e-9) return -1;
    const b = ox * d[0] + oz * d[2], c = ox * ox + oz * oz - r * r;
    const h = b * b - a * c; if (h < 0) return -1;
    const t = (-b - Math.sqrt(h)) / a; if (t < 0) return -1;
    const y = o[1] + d[1] * t; return y >= y0 && y <= y1 ? t : -1;
  }

  /* =================== O'yin =================== */
  async function load() { await W.loadRobot(); }

  function create(container, opts) {
    const MOBILE = W.MOBILE;
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    const renderer = new T.WebGLRenderer({ antialias: !MOBILE, powerPreference: "high-performance" });
    renderer.setPixelRatio(W.LOW ? 0.5 : Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = !W.LOW;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    renderer.domElement.className = "sn-canvas";

    const world = W.build(renderer);
    const scene = world.scene;
    const camera = new T.PerspectiveCamera(CFG.FOV, 1, 0.05, 900);
    scene.add(camera);

    // Ko'rinuvchi miltiq (alohida sahna)
    const vmScene = new T.Scene();
    vmScene.environment = scene.environment;
    vmScene.add(new T.HemisphereLight(0xdfefff, 0x4a5a3a, 0.9));
    const vmSun = new T.DirectionalLight(0xfff1dc, 1.6); vmSun.position.set(1, 2, 1); vmScene.add(vmSun);
    const vmCam = new T.PerspectiveCamera(55, 1, 0.01, 10);
    const me0 = opts.me;
    const vm = W.makeRifle(me0.team, false);
    const vmHold = new T.Group(); vmHold.add(vm); vmScene.add(vmHold);
    vm.rotation.y = 0.02;
    const flashTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,230,1)"); gr.addColorStop(0.3, "rgba(255,200,90,.8)"); gr.addColorStop(1, "rgba(255,120,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    const vmFlash = new T.Sprite(new T.SpriteMaterial({ map: flashTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
    vmFlash.position.copy(vm.userData.muzzle); vmFlash.scale.setScalar(0.35); vmFlash.visible = false; vm.add(vmFlash);
    const camFlash = new T.PointLight(0xffc070, 0, 12); camera.add(camFlash); camFlash.position.set(0.2, -0.1, -1);

    /* ---------- O'yinchilar ---------- */
    const P = new Map();
    const myId = me0.id;
    let isHost = !!opts.host;
    const send = (m) => { try { opts.send && opts.send(m); } catch (e) {} };

    function addPlayer(r) {
      if (P.has(r.id)) { const p = P.get(r.id); p.name = r.name; return p; }
      const av = W.makeAvatar(r.team);
      scene.add(av.obj);
      const p = {
        id: r.id, name: r.name, team: r.team, bot: !!r.bot, cls: r.cls || "",
        hp: CFG.HP, alive: false, kills: 0, deaths: 0, head: 0,
        pos: new T.Vector3(0, -50, 0), vel: new T.Vector3(), yaw: 0, pitch: 0, crouch: false, onGround: true, f: 0,
        av, buf: [], brain: null, ammo: CFG.MAG, reserve: CFG.RESERVE, boltT: 0, reloadT: 0, stepT: 0,
      };
      av.obj.visible = false;
      if (r.id !== myId) {
        const tag = nameTag(r.name, r.team, r.bot);
        tag.position.y = 2.15; av.obj.add(tag); p.tag = tag;
      }
      P.set(r.id, p);
      return p;
    }
    function nameTag(name, team, bot) {
      const c = document.createElement("canvas"); c.width = 256; c.height = 64;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(0,0,0,.55)"; g.beginPath(); g.roundRect ? g.roundRect(4, 8, 248, 48, 20) : g.rect(4, 8, 248, 48); g.fill();
      g.fillStyle = W.TEAM[team].css; g.beginPath(); g.arc(30, 32, 10, 0, 6.283); g.fill();
      g.fillStyle = "#fff"; g.font = "800 26px system-ui"; g.textBaseline = "middle"; g.fillText((bot ? "🤖 " : "") + short(name), 48, 33);
      const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding;
      const sp = new T.Sprite(new T.SpriteMaterial({ map: t, depthTest: true, transparent: true }));
      sp.scale.set(1.3, 0.33, 1);
      return sp;
    }
    function removePlayer(id) {
      const p = P.get(id); if (!p) return;
      scene.remove(p.av.obj); P.delete(id);
    }
    (opts.roster || []).forEach(addPlayer);
    const me = P.get(myId) || addPlayer(me0);

    /* ---------- Holat ---------- */
    const G = { round: 0, sc: { r: 0, b: 0 }, phase: "wait", freezeUntil: 0, endAt: 0, nextAt: 0, over: false };
    const L = { // mahalliy boshqaruv
      keys: new Set(), mx: 0, my: 0, scoped: false, zoom: 1, breath: 1, holding: false, fireQ: false, jumpQ: false,
      joy: { x: 0, y: 0, id: null }, look: { id: null, x: 0, y: 0 }, crouchT: false, sens: 1, spect: null, kick: 0, sway: 0,
    };
    try { L.sens = Number(localStorage.getItem("sofi_sn_sens")) || 1; } catch (e) {}

    /* ---------- HUD ---------- */
    const hud = document.createElement("div");
    hud.className = "sn-hud";
    hud.innerHTML = `
      <div class="sn-top"><div class="sn-tm r"><b data-sr>0</b><span>QIZIL</span><i data-ar></i></div>
        <div class="sn-clock"><b data-clock>0:00</b><small data-rn>Tayyorlanmoqda</small></div>
        <div class="sn-tm b"><i data-ab></i><span>KO‘K</span><b data-sb>0</b></div></div>
      <div class="sn-feed"></div>
      <div class="sn-cross"><i></i><i></i><i></i><i></i></div>
      <div class="sn-hitm"></div>
      <div class="sn-scope" hidden><div class="sn-lens"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="99" fill="none" stroke="#000" stroke-width="2"/>
        <line x1="0" y1="100" x2="88" y2="100"/><line x1="112" y1="100" x2="200" y2="100"/><line x1="100" y1="0" x2="100" y2="88"/><line x1="100" y1="112" x2="100" y2="200"/>
        <line class="t" x1="88" y1="100" x2="112" y2="100"/><line class="t" x1="100" y1="88" x2="100" y2="112"/>
        ${[1, 2, 3, 4].map((k) => `<line class="t" x1="${100 + k * 8}" y1="98" x2="${100 + k * 8}" y2="102"/><line class="t" x1="${100 - k * 8}" y1="98" x2="${100 - k * 8}" y2="102"/><line class="t" x1="98" y1="${100 + k * 8}" x2="102" y2="${100 + k * 8}"/>`).join("")}
        <circle cx="100" cy="100" r="1.4" fill="#ff3b30"/></svg></div><span class="sn-zoom" data-zoom>4×</span><span class="sn-breath"><i data-breath></i></span></div>
      <div class="sn-dmg"></div>
      <div class="sn-bottom"><div class="sn-hp"><span>⚡</span><div><i data-hp></i></div><b data-hpn>100</b></div>
        <div class="sn-ammo"><b data-am>5</b><small>/ <span data-rs>25</span></small><em data-amst></em></div></div>
      <div class="sn-center" data-center></div>
      <div class="sn-dead" data-dead hidden></div>
      <div class="sn-board" data-board hidden></div>
      <div class="sn-menu" data-menu hidden></div>
      <div class="sn-start" data-sst hidden></div>
      ${MOBILE ? `<div class="sn-touch"><div class="sn-joy" data-joy><i></i></div>
        <button class="sn-b fire" data-b="fire">🎯</button><button class="sn-b scope" data-b="scope">🔭</button>
        <button class="sn-b jump" data-b="jump">⤒</button><button class="sn-b crouch" data-b="crouch">⇩</button>
        <button class="sn-b reload" data-b="reload">↻</button><button class="sn-b zoomb" data-b="zoom">±</button></div>` : ""}
      <button class="sn-pause" data-b="menu" type="button">☰</button>
      <button class="sn-tab" data-b="board" type="button">📋</button>`;
    container.appendChild(hud);
    const $ = (s) => hud.querySelector(s);
    const ui = {
      sr: $("[data-sr]"), sb: $("[data-sb]"), ar: $("[data-ar]"), ab: $("[data-ab]"), clock: $("[data-clock]"), rn: $("[data-rn]"),
      feed: $(".sn-feed"), cross: $(".sn-cross"), hitm: $(".sn-hitm"), scope: $(".sn-scope"), zoom: $("[data-zoom]"), breath: $("[data-breath]"),
      dmg: $(".sn-dmg"), hp: $("[data-hp]"), hpn: $("[data-hpn]"), am: $("[data-am]"), rs: $("[data-rs]"), amst: $("[data-amst]"),
      center: $("[data-center]"), dead: $("[data-dead]"), board: $("[data-board]"), menu: $("[data-menu]"), start: $("[data-sst]"),
    };
    let centerT = 0;
    function banner(html, ms = 2200, cls = "") { ui.center.innerHTML = `<div class="sn-ban ${cls}">${html}</div>`; centerT = now() + ms; }
    function feed(killer, victim, part) {
      const el = document.createElement("div");
      const k = P.get(killer), v = P.get(victim);
      el.className = "sn-kf" + (killer === myId || victim === myId ? " me" : "");
      el.innerHTML = `<b class="${k ? k.team : ""}">${esc(short(k ? k.name : "?"))}</b><span>${part === "head" ? "🎯" : "⚡"}</span><b class="${v ? v.team : ""}">${esc(short(v ? v.name : "?"))}</b>`;
      ui.feed.prepend(el);
      setTimeout(() => el.classList.add("out"), 5000); setTimeout(() => el.remove(), 5600);
      while (ui.feed.children.length > 6) ui.feed.lastChild.remove();
    }
    function hitMarker(head) { ui.hitm.className = "sn-hitm on" + (head ? " head" : ""); void ui.hitm.offsetWidth; setTimeout(() => (ui.hitm.className = "sn-hitm"), 260); }
    function hurtFlash(fromPos) {
      ui.dmg.classList.remove("on"); void ui.dmg.offsetWidth; ui.dmg.classList.add("on");
      if (fromPos) {
        const a = Math.atan2(fromPos.x - me.pos.x, fromPos.z - me.pos.z);
        const rel = -(a - (me.yaw + Math.PI));
        const ind = document.createElement("i"); ind.className = "sn-dir"; ind.style.transform = `rotate(${rel}rad)`;
        hud.appendChild(ind); setTimeout(() => ind.remove(), 1100);
      }
    }
    function renderBoard() {
      const rows = (team) => [...P.values()].filter((p) => p.team === team).sort((a, b) => b.kills - a.kills || a.deaths - b.deaths)
        .map((p) => `<tr class="${p.id === myId ? "me" : ""} ${p.alive ? "" : "dead"}"><td>${p.bot ? "🤖 " : ""}${esc(p.name)}</td><td>${p.kills}</td><td>${p.deaths}</td><td>${p.head}</td></tr>`).join("");
      ui.board.innerHTML = `<div class="sn-bcard"><h3>📋 Hisob · ${G.round}-raund</h3><div class="sn-bcols">
        ${["r", "b"].map((t) => `<div class="sn-bt ${t}"><h4>${TEAMNAME[t]} · ${G.sc[t]}</h4><table><tr><th>O‘yinchi</th><th>⚡</th><th>✖</th><th>🎯</th></tr>${rows(t)}</table></div>`).join("")}
        </div><small>⚡ o‘chirdi · ✖ o‘chdi · 🎯 boshiga tekkan</small></div>`;
    }

    /* ---------- Effektlar ---------- */
    const fx = [];
    const tracerGeo = new T.CylinderGeometry(0.012, 0.012, 1, 6, 1, true); tracerGeo.translate(0, 0.5, 0); tracerGeo.rotateX(Math.PI / 2);
    const tracerMats = { r: new T.MeshBasicMaterial({ color: 0xff6a55, transparent: true, blending: T.AdditiveBlending, depthWrite: false }), b: new T.MeshBasicMaterial({ color: 0x66b3ff, transparent: true, blending: T.AdditiveBlending, depthWrite: false }) };
    const glowTex = flashTex;
    function tracer(a, b, team) {
      const len = a.distanceTo(b); if (len < 0.5) return;
      const m = new T.Mesh(tracerGeo, tracerMats[team].clone());
      m.position.copy(a); m.lookAt(b); m.scale.set(1, 1, len);
      scene.add(m);
      fx.push({ o: m, t: 0, life: 0.45, k: "tracer" });
    }
    const sparkGeo = new T.BufferGeometry();
    function burst(pos, color, n = 14, speed = 4, size = 0.08, life = 0.6, grav = 9) {
      const arr = new Float32Array(n * 3), vel = [];
      for (let i = 0; i < n; i++) { arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y; arr[i * 3 + 2] = pos.z; vel.push(new T.Vector3(rr(-1, 1), rr(0.2, 1.4), rr(-1, 1)).normalize().multiplyScalar(speed * rr(0.4, 1))); }
      const g = sparkGeo.clone(); g.setAttribute("position", new T.BufferAttribute(arr, 3));
      const pts = new T.Points(g, new T.PointsMaterial({ color, size, transparent: true, blending: T.AdditiveBlending, depthWrite: false, map: glowTex }));
      scene.add(pts);
      fx.push({ o: pts, t: 0, life, k: "burst", vel, grav });
    }
    function puff(pos, color = 0xb8a98a) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: 0.55, depthWrite: false }));
      sp.position.copy(pos); sp.scale.setScalar(0.3);
      scene.add(sp); fx.push({ o: sp, t: 0, life: 0.9, k: "puff" });
    }
    function flashAt(pos) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: flashTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
      sp.position.copy(pos); sp.scale.setScalar(0.9); scene.add(sp); fx.push({ o: sp, t: 0, life: 0.07, k: "flash" });
    }
    function updateFx(dt) {
      for (let i = fx.length - 1; i >= 0; i--) {
        const e = fx[i]; e.t += dt; const k = e.t / e.life;
        if (k >= 1) { scene.remove(e.o); if (e.o.material) e.o.material.dispose(); if (e.k === "burst") e.o.geometry.dispose(); fx.splice(i, 1); continue; }
        if (e.k === "tracer") e.o.material.opacity = (1 - k) * 0.95;
        else if (e.k === "burst") { const a = e.o.geometry.attributes.position; for (let j = 0; j < e.vel.length; j++) { e.vel[j].y -= e.grav * dt; a.array[j * 3] += e.vel[j].x * dt; a.array[j * 3 + 1] += e.vel[j].y * dt; a.array[j * 3 + 2] += e.vel[j].z * dt; } a.needsUpdate = true; e.o.material.opacity = 1 - k; }
        else if (e.k === "puff") { e.o.scale.setScalar(0.3 + k * 1.6); e.o.material.opacity = 0.55 * (1 - k); e.o.position.y += dt * 0.4; }
      }
    }

    /* ---------- Fizika ---------- */
    function physics(p, wx, wz, speed, jump, dt) {
      const acc = p.onGround ? 14 : 2.5;
      p.vel.x += (wx * speed - p.vel.x) * Math.min(1, acc * dt);
      p.vel.z += (wz * speed - p.vel.z) * Math.min(1, acc * dt);
      if (jump && p.onGround) { p.vel.y = 6.0; p.onGround = false; }
      p.vel.y -= 20 * dt;
      const h = p.crouch ? CFG.HC : CFG.H;
      const wasGround = p.onGround;
      p.pos.x += p.vel.x * dt; p.pos.z += p.vel.z * dt;
      world.pushOut(p.pos, CFG.R, h);
      const g = world.groundAt(p.pos.x, p.pos.z, p.pos.y);
      const prevY = p.pos.y;
      p.pos.y += p.vel.y * dt;
      if (p.vel.y > 0) { const c = world.ceilingAt(p.pos.x, p.pos.z, prevY, h); if (p.pos.y + h > c) { p.pos.y = c - h; p.vel.y = 0; } }
      if (p.pos.y <= g) { p.pos.y = g; p.vel.y = 0; p.onGround = true; }
      else if (wasGround && p.vel.y <= 0 && p.pos.y - g < 0.5) { p.pos.y = g; p.vel.y = 0; p.onGround = true; }
      else p.onGround = false;
      if (p.pos.y < -5) { p.pos.y = 0.5; p.vel.set(0, 0, 0); }
    }
    const eyeOf = (p) => new T.Vector3(p.pos.x, p.pos.y + (p.crouch ? CFG.EYEC : CFG.EYE), p.pos.z);
    const fwd = (yaw, pitch) => new T.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));

    /* ---------- O'q hisoblash ---------- */
    function trace(o, d, shooter) {
      const oa = [o.x, o.y, o.z], da = [d.x, d.y, d.z];
      let best = world.rayMap(oa, da, 400), hit = null, part = null;
      const sp = P.get(shooter);
      for (const p of P.values()) {
        if (!p.alive || p.id === shooter || (sp && p.team === sp.team)) continue;
        const q = rp(p), hs = p.crouch ? 0.72 : 1;
        const x = q.x, y = q.y, z = q.z;
        let t = raySphere(oa, da, [x, y + 1.5 * hs, z], 0.27);
        if (t > 0 && t < best) { best = t; hit = p.id; part = "head"; }
        t = rayCyl(oa, da, x, z, y + 0.6 * hs, y + 1.3 * hs, 0.31);
        if (t > 0 && t < best) { best = t; hit = p.id; part = "body"; }
        t = rayCyl(oa, da, x, z, y, y + 0.6 * hs, 0.24);
        if (t > 0 && t < best) { best = t; hit = p.id; part = "legs"; }
      }
      return { dist: best, hit, part };
    }
    const rp = (p) => p.av.obj.position; // ko'rinib turgan (interpolyatsiya qilingan) joy

    function muzzleWorld(p) {
      if (p.id === myId && !L.scoped) {
        const v = vm.userData.muzzle.clone(); vm.localToWorld(v); // vmScene koordinatasi → kamera atrofiga
        const local = vmCam.worldToLocal(v);
        return camera.localToWorld(local.multiplyScalar(1));
      }
      const e = eyeOf(p).add(new T.Vector3(0, -0.2, 0));
      const f = fwd(p.yaw, p.pitch);
      return e.add(f.multiplyScalar(0.9)).add(new T.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw)).multiplyScalar(p.id === myId ? 0.12 : 0.25));
    }

    function doFire(p, dir) {
      const o = eyeOf(p);
      const res = trace(o, dir, p.id);
      const end = o.clone().add(dir.clone().multiplyScalar(res.dist));
      const mz = muzzleWorld(p);
      const msg = { t: "fire", id: p.id, o: [mz.x, mz.y, mz.z].map((v) => +v.toFixed(2)), e: [end.x, end.y, end.z].map((v) => +v.toFixed(2)), h: res.hit ? { id: res.hit, part: res.part } : null };
      send(msg);
      showFire(msg, p.id === myId);
      if (res.hit) {
        if (p.id === myId) { hitMarker(res.part === "head"); Snd.hit(res.part === "head"); }
        if (owns(res.hit)) damage(res.hit, res.part, p.id);
      }
      return res;
    }
    function showFire(m, mine) {
      const p = P.get(m.id); if (!p) return;
      const a = new T.Vector3(...m.o), b = new T.Vector3(...m.e);
      tracer(a, b, p.team);
      if (!mine) { flashAt(a); Snd.shot(a.distanceTo(camera.position)); }
      if (m.h) { burst(b, 0x9fe8ff, 18, 5, 0.09, 0.5); burst(b, 0xffd27a, 8, 3, 0.06, 0.4); }
      else if (b.distanceTo(a) < 399) { burst(b, 0xffc070, 8, 3, 0.06, 0.35); puff(b); }
    }
    const owns = (id) => { const p = P.get(id); return !!p && (p.id === myId || (p.bot && isHost)); };

    function damage(id, part, by) {
      const p = P.get(id); if (!p || !p.alive) return;
      const hp = Math.max(0, p.hp - CFG.DMG[part]);
      const m = { t: "hp", id, hp, by, part };
      send(m); onHp(m);
    }
    function onHp(m) {
      const p = P.get(m.id); if (!p) return;
      const was = p.alive;
      p.hp = m.hp;
      if (p.brain) p.brain.hurt = true;
      if (m.id === myId) { hurtFlash(P.get(m.by) && rp(P.get(m.by))); Snd.hurt(); }
      if (was && m.hp <= 0) {
        p.alive = false; p.deaths++;
        const k = P.get(m.by); if (k) { k.kills++; if (m.part === "head") k.head++; }
        p.av.play("Death", 0.15);
        Snd.down(rp(p).distanceTo(camera.position));
        burst(rp(p).clone().add(new T.Vector3(0, 1.2, 0)), 0x9fe8ff, 30, 4, 0.1, 0.9);
        feed(m.by, m.id, m.part);
        if (m.id === myId) { L.scoped = false; L.spect = null; showDead(k); }
        if (m.by === myId && m.id !== myId) banner(`<b>${m.part === "head" ? "🎯 Boshiga!" : "⚡ O‘chirildi"}</b><small>${esc(short(p.name))}</small>`, 1300, "kill");
      }
    }
    function showDead(k) {
      ui.dead.hidden = false;
      ui.dead.innerHTML = `<b>🔌 Robotingiz o‘chdi</b><small>${k ? `${esc(k.name)} ${k.bot ? "(bot)" : ""} sizni nishonga oldi` : ""}</small><small>Raund oxirigacha jamoadoshingizni kuzatasiz · bosib almashtiring</small>`;
    }

    /* ---------- Mahalliy o'yinchi ---------- */
    function localUpdate(dt, t) {
      const live = G.phase === "live" && me.alive;
      const frozen = G.phase === "freeze";
      // Qarash
      const zk = L.scoped ? CFG.ZOOM[L.zoom] / CFG.FOV : 1;
      const sens = 0.0023 * L.sens * zk;
      me.yaw -= L.mx * sens; me.pitch = clamp(me.pitch - L.my * sens, -1.45, 1.45);
      L.mx = 0; L.my = 0;
      if (!me.alive) return;
      // Harakat
      let ix = 0, iz = 0;
      if (L.keys.has("KeyW") || L.keys.has("ArrowUp")) iz -= 1;
      if (L.keys.has("KeyS") || L.keys.has("ArrowDown")) iz += 1;
      if (L.keys.has("KeyA") || L.keys.has("ArrowLeft")) ix -= 1;
      if (L.keys.has("KeyD") || L.keys.has("ArrowRight")) ix += 1;
      ix += L.joy.x; iz += L.joy.y;
      const il = Math.hypot(ix, iz); if (il > 1) { ix /= il; iz /= il; }
      if (!live) { ix = 0; iz = 0; }
      const cs = Math.cos(me.yaw), sn = Math.sin(me.yaw);
      const wx = ix * cs + iz * sn, wz = -ix * sn + iz * cs;
      me.crouch = L.keys.has("KeyC") || L.keys.has("ControlLeft") || L.crouchT;
      const sprint = (L.keys.has("ShiftLeft") || L.keys.has("ShiftRight")) && !L.scoped && !me.crouch && iz < 0;
      const speed = me.crouch ? CFG.CROUCH : L.scoped ? CFG.SCOPED : sprint ? CFG.SPRINT : CFG.SPEED;
      physics(me, wx, wz, speed, L.jumpQ && live, dt);
      L.jumpQ = false;
      const moving = Math.hypot(me.vel.x, me.vel.z) > 0.5;
      me.f = (me.crouch ? 1 : 0) | (moving ? 2 : 0) | (sprint ? 4 : 0) | (!me.onGround ? 8 : 0) | (L.scoped ? 16 : 0);
      if (moving && me.onGround) { me.stepT -= dt * (sprint ? 1.5 : 1); if (me.stepT <= 0) { me.stepT = 0.42; Snd.step(me.crouch ? 0.4 : 1); } }
      // Nafas (durbinda Shift)
      L.holding = L.scoped && (L.keys.has("ShiftLeft") || L.keys.has("ShiftRight")) && L.breath > 0;
      L.breath = clamp(L.breath + (L.holding ? -dt / 4 : dt / 6), 0, 1);
      // Qurol holati
      if (me.boltT > 0) me.boltT -= dt;
      if (me.reloadT > 0) { me.reloadT -= dt; if (me.reloadT <= 0) { const n = Math.min(CFG.MAG - me.ammo, me.reserve); me.ammo += n; me.reserve -= n; } }
      if (L.fireQ) { L.fireQ = false; if (live) tryFire(); }
      if (frozen) L.scoped = L.scoped && true;
      L.sway += dt;
    }
    function tryFire() {
      if (me.boltT > 0 || me.reloadT > 0) return;
      if (me.ammo <= 0) { Snd.empty(); startReload(); return; }
      me.ammo--;
      const speed = Math.hypot(me.vel.x, me.vel.z);
      let spread = L.scoped ? 0.0008 + speed * 0.006 + (me.onGround ? 0 : 0.03) : 0.045 + speed * 0.01;
      if (me.crouch) spread *= 0.6;
      const sw = swayOff();
      const yaw = me.yaw + sw.x + rr(-spread, spread), pitch = me.pitch + sw.y + rr(-spread, spread);
      Snd.shot(0);
      vmFlash.visible = true; camFlash.intensity = 2.5;
      setTimeout(() => { vmFlash.visible = false; camFlash.intensity = 0; }, 55);
      doFire(me, fwd(yaw, pitch));
      L.kick = 1;
      me.pitch = clamp(me.pitch + (L.scoped ? 0.035 : 0.05), -1.45, 1.45);
      me.boltT = CFG.BOLT;
      setTimeout(() => Snd.bolt(), 120);
      if (me.ammo === 0 && me.reserve > 0) setTimeout(() => startReload(), CFG.BOLT * 1000);
    }
    function startReload() {
      if (me.reloadT > 0 || me.ammo >= CFG.MAG || me.reserve <= 0 || !me.alive) return;
      me.reloadT = CFG.RELOAD; L.scoped = false; Snd.reload();
    }
    function swayOff() {
      if (!L.scoped) return { x: 0, y: 0 };
      const a = (L.holding ? 0.15 : 1) * (me.crouch ? 0.6 : 1) * 0.0035 * (1 + (1 - L.breath) * 0.8);
      return { x: Math.sin(L.sway * 0.9) * a + Math.sin(L.sway * 2.3) * a * 0.4, y: Math.sin(L.sway * 1.3) * a * 0.8 };
    }

    /* ---------- Botlar ---------- */
    const nodesOf = (team) => world.nodes.filter((n) => n.team === team);
    function nearestNode(team, pos) { let b = null, bd = 1e9; nodesOf(team).forEach((n) => { const d = (n.x - pos.x) ** 2 + (n.z - pos.z) ** 2 + ((n.y - pos.y) * 3) ** 2; if (d < bd) { bd = d; b = n; } }); return b; }
    function pathTo(from, to) {
      const prev = { [from.id]: null }, q = [from.id];
      while (q.length) { const id = q.shift(); if (id === to.id) break; world.nodeById[id].link.forEach((n) => { if (!(n in prev)) { prev[n] = id; q.push(n); } }); }
      if (!(to.id in prev)) return [];
      const out = []; let c = to.id; while (c) { out.unshift(world.nodeById[c]); c = prev[c]; }
      return out;
    }
    function pickNest(p) {
      const list = world.nests[p.team];
      const house = list.filter((n) => /[wrg]\d$/.test(n.id)), field = list.filter((n) => !/[wrg]\d$/.test(n.id));
      const pool = Math.random() < 0.6 ? house : field;
      const taken = new Set([...P.values()].filter((q) => q.brain && q !== p && q.brain.goal).map((q) => q.brain.goal.id));
      const free = pool.filter((n) => !taken.has(n.id));
      return (free.length ? free : pool)[(Math.random() * (free.length || pool.length)) | 0];
    }
    function newBrain(p) {
      const b = { goal: null, path: [], hold: 0, target: null, react: 0, err: 0.06, think: 0, stuck: 0, last: p.pos.clone(), crouch: false, hurt: false, scanA: 0, scanT: 0 };
      b.goal = pickNest(p); b.path = pathTo(nearestNode(p.team, p.pos), b.goal);
      return b;
    }
    function visible(from, to) {
      const d = to.clone().sub(from); const L0 = d.length(); d.normalize();
      return world.rayMap([from.x, from.y, from.z], [d.x, d.y, d.z], L0) >= L0 - 0.05;
    }
    function botUpdate(p, dt) {
      const b = p.brain;
      if (!p.alive || G.phase !== "live") { physics(p, 0, 0, 0, false, dt); return; }
      if (p.boltT > 0) p.boltT -= dt;
      if (p.reloadT > 0) { p.reloadT -= dt; if (p.reloadT <= 0) p.ammo = CFG.MAG; }
      b.think -= dt;
      const eye = eyeOf(p);
      if (b.think <= 0) {
        b.think = rr(0.2, 0.35);
        let best = null, bd = 1e9;
        for (const q of P.values()) {
          if (!q.alive || q.team === p.team) continue;
          const qp = rp(q), d = qp.distanceTo(p.pos);
          if (d > 130) continue;
          const hs = q.crouch ? 0.72 : 1;
          const head = qp.clone().add(new T.Vector3(0, 1.5 * hs, 0)), chest = qp.clone().add(new T.Vector3(0, 1.0 * hs, 0));
          const vis = visible(eye, chest) ? chest : visible(eye, head) ? head : null;
          if (vis && d < bd) { bd = d; best = { id: q.id, aim: vis === head ? "head" : "body" }; }
        }
        if (best && (!b.target || b.target.id !== best.id)) { b.react = rr(0.8, 1.6) + bd / 90; b.err = rr(0.05, 0.09); }
        b.target = best;
        if (b.hurt) { b.hurt = false; if (!b.target || Math.random() < 0.5) { b.goal = pickNest(p); b.path = pathTo(nearestNode(p.team, p.pos), b.goal); b.hold = 0; } }
      }
      let wx = 0, wz = 0, speed = CFG.SPEED * 0.85;
      if (b.target) {
        const q = P.get(b.target.id);
        if (!q || !q.alive) b.target = null;
        else {
          const hs = q.crouch ? 0.72 : 1;
          const aimPt = rp(q).clone().add(new T.Vector3(0, (b.target.aim === "head" ? 1.5 : 1.0) * hs, 0));
          const d = aimPt.clone().sub(eye);
          const wantYaw = Math.atan2(-d.x, -d.z), wantPitch = Math.atan2(d.y, Math.hypot(d.x, d.z));
          let dy = ((wantYaw - p.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
          p.yaw += clamp(dy, -3.2 * dt, 3.2 * dt); p.pitch += clamp(wantPitch - p.pitch, -2 * dt, 2 * dt);
          b.react -= dt;
          b.err = Math.max(0.01, b.err * Math.exp(-dt * 0.7));
          p.crouch = b.crouch;
          if (b.react <= 0 && Math.abs(dy) < 0.05 && p.boltT <= 0 && p.reloadT <= 0) {
            if (p.ammo <= 0) { p.reloadT = CFG.RELOAD; }
            else {
              p.ammo--; p.boltT = CFG.BOLT + rr(0.2, 0.8);
              const e = b.err * (q.f & 2 ? 1.6 : 1);
              const dir = d.normalize();
              const yaw = Math.atan2(-dir.x, -dir.z) + rr(-e, e), pitch = Math.asin(clamp(dir.y, -1, 1)) + rr(-e, e) * 0.7;
              doFire(p, fwd(yaw, pitch));
              b.err *= 0.8;
            }
          }
        }
      }
      if (!b.target) {
        const nx = b.path[0];
        if (nx) {
          const dx = nx.x - p.pos.x, dz = nx.z - p.pos.z, dist = Math.hypot(dx, dz);
          if (dist < 0.55 && Math.abs(nx.y - p.pos.y) < 1.2) { b.path.shift(); }
          else { wx = dx / dist; wz = dz / dist; p.yaw += clamp(((Math.atan2(-dx, -dz) - p.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI, -6 * dt, 6 * dt); }
          p.crouch = false;
          b.stuck += dt;
          if (b.stuck > 1.2) { if (p.pos.distanceTo(b.last) < 0.5) { b.path = pathTo(nearestNode(p.team, p.pos), b.goal); physics(p, wx, wz, speed, true, 0); } b.last.copy(p.pos); b.stuck = 0; }
        } else {
          // Uyada kutish va atrofni kuzatish
          if (b.hold <= 0) { b.hold = rr(7, 16); b.crouch = Math.random() < 0.5; b.scanA = p.team === "r" ? Math.PI : 0; }
          b.hold -= dt;
          p.crouch = b.crouch;
          b.scanT += dt;
          const want = b.scanA + Math.sin(b.scanT * 0.45) * 0.7;
          p.yaw += clamp(((want - p.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI, -1.5 * dt, 1.5 * dt);
          p.pitch += (0 - p.pitch) * Math.min(1, dt * 2);
          if (b.hold <= 0) { b.goal = pickNest(p); b.path = pathTo(nearestNode(p.team, p.pos), b.goal); }
        }
      }
      physics(p, wx, wz, speed, false, dt);
      const moving = Math.hypot(p.vel.x, p.vel.z) > 0.5;
      p.f = (p.crouch ? 1 : 0) | (moving ? 2 : 0) | (!p.onGround ? 8 : 0) | (b.target ? 16 : 0);
    }

    /* ---------- Avatar (ko'rinish) ---------- */
    function remoteSample(p, tNow) {
      const buf = p.buf; if (!buf.length) return;
      const rt = tNow - 140;
      while (buf.length > 2 && buf[1].t <= rt) buf.shift();
      const a = buf[0], b = buf[1] || buf[0];
      const k = b.t === a.t ? 1 : clamp((rt - a.t) / (b.t - a.t), 0, 1.2);
      p.pos.set(a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k, a.p[2] + (b.p[2] - a.p[2]) * k);
      let dy = b.p[3] - a.p[3]; if (dy > Math.PI) dy -= Math.PI * 2; if (dy < -Math.PI) dy += Math.PI * 2;
      p.yaw = a.p[3] + dy * k; p.pitch = b.p[4]; p.f = b.p[5]; p.crouch = !!(p.f & 1);
    }
    function avatarUpdate(p, dt) {
      const o = p.av.obj;
      o.visible = !(p.id === myId && !(L.spect && L.spect !== myId)) && p.pos.y > -20;
      if (p.id === myId) o.visible = false;
      o.position.copy(p.pos);
      o.rotation.y = p.yaw + Math.PI;
      const sy = p.crouch && p.alive ? 0.74 : 1;
      o.scale.set(1, o.scale.y + (sy - o.scale.y) * Math.min(1, dt * 10), 1);
      if (p.alive) {
        const moving = p.f & 2, air = p.f & 8;
        p.av.play(air ? "Jump" : moving ? (p.f & 4 ? "Running" : "Running") : "Idle");
      }
      if (p.tag) p.tag.visible = p.alive && (p.team === me.team || !me.alive);
      p.av.mixer.update(dt * (p.f & 2 && !(p.f & 4) ? 0.85 : 1));
      if (o.visible) p.av.syncGun();
    }

    /* ---------- Raundlar (host) ---------- */
    function startRound(n) {
      const sp = {};
      ["r", "b"].forEach((team) => {
        const pts = world.spawns[team].slice().sort(() => Math.random() - 0.5);
        [...P.values()].filter((p) => p.team === team).forEach((p, i) => { const s = pts[i % pts.length]; sp[p.id] = [+(s.x + rr(-0.6, 0.6)).toFixed(2), +(s.z + rr(-0.5, 0.5)).toFixed(2), s.yaw]; });
      });
      const m = { t: "round", n, sc: [G.sc.r, G.sc.b], sp, frz: CFG.FREEZE_MS, dur: CFG.ROUND_MS };
      send(m); onRound(m);
    }
    function onRound(m) {
      if (m.to && m.to !== myId) return;
      G.round = m.n; G.sc.r = m.sc[0]; G.sc.b = m.sc[1];
      G.phase = "freeze"; G.freezeUntil = now() + m.frz; G.endAt = G.freezeUntil + m.dur; G.over = false;
      for (const p of P.values()) {
        const s = m.sp[p.id];
        if (!s) { p.alive = false; p.pos.y = -50; continue; }
        p.alive = true; p.hp = CFG.HP; p.pos.set(s[0], 0, s[1]); p.vel.set(0, 0, 0); p.yaw = s[2]; p.pitch = 0;
        p.ammo = CFG.MAG; p.reserve = CFG.RESERVE; p.boltT = 0; p.reloadT = 0; p.buf = []; p.crouch = false;
        p.av.play("Idle", 0); p.av.obj.position.copy(p.pos);
        if (p.bot && isHost) p.brain = newBrain(p);
      }
      L.scoped = false; L.spect = null; ui.dead.hidden = true;
      banner(`<b>${m.n}-raund</b><small>${TEAMNAME[me.team]} jamoa · tayyorlaning!</small>`, m.frz - 300);
      Snd.horn();
    }
    function hostTick() {
      const t = now();
      if (G.phase === "freeze" && t >= G.freezeUntil) { G.phase = "live"; send({ t: "live" }); }
      if (G.phase === "live") {
        const ar = [...P.values()].filter((p) => p.team === "r" && p.alive).length;
        const ab = [...P.values()].filter((p) => p.team === "b" && p.alive).length;
        let win = null, why = "";
        if (ar === 0 && ab === 0) { win = "-"; why = "Ikki jamoa ham o‘chdi"; }
        else if (ar === 0) { win = "b"; why = "Qizil jamoa to‘liq o‘chirildi"; }
        else if (ab === 0) { win = "r"; why = "Ko‘k jamoa to‘liq o‘chirildi"; }
        else if (t >= G.endAt) { win = ar > ab ? "r" : ab > ar ? "b" : "-"; why = "Vaqt tugadi"; }
        if (win) {
          if (win !== "-") G.sc[win]++;
          const over = G.sc.r >= CFG.WIN || G.sc.b >= CFG.WIN;
          const m = { t: "rend", win, why, sc: [G.sc.r, G.sc.b], over };
          send(m); onRoundEnd(m);
          G.nextAt = t + CFG.BREAK_MS;
        }
      }
      if (G.phase === "end" && !G.over && G.nextAt && t >= G.nextAt) { G.nextAt = 0; startRound(G.round + 1); }
    }
    function onRoundEnd(m) {
      G.phase = "end"; G.sc.r = m.sc[0]; G.sc.b = m.sc[1]; G.over = m.over;
      L.scoped = false;
      const mine = m.win === me.team;
      if (m.over) {
        G.phase = "over";
        mine ? Snd.win() : Snd.lose();
        showOver(m);
      } else {
        banner(`<b>${m.win === "-" ? "🤝 Durang" : `${m.win === "r" ? "🔴" : "🔵"} ${TEAMNAME[m.win]} jamoa yutdi!`}</b><small>${esc(m.why)} · ${G.sc.r} : ${G.sc.b}</small>`, CFG.BREAK_MS - 400, m.win === "-" ? "" : mine ? "win" : "lose");
        if (m.win !== "-") mine ? Snd.win() : Snd.lose();
      }
    }
    function showOver(m) {
      renderBoard();
      const mine = m.win === me.team;
      const best = [...P.values()].sort((a, b) => b.kills - a.kills || b.head - a.head)[0];
      ui.start.hidden = false;
      ui.start.innerHTML = `<div class="sn-over ${mine ? "win" : "lose"}"><span class="big">${mine ? "🏆" : "🤖"}</span>
        <h2>${mine ? "G‘alaba!" : "Mag‘lubiyat"}</h2><p>${TEAMNAME[m.win] || ""} jamoa ${G.sc.r} : ${G.sc.b} hisobida yutdi</p>
        ${best ? `<p class="mvp">⭐ Eng yaxshi snayper: <b>${esc(best.name)}</b> · ${best.kills} ta</p>` : ""}
        ${ui.board.innerHTML}
        <div class="sn-row">${isHost ? `<button class="sn-btn" data-b="again">🔁 Yana o‘ynash</button>` : `<span class="sn-wait">Xona egasi yangi o‘yinni boshlashini kuting...</span>`}<button class="sn-btn ghost" data-b="exit">🚪 Chiqish</button></div></div>`;
      if (document.pointerLockElement) document.exitPointerLock();
    }
    function newMatch() {
      G.sc.r = 0; G.sc.b = 0;
      for (const p of P.values()) { p.kills = 0; p.deaths = 0; p.head = 0; }
      ui.start.hidden = true;
      const m = { t: "match" }; send(m);
      startRound(1);
    }

    /* ---------- Tarmoq ---------- */
    function onMsg(m) {
      if (!m || !m.t) return;
      if (m.t === "s") { const p = P.get(m.id); if (p && p.id !== myId) { p.buf.push({ t: now(), p: m.p }); if (p.buf.length > 8) p.buf.shift(); } }
      else if (m.t === "bs") { if (isHost) return; m.l.forEach((a) => { const p = P.get(a[0]); if (p) { p.buf.push({ t: now(), p: a.slice(1) }); if (p.buf.length > 8) p.buf.shift(); } }); }
      else if (m.t === "fire") { showFire(m, false); if (m.h && owns(m.h.id)) damage(m.h.id, m.h.part, m.id); }
      else if (m.t === "hp") onHp(m);
      else if (m.t === "round") onRound(m);
      else if (m.t === "need" && isHost) snapshotFor(m.id);
      else if (m.t === "live") { if (G.phase === "freeze") G.phase = "live"; }
      else if (m.t === "rend") onRoundEnd(m);
      else if (m.t === "match") { for (const p of P.values()) { p.kills = 0; p.deaths = 0; p.head = 0; } ui.start.hidden = true; }
      else if (m.t === "sync" && m.to === myId) {
        if (G.round !== m.n) { G.round = m.n; G.phase = m.phase; G.endAt = now() + m.left; G.freezeUntil = now(); }
        G.sc.r = m.sc[0]; G.sc.b = m.sc[1];
        (m.st || []).forEach(([id, k, d, h, alive]) => { const p = P.get(id); if (p) { p.kills = k; p.deaths = d; p.head = h; p.alive = !!alive; } });
        if (!me.alive) { showDead(null); ui.dead.innerHTML = `<b>⏳ Keyingi raundda qo‘shilasiz</b><small>Hozircha jamoadoshlarni kuzating</small>`; }
      }
    }
    /** Kech qo'shilgan o'yinchiga joriy raund holati. */
    function snapshotFor(id) {
      if (!G.round || (G.phase !== "freeze" && G.phase !== "live")) return;
      const t = now(), sp = {};
      for (const p of P.values()) if (p.alive && p.id !== id) sp[p.id] = [+p.pos.x.toFixed(2), +p.pos.z.toFixed(2), +p.yaw.toFixed(2)];
      if (G.phase === "freeze") { const q = P.get(id); const s0 = world.spawns[q ? q.team : "r"][0]; sp[id] = [s0.x, s0.z, s0.yaw]; }
      send({ t: "round", to: id, n: G.round, sc: [G.sc.r, G.sc.b], sp, frz: Math.max(0, G.freezeUntil - t), dur: Math.max(0, G.endAt - Math.max(t, G.freezeUntil)) });
      setTimeout(() => { const pl = P.get(id); send({ t: "sync", to: id, n: G.round, sc: [G.sc.r, G.sc.b], phase: G.phase, left: Math.max(0, G.endAt - now()), st: [...P.values()].map((p) => [p.id, p.kills, p.deaths, p.head, p.alive ? 1 : 0]) }); }, 300);
    }
    let netT = 0;
    function netTick(t) {
      if (t - netT < CFG.NET_MS) return;
      netT = t;
      if (me.alive || G.phase === "live" || G.phase === "freeze") {
        const r2 = (v) => Math.round(v * 100) / 100;
        send({ t: "s", id: myId, p: [r2(me.pos.x), r2(me.pos.y), r2(me.pos.z), r2(me.yaw), r2(me.pitch), me.f] });
      }
      if (isHost) {
        const l = [...P.values()].filter((p) => p.bot).map((p) => [p.id, Math.round(p.pos.x * 100) / 100, Math.round(p.pos.y * 100) / 100, Math.round(p.pos.z * 100) / 100, Math.round(p.yaw * 100) / 100, Math.round(p.pitch * 100) / 100, p.f]);
        if (l.length) send({ t: "bs", l });
      }
    }

    /* ---------- Boshqaruv ---------- */
    const canvas = renderer.domElement;
    let locked = false, paused = false, started = false;
    const lockIt = () => { if (!MOBILE && canvas.requestPointerLock && !paused) { try { canvas.requestPointerLock(); } catch (e) {} } };
    document.addEventListener("pointerlockchange", onLock);
    function onLock() {
      locked = document.pointerLockElement === canvas;
      if (!locked && started && !MOBILE && G.phase !== "over" && !paused) openMenu();
    }
    function openMenu() {
      paused = true;
      ui.menu.hidden = false;
      ui.menu.innerHTML = `<div class="sn-mcard"><h3>⏸ Menyu</h3>
        <label>🖱 Sezgirlik <input type="range" min="0.3" max="2.5" step="0.05" value="${L.sens}" data-sens><b data-sv>${L.sens.toFixed(2)}</b></label>
        <label>🔊 Tovush <input type="checkbox" data-snd ${Snd.on ? "checked" : ""}></label>
        <div class="sn-keys">${MOBILE ? "Chap: joystik · o‘ng: barmoq bilan qarang · 🎯 otish · 🔭 durbin · ± kattalashtirish" : "W A S D — yurish · Sichqoncha — qarash · Chap tugma — otish · O‘ng tugma — durbin · G‘ildirak — 4×/8× · Shift — yugurish / durbinda nafasni ushlash · C — cho‘kkalash · Probel — sakrash · R — o‘qlash · Tab — hisob"}</div>
        <div class="sn-row"><button class="sn-btn" data-b="resume">▶ Davom etish</button><button class="sn-btn ghost" data-b="exit">🚪 O‘yindan chiqish</button></div></div>`;
      ui.menu.querySelector("[data-sens]").oninput = (e) => { L.sens = Number(e.target.value); ui.menu.querySelector("[data-sv]").textContent = L.sens.toFixed(2); try { localStorage.setItem("sofi_sn_sens", L.sens); } catch (er) {} };
      ui.menu.querySelector("[data-snd]").onchange = (e) => Snd.set(e.target.checked);
    }
    function closeMenu() { paused = false; ui.menu.hidden = true; lockIt(); }
    const onKey = (e, down) => {
      if (["Tab", "Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
      if (down) {
        L.keys.add(e.code);
        if (e.code === "Space") L.jumpQ = true;
        if (e.code === "KeyR") startReload();
        if (e.code === "Tab") { renderBoard(); ui.board.hidden = false; }
        if (e.code === "Escape" && MOBILE) paused ? closeMenu() : openMenu();
      } else {
        L.keys.delete(e.code);
        if (e.code === "Tab") ui.board.hidden = true;
      }
    };
    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const onMove = (e) => { if (locked && Math.abs(e.movementX) < 250 && Math.abs(e.movementY) < 250) { L.mx += e.movementX; L.my += e.movementY; } };
    document.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", (e) => {
      Snd.init();
      if (!locked) { lockIt(); return; }
      if (e.button === 0) { if (!me.alive && G.phase !== "over") cycleSpect(); else L.fireQ = true; }
      if (e.button === 2) toggleScope();
    });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("wheel", (e) => { if (L.scoped) { L.zoom = e.deltaY > 0 ? 1 : 2; Snd.zoom(); } e.preventDefault(); }, { passive: false });
    function toggleScope() {
      if (!me.alive || me.reloadT > 0) return;
      L.scoped = !L.scoped; if (L.scoped && !L.zoom) L.zoom = 1; Snd.zoom();
    }
    function cycleSpect() {
      const mates = [...P.values()].filter((p) => p.alive && p.team === me.team);
      const pool = mates.length ? mates : [...P.values()].filter((p) => p.alive);
      if (!pool.length) return;
      const i = pool.findIndex((p) => p.id === L.spect);
      L.spect = pool[(i + 1) % pool.length].id;
    }
    hud.addEventListener("click", (e) => {
      const b = e.target.closest("[data-b]"); if (!b) return;
      const k = b.dataset.b;
      if (k === "resume") closeMenu();
      else if (k === "exit") destroy(true);
      else if (k === "again") { if (isHost) newMatch(); }
      else if (k === "menu") openMenu();
      else if (k === "board") { renderBoard(); ui.board.hidden = !ui.board.hidden; }
    });
    ui.board.addEventListener("click", () => (ui.board.hidden = true));
    ui.dead.addEventListener("click", cycleSpect);

    // Sensorli ekran
    if (MOBILE) {
      const joy = $("[data-joy]"), knob = joy.querySelector("i");
      const btn = (k, down) => {
        Snd.init();
        if (k === "fire" && down) { if (!me.alive) cycleSpect(); else L.fireQ = true; }
        if (k === "scope" && down) toggleScope();
        if (k === "jump" && down) L.jumpQ = true;
        if (k === "crouch" && down) L.crouchT = !L.crouchT;
        if (k === "reload" && down) startReload();
        if (k === "zoom" && down && L.scoped) { L.zoom = L.zoom === 1 ? 2 : 1; Snd.zoom(); }
      };
      hud.querySelectorAll(".sn-b").forEach((b) => b.addEventListener("touchstart", (e) => { e.preventDefault(); e.stopPropagation(); b.classList.add("on"); btn(b.dataset.b, true); }, { passive: false }));
      hud.querySelectorAll(".sn-b").forEach((b) => b.addEventListener("touchend", () => b.classList.remove("on")));
      const ts = (e) => {
        Snd.init();
        for (const t of e.changedTouches) {
          if (t.target.closest && t.target.closest(".sn-b,.sn-menu,.sn-start,.sn-pause,.sn-tab,.sn-board")) continue;
          if (t.clientX < innerWidth * 0.42 && L.joy.id === null) { L.joy.id = t.identifier; L.joy.ox = t.clientX; L.joy.oy = t.clientY; joy.style.left = t.clientX - 60 + "px"; joy.style.top = t.clientY - 60 + "px"; joy.classList.add("on"); }
          else if (L.look.id === null) { L.look.id = t.identifier; L.look.x = t.clientX; L.look.y = t.clientY; }
        }
      };
      const tm = (e) => {
        for (const t of e.changedTouches) {
          if (t.identifier === L.joy.id) { const dx = t.clientX - L.joy.ox, dy = t.clientY - L.joy.oy, d = Math.min(50, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); L.joy.x = Math.cos(a) * d / 50; L.joy.y = Math.sin(a) * d / 50; knob.style.transform = `translate(${L.joy.x * 40}px,${L.joy.y * 40}px)`; }
          else if (t.identifier === L.look.id) { L.mx += (t.clientX - L.look.x) * 1.6; L.my += (t.clientY - L.look.y) * 1.6; L.look.x = t.clientX; L.look.y = t.clientY; }
        }
        e.preventDefault();
      };
      const te = (e) => { for (const t of e.changedTouches) { if (t.identifier === L.joy.id) { L.joy.id = null; L.joy.x = 0; L.joy.y = 0; knob.style.transform = ""; joy.classList.remove("on"); } if (t.identifier === L.look.id) L.look.id = null; } };
      container.addEventListener("touchstart", ts, { passive: true });
      container.addEventListener("touchmove", tm, { passive: false });
      container.addEventListener("touchend", te); container.addEventListener("touchcancel", te);
    }

    /* ---------- O'lcham ---------- */
    function resize() {
      const w = container.clientWidth || innerWidth, h = container.clientHeight || innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      vmCam.aspect = w / h; vmCam.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    /* ---------- Asosiy sikl ---------- */
    let last = now(), raf = 0, alive = true, birdT = 8, hudT = 0;
    const camPos = new T.Vector3();
    function frame() {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const t = now(), dt = Math.min(0.05, (t - last) / 1000); last = t;
      const ts = t / 1000;
      if (!paused || !MOBILE) localUpdate(paused ? 0 : dt, ts);
      for (const p of P.values()) {
        if (p.id === myId) continue;
        if (p.bot && isHost) { if (!p.brain) p.brain = newBrain(p); botUpdate(p, dt); }
        else remoteSample(p, t);
      }
      for (const p of P.values()) avatarUpdate(p, dt);
      if (isHost) hostTick();
      if (G.phase === "freeze" && t < G.freezeUntil) {
        const n = Math.ceil((G.freezeUntil - t) / 1000);
        if (n !== frame.n) { frame.n = n; if (n <= 3) { Snd.tick(); banner(`<b class="cd">${n}</b>`, 900); } }
      } else frame.n = 0;
      if (G.phase === "live" && frame.live !== G.round) { frame.live = G.round; banner(`<b>⚔️ Jang!</b>`, 900); }
      cameraUpdate(dt, ts);
      vmUpdate(dt, ts);
      updateFx(dt);
      world.update(ts, dt, camera.position);
      netTick(t);
      birdT -= dt; if (birdT <= 0) { birdT = rr(6, 15); Snd.bird(); }
      if (t - hudT > 100) { hudT = t; hudUpdate(t); }
      if (centerT && t > centerT) { ui.center.innerHTML = ""; centerT = 0; }
      renderer.clear();
      renderer.render(scene, camera);
      if (!L.scoped && me.alive && (!L.spect)) { renderer.clearDepth(); renderer.render(vmScene, vmCam); }
    }
    function cameraUpdate(dt, ts) {
      let target = me;
      if (!me.alive && G.phase !== "wait") {
        if (!L.spect || !P.get(L.spect) || !P.get(L.spect).alive) { L.spect = null; cycleSpect(); }
        target = P.get(L.spect) || me;
      } else L.spect = null;
      if (target === me) {
        const eyeH = me.crouch ? CFG.EYEC : CFG.EYE;
        camPos.set(me.pos.x, me.pos.y + eyeH, me.pos.z);
        const sp = Math.hypot(me.vel.x, me.vel.z);
        if (me.onGround && sp > 0.5 && !L.scoped) camPos.y += Math.sin(ts * (sp > 5 ? 13 : 9)) * 0.035;
        camera.position.lerp(camPos, me.alive ? 1 : 0.2);
        const sw = swayOff();
        camera.rotation.set(0, 0, 0); camera.rotation.order = "YXZ";
        camera.rotation.y = me.yaw + sw.x; camera.rotation.x = me.pitch + sw.y;
        if (!me.alive) camera.rotation.x = -0.6;
      } else {
        const tp = rp(target);
        const f = fwd(target.yaw, 0);
        camPos.set(tp.x - f.x * 3.2, tp.y + 2.4, tp.z - f.z * 3.2);
        camera.position.lerp(camPos, Math.min(1, dt * 6));
        camera.rotation.order = "YXZ"; camera.rotation.set(-0.28, target.yaw, 0);
      }
      const fov = L.scoped && me.alive ? CFG.ZOOM[L.zoom] : CFG.FOV;
      if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 18); camera.updateProjectionMatrix(); }
    }
    function vmUpdate(dt, ts) {
      const sp = Math.hypot(me.vel.x, me.vel.z);
      const bob = me.onGround ? sp * 0.004 : 0;
      L.kick = Math.max(0, L.kick - dt * 3.2);
      const k = L.kick;
      let x = 0.2 + Math.sin(ts * 8) * bob, y = -0.2 - Math.abs(Math.cos(ts * 8)) * bob, z = -0.4 + k * 0.09, rx = k * 0.18, rz = 0;
      // Zatvor animatsiyasi
      const bolt = vm.userData.bolt;
      const bt = me.boltT > 0 ? 1 - me.boltT / CFG.BOLT : 1;
      if (me.boltT > 0 && bt > 0.12) {
        const u = (bt - 0.12) / 0.88, wave = Math.sin(Math.min(1, u) * Math.PI);
        bolt.rotation.x = 0; bolt.rotation.z = wave * 1.2; bolt.position.z = -0.07 + wave * 0.08;
        rz = wave * 0.25; y -= wave * 0.03; x -= wave * 0.02;
      } else { bolt.rotation.z = 0; bolt.position.z = -0.07; }
      if (me.reloadT > 0) { const u = 1 - me.reloadT / CFG.RELOAD, w = Math.sin(u * Math.PI); y -= w * 0.16; rx -= w * 0.5; rz += w * 0.35; }
      if (me.crouch) y -= 0.01;
      vmHold.position.x += (x - vmHold.position.x) * Math.min(1, dt * 14);
      vmHold.position.y += (y - vmHold.position.y) * Math.min(1, dt * 14);
      vmHold.position.z += (z - vmHold.position.z) * Math.min(1, dt * 20);
      vmHold.rotation.x += (rx - vmHold.rotation.x) * Math.min(1, dt * 16);
      vmHold.rotation.z += (rz - vmHold.rotation.z) * Math.min(1, dt * 10);
    }
    function hudUpdate(t) {
      ui.sr.textContent = G.sc.r; ui.sb.textContent = G.sc.b;
      const dots = (team) => [...P.values()].filter((p) => p.team === team).map((p) => `<span class="${p.alive ? "" : "off"} ${p.id === myId ? "me" : ""}"></span>`).join("");
      ui.ar.innerHTML = dots("r"); ui.ab.innerHTML = dots("b");
      const left = G.phase === "freeze" ? G.endAt - G.freezeUntil : G.phase === "live" ? Math.max(0, G.endAt - t) : 0;
      const s = Math.ceil(left / 1000);
      ui.clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      ui.clock.classList.toggle("low", G.phase === "live" && s <= 20);
      ui.rn.textContent = G.round ? `${G.round}-raund · ${CFG.WIN} g‘alabagacha` : "Tayyorlanmoqda";
      ui.hp.style.width = me.hp + "%"; ui.hpn.textContent = me.hp;
      ui.hp.parentElement.parentElement.classList.toggle("low", me.hp <= 40);
      ui.am.textContent = me.ammo; ui.rs.textContent = me.reserve;
      ui.amst.textContent = me.reloadT > 0 ? "o‘qlanmoqda..." : me.boltT > 0 ? "zatvor..." : me.ammo === 0 ? "R — o‘qlash" : "";
      ui.scope.hidden = !(L.scoped && me.alive);
      ui.cross.hidden = L.scoped || !me.alive;
      ui.cross.classList.toggle("wide", Math.hypot(me.vel.x, me.vel.z) > 0.5 || !me.onGround);
      ui.zoom.textContent = L.zoom === 2 ? "8×" : "4×";
      ui.breath.style.width = L.breath * 100 + "%";
      hud.classList.toggle("dead", !me.alive);
    }

    function destroy(user) {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLock);
      if (document.pointerLockElement) document.exitPointerLock();
      Snd.ambience(false);
      renderer.dispose();
      renderer.forceContextLoss && renderer.forceContextLoss();
      container.innerHTML = "";
      if (user && opts.onExit) opts.onExit();
    }

    // Boshlash ekrani
    ui.start.hidden = false;
    ui.start.innerHTML = `<div class="sn-intro"><span class="big">🎯</span><h2>${TEAMNAME[me.team]} jamoa</h2>
      <p>${MOBILE ? "Chap barmoq — yurish, o‘ng barmoq — qarash. 🔭 — durbin, 🎯 — otish." : "Sichqoncha bilan qarang, o‘ng tugma — durbin, chap tugma — otish. Shift — nafasni ushlash."}</p>
      <p class="sm">Raqib jamoaning hamma robotini o‘chiring. ${CFG.WIN} raund yutgan jamoa g‘olib!</p>
      <button class="sn-btn" data-go type="button">▶ Jangga kirish</button></div>`;
    ui.start.querySelector("[data-go]").onclick = () => {
      Snd.init(); Snd.ambience(true);
      started = true; ui.start.hidden = true; lockIt();
      if (MOBILE && container.requestFullscreen) container.requestFullscreen().catch(() => {});
    };

    frame();
    if (isHost) setTimeout(() => { if (alive && G.phase === "wait") startRound(1); }, 1500);
    else { const ask = () => { if (!alive || G.round) return; send({ t: "need", id: myId }); setTimeout(ask, 2000); }; setTimeout(ask, 400); }

    return {
      onMsg,
      debug: { P, G, L, me, camera, world, scene, renderer, toggleScope, tryFire: () => tryFire() },
      destroy: () => destroy(false),
      get state() { return G; },
      setHost(v) {
        if (v === isHost) return;
        isHost = v;
        if (v) {
          for (const p of P.values()) if (p.bot) { p.buf = []; p.brain = newBrain(p); }
          if (G.phase === "end" && !G.over) G.nextAt = now() + 2500;
        } else for (const p of P.values()) p.brain = null;
      },
      /** Xona tarkibi o'zgarganda (host yuboradi). */
      setRoster(list) {
        const ids = new Set(list.map((r) => r.id));
        [...P.keys()].forEach((id) => { if (!ids.has(id) && id !== myId) removePlayer(id); });
        list.forEach((r) => { const p = addPlayer(r); if (p.team !== r.team) p.team = r.team; });
      },
      syncFor(id) {
        if (!isHost) return;
        send({ t: "sync", to: id, n: G.round, sc: [G.sc.r, G.sc.b], phase: G.phase === "freeze" ? "live" : G.phase, left: Math.max(0, G.endAt - now()), st: [...P.values()].map((p) => [p.id, p.kills, p.deaths, p.head, p.alive ? 1 : 0]) });
      },
    };
  }

  window.SofiSniper3D = { load, create, CFG, BOTNAMES };
})();
