// P81 A: makieta R3 nie ma ręcznych opisów „zwykle tu…” — każde miejsce dostaje ten sam tekst co MVP
// (PrzeswitLista.podpowiedz z mvp/widok-auta/widok.js), a miejsca bez strefy — napis P42.
// node testy/test_makieta_podpowiedz.mjs
import fs from "fs";
import vm from "vm";
const czytaj = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const kt = vm.createContext({});
vm.runInContext(czytaj("../mvp/widok-auta/widok.js"), kt);
vm.runInContext(czytaj("../makieta/r3/dane.js") + "\n;globalThis.__T = { AUTA, MIEJSCA_PO_ZMIANIE, podpowiedzMiejsca, BEZ_OPISU, W, H };", kt);
const T = kt.__T, L = kt.PrzeswitLista;
let ok = 0, zle = 0;
const sprawdz = (war, opis) => { if (war) ok++; else { zle++; console.log("BŁĄD:", opis); } };
const dozwolone = new Set([...L.STREFY.map((s) => s.opis), L.POZA_KONSTRUKCJA]);
const dane = czytaj("../makieta/r3/dane.js"), app = czytaj("../makieta/r3/aplikacja.js"), html = czytaj("../makieta/r3/index.html");
sprawdz(!/zwykle tu/.test(dane) && !/zwykle tu/.test(app), "w dane.js i aplikacja.js nie ma ręcznie wpisanego „zwykle tu”");
sprawdz(/<script src="\.\.\/\.\.\/mvp\/widok-auta\/widok\.js"><\/script>[\s\S]*<script src="dane\.js">/.test(html), "makieta wczytuje widok.js z MVP przed dane.js");
sprawdz(T.BEZ_OPISU === L.POZA_KONSTRUKCJA, "napis P42 ten sam co w MVP");
let n = 0, znane = 0;
const auta = [...T.AUTA, ...["firanka", "chlodnia", "kontener"].map((r) => ({ plik: "po zmianie → " + r, rodzaj: r, miejsca: T.MIEJSCA_PO_ZMIANIE }))];
for (const a of auta) for (const x of a.miejsca) {
  n++;
  const p = T.podpowiedzMiejsca(x, a), q = L.podpowiedz(x, a.rodzaj, T.W, T.H);
  if (p.znany) znane++;
  sprawdz(p.tekst === q.tekst && dozwolone.has(p.tekst), `${a.plik} (${x.x0},${x.y0}): „${p.tekst}” = MVP`);
}
console.log(`makieta R3: ${n} miejsc, z opisem z listy MVP ${znane}, napis P42 ${n - znane}`);
console.log(`${ok + zle} sprawdzeń — ${zle ? `BŁĘDY: ${zle}` : "OK"}`);
process.exit(zle ? 1 : 0);
