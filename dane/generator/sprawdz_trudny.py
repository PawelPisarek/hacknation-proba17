#!/usr/bin/env python3
"""Zadanie 04 — sprawdzenie zbioru trudnego (numpy). Dwie hipotezy w jednym przebiegu:
H1: każdy dodatek z manifestu jest widoczny: kontrast obszaru dodatku względem otoczenia (pierścień) wyrażony w
    jednostkach szumu pojedynczego piksela tła — (a) lokalnie w obrazie badanym, (b) w różnicy badany − wzorzec
    (najlepszy wzorzec tego typu z biblioteki, wyrównany przesunięciem całkowitym + dopasowanie jasności).
    Niewidoczny: kontrast < 2 × szum.
H2: czyste (egzemplarz, ladunek_legalny) po wyrównaniu prostym przesunięciem — rozkład maksimum mapy |różnica| uśrednionej
    oknem k×k (k ≈ najmniejszy dodatek) w jednostkach szumu; próg = maks. po czystych (ladunek_legalny bez obszaru ładunku).
    Dodatek „nieodróżnialny” = jego maks. okna ≤ próg.
Użycie: sprawdz_trudny.py --dane <katalog z manifest.json> [--csv wynik.csv]"""
import argparse, json, os, sys, time, collections
import numpy as np


def czytaj_bmp(p):
    with open(p, "rb") as f:
        h = f.read(54)
    off, w, hh = int.from_bytes(h[10:14], "little"), int.from_bytes(h[18:22], "little"), int.from_bytes(h[22:26], "little")
    row = (w * 3 + 3) // 4 * 4
    m = np.memmap(p, np.uint8, "r", offset=off, shape=(hh, row))
    return np.ascontiguousarray(m[::-1, :w * 3:3]).astype(np.float32)


def sigma_szumu(B):
    H, W = B.shape
    s = B[int(0.02 * H):int(0.07 * H), int(0.2 * W):int(0.8 * W)]
    s = s - np.median(s, axis=0, keepdims=True)
    return float(1.4826 * np.median(np.abs(s - np.median(s)))) + 1e-6


def blok(a, ds):
    h, w = a.shape[0] // ds * ds, a.shape[1] // ds * ds
    return a[:h, :w].reshape(h // ds, ds, w // ds, ds).mean((1, 3))


def nak(B, R, dx, dy, s=1):
    H, W = B.shape
    x0, x1, y0, y1 = max(0, dx), min(W, W + dx), max(0, dy), min(H, H + dy)
    return (B[y0:y1, x0:x1][::s, ::s], R[y0 - dy:y1 - dy, x0 - dx:x1 - dx][::s, ::s], (x0, y0, x1, y1))


def rho(a, b):
    a = a - a.mean(); b = b - b.mean()
    return float((a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-9))


def wyrownaj(B, R, sk):
    """Najlepsze przesunięcie całkowite (dx,dy): B(x,y) ≈ R(x-dx,y-dy). Gruba siatka na blokach, potem dokładnie."""
    H, W = B.shape
    ds = max(1, W // 512)
    Bc, Rc = blok(B, ds), blok(R, ds)
    rx, ry = int(40 * sk / ds) + 1, int(20 * sk / ds) + 1
    best = (-9, 0, 0)
    for dy in range(-ry, ry + 1):
        for dx in range(-rx, rx + 1):
            a, b, _ = nak(Bc, Rc, dx, dy)
            if a.size < 100:
                continue
            r = rho(a, b)
            if r > best[0]:
                best = (r, dx, dy)
    _, cx, cy = best
    s = max(1, ds // 4)
    best = (-9, 0, 0)
    for dy in range(cy * ds - ds, cy * ds + ds + 1):
        for dx in range(cx * ds - ds, cx * ds + ds + 1):
            a, b, _ = nak(B, R, dx, dy, s)
            if a.size < 100:
                continue
            r = rho(a, b)
            if r > best[0]:
                best = (r, dx, dy)
    return best


def srednia_okna(D, k):
    ii = np.zeros((D.shape[0] + 1, D.shape[1] + 1), np.float64)
    ii[1:, 1:] = D.cumsum(0, dtype=np.float64).cumsum(1)
    return (ii[k:, k:] - ii[:-k, k:] - ii[k:, :-k] + ii[:-k, :-k]) / (k * k)


def kontrast(M, box, ok, inne, cargo):
    """|średnia w pudełku − średnia w pierścieniu| (M w układzie obrazu badanego, ok=(x0,y0,x1,y1) obszar ważny)."""
    x0, y0, x1, y1 = box
    m = max(4, x1 - x0, y1 - y0)
    X0, Y0, X1, Y1 = max(x0 - m, ok[0]), max(y0 - m, ok[1]), min(x1 + m, ok[2]), min(y1 + m, ok[3])
    ix0, iy0, ix1, iy1 = max(x0, ok[0]), max(y0, ok[1]), min(x1, ok[2]), min(y1, ok[3])
    if ix0 >= ix1 or iy0 >= iy1:
        return None
    sub = M[Y0 - ok[1]:Y1 - ok[1], X0 - ok[0]:X1 - ok[0]]
    msk = np.ones(sub.shape, bool)
    for (a, b, c, d) in [box] + inne:
        msk[max(b - Y0, 0):max(d - Y0, 0), max(a - X0, 0):max(c - X0, 0)] = False
    if cargo:
        c = np.zeros(sub.shape, bool)
        a, b, cc, d = cargo
        c[max(b - Y0, 0):max(d - Y0, 0), max(a - X0, 0):max(cc - X0, 0)] = True
        msk &= c
    if msk.sum() < 10:
        return None
    wew = M[iy0 - ok[1]:iy1 - ok[1], ix0 - ok[0]:ix1 - ok[0]]
    return float(abs(wew.mean() - sub[msk].mean()))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dane", required=True)
    ap.add_argument("--csv")
    a = ap.parse_args()
    t0 = time.time()
    man = json.load(open(os.path.join(a.dane, "manifest.json")))
    lib = collections.defaultdict(list)
    for w in man["wzorce"]:
        lib[(w["typ_pojazdu"], w["poziom"])].append(w)
    wiersze, czyste = [], []
    for p in man["badane"]:
        B = czytaj_bmp(os.path.join(a.dane, p["plik"]))
        H, W = B.shape
        sk = H / 512.0
        sig = sigma_szumu(B)
        best = None
        for w in lib[(p["typ_pojazdu"], p["poziom"])]:
            R = czytaj_bmp(os.path.join(a.dane, w["plik"]))
            r, dx, dy = wyrownaj(B, R, sk)
            if best is None or r > best[0]:
                best = (r, dx, dy, w["id"], R)
        r, dx, dy, wid, R = best
        Bo, Ro, ok = nak(B, R, dx, dy)
        am, bm = np.polyfit(Ro[::4, ::4].ravel(), Bo[::4, ::4].ravel(), 1)
        D = Bo - (am * Ro + bm)
        k = max(5, int(round(0.008 * W)))
        S = np.abs(srednia_okna(D, k))
        mg = 2 * k
        lad = [(b["x0"], b["y0"], b["x1"], b["y1"]) for b in p["ladunek_legalny"]]
        dods = [(b["x0"], b["y0"], b["x1"], b["y1"]) for b in p["dodatki"]]
        if p["klasa"] == "czyste":
            Sm = S[mg:-mg, mg:-mg].copy() if min(S.shape) > 4 * mg else S.copy()
            ys, xs = ok[1] + mg, ok[0] + mg
            m_all = float(Sm.max() / sig)
            for (x0, y0, x1, y1) in lad:  # maska ładunku (okno przecinające ładunek też wykluczone)
                Sm[max(y0 - k - ys, 0):max(y1 + k - ys, 0), max(x0 - k - xs, 0):max(x1 + k - xs, 0)] = 0
            czyste.append(dict(id=p["id"], trudnosc=p["trudnosc"], m_all=m_all, m_poza=float(Sm.max() / sig),
                               rho=r, sigma=sig, ref=wid, dx=dx, dy=dy))
        for i, bx in enumerate(dods):
            inne = [x for j, x in enumerate(dods) if j != i]
            carg = next((c for c in lad if c[0] <= bx[0] and c[1] <= bx[1] and c[2] >= bx[2] and c[3] >= bx[3]), None)
            cl = kontrast(B, bx, (0, 0, W, H), inne, carg)
            cr = kontrast(D, bx, ok, inne, carg)
            x0, y0, x1, y1 = bx
            sc = None
            if x0 < ok[2] - ok[0] and y0 < ok[3] - ok[1]:
                sub = S[max(y0 - ok[1], 0):max(y1 - ok[1] - k + 1, 1), max(x0 - ok[0], 0):max(x1 - ok[0] - k + 1, 1)]
                if sub.size == 0:  # dodatek mniejszy niż okno — okno wokół środka
                    cy, cx = (y0 + y1) // 2 - ok[1], (x0 + x1) // 2 - ok[0]
                    sub = S[max(cy - k // 2, 0):cy + 1, max(cx - k // 2, 0):cx + 1]
                sc = float(sub.max() / sig) if sub.size else None
            wiersze.append(dict(id=p["id"], trudnosc=p["trudnosc"], poziom=p["poziom"], typ=p["typ_pojazdu"], w=x1 - x0,
                                h=y1 - y0, sigma=round(sig, 2), c_lok=None if cl is None else round(cl / sig, 2),
                                c_ref=None if cr is None else round(cr / sig, 2), okno_max=None if sc is None else round(sc, 2),
                                ref=wid, rho=round(r, 3)))
        print("ok", p["id"], f"rho={r:.3f} sigma={sig:.2f}", flush=True)
    prog = max(c["m_poza"] for c in czyste) if czyste else float("nan")
    rod = lambda f, key: collections.Counter(w["trudnosc"] for w in wiersze if f(w))
    n = rod(lambda w: True, 0)
    nl = rod(lambda w: w["c_lok"] is None or w["c_lok"] < 2, 0)
    nr = rod(lambda w: w["c_ref"] is None or w["c_ref"] < 2, 0)
    nb = rod(lambda w: (w["c_lok"] is None or w["c_lok"] < 2) and (w["c_ref"] is None or w["c_ref"] < 2), 0)
    no = rod(lambda w: w["okno_max"] is None or w["okno_max"] <= prog, 0)
    pr = {}
    for r in ("egzemplarz", "ladunek_legalny"):
        v = sorted(c["m_poza"] for c in czyste if c["trudnosc"] == r)
        va = sorted(c["m_all"] for c in czyste if c["trudnosc"] == r)
        if v:
            pr[r] = dict(max_poza_ladunkiem=round(v[-1], 1), mediana=round(v[len(v) // 2], 1), max_z_ladunkiem=round(va[-1], 1))
    print("H1 dodatki:", dict(n), "| niewidoczne lokalnie(c<2σ):", dict(nl), "| w różnicy z wzorcem:", dict(nr), "| oba:", dict(nb))
    print("H2 czyste (maks okna k×k w σ):", json.dumps(pr), "| nieodróżnialne od czystych (okno ≤ próg):", dict(no))
    print(f"WYNIK: dodatki={sum(n.values())} {dict(n)} niewidoczne_c<2σ lokalnie={dict(nl)} względem_wzorca={dict(nr)} oba={dict(nb)} "
          f"próg_czyste={prog:.1f}σ {json.dumps(pr)} nieodróżnialne_od_czystych={dict(no)} czas={time.time() - t0:.0f} s")
    if a.csv:
        import csv
        with open(a.csv, "w", newline="") as f:
            wr = csv.DictWriter(f, fieldnames=list(wiersze[0].keys()))
            wr.writeheader(); wr.writerows(wiersze)


if __name__ == "__main__":
    main()
