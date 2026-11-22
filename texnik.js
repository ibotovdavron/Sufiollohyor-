/* Vaqtincha texnik ishlar xabari (Reyting va Do'kon).
   O'chirish uchun: ON = false qiling (yoki sahifadan shu skriptni olib tashlang). */
(() => {
  "use strict";
  const ON = true;
  if (!ON) return;
  const main = document.querySelector("main");
  if (!main) return;
  const page = /shop/.test(location.pathname) ? "Do‘kon" : "Reyting";
  const css = document.createElement("style");
  css.textContent = `
  .tx-wrap { min-height: 60vh; display: grid; place-items: center; padding: 30px 16px; }
  .tx-card { width: min(560px, 100%); text-align: center; padding: 28px 22px; border-radius: 24px; border: 1px solid rgba(250, 204, 21, .45);
    background: radial-gradient(circle at 85% 10%, rgba(250, 204, 21, .16), transparent 45%), linear-gradient(135deg, rgba(239, 68, 68, .12), rgba(2, 11, 9, .55)); box-shadow: 0 16px 40px rgba(0, 0, 0, .3); }
  .tx-ic { font-size: 64px; line-height: 1; animation: txSpin 4s linear infinite; display: inline-block; }
  @keyframes txSpin { to { transform: rotate(360deg); } }
  .tx-card h1 { margin: 12px 0 8px; font-size: clamp(22px, 5vw, 30px); }
  .tx-card p { margin: 6px 0; opacity: .88; line-height: 1.55; }
  .tx-code { display: inline-block; margin-top: 12px; padding: 6px 12px; border-radius: 999px; background: rgba(239, 68, 68, .18); color: #fca5a5; font: 800 13px ui-monospace, Menlo, monospace; letter-spacing: .04em; }
  .tx-card a { display: inline-block; margin-top: 16px; }
  @media (prefers-reduced-motion: reduce) { .tx-ic { animation: none; } }`;
  document.head.append(css);
  const box = document.createElement("main");
  box.className = "wrap";
  box.innerHTML = `
    <section class="tx-wrap" role="alert">
      <div class="tx-card">
        <span class="tx-ic" aria-hidden="true">⚙️</span>
        <h1>${page} vaqtincha ishlamayapti</h1>
        <p>SQL bazada texnik ishlar olib borilmoqda. Yulduzlaringiz saqlanib qoladi — hech narsa yo‘qolmaydi.</p>
        <p>Tez orada qayta ishga tushadi. Noqulaylik uchun uzr so‘raymiz!</p>
        <span class="tx-code">Xato kodi: 144</span><br>
        <a class="btn" href="index.html">← Bosh sahifaga qaytish</a>
      </div>
    </section>`;
  // Asl sahifa skriptlari xatosiz ishlashi uchun asosiy qismni o'chirmaymiz — faqat yashiramiz
  main.hidden = true;
  main.style.display = "none";
  main.before(box);
  window.SOFI_TEXNIK = true;
})();
