/* 10-sinf Geometriya — yillik reja (stereometriyaga kirish). */
(() => {
  window.AMALIY_SUBJ("10", "10-sinf", "geometriya", "Geometriya", "📐", "#f59e0b", "Yillik reja · 4 chorak");
  const Y = window.AMALIY_YEAR;
  const T = (...a) => a;

  Y("10", "geometriya", "I chorak", [
    T("mantiqiy-tuzilish", "Geometriyaning mantiqiy tuzilishi", "Ta’rif, aksioma, teorema, isbot",
      "Yevklidning “Negizlar” kitobi 2300 yildan beri o‘qilmoqda. Sababi — geometriya qat’iy mantiq asosida qurilgan: bir nechta aksiomadan minglab teoremalar kelib chiqadi.",
      "<ul><li><b>Asosiy (ta’riflanmaydigan) tushunchalar</b>: nuqta, to‘g‘ri chiziq, tekislik, masofa;</li><li><b>Ta’rif</b> — yangi tushunchani avvalgilar orqali tushuntirish (“Kvadrat — tomonlari teng to‘g‘ri to‘rtburchak”);</li><li><b>Aksioma</b> — isbotsiz qabul qilinadigan asosiy da’vo (“Ikki nuqtadan bitta to‘g‘ri chiziq o‘tadi”);</li><li><b>Teorema</b> — isbotlanadigan da’vo: <b>shart</b> (agar …) va <b>xulosa</b> (u holda …);</li><li><b>Isbot</b> — aksioma va oldingi teoremalarga tayangan mantiqiy mulohazalar zanjiri;</li><li><b>Teskari teorema</b> — shart va xulosa almashadi (har doim ham to‘g‘ri emas!); <b>natija</b> — teoremadan bevosita kelib chiqadi.</li></ul>",
      "Aksioma — isbotsiz, teorema — isbot bilan.",
      [["“Agar uchburchak teng yonli bo‘lsa, asosdagi burchaklari teng” teskarisini yozing.", ["Shart va xulosani almashtirish"], "Asosdagi burchaklari teng bo‘lsa, uchburchak teng yonli (to‘g‘ri)"], ["“Vertikal burchaklar teng” teskarisi to‘g‘rimi?", ["Teng burchaklar har doim vertikal emas"], "Yo‘q"]],
      [["Isbotsiz qabul qilinadi:", ["Aksioma", "Teorema", "Natija", "Lemma"], "Axiom."], ["Teorema qismlari:", ["Shart va xulosa", "Faqat xulosa", "Ta’rif", "Rasm"], "If–then."], ["Teskari teorema doim to‘g‘rimi?", ["Yo‘q", "Ha", "Faqat geometriyada", "Faqat algebrada"], "Not always."]],
      [{ type: "sorter", cats: ["📜 Aksioma", "✅ Teorema", "📖 Ta’rif"], items: [["Ikki nuqtadan bitta to‘g‘ri chiziq o‘tadi", 0], ["Uchburchak burchaklari yig‘indisi 180°", 1], ["Romb — tomonlari teng parallelogramm", 2], ["Pifagor teoremasi", 1], ["Nuqtadan berilgan chiziqqa bitta parallel o‘tadi", 0], ["Mediana — uchdan qarshi tomon o‘rtasiga kesma", 2]] }]),

    T("masala-usullar", "Geometrik masalalar va ularni yechish usullari", "Hisoblash, isbot, yasash; algebraik, koordinata, vektor usullar",
      "Bitta geometrik masalani turli yo‘llar bilan yechish mumkin: chizma, tenglama, koordinatalar yoki vektorlar. Eng chiroylisini tanlash — san’at.",
      "<p><b>Masala turlari</b>: hisoblashga (uzunlik, burchak, yuza, hajm), isbotlashga, yasashga.</p><p><b>Yechish usullari</b>:</p><ul><li><b>Sintetik (geometrik)</b> — teoremalar, qo‘shimcha yasashlar;</li><li><b>Algebraik</b> — noma’lumni x deb belgilab, tenglama tuzish;</li><li><b>Trigonometrik</b> — sinuslar, kosinuslar teoremalari;</li><li><b>Koordinata usuli</b> — nuqtalarga koordinata berib, formulalar bilan;</li><li><b>Vektor usuli</b>;</li><li><b>Yuzalar usuli</b>.</li></ul><p>Umumiy tartib: chizma → berilgan/topish → reja → yechish → tekshirish va tahlil.</p>",
      "Chizma → reja → usul tanlash → tekshirish.",
      [["To‘g‘ri burchakli uchburchakda katetlar 6 va 8. Gipotenuzaga tushirilgan balandlik?", ["Gipotenuza 10", "Yuzalar usuli: 6·8 = 10·h"], "4,8"], ["A(1; 2), B(5; 5). AB uzunligi (koordinata usuli)?", ["√(16 + 9)"], "5"]],
      [["Yuzalar usulida tenglik:", ["S = ½ab = ½ch", "a + b = c", "a² = b²", "h = c"], "Area."], ["Koordinata usulida masofa:", ["√((x₂−x₁)² + (y₂−y₁)²)", "x₂ − x₁", "(x + y)/2", "xy"], "Distance."], ["Masala yechishning birinchi qadami:", ["Chizma", "Javob", "Tekshirish", "Formula"], "Diagram."]],
      [{ type: "triCalc" }, { type: "coordPoint" }]),

    T("bob-amaliy-10", "Bobni takrorlashga doir amaliy mashqlar", "Planimetriya takrori",
      "Stereometriyaga o‘tishdan oldin planimetriyaning eng muhim faktlarini yangilaymiz — fazodagi masalalar baribir tekis kesimlarga keltiriladi.",
      "<ul><li><b>Uchburchak</b>: burchaklar yig‘indisi 180°, Pifagor, sinuslar va kosinuslar teoremalari, yuza S = ½ah = ½ab sin C = √(p(p−a)(p−b)(p−c));</li><li><b>To‘rtburchaklar</b>: parallelogramm, to‘g‘ri to‘rtburchak, romb, kvadrat, trapetsiya — xossalar va yuzalar;</li><li><b>Aylana</b>: uzunlik 2πR, doira yuzi πR², ichki/tashqi chizilgan aylanalar;</li><li><b>O‘xshashlik</b>: yuzalar nisbati — o‘xshashlik koeffitsiyenti kvadrati.</li></ul>",
      "Fazodagi masala → tekis kesim → planimetriya.",
      [["Tomonlari 13, 14, 15 bo‘lgan uchburchak yuzi.", ["p = 21", "√(21·8·7·6)"], "84"], ["Kvadrat diagonali 8√2. Yuzi?", ["Tomoni 8"], "64"]],
      [["Teng tomonli uchburchak yuzi (a = 2):", ["√3", "2", "4", "2√3"], "a²√3/4."], ["R = 3 doira yuzi:", ["9π", "6π", "3π", "18π"], "πR²."], ["O‘xshashlik k = 3, yuzalar nisbati:", ["9", "3", "6", "27"], "k²."]],
      [{ type: "triCalc" }, { type: "circleCalc" }]),

    T("stereometriya-asos", "Stereometriyaning asosiy tushunchalari", "Nuqta, to‘g‘ri chiziq, tekislik; aksiomalar",
      "Binolar, mashinalar, idishlar — hammasi uch o‘lchamli. Stereometriya fazodagi shakllarni o‘rganadi va arxitektura, muhandislik, 3D grafikaning asosi.",
      "<p><b>Stereometriya</b> — fazodagi shakllar geometriyasi. Asosiy shakllar: nuqta (A), to‘g‘ri chiziq (a, AB), <b>tekislik</b> (α, β; ABC).</p><p><b>Aksiomalar</b>:</p><ol><li>Bir to‘g‘ri chiziqda yotmagan <b>uchta nuqta</b> orqali bitta tekislik o‘tadi;</li><li>To‘g‘ri chiziqning ikki nuqtasi tekislikda yotsa — butun to‘g‘ri chiziq shu tekislikda;</li><li>Ikki tekislik umumiy nuqtaga ega bo‘lsa — ular <b>to‘g‘ri chiziq</b> bo‘yicha kesishadi.</li></ul><p><b>Natijalar</b>: tekislik to‘g‘ri chiziq va undan tashqaridagi nuqta orqali; ikki kesishuvchi yoki ikki parallel to‘g‘ri chiziq orqali bir qiymatli aniqlanadi.</p><p>Hayotiy: uch oyoqli stul doim qimirlamaydi (3 nuqta), to‘rt oyoqli — tebranishi mumkin.</p>",
      "Uch nuqta — bitta tekislik.",
      [["Nega fotoapparat shtativi uch oyoqli?", ["3 nuqta doim bitta tekislikda"], "Barqaror turadi"], ["Ikki tekislik kesishsa, kesishma nima?", ["Aksioma"], "To‘g‘ri chiziq"]],
      [["Tekislikni aniqlaydi:", ["Bir chiziqda yotmagan 3 nuqta", "2 nuqta", "1 nuqta", "4 nuqta"], "Three."], ["Ikki tekislik kesishmasi:", ["To‘g‘ri chiziq", "Nuqta", "Tekislik", "Aylana"], "Line."], ["Fazodagi shakllar fani:", ["Stereometriya", "Planimetriya", "Trigonometriya", "Algebra"], "Solid."]],
      [{ type: "cubeEdges" }]),

    T("fazo-chiziq-tekislik", "Fazoda to‘g‘ri chiziqlar va tekisliklar", "Joylashuv holatlari: umumiy ko‘rinish",
      "Xonaning burchagi: ikki devor (tekisliklar) bitta chiziq bo‘yicha kesishadi, pol bilan ship parallel, karniz devorga parallel. Fazodagi barcha holatlar shu yerda.",
      "<p><b>Ikki to‘g‘ri chiziq</b>: kesishadi (bir tekislikda, 1 umumiy nuqta); parallel (bir tekislikda, umumiy nuqtasiz); <b>ayqash</b> (bir tekislikda yotmaydi).</p><p><b>To‘g‘ri chiziq va tekislik</b>: chiziq tekislikda yotadi; kesishadi (1 nuqta); parallel (umumiy nuqtasi yo‘q).</p><p><b>Ikki tekislik</b>: kesishadi (to‘g‘ri chiziq bo‘yicha); parallel (umumiy nuqtasi yo‘q).</p><p>Tasvirlash: tekislik — parallelogramm; ko‘rinmas chiziqlar — shtrix.</p>",
      "Fazoda uchinchi holat bor — ayqash chiziqlar.",
      [["Xonada pol va ship tekisliklari qanday?", ["Umumiy nuqtasi yo‘q"], "Parallel"], ["Kubda AB va CC₁ qirralari?", ["Bir tekislikda emas, kesishmaydi"], "Ayqash"]],
      [["Fazoda ikki chiziq holatlari soni:", ["3", "2", "4", "1"], "Intersect, parallel, skew."], ["Chiziq tekislikni kesadi:", ["1 nuqtada", "2 nuqtada", "Chiziq bo‘yicha", "Hech qachon"], "Point."], ["Ikki tekislik holatlari:", ["Kesishadi yoki parallel", "Faqat kesishadi", "Ayqash", "Faqat parallel"], "Two."]],
      [{ type: "cubeEdges" }]),

    T("kopyoqlar", "Fazoviy geometrik shakllar. Ko‘pyoqlar", "Yoqlar, qirralar, uchlar; Eyler formulasi",
      "Olmos, tuz kristali, Misr piramidalari, futbol to‘pi (kesik ikosaedr) — ko‘pyoqlar tabiat va me’morchilikda hamma joyda.",
      "<p><b>Ko‘pyoq</b> — sirti ko‘pburchaklardan (<b>yoqlar</b>) iborat jism. Yoqlar tomonlari — <b>qirralar</b>, ularning uchlari — <b>uchlar</b>.</p><p>Turlari: <b>prizma</b> (ikkita teng parallel asos, yon yoqlari parallelogramm), <b>piramida</b> (asos — ko‘pburchak, yon yoqlari — umumiy uchli uchburchaklar), <b>parallelepiped</b>, <b>kub</b>.</p><p><b>Eyler formulasi</b> (qavariq ko‘pyoqlar uchun):</p><div class='fb'>U − Q + Y = 2&nbsp; (uchlar − qirralar + yoqlar)</div><p>Kub: 8 − 12 + 6 = 2. <b>Muntazam ko‘pyoqlar</b> faqat 5 ta: tetraedr, kub, oktaedr, dodekaedr, ikosaedr (Platon jismlari).</p>",
      "U − Q + Y = 2.",
      [["Uchburchakli prizma: U, Q, Y?", ["U = 6, Q = 9, Y = 5"], "6 − 9 + 5 = 2 ✓"], ["To‘rtburchakli piramida qirralari soni?", ["Asos 4 + yon 4"], "8"]],
      [["Kubning qirralari:", ["12", "8", "6", "24"], "Edges."], ["Muntazam ko‘pyoqlar soni:", ["5", "4", "6", "Cheksiz"], "Platonic."], ["Ko‘pyoq emas:", ["Silindr", "Kub", "Piramida", "Prizma"], "Curved."]],
      [{ type: "solid", kind: "prism" }, { type: "solid", kind: "pyramid" }]),

    T("kopyoq-tasvir", "Ko‘pyoqlarni tasvirlash va modelini yasash", "Parallel proyeksiya, yoyilma",
      "Qog‘ozdan kub yoki piramida yasash uchun avval uning yoyilmasini chizish kerak. Qadoqlash qutilari ham shunday yasaladi.",
      "<p><b>Tekislikda tasvirlash qoidalari</b> (parallel proyeksiya): parallel chiziqlar — parallel; kesmalar nisbati saqlanadi; ko‘rinmas qirralar — <b>shtrix</b> chiziq.</p><p><b>Yoyilma (razvertka)</b> — ko‘pyoq sirtini tekislikka “ochib” yoyish: kub — 6 ta kvadrat (11 xil yoyilma bor!), to‘g‘ri prizma — to‘rtburchak + 2 ta asos, piramida — asos + uchburchaklar “gul” shaklida.</p><p><b>Model yasash</b>: yoyilmani chizish → yopishtirish uchun “qanotchalar” → kesish → buklash → yelimlash.</p><p>To‘la sirt yuzi = yoyilma yuzi.</p>",
      "Yoyilma yuzi = to‘la sirt.",
      [["Qirrasi 5 sm kub yoyilmasining yuzi.", ["6·5²"], "150 sm²"], ["Nechta kvadratdan kub yoyilmasi?", ["Yoqlar soni"], "6 ta"]],
      [["Ko‘rinmas qirra chiziladi:", ["Shtrix bilan", "Qalin", "Qizil", "Chizilmaydi"], "Dashed."], ["Kub yoyilmalari soni:", ["11", "6", "8", "1"], "Eleven."], ["Uchburchakli piramida yoyilmasi:", ["4 ta uchburchak", "3 ta uchburchak", "4 ta kvadrat", "Doira"], "Tetrahedron."]],
      [{ type: "solid", kind: "cube" }]),

    T("kesim", "Ko‘pyoqlarning sodda kesimlarini yasash", "Iz usuli, kesim ko‘pburchagi",
      "Pishloqni pichoq bilan kessangiz, kesim yuzasi ko‘pburchak bo‘ladi. Kubni tekislik bilan kesib, uchburchak, to‘rtburchak, beshburchak, hatto oltiburchak hosil qilish mumkin!",
      "<p><b>Kesim</b> — ko‘pyoqning tekislik bilan kesishgandagi ko‘pburchagi.</p><p><b>Yasash qoidalari</b>:</p><ul><li>Bir yoqda yotgan ikki nuqtani tutashtirish mumkin;</li><li>Parallel yoqlarni tekislik <b>parallel</b> kesmalar bo‘yicha kesadi;</li><li><b>Iz usuli</b>: kesuvchi tekislik bilan asos tekisligi kesishgan chiziq (iz) yordamida qolgan nuqtalarni topish.</li></ul><p>Kub kesimlari: uchburchak (bir uchga yaqin uchta qirra o‘rtalari orqali), to‘rtburchak, beshburchak, muntazam oltiburchak (6 ta qirra o‘rtalari orqali).</p>",
      "Parallel yoqlarda kesim tomonlari parallel.",
      [["Kubda A₁, C₁ va D nuqtalari orqali kesim shakli?", ["A₁C₁, C₁D, DA₁ — yoq diagonallari, teng"], "Teng tomonli uchburchak"], ["Qirrasi a kubning diagonal kesimi (AA₁C₁C) yuzi?", ["a × a√2"], "a²√2"]],
      [["Kub kesimida eng ko‘p tomonlar:", ["6", "4", "5", "8"], "Hexagon."], ["Parallel yoqlarni kesim kesadi:", ["Parallel kesmalar bo‘yicha", "Kesishuvchi", "Ayqash", "Bir nuqtada"], "Parallel."], ["Kesim yasashdagi asosiy usul:", ["Iz usuli", "Integral", "Limit", "Vektor ko‘paytma"], "Trace."]],
      [{ type: "cubeEdges" }])
  ]);

  Y("10", "geometriya", "II chorak", [
    T("chiziqlar-joylashuv", "Fazoda to‘g‘ri chiziqlarning o‘zaro joylashuvi", "Kesishuvchi, parallel, ayqash; parallellik tranzitivligi",
      "Ko‘prik ustidagi yo‘l va daryo bo‘yidagi yo‘l — kesishmaydi, lekin parallel ham emas. Fazoda to‘g‘ri chiziqlar uch xil joylashadi.",
      "<p><b>Parallel to‘g‘ri chiziqlar</b> (fazoda) — bir tekislikda yotib, kesishmaydi.</p><p><b>Teorema</b>: to‘g‘ri chiziqdan tashqaridagi nuqtadan unga parallel faqat bitta to‘g‘ri chiziq o‘tadi.</p><p><b>Tranzitivlik</b>: a ∥ c va b ∥ c ⇒ a ∥ b (fazoda ham).</p><p><b>Ikki chiziq orasidagi burchak</b> (kesishuvchilar uchun) — 0° dan 90° gacha.</p><p>Kubda: AB ∥ DC ∥ D₁C₁ ∥ A₁B₁; AB va AD kesishadi; AB va CC₁ ayqash.</p>",
      "Parallel — bir tekislikda va kesishmaydi.",
      [["Kubda AB ga parallel qirralar?", ["Bir yo‘nalishdagi qirralar"], "DC, A₁B₁, D₁C₁"], ["a ∥ b, b ∥ c (fazoda). a va c?", ["Tranzitivlik"], "Parallel"]],
      [["Kubda bir qirraga parallel qirralar soni:", ["3", "1", "2", "4"], "Three."], ["Kubda bir qirra bilan kesishuvchi qirralar:", ["4", "2", "8", "3"], "Four."], ["Fazoda parallellik tranzitivmi?", ["Ha", "Yo‘q", "Faqat tekislikda", "Ba’zan"], "Yes."]],
      [{ type: "cubeEdges" }]),

    T("ayqash", "Ayqash to‘g‘ri chiziqlar", "Alomat, orasidagi burchak, masofa",
      "Yer osti metro tunneli va ustidagi ko‘cha — ayqash chiziqlar. Ular orasidagi eng qisqa masofani bilish muhandislar uchun muhim.",
      "<p><b>Ayqash to‘g‘ri chiziqlar</b> — bir tekislikda yotmaydigan (kesishmaydigan va parallel bo‘lmagan) chiziqlar.</p><p><b>Alomat</b>: agar bir to‘g‘ri chiziq tekislikda yotsa, ikkinchisi tekislikni shu chiziqqa tegishli bo‘lmagan nuqtada kessa — ular ayqash.</p><p><b>Ayqash chiziqlar orasidagi burchak</b> — ulardan biriga parallel qilib ko‘chirilgan, ikkinchisi bilan kesishgan chiziq orasidagi burchak.</p><p><b>Masofa</b> — ularning umumiy perpendikulyari uzunligi.</p><p>Kubda: AB va CC₁ ayqash, burchak 90°, masofa = a (BC qirra).</p>",
      "Ayqash: kesishmaydi va parallel emas.",
      [["Kubda AB va B₁C₁ orasidagi burchak?", ["B₁C₁ ∥ BC", "∠ABC = 90°"], "90°"], ["Kubda AD₁ va BC₁ orasidagi burchak?", ["BC₁ ∥ AD₁"], "0° (parallel)"]],
      [["Ayqash chiziqlar:", ["Bir tekislikda yotmaydi", "Kesishadi", "Parallel", "Ustma-ust"], "Skew."], ["Ayqash chiziqlar orasidagi masofa:", ["Umumiy perpendikulyar", "Istalgan kesma", "Nolga teng", "Cheksiz"], "Common perp."], ["Kubda AB va CC₁ orasidagi masofa:", ["a", "a√2", "a√3", "0"], "BC."]],
      [{ type: "cubeEdges" }]),

    T("chiziq-tekislik", "Fazoda to‘g‘ri chiziq va tekisliklarning o‘zaro joylashuvi", "Parallellik alomati",
      "Shkaf tokchasi devorga parallel, chiroq simi shiftga perpendikulyar. To‘g‘ri chiziq va tekislik joylashuvini bilish — qurilishning “ABC”si.",
      "<p><b>Holatlar</b>: chiziq tekislikda yotadi; kesishadi; <b>parallel</b> (umumiy nuqtasi yo‘q).</p><p><b>Parallellik alomati</b>: agar tekislikda yotmagan to‘g‘ri chiziq shu tekislikdagi biror to‘g‘ri chiziqqa parallel bo‘lsa, u tekislikka parallel.</p><p><b>Xossa</b>: agar a ∥ α bo‘lsa va a orqali o‘tgan β tekislik α ni kesib o‘tsa, kesishish chizig‘i a ga parallel.</p><p>Kubda: A₁B₁ ∥ (ABCD), chunki A₁B₁ ∥ AB.</p>",
      "Tekislikdagi chiziqqa parallel ⇒ tekislikka parallel.",
      [["Kubda AA₁ qaysi yoqlar tekisliklariga parallel?", ["AA₁ ∥ BB₁, CC₁, DD₁"], "(BB₁C₁C) va (CC₁D₁D)"], ["Stolning qirrasi pol tekisligiga qanday?", ["Pol ustidagi chiziqqa parallel"], "Parallel"]],
      [["Chiziq va tekislik umumiy nuqtasi yo‘q:", ["Parallel", "Kesishadi", "Tekislikda yotadi", "Perpendikulyar"], "Parallel."], ["Kubda A₁B₁ ∥", ["(ABCD)", "(AA₁B₁B)", "(A₁B₁C₁D₁)", "Hech biriga"], "Bottom face."], ["Chiziq tekislikni kesishi:", ["1 nuqtada", "2 nuqtada", "Chiziq bo‘yicha", "Hech qachon"], "Point."]],
      [{ type: "cubeEdges" }]),

    T("tekisliklar", "Fazoda tekisliklarning o‘zaro joylashuvi", "Parallel tekisliklar alomati va xossalari",
      "Ko‘p qavatli binoning qavatlari parallel tekisliklar. Ular orasidagi masofa — qavat balandligi.",
      "<p><b>Ikki tekislik</b>: kesishadi (to‘g‘ri chiziq bo‘yicha) yoki <b>parallel</b>.</p><p><b>Parallellik alomati</b>: agar bir tekislikdagi <b>ikki kesishuvchi</b> to‘g‘ri chiziq mos ravishda ikkinchi tekislikdagi ikki to‘g‘ri chiziqqa parallel bo‘lsa, tekisliklar parallel.</p><p><b>Xossalar</b>:</p><ul><li>Ikki parallel tekislik uchinchi tekislik bilan <b>parallel</b> chiziqlar bo‘yicha kesishadi;</li><li>Parallel tekisliklar orasidagi parallel kesmalar <b>teng</b>;</li><li>Nuqtadan berilgan tekislikka parallel faqat bitta tekislik o‘tadi.</li></ul>",
      "Ikki kesishuvchi chiziq parallel ⇒ tekisliklar parallel.",
      [["Kubda (ABCD) va (A₁B₁C₁D₁)?", ["AB ∥ A₁B₁, AD ∥ A₁D₁"], "Parallel"], ["Parallel tekisliklar orasidagi parallel kesmalar 5 va x. x?", ["Xossa: teng"], "5"]],
      [["Kubda parallel yoqlar juftlari:", ["3", "6", "2", "4"], "Pairs."], ["Ikki parallel tekislikni uchinchisi kesadi:", ["Parallel chiziqlar bo‘yicha", "Bir nuqtada", "Ayqash chiziqlarda", "Kesmaydi"], "Parallel lines."], ["Alomat uchun kerak:", ["Ikki kesishuvchi chiziq", "Bitta chiziq", "Uch nuqta", "Ikki parallel chiziq"], "Intersecting."]],
      [{ type: "solid", kind: "cube" }]),

    T("parallel-proyeksiya", "Fazoda parallel proyeksiyalash", "Proyeksiya xossalari, tasvir qoidalari",
      "Quyosh nuri parallel — shuning uchun daraxt soyasi parallel proyeksiya. Chizmachilikdagi aksonometriya ham shunday quriladi.",
      "<p><b>Parallel proyeksiya</b>: har bir nuqtadan berilgan yo‘nalishda (proyeksiyalovchi chiziq) to‘g‘ri chiziq o‘tkazib, uning tekislik (proyeksiyalar tekisligi) bilan kesishgan nuqtasini topish.</p><p><b>Xossalar</b> (yo‘nalish tekislikka parallel bo‘lmaganda):</p><ul><li>To‘g‘ri chiziq — to‘g‘ri chiziqqa (yoki nuqtaga) o‘tadi;</li><li><b>Parallel</b> kesmalar — parallel kesmalarga;</li><li>Bir chiziqdagi kesmalar <b>nisbati saqlanadi</b> (o‘rtasi — o‘rtaga);</li><li>Burchaklar va uzunliklar odatda saqlanmaydi.</li></ul><p>Natija: kvadrat — parallelogramm, aylana — ellips bo‘lib tasvirlanadi.</p>",
      "Parallellik va nisbat saqlanadi; burchak — yo‘q.",
      [["Kvadratning parallel proyeksiyasi qanday bo‘lishi mumkin?", ["Parallellik saqlanadi"], "Parallelogramm (yoki kesma)"], ["Uchburchak medianasi proyeksiyada nimaga o‘tadi?", ["O‘rta nuqta saqlanadi"], "Proyeksiya uchburchagi medianasiga"]],
      [["Proyeksiyada saqlanadi:", ["Parallellik", "Burchak", "Uzunlik", "Yuza"], "Parallel."], ["Aylana proyeksiyasi:", ["Ellips", "Kvadrat", "To‘g‘ri chiziq doim", "Uchburchak"], "Ellipse."], ["Quyosh soyasi —", ["Parallel proyeksiya", "Markaziy", "Ortogonal har doim", "Aksonometriya emas"], "Parallel rays."]],
      [{ type: "solid", kind: "cube" }])
  ]);

  Y("10", "geometriya", "III chorak", [
    T("perpendikulyar-fazo", "Fazoda perpendikulyar to‘g‘ri chiziqlar va tekisliklar", "Chiziq ⊥ tekislik alomati",
      "Elektr ustuni yerga perpendikulyar bo‘lishi kerak, aks holda qulaydi. Uni tekshirish uchun ikki yo‘nalishda go‘niya qo‘yish kifoya.",
      "<p><b>Perpendikulyar chiziqlar</b> (fazoda) — orasidagi burchak 90° (kesishuvchi yoki ayqash).</p><p><b>To‘g‘ri chiziq tekislikka perpendikulyar</b> — tekislikdagi <b>har qanday</b> chiziqqa perpendikulyar bo‘lsa.</p><p><b>Alomat</b>: chiziq tekislikdagi <b>ikki kesishuvchi</b> chiziqqa perpendikulyar bo‘lsa — u tekislikka perpendikulyar.</p><p><b>Xossalar</b>: bir tekislikka perpendikulyar ikki chiziq parallel; ikki parallel chiziqdan biri tekislikka ⊥ bo‘lsa, ikkinchisi ham.</p><p>Kubda: AA₁ ⊥ (ABCD), chunki AA₁ ⊥ AB va AA₁ ⊥ AD.</p>",
      "Ikki kesishuvchi chiziqqa ⊥ ⇒ tekislikka ⊥.",
      [["Ustun tik turganini qanday tekshirish mumkin?", ["Ikki turli yo‘nalishda go‘niya"], "Ikki kesishuvchi chiziqqa ⊥"], ["Kubda AA₁ va BD?", ["AA₁ ⊥ (ABCD), BD shu tekislikda"], "Perpendikulyar"]],
      [["Alomat uchun nechta chiziqqa ⊥ kerak?", ["Ikki kesishuvchi", "Bitta", "Uch", "Barchasi tekshiriladi"], "Two."], ["Bir tekislikka ⊥ ikki chiziq:", ["Parallel", "Ayqash", "Kesishadi", "Perpendikulyar"], "Parallel."], ["Kubda AA₁ ⊥", ["(ABCD)", "(AA₁B₁B)", "AB₁", "A₁B₁ emas"], "Base."]],
      [{ type: "cubeEdges" }]),

    T("ogma-masofa", "Fazoda perpendikulyar, og‘ma va masofa", "Og‘ma, proyeksiya, Pifagor",
      "Bayroq ustuni va uni ushlab turgan troslar: ustun — perpendikulyar, tros — og‘ma, yerdagi masofa — proyeksiya. Ular orasidagi bog‘lanish — Pifagor teoremasi.",
      "<p>A nuqtadan α tekislikka: <b>perpendikulyar</b> AH (H — asos), <b>og‘ma</b> AM, <b>og‘maning proyeksiyasi</b> HM.</p><p>AM² = AH² + HM².</p><ul><li>Perpendikulyar — har qanday og‘madan <b>qisqa</b>;</li><li>Teng og‘malar — teng proyeksiyalarga ega va aksincha;</li><li>Katta proyeksiyali og‘ma uzunroq.</li></ul><p><b>Nuqtadan tekislikkacha masofa</b> — perpendikulyar uzunligi.</p><p><b>Og‘ma va tekislik orasidagi burchak</b> — og‘ma va uning proyeksiyasi orasidagi burchak: sin φ = AH/AM.</p>",
      "Og‘ma² = perpendikulyar² + proyeksiya².",
      [["Perpendikulyar 6, og‘ma 10. Proyeksiya?", ["√(100 − 36)"], "8"], ["Og‘ma 12, tekislik bilan 30°. Nuqtadan tekislikkacha masofa?", ["12·sin 30°"], "6"]],
      [["Eng qisqa kesma:", ["Perpendikulyar", "Og‘ma", "Proyeksiya", "Diagonal"], "Shortest."], ["Perpendikulyar 5, proyeksiya 12, og‘ma:", ["13", "17", "7", "√119"], "Pythagoras."], ["Teng og‘malarning proyeksiyalari:", ["Teng", "Har xil", "Perpendikulyar", "Nol"], "Equal."]],
      [{ type: "triCalc" }]),

    T("uch-perpendikulyar", "Uch perpendikulyarlar haqidagi teorema", "TTP va teskarisi",
      "Tom qiyaligiga perpendikulyar bo‘lgan nov… Uch perpendikulyar teoremasi fazodagi perpendikulyarlikni tekislikdagi perpendikulyarlikka keltiradi.",
      "<p><b>Teorema (TTP)</b>: tekislikda og‘maning asosi orqali o‘tkazilgan to‘g‘ri chiziq og‘maning <b>proyeksiyasiga perpendikulyar</b> bo‘lsa, u <b>og‘maning o‘ziga ham perpendikulyar</b>.</p><p><b>Teskari teorema</b>: og‘maga perpendikulyar bo‘lsa — proyeksiyasiga ham perpendikulyar.</p><p>“Uch perpendikulyar”: AH ⊥ α, HM ⊥ a ⇒ AM ⊥ a.</p><p>Qo‘llanish: nuqtadan to‘g‘ri chiziqqacha masofa (fazoda), ikki yoqli burchakning chiziqli burchagini yasash.</p><p>Misol: kvadrat ABCD, SA ⊥ (ABCD). SB ⊥ BC, chunki AB ⊥ BC (proyeksiya ⊥).</p>",
      "Proyeksiyaga ⊥ ⟺ og‘maga ⊥.",
      [["ABCD kvadrat, SA ⊥ (ABCD), SA = AB = a. S dan CD gacha masofa?", ["TTP: SD ⊥ CD", "SD = √(a² + a²)"], "a√2"], ["To‘g‘ri burchakli △ABC (∠C = 90°), MA ⊥ (ABC). MC va BC?", ["AC ⊥ BC, AC — MC proyeksiyasi"], "MC ⊥ BC"]],
      [["TTP da “uch perpendikulyar”:", ["Perpendikulyar, proyeksiyaga ⊥, og‘maga ⊥", "Uch tekislik", "Uch qirra", "Uch burchak"], "Three."], ["Proyeksiyaga ⊥ chiziq og‘maga:", ["Ham ⊥", "Parallel", "Ayqash", "Bog‘liqsiz"], "TTP."], ["TTP qo‘llanilishi:", ["Fazoda masofa topish", "Hajm", "Integral", "Ehtimol"], "Distance."]],
      [{ type: "cubeEdges" }]),

    T("tekislik-perp", "Fazoda tekisliklarning perpendikulyarligi", "Ikki yoqli burchak, alomat",
      "Devor polga perpendikulyar, kitob sahifalari ochilganda ikki yoqli burchak hosil qiladi. Tekisliklar orasidagi burchak shunday o‘lchanadi.",
      "<p><b>Ikki yoqli burchak</b> — umumiy qirraga ega ikki yarim tekislikdan iborat shakl. Uning o‘lchovi — <b>chiziqli burchak</b>: qirraning bir nuqtasidan har bir yoqda qirraga perpendikulyar nurlar orasidagi burchak.</p><p><b>Perpendikulyar tekisliklar</b> — orasidagi burchak 90°.</p><p><b>Alomat</b>: agar tekislik ikkinchi tekislikka <b>perpendikulyar to‘g‘ri chiziq orqali</b> o‘tsa, ular perpendikulyar.</p><p><b>Xossa</b>: perpendikulyar tekisliklardan birida yotib, kesishish chizig‘iga ⊥ bo‘lgan chiziq — ikkinchi tekislikka ⊥.</p>",
      "Tekislik ⊥ chiziq orqali o‘tsa ⇒ tekisliklar ⊥.",
      [["Kubda (AA₁B₁B) va (ABCD) orasidagi burchak?", ["AA₁ ⊥ (ABCD), AA₁ birinchi tekislikda"], "90°"], ["Kubda (ABCD) va (A₁BCD₁) orasidagi burchak?", ["Chiziqli burchak ∠A₁BA", "tg = 1"], "45°"]],
      [["Ikki yoqli burchak o‘lchovi:", ["Chiziqli burchak", "Qirra uzunligi", "Yuza", "Hajm"], "Linear angle."], ["Devor va pol:", ["Perpendikulyar", "Parallel", "Ayqash", "45°"], "Perp."], ["Alomat: tekislik o‘tadi", ["Ikkinchisiga ⊥ chiziq orqali", "Parallel chiziq orqali", "Nuqta orqali", "Qirra orqali"], "Perp line."]],
      [{ type: "solid", kind: "cube" }]),

    T("ortogonal-proyeksiya", "Fazoda ortogonal proyeksiya va undan texnikada foydalanish", "Chizmachilik: uch ko‘rinish; S_proy = S·cos φ",
      "Har bir detal chizmasi uchta ko‘rinishdan iborat: old, ust va yon. Bu ortogonal proyeksiyalar — muhandislik tili.",
      "<p><b>Ortogonal proyeksiya</b> — proyeksiyalovchi chiziqlar tekislikka <b>perpendikulyar</b> bo‘lgan parallel proyeksiya.</p><p><b>Yuzalar formulasi</b>: tekis shakl proyeksiyasining yuzi:</p><div class='fb'>S_proy = S · cos φ</div><p>(φ — shakl tekisligi va proyeksiya tekisligi orasidagi burchak).</p><p><b>Texnikada</b>: chizmachilikda <b>uch proyeksiya</b> — <b>old ko‘rinish</b> (frontal), <b>ustdan ko‘rinish</b> (gorizontal), <b>yondan ko‘rinish</b> (profil); CAD dasturlarida 3D modeldan avtomatik chizmalar; arxitektura rejalari, fasadlar.</p>",
      "S_proy = S·cos φ.",
      [["Yuzasi 20 sm² bo‘lgan uchburchak tekislik bilan 60° burchak hosil qiladi. Proyeksiya yuzi?", ["20·cos 60°"], "10 sm²"], ["Silindrning ustdan ko‘rinishi?", ["Asos tekisligiga proyeksiya"], "Doira"]],
      [["Ortogonal proyeksiyada nurlar:", ["Tekislikka perpendikulyar", "Har xil yo‘nalishda", "Bir nuqtadan", "Parallel emas"], "Orthogonal."], ["S = 40, φ = 0°, S_proy =", ["40", "0", "20", "40√2"], "cos 0 = 1."], ["Chizmachilikdagi ko‘rinishlar soni (asosiy):", ["3", "1", "2", "6"], "Three views."]],
      [{ type: "solid", kind: "cylinder" }, { type: "solid", kind: "prism" }]),

    T("loyiha-10g", "Loyiha ishi taqdimoti", "Stereometrik model yoki tadqiqot",
      "Loyiha: o‘z qo‘lingiz bilan ko‘pyoq modeli, maktab binosining 3D eskizi yoki ko‘prik maketini yasab, uning geometriyasini tushuntiring.",
      "<p><b>Loyiha mavzulari</b> (namuna):</p><ul><li>Platon jismlari modellari va Eyler formulasi;</li><li>Maktab sinfxonasining stereometrik modeli: devorlar, deraza, eshik — parallellik va perpendikulyarlik;</li><li>Kub kesimlari: uchburchakdan oltiburchakkacha;</li><li>Uch proyeksiyali chizma va 3D model (CAD dasturida).</li></ul><p><b>Taqdimot rejasi</b>: maqsad → nazariya → yasash jarayoni (fotolar) → hisob-kitoblar → xulosa.</p>",
      "Model + nazariya + hisob = loyiha.",
      [["Ikosaedr uchun Eyler formulasini tekshiring (Y = 20, U = 12).", ["Q = 30"], "12 − 30 + 20 = 2 ✓"], ["Sinf 8×6×3 m. Devorlar yuzasi (eshik-derazasiz)?", ["2(8 + 6)·3"], "84 m²"]],
      [["Loyihada albatta bo‘lishi kerak:", ["Hisob-kitob va xulosa", "Faqat rasm", "Faqat matn", "Musiqa"], "Analysis."], ["Dodekaedr yoqlari:", ["12 ta beshburchak", "20 ta uchburchak", "6 ta kvadrat", "8 ta uchburchak"], "Dodeca."], ["3D model dasturi:", ["CAD", "Excel", "Audacity", "Word"], "Design."]],
      [{ type: "solid", kind: "pyramid" }])
  ]);
})();
