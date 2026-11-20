#!/bin/sh
# Zadania 23 + 33 — jeden przebieg na karcie (hipotezy H1–H4 w docs/decyzje.md):
# 1) zad. 33: korelacje doboru na zwykłym i trudnym zbiorze (wszystkie poziomy), siatka progu jakości doboru (maks / sr);
# 2) zad. 23: v2 (konf. z zadania 19) na dane/mini i dane/mini-trudny, biblioteka bez cysterny, wybrany próg doboru;
# 3) testy A2–A4 (testy/test_lista.py) na tych wynikach + rozkład siły miejsc (do progów słów, P49).
set -e
DANE=${DANE:-$HOME/dane/proba17}
TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}
WYJ=${WYJ:-wyniki/z23_33}
KONF="trend=1;tolx=2;tau=0.1;rho=0.1;konstr=1;lad=0;min_pole=0.0001"
export PYTHONPATH=src
mkdir -p $WYJ
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
[ -f "$DANE/manifest.json" ] || python dane/generator/generuj.py --wyj "$DANE" --ziarno 17 --spec mini:3:2:2,maly:8:5:5,sredni:3:3:3,pelny:1:1:1
[ -f "$TRUDNE/manifest.json" ] || python dane/generator/generuj_trudny.py --wyj "$TRUDNE" --ziarno 17 --spec mini:2:1:1:1:1,maly:4:3:3:3:3,sredni:2:2:2:2:2,pelny:1:1:1:1:1
python ocena/dobor33.py --zestaw zwykly "$DANE/manifest.json" --zestaw trudny "$TRUDNE/manifest.json" --wyj $WYJ --wybor-do $WYJ/prog.txt
P=$(cat $WYJ/prog.txt)
for z in mini mini-trudny; do
  python -m przeswit.wykryj --metoda v2 --szer-rob 2048 --biblioteka dane/$z --manifest dane/$z/manifest.json \
    --bez-typu cysterna --prog-doboru "$P" --siatka "$KONF" --wyj $WYJ/$z --bez-png | tail -1
done
WYNIKI="$WYJ/mini/wyniki.json:dane/mini/manifest.json,$WYJ/mini-trudny/wyniki.json:dane/mini-trudny/manifest.json" \
  python -m unittest testy.test_lista -v 2>&1 | tail -25
python - <<PY
import json
for z in ("mini", "mini-trudny"):
    s = sorted(m["wynik"] for r in json.load(open("$WYJ/%s/wyniki.json" % z))["wyniki"]
               for k in r["konfiguracje"].values() for m in k["miejsca"])
    q = lambda f: s[min(len(s) - 1, int(f * len(s)))] if s else None
    print(f"SIŁA MIEJSC [{z}] n={len(s)} min {q(0)} p25 {q(.25)} p50 {q(.5)} p75 {q(.75)} maks {s[-1] if s else None}")
PY
