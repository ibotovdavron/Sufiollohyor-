/* Aloqa sahifasi: dars kunlari, yozilish xabari va savol-javoblar. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const S = D.schedule || { days: [], slots: [] };
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Dars kunlari
  const slots = S.slots.slice().sort((a, b) => a.time.localeCompare(b.time));
  $("#ctDays").innerHTML = S.days.map((d) => `
    <div class="ct-day"><b>${esc(d)}</b><span>${slots.map((s) => `<i>${esc(s.time)} · ${esc(s.cls)}</i>`).join("")}</span></div>`).join("") ||
    `<p class="ct-muted">Jadval tez orada e’lon qilinadi.</p>`;

  // Savol-javoblar (saytdagi ma'lumotlardan)
  const subjects = (D.subjects || []).map((s) => s.name).join(", ");
  const times = slots.map((s) => `${s.cls} — ${s.time}`).join(", ");
  const faq = [
    ["Qaysi sinf o‘quvchilari qabul qilinadi?", "Hozir 5, 6 va 8-sinf o‘quvchilari uchun guruhlar bor. Boshqa sinflar bo‘yicha qo‘ng‘iroq qilib aniqlang."],
    ["Qaysi fanlardan dars o‘tiladi?", `${subjects}.`],
    ["Darslar qachon bo‘ladi?", `${S.days.join(" va ")} kunlari: ${times}.`],
    ["Markaz qayerda joylashgan?", `${D.address || "Oltinsoy tumani, 68-maktab binosi"}.`],
    ["Yulduzlar nima uchun beriladi?", "Uy vazifasi, darsdagi faollik, testlar, musobaqalar va bilim o‘yinlari uchun. Yulduzlar reytingda ko‘rinadi va do‘konda sovg‘aga almashtiriladi."],
    ["Narxlar va to‘lov haqida qayerdan bilaman?", "Narx va to‘lov tartibi bo‘yicha telefon yoki Telegram orqali murojaat qiling — batafsil tushuntirib beramiz."]
  ];
  $("#ctFaq").innerHTML = faq.map(([q, a], i) => `
    <details class="ct-q" ${i === 0 ? "open" : ""}><summary>${esc(q)}<span>+</span></summary><p>${esc(a)}</p></details>`).join("");

  // Yozilish xabari
  const form = $("#ctForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const parent = String(f.get("parent") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    const err = $("#ctErr");
    if (!parent || phone.replace(/\D/g, "").length < 9) {
      err.textContent = "Iltimos, ismingiz va telefon raqamingizni to‘liq yozing.";
      return;
    }
    err.textContent = "";
    const subj = f.getAll("subj").join(", ") || "—";
    const text = `Assalomu alaykum! Farzandimni o‘quv markazingizga yozdirmoqchiman.\n` +
      `👤 Ota-ona: ${parent}\n📞 Telefon: ${phone}\n` +
      `🧒 Farzand: ${String(f.get("child") || "").trim() || "—"} (${f.get("cls")})\n📚 Fan: ${subj}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(location.origin + "/")}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
})();
