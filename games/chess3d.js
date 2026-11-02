/* SHAXMAT — 3D taxta (Three.js).
   Board3D(container, { orientation, onSquare }) :
     setPosition(board)            — chess.board() massivi bo'yicha donalarni joylash
     playMove(move, board)         — yurishni animatsiya bilan ko'rsatish
     setMarks({ last, sel, check, moves })
     setOrientation("w" | "b")     — kamerani o'yinchi tomonga burish
     destroy()                                                              */
(() => {
  "use strict";
  const T = window.THREE;
  const FILES = "abcdefgh";

  const sqPos = (sq) => {
    const f = FILES.indexOf(sq[0]), r = +sq[1] - 1;
    return { x: f - 3.5, z: 3.5 - r };
  };
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // ---------- Materiallar ----------
  function makeMaterials() {
    const M = {};
    M.white = new T.MeshPhysicalMaterial({ color: 0xf3eee2, envMapIntensity: 0.7, roughness: 0.3, metalness: 0, clearcoat: 0.9, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: new T.Color(0xfff4d6) });
    M.black = new T.MeshPhysicalMaterial({ color: 0x0b0d10, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.55 });
    M.gold = new T.MeshStandardMaterial({ color: 0xe0b44a, roughness: 0.22, metalness: 1 });
    M.emerald = new T.MeshStandardMaterial({ color: 0x0fd394, roughness: 0.25, metalness: 0.6, emissive: 0x00f59b, emissiveIntensity: 0.35 });
    M.eye = new T.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
    M.light = new T.MeshPhysicalMaterial({ color: 0xe6dcc2, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.3, envMapIntensity: 0.45 });
    M.dark = new T.MeshPhysicalMaterial({ color: 0x0f4a3b, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 0.4 });
    M.frame = new T.MeshPhysicalMaterial({ color: 0x07110e, roughness: 0.35, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.3 });
    M.glow = new T.MeshBasicMaterial({ color: 0x00f59b, transparent: true, opacity: 0.85 });
    return M;
  }

  // ---------- Dona geometriyalari ----------
  const lathe = (pts) => new T.LatheGeometry(pts.map(([x, y]) => new T.Vector2(x, y)), 56);
  const BASE = [[0, 0], [0.4, 0], [0.4, 0.055], [0.36, 0.09], [0.335, 0.125], [0.335, 0.16]];
  const PROFILES = {
    p: [...BASE, [0.24, 0.19], [0.17, 0.29], [0.13, 0.42], [0.125, 0.46], [0.21, 0.49], [0.21, 0.52], [0.12, 0.55], [0, 0.56]],
    r: [...BASE, [0.27, 0.2], [0.235, 0.34], [0.225, 0.62], [0.3, 0.66], [0.3, 0.86], [0.22, 0.86], [0.22, 0.8], [0, 0.8]],
    n: [...BASE, [0.27, 0.2], [0.24, 0.24], [0, 0.24]],
    b: [...BASE, [0.25, 0.2], [0.17, 0.35], [0.13, 0.56], [0.22, 0.6], [0.22, 0.63], [0.13, 0.66], [0, 0.66]],
    q: [...BASE, [0.27, 0.22], [0.185, 0.4], [0.14, 0.72], [0.245, 0.76], [0.245, 0.79], [0.15, 0.82], [0.2, 1.0], [0.275, 1.1], [0.24, 1.12], [0.12, 1.08], [0, 1.08]],
    k: [...BASE, [0.28, 0.23], [0.19, 0.42], [0.15, 0.78], [0.26, 0.82], [0.26, 0.85], [0.16, 0.88], [0.22, 1.08], [0.26, 1.14], [0.1, 1.18], [0, 1.18]]
  };

  function knightHead() {
    const s = new T.Shape();
    const P = [[-0.27, 0.2], [0.27, 0.2], [0.25, 0.34], [0.13, 0.47], [0.3, 0.56], [0.41, 0.66], [0.39, 0.77],
      [0.2, 0.9], [0.1, 1.02], [0.03, 1.13], [-0.05, 1.01], [-0.17, 0.99], [-0.27, 0.82], [-0.31, 0.56]];
    s.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < P.length; i++) {
      const [x, y] = P[i], [px, py] = P[i - 1];
      s.quadraticCurveTo((px + x) / 2 + (y - py) * 0.12, (py + y) / 2 - (x - px) * 0.12, x, y);
    }
    s.closePath();
    const g = new T.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 4, curveSegments: 8 });
    g.translate(0, 0, -0.1);
    g.computeVertexNormals();
    return g;
  }

  function buildGeoms() {
    const G = {};
    for (const k of Object.keys(PROFILES)) G[k] = lathe(PROFILES[k]);
    G.head = new T.SphereGeometry(0.175, 40, 28);
    G.ball = new T.SphereGeometry(0.05, 20, 14);
    G.top = new T.SphereGeometry(0.08, 24, 16);
    G.mitre = lathe([[0, 0.62], [0.16, 0.67], [0.205, 0.77], [0.185, 0.88], [0.12, 0.96], [0.05, 1.01], [0, 1.02]]);
    G.merlon = new T.BoxGeometry(0.12, 0.1, 0.12);
    G.ring = new T.TorusGeometry(0.2, 0.018, 12, 48);
    G.knight = knightHead();
    G.eye = new T.SphereGeometry(0.03, 12, 8);
    G.crossV = new T.BoxGeometry(0.07, 0.28, 0.07);
    G.crossH = new T.BoxGeometry(0.22, 0.07, 0.07);
    return G;
  }

  function makePiece(type, color, G, M) {
    const g = new T.Group();
    const body = color === "w" ? M.white : M.black;
    const trim = color === "w" ? M.gold : M.emerald;
    const add = (geo, mat, x = 0, y = 0, z = 0) => {
      const m = new T.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    add(G[type], body);
    const ring = add(G.ring, trim, 0, 0.135, 0);
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(type === "p" ? 1.6 : 1.68);
    if (type === "p") add(G.head, body, 0, 0.7, 0);
    if (type === "r") {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        add(G.merlon, body, Math.cos(a) * 0.245, 0.9, Math.sin(a) * 0.245).rotation.y = -a;
      }
    }
    if (type === "b") {
      add(G.mitre, body);
      add(G.ball, trim, 0, 1.06, 0);
    }
    if (type === "n") {
      const h = add(G.knight, body, 0, 0.02, 0);
      h.rotation.y = color === "w" ? Math.PI / 2 : -Math.PI / 2;
      const side = color === "w" ? 1 : -1;
      // ko'zlar (ot oldinga — raqib tomonga qaraydi)
      add(G.eye, M.eye, 0.15, 0.84, -0.2 * side);
      add(G.eye, M.eye, -0.15, 0.84, -0.2 * side);
    }
    if (type === "q") {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        add(G.ball, trim, Math.cos(a) * 0.25, 1.13, Math.sin(a) * 0.25);
      }
      add(G.top, trim, 0, 1.17, 0);
    }
    if (type === "k") {
      add(G.crossV, trim, 0, 1.33, 0);
      add(G.crossH, trim, 0, 1.36, 0);
    }
    g.userData = { type, color };
    return g;
  }

  // ---------- Atrof-muhit (aks uchun) ----------
  function envMap(renderer) {
    const pm = new T.PMREMGenerator(renderer);
    const sc = new T.Scene();
    const room = new T.Mesh(new T.BoxGeometry(30, 16, 30), new T.MeshBasicMaterial({ color: 0x0a1612, side: T.BackSide }));
    sc.add(room);
    const panel = (w, h, color, x, y, z, ry = 0, rx = 0) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color, side: T.DoubleSide }));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      sc.add(m);
    };
    panel(12, 3, 0xffffff, 0, 7.8, 0, 0, Math.PI / 2);
    panel(6, 6, 0xbffff0, -14.5, 3, 0, Math.PI / 2);
    panel(6, 6, 0xffe8b0, 14.5, 3, 0, -Math.PI / 2);
    panel(16, 2, 0x5ef5c2, 0, 2, -14.5);
    panel(16, 2, 0xffffff, 0, 2, 14.5, Math.PI);
    const tex = pm.fromScene(sc, 0.04).texture;
    pm.dispose();
    return tex;
  }

  function coordTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const x = c.getContext("2d");
    const S = 1024 / 9.4, off = 0.7 * S;
    x.fillStyle = "rgba(224, 196, 120, .9)";
    x.font = "600 44px Inter, system-ui, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    for (let i = 0; i < 8; i++) {
      const p = off + (i + 0.5) * S;
      x.fillText(FILES[i], p, 1024 - off / 2);
      x.fillText(FILES[i], p, off / 2);
      x.fillText(String(8 - i), off / 2, p);
      x.fillText(String(8 - i), 1024 - off / 2, p);
    }
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  // =========================================================
  function Board3D(container, opts = {}) {
    if (!T) throw new Error("THREE yuklanmadi");
    const self = this;
    const onSquare = opts.onSquare || (() => {});
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      throw new Error("WebGL yo‘q");
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.domElement.className = "cs-canvas";
    container.appendChild(renderer.domElement);

    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    const scene = new T.Scene();
    scene.environment = envMap(renderer);
    const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
    const M = makeMaterials();
    const G = buildGeoms();

    // Yorug'lik
    scene.add(new T.HemisphereLight(0xdffff4, 0x0b1a14, 0.55));
    const sun = new T.DirectionalLight(0xffffff, 1.6);
    sun.position.set(4.5, 11, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -6; sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
    sun.shadow.bias = -0.0004;
    sun.shadow.radius = 4;
    scene.add(sun);
    const rimA = new T.PointLight(0x00f59b, 0.9, 22); rimA.position.set(-7, 4, -6); scene.add(rimA);
    const rimB = new T.PointLight(0xf5c84c, 0.6, 22); rimB.position.set(7, 3, 6); scene.add(rimB);

    // Taxta
    const boardGroup = new T.Group();
    scene.add(boardGroup);
    const tiles = [];
    const tileGeo = new T.BoxGeometry(1, 0.12, 1);
    for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) {
      const sq = FILES[f] + (r + 1);
      const m = new T.Mesh(tileGeo, (f + r) % 2 === 0 ? M.dark : M.light);
      const p = sqPos(sq);
      m.position.set(p.x, -0.06, p.z);
      m.receiveShadow = true;
      m.userData.square = sq;
      boardGroup.add(m);
      tiles.push(m);
    }
    const frame = new T.Mesh(new T.BoxGeometry(9.4, 0.34, 9.4), M.frame);
    frame.position.y = -0.2;
    frame.receiveShadow = true;
    frame.castShadow = true;
    boardGroup.add(frame);
    const coords = new T.Mesh(new T.PlaneGeometry(9.4, 9.4), new T.MeshBasicMaterial({ map: coordTexture(), transparent: true }));
    coords.rotation.x = -Math.PI / 2;
    coords.position.y = -0.028;
    boardGroup.add(coords);
    // Neon chiziq
    const edge = new T.Mesh(new T.BoxGeometry(9.46, 0.03, 9.46), M.glow);
    edge.position.y = -0.37;
    boardGroup.add(edge);
    const inner = new T.Mesh(new T.BoxGeometry(8.12, 0.02, 8.12), new T.MeshBasicMaterial({ color: 0xe0b44a, transparent: true, opacity: 0.6 }));
    inner.position.y = -0.03;
    boardGroup.add(inner);
    // Soya tushadigan pol
    const floor = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.45 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.38;
    floor.receiveShadow = true;
    scene.add(floor);

    // Belgilar (oxirgi yurish, tanlangan, shax, mumkin yurishlar)
    const markGroup = new T.Group();
    scene.add(markGroup);
    const planeGeo = new T.PlaneGeometry(0.98, 0.98);
    const dotGeo = new T.CylinderGeometry(0.14, 0.14, 0.03, 32);
    const capGeo = new T.TorusGeometry(0.4, 0.04, 10, 48);
    const markMat = {
      last: new T.MeshBasicMaterial({ color: 0xf5c84c, transparent: true, opacity: 0.38, depthWrite: false }),
      sel: new T.MeshBasicMaterial({ color: 0x00f59b, transparent: true, opacity: 0.5, depthWrite: false }),
      check: new T.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.6, depthWrite: false }),
      dot: new T.MeshBasicMaterial({ color: 0x00f59b, transparent: true, opacity: 0.85 }),
      cap: new T.MeshBasicMaterial({ color: 0xff7a59, transparent: true, opacity: 0.9 }),
      hover: new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, depthWrite: false })
    };
    let checkMesh = null;
    const hoverMesh = new T.Mesh(planeGeo, markMat.hover);
    hoverMesh.rotation.x = -Math.PI / 2;
    hoverMesh.position.y = 0.004;
    hoverMesh.visible = false;
    scene.add(hoverMesh);

    // ---------- Donalar ----------
    const pieces = new Map(); // square -> group
    const fading = [];
    const tweens = [];
    let dirty = true;

    function place(sq, type, color) {
      const g = makePiece(type, color, G, M);
      const p = sqPos(sq);
      g.position.set(p.x, 0, p.z);
      g.userData.square = sq;
      scene.add(g);
      pieces.set(sq, g);
      return g;
    }
    function drop(g, animate = true) {
      if (!animate) { scene.remove(g); return; }
      tweens.push({ t0: performance.now(), dur: 320, step(k) {
        g.position.y = -0.5 * k;
        g.scale.setScalar(1 - 0.6 * k);
        g.rotation.z = 0.5 * k;
      }, done() { scene.remove(g); } });
    }

    this.setPosition = function (board) {
      const want = new Map();
      board.forEach((row, i) => row.forEach((c, j) => { if (c) want.set(FILES[j] + (8 - i), c); }));
      for (const [sq, g] of [...pieces]) {
        const w = want.get(sq);
        if (!w || w.type !== g.userData.type || w.color !== g.userData.color) { scene.remove(g); pieces.delete(sq); }
        else { const p = sqPos(sq); g.position.set(p.x, 0, p.z); g.scale.setScalar(1); g.rotation.set(0, 0, 0); }
      }
      for (const [sq, c] of want) if (!pieces.has(sq)) place(sq, c.type, c.color);
      dirty = true;
    };

    function slide(g, to, dur, lift) {
      const a = g.position.clone(), p = sqPos(to);
      return new Promise((res) => tweens.push({ t0: performance.now(), dur, step(k) {
        const e = ease(k);
        g.position.set(a.x + (p.x - a.x) * e, Math.sin(Math.PI * k) * lift, a.z + (p.z - a.z) * e);
      }, done: res }));
    }

    this.playMove = function (mv, boardAfter) {
      const g = pieces.get(mv.from);
      if (!g) { self.setPosition(boardAfter); return Promise.resolve(); }
      pieces.delete(mv.from);
      const jobs = [];
      let capSq = mv.flags.includes("e") ? mv.to[0] + mv.from[1] : (mv.captured ? mv.to : null);
      if (capSq && pieces.has(capSq)) {
        const cg = pieces.get(capSq);
        pieces.delete(capSq);
        setTimeout(() => drop(cg), 180);
      }
      const dist = Math.hypot(FILES.indexOf(mv.to[0]) - FILES.indexOf(mv.from[0]), +mv.to[1] - +mv.from[1]);
      jobs.push(slide(g, mv.to, 260 + Math.min(dist, 6) * 45, mv.piece === "n" ? 0.9 : 0.18 + dist * 0.04));
      pieces.set(mv.to, g);
      g.userData.square = mv.to;
      if (mv.flags.includes("k") || mv.flags.includes("q")) {
        const r = mv.from[1];
        const [rf, rt] = mv.flags.includes("k") ? ["h" + r, "f" + r] : ["a" + r, "d" + r];
        const rg = pieces.get(rf);
        if (rg) { pieces.delete(rf); pieces.set(rt, rg); rg.userData.square = rt; jobs.push(slide(rg, rt, 420, 0.5)); }
      }
      return Promise.all(jobs).then(() => self.setPosition(boardAfter));
    };

    // ---------- Belgilar ----------
    this.setMarks = function ({ last = null, sel = null, check = null, moves = [] } = {}) {
      while (markGroup.children.length) markGroup.remove(markGroup.children[0]);
      checkMesh = null;
      const flat = (sq, mat, y = 0.003) => {
        const m = new T.Mesh(planeGeo, mat);
        const p = sqPos(sq);
        m.rotation.x = -Math.PI / 2;
        m.position.set(p.x, y, p.z);
        markGroup.add(m);
        return m;
      };
      if (last) last.forEach((s) => flat(s, markMat.last));
      if (sel) flat(sel, markMat.sel, 0.005);
      if (check) checkMesh = flat(check, markMat.check, 0.006);
      moves.forEach((mv) => {
        const p = sqPos(mv.to);
        const m = mv.capture ? new T.Mesh(capGeo, markMat.cap) : new T.Mesh(dotGeo, markMat.dot);
        if (mv.capture) m.rotation.x = Math.PI / 2;
        m.position.set(p.x, mv.capture ? 0.03 : 0.02, p.z);
        m.userData.pulse = Math.random() * 6;
        markGroup.add(m);
      });
      dirty = true;
    };

    // ---------- Kamera ----------
    const cam = { theta: 0, phi: 0.72, r: 13, target: new T.Vector3(0, -0.2, 0) };
    let camTween = null;
    function fitRadius() {
      const w = container.clientWidth || 1, h = container.clientHeight || 1;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 0.8 ? 44 : 36;
      camera.updateProjectionMatrix();
      // Taxta ekranga to'liq sig'sin: eniga ham, bo'yiga ham
      const t = Math.tan((camera.fov * Math.PI) / 360);
      return Math.min(Math.max((aspect < 1 ? 5.3 : 5.8) / (t * aspect), 4.3 / t), 26);
    }
    let baseR = 13;
    function applyCam() {
      const { theta, phi, r, target } = cam;
      camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
      camera.lookAt(target);
      dirty = true;
    }
    this.setOrientation = function (c, animate = true) {
      const goal = c === "b" ? Math.PI : 0;
      let from = cam.theta % (Math.PI * 2);
      if (from < 0) from += Math.PI * 2;
      let diff = goal - from;
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      if (!animate) { cam.theta = goal; cam.phi = 0.72; applyCam(); return; }
      const t0 = performance.now(), th0 = from, ph0 = cam.phi, r0 = cam.r;
      camTween = (now) => {
        const k = Math.min(1, (now - t0) / 900), e = ease(k);
        cam.theta = th0 + diff * e;
        cam.phi = ph0 + (0.72 - ph0) * e;
        cam.r = r0 + (baseR - r0) * e;
        applyCam();
        if (k >= 1) camTween = null;
      };
    };

    // ---------- Sichqoncha / barmoq ----------
    const ray = new T.Raycaster();
    const ndc = new T.Vector2();
    const el = renderer.domElement;
    const pointers = new Map();
    let drag = null, pinch = null;
    function pick(e) {
      const rect = el.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      // Nur yo'lidagi barcha katakchalar: avval donalar (yaqindan uzoqqa), keyin taxta katagi
      const out = [];
      ray.intersectObjects([...pieces.values()], true).forEach((h) => {
        let o = h.object;
        while (o && !o.userData.square) o = o.parent;
        if (o && !out.includes(o.userData.square)) out.push(o.userData.square);
      });
      const hit = ray.intersectObjects(tiles, false)[0];
      if (hit && !out.includes(hit.object.userData.square)) out.push(hit.object.userData.square);
      return out;
    }
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), r: cam.r };
        drag = null;
      } else drag = { x: e.clientX, y: e.clientY, th: cam.theta, ph: cam.phi, moved: false };
    });
    el.addEventListener("pointermove", (e) => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        cam.r = Math.max(baseR * 0.6, Math.min(baseR * 1.5, pinch.r * (pinch.d / Math.max(d, 1))));
        applyCam();
        return;
      }
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
        if (drag.moved) {
          cam.theta = drag.th - dx * 0.008;
          cam.phi = Math.max(0.18, Math.min(1.22, drag.ph - dy * 0.006));
          camTween = null;
          applyCam();
        }
      } else if (e.pointerType === "mouse") {
        const sq = pick(e).pop();
        if (sq) { const p = sqPos(sq); hoverMesh.position.x = p.x; hoverMesh.position.z = p.z; }
        if (hoverMesh.visible !== !!sq) hoverMesh.visible = !!sq;
        dirty = true;
      }
    });
    const end = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag && !drag.moved && pointers.size === 0) {
        const sqs = pick(e);
        if (sqs.length) onSquare(sqs[0], sqs);
      }
      if (pointers.size === 0) drag = null;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", (e) => { pointers.delete(e.pointerId); drag = null; pinch = null; });
    el.addEventListener("pointerleave", () => { if (hoverMesh.visible) { hoverMesh.visible = false; dirty = true; } });
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      cam.r = Math.max(baseR * 0.6, Math.min(baseR * 1.5, cam.r * (1 + Math.sign(e.deltaY) * 0.08)));
      applyCam();
    }, { passive: false });

    // ---------- O'lcham va sikl ----------
    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const prev = baseR;
      baseR = fitRadius();
      cam.r = cam.r * (baseR / prev);
      applyCam();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    baseR = fitRadius();
    cam.r = baseR;
    this.setOrientation(opts.orientation || "w", false);
    resize();

    let raf = 0, alive = true, lastRender = 0;
    function loop(now) {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (camTween) camTween(now);
      for (let i = tweens.length - 1; i >= 0; i--) {
        const tw = tweens[i];
        const k = Math.min(1, (now - tw.t0) / tw.dur);
        tw.step(k);
        if (k >= 1) { tweens.splice(i, 1); tw.done && tw.done(); }
      }
      let anim = tweens.length > 0 || !!camTween;
      if (checkMesh) { checkMesh.material.opacity = 0.4 + 0.3 * Math.sin(now / 180); anim = true; }
      markGroup.children.forEach((m) => {
        if (m.userData.pulse !== undefined) {
          const s = 1 + 0.12 * Math.sin(now / 260 + m.userData.pulse);
          m.scale.set(s, 1, s);
          anim = true;
        }
      });
      edge.material.opacity = 0.65 + 0.25 * Math.sin(now / 900);
      if (anim || dirty || now - lastRender > 120) {
        renderer.render(scene, camera);
        dirty = false;
        lastRender = now;
      }
    }
    raf = requestAnimationFrame(loop);

    this.flip = function () { this.setOrientation(Math.cos(cam.theta) > 0 ? "b" : "w"); };
    this.resetView = function () { this.setOrientation(Math.cos(cam.theta) > 0 ? "w" : "b"); };
    this.screenOf = (sq) => {
      const p = sqPos(sq), v = new T.Vector3(p.x, 0.05, p.z).project(camera), r = el.getBoundingClientRect();
      return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
    };
    this.snapshot = () => renderer.domElement.toDataURL("image/png");
    this.destroy = function () {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      el.remove();
    };
  }

  window.SofiBoard3D = Board3D;
})();
