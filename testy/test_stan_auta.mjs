// Test stanu auta bez miejsc (P80 A + decyzja Szefa 15:29) na makieta/r3/dane.js:
// nieotwarte → „program nic nie wskazał — nieotwarte”; otwarte, niezamknięte → „… — otwarte, niezamknięte”;
// po „Zamknij auto” → „obejrzane, bez wskazań”. Do zamknięcia nigdzie nie ma „obejrzane”.
// node testy/test_stan_auta.mjs
import fs from "fs";
import vm from "vm";
const kod = fs.readFileSync(new URL("../makieta/r3/dane.js", import.meta.url), "utf8");
const kt = vm.createContext({});
vm.runInContext(fs.readFileSync(new URL("../mvp/widok-auta/widok.js", import.meta.url), "utf8"), kt);   // P81 A: dane.js bierze teksty z MVP
vm.runInContext(kod + "\n;globalThis.__T = { stanBezMiejsc, OBEJRZANE, NIEOTWARTE, OTWARTE_NIEZAMKNIETE };", kt);
const T = kt.__T;
let ok = 0, zle = 0;
const sprawdz = (war, opis) => { if (war) ok++; else { zle++; console.log("BŁĄD:", opis); } };
const auto = { otwarte: false, zamkniete: false };
sprawdz(T.stanBezMiejsc(auto) === "program nic nie wskazał — nieotwarte", "przed otwarciem: nieotwarte");
auto.otwarte = true;
sprawdz(T.stanBezMiejsc(auto) === "program nic nie wskazał — otwarte, niezamknięte", "otwarte, niezamknięte");
auto.zamkniete = true;
sprawdz(T.stanBezMiejsc(auto) === "obejrzane, bez wskazań", "po Zamknij auto: obejrzane");
for (const s of [T.NIEOTWARTE, T.OTWARTE_NIEZAMKNIETE]) sprawdz(!s.includes("obejrzane"), `„${s}” nie mówi „obejrzane”`);
// aplikacja: otwarcie auta ustawia „otwarte”, raport bierze stan z tej samej funkcji
const app = fs.readFileSync(new URL("../makieta/r3/aplikacja.js", import.meta.url), "utf8");
sprawdz(/function otworzAuto\(i\) \{\s*S\.ia = i; const a = A\(\); a\.otwarte = true;/.test(app), "otworzAuto ustawia otwarte");
sprawdz((app.match(/stanBezMiejsc\(/g) || []).length === 2, "lista i raport biorą stan ze stanBezMiejsc");
sprawdz(!/OBEJRZANE\s*:/.test(app) && !/\? OBEJRZANE/.test(app), "aplikacja nie wstawia „obejrzane” z pominięciem stanu");
console.log(`stan auta bez miejsc: ${ok + zle} sprawdzeń — ${zle ? `BŁĘDY: ${zle}` : "OK"}`);
process.exit(zle ? 1 : 0);
