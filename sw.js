/* So‘fi Ollohyor ilovasi: oflayn ishlash uchun kesh.
   Sahifalar — avval internetdan (yangi bo‘lsin), bo‘lmasa keshdan.
   Rasm, CSS, JS — keshdan tez beriladi va orqada yangilanadi. */
const CACHE = "sofi-v35";
const CORE = [
  "./", "index.html", "kurslar.html", "competitions.html", "teachers.html", "ranking.html",
  "games.html", "shop.html", "amaliy.html", "contact.html",
  "style.css?v=14", "data.js?v=12", "app.js?v=8", "assets/markaz-logo.png", "assets/icons/icon-192.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(CORE.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // Supabase, Telegram — kesh qilinmaydi

  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
