# 12 — sonda Z8: kolejność listy

Cel: sprawdzić założenie Z8 z docs/pm/03-discover.md (wiersz Z8 — progi „potwierdza / obala” stamtąd; progi ⚠ mogą się zmienić po P30/P31, liczba się nie zmienia).
Wynika z: P17.
Co policzyć: pozycja pierwszego prawdziwego trafienia; odsetek w pierwszych 3. Metoda: obecna `src/przeswit/wykryj.py` i `ocena/ocena.py` (Programisty) — bez zmian w kodzie.
Dowód „gotowe”: linia `WYNIK: Z8 …` w docs/decyzje.md z liczbą i werdyktem potwierdza / obala / pomiędzy.
Nie ruszać: src/, ocena/ (zmiany metody zgłaszasz Szefowi).
Gdzie liczy: karta OMENa (gpu-tlo); kilka sond wolno w jednym przebiegu (≥ 2 hipotezy na przebieg).
Zależy od: 02 (metoda bazowa), 03. Równolegle z: pozostałe sondy 05–14.
