/* SHASHKA — 2D taxta (DOM). Interfeys SofiBoard3D ga o'xshash:
   new SofiBoard2D(container, { orientation, onSquare })
   setPosition(board) · playMove(mv, boardAfter) · setMarks({ last, sel, moves, must, ghosts })
   setOrientation(c) · flip() · destroy()                                                    */
(() => {
  "use strict";
  const FILES = "abcdefgh";
  const CROWN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18l-1.6-9.5-4.6 4.2L12 5l-2.8 7.7-4.6-4.2z" fill="currentColor"/><rect x="3.5" y="19" width="17" height="2.2" rx="1" fill="currentColor"/></svg>`;

  function Board2D(container, opts = {}) {
    const onSquare = opts.onSquare || (() => {});
    let orient = opts.orientation || "w";
    const wrap = document.createElement("div");
    wrap.className = "sh-wrap";
    wrap.innerHTML = `<div class="sh-frame"><div class="sh-board"><div class="sh-cells"></div><div class="sh-marks"></div><div class="sh-pieces"></div></div><div class="sh-coords f"></div><div class="sh-coords r"></div></div>`;
    container.appendChild(wrap);
    const frame = wrap.querySelector(".sh-frame"), boardEl = wrap.querySelector(".sh-board");
    const cells = wrap.querySelector(".sh-cells"), marksEl = wrap.querySelector(".sh-marks"), piecesEl = wrap.querySelector(".sh-pieces");
    const pieces = new Map(); // katak -> element
    let lastBoard = null, lastMarks = {};

    for (let i = 0; i < 64; i++) { const c = document.createElement("i"); cells.appendChild(c); }
    const xy = (sq) => {
      const f = FILES.indexOf(sq[0]), r = +sq.slice(1) - 1;
      return orient === "w" ? [f, 7 - r] : [7 - f, r];
    };
    const place = (el, sq) => { const [x, y] = xy(sq); el.style.transform = `translate(${x * 100}%, ${y * 100}%)`; };
    function drawGrid() {
      [...cells.children].forEach((c, i) => {
        const x = i % 8, y = (i / 8) | 0;
        const f = orient === "w" ? x : 7 - x, r = orient === "w" ? 7 - y : y;
        c.className = (f + r) % 2 ? "l" : "d";
      });
      const fs = orient === "w" ? FILES.split("") : FILES.split("").reverse();
      const rs = orient === "w" ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
      wrap.querySelector(".sh-coords.f").innerHTML = fs.map((f) => `<span>${f}</span>`).join("");
      wrap.querySelector(".sh-coords.r").innerHTML = rs.map((r) => `<span>${r}</span>`).join("");
    }
    function makePiece(p) {
      const el = document.createElement("div");
      el.className = `sh-pc ${p.color}${p.king ? " king" : ""}`;
      el.innerHTML = `<span class="disc"><span class="crown">${CROWN}</span></span>`;
      return el;
    }
    function setPosition(board) {
      lastBoard = board;
      const want = new Map();
      board.forEach((row, i) => row.forEach((p, j) => { if (p) want.set(FILES[j] + (8 - i), p); }));
      for (const [sq, el] of pieces) {
        const p = want.get(sq);
        if (!p || !el.classList.contains(p.color)) { el.remove(); pieces.delete(sq); }
      }
      for (const [sq, p] of want) {
        let el = pieces.get(sq);
        if (!el) { el = makePiece(p); piecesEl.appendChild(el); pieces.set(sq, el); }
        el.classList.toggle("king", !!p.king);
        el.classList.remove("ghost");
        place(el, sq);
      }
    }
    function playMove(mv, boardAfter) {
      const el = pieces.get(mv.from);
      if (el) {
        pieces.delete(mv.from);
        const old = pieces.get(mv.to); if (old && old !== el) old.remove();
        pieces.set(mv.to, el);
        el.classList.add("moving");
        place(el, mv.to);
        setTimeout(() => el.classList.remove("moving"), 260);
        if (mv.promotion) setTimeout(() => { el.classList.add("king", "promo"); setTimeout(() => el.classList.remove("promo"), 700); }, 220);
      }
      (mv.removed || []).forEach((sq) => {
        const c = pieces.get(sq);
        if (c) { pieces.delete(sq); c.classList.add("gone"); setTimeout(() => c.remove(), 380); }
      });
      setTimeout(() => { if (boardAfter) setPosition(boardAfter); }, 300);
    }
    function setMarks(m = {}) {
      lastMarks = m;
      const parts = [];
      const add = (sq, cls) => { const [x, y] = xy(sq); parts.push(`<i class="${cls}" style="transform:translate(${x * 100}%,${y * 100}%)"></i>`); };
      (m.last || []).forEach((sq) => add(sq, "last"));
      (m.must || []).forEach((sq) => add(sq, "must"));
      if (m.sel) add(m.sel, "sel");
      (m.moves || []).forEach((x) => add(x.to, x.capture ? "cap" : "dot"));
      marksEl.innerHTML = parts.join("");
      const gh = new Set(m.ghosts || []);
      pieces.forEach((el, sq) => el.classList.toggle("ghost", gh.has(sq)));
    }
    function setOrientation(c) {
      orient = c === "b" ? "b" : "w";
      drawGrid();
      pieces.forEach((el, sq) => place(el, sq));
      setMarks(lastMarks);
    }
    // Bosish
    boardEl.addEventListener("pointerdown", (e) => {
      const r = boardEl.getBoundingClientRect();
      const x = Math.floor(((e.clientX - r.left) / r.width) * 8), y = Math.floor(((e.clientY - r.top) / r.height) * 8);
      if (x < 0 || x > 7 || y < 0 || y > 7) return;
      const f = orient === "w" ? x : 7 - x, rk = orient === "w" ? 7 - y : y;
      onSquare(FILES[f] + (rk + 1));
    });
    // O'lchamni moslash: kvadrat taxta
    function fit() {
      const w = container.clientWidth, h = container.clientHeight;
      const s = Math.max(200, Math.min(w, h) - 16);
      frame.style.width = frame.style.height = s + "px";
    }
    const ro = new ResizeObserver(fit); ro.observe(container); fit();
    drawGrid();

    this.setPosition = setPosition;
    this.playMove = playMove;
    this.setMarks = setMarks;
    this.setOrientation = setOrientation;
    this.flip = () => setOrientation(orient === "w" ? "b" : "w");
    this.destroy = () => { ro.disconnect(); wrap.remove(); };
  }
  window.SofiBoard2D = Board2D;
})();
