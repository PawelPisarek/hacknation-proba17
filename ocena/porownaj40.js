// Porównanie CLI 40: wynik wykryj_v3 z wiersza poleceń na karcie (makieta/r3/wynik-v3/*.json, zgl-5130, ta sama siatka,
// szer_rob 2048) kontra wynik usługi pod linkiem (docs/odbior40-cli/link_*.json: GET /api/partia-pokazowa?nr=N[&typ=]
// i POST /api/analiza — ta sama ścieżka co „Dodaj jeden obraz”). Uruchomienie z katalogu repo: node ocena/porownaj40.js
const fs = require("fs"), C = (b) => require(process.cwd() + `/makieta/r3/wynik-v3/${b}.json`);
const rf = (m) => [m.x0, m.y0, m.x1, m.y1];
const kl = (b, p) => { const r = C(b).wyniki.find((x) => x.plik === p), k = Object.values(r.konfiguracje)[0]; return { typ: k.typ_wybrany, wz: k.wzorce, r: k.miejsca.map(rf), wyn: k.miejsca.map((m) => m.wynik) }; };
const lk = (f) => { let j = JSON.parse(fs.readFileSync("docs/odbior40-cli/" + f)); if (j.wyniki) j = j.wyniki[0]; return { typ: j.rodzaj, wz: j.wzorce, r: j.miejsca.map(rf), wyn: j.miejsca.map((m) => m.roznica), czas: j.czas_s }; };
const por = (a, b) => {
  const A = a.r.map(String), B = b.r.map(String), wsp = A.filter((x) => B.includes(x)).length;
  let dmax = 0; for (const x of a.r) { let best = 1e9; for (const y of b.r) best = Math.min(best, Math.max(...x.map((v, i) => Math.abs(v - y[i])))); dmax = Math.max(dmax, best); }
  const dw = Math.max(0, ...a.wyn.map((w, i) => { const j = B.indexOf(A[i]); return j < 0 ? 0 : Math.abs(w - b.wyn[j]); }));
  const zg = a.typ === b.typ && a.r.length === b.r.length && wsp === a.r.length && dw < 1e-3;
  return `${zg ? "ZGODNE" : "NIEZGODNE"}: rodzaj ${a.typ}/${b.typ}, wzorce ${JSON.stringify(a.wz) === JSON.stringify(b.wz) ? "te same" : "inne"}, miejsc ${a.r.length}/${b.r.length}, ramek identycznych ${wsp}, max odchyłka ramki ${dmax} px, max różnica wyniku ${dw.toFixed(4)}`;
};
const K = "badany_mini_kontener_dodatki_01.bmp", CH = "badany_mini_chlodnia_czyste_00.bmp", T = "trudny_mini_firanka_za_ladunkiem_00.bmp";
console.log("1a kontener_dodatki_01, CLI vs link partia nr=2:    " + por(kl("mini", K), lk("link_nr2.json")));
console.log("1b kontener_dodatki_01, CLI vs link wgranie (POST): " + por(kl("mini", K), lk("link_up_kont.json")));
console.log("2  chlodnia_czyste_00 (auto 8), CLI vs link POST:  " + por(kl("mini", CH), lk("link_up_chl.json")));
console.log("3a auto 7 bez typu, CLI vs link nr=6:               " + por(kl("mini-trudny", T), lk("link_nr6.json")));
const t = lk("link_nr6_kontener.json");
console.log(`3b auto 7 &typ=kontener, link: rodzaj ${t.typ}, ${t.r.length} miejsc, wzorce ${t.wz}; CLI z --typ kontener: brak wyniku (karta u usługi)`);
