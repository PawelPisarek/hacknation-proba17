// Makieta R1 — udawane dane. Obrazy: prawdziwe PNG z dane/mini (1024×256), ramki wpisane na sztywno.
// Słowo różnicy wg P45 B: stałe progi siły różnicy, te same w każdym aucie (wartości progów czekają — P49;
// w makiecie dowolne: PROGI niżej). Czyste auto: „brak wskazań” albo tylko „niski”.
const W = 1024, H = 256;
const PROGI = { wysoki: 0.6, sredni: 0.3 };   // PARAMETR: do Artura (P49) — wartości dowolne na makietę
const slowo = (s) => (s >= PROGI.wysoki ? "wysoki" : s >= PROGI.sredni ? "średni" : "niski");
const POWODY = ["element konstrukcji", "zgłoszony ładunek", "błąd obrazu", "nakładanie się ładunku", "inny"]; // P13
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
const NAZWA = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };
const Z_WZORCEM = ["firanka", "chlodnia", "kontener"];   // cysterny nie ma w bibliotece wzorców (P35 A) → E5
const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
const BEZ_OPISU = "poza znaną konstrukcją, obejrzyj uważnie";   // P42
// podpowiedź „zwykle tu…” (P39 B) — opis strefy konstrukcji; null = poza znaną konstrukcją (P42)
const m = (x0, y0, x1, y1, sila, podp) => ({ x0, y0, x1, y1, sila, podp });
const AUTA = [
  { id: 1, plik: "badany_mini_firanka_dodatki_00.bmp", png: "firanka_dodatki_00", rodzaj: "firanka", miejsca: [
    m(799, 39, 811, 75, 0.91, "zwykle tu: słupki ściany co ok. metr, plandeka prawie przezroczysta"),
    m(833, 233, 841, 241, 0.55, "zwykle tu: podwozie — belka poprzeczna"),
    m(904, 214, 912, 238, 0.44, "zwykle tu: podwozie — koła i oś"),
    m(52, 120, 70, 150, 0.27, "zwykle tu: kabina ciągnika"),
    m(512, 96, 530, 128, 0.22, null),
    m(300, 226, 316, 244, 0.12, "zwykle tu: podwozie — podłużnica")] },
  { id: 2, plik: "badany_mini_chlodnia_dodatki_01.bmp", png: "chlodnia_dodatki_01", rodzaj: "chlodnia", miejsca: [
    m(711, 60, 728, 111, 0.83, "zwykle tu: gruba ściana izolacji, cienkie słupki"),
    m(488, 70, 511, 102, 0.66, null),
    m(444, 237, 455, 253, 0.18, "zwykle tu: podwozie — belka poprzeczna")] },
  { id: 3, plik: "badany_mini_kontener_dodatki_01.bmp", png: "kontener_dodatki_01", rodzaj: "kontener", miejsca: [
    m(421, 135, 447, 182, 0.78, "zwykle tu: faliste ściany, narożniki"),
    m(213, 215, 233, 245, 0.35, "zwykle tu: podwozie — podłużnica")] },
  { id: 4, plik: "badany_mini_kontener_czyste_00.bmp", png: "kontener_czyste_00", rodzaj: "kontener", miejsca: [] },  // czyste: brak wskazań (A3)
  { id: 5, plik: "badany_mini_firanka_czyste_01.bmp", png: "firanka_czyste_01", rodzaj: "firanka", miejsca: [
    m(875, 213, 882, 240, 0.14, "zwykle tu: podwozie — koła i oś")] },                                                  // czyste: tylko „niski”
  { id: 6, plik: "badany_mini_cysterna_dodatki_00.bmp", png: "cysterna_dodatki_00", rodzaj: "cysterna", miejsca: [] }, // brak wzorca (E5)
];
// udawany wynik po zmianie rodzaju na inny niż pierwotny (analiza „od nowa”)
const MIEJSCA_PO_ZMIANIE = [m(400, 90, 430, 140, 0.48, null), m(620, 220, 640, 246, 0.2, "zwykle tu: podwozie — belka poprzeczna")];
const obrazBadany = (a) => `../warianty/obrazy/${a.png}.png`;
const obrazWzorca = (r, i = 0) => `../warianty/obrazy/${r}_0${i}.png`;
const pct = (v, n) => (100 * v / n) + "%";
const kl = (s) => (s === "wysoki" ? "s3" : s === "średni" ? "s2" : "s1");
