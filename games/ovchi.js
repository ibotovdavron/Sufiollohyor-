/* OVCHI — o'yinlar sahifasidagi kirish: ov ruxsatnomasi (sinf testi), saqlash va 3D o'yinni ochish. */
(() => {
  "use strict";
  const G = window.SofiGames;
  if (!G) return;
  const api = G.api;
  const KEY = "sofi_ovchi_v1";
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null, testLibs = null;
  const loadTest = () => testLibs || (testLibs = (async () => {
    if (!window.SofiOvchiBank) await loadScript("games/ovchi-bank.js?v=1");
    if (!window.SofiOvchiPlan) await loadScript("games/ovchi-plan.js?v=1");
    if (!window.SofiOvchiTest) await loadScript("games/ovchi-test.js?v=1");
  })().catch((e) => { testLibs = null; throw e; }));
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.THREE.GLTFLoader) await loadScript("lib/GLTFLoader.js?v=1");
    if (!window.THREE.SkeletonUtils) await loadScript("lib/SkeletonUtils.js?v=1");
    if (!window.SofiFarm3D) await loadScript("games/ferma3d.js?v=6");
    if (!window.SofiOvchi3D) await loadScript("games/ovchi3d.js?v=1");
  })().catch((e) => { libs = null; throw e; }));

  const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const who = () => G.session.name || "Mehmon";
  const DEF = () => ({ money: 0, owned: ["revolver"], cur: "revolver", ammo: 30, bag: [], bagCap: 3, med: 1, kills: {}, earned: 0 });
  const load = () => Object.assign(DEF(), all()[who()] || {});
  const store = (s) => { try { const d = all(); d[who()] = s; localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };

  const TOUCH = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  let root = null, engine = null;
  function applyRot() {
    if (!root) return;
    const g = root.querySelector("[data-game]");
    const want = TOUCH && !g.hidden && innerHeight > innerWidth;
    if (g.classList.contains("rot") !== want) { g.classList.toggle("rot", want); window.dispatchEvent(new Event("resize")); }
  }
  window.addEventListener("resize", () => setTimeout(applyRot, 50));
  window.addEventListener("orientationchange", () => setTimeout(applyRot, 250));

  function shell() {
    if (root) return root;
    root = document.createElement("div");
    root.className = "ov-root";
    root.innerHTML = `<div class="ov-menu" data-menu></div><div class="ov-game" data-game hidden></div>`;
    document.body.appendChild(root);
    document.body.classList.add("ov-open");
    return root;
  }
  function close() {
    if (engine) { engine.destroy(); engine = null; }
    if (root) root.remove(); root = null;
    document.body.classList.remove("ov-open");
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  const teacher = () => G.session.role === "teacher" || G.session.role === "admin";

  async function play() {
    const g = root.querySelector("[data-game]");
    root.querySelector("[data-menu]").innerHTML = "";
    g.hidden = false; applyRot();
    try { if (TOUCH && document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch (e) {}
    g.innerHTML = `<div class="ov-loading"><span>🏹</span><b>Ov maydoni tayyorlanmoqda…</b><i></i></div>`;
    try { await loadLibs(); } catch (e) { g.innerHTML = `<div class="ov-loading"><b>😕 Yuklab bo‘lmadi. Internetni tekshiring.</b></div>`; setTimeout(close, 2200); return; }
    g.innerHTML = "";
    const save = load();
    engine = window.SofiOvchi3D.create(g, {
      save,
      onSave: (s) => store(s),
      onExit: () => { engine = null; close(); },
    });
  }

  async function open() {
    if (!G.session.name && !(await api.askName())) return;
    shell();
    const m = root.querySelector("[data-menu]");
    loadLibs().catch(() => {});
    if (teacher()) return play();
    m.innerHTML = `<div class="ov-loading"><span>🎯</span><b>Test tayyorlanmoqda…</b><i></i></div>`;
    try { await loadTest(); } catch (e) { m.innerHTML = `<div class="ov-loading"><b>😕 Yuklab bo‘lmadi.</b></div>`; setTimeout(close, 2000); return; }
    const T = window.SofiOvchiTest;
    if (T.hasLicense(who())) return play();
    m.innerHTML = "";
    const person = { name: who(), cls: parseInt(G.session.cls) ? G.session.cls : "6-sinf" };
    const ok = await T.run(m, person);
    if (!root) return;
    if (ok) play(); else close();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ov]");
    if (b && b.dataset.ov === "play") open();
  });
  window.SofiOvchi = { open, close, get engine() { return engine; } };
})();
