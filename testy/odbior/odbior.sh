#!/bin/sh
# Odbiór A1–A14 jednym poleceniem (zadanie 30). Uruchamiać na karcie OMENa (klasa gpu-tlo), z korzenia repo:
#   sh testy/odbior/odbior.sh
# Etap 1 (karta): wykryj v3 na partii pokazowej (dane/mini + dane/mini-trudny, biblioteka bez cysterny — S4),
#   na aucie z zerem miejsc (S3) i na obrazie 50 MB (S12). Konfiguracja v3 z zadania 20, bez zmian.
# Etap 2: testy/test_lista.py (A1–A4, P57 A, P58 A), testy/test_lupa.mjs (A1 lupa; jeśli jest node), testy/odbior/odbior.py (A1–A14 → odbior.md).
# Hipotezy (po jednej linii wyniku każda): H1 v3 na dane/mini daje listę zgodną z A1–A4 na wszystkich autach; H2 auto z zerem miejsc
#   (czyste_zero) daje „brak wskazań” bez przestawiania progu; H3 cysterna bez wzorca daje „brak wzorca” i zero ramek;
#   H4 obraz 50 MB < 1 min; H5 końcowe położenie wzorca jest w wynikach (lupa A1); H6 wykryj_v3 stosuje próg „brak wzorca” (zadanie 33).
set -e
export PYTHONPATH=src
WYJ=${WYJ:-wyniki/odbior}
DANE=${DANE:-$HOME/dane/proba17}
POZA=${POZA:-$HOME/dane/scenariusze}
KONF="trend=1;tolx=2;rho=0.1;konstr=1;min_pole=0.0001;lok=2;jas=1;wyb=1;tau_pud=0.08;tau_pod=0.2;tau_kab=0.2;scal=0.01"
mkdir -p "$WYJ"
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv,noheader 2>/dev/null || echo "UWAGA: brak karty (nvidia-smi)"
w() { n=$1; shift
  python -m przeswit.wykryj --metoda v3 --szer-rob 2048 --wyj "$WYJ/$n" --bez-png --siatka "$KONF" "$@" | tail -1; }
# S3 (A3): czyste auto z zerem miejsc — biblioteka pełna, jedno badane
Z="$WYJ/_zero"; rm -rf "$Z"; mkdir -p "$Z"
for f in dane/mini/wzorzec_*.bmp; do ln -s "$(pwd)/$f" "$Z/"; done
ln -s "$(pwd)/dane/scenariusze/czyste_zero/badany_mini_kontener_zero_00.bmp" "$Z/"
python testy/odbior/odbior.py manifest-zero --wej dane/mini/manifest.json --plik badany_mini_kontener_zero_00.bmp --wyj "$Z/manifest.json"
# S4/S1/S2/S5…: partia pokazowa, biblioteka bez cysterny
w mini --biblioteka dane/mini --manifest dane/mini/manifest.json --bez-typu cysterna
w mini-trudny --biblioteka dane/mini-trudny --manifest dane/mini-trudny/manifest.json --bez-typu cysterna
w zero --biblioteka "$Z" --manifest "$Z/manifest.json"
# S12 (A12): obraz 50 MB (poziom pelny, wzorce maly — jak w zadaniu 20)
w duzy --biblioteka "$DANE" --manifest "$DANE/manifest.json" --poziom pelny --poziom-wzorcow maly
# etap 2
set +e
WYNIKI="$WYJ/mini/wyniki.json:dane/mini/manifest.json,$WYJ/mini-trudny/wyniki.json:dane/mini-trudny/manifest.json" \
  python -m unittest testy.test_lista -v > "$WYJ/test_lista.log" 2>&1; echo "test_lista kod $?" >> "$WYJ/test_lista.log"
if command -v node >/dev/null 2>&1; then WYNIKI_LUPA=${WYJ#wyniki/} node testy/test_lupa.mjs > "$WYJ/test_lupa.log" 2>&1; echo "test_lupa kod $?" >> "$WYJ/test_lupa.log"
else echo "brak node na tej maszynie — test_lupa nie uruchomiony" > "$WYJ/test_lupa.log"; fi
python testy/odbior/odbior.py raport --wyj "$WYJ" --wersja "$(git rev-parse --short HEAD 2>/dev/null || echo ?)" --wyjscie "$WYJ/odbior.md"
