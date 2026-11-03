/* KIMYO LABORATORIYASI 3D — mantiq va interfeys.
   Reaktivlarni idishga qo'shish, reaksiyalarni aniqlash, pH/harorat/rang, sinovlar,
   yo'riqnomali tajribalar, kashfiyotlar daftari va Mendeleyev jadvali. */
(() => {
  "use strict";
  const G = window.SofiGames;
  const api = G ? G.api : { toast: (t) => console.log(t), beep() {} };
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const hex = (c) => "#" + (c >>> 0).toString(16).padStart(6, "0").slice(-6);

  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  let libs = null;
  const loadLibs = () => libs || (libs = (async () => {
    if (!window.SofiChem) await loadScript("games/kimyo-data.js?v=1");
    if (!window.THREE) await loadScript("lib/three.min.js?v=149");
    if (!window.SofiLab3D) await loadScript("games/kimyo3d.js?v=2");
  })().catch((e) => { libs = null; throw e; }));

  // ---------- Ovozlar (Web Audio) ----------
  let actx = null;
  const ac = () => { if (!actx) { const A = window.AudioContext || window.webkitAudioContext; if (A) actx = new A(); } if (actx && actx.state === "suspended") actx.resume(); return actx; };
  function noise(dur, f0, f1, vol = 0.15, type = "bandpass") {
    const c = ac(); if (!c) return;
    const n = c.createBufferSource(), b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = b; const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, c.currentTime); f.frequency.linearRampToValueAtTime(f1, c.currentTime + dur); f.Q.value = 0.8;
    const g = c.createGain(); g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(c.currentTime + dur);
  }
  const snd = {
    pour: () => noise(1.4, 900, 2400, 0.06),
    powder: () => noise(0.6, 4000, 6000, 0.04, "highpass"),
    clink: () => { api.beep(2400, 0.06, "triangle", 0.05); setTimeout(() => api.beep(3100, 0.05, "triangle", 0.03), 50); },
    drop: () => api.beep(1400, 0.05, "sine", 0.04),
    fizz: () => noise(3, 3000, 5000, 0.05, "highpass"),
    pop: () => { noise(0.25, 300, 120, 0.4, "lowpass"); api.beep(180, 0.15, "sine", 0.08); },
    boom: () => noise(1.2, 200, 60, 0.5, "lowpass"),
    flame: () => noise(1.6, 400, 300, 0.05, "lowpass"),
    ok: () => [660, 880, 1175].forEach((f, i) => setTimeout(() => api.beep(f, 0.12, "triangle", 0.05), i * 90)),
    star: () => [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => api.beep(f, 0.16, "triangle", 0.05), i * 100))
  };

  // ---------- Saqlash ----------
  const who = () => (G && G.session && G.session.name) || "mehmon";
  const KEY = () => "sofi_kimyo_v1:" + who();
  const loadProg = () => { try { return Object.assign({ disc: [], exp: [], flames: [], seenSafety: false }, JSON.parse(localStorage.getItem(KEY())) || {}); } catch (e) { return { disc: [], exp: [], flames: [], seenSafety: false }; } };
  const saveProg = () => { try { localStorage.setItem(KEY(), JSON.stringify(prog)); } catch (e) { /* bo'sh */ } };
  let prog = { disc: [], exp: [], flames: [] };

  // =========================================================
  // KIMYO DVIJOGI
  // =========================================================
  let C = null, scene = null, root = null;
  const S = { cont: new Map(), level: 0, heat: false, gas: null, fired: new Set(), pptAmt: 0, pptCol: 0xffffff, cloud: 0, cloudCol: 0xffffff, colorOverride: null, busy: false, lastInd: null, vessel: "stakan" };
  const isLiquid = (id) => { const r = C.ALL[id]; return r && (r.type === "liquid" || r.kind === "sol") && id !== "h2so4k"; };
  const anyLiquid = () => [...S.cont.keys()].some((id) => S.cont.get(id) > 0 && (C.ALL[id].type === "liquid" || C.ALL[id].kind === "sol"));
  const has = (id) => (id === "suv" ? (S.cont.get("suv") > 0 || [...S.cont.keys()].some((k) => S.cont.get(k) > 0 && isLiquid(k) && !C.ALL[k].acid && !C.ALL[k].base && !["sut"].includes(k))) : S.cont.get(id) > 0);

  function ph() {
    let a = 0, b = 0, wsum = 0, wn = 0;
    S.cont.forEach((n, id) => {
      if (n <= 0) return; const r = C.ALL[id]; if (!r) return;
      if (r.acid) a += n * r.acid; if (r.base) b += n * r.base;
      if (r.weak) { wsum += r.weak * n; wn += n; }
    });
    const net = a - b;
    if (net > 0.05) return Math.max(0.3, 1.5 - Math.log10(net));
    if (net < -0.05) return Math.min(13.8, 12.6 + Math.log10(-net));
    if (wn) return wsum / wn;
    return anyLiquid() ? 7 : null;
  }
  const IND = {
    fenol: (p) => (p < 8.2 ? null : p < 10 ? 0xff4fa0 : 0xe0108a),
    lakmus: (p) => (p < 5 ? 0xe0303a : p < 8 ? 0x8a4ab0 : 0x2a5ad9),
    metilor: (p) => (p < 3.1 ? 0xe0303a : p < 4.4 ? 0xf08a1a : 0xf2c41a),
    univ: (p) => { const st = [[1, 0xe0262b], [3, 0xf07a1a], [5, 0xf2d21a], [7, 0x3cb44a], [9, 0x2a7ad9], [11, 0x3a3ab0], [13, 0x7a2ab0]]; return lerpStops(st, p); },
    karam: (p) => { const st = [[2, 0xd81b4a], [4, 0xd84a8a], [6.5, 0x7a3a9a], [8, 0x3a5ab0], [10, 0x2a9a7a], [12.5, 0xb8c83a]]; return lerpStops(st, p); }
  };
  function lerpStops(st, p) {
    if (p <= st[0][0]) return st[0][1]; if (p >= st[st.length - 1][0]) return st[st.length - 1][1];
    for (let i = 1; i < st.length; i++) if (p <= st[i][0]) { const k = (p - st[i - 1][0]) / (st[i][0] - st[i - 1][0]); return mix(st[i - 1][1], st[i][1], k); }
    return st[0][1];
  }
  function mix(a, b, k) { const ar = a >> 16, ag = (a >> 8) & 255, ab = a & 255, br = b >> 16, bg = (b >> 8) & 255, bb = b & 255; return (Math.round(ar + (br - ar) * k) << 16) | (Math.round(ag + (bg - ag) * k) << 8) | Math.round(ab + (bb - ab) * k); }
  const indicatorOf = () => ["karam", "univ", "lakmus", "metilor", "fenol"].find((i) => S.cont.get(i === "karam" ? "karam" : i === "fenol" ? "fenol" : i) > 0);

  function liquidColor() {
    if (S.colorOverride != null) return { color: S.colorOverride, opacity: 0.82 };
    let r = 0, g = 0, b = 0, w = 0, opaque = false;
    S.cont.forEach((n, id) => {
      if (n <= 0) return; const s = C.ALL[id]; if (!s) return;
      if (s.opaque) opaque = true;
      const c = s.kind === "sol" ? s.color : s.type === "liquid" ? s.color : s.sol;
      if (c != null && (s.type !== "solid" || anyLiquid())) { r += (c >> 16) * n; g += ((c >> 8) & 255) * n; b += (c & 255) * n; w += n; }
    });
    let color = 0xdcecf4, opacity = 0.32;
    if (w) { color = (Math.round(r / w) << 16) | (Math.round(g / w) << 8) | Math.round(b / w); opacity = 0.7; }
    const ind = indicatorOf(), p = ph();
    if (ind && p != null) { const ic = IND[ind](p); if (ic != null) { color = w ? mix(color, ic, 0.85) : ic; opacity = 0.78; } }
    if (opaque) opacity = 0.96;
    return { color, opacity };
  }
  function refresh() {
    if (!scene) return;
    const lc = liquidColor();
    scene.setLiquid({ level: S.level, color: lc.color, opacity: lc.opacity, cloud: S.cloud, cloudColor: S.cloudCol });
    // quruq kukunlar (suyuqliksiz) idish tubida uyum bo'lib ko'rinadi
    const solids = [...S.cont.entries()].filter(([id, n]) => n > 0 && C.ALL[id] && (C.ALL[id].type === "solid" || C.ALL[id].kind === "solid"));
    if (!anyLiquid() && solids.length) { const last = C.ALL[solids[solids.length - 1][0]]; scene.setPpt(Math.max(1, solids.length) + S.pptAmt, last.color != null ? last.color : 0xffffff); }
    else scene.setPpt(S.pptAmt, S.pptCol);
    drawInfo();
  }

  const ORDERED = () => C.RX.slice().sort((a, b) => b.need.length - a.need.length);
  function evaluate(heatCheck) {
    let fired = 0;
    for (let pass = 0; pass < 4; pass++) {
      let any = false;
      for (const rx of ORDERED()) {
        if (rx.heat && !(heatCheck && S.heat)) continue;
        if (rx.alone && anyLiquid()) continue;
        if (!rx.heat && !anyLiquid()) continue; // qizdirilmaydigan reaksiyalar eritmada boradi
        if (!rx.need.every(has)) continue;
        const use = rx.use || rx.need;
        if (!use.length && S.fired.has(rx.id)) continue;
        if (rx.id === "bug" && S.level < 0.02) continue;
        apply(rx); any = true; fired++;
        if (fired > 3) return;
      }
      if (!any) break;
    }
    // indikator kuzatuvi (qizil karam tajribasi va h.k.)
    const ind = indicatorOf(), p = ph();
    if (ind && p != null) {
      const zone = p < 5 ? "kislota" : p > 9 ? "ishqor" : "neytral";
      const key = ind + ":" + zone;
      if (S.lastInd !== key) {
        S.lastInd = key;
        showCard({ name: `Indikator: ${C.ALL[ind].name}`, eq: `pH ≈ ${p.toFixed(1)} — ${zone === "kislota" ? "kislotali muhit" : zone === "ishqor" ? "ishqoriy muhit" : "neytral muhit"}`,
          text: indText(ind, zone), life: ind === "karam" ? "Qizil karam, qora smorodina va qora uzumdagi antotsianlar — tabiiy indikatorlar. Uyda ham sinab ko‘rish mumkin!" : "Indikatorlar yordamida tuproq, suv va oziq-ovqat kislotaliligi aniqlanadi.", safe: "Indikator eritmalarini ichmang." }, "ind");
        if (ind === "karam" && zone !== "neytral") markExp("e_karam");
        discover("ind_" + ind + "_" + zone);
      }
    }
    refresh();
  }
  function indText(ind, zone) {
    const T = {
      fenol: { kislota: "Fenolftalein kislotali va neytral muhitda rangsiz.", neytral: "Fenolftalein rangsiz — eritma neytral.", ishqor: "Fenolftalein ishqoriy muhitda to‘q pushti rangga kiradi!" },
      lakmus: { kislota: "Lakmus kislotada qizaradi.", neytral: "Lakmus neytral muhitda binafsha.", ishqor: "Lakmus ishqorda ko‘karadi." },
      metilor: { kislota: "Metiloranj kislotada qizil-pushti.", neytral: "Metiloranj neytral muhitda sariq.", ishqor: "Metiloranj ishqorda sariq." },
      univ: { kislota: "Universal indikator: qizil — to‘q sariq ranglar kislotani bildiradi.", neytral: "Yashil rang — neytral muhit (pH ≈ 7).", ishqor: "Ko‘k — binafsha ranglar ishqoriy muhitni bildiradi." },
      karam: { kislota: "Qizil karam sharbati kislotada pushti-qizil bo‘ladi.", neytral: "Neytral muhitda binafsha.", ishqor: "Ishqorda ko‘k-yashil, kuchli ishqorda sarg‘ish-yashil!" }
    };
    return (T[ind] || {})[zone] || "";
  }
  function apply(rx) {
    const use = rx.use || rx.need;
    use.forEach((id) => { if (id === "suv") return; S.cont.set(id, Math.max(0, (S.cont.get(id) || 0) - 1)); });
    rx.make.forEach((id) => S.cont.set(id, (S.cont.get(id) || 0) + 1));
    if (!use.length) S.fired.add(rx.id);
    const fx = rx.fx || {};
    const go = () => {
      if (!scene) return;
      if (fx.bubbles) { scene.bubbles(fx.bubbles, fx.slow ? 14 : 8); snd.fizz(); }
      if (fx.gas) S.gas = { type: fx.gas, until: Date.now() + 25000 };
      if (fx.foam) scene.foam(fx.foam);
      if (fx.heat) scene.setTemp(Math.min(100, scene.getTemp() + fx.heat));
      if (fx.cool) scene.setTemp(scene.getTemp() - fx.cool);
      if (fx.ppt) { S.pptAmt += 1; S.pptCol = fx.ppt; scene.precipitate(fx.ppt, 1); }
      if (fx.cloudy) { S.cloud = 0.75; S.cloudCol = fx.cloudy; }
      if (fx.coat) scene.coatMetal(fx.coat, fx.slow ? 9 : 5);
      if (fx.metalShrink) scene.shrinkMetal(10);
      if (fx.crystals) scene.crystals(fx.crystals);
      if (fx.sodium) { scene.sodium(fx.sodium, 6); snd.fizz(); }
      if (fx.flash) { scene.flash(fx.flash, fx.bright ? 4 : 1.6); if (fx.bright) snd.flame(); else snd.pop(); }
      if (fx.steam) scene.steam(6);
      if (fx.smoke) scene.smoke(fx.smoke, 5);
      if (fx.glow) scene.glow(fx.glow, 5);
      if (fx.mirror) scene.mirror();
      if (fx.snake) { scene.snake(); snd.fizz(); }
      if (fx.evaporate) { const from = S.level; let t = 0; const iv = setInterval(() => { t += 0.1; S.level = Math.max(0, from * (1 - t / 6)); refresh(); if (t >= 6) { clearInterval(iv); S.cont.set("suv", 0); S.pptAmt += 1; S.pptCol = 0xffffff; scene.precipitate(0xffffff, 1); refresh(); } }, 100); }
      if (fx.color || fx.decolor) S.colorOverride = null;
      if (fx.curd) { S.cloud = 0.3; S.cloudCol = 0xfdf6d8; }
      refresh();
    };
    if (fx.delay) setTimeout(go, fx.delay * 1000); else go();
    showCard(rx, rx.id);
    discover(rx.id);
    // cho'p sinovi kerak bo'lgan tajribalar sinovdan keyin bajarilgan hisoblanadi
    C.EXP.filter((e) => e.rx === rx.id && !e.steps.some((x) => x === "@splint" || x === "@ember")).forEach((e) => markExp(e.id));
  }
  function discover(id) {
    if (!id || prog.disc.includes(id)) return;
    prog.disc.push(id); saveProg(); drawBar();
    if (C.RX.find((r) => r.id === id)) { snd.ok(); api.toast("🔬 Yangi kashfiyot! " + C.RX.find((r) => r.id === id).name, "good"); }
  }
  function markExp(id) {
    if (!id) return;
    if (guided && guided.id === id) { guided.done = true; drawGuide(); }
    if (prog.exp.includes(id)) return;
    prog.exp.push(id); saveProg(); drawBar();
    const e = C.EXP.find((x) => x.id === id);
    setTimeout(() => { snd.star(); confetti(); api.toast(`⭐ Tajriba bajarildi: ${e ? e.title : ""}`, "good"); }, 1200);
  }

  // ---------- Qo'shish ----------
  const LEVEL_STEP = { stakan: 0.17, kolba: 0.16, probirka: 0.22, silindr: 0.13, kristallizator: 0.24, tigel: 0.3, chinni: 0.3 };
  async function addReagent(id) {
    if (!scene) return;
    if (S.busy) { hint("⏳ Kuting — oldingi modda quyilmoqda"); return; }
    const r = C.ALL[id];
    if (r.danger && /o‘qituvchi/i.test(r.danger) && !confirm(`⚠️ ${r.name}: ${r.danger}.\n\nHaqiqiy hayotda bu modda bilan faqat o‘qituvchi ishlaydi. Virtual laboratoriyada davom etamizmi?`)) return;
    S.busy = true; drawTools();
    let to = null;
    if (r.type === "liquid") {
      to = S.level + (LEVEL_STEP[S.vessel] || 0.17);
      if (to > 0.92) { api.toast("Idish to‘ldi! Avval to‘king yoki kattaroq idish oling.", "bad"); S.busy = false; drawTools(); return; }
      snd.pour();
    } else if (r.type === "solid") snd.powder();
    else if (r.type === "indicator") snd.drop();
    else snd.clink();
    const color = r.type === "indicator" ? (IND[r.ind] ? IND[r.ind](7) || 0xf4f4f4 : 0xf4f4f4) : r.color;
    if (r.type === "metal") await scene.pour("metal", null, { shape: r.shape, metalColor: r.color });
    else await scene.pour(r.type, color, { toLevel: to, opaque: r.opaque });
    if (to != null) S.level = to;
    S.cont.set(id, (S.cont.get(id) || 0) + 1);
    if (guided) stepGuide(id);
    S.busy = false;
    evaluate(false);
    drawTools();
  }
  async function tool(t) {
    if (!scene || S.busy) return;
    if (t === "heat") {
      S.heat = !S.heat; scene.heat(S.heat);
      if (S.heat) { snd.flame(); if (guided) stepGuide("@heat"); setTimeout(() => { if (S.heat) evaluate(true); }, 2600); setTimeout(() => { if (S.heat) evaluate(true); }, 6000); }
      drawTools(); return;
    }
    if (t === "empty") { scene.clearAll(); S.cont.clear(); S.level = 0; S.fired.clear(); S.pptAmt = 0; S.cloud = 0; S.colorOverride = null; S.gas = null; S.lastInd = null; refresh(); hint("🗑️ Idish yuvildi — yangi tajriba!"); return; }
    if (t === "stir") { hint("🥄 Shisha tayoqcha bilan aralashtirildi"); evaluate(S.heat); return; }
    if (t === "co2") { if (!anyLiquid()) { hint("Avval idishga suyuqlik quying"); return; } S.busy = true; await scene.straw(); S.busy = false; S.cont.set("co2", (S.cont.get("co2") || 0) + 1); if (guided) stepGuide("@co2"); evaluate(false); if (!S.cont.get("caoh2")) hint("🌬️ Nafasdagi CO₂ eritmaga o‘tdi — o‘zgarish sezilmadi (ohak suvi kerak)"); return; }
    if (t === "splint" || t === "ember") {
      const g = S.gas && S.gas.until > Date.now() ? S.gas.type : null;
      let result = "none", card = null;
      if (t === "splint") {
        if (g === "H2") { result = "pop"; card = { name: "Vodorodni aniqlash", eq: "2H₂ + O₂ → 2H₂O", text: "Yonib turgan cho‘p vodorod to‘plangan idish og‘ziga keltirilganda “pop!” — kichik portlash eshitildi. Vodorod kislorod bilan juda tez birikib, suv hosil qiladi.", life: "Vodorod — kelajakning toza yoqilg‘isi: yonganda faqat suv hosil bo‘ladi.", safe: "Vodorod ko‘p to‘plansa xavfli portlaydi!" }; snd.pop(); discover("test_h2"); markExp("e_vodorod"); }
        else if (g === "CO2") { result = "out"; card = { name: "Karbonat angidridni aniqlash", eq: "CO₂ yonishni ta’minlamaydi", text: "Cho‘p o‘chib qoldi — idishda karbonat angidrid bor. U havodan og‘ir va yonishga yordam bermaydi.", life: "O‘t o‘chirgichlar CO₂ bilan olovni o‘chiradi.", safe: "Yopiq xonada ko‘p CO₂ nafas olishni qiyinlashtiradi." }; discover("test_co2"); }
        else if (g === "O2") { result = "relight"; card = { name: "Kislorodda yonish", eq: "C + O₂ → CO₂", text: "Kislorodda cho‘p ancha yorqin yonadi.", life: "Kislorod yonishni kuchaytiradi.", safe: "Kislorod ballonlari yonida olov yoqilmaydi." }; }
        else hint("🔥 Hech narsa bo‘lmadi — idishda maxsus gaz yo‘q");
      } else {
        if (g === "O2") { result = "relight"; card = { name: "Kislorodni aniqlash", eq: "C + O₂ → CO₂", text: "Cho‘g‘langan cho‘p kislorodda qaytadan alangalanib ketdi! Bu kislorodni aniqlashning klassik usuli.", life: "Kislorod nafas olish va yonish uchun zarur.", safe: "Ehtiyot bo‘ling — cho‘p birdan alangalanadi." }; discover("test_o2"); markExp("e_kislorod"); snd.flame(); }
        else if (g) { result = "out"; hint("✨ Cho‘g‘ o‘chdi — kislorod yo‘q"); }
        else hint("✨ Cho‘g‘ o‘zgarmadi — idishda kislorod ajralmayapti");
      }
      S.busy = true; await scene.splint(t, result); S.busy = false;
      if (card) showCard(card, "test");
      return;
    }
    if (t === "flame") { openFlame(); return; }
    if (t === "vessel") { openVessels(); return; }
    if (t === "view") { roomView = !roomView; scene.view(roomView ? "room" : "close"); drawTools(); return; }
  }
  let roomView = false;

  function openFlame() {
    const list = Object.keys(C.FLAME);
    sheet(`<h2>🔥 Alanga sinovi</h2><p class="kl-muted">Platina (nixrom) simni tuz eritmasiga botirib, gorelka alangasiga tutamiz. Har bir metall ioni alangani o‘z rangiga bo‘yaydi.</p>
      <div class="kl-grid">${list.map((id) => `<button type="button" class="kl-chipbtn" data-fl="${id}"><i style="background:${hex(C.FLAME[id].color)}"></i><b>${esc(C.ALL[id].name)}</b><small>${esc(C.ALL[id].f)}</small></button>`).join("")}</div>`);
    $$("[data-fl]", root).forEach((b) => (b.onclick = async () => {
      closeSheet();
      const id = b.dataset.fl, F = C.FLAME[id];
      S.busy = true; snd.flame();
      await scene.flameTest(F.color);
      S.busy = false; scene.view(roomView ? "room" : "close");
      showCard({ name: `Alanga sinovi: ${F.name}`, eq: `${C.ALL[id].f} → alanga rangi`, text: F.text + " Elektronlar qizib yuqori energetik holatga o‘tadi va qaytishda ma’lum rangdagi nur chiqaradi.", life: "Salyutlardagi ranglar aynan shu tuzlar tufayli! Astronomlar yulduzlar tarkibini ham shu nurlar orqali aniqlaydi.", safe: "Alangadan uzoqroq turing, sochni yig‘ing." }, "flame");
      if (guided) stepGuide("@flame");
      if (!prog.flames.includes(id)) { prog.flames.push(id); saveProg(); }
      discover("flame_" + id);
      if (prog.flames.length >= 3) markExp("e_alanga");
    }));
  }
  function openVessels() {
    const V = window.SofiLab3D.VESSELS, N = window.SofiLab3D.VESSEL_NAMES, IC = { stakan: "🥛", kolba: "⚗️", probirka: "🧪", silindr: "📏", kristallizator: "🥣", tigel: "🏺", chinni: "🍶" };
    sheet(`<h2>🧪 Idish tanlash</h2><p class="kl-muted">Idish almashtirilganda eski idish yuviladi.</p><div class="kl-grid">${V.map((v) => `<button type="button" class="kl-chipbtn ${v === S.vessel ? "on" : ""}" data-v="${v}"><span>${IC[v]}</span><b>${esc(N[v])}</b></button>`).join("")}</div>`);
    $$("[data-v]", root).forEach((b) => (b.onclick = () => { closeSheet(); setVessel(b.dataset.v); }));
  }
  function setVessel(v) { S.vessel = v; scene.setVessel(v); tool("empty"); scene.view(roomView ? "room" : "close"); drawTools(); }

  // =========================================================
  // INTERFEYS
  // =========================================================
  let cat = "kislota", guided = null, atom = null;
  function shell() {
    root = document.createElement("div");
    root.className = "kl";
    root.innerHTML = `
      <header class="kl-bar">
        <button class="kl-exit" type="button">← Chiqish</button>
        <div class="kl-brand"><span>⚗️</span><b>KIMYO LABORATORIYASI</b><em>3D</em></div>
        <div class="kl-bar-r">
          <button type="button" class="kl-top" data-open="exp">📋 <b>Tajribalar</b></button>
          <button type="button" class="kl-top" data-open="table">🔬 <b>Jadval</b></button>
          <button type="button" class="kl-top" data-open="journal" id="klJ">📒 <b>0</b></button>
        </div>
      </header>
      <div class="kl-world" id="klWorld">
        <div class="kl-loading" id="klLoading"><div class="kl-load-art"><i></i><i></i><i></i></div><b>Laboratoriya tayyorlanmoqda…</b><p>Shisha idishlar yuvilmoqda 🧪</p></div>
        <aside class="kl-info" id="klInfo"></aside>
        <div class="kl-card" id="klCard" hidden></div>
        <div class="kl-guide" id="klGuide" hidden></div>
        <div class="kl-hint" id="klHint" hidden></div>
      </div>
      <section class="kl-panel" id="klPanel"></section>
      <section class="kl-sheet" id="klSheet" hidden><button class="kl-sheet-x" type="button" aria-label="Yopish">✕</button><div class="kl-sheet-in" id="klSheetIn"></div></section>`;
    document.body.appendChild(root);
    document.body.classList.add("g-playing", "kl-open");
    requestAnimationFrame(() => root && root.classList.add("show"));
    $(".kl-exit", root).onclick = close;
    $(".kl-sheet-x", root).onclick = closeSheet;
    $$("[data-open]", root).forEach((b) => (b.onclick = () => openPanel(b.dataset.open)));
  }
  function close() {
    if (atom) { atom.destroy(); atom = null; }
    if (scene) { try { scene.destroy(); } catch (e) { /* bo'sh */ } }
    scene = null; guided = null;
    if (root) root.remove(); root = null;
    document.body.classList.remove("g-playing", "kl-open");
  }
  async function open(first) {
    if (root) close();
    prog = loadProg();
    shell();
    try { await loadLibs(); } catch (e) { $("#klLoading", root).innerHTML = "<b>❌ Fayllar yuklanmadi. Internetni tekshiring.</b>"; return; }
    if (!root) return;
    C = window.SofiChem;
    try { scene = new window.SofiLab3D($("#klWorld", root), { onPick: (w) => { if (w === "jadval") openPanel("table"); else if (w === "javon") hint("🧴 Reaktivlarni pastdagi paneldan tanlang"); } }); }
    catch (e) { $("#klLoading", root).innerHTML = "<b>😔 Qurilmangiz 3D grafikani qo‘llamaydi (WebGL).</b>"; return; }
    $("#klLoading", root).remove();
    S.cont.clear(); S.level = 0; S.fired.clear(); S.pptAmt = 0; S.cloud = 0; S.gas = null; S.heat = false; S.vessel = "stakan"; S.lastInd = null;
    drawBar(); drawPanel(); drawTools(); refresh();
    if (!prog.seenSafety) safety(first);
    else if (first) openPanel(first);
  }
  function safety(after) {
    sheet(`<div class="kl-welcome"><div class="kl-big">🥽</div><h2>Xush kelibsiz, yosh kimyogar!</h2>
      <p>Bu — haqiqiy laboratoriyaga o‘xshash <b>virtual</b> laboratoriya. Bu yerda istalgan tajribani xavfsiz bajarishingiz mumkin.</p>
      <div class="kl-rules">
        <div>🥽 Haqiqiy laboratoriyada doim himoya ko‘zoynagi va xalat kiying.</div>
        <div>👩‍🏫 Haqiqiy tajribalarni faqat o‘qituvchi ruxsati va nazoratida bajaring.</div>
        <div>👃 Moddalarni hidlamang, tatib ko‘rmang, qo‘l bilan ushlamang.</div>
        <div>⚠️ “Faqat o‘qituvchi” belgisi bor moddalar uyda yoki yolg‘iz ishlatilmaydi.</div>
      </div>
      <p class="kl-muted">Pastdan modda tanlang — u idishga quyiladi. 🔥 bilan qizdiring, 📋 Tajribalar ro‘yxatidan boshlang yoki 🔬 Mendeleyev jadvalini o‘rganing.</p>
      <button type="button" class="kl-btn gold" id="klGo">Tushundim, boshladik! 🧪</button></div>`);
    $("#klGo", root).onclick = () => { prog.seenSafety = true; saveProg(); closeSheet(); if (after) openPanel(after); };
  }
  function drawBar() { const j = root && $("#klJ", root); if (j) j.innerHTML = `📒 <b>${prog.disc.filter((d) => C && C.RX.find((r) => r.id === d)).length}/${C ? C.RX.length : 0}</b>`; }
  function drawPanel() {
    const box = $("#klPanel", root);
    box.innerHTML = `<div class="kl-tools" id="klTools"></div>
      <div class="kl-cats">${C.CATEGORIES.map((c) => `<button type="button" class="${c.id === cat ? "on" : ""}" data-cat="${c.id}">${c.icon} ${esc(c.name)}</button>`).join("")}</div>
      <div class="kl-items">${C.REAGENTS.filter((r) => r.cat === cat).map((r) => {
        const sw = r.type === "indicator" ? (IND[r.ind] ? hex(IND[r.ind](r.ind === "fenol" ? 9 : 7) || 0xeeeeee) : "#eee") : r.color != null ? hex(r.color) : "#e6f2f8";
        return `<button type="button" class="kl-item ${r.danger ? "warn" : ""}" data-r="${r.id}" title="${esc(r.danger || "")}">
          <span class="sw ${r.type}" style="--c:${sw}"></span><b>${esc(r.name)}</b><small>${esc(r.f)}</small>${r.danger && /o‘qituvchi/i.test(r.danger) ? `<em>⚠️</em>` : ""}</button>`;
      }).join("")}</div>`;
    $$("[data-cat]", box).forEach((b) => (b.onclick = () => { cat = b.dataset.cat; drawPanel(); drawTools(); }));
    $$("[data-r]", box).forEach((b) => (b.onclick = () => addReagent(b.dataset.r)));
    drawTools();
    if (guided) highlightGuide();
  }
  function drawTools() {
    const box = root && $("#klTools", root);
    if (!box) return;
    const b = (id, ico, label, on) => `<button type="button" class="kl-tool ${on ? "on" : ""}" data-t="${id}" ${S.busy ? "disabled" : ""}><span>${ico}</span><b>${label}</b></button>`;
    box.innerHTML = b("heat", "🔥", S.heat ? "O‘chirish" : "Qizdirish", S.heat) + b("stir", "🥄", "Aralashtirish") + b("splint", "🕯️", "Yonuvchi cho‘p") + b("ember", "✨", "Cho‘g‘ cho‘p") +
      b("co2", "🌬️", "Puflash (CO₂)") + b("flame", "🌈", "Alanga sinovi") + b("vessel", "🧪", window.SofiLab3D ? window.SofiLab3D.VESSEL_NAMES[S.vessel] : "Idish") + b("view", roomView ? "🔬" : "🏫", roomView ? "Yaqin" : "Xona") + b("empty", "🗑️", "To‘kish");
    $$("[data-t]", box).forEach((x) => (x.onclick = () => tool(x.dataset.t)));
  }
  function drawInfo() {
    const box = root && $("#klInfo", root);
    if (!box || !scene) return;
    const items = [...S.cont.entries()].filter(([id, n]) => n > 0 && id !== "co2");
    const p = ph();
    const pc = p == null ? "#9aa" : hex(IND.univ(p));
    box.innerHTML = `<div class="kl-info-h">🧪 ${esc(scene.vesselName())}</div>
      <div class="kl-meters">
        <div><small>pH</small><b style="color:${pc}">${p == null ? "—" : p.toFixed(1)}</b></div>
        <div><small>Harorat</small><b id="klT">${Math.round(scene.getTemp())}°C</b></div>
        <div><small>Hajm</small><b>${Math.round(S.level * 100)}%</b></div>
      </div>
      ${p != null ? `<div class="kl-phbar"><i style="left:${(p / 14) * 100}%"></i></div>` : ""}
      <div class="kl-cont">${items.length ? items.map(([id, n]) => `<span>${esc(C.ALL[id].f || C.ALL[id].name)}${n > 1 ? ` ×${n}` : ""}</span>`).join("") : `<em>Idish bo‘sh — pastdan modda tanlang</em>`}</div>
      ${S.gas && S.gas.until > Date.now() ? `<div class="kl-gas">💨 Ajralayotgan gaz: <b>${{ H2: "H₂ (vodorod)", CO2: "CO₂", O2: "O₂ (kislorod)" }[S.gas.type]}</b></div>` : ""}`;
  }
  setInterval(() => { const t = root && $("#klT", root); if (t && scene) t.textContent = Math.round(scene.getTemp()) + "°C"; }, 500);
  function showCard(rx, kind) {
    const c = $("#klCard", root);
    if (!c) return;
    c.hidden = false;
    c.innerHTML = `<button class="kl-card-x" type="button">✕</button>
      <div class="kl-card-h"><span>${kind === "flame" ? "🌈" : kind === "ind" ? "🎨" : kind === "test" ? "🔎" : "⚗️"}</span><b>${esc(rx.name)}</b></div>
      ${rx.eq ? `<div class="kl-eq">${esc(rx.eq)}</div>` : ""}
      <p>${esc(rx.text || "")}</p>
      ${rx.life ? `<p class="kl-life">🌍 <b>Hayotda:</b> ${esc(rx.life)}</p>` : ""}
      ${rx.safe ? `<p class="kl-safe">⚠️ ${esc(rx.safe)}</p>` : ""}`;
    $(".kl-card-x", c).onclick = () => { c.hidden = true; };
  }
  function hint(t, ms = 2200) { const h = root && $("#klHint", root); if (!h) return; h.hidden = false; h.textContent = t; clearTimeout(hint.t); hint.t = setTimeout(() => (h.hidden = true), ms); }
  function sheet(html) { const s = $("#klSheet", root); s.hidden = false; $("#klSheetIn", root).innerHTML = html; }
  function closeSheet() { const s = root && $("#klSheet", root); if (s) s.hidden = true; if (atom) { atom.destroy(); atom = null; } }

  // ---------- Panellar ----------
  function openPanel(name) {
    if (name === "exp") {
      sheet(`<h2>📋 Tajribalar <small>${prog.exp.length}/${C.EXP.length} ⭐</small></h2>
        <p class="kl-muted">Tajribani tanlang — qadamlar ko‘rsatiladi. Har bir bajarilgan tajriba uchun ⭐ olasiz.</p>
        <div class="kl-exps">${C.EXP.map((e) => `<button type="button" class="kl-exp ${prog.exp.includes(e.id) ? "done" : ""}" data-e="${e.id}"><span>${e.icon}</span><b>${esc(e.title)}</b><small>${esc(e.note)}</small>${prog.exp.includes(e.id) ? "<em>⭐</em>" : ""}</button>`).join("")}</div>`);
      $$("[data-e]", root).forEach((b) => (b.onclick = () => startGuide(b.dataset.e)));
    } else if (name === "journal") {
      const done = C.RX.filter((r) => prog.disc.includes(r.id));
      sheet(`<h2>📒 Kashfiyotlar daftari <small>${done.length}/${C.RX.length}</small></h2>
        <p class="kl-muted">Siz kashf etgan reaksiyalar. Qolganlarini topish uchun turli moddalarni aralashtirib ko‘ring!</p>
        <div class="kl-journal">${C.RX.map((r) => prog.disc.includes(r.id)
          ? `<div class="kl-jr"><b>✅ ${esc(r.name)}</b><code>${esc(r.eq)}</code></div>`
          : `<div class="kl-jr locked"><b>🔒 ???</b><small>${r.need.length} ta modda${r.heat ? " + qizdirish" : ""}</small></div>`).join("")}</div>`);
    } else if (name === "table") openTable();
  }
  function startGuide(id) {
    const e = C.EXP.find((x) => x.id === id);
    closeSheet();
    guided = { ...e, step: 0, done: false };
    if (e.vessel && e.vessel !== S.vessel) setVessel(e.vessel); else tool("empty");
    drawGuide();
    highlightGuide();
  }
  function stepName(s) { if (s[0] !== "@") return (C.ALL[s] || {}).name || s; return { "@heat": "🔥 Qizdiring", "@splint": "🕯️ Yonuvchi cho‘pni yaqinlashtiring", "@ember": "✨ Cho‘g‘langan cho‘pni tushiring", "@co2": "🌬️ Somoncha bilan puflang", "@flame": "🌈 Alanga sinovi (3 xil tuz)" }[s]; }
  function stepGuide(token) {
    if (!guided) return;
    const want = guided.steps[guided.step];
    if (want === token) { guided.step++; snd.drop(); }
    drawGuide(); highlightGuide();
  }
  function drawGuide() {
    const g = $("#klGuide", root);
    if (!guided) { g.hidden = true; return; }
    g.hidden = false;
    g.innerHTML = `<div class="kl-guide-h"><span>${guided.icon}</span><b>${esc(guided.title)}</b><button type="button" class="kl-card-x" data-gx>✕</button></div>
      <ol>${guided.steps.map((s, i) => `<li class="${i < guided.step ? "ok" : i === guided.step ? "now" : ""}">${i < guided.step ? "✅" : i === guided.step ? "👉" : "▫️"} ${esc(stepName(s))}${s[0] !== "@" && C.ALL[s] && C.ALL[s].f ? ` <code>${esc(C.ALL[s].f)}</code>` : ""}</li>`).join("")}</ol>
      ${guided.done ? `<div class="kl-guide-ok">⭐ Barakalla! Tajriba bajarildi.</div>` : guided.step >= guided.steps.length ? `<div class="kl-guide-ok wait">Kuzating… 👀</div>` : `<small class="kl-muted">${esc(guided.note)}</small>`}`;
    $("[data-gx]", g).onclick = () => { guided = null; drawGuide(); highlightGuide(); };
  }
  function highlightGuide() {
    $$(".kl-item.next, .kl-tool.next, .kl-cats .next", root).forEach((x) => x.classList.remove("next"));
    if (!guided || guided.step >= guided.steps.length) return;
    const s = guided.steps[guided.step];
    if (s[0] === "@") { const map = { "@heat": "heat", "@splint": "splint", "@ember": "ember", "@co2": "co2", "@flame": "flame" }; const b = $(`[data-t="${map[s]}"]`, root); if (b) b.classList.add("next"); return; }
    const r = C.ALL[s];
    if (r && r.cat !== cat) { const cb = $(`[data-cat="${r.cat}"]`, root); if (cb) cb.classList.add("next"); }
    const ib = $(`[data-r="${s}"]`, root); if (ib) { ib.classList.add("next"); ib.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }
  }

  // ---------- Mendeleyev jadvali ----------
  function openTable() {
    const E = C.ELEMENTS;
    const cell = (e) => `<button type="button" class="kl-el" data-z="${e.z}" style="--c:${e.color};grid-column:${e.f !== undefined ? 3 + e.f + 1 : e.group};grid-row:${e.f !== undefined ? (e.period === 6 ? 9 : 10) : e.period}"><small>${e.z}</small><b>${e.sym}</b><i>${esc(e.name)}</i></button>`;
    sheet(`<h2>🔬 Mendeleyev davriy jadvali <small>118 element</small></h2>
      <div class="kl-tbar"><input type="search" class="kl-search" placeholder="🔎 Nomi yoki belgisi: Temir, Fe, 26…"><div class="kl-legend">${Object.entries(C.CATS).map(([k, c]) => `<button type="button" data-cf="${k}"><i style="background:${c.color}"></i>${esc(c.name)}</button>`).join("")}</div></div>
      <div class="kl-ptable-wrap"><div class="kl-ptable">
        ${E.map(cell).join("")}
        <div class="kl-lanlabel" style="grid-column:3;grid-row:6">57–71</div><div class="kl-lanlabel" style="grid-column:3;grid-row:7">89–103</div>
        <div class="kl-frow" style="grid-column:1/4;grid-row:9">Lantanoidlar</div><div class="kl-frow" style="grid-column:1/4;grid-row:10">Aktinoidlar</div>
      </div></div>`);
    const s = $("#klSheet", root); s.classList.add("wide");
    const inp = $(".kl-search", root);
    inp.oninput = () => { const v = inp.value.trim().toLowerCase(); $$(".kl-el", root).forEach((b) => { const e = E[b.dataset.z - 1]; b.classList.toggle("dim", !!v && !(e.name.toLowerCase().includes(v) || e.sym.toLowerCase() === v || String(e.z) === v)); }); };
    let cf = null;
    $$("[data-cf]", root).forEach((b) => (b.onclick = () => { cf = cf === b.dataset.cf ? null : b.dataset.cf; $$("[data-cf]", root).forEach((x) => x.classList.toggle("on", x.dataset.cf === cf)); $$(".kl-el", root).forEach((x) => x.classList.toggle("dim", !!cf && E[x.dataset.z - 1].cat !== cf)); }));
    $$(".kl-el", root).forEach((b) => (b.onclick = () => openElement(+b.dataset.z)));
    const obs = new MutationObserver(() => { if (s.hidden) { s.classList.remove("wide"); obs.disconnect(); } }); obs.observe(s, { attributes: true });
  }
  function openElement(z) {
    const e = C.ELEMENTS[z - 1];
    const inLab = C.REAGENTS.filter((r) => new RegExp("(^|[^a-z])" + e.sym + "(?![a-z])").test(r.f || "")).slice(0, 6);
    if (atom) { atom.destroy(); atom = null; }
    sheet(`<div class="kl-elcard" style="--c:${e.color}">
      <div class="kl-elhead">
        <div class="kl-elbig"><small>${e.z}</small><b>${e.sym}</b><i>${e.mass}</i></div>
        <div><h2>${esc(e.name)}</h2><p class="kl-cat">${esc(e.catName)}${e.radio ? " · ☢️ radioaktiv" : ""}</p><p class="kl-muted">${e.period}-davr · ${e.f !== undefined ? (e.period === 6 ? "lantanoidlar" : "aktinoidlar") : e.group + "-guruh"} · ${esc(e.stateName)}</p></div>
      </div>
      <div class="kl-atom" id="klAtom"></div>
      <div class="kl-facts">
        <div><small>Atom raqami (protonlar)</small><b>${e.z}</b></div>
        <div><small>Atom massasi</small><b>${e.mass}</b></div>
        <div><small>Neytronlar (taxminan)</small><b>${e.neutrons}</b></div>
        <div><small>Elektron qobiqlar</small><b>${e.shells.join(" · ")}</b></div>
        <div class="w"><small>Elektron formula</small><b>${esc(e.config)}</b></div>
      </div>
      <p class="kl-desc">💡 ${esc(e.info)}</p>
      ${inLab.length ? `<p class="kl-muted">🧪 Laboratoriyada: ${inLab.map((r) => esc(r.name)).join(", ")}</p>` : ""}
      <div class="kl-row"><button type="button" class="kl-btn" data-nav="${z - 1}" ${z === 1 ? "disabled" : ""}>← ${z > 1 ? esc(C.ELEMENTS[z - 2].sym) : ""}</button><button type="button" class="kl-btn" data-back>🔬 Jadval</button><button type="button" class="kl-btn" data-nav="${z + 1}" ${z === 118 ? "disabled" : ""}>${z < 118 ? esc(C.ELEMENTS[z].sym) : ""} →</button></div>
    </div>`);
    $("#klSheet", root).classList.remove("wide");
    try { atom = new window.SofiAtom3D($("#klAtom", root), e); } catch (err) { /* WebGL yo'q */ }
    $("[data-back]", root).onclick = openTable;
    $$("[data-nav]", root).forEach((b) => (b.onclick = () => openElement(+b.dataset.nav)));
  }

  function confetti() {
    const box = document.createElement("div"); box.className = "g-confetti";
    const cs = ["#f5c84c", "#00f59b", "#38bdf8", "#f472b6", "#ffffff"];
    for (let i = 0; i < 90; i++) { const p = document.createElement("i"); p.style.left = Math.random() * 100 + "%"; p.style.background = cs[i % 5]; p.style.animationDelay = Math.random() * 0.6 + "s"; p.style.animationDuration = 2 + Math.random() * 1.6 + "s"; box.appendChild(p); }
    document.body.appendChild(box); setTimeout(() => box.remove(), 4500);
  }

  // ---------- O'yinlar sahifasidagi karta ----------
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-kl]");
    if (!b) return;
    ac();
    open(b.dataset.kl === "lab" ? null : b.dataset.kl);
  });
  window.SofiKimyo = { open, _S: S };
})();
