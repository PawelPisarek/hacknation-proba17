#!/usr/bin/env python3
"""Generator sztucznych obrazów RTG naczep (zadanie 01). Deterministyczny: ten sam --ziarno => te same bajty.

Wyjście: 24-bit BMP (szarość): biblioteka wzorców czystych dla 4 typów pojazdów (firanka, chłodnia, kontener,
cysterna; każdy egzemplarz inny: długość, osie, słupki, jasność, szum, przesunięcie) + obrazy badane (czyste / z dodatkami)
+ manifest.json (typ pojazdu każdego obrazu; prawda: prostokąty dodatków we współrzędnych pikselowych obrazu badanego).
Wzorzec NIE jest zdjęciem tej samej naczepy — system sam dobiera wzorzec z biblioteki (decyzja Artura P2). Zależność: tylko numpy.

Model: transmisja = exp(-suma tłumień). Każdy obraz = osobny egzemplarz typu, z przesunięciem
(dx,dy), zmianą jasności/kontrastu, gradientem oświetlenia, paskami detektora, rozmyciem, szumem
(+ małe odchyłki elementów w trybie "trudny") i — dla klasy "dodatki" — 1..3 anomaliami:
  przedmiot  — przedmioty w ładunku (paczki, "kartony papierosów" w siatce, butla)
  skrytka    — zwarty blok ukryty w konstrukcji (belka, ściana, zbiornik)
  przerobka  — zmiana struktury (dodatkowa blacha/żebro, brak żebra, przesunięty słupek)
"""
import argparse, json, os, sys, hashlib
import numpy as np

# poziomy: nazwa -> (szerokość, wysokość)
POZIOMY = {"mini": (1024, 256), "maly": (2048, 512), "sredni": (4096, 1024), "pelny": (8192, 2048)}


def zapisz_bmp(sciezka, g):
    """g: uint8 (H,W) -> 24-bit BMP bez kompresji (wiersze od dołu, dopełnienie do 4 B)."""
    h, w = g.shape
    row = w * 3
    pad = (-row) % 4
    size = 54 + (row + pad) * h
    hdr = b"BM" + size.to_bytes(4, "little") + b"\0\0\0\0" + (54).to_bytes(4, "little")
    hdr += (40).to_bytes(4, "little") + w.to_bytes(4, "little") + h.to_bytes(4, "little")
    hdr += (1).to_bytes(2, "little") + (24).to_bytes(2, "little") + b"\0" * 4
    hdr += ((row + pad) * h).to_bytes(4, "little") + (2835).to_bytes(4, "little") * 2 + b"\0" * 8
    with open(sciezka, "wb") as f:
        f.write(hdr)
        p = b"\0" * pad
        step = 256
        for y0 in range(h, 0, -step):  # od dołu
            blok = g[max(0, y0 - step):y0][::-1]
            rgb = np.repeat(blok[:, :, None], 3, axis=2)
            if pad:
                rgb = np.concatenate([rgb.reshape(len(blok), row), np.zeros((len(blok), pad), np.uint8)], axis=1)
            f.write(rgb.tobytes())


TYPY = ["firanka", "chlodnia", "kontener", "cysterna"]


def pojazd(typ, ziarno, rng):
    """Egzemplarz pojazdu danego typu: projekt typu (stały dla typu i ziarna) + naturalna zmienność egzemplarza
    (długość, położenie osi, słupków i poprzeczek, brakujące/dodatkowe elementy, gęstości)."""
    tr = np.random.default_rng([ziarno, 7, TYPY.index(typ)])
    nsl = {"firanka": 11, "chlodnia": 5, "kontener": 4, "cysterna": 6}[typ]
    npo = {"firanka": 24, "chlodnia": 18, "kontener": 14, "cysterna": 20}[typ]
    nk = {"firanka": 3, "chlodnia": 3, "kontener": 3, "cysterna": 2}[typ]
    bs, bp = np.sort(tr.uniform(0.10, 0.94, nsl)), np.sort(tr.uniform(0.10, 0.94, npo))
    bk = 0.95 - 0.075 * np.arange(nk)
    bz = (tr.uniform(0.30, 0.50), tr.uniform(0.05, 0.10))
    kab = tr.uniform(0.06, 0.09)

    def zmien(base, sig, p_drop=0.08, p_add=0.08):
        x = base + rng.normal(0, sig, len(base))
        x = x[rng.random(len(x)) > p_drop]
        dod = rng.uniform(0.10, 0.94, int(rng.random() < p_add * 5) * int(rng.integers(1, 3)))
        return np.sort(np.concatenate([x, dod]))

    return dict(
        typ=typ, L=float(rng.uniform(0.82, 1.0)),
        slupki=zmien(bs, 0.004), poprzeczki=zmien(bp, 0.004),
        kola_x=bk + rng.normal(0, 0.008, nk), zbiornik=(bz[0] + rng.normal(0, 0.01), bz[1]),
        kab_dl=kab * rng.uniform(0.95, 1.05),
        mat=rng.uniform(0.93, 1.07, 8), ladunek_pusty=float(rng.uniform(0.9, 1.1)),
    )


def rend(P, W, H, dx, dy, jit=None, rng=None):
    """Renderuje tłumienie (float32) pojazdu P z przesunięciem (dx,dy) px. jit: odchyłki elementów (ułamek)."""
    A = np.zeros((H, W), np.float32)
    mat, typ, L = P["mat"], P["typ"], P["L"]
    m = lambda u: 0.07 + (u - 0.07) * L   # ułamek długości: korpus skraca się z L

    def rect(x0, y0, x1, y1, v, mapuj=True):
        if mapuj:
            x0, x1 = m(x0), m(x1)
        xa, xb = int(round(x0 * W + dx)), int(round(x1 * W + dx))
        ya, yb = int(round(y0 * H + dy)), int(round(y1 * H + dy))
        xb, yb = max(xb, xa + 1), max(yb, ya + 1)
        xa, ya = max(xa, 0), max(ya, 0)
        xb, yb = min(xb, W), min(yb, H)
        if xa < xb and ya < yb:
            A[ya:yb, xa:xb] += v

    def j():
        return 0.0 if jit is None else rng.normal(0, jit)

    lp = P["ladunek_pusty"]
    top, bot = 0.10, 0.80
    # --- korpus zależny od typu ---
    if typ == "firanka":      # lekka plandeka, ramy, wysokie słupki
        rect(0.07, top, 0.97, bot, 0.06 * lp)
        rect(0.07, top, 0.97, 0.115, 0.55 * mat[0]); rect(0.07, 0.78, 0.97, bot, 0.5 * mat[0])
        for x in P["slupki"]:
            x += j(); rect(x, top, x + 0.006, bot, 0.50 * mat[3])
    elif typ == "chlodnia":   # gruba izolowana ściana, agregat z przodu
        rect(0.07, top, 0.97, bot, 0.20 * lp)
        for y0, y1 in ((top, top + 0.03), (bot - 0.03, bot)):
            rect(0.07, y0, 0.97, y1, 0.45 * mat[0])
        rect(0.07, top, 0.075, bot, 0.5 * mat[0]); rect(0.965, top, 0.97, bot, 0.5 * mat[0])
        rect(0.08, 0.14, 0.15, 0.50, 0.8 * mat[1])       # agregat chłodniczy
        rect(0.09, 0.16, 0.14, 0.30, 0.5 * mat[1])
        for x in P["slupki"]:
            x += j(); rect(x, top, x + 0.004, bot, 0.25 * mat[3])
    elif typ == "kontener":   # faliste ściany, narożniki
        rect(0.07, top, 0.97, bot, 0.10 * lp)
        step = max(4.0 / W, 0.0028)
        xs = np.arange(0.075, 0.965, step)
        for x in xs[::2]:
            rect(x, top + 0.02, x + step * 0.5, bot - 0.02, 0.08 * mat[3])
        rect(0.07, top, 0.97, top + 0.02, 0.6 * mat[0]); rect(0.07, bot - 0.02, 0.97, bot, 0.6 * mat[0])
        for xc in (0.07, 0.955):
            rect(xc, top, xc + 0.015, top + 0.07, 1.1); rect(xc, bot - 0.07, xc + 0.015, bot, 1.1)
        for x in P["slupki"]:
            x += j(); rect(x, top, x + 0.005, bot, 0.35 * mat[3])
    else:                     # cysterna: walec, tłumienie ~ grubość cięciwy, pierścienie
        r = (bot - top) / 2; yc = (bot + top) / 2
        ys = (np.arange(H, dtype=np.float32) - dy) / H
        ch = np.sqrt(np.clip(1 - ((ys - yc) / r) ** 2, 0, 1)).astype(np.float32)[:, None]
        xa, xb = int(round(m(0.07) * W + dx)), int(round(m(0.97) * W + dx))
        xa, xb = max(xa, 0), min(xb, W)
        if xa < xb:
            A[:, xa:xb] += 0.55 * lp * ch                 # ciecz/ściany zbiornika
        for x in P["slupki"]:
            x += j(); rect(x, top, x + 0.004, bot, 0.4 * mat[3])  # pierścienie wzmacniające
        rect(0.40, 0.065, 0.45, top, 0.7 * mat[0])              # właz
        rect(0.07, top, 0.97, top + 0.01, 0.4)
    # --- podwozie (wspólne) ---
    rect(0.05, 0.80, 0.97, 0.835, 0.9 * mat[1])
    rect(0.05, 0.855, 0.97, 0.885, 1.1 * mat[2])
    rect(0.05, 0.905, 0.97, 0.93, 0.8 * mat[2])
    for x in P["poprzeczki"]:
        x += j(); rect(x, 0.835, x + 0.004, 0.905, 0.65 * mat[4])
    zx, zl = P["zbiornik"]
    rect(zx, 0.935, zx + zl, 0.985, 0.9 * mat[5]); rect(zx + 0.003, 0.93, zx + zl - 0.003, 0.99, 0.5 * mat[5])
    kd = P["kab_dl"]
    rect(0.0, 0.20, kd, 0.92, 0.9 * mat[6], False); rect(0.0, 0.55, kd * 0.7, 0.95, 1.2 * mat[6], False)
    rect(0.005, 0.25, kd * 0.45, 0.45, -0.5 * mat[6] + 0.9, False)
    yy, xx = np.ogrid[:H, :W]
    r = 0.095 * H
    for cx in P["kola_x"]:
        for off in (0.0, 0.032):
            cxp, cyp = m(cx - off) * W + dx, 0.88 * H + dy
            x0, x1 = int(max(cxp - r - 1, 0)), int(min(cxp + r + 2, W))
            y0, y1 = int(max(cyp - r - 1, 0)), int(min(cyp + r + 2, H))
            if x0 >= x1 or y0 >= y1:
                continue
            d = np.hypot(xx[:, x0:x1] - cxp, yy[y0:y1] - cyp)
            A[y0:y1, x0:x1] += np.where(d < r, 0.35 * mat[7], 0) + np.where(d < r * 0.35, 0.9, 0) \
                               + np.where((d < r) & (d > r * 0.82), 0.7, 0)
    return A


def losuj_prostokat(rng, W, H, typ):
    """Zwraca (x0,y0,x1,y1) w px dla anomalii danego typu — położenie sensowne dla typu."""
    if typ == "przedmiot":      # w pudle ładunkowym
        w = rng.uniform(0.03, 0.10) * W / 4  # ~ułamek szerokości
        h = rng.uniform(0.07, 0.20) * H
        x0 = rng.uniform(0.12, 0.90) * W
        y0 = rng.uniform(0.15, 0.78) * H - h
    elif typ == "skrytka":      # w podłodze/podłużnicach/zbiorniku
        w = rng.uniform(0.012, 0.035) * W
        h = rng.uniform(0.03, 0.07) * H
        x0 = rng.uniform(0.15, 0.90) * W
        y0 = rng.choice([0.80, 0.855, 0.905]) * H + rng.uniform(0, 0.01) * H
    else:                       # przeróbka: na ścianach/ramie/słupku
        w = rng.uniform(0.006, 0.03) * W
        h = rng.uniform(0.10, 0.40) * H
        x0 = rng.uniform(0.12, 0.92) * W
        y0 = rng.uniform(0.10, 0.45) * H
    w = max(w, 8.0)
    h = max(h, 8.0)
    x0 = min(max(x0, 2), W - w - 2)
    y0 = min(max(y0, 2), H - h - 2)
    return [int(x0), int(y0), int(x0 + w), int(y0 + h)]


def rysuj_anomalie(A, box, typ, rng):
    x0, y0, x1, y1 = box
    h, w = y1 - y0, x1 - x0
    if typ == "przedmiot":
        if rng.random() < 0.5:   # siatka małych "kartonów" (gęste, niejednorodne)
            ncx, ncy = max(2, w // 14), max(2, h // 10)
            wx, wy = w / ncx, h / ncy
            for i in range(ncx):
                for k in range(ncy):
                    v = rng.uniform(0.25, 0.55)
                    A[int(y0 + k * wy + 1):int(y0 + (k + 1) * wy), int(x0 + i * wx + 1):int(x0 + (i + 1) * wx)] += v
        else:                     # jednolita paczka / butla z teksturą
            tex = rng.normal(0, 0.05, (h, w)).astype(np.float32)
            A[y0:y1, x0:x1] += rng.uniform(0.35, 0.8) + tex
    elif typ == "skrytka":
        tex = rng.normal(0, 0.04, (h, w)).astype(np.float32)
        A[y0:y1, x0:x1] += rng.uniform(0.4, 0.9) + tex
        A[y0:y0 + 1, x0:x1] += 0.3  # krawędź blachy
        A[y1 - 1:y1, x0:x1] += 0.3
    else:  # przeróbka
        r = rng.random()
        if r < 0.45:   # dodatkowa blacha/żebro
            A[y0:y1, x0:x1] += rng.uniform(0.45, 0.8)
        elif r < 0.75:  # "brakujący" element: wycięcie (lokalnie mniej tłumienia)
            A[y0:y1, x0:x1] = np.maximum(A[y0:y1, x0:x1] - rng.uniform(0.35, 0.6), 0)
        else:         # skośna wzmocnienie
            yy, xx = np.mgrid[0:h, 0:w]
            m = (np.abs(yy / max(h, 1) - xx / max(w, 1)) < 0.18)
            A[y0:y1, x0:x1] += m * rng.uniform(0.5, 0.9)


def box_blur(img, k):
    if k <= 1:
        return img
    for ax in (0, 1):
        c = np.cumsum(np.pad(img, [(k // 2 + 1, k // 2) if a == ax else (0, 0) for a in (0, 1)], mode="edge"),
                      axis=ax, dtype=np.float64)
        n = img.shape[ax]
        sl = lambda s: tuple(s if a == ax else slice(None) for a in (0, 1))
        img = ((c[sl(slice(k, k + n))] - c[sl(slice(0, n))]) / k).astype(np.float32)
    return img


def na_szarosc(A, rng, gain, off, gradient, pasy, szum, blur):
    H, W = A.shape
    T = np.exp(-A * gain)                                  # transmisja 0..1
    x = np.linspace(-1, 1, W, dtype=np.float32)[None, :]
    T = T * (1 + gradient * x) + off                       # gradient oświetlenia + offset
    if pasy:
        T = T * (1 + rng.normal(0, pasy, W).astype(np.float32)[None, :])  # paski detektora (kolumny)
    T = box_blur(T, blur)
    T = T + rng.normal(0, szum, T.shape).astype(np.float32)
    return np.clip(T * 235 + 8, 0, 255).astype(np.uint8)


def obraz(typ, nazwa, poziom, trudny, klasa, ziarno, wyj):
    """Jeden egzemplarz pojazdu typu `typ`. klasa: wzorzec (czysty, do biblioteki) | czyste | dodatki (badane)."""
    W, H = POZIOMY[poziom]
    rng = np.random.default_rng([ziarno, int(hashlib.md5(nazwa.encode()).hexdigest()[:8], 16)])
    P = pojazd(typ, ziarno, rng)
    sk = H / 512.0
    amp = (10 if trudny else 4) * sk
    dx, dy = int(rng.integers(-amp, amp + 1)), int(rng.integers(-amp / 2, amp / 2 + 1))
    A = rend(P, W, H, dx, dy, jit=(0.0015 if trudny else None), rng=rng)
    boxes = []
    if klasa == "dodatki":
        for _ in range(int(rng.integers(1, 4))):
            t = str(rng.choice(["przedmiot", "skrytka", "przerobka"]))
            b = losuj_prostokat(rng, W, H, t)
            rysuj_anomalie(A, b, t, rng)
            boxes.append(dict(x0=b[0], y0=b[1], x1=b[2], y1=b[3], typ=t))
    k = 2 if trudny else 1
    g = na_szarosc(A, rng, rng.uniform(1 - 0.08 * k, 1 + 0.08 * k), rng.uniform(-0.02, 0.02) * k,
                   rng.uniform(-0.04, 0.04) * k, 0.003 * (1 + k), 0.006 * k, 1 + (k if sk >= 1 else 0))
    plik = nazwa + ".bmp"
    zapisz_bmp(os.path.join(wyj, plik), g)
    return dict(id=nazwa, typ_pojazdu=typ, poziom=poziom, klasa=klasa, trudny=bool(trudny), szer=W, wys=H, plik=plik,
                przesuniecie_px=[dx, dy], dlugosc_wzgl=round(P["L"], 3), dodatki=boxes,
                bajty=os.path.getsize(os.path.join(wyj, plik)))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--wyj", required=True, help="katalog wyjściowy")
    ap.add_argument("--ziarno", type=int, default=17)
    ap.add_argument("--spec", default="mini:3:2:2",
                    help="poziom:wzorce_na_typ:czyste_na_typ:dodatki_na_typ[,...] np. mini:3:2:2,maly:8:5:5,sredni:3:3:3,pelny:1:1:1")
    ap.add_argument("--trudne-co", type=int, default=3, help="co n-te badane (w typie i klasie) jest 'trudne' (0=brak)")
    a = ap.parse_args()
    os.makedirs(a.wyj, exist_ok=True)
    wzorce, badane = [], []
    for seg in a.spec.split(","):
        poz, nw, nc, nd = seg.split(":")
        for typ in TYPY:
            for i in range(int(nw)):
                wzorce.append(obraz(typ, f"wzorzec_{poz}_{typ}_{i:02d}", poz, False, "wzorzec", a.ziarno, a.wyj))
                print("ok", wzorce[-1]["id"], flush=True)
            for klasa, n in (("czyste", int(nc)), ("dodatki", int(nd))):
                for i in range(n):
                    tr = a.trudne_co > 0 and i % a.trudne_co == a.trudne_co - 1
                    badane.append(obraz(typ, f"badany_{poz}_{typ}_{klasa}_{i:02d}", poz, tr, klasa, a.ziarno, a.wyj))
                    print("ok", badane[-1]["id"], flush=True)
    man = dict(ziarno=a.ziarno, spec=a.spec, typy=TYPY,
               opis="wzorce = biblioteka czystych egzemplarzy typu (system sam dobiera wzorzec); badane = czyste/dodatki z "
                    "typ_pojazdu (prawda do sprawdzenia doboru). Wzorzec dla badanego to inny egzemplarz tego samego typu.",
               wspolrzedne="piksele obrazu badanego, (x0,y0)-(x1,y1) wyłącznie, y od góry",
               wzorce=wzorce, badane=badane)
    with open(os.path.join(a.wyj, "manifest.json"), "w") as f:
        json.dump(man, f, ensure_ascii=False, indent=1)
    nc = sum(p["klasa"] == "czyste" for p in badane)
    sz = sum(p["bajty"] for p in wzorce + badane)
    print(f"WYNIK: typy={len(TYPY)} wzorce={len(wzorce)} badane_czyste={nc} badane_z_dodatkami={len(badane) - nc} "
          f"plikow={len(wzorce) + len(badane)} razem={sz / 1e6:.1f} MB maks_plik={max(p['bajty'] for p in wzorce + badane) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
