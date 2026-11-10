/* 11-sinf Kimyo (umumiy kimyo) — yillik reja (haftasiga 2 soat, 68 soat). Takroriy darslar birlashtirilgan, nazorat ishlari kiritilmagan;
   “masalalar yechish” darslari tegishli mavzuning ishlangan misollariga kiritilgan. */
(() => {
  window.AMALIY_SUBJ("11", "11-sinf", "kimyo", "Kimyo", "⚗️", "#a855f7", "Yillik reja · 4 chorak");
  const Y = window.AMALIY_YEAR;

  Y("11", "kimyo", "I chorak", [
    ["atom11", "Atom tuzilishi. Kvant sonlar va elektron konfiguratsiya", "n, l, mₗ, mₛ; Pauli, Xund, Klechkovskiy",
      "Lazerlar, LED chiroqlar, MRT — barchasi elektronlarning energetik holatlari haqidagi kvant nazariyasiga asoslangan.",
      "<p>Elektron holati 4 ta <b>kvant son</b> bilan tavsiflanadi:</p><ul><li><b>n</b> — bosh kvant son (qavat, energiya): 1, 2, 3...;</li><li><b>l</b> — orbital kvant son (pog‘onacha shakli): 0 (s), 1 (p), 2 (d), 3 (f); l = 0 … n−1;</li><li><b>mₗ</b> — magnit kvant son (orbital yo‘nalishi): −l … +l (s — 1, p — 3, d — 5, f — 7 orbital);</li><li><b>mₛ</b> — spin: +½ yoki −½.</li></ul><p><b>Pauli prinsipi:</b> atomda 4 ta kvant soni bir xil ikki elektron bo‘lmaydi (orbitalda ≤ 2 e⁻). <b>Xund qoidasi:</b> pog‘onacha orbitallari avval bittadan, bir xil spin bilan to‘ladi. <b>Klechkovskiy:</b> (n + l) yig‘indisi kichik pog‘onacha avval to‘ladi; teng bo‘lsa — n kichigi.</p><p>Qavatdagi elektronlar: 2n²; orbitallar: n².</p><p>Misol: Fe (26): 1s²2s²2p⁶3s²3p⁶4s²3d⁶; Fe³⁺: …3d⁵.</p>",
      "Orbitalda ≤ 2 e⁻; (n + l) kichigi avval to‘ladi.",
      [["3d pog‘onacha uchun n, l va orbitallar soni?", ["n = 3, l = 2", "mₗ: −2 … +2"], "5 orbital, 10 e⁻ gacha"], ["Mn²⁺ (Z = 25) da nechta toq elektron?", ["Mn: …4s²3d⁵ → Mn²⁺: …3d⁵", "Xund: 5 ta toq"], "5 ta"]],
      [["l = 1 pog‘onacha:", ["p", "s", "d", "f"], "Orbital kvant son."], ["4-qavatdagi maksimal elektronlar:", ["32", "18", "8", "16"], "2·4²."], ["Avval to‘ladi:", ["4s (n + l = 4)", "3d (n + l = 5)", "4p", "4d"], "Klechkovskiy."], ["Bir orbitaldagi ikki elektron farqi:", ["Spin", "n", "l", "mₗ"], "Pauli."]]],

    ["davriy11", "Davriy qonun. D.I. Mendeleyevning davriy sistemasi", "s-, p-, d-, f-bloklar, davriy xossalar",
      "Ionlanish energiyasi, elektromanfiylik, atom radiusi — davriy jadvaldagi joyga qarab bu kattaliklarni hisob-kitobsiz taxmin qilish mumkin.",
      "<p><b>Bloklar:</b> s (IA–IIA, He), p (IIIA–VIIIA), d (B guruhchalar), f (lantanoid va aktinoidlar).</p><p><b>Davriy o‘zgaruvchi xossalar:</b></p><ul><li><b>atom radiusi</b>: davrda ←, guruhda ↓ ortadi;</li><li><b>ionlanish energiyasi</b> (elektron uzish uchun): davrda → ortadi, guruhda ↓ kamayadi; eng katta — He, eng kichik — Cs;</li><li><b>elektronga moyillik</b> va <b>elektromanfiylik</b>: davrda → ortadi, guruhda ↓ kamayadi (F — eng yuqori);</li><li>metallik: davrda ← va guruhda ↓ kuchayadi.</li></ul><p>Asosiy guruhcha elementlari uchun: valent elektronlar = guruh raqami; d-elementlarda valent — ns va (n−1)d elektronlar.</p>",
      "Davrda → radius↓, EM↑, IE↑; guruhda ↓ aksincha.",
      [["Na, Mg, Al — ionlanish energiyasi o‘sish tartibida?", ["Davrda o‘ngga ortadi (Mg/Al istisnosi bor: Mg ning 3s² to‘liq)"], "Na < Al < Mg"], ["Qaysi biri katta: Na⁺ yoki Ne radiusi?", ["Izoelektron: ikkalasida 10 e⁻", "Na⁺ da yadro zaryadi kattaroq"], "Ne katta"]],
      [["Eng kichik ionlanish energiyasi:", ["Cs", "F", "He", "Li"], "Guruhda pastda, davr boshida."], ["d-elementlar joylashgan:", ["B guruhchalarda", "A guruhchalarda", "Faqat 2-davrda", "Lantanoidlarda"], "O‘tish metallari."], ["Davrda o‘ngga EM:", ["Ortadi", "Kamayadi", "O‘zgarmaydi", "Avval kamayadi"], "Metallmaslik."]]],

    ["yadro11", "Atom tarkibi. Yadro reaksiyalari", "α, β, γ; yarim yemirilish davri",
      "Atom elektr stansiyalarida uran yadrolari bo‘linib, ulkan energiya beradi; tibbiyotda radioaktiv yod qalqonsimon bezni davolaydi.",
      "<p><b>Radioaktivlik</b> — yadrolarning o‘z-o‘zidan nurlanib boshqa yadrolarga aylanishi (Bekkerel, Kyuri).</p><ul><li><b>α-yemirilish</b>: ⁴₂He ajraladi → A − 4, Z − 2: ²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He;</li><li><b>β⁻-yemirilish</b>: elektron ajraladi (n → p + e⁻) → A o‘zgarmaydi, Z + 1: ¹⁴₆C → ¹⁴₇N + e⁻;</li><li><b>γ-nurlanish</b> — yuqori energiyali fotonlar; A va Z o‘zgarmaydi.</li></ul><p><b>Yadro reaksiyalarida</b> massa sonlari va zaryadlar yig‘indisi saqlanadi: ¹⁴₇N + ⁴₂He → ¹⁷₈O + ¹₁H (Rezerford, 1919).</p><p><b>Yarim yemirilish davri (T½)</b> — radioaktiv yadrolarning yarmi parchalanadigan vaqt: m = m₀ · (½)^(t/T½).</p><p>Bo‘linish (²³⁵U) — AES; sintez (H → He) — Quyosh energiyasi.</p>",
      "α: A − 4, Z − 2; β⁻: Z + 1; m = m₀·(½)^(t/T½).",
      [["²³⁸U → ²⁰⁶Pb. Nechta α va β yemirilish?", ["A: 238 − 206 = 32 → 8α", "Z: 92 − 8·2 = 76; 82 − 76 = 6 → 6β"], "8 α va 6 β"], ["T½ = 8 kun. 80 mg izotopdan 24 kunda qancha qoladi?", ["24/8 = 3 davr", "80 · (½)³"], "10 mg"]],
      [["α-zarracha:", ["⁴₂He yadrosi", "Elektron", "Proton", "Foton"], "Geliy."], ["β⁻-yemirilishda Z:", ["1 ga ortadi", "2 ga kamayadi", "O‘zgarmaydi", "1 ga kamayadi"], "n → p + e⁻."], ["2 T½ dan keyin qoladi:", ["1/4", "1/2", "1/8", "0"], "(½)²."]]],

    ["boglanish11", "Kimyoviy bog‘lanish turlari. Kristall panjaralar. Ion va kovalent birikmalar xossalari", "σ, π, gibridlanish, qutblilik",
      "Bog‘ turi va panjara — moddaning “xarakteri”: u qattiqmi, eriydimi, tok o‘tkazadimi — hammasini belgilaydi.",
      "<p><b>Kovalent bog‘ xususiyatlari:</b> uzunlik, energiya, yo‘naluvchanlik, to‘yinuvchanlik, qutblilik; σ- va π-bog‘lar; <b>gibridlanish</b> (sp — 180°, sp² — 120°, sp³ — 109,5°) molekula shaklini belgilaydi: BeCl₂ — chiziqli, BF₃ — tekis, CH₄ — tetraedr, NH₃ — piramida (107°), H₂O — burchakli (104,5°).</p><p><b>Ionli bog‘</b> — yo‘nalmagan va to‘yinmagan; <b>metall bog‘</b> — elektron gaz; <b>vodorod bog‘</b> — molekulalararo (H₂O, HF, NH₃, oqsillar, DNK).</p><p><b>Kristall panjaralar:</b> ionli (NaCl), atomli (olmos, SiO₂), molekulyar (I₂, CO₂, muz), metall (Cu, Fe).</p><p><b>Amaliy mashg‘ulot:</b> NaCl (ionli) va shakar (kovalent) xossalarini solishtirish: suvda erishi, eritmaning tok o‘tkazishi, qizdirilganda o‘zgarishi.</p>",
      "Shakl — gibridlanishga, xossa — panjaraga bog‘liq.",
      [["Nega CO₂ chiziqli, H₂O esa burchakli?", ["CO₂: C sp, bo‘linmagan jufti yo‘q", "H₂O: O da 2 ta bo‘linmagan juft — burchak 104,5°"], "Bo‘linmagan elektron juftlari"], ["NaCl va shakarni eritma tok o‘tkazishi bo‘yicha solishtiring.", ["NaCl — ionlar, tok o‘tkazadi", "Shakar — molekulalar, o‘tkazmaydi"], "Faqat NaCl eritmasi"]],
      [["NH₃ molekula shakli:", ["Trigonal piramida", "Tekis uchburchak", "Chiziqli", "Tetraedr"], "Bitta bo‘linmagan juft."], ["Atomli panjara:", ["SiO₂", "CO₂", "NaCl", "I₂"], "Kovalent tarmoq."], ["Vodorod bog‘ bor:", ["HF", "CH₄", "H₂", "NaCl"], "F–H...F."]]],

    ["mol11", "Modda miqdori. Mavzuga doir masalalar", "n, M, Nₐ, Vm",
      "Kimyoviy masalalarning 90% i “mol” tushunchasi orqali yechiladi — u massa, hajm va zarrachalar sonini bog‘lovchi ko‘prik.",
      "<p><b>Asosiy bog‘lanishlar:</b></p><p>n = m / M = N / Nₐ = V / Vm (gaz, n.sh.)</p><p>Nₐ = 6,02·10²³ mol⁻¹; Vm = 22,4 L/mol (n.sh.).</p><p><b>Reaksiya tenglamasi bo‘yicha hisoblash algoritmi:</b></p><ol><li>tenglamani yozing va tenglang;</li><li>berilgan moddaning n ini toping;</li><li>koeffitsientlar nisbati bo‘yicha izlanayotgan modda n ini toping;</li><li>kerakli kattalikka (m, V, N) o‘tkazing.</li></ol><p><b>Ortiqcha va kam:</b> ikki modda miqdori berilsa, hisob <b>kam</b> (to‘liq sarflanadigan) modda bo‘yicha olib boriladi.</p><p><b>Unum:</b> η = m(amaliy)/m(nazariy). <b>Aralashmalar:</b> sof modda = umumiy · ω.</p>",
      "Hisob — kam olingan modda bo‘yicha.",
      [["5,4 g Al va 14,6 g HCl reaksiyaga kirdi. Necha L H₂ (n.sh.)?", ["n(Al) = 0,2; n(HCl) = 0,4", "2Al + 6HCl: 0,2 Al uchun 0,6 HCl kerak — HCl kam", "n(H₂) = 0,4/2 = 0,2 mol → 4,48 L"], "4,48 L"], ["Nechta atom bor: 0,5 mol H₂SO₄ da?", ["1 molekulada 7 atom", "0,5 · 7 · 6,02·10²³"], "≈ 2,1·10²⁴"]],
      [["3,01·10²³ ta CO₂ molekulasi massasi:", ["22 g", "44 g", "11 g", "88 g"], "0,5 mol."], ["Reaksiyada hisob olib boriladi:", ["Kam olingan modda bo‘yicha", "Ortiqcha bo‘yicha", "Ikkalasining yig‘indisi", "Mahsulot bo‘yicha"], "To‘liq sarflanadigan."], ["11,2 L O₂ (n.sh.) massasi:", ["16 g", "32 g", "8 g", "64 g"], "0,5 mol."]]],

    ["avogadro11", "Avogadro qonuni. Gazlar aralashmasi", "hajmiy va mol ulush, o‘rtacha M",
      "Havo, tabiiy gaz, yonish mahsulotlari — gazlar ko‘pincha aralashma holida bo‘ladi. Ularni hisoblashda hajmiy ulush va o‘rtacha molyar massa kerak.",
      "<p><b>Avogadro qonuni:</b> bir xil sharoitda teng hajmli gazlarda molekulalar soni teng. Gazlar uchun hajmiy ulush = mol ulush: <b>φ = V(gaz)/V(aralashma) = χ</b>.</p><p><b>O‘rtacha molyar massa:</b> M(o‘rt) = Σ Mᵢ · φᵢ = m(aralashma) / n(aralashma).</p><p><b>Nisbiy zichlik:</b> D = M₁ / M₂; M = 29·D(havo) = 2·D(H₂).</p><p><b>Gey-Lyussak hajmiy nisbatlar qonuni:</b> reaksiyadagi gazlar hajmlari koeffitsientlar kabi kichik butun sonlar nisbatida.</p>",
      "M(o‘rt) = Σ Mᵢ φᵢ.",
      [["Aralashma: 40% H₂ va 60% O₂ (hajm). M(o‘rt) va D(H₂)?", ["0,4·2 + 0,6·32 = 0,8 + 19,2 = 20", "D = 20/2"], "M = 20; D(H₂) = 10"], ["N₂ va CO₂ aralashmasining D(H₂) = 18. Hajmiy ulushlar?", ["28x + 44(1 − x) = 36", "16x = 8 → x = 0,5"], "50% N₂, 50% CO₂"]],
      [["Gazlar uchun hajmiy ulush teng:", ["Mol ulushga", "Massa ulushga", "Zichlikka", "Bosimga"], "Avogadro."], ["Havoning o‘rtacha M:", ["29", "32", "28", "22,4"], "N₂ + O₂ + Ar."], ["D(havo) = 1,52 gaz:", ["CO₂", "O₂", "N₂", "CH₄"], "29 · 1,52 ≈ 44."]]],

    ["ekvivalent11", "Ekvivalent. Ekvivalentlar qonuni", "Mₑ = M / z",
      "Ekvivalent tushunchasi titrlash — laboratoriya tahlilining eng aniq usullaridan birining asosi.",
      "<p><b>Ekvivalent</b> — bitta H⁺ yoki bitta elektronga ekvivalent bo‘lgan real yoki shartli zarracha. <b>Ekvivalent molyar massa</b> Mₑ = M / z.</p><ul><li>element: z = valentlik (Mₑ(Al) = 9);</li><li>kislota: z = almashinadigan H⁺ soni (Mₑ(H₂SO₄) = 49);</li><li>asos: z = OH⁻ soni (Mₑ(Ca(OH)₂) = 37);</li><li>tuz: z = kation zaryadi × soni (Mₑ(Al₂(SO₄)₃) = 57);</li><li>oksid: z = element valentligi × atomlar soni.</li></ul><p><b>Ekvivalentlar qonuni:</b> m₁/Mₑ₁ = m₂/Mₑ₂; gazlar uchun ekvivalent hajm: Vₑ(H₂) = 11,2 L, Vₑ(O₂) = 5,6 L.</p><p>z reaksiyaga bog‘liq: H₃PO₄ + NaOH → NaH₂PO₄ da z = 1.</p>",
      "m₁ / Mₑ₁ = m₂ / Mₑ₂.",
      [["3 g metall kislotadan 2,8 L H₂ (n.sh.) siqib chiqardi. Mₑ(metall)?", ["Vₑ(H₂) = 11,2 L", "3 / Mₑ = 2,8 / 11,2"], "Mₑ = 12 (Mg)"], ["Mₑ(Fe₂(SO₄)₃) ni toping.", ["M = 400", "z = 3 · 2 = 6"], "≈ 66,7 g/mol"]],
      [["Mₑ(H₂SO₄) (to‘liq neytrallash):", ["49", "98", "32,7", "24,5"], "z = 2."], ["Kislorodning ekvivalent hajmi:", ["5,6 L", "11,2 L", "22,4 L", "2,8 L"], "Vm/4."], ["Mₑ(Ca):", ["20", "40", "10", "80"], "40/2."]]],

    ["klapeyron", "Mendeleyev–Klapeyron tenglamasi", "pV = nRT",
      "Avtomobil shinasi yozda qiziganda bosimi ortadi, gaz ballonini olovga yaqin qo‘yish xavfli — bularning hammasini bitta tenglama tushuntiradi.",
      "<p><b>Ideal gaz holat tenglamasi:</b> <b>pV = nRT = (m/M)RT</b>.</p><ul><li>p — bosim (kPa), V — hajm (L), T — absolyut harorat (K = °C + 273);</li><li>R = 8,314 J/(mol·K) (kPa·L uchun ham 8,314).</li></ul><p>Bundan: M = mRT / (pV); ρ = pM / (RT).</p><p><b>Birlashgan gaz qonuni:</b> p₁V₁/T₁ = p₂V₂/T₂ — gaz hajmini normal sharoitga keltirish: V₀ = pVT₀ / (p₀T), p₀ = 101,3 kPa, T₀ = 273 K.</p><p>Xususiy hollar: T = const — Boyl-Mariott (pV = const); p = const — Gey-Lyussak (V/T = const); V = const — Sharl (p/T = const).</p>",
      "pV = nRT; T = t + 273.",
      [["27 °C va 150 kPa da 8,314 L kislorod massasi?", ["n = pV/RT = 150·8,314 / (8,314·300)", "n = 0,5 mol", "m = 16 g"], "16 g"], ["20 °C va 98 kPa da 2,46 L gaz massasi 4,4 g. M?", ["M = mRT/pV = 4,4·8,314·293 / (98·2,46)"], "≈ 44 g/mol"]],
      [["R qiymati:", ["8,314 J/(mol·K)", "22,4", "6,02·10²³", "101,3"], "Universal gaz doimiysi."], ["27 °C = ? K", ["300", "246", "273", "327"], "+273."], ["T const da p ikki marta ortsa V:", ["2 marta kamayadi", "2 marta ortadi", "O‘zgarmaydi", "4 marta ortadi"], "Boyl-Mariott."]]],
  ]);

  Y("11", "kimyo", "II chorak", [
    ["elektrolit11", "Kuchli va kuchsiz elektrolitlar", "α, dissotsiatsiya konstantasi",
      "Me’da shirasidagi HCl va sirka — ikkalasi kislota, lekin biri “kuchli”, ikkinchisi “kuchsiz”. Bu farq dori va oziq-ovqat kimyosida juda muhim.",
      "<p><b>Kuchli elektrolitlar</b> (α ≈ 1): tuzlarning ko‘pchiligi; HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄; ishqorlar (IA metallar, Ca, Sr, Ba gidroksidlari). Tenglamada → bilan.</p><p><b>Kuchsiz elektrolitlar</b> (α ≪ 1): H₂O, HF, H₂S, H₂CO₃, H₂SO₃, H₃PO₄ (o‘rtacha), HNO₂, CH₃COOH; NH₃·H₂O; erimaydigan asoslar. Tenglamada ⇄ bilan.</p><p><b>Dissotsiatsiya konstantasi</b> (kuchsiz kislota HA ⇄ H⁺ + A⁻): K = [H⁺][A⁻]/[HA].</p><p><b>Ostvald suyultirish qonuni:</b> K ≈ α²c → α = √(K/c): suyultirilsa α ortadi.</p><p>Ko‘p negizli kuchsiz kislotalar bosqichli dissotsiatsiyalanadi, K₁ ≫ K₂ ≫ K₃.</p>",
      "α = √(K/c) — suyultirish α ni oshiradi.",
      [["CH₃COOH uchun K = 1,8·10⁻⁵, c = 0,1 M. α va [H⁺]?", ["α = √(1,8·10⁻⁵/0,1) = √1,8·10⁻⁴ ≈ 0,0134", "[H⁺] = αc ≈ 1,34·10⁻³ M"], "α ≈ 1,34%"], ["Eritma 100 marta suyultirilsa, kuchsiz kislota α si necha marta ortadi?", ["α ~ 1/√c", "√100"], "10 marta"]],
      [["Kuchsiz elektrolit:", ["HF", "HCl", "HI", "HBr"], "Vodorod bog‘ tufayli."], ["Kuchli asos:", ["Ba(OH)₂", "NH₄OH", "Fe(OH)₃", "Cu(OH)₂"], "Ishqor."], ["Ostvald qonuni bo‘yicha c ↓ →", ["α ↑", "α ↓", "α = 0", "α o‘zgarmaydi"], "√(K/c)."]]],

    ["ionli11", "Dissotsiatsiyalanish darajasi. Qisqa va to‘liq ionli tenglamalar", "α ni hisoblash, ion tenglamalar",
      "Dissotsiatsiya darajasini bilib, eritmadagi ionlar sonini va reaksiya imkoniyatini oldindan hisoblash mumkin.",
      "<p><b>α = n(dissotsiatsiyalangan) / n(umumiy)</b>. Eritmadagi zarrachalar umumiy soni: N = N₀(1 − α) + N₀·α·k (k — bitta molekuladan hosil bo‘ladigan ionlar soni).</p><p><b>Ionli tenglamalar tuzish:</b></p><ol><li>molekulyar tenglama;</li><li>to‘liq ionli: kuchli elektrolitlar — ionlar, cho‘kma (↓), gaz (↑), kuchsiz elektrolit — molekula;</li><li>qisqa ionli: ikkala tomondagi bir xil ionlarni qisqartirish.</li></ol><p>Misol: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑<br>2Na⁺ + CO₃²⁻ + 2H⁺ + 2Cl⁻ → 2Na⁺ + 2Cl⁻ + H₂O + CO₂↑<br><b>CO₃²⁻ + 2H⁺ → H₂O + CO₂↑</b></p><p>Qisqa tenglama bir nechta molekulyar tenglamaga mos kelishi mumkin.</p>",
      "Faqat o‘zgargan ionlar qisqa tenglamada qoladi.",
      [["1 L eritmada 0,2 mol HF, α = 10%. Zarrachalar umumiy soni (mol)?", ["Dissots.: 0,02 mol → 0,02 H⁺ + 0,02 F⁻", "Qolgan HF: 0,18", "Jami: 0,18 + 0,04"], "0,22 mol"], ["Fe³⁺ + 3OH⁻ → Fe(OH)₃↓ ga mos molekulyar tenglama?", ["Eriydigan Fe(III) tuzi + ishqor"], "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl"]],
      [["Ionlar holida yoziladi:", ["NaNO₃", "BaSO₄", "H₂O", "CO₂"], "Kuchli, eriydigan."], ["Ba²⁺ + SO₄²⁻ → BaSO₄↓ ga mos:", ["BaCl₂ + K₂SO₄", "BaCO₃ + H₂SO₄", "Ba + H₂SO₄", "BaO + SO₃"], "Eriydigan tuzlar."], ["α = 0,25 bo‘lsa 100 molekuladan dissotsiatsiyalangan:", ["25", "75", "4", "250"], "25%."]]],

    ["gidroliz11", "Tuzlarning gidrolizi va eritma muhiti", "pH, Kw",
      "Tuproq pH i o‘simlik hosilini belgilaydi: sho‘rlangan, ishqoriy tuproqda ko‘p ekinlar o‘smaydi. pH — kimyoning “barometri”.",
      "<p><b>Suvning ion ko‘paytmasi:</b> Kw = [H⁺][OH⁻] = 10⁻¹⁴ (25 °C).</p><p><b>pH = −lg[H⁺]</b>; pOH = −lg[OH⁻]; pH + pOH = 14.</p><p>pH < 7 — kislotali, = 7 — neytral, > 7 — ishqoriy.</p><p><b>Gidroliz turlari:</b></p><ul><li>kuchsiz kislota anioni bo‘yicha (Na₂CO₃, CH₃COONa, K₂S) → pH > 7: CH₃COO⁻ + H₂O ⇄ CH₃COOH + OH⁻;</li><li>kuchsiz asos kationi bo‘yicha (NH₄Cl, CuSO₄, AlCl₃) → pH < 7: NH₄⁺ + H₂O ⇄ NH₃·H₂O + H⁺;</li><li>ikkalasi bo‘yicha (to‘liq, qaytmas): Al₂S₃ + 6H₂O → 2Al(OH)₃↓ + 3H₂S↑; Al³⁺ va CO₃²⁻ eritmada birga mavjud bo‘lmaydi;</li><li>kuchli asos + kuchli kislota tuzlari gidrolizlanmaydi.</li></ul><p>Gidrolizni kuchaytiradi: qizdirish, suyultirish; susaytiradi: hosil bo‘ladigan ion (H⁺ yoki OH⁻) qo‘shish.</p>",
      "pH = −lg[H⁺]; pH + pOH = 14.",
      [["0,01 M HCl eritmasi pH i?", ["[H⁺] = 10⁻² M", "pH = 2"], "2"], ["0,001 M NaOH eritmasi pH i?", ["[OH⁻] = 10⁻³ → pOH = 3", "pH = 14 − 3"], "11"]],
      [["pH = 3 eritma:", ["Kislotali", "Ishqoriy", "Neytral", "Muhitsiz"], "< 7."], ["Kw (25 °C):", ["10⁻¹⁴", "10⁻⁷", "10⁷", "14"], "Suvning ion ko‘paytmasi."], ["To‘liq gidrolizlanadi:", ["Al₂S₃", "NaCl", "K₂SO₄", "KNO₃"], "Kuchsiz + kuchsiz."], ["NH₄Cl eritmasi pH:", ["< 7", "> 7", "= 7", "= 14"], "Kation gidrolizi."]]],

    ["eritma", "Eritma haqida tushuncha", "erituvchi, erigan modda, gidratlar",
      "Dengiz suvi, qon plazmasi, choy, dorilar, havo — hammasi eritmalar. Kimyoviy reaksiyalarning aksariyati ham eritmalarda boradi.",
      "<p><b>Eritma</b> — ikki yoki undan ortiq komponentdan iborat bir jinsli (gomogen) sistema: <b>erituvchi</b> + <b>erigan modda(lar)</b>.</p><p><b>Turlari:</b> holatiga ko‘ra — suyuq (tuzli suv), qattiq (qotishmalar), gaz (havo); erigan modda miqdoriga ko‘ra — suyultirilgan va konsentrlangan; to‘yinmagan, to‘yingan, o‘ta to‘yingan.</p><p><b>Erish — fizik-kimyoviy jarayon</b> (Mendeleyev gidrat nazariyasi): kristall panjara buziladi (energiya yutiladi) va zarrachalar erituvchi bilan solvatlanadi/gidratlanadi (energiya ajraladi). Shuning uchun erish issiqlik chiqarishi (H₂SO₄, NaOH) yoki yutishi (NH₄NO₃) mumkin.</p><p><b>Kristallogidratlar:</b> CuSO₄·5H₂O, Na₂CO₃·10H₂O, CaSO₄·2H₂O — kristallizatsion suv.</p><p><b>Dispers sistemalar:</b> chin eritmalar (&lt;1 nm), kolloid eritmalar (1–100 nm, Tindal effekti), suspenziya va emulsiyalar (&gt;100 nm).</p>",
      "Eritma — bir jinsli sistema; erish — fizik-kimyoviy jarayon.",
      [["Nega NaOH suvda eriganda qiziydi, NH₄NO₃ eriganda soviydi?", ["Gidratlanish energiyasi panjara energiyasidan katta — issiqlik chiqadi (NaOH)", "Aksincha — yutiladi (NH₄NO₃)"], "Energiya balansi farqi"], ["25 g CuSO₄·5H₂O da kristallizatsion suv massasi?", ["M = 250; suv 90 g/mol", "25 · 90/250"], "9 g"]],
      [["Eritma —", ["bir jinsli sistema", "geterogen aralashma", "sof modda", "suspenziya"], "Gomogen."], ["Tindal effekti:", ["Kolloid eritmada", "Chin eritmada", "Sof suvda", "Gazda"], "Nur yo‘li ko‘rinadi."], ["Kristallogidrat:", ["Na₂CO₃·10H₂O", "NaCl", "Na₂CO₃", "NaOH"], "Kristallizatsion suv."]]],

    ["eruvchanlik", "Eruvchanlik. Masalalar. Loyiha: sho‘r suvni chuchuklashtirish", "eruvchanlik koeffitsienti",
      "Sho‘r suvdan ichimlik suvi olish — Orolbo‘yi uchun hayotiy masala. Buning uchun eruvchanlik va ajratish usullarini bilish kerak.",
      "<p><b>Eruvchanlik (eruvchanlik koeffitsienti S)</b> — ma’lum haroratda 100 g erituvchida eriydigan moddaning maksimal massasi (g/100 g suv).</p><p><b>To‘yingan eritma</b> — berilgan haroratda modda boshqa erimaydigan eritma.</p><p>To‘yingan eritmada: ω = S / (100 + S).</p><p><b>Ta’sir etuvchi omillar:</b> modda va erituvchi tabiati (“o‘xshash o‘xshashda eriydi”), harorat (ko‘p qattiq moddalar uchun ortadi; gazlar uchun kamayadi), bosim (gazlar eruvchanligi bosimga proporsional — Genri qonuni).</p><p><b>Qayta kristallash</b> — haroratga bog‘liq eruvchanlik farqidan tozalash: issiq to‘yingan eritma sovitilsa ortiqcha modda kristallanadi.</p><p><b>Loyiha — sho‘r suvni chuchuklashtirish:</b> distillash (quyosh distillyatorlari), teskari osmos membranalari, muzlatish, ion almashinish. Orolbo‘yi sharoitiga mos arzon g‘oya ishlab chiqing.</p>",
      "ω(to‘yingan) = S / (100 + S).",
      [["KNO₃ eruvchanligi 60 °C da 110 g, 20 °C da 32 g. 210 g to‘yingan eritma 60 → 20 °C sovitilsa necha g kristall tushadi?", ["210 g eritmada 100 g suv + 110 g tuz", "20 °C da 100 g suvda 32 g qoladi", "110 − 32"], "78 g"], ["20 °C da NaCl eruvchanligi 36 g. To‘yingan eritma ω?", ["36 / 136"], "≈ 26,5%"]],
      [["Gazlar eruvchanligi harorat ortsa:", ["Kamayadi", "Ortadi", "O‘zgarmaydi", "Cheksiz ortadi"], "Shuning uchun gazli ichimlik isisa ko‘piklanadi."], ["To‘yingan eritma —", ["boshqa erimaydigan", "konsentrlangan", "suyultirilgan", "o‘ta to‘yingan"], "Muvozanat."], ["Sho‘r suvni chuchuklashtirish usuli:", ["Teskari osmos", "Filtrlash", "Tindirish", "Magnit"], "Membrana."]]],

    ["foiz", "Eritma konsentratsiyasi. Foiz konsentratsiya", "ω = m(modda)/m(eritma)",
      "Dorixonadagi 3% li vodorod peroksid, 0,9% li fiziologik eritma, 70% li tibbiy spirt — konsentratsiya xato bo‘lsa, dori zararli bo‘lishi mumkin.",
      "<p><b>Konsentratsiya</b> — eritmaning ma’lum miqdoridagi erigan modda miqdori.</p><p><b>Massa ulushi (foiz konsentratsiya):</b> ω = m(modda) / m(eritma) · 100%; m(eritma) = m(modda) + m(erituvchi).</p><p><b>Asosiy masala turlari:</b></p><ul><li>eritma tayyorlash: m(modda) = m(eritma)·ω;</li><li>suyultirish (suv qo‘shish): m₁ω₁ = m₂ω₂;</li><li>bug‘latish (suv chiqarish);</li><li>ikki eritmani aralashtirish: ω = (m₁ω₁ + m₂ω₂)/(m₁ + m₂) yoki <b>“xoch” (diagonal) usuli</b>;</li><li>kristallogidratdan eritma tayyorlash.</li></ul>",
      "ω = m(modda) / m(eritma).",
      [["20% li 200 g eritmaga 50 g suv qo‘shildi. Yangi ω?", ["m(modda) = 40 g", "m(eritma) = 250 g", "40/250"], "16%"], ["10% li va 40% li eritmalardan 20% li 300 g eritma tayyorlash uchun har biridan qancha olish kerak (xoch usuli)?", ["40 − 20 = 20 qism (10% li)", "20 − 10 = 10 qism (40% li)", "300 g: 2 : 1"], "200 g (10%) va 100 g (40%)"]],
      [["150 g suvda 50 g tuz. ω =", ["25%", "33,3%", "50%", "20%"], "50/200."], ["Suyultirishda saqlanadi:", ["Erigan modda massasi", "Eritma massasi", "Suv massasi", "ω"], "m₁ω₁ = m₂ω₂."], ["200 g 5% li eritmadagi tuz:", ["10 g", "5 g", "20 g", "40 g"], "200 · 0,05."]]],
  ]);

  Y("11", "kimyo", "III chorak", [
    ["foiz-zichlik", "Foiz konsentratsiya, eritma massasi, hajmi va zichligi orasidagi bog‘lanish", "m = ρV",
      "Laboratoriyada eritmalar odatda massa bilan emas, hajm bilan o‘lchanadi. Konsentrlangan kislotani suyultirish uchun zichlikni hisobga olish shart.",
      "<p><b>Zichlik:</b> ρ = m / V (g/mL) → m(eritma) = ρ · V.</p><p>Shunda: m(modda) = V · ρ · ω.</p><p><b>Algoritm:</b> hajm → (×ρ) → eritma massasi → (×ω) → modda massasi → (÷M) → mol.</p><p><b>Muhim:</b> eritmalarni aralashtirganda massalar qo‘shiladi, hajmlar esa har doim ham emas (spirt + suv — hajm kichrayadi).</p><p>Konsentrlangan kislotalar: H₂SO₄ 96% — ρ = 1,84; HCl 36% — ρ = 1,18; HNO₃ 65% — ρ = 1,4 g/mL.</p>",
      "m(modda) = V · ρ · ω.",
      [["96% li H₂SO₄ (ρ = 1,84) ning 50 mL ida necha g kislota?", ["m(eritma) = 50 · 1,84 = 92 g", "92 · 0,96"], "88,32 g"], ["10% li 500 g H₂SO₄ eritmasini tayyorlash uchun necha mL 96% li (ρ = 1,84) kerak?", ["m(H₂SO₄) = 50 g", "m(96%) = 50/0,96 ≈ 52,1 g", "V = 52,1/1,84"], "≈ 28,3 mL"]],
      [["m(eritma) =", ["ρ · V", "V / ρ", "ρ / V", "ω · V"], "Zichlik formulasi."], ["200 mL eritma, ρ = 1,1, ω = 10%: m(modda)", ["22 g", "20 g", "11 g", "220 g"], "200·1,1·0,1."], ["Kons. H₂SO₄ zichligi:", ["1,84 g/mL", "1 g/mL", "1,18 g/mL", "0,8 g/mL"], "96%."]]],

    ["molyar", "Molyar konsentratsiya", "Cₘ = n / V (mol/L)",
      "Analitik laboratoriyalar, farmatsevtika va biokimyoda konsentratsiya deyarli har doim mol/L da beriladi — u reaksiya tenglamasi bilan bevosita bog‘lanadi.",
      "<p><b>Molyar konsentratsiya</b> — 1 litr eritmadagi erigan modda mollari soni:</p><p><b>Cₘ = n / V = m / (M · V)</b> (mol/L yoki M).</p><p>“0,5 M NaCl” — 1 L eritmada 0,5 mol (29,25 g) NaCl.</p><p><b>Eritma tayyorlash:</b> hisoblangan massani o‘lchov kolbasiga solib, oz suvda eritiladi, so‘ng belgigacha suv qo‘shiladi.</p><p><b>Suyultirish:</b> C₁V₁ = C₂V₂. <b>Aralashtirish:</b> C = (C₁V₁ + C₂V₂)/(V₁ + V₂).</p><p><b>Titrlash:</b> C(kislota)·V(kislota)·z₁ = C(asos)·V(asos)·z₂.</p>",
      "Cₘ = n / V; C₁V₁ = C₂V₂.",
      [["250 mL 0,2 M NaOH tayyorlash uchun necha g NaOH kerak?", ["n = 0,2 · 0,25 = 0,05 mol", "m = 0,05 · 40"], "2 g"], ["2 M eritmaning 100 mL idan 0,5 M eritma tayyorlash uchun qanday hajmgacha suyultirish kerak?", ["C₁V₁ = C₂V₂", "2 · 100 = 0,5 · V₂"], "400 mL"]],
      [["Molyar konsentratsiya birligi:", ["mol/L", "g/L", "%", "mol/kg"], "M."], ["0,1 L da 0,05 mol:", ["0,5 M", "0,05 M", "5 M", "0,005 M"], "0,05/0,1."], ["1 M NaCl 1 L da:", ["58,5 g", "1 g", "35,5 g", "23 g"], "M(NaCl)."]]],

    ["normal", "Normal konsentratsiya", "Cₙ = nₑ / V (N)",
      "Titrlash hisob-kitoblarida normal konsentratsiya juda qulay: teng normallikdagi kislota va ishqor teng hajmlarda to‘liq neytrallanadi.",
      "<p><b>Normal (ekvivalent) konsentratsiya</b> — 1 L eritmadagi moddaning ekvivalentlar mollari soni:</p><p><b>Cₙ = nₑ / V = m / (Mₑ · V)</b>; Mₑ = M / z.</p><p>Bog‘lanish: <b>Cₙ = z · Cₘ</b>. Masalan, 1 M H₂SO₄ = 2 N; 1 M H₃PO₄ = 3 N (to‘liq neytrallashda).</p><p><b>Titrlash qonuni:</b> Cₙ₁ · V₁ = Cₙ₂ · V₂ — eritmalar ekvivalent miqdorlarda reaksiyaga kirishadi.</p>",
      "Cₙ = z · Cₘ; Cₙ₁V₁ = Cₙ₂V₂.",
      [["500 mL 0,2 N H₂SO₄ tayyorlash uchun necha g kislota?", ["nₑ = 0,2 · 0,5 = 0,1", "Mₑ = 49", "m = 4,9 g"], "4,9 g"], ["20 mL 0,1 N NaOH ni neytrallashga 25 mL HCl ketdi. Cₙ(HCl)?", ["0,1 · 20 = Cₙ · 25"], "0,08 N"]],
      [["0,5 M H₂SO₄ =", ["1 N", "0,5 N", "0,25 N", "2 N"], "z = 2."], ["Cₙ va Cₘ bog‘lanishi:", ["Cₙ = z·Cₘ", "Cₘ = z·Cₙ", "Cₙ = Cₘ/z", "Teng"], "z — ekvivalentlik soni."], ["Teng normallikdagi kislota va ishqor:", ["Teng hajmda neytrallanadi", "Har doim 1 : 2", "Reaksiyaga kirmaydi", "Faqat massa bilan"], "Titrlash."]]],

    ["konv-molyar", "Foiz va molyar konsentratsiya o‘rtasidagi bog‘lanish", "Cₘ = 10ωρ / M",
      "Zavoddan kelgan kislota shishasida foiz va zichlik yozilgan, retseptda esa mol/L. Ular orasidagi “tarjima” formulasini bilish kerak.",
      "<p><b>Foizdan molyarga:</b> 1 L eritma massasi = 1000·ρ g; modda massasi = 1000·ρ·ω; demak</p><p><b>Cₘ = 1000 · ρ · ω / M</b> (ω — ulushda) yoki <b>Cₘ = 10 · ρ · ω% / M</b>.</p><p><b>Molyardan foizga:</b> <b>ω = Cₘ · M / (1000 · ρ)</b>.</p><p>ρ g/mL da, M g/mol da.</p>",
      "Cₘ = 10·ω%·ρ / M.",
      [["36,5% li HCl (ρ = 1,18) ning molyar konsentratsiyasi?", ["Cₘ = 10 · 36,5 · 1,18 / 36,5"], "11,8 M"], ["2 M NaOH (ρ = 1,08) ning foiz konsentratsiyasi?", ["ω = 2 · 40 / (1000 · 1,08)"], "≈ 7,4%"]],
      [["Cₘ = 10·ω%·ρ / M da ρ birligi:", ["g/mL", "kg/m³", "g/L", "mol/L"], "Odatdagi."], ["98% H₂SO₄ (ρ = 1,84) Cₘ:", ["≈ 18,4 M", "≈ 9,8 M", "≈ 1,84 M", "≈ 36,8 M"], "10·98·1,84/98."], ["Formuladagi 1000:", ["1 L = 1000 mL", "Avogadro", "Foiz", "Harorat"], "Hajm birligi."]]],

    ["konv-normal", "Foiz va normal konsentratsiya o‘rtasidagi bog‘lanish", "Cₙ = 10ωρ / Mₑ",
      "Normal konsentratsiyaga o‘tish formulasi molyarnikiga o‘xshash — faqat M o‘rnida ekvivalent massa turadi.",
      "<p><b>Cₙ = 10 · ω% · ρ / Mₑ</b>, Mₑ = M / z.</p><p><b>ω% = Cₙ · Mₑ / (10 · ρ)</b>.</p><p>Shuningdek: Cₙ = z · Cₘ.</p><p><b>Masala turlari:</b> konsentrlangan kislotadan kerakli normallikdagi eritma tayyorlash; titrlash natijasidan foizni topish; turli konsentratsiyalardagi eritmalarni solishtirish.</p>",
      "Cₙ = 10·ω%·ρ / Mₑ.",
      [["20% li H₂SO₄ (ρ = 1,14) normal konsentratsiyasi?", ["Mₑ = 49", "Cₙ = 10 · 20 · 1,14 / 49"], "≈ 4,65 N"], ["1 L 0,5 N H₂SO₄ tayyorlash uchun necha mL 96% li (ρ = 1,84) kerak?", ["m(H₂SO₄) = 0,5 · 49 = 24,5 g", "m(96%) = 25,5 g", "V = 25,5/1,84"], "≈ 13,9 mL"]],
      [["Mₑ(H₃PO₄) to‘liq neytrallashda:", ["32,7", "98", "49", "24,5"], "98/3."], ["Cₙ formulasida M o‘rniga:", ["Mₑ", "Vm", "Nₐ", "ρ"], "Ekvivalent massa."], ["2 M H₂SO₄ =", ["4 N", "2 N", "1 N", "8 N"], "z = 2."]]],

    ["eritma-tayyorlash", "Amaliy mashg‘ulot. Foiz konsentratsiyali eritmalar tayyorlash", "tarozi, o‘lchov silindri, areometr",
      "Laborant, farmatsevt, agronom — barchasi har kuni aniq konsentratsiyali eritmalar tayyorlaydi. Bu ko‘nikma amaliy hayotda juda kerak.",
      "<p><b>Topshiriq 1:</b> 50 g 10% li NaCl eritmasi.</p><ol><li>Hisob: m(NaCl) = 5 g; m(suv) = 45 g (45 mL).</li><li>Tuzni texnik tarozida tortish (qog‘oz yoki stakanda).</li><li>Suvni o‘lchov silindrida o‘lchash (ko‘z — meniskning pastki chizig‘i darajasida).</li><li>Stakanda shisha tayoqcha bilan aralashtirib eritish.</li></ol><p><b>Topshiriq 2:</b> tayyorlangan eritmani suyultirib 5% li eritma olish (hisob: m₁ω₁ = m₂ω₂ → 50 g suv qo‘shish).</p><p><b>Topshiriq 3:</b> eritma zichligini <b>areometr</b> bilan o‘lchab, jadvaldan konsentratsiyani tekshirish.</p><p><b>Xavfsizlik:</b> kislotalar bilan ishlaganda — ko‘zoynak, “kislotani suvga”.</p>",
      "Hisob → tortish → o‘lchash → eritish → tekshirish.",
      [["80 g 15% li shakar eritmasi uchun shakar va suv?", ["m(shakar) = 12 g", "m(suv) = 68 g"], "12 g shakar, 68 mL suv"], ["Mis kuporosidan (CuSO₄·5H₂O) 100 g 8% li CuSO₄ eritmasi?", ["m(CuSO₄) = 8 g", "m(kuporos) = 8 · 250/160 = 12,5 g", "suv: 87,5 g"], "12,5 g kuporos + 87,5 g suv"]],
      [["Suyuqlik zichligini o‘lchaydi:", ["Areometr", "Termometr", "Barometr", "Manometr"], "Densimetr."], ["O‘lchov silindrida o‘qiladi:", ["Meniskning pastki chizig‘i", "Yuqori cheti", "Idish tubi", "Ixtiyoriy"], "Ko‘z darajasida."], ["10% li 50 g eritmaga 50 g suv qo‘shilsa:", ["5%", "10%", "20%", "2,5%"], "5/100."]]],

    ["tezlik11", "Reaksiya tezligi. Masalalar", "v = Δc/Δt, massalar ta’siri qonuni",
      "Dorilarning yaroqlilik muddati, oziq-ovqatning buzilishi, sanoat reaktorlari unumdorligi — barchasi reaksiya tezligi bilan hisoblanadi.",
      "<p><b>Gomogen reaksiya tezligi:</b> v = ±Δc/Δt (mol/(L·s)). Geterogen reaksiyalarda tezlik sirt birligiga nisbatan olinadi.</p><p><b>Massalar ta’siri qonuni</b> (Guldberg-Vaage): o‘zgarmas haroratda tezlik reagentlar konsentratsiyalari (koeffitsient darajasidagi) ko‘paytmasiga proporsional:</p><p>aA + bB → … : <b>v = k · [A]ᵃ · [B]ᵇ</b>; k — tezlik konstantasi. Qattiq moddalar konsentratsiyasi ifodaga kirmaydi.</p><p>Masalan, 2NO + O₂ → 2NO₂: v = k[NO]²[O₂] — [NO] 2 marta ortsa, v 4 marta ortadi.</p>",
      "v = k[A]ᵃ[B]ᵇ.",
      [["A + 2B → C. [B] 3 marta oshirilsa, tezlik?", ["v ~ [B]²", "3² = 9"], "9 marta ortadi"], ["Boshlang‘ich c = 1,2 M, 20 s dan keyin 0,8 M. v?", ["Δc = 0,4", "0,4/20"], "0,02 mol/(L·s)"]],
      [["C(qattiq) + O₂ → CO₂ tezlik ifodasi:", ["v = k[O₂]", "v = k[C][O₂]", "v = k[C]", "v = k"], "Qattiq kirmaydi."], ["2A + B: [A] 2 marta ↑ →", ["4 marta", "2 marta", "8 marta", "O‘zgarmaydi"], "[A]²."], ["Massalar ta’siri qonuni:", ["Guldberg-Vaage", "Vant-Goff", "Le-Shatelye", "Avogadro"], "1867."]]],

    ["tezlik-omil", "Reaksiya tezligiga bosim, hajm va haroratning ta’siri. Katalizator", "Vant-Goff qoidasi, faollanish energiyasi",
      "Ovqatni bosimli qozonda pishirish tezroq: harorat 100 °C dan yuqori bo‘ladi. Fermentlar esa organizmdagi reaksiyalarni million marta tezlashtiradi.",
      "<p><b>Bosim (gazlar):</b> bosim n marta oshirilsa (hajm n marta kamaytirilsa) har bir gaz konsentratsiyasi n marta ortadi: 2SO₂ + O₂ uchun tezlik n³ marta ortadi.</p><p><b>Harorat — Vant-Goff qoidasi:</b> har 10 °C da tezlik 2–4 marta ortadi: <b>v₂ = v₁ · γ^((t₂ − t₁)/10)</b>, γ — harorat koeffitsienti.</p><p><b>Faollanish energiyasi (Eₐ)</b> — to‘qnashuv reaksiyaga olib kelishi uchun kerakli minimal energiya. Harorat oshsa faol molekulalar ulushi keskin ortadi.</p><p><b>Katalizator</b> — Eₐ ni kamaytiruvchi, reaksiyadan keyin o‘zgarmay qoluvchi modda (gomogen va geterogen kataliz). <b>Fermentlar</b> — biologik katalizatorlar. <b>Ingibitorlar</b> — sekinlatadi (korroziya ingibitorlari, konservantlar).</p>",
      "v₂ = v₁·γ^(Δt/10); katalizator Eₐ ni kamaytiradi.",
      [["γ = 3. Harorat 20 dan 50 °C ga ko‘tarilsa tezlik?", ["Δt/10 = 3", "3³"], "27 marta ortadi"], ["2NO + O₂ → 2NO₂. Bosim 3 marta oshirilsa tezlik?", ["v ~ [NO]²[O₂]", "3² · 3"], "27 marta"]],
      [["γ = 2, Δt = 40 °C →", ["16 marta", "8 marta", "80 marta", "4 marta"], "2⁴."], ["Katalizator kamaytiradi:", ["Faollanish energiyasini", "Mahsulot miqdorini", "Haroratni", "Bosimni"], "Eₐ."], ["Biologik katalizatorlar:", ["Fermentlar", "Ingibitorlar", "Vitaminlar", "Gormonlar"], "Oqsillar."]]],

    ["muvozanat11", "Qaytar va qaytmas reaksiyalar. Kimyoviy muvozanat", "Kc — muvozanat konstantasi",
      "Qaytar reaksiyalarda mahsulot hech qachon 100% chiqmaydi. Qancha chiqishini muvozanat konstantasi aytib beradi.",
      "<p><b>Qaytmas reaksiyalar</b> — oxirigacha boradi (cho‘kma, gaz, kuchsiz elektrolit hosil bo‘lsa, yonish). <b>Qaytar reaksiyalar</b> — ikki tomonga: N₂ + 3H₂ ⇄ 2NH₃.</p><p><b>Kimyoviy muvozanat</b> — v(to‘g‘ri) = v(teskari); konsentratsiyalar o‘zgarmaydi (muvozanat konsentratsiyalari [ ]).</p><p><b>Muvozanat konstantasi:</b> aA + bB ⇄ cC + dD:</p><p><b>Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)</b> (qattiq moddalar kirmaydi).</p><p>Kc ≫ 1 — muvozanat mahsulotlar tomonida; Kc ≪ 1 — reagentlar tomonida. Kc faqat haroratga bog‘liq (konsentratsiya, bosim, katalizatorga emas).</p><p><b>Masalalar:</b> boshlang‘ich c → sarflangan → muvozanat c jadvali (“c₀ – x – [ ]”).</p>",
      "Kc = [mahsulotlar] / [reagentlar] (koeffitsient darajasida).",
      [["H₂ + I₂ ⇄ 2HI. Muvozanatda [H₂] = [I₂] = 0,2; [HI] = 1,2 M. Kc?", ["Kc = 1,2² / (0,2 · 0,2)", "1,44 / 0,04"], "36"], ["A + B ⇄ C, c₀(A) = c₀(B) = 1 M, muvozanatda [C] = 0,5 M. Kc?", ["[A] = [B] = 0,5", "Kc = 0,5 / (0,5·0,5)"], "2"]],
      [["Kc ga ta’sir etadi:", ["Harorat", "Katalizator", "Bosim", "Konsentratsiya"], "Faqat T."], ["CaCO₃(q) ⇄ CaO(q) + CO₂: Kc =", ["[CO₂]", "[CaO][CO₂]/[CaCO₃]", "[CaCO₃]", "1"], "Qattiqlar kirmaydi."], ["Muvozanatda:", ["v₁ = v₂", "v₁ > v₂", "Reaksiya to‘xtaydi", "v = 0"], "Dinamik."]]],

    ["muvozanat-omil", "Kimyoviy muvozanat va unga ta’sir etuvchi omillar. Masalalar", "Le-Shatelye prinsipi",
      "Gaber jarayonini to‘g‘ri sozlash milliardlab odamni oziq bilan ta’minlovchi o‘g‘itlarni beradi — Le-Shatelye prinsipi sanoatning eng muhim qoidalaridan biri.",
      "<p><b>Le-Shatelye prinsipi:</b> muvozanatdagi sistemaga tashqi ta’sir ko‘rsatilsa, muvozanat shu ta’sirni kamaytiruvchi tomonga siljiydi.</p><ul><li><b>Konsentratsiya:</b> reagent qo‘shish yoki mahsulotni chiqarish → o‘ngga;</li><li><b>Harorat:</b> T ↑ → endotermik (−Q) tomonga; T ↓ → ekzotermik (+Q) tomonga;</li><li><b>Bosim:</b> p ↑ → gaz mollari kam tomonga; gaz mollari teng bo‘lsa — ta’sir yo‘q;</li><li><b>Katalizator va inert gaz</b> (V const) muvozanatni siljitmaydi.</li></ul><p><b>Misol:</b> N₂ + 3H₂ ⇄ 2NH₃ + Q: NH₃ unumini oshirish uchun — p ↑, T ↓ (lekin juda past T da tezlik kichik — kompromiss 450 °C), NH₃ ni doimiy chiqarib turish.</p>",
      "Ta’sir → muvozanat uni kamaytiruvchi tomonga.",
      [["CO(g) + H₂O(g) ⇄ CO₂(g) + H₂(g) − Q. Muvozanatni o‘ngga surish?", ["Endotermik — T ↑", "Mollar teng (2 = 2) — bosim ta’sir etmaydi", "CO yoki H₂O qo‘shish, H₂ ni chiqarish"], "T ↑, reagent qo‘shish"], ["2SO₂ + O₂ ⇄ 2SO₃ + Q: T ↑ bo‘lsa?", ["Ekzotermik to‘g‘ri reaksiya", "Endotermik teskari tomonga"], "Chapga siljiydi"]],
      [["N₂O₄ ⇄ 2NO₂ − Q: p ↑ →", ["Chapga", "O‘ngga", "Siljimaydi", "Reaksiya to‘xtaydi"], "1 < 2 mol."], ["Muvozanatni siljitmaydi:", ["Katalizator", "Harorat", "Bosim", "Konsentratsiya"], "Faqat tezlik."], ["Ekzotermik reaksiyada T ↓ →", ["O‘ngga (mahsulotlar)", "Chapga", "Siljimaydi", "To‘xtaydi"], "+Q tomonga."]]],
  ]);

  Y("11", "kimyo", "IV chorak", [
    ["yarim-reaksiya", "Oksidlanish-qaytarilish reaksiyalarini yarim reaksiya usuli bilan tenglashtirish", "ion-elektron usul",
      "Eritmalardagi murakkab OQR larni (KMnO₄, K₂Cr₂O₇) elektron balans bilan tenglash qiyin — yarim reaksiyalar usuli real zarrachalar bilan ishlaydi.",
      "<p><b>Yarim reaksiya (ion-elektron) usuli</b> — eritmada real mavjud ionlar bilan ishlaydi.</p><p><b>Bosqichlar:</b></p><ol><li>Oksidlovchi va qaytaruvchi ionlarini aniqlab, ikkita yarim reaksiya yozing.</li><li>Kisloroddan tashqari atomlarni tenglang.</li><li>Kislorodni tenglang: <b>kislotali</b> muhitda — O yetishmagan tomonga H₂O, ortiqcha tomonga H⁺; <b>ishqoriy</b> — O yetishmagan tomonga 2OH⁻, qarshi tomonga H₂O; <b>neytral</b> — chapga H₂O.</li><li>Zaryadlarni elektronlar bilan tenglang.</li><li>Elektronlar sonini tenglab, yarim reaksiyalarni qo‘shing va qisqartiring.</li></ol><p><b>Misol (kislotali):</b> MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O | ×2<br>SO₃²⁻ + H₂O − 2e⁻ → SO₄²⁻ + 2H⁺ | ×5<br>2MnO₄⁻ + 5SO₃²⁻ + 6H⁺ → 2Mn²⁺ + 5SO₄²⁻ + 3H₂O</p>",
      "Kislotali muhit — H⁺ va H₂O; ishqoriy — OH⁻ va H₂O.",
      [["Cr₂O₇²⁻ → Cr³⁺ (kislotali) yarim reaksiyasini yozing.", ["Cr: 2Cr³⁺", "O: o‘ngga 7H₂O, chapga 14H⁺", "Zaryad: +12 → +6 → 6e⁻"], "Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O"], ["NO₃⁻ → NO (kislotali) yarim reaksiyasi?", ["O: o‘ngga 2H₂O, chapga 4H⁺", "Zaryad: +3 → 0 → 3e⁻"], "NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O"]],
      [["Kislotali muhitda O ni tenglashda qo‘shiladi:", ["H⁺ va H₂O", "OH⁻ va H₂O", "Faqat O₂", "Faqat e⁻"], "Ion-elektron usul."], ["MnO₄⁻ → Mn²⁺ da elektronlar:", ["5", "3", "1", "7"], "+7 → +2."], ["Ishqoriy muhitda O yetishmagan tomonga:", ["2OH⁻", "H⁺", "H₂O", "O₂"], "Qarshi tomonga H₂O."]]],

    ["muhit-okq", "Oksidlanish-qaytarilish reaksiyalarining eritma muhitiga bog‘liqligi", "KMnO₄, K₂Cr₂O₇ muhitda",
      "Bir xil KMnO₄ kislotali muhitda rangsiz eritma, neytralda qo‘ng‘ir cho‘kma, ishqoriyda yashil eritma beradi — muhit mahsulotni belgilaydi.",
      "<p><b>KMnO₄ qaytarilishi:</b></p><ul><li>kislotali (H₂SO₄): MnO₄⁻ → <b>Mn²⁺</b> (rangsiz), 5e⁻;</li><li>neytral (H₂O): MnO₄⁻ → <b>MnO₂↓</b> (qo‘ng‘ir), 3e⁻;</li><li>ishqoriy (KOH): MnO₄⁻ → <b>MnO₄²⁻</b> (yashil), 1e⁻.</li></ul><p>Misol: 2KMnO₄ + 5Na₂SO₃ + 3H₂SO₄ → 2MnSO₄ + 5Na₂SO₄ + K₂SO₄ + 3H₂O;<br>2KMnO₄ + 3Na₂SO₃ + H₂O → 2MnO₂ + 3Na₂SO₄ + 2KOH;<br>2KMnO₄ + Na₂SO₃ + 2KOH → 2K₂MnO₄ + Na₂SO₄ + H₂O.</p><p><b>K₂Cr₂O₇</b> — faqat kislotali muhitda kuchli oksidlovchi: Cr₂O₇²⁻ → 2Cr³⁺ (to‘q sariq → yashil). Ishqoriy muhitda Cr³⁺ birikmalari xromatlarga oksidlanadi.</p><p><b>H₂O₂</b> — ham oksidlovchi (→ H₂O), ham qaytaruvchi (→ O₂).</p>",
      "KMnO₄: H⁺ → Mn²⁺; H₂O → MnO₂; OH⁻ → MnO₄²⁻.",
      [["0,1 mol KMnO₄ kislotali muhitda nechta mol elektron qabul qiladi?", ["Mn⁺⁷ → Mn²⁺: 5e⁻", "0,1 · 5"], "0,5 mol e⁻"], ["Neytral muhitda KMnO₄ bilan Na₂SO₃ reaksiyasida qanday cho‘kma tushadi?", ["Mn⁺⁷ → Mn⁺⁴"], "MnO₂ (qo‘ng‘ir)"]],
      [["Ishqoriy muhitda KMnO₄ →", ["K₂MnO₄ (yashil)", "MnSO₄", "MnO₂", "Mn"], "1e⁻."], ["K₂Cr₂O₇ kislotali muhitda Cr:", ["+3", "+6", "+2", "0"], "Yashil."], ["H₂O₂ qaytaruvchi bo‘lganda:", ["O₂ ajraladi", "H₂O hosil bo‘ladi", "H₂ ajraladi", "O₃ hosil bo‘ladi"], "O⁻¹ → O⁰."]]],

    ["okq-ekv", "OQR larda moddalarning ekvivalent massalarini aniqlash", "Mₑ = M / n(e⁻)",
      "Oksidlovchi yoki qaytaruvchining “kuchi” u qancha elektron berishi yoki olishiga bog‘liq — buni ekvivalent massa ifodalaydi.",
      "<p>OQR da <b>ekvivalent massa = M / bitta formula birligi bergan (olgan) elektronlar soni</b>.</p><p>KMnO₄: kislotali — Mₑ = 158/5 = 31,6; neytral — 158/3 = 52,7; ishqoriy — 158/1 = 158.</p><p>K₂Cr₂O₇ (→ 2Cr³⁺, 6e⁻): Mₑ = 294/6 = 49.</p><p>FeSO₄ (Fe²⁺ → Fe³⁺, 1e⁻): Mₑ = 152.</p><p>H₂O₂ (oksidlovchi, 2e⁻): Mₑ = 17.</p><p><b>Ekvivalentlar qonuni OQR da:</b> m(oks)/Mₑ(oks) = m(qayt)/Mₑ(qayt); titrlash (permanganatometriya): Cₙ₁V₁ = Cₙ₂V₂.</p>",
      "OQR da Mₑ = M / e⁻ soni.",
      [["Kislotali muhitda 3,16 g KMnO₄ necha g FeSO₄ ni oksidlaydi?", ["Mₑ(KMnO₄) = 31,6 → 0,1 ekv", "Mₑ(FeSO₄) = 152", "0,1 · 152"], "15,2 g"], ["Na₂SO₃ (→ Na₂SO₄) ning OQR dagi Mₑ?", ["S⁺⁴ → S⁺⁶: 2e⁻", "126/2"], "63"]],
      [["Mₑ(KMnO₄) kislotali muhitda:", ["31,6", "52,7", "158", "79"], "158/5."], ["Mₑ(K₂Cr₂O₇) (→ Cr³⁺):", ["49", "98", "147", "294"], "6e⁻."], ["OQR da ekvivalent massa bog‘liq:", ["Elektronlar soniga", "Rangga", "Hajmga", "Haroratga"], "M/n(e⁻)."]]],

    ["elektroliz11", "Elektroliz tushunchasi. Eritma va suyuqlanma elektrolizi", "katod va anod jarayonlari",
      "Sof mis (99,99%), alyuminiy, natriy, xlor va ishqor — barchasi elektroliz mahsulotlari.",
      "<p><b>Elektroliz</b> — tok ta’sirida elektrodlarda boradigan OQR: <b>katodda (−)</b> qaytarilish, <b>anodda (+)</b> oksidlanish.</p><p><b>Suyuqlanma:</b> 2NaCl → 2Na (katod) + Cl₂ (anod); 2Al₂O₃ → 4Al + 3O₂.</p><p><b>Eritma — katod:</b></p><ul><li>Li … Al (faol): faqat suv qaytariladi: 2H₂O + 2e⁻ → H₂ + 2OH⁻;</li><li>Mn … Pb: metall va H₂ birga;</li><li>Cu va undan keyingilar: faqat metall: Cu²⁺ + 2e⁻ → Cu.</li></ul><p><b>Eritma — inert anod:</b></p><ul><li>S²⁻, I⁻, Br⁻, Cl⁻ oksidlanadi (→ S, I₂, Br₂, Cl₂);</li><li>kislorodli anionlar (SO₄²⁻, NO₃⁻, PO₄³⁻) va F⁻ — suv oksidlanadi: 2H₂O − 4e⁻ → O₂ + 4H⁺;</li><li>RCOO⁻ — Kolbe: 2RCOO⁻ − 2e⁻ → R–R + 2CO₂.</li></ul><p><b>Eruvchan anod</b> (Cu, Ni) — anodning o‘zi eriydi (misni tozalash).</p>",
      "Katod — qaytarilish; anod — oksidlanish.",
      [["Na₂SO₄ eritmasi elektrolizi mahsulotlari?", ["Katod: H₂ (Na faol)", "Anod: O₂ (kislorodli anion)", "Aslida suv parchalanadi"], "H₂ va O₂"], ["CuCl₂ eritmasi elektrolizida elektrodlarda?", ["Katod: Cu", "Anod: Cl₂"], "Cu va Cl₂"]],
      [["KI eritmasi elektrolizida anodda:", ["I₂", "O₂", "K", "H₂"], "Kislorodsiz anion."], ["AgNO₃ eritmasida katodda:", ["Ag", "H₂", "N₂", "O₂"], "Faolsiz metall."], ["NaCl suyuqlanmasi elektrolizida katodda:", ["Na", "H₂", "Cl₂", "O₂"], "Suv yo‘q."]]],

    ["faradey", "Elektroliz qonunlari (Faradey). Masalalar", "m = Mₑ·I·t / F",
      "Zargarlik buyumiga qancha oltin qoplanishi kerakligi, alyuminiy zavodida qancha elektr energiya sarflanishi — barchasi Faradey qonunlari bilan hisoblanadi.",
      "<p><b>Faradeyning 1-qonuni:</b> elektrodda ajralgan modda massasi o‘tgan elektr miqdoriga proporsional: m = k · Q = k · I · t.</p><p><b>2-qonun:</b> bir xil elektr miqdori turli moddalarning ekvivalent miqdorlarini ajratadi. 1 mol ekvivalent uchun <b>F = 96 500 Kl/mol</b> (Faradey soni).</p><p><b>Birlashgan formula:</b> <b>m = Mₑ · I · t / F = M · I · t / (z · F)</b>.</p><p>Gazlar uchun: V = Vₑ · I · t / F; Vₑ(H₂) = 11,2 L, Vₑ(O₂) = 5,6 L, Vₑ(Cl₂) = 11,2 L.</p><p><b>Tok bo‘yicha unum:</b> η = m(amaliy) / m(nazariy).</p><p>I — amper, t — sekund (1 soat = 3600 s).</p>",
      "m = M·I·t / (z·F); F = 96 500 Kl/mol.",
      [["CuSO₄ eritmasidan 5 A tok 1 soat o‘tdi. Katodda necha g mis?", ["m = 64 · 5 · 3600 / (2 · 96 500)", "1 152 000 / 193 000"], "≈ 5,97 g"], ["NaCl eritmasi elektrolizida 10 A, 965 s. Anodda necha L Cl₂ (n.sh.)?", ["Q = 9650 Kl = 0,1 F", "V = 0,1 · 11,2"], "1,12 L"]],
      [["Faradey soni:", ["96 500 Kl/mol", "6,02·10²³", "8,314", "22,4"], "F."], ["1 F tok ajratadi:", ["1 ekvivalent modda", "1 mol har qanday modda", "1 g", "1 L gaz"], "2-qonun."], ["Tok 2 marta oshirilsa ajralgan massa:", ["2 marta ortadi", "4 marta", "O‘zgarmaydi", "2 marta kamayadi"], "m ~ I."]]],

    ["elektroliz-tahlil", "Amaliy mashg‘ulot. Modda tarkibiga ko‘ra elektroliz mahsulotlari tahlili", "tahlil jadvali",
      "Elektroliz mahsulotlarini oldindan aytib bera olish — kimyogar va elektrokimyo muhandisi uchun asosiy ko‘nikma.",
      "<p><b>Tahlil tartibi:</b></p><ol><li>Elektrolit — suyuqlanma yoki eritma?</li><li>Kationni aktivlik qatoridagi joyiga ko‘ra tahlil qiling (katod).</li><li>Anionni (kislorodsiz yoki kislorodli) tahlil qiling (anod).</li><li>Anod inert yoki eruvchanmi?</li><li>Eritmada nima qoladi (kislota, ishqor, tuz)?</li></ol><table class='oq-t'><tr><th>Eritma</th><th>Katod</th><th>Anod</th><th>Eritmada</th></tr><tr><td>NaCl</td><td>H₂</td><td>Cl₂</td><td>NaOH</td></tr><tr><td>CuSO₄</td><td>Cu</td><td>O₂</td><td>H₂SO₄</td></tr><tr><td>KNO₃</td><td>H₂</td><td>O₂</td><td>KNO₃ (suv kamayadi)</td></tr><tr><td>AgNO₃</td><td>Ag</td><td>O₂</td><td>HNO₃</td></tr><tr><td>ZnCl₂</td><td>Zn, H₂</td><td>Cl₂</td><td>—</td></tr><tr><td>CuSO₄ (Cu anod)</td><td>Cu</td><td>Cu eriydi</td><td>CuSO₄</td></tr></table><p><b>Tajriba (namoyish):</b> KI va fenolftalein + kraxmal qo‘shilgan eritma elektrolizi: katod atrofi pushti (OH⁻), anod atrofi ko‘k (I₂).</p>",
      "Kation → katod; anion → anod; qolgan ionlar — eritmada.",
      [["CuSO₄ eritmasi elektrolizi tugagach eritmada nima qoladi?", ["Cu²⁺ — katodda Cu", "Suv oksidlanadi → H⁺ to‘planadi"], "H₂SO₄"], ["KNO₃ eritmasi elektrolizida konsentratsiya qanday o‘zgaradi?", ["Faqat suv parchalanadi (H₂ va O₂)"], "KNO₃ konsentratsiyasi ortadi"]],
      [["NaCl eritmasi elektrolizidan keyin eritmada:", ["NaOH", "HCl", "Na", "NaClO₄"], "Xlor-ishqor jarayoni."], ["AgNO₃ eritmasi elektrolizida anodda:", ["O₂", "NO₂", "Ag", "N₂"], "Kislorodli anion."], ["Misni tozalashda anod:", ["Xom mis (eriydi)", "Grafit", "Platina", "Temir"], "Eruvchan anod."]]],
  ]);
})();
