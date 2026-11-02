/* FERMA OVOZLARI — Web Audio bilan sintez qilinadi (fayl yuklanmaydi).
   Tabiat: shamol, qushlar (kunduz), chigirtkalar (kechasi).
   Hayvonlar: sigir (mo‘o‘), qo‘y (ba‘a), tovuq (qaq-qaq), xo‘roz (qu-qu-qu), ot (kishnash).
   Ishlar: suv quyish, beda shitirlashi, don sochish, tanga. */
(() => {
  "use strict";
  const KEY = "sofi_farm_sound";
  const rand = (a, b) => a + Math.random() * (b - a);
  let ctx = null, master = null, comp = null, noiseBuf = null, brownBuf = null;
  let on = true;
  try { on = localStorage.getItem(KEY) !== "0"; } catch (e) { /* bo'sh */ }
  const amb = { nodes: [], timers: [], night: false, running: false };

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume().catch(() => {}); return !!ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (e) { return false; }
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = on ? 0.9 : 0;
    master.connect(comp); comp.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    brownBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const w = noiseBuf.getChannelData(0), b = brownBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { w[i] = Math.random() * 2 - 1; last = (last + 0.02 * w[i]) / 1.02; b[i] = last * 3.5; }
    // Mobil Safari: birinchi teginishda ochiladi
    const unlock = () => { if (ctx.state === "suspended") ctx.resume().catch(() => {}); };
    document.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("keydown", unlock);
    return true;
  }
  const ready = () => ctx && on && ctx.state !== "closed";

  // Chiqish: ovoz balandligi + chap/o'ng
  function out(vol = 1, pan = 0) {
    const g = ctx.createGain(); g.gain.value = vol;
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); g.connect(p); p.connect(master); }
    else g.connect(master);
    return g;
  }
  function env(g, t, a, peak, hold, rel) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
    return t + a + hold + rel;
  }
  const osc = (type, f, t) => { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); return o; };
  const filt = (type, f, q = 1) => { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; };
  function noise(t, dur, brown) {
    const s = ctx.createBufferSource(); s.buffer = brown ? brownBuf : noiseBuf; s.loop = true;
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
    return s;
  }
  function vibrato(target, t, end, rate, depth) {
    const l = osc("sine", rate, t), lg = ctx.createGain(); lg.gain.value = depth;
    l.connect(lg); lg.connect(target); l.start(t); l.stop(end);
    return { l, lg };
  }

  // ================= HAYVONLAR =================
  function moo(dst) {
    const t = ctx.currentTime + 0.02, dur = rand(1.25, 1.75), f0 = rand(92, 122);
    const o1 = osc("sawtooth", f0 * 0.8, t), o2 = osc("square", f0 * 0.4, t);
    [o1, o2].forEach((o, i) => {
      const m = i ? 0.5 : 1;
      o.frequency.linearRampToValueAtTime(f0 * 1.05 * m, t + 0.35);
      o.frequency.linearRampToValueAtTime(f0 * 0.97 * m, t + dur * 0.7);
      o.frequency.linearRampToValueAtTime(f0 * 0.72 * m, t + dur);
    });
    vibrato(o1.frequency, t, t + dur, 5.5, 1.6);
    const lp = filt("lowpass", 260, 5);
    lp.frequency.setValueAtTime(260, t);
    lp.frequency.linearRampToValueAtTime(950, t + 0.4);
    lp.frequency.linearRampToValueAtTime(620, t + dur);
    const form = filt("bandpass", 720, 3), fg = ctx.createGain(); fg.gain.value = 0.6;
    const mix = ctx.createGain(), g2 = ctx.createGain(); g2.gain.value = 0.35;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(mix); o1.connect(form); form.connect(fg); fg.connect(mix);
    const g = ctx.createGain(); mix.connect(g); g.connect(dst);
    const end = env(g, t, 0.2, 0.55, dur - 0.55, 0.35);
    [o1, o2].forEach((o) => { o.start(t); o.stop(end + 0.05); });
    // nafas
    const n = noise(t, dur, true), nf = filt("bandpass", 500, 0.8), ng = ctx.createGain();
    n.connect(nf); nf.connect(ng); ng.connect(dst); env(ng, t, 0.2, 0.05, dur - 0.5, 0.3);
  }
  function baa(dst) {
    const t = ctx.currentTime + 0.02, dur = rand(0.75, 1.05), f0 = rand(290, 380);
    const o = osc("sawtooth", f0 * 1.12, t);
    o.frequency.linearRampToValueAtTime(f0, t + 0.12);
    o.frequency.linearRampToValueAtTime(f0 * 0.9, t + dur);
    vibrato(o.frequency, t, t + dur, 6, 4);
    // titroq (ma-a-a-a)
    const am = ctx.createGain(); am.gain.value = 0.55;
    const l = osc("triangle", rand(18, 26), t), lg = ctx.createGain(); lg.gain.value = 0.45;
    l.connect(lg); lg.connect(am.gain); l.start(t); l.stop(t + dur + 0.1);
    const f1 = filt("bandpass", 950, 2.2), f2 = filt("bandpass", 2400, 3), f2g = ctx.createGain(); f2g.gain.value = 0.45;
    const mixed = ctx.createGain();
    o.connect(am); am.connect(f1); am.connect(f2); f1.connect(mixed); f2.connect(f2g); f2g.connect(mixed);
    const lp = filt("lowpass", 600, 1); lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(3200, t + 0.12);
    const g = ctx.createGain(); mixed.connect(lp); lp.connect(g); g.connect(dst);
    const end = env(g, t, 0.06, 0.75, dur - 0.3, 0.24);
    o.start(t); o.stop(end + 0.05);
  }
  function cluckOnce(dst, t, f, len, vol) {
    const o = osc("triangle", f, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.65, t + len);
    const bp = filt("bandpass", 1150, 1.6), g = ctx.createGain();
    o.connect(bp); bp.connect(g); g.connect(dst);
    const end = env(g, t, 0.008, vol, len * 0.4, len * 0.6);
    o.start(t); o.stop(end + 0.02);
    const n = noise(t, 0.03), nf = filt("bandpass", 2600, 2), ng = ctx.createGain();
    n.connect(nf); nf.connect(ng); ng.connect(dst); env(ng, t, 0.002, vol * 0.25, 0.005, 0.02);
  }
  function cluck(dst) {
    let t = ctx.currentTime + 0.02;
    const n = 3 + (Math.random() * 4 | 0), base = rand(420, 560);
    for (let i = 0; i < n; i++) { cluckOnce(dst, t, base * rand(0.92, 1.08), rand(0.05, 0.08), 0.7); t += rand(0.11, 0.2); }
    if (Math.random() < 0.55) { // "qa-a-aq!"
      const o = osc("sawtooth", base * 1.1, t);
      o.frequency.linearRampToValueAtTime(base * 1.9, t + 0.12); o.frequency.linearRampToValueAtTime(base * 1.3, t + 0.38);
      const bp = filt("bandpass", 1500, 2.5), g = ctx.createGain();
      o.connect(bp); bp.connect(g); g.connect(dst);
      const end = env(g, t, 0.03, 0.55, 0.22, 0.14); o.start(t); o.stop(end + 0.02);
    }
  }
  function crow(dst) {
    const t = ctx.currentTime + 0.02;
    [[0, 0.16, 560, 760], [0.2, 0.18, 760, 880], [0.42, 0.85, 880, 640]].forEach(([d, len, a, b], i) => {
      const s = t + d, o = osc("sawtooth", a, s);
      o.frequency.linearRampToValueAtTime(i === 2 ? 1000 : b, s + len * 0.35);
      o.frequency.linearRampToValueAtTime(b, s + len);
      vibrato(o.frequency, s, s + len, 7.5, 14);
      const f1 = filt("bandpass", 1400, 2), f2 = filt("bandpass", 2900, 3), g = ctx.createGain(), g2 = ctx.createGain(); g2.gain.value = 0.5;
      o.connect(f1); o.connect(f2); f2.connect(g2); f1.connect(g); g2.connect(g); g.connect(dst);
      const end = env(g, s, 0.03, 0.6, len - 0.1, 0.08); o.start(s); o.stop(end + 0.02);
    });
  }
  function neigh(dst) {
    const t = ctx.currentTime + 0.02, dur = rand(1.2, 1.55);
    const o = osc("sawtooth", 900, t);
    o.frequency.linearRampToValueAtTime(1350, t + 0.16);
    o.frequency.exponentialRampToValueAtTime(480, t + dur);
    // kishnashdagi titroq
    const l = osc("sine", 9, t), lg = ctx.createGain();
    l.frequency.linearRampToValueAtTime(15, t + dur);
    lg.gain.setValueAtTime(40, t); lg.gain.linearRampToValueAtTime(130, t + dur);
    l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.1);
    const hp = filt("highpass", 450, 0.7), f1 = filt("bandpass", 1700, 1.3), g = ctx.createGain();
    o.connect(hp); hp.connect(f1); f1.connect(g); g.connect(dst);
    const end = env(g, t, 0.05, 0.6, dur - 0.35, 0.3); o.start(t); o.stop(end + 0.02);
    // pishqirish
    const s = end + 0.12, n = noise(s, 0.35, false), nf = filt("bandpass", 650, 1.2), ng = ctx.createGain();
    n.connect(nf); nf.connect(ng); ng.connect(dst); env(ng, s, 0.02, 0.45, 0.1, 0.22);
  }
  const VOICES = { sigir: moo, qoy: baa, tovuq: cluck, xoroz: crow, ot: neigh };
  function voice(kind, o = {}) {
    if (!ready() || !VOICES[kind]) return;
    VOICES[kind](out((o.vol ?? 1) * 0.9, o.pan || 0));
  }

  // ================= ISHLAR =================
  function water(dst) {
    const t = ctx.currentTime + 0.02, dur = 1.3;
    const n = noise(t, dur), bp = filt("bandpass", 1200, 1.4), g = ctx.createGain();
    for (let i = 0; i < 26; i++) bp.frequency.setValueAtTime(rand(700, 2600), t + (i / 26) * dur);
    n.connect(bp); bp.connect(g); g.connect(dst); env(g, t, 0.12, 0.5, dur - 0.4, 0.28);
    for (let i = 0; i < 7; i++) { // tomchilar
      const s = t + rand(0.1, dur), o = osc("sine", rand(700, 1300), s), og = ctx.createGain();
      o.frequency.exponentialRampToValueAtTime(rand(1600, 2400), s + 0.06);
      o.connect(og); og.connect(dst); const e = env(og, s, 0.005, 0.16, 0.01, 0.06); o.start(s); o.stop(e + 0.02);
    }
  }
  function hay(dst) {
    const t = ctx.currentTime + 0.02, dur = 1.0;
    const n = noise(t, dur), hp = filt("highpass", 2200, 0.7), g = ctx.createGain();
    n.connect(hp); hp.connect(g); g.connect(dst);
    g.gain.setValueAtTime(0.0001, t);
    for (let i = 0; i < 40; i++) g.gain.setValueAtTime(Math.random() < 0.5 ? rand(0.05, 0.4) : 0.01, t + (i / 40) * dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
  }
  function grain(dst) {
    const t = ctx.currentTime + 0.02;
    for (let i = 0; i < 34; i++) {
      const s = t + rand(0, 0.85), n = noise(s, 0.02), bp = filt("bandpass", rand(3000, 6000), 4), g = ctx.createGain();
      n.connect(bp); bp.connect(g); g.connect(dst); env(g, s, 0.001, rand(0.2, 0.55), 0.003, 0.015);
    }
  }
  function tone(dst, notes, type = "triangle", vol = 0.35, step = 0.09, len = 0.14) {
    const t = ctx.currentTime + 0.01;
    notes.forEach((f, i) => { const s = t + i * step, o = osc(type, f, s), g = ctx.createGain(); o.connect(g); g.connect(dst); const e = env(g, s, 0.01, vol, len * 0.3, len); o.start(s); o.stop(e + 0.02); });
  }
  const FX = {
    water, hay, grain,
    coin: (d) => tone(d, [988, 1319, 1760], "square", 0.12, 0.06, 0.1),
    ok: (d) => tone(d, [660, 880], "triangle", 0.3, 0.07, 0.1),
    bad: (d) => tone(d, [220, 175], "sawtooth", 0.14, 0.12, 0.18),
    done: (d) => tone(d, [523, 659, 784, 1047, 1319], "triangle", 0.3, 0.1, 0.2),
    tap: (d) => tone(d, [1200], "sine", 0.12, 0, 0.04)
  };
  function fx(name, o = {}) { if (ready() && FX[name]) FX[name](out(o.vol ?? 1, o.pan || 0)); }

  // ================= TABIAT =================
  function chirp() {
    if (!ready() || amb.night) return;
    const dst = out(rand(0.08, 0.2), rand(-0.9, 0.9));
    let t = ctx.currentTime + 0.01;
    const n = 2 + (Math.random() * 5 | 0), base = rand(2600, 4400), kind = Math.random();
    for (let i = 0; i < n; i++) {
      const o = osc("sine", base, t), g = ctx.createGain(), len = rand(0.05, 0.11);
      if (kind < 0.5) { o.frequency.exponentialRampToValueAtTime(base * rand(1.2, 1.6), t + len); }
      else { o.frequency.setValueAtTime(base * 1.4, t); o.frequency.exponentialRampToValueAtTime(base * 0.8, t + len); }
      o.connect(g); g.connect(dst);
      const e = env(g, t, 0.008, 0.5, len * 0.4, len * 0.6); o.start(t); o.stop(e + 0.02);
      t += len + rand(0.03, 0.12);
    }
  }
  function cricket() {
    if (!ready() || !amb.night) return;
    const dst = out(rand(0.05, 0.1), rand(-0.8, 0.8));
    let t = ctx.currentTime + 0.01;
    const f = rand(4200, 5200);
    for (let k = 0; k < 3; k++) {
      const o = osc("sine", f, t), am = ctx.createGain(), l = osc("square", 32, t), lg = ctx.createGain();
      lg.gain.value = 0.5; am.gain.value = 0.5; l.connect(lg); lg.connect(am.gain);
      const g = ctx.createGain(); o.connect(am); am.connect(g); g.connect(dst);
      const e = env(g, t, 0.01, 0.4, 0.16, 0.04); o.start(t); o.stop(e + 0.02); l.start(t); l.stop(e + 0.02);
      t += 0.32;
    }
  }
  function startAmbience(night) {
    if (!init()) return;
    amb.night = !!night;
    if (amb.running) return;
    amb.running = true;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource(); n.buffer = brownBuf; n.loop = true;
    const lp = filt("lowpass", 420, 0.5), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16, t + 2.5);
    const l = osc("sine", 0.08, t), lg = ctx.createGain(); lg.gain.value = 0.08; l.connect(lg); lg.connect(g.gain);
    const l2 = osc("sine", 0.13, t), lg2 = ctx.createGain(); lg2.gain.value = 180; l2.connect(lg2); lg2.connect(lp.frequency);
    n.connect(lp); lp.connect(g); g.connect(master);
    n.start(t); l.start(t); l2.start(t);
    amb.nodes = [n, l, l2, g];
    const loopBirds = () => { chirp(); if (Math.random() < 0.35) setTimeout(chirp, 300 + Math.random() * 500); amb.timers[0] = setTimeout(loopBirds, rand(1500, 5000)); };
    const loopCrickets = () => { cricket(); amb.timers[1] = setTimeout(loopCrickets, rand(700, 1800)); };
    amb.timers[0] = setTimeout(loopBirds, 1200);
    amb.timers[1] = setTimeout(loopCrickets, 900);
  }
  function stopAmbience() {
    amb.timers.forEach(clearTimeout); amb.timers = [];
    if (ctx && amb.nodes.length) {
      const g = amb.nodes[3], t = ctx.currentTime;
      try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.6); } catch (e) { /* bo'sh */ }
      const nodes = amb.nodes;
      setTimeout(() => nodes.slice(0, 3).forEach((x) => { try { x.stop(); } catch (e) { /* bo'sh */ } }), 700);
    }
    amb.nodes = []; amb.running = false;
  }
  function setOn(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) { /* bo'sh */ }
    if (v) init();
    if (master) master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.05);
  }

  window.SofiFarmSound = {
    init, voice, fx, startAmbience, stopAmbience, setOn,
    setNight(v) { amb.night = !!v; },
    get on() { return on; }
  };
})();
