#!/usr/bin/env python3
"""Generator zbioru TRUDNEGO (zadanie 03). Deterministyczny (to samo --ziarno => te same bajty). Zależność: numpy.
Używa funkcji z generuj.py (nie zmienia go; dane/mini i dane/manifest.json zostają jak były).

Rodzaje trudności (pole `trudnosc` w manifeście):
  egzemplarz        czyste   — silne różnice egzemplarza tego samego typu: przesunięcie, SKALA wzdłuż pojazdu, jasność/kontrast
                               skanu, gradient, szum, odchyłki elementów. Każdy alarm = fałszywy alarm.
  ladunek_legalny   czyste   — legalny ładunek (kartony/paczka) nakładający się na konstrukcję (ściana, rama, podłużnice,
                               słupki). Wygląda jak „przedmiot”, ale nim nie jest. Każdy alarm = fałszywy alarm.
  maly              dodatki  — małe dodatki (kilkanaście px) w konstrukcji/ładunku, bez ładunku dookoła.
  za_ladunkiem      dodatki  — mały dodatek schowany WEWNĄTRZ legalnego ładunku (niski kontrast względem ładunku).
Manifest: jak dane/manifest.json + `trudnosc`, `ladunek_legalny` (prostokąty legalnego ładunku — NIE są anomaliami) i
`dodatki` (prawda; tylko dla klas dodatki). Współrzędne w px obrazu badanego, (x0,y0)-(x1,y1) wyłącznie, y od góry.
Spec: poziom:wzorce_na_typ:egzemplarz:ladunek_legalny:maly:za_ladunkiem[,...]  (liczby na typ pojazdu)
"""
import argparse, json, os, sys, time, hashlib
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generuj as G  # noqa: E402

RODZAJE = ["egzemplarz", "ladunek_legalny", "maly", "za_ladunkiem"]
KLASA = {"egzemplarz": "czyste", "ladunek_legalny": "czyste", "maly": "dodatki", "za_ladunkiem": "dodatki"}


def skala_x(A, s):
    """Rozciągnięcie wzdłuż pojazdu o s względem środka (próbkowanie najbliższego sąsiada)."""
    W = A.shape[1]
    idx = np.clip(((np.arange(W) - W / 2) / s + W / 2).astype(int), 0, W - 1)
    return A[:, idx]


def ladunek(A, rng, W, H, kolizja):
    """Legalny ładunek; `kolizja`: nakłada się na konstrukcję (dół pudła + rama/podłużnice, słupki). Zwraca prostokąt."""
    w = int(rng.uniform(0.10, 0.22) * W)
    h = int(rng.uniform(0.22, 0.50) * H)
    x0 = int(rng.uniform(0.14, 0.88) * W)
    y0 = int((rng.uniform(0.50, 0.62) * H) if kolizja else rng.uniform(0.15, 0.40) * H)
    x0 = min(max(x0, 2), W - w - 2)
    y1 = min(y0 + h, H - 2)
    b = [x0, y0, x0 + w, y1]
    G.rysuj_anomalie(A, b, "przedmiot", rng)   # ten sam wygląd co „przedmiot” — o to chodzi
    return b


def maly_dodatek(A, rng, W, H, wnetrze=None):
    """Mały dodatek (kilkanaście px). wnetrze: prostokąt ładunku, w którym ma się zmieścić (niski kontrast)."""
    w = int(max(6, rng.uniform(0.008, 0.02) * W))
    h = int(max(6, rng.uniform(0.02, 0.05) * H))
    if wnetrze is not None:
        x0 = int(rng.integers(wnetrze[0] + 2, max(wnetrze[0] + 3, wnetrze[2] - w - 2)))
        y0 = int(rng.integers(wnetrze[1] + 2, max(wnetrze[1] + 3, wnetrze[3] - h - 2)))
        v = rng.uniform(0.18, 0.32)       # niski kontrast względem ładunku
    else:
        x0 = int(rng.uniform(0.15, 0.90) * W)
        y0 = int(rng.choice([0.80, 0.855, 0.905, 0.30, 0.50]) * H)
        v = rng.uniform(0.35, 0.7)
    x0 = min(max(x0, 2), W - w - 2)
    y0 = min(max(y0, 2), H - h - 2)
    tex = rng.normal(0, 0.03, (h, w)).astype(np.float32)
    A[y0:y0 + h, x0:x0 + w] += v + tex
    return [x0, y0, x0 + w, y0 + h]


def obraz(typ, nazwa, poziom, rodzaj, ziarno, wyj):
    W, H = G.POZIOMY[poziom]
    rng = np.random.default_rng([ziarno, 3, int(hashlib.md5(nazwa.encode()).hexdigest()[:8], 16)])
    P = G.pojazd(typ, ziarno, rng)
    sk = H / 512.0
    wzorzec = rodzaj == "wzorzec"
    mocno = rodzaj == "egzemplarz"
    amp = (6 if wzorzec else (22 if mocno else 12)) * sk
    dx, dy = int(rng.integers(-amp, amp + 1)), int(rng.integers(-amp / 2, amp / 2 + 1))
    A = G.rend(P, W, H, dx, dy, jit=(None if wzorzec else (0.004 if mocno else 0.002)), rng=rng)
    skala = 1.0 if wzorzec else float(rng.uniform(0.90, 1.10) if mocno else rng.uniform(0.97, 1.03))
    if skala != 1.0:
        A = skala_x(A, skala)
    lad, dod = [], []
    if rodzaj == "ladunek_legalny":
        for _ in range(int(rng.integers(1, 3))):
            lad.append(ladunek(A, rng, W, H, True))
    elif rodzaj == "maly":
        for _ in range(int(rng.integers(1, 4))):
            b = maly_dodatek(A, rng, W, H)
            dod.append(dict(x0=b[0], y0=b[1], x1=b[2], y1=b[3], typ="maly"))
    elif rodzaj == "za_ladunkiem":
        b0 = ladunek(A, rng, W, H, bool(rng.random() < 0.5))
        lad.append(b0)
        b = maly_dodatek(A, rng, W, H, wnetrze=b0)
        dod.append(dict(x0=b[0], y0=b[1], x1=b[2], y1=b[3], typ="za_ladunkiem"))
    k = 1 if wzorzec else (3 if mocno else 2)
    g = G.na_szarosc(A, rng, rng.uniform(1 - 0.08 * k, 1 + 0.08 * k), rng.uniform(-0.02, 0.02) * k,
                     rng.uniform(-0.04, 0.04) * k, 0.003 * (1 + k), 0.006 * k, 1 + (k if sk >= 1 else 0))
    plik = nazwa + ".bmp"
    G.zapisz_bmp(os.path.join(wyj, plik), g)
    return dict(id=nazwa, typ_pojazdu=typ, poziom=poziom, klasa=("wzorzec" if wzorzec else KLASA[rodzaj]),
                trudnosc=rodzaj, trudny=True, szer=W, wys=H, plik=plik, przesuniecie_px=[dx, dy],
                skala_wzdluz=round(skala, 3), dlugosc_wzgl=round(P["L"], 3), ladunek_legalny=[
                    dict(x0=b[0], y0=b[1], x1=b[2], y1=b[3]) for b in lad], dodatki=dod,
                bajty=os.path.getsize(os.path.join(wyj, plik)))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--wyj", required=True)
    ap.add_argument("--ziarno", type=int, default=17)
    ap.add_argument("--spec", default="mini:2:1:1:1:1")
    a = ap.parse_args()
    os.makedirs(a.wyj, exist_ok=True)
    t0 = time.time()
    wzorce, badane = [], []
    for seg in a.spec.split(","):
        p = seg.split(":")
        poz, nw = p[0], int(p[1])
        licz = dict(zip(RODZAJE, map(int, p[2:6])))
        for typ in G.TYPY:
            for i in range(nw):
                wzorce.append(obraz(typ, f"trudny_wzorzec_{poz}_{typ}_{i:02d}", poz, "wzorzec", a.ziarno, a.wyj))
                print("ok", wzorce[-1]["id"], flush=True)
            for r in RODZAJE:
                for i in range(licz[r]):
                    badane.append(obraz(typ, f"trudny_{poz}_{typ}_{r}_{i:02d}", poz, r, a.ziarno, a.wyj))
                    print("ok", badane[-1]["id"], flush=True)
    man = dict(ziarno=a.ziarno, spec=a.spec, typy=G.TYPY, rodzaje_trudnosci=RODZAJE,
               opis="zbiór trudny (zadanie 03): wzorce = biblioteka czystych egzemplarzy typu; badane z polem trudnosc. "
                    "ladunek_legalny = prostokąty legalnego ładunku (NIE anomalie). Format jak dane/manifest.json.",
               wspolrzedne="piksele obrazu badanego, (x0,y0)-(x1,y1) wyłącznie, y od góry",
               wzorce=wzorce, badane=badane)
    with open(os.path.join(a.wyj, "manifest.json"), "w") as f:
        json.dump(man, f, ensure_ascii=False, indent=1)
    sz = sum(p["bajty"] for p in wzorce + badane)
    po = {r: sum(p["trudnosc"] == r for p in badane) for r in RODZAJE}
    print(f"WYNIK: typy={len(G.TYPY)} wzorce={len(wzorce)} badane_czyste={sum(p['klasa'] == 'czyste' for p in badane)} "
          f"badane_z_dodatkami={sum(p['klasa'] == 'dodatki' for p in badane)} rodzaje={po} plikow={len(wzorce) + len(badane)} "
          f"razem={sz / 1e6:.1f} MB maks_plik={max(p['bajty'] for p in wzorce + badane) / 1e6:.1f} MB "
          f"czas={time.time() - t0:.0f} s")


if __name__ == "__main__":
    main()
