/* Do'kon sahifasi: “sahifa quriladi” animatsiyasi — ko'k chizma, uchqunlar, o'lchov chiziqlari,
   kulrang bloklar o'z joyiga tushib, haqiqiy kartalarga aylanadi. Sessiyada bir marta; bosilsa — o'tkazib yuboriladi. */
(() => {
  "use strict";
  const KEY = "sofi_shop_build";
  const force = /[?&]build=1/.test(location.search);
  let seen = false; try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  if (seen && !force) return;
  try { sessionStorage.setItem(KEY, "1"); } catch (e) {}

  const css = document.createElement("style");
  css.textContent = `
  body.sb-on { overflow: hidden; }
  body.sb-on > main, body.sb-on > header, body.sb-on > footer, body.sb-on > .bottom-nav { position: relative; z-index: 2; }
  body.sb-on .sb-t { opacity: 0; }
  .sb-t.sb-in { opacity: 1 !important; animation: sbIn .55s cubic-bezier(.2,.9,.3,1) both; }
  @keyframes sbIn { 0% { opacity: 0; filter: saturate(0) brightness(1.6) blur(3px); clip-path: inset(0 100% 0 0); } 60% { opacity: 1; filter: saturate(.4) brightness(1.2); } 100% { opacity: 1; filter: none; clip-path: inset(0 0 0 0); } }
  .sb-bg { position: fixed; inset: 0; z-index: 1; pointer-events: none; transition: opacity .7s ease;
    background-color: #0b3c99;
    background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
      radial-gradient(circle at 50% 40%, #1452c4, #082c74 75%);
    background-size: 80px 80px, 80px 80px, 16px 16px, 16px 16px, 100% 100%; }
  .sb-fx { position: fixed; inset: 0; z-index: 5; pointer-events: none; overflow: hidden; transition: opacity .5s ease; font: 700 10px/1 ui-monospace, Menlo, monospace; }
  .sb-p { position: absolute; width: 4px; height: 4px; margin: -2px; border-radius: 50%; background: #fff; box-shadow: 0 0 8px 2px rgba(160,210,255,.9); }
  .sb-p.r { background: #ff8a8a; box-shadow: 0 0 8px 2px rgba(255,120,120,.8); }
  .sb-gh { position: absolute; left: 0; top: 0; background: rgba(205,214,230,.35); border: 1.5px solid #7fb2ff; box-shadow: 0 0 0 1px rgba(255,255,255,.15) inset;
    transition: transform .65s cubic-bezier(.2,.9,.25,1.05), opacity .35s ease, background .35s; }
  .sb-gh::before, .sb-gh::after { content: ""; position: absolute; width: 7px; height: 7px; background: #fff; border: 1.5px solid #3d8bff; }
  .sb-gh::before { left: -4px; top: -4px; } .sb-gh::after { right: -4px; bottom: -4px; }
  .sb-gh i { position: absolute; width: 7px; height: 7px; background: #fff; border: 1.5px solid #3d8bff; } .sb-gh i.a { right: -4px; top: -4px; } .sb-gh i.b { left: -4px; bottom: -4px; }
  .sb-gh b { position: absolute; left: 50%; bottom: -17px; transform: translateX(-50%); padding: 2px 5px; border-radius: 3px; background: #2f7bff; color: #fff; white-space: nowrap; }
  .sb-gh.done { background: rgba(255,255,255,0); border-color: rgba(127,178,255,.35); }
  .sb-gh.gone { opacity: 0; }
  .sb-lh, .sb-lv { position: absolute; background: #ff5a5a; opacity: .85; transition: transform .45s ease, opacity .5s ease; }
  .sb-lh { left: 0; right: 0; height: 1px; transform: scaleX(0); transform-origin: left; } .sb-lv { top: 0; bottom: 0; width: 1px; transform: scaleY(0); transform-origin: top; }
  .sb-lh.b, .sb-lv.b { background: #8ec5ff; }
  .sb-lh.on { transform: scaleX(1); } .sb-lv.on { transform: scaleY(1); } .sb-lh.off, .sb-lv.off { opacity: 0; }
  .sb-skip { position: fixed; z-index: 6; right: 14px; bottom: 90px; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,.35); background: rgba(8,30,80,.6); color: #fff; font: 700 13px Inter, system-ui, sans-serif; cursor: pointer; }
  .sb-tag { position: fixed; z-index: 6; left: 50%; top: 18%; transform: translateX(-50%); color: #cfe3ff; font: 800 13px/1.2 ui-monospace, Menlo, monospace; letter-spacing: .2em; text-shadow: 0 0 10px #3d8bff; transition: opacity .4s; }`;
  document.head.append(css);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = (a, b) => a + Math.random() * (b - a);

  async function run() {
    // shop.js kartalarni chizib bo'lishini kutamiz
    for (let i = 0; i < 40 && !document.querySelector("#shopGrid .sh-card"); i++) await wait(50);
    const W = innerWidth, H = innerHeight;
    const pick = (sel) => [...document.querySelectorAll(sel)].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 10 && r.height > 6 && r.bottom > 0 && r.top < H; });
    const groups = [pick(".sh-hero"), pick(".sh-search, #sortSelect"), pick("#cats .sh-chip").slice(0, 10), pick("#shopGrid .sh-card")];
    const all = [...new Set(groups.flat())];
    const others = [...document.querySelectorAll("main > *, .bottom-nav")].filter((el) => !all.some((t) => t === el || el.contains(t)));
    [...all, ...others].forEach((el) => el.classList.add("sb-t"));
    document.body.classList.add("sb-on");

    const bg = document.createElement("div"); bg.className = "sb-bg"; document.body.append(bg);
    const fx = document.createElement("div"); fx.className = "sb-fx"; document.body.append(fx);
    const tag = document.createElement("div"); tag.className = "sb-tag"; tag.textContent = "BUILDING · SO‘FI SHOP"; document.body.append(tag);
    const skip = document.createElement("button"); skip.className = "sb-skip"; skip.type = "button"; skip.textContent = "O‘tkazib yuborish ⏭"; document.body.append(skip);
    let stop = false;
    const finish = () => {
      if (finish.done) return; finish.done = true; stop = true;
      [...all, ...others].forEach((el) => el.classList.add("sb-in"));
      bg.style.opacity = "0"; fx.style.opacity = "0"; tag.style.opacity = "0"; skip.remove();
      setTimeout(() => { bg.remove(); fx.remove(); tag.remove(); document.body.classList.remove("sb-on"); [...all, ...others].forEach((el) => el.classList.remove("sb-t", "sb-in")); }, 800);
    };
    skip.onclick = finish; bg.addEventListener("click", finish);
    document.addEventListener("keydown", finish, { once: true });

    // 1) uchqunlar to'dasi markazga uchib keladi
    const parts = [];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("i"); p.className = "sb-p" + (i % 5 === 0 ? " r" : "");
      p.style.left = rnd(0, W) + "px"; p.style.top = rnd(0, H) + "px"; p.style.transition = `transform ${rnd(0.7, 1.1)}s cubic-bezier(.3,.8,.3,1), opacity .5s`;
      fx.append(p); parts.push(p);
    }
    await wait(30);
    parts.forEach((p) => { const x = parseFloat(p.style.left), y = parseFloat(p.style.top); p.style.transform = `translate(${W / 2 + rnd(-90, 90) - x}px, ${H * 0.42 + rnd(-60, 60) - y}px)`; });
    await wait(650); if (stop) return;

    // 2) to'r va bloklar: har bir guruh — o'lchov chiziqlari, uchib keladigan kulrang blok, keyin haqiqiy element
    const line = (cls, pos, key) => { const l = document.createElement("i"); l.className = cls; l.style[key] = pos + "px"; fx.append(l); requestAnimationFrame(() => l.classList.add("on")); return l; };
    const lines = [];
    let k = 0;
    for (const g of groups) {
      for (const el of g) {
        if (stop) return;
        const r = el.getBoundingClientRect();
        if (k < 14) lines.push(line("sb-lh" + (k % 2 ? " b" : ""), r.top, "top"), line("sb-lv" + (k % 2 ? "" : " b"), r.left, "left"));
        const gh = document.createElement("div"); gh.className = "sb-gh";
        gh.innerHTML = `<i class="a"></i><i class="b"></i><b>${Math.round(r.width)} × ${Math.round(r.height)}</b>`;
        gh.style.width = r.width + "px"; gh.style.height = r.height + "px";
        const p = parts[k % parts.length];
        const pr = p.getBoundingClientRect();
        gh.style.transform = `translate(${pr.left - r.width / 2}px, ${pr.top - r.height / 2}px) scale(.15) rotate(${rnd(-14, 14)}deg)`;
        fx.append(gh);
        p.style.opacity = "0";
        requestAnimationFrame(() => requestAnimationFrame(() => { gh.style.transform = `translate(${r.left}px, ${r.top}px)`; }));
        const delay = el.classList.contains("sh-card") ? 520 : 420;
        setTimeout(() => { if (stop) return; el.classList.add("sb-in"); gh.classList.add("done"); setTimeout(() => gh.classList.add("gone"), 420); setTimeout(() => gh.remove(), 900); }, delay);
        await wait(el.classList.contains("sh-chip") ? 45 : 140);
        k++;
      }
      await wait(160);
    }
    await wait(650);
    lines.forEach((l) => l.classList.add("off"));
    parts.forEach((p) => (p.style.opacity = "0"));
    await wait(250);
    finish();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(run, 60)); else setTimeout(run, 60);
})();
