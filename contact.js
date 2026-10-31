/* Aloqa sahifasi: dars kunlari, yozilish xabari va savol-javoblar. */
(() => {
  "use strict";

  const D = window.CENTER_DATA || {};
  const C = D.courses || [];
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Dars kunlari (kurslardan)
  const WEEK = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];
  const lessons = C.flatMap((c) => (c.lessons || []).map((l) => ({ ...l, name: c.name })));
  const days = WEEK.filter((d) => lessons.some((l) => l.day === d));
  $("#ctDays").innerHTML = days.map((d) => `
    <div class="ct-day"><b>${esc(d)}</b><span>${lessons.filter((l) => l.day === d).map((l) => `<i>${esc(l.from)}–${esc(l.to)} · ${esc(l.name)}</i>`).join("")}</span></div>`).join("") ||
    `<p class="ct-muted">Jadval tez orada e’lon qilinadi.</p>`;

  // Savol-javoblar (saytdagi ma'lumotlardan)
  const subjects = (D.subjects || []).map((s) => s.name).join(", ");
  const times = days.map((d) => `${d}: ${lessons.filter((l) => l.day === d).map((l) => `${l.name} ${l.from}–${l.to}`).join(", ")}`).join("; ");
  const prices = C.filter((c) => c.price).map((c) => `${c.name} — oyiga ${String(c.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so‘m`).join(", ");
  const faq = [
    ["Qaysi sinf o‘quvchilari qabul qilinadi?", "Matematika va Ona tili — 5–11-sinf o‘quvchilari, Mental arifmetika — 5–7-sinf o‘quvchilari uchun."],
    ["Qaysi fanlardan dars o‘tiladi?", `${subjects}.`],
    ["Darslar qachon bo‘ladi?", `${times}.`],
    ["Markaz qayerda joylashgan?", `${D.address || "Oltinsoy tumani, 68-maktab binosi"}.`],
    ["Yulduzlar nima uchun beriladi?", "Uy vazifasi, darsdagi faollik, testlar, musobaqalar va bilim o‘yinlari uchun. Yulduzlar reytingda ko‘rinadi va do‘konda sovg‘aga almashtiriladi."],
    ["Kurslar narxi qancha?", `${prices}. Batafsil “Kurslar” bo‘limida.`]
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
