(() => {
 const D=window.CENTER_DATA||{};
 const pages=[
  ["index.html","🏠","Bosh sahifa"],
  ["competitions.html","🏆","Musobaqalar"],
  ["teachers.html","🎓","Ustozlar"],
  ["ranking.html","📊","Reyting"],
  ["results.html","📄","Natijalar"],
  ["schedule.html","🗓️","Jadval"],
  ["shop.html","🛍️","Do‘kon"],
  ["about.html","ℹ️","Haqimizda"],
  ["contact.html","☎️","Aloqa"]
 ];
 const path=location.pathname.split("/").pop()||"index.html";
 const nav=document.getElementById("bottomNav");
 if(nav) nav.innerHTML=pages.map(([url,icon,label])=>`<a class="navitem ${path===url?'active':''}" href="${url}" aria-label="${label}"><span class="navicon">${icon}</span><span class="navlabel">${label}</span></a>`).join("");
 document.querySelectorAll("[data-center]").forEach(el=>{const k=el.dataset.center;if(D[k]!==undefined)el.textContent=D[k]});
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const subjects=document.getElementById("homeSubjects");
 if(subjects) subjects.innerHTML=(D.subjects||[]).map(s=>`<div class="subject"><span class="emoji">${s.icon}</span><div><b>${esc(s.name)}</b><small>${esc(s.caption)}</small></div></div>`).join("");
 const features=[
  ["competitions.html","🏆","Musobaqalar","Bilimdonlar bellashuvi"],
  ["ranking.html","📊","Reyting","O‘quvchilar natijalari"],
  ["teachers.html","🧑‍🏫","Ustozlar","Tajribali va malakali"],
  ["results.html","📝","Natijalar","Bilimingizni sinang"],
  ["schedule.html","🗓️","Dars jadvali","Darslar va guruhlar"],
  ["shop.html","🛍️","Do‘kon","Kitob, daftar va o‘quv qurollari"]
 ];
 const homeFeatures=document.getElementById("homeFeatures");
 if(homeFeatures)homeFeatures.innerHTML=features.map(([href,icon,title,desc])=>`<a class="card" href="${href}"><div class="card-visual">${icon}</div><div class="card-body"><h3>${title}</h3><p>${desc}</p><span class="green">Ochish →</span></div></a>`).join("");
 const rankPreview=document.getElementById("rankPreview");
 if(rankPreview)rankPreview.innerHTML=(D.students||[]).slice().sort((a,b)=>b.stars-a.stars).slice(0,5).map((s,i)=>`<div class="result-row"><div><b><span class="ranknum">${i+1}.</span> ${esc(s.name)}</b><div class="smallprint">${esc(s.group)}</div></div><strong class="stars">⭐ ${s.stars}</strong></div>`).join("");
 const comps=document.getElementById("competitionGrid");
 if(comps)comps.innerHTML=(D.competitions||[]).map(c=>`<article class="competition-card"><div class="avatar">${c.icon}</div><span class="tag">${esc(c.status)}</span><h3>${esc(c.name)}</h3><b>${esc(c.type)}</b><p class="muted">${esc(c.description)}</p></article>`).join("");
 const teachers=document.getElementById("teacherGrid");
 if(teachers)teachers.innerHTML=(D.teachers||[]).map(t=>`<article class="teacher-card"><div class="avatar">${t.icon||"🎓"}</div><span class="tag">${esc(t.subject)}</span><h3>${esc(t.name)}</h3><p class="muted">${esc(t.bio)}</p></article>`).join("");
 const ranking=document.getElementById("rankingRows");
 if(ranking)ranking.innerHTML=(D.students||[]).slice().sort((a,b)=>b.stars-a.stars).map((s,i)=>`<tr><td class="ranknum">${i+1}</td><td>${esc(s.name)}</td><td>${esc(s.group)}</td><td class="stars">⭐ ${s.stars}</td><td>${esc(s.result)}</td></tr>`).join("");
 const results=document.getElementById("resultsList");
 if(results)results.innerHTML=(D.students||[]).slice().sort((a,b)=>b.stars-a.stars).map(s=>`<div class="result-row"><div><b>${esc(s.name)}</b><div class="smallprint">${esc(s.group)} · ${esc(s.result)}</div></div><strong class="stars">⭐ ${s.stars}</strong></div>`).join("");
 const rules=document.getElementById("starRules");
 if(rules)rules.innerHTML=(D.starRules||[]).map(r=>`<div class="result-row"><span>${esc(r.title)}</span><b class="stars">+${r.stars} ⭐</b></div>`).join("");
 const search=document.getElementById("studentSearch");
 if(search&&ranking)search.addEventListener("input",()=>{const q=search.value.toLowerCase();[...ranking.querySelectorAll("tr")].forEach(row=>row.classList.toggle("hidden",!row.textContent.toLowerCase().includes(q)))});
 const compSearch=document.getElementById("competitionSearch");
 if(compSearch&&comps)compSearch.addEventListener("input",()=>[...comps.children].forEach(card=>card.classList.toggle("hidden",!card.textContent.toLowerCase().includes(compSearch.value.toLowerCase()))));
 const teacherSearch=document.getElementById("teacherSearch");
 if(teacherSearch&&teachers)teacherSearch.addEventListener("input",()=>[...teachers.children].forEach(card=>card.classList.toggle("hidden",!card.textContent.toLowerCase().includes(teacherSearch.value.toLowerCase()))));
 document.querySelectorAll("[data-phone]").forEach(a=>a.href="tel:"+String(D.phone||"").replace(/\s/g,""));
 document.querySelectorAll("[data-telegram]").forEach(a=>{a.href=D.telegram||"https://t.me/sufi_ollohyor_uquv_markaz";a.target="_blank";a.rel="noopener noreferrer"});
 document.querySelectorAll("[data-instagram]").forEach(a=>{a.href=D.instagram||"https://www.instagram.com/sufiollohyor/";a.target="_blank";a.rel="noopener noreferrer"});
 document.querySelectorAll("[data-math-telegram]").forEach(a=>{a.href=D.mathTelegram||"https://t.me/matematika144";a.target="_blank";a.rel="noopener noreferrer"});
})();
