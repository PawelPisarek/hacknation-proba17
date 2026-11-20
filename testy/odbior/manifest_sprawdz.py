"""Zadanie 31: kontrola manifestu scenariuszy po zmianie składu (7 aut). Uruchamiać z korzenia repo; POZA = katalog z plikami poza repo."""
import json, os, sys, hashlib
POZA = os.environ.get("POZA", os.path.expanduser("~/dane/scenariusze"))
m = json.load(open("dane/scenariusze/manifest.json"))
bl = []
p = m["partia_pokazowa"]
if len(p) != 7: bl.append(f"partia {len(p)} aut, ma być 7")
if not p[-1]["plik"].endswith("trudny_mini_firanka_za_ladunkiem_00.bmp"): bl.append("7. auto nie jest za_ladunkiem")
sc = m["scenariusze"]
if len(sc) != 17: bl.append(f"scenariuszy {len(sc)}, ma być 17")
brak = 0
for k, s in sc.items():
    for f in s.get("pliki", []):
        if not (os.path.exists(f) or os.path.exists(os.path.join(POZA, os.path.relpath(f, "dane/scenariusze")) if f.startswith("dane/scenariusze") else "")) and not os.path.exists(f):
            brak += 1; bl.append(f"{k}: brak pliku {f}")
    if k == "S4" and len(set(s["pliki"])) != len(s["pliki"]): bl.append("S4 dubluje plik")
    if k == "S4" and not s["pliki"][0].endswith("cysterna_dodatki_00.bmp"): bl.append("S4 nie na cysternie")
print("scenariuszy:", len(sc), "partia:", len(p), "brakujących plików:", brak)
for b in bl[:20]: print("BRAK:", b)
print("WYNIK MANIFESTU:", "OK" if not bl else f"NIE ({len(bl)})")
sys.exit(1 if bl else 0)
