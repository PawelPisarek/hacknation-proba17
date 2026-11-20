"""Prześwit v2 (zadanie 19): mniej fałszywych alarmów na czystych obrazach.

Różnice wobec wyniku bazowego (wykryj.py):
- różnica liczona z WSZYSTKICH wzorców rodzaju (najmniejsza), z tolerancją przesunięć wzdłuż pojazdu (słupki, poprzeczki);
- trend: odjęcie gładkiego trendu kolumnowego (gradient oświetlenia skanu);
- próg w jednostkach tłumienia: |różnica| > tau + rho·tłumienie_wzorca (różnice gęstości materiału egzemplarzy są względne);
- konstr: odsiew cienkich, pełnej wysokości pasów (dodany/brakujący słupek) i cienkich krótkich pasów w podwoziu (poprzeczki);
- lad: duży zwarty obszar = ładunek (nie alarm); wewnątrz niego szukanie lokalnej różnicy względem mediany ładunku (próg lad).
Siatka: maska liczona raz na (trend, tolx, tau, rho); filtry (konstr, lad, min_pole) — tanio, na liście obszarów.
"""
import itertools, os, time
import numpy as np
import torch
import torch.nn.functional as F

from .bmp import wczytaj_szarosc
from .wykryj import (DEV, SZER_DOBOR, tlumienie, zmniejsz, dopasuj, warp_skala, etykiety, dopasuj_rozmiar)


def dobierz(mal, bib):
    dop = []
    for (wid, typ, _), wm in zip(bib.wpisy, bib.mal):
        sc, s, dx, dy = dopasuj(mal, dopasuj_rozmiar(wm, mal))
        dop.append(dict(id=wid, typ=typ, wynik=sc, s=s, dx=dx, dy=dy))
    dop.sort(key=lambda d: -d["wynik"])
    typy = sorted({d["typ"] for d in dop})
    sr = {t: float(np.mean([d["wynik"] for d in dop if d["typ"] == t])) for t in typy}
    return dop, max(sr, key=sr.get)


def skladowe(mask, r):
    """Spójne obszary maski: lista (x0,y0,x1,y1,n_px,max|r|) w px tej rozdzielczości."""
    lab = etykiety(mask)
    ys, xs = torch.nonzero(lab > 0, as_tuple=True)
    if ys.numel() == 0:
        return []
    u, inv, cnt = torch.unique(lab[ys, xs], return_inverse=True, return_counts=True)
    n = len(u)
    big = torch.full((n,), 1 << 30, device=lab.device)
    zero = torch.zeros(n, dtype=torch.long, device=lab.device)
    x0 = big.clone().scatter_reduce(0, inv, xs, "amin"); y0 = big.clone().scatter_reduce(0, inv, ys, "amin")
    x1 = zero.clone().scatter_reduce(0, inv, xs, "amax"); y1 = zero.clone().scatter_reduce(0, inv, ys, "amax")
    zz = torch.zeros(n, device=lab.device).scatter_reduce(0, inv, r[ys, xs].abs(), "amax")
    t = torch.stack([x0, y0, x1 + 1, y1 + 1, cnt]).T.tolist()
    return [(a, b, c, d, e, z) for (a, b, c, d, e), z in zip(t, zz.tolist())]


def wykryj_v2(sciezka, bib, konfiguracje, typ_prawda=None, typ_wymuszony=None):
    t0 = time.perf_counter()
    g = wczytaj_szarosc(sciezka)
    H, W = g.shape
    a = tlumienie(g)
    rob = zmniejsz(a, bib.szer_rob)
    mal = zmniejsz(a, SZER_DOBOR)
    del a
    dop, typ = dobierz(mal, bib)
    if typ_wymuszony:
        typ = typ_wymuszony
    t_dobor = time.perf_counter() - t0
    h, w = rob.shape[-2:]
    f = w / SZER_DOBOR
    kand = [d for d in dop if d["typ"] == typ]
    # wyrównane i dopasowane jasnością wzorce rodzaju
    WW = []
    for d in kand:
        i = [x[0] for x in bib.wpisy].index(d["id"])
        wr = dopasuj_rozmiar(bib.rob[i], rob)
        sk = torch.tensor([d["s"]])
        ww = warp_skala(wr, sk, d["dx"] * f, d["dy"] * f)
        _, _, ddx, ddy = dopasuj(rob, ww, skale=torch.tensor([1.0]), max_dx=3 * f / w + 2 / w, max_dy=3 * f / h + 2 / h)
        ww = warp_skala(wr, sk, d["dx"] * f + ddx, d["dy"] * f + ddy)
        x, y = ww.flatten(), rob.flatten()
        xm, ym = x.mean(), y.mean()
        alfa = ((x - xm) * (y - ym)).sum() / ((x - xm) ** 2).sum().clamp(min=1e-6)
        WW.append(alfa * ww + (ym - alfa * xm))
    WW = torch.cat(WW)                                   # (K,1,h,w)
    reszta, obszary, wnetrza = {}, {}, {}
    wyniki = {}
    sx, sy = W / w, H / h
    for konf in konfiguracje:
        tx = max(1, round(konf["tolx"] * 0.001 * w))
        kr = (konf["trend"], tx)
        if kr not in reszta:
            hi = F.max_pool2d(WW, (3, 2 * tx + 1), 1, (1, tx))
            lo = -F.max_pool2d(-WW, (3, 2 * tx + 1), 1, (1, tx))
            R = ((rob - hi).clamp(min=0) - (lo - rob).clamp(min=0))[:, 0]
            r = R.gather(0, R.abs().argmin(0, keepdim=True))[0]
            r = F.avg_pool2d(r[None, None], 3, 1, 1)[0, 0]
            if konf["trend"]:
                kol = r.median(dim=0).values[None, None]
                kk = max(3, int(0.02 * w) | 1)
                kol = F.avg_pool1d(F.pad(kol, (kk // 2, kk // 2), mode="replicate"), kk, 1)[0, 0]
                r = r - kol[None, :]
            reszta[kr] = (r, hi.max(0).values[0])     # reszta i lokalne maksimum wzorca (do progu względnego)
        r, wmax = reszta[kr]
        km = kr + (konf["tau"], konf["rho"])
        if km not in obszary:
            m = r.abs() > konf["tau"] + konf["rho"] * wmax
            m = F.max_pool2d(m[None, None].float(), 3, 1, 1)[0, 0] > 0
            obszary[km] = skladowe(m, r)
        min_px = max(4, int(konf["min_pole"] * h * w))
        out = []
        for (x0, y0, x1, y1, n, z) in obszary[km]:
            bw, bh = x1 - x0, y1 - y0
            if konf["konstr"]:
                if bw <= 0.009 * w and bh >= 0.45 * h:            # dodany/brakujący słupek (pełna wysokość pudła)
                    continue
                if bw <= 0.007 * w and bh <= 0.10 * h and y0 >= 0.79 * h and y1 <= 0.94 * h:   # poprzeczka
                    continue
            if konf["lad"] and bw >= 0.07 * w and bh >= 0.15 * h:  # ładunek: nie alarm, szukamy w środku
                kl = km + (konf["lad"], x0, y0)
                if kl not in wnetrza:
                    k = max(3, int(0.006 * w) | 1)
                    rs = F.avg_pool2d(r[None, None], k, 1, k // 2, count_include_pad=False)[0, 0]
                    cut = rs[y0:y1, x0:x1]
                    d = cut - cut.median()
                    sub = skladowe(d > konf["lad"], d)
                    wnetrza[kl] = [(a + x0, b + y0, c + x0, e + y0, nn, zz) for (a, b, c, e, nn, zz) in sub
                                   if (c - a) * (e - b) <= 0.3 * bw * bh]
                out += [s for s in wnetrza[kl] if s[4] >= min_px]
                continue
            if n >= min_px:
                out.append((x0, y0, x1, y1, n, z))
        miejsca = [dict(x0=round(x0 * sx), y0=round(y0 * sy), x1=round(x1 * sx), y1=round(y1 * sy), wynik=round(z, 3))
                   for (x0, y0, x1, y1, n, z) in out]
        miejsca.sort(key=lambda m: -m["wynik"])
        wyniki[konf["nazwa"]] = dict(typ_wybrany=typ, wzorce=[d["id"] for d in kand], miejsca=miejsca[:50])
    if DEV.type == "cuda":
        torch.cuda.synchronize()
    return dict(plik=os.path.basename(sciezka), szer=W, wys=H, typ_prawda=typ_prawda, dobor=dop[:5],
                czas_s=round(time.perf_counter() - t0, 3), czas_dobor_s=round(t_dobor, 3), konfiguracje=wyniki)
