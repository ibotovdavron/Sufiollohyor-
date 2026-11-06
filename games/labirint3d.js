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

    // Darvozalar (savol)
    const runeTex = canvasTex(256, (g, s) => {
      g.fillStyle = "#000"; g.fillRect(0, 0, s, s);
      g.strokeStyle = "#5ef2ff"; g.shadowColor = "#5ef2ff"; g.shadowBlur = 18; g.lineWidth = 6;
      g.beginPath(); g.arc(s / 2, s / 2, s * 0.36, 0, 6.283); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.arc(s / 2, s / 2, s * 0.43, 0, 6.283); g.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; g.beginPath(); g.moveTo(s / 2 + Math.cos(a) * s * 0.38, s / 2 + Math.sin(a) * s * 0.38); g.lineTo(s / 2 + Math.cos(a) * s * 0.42, s / 2 + Math.sin(a) * s * 0.42); g.stroke(); }
      g.fillStyle = "#aaf8ff"; g.font = "900 120px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", s / 2, s / 2 + 8);
    }, 1);
    const gateStone = new T.MeshStandardMaterial({ map: wallMap, color: 0x6f7fa8, roughness: 0.55, metalness: 0.15, bumpMap: wallBump, bumpScale: 0.05, emissive: 0x0a2a3a, emissiveIntensity: 0.6 });
    const runeMat = new T.MeshBasicMaterial({ map: runeTex, blending: T.AdditiveBlending, transparent: true, depthWrite: false });
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
          const slab = new T.Mesh(new T.BoxGeometry(S * 0.98, WH * 0.95, 0.5), gateStone); slab.position.y = WH * 0.475; slab.castShadow = true; slab.receiveShadow = true; grp.add(slab);
          [1, -1].forEach((sd) => { const r = new T.Mesh(new T.PlaneGeometry(1.7, 1.7), runeMat.clone()); r.position.set(0, 1.75, sd * 0.26); if (sd < 0) r.rotation.y = Math.PI; grp.add(r); });
          if (horiz) grp.rotation.y = Math.PI / 2;
          grp.position.set(x * S, -WH - 0.2, y * S);
          scene.add(grp);
          const gl = new T.PointLight(0x5ef2ff, 0, 7, 2); gl.position.set(x * S, 1.8, y * S); scene.add(gl);
          gates.push({ x, y, grp, light: gl, state: "hidden", t: 0, q: null, tries: 0 });
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
    const pMat = new T.ShaderMaterial({
      transparent: true, side: T.DoubleSide, depthWrite: false, uniforms: { uTime },
      vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `varying vec2 vU; uniform float uTime;
        void main(){ vec2 p = vU * 2.0 - 1.0; p.y *= 0.72; float r = length(p); float a = atan(p.y, p.x);
          float sw = sin(a * 5.0 + r * 14.0 - uTime * 4.0) * 0.5 + 0.5;
          vec3 c = mix(vec3(0.35,0.1,0.9), vec3(0.2,0.95,1.0), sw) * (1.4 - r);
          c += vec3(1.0) * smoothstep(0.25, 0.0, r) * 0.8;
          float alpha = smoothstep(1.0, 0.75, r) * (0.75 + 0.25 * sw);
          gl_FragColor = vec4(c, alpha); }`,
    });
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

    /* ---------------- O'yinchi ---------------- */
    const me = { x: start[0] * S, z: start[1] * S, yaw: 0, pitch: 0, vx: 0, vz: 0, bob: 0, stepT: 0 };
    { const d = [[1, 0], [0, 1]].find(([dx, dy]) => G[start[1] + dy][start[0] + dx] === 0) || [1, 0]; me.yaw = Math.atan2(-d[0], -d[1]); }
    const st = { hearts: 3, score: 0, gatesOpen: 0, chestsOpen: 0, t0: 0, time: 0, done: false, started: false, shake: 0, active: null };
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
        <div class="lb-chip">🚪 <b data-gt>0/${gates.length}</b></div></div>
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
    const ui = { lv: $("[data-lv]"), tm: $("[data-tm]"), hp: $("[data-hp]"), sc: $("[data-sc]"), gt: $("[data-gt]"), map: $("[data-map]"), hint: $("[data-hint]"), q: $("[data-q]"), qt: $("[data-qt]"), qk: $("[data-qk]"), qi: $("[data-qi]"), qm: $("[data-qm]"), over: $("[data-over]"), flash: $("[data-flash]") };
    const mctx = ui.map.getContext("2d");
    let bigMap = false;

    function flash(c) { ui.flash.style.background = c; ui.flash.classList.remove("on"); void ui.flash.offsetWidth; ui.flash.classList.add("on"); }
    function hint(t, ms = 2600) { ui.hint.textContent = t; ui.hint.classList.add("on"); clearTimeout(hint.t); hint.t = setTimeout(() => ui.hint.classList.remove("on"), ms); }

    function ask(target, kind) {
      st.active = { target, kind };
      if (!target.q) target.q = Q.make(opts.grade);
      ui.q.hidden = false;
      ui.qk.textContent = kind === "gate" ? "🚪 Darvoza savoli — to‘g‘ri javob yo‘lni ochadi" : "💰 Xazina sandig‘i — to‘g‘ri javob +50 ⭐";
      ui.qt.textContent = target.q.q; ui.qm.textContent = target.q.hint || "";
      ui.qi.value = "";
      ui.qi.inputMode = /^[\d\s+\-×:=?().√²x%/ninghqismiechaga teng]+$/i.test(target.q.q) && /\d/.test(target.q.q) ? "text" : "text";
      setTimeout(() => { try { ui.qi.focus({ preventScroll: true }); } catch (e) { ui.qi.focus(); } }, 60);
    }
    function closeAsk() { st.active = null; ui.q.hidden = true; ui.qi.blur(); }
    ui.q.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = st.active; if (!a) return;
      const v = ui.qi.value.trim(); if (!v) return;
      if (Q.check(a.target.q, v)) {
        Snd.good(); flash("rgba(80,255,200,.35)");
        if (a.kind === "gate") { a.target.state = "sinking"; a.target.t = 0; st.gatesOpen++; st.score += a.target.tries ? 60 : 100; Snd.sink(); hint("✅ To‘g‘ri! Darvoza ochildi"); }
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
      c.fillStyle = "rgba(6,10,22,.78)"; c.fillRect(0, 0, sz, sz);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!seen[y][x]) continue;
        c.fillStyle = G[y][x] === 1 ? "#5d5648" : "#1d2a3a";
        c.fillRect(x * k, y * k, k + 0.5, k + 0.5);
      }
      gates.forEach((g) => { if (!seen[g.y][g.x]) return; c.fillStyle = g.state === "open" || g.state === "sinking" ? "#34d399" : "#5ef2ff"; c.fillRect(g.x * k + k * 0.2, g.y * k + k * 0.2, k * 0.6, k * 0.6); });
      chests.forEach((h) => { if (!seen[h.y][h.x]) return; c.fillStyle = h.open ? "#7c6a2a" : "#fbbf24"; c.beginPath(); c.arc(h.x * k + k / 2, h.y * k + k / 2, k * 0.32, 0, 6.283); c.fill(); });
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
      const ts = (e) => { Snd.init(); for (const t of e.changedTouches) { if (t.target.closest && t.target.closest(".lb-q,.lb-over,.lb-btn,.lb-map")) continue; if (t.clientX < innerWidth * 0.45 && joy.id === null) { const r = jEl.getBoundingClientRect(); joy = { id: t.identifier, ox: (r.left + r.right) / 2, oy: (r.top + r.bottom) / 2, x: 0, y: 0 }; jEl.classList.add("on"); } else if (look.id === null) look = { id: t.identifier, x: t.clientX, y: t.clientY }; } };
      const tm = (e) => { if (e.target.closest && e.target.closest(".lb-q,.lb-over")) return; for (const t of e.changedTouches) { if (t.identifier === joy.id) { const dx = t.clientX - joy.ox, dy = t.clientY - joy.oy, d = Math.min(50, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); joy.x = Math.cos(a) * d / 50; joy.y = Math.sin(a) * d / 50; knob.style.transform = `translate(${joy.x * 38}px,${joy.y * 38}px)`; } else if (t.identifier === look.id) { mx += (t.clientX - look.x) * 1.5; my += (t.clientY - look.y) * 1.5; look.x = t.clientX; look.y = t.clientY; } } e.preventDefault(); };
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
      if (MOBILE) { const el = document.documentElement, fs = el.requestFullscreen || el.webkitRequestFullscreen; try { const r = fs && fs.call(el); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
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
        collide();
        const v = Math.hypot(me.vx, me.vz);
        if (v > 0.4) { me.bob += dt * v * 2.4; me.stepT -= dt * v; if (me.stepT <= 0) { me.stepT = 1.35; Snd.step(run ? 1 : 0.75); } }
        // ko'rilgan kataklar (xarita)
        const tx = Math.round(me.x / S), ty = Math.round(me.z / S);
        for (let y = ty - 2; y <= ty + 2; y++) for (let x = tx - 2; x <= tx + 2; x++) if (seen[y] && x >= 0 && x < maze.GW) seen[y][x] = true;
        // darvozalar
        gates.forEach((g) => {
          const d = Math.hypot(g.x * S - me.x, g.y * S - me.z);
          if (g.state === "hidden" && d < 3.9) { g.state = "rising"; g.t = 0; Snd.rumble(); st.shake = 0.6; hint("⚠️ Oldingizda sehrli darvoza paydo bo‘ldi!"); }
          if (g.state === "up" && d < 3.4 && (!st.active || st.active.target !== g)) ask(g, "gate");
          if (g.state === "up" && d > 4.6 && st.active && st.active.target === g) closeAsk();
        });
        chests.forEach((c) => {
          if (c.open || c.asked) return;
          const d = Math.hypot(c.grp.position.x - me.x, c.grp.position.z - me.z);
          if (d < 1.7 && (!st.active || st.active.target !== c)) ask(c, "chest");
          if (d > 2.6 && st.active && st.active.target === c) closeAsk();
        });
        if (Math.hypot(exit[0] * S - me.x, exit[1] * S - me.z) < 1.0) win();
      }
      // darvoza animatsiyasi
      gates.forEach((g) => {
        if (g.state === "rising") { g.t += adt / 0.55; const k = Math.min(1, g.t); const e = 1 - Math.pow(1 - k, 3); g.grp.position.y = -WH - 0.2 + (WH + 0.2) * e; g.light.intensity = 1.6 * k; if (k >= 1) g.state = "up"; }
        else if (g.state === "up") g.light.intensity = 1.3 + Math.sin(t * 3) * 0.3;
        else if (g.state === "sinking") { g.t += adt / 1.1; const k = Math.min(1, g.t); g.grp.position.y = -(WH + 0.2) * k * k; g.light.intensity = 1.6 * (1 - k); if (k >= 1) { g.state = "open"; g.grp.visible = false; } }
      });
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
      ui.sc.textContent = st.score; ui.gt.textContent = `${st.gatesOpen}/${gates.length}`;
      renderer.render(scene, camera);
    }

    function destroy(user) {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove); document.removeEventListener("pointerlockchange", onLock);
      if (document.pointerLockElement) document.exitPointerLock();
      Snd.ambience(false);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); });
      renderer.dispose(); container.innerHTML = "";
      if (user && opts.onExit) opts.onExit();
    }

    // Boshlash oynasi
    ui.over.hidden = false;
    ui.over.innerHTML = `<div class="lb-card"><span class="big">🧩</span><h2>${opts.level}-daraja</h2>
      <p>Tungi labirintdasiz. Chiqish portalini toping! Yo‘lda oldingizdan to‘satdan <b>sehrli darvozalar</b> chiqadi — savolga javobni <b>klaviaturada yozib</b>, Enter bosing.</p>
      <p class="sm">❤️ 3 ta yurak · xato javob — 1 yurak · 💰 sandiqlarda qo‘shimcha ball · 🗺️ xarita yuqorida</p>
      <p class="sm">${MOBILE ? "Chap barmoq — yurish, o‘ng barmoq — qarash." : "W A S D — yurish · sichqoncha — qarash · Shift — yugurish · M — katta xarita"}</p>
      <div class="lb-row"><button class="lb-big" data-b="start" type="button">▶ Boshlash</button><button class="lb-big ghost" data-b="exit" type="button">🚪 Chiqish</button></div></div>`;
    for (let y = 0; y <= 3; y++) for (let x = 0; x <= 3; x++) if (seen[y]) seen[y][x] = true;
    frame();
    return { destroy: () => destroy(false), debug: { me, st, gates, chests, exit, camera, renderer, scene, path, S } };
  }

  window.SofiMaze3D = { create, LEVELS };
})();
