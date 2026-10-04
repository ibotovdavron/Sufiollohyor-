const WHATSAPP = "998990616472";
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// --- Glass UI sound engine: no external audio files required ---
let soundOn = localStorage.getItem("sofiSound") !== "off";
let audioCtx;
function initAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === "suspended") audioCtx.resume();
}
function tone(freq=520, duration=.07, type="sine", volume=.028, slide=0){
  if(!soundOn) return;
  try{
    initAudio();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,audioCtx.currentTime);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(80,freq+slide),audioCtx.currentTime+duration);
    g.gain.setValueAtTime(.0001,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(volume,audioCtx.currentTime+.008);
    g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
    o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+duration+.02);
  }catch(e){}
}
function clickSound(){tone(640,.055,"sine",.022,120)}
function hoverSound(){tone(880,.035,"triangle",.009,-100)}
function successSound(){tone(520,.08,"sine",.025,180);setTimeout(()=>tone(780,.11,"sine",.022,160),70)}

function updateSoundButton(){
  const b=$("#soundToggle"); if(!b) return;
  b.textContent=soundOn?"🔊":"🔇";
  b.title=soundOn?"Ovoz effektlari: yoqilgan":"Ovoz effektlari: o‘chirilgan";
}
updateSoundButton();
$("#soundToggle")?.addEventListener("click",()=>{
  soundOn=!soundOn; localStorage.setItem("sofiSound",soundOn?"on":"off");
  if(soundOn){successSound(); const n=$("#soundNote"); n.classList.add("show"); setTimeout(()=>n.classList.remove("show"),1800)}
  updateSoundButton();
});

document.addEventListener("pointerover",e=>{ if(e.target.closest("a,button,.course-card,.contact-link")) hoverSound(); });
document.addEventListener("click",e=>{ if(e.target.closest("a,button,.course-card,.contact-link")) clickSound(); });

function openModal(id){const el=$(id);if(!el)return;el.classList.add("show");el.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");tone(420,.08,"sine",.016,80)}
function closeModals(){$$(".modal").forEach(m=>{m.classList.remove("show");m.setAttribute("aria-hidden","true")});document.body.classList.remove("modal-open")}
$$("[data-open-apply]").forEach(b=>b.addEventListener("click",()=>openModal("#applyModal")));
$$('[data-open-question]').forEach(b=>b.addEventListener("click",()=>openModal("#questionModal")));
$$('[data-close]').forEach(b=>b.addEventListener("click",closeModals));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModals()});

$("#menuBtn")?.addEventListener("click",()=>$("#mobileMenu").classList.toggle("show"));
$$('.mobile-menu a').forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("show")));

function whatsapp(message){
  const url=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener,noreferrer");
  successSound(); const toast=$("#toast"); toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),2500);
}
$("#applyForm")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);whatsapp(`Assalomu alaykum! SO‘FI OLLOHYOR O‘QUV MARKAZIGA ARIZA.\n\nIsm: ${f.get("name")}\nTelefon: ${f.get("phone")}\nYo‘nalish: ${f.get("course")}\n\nIltimos, bog‘laning.`);e.currentTarget.reset();closeModals()});
$("#questionForm")?.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);whatsapp(`Assalomu alaykum! SO‘FI OLLOHYOR O‘QUV MARKAZIGA SAVOL.\n\nIsm: ${f.get("name")}\nTelefon: ${f.get("phone")}\nSavol: ${f.get("question")}`);e.currentTarget.reset();closeModals()});
$$('[data-course]').forEach(btn=>btn.addEventListener("click",()=>{openModal("#applyModal");const select=$('#applyForm select[name="course"]');if(select)select.value=btn.dataset.course}));
$$('.faq-item button').forEach(btn=>btn.addEventListener("click",()=>{const item=btn.closest('.faq-item');$$('.faq-item').forEach(x=>{if(x!==item)x.classList.remove('active')});item.classList.toggle('active')}));

// Scroll reveal
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Floating particles
const pc=$("#particles");
for(let i=0;i<28;i++){
  const p=document.createElement('span');p.className='particle';p.style.left=(Math.random()*100)+'%';p.style.bottom=(-10-Math.random()*30)+'vh';p.style.animationDuration=(9+Math.random()*13)+'s';p.style.animationDelay=(-Math.random()*18)+'s';p.style.opacity=(.2+Math.random()*.55);pc.appendChild(p);
}

// Mouse light follows pointer on desktop
const glow=$("#cursorGlow");
window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='.9'}});

$("#year").textContent=new Date().getFullYear();
