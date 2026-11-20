// Test makiety R3 na sztucznym DOM (bez przeglądarki): punkty z docs/odbior-makiety.md „Zgodność z odpowiedziami Artura”
// i M1 (P83 A). node testy/test_makieta_r3.mjs
//  2. P80 A / P57 A / P40 B — przejście auto 7 → auto 2 zeruje miejsce, przybliżenie, wzorzec i „pokaż wszystkie”
//  3. P60 B — na ekranach nie ma nazw plików z danych (trudny_…, badany_…)
//  4. P64 A / P22 A — auto z decyzjami bez „Zamknij auto” ma w raporcie kto i godzinę
//  5. P25 A — „docelowo” przy pracy bez internetu;  6. P62 A — jeden napis o wyniku przykładowym
//  M1 / P83 A — „Zapisz i zamknij partię” z autem bez decyzji: ostrzeżenie z listą aut (nr rej.), „Zapisz mimo to”, „Wróć”
// P85 B — liczba miejsc aut = wynik v3 w makieta/r3/wynik-v3 (skrypt generuj_dane.mjs)
import fs from "fs";
import vm from "vm";
const czytaj = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");
let ok = 0, zle = 0;
const sprawdz = (war, opis) => { if (war) ok++; else { zle++; console.log("BŁĄD:", opis); } };

const el = {}, pobrane = [];
const nowy = (id) => ({ id, style: {}, dataset: {}, innerHTML: "", textContent: "", value: "", disabled: false, src: "",
  classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, v) { (v ?? !this._s.has(c)) ? this._s.add(c) : this._s.delete(c); }, contains(c) { return this._s.has(c); } },
  querySelectorAll: () => [], querySelector: () => null, appendChild() {}, append() {}, insertAdjacentHTML(_, h) { this.innerHTML += h; },
  remove() {}, focus() {}, click() {}, getAttribute(k) { return this[k]; }, setAttribute(k, v) { this[k] = v; }, removeAttribute(k) { delete this[k]; },
  addEventListener() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1, height: 1 }), clientWidth: 100, clientHeight: 50, scrollWidth: 400, scrollHeight: 100 });
const DYNAMICZNE = ["mimo", "wroc", "pokazwiecej", "zmienrodz2"];   // istnieją tylko, gdy są w czyimś innerHTML
const document = {
  getElementById(id) {
    if (DYNAMICZNE.includes(id) && !Object.values(el).some((e) => e.innerHTML.includes(`id="${id}"`))) return null;
    return (el[id] ||= nowy(id));
  },
  querySelectorAll: () => [], createElement: (t) => Object.assign(nowy(""), { tag: t }),
  body: { append: (a) => pobrane.push(a.download) },
};
const kt = vm.createContext({ document, console, setTimeout: (f) => f(), requestAnimationFrame: () => {}, scrollTo() {}, addEventListener() {},
  URL: { createObjectURL: () => "blob:x" }, Blob: class { constructor(c) { this.c = c; } }, Uint8Array, Promise, Date, Math, String, Object });
for (const p of ["../mvp/widok-auta/widok.js", "../makieta/r3/dane.js", "../makieta/r3/aplikacja.js"]) vm.runInContext(czytaj(p), kt, { filename: p });
const js = (k) => vm.runInContext(k, kt);

// start, partia pokazowa, liczenie (setTimeout od razu)
js(`$("funk").value = "st. asp. Nowak"; $("miejsce").value = "Kukuryki"; $("start").onclick(); $("pokazowa").onclick();`);
const e2 = el.wybrane.innerHTML;
js(`$("policz").onclick()`);
sprawdz(js("policzone()"), "partia policzona");
const e3 = el["p-wiersze"].innerHTML.replace(/src="[^"]*"/g, "");   // widoczny tekst, bez adresów obrazków

// P85 B: liczba miejsc = wynik v3
const wyn = { mini: JSON.parse(czytaj("../makieta/r3/wynik-v3/mini.json")), "mini-trudny": JSON.parse(czytaj("../makieta/r3/wynik-v3/mini-trudny.json")) };
const auta = js("S.partia.map((a) => ({ plik: a.plik, n: a.miejsca.length, bw: brakWzorca(a) }))");
auta.forEach((a, i) => {
  const r = [...wyn.mini.wyniki, ...wyn["mini-trudny"].wyniki].find((x) => x.plik === a.plik);
  const n = r.brak_wzorca ? 0 : Object.values(r.konfiguracje)[0].miejsca.length;
  sprawdz(a.n === n && a.bw === !!r.brak_wzorca, `P85 B auto ${i + 1}: ${a.n} miejsc w makiecie = ${n} w wyniku v3${r.brak_wzorca ? " (brak wzorca)" : ""}`);
});
sprawdz(auta.length === 7, "7 aut w partii pokazowej");

// punkt 2: auto 7, miejsce 6, przybliżenie 4×, wzorzec 2, pokaż wszystkie → wejście w auto 2
js(`otworzAuto(6); S.wzn = 1; S.wszystkie = true; wybierz(5);`);
sprawdz(js("S.im") === 5 && js("S.zoom") === 4, "auto 7: wybrane miejsce 6 w przybliżeniu 4×");
const e4 = el["a-plik"].textContent + " " + el["a-nazwa"].textContent;
js(`$("dolisty").onclick(); otworzAuto(1);`);
sprawdz(js("S.im") === 0, `auto 2 po aucie 7: wybrane miejsce 1 (jest ${js("S.im") + 1})`);
sprawdz(js("S.zoom") === 1 && js("S.wzn") === 0 && js("S.wszystkie") === false, "auto 2 po aucie 7: przybliżenie 1×, wzorzec 1, lista do 6");
sprawdz(js("A().miejsca[S.im]") !== undefined, "auto 2: wybrane miejsce istnieje");
sprawdz(/miejsce 1\b/.test(el["a-dec"].innerHTML), "auto 2: panel decyzji o miejscu 1");

// punkt 3: bez nazw plików z danych na E2, E3, E4 (i w raporcie)
for (const [ekr, h] of [["E2", e2], ["E3", e3], ["E4", e4]]) sprawdz(!/badany_|trudny_|wzorzec_/.test(h), `${ekr}: brak nazwy pliku z danych`);
sprawdz(e3.includes("skan_07.bmp"), "E3: neutralna nazwa skan_07.bmp");

// punkt 4: auto 2 — jedna decyzja, bez „Zamknij auto”
js(`decyduj(A(), 0, { d: "zatwierdzone" }); $("dolisty").onclick();`);
let w = js("wierszeRaportu()");
const w2 = w.find((r) => r.auto === 2);
sprawdz(w2.kto === "st. asp. Nowak" && w2.data_godzina !== "—" && !w2.zamkniete, `raport auto 2 (niezamknięte, z decyzją): kto „${w2.kto}”, data „${w2.data_godzina}”`);
sprawdz(w.find((r) => r.auto === 3).kto === "—", "auto 3 bez decyzji: kto —");
sprawdz(!w.some((r) => /badany_|trudny_/.test(r.plik)), "raport: neutralne nazwy");

// M1 / P83 A: zamknięcie partii z autami bez decyzji
js(`S.partia[0].nr = "WPI 12345"; $("doraportu").onclick(); $("zapisz").onclick();`);
const ostrz = el["r-ostrz"].innerHTML;
sprawdz(ostrz.includes("Brak decyzji:") && ostrz.includes("auto 1 (WPI 12345)") && ostrz.includes("auto 7"), "ostrzeżenie z listą aut bez decyzji i nr rej.");
sprawdz(!/auto 6\b/.test(ostrz), "auto 6 (brak wzorca) nie jest na liście braków");
sprawdz(ostrz.includes("Zapisz mimo to") && ostrz.includes('id="wroc"'), "przyciski „Zapisz mimo to” i „Wróć”");
sprawdz(js("S.zamknieta") === false && pobrane.length === 0, "partia jeszcze otwarta, nic nie zapisane");
js(`$("wroc").onclick()`);
sprawdz(js("S.zamknieta") === false && js("S.potwierdz") === false, "„Wróć” — partia otwarta, ostrzeżenie schowane");
js(`$("doraportu").onclick(); $("zapisz").onclick(); $("mimo").onclick();`);
sprawdz(js("S.zamknieta") === true && pobrane.join() === "raport-partii.json,raport-partii.csv", `„Zapisz mimo to” zapisuje (${pobrane.join(", ")}) i zamyka partię`);
// partia bez braków zapisuje się od razu
js(`$("nowa").onclick(); $("pokazowa").onclick(); $("policz").onclick(); S.partia.forEach((a) => { a.miejsca.forEach((_, j) => (a.decyzje[j] = { d: "zatwierdzone" })); a.kiedy = "x"; });
    $("doraportu").onclick(); $("zapisz").onclick();`);
sprawdz(js("S.zamknieta") === true && pobrane.length === 4, "bez braków: zapis od razu, bez ostrzeżenia");

// punkty 5 i 6
const html = czytaj("../makieta/r3/index.html"), app = czytaj("../makieta/r3/aplikacja.js");
sprawdz(/docelowo[^<]*bez internetu/.test(html), "P25 A: „docelowo … bez internetu”");
sprawdz(!/wynik przykładowy \(makieta\)|próba wgrania/.test(app + html), "P62 A: bez starych wersji napisu");
sprawdz((html.match(/wynik przykładowy/g) || []).every(() => html.includes("makieta: wynik przykładowy, nie z Twojego obrazu")), "P62 A: napis w index.html taki jak PRZYKLAD");
sprawdz(!/\/\/[^\n]*\b(S\.im =|brak_decyzji:)/.test(app), "żaden kod nie siedzi w komentarzu (S.im, brak_decyzji)");
console.log(`makieta R3: ${ok + zle} sprawdzeń — ${zle ? `BŁĘDY: ${zle}` : "OK"}`);
process.exit(zle ? 1 : 0);
