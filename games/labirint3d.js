/* BILIM LABIRINTI 3D — tungi tosh labirint, mash'alalar, savol darvozalari, xazina sandiqlari,
   chiqish portali, xarita. create(container, { level, grade, onExit, onWin, onLose }) */
(() => {
  "use strict";
  const T = window.THREE;
  const Q = window.SofiMazeQ;
  const S = 3;            // bitta katak (metr)
  const WH = 3.8;         // devor balandligi
  const EYE = 1.62, R = 0.33;
  const MOBILE = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  const LOW = /[?&]lbq=low/.test(location.search);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rr = (a, b) => a + Math.random() * (b - a);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const LEVELS = [
    { w: 6, h: 6, gates: 3, chests: 2 }, { w: 8, h: 8, gates: 4, chests: 3 }, { w: 10, h: 10, gates: 5, chests: 3 },
    { w: 12, h: 12, gates: 6, chests: 4 }, { w: 14, h: 14, gates: 7, chests: 5 },
  ];

  /* ---------------- Tovush ---------------- */
  const Snd = (() => {
    let ac = null, master = null, verb = null, nb = null, amb = null, on = true;
    const init = () => {
      if (ac) { if (ac.state === "suspended") ac.resume(); return; }
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        master = ac.createGain(); master.gain.value = 0.85; master.connect(ac.destination);
        nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const len = ac.sampleRate * 2.6, ir = ac.createBuffer(2, len, ac.sampleRate);
        for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
        const cv = ac.createConvolver(); cv.buffer = ir; const vg = ac.createGain(); vg.gain.value = 0.55; cv.connect(vg); vg.connect(master); verb = cv;
      } catch (e) { ac = null; }
    };
    const ok = () => on && ac && ac.state === "running";
    const out = (wet = 0.3) => { const g = ac.createGain(); g.connect(master); if (verb) { const w = ac.createGain(); w.gain.value = wet; g.connect(w); w.connect(verb); } return g; };
    const noise = (t, dur, f0, f1, vol, type, dest, q = 0.8, att = 0.005) => {
      const s = ac.createBufferSource(); s.buffer = nb; const f = ac.createBiquadFilter(); f.type = type || "lowpass"; f.Q.value = q;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05);
    };
    const tone = (t, dur, f0, f1, vol, type, dest, att = 0.01) => {
      const o = ac.createOscillator(); o.type = type || "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
    };
    return {
      init, get on() { return on; }, set(v) { on = v; if (master) master.gain.value = v ? 0.85 : 0; },
      step(k = 1) { if (!ok()) return; const t = ac.currentTime, o = out(0.25); noise(t, 0.07, 2600, 700, 0.12 * k, "bandpass", o, 1.2); tone(t, 0.06, 140, 80, 0.08 * k, "sine", o); },
      rumble() { if (!ok()) return; const t = ac.currentTime, o = out(0.6); noise(t, 1.1, 500, 60, 0.9, "lowpass", o, 0.7, 0.03); tone(t, 0.9, 55, 32, 0.6, "sine", o, 0.03); noise(t + 0.6, 0.25, 3000, 800, 0.25, "bandpass", o, 1); },
      sink() { if (!ok()) return; const t = ac.currentTime, o = out(0.6); noise(t, 1.0, 300, 50, 0.6, "lowpass", o, 0.7, 0.05); },
      good() { if (!ok()) return; const t = ac.currentTime, o = out(0.5); [659, 880, 1175, 1568].forEach((f, i) => tone(t + i * 0.08, 0.5, f, f, 0.12, "triangle", o)); },
      bad() { if (!ok()) return; const t = ac.currentTime, o = out(0.3); tone(t, 0.35, 220, 150, 0.22, "sawtooth", o); tone(t + 0.15, 0.4, 160, 110, 0.18, "sawtooth", o); },
      coin() { if (!ok()) return; const t = ac.currentTime, o = out(0.4); [1319, 1760, 2093, 2637].forEach((f, i) => tone(t + i * 0.06, 0.25, f, f, 0.1, "sine", o)); },
      drip() { if (!ok()) return; const t = ac.currentTime, o = out(0.9), f = rr(900, 1700); tone(t, 0.12, f * 1.6, f, 0.05, "sine", o, 0.002); },
      crackle(k) { if (!ok() || k < 0.05) return; const t = ac.currentTime, o = out(0.1); noise(t, 0.04, 3500, 1500, 0.08 * k, "bandpass", o, 2, 0.001); },
      win() { if (!ok()) return; const t = ac.currentTime, o = out(0.6); [523, 659, 784, 1046, 1318].forEach((f, i) => tone(t + i * 0.13, 0.7, f, f, 0.14, "triangle", o)); noise(t, 1.5, 6000, 1500, 0.1, "highpass", o, 0.5, 0.3); },
      lose() { if (!ok()) return; const t = ac.currentTime, o = out(0.5); [392, 311, 262, 196].forEach((f, i) => tone(t + i * 0.2, 0.5, f, f * 0.97, 0.15, "triangle", o)); },
      scary() { if (!ok()) return; const t = ac.currentTime, o = out(0.9); tone(t, 1.6, 70, 40, 0.5, "sawtooth", o, 0.02); noise(t, 1.4, 900, 200, 0.35, "bandpass", o, 6, 0.1); [0, 0.3, 0.6].forEach((d) => noise(t + d, 0.5, 2200 + d * 900, 1200, 0.12, "bandpass", o, 8, 0.15)); tone(t + 0.1, 1.2, 466, 440, 0.06, "sine", o, 0.2); tone(t + 0.1, 1.2, 494, 470, 0.06, "sine", o, 0.2); },
      nice() { if (!ok()) return; const t = ac.currentTime, o = out(0.8); [523, 659, 784, 988, 1175, 1568].forEach((f, i) => tone(t + i * 0.09, 1.2, f, f, 0.07, "sine", o, 0.02)); noise(t, 1.2, 8000, 4000, 0.05, "highpass", o, 0.5, 0.2); },
      moan() { if (!ok()) return; const t = ac.currentTime, o = out(1.0); const f = rr(80, 120); tone(t, 2.6, f, f * 0.8, 0.12, "triangle", o, 0.6); noise(t + 0.4, 2.2, 600, 150, 0.08, "bandpass", o, 4, 0.8); },
      warp() { if (!ok()) return; const t = ac.currentTime, o = out(0.7); tone(t, 1.0, 200, 1600, 0.18, "sine", o, 0.05); noise(t, 1.0, 400, 6000, 0.25, "bandpass", o, 2, 0.1); },
      prize() { if (!ok()) return; const t = ac.currentTime, o = out(0.7); [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(t + i * 0.11, 0.6, f, f, 0.13, "triangle", o)); },
      garden(start) {
        if (!ac) return;
        if (!start) { if (this._g) { clearInterval(this._g); this._g = 0; } return; }
        if (this._g) return;
        const notes = [523, 587, 659, 784, 880, 988, 1175];
        this._g = setInterval(() => { if (!ok()) return; const t = ac.currentTime, o = out(0.9); const f = notes[(Math.random() * notes.length) | 0]; tone(t, 1.6, f, f, 0.045, "sine", o, 0.05); if (Math.random() < 0.4) tone(t + 0.2, 1.4, f * 1.5, f * 1.5, 0.03, "sine", o, 0.05); }, 650);
      },
      ambience(start) {
        if (!ac) return;
        if (!start) { if (amb) { amb.forEach((n) => { try { n.stop(); } catch (e) {} }); amb = null; } return; }
        if (amb) return;
        const s = ac.createBufferSource(); s.buffer = nb; s.loop = true; const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 260;
        const g = ac.createGain(); g.gain.value = 0.07; const l = ac.createOscillator(); l.frequency.value = 0.07; const lg = ac.createGain(); lg.gain.value = 0.05; l.connect(lg); lg.connect(g.gain); l.start();
        s.connect(f); f.connect(g); g.connect(master); s.start();
        const d = ac.createOscillator(); d.type = "sine"; d.frequency.value = 55; const dg = ac.createGain(); dg.gain.value = 0.025; d.connect(dg); dg.connect(master); d.start();
        amb = [s, l, d];
      },
    };
  })();

  /* ---------------- Teksturalar ---------------- */
  function canvasTex(size, draw, rep = 1, srgb = true) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"); draw(g, size);
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep);
    if (srgb) t.encoding = T.sRGBEncoding; t.anisotropy = 8;
    return t;
  }
  const speck = (g, s, n, cols, r0, r1, a = 1) => { for (let i = 0; i < n; i++) { g.globalAlpha = a * rr(0.3, 1); g.fillStyle = cols[(Math.random() * cols.length) | 0]; g.beginPath(); g.arc(Math.random() * s, Math.random() * s, rr(r0, r1), 0, 6.283); g.fill(); } g.globalAlpha = 1; };
  function stoneWall(gray) {
    return (g, s) => {
      g.fillStyle = gray ? "#555" : "#3b3a36"; g.fillRect(0, 0, s, s);
      const rows = 7; let y = 0;
      for (let r = 0; r < rows; r++) {
        const h = s / rows * rr(0.85, 1.15); let x = -rr(0, 60);
        while (x < s) {
          const w = rr(60, 130), v = rr(-1, 1);
          const c = gray ? 120 + v * 50 : 0;
          g.fillStyle = gray ? `rgb(${c},${c},${c})` : `rgb(${118 + v * 22 | 0},${112 + v * 20 | 0},${100 + v * 18 | 0})`;
          g.beginPath(); const p = 4; g.moveTo(x + p, y + p); g.lineTo(x + w - p, y + p + rr(-2, 2)); g.lineTo(x + w - p + rr(-2, 2), y + h - p); g.lineTo(x + p + rr(-2, 2), y + h - p); g.closePath(); g.fill();
          if (!gray) { g.globalAlpha = 0.25; g.fillStyle = "#000"; g.fillRect(x + p, y + h - p - 5, w - 2 * p, 4); g.globalAlpha = 0.12; g.fillStyle = "#fff"; g.fillRect(x + p, y + p, w - 2 * p, 3); g.globalAlpha = 1; }
          x += w;
        }
        y += h;
      }
      if (!gray) {
        speck(g, s, 2500, ["#2c2b27", "#8a8578", "#5a564c"], 0.5, 2, 0.5);
        const gr = g.createLinearGradient(0, s * 0.62, 0, s); gr.addColorStop(0, "rgba(40,70,25,0)"); gr.addColorStop(1, "rgba(40,80,25,.75)"); g.fillStyle = gr; g.fillRect(0, 0, s, s);
        speck(g, s, 420, ["#3d6b25", "#4f7f2c", "#2f5520"], 2, 7, 0.55);
        g.strokeStyle = "rgba(20,18,15,.6)"; g.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) { let cx = Math.random() * s, cy = Math.random() * s; g.beginPath(); g.moveTo(cx, cy); for (let k = 0; k < 5; k++) { cx += rr(-18, 18); cy += rr(5, 20); g.lineTo(cx, cy); } g.stroke(); }
      } else speck(g, s, 1500, ["#333", "#999"], 0.5, 2, 0.6);
    };
  }
  function floorTex(g, s) {
    g.fillStyle = "#1d1f17"; g.fillRect(0, 0, s, s);
    const n = 3, cs = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = rr(-1, 1);
      g.fillStyle = `rgb(${92 + v * 18 | 0},${90 + v * 16 | 0},${80 + v * 14 | 0})`;
      const x = i * cs + rr(3, 8), y = j * cs + rr(3, 8), w = cs - rr(8, 14), h = cs - rr(8, 14);
      g.beginPath(); g.moveTo(x + rr(0, 6), y); g.lineTo(x + w, y + rr(0, 6)); g.lineTo(x + w - rr(0, 6), y + h); g.lineTo(x, y + h - rr(0, 6)); g.closePath(); g.fill();
    }
    speck(g, s, 2200, ["#3a3a33", "#77746a", "#55534a"], 0.5, 2, 0.5);
    speck(g, s, 160, ["#3d6b25", "#55862f"], 1, 4, 0.6);
  }

  /* ---------------- Labirint yaratish ---------------- */
  function genMaze(W, H) {
    const GW = 2 * W + 1, GH = 2 * H + 1;
    const g = Array.from({ length: GH }, () => new Array(GW).fill(1));
    const seen = Array.from({ length: H }, () => new Array(W).fill(false));
    const st = [[0, 0]]; seen[0][0] = true; g[1][1] = 0;
    while (st.length) {
      const [cx, cy] = st[st.length - 1];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [cx + dx, cy + dy, dx, dy]).filter(([x, y]) => x >= 0 && y >= 0 && x < W && y < H && !seen[y][x]);
      if (!nb.length) { st.pop(); continue; }
      const [nx, ny, dx, dy] = nb[(Math.random() * nb.length) | 0];
      g[2 * cy + 1 + dy][2 * cx + 1 + dx] = 0; g[2 * ny + 1][2 * nx + 1] = 0; seen[ny][nx] = true; st.push([nx, ny]);
    }
    // bir nechta qo'shimcha o'tish (halqalar) — labirint jonliroq
    for (let i = 0; i < Math.floor(W * H / 12); i++) {
      const x = 1 + 2 * ri(0, W - 2) + 1, y = 1 + 2 * ri(0, H - 1);
      if (x < GW - 1 && g[y][x] === 1 && g[y][x - 1] === 0 && g[y][x + 1] === 0) g[y][x] = 0;
    }
    return { g, GW, GH };
  }
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function bfs(m, sx, sy, tx, ty) {
    const prev = new Map(), key = (x, y) => y * m.GW + x, q = [[sx, sy]]; prev.set(key(sx, sy), null);
    while (q.length) { const [x, y] = q.shift(); if (x === tx && y === ty) break; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (m.g[ny] && m.g[ny][nx] === 0 && !prev.has(key(nx, ny))) { prev.set(key(nx, ny), [x, y]); q.push([nx, ny]); } }); }
    const path = []; let c = [tx, ty]; while (c) { path.unshift(c); c = prev.get(key(c[0], c[1])); }
    return path;
  }

  /* ===================================================== */
  function create(container, opts) {
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    const L = LEVELS[Math.min(LEVELS.length - 1, (opts.level || 1) - 1)];
    const maze = genMaze(L.w, L.h);
    const G = maze.g;
    const start = [1, 1], exit = [maze.GW - 2, maze.GH - 2];
    const path = bfs(maze, 1, 1, exit[0], exit[1]);

    const renderer = new T.WebGLRenderer({ antialias: !MOBILE && !LOW, powerPreference: "high-performance" });
    renderer.setPixelRatio(LOW ? 0.5 : Math.min(devicePixelRatio || 1, MOBILE ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !LOW; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.domElement.className = "lb-canvas";
    container.appendChild(renderer.domElement);
    const scene = new T.Scene();
    scene.background = new T.Color(0x0a1022);
    scene.fog = new T.FogExp2(0x0b1226, 0.055);
    const camera = new T.PerspectiveCamera(72, 1, 0.05, 300);
    camera.rotation.order = "YXZ";
    const uTime = { value: 0 };

    // Osmon: tun, yulduzlar
    const sky = new T.Mesh(new T.SphereGeometry(150, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false, uniforms: { uTime },
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec3 vD; uniform float uTime;
        float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
        void main(){ float y = max(vD.y, 0.0);
          vec3 c = mix(vec3(0.09,0.12,0.25), vec3(0.01,0.02,0.07), pow(y, 0.6));
          vec3 g = floor(vD * 260.0); float s = step(0.9965, h(g)); float tw = 0.6 + 0.4 * sin(uTime * 2.0 + h(g + 1.0) * 30.0);
          c += vec3(s * tw) * smoothstep(0.05, 0.3, y);
          vec3 md = normalize(vec3(-0.4, 0.55, -0.6)); float m = max(dot(vD, md), 0.0);
          c += vec3(0.85,0.9,1.0) * smoothstep(0.9985, 0.9992, m) + vec3(0.25,0.32,0.5) * pow(m, 30.0) * 0.6;
          gl_FragColor = vec4(c, 1.0); }`,
    }));
    scene.add(sky);

    // Yorug'lik
    scene.add(new T.HemisphereLight(0x6a7cc8, 0x1a1408, 0.55));
    const moon = new T.DirectionalLight(0x9db4ff, 0.75);
    moon.position.set(-0.4, 0.55, -0.6).multiplyScalar(60);
    const cx = (maze.GW * S) / 2, cz = (maze.GH * S) / 2;
    moon.target.position.set(cx, 0, cz); moon.position.add(moon.target.position);
    moon.castShadow = !LOW; moon.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
    const ext = Math.max(maze.GW, maze.GH) * S * 0.75;
    Object.assign(moon.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 5, far: 200 });
    moon.shadow.bias = -0.0008; moon.shadow.normalBias = 0.04;
    scene.add(moon); scene.add(moon.target);

    // Devorlar
    const wallMap = canvasTex(512, stoneWall(false)), wallBump = canvasTex(512, stoneWall(true), 1, false);
    const wallMat = new T.MeshStandardMaterial({ map: wallMap, bumpMap: wallBump, bumpScale: 0.06, roughness: 0.95 });
    const walls = [];
    for (let y = 0; y < maze.GH; y++) for (let x = 0; x < maze.GW; x++) if (G[y][x] === 1) walls.push([x, y]);
    const wGeo = new T.BoxGeometry(S, WH, S); wGeo.translate(0, WH / 2, 0);
    { const uv = wGeo.attributes.uv; for (let i = 0; i < uv.count; i++) { const f = Math.floor(i / 4); if (f !== 2 && f !== 3) uv.setY(i, uv.getY(i) * WH / S); } }
    const wallI = new T.InstancedMesh(wGeo, wallMat, walls.length);
    const wallH = new Float32Array(walls.length);
    const mtx = new T.Matrix4(), col = new T.Color();
    walls.forEach(([x, y], i) => {
      const h = WH * rr(0.92, 1.12) + (x === 0 || y === 0 || x === maze.GW - 1 || y === maze.GH - 1 ? 0.5 : 0);
      mtx.makeScale(1, h / WH, 1).setPosition(x * S, 0, y * S); wallI.setMatrixAt(i, mtx); wallH[i] = h;
      col.setHSL(0.1 + rr(-0.02, 0.03), 0.12, 0.62 + rr(-0.08, 0.08)); wallI.setColorAt(i, col);
    });
    wallI.castShadow = true; wallI.receiveShadow = true; scene.add(wallI);
    // Devor tepasidagi o't-yashil qoplama
    const capI = new T.InstancedMesh(new T.BoxGeometry(S * 1.02, 0.18, S * 1.02), new T.MeshStandardMaterial({ color: 0x2f4a22, roughness: 1 }), walls.length);
    walls.forEach(([x, y], i) => { mtx.makeTranslation(x * S, wallH[i], y * S); capI.setMatrixAt(i, mtx); });
    capI.receiveShadow = true; scene.add(capI);

    // Pol
    const fMap = canvasTex(512, floorTex, maze.GW);
    const floor = new T.Mesh(new T.PlaneGeometry(maze.GW * S, maze.GH * S), new T.MeshStandardMaterial({ map: fMap, roughness: 0.92 }));
    fMap.repeat.set(maze.GW, maze.GH);
    floor.rotation.x = -Math.PI / 2; floor.position.set((maze.GW - 1) * S / 2, 0, (maze.GH - 1) * S / 2); floor.receiveShadow = true; scene.add(floor);

    // Mash'alalar
    const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(0.25, "rgba(255,170,60,.85)"); gr.addColorStop(1, "rgba(255,80,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
    const torches = [];
    const woodMat = new T.MeshStandardMaterial({ color: 0x4a2f1a, roughness: 0.9 }), ironMat = new T.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.8, roughness: 0.4 });
    const handleGeo = new T.CylinderGeometry(0.04, 0.05, 0.55, 8), cupGeo = new T.CylinderGeometry(0.11, 0.06, 0.16, 10);
    for (let y = 1; y < maze.GH - 1; y++) for (let x = 1; x < maze.GW - 1; x++) {
      if (G[y][x] !== 0 || (x + y * 3) % 5 !== 0 || Math.random() < 0.35) continue;
      const sides = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => G[y + dy][x + dx] === 1);
      if (!sides.length) continue;
      const [dx, dy] = sides[(Math.random() * sides.length) | 0];
      const px = x * S + dx * (S / 2 - 0.16), pz = y * S + dy * (S / 2 - 0.16);
      const grp = new T.Group(); grp.position.set(px, 2.15, pz);
      const hd = new T.Mesh(handleGeo, woodMat); hd.rotation.z = dx * 0.35; hd.rotation.x = -dy * 0.35; grp.add(hd);
      const cup = new T.Mesh(cupGeo, ironMat); cup.position.set(-dx * 0.1, 0.3, -dy * 0.1); grp.add(cup);
      const fl = new T.Sprite(new T.SpriteMaterial({ map: glowTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
      fl.position.set(-dx * 0.1, 0.55, -dy * 0.1); fl.scale.set(0.55, 0.85, 1); grp.add(fl);
      const halo = new T.Sprite(new T.SpriteMaterial({ map: glowTex, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
      halo.position.copy(fl.position); halo.scale.set(2.4, 2.4, 1); grp.add(halo);
      scene.add(grp);
      torches.push({ pos: new T.Vector3(px - dx * 0.3, 2.75, pz - dy * 0.3), fl, halo, ph: Math.random() * 10 });
    }
    const lights = [];
    const NL = LOW ? 2 : MOBILE ? 4 : 7;
    for (let i = 0; i < NL; i++) { const l = new T.PointLight(0xff9a45, 0, 10, 1.8); scene.add(l); lights.push(l); }

    // Uchqun va chang zarralari
    const dustN = LOW ? 200 : 700, dpos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) { dpos[i * 3] = rr(0, maze.GW * S); dpos[i * 3 + 1] = rr(0.2, 3.5); dpos[i * 3 + 2] = rr(0, maze.GH * S); }
    const dGeo = new T.BufferGeometry(); dGeo.setAttribute("position", new T.BufferAttribute(dpos, 3));
    const dust = new T.Points(dGeo, new T.PointsMaterial({ color: 0xffd9a0, size: 0.07, map: glowTex, transparent: true, opacity: 0.55, depthWrite: false, blending: T.AdditiveBlending }));
    scene.add(dust);

    // Darvozalar (savol): oddiy (ko'k), qo'rqinchli (qizil ko'zlar), yoqimli (oltin gullar)
    const MOOD = {
      normal: { col: "#5ef2ff", light: 0x5ef2ff, stone: 0x6f7fa8, em: 0x0a2a3a, sym: "?" },
      scary: { col: "#ff2b2b", light: 0xff2020, stone: 0x3a2a2e, em: 0x2a0000, sym: "eye" },
      nice: { col: "#ffd34d", light: 0xffc94a, stone: 0xb8a36a, em: 0x2a1e00, sym: "flower" },
    };
    const runeTexOf = (m) => canvasTex(256, (g, s) => {
      const c = MOOD[m].col;
      g.fillStyle = "#000"; g.fillRect(0, 0, s, s);
      g.strokeStyle = c; g.shadowColor = c; g.shadowBlur = 18; g.lineWidth = 6;
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, 6.283); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.arc(s / 2, s / 2, s * 0.43, 0, 6.283); g.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; g.beginPath(); g.moveTo(s / 2 + Math.cos(a) * s * 0.38, s / 2 + Math.sin(a) * s * 0.38); g.lineTo(s / 2 + Math.cos(a) * s * 0.42, s / 2 + Math.sin(a) * s * 0.42); g.stroke(); }
      g.fillStyle = c;
      if (MOOD[m].sym === "eye") { // qo'rqinchli ko'z
        g.beginPath(); g.ellipse(s / 2, s / 2, 62, 30, 0, 0, 6.283); g.fill(); g.fillStyle = "#000"; g.beginPath(); g.ellipse(s / 2, s / 2, 10, 26, 0, 0, 6.283); g.fill();
        g.strokeStyle = c; g.lineWidth = 4; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(s / 2 + i * 22, s / 2 - 34); g.lineTo(s / 2 + i * 26, s / 2 - 52); g.stroke(); }
      } else if (MOOD[m].sym === "flower") { // yoqimli gul
        for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; g.beginPath(); g.ellipse(s / 2 + Math.cos(a) * 30, s / 2 + Math.sin(a) * 30, 24, 14, a, 0, 6.283); g.fill(); }
        g.fillStyle = "#fff8d0"; g.beginPath(); g.arc(s / 2, s / 2, 18, 0, 6.283); g.fill();
      } else { g.fillStyle = "#aaf8ff"; g.font = "900 120px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", s / 2, s / 2 + 8); }
    }, 1);
    const GM = {};
    Object.keys(MOOD).forEach((m) => {
      GM[m] = {
        stone: new T.MeshStandardMaterial({ map: wallMap, color: MOOD[m].stone, roughness: 0.55, metalness: 0.15, bumpMap: wallBump, bumpScale: 0.05, emissive: MOOD[m].em, emissiveIntensity: 0.7 }),
        rune: new T.MeshBasicMaterial({ map: runeTexOf(m), blending: T.AdditiveBlending, transparent: true, depthWrite: false }),
      };
    });
    const eyesTex = canvasTex(128, (g, s) => {
      [[40, 64], [88, 64]].forEach(([x, y]) => { const gr = g.createRadialGradient(x, y, 0, x, y, 22); gr.addColorStop(0, "rgba(255,255,200,1)"); gr.addColorStop(0.25, "rgba(255,40,20,.95)"); gr.addColorStop(1, "rgba(255,0,0,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 22, 12, 0, 0, 6.283); g.fill(); });
    }, 1);
    const gates = [];
    const step = Math.max(4, Math.floor((path.length - 6) / (L.gates + 1)));
    for (let k = 1; k <= L.gates; k++) {
      let idx = Math.min(path.length - 4, 3 + k * step);
      // koridor bo'lgan katakni topamiz (ikki qarama-qarshi tomon ochiq)
      for (let tries = 0; tries < 6; tries++) {
        const [x, y] = path[idx];
        const horiz = G[y][x - 1] === 0 && G[y][x + 1] === 0 && G[y - 1][x] === 1 && G[y + 1][x] === 1;
        const vert = G[y - 1][x] === 0 && G[y + 1][x] === 0 && G[y][x - 1] === 1 && G[y][x + 1] === 1;
        if ((horiz || vert) && !gates.some((g) => Math.abs(g.x - x) + Math.abs(g.y - y) < 3)) {
          const grp = new T.Group();
          const mood = k === 1 ? "normal" : Math.random() < 0.38 ? "scary" : Math.random() < 0.55 ? "nice" : "normal";
          const slab = new T.Mesh(new T.BoxGeometry(S * 0.98, WH * 0.95, 0.5), GM[mood].stone); slab.position.y = WH * 0.475; slab.castShadow = true; slab.receiveShadow = true; grp.add(slab);
          [1, -1].forEach((sd) => { const r = new T.Mesh(new T.PlaneGeometry(1.7, 1.7), GM[mood].rune); r.position.set(0, 1.75, sd * 0.26); if (sd < 0) r.rotation.y = Math.PI; grp.add(r); });
          let eyes = null;
          if (mood === "scary") { eyes = new T.Sprite(new T.SpriteMaterial({ map: eyesTex, blending: T.AdditiveBlending, transparent: true, depthWrite: false })); eyes.position.set(0, WH + 0.5, 0); eyes.scale.set(1.6, 1.6, 1); grp.add(eyes); }
          if (horiz) grp.rotation.y = Math.PI / 2;
          grp.position.set(x * S, -WH - 0.2, y * S);
          scene.add(grp);
          const gl = new T.PointLight(MOOD[mood].light, 0, 7, 2); gl.position.set(x * S, 1.8, y * S); scene.add(gl);
          gates.push({ x, y, grp, light: gl, state: "hidden", t: 0, q: null, tries: 0, mood, eyes });
          break;
        }
        idx = Math.min(path.length - 4, idx + 1);
      }
    }
    // Xazina sandiqlari (boshi berk yo'laklarda)
    const deadEnds = [];
    for (let y = 1; y < maze.GH - 1; y++) for (let x = 1; x < maze.GW - 1; x++) {
      if (G[y][x] !== 0 || (x === start[0] && y === start[1]) || (x === exit[0] && y === exit[1])) continue;
      const open = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => G[y + dy][x + dx] === 0);
      if (open.length === 1) deadEnds.push([x, y, open[0]]);
    }
    deadEnds.sort(() => Math.random() - 0.5);
    const chests = [];
    const goldMat = new T.MeshStandardMaterial({ color: 0xd4a72c, metalness: 0.9, roughness: 0.3, emissive: 0x3a2600 });
    const chestWood = new T.MeshStandardMaterial({ color: 0x6b3f1d, roughness: 0.75 });
    deadEnds.slice(0, L.chests).forEach(([x, y, [dx, dy]]) => {
      const grp = new T.Group();
      const base = new T.Mesh(new T.BoxGeometry(0.9, 0.5, 0.6), chestWood); base.position.y = 0.25; base.castShadow = true; grp.add(base);
      const lidG = new T.Group(); lidG.position.set(0, 0.5, -0.3);
      const lid = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.9, 14, 1, false, 0, Math.PI), chestWood); lid.rotation.z = Math.PI / 2; lid.position.z = 0.3; lid.castShadow = true; lidG.add(lid);
      grp.add(lidG);
      [-0.3, 0.3].forEach((bx) => { const b = new T.Mesh(new T.BoxGeometry(0.07, 0.52, 0.62), goldMat); b.position.set(bx, 0.26, 0); grp.add(b); });
      const lock = new T.Mesh(new T.BoxGeometry(0.12, 0.14, 0.05), goldMat); lock.position.set(0, 0.45, 0.31); grp.add(lock);
      const glow = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xffd34d, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 }));
      glow.position.y = 0.6; glow.scale.setScalar(1.8); grp.add(glow);
      grp.position.set(x * S - dx * 0.6, 0, y * S - dy * 0.6);
      grp.rotation.y = Math.atan2(dx, dy) + Math.PI;
      scene.add(grp);
      chests.push({ x, y, grp, lidG, glow, open: false, q: null, asked: false });
    });

    // Chiqish portali
    const portal = new T.Group();
    portal.position.set(exit[0] * S, 0, exit[1] * S);
    const arch = new T.MeshStandardMaterial({ map: wallMap, color: 0x9c8fb8, roughness: 0.7 });
    [-1.2, 1.2].forEach((px) => { const p = new T.Mesh(new T.BoxGeometry(0.45, 3.4, 0.45), arch); p.position.set(px, 1.7, 0); p.castShadow = true; portal.add(p); });
    const top = new T.Mesh(new T.BoxGeometry(3.0, 0.45, 0.55), arch); top.position.y = 3.55; portal.add(top);
    const portalMat = (ca, cb) => new T.ShaderMaterial({
      transparent: true, side: T.DoubleSide, depthWrite: false, uniforms: { uTime, uA: { value: new T.Color(ca) }, uB: { value: new T.Color(cb) } },
      vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec2 vU; uniform float uTime; uniform vec3 uA; uniform vec3 uB;
        void main(){ vec2 p = vU * 2.0 - 1.0; p.y *= 0.72; float r = length(p); float a = atan(p.y, p.x);
          float sw = sin(a * 5.0 + r * 14.0 - uTime * 4.0) * 0.5 + 0.5;
          vec3 c = mix(uA, uB, sw) * (1.4 - r);
          c += vec3(1.0) * smoothstep(0.25, 0.0, r) * 0.8;
          float alpha = smoothstep(1.0, 0.75, r) * (0.75 + 0.25 * sw);
          gl_FragColor = vec4(c, alpha); }`,
    });
    const pMat = portalMat(0x5a1ae6, 0x33f2ff);
    const disc = new T.Mesh(new T.PlaneGeometry(2.0, 3.0), pMat); disc.position.y = 1.65; portal.add(disc);
    const pl = new T.PointLight(0x8a6cff, 2.2, 12, 1.6); pl.position.y = 1.8; portal.add(pl);
    // Portalga qaratish (koridor yo'nalishi bo'yicha)
    const op = [[1, 0], [-1, 0], [0, 1], [0, -1]].find(([dx, dy]) => G[exit[1] + dy][exit[0] + dx] === 0) || [0, -1];
    portal.rotation.y = Math.atan2(op[0], op[1]);
    scene.add(portal);
    const pN = 120, ppos = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) { ppos[i * 3] = rr(-1, 1); ppos[i * 3 + 1] = rr(0, 3.4); ppos[i * 3 + 2] = rr(-0.4, 0.4); }
    const pGeo = new T.BufferGeometry(); pGeo.setAttribute("position", new T.BufferAttribute(ppos, 3));
    const pParts = new T.Points(pGeo, new T.PointsMaterial({ color: 0xb8a6ff, size: 0.1, map: glowTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    portal.add(pParts);


    /* ---------------- Sirli portal va Sirli bog' ---------------- */
    const PRIZES = [
      { id: "crystal", name: "Sehrli kristall", icon: "💎", col: 0x5ef2ff }, { id: "crown", name: "Bilim toji", icon: "👑", col: 0xffd34d },
      { id: "cup", name: "Oltin kubok", icon: "🏆", col: 0xffc94a }, { id: "star", name: "Yulduz nishoni", icon: "⭐", col: 0xfff07a },
      { id: "book", name: "Donolik kitobi", icon: "📘", col: 0x7ab8ff }, { id: "key", name: "Oltin kalit", icon: "🗝️", col: 0xffd34d },
      { id: "orb", name: "Sehrli shar", icon: "🔮", col: 0xc58cff }, { id: "medal", name: "Zakovat medali", icon: "🏅", col: 0xffb14a },
    ];
    const owned = new Set(opts.owned || []);
    let secret = null, sportal = null;
    const spot = deadEnds[L.chests];
    if (spot) {
      const [sx, sy, [sdx, sdy]] = spot;
      sportal = new T.Group();
      const vine = new T.MeshStandardMaterial({ map: wallMap, color: 0x7fa86a, roughness: 0.8 });
      [-0.9, 0.9].forEach((px) => { const p = new T.Mesh(new T.CylinderGeometry(0.16, 0.2, 2.8, 10), vine); p.position.set(px, 1.4, 0); portal.castShadow = true; sportal.add(p); });
      const arc = new T.Mesh(new T.TorusGeometry(0.9, 0.16, 8, 24, Math.PI), vine); arc.position.y = 2.8; sportal.add(arc);
      const sd = new T.Mesh(new T.PlaneGeometry(1.6, 2.7), portalMat(0xffb23a, 0x6dff9a)); sd.position.y = 1.5; sportal.add(sd);
      const sl = new T.PointLight(0xffd36a, 1.6, 8, 1.8); sl.position.y = 1.6; sportal.add(sl);
      sportal.position.set(sx * S - sdx * 0.9, 0, sy * S - sdy * 0.9);
      sportal.rotation.y = Math.atan2(sdx, sdy);
      scene.add(sportal);
      sportal.userData = { x: sx, y: sy, back: [sx * S + sdx * 0.6, sy * S + sdy * 0.6], light: sl };
      secret = buildSecret();
    }
    function buildSecret() {
      const RX = (maze.GW + 16) * S, RZ = (maze.GH / 2) * S, RAD = 9.5;
      const grp = new T.Group(); grp.position.set(RX, 0, RZ); scene.add(grp);
      const gTex = canvasTex(512, (g, s) => {
        g.fillStyle = "#2d5a24"; g.fillRect(0, 0, s, s);
        speck(g, s, 3500, ["#3a7030", "#24491d", "#4c8a3a", "#5d9e45"], 1, 4, 0.7);
        speck(g, s, 260, ["#ff8fc7", "#ffe36b", "#9ad3ff", "#ffffff", "#c59bff"], 2, 4, 0.95);
      }, 6);
      const fl = new T.Mesh(new T.CircleGeometry(RAD + 1.5, 64), new T.MeshStandardMaterial({ map: gTex, roughness: 1 }));
      fl.rotation.x = -Math.PI / 2; fl.position.y = 0.01; fl.receiveShadow = true; grp.add(fl);
      const hedgeTex = canvasTex(256, (g, s) => { g.fillStyle = "#1f4a1a"; g.fillRect(0, 0, s, s); speck(g, s, 2600, ["#2f6a26", "#173a12", "#3f8030", "#56993d"], 2, 7, 0.9); speck(g, s, 70, ["#ff9fd0", "#fff07a"], 2, 4, 1); }, 1);
      hedgeTex.repeat.set(12, 1);
      const hedge = new T.Mesh(new T.CylinderGeometry(RAD + 1.2, RAD + 1.2, 3.2, 64, 1, true), new T.MeshStandardMaterial({ map: hedgeTex, side: T.BackSide, roughness: 1 }));
      hedge.position.y = 1.6; grp.add(hedge);
      const stoneM = new T.MeshStandardMaterial({ map: wallMap, color: 0xd8cfe6, roughness: 0.6 });
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; const pl = new T.Mesh(new T.CylinderGeometry(0.28, 0.34, 3.6, 12), stoneM); pl.position.set(Math.cos(a) * (RAD + 0.4), 1.8, Math.sin(a) * (RAD + 0.4)); pl.castShadow = true; grp.add(pl); }
      // Gullar
      const fN = LOW ? 120 : 320;
      const flowerI = new T.InstancedMesh(new T.SphereGeometry(0.09, 8, 6), new T.MeshStandardMaterial({ roughness: 0.6, emissive: 0x111111 }), fN);
      const stemI = new T.InstancedMesh(new T.CylinderGeometry(0.012, 0.012, 0.35, 4), new T.MeshStandardMaterial({ color: 0x2f7a2a }), fN);
      const fcols = [0xff8fc7, 0xffe36b, 0x9ad3ff, 0xffffff, 0xc59bff, 0xff9f5a];
      for (let i = 0; i < fN; i++) {
        const a = Math.random() * 6.283, r = 2 + Math.random() * (RAD - 2.3), h = rr(0.25, 0.45);
        mtx.makeTranslation(Math.cos(a) * r, h, Math.sin(a) * r); flowerI.setMatrixAt(i, mtx); flowerI.setColorAt(i, new T.Color(fcols[i % fcols.length]));
        mtx.makeTranslation(Math.cos(a) * r, h / 2, Math.sin(a) * r); stemI.setMatrixAt(i, mtx);
      }
      grp.add(flowerI); grp.add(stemI);
      // Markazdagi katta sehrli kristall
      const big = new T.Mesh(new T.OctahedronGeometry(0.8, 0), new T.MeshStandardMaterial({ color: 0x9ef7ff, emissive: 0x2ac8ff, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.85 }));
      big.position.y = 2.6; big.scale.y = 1.6; grp.add(big);
      const bigGlow = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0x7ff0ff, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 })); bigGlow.position.y = 2.6; bigGlow.scale.setScalar(5); grp.add(bigGlow);
      const lA = new T.PointLight(0x7ff0ff, 2.2, 16, 1.6); lA.position.set(0, 3, 0); grp.add(lA);
      const lB = new T.PointLight(0xff8fd0, 1.4, 14, 1.6); lB.position.set(-5, 2.5, 3); grp.add(lB);
      const lC = new T.PointLight(0xffd36a, 1.4, 14, 1.6); lC.position.set(5, 2.5, 3); grp.add(lC);
      // Yorug' qo'ng'izlar
      const ffN = LOW ? 60 : 160, ffp = new Float32Array(ffN * 3), ffs = [];
      for (let i = 0; i < ffN; i++) { const a = Math.random() * 6.283, r = Math.random() * RAD; ffp[i * 3] = Math.cos(a) * r; ffp[i * 3 + 1] = rr(0.3, 3.2); ffp[i * 3 + 2] = Math.sin(a) * r; ffs.push(Math.random() * 10); }
      const ffg = new T.BufferGeometry(); ffg.setAttribute("position", new T.BufferAttribute(ffp, 3));
      const flies = new T.Points(ffg, new T.PointsMaterial({ color: 0xd8ff7a, size: 0.14, map: glowTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      grp.add(flies);
      // Yutuq ustunlari (3 ta) va topshiriqlar
      const free = PRIZES.filter((p) => !owned.has(p.id)).sort(() => Math.random() - 0.5);
      const pool = free.concat(PRIZES.filter((p) => owned.has(p.id)).sort(() => Math.random() - 0.5)).slice(0, 3);
      const types = ["streak3", "timed", "seq", "riddle"].sort(() => Math.random() - 0.5);
      const peds = pool.map((prize, i) => {
        const a = Math.PI / 2 + (i - 1) * 0.85, r = 5.2;
        const pg = new T.Group(); pg.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        const ped = new T.Mesh(new T.CylinderGeometry(0.45, 0.6, 1.1, 16), stoneM); ped.position.y = 0.55; ped.castShadow = true; pg.add(ped);
        const cap = new T.Mesh(new T.CylinderGeometry(0.55, 0.5, 0.12, 16), new T.MeshStandardMaterial({ color: 0xd4a72c, metalness: 0.8, roughness: 0.3 })); cap.position.y = 1.16; pg.add(cap);
        const item = prizeMesh(prize); item.position.y = 1.75; pg.add(item);
        const gl = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: prize.col, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 })); gl.position.y = 1.75; gl.scale.setScalar(1.9); pg.add(gl);
        grp.add(pg);
        const type = types[i];
        const task = { type, title: { streak3: "Ketma-ket 3 ta to‘g‘ri javob bering", timed: "20 soniyada javob bering", seq: "Sonlar sirini toping", riddle: "Topishmoqni yeching" }[type], got: 0, q: null, deadline: 0 };
        return { prize, pg, item, gl, task, taken: false, wx: RX + pg.position.x, wz: RZ + pg.position.z };
      });
      // Qaytish portali
      const back = new T.Group(); back.position.set(0, 0, -RAD + 0.6);
      [-0.9, 0.9].forEach((px) => { const p = new T.Mesh(new T.CylinderGeometry(0.16, 0.2, 2.8, 10), stoneM); p.position.set(px, 1.4, 0); back.add(p); });
      const bd = new T.Mesh(new T.PlaneGeometry(1.6, 2.7), portalMat(0x6dff9a, 0x5ef2ff)); bd.position.y = 1.5; back.add(bd);
      grp.add(back);
      return { RX, RZ, RAD, grp, peds, big, bigGlow, flies, ffs, ffN, back: { x: RX, z: RZ - RAD + 0.6 }, spawn: { x: RX, z: RZ - RAD + 2.4, yaw: Math.PI } };
    }
    function prizeMesh(p) {
      const M = new T.MeshStandardMaterial({ color: p.col, metalness: 0.85, roughness: 0.25, emissive: p.col, emissiveIntensity: 0.25 });
      const g = new T.Group();
      if (p.id === "crystal") { const m = new T.Mesh(new T.OctahedronGeometry(0.32, 0), new T.MeshStandardMaterial({ color: 0x9ef7ff, emissive: 0x2ac8ff, emissiveIntensity: 0.8, transparent: true, opacity: 0.9, roughness: 0.1 })); m.scale.y = 1.5; g.add(m); }
      else if (p.id === "crown") { const b = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.18, 20, 1, true), M); g.add(b); for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283; const c = new T.Mesh(new T.ConeGeometry(0.07, 0.2, 6), M); c.position.set(Math.cos(a) * 0.3, 0.18, Math.sin(a) * 0.3); g.add(c); } }
      else if (p.id === "cup") { const c = new T.Mesh(new T.CylinderGeometry(0.26, 0.12, 0.34, 18), M); c.position.y = 0.12; g.add(c); const st2 = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.2, 8), M); st2.position.y = -0.14; g.add(st2); const bs = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.05, 16), M); bs.position.y = -0.25; g.add(bs); [-1, 1].forEach((k) => { const h = new T.Mesh(new T.TorusGeometry(0.1, 0.025, 6, 12), M); h.position.set(k * 0.28, 0.14, 0); h.rotation.y = Math.PI / 2; g.add(h); }); }
      else if (p.id === "star" || p.id === "medal") { const sh = new T.Shape(); for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283 - Math.PI / 2, r = i % 2 ? 0.14 : 0.32; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); } const m = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }), M); m.geometry.center(); g.add(m); if (p.id === "medal") { const r = new T.Mesh(new T.TorusGeometry(0.36, 0.03, 6, 24), M); g.add(r); } }
      else if (p.id === "book") { const b = new T.Mesh(new T.BoxGeometry(0.42, 0.52, 0.12), new T.MeshStandardMaterial({ color: 0x2f5fd0, roughness: 0.5 })); g.add(b); const pg = new T.Mesh(new T.BoxGeometry(0.38, 0.48, 0.13), new T.MeshStandardMaterial({ color: 0xf3ead2 })); pg.position.x = 0.03; g.add(pg); const e = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.14), M); g.add(e); }
      else if (p.id === "key") { const r = new T.Mesh(new T.TorusGeometry(0.12, 0.035, 8, 18), M); r.position.y = 0.2; g.add(r); const sh2 = new T.Mesh(new T.BoxGeometry(0.06, 0.42, 0.06), M); sh2.position.y = -0.08; g.add(sh2); [-0.2, -0.28].forEach((y) => { const t = new T.Mesh(new T.BoxGeometry(0.12, 0.05, 0.06), M); t.position.set(0.07, y, 0); g.add(t); }); }
      else { const m = new T.Mesh(new T.SphereGeometry(0.3, 24, 16), new T.MeshStandardMaterial({ color: 0xc58cff, emissive: 0x7a2ad0, emissiveIntensity: 0.7, transparent: true, opacity: 0.85, roughness: 0.05 })); g.add(m); }
      return g;
    }

    /* ---------------- O'yinchi ---------------- */
    const me = { x: start[0] * S, z: start[1] * S, yaw: 0, pitch: 0, vx: 0, vz: 0, bob: 0, stepT: 0 };
    { const d = [[1, 0], [0, 1]].find(([dx, dy]) => G[start[1] + dy][start[0] + dx] === 0) || [1, 0]; me.yaw = Math.atan2(-d[0], -d[1]); }
    const st = { hearts: 3, score: 0, gatesOpen: 0, chestsOpen: 0, t0: 0, time: 0, done: false, started: false, shake: 0, active: null, zone: "maze", red: 0, prizes: 0, moanT: 25, warpT: 0 };
    const fogBase = scene.fog.color.clone(), fogRed = new T.Color(0x3a0606), fogGarden = new T.Color(0x16283a);
    const seen = Array.from({ length: maze.GH }, () => new Array(maze.GW).fill(false));

    const isBlock = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= maze.GW || ty >= maze.GH) return true;
      if (G[ty][tx] === 1) return true;
      const g = gates.find((q) => q.x === tx && q.y === ty);
      return !!g && g.state !== "open";
    };
    function collide() {
      const tx = Math.round(me.x / S), ty = Math.round(me.z / S);
      for (let pass = 0; pass < 2; pass++) for (let y = ty - 1; y <= ty + 1; y++) for (let x = tx - 1; x <= tx + 1; x++) {
        if (!isBlock(x, y)) continue;
        const g = gates.find((q) => q.x === x && q.y === y);
        let x0 = x * S - S / 2, x1 = x * S + S / 2, z0 = y * S - S / 2, z1 = y * S + S / 2;
        if (g && G[y][x] === 0) { // darvoza — yupqa plita
          const horiz = G[y][x - 1] === 0;
          if (horiz) { x0 = x * S - 0.3; x1 = x * S + 0.3; } else { z0 = y * S - 0.3; z1 = y * S + 0.3; }
        }
        const nx = clamp(me.x, x0, x1), nz = clamp(me.z, z0, z1);
        const dx = me.x - nx, dz = me.z - nz, d2 = dx * dx + dz * dz;
        if (d2 < R * R && d2 > 1e-9) { const d = Math.sqrt(d2), k = (R - d) / d; me.x += dx * k; me.z += dz * k; }
      }
    }

    /* ---------------- HUD ---------------- */
    const hud = document.createElement("div");
    hud.className = "lb-hud";
    hud.innerHTML = `
      <div class="lb-top"><div class="lb-chip"><b data-lv>${opts.level}-daraja</b><small data-tm>0:00</small></div>
        <div class="lb-chip"><span data-hp>❤️❤️❤️</span></div><div class="lb-chip">⭐ <b data-sc>0</b></div>
        <div class="lb-chip">🚪 <b data-gt>0/${gates.length}</b></div>${secret ? `<div class="lb-chip">🎁 <b data-pz>0</b></div>` : ""}</div>
      <canvas class="lb-map" data-map width="300" height="300" title="Xarita (M)"></canvas>
      <div class="lb-cross"></div>
      <div class="lb-hint" data-hint></div>
      <form class="lb-q" data-q hidden autocomplete="off"><div class="lb-q-rune">❔</div><div class="lb-q-body">
        <small data-qk>Darvoza savoli</small><b data-qt></b>
        <div class="lb-q-row"><input data-qi type="text" inputmode="text" enterkeyhint="done" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Javobni yozing va Enter bosing"><button type="submit">✔</button></div>
        <em data-qm></em></div></form>
      <div class="lb-over" data-over hidden></div>
      <div class="lb-flash" data-flash></div>
      ${MOBILE ? `<div class="lb-joy" data-joy><i></i></div>` : ""}
      <button class="lb-btn menu" data-b="menu" type="button">☰</button><button class="lb-btn mapb" data-b="map" type="button">🗺️</button>`;
    container.appendChild(hud);
    const $ = (s) => hud.querySelector(s);
    const ui = { lv: $("[data-lv]"), tm: $("[data-tm]"), hp: $("[data-hp]"), sc: $("[data-sc]"), gt: $("[data-gt]"), map: $("[data-map]"), hint: $("[data-hint]"), q: $("[data-q]"), qt: $("[data-qt]"), qk: $("[data-qk]"), qi: $("[data-qi]"), qm: $("[data-qm]"), over: $("[data-over]"), flash: $("[data-flash]"), pz: $("[data-pz]") };
    const mctx = ui.map.getContext("2d");
    let bigMap = false;

    function flash(c) { ui.flash.style.background = c; ui.flash.classList.remove("on"); void ui.flash.offsetWidth; ui.flash.classList.add("on"); }
    function hint(t, ms = 2600) { ui.hint.textContent = t; ui.hint.classList.add("on"); clearTimeout(hint.t); hint.t = setTimeout(() => ui.hint.classList.remove("on"), ms); }

    const newTaskQ = (task) => task.type === "seq" ? Q.seq() : task.type === "riddle" ? Q.riddle() : Q.make(opts.grade);
    function ask(target, kind) {
      st.active = { target, kind };
      if (kind === "task") {
        const tk = target.task;
        if (!tk.q) tk.q = newTaskQ(tk);
        if (tk.type === "timed") tk.deadline = performance.now() + 20000;
        target.q = tk.q;
      }
      if (!target.q) target.q = Q.make(opts.grade);
      ui.q.hidden = false;
      ui.q.className = "lb-q" + (kind === "gate" ? " m-" + target.mood : kind === "task" ? " m-task" : " m-chest");
      ui.qk.textContent = kind === "gate" ? (target.mood === "scary" ? "😱 Qorong‘i darvoza — jasorat bilan javob bering!" : target.mood === "nice" ? "✨ Oltin darvoza — yoqimli savol (+150 ⭐)" : "🚪 Darvoza savoli — to‘g‘ri javob yo‘lni ochadi")
        : kind === "task" ? `🎁 ${target.prize.icon} ${target.prize.name} — ${target.task.title}` : "💰 Xazina sandig‘i — to‘g‘ri javob +50 ⭐";
      ui.qt.textContent = target.q.q; ui.qm.textContent = kind === "task" && target.task.type === "streak3" ? `Natija: ${target.task.got}/3` : target.q.hint || "";
      ui.qi.value = "";
      ui.qi.inputMode = /^[\d\s+\-×:=?().√²x%/ninghqismiechaga teng]+$/i.test(target.q.q) && /\d/.test(target.q.q) ? "text" : "text";
      setTimeout(() => { try { ui.qi.focus({ preventScroll: true }); } catch (e) { ui.qi.focus(); } }, 60);
    }
    function closeAsk() { st.active = null; ui.q.hidden = true; ui.qi.blur(); }
    ui.q.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = st.active; if (!a) return;
      const v = ui.qi.value.trim(); if (!v) return;
      if (a.kind === "task") { onTaskAnswer(a.target, Q.check(a.target.q, v)); return; }
      if (Q.check(a.target.q, v)) {
        Snd.good(); flash("rgba(80,255,200,.35)");
        if (a.kind === "gate") { a.target.state = "sinking"; a.target.t = 0; st.gatesOpen++; st.score += a.target.tries ? 60 : a.target.mood === "nice" ? 150 : a.target.mood === "scary" ? 120 : 100; Snd.sink(); hint(a.target.mood === "scary" ? "💪 Barakalla! Qorong‘i darvoza yengildi" : "✅ To‘g‘ri! Darvoza ochildi"); if (a.target.mood === "nice") burstAt(a.target.x * S, 1.5, a.target.y * S, 0xffd34d, 60); if (a.target.eyes) a.target.eyes.visible = false; }
        else { a.target.open = true; st.chestsOpen++; st.score += 50; Snd.coin(); hint("💰 +50 ⭐ Xazina topildi!"); burstGold(a.target); }
        closeAsk();
      } else {
        Snd.bad(); flash("rgba(255,60,60,.35)");
        ui.q.classList.remove("shake"); void ui.q.offsetWidth; ui.q.classList.add("shake");
        if (a.kind === "gate") {
          st.hearts--; a.target.tries++;
          const right = a.target.q.a[0];
          ui.qm.textContent = `❌ Noto‘g‘ri. To‘g‘ri javob: ${right}. Yangi savol!`;
          if (st.hearts <= 0) { lose(); return; }
          setTimeout(() => { if (st.active && st.active.target === a.target) { a.target.q = Q.make(opts.grade); ui.qt.textContent = a.target.q.q; ui.qi.value = ""; } }, 1400);
        } else { ui.qm.textContent = `❌ Noto‘g‘ri (to‘g‘ri javob: ${a.target.q.a[0]}). Sandiq yopildi.`; a.target.asked = true; setTimeout(closeAsk, 1600); }
      }
    });

    function onTaskAnswer(ped, ok) {
      const tk = ped.task;
      if (ok) {
        Snd.good(); flash("rgba(255,220,120,.35)");
        if (tk.type === "streak3" && ++tk.got < 3) { tk.q = newTaskQ(tk); ped.q = tk.q; ui.qt.textContent = tk.q.q; ui.qm.textContent = `✅ To‘g‘ri! Natija: ${tk.got}/3`; ui.qi.value = ""; return; }
        ped.taken = true; st.prizes++; st.score += 200;
        Snd.prize(); burstAt(ped.wx, 1.8, ped.wz, ped.prize.col, 70);
        hint(`🏆 Yangi yutuq: ${ped.prize.icon} ${ped.prize.name}! +200 ⭐`, 3500);
        if (opts.onAchieve) opts.onAchieve(ped.prize);
        closeAsk();
      } else {
        Snd.bad(); ui.q.classList.remove("shake"); void ui.q.offsetWidth; ui.q.classList.add("shake");
        const right = tk.q.a[0];
        if (tk.type === "streak3") tk.got = 0;
        ui.qm.textContent = `❌ Noto‘g‘ri (javob: ${right}). ${tk.type === "streak3" ? "Hisob 0 dan boshlanadi. " : ""}Yangi savol!`;
        setTimeout(() => { if (st.active && st.active.target === ped) { tk.q = newTaskQ(tk); ped.q = tk.q; if (tk.type === "timed") tk.deadline = performance.now() + 20000; ui.qt.textContent = tk.q.q; ui.qi.value = ""; } }, 1500);
      }
    }
    function burstAt(x, y, z, color, n = 40) {
      const pos = new Float32Array(n * 3), vel = [];
      for (let i = 0; i < n; i++) { pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; vel.push(new T.Vector3(rr(-1.6, 1.6), rr(1.5, 4.5), rr(-1.6, 1.6))); }
      const g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(pos, 3));
      const p = new T.Points(g, new T.PointsMaterial({ color, size: 0.1, map: glowTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(p); gold.push({ p, vel, t: 0 });
    }
    function warp(to) {
      st.warpT = 0.8; Snd.warp(); flash("rgba(255,255,255,.95)"); closeAsk();
      (() => {
        if (to === "secret") { st.zone = "secret"; me.x = secret.spawn.x; me.z = secret.spawn.z; me.yaw = secret.spawn.yaw; me.pitch = 0; Snd.garden(true); hint("✨ Sirli bog‘! Ustunlardagi yutuqlarni topshiriq bajarib oling.", 4200); }
        else { st.zone = "maze"; const b = sportal.userData.back; me.x = b[0]; me.z = b[1]; Snd.garden(false); hint("🧭 Labirintga qaytdingiz. Chiqish portalini toping!"); }
        me.vx = 0; me.vz = 0;
      })();
    }
    const gold = [];
    function burstGold(c) {
      const n = 40, pos = new Float32Array(n * 3), vel = [];
      for (let i = 0; i < n; i++) { pos[i * 3] = c.grp.position.x; pos[i * 3 + 1] = 0.6; pos[i * 3 + 2] = c.grp.position.z; vel.push(new T.Vector3(rr(-1.5, 1.5), rr(2, 4.5), rr(-1.5, 1.5))); }
      const g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(pos, 3));
      const p = new T.Points(g, new T.PointsMaterial({ color: 0xffd34d, size: 0.09, map: glowTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(p); gold.push({ p, vel, t: 0 });
    }

    function drawMap() {
      const W = maze.GW, H = maze.GH, cv = ui.map, c = mctx;
      const sz = cv.width, k = sz / Math.max(W, H);
      c.clearRect(0, 0, sz, sz);
      if (st.zone === "secret") {
        const gr = c.createRadialGradient(sz / 2, sz / 2, 10, sz / 2, sz / 2, sz / 2); gr.addColorStop(0, "rgba(60,120,70,.9)"); gr.addColorStop(1, "rgba(10,30,20,.9)");
        c.fillStyle = gr; c.fillRect(0, 0, sz, sz);
        c.font = "900 30px system-ui"; c.textAlign = "center"; c.fillStyle = "#fff"; c.fillText("✨ Sirli bog‘", sz / 2, sz / 2 - 10);
        c.font = "700 22px system-ui"; c.fillStyle = "#fde68a"; c.fillText(`🎁 ${secret.peds.filter((p) => p.taken).length}/${secret.peds.length} yutuq`, sz / 2, sz / 2 + 30);
        return;
      }
      c.fillStyle = "rgba(6,10,22,.78)"; c.fillRect(0, 0, sz, sz);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!seen[y][x]) continue;
        c.fillStyle = G[y][x] === 1 ? "#5d5648" : "#1d2a3a";
        c.fillRect(x * k, y * k, k + 0.5, k + 0.5);
      }
      gates.forEach((g) => { if (!seen[g.y][g.x]) return; c.fillStyle = g.state === "open" || g.state === "sinking" ? "#34d399" : "#5ef2ff"; c.fillRect(g.x * k + k * 0.2, g.y * k + k * 0.2, k * 0.6, k * 0.6); });
      chests.forEach((h) => { if (!seen[h.y][h.x]) return; c.fillStyle = h.open ? "#7c6a2a" : "#fbbf24"; c.beginPath(); c.arc(h.x * k + k / 2, h.y * k + k / 2, k * 0.32, 0, 6.283); c.fill(); });
      if (sportal && seen[sportal.userData.y][sportal.userData.x]) { c.fillStyle = "#ffd34d"; c.font = `${Math.round(k * 1.4)}px system-ui`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("✦", sportal.userData.x * k + k / 2, sportal.userData.y * k + k / 2); }
      // chiqish doim ko'rinadi
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 250);
      c.fillStyle = `rgba(167,139,250,${0.6 + pulse * 0.4})`; c.beginPath(); c.arc(exit[0] * k + k / 2, exit[1] * k + k / 2, k * (0.45 + pulse * 0.15), 0, 6.283); c.fill();
      // o'yinchi (o'q)
      const px = (me.x / S) * k + k / 2, py = (me.z / S) * k + k / 2;
      c.save(); c.translate(px, py); c.rotate(-me.yaw + Math.PI);
      c.fillStyle = "#fde047"; c.beginPath(); c.moveTo(0, k * 0.9); c.lineTo(k * 0.55, -k * 0.5); c.lineTo(-k * 0.55, -k * 0.5); c.closePath(); c.fill();
      c.restore();
    }

    /* ---------------- Boshqaruv ---------------- */
    const keys = new Set();
    let mx = 0, my = 0, locked = false, paused = false, joy = { id: null, x: 0, y: 0, ox: 0, oy: 0 }, look = { id: null, x: 0, y: 0 };
    const typing = () => document.activeElement === ui.qi;
    const kd = (e) => {
      if (typing()) { if (e.code === "Escape") ui.qi.blur(); return; }
      keys.add(e.code);
      if (e.code === "KeyM") { bigMap = !bigMap; hud.classList.toggle("bigmap", bigMap); }
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    };
    const ku = (e) => keys.delete(e.code);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const canvas = renderer.domElement;
    const lockIt = () => { if (!MOBILE && canvas.requestPointerLock) try { canvas.requestPointerLock(); } catch (e) {} };
    const onLock = () => { locked = document.pointerLockElement === canvas; };
    document.addEventListener("pointerlockchange", onLock);
    const onMove = (e) => { if (locked && Math.abs(e.movementX) < 250 && Math.abs(e.movementY) < 250) { mx += e.movementX; my += e.movementY; } };
    document.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", () => { Snd.init(); if (!locked) lockIt(); if (st.active) ui.qi.focus(); });
    if (MOBILE) {
      const jEl = $("[data-joy]"), knob = jEl.querySelector("i");
      // Telefon tik bo'lsa o'yin 90° burilgan — koordinatalarni aylantiramiz
      const rot = () => container.classList.contains("rot");
      const pt = (x, y) => rot() ? { x: y, y: innerWidth - x } : { x, y };
      const ts = (e) => { Snd.init(); for (const t of e.changedTouches) { if (t.target.closest && t.target.closest(".lb-q,.lb-over,.lb-btn,.lb-map")) continue; const c = pt(t.clientX, t.clientY); if (c.x < container.clientWidth * 0.45 && joy.id === null) { const r = jEl.getBoundingClientRect(), cc = pt((r.left + r.right) / 2, (r.top + r.bottom) / 2); joy = { id: t.identifier, ox: cc.x, oy: cc.y, x: 0, y: 0 }; jEl.classList.add("on"); } else if (look.id === null) look = { id: t.identifier, x: c.x, y: c.y }; } };
      const tm = (e) => { if (e.target.closest && e.target.closest(".lb-q,.lb-over")) return; for (const t of e.changedTouches) { const c = pt(t.clientX, t.clientY); if (t.identifier === joy.id) { const dx = c.x - joy.ox, dy = c.y - joy.oy, d = Math.min(50, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); joy.x = Math.cos(a) * d / 50; joy.y = Math.sin(a) * d / 50; knob.style.transform = `translate(${joy.x * 38}px,${joy.y * 38}px)`; } else if (t.identifier === look.id) { mx += (c.x - look.x) * 1.5; my += (c.y - look.y) * 1.5; look.x = c.x; look.y = c.y; } } e.preventDefault(); };
      const te = (e) => { for (const t of e.changedTouches) { if (t.identifier === joy.id) { joy = { id: null, x: 0, y: 0 }; knob.style.transform = ""; jEl.classList.remove("on"); } if (t.identifier === look.id) look.id = null; } };
      container.addEventListener("touchstart", ts, { passive: true }); container.addEventListener("touchmove", tm, { passive: false }); container.addEventListener("touchend", te); container.addEventListener("touchcancel", te);
    }
    hud.addEventListener("click", (e) => {
      const b = e.target.closest("[data-b]"); if (!b) return;
      const k = b.dataset.b;
      if (k === "map") { bigMap = !bigMap; hud.classList.toggle("bigmap", bigMap); }
      else if (k === "menu") showMenu();
      else if (k === "resume") { ui.over.hidden = true; paused = false; lockIt(); }
      else if (k === "exit") destroy(true);
      else if (k === "next") { destroy(false); opts.onWin && opts.onWin(opts.level + 1, true); }
      else if (k === "retry") { destroy(false); opts.onWin && opts.onWin(opts.level, true); }
      else if (k === "start") begin();
    });

    function showMenu() {
      paused = true; if (document.pointerLockElement) document.exitPointerLock();
      ui.over.hidden = false;
      ui.over.innerHTML = `<div class="lb-card"><h2>⏸ To‘xtatildi</h2>
        <p>${MOBILE ? "Chap barmoq — yurish, o‘ng barmoq — qarash." : "W A S D — yurish, sichqoncha — qarash, Shift — yugurish, M — katta xarita."}</p>
        <div class="lb-row"><button class="lb-big" data-b="resume" type="button">▶ Davom etish</button><button class="lb-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    }
    function begin() {
      Snd.init(); Snd.ambience(true);
      ui.over.hidden = true; st.started = true; st.t0 = performance.now(); paused = false; lockIt();
      if (MOBILE) {
        const el = document.documentElement, fs = el.requestFullscreen || el.webkitRequestFullscreen;
        const lock = () => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").then(() => setTimeout(() => window.dispatchEvent(new Event("resize")), 300)).catch(() => {}); } catch (e) {} };
        try { const r = fs && fs.call(el); if (r && r.then) r.then(lock).catch(lock); else lock(); } catch (e) { lock(); }
      }
      hint("🧭 Chiqish portalini toping! Xaritada binafsha nuqta.");
    }
    function lose() {
      st.done = true; closeAsk(); Snd.lose(); if (document.pointerLockElement) document.exitPointerLock();
      ui.over.hidden = false;
      ui.over.innerHTML = `<div class="lb-card lose"><span class="big">💔</span><h2>Yuraklar tugadi</h2><p>Hech qisi yo‘q — har bir xato yangi bilim! Yana bir urinib ko‘ring.</p>
        <p class="sm">⭐ ${st.score} · 🚪 ${st.gatesOpen}/${gates.length} · 💰 ${st.chestsOpen}</p>
        <div class="lb-row"><button class="lb-big" data-b="retry" type="button">🔁 Qayta boshlash</button><button class="lb-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
      opts.onLose && opts.onLose();
    }
    function win() {
      st.done = true; closeAsk(); Snd.win(); flash("rgba(167,139,250,.6)"); if (document.pointerLockElement) document.exitPointerLock();
      const secs = Math.round(st.time), bonus = Math.max(0, 300 - secs) + st.hearts * 50;
      st.score += bonus;
      const res = opts.onResult ? opts.onResult({ level: opts.level, score: st.score, secs, hearts: st.hearts }) : null;
      ui.over.hidden = false;
      ui.over.innerHTML = `<div class="lb-card win"><span class="big">🏆</span><h2>${opts.level}-daraja yakunlandi!</h2>
        <div class="lb-stats"><div><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</b><small>vaqt</small></div><div><b>${"❤️".repeat(st.hearts)}</b><small>yurak</small></div><div><b>${st.score}</b><small>⭐ ball</small></div></div>
        <p class="sm">Vaqt va yurak bonusi: +${bonus} ⭐${res && res.best ? ` · 🥇 Yangi rekord!` : res && res.prev ? ` · Rekordingiz: ${res.prev}` : ""}</p>
        <div class="lb-row">${opts.level < LEVELS.length ? `<button class="lb-big" data-b="next" type="button">➡ ${opts.level + 1}-daraja</button>` : `<button class="lb-big" data-b="retry" type="button">🔁 Yana o‘ynash</button>`}<button class="lb-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    }

    /* ---------------- O'lcham ---------------- */
    function resize() {
      const w = container.clientWidth || innerWidth, h = container.clientHeight || innerHeight;
      renderer.setSize(w, h); camera.aspect = w / h;
      camera.fov = w / h < 1 ? 88 : 72; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize); resize();

    /* ---------------- Sikl ---------------- */
    let raf = 0, alive = true, last = performance.now(), lightT = 0, dripT = 3, crackT = 0, mapT = 0;
    const pr = { n: 0, acc: 0, r: renderer.getPixelRatio() };
    function frame() {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      const now = performance.now(), raw = (now - last) / 1000, dt = Math.min(0.05, raw), adt = Math.min(0.25, raw); last = now;
      const t = now / 1000; uTime.value = t;
      // Avtomatik sifat
      if (st.started && !paused) { pr.n++; pr.acc += Math.min(raw, 0.5); if (pr.acc > 3) { const fps = pr.n / pr.acc; pr.n = 0; pr.acc = 0; if (fps < 26 && pr.r > 0.6) { pr.r *= 0.75; renderer.setPixelRatio(pr.r); resize(); } } }
      const live = st.started && !st.done && !paused;
      if (live) {
        st.time = (now - st.t0) / 1000;
        const sens = 0.0023; me.yaw -= mx * sens; me.pitch = clamp(me.pitch - my * sens, -1.2, 1.2);
        let ix = 0, iz = 0;
        if (!typing()) {
          if (keys.has("KeyW") || keys.has("ArrowUp")) iz -= 1; if (keys.has("KeyS") || keys.has("ArrowDown")) iz += 1;
          if (keys.has("KeyA") || keys.has("ArrowLeft")) ix -= 1; if (keys.has("KeyD") || keys.has("ArrowRight")) ix += 1;
        }
        ix += joy.x; iz += joy.y;
        const il = Math.hypot(ix, iz); if (il > 1) { ix /= il; iz /= il; }
        const run = keys.has("ShiftLeft") && !typing();
        const sp = run ? 5.2 : 3.3;
        const cs = Math.cos(me.yaw), sn = Math.sin(me.yaw);
        const wx = (ix * cs + iz * sn) * sp, wz = (-ix * sn + iz * cs) * sp;
        me.vx += (wx - me.vx) * Math.min(1, dt * 10); me.vz += (wz - me.vz) * Math.min(1, dt * 10);
        me.x += me.vx * dt; me.z += me.vz * dt;
        if (st.zone === "maze") collide();
        else { // Sirli bog' — doira ichida, ustunlarga urilmasin
          const dx = me.x - secret.RX, dz = me.z - secret.RZ, d = Math.hypot(dx, dz), lim = secret.RAD - 0.5;
          if (d > lim) { me.x = secret.RX + dx / d * lim; me.z = secret.RZ + dz / d * lim; }
          secret.peds.forEach((pd) => { const ex = me.x - pd.wx, ez = me.z - pd.wz, e = Math.hypot(ex, ez); if (e < 0.95 && e > 1e-6) { me.x = pd.wx + ex / e * 0.95; me.z = pd.wz + ez / e * 0.95; } });
          const cx2 = me.x - secret.RX, cz2 = me.z - secret.RZ, cd = Math.hypot(cx2, cz2); if (cd < 1.2 && cd > 1e-6) { me.x = secret.RX + cx2 / cd * 1.2; me.z = secret.RZ + cz2 / cd * 1.2; }
        }
        const v = Math.hypot(me.vx, me.vz);
        if (v > 0.4) { me.bob += dt * v * 2.4; me.stepT -= dt * v; if (me.stepT <= 0) { me.stepT = 1.35; Snd.step(run ? 1 : 0.75); } }
        if (st.zone === "secret") {
          secret.peds.forEach((pd) => {
            if (pd.taken) return;
            const d = Math.hypot(pd.wx - me.x, pd.wz - me.z);
            if (d < 1.9 && (!st.active || st.active.target !== pd)) ask(pd, "task");
            if (d > 2.8 && st.active && st.active.target === pd) closeAsk();
          });
          if (st.active && st.active.kind === "task" && st.active.target.task.type === "timed") {
            const left = Math.max(0, st.active.target.task.deadline - performance.now());
            if (!ui.qm.textContent.startsWith("❌")) ui.qm.textContent = `⏳ ${Math.ceil(left / 1000)} soniya qoldi`;
            if (left <= 0) { const pd = st.active.target; pd.task.deadline = performance.now() + 60000; ui.qm.textContent = `⌛ Vaqt tugadi! Javob: ${pd.task.q.a[0]}`; Snd.bad(); setTimeout(() => { if (st.active && st.active.target === pd) { pd.task.q = newTaskQ(pd.task); pd.q = pd.task.q; pd.task.deadline = performance.now() + 20000; ui.qt.textContent = pd.task.q.q; ui.qi.value = ""; } }, 1600); }
          }
          if (st.warpT <= 0 && Math.hypot(secret.back.x - me.x, secret.back.z - me.z) < 1.0) warp("maze");
        }
        // ko'rilgan kataklar (xarita)
        const tx = Math.round(me.x / S), ty = Math.round(me.z / S);
        if (st.zone === "maze") for (let y = ty - 2; y <= ty + 2; y++) for (let x = tx - 2; x <= tx + 2; x++) if (seen[y] && x >= 0 && x < maze.GW) seen[y][x] = true;
        if (st.zone === "maze" && sportal && st.warpT <= 0 && Math.hypot(sportal.position.x - me.x, sportal.position.z - me.z) < 0.9) warp("secret");
        if (st.zone === "maze") { st.moanT -= dt; if (st.moanT <= 0) { st.moanT = rr(25, 45); Snd.moan(); } }
        // darvozalar
        gates.forEach((g) => {
          const d = Math.hypot(g.x * S - me.x, g.y * S - me.z);
          if (st.zone !== "maze") return;
          if (g.state === "hidden" && d < 3.9) {
            g.state = "rising"; g.t = 0; Snd.rumble();
            if (g.mood === "scary") { Snd.scary(); st.shake = 1.1; st.red = 2.2; flash("rgba(120,0,0,.55)"); hint("😱 Qorong‘i darvoza! Qizil ko‘zlar sizni kuzatmoqda...", 3200); }
            else if (g.mood === "nice") { Snd.nice(); st.shake = 0.25; burstAt(g.x * S, 0.5, g.y * S, 0xffd34d, 50); hint("✨ Oltin darvoza paydo bo‘ldi — yoqimli savol!"); }
            else { st.shake = 0.6; hint("⚠️ Oldingizda sehrli darvoza paydo bo‘ldi!"); }
          }
          if (g.state === "up" && d < 3.4 && (!st.active || st.active.target !== g)) ask(g, "gate");
          if (g.state === "up" && d > 4.6 && st.active && st.active.target === g) closeAsk();
        });
        chests.forEach((c) => {
          if (c.open || c.asked || st.zone !== "maze") return;
          const d = Math.hypot(c.grp.position.x - me.x, c.grp.position.z - me.z);
          if (d < 1.7 && (!st.active || st.active.target !== c)) ask(c, "chest");
          if (d > 2.6 && st.active && st.active.target === c) closeAsk();
        });
        if (st.zone === "maze" && Math.hypot(exit[0] * S - me.x, exit[1] * S - me.z) < 1.0) win();
      }
      // darvoza animatsiyasi
      gates.forEach((g) => {
        if (g.eyes) { g.eyes.material.opacity = g.state === "up" || g.state === "rising" ? (Math.sin(t * 2.3 + g.x) > -0.85 ? 0.9 + Math.sin(t * 9) * 0.1 : 0.05) : 0; }
        if (g.state === "rising") { g.t += adt / (g.mood === "scary" ? 0.3 : g.mood === "nice" ? 0.9 : 0.55); const k = Math.min(1, g.t); const e = 1 - Math.pow(1 - k, 3); g.grp.position.y = -WH - 0.2 + (WH + 0.2) * e; g.light.intensity = 1.6 * k; if (k >= 1) g.state = "up"; }
        else if (g.state === "up") g.light.intensity = 1.3 + Math.sin(t * 3) * 0.3;
        else if (g.state === "sinking") { g.t += adt / 1.1; const k = Math.min(1, g.t); g.grp.position.y = -(WH + 0.2) * k * k; g.light.intensity = 1.6 * (1 - k); if (k >= 1) { g.state = "open"; g.grp.visible = false; } }
      });
      st.warpT = Math.max(0, st.warpT - adt);
      st.red = Math.max(0, st.red - adt);
      if (scene.fog) {
        const target = st.zone === "secret" ? fogGarden : st.red > 0 ? fogRed : fogBase;
        scene.fog.color.lerp(target, Math.min(1, adt * 3));
        scene.fog.density += ((st.zone === "secret" ? 0.028 : 0.055) - scene.fog.density) * Math.min(1, adt * 2);
      }
      if (secret) {
        secret.big.rotation.y += adt * 0.6; secret.big.position.y = 2.6 + Math.sin(t * 1.3) * 0.15;
        secret.peds.forEach((pd, i) => { pd.item.rotation.y += adt * 1.4; pd.item.position.y = 1.75 + Math.sin(t * 2 + i) * 0.08; if (pd.taken) { pd.item.scale.multiplyScalar(Math.max(0, 1 - adt * 4)); pd.gl.material.opacity = Math.max(0, pd.gl.material.opacity - adt); } });
        if (st.zone === "secret") { const fp = secret.flies.geometry.attributes.position; for (let i = 0; i < secret.ffN; i++) { const ph = secret.ffs[i]; fp.array[i * 3] += Math.sin(t * 0.7 + ph) * adt * 0.3; fp.array[i * 3 + 1] += Math.cos(t * 0.9 + ph * 1.3) * adt * 0.2; fp.array[i * 3 + 2] += Math.cos(t * 0.6 + ph) * adt * 0.3; } fp.needsUpdate = true; secret.flies.material.opacity = 0.7 + Math.sin(t * 3) * 0.3; }
      }
      if (sportal) sportal.userData.light.intensity = 1.4 + Math.sin(t * 3) * 0.4;
      chests.forEach((c) => { if (c.open) c.lidG.rotation.x = Math.max(c.lidG.rotation.x - dt * 3, -1.9); c.glow.material.opacity = c.open ? Math.max(0, c.glow.material.opacity - dt) : 0.4 + Math.sin(t * 3 + c.x) * 0.15; });
      for (let i = gold.length - 1; i >= 0; i--) { const e = gold[i]; e.t += dt; const a = e.p.geometry.attributes.position; e.vel.forEach((v, j) => { v.y -= 6 * dt; a.array[j * 3] += v.x * dt; a.array[j * 3 + 1] += v.y * dt; a.array[j * 3 + 2] += v.z * dt; }); a.needsUpdate = true; e.p.material.opacity = 1 - e.t; if (e.t > 1) { scene.remove(e.p); gold.splice(i, 1); } }
      // mash'alalar va yorug'lik
      torches.forEach((h) => { const f = 0.85 + 0.15 * Math.sin(t * 11 + h.ph) * Math.sin(t * 7.3 + h.ph * 2); h.fl.scale.set(0.5 * f, 0.85 * f, 1); h.halo.material.opacity = 0.3 * f; });
      lightT -= dt;
      if (lightT <= 0) {
        lightT = 0.2;
        torches.forEach((h) => { h.d = (h.pos.x - me.x) ** 2 + (h.pos.z - me.z) ** 2; });
        const near = torches.slice().sort((a, b) => a.d - b.d).slice(0, NL);
        lights.forEach((l, i) => { const h = near[i]; l.userData.h = h || null; if (h) l.position.copy(h.pos); });
        const nd = near[0] ? Math.sqrt(near[0].d) : 99;
        crackT = clamp(1 - nd / 6, 0, 1);
      }
      lights.forEach((l) => { const h = l.userData.h; l.intensity = h ? 2.3 * (0.85 + 0.15 * Math.sin(t * 13 + h.ph) * Math.sin(t * 5.1 + h.ph)) : 0; });
      if (live && Math.random() < dt * 6) Snd.crackle(crackT);
      dripT -= dt; if (dripT <= 0) { dripT = rr(3, 9); if (live) Snd.drip(); }
      // chang zarralari
      const dp = dust.geometry.attributes.position;
      for (let i = 0; i < dustN; i++) { dp.array[i * 3 + 1] += Math.sin(t * 0.5 + i) * dt * 0.05; dp.array[i * 3] += Math.cos(t * 0.3 + i * 0.7) * dt * 0.04; }
      dp.needsUpdate = true;
      const pp = pParts.geometry.attributes.position;
      for (let i = 0; i < pN; i++) { pp.array[i * 3 + 1] += dt * 0.6; if (pp.array[i * 3 + 1] > 3.4) pp.array[i * 3 + 1] = 0; }
      pp.needsUpdate = true;
      pl.intensity = 2 + Math.sin(t * 2) * 0.5;
      // kamera
      st.shake = Math.max(0, st.shake - dt);
      const sh = st.shake * 0.06;
      camera.position.set(me.x + rr(-sh, sh), EYE + Math.sin(me.bob * 2) * 0.045 + rr(-sh, sh), me.z + rr(-sh, sh));
      camera.rotation.set(me.pitch, me.yaw + Math.sin(me.bob) * 0.004, Math.sin(me.bob) * 0.006);
      mx = 0; my = 0;
      mapT -= dt; if (mapT <= 0) { mapT = 0.1; drawMap(); }
      if (live) { const s = Math.floor(st.time); ui.tm.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
      ui.hp.textContent = "❤️".repeat(Math.max(0, st.hearts)) + "🖤".repeat(Math.max(0, 3 - st.hearts));
      ui.sc.textContent = st.score; ui.gt.textContent = `${st.gatesOpen}/${gates.length}`; if (ui.pz) ui.pz.textContent = st.prizes;
      renderer.render(scene, camera);
    }

    function destroy(user) {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("pointerlockchange", onLock);
      if (document.pointerLockElement) document.exitPointerLock();
      Snd.ambience(false); Snd.garden(false);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); });
      renderer.dispose(); container.innerHTML = "";
      if (user && opts.onExit) opts.onExit();
    }

    // Boshlash oynasi
    ui.over.hidden = false;
    ui.over.innerHTML = `<div class="lb-card"><span class="big">🧩</span><h2>${opts.level}-daraja</h2>
      <p>Tungi labirintdasiz. Chiqish portalini toping! Yo‘lda oldingizdan to‘satdan <b>sehrli darvozalar</b> chiqadi — savolga javobni <b>klaviaturada yozib</b>, Enter bosing.</p>
      <p class="sm">❤️ 3 ta yurak · xato javob — 1 yurak · 💰 sandiqlarda qo‘shimcha ball · 🗺️ xarita yuqorida</p>
      ${secret ? `<p class="sm">✦ Labirintning qayeridadir <b>oltin sirli portal</b> yashiringan — u sizni yutuqlar bog‘iga olib boradi!</p>` : ""}
      <p class="sm">Ehtiyot bo‘ling: ba’zi darvozalar 😱 qo‘rqinchli, ba’zilari ✨ oltin va yoqimli.</p>
      <p class="sm">${MOBILE ? "Chap barmoq — yurish, o‘ng barmoq — qarash." : "W A S D — yurish · sichqoncha — qarash · Shift — yugurish · M — katta xarita"}</p>
      <div class="lb-row"><button class="lb-big" data-b="start" type="button">▶ Boshlash</button><button class="lb-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    for (let y = 0; y <= 3; y++) for (let x = 0; x <= 3; x++) if (seen[y]) seen[y][x] = true;
    frame();
    return { destroy: () => destroy(false), debug: { me, st, gates, chests, exit, camera, renderer, scene, path, S, secret, sportal, warp } };
  }

  window.SofiMaze3D = { create, LEVELS };
})();
