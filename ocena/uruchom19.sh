#!/bin/sh
# Zadanie 19: jeden przebieg na karcie — siatka hipotez v2 na obu zestawach, wybór, potem pomiar czasu na 50 MB
# dla wybranej konfiguracji (jedna konfiguracja = prawdziwy czas na obraz).
# Hipotezy: H1 tolerancja wzdłuż pojazdu (tolx 2 vs 6 ‰ szerokości) — różnice egzemplarza (słupki, skala);
# H2 trend kolumnowy (0/1) — gradient jasności skanu; H3 próg bezwzględny tau (0.10/0.16) i względny rho (0.1/0.2);
# H4 odsiew konstrukcji (konstr 0/1); H5 maska ładunku z szukaniem w środku (lad 0 / 0.12 / 0.2);
# H6 odsiew małych plam (min_pole 0.0001 / 0.0003).
DANE=${DANE:-$HOME/dane/proba17}
TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}
WYJ=${WYJ:-wyniki/v2}
SIATKA=${SIATKA:-"trend=0,1;tolx=2,6;tau=0.10,0.16;rho=0.1,0.2;konstr=0,1;lad=0,0.12,0.2;min_pole=0.0001,0.0003"}
export PYTHONPATH=src
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
w() { n=$1; d=$2; shift 2; python -m przeswit.wykryj --metoda v2 --szer-rob 2048 --biblioteka "$d" --manifest "$d/manifest.json" --wyj $WYJ/$n --bez-png "$@" | tail -1; }
for p in mini maly; do w $p "$DANE" --poziom $p --siatka "$SIATKA"; w trudny_$p "$TRUDNE" --poziom $p --siatka "$SIATKA"; done
w pelny "$DANE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
w trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
python ocena/wybor.py --najlepsze 8 --nazwa-do $WYJ/najlepsza.txt \
  --zestaw zwykly "$DANE/manifest.json" $WYJ/mini/wyniki.json $WYJ/maly/wyniki.json $WYJ/pelny/wyniki.json \
  --zestaw trudny "$TRUDNE/manifest.json" $WYJ/trudny_mini/wyniki.json $WYJ/trudny_maly/wyniki.json $WYJ/trudny_pelny/wyniki.json
B=$(cat $WYJ/najlepsza.txt | tr ',' ';'); echo "NAJLEPSZA: $B"
w czas_pelny "$DANE" --poziom pelny --poziom-wzorcow maly --siatka "$B" --raport "$(cat $WYJ/najlepsza.txt)"
w czas_trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly --siatka "$B"
python - <<PY
import json
for n in ("czas_pelny", "czas_trudny_pelny"):
    t = [r["czas_s"] for r in json.load(open("$WYJ/%s/wyniki.json" % n))["wyniki"]]
    print(f"CZAS 50 MB [{n}] śr. {sum(t)/len(t):.2f} s, maks. {max(t):.2f} s, n={len(t)}")
PY
