"""Prześwit — wynik bazowy: dobór wzorca typu z biblioteki + wyrównanie (skala, przesunięcie) + różnica tłumienia.

Partia (P12): lista obrazów badanych -> liczone po kolei -> lista wyników (JSON) + raport PNG z zaznaczonymi miejscami.
Liczy na karcie (torch, CUDA). Jedno przejście liczy kilka konfiguracji naraz (siatka hipotez), żeby ocena porównała je.

  python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wyniki/mini
  python -m przeswit.wykryj --biblioteka DIR --badane a.bmp b.bmp ... --wyj DIR
"""
import argparse, glob, itertools, json, os, sys, time
import numpy as np
import torch
import torch.nn.functional as F

from .bmp import wczytaj_szarosc

DEV = torch.device("cuda" if torch.cuda.is_available() else "cpu")
SKALE = torch.linspace(0.80, 1.25, 46)          # stosunek długości korpusu badany/wzorzec
SZER_DOBOR = 512                                 # szerokość robocza do doboru wzorca


# ---------- obraz -> tłumienie na karcie ----------
def tlumienie(g):
    """uint8 (H,W) -> float32 tensor (1,1,H,W) na karcie, tłumienie = -log(transmisja)."""
    t = torch.from_numpy(g).to(DEV, non_blocking=True).float()
    T = ((t - 8.0) / 235.0).clamp_(1e-3, 1.5)
    return (-torch.log(T)).clamp_(min=0)[None, None]


def zmniejsz(a, szer):
    h, w = a.shape[-2:]
    if w <= szer:
        return a
    return F.interpolate(a, size=(max(8, round(h * szer / w)), szer), mode="area")


def warp_skala(a, s, dx=0.0, dy=0.0):
    """a: (N,1,h,w); s: (N,) skala w poziomie (oś x od lewej krawędzi), dx, dy w px. x_b = s*x_w + dx."""
    N, _, h, w = a.shape
    s = s.to(a).view(N)
    dx = torch.as_tensor(dx, dtype=a.dtype, device=a.device).expand(N)
    dy = torch.as_tensor(dy, dtype=a.dtype, device=a.device).expand(N)
    # współrzędne znormalizowane [-1,1] (align_corners=False): px = (u+1)*w/2 - 0.5
    theta = torch.zeros(N, 2, 3, dtype=a.dtype, device=a.device)
    # x_w = (x_b - dx)/s  ->  u_w = ((u_b+1)*w/2 - 0.5 - dx)/s ; w normalizowanych
    theta[:, 0, 0] = 1.0 / s
    theta[:, 0, 2] = (1.0 / s) * (1 - 2 * dx / w - 1.0 / w) - 1 + 1.0 / w
    theta[:, 1, 1] = 1.0
    theta[:, 1, 2] = -2 * dy / h
    grid = F.affine_grid(theta, (N, 1, h, w), align_corners=False)
    return F.grid_sample(a, grid, mode="bilinear", padding_mode="zeros", align_corners=False)


def dopasuj(b, w, skale=SKALE, max_dx=0.12, max_dy=0.08):
    """b: (1,1,h,w) badany, w: (1,1,h,w) wzorzec (ta sama wielkość). Szuka skali x i przesunięcia (dx,dy)
    maksymalizujących znormalizowaną korelację. Zwraca (wynik, s, dx, dy) w px tej rozdzielczości."""
    h, W = b.shape[-2:]
    S = len(skale)
    ws = warp_skala(w.expand(S, 1, h, W), skale)
    px, py = int(W * max_dx) + 1, int(h * max_dy) + 1
    bz = b - b.mean()
    wz = ws - ws.mean(dim=(2, 3), keepdim=True)
    Hp, Wp = h + 2 * py, W + 2 * px
    fb = torch.fft.rfft2(F.pad(bz, (0, 2 * px, 0, 2 * py)), s=(Hp, Wp))
    fw = torch.fft.rfft2(F.pad(wz, (0, 2 * px, 0, 2 * py)), s=(Hp, Wp))
    cc = torch.fft.irfft2(fb * fw.conj(), s=(Hp, Wp))[:, 0]           # (S,Hp,Wp), indeks = przesunięcie (cyklicznie)
    cc = torch.cat([cc[:, :, -px:], cc[:, :, : px + 1]], dim=2)        # dx = -px..px
    cc = torch.cat([cc[:, -py:, :], cc[:, : py + 1, :]], dim=1)        # dy = -py..py
    norm = bz.norm() * wz.flatten(1).norm(dim=1).clamp(min=1e-6)
    cc = cc / norm.view(S, 1, 1)
    best = cc.flatten(1).max(dim=1)
    i = int(best.values.argmax())
    k = int(best.indices[i])
    dy, dx = divmod(k, cc.shape[2])
    return float(best.values[i]), float(skale[i]), float(dx - px), float(dy - py)


# ---------- etykiety spójnych obszarów na karcie ----------
def etykiety(mask):
    """mask: bool (h,w) -> int64 (h,w) etykiety (0 = tło), propagacja maksimum 3x3."""
    h, w = mask.shape
    m = mask[None, None].float()
    lab = (torch.arange(1, h * w + 1, device=mask.device, dtype=torch.float32).view(1, 1, h, w)) * m
    for it in range(4 * (h + w)):
        nowa = F.max_pool2d(lab, 3, 1, 1) * m
        if it % 8 == 7 and torch.equal(nowa, lab):
            break
        lab = nowa
    return lab[0, 0].long()


def prostokaty(mask, z, min_px):
    """Zwraca listę (x0,y0,x1,y1,wynik) dla obszarów maski o polu >= min_px (w px roboczych)."""
    lab = etykiety(mask)
    v = lab[lab > 0]
    if v.numel() == 0:
        return []
    u, inv, cnt = torch.unique(v, return_inverse=True, return_counts=True)
    ys, xs = torch.nonzero(lab > 0, as_tuple=True)
    n = len(u)
    big = torch.full((n,), 1 << 30, device=lab.device)
    x0 = big.clone().scatter_reduce(0, inv, xs, "amin"); y0 = big.clone().scatter_reduce(0, inv, ys, "amin")
    x1 = torch.zeros(n, dtype=torch.long, device=lab.device).scatter_reduce(0, inv, xs, "amax")
    y1 = torch.zeros(n, dtype=torch.long, device=lab.device).scatter_reduce(0, inv, ys, "amax")
    zz = torch.zeros(n, device=lab.device).scatter_reduce(0, inv, z[ys, xs], "amax")
    out = []
    for i in torch.nonzero(cnt >= min_px).flatten().tolist():
        out.append((int(x0[i]), int(y0[i]), int(x1[i]) + 1, int(y1[i]) + 1, float(zz[i])))
    return out


# ---------- biblioteka wzorców ----------
class Biblioteka:
    def __init__(self, wpisy, szer_rob):
        """wpisy: lista (id, typ, ścieżka)."""
        self.wpisy = wpisy
        self.szer_rob = szer_rob
        self.mal, self.rob = [], []
        for _, _, p in wpisy:
            a = tlumienie(wczytaj_szarosc(p))
            self.rob.append(zmniejsz(a, szer_rob))
            self.mal.append(zmniejsz(a, SZER_DOBOR))
            del a


def dopasuj_rozmiar(a, ref):
    return a if a.shape[-2:] == ref.shape[-2:] else F.interpolate(a, size=ref.shape[-2:], mode="bilinear",
                                                                   align_corners=False)


def wykryj(sciezka, bib, konfiguracje, typ_prawda=None):
    """Jeden obraz badany: dobór typu, wyrównanie, różnica, progi dla każdej konfiguracji."""
    t0 = time.perf_counter()
    g = wczytaj_szarosc(sciezka)
    H, W = g.shape
    a = tlumienie(g)
    rob = zmniejsz(a, bib.szer_rob)
    mal = zmniejsz(a, SZER_DOBOR)
    del a
    # 1) dobór wzorca: korelacja z każdym wzorcem biblioteki (na małej rozdzielczości)
    dop = []
    for (wid, typ, _), wm in zip(bib.wpisy, bib.mal):
        sc, s, dx, dy = dopasuj(mal, dopasuj_rozmiar(wm, mal))
        dop.append(dict(id=wid, typ=typ, wynik=sc, s=s, dx=dx, dy=dy))
    dop.sort(key=lambda d: -d["wynik"])
    typy = sorted({d["typ"] for d in dop})
    srednie = {t: float(np.mean([d["wynik"] for d in dop if d["typ"] == t])) for t in typy}
    wybor = {"najblizszy": dop[0]["typ"], "srednia_typu": max(srednie, key=srednie.get)}
    t_dobor = time.perf_counter() - t0
    # 2) różnica na rozdzielczości roboczej
    h, w = rob.shape[-2:]
    f = w / SZER_DOBOR
    reszty = {}
    wyniki = {}
    for konf in konfiguracje:
        typ = wybor[konf["dobor"]]
        kand = [d for d in dop if d["typ"] == typ][: konf["K"]]
        klucz = (konf["dobor"], konf["K"], konf["tol"])
        if klucz not in reszty:
            rr = []
            for d in kand:
                i = [x[0] for x in bib.wpisy].index(d["id"])
                wr = dopasuj_rozmiar(bib.rob[i], rob)
                # dokładne przesunięcie na rozdzielczości roboczej: lokalne doszukanie wokół zgrubnego
                sk = torch.tensor([d["s"]])
                ww = warp_skala(wr, sk, d["dx"] * f, d["dy"] * f)
                _, _, ddx, ddy = dopasuj(rob, ww, skale=torch.tensor([1.0]), max_dx=3 * f / w + 2 / w,
                                         max_dy=3 * f / h + 2 / h)
                ww = warp_skala(wr, sk, d["dx"] * f + ddx, d["dy"] * f + ddy)
                # dopasowanie jasności: b ≈ alfa*w + beta (najmniejsze kwadraty)
                x, y = ww.flatten(), rob.flatten()
                xm, ym = x.mean(), y.mean()
                alfa = ((x - xm) * (y - ym)).sum() / ((x - xm) ** 2).sum().clamp(min=1e-6)
                ww = alfa * ww + (ym - alfa * xm)
                t = konf["tol"]
                if t > 0:   # tolerancja na drobne przesunięcia elementów: porównanie z min/max otoczenia
                    hi = F.max_pool2d(ww, 2 * t + 1, 1, t)
                    lo = -F.max_pool2d(-ww, 2 * t + 1, 1, t)
                    r = (rob - hi).clamp(min=0) - (lo - rob).clamp(min=0)
                else:
                    r = rob - ww
                rr.append(r[0, 0])
            R = torch.stack(rr)                                   # (K,h,w)
            r = R.gather(0, R.abs().argmin(0, keepdim=True))[0]   # najmniejsza różnica wśród K wzorców
            r = F.avg_pool2d(r[None, None], 3, 1, 1)[0, 0]
            med = r.median()
            sig = 1.4826 * (r - med).abs().median().clamp(min=1e-4)
            reszty[klucz] = ((r - med) / sig).abs()
        z = reszty[klucz]
        mask = z > konf["prog"]
        mask = F.max_pool2d(mask[None, None].float(), 5, 1, 2)[0, 0] > 0     # sklejanie sąsiednich
        min_px = max(4, int(konf["min_pole"] * h * w))
        sx, sy = W / w, H / h
        miejsca = [dict(x0=round(x0 * sx), y0=round(y0 * sy), x1=round(x1 * sx), y1=round(y1 * sy),
                        wynik=round(zz, 2)) for x0, y0, x1, y1, zz in prostokaty(mask, z, min_px)]
        miejsca.sort(key=lambda m: -m["wynik"])
        wyniki[konf["nazwa"]] = dict(typ_wybrany=typ, wzorce=[d["id"] for d in kand], miejsca=miejsca[:50])
    if DEV.type == "cuda":
        torch.cuda.synchronize()
    return dict(plik=os.path.basename(sciezka), szer=W, wys=H, typ_prawda=typ_prawda,
                dobor=dop[:5], czas_s=round(time.perf_counter() - t0, 3), czas_dobor_s=round(t_dobor, 3),
                konfiguracje=wyniki)


def raport_png(sciezka, miejsca, wyj, szer=2048):
    """Podgląd badanego z zaznaczonymi miejscami (czerwone prostokąty, numer)."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    g = wczytaj_szarosc(sciezka)
    H, W = g.shape
    k = max(1, W // szer)
    im = Image.fromarray(g[::k, ::k]).convert("RGB")
    d = ImageDraw.Draw(im)
    for n, m in enumerate(miejsca, 1):
        b = [m["x0"] / k, m["y0"] / k, m["x1"] / k, m["y1"] / k]
        d.rectangle(b, outline=(255, 0, 0), width=2)
        d.text((b[0] + 2, max(0, b[1] - 11)), str(n), fill=(255, 0, 0))
    im.save(wyj)
    return wyj


def siatka(spec):
    """'dobor=najblizszy,srednia_typu;K=1,3;tol=0,2;prog=5,7;min_pole=0.0002' -> lista konfiguracji."""
    osie = {}
    for kaw in spec.split(";"):
        k, v = kaw.split("=")
        osie[k] = [x if k == "dobor" else (float(x) if "." in x else int(x)) for x in v.split(",")]
    out = []
    for comb in itertools.product(*osie.values()):
        c = dict(zip(osie.keys(), comb))
        c["nazwa"] = ",".join(f"{k}={v}" for k, v in c.items())
        out.append(c)
    return out


DOMYSLNA = "dobor=najblizszy;K=3;tol=2;prog=6;min_pole=0.0002"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--biblioteka", required=True, help="katalog z wzorcami (pliki wzorzec_*.bmp lub manifest)")
    ap.add_argument("--manifest", help="manifest.json: bierze wzorce i badane z niego (z prawdą typu)")
    ap.add_argument("--poziom", help="tylko obrazy danego poziomu z manifestu (mini/maly/sredni/pelny)")
    ap.add_argument("--poziom-wzorcow", help="poziom wzorców biblioteki (domyślnie = --poziom)")
    ap.add_argument("--bez-typu", default="", help="usuń wzorce tych rodzajów z biblioteki (P16: brak wzorca rodzaju)")
    ap.add_argument("--badane", nargs="*", default=[], help="lista plików badanych (partia)")
    ap.add_argument("--wyj", required=True)
    ap.add_argument("--szer-rob", type=int, default=1024, help="szerokość robocza różnicy (px)")
    ap.add_argument("--siatka", default=DOMYSLNA, help="konfiguracje do policzenia naraz")
    ap.add_argument("--raport", default=None, help="nazwa konfiguracji do raportu PNG (domyślnie pierwsza)")
    ap.add_argument("--bez-png", action="store_true")
    a = ap.parse_args()
    os.makedirs(a.wyj, exist_ok=True)
    typ_z_nazwy = lambda p: os.path.basename(p).split("_")[2] if os.path.basename(p).count("_") >= 3 else None
    if a.manifest:
        man = json.load(open(a.manifest))
        ok = lambda e: a.poziom is None or e["poziom"] == a.poziom
        pw = a.poziom_wzorcow or a.poziom
        okw = lambda e: (pw is None or e["poziom"] == pw) and e["typ_pojazdu"] not in a.bez_typu.split(",")
        wz = [(e["id"], e["typ_pojazdu"], os.path.join(a.biblioteka, e["plik"])) for e in man["wzorce"] if okw(e)]
        bad = [(os.path.join(a.biblioteka, e["plik"]), e["typ_pojazdu"]) for e in man["badane"] if ok(e)]
    else:
        pl = sorted(glob.glob(os.path.join(a.biblioteka, "wzorzec_*.bmp")))
        wz = [(os.path.basename(p)[:-4], typ_z_nazwy(p), p) for p in pl]
        bad = []
    bad += [(p, None) for p in a.badane]
    konf = siatka(a.siatka)
    typy_bib = sorted({t for _, t, _ in wz})
    print(f"urządzenie: {DEV} {torch.cuda.get_device_name(0) if DEV.type == 'cuda' else ''}; wzorców {len(wz)}, "
          f"badanych {len(bad)}, konfiguracji {len(konf)}", flush=True)
    t0 = time.perf_counter()
    bib = Biblioteka(wz, a.szer_rob)
    t_bib = time.perf_counter() - t0
    wyniki = []
    for p, typ in bad:   # partia: po kolei
        r = wykryj(p, bib, konf, typ)
        if typ and typ not in typy_bib:   # P16: wzorzec przybliżony
            for k in r["konfiguracje"].values():
                k["uwaga"] = f"wzorzec przybliżony ({k['typ_wybrany']} zamiast {typ})"
        nazwa = a.raport or konf[0]["nazwa"]
        if not a.bez_png:
            r["raport_png"] = raport_png(p, r["konfiguracje"][nazwa]["miejsca"],
                                         os.path.join(a.wyj, os.path.basename(p)[:-4] + ".png"))
        wyniki.append(r)
        k0 = r["konfiguracje"][nazwa]
        print(f"{r['plik']}: typ {k0['typ_wybrany']} (prawda {typ}), miejsc {len(k0['miejsca'])}, "
              f"{r['czas_s']:.2f} s", flush=True)
    out = dict(siatka=a.siatka, typy_biblioteki=typy_bib, konfiguracje=[k["nazwa"] for k in konf], szer_rob=a.szer_rob,
               czas_biblioteki_s=round(t_bib, 2), urzadzenie=str(DEV), wyniki=wyniki)
    json.dump(out, open(os.path.join(a.wyj, "wyniki.json"), "w"), ensure_ascii=False, indent=1)
    print(f"zapisano {os.path.join(a.wyj, 'wyniki.json')} ({len(wyniki)} obrazów, biblioteka {t_bib:.1f} s)")


if __name__ == "__main__":
    main()
