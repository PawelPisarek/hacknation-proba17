"""Wybór konfiguracji (zadanie 19) na podstawie ocena.ocen (zasada trafienia bez zmian).

  python ocena/wybor.py --zestaw zwykly dane/manifest.json wyniki/v2/maly/wyniki.json ... \
                        --zestaw trudny dane/manifest-trudny.json wyniki/v2/trudny_maly/wyniki.json ...
Kolejność: przeoczenia ≤ --max-fn na każdym zestawie (P4, P31), potem najmniej ramek na czystym (śr.), potem FP.
Ramki na czystym = liczba wskazanych miejsc na obrazie czystym (P30: ≤ 6).
"""
import argparse, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ocena import ocen  # noqa: E402


def ramki(man, wyn, konf):
    czyste = {e["plik"] for e in man["badane"] if e["klasa"] == "czyste"}
    n = [len(r["konfiguracje"][konf]["miejsca"]) for r in wyn["wyniki"] if r["plik"] in czyste]
    return (sum(n) / max(1, len(n)), max(n or [0]))


def czas_pelny(wyn):
    t = [r["czas_s"] for r in wyn["wyniki"] if r["szer"] * r["wys"] >= 8192 * 2048]
    return (sum(t) / len(t), max(t)) if t else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zestaw", nargs="+", action="append", required=True, help="nazwa manifest wyniki.json...")
    ap.add_argument("--max-fn", type=float, default=0.10)
    ap.add_argument("--najlepsze", type=int, default=5)
    ap.add_argument("--nazwa-do", help="zapisz nazwę najlepszej konfiguracji do pliku")
    a = ap.parse_args()
    zest = []
    for z in a.zestaw:
        man = json.load(open(z[1]))
        ws = [json.load(open(p)) for p in z[2:]]
        zest.append((z[0], man, ws, dict(konfiguracje=ws[0]["konfiguracje"], wyniki=[r for w in ws for r in w["wyniki"]])))
    konfy = [k for k in zest[0][3]["konfiguracje"] if all(k in z[3]["konfiguracje"] for z in zest)]
    wiersze = []
    for k in konfy:
        per = []
        for nazwa, man, ws, wyn in zest:
            r = ocen(man, wyn, k)
            r["ramki"] = ramki(man, wyn, k)
            r["nazwa"] = nazwa
            per.append(r)
        fn = max(r["Y"] / max(1, r["M"]) for r in per)
        wiersze.append((fn > a.max_fn, sum(r["ramki"][0] for r in per), sum(r["X"] for r in per), fn, k, per))
    wiersze.sort(key=lambda w: (w[0], w[1] if not w[0] else w[3], w[2]))
    for ok, rs, fp, fn, k, per in wiersze[: a.najlepsze]:
        print(f"KONF {k}  {'(przeoczenia > próg)' if ok else ''}")
        for r in per:
            tr = "; ".join(f"{t[1]} {v[0]}/{v[1]}" for t, v in sorted(r["trudnosci"].items(), key=str) if t[0] == "przeoczenia" and t[1])
            tfp = "; ".join(f"{t[1]} {v[0]}/{v[1]}" for t, v in sorted(r["trudnosci"].items(), key=str) if t[0] != "przeoczenia" and t[1])
            print(f"  {r['nazwa']}: fałszywe alarmy {r['X']}/{r['N']}" + (f" ({tfp})" if tfp else "") +
                  f", ramki na czystym śr. {r['ramki'][0]:.1f} / maks. {r['ramki'][1]}, przeoczenia {r['Y']}/{r['M']}" +
                  (f" ({tr})" if tr else "") + f", dobór wzorca {r['typ_ok']}/{r['n']}")
    if a.nazwa_do:
        open(a.nazwa_do, "w").write(wiersze[0][4])


if __name__ == "__main__":
    main()
