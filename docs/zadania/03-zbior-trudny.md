# 03 — zbiór trudny (dane)

**Cel:** drugi zestaw sztucznych obrazów, na którym prosta różnica się myli. Ma pokazać, czy ocena odróżnia dobre podejście od złego.
**Wynika z:** P2 (wzorzec typu, a nie tego samego pojazdu: różnice między egzemplarzami tego samego typu), P13 („nakładanie się ładunku” to najczęstsza pomyłka), P4 (przeoczenie gorsze), P12 (partie).
**Zawartość:**
- obrazy czyste z naturalnymi różnicami egzemplarza: przesunięcie, skala, inna jasność skanu, legalny ładunek nakładający się na konstrukcję. Każdy alarm na nich to fałszywy alarm.
- obrazy z dodatkami małymi i schowanymi za ładunkiem.
- manifest w tym samym formacie co `dane/manifest.json`, z polem rodzaju trudności.
**Dowód „gotowe”:** linia w `docs/decyzje.md`: typy, liczba obrazów czystych i z dodatkami, rodzaje trudności, rozmiar, czas generacji, miejsce na flocie. Mały podzbiór w `dane/mini-trudny/`.
**Czego nie ruszać:** `dane/manifest.json`, `dane/mini/` (na nich liczy zadanie 02).
**Pliki:** `dane/generator/`, `dane/manifest-trudny.json`, `dane/mini-trudny/`.
**Gdzie liczy:** `--maszyna dowolna` przez orkiestrator (cała flota). W jednym przebiegu co najmniej dwa warianty trudności.
**Zależy od:** 01. **Równolegle z:** 02.
