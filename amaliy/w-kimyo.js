/* Kimyo uchun jonli tajribalar (1-qism): umumiy ma'lumotlar (elementlar, formula tahlili, tenglama tenglashtirish),
   virtual laboratoriya (aralashtirish, cho'kma, gaz, rang o'zgarishi), alanga, indikatorlar va pH, titrlash,
   elektr o'tkazuvchanlik. */
(() => {
  "use strict";
  const { h, s, svg, num, slider, buttons, button, frame, W } = window.AK;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ===================================================================
  // Elementlar: [Z, belgi, nomi, Ar, elektromanfiylik, turi]
  // ===================================================================
  const EL = [
    [1, "H", "Vodorod", 1, 2.2, "nm"], [2, "He", "Geliy", 4, 0, "in"], [3, "Li", "Litiy", 7, 0.98, "ak"], [4, "Be", "Berilliy", 9, 1.57, "ae"],
    [5, "B", "Bor", 11, 2.04, "ym"], [6, "C", "Uglerod", 12, 2.55, "nm"], [7, "N", "Azot", 14, 3.04, "nm"], [8, "O", "Kislorod", 16, 3.44, "nm"],
    [9, "F", "Ftor", 19, 3.98, "ha"], [10, "Ne", "Neon", 20, 0, "in"], [11, "Na", "Natriy", 23, 0.93, "ak"], [12, "Mg", "Magniy", 24, 1.31, "ae"],
    [13, "Al", "Alyuminiy", 27, 1.61, "me"], [14, "Si", "Kremniy", 28, 1.9, "ym"], [15, "P", "Fosfor", 31, 2.19, "nm"], [16, "S", "Oltingugurt", 32, 2.58, "nm"],
    [17, "Cl", "Xlor", 35.5, 3.16, "ha"], [18, "Ar", "Argon", 40, 0, "in"], [19, "K", "Kaliy", 39, 0.82, "ak"], [20, "Ca", "Kalsiy", 40, 1, "ae"],
    [21, "Sc", "Skandiy", 45, 1.36, "tm"], [22, "Ti", "Titan", 48, 1.54, "tm"], [23, "V", "Vanadiy", 51, 1.63, "tm"], [24, "Cr", "Xrom", 52, 1.66, "tm"],
    [25, "Mn", "Marganes", 55, 1.55, "tm"], [26, "Fe", "Temir", 56, 1.83, "tm"], [27, "Co", "Kobalt", 59, 1.88, "tm"], [28, "Ni", "Nikel", 59, 1.91, "tm"],
    [29, "Cu", "Mis", 64, 1.9, "tm"], [30, "Zn", "Rux", 65, 1.65, "tm"], [31, "Ga", "Galliy", 70, 1.81, "me"], [32, "Ge", "Germaniy", 73, 2.01, "ym"],
    [33, "As", "Mishyak", 75, 2.18, "ym"], [34, "Se", "Selen", 79, 2.55, "nm"], [35, "Br", "Brom", 80, 2.96, "ha"], [36, "Kr", "Kripton", 84, 3, "in"],
    [37, "Rb", "Rubidiy", 85, 0.82, "ak"], [38, "Sr", "Stronsiy", 88, 0.95, "ae"], [39, "Y", "Ittriy", 89, 1.22, "tm"], [40, "Zr", "Sirkoniy", 91, 1.33, "tm"],
    [41, "Nb", "Niobiy", 93, 1.6, "tm"], [42, "Mo", "Molibden", 96, 2.16, "tm"], [43, "Tc", "Texnetsiy", 98, 1.9, "tm"], [44, "Ru", "Ruteniy", 101, 2.2, "tm"],
    [45, "Rh", "Rodiy", 103, 2.28, "tm"], [46, "Pd", "Palladiy", 106, 2.2, "tm"], [47, "Ag", "Kumush", 108, 1.93, "tm"], [48, "Cd", "Kadmiy", 112, 1.69, "tm"],
    [49, "In", "Indiy", 115, 1.78, "me"], [50, "Sn", "Qalay", 119, 1.96, "me"], [51, "Sb", "Surma", 122, 2.05, "ym"], [52, "Te", "Tellur", 128, 2.1, "ym"],
    [53, "I", "Yod", 127, 2.66, "ha"], [54, "Xe", "Ksenon", 131, 2.6, "in"], [55, "Cs", "Seziy", 133, 0.79, "ak"], [56, "Ba", "Bariy", 137, 0.89, "ae"],
    [78, "Pt", "Platina", 195, 2.28, "tm"], [79, "Au", "Oltin", 197, 2.54, "tm"], [80, "Hg", "Simob", 201, 2, "tm"], [82, "Pb", "Qo‘rg‘oshin", 207, 2.33, "me"],
  ].map(([z, sym, name, ar, en, cat]) => ({ z, sym, name, ar, en, cat }));
  const BY = Object.fromEntries(EL.map((e) => [e.sym, e]));
  const CAT = { ak: ["Ishqoriy metall", "#f87171"], ae: ["Ishqoriy-yer metall", "#fb923c"], tm: ["O‘tish metali", "#facc15"], me: ["Boshqa metall", "#a3e635"],
    ym: ["Yarim metall", "#2dd4bf"], nm: ["Metallmas", "#38bdf8"], ha: ["Galogen", "#a78bfa"], in: ["Inert gaz", "#f472b6"] };
  /** Davr va guruh (asosiy jadval joylashuvi) */
  function place(z) {
    if (z <= 2) return [1, z === 1 ? 1 : 18];
    if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8];
    if (z <= 18) return [3, z <= 12 ? z - 10 : z];
    if (z <= 36) return [4, z - 18];
    if (z <= 54) return [5, z - 36];
    return [6, { 55: 1, 56: 2, 78: 10, 79: 11, 80: 12, 82: 14 }[z]];
  }
  // Elektron konfiguratsiya (Klechkovskiy tartibi, Cr/Cu/Mo/Ag kabi istisnolar bilan)
  const ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const EXC = { 24: { "3d": 5, "4s": 1 }, 29: { "3d": 10, "4s": 1 }, 41: { "4d": 4, "5s": 1 }, 42: { "4d": 5, "5s": 1 }, 44: { "4d": 7, "5s": 1 }, 45: { "4d": 8, "5s": 1 }, 46: { "4d": 10, "5s": 0 }, 47: { "4d": 10, "5s": 1 }, 78: { "5d": 9, "6s": 1 }, 79: { "5d": 10, "6s": 1 } };
  function config(z) {
    const c = {}; let left = z;
    for (const o of ORDER) { if (left <= 0) break; const k = Math.min(CAP[o[1]], left); c[o] = k; left -= k; }
    if (EXC[z]) Object.assign(c, EXC[z]);
    const keys = Object.keys(c).filter((k) => c[k] > 0).sort((a, b) => (a[0] - b[0]) || ("spdf".indexOf(a[1]) - "spdf".indexOf(b[1])));
    return keys.map((k) => [k, c[k]]);
  }
  const shells = (z) => { const sh = []; config(z).forEach(([o, n]) => { const i = Number(o[0]) - 1; sh[i] = (sh[i] || 0) + n; }); return sh.map((v) => v || 0); };
  const cfgHTML = (z) => config(z).map(([o, n]) => `${o}<sup>${n}</sup>`).join(" ");

  // ===================================================================
  // Formula tahlili: "Ca(OH)2", "CuSO4·5H2O", "[Ag(NH3)2]OH", "SO4^2-"
  // ===================================================================
  function parse(f) {
    f = String(f).replace(/\s/g, "").replace(/\^?\d*[+-]$/, "").replace(/[₀-₉]/g, (d) => "₀₁₂₃₄₅₆₇₈₉".indexOf(d));
    const total = {};
    for (let part of f.split(/[·*•.]/)) {
      if (!part) continue;
      let k = 1; const m = /^(\d+)(.*)$/.exec(part); if (m && /^[A-Z([]/.test(m[2])) { k = Number(m[1]); part = m[2]; }
      let i = 0;
      const group = () => {
        const out = {};
        while (i < part.length) {
          const ch = part[i];
          if (ch === "(" || ch === "[") { i++; const g = group(); i++; const n = count(); for (const e in g) out[e] = (out[e] || 0) + g[e] * n; }
          else if (ch === ")" || ch === "]") break;
          else if (/[A-Z]/.test(ch)) { let sym = ch; i++; if (/[a-z]/.test(part[i] || "")) sym += part[i++]; if (!BY[sym]) throw new Error(`“${sym}” — bunday element yo‘q`); const n = count(); out[sym] = (out[sym] || 0) + n; }
          else throw new Error(`“${ch}” belgisini tushunmadim`);
        }
        return out;
      };
      const count = () => { let d = ""; while (/\d/.test(part[i] || "")) d += part[i++]; return d ? Number(d) : 1; };
      const g = group();
      if (i < part.length) throw new Error("Qavslar juft emas");
      for (const e in g) total[e] = (total[e] || 0) + g[e] * k;
    }
    if (!Object.keys(total).length) throw new Error("Formula bo‘sh");
    return total;
  }
  const mr = (f) => { const c = typeof f === "string" ? parse(f) : f; return Object.entries(c).reduce((a, [e, n]) => a + BY[e].ar * n, 0); };
  /** "H2SO4" → H₂SO₄ ko'rinishi (HTML) */
  const fml = (f) => esc(f).replace(/(\d+)?([+-])$/, (m, d, sg) => `<sup>${d || ""}${sg === "-" ? "−" : "+"}</sup>`).replace(/\^(<sup>)/, "$1").replace(/([A-Za-z)\]])(\d+)/g, "$1<sub>$2</sub>").replace(/[·*]/g, "·");

  // ===================================================================
  // Tenglamani tenglashtirish (kasrlar bilan Gauss usuli)
  // ===================================================================
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function balance(left, right) {
    const sp = [...left, ...right], comps = sp.map(parse);
    const els = [...new Set(comps.flatMap((c) => Object.keys(c)))];
    const n = sp.length;
    // qatorlar: element bo'yicha; ustunlar: moddalar (o'ng tomon manfiy). Kasr: [surat, maxraj]
    let M = els.map((e) => comps.map((c, j) => [(c[e] || 0) * (j < left.length ? 1 : -1), 1]));
    const sub = (a, b) => norm([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]), mul = (a, b) => norm([a[0] * b[0], a[1] * b[1]]), div = (a, b) => norm([a[0] * b[1], a[1] * b[0]]);
    function norm([p, q]) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; }
    let row = 0; const piv = [];
    for (let col = 0; col < n && row < M.length; col++) {
      let r = M.findIndex((x, i) => i >= row && x[col][0] !== 0); if (r < 0) continue;
      [M[row], M[r]] = [M[r], M[row]];
      const pv = M[row][col]; M[row] = M[row].map((v) => div(v, pv));
      M.forEach((x, i) => { if (i !== row && x[col][0] !== 0) { const f = x[col]; M[i] = x.map((v, j) => sub(v, mul(f, M[row][j]))); } });
      piv.push(col); row++;
    }
    const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
    if (free.length !== 1) return null;
    const fc = free[0], sol = Array(n).fill([0, 1]); sol[fc] = [1, 1];
    piv.forEach((c, i) => { sol[c] = norm([-M[i][fc][0], M[i][fc][1]]); });
    const L = sol.reduce((a, [, q]) => a * q / gcd(a, q), 1);
    let ints = sol.map(([p, q]) => (p * L) / q);
    if (ints.some((v) => v <= 0)) { if (ints.every((v) => v < 0)) ints = ints.map((v) => -v); else return null; }
    const g = ints.reduce((a, b) => gcd(a, b));
    return ints.map((v) => v / g);
  }
  const eqHTML = (left, right, k, arrow = "→") => {
    const side = (arr, off) => arr.map((f, i) => `${k && k[off + i] > 1 ? `<b class="kc">${k[off + i]}</b>` : ""}${fml(f)}`).join(" + ");
    return `${side(left, 0)} ${arrow} ${side(right, left.length)}`;
  };

  window.KIM = { EL, BY, CAT, place, config, shells, cfgHTML, parse, mr, fml, balance, eqHTML, esc };

  // ===================================================================
  // Tovushlar (Web Audio): quyish, shisha jarangi, pufakchalar, vishillash, “pa!”, alanga, tomchi...
  // Fayl yuklanmaydi — har bir tovush shu yerning o'zida fizik modelga yaqin qilib yaratiladi.
  // ===================================================================
  const SND = (() => {
    const KEY = "sofi_kim_snd";
    let on = true; try { on = localStorage.getItem(KEY) !== "0"; } catch (e) { /* bo'sh */ }
    let ctx = null, out = null, nbuf = null;
    const btns = new Set();
    function ac() {
      if (!on) return null;
      if (!ctx) {
        const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
        ctx = new C(); out = ctx.createGain(); out.gain.value = 0.9;
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
        out.connect(comp); comp.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    const noise = (c) => {
      if (!nbuf) { nbuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const s = c.createBufferSource(); s.buffer = nbuf; s.loop = true; s.loopStart = Math.random(); return s;
    };
    const gain = (c, v = 0) => { const g = c.createGain(); g.gain.value = v; return g; };
    const filt = (c, type, f, q = 0.7) => { const x = c.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; };
    const chain = (...n) => { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1]; };
    const rnd = (a, b) => a + Math.random() * (b - a);
    /** Bitta pufakcha: kichik sinusoida, chastotasi yuqoriga “sirpanadi” (pufakcha rezonansi) */
    function bubble(c, t, f0, amp, dec = 0.06) {
      const o = c.createOscillator(), g = gain(c);
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * rnd(1.6, 2.4), t + dec);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      chain(o, g, out); o.start(t); o.stop(t + dec + 0.02);
    }
    /** Shovqin bo'lagi: filtr + qo'ng'iroqsimon konvert */
    function noiseHit(c, t, { type = "bandpass", f = 1000, q = 0.8, a = 0.005, d = 0.2, amp = 0.3, sweep } = {}) {
      const n = noise(c), fl = filt(c, type, f, q), g = gain(c);
      if (sweep) { fl.frequency.setValueAtTime(sweep[0], t); fl.frequency.exponentialRampToValueAtTime(sweep[1], t + a + d); }
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      chain(n, fl, g, out); n.start(t); n.stop(t + a + d + 0.05);
    }
    const api = {
      get on() { return on; },
      set(v) { on = v; try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) { /* bo'sh */ } btns.forEach((b) => (b.textContent = v ? "🔊" : "🔇")); if (!v && ctx) ctx.suspend(); if (v) ac(); },
      /** Ovozni yoqish/o'chirish tugmasi */
      toggle() {
        const b = h("button", { type: "button", class: "dbtn ghost kb-snd", title: "Ovoz", "aria-label": "Ovozni yoqish yoki o‘chirish" }, on ? "🔊" : "🔇");
        b.onclick = () => api.set(!on); btns.add(b); return b;
      },
      /** Shisha stakanga metall/bo'lak tushishi — jaranglagan shisha */
      clink(heavy = false) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        [[2350, 0.22, 1.1], [3600, 0.12, 0.8], [5200, 0.07, 0.6], [7400, 0.04, 0.4]].forEach(([f, a, d]) => {
          const o = c.createOscillator(), g = gain(c); o.frequency.value = f * (heavy ? 0.8 : 1) * rnd(0.98, 1.02);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a * (heavy ? 0.7 : 1), t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
          chain(o, g, out); o.start(t); o.stop(t + d + 0.05);
        });
        noiseHit(c, t, { type: "lowpass", f: heavy ? 400 : 900, d: 0.07, amp: heavy ? 0.5 : 0.25 });
        if (heavy) noiseHit(c, t + 0.09, { type: "bandpass", f: 2500, d: 0.05, amp: 0.08 });
      },
      /** Kukun sepish — shitirlash */
      powder() { const c = ac(); if (!c) return; const t = c.currentTime; for (let i = 0; i < 6; i++) noiseHit(c, t + i * 0.06, { f: rnd(3000, 6000), q: 1.2, d: 0.08, amp: 0.16 }); },
      /** Suyuqlik quyish: oqim shovqini + “g'ul-g'ul” */
      pour(dur = 1.1) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        const n = noise(c), bp = filt(c, "bandpass", 900, 0.9), g = gain(c);
        for (let k = 0; k < dur; k += 0.04) bp.frequency.setValueAtTime(rnd(650, 1700), t + k);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.12); g.gain.setValueAtTime(0.2, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        chain(n, bp, g, out); n.start(t); n.stop(t + dur + 0.05);
        noiseHit(c, t + 0.05, { type: "highpass", f: 2500, d: 0.15, amp: 0.12 });
        for (let k = 0.1; k < dur; k += rnd(0.07, 0.16)) bubble(c, t + k, rnd(180, 420), 0.18, rnd(0.05, 0.09));
      },
      /** Gaz pufakchalari (intensivlik 0..1) */
      bubbles(x = 0.5, dur = 3, low = false) {
        const c = ac(); if (!c) return; const t = c.currentTime, rate = 6 + 70 * x;
        for (let k = 0; k < dur; k += 1 / rate * rnd(0.3, 1.7)) {
          const fade = 1 - k / dur * 0.7;
          bubble(c, t + k, low ? rnd(140, 420) : rnd(500, 1800) * (1 - x * 0.3), rnd(0.05, 0.14) * fade * (low ? 1.8 : 1), rnd(0.03, 0.08));
        }
      },
      /** Vishillash (gazlangan suv kabi): yuqori chastotali shovqin + chirsillash */
      fizz(x = 0.5, dur = 3) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        const n = noise(c), hp = filt(c, "highpass", 3800, 0.5), g = gain(c);
        g.gain.setValueAtTime(0.0001, t);
        for (let k = 0; k < dur; k += 0.012) g.gain.setValueAtTime(Math.random() < 0.35 ? rnd(0.02, 0.12) * x * (1 - k / dur * 0.6) : 0.004, t + k);
        g.gain.setValueAtTime(0.0001, t + dur);
        chain(n, hp, g, out); n.start(t); n.stop(t + dur + 0.05);
      },
      /** Natriy suvda — chirsillab vishillash */
      sizzle(dur = 3) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        const n = noise(c), hp = filt(c, "highpass", 2200, 0.6), g = gain(c);
        for (let k = 0; k < dur; k += 0.01) g.gain.setValueAtTime((Math.random() < 0.5 ? rnd(0.05, 0.3) : 0.02) * (1 - k / dur * 0.7), t + k);
        g.gain.setValueAtTime(0.0001, t + dur);
        chain(n, hp, g, out); n.start(t); n.stop(t + dur + 0.05);
        for (let k = 0; k < dur; k += rnd(0.12, 0.4)) noiseHit(c, t + k, { type: "bandpass", f: rnd(800, 2000), d: 0.03, amp: 0.25 });
      },
      /** Qaynash — past pufakchalar va g'uvullash */
      boil(dur = 3) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        const n = noise(c), lp = filt(c, "lowpass", 380, 0.7), g = gain(c);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.6); g.gain.setValueAtTime(0.12, t + dur - 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        chain(n, lp, g, out); n.start(t); n.stop(t + dur + 0.05);
        api.bubbles(0.45, dur, true);
      },
      /** Vodorod: yonib turgan cho'p yaqinlashtirilganda “pa!” */
      pop() {
        const c = ac(); if (!c) return; const t = c.currentTime;
        noiseHit(c, t, { type: "lowpass", f: 2400, a: 0.002, d: 0.09, amp: 0.9 });
        const o = c.createOscillator(), g = gain(c); o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.8, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        chain(o, g, out); o.start(t); o.stop(t + 0.25);
      },
      /** Alanga gurillab yonishi */
      whoosh(dur = 0.9, bright = false) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        noiseHit(c, t, { type: "bandpass", q: 0.6, a: dur * 0.35, d: dur * 0.65, amp: bright ? 0.45 : 0.3, sweep: bright ? [400, 3200] : [250, 1400] });
        noiseHit(c, t, { type: "lowpass", f: 200, a: dur * 0.3, d: dur * 0.7, amp: 0.35 });
      },
      /** Cho'p o'chishi (CO₂) — “pss” */
      fizzleOut() { const c = ac(); if (!c) return; noiseHit(c, c.currentTime, { type: "highpass", f: 3000, a: 0.02, d: 0.5, amp: 0.25, sweep: [5000, 1500] }); },
      /** Tomchi */
      drip(n = 1) {
        const c = ac(); if (!c) return; const t0 = c.currentTime;
        for (let i = 0; i < n; i++) {
          const t = t0 + i * 0.14, o = c.createOscillator(), g = gain(c), f = rnd(900, 1300);
          o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.07);
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
          chain(o, g, out); o.start(t); o.stop(t + 0.1);
          bubble(c, t + 0.05, rnd(500, 800), 0.08, 0.05);
        }
      },
      /** Elektr: kalit “chiq” va lampochka/tok g'uvullashi */
      buzz(level = 1) {
        const c = ac(); if (!c) return; const t = c.currentTime;
        noiseHit(c, t, { type: "highpass", f: 3000, a: 0.001, d: 0.03, amp: 0.3 });
        if (!level) return;
        const o = c.createOscillator(), lp = filt(c, "lowpass", 700), g = gain(c); o.type = "sawtooth"; o.frequency.value = 100;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05 * level, t + 0.05); g.gain.setValueAtTime(0.05 * level, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        chain(o, lp, g, out); o.start(t); o.stop(t + 1);
      },
      /** Aralashtirish (shisha tayoqcha) */
      stir() { const c = ac(); if (!c) return; const t = c.currentTime; for (let i = 0; i < 4; i++) { noiseHit(c, t + i * 0.25, { type: "bandpass", f: 1200, q: 1.5, a: 0.08, d: 0.15, amp: 0.12 }); if (i % 2) api.clink(); } },
    };
    return api;
  })();
  window.KIM.SND = SND;

  // ===================================================================
  // Laboratoriya idishi (SVG): stakan, suyuqlik, qattiq modda, pufakchalar, cho'kma
  // ===================================================================
  let uid = 0;
  /** SVG matnida <sub>/<sup> ishlamaydi — tspan ga aylantiramiz */
  const svgRich = (t) => String(t || "").replace(/<sub>(.*?)<\/sub>/g, '<tspan baseline-shift="sub" font-size="75%">$1</tspan>').replace(/<sup>(.*?)<\/sup>/g, '<tspan baseline-shift="super" font-size="75%">$1</tspan>');
  function beakerScene(stage, opts = {}) {
    const id = "kb" + ++uid;
    const g = svg(320, 270, "kb-svg");
    g.innerHTML = `
      <defs>
        <clipPath id="${id}c"><path d="M92 92 L92 228 Q92 244 108 244 L212 244 Q228 244 228 228 L228 92 Z"/></clipPath>
        <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".25" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
        <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset=".5" stop-color="#9ca3af"/><stop offset="1" stop-color="#f3f4f6"/></linearGradient>
        <radialGradient id="${id}h"><stop offset="0" stop-color="#fb923c" stop-opacity=".55"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse class="kb-heat" cx="160" cy="200" rx="110" ry="70" fill="url(#${id}h)" opacity="0"/>
      <g class="kb-cloud"></g>
      <g clip-path="url(#${id}c)">
        <rect class="kb-liq" x="80" y="244" width="160" height="0" rx="2"/>
        <rect class="kb-layer" x="80" y="0" width="160" height="0" fill="#fde68a" opacity="0"/>
        <g class="kb-solid"></g><g class="kb-ppt"></g><g class="kb-bubs"></g>
        <rect class="kb-mirror" x="88" y="90" width="144" height="160" fill="url(#${id}m)" opacity="0"/>
      </g>
      <path d="M86 86 L92 92 L92 228 Q92 244 108 244 L212 244 Q228 244 228 228 L228 92 L234 86" fill="url(#${id}g)" stroke="currentColor" stroke-opacity=".75" stroke-width="3" stroke-linejoin="round"/>
      ${[0, 1, 2, 3].map((i) => `<line x1="216" x2="228" y1="${130 + i * 28}" y2="${130 + i * 28}" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>`).join("")}
      <g class="kb-tube" transform="translate(250 30)">
        <path class="kb-tube-glass" d="M-9 -2 L-9 70 Q-9 82 0 82 Q9 82 9 70 L9 -2" fill="none" stroke="currentColor" stroke-opacity=".75" stroke-width="2.5"/>
        <path class="kb-tube-liq" d="M-7 40 L-7 70 Q-7 80 0 80 Q7 80 7 70 L7 40 Z"/>
      </g>
      <rect class="kb-stream" x="0" y="0" width="5" height="0" rx="2.5" opacity="0"/>
      <text class="kb-lbl" x="160" y="264" text-anchor="middle"></text>
      <text class="kb-tlbl" x="250" y="20" text-anchor="middle"></text>
      <text class="kb-temp" x="20" y="250"></text>`;
    stage.append(g);
    const q = (c) => g.querySelector(c);
    const liq = q(".kb-liq"), solid = q(".kb-solid"), ppt = q(".kb-ppt"), bubs = q(".kb-bubs"), cloud = q(".kb-cloud"), tube = q(".kb-tube"), stream = q(".kb-stream");
    const S = { level: 0, color: "#bfdbfe", alpha: 0.35, pptH: 0 };
    const api = {
      g,
      liquid(color, level, alpha = 0.55) {
        S.level = level; S.color = color; S.alpha = alpha;
        liq.setAttribute("y", 244 - level); liq.setAttribute("height", level + 4);
        liq.style.fill = color; liq.style.fillOpacity = alpha;
      },
      color(color, alpha) { S.color = color; liq.style.fill = color; if (alpha != null) { S.alpha = alpha; liq.style.fillOpacity = alpha; } },
      rise(d) { api.liquid(S.color, Math.min(150, S.level + d), S.alpha); },
      label(t, tt) { q(".kb-lbl").innerHTML = svgRich(t); q(".kb-tlbl").innerHTML = svgRich(tt); },
      temp(t) { q(".kb-temp").textContent = t == null ? "" : `🌡 ${t} °C`; q(".kb-heat").setAttribute("opacity", t > 30 ? Math.min(1, (t - 30) / 40) : 0); },
      tube(color, visible = true, alpha = 0.6) { tube.style.display = visible ? "" : "none"; const l = q(".kb-tube-liq"); l.style.fill = color; l.style.fillOpacity = alpha; l.style.display = color ? "" : "none"; },
      /** Qattiq modda: "metal" (bo'lak), "nail" (mix), "wire" (sim), "powder" (kukun), "chunk" (bo'lakcha bo'r) */
      solid(kind, color = "#9ca3af") {
        solid.innerHTML = ""; if (!kind) return;
        if (kind === "metal") s("rect", { x: 140, y: 222, width: 40, height: 16, rx: 3, fill: color, class: "kb-sol" }, solid);
        if (kind === "nail") { s("rect", { x: 157, y: 120, width: 6, height: 118, rx: 2, fill: color, class: "kb-sol" }, solid); s("rect", { x: 150, y: 116, width: 20, height: 6, rx: 2, fill: color, class: "kb-sol" }, solid); }
        if (kind === "wire") s("path", { d: "M160 110 L160 200 q0 14 -10 22 q-10 8 0 16", stroke: color, "stroke-width": 5, fill: "none", class: "kb-sol", "stroke-linecap": "round" }, solid);
        if (kind === "powder" || kind === "chunk") for (let i = 0; i < (kind === "chunk" ? 7 : 26); i++) s("circle", { cx: 120 + Math.random() * 80, cy: 236 - Math.random() * (kind === "chunk" ? 8 : 5), r: kind === "chunk" ? 6 + Math.random() * 4 : 2.4, fill: color, class: "kb-sol" }, solid);
      },
      solidColor(color) { solid.querySelectorAll(".kb-sol").forEach((e) => { e.style.transition = "fill 2.5s, stroke 2.5s"; if (e.tagName === "path") e.style.stroke = color; else e.style.fill = color; }); },
      shrinkSolid(f = 0.35) { solid.querySelectorAll(".kb-sol").forEach((e) => { e.style.transition = "transform 6s ease, opacity 6s"; e.style.transformBox = "fill-box"; e.style.transformOrigin = "center bottom"; e.style.transform = `scale(${f})`; if (f < 0.1) e.style.opacity = "0"; }); },
      bubbles(n, color = "#fff", origin = "solid") {
        bubs.innerHTML = "";
        const top = 244 - S.level;
        for (let i = 0; i < n; i++) {
          const x = origin === "solid" ? 130 + Math.random() * 60 : origin === "all" ? 98 + Math.random() * 124 : 150 + Math.random() * 20;
          const c = s("circle", { cx: x, cy: 238, r: 1.5 + Math.random() * 3, fill: "none", stroke: color, "stroke-width": 1.2, class: "kb-bub" }, bubs);
          c.style.setProperty("--rise", `${-(238 - top) - 4}px`); c.style.animationDuration = `${0.9 + Math.random() * 1.4}s`; c.style.animationDelay = `${-Math.random() * 2}s`;
        }
      },
      stopBubbles() { bubs.innerHTML = ""; },
      precipitate(color, amount = 1) {
        const top = 244 - S.level;
        for (let i = 0; i < 46 * amount; i++) {
          const c = s("circle", { cx: 98 + Math.random() * 124, cy: top + 8 + Math.random() * (S.level - 14), r: 1.6 + Math.random() * 2.6, fill: color, class: "kb-flake" }, ppt);
          c.style.setProperty("--fall", `${236 - Number(c.getAttribute("cy")) - Math.random() * 10}px`); c.style.animationDelay = `${Math.random() * 1.2}s`;
        }
        S.pptH += 10 * amount;
        const bed = s("rect", { x: 92, y: 244, width: 136, height: 0, fill: color, class: "kb-bed" }, ppt);
        setTimeout(() => { bed.style.transition = "y 2s ease, height 2s ease"; bed.setAttribute("y", 244 - S.pptH); bed.setAttribute("height", S.pptH); }, 900);
      },
      /** Muallaq (eritmadagi) cho'kma — loyqa */
      cloudy(color, op = 0.55) { const r = s("rect", { x: 92, y: 244 - S.level, width: 136, height: S.level, fill: color, opacity: 0, class: "kb-turbid" }, ppt); setTimeout(() => { r.style.transition = "opacity 1.5s"; r.setAttribute("opacity", op); }, 50); },
      dissolvePpt() { ppt.querySelectorAll("*").forEach((e) => { e.style.transition = "opacity 2.5s"; e.style.opacity = "0"; }); S.pptH = 0; setTimeout(() => (ppt.innerHTML = ""), 2600); },
      gasCloud(color, op = 0.7) {
        cloud.innerHTML = "";
        for (let i = 0; i < 9; i++) {
          const c = s("circle", { cx: 120 + Math.random() * 80, cy: 80, r: 14 + Math.random() * 14, fill: color, opacity: 0, class: "kb-puff" }, cloud);
          c.style.setProperty("--op", op); c.style.animationDelay = `${i * 0.35}s`;
        }
      },
      layer(color, hgt = 14) { const l = q(".kb-layer"); l.setAttribute("y", 244 - S.level - 1); l.setAttribute("height", hgt); l.style.fill = color; l.style.transition = "opacity 2s"; l.setAttribute("opacity", 0.85); },
      mirror(on) { const m = q(".kb-mirror"); m.style.transition = "opacity 3s"; m.setAttribute("opacity", on ? 0.92 : 0); },
      swim(on) { solid.querySelectorAll(".kb-sol").forEach((e) => { e.style.transformBox = "fill-box"; e.style.transformOrigin = "center"; e.classList.toggle("kb-swim", !!on); }); },
      /** Probirkadan quyish animatsiyasi */
      async pour(color, dLevel = 34, alpha = 0.55) {
        tube.style.transition = "transform .6s ease"; tube.setAttribute("transform", "translate(214 42) rotate(-118)");
        await wait(550);
        stream.style.fill = color; stream.style.fillOpacity = Math.max(alpha, 0.5);
        stream.setAttribute("x", 186); stream.setAttribute("y", 66); stream.setAttribute("height", 244 - S.level - 66); stream.setAttribute("opacity", 1);
        api.rise(dLevel);
        await wait(700);
        stream.setAttribute("opacity", 0); stream.setAttribute("height", 0);
        tube.setAttribute("transform", "translate(250 30)"); q(".kb-tube-liq").style.display = "none";
        await wait(300);
      },
      /** Gazni tekshirish: cho'p idish og'ziga keltiriladi */
      flash(gas) {
        const sp = s("g", { class: "kb-splint" }, g);
        sp.innerHTML = `<line x1="300" y1="20" x2="200" y2="74" stroke="#a16207" stroke-width="5" stroke-linecap="round"/>${gas === "O2" ? `<circle cx="200" cy="74" r="5" fill="#f97316"/><path d="M200 74 q-14 -18 0 -40 q14 22 0 40" fill="#fbbf24" class="kb-fl big"/>` : gas === "CO2" ? `<circle cx="200" cy="74" r="4" fill="#57534e"/><path d="M198 70 q-6 -10 2 -22 q-4 10 4 18" stroke="#9ca3af" fill="none" class="kb-smoke"/>` : `<path d="M200 74 q-8 -12 0 -24 q8 12 0 24" fill="#fbbf24" class="kb-fl"/>`}${gas === "H2" ? `<circle cx="170" cy="86" r="10" fill="#fde68a" class="kb-boom"/>` : ""}`;
        setTimeout(() => sp.remove(), 2600);
      },
      reset() { ppt.innerHTML = ""; bubs.innerHTML = ""; cloud.innerHTML = ""; S.pptH = 0; api.mirror(false); q(".kb-layer").setAttribute("opacity", 0); api.temp(null); q(".kb-tube-liq").style.display = ""; tube.setAttribute("transform", "translate(250 30)"); },
    };
    return api;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, window.AK.reduced() ? Math.min(ms, 60) : ms));
  window.KIM.beakerScene = beakerScene;
  window.KIM.wait = wait;

  // ===================================================================
  // Reaktivlar va reaksiyalar
  // ===================================================================
  const CLR = "#cfe6ff"; // rangsiz eritma
  // kalit: [nomi, formula, rang, turi: l-eritma, m-metall bo'lak, n-mix, w-sim, p-kukun, c-bo'lak, g-gaz]
  const R = {
    hcl: ["Xlorid kislota", "HCl", CLR, "l"], h2so4: ["Sulfat kislota (suyul.)", "H2SO4", CLR, "l"], h2so4k: ["Sulfat kislota (kons.)", "H2SO4", "#fef9c3", "l"],
    hno3: ["Nitrat kislota (kons.)", "HNO3", "#fef3c7", "l"], ch3cooh: ["Sirka kislota", "CH3COOH", CLR, "l"], vinegar: ["Oshxona sirkasi", "CH3COOH", CLR, "l"],
    naoh: ["Natriy gidroksid", "NaOH", CLR, "l"], naohx: ["NaOH (ortiqcha)", "NaOH", CLR, "l"], koh: ["Kaliy gidroksid", "KOH", CLR, "l"], caoh2: ["Ohakli suv", "Ca(OH)2", "#eef6ff", "l"],
    nh3aq: ["Ammiakli suv", "NH4OH", CLR, "l"], php: ["Fenolftalein", "", "#ffffff", "l"],
    naoh_php: ["NaOH + fenolftalein", "NaOH", "#db2777", "l"], hcl_mo: ["HCl + metilzarg‘aldog‘i", "HCl", "#ef4444", "l"], water: ["Suv", "H2O", CLR, "l"], water_php: ["Suv + fenolftalein", "H2O", CLR, "l"],
    nacl: ["Osh tuzi eritmasi", "NaCl", CLR, "l"], nabr: ["Natriy bromid", "NaBr", CLR, "l"], ki: ["Kaliy yodid", "KI", CLR, "l"], agno3: ["Kumush nitrat", "AgNO3", CLR, "l"],
    bacl2: ["Bariy xlorid", "BaCl2", CLR, "l"], na2so4: ["Natriy sulfat", "Na2SO4", CLR, "l"], cuso4: ["Mis(II) sulfat", "CuSO4", "#3b82f6", "l"], fecl3: ["Temir(III) xlorid", "FeCl3", "#d97706", "l"],
    feso4: ["Temir(II) sulfat", "FeSO4", "#bbf7d0", "l"], znso4: ["Rux sulfat", "ZnSO4", CLR, "l"], alcl3: ["Alyuminiy xlorid", "AlCl3", CLR, "l"], cacl2: ["Kalsiy xlorid", "CaCl2", CLR, "l"],
    na2co3: ["Soda eritmasi", "Na2CO3", CLR, "l"], kscn: ["Kaliy rodanid", "KSCN", CLR, "l"], k3fe: ["Qizil qon tuzi", "K3[Fe(CN)6]", "#fbbf24", "l"], k4fe: ["Sariq qon tuzi", "K4[Fe(CN)6]", "#fde68a", "l"],
    kmno4: ["Kaliy permanganat", "KMnO4", "#7e22ce", "l"], k2cr2o7: ["Kaliy dixromat", "K2Cr2O7", "#ea580c", "l"], k2cro4: ["Kaliy xromat", "K2CrO4", "#facc15", "l"],
    na2so3: ["Natriy sulfit", "Na2SO3", CLR, "l"], cl2aq: ["Xlorli suv", "Cl2", "#d9f99d", "l"], br2aq: ["Bromli suv", "Br2", "#d97706", "l"], i2aq: ["Yod eritmasi", "I2", "#92400e", "l"],
    starch: ["Kraxmal kleysteri", "(C6H10O5)n", "#f8fafc", "l"], pbno3: ["Qo‘rg‘oshin nitrat", "Pb(NO3)2", CLR, "l"], h2s: ["Vodorod sulfid", "H2S", "#fefce8", "g"],
    h2o2: ["Vodorod peroksid", "H2O2", CLR, "l"], mno2: ["Marganes(IV) oksid", "MnO2", "#1f2937", "p"], nh4cl: ["Ammoniy xlorid", "NH4Cl", CLR, "l"],
    co2: ["Karbonat angidrid", "CO2", "#ffffff", "g"], c2h4: ["Etilen", "C2H4", "#ffffff", "g"], cuoh2: ["Mis(II) gidroksid", "Cu(OH)2", "#60a5fa", "l"],
    glycerol: ["Glitserin", "C3H5(OH)3", "#f1f5f9", "l"], glucose: ["Glyukoza", "C6H12O6", CLR, "l"], aldehyde: ["Sirka aldegid", "CH3CHO", CLR, "l"], agnh3: ["Kumush ammiakat", "[Ag(NH3)2]OH", CLR, "l"],
    phenol: ["Fenol eritmasi", "C6H5OH", CLR, "l"], protein: ["Oqsil (tuxum oqi)", "", "#fef9c3", "l"], ethanol: ["Etil spirt", "C2H5OH", CLR, "l"], soap: ["Sovun eritmasi", "C17H35COONa", "#f8fafc", "l"],
    fat: ["Yog‘", "", "#fde68a", "l"], cahco3: ["Qattiq suv", "Ca(HCO3)2", CLR, "l"], na2sio3: ["Suyuq shisha", "Na2SiO3", CLR, "l"], nh4no3: ["Ammiakli selitra", "NH4NO3", CLR, "l"],
    zn: ["Rux", "Zn", "#cbd5e1", "m"], mg: ["Magniy", "Mg", "#e5e7eb", "m"], fe: ["Temir", "Fe", "#6b7280", "m"], cu: ["Mis", "Cu", "#c2703d", "m"], al: ["Alyuminiy", "Al", "#e2e8f0", "m"],
    na: ["Natriy", "Na", "#e5e7eb", "m"], ca: ["Kalsiy", "Ca", "#d6d3d1", "m"], nail: ["Temir mix", "Fe", "#6b7280", "n"], cuw: ["Mis sim", "Cu", "#c2703d", "w"],
    caco3: ["Bo‘r (marmar)", "CaCO3", "#f8fafc", "c"], nahco3: ["Ichimlik sodasi", "NaHCO3", "#ffffff", "p"], cuo: ["Mis(II) oksid", "CuO", "#111827", "p"], zno: ["Rux oksid", "ZnO", "#f8fafc", "p"],
    znoh2: ["Rux gidroksid (cho‘kma)", "Zn(OH)2", CLR, "l"], aloh3: ["Al(OH)3 (cho‘kma)", "Al(OH)3", CLR, "l"],
  };

  // fx: to (yangi rang), alpha, bub (pufakcha soni), bubC, ppt (cho'kma rangi), cloudy, gas (gaz buluti rangi), heat (°C), solid ("shrink"|"gone"),
  //     deposit (metall yuzasi rangi), dissolve (cho'kma eriydi), layer (yuqori qatlam), mirror, swim, start (boshlang'ich: {ppt}), test (gazni sinash)
  const X = {
    // --- metall + kislota ---
    "zn-hcl": { a: "hcl", b: "zn", t: "Rux + xlorid kislota", eq: [["Zn", "HCl"], ["ZnCl2", "H2"]], gas: "H2", obs: "Rux sirtidan gaz pufakchalari ajraladi, rux asta-sekin eriydi.", fx: { bub: 34, solid: "shrink", heat: 28 }, test: "Yonib turgan cho‘p yaqinlashtirilsa — “pa!” degan ovoz: bu <b>vodorod</b>." },
    "mg-hcl": { a: "hcl", b: "mg", t: "Magniy + xlorid kislota", eq: [["Mg", "HCl"], ["MgCl2", "H2"]], gas: "H2", obs: "Juda shiddatli! Ko‘p gaz chiqadi, magniy tez eriydi, probirka qiziydi.", fx: { bub: 70, solid: "gone", heat: 55 }, test: "Yonayotgan cho‘p — “pa!” ovozi: <b>vodorod</b>." },
    "fe-hcl": { a: "hcl", b: "fe", t: "Temir + xlorid kislota", eq: [["Fe", "HCl"], ["FeCl2", "H2"]], gas: "H2", obs: "Sekin gaz ajraladi, eritma och yashil tusga kiradi (Fe²⁺ ionlari).", fx: { bub: 16, solid: "shrink", to: "#bbf7d0", heat: 24 } },
    "al-hcl": { a: "hcl", b: "al", t: "Alyuminiy + xlorid kislota", eq: [["Al", "HCl"], ["AlCl3", "H2"]], gas: "H2", obs: "Avval sekin (oksid parda), keyin shiddatli gaz ajraladi.", fx: { bub: 44, solid: "shrink", heat: 40 } },
    "cu-hcl": { a: "hcl", b: "cu", t: "Mis + xlorid kislota", eq: null, obs: "<b>Hech narsa kuzatilmaydi.</b> Mis faollik qatorida vodoroddan keyin turadi — kislotadan vodorodni siqib chiqara olmaydi.", fx: {} },
    "zn-h2so4": { a: "h2so4", b: "zn", t: "Rux + suyul. sulfat kislota", eq: [["Zn", "H2SO4"], ["ZnSO4", "H2"]], gas: "H2", obs: "Rux sirtida vodorod pufakchalari hosil bo‘ladi.", fx: { bub: 30, solid: "shrink", heat: 27 } },
    "cu-hno3": { a: "hno3", b: "cuw", t: "Mis + kons. nitrat kislota", eq: [["Cu", "HNO3"], ["Cu(NO3)2", "NO2", "H2O"]], obs: "Qo‘ng‘ir-qizil zaharli gaz (NO₂) ajraladi, eritma ko‘k-yashil rangga kiradi. Faqat mo‘rili shkafda!", fx: { bub: 40, bubC: "#f59e0b", gas: "#b45309", to: "#22c55e", solid: "shrink", heat: 45 } },
    "cu-h2so4k": { a: "h2so4k", b: "cuw", t: "Mis + kons. sulfat kislota (qizdirib)", eq: [["Cu", "H2SO4"], ["CuSO4", "SO2", "H2O"]], obs: "Qizdirilganda o‘tkir hidli SO₂ gazi ajraladi, eritma ko‘karadi.", fx: { bub: 22, to: "#60a5fa", solid: "shrink", heat: 90, gas: "#e5e7eb" } },
    "al-naoh": { a: "naoh", b: "al", t: "Alyuminiy + ishqor", eq: [["Al", "NaOH", "H2O"], ["Na[Al(OH)4]", "H2"]], gas: "H2", obs: "Alyuminiy ishqorda ham eriydi va vodorod ajraladi — u amfoter metall.", fx: { bub: 40, solid: "shrink", heat: 45 } },
    // --- metall + suv ---
    "na-h2o": { a: "water_php", b: "na", t: "Natriy + suv (fenolftalein)", eq: [["Na", "H2O"], ["NaOH", "H2"]], gas: "H2", obs: "Natriy suv ustida yugurib, vishillab eriydi; ishqor hosil bo‘lgani uchun eritma <b>to‘q pushti</b> tusga kiradi.", fx: { swim: true, bub: 20, solid: "gone", to: "#db2777", heat: 50 } },
    "ca-h2o": { a: "water_php", b: "ca", t: "Kalsiy + suv", eq: [["Ca", "H2O"], ["Ca(OH)2", "H2"]], gas: "H2", obs: "Kalsiy suv bilan tinchroq reaksiyaga kirishadi; eritma loyqalanadi va pushti tusga kiradi.", fx: { bub: 28, solid: "gone", to: "#f472b6", cloudy: "#ffffff", heat: 38 } },
    // --- metall + tuz (siqib chiqarish) ---
    "fe-cuso4": { a: "cuso4", b: "nail", t: "Temir mix + mis kuporosi", eq: [["Fe", "CuSO4"], ["FeSO4", "Cu"]], obs: "Mix sirti <b>qizil-mis</b> qatlam bilan qoplanadi, ko‘k eritma rangsizlanib yashilroq tus oladi.", ion: "Fe + Cu²⁺ → Fe²⁺ + Cu", fx: { deposit: "#b45309", to: "#86efac", alpha: 0.4 } },
    "zn-cuso4": { a: "cuso4", b: "zn", t: "Rux + mis(II) sulfat", eq: [["Zn", "CuSO4"], ["ZnSO4", "Cu"]], obs: "Rux qizil mis bilan qoplanadi, ko‘k rang yo‘qoladi.", ion: "Zn + Cu²⁺ → Zn²⁺ + Cu", fx: { deposit: "#b45309", to: CLR, alpha: 0.35 } },
    "cu-agno3": { a: "agno3", b: "cuw", t: "Mis sim + kumush nitrat", eq: [["Cu", "AgNO3"], ["Cu(NO3)2", "Ag"]], obs: "Mis sim kumush rang “daraxt” kristallari bilan qoplanadi, eritma ko‘karadi.", ion: "Cu + 2Ag⁺ → Cu²⁺ + 2Ag", fx: { deposit: "#e5e7eb", to: "#60a5fa", alpha: 0.4 } },
    "cu-znso4": { a: "znso4", b: "cuw", t: "Mis + rux sulfat", eq: null, obs: "<b>Reaksiya bormaydi.</b> Mis ruxdan kam faol — uni tuzidan siqib chiqara olmaydi.", fx: {} },
    // --- neytrallanish, indikatorlar ---
    "neutral": { a: "naoh_php", b: "hcl", t: "Ishqor + kislota (fenolftalein bilan)", eq: [["NaOH", "HCl"], ["NaCl", "H2O"]], obs: "Pushti rang yo‘qoladi — ishqor kislota bilan to‘liq neytrallandi, eritma iliq bo‘ladi.", ion: "H⁺ + OH⁻ → H₂O", fx: { to: CLR, alpha: 0.35, heat: 32 } },
    "php-naoh": { a: "naoh", b: "php", t: "Ishqor + fenolftalein", eq: null, obs: "Rangsiz eritma <b>to‘q pushti (malina)</b> rangga kiradi — muhit ishqoriy.", fx: { to: "#db2777", alpha: 0.6 } },
    "php-hcl": { a: "hcl", b: "php", t: "Kislota + fenolftalein", eq: null, obs: "Rang o‘zgarmaydi — fenolftalein kislotali muhitda rangsiz.", fx: {} },
    "cuoh2-hcl": { a: "cuoh2", b: "hcl", t: "Mis(II) gidroksid + kislota", eq: [["Cu(OH)2", "HCl"], ["CuCl2", "H2O"]], obs: "Ko‘k cho‘kma eriydi, eritma yashil-ko‘k rangga kiradi.", fx: { start: { ppt: "#3b82f6" }, dissolve: true, to: "#2dd4bf", alpha: 0.5 } },
    "cuo-h2so4": { a: "h2so4", b: "cuo", t: "Mis(II) oksid + sulfat kislota (qizdirib)", eq: [["CuO", "H2SO4"], ["CuSO4", "H2O"]], obs: "Qora kukun eriydi, eritma <b>ko‘k</b> rangga kiradi — mis(II) sulfat hosil bo‘ldi.", fx: { solid: "gone", to: "#3b82f6", alpha: 0.55, heat: 70 } },
    "zno-hcl": { a: "hcl", b: "zno", t: "Rux oksid + kislota", eq: [["ZnO", "HCl"], ["ZnCl2", "H2O"]], obs: "Oq kukun eriydi — ZnO asosli oksiddek kislota bilan reaksiyaga kirishdi.", fx: { solid: "gone" } },
    "zno-naoh": { a: "naoh", b: "zno", t: "Rux oksid + ishqor", eq: [["ZnO", "NaOH", "H2O"], ["Na2[Zn(OH)4]"]], obs: "ZnO ishqorda ham eriydi — u <b>amfoter</b> oksid.", fx: { solid: "gone" } },
    // --- cho'kmalar ---
    "agcl": { a: "nacl", b: "agno3", t: "Osh tuzi + kumush nitrat", eq: [["NaCl", "AgNO3"], ["AgCl", "NaNO3"]], obs: "<b>Oq pishloqsimon cho‘kma</b> (AgCl) tushadi — bu xlorid ioniga sifat reaksiyasi.", ion: "Ag⁺ + Cl⁻ → AgCl↓", fx: { ppt: "#f8fafc", cloudy: "#ffffff" } },
    "agbr": { a: "nabr", b: "agno3", t: "Natriy bromid + kumush nitrat", eq: [["NaBr", "AgNO3"], ["AgBr", "NaNO3"]], obs: "<b>Och sariq cho‘kma</b> (AgBr) — bromid ioniga sifat reaksiyasi.", ion: "Ag⁺ + Br⁻ → AgBr↓", fx: { ppt: "#fef08a", cloudy: "#fef9c3" } },
    "agi": { a: "ki", b: "agno3", t: "Kaliy yodid + kumush nitrat", eq: [["KI", "AgNO3"], ["AgI", "KNO3"]], obs: "<b>Sariq cho‘kma</b> (AgI) — yodid ioniga sifat reaksiyasi.", ion: "Ag⁺ + I⁻ → AgI↓", fx: { ppt: "#facc15", cloudy: "#fde047" } },
    "baso4": { a: "na2so4", b: "bacl2", t: "Sulfat + bariy xlorid", eq: [["Na2SO4", "BaCl2"], ["BaSO4", "NaCl"]], obs: "<b>Oq kristall cho‘kma</b> (BaSO₄) — kislotada ham erimaydi. Sulfat ioniga sifat reaksiyasi.", ion: "Ba²⁺ + SO₄²⁻ → BaSO₄↓", fx: { ppt: "#ffffff", cloudy: "#ffffff" } },
    "baso4-acid": { a: "h2so4", b: "bacl2", t: "Sulfat kislota + bariy xlorid", eq: [["H2SO4", "BaCl2"], ["BaSO4", "HCl"]], obs: "Oq cho‘kma (BaSO₄) tushadi.", ion: "Ba²⁺ + SO₄²⁻ → BaSO₄↓", fx: { ppt: "#ffffff", cloudy: "#ffffff" } },
    "cuoh2": { a: "cuso4", b: "naoh", t: "Mis(II) sulfat + ishqor", eq: [["CuSO4", "NaOH"], ["Cu(OH)2", "Na2SO4"]], obs: "<b>Havorang-ko‘k ivisimon cho‘kma</b> — mis(II) gidroksid.", ion: "Cu²⁺ + 2OH⁻ → Cu(OH)₂↓", fx: { ppt: "#3b82f6", to: "#bfdbfe", alpha: 0.35, cloudy: "#60a5fa" } },
    "feoh3": { a: "fecl3", b: "naoh", t: "Temir(III) xlorid + ishqor", eq: [["FeCl3", "NaOH"], ["Fe(OH)3", "NaCl"]], obs: "<b>Qo‘ng‘ir (zang rang) cho‘kma</b> — Fe(OH)₃. Fe³⁺ ioniga reaksiya.", ion: "Fe³⁺ + 3OH⁻ → Fe(OH)₃↓", fx: { ppt: "#92400e", to: "#fde68a", alpha: 0.3, cloudy: "#b45309" } },
    "feoh2": { a: "feso4", b: "naoh", t: "Temir(II) sulfat + ishqor", eq: [["FeSO4", "NaOH"], ["Fe(OH)2", "Na2SO4"]], obs: "<b>Oqish-yashil cho‘kma</b> — havoda asta qo‘ng‘irlashadi (Fe(OH)₃ ga oksidlanadi).", ion: "Fe²⁺ + 2OH⁻ → Fe(OH)₂↓", fx: { ppt: "#86efac", cloudy: "#bbf7d0" } },
    "znoh2": { a: "znso4", b: "naoh", t: "Rux sulfat + ishqor (oz)", eq: [["ZnSO4", "NaOH"], ["Zn(OH)2", "Na2SO4"]], obs: "<b>Oq ivisimon cho‘kma</b> — rux gidroksid.", ion: "Zn²⁺ + 2OH⁻ → Zn(OH)₂↓", fx: { ppt: "#f8fafc", cloudy: "#ffffff" } },
    "znoh2-hcl": { a: "znoh2", b: "hcl", t: "Zn(OH)₂ + kislota", eq: [["Zn(OH)2", "HCl"], ["ZnCl2", "H2O"]], obs: "Cho‘kma eriydi — Zn(OH)₂ asos kabi kislota bilan reaksiyaga kirishdi.", fx: { start: { ppt: "#f8fafc" }, dissolve: true } },
    "znoh2-naoh": { a: "znoh2", b: "naohx", t: "Zn(OH)₂ + ortiqcha ishqor", eq: [["Zn(OH)2", "NaOH"], ["Na2[Zn(OH)4]"]], obs: "Cho‘kma ishqorda ham eriydi — Zn(OH)₂ <b>amfoter</b> gidroksid.", fx: { start: { ppt: "#f8fafc" }, dissolve: true } },
    "aloh3": { a: "alcl3", b: "naoh", t: "Alyuminiy xlorid + ishqor (oz)", eq: [["AlCl3", "NaOH"], ["Al(OH)3", "NaCl"]], obs: "<b>Oq ivisimon cho‘kma</b> — Al(OH)₃.", ion: "Al³⁺ + 3OH⁻ → Al(OH)₃↓", fx: { ppt: "#f8fafc", cloudy: "#ffffff" } },
    "aloh3-naoh": { a: "aloh3", b: "naohx", t: "Al(OH)₃ + ortiqcha ishqor", eq: [["Al(OH)3", "NaOH"], ["Na[Al(OH)4]"]], obs: "Oq cho‘kma eriydi — alyuminiy gidroksid amfoter.", fx: { start: { ppt: "#f8fafc" }, dissolve: true } },
    "aloh3-hcl": { a: "aloh3", b: "hcl", t: "Al(OH)₃ + kislota", eq: [["Al(OH)3", "HCl"], ["AlCl3", "H2O"]], obs: "Cho‘kma kislotada ham eriydi.", fx: { start: { ppt: "#f8fafc" }, dissolve: true } },
    "pbs": { a: "pbno3", b: "h2s", t: "Qo‘rg‘oshin tuzi + vodorod sulfid", eq: [["Pb(NO3)2", "H2S"], ["PbS", "HNO3"]], obs: "<b>Qora cho‘kma</b> (PbS) — sulfid ioniga sifat reaksiyasi.", ion: "Pb²⁺ + S²⁻ → PbS↓", fx: { ppt: "#111827", cloudy: "#1f2937", bub: 12 } },
    "caco3-ppt": { a: "na2co3", b: "cacl2", t: "Soda + kalsiy xlorid", eq: [["Na2CO3", "CaCl2"], ["CaCO3", "NaCl"]], obs: "Oq cho‘kma — kalsiy karbonat (bo‘r).", ion: "Ca²⁺ + CO₃²⁻ → CaCO₃↓", fx: { ppt: "#ffffff", cloudy: "#ffffff" } },
    "h2sio3": { a: "na2sio3", b: "hcl", t: "Suyuq shisha + kislota", eq: [["Na2SiO3", "HCl"], ["H2SiO3", "NaCl"]], obs: "<b>Shaffof ivisimon (jelesimon)</b> silikat kislota cho‘kmasi hosil bo‘ladi.", fx: { cloudy: "#e0f2fe", op: 0.8, ppt: "#e0f2fe" } },
    // --- sifat reaksiyalari (rang) ---
    "fe3-scn": { a: "fecl3", b: "kscn", t: "Fe³⁺ + rodanid", eq: [["FeCl3", "KSCN"], ["Fe(SCN)3", "KCl"]], obs: "Eritma <b>qon-qizil</b> rangga kiradi — Fe³⁺ ioniga eng sezgir reaksiya.", fx: { to: "#991b1b", alpha: 0.85 } },
    "fe3-k4": { a: "fecl3", b: "k4fe", t: "Fe³⁺ + sariq qon tuzi", eq: null, obs: "<b>To‘q ko‘k cho‘kma</b> — “berlin zangorisi”. Fe³⁺ ioniga sifat reaksiyasi.", fx: { ppt: "#1e3a8a", to: "#1d4ed8", alpha: 0.7, cloudy: "#1e40af" } },
    "fe2-k3": { a: "feso4", b: "k3fe", t: "Fe²⁺ + qizil qon tuzi", eq: null, obs: "<b>To‘q ko‘k cho‘kma</b> — “turnbul zangorisi”. Fe²⁺ ioniga sifat reaksiyasi.", fx: { ppt: "#1e3a8a", to: "#1d4ed8", alpha: 0.7, cloudy: "#1e40af" } },
    "starch-i2": { a: "starch", b: "i2aq", t: "Kraxmal + yod", eq: null, obs: "Eritma <b>to‘q ko‘k</b> rangga kiradi — kraxmalga (va yodga) sifat reaksiyasi.", fx: { to: "#1e1b4b", alpha: 0.85 } },
    "cl2-ki": { a: "ki", b: "cl2aq", t: "Kaliy yodid + xlorli suv", eq: [["KI", "Cl2"], ["KCl", "I2"]], obs: "Eritma <b>qo‘ng‘ir</b> rangga kiradi — xlor yodni tuzidan siqib chiqardi (xlor faolroq).", fx: { to: "#92400e", alpha: 0.75 } },
    "br2-ki": { a: "ki", b: "br2aq", t: "Kaliy yodid + bromli suv", eq: [["KI", "Br2"], ["KBr", "I2"]], obs: "Eritma qo‘ng‘irlashadi — brom yoddan faol.", fx: { to: "#78350f", alpha: 0.7 } },
    "cl2-nabr": { a: "nabr", b: "cl2aq", t: "Natriy bromid + xlorli suv", eq: [["NaBr", "Cl2"], ["NaCl", "Br2"]], obs: "Eritma sarg‘ish-qo‘ng‘ir tusga kiradi — erkin brom ajraldi.", fx: { to: "#d97706", alpha: 0.6 } },
    "i2-nabr": { a: "nabr", b: "i2aq", t: "Natriy bromid + yod", eq: null, obs: "<b>Reaksiya bormaydi</b> — yod bromdan kam faol, uni siqib chiqara olmaydi.", fx: { to: "#d6a76b", alpha: 0.4 } },
    "kmno4-acid": { a: "kmno4", b: "na2so3", t: "KMnO₄ + Na₂SO₃ (kislotali muhit)", eq: [["KMnO4", "Na2SO3", "H2SO4"], ["MnSO4", "Na2SO4", "K2SO4", "H2O"]], obs: "Binafsha eritma <b>rangsizlanadi</b> — Mn⁺⁷ → Mn⁺² gacha qaytarildi.", fx: { to: CLR, alpha: 0.3 } },
    "kmno4-neut": { a: "kmno4", b: "na2so3", t: "KMnO₄ + Na₂SO₃ (neytral muhit)", eq: [["KMnO4", "Na2SO3", "H2O"], ["MnO2", "Na2SO4", "KOH"]], obs: "<b>Qo‘ng‘ir cho‘kma</b> (MnO₂) tushadi — Mn⁺⁷ → Mn⁺⁴.", fx: { ppt: "#57534e", to: "#a8a29e", alpha: 0.4, cloudy: "#78716c" } },
    "kmno4-base": { a: "kmno4", b: "na2so3", t: "KMnO₄ + Na₂SO₃ (ishqoriy muhit)", eq: [["KMnO4", "Na2SO3", "KOH"], ["K2MnO4", "Na2SO4", "H2O"]], obs: "Eritma <b>yashil</b> rangga kiradi (manganat ioni MnO₄²⁻) — Mn⁺⁷ → Mn⁺⁶.", fx: { to: "#15803d", alpha: 0.7 } },
    "cr2o7": { a: "k2cr2o7", b: "na2so3", t: "K₂Cr₂O₇ + Na₂SO₃ (kislotali)", eq: [["K2Cr2O7", "Na2SO3", "H2SO4"], ["Cr2(SO4)3", "Na2SO4", "K2SO4", "H2O"]], obs: "To‘q sariq eritma <b>yashil</b> rangga kiradi — Cr⁺⁶ → Cr⁺³.", fx: { to: "#16a34a", alpha: 0.65 } },
    "cro4-acid": { a: "k2cro4", b: "h2so4", t: "Xromat + kislota", eq: [["K2CrO4", "H2SO4"], ["K2Cr2O7", "K2SO4", "H2O"]], obs: "Sariq eritma <b>to‘q sariq</b> bo‘ladi — xromat dixromatga o‘tdi (muvozanat).", fx: { to: "#ea580c", alpha: 0.75 } },
    // --- gazlar ---
    "caco3-hcl": { a: "hcl", b: "caco3", t: "Bo‘r + xlorid kislota", eq: [["CaCO3", "HCl"], ["CaCl2", "H2O", "CO2"]], gas: "CO2", obs: "Shiddatli “qaynash” — karbonat angidrid gazi ajraladi, bo‘r eriydi.", ion: "CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑", fx: { bub: 60, solid: "shrink" }, test: "Yonib turgan cho‘p <b>o‘chadi</b> — CO₂ yonishga yordam bermaydi." },
    "na2co3-hcl": { a: "na2co3", b: "hcl", t: "Soda + kislota", eq: [["Na2CO3", "HCl"], ["NaCl", "H2O", "CO2"]], gas: "CO2", obs: "Ko‘p gaz pufakchalari — CO₂. Bu karbonat ioniga sifat reaksiyasi.", ion: "CO₃²⁻ + 2H⁺ → H₂O + CO₂↑", fx: { bub: 60, bubOrigin: "all" }, test: "Gaz ohakli suvdan o‘tkazilsa — suv loyqalanadi." },
    "soda-vinegar": { a: "vinegar", b: "nahco3", t: "Ichimlik sodasi + sirka", eq: [["NaHCO3", "CH3COOH"], ["CH3COONa", "H2O", "CO2"]], gas: "CO2", obs: "Ko‘pik va vishillash — CO₂ ajraladi. Xamir shu gaz hisobiga ko‘pchiydi!", fx: { bub: 80, bubOrigin: "all", solid: "gone", layer: "#ffffff" } },
    "limewater": { a: "caoh2", b: "co2", t: "Ohakli suv + CO₂", eq: [["Ca(OH)2", "CO2"], ["CaCO3", "H2O"]], obs: "Tiniq ohakli suv <b>loyqalanadi</b> — CaCO₃ hosil bo‘ldi. CO₂ ni aniqlash usuli.", fx: { bub: 18, bubOrigin: "tube", cloudy: "#ffffff", op: 0.7 } },
    "nh4-naoh": { a: "nh4cl", b: "naoh", t: "Ammoniy tuzi + ishqor (qizdirib)", eq: [["NH4Cl", "NaOH"], ["NaCl", "NH3", "H2O"]], gas: "NH3", obs: "O‘tkir hidli gaz — <b>ammiak</b> ajraladi. Ho‘l qizil lakmus qog‘ozi ko‘karadi.", ion: "NH₄⁺ + OH⁻ → NH₃↑ + H₂O", fx: { bub: 20, heat: 70, gas: "#f1f5f9" }, test: "HCl tomizilgan tayoqcha yaqinlashtirilsa — oq tutun (NH₄Cl)." },
    "h2o2-mno2": { a: "h2o2", b: "mno2", t: "Vodorod peroksid + MnO₂ (katalizator)", eq: [["H2O2"], ["H2O", "O2"]], gas: "O2", obs: "Shiddatli ko‘piklanish — kislorod ajraladi. MnO₂ sarflanmaydi, u faqat tezlashtiradi.", fx: { bub: 90, bubOrigin: "all", heat: 45 }, test: "Cho‘g‘lanib turgan cho‘p <b>alangalanib ketadi</b> — bu kislorod." },
    "h2o2-only": { a: "h2o2", b: "water", t: "Vodorod peroksid (katalizatorsiz)", eq: null, obs: "Deyarli o‘zgarish yo‘q — katalizatorsiz H₂O₂ juda sekin parchalanadi.", fx: { bub: 3 } },
    // --- organik ---
    "br2-c2h4": { a: "br2aq", b: "c2h4", t: "Bromli suv + etilen", eq: [["C2H4", "Br2"], ["C2H4Br2"]], obs: "Bromli suv <b>rangsizlanadi</b> — qo‘shbog‘ga brom birikdi. To‘yinmaganlikka sifat reaksiyasi.", fx: { bub: 18, bubOrigin: "tube", to: CLR, alpha: 0.3 } },
    "kmno4-c2h4": { a: "kmno4", b: "c2h4", t: "KMnO₄ eritmasi + etilen", eq: null, obs: "Binafsha rang yo‘qoladi, qo‘ng‘ir MnO₂ cho‘kmasi tushadi (Vagner reaksiyasi).", fx: { bub: 18, bubOrigin: "tube", to: "#d6d3d1", alpha: 0.35, ppt: "#57534e" } },
    "silver-mirror": { a: "agnh3", b: "aldehyde", t: "“Kumush ko‘zgu” reaksiyasi", eq: [["CH3CHO", "Ag2O"], ["CH3COOH", "Ag"]], obs: "Ozgina qizdirilganda probirka devori <b>yaltiroq kumush</b> bilan qoplanadi — aldegid guruhiga sifat reaksiyasi.", fx: { mirror: true, heat: 60 } },
    "cuoh2-ald": { a: "cuoh2", b: "aldehyde", t: "Cu(OH)₂ + aldegid (qizdirib)", eq: null, obs: "Ko‘k cho‘kma avval sariq, keyin <b>qizil-g‘isht rang</b> (Cu₂O) bo‘ladi — aldegidga sifat reaksiyasi.", fx: { start: { ppt: "#3b82f6" }, ppt: "#b91c1c", dissolve: true, heat: 80, to: "#fecaca", alpha: 0.3 } },
    "cuoh2-glyc": { a: "cuoh2", b: "glycerol", t: "Cu(OH)₂ + glitserin", eq: null, obs: "Cho‘kma eriydi, <b>yorqin ko‘k</b> eritma hosil bo‘ladi — ko‘p atomli spirtlarga sifat reaksiyasi.", fx: { start: { ppt: "#3b82f6" }, dissolve: true, to: "#1d4ed8", alpha: 0.75 } },
    "cuoh2-gluc": { a: "cuoh2", b: "glucose", t: "Cu(OH)₂ + glyukoza", eq: null, obs: "Sovuqda — yorqin ko‘k eritma (ko‘p atomli spirt kabi). Qizdirilsa — qizil Cu₂O cho‘kma (aldegid kabi). Glyukoza — aldegidospirt!", fx: { start: { ppt: "#3b82f6" }, dissolve: true, to: "#1d4ed8", alpha: 0.75 } },
    "phenol-fecl3": { a: "phenol", b: "fecl3", t: "Fenol + temir(III) xlorid", eq: null, obs: "Eritma <b>binafsha</b> rangga kiradi — fenolga sifat reaksiyasi.", fx: { to: "#6b21a8", alpha: 0.8 } },
    "biuret": { a: "protein", b: "cuso4", t: "Oqsil + CuSO₄ (ishqoriy) — biuret reaksiyasi", eq: null, obs: "Eritma <b>binafsha</b> rangga kiradi — peptid bog‘lariga (oqsilga) sifat reaksiyasi.", fx: { to: "#7e22ce", alpha: 0.65 } },
    "xanto": { a: "protein", b: "hno3", t: "Oqsil + kons. nitrat kislota — ksantoprotein", eq: null, obs: "Oq ivish, qizdirilganda <b>sariq</b> rang — aromatik halqali aminokislotalarga reaksiya.", fx: { ppt: "#facc15", cloudy: "#fde047", heat: 60 } },
    "ester": { a: "ch3cooh", b: "ethanol", t: "Sirka kislota + etanol (H₂SO₄, qizdirib)", eq: [["CH3COOH", "C2H5OH"], ["CH3COOC2H5", "H2O"]], arrow: "⇄", obs: "Suyuqlik yuzasida moysimon qatlam — <b>etil asetat</b>, meva hidi keladi (eterifikatsiya).", fx: { layer: "#fef3c7", heat: 70 } },
    "saponif": { a: "naoh", b: "fat", t: "Yog‘ + ishqor (qizdirib) — sovun olish", eq: null, obs: "Yog‘ qatlami yo‘qoladi, ko‘pik hosil bo‘ladi — <b>sovun</b> (yog‘ kislotalarining natriyli tuzlari) va glitserin.", fx: { heat: 90, bub: 50, bubOrigin: "all", to: "#f8fafc", alpha: 0.55 } },
    "soap-hard": { a: "cahco3", b: "soap", t: "Qattiq suv + sovun", eq: null, obs: "Ko‘pik deyarli yo‘q, <b>oq parchalar</b> (kalsiy stearat) cho‘kadi — sovun qattiq suvda behuda sarflanadi.", fx: { ppt: "#f8fafc", cloudy: "#ffffff", op: 0.4 } },
    "boil-hard": { a: "cahco3", b: "water", t: "Qattiq suvni qaynatish", eq: [["Ca(HCO3)2"], ["CaCO3", "H2O", "CO2"]], obs: "Qaynatilganda oq cho‘kma — <b>quyqa</b> (CaCO₃) tushadi. Vaqtinchalik qattiqlik yo‘qoladi.", fx: { heat: 100, bub: 50, bubOrigin: "all", ppt: "#f8fafc" } },
  };

  // ===================================================================
  // 1. Virtual laboratoriya
  // ===================================================================
  W.lab = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🧪 Virtual laboratoriya — tajribani tanlang va “Quyish” ni bosing");
    const list = (p.set || Object.keys(X)).filter((k) => X[k]);
    let cur = 0, busy = false;
    const sc = beakerScene(stage);
    const pick = h("div", { class: "kb-pick" });
    list.forEach((k, i) => pick.append(h("button", { type: "button", class: i === 0 ? "on" : "", onclick: () => { if (busy) return; cur = i; pick.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i)); setup(); } }, X[k].t)));
    const go = button("🧪 Quyish", () => run());
    const again = button("↺ Qaytadan", () => setup(), "ghost");
    controls.append(...(list.length > 1 ? [pick] : []), h("div", { class: "kb-row" }, go, again, SND.toggle()));

    function setup() {
      busy = false; go.disabled = false;
      const r = X[list[cur]], A = R[r.a], B = R[r.b];
      sc.reset(); sc.solid(null); sc.swim(false); sc.stopBubbles();
      sc.liquid(A[2], 70, A[2] === CLR ? 0.35 : 0.6);
      if (r.fx.start && r.fx.start.ppt) { sc.precipitate(r.fx.start.ppt, 0.8); }
      if ("mnpcw".includes(B[3])) { sc.tube(null, false); sc.label(`${esc(A[0])} ${A[1] ? `(${fml(A[1])})` : ""}`, ""); }
      else { sc.tube(B[3] === "g" ? null : B[2], true, B[2] === CLR ? 0.35 : 0.65); sc.label(`${esc(A[0])} ${A[1] ? `(${fml(A[1])})` : ""}`, `${B[3] === "g" ? "💨 " : ""}${B[1] ? fml(B[1]) : esc(B[0])}`); }
      out.innerHTML = `<div class="kb-hint">👉 <b>Taxmin qiling:</b> ${esc(A[0])} ga <b>${esc(B[0])}</b> qo‘shilsa nima bo‘ladi? Keyin “Quyish” ni bosing.</div>`;
      go.innerHTML = "mnpcw".includes(B[3]) ? `🧪 ${esc(B[0])}ni solish` : B[3] === "g" ? "💨 Gazni o‘tkazish" : "🧪 Quyish";
    }
    async function run() {
      if (busy) return; busy = true; go.disabled = true;
      const r = X[list[cur]], A = R[r.a], B = R[r.b], fx = r.fx;
      if ("mnpcw".includes(B[3])) {
        const kind = { m: "metal", n: "nail", w: "wire", p: "powder", c: "chunk" }[B[3]];
        sc.solid(kind, B[2]); if (B[3] === "p") SND.powder(); else SND.clink(B[3] === "c"); await wait(500);
      } else if (B[3] === "g") {
        sc.solid("wire", "rgba(255,255,255,.55)"); sc.bubbles(14, "#fff", "tube"); SND.bubbles(0.35, 1.6, true); await wait(800);
      } else { SND.pour(1.15); await sc.pour(B[2], 30, B[2] === CLR ? 0.35 : 0.6); }
      // tovushlar: gaz ajralishi, vishillash, qaynash
      const gx = fx.bub ? Math.min(1, fx.bub / 70) : 0;
      if (fx.swim) SND.sizzle(3.2);
      else if (gx && fx.heat >= 85) SND.boil(3.5);
      else if (gx) { SND.bubbles(gx, 3.6, B[3] === "g"); if (fx.bubOrigin === "all" || gx > 0.5) SND.fizz(gx, 3.6); }
      else if (fx.heat >= 60) SND.boil(2.5);
      if (fx.swim) sc.swim(true);
      if (fx.bub) sc.bubbles(fx.bub, fx.bubC || "#fff", fx.bubOrigin || (B[3] === "g" ? "tube" : "mnpcw".includes(B[3]) ? "solid" : "all"));
      if (fx.heat) { let t = 20; const id = setInterval(() => { t += Math.max(1, (fx.heat - t) / 6); sc.temp(Math.round(Math.min(t, fx.heat))); if (t >= fx.heat - 1) clearInterval(id); }, 120); }
      if (fx.to) setTimeout(() => sc.color(fx.to, fx.alpha), 300);
      if (fx.cloudy) setTimeout(() => sc.cloudy(fx.cloudy, fx.op || 0.45), 150);
      if (fx.ppt) setTimeout(() => sc.precipitate(fx.ppt, 1), fx.dissolve ? 1800 : 400);
      if (fx.dissolve) setTimeout(() => sc.dissolvePpt(), fx.ppt ? 200 : 300);
      if (fx.gas) setTimeout(() => sc.gasCloud(fx.gas), 500);
      if (fx.deposit) setTimeout(() => sc.solidColor(fx.deposit), 600);
      if (fx.solid === "shrink") setTimeout(() => sc.shrinkSolid(0.45), 300);
      if (fx.solid === "gone") setTimeout(() => sc.shrinkSolid(0.02), 300);
      if (fx.layer) setTimeout(() => sc.layer(fx.layer), 1200);
      if (fx.mirror) setTimeout(() => sc.mirror(true), 900);
      await wait(1800);
      let eqs = "";
      if (r.eq) { const k = balance(r.eq[0], r.eq[1]); eqs = `<div class="kb-eq">${eqHTML(r.eq[0], r.eq[1], k, r.arrow || "→")}${r.gas ? " ↑" : ""}</div>`; }
      out.innerHTML = `<div class="kb-obs">👁 <b>Kuzatish:</b> ${r.obs}</div>${eqs}${r.ion ? `<div class="kb-ion">Qisqa ionli tenglama: <b>${r.ion}</b></div>` : ""}${r.test ? `<div class="kb-test"><button type="button" class="dbtn kb-testb">🔥 Gazni tekshirish</button><span hidden>🔥 <b>Gazni tekshirish:</b> ${r.test}</span></div>` : ""}`;
      const tb = out.querySelector(".kb-testb");
      if (tb) tb.onclick = () => {
        tb.hidden = true; tb.nextElementSibling.hidden = false;
        if (r.gas === "H2") SND.pop(); else if (r.gas === "O2") SND.whoosh(0.8, true); else if (r.gas === "CO2") SND.fizzleOut(); else SND.whoosh(0.4);
        sc.flash(r.gas);
      };
      if (fx.bub && !fx.keep) setTimeout(() => sc.bubbles(Math.round(fx.bub / 4), fx.bubC || "#fff", fx.bubOrigin || "solid"), 2500);
      if (fx.swim) setTimeout(() => sc.swim(false), 3500);
    }
    setup();
  };
  W.lab.X = X; W.lab.R = R;

  // ===================================================================
  // 2. Alanga: metall ionlari bo'yicha rang va alanga tuzilishi
  // ===================================================================
  const FLAMES = [["Li", "Litiy", "#e11d48", "Li⁺ — to‘q qizil"], ["Na", "Natriy", "#facc15", "Na⁺ — sariq"], ["K", "Kaliy", "#a78bfa", "K⁺ — och binafsha"], ["Ca", "Kalsiy", "#f97316", "Ca²⁺ — g‘isht-qizil"],
    ["Sr", "Stronsiy", "#dc2626", "Sr²⁺ — qip-qizil"], ["Ba", "Bariy", "#84cc16", "Ba²⁺ — sarg‘ish-yashil"], ["Cu", "Mis", "#10b981", "Cu²⁺ — yashil-zangori"], ["B", "Bor", "#22c55e", "Bor — yashil"]];
  W.flame = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || (p.mode === "zones" ? "🔥 Alanga tuzilishi — zonani tanlang" : "🔥 Alanga rangi bo‘yicha metallarni aniqlash"));
    const g = svg(300, 280, "kb-svg");
    g.innerHTML = `
      <defs><radialGradient id="flg" cy=".75"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <g class="kf-flame">
        <path class="kf-outer" d="M150 30 C 105 95 108 150 116 190 C 122 215 178 215 184 190 C 192 150 195 95 150 30 Z" fill="#60a5fa" opacity=".5"/>
        <path class="kf-mid" d="M150 70 C 122 120 126 160 132 188 C 138 206 162 206 168 188 C 174 160 178 120 150 70 Z" fill="#3b82f6" opacity=".75"/>
        <path class="kf-inner" d="M150 120 C 138 150 140 172 143 188 C 146 198 154 198 157 188 C 160 172 162 150 150 120 Z" fill="#1e3a8a" opacity=".9"/>
      </g>
      <rect x="138" y="198" width="24" height="56" rx="3" fill="currentColor" opacity=".55"/><rect x="118" y="252" width="64" height="12" rx="4" fill="currentColor" opacity=".7"/>
      <g class="kf-wire" opacity="0"><line x1="290" y1="60" x2="168" y2="150" stroke="#d1d5db" stroke-width="3"/><circle cx="166" cy="152" r="5" fill="none" stroke="#e5e7eb" stroke-width="2.5"/></g>
      <g class="kf-zones" opacity="0">
        <line x1="150" y1="44" x2="232" y2="44" stroke="currentColor" stroke-dasharray="3 3"/><text x="236" y="48" class="kf-z">3 — tashqi</text>
        <line x1="150" y1="110" x2="232" y2="110" stroke="currentColor" stroke-dasharray="3 3"/><text x="236" y="114" class="kf-z">2 — o‘rta</text>
        <line x1="150" y1="168" x2="232" y2="168" stroke="currentColor" stroke-dasharray="3 3"/><text x="236" y="172" class="kf-z">1 — ichki</text>
      </g>`;
    stage.append(g);
    const outer = g.querySelector(".kf-outer"), mid = g.querySelector(".kf-mid"), wire = g.querySelector(".kf-wire");
    const paint = (c) => { outer.style.transition = mid.style.transition = "fill .5s"; outer.style.fill = c || "#60a5fa"; mid.style.fill = c || "#3b82f6"; };
    if (p.mode === "zones") {
      g.querySelector(".kf-zones").setAttribute("opacity", 1);
      const Z = [["1 — Ichki zona", "≈ 300–500 °C. Eng sovuq qism: gaz hali yonmagan, kislorod yetishmaydi. Bu yerda qora rangli “o‘zak” ko‘rinadi."],
        ["2 — O‘rta (qaytaruvchi) zona", "≈ 1000–1300 °C. Chala yonish: uglerod zarrachalari va CO bor — oksidlarni qaytaradi. Alanga yorug‘ shu zarrachalar hisobiga."],
        ["3 — Tashqi (oksidlovchi) zona", "≈ 1500–1600 °C. Eng issiq! Kislorod mo‘l — to‘liq yonish. Probirkani <b>shu zonada</b> qizdiramiz."]];
      controls.append(buttons(Z.map((z) => z[0]), (i) => { out.innerHTML = `<b>${Z[i][0]}</b><div>${Z[i][1]}</div>`; [g.querySelector(".kf-inner"), mid, outer].forEach((e, j) => (e.style.opacity = j === i ? 1 : 0.35)); }, -1));
      out.innerHTML = "Zonalardan birini tanlang — harorati va vazifasi chiqadi. 🧯 Spirt lampani faqat qopqog‘i bilan o‘chiring, puflamang!";
      return;
    }
    const list = p.ions ? FLAMES.filter((f) => p.ions.includes(f[0])) : FLAMES;
    controls.append(buttons(["🔵 Toza alanga", ...list.map((f) => `${f[0]} — ${f[1]}`)], (i) => {
      if (!i) { wire.setAttribute("opacity", 0); paint(null); SND.whoosh(0.6); out.innerHTML = "Gaz gorelkasining toza alangasi — deyarli rangsiz-zangori."; return; }
      const f = list[i - 1]; wire.setAttribute("opacity", 1); setTimeout(() => { paint(f[2]); SND.whoosh(0.7, true); }, 250);
      out.innerHTML = `Platina sim <b>${f[1]}</b> tuziga botirib alangaga kiritildi: <span class="kf-chip" style="background:${f[2]}"></span> <b>${f[3]}</b>. <div class="muted">Pirotexnikada (salyut) aynan shu tuzlar ishlatiladi.</div>`;
    }));
    controls.append(SND.toggle());
    out.innerHTML = "Metall tuzini tanlang — alanga rangi o‘zgaradi. Bu usul bilan ionlarni aniqlash mumkin.";
  };

  // ===================================================================
  // 3. Indikatorlar va pH
  // ===================================================================
  const SUBST = [["Me’da shirasi", 1.5], ["Limon sharbati", 2.4], ["Sirka", 2.9], ["Coca-Cola", 3], ["Kofe", 5], ["Yomg‘ir suvi", 5.6], ["Sut", 6.6], ["Toza suv", 7], ["Qon", 7.4],
    ["Dengiz suvi", 8], ["Ichimlik sodasi", 8.3], ["Sovun eritmasi", 10], ["Ammiakli suv", 11.6], ["Ohak suvi", 12.4], ["Natriy gidroksid", 13.5]];
  const SALTS = [["NaCl (kuchli asos + kuchli kislota)", 7], ["Na₂CO₃ (kuchli asos + kuchsiz kislota)", 11.6], ["CH₃COONa", 8.9], ["K₂S", 12], ["NH₄Cl (kuchsiz asos + kuchli kislota)", 5.1], ["AlCl₃", 3], ["ZnCl₂", 5], ["CuSO₄", 4], ["KNO₃", 7], ["Na₂SO₄", 7]];
  const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const hex = (c) => `rgb(${c.join(",")})`;
  function universal(ph) {
    const st = [[0, [220, 38, 38]], [3, [249, 115, 22]], [5, [250, 204, 21]], [7, [34, 197, 94]], [9, [20, 184, 166]], [11, [59, 130, 246]], [14, [91, 33, 182]]];
    for (let i = 1; i < st.length; i++) if (ph <= st[i][0]) return hex(lerp(st[i - 1][1], st[i][1], (ph - st[i - 1][0]) / (st[i][0] - st[i - 1][0])));
    return hex(st[st.length - 1][1]);
  }
  const INDIC = [
    ["Lakmus", (ph) => (ph < 5 ? "#dc2626" : ph > 8 ? "#2563eb" : "#7c3aed"), (ph) => (ph < 5 ? "qizil" : ph > 8 ? "ko‘k" : "binafsha")],
    ["Fenolftalein", (ph) => (ph < 8.2 ? "rgba(255,255,255,.25)" : ph < 10 ? "#f9a8d4" : "#db2777"), (ph) => (ph < 8.2 ? "rangsiz" : "malina (pushti)")],
    ["Metiloranj", (ph) => (ph < 3.1 ? "#ef4444" : ph < 4.4 ? "#fb923c" : "#facc15"), (ph) => (ph < 3.1 ? "qizil" : ph < 4.4 ? "to‘q sariq" : "sariq")],
    ["Universal", universal, (ph) => (ph < 6.5 ? "qizildan sariqqacha" : ph <= 7.5 ? "yashil" : "ko‘kdan binafshagacha")],
  ];
  W.ph = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "🌈 Indikatorlar va pH — eritmani tanlang yoki pH ni o‘zgartiring");
    const items = p.salts ? SALTS : SUBST;
    let ph = p.ph ?? 7;
    const tubes = h("div", { class: "kph-tubes" });
    const scale = h("div", { class: "kph-scale" }, ...Array.from({ length: 15 }, (_, i) => h("span", { style: `background:${universal(i)}` }, String(i))), h("i", { class: "kph-mark" }));
    stage.append(tubes, scale);
    const sel = h("select", { class: "kb-select", "aria-label": "Eritma" }, h("option", { value: "" }, "— eritmani tanlang —"), ...items.map(([n, v], i) => h("option", { value: i }, `${n}`)));
    sel.onchange = () => { if (sel.value !== "") { ph = items[sel.value][1]; sl.set(ph); draw(); } };
    const sl = slider({ label: "pH", min: 0, max: 14, step: 0.1, value: ph, fmt: (v) => num(v, 1), onInput: (v) => { ph = v; sel.value = ""; draw(); } });
    controls.append(h("label", { class: "ctl" }, h("span", {}, p.salts ? "Tuz eritmasi" : "Modda"), sel), sl);
    function draw() {
      tubes.innerHTML = INDIC.map(([n, c, w]) => `<div class="kph-t"><div class="kph-glass"><i style="background:${c(ph)}"></i></div><b>${n}</b><small>${w(ph)}</small></div>`).join("");
      scale.querySelector(".kph-mark").style.left = `${(ph / 14) * 100}%`;
      const kind = ph < 6.8 ? ["kislotali", "#ef4444", "H⁺ ionlari ko‘p"] : ph > 7.2 ? ["ishqoriy", "#3b82f6", "OH⁻ ionlari ko‘p"] : ["neytral", "#22c55e", "[H⁺] = [OH⁻]"];
      const name = sel.value !== "" ? `<b>${esc(items[sel.value][0])}</b>: ` : "";
      out.innerHTML = `${name}pH = <b>${num(ph, 1)}</b> → muhit <b style="color:${kind[1]}">${kind[0]}</b> (${kind[2]}). <div class="muted">[H⁺] = 10<sup>−${num(ph, 1)}</sup> mol/l. pH 1 birlikka kamaysa, kislotalilik <b>10 marta</b> ortadi.${p.salts ? " Tuz eritmasining muhitini <b>gidroliz</b> belgilaydi: “kuchlisi g‘olib”." : ""}</div>`;
    }
    draw();
  };

  // ===================================================================
  // 4. Titrlash (neytrallanish egri chizig'i)
  // ===================================================================
  W.titration = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "⚗️ Neytrallanish: kislotaga ishqor tomizib boring");
    const Va = 20, Ca = 0.1, Cb = 0.1; let Vb = 0;
    const sc = beakerScene(stage); sc.tube(null, false); sc.label("20 ml HCl (0,1 M) + fenolftalein", "");
    const plot = svg(300, 170, "kt-plot"); stage.append(plot);
    const pH = (vb) => { const nA = Ca * Va / 1000, nB = Cb * vb / 1000, V = (Va + vb) / 1000; if (Math.abs(nA - nB) < 1e-9) return 7; return nA > nB ? -Math.log10((nA - nB) / V) : 14 + Math.log10((nB - nA) / V); };
    const X0 = 34, Y0 = 150, SX = 6.2, SY = 9.6;
    plot.innerHTML = `<line x1="${X0}" y1="${Y0}" x2="${X0 + 40 * SX}" y2="${Y0}" stroke="currentColor" opacity=".5"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - 14 * SY}" stroke="currentColor" opacity=".5"/>
      <line x1="${X0}" x2="${X0 + 40 * SX}" y1="${Y0 - 7 * SY}" y2="${Y0 - 7 * SY}" stroke="#22c55e" stroke-dasharray="4 4" opacity=".6"/>
      <text x="${X0 + 40 * SX}" y="${Y0 + 14}" text-anchor="end" class="kt-ax">NaOH, ml</text><text x="${X0 - 6}" y="${Y0 - 14 * SY + 4}" text-anchor="end" class="kt-ax">pH 14</text><text x="${X0 - 6}" y="${Y0 - 7 * SY + 4}" text-anchor="end" class="kt-ax">7</text>
      <polyline class="kt-line" fill="none" stroke="#f472b6" stroke-width="2.5"/><circle class="kt-dot" r="4.5" fill="#f472b6"/>`;
    const pts = [];
    function draw() {
      const v = pH(Vb); pts.push([Vb, v]); pts.sort((a, b) => a[0] - b[0]);
      plot.querySelector(".kt-line").setAttribute("points", pts.map(([x, y]) => `${X0 + x * SX},${Y0 - y * SY}`).join(" "));
      const d = plot.querySelector(".kt-dot"); d.setAttribute("cx", X0 + Vb * SX); d.setAttribute("cy", Y0 - v * SY);
      sc.liquid(v >= 8.2 ? (v > 10 ? "#db2777" : "#f9a8d4") : CLR, 40 + Vb * 2.2, v >= 8.2 ? 0.6 : 0.35);
      out.innerHTML = `Qo‘shildi: <b>${num(Vb, 1)} ml</b> NaOH · pH = <b>${num(v, 2)}</b> ${Math.abs(Vb - 20) < 0.05 ? "— 🎯 <b>ekvivalent nuqta!</b> Kislota to‘liq neytrallandi: n(HCl) = n(NaOH)." : v > 8.2 ? "— eritma pushti: ishqor ortiqcha." : "— hali kislota ko‘p, fenolftalein rangsiz."}
        <div class="muted">HCl + NaOH → NaCl + H₂O. Ekvivalent nuqtada pH keskin 4 dan 10 ga “sakraydi” — bitta tomchi rangni o‘zgartiradi.</div>`;
    }
    const add = (d) => { Vb = Math.max(0, Math.min(40, Math.round((Vb + d) * 10) / 10)); SND.drip(d >= 5 ? 4 : d >= 1 ? 2 : 1); draw(); };
    controls.append(h("div", { class: "kb-row" }, button("💧 +0,1 ml", () => add(0.1), "ghost"), button("💧 +1 ml", () => add(1)), button("💧💧 +5 ml", () => add(5)), button("↺", () => { Vb = 0; pts.length = 0; draw(); }, "ghost"), SND.toggle()));
    draw();
  };

  // ===================================================================
  // 5. Elektr o'tkazuvchanlik (elektrolitlar)
  // ===================================================================
  const COND = [["Distillangan suv", 0, "molekulalar, ion yo‘q"], ["Qattiq NaCl (kristall)", 0, "ionlar panjarada qotib turgan — harakatlana olmaydi"], ["NaCl eritmasi", 3, "Na⁺ va Cl⁻ erkin ionlar"],
    ["Shakar eritmasi", 0, "molekulalar dissotsilanmaydi — noelektrolit"], ["Xlorid kislota", 3, "H⁺ va Cl⁻ — kuchli elektrolit"], ["Sirka kislota", 1, "kam dissotsilanadi — kuchsiz elektrolit"],
    ["NaOH eritmasi", 3, "Na⁺ va OH⁻ — kuchli elektrolit"], ["Ammiakli suv", 1, "NH₄⁺ va OH⁻ juda oz — kuchsiz elektrolit"], ["Etil spirt", 0, "noelektrolit"], ["NaCl suyuqlanmasi (801 °C)", 3, "ionlar erkin harakatlanadi"], ["Mis(II) sulfat eritmasi", 3, "Cu²⁺ va SO₄²⁻"]];
  W.conduct = (root, p) => {
    const { stage, controls, out } = frame(root, p.title || "💡 Elektr tokini o‘tkazadimi? Moddani tanlang");
    const g = svg(320, 230, "kb-svg");
    g.innerHTML = `<path d="M80 80 L80 200 Q80 214 94 214 L226 214 Q240 214 240 200 L240 80" fill="none" stroke="currentColor" stroke-width="3" opacity=".75"/>
      <rect class="kc-liq" x="83" y="120" width="154" height="92" fill="#bfdbfe" opacity=".35"/><g class="kc-ions"></g>
      <rect x="112" y="60" width="8" height="130" fill="#475569"/><rect x="200" y="60" width="8" height="130" fill="#475569"/>
      <path d="M116 60 L116 30 L148 30 M172 30 L204 30 L204 60" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle class="kc-glow" cx="160" cy="24" r="30" fill="#fde047" opacity="0"/>
      <circle cx="160" cy="24" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M155 30 L157 20 L160 26 L163 20 L165 30" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <text x="116" y="205" text-anchor="middle" class="kt-ax">−</text><text x="204" y="205" text-anchor="middle" class="kt-ax">+</text>`;
    stage.append(g);
    const list = p.items ? COND.filter((c) => p.items.includes(c[0])) : COND;
    controls.append(buttons(list.map((c) => c[0]), (i) => {
      const [n, lv, why] = list[i];
      SND.buzz([0, 0.4, 0, 1][lv]);
      g.querySelector(".kc-glow").setAttribute("opacity", [0, 0.25, 0, 0.85][lv]);
      g.querySelector(".kc-glow").setAttribute("r", [0, 18, 0, 34][lv]);
      const io = g.querySelector(".kc-ions"); io.innerHTML = "";
      const nIons = [0, 6, 0, 30][lv];
      for (let k = 0; k < nIons; k++) { const plus = k % 2 === 0; const c = s("text", { x: 92 + Math.random() * 136, y: 135 + Math.random() * 70, class: "kc-ion " + (plus ? "pl" : "mi"), "text-anchor": "middle" }, io); c.textContent = plus ? "+" : "−"; c.style.animationDelay = `${-Math.random() * 3}s`; c.style.setProperty("--dx", plus ? "-30px" : "30px"); }
      g.querySelector(".kc-liq").setAttribute("opacity", /Qattiq/.test(n) ? 0 : 0.35);
      out.innerHTML = `<b>${n}</b>: ${lv === 3 ? "💡 lampochka <b>yorqin</b> yonadi — kuchli elektrolit" : lv === 1 ? "🔅 lampochka <b>xira</b> yonadi — kuchsiz elektrolit" : "⚫ lampochka <b>yonmaydi</b> — tok o‘tmaydi"}.<div class="muted">Sababi: ${why}.</div>`;
    }, -1));
    controls.append(SND.toggle());
    out.innerHTML = "Elektrodlarni turli moddalarga tushirib ko‘ring. Tokni faqat <b>erkin harakatlanuvchi ionlar</b> o‘tkazadi.";
  };
})();
