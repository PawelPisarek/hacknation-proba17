"""Rozbiór błędów jednej konfiguracji: ramki na czystych (kształt, położenie, czy na legalnym ładunku) i przeoczenia."""
import argparse, collections, json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ocena import wspolne, pole, POKRYCIE  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--manifest", required=True); ap.add_argument("--konf", required=True)
ap.add_argument("--wyniki", nargs="+", required=True)
a = ap.parse_args()
man = {e["plik"]: e for e in json.load(open(a.manifest))["badane"]}
kat = collections.Counter(); prz = []
for p in a.wyniki:
    for r in json.load(open(p))["wyniki"]:
        e = man.get(r["plik"]); W, H = r["szer"], r["wys"]
        mm = r["konfiguracje"][a.konf]["miejsca"]
        if e["klasa"] == "czyste":
            for m in mm:
                bw, bh = (m["x1"] - m["x0"]) / W, (m["y1"] - m["y0"]) / H
                yc = (m["y0"] + m["y1"]) / 2 / H
                na_lad = any(wspolne(m, l) > 0 for l in e.get("ladunek_legalny", []))
                strefa = "kabina" if m["x1"] / W < 0.10 else ("podwozie" if yc > 0.80 else ("dach" if yc < 0.15 else "pudlo"))
                ksz = "cienki-wysoki" if bw < 0.01 and bh > 0.3 else ("maly" if bw * bh < 0.0005 else ("duzy" if bw * bh > 0.01 else "sredni"))
                kat[(e.get("trudnosc") or "czyste", strefa, ksz, "lad" if na_lad else "")] += 1
        else:
            for d in e["dodatki"]:
                if not any(wspolne(m, d) >= POKRYCIE * pole(d) for m in mm if pole(m) <= 0.25 * W * H):
                    best = max([wspolne(m, d) / pole(d) for m in mm] or [0])
                    prz.append(f"{r['plik']} {d['typ']} {(d['x1']-d['x0'])/W:.3f}x{(d['y1']-d['y0'])/H:.3f}W/H y={d['y0']/H:.2f} pokrycie={best:.2f}")
print("RAMKI NA CZYSTYCH (rodzaj, strefa, kształt, na ładunku): liczba")
for k, v in kat.most_common(25):
    print(" ", k, v)
print("PRZEOCZENIA:"); print("\n".join("  " + x for x in prz))
