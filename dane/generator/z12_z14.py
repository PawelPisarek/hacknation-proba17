"""Sondy Z12 (przesuniecie wzorca wzgledem badanego w miejscu ramki) i Z14 (ile ramek na czystych lezy na elemencie konstrukcji).
Metoda Programisty bez zmian (importuje wykryj.py). Uzycie: z12_z14.py DANE WYNIKI_JSON(mini) """
import json, os, sys, statistics as st
sys.path.insert(0, "src")
import numpy as np, torch
from przeswit import wykryj as Wk
from przeswit.bmp import wczytaj_szarosc
D, WJ = sys.argv[1:3]
man = json.load(open(os.path.join(D, "manifest.json")))
wyn = json.load(open(WJ))
prawda = {e["plik"]: e for e in man["badane"]}
wz = [(e["id"], e["typ_pojazdu"], os.path.join(D, e["plik"])) for e in man["wzorce"] if e["poziom"] == "mini"]
bib = Wk.Biblioteka(wz, 1024)
ids = [x[0] for x in bib.wpisy]
MARG, SR = 24, 10

def lokalne_przesuniecie(rob, ww, b):
    """najlepsze calkowite przesuniecie (px) ww wzgledem rob na pierscieniu wokol ramki b (bez wnetrza ramki)."""
    h, w = rob.shape[-2:]
    x0, y0, x1, y1 = [int(v) for v in b]
    X0, Y0, X1, Y1 = max(x0 - MARG, SR), max(y0 - MARG, SR), min(x1 + MARG, w - SR), min(y1 + MARG, h - SR)
    if X1 - X0 < 8 or Y1 - Y0 < 8: return None
    m = torch.ones(Y1 - Y0, X1 - X0, device=rob.device)
    m[max(y0 - Y0, 0):max(y1 - Y0, 0), max(x0 - X0, 0):max(x1 - X0, 0)] = 0
    if m.sum() < 50: return None
    R = rob[0, 0, Y0:Y1, X0:X1]
    best = (1e9, 0, 0)
    for dy in range(-SR, SR + 1):
        for dx in range(-SR, SR + 1):
            Wp = ww[0, 0, Y0 - dy:Y1 - dy, X0 - dx:X1 - dx]
            d = (R - Wp)
            d = (d - (d * m).sum() / m.sum()).abs()
            e = float((d * m).sum() / m.sum())
            if e < best[0]: best = (e, dx, dy)
    return best[1], best[2]

def strefy(typ, W, H, kol_slupki):
    """elementy konstrukcji (zgodnie z generuj.rend): prostokaty w px obrazu + kolumny slupkow."""
    Z = {"podwozie": (0, .78, 1, .99), "rama_gora": (0, .10, 1, .135), "kabina": (0, .20, .10, .95)}
    if typ == "chlodnia": Z["agregat"] = (.07, .14, .16, .50)
    if typ == "cysterna": Z["wlaz"] = (.39, .06, .46, .11)
    if typ == "kontener": Z["narozniki"] = (.06, .10, .09, .87); Z["narozniki2"] = (.93, .10, .98, .87)
    return {k: (v[0] * W, v[1] * H, v[2] * W, v[3] * H) for k, v in Z.items()}

def pokrycie(b, z):
    ix = max(0, min(b[2], z[2]) - max(b[0], z[0])); iy = max(0, min(b[3], z[3]) - max(b[1], z[1]))
    pb = max(1, (b[2] - b[0]) * (b[3] - b[1]))
    return ix * iy / pb

res12, res12d, wiel, wiel_d = [], [], [], []
n14 = o14 = 0; rozbicie = {}
for r in wyn["wyniki"]:
    e = prawda.get(r["plik"])
    if e is None: continue
    k = r["konfiguracje"][list(r["konfiguracje"])[0]]
    g = wczytaj_szarosc(os.path.join(D, r["plik"])); H, W = g.shape
    rob = Wk.zmniejsz(Wk.tlumienie(g), 1024); h, w = rob.shape[-2:]; f = w / 512
    d = r["dobor"][0]
    wr = Wk.dopasuj_rozmiar(bib.rob[ids.index(d["id"])], rob)
    ww = Wk.warp_skala(wr, torch.tensor([d["s"]]), d["dx"] * f, d["dy"] * f)
    sx, sy = w / W, h / H
    miejsca = k["miejsca"][:6]
    if e["klasa"] == "dodatki":
        for b in miejsca:
            bb = (b["x0"] * sx, b["y0"] * sy, b["x1"] * sx, b["y1"] * sy)
            s = lokalne_przesuniecie(rob, ww, bb)
            if s: res12.append((float(np.hypot(*s)), min(bb[2] - bb[0], bb[3] - bb[1])))
        for dd in e["dodatki"]:
            bb = (dd["x0"] * sx, dd["y0"] * sy, dd["x1"] * sx, dd["y1"] * sy)
            s = lokalne_przesuniecie(rob, ww, bb)
            if s: res12d.append((float(np.hypot(*s)), min(bb[2] - bb[0], bb[3] - bb[1])))
    else:
        # slupki: kolumny wzorca o podwyzszonym tlumieniu w srodkowym pasie
        col = ww[0, 0, int(.25 * h):int(.70 * h)].mean(0)
        med = col.median(); sl = (col > med + 0.04).cpu().numpy()
        Z = strefy(e["typ_pojazdu"], w, h, None)
        for b in miejsca:
            bb = (b["x0"] * sx, b["y0"] * sy, b["x1"] * sx, b["y1"] * sy)
            n14 += 1
            hit = [kz for kz, z in Z.items() if pokrycie(bb, z) >= 0.5]
            if not hit and sl[max(int(bb[0]), 0):int(bb[2]) + 1].any() and bb[3] - bb[1] > 0.3 * h * 0.0 + 1:
                if sl[max(int(bb[0]), 0):int(bb[2]) + 1].mean() > 0.3: hit = ["slupek/pierscien"]
            if hit: o14 += 1; rozbicie[hit[0]] = rozbicie.get(hit[0], 0) + 1
def op(rs, nm):
    if not rs: print(nm, "brak"); return
    s = [a for a, _ in rs]; ok = sum(a < m for a, m in rs)
    print(f"{nm}: n={len(rs)}, przesuniecie px: mediana {st.median(s):.1f}, srednia {st.mean(s):.1f}, maks {max(s):.0f}; mniejsze niz mniejszy bok ramki: {ok}/{len(rs)}; ramki: mediana mniejszego boku {st.median(m for _, m in rs):.0f} px")
op(res12, "Z12 ramki (top 6) na obrazach z dodatkami")
op(res12d, "Z12 prawdziwe dodatki (pole dodatku)")
print(f"Z14: ramki (top 6) na 8 czystych mini: {n14}, na elemencie konstrukcji z listy: {o14} ({100*o14/max(n14,1):.0f}%); rozbicie {rozbicie}")
