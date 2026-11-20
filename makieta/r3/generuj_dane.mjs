// P85 B: auta 1–7 makiety R3 z prawdziwego wyniku wykryj_v3 (karta OMENa, odbiór testy/odbior/odbior.sh: partia pokazowa
// dane/mini i dane/mini-trudny, biblioteka bez cysterny, próg „brak wzorca” z zadania 36). Wstawia blok AUTA do dane.js
// (między znacznikami AUTA-START / AUTA-KONIEC); podpowiedzi liczy w przeglądarce wspólna lista STREF (mvp/widok-auta/widok.js).
// Przeliczenie (np. auto 4 po sondzie 38): odbiór na karcie, potem
//   rsync …:ork/<id>/wyniki/odbior/mini/wyniki.json makieta/r3/wynik-v3/mini.json   (i mini-trudny)
//   node makieta/r3/generuj_dane.mjs            → zmienia makieta/r3/dane.js, wypisuje liczbę miejsc na auto
// Inny plik dla auta: zmień PARTIA niżej (plik, zestaw).
import fs from "fs";
const tu = (p) => new URL(p, import.meta.url);
const PARTIA = [   // P60 B: 7 aut, trudny w środku partii bez oznaczenia na ekranie
  ["badany_mini_firanka_dodatki_00.bmp", "mini"],
  ["badany_mini_chlodnia_dodatki_01.bmp", "mini"],
  ["badany_mini_kontener_dodatki_01.bmp", "mini"],
  ["badany_mini_kontener_czyste_00.bmp", "mini"],
  ["badany_mini_firanka_czyste_01.bmp", "mini"],
  ["badany_mini_cysterna_dodatki_00.bmp", "mini"],
  ["trudny_mini_firanka_za_ladunkiem_00.bmp", "mini-trudny"],
];
const RODZAJE = ["firanka", "chlodnia", "kontener", "cysterna"];
const zestawy = {};
const wynik = (zestaw) => (zestawy[zestaw] ||= JSON.parse(fs.readFileSync(tu(`wynik-v3/${zestaw}.json`), "utf8")));
const linie = [], liczby = [];
PARTIA.forEach(([plik, zestaw], i) => {
  const d = wynik(zestaw), r = d.wyniki.find((x) => x.plik === plik);
  if (!r) throw new Error(`brak ${plik} w wynik-v3/${zestaw}.json`);
  if (r.szer !== 1024 || r.wys !== 256) throw new Error(`${plik}: ${r.szer}×${r.wys}, makieta zakłada 1024×256`);
  const k = Object.values(r.konfiguracje)[0];
  const rodzaj = RODZAJE.find((t) => plik.includes(`_${t}_`));
  const wz = {};   // P70 A: 2 najbliższe wzorce w rodzaju — z doboru programu
  for (const x of r.dobor || []) (wz[x.typ] ||= []).length < 2 && wz[x.typ].push(x.id);
  for (const t of Object.keys(wz)) if (wz[t].length < 2) delete wz[t];
  const ms = r.brak_wzorca ? [] : k.miejsca.map((x) => `[${x.x0}, ${x.y0}, ${x.x1}, ${x.y1}, ${x.wynik}]`);
  liczby.push(`auto ${i + 1}: ${r.brak_wzorca ? "brak wzorca, 0" : ms.length} miejsc (${plik}, typ wybrany: ${k.typ_wybrany})`);
  linie.push(`  { plik: ${JSON.stringify(plik)}, nazwa: "skan_${String(i + 1).padStart(2, "0")}.bmp", rodzaj: ${JSON.stringify(rodzaj)},${zestaw === "mini-trudny" ? " trudnyZestaw: true," : ""}${r.brak_wzorca ? " brakWzorcaProgramu: true," : ""}
    wz: ${JSON.stringify(wz)},
    miejsca: [${ms.join(", ")}].map(zWyniku) },`);
});
const blok = `// AUTA-START — generuje makieta/r3/generuj_dane.mjs z makieta/r3/wynik-v3/*.json (wykryj_v3, ${Object.values(zestawy)[0].konfiguracje[0]}); nie edytować ręcznie
const zWyniku = ([x0, y0, x1, y1, w]) => m(x0, y0, x1, y1, Math.min(1, w / 2.5));   // siła tylko do kolejności (P79 B)
const AUTA = [
${linie.join("\n")}
];
// ${liczby.join("; ")}
// AUTA-KONIEC`;
const f = tu("dane.js"), s = fs.readFileSync(f, "utf8");
const re = /\/\/ AUTA-START[\s\S]*?\/\/ AUTA-KONIEC/;
if (!re.test(s)) throw new Error("dane.js bez znaczników AUTA-START / AUTA-KONIEC");
fs.writeFileSync(f, s.replace(re, () => blok));
console.log(liczby.join("\n"));
