#!/bin/sh
# Zadanie 36: przeoczenia v3 po przeniesieniu progu „brak wzorca” (zadanie 33) — ta sama konfiguracja i zestawy co zadanie 20
# (pełna biblioteka, poziomy mini/maly/pelny). Hipotezy: H7 próg nie odcina aut z wzorcem (przeoczenia 7,8% / 9,7% bez zmian);
# H8 przy pełnej bibliotece żadne auto nie dostaje „brak wzorca” (dobór 64/64 i 80/80 jak w zadaniu 20).
DANE=${DANE:-$HOME/dane/proba17}
TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}
WYJ=${WYJ:-wyniki/zad36}
KONF="trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
set -e
export PYTHONPATH=src
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
w() { n=$1; d=$2; shift 2
  python -m przeswit.wykryj --metoda v3 --szer-rob 2048 --biblioteka "$d" --manifest "$d/manifest.json" --wyj $WYJ/$n --bez-png --siatka "$KONF" "$@" | tail -1; }
for p in mini maly; do w $p "$DANE" --poziom $p; w trudny_$p "$TRUDNE" --poziom $p; done
w pelny "$DANE" --poziom pelny --poziom-wzorcow maly
w trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly
python ocena/wybor.py --najlepsze 1 \
  --zestaw zwykly "$DANE/manifest.json" $WYJ/mini/wyniki.json $WYJ/maly/wyniki.json $WYJ/pelny/wyniki.json \
  --zestaw trudny "$TRUDNE/manifest.json" $WYJ/trudny_mini/wyniki.json $WYJ/trudny_maly/wyniki.json $WYJ/trudny_pelny/wyniki.json
python - <<PY
import json, glob
for f in sorted(glob.glob("$WYJ/*/wyniki.json")):
    w = json.load(open(f))["wyniki"]
    print("BRAK_WZORCA", f, sum(1 for r in w if r.get("brak_wzorca")), "/", len(w))
PY
