// Makieta R2 — udawane dane (dane sztuczne z dane/mini i dane/mini-trudny, PNG w obrazy/).
// Auta 1–6: ramki wpisane na sztywno (R1) + jedno pudło obok prawdziwego dodatku w aucie 1 (P67 A).
// Auto 7 (przypadek trudny, P60 B): ramki z prawdziwego wyniku programu v3 (zadanie 20, najlepsza konfiguracja).
// Słowo różnicy wg P45 B: stałe progi siły, te same w każdym aucie (wartości — zadanie 32/P49; tu dowolne na makietę).
const W = 1024, H = 256;
const PROGI = { wysoki: 0.6, sredni: 0.3 };   // PARAMETR: do Artura (P49) — wartości dowolne na makietę
const slowo = (s) => (s >= PROGI.wysoki ? "wysoki" : s >= PROGI.sredni ? "średni" : "niski");
const POWODY = ["element konstrukcji", "zgłoszony ładunek", "błąd obrazu", "nakładanie się ładunku", "inny"]; // P13
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
const NAZWA = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };
const Z_WZORCEM = ["firanka", "chlodnia", "kontener"];   // cysterny nie ma w bibliotece wzorców (P35 A) → E5
const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
const BRAK_WSKAZAN = "brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam";   // P58 A
const BEZ_OPISU = "poza znaną konstrukcją, obejrzyj uważnie";   // P42
const PRZYKLAD = "makieta: wynik przykładowy, nie z Twojego obrazu";   // P62 A
const ILE_NA_LISCIE = 6;   // P57 A
const m = (x0, y0, x1, y1, sila, podp) => ({ x0, y0, x1, y1, sila, podp });
// 2 najbliższe wzorce badanego obrazu w każdym rodzaju — z doboru programu v3 (P70 A); brak w doborze → _00, _01
const AUTA = [
  { plik: "badany_mini_firanka_dodatki_00.bmp", rodzaj: "firanka",
    wz: { firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"] }, miejsca: [
    m(799, 39, 811, 75, 0.91, "zwykle tu: słupki ściany co ok. metr, plandeka prawie przezroczysta"),
    m(776, 44, 791, 70, 0.62, "zwykle tu: słupki ściany co ok. metr, plandeka prawie przezroczysta"),   // pudło obok dodatku (P67 A)
    m(833, 233, 841, 241, 0.55, "zwykle tu: podwozie — belka poprzeczna"),
    m(904, 214, 912, 238, 0.44, "zwykle tu: podwozie — koła i oś"),
    m(52, 120, 70, 150, 0.27, "zwykle tu: kabina ciągnika"),
    m(512, 96, 530, 128, 0.22, null)] },
  { plik: "badany_mini_chlodnia_dodatki_01.bmp", rodzaj: "chlodnia",
    wz: { chlodnia: ["wzorzec_mini_chlodnia_00", "wzorzec_mini_chlodnia_01"], kontener: ["wzorzec_mini_kontener_02", "wzorzec_mini_kontener_00"] }, miejsca: [
    m(711, 60, 728, 111, 0.83, "zwykle tu: gruba ściana izolacji, cienkie słupki"),
    m(488, 70, 511, 102, 0.66, null),
    m(444, 237, 455, 253, 0.18, "zwykle tu: podwozie — belka poprzeczna")] },
  { plik: "badany_mini_kontener_dodatki_01.bmp", rodzaj: "kontener",
    wz: { kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"], firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"] }, miejsca: [
    m(421, 135, 447, 182, 0.78, "zwykle tu: faliste ściany, narożniki"),
    m(213, 215, 233, 245, 0.35, "zwykle tu: podwozie — podłużnica")] },
  { plik: "badany_mini_kontener_czyste_00.bmp", rodzaj: "kontener",
    wz: { kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"], firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"] }, miejsca: [] },   // A3
  { plik: "badany_mini_firanka_czyste_01.bmp", rodzaj: "firanka",
    wz: { firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_01", "wzorzec_mini_kontener_00"] }, miejsca: [
    m(875, 213, 882, 240, 0.14, "zwykle tu: podwozie — koła i oś")] },
  { plik: "badany_mini_cysterna_dodatki_00.bmp", rodzaj: "cysterna",
    wz: { firanka: ["wzorzec_mini_firanka_02", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_02", "wzorzec_mini_kontener_00"] }, miejsca: [] },   // E5
  { plik: "trudny_mini_firanka_za_ladunkiem_00.bmp", rodzaj: "firanka", trudnyZestaw: true,
    wz: { firanka: ["trudny_wzorzec_mini_firanka_01", "trudny_wzorzec_mini_firanka_00"], kontener: ["trudny_wzorzec_mini_kontener_01", "trudny_wzorzec_mini_kontener_00"],
          chlodnia: ["trudny_wzorzec_mini_chlodnia_01", "trudny_wzorzec_mini_chlodnia_00"] },
    // wynik programu v3 (siła = wynik/2,5, obcięta do 1); dodatek za ładunkiem (291–303 × 98–109) leży w miejscu nr 6
    miejsca: [[740, 178, 856, 256, 2.128], [405, 238, 417, 255, 1.102], [342, 239, 351, 254, 1.028], [146, 215, 154, 233, 0.676],
      [537, 0, 622, 206, 0.657], [166, 31, 332, 196, 0.517], [374, 187, 386, 206, 0.434], [440, 190, 447, 206, 0.434],
      [375, 27, 383, 149, 0.399], [834, 26, 840, 32, 0.271], [553, 242, 557, 254, 0.211]].map(([x0, y0, x1, y1, w]) =>
      m(x0, y0, x1, y1, Math.min(1, w / 2.5), y0 >= 205 || y1 >= 240 ? (x0 > 700 ? "zwykle tu: podwozie — koła i oś" : "zwykle tu: podwozie — belka poprzeczna") : null)) },
];
// udawany wynik po zmianie rodzaju na inny niż pierwotny (analiza „od nowa”)
const MIEJSCA_PO_ZMIANIE = [m(400, 90, 430, 140, 0.48, null), m(620, 220, 640, 246, 0.2, "zwykle tu: podwozie — belka poprzeczna")];
const png = (n) => `obrazy/${n}.png`;
const obrazBadany = (a) => a.wlasny || png(a.plik.replace(/\.bmp$/i, ""));
const wzorceAuta = (a, r) => (a.wz && a.wz[r]) || [`${a.trudnyZestaw ? "trudny_" : ""}wzorzec_mini_${r}_00`, `${a.trudnyZestaw ? "trudny_" : ""}wzorzec_mini_${r}_01`];
const obrazWzorca = (a, r, i = 0) => png(wzorceAuta(a, r)[i]);
const pct = (v, n) => (100 * v / n) + "%";
const kl = (s) => (s === "wysoki" ? "s3" : s === "średni" ? "s2" : "s1");
