/* KIMYO LABORATORIYASI — ma'lumotlar: 118 element, reaktivlar, reaksiyalar va tajribalar.
   Barcha tajribalar maktab kimyo dasturidagi xavfsiz (yoki o'qituvchi ko'rsatadigan) tajribalar. */
(() => {
  "use strict";

  // =====================================================================
  // 1. MENDELEYEV DAVRIY JADVALI — 118 element
  // [belgi, o'zbekcha nomi, atom massasi, kategoriya]
  // kategoriya: a — ishqoriy metall, e — ishqoriy-yer metall, t — o'tish metall, p — o'tishdan keyingi metall,
  //             m — yarimmetall, n — metallmas, h — galogen, g — inert gaz, l — lantanoid, c — aktinoid
  // =====================================================================
  const RAW = [
    ["H", "Vodorod", 1.008, "n"], ["He", "Geliy", 4.0026, "g"],
    ["Li", "Litiy", 6.94, "a"], ["Be", "Berilliy", 9.0122, "e"], ["B", "Bor", 10.81, "m"], ["C", "Uglerod", 12.011, "n"], ["N", "Azot", 14.007, "n"], ["O", "Kislorod", 15.999, "n"], ["F", "Ftor", 18.998, "h"], ["Ne", "Neon", 20.18, "g"],
    ["Na", "Natriy", 22.99, "a"], ["Mg", "Magniy", 24.305, "e"], ["Al", "Alyuminiy", 26.982, "p"], ["Si", "Kremniy", 28.085, "m"], ["P", "Fosfor", 30.974, "n"], ["S", "Oltingugurt", 32.06, "n"], ["Cl", "Xlor", 35.45, "h"], ["Ar", "Argon", 39.948, "g"],
    ["K", "Kaliy", 39.098, "a"], ["Ca", "Kalsiy", 40.078, "e"], ["Sc", "Skandiy", 44.956, "t"], ["Ti", "Titan", 47.867, "t"], ["V", "Vanadiy", 50.942, "t"], ["Cr", "Xrom", 51.996, "t"], ["Mn", "Marganes", 54.938, "t"], ["Fe", "Temir", 55.845, "t"], ["Co", "Kobalt", 58.933, "t"], ["Ni", "Nikel", 58.693, "t"], ["Cu", "Mis", 63.546, "t"], ["Zn", "Rux", 65.38, "t"], ["Ga", "Galliy", 69.723, "p"], ["Ge", "Germaniy", 72.63, "m"], ["As", "Margimush", 74.922, "m"], ["Se", "Selen", 78.971, "n"], ["Br", "Brom", 79.904, "h"], ["Kr", "Kripton", 83.798, "g"],
    ["Rb", "Rubidiy", 85.468, "a"], ["Sr", "Stronsiy", 87.62, "e"], ["Y", "Ittriy", 88.906, "t"], ["Zr", "Sirkoniy", 91.224, "t"], ["Nb", "Niobiy", 92.906, "t"], ["Mo", "Molibden", 95.95, "t"], ["Tc", "Texnetsiy", 98, "t"], ["Ru", "Ruteniy", 101.07, "t"], ["Rh", "Rodiy", 102.91, "t"], ["Pd", "Palladiy", 106.42, "t"], ["Ag", "Kumush", 107.87, "t"], ["Cd", "Kadmiy", 112.41, "t"], ["In", "Indiy", 114.82, "p"], ["Sn", "Qalay", 118.71, "p"], ["Sb", "Surma", 121.76, "m"], ["Te", "Tellur", 127.6, "m"], ["I", "Yod", 126.9, "h"], ["Xe", "Ksenon", 131.29, "g"],
    ["Cs", "Seziy", 132.91, "a"], ["Ba", "Bariy", 137.33, "e"],
    ["La", "Lantan", 138.91, "l"], ["Ce", "Seriy", 140.12, "l"], ["Pr", "Prazeodim", 140.91, "l"], ["Nd", "Neodim", 144.24, "l"], ["Pm", "Prometiy", 145, "l"], ["Sm", "Samariy", 150.36, "l"], ["Eu", "Yevropiy", 151.96, "l"], ["Gd", "Gadoliniy", 157.25, "l"], ["Tb", "Terbiy", 158.93, "l"], ["Dy", "Disproziy", 162.5, "l"], ["Ho", "Golmiy", 164.93, "l"], ["Er", "Erbiy", 167.26, "l"], ["Tm", "Tuliy", 168.93, "l"], ["Yb", "Itterbiy", 173.05, "l"], ["Lu", "Lyutetsiy", 174.97, "l"],
    ["Hf", "Gafniy", 178.49, "t"], ["Ta", "Tantal", 180.95, "t"], ["W", "Volfram", 183.84, "t"], ["Re", "Reniy", 186.21, "t"], ["Os", "Osmiy", 190.23, "t"], ["Ir", "Iridiy", 192.22, "t"], ["Pt", "Platina", 195.08, "t"], ["Au", "Oltin", 196.97, "t"], ["Hg", "Simob", 200.59, "t"], ["Tl", "Talliy", 204.38, "p"], ["Pb", "Qo‘rg‘oshin", 207.2, "p"], ["Bi", "Vismut", 208.98, "p"], ["Po", "Poloniy", 209, "p"], ["At", "Astat", 210, "h"], ["Rn", "Radon", 222, "g"],
    ["Fr", "Fransiy", 223, "a"], ["Ra", "Radiy", 226, "e"],
    ["Ac", "Aktiniy", 227, "c"], ["Th", "Toriy", 232.04, "c"], ["Pa", "Protaktiniy", 231.04, "c"], ["U", "Uran", 238.03, "c"], ["Np", "Neptuniy", 237, "c"], ["Pu", "Plutoniy", 244, "c"], ["Am", "Ametsiy", 243, "c"], ["Cm", "Kyuriy", 247, "c"], ["Bk", "Berkliy", 247, "c"], ["Cf", "Kaliforniy", 251, "c"], ["Es", "Eynshteyniy", 252, "c"], ["Fm", "Fermiy", 257, "c"], ["Md", "Mendeleviy", 258, "c"], ["No", "Nobeliy", 259, "c"], ["Lr", "Lourensiy", 266, "c"],
    ["Rf", "Rezerfordiy", 267, "t"], ["Db", "Dubniy", 268, "t"], ["Sg", "Siborgiy", 269, "t"], ["Bh", "Boriy", 270, "t"], ["Hs", "Xassiy", 269, "t"], ["Mt", "Meytneriy", 278, "t"], ["Ds", "Darmshtadtiy", 281, "t"], ["Rg", "Rentgeniy", 282, "t"], ["Cn", "Kopernitsiy", 285, "t"], ["Nh", "Nixoniy", 286, "p"], ["Fl", "Fleroviy", 289, "p"], ["Mc", "Moskoviy", 290, "p"], ["Lv", "Livermoriy", 293, "p"], ["Ts", "Tennessin", 294, "h"], ["Og", "Oganesson", 294, "g"]
  ];
  const CATS = {
    a: { name: "Ishqoriy metall", color: "#ff7a6b" }, e: { name: "Ishqoriy-yer metall", color: "#ffb84d" }, t: { name: "O‘tish metali", color: "#f5d76e" },
    p: { name: "Oddiy metall", color: "#9fd4a3" }, m: { name: "Yarimmetall", color: "#7fd1c7" }, n: { name: "Metallmas", color: "#8fc1ff" },
    h: { name: "Galogen", color: "#b9a6ff" }, g: { name: "Inert gaz", color: "#e59cf2" }, l: { name: "Lantanoid", color: "#ffa6c9" }, c: { name: "Aktinoid", color: "#ff9db0" }
  };
  // Xona haroratida holati: g — gaz, s — suyuq, q — qattiq, x — noma'lum (sun'iy, juda qisqa yashaydi)
  const GAS = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86]), LIQ = new Set([35, 80]);
  const state = (z) => (GAS.has(z) ? "g" : LIQ.has(z) ? "s" : z > 100 ? "x" : "q");
  const STATE_NAME = { g: "Gaz", s: "Suyuqlik", q: "Qattiq modda", x: "Noma’lum (sun’iy element)" };
  // Radioaktiv elementlar
  const radio = (z) => z === 43 || z === 61 || z >= 84;

  // Davr va guruh (jadvaldagi joyi)
  function place(z) {
    if (z <= 2) return { period: 1, group: z === 1 ? 1 : 18 };
    if (z <= 36) return { period: 4, group: z - 18 };
    if (z <= 54) return { period: 5, group: z - 36 };
    if (z <= 86) { if (z <= 56) return { period: 6, group: z - 54 }; if (z <= 71) return { period: 6, group: 3, f: z - 57 }; return { period: 6, group: z - 68 }; }
    if (z <= 88) return { period: 7, group: z - 86 };
    if (z <= 103) return { period: 7, group: 3, f: z - 89 };
    return { period: 7, group: z - 100 };
  }
  // 2- va 3-davr uchun guruhni aniq belgilaymiz (yuqoridagi umumiy formula o'rniga)
  const G23 = [1, 2, 13, 14, 15, 16, 17, 18];
  function placeFix(z) {
    if (z >= 3 && z <= 10) return { period: 2, group: G23[z - 3] };
    if (z >= 11 && z <= 18) return { period: 3, group: G23[z - 11] };
    return place(z);
  }

  // Elektron konfiguratsiyasi (Aufbau qoidasi + ma'lum istisnolar)
  const ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const EXC = {
    24: { "3d": 5, "4s": 1 }, 29: { "3d": 10, "4s": 1 }, 41: { "4d": 4, "5s": 1 }, 42: { "4d": 5, "5s": 1 }, 44: { "4d": 7, "5s": 1 }, 45: { "4d": 8, "5s": 1 },
    46: { "4d": 10, "5s": 0 }, 47: { "4d": 10, "5s": 1 }, 57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 }, 78: { "5d": 9, "6s": 1 },
    79: { "5d": 10, "6s": 1 }, 89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 }, 93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 }, 103: { "6d": 0, "7p": 1 }
  };
  function config(z) {
    const occ = {};
    let left = z;
    for (const sub of ORDER) { if (left <= 0) break; const n = Math.min(CAP[sub[1]], left); occ[sub] = n; left -= n; }
    const ex = EXC[z];
    if (ex) {
      // istisno: elektronlarni qayta taqsimlaymiz (umumiy son saqlanadi)
      let diff = 0;
      Object.entries(ex).forEach(([sub, n]) => { diff += (occ[sub] || 0) - n; occ[sub] = n; });
      if (diff !== 0) { const last = ORDER.filter((s) => occ[s] !== undefined && !(s in ex)).pop(); if (last) occ[last] += diff; }
    }
    const subs = ORDER.filter((s) => occ[s] > 0).sort((a, b) => (a[0] - b[0]) || ("spdf".indexOf(a[1]) - "spdf".indexOf(b[1])));
    const full = subs.map((s) => s + sup(occ[s])).join(" ");
    const shells = [];
    subs.forEach((s) => { const n = +s[0]; shells[n - 1] = (shells[n - 1] || 0) + occ[s]; });
    for (let i = 0; i < shells.length; i++) shells[i] = shells[i] || 0;
    // inert gaz qisqartmasi
    const NOBLE = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]];
    let short = full;
    for (const [nz, sym] of NOBLE) {
      if (z > nz) {
        const core = config.cache[nz] || (config.cache[nz] = config(nz).full);
        const rest = full.split(" ").filter((t) => !core.split(" ").includes(t));
        short = `[${sym}] ` + rest.join(" ");
        break;
      }
    }
    return { full, short, shells, valence: shells[shells.length - 1] };
  }
  config.cache = {};
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  function sup(n) { return String(n).split("").map((d) => SUP[d]).join(""); }

  // Qisqa ma'lumot va qo'llanilishi (ko'p uchraydigan elementlar uchun)
  const INFO = {
    1: "Koinotdagi eng ko‘p va eng yengil element. Suv tarkibida bor. Raketa yoqilg‘isi va “toza” energiya manbai.",
    2: "Havodan yengil, yonmaydigan gaz — havo sharlari va dirijabllar to‘ldiriladi. Quyosh shu elementdan nur sochadi.",
    3: "Eng yengil metall. Telefon va elektromobil akkumulyatorlarining asosi.",
    4: "Yengil va mustahkam metall. Kosmik apparatlar va rentgen asboblarida ishlatiladi.",
    5: "Shisha idishlarni issiqqa chidamli qiladi (borosilikat shisha). Bor kislota — antiseptik.",
    6: "Hayotning asosi! Olmos, grafit (qalam o‘zagi) va ko‘mir — hammasi uglerod.",
    7: "Havoning 78 % i azot. O‘g‘itlar, ammiak ishlab chiqarishda kerak.",
    8: "Nafas olish uchun zarur. Havoning 21 % i. Yonish kislorodsiz bo‘lmaydi.",
    9: "Eng faol metallmas. Tish pastasidagi ftoridlar tishni kariesdan saqlaydi.",
    10: "Reklama lampalari yorqin qizil-to‘q sariq nur sochadi.",
    11: "Juda faol yumshoq metall — suvda “yuguradi”. Osh tuzi (NaCl) tarkibida.",
    12: "Yonganda ko‘zni qamashtiruvchi oq nur beradi. Yengil qotishmalar, mushak va asab uchun muhim.",
    13: "Yengil, zanglamaydigan metall. Samolyot, idish, folga va simlar.",
    14: "Qum (SiO₂) tarkibida. Kompyuter mikrochiplari va quyosh panellari kremniydan.",
    15: "Gugurt qutisining yon tomoni. DNK va suyaklarda bor, o‘g‘itlarda ishlatiladi.",
    16: "Sariq kukun. Rezina, sulfat kislota va gugurt ishlab chiqarishda.",
    17: "Yashil-sariq zaharli gaz. Ichimlik suvini va basseynlarni zararsizlantiradi.",
    18: "Havoda 1 % bor. Payvandlash va lampalarda himoya gazi.",
    19: "O‘simliklar uchun eng muhim o‘g‘it elementi. Banan kaliyga boy.",
    20: "Suyak va tishlar mustahkamligi. Bo‘r, marmar, ohak — kalsiy birikmalari.",
    22: "Yengil va juda mustahkam. Implantlar, samolyot va velosiped ramalari.",
    24: "Zanglamaydigan po‘lat va yaltiroq xrom qoplamalar.",
    25: "Po‘lat ishlab chiqarishda. Kaliy permanganat (marganovka) — antiseptik.",
    26: "Eng ko‘p ishlatiladigan metall — po‘lat va cho‘yan. Qondagi gemoglobin kislorodni temir yordamida tashiydi.",
    27: "Ko‘k rangli bo‘yoqlar, magnitlar va akkumulyatorlar.",
    28: "Tangalar, zanglamaydigan po‘lat va akkumulyatorlar.",
    29: "Elektr simlarining asosi — tokni juda yaxshi o‘tkazadi. Bronza va latun qotishmalari.",
    30: "Temirni zanglashdan saqlaydi (ruxlangan tunuka). Immunitet uchun muhim.",
    31: "Qo‘lda eriydi (29,8 °C da)! Svetodiodlar (LED) ishlab chiqarishda.",
    32: "Yarimo‘tkazgich — optik tolalar va infraqizil asboblar.",
    33: "Margimush birikmalari zaharli. Yarimo‘tkazgichlarda ishlatiladi.",
    35: "Xona haroratida suyuq bo‘lgan yagona metallmas — to‘q qizil-qo‘ng‘ir suyuqlik.",
    36: "Yorug‘ chiroqlar va fotografiya chaqnoqlarida.",
    38: "Mushaklarda qizil rang beradi — salyut va mash’alalar.",
    40: "Korroziyaga chidamli — atom reaktorlari, sun’iy olmos (fianit).",
    42: "Po‘latni mustahkam qiladi. O‘simliklar uchun mikroelement.",
    46: "Avtomobil katalizatorlari va zargarlik buyumlari.",
    47: "Elektr tokini eng yaxshi o‘tkazadigan metall. Zargarlik, ko‘zgu va tangalar.",
    50: "Konserva bankalari qalay bilan qoplanadi. Bronza = mis + qalay.",
    53: "Yod tanqisligi qalqonsimon bez kasalligiga olib keladi — yodlangan tuz! Yod eritmasi — antiseptik.",
    54: "Avtomobil faralari va kosmik kemalarning ion dvigatellarida.",
    55: "Atom soatlari — eng aniq vaqt o‘lchagichlar.",
    56: "Salyutlarda yashil rang. Bariy sulfat — rentgen tekshiruvida.",
    60: "Eng kuchli doimiy magnitlar (quloqchinlar, elektromotorlar).",
    74: "Eng yuqori erish haroratiga ega metall (3422 °C). Cho‘g‘lanma lampalar tolasi.",
    78: "Qimmatbaho metall, avtomobil katalizatorlari va laboratoriya simlari.",
    79: "Zanglamaydi, ming yillar davomida yaltiraydi. Zargarlik, elektronika. O‘zbekistonda (Muruntov) yirik konlar bor!",
    80: "Xona haroratida suyuq metall. Zaharli! Eski termometrlarda ishlatilgan.",
    82: "Og‘ir metall, radiatsiyadan himoya qiladi. Akkumulyatorlar. Zaharli.",
    83: "Kam zaharli og‘ir metall, dori-darmonlarda.",
    86: "Radioaktiv gaz, yer ostidan chiqadi.",
    88: "Mariya Kyuri kashf etgan. Qorong‘ida yaltiraydi, radioaktiv.",
    92: "Atom elektr stansiyalarining yoqilg‘isi. O‘zbekistonda (Navoiy) qazib olinadi.",
    94: "Atom energetikasi va kosmik apparatlarning batareyalari.",
    95: "Tutun datchiklarida juda oz miqdorda ishlatiladi.",
    101: "Dmitriy Mendeleyev sharafiga nomlangan — davriy jadval muallifi!",
    118: "Eng og‘ir ma’lum element. Faqat bir necha atomi sun’iy olingan."
  };
  const CAT_INFO = {
    a: "Juda faol yumshoq metall, suv bilan shiddatli reaksiyaga kirishadi. Tabiatda faqat birikma holida uchraydi.",
    e: "Faol metall, birikmalari tabiatda keng tarqalgan (minerallar, tuzlar).",
    t: "O‘tish metali: odatda qattiq, yaltiroq, elektr tokini yaxshi o‘tkazadi; birikmalari rang-barang.",
    p: "Yumshoqroq metall, past haroratda eriydi, qotishmalarda ishlatiladi.",
    m: "Yarimmetall: ham metall, ham metallmas xossalariga ega; yarimo‘tkazgich sifatida muhim.",
    n: "Metallmas: elektr tokini yomon o‘tkazadi, tirik organizmlar tarkibida keng uchraydi.",
    h: "Galogen (“tuz hosil qiluvchi”): juda faol, metallar bilan tuzlar hosil qiladi.",
    g: "Inert gaz: deyarli reaksiyaga kirishmaydi, rangsiz va hidsiz; elektr toki o‘tganda rangli nur sochadi.",
    l: "Lantanoid (“nodir yer metali”): kuchli magnitlar, lazer va ekranlarda ishlatiladi.",
    c: "Aktinoid: radioaktiv og‘ir metall; ko‘pi faqat laboratoriyada sun’iy olingan."
  };

  const ELEMENTS = RAW.map(([sym, name, mass, cat], i) => {
    const z = i + 1, pl = placeFix(z), cf = config(z);
    return {
      z, sym, name, mass, cat, catName: CATS[cat].name, color: CATS[cat].color,
      period: pl.period, group: pl.group, f: pl.f, state: state(z), stateName: STATE_NAME[state(z)], radio: radio(z),
      config: cf.short, configFull: cf.full, shells: cf.shells,
      info: INFO[z] || CAT_INFO[cat], protons: z, neutrons: Math.max(0, Math.round(mass) - z)
    };
  });

  // =====================================================================
  // 2. REAKTIVLAR (laboratoriya javonidagi moddalar)
  // type: liquid — quyiladi; solid — qoshiqda kukun; metal — bo'lak tashlanadi; indicator — tomchi
  // ph — eritmaning taxminiy pH qiymati (o'zi yolg'iz bo'lganda); acid/base — kuchli kislota/asos ekvivalenti
  // =====================================================================
  const R = [
    // Kislotalar
    { id: "hcl", cat: "kislota", name: "Xlorid kislota (suyult.)", f: "HCl", type: "liquid", color: null, acid: 1, danger: "Ko‘z va teriga tegsa kuydiradi" },
    { id: "h2so4", cat: "kislota", name: "Sulfat kislota (suyult.)", f: "H₂SO₄", type: "liquid", color: null, acid: 2, danger: "Kuydiradi — ko‘zoynak va qo‘lqop!" },
    { id: "h2so4k", cat: "kislota", name: "Sulfat kislota (kons.)", f: "H₂SO₄ (kons.)", type: "liquid", color: 0xf6efd8, acid: 3, danger: "Juda xavfli! Faqat o‘qituvchi ishlatadi" },
    { id: "sirka", cat: "kislota", name: "Sirka (oshxona)", f: "CH₃COOH", type: "liquid", color: null, weak: 2.9 },
    { id: "limon", cat: "kislota", name: "Limon sharbati", f: "C₆H₈O₇", type: "liquid", color: 0xf7f0b0, weak: 2.4 },
    // Asoslar
    { id: "naoh", cat: "asos", name: "Natriy gidroksid eritmasi", f: "NaOH", type: "liquid", color: null, base: 1, danger: "O‘yuvchi ishqor — teriga tegmasin" },
    { id: "caoh2", cat: "asos", name: "Ohak suvi", f: "Ca(OH)₂", type: "liquid", color: null, base: 0.6 },
    { id: "nh3", cat: "asos", name: "Ammiak eritmasi (novshadil spirti)", f: "NH₃·H₂O", type: "liquid", color: null, weak: 11.2, danger: "O‘tkir hid — hidlamang!" },
    { id: "soda", cat: "asos", name: "Ichimlik sodasi", f: "NaHCO₃", type: "solid", color: 0xffffff, weak: 8.3 },
    { id: "kirsoda", cat: "asos", name: "Kir sodasi", f: "Na₂CO₃", type: "solid", color: 0xffffff, weak: 11.4 },
    { id: "sovun", cat: "asos", name: "Suyuq sovun", f: "sovun", type: "liquid", color: 0x9fd4ff, weak: 9.5 },
    // Tuzlar
    { id: "nacl", cat: "tuz", name: "Osh tuzi", f: "NaCl", type: "solid", color: 0xffffff },
    { id: "agno3", cat: "tuz", name: "Kumush nitrat eritmasi", f: "AgNO₃", type: "liquid", color: null, danger: "Teriga qora dog‘ qoldiradi" },
    { id: "cuso4", cat: "tuz", name: "Mis(II) sulfat (mis kuporosi)", f: "CuSO₄·5H₂O", type: "solid", color: 0x2b78d6, sol: 0x3d8fe0 },
    { id: "cuso4b", cat: "tuz", name: "Suvsiz mis sulfat (oq)", f: "CuSO₄", type: "solid", color: 0xf2f2ee, sol: 0x3d8fe0 },
    { id: "fecl3", cat: "tuz", name: "Temir(III) xlorid eritmasi", f: "FeCl₃", type: "liquid", color: 0xc77a1a, weak: 2.2 },
    { id: "feso4", cat: "tuz", name: "Temir(II) sulfat eritmasi", f: "FeSO₄", type: "liquid", color: 0xbfe0b0 },
    { id: "bacl2", cat: "tuz", name: "Bariy xlorid eritmasi", f: "BaCl₂", type: "liquid", color: null, danger: "Zaharli — yutmang" },
    { id: "pbno3", cat: "tuz", name: "Qo‘rg‘oshin nitrat eritmasi", f: "Pb(NO₃)₂", type: "liquid", color: null, danger: "Zaharli og‘ir metall tuzi" },
    { id: "ki", cat: "tuz", name: "Kaliy yodid eritmasi", f: "KI", type: "liquid", color: null },
    { id: "kmno4", cat: "tuz", name: "Kaliy permanganat (marganovka)", f: "KMnO₄", type: "solid", color: 0x3b0a45, sol: 0x8a1a9a },
    { id: "na2s2o3", cat: "tuz", name: "Natriy tiosulfat eritmasi", f: "Na₂S₂O₃", type: "liquid", color: null },
    { id: "caco3", cat: "tuz", name: "Marmar bo‘lakchalari", f: "CaCO₃", type: "solid", color: 0xf1eee6 },
    { id: "licl", cat: "tuz", name: "Litiy xlorid", f: "LiCl", type: "solid", color: 0xffffff, flame: 0xff2a3a },
    { id: "kcl", cat: "tuz", name: "Kaliy xlorid", f: "KCl", type: "solid", color: 0xffffff, flame: 0xb68cff },
    { id: "cacl2", cat: "tuz", name: "Kalsiy xlorid", f: "CaCl₂", type: "solid", color: 0xffffff, flame: 0xff6a1a },
    { id: "srcl2", cat: "tuz", name: "Stronsiy xlorid", f: "SrCl₂", type: "solid", color: 0xffffff, flame: 0xe0102a },
    { id: "cucl2", cat: "tuz", name: "Mis(II) xlorid", f: "CuCl₂", type: "solid", color: 0x3aa27a, sol: 0x3aa8a0, flame: 0x22d6a0 },
    // Metallar va oddiy moddalar
    { id: "zn", cat: "metall", name: "Rux granulalari", f: "Zn", type: "metal", color: 0xb8bfc6, shape: "granule" },
    { id: "mg", cat: "metall", name: "Magniy lentasi", f: "Mg", type: "metal", color: 0xd8dce0, shape: "ribbon" },
    { id: "fe", cat: "metall", name: "Temir mix", f: "Fe", type: "metal", color: 0x8d9298, shape: "nail" },
    { id: "cu", cat: "metall", name: "Mis sim", f: "Cu", type: "metal", color: 0xc8743a, shape: "wire" },
    { id: "al", cat: "metall", name: "Alyuminiy folga", f: "Al", type: "metal", color: 0xd6dade, shape: "foil" },
    { id: "na", cat: "metall", name: "Natriy bo‘lakchasi", f: "Na", type: "metal", color: 0xd9d4c2, shape: "chunk", danger: "Faqat o‘qituvchi! Suv bilan shiddatli reaksiya" },
    { id: "k", cat: "metall", name: "Kaliy bo‘lakchasi", f: "K", type: "metal", color: 0xd2ccc0, shape: "chunk", danger: "Faqat o‘qituvchi! Juda shiddatli" },
    { id: "ca", cat: "metall", name: "Kalsiy donachalari", f: "Ca", type: "metal", color: 0xcfcac0, shape: "granule" },
    { id: "s", cat: "metall", name: "Oltingugurt kukuni", f: "S", type: "solid", color: 0xf2d22a },
    { id: "fekukun", cat: "metall", name: "Temir kukuni", f: "Fe (kukun)", type: "solid", color: 0x4a4d52 },
    // Indikatorlar
    { id: "fenol", cat: "indikator", name: "Fenolftalein", f: "Ind", type: "indicator", ind: "fenol" },
    { id: "lakmus", cat: "indikator", name: "Lakmus", f: "Ind", type: "indicator", ind: "lakmus" },
    { id: "metilor", cat: "indikator", name: "Metiloranj", f: "Ind", type: "indicator", ind: "metilor" },
    { id: "univ", cat: "indikator", name: "Universal indikator", f: "Ind", type: "indicator", ind: "univ" },
    { id: "karam", cat: "indikator", name: "Qizil karam sharbati", f: "antotsian", type: "indicator", ind: "karam" },
    // Boshqa
    { id: "suv", cat: "boshqa", name: "Distillangan suv", f: "H₂O", type: "liquid", color: null },
    { id: "h2o2", cat: "boshqa", name: "Vodorod peroksid (6 %)", f: "H₂O₂", type: "liquid", color: null, danger: "Konsentrlangani kuydiradi" },
    { id: "mno2", cat: "boshqa", name: "Marganes(IV) oksid", f: "MnO₂", type: "solid", color: 0x1e1b1a },
    { id: "achitqi", cat: "boshqa", name: "Xamirturush (achitqi)", f: "achitqi", type: "solid", color: 0xd8b98a },
    { id: "shakar", cat: "boshqa", name: "Shakar", f: "C₁₂H₂₂O₁₁", type: "solid", color: 0xffffff },
    { id: "glyukoza", cat: "boshqa", name: "Glyukoza eritmasi", f: "C₆H₁₂O₆", type: "liquid", color: null },
    { id: "kraxmal", cat: "boshqa", name: "Kraxmal kleysteri", f: "(C₆H₁₀O₅)ₙ", type: "liquid", color: 0xf4f4f0 },
    { id: "yod", cat: "boshqa", name: "Yod eritmasi", f: "I₂", type: "liquid", color: 0x8a4a12 },
    { id: "sut", cat: "boshqa", name: "Sut", f: "sut", type: "liquid", color: 0xfbf8f0, opaque: true, weak: 6.6 }
  ];
  const CATEGORIES = [
    { id: "kislota", name: "Kislotalar", icon: "🍋" }, { id: "asos", name: "Asoslar", icon: "🧼" }, { id: "tuz", name: "Tuzlar", icon: "🧂" },
    { id: "metall", name: "Metall va kukun", icon: "🔩" }, { id: "indikator", name: "Indikatorlar", icon: "🌈" }, { id: "boshqa", name: "Boshqa", icon: "🧴" }
  ];

  // Reaksiya mahsulotlari (javonda yo'q, faqat idishda hosil bo'ladi)
  const P = [
    { id: "p_nacl", name: "Osh tuzi eritmasi", f: "NaCl", kind: "sol" },
    { id: "p_na2so4", name: "Natriy sulfat eritmasi", f: "Na₂SO₄", kind: "sol" },
    { id: "p_acetat", name: "Natriy atsetat eritmasi", f: "CH₃COONa", kind: "sol", weak: 8.4 },
    { id: "p_cacl2", name: "Kalsiy xlorid eritmasi", f: "CaCl₂", kind: "sol" },
    { id: "p_zncl2", name: "Rux xlorid eritmasi", f: "ZnCl₂", kind: "sol" },
    { id: "p_mgcl2", name: "Magniy xlorid eritmasi", f: "MgCl₂", kind: "sol" },
    { id: "p_alcl3", name: "Alyuminiy birikmasi eritmasi", f: "Na[Al(OH)₄]", kind: "sol" },
    { id: "p_feso4", name: "Temir(II) sulfat eritmasi", f: "FeSO₄", kind: "sol", color: 0xb6dca4 },
    { id: "p_znso4", name: "Rux sulfat eritmasi", f: "ZnSO₄", kind: "sol" },
    { id: "p_cudep", name: "Mis qatlami (metall)", f: "Cu", kind: "coat", color: 0xc8743a },
    { id: "p_agcl", name: "Kumush xlorid cho‘kmasi", f: "AgCl↓", kind: "ppt", color: 0xf4f4f2 },
    { id: "p_baso4", name: "Bariy sulfat cho‘kmasi", f: "BaSO₄↓", kind: "ppt", color: 0xffffff },
    { id: "p_cuoh2", name: "Mis(II) gidroksid cho‘kmasi", f: "Cu(OH)₂↓", kind: "ppt", color: 0x4aa3e6 },
    { id: "p_cuo", name: "Mis(II) oksid (qora)", f: "CuO↓", kind: "ppt", color: 0x161210 },
    { id: "p_feoh3", name: "Temir(III) gidroksid cho‘kmasi", f: "Fe(OH)₃↓", kind: "ppt", color: 0x9a4a14 },
    { id: "p_feoh2", name: "Temir(II) gidroksid cho‘kmasi", f: "Fe(OH)₂↓", kind: "ppt", color: 0x6f8f5a },
    { id: "p_pbi2", name: "Qo‘rg‘oshin yodid (oltin)", f: "PbI₂↓", kind: "ppt", color: 0xf7c81a },
    { id: "p_caco3", name: "Kalsiy karbonat (loyqa)", f: "CaCO₃↓", kind: "ppt", color: 0xf6f6f2 },
    { id: "p_cuam", name: "Mis-ammiak kompleksi", f: "[Cu(NH₃)₄]²⁺", kind: "sol", color: 0x1a2fb0 },
    { id: "p_s", name: "Oltingugurt (loyqa)", f: "S↓", kind: "ppt", color: 0xf2e27a },
    { id: "p_iodkr", name: "Yod-kraxmal (ko‘k-qora)", f: "I₂·kraxmal", kind: "sol", color: 0x0d1030 },
    { id: "p_i2", name: "Yod eritmasi", f: "I₂", kind: "sol", color: 0x9a5a1a },
    { id: "p_mn", name: "Rangsizlangan eritma", f: "Mn²⁺", kind: "sol" },
    { id: "p_naoh", name: "Natriy gidroksid eritmasi", f: "NaOH", kind: "sol", base: 1 },
    { id: "p_koh", name: "Kaliy gidroksid eritmasi", f: "KOH", kind: "sol", base: 1 },
    { id: "p_caoh2", name: "Kalsiy gidroksid (loyqa)", f: "Ca(OH)₂", kind: "sol", base: 0.6 },
    { id: "p_mgo", name: "Magniy oksid (oq kukun)", f: "MgO", kind: "ppt", color: 0xf6f6f4 },
    { id: "p_c", name: "Uglerod (qora “ilon”)", f: "C", kind: "solid", color: 0x111111 },
    { id: "p_tvorog", name: "Tvorog (kazein)", f: "kazein", kind: "ppt", color: 0xfdfbf2 },
    { id: "p_agdaraxt", name: "Kumush kristallari", f: "Ag", kind: "coat", color: 0xe8ecef },
    { id: "p_cuno3", name: "Mis(II) nitrat eritmasi", f: "Cu(NO₃)₂", kind: "sol", color: 0x5aa8e0 },
    { id: "p_kozgu", name: "Kumush ko‘zgu", f: "Ag", kind: "mirror", color: 0xdfe5ea },
    { id: "p_fes", name: "Temir sulfid", f: "FeS", kind: "solid", color: 0x2a2622 },
    { id: "p_suv", name: "Suv", f: "H₂O", kind: "sol" },
    { id: "p_cuso4", name: "Mis(II) sulfat eritmasi", f: "CuSO₄", kind: "sol", color: 0x3d8fe0 },
    { id: "p_kmn", name: "Marganovka eritmasi", f: "KMnO₄", kind: "sol", color: 0x8a1a9a },
    { id: "p_yeast", name: "Ko‘pik", f: "", kind: "sol" }
  ];

  // =====================================================================
  // 3. REAKSIYALAR
  // need — idishda bo'lishi kerak; heat — qizdirish kerak; use — sarflanadi (ko'rsatilmasa need bilan bir xil)
  // make — hosil bo'ladi; fx — vizual effektlar
  // =====================================================================
  const RX = [
    { id: "neytral", name: "Neytrallanish reaksiyasi", need: ["hcl", "naoh"], make: ["p_nacl", "p_suv"], eq: "HCl + NaOH → NaCl + H₂O",
      fx: { heat: 6 }, text: "Kislota va ishqor bir-birini “yo‘q qiladi”: H⁺ va OH⁻ ionlari birikib suv hosil qiladi, eritmada osh tuzi qoladi. Bunda biroz issiqlik ajraladi.",
      life: "Oshqozon kislotasi ko‘payganda ichiladigan dorilar (antatsidlar) aynan shu tamoyilda ishlaydi.", safe: "Kislota va ishqor eritmalari bilan ko‘zoynakda ishlang." },
    { id: "neytral2", name: "Sulfat kislotani neytrallash", need: ["h2so4", "naoh"], make: ["p_na2so4", "p_suv"], eq: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
      fx: { heat: 8 }, text: "Ikki asosli sulfat kislotani to‘liq neytrallash uchun ikki baravar ko‘p ishqor kerak.", life: "Sanoatda kislotali oqova suvlar shu yo‘l bilan zararsizlantiriladi.", safe: "Ehtiyot bo‘ling — eritma qiziydi." },
    { id: "vulqon", name: "“Vulqon” — soda va sirka", need: ["soda", "sirka"], make: ["p_acetat", "p_suv"], eq: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
      fx: { bubbles: 1, gas: "CO2", foam: 0.5, cool: 3 }, text: "Soda kislota bilan uchrashganda karbonat ionlari parchalanib karbonat angidrid (CO₂) gazi chiqadi — eritma ko‘piradi. Reaksiya issiqlikni yutadi, idish biroz soviydi.",
      life: "Xamir ko‘pchishi (pishirish kukuni) va o‘t o‘chirgichlarning ba’zi turlari shu reaksiyaga asoslangan.", safe: "Xavfsiz tajriba — uyda ham qilish mumkin." },
    { id: "vulqon2", name: "Katta vulqon (sovun bilan)", need: ["soda", "sirka", "sovun"], use: ["soda", "sirka"], make: ["p_acetat"], eq: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑",
      fx: { bubbles: 1, gas: "CO2", foam: 2.2 }, text: "Sovun CO₂ pufakchalarini ushlab qoladi — ko‘pik idishdan toshib chiqadi, xuddi vulqon lavasidek!", life: "Ko‘pikli o‘t o‘chirgichlar olovni ko‘pik bilan yopib, havodan ajratadi.", safe: "Xavfsiz." },
    { id: "marmar", name: "Marmar va kislota", need: ["caco3", "hcl"], make: ["p_cacl2", "p_suv"], eq: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
      fx: { bubbles: 0.8, gas: "CO2" }, text: "Marmar (kalsiy karbonat) kislotada “qaynab” eriydi, CO₂ gazi ajraladi.", life: "Kislotali yomg‘irlar marmar haykallar va binolarni yemiradi. Choynakdagi qasmoqni sirka bilan tozalash ham shunday.", safe: "Gaz chiqishini kuzating, idishni yopmang." },
    { id: "kirsoda", name: "Kir sodasi va kislota", need: ["kirsoda", "hcl"], make: ["p_nacl", "p_suv"], eq: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
      fx: { bubbles: 1, gas: "CO2" }, text: "Karbonatlar kislotalar bilan doim CO₂ gazini chiqaradi — bu karbonatlarni aniqlash usuli.", life: "Kir sodasi suvni yumshatadi va yog‘larni yuvadi.", safe: "Ko‘zoynakda ishlang." },
    { id: "zn_hcl", name: "Rux va kislota — vodorod olish", need: ["zn", "hcl"], make: ["p_zncl2"], eq: "Zn + 2HCl → ZnCl₂ + H₂↑",
      fx: { bubbles: 0.9, gas: "H2", heat: 4, metalShrink: true }, text: "Faol metall kislotadagi vodorodni siqib chiqaradi — rux sirtidan vodorod pufakchalari ko‘tariladi. Yonib turgan cho‘pni yaqinlashtirsangiz “pop!” ovozi eshitiladi.",
      life: "Laboratoriyada vodorod shu usulda olinadi. Metallar faollik qatori shu tajribalar bilan tuzilgan.", safe: "Vodorod havo bilan portlovchi aralashma hosil qiladi — olovdan uzoqda!" },
    { id: "zn_h2so4", name: "Rux va sulfat kislota", need: ["zn", "h2so4"], make: ["p_znso4"], eq: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
      fx: { bubbles: 0.8, gas: "H2", heat: 4, metalShrink: true }, text: "Rux suyultirilgan sulfat kislotada ham vodorod ajratib eriydi.", life: "Akkumulyator va galvanik elementlarda rux elektrod sifatida ishlatiladi.", safe: "Vodorodni olovdan uzoq tuting." },
    { id: "mg_hcl", name: "Magniy va kislota", need: ["mg", "hcl"], make: ["p_mgcl2"], eq: "Mg + 2HCl → MgCl₂ + H₂↑",
      fx: { bubbles: 1.6, gas: "H2", heat: 18, metalShrink: true }, text: "Magniy ruxdan faolroq — shuning uchun shiddatliroq “qaynaydi” va idish sezilarli qiziydi.", life: "Magniy qotishmalari yengil, lekin namlik va kislotadan himoyalanishi kerak.", safe: "Idish qiziydi — ushlamang." },
    { id: "al_naoh", name: "Alyuminiy va ishqor", need: ["al", "naoh"], make: ["p_alcl3"], eq: "2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑",
      fx: { bubbles: 1, gas: "H2", heat: 14, metalShrink: true }, text: "Alyuminiy amfoter metall — u nafaqat kislotada, balki ishqorda ham erib vodorod ajratadi.", life: "Alyuminiy idishda ishqorli (sodali) suyuqliklarni uzoq saqlamaslik kerak.", safe: "Ishqor o‘yuvchi! Vodorodni olovdan uzoq tuting." },
    { id: "fe_cuso4", name: "Temir mixni mis bilan qoplash", need: ["fe", "cuso4"], use: ["cuso4"], make: ["p_feso4", "p_cudep"], eq: "Fe + CuSO₄ → FeSO₄ + Cu↓",
      fx: { coat: 0xc8743a, slow: true }, text: "Temir misdan faolroq, shuning uchun u misni tuzidan siqib chiqaradi: mix qizg‘ish mis qatlami bilan qoplanadi, ko‘k eritma esa asta-sekin yashil tusga kiradi.",
      life: "Qadimda mis rudalari yaqinidagi suvlardan temir yordamida mis olingan (sementatsiya).", safe: "Mis kuporosi zaharli — yutmang." },
    { id: "zn_cuso4", name: "Rux va mis kuporosi", need: ["zn", "cuso4"], use: ["cuso4"], make: ["p_znso4", "p_cudep"], eq: "Zn + CuSO₄ → ZnSO₄ + Cu↓",
      fx: { coat: 0x6b3a1c, heat: 6, slow: true }, text: "Rux misni siqib chiqaradi — granulalar qo‘ng‘ir mis bilan qoplanadi, ko‘k rang yo‘qoladi.", life: "Shu reaksiya Daniel elementida (birinchi batareyalardan biri) tok beradi.", safe: "Zaharli tuz — qo‘lqop kiying." },
    { id: "cu_agno3", name: "“Kumush daraxt”", need: ["cu", "agno3"], use: ["agno3"], make: ["p_cuno3", "p_agdaraxt"], eq: "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓",
      fx: { crystals: 0xe8ecef, slow: true }, text: "Mis kumushdan faolroq: mis sim atrofida yaltiroq kumush kristallari “daraxt”dek o‘sadi, eritma esa mis ionlaridan ko‘kish tusga kiradi.",
      life: "Bu metallarning faollik qatorini ko‘rsatadigan eng chiroyli tajribalardan biri.", safe: "Kumush nitrat teriga qora dog‘ qoldiradi." },
    { id: "na_suv", name: "Natriy va suv", need: ["na", "suv"], use: ["na"], make: ["p_naoh"], eq: "2Na + 2H₂O → 2NaOH + H₂↑",
      fx: { bubbles: 1.2, gas: "H2", heat: 25, sodium: 0xffa21a, steam: true }, text: "Natriy suvdan yengil — sirtda erib sharcha bo‘lib “yuguradi”, vodorod ajraladi. Eritma ishqorga aylanadi — fenolftalein qo‘shsangiz pushti bo‘ladi!",
      life: "Ishqoriy metallar shuning uchun kerosin ostida saqlanadi.", safe: "Faqat o‘qituvchi ko‘rsatadi, juda kichik bo‘lak bilan, himoya ekrani ortida!" },
    { id: "k_suv", name: "Kaliy va suv", need: ["k", "suv"], use: ["k"], make: ["p_koh"], eq: "2K + 2H₂O → 2KOH + H₂↑",
      fx: { bubbles: 1.6, gas: "H2", heat: 35, sodium: 0xb68cff, flash: 0xb68cff, steam: true }, text: "Kaliy natriydan ham faolroq: ajralayotgan vodorod o‘z-o‘zidan alangalanib, binafsha olov bilan yonadi.",
      life: "Guruhda pastga tushgan sari ishqoriy metallarning faolligi ortadi: Li < Na < K < Rb < Cs.", safe: "Juda xavfli — faqat o‘qituvchi, himoya ekrani bilan!" },
    { id: "ca_suv", name: "Kalsiy va suv", need: ["ca", "suv"], use: ["ca"], make: ["p_caoh2"], eq: "Ca + 2H₂O → Ca(OH)₂ + H₂↑",
      fx: { bubbles: 0.8, gas: "H2", heat: 10, cloudy: 0xf4f4f0, metalShrink: true }, text: "Kalsiy suv bilan tinchroq reaksiyaga kirishadi: vodorod pufakchalari chiqadi, eritma ohak suvidek loyqalanadi.", life: "So‘ndirilgan ohak (Ca(OH)₂) qurilishda va oqlashda ishlatiladi.", safe: "Ko‘zoynakda kuzating." },
    { id: "mg_yonish", name: "Magniyning yonishi", need: ["mg"], heat: true, alone: true, use: ["mg"], make: ["p_mgo"], eq: "2Mg + O₂ → 2MgO",
      fx: { flash: 0xffffff, bright: true, smoke: 0xf4f4f4 }, text: "Magniy lentasi qizdirilganda ko‘zni qamashtiruvchi oq nur bilan yonadi va oq kukun — magniy oksidga aylanadi.",
      life: "Eski fotoapparatlarning chaqnoqlari, salyut va signal mash’alalarida magniy ishlatiladi.", safe: "Yorug‘likka tik qaramang — ko‘zni zararlaydi!" },
    { id: "agcl", name: "Kumush xlorid cho‘kmasi", need: ["agno3", "nacl"], make: ["p_agcl"], eq: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
      fx: { ppt: 0xf4f4f2 }, text: "Kumush ionlari xlorid ionlari bilan suvda erimaydigan oq “pag‘a-pag‘a” cho‘kma hosil qiladi. Bu xlorid ionlarini aniqlashning sifat reaksiyasi.",
      life: "Ichimlik suvidagi xloridlar shu reaksiya bilan tekshiriladi. AgCl yorug‘likda qorayadi — eski fotoplyonkalar shunga asoslangan.", safe: "Kumush nitrat teriga qora dog‘ qoldiradi." },
    { id: "agcl2", name: "Kumush xlorid (xlorid kislota bilan)", need: ["agno3", "hcl"], make: ["p_agcl"], eq: "AgNO₃ + HCl → AgCl↓ + HNO₃",
      fx: { ppt: 0xf4f4f2 }, text: "Xlorid kislota ham kumush ionlari bilan oq cho‘kma beradi.", life: "Sifat analizi — moddani aniqlash.", safe: "Kislota bilan ehtiyot bo‘ling." },
    { id: "baso4", name: "Bariy sulfat cho‘kmasi", need: ["bacl2", "h2so4"], make: ["p_baso4"], eq: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl",
      fx: { ppt: 0xffffff }, text: "Bariy ionlari sulfat ionlari bilan sut kabi oq, erimaydigan cho‘kma hosil qiladi — sulfatlarni aniqlash usuli.",
      life: "Bariy sulfat (“bariy bo‘tqasi”) oshqozonni rentgenda ko‘rish uchun ichiriladi — u erimagani uchun zararsiz.", safe: "Eruvchan bariy tuzlari zaharli." },
    { id: "cuoh2", name: "Mis(II) gidroksid — ko‘k cho‘kma", need: ["cuso4", "naoh"], make: ["p_cuoh2", "p_na2so4"], eq: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
      fx: { ppt: 0x4aa3e6 }, text: "Mis ionlari ishqor bilan chiroyli moviy-ko‘k jelatinsimon cho‘kma hosil qiladi.", life: "Mis birikmalari o‘simliklarni zamburug‘lardan himoya qiluvchi preparatlarda (bordo suyuqligi) ishlatiladi.", safe: "Ishqor o‘yuvchi — qo‘lqop kiying." },
    { id: "cuo", name: "Mis(II) gidroksidni qizdirish", need: ["p_cuoh2"], heat: true, make: ["p_cuo", "p_suv"], eq: "Cu(OH)₂ → CuO + H₂O (t°)",
      fx: { ppt: 0x161210, steam: true }, text: "Qizdirilganda ko‘k cho‘kma suv yo‘qotib, qora mis(II) oksidga aylanadi.", life: "Asoslarning parchalanishi — ko‘p metall oksidlari shunday olinadi.", safe: "Qaynab sachramasligi uchun asta qizdiring." },
    { id: "feoh3", name: "Temir(III) gidroksid — qo‘ng‘ir cho‘kma", need: ["fecl3", "naoh"], make: ["p_feoh3", "p_nacl"], eq: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
      fx: { ppt: 0x9a4a14 }, text: "Temir(III) ionlari ishqor bilan zang rangli qo‘ng‘ir cho‘kma beradi.", life: "Zang (Fe₂O₃·nH₂O) shunga o‘xshash modda. Suv tozalashda temir tuzlari loyqani cho‘ktiradi.", safe: "Ehtiyot bo‘ling." },
    { id: "feoh2", name: "Temir(II) gidroksid — yashil cho‘kma", need: ["feso4", "naoh"], make: ["p_feoh2", "p_na2so4"], eq: "FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄",
      fx: { ppt: 0x6f8f5a }, text: "Temir(II) ionlari yashilsimon cho‘kma beradi. Havoda u asta qo‘ng‘ir tusga kiradi (temir(III) ga oksidlanadi).", life: "Temirning ikki xil valentligini rang orqali farqlash mumkin.", safe: "Ehtiyot bo‘ling." },
    { id: "pbi2", name: "“Oltin yomg‘ir”", need: ["pbno3", "ki"], make: ["p_pbi2"], eq: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
      fx: { ppt: 0xf7c81a, sparkle: true }, text: "Ikki rangsiz eritma qo‘shilganda yorqin sariq qo‘rg‘oshin yodid cho‘kmasi hosil bo‘ladi. Issiq suvda eritib sovutilsa, yaltiroq oltinrang kristallar “yomg‘ir” bo‘lib tushadi.",
      life: "Cho‘kish reaksiyalari analitik kimyoda ionlarni aniqlash uchun ishlatiladi.", safe: "Qo‘rg‘oshin tuzlari zaharli — faqat o‘qituvchi nazoratida." },
    { id: "cuam", name: "Mis-ammiak kompleksi (to‘q ko‘k)", need: ["cuso4", "nh3"], make: ["p_cuam"], eq: "CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄",
      fx: { color: 0x1a2fb0 }, text: "Ammiak ko‘paytirilganda mis ionlari ammiak molekulalari bilan kompleks hosil qiladi — eritma to‘q siyohrang-ko‘kka bo‘yaladi.", life: "Kompleks birikmalar — gemoglobin, xlorofill va ko‘plab dorilarning asosi.", safe: "Ammiak hidi o‘tkir — hidlamang." },
    { id: "laylak", name: "Ohak suvining loyqalanishi", need: ["caoh2", "co2"], use: ["co2"], make: ["p_caco3"], eq: "Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O",
      fx: { cloudy: 0xf6f6f2, ppt: 0xf6f6f2 }, text: "Karbonat angidrid ohak suvidan o‘tkazilganda erimaydigan kalsiy karbonat hosil bo‘ladi — eritma sutdek loyqalanadi. Bu CO₂ ni aniqlash usuli.",
      life: "Nafasimizda CO₂ borligini aynan shu tajriba isbotlaydi.", safe: "Somonchadan faqat puflang, eritmani tortmang!" },
    { id: "tiosulfat", name: "Oltingugurt loyqasi", need: ["na2s2o3", "hcl"], make: ["p_s", "p_nacl"], eq: "Na₂S₂O₃ + 2HCl → 2NaCl + S↓ + SO₂↑ + H₂O",
      fx: { cloudy: 0xf2e27a, slow: true }, text: "Eritma asta-sekin sarg‘ish-oq loyqaga aylanadi: mayda oltingugurt zarralari hosil bo‘ladi. Reaksiya tezligini kuzatish uchun klassik tajriba.",
      life: "Natriy tiosulfat fotografiyada va xlorni zararsizlantirishda ishlatiladi.", safe: "SO₂ gazi o‘tkir — mo‘rili shkafda bajaring." },
    { id: "yodkr", name: "Yod va kraxmal", need: ["yod", "kraxmal"], make: ["p_iodkr"], eq: "I₂ + kraxmal → ko‘k-qora kompleks",
      fx: { color: 0x0d1030 }, text: "Yod kraxmal molekulalari ichiga kirib to‘q ko‘k-qora rang beradi — kraxmalni aniqlashning sifat reaksiyasi.", life: "Kartoshka, non va guruchda kraxmal borligini bir tomchi yod bilan tekshirish mumkin.", safe: "Xavfsiz." },
    { id: "yodsoat", name: "“Yod soati”", need: ["ki", "h2o2", "kraxmal"], make: ["p_iodkr"], eq: "2KI + H₂O₂ → I₂ + 2KOH; I₂ + kraxmal → ko‘k",
      fx: { color: 0x0d1030, delay: 3.5 }, text: "Vodorod peroksid yodid ionlarini yodga oksidlaydi. Yod yetarli to‘planganda eritma birdaniga ko‘k-qora bo‘lib ketadi — xuddi soat “jiringlagandek”.", life: "Reaksiya tezligi va kinetikani o‘rganishda ishlatiladi.", safe: "Xavfsiz, ammo eritmani ichmang." },
    { id: "kislorod", name: "Kislorod olish (katalizator)", need: ["h2o2", "mno2"], use: ["h2o2"], make: ["p_suv"], eq: "2H₂O₂ → 2H₂O + O₂↑ (MnO₂ katalizator)",
      fx: { bubbles: 1.4, gas: "O2", heat: 12 }, text: "MnO₂ katalizator — o‘zi sarflanmaydi, lekin peroksidning parchalanishini tezlashtiradi. Ajralgan kislorodda cho‘g‘langan cho‘p qaytadan alangalanadi!", life: "Kislorod — nafas olish va payvandlashda kerak. Fermentlar — organizmdagi tabiiy katalizatorlar.", safe: "Konsentrlangan peroksid kuydiradi." },
    { id: "fil", name: "“Fil tish pastasi”", need: ["h2o2", "ki", "sovun"], use: ["h2o2"], make: ["p_suv"], eq: "2H₂O₂ → 2H₂O + O₂↑ (KI katalizator)",
      fx: { bubbles: 2, gas: "O2", foam: 4, heat: 20, steam: true }, text: "Yodid ionlari peroksidni juda tez parchalaydi, ajralgan kislorod sovunni ulkan ko‘pik “kolbasa”siga aylantiradi. Ko‘pik iliq — reaksiya issiqlik chiqaradi.",
      life: "Eng mashhur ko‘rgazmali tajriba — katalizatorlar kuchini ko‘rsatadi.", safe: "Ko‘pikka tegmang (issiq), ko‘zoynak kiying." },
    { id: "fil2", name: "Xamirturush bilan ko‘pik", need: ["h2o2", "achitqi", "sovun"], use: ["h2o2"], make: ["p_suv"], eq: "2H₂O₂ → 2H₂O + O₂↑ (katalaza fermenti)",
      fx: { bubbles: 1.4, gas: "O2", foam: 2.5, heat: 8 }, text: "Xamirturush tarkibidagi katalaza fermenti peroksidni parchalaydi — xavfsizroq “fil tish pastasi”.", life: "Jigarimizdagi katalaza fermenti ham zararli peroksidni shunday parchalaydi.", safe: "Bolalar uchun xavfsizroq variant." },
    { id: "marganovka", name: "Marganovkaning rangsizlanishi", need: ["kmno4", "h2o2", "h2so4"], use: ["kmno4", "h2o2"], make: ["p_mn"], eq: "2KMnO₄ + 5H₂O₂ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 5O₂↑ + 8H₂O",
      fx: { bubbles: 1, gas: "O2", decolor: true }, text: "To‘q binafsha marganovka kislotali muhitda peroksid bilan qaytariladi — eritma ko‘z oldingizda rangsizlanadi va kislorod ajraladi.", life: "Oksidlanish-qaytarilish reaksiyalari — akkumulyatorlar, metabolizm va yonishning asosi.", safe: "Kislota bilan ehtiyot bo‘ling." },
    { id: "kmnsuv", name: "Marganovkaning erishi (diffuziya)", need: ["kmno4", "suv"], use: ["kmno4"], make: ["p_kmn"], eq: "KMnO₄ → K⁺ + MnO₄⁻",
      fx: { color: 0x8a1a9a, slow: true }, text: "Bir necha kristall suvni chiroyli binafsha rangga bo‘yaydi — zarrachalar o‘z-o‘zidan tarqaladi (diffuziya).", life: "Kuchsiz marganovka eritmasi yaralarni yuvishda antiseptik sifatida ishlatiladi.", safe: "Kristallarni qo‘l bilan ushlamang." },
    { id: "kuporos", name: "Mis kuporosining erishi", need: ["cuso4", "suv"], use: [], make: ["p_cuso4"], eq: "CuSO₄·5H₂O → Cu²⁺ + SO₄²⁻ + 5H₂O",
      fx: { color: 0x3d8fe0, slow: true }, text: "Ko‘k kristallar erib, eritmani moviy rangga bo‘yaydi. Rang gidratlangan mis ionlariga bog‘liq.", life: "Mis kuporosi bog‘dorchilikda zamburug‘larga qarshi ishlatiladi.", safe: "Zaharli — yutmang." },
    { id: "suvsiz", name: "Suvni aniqlash (oq → ko‘k)", need: ["cuso4b", "suv"], use: [], make: ["p_cuso4"], eq: "CuSO₄ (oq) + 5H₂O → CuSO₄·5H₂O (ko‘k)",
      fx: { color: 0x3d8fe0, heat: 6 }, text: "Suvsiz oq mis sulfat suv bilan uchrashganda darhol ko‘karadi — bu suv borligini aniqlash usuli.", life: "Benzin yoki spirtda suv borligini tekshirishda ishlatiladi.", safe: "Zaharli — yutmang." },
    { id: "ilon", name: "Shakar “ilon”", need: ["shakar", "h2so4k"], make: ["p_c"], eq: "C₁₂H₂₂O₁₁ → 12C + 11H₂O (kons. H₂SO₄)",
      fx: { snake: true, steam: true, heat: 60, smoke: 0xdddddd }, text: "Konsentrlangan sulfat kislota shakardan suvni “tortib oladi” — qora g‘ovak uglerod ustuni idishdan ilondek o‘sib chiqadi, bug‘ ajraladi.",
      life: "Konsentrlangan H₂SO₄ ning suvni tortib olish xossasi — u kiyim va teriga tegsa kuydirishining sababi.", safe: "Juda xavfli! Faqat o‘qituvchi, mo‘rili shkafda ko‘rsatadi." },
    { id: "tvorog", name: "Sutning ivishi", need: ["sut", "sirka"], make: ["p_tvorog"], eq: "kazein + kislota → ivigan oqsil",
      fx: { ppt: 0xfdfbf2, curd: true }, text: "Kislota sut oqsili — kazeinni ivitadi: oq bo‘laklar (tvorog) va sarg‘ish zardob ajraladi.", life: "Tvorog, pishloq va qatiq tayyorlash shu jarayonga asoslangan.", safe: "Xavfsiz — oshxonada ham qilish mumkin." },
    { id: "tvorog2", name: "Sut va limon", need: ["sut", "limon"], make: ["p_tvorog"], eq: "kazein + limon kislota → ivigan oqsil",
      fx: { ppt: 0xfdfbf2, curd: true }, text: "Limon kislotasi ham sutni ivitadi.", life: "Uy pishlog‘i (paneer) shunday tayyorlanadi.", safe: "Xavfsiz." },
    { id: "kozgu", name: "“Kumush ko‘zgu”", need: ["agno3", "nh3", "glyukoza"], heat: true, make: ["p_kozgu"], eq: "R–CHO + 2[Ag(NH₃)₂]OH → R–COONH₄ + 2Ag↓ + 3NH₃ + H₂O",
      fx: { mirror: true }, text: "Kumush-ammiak eritmasi glyukoza bilan qizdirilganda kumush qaytariladi va idish devorlarini yaltiroq ko‘zgu qatlami bilan qoplaydi.", life: "Ilgari ko‘zgular va Yangi yil o‘yinchoqlari shunday kumushlangan.", safe: "Eritmani saqlamang — darhol to‘king. O‘qituvchi nazoratida." },
    { id: "fes", name: "Temir va oltingugurt", need: ["fekukun", "s"], heat: true, make: ["p_fes"], eq: "Fe + S → FeS (t°)",
      fx: { glow: 0xff6a1a, smoke: 0xcccccc }, text: "Aralashma qizdirilganda reaksiya o‘z-o‘zidan davom etadi — massa qizil cho‘g‘dek yaltiraydi. Hosil bo‘lgan FeS na magnitga tortiladi, na oltingugurtga o‘xshaydi — bu yangi modda!",
      life: "Aralashma va kimyoviy birikmaning farqini ko‘rsatuvchi klassik tajriba.", safe: "Mo‘rili shkafda — SO₂ ajralishi mumkin." },
    { id: "bug", name: "Bug‘latish — tuz kristallari", need: ["nacl", "suv"], heat: true, use: ["suv"], make: [], eq: "NaCl (eritma) → NaCl (kristall) + H₂O↑",
      fx: { steam: true, evaporate: true, crystalsWhite: true }, text: "Suv bug‘langanda tuz qoladi — idish tubida oq kub shaklidagi kristallar hosil bo‘ladi.", life: "Dengiz suvidan tuz shunday olinadi. Orol dengizining qurigan tubida tuz qatlamlari shu sababdan paydo bo‘lgan.", safe: "Qaynoq idishni ushlamang." },
    { id: "cu_qizdirish", name: "Misning oksidlanishi", need: ["cu"], heat: true, alone: true, use: [], make: [], eq: "2Cu + O₂ → 2CuO (t°)",
      fx: { coat: 0x1a1410, glow: 0xff7a2a }, text: "Mis sim alangada qizdirilganda qora mis(II) oksid qatlami bilan qoplanadi.", life: "Shuning uchun eski mis buyumlar qorayadi.", safe: "Issiq simni ushlamang." }
  ];

  // Alanga sinovi uchun tuzlar (Na — osh tuzi ham)
  const FLAME = {
    licl: { color: 0xff2a3a, name: "Litiy — qip-qizil", text: "Litiy ionlari alangani karmin-qizil rangga bo‘yaydi." },
    nacl: { color: 0xffb21a, name: "Natriy — sariq-to‘q sariq", text: "Natriy ionlari kuchli sariq rang beradi — ko‘cha chiroqlari ham shunday nur sochadi." },
    kcl: { color: 0xb68cff, name: "Kaliy — och binafsha", text: "Kaliy ionlari och binafsha (siren) rang beradi." },
    cacl2: { color: 0xff6a1a, name: "Kalsiy — g‘isht-qizil", text: "Kalsiy ionlari to‘q sariq-qizil rang beradi." },
    srcl2: { color: 0xe0102a, name: "Stronsiy — to‘q qizil", text: "Stronsiy ionlari yorqin qizil rang beradi — salyutlarda qizil rang shundan." },
    bacl2: { color: 0x9aff3a, name: "Bariy — och yashil", text: "Bariy ionlari olma-yashil rang beradi — salyutlarning yashil rangi." },
    cucl2: { color: 0x22d6a0, name: "Mis — ko‘k-yashil", text: "Mis ionlari zumrad ko‘k-yashil rang beradi." },
    cuso4: { color: 0x22d6a0, name: "Mis — ko‘k-yashil", text: "Mis ionlari zumrad ko‘k-yashil rang beradi." }
  };

  // =====================================================================
  // 4. YO'RIQNOMALI TAJRIBALAR
  // =====================================================================
  const EXP = [
    { id: "e_vulqon", icon: "🌋", title: "Vulqon otilishi", rx: "vulqon2", steps: ["soda", "sovun", "sirka"], vessel: "kolba", note: "Soda + sovun + sirka — ko‘pik toshib chiqadi." },
    { id: "e_fil", icon: "🐘", title: "Fil tish pastasi", rx: "fil", steps: ["h2o2", "sovun", "ki"], vessel: "silindr", note: "Katalizator peroksidni juda tez parchalaydi." },
    { id: "e_neytral", icon: "⚖️", title: "Neytrallanish va indikator", rx: "neytral", steps: ["naoh", "fenol", "hcl"], vessel: "stakan", note: "Pushti rang kislota qo‘shilganda yo‘qoladi." },
    { id: "e_karam", icon: "🌈", title: "Qizil karam — tabiiy indikator", rx: null, steps: ["suv", "karam", "sirka"], vessel: "stakan", note: "Kislotada pushti, ishqorda yashil-sariq — ranglarni sinab ko‘ring!", test: "karam" },
    { id: "e_vodorod", icon: "💥", title: "Vodorod va “pop” sinovi", rx: "zn_hcl", steps: ["hcl", "zn", "@splint"], vessel: "probirka", note: "Yonib turgan cho‘p vodorodda “pop” qiladi." },
    { id: "e_kislorod", icon: "✨", title: "Kislorod va cho‘g‘ cho‘p", rx: "kislorod", steps: ["h2o2", "mno2", "@ember"], vessel: "kolba", note: "Cho‘g‘langan cho‘p kislorodda qaytadan yonadi." },
    { id: "e_mix", icon: "🔩", title: "Temir mixni mislash", rx: "fe_cuso4", steps: ["suv", "cuso4", "fe"], vessel: "stakan", note: "Mix qizg‘ish mis qatlami bilan qoplanadi." },
    { id: "e_daraxt", icon: "🌳", title: "Kumush daraxt", rx: "cu_agno3", steps: ["agno3", "cu"], vessel: "stakan", note: "Mis sim atrofida kumush kristallari o‘sadi." },
    { id: "e_oltin", icon: "🌟", title: "Oltin yomg‘ir", rx: "pbi2", steps: ["pbno3", "ki"], vessel: "stakan", note: "Ikki rangsiz eritmadan oltinrang cho‘kma." },
    { id: "e_natriy", icon: "⚡", title: "Natriy suvda yuguradi", rx: "na_suv", steps: ["suv", "fenol", "na"], vessel: "kristallizator", note: "Faqat o‘qituvchi! Eritma pushti bo‘ladi." },
    { id: "e_kaliy", icon: "💜", title: "Kaliy — binafsha olov", rx: "k_suv", steps: ["suv", "k"], vessel: "kristallizator", note: "Faqat o‘qituvchi! Vodorod binafsha olov bilan yonadi." },
    { id: "e_magniy", icon: "☀️", title: "Magniyning yonishi", rx: "mg_yonish", steps: ["mg", "@heat"], vessel: "tigel", note: "Ko‘zni qamashtiruvchi oq nur." },
    { id: "e_alanga", icon: "🔥", title: "Alanga rangi sinovi", rx: null, steps: ["@flame"], vessel: "stakan", note: "Metall ionlari olovni turli rangga bo‘yaydi.", test: "flame" },
    { id: "e_agcl", icon: "☁️", title: "Xlorid ionini aniqlash", rx: "agcl", steps: ["nacl", "suv", "agno3"], vessel: "probirka", note: "Oq pag‘a-pag‘a cho‘kma." },
    { id: "e_baso4", icon: "🥛", title: "Sulfat ionini aniqlash", rx: "baso4", steps: ["h2so4", "bacl2"], vessel: "probirka", note: "Sutdek oq cho‘kma." },
    { id: "e_cuoh", icon: "💙", title: "Ko‘k cho‘kma va qora oksid", rx: "cuo", steps: ["suv", "cuso4", "naoh", "@heat"], vessel: "probirka", note: "Ko‘k Cu(OH)₂ qizdirilganda qorayadi." },
    { id: "e_zang", icon: "🟫", title: "Temir(III) — zang rangli cho‘kma", rx: "feoh3", steps: ["fecl3", "naoh"], vessel: "probirka", note: "Qo‘ng‘ir Fe(OH)₃ cho‘kmasi." },
    { id: "e_kompleks", icon: "🔷", title: "To‘q ko‘k kompleks", rx: "cuam", steps: ["suv", "cuso4", "nh3"], vessel: "probirka", note: "Ammiak bilan mis to‘q ko‘k rang beradi." },
    { id: "e_nafas", icon: "🌬️", title: "Nafasimizda CO₂ bormi?", rx: "laylak", steps: ["caoh2", "@co2"], vessel: "probirka", note: "Ohak suvi loyqalanadi." },
    { id: "e_marmar", icon: "🏛️", title: "Marmar va kislotali yomg‘ir", rx: "marmar", steps: ["caco3", "hcl"], vessel: "stakan", note: "Marmar “qaynab” eriydi." },
    { id: "e_yodsoat", icon: "⏰", title: "Yod soati", rx: "yodsoat", steps: ["ki", "kraxmal", "h2o2"], vessel: "stakan", note: "Bir necha soniyadan keyin birdan ko‘karadi." },
    { id: "e_kraxmal", icon: "🥔", title: "Kraxmalni aniqlash", rx: "yodkr", steps: ["kraxmal", "yod"], vessel: "probirka", note: "Ko‘k-qora rang." },
    { id: "e_marganovka", icon: "💜", title: "Rangsizlanuvchi marganovka", rx: "marganovka", steps: ["suv", "kmno4", "h2so4", "h2o2"], vessel: "stakan", note: "Binafsha rang ko‘z oldingizda yo‘qoladi." },
    { id: "e_diffuziya", icon: "🎨", title: "Diffuziya — marganovka", rx: "kmnsuv", steps: ["suv", "kmno4"], vessel: "stakan", note: "Rang o‘z-o‘zidan tarqaladi." },
    { id: "e_suvsiz", icon: "💧", title: "Suvni aniqlash", rx: "suvsiz", steps: ["cuso4b", "suv"], vessel: "chinni", note: "Oq kukun ko‘karadi." },
    { id: "e_ilon", icon: "🐍", title: "Shakar ilon", rx: "ilon", steps: ["shakar", "h2so4k"], vessel: "stakan", note: "Faqat o‘qituvchi! Qora uglerod ustuni o‘sadi." },
    { id: "e_tvorog", icon: "🧀", title: "Sutdan tvorog", rx: "tvorog", steps: ["sut", "sirka"], vessel: "stakan", note: "Oqsil ivib, bo‘laklar hosil bo‘ladi." },
    { id: "e_kozgu", icon: "🪞", title: "Kumush ko‘zgu", rx: "kozgu", steps: ["agno3", "nh3", "glyukoza", "@heat"], vessel: "kolba", note: "Idish devori ko‘zguga aylanadi." },
    { id: "e_fes", icon: "🧲", title: "Aralashma va birikma", rx: "fes", steps: ["fekukun", "s", "@heat"], vessel: "probirka", note: "Cho‘g‘langan massa — yangi modda FeS." },
    { id: "e_tuz", icon: "🧂", title: "Tuz kristallarini olish", rx: "bug", steps: ["suv", "nacl", "@heat"], vessel: "chinni", note: "Suv bug‘lanib, kristallar qoladi." },
    { id: "e_mg", icon: "🫧", title: "Faollik: magniy va rux", rx: "mg_hcl", steps: ["hcl", "mg"], vessel: "probirka", note: "Magniy ruxdan shiddatliroq reaksiyaga kirishadi." },
    { id: "e_tiosulfat", icon: "🌫️", title: "Reaksiya tezligi — loyqa", rx: "tiosulfat", steps: ["na2s2o3", "hcl"], vessel: "kolba", note: "Eritma asta-sekin loyqalanadi." }
  ];

  const ALL = {}; R.forEach((s) => (ALL[s.id] = s)); P.forEach((s) => (ALL[s.id] = s));
  ALL.co2 = { id: "co2", name: "Karbonat angidrid (nafas)", f: "CO₂", kind: "gas" };
  window.SofiChem = { ELEMENTS, CATS, REAGENTS: R, PRODUCTS: P, ALL, RX, FLAME, EXP, CATEGORIES };
})();
