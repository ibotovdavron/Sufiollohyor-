/* SHASHKA DVIJOGI — rus shashkasi qoidalari (O‘zbekistonda keng tarqalgan):
   - 8×8 taxta, faqat qora kataklar; oqlar birinchi yuradi.
   - Oddiy dona oldinga diagonal yuradi, urishni esa oldinga ham, orqaga ham qiladi.
   - Urish majburiy; bir yurishda ketma-ket bir nechta dona urilishi mumkin.
   - Oxirgi qatorga yetgan dona “damka” bo‘ladi (urish davomida ham — va damka sifatida davom etadi).
   - Damka diagonal bo‘ylab istalgan masofaga yuradi va uradi.
   - Urilgan donalar yurish oxirida olinadi (“turk zarbasi”: bitta donani ikki marta urib bo‘lmaydi).
   - Yurish qolmagan tomon yutqazadi. Durang: 3 marta takrorlanish yoki 15 yurish davomida faqat damkalar yurib, urish bo‘lmasa.
   Interfeys shaxmat.js dagi chess.js ga o‘xshash: reset, turn, move, moves, board, history, get. */
(() => {
  "use strict";
  const FILES = "abcdefgh";
  const DIRS = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  const sqName = (f, r) => FILES[f] + (r + 1);
  const parse = (s) => [FILES.indexOf(s[0]), +s.slice(1) - 1];
  const inside = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8;

  function Draughts() {
    let B, turnC, cont, ghosts, hist, cur, quiet, reps;
    const at = (f, r) => (inside(f, r) ? B[r][f] : undefined);
    const isGhost = (f, r) => ghosts.some(([gf, gr]) => gf === f && gr === r);

    function reset() {
      B = Array.from({ length: 8 }, () => Array(8).fill(null));
      for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
        if ((f + r) % 2) continue; // a1 — qora katak
        if (r < 3) B[r][f] = { c: "w", k: false };
        else if (r > 4) B[r][f] = { c: "b", k: false };
      }
      turnC = "w"; cont = null; ghosts = []; hist = []; cur = null; quiet = 0; reps = new Map();
      reps.set(key(), 1);
    }
    function key() { return turnC + B.map((row) => row.map((p) => (p ? (p.k ? p.c.toUpperCase() : p.c) : ".")).join("")).join("/"); }

    // Bitta katakdan urishlar (damka uchun — davom ettirish qoidasi bilan)
    function capturesFrom(f, r, p) {
      const out = [];
      for (const [df, dr] of DIRS) {
        if (!p.k) {
          const o = at(f + df, r + dr), l = at(f + 2 * df, r + 2 * dr);
          if (o && o.c !== p.c && !isGhost(f + df, r + dr) && l === null) out.push({ to: [f + 2 * df, r + 2 * dr], over: [f + df, r + dr] });
        } else {
          let x = f + df, y = r + dr;
          while (at(x, y) === null) { x += df; y += dr; }
          const o = at(x, y);
          if (!o || o.c === p.c || isGhost(x, y)) continue;
          const over = [x, y];
          const lands = [];
          x += df; y += dr;
          while (at(x, y) === null) { lands.push([x, y]); x += df; y += dr; }
          // Damka keyingi urish mumkin bo'lgan katakka tushishi shart (agar shunday katak bo'lsa)
          const good = lands.filter(([lx, ly]) => {
            ghosts.push(over);
            const more = capturesFrom.raw(lx, ly, p, [df, dr]);
            ghosts.pop();
            return more;
          });
          (good.length ? good : lands).forEach((l) => out.push({ to: l, over }));
        }
      }
      return out;
    }
    // Damka berilgan katakdan (orqaga qaytmasdan) yana ura oladimi
    capturesFrom.raw = (f, r, p, from) => {
      for (const [df, dr] of DIRS) {
        if (df === -from[0] && dr === -from[1]) continue;
        let x = f + df, y = r + dr;
        while (at(x, y) === null) { x += df; y += dr; }
        const o = at(x, y);
        if (o && o.c !== p.c && !isGhost(x, y) && at(x + df, y + dr) === null) return true;
      }
      return false;
    };
    function quietFrom(f, r, p) {
      const out = [];
      for (const [df, dr] of DIRS) {
        if (!p.k) {
          if (dr !== (p.c === "w" ? 1 : -1)) continue;
          if (at(f + df, r + dr) === null) out.push({ to: [f + df, r + dr] });
        } else {
          let x = f + df, y = r + dr;
          while (at(x, y) === null) { out.push({ to: [x, y] }); x += df; y += dr; }
        }
      }
      return out;
    }
    // Hamma qonuniy qadamlar: [{from, to, captured, over}]
    function allSteps() {
      const caps = [], quiets = [];
      const add = (list, f, r, arr) => arr.forEach((m) => list.push({ from: sqName(f, r), to: sqName(m.to[0], m.to[1]), captured: !!m.over, over: m.over ? sqName(m.over[0], m.over[1]) : null }));
      if (cont) { const [f, r] = parse(cont); add(caps, f, r, capturesFrom(f, r, B[r][f])); return caps; }
      for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
        const p = B[r][f];
        if (!p || p.c !== turnC) continue;
        add(caps, f, r, capturesFrom(f, r, p));
        if (!caps.length) add(quiets, f, r, quietFrom(f, r, p));
      }
      return caps.length ? caps : quiets;
    }

    function move(m) {
      if (!m) return null;
      const from = m.from, to = m.to;
      const step = allSteps().find((s) => s.from === from && s.to === to);
      if (!step) return null;
      const [ff, fr] = parse(from), [tf, tr] = parse(to);
      const p = B[fr][ff];
      const wasKing = p.k;
      B[fr][ff] = null; B[tr][tf] = p;
      let promoted = false;
      if (!p.k && ((p.c === "w" && tr === 7) || (p.c === "b" && tr === 0))) { p.k = true; promoted = true; }
      if (!cur) cur = { c: turnC, path: [from], cap: false, king: wasKing };
      cur.path.push(to);
      const out = { from, to, color: p.c, captured: step.captured ? "x" : null, over: step.over, promotion: promoted ? "k" : null, more: false };
      if (step.captured) {
        cur.cap = true;
        ghosts.push(parse(step.over));
        cont = to;
        if (capturesFrom(tf, tr, p).length) { out.more = true; return out; }
      }
      // Yurish tugadi: urilgan donalarni olish, navbat almashadi
      ghosts.forEach(([gf, gr]) => { B[gr][gf] = null; });
      out.removed = ghosts.map(([gf, gr]) => sqName(gf, gr));
      ghosts = []; cont = null;
      hist.push({ c: cur.c, text: cur.path.join(cur.cap ? ":" : "-") });
      quiet = cur.cap || !cur.king ? 0 : quiet + 1;
      cur = null;
      turnC = turnC === "w" ? "b" : "w";
      const k = key(); reps.set(k, (reps.get(k) || 0) + 1);
      return out;
    }

    function counts() {
      const n = { w: 0, b: 0, wk: 0, bk: 0 };
      B.forEach((row) => row.forEach((p) => { if (p) { n[p.c]++; if (p.k) n[p.c + "k"]++; } }));
      return n;
    }

    reset();
    return {
      reset,
      turn: () => turnC,
      move,
      moves: ({ square } = {}) => allSteps().filter((s) => !square || s.from === square),
      get: (sq) => { const [f, r] = parse(sq); const p = at(f, r); return p ? { color: p.c, king: p.k } : null; },
      // board()[i][j]: i=0 — 8-qator (shaxmatdagidek)
      board: () => B.slice().reverse().map((row) => row.map((p) => (p ? { color: p.c, king: p.k } : null))),
      continuing: () => cont,
      pendingCaptures: () => ghosts.map(([f, r]) => sqName(f, r)),
      history: () => hist.map((h) => h.text),
      counts,
      gameOver: () => !cont && allSteps().length === 0,
      repetition: () => (reps.get(key()) || 0) >= 3,
      kingsOnlyDraw: () => quiet >= 30,
      mustCapture: () => allSteps().some((s) => s.captured),
      pgn: () => hist.map((h, i) => (i % 2 === 0 ? `${i / 2 + 1}. ` : "") + h.text).join(" ")
    };
  }
  window.SofiDraughts = Draughts;
})();
