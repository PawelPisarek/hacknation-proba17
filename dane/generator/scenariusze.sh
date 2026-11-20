#!/bin/sh
# Zadanie 31 na flocie: generowanie + pomiar (metoda v2) — czyste auta do P49, dane/mini (z manifestu), mini-trudny, plik 50 MB.
PZ=${PZ:-$HOME/dane/scenariusze}; export PYTHONPATH=src
python dane/generator/scenariusze.py --wyj dane/scenariusze --poza $PZ || exit 1
S="dobor=najblizszy;K=3;tol=4;prog=6,10,14;min_pole=0.0001"
mkdir -p wynik31
# badane z manifestu dane/mini (16) + 20 czystych_p49 + 16 z mini-trudny
python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wynik31/mini --bez-png --metoda v2 --siatka "$S" \
  --badane $PZ/czyste_p49/*.bmp dane/mini-trudny/trudny_mini_*.bmp | tail -2
# plik 50 MB (A12): czas i pamięć
/usr/bin/time -v python -m przeswit.wykryj --biblioteka dane/mini --manifest dane/mini/manifest.json --wyj wynik31/duzy --bez-png --metoda v2 \
  --siatka "dobor=najblizszy;K=3;tol=4;prog=10;min_pole=0.0001" --poziom nic --badane $PZ/duzy/*.bmp 2>&1 | grep -E "badany_pelny|Maximum resident|Elapsed"
echo "=== pliki"; cat dane/scenariusze/manifest-pliki.json | head -5
