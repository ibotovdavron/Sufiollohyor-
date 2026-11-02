/* 11-sinf Algebra va analiz asoslari — yillik reja. */
(() => {
  window.AMALIY_SUBJ("11", "11-sinf", "algebra", "Algebra", "🔣", "#a855f7", "Yillik reja · 4 chorak");
  const Y = window.AMALIY_YEAR;
  const T = (...a) => a;

  Y("11", "algebra", "I chorak", [
    T("orttirma", "O‘zgaruvchi miqdorlar orttirmalarining nisbati va uning ma’nosi. Urinma ta’rifi. Funksiya orttirmasi", "Δx, Δy, Δy/Δx — o‘rtacha tezlik",
      "Avtomobil 2 soatda 160 km yurdi — o‘rtacha tezlik 80 km/s. Lekin spidometr har lahzadagi tezlikni ko‘rsatadi. Bu farq — differensial hisobning boshlanishi.",
      "<p><b>Argument orttirmasi</b>: Δx = x − x₀. <b>Funksiya orttirmasi</b>: Δy = f(x₀ + Δx) − f(x₀).</p><p><b>Orttirmalar nisbati</b> Δy/Δx — [x₀; x₀ + Δx] oraliqda funksiyaning <b>o‘rtacha o‘zgarish tezligi</b>. Geometrik ma’nosi — grafikdagi ikki nuqtadan o‘tuvchi <b>kesuvchining burchak koeffitsiyenti</b>.</p><p><b>Urinma</b> — Δx → 0 da kesuvchining limit holati: grafikka nuqtada “tegib” o‘tuvchi to‘g‘ri chiziq.</p><p>Misol: f(x) = x², x₀ = 1, Δx = 0,1: Δy = 1,21 − 1 = 0,21, Δy/Δx = 2,1 (Δx kichraysa → 2).</p>",
      "Δy/Δx — o‘rtacha tezlik, kesuvchi qiyaligi.",
      [["s(t) = 5t². [2; 4] dagi o‘rtacha tezlik?", ["Δs = 80 − 20 = 60", "Δt = 2"], "30 m/s"], ["f(x) = 3x + 1 uchun Δy, Δx = 0,5?", ["3·0,5"], "1,5"]],
      [["f(x) = x², x₀ = 2, Δx = 1: Δy =", ["5", "4", "1", "9"], "9−4."], ["Δy/Δx geometrik ma’nosi:", ["Kesuvchi qiyaligi", "Yuza", "Uzunlik", "Burchak gradusi"], "Secant slope."], ["Urinma — kesuvchining:", ["Δx → 0 dagi holati", "Δx → ∞", "Perpendikulyari", "Parallel ko‘chirilgani"], "Limit."]],
      [{ type: "tangent" }]),

    T("limit", "Limit haqida tushuncha", "lim f(x), uzluksizlik, asosiy limitlar",
      "Doiraga ichki chizilgan ko‘pburchak tomonlari ko‘paysa, uning perimetri aylana uzunligiga yaqinlashadi — limit g‘oyasi Arximed davridan beri ishlatiladi.",
      "<p><b>lim_{x→a} f(x) = L</b> — x a ga yaqinlashganda f(x) L ga istalgancha yaqinlashadi.</p><p><b>Ketma-ketlik limiti</b>: 1/n → 0; (n + 1)/n → 1.</p><p><b>Hisoblash</b>: uzluksiz funksiyada — shunchaki qo‘yish: lim_{x→2}(x² + 1) = 5. “0/0” noaniqlik — ko‘paytuvchilarga ajratib qisqartirish: lim_{x→3}(x² − 9)/(x − 3) = lim(x + 3) = 6.</p><p><b>Cheksizlikda</b>: lim_{x→∞}(2x² + 1)/(x² − 3) = 2 (bosh hadlar nisbati).</p><p><b>Ajoyib limitlar</b>: lim_{x→0} sin x/x = 1; lim_{n→∞}(1 + 1/n)ⁿ = e ≈ 2,718.</p><p><b>Uzluksiz</b> funksiya: lim_{x→a} f(x) = f(a).</p>",
      "0/0 — ajratib qisqartir; ∞/∞ — bosh hadlar.",
      [["lim_{x→1}(x² − 1)/(x − 1)", ["(x − 1)(x + 1)/(x − 1)"], "2"], ["lim_{x→∞}(3x − 1)/(x + 5)", ["Bosh hadlar: 3x/x"], "3"]],
      [["lim_{x→2}(3x + 1)", ["7", "6", "∞", "5"], "Plug in."], ["lim_{n→∞} 1/n²", ["0", "1", "∞", "1/2"], "Vanishes."], ["lim_{x→0} sin x / x", ["1", "0", "∞", "π"], "Remarkable."]],
      [{ type: "sheet", data: [["n", "(1 + 1/n)^n"], [1, "=(1+1/A2)^A2"], [10, "=(1+1/A3)^A3"], [100, "=(1+1/A4)^A4"], [10000, "=(1+1/A5)^A5"]], cols: 2, rows: 5, hint: "n kattalashgan sari qiymat e ≈ 2,71828 ga yaqinlashadi — bu limit." }]),

    T("hosila", "Hosila, uning geometrik va fizik ma’nosi", "f′(x₀) = lim Δy/Δx",
      "Spidometr tezlikni, ya’ni yo‘lning vaqt bo‘yicha hosilasini ko‘rsatadi. Hosila — har qanday jarayonning “lahzalik o‘zgarish tezligi”.",
      "<div class='fb'>f′(x₀) = lim_{Δx→0} Δy/Δx</div><p><b>Geometrik ma’nosi</b>: f′(x₀) = tg α — grafikka x₀ nuqtada o‘tkazilgan <b>urinmaning burchak koeffitsiyenti</b>.</p><p><b>Fizik ma’nosi</b>: s(t) — yo‘l bo‘lsa, <b>v(t) = s′(t)</b> — oniy tezlik; <b>a(t) = v′(t)</b> — tezlanish.</p><p>Iqtisodda — chegaraviy xarajat/foyda; kimyoda — reaksiya tezligi.</p><p>Ta’rif bo‘yicha: (x²)′: Δy = 2xΔx + Δx², Δy/Δx = 2x + Δx → 2x.</p>",
      "Hosila = urinma qiyaligi = oniy tezlik.",
      [["s(t) = t³ + 2t. t = 2 da tezlik?", ["v = 3t² + 2"], "14 m/s"], ["f(x) = x², x₀ = 3 da urinma burchak koeffitsiyenti?", ["f′ = 2x"], "6"]],
      [["Tezlik — yo‘lning:", ["Hosilasi", "Integrali", "Kvadrati", "Logarifmi"], "Derivative."], ["f′(x₀) = 1 bo‘lsa urinma Ox bilan:", ["45°", "0°", "90°", "30°"], "tg=1."], ["Tezlanish:", ["v′(t)", "s(t)", "∫v", "v²"], "Second derivative."]],
      [{ type: "tangent" }]),

    T("hosila-qoida", "Hosilani hisoblash qoidalari", "(u ± v)′, (uv)′, (u/v)′, jadval",
      "Har safar limit orqali hisoblash shart emas — hosilalar jadvali va qoidalar bilan istalgan ko‘phad yoki kasrning hosilasi bir qatorda topiladi.",
      "<p><b>Jadval</b>: C′ = 0; (xⁿ)′ = nxⁿ⁻¹; (√x)′ = 1/(2√x); (1/x)′ = −1/x²; (sin x)′ = cos x; (cos x)′ = −sin x; (eˣ)′ = eˣ; (aˣ)′ = aˣ ln a; (ln x)′ = 1/x; (tg x)′ = 1/cos²x.</p><p><b>Qoidalar</b>:</p><div class='fb'>(u ± v)′ = u′ ± v′;&nbsp; (Cu)′ = Cu′<br>(uv)′ = u′v + uv′<br>(u/v)′ = (u′v − uv′)/v²</div><p>Misol: (3x⁴ − 2x + 7)′ = 12x³ − 2; (x² sin x)′ = 2x sin x + x² cos x.</p>",
      "(xⁿ)′ = nxⁿ⁻¹; ko‘paytma — u′v + uv′.",
      [["(x³ − 4x² + x)′", ["3x² − 8x + 1"], "3x² − 8x + 1"], ["((x + 1)/(x − 1))′", ["((x − 1) − (x + 1))/(x − 1)²"], "−2/(x − 1)²"]],
      [["(x⁵)′", ["5x⁴", "x⁴", "5x⁵", "4x⁵"], "Power rule."], ["(sin x)′", ["cos x", "−cos x", "sin x", "−sin x"], "Table."], ["(7)′", ["0", "7", "1", "7x"], "Constant."]],
      [{ type: "tangent", fn: "x³ − 3x" }]),

    T("murakkab-hosila", "Murakkab funksiyaning hosilasi", "(f(g(x)))′ = f′(g(x))·g′(x)",
      "sin(3x), (2x + 1)¹⁰, e^(x²) — “funksiya ichida funksiya”. Zanjir qoidasi ularning hosilasini osongina topadi.",
      "<div class='fb'>(f(g(x)))′ = f′(g(x)) · g′(x)</div><p>“Tashqi funksiya hosilasi (ichki joyida qoladi) × ichki funksiya hosilasi”.</p><ul><li>((2x + 1)¹⁰)′ = 10(2x + 1)⁹·2 = 20(2x + 1)⁹;</li><li>(sin 3x)′ = 3cos 3x;</li><li>(e^(x²))′ = 2x·e^(x²);</li><li>(√(x² + 1))′ = x/√(x² + 1);</li><li>(ln(5x − 2))′ = 5/(5x − 2).</li></ul>",
      "Tashqi′ × ichki′.",
      [["(cos²x)′", ["2cos x·(−sin x)"], "−sin 2x"], ["((3x − 1)⁴)′", ["4(3x − 1)³·3"], "12(3x − 1)³"]],
      [["(sin 5x)′", ["5cos 5x", "cos 5x", "−5cos 5x", "5sin 5x"], "Chain."], ["(e^(2x))′", ["2e^(2x)", "e^(2x)", "2xe^x", "e²"], "Inner 2."], ["(ln x²)′", ["2/x", "1/x²", "2x", "1/(2x)"], "2x/x²."]],
      [{ type: "tangent", fn: "sin x" }]),

    T("urinma-normal", "Funksiya grafigiga o‘tkazilgan urinma va normal tenglamalari", "y = f(x₀) + f′(x₀)(x − x₀)",
      "Avtomobil fari egri yo‘lda urinma yo‘nalishida yoritadi; ko‘zgu nurni normal bo‘yicha aks ettiradi. Urinma va normal tenglamalari muhandislikda ko‘p ishlatiladi.",
      "<div class='fb'>Urinma: y = f(x₀) + f′(x₀)(x − x₀)<br>Normal: y = f(x₀) − (1/f′(x₀))(x − x₀)&nbsp; (f′(x₀) ≠ 0)</div><p><b>Algoritm</b>: f(x₀) → f′(x) → f′(x₀) → formulaga qo‘yish.</p><p>Misol: f(x) = x² − 3x, x₀ = 2: f(2) = −2, f′(x) = 2x − 3, f′(2) = 1 → urinma y = −2 + (x − 2) = x − 4.</p><p>Berilgan to‘g‘ri chiziqqa parallel urinma: f′(x₀) = k shartidan x₀ topiladi.</p>",
      "Nuqta + qiyalik = urinma tenglamasi.",
      [["f(x) = x³, x₀ = 1 urinma.", ["f(1) = 1, f′(1) = 3"], "y = 3x − 2"], ["y = x² ga y = 4x − 1 ga parallel urinma nuqtasi?", ["2x₀ = 4"], "x₀ = 2, (2; 4)"]],
      [["Urinma qiyaligi:", ["f′(x₀)", "f(x₀)", "x₀", "f″(x₀)"], "Slope."], ["Normal qiyaligi (f′ = 2):", ["−1/2", "2", "1/2", "−2"], "Perpendicular."], ["Gorizontal urinma bo‘lsa:", ["f′(x₀) = 0", "f(x₀) = 0", "x₀ = 0", "f′ = 1"], "Critical."]],
      [{ type: "tangent" }]),

    T("hosila-tekshirish", "Hosila yordamida funksiyani tekshirish va grafiklarni yasash", "Monotonlik, ekstremum, qavariqlik",
      "Hosila ishorasi funksiyaning qayerda o‘sishi va qayerda tushishini, nolga tengligi — cho‘qqi va chuqurliklarni ko‘rsatadi. Bu — grafik chizishning ilmiy usuli.",
      "<ul><li>f′(x) &gt; 0 — <b>o‘sadi</b>; f′(x) &lt; 0 — <b>kamayadi</b>;</li><li><b>Kritik nuqtalar</b>: f′(x) = 0 yoki mavjud emas;</li><li>f′ ishorasi + dan − ga o‘tsa — <b>maksimum</b>, − dan + ga — <b>minimum</b>;</li><li>f″(x) &gt; 0 — qavariq pastga (∪), f″ &lt; 0 — yuqoriga (∩); <b>egilish nuqtasi</b> — f″ ishorasi almashadi.</li></ul><p><b>Tekshirish sxemasi</b>: D(f) → juft/toq → nollar → f′ va kritik nuqtalar → monotonlik va ekstremumlar → f″ → asimptotalar → grafik.</p><p>Misol: f(x) = x³ − 3x: f′ = 3x² − 3 = 0 → x = ±1; max f(−1) = 2, min f(1) = −2.</p>",
      "f′: + → − maksimum, − → + minimum.",
      [["f(x) = x³ − 12x ekstremumlari.", ["f′ = 3x² − 12 = 0 → x = ±2", "f(−2) = 16, f(2) = −16"], "max 16, min −16"], ["f(x) = x⁴ − 2x² o‘sish oraliqlari.", ["f′ = 4x(x² − 1)"], "[−1; 0] va [1; +∞)"]],
      [["f′ > 0 bo‘lsa funksiya:", ["O‘sadi", "Kamayadi", "Maksimum", "Nol"], "Increasing."], ["Kritik nuqta:", ["f′(x) = 0", "f(x) = 0", "x = 0", "f″ = 1"], "Stationary."], ["f″ > 0 — grafik:", ["∪ (qavariq pastga)", "∩", "To‘g‘ri chiziq", "Uzilishli"], "Convex."]],
      [{ type: "tangent", fn: "x³ − 3x" }, { type: "signChart" }]),

    T("ekstremal-masala", "Geometrik, fizik, iqtisodiy mazmunli ekstremal masalalarni yechishda differensial hisob usullari", "Eng katta/eng kichik qiymat",
      "Bir xil tunuka bilan eng katta hajmli quti, eng arzon yo‘l, eng katta foyda — optimallashtirish masalalari hosila bilan yechiladi.",
      "<p><b>Kesmada eng katta/kichik qiymat</b>: kritik nuqtalar va kesma uchlaridagi qiymatlarni solishtirish.</p><p><b>Ekstremal masala algoritmi</b>:</p><ol><li>Optimallashtiriladigan kattalikni (yuza, hajm, xarajat) bitta o‘zgaruvchi funksiyasi sifatida ifodalash;</li><li>O‘zgaruvchining mumkin bo‘lgan oralig‘ini topish;</li><li>Hosila → kritik nuqtalar → eng katta/kichik qiymat;</li><li>Javobni ma’nosi bilan tekshirish.</li></ol><p>Misol: perimetri 40 m bo‘lgan to‘rtburchakning eng katta yuzasi: S = x(20 − x), S′ = 20 − 2x = 0 → x = 10 — kvadrat, S = 100 m².</p>",
      "Funksiya tuz → hosila = 0 → solishtir.",
      [["12×12 sm tunukadan burchaklarini x sm qirqib quti. Eng katta hajm?", ["V = x(12 − 2x)²", "V′ = 0 → x = 2"], "x = 2 sm, V = 128 sm³"], ["Foyda P(x) = −2x² + 80x − 300. Eng katta foyda?", ["P′ = −4x + 80 = 0 → x = 20"], "P = 500"]],
      [["f(x) = x² − 4x [0; 5] da eng kichik:", ["−4", "0", "5", "−5"], "x=2."], ["Perimetr 20, eng katta yuzali to‘rtburchak:", ["Kvadrat 5×5", "1×9", "2×8", "4×6"], "Square."], ["Ekstremal masalaning birinchi qadami:", ["Funksiya tuzish", "Grafik chizish", "Integral", "Limit"], "Model."]],
      [{ type: "tangent" }])
  ]);

  Y("11", "algebra", "II chorak", [
    T("taqribiy", "Taqribiy hisoblashlar", "f(x₀ + Δx) ≈ f(x₀) + f′(x₀)Δx",
      "√4,02 yoki 1,01¹⁰ ni kalkulyatorsiz qanday topish mumkin? Hosila funksiyani nuqta atrofida urinma bilan almashtirib, tez taqribiy hisob beradi.",
      "<div class='fb'>f(x₀ + Δx) ≈ f(x₀) + f′(x₀)·Δx</div><p>G‘oya: kichik oraliqda grafik deyarli urinma bilan ustma-ust.</p><ul><li>√4,02: f = √x, x₀ = 4, Δx = 0,02: 2 + (1/4)·0,02 = 2,005 (aniq: 2,00499…);</li><li>1,01¹⁰ ≈ 1 + 10·0,01 = 1,1 (aniq: 1,1046);</li><li>sin 0,05 ≈ 0,05 (kichik burchaklarda sin x ≈ x);</li><li>(1 + x)ⁿ ≈ 1 + nx, kichik x da.</li></ul><p>Xatolik Δx kichik bo‘lgani sari kamayadi.</p>",
      "Kichik Δx da funksiya ≈ urinma.",
      [["√9,06", ["3 + (1/6)·0,06"], "≈ 3,01"], ["2,001³", ["8 + 12·0,001"], "≈ 8,012"]],
      [["(1 + 0,02)⁵ ≈", ["1,1", "1,02", "1,01", "1,2"], "1+5·0,02."], ["sin 0,01 ≈", ["0,01", "0,1", "1", "0"], "Small angle."], ["Taqribiy formula asosi:", ["Urinma", "Integral", "Limit cheksizlikda", "Logarifm"], "Linearization."]],
      [{ type: "tangent" }]),

    T("modellash-hosila", "Hosila yordamida modellashtirish", "O‘zgarish tezligi, optimallash, harakat",
      "Kasallik qanchalik tez tarqalyapti? Suv idishda qanchalik tez ko‘tarilyapti? Hosila har qanday jarayonning tezligini modellaydi.",
      "<p><b>O‘zgarish tezligi</b>: agar Q(t) — kattalik, Q′(t) — uning tezligi (litr/s, kishi/kun, so‘m/dona).</p><ul><li><b>Fizika</b>: s(t), v = s′, a = v″; tok kuchi I = q′(t);</li><li><b>Biologiya</b>: populyatsiya o‘sish tezligi;</li><li><b>Iqtisod</b>: chegaraviy xarajat C′(x), chegaraviy daromad R′(x); maksimal foyda R′ = C′ da;</li><li><b>Geometriya</b>: shar hajmi o‘sish tezligi radius o‘sishiga qarab.</li></ul><p>Bog‘liq tezliklar: kattaliklar orasidagi formulani vaqt bo‘yicha differensiallash.</p>",
      "Q′(t) — Q ning tezligi.",
      [["Tosh: h(t) = 25t − 5t². Qachon eng yuqorida va qancha?", ["h′ = 25 − 10t = 0 → t = 2,5"], "31,25 m"], ["C(x) = 0,1x² + 5x + 100. 50-dona uchun chegaraviy xarajat?", ["C′ = 0,2x + 5"], "15"]],
      [["v(t) = 3t² da tezlanish t = 2:", ["12", "6", "3", "24"], "6t."], ["Maksimal foyda sharti:", ["R′ = C′", "R = C", "C′ = 0", "R = 0"], "Marginal."], ["h′(t) = 0 lahzada jism:", ["Eng yuqori nuqtada", "Yerga tushdi", "Eng tez", "Tezlanmoqda"], "Vertex."]],
      [{ type: "tangent" }, { type: "motion" }]),

    T("boshlangich", "Boshlang‘ich funksiya va aniqmas integral tushunchalari", "F′(x) = f(x), ∫f(x)dx = F(x) + C",
      "Tezlikdan yo‘lni, tezlanishdan tezlikni topish — hosilaning teskari amali. Bu boshlang‘ich funksiya va integral.",
      "<p><b>Boshlang‘ich funksiya</b>: F′(x) = f(x) bo‘lsa, F — f ning boshlang‘ich funksiyasi.</p><p>Har bir F + C ham boshlang‘ich (C — o‘zgarmas), chunki C′ = 0.</p><div class='fb'>∫f(x)dx = F(x) + C — aniqmas integral</div><p>Misollar: ∫2x dx = x² + C; ∫cos x dx = sin x + C.</p><p>Fizikada: v(t) = s′(t) → s(t) = ∫v(t)dt + s₀; boshlang‘ich shart C ni aniqlaydi.</p><p>Tekshiruv: integral natijasining hosilasi integral ostidagi funksiyaga teng bo‘lishi kerak.</p>",
      "Integral — hosilaning teskarisi; +C ni unutmang.",
      [["f(x) = 3x² ning (1; 5) dan o‘tuvchi boshlang‘ichi.", ["F = x³ + C", "1 + C = 5"], "F = x³ + 4"], ["v(t) = 2t + 3, s(0) = 0. s(t)?", ["s = t² + 3t + C, C = 0"], "s = t² + 3t"]],
      [["∫5 dx", ["5x + C", "5 + C", "0", "x⁵"], "Constant."], ["F(x) = x⁴ uchun f(x):", ["4x³", "x⁵/5", "4x⁴", "x³"], "Derivative."], ["∫f(x)dx natijasidagi C:", ["Ixtiyoriy o‘zgarmas", "Nol", "1", "x"], "Constant."]],
      [{ type: "integral" }]),

    T("integral-jadval", "Integrallar jadvali. Integrallashning eng sodda qoidalari", "∫xⁿdx, ∫(u ± v), ∫kf, ∫f(kx + b)",
      "Hosilalar jadvalini teskari o‘qisak — integrallar jadvali hosil bo‘ladi. Bir necha qoida bilan ko‘plab integrallar bir zumda hisoblanadi.",
      "<p><b>Jadval</b>: ∫xⁿdx = xⁿ⁺¹/(n + 1) + C (n ≠ −1); ∫dx/x = ln|x| + C; ∫eˣdx = eˣ + C; ∫aˣdx = aˣ/ln a + C; ∫sin x dx = −cos x + C; ∫cos x dx = sin x + C; ∫dx/cos²x = tg x + C.</p><p><b>Qoidalar</b>:</p><ul><li>∫(f ± g)dx = ∫f dx ± ∫g dx;</li><li>∫k·f dx = k∫f dx;</li><li>∫f(kx + b)dx = (1/k)F(kx + b) + C.</li></ul><p>Misol: ∫(3x² − 4x + 5)dx = x³ − 2x² + 5x + C; ∫cos 3x dx = (1/3)sin 3x + C.</p>",
      "∫xⁿ = xⁿ⁺¹/(n+1); ichki chiziqli bo‘lsa — 1/k.",
      [["∫(6x² + 2x − 1)dx", ["2x³ + x² − x + C"], "2x³ + x² − x + C"], ["∫(2x + 1)³dx", ["(1/2)·(2x + 1)⁴/4"], "(2x + 1)⁴/8 + C"]],
      [["∫x³dx", ["x⁴/4 + C", "3x² + C", "x⁴ + C", "4x⁴ + C"], "Power."], ["∫sin x dx", ["−cos x + C", "cos x + C", "sin x + C", "−sin x + C"], "Table."], ["∫e^(2x)dx", ["e^(2x)/2 + C", "2e^(2x) + C", "e^(2x) + C", "e^x + C"], "1/k."]],
      [{ type: "integral" }])
  ]);

  Y("11", "algebra", "III chorak", [
    T("aniq-integral", "Aniq integral. Nyuton–leybnis formulasi", "∫ₐᵇf(x)dx = F(b) − F(a)",
      "Egri chiziq ostidagi yuzani qanday topish mumkin? Uni ingichka to‘rtburchaklarga bo‘lib yig‘amiz — chegarada aniq integral hosil bo‘ladi.",
      "<p><b>Egri chiziqli trapetsiya</b> — y = f(x) ≥ 0, x = a, x = b va Ox bilan chegaralangan figura.</p><p><b>Aniq integral</b> — integral yig‘indilarning (to‘rtburchaklar yuzalari yig‘indisi) limiti.</p><div class='fb'>∫ₐᵇ f(x)dx = F(b) − F(a)&nbsp; (Nyuton–Leybnis)</div><p>Misol: ∫₀² x² dx = x³/3 |₀² = 8/3.</p><p><b>Xossalar</b>: ∫ₐᵃ = 0; ∫ₐᵇ = −∫ᵦᵃ; ∫ₐᵇ = ∫ₐᶜ + ∫꜀ᵇ; chiziqlilik.</p>",
      "F(b) − F(a): yuqori chegaradagi minus quyi chegaradagi.",
      [["∫₁³ 2x dx", ["x² |₁³ = 9 − 1"], "8"], ["∫₀^π sin x dx", ["−cos x |₀^π = 1 + 1"], "2"]],
      [["∫₀¹ x dx", ["1/2", "1", "0", "2"], "x²/2."], ["∫₂² f(x)dx", ["0", "f(2)", "2", "Aniqlanmagan"], "Same limits."], ["∫₀³ 1 dx", ["3", "1", "0", "9"], "Length."]],
      [{ type: "integral" }]),

    T("integral-tatbiq", "Aniq integralning tatbiqlari", "Yuza, hajm, yo‘l, ish",
      "Ko‘prik arkasi ostidagi yuza, idish hajmi, tezlikdan bosib o‘tilgan yo‘l, prujina cho‘zishdagi ish — hammasi aniq integral bilan hisoblanadi.",
      "<ul><li><b>Yuza</b>: S = ∫ₐᵇ f(x)dx (f ≥ 0); ikki egri orasida: S = ∫ₐᵇ (f(x) − g(x))dx (f ≥ g); kesishish nuqtalari — chegaralar;</li><li><b>Aylanish jismi hajmi</b>: V = π∫ₐᵇ f²(x)dx;</li><li><b>Yo‘l</b>: s = ∫v(t)dt;</li><li><b>Ish</b>: A = ∫F(x)dx (prujina: F = kx → A = kx²/2).</li></ul><p>Misol: y = x² va y = x orasidagi yuza: kesishish 0 va 1; S = ∫₀¹(x − x²)dx = 1/2 − 1/3 = 1/6.</p>",
      "Yuza = ∫(yuqori − pastki).",
      [["y = 4 − x² va Ox orasidagi yuza.", ["Chegaralar ±2", "∫(4 − x²)dx = 16 − 16/3"], "32/3"], ["v(t) = 3t² + 2, [0; 2] dagi yo‘l.", ["t³ + 2t |₀²"], "12 m"]],
      [["y = x, x ∈ [0; 2] ostidagi yuza:", ["2", "4", "1", "1/2"], "Triangle."], ["Aylanish jismi hajmi formulasi:", ["π∫f²dx", "∫f dx", "2π∫f", "∫f²"], "Disk."], ["Tezlikdan yo‘l:", ["∫v dt", "v′", "v²", "v/t"], "Integral."]],
      [{ type: "integral" }]),

    T("bob-takror-11", "Bobni takrorlash", "Limit, hosila, integral — bir sxemada",
      "Analiz asoslari uchta “ustun”da turadi: limit — poydevor, hosila — tezlik, integral — yig‘indi. Ularni birgalikda ishlatishni mashq qilamiz.",
      "<ul><li><b>Limit</b>: qo‘yish, 0/0 da ajratish, ∞/∞ da bosh hadlar, ajoyib limitlar;</li><li><b>Hosila</b>: jadval, qoidalar, murakkab funksiya, urinma, monotonlik, ekstremum, optimallashtirish;</li><li><b>Integral</b>: boshlang‘ich, jadval, Nyuton–Leybnis, yuza va hajm.</li></ul><p>Bog‘liqlik: (∫f)′ = f; ∫f′ = f + C. “Yo‘l – tezlik – tezlanish” zanjiri: s ⟶(′) v ⟶(′) a va teskari ∫.</p>",
      "Hosila ↔ integral — teskari amallar.",
      [["f(x) = x³ − 3x² ning [0; 3] dagi eng katta va kichik qiymati.", ["f′ = 3x² − 6x = 0 → x = 0, 2", "f(0) = 0, f(2) = −4, f(3) = 0"], "max 0, min −4"], ["y = x² − 2x va Ox orasidagi yuza.", ["Ildizlar 0, 2", "|∫₀²(x² − 2x)dx| = 4/3"], "4/3"]],
      [["(∫₀ˣ f(t)dt)′ =", ["f(x)", "F(x)", "0", "f′(x)"], "FTC."], ["lim_{x→0}(e^x − 1)/x", ["1", "0", "e", "∞"], "Derivative of e^x at 0."], ["f(x) = eˣ, f′(0) =", ["1", "0", "e", "∞"], "e⁰."]],
      [{ type: "tangent" }, { type: "integral" }]),

    T("kombinatorika-11", "Kombinatorika masalalari", "Pₙ, Aₙᵏ, Cₙᵏ, takrorli",
      "Parol kombinatsiyalari, sport turniri jadvali, lotereya ehtimoli — kombinatorika formulalari bilan hisoblanadi.",
      "<div class='fb'>Pₙ = n!<br>Aₙᵏ = n!/(n − k)! (tartib muhim)<br>Cₙᵏ = n!/(k!(n − k)!) (tartib muhim emas)</div><p><b>Takrorli</b>: o‘rinlashtirish nᵏ (PIN kod 10⁴); o‘rin almashtirish (“MATEMATIKA” harflari): 10!/(2!·3!·2!).</p><p>Xossalar: Cₙᵏ = Cₙⁿ⁻ᵏ; Cₙᵏ + Cₙᵏ⁺¹ = Cₙ₊₁ᵏ⁺¹ (Paskal).</p><p>Misollar: 10 jamoa — har biri har biri bilan bir marta: C₁₀² = 45 o‘yin; 1-, 2-, 3-o‘rinlar: A₁₀³ = 720; “5 dan 36” lotereya: C₃₆⁵ = 376 992.</p>",
      "Tartib muhim — A; muhim emas — C.",
      [["12 o‘quvchidan 3 kishilik guruh?", ["C₁₂³ = 12·11·10/6"], "220"], ["“KITOB” harflaridan 3 harfli (tartib bilan) so‘zlar?", ["A₅³ = 5·4·3"], "60"]],
      [["5! =", ["120", "25", "60", "720"], "Factorial."], ["C₆² =", ["15", "30", "12", "36"], "6·5/2."], ["A₇² =", ["42", "21", "49", "14"], "7·6."]],
      [{ type: "combi" }, { type: "pascal" }]),

    T("nyuton-binom", "Nyuton binomi", "(a + b)ⁿ = Σ Cₙᵏ aⁿ⁻ᵏ bᵏ",
      "(1,01)¹⁰⁰ ni yoki (x + 2)⁷ ni qavslarni ochmasdan hisoblash — Nyuton binomi va Paskal uchburchagi bilan.",
      "<div class='fb'>(a + b)ⁿ = Cₙ⁰aⁿ + Cₙ¹aⁿ⁻¹b + … + Cₙᵏaⁿ⁻ᵏbᵏ + … + Cₙⁿbⁿ</div><p><b>Umumiy had</b>: Tₖ₊₁ = Cₙᵏ aⁿ⁻ᵏ bᵏ.</p><p>Xossalar: hadlar soni n + 1; koeffitsiyentlar simmetrik; yig‘indisi Cₙ⁰ + … + Cₙⁿ = <b>2ⁿ</b>; o‘rtadagi koeffitsiyent eng katta.</p><p>Misol: (x + 2)⁴ = x⁴ + 8x³ + 24x² + 32x + 16.</p><p>(x² − 1/x)⁶ dagi ozod had: Tₖ₊₁ = C₆ᵏ x^(12 − 2k)(−1)ᵏx^(−k) → 12 − 3k = 0 → k = 4 → C₆⁴ = 15.</p>",
      "Koeffitsiyentlar — Paskal uchburchagi; yig‘indisi 2ⁿ.",
      [["(a − b)⁵ dagi 3-had.", ["T₃ = C₅²a³(−b)²"], "10a³b²"], ["(1 + x)¹⁰ koeffitsiyentlari yig‘indisi.", ["x = 1: 2¹⁰"], "1024"]],
      [["(a + b)⁶ da hadlar soni:", ["7", "6", "12", "64"], "n+1."], ["(a + b)⁴ dagi a²b² koeffitsiyenti:", ["6", "4", "2", "12"], "C₄²."], ["Cₙ⁰ + … + Cₙⁿ =", ["2ⁿ", "n!", "n²", "n"], "Sum."]],
      [{ type: "pascal" }]),

    T("statistik-malumot", "Statistik ma’lumotlar. statistik ma’lumotlarning turli ko‘rinishlari", "Tanlanma, chastota jadvali, poligon, gistogramma",
      "Saylov natijalari, sinf baholari, ob-havo — statistika ma’lumotni yig‘adi, tartiblaydi va ko‘rgazmali ko‘rsatadi.",
      "<p><b>Bosh to‘plam</b> — o‘rganilayotgan barcha obyektlar; <b>tanlanma</b> — ulardan tanlangan qism (reprezentativ bo‘lishi kerak).</p><p><b>Variatsion qator</b> — ma’lumotlarni o‘sish tartibida yozish.</p><p><b>Chastota jadvali</b>: qiymat — chastota (necha marta) — nisbiy chastota (%).</p><p><b>Grafik ko‘rinishlar</b>: ustunli diagramma, <b>chastotalar poligoni</b> (siniq chiziq), <b>gistogramma</b> (oraliqlar bo‘yicha), doiraviy diagramma, “quti-mo‘ylov” (box plot).</p><p>Ma’lumot turlari: miqdoriy (bo‘y, ball) va sifat (rang, fan).</p>",
      "Yig‘ → tartibla → jadval → grafik.",
      [["Baholar: 5, 4, 4, 3, 5, 5, 4, 5, 2, 5. Chastota jadvali.", ["5 — 5 marta, 4 — 3, 3 — 1, 2 — 1"], "5:5, 4:3, 3:1, 2:1"], ["“5” ning nisbiy chastotasi?", ["5/10"], "50%"]],
      [["Oraliqlar bo‘yicha diagramma:", ["Gistogramma", "Doiraviy", "Venn", "Gantt"], "Histogram."], ["Bosh to‘plamning qismi:", ["Tanlanma", "Chastota", "Moda", "Poligon"], "Sample."], ["Sifat ma’lumoti:", ["Sevimli rang", "Bo‘y", "Vazn", "Ball"], "Categorical."]],
      [{ type: "stats", data: [5, 4, 4, 3, 5, 5, 4, 5, 2, 5] }, { type: "chartMaker", data: [["2", 1], ["3", 1], ["4", 3], ["5", 5]], name: "Baholar chastotasi", xLabel: "Baho", yLabel: "Soni", max: 6 }]),

    T("orta-moda-mediana", "O‘rta qiymat, moda va mediana. Chetlashish, standart chetlashish", "x̄, Mo, Me, σ",
      "“O‘rtacha maosh” chalg‘itishi mumkin — bitta millioner o‘rtachani ko‘tarib yuboradi. Mediana va moda haqiqiy manzarani yaxshiroq ko‘rsatadi.",
      "<ul><li><b>O‘rta arifmetik</b> x̄ = (x₁ + … + xₙ)/n — chetdagi qiymatlarga sezgir;</li><li><b>Moda</b> Mo — eng ko‘p uchraydigan qiymat;</li><li><b>Mediana</b> Me — tartiblangan qatorning o‘rtasi (juft sonda — o‘rtadagi ikkisining o‘rtachasi) — chetdagi qiymatlarga chidamli;</li><li><b>Qamrov (размах)</b> = max − min;</li><li><b>Dispersiya</b> D = Σ(xᵢ − x̄)²/n; <b>standart chetlashish</b> σ = √D — tarqoqlik o‘lchovi.</li></ul><p>Misol: 2, 3, 3, 5, 7: x̄ = 4, Mo = 3, Me = 3, qamrov 5, D = (4 + 1 + 1 + 1 + 9)/5 = 3,2, σ ≈ 1,79.</p>",
      "Chetdagi qiymat bo‘lsa — mediana ishonchliroq.",
      [["Maoshlar (mln): 3, 3, 4, 4, 5, 50. O‘rtacha va mediana?", ["x̄ = 69/6 = 11,5", "Me = (4 + 4)/2 = 4"], "11,5 va 4 — mediana real holatni ko‘rsatadi"], ["4, 6, 8 standart chetlashishi?", ["x̄ = 6, D = (4 + 0 + 4)/3"], "σ ≈ 1,63"]],
      [["1, 2, 2, 3, 9 moda:", ["2", "3", "9", "1"], "Most frequent."], ["1, 3, 5, 7 mediana:", ["4", "3", "5", "16"], "(3+5)/2."], ["σ katta bo‘lsa:", ["Ma’lumot tarqoq", "Hammasi teng", "O‘rtacha katta", "Moda yo‘q"], "Spread."]],
      [{ type: "stats", data: [3, 3, 4, 4, 5, 9] }]),

    T("boglanish-tadqiq", "Ikkita tur ma’lumotlar o‘rtasida bog‘liqlikni tadqiq qilish", "Nuqtali diagramma, korrelyatsiya, regressiya",
      "Ko‘proq o‘qigan o‘quvchi yuqori ball oladimi? Ikki o‘zgaruvchi bog‘liqligini nuqtali diagramma va korrelyatsiya koeffitsiyenti ko‘rsatadi.",
      "<p><b>Ikki o‘lchovli ma’lumot</b>: (xᵢ; yᵢ) juftliklar — masalan, o‘qish soati va ball.</p><p><b>Nuqtali diagramma (scatter plot)</b> — bog‘liqlikni ko‘rish: nuqtalar yuqoriga ko‘tarilsa — musbat, pastga — manfiy, tartibsiz — bog‘liqlik yo‘q.</p><p><b>Korrelyatsiya koeffitsiyenti r</b> (−1 ≤ r ≤ 1): r ≈ 1 — kuchli musbat, r ≈ −1 — kuchli manfiy, r ≈ 0 — chiziqli bog‘liqlik yo‘q.</p><p><b>Regressiya to‘g‘ri chizig‘i</b> y = kx + b — bashorat uchun (Excel: trend chizig‘i).</p><p>⚠️ <b>Korrelyatsiya ≠ sabab</b>: muzqaymoq savdosi va cho‘kishlar soni bog‘liq — sababi yoz issig‘i!</p>",
      "Bog‘liqlik bor — sabab bo‘lishi shart emas.",
      [["O‘qish soati: 1, 2, 3, 4; ball: 55, 65, 72, 85. Bog‘liqlik?", ["Ikkalasi birga o‘sadi"], "Kuchli musbat"], ["Regressiya y = 9,6x + 45. 5 soat o‘qisa?", ["9,6·5 + 45"], "≈ 93 ball"]],
      [["r = −0,9:", ["Kuchli manfiy bog‘liqlik", "Bog‘liqlik yo‘q", "Kuchli musbat", "Sabab-oqibat"], "Negative."], ["Bog‘liqlikni ko‘rsatuvchi diagramma:", ["Nuqtali", "Doiraviy", "Gantt", "Venn"], "Scatter."], ["Korrelyatsiya sababni isbotlaydimi?", ["Yo‘q", "Ha", "Faqat r = 1 da", "Faqat musbatda"], "No."]],
      [{ type: "sheet", data: [["Soat", "Ball"], [1, 55], [2, 65], [3, 72], [4, 85], [5, "=ROUND(9.6*A6+45;0)"]], cols: 2, rows: 6, chart: { col: "B", label: "A", from: 2, to: 6 }, hint: "5-qator — regressiya bashorati: y = 9,6x + 45." }])
  ]);

  Y("11", "algebra", "IV chorak", [
    T("tasodifiy-11", "Tasodifiy hodisalar va ularning ehtimolligi haqida tushuncha", "Klassik ehtimollik, kombinatorika bilan",
      "Lotereya, imtihon biletlari, sifat nazorati — ehtimollik kombinatorika bilan birlashganda kuchli vositaga aylanadi.",
      "<p>P(A) = m/n, bunda m va n ko‘pincha kombinatorika formulalari bilan topiladi.</p><p>Misol: 25 biletdan 5 tasini o‘quvchi bilmaydi. Tasodifiy olingan bilet ma’lum bo‘lishi: 20/25 = 0,8.</p><p>Misol: 10 detaldan 3 tasi nuqsonli, 2 ta olinadi. Ikkalasi sifatli: C₇²/C₁₀² = 21/45 = 7/15.</p><p>Misol: “5 dan 36” lotereyada 5 tasini topish: 1/C₃₆⁵ ≈ 0,0000027.</p>",
      "m va n — kombinatorika bilan.",
      [["Qutida 5 oq, 3 qora shar; 2 ta olinadi. Ikkalasi oq?", ["C₅²/C₈² = 10/28"], "5/14"], ["Uchta tanga: kamida bitta gerb?", ["1 − P(hech qaysi) = 1 − 1/8"], "7/8"]],
      [["Ikki zar: yig‘indi 7:", ["1/6", "7/36", "1/12", "1/7"], "6/36."], ["P(A) = 0,35, P(Ā) =", ["0,65", "0,35", "1,35", "0"], "Complement."], ["Kamida bitta... topishda qulay:", ["Qarama-qarshi hodisa", "Ko‘paytirish", "Integral", "Limit"], "Complement."]],
      [{ type: "probability" }]),

    T("hodisa-amal-11", "Qarama-qarshi hodisa. Hodisalar ustida amallar va ularni Eyler-Venn diagrammalarda tasvirlash", "A ∪ B, A ∩ B, Ā",
      "Sinfda 18 kishi futbol, 12 kishi shaxmat o‘ynaydi, 5 kishi ikkalasini — sinfda nechta sportchi bor? Venn diagrammasi bilan darhol ko‘rinadi.",
      "<p><b>Amallar</b>: A ∪ B (yoki), A ∩ B (va), Ā (emas), A \\ B (A, lekin B emas).</p><p><b>Eyler-Venn diagrammasi</b>: to‘rtburchak — barcha natijalar, doiralar — hodisalar, kesishma — A ∩ B.</p><p>De Morgan qonunlari: (A ∪ B)‾ = Ā ∩ B̄; (A ∩ B)‾ = Ā ∪ B̄.</p><p>Sanash formulasi: n(A ∪ B) = n(A) + n(B) − n(A ∩ B): 18 + 12 − 5 = 25 kishi.</p>",
      "Birlashmada kesishma ikki marta sanalmasin.",
      [["30 o‘quvchi: 18 ingliz, 14 rus, 6 ikkalasi. Hech birini o‘qimaydigan?", ["18 + 14 − 6 = 26"], "4 kishi"], ["Zar: A — juft, B — ≤ 3. A ∩ B?", ["{2, 4, 6} ∩ {1, 2, 3}"], "{2}"]],
      [["n(A) = 10, n(B) = 8, n(A∩B) = 3; n(A∪B) =", ["15", "18", "21", "13"], "Inclusion-exclusion."], ["(A ∪ B)‾ =", ["Ā ∩ B̄", "Ā ∪ B̄", "A ∩ B", "Ā"], "De Morgan."], ["Faqat A:", ["A \\ B", "A ∩ B", "A ∪ B", "B \\ A"], "Difference."]],
      [{ type: "venn" }]),

    T("ehtimol-qoshish", "Ehtimolliklarni qo‘shish va ko‘paytirish, sodda hodisalarning ehtimolliklarni hisoblash usullari", "P(A + B), P(AB), bog‘liqsizlik",
      "Ikki mergan nishonga otadi: biri 0,8, ikkinchisi 0,7 ehtimol bilan uradi. Nishonga kamida bitta o‘q tegish ehtimoli qancha? Qo‘shish va ko‘paytirish qoidalari javob beradi.",
      "<div class='fb'>P(A + B) = P(A) + P(B) − P(AB)<br>Birgalikda bo‘lmasa: P(A + B) = P(A) + P(B)<br>Bog‘liqsiz bo‘lsa: P(AB) = P(A)·P(B)<br>Shartli: P(B|A) = P(AB)/P(A)</div><p>Mergan misoli: hech biri tegmasligi 0,2·0,3 = 0,06 → kamida bitta = 1 − 0,06 = 0,94.</p><p><b>To‘liq ehtimollik</b>: P(A) = ΣP(Hᵢ)·P(A|Hᵢ) — turli zavodlardan kelgan detallar sifati.</p>",
      "“Va” — ko‘paytir, “yoki” (birgalikda emas) — qo‘sh.",
      [["Ikki tanga: ikkalasi gerb?", ["Bog‘liqsiz: 1/2 · 1/2"], "1/4"], ["P(A) = 0,6, P(B) = 0,5, bog‘liqsiz. P(A + B)?", ["0,6 + 0,5 − 0,3"], "0,8"]],
      [["Bog‘liqsiz: P(A) = 0,3, P(B) = 0,4, P(AB) =", ["0,12", "0,7", "0,1", "0,34"], "Product."], ["Birgalikda bo‘lmagan: P(A) = 0,2, P(B) = 0,5, P(A+B) =", ["0,7", "0,1", "0,3", "0,6"], "Sum."], ["Uch marta tanga, hammasi gerb:", ["1/8", "1/6", "3/8", "1/2"], "(1/2)³."]],
      [{ type: "probability" }, { type: "venn" }]),

    T("binomial-normal", "Binomial va normal taqsimot haqida tushuncha", "Bernulli formulasi, “qo‘ng‘iroq” egri chizig‘i",
      "Futbolchi 10 ta penaltidan aniq 8 tasini urish ehtimoli — binomial taqsimot. Minglab o‘quvchilarning DTM ballari — normal taqsimotga yaqin “qo‘ng‘iroq”.",
      "<p><b>Bernulli sxemasi</b>: n ta bog‘liqsiz sinov, har birida “muvaffaqiyat” ehtimoli p:</p><div class='fb'>Pₙ(k) = Cₙᵏ pᵏ (1 − p)ⁿ⁻ᵏ</div><p>Matematik kutilma M = np, dispersiya D = np(1 − p).</p><p>Misol: 4 ta tanga, aniq 2 ta gerb: C₄²(1/2)⁴ = 6/16 = 3/8.</p><p><b>Normal taqsimot</b> — o‘rtacha μ va standart chetlashish σ bilan “qo‘ng‘iroq” shakli; ko‘p tasodifiy omillar yig‘indisi shunday taqsimlanadi (bo‘y, xatoliklar, test ballari). <b>68–95–99,7</b> qoidasi. n katta bo‘lsa binomial taqsimot normalga yaqinlashadi.</p>",
      "Pₙ(k) = Cₙᵏ pᵏ qⁿ⁻ᵏ; μ ± 2σ da ~95%.",
      [["Penalti 0,8 ehtimol bilan, 3 tadan aniq 2 tasi?", ["C₃²·0,8²·0,2 = 3·0,64·0,2"], "0,384"], ["Ballar μ = 120, σ = 15. 90–150 oralig‘ida taxminan qancha?", ["μ ± 2σ"], "≈ 95%"]],
      [["Binomial: n = 100, p = 0,3, M =", ["30", "70", "0,3", "100"], "np."], ["μ ± σ oralig‘ida:", ["≈ 68%", "≈ 95%", "≈ 50%", "100%"], "Rule."], ["Normal egri chiziq shakli:", ["Qo‘ng‘iroq", "To‘g‘ri chiziq", "Parabola", "Sinusoida"], "Bell."]],
      [{ type: "normalCurve" }, { type: "pascal" }]),

    T("kurs-takror", "Algebra va analiz asoslari kursini takrorlash", "Yakuniy takrorlash: DTM tayyorgarligi",
      "Maktab kursining yakuni — imtihon va DTM ga tayyorgarlik. Barcha mavzularni bitta tizimga solamiz.",
      "<p><b>Takrorlash xaritasi</b>:</p><ul><li><b>Ifodalar</b>: daraja, ildiz, logarifm, trigonometrik ayniyatlar;</li><li><b>Tenglamalar va tengsizliklar</b>: chiziqli, kvadrat, ratsional, irratsional, ko‘rsatkichli, logarifmik, trigonometrik; sistemalar;</li><li><b>Funksiyalar</b>: xossalar, grafiklar, almashtirishlar;</li><li><b>Progressiyalar</b>;</li><li><b>Analiz</b>: limit, hosila (urinma, ekstremum), integral (yuza);</li><li><b>Kombinatorika, ehtimollik, statistika</b>.</li></ul><p>Maslahat: har bir mavzudan 5 tadan masala, xatolar daftari, vaqtga yechish.</p><p>Bu sayt “Amaliy dars → Oq to‘plam” bo‘limida DTM mavzulari bo‘yicha qo‘shimcha tayyorgarlik bor.</p>",
      "Tizim + mashq + xatolar ustida ishlash.",
      [["log₂(x + 1) + log₂(x − 1) = 3", ["x² − 1 = 8, x > 1"], "x = 3"], ["f(x) = x³ − 3x², [−1; 3] da max/min.", ["f′ = 0: x = 0, 2", "f(−1) = −4, f(0) = 0, f(2) = −4, f(3) = 0"], "max 0, min −4"]],
      [["∫₀¹ 3x² dx", ["1", "3", "1/3", "0"], "x³."], ["sin 2x = 0:", ["x = πk/2", "x = πk", "x = 2πk", "x = π/4"], "2x=πk."], ["C₅² · 2! =", ["20", "10", "40", "5"], "A₅²."]],
      [{ type: "tangent" }, { type: "funcShift" }])
  ]);
})();
