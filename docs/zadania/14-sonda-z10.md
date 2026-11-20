# 14 — sonda Z10: sztuczne a prawdziwe

Cel: sprawdzić założenie Z10 z docs/pm/03-discover.md (wiersz Z10 — progi „potwierdza / obala” stamtąd; progi ⚠ mogą się zmienić po P30/P31, liczba się nie zmienia).
Wynika z: P26.
Co policzyć: porównanie Z1/Z2 mini vs mini-trudny (bez nowego liczenia). Metoda: obecna `src/przeswit/wykryj.py` i `ocena/ocena.py` (Programisty) — bez zmian w kodzie.
Dowód „gotowe”: linia `WYNIK: Z10 …` w docs/decyzje.md z liczbą i werdyktem potwierdza / obala / pomiędzy.
Nie ruszać: src/, ocena/ (zmiany metody zgłaszasz Szefowi).
Gdzie liczy: --maszyna dowolna; kilka sond wolno w jednym przebiegu (≥ 2 hipotezy na przebieg).
Zależy od: 02 (metoda bazowa), 03, 05, 06, 11. Równolegle z: pozostałe sondy 05–14.
