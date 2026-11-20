// Makieta R3 — udawane dane (dane sztuczne z dane/mini i dane/mini-trudny, PNG w obrazy/).
// P85 B: wszystkie 7 aut — ramki z prawdziwego wyniku wykryj_v3 na karcie (makieta/r3/wynik-v3, skrypt generuj_dane.mjs).
// Auto 7 to przypadek trudny (P60 B); na ekranie auta mają neutralne nazwy skan_NN.bmp (P60 B).
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
// P81 A: podpowiedź strefy / P42 — ta sama funkcja i ta sama lista tekstów co MVP (mvp/widok-auta/widok.js,
// strefy z dane/generator/z12_z14.py); bez ręcznych opisów. Strefy według rodzaju, z którym program porównuje auto.
const podpowiedzMiejsca = (x, a) => PrzeswitLista.podpowiedz(x, a.rodzajOperatora || a.rodzaj, W, H);
// AUTA-START — generuje makieta/r3/generuj_dane.mjs z makieta/r3/wynik-v3/*.json (wykryj_v3, trend=1,tolx=2,rho=0.1,konstr=1,min_pole=0.0001,lok=2,jas=1,wyb=1,tau_pud=0.08,tau_pod=0.2,tau_kab=0.2,scal=0.01); nie edytować ręcznie
const zWyniku = ([x0, y0, x1, y1, w]) => m(x0, y0, x1, y1, Math.min(1, w / 2.5));   // siła tylko do kolejności (P79 B)
const AUTA = [
  { plik: "badany_mini_firanka_dodatki_00.bmp", nazwa: "skan_01.bmp", rodzaj: "firanka",
    wz: {"firanka":["wzorzec_mini_firanka_01","wzorzec_mini_firanka_00"],"kontener":["wzorzec_mini_kontener_00","wzorzec_mini_kontener_01"]},
    miejsca: [[819, 191, 861, 256, 1.063], [770, 216, 779, 243, 0.94], [799, 39, 811, 75, 0.602], [612, 0, 625, 206, 0.499], [220, 187, 238, 206, 0.452], [707, 0, 730, 202, 0.385], [638, 191, 650, 206, 0.364], [854, 26, 860, 37, 0.358]].map(zWyniku) },
  { plik: "badany_mini_chlodnia_dodatki_01.bmp", nazwa: "skan_02.bmp", rodzaj: "chlodnia",
    wz: {"chlodnia":["wzorzec_mini_chlodnia_00","wzorzec_mini_chlodnia_01"],"kontener":["wzorzec_mini_kontener_02","wzorzec_mini_kontener_00"]},
    miejsca: [[783, 191, 842, 250, 1.275], [888, 197, 903, 219, 0.755], [711, 60, 728, 111, 0.602], [488, 70, 511, 101, 0.46], [578, 35, 584, 62, 0.256], [343, 191, 348, 203, 0.242]].map(zWyniku) },
  { plik: "badany_mini_kontener_dodatki_01.bmp", nazwa: "skan_03.bmp", rodzaj: "kontener",
    wz: {"kontener":["wzorzec_mini_kontener_00","wzorzec_mini_kontener_01"],"firanka":["wzorzec_mini_firanka_01","wzorzec_mini_firanka_00"]},
    miejsca: [[822, 212, 835, 247, 1.268], [752, 210, 762, 251, 1.041], [397, 239, 403, 254, 1.004], [882, 218, 893, 239, 0.597], [214, 233, 232, 245, 0.572], [422, 135, 447, 182, 0.486], [886, 188, 891, 205, 0.445], [887, 27, 891, 45, 0.437], [74, 52, 78, 64, 0.401], [807, 0, 828, 201, 0.248], [789, 167, 794, 203, 0.232], [544, 193, 548, 201, 0.202]].map(zWyniku) },
  { plik: "badany_mini_kontener_czyste_00.bmp", nazwa: "skan_04.bmp", rodzaj: "kontener",
    wz: {"kontener":["wzorzec_mini_kontener_00","wzorzec_mini_kontener_01"],"firanka":["wzorzec_mini_firanka_01","wzorzec_mini_firanka_00"]},
    miejsca: [[472, 238, 485, 255, 1.316], [389, 239, 402, 254, 1.309], [866, 204, 882, 248, 1.028], [789, 216, 804, 250, 0.764], [752, 248, 771, 256, 0.305], [783, 27, 787, 53, 0.282], [511, 27, 523, 98, 0.282], [783, 192, 787, 200, 0.142]].map(zWyniku) },
  { plik: "badany_mini_firanka_czyste_01.bmp", nazwa: "skan_05.bmp", rodzaj: "firanka",
    wz: {"firanka":["wzorzec_mini_firanka_01","wzorzec_mini_firanka_00"],"kontener":["wzorzec_mini_kontener_01","wzorzec_mini_kontener_00"]},
    miejsca: [[784, 193, 823, 256, 1.442], [919, 218, 928, 231, 0.753], [620, 22, 660, 205, 0.549], [224, 24, 263, 204, 0.473], [490, 190, 498, 204, 0.426], [717, 0, 737, 204, 0.377], [322, 29, 335, 89, 0.361]].map(zWyniku) },
  { plik: "badany_mini_cysterna_dodatki_00.bmp", nazwa: "skan_06.bmp", rodzaj: "cysterna", brakWzorcaProgramu: true,
    wz: {"firanka":["wzorzec_mini_firanka_02","wzorzec_mini_firanka_01"],"chlodnia":["wzorzec_mini_chlodnia_01","wzorzec_mini_chlodnia_00"]},
    miejsca: [].map(zWyniku) },
  { plik: "trudny_mini_firanka_za_ladunkiem_00.bmp", nazwa: "skan_07.bmp", rodzaj: "firanka", trudnyZestaw: true,
    wz: {"firanka":["trudny_wzorzec_mini_firanka_01","trudny_wzorzec_mini_firanka_00"],"kontener":["trudny_wzorzec_mini_kontener_01","trudny_wzorzec_mini_kontener_00"]},
    miejsca: [[740, 178, 856, 256, 2.128], [405, 238, 417, 255, 1.102], [342, 239, 351, 254, 1.028], [146, 215, 154, 233, 0.676], [537, 0, 622, 206, 0.657], [166, 31, 332, 196, 0.517], [374, 187, 386, 206, 0.434], [440, 190, 447, 206, 0.434], [375, 27, 383, 149, 0.399], [834, 26, 840, 32, 0.271], [553, 242, 557, 254, 0.211]].map(zWyniku) },
];
// auto 1: 8 miejsc (badany_mini_firanka_dodatki_00.bmp, typ wybrany: firanka); auto 2: 6 miejsc (badany_mini_chlodnia_dodatki_01.bmp, typ wybrany: chlodnia); auto 3: 12 miejsc (badany_mini_kontener_dodatki_01.bmp, typ wybrany: kontener); auto 4: 8 miejsc (badany_mini_kontener_czyste_00.bmp, typ wybrany: kontener); auto 5: 7 miejsc (badany_mini_firanka_czyste_01.bmp, typ wybrany: firanka); auto 6: brak wzorca, 0 miejsc (badany_mini_cysterna_dodatki_00.bmp, typ wybrany: null); auto 7: 11 miejsc (trudny_mini_firanka_za_ladunkiem_00.bmp, typ wybrany: firanka)
// AUTA-KONIEC
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
