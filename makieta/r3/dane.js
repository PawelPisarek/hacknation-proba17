// Makieta R3 — udawane dane (dane sztuczne z dane/mini i dane/mini-trudny, PNG w obrazy/).
// Auta 1–6: ramki wpisane na sztywno (R1) + jedno pudło obok prawdziwego dodatku w aucie 1 (P67 A).
// Auto 7 (przypadek trudny, P60 B): ramki z prawdziwego wyniku programu v3 (zadanie 20, najlepsza konfiguracja).
// Kolejność miejsc od najmocniejszego (P79 B): bez słów i progów poziomu na ekranie; sila służy tylko do sortowania.
const W = 1024, H = 256;
// P79 B: bez słów niski/średni/wysoki — miejsca tylko w kolejności od najmocniejszego, jeden kolor ramek
const POWODY = ["element konstrukcji", "zgłoszony ładunek", "błąd obrazu", "nakładanie się ładunku", "inny"]; // P13
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
const NAZWA = { firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" };
const Z_WZORCEM = ["firanka", "chlodnia", "kontener"];   // cysterny nie ma w bibliotece wzorców (P35 A) → E5
const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
const BRAK_WSKAZAN = "brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam";   // P58 A
const BEZ_OPISU = PrzeswitLista.POZA_KONSTRUKCJA;   // P42 — z MVP (P81 A)
const PRZYKLAD = "makieta: wynik przykładowy, nie z Twojego obrazu";   // P62 A
const ILE_NA_LISCIE = 6;   // P57 A
const m = (x0, y0, x1, y1, sila) => ({ x0, y0, x1, y1, sila });
// P81 A: podpowiedź „zwykle tu…” / P42 — ta sama funkcja i ta sama lista tekstów co MVP (mvp/widok-auta/widok.js,
// strefy z dane/generator/z12_z14.py); bez ręcznych opisów. Strefy według rodzaju, z którym program porównuje auto.
const podpowiedzMiejsca = (x, a) => PrzeswitLista.podpowiedz(x, a.rodzajOperatora || a.rodzaj, W, H);
// 2 najbliższe wzorce badanego obrazu w każdym rodzaju — z doboru programu v3 (P70 A); brak w doborze → _00, _01
const AUTA = [
  { plik: "badany_mini_firanka_dodatki_00.bmp", rodzaj: "firanka",
    wz: { firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"] }, miejsca: [
    m(799, 39, 811, 75, 0.91),
    m(776, 44, 791, 70, 0.62),   // pudło obok dodatku (P67 A)
    m(833, 233, 841, 241, 0.55),
    m(904, 214, 912, 238, 0.44),
    m(52, 120, 70, 150, 0.27),
    m(512, 96, 530, 128, 0.22)] },
  { plik: "badany_mini_chlodnia_dodatki_01.bmp", rodzaj: "chlodnia",
    wz: { chlodnia: ["wzorzec_mini_chlodnia_00", "wzorzec_mini_chlodnia_01"], kontener: ["wzorzec_mini_kontener_02", "wzorzec_mini_kontener_00"] }, miejsca: [
    m(711, 60, 728, 111, 0.83),
    m(488, 70, 511, 102, 0.66),
    m(444, 237, 455, 253, 0.18)] },
  { plik: "badany_mini_kontener_dodatki_01.bmp", rodzaj: "kontener",
    wz: { kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"], firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"] }, miejsca: [
    m(421, 135, 447, 182, 0.78),
    m(213, 215, 233, 245, 0.35)] },
  { plik: "badany_mini_kontener_czyste_00.bmp", rodzaj: "kontener",
    wz: { kontener: ["wzorzec_mini_kontener_00", "wzorzec_mini_kontener_01"], firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"] }, miejsca: [] },   // A3
  { plik: "badany_mini_firanka_czyste_01.bmp", rodzaj: "firanka",
    wz: { firanka: ["wzorzec_mini_firanka_01", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_01", "wzorzec_mini_kontener_00"] }, miejsca: [
    m(875, 213, 882, 240, 0.14)] },
  { plik: "badany_mini_cysterna_dodatki_00.bmp", rodzaj: "cysterna",
    wz: { firanka: ["wzorzec_mini_firanka_02", "wzorzec_mini_firanka_00"], kontener: ["wzorzec_mini_kontener_02", "wzorzec_mini_kontener_00"] }, miejsca: [] },   // E5
  { plik: "trudny_mini_firanka_za_ladunkiem_00.bmp", rodzaj: "firanka", trudnyZestaw: true,
    wz: { firanka: ["trudny_wzorzec_mini_firanka_01", "trudny_wzorzec_mini_firanka_00"], kontener: ["trudny_wzorzec_mini_kontener_01", "trudny_wzorzec_mini_kontener_00"],
          chlodnia: ["trudny_wzorzec_mini_chlodnia_01", "trudny_wzorzec_mini_chlodnia_00"] },
    // wynik programu v3 (siła = wynik/2,5, obcięta do 1); dodatek za ładunkiem (291–303 × 98–109) leży w miejscu nr 6
    miejsca: [[740, 178, 856, 256, 2.128], [405, 238, 417, 255, 1.102], [342, 239, 351, 254, 1.028], [146, 215, 154, 233, 0.676],
      [537, 0, 622, 206, 0.657], [166, 31, 332, 196, 0.517], [374, 187, 386, 206, 0.434], [440, 190, 447, 206, 0.434],
      [375, 27, 383, 149, 0.399], [834, 26, 840, 32, 0.271], [553, 242, 557, 254, 0.211]].map(([x0, y0, x1, y1, w]) =>
      m(x0, y0, x1, y1, Math.min(1, w / 2.5))) },
];
// udawany wynik po zmianie rodzaju na inny niż pierwotny (analiza „od nowa”)
const MIEJSCA_PO_ZMIANIE = [m(400, 90, 430, 140, 0.48), m(620, 220, 640, 246, 0.2)];
const png = (n) => `../r2/obrazy/${n}.png`;   // obrazy wspólne z R2 (R2 bez zmian)
const obrazBadany = (a) => a.wlasny || png(a.plik.replace(/\.bmp$/i, ""));
const wzorceAuta = (a, r) => (a.wz && a.wz[r]) || [`${a.trudnyZestaw ? "trudny_" : ""}wzorzec_mini_${r}_00`, `${a.trudnyZestaw ? "trudny_" : ""}wzorzec_mini_${r}_01`];
const obrazWzorca = (a, r, i = 0) => png(wzorceAuta(a, r)[i]);
const pct = (v, n) => (100 * v / n) + "%";
const kl = () => "s2";   // P79 B: jeden kolor (kolor nie zastępuje słowa poziomu)

// P80 A + decyzja 15:29: stan auta bez miejsc — nieotwarte → otwarte, niezamknięte → po „Zamknij auto” obejrzane (z osobą i godziną)
const OBEJRZANE = "obejrzane, bez wskazań";
const NIEOTWARTE = "program nic nie wskazał — nieotwarte";
const OTWARTE_NIEZAMKNIETE = "program nic nie wskazał — otwarte, niezamknięte";
const stanBezMiejsc = (a) => (a.zamkniete ? OBEJRZANE : a.otwarte ? OTWARTE_NIEZAMKNIETE : NIEOTWARTE);
