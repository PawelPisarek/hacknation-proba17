"""Prześwit v3 (zadanie 20): osobne dopasowanie pasów — podwozie, kabina, pudło.

Na bazie najlepszej v2 (trend kolumn, odsiew konstrukcji). Nowe (osie siatki):
- lok: lokalne przesunięcie wzorca per kafel (0 = brak; n = do ±n% szerokości w poziomie, ±2 px w pionie);
  pole przesunięć z kafli, wygładzone medianą 3x3 i rozciągnięte dwuliniowo (koła, kabina, poprzeczki egzemplarza);
- jas: jasność wzorca dopasowana liniowo per kafel (gęstości elementów egzemplarza);
- wyb: 0 = najmniejsza różnica po wzorcach per piksel (jak v2), 1 = jeden wzorzec per kafel (najlepiej pasujący);
- tau_pud / tau_pod / tau_kab: progi pasów — pudło, podwozie (y > 0,79 h), kabina (x < 0,10 w);
- scal: scalanie ramek bliższych niż scal·w (mniej ramek).
"""
import os, time
import torch
import torch.nn.functional as F

from .bmp import wczytaj_szarosc
from .wykryj import DEV, SZER_DOBOR, tlumienie, zmniejsz, dopasuj, warp_skala, dopasuj_rozmiar
from .wykryj2 import dobierz, skladowe, jakosc_doboru, brak_wzorca, BRAK_WZORCA

Y_POD, X_KAB = 0.79, 0.10


def kafle(w, h):
    return max(8, round(0.03 * w)), max(8, round(h / 8))


def przesun(WW, dx, dy, S):
    """WW (K,1,h,w) przesunięte o całkowite (dx,dy) px: wynik(x) = WW(x - dx); brzeg replikowany."""
    h, w = WW.shape[-2:]
    p = F.pad(WW, (S, S, 2, 2), mode="replicate")
    return p[:, :, 2 - dy:2 - dy + h, S - dx:S - dx + w]


def mediana3(f):
    """f (K,ny,nx) -> mediana 3x3 (brzeg replikowany)."""
    K, ny, nx = f.shape
    u = F.unfold(F.pad(f[:, None], (1, 1, 1, 1), mode="replicate"), 3)   # (K,9,ny*nx)
    return u.median(dim=1).values.view(K, ny, nx)


def lokalnie(WW, rob, lok):
    """Lokalne przesunięcie każdego wzorca per kafel; zwraca wyrównane WW."""
    K, _, h, w = WW.shape
    tw, th = kafle(w, h)
    S = max(1, round(lok * 0.01 * w))
    krok = max(1, round(0.002 * w))
    best = torch.full((K, -(-h // th), -(-w // tw)), float("inf"), device=WW.device)
    bdx = torch.zeros_like(best); bdy = torch.zeros_like(best)
    for dy in range(-2, 3):
        for dx in range(-S, S + 1, krok):
            d = (rob - przesun(WW, dx, dy, S + krok)).abs()
            sc = F.avg_pool2d(d, (th, tw), (th, tw), ceil_mode=True)[:, 0]
            sc = sc * (1 + 0.02 * (abs(dx) / S + abs(dy) / 2))          # przy remisie: mniejsze przesunięcie
            lep = sc < best
            best = torch.where(lep, sc, best)
            bdx = torch.where(lep, torch.full_like(bdx, dx), bdx)
            bdy = torch.where(lep, torch.full_like(bdy, dy), bdy)
    pole = torch.stack([mediana3(bdx), mediana3(bdy)], 1)              # (K,2,ny,nx)
    pole = F.interpolate(pole, size=(h, w), mode="bilinear", align_corners=False)
    ys, xs = torch.meshgrid(torch.arange(h, device=WW.device, dtype=WW.dtype),
                            torch.arange(w, device=WW.device, dtype=WW.dtype), indexing="ij")
    gx = ((xs[None] - pole[:, 0]) + 0.5) * 2 / w - 1
    gy = ((ys[None] - pole[:, 1]) + 0.5) * 2 / h - 1
    return F.grid_sample(WW, torch.stack([gx, gy], -1), mode="bilinear", padding_mode="border", align_corners=False)


def jasnosc(WW, rob):
    """Liniowe dopasowanie jasności wzorca per kafel (okno 2 kafle), współczynnik 0,85–1,15."""
    K, _, h, w = WW.shape
    tw, th = kafle(w, h)
    k, s, p = (2 * th, 2 * tw), (th, tw), (th // 2, tw // 2)
    po = lambda t: F.avg_pool2d(t, k, s, p, ceil_mode=True, count_include_pad=False)
    y = rob.expand_as(WW)
    mx, my, mxx, mxy = po(WW), po(y), po(WW * WW), po(WW * y)
    al = ((mxy - mx * my) / (mxx - mx * mx + 1e-3)).clamp(0.85, 1.15)
    be = my - al * mx
    up = lambda t: F.interpolate(t, size=(h, w), mode="bilinear", align_corners=False)
    return up(al) * WW + up(be)


def scal_ramki(out, g):
    """Scala obszary (x0,y0,x1,y1,n,z), których ramki są bliżej niż g px."""
    out = list(out)
    zmiana = True
    while zmiana and len(out) > 1:
        zmiana = False
        for i in range(len(out)):
            for j in range(i + 1, len(out)):
                a, b = out[i], out[j]
                if a[0] - g <= b[2] and b[0] - g <= a[2] and a[1] - g <= b[3] and b[1] - g <= a[3]:
                    out[i] = (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]), a[4] + b[4], max(a[5], b[5]))
                    del out[j]
                    zmiana = True
                    break
            if zmiana:
                break
    return out


def wykryj_v3(sciezka, bib, konfiguracje, typ_prawda=None, typ_wymuszony=None, prog_doboru=None):
    t0 = time.perf_counter()
    g = wczytaj_szarosc(sciezka)
    H, W = g.shape
    a = tlumienie(g)
    rob = zmniejsz(a, bib.szer_rob)
    mal = zmniejsz(a, SZER_DOBOR)
    del a
    dop, typ = dobierz(mal, bib)
    jak = jakosc_doboru(dop)
    if typ_wymuszony:
        typ = typ_wymuszony
    t_dobor = time.perf_counter() - t0
    if not typ_wymuszony and brak_wzorca(dop, prog_doboru):   # zadanie 36: próg z zadania 33 także w v3
        return dict(plik=os.path.basename(sciezka), szer=W, wys=H, typ_prawda=typ_prawda, dobor=dop[:5],
                    jakosc_doboru=jak, brak_wzorca=True, czas_s=round(time.perf_counter() - t0, 3),
                    czas_dobor_s=round(t_dobor, 3),
                    konfiguracje={k["nazwa"]: dict(typ_wybrany=None, wzorce=[], miejsca=[], napis=BRAK_WZORCA)
                                  for k in konfiguracje})
    h, w = rob.shape[-2:]
    f = w / SZER_DOBOR
    kand = [d for d in dop if d["typ"] == typ]
    WW = []
    pol = []
    for d in kand:                                       # jak v2: skala + przesunięcie + jasność całego obrazu
        i = [x[0] for x in bib.wpisy].index(d["id"])
        wr = dopasuj_rozmiar(bib.rob[i], rob)
        sk = torch.tensor([d["s"]])
        ww = warp_skala(wr, sk, d["dx"] * f, d["dy"] * f)
        _, _, ddx, ddy = dopasuj(rob, ww, skale=torch.tensor([1.0]), max_dx=3 * f / w + 2 / w, max_dy=3 * f / h + 2 / h)
        ww = warp_skala(wr, sk, d["dx"] * f + ddx, d["dy"] * f + ddy)
        # zadanie 25: końcowe położenie wzorca w pikselach obrazu (x_b = s·x_w + dx, y_b = y_w + dy) — tylko zapis
        pol.append(dict(id=d["id"], s=round(d["s"], 4), dx=round((d["dx"] * f + ddx) * W / w, 2), dy=round((d["dy"] * f + ddy) * H / h, 2)))
        x, y = ww.flatten(), rob.flatten()
        xm, ym = x.mean(), y.mean()
        alfa = ((x - xm) * (y - ym)).sum() / ((x - xm) ** 2).sum().clamp(min=1e-6)
        WW.append(alfa * ww + (ym - alfa * xm))
    WW = torch.cat(WW)
    tw, th = kafle(w, h)
    pud = torch.zeros(h, w, device=rob.device)
    pod = pud.clone(); pod[int(Y_POD * h):] = 1
    kab = pud.clone(); kab[:int(Y_POD * h), :int(X_KAB * w)] = 1
    pud = 1 - pod - kab
    wyrown, reszta, obszary, wyniki = {}, {}, {}, {}
    sx, sy = W / w, H / h
    for konf in konfiguracje:
        kw = (konf["lok"], konf["jas"])
        if kw not in wyrown:
            if (konf["lok"], 0) not in wyrown:
                wyrown[(konf["lok"], 0)] = lokalnie(WW, rob, konf["lok"]) if konf["lok"] else WW
            wyrown[kw] = jasnosc(wyrown[(konf["lok"], 0)], rob) if konf["jas"] else wyrown[(konf["lok"], 0)]
        tx = max(1, round(konf["tolx"] * 0.001 * w))
        kr = kw + (konf["wyb"], konf["trend"], tx)
        if kr not in reszta:
            V = wyrown[kw]
            hi = F.max_pool2d(V, (3, 2 * tx + 1), 1, (1, tx))
            lo = -F.max_pool2d(-V, (3, 2 * tx + 1), 1, (1, tx))
            R = ((rob - hi).clamp(min=0) - (lo - rob).clamp(min=0))[:, 0]
            if konf["wyb"]:                              # jeden wzorzec na kafel: najmniejsza średnia |różnica|
                sc = F.avg_pool2d((rob - V).abs(), (th, tw), (th, tw), ceil_mode=True)[:, 0]
                idx = sc.argmin(0)[None, None].float()
                idx = F.interpolate(idx, size=(h, w), mode="nearest")[0].long()
            else:
                idx = R.abs().argmin(0, keepdim=True)
            r = R.gather(0, idx)[0]
            r = F.avg_pool2d(r[None, None], 3, 1, 1)[0, 0]
            if konf["trend"]:
                kol = r.median(dim=0).values[None, None]
                kk = max(3, int(0.02 * w) | 1)
                kol = F.avg_pool1d(F.pad(kol, (kk // 2, kk // 2), mode="replicate"), kk, 1)[0, 0]
                r = r - kol[None, :]
            reszta[kr] = (r, hi.max(0).values[0])
        r, wmax = reszta[kr]
        km = kr + (konf["tau_pud"], konf["tau_pod"], konf["tau_kab"], konf["rho"])
        if km not in obszary:
            prog = konf["tau_pud"] * pud + konf["tau_pod"] * pod + konf["tau_kab"] * kab + konf["rho"] * wmax
            m = r.abs() > prog
            m = F.max_pool2d(m[None, None].float(), 3, 1, 1)[0, 0] > 0
            obszary[km] = skladowe(m, r)
        min_px = max(4, int(konf["min_pole"] * h * w))
        out = []
        for (x0, y0, x1, y1, n, z) in obszary[km]:
            bw, bh = x1 - x0, y1 - y0
            if konf["konstr"]:
                if bw <= 0.009 * w and bh >= 0.45 * h:
                    continue
                if bw <= 0.007 * w and bh <= 0.10 * h and y0 >= 0.79 * h and y1 <= 0.94 * h:
                    continue
            if n >= min_px:
                out.append((x0, y0, x1, y1, n, z))
        if konf["scal"]:
            out = scal_ramki(out, konf["scal"] * w)
        miejsca = [dict(x0=round(x0 * sx), y0=round(y0 * sy), x1=round(x1 * sx), y1=round(y1 * sy), wynik=round(z, 3))
                   for (x0, y0, x1, y1, n, z) in out]
        miejsca.sort(key=lambda m: -m["wynik"])
        wyniki[konf["nazwa"]] = dict(typ_wybrany=typ, wzorce=[d["id"] for d in kand], miejsca=miejsca[:50])
    if DEV.type == "cuda":
        torch.cuda.synchronize()
    return dict(plik=os.path.basename(sciezka), szer=W, wys=H, typ_prawda=typ_prawda, dobor=dop[:5],
                jakosc_doboru=jak, polozenie_wzorcow=pol,
                czas_s=round(time.perf_counter() - t0, 3), czas_dobor_s=round(t_dobor, 3), konfiguracje=wyniki)
