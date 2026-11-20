# Uruchomienie odbioru A1–A14 (zadanie 30)

Jedno polecenie (z katalogu klona repo; wysyła klon na OMENa, liczy na karcie, wypisuje tabelę A1–A14):

```
ORKIESTRATOR_SSH_OMEN="-i /data/.ssh/omen_hackathon hackathon@192.168.1.112" node /data/orkiestrator-klient/klient/orkiestrator.mjs uruchom --maszyna omen --klasa gpu-tlo --sesja analityk --repo hacknation --rdzenie 2 --konto hackathon --bez-zapasowej --ssh --wyslij . -- sh -c 'touch . && . ~/venv/bin/activate && sh testy/odbior/odbior.sh'
```

Co robi `testy/odbior/odbior.sh`:
1. Karta: metoda v3 (konfiguracja zadania 20, bez zmian) na `dane/mini` i `dane/mini-trudny` z biblioteką bez cysterny (S4), na aucie z zerem miejsc (`dane/scenariusze/czyste_zero`, S3) i na obrazach poziomu pełnego ~50 MB (S12; pomiar czasu).
2. `testy/test_lista.py` (A1 numery i kolejność, A2 kolejność bez słów, A4 brak wzorca, P57 A) na tych wynikach; `testy/test_lupa.mjs` (A1 lupa; gdy na maszynie jest `node`).
3. `testy/odbior/odbior.py raport` składa tabelę A1–A14 z czasem i wersją; kryteria, których kodu jeszcze nie ma (A5–A11, A13, A14), dostają „jeszcze nie ma”. Plik wynikowy: `wyniki/odbior/odbior.md` na OMENie (`rsync` z `ork/<id>/wyniki/odbior/`), kopia z wynikiem w `docs/odbior.md`.

Wymaga: `~/dane/proba17` (zestaw ze wzorcami i obrazami pełnymi) i `dane/scenariusze/czyste_zero` (w repo). Scenariuszy z `docs/pm/06-scenariusze.md` ani metody detekcji skrypt nie zmienia.
