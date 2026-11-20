"""Zadanie 33: korelacje doboru każdego badanego z każdym wzorcem (pełna biblioteka), potem siatka progu jakości doboru.

Bez cysterny w bibliotece = te same korelacje bez wpisów cysterny (dobór liczony raz). Miary (wykryj2.jakosc_doboru):
maks — najlepszy pojedynczy wzorzec, sr — średnia najlepszego rodzaju. Wariant (miara, próg) liczy:
cysterny → brak wzorca (ile z ilu), pozostałe nadal dobrane poprawnie (ile z ilu), pełna biblioteka na trudnym (ile z 80).
python ocena/dobor33.py --zestaw zwykly DANE/manifest.json --zestaw trudny TRUDNE/manifest.json --wyj wyniki/z33
"""
import argparse, json, os, sys
import numpy as np
sys.path.insert(0, "src")
from przeswit.wykryj import Biblioteka, tlumienie, zmniejsz, SZER_DOBOR
from przeswit.bmp import wczytaj_szarosc
from przeswit.wykryj2 import dobierz, jakosc_doboru

POZ = ["mini", "maly", "sredni", "pelny"]
WZ_POZ = dict(mini="mini", maly="maly", sredni="sredni", pelny="maly")   # jak zadanie 19: pełne z wzorcami „maly”


def licz(nazwa, man_p, wyj):
    katalog = os.path.dirname(man_p)
    man = json.load(open(man_p))
    out = []
    for poz in POZ:
        wz = [(e["id"], e["typ_pojazdu"], os.path.join(katalog, e["plik"])) for e in man["wzorce"] if e["poziom"] == WZ_POZ[poz]]
        bad = [e for e in man["badane"] if e["poziom"] == poz]
        if not bad or not wz:
            continue
        bib = Biblioteka(wz, SZER_DOBOR)
        for e in bad:
            mal = zmniejsz(tlumienie(wczytaj_szarosc(os.path.join(katalog, e["plik"]))), SZER_DOBOR)
            dop, _ = dobierz(mal, bib)
            out.append(dict(zestaw=nazwa, poziom=poz, plik=e["plik"], typ=e["typ_pojazdu"],
                            dop=[dict(id=d["id"], typ=d["typ"], wynik=round(d["wynik"], 4)) for d in dop]))
        print(f"{nazwa}/{poz}: {len(bad)} badanych, {len(wz)} wzorców", flush=True)
    json.dump(out, open(os.path.join(wyj, f"dobor_{nazwa}.json"), "w"), ensure_ascii=False)
    return out


def ocen(dop, miara, p):
    """(typ dobrany albo None = brak wzorca)."""
    if not dop:
        return None
    if p is not None and jakosc_doboru(dop)[miara] < p:
        return None
    typy = {d["typ"] for d in dop}
    sr = {t: np.mean([d["wynik"] for d in dop if d["typ"] == t]) for t in typy}
    return max(sr, key=sr.get)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zestaw", nargs=2, action="append", metavar=("NAZWA", "MANIFEST"), required=True)
    ap.add_argument("--wyj", required=True)
    ap.add_argument("--wybor-do", default=None, help="zapisz wybrany wariant 'miara:próg'")
    a = ap.parse_args()
    os.makedirs(a.wyj, exist_ok=True)
    R = []
    for n, m in a.zestaw:
        R += licz(n, m, a.wyj)
    bez = lambda r: [d for d in r["dop"] if d["typ"] != "cysterna"]
    # rozkłady miar
    for miara in ("maks", "sr"):
        c = [jakosc_doboru(bez(r))[miara] for r in R if r["typ"] == "cysterna"]
        o = [jakosc_doboru(bez(r))[miara] for r in R if r["typ"] != "cysterna"]
        print(f"ROZKŁAD {miara}: cysterny (bez wzorca) min {min(c):.3f} maks {max(c):.3f}; "
              f"pozostałe min {min(o):.3f} maks {max(o):.3f}; odstęp {min(o) - max(c):+.3f}")
    wiersze = []
    for miara in ("maks", "sr"):
        for p in [None] + [round(x, 2) for x in np.arange(0.30, 1.00, 0.01)]:
            w = dict(miara=miara, prog=p)
            for zest in sorted({r["zestaw"] for r in R}):
                rr = [r for r in R if r["zestaw"] == zest]
                cy = [r for r in rr if r["typ"] == "cysterna"]
                po = [r for r in rr if r["typ"] != "cysterna"]
                w[f"{zest}_cysterny_brak"] = (sum(ocen(bez(r), miara, p) is None for r in cy), len(cy))
                w[f"{zest}_pozostale_dobrane"] = (sum(ocen(bez(r), miara, p) == r["typ"] for r in po), len(po))
                # pełna biblioteka (z cysterną), bez sredni — porównanie z 79/80 (mini+maly+pelny)
                pe = [r for r in rr if r["poziom"] != "sredni"]
                w[f"{zest}_pelna_bib_dobrane"] = (sum(ocen(r["dop"], miara, p) == r["typ"] for r in pe), len(pe))
            wiersze.append(w)
    json.dump(wiersze, open(os.path.join(a.wyj, "siatka.json"), "w"), ensure_ascii=False, indent=0)
    zest = sorted({r["zestaw"] for r in R})
    def pkt(w):   # wszystkie błędy razem (cysterny niezłapane + pozostałe zgubione), na wszystkich zestawach
        return sum((w[f"{z}_cysterny_brak"][1] - w[f"{z}_cysterny_brak"][0]) +
                   (w[f"{z}_pozostale_dobrane"][1] - w[f"{z}_pozostale_dobrane"][0]) for z in zest)
    fmt = lambda w: " ".join(f"{k}={v[0]}/{v[1]}" for k, v in w.items() if isinstance(v, tuple))
    for miara in ("maks", "sr"):
        ws = [w for w in wiersze if w["miara"] == miara]
        print(f"WARIANT {miara} bez progu: {fmt(ws[0])}")
        naj = min(pkt(w) for w in ws[1:])
        dobre = [w for w in ws[1:] if pkt(w) == naj]
        lo, hi = dobre[0]["prog"], dobre[-1]["prog"]
        print(f"WARIANT {miara}: najmniej błędów {naj} dla progu {lo}…{hi}")
        for w in dobre[:1] + dobre[-1:] + [x for x in ws if x["prog"] in (round(lo - 0.05, 2), round(hi + 0.05, 2))]:
            print(f"  {miara} < {w['prog']}: {fmt(w)} (błędów {pkt(w)})")
    # wybór: miara z mniejszą liczbą błędów, potem szerszy przedział; próg = środek przedziału
    best = None
    for miara in ("maks", "sr"):
        ws = [w for w in wiersze if w["miara"] == miara and w["prog"] is not None]
        naj = min(pkt(w) for w in ws)
        d = [w["prog"] for w in ws if pkt(w) == naj]
        kl = (naj, -(d[-1] - d[0]))
        if best is None or kl < best[0]:
            best = (kl, miara, round((d[0] + d[-1]) / 2, 2))
    print(f"WYBRANY: {best[1]}:{best[2]}")
    if a.wybor_do:
        open(a.wybor_do, "w").write(f"{best[1]}:{best[2]}")


if __name__ == "__main__":
    main()
