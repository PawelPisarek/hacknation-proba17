// Test A5 (zadanie 26): każdy kafelek ma podpowiedź „zwykle tu…” albo napis P42
// „poza znaną konstrukcją, obejrzyj uważnie”; strefy z dane/generator/z12_z14.py.
// Na wynikach programu (wyniki/z25: mini, mini-trudny, mini-pelna) + przypadki ręczne.
// node testy/test_podpowiedz.mjs
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const L = require("../mvp/widok-auta/widok.js");
let ok = 0, zle = 0;
const sprawdz = (war, opis) => { if (war) ok++; else { zle++; console.log("BŁĄD:", opis); } };

// 1. strefy zgodne z generatorem (z12_z14.py, strefy())
{
  const gen = fs.readFileSync(new URL("../dane/generator/z12_z14.py", import.meta.url), "utf8");
  const krotki = [...gen.matchAll(/"(\w+)"\] = \(([^)]*)\)|"(\w+)": \(([^)]*)\)/g)]
    .map((x) => ({ el: x[1] || x[3], z: (x[2] || x[4]).split(",").map(Number) }));
  for (const s of L.STREFY) {
    const g = krotki.find((k) => k.el === s.el);
    sprawdz(g && g.z.length === 4 && g.z.every((v, i) => Math.abs(v - s.z[i]) < 1e-9), `strefa ${s.el} [${s.z}] taka jak w z12_z14.py`);
  }
  sprawdz(krotki.length === L.STREFY.length, `wszystkie strefy generatora (${krotki.length}) są w MVP (${L.STREFY.length})`);
}

// 2. przypadki ręczne (obraz 1024×256)
{
  const W = 1024, H = 256, p = (x0, y0, x1, y1, r) => L.podpowiedz({ x0, y0, x1, y1 }, r, W, H);
  sprawdz(p(500, 210, 520, 240, "firanka").tekst.includes("podwozie"), "podwozie: ramka w pasie .78–.99 wys.");
  sprawdz(p(20, 100, 60, 150, "firanka").tekst.includes("kabina"), "kabina: lewe 10% szer.");
  sprawdz(p(90, 50, 140, 100, "chlodnia").tekst.includes("agregat"), "agregat tylko w chłodni");
  sprawdz(!p(90, 50, 140, 100, "firanka").znany, "ta sama ramka w firance → P42");
  sprawdz(p(420, 18, 450, 26, "cysterna").tekst.includes("właz"), "właz cysterny");
  sprawdz(p(960, 60, 990, 200, "kontener").tekst.includes("narożniki"), "narożniki kontenera (prawe)");
  sprawdz(p(500, 80, 540, 140, "firanka").tekst === L.POZA_KONSTRUKCJA, "środek ściany → P42");
  sprawdz(p(500, 150, 540, 230, "firanka").tekst === L.POZA_KONSTRUKCJA, "w strefie podwozia mniej niż połowa → P42");
}

// 3. wyniki programu: każde miejsce (także ukryte za „i jeszcze N”) i każdy wyrenderowany kafelek
const ile = { razem: 0, znane: 0, poza: 0 }, rozb = {};
const sztucznyKontener = () => ({ innerHTML: "", querySelectorAll: () => [], querySelector: () => null });
for (const zestaw of ["mini", "mini-trudny", "mini-pelna"]) {
  const d = JSON.parse(fs.readFileSync(new URL(`../wyniki/z25/${zestaw}/wyniki.json`, import.meta.url)));
  for (const r of d.wyniki) {
    const l = L.listaMiejsc(r);
    for (const m of l.miejsca) {
      const p = L.podpowiedz(m, l.rodzaj, r.szer || 1024, r.wys || 256);
      ile.razem++; p.znany ? ile.znane++ : ile.poza++;
      rozb[p.element || "P42"] = (rozb[p.element || "P42"] || 0) + 1;
      sprawdz(p.znany ? p.tekst.startsWith("zwykle tu: ") : p.tekst === L.POZA_KONSTRUKCJA, `${r.plik} #${m.nr}: podpowiedź albo P42`);
    }
    if (r.brak_wzorca || !l.miejsca.length) continue;
    const k = sztucznyKontener();
    L.renderWidokAuta(k, { wynik: r, obrazBadany: "b.png", obrazWzorca: "w.png", tytul: r.plik });
    const kafle = (k.innerHTML.match(/class="kaf[ "]/g) || []).length;
    const podp = (k.innerHTML.match(/class="podp( poza)?"/g) || []).length;
    sprawdz(kafle > 0 && kafle === podp, `${r.plik}: ${kafle} kafelków, ${podp} podpowiedzi (każdy kafelek ma jedną, bez klikania)`);
  }
}
console.log(`A5 podpowiedź: ${ile.razem} miejsc (wyniki/z25), z opisem „zwykle tu…” ${ile.znane} (${(100 * ile.znane / Math.max(1, ile.razem)).toFixed(0)}%), napis P42 ${ile.poza}; rozbicie ${JSON.stringify(rozb)}`);
console.log(`${ok + zle} sprawdzeń — ${zle ? `BŁĘDY: ${zle}` : "OK"}`);
process.exit(zle ? 1 : 0);
