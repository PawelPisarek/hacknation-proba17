"""Niezależna kontrola A4 (bez test_lista): każda cysterna w wynikach v3 (biblioteka bez cysterny) ma brak_wzorca i 0 miejsc; reszta ma wzorzec."""
import json, sys, os
def wczytaj(p):
    d = json.load(open(p))
    if isinstance(d, dict):
        d = d.get("obrazy", d.get("wyniki", list(d.values())))
    return d
tot = ok = 0; zle = []; inne_bw = 0
for zestaw in sys.argv[1:]:
    for r in wczytaj(os.path.join("wyniki/odbior", zestaw, "wyniki.json")):
        nazwa = str(r.get("plik") or r.get("obraz") or r.get("nazwa"))
        miejsca = r.get("miejsca") or r.get("ramki") or []
        if "cysterna" in nazwa:
            tot += 1
            if r.get("brak_wzorca") and len(miejsca) == 0: ok += 1
            else: zle.append((nazwa, r.get("brak_wzorca"), len(miejsca)))
        elif r.get("brak_wzorca"): inne_bw += 1
print(f"A4 niezależnie: cystern {tot}, z 'brak wzorca' i 0 ramek {ok}, błędne {zle}, 'brak wzorca' u innych typów {inne_bw}")
print("WYNIK A4:", f"{ok}/{tot}", "OK" if tot == 8 and ok == tot and inne_bw == 0 else "NIE")
sys.exit(0 if tot == 8 and ok == tot and inne_bw == 0 else 1)
