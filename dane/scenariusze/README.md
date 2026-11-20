# Dane do scenariuszy odbioru (zadanie 31)

Zestaw sztucznych danych pokrywający wszystkie scenariusze z `docs/pm/06-scenariusze.md` (`S1`–`S14`, `S1_brzegowe`, `S2b`, `demo`).
Pełne mapowanie `scenariusz -> pliki -> oczekiwany wynik` oraz sumy kontrolne SHA-256 znajdują się w `dane/scenariusze/manifest.json`.

## Pliki w repo (`dane/scenariusze/`)
- Uwaga: generator na innej wersji numpy (np. 2.5.x) daje inne bajty niż pliki w `dane/mini`, dlatego kontrola bajtowa jest ostrzeżeniem, a repo trzyma oryginały (`dane/mini`, `dane/mini-trudny`); sha256 plików generowanych poza repo zależą od wersji numpy.
- `manifest.json` — manifest wszystkich 17 pozycji (`S1`–`S14`, `S1_brzegowe`, `S2b`, `demo`), skład partii pokazowej (7 aut), dane udawanego operatora i biblioteki (`pelna`, `bez_cysterny`).
- `nieprawidlowy/` — `plik_tekstowy.bmp` (tekst jako `.bmp`), `uciety.bmp` (poprawny nagłówek BMP, ucięte piksele), `pusty.bmp` (0 B) — dla `S2b` / `E2` (P53 A).
- `czyste_zero/badany_mini_kontener_zero_00.bmp` — czyste auto kontener o zerowej różnicy wobec `dane/mini/wzorzec_mini_kontener_00.bmp` (gwarantowane 0 miejsc w v1/v2/v3 bez zmiany progów) — dla testu ekranu `S3` / `A3` (P58 A). Niezależne czyste auta pod hipotezę H1 i progi P49 są w `dane/mini` i `czyste_p49/`.

## Duże pliki poza repo (`~/dane/scenariusze/`)
Wygenerowane deterministycznie (ziarno 17, host: `ubuntuvg`) poza repo:
- `~/dane/scenariusze/czyste_p49/` — 20 czystych aut `mini` (5 na typ, indeksy `02`–`06`, ~15,7 MB); razem z 8 czystymi w `dane/mini` (`00`–`01`, zgodność SHA-256 sprawdzona) daje 28 czystych aut do zadania 32 (progi P49 A).
- `~/dane/scenariusze/duzy/badany_pelny_kontener_dodatki_00.bmp` — obraz `8192×2048` (`50 331 702 B` ≈ 50,3 MB, 3 dodatki) dla `S12` / `A12` i `S14` / `A14` (bajt-do-bajtu identyczny z `~/dane/proba17/badany_pelny_kontener_dodatki_00.bmp`).

Odtworzenie plików poza repo na dowolnej maszynie (tylko `numpy`, kilka sekund):
```bash
python dane/generator/scenariusze.py --wyj dane/scenariusze --poza ~/dane/scenariusze
```

Nie ruszano `dane/mini` ani `dane/mini-trudny`.

<!-- skill: dummy-dataset -->
