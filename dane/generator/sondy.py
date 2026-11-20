"""Sondy Z1, Z2, Z5, Z8, Z13 z wyniki.json Programisty (bez zmian metody). Użycie: sondy.py KATALOG_WYNIKOW DANE_ZWYKLE DANE_TRUDNE"""
import json, os, sys, statistics as st
sys.path.insert(0, "ocena")
from ocena import pole, wspolne, POKRYCIE, MAX_POLE

W, DZ, DT = sys.argv[1:4]

def wczyt(nazwa, dane):
    man = json.load(open(os.path.join(dane, "manifest.json")))
    wyn = json.load(open(os.path.join(W, nazwa, "wyniki.json")))
    prawda = {e["plik"]: e for e in man["badane"]}
    out = []
    for r in wyn["wyniki"]:
        e = prawda.get(r["plik"])
        if e is None: continue
        konf = list(r["konfiguracje"])[0]
        k = r["konfiguracje"][konf]
        mi = [m for m in k["miejsca"] if pole(m) <= MAX_POLE * r["szer"] * r["wys"]]
        out.append((r, e, k, mi))
    return out

def trafia(m, d): return wspolne(m, d) >= POKRYCIE * pole(d)

def przeoczenia(rows):
    tot = {}
    for r, e, k, mi in rows:
        if e["klasa"] != "dodatki": continue
        for d in e["dodatki"]:
            t = tot.setdefault(d["typ"], [0, 0]); t[1] += 1
            if not any(trafia(m, d) for m in mi): t[0] += 1
    return tot

def ramki(rows):
    n = [len(k["miejsca"]) for r, e, k, mi in rows if e["klasa"] == "czyste"]
    return n

def poz(rows):
    P = []
    for r, e, k, mi in rows:
        if e["klasa"] != "dodatki": continue
        p = next((i + 1 for i, m in enumerate(k["miejsca"]) if pole(m) <= MAX_POLE * r["szer"] * r["wys"] and any(trafia(m, d) for d in e["dodatki"])), None)
        P.append(p)
    return P

mini = wczyt("mini", DZ)
t = przeoczenia(mini); Y = sum(v[0] for v in t.values()); M = sum(v[1] for v in t.values())
print(f"Z1 mini: przeoczenia {Y}/{M} ({100*Y/M:.0f}%), po rodzaju dodatku {t}")
n = ramki(mini)
print(f"Z2 mini czyste n={len(n)}: srednia {st.mean(n):.1f}, mediana {st.median(n)}, maks {max(n)}, <=3: {sum(x<=3 for x in n)}/{len(n)}, <=6: {sum(x<=6 for x in n)}/{len(n)}")
for nm in ("maly", "trudny_mini", "trudny_maly"):
    try:
        rows = wczyt(nm, DT if nm.startswith("trudny") else DZ)
    except FileNotFoundError: continue
    n = ramki(rows)
    print(f"Z2 {nm} czyste n={len(n)}: srednia {st.mean(n):.1f}, mediana {st.median(n)}, maks {max(n)}, <=3: {sum(x<=3 for x in n)}/{len(n)}, <=6: {sum(x<=6 for x in n)}/{len(n)}")
    tt = przeoczenia(rows); print(f"   przeoczenia po rodzaju dodatku {tt}")
for nm, dane in (("mini", DZ), ("maly", DZ), ("trudny_mini", DT), ("trudny_maly", DT)):
    try: rows = wczyt(nm, dane)
    except FileNotFoundError: continue
    P = poz(rows); ok = [p for p in P if p]
    print(f"Z8 {nm}: obrazow z dodatkami {len(P)}, bez trafienia {P.count(None)}, w pierwszych 3: {sum(p<=3 for p in ok)}/{len(P)}, w pierwszych 6: {sum(p<=6 for p in ok)}/{len(P)}, mediana pozycji {st.median(ok) if ok else None}")
# Z13: dobor — poprawny rodzaj wsrod dwoch najblizszych wzorcow (z doboru top5 dla obrazow ze zlym doborem)
for nm, dane in (("mini", DZ), ("maly", DZ), ("trudny_mini", DT), ("trudny_maly", DT)):
    try: rows = wczyt(nm, dane)
    except FileNotFoundError: continue
    zle = [(r, e, k) for r, e, k, mi in rows if k["typ_wybrany"] != e["typ_pojazdu"]]
    def dwa(r):
        ts = []
        for d in r["dobor"]:
            if d["typ"] not in ts: ts.append(d["typ"])
            if len(ts) == 2: break
        return ts
    w2 = sum(e["typ_pojazdu"] in dwa(r) for r, e, k in zle)
    print(f"Z3 {nm}: trafny rodzaj {len(rows)-len(zle)}/{len(rows)}; Z13: zly dobor {len(zle)}, poprawny w dwoch najblizszych {w2}/{len(zle)}")
# Z5: wymuszony zly rodzaj vs poprawny (maly zwykly)
base = {r["plik"]: (e, k, mi) for r, e, k, mi in wczyt("maly", DZ)}
S = {"X": [0, 0], "Y": [0, 0], "fr": [0, 0], "n": 0}
fr_zle = []; fr_ok = []; YZ = MZ = YO = MO = 0
for typ in ("firanka", "chlodnia", "kontener", "cysterna"):
    try: rows = wczyt("maly_typ_" + typ, DZ)
    except FileNotFoundError: continue
    for r, e, k, mi in rows:
        if e["typ_pojazdu"] == typ: continue  # tylko wymuszony ZLY rodzaj
        b = base[r["plik"]]
        if e["klasa"] == "czyste":
            fr_zle.append(len(k["miejsca"])); fr_ok.append(len(b[1]["miejsca"]))
        else:
            for d in e["dodatki"]:
                MZ += 1; YZ += not any(trafia(m, d) for m in mi)
                MO += 1; YO += not any(trafia(m, d) for m in b[2])
if fr_zle:
    print(f"Z5 maly: czyste ze zlym rodzajem n={len(fr_zle)}: ramki srednio {st.mean(fr_zle):.1f} -> po poprawnym (dobor automatyczny) {st.mean(fr_ok):.1f} (spadek {100*(1-st.mean(fr_ok)/max(st.mean(fr_zle),1e-9)):.0f}%); przeoczenia zly rodzaj {YZ}/{MZ}, poprawny {YO}/{MO}")
# Z6: czyste wg rodzaju trudnosci (mini+maly trudnego zbioru)
for nm in ("trudny_mini", "trudny_maly"):
    rows = wczyt(nm, DT)
    for tr in ("egzemplarz", "ladunek_legalny"):
        n = [len(k["miejsca"]) for r, e, k, mi in rows if e["klasa"] == "czyste" and e.get("trudnosc") == tr]
        if n: print(f"Z6 {nm} {tr}: n={len(n)} ramki srednio {st.mean(n):.1f}, mediana {st.median(n)}, maks {max(n)}, z >=1 ramka {sum(x>=1 for x in n)}/{len(n)}, <=6 ramek {sum(x<=6 for x in n)}/{len(n)}")
