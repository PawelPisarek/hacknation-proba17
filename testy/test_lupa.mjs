// Test A1 (zadanie 24, lupa): po kliknięciu kafelka oba widoki pokazują to samo miejsce
// (współrzędne zgodne ± przesunięcie Z12: maks. 14 px w polach prawdziwych dodatków).
// Na wynikach v2 z dane/mini i dane/mini-trudny (wyniki/z23_33) + przypadki ręczne.
// node testy/test_lupa.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const L = require("../mvp/widok-auta/widok.js");
const Z12_MAKS = 14;
let ok = 0, zle = 0;
const sprawdz = (war, opis) => { if (war) ok++; else { zle++; console.log("BŁĄD:", opis); } };

// ręczne: tożsamość i znane przesunięcie
{
  const t = { s: 1, dx: 0, dy: 0 };
  const lp = L.lupa({ x0: 500, y0: 100, x1: 520, y1: 140 }, 4, 1024, 256, t);
  sprawdz(lp.badany.x0 === lp.wzorzec.x0 && lp.badany.y0 === lp.wzorzec.y0 && lp.wzorzec.zx === 4, "tożsamość: te same okna");
  const ls = L.lupa({ x0: 900, y0: 100, x1: 920, y1: 140 }, 4, 1024, 256, { s: 1.1, dx: 4, dy: -2 });
  sprawdz(Math.abs(ls.wzorzec.zx - 4.4) < 1e-9 && ls.badany.x1 === 1024, "skala s: wzorzec z·s w poziomie, okno badanego przy brzegu");
  sprawdz(Math.abs((lp.badany.x0 + lp.badany.x1) / 2 - 510) < 1e-9, "okno badanego wyśrodkowane na ramce");
  const t2 = { s: 1.04, dx: -2, dy: 2 };
  const p = L.naWzorzec(t2, 600, 100), q = L.naBadany(t2, p.x, p.y);
  sprawdz(Math.abs(q.x - 600) < 1e-9 && Math.abs(q.y - 100) < 1e-9, "naBadany∘naWzorzec = id");
  const w = L.polozenieWzorca({ szer: 1024, dobor: [{ id: "a", s: 1.04, dx: -1, dy: 2 }] }, "a");
  sprawdz(w.dx === -2 && w.dy === 4 && w.znane, "dobor 512 px → piksele obrazu (×2)");
  sprawdz(!L.polozenieWzorca({ szer: 1024, dobor: [] }, "x").znane, "brak w doborze → tożsamość");
  const brzeg = L.lupa({ x0: 0, y0: 0, x1: 8, y1: 8 }, 4, 1024, 256, t);
  sprawdz(brzeg.badany.x0 === 0 && brzeg.badany.y0 === 0, "okno przycięte do obrazu przy brzegu");
}

// na wynikach programu: każde miejsce, każde przybliżenie
const fs = require("fs");
let miejsc = 0, maksRoznica = 0;
for (const zestaw of ["mini", "mini-trudny"]) {
  const d = JSON.parse(fs.readFileSync(new URL(`../wyniki/z23_33/${zestaw}/wyniki.json`, import.meta.url)));
  for (const r of d.wyniki) {
    const l = L.listaMiejsc(r);
    if (r.brak_wzorca) { sprawdz(l.miejsca.length === 0, `${r.plik}: brak wzorca → bez lupy`); continue; }
    const t = L.polozenieWzorca(r, l.wzorzec);
    sprawdz(t.znane, `${r.plik}: wzorzec ${l.wzorzec} jest w doborze`);
    for (const m of l.miejsca) for (const z of [2, 4]) {
      miejsc++;
      const lp = L.lupa(m, z, r.szer, r.wys, t);
      const B = lp.badany, W = lp.wzorzec, pb = lp.punktB, pw = lp.punktW;
      sprawdz(pb.x >= B.x0 && pb.x <= B.x1 && pb.y >= B.y0 && pb.y <= B.y1, `${r.plik} #${m.nr} ${z}×: ramka w oknie badanego`);
      sprawdz(pw.x >= W.x0 && pw.x <= W.x1 && pw.y >= W.y0 && pw.y <= W.y1, `${r.plik} #${m.nr} ${z}×: miejsce w oknie wzorca`);
      // to samo miejsce w tym samym punkcie obu widoków (w pikselach obrazu, różnica ≤ Z12)
      // położenie na ekranie (ułamek szerokości/wysokości okna) — to samo w obu widokach
      const dx = Math.abs((pb.x - B.x0) / (B.x1 - B.x0) - (pw.x - W.x0) / (W.x1 - W.x0)) * (B.x1 - B.x0);
      const dy = Math.abs((pb.y - B.y0) / (B.y1 - B.y0) - (pw.y - W.y0) / (W.y1 - W.y0)) * (B.y1 - B.y0);
      maksRoznica = Math.max(maksRoznica, dx, dy);
      sprawdz(dx <= Z12_MAKS && dy <= Z12_MAKS, `${r.plik} #${m.nr} ${z}×: położenie w oknach różni się o ${dx.toFixed(1)}/${dy.toFixed(1)} px`);
    }
  }
}
console.log(`A1 lupa: ${miejsc} widoków (miejsce × przybliżenie 2×/4×), maks. różnica położenia w oknach ${maksRoznica.toFixed(1)} px (próg Z12 ${Z12_MAKS})`);
console.log(`${ok + zle} sprawdzeń — ${zle ? `BŁĘDY: ${zle}` : "OK"}`);
process.exit(zle ? 1 : 0);
