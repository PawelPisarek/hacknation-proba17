#!/bin/sh
# Sondy Z1,Z2,Z3,Z5,Z8,Z13 — jeden przebieg na karcie OMENa; metoda Programisty bez zmian.
DANE=${DANE:-$HOME/dane/proba17}; TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}; W=${W:-wyniki_sondy}
export PYTHONPATH=src
S="dobor=najblizszy;K=3;tol=2;prog=14;min_pole=0.0005"
nvidia-smi --query-gpu=name,memory.used --format=csv,noheader
r() { n=$1; d=$2; shift 2; python -m przeswit.wykryj --biblioteka "$d" --manifest "$d/manifest.json" --wyj $W/$n --bez-png --siatka "$S" "$@" | tail -1; }
r mini "$DANE" --poziom mini
r maly "$DANE" --poziom maly
r trudny_mini "$TRUDNE" --poziom mini
r trudny_maly "$TRUDNE" --poziom maly
for t in firanka chlodnia kontener cysterna; do r maly_typ_$t "$DANE" --poziom maly --typ $t; done
python dane/generator/sondy.py $W "$DANE" "$TRUDNE"
python dane/generator/lupa.py "$DANE" docs/zrzuty
# Z9: czas i szczyt pamieci na obrazach pelnych (zwykly zbior), jedna konfiguracja
/usr/bin/time -v python -m przeswit.wykryj --biblioteka "$DANE" --manifest "$DANE/manifest.json" --wyj $W/pelny --bez-png --siatka "$S" --poziom pelny --poziom-wzorcow maly 2>&1 | grep -E "Maximum resident|Elapsed|zapisano"
