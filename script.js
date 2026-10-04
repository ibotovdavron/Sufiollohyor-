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

document.addEventListener("pointerover",e=>{ if(e.pointerType !== "touch" && e.target.closest("a,button,.course-card,.contact-link")) hoverSound(); });
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

const yearEl=$("#year"); if(yearEl) yearEl.textContent=new Date().getFullYear();


// ===== Course details: schedule + student ranking =====
const COURSE_KEY = "sofiAdminDataV1";
const fallbackCourses = [
  {id:"math",name:"Matematika",icon:"📐",description:"Mantiq, algebra, geometriya va testlarga tayyorgarlik."},
  {id:"english",name:"Ingliz tili",icon:"🇬🇧",description:"Grammar, speaking, vocabulary va imtihon tayyorgarligi."},
  {id:"physics",name:"Fizika",icon:"⚛️",description:"Nazariya va masalalarni amaliy usulda o‘rganish."},
  {id:"biology",name:"Biologiya",icon:"🌿",description:"Biologik jarayonlar va imtihon savollari."},
  {id:"chemistry",name:"Kimyo",icon:"🧪",description:"Kimyoviy reaksiyalar, formulalar va amaliy mashqlar."},
  {id:"it",name:"IT",icon:"💻",description:"Kompyuter savodxonligi va zamonaviy texnologiyalar."},
  {id:"programming",name:"Dasturlash",icon:"</>",description:"Web, dasturlash asoslari va loyihalar."}
];
const fallbackStudents = [
  {name:"Muhammadali Xasanov",course:"math",score:98},
  {name:"Aziza Karimova",course:"math",score:95},
  {name:"Sardorbek Aliyev",course:"math",score:91},
  {name:"Malika Sobirova",course:"english",score:97},
  {name:"Abdulloh Ergashev",course:"english",score:93},
  {name:"Zuhra Tursunova",course:"physics",score:96}
];
const fallbackSchedules = [
  {course:"math",day:"Dushanba",time:"15:00–16:30",room:"1-xona"},
  {course:"math",day:"Chorshanba",time:"15:00–16:30",room:"1-xona"},
  {course:"english",day:"Seshanba",time:"14:00–15:30",room:"2-xona"},
  {course:"english",day:"Payshanba",time:"14:00–15:30",room:"2-xona"},
  {course:"physics",day:"Juma",time:"16:00–17:30",room:"3-xona"}
];
function getSchoolData(){
  try{
    const d=JSON.parse(localStorage.getItem(COURSE_KEY));
    if(d && d.courses && d.students && d.schedules) return d;
  }catch(e){}
  return {courses:fallbackCourses,students:fallbackStudents,schedules:fallbackSchedules};
}
function openCourseDetails(courseId){
  const d=getSchoolData();
  const c=d.courses.find(x=>x.id===courseId) || fallbackCourses.find(x=>x.id===courseId);
  if(!c) return;
  const schedules=d.schedules.filter(x=>x.course===courseId);
  const students=d.students.filter(x=>x.course===courseId).sort((a,b)=>Number(b.score)-Number(a.score));
  $("#courseIcon").textContent=c.icon||"📚";
  $("#courseTitle").textContent=c.name;
  $("#courseLabel").textContent="SO‘FI OLLOHYOR • "+(schedules.length?"DARS VA REYTING":"YO‘NALISH");
  $("#courseDesc").textContent=c.description||"Fan haqida ma’lumot.";
  $("#courseSchedule").innerHTML=schedules.length?schedules.map((x,i)=>`<div class="schedule-row"><span class="day-dot">${i+1}</span><div><strong>${x.day}</strong><small>${x.time}${x.room?" • "+x.room:""}</small></div></div>`).join(""):'<div class="empty-detail">Hozircha jadval kiritilmagan.</div>';
  $("#courseRanking").innerHTML=students.length?students.slice(0,10).map((s,i)=>`<div class="rank-row"><span class="rank-num">${i+1}</span><div class="rank-name"><strong>${s.name}</strong><small>${s.score}/100 ball</small></div><b>${s.score}%</b></div>`).join(""):'<div class="empty-detail">Hozircha reyting ma’lumotlari yo‘q.</div>';
  $("#courseApplyBtn").onclick=()=>{closeModals();openModal("#applyModal");const sel=$('#applyForm select[name="course"]');if(sel){const option=[...sel.options].find(o=>o.textContent.toLowerCase().includes(c.name.toLowerCase()));if(option)sel.value=option.value;}};
  openModal("#courseModal");
}
$$("[data-course]").forEach(btn=>btn.addEventListener("click",()=>{
  const raw=(btn.dataset.course||"").toLowerCase();
  const map={"matematika":"math","ingliz tili":"english","fizika":"physics","biologiya":"biology","kimyo":"chemistry","it":"it","dasturlash":"programming"};
  openCourseDetails(map[raw]||raw);
}));


// ===== Soft water / glass UI sounds =====
let audioCtx;
function audioReady(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
}
function waterSound(){
  try{
    audioReady();
    const now=audioCtx.currentTime;
    const gain=audioCtx.createGain();
    const osc=audioCtx.createOscillator();
    const filter=audioCtx.createBiquadFilter();
    osc.type="sine";
    osc.frequency.setValueAtTime(420,now);
    osc.frequency.exponentialRampToValueAtTime(1150,now+.11);
    osc.frequency.exponentialRampToValueAtTime(560,now+.34);
    filter.type="lowpass"; filter.frequency.value=1800;
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.exponentialRampToValueAtTime(.08,now+.025);
    gain.gain.exponentialRampToValueAtTime(.0001,now+.38);
    osc.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);
    osc.start(now);osc.stop(now+.4);
  }catch(e){}
}
function speakUzbek(text){
  try{
    if(!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang="uz-UZ"; u.rate=.88; u.pitch=1.02; u.volume=.75;
    speechSynthesis.speak(u);
  }catch(e){}
}
document.addEventListener("click",(e)=>{
  const el=e.target.closest("button,a,[data-open-apply],[data-course]");
  if(!el) return;
  waterSound();
  if(el.matches("[data-open-apply], .btn-fire") || el.textContent.trim().toLowerCase().includes("ariza")){
    setTimeout(()=>speakUzbek("Ariza"),60);
  }
},{capture:true});
