// Prześwit — strona MVP (zadania 29, 28, 27): ekrany E1–E7 z makiety r3 (makieta/r3/aplikacja.js), ale wyniki
// z usługi na karcie OMENa przez /api/... zamiast udawanych danych (makieta/r3/dane.js). Ten plik zastępuje dane.js:
// stałe ekranów (te same co w makiecie) i rozmowa z usługą (liczenie, obrazy, budzenie uśpionej usługi — zad. 42).
let W = 1024, H = 256;   // rozmiar obrazu otwartego auta (ustawia otworzAuto) — ramki, lupa i podpowiedź liczą w pikselach
const POWODY = ["element konstrukcji", "zgłoszony ładunek", "błąd obrazu", "nakładanie się ładunku", "inny"]; // P13
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
// rodzaj nieustalony (brak wzorca: program nie dobrał żadnego) → „—”
const NAZWA = new Proxy({ firanka: "firanka", chlodnia: "chłodnia", kontener: "kontener", cysterna: "cysterna" }, { get: (o, k) => o[k] ?? "—" });
const Z_WZORCEM = ["firanka", "chlodnia", "kontener"];   // cysterny nie ma w bibliotece wzorców (P35 A) → E5
const BRAK_WZORCA = "brak wzorca — sprawdź obraz sam";
const BRAK_WSKAZAN = "brak wskazań — to nie gwarancja, że auto jest czyste; obejrzyj obraz sam";   // P58 A
const BEZ_OPISU = PrzeswitLista.POZA_KONSTRUKCJA;   // P42 — z MVP (P81 A)
const PRZYKLAD = "";   // na stronie każdy wynik jest prawdziwy (w makiecie: „wynik przykładowy”, P62 A)
const ILE_NA_LISCIE = 6;   // P57 A
const POKAZOWA = 7;        // partia pokazowa: 7 aut (P51 B, P60 B; skład w usluga/partia-pokazowa.json, zad. 41)
const podpowiedzMiejsca = (x, a) => PrzeswitLista.podpowiedz(x, a.rodzajOperatora || a.rodzaj, W, H);
const obrazBadany = (a) => a.url || "";
// wzorce rodzaju r: rodzaj programu — te, z którymi liczył; inny rodzaj — najbliższe z doboru (dobor: od najbliższego)
const wzorceAuta = (a, r) => (r === (a.rodzajLiczony || a.rodzaj) && a.wzorce?.length ? a.wzorce
  : (a.dobor || []).filter((d) => d.typ === r).map((d) => d.id));
const obrazWzorca = (a, r, i = 0) => {
  const id = wzorceAuta(a, r)[i];
  return id ? `/api/obraz?biblioteka=${encodeURIComponent(a.biblioteka || "mini")}&id=${encodeURIComponent(id)}` : null;
};
const pct = (v, n) => (100 * v / n) + "%";
const kl = () => "s2";   // P79 B: jeden kolor
const OBEJRZANE = "obejrzane, bez wskazań";
const NIEOTWARTE = "program nic nie wskazał — nieotwarte";
const OTWARTE_NIEZAMKNIETE = "program nic nie wskazał — otwarte, niezamknięte";
const stanBezMiejsc = (a) => (a.zamkniete ? OBEJRZANE : a.otwarte ? OTWARTE_NIEZAMKNIETE : NIEOTWARTE);

// ---------- usługa ----------
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
const sek = (t0) => Math.round((performance.now() - t0) / 1000);
function napisUslugi(tekst, klasa) { const e = document.getElementById("karta"); e.textContent = tekst; e.className = klasa || ""; }
async function karta() {
  try {
    const k = (await (await fetch("/api/zdrowie")).json()).karta || {};
    if (k.ok) napisUslugi(`Karta gotowa: ${k.karta || k.urzadzenie} (metoda ${k.metoda})`, "ok");
    else napisUslugi(k.stan === "uśpiona" ? "Program śpi — obsługa budzi go ręcznie przed pokazem (ok. 30 s)" : k.stan === "budzi się" || k.stan === "w kolejce" ? k.blad : k.blad || "karta nie liczy", k.stan === "uśpiona" ? "" : k.stan === "budzi się" || k.stan === "w kolejce" ? "budze" : "zle");
  } catch { napisUslugi("Brak połączenia ze stroną", "zle"); }
}
// zad. 42: usługa śpi → strona sama ją budzi, czeka na zdrowie i liczy jeszcze raz
async function obudz() {
  const t0 = performance.now();
  napisUslugi("Uruchamiam program, ok. 30 s…", "budze");
  const r = await fetch("/api/obudz", { method: "POST" });
  const s = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(s.blad || "nie udało się uruchomić programu");
  while (sek(t0) < 300) {
    await czekaj(3000);
    const k = (await (await fetch("/api/zdrowie")).json().catch(() => ({}))).karta || {};
    if (k.ok) { S.budzenie = sek(t0); napisUslugi(`Program uruchomiony w ${S.budzenie} s`, "ok"); return; }
    if (k.stan === "uśpiona" && sek(t0) > 90) throw new Error(k.blad || "program nie wstał — spróbuj jeszcze raz");
    napisUslugi(`${k.stan === "w kolejce" ? k.blad : "Uruchamiam program, ok. 30 s"}… (${sek(t0)} s)`, "budze");
  }
  throw new Error("program nie wstał w 5 min — spróbuj za chwilę");
}
let budzi = null;   // jedno budzenie naraz, nawet gdy kilka aut czeka
async function zapytaj(zrob) {
  const odp = async () => {
    const r = await zrob();
    try { return [r, await r.json()]; } catch { throw new Error(`serwer odpowiedział błędem ${r.status} — spróbuj za chwilę`); }
  };
  let [r, j] = await odp();
  if (r.status === 503 && j.uspiona) {
    budzi = budzi || obudz().finally(() => { budzi = null; });
    await budzi;
    [r, j] = await odp();
  }
  if (!r.ok) throw new Error(j.blad || `błąd ${r.status}`);
  return j;
}
let pokazowa = null;   // wyniki partii pokazowej: jedno liczenie na partię
async function liczAuto(a, typ) {
  if (a.plikF) {
    const q = `nazwa=${encodeURIComponent(a.plikF.name)}` + (typ ? `&typ=${encodeURIComponent(typ)}` : "");
    return zapytaj(() => fetch(`/api/analiza?${q}`, { method: "POST", body: a.plikF }));
  }
  pokazowa = pokazowa || zapytaj(() => fetch("/api/partia-pokazowa")).catch((e) => { pokazowa = null; throw e; });
  return (await pokazowa).wyniki[a.nrPartii];
}
// wynik usługi → pola auta (miejsca od najmocniejszego — kolejność z usługi, P79 B)
function przyjmij(a, w) {
  if (!w || w.blad) { a.zepsuty = true; a.blad = w?.blad || "brak wyniku"; return; }
  Object.assign(a, { plik: a.nazwa || w.plik, szer: w.szer || 1024, wys: w.wys || 256, rodzaj: a.rodzaj === undefined ? w.rodzaj : a.rodzaj,
    rodzajLiczony: w.rodzaj, wzorce: w.wzorce || [], dobor: a.dobor?.length ? a.dobor : w.dobor || [], biblioteka: w.biblioteka || "mini",
    brak: Boolean(w.brak_wzorca), czas_s: w.czas_s });
  if (!a.url && w.obraz) a.url = `/api/obraz?${w.obraz}`;
  a.oryg = (w.miejsca || []).map((m) => ({ x0: m.x0, y0: m.y0, x1: m.x1, y1: m.y1, sila: m.roznica }));
  a.miejsca = a.oryg.map((x) => ({ ...x }));
}
