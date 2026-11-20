#!/bin/sh
# Wynik bazowy + ocena na karcie OMENa (zadanie 02). Dane: $DANE (pełny zbiór z generatora, manifest.json).
# Jedno przejście = siatka hipotez: H1 K wzorców (1 vs 3), H2 tolerancja przesunięć (0 vs 2 px), H3 próg (5 vs 8 σ),
# H4 dobór typu (najbliższy wzorzec vs średnia typu), H5 szerokość robocza 1024 vs 2048 (obrazy 50 MB), P16 brak rodzaju.
DANE=${DANE:-$HOME/dane/proba17}
WYJ=${WYJ:-wyniki}
SIATKA="dobor=najblizszy,srednia_typu;K=1,3;tol=0,2;prog=5,8;min_pole=0.0002"
export PYTHONPATH=src
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
w() { python -m przeswit.wykryj --biblioteka "$DANE" --manifest "$DANE/manifest.json" "$@"; }
o() { python ocena/ocena.py --manifest "$DANE/manifest.json" "$@"; }
w --poziom mini --siatka "$SIATKA" --wyj $WYJ/mini --bez-png
w --poziom maly --siatka "$SIATKA" --wyj $WYJ/maly --bez-png
w --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA" --wyj $WYJ/pelny1024
w --poziom pelny --poziom-wzorcow maly --szer-rob 2048 --siatka "dobor=najblizszy;K=3;tol=2;prog=5,8;min_pole=0.0002" --wyj $WYJ/pelny2048 --bez-png
w --poziom maly --bez-typu cysterna --siatka "dobor=najblizszy;K=3;tol=2;prog=5,8;min_pole=0.0002" --wyj $WYJ/maly_bez_cysterny --bez-png
echo "=== mini (1024x256)"; o --wyniki $WYJ/mini/wyniki.json
echo "=== maly (2048x512)"; o --wyniki $WYJ/maly/wyniki.json
echo "=== pelny (8192x2048, 50 MB), szer. robocza 1024"; o --wyniki $WYJ/pelny1024/wyniki.json --szczegoly
echo "=== pelny, szer. robocza 2048"; o --wyniki $WYJ/pelny2048/wyniki.json
echo "=== P16: maly, biblioteka bez cysterny — tylko badane cysterny"; o --wyniki $WYJ/maly_bez_cysterny/wyniki.json --typ cysterna --szczegoly
