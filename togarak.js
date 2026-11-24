/* “Nega? Nimaga? Qanday?” to‘garagi: 12 haftalik reja, bajarilganlarni belgilash va unvonlar. */
(() => {
  "use strict";
  const FAN = {
    fiz: ["⚡ Fizika", "#38bdf8"], kim: ["⚗️ Kimyo", "#a78bfa"], bio: ["🌿 Biologiya", "#22c55e"],
    mat: ["📐 Matematika", "#f59e0b"], inf: ["💻 Informatika", "#06b6d4"], tar: ["🏺 Tarix", "#f472b6"],
  };
  // [fan, savol, maqsad, uyda/sinfda tajriba, materiallar, saytdagi jonli tajriba (hash), xulosa]
  const PLAN = [
    ["fiz", "Nega pat toshdan sekin tushadi?", "Erkin tushish va havo qarshiligi",
      "Varaq qog‘oz va kitobni bir balandlikdan tashlang. So‘ng qog‘ozni g‘ijimlab qayta tashlang. Keyin qog‘ozni kitob ustiga qo‘yib tashlang.",
      "varaq qog‘oz, kitob, tanga, pat", "8/fizika/erkin-tushish",
      "Havo bo‘lmasa, hamma jism bir xil tushadi. Qog‘ozni havo qarshiligi ushlab turadi."],
    ["kim", "Nega karam suvi rangini o‘zgartiradi?", "Kislota va ishqorlar, pH indikator",
      "Qizil karam qaynatmasini (ustoz tayyorlaydi) 5 ta stakanga quying: sirka, limon, soda, sovun eritmasi va toza suv qo‘shing. Ranglarni pH shkalasi bilan solishtiring.",
      "qizil karam, sirka, limon, soda, sovun, 5 ta shaffof stakan", "7/kimyo/kundalik-kimyo",
      "Karam bo‘yog‘i (antotsian) kislotada qizaradi, ishqorda ko‘k-yashil bo‘ladi."],
    ["bio", "Nega piyoz “g‘ishtchalardan” qurilgan?", "Hujayra tuzilishi",
      "Piyozning yupqa ichki po‘stini oling, bir tomchi yod bilan bo‘yang. Telefon kamerasiga tomchi suv (linza) qo‘yib kattalashtiring yoki mikroskopda ko‘ring.",
      "piyoz, yod, oyna, telefon yoki maktab mikroskopi", "7/biologiya/osimlik-hayvon-hujayra",
      "Barcha tirik organizmlar hujayralardan tuzilgan. O‘simlik hujayrasida qalin devor bor."],
    ["mat", "Nega π har doim 3,14 ga teng?", "Aylana uzunligi va diametri",
      "Stakan, tarelka, chelak qopqog‘i va velosiped g‘ildiragining aylanasini ip bilan, diametrini chizg‘ich bilan o‘lchang. Jadvalda C : d ni hisoblang.",
      "ip, chizg‘ich, 4–5 ta yumaloq buyum, kalkulyator", "6/matematika/aylana-element",
      "Har qanday aylanada C : d ≈ 3,14 — bu π soni. Shuning uchun C = πd."],
    ["fiz", "Nega soch taroqqa yopishadi?", "Elektrlanish, zaryadlar",
      "Havo sharini sochga yoki junga ishqalang. Qog‘oz parchalariga, ingichka suv oqimiga va devorga yaqinlashtiring.",
      "havo shari, jun ro‘mol, qog‘oz parchalari, suv krani", "8/fizika/zaryadlanish",
      "Ishqalanganda elektronlar bir jismdan ikkinchisiga o‘tadi. Har xil zaryadlar tortishadi."],
    ["kim", "Nega soda bilan sirka ko‘piradi?", "Kimyoviy reaksiya va uning tezligi",
      "Plastilindan “vulqon” yasang, ichiga soda soling, sirka quying. Keyin iliq va sovuq sirka bilan reaksiya tezligini solishtiring.",
      "soda, sirka, plastilin, bo‘yoq, issiq va sovuq suv", "8/kimyo/tezlik8",
      "Soda + sirka → karbonat angidrid gazi (pufakchalar). Harorat oshsa, reaksiya tezlashadi."],
    ["inf", "Nega kompyuter faqat 0 va 1 ni tushunadi?", "Ikkilik sanoq sistemasi",
      "5 ta kartochkaga 1, 2, 4, 8, 16 ta nuqta chizing. Kartochkani ochish — 1, yopish — 0. Shu bilan 0 dan 31 gacha sonlarni ko‘rsating, ismingizni shifrlang.",
      "5 ta karton kartochka, flomaster", "9/informatika/xotira-masala",
      "Kompyuterda faqat ikki holat bor: tok bor (1) yoki yo‘q (0). Har qanday son 0 va 1 bilan yoziladi."],
    ["fiz", "Nega mayatnik soatni boshqaradi?", "Tebranish davri",
      "Ipga gayka osing. Uzunligi 25, 50 va 100 sm bo‘lganda 10 ta tebranish vaqtini sekundomerda o‘lchang. Gaykani og‘irrog‘iga almashtiring.",
      "ip, 2 xil gayka, chizg‘ich, telefon sekundomeri", "10/fizika/tebranishlar",
      "Davr faqat ip uzunligiga bog‘liq (massaga emas). Ip 4 marta uzaysa, davr 2 marta oshadi."],
    ["bio", "Nega ko‘zimiz aldanadi?", "Sezgi organlari, ko‘r dog‘",
      "Qog‘ozga “+” va “●” chizing. Chap ko‘zni yopib, “+” ga qarang va qog‘ozni yaqinlashtiring — nuqta yo‘qoladi! So‘ng optik illyuziyalarni sinab ko‘ring.",
      "oq qog‘oz, flomaster, chizg‘ich", "8/biologiya/sezgi",
      "Ko‘z to‘r pardasida ko‘ruv nervi chiqadigan joyda retseptor yo‘q — ko‘r dog‘. Miya “bo‘shliqni” o‘zi to‘ldiradi."],
    ["tar", "Nega arxeologlar mo‘yqalam bilan qazishadi?", "Arxeologiya, madaniy qatlamlar",
      "Qutiga 3 qavat qum, tuproq va mayda tosh soling, har qavatga “artefakt” (tanga, sopol parcha) yashiring. Guruhlar mo‘yqalam bilan qazib, topilmalarni chizadi va yoshini taxmin qiladi.",
      "karton quti, qum, tuproq, tangalar, sopol parchalar, mo‘yqalam", "5/tarix/arxeologiya",
      "Pastki qatlam — eskiroq. Topilmaning qaysi qatlamdan chiqqani uning yoshini aytadi."],
    ["fiz", "Nega rogatka toshni uzoqqa otadi?", "Elastiklik energiyasi va otish burchagi",
      "Ikki qalam va rezinadan kichik rogatka yasang. Qog‘oz sharchani 15°, 30°, 45°, 60° burchak ostida otib, uchish masofasini o‘lchang.",
      "rezina, qalam, qog‘oz sharcha, transportir, ruletka", "7/fizika/tezlik",
      "Rezina qancha ko‘p cho‘zilsa, energiya shuncha ko‘p. Havo qarshiligi bo‘lmasa, eng uzoq masofa 45° da."],
    ["kim", "Nega tuz kristall bo‘ladi?", "Eritmalar va kristallar",
      "Issiq suvda tuz yoki shakarni eriydigan darajada eritib (to‘yingan eritma), ip osib qo‘ying. Bir hafta kuzatib, kristallar o‘sishini suratga oling.",
      "osh tuzi yoki shakar, issiq suv (ustoz), ip, qalam, stakan", "8/kimyo/ion-bog",
      "Suv bug‘langanda zarrachalar tartibli joylashib, kristall panjara hosil qiladi."],
  ];
  const KEY = "sofi_togarak_done_v1";
  let done = [];
  try { done = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { done = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) { /* bo'sh */ } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const plan = document.getElementById("tgPlan"), filt = document.getElementById("tgFilter");
  let only = "all";

  function draw() {
    plan.innerHTML = PLAN.map((w, i) => {
      if (only !== "all" && w[0] !== only) return "";
      const [f, q, goal, how, mat, hash, res] = w, [fn, col] = FAN[f], ok = done.includes(i);
      return `<article class="tg-card${ok ? " ok" : ""}" style="--c:${col}">
        <header><span class="tg-week">${i + 1}-hafta</span><span class="tg-fan">${fn}</span></header>
        <h3>${esc(q)}</h3>
        <p class="tg-goal">${esc(goal)}</p>
        <details><summary>🛠 Qo‘lda tajriba</summary><p>${esc(how)}</p><p class="tg-mat"><b>Kerak:</b> ${esc(mat)}</p><p class="tg-res"><b>💡 Javob:</b> ${esc(res)}</p></details>
        <div class="tg-card-btns">
          <a class="tg-live" href="amaliy.html#${hash}">🖥 Jonli tajriba</a>
          <button type="button" class="tg-done" data-i="${i}">${ok ? "✅ Bajarildi" : "☐ Bajardim"}</button>
        </div>
      </article>`;
    }).join("");
    plan.querySelectorAll(".tg-done").forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i; done = done.includes(i) ? done.filter((x) => x !== i) : done.concat(i); save(); draw();
    }));
    ranks();
  }
  function ranks() {
    const n = done.length;
    document.querySelectorAll("#tgRanks > div").forEach((d) => d.classList.toggle("on", n >= +d.dataset.min));
    const cur = [...document.querySelectorAll("#tgRanks > div")].filter((d) => n >= +d.dataset.min).pop();
    document.getElementById("tgBar").style.width = `${(n / PLAN.length) * 100}%`;
    document.getElementById("tgProgTxt").innerHTML = `Bajarildi: <b>${n} / ${PLAN.length}</b> · Unvoningiz: <b>${cur ? cur.querySelector("em").textContent + " " + cur.querySelector("b").textContent : ""}</b>`;
  }
  filt.innerHTML = [["all", "Hammasi"], ...Object.entries(FAN).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button type="button" data-k="${k}" class="${k === only ? "on" : ""}">${l}</button>`).join("");
  filt.querySelectorAll("button").forEach((b) => (b.onclick = () => { only = b.dataset.k; filt.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
  draw();
})();
