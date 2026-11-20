# 33 — „brak wzorca”: próg jakości doboru

- **Cel:** gdy w bibliotece nie ma wzorca rodzaju badanego auta (np. cysterna), usługa nic nie zaznacza i zwraca „brak wzorca — sprawdź obraz sam”, zamiast przypisać inny rodzaj.
- **Z czego wynika:** A4, P50 A (główna ścieżka: „brak wzorca” blokuje oddanie), spec §2 (cysterny nie ma w bibliotece); Z4 (11:46): dobór 0/10 — v2 dziś nie zwraca „brak wzorca”.
- **Dowód „gotowe”:** `WYNIK: zadanie 33 …` w docs/decyzje.md — ≥ 2 warianty progu jakości doboru; na dane/mini z wyjętymi wzorcami cysterny: cysterny → „brak wzorca” (ile z ilu), pozostałe rodzaje nadal dobrane (ile z 80, porównanie z 79/80).
- **Czego nie ruszać:** metoda wykrywania (zadanie 20); wgrywanie .bmp (P43).
- **Pliki:** kod doboru wzorca, docs/decyzje.md
- **Gdzie liczy:** karta OMENa (--klasa gpu-tlo)
- **zależy od:** —
- **równolegle z:** 20–32
