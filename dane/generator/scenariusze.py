#!/usr/bin/env python3
"""Zadanie 31: dane do scenariuszy z docs/pm/06-scenariusze.md (dummy-dataset). Deterministyczny; zależność: numpy.
Użycie: scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze
 w repo (--wyj): nieprawidlowy/ (plik tekstowy .bmp, ucięty BMP), manifest-pliki.json (sha256 plików poza repo)
 poza repo (--poza): czyste_p49/ (20 czystych aut mini, indeksy 02-06 na typ; 00-01 są w dane/mini), duzy/ (BMP 8192x2048 ~50 MB)
Obrazy z generuj.py: nazwa+ziarno 17 => te same bajty co w dane/proba17 (indeksy 00-01 identyczne z dane/mini; sprawdzane)."""
import argparse, hashlib, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generuj as G

def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--wyj", required=True)
    ap.add_argument("--poza", required=True)
    ap.add_argument("--mini", default="dane/mini")
    a = ap.parse_args()
    poza = os.path.expanduser(a.poza)
    ni, cz, du = (os.path.join(a.wyj, "nieprawidlowy"), os.path.join(poza, "czyste_p49"), os.path.join(poza, "duzy"))
    for d in (ni, cz, du):
        os.makedirs(d, exist_ok=True)
    # 1) pliki nieprawidłowe (S2b/E2)
    open(os.path.join(ni, "plik_tekstowy.bmp"), "w").write("To nie jest obraz. Plik tekstowy przemianowany na .bmp.\n")
    src = open(os.path.join(a.mini, "badany_mini_kontener_dodatki_00.bmp"), "rb").read()
    open(os.path.join(ni, "uciety.bmp"), "wb").write(src[: len(src) // 3])           # poprawny nagłówek, brak reszty pikseli
    open(os.path.join(ni, "pusty.bmp"), "wb").write(b"")
    # 2) czyste auta do progów P49 (5 na typ, indeksy 02-06)
    pliki = {}
    for typ in G.TYPY:
        for i in range(7):
            nazwa = f"badany_mini_{typ}_czyste_{i:02d}"
            tr = i % 3 == 2                                  # jak w generuj.py (--trudne-co 3)
            if i < 2:                                        # kontrola zgodności z dane/mini
                tmp = os.path.join(cz, "_kontrola"); os.makedirs(tmp, exist_ok=True)
                G.obraz(typ, nazwa, "mini", tr, "czyste", 17, tmp)
                assert sha(os.path.join(tmp, nazwa + ".bmp")) == sha(os.path.join(a.mini, nazwa + ".bmp")), nazwa
                os.remove(os.path.join(tmp, nazwa + ".bmp"))
                continue
            e = G.obraz(typ, nazwa, "mini", tr, "czyste", 17, cz)
            pliki[os.path.join("czyste_p49", e["plik"])] = dict(typ_pojazdu=typ, trudny=e["trudny"], bajty=e["bajty"],
                                                              sha256=sha(os.path.join(cz, e["plik"])))
    try: os.rmdir(os.path.join(cz, "_kontrola"))
    except OSError: pass
    # 3) obraz ~50 MB (A12/S12/S14)
    e = G.obraz("kontener", "badany_pelny_kontener_dodatki_00", "pelny", False, "dodatki", 17, du)
    pliki[os.path.join("duzy", e["plik"])] = dict(typ_pojazdu="kontener", szer=e["szer"], wys=e["wys"], bajty=e["bajty"],
                                                  dodatki=e["dodatki"], sha256=sha(os.path.join(du, e["plik"])))
    for p in sorted(os.listdir(ni)):
        pliki[os.path.join("nieprawidlowy", p)] = dict(bajty=os.path.getsize(os.path.join(ni, p)), sha256=sha(os.path.join(ni, p)))
    json.dump(dict(opis="pliki generowane przez dane/generator/scenariusze.py; czyste_p49/ i duzy/ leżą poza repo (--poza)",
                   poza_repo=poza, pliki=pliki), open(os.path.join(a.wyj, "manifest-pliki.json"), "w"), ensure_ascii=False, indent=1)
    print("WYNIK:", len(pliki), "plików; duży:", e["bajty"], "B; czyste_p49:", sum(k.startswith("czyste") for k in pliki))

if __name__ == "__main__":
    main()
