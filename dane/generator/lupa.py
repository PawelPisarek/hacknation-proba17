"""Z11: czas wyciecia i przyblizenia miejsca dodatku na obrazie 'pelny' (memmap, bez calego obrazu) + PNG do docs/zrzuty."""
import json, os, sys, time
sys.path.insert(0, "src")
import numpy as np
from PIL import Image
from przeswit.bmp import wczytaj_szarosc
D = sys.argv[1]; out = sys.argv[2]
man = json.load(open(os.path.join(D, "manifest.json")))
os.makedirs(out, exist_ok=True)
c = [e for e in man["badane"] if e["poziom"] == "pelny" and e["klasa"] == "dodatki"]
t = []
for e in c[:4]:
    d = e["dodatki"][0]
    t0 = time.perf_counter()
    g = wczytaj_szarosc(os.path.join(D, e["plik"]))
    cx, cy = (d["x0"] + d["x1"]) // 2, (d["y0"] + d["y1"]) // 2
    x0, y0 = max(0, cx - 256), max(0, cy - 192)
    w = np.ascontiguousarray(g[y0:y0 + 384, x0:x0 + 512])
    im = Image.fromarray(w).resize((1024, 768), Image.LANCZOS)
    p = os.path.join(out, "lupa_" + e["plik"].replace(".bmp", ".png")); im.save(p)
    t.append(time.perf_counter() - t0)
    print(f"Z11 {e['plik']} dodatek {d['typ']} {d['x1']-d['x0']}x{d['y1']-d['y0']} px: czas {t[-1]:.2f} s ({p})")
print(f"Z11 czas sr {sum(t)/len(t):.2f} s, maks {max(t):.2f} s (wczytanie calego pliku {e['plik']} + wyciecie + 2x przyblizenie)")
