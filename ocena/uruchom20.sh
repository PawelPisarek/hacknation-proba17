#!/bin/sh
# Zadanie 20: jeden przebieg na karcie — siatka hipotez v3 na obu zestawach, wybór, potem pomiar czasu na 50 MB
# dla wybranej konfiguracji (jedna konfiguracja = prawdziwy czas na obraz).
# Hipotezy (docs/decyzje.md, zad. 20): H1 lok (lokalne przesunięcie per kafel 0/2), H2 wyb (wzorzec per kafel 0/1),
# H3 jas (jasność per kafel 0/1), H4 progi pasów tau_pud/tau_pod/tau_kab, H5 scal (scalanie ramek 0/0.01).
# GOTOWE=<katalog>: kroki policzone w przerwanym przebiegu są brane stamtąd; w kroku wznawiane są pojedyncze obrazy.
# Najpierw próba dymna (mini, 2 konfiguracje) — błąd kodu kończy przebieg od razu.
DANE=${DANE:-$HOME/dane/proba17}
TRUDNE=${TRUDNE:-$HOME/dane/proba17-trudny}
WYJ=${WYJ:-$HOME/wyniki-zad20}   # stały katalog na OMENie: kolejne zgłoszenia po wywłaszczeniu wznawiają (--wznow)
SIATKA=${SIATKA:-"trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=0,2;jas=0,1;wyb=0,1;tau_pud=0.06,0.08;tau_pod=0.12,0.2;tau_kab=0.1,0.2;scal=0,0.01"}
set -e
export PYTHONPATH=src
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader
w() { n=$1; d=$2; shift 2
  if [ -n "$GOTOWE" ] && [ -s "$GOTOWE/$n/wyniki.json" ] && [ ! -s "$WYJ/$n/wyniki.json" ]; then mkdir -p $WYJ/$n; cp "$GOTOWE/$n/wyniki.json" $WYJ/$n/; fi
  if [ -s "$WYJ/$n/wyniki.json" ]; then echo "pomijam $n (już policzone)"; return; fi
  python -m przeswit.wykryj --metoda v3 --szer-rob 2048 --biblioteka "$d" --manifest "$d/manifest.json" --wyj $WYJ/$n --bez-png --wznow "$@" | tail -1; }
w dym "$DANE" --poziom mini --siatka "trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=0,1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
test -s $WYJ/dym/wyniki.json || { echo "BŁĄD: próba dymna nie zapisała wyników"; exit 3; }
for p in mini maly; do w $p "$DANE" --poziom $p --siatka "$SIATKA"; w trudny_$p "$TRUDNE" --poziom $p --siatka "$SIATKA"; done
w pelny "$DANE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
w trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly --siatka "$SIATKA"
python ocena/wybor.py --najlepsze 8 --nazwa-do $WYJ/najlepsza.txt \
  --zestaw zwykly "$DANE/manifest.json" $WYJ/mini/wyniki.json $WYJ/maly/wyniki.json $WYJ/pelny/wyniki.json \
  --zestaw trudny "$TRUDNE/manifest.json" $WYJ/trudny_mini/wyniki.json $WYJ/trudny_maly/wyniki.json $WYJ/trudny_pelny/wyniki.json
B=$(cat $WYJ/najlepsza.txt | tr ',' ';'); echo "NAJLEPSZA: $B"
rm -rf $WYJ/czas_pelny $WYJ/czas_trudny_pelny   # czas zawsze z jednego, nieprzerwanego przebiegu
w czas_pelny "$DANE" --poziom pelny --poziom-wzorcow maly --siatka "$B" --raport "$(cat $WYJ/najlepsza.txt)"
w czas_trudny_pelny "$TRUDNE" --poziom pelny --poziom-wzorcow maly --siatka "$B"
python - <<PY
import json
for n in ("czas_pelny", "czas_trudny_pelny"):
    t = [r["czas_s"] for r in json.load(open("$WYJ/%s/wyniki.json" % n))["wyniki"]]
    print(f"CZAS 50 MB [{n}] śr. {sum(t)/len(t):.2f} s, maks. {max(t):.2f} s, n={len(t)}")
PY
