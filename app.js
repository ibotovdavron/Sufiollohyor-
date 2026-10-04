const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let audio;
function initAudio(){if(!audio) audio=new (window.AudioContext||window.webkitAudioContext)()}
function water(){try{initAudio();const t=audio.currentTime;for(let i=0;i<3;i++){let o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=420+i*130;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.45);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.5)}}catch(e){}}
function say(x){water();if('speechSynthesis'in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(x);u.lang='uz-UZ';u.rate=.9;speechSynthesis.speak(u)}}
addEventListener('load',()=>{setTimeout(()=>$('#loader')?.remove(),650);$$('.reveal').forEach((e,i)=>setTimeout(()=>e.classList.add('show'),120+i*80))});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});$$('.reveal').forEach(e=>io.observe(e));
let cx=innerWidth/2,cy=innerHeight/2;addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY;let c=$('#cursor'),g=$('.glow');if(c){c.style.left=cx+'px';c.style.top=cy+'px'}if(g){g.style.left=cx+'px';g.style.top=cy+'px'}});
$$('.tilt').forEach(el=>el.addEventListener('pointermove',e=>{let r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`}));$$('.tilt').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
$$('[data-sound]').forEach(b=>b.addEventListener('mouseenter',water));
$('#sound')?.addEventListener('click',()=>{water();$('#sound').textContent='🔊'});$('#apply')?.addEventListener('click',()=>say('Ariza'));
$$('a[data-page]').forEach(a=>a.addEventListener('click',e=>{let href=a.href;if(href.includes(location.pathname.split('/').pop()||'index.html'))return;e.preventDefault();$('#wave').classList.add('go');setTimeout(()=>location.href=href,520)}));
function toast(t){let x=$('#toast');if(!x)return;x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2500)}
$('#appform')?.addEventListener('submit',e=>{e.preventDefault();say('Ariza qabul qilindi');toast('Arizangiz qabul qilindi ✨');e.target.reset()});
