# 09 — sonda Z5: poprawa rodzaju przez operatora

Cel: sprawdzić założenie Z5 z docs/pm/03-discover.md (wiersz Z5 — progi „potwierdza / obala” stamtąd; progi ⚠ mogą się zmienić po P30/P31, liczba się nie zmienia).
Wynika z: P24, P27.
Co policzyć: wymuszony zły rodzaj, potem poprawny: różnica ramek i przeoczeń. Metoda: obecna `src/przeswit/wykryj.py` i `ocena/ocena.py` (Programisty) — bez zmian w kodzie.
Dowód „gotowe”: linia `WYNIK: Z5 …` w docs/decyzje.md z liczbą i werdyktem potwierdza / obala / pomiędzy.
Nie ruszać: src/, ocena/ (zmiany metody zgłaszasz Szefowi).
Gdzie liczy: karta OMENa (gpu-tlo); kilka sond wolno w jednym przebiegu (≥ 2 hipotezy na przebieg).
Zależy od: 02 (metoda bazowa), 03. Równolegle z: pozostałe sondy 05–14.
