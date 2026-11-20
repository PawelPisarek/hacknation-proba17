#!/bin/sh
# Zadanie 25 — jeden przebieg na karcie, hipotezy (docs/decyzje.md):
# H1: zapis położenia wzorca nie zmienia wyniku — miejsca v2 identyczne z wyniki/z23_33 (mini, mini-trudny);
# H2: korekta ddx/ddy jest niezerowa — końcowe położenie różni się od doboru (512 px) o ≥ 1 px w części obrazów;
# H3: z pełną biblioteką (z cysterną) cysterna z dane/mini dostaje wzorzec — 4 rodzaje do zrzutu „wzorzec obok”.
set -e
WYJ=${WYJ:-wyniki/z25}
KONF="trend=1;tolx=2;tau=0.1;rho=0.1;konstr=1;lad=0;min_pole=0.0001"
P=$(cat wyniki/z23_33/prog.txt)
export PYTHONPATH=src
mkdir -p $WYJ
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
for z in mini mini-trudny; do
  python -m przeswit.wykryj --metoda v2 --szer-rob 2048 --biblioteka dane/$z --manifest dane/$z/manifest.json \
    --bez-typu cysterna --prog-doboru "$P" --siatka "$KONF" --wyj $WYJ/$z --bez-png | tail -1
done
python -m przeswit.wykryj --metoda v2 --szer-rob 2048 --biblioteka dane/mini --manifest dane/mini/manifest.json \
  --prog-doboru "$P" --siatka "$KONF" --wyj $WYJ/mini-pelna --bez-png | tail -1
python - <<PY
import json
def wcz(p): return {r["plik"]: r for r in json.load(open(p))["wyniki"]}
for z in ("mini", "mini-trudny"):
    a, b = wcz("wyniki/z23_33/%s/wyniki.json" % z), wcz("$WYJ/%s/wyniki.json" % z)
    rozne = [p for p in a if [k["miejsca"] for k in a[p]["konfiguracje"].values()] != [k["miejsca"] for k in b[p]["konfiguracje"].values()]
             or a[p].get("brak_wzorca") != b[p].get("brak_wzorca")]
    print(f"H1 [{z}] obrazów {len(a)}, różne miejsca/brak_wzorca: {len(rozne)} {rozne[:3]}")
    roz, n, bez = [], 0, 0
    for p, r in b.items():
        if r.get("brak_wzorca"): continue
        if not r.get("polozenie_wzorcow"): bez += 1; continue
        for q in r["polozenie_wzorcow"]:
            d = next(x for x in r["dobor"] + [] if x["id"] == q["id"]) if any(x["id"] == q["id"] for x in r["dobor"]) else None
            if d is None: continue
            f = r["szer"] / 512
            roz.append(max(abs(q["dx"] - d["dx"] * f), abs(q["dy"] - d["dy"] * f))); n += 1
    roz.sort()
    print(f"H2 [{z}] wzorców z położeniem {n}, bez pola {bez}; |końcowe − dobór| px: mediana {roz[len(roz)//2] if roz else None}, maks {roz[-1] if roz else None}, ≥1 px: {sum(x >= 1 for x in roz)}")
c = wcz("$WYJ/mini-pelna/wyniki.json")
for p, r in sorted(c.items()):
    if "cysterna" in p or "dodatki_00" in p:
        k = next(iter(r["konfiguracje"].values()))
        print(f"H3 {p}: brak_wzorca={r.get('brak_wzorca')} typ={k['typ_wybrany']} wzorce={k['wzorce'][:1]} miejsc={len(k['miejsca'])}")
PY
