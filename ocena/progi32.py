"""Zadanie 32: progi słów niski/średni/wysoki (P45 B, P49 A) dla metody v3 (zad. 20).
Wejście: wyniki.json + manifest (po zestawie). Siła miejsca = pole "wynik" (jak w src/przeswit/lista.py).
Czyste auto -> słowo = słowo jego NAJSILNIEJSZEGO miejsca (brak miejsc = „brak wskazań”).
Prawdziwa skrytka -> słowo najsilniejszego miejsca, które ją pokrywa (≥ POKRYCIE pola); brak = „nie wskazana”.
  python ocena/progi32.py --zestaw nazwa manifest wyniki [--zestaw ...] --konf NAZWA --warianty "A:0.6,0.3;B:0.9,0.5"
"""
import argparse, json, sys
sys.path.insert(0, "ocena")
from ocena import pole, wspolne, POKRYCIE, MAX_POLE


def slowo(s, w, sr):
    return "wysoki" if s >= w else "średni" if s >= sr else "niski"


def zbierz(zestawy, konf):
    cz, sk, fm = [], [], []   # czyste: (zestaw, plik, maks siła|None, n miejsc); skrytki: (zestaw, plik, typ, siła|None); fałszywe miejsca na autach ze skrytkami
    for nazwa, man, wyn in zestawy:
        prawda = {e["plik"]: e for e in man["badane"]}
        for r in wyn["wyniki"]:
            e = prawda.get(r["plik"])
            if e is None:
                continue
            ms = [m for m in r["konfiguracje"][konf]["miejsca"] if pole(m) <= MAX_POLE * r["szer"] * r["wys"]]
            if e["klasa"] == "czyste":
                cz.append((nazwa, r["plik"], max((m["wynik"] for m in ms), default=None), len(ms)))
            else:
                for d in e["dodatki"]:
                    p = [m["wynik"] for m in ms if wspolne(m, d) >= POKRYCIE * pole(d)]
                    sk.append((nazwa, r["plik"], d["typ"], max(p) if p else None))
                fm += [m["wynik"] for m in ms if not any(wspolne(m, d) > 0 for d in e["dodatki"])]
    return cz, sk, fm


def kw(q, f):
    s = sorted(q)
    return s[min(len(s) - 1, int(f * len(s)))] if s else None


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--zestaw", nargs=3, action="append", metavar=("NAZWA", "MANIFEST", "WYNIKI"), required=True)
    ap.add_argument("--konf", required=True)
    ap.add_argument("--warianty", default="")
    ap.add_argument("--wyj", default=None)
    a = ap.parse_args()
    zest = [(n, json.load(open(m)), json.load(open(w))) for n, m, w in a.zestaw]
    cz, sk, fm = zbierz(zest, a.konf)
    cm = sorted(c[2] for c in cz if c[2] is not None)
    sm = sorted(s[3] for s in sk if s[3] is not None)
    print(f"CZYSTE aut {len(cz)}, z miejscami {len(cm)}; maks. siły: min {kw(cm,0)} p25 {kw(cm,.25)} p50 {kw(cm,.5)} p75 {kw(cm,.75)} p90 {kw(cm,.9)} maks {cm[-1] if cm else None}")
    print(f"SKRYTKI {len(sk)}, wskazane {len(sm)}; siły: min {kw(sm,0)} p10 {kw(sm,.1)} p25 {kw(sm,.25)} p50 {kw(sm,.5)} p75 {kw(sm,.75)} maks {sm[-1] if sm else None}")
    print(f"MIEJSCA NA AUTACH ZE SKRYTKAMI NIE NA SKRYTCE: {len(fm)}; siły p50 {kw(fm,.5)} p90 {kw(fm,.9)}")
    for tp in sorted({s[2] for s in sk}):
        v = sorted(s[3] for s in sk if s[2] == tp and s[3] is not None)
        n = sum(1 for s in sk if s[2] == tp)
        print(f"  skrytka {tp}: {n}, wskazane {len(v)}, p25 {kw(v,.25)} p50 {kw(v,.5)}")
    wyn = []
    for w in [x for x in a.warianty.split(";") if x]:
        nm, pr = w.split(":"); hi, mid = map(float, pr.split(","))
        c = {"wysoki": 0, "średni": 0, "niski": 0, "brak wskazań": 0}
        for _, _, s, _ in cz:
            c["brak wskazań" if s is None else slowo(s, hi, mid)] += 1
        k = {"wysoki": 0, "średni": 0, "niski": 0, "nie wskazana": 0}
        for _, _, _, s in sk:
            k["nie wskazana" if s is None else slowo(s, hi, mid)] += 1
        f = {"wysoki": 0, "średni": 0, "niski": 0}
        for s in fm:
            f[slowo(s, hi, mid)] += 1
        pz = {}
        for n_, _, s, _ in cz:
            t = pz.setdefault(n_, {"wysoki": 0, "średni": 0, "niski": 0, "brak wskazań": 0})
            t["brak wskazań" if s is None else slowo(s, hi, mid)] += 1
        wyn.append(dict(wariant=nm, wysoki=hi, sredni=mid, czyste=c, czyste_wg_zestawu=pz, skrytki=k, falszywe_miejsca_na_autach_ze_skrytkami=f))
        print(f"WARIANT {nm} (wysoki≥{hi}, średni≥{mid}): czyste N={len(cz)} {c} | skrytki M={len(sk)} {k} | miejsca nie na skrytce {f}")
        print("   czyste wg zestawu:", pz)
    if a.wyj:
        json.dump(dict(czyste=len(cz), skrytki=len(sk), warianty=wyn), open(a.wyj, "w"), ensure_ascii=False, indent=1)
