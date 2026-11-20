#!/bin/sh
# Wynik bazowy + ocena na karcie OMENa (zadanie 02). Zbiory: $DANE (zwykły) i $TRUDNE (trudny), każdy z manifest.json.
# Siatka hipotez w jednym przejściu: H1 K wzorców typu (3 vs 8), H2 tolerancja przesunięć (2 vs 4 px), H3 próg (6/10/14 σ),
# H4 dobór typu (najbliższy wzorzec vs średnia typu), H5 szer. robocza 1024 vs 2048 (obrazy 50 MB), P16 brak rodzaju.
# Po każdym kroku od razu ocena — przerwanie przez Slurm nie kasuje wyników wcześniejszych kroków.
DANE=${DANE:-$HOME/dane/proba17}
TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}
WYJ=${WYJ:-wyniki}
SIATKA=${SIATKA:-"dobor=najblizszy,srednia_typu;K=3,8;tol=2,4;prog=6,10,14;min_pole=0.0005"}
N=${N:-6}
export PYTHONPATH=src
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
krok() {  # krok NAZWA KATALOG [argumenty wykryj]
  n=$1; d=$2; shift 2
  python -m przeswit.wykryj --biblioteka "$d" --manifest "$d/manifest.json" --wyj $WYJ/$n --bez-png "$@" | tail -1
  echo "=== $n"; python ocena/ocena.py --manifest "$d/manifest.json" --wyniki $WYJ/$n/wyniki.json --najlepsze $N
}
krok maly "$DANE" --poziom maly --siatka "$SIATKA"
krok pelny "$DANE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
krok mini "$DANE" --poziom mini --siatka "$SIATKA"
krok trudny_maly "$TRUDNE" --poziom maly --siatka "$SIATKA"
krok trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
krok trudny_mini "$TRUDNE" --poziom mini --siatka "$SIATKA"
krok pelny2048 "$DANE" --poziom pelny --poziom-wzorcow maly --szer-rob 2048 --siatka "dobor=najblizszy;K=8;tol=2,4;prog=10,14;min_pole=0.0005"
krok maly_bez_cysterny "$DANE" --poziom maly --bez-typu cysterna --siatka "dobor=najblizszy;K=8;tol=4;prog=10;min_pole=0.0005"
python ocena/ocena.py --manifest "$DANE/manifest.json" --wyniki $WYJ/maly_bez_cysterny/wyniki.json --typ cysterna
