# 02 — szkielet repo, skrypt oceny, środowisko na karcie, wynik bazowy (krok 0P)
Cel: to, co pewne niezależnie od decyzji ludzi: szkielet repo; skrypt oceny wg docs/zadanie.md §6 (czyste obrazy → liczba fałszywych alarmów; obrazy z dodatkami → liczba przeoczeń, trafienie = wskazane miejsce pokrywa dodatek); środowisko na karcie OMENa; wynik bazowy prostego porównania wzorzec vs badany.
Wynika z: docs/zadanie.md §3, §5, §6, §7.
Dowód „gotowe”: komenda oceny uruchomiona na danych z 01 (albo tymczasowym małym zbiorze) — linia wyniku: fałszywe alarmy X/N, przeoczenia Y/M, czas na obraz.
Czego nie ruszać: generatora (01), docs/pm/.
Pliki: `src/`, `ocena/`, README sekcja uruchomienia (szkic).
Gdzie liczy: karta OMENa (`--klasa gpu-tlo`, GTX 1050 4 GB) — nigdy procesor; każdy przebieg sprawdza ≥ 2 hipotezy naraz.
zależy od: — (dane z 01, do tego czasu tymczasowy mały zbiór)
równolegle z: 01
