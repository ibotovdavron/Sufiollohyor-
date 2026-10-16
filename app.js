(() => {
 const cfg=window.SUFIOLLOHYOR_CONFIG;
 window.sufiClient=(window.supabase&&cfg&&cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes('YOUR_PUBLIC_KEY'))?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
 window.sufi={async signOut(){if(window.sufiClient)await window.sufiClient.auth.signOut();location.href='login.html'},async route(){const c=window.sufiClient;if(!c){location.href='login.html';return}const {data:{user}}=await c.auth.getUser();if(!user){location.href='login.html';return}const {data:p}=await c.from('profiles').select('role').eq('id',user.id).maybeSingle();const r=String(p?.role||'student').toLowerCase();location.href=(r==='admin'||r==='administrator')?'admin.html':(['teacher','ustoz'].includes(r)?'teacher.html':'dashboard.html')}};
 document.querySelectorAll('[data-logout]').forEach(b=>b.onclick=()=>window.sufi.signOut());
 document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>document.querySelector(b.dataset.menu)?.classList.toggle('open'));
 document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
