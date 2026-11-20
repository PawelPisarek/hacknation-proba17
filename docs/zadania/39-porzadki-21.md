# 39 — porządki po zadaniu 21 (usługa i wdrożenie)

Cel: usługa na hacknation.ksefbot.pl przeżywa noc i repo jest czyste. Wynika z recenzji zadania 21 (Programista, wpis 33a555d) i P43 A.

Do zrobienia:
1. Usunąć z repo `usluga/__pycache__/` i dopisać `__pycache__/` do `.gitignore`.
2. `wdroz.sh`: zlecenie usługi robi `touch .` w katalogu roboczym (nocne sprzątanie `~/ork` nie może go usunąć).
3. `wdroz.sh`: zmiana gałęzi w Coolify tylko wtedy, gdy podano `GALAZ` jawnie; domyślnie nie rusza ustawienia.
4. README: jedna sekcja „Testy” — jak puścić testy strony i usługi (komendy).

Dowód „gotowe”: `git ls-files | grep __pycache__` pusty; test_wdroz OK; testy strony 10/10 i usługi OK; https://hacknation.ksefbot.pl/ 200 i `/api/zdrowie` ok po wdrożeniu; wpis w `docs/decyzje.md`.
Czego nie ruszać: metody liczenia, progu doboru, makiety.
Pliki: `.gitignore`, `usluga/`, `wdroz.sh`, README (sekcja „Testy”).
Gdzie liczy: `--maszyna dowolna` (testy usługi na karcie jak w zad. 21).
zależy od: 21
równolegle z: 27, 28, 29
