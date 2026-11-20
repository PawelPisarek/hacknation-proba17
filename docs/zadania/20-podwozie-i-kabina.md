# 20 — osobne dopasowanie pasów (podwozie, kabina, pudło)

Cel: zejść z przeoczeniami do ≤ 10% na obu zestawach i z ramkami na czystym aucie do ≤ 6 (najpierw przeoczenia).
Wynika z: P4, P26, P30 (≤ 6 ramek), P31 (≥ 90/100), wynik zadania 19 (85f8e1f): ~70% fałszywych ramek to pas podwozia (dolne 20%), dalej kabina; przeoczenia — cienkie przeróbki i skrytki przy podwoziu.
Dowód „gotowe”: linia `WYNIK: zadanie 20 …` w docs/decyzje.md jak w zadaniu 19 (oba zestawy: FP X/N, ramki śr./maks. na czystym, przeoczenia wg rodzaju, czas 50 MB) + porównanie z wynikiem bazowym i 19.
Hipotezy (≥ 2, jeden przebieg na karcie): lokalne przesunięcie per pas/odcinek zamiast jednego na obraz; osobne progi dla podwozia i kabiny; niższy próg (0,05–0,08) na pudle; łączenie z najlepszą konfiguracją v2 (trend, konstr).
Nie ruszać: ocena/ocena.py (zasada trafienia), dane/.
Pliki: src/przeswit/, ocena/.
Gdzie liczy: karta OMENa (gpu-tlo); ocena z plików `--maszyna dowolna`.
Zależy od: 19. Równolegle z: sondy 05–16, łańcuch.
