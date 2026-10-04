const WHATSAPP = "998990616472";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function openModal(id){
  const el = $(id);
  if(!el) return;
  el.classList.add("show");
  el.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeModals(){
  $$(".modal").forEach(m => { m.classList.remove("show"); m.setAttribute("aria-hidden","true"); });
  document.body.classList.remove("modal-open");
}
$$("[data-open-apply]").forEach(b => b.addEventListener("click", () => openModal("#applyModal")));
$$("[data-open-question]").forEach(b => b.addEventListener("click", () => openModal("#questionModal")));
$$("[data-close]").forEach(b => b.addEventListener("click", closeModals));
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModals(); });

$("#menuBtn")?.addEventListener("click", () => $("#mobileMenu").classList.toggle("show"));
$$(".mobile-menu a").forEach(a => a.addEventListener("click", () => $("#mobileMenu").classList.remove("show")));

function whatsapp(message){
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  const toast = $("#toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

$("#applyForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const msg = `Assalomu alaykum! SO‘FI OLLOHYOR O‘QUV MARKAZIGA ARIZA.\n\nIsm: ${f.get("name")}\nTelefon: ${f.get("phone")}\nYo‘nalish: ${f.get("course")}\n\nIltimos, bog‘laning.`;
  whatsapp(msg);
  e.currentTarget.reset();
  closeModals();
});

$("#questionForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const msg = `Assalomu alaykum! SO‘FI OLLOHYOR O‘QUV MARKAZIGA SAVOL.\n\nIsm: ${f.get("name")}\nTelefon: ${f.get("phone")}\nSavol: ${f.get("question")}`;
  whatsapp(msg);
  e.currentTarget.reset();
  closeModals();
});

$$("[data-course]").forEach(btn => btn.addEventListener("click", () => {
  openModal("#applyModal");
  const select = $('#applyForm select[name="course"]');
  if(select) select.value = btn.dataset.course;
}));

$$(".faq-item button").forEach(btn => btn.addEventListener("click", () => {
  const item = btn.closest(".faq-item");
  $$(".faq-item").forEach(x => { if(x !== item) x.classList.remove("active"); });
  item.classList.toggle("active");
}));

$("#year").textContent = new Date().getFullYear();
