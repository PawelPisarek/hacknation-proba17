#!/bin/sh
# Zadanie 31 na karcie/floty: generowanie + pomiar (metoda v2) czystych aut do P49, dobranych też dla partii pokazowej.
PZ=${PZ:-$HOME/dane/scenariusze}; export PYTHONPATH=src
python dane/generator/scenariusze.py --wyj dane/scenariusze --poza $PZ || exit 1
S="dobor=najblizszy;K=3;tol=4;prog=6,10,14;min_pole=0.0001"
mkdir -p wynik31
ls $PZ/czyste_p49/*.bmp > wynik31/czyste.txt
for f in dane/mini/badany_mini_*.bmp dane/mini-trudny/trudny_mini_*.bmp; do echo $f; done > wynik31/mini.txt
python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wynik31/czyste --bez-png --metoda v2 --siatka "$S" --badane $(cat wynik31/czyste.txt) | tail -2
python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wynik31/mini --bez-png --metoda v2 --siatka "$S" --badane $(cat wynik31/mini.txt) | tail -2
