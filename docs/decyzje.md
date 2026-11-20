# Decyzje (każdy wpis z godziną z `date +%H:%M`)

10:56 Szef: start próby 17; zadanie w docs/zadanie.md (KAS — anomalie RTG naczep, wzorzec vs badany, .bmp).
10:56 Szef: typ zadania A — wynik mierzony na zbiorze testowym: obrazy „czyste” (fałszywe alarmy) i z „dodatkami” (przeoczenia).
10:56 Szef: dane — własny sztuczny zbiór .bmp (naczepy czyste i z dodatkowym ładunkiem), bo obrazów KAS nie mamy.
10:56 Szef: liczenie — ciężkie tylko na karcie OMENa (--klasa gpu-tlo, GTX 1050 4 GB), nigdy na procesorze; reszta --maszyna dowolna; przebieg na karcie sprawdza ≥ 2 hipotezy naraz.
10:56 Szef: aplikacja pod linkiem bierze wynik z usługi na karcie OMENa (sieć lokalna).
P1 10:56 Paweł: kto jest kim — jakie podpisy urządzeń mają Twoje i Artura wiadomości, i czy ktoś jeszcze dołącza (rola)? — czeka
10:57 Szef: w kontenerze brak klienta ssh — postawiony zastępczy /data/.local/bin/ssh (Python/paramiko); push działa.
10:57 Szef: zadania 01 (generator danych) i 02 (ocena + wynik bazowy) założone w docs/zadania/.
