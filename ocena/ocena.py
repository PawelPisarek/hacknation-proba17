"""Ocena wg docs/zadanie.md §6 (+P2: trafność doboru typu, P4: przeoczenie gorsze niż fałszywy alarm).

  python ocena/ocena.py --manifest dane/mini/manifest.json --wyniki wyniki/mini/wyniki.json

Dla każdej konfiguracji z wyniki.json:
- fałszywe alarmy X/N: obrazy czyste (N), na których wskazano ≥1 miejsce;
- przeoczenia Y/M: dodatki z manifestu (M), których żadne wskazane miejsce nie pokrywa;
  trafienie = miejsce pokrywa ≥ POKRYCIE pola dodatku i samo ma ≤ MAX_POLE pola obrazu (bez „zaznacz wszystko”);
- dodatkowo: fałszywe miejsca na obrazach z dodatkami (nie pokrywają żadnego dodatku), trafność doboru typu, czas na obraz.
Kolejność: najpierw najmniej przeoczeń (P4), potem najmniej fałszywych alarmów.
"""
import argparse, json, sys

POKRYCIE = 0.3
MAX_POLE = 0.25


def pole(b):
    return max(0, b["x1"] - b["x0"]) * max(0, b["y1"] - b["y0"])


def wspolne(a, b):
    return max(0, min(a["x1"], b["x1"]) - max(a["x0"], b["x0"])) * max(0, min(a["y1"], b["y1"]) - max(a["y0"], b["y0"]))


def ocen(man, wyn, konf, typ=None):
    prawda = {e["plik"]: e for e in man["badane"] if typ is None or e["typ_pojazdu"] == typ}
    N = M = X = Y = fm = typ_ok = n = przybl = 0
    czasy, przeoczone, alarmy = [], [], []
    tr = {}  # rodzaj trudności -> [X, N] (czyste) albo [Y, M] (dodatki)
    for r in wyn["wyniki"]:
        e = prawda.get(r["plik"])
        if e is None:
            continue
        k = r["konfiguracje"][konf]
        miejsca = [m for m in k["miejsca"] if pole(m) <= MAX_POLE * r["szer"] * r["wys"]]
        n += 1
        typ_ok += k["typ_wybrany"] == e["typ_pojazdu"]
        przybl += "uwaga" in k
        czasy.append(r["czas_s"])
        if e["klasa"] == "czyste":
            N += 1
            t = tr.setdefault(("fałszywe alarmy", e.get("trudnosc")), [0, 0]); t[1] += 1
            if k["miejsca"]:
                X += 1
                t[0] += 1
                alarmy.append(r["plik"])
        else:
            for d in e["dodatki"]:
                M += 1
                t = tr.setdefault(("przeoczenia", e.get("trudnosc")), [0, 0]); t[1] += 1
                if not any(wspolne(m, d) >= POKRYCIE * pole(d) for m in miejsca):
                    Y += 1
                    t[0] += 1
                    przeoczone.append(f"{r['plik']}:{d['typ']}")
            fm += sum(not any(wspolne(m, d) > 0 for d in e["dodatki"]) for m in miejsca)
    return dict(konf=konf, X=X, N=N, Y=Y, M=M, falszywe_miejsca=fm, typ_ok=typ_ok, n=n, przybl=przybl, trudnosci=tr,
                czas_sr=sum(czasy) / max(1, len(czasy)), czas_max=max(czasy or [0]),
                przeoczone=przeoczone, alarmy=alarmy)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--wyniki", required=True, nargs="+", help="jeden lub kilka wyniki.json")
    ap.add_argument("--typ", help="licz tylko badane tego rodzaju pojazdu")
    ap.add_argument("--najlepsze", type=int, default=0, help="pokaż tylko n najlepszych konfiguracji")
    ap.add_argument("--szczegoly", action="store_true")
    a = ap.parse_args()
    man = json.load(open(a.manifest))
    rows = []
    for p in a.wyniki:
        wyn = json.load(open(p))
        for k in wyn["konfiguracje"]:
            r = ocen(man, wyn, k, a.typ)
            r["zrodlo"] = p
            rows.append(r)
    rows.sort(key=lambda r: (r["Y"], r["X"], r["falszywe_miejsca"]))
    for r in rows[: a.najlepsze or None]:
        print(f"WYNIK [{r['konf']}] fałszywe alarmy {r['X']}/{r['N']}, przeoczenia {r['Y']}/{r['M']}, "
              f"fałszywe miejsca na obrazach z dodatkami {r['falszywe_miejsca']}, "
              f"dobór typu {r['typ_ok']}/{r['n']}" + (f" (wzorzec przybliżony {r['przybl']})" if r["przybl"] else "") + f", czas na obraz śr. {r['czas_sr']:.2f} s (maks. {r['czas_max']:.2f} s)"
              f"  <{r['zrodlo']}>")
        if any(k[1] for k in r["trudnosci"]):
            print("   wg rodzaju trudności: " + "; ".join(f"{k[0]} [{k[1]}] {v[0]}/{v[1]}" for k, v in sorted(r["trudnosci"].items(), key=str)))
        if a.szczegoly:
            print("   przeoczone:", ", ".join(r["przeoczone"]) or "—")
            print("   alarmy na czystych:", ", ".join(r["alarmy"]) or "—")


if __name__ == "__main__":
    main()
