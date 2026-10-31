/* 10-sinf Geografiya — 1-chorak mavzulari. Raqamlar taxminiy, xalqaro manbalar (BMT, Jahon banki) asosida yaxlitlangan. */
window.AMALIY_ADD("10", "10-sinf", {
  id: "geografiya", name: "Geografiya", icon: "🌍", color: "#0ea5e9",
  topics: [
    {
      id: "siyosiy-xarita", title: "Jahonning siyosiy xaritasi", tag: "Davlatlar, chegaralar, poytaxtlar",
      life: "Yangiliklarda “Kanada”, “Braziliya”, “Indoneziya” degan nomlarni eshitasiz — ular qayerda, qanchalik katta? Sayohatga, o‘qishga yoki ishga chet elga borayotgan har bir kishi siyosiy xaritani bilishi kerak. O‘zbekiston ham shu xaritadagi 190 dan ortiq davlatdan biri.",
      explain: "<p><b>Siyosiy xarita</b> — dunyodagi davlatlar, ularning chegaralari, poytaxtlari va boshqa hududlarni ko‘rsatuvchi xarita. U doimiy emas: yangi davlatlar paydo bo‘ladi, chegaralar o‘zgaradi.</p><p>Bugun dunyoda <b>BMTga a’zo 193 ta davlat</b> bor. Ular maydoni va aholisi bo‘yicha juda farq qiladi: eng kattasi — <b>Rossiya</b> (≈17,1 mln km²), eng kichigi — <b>Vatikan</b> (≈0,44 km²).</p><p>Siyosiy xaritadagi o‘zgarishlar <b>miqdor</b> (yangi hududlar qo‘shilishi yoki yo‘qotilishi) va <b>sifat</b> (mustaqillikka erishish, davlat tuzumining o‘zgarishi) o‘zgarishlariga bo‘linadi. Masalan, 1991-yilda O‘zbekiston mustaqillikka erishdi — bu sifat o‘zgarishi.</p>",
      rule: "Davlatning asosiy belgilari: hudud, aholi, suverenitet (mustaqil hokimiyat), poytaxt va chegara.",
      demos: [{ type: "countryExplorer" }],
      examples: [
        { q: "Maydoni bo‘yicha eng katta 3 ta davlatni ayting.", steps: ["Rossiya — ≈17,1 mln km²", "Kanada — ≈10 mln km²", "AQSH — ≈9,8 mln km² (Xitoy juda yaqin: ≈9,6 mln km²)"], a: "Rossiya, Kanada, AQSH" },
        { q: "O‘zbekiston Germaniyadan katta yoki kichikmi?", steps: ["O‘zbekiston ≈ 449 ming km²", "Germaniya ≈ 357 ming km²"], a: "O‘zbekiston kattaroq" }
      ],
      quiz: [
        { q: "BMTga nechta davlat a’zo?", o: ["193", "150", "250", "100"], e: "BMT a’zolari — 193 ta davlat." },
        { q: "Dunyodagi eng kichik davlat?", o: ["Vatikan", "Monako", "Andorra", "Singapur"], e: "Vatikan — taxminan 0,44 km²." },
        { q: "1991-yil O‘zbekistonning mustaqillikka erishishi qanday o‘zgarish?", o: ["Sifat o‘zgarishi", "Miqdor o‘zgarishi", "Iqlim o‘zgarishi", "O‘zgarish emas"], e: "Davlat maqomi o‘zgardi — bu sifat o‘zgarishi." }
      ]
    },
    {
      id: "rivojlanish-tasnifi", title: "Jahon mamlakatlarining ijtimoiy-iqtisodiy rivojlanganligi bo‘yicha tasnifi", tag: "Rivojlangan va rivojlanayotgan mamlakatlar",
      life: "Nega ba’zi mamlakatlarda o‘rtacha umr 80 yildan oshadi, boshqalarida esa 60 ga yetmaydi? Nega bir xil ish uchun turli mamlakatlarda turlicha haq to‘lanadi? Javob — mamlakatlarning rivojlanish darajasida.",
      explain: "<p>Mamlakatlar ijtimoiy-iqtisodiy rivojlanishiga ko‘ra uch katta guruhga bo‘linadi:</p><ul><li><b>Rivojlangan mamlakatlar</b> — aholi jon boshiga yalpi ichki mahsulot (YaIM) yuqori, sanoat va xizmat ko‘rsatish rivojlangan: AQSH, Yaponiya, Germaniya, Fransiya, Buyuk Britaniya va boshqalar.</li><li><b>Rivojlanayotgan mamlakatlar</b> — eng ko‘p guruh: Hindiston, Braziliya, Nigeriya, Indoneziya va boshqalar. Ular orasida tez rivojlanayotgan “yangi industrial” mamlakatlar ham bor.</li><li><b>O‘tish iqtisodiyotidagi mamlakatlar</b> — rejali iqtisodiyotdan bozor iqtisodiyotiga o‘tgan MDH va Sharqiy Yevropa davlatlari, jumladan O‘zbekiston.</li></ul><p>Asosiy ko‘rsatkichlar: <b>aholi jon boshiga YaIM</b> va <b>Inson taraqqiyoti indeksi (ITI)</b> — u daromad, ta’lim va umr davomiyligini birga hisobga oladi.</p>",
      rule: "Rivojlanish ko‘rsatkichlari: aholi jon boshiga YaIM, Inson taraqqiyoti indeksi (daromad + ta’lim + umr davomiyligi).",
      demos: [{ type: "sorter", cats: ["Rivojlangan", "Rivojlanayotgan", "O‘tish iqtisodiyoti"], items: [
        ["🇯🇵 Yaponiya", 0], ["🇩🇪 Germaniya", 0], ["🇺🇸 AQSH", 0], ["🇫🇷 Fransiya", 0],
        ["🇮🇳 Hindiston", 1], ["🇳🇬 Nigeriya", 1], ["🇧🇷 Braziliya", 1], ["🇮🇩 Indoneziya", 1],
        ["🇺🇿 O‘zbekiston", 2, "Bozor iqtisodiyotiga o‘tish yo‘lidagi davlat."], ["🇰🇿 Qozog‘iston", 2]
      ] }],
      examples: [
        { q: "Inson taraqqiyoti indeksi qaysi uch ko‘rsatkichdan iborat?", steps: ["Daromad darajasi (aholi jon boshiga)", "Ta’lim darajasi (o‘qish yillari)", "O‘rtacha umr davomiyligi"], a: "Daromad, ta’lim va umr davomiyligi" }
      ],
      quiz: [
        { q: "Qaysi mamlakat rivojlangan mamlakatlar guruhiga kiradi?", o: ["Yaponiya", "Nigeriya", "Bangladesh", "Pokiston"], e: "Yaponiya — yuqori texnologiyali rivojlangan mamlakat." },
        { q: "Mamlakatlarning eng ko‘p sonli guruhi?", o: ["Rivojlanayotgan", "Rivojlangan", "O‘tish iqtisodiyoti", "Hammasi teng"], e: "Dunyo mamlakatlarining aksariyati rivojlanayotgan mamlakatlar." },
        { q: "O‘zbekiston qaysi guruhga kiritiladi?", o: ["O‘tish iqtisodiyotidagi", "Rivojlangan", "Eng kam rivojlangan", "Neft eksport qiluvchi"], e: "MDH davlatlari bozor iqtisodiyotiga o‘tish yo‘lida." }
      ]
    },
    {
      id: "boshqaruv-shakli", title: "Mamlakatlarning boshqaruv shakli va davlat tuzilishi", tag: "Respublika, monarxiya, unitar, federativ",
      life: "Buyuk Britaniyada qirol bor, lekin mamlakatni parlament va hukumat boshqaradi. AQSHda esa 50 ta shtat, har birining o‘z qonunlari bor. Davlatlar turlicha boshqariladi va tuziladi — buni bilish dunyo yangiliklarini tushunishga yordam beradi.",
      explain: "<p><b>Boshqaruv shakli</b> — oliy hokimiyat qanday tashkil etilgani:</p><ul><li><b>Respublika</b> — davlat boshlig‘i (prezident) va parlament saylanadi. Dunyo davlatlarining aksariyati — respublika (O‘zbekiston, Fransiya, AQSH, Germaniya).</li><li><b>Monarxiya</b> — hokimiyat meros bo‘lib o‘tadi. <i>Konstitutsiyaviy</i> monarxiyada monarx hokimiyati konstitutsiya bilan cheklangan (Buyuk Britaniya, Yaponiya, Ispaniya), <i>mutlaq</i> monarxiyada esa cheklanmagan (Saudiya Arabistoni).</li></ul><p><b>Davlat tuzilishi</b> — hudud qanday bo‘lingani:</p><ul><li><b>Unitar</b> — yagona konstitutsiya va yagona qonunchilik (Fransiya, Yaponiya, Xitoy, O‘zbekiston).</li><li><b>Federativ</b> — davlat tarkibidagi qismlar (shtat, yer, respublika) o‘z qonunlari va boshqaruviga ega (AQSH, Rossiya, Germaniya, Hindiston, Braziliya).</li></ul>",
      rule: "Boshqaruv shakli: respublika yoki monarxiya. Davlat tuzilishi: unitar yoki federativ.",
      demos: [
        { type: "sorter", title: "Boshqaruv shakli bo‘yicha saralang", cats: ["Respublika", "Monarxiya"], items: [["🇺🇿 O‘zbekiston", 0], ["🇫🇷 Fransiya", 0], ["🇺🇸 AQSH", 0], ["🇹🇷 Turkiya", 0], ["🇬🇧 Buyuk Britaniya", 1], ["🇯🇵 Yaponiya", 1], ["🇸🇦 Saudiya Arabistoni", 1, "Mutlaq monarxiya."], ["🇪🇸 Ispaniya", 1]] },
        { type: "sorter", title: "Davlat tuzilishi bo‘yicha saralang", cats: ["Unitar", "Federativ"], items: [["🇫🇷 Fransiya", 0], ["🇯🇵 Yaponiya", 0], ["🇨🇳 Xitoy", 0], ["🇺🇿 O‘zbekiston", 0], ["🇺🇸 AQSH", 1], ["🇷🇺 Rossiya", 1], ["🇩🇪 Germaniya", 1], ["🇮🇳 Hindiston", 1], ["🇧🇷 Braziliya", 1]] }
      ],
      examples: [
        { q: "Buyuk Britaniya boshqaruv shakli va tuzilishini aniqlang.", steps: ["Davlat boshlig‘i — qirol, hokimiyat meros bo‘lib o‘tadi → monarxiya", "Qirol hokimiyati konstitutsiyaviy an’analar va parlament bilan cheklangan → konstitutsiyaviy monarxiya"], a: "Konstitutsiyaviy monarxiya" }
      ],
      quiz: [
        { q: "Federativ davlatni toping.", o: ["AQSH", "Fransiya", "Yaponiya", "O‘zbekiston"], e: "AQSH 50 ta shtatdan iborat federatsiya." },
        { q: "Mutlaq monarxiyaga misol?", o: ["Saudiya Arabistoni", "Buyuk Britaniya", "Ispaniya", "Yaponiya"], e: "Monarx hokimiyati konstitutsiya bilan cheklanmagan." },
        { q: "Respublikada davlat boshlig‘i qanday tanlanadi?", o: ["Saylanadi", "Meros bo‘lib o‘tadi", "Qur’a bilan", "Tayinlanmaydi"], e: "Prezident saylov orqali tanlanadi." }
      ]
    },
    {
      id: "amaliy-siyosiy-xarita", title: "Amaliy mashg‘ulot: Jahon siyosiy xaritasi bilan ishlash", tag: "Davlat va poytaxtlar",
      life: "Xaritani “o‘qiy olish” — geografning asosiy mahorati. Davlatni poytaxti bilan bog‘lash, uni materikda topish, maydon va aholisini solishtirish — bularni o‘yin orqali mashq qilamiz.",
      explain: "<p>Siyosiy xarita bilan ishlashda quyidagilarga e’tibor beriladi:</p><ol><li>Davlatning <b>materik va qismi</b> (masalan, Turkiya — Osiyo va Yevropada).</li><li><b>Poytaxti</b> va yirik shaharlari.</li><li><b>Qo‘shnilari</b>, dengizga chiqish imkoniyati. O‘zbekiston — dunyodagi ikki marta dengizga chiqa olmaydigan (ya’ni dengizga chiqish uchun ikki davlat hududidan o‘tish kerak bo‘lgan) ikki davlatdan biri; ikkinchisi — Lixtenshteyn.</li><li><b>Maydoni va aholisi</b> — boshqa davlatlar bilan solishtirish.</li></ol>",
      rule: "Har bir davlat uchun: materik → poytaxt → qo‘shnilar → maydon va aholi.",
      demos: [{ type: "capitalQuiz" }],
      examples: [
        { q: "O‘zbekistonning qo‘shnilarini ayting.", steps: ["Shimolda — Qozog‘iston", "Sharqda — Qirg‘iziston va Tojikiston", "Janubda — Afg‘oniston va Turkmaniston"], a: "Qozog‘iston, Qirg‘iziston, Tojikiston, Afg‘oniston, Turkmaniston" }
      ],
      quiz: [
        { q: "Avstraliyaning poytaxti?", o: ["Kanberra", "Sidney", "Melburn", "Pert"], e: "Eng katta shahar Sidney bo‘lsa-da, poytaxt — Kanberra." },
        { q: "Kanadaning poytaxti?", o: ["Ottava", "Toronto", "Monreal", "Vankuver"], e: "Ottava." },
        { q: "Ikki marta dengizga chiqa olmaydigan davlatlar?", o: ["O‘zbekiston va Lixtenshteyn", "Mo‘g‘uliston va Chad", "Shveytsariya va Avstriya", "Bolivia va Paragvay"], e: "Dengizga chiqish uchun ikki davlat hududini kesib o‘tish kerak." }
      ]
    },
    {
      id: "mineral-resurslar", title: "Mineral resurslar geografiyasi", tag: "Yoqilg‘i, ruda va noruda resurslar",
      life: "Telefoningizdagi mis va oltin, mashinaning benzini, uyingizdagi gaz — bularning hammasi yer qa’ridan olinadi. O‘zbekiston oltin, mis, uran va tabiiy gaz zaxiralari bilan mashhur — Muruntov oltin koni dunyodagi eng yiriklaridan biri.",
      explain: "<p><b>Mineral resurslar</b> — yer qa’ridan olinadigan foydali qazilmalar. Ular uch guruhga bo‘linadi:</p><ul><li><b>Yoqilg‘i resurslari</b>: neft, tabiiy gaz, ko‘mir, uran.</li><li><b>Rudali (metall) resurslar</b>: temir, mis, oltin, alyuminiy (boksit).</li><li><b>Norudali resurslar</b>: osh tuzi, fosforit, kaliy tuzlari, qurilish materiallari.</li></ul><p>Joylashuvi geologik tuzilish bilan bog‘liq: yoqilg‘i resurslari asosan <b>cho‘kindi jinslarda</b> (platformalarda), rudalar esa <b>burmalangan tog‘li hududlarda</b> uchraydi.</p><p><b>Resurs bilan ta’minlanganlik</b> = zaxira : yillik qazib olish. U resurs hozirgi sur’atda necha yilga yetishini ko‘rsatadi.</p>",
      rule: "Ta’minlanganlik (yil) = Zaxira : Yillik qazib olish",
      demos: [{ type: "reserveCalc" }],
      examples: [
        { q: "Mamlakatda 600 mln t neft zaxirasi bor, yiliga 20 mln t qazib olinadi. Necha yilga yetadi?", steps: ["Ta’minlanganlik = 600 : 20"], a: "30 yil" },
        { q: "Mis rudasi qayerda ko‘p uchraydi: tekislikdami yoki tog‘lardami?", steps: ["Rudali resurslar magmatik va metamorfik jinslar bilan bog‘liq", "Ular burmalangan tog‘li hududlarda joylashgan"], a: "Tog‘li hududlarda" }
      ],
      quiz: [
        { q: "Qaysi biri yoqilg‘i resursi?", o: ["Tabiiy gaz", "Mis", "Osh tuzi", "Temir"], e: "Neft, gaz, ko‘mir, uran — yoqilg‘i resurslari." },
        { q: "Zaxira 900 mln t, yillik qazish 30 mln t. Ta’minlanganlik?", o: ["30 yil", "27 000 yil", "3 yil", "60 yil"], e: "900 : 30 = 30." },
        { q: "Neft va gaz asosan qanday jinslarda uchraydi?", o: ["Cho‘kindi jinslarda", "Vulqon jinslarida", "Muzliklarda", "Granitda"], e: "Cho‘kindi qatlamli platformalarda." }
      ]
    },
    {
      id: "tiklanadigan-resurslar", title: "Tugamaydigan va tiklanadigan tabiiy resurslar geografiyasi", tag: "Quyosh, shamol, suv, o‘rmon, tuproq",
      life: "Uylar tomida quyosh panellari, cho‘lda shamol tegirmonlari — O‘zbekistonda ham yirik quyosh va shamol elektr stansiyalari qurilmoqda. Chunki neft va gaz bir kun tugaydi, quyosh esa milliardlab yil porlaydi.",
      explain: "<p>Tabiiy resurslar tugashiga ko‘ra:</p><ul><li><b>Tugaydigan, tiklanmaydigan</b>: neft, gaz, ko‘mir, rudalar — bir marta ishlatiladi.</li><li><b>Tugaydigan, tiklanadigan</b>: o‘rmon, tuproq, o‘simlik va hayvonot dunyosi — to‘g‘ri foydalanilsa, qayta tiklanadi. Ammo tiklanish tezligidan tezroq sarflansa, yo‘qolib ketishi mumkin.</li><li><b>Tugamaydigan</b>: quyosh nuri, shamol, okean to‘lqinlari, geotermal issiqlik.</li></ul><p>Yer resurslari (tuproq) — eng muhim boylik: dunyo quruqligining faqat taxminan 10–12 foizi ekin maydonlaridir. Suv resurslari notekis taqsimlangan: Markaziy Osiyo kabi quruq hududlarda suv tanqisligi muammosi kuchli.</p>",
      rule: "Tiklanadigan resursdan uning tiklanish tezligidan oshirmay foydalanish — barqaror rivojlanish asosi.",
      demos: [{ type: "sorter", cats: ["Tugaydigan, tiklanmaydigan", "Tugaydigan, tiklanadigan", "Tugamaydigan"], items: [
        ["🛢️ Neft", 0], ["⛏️ Ko‘mir", 0], ["🪙 Oltin rudasi", 0], ["🔥 Tabiiy gaz", 0],
        ["🌲 O‘rmon", 1], ["🌱 Tuproq", 1, "Tuproqning 1 sm qatlami tabiiy sharoitda yuzlab yilda hosil bo‘ladi."], ["🦌 Hayvonot dunyosi", 1],
        ["☀️ Quyosh nuri", 2], ["💨 Shamol", 2], ["🌋 Geotermal issiqlik", 2], ["🌊 Okean to‘lqinlari", 2]
      ] }],
      examples: [
        { q: "O‘rmon nega “tugaydigan, ammo tiklanadigan” resurs?", steps: ["Daraxtlar qayta o‘sadi — resurs tiklanadi", "Ammo kesish o‘sishdan tez bo‘lsa, o‘rmon yo‘qoladi"], a: "Chunki tiklanadi, lekin ortiqcha sarflansa tugaydi" }
      ],
      quiz: [
        { q: "Qaysi biri tugamaydigan resurs?", o: ["Shamol energiyasi", "Ko‘mir", "Tuproq", "Temir rudasi"], e: "Shamol doim esadi." },
        { q: "Tiklanadigan resursni toping.", o: ["O‘rmon", "Neft", "Uran", "Mis"], e: "O‘rmon qayta o‘sadi." },
        { q: "Barqaror foydalanish nimani anglatadi?", o: ["Tiklanish tezligidan oshirmay foydalanish", "Iloji boricha ko‘p sarflash", "Umuman foydalanmaslik", "Faqat eksport qilish"], e: "Kelajak avlodga ham yetadigan qilib foydalanish." }
      ]
    },
    {
      id: "ekologik-muammolar", title: "Loyiha darsi: Global ekologik muammolar", tag: "Iqlim o‘zgarishi, Orol fojiasi, ifloslanish",
      life: "Orol dengizi 1960-yilda dunyodagi eng katta ko‘llardan biri edi. Bugun uning katta qismi qurib, o‘rnida Orolqum cho‘li paydo bo‘ldi. Bu — inson faoliyati tabiatga qanchalik ta’sir qilishining yorqin misoli.",
      explain: "<p><b>Global ekologik muammolar</b> — butun insoniyatga taalluqli, bir davlat yolg‘iz hal qila olmaydigan muammolar:</p><ul><li><b>Iqlim o‘zgarishi</b> — issiqxona gazlari (CO₂, metan) ko‘payishi natijasida Yer harorati ko‘tarilmoqda, muzliklar erimoqda.</li><li><b>Havo va suv ifloslanishi</b> — sanoat, transport, chiqindilar.</li><li><b>Cho‘llanish va tuproq degradatsiyasi</b>.</li><li><b>O‘rmonlarning kamayishi</b> va biologik xilma-xillikning qisqarishi.</li><li><b>Chiqindilar</b>, ayniqsa plastik muammosi.</li></ul><p><b>Orol fojiasi</b>: Amudaryo va Sirdaryo suvining sug‘orishga haddan tashqari olinishi natijasida dengiz sathi keskin pasaydi, suv sho‘rlanib ketdi, atrofda chang-tuz bo‘ronlari paydo bo‘ldi. Hozir qurigan tubida saksovul o‘rmonlari ekilmoqda.</p>",
      rule: "Global muammo — global hamkorlik: “Global o‘yla, mahalliy harakat qil”.",
      demos: [{ type: "matcher", pairs: [
        ["🌡️ Iqlim isishi", "Quyosh va shamol energiyasiga o‘tish", "Issiqxona gazlari chiqindisi kamayadi."],
        ["🏜️ Orol dengizi qurishi", "Suvni tejovchi tomchilatib sug‘orish", "Daryolardan kamroq suv olinadi."],
        ["🌲 O‘rmonlar kesilishi", "Daraxt ekish va o‘rmonlarni qo‘riqlash", ""],
        ["🧴 Plastik chiqindilar", "Qayta ishlash va ko‘p martalik idishlar", ""],
        ["🏭 Havo ifloslanishi", "Zavodlarda filtrlar, elektr transport", ""]
      ] }],
      examples: [
        { q: "Loyiha g‘oyasi: maktabingizda ekologik muammoni qanday kamaytirasiz?", steps: ["Muammoni tanlang: masalan, plastik chiqindi", "Reja: chiqindilarni saralash qutilari qo‘yish", "Natijani o‘lchang: bir oyda qancha plastik yig‘ildi"], a: "Kichik amaliy qadamlar katta natija beradi" }
      ],
      quiz: [
        { q: "Orol dengizi qurishining asosiy sababi?", o: ["Daryolar suvining sug‘orishga haddan ko‘p olinishi", "Zilzila", "Yomg‘irning ko‘payishi", "Vulqon otilishi"], e: "Amudaryo va Sirdaryo suvi dengizga yetib bormay qoldi." },
        { q: "Asosiy issiqxona gazi?", o: ["Karbonat angidrid (CO₂)", "Kislorod", "Azot", "Geliy"], e: "CO₂ — yoqilg‘i yonishidan hosil bo‘ladi." },
        { q: "Qaysi biri global muammo?", o: ["Iqlim o‘zgarishi", "Bitta qishloqdagi yo‘l chuqurligi", "Maktab oshxonasi", "Sinfdagi parta"], e: "Butun sayyoraga ta’sir qiladi." }
      ]
    },
    {
      id: "aholi-soni", title: "Dunyo aholisining soni, o‘sishi va joylashishi", tag: "Demografik portlash va aholi zichligi",
      life: "2022-yil 15-noyabrda dunyo aholisi 8 milliardga yetdi. Bir necha soniyada dunyoda bir necha chaqaloq tug‘iladi. Aholi qayerda zich, qayerda siyrak — maktab, shifoxona va yo‘l qurilishini rejalashtirishda shuni bilish kerak.",
      explain: "<p>Aholi soni <b>tabiiy o‘sish</b> (tug‘ilish − o‘lim) va <b>migratsiya</b> hisobiga o‘zgaradi.</p><p>XX asrning ikkinchi yarmida aholi juda tez ko‘paydi — bu <b>demografik portlash</b> deyiladi: 1 mlrddan 2 mlrdga yetish 123 yil olgan bo‘lsa, 7 dan 8 mlrdga — 11 yil.</p><p>Aholi notekis joylashgan: dunyo aholisining yarmidan ko‘pi Osiyoda yashaydi. Eng ko‘p aholili mamlakatlar — <b>Hindiston</b> va <b>Xitoy</b> (har biri 1,4 mlrd dan ortiq).</p><p><b>Aholi zichligi</b> = aholi soni : maydon (kishi/km²).</p>",
      rule: "Tabiiy o‘sish = tug‘ilish − o‘lim. Aholi zichligi = aholi : maydon.",
      demos: [{ type: "popTimeline" }],
      examples: [
        { q: "Mamlakatda 1000 kishiga 24 tug‘ilish va 5 o‘lim to‘g‘ri keladi. Tabiiy o‘sish?", steps: ["24 − 5 = 19", "1000 kishiga 19 kishi, ya’ni 19 ‰ (promille) yoki 1,9%"], a: "19 ‰" },
        { q: "O‘zbekiston: ≈37 mln kishi, ≈449 ming km². Zichlik?", steps: ["37 000 000 : 449 000", "≈ 82"], a: "≈ 82 kishi/km²" }
      ],
      quiz: [
        { q: "Dunyo aholisi qachon 8 mlrdga yetdi?", o: ["2022-yil", "2000-yil", "2011-yil", "1999-yil"], e: "BMT ma’lumotiga ko‘ra 2022-yil 15-noyabr." },
        { q: "Tabiiy o‘sish qanday hisoblanadi?", o: ["Tug‘ilish − o‘lim", "Tug‘ilish + o‘lim", "Kelganlar − ketganlar", "Aholi : maydon"], e: "Migratsiya alohida hisoblanadi." },
        { q: "Dunyo aholisining yarmidan ko‘pi qaysi qit’ada?", o: ["Osiyo", "Afrika", "Yevropa", "Amerika"], e: "Hindiston va Xitoy — Osiyoda." }
      ]
    },
    {
      id: "yosh-jins", title: "Jahon aholisining yosh-jins va irqiy tarkibi", tag: "Aholi piramidasi va irqlar",
      life: "Nega Yaponiyada qariyalar uyi ko‘p, Afrika mamlakatlarida esa maktablar yetishmaydi? Javobni aholi piramidasi beradi: u mamlakat aholisi “yosh” yoki “qari” ekanini bir qarashda ko‘rsatadi.",
      explain: "<p><b>Yosh tarkibi</b> uch guruhga bo‘linadi: bolalar (0–14 yosh), mehnatga layoqatli (15–64 yosh), keksalar (65 va undan katta). Bu tarkib <b>aholi piramidasi</b>da ko‘rsatiladi: chapda erkaklar, o‘ngda ayollar.</p><ul><li><b>O‘suvchi tur</b> — asosi keng: bolalar ko‘p (Nigeriya, Niger).</li><li><b>Qisqaruvchi tur</b> — asosi tor: keksalar ulushi katta (Yaponiya, Italiya).</li></ul><p><b>Jins tarkibi</b>: dunyoda erkaklar biroz ko‘proq, lekin ayollar o‘rtacha uzoqroq yashaydi, shuning uchun keksalar orasida ayollar ko‘p.</p><p><b>Irqlar</b>: yevropoid, mongoloid, negroid (ekvatorial) va avstraloid katta irqlari ajratiladi. Irqlar faqat tashqi belgilar (teri rangi, soch, ko‘z shakli) bilan farqlanadi — barcha odamlar aqlan va qobiliyatda teng.</p>",
      rule: "Piramida asosi keng — aholi yosh; asosi tor — aholi qariyapti.",
      demos: [{ type: "agePyramid" }],
      examples: [
        { q: "Mamlakatda 0–14 yoshlilar 45%, 65+ yoshlilar 3%. Piramida qanday?", steps: ["Bolalar ulushi juda katta → asosi keng", "Keksalar kam → cho‘qqisi tor"], a: "O‘suvchi tur" }
      ],
      quiz: [
        { q: "Asosi tor piramida nimani bildiradi?", o: ["Tug‘ilish past, aholi qariyapti", "Tug‘ilish juda yuqori", "Urush bo‘lgan", "Aholi juda yosh"], e: "Yaponiyaga xos tur." },
        { q: "Mehnatga layoqatli yosh oralig‘i?", o: ["15–64", "0–14", "65+", "7–18"], e: "Xalqaro statistikada shunday olinadi." },
        { q: "Irqlar bir-biridan nimasi bilan farqlanadi?", o: ["Faqat tashqi belgilar bilan", "Aqli bilan", "Qobiliyati bilan", "Huquqlari bilan"], e: "Barcha irqlar teng." }
      ]
    },
    {
      id: "etnik-diniy", title: "Dunyo aholisining etnik va diniy tarkibi", tag: "Xalqlar, til oilalari, dinlar",
      life: "O‘zbekistonda 130 dan ortiq millat vakillari ahil yashaydi. Dunyoda esa 7000 ga yaqin til bor! Qaysi tillar qarindosh, qaysi dinlar qayerda tarqalgan — bu bilim boshqa xalqlarni tushunish va hurmat qilishga yordam beradi.",
      explain: "<p><b>Etnos (xalq)</b> — umumiy tili, madaniyati va o‘zligi bo‘lgan insonlar jamoasi. Dunyoda bir necha ming xalq bor; eng ko‘p sonlisi — xitoylar (xanlar).</p><p>Tillar kelib chiqishiga ko‘ra <b>til oilalari</b>ga birlashadi:</p><ul><li><b>Hind-Yevropa</b> — eng katta oila: ingliz, rus, ispan, hind, fors, tojik tillari.</li><li><b>Oltoy</b> (turkiy guruhi): o‘zbek, qozoq, turk, ozarbayjon tillari.</li><li><b>Xitoy-Tibet</b>: xitoy tili.</li><li><b>Afroosiyo (Som-hom)</b>: arab, ivrit tillari.</li></ul><p><b>Dunyo dinlari</b>: xristianlik (taxminan 30%), islom (taxminan 25%), buddizm. Shuningdek, hinduizm kabi milliy dinlar ham keng tarqalgan. O‘zbekiston aholisining aksariyati islom diniga e’tiqod qiladi.</p>",
      rule: "Dunyo dinlari: xristianlik, islom, buddizm. Eng katta til oilasi — hind-yevropa.",
      demos: [{ type: "sorter", cats: ["Hind-Yevropa", "Oltoy (turkiy)", "Xitoy-Tibet", "Afroosiyo"], items: [
        ["🇬🇧 Ingliz", 0], ["🇷🇺 Rus", 0], ["🇹🇯 Tojik", 0, "Tojik tili fors tiliga yaqin, hind-eron guruhiga kiradi."], ["🇮🇳 Hind", 0],
        ["🇺🇿 O‘zbek", 1], ["🇰🇿 Qozoq", 1], ["🇹🇷 Turk", 1],
        ["🇨🇳 Xitoy", 2],
        ["🇸🇦 Arab", 3]
      ] }, { type: "shareChart", title: "Dunyo aholisining diniy tarkibi (taxminan)", center: "Dinlar", sets: [["Dunyo", [["Xristianlik", 30], ["Islom", 25], ["Hinduizm", 15], ["Buddizm", 5], ["Boshqa va dinsizlar", 25]], "Taxminiy ulushlar (Pew tadqiqot markazi ma’lumotlari asosida yaxlitlangan)."]] }],
      examples: [
        { q: "O‘zbek va turk tillari qaysi oilaga kiradi va nega bir-biriga o‘xshaydi?", steps: ["Ikkalasi ham turkiy tillar", "Oltoy til oilasining turkiy guruhiga kiradi", "Umumiy ajdoddan kelib chiqqani uchun so‘zlar o‘xshash"], a: "Oltoy oilasi, turkiy guruh" }
      ],
      quiz: [
        { q: "Eng katta til oilasi?", o: ["Hind-Yevropa", "Oltoy", "Xitoy-Tibet", "Afroosiyo"], e: "Ingliz, ispan, hind, rus tillari shu oilada." },
        { q: "Arab tili qaysi oilaga kiradi?", o: ["Afroosiyo", "Hind-Yevropa", "Oltoy", "Xitoy-Tibet"], e: "Som-hom (afroosiyo) oilasi." },
        { q: "Dunyo dinlariga qaysi biri kiradi?", o: ["Buddizm", "Sintoizm", "Konfutsiylik", "Hinduizm"], e: "Dunyo dinlari: xristianlik, islom, buddizm." }
      ]
    },
    {
      id: "urbanizatsiya", title: "Jahon mamlakatlarining urbanizatsiyasi", tag: "Shaharlarning o‘sishi va megapolislar",
      life: "Bobolarimizning ko‘pi qishloqda yashagan, bugun esa dunyo aholisining yarmidan ko‘pi shaharlarda. Tokio, Dehli, Shanxay kabi gigant shaharlarda 30 milliongacha odam yashaydi — bu O‘zbekistonning butun aholisiga yaqin!",
      explain: "<p><b>Urbanizatsiya</b> — shaharlar sonining o‘sishi, shahar aholisi ulushining ortishi va shahar turmush tarzining tarqalishi.</p><p>Dunyoda shaharliklar ulushi 1950-yilda taxminan <b>30%</b> bo‘lgan, 2007-yilda birinchi marta <b>50%</b> dan oshgan, BMT prognoziga ko‘ra 2050-yilga kelib <b>68%</b> ga yetadi.</p><p>Shaharlar birlashib <b>aglomeratsiya</b> (yirik shahar va uning atrofidagi shaharlar) va <b>megalopolis</b> (bir necha aglomeratsiyaning qo‘shilishi, masalan, AQSHdagi Boston–Vashington) hosil qiladi.</p><p>Rivojlangan mamlakatlarda urbanizatsiya darajasi yuqori (75–90%), rivojlanayotganlarda esa past, ammo o‘sish sur’ati juda tez.</p>",
      rule: "Urbanizatsiya darajasi = shahar aholisi : jami aholi · 100%",
      demos: [{ type: "urbanChart" }],
      examples: [
        { q: "Mamlakatda 20 mln aholining 13 mlni shaharda yashaydi. Urbanizatsiya darajasi?", steps: ["13 : 20 · 100%", "= 65%"], a: "65%" }
      ],
      quiz: [
        { q: "Dunyoda shaharliklar qachon birinchi marta 50% dan oshdi?", o: ["2007-yil atrofida", "1950-yil", "1900-yil", "2050-yil"], e: "BMT ma’lumotlari." },
        { q: "Bir necha aglomeratsiyaning qo‘shilishi nima deyiladi?", o: ["Megalopolis", "Qishloq", "Viloyat", "Voha"], e: "Masalan, Boston–Vashington megalopolisi." },
        { q: "30 mln aholining 24 mlni shaharda. Daraja?", o: ["80%", "24%", "60%", "125%"], e: "24 : 30 · 100% = 80%." }
      ]
    },
    {
      id: "amaliy-aholi", title: "Amaliy mashg‘ulot: Aholi harakati, tarkibi va joylashuviga oid masalalar", tag: "Zichlik, tabiiy o‘sish, migratsiya",
      life: "Hokimliklar yangi maktab yoki shifoxona qurishdan oldin hisob-kitob qiladi: aholi qancha ko‘payadi, qayerda zich yashaydi, nechta odam ko‘chib keladi? Bu — aholi geografiyasining amaliy masalalari.",
      explain: "<p>Asosiy formulalar:</p><ul><li><b>Aholi zichligi</b> = aholi : maydon (kishi/km²)</li><li><b>Tabiiy o‘sish koeffitsiyenti</b> = tug‘ilish koeff. − o‘lim koeff. (‰ — har 1000 kishiga)</li><li><b>Migratsiya saldosi</b> = kelganlar − ketganlar</li><li><b>Umumiy o‘sish</b> = tabiiy o‘sish + migratsiya saldosi</li></ul><p>‰ (promille) — mingdan bir ulush: 15 ‰ = 1000 kishiga 15 kishi = 1,5%.</p>",
      rule: "Umumiy o‘sish = (tug‘ilish − o‘lim) + (kelganlar − ketganlar)",
      demos: [{ type: "exprValue", items: [
        { story: "Aholi zichligi: <b>A</b> — aholi (ming kishi), <b>S</b> — maydon (km²):", display: "A · 1000 : S", vars: { A: [100, 5000, 1200, "Aholi A (ming kishi)"], S: [100, 20000, 4000, "Maydon S (km²)"] }, fn: (v) => Math.round((v.A * 1000) / v.S), unit: "kishi/km²" },
        { story: "Tabiiy o‘sish (har 1000 kishiga): <b>T</b> — tug‘ilish, <b>O</b> — o‘lim:", display: "T − O", vars: { T: [5, 45, 22, "Tug‘ilish T (‰)"], O: [3, 20, 5, "O‘lim O (‰)"] }, fn: (v) => v.T - v.O, unit: "‰" },
        { story: "Umumiy o‘sish (ming kishi): <b>t</b> — tabiiy o‘sish, <b>k</b> — kelganlar, <b>j</b> — ketganlar:", display: "t + (k − j)", vars: { t: [0, 100, 40, "Tabiiy o‘sish t"], k: [0, 50, 12, "Kelganlar k"], j: [0, 50, 20, "Ketganlar j"] }, fn: (v) => v.t + (v.k - v.j), unit: "ming kishi" }
      ] }],
      examples: [
        { q: "Viloyatda 2 mln kishi, maydoni 20 000 km². Zichlik?", steps: ["2 000 000 : 20 000"], a: "100 kishi/km²" },
        { q: "Shaharda yil davomida tabiiy o‘sish 8 ming, 5 ming kishi keldi, 9 ming kishi ketdi. Umumiy o‘sish?", steps: ["Migratsiya saldosi: 5 − 9 = −4 ming", "Umumiy: 8 + (−4) = 4 ming"], a: "4 ming kishiga ko‘paydi" }
      ],
      quiz: [
        { q: "Tug‘ilish 20 ‰, o‘lim 7 ‰. Tabiiy o‘sish?", o: ["13 ‰", "27 ‰", "2,7 ‰", "140 ‰"], e: "20 − 7 = 13." },
        { q: "Kelganlar 3 ming, ketganlar 7 ming. Migratsiya saldosi?", o: ["−4 ming", "4 ming", "10 ming", "0"], e: "3 − 7 = −4." },
        { q: "15 ‰ necha foiz?", o: ["1,5%", "15%", "0,15%", "150%"], e: "‰ — mingdan bir." }
      ]
    },
    {
      id: "jahon-xojaligi", title: "Jahon xo‘jaligi va xalqaro mehnat taqsimoti", tag: "Tarmoqlar va ixtisoslashuv",
      life: "Telefoningiz Koreyada loyihalangan, Xitoyda yig‘ilgan, ichidagi metallar Afrikada qazib olingan bo‘lishi mumkin. Dunyo mamlakatlari bir-biriga mahsulot yetkazib, “yagona zavod” kabi ishlaydi — bu xalqaro mehnat taqsimoti.",
      explain: "<p><b>Jahon xo‘jaligi</b> — xalqaro iqtisodiy aloqalar bilan bog‘langan barcha mamlakatlar xo‘jaliklarining yig‘indisi.</p><p>Xo‘jalik tarmoqlari uch sohaga bo‘linadi:</p><ul><li><b>Birlamchi soha</b>: qishloq xo‘jaligi, o‘rmon xo‘jaligi, baliqchilik, konchilik.</li><li><b>Ikkilamchi soha</b>: sanoat (ishlab chiqarish) va qurilish.</li><li><b>Uchlamchi soha</b>: xizmat ko‘rsatish — savdo, transport, ta’lim, sog‘liqni saqlash, bank, turizm.</li></ul><p><b>Xalqaro mehnat taqsimoti (XMT)</b> — mamlakatlarning ma’lum mahsulot ishlab chiqarishga <b>ixtisoslashuvi</b> va ularni ayirboshlashi. Masalan, Saudiya Arabistoni — neft, Yaponiya — avtomobil va elektronika, Braziliya — kofe va temir rudasi, O‘zbekiston — paxta, oltin, mis, tabiiy gaz.</p>",
      rule: "Ixtisoslashuv tabiiy sharoit, resurslar, mehnat va texnologiyaga bog‘liq.",
      demos: [
        { type: "sorter", title: "Tarmoqlarni sohalarga ajrating", cats: ["Birlamchi", "Ikkilamchi", "Uchlamchi"], items: [["🌾 Qishloq xo‘jaligi", 0], ["⛏️ Konchilik", 0], ["🐟 Baliqchilik", 0], ["🏭 Avtomobil zavodi", 1], ["🏗️ Qurilish", 1], ["🧵 To‘qimachilik", 1], ["🏦 Bank", 2], ["🎓 Ta’lim", 2], ["✈️ Turizm", 2], ["🛒 Savdo", 2]] },
        { type: "matcher", title: "Mamlakatni ixtisoslashuvi bilan bog‘lang", pairs: [["🇸🇦 Saudiya Arabistoni", "Neft eksporti"], ["🇯🇵 Yaponiya", "Avtomobil va elektronika"], ["🇧🇷 Braziliya", "Kofe va temir rudasi"], ["🇦🇺 Avstraliya", "Temir rudasi va jun"], ["🇺🇿 O‘zbekiston", "Paxta, oltin va mis"]] }
      ],
      examples: [
        { q: "Nega Saudiya Arabistoni neftga ixtisoslashgan?", steps: ["Dunyodagi eng katta neft zaxiralaridan biri", "Ichki iste’moldan ko‘p ishlab chiqaradi", "Ortiqchasini eksport qiladi"], a: "Boy tabiiy resurs tufayli" }
      ],
      quiz: [
        { q: "Bank qaysi sohaga kiradi?", o: ["Uchlamchi (xizmat)", "Birlamchi", "Ikkilamchi", "Hech qaysi"], e: "Xizmat ko‘rsatish sohasi." },
        { q: "Konchilik qaysi soha?", o: ["Birlamchi", "Ikkilamchi", "Uchlamchi", "To‘rtlamchi"], e: "Tabiiy resursni olish — birlamchi." },
        { q: "Xalqaro mehnat taqsimotining asosi?", o: ["Mamlakatlarning ixtisoslashuvi", "Chegaralarni yopish", "Hamma narsani o‘zi ishlab chiqarish", "Urush"], e: "Har kim eng yaxshi qila oladigan mahsulotni ishlab chiqaradi." }
      ]
    },
    {
      id: "integratsiya", title: "Jahon iqtisodiyoti markazlari va xalqaro integratsiya jarayonlari", tag: "YeI, ASEAN, MERCOSUR, MDH, OPEK",
      life: "Fransiyadan Germaniyaga borish uchun pasport tekshiruvi deyarli yo‘q, ikkalasida ham bir xil pul — yevro. Bu — integratsiya, ya’ni mamlakatlarning iqtisodiy birlashuvi natijasi.",
      explain: "<p><b>Jahon iqtisodiyotining asosiy markazlari</b>: AQSH, Yevropa Ittifoqi (YeI), Xitoy, Yaponiya; tez o‘sayotganlar — Hindiston va boshqalar.</p><p><b>Xalqaro iqtisodiy integratsiya</b> — mamlakatlarning iqtisodiy hamkorlik va birlashuv jarayoni. Asosiy tashkilotlar:</p><ul><li><b>YeI (Yevropa Ittifoqi)</b> — 27 mamlakat, yagona bozor, ko‘pchiligida yagona valyuta — yevro.</li><li><b>ASEAN</b> — Janubi-Sharqiy Osiyo davlatlari (Indoneziya, Vyetnam, Tailand va b.).</li><li><b>MERCOSUR</b> — Janubiy Amerika (Braziliya, Argentina, Urugvay, Paragvay).</li><li><b>MDH</b> — Mustaqil Davlatlar Hamdo‘stligi (O‘zbekiston, Qozog‘iston, Rossiya va b.).</li><li><b>OPEK</b> — neft eksport qiluvchi mamlakatlar tashkiloti (Saudiya Arabistoni, Iroq, Eron va b.).</li></ul>",
      rule: "Integratsiya bosqichlari: erkin savdo zonasi → bojxona ittifoqi → umumiy bozor → iqtisodiy va valyuta ittifoqi.",
      demos: [{ type: "sorter", cats: ["YeI", "ASEAN", "MERCOSUR", "OPEK"], items: [["🇫🇷 Fransiya", 0], ["🇩🇪 Germaniya", 0], ["🇮🇹 Italiya", 0], ["🇮🇩 Indoneziya", 1], ["🇻🇳 Vyetnam", 1], ["🇹🇭 Tailand", 1], ["🇧🇷 Braziliya", 2], ["🇦🇷 Argentina", 2], ["🇸🇦 Saudiya Arabistoni", 3], ["🇮🇶 Iroq", 3]] }],
      examples: [
        { q: "YeI fuqarosi uchun integratsiyaning qanday qulayligi bor?", steps: ["Ichki chegaralarda tekshiruv deyarli yo‘q", "Ko‘p davlatlarda yagona pul — yevro", "Boshqa a’zo davlatda o‘qish va ishlash imkoni"], a: "Erkin harakat, yagona bozor va valyuta" }
      ],
      quiz: [
        { q: "Yevropa Ittifoqining umumiy valyutasi?", o: ["Yevro", "Dollar", "Funt", "Rubl"], e: "Ko‘pchilik a’zolarda yevro muomalada." },
        { q: "OPEK nima?", o: ["Neft eksport qiluvchi mamlakatlar tashkiloti", "Futbol federatsiyasi", "Harbiy ittifoq", "Sayohat agentligi"], e: "Neft narxi va qazib olishini muvofiqlashtiradi." },
        { q: "O‘zbekiston qaysi hamdo‘stlik a’zosi?", o: ["MDH", "YeI", "MERCOSUR", "ASEAN"], e: "Mustaqil Davlatlar Hamdo‘stligi." }
      ]
    },
    {
      id: "amaliy-xojalik", title: "Amaliy mashg‘ulot: Jahon xo‘jaligi va uning tarkibini o‘rganish", tag: "YaIM tarkibi",
      life: "Mamlakat boyligi faqat neft yoki paxtada emas. Bugun rivojlangan mamlakatlar daromadining katta qismi xizmatlardan — dasturlash, bank, turizm, ta’limdan keladi.",
      explain: "<p><b>Yalpi ichki mahsulot (YaIM)</b> — mamlakatda bir yilda yaratilgan barcha mahsulot va xizmatlarning qiymati.</p><p>YaIM tarkibi uch soha bo‘yicha o‘rganiladi. Dunyo bo‘yicha taxminan: qishloq xo‘jaligi — 4%, sanoat va qurilish — 28%, xizmatlar — 68% atrofida.</p><p>Qonuniyat: mamlakat rivojlangan sari <b>qishloq xo‘jaligi ulushi kamayadi</b>, <b>xizmatlar ulushi ortadi</b>. Rivojlangan mamlakatlarda xizmatlar 70–80% ni tashkil etadi, eng kam rivojlangan mamlakatlarda esa qishloq xo‘jaligi ulushi 20–30% gacha yetadi.</p>",
      rule: "Soha ulushi = soha mahsuloti : YaIM · 100%",
      demos: [{ type: "shareChart", title: "YaIM tarkibi (namunaviy)", center: "YaIM", sets: [
        ["Dunyo (taxminan)", [["Qishloq xo‘jaligi", 4], ["Sanoat va qurilish", 28], ["Xizmatlar", 68]], "Dunyo YaIMining taxminiy tarkibi (Jahon banki ma’lumotlari asosida yaxlitlangan)."],
        ["Rivojlangan (namuna)", [["Qishloq xo‘jaligi", 1], ["Sanoat va qurilish", 22], ["Xizmatlar", 77]], "Rivojlangan mamlakatlarga xos namunaviy tarkib: xizmatlar ustun."],
        ["Kam rivojlangan (namuna)", [["Qishloq xo‘jaligi", 25], ["Sanoat va qurilish", 25], ["Xizmatlar", 50]], "Kam rivojlangan mamlakatlarga xos namunaviy tarkib: qishloq xo‘jaligi ulushi katta."]
      ] }],
      examples: [
        { q: "YaIM 500 mlrd dollar, sanoatniki 150 mlrd. Sanoat ulushi?", steps: ["150 : 500 · 100%"], a: "30%" }
      ],
      quiz: [
        { q: "Rivojlangan mamlakatlarda YaIMning eng katta qismi?", o: ["Xizmatlar", "Qishloq xo‘jaligi", "Konchilik", "Baliqchilik"], e: "70–80%." },
        { q: "YaIM 200, qishloq xo‘jaligi 40. Ulushi?", o: ["20%", "40%", "5%", "80%"], e: "40 : 200 · 100%." },
        { q: "Mamlakat rivojlangan sari qaysi soha ulushi kamayadi?", o: ["Qishloq xo‘jaligi", "Xizmatlar", "Ta’lim", "IT"], e: "Iqtisodiyot xizmatlar tomon siljiydi." }
      ]
    },
    {
      id: "energetika", title: "Jahon energetikasi geografiyasi", tag: "Energiya manbalari va elektr stansiyalar",
      life: "Uydagi chiroq, telefon zaryadi, zavod dastgohlari — hammasi energiya talab qiladi. O‘zbekistonda elektr asosan gaz bilan ishlovchi IESlarda ishlab chiqariladi, so‘nggi yillarda esa yirik quyosh va shamol stansiyalari qurilmoqda.",
      explain: "<p><b>Yoqilg‘i-energetika kompleksi</b> — yoqilg‘i qazib olish (neft, gaz, ko‘mir) va elektr energetikasi.</p><p>Dunyo birlamchi energiya iste’moli tarkibi taxminan: neft — 32%, ko‘mir — 26%, tabiiy gaz — 23%, gidroenergiya — 6%, atom — 4%, quyosh, shamol va boshqa qayta tiklanuvchi manbalar — 8% atrofida.</p><p>Elektr stansiyalari turlari:</p><ul><li><b>IES</b> (issiqlik) — ko‘mir, gaz, mazut yoqadi; eng keng tarqalgan.</li><li><b>GES</b> (gidro) — daryo oqimi energiyasi (Norvegiya, Braziliya, Kanadada ulushi katta).</li><li><b>AES</b> (atom) — Fransiyada elektrning katta qismi AESlardan.</li><li><b>Muqobil</b> — quyosh (QES), shamol (ShES), geotermal.</li></ul>",
      rule: "Asosiy tendensiya: qazilma yoqilg‘idan qayta tiklanuvchi manbalarga bosqichma-bosqich o‘tish.",
      demos: [{ type: "shareChart", title: "Dunyo birlamchi energiya iste’moli (taxminan)", center: "Energiya", sets: [["Dunyo", [["Neft", 32], ["Ko‘mir", 26], ["Tabiiy gaz", 23], ["Gidro", 6], ["Atom", 4], ["Quyosh, shamol va b.", 9]], "Taxminiy ulushlar (Energy Institute statistik ma’lumotlari asosida yaxlitlangan). Qazilma yoqilg‘ilar hali ham 80% atrofida."]] },
        { type: "matcher", title: "Stansiya turini mamlakat bilan bog‘lang", pairs: [["⚛️ AES ulushi juda katta", "Fransiya"], ["💧 GES ulushi juda katta", "Norvegiya"], ["🔥 Gaz bilan ishlovchi IES ustun", "O‘zbekiston"], ["🌋 Geotermal energiya", "Islandiya"]] }],
      examples: [
        { q: "Nega Norvegiyada elektrning asosiy qismi GESlardan olinadi?", steps: ["Tog‘li relyef — daryolar tez oqadi", "Yog‘in ko‘p — suv resurslari boy"], a: "Tog‘li relyef va suv resurslarining boyligi" }
      ],
      quiz: [
        { q: "Dunyoda eng ko‘p iste’mol qilinadigan energiya manbai?", o: ["Neft", "Atom", "Quyosh", "Geotermal"], e: "Taxminan uchdan bir qismi." },
        { q: "Elektrning katta qismini AESlardan oladigan mamlakat?", o: ["Fransiya", "Saudiya Arabistoni", "Norvegiya", "Misr"], e: "Fransiya — atom energetikasi yetakchisi." },
        { q: "Qaysi biri qayta tiklanuvchi manba?", o: ["Shamol", "Ko‘mir", "Neft", "Tabiiy gaz"], e: "Shamol tugamaydi." }
      ]
    }
  ]
});
